# DAF-02 · visual plan v1 — every beat shows real project data (Kali, 2026-10-04)

Kali: "proper information displayed, proper animation with the data … which data, train/test, how the model sees the data."
All numbers below are REAL, from `18_Projects/01_Delhi_Air_Forecast/data/interim/daily_17_clean.csv`
(R K Puram, 571 days 2025-02-19 → 2026-09-12, 488 valid) and DAF-06 (cut 2026-03-01). No SVG text (HTML labels only).

## Part 1 · day_302
| Beat | What is on screen (animated) |
|---|---|
| recap | DAF-01 house (shared `House.tsx`) shrinks into the project map; DAF-02 box pulses |
| wish | Sticky note "Predict Delhi's air quality" → stamp WISH; beside it a Java card `API contract + SLA` slides in, arrow "same thing" |
| five | Contract card with 5 pins: Decision · Target · Time · Success number · Baseline; pins 1–3 light up |
| decision | Asha at 6 pm clock; two-pan scale: "say bad, it was fine → children indoors (small loss)" vs "say fine, it was bad → 600 children breathe poor air" — right pan drops, turns red |
| what | Three option cards: `118` (number) · `UNSAFE` (category) · `118 → Poor` (number → CPCB table); third gets ✓, D-001 stamps SIGNED |
| doubt1/answer1 | Rishi DOUBT card. Then 91 and 400 drop into one grey UNSAFE box (information lost) vs a number line keeping them far apart, the 91 red dashed line between Moderately polluted and Poor |
| target | Real day 2025-02-24: 24 hourly bars fill midnight→midnight IST, mean line lands at **101.2 → Poor**. Then sensor outage: 2025-03-03 has only **14/24 hours** → bars with gaps, counter "14 < 18" → day crossed out "dropped". Counter: 571 days → **488 valid days**. D-002 SIGNED |
| when | Clock to 18:00; today's hourly bars stop at 17:00, the rest greyed "not yet happened" |
| doubt2/answer2 | Two panels: NOTEBOOK (full-day mean 101.2 visible, model ✓ "brilliant") vs PRODUCTION at 18:00 (that cell empty "?", model ✗). Weather: tomorrow's actual weather locked 🔒, forecast card allowed |
| row | **How the model sees the data**: real table rows build one by one — left (known at 6 pm): `date`, `PM2.5 until 17:00` · right (answer): `tomorrow's daily mean`. Rows: 02-21 · 88.2 → 69.1 · 02-22 · 69.8 → 74.0 · 02-23 · 70.3 → 101.2 · 02-24 · 102.7 → 102.0 (values ≥91 turn red). Caption chips: Decision · Target · Time all point into the row |

## Part 2 · day_352
| Beat | What is on screen |
|---|---|
| recap2 | The real row table from Part 1; pins 4–5 pulse |
| accurate | "ACCURATE?" bubble → question marks → replaced by `number` + `vs rival` chips |
| baseline | Persistence as a grey shadow line copying yesterday on the real Feb 2025 values (78.8, 49.4, 90.4, 69.1, 74.0, 101.2…) — mostly close, misses the jumps |
| doubt3/answer3 | Rishi card. Then a value bar: + data pipelines, servers, maintenance cost blocks push the bar BELOW zero when "worse than persistence" — label "negative value" |
| mae | Real rows: predicted vs actual, error gaps drawn as vertical bars, averaged into one MAE number (illustrative 18 from the phase brief, labelled "example") |
| catch | Two ±10 error bars on the number line: at 40 (both ends safe, green) and at 85 (bar crosses the red 91 line → decision flips). Recall meter: "bad days caught / all bad days" |
| criterion | **Train/test cut (real, DAF-06):** 487 valid days on a timeline split at 2026-03-01 → TRAIN 323 days (2025-02-19 → 2026-02-28, 139 Poor days) · TEST 164 held-out days (2026-03-01 → 2026-09-10, 17 Poor days), test block locked "never seen". Then the one-sentence criterion card: MAE ≥10% better than persistence + Poor-day recall not lower. Tag: "split built in DAF-06" |
| nongoals | Five cards slide in and get crossed: hourly · other city · other pollutant · mobile app · beyond tomorrow; project scope arrow stays straight |
| records | D-001 and D-002 documents fan out: Options · Why · Rejected option made easier |
| asha | Asha's 6 pm card: number + category + allowed error |
| recall | Recall card: 5 pins + "can't beat baseline = negative value"; GitHub chip |
| next | Project map → DAF-03 pulses; map dots of Delhi sensors with "?" |
