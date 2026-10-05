# Day 2 — first self-recording test (2026-09-29, iPhone Voice Memos, sitting, no mic)

Files: `~/Documents/Instagram_Youtube_Reels/Recodings/Day2/{Hook,Problem,INTUTION}.m4a` → cleaned by
`scripts/clean-voice.mjs` into `remotion/public/day_02/rec_clean/` → `out/day_02/episode_sample_v2.mp4` (52 s, 3 parts).

| Measure | Result | Verdict |
|---|---|---|
| Room noise floor | −66 to −68 dB | ✅ very quiet room |
| Level | −27.7 LUFS, peaks −12 dB | ✅ safe headroom (raised to −14 in master) |
| Pace (raw) | 134–146 wpm | ✅ good; after pause-tightening ≈ 160 |
| Pauses | 7–11 per part, 0.5–1.8 s | 🟡 fixed in cleanup (shortened to 0.42 s) |
| Pitch movement (energy) | ≈ 4.5 semitones (10–90 %) | ❌ flat: Viraj 9–12, AI clone 6–10 |
| Clarity | "Day 2" heard "a D2"; "x equals" low confidence | 🟡 slow down on key terms |
| Grammar vs script | "we trust always a types", "does Python knows what is x is", "is this going to be break", "create int inside the box, but only number goes in", "the variable just a label, you are going to stick on it" | 🟡 read these lines as written |
| Opening | "Hello everyone, my name is Kali…" → topic only at ~8 s | ❌ QA: topic must be in first 5 s |

Pipeline lesson: never use ffmpeg `silenceremove` on real speech (it cut "As a Java developer"); `clean-voice.mjs`
shortens only detected silences.

## Parts 4–8 (same morning, 06:14)

| Part | Pitch movement (st, 10–90 %) | wpm | Notes |
|---|---|---|---|
| Visual | 5.3 | 96 raw | "label" heard as "level" (×2) — key word, practise the "a" in LAY-bel |
| Technical | 4.9 | 136 | "not before" heard "not the v4"; filler "So think as a" |
| Java | 4.0 | 161 | clean |
| Example | 4.5 | 133 | "Java can't do" heard "can do" — check the t |
| Recap | **5.9** (best) | 138 | "tomorrow" cut (Day ≠ calendar day); sign-off "That's it… thank you for watching" cut (end on the teaser) |

Full video: `out/day_02/episode_v3.mp4` (134.8 s) + `thumbnail.png`. QA: motion/loudness/thumbnail pass;
fails only on recording items (greeting before topic; own phrasing vs text).

## Voice Changer test (ElevenLabs speech-to-speech, own clone, 2026-09-29)

`scripts/voice-changer.mjs day_02 --beats visual,java,example,recap --confirm` (key now has speech_to_speech;
≈ 1,060 credits for 64 s) → `public/day_02/rec_sts/`. A/B: `out/day_02/AB_1_Original_1min.mp3` vs `AB_2_VoiceChanger_1min.mp3`.
- Clearer key words: "label" (was heard "level") and "can't" (was "can") now transcribed right; background noise −50…−65 → −73…−84 dB.
- Energy not improved: pitch movement 5.1 → 4.7 st average (slightly flatter). Wording errors kept.
- Recap got worse in one spot ("values have types" → heard "do you have it types").
Decision pending: creator listens to the A/B.

## Re-record 2 (2026-09-30, Hook/Problem/Intuition, `Recodings/VoiceTest_Sep30`)

| Part | Energy raw (st) Sep 29 → Sep 30 | After Voice Changer | wpm | Level (LUFS) |
|---|---|---|---|---|
| Hook | 4.7 → 5.0 | 4.3 → 4.0 | 146 → 150 | −27.6 → −21.8 |
| Problem | 4.3 → **6.1** | 4.3 → 5.2 | 140 → 135 | −27.8 → −23.7 |
| Intuition | 4.4 → **6.6** | 4.3 → 5.4 | 134 → 148 | −27.9 → −22.0 |
Median pitch rose 125 → 135 Hz (more lift). Grammar better ("we always trusted types", "value has a type",
"you stick onto it"); still: "Hello everyone" opener, "this is a Day 2", "what is x is", "going to be definitely break".
Voice Changer flattens ≈ 1 st and pulls pitch back to ≈ 122 Hz — it eats part of his energy gain.
Video: `out/day_02/episode_v9.mp4` (131 s). Old STS parts kept in `public/day_02/rec_sts_sep29/`.

## Re-record 2, parts 4–8 (2026-09-30 12:16)

| Part | Energy raw (st) Sep 29 → Sep 30 | wpm Sep 30 |
|---|---|---|
| Visual | 5.3 → **6.9** | 165 |
| Technical | 4.9 → 5.3 | 108 (slow) |
| Java | 4.0 → 4.8 | 147 |
| Example | 4.5 → 5.8 | 151 |
| Recap | 5.9 → 5.2 ⬇ | 130 |
All 8 parts: 4.9 → 5.7 average (+16 %); median pitch ≈ +8 Hz. Edits: Recap cut "This is called" + "Thank you for watching";
Example cut self-correction "Python, sorry,". Still: "label" → "level" (Visual), "string" → "shrink", "Hello everyone" opener.
"That's called dynamic typing" moved to the start of Technical (card moved with it). Day02.tsx now uses `opt()` cues
(hidden when a word isn't said). Video: `out/day_02/episode_v12.mp4` (131 s, all 8 parts from Sep 30, Voice Changer).
