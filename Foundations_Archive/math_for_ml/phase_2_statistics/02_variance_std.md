# Topic 02 — Variance & Standard Deviation
Date:

---

## The Story
Two cricket players, both with mean score of 50 across 5 matches.

Player A: 48, 52, 49, 51, 50  -> consistent
Player B: 10, 90, 5, 95, 50   -> unpredictable

Same mean. Completely different story.
Mean alone doesn't tell us how SPREAD OUT the data is.
That's what Variance and Standard Deviation measure.

---

## The Problem with Raw Distances
Distances from mean can be negative and positive.
They cancel each other out when added -> sum = 0 -> useless.
Fix: SQUARE each distance to remove negatives.

---

## VARIANCE

### What is it?
Average of squared distances from the mean.
Measures how spread out data is from the average.

### Formula
σ² = Σ(x - x̄)² / n

| Symbol     | Meaning                        |
|------------|--------------------------------|
| σ²         | Variance (sigma squared)       |
| Σ          | Sum of everything              |
| x          | Each individual value          |
| x̄          | The mean                       |
| (x - x̄)²  | Distance from mean, squared    |
| n          | Total count of values          |

### Calculation — Player A
Scores: 48, 52, 49, 51, 50 | Mean = 50

| Score | Distance (x-x̄) | Squared |
|-------|----------------|---------|
| 48    | -2             | 4       |
| 52    | +2             | 4       |
| 49    | -1             | 1       |
| 51    | +1             | 1       |
| 50    | 0              | 0       |

Variance = (4+4+1+1+0)/5 = 2

### Calculation — Player B
Scores: 10, 90, 5, 95, 50 | Mean = 50

| Score | Distance (x-x̄) | Squared |
|-------|----------------|---------|
| 10    | -40            | 1600    |
| 90    | +40            | 1600    |
| 5     | -45            | 2025    |
| 95    | +45            | 2025    |
| 50    | 0              | 0       |

Variance = (1600+1600+2025+2025+0)/5 = 1450

### Comparison
| Player | Variance | Meaning                          |
|--------|----------|----------------------------------|
| A      | 2        | Scores stay close to mean        |
| B      | 1450     | Scores wander far from mean      |

---

## STANDARD DEVIATION

### What is it?
Square root of Variance. Brings the unit back to original.
Variance is in runs² (unnatural). Std dev is in runs (natural).

### Formula
σ = √σ²

### Calculation
| Player | Variance | Std Dev          | Plain meaning              |
|--------|----------|------------------|----------------------------|
| A      | 2        | √2 = 1.41 runs   | Varies by ±1.41 from mean  |
| B      | 1450     | √1450 = 38.08 runs| Varies by ±38.08 from mean |

---

## ML Connection
| Where                  | How                                              |
|------------------------|--------------------------------------------------|
| StandardScaler         | Divides every value by std dev to normalize data |
| Bias-variance tradeoff | High variance model = overfitting                |
| Outlier detection      | Values beyond 3 std devs = outliers              |

---

## Memory Hook
(Write your own one sentence here)

---

## Practice Working
(Your answers go here)

---