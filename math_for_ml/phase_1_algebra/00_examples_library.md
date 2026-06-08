# Examples Library — Math for ML
This file contains all real life examples used during learning.
Each example shows the problem, formula, and solution.

---

## Example 01 — Chai Stall (Topic 01: Variables & Expressions)
**Story:** Chai stall profit depends on cups sold. Setup cost is fixed.

**Formula:** P = 5c - 200

| Symbol | Type        | Meaning              |
|--------|-------------|----------------------|
| P      | Variable    | Profit — the output  |
| c      | Variable    | Cups sold — input    |
| 5      | Coefficient | Profit per cup       |
| 200    | Constant    | Daily setup cost     |

**Substitution:**
- c = 10 → P = 5*10 - 200 = -150 (loss)
- c = 40 → P = 5*40 - 200 = 0 (break even)
- c = 80 → P = 5*80 - 200 = 200 (profit)
- c = 100 → P = 5*100 - 200 = 300 (great day)

**ML Connection:** Same shape as y = wx + b (linear regression)

---

## Example 02 — Rival Chai Stall (Topic 01: Solving for x)
**Problem:** Find break even point when P = 8c - 400

**Working:**
Step 1: Set P = 0
0 = 8c - 400
Step 2: Add 400 to both sides
400 = 8c
Step 3: Divide both sides by 8
c = 50

**Result:** Need to sell 50 cups to break even

---

## Example 03 — Food Budget (Topic 01: Real life y = wx + b)
**Story:** Monthly food spend depends on how many times eating outside.

**Formula:** y = 60x + b

| Symbol | Meaning                        |
|--------|--------------------------------|
| x      | Number of times eating outside |
| 60     | Cost per meal                  |
| b      | Fixed food cost (groceries)    |
| y      | Total food spend               |

**Substitution:**
- x = 5 → y = 60*5 + b = 300 + b

---

## Example 04 — Movie Theatre (Topic 01: Mixed practice)
**Formula:** P = 12t - 300

| Symbol | Type        | Meaning            |
|--------|-------------|--------------------|
| t      | Variable    | Tickets sold       |
| 12     | Coefficient | Profit per ticket  |
| 300    | Constant    | Daily setup cost   |

**Break even:**
Step 1: Set P = 0
0 = 12t - 300
Step 2: Add 300 to both sides
300 = 12t
Step 3: Divide both sides by 12
t = 25

**Result:** Need to sell 25 tickets to break even

---

## Example 05 — Linear vs Non-linear (Topic 02: Functions & Graphs)
**Story:** Two chai stall owners with different formulas.

| Owner | Formula       | Shape         | Growth       |
|-------|---------------|---------------|--------------|
| A     | y = 10x + 50  | Straight line | Steady       |
| B     | y = 10x² + 50 | U curve       | Accelerating |

**Rule:** x¹ = linear = straight line. x² or higher = non-linear = curve.

---

## Example 06 — Farmer & Wheat (Topic 02: Where y=wx+b comes from)
**Story:** Farmer notices consistent pattern between fertiliser and wheat yield.

| Fertiliser bags (x) | Wheat kg (y) |
|---------------------|--------------|
| 2                   | 50           |
| 4                   | 90           |
| 6                   | 130          |

**Pattern discovered:** Every +2 bags gives +40kg wheat
Ratio = 40/2 = 20 → this is w

**Formula found:** y = 20x + 10

**Verification:**
- x=2 → 20*2 + 10 = 50 ✓
- x=4 → 20*4 + 10 = 90 ✓
- x=6 → 20*6 + 10 = 130 ✓

**Prediction:** x=10 → 20*10 + 10 = 210kg

**Why w and b exist:**
- w = how much y changes per unit of x (the ratio)
- b = baseline value when x = 0

**ML Connection:** This is exactly what Linear Regression does —
finds w and b automatically from thousands of rows of data.

---