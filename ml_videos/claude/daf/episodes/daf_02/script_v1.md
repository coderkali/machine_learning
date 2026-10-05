# DAF-02 · "A wish is not a requirement" — script v1 (two parts, ≈2:20 each)

Sources: DAF-02 ticket (Why · Explain back · Traps), docs/requirements.md, D-001, D-002,
docs/phases/01_requirements.md. Concepts only: no files, no commands.

Big idea: **an ML requirement is a contract that pins five things**: decision · target · time · success number · baseline.
- Part 1 (`day_302`): ① the decision → which mistake is expensive ② the target, defined exactly (D-001 number→table, D-002 24 h mean, 18-hour rule) ③ the time: 6 pm, only data that exists then.
- Part 2 (`day_352`): ④ success = a number next to a named rival (persistence, negative value) ⑤ MAE + Poor-day recall → the one-sentence criterion · non-goals · decision records.

Pace: DAF-01 ran at ~163 words/min → targets ≤ ~400 words per part (~2:25).

## Part 1 · `day_302`

| # | id | Who | Line |
|---|---|---|---|
| 1 | recap | NAR | Last time, we built the house for our project. Now, what do we build inside it? Today's ticket answers that, before we touch any data. |
| 2 | wish | NAR | See, predict Delhi's air quality is not a requirement. It is a wish. You cannot build it, and you cannot tell if you succeeded. As Java developers, we agree the API contract and the SLA before we write a service. An ML requirement is that same contract. |
| 3 | five | NAR | It pins down five things. The decision, the target, the time, the success number, and the baseline it must beat. In this part, the first three. |
| 4 | decision | NAR | First, the decision. At six pm, Asha madam decides if six hundred children assemble outside tomorrow. And this tells us which mistake is expensive. Say bad when it is fine, and the children stay inside. A small loss. Say fine when it is bad, and six hundred children breathe poor air. That is the costly one. |
| 5 | what | NAR | Next, what exactly do we predict? A number. A category, like safe or unsafe. Or the number, converted into a category with the official air quality table. We chose the third one. That is decision D-001. |
| 6 | doubt1 | RISHI | Sir, Asha only needs inside or outside. Why not predict that directly? |
| 7 | answer1 | NAR | Because a category throws information away. Ninety-one and four hundred both become unsafe, but one is bad, and the other is dangerous. The number keeps that difference, and the table still gives Asha her category. |
| 8 | target | NAR | And the target must be so exact that two people build the same column. Tomorrow's twenty-four hour average PM2.5, midnight to midnight, Indian time, because the official bands use the daily average. That is D-002. And here's the catch. Sensors go down. So a day counts only if at least eighteen hours have readings. Otherwise, that day is dropped. |
| 9 | when | NAR | Third, when is the prediction made? At six pm, because that is when Asha decides. And at six pm, today is not over. We have readings only up to five pm. |
| 10 | doubt2 | RISHI | Sir, but today's average is the best clue. Why can't I use it? |
| 11 | answer2 | NAR | Because at six pm, it does not exist yet. In the notebook, the full day sits in the table, and the model looks brilliant. In production, it is missing, and the model fails. So, use only what exists at prediction time. Even for tomorrow's weather, we use only its forecast. |
| 12 | row | NAR | So, this is how the model will see our data. One row for each day. On the left, only what we know at six pm today. On the right, the answer, tomorrow's daily average. The decision, the target, and the time, all inside one row. In Part two, how good is good enough? |

## Part 2 · `day_352`

| # | id | Who | Line |
|---|---|---|---|
| 1 | recap2 | NAR | In Part one, we fixed the decision, the target, and the time. Now come the two questions that beginners skip. What score counts as success? And what must the model beat? |
| 2 | accurate | NAR | See, the model must be accurate, sounds fine. But how accurate? Compared to what? Without a comparison, every model looks good. So success must be a number, next to a named rival. |
| 3 | baseline | NAR | And Asha madam already has a method. Tomorrow will be like today. We call it the persistence baseline. It is free, it needs no model, and on most days, it is right. Our model must beat it. |
| 4 | doubt3 | RISHI | Sir, even if it does not beat it, a model is still something, right? |
| 5 | answer3 | NAR | No. It has negative value, not zero. A model costs data pipelines, servers, and maintenance. And people trust it more, because it looks clever. If it is worse than tomorrow equals today, Asha would decide better with no model at all. |
| 6 | mae | NAR | Now, how do we measure better? Our headline metric is MAE, mean absolute error. On average, how many micrograms off are we? Simple, right? |
| 7 | catch | NAR | But here's the catch. MAE treats every error the same. Let's say we are ten off when the true value is forty. The children go outside either way, no harm. The same ten, at eighty-five, flips the decision. So we add a safety metric. Recall on Poor days, ninety-one and above. Of all the truly bad days, how many did we catch? |
| 8 | criterion | NAR | So our success criterion is one sentence. Beat the persistence MAE by at least ten percent, on held-out days the model has never seen, without catching fewer Poor days than persistence. A number, next to a named baseline. And we set this bar now, before we see any model. |
| 9 | nongoals | NAR | Last, we also write what we are not building. No hourly forecast. No other city. No other pollutant. No mobile app. Nothing beyond tomorrow. Non-goals are not laziness. They stop the project from growing sideways for six months. |
| 10 | records | NAR | And our two big choices are written as decision records. The options, why we chose, and what the other option would have made easier. |
| 11 | asha | NAR | So what did DAF-02 give Asha madam? Still no forecast. But now she knows exactly what she will get, at six pm, and how wrong it is allowed to be. |
| 12 | recall | NAR | So, remember. A requirement pins down five things. The decision, the target, the time, the success number, and the baseline. And a model that cannot beat the baseline has negative value. The full documents are on GitHub. |
| 13 | next | NAR | Next time, DAF-03. Delhi has many air sensors. But which ones can we really trust? |

v1.1 (Kali, 2026-10-04): added the data-row beat (how the model sees one day) + held-out test days.

Visual notes (for after audio approval): five-pin contract card (pins light up one by one; Part 1 lights 3, Part 2 lights 5) ·
cost-of-mistake scale (small loss vs 600 children) · 91 vs 400 both collapsing into one "unsafe" box · 24-hour clock with
18-of-24 rule · 6 pm clock with today's bar cut at 17:00 · persistence grey shadow line · error ±10 at 40 vs 85 against the
red dashed 91 line · D-001 and D-002 stamp SIGNED · Rishi on yellow DOUBT cards · Asha shown, silent. No SVG text.
