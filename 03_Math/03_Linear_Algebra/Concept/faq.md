# Linear Algebra — FAQ

---

### Q: What is the difference between a vector and a matrix?
A vector is one row of numbers (one flower's data).
A matrix is many vectors stacked together (the whole dataset).

---

### Q: What does shape (150, 4) mean?
150 rows (samples/flowers), 4 columns (features/measurements).
First number = rows, second number = columns.

---

### Q: What does (4,) mean — why the comma?
It means a plain list of 4 numbers, no rows/columns structure.
The comma is just notation saying "this is 1-dimensional."

---

### Q: When can a matrix and vector be multiplied?
Matrix COLUMNS must equal vector SIZE.
(150, 4) and (4,) -> works, because 4 = 4
(150, 4) and (150,) -> does NOT work, because 4 != 150

---

### Q: What is a dot product, in one line?
Multiply matching elements from two vectors, then add up all results
to get ONE number.

---

### Q: What is matrix multiplication, in one line?
The dot product, done once for every row of a matrix.
Result = one number per row.

---

### Q: Why do we need transpose?
To flip a matrix's rows and columns when the shape doesn't match
what's needed for multiplication. Same data, different arrangement.
(150, 4) transposed becomes (4, 150).

---

### Q: Where do the "weight" numbers come from in real ML?
NOT from a human deciding them. The model starts with random
weights and adjusts them automatically during training
(Gradient Descent - Phase 4) until predictions become accurate.

---

### Q: What's the one-sentence summary connecting everything?
Your dataset is a matrix. The model has a weights vector.
Dot product (repeated for every row = matrix multiplication)
combines them into predictions. Transpose just fixes shapes
when needed.

---