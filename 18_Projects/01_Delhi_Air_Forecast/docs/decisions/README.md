# Decision log

One file per real decision, written when the decision is made, using
[`_TEMPLATE.md`](_TEMPLATE.md). Named `D-0NN-short-slug.md`.

This is the same idea as an architecture decision record at work. In three
months the code will still show *what* you did; only this folder will show
*why*, and what you rejected. That is the part that turns a project into
evidence you can talk about in an interview.

Write one when a choice would be hard to reverse, when a reasonable engineer
would have chosen differently, or when you know you will forget the reason.
Do not write one for "I named the column `pm25`".

| ID | Decision | Ticket | Date |
|---|---|---|---|
| [D-001](D-001-predict-number-then-apply-table.md) | Predict the number, then apply the AQI table | DAF-02 | 2026-09-13 |
| [D-002](D-002-tomorrow-24h-mean.md) | Target is tomorrow's 24-hour mean, 00:00–23:59 IST | DAF-02 | 2026-09-13 |
| [D-003](D-003-station-selection-rule.md) | Keep stations with 730+ days of real coverage | DAF-03 | 2026-09-16 |
| [D-004](D-004-training-date-range.md) | Train on the most recent 3–4 years | DAF-04 | 2026-09-16 |
| [D-005](D-005-one-station-first.md) | Build version one on one station, R K Puram | DAF-04 | 2026-09-18 |
| [D-006](D-006-weather-source.md) | Keep the current model free of these weather features; use forecast weather for future production-honest comparisons | DAF-13 | 2026-09-29 |
| [D-007](D-007-final-model-ridge-defaults.md) | Final model is Ridge with default settings, frozen in `models/final_config.json` | DAF-17 | 2026-10-03 |
