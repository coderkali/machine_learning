# Practice Exercise 01 — Priya's Water Tank Filling (Clean Data)

---

## The Problem

Priya is filling a water tank. Water level rises at a steady rate:

| Time (minutes) | Water Level (litres) |
|---|---|
| 2 | 40 |
| 4 | 80 |
| 6 | 120 |
| 8 | 160 |

**Find:** w, b, the formula, and the predicted water level at t = 5 minutes.

---

## Step 1 — Find w

Using points (2, 40) and (8, 160):

```
w = (y2 - y1) / (x2 - x1)
w = (160 - 40) / (8 - 2)
w = 120 / 6
w = 20
```

**w = 20**

---

## Step 2 — Find b

```
y = wx + b
40 = 20(2) + b
40 = 40 + b
b = 0
```

**b = 0**

---

## Step 3 — Final Formula

```
y = 20x
```

Verified against all 4 points — matches perfectly (clean data, no gradient descent needed).

---

## Step 4 — Predict Water Level at t = 5

```
y = 20 × 5
y = 100
```

**Predicted water level at 5 minutes = 100 litres**

---

## In My Own Words

This was clean data — every pair of points gave the same slope, so the direct
slope formula worked without needing gradient descent.