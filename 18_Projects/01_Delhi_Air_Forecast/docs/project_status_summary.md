# Delhi Air Forecast — Current Status Summary

## 1) Goal we are trying to solve

We are building a forecasting system for Delhi PM2.5 so that Asha can decide each evening whether it is safe for children to spend time outside tomorrow.

The project goal is simple:

- predict tomorrow's PM2.5 24-hour mean
- beat a simple baseline
- keep the decision safe for the school scenario

---

## 2) What we have completed so far

### A. Project setup and requirements

We set up the project properly:

- created the project structure
- created Python environment
- installed the package in editable mode
- created requirement and project config
- kept the real API key in `.env` and not in the repository

This means the project is ready to work as a real ML/data project, not just a notebook experiment.

### B. Business requirement is clear

We wrote the requirement document, which states:

- target = tomorrow's PM2.5 24-hour mean in µg/m³
- prediction time = 18:00 IST
- baseline = today's PM2.5 as tomorrow's prediction
- success = improve MAE by at least 10% without hurting recall on Poor-or-worse days

This gives us a real product question instead of a vague "predict air quality" goal.

### C. Key decisions were written down

We recorded the decisions that matter most:

- D-001: predict the number, then apply the decision table
- D-002: target is tomorrow's 24-hour mean (00:00–23:59 IST)
- D-003: keep stations with at least 730 days of actual coverage
- D-004: use the most recent four-year training window

These are important because they define the exact output the model must produce.

---

## 3) What data we pulled and filtered

### Data source

We used the OpenAQ data source to discover stations and PM2.5 readings in Delhi.

### What we did

1. loaded the OpenAQ API key from `.env`
2. searched the Delhi area for locations
3. handled paging so we did not miss hidden results beyond the first 100 rows
4. fetched sensors for each location
5. kept only the PM2.5 sensor at each station
6. extracted each station's first and last reading date
7. saved the station list into `data/raw/stations.csv`
8. filtered stations using actual elapsed coverage
9. selected the latest four-year window dynamically
10. fetched and cached daily PM2.5 readings for the selected sensors

### Final station dataset

The saved station table includes:

- `location_id`
- `sensor_id`
- `name`
- `latitude`
- `longitude`
- `provider`
- `first_reading`
- `last_reading`

This is the raw station inventory we will use for the next phase.

---

## 4) What we filtered out

This is the important part: we did not keep everything.

We filtered to the parts that matter for a valid training dataset:

- only PM2.5 stations
- only stations with usable sensor history
- only stations with enough historical coverage
- removed obviously weak or short-lived station records

### Coverage logic we verified

At first, we used a rough idea of "year overlap" to decide station suitability.
That was too naive.

We then corrected it to use real elapsed time:

- coverage_days = (last_reading - first_reading).days
- valid station rule = coverage_days >= 730

This is much more honest, because it measures actual time span rather than calendar years.

The corrected check showed:

- 50 unique stations passed the real coverage rule
- 44 of those stations remained in the latest four-year window
- 44 sensors produced 3,342 cached daily PM2.5 rows
- the project is not blocked by missing station history

The 50-to-44 reduction is expected: 50 stations pass the minimum quality gate,
then the recent-window rule keeps only stations whose readings are relevant to
the selected training period.

### Daily measurement validation

The cleanup notebook built one row per location and date from the cached API
measurements. The validation check found:

- date range: `2022-09-16` to `2026-09-16`
- no null values in `sensor_id`, `date`, or `pm25_value`
- no duplicate sensor/date pairs
- no negative PM2.5 readings
- one sensor per selected location in the current dataset

The current table is suitable for the next data-engineering step, but it is
still an API cache in one CSV. It is not yet the immutable raw archive required
for the project.

---

## 5) Visual flow: what the work looks like

```mermaid
flowchart LR
    A[Project setup] --> B[Define business requirement]
    B --> C[Write D-001 and D-002 decisions]
    C --> D[OpenAQ key + station discovery]
    D --> E[Fetch Delhi locations]
    E --> F[Handle paging]
    F --> G[Get sensors]
    G --> H[Keep PM2.5 only]
    H --> I[Measure station coverage]
    I --> J[Save raw station list]
    J --> K[Apply D-003 quality gate]
    K --> L[Apply D-004 recent window]
    L --> M[Build cached daily PM2.5 table]
```

---

## 6) Current state in plain English

So far, we have:

- set up the project cleanly
- agreed on the exact prediction target
- created the requirement doc
- decided the business-facing target definition
- connected to OpenAQ
- discovered Delhi stations
- selected PM2.5 stations only
- checked real historical coverage
- saved the station inventory for future model work
- selected the latest four-year training window
- built and validated the first daily PM2.5 table

In short: we have the data source, a measured station-quality rule, a recent
training window, and a validated first daily PM2.5 table. We are no longer
guessing about what data exists or which stations pass the first quality gate.

---

## 7) What comes next: DAF-04

The next step is not model training yet. The next step is to graduate data
collection from the notebook into a repeatable collector, as described in
`docs/backlog/DAF-04_download_sensor_history.md`.

The collector must:

- read station IDs from `data/raw/stations.csv`
- download the original OpenAQ S3 archive files into `data/raw/openaq/`
- skip files already present so a second run is idempotent
- count missing station-days without failing
- print a final summary of downloaded, skipped, missing, and stored data

The first trial should download one station for one month. Only after that
works should the full recent history be collected. The API-derived CSV remains
useful for this notebook's exploration, but it should not replace the raw S3
archive.

---

## 8) Short takeaway

We are past setup and station discovery, and the first station-level data slice
has been validated.

We now have the key pieces:

- the business requirement
- the target definition
- the OpenAQ data connection
- the cleaned station list
- the real coverage check
- the accepted station-selection and date-range decisions
- the first validated daily PM2.5 table

The project is ready to build the reproducible raw data archive before moving
to weather data, data-quality exploration, and modelling.
