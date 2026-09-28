---
id: DAF-18
title: Final test run, error analysis, and the model card
phase: 7 — Evaluation and tuning
sprint: 5
estimate: 3 h
status: todo
depends_on: [DAF-17]
---

# DAF-18 · Final test run, error analysis, and the model card

## Story

As Asha, I want one honest answer: does this beat my own method, by how much, and
when should I not trust it?

## Why this ticket exists

This is the answer to the project's question. The frozen model from DAF-17 is
scored **once** on the test period and the result is written down, whatever it is.
A model that loses, reported honestly, is a better outcome than one that wins
because the test set was peeked at.

## Background

Success, from `requirements.md`:

- MAE at least **10% lower** than persistence, **and**
- recall on Poor-or-worse days **not lower** than persistence's

A model card is a one-page document that travels with the model: what it
predicts, what data it learned from, how well it does, and where it fails.

## Steps

1. Train the frozen model on all train rows. Score it once on the test set.
   Also report the walk-forward result from DAF-16 next to it.
2. State the verdict against both success criteria, with numbers.
3. Error analysis: the ten worst test days — date, actual, forecast,
   persistence's forecast, and a likely reason.
4. Save the model with `joblib` to `models/pm25_station17_v1.joblib`, alongside
   the feature list and the training date range.
5. Write `docs/model_card.md`: purpose, data (station 17, dates, D-005),
   features, metrics, the decision threshold, known failure cases, and "do not
   use for" limits.

## Acceptance criteria

- [ ] The test set is scored exactly once — the notebook shows no second attempt
- [ ] The verdict answers both success criteria with numbers
- [ ] The ten-worst-days table exists with reasons
- [ ] The model file loads in a fresh Python session and reproduces one test prediction
- [ ] `docs/model_card.md` has every section in step 5

## Explain back

1. Did the model meet the success criteria? If not, what is the most likely
   reason, and what would you try next?
2. What would you tell Asha about when not to trust the forecast?

## Traps

- Re-running the test with a small tweak "because the result looked off". That
  turns the test set into a second validation set.

## My notes

_The verdict, in one sentence you would say in an interview._
