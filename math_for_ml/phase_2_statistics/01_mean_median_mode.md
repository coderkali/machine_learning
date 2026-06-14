# Topic 01 — Mean, Median, Mode
Date:

---

## The Story
Cricket coach with 5 players. Team selector asks:
"How well did your team bat — give me ONE number?"

Scores: Rohit=45, Virat=80, Dhoni=55, Hardik=12, Bumrah=8

---

## MEAN

### What is it?
The average. Add everything up, divide by how many there are.

### Formula
x̄ = Σx / n

| Symbol | Meaning                        |
|--------|--------------------------------|
| x̄      | Mean (read: "x bar")           |
| Σ      | Sum of all values (add them up)|
| x      | Each individual value          |
| n      | Total count of values          |

### Calculation
Σx = 45 + 80 + 55 + 12 + 8 = 200
n  = 5
x̄  = 200 / 5 = 40

### ML Use
| Where            | How                                          |
|------------------|----------------------------------------------|
| Missing values   | Fill empty cells with column mean            |
| Feature scaling  | Subtract mean to center data at zero         |
| MSE loss         | Mean of all prediction errors squared        |

### Memory hook
(Write your own one sentence here)

---