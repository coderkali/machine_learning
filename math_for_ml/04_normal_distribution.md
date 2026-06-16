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