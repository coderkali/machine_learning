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
| 1 | Data Collection | 🟡 In progress |
| 2 | Data Cleaning, Missing Values, Outliers | ⬜ |
| 3 | Feature Engineering, Encoding | ⬜ |
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

## Teaching Rhythm (per topic)

1. **Story-first** — real-world scenario with concrete numbers, using the
   Riverstone Bank dataset.
2. **3-level explanation** — child level, software engineer level,
   interview-ready level.
3. **Conceptual verification question** — answered before notes are
   generated. Not optional; this is the teaching contract.
4. **GenAI/RAG bridge** — explicit mapping from the classical ML concept to
   its later GenAI/RAG equivalent.
5. **Notes generated** — only after understanding is confirmed.
6. **Commit to GitHub** — before advancing to the next topic.

## Notes

- Topic 13 is a conceptual recap only — no coding project.
- Math/paper-work verification (as used heavily in Phase 2) applies only
  where a topic involves actual computation (e.g., a metric calculation in
  Topic 9). Purely conceptual topics like Data Collection are verified
  through reasoning questions instead.