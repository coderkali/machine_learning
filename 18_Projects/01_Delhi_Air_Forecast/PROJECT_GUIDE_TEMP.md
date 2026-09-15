# Delhi Air Forecast - Temporary Project Guide

This is a temporary reference file. It summarizes what the project must do and the order in which to do it.

## 1. The project in simple language

Asha runs a school in Delhi. Every evening she must decide whether children can hold the next morning's assembly outside.

The project must build a system that:

- predicts tomorrow's Delhi PM2.5 level;
- tells whether the air is safe or unsafe for children;
- beats the simple rule "tomorrow will be like today";
- serves the prediction through a REST API;
- runs inside a Docker container.

This is an end-to-end machine-learning project, not only a notebook.

## 2. Exact prediction requirement

Version-one recommendation:

- predict a number: tomorrow's complete 24-hour PM2.5 average;
- use India Standard Time (IST), from 00:00 to 23:59;
- report the value in micrograms per cubic metre (ug/m3);
- convert the number into a safety category when needed;
- make the forecast at 18:00 IST today;
- use only information that exists by 18:00 today.

At 18:00, today's final daily average is not available. Training must not use information that would be unavailable in production.

The morning-only 07:00-10:00 forecast is a possible version-two improvement.

## 3. Air-quality decision rule

| PM2.5 | Category | School action |
|---|---|---|
| 0-30 | Good | Assembly outside |
| 31-60 | Satisfactory | Assembly outside |
| 61-90 | Moderately polluted | Outside, but no running |
| 91-120 | Poor | Indoors |
| 121-250 | Very Poor | Indoors |
| 250+ | Severe | Indoors and inform parents |

The important safety boundary is 91 ug/m3: Poor or worse.

## 4. How success is measured

Main metric:

- MAE: average absolute difference between predicted and actual PM2.5.

Safety metric:

- recall on Poor-or-worse days, where actual PM2.5 is at least 91 ug/m3.

Recommended success criterion:

- improve the persistence baseline's MAE by at least 10%; and
- do not have lower Poor-or-worse recall than the persistence baseline.

The persistence baseline is: predict that tomorrow's PM2.5 will equal today's PM2.5.

## 5. Important data sources

- OpenAQ S3 archive: historical sensor data for training. No key.
- OpenAQ API v3: station discovery and live sensor readings. Free API key.
- Open-Meteo archive API: historical weather. No key.
- Open-Meteo forecast API: tomorrow's weather at prediction time. No key.

Raw data must remain unchanged. Cleaning happens later in a separate step.

## 6. Work order: 27 tickets

### Phase 1 - Requirements and setup

1. DAF-01: create the project skeleton, Python environment, dependencies, package, and ignore rules.
2. DAF-02: write formal requirements and decisions D-001 and D-002.

### Phase 2 - Get the data

3. DAF-03: obtain the OpenAQ key and discover Delhi PM2.5 stations.
4. DAF-04: download raw OpenAQ sensor history safely.
5. DAF-05: download matching Open-Meteo weather history.
6. DAF-06: combine raw files and write the data card.

### Phase 3 - Understand and clean the data

7. DAF-07: inspect the data and identify its real problems.
8. DAF-08: clean the data and record each cleaning decision.
9. DAF-09: move cleaning into src/delhi_air/clean.py and add tests.
10. DAF-10: build one daily modelling row per prediction day and its target.
11. DAF-11: create four useful exploratory charts.

### Phase 4 - Split and preprocess

12. DAF-12: split data by time and prove a random split leaks future information.
13. DAF-13: build a scikit-learn Pipeline and ColumnTransformer.

### Phase 5 - Features

14. DAF-14: create lag, rolling, calendar, and weather features.
15. DAF-15: define exactly what is knowable at 18:00 IST.
16. DAF-16: select features using training rows only.

### Phase 6 - Models

17. DAF-17: build the persistence and other baseline models.
18. DAF-18: train linear models inside the pipeline.
19. DAF-19: train and compare tree and ensemble models.

### Phase 7 - Evaluation and tuning

20. DAF-20: evaluate MAE, recall, precision, and the confusion matrix.
21. DAF-21: tune using time-aware cross-validation.
22. DAF-22: run the final test, analyze errors, and write the model card.

### Phase 8 - Service and delivery

23. DAF-23: build live features from OpenAQ and Open-Meteo.
24. DAF-24: create the FastAPI REST service.
25. DAF-25: test the service with mocked APIs.
26. DAF-26: build and run the Docker container.
27. DAF-27: finish the README, retrospective, website page, and skills update.

## 7. How each ticket is completed

For every ticket:

1. Change the ticket status from todo to doing.
2. Read its Story, Background, Steps, and Acceptance criteria.
3. Write the code or documentation yourself.
4. Answer the Explain back questions in the ticket's My notes section.
5. Change status to review.
6. Ask for verification using the ticket ID, for example: verify DAF-01.
7. Verification must run commands or tests against every acceptance criterion.
8. If everything passes, the ticket becomes done.
9. If anything fails, stay on the same ticket and fix it.

One ticket is intended to take approximately 2-3 hours.

## 8. DAF-01 exact requirements

Create this folder tree inside this project:

```text
data/raw
data/interim
data/processed
notebooks
src/delhi_air
tests
models
app
```

Then:

1. Create or switch to branch project/daf-phase-1.
2. Create a Python virtual environment in .venv.
3. Activate it and confirm which python points inside .venv.
4. Create requirements.txt by hand with pinned == versions.
5. Include only the required early dependencies: pandas, numpy, requests, python-dotenv, pyarrow, matplotlib, seaborn, scikit-learn, jupyter, pytest.
6. Create pyproject.toml for the src package.
7. Run pip install -e . so delhi_air is importable.
8. Create a project .gitignore for .venv, .env, data, models, caches, checkpoints, and egg-info.
9. Create .env.example containing OPENAQ_API_KEY= and no real key.
10. Document Python version and setup commands in the project README.
11. Answer the three DAF-01 Explain back questions in My notes.
12. Commit the ticket.

DAF-01 is complete only when its acceptance criteria have been verified.

## 9. Immediate next action

Do not start DAF-02 yet. Finish DAF-01 first.

The first command to run from this project folder is:

```bash
git checkout -b project/daf-phase-1
```

After that command succeeds, report back what you see. Then continue with the next small step.

## 10. Current state when this file was created

- The project contains the README and docs planning files.
- The runtime folders such as data, src, tests, models, app, and notebooks do not yet exist.
- DAF-01 through DAF-04 are written in the backlog and currently marked todo.
- The formal docs/requirements.md file does not yet exist.
- No decision records D-001 or D-002 exist yet.

## 11. Temporary-file note

This file is only a reference copy. The official instructions remain in:

- README.md
- docs/backlog/README.md
- docs/backlog/DAF-01_project_skeleton.md through DAF-04_download_sensor_history.md
- docs/phases/01_requirements.md
- docs/phases/02_data_collection.md

It can be deleted later when the project setup is complete.
