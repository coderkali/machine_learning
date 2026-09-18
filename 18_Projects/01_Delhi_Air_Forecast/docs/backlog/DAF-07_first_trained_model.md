---
id: DAF-07
title: The first trained model — Ridge inside a Pipeline
phase: 6 — Models
sprint: 2
estimate: 2-3 h
status: todo
depends_on: [DAF-06]
---

# DAF-07 · The first trained model — Ridge inside a Pipeline

## Story

As the developer, I want one real model trained and scored against the
baselines, so that I know whether this project can beat Asha's method at all,
before spending weeks making the data prettier.

## Why this ticket exists

This closes the walking skeleton. After it, the project has a data → split →
model → score path that works end to end, and a number to beat. Every ticket
after this one is an experiment: change one thing, re-score, add a row to the
experiment log, keep it or drop it.

It uses a scikit-learn `Pipeline` from the first model on, because the pipeline
is what stops pre-processing from learning from the test rows.

## Background

A handful of features, all knowable at 18:00 today, all built from the daily table:

| Feature | Meaning |
|---|---|
| `pm25_until_17` | today so far |
| `lag_1` | yesterday's full-day mean |
| `mean_3`, `mean_7` | mean of the last 3 and 7 full days |
| `month` | the season, crudely |

Rolling means must end at **yesterday**, because today is not complete at 18:00.

`Ridge` is linear regression with a penalty that keeps coefficients small. On
488 days with correlated features, that stability is worth having.

## Steps

1. New notebook `notebooks/07_first_model.ipynb`. Same data, **same cut date** as
   DAF-06.
2. Build the features in the table above. Drop rows where any is missing and
   say how many rows that cost.
3. `Pipeline([("scale", StandardScaler()), ("model", Ridge())])`. Fit on train only.
4. Predict the test set. Report MAE and Poor-or-worse recall next to both
   baselines, in one small table.
5. Plot actual vs predicted over the test period, with the 90 µg/m³ line.
6. Print the Ridge coefficients and say in one line what each sign means.
7. Add a row to `reports/experiments.csv`.
8. Write the verdict: did it beat persistence by 10% on MAE, and without losing
   recall? Yes or no, with the numbers.

## Acceptance criteria

- [ ] Every feature is computable at 18:00 — no feature uses today's full mean
      or anything from tomorrow
- [ ] The scaler is inside the pipeline, fitted on train only
- [ ] Test MAE and recall appear beside both baselines
- [ ] The plot shows the test period and the 90 line
- [ ] `reports/experiments.csv` has a third row
- [ ] The verdict states the percentage change in MAE against persistence

## Explain back

1. Why must the scaler live inside the pipeline, rather than being fitted on the
   whole table first?
2. `month` is a number from 1 to 12. What is wrong with that for a linear model,
   and what would fix it? (Do not fix it here — DAF-14.)
3. Look at the plot. Where does the model fail worst, and is that where
   persistence also fails?

## Traps

- A rolling mean that includes today. `rolling(7).mean()` on the row for today
  includes today; shift it first.
- Tuning `alpha` against the test set. It stays at the default here; DAF-17
  tunes it properly.
- Stopping here because the model lost. A loss is a result. Write it down and
  keep going — the features in DAF-14 exist for exactly this.

## My notes

_The results table · the verdict · what the plot showed you._
