// 0.7 — Render the episode thumbnail (Thumbnail Still, spec in SERIES_ROADMAP.md §5b).
//
//   npm run thumb day_01      (or: node scripts/thumb.mjs day_01)
//
// Output: out/day_NN/thumbnail.png (never overwritten: _v2, _v3, …). Claude's own folder —
//         never write into ml_videos/episodes/ (another agent works there).
//         out/day_NN/thumbnail_grid.png      — the 3:4 crop Instagram shows on the profile grid
//         out/day_NN/thumbnail_grid_200.png  — the same at ~200 px wide: the headline must still read
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { ENTRY, ROOT, loadEpisode, nextFreePath, readJSON, rel, run, writeJSON } from "./lib/episode.mjs";

const ep = await loadEpisode(process.argv[2]);
if (!ep.meta) throw new Error(`Missing src/episodes/${ep.id}/episode.json`);
const layout = await readJSON(path.join(ROOT, "src/shared/layout.json"));
const crop = layout.thumbnail.gridCrop;

await fs.mkdir(ep.outDir, { recursive: true });
const out = nextFreePath(ep.outDir, "thumbnail", ".png");
const props = path.join(await fs.mkdtemp(path.join(os.tmpdir(), `${ep.id}-thumb-`)), "props.json");
await writeJSON(props, { meta: ep.meta });

await run("npx", ["remotion", "still", ENTRY, "Thumbnail", out, `--props=${props}`, "--image-format=png", "--log=error"], { cwd: ROOT });
const grid = path.join(ep.outDir, "thumbnail_grid.png");
const small = path.join(ep.outDir, "thumbnail_grid_200.png");
const cropArgs = `crop=${crop.right - crop.left}:${crop.bottom - crop.top}:${crop.left}:${crop.top}`;
await run("ffmpeg", ["-y", "-loglevel", "error", "-i", out, "-vf", cropArgs, grid]);
await run("ffmpeg", ["-y", "-loglevel", "error", "-i", out, "-vf", `${cropArgs},scale=200:-1:flags=area`, small]);
await writeJSON(path.join(ep.genDir, "thumbnail.json"), { file: rel(out), createdAt: new Date().toISOString() });

console.log(`${ep.id} thumbnail → ${rel(out)}`);
console.log(`  grid preview → ${rel(grid)}\n  200px check  → ${rel(small)}`);
