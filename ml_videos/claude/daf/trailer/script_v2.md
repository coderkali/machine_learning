# DAF Trailer — script v2 (two parts, ≈2:30 each, 9:16)

v1 was a montage (a list of facts). v2 is one story: each beat answers the beat
before it, and each part ends by planting three things to remember. The series
reuses those anchors, so a viewer who has only seen the trailer can still follow
Episode 1.

**SIR** = Sharma sir (Viraj) · **STU** = the student (2nd voice) · Asha = speech bubbles.
Status: waiting for Kali's approval.

## The spine
- **Part 1, "The 6 pm decision":** WHY. Asha's problem → why her method fails → the rules
  of the game. Anchors: **6 pm · 91 · tomorrow = today**.
- **Part 2, "From sensors to a forecast":** HOW. The data → one row = one question → the
  journey in five acts → the sealed exam. Anchors: **one station · one row = one question · five acts**.

---

## Part 1 — The 6 pm decision

| # | Voice | On screen |
|---|---|---|
| 1 | SIR: "See, every evening at six o'clock, in a school in Delhi, one person takes a decision that nobody else sees." | Black screen → clock face ticks to 18:00 → a school building fades in under hazy sky |
| 2 | SIR: "This is Asha madam. She runs a primary school. Tomorrow morning, six hundred children will stand on the ground for assembly. If the air is bad, they must stay inside. But she has to decide tonight, at six pm, and tomorrow's air does not exist yet." | Asha at the gate; 600 dots fill the ground row by row; bubble "Outside… or inside?"; the word TOMORROW is a blank box with "?" |
| 3 | SIR: "Now, how do we know if air is bad? With one number. PM2.5, the tiny dust in the air. Higher number, worse air. And when the day's average crosses ninety-one, the air is Poor. On a Poor day, children should not stand outside." | A meter from 0 upward; colour bands; a red dashed line draws at **91** and stamps "POOR" |
| 4 | SIR: "So what does Asha madam do today? Very simple only. She looks at today's number and says, tomorrow will be like today. Just think once. Is that wrong? On most days, no. Delhi's air changes slowly." | Today's bar copies itself to tomorrow's slot; label "tomorrow = today"; 5 calm days where the copy almost matches (green ticks) |
| 5 | SIR: "But here's the catch. Let's say tonight the wind drops. Or crop smoke arrives. Or it is the night of Diwali. Today looks fine, so she says, children, go outside. And tomorrow the number jumps over ninety-one. Her method is always one day late, exactly on the days that matter." | Three icons (still wind flag, smoke, diya); real line spikes over 91 while the grey copy line lags one day behind; the missed day flashes red: "600 children outside" |
| 6 | STU: "Sir, so we just need a better guess for tomorrow? I am a Java developer. I can write the API in one day. But the guess itself… how?" · SIR: "That is the whole project. And you will build it, not me." | Student at a laptop: Java IDE on the left, an empty box "tomorrow's number" on the right; ticket stack "DAF-01 … DAF-18" drops onto the desk |
| 7 | SIR: "But first, the rules. Because without rules, every model looks good. Rule one: we forecast at six pm, using only what exists at six pm. Rule two: beat Asha's method, we call it persistence, by at least ten percent. Rule three: never miss more Poor days than she does." | Blackboard; three rules chalk-write one by one; clock icon, "−10%" next to a grey "persistence" card, red 91 line |
| 8 | SIR: "Why rule three? A false alarm keeps the children inside for nothing. A missed Poor day sends them into bad air. Which one is worse? Right?" · STU: "So the model is not judged by me. It is judged by Asha's decision." · SIR: "Exactly. Understood?" | Two cards flip: "False alarm → kids inside, no harm" (amber) vs "Missed Poor day → kids in bad air" (red, grows bigger) |
| 9 | SIR: "So, remember three things. Six pm. Ninety-one. And the rival: tomorrow equals today. Next, where does our data come from, and how do eighteen tickets turn it into a forecast?" | Recall card: **6 pm · 91 · tomorrow = today**; "Trailer · Part 2 →" |

## Part 2 — From sensors to a forecast

| # | Voice | On screen |
|---|---|---|
| 1 | SIR: "Last time, three things. Six pm. Ninety-one. And the rival, tomorrow equals today. Now the big question. What will our model learn from?" | Part 1 recall card flips over to a "?" |
| 2 | SIR: "Delhi has government air sensors, and they report every hour. OpenAQ collects them, free. But a station with a few months of data teaches nothing about winter. So we made a rule: at least two years of history. Fifty stations passed. Forty-four were still reporting in the recent window." | Delhi map; dozens of dots blink; a "2 years" filter sweeps: 50 stay → 44 stay (counter animates) |
| 3 | STU: "Forty-four stations! So we train on all of them?" · SIR: "No. Here's the catch. Forty-four stations means forty-four sets of problems before we see even one error number. So version one is one station. R K Puram. One station, end to end. Then we widen." | 44 dots, each with a tiny warning icon → all fade except one glowing dot "R K Puram"; decision card **D-005 · SIGNED** |
| 4 | SIR: "Now, what does the model actually see? I'll tell you one thing, it is very simple. One row is one question. The clues: today's readings until five pm, and the last few days' average. The answer: tomorrow's twenty-four hour average. And we also bring in the weather, from Open-Meteo, to test if it helps." | Hourly bars for one day; bars before 17:00 glow = "clues"; next day's bars squash into one number = "answer"; together they slide into one table row; a weather icon knocks on the table with "?" |
| 5 | SIR: "From that one station, we get a few hundred days, and only one winter. Small data, real data. And the journey has five acts." | Rows stack into a table "≈ 488 usable days"; one winter shaded blue; title "5 acts" |
| 6 | SIR: "Act one, ask the right question. Act two, collect the data. Act three, get the first honest score. Act four, fix the data and build better clues. Act five, prove it." | Project map DAF-01…18 groups into 5 coloured blocks lighting up in turn: 01–02 · 03–05 · 06–07 · 08–14 · 15–18; small icon per act (question mark, download, scoreboard, wrench, envelope) |
| 7 | STU: "Sir, one doubt. In Java tests, I shuffle my data. Why can't I shuffle here?" · SIR: "Because in real life, tomorrow never comes before today. You will see it in act three." | A deck of day-cards shuffles; Sir's hand stops it; cards re-order into a calendar line with an arrow "time →" |
| 8 | STU: "And the trees, sir? Everyone says the fancy models win." · SIR: "Let me tell you one thing. The fanciest model is not always the winner. You will see it with your own eyes, in act five." | Two racers line up, "Simple" and "Fancy"; the race freezes before the finish with "?" |
| 9 | SIR: "Our model has passed the mock tests and the monthly exams. One exam is left. The sealed paper. Will it beat Asha's method? We open it together, at the end." | Three report cards (mock tests · monthly exams · sealed paper); the third is an envelope with a wax seal, wobbling |
| 10 | SIR: "So, remember three more things. One station. One row is one question. And five acts. Episode one, DAF-01. Before one line of ML, we build the house." | Recall card: **one station · one row = one question · five acts**; title card **DELHI AIR FORECAST · ML for a Java developer**; "Episode 1 · DAF-01 →" |

## Fact sources
Asha, 600 children, wind/crop smoke/Diwali: `README.md`. 6 pm, 91, +10%, recall rule:
`docs/requirements.md`. 50 → 44: `docs/project_status_summary.md`. One station R K Puram,
488 usable days, one winter: `D-005`. Clues/answer row: `requirements.md` + DAF-18 toy
walkthrough. Mock tests / monthly exams / sealed paper: `18_visual_walkthrough.ipynb`.
