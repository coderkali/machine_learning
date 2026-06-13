# Linear Algebra Notes

---

## Topic 1 — Scalar

### What is it?
A single number. Nothing more.

### Examples
- 7, 3.14, -50, your age, temperature today

### In ML
| ML concept     | The scalar |
|----------------|------------|
| Learning rate  | 0.01       |
| Loss value     | 245.7      |
| Model accuracy | 0.94       |
| One prediction | 1 or 0     |

### Memory hook
(Write your own one sentence here)

---

## Topic 2 — Vector

### What is it?
An ordered list of numbers. Order matters.

### Example
Chai stall one day: [80, 200, 35, 5]
- 80 = cups sold
- 200 = profit
- 35 = temperature
- 5 = customers per hour

### Dimension
The size of a vector is called its dimension.
[80, 200, 35, 5] → 4-dimensional vector

### In ML
One row of your dataset = one vector.
One Iris flower = [5.1, 3.5, 1.4, 0.2] → 4-dimensional vector

### Memory hook
(Write your own one sentence here)

---

## Topic 3 — Matrix

### What is it?
Many vectors stacked together. A table of numbers — rows and columns.

### Example
Chai stall chain (5 stalls, 4 metrics each):

| Stall   | Cups | Profit | Temp | Customers/hr |
|---------|------|--------|------|---------------|
| Stall 1 | 80   | 200    | 35   | 5             |
| Stall 2 | 60   | 100    | 32   | 4             |
| Stall 3 | 100  | 300    | 38   | 6             |
| Stall 4 | 45   | 25     | 30   | 3             |
| Stall 5 | 90   | 250    | 36   | 5             |

Shape = (5, 4) → 5 rows, 4 columns

### In ML
The Iris dataset (150 rows, 4 columns) is a matrix.
df.shape returning (150, 4) = matrix shape.

### Key relationship
Scalar → single number
Vector → list of numbers (one row)
Matrix → many vectors stacked (many rows)

### Memory hook
(Write your own one sentence here)

---

## Topic 4 — Matrix Shape & Dimensions

### What is shape?
Shape = (rows, columns) for a table/matrix
Shape = (n,) for a plain list/vector — just n numbers in a line, no rows/columns

### The pairing rule
To pair a matrix with a vector:
The matrix's COLUMNS must match the vector's SIZE.
Rows do not matter for this check.

### Example
Matrix (5, 4)  — 5 stalls, 4 metrics each
Vector (4,)    — 4 importance values, one per metric
4 columns = 4 elements → compatible ✓

### In ML
Iris dataset matrix = (150, 4) — 150 flowers, 4 measurements
Weight vector = (4,) — one weight per measurement
4 = 4 → compatible ✓

This is why shape mismatch errors happen — when columns ≠ vector size.

### Memory hook
(Write your own one sentence here)

---

## Topic 5 — Dot Product

### What is it?
Multiply each pair of numbers from two vectors, then add up all results.

### Formula
a · b = a1*b1 + a2*b2 + a3*b3 + ... + an*bn

### Example — Chai stall score
Data:    [80, 200, 35, 5]
Weights: [2, 5, 0.5, 3]

(80*2) + (200*5) + (35*0.5) + (5*3)
= 160 + 1000 + 17.5 + 15
= 1192.5

### Small example
a = [3, 4], b = [2, 5]
a.b = 3*2 + 4*5 = 6 + 20 = 26

### In ML
This is the core operation inside every neuron.
y = w1*x1 + w2*x2 + w3*x3 + w4*x4 + b
The bracketed part is a dot product.

### Memory hook
(Write your own one sentence here)

---## Topic 5 — Dot Product

### What is it?
Multiply each pair of numbers from two vectors, then add up all results.

### Formula
a · b = a1*b1 + a2*b2 + a3*b3 + ... + an*bn

### Example — Chai stall score
Data:    [80, 200, 35, 5]
Weights: [2, 5, 0.5, 3]

(80*2) + (200*5) + (35*0.5) + (5*3)
= 160 + 1000 + 17.5 + 15
= 1192.5

### Small example
a = [3, 4], b = [2, 5]
a.b = 3*2 + 4*5 = 6 + 20 = 26

### In ML
This is the core operation inside every neuron.
y = w1*x1 + w2*x2 + w3*x3 + w4*x4 + b
The bracketed part is a dot product.

### Memory hook
(Write your own one sentence here)

---

## Topic 6 — Matrix Multiplication

### What is it?
Doing dot product once for every row of a matrix, against the same vector.

### Example — Chai stall scores (all 5 stalls)
Matrix (5,4) x Vector (4,) = Result (5,)

Stall 1: (80*2)+(200*5)+(35*0.5)+(5*3)  = 1192.5
Stall 2: (60*2)+(100*5)+(32*0.5)+(4*3)  = 648
Stall 3: ...
Stall 4: ...
Stall 5: ...

### Shape rule
(rows, cols) x (cols,) = (rows,)
Matrix columns must match vector size.
Result size = matrix rows.

### In ML
Iris dataset (150, 4) x weights (4,) = predictions (150,)
All 150 predictions calculated in ONE operation instead of a loop.
This is why ML libraries are fast.

### Memory hook
(Write your own one sentence here)

---

## Topic 6 — Matrix Multiplication

### What is it?
Doing dot product once for every row of a matrix, against the same weights vector.

### Chai stall example
Matrix (5,4) — 5 stalls, 4 metrics each
Weights (4,) — 4 importance values

Stall 1: (80*2)+(200*5)+(35*0.5)+(5*3)  = 1192.5
Stall 2: (60*2)+(100*5)+(32*0.5)+(4*3)  = 648
... (same for stalls 3, 4, 5)

Result shape (5,) — one score per stall

### Shape rule
(rows, cols) x (cols,) = (rows,)
Matrix columns must match vector size.
Result size = matrix rows.

### ML version — Iris dataset
Matrix (150, 4) — 150 flowers, 4 measurements each
Weights (4,) — one weight per measurement

For each flower: dot product of its 4 measurements with the 4 weights = 1 prediction
Doing this for all 150 flowers at once = matrix multiplication
Result shape (150,) — one prediction per flower

### Key idea
Same operation as dot product, just repeated for every row.
This is why ML libraries are fast — no loops, one operation for everything.

### Memory hook
(Write your own one sentence here)

---

## Topic 7 — Transpose

### What is it?
Flipping a matrix — rows become columns, columns become rows.
(rows, cols) becomes (cols, rows)

### Why it's needed
Sometimes data is written "sideways" and doesn't match the shape
needed for multiplication. Transpose fixes the shape without
changing the data.

### Example
Before transpose: (4, 5) — metrics as rows, stalls as columns
Weights vector: (4,)
Columns (5) != vector size (4) -> multiplication NOT possible

After transpose: (5, 4) — stalls as rows, metrics as columns
Columns (4) == vector size (4) -> multiplication possible

### Shape rule
(rows, cols) --transpose--> (cols, rows)
Example: (150, 4) --transpose--> (4, 150)

### In ML
X.T appears everywhere in ML code/formulas.
It exists purely to make shapes match for multiplication.

### Memory hook
(Write your own one sentence here)

---