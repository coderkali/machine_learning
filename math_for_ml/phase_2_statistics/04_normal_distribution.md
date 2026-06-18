# Topic 04 — Normal Distribution
Date:

---

## The Story
You are a doctor measuring height of 1000 people.
You plot them on a graph — height on x-axis, count on y-axis.

Result:
- Very few people are extremely short
- Very few people are extremely tall
- Most people cluster around the average

The graph makes a HILL SHAPE — tall in the middle, tapering on both sides.
This hill shape is called the NORMAL DISTRIBUTION (also: Bell Curve).

---

## Why Does This Shape Appear?
Most things in nature are influenced by many small random factors.
When many small random factors combine, they almost always
produce a bell curve.

Height = influenced by hundreds of genes + nutrition + environment
All these factors push most people toward the middle.

### Real life examples that follow bell curve
| What you measure              | Pattern    |
|-------------------------------|------------|
| Heights of people             | Bell curve |
| Cricket scores across players | Bell curve |
| Exam marks in a large class   | Bell curve |
| Errors in manufacturing       | Bell curve |
| Daily temperature in a city   | Bell curve |

---

## What the Bell Curve Looks Like
- Perfectly symmetric — left side mirrors right side
- Peak is exactly at the mean (center)
- Tapers off on both sides — extreme values are rare

### What symmetry means
If mean = 50:
- 500 players scored ABOVE 50 (right side)
- 500 players scored BELOW 50 (left side)

Same number scored 60 (10 above) as scored 40 (10 below).
Same number scored 70 as scored 30.
Nature balances both sides perfectly around the average.

---

## The 68-95-99.7 Rule
The most important rule about normal distribution.
(Example: Cricket scores, Mean = 50, Std Dev = 10)

| Band        | Score range | Players out of 1000 | Plain meaning              |
|-------------|-------------|----------------------|----------------------------|
| Mean ± 1 SD | 40 to 60    | 680 players          | Most players — average     |
| Mean ± 2 SD | 30 to 70    | 950 players          | Almost everyone            |
| Mean ± 3 SD | 20 to 80    | 997 players          | Nearly the whole group     |
| Beyond ± 3  | <20 or >80  | Only 3 players       | Outliers — extremely rare  |

Visual description:
- Inner band (green)  = 68% — tight cluster around mean
- Middle band (amber) = 95% — wider but still common
- Outer band (red)    = 99.7% — almost all data
- Beyond outer band   = Outliers

---

## Z-Score — Coming Next
The formula that connects a raw value to its position
on the bell curve. Tells you: "How many std devs away
from the mean is this value?"

---

## ML Connection
| Where                  | How normal distribution is used                     |
|------------------------|-----------------------------------------------------|
| Outlier detection      | Beyond 3 std devs = outlier = remove or investigate |
| StandardScaler         | Transforms data to mean=0, std dev=1                |
| Algorithm assumptions  | Many ML algorithms assume normally distributed data  |
| Fraud detection        | Transaction beyond 3 std devs = suspicious          |

---

## Memory Hook
(Write your own one sentence here)

---

## Practice Working
(Your answers go here after practice questions)

---

## My Understanding (in my own words)
(Fill this after practice questions)

---

---

## Z-Score

### The Problem it Solves
Comparing values from different datasets directly is unfair.
Two students from different schools with different averages
and different spreads — how do you compare them fairly?
Z-score gives a fair comparison by measuring relative position.

### Formula
z = (x - μ) / σ

| Symbol | Meaning                    |
|--------|----------------------------|
| z      | Z-score — the final answer |
| x      | The value you are checking |
| μ      | Mean of the dataset        |
| σ      | Standard deviation         |

### Plain English
Z-score tells you how many standard deviations a value
is away from the mean.

| Z-score | Meaning                          |
|---------|----------------------------------|
| 0       | Exactly at the mean              |
| +1      | One std dev above mean           |
| -1      | One std dev below mean           |
| +2      | Two std devs above — getting rare|
| +3      | Three std devs above — outlier   |

### Calculation — Student comparison
Student A: x=75, mean=60, std dev=10
z = (75-60)/10 = 15/10 = 1.5

Student B: x=80, mean=70, std dev=20
z = (80-70)/20 = 10/20 = 0.5

| Student | Raw Score | Z-score | Meaning                          |
|---------|-----------|---------|----------------------------------|
| A       | 75        | 1.5     | 1.5 std devs above class mean    |
| B       | 80        | 0.5     | 0.5 std devs above class mean    |

Conclusion: Student A performed better RELATIVE to their class.
Raw score alone is misleading — z-score gives fair comparison.

### ML Connection — StandardScaler
Scikit-learn applies z = (x - mean) / std dev to every value.
Result: mean becomes 0, std dev becomes 1.
All features put on same scale — no feature dominates.

### Why ML needs this
Without scaling:
- Sepal length: 4.3 to 7.9 cm (small numbers)
- House price: 50,000 to 5,00,000 rupees (huge numbers)
House price dominates every calculation just because
its numbers are bigger — not because it is more important.
Z-score scaling fixes this.

---

### Q1 — Factory bolts normal distribution

#### Setup
A factory produces bolts. We want to know which bolts are
normal and which are defective (outliers).

Mean = 10 cm (average bolt length)
Std Dev = 0.5 cm (how much bolts vary from average)

---

#### 68-95-99.7 Rule Applied

BAND 1 — 68% of bolts (most common):
Range = Mean ± 1 Std Dev
     = 10 ± 0.5
     = 9.5 cm to 10.5 cm
Meaning: 680 out of every 1000 bolts fall in this range.
These are your perfectly normal bolts.

BAND 2 — 95% of bolts:
Range = Mean ± 2 Std Dev
     = 10 ± (2 × 0.5)
     = 10 ± 1.0
     = 9.0 cm to 11.0 cm
Meaning: 950 out of every 1000 bolts fall here.
Still acceptable — slightly longer or shorter than average.

BAND 3 — 99.7% of bolts:
Range = Mean ± 3 Std Dev
     = 10 ± (3 × 0.5)
     = 10 ± 1.5
     = 8.5 cm to 11.5 cm
Meaning: 997 out of every 1000 bolts fall here.
Getting rare — these bolts are noticeably different.

BEYOND BAND 3 — 0.3% of bolts:
Shorter than 8.5 cm OR longer than 11.5 cm
Only 3 out of every 1000 bolts.
These are OUTLIERS — defective, needs inspection.

Visual summary:
8.5 --- 9.0 --- 9.5 ---[10 MEAN]--- 10.5 --- 11.0 --- 11.5
 |_____________99.7%___________________________|
         |_________95%_________________|
                |____68%_________|

---

#### Is the 11.5 cm bolt an outlier?

Step 1: Calculate Z-score
z = (x - mean) / std dev
z = (11.5 - 10) / 0.5
z = 1.5 / 0.5
z = 3.0

Step 2: Check the rule
| Z-score range  | Classification | Action          |
|----------------|----------------|-----------------|
| -1 to +1       | Very normal    | No action       |
| -2 to +2       | Normal         | No action       |
| -3 to +3       | Borderline     | Monitor         |
| Beyond ±3      | Outlier        | Inspect/Remove  |

Step 3: Conclusion
Z = 3.0 sits exactly at the boundary.
This bolt is at the edge of the 99.7% range.
Only 3 in 1000 bolts are this long.
ACTION: Flag for quality inspection — likely defective.

---

#### ML Connection
This exact logic is used in:
- Fraud detection: transaction with Z > 3 = suspicious
- Data cleaning: remove rows with Z > 3 before training
- Anomaly detection: find unusual patterns in data

In Scikit-learn:
from scipy import stats
z_scores = stats.zscore(data)
outliers = data[abs(z_scores) > 3]

### Q2 — Bank fraud detection
Mean = ₹5000, Std Dev = ₹1000

Customer A: z = (5800-5000)/1000 = 800/1000  = 0.8  → Normal
Customer B: z = (8500-5000)/1000 = 3500/1000 = 3.5  → OUTLIER
Customer C: z = (3200-5000)/1000 = -1800/1000 = -1.8 → Normal

Note on negative Z-score:
Negative = below mean. Not automatically suspicious.
Just means the transaction was smaller than average.

Flag: Customer B — Z = 3.5 exceeds ±3 boundary.
Only 0.3% of transactions reach this level.

ML Connection:
This is exactly how bank fraud detection models work.
Any transaction with Z > 3 triggers an alert automatically.

---

## Reverse Calculation — Proving Everything from Raw Data

### The Dataset
10 bank customers and their transaction amounts:

| Customer | Transaction (₹) |
|----------|----------------|
| 1        | 4000           |
| 2        | 5500           |
| 3        | 4800           |
| 4        | 6000           |
| 5        | 5200           |
| 6        | 4500           |
| 7        | 5800           |
| 8        | 4200           |
| 9        | 5100           |
| 10       | 8900           |

---

### Stage 1 — Calculate Mean

Step 1: Add all transactions
4000 + 5500 = 9500
9500 + 4800 = 14300
14300 + 6000 = 20300
20300 + 5200 = 25500
25500 + 4500 = 30000
30000 + 5800 = 35800
35800 + 4200 = 40000
40000 + 5100 = 45100
45100 + 8900 = 54000

Sum = 54000

Step 2: Divide by number of customers
Mean = 54000 / 10 = 5400

MEAN = ₹5400

---

### Stage 2 — Calculate Standard Deviation

Step 1: Find distance of each value from mean (5400)
Step 2: Square each distance (removes negatives)
Step 3: Average the squared distances = Variance
Step 4: Square root of Variance = Std Dev

#### Distance Table

| Customer | Transaction (x) | Distance (x-5400) | Squared        |
|----------|-----------------|-------------------|----------------|
| 1        | 4000            | -1400             | 1,960,000      |
| 2        | 5500            | +100              | 10,000         |
| 3        | 4800            | -600              | 360,000        |
| 4        | 6000            | +600              | 360,000        |
| 5        | 5200            | -200              | 40,000         |
| 6        | 4500            | -900              | 810,000        |
| 7        | 5800            | +400              | 160,000        |
| 8        | 4200            | -1200             | 1,440,000      |
| 9        | 5100            | -300              | 90,000         |
| 10       | 8900            | +3500             | 12,250,000     |

Step 3: Add all squared distances
1960000 + 10000     = 1970000
1970000 + 360000    = 2330000
2330000 + 360000    = 2690000
2690000 + 40000     = 2730000
2730000 + 810000    = 3540000
3540000 + 160000    = 3700000
3700000 + 1440000   = 5140000
5140000 + 90000     = 5230000
5230000 + 12250000  = 17480000

Sum of squared distances = 17,480,000

Step 4: Calculate Variance
Variance = 17480000 / 10 = 1,748,000

Step 5: Calculate Standard Deviation
Std Dev = √1748000 = 1322.12

STANDARD DEVIATION = ₹1322.12

---

### Stage 3 — Calculate Z-Score for Customer 10

Customer 10 transaction = ₹8900
Mean = ₹5400
Std Dev = ₹1322.12

Formula: z = (x - μ) / σ

Step 1: Subtract mean from value
8900 - 5400 = 3500

Step 2: Divide by std dev
3500 / 1322.12 = 2.64

Z-SCORE = 2.64

#### Is Customer 10 an outlier?
Z = 2.64 -> within ±3 boundary -> NOT an outlier

| Z-score range  | Classification | Action              |
|----------------|----------------|---------------------|
| 0 to ±1        | Very normal    | No action           |
| ±1 to ±2       | Normal         | No action           |
| ±2 to ±3       | Borderline     | Monitor             |
| Beyond ±3      | Outlier        | Flag / Investigate  |

---

### Stage 4 — Reverse Calculation (Fraud Threshold)

Question: Above what amount should the system flag a transaction?

Formula: x = μ + (z × σ)

Step 1: Plug in values
x = 5400 + (3 × 1322.12)

Step 2: Multiply
3 × 1322.12 = 3966.36

Step 3: Add mean
5400 + 3966.36 = 9366.36

FRAUD THRESHOLD = ₹9366.36

Any transaction ABOVE ₹9366 gets flagged automatically.
Customer 10's ₹8900 is below this threshold -> safe.

---

### Key Insight from This Exercise

The same transaction amount can be normal OR suspicious
depending on the dataset.

Example:
- Earlier example: Mean=5000, Std Dev=1000
  ₹8500 -> Z=3.5 -> FLAGGED
- Our real dataset: Mean=5400, Std Dev=1322.12
  ₹8900 -> Z=2.64 -> NOT flagged

This proves why ML models always calculate from
actual data — never from assumptions.
The numbers only make sense in context of the full dataset.

---

### Formula Summary

| What          | Formula                    | Purpose                      |
|---------------|----------------------------|------------------------------|
| Mean          | μ = Σx / n                 | Find average                 |
| Variance      | σ² = Σ(x-μ)² / n          | Find spread (squared units)  |
| Std Dev       | σ = √σ²                    | Find spread (original units) |
| Z-score       | z = (x-μ) / σ              | Find position on bell curve  |
| Reverse       | x = μ + (z × σ)            | Find value from Z-score      |

---

### Q3 — Cricket batting analysis

Dataset: 32, 45, 55, 48, 60, 41, 38, 81

#### Stage 1 — Mean
32+45+55+48+60+41+38+81 = 400
Mean = 400/8 = 50

#### Stage 2 — Standard Deviation

| Score | Distance (x-50) | Squared |
|-------|-----------------|---------|
| 32    | -18             | 324     |
| 45    | -5              | 25      |
| 55    | +5              | 25      |
| 48    | -2              | 4       |
| 60    | +10             | 100     |
| 41    | -9              | 81      |
| 38    | -12             | 144     |
| 81    | +31             | 961     |

Sum = 1664
Variance = 1664/8 = 208
Std Dev = √208 = 14.42

MISTAKE TO AVOID: Always divide sum by n BEFORE
taking square root. √(sum/n) not √sum/n

#### Stage 3 — Z-score for 81
z = (81-50) / 14.42
z = 31/14.42
z = 2.15

#### Stage 4 — Is 81 an outlier?
Z = 2.15 -> within ±3 -> NOT an outlier
But getting close — worth monitoring.

#### Stage 5 — Outstanding performance threshold (Z=2)
x = μ + (z × σ)
x = 50 + (2 × 14.42)
x = 50 + 28.84
x = 78.84

Any score above 78.84 = exceptional performance.
Score of 81 crosses this threshold -> outstanding batsman.