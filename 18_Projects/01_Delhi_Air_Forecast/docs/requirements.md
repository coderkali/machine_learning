# Delhi Air Forecast — Requirements

## Who it is for and the decision it supports

This system supports Asha, who runs a primary school in Delhi and must decide each evening whether children should assemble outside the next morning.

The decision is whether the next day's air is safe enough for children to spend time outside.

## What the model predicts

The model predicts tomorrow's PM2.5 concentration in Delhi in micrograms per cubic metre (µg/m³).

Target definition:

- statistic: 24-hour mean PM2.5
- window: 00:00 to 23:59 IST on the next calendar day
- unit: µg/m³
- timezone: India Standard Time (IST)
- missing-hours rule: a day is valid only if at least 18 hourly readings are present; otherwise the day is dropped from the target calculation for that date

The forecast is made at 18:00 IST today, using only data available at that time.

## When the prediction is made, and what data exists at that moment

Prediction time: 18:00 IST today.

At that point:

- current-day readings up to 17:00 are available
- tomorrow's actual weather is not known
- tomorrow's actual air quality is not known
- tomorrow's weather forecast can be used as an input
- today's final daily average is not available as a feature if the daily average is not complete at 18:00

This matters because production must mimic the real decision time. A model that uses data that would not exist at 18:00 is not valid in production.

## Success criteria

The model must beat a named baseline: the persistence baseline.

Persistence baseline:

> Predict that tomorrow's PM2.5 equals today's PM2.5.

Headline metric:

- MAE (mean absolute error), measured in µg/m³

Safety metric:

- recall on "Poor or worse" days, defined as PM2.5 >= 91 µg/m³

Minimum success threshold:

- improve the baseline MAE by at least 10%
- without reducing recall on Poor-or-worse days below the baseline

This is the product requirement, not a vague statement like "the model should be accurate."

## Data sources and what each is used for

### OpenAQ S3 archive
Used for historical PM2.5 sensor readings and training data.

### OpenAQ API v3
Used for station discovery and live readings at prediction time.

### Open-Meteo archive API
Used for historical weather data to train the model.

### Open-Meteo forecast API
Used for tomorrow's weather forecast in live serving.

## Constraints and risks

- data freshness lag: the S3 archive lags by roughly 72 hours
- sensor outages: some stations fail or have missing hours
- rate limits: OpenAQ API limits apply (60 requests/minute, 2000/hour)
- data leakage risk: training a model with future information is invalid
- train/serve gap: training uses actual weather, production uses forecast weather
- festival and crop-burning events are real and may create sudden pollution spikes that weather alone does not explain

## Non-goals

- no hourly forecasting for the first version
- no other cities outside Delhi
- no other pollutants beyond PM2.5 in the first version
- no mobile app or user accounts
- no forecast beyond one day ahead
- no model deployment beyond a single API service in a container

## Glossary

- PM2.5: fine particulate matter smaller than 2.5 micrometres
- NAQI: National Air Quality Index used in India
- persistence baseline: the naive baseline that assumes tomorrow equals today
- Poor or worse: PM2.5 >= 91 µg/m³, the school-safety threshold that matters most
- MAE: mean absolute error, measured in µg/m³
- recall: of all the truly bad days, how many were identified correctly

## Summary

This project is not judged on whether a model is "good" in general. It is judged on whether it can predict tomorrow's Delhi PM2.5 well enough to improve the simple baseline and help Asha make a safer decision for children.
