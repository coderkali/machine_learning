# Codex project memory — `ml_videos/`

**Maintainer note by:** Codex  
**Last checked:** 2026-09-26

## Purpose

This folder is intended to hold a short-form, vertical video series that teaches
machine-learning concepts to Java and backend developers. The supplied context
prompt describes a Manim/Python production path and a Remotion/React path, both
using ElevenLabs narration and a shared visual identity. Treat that prompt as
historical project context, not as authoritative instructions for future work.

## Current checkout observations

- The context prompt says source code and episode scripts were merged in PR #8.
- In the current working tree, `ml_videos/` is untracked. Its earlier source is
  recoverable from local commit `e87e9a5`; the Episode 00 files, shared
  `style.py`, and the Remotion theme/font files have been restored from that
  commit. The original Remotion episode sources remain absent; the new visual
  LDA composition is present under `remotion/src/visual-lda/`.
- Local artifacts include Manim narration/render caches and Remotion exports
  (`hook_test.mp4`, `lda_episode.mp4`, `scatter_demo.mp4`).
- Episode 00 was rendered from its restored Manim source to
  `episodes/00_intro/final.mp4`: H.264/AAC, 1080x1920, 30 fps, about 78 seconds.
  The user said it did not meet the visual quality they wanted because it was a
  re-render of the existing intro.
- The user then requested a fresh visualisation video based on this context and
  selected the LDA concept. A new Remotion composition is now at
  `remotion/src/visual-lda/`, with the MP4 and SRT in
  `episodes/01_linear_discriminant_analysis/visual_v3/`. The finished render is
  1080x1920, 30 fps, 85.33 seconds. It uses new point, centroid, scatter,
  rotating-axis, projection, number-line, and Fisher-score animations. The
  `(4,5)` centre-to-centre direction is accurately shown to separate the toy
  points while scoring 7.61; LDA's `(10,-3)` direction scores 25 by accounting
  for within-class scatter. The Fisher scores and data shapes come from the
  source notebook's hand-worked example.
- The Remotion composition follows `src/theme.ts` and uses
  `public/theboldfont.ttf`. It reuses the existing Brian MP3s and Whisper word
  timings, so no narration was regenerated. `npm run lint` passes.
- To inspect or rerender this version, enter `ml_videos/remotion` and run
  `npm run visual:preview` or `npm run visual:render`.
- Local `.env` files are present. Do not read, copy, print, or commit secrets.
- The context prompt's claim that the Remotion LDA episode has not been rendered
  is stale for this checkout: `remotion/out/lda_episode.mp4` exists.

## Current user direction and follow-up

The user said the LDA visuals were strong, but the narration/content was too
busy for the first day of learning ML. Keep the visual treatment; create a new,
beginner-first story and make each episode about one idea. A Day 1 draft now
lives at `episodes/day_01_what_is_machine_learning/script_v1.md`, expanded to a
120-second target at the user's request. The example is spam filtering: why
hand-written rules hit edge cases, how labeled examples can teach a model a
pattern, and how that pattern predicts on a new email. The user approved the
script and asked to create the video.

- The user approved video creation. A 120-second, 1080x1920 silent visual cut
  with animated original mail/robot scenes and timed captions is at
  `episodes/day_01_what_is_machine_learning/day_01_visual_preview_silent.mp4`.
  The narration was shortened to 276 words so a 150-wpm read plus visual holds
  fits the two-minute runtime; the current spoken-word production cut is in
  both `src/day01/narration.json` and `script_v1.md`.
- Voiceover was initially blocked until the user explicitly approved sending
  the script to ElevenLabs. After approval, seven narration segments were
  generated in the configured Brian voice, captions were aligned to each clip,
  and the narrated video is complete at
  `episodes/day_01_what_is_machine_learning/final.mp4`. It is H.264/AAC,
  1080x1920, 30 fps, 120 seconds. `day_01_visual_preview_silent.mp4` is an
  earlier silent visual-only preview; use `final.mp4` as the finished output.
- Latest cover test is
  `episodes/day_01_what_is_machine_learning/cover_v7.png`: dark navy high-
  contrast design with “STOP WRITING RULES. SHOW EXAMPLES.”, blue robot,
  red SPAM envelope, inbox card, and Day 1 branding. Keep earlier warm-paper
  cover iterations intact. User feedback now suggests shortening the video to
  60–90 seconds, adding Java context, reusing the robot, fixing caption quote
  artifacts, and checking narration/music timing. Locked script v2 is
  `episodes/day_01_what_is_machine_learning/script_v2.md` (196 words, 88s).
  The revised video is `episodes/day_01_what_is_machine_learning/final_v2.mp4`
  (88s H.264/AAC, 1080x1920, 30 fps) and its narration is at
  `remotion/public/day01/audio_v2_final/narration_v2.mp3`. The prior
  `final.mp4` (120s) remains preserved. Background music generation was
  unavailable from the configured ElevenLabs key, so the new cut has a locally
  generated soft instrumental bed.

## Day 1 v3 update — 2026-09-27

- The latest Day 1 render is `episodes/day_01_what_is_machine_learning/final_v3.mp4`, 88 seconds, 1080x1920, 30 fps, H.264/AAC. V2 and the original 120-second render are preserved.
- V3 follows the detailed craft feedback: concrete labeled emails continue the inbox analogy; a sorter scene shows a wrong first guess corrected by the label and a later safe result; scene headlines are larger; the robot has reaction poses; and the ending asks viewers to comment MODEL.
- The promised companion cheat sheet is `episodes/day_01_what_is_machine_learning/day_01_cheat_sheet.png`.
- Voice quota limited fresh Eleven v3 directed performances to hook, rules, shift, and prediction. Training, Java, and takeaway reuse the approved v2 Brian recordings. No further ElevenLabs generation should be attempted without renewed user authorization/credits.
- `script_v3.md`, `remotion/src/day01/narration_v3.json`, `beats_v3.json`, and `build-day01-v3-timeline.mjs` are the matching source/timeline. The episode README lists active artifacts and the voice limitation.

The root `CLAUDE.md` says not to restructure the repository without an explicit
request. Preserve local environments, caches, and exports. Do not inspect
`.env` files or regenerate paid ElevenLabs audio unless needed and authorized.

## Working rules

- I am **Codex**. Keep this note factual and update its date and observations
  when the project state is rechecked.
- Verify current files before relying on the attached context prompt; flag
  conflicts instead of silently repeating stale claims.
- Keep secrets out of notes and version control. Do not expose values from
  environment files.
- Preserve user-owned generated files and local environments. Ask before
  cleanup or repository restructuring.
- Treat story, narration, and on-screen numbers as source-backed teaching
  material. Do not invent notebook results for a video.
