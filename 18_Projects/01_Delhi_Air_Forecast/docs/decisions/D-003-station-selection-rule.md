# D-003 · Keep the stations with real 2-year coverage and use them as the valid pool

- **Date:** 2026-09-16
- **Ticket:** DAF-03
- **Status:** accepted

## Context

We have finished the station-discovery step and now need a measurable rule for which monitors we trust enough to train on. The project must not use stations with very short or obviously weak histories, because a monitor with only a few months of data would create unstable labels and noisy features.

The actual check we ran was a real-time coverage check, not a calendar-year guess. A station with a short actual gap is not a good station for a stable forecasting model.

## Options considered

| Option | For | Against |
|---|---|---|
| A — keep every PM2.5 station | Maximum data volume | Too much noise; short-lived sensors distort the dataset |
| B — keep only stations with coverage_days >= 730 | Simple, measurable, consistent with the real data quality rule | Some stations with 2 years of data are still weaker than the newest six-year monitors |
| C — require a longer recent window such as 3–4 years for every station | More stable and recent signal | Shrinks the available pool too much and may remove usable Delhi coverage |

## Decision

We choose **Option B — keep the stations with coverage_days >= 730** as the minimum valid station rule.

We will keep the 50 valid locations that satisfy this requirement as the project's quality gate. This is the minimum bar we trust for training.

## Why

This is the right first-pass rule because it is objective, easy to explain, and based on actual elapsed time rather than calendar-year guesses. A station that only covers a few months is not reliable enough for the model we want to build.

The verification we ran showed that 50 unique locations pass this rule. That is enough to proceed with a real model build while still keeping the data quality high.

We also do not want to overfit the project to a very strict rule that would eliminate too many monitors. A 2-year minimum keeps the pool realistic, while still excluding the clearly weak stations. For version one, we are choosing a quality gate, not a maximum-possible rule.

## Consequences

- The project uses the station pool that passed the real coverage check.
- We do not train on stations with less than 730 days of actual coverage.
- The station set is large enough to support a first modeling pass.
- Later, if the model is weak or unstable, we can tighten the rule or reweight the newest stations more heavily.
- We still prefer the newest and most stable stations when we build the final training slice.

## Final interpretation

Yes, this is enough to train the first model.

It is not the final word on station quality; it is the minimum acceptable quality gate. The project should then prefer the newest 3–4 years within that valid pool when choosing the actual training window, rather than using the oldest data in the set.
