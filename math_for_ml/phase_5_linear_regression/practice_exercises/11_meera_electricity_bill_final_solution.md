# Practice Exercise 11 — Meera's Electricity Bill: Final Solution (Closes Topic 06)

---

## The Problem (from Topic 06 — Messy Data and Gradient Descent)

| AC Hours (x) | Bill (₹) (y) |
|---|---|
| 1 | 620  |
| 2 | 1080 |
| 3 | 1750 |
| 4 | 2100 |
| 5 | 2900 |

Topic 06 established this was messy data (no single slope fits all points)
and left off at "best w ≈ 560" without an exact value or a final prediction.
This exercise solves it completely using the exact formula approach — the
same method used for Rohan's freelance earnings, now extended to solve for
**both w and b together**.

---

## Step 1 — Build the Table

| x | y | x×y | x² |
|---|---|---|---|
| 1 | 620  | 620   | 1  |
| 2 | 1080 | 2160  | 4  |
| 3 | 1750 | 5250  | 9  |
| 4 | 2100 | 8400  | 16 |
| 5 | 2900 | 14500 | 25 |

```
n = 5
Σx = 15
Σy = 8450
Σ(xy) = 30,930
Σ(x²) = 55
```

---

## Step 2 — The Formulas (Solving for w and b Simultaneously)

Setting both dCost/dw = 0 and dCost/db = 0 at the same time gives:

```
w = [n×Σ(xy) − Σx×Σy] / [n×Σ(x²) − (Σx)²]

b = [Σy − w×Σx] / n
```

---

## Step 3 — Calculate w

```
n×Σ(xy) = 5 × 30,930 = 154,650
Σx×Σy   = 15 × 8450  = 126,750

Numerator = 154,650 − 126,750 = 27,900

n×Σ(x²) = 5 × 55 = 275
(Σx)²   = 15²    = 225

Denominator = 275 − 225 = 50

w = 27,900 / 50 = 558
```

**w = 558**

*(Note: an earlier attempt at this calculation had an arithmetic slip in
"n×Σ(xy)" — written as 154,700 instead of 154,650 — which produced an
incorrect w=1. Always re-verify each intermediate multiplication before
trusting the final division.)*

---

## Step 4 — Calculate b

```
b = (8450 − 558×15) / 5
b = (8450 − 8370) / 5
b = 80 / 5
b = 16
```

**b = 16**

---

## Step 5 — Independent Cross-Check (Deviation-from-Mean Method)

A completely different calculation method, used to verify Steps 3-4 aren't
just a repeated mistake:

```
mean of x = 3, mean of y = 1690

Deviations x: -2, -1, 0, 1, 2
Deviations y: -1070, -610, 60, 410, 1210

Σ(x_dev × y_dev) = 2140 + 610 + 0 + 410 + 2420 = 5580
Σ(x_dev²)        = 4 + 1 + 0 + 1 + 4 = 10

w = 5580 / 10 = 558   ✓ matches Step 3
b = 1690 − 558×3 = 1690 − 1674 = 16   ✓ matches Step 4
```

Both methods agree — **w = 558, b = 16** confirmed correct.

---

## Final Formula

```
Bill = 558 × hours + 16
```

---

## Predicting the Bill at 3.5 Hours

```
Bill = 558 × 3.5 + 16
     = 1953 + 16
     = 1969
```

**Meera's predicted electricity bill at 3.5 hours of AC usage = ₹1969**

---

## What This Confirms

This matches Topic 06's manual gradient descent trials, which found "best w
≈ 560" through iteration — the exact formula gives 558, very close to that
manual estimate, the same pattern seen with Rohan's data (manual iterations
landing close to the exact answer).

This also closes the loop on why both approaches matter:
- **Manual gradient descent** (Topic 06, Exercises 04-07) — builds intuition
  for *why* the process works, step by step
- **Exact formula** (this exercise) — gives the precise answer in one shot,
  once w and b are the only two parameters (not always possible for larger
  models, which is why gradient descent remains the general-purpose tool)

---

## In My Own Words

*(To be filled in once fully understood — one line on why solving for w and
b together needed two formulas instead of one, and one line on why the
cross-check method was worth doing.)*