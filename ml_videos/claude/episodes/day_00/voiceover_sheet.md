# Intro — "Start here": Why a Java developer should learn ML + the 84-day map

**Script approved by the creator 2026-09-27.** Next step: 30 s sample (beats 1–3), then the rest.
Un-numbered pinned reel. Episode id `day_00` (data in `remotion/src/episodes/day_00/`). Target ≈ 100 s
(≈ 260 words), explained properly (not squeezed). Header badge: **START HERE** (not "DAY 0").
Voice: Viraj, eleven_v3, emotion tags per VOICE_GUIDE §2. Facts: the map comes from `SERIES_ROADMAP.md` §4;
beats 2–4 are general statements (no statistics, no invented numbers).

Chapters for the chapter bar: WHY · MAP · PYTHON · MATH · DATA · ML · SHIP · START

| # | id · type | Chapter | Voice | On screen |
|---|---|---|---|---|
| 1 | `question` · hook | WHY | "Before Day 1 of ML for a Java developer, one question: why should a Java developer learn machine learning at all?" | Title card **WHY SHOULD A JAVA DEV LEARN ML?** |
| 2 | `products` · problem | WHY | "Because ML is already inside the software we build. Recommendations, fraud checks, search, spam filters. Those features are models, not if-else rules." | App screen: 4 feature cards pop, each tagged MODEL; an `if-else` crossed out |
| 3 | `services` · explain | WHY | "And more and more, our Java services call those models, or an AI model, through an API. Know the basics, and you can build that feature, test it, and know when it will fail." | `OrderService.java` → arrow → MODEL API; ✓ BUILD · ✓ TEST · ⚠ FAILS WHEN… |
| 4 | `team` · java | WHY | "You also speak the data team's language, and you can judge what ML can and can't do. That's a real edge for any backend developer." | Dev ↔ data-team chat bubbles; a CAN / CAN'T card |
| 5 | `map` · insight | MAP | "So I built a map. Eighty-four days, one idea a day, in the order I actually learned it." | `roadmap.md` opens; 84 day boxes pop into a grid |
| 6 | `python` · explain | PYTHON | "Day 1 asks what machine learning is. Then Days 2 to 12: Python through Java eyes. NumPy, Pandas, charts, and two small projects." | Day 1 lights up, then Days 2–12; `int x = 5;` next to `x = 5` |
| 7 | `math` · explain | MATH | "Days 13 to 21: only the math you need. Statistics, vectors, and the slope behind gradient descent." | Days 13–21; a ball rolls down a curve |
| 8 | `data` · explain | DATA | "Days 22 to 36: reading data like a scientist. Spread, correlation, and tests that separate real patterns from luck." | Days 22–36; a bell curve + a box plot draw |
| 9 | `ml` · explain | ML | "Days 37 to 78: the real machine learning. Cleaning data, predicting numbers, predicting classes, finding groups, and judging every model honestly." | Days 37–78 in 4 segments: PREP · REGRESSION · CLASSIFY · CLUSTER |
| 10 | `ship` · explain | SHIP | "Days 79 to 84: making it real. Tuning, ensembles, saving a model, and a full capstone project." | Days 79–84; `model.pkl` → CAPSTONE |
| 11 | `promise` · takeaway | START | "Every day is one idea, with a Java lens, explained properly. And when a topic needs more time, it gets a part two." | Chips: 1 IDEA · JAVA LENS · PART 2 IF NEEDED |
| 12 | `start` · teaser | START | "After Day 84: deep learning, then transformers and agents. Day 1 starts now. Follow along!" | Map extends to SEASON 2 →; big **START: DAY 1** |

Build notes for the new chat:
- Sample = beats `question,products,services` (≈ 30 s): `npm run master -- day_00 --beats question,products,services`.
- `Header` shows `DAY {day}`: add an optional `badge` to `episode.json` (e.g. "START HERE") and use it in
  `kit.tsx → Header` when present. Thumbnail: §5b, e.g. `WHY JAVA DEVS / NEED / ML / THE 84-DAY MAP` (one red box).
- Day-box grid: 84 small boxes (12 × 7), filled per arc on the arc's first spoken number; arcs from roadmap §4.
