// Clean the creator's own recordings (one file per part) into episode-ready takes.
//   node scripts/clean-voice.mjs day_02 --from ~/Documents/Instagram_Youtube_Reels/Recodings/Day2 --map Hook=hook,Problem=problem
//   --cut recap=15.31-15.67+20.70-24.2   remove exact ranges (seconds in the raw file) — e.g. a stray word or a sign-off
// Output: public/day_NN/rec_clean/<beat>.wav  (then: npm run master -- day_NN --takes-from day_NN/rec_clean)
//
// Same chain every episode (channel identity): rumble cut → light denoise → EQ (less boom, more clarity)
// → de-ess → gentle compression → limiter. Pauses are shortened only inside detected silences
// (never by an energy gate over speech), with 15 ms fades on every join so cuts are inaudible.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import { loadEpisode } from "./lib/episode.mjs";

const args = process.argv.slice(2);
const flag = (k) => (args.includes(`--${k}`) ? args[args.indexOf(`--${k}`) + 1] : undefined);
const ep = await loadEpisode(args[0]);
const from = flag("from");
if (!from || !existsSync(from)) throw new Error("--from <folder with the recordings> is required");
const map = Object.fromEntries((flag("map") ?? "").split(",").filter(Boolean).map((p) => p.split("=")));

// --cut beat=a-b+c-d,beat2=… → extra ranges to remove from that beat's raw recording.
const extraCuts = Object.fromEntries((flag("cut") ?? "").split(",").filter(Boolean).map((p) => {
  const [beat, ranges] = p.split("=");
  return [beat, ranges.split("+").map((r) => r.split("-").map(Number))];
}));
const MAX_PAUSE = Number(flag("max-pause") ?? 0.45); // longer silences get shortened …
const KEEP_PAUSE = Number(flag("keep-pause") ?? 0.32); // … to this length
const SILENCE_DB = -40;
const CHAIN = "highpass=f=80,afftdn=nf=-60,equalizer=f=200:t=q:w=1:g=-1.5,equalizer=f=3500:t=q:w=1.2:g=3,deesser,acompressor=threshold=-24dB:ratio=3:attack=10:release=120:makeup=4,alimiter=limit=0.9";

const outDir = path.join(ep.publicDir, "rec_clean");
mkdirSync(outDir, { recursive: true });
const probe = (f) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" }));

for (const file of readdirSync(from).filter((f) => /\.(m4a|wav|mp3|aac|caf|qta)$/i.test(f))) {
  const base = file.replace(/\.[^.]+$/, "");
  const beat = map[base] ?? base.toLowerCase();
  if (!ep.voice.beats.some((b) => b.id === beat)) {
    console.log(`skip ${file}: no beat "${beat}" in voice.json (use --map ${base}=<beatId>)`);
    continue;
  }
  const src = path.join(from, file);
  const dur = probe(src);
  // Silence threshold adapts to the room: 10 dB above this recording's noise floor (min −40, max −28 dB),
  // so a noisy take (fan, AC) still gets its pauses detected.
  const st = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", src, "-af", "astats=measure_overall=Noise_floor:measure_perchannel=0", "-f", "null", "-"], { encoding: "utf8" }).stderr;
  const floor = Number((st.match(/Noise floor dB: (-?[\d.]+)/) ?? [])[1] ?? -60);
  const thr = Math.min(-28, Math.max(SILENCE_DB, Math.round(floor + 10)));
  // Silences on the raw recording: [start, end] pairs.
  const log = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", src, "-af", `silencedetect=noise=${thr}dB:d=0.1`, "-f", "null", "-"], { encoding: "utf8" }).stderr;
  const starts = [...log.matchAll(/silence_start: (-?[\d.]+)/g)].map((m) => Math.max(0, Number(m[1])));
  const ends = [...log.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
  const silences = starts.map((s, i) => [s, ends[i] ?? dur]);
  // Keep everything except: leading/trailing silence (keep 0.08 s) and the middle of long pauses.
  const cuts = [];
  for (const [s, e] of silences) {
    if (s <= 0.01) cuts.push([0, Math.max(0, e - 0.08)]);
    else if (e >= dur - 0.01) cuts.push([s + 0.12, dur]);
    else if (e - s > MAX_PAUSE) cuts.push([s + KEEP_PAUSE / 2, e - KEEP_PAUSE / 2]);
  }
  for (const r of extraCuts[beat] ?? []) cuts.push(r);
  const keep = [];
  let t = 0;
  for (const [s, e] of cuts.sort((a, b) => a[0] - b[0])) {
    if (s - t > 0.02) keep.push([t, s]);
    t = Math.max(t, e);
  }
  if (dur - t > 0.02) keep.push([t, dur]);
  const F = 0.015;
  const parts = keep.map(([s, e], i) => `[0]atrim=${s.toFixed(3)}:${e.toFixed(3)},asetpts=PTS-STARTPTS,afade=t=in:d=${F},afade=t=out:st=${Math.max(0, e - s - F).toFixed(3)}:d=${F}[p${i}]`);
  const graph = `${parts.join(";")};${keep.map((_, i) => `[p${i}]`).join("")}concat=n=${keep.length}:v=0:a=1,${CHAIN}[out]`;
  const out = path.join(outDir, `${beat}.wav`);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", src, "-filter_complex", graph, "-map", "[out]", "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", out]);
  const removed = cuts.reduce((n, [s, e]) => n + (e - s), 0);
  console.log(`${beat.padEnd(11)} ${file}: ${dur.toFixed(2)}s → ${probe(out).toFixed(2)}s  (${cuts.length} pauses/edges trimmed, ${removed.toFixed(2)}s removed, silence < ${thr} dB)`);
}
console.log(`→ ${path.relative(process.cwd(), outDir)}   next: npm run master -- ${ep.id} --takes-from ${ep.id}/rec_clean`);
