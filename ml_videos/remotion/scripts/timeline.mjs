// 0.6 — Visual timing follows the recorded voice. Beat lengths come from the mastered audio
// (speech + gaps + holds); nothing is stretched. The video reads the result.
//
//   node scripts/timeline.mjs day_01
//
// Reads:  src/episodes/day_NN/generated/master.json + captions.json
// Writes: src/episodes/day_NN/generated/timeline.json   (--tag <name>: reads captions.<name>.json,
//         writes timeline.<name>.json)
import path from "node:path";
import { FPS, loadEpisode, readJSON, rel, writeJSON } from "./lib/episode.mjs";

const ep = await loadEpisode(process.argv[2]);
const tag = process.argv.includes("--tag") ? process.argv[process.argv.indexOf("--tag") + 1] : null;
const suffix = tag ? `.${tag}` : "";
const master = await readJSON(path.join(ep.genDir, "master.json"));
const captions = await readJSON(path.join(ep.genDir, `captions${suffix}.json`));
if (captions.audio !== master.audio) {
  throw new Error(`captions.json is for ${captions.audio} but the current master is ${master.audio}. Run captions.mjs first.`);
}

const fr = (sec) => Math.round(sec * FPS);
const totalFrames = Math.ceil(master.durationSec * FPS);

// A beat's scene cuts in halfway through the pause before it, so the new picture is already up
// when the voice starts (and a 0.6 s pause before an insight lands on the new scene).
const cuts = master.beats.map((b, i) => (i === 0 ? 0 : fr(b.speechStart - b.gapBefore / 2)));
const beats = master.beats.map((b, i) => ({
  id: b.id,
  type: b.type,
  from: cuts[i],
  durationInFrames: (i + 1 < cuts.length ? cuts[i + 1] : totalFrames) - cuts[i],
  speechFrom: fr(b.speechStart),
  speechTo: fr(b.speechEnd),
}));

const pages = captions.pages.map((p) => ({
  text: p.text,
  startFrame: fr(p.startMs / 1000),
  endFrame: Math.max(fr(p.startMs / 1000) + 1, fr(p.endMs / 1000)),
  words: p.words.map((w) => ({ text: w.text, beatId: w.beatId, startFrame: fr(w.startMs / 1000), endFrame: Math.max(fr(w.startMs / 1000) + 1, fr(w.endMs / 1000)) })),
}));
for (let i = 0; i + 1 < pages.length; i++) pages[i].endFrame = Math.min(pages[i].endFrame, pages[i + 1].startFrame);

const timeline = { day: ep.n, fps: FPS, totalFrames, audio: master.audio, music: master.music, beats, captions: pages };
await writeJSON(path.join(ep.genDir, `timeline${suffix}.json`), timeline);

console.log(`${ep.id} timeline → ${rel(path.join(ep.genDir, `timeline${suffix}.json`))}`);
console.log(`  ${(totalFrames / FPS).toFixed(2)}s · ${totalFrames} frames @ ${FPS} fps · ${pages.length} caption pages`);
for (const b of beats) console.log(`  ${b.id.padEnd(11)} ${b.type.padEnd(8)} frames ${String(b.from).padStart(4)}–${String(b.from + b.durationInFrames).padEnd(5)} (${(b.durationInFrames / FPS).toFixed(2)}s)`);
