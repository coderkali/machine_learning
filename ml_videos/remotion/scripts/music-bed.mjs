// Series background music, generated from code (no samples, no copyright).
//   node scripts/music-bed.mjs --style lofi|cinematic|pulse|calm [--seconds 180] [--out series/music/bed_<style>.wav]
// Preview first (creator's rule): scripts/music-preview.mjs; only an approved bed goes into master.mjs --music.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { PUBLIC } from "./lib/episode.mjs";

const args = process.argv.slice(2);
const flag = (k) => (args.includes(`--${k}`) ? args[args.indexOf(`--${k}`) + 1] : undefined);
const style = flag("style") ?? "calm";
const seconds = Number(flag("seconds") ?? 180);
const outRel = flag("out") ?? `series/music/bed_${style}.wav`;
const SR = 44100;
const TAU = Math.PI * 2;
const n = Math.floor(seconds * SR);
const buf = new Float32Array(n);

// Deterministic noise (same bed every run).
let seed = 12345;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const noise = new Float32Array(n).map(() => rnd());
const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);
const add = (i, v) => { if (i >= 0 && i < n) buf[i] += v; };

/** A decaying note starting at time t0 (seconds), rendered with fn(age) → sample. */
function note(t0, len, fn) {
  const s0 = Math.floor(t0 * SR);
  const m = Math.floor(len * SR);
  for (let k = 0; k < m; k++) add(s0 + k, fn(k / SR));
}

if (style === "lofi") {
  // 76 bpm, jazzy 7ths/9ths on a warm electric piano (FM), soft kick / snare / hat.
  const bpm = 76, beat = 60 / bpm, bar = beat * 4;
  const prog = [[62, 65, 69, 72, 76], [55, 59, 62, 65, 69], [60, 64, 67, 71, 74], [57, 60, 64, 67, 71]]; // Dm9 G13 Cmaj9 Am9
  const ep = (f, amp) => (age) => {
    const env = Math.min(1, age / 0.005) * Math.exp(-age / 1.1);
    const mod = 1.2 * Math.exp(-age / 0.3) * Math.sin(TAU * f * 2 * age);
    return amp * env * Math.sin(TAU * f * age + mod);
  };
  for (let b = 0; b * bar < seconds; b++) {
    const ch = prog[b % prog.length];
    const t = b * bar;
    for (const [hitBeat, vel] of [[0, 1], [1.5, 0.7], [2.5, 0.55]]) for (const m of ch) note(t + hitBeat * beat + Math.abs(rnd()) * 0.012, 2.2, ep(hz(m), 0.05 * vel));
    note(t, bar, (age) => 0.07 * Math.exp(-age / 1.6) * Math.sin(TAU * hz(ch[0] - 12) * age)); // bass
    for (let q = 0; q < 4; q++) {
      const tq = t + q * beat;
      if (q === 0 || q === 2) note(tq, 0.4, (age) => 0.22 * Math.exp(-age / 0.12) * Math.sin(TAU * (50 + 70 * Math.exp(-age / 0.03)) * age)); // kick
      if (q === 1 || q === 3) { const s0 = Math.floor(tq * SR); note(tq, 0.25, (age) => 0.05 * Math.exp(-age / 0.07) * noise[(s0 + Math.floor(age * SR)) % n]); } // snare (brushy)
      for (const e of [0, 0.5]) { const th = tq + e * beat; const s0 = Math.floor(th * SR); note(th, 0.06, (age) => 0.012 * Math.exp(-age / 0.015) * noise[(s0 * 7 + Math.floor(age * SR)) % n]); } // hat
    }
  }
} else if (style === "cinematic") {
  // Slow, bright, airy: C – G – Am – F, 10 s each, soft saw-like pad + octave shimmer, no beat.
  const prog = [[48, 60, 64, 67, 72], [43, 59, 62, 67, 71], [45, 60, 64, 69, 72], [41, 60, 65, 69, 72]];
  const L = 10;
  for (let c = 0; c * L < seconds; c++) {
    const ch = prog[c % prog.length];
    note(c * L - 1.5, L + 3, (age) => {
      const env = Math.min(1, age / 2.5) * Math.min(1, Math.max(0, (L + 3 - age) / 2.5));
      let v = 0;
      for (const m of ch) { const f = hz(m); for (let h = 1; h <= 4; h++) v += (0.03 / h) * Math.sin(TAU * f * h * age * (1 + 0.0015 * Math.sin(age * 0.7 + m))); }
      v += 0.012 * Math.sin(TAU * hz(ch[ch.length - 1] + 12) * age) * (0.5 + 0.5 * Math.sin(age * 0.9));
      return env * v;
    });
  }
} else if (style === "pulse") {
  // 100 bpm muted 8th-note synth pulse on root/fifth, sub bass, thin pad: Am – F – C – G.
  const bpm = 100, e8 = 60 / bpm / 2, bar = e8 * 8;
  const prog = [[57, 64, 60], [53, 60, 57], [48, 55, 64], [55, 62, 59]];
  for (let b = 0; b * bar < seconds; b++) {
    const ch = prog[b % prog.length];
    const t = b * bar;
    for (let k = 0; k < 8; k++) {
      const m = ch[k % 2 === 0 ? 0 : 1] + (k === 6 ? 12 : 0);
      const f = hz(m);
      note(t + k * e8, 0.35, (age) => { const env = Math.min(1, age / 0.004) * Math.exp(-age / 0.12); const tri = (2 / Math.PI) * Math.asin(Math.sin(TAU * f * age)); return 0.08 * env * tri; });
    }
    note(t, bar, (age) => 0.08 * Math.min(1, age / 0.05) * Math.exp(-age / 3) * Math.sin(TAU * hz(ch[0] - 24) * age));
    note(t, bar + 0.5, (age) => 0.015 * Math.min(1, age / 0.8) * Math.min(1, (bar + 0.5 - age) / 0.5) * (Math.sin(TAU * hz(ch[2]) * age) + Math.sin(TAU * hz(ch[1]) * age)));
  }
} else {
  // calm (v1): slow pads Am7 → Fmaj7 → Cmaj7 → G6 with a sparse arpeggio.
  const prog = [[45, 57, 60, 64, 67], [41, 53, 57, 60, 64], [48, 55, 59, 60, 64], [43, 55, 59, 62, 64]];
  const L = 8;
  for (let c = 0; c * L < seconds; c++) {
    const ch = prog[c % prog.length];
    note(c * L - 1, L + 2, (age) => {
      const env = Math.min(1, age / 1.5) * Math.min(1, Math.max(0, (L + 2 - age) / 1.5));
      let v = 0.09 * Math.sin(TAU * hz(ch[0] - 12) * age);
      for (const m of ch.slice(1)) { const f = hz(m); v += 0.05 * (Math.sin(TAU * f * age) + 0.6 * Math.sin(TAU * f * 1.003 * age) + 0.6 * Math.sin(TAU * f * 0.997 * age)); }
      return env * v;
    });
    for (let k = 0; k < L / 1.5; k++) note(c * L + k * 1.5, 1.4, (age) => 0.035 * Math.min(1, age / 0.02) * Math.exp(-age / 0.9) * Math.sin(TAU * hz(ch[1 + (k % 4)] + 12) * age));
  }
}

let peak = 0;
for (const x of buf) peak = Math.max(peak, Math.abs(x));
const pcm = Buffer.alloc(n * 2);
for (let s = 0; s < n; s++) pcm.writeInt16LE(Math.round((buf[s] / (peak || 1)) * 0.8 * 32767), s * 2);
const raw = path.join(os.tmpdir(), `bed_${process.pid}.raw`);
writeFileSync(raw, pcm);
const out = path.join(PUBLIC, outRel);
mkdirSync(path.dirname(out), { recursive: true });
const fx = { lofi: "lowpass=f=3800,aecho=0.8:0.5:90:0.25", cinematic: "lowpass=f=6000,aecho=0.8:0.7:180|340:0.35|0.25", pulse: "lowpass=f=4200,aecho=0.8:0.5:150:0.2", calm: "lowpass=f=3200,aecho=0.8:0.6:120|260:0.35|0.22" }[style] ?? "anull";
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "s16le", "-ar", String(SR), "-ac", "1", "-i", raw, "-af", `${fx},afade=t=in:d=2,afade=t=out:st=${seconds - 3}:d=3`, "-ar", "48000", out]);
console.log(`music bed (${style}) → public/${outRel} (${seconds}s)`);
