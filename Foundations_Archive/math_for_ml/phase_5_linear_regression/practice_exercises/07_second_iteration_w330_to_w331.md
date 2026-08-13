# Practice Exercise 07 — Second Gradient Descent Iteration (w = 330 → w = 331)

---

## Where We Left Off

After the first update (Exercise 06), we had:
```
w = 330 → Cost = 50,000
```

Now we repeat the cycle: calculate the derivative at this new w, update again,
and verify the cost dropped further.

---

## Step 1 — Errors at w = 330 (from Exercise 06)

| Hours (x) | Error |
|---|---|
| 1 | -30  |
| 2 | -110 |
| 3 | 10   |
| 4 | -120 |
| 5 | 150  |

---

## Step 2 — Calculate x × Error for Each Row

| Hours (x) | Error | x × Error |
|---|---|---|
| 1 | -30  | -30  |
| 2 | -110 | -220 |
| 3 | 10   | 30   |
| 4 | -120 | -480 |
| 5 | 150  | 750  |

```
Σ(x × error) = -30 - 220 + 30 - 480 + 750 = 50
```

---

## Step 3 — Calculate the Derivative

```
dCost/dw = -2 × Σ(x × error)
dCost/dw = -2 × 50
dCost/dw = -100
```

**Derivative at w = 330 is -100 (negative).**

---

## Step 4 — Apply the Weight Update Rule

```
New w = Old w − (Learning Rate × Derivative)
New w = 330 − (0.01 × -100)
New w = 330 − (-1)
New w = 330 + 1
New w = 331
```

**New w = 331**

---

## Key Insight — The Sign Flip

```
At w = 340 → derivative = +1000 (large positive) → moved DOWN to w = 330
At w = 330 → derivative = -100  (small negative)  → moved UP to w = 331
```

A **negative derivative** means standing on the **left side of the bowl** —
the formula automatically pushes w **up** to head back toward the bottom.
No manual direction-checking needed; the minus sign in the update rule
handles it automatically, regardless of whether the derivative is positive
or negative.

Also notice: the step size shrank from a jump of 10 (340→330) to a jump of
just 1 (330→331). As we approach the bottom of the bowl, the slope flattens,
the derivative shrinks, and the update steps naturally get smaller — this is
how gradient descent converges without needing to be told to slow down.

---

## Step 5 — Verify: Calculate Cost at w = 331, b = 0

| Hours (x) | Prediction | Real | Error | Error² |
|---|---|---|---|---|
| 1 | 331  | 300  | -31  | 961    |
| 2 | 662  | 550  | -112 | 12,544 |
| 3 | 993  | 1000 | 7    | 49     |
| 4 | 1324 | 1200 | -124 | 15,376 |
| 5 | 1655 | 1800 | 145  | 21,025 |

```
Cost = 961 + 12,544 + 49 + 15,376 + 21,025 = 49,955
```

**Cost at w = 331 → 49,955**

---

## Full Journey So Far

```
w = 340 → Cost = 54,500
w = 330 → Cost = 50,000
w = 331 → Cost = 49,955   ← lower still, but by a much smaller amount
```

The cost keeps dropping, but the size of the drop is shrinking fast —
a clear sign we're closing in on the bottom of the bowl.

---

## In My Own Words

*(To be filled in once fully understood — one line on why the update steps
get smaller as gradient descent converges, and one line on what a very
small derivative would eventually tell us.)*