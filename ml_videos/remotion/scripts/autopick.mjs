// Pick the best take per beat automatically (the creator reviews the final video instead of every take).
//
//   node scripts/autopick.mjs day_01 [--model v3] [--beats hook,takeaway] [--force]
//   Beats picked by hand (voice.mjs --pick) are kept unless --force.
//
// For every take in public/day_NN/takes/ of each beat: local Whisper transcript → score against the
// beat's script text. Score = words said as written − 2 × (missing + extra words) − long inner pauses.
// Extra words catch v3 reading an emotion tag out loud ("curious", "sighs"). Ties → the take whose
// length is closest to the median (avoids rushed or dragged reads). Writes chosen + seed into
// voice.json and a report to out/day_NN/takes_report.md.
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { toCaptions, transcribe } from "@remotion/install-whisper-cpp";
import { PUBLIC, ROOT, duration, loadEpisode, readJSON, rel, run, writeJSON } from "./lib/episode.mjs";

const args = process.argv.slice(2);
const ep = await loadEpisode(args[0]);
const model = args.includes("--model") ? args[args.indexOf("--model") + 1] : ep.voice.voice.model ?? "v3";
const onlyBeats = args.includes("--beats") ? args[args.indexOf("--beats") + 1].split(",") : null;
const takesDir = path.join(ep.publicDir, "takes");
const log = existsSync(path.join(takesDir, "takes.json")) ? await readJSON(path.join(takesDir, "takes.json")) : [];
const work = await fs.mkdtemp(path.join(os.tmpdir(), `${ep.id}-autopick-`));

const norm = (w) => w.toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9]/g, "");
const words = (t) => t.split(/\s+/).map(norm).filter(Boolean);

/** Longest common subsequence length of two word lists. */
function lcs(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Uint16Array(b.length + 1));
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[a.length][b.length];
}

async function hear(file) {
  const wav = path.join(work, path.basename(file) + ".wav");
  await run("ffmpeg", ["-y", "-v", "error", "-i", file, "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", wav]);
  const out = await transcribe({ inputPath: wav, whisperPath: path.join(ROOT, "whisper.cpp"), whisperCppVersion: "1.6.0", model: "small.en", tokenLevelTimestamps: true, splitOnWord: true, printOutput: false });
  return toCaptions({ whisperCppOutput: out }).captions.filter((c) => !/^\s*\[.*\]\s*$/.test(c.text) && norm(c.text));
}

const report = [`# Take report — ${ep.id} (${model})`, "", "| Beat | Take | Score | Said as written | Missing | Extra | Longest pause | Length | Heard |", "|---|---|---|---|---|---|---|---|---|"];
for (const beat of ep.voice.beats) {
  if (onlyBeats && !onlyBeats.includes(beat.id)) continue;
  if (beat.pickedBy === "manual" && beat.chosen && !args.includes("--force")) {
    console.log(`${beat.id.padEnd(11)} → kept manual pick ${path.basename(beat.chosen)} (use --force to re-score)`);
    continue;
  }
  const takes = log.filter((t) => t.beat === beat.id && t.model.includes(model === "v3" ? "v3" : "multilingual_v2") && existsSync(path.join(PUBLIC, t.file)));
  if (!takes.length) {
    console.log(`${beat.id}: no ${model} takes — skipped`);
    continue;
  }
  const script = words(beat.text);
  const scored = [];
  for (const t of takes) {
    const file = path.join(PUBLIC, t.file);
    const heard = await hear(file);
    const said = words(heard.map((c) => c.text).join(" "));
    const common = lcs(script, said);
    const missing = script.length - common;
    const extra = said.length - common;
    const gaps = heard.slice(1).map((c, i) => (c.startMs - heard[i].endMs) / 1000);
    const longestPause = Math.max(0, ...gaps);
    const score = common - 2 * (missing + extra) - Math.max(0, longestPause - 1.4) * 4;
    scored.push({ t, score, common, missing, extra, longestPause, len: await duration(file), heardText: heard.map((c) => c.text.trim()).join(" ") });
  }
  const lens = scored.map((s) => s.len).sort((a, b) => a - b);
  const median = lens[Math.floor(lens.length / 2)];
  scored.sort((a, b) => b.score - a.score || Math.abs(a.len - median) - Math.abs(b.len - median));
  const best = scored[0];
  beat.chosen = best.t.file;
  beat.seed = best.t.seed;
  for (const s of scored) {
    report.push(`| ${beat.id} | ${s === best ? "**" + path.basename(s.t.file) + " ✓**" : path.basename(s.t.file)} | ${s.score.toFixed(1)} | ${s.common}/${script.length} | ${s.missing} | ${s.extra} | ${s.longestPause.toFixed(2)}s | ${s.len.toFixed(1)}s | ${s.heardText.replace(/\|/g, "/")} |`);
  }
  console.log(`${beat.id.padEnd(11)} → ${path.basename(best.t.file)}  (${best.common}/${script.length} words, missing ${best.missing}, extra ${best.extra}, ${best.len.toFixed(1)}s)`);
}
await writeJSON(path.join(ep.srcDir, "voice.json"), ep.voice);
await fs.mkdir(ep.outDir, { recursive: true });
await fs.writeFile(path.join(ep.outDir, "takes_report.md"), report.join("\n") + "\n");
await fs.rm(work, { recursive: true, force: true });
console.log(`\nchosen takes saved in voice.json · report → ${rel(path.join(ep.outDir, "takes_report.md"))}`);
