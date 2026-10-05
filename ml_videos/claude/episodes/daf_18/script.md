# DAF-18 explainer — "The Board Paper" (project video, id `daf_18`)

Source (facts only from here): `18_Projects/01_Delhi_Air_Forecast/notebooks/18_final_test_and_model_card.ipynb`
and `18_visual_walkthrough.ipynb` (story, 9 steps, toy town). Numbers on screen: the frozen DAF-17 numbers
(251 train days, 130 test days from 1 Mar 2026, CV 36.5 vs 37.9, 3.8 % vs 10 % target, Poor = 91) and the
toy-town numbers (really calculated in the notebook). **No real DAF-18 test score exists yet** (the main
notebook is still a plan), so the video never shows one.

Length target ≈ 150 s · 9 beats · 6 chapters: PROBLEM · THE RULES · THE TEST · THE VERDICT · THE SAVE · RECAP

| # | Chapter | Voice (draft) | On screen |
|---|---|---|---|
| 1 | PROBLEM | I'm Kali, and this is DAF-18 of my Delhi Air Forecast project. Honestly, this ticket confused me at first, so let me explain it like a school story. See, Asha madam must decide every evening: tomorrow morning, do 600 children stand outside for assembly, or stay indoors? For that she needs a guess of tomorrow's PM2.5. | Title card "DAF-18". School + 600 kid icons pop; PM2.5 meter rises past the 91 "Poor" line; "?" over tomorrow |
| 2 | PROBLEM | Now, she has two ways to guess. Way one, her old method, persistence: look at today's reading and say tomorrow will be the same. Free, no computer. Way two, a small machine-learning model, Ridge. So the whole project asks one question: is the model really better than the free method? Because if not, why keep the computer? | Two cards slide in (Persistence / Ridge), arrows today→tomorrow; big "Better?" stamp wobbles |
| 3 | THE RULES | Here's the catch. A model can only be judged on days it has never seen. So her 381 days are split: 251 study days, and 130 test days locked in a sealed envelope, from the first of March. Study days are the chapters. The test days are the board exam paper. | Timeline bar fills; dashed red line at "1 Mar 2026"; left = 251 STUDY, right = 130 envelope with lock |
| 4 | THE RULES | Now think about the temptation. She opens the envelope, sees a poor score, quietly changes one setting, opens it again. Score looks better. But then the test days have started teaching the model, and the score is a lie. So the rule is simple: open the envelope once. | Envelope opens → red score → hand tweaks a knob → envelope opens 2nd time → green score gets a strike-through "LIE"; big "ONCE" |
| 5 | THE RULES | And before she opens it, the principal writes the pass marks on the board. Rule one: the model's average mistake, the MAE, must be at least ten percent lower than persistence. Rule two: it must catch at least as many Poor days, ninety-one or more. Both must hold, right? And honestly, in the mock tests the win was only 3.8 percent. So "not met" is possible. | Blackboard writes rule 1 / rule 2 with two empty ✔ boxes; meter 3.8 % vs 10 % line; "?" |
| 6 | THE TEST | Let's see it on a toy town, 22 made-up readings. Ridge learns from the 14 study rows: tomorrow equals 0.30 times today plus 65. Then, one time, the 7 sealed rows. Persistence is off by 18.6 on average, Ridge by 15.0. That is 19 percent better, and both methods catch 3 of 4 Poor days. | Toy dots + two lines (grey = same, blue = learned) draw; 7 envelope rows flip open one by one with error sticks; counters 18.6 → 15.0; ✔ ✔ **MET** stamp |
| 7 | THE VERDICT | Okay, but a good student does not only count marks. She opens the answer sheet. Which days did the model lose the most? In the toy, the air suddenly cleaned up overnight, and nothing in "today" warned about it. These are patterns, so the ten worst days go into the report as failure cases. | Bars of errors sorted; two worst highlighted red with reason tags ("sudden swing", "long smog spell"); table row writes in |
| 8 | THE SAVE | Last, she saves the model in one file, with joblib. New session, nothing in memory, load it back, and check: the same day gives 100.7 before and 100.7 after. Then the model card, like the paper inside a medicine box: what it is for, what data, how good, where it fails, and when not to use it. | Model → file icon → laptop closes/reopens → loads; two equal numbers with ✔; model card page builds with blue fact boxes + two red boxes |
| 9 | RECAP | So, basically, DAF-18 is not about making the model better. It is about testing it once, against pass marks written before, and reporting honestly, even if the result is bad. DAF-18 done. Next: DAF-19, the live service. | Recap flow of 9 mini-icons lights up; "DAF-18 DONE" card; "NEXT → DAF-19" chip |

## Open points for the creator
- Opener: series rule is "This is Day N…". This is a project ticket, so beat 1 uses "this is DAF-18 of my Delhi Air Forecast project".
- "381 days" in beat 3 = 251 + 130 (my sum, not in the notes) — I can drop that number and say "her days are split".
- Next ticket DAF-19 is taken from the notebook line "DAF-19 and DAF-20 (the live service) will load this file".
