---
id: DAF-09
title: Clean it, one logged decision per fault — and re-score
phase: 3 — Understand and clean it
sprint: 3
estimate: 3 h
status: todo
depends_on: [DAF-08]
---

# DAF-09 · Clean it, one logged decision per fault — and re-score

## Story

As the developer, I want every fault from DAF-08 either fixed or deliberately
left alone, with the reason written down, so that the cleaned table can be
defended line by line.

## Why this ticket exists

Cleaning is where most silent damage to a model happens: a threshold picked by
eye, a fill that invents data, a drop that removes exactly the bad days Asha
cares about. Writing one decision per fault forces each choice into the open.

Then you re-run the DAF-07 model on the cleaned table. If the MAE does not move,
that is useful too: the fault did not matter for this model.

## Background

For each fault, pick one treatment and state it:

| Treatment | When it fits | Its danger |
|---|---|---|
| Leave it | The fault is real-world behaviour, not a sensor error | The model learns something odd |
| Drop the rows | The value is impossible and rare | Dropping extremes removes the days that matter most |
| Cap it | A spike is real in direction but not in size | The cap is a guess; write the guess down |
| Interpolate a short gap | One or two missing hours inside an otherwise good day | Invented readings, if the gap is long |
| Mark it | You cannot decide yet | Nothing — a flag column is cheap |

Cleaning happens **between raw and interim**. Raw stays untouched.

## Steps

1. New notebook `notebooks/09_clean.ipynb`. Start again from `data/raw/`.
2. For each fault in `docs/data_faults.md`, add a decision underneath it:
   chosen treatment, why, and how many rows it changed.
3. Apply the treatments in one place, in a fixed order, before the hourly step.
4. Rebuild the daily table and target exactly as in DAF-05. Save as
   `data/interim/daily_17_clean.csv`.
5. Re-run the DAF-07 pipeline, same cut date, on the cleaned table.
6. Add a row to `reports/experiments.csv`.

## Acceptance criteria

- [ ] Every fault in `docs/data_faults.md` has a decision, including "leave it"
- [ ] Each decision states how many rows it changed
- [ ] `data/raw/` is unchanged
- [ ] Poor-or-worse days before and after cleaning are both counted, so you can
      see whether cleaning removed bad days
- [ ] The re-scored MAE and recall are in the experiment log, next to the
      pre-cleaning row

## Explain back

1. Which of your decisions was hardest, and what would make you change it?
2. Did cleaning change the MAE? Explain why, or why not.
3. Why must the same cleaning code run on the live data in Phase 8?

## Traps

- Removing outliers with a rule like "drop anything above 3 standard deviations".
  In Delhi that deletes Diwali — the one night Asha most needs a warning for.
- Cleaning test rows with statistics computed from all rows. A cap chosen from
  the whole table has seen the test period.

## My notes

_The before/after row in the experiment log, and your hardest decision._
