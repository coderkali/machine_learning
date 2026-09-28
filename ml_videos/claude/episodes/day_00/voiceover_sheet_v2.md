# Intro — "Start here" · voiceover sheet v2 (creator's review applied, 2026-09-27)

v1 (`voiceover_sheet.md`) was approved; v2 applies the creator's own review notes. Beats 1–3 (the 30 s
sample) change only by the review's trims. Beats 5–12 changes are shown at the sample stop for approval.
Voice: Viraj, eleven_v3. Facts: map = `SERIES_ROADMAP.md` §4; beats 2–4 general statements, no numbers.

**Pacing check (measured, not assumed):** Day 1 v2 (approved) = 208 words in 80.5 s = **155 wpm with gaps**.
So Viraj's natural pace is ~155, not 130–140. v2 ≈ 262 words → **≈ 102–108 s**. It won't feel squeezed
because of the rhythm fixes below (transitions + the beat-9 pause), not because of the word count.

What changed from v1 (review notes → action):
1. Hook trimmed: the question lands at word 5 instead of word 10.
2. Beat 3: "or an AI model" cut (redundant after "those models").
3. Beat 4 → 5 "clutch": `holdAfter 0.3` on beat 4 + the automatic 0.6 s insight gap + "So…" with a lift.
4. Beats 6–10 are a journey, not a timetable: one causal clause per transition, and beat 6 cashes out
   "in the order I learned it" ("It starts where I started").
5. Beat 9 = main event: "Days 37 to 78… (beat) The real machine learning." Different shape + `holdAfter 0.3`.
6. Ending lands on the after-picture, honest to scope (capstone = Days 82–83 in the roadmap).

| # | id · type | Chapter | Tone | v3 text (what Viraj says) | On screen |
|---|---|---|---|---|---|
| 1 | `question` · hook | WHY | curious | [curious] One question before Day 1… why should a Java developer learn **machine learning** at all? ↗ | Title card **WHY SHOULD A JAVA DEV LEARN ML?** → a `?` cursor types into `Why.java` |
| 2 | `products` · problem | WHY | matter-of-fact → thoughtful | [matter-of-fact] Because ML is already inside the software we build. Recommendations, fraud checks, search, spam filters. [thoughtful] Those features are… **models**. Not if-else rules. | Phone app: 4 feature cards slide in on their words; `if-else` code block gets struck out; MODEL stamps on every card |
| 3 | `services` · explain | WHY | confident → honestly | [confident] And more and more, our Java services call those models through an **API**. Know the basics… and you can build that feature, test it, [honestly] and know when it will **fail**. | `OrderService.java` types a call; request packet flies → MODEL API → response flies back; ✓ BUILD · ✓ TEST · ⚠ FAILS WHEN… |
| 4 | `team` · java | WHY | warmly → confident | [warmly] You also speak the data team's language, and you can judge what ML can and can't do. [confident] That's a real **edge** for any backend developer. | Dev ↔ data-team chat bubbles; CAN / CAN'T card; EDGE term card |
| 5 | `map` · insight | MAP | thoughtful → confident | [thoughtful] So… [confident] I built a **map**. Eighty-four days. One idea a day, in the order I actually learned it. | `roadmap.md` opens; 84 boxes cascade into a 12 × 7 grid; counter 0 → 84 |
| 6 | `python` · explain | PYTHON | confident | [confident] It starts where I started. Day 1: what is machine learning? Then Days 2 to 12: **Python**, through Java eyes. NumPy, Pandas, charts, and two small projects. | Day 1 box lights; Days 2–12 fill; `int x = 5;` morphs into `x = 5` |
| 7 | `math` · explain | MATH | confident | With Python in hand, Days 13 to 21: only the **math** you need. Statistics, vectors, and the slope behind gradient descent. | Days 13–21 fill; a ball rolls down a curve to the minimum |
| 8 | `data` · explain | DATA | confident | Then we point that math at real data. Days 22 to 36: reading data like a **scientist**. Spread, correlation, and tests that separate real patterns from luck. | Days 22–36 fill; bell curve + box plot draw |
| 9 | `ml` · explain | ML | confident → excited | Once you can read data like that… Days 37 to 78. [excited] The real **machine learning**. [confident] Cleaning data, predicting numbers, predicting classes, finding groups, and judging every model honestly. | Grid zooms; Days 37–78 fill in 4 bands: PREP · REGRESSION · CLASSIFY · CLUSTER; "42 DAYS" term card |
| 10 | `ship` · explain | SHIP | confident | And finally, Days 79 to 84: making it **real**. Tuning, ensembles, saving a model, and a full capstone project. | Days 79–84 fill; `model.pkl` → CAPSTONE |
| 11 | `promise` · takeaway | START | confident | [confident] Every day is **one idea**, with a Java lens, explained properly. And when a topic needs more time, it gets a part two. | Chips: 1 IDEA · JAVA LENS · PART 2 IF NEEDED |
| 12 | `start` · teaser | START | curious → warmly | [curious] After Day 84: deep learning, then transformers and agents. [warmly] But Day 1 starts now. Follow along… and by Day 84, you'll have built a **real ML project**, start to finish. ↗ | Map extends to SEASON 2 →; big **START: DAY 1**; ghost "DAY 84 ✓ PROJECT" |

Build notes:
- Sample = beats `question,products,services`: `npm run master -- day_00 --beats question,products,services`.
- Header: `episode.json → badge: "START HERE"` replaces `DAY {day}` (kit `Header` takes an optional `badge`).
- Day-box grid: 84 boxes (12 × 7), filled per arc on the arc's first spoken number; arcs from roadmap §4.
