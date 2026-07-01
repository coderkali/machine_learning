# Phase 5 — Topic 02 — Cost Function and Gradient Descent

---

## The Problem — Which Line Is Best?

When real data is messy, points do not sit perfectly on any line.
We can draw hundreds of different lines. But which one is the BEST?

**Answer: The best line is the one with the SMALLEST total error.**

---

## What Is Error?

For every house (or data point), the line makes a prediction.
The gap between the real value and the predicted value is called the ERROR.

```
Error = Real Value − Predicted Value
```

Example:
- Real price  = ₹30 Lakhs
- Line guessed = ₹25 Lakhs
- Error        = 30 − 25 = ₹5 Lakhs wrong
```

---

## The Problem With Raw Errors

Errors can be positive OR negative:

| House | Error |
|-------|-------|
| House 1 | +5L (line guessed too high) |
| House 2 | −5L (line guessed too low) |
| House 3 | +5L (line guessed too high) |
| House 4 | −5L (line guessed too low) |

If we add them directly:
```
+5 + (−5) + 5 + (−5) = 0
```

This makes it look like a perfect line — but it is NOT perfect!
The line was wrong by ₹5L on every single house.

**Positive and negative errors cancel each other out. That is wrong.**

---

## The Fix — Square Every Error

Squaring any number always gives a positive result:

```
5²  = 5 × 5  = 25   ← positive ✅
−5² = −5 × −5 = 25  ← also positive ✅
```

So we SQUARE each error before adding them.
This stops cancelling and makes every error count.

---

## What Is The Cost Function?

The Cost Function is the SUM of all SQUARED errors.

```
Cost = (error1)² + (error2)² + (error3)² + ...
```

It gives us ONE single number that tells us how wrong our line is overall.

| Cost Value | Meaning |
|------------|---------|
| Very big   | Line is very wrong ❌ |
| Very small | Line is mostly right ✅ |
| Zero       | Perfect line (almost never in real life) |

---

## Real Example — Rohan's Electricity Bill ⚡

Rohan notes AC usage and monthly bills:

| AC Hours (x) | Bill (y) |
|--------------|----------|
| 1            | ₹500     |
| 2            | ₹1000    |

We use formula: y = w × x (b = 0 to keep it simple)
We need to find the best value of w.

---

## Step by Step — Trying Different Values of w

### Try w = 0

```
Predict for x=1:   0 × 1 = 0
Real value:        500
Error:             500 − 0 = 500
Error squared:     500² = 250,000

Predict for x=2:   0 × 2 = 0
Real value:        1000
Error:             1000 − 0 = 1000
Error squared:     1000² = 1,000,000

Total Cost = 250,000 + 1,000,000 = 1,250,000 ❌ Very bad!
```

### Try w = 200

```
Predict for x=1:   200 × 1 = 200
Real value:        500
Error:             500 − 200 = 300
Error squared:     300² = 90,000

Predict for x=2:   200 × 2 = 400
Real value:        1000
Error:             1000 − 400 = 600
Error squared:     600² = 360,000

Total Cost = 90,000 + 360,000 = 450,000 ⬇ Getting better!
```

### Try w = 400

```
Predict for x=1:   400 × 1 = 400
Real value:        500
Error:             500 − 400 = 100
Error squared:     100² = 10,000

Predict for x=2:   400 × 2 = 800
Real value:        1000
Error:             1000 − 800 = 200
Error squared:     200² = 40,000

Total Cost = 10,000 + 40,000 = 50,000 ⬇ Much better!
```

### Try w = 500

```
Predict for x=1:   500 × 1 = 500
Real value:        500
Error:             500 − 500 = 0
Error squared:     0² = 0

Predict for x=2:   500 × 2 = 1000
Real value:        1000
Error:             1000 − 1000 = 0
Error squared:     0² = 0

Total Cost = 0 + 0 = 0 ✅ PERFECT!
```

### Try w = 600

```
Predict for x=1:   600 × 1 = 600
Real value:        500
Error:             500 − 600 = −100
Error squared:     100² = 10,000

Predict for x=2:   600 × 2 = 1200
Real value:        1000
Error:             1000 − 1200 = −200
Error squared:     200² = 40,000

Total Cost = 10,000 + 40,000 = 50,000 ⬆ Getting worse again!
```

---

## The Pattern

| w value | Total Cost | Direction |
|---------|------------|-----------|
| 0       | 1,250,000  | ❌ Terrible |
| 200     | 450,000    | ⬇ Getting better |
| 400     | 50,000     | ⬇ Much better |
| **500** | **0**      | ✅ Perfect minimum |
| 600     | 50,000     | ⬆ Getting worse |

Cost goes DOWN as w increases toward 500.
Cost hits ZERO at w = 500.
Cost goes back UP after w = 500.

This forms a U-shaped curve:

```
Cost
  |
  |*                         *
  |  *                     *
  |    *                 *
  |       *           *
  |           *   *
  |               ★  ← minimum cost at w = 500
  +----+----+----+----+----+--
  0   200  400  500  600  700   w value
```

---

## How Gradient Descent Walks Down The Curve

Gradient Descent does NOT randomly try all values of w.
It uses the DERIVATIVE (slope) at each point to know which direction to move.

| Derivative at current w | Meaning | What Gradient Descent Does |
|-------------------------|---------|---------------------------|
| Negative | Cost going DOWN | Increase w |
| Positive | Cost going UP | Decrease w |
| Zero | Completely flat = bottom | STOP ✅ |

### The Journey Step by Step

```
Start:  w = 0   → derivative negative → increase w
Step 1: w = 200 → derivative negative → increase w
Step 2: w = 400 → derivative almost zero → tiny step
Step 3: w = 500 → derivative = zero → STOP ✅
```

**w = 500 is the answer. That is what Gradient Descent found.**

---

## How Gradient Descent Uses Derivative Every Step

At every step, Gradient Descent does this:

```
New w = Current w − (Learning Rate × Derivative)
```

| Word | Meaning |
|------|---------|
| Current w | Where we are right now |
| Learning Rate | How big a step to take (small number like 0.1) |
| Derivative | How steep the cost curve is right now |

- Derivative is negative → subtracting a negative → w INCREASES
- Derivative is positive → subtracting a positive → w DECREASES
- Derivative is zero → w stops changing → DONE ✅

---

## The Full Journey — One Line Summary

```
Start with random w
    ↓
Calculate predictions using y = wx
    ↓
Calculate errors (real − predicted)
    ↓
Square the errors and add them → Cost
    ↓
Check derivative of cost curve at current w
    ↓
Adjust w in the direction that reduces cost
    ↓
Repeat thousands of times
    ↓
Derivative = zero → STOP → best w found ✅
```

---

## Why We Square Errors — One Line Summary

> Squaring makes all errors positive so they cannot cancel each other out,
> and gives us one honest number showing how wrong the line really is.

---

## In My Own Words

The Cost Function is one number that tells us how wrong our line is.
We calculate it by squaring every error and adding them all up.

Gradient Descent starts with a random w, checks the slope of the cost curve,
takes a small step in the direction that reduces cost,
and repeats until it finds the w that gives the minimum cost.

That w is the best w — and that gives us the best line.