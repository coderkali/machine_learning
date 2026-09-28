// Copy an episode's approved deliverables to the creator's posting folder.
//
//   node scripts/publish.mjs day_01          → ~/Documents/Instagram_Youtube_Reels/Day1/
//   node scripts/publish.mjs day_00          → …/Intro/   (the "Start here" reel)
//
// Copies (never moves) the newest out/day_NN/episode[_vN].mp4 and thumbnail[_vN].png as
// "Day1_What_is_Machine_Learning.mp4" / "Day1_thumbnail.png". Existing files are never overwritten (_v2, …).
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadEpisode, nextFreePath } from "./lib/episode.mjs";

const REELS = process.env.REELS_DIR ?? path.join(os.homedir(), "Documents", "Instagram_Youtube_Reels");
const ep = await loadEpisode(process.argv[2]);
if (!ep.meta) throw new Error(`Missing src/episodes/${ep.id}/episode.json`);

// Newest final render: episode.mp4, episode_v2.mp4, … (labelled test renders like episode_sample30 are ignored).
const finals = (await fs.readdir(ep.outDir)).filter((f) => /^episode(_v\d+)?\.mp4$/.test(f));
if (!finals.length) throw new Error(`No final render in ${ep.outDir}. Run: npm run render ${ep.id}`);
const version = (f) => Number(f.match(/_v(\d+)/)?.[1] ?? 1);
const video = finals.sort((a, b) => version(b) - version(a))[0];

const label = ep.n === 0 ? "Intro" : `Day${ep.n}`;
const title = ep.meta.title.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");
const dest = path.join(REELS, label);
await fs.mkdir(dest, { recursive: true });

const copies = [[path.join(ep.outDir, video), nextFreePath(dest, `${label}_${title}`, ".mp4")]];
const thumbs = (await fs.readdir(ep.outDir)).filter((f) => /^thumbnail(_v\d+)?\.png$/.test(f)).sort((a, b) => version(b) - version(a));
const thumb = thumbs.length ? path.join(ep.outDir, thumbs[0]) : "";
if (thumb && existsSync(thumb)) copies.push([thumb, nextFreePath(dest, `${label}_thumbnail`, ".png")]);
for (const [from, to] of copies) {
  await fs.copyFile(from, to);
  console.log(`${path.basename(from)} → ${to}`);
}
