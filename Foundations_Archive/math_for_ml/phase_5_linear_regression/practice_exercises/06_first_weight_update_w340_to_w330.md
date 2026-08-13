# Practice Exercise 06 — First Full Gradient Descent Update (w = 340 → w = 330)

---

## Where We Left Off

At **w = 340**, the derivative was calculated (Exercise 05):

```
dCost/dw = +1000
```

A positive derivative meant we were standing on the **right side of the bowl**
— w = 340 was already slightly past the true minimum.

---

## Step 1 — Apply the Weight Update Rule

```
New w = Old w − (Learning Rate × Derivative)
```

Using a Learning Rate of **0.01**:

```
New w = 340 − (0.01 × 1000)
New w = 340 − 10
New w = 330
```

**New w = 330**

---

## Step 2 — Verify: Calculate Cost at w = 330, b = 0

| Hours | Prediction | Real | Error | Error² |
|---|---|---|---|---|
| 1 | 330  | 300  | -30  | 900    |
| 2 | 660  | 550  | -110 | 12,100 |
| 3 | 990  | 1000 | 10   | 100    |
| 4 | 1320 | 1200 | -120 | 14,400 |
| 5 | 1650 | 1800 | 150  | 22,500 |

```
Cost = 900 + 12,100 + 100 + 14,400 + 22,500 = 50,000
```

**Cost at w = 330 → 50,000**

---

## Step 3 — Compare Before and After the Update

```
w = 340 (before update) → Cost = 54,500
w = 330 (after one gradient descent step) → Cost = 50,000
```

**The Cost went DOWN.** This confirms the full mechanism works:

1. Calculated the derivative at w = 340 → got **+1000**
2. Positive derivative → "on the right side of the bowl, move left (decrease w)"
3. Applied the update rule → got **w = 330**
4. Verified by recalculating Cost at w = 330 → confirmed it's lower

---

## What This Represents

This is **one full iteration of Gradient Descent**, done entirely by hand —
the same repeating process that, in Meera's electricity bill example, ran
automatically for many iterations until it converged near w ≈ 560.

---

## The Repeating Cycle

To reach the true minimum, this cycle repeats:

```
1. Calculate the derivative at the current w
2. Update w using: New w = Old w − (Learning Rate × Derivative)
3. Check if Cost dropped
4. Repeat until the derivative is very close to zero
   (that's the bottom of the bowl)
```

---

## In My Own Words

*(To be filled in once fully understood — one line on what "one iteration"
means, and one line on how you'd know when to stop iterating.)*