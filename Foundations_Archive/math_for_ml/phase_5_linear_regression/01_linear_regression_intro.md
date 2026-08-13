# Phase 5 — Topic 01 — Introduction to Linear Regression

---

## The Problem — Raju's Uncle Sells Houses 🏠

Raju's uncle has data of houses sold recently:

| House Size (sq ft) | Price (₹ Lakhs) |
|---------------------|------------------|
| 500                 | 25               |
| 1000                | 50               |
| 1500                | 75               |
| 2000                | 100              |

A new customer has a plot of **1200 sq ft** and asks:

> "What price should I expect?"

This size is not in the table. Nobody has sold exactly a 1200 sq ft house.

**How do we predict the price?**

We draw a straight line through the known points and read off where 1200 sq ft lands.

**That straight line is called Linear Regression.**

---

## The Formula

```
y = wx + b
```

This is the same formula from Phase 1 Algebra — now it has a real job: predicting values.

| Symbol | Meaning |
|--------|---------|
| y | The value we are predicting (price) |
| x | The input we already know (size) |
| w | How fast y changes per unit of x (the slope) |
| b | The starting value of y when x = 0 |

---

## Step by Step — Finding w and b

### Step 1 — Pick Two Known Points

Using (500, 25) and (1500, 75)

### Step 2 — Find w (the slope)

```
w = Rise / Run = (y2 - y1) / (x2 - x1)
w = (75 - 25) / (1500 - 500)
w = 50 / 1000
w = 0.05
```

**w = 0.05** → every 1 sq ft increase adds ₹0.05 Lakhs (₹5000) to price

### Step 3 — Find b (using one point)

```
y = wx + b
25 = 0.05 × 500 + b
25 = 25 + b
b = 0
```

**b = 0** → at size 0, price is 0. Makes sense — no house, no price.

### Step 4 — The Final Formula

```
y = 0.05x + 0
```

---

## Verifying The Formula Against Every Point

| Size (x) | Calculation | Predicted | Actual |
|----------|-------------|-----------|--------|
| 500      | 0.05 × 500  | 25        | 25 ✓   |
| 1000     | 0.05 × 1000 | 50        | 50 ✓   |
| 1500     | 0.05 × 1500 | 75        | 75 ✓   |
| 2000     | 0.05 × 2000 | 100       | 100 ✓  |
| 1200     | 0.05 × 1200 | **60**    | predicted ★ |

Every known point matches perfectly — the formula works.

**Predicted price for 1200 sq ft = ₹60 Lakhs**

---

## What w and b Mean In Real Life

> **w** = how fast something changes per unit of x (rate of change)
> **b** = the starting value or baseline — what y is when x = 0

---

## When Is b NOT Zero? — Cab Fare Example 🚕

House price had b = 0 because there is no baseline cost — no house means no price.

But many real situations DO have a baseline cost. Example — a cab ride:

| Distance (km) | Fare (₹) |
|---------------|----------|
| 0             | 50       |
| 5             | 100      |
| 10            | 150      |
| 15            | 200      |

Even at distance = 0 (just booked the cab), you already pay ₹50 — the booking fee.

### Finding w and b

```
w = (150 - 50) / (10 - 0) = 100/10 = 10
```

**w = 10** → every km adds ₹10 to fare

```
y = wx + b
50 = 10(0) + b
b = 50
```

**b = 50** → the base booking fee, even before moving

### The Formula

```
Fare = 10x + 50
```

Verify with 5 km:
```
10(5) + 50 = 50 + 50 = 100 ✓
```

---

## Examples Of b In Different Situations

| Situation | What b Represents |
|-----------|---------------------|
| House price (size 0 → price 0) | b = 0 |
| Cab fare (booking fee exists) | b = 50 (fixed cost) |
| Gym membership (joining fee + monthly) | b = joining fee |
| Electricity bill (fixed charge + per unit) | b = fixed charge |

**Simple rule:**

> b is just whatever the line gives you when you plug in x = 0.
> If there is a baseline cost/value at zero — b is a real number.
> If nothing exists at zero — b becomes 0.

---

## Visual Comparison — b = 0 vs b = 50

```
y
|
|                    ╱  ← cab fare line (b = 50, starts above origin)
|                ╱  ╱
|            ╱  ╱
|        ╱  ╱
|    ╱  ╱  ← house price line (b = 0, starts at origin)
+──────────────────── x
   x = 0
```

The house price line starts exactly at the origin (b = 0).
The cab fare line starts higher up (b = 50) because of the booking fee
that exists even before any distance is traveled.

---

## Important Real-World Note

In our house example, all 4 points landed perfectly on the line.
This almost never happens in real life — real data is messy.
Some houses cost more due to location, condition, age, etc.

**Next question to explore:**
When points do NOT sit perfectly on a straight line —
how do we find the "best" line that fits the data?

This leads to the next topic — Cost Function and how Linear Regression
actually learns from messy, real-world data.

---

## In My Own Words

w means how fast something changes per unit of time or distance.
b represents the starting value or initial value before anything happens.

Linear Regression draws a straight line through known data points
so we can predict values we have never seen before.