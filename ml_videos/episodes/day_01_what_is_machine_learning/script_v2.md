# Day 1 — What is machine learning?

**Working title:** Stop writing rules. Show examples.

**Audience:** Beginners, especially Java developers exploring machine learning.  
**Timed runtime:** 88 seconds (196 spoken words; about 134 words per minute overall).  
**Core idea:** When hand-written rules become brittle, a model can learn patterns from labeled examples and use them to make a fallible prediction.

## Story and narration

### 0–9s — The hook

**Visual:** Inbox card fills the screen. A suspicious email slides toward it; the blue robot catches the red envelope stamped “SPAM?”.

**Voiceover:** “Your inbox files a ‘you won a prize’ email as spam. Nobody wrote a rule for it. How did it know?”

### 9–21s — Why rules break

**Visual:** The robot tries `contains “prize” → spam`. A real offer gets blocked. More rule cards pile up; one exception knocks the stack over.

**Voiceover:** “Rule: prize means spam. Real offers use that word too. Add exceptions, and the rulebook becomes a maze. Computers follow rules perfectly; people can’t anticipate every case.”

### 21–31s — The change in approach

**Visual:** The rule cards clear. The robot lays out labeled spam and safe emails, then points to recurring clues across different messages.

**Voiceover:** “As the problem grew messier, a better question emerged: what if we showed computers examples instead of spelling out every answer?”

### 31–46s — Learning a pattern

**Visual:** Spam and safe examples flow through the learner. Clues light up, an early guess is corrected, and a simple “MODEL” card forms. The robot returns as a guide.

**Voiceover:** “Label emails spam or safe. The computer compares them, finds clues that tend to appear together, and adjusts its pattern from feedback. That learned pattern is a model; training is how examples shape it.”

### 46–59s — A new email

**Visual:** A never-before-seen email arrives. The model checks several clues and returns “Likely spam” on a meter that stops short of certainty. The robot puts it in a review tray.

**Voiceover:** “A new email arrives. The model checks its clues and predicts likely spam. Prediction isn’t a promise: a strange new message can fool it, so people stay in the loop.”

### 59–74s — Java developer connection

**Visual:** The robot replaces a growing stack of `if` statements with a tiny Java-style sketch: `model.train(emails, labels);` then `model.predict(newEmail);`. Label it “conceptual example”.

**Voiceover:** “For a Java developer, picture replacing a growing if-statement maze with two steps: train on labeled examples, then call predict for new input. Today, remember the shift; we’ll code it later.”

### 74–88s — Takeaway and next step

**Visual:** The robot stands beside “EXAMPLES → PATTERN → PREDICTION.” A short Day 2 teaser appears: “What counts as data? How do we load it in Java?”

**Voiceover:** “Machine learning learns from examples to predict new cases. Examples matter, and people still check results. Day 1 done. Next: what counts as data, and how do we load it in Java?”

## End card

**On screen:** `DAY 1 · ML FOR JAVA DEVELOPERS`  
`Examples → Pattern → Prediction`

## Production notes

- Keep the existing visual language and let the blue robot return as a guide in the examples, prediction, and Java beats.
- Keep the Java code clearly marked as conceptual pseudocode; APIs vary by library.
- Use the exact caption punctuation from this script. In particular, the line begins “That’s a prediction,” with no stray quote mark.
- Keep the voiceover natural and conversational; target a measured 130–140 words per minute, then time captions to the final recorded audio.
- Add a quiet instrumental bed only if it sits clearly below narration; confirm the final mix by listening on headphones and phone speakers.
- This is a proposed shorter revision. Preserve `final.mp4` until the revised narration and cut are produced and reviewed.
