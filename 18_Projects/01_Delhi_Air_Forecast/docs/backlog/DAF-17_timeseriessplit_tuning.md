---
id: DAF-17
title: TimeSeriesSplit cross-validation and tuning
phase: 7 — Evaluation and tuning
sprint: 5
estimate: 2-3 h
status: todo
depends_on: [DAF-16]
---

# DAF-17 · TimeSeriesSplit cross-validation and tuning

## Story

As the developer, I want the best one or two models tuned without ever touching
the test period, so that the final score in DAF-18 is honest.

## Why this ticket exists

Tuning against the test set is the quietest way to overfit: after twenty tries,
the "best" setting is partly just luck on those particular days. Cross-validation
on the train period does the tuning; the test period is opened once, in DAF-18.

## Background

`TimeSeriesSplit` makes folds that respect time: each fold trains on an earlier
stretch and validates on the stretch right after it. Ordinary `KFold` shuffles the
future into the past.

With about a year of train rows, keep it small: 4–5 folds, and a handful of
settings per model. `RandomizedSearchCV` with `scoring="neg_mean_absolute_error"`.

What to tune:

| Model | Settings worth searching |
|---|---|
| Ridge | `alpha` |
| HistGradientBoosting | `learning_rate`, `max_depth`, `min_samples_leaf`, `max_iter` |
| RandomForest | `max_depth`, `min_samples_leaf`, `max_features` |

## Steps

1. Notebook `notebooks/17_tuning.ipynb`, train rows only.
2. Plot the `TimeSeriesSplit` folds as bars on a timeline so you can see them.
3. Tune the best linear and the best tree model from DAF-15/16.
4. Compare tuned vs default using the **cross-validation** score, not the test score.
5. Choose the final model and settings. Freeze them in a small config file
   (`models/final_config.json` or similar).

## Acceptance criteria

- [ ] The fold plot shows every validation fold after its training fold
- [ ] No test row is used anywhere in this notebook — shown in code
- [ ] Tuned vs default CV MAE is reported for both models
- [ ] The final model and its settings are frozen before DAF-18 opens

## Explain back

1. Why does `KFold` with shuffle cheat on this data?
2. How much did tuning help, and was it worth the complexity?

## Traps

- "Just checking" the test score after tuning. Once looked at, it is no longer a
  test set.

## My notes

_The final model and settings, and the CV improvement._
