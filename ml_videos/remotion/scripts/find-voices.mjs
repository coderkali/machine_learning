// Shortlist voices from the ElevenLabs voice library (free: no characters used) and download their
// preview samples so the creator can pick by ear.
//
//   node scripts/find-voices.mjs [--accent indian] [--language en] [--top 6]
//
// Output: out/voices/<n>_<name>_<gender>.mp3 + out/voices/shortlist.md
import fs from "node:fs/promises";
import path from "node:path";
import "dotenv/config";
import { ROOT, rel } from "./lib/episode.mjs";

const args = process.argv.slice(2);
const opt = (n, d) => (args.includes(`--${n}`) ? args[args.indexOf(`--${n}`) + 1] : d);
const accent = opt("accent", "indian");
const language = opt("language", "en");
const top = Number(opt("top", 6));
const onlyUse = opt("use", null)?.split(","); // e.g. conversational,informative_educational
const onlyGender = opt("gender", null);
const outName = opt("out", "shortlist");
const key = process.env.ELEVENLABS_API_KEY;
if (!key) throw new Error("ELEVENLABS_API_KEY is not set (expected in remotion/.env).");

const GOOD_USE = new Set(["narrative_story", "conversational", "informative_educational", "social_media", "characters_animation"]);
const all = [];
for (let page = 0; page < 3; page++) {
  const url = `https://api.elevenlabs.io/v1/shared-voices?page_size=100&page=${page}&language=${language}&accent=${accent}&sort=cloned_by_count`;
  const res = await fetch(url, { headers: { "xi-api-key": key } });
  if (!res.ok) throw new Error(`voice library request failed (${res.status}): ${await res.text()}`);
  const data = await res.json();
  all.push(...data.voices);
  if (!data.has_more) break;
}
const usable = all.filter(
  (v) => v.preview_url && (onlyUse ? onlyUse.includes(v.use_case) : !v.use_case || GOOD_USE.has(v.use_case)) && (!onlyGender || v.gender === onlyGender),
);
// Most-used first, but keep a mix of genders.
usable.sort((a, b) => (b.cloned_by_count ?? 0) - (a.cloned_by_count ?? 0));
const pick = [];
for (const g of onlyGender ? [onlyGender] : ["male", "female"]) pick.push(...usable.filter((v) => v.gender === g).slice(0, onlyGender ? top : Math.ceil(top / 2)));
pick.sort((a, b) => (b.cloned_by_count ?? 0) - (a.cloned_by_count ?? 0));

const dir = path.join(ROOT, "out", "voices", outName);
await fs.mkdir(dir, { recursive: true });
const lines = [`# Voice shortlist — accent: ${accent}, language: ${language}`, "", `${all.length} voices found; ${usable.length} suit narration. Listen to the mp3s next to this file.`, "", "| # | Name | Gender · age | Style | Used by | Free-plan OK | Voice ID | Sample |", "|---|---|---|---|---|---|---|---|"];
for (const [i, v] of pick.entries()) {
  const file = `${i + 1}_${v.name.replace(/[^a-z0-9]+/gi, "_").slice(0, 30)}_${v.gender}.mp3`;
  const audio = await fetch(v.preview_url);
  if (audio.ok) await fs.writeFile(path.join(dir, file), Buffer.from(await audio.arrayBuffer()));
  lines.push(`| ${i + 1} | ${v.name} | ${v.gender} · ${v.age ?? "?"} | ${[v.use_case, v.descriptive].filter(Boolean).join(", ")} | ${v.cloned_by_count ?? 0} | ${v.free_users_allowed ? "yes" : "no"} | \`${v.voice_id}\` | ${audio.ok ? file : "—"} |`);
  if (v.description) lines.push(`| | | | ${v.description.replace(/\|/g, "/").replace(/\s+/g, " ").slice(0, 160)} | | | | |`);
}
await fs.writeFile(path.join(dir, "shortlist.md"), lines.join("\n") + "\n");
console.log(lines.slice(4).join("\n"));
console.log(`\n→ ${rel(dir)}/`);
