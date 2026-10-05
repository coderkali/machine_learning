# Model card — `pm25_station17_v1`

| | |
|---|---|
| **Model file** | `models/pm25_station17_v1.joblib` (rebuilt from `models/final_config.json` + `notebooks/18_final_test_and_model_card.ipynb`; the file itself is not in git) |
| **Version** | v1 · DAF-18 · 2026-10-05 |
| **Verdict against the project's success rule** | **NOT MET**: better than persistence, but not by the 10% the project asked for |
| **Decision record** | D-007 (final model), D-005 (one station) |

## Purpose

Forecast **tomorrow's 24-hour mean PM2.5** (µg/m³, 00:00–23:59 IST) at one Delhi station, so that a school coordinator can decide at **18:00 IST** whether children assemble outside the next morning. The forecast uses only what is known at 18:00: today's readings up to 17:00 and the averages of earlier days.

It replaces "tomorrow will be the same as today" (persistence), which is free. It is only worth running if it is clearly better than that.

## Data

- **Station:** R K Puram, Delhi (OpenAQ location 17, PM2.5 sensor 12234787), hourly readings from the OpenAQ S3 archive. One station only, by decision **D-005**: one station end to end first, then widen (DAF-24).
- **Daily table:** a day counts only with at least 18 hourly readings (requirements). Cleaning rules: `docs/data_faults.md`, `src/delhi_air/clean.py`.
- **Training rows:** 251 days, **17 Mar 2025 – 28 Feb 2026**, one full smog winter. Average target 118.5 µg/m³; 117 of 251 days Poor.
- **Test rows:** 130 days, forecasts made on the evenings of **1 Mar 2026 – 25 Aug 2026** (178 calendar days; days without 18 readings or without 14 days of history are missing). Average target 58.1 µg/m³; 17 of 130 days Poor.
- **Honest note:** the test days were already scored in DAF-06 to DAF-16 while models were being compared. DAF-18 is the **last** look at them, not the first, so the test result is slightly optimistic for any model chosen with them in view (D-007).

## Features

`StandardScaler` then `Ridge(alpha=1.0, solver="lsqr")`, default settings (tuning gained 0.047 µg/m³ and was not kept, D-007).

| Feature | Meaning | Weight per 1 µg/m³ |
|---|---|---:|
| `pm25_until_17` | today's mean PM2.5 from 00:00 to 17:00 | 0.43 |
| `mean_3` | mean of the last 3 full days (yesterday and earlier) | 0.03 |
| `mean_7` | mean of the last 7 full days | 0.11 |
| `mean_14` | mean of the last 14 full days | 0.40 |
| intercept | | 7.8 |

No weather, calendar or event feature is used in v1.

## Metrics

Scored **once** on the 130 test days, with persistence on the same days:

| Test days (Mar–Aug 2026) | Ridge | Persistence |
|---|---:|---:|
| MAE (µg/m³) | **15.59** | 16.79 |
| Poor days caught | **12 of 17** (recall 0.706) | 8 of 17 (recall 0.471) |
| Poor days missed | 5 | 9 |
| False alarms | 11 | 12 |

| Success rule (`docs/requirements.md`) | Result |
|---|---|
| MAE at least 10% lower than persistence | **7.2%** lower → not met |
| Recall on Poor days not lower than persistence | 0.706 vs 0.471 → met |
| **Verdict** | **NOT MET** |

Other report cards (different days, so compare only the gap, not the MAE):

| Evaluation | Ridge MAE | Persistence MAE | Ridge better by |
|---|---:|---:|---:|
| Cross-validation, 5 folds on train days (DAF-17) | 36.46 | 37.89 | 3.8% |
| Walk-forward, 11 monthly refits, Oct 2025 – Aug 2026 (DAF-16) | 30.38 | 35.35 | 14.1% |
| Final test (DAF-18) | 15.59 | 16.79 | 7.2% |

Ridge was better on every evaluation; only the walk-forward, which overlaps the test months and refits monthly, cleared 10%.

## Decision threshold

The model predicts a number; the decision comes from the CPCB table (D-001). A forecast of **91 µg/m³ or more** means "Poor or worse: keep the children indoors". The same line defines a really Poor day when scoring recall. A forecast just under 91 (for example 85–90) should be treated as a warning sign, not as "safe": all 5 Poor days Ridge missed on the test had forecasts between 74 and 87.

## Known failure cases

From the ten worst test days (they carry 21% of the total error):

1. **Slow to see the air clean up (8 of the 10 worst days).** After a smoggy week, `mean_7` and `mean_14` stay high, so the forecast stays high for a few days after the air has cleared (wind or rain). Example: 16 Mar 2026, forecast 94, real 43. These are false alarms, not dangers.
2. **Blind to sudden spikes (2 of the 10 worst, both Poor days).** A jump from a normal day to a smoggy one gives no warning in today's numbers. Example: 7 Mar 2026, forecast 93, real 148 (a calm, humid night); 19 Apr 2026, forecast 76, real 121 (dry, normal wind, cause unknown). This is the dangerous side.
3. **Leans high in clean months.** On the test days Ridge was on average **+8.2 µg/m³** too high (persistence −1.1), because it learned from a year that averaged 118.5 and was used on months that averaged 58.1. In **July and August** persistence had the lower MAE.
4. **Missed Poor days cluster in late April** (forecasts for 19, 22 and 24 Apr) and sit just under the line: 5 of 17 missed, all forecast between 74 and 87.

## Do not use for

- **Any other station or "Delhi as a whole".** It learned from R K Puram only (D-005).
- **Hourly values, peaks, or more than one day ahead.** It predicts one number: tomorrow's 24-hour mean.
- **Health or medical advice for individuals.** It supports one school-level, yes/no assembly decision, together with official CPCB/SAFAR forecasts and what people can see outside.
- **Inputs it was not built for:** features computed differently from `src/delhi_air/clean.py`, or a day with fewer than 18 hourly readings so far, or less than 14 days of history.
- **As proof of 10% improvement.** It did not meet that rule. Treat it as "somewhat better than persistence, clearly better at catching Poor days".
- **A season it has not seen twice.** It has one winter of training data; retrain and re-test after the 2026–27 winter before relying on it in smog season.

*What v2 should try (not tested here):* tomorrow's weather forecast as features (DAF-13 feature contract), a season feature, and a second winter of data.
