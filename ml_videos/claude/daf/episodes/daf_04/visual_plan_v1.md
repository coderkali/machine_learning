# DAF-04 · visual plan v1 (2026-10-06) — silent build

This is the build spec for the three DAF-04 videos (script `script_v1.md`, approved 2026-10-06).
Kali asked for the video first, with captions and better animation, and audio later.

## How the silent build works

- `remotion/scripts/silent-timeline.mjs day_NN` writes `generated/timeline.json` with **estimated** word timings and a
  silent `narration.wav`. The pace is calibrated on the approved DAF-02 timelines: a word lasts 0.54 + 2.37 × letters
  frames, with a short breath at punctuation, a 4-frame lead-in and a 34-frame hold per beat (about 145 words a minute).
- Every animation cues on a **spoken word** (`at(beat, word)`). When the real audio arrives, run the normal
  voice → master → captions → timeline chain and the same scenes re-time themselves. Nothing is rebuilt.
- Estimated lengths: A 2:05 · B 2:26 · C 2:26.

## Motion kit v2 (`remotion/src/shared/daf/motion.tsx`): what changed from DAF-02

| Before (DAF-02) | Now (DAF-04 onward) |
|---|---|
| Fixed cubic ease, pop | **Spring physics** (`sp`) with a natural settle; entrances **blur in** and rise (`rise`) |
| Zones fade in and out | Ideas **push** up and out, and the next one pushes in from below with a blur (`Push`) |
| Table cells pop | Columns **grow open** (width springs from 0), headers drop in, cells **flip in**; the speaking row **lifts** (yellow bar and glow) while the other rows dim (`Table2`) |
| Static numbers | **Count-up** numbers (`Count`): 3,342 · 64,284 · 570 · 554 · 467,816 · 1,753 |
| Chips for "make it talk" | **Speech bubbles** that type out the answer (`Bubble`) |
| Red strike only | **Hand-drawn ring** around the key cell (13 · 19 Feb 2025 · 1,753) and an underline on the recall line (`Ring`, `Underline`) |
| — | **Burst** on reveals (= 96 · 10 FILES · ≈ 5% · the lock) |
| — | **Camera:** a slow push-in on "wait, really?" moments plus a small shake on the reveal word (`camera`) |
| Caption: the spoken word turns yellow | **Kinetic caption:** the page springs in, the spoken word pops on a yellow pill, and words not yet said stay dim |

The house rules are kept: HTML text only (no SVG `<text>`), the real table pinned at the top all video, one new column
per idea, the doubt card low, a full-height stage, and the caption at the bottom of the safe zone.

## A · `day_304` — pinned table: R K Puram, four real days

| Beat | New in the table | Zone below |
|---|---|---|
| recap | (day column) | 50 / 44 count up → "only a LIST" → who ✓ / what ✗ → "readings on our disk: 0" pulses |
| shortcut | **one number for the day** grows open | "THE SHORTCUT" · OpenAQ hands four day cards · "we tried it" 3,342 counts up |
| doubt1 | — | Rishi's yellow card (low) |
| count M2 | — | clock jumps in 15-minute steps · 96 dots fill · "= ?" pulses → "= 96" + burst |
| talk M1·M4 | **readings behind it**; 20 Jan row lifts; 13 ringed | bubble "Only thirteen, sir" · the 96 dots light only the last 13 · "woke up at 20:45" · "13 OF 96" + camera shake |
| hides | — | the "431" card cracks open → "ONLY 3 HOURS" · "EVERY READING, NOT THE AVERAGE" |
| original M5 | **kept as it came** 🔒 | lib-1.0.0 🔒 vs a flickering SNAPSHOT · five daily files get locks · "WE NEVER EDIT IT" |
| why | — | "weeks later… strange number?" → an arrow draws back to the locked file |
| recall | — | three takeaways + NEXT |

## B · `day_354` — pinned table: four real rows of the list of 44

| Beat | New in the table | Zone below |
|---|---|---|
| recap | (station column) | 44 sensor dots spring in · "ALL 44?" · "first, check them" |
| talk M1 | **last reading** fills as each row answers | typed bubble per station · tally cards (LIVE / 31·10·22) |
| wow M4 | **still recording?** | 42 dots go grey, 2 glow · "42 / 44" + camera shake · Mandir Marg's four-year bar shows only a 6-week sliver |
| compute M2 | — | 44 × 48-month grid lit like the real table · 64,284 → 3,342 → "= ?" → "≈ 5%" + burst · two rows turn yellow ("two-thirds") |
| doubt1 | — | Rishi's card |
| slice M5 | — | controller / service / database × 10; one vertical slice lights top to bottom → "station → data → model → running app" |
| rkpuram | **new sensor since**; R K Puram ringed | old sensor bar (2018 → Oct 2022, stopped) · new sensor bar (Feb 2025 → now, glowing) |
| catch | — | the 570-day strip with one winter band · Delhi outline: R K Puram stays lit, other pins grey · "more stations later · DAF-24" |
| recall | — | takeaways + NEXT |

## C · `day_404` — pinned table: R K Puram days from the raw files

| Beat | New in the table | Zone below |
|---|---|---|
| recap | (day column) | the 570-day strip draws · 570 counts up · "not all at once" |
| doubt1 | — | Rishi's card |
| small M2 | Feb row lifts | February 2025 calendar: 1–18 grey out, 19–28 turn into files · "files = ?" → "10 FILES" + burst · 5 seconds |
| twice M5 | — | 1st run (10 / 0) vs 2nd run (0 / 10) · jars bounce in the local repository · "SAFE TO RUN AGAIN" |
| full | **file on our disk?** (the Jan row is ✗ and tinted) | 80 s · 554 · 2.5 MB · the strip with the 16 real missing days in red · zoom on the 9-day January gap |
| inside | **readings in the file** | 12 measured things as bars (real row counts) · everything except PM2.5 dims · 467,816 → 44,139 · "≈ 1 IN 10" |
| diwali M4·M1 | **highest PM2.5**; 1,753 ringed, Oct row lifts | the Poor bar (91) vs the 1,753 bar growing · "× 19" · bubble "No sir. That was Diwali night 🪔" + camera shake |
| catch | — | a "clean while downloading?" broom stopped by a lock · "RAW = EXACTLY AS IT CAME" · "fixing comes later" |
| recall | — | takeaways + NEXT |
