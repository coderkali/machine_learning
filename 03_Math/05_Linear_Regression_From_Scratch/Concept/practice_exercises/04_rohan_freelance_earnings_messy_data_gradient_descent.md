# Practice Exercise 04 — Rohan's Freelance Earnings (Messy Data → Gradient Descent)

---

## The Problem

Rohan tracks his freelance earnings based on hours worked per day:

| Hours Worked (x) | Earnings (₹) |
|---|---|
| 1 | 300 |
| 2 | 550 |
| 3 | 1000 |
| 4 | 1200 |
| 5 | 1800 |

---

## Step 1 — Check If Data Is Clean or Messy

Slope between every consecutive pair of points:

```
1hr → 2hr: (550 - 300) / (2 - 1)   = 250
2hr → 3hr: (1000 - 550) / (3 - 2)  = 450
3hr → 4hr: (1200 - 1000) / (4 - 3) = 200
4hr → 5hr: (1800 - 1200) / (5 - 4) = 600
```

**All four slopes are different → this is MESSY data → Gradient Descent is needed.**

---

## Step 2 — Start Gradient Descent: w = 0, b = 0

| Hours | Prediction | Real Earning | Error (Real − Prediction) |
|---|---|---|---|
| 1 | 0 | 300  | 300  |
| 2 | 0 | 550  | 550  |
| 3 | 0 | 1000 | 1000 |
| 4 | 0 | 1200 | 1200 |
| 5 | 0 | 1800 | 1800 |

---

## Step 3 — Calculate Cost at w = 0

```
Cost = (300)² + (550)² + (1000)² + (1200)² + (1800)²
     = 90,000 + 302,500 + 1,000,000 + 1,440,000 + 3,240,000
     = 6,072,500
```

**Cost at w = 0 → 6,072,500** (terrible — huge errors)

---

## Step 4 — Try w = 300, b = 0

| Hours | Prediction | Real | Error | Error² |
|---|---|---|---|---|
| 1 | 300  | 300  | 0    | 0       |
| 2 | 600  | 550  | -50  | 2,500   |
| 3 | 900  | 1000 | 100  | 10,000  |
| 4 | 1200 | 1200 | 0    | 0       |
| 5 | 1500 | 1800 | 300  | 90,000  |

```
Cost = 0 + 2,500 + 10,000 + 0 + 90,000 = 102,500
```

**Cost at w = 300 → 102,500** ↓ massive drop from w = 0

---

## Step 5 — Try w = 320, b = 0

| Hours | Prediction | Real | Error | Error² |
|---|---|---|---|---|
| 1 | 320 | 300  | -20 | 400    |
| 2 | 640 | 550  | -90 | 8,100  |
| 3 | 960 | 1000 | 40  | 1,600  |
| 4 | 1280| 1200 | -80 | 6,400  |
| 5 | 1600| 1800 | 200 | 40,000 |

```
Cost = 400 + 8,100 + 1,600 + 6,400 + 40,000 = 56,500
```

**Cost at w = 320 → 56,500** ↓ still dropping

---

## Step 6 — Try w = 340, b = 0

| Hours | Prediction | Real | Error | Error² |
|---|---|---|---|---|
| 1 | 340  | 300  | -40  | 1,600  |
| 2 | 680  | 550  | -130 | 16,900 |
| 3 | 1020 | 1000 | -20  | 400    |
| 4 | 1360 | 1200 | -160 | 25,600 |
| 5 | 1700 | 1800 | 100  | 10,000 |

```
Cost = 1,600 + 16,900 + 400 + 25,600 + 10,000 = 54,500
```

**Cost at w = 340 → 54,500** ← lowest found so far

---

## Step 7 — Try w = 360, b = 0 (testing the other direction)

| Hours | Prediction | Real | Error | Error² |
|---|---|---|---|---|
| 1 | 360  | 300  | -60  | 3,600  |
| 2 | 720  | 550  | -170 | 28,900 |
| 3 | 1080 | 1000 | -80  | 6,400  |
| 4 | 1440 | 1200 | -240 | 57,600 |
| 5 | 1800 | 1800 | 0    | 0      |

```
Cost = 3,600 + 28,900 + 6,400 + 57,600 + 0 = 96,500
```

**Cost at w = 360 → 96,500** ↑ went back up!

---

## Step 8 — Try w = 400, b = 0 (confirming overshoot)

| Hours | Prediction | Real | Error | Error² |
|---|---|---|---|---|
| 1 | 400  | 300  | -100 | 10,000  |
| 2 | 800  | 550  | -250 | 62,500  |
| 3 | 1200 | 1000 | -200 | 40,000  |
| 4 | 1600 | 1200 | -400 | 160,000 |
| 5 | 2000 | 1800 | -200 | 40,000  |

```
Cost = 10,000 + 62,500 + 40,000 + 160,000 + 40,000 = 312,500
```

**Cost at w = 400 → 312,500** ↑ much higher — confirms 400 overshot the minimum

---

## Step 9 — Try w = 345, b = 0 (narrowing in)

| Hours | Prediction | Real | Error | Error² |
|---|---|---|---|---|
| 1 | 345  | 300  | -45  | 2,025  |
| 2 | 690  | 550  | -140 | 19,600 |
| 3 | 1035 | 1000 | -35  | 1,225  |
| 4 | 1380 | 1200 | -180 | 32,400 |
| 5 | 1725 | 1800 | 75   | 5,625  |

```
Cost = 2,025 + 19,600 + 1,225 + 32,400 + 5,625 = 60,875
```

**Cost at w = 345 → 60,875** ↑ higher than w = 340

---

## Summary of All Trials

```
w = 0   → Cost = 6,072,500
w = 300 → Cost = 102,500
w = 320 → Cost = 56,500
w = 340 → Cost = 54,500    ← lowest found manually
w = 345 → Cost = 60,875
w = 360 → Cost = 96,500
w = 400 → Cost = 312,500
```

The cost drops, reaches a low point close to w = 340, then rises on both sides —
the classic "bowl" shape of a cost curve. The true best w sits somewhere just
below 340, based on how w = 345 already increased the cost.

---

## In My Own Words

When data is messy, every pair of points gives a different slope, so a single
slope formula can't work. Testing different w values and tracking the Cost
shows a clear pattern: Cost falls, hits bottom, then rises again. Manually
testing values works but is slow and imprecise — this sets up the need for
using the derivative to find the exact minimum instead of guessing.