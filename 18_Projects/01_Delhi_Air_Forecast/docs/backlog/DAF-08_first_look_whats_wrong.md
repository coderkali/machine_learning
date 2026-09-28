---
id: DAF-08
title: First look — find what is wrong with the raw data
phase: 3 — Understand and clean it
sprint: 2
estimate: 2-3 h
status: todo
depends_on: [DAF-07]
---

# DAF-08 · First look — find what is wrong with the raw data

## Story

As the developer, I want a written list of every fault in R K Puram's raw data,
each with evidence, so that cleaning is a set of deliberate decisions rather than
a pile of fixes I cannot explain later.

## Why this ticket exists

Now there is a model, the data work has a purpose: it is judged by whether it
moves the MAE. This ticket only **finds and measures** problems. Nothing is
fixed here — DAF-09 does that, one logged decision per fault.

Separating "find" from "fix" is how you avoid the worst data bug there is: a
fix you cannot remember making, that quietly changes every result after it.

## Background

Look in at least these places. Each one hides something in this station's data:

| Where to look | Question to ask |
|---|---|
| The 15-minute readings inside one hour | Are they four independent measurements? |
| The biggest values | Is the largest reading plausible for Delhi air? What was happening that day? |
| Missing hours and missing days | Random, or in blocks? Which months? |
| The invalid days from DAF-05 | Are they spread out, or clustered? |
| The other `parameter` values in the files | What else does this station measure, and could any of it help a forecast? |
| `sensors_id` | Is there exactly one PM2.5 sensor across the whole span? |

## Steps

1. New notebook `notebooks/08_first_look.ipynb`. Read from `data/raw/` and
   `data/interim/daily_17.csv` only.
2. For each place in the table, measure it: a count, a percentage, or a plot.
3. Plot the hourly series for the whole span, and zoom into the week around the
   biggest value.
4. Write `docs/data_faults.md`: one row per fault — what it is, evidence, how
   many rows it touches, and what *could* be done about it (options, not a
   decision).
5. Also list the other parameters the station records, with their coverage.

## Acceptance criteria

- [ ] `docs/data_faults.md` exists with at least four faults, each with a
      number or a plot as evidence
- [ ] Nothing in `data/` was modified by this notebook
- [ ] The biggest value is investigated, not just reported
- [ ] The list of other parameters shows how complete each one is
- [ ] Each fault lists at least two possible treatments

## Explain back

1. Why is "find" a separate ticket from "fix"?
2. Which fault do you expect to move the MAE the most, and why?
3. The station records wind speed. Why can't that simply replace a weather
   forecast at 18:00?

## Traps

- Fixing as you go. Every fix belongs in DAF-09, with its decision written down.
- Calling every large value an error. Delhi in November genuinely reaches values
  that look impossible elsewhere. Evidence first, verdict later.

## My notes

_Which fault surprised you most, and why._
