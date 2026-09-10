# Task — Handwritten revision notes, take 3: SHORTER

Repository: `/Users/kaliprasad/Documents/MACHINE_LEARNING`

Read this whole file before you generate anything. The previous version of this
spec is **wrong** and produced pages that were rejected for being too dense.
This file replaces it.

---

## 0. Why the last attempt failed — read this first

The pages generated for `04_ML/38_Robust_Regression`, `04_ML/39_PCA` and
`04_ML/40_Logistic_Regression` were **correct, well drawn, and unusable**.
They were rejected for one reason: **too much information per page.**

The old spec caused this. It said:

> "packed edge to edge, almost no white space", "ink coverage must be >= 8.4%",
> "if a box has room left, **write more**".

**All three of those rules are now deleted.** Do not follow them. Do not
optimise for ink coverage. There is no density floor any more.

Concrete examples of what was over-written, so you recognise the pattern:

| Rejected page | What was wrong |
|---|---|
| `Robust_Regression_03` | Three loss formulas + a derivative/influence plot + a breakdown-point number line comparing four methods, all on one page. Graduate-level. |
| `Robust_Regression_06` | An 8-step MLOps checklist (split, pipeline, CV, baselines, deploy, monitor drift). Nothing to do with learning the concept. |
| `PCA_02` | A full 8-term loading equation **and** two loading tables. Three ways of saying one thing. |
| `Logistic_Regression_04` | `exp(w)` odds multipliers **and** `w x sd` standardised weights on one page. Two advanced readings at once. |

The learner is an experienced backend engineer who is new to ML. These notes
are for **revision before an interview or before the next class** — not a
textbook, not a reference manual, not a course.

---

## 1. The one rule that matters

**A page must be readable and absorbable in 60 seconds.**

If it takes longer, it is too full. Cut something. White space is now a
feature, not a defect. A page that is 40% empty and instantly clear beats a
full page that is complete.

When you have to choose between "complete" and "clear", **choose clear.**

---

## 2. Hard limits per page

These are not guidelines. A page that breaks any of them is rejected.

| Limit | Value |
|---|---|
| **One idea per page** | If you need the word "also", start a new page - or drop it |
| **Pages per topic** | **3 maximum.** Never 5, never 6 |
| **Words per page** | **120 maximum**, including labels |
| **Formulas per page** | **1**, and only if the idea genuinely needs it |
| **Diagrams per page** | **1** |
| **Bullets in a list** | **3 maximum** |
| **Tables** | **0**. If you want a table, you are writing a reference, not a note |
| **Ink coverage** | No floor. Anything from 3% up is fine |
| **Sentence length** | Under 12 words. Short sentences, one line each |

### Banned content — never put these on a page

- Derivatives, gradients, influence functions, proofs
- Deployment, monitoring, drift, CI, pipelines, MLOps checklists
- Hyperparameter tuning advice, cross-validation procedure
- Comparison tables of 4+ methods
- More than one "advanced reading" of the same coefficient
- Any API surface beyond the 3-5 lines that actually run the idea

If the notebook contains those, they stay in the notebook. Notes are not a
summary of the notebook. Notes are the **one thing worth remembering**.

---

## 3. The 3-page shape — use this every time

Every topic gets exactly this, and nothing more:

```text
Page 1  THE PROBLEM   the story, and the obvious thing that failed
Page 2  THE FIX       what the concept does about it, with one picture
Page 3  IN PRACTICE   the 3-5 lines of code, and one thing to watch out for
```

A topic that cannot fill 3 pages gets 2. That is a good outcome, not a
shortfall.

### Page 1 — The problem
- A named person, a real task, real numbers. 3-4 short lines.
- What they tried, and why it broke. 2-3 short lines.
- One picture of the failure.
- One line at the bottom: `So we need something that ...`
- **No formula on this page.**

### Page 2 — The fix
- One line: what the concept actually does. Plain English.
- One picture showing the fix, using the same story.
- **At most one formula**, in a box, with each symbol named in 3 words.
- Ends with `Remember:` and one sentence. That sentence is the whole lesson.

### Page 3 — In practice
- 3-5 lines of real code from the notebook. No imports unless essential.
- One `Watch out` box: the single most common mistake. One sentence.
- Nothing else. This page should look almost empty. That is correct.

---

## 4. The story

Keep the story from `17_Learning_As_Of_Now/shared/stories.json` for the topic.
Same person, same numbers, all three pages. The figure titles and axis labels
use that story's words too.

Shape: `<Name> wanted X -> tried the obvious thing -> it failed, here is why
-> so the fix is this.`

Never open a page with a definition.

---

## 5. Style — unchanged, this part was good

Keep the visual style of the rejected pages exactly. Only the **amount of
content** changes.

- **Page**: 1024 x 1536 portrait PNG. Ruled notebook paper, faint blue-grey
  rules, pink/red vertical margin line ~8% from the left.
- **Handwriting**: one neat handwriting font (*Caveat*, *Patrick Hand*,
  *Noteworthy*). Dark navy ink for body text.
- **Body size**: 17-19px. Slightly larger than before, because there is less
  to fit. Generous line spacing.
- **Headings**: orange/red, underlined. `LESSON N - <TITLE>` at the top.
- **Formula**: white box, teal border.
- **Remember / takeaway**: pale green fill, green border.
- **Watch out**: pale pink fill, red border, warning triangle.
- **Diagrams**: real rendered vector drawings, never ASCII art. Every axis and
  every series labelled, using the story's own words.

Diagrams stay simple too: **one message per diagram.** If a chart needs a
5-entry legend, it is too complicated - redraw it with 2 series.

---

## 6. Still forbidden (these rules survive from the old spec)

- Never truncate a sentence, never start a box with a sentence fragment.
- No raw markdown leaking through (`*`, `#`, backticks) - render it.
- No source filenames printed on the page.
- No sentence repeated twice on a page.
- Fix the learner's spelling and grammar when you rewrite.
- Use only facts, numbers and results that actually appear in the topic's
  `Concept/` notebooks. Never invent a result.

---

## 7. Self-check before you report

For each page you generate, answer these out loud. Any "no" means regenerate:

1. Can this page be read and understood in **60 seconds**?
2. Is it **one idea**, or did I sneak in a second one?
3. Is the word count **under 120**?
4. Are there **zero tables** and **at most one formula**?
5. Would a tired engineer at 11pm actually re-open this page?
6. Did I include anything from the **banned list** in section 2?
7. Could I **delete 20% more** and lose nothing important?

Then run:

```bash
python3 - <<'EOF'
from PIL import Image
import glob, sys
for p in sorted(glob.glob('<TOPIC_PATH>/Handwritten_Notes/*.png')):
    im = Image.open(p).convert('L')
    ink = sum(im.histogram()[:150]) / (im.size[0]*im.size[1])
    print(f"{p.split('/')[-1]:34s} {im.size[0]}x{im.size[1]}  ink {ink*100:5.2f}%")
EOF
```

Ink is now **reported, not enforced**. As a sanity signal: pages in the
**3-6%** range are usually right. **Above 7% means you over-wrote** - go back
and cut.

---

## 8. Scope — do ONE topic, then stop

Regenerate notes for **`<TOPIC_PATH>` only**, then stop and report.

Delete the existing over-dense pages in that folder and replace them with the
new 3-page set, named `<Topic>_01.png`, `<Topic>_02.png`, `<Topic>_03.png`.

Update that folder's `README.md` so the page list matches the new 3 pages.

Then run, from the repository root:

```bash
python3 17_Learning_As_Of_Now/shared/build_site.py
```

Report: the 3 page titles, the word count of each, and the ink reading.
Do not touch any other topic.
