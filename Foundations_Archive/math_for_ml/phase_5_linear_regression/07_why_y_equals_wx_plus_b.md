# Phase 5 — Topic 07 — Why y = wx + b?

---

## The Most Important Question

Why do we use y = wx + b?
Why not some other formula?

---

## Start With A Simple Story — Onion Market 🧅

You go to a market. Onions cost ₹30 per kg.

| Kg bought (x) | Calculation | Total cost (y) |
|---------------|-------------|----------------|
| 1 kg          | 30 × 1      | ₹30            |
| 3 kg          | 30 × 3      | ₹90            |
| 5 kg          | 30 × 5      | ₹150           |

The pattern is:

```
Total cost = price per kg × number of kg
Total cost = 30 × kg
```

This is exactly y = wx in disguise:

| Formula Symbol | Onion Story |
|----------------|-------------|
| y | Total cost (what we want to find) |
| w | ₹30 per kg (rate — how fast cost grows) |
| x | Number of kg (input we already know) |

---

## Where Does b Come In?

The shopkeeper adds a fixed charge:

> "I also charge ₹10 for the carry bag — no matter how much you buy."

Now the formula becomes:

```
Total cost = (30 × kg) + 10
```

That +10 is b — a fixed amount added regardless of x.

| Formula Symbol | Onion Story |
|----------------|-------------|
| y | Total cost |
| w | ₹30 per kg (rate) |
| x | Number of kg (input) |
| b | ₹10 fixed bag charge (starting value) |

---

## The Formula In Plain English

```
y = wx + b

Answer = (rate × input) + starting value
```

That is all it is. Nothing magical.

---

## Why THIS Formula — Not Any Other?

Because y = wx + b describes a STRAIGHT LINE.

And a straight line is the simplest possible relationship
between two things.

Think about any real life relationship:

```
More AC hours    → higher bill       → straight line going UP
More kg bought   → higher cost       → straight line going UP
More house size  → higher price      → straight line going UP
More study hours → better marks      → straight line going UP
```

Whenever one thing increases at a STEADY rate
as another thing increases —
it follows a straight line —
which means y = wx + b.

---

## What The Graph Looks Like

```
y (bill)
  |              ╱
  |           ╱
  |        ╱
  |     ╱
  | ╱  ← starts at b (y-intercept)
  +─────────────── x (hours)

Slope of line = w
Starting point = b
```

- w controls how STEEP the line is
- b controls how HIGH the line starts (at x=0)

---

## What If The Relationship Is NOT A Straight Line?

| Relationship | Formula |
|--------------|---------|
| Straight line | y = wx + b → Linear Regression |
| Gentle curve | y = wx² + b → Polynomial |
| Very complex | Neural Networks |

Linear Regression always starts with y = wx + b
because it is the simplest and most useful starting point.

---

## Connecting To Meera's Electricity Story

Rohan noticed: every extra hour of AC adds roughly ₹500 to bill.

That is exactly w = 500 — a steady rate of change.

And even at 0 hours, there is a small base charge — that is b.

So:

```
Bill = 500 × hours + b
     = wx + b
     = y = wx + b ✅
```

The formula came from the REAL WORLD pattern.
We did not invent it. We discovered it from the data.

---

## In My Own Words

y = wx + b simply means:
Answer = (rate × input) + starting value

We use this formula because most real life relationships
follow a straight line pattern — one thing increases
steadily as another thing increases.

w tells us how fast y grows per unit of x.
b tells us the starting value of y when x is zero.

Together they define the best straight line through the data —
and that line lets us predict any value we have never seen before.