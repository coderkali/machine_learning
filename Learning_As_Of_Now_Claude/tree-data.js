/* Learning tree data — generated from a full scan of the repository.
   status: done | learning | archive | todo
   Every `path` is relative to this folder. */

const TREE = {
  title: "MACHINE_LEARNING",
  meta: "My complete AI/ML learning repository",
  status: "learning",
  kind: "root",
  children: [

/* ============================================================
   BRANCH 1 — ACTIVE BOOTCAMP
   ============================================================ */
{
  title: "AI_ML_Series",
  meta: "Active 13-phase bootcamp workspace",
  status: "learning",
  kind: "branch",
  path: "../AI_ML_Series/README.md",
  note: "The live course. Phases 01, 02 and 05 are in progress; the rest are waiting.",
  children: [

    /* ---------- PHASE 01 ---------- */
    {
      title: "Phase 01 — Engineering and Python Foundation",
      meta: "Modules M01 Python, M24 Git & GitHub",
      status: "learning",
      kind: "phase",
      path: "../AI_ML_Series/01_engineering_python/README.md",
      children: [
        {
          title: "Session 01 — Variables, Data Types, Numbers, Strings",
          meta: "Notebook · 43 cells · 38 code cells · all executed",
          status: "learning",
          path: "../AI_ML_Series/01_engineering_python/01_python/session_01_variables_data_types_numbers_strings/variables_data_types_numbers_strings.ipynb",
          details: [
            "Variables and naming rules",
            "Data types — int, float, complex, bool, str",
            "Numbers and arithmetic operators",
            "Strings — indexing, slicing, methods",
            "type() and type conversion",
            "input() and formatted output (f-strings)"
          ]
        },
        {
          title: "Git and GitHub (M24)",
          meta: "Not started as a course module",
          status: "todo",
          details: [
            "The repository itself uses Git daily",
            "No course checkpoint evidence yet: branches, conflicts, stash, rebase, tags, reflog, Actions"
          ]
        }
      ]
    },

    /* ---------- PHASE 02 ---------- */
    {
      title: "Phase 02 — Python Data Toolkit and Rapid Apps",
      meta: "Modules M02 Visualization, M03 NumPy & Pandas, M04 Streamlit, M07 scikit-learn",
      status: "learning",
      kind: "phase",
      path: "../AI_ML_Series/02_data_toolkit_apps/README.md",
      note: "The biggest branch in the repository — 35 notebooks live here.",
      children: [

        {
          title: "01 — NumPy",
          meta: "3 notebooks · README · skill level: Comfortable",
          status: "learning",
          path: "../AI_ML_Series/02_data_toolkit_apps/01_numpy/README.md",
          children: [
            {
              title: "example_01 — NumPy Arrays",
              meta: "141 cells · 77 code cells",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/01_numpy/example_01.ipynb",
              details: [
                "Creating arrays, dtype, shape, ndim, size",
                "reshape, ravel, flatten",
                "Indexing, slicing, boolean masks",
                "Array builders — zeros, ones, arange, linspace, eye"
              ]
            },
            {
              title: "example_02 — Operations, Broadcasting, Linear Algebra",
              meta: "39 cells · 18 code cells · 16 executed",
              status: "learning",
              path: "../AI_ML_Series/02_data_toolkit_apps/01_numpy/example_02.ipynb",
              details: [
                "Element-wise maths and universal functions",
                "Broadcasting rules",
                "Statistics — mean, std, min, max, sum",
                "Matrix product with @ and np.linalg",
                "Sorting, stacking, splitting",
                "Open gap: the vstack / hstack / split cell (section 17) has never been run"
              ]
            },
            {
              title: "project_01 — OrderHub API Health Monitor",
              meta: "20 cells · 13 code cells · Parts 1–2 of 12 complete",
              status: "learning",
              path: "../AI_ML_Series/02_data_toolkit_apps/01_numpy/project_01_api_health.ipynb",
              details: [
                "Latency arrays for an API monitoring scenario",
                "Robust outlier detection with MAD",
                "Still incomplete — 10 of 12 planned parts remain"
              ]
            }
          ]
        },

        {
          title: "02 — Pandas",
          meta: "2 notebooks · 13 practice CSVs · skill level: Applied",
          status: "learning",
          path: "../AI_ML_Series/02_data_toolkit_apps/02_pandas/README.md",
          children: [
            {
              title: "example_01 — Pandas Basics",
              meta: "82 cells · 44 code cells",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/02_pandas/example_01.ipynb",
              details: [
                "Series and DataFrame shapes",
                "head, tail, info, describe",
                "loc vs iloc, index reassignment",
                "Column selection and first transformations"
              ]
            },
            {
              title: "example_02 — The Working Toolkit",
              meta: "47 cells · 24 code cells · 23 executed",
              status: "learning",
              path: "../AI_ML_Series/02_data_toolkit_apps/02_pandas/example_02.ipynb",
              details: [
                "query(), missing values, duplicates",
                "astype, get_dummies, rank",
                "groupby and pivot_table",
                ".dt datetime accessor and .str string accessor",
                "Open gap: read_csv runs before to_csv, and to_excel needs openpyxl"
              ]
            },
            {
              title: "DataSet — 13 practice CSVs",
              meta: "Shared by the Pandas and scikit-learn notebooks",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/02_pandas/DataSet/",
              details: [
                "age1.csv, age2.csv, income.csv — scaling and regression",
                "encoding.csv, job.csv — categorical encoding",
                "Years.csv, Salary.csv — simple regression",
                "pca1.csv — 768 rows × 9 columns for PCA",
                "Bike.csv, Car.csv, exam.csv, exam1.csv, abc.csv"
              ]
            }
          ]
        },

        {
          title: "03 — Matplotlib",
          meta: "1 notebook · 67 cells · 51 code cells · skill level: Applied",
          status: "done",
          path: "../AI_ML_Series/02_data_toolkit_apps/03_matplotlib/example_01.ipynb",
          details: [
            "Line, scatter, bar, histogram, pie charts",
            "fill_between and annotation",
            "Subplots and figure layout",
            "savefig and figure export"
          ]
        },

        {
          title: "04 — Seaborn",
          meta: "1 notebook · 60 cells · 42 code cells · seaborn 0.13.2",
          status: "done",
          path: "../AI_ML_Series/02_data_toolkit_apps/04_seaborn/example_01.ipynb",
          details: [
            "Relational plots — scatterplot, lineplot",
            "Distribution plots — histplot, kdeplot",
            "Categorical plots — box, violin, bar, count",
            "Regression plots and grids (pairplot, FacetGrid)",
            "Themes and styling"
          ]
        },

        {
          title: "05 — Iris Visual Explorer",
          meta: "Notebook + a small HTML/CSS/JS web app",
          status: "done",
          path: "../AI_ML_Series/02_data_toolkit_apps/05_iris_visual_explorer/index.html",
          details: [
            "iris_dataset_explained.ipynb — what is actually inside the Iris dataset (40 cells)",
            "index.html + styles.css + script.js — interactive explorer"
          ]
        },

        {
          title: "06 — Plotly",
          meta: "1 notebook · 33 cells · 21 code cells · plotly 6.9.0",
          status: "done",
          path: "../AI_ML_Series/02_data_toolkit_apps/06_plotly/README.md",
          details: [
            "Line, scatter, bar, box, violin, pie, area charts",
            "3D scatter and sunburst",
            "concept_3d_projection.md — how a 3D scatter turns three numbers into one pixel"
          ]
        },

        {
          title: "07 — Streamlit",
          meta: "2 apps + a line-by-line code review · skill level: Beginner",
          status: "learning",
          path: "../AI_ML_Series/02_data_toolkit_apps/07_streamlit/README.md",
          details: [
            "app.py — Tips Explorer: widgets, layout, caching, session state",
            "sales_analysis.py — learner-written dashboard with matplotlib, seaborn and plotly charts",
            "sales_analysis_explained.md — full code review",
            "Two open defects: st.button re-run model, and a min_value/value contradiction"
          ]
        },

        {
          title: "08 — scikit-learn  (M07 Machine Learning)",
          meta: "26 notebooks · the current lesson · skill level: Comfortable",
          status: "learning",
          kind: "big",
          path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/README.md",
          note: "One interface for everything: fit → transform / predict. Anything learned from data ends with a trailing underscore.",
          children: [
            {
              title: "01 — train_test_split",
              meta: "28 cells · 12 code cells",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/01_train_test_split_data.ipynb",
              details: [
                "What scikit-learn is and the shape of the whole library",
                "Choosing X and Y",
                "Every parameter: test_size, shuffle, random_state, stratify",
                "The four-value return order",
                "Three experiments with three charts"
              ]
            },
            {
              title: "02 — Synthetic datasets (make_*)",
              meta: "71 cells · 39 code cells · 24 charts",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/02_make_*_dataset.ipynb",
              details: [
                "make_regression — noise, bias, coef, n_informative",
                "make_classification — informative / redundant / useless columns, class_sep, flip_y, weights",
                "make_blobs — cluster_std, explicit centers",
                "make_circles — factor · make_moons",
                "The shuffle=True column-permutation gotcha, found by the learner"
              ]
            },
            {
              title: "03 — Preprocessing",
              meta: "83 cells · 36 code cells",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/03_preprocessing.ipynb",
              details: [
                "StandardScaler (x−μ)/σ, MinMaxScaler, RobustScaler — hand-computed and checked with np.allclose",
                "Binarizer, Normalizer (row-wise, not column-wise)",
                "LabelEncoder and OneHotEncoder",
                "A measured data-leakage demo",
                "First Pipeline + ColumnTransformer"
              ]
            },
            {
              title: "04 — Univariate, Bivariate, Multivariate Analysis",
              meta: "27 cells · 15 code cells · Iris",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/04_uni_boi_multi_variate_analaysis.ipynb",
              details: [
                "Where Iris target values 0/1/2 actually come from",
                "Univariate — one column at a time with the np.zeros_like flat-line trick",
                "Bivariate — plt.scatter(c=target)",
                "Multivariate — sns.pairplot(hue=, markers=)",
                "A real mislabelling bug kept and explained, not hidden"
              ]
            },
            {
              title: "05 — Linear Regression",
              meta: "49 cells · 21 code cells",
              status: "done",
              lesson: "lessons/05-linear-regression.html",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/05_Linear_Regression.ipynb",
              details: [
                "fit / predict / score on a real split",
                "coef_ (slope) and intercept_ — the two numbers that are the model",
                "predict() rebuilt by hand as m*x + c and verified with np.allclose",
                "How fit() finds those numbers: squared-error cost, the parabola, the closed form",
                "The Normal Equation (XᵀX)⁻¹Xᵀy checked against sklearn",
                "Hand-written gradient descent reaching the same answer in 60 steps"
              ]
            },
            {
              title: "05a — coef_ and intercept_ by hand",
              meta: "32 cells · 12 code cells",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/05a_Coef_And_Intercept_By_Hand.ipynb",
              details: [
                "The slope as one area divided by another area",
                "The intercept as a walk back to the y-axis",
                "Four drawn pictures, then a one-page summary"
              ]
            },
            {
              title: "06 — Multiple Linear Regression",
              meta: "37 cells · 19 code cells",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/06_multiple_linear_regression.ipynb",
              details: [
                "Age + Degrees → Income: the line becomes a plane, drawn in 3-D",
                "predict() rebuilt as b0 + X @ coef_",
                "Coefficients as partial effects — Age moves from −61 to −20.4 once Degrees joins",
                "Why a 0.976 test R² over 2 rows is not evidence"
              ]
            },
            {
              title: "07 — Ridge Regression (L2)",
              meta: "37 cells · 23 code cells",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/07_Ridge.ipynb",
              details: [
                "Cost becomes error + α × slope²",
                "alpha as the first hyperparameter — a knob you set, not a value fit learns",
                "The shrink factor: new slope = old slope × S/(S+α), verified across nine alphas",
                "Why a large alpha flattens the line onto mean(y_train)",
                "The alpha table from 0 to 10,000,000"
              ]
            },
            {
              title: "08 — Lasso Regression (L1)",
              meta: "27 cells · 20 code cells",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/08_Lasso.ipynb",
              details: [
                "Penalty α × |slope| subtracted directly from the slope",
                "Slopes can reach exactly 0 — which is why L1 selects features",
                "alpha = 9.5 is the point where the slope hits zero",
                "Common mistakes and a key takeaway"
              ]
            },
            {
              title: "09 — ElasticNet",
              meta: "26 cells · 18 code cells",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/09_ElasticNet.ipynb",
              details: [
                "L1 and L2 blended together",
                "alpha sets penalty strength, l1_ratio sets the mix",
                "Sweeping alpha from 0.01 to 100 — from plain LinearRegression to a flat mean line"
              ]
            },
            {
              title: "10 — Polynomial Regression",
              meta: "49 cells · 29 code cells · 21 executed",
              status: "learning",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/10_Polynomial Regression.ipynb",
              details: [
                "PolynomialFeatures and degree",
                "The first worked underfit / overfit comparison",
                "Reading the chart: what the curve is really doing between the points"
              ]
            },
            {
              title: "11 — Cross Validation",
              meta: "43 cells · 36 code cells",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/11_Corss_validation.ipynb",
              details: [
                "The baseline — one lucky train_test_split",
                "KFold(n_splits=5) and the problem hiding inside the folds",
                "StratifiedKFold",
                "LeavePOut(p=2) and LeaveOneOut",
                "Which one to use, and when"
              ]
            },
            {
              title: "12 — Clustering (K-Means)",
              meta: "52 cells · 27 code cells · 5000 customers",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/12_clustering.ipynb",
              details: [
                "First unsupervised algorithm — no labels at all",
                "The algorithm worked out by hand before the library call",
                "Why n_clusters=4, and the elbow method",
                "What .fit() actually stores, and what predict() means with no labels",
                "Where K-Means gets it wrong"
              ]
            },
            {
              title: "13 — Hierarchical Clustering",
              meta: "33 cells · 12 code cells · plus a standalone HTML visual guide",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/13_Hirerachical_Clustering.ipynb",
              details: [
                "Agglomerative clustering — nine strangers in an empty town",
                "How two groups measure distance: linkage",
                "Building and reading the dendrogram",
                "Cutting the tree to get clusters",
                "hierarchical-clustering-visual-guide.html sits beside it"
              ]
            },
            {
              title: "14 — ROC Curve and AUC",
              meta: "17 cells · 9 code cells",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/14_roc.ipynb",
              details: [
                "The model returns a probability, not a label",
                "What the ROC curve actually plots",
                "AUC as one number for the whole curve",
                "The metrics.plot_roc_curve AttributeError kept on purpose, with RocCurveDisplay beside it",
                "Handwritten note: 14_ROC_Curve.png"
              ]
            },
            {
              title: "15 — Model Evaluation",
              meta: "22 cells · 13 code cells · breast-cancer dataset",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/15_Model_Evaluation.ipynb",
              details: [
                "accuracy_score = 0.9298, and why accuracy alone lies on imbalanced classes",
                "Confusion matrix [[43, 4], [4, 63]] and ConfusionMatrixDisplay",
                "Precision, recall, F1",
                "One habit to fix: the argument order accuracy_score(Y_pred, Y_test)",
                "Handwritten note: 15_Model_Evaluation.png"
              ]
            },
            {
              title: "16 — Decision Tree Classification",
              meta: "46 cells · 31 code cells",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/16_Descison_Tree_Classfication.ipynb",
              details: [
                "Entropy — putting a number on confusion",
                "Asking the first question and scoring both rooms",
                "Information gain: was the question worth asking?",
                "Picking the winner, then repeating inside the messy room",
                "Handing it to DecisionTreeClassifier · exported dt.tree",
                "Handwritten note: 16_DTC.png"
              ]
            },
            {
              title: "17 — Decision Tree Regression",
              meta: "24 cells · 12 code cells",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/17_Descison_Tree_Regression.ipynb",
              details: [
                "The new measuring tape: variance instead of entropy",
                "Scoring the two candidate questions",
                "Reading the exported rulebook (dt1.tree)",
                "Why score() means something completely different for a regressor",
                "Handwritten note: 17_DTR.png"
              ]
            },
            {
              title: "18 — Naive Bayes",
              meta: "58 cells · 33 code cells",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/18_Naive_Bayers.ipynb",
              details: [
                "Bayes theorem, and why the algorithm is called naive",
                "GaussianNB — one bell curve per class",
                "Worked by hand on fourteen students before the library call",
                "Then the real Iris dataset, split and scored",
                "Reading the classification report",
                "Handwritten note: 18_Naive_Bayes_Detailed_Handwritten_Notes.png"
              ]
            },
            {
              title: "19 — Hyperparameter Tuning",
              meta: "44 cells · 27 code cells · 26 executed",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/19_Hyperparameter_Tuning.ipynb",
              details: [
                "Three settings, changed three ways",
                "By hand — pick four combinations",
                "GridSearchCV — what that one fit() really does, all 24 fits in one picture",
                "RandomizedSearchCV — try only a few, picked at random",
                "The trade-off, and the syntax in one place",
                "Handwritten note: 19_Hyperparameter_Tuning_Detailed_Handwritten_Notes.png"
              ]
            },
            {
              title: "20 — Ensemble Methods",
              meta: "44 cells · 27 code cells",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/20_Ensemble_methods.ipynb",
              details: [
                "Three ways to build a panel of models",
                "Random Forest — the bagging family, and how it keeps its trees different",
                "AdaBoost — the boosting family",
                "Gradient Boosting — boosting by chasing the leftover error",
                "Where each one is used in real systems"
              ]
            },
            {
              title: "20 — Preprocessing, Explained",
              meta: "65 cells · 38 code cells · not yet committed to git",
              status: "learning",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/20_Preprocessing.ipynb",
              details: [
                "Three columns that cannot see each other — the scale problem",
                "Concept 1 — Scaling",
                "Concept 2 — Binarizer",
                "Concept 3 — Normalizer",
                "Each concept told as: how we got here → the problem → the idea → what it actually is"
              ]
            },
            {
              title: "21 — Outliers",
              meta: "66 cells · 35 code cells · 12 saved plots",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/21_Outliers.ipynb",
              details: [
                "Four ways to find an outlier",
                "make_blobs — n_samples, centers, cluster_std",
                "Why scatter plots use x[:, 0] and x[:, 1], and what to do with many columns",
                "DBSCAN — who is standing in a crowd and who is standing alone",
                "Reading the plot line, once, properly"
              ]
            },
            {
              title: "22 — Support Vector Classification (2D)",
              meta: "22 cells · 15 code cells",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/22_svc_2D.ipynb",
              details: [
                "Ramesh and the tea stall — fifteen records that no straight line can split",
                "What SVC is actually looking for: the widest margin",
                "When one new column is not enough",
                "Doing it without building the extra columns by hand",
                "One caution about reading the picture"
              ]
            },
            {
              title: "23 — SVC from 2D to a Flexible Surface (3D)",
              meta: "62 cells · 28 code cells · 27 executed",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/23_SVC_3D.ipynb",
              details: [
                "What is wrong with the initial straight-line approach",
                "Solution A — create better features by hand",
                "Solution B — use a polynomial kernel",
                "What the 2D and 3D pictures actually mean",
                "How both solutions show up in real systems"
              ]
            },
            {
              title: "24 — Preprocessing (data at different scales)",
              meta: "3 cells · just started · not yet committed",
              status: "learning",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/24_preprocessing.ipynb",
              details: [
                "Creating data with different scales",
                "The newest file in the repository — barely begun"
              ]
            },
            {
              title: "Handwritten Notes",
              meta: "6 scanned pages",
              status: "done",
              path: "../AI_ML_Series/02_data_toolkit_apps/08_sklearn/HandWritten Notes/",
              details: [
                "14_ROC_Curve.png",
                "15_Model_Evaluation.png",
                "16_DTC.png · 17_DTR.png",
                "18_Naive_Bayes_Detailed_Handwritten_Notes.png",
                "19_Hyperparameter_Tuning_Detailed_Handwritten_Notes.png"
              ]
            }
          ]
        },

        {
          title: "09 — Python ML Visual Guide",
          meta: "Standalone HTML / CSS / JS study app",
          status: "done",
          path: "../AI_ML_Series/02_data_toolkit_apps/09_python_ml_visual_guide/index.html",
          details: ["An interactive visual guide built alongside the notebooks"]
        },

        {
          title: "Learning website",
          meta: "Roadmap, lesson data, labs, data explorer, 21 exported plots",
          status: "learning",
          path: "../AI_ML_Series/learning-website/index.html",
          details: [
            "index.html + app.js + styles.css",
            "learning-map.js, labs.js, lesson-data.js, lesson-details.js",
            "data-explorer.html — browse the datasets in the browser",
            "export_lesson_data.py and refresh_inventory.py keep it in sync",
            "Last checkpoint: 2026-09-05"
          ]
        }
      ]
    },

    /* ---------- PHASES 03 - 13 ---------- */
    {
      title: "Phase 03 — Math and Relational Data",
      meta: "M05 Statistics · M06 Linear Algebra · M19 MySQL · M20 PostgreSQL",
      status: "todo",
      kind: "phase",
      path: "../AI_ML_Series/03_math_relational_data/README.md",
      details: [
        "Not started in the current course",
        "Prior archive work exists for statistics and linear algebra — see the Foundations_Archive branch"
      ]
    },
    {
      title: "Phase 04 — Analytics and Business Intelligence",
      meta: "M17 Excel · M21 Power BI · M22 Tableau · M23 Looker Studio",
      status: "todo",
      kind: "phase",
      path: "../AI_ML_Series/04_analytics_bi/README.md",
      details: ["No evidence yet"]
    },
    {
      title: "Phase 05 — Classical ML and Forecasting",
      meta: "M07 Machine Learning (in progress) · M08 Time Series",
      status: "learning",
      kind: "phase",
      path: "../AI_ML_Series/05_classical_ml_forecasting/README.md",
      details: [
        "M07 is being taught inside Phase 02, so its 26 notebooks live in 02_data_toolkit_apps/08_sklearn/",
        "M08 Time Series — not started: resampling, stationarity, ACF/PACF, ARIMA, SARIMAX"
      ]
    },
    {
      title: "Phase 06 — Neural Networks and AI Modalities",
      meta: "M09 RL · M10 Deep Learning · M11 NLP · M12 Computer Vision",
      status: "todo",
      kind: "phase",
      path: "../AI_ML_Series/06_neural_ai_modalities/README.md",
      details: ["No evidence yet"]
    },
    {
      title: "Phase 07 — Transformers and Prompting",
      meta: "M14 Transformers · M16 Prompt Engineering",
      status: "todo",
      kind: "phase",
      path: "../AI_ML_Series/07_transformers_prompting/README.md",
      details: ["No evidence yet"]
    },
    {
      title: "Phase 08 — Retrieval and LLM Applications",
      meta: "M13 LangChain · M15 VectorDB",
      status: "todo",
      kind: "phase",
      path: "../AI_ML_Series/08_retrieval_llm_apps/README.md",
      details: ["No evidence yet"]
    },
    {
      title: "Phase 09 — Agents, Fine-Tuning and No-Code AI",
      meta: "M18 Agentic AI · M29 Fine-Tuning · M40 No-Code AI",
      status: "todo",
      kind: "phase",
      path: "../AI_ML_Series/09_agents_finetuning_nocode/README.md",
      details: ["No evidence yet"]
    },
    {
      title: "Phase 10 — Containers and MLOps",
      meta: "M27 MLOps · M30 Docker",
      status: "todo",
      kind: "phase",
      path: "../AI_ML_Series/10_containers_mlops/README.md",
      details: ["No evidence yet"]
    },
    {
      title: "Phase 11 — Data Platforms",
      meta: "MongoDB · Cassandra · Spark · Snowflake · Airflow · Kafka · dbt",
      status: "todo",
      kind: "phase",
      path: "../AI_ML_Series/11_data_platforms/README.md",
      details: ["No evidence yet — though Kafka is already a professional strength"]
    },
    {
      title: "Phase 12 — Cloud and LLMOps",
      meta: "M31 Azure · M32 AWS · M33 GCP · M28 LLMOps",
      status: "todo",
      kind: "phase",
      path: "../AI_ML_Series/12_cloud_llmops/README.md",
      details: ["No evidence yet — though AWS is already a professional strength"]
    },
    {
      title: "Phase 13 — AI System Design and Career",
      meta: "M39 System Design · M41 Job Ready Focus",
      status: "todo",
      kind: "phase",
      path: "../AI_ML_Series/13_ai_system_design_career/README.md",
      details: ["No evidence yet"]
    }
  ]
},

/* ============================================================
   BRANCH 2 — FOUNDATIONS ARCHIVE
   ============================================================ */
{
  title: "Foundations_Archive",
  meta: "Historical evidence — preserved, not modernised",
  status: "archive",
  kind: "branch",
  path: "../Foundations_Archive/README.md",
  note: "Everything learned before the current bootcamp. It proves skill, but it does not complete a course module.",
  children: [

    {
      title: "math_for_ml — 5 phases",
      meta: "Hand-worked mathematics notes",
      status: "archive",
      path: "../Foundations_Archive/math_for_ml/README.md",
      children: [
        {
          title: "Phase 1 — Algebra",
          status: "archive",
          meta: "2 notes + an interactive chart",
          path: "../Foundations_Archive/math_for_ml/phase_1_algebra/",
          details: [
            "Variables and expressions",
            "Examples library",
            "linear_vs_nonlinear_charts.html"
          ]
        },
        {
          title: "Phase 2 — Statistics",
          status: "archive",
          meta: "6 notes + a practice question set",
          path: "../Foundations_Archive/math_for_ml/phase_2_statistics/",
          details: [
            "What is statistics — origin story",
            "Mean, median, mode",
            "Variance and standard deviation",
            "Probability basics",
            "Normal distribution",
            "Correlation"
          ]
        },
        {
          title: "Phase 3 — Linear Algebra",
          status: "archive",
          meta: "Notes, FAQ, doubts, worked Iris example, SVG cheat sheet",
          path: "../Foundations_Archive/math_for_ml/phase_3_linear_algebra/",
          details: [
            "Vectors, matrices, shape",
            "Dot product, matrix multiplication, transpose",
            "Practical example — all seven topics on the Iris dataset",
            "Open gap: all nine self-explanation prompts are still blank"
          ]
        },
        {
          title: "Phase 4 — Calculus",
          status: "archive",
          meta: "4 notes",
          path: "../Foundations_Archive/math_for_ml/phase_4_calculus/",
          details: [
            "Slope",
            "Derivative (two passes)",
            "Gradient descent"
          ]
        },
        {
          title: "Phase 5 — Linear Regression from scratch",
          status: "archive",
          meta: "11 topic notes + 11 worked practice exercises",
          path: "../Foundations_Archive/math_for_ml/phase_5_linear_regression/",
          details: [
            "Introduction, cost function, gradient descent",
            "How slope, derivative and cost connect",
            "Finding w and b · why y = wx + b · when it works",
            "Types of data relationships · why we calculate errors",
            "Practice: Priya's water tank, Arjun's recharge, Rohan's gym and freelance earnings",
            "Practice: gradient descent iterations w=340 → 330 → 331, then deriving the exact best w",
            "Practice: Meera's electricity bill — the final solution"
          ]
        }
      ]
    },

    {
      title: "DataScience_Y — Statistics and Hypothesis Testing",
      meta: "19 notebooks",
      status: "archive",
      path: "../Foundations_Archive/DataScience_Y/",
      details: [
        "Measurement of variability · standard deviation · IQR",
        "Skewness · correlation",
        "Central Limit Theorem simulation",
        "Hypothesis testing — Z-test, one-sample and two-sample",
        "T-test — one sample, two sample, paired, at 95% and 80% confidence",
        "Chi-square test and the chi-square test of independence",
        "Z-Test vs T-Test — side-by-side overview",
        "Open gap: the paired T-test notebook first uses an independent-groups standard error"
      ]
    },

    {
      title: "ML — the first machine-learning pass",
      meta: "33 numbered lessons · notebooks and notes",
      status: "archive",
      path: "../Foundations_Archive/ML/",
      children: [
        {
          title: "Foundations and data cleaning (01–08)",
          status: "archive",
          meta: "Notes + 5 notebooks",
          details: [
            "What is ML · the course roadmap · types of variables",
            "Data cleaning concepts and practice on a loan dataset",
            "Dropping missing values, and when method 1 actually fires",
            "Filling missing values · forward/backward fill · axis=1",
            "Imputation with scikit-learn"
          ]
        },
        {
          title: "Encoding, outliers and scaling (09–19)",
          status: "archive",
          meta: "11 notebooks",
          details: [
            "One-hot encoding · label encoding · ordinal encoding",
            "Outliers — detecting them and proving they matter",
            "Outlier removal via IQR and via Z-score",
            "Feature scaling — standardization and min-max normalization",
            "Handling duplicate data · replace and change data type",
            "Function transformer"
          ]
        },
        {
          title: "Feature selection (20–22)",
          status: "archive",
          meta: "3 notebooks + an overview note",
          details: [
            "Feature selection techniques overview",
            "VarianceThreshold",
            "Forward and backward (wrapper) selection, twice"
          ]
        },
        {
          title: "Regression and cost functions (23–33)",
          status: "archive",
          meta: "8 notebooks + 6 notes",
          details: [
            "Train / test / predict from scratch",
            "Regression analysis — overview and types",
            "Simple, multiple and polynomial linear regression",
            "Cost function concepts",
            "MSE and gradient descent, implemented from scratch",
            "MAE and RMSE notes",
            "Open gap: the MAE/MSE/RMSE practical notebook does not yet implement all three"
          ]
        },
        {
          title: "Project — Employee Attrition Data Pipeline",
          status: "archive",
          meta: "77 cells · 44 code cells · plus an ARCHITECTURE.md",
          path: "../Foundations_Archive/ML/project/Employee_Attrition_Pipeline.ipynb",
          details: [
            "End-to-end pipeline on employee_attrition_raw.csv",
            "The most integrated project in the archive",
            "Open gap: preprocessing is fitted before the train/test split — a real leakage defect"
          ]
        }
      ]
    },

    {
      title: "phase_3_classical_ml — Socratic concept notes",
      meta: "Strategy + 2 worked topics",
      status: "archive",
      path: "../Foundations_Archive/phase_3_classical_ml/",
      details: [
        "00 — strategy for the phase",
        "01 — Data collection: the Riverstone case, source-specific failure modes",
        "02 — Data cleaning: missing values and outliers, with an IQR figure"
      ]
    },

    {
      title: "irisData_Exploration — the first hands-on labs",
      meta: "13 notebooks + saved dashboards",
      status: "archive",
      path: "../Foundations_Archive/irisData_Exploration/",
      details: [
        "iris/ — six exploration notebooks and a dashboard",
        "numpy/ — pizza vectorization lab (open gap: a np.max where np.min was meant)",
        "panda/ — pizza grouped analysis",
        "matplotlib/ — three plotting labs",
        "seaborn/ — pizza dashboard",
        "dashboard/ — pizza revenue and final dashboard PNGs"
      ]
    },

    {
      title: "Library basics — plain Python scripts",
      meta: "The very first files in the journey",
      status: "archive",
      details: [
        "NumPy/example_01.py, example_02.py",
        "Pandas/example_01.py",
        "Matplotlib/example_01.py",
        "seaborn/example_01.py",
        "Open gap: some use stale absolute paths"
      ]
    },

    {
      title: "Archive roadmaps",
      meta: "How the journey was planned before the bootcamp",
      status: "archive",
      path: "../Foundations_Archive/roadmap-visual.html",
      details: [
        "AI_Engineering_Roadmap.md — roadmap for senior software engineers",
        "roadmap-visual.html",
        "SKILLS.md — the earlier skill matrix"
      ]
    }
  ]
},

/* ============================================================
   BRANCH 3 — TRACKING
   ============================================================ */
{
  title: "Tracking and Knowledge Base",
  meta: "How progress is measured",
  status: "learning",
  kind: "branch",
  children: [
    {
      title: "ROADMAP.html / ROADMAP.md",
      meta: "13 phases · 41 instructor modules",
      status: "learning",
      path: "../ROADMAP.html",
      details: [
        "The primary visual roadmap",
        "5 modules learning (M01, M02, M03, M04, M07), 36 not started"
      ]
    },
    {
      title: "SKILLS.md — the skill matrix",
      meta: "Separate from course progress",
      status: "learning",
      path: "../SKILLS.md",
      details: [
        "Applied — Pandas, Matplotlib & Seaborn, EDA, cleaning, outliers, encoding, scaling",
        "Comfortable — Python, NumPy, Plotly, feature selection, synthetic data, descriptive statistics, hypothesis testing, gradient descent, train/test workflow, regression, Ridge, MSE/MAE/R², classification accuracy",
        "Beginner — Streamlit, algebra, linear algebra, probability, calculus, decision trees, RMSE, precision/recall, cross-validation, hyperparameter tuning",
        "Not Started — Pipeline/ColumnTransformer in a project, deep learning, NLP, LLMs, RAG, agents, MLOps",
        "No skill is rated Strong yet"
      ]
    },
    {
      title: "docs/ — the shared knowledge base",
      meta: "5 documents",
      status: "learning",
      path: "../docs/",
      details: [
        "curriculum-map.md — all 41 instructor modules with source traceability",
        "concept-map.md · course-overview.md · glossary.md",
        "review-queue.md — 11 open items"
      ]
    },
    {
      title: "Review queue — what needs fixing",
      meta: "11 open items · 10 red, 1 amber",
      status: "learning",
      path: "../docs/review-queue.md",
      details: [
        "Linear algebra self-explanation — nine prompts still blank",
        "Paired vs independent T-test — wrong standard error used first",
        "Leakage-safe preprocessing — never actually done in code",
        "Regression evaluation on a real-sized dataset — R² from 2 test rows",
        "The rest of the regularisation family — RidgeCV, scaling, a real overfitting case",
        "Practical RMSE — not implemented side by side",
        "NumPy minimum check — np.max used where np.min was meant",
        "Streamlit re-run model — two verified defects",
        "NumPy stack and split — cell never executed",
        "Pandas file I/O cells — wrong order, missing openpyxl",
        "Archived path reproducibility — stale absolute paths"
      ]
    }
  ]
}

  ]
};
