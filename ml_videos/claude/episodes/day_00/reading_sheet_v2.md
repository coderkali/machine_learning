# Intro "Start here" — RE-VOICE in Kali's own voice · READING SHEET v2 (conversational)

Replaces v1 (one line per breath, which made the reading sound read-aloud). Same 12 parts and the same story as the
approved final (v5, `remotion/src/episodes/day_00/voice.json`), now in the desi-teacher style (phrases from
`claude/PHRASE_BANK.md`, flowing paragraphs) and with your host line in part 1.

How to record: read each part twice out loud, then record it **explaining in your own words** while glancing at it,
like you're talking to a junior Java developer sitting next to you. **Bold** = the key word to land clearly (the
animation pops on most of them, so try to keep those words; the rest can be yours).
One file per part into `~/Documents/Instagram_Youtube_Reels/Recodings/Intro/`:
`Question, Products, Services, Team, Map, Python, Math, Data, ML, Ship, Promise, Start` (.m4a).

Pronunciation: NumPy = NUM-pie · Pandas = PAN-duhs · gradient = GRAY-dee-ent · ensembles = on-SOM-buls ·
"84" = **eighty-four** · "Days 2 to 12" = "two **to** twelve".
Don't open with "Hello everyone" (the topic has to land in the first 5 s), and stop after the last line of part 12.

---

## 1 · QUESTION — warm, then curious
I'm **Kali**, and this is a new series: **ML for a Java developer**. I'm a software **engineer** with thirteen-plus **years** in the industry, and I'm **learning** ML the way you would, through **Java eyes**. So this series is for **every** Java developer who is **curious** about machine learning and wants to **see** how it works, **visually**. So first, think about it: **why** should a Java developer learn ML at **all**?

## 2 · PRODUCTS — confident, "look around you"
See, **because** software is **changing**. More and more apps now **run** on machine learning: **recommendations**, **fraud** checks, **search**, **spam** filters. Those features are **models**, not if-else **rules**.

## 3 · SERVICES — ask, pause, then answer
Now, **who** connects those models to the **app**? … **Us.** Our Java services **send** them **data**, **call** them through an **API**, and act on the **answer**. So ML is becoming part of **our job**, right?

## 4 · TEAM — warm, "this is what you get"
And the main thing is: **learn** how it works, and you get the **most** out of it. You can **build** the feature, **test** it, know when it will **fail**, and **speak** the data team's **language**. That's a real **edge** for a Java developer.

## 5 · MAP — slow down, this is the turn
So… I built a **map**. **Eighty-four** days. One **idea** a day, in the **order** I actually **learned** it.

## 6 · PYTHON — confident, "it starts with me"
It starts where I **started**. Day **1**: what is **machine** learning? Then Days **2** to 12: **Python**, through Java **eyes**. **NumPy**, **Pandas**, **charts**, and **two** small projects.

## 7 · MATH — reassuring
Now, don't worry about the math. With **Python** in hand, Days **13** to 21 cover only the **math** you need: **statistics**, **vectors**, and the **slope** behind **gradient** descent.

## 8 · DATA — curious, land "luck"
Then we **point** that math at **real** data. Days **22** to 36: reading data like a **scientist**. **Spread**, **correlation**, and **tests** that separate real **patterns** from **luck**.

## 9 · ML — build up, excited on "the real machine learning"
Once you can **read** data like that… Days **37** to **78**. This is the big one: the real **machine learning**. **Cleaning** data, predicting **numbers**, predicting **classes**, finding **groups**, and **judging** every model **honestly**.

## 10 · SHIP — "we made it"
Okay, and finally, Days **79** to 84: making it **real**. **Tuning**, **ensembles**, **saving** a model, and a full **capstone** project.

## 11 · PROMISE — calm, sincere
So, basically: **every** day is one **idea**, with a **Java** lens, **explained** properly. And when a topic needs more **time**, it gets a **part** two. Simple, right?

## 12 · START — curious, then warm; lift at the end and stop
After Day **84**: **deep** learning, then **transformers** and **agents**. But Day **1** starts now. **Follow** along, and **by** Day 84, you'll have built a real **ML** project, start to finish.

---
≈ 380 words → about 2:40 at your pace, ≈ 2:20–2:30 after pause clean-up (right at the 150 s limit; if it runs
over, parts 7 and 10 are the easiest to shorten).
Phrases, once each, only where they do a job: think about it · See · Now · right? · the main thing is · Now, don't worry ·
This is the big one · Okay · So, basically · Simple, right?
Facts are unchanged from the approved intro (arcs and day ranges = `SERIES_ROADMAP.md` §4; nothing new added).
After recording: analyze → `clean-voice.mjs day_00 --from …/Recodings/Intro --map Question=question,Products=products,
Services=services,Team=team,Map=map,Python=python,Math=math,Data=data,ML=ml,Ship=ship,Promise=promise,Start=start`
→ Voice Changer → master (no music) → re-cue the existing scenes to your words (`opt()` cues) → render → QA.
