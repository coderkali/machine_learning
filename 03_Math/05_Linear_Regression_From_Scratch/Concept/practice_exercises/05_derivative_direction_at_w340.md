# Phase 5 — Topic 07 — Using the Derivative to Guide Gradient Descent

---

## Recap — Rohan's Freelance Earnings (Messy Data)

| Hours Worked (x) | Earnings (₹) |
|---|---|
| 1 | 300 |
| 2 | 550 |
| 3 | 1000 |
| 4 | 1200 |
| 5 | 1800 |

Manually tested several w values (b = 0) and calculated Cost each time:

```
w = 0   → Cost = 6,072,500
w = 300 → Cost = 102,500
w = 320 → Cost = 56,500
w = 340 → Cost = 54,500   ← lowest found manually
w = 345 → Cost = 60,875
w = 360 → Cost = 96,500
w = 400 → Cost = 312,500
```

**Observation:** Cost drops, hits a low point near w = 340, then rises again on both sides.
Manual guessing works but doesn't scale — the derivative gives the exact direction and
rough distance to move, in a single calculation.

---

## The Cost Curve Is Shaped Like a Bowl 🥣

```
Cost
|  ╲                    ╱
|   ╲                  ╱
|    ╲                ╱
|     ╲              ╱
|      ╲            ╱
|       ╲__________╱
+---------------------------- w
     (left side)  (bottom)  (right side)
```

- **Left side** → w too small → Cost is high
- **Bottom** → best w → Cost is lowest
- **Right side** → w too big → Cost is high again

This matches the manual results:
```
w = 300 → 102,500  (left side, still high)
w = 340 → 54,500   (near the bottom)
w = 400 → 312,500  (right side, high again)
```

---

## What The Derivative Represents

The derivative = the **slope of the bowl at the exact point where you are standing** (your current w).

```
Cost
|  ╲                    ╱
|   ╲                  ╱
|    ╲                ╱
|     ╲       ●------╱   ← standing here (right side)
|      ╲     slope points UP
|       ╲   
|       ╲__________╱
+---------------------------- w
```

| Position on the bowl | Slope direction | Derivative sign |
|---|---|---|
| Left side | Points downward as w increases | Negative |
| Right side | Points upward as w increases | Positive |
| Bottom (best w) | Flat | Zero |

---

## Derivative Formula (with b = 0)

```
dCost/dw = -2 × Σ (x × error)
```

Where:
- `x` = input value (hours worked)
- `error` = (Real − Prediction) for that row
- `Σ` = sum across all rows
- The `-2` comes from differentiating the squared error term (covered in Phase 4)

---

## Worked Example — At w = 340

| Hours (x) | Error | x × Error |
|---|---|---|
| 1 | -40  | -40  |
| 2 | -130 | -260 |
| 3 | -20  | -60  |
| 4 | -160 | -640 |
| 5 | 100  | 500  |

```
Σ(x × error) = -40 - 260 - 60 - 640 + 500 = -500

dCost/dw = -2 × (-500) = +1000
```

**Result: derivative at w = 340 is +1000 (positive).**

---

## Interpreting a Positive Derivative

A positive derivative means: *"If w increases further, Cost will go UP."*
This only happens when standing on the **right side of the bowl** — meaning the
current w (340) is already slightly past the true minimum (slightly too high).

This matches the manual results, where w = 345 gave a *higher* cost (60,875) than
w = 340 (54,500) — confirming the true best w sits just **below** 340.

---

## The Weight Update Rule

```
New w = Old w − (Learning Rate × Derivative)
```

The **minus sign** is what makes this self-correcting:

- If derivative is **positive** → subtracting a positive number **decreases** w
  → pulls you back down toward the bottom of the bowl (from the right side)
- If derivative is **negative** → subtracting a negative number **increases** w
  → pushes you up toward the bottom of the bowl (from the left side)

Either way, the formula automatically moves w in the correct direction —
no manual guessing required.

---

## In My Own Words

*(To be filled in once fully understood — one line on what the derivative
tells us, and one line on why the minus sign in the update rule matters.)*

---

## Next Step

Pick a learning rate and compute the actual new w using the derivative
found at w = 340 (+1000), then repeat the process to converge toward the
true minimum.