# D-007 · The final model is Ridge with default settings, frozen in `models/final_config.json`

- **Date:** 2026-10-03
- **Ticket:** DAF-17
- **Status:** accepted

## Context

DAF-17 tuned the two candidate models on the 251 train days only, using `TimeSeriesSplit` with 5 folds. The 130 test days (from 2026-03-01) were not used. Before any number was computed, two rules were written: tuned settings are kept only if the CV MAE falls by at least 1.0 µg/m³ and the tuned model wins at least 4 of 5 folds; the final model must beat persistence on the CV average and in at least 3 of 5 folds.

## Options considered

| Option | CV MAE (5 folds) | For | Against |
|---|---:|---|---|
| Ridge, default `alpha = 1.0` | 36.456 | Lowest CV MAE of the trained models; simple; wins the three smog-season folds | Beats persistence by only 1.43 µg/m³; loses folds 1 and 2 to persistence |
| Ridge, tuned `alpha = 0.013` | 36.409 | Lowest number of all | Gain 0.047 is noise: 3 of 5 folds, far below the 1.0 rule |
| HistGradientBoosting, default | 47.782 | Can bend, not only a line | 11 µg/m³ behind Ridge; trees only repeat what they have studied |
| HistGradientBoosting, tuned | 47.683 | | Gain 0.099 comes from one fold (fold 5); worse in the other four |
| Persistence ("tomorrow = today so far") | 37.889 | No model to maintain | Loses to Ridge on average and in the three smog folds |

## Decision

Use **Ridge with default settings** (`StandardScaler` then `Ridge(alpha=1.0, solver="lsqr")`) on the four features `pm25_until_17`, `mean_3`, `mean_7`, `mean_14`. The recipe is frozen in `models/final_config.json`, with a fingerprint of the train target and the locked-test cut date. DAF-18 rebuilds the model from that file and opens the test days once.

## Why

Ridge was the best trained model on honest, time-ordered folds, and it passed the rule against persistence. Tuning did not pass its own rule for either model, so the simple default is kept. Choosing the tuned alpha would add a frozen number that nobody could defend.

## Consequences

- DAF-18 must report persistence next to Ridge: the margin is small and the test months (March to August, 17 Poor days of 130) look like the folds where persistence was strong.
- The 130 test days were already scored in DAF-06 to DAF-16, so DAF-18 is the last look at them, not the first. The model card says this.
- `models/final_config.json` is excluded from the usual `models/` ignore rule so the freeze is in git history.
- We would change our minds if DAF-18 shows Ridge losing to persistence on the test days, or if more months of data change which model wins in cross-validation.
