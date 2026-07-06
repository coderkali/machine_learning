# Practice Exercise 09 — The Derivative With Respect to b

---

## Why Gradient Descent Needs Two Update Rules

Once b is no longer fixed at 0, the model has **two** parameters to learn:
w (slope) and b (intercept). Gradient Descent updates each one using its
**own** derivative, separately:

```
New w = Old w − (Learning Rate × dCost/dw)
New b = Old b − (Learning Rate × dCost/db)
```

We already derived `dCost/dw`. This note derives `dCost/db`.

---

## Step 1 — The Full Cost Function (Including b)

```
Cost = Σ (error)²
     = Σ (y − prediction)²
     = Σ (y − (wx + b))²
```

The prediction is now `wx + b`, not just `wx`.

---

## Step 2 — Derivative With Respect to b

Using the same chain rule logic as for w:

```
dCost/db = -2 × Σ [ y − (wx + b) ]
         = -2 × Σ(error)
```

**No `x` appears here** — unlike `dCost/dw`, which multiplies each error by
its x value.

---

## Why No x This Time — The Intuition

- **w** is a slope — it multiplies x. Asking "how does Cost change if w
  changes?" naturally involves x, because w's effect scales with x.
- **b** is a flat number added on top — it doesn't multiply anything.
  Whether x is 1 or 5, b adds the exact same amount to every prediction.

So the derivative for b simply adds up the plain errors — no weighting by x.

---

## Side-by-Side Comparison

```
dCost/dw = -2 × Σ(x × error)     ← errors weighted by x
dCost/db = -2 × Σ(error)          ← errors added up directly, no weighting
```

---

## Worked Example — At w = 330, b = 0 (Rohan's Data)

| Hours (x) | Prediction (330×x + 0) | Real | Error |
|---|---|---|---|
| 1 | 330  | 300  | -30  |
| 2 | 660  | 550  | -110 |
| 3 | 990  | 1000 | 10   |
| 4 | 1320 | 1200 | -120 |
| 5 | 1650 | 1800 | 150  |

### Step 1 — Sum the Plain Errors (No x Multiplication)

```
Sum of errors = -30 + (-110) + 10 + (-120) + 150 = -100
```

### Step 2 — Multiply by -2

```
dCost/db = -2 × (-100) = 200
```

**Derivative with respect to b at this point is +200 (positive).**

### Step 3 — Apply the Update Rule (Learning Rate = 0.01)

```
New b = Old b − (Learning Rate × Derivative)
New b = 0 − (0.01 × 200)
New b = 0 − 2
New b = -2
```

**New b = -2**

### Step 4 — Interpretation

A positive derivative means we're on the "right side of the bowl" for b too
— same logic as w. So b decreases, moving from 0 down to -2.

---

## Numerical Proof That "-2 × error" Is Correct (One Data Point)

Using just Row 1 (x=1, y=300), pretending prediction = b alone (w ignored
for this isolated check):

```
At b = 0:
error = 300 − 0 = 300
Cost = 300² = 90,000

At b = 1 (nudged up by 1):
error = 300 − 1 = 299
Cost = 299² = 89,401

Change in Cost = 89,401 − 90,000 = -599
Change in b = 1
Slope ≈ -599 / 1 = -599
```

Compare to the formula:
```
dCost/db = -2 × error = -2 × 300 = -600
```

**-599 vs -600 — nearly identical.** The tiny gap exists only because we
nudged b by a whole 1 instead of an infinitely small amount (true calculus
uses infinitely small nudges, giving exactly -600).

---

## Why Summing Works — b Affects Every Row Equally

Increasing b by 1 doesn't just change one row's prediction — it
simultaneously increases **every** row's prediction by 1, because b is
added the same way everywhere. So the total effect on Cost is the combined
effect across all rows:

```
Total dCost/db = (Row1 slope) + (Row2 slope) + ... + (Row5 slope)
              = -2×error1 + -2×error2 + ... + -2×error5
              = -2 × (error1 + error2 + ... + error5)
              = -2 × Σ(error)
```

---

## In My Own Words

*(To be filled in once fully understood — one line on why b's derivative
skips the "×x" step that w's derivative has.)*