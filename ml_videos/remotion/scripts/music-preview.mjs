// Audio previews of a music bed BEFORE it goes into any video (creator's rule, 2026-09-29).
//   node scripts/music-preview.mjs day_02 --beds series/music/bed_lofi.wav,series/music/bed_pulse.wav [--lufs -28] [--seconds 35]
// Writes out/music_preview/<bed>_music_only.mp3 (20 s) and <bed>_with_voice.mp3 (voice excerpt + ducked bed).
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { loadEpisode, loudness, PUBLIC, readJSON, ROOT } from "./lib/episode.mjs";

const args = process.argv.slice(2);
const flag = (k) => (args.includes(`--${k}`) ? args[args.indexOf(`--${k}`) + 1] : undefined);
const ep = await loadEpisode(args[0]);
const lufs = Number(flag("lufs") ?? -28);
const secs = Number(flag("seconds") ?? 35);
const master = await readJSON(path.join(ep.genDir, "master.json"));
const voice = path.join(PUBLIC, master.voiceAudio ?? master.audio);
const outDir = path.join(ROOT, "out", "music_preview");
mkdirSync(outDir, { recursive: true });
const ff = (a) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...a]);

for (const rel of (flag("beds") ?? "").split(",").filter(Boolean)) {
  const bed = path.join(PUBLIC, rel);
  const name = path.basename(rel, ".wav");
  const gain = (lufs - (await loudness(bed)).lufs).toFixed(2);
  // Music alone, at the level it would sit at (+10 dB so it's audible on its own).
  ff(["-i", bed, "-t", "20", "-af", `volume=${(Number(gain) + 10).toFixed(2)}dB,afade=t=out:st=18:d=2`, "-b:a", "192k", path.join(outDir, `${name}_music_only.mp3`)]);
  // Voice excerpt with the bed ducked under it (same chain as master.mjs), then −14 LUFS.
  ff(["-i", voice, "-i", bed, "-filter_complex",
    `[0]atrim=0:${secs},asetpts=PTS-STARTPTS,aformat=channel_layouts=mono,asplit=2[v][key];` +
    `[1]aformat=channel_layouts=mono,aresample=48000,volume=${gain}dB,atrim=0:${secs},afade=t=out:st=${secs - 2}:d=2[m];` +
    `[m][key]sidechaincompress=threshold=0.02:ratio=6:attack=15:release=350[md];[v][md]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5[o]`,
    "-map", "[o]", "-b:a", "192k", path.join(outDir, `${name}_with_voice.mp3`)]);
  console.log(`${name}: out/music_preview/${name}_music_only.mp3 · ${name}_with_voice.mp3 (bed at ${lufs} LUFS)`);
}
