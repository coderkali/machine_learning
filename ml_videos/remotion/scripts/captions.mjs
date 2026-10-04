// 0.5 — Captions from what was actually said: local Whisper (small.en) word timestamps, aligned to
// the script text in voice.json. The script is the source of truth for spelling; Whisper only
// provides timing. Every word Whisper heard differently (or not at all) is printed.
//
//   node scripts/captions.mjs day_01 [--strict]     (--strict: exit 1 if any word mismatches)
//
// Reads:  src/episodes/day_NN/generated/master.json (+ the narration wav it points to)
// Writes: src/episodes/day_NN/generated/captions.json, whisper.json
//
// Options: --script <file.json>  [{ id, text }] replaces those beats' text (e.g. a prototype built on
//                                older audio that says different words); other beats keep voice.json text
//          --tag <name>          writes captions.<name>.json instead, so the real captions stay untouched
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { toCaptions, transcribe } from "@remotion/install-whisper-cpp";
import { PUBLIC, ROOT, loadEpisode, readJSON, rel, run, writeJSON } from "./lib/episode.mjs";

const layout = await readJSON(path.join(ROOT, "src/shared/layout.json"));
const { maxWords, maxChars } = layout.caption;
const PAUSE_BREAK_MS = 400;

const args = process.argv.slice(2);
const opt = (name) => (args.includes(`--${name}`) ? args[args.indexOf(`--${name}`) + 1] : undefined);
const ep = await loadEpisode(args[0]);
const tag = opt("tag");
const outName = tag ? `captions.${tag}.json` : "captions.json";
const scriptOverride = opt("script") ? Object.fromEntries((await readJSON(path.resolve(opt("script")))).map((b) => [b.id, b.text])) : {};
const master = await readJSON(path.join(ep.genDir, "master.json"));

// 1. Whisper word timestamps, transcribed PER BEAT (16 kHz mono, 1.5 s padding): on a long mix whisper.cpp
//    sometimes squeezes a sentence's timestamps (Intro 2026-10-03: 15 words stamped into 2.4 s), and it drops a
//    final word that ends right at the file edge. Short padded clips fix both. Times are offset back to the mix.
const work = await fs.mkdtemp(path.join(os.tmpdir(), `${ep.id}-captions-`));
const voicePath = path.join(PUBLIC, master.voiceAudio ?? master.audio);
const heard = [];
for (const b of master.beats) {
  const from = Math.max(0, b.speechStart - 0.15);
  const to = b.speechEnd + 0.25;
  const clip = path.join(work, `${b.id}.wav`);
  await run("ffmpeg", ["-y", "-ss", from.toFixed(3), "-to", to.toFixed(3), "-i", voicePath, "-af", "apad=pad_dur=1.5", "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", clip]);
  const out = await transcribe({
    inputPath: clip,
    whisperPath: path.join(ROOT, "whisper.cpp"),
    whisperCppVersion: "1.6.0",
    model: "small.en",
    tokenLevelTimestamps: true,
    splitOnWord: true,
    printOutput: false,
  });
  for (const c of toCaptions({ whisperCppOutput: out }).captions) {
    const text = c.text.trim();
    if (/^\[.*\]$/.test(text) || norm(text) === "") continue;
    const startMs = c.startMs + from * 1000;
    if (startMs > to * 1000) continue; // hallucination inside the padding
    heard.push({ text, startMs, endMs: Math.min(c.endMs + from * 1000, to * 1000) });
  }
}
await fs.rm(work, { recursive: true, force: true });
await writeJSON(path.join(ep.genDir, "whisper.json"), { audio: master.audio, words: heard });

// 2. Script words, tagged with their beat.
const mastered = new Set(master.beats.map((b) => b.id)); // a sample master may hold only some beats
const script = ep.voice.beats.filter((b) => mastered.has(b.id)).flatMap((beat) =>
  (scriptOverride[beat.id] ?? beat.text).split(/\s+/).filter(Boolean).map((text) => ({ text, beatId: beat.id })),
);

function norm(word) {
  const NUM = { 0: "zero", 1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten" };
  const w = word.toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9]/g, "");
  return NUM[w] ?? w;
}

function similarity(a, b) {
  if (a === b) return 1;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return 1 - dp[a.length][b.length] / Math.max(a.length, b.length, 1);
}

// 3. Global alignment (Needleman–Wunsch) with 1:2 and 2:1 merges, so "if-statement" can match
//    Whisper's "if" + "statement" and vice versa.
const S = script.map((w) => norm(w.text));
const Hn = heard.map((w) => norm(w.text));
const score = (a, b) => (a === b ? 2 : similarity(a, b) >= 0.75 ? 1 : -1);
const GAP = -1;
const n = S.length;
const m = Hn.length;
const D = Array.from({ length: n + 1 }, () => new Float64Array(m + 1));
const P = Array.from({ length: n + 1 }, () => new Array(m + 1));
for (let i = 1; i <= n; i++) (D[i][0] = i * GAP), (P[i][0] = "up");
for (let j = 1; j <= m; j++) (D[0][j] = j * GAP), (P[0][j] = "left");
for (let i = 1; i <= n; i++) {
  for (let j = 1; j <= m; j++) {
    const opts = [
      [D[i - 1][j - 1] + score(S[i - 1], Hn[j - 1]), "diag"],
      [D[i - 1][j] + GAP, "up"],
      [D[i][j - 1] + GAP, "left"],
    ];
    if (j >= 2 && S[i - 1] === Hn[j - 2] + Hn[j - 1]) opts.push([D[i - 1][j - 2] + 2.5, "s1h2"]);
    if (i >= 2 && S[i - 2] + S[i - 1] === Hn[j - 1]) opts.push([D[i - 2][j - 1] + 2.5, "s2h1"]);
    const best = opts.reduce((a, b) => (b[0] > a[0] ? b : a));
    D[i][j] = best[0];
    P[i][j] = best[1];
  }
}

const words = script.map((w) => ({ ...w, startMs: null, endMs: null, status: "missing", heardAs: null }));
const extras = [];
const ops = []; // ordered diff: { kind: "ok" | "sub" | "missing" | "extra", word?, heard? }
for (let i = n, j = m; i > 0 || j > 0; ) {
  const move = P[i][j];
  if (move === "diag") {
    const w = words[i - 1];
    const h = heard[j - 1];
    const s = score(S[i - 1], Hn[j - 1]);
    Object.assign(w, { startMs: h.startMs, endMs: h.endMs, status: s === 2 ? "match" : s === 1 ? "fuzzy" : "substituted", heardAs: s === 2 ? null : h.text });
    ops.unshift(s > 0 ? { kind: "ok" } : { kind: "sub", word: w, heard: h });
    i--, j--;
  } else if (move === "s1h2") {
    Object.assign(words[i - 1], { startMs: heard[j - 2].startMs, endMs: heard[j - 1].endMs, status: "match" });
    ops.unshift({ kind: "ok" });
    i--, (j -= 2);
  } else if (move === "s2h1") {
    const h = heard[j - 1];
    const mid = (h.startMs + h.endMs) / 2;
    Object.assign(words[i - 2], { startMs: h.startMs, endMs: mid, status: "match" });
    Object.assign(words[i - 1], { startMs: mid, endMs: h.endMs, status: "match" });
    ops.unshift({ kind: "ok" });
    (i -= 2), j--;
  } else if (move === "up") {
    ops.unshift({ kind: "missing", word: words[i - 1] });
    i--;
  } else {
    extras.unshift(heard[j - 1]);
    ops.unshift({ kind: "extra", heard: heard[j - 1] });
    j--;
  }
}

// 4. Words Whisper didn't hear get timings interpolated between their timed neighbours,
//    clamped to their beat's speech window from master.json.
const beatWindow = Object.fromEntries(master.beats.map((b) => [b.id, [b.speechStart * 1000, b.speechEnd * 1000]]));
for (let i = 0; i < words.length; ) {
  if (words[i].startMs != null) {
    i++;
    continue;
  }
  let k = i;
  while (k < words.length && words[k].startMs == null) k++;
  const [bStart, bEnd] = beatWindow[words[i].beatId];
  const from = Math.max(i > 0 ? words[i - 1].endMs : bStart, bStart);
  const to = Math.min(k < words.length ? words[k].startMs : bEnd, bEnd);
  const step = Math.max(to - from, 0) / (k - i);
  for (let x = i; x < k; x++) Object.assign(words[x], { startMs: from + step * (x - i), endMs: from + step * (x - i + 1) });
  i = k;
}
// Whisper often stretches a word's end into the following pause; only a wrong start is a real error.
const outOfBeat = words.filter((w) => {
  const [a, b] = beatWindow[w.beatId];
  return w.startMs < a - 300 || w.startMs > b;
});
for (const w of words) w.endMs = Math.max(w.startMs + 1, Math.min(w.endMs, beatWindow[w.beatId][1] + 100));

// 5. Pages. Hard breaks: beat change, sentence end, pause > 400 ms. A unit that is still too long is
//    split into balanced pieces, preferring breaks after commas and never after "a", "the", "to"…
const WEAK = new Set(["a", "an", "the", "to", "of", "and", "or", "in", "on", "for", "with", "is", "if", "as", "at", "by", "we", "our", "your", "its", "it's"]);
const units = [];
let unit = [];
for (const w of words) {
  const prev = unit.at(-1);
  if (prev && (w.beatId !== prev.beatId || /[.!?]["”]?$/.test(prev.text) || w.startMs - prev.endMs > PAUSE_BREAK_MS)) {
    units.push(unit);
    unit = [];
  }
  unit.push({ text: w.text, beatId: w.beatId, startMs: Math.round(w.startMs), endMs: Math.round(w.endMs) });
}
if (unit.length) units.push(unit);

const chars = (ws) => ws.map((w) => w.text).join(" ").length;
function splitBalanced(ws) {
  const pieces = Math.ceil(Math.max(chars(ws) / maxChars, ws.length / maxWords));
  const target = chars(ws) / pieces;
  const best = [{ cost: 0, cut: -1 }];
  for (let end = 1; end <= ws.length; end++) {
    best[end] = { cost: Infinity, cut: -1 };
    for (let start = Math.max(0, end - maxWords); start < end; start++) {
      const seg = ws.slice(start, end);
      if (chars(seg) > maxChars || best[start].cost === Infinity) continue;
      const last = norm(seg.at(-1).text);
      let cost = best[start].cost + (chars(seg) - target) ** 2 + 300;
      if (end < ws.length && WEAK.has(last)) cost += 2000;
      if (end < ws.length && /[,:;—]$/.test(seg.at(-1).text)) cost -= 250;
      const quotesBefore = ws.slice(0, end).map((w) => w.text).join(" ").match(/["“”]/g)?.length ?? 0;
      if (end < ws.length && quotesBefore % 2 === 1) cost += 3000; // don't split inside a quotation
      if (cost < best[end].cost) best[end] = { cost, cut: start };
    }
  }
  const out = [];
  for (let end = ws.length; end > 0; end = best[end].cut) out.unshift(ws.slice(best[end].cut, end));
  return out;
}

const pages = units
  .flatMap((u) => (chars(u) <= maxChars && u.length <= maxWords ? [u] : splitBalanced(u)))
  .map((ws) => ({ beatId: ws[0].beatId, text: ws.map((w) => w.text).join(" "), startMs: ws[0].startMs, endMs: ws.at(-1).endMs, words: ws }));
// Keep each page on screen until the next one starts (unless there's a long silence or beat change).
for (const [i, p] of pages.entries()) {
  const next = pages[i + 1];
  const hold = next && next.beatId === p.beatId && next.startMs - p.endMs < 800 ? next.startMs : p.endMs + 250;
  p.endMs = Math.round(Math.min(hold, next ? next.startMs : Infinity));
}

// 6. Report: group consecutive non-matching ops into one issue each.
//    "minor" = a single word heard slightly differently (often Whisper, not the voice) → listen to confirm.
//    "major" = words missing, added, or a multi-word difference → the take doesn't say the script.
const issues = [];
for (let i = 0; i < ops.length; ) {
  if (ops[i].kind === "ok") {
    i++;
    continue;
  }
  let k = i;
  while (k < ops.length && ops[k].kind !== "ok") k++;
  const span = ops.slice(i, k);
  const scriptWords = span.filter((o) => o.word).map((o) => o.word);
  const heardWords = span.filter((o) => o.heard).map((o) => o.heard);
  const first = scriptWords[0] ?? null;
  const atMs = first?.startMs ?? heardWords[0].startMs;
  const beatId = first?.beatId ?? master.beats.find((b) => atMs / 1000 <= b.speechEnd + 0.3)?.id ?? master.beats.at(-1).id;
  // One word heard differently, or one extra filler word ("the", "so"), is minor; anything else is major.
  const minor = span.length === 1 && (span[0].kind === "sub" || (span[0].kind === "extra" && norm(span[0].heard.text).length <= 4));
  issues.push({
    severity: minor ? "minor" : "major",
    beatId,
    atSec: +(atMs / 1000).toFixed(2),
    script: scriptWords.map((w) => w.text).join(" ") || "(nothing)",
    heard: heardWords.map((h) => h.text).join(" ") || "(nothing)",
  });
  i = k;
}

const count = (s) => words.filter((w) => w.status === s).length;
const stats = {
  scriptWords: words.length,
  heardWords: heard.length,
  matched: count("match"),
  fuzzy: count("fuzzy"),
  substituted: count("substituted"),
  missing: count("missing"),
  extra: extras.length,
  majorIssues: issues.filter((x) => x.severity === "major").length,
  minorIssues: issues.filter((x) => x.severity === "minor").length,
  matchRate: +((count("match") + count("fuzzy")) / words.length).toFixed(4),
  outOfBeat: outOfBeat.length,
};
await writeJSON(path.join(ep.genDir, outName), {
  audio: master.audio,
  createdAt: new Date().toISOString(),
  stats,
  issues,
  words: words.map((w) => ({ text: w.text, beatId: w.beatId, startMs: Math.round(w.startMs), endMs: Math.round(w.endMs), status: w.status, ...(w.heardAs ? { heardAs: w.heardAs } : {}) })),
  pages,
});

console.log(`${ep.id} captions → ${rel(path.join(ep.genDir, outName))}`);
console.log(`  ${stats.matched + stats.fuzzy}/${stats.scriptWords} script words heard (${(stats.matchRate * 100).toFixed(1)}%), ${pages.length} caption pages`);
if (!issues.length) console.log("  ✓ every script word was heard as written");
for (const it of issues) {
  console.log(`  ${it.severity === "major" ? "✗" : "?"} [${it.beatId} @ ${it.atSec}s] script: "${it.script}"  ←→  heard: "${it.heard}"`);
}
if (issues.some((x) => x.severity === "minor")) console.log("  (? = one word heard differently — usually Whisper; listen once to confirm)");
for (const w of outOfBeat) console.log(`  ✗ "${w.text}" (${w.beatId}) timed at ${(w.startMs / 1000).toFixed(2)}s, outside its beat`);
if (args.includes("--strict") && (stats.majorIssues || outOfBeat.length)) process.exit(1);
