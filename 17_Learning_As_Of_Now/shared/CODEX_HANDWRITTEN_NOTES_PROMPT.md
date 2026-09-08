# Task — Handwritten revision notes, take 2 (ONE topic only, then stop)

Repository: `/Users/kaliprasad/Documents/MACHINE_LEARNING`

A previous attempt produced 84 pages that were **rejected**. The paper, colours and
boxes were close, but the writing was not. Read section 3 carefully — it lists
exactly what went wrong, with examples.

## ⛔ Do ONE topic, then STOP

Produce notes for **`04_ML/22_Cost_Functions` only**. Then stop and report.
Do not touch any other topic. Approval comes first; the rest follows later.

Replace the three rejected files already in that folder:

```text
04_ML/22_Cost_Functions/Handwritten_Notes/
  Cost_Functions_Page_1of3.png   ← delete
  Cost_Functions_Page_2of3.png   ← delete
  Cost_Functions_Page_3of3.png   ← delete
```

New names use a plain two-digit suffix:

```text
Cost_Functions_01.png
Cost_Functions_02.png
Cost_Functions_03.png
```

---

## 1. The reference — study these four images first

**Open and look at them before writing anything.** They are the only standard
that matters. Your pages must be indistinguishable in style.

```text
04_ML/12_Preprocessing/Handwritten_Notes/Preprocessing_Page_1of3.png
04_ML/12_Preprocessing/Handwritten_Notes/Preprocessing_Page_2of3.png
04_ML/12_Preprocessing/Handwritten_Notes/Preprocessing_Page_3of3.png
04_ML/07_Outliers/Handwritten_Notes/21_Outlier.png
```

### Page
1055 × 1491 px portrait. Ruled notebook paper, faint blue-grey rules top to
bottom, a pink/red vertical margin line ~8% from the left, grey spiral binder
holes down the left edge, boxed `Page 1/3` top-right.

### Handwriting
One neat, legible handwriting font throughout (*Caveat*, *Patrick Hand* or
similar). Dark navy ink. Body ~15–17px.

### Colour system
| Element | Treatment |
|---|---|
| Page title | Blue highlighter bubble, underlined |
| Section heading | Blue highlighter block |
| Sub-heading (`The idea:`, `The problem:`) | Pink/red highlighter block |
| Key term mid-sentence | Green highlighter behind the word |
| Formula | White box, blue border |
| Key point / takeaway | Pale green fill, green border |
| Warning / classic mistake | Pale pink fill, red border, ⚠️ |
| Example | Pale blue fill, blue border |
| End of page | Blue `Checkpoint ✅` box |

### Density — this is the part that failed
The reference pages are **full**. Two columns, packed edge to edge, almost no
white space. Measured ink coverage (pixels darker than 150, full resolution) is
**8.4 – 10.1%**. The rejected pages averaged **5.6%**, and 85 of 88 were lighter
than the lightest reference page.

**A box must never be larger than the writing inside it.** If a box has room
left, either write more or make the box smaller.

---

## 2. Add the story — new requirement

Every page must **teach through a story**, the way the reference does
("An online store usually gets 10,000 normal orders. One day, there is a strange
order…").

Stories are already written for 41 topics in:

```text
17_Learning_As_Of_Now/shared/stories.json
```

For this topic the entry is `04_ML/22_Cost_Functions`:

> **Two delivery models were compared.** Model A was off by 5 minutes on every
> one of ten trips. Model B was perfect on nine and 50 minutes late on the tenth.
> Total error: A = 50 minutes, B = 50 minutes. By that measure they were
> identical. **But no customer would call them identical.** One is mildly
> unreliable; the other ruins a delivery completely. Squaring the errors
> separates them: MSE makes B far worse than A, because 50² dwarfs ten lots of 5².

**Use this story.** Open it on page 1 in a `A story to start` box, keep the same
characters and numbers running through every page, and let the maths resolve the
story's problem. The reader should finish knowing why MSE exists, not just what
its formula is.

Rules for stories:
- A named person or a concrete situation with real numbers.
- The obvious thing they tried → why it failed → so this is the fix.
- Reuse the story's numbers in the worked examples. Do not invent a second,
  unrelated example.

---

## 3. What went wrong last time — do not repeat these

Every item below is a real defect from the rejected pages.

| Defect | Example from the rejected work | Rule |
|---|---|---|
| **Sentences cut mid-thought** | *"…measure the vertical gap between"* then nothing | Never truncate. Finish every sentence. |
| **Orphaned fragments** | A box beginning *"smallest. Error = the vertical gap…"* | Never start a box with the tail of a sentence. |
| **Raw markdown leaking** | `a *number*, not a category` | Render emphasis; no stray `*`, `#`, backticks. |
| **Copy-paste instead of writing** | Whole page was code lines + printed output | Write the explanation yourself, in your own simple English. |
| **Same sentence repeated** | One IQR sentence appeared 3× on one page | No sentence appears twice on a page. |
| **Learner's typos copied** | `findout` instead of "find out" | Fix spelling and grammar when you rewrite. |
| **ASCII art as a diagram** | `\| / \| rise = 86.43 ← coef_` | All diagrams are inline SVG. Never ASCII. |
| **Unlabelled diagrams** | Box plot with no Q1 / Q3 / median labels | Every axis, series and key value is labelled. |
| **Contents = heading dump** | IQR page listed "Find missing values, Fill missing values" | `Our Journey` is a curated list of ideas, not the notebook's headings. |
| **Provenance clutter** | `from 04_IQR.ipynb` under every box | Never print source filenames on the page. |
| **Half-empty boxes** | ~50% of the IQR page was blank | See the density rule above. |
| **Weak checkpoint** | Echoed a heading and its first line | Ask a real question a learner could get wrong. |

---

## 4. What goes on the pages

Read everything in `04_ML/22_Cost_Functions/Concept/` first:
`29_Cost_Function.MD`, `30_Cost_Function_MSE_GradientDescent.ipynb`,
`31_Mean_Absolute_Error.MD`, `32_Root_Mean_Squared_Error.MD`,
`33_Cost_Functions_MAE_MSE_RMSE_Practical.ipynb`.

Use **only** facts, numbers and code that appear there. Do not invent results.

Suggested shape for three pages:

**Page 1 — why a cost function exists**
- `A story to start` — the two delivery models
- `Why a cost function?` + `Our Journey (in this topic)` side by side
- What "error" means, with the story's numbers in a small table
- Why raw errors cancel out (+5 and −5), shown as a worked line
- `Checkpoint ✅`

**Page 2 — MAE, MSE, RMSE**
- One block per metric: the idea in two plain sentences, the formula in a
  bordered box with every symbol defined, then the story's ten trips carried
  through the arithmetic to a final number
- A comparison table: metric · what it punishes · units · outlier sensitivity
- ⚠️ box: the classic mistake (comparing MSE across differently-scaled targets)
- `Checkpoint ✅`

**Page 3 — the cost curve and gradient descent**
- The bowl-shaped cost curve as a **labelled SVG** — axes, the minimum marked
- Why the bottom is flat, and what that buys you
- The gradient-descent step, with the notebook's real iteration numbers
- `Checkpoint ✅`

Language: **simple English, short sentences.** Explain like you are reminding a
friend the night before an exam. Prefer a concrete example over a definition.

---

## 5. How to build

Write one HTML file per page (inline CSS, inline SVG for diagrams, Google
handwriting font), then render:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --window-size=1055,1491 \
  --screenshot=OUTPUT.png "file:///absolute/path/page.html"
```

Delete the temporary HTML afterwards. Only PNGs stay in the repository.

---

## 6. Self-check before you report back

Run this. **All three pages must pass.**

```bash
cd /Users/kaliprasad/Documents/MACHINE_LEARNING
pizza_env/bin/python3 - <<'PY'
from PIL import Image
import glob
for p in sorted(glob.glob("04_ML/22_Cost_Functions/Handwritten_Notes/*.png")):
    im = Image.open(p).convert("L")
    ink = sum(im.histogram()[:150]) / (im.size[0]*im.size[1])
    ok = im.size == (1055,1491) and ink >= 0.084
    print(f"{'PASS' if ok else 'FAIL'}  {p.split('/')[-1]}  {im.size[0]}x{im.size[1]}  ink {ink*100:.2f}%")
PY
```

- Size must be exactly 1055 × 1491.
- Ink must be **≥ 8.4%** — the lightest reference page.

Then read each PNG yourself and confirm:
- [ ] The story runs through all three pages, same characters and numbers
- [ ] No sentence is cut off; no box starts mid-sentence
- [ ] No sentence appears twice
- [ ] Every formula box defines its symbols
- [ ] Every diagram is SVG and fully labelled
- [ ] No source filenames printed anywhere
- [ ] No box has empty space at the bottom

---

## 7. Finish

```bash
python3 17_Learning_As_Of_Now/shared/build_lessons.py
```

This adds the gallery, header chip and lightbox to the lesson page
automatically. Do not edit any HTML yourself.

**Then stop.** Report the three filenames and the self-check output, and wait
for approval before doing any other topic.

## Rules
- Never edit anything in `Concept/`, `Content/` or `Data/`.
- Never invent numbers, results or code that is not in the topic's material.
- One topic only. Stop and wait.
