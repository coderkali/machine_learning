# Claude brief — ML for Java Developers (read this first, it's all you need to start)

**Updated:** 2026-09-29 · Long history/decisions: `HISTORY.md` (read only if something here is unclear).
**One chat = one video.** Start a new chat with: *"Make Day N"* (or *"Make the intro"*) → follow
`skills/make-episode/SKILL.md`. At the end of the chat, update the "Status" table below and give the
creator the one-line prompt for the next chat.

## The series

- Reels/Shorts, 1080×1920, 30 fps. A Java developer's ML journey, one idea per Day, **84 locked Days** in
  `SERIES_ROADMAP.md` (read only the Day's row + §2 + §5b, not the whole file).
- **Opener:** every episode starts "This is Day N of ML for a Java developer." + the topic question.
- **Length:** 60–150 s, explain properly; > 180 s → Part 1 / Part 2 under the same Day number.
- **Style:** animated technical explainer (`ANIMATION_GUIDE.md`): light Java-dev workspace window, every element
  pops on its spoken word, chapter bar, title card first, nothing still > 2 s, labels ≤ 4 words.
- **Voice (from Day 2): Kali's OWN recorded voice → ElevenLabs Voice Changer (his clone)** (skill §3a: reading sheet → he records → `clean-voice.mjs` → `voice-changer.mjs`). Old: ElevenLabs `eleven_v3`, **Viraj** (Indian English, `fPIfC3elMLbN9tNwMXkw`), emotion tags from
  `VOICE_GUIDE.md`. API key lacks voices_write/user_read (warnings only; TTS works).
- **Thumbnail:** §5b v2: white bg, Impact headline in black/yellow/red/white boxes (one red), idea diagram,
  dev mascot on the right. `npm run thumb day_NN`.
- **Creator feedback on Day 1 (approved):** "still room for improvement, like **more animation**". From the
  intro on, add richer motion that still explains: diagrams that build, arrows that draw, data that moves
  between panels, counters, before/after morphs (not decoration).
- **Facts only from the creator's notes** (`MACHINE_LEARNING/<folder>/Concept/`). Never invented.

- **Creator/viewer feedback on the intro (2026-09-28):** the WHY must be one connected argument ("because →
  so → therefore"), each beat saying why it matters to the *Java developer*; a list of facts felt
  disconnected. Rule now in the skill §1 ("One argument, not a list").

## Approval flow (creator's rules)

1. **Script stop:** show the script as a beat table (chapter · voice · on screen) → wait for approval.
2. **30 s sample stop:** beats 1–3 recorded + rendered → wait for approval.
3. Then the rest runs by itself (voice budget ≈ 3 takes/beat + max one re-record per beat) → final review.

## Folders & rules

- Claude writes only in `claude/`, `remotion/src/{episodes,shared,series}/`, `remotion/scripts/`,
  `remotion/public/day_NN/`, `remotion/out/day_NN/`, `_backup/`. **Never** touch `episodes/`,
  `remotion/src/day01/`, `remotion/src/visual-lda/`, `remotion/public/day01/`, `media/`, `style.py`,
  `CODEX_MEMORY.md` (Codex). Never read `.env`. Move, don't delete (`_backup/<date>/` + README).
- Deliverables: `remotion/out/day_NN/episode[_vN].mp4` (newest) + `thumbnail.png` + `qa_report.md`.
- **Posting folder:** after the creator approves, `npm run publish day_NN` copies the video + thumbnail to
  `~/Documents/Instagram_Youtube_Reels/DayN/` (`DayN_<Title>.mp4`, `DayN_thumbnail.png`; intro → `Intro/`).
- Lint: `npx tsc && npx eslint src --ignore-pattern src/day01/video.tsx` (plain `npm run lint` hangs).
- Scene code: copy the pattern in `remotion/src/shared/explainer/README.md` (short); open `Day01.tsx` only if needed.

## Token-light habits (one chat per video)

- Read files by section (`grep -n` / `sed -n`), not whole. Don't re-read files you just wrote.
- Script output: use the one-line summaries; `| tail -3` long logs.
- Visual checks: ONE contact sheet (`--scale=0.3` stills + ffmpeg `hstack`), not many single images.
- Don't re-render the full video for small fixes: check stills first, render once at the end.

## Status

| Item | State | Next |
|---|---|---|
| Pipeline (Phase 0) | ✅ built: voice · autopick · master · captions · timeline · render · thumb · qa | — |
| Day 1: What is ML? | ✅ **v2** `out/day_01/episode_v2.mp4` (80 s): opener line + new ending ("…the language ML speaks, through Java eyes"). QA all pass. **Approved** ("you nailed it"), published to `Instagram_Youtube_Reels/Day1/` | Creator posts |
| Intro "Start here" (131 s, id `day_00`) | ✅ **Final = v5, approved** ("perfect"). Published `Instagram_Youtube_Reels/Intro/Intro_Start_Here_v2.mp4` + `Intro_thumbnail_v2.png` (the un-suffixed files are the superseded v1). Script `claude/episodes/day_00/voiceover_sheet_v3.md` | Creator posts v2 files + pins |
| Voice test: Viraj vs creator clone (2026-09-28) | Clone voiceId `dEibRDzkMexIgcF5EEiJ` (Instant Voice Clone, works with v3). Test episodes `day_97` (Viraj) / `day_98` (Kali): intro beat 1 + host line "I'm Kali, a software engineer with thirteen-plus years…"; clips `out/day_9{7,8}/episode_voicetest_v2.mp4`. Host visuals in `Day00.tsx` show only when the beat says "Kali" Creator likes own voice (2026-09-28); neutral 58 s tech sample for friends `out/day_96/VoiceSample_Tech.mp3` (test id `day_96`). | **Waiting for friends' feedback** → then: set series voice, re-voice intro beat 1, opener rule "I'm Kali, and this is Day N…", remove Day97/98 from Root (move test folders to `_backup/`) |
| Re-voice Intro (day_00) + Day 1 in Kali's own voice | Both were narrated by Viraj (published). Plan: reading sheets from the approved scripts (`day_00/voiceover_sheet_v3.md` + the map beats of v2; `day_01/voiceover_sheet_v2.md`), same visuals, re-cue scenes to his words. Leftovers to tidy: voice-test episodes `day_96/97/98` + their Root entries (move to `_backup/`), CHANNEL_IDENTITY.md + pipeline page (https://claude.ai/artifact/Urseysz655BRrfrHCTQqBm) awaiting creator OK | ✅ Reading sheets written 2026-09-29: `claude/episodes/day_00/reading_sheet_v1.md` (12 parts, + host line "I'm Kali, a software engineer…" already animated in Day00.tsx) and `day_01/reading_sheet_v1.md` (7 parts, opener "I'm Kali, and this is Day 1…"). Same words as the approved finals so the word cues still land; each part lists its cue words. **Next:** he records into `Recodings/Intro/` + `Recodings/Day1/` (one file per part) → analyze → clean-voice → master/captions/timeline → render |
| Day 2: Why Python feels different (creator's OWN voice → Voice Changer) | ✅ **Full draft v5 (no music)** `out/day_02/episode_v5.mp4` (134 s): iPhone → `clean-voice.mjs` → `voice-changer.mjs` (his clone; creator liked it) → master. **Music: undecided** — creator disliked all code-generated beds (calm v7, lofi, cinematic, pulse previews in `out/music_preview/`). Next: investigate in-app platform music, ElevenLabs Music (needs key permission), or royalty-free libraries; preview audio first. Use **`episode_v5.mp4` (no music)** for now. Notes: `claude/episodes/day_02/recording_feedback_v1.md` | **Creator review** → `npm run publish day_02`, or re-record Hook without "Hello everyone" |
