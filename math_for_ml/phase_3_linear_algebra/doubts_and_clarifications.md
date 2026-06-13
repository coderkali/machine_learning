# Doubts & Clarifications — Linear Algebra

---

## Q: Where do the "weight" values come from in a vector?

In the chai stall example, the human (stall owner) decides
the importance values themselves, based on judgment.
Example: profit = 5, temperature = 0.5 — these are just opinions,
no fixed scale (could be 1-10, 1-100, decimals, anything).

In ML, weights are NOT decided by a human.
The model starts with random values and LEARNS the correct
weights automatically by looking at thousands of examples and
adjusting itself over time (this process is called training).

| | Chai stall story | ML world |
|--|------------------|----------|
| Who decides weights? | Human, by guessing | Model, automatically |
| How? | Opinion/judgment | Gradient Descent (Phase 4) |
| Fixed? | Yes, set once | No, keeps updating during training |

**Key separation to remember:**
- HOW to combine data + weights → dot product / matrix multiplication (learning now)
- HOW weights get their correct values → Gradient Descent (Phase 4, later)

---