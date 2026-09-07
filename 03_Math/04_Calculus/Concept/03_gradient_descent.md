# Topic 03 — Gradient Descent

---

## Why Do We Need Gradient Descent?

In Machine Learning, the model makes predictions. Those predictions have errors.
If you plot the error on a graph it looks like a valley:

```
Error
  |
  |  \              /
  |    \          /
  |      \      /
  |        \  /
  |          ★  ← minimum error — this is the goal
  |
  +----------------------
```

The model's job is to find the BOTTOM of this valley — where error is smallest.
To do that — it needs to check the slope at every point.
That is where Gradient Descent comes in.

---

## Real Life Story — Raju's Chai Shop ☕

Raju opens a chai shop. He tries different prices and notes his profit:

| Price per cup (₹) | Profit (₹) |
|-------------------|------------|
| ₹2                | ₹10        |
| ₹4                | ₹40        |
| ₹6                | ₹60        |
| ₹8                | ₹40        |
| ₹10               | ₹10        |

Plotted on a graph this looks like a hill — profit goes up then comes back down.
Raju wants to find the price that gives MAXIMUM profit.

He cannot try every possible price. He needs a smarter way.
That smarter way is Gradient Descent.

---

## How Gradient Descent Works — The Dark Mountain 🏔️

Imagine you are standing on a dark mountain. You cannot see anything.
Your only goal is to reach the bottom of the valley.

What do you do?
→ You slowly put your foot down and check how steep the ground is.
→ You take one small step downhill.
→ You repeat this — one step at a time — until the ground feels flat.

That is exactly what Gradient Descent does.

---

## The Three Things Gradient Descent Uses Every Step

| Thing | What It Means |
|-------|---------------|
| Current position | Where the model is right now |
| Derivative | How steep is the ground at this point |
| Learning Rate | How big a step to take |

---

## How Derivative Is Calculated At Each Point

To find the derivative at any point — we use what we already know:

> Check slope from the LEFT → check slope from the RIGHT → average them

### Example — At Price ₹6

Raju's data around ₹6:

| Point | Price | Profit |
|-------|-------|--------|
| Left  | ₹4   | ₹40    |
| Here  | ₹6   | ₹60    |
| Right | ₹8   | ₹40    |

**Step 1 — Left Slope (₹4 to ₹6)**
```
Rise = 60 − 40 = 20
Run  = 6 − 4   = 2
Left Slope = 20 ÷ 2 = +10
```

**Step 2 — Right Slope (₹6 to ₹8)**
```
Rise = 40 − 60 = −20  ← negative because profit went DOWN
Run  = 8 − 6   = 2
Right Slope = −20 ÷ 2 = −10
```

**Step 3 — Derivative**
```
Derivative = (Left Slope + Right Slope) ÷ 2
           = (10 + (−10)) ÷ 2
           = 0 ÷ 2
           = 0  ← completely flat = top of the hill ✅
```

---

## What The Derivative Tells The Model

| Derivative Value | Meaning | What Model Does |
|------------------|---------|-----------------|
| Positive (+15)   | Curve going UP | Move in opposite direction |
| Negative (−10)   | Curve going DOWN | Keep moving this way |
| Zero (0)         | Completely flat | STOP — minimum found ✅ |

---

## Derivative At Every Price Point

| Price | Left Slope | Right Slope | Derivative | Action |
|-------|------------|-------------|------------|--------|
| ₹2   | none       | +15         | +15        | Increase price ↗ |
| ₹4   | +15        | +10         | +12.5      | Increase price ↗ |
| ₹6   | +10        | −10         | 0          | STOP ✅ |
| ₹8   | −10        | −15         | −12.5      | Decrease price ↙ |
| ₹10  | −15        | none        | −15        | Decrease price ↙ |

---

## Learning Rate — The Step Size

The Learning Rate controls how big each step is.

| Learning Rate | What Happens |
|---------------|--------------|
| Too big       | You jump over the bottom and miss it |
| Too small     | You take forever to reach the bottom |
| Just right    | You reach the bottom smoothly ✅ |

---

## The Exact Steps Every Single Time

1. Start at a random point
2. Check derivative at this point — how steep is the ground?
3. Derivative positive → move one way
4. Derivative negative → move the other way
5. Take one small step — size controlled by Learning Rate
6. Land at new point
7. Repeat from step 2
8. Derivative close to zero → STOP ✅

---

## IMPORTANT — Real Life Is Never Perfect

In real life — left and right slopes almost never cancel perfectly.

So the derivative is almost never exactly zero.

The model keeps taking smaller and smaller steps until the derivative
becomes TINY ENOUGH — like 0.001 — and then it stops.

This tiny number is called the THRESHOLD.

| Derivative | What Happens |
|------------|--------------|
| −1.75      | Still moving — take a step |
| −0.5       | Getting close — take a smaller step |
| −0.01      | Almost flat — nearly there |
| −0.001     | Close enough → STOP ✅ |

Think of it like the dark mountain — you never find perfectly flat ground.
But at some point the ground feels almost flat enough — and you stop there.

---

## Why Gradient Descent Matters In ML

Every ML model you will ever use — linear regression, neural networks,
deep learning — they all learn using Gradient Descent.

When a model trains on data, what it is actually doing is:

> Running Gradient Descent thousands of times to find the best possible answer.

Slope → Derivative → Gradient Descent → This is how ML models learn.

---

## The Full Journey So Far

```
Slope
  → measures steepness between two points

Derivative
  → measures exact steepness at one single point
  → calculated by averaging left slope and right slope

Gradient Descent
  → uses the derivative at every step
  → takes small steps downhill
  → stops when derivative is close to zero
  → this is how ML models find minimum error
```

---

## In My Own Words

Gradient Descent is like walking down a dark mountain one step at a time.
Before every step — you check how steep the ground is (derivative).
The steepness tells you which way to step.
You keep stepping until the ground is almost flat.
That flat point is where the model has minimum error — its best answer.