---
id: DAF-24
title: (Later, optional) Widen to more stations
phase: 2 — Get the data
sprint: later
estimate: 3 h
status: todo
depends_on: [DAF-23]
---

# DAF-24 · (Later, optional) Widen to more stations

## Story

As Asha's school, I am not in R K Puram. I want a forecast that reflects Delhi's
air more widely, now that the single-station version works.

## Why this ticket exists

D-005 deliberately parked the station problem so the whole pipeline could be
built first. With a working pipeline, widening is a data change, and every
decision can be judged by the walk-forward evaluation from DAF-16.

## Background

The problem D-005 parked: OpenAQ re-issued the CPCB feed in late 2022. At most
stations there is a retired sensor (long span, ends 2022-10-31) and a live
replacement (short span). D-003's 730-day gate keeps the retired one.

Options, each needing a decision record:

| Option | Idea |
|---|---|
| Coverage inside the window | Replace total span with days of data inside the training window |
| Stitch sensors | Join the retired and live sensor at one location into one series |
| Live sensors only | Keep stations still reporting; accept a shorter history |

Then: one model per station, or one model with a station column, or one model on a
Delhi-wide average.

## Steps

1. Write the replacement for D-003 and D-004 as new decisions.
2. Run the existing collector for the new station list — it already supports it.
3. Build the daily tables with `clean.py`, unchanged.
4. Compare walk-forward results with the single-station model.

## Acceptance criteria

- [ ] New decision records supersede D-003/D-004, with the old ones marked superseded
- [ ] The collector and `clean.py` needed no rewrite, only new inputs
- [ ] Walk-forward results compare wider vs single-station

## My notes

_Did more stations help?_
