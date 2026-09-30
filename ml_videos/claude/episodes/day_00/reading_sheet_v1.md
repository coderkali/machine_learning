# Intro "Start here" — RE-VOICE in Kali's own voice · READING SHEET v1

Source: the approved final (v5) text, `remotion/src/episodes/day_00/voice.json` (= `voiceover_sheet_v3.md` beats 1–4
+ `voiceover_sheet_v2.md` beats 5–12). **Same words, same visuals.** The only new line is the host line in part 1
(from the voice test `day_98`, which the intro scenes already animate: host card on "Kali", "engineer", "years").

How to read: one line = one breath. **Bold** = push that word. `/` = short pause. `//` = longer pause (before a reveal).
↗ = let your voice go **up** at the end (a real question). Stumble? Pause 2 s and read the whole line again.

**Why "read it exactly as written" matters here:** the animation is already built and every picture pops on a
spoken word. The words under "Cues" are the ones the video waits for: if you say them, the visuals land on time.
Your own phrasing is great for new episodes; for this re-voice, stick to the lines.

Record **one file per part** into `~/Documents/Instagram_Youtube_Reels/Recodings/Intro/`, named as in the heading
(`Question.m4a`, `Products.m4a`, …). iPhone Voice Memos (Lossless), sitting, same quiet room as Day 2.

Pronunciation: NumPy = "NUM-pie" · Pandas = "PAN-duhs" · gradient = "GRAY-dee-ent" · ensembles = "on-SOM-buls" ·
capstone = "CAP-stone" · "84" = say "**eighty-four**" · "2 to 12" = "two **to** twelve" (not "two-twelve").

Energy tip (your Day 2 number was 4–6 semitones; Viraj 9–12): on the ↗ lines, really lift; on the **bold** words,
go a little higher *and* a little slower. Smile on the warm parts — it's audible.

---

## 1 · Question  (excited → warm → curious ↗)
This is our **new series**, / ML for a **Java** developer.
I'm **Kali**, / a software **engineer** / with thirteen-plus **years** in the industry,
and I'm **learning** ML / the way you would, / through **Java eyes**.
It's for **every** Java developer / who's **curious** about machine learning
and wants to **see** how it works, / **visually**.
// So first, / **why** should a Java developer / learn ML at **all**? ↗

Cues: new · Kali · engineer · years · learning · eyes · every · curious · see · works · visually · so · why · all

## 2 · Products  (confident, matter-of-fact → thoughtful)
**Because** / software is **changing**.
**More** and more apps / now **run** on machine **learning**.
**Recommendations**, / **fraud** checks, / **search**, / **spam** filters.
// **Those** features are **models**, / **not** if-else **rules**.

Cues: because · changing · more · run · learning · recommendations · fraud · search · spam · those · models · not · rules

## 3 · Services  (curious ↗ → confident; "Us." stands alone)
And **who** connects those models / to the **app**? ↗
// **Us.**
Our Java services / **send** them **data**,
**call** them through an **A-P-I**, / and act on the **answer**.
So ML is becoming / part of **our job**.

Cues: who · app · us · send · data · call · API · answer · our job

## 4 · Team  (warm → confident)
**Learn** how it works, / and you get the **most** out of it.
You can **build** the feature, / **test** it,
know when it will **fail**,
and **speak** the data team's **language**.
// That's a real **edge** / for a Java developer.

Cues: learn · most · build · test · fail · speak · data · language · edge

## 5 · Map  (slow, thoughtful → confident; the turning point)
// **So** …
I built a **map**.
**Eighty-four** days.
One **idea** a day, / in the **order** / I actually **learned** it.

Cues: so · map · eighty-four · idea · order · learned

## 6 · Python  (confident, a small smile on "Java eyes")
It starts where I **started**.
Day **1**: / what is **machine** learning?
Then Days **2** to 12: / **Python**, / through Java **eyes**.
**NumPy**, / **Pandas**, / **charts**, / and **two** small projects.

Cues: started · 1 · machine · 2 · Python · eyes · NumPy · Pandas · charts · two

## 7 · Math  (confident, reassuring on "only")
With **Python** in hand, / Days **13** to 21:
only the **math** you need.
**Statistics**, / **vectors**,
and the **slope** / behind **gradient** descent.

Cues: Python · 13 · math · statistics · vectors · slope · gradient

## 8 · Data  (confident, curious on "luck")
Then we **point** that math / at **real** data.
Days **22** to 36: / reading data like a **scientist**.
**Spread**, / **correlation**,
and **tests** / that separate real **patterns** / from **luck**.

Cues: point · real · 22 · scientist · spread · correlation · tests · patterns · luck

## 9 · ML  (build up → EXCITED on "the real machine learning" → confident list)
Once you can **read** data like that, // Days **37** to **78**.
// The real **machine learning**.
**Cleaning** data, / predicting **numbers**, / predicting **classes**,
finding **groups**, / and **judging** every model **honestly**.

Cues: read · 37 · 78 · machine · cleaning · numbers · classes · groups · judging · honestly

## 10 · Ship  (confident, "we made it")
And finally, / Days **79** to 84: / making it **real**.
**Tuning**, / **ensembles**, / **saving** a model,
and a full **capstone** project.

Cues: 79 · real · tuning · ensembles · saving · capstone

## 11 · Promise  (calm, sincere — this is your promise)
**Every** day is one **idea**, / with a **Java** lens, / **explained** properly.
And when a topic needs more **time**, / it gets a **part two**.

Cues: every · idea · Java · explained · time · part

## 12 · Start  (curious → warm; lift on the last line, then stop)
After Day **84**: / **deep** learning, / then **transformers** and **agents**.
// But **Day 1** starts **now**.
**Follow** along, / and **by** Day 84,
you'll have built a real **ML project**, / start to **finish**. ↗

Cues: 84 · deep · transformers · agents · 1 · follow · by · ML
(End on "finish". No "thank you for watching" — the video ends on this line.)

---
≈ 355 words → about 2 min 20 s at your Day 2 pace, ≈ 2 min 10 s after pause clean-up (inside 150 s).

After recording: Claude runs `analyze-recording.mjs` → `clean-voice.mjs day_00 --from …/Recodings/Intro
--map Question=question,Products=products,Services=services,Team=team,Map=map,Python=python,Math=math,Data=data,ML=ml,Ship=ship,Promise=promise,Start=start`
→ master / captions / timeline → re-render with the same scenes (re-cued to your words).
