# ML Learning Visual Website — Master Codex Prompt

I am learning Machine Learning from scratch.

This folder/repository is my personal ML learning workspace. It contains notebooks, Python files, Markdown notes, text files, datasets, examples, experiments, diagrams, and other learning materials that I create while studying.

I do NOT want to learn by opening every file individually and trying to remember what is inside each file.

I want you to maintain an evolving **visual ML Learning Website / Knowledge Roadmap** for this repository.

The website should visually show:

**What I have learned → how concepts are connected → where each concept is implemented → which file contains it → what I should understand from that file.**

The website must grow automatically as I continue learning.

---

# 1. FIRST — ANALYZE THE ENTIRE LEARNING FOLDER

Before modifying the website:

1. Recursively scan the complete repository/folder.
2. Identify all learning-related files.
3. Read and understand their contents where practical.
4. Determine:

   * What ML concept each file teaches
   * Which concepts are related
   * Which concepts are prerequisites for other concepts
   * Which files are theory
   * Which files contain implementation/code
   * Which files contain experiments
   * Which files contain datasets
   * Which files contain visualization
   * Which files contain exercises/examples

Do NOT classify files purely from their filenames.

Understand the actual content.

Ignore generated/build/system folders such as:

* `.git`
* `.idea`
* `.vscode`
* `node_modules`
* build folders
* cache folders
* Python virtual environments
* `__pycache__`

unless something inside them is explicitly part of my learning material.

---

# 2. BUILD AN ML KNOWLEDGE TREE

The main page should look like an interactive **Machine Learning Roadmap / Knowledge Tree**.

For example:

Machine Learning
│
├── ML Foundations
│   ├── What is Machine Learning?
│   ├── Features and Labels
│   ├── Training Data
│   ├── Testing Data
│   └── Train/Test Split
│
├── Data Preparation
│   ├── Missing Values
│   ├── Categorical Data
│   ├── Encoding
│   ├── Feature Scaling
│   └── Feature Engineering
│
├── Supervised Learning
│   │
│   ├── Regression
│   │   ├── Linear Regression
│   │   ├── Multiple Linear Regression
│   │   └── Evaluation Metrics
│   │
│   └── Classification
│       ├── Logistic Regression
│       ├── Decision Trees
│       └── Classification Metrics
│
├── Unsupervised Learning
│   ├── Clustering
│   └── Dimensionality Reduction
│
├── Model Evaluation
│   ├── Accuracy
│   ├── Precision
│   ├── Recall
│   ├── F1 Score
│   ├── Confusion Matrix
│   ├── MAE
│   ├── MSE
│   └── RMSE
│
└── Advanced Concepts
└── Add concepts here only when I actually learn them.

This is only an example structure.

Do NOT pretend I have learned something simply because it belongs in a standard ML curriculum.

The roadmap must primarily represent **what actually exists in my learning repository**.

---

# 3. THE ROADMAP MUST GROW OVER TIME

This is extremely important.

Today I may learn:

Machine Learning
└── Supervised Learning
└── Regression
└── Linear Regression

Tomorrow I might add notes about:

* Mean Squared Error
* RMSE
* R²
* Gradient Descent

When I ask you to update the learning website tomorrow, DO NOT rebuild everything randomly.

Instead update the existing tree:

Machine Learning
└── Supervised Learning
└── Regression
├── Linear Regression
│
├── Model Evaluation
│   ├── MSE
│   ├── RMSE
│   └── R²
│
└── Optimization
└── Gradient Descent

Preserve all previously learned concepts.

Add new concepts into the **correct existing branch**.

Create a new branch only when the concept genuinely requires one.

The website should become my long-term ML knowledge map.

---

# 4. EVERY CONCEPT NEEDS A VISUAL LEARNING CARD

When I click a concept in the roadmap, open a detailed concept panel/card.

Each concept should contain sections such as:

## What is it?

Explain the concept using simple language first.

Assume I am learning the concept for the first time.

---

## Why do we need it?

Explain what problem the concept solves.

---

## Simple intuition

Explain it using a relatable example.

Examples could involve:

* House-price prediction
* Employee salary
* Weather
* Customer purchases
* Spam email
* Credit-card transactions
* Product recommendations

Choose the example that best matches the concept.

---

## How it works

Explain the process step-by-step.

Avoid giant paragraphs.

Use:

* numbered steps
* small diagrams
* arrows
* flows
* tables
* formulas
* visual blocks

whenever they improve understanding.

---

## Visual Explanation

Visualization is extremely important.

Whenever possible show things visually.

For example, Linear Regression should visually explain something similar to:

Data Points

●       ●
●
●
●

Best Fit Line

●
●
●
---------/
●
●

But create a clean web visualization instead of ASCII where practical.

Other examples:

Train/Test Split:

Dataset
↓
──────────────
│ Training   │ 80%
──────────────
│ Testing    │ 20%
──────────────

Classification:

Input
↓
Model
↓
Probability
↓
Class

ML Pipeline:

Raw Data
↓
Cleaning
↓
Feature Engineering
↓
Train Model
↓
Evaluate
↓
Prediction

Use diagrams, mini charts, flow diagrams, comparisons, decision trees, timelines, or interactive illustrations when appropriate.

Do not add meaningless decoration.

Every visualization should help me understand the concept.

---

# 5. SEGREGATION / SECTIONING IS VERY IMPORTANT

Do NOT create one giant webpage containing long blocks of text.

Information must be properly segregated.

Use clear categories and visual hierarchy.

For example:

[Concept]

Overview

Why it matters

Intuition

How it works

Formula

Visualization

Example

Code

Files

Related concepts

Common mistakes

Quick revision

The user should immediately understand which part they are currently reading.

---

# 6. MAP EVERY CONCEPT TO MY ACTUAL FILES

This is one of the most important requirements.

Every concept should clearly show:

### Related Learning Files

Example:

`01_ml_basics.ipynb`
Purpose: Introduction to ML concepts.

`02_train_test_split.ipynb`
Purpose: Demonstrates splitting data into training and testing sets.

`linear_regression.py`
Purpose: Implements a simple Linear Regression model using scikit-learn.

`linear_regression_notes.md`
Purpose: Theory and formulas for Linear Regression.

Do not simply list filenames.

For every relevant file explain:

* File name
* Relative path
* File type
* What concept it teaches
* Why the file exists
* Important functions/classes/sections inside it
* Whether it contains theory, code, experiment, data, or visualization

If possible, clicking the file should reveal additional details.

---

# 7. SHOW RELATIONSHIPS BETWEEN CONCEPTS

I want to understand WHY concepts are connected.

For every concept show things such as:

### Prerequisites

Example:

Linear Regression requires understanding:

→ Features
→ Labels
→ Training Data
→ Train/Test Split

### Leads To

Linear Regression

↓

Loss Function

↓

Optimization

↓

Gradient Descent

### Related Concepts

Linear Regression ↔ Regression Metrics

Linear Regression ↔ Feature Scaling

Linear Regression ↔ Polynomial Regression

Only show relationships that actually make conceptual sense.

---

# 8. USE PROPER VISUAL STATUS INDICATORS

Visually differentiate concept types.

For example:

✓ Learned

◐ Currently Learning

○ Upcoming / referenced but not learned

Also distinguish:

📘 Theory

💻 Code

📊 Visualization

🧪 Experiment

📁 Dataset

📝 Notes

Do not mark a topic as learned unless evidence exists in my repository.

---

# 9. PROVIDE QUICK REVISION

Every concept should contain a compact revision section.

Example:

### Linear Regression — 30 Second Revision

**Purpose:** Predict a continuous value.

**Input:** Features X

**Output:** Numeric prediction y

**Core idea:** Find the best-fitting line.

**Typical formula:**

y = mx + b

**Common metrics:**

MAE
MSE
RMSE
R²

**Library:**

`sklearn.linear_model.LinearRegression`

This section should be useful when I return after several weeks and want to revise quickly.

---

# 10. SHOW CODE WITHOUT OVERWHELMING ME

If a source file contains code, do NOT dump the complete file into the webpage.

Extract only the important learning pieces.

Example:

```python
model = LinearRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)
```

Then explain:

1. `LinearRegression()` creates the model.
2. `fit()` teaches the model from training data.
3. `predict()` generates predictions.

Provide a link/reference to the full original file.

---

# 11. EXPLAIN FORMULAS VISUALLY

Do not simply display mathematical formulas.

For every important formula explain each variable.

For example:

y = mx + b

Where:

y → predicted value

m → slope

x → input feature

b → intercept

Then give one tiny numeric example.

Whenever possible connect the formula to a visualization.

---

# 12. ADD COMPARISON SECTIONS WHEN USEFUL

When concepts are easy to confuse, create visual comparisons.

Examples:

Training Data vs Testing Data

Regression vs Classification

MAE vs MSE vs RMSE

Supervised vs Unsupervised Learning

Feature vs Label

Overfitting vs Underfitting

Use concise comparison tables/cards.

---

# 13. ADD “COMMON CONFUSIONS”

For each major concept, include:

### Common Confusions

Examples:

* Why do we need test data?
* Why can't we train using all data?
* Difference between `fit()` and `predict()`
* Difference between a feature and a label
* Why MSE squares the error
* Difference between correlation and regression

Only add relevant questions.

---

# 14. INCLUDE SEARCH AND NAVIGATION

The website should support:

* Search by concept
* Search by filename
* Expand/collapse roadmap branches
* Clickable concepts
* Breadcrumb navigation

Example:

Machine Learning
→ Supervised Learning
→ Regression
→ Linear Regression

Also provide a way to navigate back to the roadmap quickly.

---

# 15. HOME PAGE

The home page should immediately show a useful overview such as:

## My ML Learning Journey

Concepts Learned: 18

Currently Learning: 3

Notebooks: 12

Python Files: 8

Experiments: 6

Datasets: 4

Last Updated: <date>

Then display the main visual roadmap.

Also show:

### Recently Learned

Display the newest concepts discovered during the latest update.

---

# 16. LEARNING PROGRESS

Provide a visual progress section.

But calculate progress based on MY repository rather than claiming arbitrary percentages of “all machine learning.”

For example:

ML Foundations      ████████

Data Preparation    ██████

Regression          ████████

Classification      ███

Model Evaluation    █████

It should represent repository learning coverage, not an official ML curriculum completion percentage.

---

# 17. DAILY UPDATE BEHAVIOR

Whenever this repository already contains the website and I ask you to update it:

FIRST:

1. Inspect the existing website.
2. Inspect the existing learning-map/metadata.
3. Scan the repository for new or modified learning files.
4. Determine what changed since the previous version.

THEN:

5. Identify newly learned concepts.
6. Identify updated concepts.
7. Determine where each concept belongs in the existing roadmap.
8. Update only the appropriate branches.
9. Update file mappings.
10. Update related-concept links.
11. Add visualizations when appropriate.
12. Update learning statistics.
13. Update “Recently Learned.”
14. Update the last-updated date.

Do NOT delete old learning information unless:

* The original file was removed, OR
* The information is clearly incorrect, OR
* A newer note explicitly replaces it.

Do NOT duplicate concepts just because another file also discusses them.

Instead attach the new file to the existing concept.

---

# 18. MAINTAIN STRUCTURED LEARNING METADATA

Do not hard-code all learning information directly into giant HTML sections if it makes maintenance difficult.

Prefer maintaining structured data such as:

`learning-map.json`

or an equivalent structure.

For example:

```json
{
  "concept": "Linear Regression",
  "category": "Supervised Learning",
  "status": "learned",
  "files": [],
  "prerequisites": [],
  "relatedConcepts": [],
  "summary": "",
  "intuition": "",
  "examples": [],
  "lastUpdated": ""
}
```

The UI should render the learning roadmap from this structured data where practical.

This will make future updates safer and easier.

---

# 19. WEBSITE TECHNICAL REQUIREMENTS

Prefer a simple maintainable static website.

Recommended structure:

```text
ml-learning/
│
├── index.html
├── styles.css
├── app.js
├── learning-map.json
│
├── notebooks/
├── notes/
├── examples/
├── datasets/
└── ...
```

If an existing structure already exists, work with it instead of unnecessarily restructuring my repository.

The website should be:

* Responsive
* Easy to read on desktop
* Usable on mobile
* Fast
* Visually clean
* Interactive
* Maintainable
* Hostable as a static website

Avoid unnecessary frameworks unless the existing project already uses one.

---

# 20. VISUAL DESIGN PRINCIPLES

Prioritize:

1. Knowledge hierarchy
2. Concept relationships
3. Visualization
4. Readability
5. Proper content segregation
6. File traceability
7. Easy revision

Avoid:

* Huge paragraphs
* Excessive animation
* Decorative graphics without educational value
* Too many unrelated colors
* Repeating the same information
* Huge code dumps
* Giant flat lists
* Showing every ML concept in existence regardless of what I learned

---

# 21. DO NOT JUST COPY MY NOTES

My notes may be:

* incomplete
* informal
* repetitive
* badly formatted
* shorthand
* copied from experiments

Use them as the source for determining what I learned.

Then reorganize the knowledge into a clean learning experience.

Do NOT silently introduce advanced concepts and mark them as learned merely to make the website look complete.

You may mention related future concepts, but clearly mark them as:

**Referenced / Not Learned Yet**

---

# 22. PRESERVE SOURCE TRACEABILITY

I should always be able to answer:

“Where did this information come from?”

For every major learning section, maintain references to the corresponding source files.

For example:

Linear Regression

Learned From:

→ `notebooks/06_linear_regression.ipynb`

→ `notes/regression_notes.md`

→ `examples/house_price_prediction.py`

---

# 23. CREATE A CHANGE SUMMARY AFTER EVERY UPDATE

After updating the website, tell me exactly what changed.

Use a summary such as:

### Learning Website Updated

New concepts added:

* Linear Regression
* Mean Squared Error
* RMSE

Existing concepts updated:

* Train/Test Split

New relationships:

* Linear Regression → MSE
* MSE → RMSE

Files mapped:

* `linear_regression.ipynb`
* `regression_metrics.ipynb`

Visualizations added:

* Best-fit-line visualization
* Error visualization

Roadmap branch updated:

Machine Learning
→ Supervised Learning
→ Regression
→ Linear Regression
→ Model Evaluation

Also mention any file that you could not confidently categorize.

---

# 24. IMPORTANT OPERATING RULE

Every time I give you this instruction:

**“Update my ML learning website from today's learning.”**

Treat it as an incremental update.

Do NOT start from scratch.

Scan the new learning material, understand it, and merge it into the existing knowledge tree.

The website should continuously evolve:

Day 1
→ fundamentals

Day 2
→ fundamentals + preprocessing

Day 3
→ preprocessing + regression

Day 10
→ complete connected learning tree

Day 30
→ detailed personal ML knowledge system

The final result should feel less like documentation and more like an **interactive visual map of everything I personally learned about Machine Learning**.

---

# 25. STARTING TASK

Now perform the following:

1. Analyze the complete current repository.
2. Identify everything I have learned so far.
3. Group related learning logically.
4. Create or update the structured learning map.
5. Create or update the interactive visual website.
6. Add meaningful visual explanations.
7. Map every concept to its source files.
8. Ensure proper segregation of information.
9. Make the roadmap expandable and easy to navigate.
10. Verify that the website works locally.
11. Preserve the architecture so tomorrow's learning can be added incrementally.
12. Give me a concise summary of what you created or changed.

Do not stop after creating a roadmap outline.

Actually implement/update the website files in this repository.
