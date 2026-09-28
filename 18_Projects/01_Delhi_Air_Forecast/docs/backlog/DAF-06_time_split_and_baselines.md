---
id: DAF-06
title: Split by time, and score the baselines — the first MAE
phase: 4 — Split and pre-process
sprint: 2
estimate: 2-3 h
status: review
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
   Answer:: MAE 25 means how much she is predicting wrong about next day weather
   Review (Claude): Right idea. Make it exact: give the unit, say "on a typical
   day", and name what is predicted. It is tomorrow's PM2.5, not the weather.
   Example shape: "On a normal day, my forecast for tomorrow's PM2.5 is about 25
   µg/m³ away from what really happens." Then compare it with her free habit
   (persistence, about 16). Status: revise.
2. Why is a random split cheating for a forecast, even when it looks harmless?
   Answer:: Random split is harrmless because lets say we are predicting the 1st
   March , but our model nveer trained on previous days instead it was just
   trained on future daya like 2nd and 3rd march
   Review (Claude): The example is exactly the right one: predicting 1 March
   after learning from 2 and 3 March means the model has seen the future. Two fixes:
   (a) the first sentence says "harmless", but the point is that it *looks*
   harmless and is not; (b) the model is trained on a mix of days before and
   after the test day, not only on future days. Add why it matters: neighbouring
   days have similar air, so the test day is easy, and the score can look better
   than real life. Status: revise.
3. Your test set is one stretch of time. What does that fail to tell you, and
   which ticket fixes it? (Hint: DAF-16.)
   Answer:: i am not sure what exactly faiule d, may be i will get more
   explannation future
   Review (Claude): Not answered yet. Direction: our test is only March to
   September 2026, with 17 Poor days. Ask what one score from one period can and
   cannot say about other periods, such as winter. Status: open.

## Traps

- Choosing the cut date by trying several and keeping the one that makes the
  baseline look worst. The cut is chosen from the calendar and the Poor-day
  counts, before any score is seen.
- Scoring on the train rows. Baselines have nothing to fit, but the habit
  matters from the first ticket.

## My notes

**Cut date: 2026-03-01.** Chosen from the calendar and the Poor-day counts in
the monthly chart, before any score was calculated. Everything before it is
train, everything from it onwards is test. Reason: the train side keeps the whole
winter (the dirtiest months), and the test side still holds 17 Poor-or-worse days,
so recall has a real denominator. It also puts the test period after every train
day, like a real forecast.

**Sizes and Poor days (rows with a usable target)**

| Side | Rows | Date range | Poor-or-worse days |
|---|---:|---|---:|
| Train | 323 | 2025-02-19 to 2026-02-28 | 139 |
| Test | 164 | 2026-03-01 to 2026-09-10 | 17 |

3 of the 164 test rows have a missing guess, so the baselines are scored on the
same **161** rows.

**Baselines on the 161 test rows** (also logged in `reports/experiments.csv`)

| Baseline | MAE | Recall on Poor days | Caught / missed | False alarms |
|---|---:|---:|---|---:|
| Persistence (`pm25_until_17`) | 15.73 | 0.471 | 8 / 9 | 12 |
| Yesterday's full day | 16.40 | 0.471 | 8 / 9 | 10 |

Both baselines missed more than half of the 17 Poor days. Recall rests on only 17
days, so one day changes it by about 6 points.

**Random-split demonstration** (`LinearRegression` on `pm25_until_17`, 482 usable rows)

| Way of scoring | MAE | Test days |
|---|---:|---|
| Time split (train before the cut) | 19.58 | 162 days, average tomorrow 55.7 |
| Random 80/20, `random_state=42` | 31.81 | 97 days, all months |
| Random 80/20, `random_state` 0 to 4 | 25.80 to 30.01 | average tomorrow 80.7 to 102.8 |
| Random 70/30, `random_state=42` | 30.24 | 145 days, average tomorrow 89.2 |

What it showed:
- The random split did **not** look better than the time split here. Its test days
  are dirtier (average 85 to 89 against 55.7, with a 397 spike), so the errors are
  bigger. The two MAEs are measured on different days and cannot be compared.
- The random score changes with the shuffle (a spread of 4.21 over five shuffles).
  The time split gives one repeatable number.
- It still leaks: all 97 test days were older than the newest train day, so the model
  had learned from days after them. With one input and a straight line it cannot
  memorise, so the harm is small here. A model with many lag features would use it.
- The trained model (19.67 on the same 161 days) lost to free persistence (15.73).
  It learned its line mostly from dirty winter days (train average 110.7), and its
  intercept of about 27 pushes March to September forecasts up.
