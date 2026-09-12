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

## Grooming

Sprint 1 tickets are written in full. Later tickets are one line each in the
table below, and get written out properly at the start of their sprint. This is
deliberate: what DAF-08 has to clean depends on what DAF-07 finds in the data,
and writing it now would mean rewriting it later.

## The backlog

**Sprint 1 — Requirements, and getting the data**

| ID | Ticket | Phase | Est. | Status |
|---|---|---|---|---|
| [DAF-01](DAF-01_project_skeleton.md) | Project skeleton and environment | 1 | 2–3 h | `todo` |
| [DAF-02](DAF-02_requirements.md) | Write the requirements and the first decisions | 1 | 2–3 h | `todo` |
| [DAF-03](DAF-03_station_list.md) | OpenAQ key, and Delhi's real station list | 2 | 2–3 h | `todo` |
| [DAF-04](DAF-04_download_sensor_history.md) | Download the sensor history from the S3 archive | 2 | 2–3 h | `todo` |

**Sprint 2 — The rest of the data, and the first look at it**

| ID | Ticket | Phase | Est. | Status |
|---|---|---|---|---|
| DAF-05 | Download the matching weather history | 2 | 2–3 h | `todo` |
| DAF-06 | Combine the raw files, and write the data card | 2 | 2–3 h | `todo` |
| DAF-07 | First look: find what is wrong with this data | 3 | 2–3 h | `todo` |
| DAF-08 | Clean it, one logged decision per fault | 3 | 3 h | `todo` |

**Sprint 3 — Clean code, the modelling table, and the split**

| ID | Ticket | Phase | Est. | Status |
|---|---|---|---|---|
| DAF-09 | Graduate the cleaning into `clean.py`, with tests | 3 | 2–3 h | `todo` |
| DAF-10 | Build the daily table and the target column | 3 | 3 h | `todo` |
| DAF-11 | EDA on the daily table: the story in four charts | 3 | 2 h | `todo` |
| DAF-12 | Split by time, and prove a random split cheats | 4 | 2–3 h | `todo` |

**Sprint 4 — Pre-processing and features**

| ID | Ticket | Phase | Est. | Status |
|---|---|---|---|---|
| DAF-13 | The pre-processing Pipeline and ColumnTransformer | 4 | 2–3 h | `todo` |
| DAF-14 | Lag, rolling and calendar features | 5 | 3 h | `todo` |
| DAF-15 | The feature contract: what is knowable at 6 pm | 5 | 2 h | `todo` |
| DAF-16 | Feature selection, on the training rows only | 5 | 2–3 h | `todo` |

**Sprint 5 — Models**

| ID | Ticket | Phase | Est. | Status |
|---|---|---|---|---|
| DAF-17 | The baselines you have to beat | 6 | 2 h | `todo` |
| DAF-18 | Linear models inside the pipeline | 6 | 2–3 h | `todo` |
| DAF-19 | Tree and ensemble models | 6 | 2–3 h | `todo` |
| DAF-20 | The metric that matches Asha's decision | 7 | 2 h | `todo` |

**Sprint 6 — Tuning, the final score, and the service**

| ID | Ticket | Phase | Est. | Status |
|---|---|---|---|---|
| DAF-21 | TimeSeriesSplit cross-validation and tuning | 7 | 3 h | `todo` |
| DAF-22 | Final test run, error analysis, model card | 7 | 3 h | `todo` |
| DAF-23 | Live feature builder from the two APIs | 8 | 3 h | `todo` |
| DAF-24 | The FastAPI service | 8 | 3 h | `todo` |

**Sprint 7 — Ship it**

| ID | Ticket | Phase | Est. | Status |
|---|---|---|---|---|
| DAF-25 | Tests for the service, with the APIs mocked | 8 | 2–3 h | `todo` |
| DAF-26 | Docker image, and a container that answers | 8 | 3 h | `todo` |
| DAF-27 | README, retrospective, website page, skills update | 8 | 3 h | `todo` |

Total: 27 tickets, roughly 68 hours, about 7 weeks at 3–4 sittings a week.
