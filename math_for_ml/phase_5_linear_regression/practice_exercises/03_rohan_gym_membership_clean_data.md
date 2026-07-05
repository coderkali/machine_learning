# Practice Exercise 03 — Rohan's Gym Membership (Clean Data)

---

## The Problem

Rohan is checking a gym's total cost based on number of months enrolled:

| Months (x) | Total Cost (₹) |
|---|---|
| 1 | 1500 |
| 3 | 2500 |
| 5 | 3500 |
| 6 | 4000 |

**Find:** w, b, the formula, and the predicted cost after 10 months.

---

## Step 1 — Find w

Using points (3, 2500) and (5, 3500):

```
w = (3500 - 2500) / (5 - 3)
w = 1000 / 2
w = 500
```

Cross-checked using (5, 3500) and (6, 4000):

```
w = (4000 - 3500) / (6 - 5)
w = 500 / 1
w = 500
```

Both agree → **w = 500** (clean data confirmed)

---

## Step 2 — Find b

```
y = wx + b
1500 = 500(1) + b
1500 = 500 + b
b = 1000
```

**b = 1000**

---

## Step 3 — Final Formula

```
y = 500x + 1000
```

Verified against all 4 points — matches perfectly.

---

## Step 4 — Predict Cost After 10 Months

```
y = 500(10) + 1000
y = 5000 + 1000
y = 6000
```

**Predicted cost after 10 months = ₹6000**

---

## What b Represents Here

b = 1000 is the **joining/enrollment fee** — a one-time cost paid before the
first month even starts.

---

## In My Own Words

Same clean-data pattern as the previous two exercises — cross-checking w with
two different point pairs is a quick sanity check before trusting the formula.