# Topic 03 — Probability Basics
Date:

---

## The Story
India vs Australia cricket match. Before it starts your friend asks:
"Do you think India will win?"
You say: "70% chance India wins."

You haven't watched a single ball — but you converted everything
you knew (form, ground, history) into ONE number between 0 and 1.
That number is called PROBABILITY.

---

## What is Probability?

A number between 0 and 1 that measures how likely something is.

| Value | Meaning                        |
|-------|--------------------------------|
| 0     | Impossible — will NOT happen   |
| 0.5   | 50/50 chance                   |
| 1     | Certain — WILL happen          |

Note: 70% in real life = 0.7 in math. Always between 0 and 1.

---

## The Formula

P(event) = Favourable outcomes / Total possible outcomes

| Symbol              | Meaning                              |
|---------------------|--------------------------------------|
| P(event)            | Probability of something happening   |
| Favourable outcomes | Ways the event CAN happen            |
| Total outcomes      | All possible things that could happen|

### Example — Rolling a dice
P(rolling a 4) = 1/6 = 0.167
Favourable = 1 (only one face shows 4)
Total = 6 (dice has 6 faces)

---

## Cricket Ball Example

Bag contains 10 balls: 6 red, 4 white

P(red)   = 6/10 = 0.6
P(white) = 4/10 = 0.4

---

## Rule of Total Probability

All probabilities must always add up to 1.
One outcome MUST happen — so together they = 1 (certainty).

P(red) + P(white) = 0.6 + 0.4 = 1.0

Useful shortcut:
P(not A) = 1 - P(A)
P(not red) = 1 - 0.6 = 0.4

---

## Conditional Probability

"Given that something is already true — what is the probability
of something else happening?"

Written as: P(A | B) = "Probability of A GIVEN B"
The | symbol means "given that"

### Examples
| Plain English                              | Math notation              |
|--------------------------------------------|----------------------------|
| Probability of spam given word "prize"     | P(spam \| "prize")         |
| Probability of rain given cloudy sky       | P(rain \| cloudy)          |
| Probability of cancer given positive test  | P(cancer \| positive test) |

---

## ML Connection

Every classifier in ML outputs a probability.

### Email spam classifier example
| Email                  | P(spam) | P(not spam) | Decision  |
|------------------------|---------|-------------|-----------|
| "Win a prize now!"     | 0.95    | 0.05        | Spam      |
| "Meeting at 3pm"       | 0.02    | 0.98        | Not spam  |
| "Claim your reward"    | 0.78    | 0.22        | Spam      |

P(spam) + P(not spam) always = 1.
Model picks whichever probability is higher.

### Where probability appears in ML
| Algorithm            | How probability is used                        |
|----------------------|------------------------------------------------|
| Spam filter          | P(spam \| email words)                         |
| Disease diagnosis    | P(disease \| test results)                     |
| Image classifier     | P(cat \| image pixels)                         |
| Recommendation       | P(user likes movie \| past watch history)      |

---

## Key Rules Summary

| Rule                  | Formula            | Meaning                          |
|-----------------------|--------------------|----------------------------------|
| Basic probability     | P = favourable/total| Between 0 and 1                 |
| Total probability     | P(A)+P(not A) = 1  | All outcomes sum to 1            |
| Conditional           | P(A\|B)            | Probability of A given B is true |

---

## Memory Hook
(Write your own one sentence here)

---

## Practice Working
(Your answers go here)

---

## My Understanding (in my own words)
(Fill this in after practice questions)

---

### Q1 — Coloured balls probability
Bag: 5 blue, 4 green, 6 yellow. Total = 15

P(blue)   = 5/15 = 0.33
P(green)  = 4/15 = 0.26
P(yellow) = 6/15 = 0.40

Verification using Rule of Total Probability:
0.33 + 0.26 + 0.40 = 1.0 ✓

Shortcut used:
P(yellow) = 1 - P(blue) - P(green) = 1 - 0.33 - 0.26 = 0.41
(small rounding difference — both acceptable)

---

### Q2 — Spam filter conditional probability
200 emails total:
- 80 contain "prize" → 72 spam
- 120 no "prize"    → 12 spam

P(spam | "prize")    = 72/80  = 0.90
P(spam | no "prize") = 12/120 = 0.10

MISTAKE TO AVOID: Conditional probability P(A|B) uses
only the group where B is already true as the total.
Not the full dataset total.

ML connection: This is exactly how Naive Bayes
spam classifier works.

### Q3 — Disease diagnosis model
500 patients total:
- 200 tested positive → 180 had disease
- 300 tested negative → 15 had disease

P(disease | positive test) = 180/200 = 0.90
P(disease | negative test) = 15/300  = 0.05

Conclusion:
90% chance of disease if positive -> doctor should be worried.
5% chance of disease if negative -> small risk remains (false negative).

ML connection:
False negative = model says "no disease" but patient has it.
In medical ML, minimizing false negatives is critical.