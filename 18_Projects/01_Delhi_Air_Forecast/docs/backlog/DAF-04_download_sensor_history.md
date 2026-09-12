---
id: DAF-04
title: Download the sensor history from the S3 archive
phase: 2 — Get the data
sprint: 1
estimate: 2-3 h
status: todo
depends_on: [DAF-03]
---

# DAF-04 · Download the sensor history from the S3 archive

## Story

As the developer, I want years of raw readings for the chosen stations on my
disk, downloaded by a script that I can run again safely, so that the dataset
is reproducible instead of being something I once assembled by hand.

## Why this ticket exists

This is the first piece of code that **graduates out of a notebook on day one**.
Everything else this sprint can live in a notebook, but the collector cannot:
you will run it again when you extend the date range, and Phase 8 reuses its
logic to fetch live data.

The rule it teaches is the one that separates a data project that survives from
one that does not: **the raw zone is immutable**. Whatever the source sent, you
keep exactly that, unedited, forever. Every fix happens downstream. When a
result looks wrong three weeks from now, raw is the only thing you can trust to
re-derive from.

## Background

Verified on 2026-09-11 by listing the bucket without credentials:

- Bucket: `s3://openaq-data-archive`, **public, no key and no AWS account
  needed** (`--no-sign-request`, or plain HTTPS).
- Layout:
  `records/csv.gz/locationid={id}/year={yyyy}/month={mm}/location-{id}-{yyyymmdd}.csv.gz`
- One gzipped CSV per station per day, in narrow format: one row per
  measurement, with `location_id`, `sensors_id`, `datetime`, `latitude`,
  `longitude`, `parameter`, `units`, `value`.
- Files appear **72 hours after the day ends**, so the archive is never fully
  current. That gap is why Phase 8 uses the API for live readings instead.
- Days a station did not report simply have no file. A missing key is normal,
  not an error.

Two ways to fetch, both fine:

| | |
|---|---|
| `requests` per day-key | More code, but you see every 404 and you control retries. Recommended: it is your own code, and it teaches the failure cases |
| `aws s3 sync --no-sign-request` | One line, fast and resumable. Good fallback if the Python version is too slow |

## Steps

1. Write `src/delhi_air/collect_openaq.py` with a function that takes a station
   id and a date range and downloads into
   `data/raw/openaq/locationid={id}/year=…/month=…/`, keeping the original
   filenames.
2. Read the station list from `data/raw/stations.csv`. Do not hard-code ids.
3. Make it **idempotent**: a file already on disk is skipped, not re-fetched.
4. Treat a missing day as missing. Count it, do not crash on it.
5. Give it a command-line interface (`argparse`) with the date range and an
   optional station filter.
6. Print a summary at the end: stations, date range, files downloaded, files
   skipped, days missing, total size, elapsed time.
7. Try one station for one month first. Only then run the full range.
8. Commit. The data does not go in the commit; the script does.

## Acceptance criteria

- [ ] `python -m delhi_air.collect_openaq --help` prints usage
- [ ] A second run downloads nothing and reports everything as skipped
- [ ] Missing days are counted and reported, and do not stop the run
- [ ] Files land under `data/raw/openaq/…` with their original names and
      contents, unedited and uncompressed nowhere else
- [ ] The station list comes from `stations.csv`
- [ ] The end-of-run summary prints all six numbers listed in step 6
- [ ] `git status` shows the script, and shows no data files
- [ ] You can state the total size on disk and the number of station-days

## Explain back

1. What does *idempotent* mean here, and what would go wrong on a re-run if it
   were not?
2. Why is raw data never edited in place, even when you can see it is wrong?
3. The archive lags 72 hours behind. Which later ticket does that break, and
   what will you do about it there?

## Traps

- "Cleaning while downloading" — dropping bad rows in the collector. Do not.
  That is DAF-08's job, and doing it here hides the fault permanently.
- Downloading five years for twenty stations on the first run, then discovering
  a bug 40 minutes in. One station, one month, first.
- Hammering S3 with no pause. Be polite; it costs you nothing to sleep briefly
  between requests.

## My notes

_Your answers, the final size on disk, and anything the data already looks odd
about (note it, do not fix it — DAF-07 is where that goes)._
