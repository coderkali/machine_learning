// 0.4 — Master the narration: trim each chosen take, stitch with the VOICE_GUIDE gap rules,
// optionally duck a music bed under it, and bring it to −14 LUFS / −1 dBTP.
//
//   node scripts/master.mjs day_01                              uses each beat's "chosen" take from voice.json
//   node scripts/master.mjs day_01 --takes-from day01/audio_v2  test: uses <public dir>/<beat id>.mp3|wav instead
//   node scripts/master.mjs day_01 --music day01/audio_v2_final/music_bed.wav [--music-lufs -26]
//   node scripts/master.mjs day_01 --beats hook,rules,shift     sample: only these beats
//
// Output: public/day_NN/mix/narration.wav (never overwritten: _v2, _v3, …)
//         src/episodes/day_NN/generated/master.json (beat timestamps in seconds; read by captions/timeline)
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { PUBLIC, duration, gapBefore, loadEpisode, loudness, nextFreePath, publicRel, rel, run, writeJSON } from "./lib/episode.mjs";

const TARGET_LUFS = -14;
const MAX_TRUE_PEAK = -1;
const SAMPLE_RATE = 48000;
const SILENCE_DB = "-45dB";

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};
const ep = await loadEpisode(args[0]);
const takesFrom = flag("takes-from");
const music = flag("music");
const musicLufs = Number(flag("music-lufs") ?? TARGET_LUFS - 12);
// --beats hook,rules,shift → master only these beats (a short sample before the full episode).
const onlyBeats = flag("beats")?.split(",").map((b) => b.trim());
const minGap = Number(flag("min-gap") ?? 0);
if (onlyBeats) ep.voice.beats = ep.voice.beats.filter((b) => onlyBeats.includes(b.id));

const work = await fs.mkdtemp(path.join(os.tmpdir(), `${ep.id}-master-`));

const sourceFor = (beat) => {
  if (takesFrom) {
    const hit = ["mp3", "wav"].map((ext) => path.join(PUBLIC, takesFrom, `${beat.id}.${ext}`)).find((p) => existsSync(p));
    if (!hit) throw new Error(`--takes-from: no ${beat.id}.mp3/.wav in public/${takesFrom}`);
    return hit;
  }
  if (!beat.chosen) return null;
  return path.join(PUBLIC, beat.chosen);
};

const missing = ep.voice.beats.filter((b) => !sourceFor(b));
if (missing.length) {
  throw new Error(`No chosen take for: ${missing.map((b) => b.id).join(", ")}. Pick with: node scripts/voice.mjs ${ep.id} <beat> --pick <file>`);
}

// 1. Trim the silence the TTS model adds at both ends of every take.
const trimFilter = [
  `silenceremove=start_periods=1:start_threshold=${SILENCE_DB}:start_silence=0.03`,
  "areverse",
  `silenceremove=start_periods=1:start_threshold=${SILENCE_DB}:start_silence=0.05`,
  "areverse",
].join(",");

const beats = [];
let t = ep.voice.leadIn ?? 0.1;
for (const [i, beat] of ep.voice.beats.entries()) {
  const source = sourceFor(beat);
  const trimmed = path.join(work, `${beat.id}.wav`);
  await run("ffmpeg", ["-y", "-i", source, "-af", trimFilter, "-ar", String(SAMPLE_RATE), "-ac", "1", "-c:a", "pcm_s16le", trimmed]);
  const len = await duration(trimmed);
  // --min-gap: own-voice episodes need a breath between parts (0.25 s felt like a hard cut, creator 2026-10-04).
  const gap = i === 0 ? 0 : Math.max(beat.gapBefore ?? gapBefore(beat.type), minGap + (beat.type === "insight" ? 0.3 : 0));
  t += gap;
  const speechStart = t;
  t += len;
  beats.push({
    id: beat.id,
    type: beat.type,
    source: publicRel(source),
    rawDuration: +(await duration(source)).toFixed(3),
    trimmedDuration: +len.toFixed(3),
    gapBefore: gap,
    speechStart: +speechStart.toFixed(3),
    speechEnd: +t.toFixed(3),
    holdAfter: beat.holdAfter ?? 0,
    file: trimmed,
  });
  t += beat.holdAfter ?? 0;
}
const total = +(t + (ep.voice.endHold ?? 1.5)).toFixed(3);

// 2. Stitch: each beat delayed to its start time, summed, padded to the full length.
const stem = path.join(work, "stem.wav");
const inputs = beats.flatMap((b) => ["-i", b.file]);
// Short fades on every take: ElevenLabs v3 sometimes ends a take mid-word (a hard cut = audible click).
const FADE_IN = 0.01, FADE_OUT = 0.08;
const fades = (b) => `afade=t=in:d=${FADE_IN},afade=t=out:st=${Math.max(0, b.trimmedDuration - FADE_OUT).toFixed(3)}:d=${FADE_OUT}`;
const delays = beats.map((b, i) => `[${i}]${fades(b)},adelay=${Math.round(b.speechStart * 1000)}:all=1[a${i}]`).join(";");
const mixIn = beats.map((_, i) => `[a${i}]`).join("");
await run("ffmpeg", [
  "-y",
  ...inputs,
  "-filter_complex",
  `${delays};${mixIn}amix=inputs=${beats.length}:normalize=0:dropout_transition=0,apad=whole_dur=${total},atrim=0:${total}[out]`,
  "-map", "[out]", "-ar", String(SAMPLE_RATE), "-ac", "1", "-c:a", "pcm_s16le", stem,
]);

// 3. Loudness: gain to target, then a true-peak-safe limiter (4× oversampled). Repeat until within ±0.3 LU.
async function normalize(input, output) {
  let gain = 0;
  let current = input;
  for (let pass = 1; pass <= 4; pass++) {
    const measured = await loudness(current);
    if (pass > 1 && Math.abs(measured.lufs - TARGET_LUFS) <= 0.3 && measured.truePeak <= MAX_TRUE_PEAK) {
      await fs.copyFile(current, output);
      return measured;
    }
    gain += TARGET_LUFS - measured.lufs;
    const next = path.join(work, `norm_${path.basename(output, ".wav")}_${pass}.wav`);
    await run("ffmpeg", [
      "-y", "-i", input, "-af",
      `volume=${gain.toFixed(2)}dB,aresample=${SAMPLE_RATE * 4},alimiter=limit=${Math.pow(10, (MAX_TRUE_PEAK - 0.7) / 20).toFixed(4)}:attack=3:release=60:level=0,aresample=${SAMPLE_RATE}`,
      "-ar", String(SAMPLE_RATE), "-c:a", "pcm_s16le", next,
    ]);
    current = next;
  }
  await fs.copyFile(current, output);
  return loudness(output);
}

const voiceNorm = path.join(work, "voice_norm.wav");
let stats = await normalize(stem, voiceNorm);
let finalSource = voiceNorm;

// 4. Optional music bed: level it to musicLufs, duck it under the voice, re-check loudness.
if (music) {
  const musicPath = path.join(PUBLIC, music);
  if (!existsSync(musicPath)) throw new Error(`Music bed not found: public/${music}`);
  const m = await loudness(musicPath);
  const musicGain = musicLufs - m.lufs;
  const mixed = path.join(work, "with_music.wav");
  await run("ffmpeg", [
    "-y", "-i", voiceNorm, "-stream_loop", "-1", "-i", musicPath, "-filter_complex",
    [
      `[0]asplit=2[v][key]`,
      `[1]aformat=channel_layouts=mono,aresample=${SAMPLE_RATE},volume=${musicGain.toFixed(2)}dB,atrim=0:${total},afade=t=out:st=${Math.max(0, total - 1.5)}:d=1.5[m]`,
      `[m][key]sidechaincompress=threshold=0.02:ratio=6:attack=15:release=350[md]`,
      `[v][md]amix=inputs=2:normalize=0:duration=first[out]`,
    ].join(";"),
    "-map", "[out]", "-ar", String(SAMPLE_RATE), "-ac", "1", "-c:a", "pcm_s16le", mixed,
  ]);
  finalSource = path.join(work, "final.wav");
  stats = await normalize(mixed, finalSource);
}

await fs.mkdir(path.join(ep.publicDir, "mix"), { recursive: true });
const out = nextFreePath(path.join(ep.publicDir, "mix"), "narration", ".wav");
await fs.copyFile(finalSource, out);
// With music: also keep the voice-only master, so captions/QA transcribe the voice, not voice + music.
let voiceOnly = null;
if (music) {
  voiceOnly = out.replace(/\.wav$/, "_voice.wav");
  await fs.copyFile(voiceNorm, voiceOnly);
}
const final = await loudness(out);

const master = {
  day: ep.n,
  audio: publicRel(out),
  voiceAudio: voiceOnly ? publicRel(voiceOnly) : null,
  durationSec: +(await duration(out)).toFixed(3),
  sampleRate: SAMPLE_RATE,
  lufs: final.lufs,
  truePeak: final.truePeak,
  leadIn: ep.voice.leadIn ?? 0.1,
  endHold: ep.voice.endHold ?? 1.5,
  music: music ?? null,
  takesFrom: takesFrom ?? null,
  createdAt: new Date().toISOString(),
  beats: beats.map(({ file: _file, ...b }) => b),
};
await writeJSON(path.join(ep.genDir, "master.json"), master);
await fs.rm(work, { recursive: true, force: true });

console.log(`${ep.id} master → ${rel(out)}`);
console.log(`  ${master.durationSec}s · ${final.lufs} LUFS · ${final.truePeak} dBTP${music ? ` · music ${music} at ${musicLufs} LUFS, ducked` : ""}`);
for (const b of master.beats) {
  console.log(`  ${b.id.padEnd(11)} gap ${b.gapBefore.toFixed(2)}  ${b.speechStart.toFixed(2)}–${b.speechEnd.toFixed(2)}s  (take ${b.rawDuration}s → trimmed ${b.trimmedDuration}s)`);
}
console.log(`  → ${rel(path.join(ep.genDir, "master.json"))}`);
