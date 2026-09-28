# Production Plan — how every episode gets made

**Written:** 2026-09-27, after checking the machine against `~/Downloads/ml_videos_context_prompt.md`
(an older cloud-session snapshot) and Codex's notes. Nothing below has been generated yet.

---

## 1. What is actually installed (checked 2026-09-27)

| Piece | State on this Mac | vs. the old context prompt |
|---|---|---|
| Node / npm | Node 24.13.1 | ✅ |
| Remotion | 4.0.529 installed in `remotion/node_modules` | ✅ same version |
| FFmpeg / ffprobe | Homebrew, on PATH | ✅ |
| Whisper.cpp | Built (`remotion/whisper.cpp/main`) + `ggml-small.en.bin` model downloaded | ✅ the ~466 MB download is already done |
| Manim 0.21 + manim-voiceover | Only in `ml_videos/.venv` | ✅ works, but see decision below |
| ElevenLabs | Key in `.env` (not read). Voice Brian `nPczCjzI2devNBz1zQrb`, model `eleven_multilingual_v2` | ✅; STT scope still missing → keep local Whisper |
| Remotion sources | Only `src/day01/` and `src/visual-lda/` exist | ⚠️ `Root.tsx`, `LDAEpisode.tsx`, `generate-audio.mjs`, `caption-audio.mjs`, `fix-captions.mjs`, `sub.mjs`, `whisper-config.mjs` from the prompt are **gone** from this checkout |
| Renders | `out/lda_visual_v3.mp4`, `out/day_01_*`, `episodes/day_01_…/final.mp4` | ⚠️ prompt says Remotion LDA was never rendered — stale, it was |

## 2. What went wrong in the current Day 1 audio (must not repeat)

1. **Audio was bent to fit the visuals.** `build-day01-v2-timeline.mjs` forces each beat to a fixed
   length (hook = 9 s, but Brian's natural read is 6.4 s; rules = 12 s, natural 12.6 s) and TTS speed
   was pushed to 0.72. That is why the read sounds slow and flat.
   → **New rule: audio first. Visual timing follows the recorded voice, never the other way.**
2. **Captions are guessed, not heard.** Caption timings are spread evenly by word count, so they drift
   from the voice — worst exactly where the voice pauses for effect.
   → **New rule: captions come from Whisper word timestamps** (already installed, free).
3. **Too quiet.** `narration_v2.mp3` measures **−24.5 LUFS**. Reels/Shorts play at about −14, so
   Day 1 sounds ~10 dB quieter than the videos around it.
   → **New rule: master every episode to −14 LUFS, true peak −1 dB.**

## 3. Decisions (answers to the prompt's open questions)

| Open question | Decision | Why |
|---|---|---|
| Manim or Remotion? | **Remotion only.** Manim stays installed, untouched, not used. | Both episodes you liked (Day 1, visual LDA) are Remotion; the Manim renders were judged not good enough. One toolchain = no palette drift between `style.py` and `theme.ts`. |
| Captions without ElevenLabs STT? | **Local Whisper `small.en`** + an automatic check that compares Whisper's words to the script and fixes/flags mismatches. | Replaces the manual `fix-captions.mjs` patching; the script text is always the source of truth for spelling. |
| Production schedule? | `SERIES_ROADMAP.md` (locked, 84 days). | — |
| Approval gates? | **Yes, 3 gates per episode** (script → voice → final cut). | You catch problems before money (voice) or time (render) is spent. |
| Move `ml_videos/`? | **No.** Stays where it is. | `CLAUDE.md` forbids restructuring without an explicit request. |
| Thumbnails? | Rendered **by Remotion from code** (a `Still` composition), using the robot already drawn in `src/day01/video.tsx` + a coffee mug. | Pixel-identical layout every day; no AI image drift, no cost. |

## 4. Phase 0 — one-time setup (free, no ElevenLabs calls)

Build the reusable pipeline once so Day 2…84 are "fill in the episode files, run 4 commands".

| # | Build | Output |
|---|---|---|
| 0.1 | `remotion/src/shared/` — pull reusable parts out of Day 1: robot (with poses), header/Day badge, caption box, progress bar, end card, theme | Day N imports these instead of copy-pasting Day 1 |
| 0.2 | Episode data format: `remotion/src/episodes/day_NN/voice.json` (per beat: id, text, model, v3 tags, v2 settings, chosen seed) | One file drives voice generation |
| 0.3 | `scripts/voice.mjs day_NN [beat] [--takes 3] [--model v3\|v2]` — generates takes into `public/day_NN/takes/`, never overwrites | Pick-the-best workflow |
| 0.4 | `scripts/master.mjs day_NN` — trim silences, stitch chosen takes with the gap rules (0.25 / 0.6 / 0.15 s), optional music bed ducked, loudnorm to −14 LUFS | `public/day_NN/narration.wav` + beat timestamps |
| 0.5 | `scripts/captions.mjs day_NN` — Whisper word timestamps → align to script text → caption JSON; prints any word it couldn't match | Captions that match the voice exactly |
| 0.6 | `scripts/timeline.mjs day_NN` — beat lengths = real audio + hold; writes `timeline.json` the video reads | Visuals follow the voice |
| 0.7 | `Thumbnail` Still composition to the §5b spec + `npm run thumb day_NN` | `episodes/day_NN_<slug>/thumbnail.png` |
| 0.8 | `scripts/qa.mjs day_NN` — checks: LUFS −14 ±1, duration 60–90 s, 1080×1920 30 fps, no caption outside safe zone, thumbnail text inside the 3:4 grid crop | Pass/fail list before you review |

Day 1's existing files stay as they are; new versions get new names.

## 5. Phase 1 — finish Day 1 with the new pipeline

1. **Voice test (tiny cost, needs your OK):** Beat 1 on `eleven_v3` × 3 takes vs. on v2 with the new
   settings. You listen and pick the model — then that model is locked for the series.
2. Generate Beats 1–7 (3 takes each) from `claude/episodes/day_01/voiceover_sheet_v2.md` (v1 is in `_backup/2026-09-27/`). **Gate 2: you approve the voice.**
3. Master → captions → timeline. Adjust Day 1 scenes to the new beat lengths; update Beat 2 text
   on screen, the Day 2 teaser and the end card.
4. Render `final_v3.mp4` + `thumbnail.png`; run QA. **Gate 3: you approve the cut.**

## 6. Phase 2 — the loop for every new episode (Day 2 onward)

```
 1. Script        AI writes script.md + voiceover_sheet.md from the notes folder  ── Gate 1: you approve
 2. Voice         voice.mjs → 3 takes/beat → pick best → master.mjs              ── Gate 2: you approve
 3. Captions      captions.mjs (Whisper) + timeline.mjs
 4. Visuals       animated technical explainer (ANIMATION_GUIDE.md): scenes in Remotion, elements cued to spoken words
 5. Render        final.mp4 + thumbnail.png + caption.txt (post text & hashtags)
 6. QA            qa.mjs + phone-speaker listen + grid-crop check               ── Gate 3: you approve
 7. Post          you post; Claude updates CLAUDE_MEMORY.md (done, date, notes)
```

- Work **2–3 episodes ahead** of posting, so a busy week never breaks the streak.
- Rough ElevenLabs usage: ~200 words ≈ 1,200 characters per episode; with 3 takes per beat
  ≈ 3,600–4,000 characters per episode. Check your plan's monthly credits against 84 episodes.

**Update 2026-09-27:** at the creator's request the loop above runs from **one prompt**. See
`claude/skills/make-episode/SKILL.md`. Gates 1–2 are automatic (script from the notes, voice takes
auto-picked by Whisper score); the creator reviews once, at the end (Gate 3).

## 7. What Claude will not do without asking

- Call ElevenLabs (every generation costs credits).
- Overwrite or delete an existing render, audio file or Codex's files.
- Change the locked roadmap, voice guide or thumbnail spec.
- Post anything anywhere.
