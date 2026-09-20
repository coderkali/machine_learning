# D-005 · Build version one on a single station — R K Puram (location 17)

- **Date:** 2026-09-18
- **Ticket:** DAF-04
- **Status:** accepted

## Context

D-003 (730+ days of span) and D-004 (latest four years) together selected 44
stations, but at 37 of them they kept a CPCB sensor that stopped reporting on
2022-10-31 and rejected its live replacement. The cached daily table built from
that list covers 5.2% of the possible station-days, and two sensors carry 64% of
it. Fixing the station list properly is real work, and every hour spent on it is
an hour not spent learning how a forecast is actually built, evaluated and
served.

Meanwhile one station is already downloaded and verified from the raw S3
archive: R K Puram (location 17, PM2.5 sensor 12234787), 554 daily files,
2025-02-19 → 2026-09-11.

## Options considered

| Option | For | Against |
|---|---|---|
| A — fix the station list first (stitch old + new sensors, or measure coverage inside the window), then download all stations | The "complete" dataset; closest to the original plan | Weeks of data work before the first model; the fix is unproven until a model shows it matters |
| B — one station end to end, then widen | First MAE in about three sittings; every later data decision is judged by a real model error | 488 usable days and a single winter; the result describes R K Puram, not all of Delhi |
| C — a handful of live stations | More rows than B | Most of the cost of A, with little of B's speed |

## Decision

We choose **Option B**. Version one is built on R K Puram alone, from raw data
to a running service. Widening to more stations is a later, optional ticket.

## Why

The project exists to learn the whole path — data, split, features, model,
evaluation, service — and a thin slice teaches all of it. A real error number
from the first model also tells us which data problems are worth fixing, instead
of guessing before any model exists.

R K Puram is chosen because it is already on disk, verified, still reporting, and
uses the live re-issued sensor, so it has none of the problems D-005 was opened to
solve. This was partly chosen because it is faster to build, and that is a
deliberate trade.

## Consequences

- "Delhi's PM2.5" in `requirements.md` now means R K Puram's PM2.5 for version one.
- The data has one winter (Oct 2025 – Feb 2026), which makes the split and the
  evaluation harder. DAF-06 and DAF-16 deal with that directly.
- D-003 and D-004 are not wrong; they are parked until the widening ticket.
- We revisit this if one station cannot beat the persistence baseline, or when
  the service works end to end and there is time to widen.
