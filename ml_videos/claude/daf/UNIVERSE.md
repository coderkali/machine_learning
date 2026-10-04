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
