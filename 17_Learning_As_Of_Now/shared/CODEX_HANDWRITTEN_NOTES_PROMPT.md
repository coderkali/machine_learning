# Task — Generate handwritten-style revision notes for every topic

You are working in the repository `/Users/kaliprasad/Documents/MACHINE_LEARNING`.

Your job: for **every topic folder that has a `Concept/` folder but an empty
`Handwritten_Notes/` folder**, read the material in `Concept/`, and produce
handwritten-style revision note pages as PNG images placed inside that topic's
`Handwritten_Notes/` folder.

Do **not** modify any notebook, note, or lesson page. You only add PNG images.

---

## 1. The repository layout

Every topic looks like this:

```text
<NN>_Subject/<NN>_Topic/
├── Concept/              ← READ THIS. Notebooks (.ipynb) and notes (.md)
├── Content/              ← the generated lesson page. Do not edit.
├── Data/                 ← datasets and figures. Do not edit.
└── Handwritten_Notes/    ← WRITE YOUR PNG PAGES HERE
```

Subjects are `01_Python`, `02_DataScience`, `03_Math`, `04_ML`.
Folders `05_*` to `14_*` are future subjects with no material yet — **skip them**.

A `Handwritten_Notes/` folder that contains only a `README.md` is empty and needs
notes. A folder that already contains `.png` files is **done — skip it**.

---

## 2. The reference style — copy this exactly

Four finished pages already exist. **Open them and match their look precisely:**

```text
04_ML/12_Preprocessing/Handwritten_Notes/Preprocessing_Page_1of3.png
04_ML/12_Preprocessing/Handwritten_Notes/Preprocessing_Page_2of3.png
04_ML/12_Preprocessing/Handwritten_Notes/Preprocessing_Page_3of3.png
04_ML/07_Outliers/Handwritten_Notes/21_Outlier.png
```

These are the single source of truth for style. What they look like:

### Page and paper
- **1055 × 1491 px**, portrait (A4 ratio ≈ 0.71), white/off-white background.
- **Ruled notebook paper**: faint horizontal blue-grey rules the whole way down.
- A **vertical pink/red margin line** about 8% in from the left edge.
- **Spiral binder holes** down the left edge — small grey circles, evenly spaced.
- A boxed **`Page 1/3`** label in the top-right corner when a topic runs to
  several pages.

### Handwriting
- A neat, highly legible **handwriting font** throughout — not cursive, not messy.
  Use a Google Font such as *Caveat*, *Patrick Hand*, or *Architects Daughter*,
  and keep one font for the whole page.
- Dark navy/near-black ink. Body text around 15–17px.

### Colour system (used consistently — this is what makes it readable)
| Element | Treatment |
|---|---|
| Page title | Large, blue highlighter bubble behind it, underlined |
| Section heading | Blue highlighter block, larger text |
| Sub-heading (`The idea:`, `The problem:`) | Pink/red highlighter block |
| Key term inside a sentence | Green highlighter behind the word |
| Formula box | White box, blue border |
| Key point / takeaway box | Pale green fill, green border |
| Warning / danger box | Pale pink fill, red border, with a ⚠️ |
| Example box | Pale blue fill, blue border |
| Checkpoint (end of page) | Blue box, `Checkpoint ✅`, one question + its answer |

### Layout
- **Two columns** for most of the page, so the page is dense but never cramped.
- Numbered steps in **coloured circles** (①②③ style).
- **Real tables** with ruled borders and a tinted header row.
- **Hand-drawn-looking diagrams**: scatter plots, distribution curves, box plots,
  tree diagrams, arrows. Draw them as inline SVG so they stay crisp.
- Proper mathematics: real fractions, √ signs, subscripts, Σ. Not ASCII.
- Small doodles where they help (a shopping cart, a thinking face, an order card).

---

## 3. How to produce the images

Build each page as an **HTML file styled to look like the reference, then render
it to PNG at 1055 × 1491**. Suggested approach:

1. Write one HTML file per page with inline CSS and inline SVG for diagrams.
2. Load the handwriting font from Google Fonts.
3. Render with headless Chrome:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --window-size=1055,1491 \
  --screenshot=OUTPUT.png "file:///absolute/path/to/page.html"
```

4. Delete the temporary HTML afterwards. **Only PNGs stay in the repository.**

Verify every PNG is 1055 × 1491 and that no text is clipped at the edges.

---

## 4. What goes on the pages — the content rules

Read the topic's `Concept/` folder first. Everything on the page must come from
that material — **do not invent results, numbers, or code that is not there.**

Each topic gets **1 to 3 pages**, depending on how much material exists:

- 1 page — a short topic (one notebook, one idea)
- 2–3 pages — a large topic (several notebooks, or many sub-methods)

Structure the pages like this:

**Page 1 always opens with two blocks, side by side:**
- `Why <topic>?` — two or three lines on the problem this solves
- `Our Journey (in this topic)` — a numbered list of what the topic covers,
  which doubles as the contents for the remaining pages

**Then, for each idea in the topic:**
- The idea, in one or two plain sentences
- The formula, in a bordered box, with every symbol defined underneath
- A tiny worked example with **real numbers carried all the way through**
- A comparison table when there are several competing methods
- A diagram when the idea is visual
- A warning box for the classic mistake

**Every page ends with a `Checkpoint ✅` box** — one question and its answer.

### Language
- **Simple English. Short sentences.** Explain like you are reminding a friend
  the night before an exam.
- Prefer a concrete example over an abstract definition.
- Keep the learner's own variable names and numbers from the notebooks.

---

## 5. Naming and placement

Save into the topic's own `Handwritten_Notes/` folder, named so they sort in
reading order:

```text
04_ML/13_Train_Test_Split/Handwritten_Notes/
├── Train_Test_Split_Page_1of2.png
└── Train_Test_Split_Page_2of2.png
```

Use `<Topic_Name>_Page_<n>of<total>.png`. For a single page, use
`<Topic_Name>_Page_1of1.png`.

**Delete the placeholder `README.md`** from any folder once you add real pages.

---

## 6. Topics that still need notes

These 49 topic folders have material in `Concept/` and no handwritten notes yet.
Work through them in this order — `04_ML` first, since it is the active course.

**04_ML (22)**
`01_What_Is_ML`, `02_Types_Of_Variables`, `03_Data_Collection`, `04_Data_Cleaning`,
`05_Missing_Values`, `06_Categorical_Encoding`, `08_Feature_Scaling`,
`09_Duplicates_And_Dtypes`, `10_Function_Transformer`, `11_Feature_Selection`,
`13_Train_Test_Split`, `14_Synthetic_Datasets`, `15_EDA_Uni_Bi_Multivariate`,
`16_Linear_Regression`, `17_Multiple_Linear_Regression`, `18_Polynomial_Regression`,
`19_Ridge_Regression`, `20_Lasso_Regression`, `21_ElasticNet`, `22_Cost_Functions`,
`23_Cross_Validation`, `31_Clustering_KMeans`, `32_Hierarchical_Clustering`,
`35_Project_Employee_Attrition`

**02_DataScience (11)**
`01_Measures_Of_Variability`, `02_IQR`, `03_Skewness`, `04_Correlation`,
`05_Central_Limit_Theorem`, `06_Hypothesis_Testing_Basics`, `07_Z_Test`, `08_T_Test`,
`09_Paired_T_Test`, `10_Chi_Square_Test`, `11_Z_Test_vs_T_Test`

**01_Python (9)**
`01_Variables_And_Data_Types`, `02_NumPy`, `03_Pandas`, `04_Matplotlib`,
`05_Seaborn`, `06_Plotly`, `07_Streamlit`, `08_Iris_Visual_Explorer`,
`10_Pizza_Dashboard_Lab`

**03_Math (5)**
`01_Algebra`, `02_Statistics`, `03_Linear_Algebra`, `04_Calculus`,
`05_Linear_Regression_From_Scratch`

**Already done — do not touch:**
`04_ML/07_Outliers`, `04_ML/12_Preprocessing`, `04_ML/24_Model_Evaluation`,
`04_ML/25_ROC_And_AUC`, `04_ML/26_Decision_Tree_Classification`,
`04_ML/27_Decision_Tree_Regression`, `04_ML/28_Naive_Bayes`,
`04_ML/29_K_Nearest_Neighbor`, `04_ML/30_Support_Vector_Machines`,
`04_ML/33_Hyperparameter_Tuning`, `04_ML/34_Ensemble_Methods`

---

## 7. When you are finished

Run the site builder so the new pages appear on the website:

```bash
python3 17_Learning_As_Of_Now/shared/build_lessons.py
```

This scans every `Handwritten_Notes/` folder and automatically adds a gallery
section, a header chip, and a lightbox to that topic's lesson page. You do not
need to edit any HTML yourself.

Then confirm:

```bash
find 0*_* -path '*/Handwritten_Notes/*' -name '*.png' | wc -l
grep -rl 'hn-grid' --include=index.html 0*_* | wc -l
```

The two numbers should reflect every topic you completed.

---

## 8. Rules

- **Never** edit anything in `Concept/`, `Content/`, or `Data/`.
- **Never** invent numbers, results, or code that is not in the topic's material.
- Keep every page to the exact reference style — a learner should not be able to
  tell which pages were made first.
- If a topic's `Concept/` folder is too thin to fill a page honestly, make one
  page covering only what is genuinely there. Do not pad it.
