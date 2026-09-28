---
id: DAF-10
title: Graduate the table build into clean.py, with tests
phase: 3 — Understand and clean it
sprint: 3
estimate: 2-3 h
status: todo
depends_on: [DAF-09]
---

# DAF-10 · Graduate the table build into `clean.py`, with tests

## Story

As the developer, I want the path from raw files to daily table to be a tested
Python module, so that the live service in Phase 8 builds features with exactly
the same code the model was trained on.

## Why this ticket exists

A notebook is a record of thinking; it is not something to depend on. The day
the service computes `pm25_until_17` slightly differently from the notebook, the
model gets inputs it never saw in training, and nothing crashes — it just gets
quietly worse. This is the *training/serving skew* bug, and one shared module is
the fix.

This is the kind of code you already write at work: small pure functions, unit
tests, a command-line entry point.

## Background

A shape that works (the names are yours to choose):

```text
load_raw(location_id, raw_root)        -> 15-minute PM2.5 frame
apply_cleaning(frame)                  -> the DAF-09 decisions, in order
to_hourly(frame)                       -> hourly frame
to_daily(hourly, min_hours=18)         -> daily table with hours, mean, until_17
add_target(daily)                      -> next calendar day's mean
```

Tests use tiny hand-built frames, not the real data, so each one proves exactly
one rule.

## Steps

1. Create `src/delhi_air/clean.py` with the functions above.
2. Create `tests/test_clean.py`. At minimum, a test for each of:
   - a day with 17 hours is invalid; a day with 18 is valid
   - the target of date D is the mean of D + 1, and is empty when D + 1 is missing
   - the day boundary is IST midnight, not UTC midnight
   - `pm25_until_17` ignores hours 18 to 23
   - each cleaning decision from DAF-09 does what its decision says
3. Add a CLI: `python -m delhi_air.clean --station 17` writes
   `data/processed/daily_17.parquet`.
4. Change the DAF-09 notebook to import from the module, and check it produces
   the same table as before.

## Acceptance criteria

- [ ] `pytest` passes, with at least five tests
- [ ] The CLI writes `data/processed/daily_17.parquet`
- [ ] The module's output equals the DAF-09 notebook's table (same rows, same
      values, compared in code)
- [ ] No notebook contains its own copy of the table-building logic any more
- [ ] `git status` shows code and tests, no data

## Explain back

1. What is training/serving skew, and how does this module prevent it?
2. Why test with tiny hand-made frames instead of the real data?
3. Which of your tests would have caught the `shift(-1)` bug from DAF-05?

## Traps

- Tests that only check "it runs". Each test asserts one specific number.
- Writing the timezone test with naive timestamps, so it passes for the wrong reason.

## My notes

_Test count, and which test was hardest to write._
