# D-006 · Keep the current model free of these weather features

- **Date:** 2026-09-29
- **Ticket:** DAF-13
- **Status:** accepted

## Context

DAF-13 tested whether three tomorrow-weather aggregates improve the DAF-07 Ridge baseline: mean wind speed, maximum humidity, and total precipitation. All three experiments used the same chronological cut date, the same 145 test dates, and the same Poor-or-worse threshold of 91 µg/m³.

## Options considered

| Option | For | Against |
|---|---|---|
| No weather: keep the DAF-07 five-feature model | Best measured MAE in this comparison; simplest current model | Does not use weather information |
| Train with archive weather | Uses the realised physical weather; useful diagnostic signal | Creates a train/serve gap because production only has forecasts |
| Train with historical forecast weather | Matches the information available at production time | These three aggregates worsened this experiment's MAE |

## Evidence

| Experiment | MAE | Poor-or-worse recall |
|---|---:|---:|
| No weather | 15.507 | 0.353 |
| Archive weather | 17.314 | 0.353 |
| Historical forecast weather | 17.314 | 0.353 |

Archive weather was +11.7% worse than the no-weather baseline on MAE. Forecast weather was +11.7% worse. Poor-or-worse recall stayed at 0.353 in all three runs.

## Decision

Keep the **no-weather DAF-07 feature set** for the current model. Do not add these three weather aggregates to the production candidate based on this experiment.

If weather is reintroduced in a later experiment, evaluate the **historical forecast** as the production-honest source first. Keep archive weather as a diagnostic comparison, not as the final production result.

## Why

The no-weather model had the lowest measured MAE, while weather did not improve safety recall. Archive weather also represents information that is better than what the live service will know at 18:00, so it cannot be treated as the production answer. The result is a measured decision, not a claim that weather can never help.

## Consequences

- The current candidate remains the DAF-07 PM2.5-history model.
- The experiment log preserves all three results for future comparison.
- Future weather work must use the forecast source when judging production performance.
- We would revisit this decision after better weather feature definitions, more weather variables, or additional time-based validation.
