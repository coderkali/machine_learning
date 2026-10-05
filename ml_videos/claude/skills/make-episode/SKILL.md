---
name: make-episode
description: Produce one complete "ML for Java Developers" reel end-to-end from a single prompt — script, emotional voice, captions, animated technical explainer video, thumbnail and QA — for Day N of the locked roadmap. Use when the creator says "make Day N", "next episode", "create the Day N video", or similar.
---

# Make episode — Day N, one prompt, no back-and-forth

**Two stops, then it runs by itself** (creator's rules, 2026-09-27):
1. **Script stop.** Write the script (step 1) and **show it to the creator in chat as a table**, one row
   per beat: chapter, what's said, what's on screen. Wait for "approved" (or changes). No voice and no
   render before this. ("Next time I will see the script first.")
2. **30 s sample stop.** Record + render beats 1–3 only, send the sample, and wait for approval.
3. After that approval, the rest runs without back-and-forth: the remaining voice (paid, within the
   budget below), picking takes, render, thumbnail and QA. The creator reviews the finished video once.

Paths: `ML = /Users/kaliprasad/Documents/MACHINE_LEARNING`, `V = $ML/ml_videos`,
`R = $V/remotion`, `CL = $V/claude`. Episode id: `day_NN` (two digits).

## Hard rules (never break)

- Only write in Claude's folders: `~/Documents/Instagram_Youtube_Reels/` (via `npm run publish` only), `$CL/`, `$R/src/shared/`, `$R/src/series/`, `$R/src/episodes/`,
  `$R/scripts/`, `$R/public/day_NN/`, `$R/out/day_NN/`. **Never** touch `$V/episodes/`,
  `$R/src/day01/`, `$R/public/day01/`, `$V/CODEX_MEMORY.md` (another agent works there).
- Never read or print `.env` files. The scripts load the ElevenLabs key themselves.
- Facts, numbers, datasets and diagrams come **only** from the source notes named in the roadmap
  row. Flag anything in the notes that looks wrong instead of repeating it.
- Never change the locked roadmap order, `VOICE_GUIDE.md`, thumbnail spec §5b or `ANIMATION_GUIDE.md`.
- Never overwrite renders/audio: the scripts version files (`_v2`, `_v3`, …) by themselves.
- Paid voice budget per episode: **3 takes × all beats (≈ 4,000–4,500 characters)** plus at most
  **one** 1-take re-record per beat that fails QA. If `voice.mjs` reports too little quota, stop the
  voice step, finish everything else on a placeholder, and tell the creator what's needed.

## 0 · Load context (token-light: one chat = one video)

1. `$CL/CLAUDE_MEMORY.md`: the one-page brief (rules, status, next step). `HISTORY.md` only if needed.
2. `$CL/SERIES_ROADMAP.md`: **only** the Day N row, the N−1 / N+1 rows and §2 (`grep -n "| N |"`,
   `sed -n` the section). §5b only when making the thumbnail.
3. `$CL/VOICE_GUIDE.md` §2 (tone palette) and `$CL/ANIMATION_GUIDE.md` rules list.
4. `$R/src/shared/explainer/README.md` (scene skeleton). Open `Day01.tsx` only for a specific pattern.
5. The source notes: `$ML/<source folder>/Concept/*.md`.
6. `$CL/episodes/day_01/voiceover_sheet_v2.md`: the approved script shape.

## 1 · Script (Claude writes it, from the notes only)

Write, in the formats of Day 1:
- `$CL/episodes/day_NN/script.md`: beats with timestamps, VISUAL steps (each tied to the word
  that triggers it) + VOICEOVER; 150–200 spoken words; Hook → Problem → Idea → Visual example →
  Java lens (if natural) → Takeaway → "Day N done. Next: <Day N+1 title>."
- `$CL/episodes/day_NN/voiceover_sheet.md`: per beat the tone tag from VOICE_GUIDE §2, stress
  marks, **v3 text with emotion tags** and the v2 fallback (copy the format of `$CL/episodes/day_01/voiceover_sheet_v2.md`).

**Opener + length (series rules):** the first line is always "This is Day N of ML for a Java
developer." Explain the idea properly: 60–150 s. If it needs more than 180 s, split it into
Part 1 / Part 2 under the same Day (ids `day_NN` and `day_NN_p2`); Part 1 ends with "Part 2 explains …".

**Context first (series rule):** the first sentence states the topic as a question or promise
("What is machine learning? Your spam folder uses it every day."), before any example. The Java
angle runs through every beat. Group beats into 4–6 chapters (e.g. PROBLEM, IDEA, HOW IT LEARNS,
PREDICT, IN JAVA, RECAP) and put them in `episode.json → chapters` as `[{ "beat": "<id>", "label": "…" }]`.

**One argument, not a list (creator + viewer feedback on the intro, 2026-09-28):** every beat must
answer the beat before it, and say *why it matters to the Java developer*, not just state a fact. Check
the chain by reading only the first clause of each beat ("Because software is changing" → "who connects
those models? Us" → "learn how it works and you get the most out of it" → "So… I built a map"). If a
beat could be swapped with its neighbour without breaking the story, add the missing "because / so /
once you…" link. Lists of items (arcs, features) get one causal clause per transition.

Emotion is the point: every beat gets its tone tag (`[curious]`, `[sarcastic]`, `[sighs]`,
`[thoughtful]`, `[confident]`, `[honestly]`, `[warmly]`, `[excited]`, `[mischievously]`), with the tag
changing mid-beat when the feeling changes, and `…` before punchlines. It should sound like a
developer telling a friend a story. TTS-safe text only (VOICE_GUIDE §6).

## 2 · Episode data

- `$R/src/episodes/day_NN/voice.json`: copy Day 1's shape: `voice` = **the series voice, copied
  from `day_01/voice.json → voice`** (Indian English, model `v3`), `leadIn` 0.1, `endHold` 1.5,
  one entry per beat: `id`, `type`
  (hook/problem/insight/explain/term/caveat/java/takeaway/done/teaser), `text` (plain, what is said),
  `v3 {text, stability: 0.5}`, `v2 {…}`, `seed: null`, `chosen: null`, `holdAfter: 0`.
- `$R/src/episodes/day_NN/episode.json`: `day, slug, title, topic, next {day, title}`, and
  `thumbnail {blocks, diagram {source, rows}}` per §5b: 3–5 boxes, 3–9 words, exactly one red
  box, diagram = the episode's main idea from the notes (name the file in `source`).

## 3a · OWN VOICE (default from Day 2, 2026-09-29): the creator records, Claude cleans

The series narrator is **Kali's real voice** (not ElevenLabs). The creator reads a reading sheet Claude
writes, one recording per part, and Claude does everything else. Progress over perfection: ship each
episode with the current recording; give 2–3 encouraging, concrete notes; track his pitch-movement number.

1. **Reading sheet** `$CL/episodes/day_NN/reading_sheet_vN.md`: 8 parts HOOK · PROBLEM · INTUITION · VISUAL ·
   TECHNICAL · JAVA · EXAMPLE · RECAP, each a **flowing paragraph** (not one line per breath — that made him sound
   like he was reading, 2026-09-30). **Desi-teacher ↔ student voice in clear English:** use
   `$CL/PHRASE_BANK.md` (core five: "See", "Let's say", "Now", "Right?", "Here's the catch"; 1–2 per part, only where
   they do a job, varied; no slang like "na"; "like" only for real comparisons), ask-then-answer, his own experience.
   **Bold** key terms + pronunciation notes. Tell him: read twice, then explain it in his own words.
   Opener: "I'm Kali, and this is Day N of ML for a Java developer." (no "Hello everyone": topic in first 5 s).
   Ending: recap → "Day N done." → "Next: …" (no "tomorrow", no sign-off after the teaser).
2. **He records** (iPhone Voice Memos, Lossless, or USB mic; sitting) into
   `~/Documents/Instagram_Youtube_Reels/Recodings/DayN/<Part>.m4a` (folder is spelled "Recodings").
3. **Analyze**: `node scripts/analyze-recording.mjs <folder>` (transcript, wpm, pauses, level, unclear words) +
   pitch movement (numpy autocorrelation, 10–90 % range in semitones; his baseline 4.0–5.9, Viraj 9–12).
4. **Clean**: `node scripts/clean-voice.mjs day_NN --from <folder> --map Hook=hook,… --max-pause 0.55 --keep-pause 0.42
   [--cut beat=a-b+c-d]` → `public/day_NN/rec_clean/`. Never use ffmpeg `silenceremove` on speech (it cut words).
4b. **Voice Changer (creator's choice, 2026-09-29):** `node scripts/voice-changer.mjs day_NN --confirm` sends each
   cleaned part through ElevenLabs speech-to-speech with his **Professional Voice Clone `99SWo5wjrbPpMKuP8Mik`** (default since 2026-10-04; keeps his energy 7.5 vs instant clone 5.1) → `public/day_NN/rec_sts/`
   (≈ 1,000 credits per audio minute). Clearer key words + studio-quiet; keeps his timing, energy and wording.
   Then master with `--takes-from day_NN/rec_sts --min-gap 0.7` (0.25 s joins felt like hard cuts, 2026-10-04) (add `--music <approved bed> --music-lufs -28` only after audio preview approval).
4c. **No background music** (creator, 2026-09-30: "don't add unnecessary music"). Voice only, unless he asks.
   If he ever asks: offer audio previews first (`scripts/music-preview.mjs`), never straight into a video.
4d. **Lessons from Day 2 (own voice):**
   - Read Whisper's transcript of every cleaned part before building: cut self-corrections ("Python, sorry, Java"),
     filler restarts, "This is called…", and sign-offs after the teaser (`clean-voice.mjs --cut beat=a-b`), then
     re-transcribe to verify the cut.
   - His wording changes between takes: set `voice.json` text to what he said (fix only mishearings), move
     visuals to where he now says them, and use optional cues (`opt()` in `Day02.tsx`: hidden when the word
     isn't said) instead of `at()` fallbacks that pop at the start of the part.
   - Report energy per part vs his previous take (pitch 10–90 % range, semitones) and 2 things to try next.
   - The old instant clone flattened energy by ≈ 1–2 st and lowered pitch; the PVC keeps both.
   - **No recording available?** Use the PVC reading the script itself: `node scripts/pvc-tts.mjs day_NN --out public/day_NN/rec_tts --confirm`
     → master `--takes-from day_NN/rec_tts`. Do NOT voice-change someone else's take (Viraj → PVC kept Viraj's melody;
     Kali heard "Viraj", 2026-10-05). Same tool patches a single word: `--text "capstone" --name capstone`. Keep old parts (`rec_sts_<date>/`) before re-running.
   - Never pipe a paid/long script into `head`/`tail -n` mid-run (SIGPIPE killed voice-changer after 2 parts) — redirect to a log.
   - Cut boundaries: Whisper word times are rough; confirm with 50 ms levels + snippet transcripts, then re-transcribe.
   - Voice Memos "Lossless" saves `.qta` (AAC + spatial): extract with `ffmpeg -i x.qta -map 0:a:0 -c:a copy x.m4a`.
   - `captions.mjs` transcribes per beat (padded); `analyze-recording.mjs` pads 1.5 s (Whisper drops a final word).
5. `voice.json`: `voice {name:"Kali (own voice, recorded)", model:"recorded"}`, beat `text` = what he actually
   said (fix only Whisper mishearings of key terms), then `npm run master -- day_NN --takes-from day_NN/rec_clean`,
   `captions`, `timeline`, scenes, render, QA as usual. Report by ear-check items he must verify (e.g. can/can't).

## 3b · (fallback) AI voice → master → captions → timeline (all in `$R`)

```bash
npm run voice -- day_NN --takes 3 --confirm     # paid; checks quota first, exits 2 if too little
# no credits? make a timing placeholder instead (free, robotic) and continue; swap in the real voice later:
#   say -v Rishi -r 185 -o /tmp/<beat>.aiff "<beat text>"  → ffmpeg to public/day_NN/placeholder/<beat>.wav
#   npm run master -- day_NN --takes-from day_NN/placeholder     (then captions, timeline, render -- --label placeholder)
npm run autopick day_NN                          # Whisper-scores every take, picks best per beat
npm run master day_NN                            # trims, stitches with gap rules, −14 LUFS
npm run captions day_NN                          # Whisper word timings aligned to the script
npm run timeline day_NN                          # beat frames from the real audio
```

**Voice pitfalls (learned on the intro):**
- Eleven v3 often ends a take mid-word (hard cut = audible click). `master.mjs` now fades every take
  10 ms in / 80 ms out, so don't remove that. If the creator hears a "jump", measure the joint
  (sample-to-sample jump near the beat boundary) instead of guessing.
- Voice pace: Viraj runs ≈ 155 wpm including gaps (Day 1 measured), so budget words at that rate.
- Re-recording a beat with new text: `voice.json → chosen` is reset; `autopick` re-scores (old takes lose
  on the new text). Listen by punctuation in the report: prefer the take where the punch word stands
  alone ("Us." not "Us, our…"), then `--pick`.
- Whisper mishears ("Java eyes" → "JavaIs"); if the take is already approved and the caption text is
  right, leave it and tell the creator.

If `captions` prints a **✗ major** issue for a beat, the take doesn't say the script:
`npm run voice -- day_NN <beat> --takes 1 --confirm`, then `autopick`, `master`, `captions`, `timeline`
again (once per beat, max). **?** minor issues are usually Whisper mishearing; leave them.
Read `$R/out/day_NN/takes_report.md` to see why each take won, and **check the "Heard" column
for each beat's key word** (the bolded word in the voiceover sheet). Autopick weighs every word equally,
so a take that slurs the key word ("if-else may's" for "maze") can win over one that adds a harmless
"the". Override with `npm run voice -- day_NN <beat> --pick <file>` when the key word is clearer
elsewhere (done on Day 1, java beat).

**Sample first:** unless the creator says otherwise, record and render beats 1–3 first
(`npm run master -- day_NN --beats <ids>` → `npm run render -- day_NN --label sample30`), send the
~30 s sample, and record the rest only after they approve it (creator's request, 2026-09-27).
**Never rush or cut to fit a length:** 60–150 s; split beyond 180 s.

## 4 · Animated scenes (the creative part)

Create `$R/src/episodes/day_NN/DayNN.tsx` modelled on `Day01.tsx`, using the kit
`src/shared/explainer/kit.tsx` (`Workspace`, `Tab`, `Row`, `Chip`, `TermCard`, `Code`, `Folder`,
`Header`, `Backdrop`, `Narrator`, `CaptionPill`, `useCues`) and `src/shared/anim.ts` (`T`, `pop`,
`enter`, `draw`). Rules from ANIMATION_GUIDE:
- **Stage** = a developer workspace window with tabs that fit the topic (a notebook, a terminal,
  a `.csv`, a chart panel, a `.java` file…). One persistent stage that evolves; no slideshow.
- **Every element starts on its spoken word:** `at("beatId", "word")`; use `"a|b"` alternatives only
  for tolerance. Something moves at frame 0. Nothing may sit still > 2 s: when a sentence is
  long, add a small explaining step on a middle word (see the "growing maze" in Day 1).
- Frames 0–90: title card with the topic (kit `TitleCard`) while the voice says it; the chapter bar
  (kit `ChapterBar`, from `episode.json → chapters`) stays under the header all video.
- Labels ≤ 4 words. One `TermCard` per term reveal (Impact, tilted). Java lens beat = Java vs
  Python/ML side by side. Last beat: recap flow → `DAY N DONE` card → `NEXT → DAY N+1: …` chip.
- Narrator pose: `"point"` on questions / reveals / "done", else `"present"`.

Register it in `$R/src/series/Root.tsx`: import `DayNN` and the day's `episode.json` +
`generated/timeline.json`, and add a `<Composition id="DayNN" …>` exactly like the `Day01` block.

- **More animation (creator asks for it every time):** diagrams that build, packets that fly between
  panels, code that types, before/after morphs (`int x = 5;` → `x = 5`), stamps, strikes, meters, a
  persistent stage (e.g. the 84-box roadmap grid) that fills as the story goes. Every motion explains.
- **No invented numbers on screen either:** sample data = headers + skeleton rows, not made-up values.
- The un-numbered intro uses `episode.json → badge` ("START HERE") in the header and thumbnail.

Check your work visually before the full render: render stills at the key cues
(`npx remotion still src/index.ts DayNN /tmp/x.png --frame=<f> --scale=0.3`), stack them with
ffmpeg `hstack`, look at them, and fix overlaps, overflow and text running outside boxes.

## 5 · Render, thumbnail, QA

```bash
npx tsc && npx eslint src --ignore-pattern src/day01/video.tsx     # (plain `npm run lint` hangs on day01/video.tsx)
npm run thumb day_NN                                                # → out/day_NN/thumbnail.png
npm run render day_NN                                               # → out/day_NN/episode.mp4
npm run qa -- day_NN --video out/day_NN/episode.mp4                 # → out/day_NN/qa_report.md
```

Fix every ❌ and re-render (new file name is automatic). Typical fixes: still scene > 2 s → add a
cued step there; caption ✗ → re-record that beat once; thumbnail check → shorten the headline.

## 6 · Finish

- **Publish after the creator approves the final video:** `npm run publish day_NN` copies the newest (video and thumbnail both by `_vN`)
  `out/day_NN/episode[_vN].mp4` + `thumbnail.png` to `~/Documents/Instagram_Youtube_Reels/DayN/`
  as `DayN_<Title>.mp4` / `DayN_thumbnail.png` (intro → `Intro/`). It copies, never moves, and never overwrites.

- Update `$CL/CLAUDE_MEMORY.md` (Current state: Day N done, file paths, anything notable) without
  deleting other sections: edit the specific lines, never "replace to end of file".
- Tell the creator, briefly: video `$R/out/day_NN/episode.mp4`, thumbnail
  `$R/out/day_NN/thumbnail.png`, QA summary, ElevenLabs characters used, and anything they should
  listen for. Send the video and thumbnail as files.
