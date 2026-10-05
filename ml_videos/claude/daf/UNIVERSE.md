# The Delhi Air Forecast universe (series bible)

Read this before writing any DAF video. Facts come only from
`MACHINE_LEARNING/18_Projects/01_Delhi_Air_Forecast/` (tickets, notebooks, decisions,
`reports/experiments.csv`). Nothing invented.

## Format (locked 2026-10-04)

- 9:16, 1080×1920, 30 fps. Trailer first, then one video per ticket, DAF-01 → DAF-18.
- Length: as long as the ticket needs (≈3–4 min). Over 3:00 is fine for Kali's own recall;
  for publishing, Shorts/Reels cap at 3:00, so long ones get a Part 1 / Part 2 cut later.
- Voices (2026-10-04): ONE storyteller = narrator, Viraj (`fPIfC3elMLbN9tNwMXkw`) now, Kali's
  voice at publish. Rishi (Java dev) = **Raj** (`FwuKjlVpi0N3exead7ji`, picked 2026-10-04), ONE line per doubt on a yellow
  DOUBT card, then leaves; never a back-and-forth. Asha never speaks (shown only).
  Ask before every ElevenLabs call. No music.
- Creator folder (Kali, 2026-10-04): `~/Documents/Instagram_Youtube_Reels/DAF/` → `Trailer/Part1|Part2/`,
  `Episodes/DAF-NN/`, `Voice_Previews/`. Each part folder: all versions `<prefix>_vN.mp4` (one `_FINAL`),
  one `thumbnail.png`, `VERSIONS.md` (what changed per version), `audio/` (approved audio first).
  Copy ONLY with `node scripts/daf-publish.mjs day_NN <dest> <prefix> [--audio|--final]`, then add the VERSIONS.md line.
  Workflow: script → complete audio (`--audio`) → Kali approves → video. Working files stay in Claude's folders.

## The cast

| Character | Who | Job in every video |
|---|---|---|
| **Narrator** | The storyteller/teacher, desi-teacher English (PHRASE_BANK.md) | Tells the whole story; toy example first, then the real project |
| **Asha madam** | Runs a primary school in Delhi; decides at 6 pm if 600 children assemble outside tomorrow | Shown only (no voice); opens each ticket with *why it matters* |
| **Rishi** | A Java developer learning ML (name can change) | Pops in on a yellow DOUBT card with the real doubts Kali asked; one line, then leaves |
| **Persistence** ("tomorrow = today") | Asha's old method; the rival every model must beat | Appears as a grey shadow line on every scoreboard |

## Recurring screen elements

- **Project map:** strip DAF-01 … DAF-24; done boxes glow, current box pulses.
- **Scoreboard:** model MAE vs persistence MAE, Poor-day recall (from DAF-06 on).
- **Decision cards:** D-001 … D-007 stamp "SIGNED" in the episode they were made.
- **The Poor line:** PM2.5 = 91 µg/m³, always a red dashed line.

## Episode shape

Last time (answer previous recall question) → Asha's problem → Concept on a toy
example with 2–3 student doubts → What we really did (real numbers) → Here's the
catch → Recall card (Problem · Root cause · Fix · Pattern · Gotcha + 1 question).

## Key facts (for trailers and recaps)

- Target: tomorrow's 24-hour mean PM2.5 (00:00–23:59 IST), predicted at 18:00 IST.
- Poor or worse = PM2.5 ≥ 91. Success = MAE ≥10% better than persistence, recall not worse.
- Data: OpenAQ sensors (S3 archive + API v3), Open-Meteo weather. 50 stations passed the
  2-year rule → 44 in the recent window → version one on 1 station, R K Puram (D-005),
  488 usable days, a single winter.
- First real MAE at DAF-07. 24 experiment rows logged by DAF-17.
- DAF-17 cross-validation: Ridge 36.46, persistence 37.89, tuned HGB trees 47.68 → simple
  Ridge beat the fancy trees; frozen as D-007. Walk-forward (DAF-16): Ridge 30.38 vs 35.35.
- DAF-18 (sealed test) not run yet → the trailer's cliffhanger.

## Production status
- Episode ids: trailer part 1 = `day_201`, part 2 = `day_202` (pipeline needs numeric ids).
  Per-beat `voiceId` in voice.json = Rishi (Raj); `scripts/voice.mjs` honours it. Both voices on eleven_v3.
- Cast drawings + DoubtCard: `remotion/src/shared/daf/Cast.tsx`.
- 2026-10-04: Part 1 sample (beats mission → rival, 46 s) rendered:
  `remotion/out/day_201/episode_sample.mp4`, copied to `Instagram_Youtube_Reels/DAF/DAF_Trailer1_sample.mp4`.
  Superseded: script v4 → v5 (two parts). v5 opening (journey → for_whom, 95 s) rendered:
  `out/day_201/episode_opening.mp4` → `DAF/DAF_Trailer1_opening_sample.mp4`. Next: voice asha, rishi_intro, rival, catch, recall (rishi_hi reused), build catch + recall scenes.
- 2026-10-04: ✅ **Trailer Part 1 final** (script v5, 2:42): `remotion/out/day_201/episode_v6.mp4` (v6: chart labels moved from SVG <text> to HTML — **SVG <text> shakes frame-to-frame in multi-tab renders; never use SVG text, use HTML or paths**; v5 also: draw data lines fast) →
  `Instagram_Youtube_Reels/DAF/DAF_Trailer1_Why_This_Project.mp4` + `DAF_Trailer1_thumbnail.png`. QA: motion ✅,
  loudness ✅; "fails" left = Whisper numerals (40/600) + context-first opening (by Kali's design).
  Lesson: the v3 `[warm]` tag before a final line made Viraj add a chuckle → avoid emotion tags on a beat's last sentence.
  Next: Part 2 (`day_202`, script_v5 Part 2) → script stop already passed; voice + build + opening sample.
- 2026-10-04: ✅ **Trailer Part 2 final** (script v5 Part 2, 2:42): `remotion/out/day_202/episode_v3.mp4` →
  `Instagram_Youtube_Reels/DAF/DAF_Trailer2_Language_Rules_Plan.mp4` + `DAF_Trailer2_thumbnail.png`. QA motion ✅;
  accepted "fails" = Whisper numerals + recap opening. Shared helpers now in `src/shared/daf/ui.tsx` (ip, live, Box,
  Strike, CPCB table). DoubtCard now bobs (QA motion). Next: **DAF-01 episode** (id plan: `day_301`, part 2 = `day_302` if > 3 min).
- 2026-10-04: Trailer Part 2 **v2** (script v7, 3 ideas, 1:36, audio approved first) → `DAF/Trailer/Part2/DAF_Trailer_Part2_v2.mp4`
  (render `out/day_202/episode_v5.mp4`). Folder reorganised into Trailer/Part1|Part2 with VERSIONS.md. ✅ approved as FINAL (2026-10-04).
- 2026-10-04: Trailer VOICEOVER_SCRIPT.md files written beside both finals. **DAF-01** = `day_301`: script
  `claude/daf/episodes/daf_01/script_v1.md` (25 beats, ~1,000 words), audio v1 6:22 REJECTED (step-by-step) → v2 concepts-only (script_v2.md, 4:13) →
  `DAF/Episodes/DAF-01/audio/DAF-01_v1_audio.mp3`. Waiting for Kali's audio approval → then scenes.
  Note: project README "How to run" is still the placeholder (DAF-01 acceptance item) — told Kali.
- 2026-10-04: **DAF-01 split** into Part 1 (`day_301`, 2:11) and Part 2 (`day_351`, 2:34; takes reused from day_301 +
  2 linking lines). IDs: DAF-NN part 1 = `day_3NN`, part 2 = `day_3(50+NN)`. Running picture: `shared/daf/House.tsx`
  (REPRODUCIBILITY roof on 4 pillars). Videos → `DAF/Episodes/DAF-01/Part1|Part2/` (+ VOICEOVER_SCRIPT.md). ✅ Both approved as FINAL (2026-10-04). Next: DAF-02 (`day_302` / `day_352`) in a new chat.
- 2026-10-04: **DAF-02** script v1.1 (`episodes/daf_02/script_v1.md`, +data-row beat) and visual plan with REAL rows
  (`episodes/daf_02/visual_plan_v1.md`: daily_17_clean.csv, DAF-06 cut 2026-03-01 → train 323 / test 164). Audio v1: Part 1 `day_302`
  2:52, Part 2 `day_352` 2:58 → `DAF/Episodes/DAF-02/Part1|Part2/audio/` (+VERSIONS.md, VOICEOVER_SCRIPT.md). Waiting for Kali's audio approval.
- 2026-10-05: DAF-02 audio approved → videos v1: `out/day_302/episode_v2.mp4` (2:52) and `out/day_352/episode_v2.mp4` (2:58) →
  `DAF/Episodes/DAF-02/Part1|Part2/DAF-02_PartN_v1.mp4` (+thumbnail). New shared `src/shared/daf/Req.tsx` (Contract pins, ProjectMap,
  Stamp, HourBars). QA: only Whisper-numeral + recap-opening fails. Waiting for Kali's video review. Next: DAF-03 (`day_303` / `day_353`).
- 2026-10-05: DAF-02 videos v1 REJECTED ("not showing the table or data", "only half screen"). v2 = data-first rebuild:
  `src/shared/daf/Stage.tsx` (full-height window 336→1406, caption at safe-zone bottom 1540, mascot steps down) +
  `src/shared/daf/DataTable.tsx` (real rows that fill, shift ↑, strike). Renders `out/day_302|day_352/episode_v4.mp4` →
  `DAF/Episodes/DAF-02/Part1|Part2/DAF-02_PartN_v2.mp4`. **Use Stage + DataTable for every future DAF episode.** Waiting for Kali's review.
- 2026-10-05: DAF-02 v2 videos also rejected (too many ideas, too fast, D-001/D-002 jargon unexplained; wants the data table
  PINNED at the top all video). New plan = 3 short videos, one question each, one new column per video:
  A `day_302` "What exactly do we predict?" (1:34) · B `day_352` "What can the model see at 6 pm?" (1:15) · C `day_402` "How do we know it's good?" (1:39).
  Script `episodes/daf_02/script_v2.md`; audio → `DAF/Episodes/DAF-02/Part1|Part2|Part3/audio/`. Old v1 data in `src/episodes/day_3x2/v1_backup/`.
  Waiting for audio approval. Kali will share Instagram reference reels (built-in browser shows them black when logged out → ask for files).
- 2026-10-05: DAF-02 v3 videos (pinned-table layout, `src/shared/daf/Pinned.tsx`: table on top all video, Zone below,
  DoubtLow, Takeaways): A `out/day_302/episode_v5.mp4` → Part1_v3 · B `out/day_352/episode_v5.mp4` → Part2_v3 ·
  C `out/day_402/episode.mp4` → Part3_v1. QA motion ✅ all three. Waiting for Kali's review. **This is the DAF template now.**
- 2026-10-05: ✅ **DAF-02 A, B, C approved as FINAL.** Part folders: Part1_v3_FINAL, Part2_v3_FINAL, Part3_v1_FINAL; all three + audio +
  DAF-02_SCRIPTS.md copied to `DAF/Episodes/DAF-02/FINAL/`. Next: DAF-03 with the same pinned-table template
  (ids: day_303 / day_353 / day_403). Kali's PVC voice exists ("Kali – Teacher", v2 models only) — see memory kali-pvc-voice.
