# Task — Handwritten revision notes for ONE topic

Repository: `/Users/kaliprasad/Documents/MACHINE_LEARNING`

You are producing the handwritten-style revision pages for one topic. These are
the pages the learner revises from the night before an interview. They must
**teach the concepts**, not announce them.

> **The rule that matters most, and the one that was broken last time:**
> **coverage decides the page count.** You do not get a page budget. You read
> the topic's material, list every idea it teaches, and then use however many
> pages those ideas need. Three ideas on three pages is a failure. Nine ideas
> on one page is what the reference does.

---

## 0. The topic for this run

**Topic:** `04_ML/38_Robust_Regression`

The three files currently in its `Handwritten_Notes/` folder are **rejected**
and must be replaced:

```text
Robust_Regression_01.png   ← 1024x1536 wrong size, 4.62% ink, 3 of 14 sections
Robust_Regression_02.png   ← wrong size, 3.82% ink
Robust_Regression_03.png   ← wrong size, 2.40% ink, page is 60% blank
```

Why they were rejected: they cover the story, a one-line description of RANSAC,
and four lines of code. **Huber, Theil–Sen, the squared-error argument, the
breakdown point, the four-way comparison and the common mistakes are all
missing** — and Huber and Theil–Sen are half the topic. See section 0.3 for the
coverage map you must hit.

### 0.1 Read these first

```text
04_ML/38_Robust_Regression/Concept/38_Robust_Regression_explained.ipynb
04_ML/38_Robust_Regression/Concept/39_Robust_Regression_RANSAC.ipynb
```

The story is Farhan's courier desk. It is already in the notebook and in
`17_Learning_As_Of_Now/shared/stories.json`. Keep Farhan, the parcels and the
₹600 fault running through **every** page, including figure titles and axis
labels.

### 0.2 Use these numbers — do not invent any

Every number below is real output from the notebook. Use these and nothing
else. If you need a number that is not here, it is not in the material, so
leave it out.

| Fact | Value |
|---|---|
| Rows / broken rows | 1600 / 240 (15%), all at a flat ₹600 |
| True slope | 34.4 ₹ per unit of weight |
| OLS slope on dirty data | **19.8** — 58% of the truth; intercept 0.1 → 90.4 |
| The squared-error argument | miss by 10 → costs 100; miss by 100 → costs **10 000**, the same as one hundred ordinary rows |
| Drag ONE row upward | OLS slope 32.9 → **95.3** (2.9×, still climbing); RANSAC 33.0 → 33.2 |
| RANSAC run | 4 trials · threshold **29.4** (= MAD of y) · 1353 of 1600 kept · **0 of 240** broken kept · slope 34.0 |
| RANSAC cost | 100% of broken rows rejected, but **7 honest rows** thrown out too |
| Huber | slope 33.9 · 584 of 1600 down-weighted · default epsilon 1.35 |
| Huber epsilon sweep | 1.05 → slope 33.9, 1362 down-weighted · 1.35 → 33.9, 584 · 2.0 → 33.4, 245 · **5.0 → 19.8, 0** (= plain OLS again) |
| Theil–Sen | 5000 pairs sampled · slope 34.7 · honest pairs **72.4%** · median of honest only 34.1 · median of everything 33.3 |
| Breakdown points | OLS **0%** · Huber 0% in theory but influence grows very slowly · Theil–Sen **~29%** · RANSAC **~50%** |
| Final test, scored on honest parcels only | OLS slope 24.4, avg error **₹87.5** · RANSAC 35.3, ₹7.8 · Huber 34.0, ₹8.0 · Theil–Sen 34.2, ₹7.9 · true slope 34.4 |

### 0.3 The coverage map — every row must land on a page

The notebook teaches fourteen things. Each one gets real space.

| # | Idea from the notebook | Page |
|---|---|---|
| 1 | The story: Farhan, the quote line, the faulty terminal | 1 |
| 2 | The failed OLS fit — too high, almost flat, 19.8 vs 34.4 | 1 |
| 3 | **Why the square is the problem** — 10→100 but 100→10 000 | 1 |
| 4 | The three loss curves (squared / absolute / Huber), read at the right edge | 1 |
| 5 | **Breakdown point** — the table, and what 0% really means | 1 |
| 6 | The one-row drag experiment, and leverage (a far-out x swings hardest) | 1 |
| 7 | **RANSAC as voting** — the 4-step loop in words | 2 |
| 8 | Why a pair of broken rows cannot win the vote | 2 |
| 9 | `inlier_mask_` — a free outlier detector, and the 7 honest rows it costs | 2 |
| 10 | **Huber** — keeps every row, caps what a far one can charge; epsilon | 3 |
| 11 | **Theil–Sen** — median of every pairwise slope, no threshold at all | 4 |
| 12 | Why 15% bad rows spoils 27.6% of pairs → where the 29% comes from | 4 |
| 13 | **All four compared** on the honest test | 5 |
| 14 | Where each one breaks + the 4 common mistakes + the honest limit | 5 |

**Five pages.** `Robust_Regression_01.png` … `Robust_Regression_05.png`.

If while reading you conclude a different split teaches it better, that is
fine — but say so in your report, and never by dropping an idea.

---

## 1. Do this in order

1. **Read** everything in the topic's `Concept/` folder, end to end.
2. **Write the coverage map** — every teaching idea in the material, mapped to
   a page. For this run it is given to you in 0.3.
3. **Report the map and the page count, and only then start drawing.**
4. Build the pages.
5. Run the self-check in section 6. **All pages must pass before you report.**
6. Report: filenames, the self-check output, and the coverage map with each row
   ticked.

---

## 2. The reference — study these before writing anything

**Open and look at them.** They are the only standard that matters.

```text
04_ML/07_Outliers/Handwritten_Notes/21_Outlier.png          ← study this one hardest
04_ML/12_Preprocessing/Handwritten_Notes/Preprocessing_Page_1of3.png
04_ML/12_Preprocessing/Handwritten_Notes/Preprocessing_Page_2of3.png
04_ML/12_Preprocessing/Handwritten_Notes/Preprocessing_Page_3of3.png
```

`21_Outlier.png` carries **nine numbered sections, two columns, a comparison
table, a hand-worked example and five labelled diagrams — on one page.** That
is the density you are aiming at. Measured ink 8.74%.

### Page
Exactly **1055 × 1491 px** portrait. Ruled notebook paper, faint blue-grey
rules top to bottom, a pink/red vertical margin line ~8% from the left, grey
spiral binder holes down the left edge, boxed `Page 1/5` top-right.

### Layout
**Two columns**, numbered sections flowing down the left column then down the
right. Not one wide column of short paragraphs.

### Handwriting
One neat, legible handwriting font throughout — *Caveat* or *Patrick Hand* from
Google Fonts, with `"Bradley Hand", "Chalkboard SE", cursive` as the local
fallback. Dark navy ink, body ~15–17px. **Check the rendered PNG**: if the font
failed to load the page comes out in plain sans-serif and is unusable.

### Colour system
| Element | Treatment |
|---|---|
| Page title | Blue highlighter bubble, underlined |
| Numbered section heading | Coloured circle + highlighter block |
| Sub-heading (`The idea:`, `The problem:`) | Pink/red highlighter block |
| Key term mid-sentence | Green or yellow highlighter behind the word |
| Formula | White box, blue border |
| Key point / takeaway | Pale green fill, green border |
| Warning / classic mistake | Pale pink fill, red border, ⚠️ |
| Example / worked numbers | Pale blue fill, blue border |
| End of page | Blue `Checkpoint ✅` box |

### Figures
Real plots are wanted here, drawn as **inline SVG** in the handwriting style —
the notebook's actual curves (the three loss curves, the contamination sweep,
the slope histogram), with every axis, series and key value labelled. Never
ASCII art. Never an unlabelled chart.

**A figure may not exceed about a third of the page.** A large picture with
nine lines of text around it is exactly what was rejected.

---

## 3. What "covered" actually means

This is the part that failed. For every technique on the coverage map, the page
must carry **all four** of these:

1. **What it does mechanically** — the actual procedure, in two or three plain
   sentences. "RANSAC is robust to outliers" is not a mechanism. "It fits a
   line through 2 random rows, counts how many other rows fall within the
   threshold band, repeats, and keeps the line with the most votes" is.
2. **The formula or the rule, with every symbol defined.** Huber's loss is
   squared inside epsilon and straight-line outside — write that, and say what
   epsilon is measured in.
3. **The real numbers** from section 0.2, carried through.
4. **When it breaks** — the limit, stated plainly.

Naming a technique and giving a one-line intuition is **not** covering it.

---

## 4. Defects from previous attempts — do not repeat these

| Defect | Rule |
|---|---|
| **Only a third of the material covered** | Every row of the coverage map appears, with all four elements from section 3. |
| **Half-empty pages** | No page ends with blank paper. If a page has room, it was under-filled — move content up from the next page. |
| **A box larger than the writing inside it** | Write more, or make the box smaller. |
| **Wrong page size** | Exactly 1055 × 1491. Check it; the last run shipped 1024 × 1536. |
| **Self-check skipped** | The last run shipped three pages that all FAIL the check in section 6. Run it, and paste the output. |
| Sentences cut mid-thought | Never truncate. Finish every sentence. |
| A box starting with the tail of a sentence | Never start a box mid-sentence. |
| Raw markdown leaking (`a *number*`) | Render emphasis. No stray `*`, `#`, backticks. |
| Code pasted instead of explained | Write the explanation yourself, in simple English. Code appears only in a small code box. |
| The same sentence twice on a page | No repeats. |
| The learner's typos copied through | Fix spelling and grammar as you rewrite. |
| Unlabelled diagrams | Every axis, series and key value labelled. |
| `Our Journey` as a dump of notebook headings | A curated list of ideas, in the learner's language. |
| Source filenames printed on the page | Never. |
| A weak checkpoint echoing a heading | Ask a real question a learner could get wrong. |

---

## 5. How to build

One HTML file per page — inline CSS, inline SVG for figures — then render:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --window-size=1055,1491 --force-device-scale-factor=1 \
  --screenshot=OUTPUT.png "file:///absolute/path/page.html"
```

`--force-device-scale-factor=1` is what keeps the output at exactly 1055 × 1491
on a Retina Mac. Set `body{margin:0}` and the page container to exactly
1055 × 1491 so nothing scrolls.

Delete the temporary HTML afterwards. Only PNGs stay in the repository.

---

## 6. Self-check — run this, and paste the output in your report

```bash
cd /Users/kaliprasad/Documents/MACHINE_LEARNING
python3 - <<'PY'
from PIL import Image
import glob, re, os
TOPIC = "04_ML/38_Robust_Regression"
pages = sorted(glob.glob(f"{TOPIC}/Handwritten_Notes/*.png"))
print(f"{len(pages)} pages\n")
allok = True
for p in pages:
    im = Image.open(p).convert("L")
    ink = sum(im.histogram()[:150]) / (im.size[0] * im.size[1])
    size_ok = im.size == (1055, 1491)
    ink_ok  = ink >= 0.084
    ok = size_ok and ink_ok
    allok &= ok
    print(f"{'PASS' if ok else 'FAIL'}  {os.path.basename(p):<32} "
          f"{im.size[0]}x{im.size[1]}{'' if size_ok else '  <- WRONG SIZE'}  "
          f"ink {ink*100:5.2f}%{'' if ink_ok else '  <- TOO LIGHT, need >= 8.40%'}")
print("\nALL PASS" if allok else "\nNOT READY — fix and re-render")
PY
```

Also count the words in each page's HTML **before** you render it. The
reference pages carry roughly 400 words each. **Any page under 300 words is
under-written** — a big figure can push the ink number up while the page still
teaches almost nothing, so the word count is the check that catches it.

Then open each PNG and confirm:

- [ ] Every row of the coverage map in 0.3 appears, with the mechanism, the
      formula, the real numbers and the limit
- [ ] Farhan and the ₹600 fault run through all five pages
- [ ] Two columns, no page ending in blank paper
- [ ] No figure larger than about a third of its page
- [ ] Every formula defines its symbols
- [ ] Every diagram is labelled SVG
- [ ] No sentence cut off, none repeated, no markdown characters visible
- [ ] The handwriting font actually rendered
- [ ] No source filenames anywhere

---

## 7. Finish

```bash
python3 17_Learning_As_Of_Now/shared/build_site.py
```

This regenerates the lesson pages and the gallery automatically, and fails
loudly if anything is missing. Do not hand-edit any generated HTML.

Update the topic's `Handwritten_Notes/README.md` so its page list matches what
you actually produced.

Then **stop** and report:

1. The five filenames
2. The full self-check output
3. The coverage map with every row ticked and the page it landed on
4. Anything in the material you could not fit, and why

---

## Rules

- Never edit anything in `Concept/`, `Content/` or `Data/`.
- Never invent a number, a result or a line of code that is not in the topic's
  material. Section 0.2 is the complete list of numbers for this topic.
- One topic only. Stop and wait for approval.
