# D-002 · Predict tomorrow's 24-hour mean (00:00–23:59 IST)

- **Date:** 2026-09-13
- **Ticket:** DAF-02
- **Status:** accepted

## Context

Asha decides in the evening, but the business decision is ultimately about tomorrow's overall air quality, not just a small morning window. The project needs a target definition that matches the real AQI bands and is understandable to the public and to parents.

## Options considered

| Option | For | Against |
|---|---|---|
| A — tomorrow's 24-hour mean (00:00–23:59 IST) | Matches the official AQI bands and public reporting; more stable and easier to predict | Includes the early morning hours when children are sleeping |
| B — tomorrow's morning window (07:00–10:00 IST) | Matches assembly time directly | Harder to predict; noisier; AQI categories are approximate for this short window |

## Decision

We choose **Option A — tomorrow's 24-hour mean (00:00–23:59 IST)** for version one.

## Why

This is the best first target because it aligns with the official AQI thresholds and public health communication. The categories and the school decision are defined against daily 24-hour average PM2.5, so the target should match that definition.

We can always sharpen to a morning-specific target later, but the right first version is the metric the country already uses and the public already understands. This also makes the model easier to reason about before we optimize for a narrower window.

## Consequences

- The target is aligned with official AQI categories and is easier to explain.
- The model will be trained on daily 24-hour mean PM2.5.
- We must be disciplined about the feature contract at 18:00 IST, because the full day is not available yet.
- A later version may switch to a morning-only target if this proves too coarse for the actual school decision.
- We should record any future change as a separate decision if the business requirement shifts.
