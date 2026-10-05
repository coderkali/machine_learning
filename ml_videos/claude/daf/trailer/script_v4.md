# DAF Trailer — script v4 (three parts, ≈2:30–3:00 each, 9:16)

**Why v4 (Kali, 2026-10-04):** v3 jumped straight into the story. A real creator first says
*why we are here and what we are solving*, then introduces the people, then teaches the
new words. So the trailer becomes three parts:

1. **Why this project?** From 40 topics to one real project → why Delhi's air → what we
   predict → the cast.
2. **The language of air.** PM2.5 · µg/m³ · 24-hour average · the CPCB table · 91 = Poor ·
   Asha's 6 pm decision · the rival gets its real name: persistence.
3. **The rules and the journey.** The rules of the game (MAE, recall) · the data (50 → 44 → 1) ·
   one row = one question · five acts · the sealed exam → Episode 1.

**NAR** = narrator (Viraj, later Kali) · **RISHI** = Raj, only on a yellow DOUBT card · Asha = shown only.
Facts: `MACHINE_LEARNING/04_ML/` (40 topic folders), project `README.md`,
`docs/requirements.md`, `docs/phases/01_requirements.md` (PM2.5 meaning, CPCB table),
`D-001`, `D-005`, `project_status_summary.md`.

---

## Part 1 — Why this project? (≈2:30)

| # | id | Voice | On screen |
|---|---|---|---|
| 1 | journey | NAR: "See, so far we have learned a lot. Python. Pandas. Cleaning data, missing values, outliers, scaling. Then the models. Linear regression, Ridge, Lasso, decision trees, ensembles, cross-validation. Forty topics, each one in its own notebook." | Title card "WHY THIS PROJECT?" → a 5×8 grid of 40 small notebook tiles fills fast, each named as it's spoken (Python, Pandas, Missing values, Outliers, Scaling, Linear Reg, Ridge, Lasso, Trees, Ensembles, CV…); counter 0 → 40 |
| 2 | gap | NAR: "But here's the catch. Every one of those notebooks came with a clean little dataset and a clear instruction. Apply this model. Real work never looks like that. Nobody gives you a clean CSV. They give you a problem." | One tile zooms in: a neat `data.csv` + `Ridge().fit()`; on "never" both get a red strike; a tangled "PROBLEM" knot drops in with a thud |
| 3 | java | NAR: "You know this from Java itself. Learning collections, streams and Spring one by one is one thing. Building a full service where all of them work together is a different skill." | Three separate Java tiles (Collections · Streams · Spring) slide together and snap into one "SERVICE" box with a green ✓ |
| 4 | project | NAR: "So now it is time. One real project, from raw data to a running service. All those topics, working together, on one problem." | The 40 tiles fly into a pipeline: raw data → clean → features → model → API; the pipeline glows end to end |
| 5 | why_delhi | NAR: "Now, which problem? I wanted three things. First, real data that is free to use. Second, a problem that matters to real people. Third, a question where the answer comes back every single day, so we always know if we were right. Delhi's air gives us all three." | Checklist of three; each ticks on its word (sensor icon · people icon · calendar with a ✓ per day); on "Delhi" a map pin drops and a stamp "DELHI AIR" lands over the list |
| 6 | winter | NAR: "Every winter, Delhi's air turns bad. And it is not a rare event. It happens again and again. So the question is very simple. Will the air be safe tomorrow?" | Delhi skyline; haze thickens month by month (Oct → Jan strip); the question types out big: "SAFE TOMORROW?" |
| 7 | not_weather | NAR: "Now, don't get confused. We are not forecasting the weather. We are forecasting the air, tomorrow's pollution number. Weather is only a clue we will test, like wind and humidity." | A "TARGET" box: a cloud icon tries to enter, gets a red ✗ and drops into a smaller "CLUES" box (wind, humidity); "PM2.5 TOMORROW" slides into TARGET |
| 8 | for_whom | NAR: "But a forecast for whom? Just think once. A number that nobody uses is just a number. So let me introduce the people of this story." | A lonely "??" number floats in an empty room, shrugs; then three grey silhouettes walk in |
| 9 | asha | NAR: "First, Asha madam. She runs a primary school in Delhi. Every evening, she decides if six hundred children will have their morning assembly outside, or inside. She is the one who needs our answer." | Silhouette 1 → Asha; "primary school · Delhi"; 600 dots fill a ground; bubble "outside or inside?"; cast card ASHA MADAM · needs the answer |
| 10 | rishi_intro | NAR: "Second, Rishi. A Java developer, like many of you. He is learning ML with us, and whenever something does not make sense, he will stop me and ask." | Silhouette 2 → Rishi; `String job = "Java developer";` types; "✋ stops & asks" badge |
| 11 | rishi_hi | RISHI: "Hi, I am Rishi. I write Java. I will ask the doubts you are shy to ask." | Yellow card "✋ MEET RISHI" |
| 12 | rival | NAR: "And third, the rival. Not a person, a habit. Asha madam's old method. Tomorrow will be like today. Every model we build has to beat it." | Silhouette 3 → grey dashed line; TODAY bar copies into TOMORROW slot; stamp "EVERY MODEL must beat it" |
| 13 | recall | NAR: "So, remember this. One real project. Delhi's air, tomorrow. And three characters. In part two, we learn the language of air: what PM2.5 means, and when the air becomes Poor." | Recall card: **real project · Delhi's air, tomorrow · 3 characters**; cast row; "Part 2: the language of air →" |

## Part 2 — The language of air (≈2:45)

| # | id | Voice | On screen |
|---|---|---|---|
| 1 | open | NAR: "Last time, we met Asha madam, Rishi and the rival. Now, before we predict anything, we must speak the language of air. Because you cannot predict what you cannot measure." | Part 1 recall card → flips to a dictionary "AIR · A–Z" |
| 2 | pm25 | NAR: "See, the air has tiny dust in it. The dust we care about is called PM2.5. Particles smaller than two point five micrometres. Small enough to pass from the lungs into the blood. That is why it matters so much for children." | Zoom from skyline into air → floating particles; one particle gets a ruler "2.5 µm"; TermCard **PM2.5**; particle path: lungs → blood (simple body outline) |
| 3 | doubt_pm | RISHI: "Wait, what is the 2.5? A version number?" · NAR: "No, no. It is the size. Two point five micrometres, or smaller. Nothing to do with versions." | Yellow DOUBT card; then "v2.5" label morphs into "≤ 2.5 µm" |
| 4 | unit | NAR: "Now, how do we measure it? In micrograms per cubic metre. Just imagine one box of air, one metre on every side. We weigh the dust inside it. More dust, bigger number." | A 3D wire cube "1 m × 1 m × 1 m" fills with dots; a scale weighs them; label **µg/m³** |
| 5 | daily | NAR: "The sensors measure this every hour. But for one day, we keep one number: the twenty-four hour average, from midnight to midnight. And that average, for tomorrow, is what our model predicts." | 24 hourly bars for one day → squash into one bar "24-hour mean"; it slides into a box "TOMORROW = our target" |
| 6 | table | NAR: "To make the number useful, India's pollution board, CPCB, gives a table with six categories. Good, up to thirty. Satisfactory, up to sixty. Moderately polluted, up to ninety. Then Poor, Very Poor, and Severe." | The CPCB table builds row by row with colour bands (green → maroon) and Asha's action per row (outside · outside · no running · indoors · indoors · indoors + parents told) |
| 7 | line | NAR: "Here's the catch. For Asha madam, only one line matters. Up to ninety, the assembly can be outside. From ninety-one, the children stay indoors. Remember this number. Ninety-one." | Red dashed line cuts the table between Moderately polluted and Poor; stamp **91 = POOR**; outside/indoors arrows on each side |
| 8 | winter | NAR: "And in winter, Delhi lives in the worst rows of this table. Poor days are not rare there. They are normal." | Calendar Nov–Jan; most days slide into the red rows |
| 9 | story | NAR: "Now the story. Every evening at six, Asha madam must decide. But tomorrow's air does not exist yet. So what does she do? She copies today's number to tomorrow. In ML, this simple method has a name: the persistence baseline. Our rival." | Clock → 18:00; TOMORROW box with "?"; today's bar copies over; the rival card gets a nameplate **PERSISTENCE BASELINE** |
| 10 | catch | NAR: "On most days it works, because Delhi's air changes slowly. But it fails exactly on the days that matter. The evening the wind drops. The week the crop-burning smoke arrives. The morning after Diwali. The rival is always one day late." | Line chart: real line spikes over 91; grey persistence line lags by one day; icons (still flag, smoke, diya); missed day flashes red "600 children outside" |
| 11 | doubt_jump | RISHI: "So our model must see the jump one day before it happens?" · NAR: "Exactly. That is the whole game." | Yellow DOUBT card; then a blue "model" line rises one day early (shown as a dashed hope line, no numbers) |
| 12 | recall | NAR: "So, the language of air. PM2.5. Micrograms per cubic metre. The twenty-four hour average. Ninety-one means Poor. And the rival has a name: persistence. In part three: the rules of the game, the data, and the journey." | Recall card with the five words; "Part 3: rules & journey →" |

## Part 3 — The rules and the journey (≈2:45)

| # | id | Voice | On screen |
|---|---|---|---|
| 1 | open | NAR: "We know the problem, and we know the language. Now, the rules. Because without rules, every model looks good." | Recall chips from Parts 1–2 slide aside; a blackboard drops in |
| 2 | rule1 | NAR: "Rule one. We forecast at six pm, using only what exists at six pm. Today's readings until five o'clock, yes. Tomorrow's real air, never." | Clock 18:00; a timeline with a wall at 18:00; data behind the wall is greyed with a lock |
| 3 | mae | NAR: "Rule two. Beat the rival on the average mistake. In ML, we call it MAE, mean absolute error. How far off we are, on an average day. We must be at least ten percent better than persistence." | Forecast vs real dots with gap lines; gaps collect into one bar "MAE"; two bars rival vs model with "−10%" target notch |
| 4 | recall_rule | NAR: "Rule three. Never miss more Poor days than the rival does. Because a false alarm keeps children inside for nothing. But a missed Poor day sends them into bad air. Which one is worse? Right?" | Two cards flip: amber "false alarm" vs red "missed Poor day" (grows); the counted-catch idea labelled **recall** |
| 5 | data | NAR: "Now, the data. Delhi has government air sensors, and OpenAQ collects them for free. We kept only stations with at least two years of history. Fifty stations passed. Forty-four were still reporting recently." | Delhi map; dots; "2 years" filter sweep; counter 50 → 44 |
| 6 | doubt_44 | RISHI: "Forty-four stations! We train on all of them?" · NAR: "No. Here's the catch. Forty-four stations means forty-four sets of problems before we see even one error number. So version one is one station. R K Puram. End to end first, then we widen." | Yellow card; 44 dots with warning icons fade to one glowing dot; decision card **D-005 · SIGNED** |
| 7 | row | NAR: "And what does the model actually see? One row is one question. The clues: today's readings until five pm, and the last few days' average. The answer: tomorrow's twenty-four hour average." | Hourly bars; before-17:00 bars glow "clues"; next day squashes into "answer"; they slide into one table row |
| 8 | acts | NAR: "From one station, we get a few hundred days, and only one winter. And the journey has five acts. Ask the right question. Collect the data. Get the first honest score. Fix the data and build better clues. And prove it." | Rows stack "≈ 488 usable days"; project map DAF-01…18 groups into 5 coloured acts lighting in turn |
| 9 | doubt_shuffle | RISHI: "In Java tests I shuffle my data. Why not here?" · NAR: "Because in real life, tomorrow never comes before today. You will see it in act three." | Day-cards shuffle; a hand stops them; they re-order into a calendar line "time →" |
| 10 | doubt_fancy | RISHI: "And the fancy models always win, right?" · NAR: "I'll tell you one thing. The fanciest model is not always the winner. You will see it with your own eyes, in act five." | Two racers "Simple" and "Fancy"; race freezes before the finish with "?" |
| 11 | envelope | NAR: "Our model has already sat the mock tests and the monthly exams, and the results were not as easy as you think. One exam is left. The sealed paper. Will it beat the rival? We open it together, at the end." | Three report cards; the third is a wax-sealed envelope, wobbling |
| 12 | recall | NAR: "So, remember. Six pm. Beat the rival by ten percent. Never miss more Poor days. One station, one row is one question, five acts. Episode one, DAF-01. Before one line of ML, we build the house." | Final recall card; title **DELHI AIR FORECAST · ML for a Java developer**; "Episode 1 · DAF-01 →" |
