import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const source = JSON.parse(await fs.readFile(path.join(root, "src/day01/narration.json"), "utf8"));
const targetSeconds = { hook: 9, rules: 12, shift: 10, training: 15, prediction: 13, java: 15, takeaway: 14 };

const beats = [];
for (const beat of source) {
  const duration = targetSeconds[beat.id];
  if (!duration) throw new Error(`Missing planned duration for ${beat.id}`);
  const audioPath = path.join(root, "public/day01/audio_v2_final", `${beat.id}.wav`);
  const { stdout } = await run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", audioPath]);
  const audioDuration = Number(stdout.trim());
  if (Math.abs(audioDuration - duration) > 0.03) throw new Error(`${beat.id} audio is ${audioDuration}s; expected ${duration}s`);

  const sentences = beat.text.match(/[^.!?]+[.!?]+|[^.!?]+$/g).map((sentence) => sentence.trim());
  const phrases = [];
  for (const sentence of sentences) {
    const words = sentence.split(/\s+/);
    let line = [];
    for (const word of words) {
      if (line.length >= 7 || [...line, word].join(" ").length > 42) {
        phrases.push(line.join(" "));
        line = [];
      }
      line.push(word);
    }
    if (line.length) phrases.push(line.join(" "));
  }
  const totalWords = beat.text.trim().split(/\s+/).length;
  let cursor = 0;
  const captions = phrases.map((text) => {
    const words = text.split(/\s+/).length;
    const startFrame = Math.floor(cursor / totalWords * duration * 30);
    cursor += words;
    const endFrame = Math.max(startFrame + 1, Math.floor(cursor / totalWords * duration * 30));
    return { text, startFrame, endFrame };
  });
  beats.push({
    id: beat.id,
    audio: `day01/audio_v2_final/${beat.id}.wav`,
    duration: audioDuration,
    frames: duration * 30,
    speechFrames: duration * 30,
    captions,
  });
}

await fs.writeFile(path.join(root, "src/day01/beats_v2.json"), JSON.stringify(beats, null, 2) + "\n");
process.stdout.write(`Day 1 v2 timeline: ${beats.reduce((sum, beat) => sum + beat.frames, 0) / 30}s\n`);
