# DAF-02 · script v2 — three short videos, one question each (Kali, 2026-10-05)

v1 (two parts) rejected: too many ideas (≈12 in Part 1), too fast, project jargon (D-001/D-002, contract, pins).
v2 rules: max 3 ideas per video · one sentence per visual step · the real R K Puram table pinned at the top the whole
video, each video adds ONE column · no decision-record names in the voice (they stay on GitHub).

Ids: A = `day_302` → DAF/Episodes/DAF-02/Part1 · B = `day_352` → Part2 · C = `day_402` → Part3.
(v1/v2 assets of day_302/day_352 backed up in src/episodes/day_3x2/v1_backup/.)

## A · `day_302` · "What exactly do we predict?" → adds 🎯 TARGET column

| # | id | Who | Line |
|---|---|---|---|
| 1 | hook | NAR | Before we train any model, we must answer one simple question. What exactly are we predicting? |
| 2 | data | NAR | See, this is our real data, from one sensor at R K Puram in Delhi. One row for each day. And this column is the average PM2.5 of that day. |
| 3 | number | NAR | So what will the model predict? A number. Tomorrow's PM2.5. |
| 4 | doubt1 | RISHI | Sir, Asha only needs inside or outside. Why not just predict safe or unsafe? |
| 5 | answer1 | NAR | Because a category hides information. Look at these two real days. Ninety-two, and three hundred ninety-seven. Both are unsafe. But one is bad, and the other is dangerous. The number keeps that difference. And the official table can still turn it into a category for Asha. |
| 6 | tomorrow | NAR | Now, which number exactly? Tomorrow's average, from midnight to midnight, Indian time. Because the official air quality bands use the full-day average. |
| 7 | shift | NAR | So we take tomorrow's average, and move it up one row. Now every day has its answer sitting right next to it. This new column is our target. |
| 8 | rule | NAR | But here's the catch. Sensors go down. On the second of March, this sensor gave nothing at all. So we make one rule. A day counts only if it has at least eighteen hours of readings. Otherwise, we drop it. |
| 9 | recall | NAR | So, remember. We predict a number. Tomorrow's full-day average. Only from days with enough readings. Next, what is the model allowed to see at six pm? |

## B · `day_352` · "What can the model see at 6 pm?" → adds 📥 INPUT column

| # | id | Who | Line |
|---|---|---|---|
| 1 | recap | NAR | Last time, we built the answer column. Tomorrow's average. Now the model needs an input. But which numbers is it allowed to see? |
| 2 | six | NAR | See, Asha madam decides at six pm. So the model must also predict at six pm. |
| 3 | notover | NAR | And at six pm, today is not over. The sensor has readings only up to five pm. The rest of the day has not happened yet. |
| 4 | doubt1 | RISHI | Sir, but today's full average is the best clue. Why can't I use it? |
| 5 | answer1 | NAR | Because at six pm, it does not exist. In our table, the full day is sitting right there, so the model looks brilliant. But in real life, at six pm, that number is missing. And the model fails. |
| 6 | rule | NAR | So the rule is simple. Use only what exists at prediction time. That's why our input column is the average up to five pm. For the twenty-fourth of February, one hundred two point seven. Known at six pm. |
| 7 | weather | NAR | Same for the weather. Tomorrow's actual weather, we cannot know. But tomorrow's weather forecast, we can use. |
| 8 | recall | NAR | So, remember. The model predicts at six pm, and it uses only what exists at six pm. Next, how do we know if the model is any good? |

## C · `day_402` · "How do we know it's good?" → adds 👥 PERSISTENCE and ❌ ERROR columns

| # | id | Who | Line |
|---|---|---|---|
| 1 | recap | NAR | We have the input column, and the answer column. Now the big question. How do we know if a model is good? |
| 2 | rival | NAR | See, saying the model must be accurate is not enough. Accurate compared to what? We need a rival. |
| 3 | persistence | NAR | And Asha madam already has one. Tomorrow will be like today. We call it persistence. Let's add it as a column. Every day, it simply copies yesterday's number. |
| 4 | doubt1 | RISHI | Sir, if our model is a little worse than this, it is still useful, right? |
| 5 | answer1 | NAR | No. A model costs servers and maintenance, and people trust it more. If it cannot beat tomorrow equals today, Asha is better off with no model at all. |
| 6 | mae | NAR | Now, how far off is persistence? We add one more column. The error. On the twenty-first, forty-one off. On the twenty-third, only five off. The average of this column is called MAE. Here, eighteen point six. |
| 7 | catch | NAR | But here's the catch. MAE treats every error the same. For Asha, missing a Poor day is the costly mistake. So we also count the Poor days we caught. Persistence caught two out of three. This is called recall. |
| 8 | goal | NAR | So our goal is one sentence. Beat the persistence MAE by ten percent, without catching fewer Poor days. And we test it on days the model has never seen. |
| 9 | recall | NAR | So, remember. A model is good only compared to a rival. MAE tells us how far off we are. Recall tells us how many bad days we caught. |
