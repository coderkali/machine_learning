# Phase 3 — Classical ML Concepts: Strategy

## Purpose

Phase 3 builds the vocabulary of traditional/classical ML — the terms and
concepts that show up constantly in AI discussions, LLM evaluation, RAG
evaluation, and production model quality checks, even for someone whose
target role is Agentic AI Engineer, not Data Scientist.

**Depth rule:** Light conceptual understanding only. No implementing every
algorithm manually, no deep statistics, no Kaggle-style depth, no
research-level model comparison. See `AI_Engineering_Roadmap.md` Section 7
for the full scope boundary.

## The Spine: One Evolving Dataset

Instead of switching examples every topic, all 13 topics in this phase use
the **same evolving dataset** — a bank loan-default prediction problem. This
mirrors how a real ML project actually works: you don't get a fresh clean
dataset per concept, you take one messy dataset through the full pipeline.

**Setting:** Riverstone Bank
**Loan officer:** Arjun
**Customers (8):**

| ID | Name | Age | Monthly Income (₹) | Loan Requested (₹) | Existing Loan | Credit Score | Employment | Defaulted |
|----|------|-----|----|----|----|----|----|----|
| 1 | Ravi | 29 | 45,000 | 200,000 | No | 720 | Salaried | No |
| 2 | Sunita | 34 | 62,000 | 350,000 | Yes | 680 | Salaried | No |
| 3 | Farhan | 41 | 38,000 | 150,000 | No | 610 | Self-employed | Yes |
| 4 | Meena | 26 | 30,000 | 100,000 | No | 590 | Salaried | Yes |
| 5 | Deepak | 50 | 85,000 | 500,000 | Yes | *(missing)* | Self-employed | No |
| 6 | Kavya | 31 | 55,000 | 250,000 | No | 700 | Salaried | No |
| 7 | Imran | 45 | 40,000 | 180,000 | Yes | 615 | Self-employed | Yes |
| 8 | Priya | 27 | 12,00,000 *(outlier)* | 300,000 | No | 750 | Salaried | No |

Two data quality issues are **deliberately embedded from the start**, not
introduced later as a "gotcha":
- **Deepak's credit score is missing** — the credit bureau API call timed
  out (external system failure).
- **Priya's monthly income is an outlier** — likely a data-entry typo on
  the application form (human-entered source failure), ₹1,20,000 vs
  ₹12,00,000.

These carry forward through the rest of the phase — cleaning, encoding,
feature engineering, and later model training will all reference back to
these same two problems.

## Topics (13)

| # | Topic | Status |
|---|---|---|
| 1 | Data Collection | ✅ Complete |
| 2 | Data Cleaning, Missing Values, Outliers | ✅ Complete |
| 3 | Feature Engineering, Encoding | ⬜ Next up |
| 4 | Regression | ⬜ |
| 5 | Classification | ⬜ |
| 6 | Clustering | ⬜ |
| 7 | Training / Test / Validation Data | ⬜ |
| 8 | Overfitting, Underfitting | ⬜ |
| 9 | Accuracy, Precision, Recall, F1 | ⬜ |
| 10 | Confusion Matrix | ⬜ |
| 11 | Model Tuning Basics | ⬜ |
| 12 | Bringing It Together (mini scenario) | ⬜ |
| 13 | End-to-End Recap (conceptual only, no coding) | ⬜ |

## Folder Structure

Each topic gets its own subfolder under `phase_3_classical_ml/`, rather
than flat files at the root. Convention:

```
phase_3_classical_ml/
  00_strategy.md
  01_data_collection/
    01_data_collection.md
  02_data_cleaning/
    02_data_cleaning.md
    images/
      02_income_outlier_iqr.svg
  03_feature_engineering/
    03_feature_engineering.md
    images/           (only if that topic has visuals)
  ...
```

Each topic folder contains its own `images/` subfolder if that topic has
any embedded diagrams — keeps visuals scoped to the topic they belong to
instead of one shared folder growing unmanageably across 13 topics.

## Teaching Rhythm (per topic)

1. **Story-first** — real-world scenario with concrete numbers, using the
   Riverstone Bank dataset.
2. **3-level explanation** — child level, software engineer level,
   interview-ready level.
3. **Conceptual verification question** — answered before notes are
   generated. Not optional; this is the teaching contract.
4. **GenAI/RAG bridge** — explicit mapping from the classical ML concept to
   its later GenAI/RAG equivalent.
5. **Visuals where they help** — diagrams/charts generated whenever a
   number-heavy or spatial concept (spread, distribution, boundaries)
   benefits from seeing it, not just reading it. Saved as an actual `.svg`
   file under `images/` and embedded in the notes with markdown image
   syntax — not just described in prose — so it renders on GitHub.
6. **Notes generated** — only after understanding is confirmed.
7. **Commit to GitHub** — before advancing to the next topic.

## Recurring Add-Ons (Practice, FAQ, Interview Prep)

These layer on top of the core rhythm above, starting from Topic 2 onward
(and retrofitted to earlier topics if requested).

### Riverstone Case Files (practice sessions)

After a topic's notes are committed, before moving to the next topic, a new
mini-scenario is introduced in the same Riverstone Bank universe — a new
customer or a new twist — that requires applying the just-learned concept.
Rules:
- **Solved independently first** — no walkthrough given up front, same
  paper-work-checked-not-solved contract as the main teaching flow.
- Kept in the same story world deliberately, instead of abstract drills,
  so the practice reinforces the mental model rather than testing
  formula recall in isolation.
- Every few topics, a **cumulative case file** quietly requires concepts
  from 2-3 topics back as well as the current one — informal spaced
  repetition without calling it that.
- A short rapid-fire round (2-3 quick "why/what" conceptual questions, not
  calculations) can follow the case file to test verbal recall, mimicking
  how the concept would come up in an interview setting.

### FAQ section (per topic notes file)

A small set (3-5) of common conceptual mix-ups for that topic, written
generally — "what someone learning this topic commonly gets confused
about" — as distinct from the verbatim "Clarifying Questions Asked" log
(which captures the actual back-and-forth from that specific learning
session). Both can coexist in the same notes file; they serve different
purposes.

### Interview Questions & Answers (per topic notes file)

3-5 realistic interview-style questions for that topic with concise model
answers, pitched at the interview-ready level from the 3-level explanation.
Builds directly toward the interview-prep work planned for later in the
roadmap (post Phase 4+), so this doesn't need to be redone from scratch
later — just aggregated.

## Notes

- Topic 13 is a conceptual recap only — no coding project.
- Math/paper-work verification (as used heavily in Phase 2) applies only
  where a topic involves actual computation (e.g., a metric calculation in
  Topic 9). Purely conceptual topics like Data Collection are verified
  through reasoning questions instead.