---
id: DAF-03
title: OpenAQ key, and Delhi's real station list
phase: 2 — Get the data
sprint: 1
estimate: 2-3 h
status: todo
depends_on: [DAF-01, DAF-02]
---

# DAF-03 · OpenAQ key, and Delhi's real station list

## Story

As the developer, I want the list of Delhi stations that genuinely report PM2.5
with enough history, so that I download the right data — and so that I find out
in week one, not week four, if the source cannot support this project.

## Why this ticket exists

This is a **risk ticket**. Everything after it assumes Delhi has several
stations with years of usable readings. That is very likely, but "very likely"
is not "checked". A professional finds out on day three, while changing course
is still cheap.

It is also your first real integration against a third-party API: a key, a
header, paging, rate limits, and error codes you have to react to rather than
ignore. You have done this many times in Java. The unfamiliar part is only the
library.

## Background

Verified against OpenAQ's live API specification on 2026-09-11 — see
[`docs/phases/02_data_collection.md`](../phases/02_data_collection.md) for the
full reference. The short version:

- Register free at `explore.openaq.org/register`. The key goes in the
  `X-API-Key` header. Without it the API returns **401**.
- Limits: **60 requests a minute, 2,000 an hour**. Over that you get **429**.
- `GET /v3/locations` takes `coordinates=lat,lon` and `radius` in metres, with
  a **maximum radius of 25,000** — which does not cover all of Delhi NCR, so
  either use `bbox` or make several calls. It also takes `parameters_id`
  (**PM2.5 is `2`**), `limit` (default 100) and `page`.
- `GET /v3/locations/{id}/sensors` gives each sensor's id and its first and
  last reading date. The sensor id, not the location id, is what later
  endpoints need.

## Steps

1. Register, and put the key in `.env` as `OPENAQ_API_KEY=…`. Confirm
   `git status` still shows nothing.
2. In `notebooks/03_station_discovery.ipynb`, load the key with `python-dotenv`.
   Never print it, and never paste it into a cell.
3. Call `/v3/locations` for Delhi. Handle paging properly — the default gives
   you 100 rows and says nothing about the rest.
4. For each location, fetch its sensors and keep the PM2.5 one, with its first
   and last reading date.
5. Build `data/raw/stations.csv` with: `location_id`, `sensor_id`, `name`,
   `latitude`, `longitude`, `provider`, `first_reading`, `last_reading`.
6. Make a coverage table: for each station, which years it covers. Look at it
   before choosing.
7. Record **D-003** (which stations, and the rule you used to pick them) and
   **D-004** (the date range the project will train on).
8. **Risk gate:** if fewer than five stations have two or more years of data,
   stop and tell me. We switch to a fallback rather than build on sand.

## Acceptance criteria

- [ ] The key is loaded from `.env`; searching the repository for the key text
      finds nothing
- [ ] `data/raw/stations.csv` exists with the eight columns above
- [ ] Paging is handled — you can show that the row count is not capped at 100,
      or explain how you confirmed there was only one page
- [ ] The code reacts to **401** with a clear message, and to **429** by waiting
      and retrying rather than crashing
- [ ] A coverage table (station × year) is printed in the notebook
- [ ] `D-003` and `D-004` are written, and D-003 states the rule, not just the
      list
- [ ] The risk gate has an answer in the notebook: how many stations passed

## Explain back

1. What is the difference between 401 and 429, and why does correct code treat
   them completely differently?
2. Why does the radius limit force a decision, and what did you choose?
3. If a station has data from 2018 but nothing since 2023, why is it dangerous
   to include it?

## Traps

- Hard-coding the key "just to test". It ends up in a commit.
- Trusting the first 100 results. This is the most common API bug there is.
- Choosing stations by name or by how central they look, rather than by
  coverage. The rule has to be measurable.

## My notes

_Your answers, plus what the coverage table actually looked like._
