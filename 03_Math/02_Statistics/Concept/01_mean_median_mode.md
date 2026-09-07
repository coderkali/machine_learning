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


## MEDIAN

### What is it?
The middle value when data is sorted from smallest to largest.
Not affected by extreme values (outliers).

### Steps
1. Sort values from smallest to largest
2. Pick the middle value

### Calculation
Original scores: 45, 80, 55, 12, 8
Sorted:          8, 12, 45, 55, 80
Middle value:    45 (3rd out of 5)

Median = 45

### Mean vs Median
| Measure | Value | Affected by outliers? |
|---------|-------|----------------------|
| Mean    | 40    | Yes — pulled down by 8 and 12 |
| Median  | 45    | No — ignores how extreme they are |

### Real life example
5 salaries: 20k, 25k, 22k, 24k, 5,00,000
Mean = pulled way up by CEO salary = misleading
Median = true middle salary = realistic picture
This is why news uses "median household income" not mean.

### ML Use
| Where                        | How                                     |
|------------------------------|-----------------------------------------|
| Missing values with outliers | Fill with median — safer than mean      |
| Skew detection               | If mean != median, data is skewed       |

### Memory hook
(Write your own one sentence here)

---

## MODE

### What is it?
The value that appears most frequently in the data.

### Important cases
| Situation              | Name      | Example                          |
|------------------------|-----------|----------------------------------|
| One value appears most | Unimodal  | mode = 45 (appears 3 times)      |
| Two values tie         | Bimodal   | 45 and 80 both appear 3 times    |
| All values unique      | No mode   | 45, 80, 55, 12, 8 — no repeats  |

### Calculation
Scores across 3 matches: 12, 45, 80, 45, 55, 8, 45, 12, 80

| Score | Count |
|-------|-------|
| 8     | 1x    |
| 12    | 2x    |
| 45    | 3x  <- MODE  |
| 55    | 1x    |
| 80    | 2x    |

Mode = 45

### Real life connection
Iris petal length histogram had TWO peaks — one for Setosa,
one for other species. That was a bimodal distribution.
Now you know the formal name for what you saw.

### ML Use
| Where                       | How                                        |
|-----------------------------|--------------------------------------------|
| Missing categorical values  | Fill missing "City" column with most common value |
| Class imbalance detection   | Mode reveals dominant class in labels      |

### Memory hook
(Write your own one sentence here)

---

## SUMMARY — Mean vs Median vs Mode

| Measure | What it finds      | Affected by outliers? | Best used when                  |
|---------|--------------------|-----------------------|---------------------------------|
| Mean    | Average value      | Yes                   | Data is clean, no extreme values|
| Median  | Middle value       | No                    | Data has outliers               |
| Mode    | Most common value  | No                    | Categorical data, finding peaks |

---

### Q3 — Missing value imputation (ML thinking)
Location column: Mumbai, Delhi, Mumbai, Bangalore, Mumbai, Delhi, Mumbai

1. Use MODE — finds most common value
2. Mode = Mumbai (appears 4 times)
3. Mean and Median only work on numbers.
   Location is text/categorical — cannot add or sort words.
   Mode works on both numbers AND text.

ML connection:
This technique is called categorical imputation.
Scikit-learn: SimpleImputer(strategy='most_frequent')
does exactly this automatically.