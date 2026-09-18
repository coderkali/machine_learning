# The board

One ticket is one sitting: 2–3 hours. Four tickets is one week at your pace
(3–4 days a week). Seven sprints is the whole project.

## How a ticket runs

```text
You open the ticket   →   read Story, Background, Steps
        ↓
You set status: doing   →   you write the code
        ↓
Stuck?  ask me  →  hint  →  direction  →  partial example   (never the answer first)
        ↓
You set status: review  →  "verify DAF-07"
        ↓
I check every acceptance criterion by running it, not by reading it
        ↓
Pass → I set status: done, and the next ticket opens
Fail → I say which criterion failed and why. Same ticket, no new ticket.
```

**The explain-back matters as much as the code.** Each ticket ends with two or
three questions. Answer them in your own words in the ticket's *My notes*
section. A ticket is not done while the code works but the answer is missing —
that gap is exactly the confusion this project exists to remove.

## Status values

| Status | Meaning |
|---|---|
| `todo` | Not started |
| `doing` | You are working on it |
| `review` | You are finished and want it verified |
| `done` | Verified against every acceptance criterion |
| `blocked` | Waiting on something outside the ticket |

Set it in the ticket's front matter at the top of the file.

## The plan, after D-005

On 2026-09-18 the project changed shape
([D-005](../decisions/D-005-one-station-first.md)): version one is built on
**one station, R K Puram (location 17)**, from raw data to a running service.
Every ticket is now written in full.

Sprint 2 is a **walking skeleton**: the shortest path to a real error number.
After DAF-07 there is a model and a score, and every later ticket is an
experiment — change one thing, re-score, add a row to `reports/experiments.csv`.

```text
 DAF-05 table ─► DAF-06 split + baselines ─► DAF-07 first model   ← first MAE
      │
      └─► 08 find faults ─► 09 clean ─► 10 clean.py ─► 11 EDA
                                                   └─► 12 weather
      ─► 13 feature contract ─► 14 features ─► 15 trees ─► 16 Asha's metric
      ─► 17 tuning ─► 18 final test + model card               ← the answer
      ─► 19 live features ─► 20 FastAPI ─► 21 tests ─► 22 Docker ─► 23 write-up
```

## The backlog

**Sprint 1 — Requirements, and getting the data**

| ID | Ticket | Phase | Est. | Status |
|---|---|---|---|---|
| [DAF-01](DAF-01_project_skeleton.md) | Project skeleton and environment | 1 | 2–3 h | `done` |
| [DAF-02](DAF-02_requirements.md) | Write the requirements and the first decisions | 1 | 2–3 h | `review` |
| [DAF-03](DAF-03_station_list.md) | OpenAQ key, and Delhi's real station list | 2 | 2–3 h | `todo` |
| [DAF-04](DAF-04_download_sensor_history.md) | Download the sensor history (station 17, per D-005) | 2 | 2–3 h | `todo` |

**Sprint 2 — The walking skeleton: first model, first MAE**

| ID | Ticket | Phase | Est. | Status |
|---|---|---|---|---|
| [DAF-05](DAF-05_daily_table_and_target.md) | The daily table and the target column | 3 | 2–3 h | `todo` |
| [DAF-06](DAF-06_time_split_and_baselines.md) | Split by time, and score the baselines | 4 | 2–3 h | `todo` |
| [DAF-07](DAF-07_first_trained_model.md) | The first trained model — Ridge in a Pipeline | 6 | 2–3 h | `todo` |
| [DAF-08](DAF-08_first_look_whats_wrong.md) | First look — find what is wrong with the raw data | 3 | 2–3 h | `todo` |

**Sprint 3 — Clean data, tested code, weather**

| ID | Ticket | Phase | Est. | Status |
|---|---|---|---|---|
| [DAF-09](DAF-09_clean_one_decision_per_fault.md) | Clean it, one logged decision per fault | 3 | 3 h | `todo` |
| [DAF-10](DAF-10_clean_py_with_tests.md) | Graduate the table build into `clean.py`, with tests | 3 | 2–3 h | `todo` |
| [DAF-11](DAF-11_eda_four_charts.md) | EDA — the story in four charts | 3 | 2 h | `todo` |
| [DAF-12](DAF-12_weather_history.md) | Download the weather history | 2 | 2–3 h | `todo` |

**Sprint 4 — Features, models, and Asha's metric**

| ID | Ticket | Phase | Est. | Status |
|---|---|---|---|---|
| [DAF-13](DAF-13_feature_contract_and_weather.md) | The feature contract, and weather features | 5 | 2–3 h | `todo` |
| [DAF-14](DAF-14_lag_rolling_calendar_features.md) | Lag, rolling and calendar features | 5 | 3 h | `todo` |
| [DAF-15](DAF-15_tree_and_ensemble_models.md) | Tree and ensemble models | 6 | 2–3 h | `todo` |
| [DAF-16](DAF-16_asha_metric_walk_forward.md) | Asha's metric, and walk-forward evaluation | 7 | 3 h | `todo` |

**Sprint 5 — The answer, and the first half of the service**

| ID | Ticket | Phase | Est. | Status |
|---|---|---|---|---|
| [DAF-17](DAF-17_timeseriessplit_tuning.md) | TimeSeriesSplit cross-validation and tuning | 7 | 2–3 h | `todo` |
| [DAF-18](DAF-18_final_test_and_model_card.md) | Final test run, error analysis, model card | 7 | 3 h | `todo` |
| [DAF-19](DAF-19_live_feature_builder.md) | Live feature builder from the two APIs | 8 | 3 h | `todo` |
| [DAF-20](DAF-20_fastapi_service.md) | The FastAPI service | 8 | 3 h | `todo` |

**Sprint 6 — Ship it**

| ID | Ticket | Phase | Est. | Status |
|---|---|---|---|---|
| [DAF-21](DAF-21_service_tests_mocked.md) | Tests for the service, with the APIs mocked | 8 | 2–3 h | `todo` |
| [DAF-22](DAF-22_docker_image.md) | Docker image, and a container that answers | 8 | 3 h | `todo` |
| [DAF-23](DAF-23_readme_retro_website_skills.md) | README, retrospective, website, skills update | 8 | 3 h | `todo` |

**Later, optional**

| ID | Ticket | Phase | Est. | Status |
|---|---|---|---|---|
| [DAF-24](DAF-24_widen_to_more_stations.md) | Widen to more stations | 2 | 3 h | `todo` |

From here: 19 tickets to the finished service (DAF-05 → DAF-23), roughly 50
hours — about five weeks at 3–4 sittings a week. The first MAE arrives after
three of them.
