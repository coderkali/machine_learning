---
id: DAF-05
title: The daily table and the target column, for R K Puram
phase: 3 — Understand and clean it
sprint: 2
estimate: 2-3 h
status: done
depends_on: [DAF-04]
---

# DAF-05 · The daily table and the target column, for R K Puram

## Story

As the developer, I want one row per day for R K Puram, each carrying
tomorrow's 24-hour mean as its target, so that a model has something to learn
from and a baseline has something to be scored against.

## Why this ticket exists

This is the first step of the **walking skeleton** (D-005): one station, all the
way to a real error number, before any polishing. DAF-05 builds the table,
DAF-06 scores the baselines on it, DAF-07 trains the first model. After those
three you have a real answer, and every later ticket improves on it.

The table is also where D-002 stops being words and becomes code: *tomorrow's
mean, 00:00–23:59 IST, and a day only counts with at least 18 hourly readings*.

## Background

- The 554 files under `data/raw/openaq/locationid=17/` are in narrow format:
  one row per reading, **every parameter mixed together**. PM2.5 is
  `parameter == "pm25"`.
- Readings arrive every **15 minutes**, not every hour. D-002's rule counts
  *hours*, so the order is: 15-minute → hourly → daily.
- `datetime` carries its own offset (`+05:30`). Keep it timezone-aware so a day
  boundary is IST midnight, not UTC midnight.
- At 18:00 today, today's full mean does **not** exist yet (requirements.md).
  What does exist is the mean of today's hours up to 17:00. Build both — the
  full mean is what tomorrow's target is made of, the partial one is what a
  model may use as a feature.

## Steps

1. New notebook `notebooks/05_daily_table.ipynb`. Read every raw file for
   location 17 into one frame. Never write back to `data/raw/`.
2. Keep PM2.5 only. Parse `datetime` as timezone-aware.
3. Resample to hourly means. Keep a count of how many hours each day has.
4. Build the daily table, one row per calendar date (IST):
   - `pm25_mean` — mean of that day's hours
   - `hours` — how many hours had a reading
   - `pm25_until_17` — mean of hours 00:00 to 17:00 only
5. Mark a day invalid when `hours < 18`. Do not delete it yet — you need to see
   how many there are.
6. Build `target` = the **next calendar day's** `pm25_mean`, and only when that
   next day is valid.
7. Save to `data/interim/daily_17.csv` and print a summary: days in span, valid
   days, invalid days, rows with a usable target.

## Acceptance criteria

- [ ] The notebook runs top to bottom on a fresh kernel
- [ ] The table has one row per date, with no duplicate dates
- [ ] `hours`, `pm25_mean`, `pm25_until_17` and `target` exist
- [ ] A day with fewer than 18 hours never becomes a target
- [ ] The target for date D is the mean of date **D + 1** — checked on at least
      one row where D + 1 is missing, which must give an empty target
- [ ] The summary prints the four counts from step 7, and you record them in
      My notes
- [ ] Nothing under `data/raw/` changed (`git status` and file timestamps)

## Explain back

1. Why can `pm25_until_17` be a feature but today's `pm25_mean` cannot?
2. What goes wrong if the target is built with `shift(-1)` on a table that has
   missing dates? Give a concrete example from your own table.
3. Why hourly first, then daily — why not average the 15-minute readings straight
   into a daily number?

## Traps

- `shift(-1)` pairs a day with the next **row**, not the next **date**. Where a
  day is missing, Monday silently gets Wednesday as its target.
- Resampling a timezone-naive column puts the day boundary at UTC midnight —
  05:30 in the morning in Delhi.
- Fixing oddities you notice (odd repeats, a huge value). Write them down;
  DAF-08 is where they get examined and DAF-09 where they get fixed.

## My notes

_Your four counts, your answers, and anything that looked odd._
