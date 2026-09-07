# Practice Exercise 02 — Arjun's Mobile Recharge Plan (Clean Data)

---

## The Problem

Arjun is comparing a prepaid data plan. Cost scales with GB used:

| Data Used (GB) | Cost (₹) |
|---|---|
| 1 | 30 |
| 3 | 70 |
| 5 | 110 |
| 7 | 150 |

**Find:** w, b, the formula, and the predicted cost for 4 GB.

---

## Step 1 — Find w

Using points (3, 70) and (7, 150):

```
w = (150 - 70) / (7 - 3)
w = 80 / 4
w = 20
```

Cross-checked using (1, 30) and (5, 110):

```
w = (110 - 30) / (5 - 1)
w = 80 / 4
w = 20
```

Both pairs agree → **w = 20** (confirms this is clean data)

---

## Step 2 — Find b

```
y = wx + b
70 = 20(3) + b
70 = 60 + b
b = 10
```

**b = 10**

---

## Step 3 — Final Formula

```
y = 20x + 10
```

Verified against all 4 points — matches perfectly.

---

## Step 4 — Predict Cost for 4 GB

```
y = 20(4) + 10
y = 80 + 10
y = 90
```

**Predicted cost for 4 GB = ₹90**

---

## What b Represents Here

b = 10 is a **fixed base charge** — like a platform fee Arjun pays even before
using any data, similar to the cab booking fee example.

---

## In My Own Words

Checking the slope between two *different* pairs of points and getting the
same w value is a good way to confirm data is clean before committing to the
direct slope formula.