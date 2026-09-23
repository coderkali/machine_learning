# Data faults — R K Puram (location 17)

**Ticket:** DAF-08 (found) · DAF-09 (decided) · **Notebooks:** `notebooks/08_look_what_wrong.ipynb`, `notebooks/09_clean.ipynb`

This is a list of what's wrong with the raw data, with evidence for each
item. DAF-08 found the faults and listed options. DAF-09 chose one
treatment per fault; each **Decision (DAF-09)** paragraph gives the choice,
the reason and how many rows it changed. The cleaning code is
`clean_pm25()` in `notebooks/09_clean.ipynb` (moving to
`src/delhi_air/clean.py` in DAF-10).

## Fault 1 — Each hour has one real PM2.5 reading, not four

**What it is.** The raw files hold 4 timestamps per hour (`:00`, `:15`,
`:30`, `:45`), but only the first one in each hour is a fresh sensor value.
The other three are exact repeats of it — OpenAQ is backfilling the 15-min
grid from an hourly-updating sensor, not recording 4 independent
measurements.

**Evidence.** Across all 44,139 raw `pm25` rows, 68.66% are exact duplicates
of the reading immediately before them in the same hour. A single day
(2025-02-19), plotted as a step chart, shows a clean staircase: one new
value per hour, held flat for the next three 15-min slots. See notebook
step 2a.

**Rows affected.** ~30,300 of 44,139 raw rows (the duplicate 3-in-4).

**Possible treatments:**
1. Collapse to one row per hour (keep the first/fresh reading only) before
   any further aggregation — removes the duplication at the source.
2. Leave as-is — since duplicates equal the fresh value exactly, a plain
   mean over the 4 slots is mathematically unaffected. Only relevant if
   something downstream treats "4 readings" as 4 independent samples (e.g.
   a variance or confidence calculation).

**Decision (DAF-09): leave it. Rows changed: 0.** The hourly average of
equal copies is the same number. DAF-09 found that in 1,668 hours (13.7%)
the fresh reading arrives at `:15` instead of `:00`, so the `:00` slot still
holds the previous hour's value and the average mixes in a quarter of the
previous hour. Measured on daily means, the effect is a median of 0 and at
most 2.1 µg/m³, which is small next to the model's ~15 µg/m³ error. The
DAF-05 hourly average is kept.

## Fault 2 — ~11% of hours are missing, in both scattered and clustered patterns

**What it is.** Comparing the full expected hourly range against the hours
that actually have a PM2.5 reading.

**Evidence.** 1,515 of 13,680 possible hours (11.1%) are missing. They form
315 separate gap-blocks: 178 are single isolated hours (noise), but the
largest block runs 241 consecutive hours (~10 days), matching a fully
missing stretch in January 2026. 17 calendar days have zero PM2.5 rows at
all. See notebook step 2c.

**Rows affected.** 1,515 hours; 17 fully missing days.

**Possible treatments:**
1. Interpolate short gaps (e.g. under ~6 hours) and leave long outages as
   genuine missing data — different gap lengths likely need different
   handling.
2. Leave all gaps as missing and let downstream steps (train/test split,
   model) handle absence explicitly, without inventing values for real
   outages.

**Decision (DAF-09): fill holes of 1–2 hours with a straight line; leave
longer holes empty. Rows changed: 240 hours filled.** A 1–2 hour hole
between two real readings is a fair guess; a longer one would be made-up
air. The limit of 2 hours is a hand-picked guess, not a measured number.
Only holes with a real reading on **both** sides are filled. The fill runs
**after** the broken week (Fault 7) is removed, so no guess is made from a
bad reading. For `pm25_until_17` only, the 18 fills that needed a reading
from 18:00 or later are not used, because Asha doesn't have that reading at
18:00. Effect: 7 invalid days became valid.

## Fault 3 — Invalid days (DAF-05 flag) cluster in specific months, not evenly spread

**What it is.** `daily_17.csv` already flags 83 of 571 days (14.5%) as
`valid = False`. This step only checks whether those days are spread evenly
or clumped.

**Evidence.** Invalid days concentrate in April 2025 (12), August 2026 (11),
and January 2026 (10) — together over a third of all invalid days, while
several months have 1–3. 36 of 82 gaps between consecutive invalid days are
exactly 1 day apart (back-to-back), meaning ~44% of invalid days sit next to
another invalid day rather than standing alone. The January 2026 cluster
lines up with the 10-day missing-hour outage from Fault 2. See notebook
step 2d.

**Rows affected.** 83 of 571 days.

**Possible treatments:**
1. Treat clustered invalid stretches (like January 2026) as one outage
   event rather than 83 independent bad days — may change how a
   train/test split should route around them.
2. Leave the existing DAF-05 `valid` flag and logic untouched; this ticket
   only observes the pattern, doesn't change the flag's definition.

**Decision (DAF-09): leave it. Rows changed: 0.** Most of this fault is
Fault 2 seen at the day level. Filling short holes helped a little
(83 → 76 invalid days before Fault 7), and the big clusters (January 2026,
April 2025) are long outages we chose not to fill. The 18-hour rule
(D-002) is unchanged.

## Fault 4 — Three weather parameters only exist for the last ~11 months of the span

**What it is.** The raw files carry 12 parameters per station, one row per
`(timestamp, parameter)` pair. Most start on day one of the span
(2025-02-19), but `wind_speed`, `wind_direction`, and `nox` first appear on
2025-10-08 — about 8 months later.

**Evidence.** `wind_speed`/`wind_direction`/`nox` each show `coverage_pct`
around 47–48% against the *whole* span, while parameters present since day
one (`pm10`, `no2`, `no`, `co`, `o3`, `so2`, `temperature`,
`relativehumidity`) run 74–83%. The low percentage for the three late
starters reflects "didn't exist yet," not "gappy." See notebook step 2e.

**Rows affected.** All rows for `wind_speed`, `wind_direction`, `nox`
(~25,600–26,300 rows each) — none of them cover the first ~8 months.

**Possible treatments:**
1. Use wind speed/direction only as a feature for the period it's
   available, accepting a shorter usable window or a missing-flag feature
   for the earlier period.
2. Don't use these parameters at all, keeping training data length
   consistent across the whole span.

**Decision (DAF-09): leave it. Rows changed: 0.** The model uses PM2.5
only, so there is nothing to clean yet. Revisit when weather features are
added (DAF-12 to DAF-14).

## Fault 7 — The sensor misbehaved for one week, 4–11 July 2025

**What it is.** Found in DAF-09, not DAF-08: it surfaced when the model got
slightly worse after cleaning. Readings jump in ways real air does not, for
example `1 → 432 → 17` within three hours on 9 July, and `729, 951` on
11 July in monsoon season. Diwali, by contrast, rises and falls smoothly
over several hours.

**Evidence.** Each hour is compared with the median of the 7 hours around
it. An hour is flagged when it is more than 4× that local median and above
200 µg/m³. Across the whole span 12 hours are flagged, and **11 of them fall
between 4 and 11 July 2025**. The single exception is 266 µg/m³ on 6 June
2025, which stands alone. Diwali is not flagged. See notebook step 3.7.

**Rows affected.** 144 hourly readings over 8 days.

**Possible treatments:**
1. Mark the whole week invalid (a fixed date range).
2. Blank only the flagged spike hours and clean the rest as usual.
3. Leave it, and note it for later.

**Decision (DAF-09): mark the whole week invalid. Rows changed: 144 hours
removed, 8 days.** If the sensor was wrong at 10:00, its 1.0 at 05:00 can't
be trusted either, so single-hour repair is not safe. The spike rule is only
used to **find** the week. The cleaning uses the fixed dates
`2025-07-04` to `2025-07-11`, like an incident window. Effect: 4 fake Poor
days disappear (4, 5, 8, 11 July), and train loses 11 days in total
(`mean_7` looks back into the removed week). All 8 days are before the cut
date, so no test day is affected.

## Not a fault — the biggest value is plausible

**What was checked.** The single largest hourly PM2.5 reading in the whole
span: 1,753 µg/m³ at 2025-10-21 03:00.

**Evidence.** Plotting the week around it shows a gradual multi-hour rise
and fall (1,267 → 1,753 → 1,656 → 1,602 → ... µg/m³ across several
consecutive hours), not an isolated single-point spike. The date lines up
with Diwali 2025 (Oct 20–21), a known firecracker-smoke event in Delhi. See
notebook step 2b.

**Conclusion.** No treatment needed — this is a real pollution event, not a
sensor error. Recorded here so it isn't mistaken for one later.

**Decision (DAF-09): leave it. Rows changed: 0.** Guarded by an `assert`
in the notebook: after cleaning, the peak is still 1,753 µg/m³ at
2025-10-21 03:00. Filling two missing hours next to it (01:00, 02:00)
raised Diwali morning's `pm25_until_17` from 668 to 773: cleaning restored
the peak rather than hiding it.

## Not a fault — no PM2.5 sensor swap

**What was checked.** Whether `sensors_id` changes partway through the span
for any parameter (a physical sensor replacement could shift calibration
without any missing-data or spike signal).

**Evidence.** `pm25_raw["sensors_id"].unique()` returns exactly one value
(`12234787`) across the full 569-day span. The same check across all 12
parameters shows exactly one `sensors_id` per parameter, no mixing. See
notebook step 2f.

**Conclusion.** No treatment needed.

**Decision (DAF-09): leave it. Rows changed: 0.**

## Other parameters this station records, with coverage

| parameter | rows | first seen | coverage % (of full span) |
|---|---|---|---|
| relativehumidity | 45,153 | 2025-02-19 | 82.5 |
| temperature | 45,153 | 2025-02-19 | 82.5 |
| pm25 | 44,139 | 2025-02-19 | 80.7 |
| no2 | 43,606 | 2025-02-19 | 79.7 |
| no | 43,141 | 2025-02-19 | 78.8 |
| pm10 | 42,980 | 2025-02-19 | 78.6 |
| co | 42,708 | 2025-02-19 | 78.1 |
| o3 | 42,415 | 2025-02-19 | 77.5 |
| so2 | 40,743 | 2025-02-19 | 74.5 |
| wind_speed | 26,307 | 2025-10-08 | 48.1 |
| wind_direction | 25,879 | 2025-10-08 | 47.3 |
| nox | 25,592 | 2025-10-08 | 46.8 |
