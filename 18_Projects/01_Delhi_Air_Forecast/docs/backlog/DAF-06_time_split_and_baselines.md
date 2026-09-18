---
id: DAF-06
title: Split by time, and score the baselines — the first MAE
phase: 4 — Split and pre-process
sprint: 2
estimate: 2-3 h
status: todo
depends_on: [DAF-05]
---

# DAF-06 · Split by time, and score the baselines — the first MAE

## Story

As Asha, I want to know how wrong my own method is — "tomorrow will be like
today" — so that any model can be judged against something I already do for free.

## Why this ticket exists

This is where the project gets its first real number. Every model from here on
is only as good as how much it beats this one.

It is also where the most common way to cheat in forecasting gets shut out.
Shuffle the rows before splitting and the model trains on next week to predict
last week. The score looks excellent and means nothing.

## Background

**MAE — mean absolute error.** For every test day, take |predicted − actual|,
then average. It is in the target's own unit, so "MAE = 22" means *on a typical
day the forecast is 22 µg/m³ off*. Lower is better. It is the headline metric
in `requirements.md`.

**Recall on Poor-or-worse days** is the safety metric: of the days that really
were ≥ 91 µg/m³, how many did we call ≥ 91? You compute it here for the
baselines too, because the model must not do worse than them.

**The single-winter problem.** R K Puram has one winter in the data (October
2025 to February 2026). Look at the monthly means before you choose where to
cut. If the test period is only summer and monsoon, it will contain almost no
Poor days, and the recall will be meaningless — dividing by nearly zero.

Two baselines, both needing no training:

| Baseline | Prediction for tomorrow | Knowable at 18:00? |
|---|---|---|
| Persistence (Asha's method) | today's `pm25_until_17` | yes |
| Yesterday's full day | yesterday's `pm25_mean` | yes |

## Steps

1. New notebook `notebooks/06_split_and_baselines.ipynb`. Load
   `data/interim/daily_17.csv`, keep rows with a usable target.
2. Plot the valid days by month and count Poor-or-worse days per month.
3. Choose **one cut date**. Everything before it is train, everything from it
   onwards is test. Write down why you chose it.
4. Print, for each side: rows, date range, Poor-or-worse days.
5. Score both baselines on the **test** rows: MAE and Poor-or-worse recall.
6. Start an experiment log at `reports/experiments.csv` with columns
   `ticket, date, model, features, mae, recall_poor, notes`. Add one row per
   baseline. Every later ticket adds rows here.
7. Then, as a deliberate demonstration, do a *random* 80/20 split, fit a
   `LinearRegression` on `pm25_until_17` alone, and compare its MAE with the
   time-split version. Write down what you see.

## Acceptance criteria

- [ ] Train and test do not overlap, and every test date is after every train date
- [ ] The test set contains Poor-or-worse days, and you state how many
- [ ] Both baselines report MAE and recall on the test set
- [ ] `reports/experiments.csv` exists with two rows
- [ ] The random-split demonstration is run and its result is written down, with
      your explanation of why it differs (or why it does not, here)
- [ ] The cut date and the reason for it are in My notes

## Explain back

1. What does MAE = 25 mean to Asha, in one sentence she would understand?
2. Why is a random split cheating for a forecast, even when it looks harmless?
3. Your test set is one stretch of time. What does that fail to tell you, and
   which ticket fixes it? (Hint: DAF-16.)

## Traps

- Choosing the cut date by trying several and keeping the one that makes the
  baseline look worst. The cut is chosen from the calendar and the Poor-day
  counts, before any score is seen.
- Scoring on the train rows. Baselines have nothing to fit, but the habit
  matters from the first ticket.

## My notes

_Cut date and why · train/test sizes · Poor days on each side · both baseline
MAEs and recalls · what the random split showed._
