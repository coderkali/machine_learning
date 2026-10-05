// DAF series: copy the newest render into the creator's folder as the next version.
//
//   node scripts/daf-publish.mjs day_202 Trailer/Part2 DAF_Trailer_Part2 [--final] [--audio]
//
//   → ~/Documents/Instagram_Youtube_Reels/DAF/<dest>/<prefix>_vN.mp4   (N = next free number, never overwrites)
//     + thumbnail.png (if out/day_NN/thumbnail.png exists)
//   --final  marks this version <prefix>_vN_FINAL.mp4 and removes "_FINAL" from any older one (rename, no delete)
//   --audio  copies the mastered narration as audio/<prefix>_vN_audio.mp3 instead of a video (audio-first review)
// Layout rules: ~/Documents/Instagram_Youtube_Reels/DAF/README.md
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadEpisode, readJSON, run, PUBLIC } from "./lib/episode.mjs";

const args = process.argv.slice(2);
const [dayArg, dest, prefix] = args.filter((a) => !a.startsWith("--"));
if (!dest || !prefix) throw new Error("Usage: daf-publish.mjs day_NN <Trailer/Part2|Episodes/DAF-01> <file prefix> [--final] [--audio]");
const ep = await loadEpisode(dayArg);
const dir = path.join(os.homedir(), "Documents", "Instagram_Youtube_Reels", "DAF", dest);
await fs.mkdir(path.join(dir, "audio"), { recursive: true });

// Next version number across videos and audio in this folder.
const names = [...(await fs.readdir(dir)), ...(await fs.readdir(path.join(dir, "audio")))];
const used = names.map((n) => n.match(new RegExp(`^${prefix}_v(\\d+)`))?.[1]).filter(Boolean).map(Number);
const audioOnly = args.includes("--audio");
// An approved audio and its video share one version number.
const lastAudio = Math.max(0, ...names.filter((n) => n.includes("_audio")).map((n) => Number(n.match(/_v(\d+)/)?.[1] ?? 0)));
const hasVideo = (v) => names.some((n) => n.startsWith(`${prefix}_v${v}`) && n.endsWith(".mp4"));
const v = !audioOnly && lastAudio && !hasVideo(lastAudio) ? lastAudio : Math.max(0, ...used) + 1;

if (audioOnly) {
  const master = await readJSON(path.join(ep.genDir, "master.json"));
  const out = path.join(dir, "audio", `${prefix}_v${v}_audio.mp3`);
  await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-i", path.join(PUBLIC, master.audio), "-c:a", "libmp3lame", "-b:a", "192k", out]);
  console.log(`audio → ${out}`);
  process.exit(0);
}

const renders = (await fs.readdir(ep.outDir)).filter((n) => /^episode(_v\d+)?\.mp4$/.test(n));
const ver = (n) => Number(n.match(/_v(\d+)/)?.[1] ?? 1);
const newest = renders.sort((a, b) => ver(b) - ver(a))[0];
if (!newest) throw new Error(`No render in ${ep.outDir}`);

const final = args.includes("--final");
if (final) {
  for (const n of await fs.readdir(dir)) if (n.includes("_FINAL")) await fs.rename(path.join(dir, n), path.join(dir, n.replace("_FINAL", "")));
}
const out = path.join(dir, `${prefix}_v${v}${final ? "_FINAL" : ""}.mp4`);
if (existsSync(out)) throw new Error(`${out} exists — not overwriting`);
await fs.copyFile(path.join(ep.outDir, newest), out);
console.log(`video ${newest} → ${out}`);
const thumb = path.join(ep.outDir, "thumbnail.png");
if (existsSync(thumb)) {
  await fs.copyFile(thumb, path.join(dir, "thumbnail.png"));
  console.log(`thumbnail → ${path.join(dir, "thumbnail.png")}`);
}
console.log(`Add a line for v${v} to ${path.join(dir, "VERSIONS.md")}`);
