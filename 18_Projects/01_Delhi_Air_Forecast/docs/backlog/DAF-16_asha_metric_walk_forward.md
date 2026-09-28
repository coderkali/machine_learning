---
id: DAF-16
title: The metric that matches Asha's decision — walk-forward evaluation
phase: 7 — Evaluation and tuning
sprint: 4
estimate: 3 h
status: todo
depends_on: [DAF-15]
---

# DAF-16 · The metric that matches Asha's decision — walk-forward evaluation

## Story

As Asha, I do not care about the average error on a calm July day. I care about
the evening I send 600 children outside on a Poor day. I want the model judged on
that.

## Why this ticket exists

Two weaknesses in every score so far:

1. **MAE treats all errors alike.** Missing a Poor day costs Asha far more than a
   false alarm.
2. **One cut date is one experiment.** With a single winter in the data, one
   test period cannot say how the model does across seasons.

This ticket fixes both.

## Background

**The decision view.** Turn every forecast into Asha's action with the CPCB
table (D-001), then count:

| | Actually Poor or worse | Actually below 91 |
|---|---|---|
| Forecast Poor or worse | correct warning | false alarm |
| Forecast below 91 | **missed Poor day — the dangerous one** | correct all-clear |

Recall = correct warnings ÷ all actual Poor days. Precision = correct warnings ÷
all warnings.

**Walk-forward evaluation.** Pick a start date. Train on everything before it,
predict the next month, move forward a month, retrain, repeat. Every month gets
scored by a model that never saw it, and the winter is tested by a model trained
only on what came before.

**Moving the line.** If the model misses Poor days, it can warn at a lower
forecast (say 80) to raise recall at the cost of more false alarms. That is a
product decision, not a modelling trick — it becomes D-007 if you make it.

## Steps

1. Write a function that returns MAE, recall, precision and the confusion matrix
   for any set of predictions.
2. Write a walk-forward loop: monthly steps, expanding window, retrain each step.
3. Run it for persistence, the best Ridge, and the best tree model. Report the
   metrics per month and overall.
4. Plot recall per month for the three.
5. Try warning thresholds from 70 to 100. Plot recall and false alarms against
   threshold. Decide whether to move the line, and record D-007 if you do.

## Acceptance criteria

- [ ] The confusion matrix is shown for the best model on the walk-forward results
- [ ] Walk-forward covers the winter months, with the model at each step trained
      only on earlier data
- [ ] Per-month MAE and recall are reported for all three
- [ ] The threshold plot exists, and a decision about the line is written down
- [ ] Experiment-log rows are added, marked `walk-forward`

## Explain back

1. Why is a missed Poor day worse than a false alarm, in Asha's terms?
2. What does walk-forward evaluation tell you that a single cut date cannot?
3. If you lowered the warning line, what did it cost, in false alarms per month?

## Traps

- Leaking the future inside the loop: a scaler or a feature computed once on all
  rows before looping.
- Choosing the warning threshold to maximise recall alone. A model that always
  says "indoors" has perfect recall and is useless.

## My notes

_The per-month table, and your threshold decision._
