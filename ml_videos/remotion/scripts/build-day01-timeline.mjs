import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const source = JSON.parse(
  await fs.readFile(path.join(root, "src/day01/narration.json"), "utf8"),
);
const voiceLengths = await Promise.all(source.map(async (beat) => {
  const audioPath = path.join(root, "public/day01/audio", `${beat.id}.mp3`);
  const { stdout } = await run("ffprobe", [
    "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", audioPath,
  ]);
  return Number(stdout.trim());
}));
const speechFramesTotal = voiceLengths.reduce((sum, seconds) => sum + Math.round(seconds * 30), 0);
const targetFrames = 3600;
const endCardFrames = 60;
const extraForLastBeat = targetFrames - endCardFrames - speechFramesTotal - 6 * 40;
if (extraForLastBeat < 0) throw new Error("Narration is too long for the 120-second timeline.");

const beats = source.map((beat, index) => {
  const wordCount = beat.text.trim().split(/\s+/).length;
  const speechFrames = Math.round(voiceLengths[index] * 30);
  const holdFrames = index === source.length - 1 ? extraForLastBeat : 40;
  const sentences = beat.text.match(/[^.!?]+[.!?]+|[^.!?]+$/g).map((s) => s.trim());
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
  const phraseWords = phrases.map((s) => s.split(/\s+/).length);
  const captions = [];
  let cursor = 0;
  for (let i = 0; i < phrases.length; i++) {
    const startFrame = Math.floor((cursor / wordCount) * speechFrames);
    cursor += phraseWords[i];
    const endFrame = Math.max(
      startFrame + 1,
      Math.floor((cursor / wordCount) * speechFrames),
    );
    captions.push({ text: phrases[i], startFrame, endFrame });
  }
  return {
    id: beat.id,
    audio: `day01/audio/${beat.id}.mp3`,
    duration: voiceLengths[index],
    frames: speechFrames + holdFrames,
    speechFrames,
    captions,
  };
});

await fs.writeFile(
  path.join(root, "src/day01/beats.json"),
  JSON.stringify(beats, null, 2) + "\n",
);
const frames = beats.reduce((sum, beat) => sum + beat.frames, 0);
process.stdout.write(`Day 1 narrated timeline: ${(frames + endCardFrames) / 30}s (${frames + endCardFrames} frames)\n`);
