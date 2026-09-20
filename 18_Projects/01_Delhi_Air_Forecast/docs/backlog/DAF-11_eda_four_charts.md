---
id: DAF-11
title: EDA on the daily table — the story in four charts
phase: 3 — Understand and clean it
sprint: 3
estimate: 2 h
status: todo
depends_on: [DAF-10]
---

# DAF-11 · EDA on the daily table — the story in four charts

## Story

As the developer, I want four charts that explain R K Puram's air to someone who
has never seen the data, so that my feature ideas in DAF-14 come from evidence
rather than guesses.

## Why this ticket exists

EDA is not "make plots until something appears". Each chart answers one question
that decides something later. Four is a deliberate limit.

## Background

The four questions, and the ticket each one feeds:

| Chart | Question | Feeds |
|---|---|---|
| Daily PM2.5 over the whole span, with the 90 line | When is Asha's decision actually hard? | DAF-16 |
| Distribution by month (box plot) | How strong is the season, and how wide is each month? | DAF-14 calendar features |
| Today's `pm25_until_17` against tomorrow's target (scatter) | Why is persistence so hard to beat? | DAF-14 lags |
| Persistence error over time | On which days does "tomorrow = today" fail badly? | DAF-14, DAF-18 |

## Steps

1. New notebook `notebooks/11_eda.ipynb`, loading `data/processed/daily_17.parquet`.
2. Make the four charts. Title each with its question, not a description.
3. Under each, two or three sentences: what it shows, and what you will do about it.
4. Find the ten worst persistence-error days and look up what happened on them —
   festivals, weather, crop burning.

## Acceptance criteria

- [ ] Four charts, each titled with its question
- [ ] Each chart has a written takeaway that names a later ticket
- [ ] The ten worst persistence days are listed with a likely cause for each
- [ ] Charts use train and test data but no model is fitted here

## Explain back

1. What does the scatter plot tell you about why persistence is a strong baseline?
2. From the ten worst days, name one feature that might have predicted them.

## Traps

- Twenty charts. Four, each with a job.
- Choosing features by looking at the test period. You may look; note what you
  see; build features from reasoning, not from test-period patterns.

## My notes

_The feature ideas these charts gave you._
