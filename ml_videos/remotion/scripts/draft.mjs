// Render the pipeline draft (EpisodeDraft: narration + Whisper captions + shared chrome) for QA.
//
//   node scripts/draft.mjs day_01      → out/day_NN/draft.mp4 (never overwritten: _v2, _v3, …)
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { ENTRY, ROOT, loadEpisode, nextFreePath, readJSON, rel, run, writeJSON } from "./lib/episode.mjs";

const ep = await loadEpisode(process.argv[2]);
const timeline = await readJSON(path.join(ep.genDir, "timeline.json"));
await fs.mkdir(ep.outDir, { recursive: true });
const out = nextFreePath(ep.outDir, "draft", ".mp4");
const props = path.join(await fs.mkdtemp(path.join(os.tmpdir(), `${ep.id}-draft-`)), "props.json");
await writeJSON(props, { meta: ep.meta, timeline });

console.log(`Rendering ${ep.id} draft (${(timeline.totalFrames / timeline.fps).toFixed(1)}s)…`);
await run("npx", ["remotion", "render", ENTRY, "EpisodeDraft", out, `--props=${props}`, "--codec=h264", "--crf=18", "--audio-codec=aac", "--log=error"], { cwd: ROOT });
console.log(`  → ${rel(out)}`);
