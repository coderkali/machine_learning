# D-001 · Predict the number, then apply the AQI table

- **Date:** 2026-09-13
- **Ticket:** DAF-02
- **Status:** accepted

## Context

We need a model that supports Asha's actual decision: whether school assembly should happen outside tomorrow morning. A single metric is not enough; we need both a forecast and a decision boundary that matches real-world school action.

## Options considered

| Option | For | Against |
|---|---|---|
| A — Predict a number only | Simple regression target; easy to explain with MAE | Does not directly express the school decision |
| B — Predict a category directly | Matches the business decision directly | Loses information; 91 and 400 become the same output |
| C — Predict the number, then apply the AQI table | Gives both a number and a business category; supports both regression and decision metrics | More work to interpret; the model is not directly optimized for a single threshold |

## Decision

We choose **Option C — predict the number, then apply the AQI table**.

## Why

This is the most practical and useful choice for the real product. Asha wants a number that she can reason about, but she also needs a clear yes/no decision: outside or indoors.

Option C gives both. It keeps the model aligned with the underlying PM2.5 signal while allowing us to evaluate the business decision using the AQI categories. It also supports both MAE and a safety metric like recall on Poor-or-worse days.

A classification-only model would be simpler to talk about, but it throws away useful information. Two values like 91 and 400 are very different in severity, yet they would collapse into the same category if we only predicted a binary unsafe/safe flag.

## Consequences

- The model output is a PM2.5 forecast in µg/m³, which is easy to explain to Asha.
- We can also derive the school decision from the same forecast using the official AQI table.
- We will evaluate both regression quality and decision quality.
- We must be careful not to treat a number-only model as if it directly optimizes the school decision.
- We may revisit this later if the model proves too noisy at the exact business threshold.
