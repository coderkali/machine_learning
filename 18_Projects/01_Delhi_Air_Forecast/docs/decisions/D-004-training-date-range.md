# D-004 · Use the most recent 3–4 years as the training window

- **Date:** 2026-09-16
- **Ticket:** DAF-04
- **Status:** accepted

## Context

We have a valid station pool, but we still need to choose the actual date window for training. The model should learn from recent and stable conditions, not from the oldest and most stale part of the history.

The project is building a forecast for Delhi PM2.5 in the current environment. That means the training period should reflect modern Delhi patterns rather than older years with different policy, traffic, fuel, and weather conditions.

## Options considered

| Option | For | Against |
|---|---|---|
| A — train on the full available history | Maximum dataset size | Oldest years may not reflect current Delhi conditions |
| B — train on the latest 3–4 years only | More relevant and recent; better match to current environment | Smaller dataset and fewer extreme events |
| C — train on the full valid pool but weight recent years more | Balances history and recency | More complexity for version one |

## Decision

We choose **Option B — the latest 3–4 years as the training window**.

The project will use the most recent 3–4 years of trainable data from the valid station pool, ending at the latest available sensor date, and not go farther back than needed.

## Why

This is the right trade-off for a first production-quality model. The business problem is current and operational: tomorrow's Delhi PM2.5 in the present environment. Using the most recent years is more realistic than learning from very old pollution patterns.

At the same time, 3–4 years is long enough to capture seasonality, weather effects, and a meaningful number of bad-air days without going too far back and diluting the model with old conditions. It also keeps the dataset large enough for stable modeling.

The project already accepted the minimum quality gate: 50 valid stations with at least 730 days of real coverage. The next decision is not “use everything”; it is “use the most relevant recent slice.”

## Consequences

- The model trains on recent Delhi behaviour rather than stale historical patterns.
- The training set is large enough to learn seasonality but not so old that it represents a different regime.
- The model's evaluation and baseline should be built against this recent period.
- If the project later needs more data for stability, we can extend the window or add additional backfill sources.

## Practical interpretation

The rule is:

- first filter by station quality: coverage_days >= 730
- then choose the latest 3–4 years within that valid pool for model training

This gives us a clean pipeline:

1. station quality filter
2. recent date-window filter
3. feature engineering and model training

This is more realistic and operationally useful than training on the entire long tail of historical data.
