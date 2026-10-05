// ElevenLabs Voice Changer (speech-to-speech): re-render the creator's own recording through his cloned
// voice. Keeps his words, timing and intonation; output is studio-clean. Costs credits (billed per audio minute).
//   node scripts/voice-changer.mjs day_02 --beats recap,visual [--voice <id>] [--from day_02/rec_clean] [--out <dir>] --confirm
// Input:  public/<from>/<beat>.wav   (default: day_NN/rec_clean, the output of clean-voice.mjs)
// Output: public/day_NN/rec_sts/<beat>.mp3   → then: npm run master -- day_NN --takes-from day_NN/rec_sts
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEpisode, PUBLIC } from "./lib/episode.mjs";

const args = process.argv.slice(2);
const flag = (k) => (args.includes(`--${k}`) ? args[args.indexOf(`--${k}`) + 1] : undefined);
const ep = await loadEpisode(args[0]);
const voiceId = flag("voice") ?? "99SWo5wjrbPpMKuP8Mik"; // Kali – Teacher (Professional Voice Clone, default since 2026-10-04; old instant clone: dEibRDzkMexIgcF5EEiJ)
const fromDir = path.join(PUBLIC, flag("from") ?? `${ep.id}/rec_clean`);
const outDir = flag("out") ? path.resolve(flag("out")) : path.join(ep.publicDir, "rec_sts"); // --out <dir>: tests that must not touch the episode
const beats = (flag("beats") ?? ep.voice.beats.map((b) => b.id).join(",")).split(",");
const confirm = args.includes("--confirm");

const files = beats.map((b) => ({ beat: b, src: path.join(fromDir, `${b}.wav`) })).filter((x) => existsSync(x.src));
const dur = (f) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" }));
const total = files.reduce((n, x) => n + dur(x.src), 0);
console.log(`${ep.id} · voice changer → ${voiceId} · ${files.length} part(s) · ${total.toFixed(1)} s of audio (≈ ${Math.ceil(total / 60 * 1000)} credits)`);
if (!confirm) {
  for (const x of files) console.log(`  ${x.beat.padEnd(11)} ${dur(x.src).toFixed(1)}s`);
  console.log("dry run: add --confirm to call ElevenLabs");
  process.exit(0);
}

await import("dotenv/config");
const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) throw new Error("ELEVENLABS_API_KEY is not set (expected in remotion/.env).");
mkdirSync(outDir, { recursive: true });

for (const x of files) {
  const form = new FormData();
  form.append("audio", new Blob([readFileSync(x.src)], { type: "audio/wav" }), `${x.beat}.wav`);
  form.append("model_id", flag("model") ?? "eleven_multilingual_sts_v2");
  // --similarity 1.0 pushes harder toward the target voice (Day 1 from Viraj's takes still sounded like Viraj).
  form.append("voice_settings", JSON.stringify({ stability: Number(flag("stability") ?? 0.5), similarity_boost: Number(flag("similarity") ?? 0.85), style: 0, use_speaker_boost: true }));
  form.append("remove_background_noise", "false");
  const res = await fetch(`https://api.elevenlabs.io/v1/speech-to-speech/${voiceId}?output_format=mp3_44100_192`, {
    method: "POST",
    headers: { "xi-api-key": apiKey, accept: "audio/mpeg" },
    body: form,
  });
  if (!res.ok) throw new Error(`${x.beat}: ElevenLabs ${res.status} ${await res.text()}`);
  const out = path.join(outDir, `${x.beat}.mp3`);
  writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  console.log(`  ${x.beat.padEnd(11)} → ${path.relative(process.cwd(), out)} (${dur(out).toFixed(1)}s)`);
}
