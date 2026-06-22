# Topic 05 — Correlation
Date:

---

## The Story

### Ice cream shop — Positive Correlation
You notice: when temperature goes up, ice cream sales go up too.

| Day | Temperature (°C) | Ice creams sold |
|-----|-----------------|-----------------|
| 1   | 20              | 30              |
| 2   | 25              | 40              |
| 3   | 30              | 55              |
| 4   | 35              | 60              |
| 5   | 40              | 70              |

Both move UP together -> Positive Correlation

### Same shop — Negative Correlation
When temperature goes up, hot coffee sales go DOWN.

| Day | Temperature (°C) | Hot coffee sold |
|-----|-----------------|-----------------|
| 1   | 20              | 70              |
| 2   | 25              | 60              |
| 3   | 30              | 45              |
| 4   | 35              | 25              |
| 5   | 40              | 10              |

One goes UP, other goes DOWN -> Negative Correlation

---

## Three Types of Correlation

| Pattern                        | Name                | Example                     |
|--------------------------------|---------------------|-----------------------------|
| Both go up/down together       | Positive Correlation| Temperature & Ice cream      |
| One up, other down             | Negative Correlation| Temperature & Coffee         |
| No pattern at all              | No Correlation      | Shoe size & Runs scored      |

---

## The r Value — Pearson Correlation Coefficient

r always sits between -1 and +1. Always.

| Value of r        | Meaning                        |
|-------------------|--------------------------------|
| r = +1            | Perfect positive correlation   |
| r = +0.7 to +1    | Strong positive correlation    |
| r = +0.3 to +0.7  | Moderate positive correlation  |
| r = 0             | No correlation                 |
| r = -0.3 to -0.7  | Moderate negative correlation  |
| r = -0.7 to -1    | Strong negative correlation    |
| r = -1            | Perfect negative correlation   |

---

## Iris Dataset Connection

| Feature pair                  | r value | Meaning                              |
|-------------------------------|---------|--------------------------------------|
| Petal length & Petal width    | 0.96    | Strong positive — move together      |
| Sepal length & Petal length   | 0.87    | Strong positive — move together      |
| Sepal length & Sepal width    | -0.12   | Almost no relationship               |

---

## Why Correlation Matters in ML

We drop features in TWO situations:

### Situation 1 — No correlation (r near 0)
Feature is useless — adds no information to the model.
Example: shoe size has no correlation with runs scored.
Action: DROP the feature.

### Situation 2 — Too high correlation (r near 1 or -1)
Two features saying the same thing twice.
Example: petal length and petal width (r=0.96)
Like telling a friend "India scored 300. Also India scored 300."
Second sentence adds ZERO new information.
Action: DROP one of them, keep the more useful one.

This process is called FEATURE SELECTION.

---

## The Formula — Pearson Correlation Coefficient

r = Σ(x - x̄)(y - ȳ) / √[Σ(x - x̄)² × Σ(y - ȳ)²]

### What every symbol means
| Symbol     | Meaning                              |
|------------|--------------------------------------|
| r          | Correlation coefficient — the answer |
| x          | Each value of first variable         |
| x̄          | Mean of first variable               |
| y          | Each value of second variable        |
| ȳ          | Mean of second variable              |
| Σ          | Sum of everything                    |
| (x - x̄)   | Distance of x from its mean          |
| (y - ȳ)   | Distance of y from its mean          |

### What the formula is doing in plain English
1. Find how far each x value is from x mean
2. Find how far each y value is from y mean
3. Multiply those distances together for each row
4. If they move in same direction -> positive number -> positive r
5. If they move in opposite directions -> negative number -> negative r

---

## Practice Working
(Your answers go here)

---

## My Understanding (in my own words)
(Fill this after practice questions)

---

## Pearson Correlation — Full Calculation

### Dataset
Ice cream shop: Temperature vs Sales
Mean of x (temperature) = 30
Mean of y (ice cream sales) = 51

### Calculation Table
| Day | x  | y  | (x-30) | (y-51) | Product | (x-30)² | (y-51)² |
|-----|----|----|--------|--------|---------|---------|---------|
| 1   | 20 | 30 | -10    | -21    | +210    | 100     | 441     |
| 2   | 25 | 40 | -5     | -11    | +55     | 25      | 121     |
| 3   | 30 | 55 | 0      | +4     | 0       | 0       | 16      |
| 4   | 35 | 60 | +5     | +9     | +45     | 25      | 81      |
| 5   | 40 | 70 | +10    | +19    | +190    | 100     | 361     |
| Sum |    |    |        |        | 500     | 250     | 1020    |

### Final Calculation
r = 500 / √(250 × 1020)
r = 500 / √255000
r = 500 / 505
r = 0.99

### Conclusion
r = 0.99 -> Almost perfect positive correlation.
When temperature goes up, ice cream sales go up together.

### ML Decision
If both features were in a dataset:
r = 0.99 is too high -> DROP one feature.
Keeping both = telling the model same thing twice.