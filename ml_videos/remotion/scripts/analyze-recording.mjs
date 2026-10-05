// Analyze the creator's own recordings (one file per part) before cleanup:
// loudness, peaks, background noise, pace, pauses, and a word-by-word transcript with confidence.
//   node scripts/analyze-recording.mjs <folder with part files> [--out report.json]
// Reads only; writes a 16 kHz mono copy of each file to a temp folder for Whisper.
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { toCaptions, transcribe } from "@remotion/install-whisper-cpp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const dir = process.argv[2];
if (!dir) throw new Error("usage: node scripts/analyze-recording.mjs <folder>");
const outArg = process.argv.includes("--out") ? process.argv[process.argv.indexOf("--out") + 1] : null;
const tmp = mkdtempSync(path.join(os.tmpdir(), "rec-"));

const ff = (args) => execFileSync("ffmpeg", ["-hide_banner", "-nostats", ...args], { stdio: "ignore" });
/** ffmpeg's analysis filters print to stderr. */
const stderrOf = (args) => spawnSync("ffmpeg", ["-hide_banner", "-nostats", ...args], { encoding: "utf8" }).stderr;

const results = [];
for (const file of readdirSync(dir).filter((f) => /\.(m4a|wav|mp3|aac|caf|qta)$/i.test(f)).sort()) {
  const src = path.join(dir, file);
  const loud = stderrOf(["-i", src, "-af", "loudnorm=print_format=json", "-f", "null", "-"]);
  const j = JSON.parse(loud.slice(loud.lastIndexOf("{"), loud.lastIndexOf("}") + 1));
  const stats = stderrOf(["-i", src, "-af", "astats=measure_overall=Peak_level+Noise_floor+RMS_level:measure_perchannel=0", "-f", "null", "-"]);
  const pick = (k) => Number((stats.match(new RegExp(`${k}: (-?[\\d.]+|-inf)`)) ?? [])[1]);
  const sil = [...stderrOf(["-i", src, "-af", "silencedetect=noise=-38dB:d=0.35", "-f", "null", "-"]).matchAll(/silence_duration: ([\d.]+)/g)].map((m) => Number(m[1]));
  const wav = path.join(tmp, file.replace(/\.[^.]+$/, ".wav"));
  // 1.5 s of padding: Whisper drops the last word when a recording ends right after it.
  ff(["-y", "-i", src, "-af", "apad=pad_dur=1.5", "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", wav]);
  const dur = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src], { encoding: "utf8" }));
  const out = await transcribe({ inputPath: wav, whisperPath: path.join(ROOT, "whisper.cpp"), whisperCppVersion: "1.6.0", model: "small.en", tokenLevelTimestamps: true, splitOnWord: true, printOutput: false });
  const caps = toCaptions({ whisperCppOutput: out }).captions.filter((c) => c.text.trim() && !/^\s*\[.*\]\s*$/.test(c.text));
  const words = caps.map((c) => ({ w: c.text.trim(), s: c.startMs / 1000, e: c.endMs / 1000, p: c.confidence ?? null }));
  const speech = words.length ? words[words.length - 1].e - words[0].s : 0;
  results.push({
    file, duration: +dur.toFixed(2), lufs: Number(j.input_i), truePeak: Number(j.input_tp), lra: Number(j.input_lra),
    rmsDb: pick("RMS level dB"), noiseFloorDb: pick("Noise floor dB"),
    words: words.length, wpm: speech ? Math.round((words.length / speech) * 60) : 0,
    leadSilence: words[0]?.s ?? null, tailSilence: words.length ? +(dur - words[words.length - 1].e).toFixed(2) : null,
    pauses: sil.filter((d) => d < dur - 0.1).map((d) => +d.toFixed(2)),
    lowConfidence: words.filter((w) => w.p !== null && w.p < 0.6).map((w) => `${w.w}@${w.s.toFixed(1)}s(${w.p.toFixed(2)})`),
    text: words.map((w) => w.w).join(" "),
    timed: words,
  });
}
for (const r of results) {
  console.log(`\n== ${r.file}  ${r.duration}s · ${r.words} words · ${r.wpm} wpm · ${r.lufs} LUFS · peak ${r.truePeak} dBTP · noise ${r.noiseFloorDb} dB · LRA ${r.lra}`);
  console.log(`   lead ${r.leadSilence?.toFixed(2)}s · tail ${r.tailSilence}s · pauses ${JSON.stringify(r.pauses)}`);
  console.log(`   low-confidence: ${r.lowConfidence.join(", ") || "none"}`);
  console.log(`   heard: ${r.text}`);
}
if (outArg) writeFileSync(outArg, JSON.stringify(results, null, 2));
