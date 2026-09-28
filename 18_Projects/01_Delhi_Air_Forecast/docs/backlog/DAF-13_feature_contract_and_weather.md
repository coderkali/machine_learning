---
id: DAF-13
title: The feature contract — what is knowable at 18:00 — and weather features
phase: 5 — Features
sprint: 4
estimate: 2-3 h
status: todo
depends_on: [DAF-11, DAF-12]
---

# DAF-13 · The feature contract, and weather features

## Story

As the developer, I want a written list of every feature, where it comes from
and when it becomes knowable, so that no feature can sneak in information the
service will not have at 18:00.

## Why this ticket exists

A feature contract is the ML version of an API contract. The training table and
the live service both have to honour it. Without it, the most common production
failure in forecasting — a model trained on data it will never see live — goes
unnoticed until the numbers are bad.

This ticket also makes the weather decision that DAF-12 set up.

## Background

A contract row looks like this:

| Feature | Source | Covers | Knowable at 18:00 today? | Live source (Phase 8) |
|---|---|---|---|---|
| `pm25_until_17` | OpenAQ | today 00:00–17:00 | yes | OpenAQ API |
| `wind_tomorrow_mean` | Open-Meteo | tomorrow 00:00–23:59 | only as a **forecast** | Open-Meteo forecast |

The weather decision, with three options:

| Option | For | Against |
|---|---|---|
| Train on archive (what happened) | Cleanest signal | Train/serve gap: production only has forecasts |
| Train on historical forecasts | Same kind of data as production | Noisier; forecasts are wrong sometimes |
| Train on archive, test on historical forecasts | Shows the size of the gap honestly | More work |

## Steps

1. Write `docs/feature_contract.md` with every feature from DAF-07, plus weather
   features aggregated to one value per day (for example tomorrow's mean wind,
   max humidity, total rain).
2. Build the weather features for **tomorrow** from both sources.
3. Run the DAF-07 pipeline three times — no weather, archive weather, forecast
   weather — same cut date. Log all three in `reports/experiments.csv`.
4. Record the choice as **D-006** in `docs/decisions/`.

## Acceptance criteria

- [ ] `docs/feature_contract.md` lists every feature, with all five columns filled
- [ ] No feature in the contract needs information after 18:00 today, except
      weather marked "forecast"
- [ ] Three rows in the experiment log compare no weather / archive / forecast
- [ ] D-006 exists and quotes the numbers it was decided on

## Explain back

1. Explain the train/serve gap using your own three experiment rows.
2. Why is a feature contract worth writing for a model with only ten features?

## Traps

- Using the archive-weather row as "the result". If production only has
  forecasts, the forecast row is the honest number.
- Joining weather by date without checking both tables use IST dates.

## My notes

_The three MAEs, and what D-006 decided._
