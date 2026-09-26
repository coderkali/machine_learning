# Episode 00 — Channel Intro

**Length target:** ~2 minutes
**Format:** vertical 1080x1920, dark background, blue/yellow accents, Alice narrating

## Narration + beat script

1. **(0:00–0:12) Hook — who this is for**
   > "If you write Java for a living, and machine learning still feels like someone else's field — this channel is for you."

   Visual: series wordmark fades in, then "For Java Developers" pulses in yellow.

2. **(0:12–0:28) The promise**
   > "Every day, one machine learning concept. Explained the way I actually learned it: the idea first, in plain English — the math only once the idea makes sense. No calculus required to follow along."

   Visual: two labeled cards side by side — "Idea" (blue, front) and "Math" (dimmed, behind) — idea card slides forward first.

3. **(0:28–0:50) Why trust this — the notes are real**
   > "These aren't generic slides. Every video comes from my own study notes — real datasets, real mistakes, real fixes — the same notes I used to learn this myself."

   Visual: a stack of small notebook icons/cards labeled with real topic names (Missing Values, Outliers, Regression, Decision Trees...) fanning out briefly.

4. **(0:50–1:35) The roadmap — from 04_ML, in real learning order**
   > "Here's where we're headed. We start with the boring-but-critical part: cleaning messy data — missing values, outliers, duplicates. Then scaling and encoding it for a model. Then the model-building family: linear regression, decision trees, k-nearest neighbors, support vector machines, clustering. Then how to actually judge if a model is any good — cross-validation, precision and recall, ROC curves. Then tuning and combining models with ensembles. And we close with a full project that strings every one of those steps together, end to end."

   Visual: a vertical roadmap track (matches the "Journey" pipeline stages) scrolling upward through labeled stage nodes:
   `Raw Data → Data Cleaning → Pre-Processing → Explore → Select & Reduce → Data Split → Model Selection → Evaluation → Tuning → Final Model`
   — each node lighting up blue as its narration line plays, with 2–3 example concept names appearing under it in smaller dim text.

5. **(1:35–1:50) How to follow**
   > "One concept, about sixty seconds, every day. Faceless, to the point, no fluff. Follow along, and by the time we reach the final project, you'll have watched an entire machine learning course build up one day at a time."

   Visual: a small "Day 1, Day 2, Day 3..." tick counter animating upward next to a calendar icon.

6. **(1:50–2:00) Outro / CTA**
   > "First real concept drops next. Follow so you don't miss it."

   Visual: standard `outro_card()` — wordmark, tagline, yellow "Follow for one ML concept a day" CTA.

## Notes on accuracy
- Roadmap order and stage names are taken directly from `17_Learning_As_Of_Now/Claude/journey-data.js` (Phase 1: Raw Data → Data Cleaning → Pre-Processing; Phase 2: Explore → Select & Reduce; Phase 3: Data Split → Model Selection → Training → Evaluation → Hyperparameter Tuning → Final Model), not from `15_Docs/ROADMAP.md`.
- No specific concept is claimed as "already covered" in this video — it only previews the roadmap, so it stays correct as new episodes are added.
- Deployment stage (MLOps/Cloud) is intentionally left out of the spoken roadmap since it's outside `04_ML` and not yet in scope for this series — can be added later if the series extends there.

---
**Waiting for your approval before rendering.** Reply with edits or "approved" / "go".
