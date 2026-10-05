# Intro — Kali's own recording, take 1 (2026-10-02, iPhone Voice Memos Lossless → .qta)

Files: `~/Documents/Instagram_Youtube_Reels/Recodings/Intro/*.qta` (AAC + Apple spatial track) → AAC extracted with
`ffmpeg -map 0:a:0 -c:a copy` → `remotion/public/day_00/raw/*.m4a` → `clean-voice.mjs` → `public/day_00/rec_clean/`.

| Part | Energy (st) | wpm | Notes |
|---|---|---|---|
| Question | 4.3 | 134 | 33 s (sheet ≈ 24 s): extra "Hello everyone", "I'm going to help you visually and how to learn those things"; "Java eyes" heard "Javaize" |
| Products | 4.7 | 138 | extras "So, think about in a different way. So, nowadays", "everything is inside the MLs, right?"; "if-else" heard "Efels" |
| Services | 5.7 | 138 | "who connects those models to those jobs" (sheet: the app); "Us" heard "Aaj" |
| Team | 5.0 | 155 | fine; extra "when it succeeds" |
| Map | **6.4** | 134 | **cut off after "in the order I actually"** — "learned it" missing |
| Python | 4.3 | 127 | fine ("obviously") |
| Math | 4.5 | 130 | fine |
| Data | 3.8 | 119 | flattest part |
| ML | 4.5 | 122 | "from date 37" (day); extra "Here, we are going to do" |
| Ship | 5.2 | 108 | **"ensembles" said as "assembling"**; slow |
| Promise | 5.8 | 144 | background noise (floor −35 dB); extras "Well, I can promise you that", "and that will help you to make understand" |
| Start | 5.9 | 124 | background noise (−34 dB); sign-off "like me. Thank you for watching." |
Average energy 5.0 (Day 2 Sep 30: 5.7). Median pitch 132–145 Hz (good lift).
Length after cleanup ≈ 213 s → over the 180 s hard limit. Needs cuts (~21 s of extras listed above) + shorter re-takes.
clean-voice.mjs now adapts its silence threshold to each file's noise floor; analyze/clean accept .qta.

## Take 2 (Map, Question, Ship re-recorded 15:51) → video
- Map was NOT cut off: Whisper drops a final word when audio ends right after it → analyze-recording.mjs now pads 1.5 s.
- Ship energy 7.3 (best ever), "ensembles" correct; Question 28.7 s (was 36.1).
- Cuts (raw seconds) in `remotion/public/day_00/rec_clean/CUTS.txt`; clean with `--max-pause 0.5 --keep-pause 0.36` → 176.8 s.
- Voice Changer all 12 (≈ 2,940 credits) → master 178.1 s (just under 180). Day00.tsx cues re-pointed to his words
  (my, blocks, jobs, answers, fails, checks) + new steps (catch, likeThat, starts, topic, afterW).
- Video: `remotion/out/day_00/episode_v8.mp4`. QA: context ✅ (no "Hello everyone"), motion ✅; only word-match fails.
- Viraj-version data backed up in `_backup/2026-10-02_intro_viraj_data/`.

## MIC take (2026-10-03, `Recodings/Intro_Mic/*.m4a`, sheet v4 Indian-teacher style)
Energy raw avg 5.4 (phone 5.0); median pitch 144–155 Hz (phone 132–145). Level low (−31…−33 LUFS): raise mic gain.
Best: Map 6.8, Promise 6.3, Start 6.1, Products/Python 5.9. Flattest: ML 3.7, Data 3.8.
Still unclear: "Us" (heard urge/edge), "Java eyes" (ISE), "Day" → "date", "capstone" (capstan/kefton), "if-else" (Efels), "learn" → "mean".
Cuts `public/day_00/rec_clean/CUTS_mic.txt` (verified by level + snippet transcripts for Services). Total 153 s.
Video: `remotion/out/day_00/episode_v12.mp4`. Phone-take STS kept in `public/day_00/rec_sts_phone/`.
Pipeline lessons: (1) never pipe paid scripts into `head` (SIGPIPE stopped voice-changer after 2 parts);
(2) captions.mjs now transcribes PER BEAT with padding (whole-mix Whisper squeezed ML timestamps).
