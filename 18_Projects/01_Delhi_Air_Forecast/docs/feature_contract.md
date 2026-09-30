# DAF-13 Feature Contract

This contract defines the features allowed for the Delhi PM2.5 forecast made at 18:00 IST.

| Feature | Source | Covers | Knowable at 18:00 today? | Live source (Phase 8) |
|---|---|---|---|---|
| pm25_until_17 | data/interim/daily_17.csv | today 00:00-17:00 IST | yes | OpenAQ API |
| lag_1 | data/interim/daily_17.csv | yesterday's complete day | yes | OpenAQ API |
| mean_3 | data/interim/daily_17.csv | the previous 3 complete days | yes | OpenAQ API |
| mean_7 | data/interim/daily_17.csv | the previous 7 complete days | yes | OpenAQ API |
| month | prediction date | today's calendar month | yes | system clock |
| lag_2 | data/interim/daily_17.csv | two complete days ago | yes | OpenAQ API |
| lag_7 | data/interim/daily_17.csv | seven complete days ago | yes | OpenAQ API |
| mean_14 | data/interim/daily_17.csv | previous 14 complete days | yes | OpenAQ API |
| std_7 | data/interim/daily_17.csv | previous 7 complete days' spread | yes | OpenAQ API |
| max_7 | data/interim/daily_17.csv | previous 7 complete days' maximum | yes | OpenAQ API |
| pm25_change | data/interim/daily_17.csv | today 00:00-17:00 minus yesterday's mean | yes | OpenAQ API |
| month_sin | prediction date | cyclic month position | yes | system clock |
| month_cos | prediction date | cyclic month position | yes | system clock |
| day_of_week | prediction date | calendar weekday | yes | system clock |
| day_of_year_sin | prediction date | cyclic day-of-year position | yes | system clock |
| day_of_year_cos | prediction date | cyclic day-of-year position | yes | system clock |
| festival_flag | reference/festival_dates.csv | named festival date, from public holiday calendars | yes | reference/festival_dates.csv (needs 2026-27 dates added before live use) |
| crop_burning_season_flag | known calendar | October-November calendar window | yes | calendar rule |
| wind_tomorrow_mean | Open-Meteo historical forecast | tomorrow 00:00-23:59 IST | forecast only | Open-Meteo forecast API |
| humidity_tomorrow_max | Open-Meteo historical forecast | tomorrow 00:00-23:59 IST | forecast only | Open-Meteo forecast API |
| rain_tomorrow_total | Open-Meteo historical forecast | tomorrow 00:00-23:59 IST | forecast only | Open-Meteo forecast API |

## Timing rules

- A feature must be knowable at 18:00 today, or explicitly marked as forecast-only.
- Rolling PM2.5 features end yesterday; they must not include today's unfinished full-day value.
- Tomorrow's weather features use a forecast, not tomorrow's realised weather.
- Raw archive and forecast JSON files remain unchanged; this contract describes allowed derived features.

Generated from DAF-07's five model features plus DAF-13's three weather aggregates.


## DAF-14 additions

These feature families are built by `src/delhi_air/clean.py` and tested in `tests/test_clean.py`.

| Family | Features | Timing rule |
|---|---|---|
| Lags | `lag_1`, `lag_2`, `lag_7` | completed days only |
| Rolling | `mean_3`, `mean_7`, `mean_14`, `std_7`, `max_7` | completed days only; ends yesterday |
| Change | `pm25_change` | today 00:00-17:00 minus yesterday's complete-day mean |
| Calendar | `month_sin`, `month_cos`, `day_of_week`, `day_of_year_sin`, `day_of_year_cos` | known from the prediction date |
| Events | `festival_flag`, `crop_burning_season_flag` | known calendar rules only |

## DAF-14 final feature set

Chosen by `SelectKBest(f_regression)` inside the Ridge pipeline, with `k = 4` picked by 5-fold `TimeSeriesSplit` on the training rows only. The test rows were scored once, after the choice.

| Kept (4) | Why it is safe at 18:00 |
|---|---|
| `pm25_until_17` | today 00:00-17:00 only |
| `mean_3` | previous 3 complete days |
| `mean_7` | previous 7 complete days |
| `mean_14` | previous 14 complete days |

Dropped by selection: `lag_1`, `lag_2`, `lag_7`, `std_7`, `max_7`, `pm25_change`, `month`, `month_sin`, `month_cos`, `day_of_week`, `day_of_year_sin`, `day_of_year_cos`, `festival_flag`, `crop_burning_season_flag`.

Result on the same 130 test rows: MAE 15.588, Poor recall 0.706 (12 of 17 Poor days). Logged as `daf14_selected` in `reports/experiments.csv`.

The dropped features stay defined in `clean.py` and stay in this contract as allowed, so a later ticket can retest them with more data.
