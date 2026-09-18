---
id: DAF-14
title: Lag, rolling and calendar features — and selection on train only
phase: 5 — Features
sprint: 4
estimate: 3 h
status: todo
depends_on: [DAF-13]
---

# DAF-14 · Lag, rolling and calendar features, and selection on train only

## Story

As the developer, I want richer features that describe recent history and the
season, and a principled way to keep only the useful ones, so that the model can
see what persistence cannot.

## Why this ticket exists

Persistence only knows today. A model beats it by knowing things persistence
ignores: whether the air has been getting worse for a week, what month it is,
whether Diwali is tomorrow. This ticket adds those, one family at a time, so each
family's effect is measured on its own.

## Background

Families to try — each must pass the DAF-13 contract:

| Family | Examples | Why it might help |
|---|---|---|
| Lags | `lag_1`, `lag_2`, `lag_7` | Momentum, and weekly rhythm |
| Rolling | 3/7/14-day mean, 7-day std, 7-day max | Trend and volatility |
| Change | `pm25_until_17 − lag_1` | Is today worse than yesterday? |
| Calendar | month as sin/cos, day of week, day of year | Season, without pretending December is far from January |
| Events | festival flag, crop-burning season flag | The ten worst days from DAF-11 |

Feature selection must learn from **train rows only**. Two simple ways: put a
selector inside the pipeline (`SelectKBest`), or use permutation importance
computed on a validation slice taken from the end of the train period.

## Steps

1. Add the features to `clean.py` (or a new `features.py`), with a test for each
   family, and update the feature contract.
2. Add one family at a time. After each, re-score Ridge with the same cut date
   and add a row to the experiment log.
3. Run feature selection on train only. Keep a named final set.
4. Look up the festival dates you need and put them in a small file in the repo,
   with the source.

## Acceptance criteria

- [ ] One experiment-log row per feature family, so each family's effect is visible
- [ ] Every new feature is in the contract and knowable at 18:00
- [ ] Month is encoded cyclically, and you can say why
- [ ] Selection uses no test rows — shown in code
- [ ] The final feature set is named and listed in My notes

## Explain back

1. Why sin/cos for month instead of 1–12?
2. Which family helped most, and which did nothing? Did that match your DAF-11 guess?
3. Why does feature selection on all rows leak, even though it is not "training"?

## Traps

- Adding every family at once. You would not know which one helped.
- A festival flag for tomorrow is fine — the calendar is known in advance.
  A flag built from "days that turned out to be bad" is leakage.

## My notes

_Best feature set, and the family that surprised you._
