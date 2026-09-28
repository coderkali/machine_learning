// Render an episode's animated explainer (composition Day<NN>, e.g. Day01).
//
//   node scripts/render.mjs day_01               real timeline (new voice) → out/day_NN/episode.mp4
//   node scripts/render.mjs day_01 --tag proto   test timeline (old audio) → out/day_NN/episode_proto.mp4
//   node scripts/render.mjs day_01 --label placeholder   real timeline, named episode_placeholder.mp4
//
// Never overwrites: _v2, _v3, … Output stays in Claude's folder (out/day_NN/).
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { ENTRY, ROOT, loadEpisode, nextFreePath, readJSON, rel, run, writeJSON } from "./lib/episode.mjs";

const args = process.argv.slice(2);
const ep = await loadEpisode(args[0]);
const tag = args.includes("--tag") ? args[args.indexOf("--tag") + 1] : null;
const timeline = await readJSON(path.join(ep.genDir, tag ? `timeline.${tag}.json` : "timeline.json"));
const composition = `Day${String(ep.n).padStart(2, "0")}`;
await fs.mkdir(ep.outDir, { recursive: true });
const label = args.includes("--label") ? args[args.indexOf("--label") + 1] : tag;
const out = nextFreePath(ep.outDir, label ? `episode_${label}` : "episode", ".mp4");
const props = path.join(await fs.mkdtemp(path.join(os.tmpdir(), `${ep.id}-render-`)), "props.json");
await writeJSON(props, { meta: ep.meta, timeline });

console.log(`Rendering ${composition} (${(timeline.totalFrames / timeline.fps).toFixed(1)}s, audio ${timeline.audio})…`);
await run("npx", ["remotion", "render", ENTRY, composition, out, `--props=${props}`, "--codec=h264", "--crf=18", "--audio-codec=aac", "--log=error"], { cwd: ROOT });
console.log(`  → ${rel(out)}`);
