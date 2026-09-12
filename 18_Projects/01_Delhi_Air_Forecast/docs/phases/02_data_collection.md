# Phase 2 brief · Getting the data

Everything here was verified against the live services on 2026-09-11. Where a
number matters (a rate limit, a maximum radius), it came from the service's own
specification, not from memory.

## How professionals structure this phase

Data work is kept in **zones**, and the rule is one-way traffic:

```text
raw  →  interim  →  processed
 ▲        ▲            ▲
 │        │            └── model-ready: one row per prediction, target included
 │        └── cleaned and combined, still human-readable
 └── exactly what the source sent. Never edited. Never deleted.
```

Three habits go with it:

1. **The collector is a script, not a notebook cell.** You will run it again.
2. **Idempotent:** running it twice does not download twice, and does not
   corrupt what is there.
3. **A data card** describes what arrived — sources, licence, columns, units,
   row counts, date range, coverage, and known problems. Written before any
   cleaning, so that "what the data was like when it arrived" is on the record.

## Source 1 — OpenAQ archive on S3 (the training data)

Real readings from government monitors, including India's CPCB network.

| | |
|---|---|
| Bucket | `s3://openaq-data-archive` — public, no credentials |
| Path | `records/csv.gz/locationid={id}/year={yyyy}/month={mm}/location-{id}-{yyyymmdd}.csv.gz` |
| Format | Gzipped CSV, narrow: one row per measurement |
| Columns | `location_id`, `sensors_id`, `location`, `datetime`, `latitude`, `longitude`, `parameter`, `units`, `value` |
| Freshness | Written 72 hours after the day ends |

Narrow format matters: PM2.5, PM10, NO₂ and the rest arrive as *rows*, not
columns. Turning that into one column per pollutant is a pivot, and it happens
in DAF-06, not in the collector.

## Source 2 — OpenAQ API v3 (stations now, live readings later)

| | |
|---|---|
| Key | Free, from `explore.openaq.org/register`, sent as the `X-API-Key` header |
| Limits | 60 requests/minute, 2,000/hour. Over that: **429** |
| No key | **401** |
| `GET /v3/locations` | `coordinates=lat,lon`, `radius` in metres (**max 25,000**), `parameters_id` (**PM2.5 = 2**), `bbox`, `limit` (default 100), `page` |
| `GET /v3/locations/{id}/sensors` | The sensor ids at a station, with first and last reading dates |
| `GET /v3/sensors/{id}/measurements` | Raw measurements, `datetime_from` / `datetime_to` |
| `GET /v3/sensors/{id}/days` | **Daily aggregates**, `date_from` / `date_to` |
| `GET /v3/locations/{id}/latest` | The most recent readings — this is what Phase 8 will call |

Note the `/days` endpoint. It is tempting, because it hands you daily averages
with no work. Resist it for training data: you would not see the hourly gaps
and faults, and your target definition would be someone else's, not the one you
wrote in DAF-02.

## Source 3 — Open-Meteo (weather, no key)

Confirmed working for Delhi on 2026-09-11.

| | |
|---|---|
| History | `https://archive-api.open-meteo.com/v1/archive` — `latitude`, `longitude`, `start_date`, `end_date`, `hourly=…`, `timezone` |
| Forecast | `https://api.open-meteo.com/v1/forecast` — same shape, used at prediction time |
| Key | None for non-commercial use |

Useful hourly variables: `temperature_2m`, `relative_humidity_2m`,
`wind_speed_10m`, `wind_direction_10m`, `precipitation`, `surface_pressure`.
Wind is the one that matters most for pollution: still air traps it, wind
clears it.

## Why not Open-Meteo's air quality API for the target?

It exists, it is free, and it needs no key — so it looks like the easy path.
It is the wrong choice for what we are predicting:

- It is **model output, not measurement**. Predicting another model's guesses
  teaches you to imitate that model, not reality.
- Global resolution is about **45 km**. Delhi is one pixel.
- Global coverage starts **August 2022**, so there is much less history.

It stays as a fallback if OpenAQ's Delhi coverage turns out to be too thin, and
as a possible extra input feature later.

## The risk, and the fallback

The one assumption in this phase is that Delhi has several OpenAQ stations with
years of PM2.5 history. DAF-03 tests that assumption before we build on it. If
it fails, in order of preference:

1. Widen the area to Delhi NCR (Noida, Gurugram, Ghaziabad) and treat the
   region rather than the city.
2. Use the CPCB city-day dataset published on Kaggle (2015–2020) as history,
   and the live API only for serving.
3. Use Open-Meteo's air quality history, accepting that the target is modelled.

Nothing in the later phases changes under any of these. Only the loader does.
