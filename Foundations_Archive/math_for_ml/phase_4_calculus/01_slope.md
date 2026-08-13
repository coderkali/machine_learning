# Topic 01 — Slope

## What is Slope?

Slope is a measure of the steepness and direction of a line.
It tells you how much y changes for every 1 unit change in x.

In simple words:
> For every 1 step forward, how many steps did you go up?

---

## Real Life Story — Walking Up a Road

You are walking up a road. Someone marks your position:

- Start: (1, 1) → at minute 1, height = 1 metre
- End:   (3, 5) → at minute 3, height = 5 metres

How steep is this road?

- Rise = how much you went UP = 5 − 1 = **4 metres**
- Run = how much you went FORWARD = 3 − 1 = **2 minutes**

**Slope = 4 ÷ 2 = 2**

Meaning: every 1 minute forward → you go up 2 metres.

---

## The Formula

```
         Rise     Δy     y₂ − y₁
Slope = ------ = ---- = ---------
         Run      Δx     x₂ − x₁
```

### What Each Symbol Means

| Symbol | Meaning |
|--------|---------|
| Rise | How much you went UP (change in y) |
| Run | How much you went FORWARD (change in x) |
| Δy | y₂ − y₁ (second numbers in the points) |
| Δx | x₂ − x₁ (first numbers in the points) |
| y₂, y₁ | Height at end point and start point |
| x₂, x₁ | Position at end point and start point |

---

## Important Rule

Every point is written as **(x, y)**:
- First number = how far forward (x)
- Second number = height (y)

So:
- Rise always uses the **SECOND numbers** (y values)
- Run always uses the **FIRST numbers** (x values)

---

## What Slope Values Mean

| Slope Value | Meaning |
|-------------|---------|
| 5 | Very steep — going up fast |
| 1 | Gentle — going up slowly |
| 0 | Completely flat |
| −2 | Going downhill (negative = going down) |

---

## Common Mistake to Avoid

Given points (1, 1) and (3, 5):

❌ Wrong: counting numbers → 1, 2, 3 = 3 (incorrect)  
✅ Right: counting gaps → 3 − 1 = 2 (correct)

Always subtract. Never count the numbers themselves.

---

## Practice Question

Points: (2, 3) and (6, 11)

- Rise = 11 − 3 = 8
- Run = 6 − 2 = 4
- Slope = 8 ÷ 4 = **2**

Meaning: every 1 step forward → go up 2 metres.

---

## Why Slope Matters in ML

In Machine Learning, your model's errors form a curve — like a valley.
The model needs to find the **BOTTOM** of that valley (minimum error).

To do that, it checks the slope at every point:
- Slope tells the model: am I still going down? Or did I pass the bottom?

This is the foundation of **Gradient Descent** — coming next.