# Practice Exercise 08 — Deriving the Exact Best w (Setting Derivative = 0)

---

## Part 1 — Why Do We Set the Derivative to Zero?

Recall the Cost curve is shaped like a bowl:

```
Cost
|  ╲                    ╱
|   ╲                  ╱
|    ╲                ╱
|     ╲              ╱
|      ╲            ╱
|       ╲__________╱
+---------------------------- w
     (left side)  (bottom)  (right side)
```

From hand calculations across earlier exercises:
- **Left side** of the bowl → slope points downward → derivative is **negative**
- **Right side** of the bowl → slope points upward → derivative is **positive**
- **Bottom** of the bowl → the curve is flat → derivative is **zero**

As long as you're standing on a slope (tilted ground), you can still go lower.
The only point where the ground is perfectly flat is the very bottom.

So instead of testing many w values one at a time, we can directly ask:
*"At what exact w does the slope become perfectly flat (zero)?"*

That point **is** the minimum — the best w. Setting `dCost/dw = 0` and solving
gives the exact answer in one shot, instead of many rounds of guessing.

---

## Part 2 — Deriving w = Σ(xy) / Σ(x²)

### Step 1 — Start With the Cost Function (b = 0)

```
Cost = Σ (error)²
     = Σ (y − prediction)²
     = Σ (y − wx)²
```

This is the same squared-error sum calculated by hand in earlier exercises,
just written with algebra instead of a table.

### Step 2 — Take the Derivative With Respect to w

Using the chain rule (Phase 4):

```
dCost/dw = -2 × Σ [ x × (y − wx) ]
```

This matches the by-hand process exactly:
```
error = y − wx   (Real minus Prediction)
dCost/dw = -2 × Σ(x × error)
```

### Step 3 — Set the Derivative to Zero (the flat point of the bowl)

```
-2 × Σ [ x × (y − wx) ] = 0
```

Divide both sides by -2:
```
Σ [ x × (y − wx) ] = 0
```

### Step 4 — Expand the Bracket

```
Σ [ xy − wx² ] = 0
```

Split the sum into two parts:
```
Σ(xy) − w × Σ(x²) = 0
```

(w can be pulled out of the sum since it's the same fixed value for every row —
to be explained further below.)

### Step 5 — Solve for w

```
Σ(xy) = w × Σ(x²)

w = Σ(xy) / Σ(x²)
```

---

## Applying This to Rohan's Freelance Earnings Data

| x | y | x×y | x² |
|---|---|---|---|
| 1 | 300  | 300  | 1  |
| 2 | 550  | 1100 | 4  |
| 3 | 1000 | 3000 | 9  |
| 4 | 1200 | 4800 | 16 |
| 5 | 1800 | 9000 | 25 |

```
Σ(xy) = 300 + 1100 + 3000 + 4800 + 9000 = 18,200
Σ(x²) = 1 + 4 + 9 + 16 + 25 = 55

w = 18,200 / 55 = 330.91 (approx)
```

---

## Comparing to the Manual Gradient Descent Trials

```
Manual steps: w = 340 → 330 → 331
Exact answer: w = 330.91
```

The by-hand iterations (Exercises 04–07) landed almost exactly on the true
minimum after just two update steps — 330 and 331 sandwich the exact value
330.91 almost perfectly. Cost at the exact w is about 49,954.5, nearly
identical to the Cost calculated at w = 331 (49,955).

**Final answer for Rohan's problem (with b = 0):**
```
y = 330.91 × x
```

---

## Important Note

This derivation held **b = 0** fixed throughout, matching how the manual
gradient descent trials were done. In practice, gradient descent usually
updates **both w and b together** at the same time, which can fit an even
better line. This is a natural next topic to explore.

---

## In My Own Words

*(To be filled in once fully understood — one line on why setting the
derivative to zero finds the minimum directly, and one line on why w can be
pulled outside the summation in Step 4.)*