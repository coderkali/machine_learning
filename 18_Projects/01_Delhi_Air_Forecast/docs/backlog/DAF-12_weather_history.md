---
id: DAF-12
title: Download the weather history for R K Puram
phase: 2 — Get the data
sprint: 3
estimate: 2-3 h
status: todo
depends_on: [DAF-10]
---

# DAF-12 · Download the weather history for R K Puram

## Story

As the developer, I want hourly weather for R K Puram's coordinates over the
same span as the PM2.5 data, saved raw, so that the model can learn that still
air traps pollution and wind clears it.

## Why this ticket exists

PM2.5 alone knows the past. Weather — especially wind and humidity — is what
changes tomorrow. It is also where the trickiest leak in this project hides, so
this ticket downloads **two** versions and DAF-13 decides between them.

## Background

Verified against the live services on 2026-09-18 for latitude 28.5633,
longitude 77.1869 — both answer, no key needed:

| API | URL | Gives |
|---|---|---|
| Archive | `https://archive-api.open-meteo.com/v1/archive` | The weather that **actually happened** |
| Historical forecast | `https://historical-forecast-api.open-meteo.com/v1/forecast` | The weather that **was forecast** at the time |

Parameters for both: `latitude`, `longitude`, `start_date`, `end_date`,
`hourly=...`, `timezone=Asia/Kolkata`.

Useful hourly variables: `temperature_2m`, `relative_humidity_2m`,
`wind_speed_10m`, `wind_direction_10m`, `precipitation`, `surface_pressure`.

At 18:00, only a forecast of tomorrow exists. A model trained on what *actually
happened* is trained on better information than it will ever get in production.
That is the train/serve gap `requirements.md` warns about.

## Steps

1. Create `src/delhi_air/collect_weather.py` with a CLI:
   `--source archive|forecast --start-date --end-date --station 17`.
   Coordinates come from `data/raw/stations.csv`, not hard-coded.
2. Save each response **unchanged** as JSON under
   `data/raw/openmeteo/{source}/location-17-{start}-{end}.json`.
3. Idempotent, like the OpenAQ collector: an existing file is skipped.
4. Download both sources for 2025-02-19 → 2026-09-11. Fetch in chunks if a single
   request is refused, and note the chunk size that worked.
5. In a notebook, load both, check hours per day, and plot one week of wind speed
   from each source on the same axes.

## Acceptance criteria

- [ ] `python -m delhi_air.collect_weather --help` prints usage
- [ ] Both sources are on disk as raw JSON, one run per source
- [ ] A second run downloads nothing
- [ ] Hourly coverage for the whole span is checked and stated
- [ ] The one-week comparison plot exists, and you describe the difference you see

## Explain back

1. What is the difference between the two APIs, in one sentence each?
2. Why would training on archive weather make the model look better in testing
   than it will be in production?
3. The station also measures wind itself (DAF-08). Why download weather at all?

## Traps

- Hard-coding latitude and longitude in the script.
- Merging weather into the PM2.5 table here. That is DAF-13, after the decision.

## My notes

_What the one-week comparison showed._
