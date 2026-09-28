import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const sampleRate = 22050;
const duration = 88;
const bpm = 82;
const chordSeconds = 4 * 4 * 60 / bpm;
const chords = [
  [110.00, 164.81, 220.00, 261.63], // Am7
  [87.31, 174.61, 220.00, 261.63],  // Fmaj7
  [65.41, 130.81, 164.81, 196.00],  // Cmaj7
  [98.00, 146.83, 196.00, 220.00],  // Gsus2
];
const frames = sampleRate * duration;
const pcm = Buffer.alloc(frames * 4);
const beatSeconds = 60 / bpm;

for (let i = 0; i < frames; i++) {
  const t = i / sampleRate;
  const chordPosition = t / chordSeconds;
  const chordIndex = Math.floor(chordPosition) % chords.length;
  const chord = chords[chordIndex];
  const beat = Math.floor(t / beatSeconds);
  const beatStart = beat * beatSeconds;
  const age = t - beatStart;
  const note = chord[beat % chord.length];

  const chordFade = Math.min(1, (t % chordSeconds) / 0.8, (chordSeconds - (t % chordSeconds)) / 0.8);
  let pad = 0;
  for (let n = 0; n < chord.length; n++) {
    const gain = n === 0 ? 0.009 : 0.0065;
    pad += Math.sin(2 * Math.PI * chord[n] * t) * gain;
    pad += Math.sin(2 * Math.PI * chord[n] * 2 * t) * gain * 0.12;
  }
  const pluckEnv = Math.exp(-3.8 * age) * Math.min(1, age / 0.015);
  const pluck = pluckEnv * (Math.sin(2 * Math.PI * note * 2 * t) * 0.019 + Math.sin(2 * Math.PI * note * 3 * t) * 0.004);
  const fadeIn = Math.min(1, t / 1.2);
  const fadeOut = Math.min(1, (duration - t) / 2.2);
  const sample = Math.max(-0.28, Math.min(0.28, (pad * chordFade + pluck) * fadeIn * fadeOut));
  const value = Math.round(sample * 32767);
  const offset = i * 4;
  pcm.writeInt16LE(value, offset);
  pcm.writeInt16LE(value, offset + 2);
}

const header = Buffer.alloc(44);
header.write("RIFF", 0); header.writeUInt32LE(36 + pcm.length, 4); header.write("WAVE", 8);
header.write("fmt ", 12); header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20);
header.writeUInt16LE(2, 22); header.writeUInt32LE(sampleRate, 24); header.writeUInt32LE(sampleRate * 4, 28);
header.writeUInt16LE(4, 32); header.writeUInt16LE(16, 34); header.write("data", 36); header.writeUInt32LE(pcm.length, 40);
const output = path.join(root, "public/day01/audio_v2_final/music_bed.wav");
await fs.writeFile(output, Buffer.concat([header, pcm]));
process.stdout.write(`Saved ${duration}s ambient instrumental bed: ${path.relative(root, output)}\n`);
