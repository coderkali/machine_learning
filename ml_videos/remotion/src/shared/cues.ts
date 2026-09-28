// "Responsive" animation: start an element on the frame its word is spoken (Whisper timing).
import type { Timeline } from "./types";

const norm = (w: string) => w.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9-]/g, "");

/**
 * Frame, relative to the start of `beatId`, where `word` is spoken (nth occurrence in that beat,
 * 1-based). `word` may list alternatives: "python|data" matches whichever the voice actually says
 * (useful while a scene is tested on older audio). Falls back to the beat's first spoken frame if no
 * alternative is found, so a typo never hides an element.
 */
export function cue(timeline: Timeline, beatId: string, word: string, nth = 1): number {
  const beat = timeline.beats.find((b) => b.id === beatId);
  if (!beat) throw new Error(`cue(): unknown beat "${beatId}"`);
  const spoken = timeline.captions.flatMap((p) => p.words).filter((w) => w.beatId === beatId);
  for (const alt of word.split("|")) {
    const target = norm(alt.trim().split(/\s+/)[0]);
    const hit = spoken.filter((w) => norm(w.text) === target)[nth - 1];
    if (hit) return hit.startFrame - beat.from;
  }
  return beat.speechFrom - beat.from;
}
