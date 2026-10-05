// Prepare recordings for an ElevenLabs Professional Voice Clone upload.
//   node scripts/pvc-prep.mjs <in-folder> <out-folder> [--max-pause 1.0] [--keep-pause 0.6]
// Light touch on purpose (the clone should learn the real voice): shorten only long silences (inside detected
// silence, never over speech), rumble cut, level to −20 LUFS / −3 dBTP, 320 kbps MP3. Prints before/after minutes.
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, readdirSync } from "node:fs";
import path from "node:path";

const [inDir, outDir] = process.argv.slice(2);
const flag = (k, d) => (process.argv.includes(`--${k}`) ? Number(process.argv[process.argv.indexOf(`--${k}`) + 1]) : d);
const MAX = flag("max-pause", 1.0);
const KEEP = flag("keep-pause", 0.6);
mkdirSync(outDir, { recursive: true });
const dur = (f) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" }));
let before = 0, after = 0;
for (const file of readdirSync(inDir).filter((f) => /\.(m4a|wav|mp3|qta|aif|aiff)$/i.test(f)).sort()) {
  const src = path.join(inDir, file);
  const d = dur(src);
  const log = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", src, "-map", "0:a:0", "-af", "silencedetect=noise=-50dB:d=0.3", "-f", "null", "-"], { encoding: "utf8" }).stderr;
  const starts = [...log.matchAll(/silence_start: (-?[\d.]+)/g)].map((m) => Math.max(0, Number(m[1])));
  const ends = [...log.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
  const cuts = [];
  starts.forEach((s, i) => {
    const e = ends[i] ?? d;
    if (s <= 0.01) cuts.push([0, Math.max(0, e - 0.2)]);
    else if (e >= d - 0.01) cuts.push([s + 0.4, d]);
    else if (e - s > MAX) cuts.push([s + KEEP / 2, e - KEEP / 2]);
  });
  const keep = [];
  let t = 0;
  for (const [s, e] of cuts) {
    if (s - t > 0.02) keep.push([t, s]);
    t = Math.max(t, e);
  }
  if (d - t > 0.02) keep.push([t, d]);
  const F = 0.02;
  const parts = keep.map(([s, e], i) => `[0:a:0]atrim=${s.toFixed(3)}:${e.toFixed(3)},asetpts=PTS-STARTPTS,afade=t=in:d=${F},afade=t=out:st=${Math.max(0, e - s - F).toFixed(3)}:d=${F}[p${i}]`);
  const graph = `${parts.join(";")};${keep.map((_, i) => `[p${i}]`).join("")}concat=n=${keep.length}:v=0:a=1,highpass=f=70,loudnorm=I=-20:TP=-3:LRA=11[out]`;
  const out = path.join(outDir, file.replace(/\.[^.]+$/, ".mp3"));
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", src, "-filter_complex", graph, "-map", "[out]", "-ar", "44100", "-ac", "1", "-b:a", "320k", out]);
  const a = dur(out);
  before += d;
  after += a;
  console.log(`${file.padEnd(14)} ${(d / 60).toFixed(2)} → ${(a / 60).toFixed(2)} min`);
}
console.log(`TOTAL ${(before / 60).toFixed(1)} → ${(after / 60).toFixed(1)} min  → ${outDir}`);
