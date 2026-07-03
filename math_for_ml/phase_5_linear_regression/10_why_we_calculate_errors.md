# Phase 5 — Topic 10 — Why We Calculate Errors

---

## The Simple Reason

> We calculate error to measure how wrong our current w is —
> so we know how much to fix it.

Without error — Gradient Descent is completely blind.
It has no idea if w = 0 is good or bad.

---

## The Tailor Story 🧵

A tailor wants to make a shirt of size 40.
He guesses and cuts the cloth without measuring.

Customer tries it on:
> "This is size 36 — too small by 4!"

That "too small by 4" is the ERROR.

Now the tailor knows — next time cut 4 more.

Same thing happens in Gradient Descent.
The error tells the model how much to adjust w.

---

## Applying This To Meera's Data

We started with w = 0, b = 0.

Our formula says:
```
Bill = 0 × hours + 0 = ₹0 for every hour
```

But Meera's real bill at 1 hour = ₹620.

```
Error = Real − Predicted = 620 − 0 = ₹620
```

Our guess was wrong by ₹620.
That is a huge error — w = 0 is completely wrong.

---

## What Error Tells Us

| Error Size | Meaning | Action |
|------------|---------|--------|
| Very big   | w is very wrong | Change w a lot |
| Medium     | w is getting closer | Change w a little |
| Very small | w is almost right | Tiny adjustment |
| Zero       | w is perfect ✅ | Stop — done! |

---

## The Archer Analogy 🏹

```
First arrow  → missed by 50cm → adjust aim a LOT
Second arrow → missed by 10cm → adjust aim a little
Third arrow  → bullseye! ✅   → stop adjusting
```

Error tells the archer how much to adjust.
Error tells Gradient Descent how much to adjust w.

Same concept. Different context.

---

## The Full Process So Far

```
Step 1 → Start with random guess: w = 0, b = 0
              ↓
Step 2 → Make predictions using formula
         Bill = 0 × hours + 0 = ₹0 for all hours
              ↓
Step 3 → Calculate errors
         Error = Real bill − Predicted bill
              ↓
Step 4 → Use errors to measure how wrong w is
              ↓
Step 5 → Adjust w in the right direction
              ↓
Step 6 → Repeat until error = zero ✅
```

---

## In My Own Words

When we start with w = 0 and b = 0 —
our formula predicts ₹0 for every hour of AC.

But Meera's real bills are ₹620, ₹1080, ₹1750 etc.

The difference between what we predicted and what is real —
that is the error.

Error tells us how wrong our current w is.
The bigger the error — the more we need to fix w.
The smaller the error — the closer we are to the best w.

When error = zero — we have found the perfect w. ✅