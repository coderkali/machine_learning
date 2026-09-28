---
id: DAF-15
title: Tree and ensemble models
phase: 6 — Models
sprint: 4
estimate: 2-3 h
status: todo
depends_on: [DAF-14]
---

# DAF-15 · Tree and ensemble models

## Story

As the developer, I want to know whether non-linear models beat Ridge on this
data, so that the final model is chosen on evidence rather than fashion.

## Why this ticket exists

Air quality has thresholds and interactions a linear model cannot express: low
wind matters far more in November than in July. Trees can learn that. They can
also memorise 400 rows perfectly and fail on the next 90, so this ticket watches
the gap between train and test error as closely as the test error itself.

## Background

| Model | Strength | Watch for |
|---|---|---|
| `DecisionTreeRegressor` | Readable; shows the splits it learned | Overfits badly — a teaching model |
| `RandomForestRegressor` | Robust, little tuning | Cannot predict beyond the largest target it has seen |
| `HistGradientBoostingRegressor` | Usually strongest on tables | More settings; overfits small data if unchecked |

Trees do not need scaling, but keep them inside a `Pipeline` so the interface
stays the same as Ridge's.

## Steps

1. Notebook `notebooks/15_trees.ipynb`, same features and cut date as the best
   DAF-14 row.
2. Fit all three with default settings. For each, report **train MAE and test
   MAE** and recall.
3. Plot a depth-3 decision tree and read its top splits aloud in My notes.
4. Add three rows to the experiment log.

## Acceptance criteria

- [ ] Three models scored, each with train and test MAE
- [ ] The tree plot exists and its first two splits are explained in words
- [ ] The best model so far is named, with the numbers that make it best
- [ ] No hyper-parameter was chosen by looking at the test score

## Explain back

1. What does a large gap between train and test MAE tell you?
2. Why can a random forest never predict a value above the largest target in its
   training data? When does that hurt Asha?

## Traps

- Tuning here. Defaults only; DAF-17 tunes with proper cross-validation.

## My notes

_Your model ranking, with the train/test gaps._
