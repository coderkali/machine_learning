# Claude history — ML for Java Developers (archive; the short brief is CLAUDE_MEMORY.md)

**Last updated:** 2026-09-27 (Phase 0 built)

## Who / what

- The creator is a Java developer who learned ML in this order: Python → Math → Data Science → ML.
  The series shows that journey, one idea per "Day", as Instagram Reels / YouTube Shorts.
- Source material = their own notes in `MACHINE_LEARNING/01_Python`, `03_Math`, `02_DataScience`,
  `04_ML` (the `Concept/` subfolders). Folder names/numbers are messy and are **not** teaching order;
  `SERIES_ROADMAP.md` is the order.
- Scripts are written by AI from those notes; the creator approves before voice/render.

## Locked decisions (do not change)

- **Roadmap:** 84 days, 9 arcs — `SERIES_ROADMAP.md`. Never insert/reorder/renumber; new material =
  bonus episode or new season (Day 85+).
- **Day 1** = What is Machine Learning? (spam filter). **Day 2** = Why Python for ML (as a Java dev).
- **Thumbnails (§5b v2, approved 2026-09-27):** white background, Impact headline in 3–5 tilted
  black/yellow/red/white boxes (exactly one red), DAY badge top-left, yellow tick bursts, 1–3 row
  diagram of the episode's MAIN IDEA from the notes (not the in-video example), and the original dev
  mascot full height on the right (`src/shared/DevMascot.tsx`). Not the Rick character from the
  creator's reference (copyright). The first version (light bg + blue robot) was rejected.
- **Voice:** Viraj (Indian English, eleven_v3 with emotion tags) since 2026-09-27; one directed take per beat, tone palette in `VOICE_GUIDE.md`. Model eleven_v3 (approved
  2026-09-27; v2 text kept in voice.json as a fallback).

## Pipeline (decided 2026-09-27 — see PRODUCTION_PLAN.md)

- **Remotion only** (4.0.529, `ml_videos/remotion`). Manim (in `ml_videos/.venv`) is kept but not used.
- Audio first: visuals follow the recorded voice. Captions from local Whisper `small.en`
  (`remotion/whisper.cpp/main`, already built). Master to −14 LUFS.
- 3 approval gates per episode: script → voice → final cut.
- The old context prompt (`~/Downloads/ml_videos_context_prompt.md`) is partly stale: its Root.tsx,
  LDAEpisode.tsx and caption/audio scripts no longer exist in this checkout.

## Current state

- Day 1 video exists: `episodes/day_01_what_is_machine_learning/final.mp4` (120 s), `final_v2.mp4` (and `final_v3.mp4` from the other agent);
  locked 88 s script is `script_v2.md`. Rendered with Remotion (`remotion/src/day01/`), Brian voice,
  audio script `remotion/scripts/generate-day01-audio.mjs` (v2 model, speeds 0.72–1.05).
- Day 1 still needs, before posting:
  1. Beat 2 line reworded (arrow not speakable) and Beat 7 teaser changed to Day 2 = Python.
  2. ✅ Re-recorded with Viraj per `episodes/day_01/voiceover_sheet_v2.md`.
  3. ✅ Thumbnail done and approved (2026-09-27): `remotion/out/day_01/thumbnail.png`.
  4. Existing Day 1 audio problems: beats forced to fixed lengths, TTS speed 0.72, captions spread by
     word count (not heard), narration at −24.5 LUFS (too quiet).
- **Phase 0 of PRODUCTION_PLAN.md approved by the creator on 2026-09-27** (free setup only).
  The Beat 1 v3-vs-v2 voice test and all ElevenLabs calls are still NOT approved.
- **Phase 0 built 2026-09-27** (see "Pipeline — how to run" below). Tested end-to-end on the old
  Day 1 audio (`public/day01/audio_v2/`), no ElevenLabs calls. Day 1 QA: everything passes except
  "voice says the script" — the old audio still has the old Beat 2 line, drops "still" in Beat 5 and
  has the old Day 2 teaser. That is exactly what the Phase 1 re-record fixes.
- **Another agent is working on Day 1 in parallel** (seen 2026-09-27 05:57–06:20): it edited
  `src/day01/video.tsx`, added `public/day01/audio_v3*`, `scripts/build-day01-v3-timeline.mjs`,
  `episodes/day_01_…/final_v3.mp4` and `day_01_cheat_sheet.png`. Claude did not touch any of these.
  Phase 1's planned output name `final_v3.mp4` is now taken → use `final_v4.mp4`.
- `npm run lint` **hangs** in ESLint on `src/day01/video.tsx` (pre-existing file, not Claude's). Until
  that file is fixed, lint with: `npx eslint src --ignore-pattern src/day01/video.tsx && npx tsc` (both clean).

## ▶ One-prompt production (read this first for any new episode)

- **Skill:** `claude/skills/make-episode/SKILL.md`. "Make Day N" = follow it end to end: script →
  voice (paid) → autopick → master → captions → timeline → scenes → thumbnail → render → QA → report.
- **Approval flow (creator, 2026-09-27, updated after Day 1):** (1) **show the script first** as a beat table
  (said + on screen) and wait for approval: no voice before that; (2) 30 s sample of beats 1–3 and wait for
  approval; (3) then the rest runs by itself, including ElevenLabs within the skill's budget (3 takes/beat ≈
  4–4.5k chars + max one 1-take re-record per failing beat). The creator said Day 1 had "some disturbances,
  but that's okay"; ask what they were so they're avoided from Day 2 on.
- Voice = eleven_v3 with emotion tags, Brian. Claude auto-picks takes (`npm run autopick`,
  report in `out/day_NN/takes_report.md`); the creator reviews the final video.

## Day 1 status (2026-09-27, updated after viewer feedback)

- **Script v2 approved** (topic first, one Java thread, chapters): `claude/episodes/day_01/voiceover_sheet_v2.md`,
  data in `remotion/src/episodes/day_01/voice.json` + `episode.json` (chapters, titleCard, thumbnail).
- **Scenes rebuilt** for v2: `remotion/src/episodes/day_01/Day01.tsx` (title card → inbox → your Java rules →
  maze → flip → examples.csv → clues → MODEL → TRAINING → prediction → Java 2 steps → recap → DAY 1 DONE → next).
- **Placeholder render:** `_backup/2026-09-27/remotion/out/day_01/episode_placeholder.mp4` (70 s), voiced by the robotic macOS "Rishi"
  (now in `_backup/2026-09-27/remotion/public/day_01/placeholder/`), for timing only. QA: all pass except the caption match (the robot garbles "you won a prize").
  The older `episode_proto.mp4` (pre-feedback) is in `_backup/2026-09-27/`.
- **Series voice chosen 2026-09-27: Viraj - Confident and Natural** (Indian English, ElevenLabs library,
  voice_id `fPIfC3elMLbN9tNwMXkw`, owner `7398804d…66f6`; set in `day_01/voice.json → voice`; copy it into every
  episode). The creator also liked Monika (`2zRM7PkgwBPiau2jvVXc`, female) but chose Viraj to match the male
  mascot. `voice.mjs` adds Viraj to "My Voices" automatically on the first paid run. Day 1 ≈ 3,615 characters.
- **ElevenLabs upgraded by the creator 2026-09-27.** The API key lacks `voices_write` and `user_read`
  permissions: `voice.mjs` can't add Viraj to My Voices or read the quota, but TTS by voice ID works (both
  steps are now non-fatal warnings).
- **30 s sample approved** by the creator (`_backup/2026-09-27/remotion/out/day_01/episode_sample30.mp4`).
- **✅ DAY 1 FINAL RENDERED 2026-09-27:** `remotion/out/day_01/episode.mp4` (75.1 s, Viraj v3, −14.2 LUFS) +
  `remotion/out/day_01/thumbnail.png`. QA: all pass (1 warning: an extra "the" in the Java beat). Takes: hook t3,
  rules t1, shift t2, training t1, prediction t2, **java t3 (manual override: t2 slurred "maze")**, takeaway t2.
  ElevenLabs used for Day 1 ≈ 3,615 chars (21 takes). Waiting for the creator's final review, then posting.
- Creator rule (2026-09-27): **never rush the voice or cut the story to hit a length**; 60–90 s ±5 s is fine
  (roadmap §2 + QA updated).

## Viewer feedback on Day 1 (2026-09-27) → changes

- Creator's spouse (Java dev who knows ML, target viewer) watched cold: (1) the English voice was hard to
  understand (it was the old slowed v2 test audio); (2) confusing: she read it as a video about spam, then
  about ML, then about Java devs switching careers, with no clear thread. Creator: viewers must get the context
  immediately.
- Decisions: **new voice = Indian English** (replaces Brian; specific voice not yet chosen); **series rule
  "context first + chapter bar + one Java thread"** added to roadmap §2, ANIMATION_GUIDE rules 7–9, the
  make-episode skill and QA. A new Day 1 script (topic stated in the first sentence, Java from beat 2) was
  proposed; the creator approved it **with changes still to be given**. Day 1 gets rebuilt around it.

## Pipeline — how to run (all in `ml_videos/remotion/`)

Episode data: `src/episodes/day_NN/episode.json` (title, next day, thumbnail blocks + diagram rows) and
`voice.json` (per beat: id, type, text, v3/v2 text + settings, seed, chosen take). Format:
`src/episodes/README.md`. Shared parts for every episode: `src/shared/` (Robot with poses + Java mug (video), DevMascot (thumbnail), anim timings `T`, `cue()`,
SeriesHeader, BeatHeading, CaptionBox, ProgressBar, EndCard, theme, `layout.json` = safe
zones). Series entry: `src/index.ts` (compositions `Thumbnail`, `EpisodeDraft`); Studio:
`npm run series:studio`. Day 1's old compositions (`src/day01/entry.tsx`) are untouched.

| Step | Command | Output |
|---|---|---|
| 0.3 voice | `npm run voice day_NN [beat] -- [--takes 3] [--model v3\|v2]` | **dry run** (plan + character count) |
| | `npm run voice -- day_NN [beat] --confirm` | **paid**: takes → `public/day_NN/takes/<beat>_<model>_tN.mp3`, seeds in `takes.json` |
| | `npm run voice -- day_NN <beat> --pick <file>` | sets `chosen` + `seed` in voice.json |
| 0.4 master | `npm run master day_NN` (`-- --music <public path>` optional) | `public/day_NN/mix/narration[_vN].wav` at −14 LUFS / ≤ −1 dBTP + `generated/master.json` |
| | test with old audio: `npm run master -- day_01 --takes-from day01/audio_v2` | |
| 0.5 captions | `npm run captions day_NN` (`-- --strict` exits 1 on mismatch) | `generated/captions.json`; prints every word Whisper heard differently |
| 0.6 timeline | `npm run timeline day_NN` | `generated/timeline.json` (beat frames from real audio) |
| 0.7 thumb | `npm run thumb day_NN` | `out/day_NN/thumbnail[_vN].png` + `thumbnail_grid(_200).png` |
| autopick | `npm run autopick day_NN` | picks the best take per beat by Whisper score → `voice.json` + `out/day_NN/takes_report.md` |
| draft | `npm run draft day_NN` | `out/day_NN/draft[_vN].mp4` (old placeholder template; superseded by `render`) |
| render | `npm run render day_NN` (`-- --tag proto` for test audio) | `out/day_NN/episode[_proto][_vN].mp4` (composition `DayNN`) |
| 0.8 qa | `npm run qa day_NN` | `out/day_NN/qa_report.md` / `.json`; exit 1 on any FAIL |

Nothing overwrites audio, renders or thumbnails — every new one gets `_v2`, `_v3`, …
(the `generated/*.json` files and the QA report are rewritten on each run).

**Folder rule (creator, 2026-09-27):** another agent works in `ml_videos/episodes/` and the Day 1
folders — Claude never goes there. All Claude outputs go to `remotion/out/day_NN/`.

Open points for the creator:
1. ✅ Thumbnail spec v2 approved and made standard (2026-09-27). History: v1 rejected
   (`_backup/2026-09-27/remotion/out/day_01/thumbnail_rejected_v1.png`); options A/B also in that backup;
   creator picked B with a "what is ML" diagram. Lesson: the thumbnail shows the episode's IDEA.
2. The series header sits at y≈66, inside the top 220 px Reels/Shorts can cover (QA warns).

## Video style — "animated technical explainer" (set 2026-09-27)

- The creator's rules: movement within the first second, each visual step brief, no long pauses or slow
  transitions, short on-screen labels, every movement explains the concept; medium-fast and responsive.
- Written up with timing defaults in `claude/ANIMATION_GUIDE.md` (also linked from roadmap §2 + §5 and
  PRODUCTION_PLAN §6). In code: `T` timings + `pop`/`draw` in `src/shared/anim.ts`;
  `cue(timeline, beatId, word)` in `src/shared/cues.ts` starts an element on its spoken word; the
  robot's idle bob is now opt-in (`idle`).
- QA checks motion: movement between 0 s and 1 s, and no still scene > 2 s (ffmpeg freezedetect on the
  scene area only). The draft's placeholder scenes fail the second check, which is correct.
  Real scenes are Phase 1 (Day 1) / Phase 2.

- **Animation references (creator, 2026-09-27):** instagram.com/reel/Dc5QmKhKk42 (neuralrotmedia, JWT,
  55 s) and instagram.com/reel/DdRTy7-M_9K (rick.theengineer, REST vs GraphQL, 160 s). What they share:
  light UI-style scene that keeps evolving (code panels, JSON, cards, flows, strike-throughs, zoom
  highlights), a change every 1–2 s cued to the spoken word, short captions with one highlighted keyword,
  a cartoon narrator at the side (theirs are Stewie / Rick & Morty — copyrighted, never copy). The creator
  wants "similar but a unique way". Claude's proposal: the scene is a Java dev's IDE/tool window, our own
  dev mascot narrates (same as the thumbnail), plus a Java-vs-Python split moment.

- **Prototype built 2026-09-27:** `_backup/2026-09-27/remotion/out/day_01/prototype_explainer.mp4` (19 s, hook + rules beats,
  old test audio). Code: `src/series/proto/Day01Proto.tsx` (composition `Day01Proto`). Stage = Java dev
  workspace window (Inbox + SpamRules.java tabs, rules counter, TEST RUN strip); every change cued to a
  spoken word via `cue()`; mascot lip-sync from audio volume (`useAudioData`), poses point/present;
  captions = dark pill with the spoken word in yellow. Passes both motion QA checks. Prototype captions
  come from `src/episodes/day_01/proto/script.json` (what the old audio says) via
  `captions.mjs --script … --tag proto` → `captions.proto.json`/`timeline.proto.json`; the real Day 1
  captions are untouched. Waiting for the creator's verdict.

## Folder cleanup (2026-09-27)

- At the creator's request, Claude's superseded files (test renders, rejected/option thumbnails, voice
  shortlist samples, old mixes v1–v6, the placeholder voice, proto captions/timelines, voiceover sheet v1)
  were **moved, not deleted**, to `ml_videos/_backup/2026-09-27/` with their original paths kept (manifest:
  its `README.md`). Codex's files and `episodes/` were not touched. Folder map: `claude/README.md`.
- Keep: `remotion/out/day_01/{episode.mp4, thumbnail*.png, qa_report.*, takes_report.md}`,
  `remotion/public/day_01/{takes/, mix/narration_v7.wav}`. All 21 takes are kept for re-picking.

## Working rules

- Keep all Claude notes in this `claude/` folder. Don't edit Codex's files.
- Don't read/print `.env` files. Don't call ElevenLabs (paid) without the creator's explicit OK.
- Facts, numbers and datasets in a video must come from the source notes — never invented.
- Preserve existing renders; new versions get new filenames.
- Never go into another agent's folders (`ml_videos/episodes/`, `remotion/src/day01/`,
  `remotion/public/day01/`). Claude's outputs go to `remotion/out/day_NN/`.
- When editing this file, never replace "to the end of the file" — that once deleted this section.
