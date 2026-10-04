# DAF Trailer — script v3 (two parts, ≈2:30 each, 9:16)

**Voices (Kali, 2026-10-04):** one storyteller. Asha has no voice. The Java developer
pops in only to ask a doubt, then leaves.

| Who | Voice | How the viewer recognises it |
|---|---|---|
| **Narrator** (Viraj now, Kali later) | yes, ~95% | normal white captions |
| **Asha madam**, school principal | none, shown only | illustration; the narrator talks *about* her |
| **Rishi**, Java developer (name can change) | 2nd ElevenLabs voice, one line each time | yellow **DOUBT** card + raised-hand icon + his avatar |
| **The rival**, "tomorrow = today" (persistence) | none | grey shadow line |

Status: waiting for Kali's approval.

---

## Part 1 — The mission and the 6 pm decision

| # | Voice | On screen |
|---|---|---|
| 1 | NAR: "See, in this series we are going to do one thing. Predict Delhi's pollution for tomorrow. Not with a toy dataset. With real sensor data, step by step, like a real project. And we will not walk alone. Three characters walk with us." | Delhi skyline in haze; title types: **"Tomorrow's air, today"**; three silhouettes walk in from the right |
| 2 | NAR: "First, Asha madam. She runs a primary school in Delhi. She is the one who needs our answer. Every ticket we build, we build for her." | Silhouette 1 lights up → Asha illustration; cast card **ASHA MADAM · needs the answer** |
| 3 | NAR: "Second, Rishi. A Java developer, like many of you. Whenever something does not make sense, he will stop me and ask." · RISHI (yellow card): "Hi, I am Rishi. I write Java. I will ask the doubts you are shy to ask." | Silhouette 2 → Rishi at a laptop with a Java IDE; cast card **RISHI · asks the doubts**; first yellow DOUBT card style shown |
| 4 | NAR: "And third, the rival. Not a person, a habit. Tomorrow will be like today. Remember this one, because every model we build has to beat it." | Silhouette 3 turns into a grey line; cast card **THE RIVAL · tomorrow = today** |
| 5 | NAR: "Now, the story. Every evening at six o'clock, Asha madam has to decide one thing. Tomorrow morning, six hundred children will stand on the ground for assembly. If the air is bad, they must stay inside. But she has to decide tonight, and tomorrow's air does not exist yet." | Clock ticks to 18:00; 600 dots fill the ground row by row; bubble "Outside… or inside?"; TOMORROW box with "?" |
| 6 | NAR: "How do we know if air is bad? With one number. PM2.5, the tiny dust in the air. Higher number, worse air. When the day's average crosses ninety-one, the air is Poor, and children should not stand outside." | Meter rises through colour bands; red dashed line draws at **91**, stamps "POOR" |
| 7 | NAR: "So what does Asha madam do today? She uses the rival. She looks at today's number and says, tomorrow will be like today. Just think once. Is that wrong? On most days, no. Delhi's air changes slowly." | Today's bar copies into tomorrow's slot; grey line "tomorrow = today"; calm days match, green ticks |
| 8 | NAR: "But here's the catch. Let's say tonight the wind drops. Or crop smoke arrives. Or it is the night of Diwali. Today looks fine, so she sends the children out, and tomorrow the number jumps over ninety-one. The rival is always one day late, exactly on the days that matter." | Icons: still flag, smoke, diya; real line spikes over 91, grey line lags one day; missed day flashes red "600 children outside" |
| 9 | RISHI (yellow card): "So we just need a better guess for tomorrow?" · NAR: "Yes. But a guess with rules. Because without rules, every model looks good." | DOUBT card pops and leaves; blackboard slides in |
| 10 | NAR: "Rule one: we forecast at six pm, using only what exists at six pm. Rule two: beat the rival by at least ten percent. Rule three: never miss more Poor days than the rival does. Because a false alarm keeps children inside for nothing, but a missed Poor day sends them into bad air. Which one is worse? Right?" | Rules chalk-write one by one; two cards flip: amber "false alarm" vs red "missed Poor day" (red grows) |
| 11 | NAR: "So, remember three things. Six pm. Ninety-one. And the rival, tomorrow equals today. In part two: where the data comes from, and the journey from raw sensors to a forecast." | Recall card **6 pm · 91 · tomorrow = today**; cast row (Asha · Rishi · rival); "Trailer · Part 2 →" |

## Part 2 — From sensors to a forecast

| # | Voice | On screen |
|---|---|---|
| 1 | NAR: "Last time, three things. Six pm. Ninety-one. And the rival, tomorrow equals today. Now the big question. What will our model learn from?" | Part 1 recall card flips to "?" |
| 2 | NAR: "Delhi has government air sensors, and they report every hour. OpenAQ collects them, free. But a station with a few months of data teaches nothing about winter. So we made a rule: at least two years of history. Fifty stations passed. Forty-four were still reporting in the recent window." | Delhi map; dots blink; "2 years" filter sweeps; counter 50 → 44 |
| 3 | RISHI (yellow card): "Forty-four stations! We train on all of them?" · NAR: "No. Here's the catch. Forty-four stations means forty-four sets of problems before we see even one error number. So version one is one station, R K Puram. One station end to end first. Then we widen." | 44 dots with tiny warning icons → all fade except one glowing dot **R K Puram**; card **D-005 · SIGNED** |
| 4 | NAR: "Now, what does the model actually see? Very simple. One row is one question. The clues: today's readings until five pm, and the last few days' average. The answer: tomorrow's twenty-four hour average. And we also bring in the weather, from Open-Meteo, to test if it helps." | Hourly bars; before-17:00 bars glow "clues"; next day squashes into one number "answer"; both slide into one table row; weather icon knocks with "?" |
| 5 | NAR: "From that one station we get a few hundred days, and only one winter. Small data, but real data. And the journey has five acts." | Rows stack, "≈ 488 usable days"; one winter shaded; title "5 acts" |
| 6 | NAR: "Act one, ask the right question. Act two, collect the data. Act three, get the first honest score. Act four, fix the data and build better clues. Act five, prove it." | Project map DAF-01…18 groups into five coloured blocks lighting in turn (01–02 · 03–05 · 06–07 · 08–14 · 15–18), one icon each |
| 7 | RISHI (yellow card): "One doubt. In Java tests I shuffle my data. Why not here?" · NAR: "Because in real life, tomorrow never comes before today. You will see it in act three." | Day-cards shuffle; a hand stops them; they re-order into a calendar line "time →" |
| 8 | RISHI (yellow card): "And everyone says the fancy models win, right?" · NAR: "I'll tell you one thing. The fanciest model is not always the winner. You will see it with your own eyes, in act five." | Two racers "Simple" and "Fancy"; race freezes before the finish with "?" |
| 9 | NAR: "Our model has passed the mock tests and the monthly exams. One exam is left. The sealed paper. Will it beat the rival? We open it together, at the end." | Three report cards; the third is an envelope with a wax seal, wobbling |
| 10 | NAR: "So, remember three more things. One station. One row is one question. And five acts. Episode one, DAF-01. Before one line of ML, we build the house." | Recall card **one station · one row = one question · five acts**; title **DELHI AIR FORECAST · ML for a Java developer**; "Episode 1 · DAF-01 →" |

## Fact sources
Asha, 600 children, wind/crop smoke/Diwali: `README.md`. 6 pm, 91, +10%, recall rule:
`docs/requirements.md`. 50 → 44: `docs/project_status_summary.md`. One station R K Puram,
488 usable days, one winter: `D-005`. Clues/answer row: `requirements.md` + DAF-18 toy
walkthrough. Mock tests / monthly exams / sealed paper: `18_visual_walkthrough.ipynb`.
