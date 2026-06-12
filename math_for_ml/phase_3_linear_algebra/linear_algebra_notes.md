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