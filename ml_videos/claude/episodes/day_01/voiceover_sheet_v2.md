# Day 1 — What is Machine Learning? · Voiceover sheet v2

**Approved by the creator 2026-09-27** after a viewer test (a Java dev watching cold couldn't tell
what the video was about). Replaces v1 (moved to `ml_videos/_backup/2026-09-27/claude/episodes/day_01/voiceover_sheet.md`).

What changed vs v1:
1. **Context first:** the first words are the topic, "What is machine learning?". Spam is the
   example, not the topic.
2. **One Java thread:** from beat 2 the rules are *your* Java if-else; beat 6 closes that loop.
3. Shorter beats 3 and 5; "computers follow rules perfectly" and "a strange message can fool it" were
   cut for clarity. 192 spoken words.
4. Voice: **Indian English** (replaces Brian), model eleven_v3 with emotion tags.
5. Update after the creator's review: opener line added; the ending no longer says "first ML tool is Python".

Marks: **bold** = stress · `(beat)` ≈ 0.5 s · `(long beat)` ≈ 1 s · `↗` = rising end.
The machine-readable version (v3 tags + v2 fallback) is `remotion/src/episodes/day_01/voice.json`.

| # | Chapter | Beat type · tone | Voice |
|---|---|---|---|
| 1 | QUESTION | Hook · confident → curious | "**This is Day 1 of ML for a Java developer.** What is **machine learning**? ↗ Your **spam folder** uses it every day. A *'you won a prize'* email lands in spam… and **nobody** wrote a rule for it. (long beat) So how did it **know**? ↗" |
| 2 | PROBLEM | Problem · matter-of-fact → wry → sigh | "As **Java** developers, we'd write a rule: if the email says prize, it's spam. But **real** emails say prize too. So we add exceptions… and the if-else grows into a **maze**. (beat) We can't write a rule for **every** case." |
| 3 | IDEA | Insight · thoughtful, quieter (0.6 s gap before) | "Machine learning **flips** it. (beat) Instead of writing the rules… we show the computer **examples**." |
| 4 | LEARN | Explain → term reveal · confident | "Give it emails labeled **spam** or **safe**. It finds the **clues** spam tends to have, and **corrects** itself when it's wrong. (long beat) What it learns… is called a **model**. Learning it is called **training**." |
| 5 | PREDICT | Caveat · curious → honest → warm | "Now a **new** email arrives. The model checks the clues and says… **likely** spam. (beat) It's a prediction, not a **promise**… so **people** still check." |
| 6 | IN JAVA | Java lens · warm, smiling | "So in **Java** terms: no more if-else maze. Just **two** steps: **train** on examples… then **predict** on new input. We'll write that code **later** in the series." |
| 7 | RECAP | Takeaway → done → teaser · confident → excited → lean in (0.15 s gap before) | "Machine learning means learning from **examples** to predict **new** cases. **Day 1 done!** (long beat) Next, Day 2… before we teach machines, we learn the **language** ML speaks… through **Java** eyes. ↗" |

Facts come from `04_ML/01_What_Is_ML/Concept/01._LEARNING.MD` (traditional programming vs ML; the
spam-filter worked example; model = the learned program; training → prediction pipeline).
