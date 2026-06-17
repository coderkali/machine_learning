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