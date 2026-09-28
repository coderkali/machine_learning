// Shared helpers for the per-episode pipeline scripts (voice → master → captions → timeline → thumb → qa).
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const exec = promisify(execFile);

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const PUBLIC = path.join(ROOT, "public");
export const ENTRY = path.join(ROOT, "src/index.ts");
export const FPS = 30;

/** Gap rules from VOICE_GUIDE.md §5: 0.6 s before insight/term, 0.15 s into "Day N done", else 0.25 s. */
export const gapBefore = (type) => (type === "insight" || type === "term" ? 0.6 : type === "done" ? 0.15 : 0.25);

/** Accepts "day_01", "day_1", "day01", "1" → { id: "day_01", n: 1 }. */
export function parseDay(arg) {
  const m = String(arg ?? "").match(/^(?:day_?)?0*(\d{1,3})$/i);
  if (!m) throw new Error(`Expected an episode like "day_01", got "${arg ?? ""}".`);
  const n = Number(m[1]);
  return { id: `day_${String(n).padStart(2, "0")}`, n };
}

export async function readJSON(file) {
  return JSON.parse(await fs.readFile(file, "utf8"));
}

export async function writeJSON(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2) + "\n");
}

export async function loadEpisode(dayArg) {
  const { id, n } = parseDay(dayArg);
  const srcDir = path.join(ROOT, "src/episodes", id);
  if (!existsSync(path.join(srcDir, "voice.json"))) {
    throw new Error(`Missing ${path.relative(ROOT, srcDir)}/voice.json — create the episode data first.`);
  }
  const voice = await readJSON(path.join(srcDir, "voice.json"));
  const meta = existsSync(path.join(srcDir, "episode.json")) ? await readJSON(path.join(srcDir, "episode.json")) : null;
  return {
    id,
    n,
    voice,
    meta,
    srcDir,
    genDir: path.join(srcDir, "generated"),
    publicDir: path.join(PUBLIC, id),
    outDir: path.join(ROOT, "out", id),
  };
}

/** Never overwrite: returns base.ext if free, else base_v2.ext, base_v3.ext, … */
export function nextFreePath(dir, base, ext) {
  let candidate = path.join(dir, `${base}${ext}`);
  for (let v = 2; existsSync(candidate); v++) candidate = path.join(dir, `${base}_v${v}${ext}`);
  return candidate;
}

export async function run(cmd, args, opts = {}) {
  try {
    return await exec(cmd, args, { maxBuffer: 256 * 1024 * 1024, ...opts });
  } catch (err) {
    const tail = String(err.stderr ?? "").split("\n").slice(-15).join("\n");
    throw new Error(`${cmd} failed:\n${tail || err.message}`);
  }
}

export async function duration(file) {
  const { stdout } = await run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]);
  return Number(stdout.trim());
}

/** EBU R128 integrated loudness + true peak (dBTP) of any audio/video file. */
export async function loudness(file) {
  const { stderr } = await run("ffmpeg", ["-hide_banner", "-nostats", "-i", file, "-map", "a:0", "-af", "ebur128=peak=true", "-f", "null", "-"]);
  const summary = stderr.slice(stderr.lastIndexOf("Summary:"));
  const lufs = Number(summary.match(/I:\s+(-?[\d.]+|-inf) LUFS/)?.[1]);
  const peak = Number(summary.match(/Peak:\s+(-?[\d.]+|-inf) dBFS/)?.[1]);
  return { lufs, truePeak: peak };
}

export const rel = (p) => path.relative(ROOT, p);
export const publicRel = (p) => path.relative(PUBLIC, p).split(path.sep).join("/");
