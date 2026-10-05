"""Voice energy = pitch movement. Prints median pitch and the 10–90 % pitch range in semitones per file.
Usage: ../../.venv/bin/python scripts/voice-energy.py <audio files…>   (needs numpy + ffmpeg)
Reference (2026): Kali raw 4.0–6.9 st, Viraj (pro voice) 9–12 st. Higher = livelier delivery.
"""
import subprocess
import sys

import numpy as np


def f0(path: str) -> np.ndarray:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-map", "0:a:0", "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout
    x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    fr, hop, out = 640, 160, []
    for i in range(0, len(x) - fr, hop):
        s = x[i:i + fr] - x[i:i + fr].mean()
        if np.sqrt((s ** 2).mean()) < 0.01:
            continue
        ac = np.correlate(s, s, "full")[fr - 1:]
        lo, hi = 16000 // 350, 16000 // 70
        k = lo + int(np.argmax(ac[lo:hi]))
        if ac[k] > 0.45 * ac[0]:
            out.append(16000 / k)
    return np.array(out)


for p in sys.argv[1:]:
    f = f0(p)
    if len(f) < 10:
        print(f"{p.split('/')[-1]:32s} too quiet to measure")
        continue
    st = 12 * np.log2(f / np.median(f))
    print(f"{p.split('/')[-1]:32s} median {np.median(f):5.0f} Hz · energy {np.percentile(st, 90) - np.percentile(st, 10):4.1f} st")
