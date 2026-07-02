# Phase 5 — Topic 04 — Finding w and b

---

## The Key Insight — Two Ways To Find w

There are two ways to find w depending on the data.

---

## Way 1 — When Data Is PERFECT (Clean Data)

When all points sit perfectly on a straight line —
you can find w directly using the slope formula.

### Example — Meera's Electricity Data

| AC Hours (x) | Monthly Bill (y) |
|--------------|-----------------|
| 1            | ₹600            |
| 2            | ₹1100           |
| 3            | ₹1600           |
| 4            | ₹2100           |
| 5            | ₹2600           |

Pick any two points:
- Point A = (1, 600)
- Point B = (2, 1100)

```
Rise = 1100 − 600 = 500
Run  = 2 − 1      = 1
w    = Rise ÷ Run = 500 ÷ 1 = 500
```

**w = 500** → every 1 hour of AC adds ₹500 to the bill ✅

Done in 3 steps. No Gradient Descent needed.
This works because every hour adds EXACTLY ₹500 — perfectly clean data.

---

## Way 2 — When Data Is MESSY (Real World)

When points do NOT sit perfectly on a line —
slope formula gives DIFFERENT answers depending on which two points you pick!

### Example — Messy Real World Data

| AC Hours | Bill  |
|----------|-------|
| 1        | ₹580  |
| 2        | ₹1050 |
| 3        | ₹1700 |
| 4        | ₹2050 |

Slope using points 1 and 2:
```
(1050 − 580) ÷ (2 − 1) = 470
```

Slope using points 2 and 3:
```
(1700 − 1050) ÷ (3 − 2) = 650
```

Slope using points 3 and 4:
```
(2050 − 1700) ÷ (4 − 3) = 350
```

Three different answers — 470, 650, 350.
Which one is correct? NONE of them alone is correct.

This is where Gradient Descent comes in.
It tries thousands of w values and finds the ONE w
that gives minimum error across ALL points together.

---

## The Simple Rule

| Data Type | How To Find w |
|-----------|---------------|
| Perfect clean data | Use slope formula directly |
| Messy real world data | Use Gradient Descent |

---

## Think Of It Like This

Slope formula = measuring a straight road.
Easy — one measurement gives the answer.

Gradient Descent = finding the best path through a forest.
Messy terrain — needs many steps to find the best route.

---

## The Important Point

w is ALWAYS the slope of the best line —
whether you find it by formula or by Gradient Descent.

The concept is exactly the same. Only the method changes.

---

## How To Find b (After Finding w)

Once w is found — finding b is simple.

Take ANY one known data point and plug it into the formula:

```
y = wx + b
```

Solve for b.

### Example — Meera's Data, w = 500

Use point (1, 600):

```
600 = 500 × 1 + b
600 = 500 + b
b   = 600 − 500
b   = 100
```

**b = 100** → even at 0 hours AC, base bill is ₹100 ✅

### Verify With Another Point

Use point (2, 1100):

```
500 × 2 + 100 = 1000 + 100 = 1100 ✅
```

Matches perfectly!

---

## What b Means In Real Life

b = the starting value when x = 0.

| Situation | What b Means |
|-----------|--------------|
| b = 0 | No base cost — zero usage means zero bill |
| b = 100 | Fixed monthly charge exists even at zero usage |
| b = 50 | Base cab fare before any distance is traveled |

---

## The Full Process — Finding w and b

```
Step 1 → Find w
         Clean data   → use slope formula (Rise ÷ Run)
         Messy data   → use Gradient Descent

Step 2 → Find b
         Take one known point (x, y)
         Plug into y = wx + b
         Solve for b

Step 3 → Write the final formula
         y = wx + b (with actual numbers)

Step 4 → Predict anything! ✅
```

### Example — Meera's Final Formula

```
w = 500
b = 100

Bill = 500 × hours + 100
```

Predict for 3.5 hours:
```
Bill = 500 × 3.5 + 100
     = 1750 + 100
     = ₹1850 ✅
```

---

## In My Own Words

w is the slope — how fast the bill changes per hour.
b is the starting value — the bill even before any AC is used.

When data is clean, w can be found directly using the slope formula.
When data is messy, Gradient Descent finds the best w
by trying thousands of values and finding the one with minimum error.

Once w is known, b is found by plugging any known point
into the formula y = wx + b and solving.

Together w and b define the best line — and that line
can predict any value we have never seen before.