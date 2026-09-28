# ML for Java Developers — Locked Series Roadmap

**Status:** LOCKED on 2026-09-27. The episode order below does not change.
New learning is only ever **appended** as a new season (see §6). Nothing is inserted,
removed or renumbered.

---

## 1. The series in one line

A Java developer shows, one day at a time, the exact path they took into machine
learning: **Why ML → Python → Math → Data Science → Machine Learning → Projects**.

## 2. Fixed rules (apply to every episode)

| Rule | Value |
|---|---|
| Series name / end card | `DAY N · ML FOR JAVA DEVELOPERS` |
| "Day N" means | Episode number, **not** calendar day. Miss a week, the next one is still the next Day. |
| One episode = | **One idea.** If a script needs "and also…", split it (only by adding to a future season, never by renumbering). |
| Length | **60–150 s**, as long as the idea needs (creator, 2026-09-27: never squeeze a topic into 60 s). Hard limit **180 s** (Reels/Shorts upload cap): a topic that needs more becomes **Part 1 / Part 2 under the same Day number** ("Day 60 · Part 1"), and Part 1 ends by saying Part 2 explains the rest. Numbering never changes. |
| Opener | Every episode's first line: **"This is Day N of ML for a Java developer."**, then straight into the topic question (context-first rule). The roadmap intro is an un-numbered "Start here" reel. |
| Format | 1080×1920 vertical, same visual language as Day 1 (dark navy, blue robot guide) |
| Context first | (added 2026-09-27 after viewer feedback) The first 2–3 s **say and show the episode's topic** (voice asks/states it, a title card shows it); the example (e.g. the spam folder) serves the topic and never replaces it. The Java angle runs through the whole episode, not only one beat. A **chapter bar** at the top shows where the viewer is (e.g. PROBLEM → IDEA → HOW IT LEARNS → PREDICT → IN JAVA → RECAP). |
| Style | **Animated technical explainer** (set 2026-09-27): movement in the first second, brief visual steps, no long pauses or slow transitions, short labels, every movement explains the concept. Rules + timings: `claude/ANIMATION_GUIDE.md` |
| Structure | Hook (0–5 s) → Problem → Idea → Visual example → **Java lens** (only if natural) → One-line takeaway → "Next: Day N+1 …" teaser |
| Source of truth | The folders listed in the table. Numbers, datasets and examples come from those notebooks — never invented. |
| Script author | AI, using the prompt in §5. You approve the script before any voice/render. |
| Folder naming | `ml_videos/episodes/day_NN_<slug>/` (e.g. `day_02_python_for_java_devs`) |
| Callback | Each episode's first line may reference the previous day; its last line **must** tease the next day from this table. |
| Thumbnail | Every episode gets a cover built to the locked spec in §5b — same layout, same mascot, every time. |

## 3. Day 1 — decided

**Day 1 = What is Machine Learning? (spam filter: rules vs examples).** Already produced in
`episodes/day_01_what_is_machine_learning/`.

Why this and not Python first: a viewer needs the *destination* before the tools. Day 1 answers
"why is a Java dev doing this?"; from Day 2 the series follows your real learning order.

**One fix needed before posting:** the current teaser line in `script_v2.md` says
*"Next: what counts as data, and how do we load it in Java?"* — that is not Day 2 any more.
Replace the last line with:
> "Day 1 done. Tomorrow: why a Java developer's first ML tool is Python."

Only that final narration clip and the end-card teaser need re-recording.

**Cover also needs a redo:** the existing `cover_v7.png` (dark navy) does not match the locked
thumbnail style in §5b. ✅ Done 2026-09-27: the new Day 1 thumbnail (§5b v2) is approved —
`remotion/out/day_01/thumbnail.png`.

The old `episodes/00_intro` and `episodes/01_linear_discriminant_analysis` are **not** part of
the numbered series. The LDA visuals are reused for **Day 78**. The intro may be pinned as an
optional un-numbered trailer.

---

## 4. The roadmap — 84 days, 9 arcs

Paths are relative to `MACHINE_LEARNING/`. "Concept" = the `Concept/` subfolder.

### Arc 0 — The Why (Day 1)

| Day | Episode title | The one idea | Source |
|---|---|---|---|
| 1 | What is Machine Learning? | Stop writing rules, show examples → pattern → prediction | `04_ML/01_What_Is_ML` ✅ done |

### Arc 1 — Python for a Java Developer (Days 2–12)

| Day | Episode title | The one idea / Java lens | Source |
|---|---|---|---|
| 2 | Why Python for ML (as a Java dev) | No `int x = 5;` — variables, dynamic types, numbers, strings | `01_Python/01_Variables_And_Data_Types` |
| 3 | NumPy: the expression replaces the loop | Vectorization; like one batch query vs 10,000 single fetches | `01_Python/02_NumPy` |
| 4 | NumPy: shape is everything | `(m,k)@(k,n)`, broadcasting; print `.shape` first | `01_Python/02_NumPy` |
| 5 | Pandas: a DataFrame is a map of columns | Each column = typed Series; like `Map<String, List<T>>` | `01_Python/03_Pandas` |
| 6 | Pandas: the index is labels, not row numbers | `loc` vs `iloc`, and the KeyError trap | `01_Python/03_Pandas` |
| 7 | Matplotlib: your first chart | Figure + axes; data → picture | `01_Python/04_Matplotlib` |
| 8 | Seaborn: `hue` is a GROUP BY for colour | Name columns, not numbers; it computes stats before drawing | `01_Python/05_Seaborn` |
| 9 | Plotly: charts you can click | `color=` splits data into traces | `01_Python/06_Plotly` |
| 10 | Streamlit: the whole script re-runs | No `onChange`, no lifecycle — a surprise for Java/React devs | `01_Python/07_Streamlit` |
| 11 | Mini-project: Iris Visual Explorer | The dataset every ML course starts with | `01_Python/08_Iris_Visual_Explorer` |
| 12 | Mini-project: Pizza Sales Dashboard | NumPy + Pandas + charts on one dataset | `01_Python/10_Pizza_Dashboard_Lab` (+ pizza notebooks) |

### Arc 2 — The Math You Actually Need (Days 13–21)

| Day | Episode title | The one idea | Source |
|---|---|---|---|
| 13 | Algebra: linear vs non-linear | Variables, expressions, straight line vs curve | `03_Math/01_Algebra` |
| 14 | Mean, median, mode — which one lies? | Centre of data, and how outliers fool the mean | `03_Math/02_Statistics` (01) |
| 15 | Probability basics | Chance as a number between 0 and 1 | `03_Math/02_Statistics` (03) |
| 16 | The normal distribution | The bell curve and why it's everywhere | `03_Math/02_Statistics` (04) |
| 17 | Scalar, vector, matrix | One row of data *is* a vector; a table is a matrix | `03_Math/03_Linear_Algebra` (topics 1–4) |
| 18 | Dot product & matrix multiplication | How a model combines inputs × weights | `03_Math/03_Linear_Algebra` (topics 5–7) |
| 19 | Slope | Rise over run — how steep is it? | `03_Math/04_Calculus` (01) |
| 20 | Derivative | Slope at a single point | `03_Math/04_Calculus` (02) |
| 21 | Gradient descent | Walking downhill to the lowest error | `03_Math/04_Calculus` (03) |

### Arc 3 — Data Science: Reading Patterns in Data (Days 22–36)

| Day | Episode title | The one idea | Source |
|---|---|---|---|
| 22 | Types of variables | Numerical vs categorical; discrete/continuous; nominal/ordinal | `04_ML/02_Types_Of_Variables` |
| 23 | Measures of variability | Same average, totally different data — range & variance | `02_DataScience/01_Measures_Of_Variability` |
| 24 | Standard deviation | Spread in the data's own units | `02_DataScience/01_Measures_Of_Variability` |
| 25 | IQR & box plots | The middle 50% and the outlier fences | `02_DataScience/02_IQR` |
| 26 | Skewness | When the tail pulls the mean away | `02_DataScience/03_Skewness` |
| 27 | Correlation | Moving together ≠ causing each other | `02_DataScience/04_Correlation` (+ `03_Math/02_Statistics` 05) |
| 28 | Central Limit Theorem | Averages of samples become a bell curve | `02_DataScience/05_Central_Limit_Theorem` |
| 29 | Hypothesis testing | Null vs alternate, α and the decision rule | `02_DataScience/06_Hypothesis_Testing_Basics` |
| 30 | Z-test | Testing when you know the population spread | `02_DataScience/07_Z_Test` |
| 31 | T-test (one sample) | Testing with small samples; 95% vs 80% confidence | `02_DataScience/08_T_Test` (09, 12, 13) |
| 32 | Two-sample T-test | Are group A and group B really different? | `02_DataScience/08_T_Test` (10) |
| 33 | Paired T-test | Before vs after on the same people | `02_DataScience/09_Paired_T_Test` |
| 34 | Z-test vs T-test | Which test do I use? | `02_DataScience/11_Z_Test_vs_T_Test` |
| 35 | Chi-square: goodness of fit | Observed vs expected counts | `02_DataScience/10_Chi_Square_Test` (15) |
| 36 | Chi-square: independence | Are two categories related? | `02_DataScience/10_Chi_Square_Test` (16) |

### Arc 4 — ML Part 1: Preparing the Data (Days 37–55)

| Day | Episode title | The one idea | Source |
|---|---|---|---|
| 37 | Types of machine learning | Supervised, unsupervised, reinforcement | `04_ML/01_What_Is_ML` (Classification section) |
| 38 | The ML pipeline, end to end | Raw data → clean → features → split → model → evaluate → tune → ship; maps to SDLC | `04_ML/01_What_Is_ML` (02_ML_Roadmap) + `17_Learning_As_Of_Now/Claude/journey-data.js` |
| 39 | Data collection | Where data comes from and what one row means | `04_ML/03_Data_Collection` |
| 40 | Data cleaning | Wrong vs unusual: fix one, keep the other | `04_ML/04_Data_Cleaning` |
| 41 | Duplicates & wrong data types | The silent bugs in every dataset | `04_ML/09_Duplicates_And_Dtypes` |
| 42 | Missing values: drop them? | When dropping rows/columns is safe | `04_ML/05_Missing_Values` (06) |
| 43 | Missing values: fill them | Mean/median/mode fill, `SimpleImputer` | `04_ML/05_Missing_Values` (07, 08) |
| 44 | Outliers | What they are and why they bend a model | `04_ML/07_Outliers` (12, 21) |
| 45 | Removing outliers: IQR & Z-score | Day 25 and Day 30 come back as tools | `04_ML/07_Outliers` (13, 14) |
| 46 | One-hot encoding | Turning categories into columns of 0/1 | `04_ML/06_Categorical_Encoding` (09) |
| 47 | Label vs ordinal encoding | When order matters (S < M < L) | `04_ML/06_Categorical_Encoding` (10, 11) |
| 48 | Feature scaling | Standardization vs min-max normalization | `04_ML/08_Feature_Scaling` |
| 49 | Function transformer | A log transform to tame skew (Day 26 callback) | `04_ML/10_Function_Transformer` |
| 50 | The preprocessing toolbox | Scalers, binarizer — which models care | `04_ML/12_Preprocessing` |
| 51 | EDA: uni, bi, multivariate | One column, two columns, many columns | `04_ML/15_EDA_Uni_Bi_Multivariate` |
| 52 | Feature selection: filter methods | Variance threshold, correlation, mutual information | `04_ML/11_Feature_Selection` (21, 44) |
| 53 | Forward & backward selection | Add or remove one feature at a time | `04_ML/11_Feature_Selection` (20, 22) |
| 54 | Synthetic datasets | `make_*` — practice data with a known answer key | `04_ML/14_Synthetic_Datasets` |
| 55 | Train-test split | Never grade the model on its own homework (data leakage) | `04_ML/13_Train_Test_Split` |

### Arc 5 — ML Part 2: Predicting Numbers (Regression) (Days 56–64)

| Day | Episode title | The one idea | Source |
|---|---|---|---|
| 56 | Linear regression: y = wx + b | The best straight line through the points | `04_ML/16_Linear_Regression` + `03_Math/05_Linear_Regression_From_Scratch` (01, 07) |
| 57 | Cost functions: MSE, MAE, RMSE | How wrong is the line? One number | `04_ML/22_Cost_Functions` + `03_Math/05…` (10) |
| 58 | How the model finds w and b | Gradient descent from scratch (Day 21 callback) | `03_Math/05_Linear_Regression_From_Scratch` (02–06) |
| 59 | Multiple linear regression | Many inputs, one prediction | `04_ML/17_Multiple_Linear_Regression` |
| 60 | Polynomial regression & overfitting | Curves fit better… until they memorize | `04_ML/18_Polynomial_Regression` |
| 61 | Ridge regression (L2) | Penalize big weights | `04_ML/19_Ridge_Regression` |
| 62 | Lasso regression (L1) | Penalty that switches features off | `04_ML/20_Lasso_Regression` |
| 63 | ElasticNet | Ridge + Lasso together | `04_ML/21_ElasticNet` |
| 64 | Robust regression (RANSAC) | A line the outliers can't hijack | `04_ML/38_Robust_Regression` |

### Arc 6 — ML Part 3: Predicting Classes (Classification) & Judging Models (Days 65–74)

| Day | Episode title | The one idea | Source |
|---|---|---|---|
| 65 | Logistic regression | Day 1's spam filter, now for real | `04_ML/40_Logistic_Regression` |
| 66 | Confusion matrix, precision, recall, F1 | Why accuracy alone lies | `04_ML/24_Model_Evaluation` |
| 67 | ROC curve & AUC | Every threshold in one picture | `04_ML/25_ROC_And_AUC` |
| 68 | Cross-validation | K-Fold, Stratified, Leave-One-Out | `04_ML/23_Cross_Validation` |
| 69 | K-Nearest Neighbors | You are who your neighbours are | `04_ML/29_K_Nearest_Neighbor` |
| 70 | Naive Bayes | Probability (Day 15) as a classifier | `04_ML/28_Naive_Bayes` |
| 71 | Decision tree (classification) | A model that is literally nested `if` statements | `04_ML/26_Decision_Tree_Classification` |
| 72 | Decision tree (regression) | Same tree, predicting numbers | `04_ML/27_Decision_Tree_Regression` |
| 73 | Support Vector Machine | The widest possible street between classes | `04_ML/30_Support_Vector_Machines` (22, 2D) |
| 74 | SVM kernels | Lift the data to 3D so a flat cut works | `04_ML/30_Support_Vector_Machines` (23, 3D) |

### Arc 7 — ML Part 4: Groups & Fewer Dimensions (Days 75–78)

| Day | Episode title | The one idea | Source |
|---|---|---|---|
| 75 | K-Means clustering | Groups with no labels at all | `04_ML/31_Clustering_KMeans` |
| 76 | Hierarchical clustering | The family tree of your data (dendrogram) | `04_ML/32_Hierarchical_Clustering` |
| 77 | PCA | Squash many columns into a few, keep the spread | `04_ML/39_PCA` |
| 78 | LDA | Reduce dimensions while keeping classes apart | `04_ML/36_Linear_Discriminant_Analysis` (reuse `episodes/01_linear_discriminant_analysis/visual_v3` visuals) |

### Arc 8 — ML Part 5: Making It Real (Days 79–84)

| Day | Episode title | The one idea / Java lens | Source |
|---|---|---|---|
| 79 | Hyperparameter tuning | Grid search vs random search — knobs *you* set | `04_ML/33_Hyperparameter_Tuning` |
| 80 | Ensemble methods | Random Forest (bagging) & AdaBoost (boosting): a panel beats one expert | `04_ML/34_Ensemble_Methods` |
| 81 | Saving a model: pickle & joblib | Like Java serialization for a trained model | `04_ML/37_Model_Persistence` |
| 82 | Capstone 1: Employee attrition — the data | Problem framing + prep pipeline | `04_ML/35_Project_Employee_Attrition` |
| 83 | Capstone 2: Employee attrition — the model | Train, evaluate, the result | `04_ML/35_Project_Employee_Attrition` |
| 84 | Season finale: 84 days, what I learned | The whole map recap + what's next | this file |

---

## 5. Prompt for the AI script writer (copy per episode)

Fill the `{…}` parts from the table above.

```text
You are writing the narration script for "Day {N} · ML for Java Developers",
a 60–90 second vertical (9:16) explainer. The narrator is a Java developer
sharing what they learned, in order.

Episode: {title}
The ONE idea: {one idea}
Previous day: Day {N-1} — {previous title}
Next day:     Day {N+1} — {next title}

SOURCE MATERIAL — read these first and use only them for facts, numbers,
datasets and examples. Do not invent results:
  MACHINE_LEARNING/{source folder}/Concept/   (and Content/ if helpful)

Rules:
- 150–200 spoken words. Plain English. One idea only — no side topics.
- Beats with timestamps: Hook (0–5s, a question or surprise) → Problem →
  Idea → Visual example (use the example from the source notes) →
  Java lens (one line, ONLY if a natural analogy exists) →
  Takeaway (one sentence) → "Day {N} done. Next: {next title}."
- For every beat, give: VISUAL (what is animated on screen) and VOICEOVER.
- VISUAL follows ml_videos/claude/ANIMATION_GUIDE.md ("animated technical
  explainer"): list the visual STEPS per beat, each tied to the spoken word
  that triggers it; something moves in the first second; labels ≤ 4 words;
  no step without a purpose; nothing sits still for more than 2 s.
- Keep the blue robot as the guide character.
- If a formula is needed, show it once, visually, and explain it in words.
- Flag anything in the source notes that looks wrong instead of repeating it.
- Output: script.md in the same format as
  ml_videos/episodes/day_01_what_is_machine_learning/script_v2.md
- Also propose the thumbnail (§5b): 3–5 headline boxes (black/yellow/red/white,
  exactly one red) and a 1–3 row diagram of the episode's main idea, taken
  from the source notes (name the file).

VOICE — follow ml_videos/claude/VOICE_GUIDE.md:
- Tag every beat with its beat type and tone from the tone palette (§2).
- Mark stress (**bold**), (beat), (long beat), [delivery] and ↗ on every line.
- Put the pause BEFORE each punchline; never give two sentences in a row
  the same pace and volume.
- Write TTS-safe text (no arrows/symbols; spell out Z-test, RMSE, etc.).
- Also output voiceover_sheet.md in the same format as
  ml_videos/claude/episodes/day_01/voiceover_sheet_v2.md (v3 text + v2 fallback per beat).
```

## 5b. Thumbnail spec (locked — v2, approved by the creator 2026-09-27)

Replaces the first version (light background + blue robot), which the creator rejected. Modelled on the
dev-reel grid style the creator chose: white background, huge condensed headline in coloured boxes, a
concept diagram, and a tall full-body mascot on the right. The point is that the **profile grid looks
like one series** — people recognise your post before they read it.

Approved reference render: Day 1 — `STOP WRITING / IF-ELSE / RULES / LET THE MACHINE LEARN`
(`remotion/out/day_01/thumbnail.png`).

### Layout (1080×1920 file, designed for the 3:4 grid crop)

```
┌──────────────────────────────┐
│  (top 240px: empty —         │  ← Instagram grid crops to 3:4 (1080×1440, centred).
│   cropped in the grid)       │     Everything important goes in the middle 1440px.
├──────────────────────────────┤
│ [DAY 12] ✦            ✦ ┌────┐│
│ ██ BLACK BOX ██         │head││  Left ~60%: headline boxes, stacked, each slightly tilted
│ ██ YELLOW BOX ██        │    ││  Right ~40%: the mascot, full height, same every episode
│ ██ RED BOX ██           │ M  ││  (headline boxes may overlap the mascot a little)
│ ██ white box ██         │ A  ││
│ ┌ diagram row 1 ──────┐ │ S  ││
│ └─────────────────────┘ │ C  ││
│ ┌ diagram row 2 ──────┐ │ O  ││
│ └─────────────────────┘ │ T  ││
│  (bottom-left: empty —  └feet┘│  ← Instagram's view count sits here in the grid
├──────────────────────────────┤
│  (bottom 240px: cropped)     │
└──────────────────────────────┘
```

### Fixed style rules

| Element | Rule |
|---|---|
| Background | Pure white (`#FFFFFF`). Never dark. |
| Headline | 3–5 stacked boxes, 3–9 words in total, ALL CAPS, heavy condensed font (**Impact**). Each box is auto-sized to the column width and tilted −3° to +3°, with a thick black border. Box styles: **black** (white text), **yellow** (black text), **red** (white text), **white** (black text). |
| Punch | Exactly **one red box**: the curiosity hook (e.g. RULES, LIES, 5, NEVER). |
| Accent | Yellow "burst" tick marks with black outlines: one next to the DAY badge, one at the top-right of the headline. |
| Day badge | Top-left: `DAY 12` in white Impact on a blue (`#1E88E5`) box with a black border, tilted. Same place every episode. |
| Mascot | The series' **own original** character: a cartoon Java developer (spiky dark hair, round glasses, blue hoodie with a coffee-cup logo, jeans, white sneakers), pointing up, holding a coffee mug. Full height on the right, same size and place every episode. Code: `remotion/src/shared/DevMascot.tsx`. Do **not** use Rick Sanchez or any existing cartoon character — copyright risk and it's someone else's brand. |
| Diagram | 1–3 rows under the headline showing the episode's **main idea** (not the in-video example). Each row has a coloured title pill (red = old/bad, green = new/good, blue = neutral) and a flow of chips, `+`, `→` and icons. Labels ≥ 23px. It must come from the source notes; note the file in `episode.json → thumbnail.diagram.source`. |
| Must not appear | Long sentences, more than one red box, anything in the bottom-left corner or outside the 3:4 crop. |

### Headline formulas (pick one per episode)

1. **Number list** — `5 / PANDAS TRICKS / EVERY JAVA DEV / NEEDS`
2. **Myth / conflict** — `THE MEAN / LIES` · `ACCURACY / LIES`
3. **Java vs Python** — `JAVA: 12 LINES / NUMPY: 1`
4. **How it actually works** — `HOW / GRADIENT DESCENT / ACTUALLY / WORKS`
5. **X vs Y** — `Z-TEST / VS / T-TEST`
6. **Stop / start** — `STOP WRITING / IF-ELSE / RULES / LET THE MACHINE LEARN` (Day 1)

Examples: Day 3 `JAVA LOOP / VS / NUMPY` (red: VS) · Day 14 `THE MEAN / LIES` (red: LIES) ·
Day 66 `ACCURACY / LIES` · Day 71 `A MODEL / MADE OF / IF / STATEMENTS` (red: IF).

### How it's made

Rendered by Remotion from code, so the layout is identical every day: `npm run thumb day_NN` reads
`remotion/src/episodes/day_NN/episode.json → thumbnail { blocks, diagram }` and writes
`remotion/out/day_NN/thumbnail.png`, plus `thumbnail_grid.png` (the 3:4 crop) and
`thumbnail_grid_200.png`. `npm run qa day_NN` checks the crop, the empty bottom-left corner, the
box/word/red-box rules and that the diagram has a source. Final by-eye check: at ~200px wide the
headline must still read — if it doesn't, cut words.

## 6. How this roadmap grows (without ever changing)

- **Never** insert, reorder or renumber Days 1–84.
- Learned something new that belongs *earlier* (e.g. a new pandas trick)? Add it as a
  **"Bonus"** episode (`bonus_<slug>`) — not numbered — or to a later season.
- New subjects become new seasons, continuing the Day count:
  - **Season 2 — Deep Learning** (Day 85+): `05_Deep_Learning`
  - **Season 3 — Transformers, RAG & Agents**: `06_…`, `07_…`, `08_…`
  - **Season 4 — MLOps & Cloud**: `09_…`, `11_…`
  - Projects like `18_Projects/01_Delhi_Air_Forecast` open whichever season they fit.
- Those folders are still mostly empty, so their episode lists get locked the same way
  when you finish learning them.

## 7. Source notes that overlap (already resolved above)

- Variance/std appears in both `03_Math/02_Statistics` and `02_DataScience/01` → taught once, Days 23–24.
- Correlation appears in both → taught once, Day 27.
- Linear regression appears in `03_Math/05_…` and `04_ML/16_…` → merged into Days 56–58.
- `04_ML` folder numbers are **not** teaching order (e.g. Logistic Regression is folder 40
  but Day 65). The table above is the order; the folder numbers are just storage.
