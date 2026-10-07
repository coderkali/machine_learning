// Silent build (Kali, 2026-10-06: "generate the video first, audio later"): a timeline with ESTIMATED word timings,
// so scenes and captions can be built and reviewed before any ElevenLabs call. When real audio exists, run the normal
// master → captions → timeline chain instead; scenes cue on words, so they re-time themselves.
//
//   node scripts/silent-timeline.mjs day_304      → generated/timeline.json + public/day_304/mix/narration.wav (silence)
//
// Pace is calibrated on the approved DAF-02 timelines (day_302/352/402, Viraj v3, ≈ 148 wpm): a word lasts
// 0.54 + 2.37 × letters frames; punctuation adds a short breath; each beat has a 4-frame lead-in and a 34-frame hold.
import path from "node:path";
import fs from "node:fs/promises";
import { FPS, gapBefore, loadEpisode, rel, run, writeJSON } from "./lib/episode.mjs";
import layout from "../src/shared/layout.json" with { type: "json" };

const ep = await loadEpisode(process.argv[2]);
const { maxWords, maxChars } = layout.caption;
const LEAD = 4, TAIL = 34;
const PAUSE = { ",": 2, ".": 4, "?": 5, "!": 4, "…": 20 };

const letters = (w) => w.replace(/[^\p{L}\p{N}]/gu, "").length;
const breath = (w) => (w.endsWith("…") || w.endsWith("...") ? PAUSE["…"] : PAUSE[w.at(-1)] ?? 0);

let t = Math.round((ep.voice.leadIn ?? 0.1) * FPS);
const beats = [];
const words = [];
for (const [i, b] of ep.voice.beats.entries()) {
  if (i > 0) t += Math.round((b.gapBefore ?? gapBefore(b.type)) * FPS);
  const from = t;
  let w = from + LEAD;
  const tokens = b.text.replace(/\s*…\s*/g, "… ").trim().split(/\s+/);
  for (const tok of tokens) {
    if (tok === "…") { w += PAUSE["…"]; continue; }
    const d = Math.max(5, Math.round(0.54 + 2.37 * letters(tok)));
    words.push({ text: tok, beatId: b.id, startFrame: w, endFrame: w + d });
    w += d + breath(tok);
  }
  const speechTo = w;
  const dur = speechTo - from + TAIL + Math.round((b.holdAfter ?? 0) * FPS);
  beats.push({ id: b.id, type: b.type, from, durationInFrames: dur, speechFrom: from + LEAD, speechTo });
  t = from + dur;
}
const totalFrames = t + Math.round((ep.voice.endHold ?? 1.5) * FPS);

// Caption pages: break at sentence ends and commas, then split anything longer than the layout allows.
const chars = (ws) => ws.map((x) => x.text).join(" ").length;
const units = [];
let cur = [];
for (const w of words) {
  if (cur.length && cur[0].beatId !== w.beatId) { units.push(cur); cur = []; }
  cur.push(w);
  if (/[.?!…,]$/.test(w.text)) { units.push(cur); cur = []; }
}
if (cur.length) units.push(cur);
// Merge tiny comma pieces ("See," "Now,") into the next unit when they fit.
const merged = [];
for (const u of units) {
  const last = merged.at(-1);
  if (last && last.length <= 2 && last[0].beatId === u[0].beatId && /,$/.test(last.at(-1).text) && chars([...last, ...u]) <= maxChars && last.length + u.length <= maxWords) merged[merged.length - 1] = [...last, ...u];
  else merged.push(u);
}
const split = (u) => {
  if (chars(u) <= maxChars && u.length <= maxWords) return [u];
  const n = Math.ceil(Math.max(chars(u) / maxChars, u.length / maxWords));
  const size = Math.ceil(u.length / n);
  return Array.from({ length: n }, (_, k) => u.slice(k * size, (k + 1) * size)).filter((x) => x.length);
};
const pages = merged.flatMap(split).map((ws) => ({ text: ws.map((x) => x.text).join(" "), startFrame: ws[0].startFrame, endFrame: ws.at(-1).endFrame, words: ws }));
for (const [i, p] of pages.entries()) {
  const next = pages[i + 1];
  const beat = beats.find((b) => b.id === p.words[0].beatId);
  p.endFrame = next && next.words[0].beatId === p.words[0].beatId ? next.startFrame : Math.min(p.endFrame + 12, beat.from + beat.durationInFrames);
}

const audio = `${ep.id}/mix/narration.wav`;
const wav = path.join(ep.publicDir, "mix", "narration.wav");
await fs.mkdir(path.dirname(wav), { recursive: true });
await run("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", String(totalFrames / FPS), wav]);

const timeline = { day: ep.n, fps: FPS, totalFrames, audio, music: null, silent: true, beats, captions: pages };
await writeJSON(path.join(ep.genDir, "timeline.json"), timeline);
console.log(`${ep.id}: ${beats.length} beats, ${words.length} words, ${pages.length} caption pages, ${(totalFrames / FPS).toFixed(1)} s (estimated, silent)`);
console.log(`  → ${rel(path.join(ep.genDir, "timeline.json"))}, ${rel(wav)}`);
