# Day 2 — Why Python feels different (as a Java dev) · READING SHEET v1

For the creator's first self-recording test (2026-09-29 morning, sitting, no mic).
Source: `01_Python/01_Variables_And_Data_Types/Concept` (README + notebook). Next: Day 3 "NumPy: the expression replaces the loop".

How to read: one line = one breath. **Bold** = push that word. `/` = short pause. `//` = longer pause (before a reveal).
Record one file per part (hook, problem, …). Stumble? Pause 2 s and read the whole line again.

Pronunciation: NumPy = "NUM-pie" · dynamic = "dye-NAM-ik" · str = say "string" · TypeError = "type error"

---

## 1 · HOOK  (curious → lift on the question)
I'm **Kali**, / and this is Day 2 of ML for a Java developer.
Here's the first thing that **surprised** me in Python.
There's no **int**. / No **String**.
You just write: / x equals **five**.
// So how does Python know what x **is**?

## 2 · PROBLEM  (honest, a bit worried)
As Java developers, / we **trust** types.
The compiler checks them / **before** the code runs.
So when I saw Python code / with no types at all,
my first thought was: // this is going to **break**.

## 3 · INTUITION  (slower, "let me show you")
But think about it this way.
In Java, / the **box** has a type.
You create an int box, / and only numbers go in.
In Python, / the **value** has the type.
The variable is just a **label** / you stick on it.

## 4 · VISUAL  (light, playful)
Let's **visualize** it.
x equals five: / the label x points to the number **five**.
Now write: / x equals "**hello**".
Same label. / New value. / New **type**.
// No error.

## 5 · TECHNICAL  (clear, confident)
That's called **dynamic typing**.
Python checks types / while the code **runs**, / not before.
And you can always ask: / **type** of x.
It tells you: / int, / float, / or string.

## 6 · JAVA  (warm, "between us Java devs")
And this is where Java developers / usually get **confused**.
Python is dynamic, / but it's still **strict**.
Try five, / plus the text "hello",
and Python **stops** you / with a type error.
It won't **guess** for you.

## 7 · EXAMPLE  (fun, a small wow)
Here's one more thing / Java can't do.
In Python, / an integer has **no size limit**.
A number with over a **hundred** digits? / Still just an **int**.
// In Java, / a long would have **overflowed** / long ago.

## 8 · RECAP  (confident, then lift on "next")
So, / Day 2 in one line:
in Python, / **values** have types,
variables are just **labels**,
and Python still **checks** your work.
// Day 2 done.
Next: / **NumPy**, / where one line / replaces the whole **loop**.

---
Word count ≈ 255 → about 2 minutes at a natural pace (inside the 60–150 s range).
