# Animation Guide — "Animated Technical Explainer"

**Status:** set by the creator 2026-09-27. Applies to every episode's visuals (the audio, captions,
thumbnail and QA pipeline are unchanged). The numbers below are Claude's defaults for the creator's
rules. The creator can adjust them.

## The format

Every episode is an **animated technical explainer**: the picture shows *how the idea works*, step by
step, in time with the voice. It's not a slideshow of static pictures.

## The creator's rules

1. **Movement within the first second.** Something meaningful moves on frame 1. No fade-in from an
   empty screen, and no title card first.
2. **Each visual step is brief.** One step = one small change (a box appears, an arrow draws, a value
   changes). Then the next one.
3. **No long pauses or slow transitions.** The picture never sits still for long. Transitions are cuts,
   pops or quick slides, never slow cross-fades.
4. **Short on-screen labels.** A label is 1–4 words. Sentences belong in the voice and captions,
   not in the scene.
5. **Every movement explains something.** No decorative motion (floating, bobbing, sparkles) standing in
   for content. If a movement doesn't help the viewer understand the concept, cut it.
6. **Medium-fast and responsive.** Elements appear **on the spoken word** that names them, using the
   Whisper word timings in `timeline.json`.

7. **Context first** (added 2026-09-27 after a viewer test: a Java dev watching cold couldn't tell
   whether the video was about spam, ML or careers). Frames 0–90: a title card with the episode's
   question/topic, spoken by the voice at the same time. The example appears only after that.
8. **Chapter bar.** A slim bar under the header lists the episode's chapters and highlights the current
   one, so the story never seems to "switch topics". Chapters live in `episode.json → chapters`.
9. **One thread.** The Java angle is woven through (the rules are *your* Java code), so the Java beat
   closes the loop instead of starting a new story.

## Timing defaults (30 fps)

| Thing | Default | Code |
|---|---|---|
| First movement | frame 0–3 (≤ 0.1 s) | — |
| Element enters (pop / slide) | 9 frames (0.3 s) | `T.enter` |
| Element exits | 6 frames (0.2 s) | `T.exit` |
| Stagger between items in a list | 4 frames | `T.stagger` |
| Arrow / line draws | 12 frames (0.4 s) | `T.draw` |
| Scene change between beats | hard cut, or 6-frame slide | `T.cut` |
| Longest the scene may stay still | 2.0 s | QA check |
| On-screen label | ≤ 4 words | review |

Idle "breathing" motion doesn't count as a step. Use it rarely and never to fill a gap.

## Responsive: animate on the word

`cue(timeline, beatId, "model")` in `remotion/src/shared/cues.ts` returns the frame (relative to the
beat) where that word is spoken, e.g.:

```tsx
const at = cue(timeline, "training", "model");
<ModelBox style={pop(f, at)} />   // the box pops in exactly as the voice says "model"
```

## Checked automatically (`npm run qa day_NN`)

- **Movement in the first second:** the scene area changes between 0.0 s and 1.0 s.
- **No still stretch over 2.0 s:** ffmpeg `freezedetect` on the scene area (header, captions and
  progress bar are excluded, so they can't hide a frozen scene).

Checked by eye (Gate 3): labels ≤ 4 words, and every movement explains something.
