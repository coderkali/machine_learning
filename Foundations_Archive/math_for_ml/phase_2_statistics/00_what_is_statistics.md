# What is Statistics — Origin Story & Big Picture

---

## Where statistics came from

### 1. Gambling -> Probability
17th century Europe. A nobleman (Chevalier de Méré) kept losing
at dice games and couldn't figure out why.

He asked mathematician Blaise Pascal to explain it.
Pascal worked with Pierre de Fermat - together they figured out
how to calculate the CHANCES of different dice outcomes.

This was the birth of PROBABILITY.

### 2. Counting populations -> Statistics
Governments needed to know population numbers, deaths, births.

John Graunt studied death records in London and noticed PATTERNS:
- Certain diseases killed more people in certain months
- More boys were born than girls, every single year, consistently

Realization: Even though individual events seem random,
the GROUP as a whole follows predictable patterns.

This was the birth of STATISTICS.

---

## What does "statistics" actually mean?

Statistics is the science of:
1. Collecting data
2. Summarizing it
3. Finding patterns in it
4. Using those patterns to make decisions or predictions

Even when individual cases are unpredictable, GROUPS follow patterns.

---

## Real life story — Village Doctor

One sick child with fever -> doctor has no idea why (could be anything)

100 children with fever over a month -> doctor writes down:
age, symptoms, food, location

Pattern found: 80 of 100 children who got sick drank water from
the SAME WELL.

One data point = no information.
Many data points, summarized and compared = reveals the truth.

THIS is statistics.

---

## Why this matters for Machine Learning

| Village doctor                          | ML model                              |
|------------------------------------------|----------------------------------------|
| 100 sick children                         | Millions of data rows                   |
| "80 drank from same well"                 | "Pattern found in the data"             |
| Doctor's conclusion: avoid that well      | Model's prediction: "this is spam"      |
| Used statistics to find pattern manually  | Uses statistics (mean, variance,        |
|                                            | probability, correlation) automatically |

Every ML algorithm is built on top of statistics.
Without statistics, there is no ML - just numbers with no meaning.

---

## The two branches of statistics

| Branch                  | What it does                              | Topics in our plan                          |
|-------------------------|---------------------------------------------|----------------------------------------------|
| Descriptive Statistics  | Summarizing what data looks like          | Mean, Median, Mode, Variance, Std Dev, Correlation |
| Inferential/Probability  | Predictions & decisions under uncertainty | Probability Basics, Normal Distribution     |

---

## Phase 2 Roadmap

| # | Topic                        | ML Use                                          |
|---|-------------------------------|--------------------------------------------------|
| 1 | Mean, Median, Mode             | Missing values, skew detection, MSE loss          |
| 2 | Variance & Standard Deviation   | StandardScaler, overfitting (bias-variance)       |
| 3 | Probability Basics              | Every classifier outputs a probability            |
| 4 | Normal Distribution             | Z-score, outlier detection, algorithm assumptions  |
| 5 | Correlation                     | Feature selection (Iris heatmap)                  |

---