---
id: DAF-19
title: Live feature builder from the two APIs
phase: 8 — Service and delivery
sprint: 5
estimate: 3 h
status: todo
depends_on: [DAF-18]
---

# DAF-19 · Live feature builder from the two APIs

## Story

As the service, at 18:00 IST I need to build tonight's feature row from live data,
exactly as the training table built it, so that the model sees the same kind of
input it learned from.

## Why this ticket exists

Training read files from disk. Production has no files for today: the S3 archive
lags about 72 hours behind (DAF-04). Today's readings and the last few days have
to come from the OpenAQ API, and tomorrow's weather from the Open-Meteo forecast.

This is where training/serving skew happens if it is going to happen at all. The
builder must reuse `clean.py` and the feature code, not re-implement them.

## Background

What the builder needs at 18:00 on date D:

| Input | Covers | Live source |
|---|---|---|
| PM2.5 readings for sensor 12234787 | the last ~15 days up to 17:00 today | OpenAQ API v3, sensor measurements, with the key from `.env` |
| Tomorrow's weather | D + 1, hourly | Open-Meteo forecast API |
| Calendar and festival flags | D + 1 | the file from DAF-14 |

The OpenAQ API needs the key (a request without one returns 401 — checked
2026-09-18) and allows 60 requests a minute.

## Steps

1. Create `src/delhi_air/live.py` with `build_features(for_date) -> one-row frame`.
2. Fetch PM2.5 from the API, put it into the same shape `load_raw` produces, then
   run it through the **same** cleaning and feature functions.
3. Fetch tomorrow's forecast and aggregate it with the DAF-13 functions.
4. **Parity test:** pick a past date inside the training span. Build its features
   with the live builder and compare them with that date's row in the training
   table. They should match, apart from forecast weather.
5. Handle failures: API down, too few hours today. Return a clear error rather
   than a silent guess.

## Acceptance criteria

- [ ] `build_features` returns one row with exactly the model's feature columns
- [ ] The parity test passes for at least one past date, with any differences
      explained
- [ ] The builder imports cleaning and feature code; it does not copy it
- [ ] A missing API key, API downtime and too-few-hours each give a clear error
- [ ] No key appears in code or logs

## Explain back

1. Why can't the service read today's data from the S3 archive?
2. What would a parity failure mean, and why is it dangerous?

## Traps

- Rewriting the feature logic "just for live". That is exactly the skew bug.
- Forgetting the lag features need two weeks of history, not just today.

## My notes

_Parity test result and any differences._
