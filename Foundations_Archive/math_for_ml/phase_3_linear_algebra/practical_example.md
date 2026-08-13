---

## Practical Example — Iris Dataset (All 7 Topics Together)

### The setup
Iris dataset = 150 flowers, 4 measurements each
(sepal_length, sepal_width, petal_length, petal_width)

### Topic 1 — Scalar
A single measurement: 5.1 (sepal_length of flower 1) -> this is a scalar

### Topic 2 — Vector
One flower's full data: [5.1, 3.5, 1.4, 0.2] -> this is a vector (4,)

### Topic 3 — Matrix
All 150 flowers stacked together -> this is a matrix (150, 4)

### Topic 4 — Shape
Matrix shape = (150, 4) -> 150 rows, 4 columns
To multiply with a weights vector, vector must have shape (4,)

### Topic 5 — Dot Product
Imagine weights = [0.5, -0.3, 2.0, 1.5] (model decides these during training)

For flower 1 [5.1, 3.5, 1.4, 0.2]:
(5.1*0.5) + (3.5*-0.3) + (1.4*2.0) + (0.2*1.5)
= 2.55 + (-1.05) + 2.8 + 0.3
= 4.6

This single number (4.6) is the model's RAW SCORE for flower 1
(before deciding which species it is)

### Topic 6 — Matrix Multiplication
Doing the above dot product for ALL 150 flowers at once:
Matrix (150, 4) x Weights (4,) = Scores (150,)

One operation -> 150 raw scores, one per flower

### Topic 7 — Transpose
If the data was stored as (4, 150) — measurements as rows,
flowers as columns — transpose flips it to (150, 4) so it
matches the weights vector (4,) and multiplication becomes possible

### Full Picture
Scalar (1 number)
  -> Vector (1 flower = 4 numbers)
    -> Matrix (150 flowers = 150 vectors stacked)
      -> Shape check (150,4) needs (4,) to multiply
        -> Dot product (1 flower's score)
          -> Matrix multiplication (all 150 scores at once)
            -> Transpose (fix shape if data is sideways)

This entire chain is what happens INSIDE every Scikit-learn
.predict() call — just done in compiled, optimized code instead
of by hand.

---