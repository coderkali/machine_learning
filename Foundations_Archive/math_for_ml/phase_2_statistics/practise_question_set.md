## Practice Working

### Q1 — Teacher exam scores
Scores: 72, 85, 90, 72, 68, 95, 72

Mean:
Sum = 72+85+90+72+68+95+72 = 554
n = 7
Mean = 554/7 = 79.14
MISTAKE TO AVOID: (72+85+90+72+68+95+72)/7 not 72+85+90+72+68+95+72/7

Median:
Sorted: 68, 72, 72, 72, 85, 90, 95
Middle value (4th out of 7) = 72

Mode:
72 appears 3 times — more than any other
Mode = 72


### Q2 — House prices (outlier effect)
Prices: 35, 40, 38, 42, 35, 200, 37

Mean:
Sum = 35+40+38+42+35+200+37 = 427
n = 7
Mean = 427/7 = 61

Median:
Sorted: 35, 35, 37, 38, 40, 42, 200
Middle value (4th out of 7) = 38

Which is better? Median = 38
Reason: 200 lakh celebrity house is an outlier.
Mean got pulled up to 61 — not representative.
Median ignored the outlier — gives realistic picture.

Real world: salary reports and real estate always use median, not mean.


## My Understanding (in my own words)

Statistics is about finding patterns in a dataset using three key measures.

### Mean
Average of all values.
Sum all values then divide by count.
Example: [10,30,40,10,30,60,30]
Mean = (10+30+40+10+30+60+30)/7 = 30

### Median
Middle value after sorting lowest to highest.
Example sorted: [10,10,30,30,30,40,60]
Median = 30 (4th value out of 7)

### Mode
Most frequently appearing value.
Example: 30 appears 3 times — more than any other
Mode = 30

### Interesting observation
When Mean = Median = Mode (all = 30 here),
data is perfectly balanced — no skew, no outliers.
In real data this rarely happens.

---

### Q1 — Student test scores
Scores: 30, 40, 50, 60, 70

Mean = (30+40+50+60+70)/5 = 250/5 = 50

| Score | Distance (x-x̄) | Squared |
|-------|----------------|---------|
| 30    | -20            | 400     |
| 40    | -10            | 100     |
| 50    | 0              | 0       |
| 60    | +10            | 100     |
| 70    | +20            | 400     |

Variance = (400+100+0+100+400)/5 = 1000/5 = 200
Std Dev  = √200 = 14.14

MISTAKE TO AVOID: Never add raw distances — always square first.
Negatives cancel positives and give wrong answer of zero.

### Q2 — Delivery driver hiring
Driver A: 30, 32, 29, 31, 30
Driver B: 20, 45, 15, 50, 22

Mean A = Mean B = 152/5 = 30.4 (same mean)

Driver A Variance:
(0.16+2.56+1.96+0.36+0.16)/5 = 5.2/5 = 1.04

Driver B Variance:
(108.16+213.16+237.16+384.16+70.56)/5 = 1013.2/5 = 202.64

Decision: Hire Driver A
Reason: Lower variance = consistent delivery times
Driver B is unpredictable despite same average time

MISTAKE TO AVOID: Always divide sum by n at the end.
Variance = AVERAGE of squared distances, not just the sum.

### Q3 — Study hours variance
Scores: 2, 8, 3, 7, 5

Mean = (2+8+3+7+5)/5 = 25/5 = 5

| Score | Distance | Squared |
|-------|----------|---------|
| 2     | -3       | 9       |
| 8     | +3       | 9       |
| 3     | -2       | 4       |
| 7     | +2       | 4       |
| 5     | 0        | 0       |

Variance = (9+9+4+4+0)/5 = 26/5 = 5.2
Std Dev = √5.2 = 2.28

Friend's scores: 4, 5, 6, 5, 5
Friend has lower variance — stays closer to mean of 5.

MISTAKE TO AVOID: Be careful with the distance table.
Write each row carefully — easy to mix up values.


## My Understanding (in my own words)

Mean tells us the average but doesn't tell us how spread out the data is.

Variance measures how far each value is from the mean —
by squaring the distances (to remove negatives) and averaging them.

Standard Deviation is the square root of Variance —
brings the unit back to the original so it makes real sense.

Low variance/std dev = data stays close to mean = consistent.
High variance/std dev = data is scattered far from mean = unpredictable.

Example: Two cricket players with same mean of 50.
Player A std dev = 1.41 -> consistent batsman.
Player B std dev = 38.08 -> unpredictable batsman.