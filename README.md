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

```
math_for_ml/                  Worked math notes, by phase
  phase_5_linear_regression/
    practice_exercises/       Step-by-step practice problems & solutions

DataScience_Y/                 Hypothesis testing notes (Phase 2 stats)
  Z-Test vs T-Test.md           Z-Test vs T-Test — when to use which, df, formulas
  09-14_Hypothesis_Testing_*    Worked examples: one-sample T-test (95%/80% CI),
                                 paired two-sample T-test
  15-16_Hypothesis_Testing_Chi_Square_Test.ipynb  Worked Chi-Square test examples

phase_3_classical_ml/          Structured Phase 3 curriculum — one evolving
                                 Riverstone Bank loan-default dataset
  00_strategy.md                 Teaching rhythm, topic list, status
  01_data_collection/            ✅ Data Collection
  02_data_cleaning/               ✅ Data Cleaning, Missing Values, Outliers

ML/                            External course notes (WsCubeTech) — conceptual
                                 primer (01-04) + hands-on feature-engineering
                                 practice (05-19) + a capstone pipeline project
                                 (project/) — feeds vocabulary and code into Phase 3
  01._LEARNING.MD                 What is ML, history, paradigm shift,
                                   classification, advantages/disadvantages
  02_ML_Roadmap.MD                Full course pipeline — feature engineering/
                                   selection, algorithms, tuning, deployment
  03_Types_Of_Variables.MD         Numerical/Categorical/Date-Time/Mixed
                                   variables, with a master reference table
  04_Data_Cleaning.MD              5 problems, raw-vs-cleaned example,
                                   6 sub-skills (2 new: duplicates, inconsistency)
  05_Data_Cleaning_Practice.ipynb  Hands-on: missing-value detection (isnull(),
                                   heatmap, bar chart), the 50% drop rule, and
                                   mean/median/mode filling with a before/after chart
  06_Dropping_Missing_Values.MD    Column-first (>=50%) then row deletion —
                                   why blind dropna() cost 26% of rows here
  06_Dropping_Missing_Values.ipynb  Same file's code, every line run separately
                                   with its own output — no step left unverified
  06_High_Missing_Column_Practice.ipynb  loans_guarantor.csv — a dataset where
                                   Method 1 actually fires (~62% missing column)
  loans_guarantor.csv              loans.csv + Guarantor_Income, deliberately
                                   >50% missing, for the >50%-column scenario
  07_Filling_Missing_Values.MD     Mean/median/mode vs ffill/bfill, plus two
                                   pandas 3.0 fixes verified against loans.csv
  07_Filling_Missing_Values.ipynb  Statistic fill (mean/median/mode) on loans.csv,
                                   both pandas 3.0 gotchas proven live, line by line
  07b_Ordered_And_Wide_Fill_Practice.ipynb  ffill/bfill on a real ordered series,
                                   axis=1 on genuinely comparable columns
  daily_temperature.csv            30-day ordered series, 5 gaps — for a real
                                   ffill/bfill example loans.csv can't provide
  store_sales_wide.csv             8 stores x Mon-Fri sales, scattered gaps — for
                                   a real axis=1 fill example
  08_Finding_Missing_Values_Scikit_Learning.ipynb  SimpleImputer on loans.csv —
                                   before/after mean-fill chart, why mean is wrong
                                   for Credit_History, all 4 strategies compared
  loans.csv                        618-row loan dataset (generated), matches the
                                   exact missing-value pattern from the course
  09_one_hot_encoding.ipynb        One-hot encoding for unordered categorical
                                   columns — pd.get_dummies / OneHotEncoder
  10_Label_Encoding.ipynb          Label encoding for the target/binary column
  11_Ordinal_Encoding.ipynb        Ordinal encoding for genuinely ordered
                                   categories (e.g. Education, Performance)
  12_Outlier.ipynb                 Detecting outliers — boxplots, IQR, Z-score
  13_Outlier_Removal_IQR.ipynb     Removing outliers with the IQR method,
                                   before/after boxplot comparison
  14_Outlier_Removal_Z_Score.ipynb  Removing outliers with the Z-score method,
                                   cross-checked against the IQR result
  15_Feature_Scaling.ipynb         Standardization (StandardScaler)
  16_Feature_Scaling_Normalization.ipynb  Min-Max normalization, vs. standardization
  17_Handling_Duploicate_Data.ipynb  Detecting and dropping exact duplicate rows
  18_Replace_Change_Data_Type.ipynb  Fixing bucketed text-numbers (e.g. "3+")
                                   with .replace() + .astype()
  19_Function_Transformer.ipynb    Fixing right-skewed distributions with
                                   FunctionTransformer + log1p, before/after plots
  project/                        Capstone mini-project applying every technique
                                   from 04-19 to one new, deliberately messy dataset
    ARCHITECTURE.md                 Full 9-stage pipeline diagram (Mermaid) +
                                   data dictionary of every injected data issue
    Employee_Attrition_Pipeline.ipynb  706-row synthetic HR dataset run through
                                   the full cleaning-to-model-ready pipeline
    employee_attrition_raw.csv      Raw synthetic dataset (seed 42, reproducible)

Pandas/ NumPy/ Matplotlib/ seaborn/   Python foundations practice
irisData_Exploration/                 Early data exploration practice

AI_Engineering_Roadmap.md     Full roadmap — phases, topics, status, depth rules
```

## Current Status

✅ **Phase 1 — Python Foundations:** Done

🟡 **Phase 2 — Math for ML:** Almost done — Meera's electricity bill ✅,
hypothesis testing (Z-Test, T-Test, paired T-test, Chi-Square) ✅, see
`DataScience_Y/`. Still open: independent two-sample T-test, ANOVA, and
classification metrics basics.

🟡 **Phase 3 — Classical Machine Learning:** Current focus — Data
Collection ✅ and Data Cleaning ✅ done in `phase_3_classical_ml/`, Feature
Engineering next up. Running alongside: a separate hands-on course track in
`ML/` — conceptual primer (01-04) ✅ ("Use of Machine Learning Technology"
still open), hands-on feature-engineering practice (05-19: encoding,
outliers, scaling, duplicates, dtype fixes) ✅, and a capstone pipeline
project (`ML/project/`) ✅. Still open in that track: feature selection,
ML algorithms, hyperparameter tuning, deployment, Docker/Kubernetes.

See the roadmap file for the complete phase list and progress tracking, or
open `roadmap-visual.html` in a browser for a visual mind-map version.