import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(await fs.readFile(path.join(root, "src/day01/narration_v3.json"), "utf8"));
const secondsById = { hook: 9, rules: 12, shift: 10, training: 15, prediction: 13, java: 15, takeaway: 14 };
const beats = [];

for (const beat of source) {
  const seconds = secondsById[beat.id];
  const preferred = path.join(root, "public/day01/audio_v3", `${beat.id}.mp3`);
  const fallback = path.join(root, "public/day01/audio_v2_final", `${beat.id}.wav`);
  let input = preferred;
  try { await fs.access(input); } catch { input = fallback; }
  const { stdout } = await run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", input]);
  const duration = Number(stdout.trim());
  const output = path.join(root, "public/day01/audio_v3_final", `${beat.id}.wav`);
  const tempo = Math.max(0.5, Math.min(2, duration / seconds));
  await run("ffmpeg", ["-y", "-i", input, "-filter:a", `atempo=${tempo.toFixed(6)},apad=whole_dur=${seconds}`, "-t", String(seconds), "-ar", "44100", "-ac", "1", "-c:a", "pcm_s16le", output]);

  const text = beat.captionText;
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g).map(s => s.trim());
  const phrases = [];
  for (const sentence of sentences) {
    let line = [];
    for (const word of sentence.split(/\s+/)) {
      if (line.length >= 7 || [...line, word].join(" ").length > 42) { phrases.push(line.join(" ")); line = []; }
      line.push(word);
    }
    if (line.length) phrases.push(line.join(" "));
  }
  const wordCount = text.trim().split(/\s+/).length;
  let consumed = 0;
  const captions = phrases.map(text => {
    const count = text.split(/\s+/).length;
    const startFrame = Math.floor(consumed / wordCount * seconds * 30);
    consumed += count;
    return { text, startFrame, endFrame: Math.max(startFrame + 1, Math.floor(consumed / wordCount * seconds * 30)) };
  });
  beats.push({ id: beat.id, audio: `day01/audio_v3_final/${beat.id}.wav`, duration: seconds, frames: seconds * 30, speechFrames: seconds * 30, captions });
}

const list = path.join(root, "public/day01/audio_v3_final/concat.txt");
await fs.writeFile(list, beats.map(b => `file '${path.join(root, "public/day01/audio_v3_final", `${b.id}.wav`)}'`).join("\n") + "\n");
await run("ffmpeg", ["-y", "-f", "concat", "-safe", "0", "-i", list, "-c:a", "libmp3lame", "-b:a", "192k", path.join(root, "public/day01/audio_v3_final/narration_v3.mp3")]);
await fs.writeFile(path.join(root, "src/day01/beats_v3.json"), JSON.stringify(beats, null, 2) + "\n");
console.log(`Day 1 v3 timeline: ${beats.reduce((n,b) => n+b.frames,0)/30}s`);
