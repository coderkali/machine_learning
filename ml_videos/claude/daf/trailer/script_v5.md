# DAF Trailer — script v5 (TWO parts, ≈2:50 each, 9:16)

v4 had three parts; Kali (2026-10-04): "three videos will be too much, squeeze it to two".
Same order (context → people → new words → rules → plan), tighter lines. The rival's
failure (Diwali etc.) moves into Part 1 so both parts are about the same length.
Rishi's shuffle / fancy-model doubts move to their own episodes (DAF-06, DAF-15).

**NAR** = narrator (Viraj, later Kali) · **RISHI** = Raj, only on a yellow DOUBT card · Asha = shown only.
Facts: `MACHINE_LEARNING/04_ML/` (40 topic folders), project `README.md`, `docs/requirements.md`,
`docs/phases/01_requirements.md`, `D-005`, `project_status_summary.md`, `experiments.csv`.

---

## Part 1 — Why this project? (≈2:50, ~440 words)

| # | id | Voice | On screen |
|---|---|---|---|
| 1 | journey | NAR: "See, so far we have learned a lot. Python. Pandas. Cleaning data, missing values, outliers, scaling. Then the models. Linear regression, Ridge, Lasso, decision trees, ensembles, cross-validation. Forty topics, each one in its own notebook." | Title card "WHY THIS PROJECT?" → 40 notebook tiles fill a grid, named as spoken; counter 0 → 40 |
| 2 | gap | NAR: "But here's the catch. Every one of those notebooks came with a clean little dataset and a clear instruction. Apply this model. Real work never looks like that. Nobody gives you a clean CSV. They give you a problem." | One tile zooms: neat `data.csv` + `Ridge().fit()`; red strikes on "never"; a tangled "PROBLEM" knot drops in |
| 3 | java | NAR: "You know this from Java itself. Learning collections, streams and Spring one by one is one thing. Building a full service where all of them work together is a different skill." | Collections · Streams · Spring tiles snap into one "SERVICE" box ✓ |
| 4 | project | NAR: "So now it is time. One real project, from raw data to a running service. All those topics, working together, on one problem." | The 40 tiles fly into a pipeline: raw data → clean → features → model → API |
| 5 | why_delhi | NAR: "Now, which problem? I wanted three things. Real data that is free to use. A problem that matters to real people. And a question where the answer comes back every single day, so we always know if we were right. Delhi's air gives us all three." | Three-item checklist ticks on its words; map pin drops; stamp "DELHI AIR" |
| 6 | winter | NAR: "Every winter, Delhi's air turns bad, and it is not a rare event. So the question is very simple. Will the air be safe tomorrow?" | Skyline; haze thickens Oct → Jan; "SAFE TOMORROW?" types out |
| 7 | not_weather | NAR: "Now, don't get confused. We are not forecasting the weather. We are forecasting the air, tomorrow's pollution number. Weather is only a clue we will test." | TARGET box: a cloud gets a red ✗ and drops into a small CLUES box; "POLLUTION TOMORROW" slides into TARGET |
| 8 | for_whom | NAR: "But a forecast for whom? Just think once. A number that nobody uses is just a number. So let me introduce the people of this story." | A lonely "??" number in an empty room; three grey silhouettes walk in |
| 9 | asha | NAR: "First, Asha madam. She runs a primary school in Delhi. Every evening, she decides if six hundred children will have their morning assembly outside, or inside. She is the one who needs our answer." | Silhouette 1 → Asha; "primary school · Delhi"; 600 dots fill a ground; cast card |
| 10 | rishi_intro | NAR: "Second, Rishi. A Java developer, like many of you. He is learning ML with us, and whenever something does not make sense, he will stop me and ask." | Silhouette 2 → Rishi; `String job = "Java developer";` types; "✋ stops & asks" |
| 11 | rishi_hi | RISHI: "Hi, I am Rishi. I write Java. I will ask the doubts you are shy to ask." | Yellow card "✋ MEET RISHI" |
| 12 | rival | NAR: "And third, the rival. Not a person, a habit. Asha madam's old method: tomorrow will be like today. In ML, we call it the persistence baseline. And every model we build has to beat it." | Silhouette 3 → grey dashed line; TODAY bar copies into TOMORROW; nameplate **PERSISTENCE**; stamp "EVERY MODEL must beat it" |
| 13 | catch | NAR: "On most days it works, because Delhi's air changes slowly. But it fails exactly on the days that matter. The evening the wind drops. The week the crop-burning smoke arrives. The morning after Diwali. It is always one day late." | Line chart: real line spikes; grey persistence line lags one day; icons (still flag, smoke, diya); missed day flashes red "600 children outside" |
| 14 | recall | NAR: "So, remember this. One real project. Delhi's air, tomorrow. Three characters. In part two: the language of air, the rules of the game, and the plan." | Recall card **real project · Delhi's air, tomorrow · 3 characters**; "Part 2 →" |

## Part 2 — The language, the rules, the plan (≈2:50, ~430 words)

| # | id | Voice | On screen |
|---|---|---|---|
| 1 | open | NAR: "Last time, we met Asha madam, Rishi and the rival. Now, before we predict anything, we need three things. The language of air. The rules of the game. And the plan." | Part 1 recall card flips; three chips: LANGUAGE · RULES · PLAN (chapter bar follows them) |
| 2 | pm25 | NAR: "See, the air has tiny dust in it. The dust we care about is PM2.5. Particles smaller than two point five micrometres, small enough to pass from the lungs into the blood. We measure it in micrograms per cubic metre. More dust, bigger number." | Zoom into air → particles; ruler "≤ 2.5 µm"; TermCard **PM2.5**; lungs → blood path; a 1 m³ wire cube fills with dots → **µg/m³** |
| 3 | doubt_pm | RISHI: "Wait, is 2.5 a version number?" | Yellow DOUBT card; "v2.5" label |
| 4 | pm_answer | NAR: "No, no. It is the size. Two point five micrometres, or smaller." | "v2.5" morphs into "≤ 2.5 µm" |
| 5 | daily | NAR: "Sensors measure it every hour. For one day, we keep one number, the twenty-four hour average. That number, for tomorrow, is what we predict. And India's pollution board, CPCB, puts it into six categories, from Good to Severe." | 24 hourly bars squash into one "24-hour mean" → "TOMORROW = target"; CPCB table builds: Good · Satisfactory · Moderately polluted · Poor · Very Poor · Severe |
| 6 | line | NAR: "Here's the catch. For Asha madam, only one line matters. Up to ninety, the assembly can be outside. From ninety-one, Poor, the children stay indoors. Remember this number. Ninety-one." | Red dashed line between Moderately polluted and Poor; stamp **91 = POOR**; outside/indoors arrows |
| 7 | rules | NAR: "Now, the rules. One: we forecast at six pm, using only what exists at six pm. Two: our average mistake, what ML calls MAE, must be at least ten percent smaller than persistence's. Three: never miss more Poor days than persistence does. Because a false alarm keeps children inside for nothing, but a missed Poor day sends them into bad air." | Blackboard: three rules chalk-write; clock wall at 18:00; gaps between forecast and real dots collect into an "MAE" bar with a "−10%" notch; amber "false alarm" vs red "missed Poor day" (red grows) |
| 8 | data | NAR: "And the plan starts with real data. Government sensors, collected free by OpenAQ. Fifty stations had two years of history. Forty-four were still reporting." | Delhi map; "2 years" filter; counter 50 → 44 |
| 9 | doubt_44 | RISHI: "Forty-four stations! We train on all of them?" | Yellow DOUBT card |
| 10 | one_station | NAR: "No. Forty-four stations means forty-four sets of problems before we see even one error number. So version one is one station, R K Puram. End to end first, then we widen." | 44 dots with warning icons fade to one glowing dot; card **D-005 · SIGNED** |
| 11 | acts | NAR: "One row is one question: today's clues until five pm, and tomorrow's average as the answer. And the journey has five acts. Ask the right question. Collect the data. Get the first honest score. Fix the data and build better clues. And prove it." | Clues + answer slide into one table row; project map DAF-01…18 groups into 5 coloured acts lighting in turn |
| 12 | envelope | NAR: "Our model has already sat the mock tests and the monthly exams, and it was not as easy as you think. One exam is left. The sealed paper. Will it beat the rival? We open it together, at the end." | Three report cards; the third is a wax-sealed envelope, wobbling |
| 13 | recall | NAR: "So, remember. PM2.5. Ninety-one is Poor. Persistence is the rival. Three rules, one station, five acts. Episode one, DAF-01. Before one line of ML, we build the house." | Final recall card; title **DELHI AIR FORECAST · ML for a Java developer**; "Episode 1 · DAF-01 →" |
