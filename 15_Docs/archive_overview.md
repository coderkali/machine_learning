# Machine Learning & AI Engineering Journey

Personal learning repository — Python → Math for ML → Classical Data
Science → Neural Networks → NLP/Transformers → Generative AI → RAG →
Agentic AI.

**Target role:** Agentic AI Engineer — building production-grade GenAI, RAG,
and Agentic AI systems on top of existing LLMs, backed by 12+ years of
Java/Spring Boot engineering experience. Not pursuing a Data Scientist or ML
Researcher path.

## Full Roadmap

See **[`AI_Engineering_Roadmap.md`](./AI_Engineering_Roadmap.md)** for the
complete phase-by-phase breakdown — topics, current status, required math
depth per phase, and the capstone project plan. That file is the single
source of truth for this journey; keep it updated as phases progress.

Open **[`roadmap-visual.html`](./roadmap-visual.html)** in a browser for a
mind-map visualization of the same phases and status — regenerate it by
hand whenever the roadmap file changes.

## Repository Structure

- **`math_for_ml/`** — Worked math notes, by phase
  - `phase_5_linear_regression/practice_exercises/` — Step-by-step practice problems & solutions

- **`DataScience_Y/`** — Hypothesis testing notes (Phase 2 stats)
  - `Z-Test vs T-Test.md` — Z-Test vs T-Test: when to use which, degrees of freedom, formulas
  - `09-14_Hypothesis_Testing_*` — Worked examples: one-sample T-test (95%/80% CI), paired two-sample T-test
  - `15-16_Hypothesis_Testing_Chi_Square_Test.ipynb` — Worked Chi-Square test examples

- **`phase_3_classical_ml/`** — Structured Phase 3 curriculum, one evolving Riverstone Bank loan-default dataset
  - `00_strategy.md` — Teaching rhythm, topic list, status
  - `01_data_collection/` — ✅ Data Collection
  - `02_data_cleaning/` — ✅ Data Cleaning, Missing Values, Outliers

- **`ML/`** — External course notes (WsCubeTech): conceptual primer (01–04) + hands-on feature-engineering practice (05–19) + a capstone pipeline project (`project/`) + feature selection (20–22) + ML algorithms, starting with regression (23–26) — feeds vocabulary and code into Phase 3
  - `01._LEARNING.MD` — What is ML, history, paradigm shift, classification, advantages/disadvantages
  - `02_ML_Roadmap.MD` — Full course pipeline: feature engineering/selection, algorithms, tuning, deployment
  - `03_Types_Of_Variables.MD` — Numerical/Categorical/Date-Time/Mixed variables, with a master reference table
  - `04_Data_Cleaning.MD` — 5 problems, raw-vs-cleaned example, 6 sub-skills (2 new: duplicates, inconsistency)
  - `05_Data_Cleaning_Practice.ipynb` — Hands-on: missing-value detection (`isnull()`, heatmap, bar chart), the 50% drop rule, mean/median/mode filling with a before/after chart
  - `06_Dropping_Missing_Values.MD` / `.ipynb` — Column-first (≥50%) then row deletion — why blind `dropna()` cost 26% of rows here; every line run separately with its own output
  - `06_High_Missing_Column_Practice.ipynb` + `loans_guarantor.csv` — `loans.csv` + `Guarantor_Income`, deliberately >50% missing, for the >50%-column scenario
  - `07_Filling_Missing_Values.MD` / `.ipynb` — Mean/median/mode vs ffill/bfill, plus two pandas 3.0 fixes verified against `loans.csv`
  - `07b_Ordered_And_Wide_Fill_Practice.ipynb` + `daily_temperature.csv`, `store_sales_wide.csv` — ffill/bfill on a real ordered series; `axis=1` on genuinely comparable columns
  - `08_Finding_Missing_Values_Scikit_Learning.ipynb` + `loans.csv` — `SimpleImputer` on `loans.csv`: before/after mean-fill chart, why mean is wrong for `Credit_History`, all 4 strategies compared (618-row generated dataset matching the course's exact missing-value pattern)
  - `09_one_hot_encoding.ipynb` — One-hot encoding for unordered categorical columns (`pd.get_dummies` / `OneHotEncoder`)
  - `10_Label_Encoding.ipynb` — Label encoding for the target/binary column
  - `11_Ordinal_Encoding.ipynb` — Ordinal encoding for genuinely ordered categories (e.g. Education, Performance)
  - `12_Outlier.ipynb` — Detecting outliers: boxplots, IQR, Z-score
  - `13_Outlier_Removal_IQR.ipynb` — Removing outliers with the IQR method, before/after boxplot comparison
  - `14_Outlier_Removal_Z_Score.ipynb` — Removing outliers with the Z-score method, cross-checked against IQR
  - `15_Feature_Scaling.ipynb` — Standardization (`StandardScaler`)
  - `16_Feature_Scaling_Normalization.ipynb` — Min-Max normalization, vs. standardization
  - `17_Handling_Duploicate_Data.ipynb` — Detecting and dropping exact duplicate rows
  - `18_Replace_Change_Data_Type.ipynb` — Fixing bucketed text-numbers (e.g. `"3+"`) with `.replace()` + `.astype()`
  - `19_Function_Transformer.ipynb` — Fixing right-skewed distributions with `FunctionTransformer` + `log1p`, before/after plots
  - `project/` — Capstone mini-project applying every technique from 04–19 to one new, deliberately messy dataset
    - `ARCHITECTURE.md` — Full 9-stage pipeline diagram (Mermaid) + data dictionary of every injected data issue
    - `Employee_Attrition_Pipeline.ipynb` — 706-row synthetic HR dataset run through the full cleaning-to-model-ready pipeline
    - `employee_attrition_raw.csv` — Raw synthetic dataset (seed 42, reproducible)
  - `20_Feature_Selection_techniques.MD` / `.ipynb` — Filter/Wrapper/Embedded overview, Forward Selection & Backward Elimination on `diabetes.csv`
  - `21_Feature_Selection_VarianceThreshold.ipynb` — Dropping near-constant columns with `VarianceThreshold`
  - `22_Forward_Backward_Practice.ipynb` — Forward/backward wrapper selection redone on a synthetic dataset, one small step at a time (`SequentialFeatureSelector`)
  - `23_Simple_Dataset_Practice.MD` / `.ipynb` — Train/test/predict from scratch on a tiny hand-built dataset, checked by hand at every step
  - `24_Regression_Analysis.MD` — Map of regression analysis: every type the course names (simple/multiple/polynomial/etc.), before going hands-on
  - `25_Simple_Linear_Regression.MD` — Concepts-only: `y = m·x + c`, slope/intercept, residuals, Ordinary Least Squares
  - `26_Simple_Linear_Regression.ipynb` + `placement.csv` — Hands-on `scikit-learn` model on real CGPA→package data: train/test split, `.fit()`, `.predict()`, R² score, reading back `coef_`/`intercept_`, plus 4 residual-diagnostic visualizations (vertical-gap plot, residuals-vs-predicted, residual histogram, actual-vs-predicted)
  - `27_Multiple_Linear_Regression.ipynb` + `regression_dataset.csv` — Extending Simple Linear Regression to multiple predictors (`y = m1·x1 + m2·x2 + c`), hands-on with `scikit-learn`
  - `28_Polynomial_Regression.ipynb` + `polynomial_dataset.csv` — Fitting curved relationships (`y = b0 + b1·x + b2·x² + ...`) via `PolynomialFeatures` + `LinearRegression`
  - `29_Cost_Function.MD` — Concepts-only: why a cost function is needed, cost vs. loss, the cost curve/bowl, types of cost function (MSE/MAE/RMSE for regression, cross-entropy for classification)
  - `30_Cost_Function_MSE_GradientDescent.ipynb` — Hands-on: MSE built from scratch, Gradient Descent implemented and run step-by-step on real data, cost bowl plotted for real, verified against `scikit-learn`'s OLS, and MSE vs. MAE outlier sensitivity proven with real numbers
  - `31_Mean_Absolute_Error.MD` — MAE deep dive: worked quiz-marks example, MAE vs. MSE curve shapes, four real drawbacks (sharp corner, equal-weighting, slower training, median- vs. mean-seeking)
  - `32_Root_Mean_Squared_Error.MD` — RMSE deep dive: √MSE unpacked, why the square root matters (readable units), when to prefer it over MSE/MAE (real outlier-growth comparison: MAE 1.47× vs. RMSE 4.04× vs. MSE 16.32×)

- **`AI_ML_Series/`** — Second external course (started 2026-08-12), Python → libraries → ML. Deliberately runs at two speeds — see [`AI_ML_Series/00_course_map.md`](./AI_ML_Series/00_course_map.md)
  - `01_numpy/`, `02_pandas/`, … — **Track A**, copy-freely revision of already-complete Phase 1 material; kept fast on purpose
  - `algorithms/` — **Track B**, blind-write. Each algorithm is implemented in NumPy from scratch and asserted against scikit-learn *before* the instructor's code is opened. Same eight-slot "Algorithm Card" every time
  - `algorithms/00_comparison_table.md` — self-generated master comparison across every algorithm, all benchmarked on `ML/diabetes.csv`
  - `_instructor/` folders are gitignored — the course author's material isn't mine to republish, and the friction keeps the blind-write rule honest

- **`Pandas/`, `NumPy/`, `Matplotlib/`, `seaborn/`** — Python foundations practice
- **`irisData_Exploration/`** — Early data exploration practice
- **`AI_Engineering_Roadmap.md`** — Full roadmap: phases, topics, status, depth rules

## Current Status

✅ **Phase 1 — Python Foundations:** Done

✅ **Phase 2 — Math for ML:** Done — Meera's electricity bill ✅,
hypothesis testing (Z-Test, T-Test, paired T-test, Chi-Square) ✅, see
`DataScience_Y/`. Independent two-sample T-test and ANOVA are intentionally
skipped (scope decision, not needed for the target role); classification
metrics basics moved to Phase 3, where it's already a tracked topic.

🟡 **Phase 3 — Classical Machine Learning:** Current focus — Data
Collection ✅ and Data Cleaning ✅ done in `phase_3_classical_ml/`, Feature
Engineering next up. Running alongside: a separate hands-on course track in
`ML/` — conceptual primer (01-04) ✅ ("Use of Machine Learning Technology"
still open), hands-on feature-engineering practice (05-19: encoding,
outliers, scaling, duplicates, dtype fixes) ✅, a capstone pipeline
project (`ML/project/`) ✅, feature selection (20-22: filter/wrapper/
embedded, `VarianceThreshold`, forward/backward selection) ✅, Simple/
Multiple/Polynomial Linear Regression (23-28: from-scratch train/test/
predict, regression overview, concepts, and hands-on `scikit-learn`
models) ✅, and Cost Functions (29-32: why a cost function is needed,
MSE + Gradient Descent from scratch, MAE, and RMSE — each of the "core
three" regression error metrics with its own deep dive) ✅. Still open in
that track: the rest of ML algorithms (classification, clustering),
hyperparameter tuning, deployment, Docker/Kubernetes.

See the roadmap file for the complete phase list and progress tracking, or
open `roadmap-visual.html` in a browser for a visual mind-map version.