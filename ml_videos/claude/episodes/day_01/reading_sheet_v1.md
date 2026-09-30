# Day 1 — What is Machine Learning? — RE-VOICE in Kali's own voice · READING SHEET v1

Source: the approved final (v2) text, `remotion/src/episodes/day_01/voice.json` (= `voiceover_sheet_v2.md`).
**Same words, same visuals.** One change: the series opener now introduces you —
"I'm Kali, and this is Day 1 of ML for a Java developer." (same as Day 2).

How to read: one line = one breath. **Bold** = push that word. `/` = short pause. `//` = longer pause (before a reveal).
↗ = let your voice go **up** at the end (a real question). Stumble? Pause 2 s and read the whole line again.

**Read it exactly as written:** the animation is already built and every picture pops on a spoken word. The words
under "Cues" are the ones the video waits for (e.g. the if-else "maze" grows on "maze", the MODEL card on "model").

Record **one file per part** into `~/Documents/Instagram_Youtube_Reels/Recodings/Day1/`, named as in the heading
(`Hook.m4a`, `Rules.m4a`, …). iPhone Voice Memos (Lossless), sitting, same quiet room as Day 2.

Pronunciation: "Day 1" = say it clearly, "**Day** … **one**" (on Day 2, Whisper heard "Day 2" as "a D2") ·
labeled = "LAY-buld" · "if-else" = "if … else" · can't = land the **t** (Day 2: "can't" was heard as "can").

Energy tip: this is the episode people see first. Lift on every ↗, slow down on the **bold** words, and let the
two surprises breathe: "nobody wrote a rule for it" and "Machine learning flips it."

---

## 1 · Hook  (confident → curious ↗)
I'm **Kali**, / and this is **Day 1** / of ML for a Java developer.
What is **machine learning**? ↗
Your **spam** folder / uses it every day.
A "you **won** a **prize**" email / **lands** in spam,
and **nobody** / wrote a **rule** for it.
// So **how** did it know? ↗

Cues: spam · won/prize · lands · nobody · rule · how

## 2 · Rules  (matter-of-fact → a bit wry → a small sigh)
As **Java** developers, / we'd write a **rule**:
if the email says **prize**, / it's **spam**.
But **real** emails / say prize **too**.
So we add **exceptions**, / and the if-else grows into a **maze**.
// We **can't** write a rule / for **every** case.

Cues: rule · prize · spam · real · too · exceptions · maze · can't · every · case

## 3 · Shift  (quieter, thoughtful — the big idea)
// Machine learning **flips** it.
**Instead** of **writing** the rules,
we show the computer **examples**.

Cues: flips · instead · writing · examples

## 4 · Training  (confident, teaching; two word reveals at the end)
Give it emails **labeled** / **spam** or **safe**.
It finds the **clues** / spam **tends** to have,
and **corrects** itself / when it's **wrong**.
// What it **learns** / is called a **model**.
Learning it / is called **training**.

Cues: labeled · clues · tends · corrects · wrong · learns · model · training

## 5 · Prediction  (curious → honest → warm)
Now a **new** email **arrives**.
The model **checks** the clues / and says: // **likely** spam.
It's a prediction, / not a **promise**,
so **people** still **check**.

Cues: new/arrives · checks · likely · promise · people · check

## 6 · Java  (warm, smiling — "between us Java devs")
So in **Java** terms: / no more if-else **maze**.
Just **two** steps:
**train** on examples, / then **predict** on new input.
We'll write that code **later** in the series.

Cues: maze · two · train · predict · later

## 7 · Takeaway  (confident → excited on "done" → lean in on "next"; then stop)
Machine learning means / learning from **examples** / to predict **new** cases.
// **Day 1 done!**
**Next**, Day 2:
before we teach machines, / we learn the **language** ML speaks,
through **Java eyes**.

Cues: examples · predict · cases · Day · done · next · language · Java/eyes
(End on "Java eyes". No "tomorrow", no "thank you for watching".)

---
≈ 200 words → about 85–90 s at your Day 2 pace, ≈ 80 s after pause clean-up.

After recording: Claude runs `analyze-recording.mjs` → `clean-voice.mjs day_01 --from …/Recodings/Day1
--map Hook=hook,Rules=rules,Shift=shift,Training=training,Prediction=prediction,Java=java,Takeaway=takeaway`
→ master / captions / timeline → re-render with the same scenes (re-cued to your words).
