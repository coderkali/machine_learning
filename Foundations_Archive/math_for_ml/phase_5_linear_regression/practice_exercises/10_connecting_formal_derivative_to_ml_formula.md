# Practice Exercise 10 — Connecting the Formal Derivative Definition to Our ML Formula

---

## The Formal Definition (from first-principles calculus)

```
f'(x) = limit  [f(x+h) − f(x)] / h
        h→0
```

This says: nudge x by a tiny amount h, measure how much f(x) changes,
divide by h, then shrink h toward zero. This is the precise definition of
"slope at one exact point."

### Worked example: f(x) = x²

```
f'(x) = limit  (x+h)² − x²
        h→0    ──────────
                   h

     = limit  x² + 2xh + h² − x²
       h→0    ──────────────────
                     h

     = limit  2xh + h²
       h→0    ────────
                  h

     = limit  (2x + h)
       h→0

     = 2x     (as h shrinks to 0, the "+h" term disappears)
```

**General power rule that comes out of this:**
```
x^n  →  n × x^(n-1)
```
For x² (n=2): 2 × x^(2-1) = 2x ✓

---

## Connecting This to Our Cost Formula

Our Cost function has the same "squared" shape:
```
Cost = (error)² = (y − wx − b)²
```

Let `u = error` for a moment, so `Cost = u²`. By the power rule just derived:
```
d(Cost)/du = 2u
```

But we want the derivative with respect to **w**, not u. This needs the
**chain rule** (a direct extension of the power rule):

```
dCost/dw = d(Cost)/du  ×  du/dw
         = 2u          ×  du/dw
```

Since `u = y − wx − b`, and only the `wx` part contains w:
```
du/dw = -x
```

Putting it together:
```
dCost/dw = 2 × (y − wx − b) × (-x)
         = -2x × (y − wx − b)
         = -2x × error
```

**This matches our formula exactly**: `dCost/dw = -2 × Σ(x × error)` — just
derived formally with the power rule + chain rule, instead of the
numeric-nudge shortcut used earlier.

### Where the -2 Comes From (Now Properly Explained)

- The **2** comes from the power rule (x² → 2x) applied to the squared error
- The **-x** comes from the chain rule (differentiating what's inside the
  square, with respect to w)
- Multiplying: 2 × (-x) = -2x — this is where "-2 times x" in our formula
  comes from

---

## Raw Numerical Verification (No Formula Trusted Blindly)

To verify the formula isn't just symbol-matching, the derivative was
checked directly against the formal definition — nudging w by a tiny h and
measuring the real change in Cost, using Rohan's data (b = 0 case).

### Setup

| Hours (x) | Real (y) |
|---|---|
| 1 | 300  |
| 2 | 550  |
| 3 | 1000 |
| 4 | 1200 |
| 5 | 1800 |

At w = 340:

| Hours (x) | Prediction | Error | x × Error |
|---|---|---|---|
| 1 | 340  | -40  | -40  |
| 2 | 680  | -130 | -260 |
| 3 | 1020 | -20  | -60  |
| 4 | 1360 | -160 | -640 |
| 5 | 1700 | 100  | 500  |

```
Σ(x × error) = -500
Formula derivative = -2 × (-500) = +1000
```

### Raw Nudge Check (h = 0.0001)

```
Cost(340)       = 40² + 130² + 20² + 160² + 100² = 54,500.000000
Cost(340.0001)  = recalculated fresh from (y − (w+h)x)² for every row
                = 54,500.100001 (approx, computed directly, not estimated)

Numerical slope = (Cost(340.0001) − Cost(340)) / 0.0001
                ≈ 1000.0055
```

**Formula gives 1000, raw nudge calculation gives ≈1000.0055** — matching
closely. The tiny leftover (~0.0055) exists only because h is a small but
not infinitely small number; this remainder shrinks to zero as h shrinks
further, exactly matching the "limit as h→0" idea from the formal
definition.

### Important Note on Verification Process

An earlier attempt at this same check was done via rough mental
arithmetic and produced an incorrect intermediate number. The reliable way
to verify is to **actually recompute Cost(w) and Cost(w+h) fully** (every
row, every square, added up precisely) rather than approximate by hand —
which is why this was checked with an interactive calculator that
recomputes both values from scratch, live, for any chosen w and h.

---

## In My Own Words

*(To be filled in once fully understood — one line connecting the formal
limit definition to why our ML derivative formula has "-2 × x × error" in
it, and one line on why smaller h values give a more convincing check.)*