# AI/ML Skill Matrix

This file tracks skills demonstrated by work in this repository. It does not
measure bootcamp completion. A skill can have prior evidence while the matching
bootcamp lesson is still open; course completion is tracked separately in
[`ROADMAP.md`](ROADMAP.md).

## Level Guide

| Level | Meaning |
|---|---|
| Not Started | No implementation or worked learning evidence found |
| Beginner | A concept note or first guided exercise exists |
| Comfortable | Several correct, executed exercises show repeatable use |
| Applied | The skill is used inside an integrated project or analysis |
| Strong | Repeated independent projects, verification, and production-quality practice |

No skill is rated **Strong** yet. That level needs more independent projects,
tests, and reproducible end-to-end work.

## Python and Data Work

| Skill | Level | Evidence |
|---|---|---|
| Python fundamentals | Comfortable | Current-course evidence: [Session 01 variables, data types, numbers, and strings](AI_ML_Series/01_engineering_python/01_python/session_01_variables_data_types_numbers_strings/README.md). Prior evidence includes lists, dictionaries, loops, comprehensions, functions, and slicing in the [pizza Pandas lab](Foundations_Archive/irisData_Exploration/panda/pizza_panda.ipynb), [simple classifier lab](Foundations_Archive/ML/23_Simple_Dataset_Practice.ipynb), and [gradient-descent lab](Foundations_Archive/ML/30_Cost_Function_MSE_GradientDescent.ipynb) |
| NumPy | Comfortable | [NumPy fundamentals](AI_ML_Series/02_data_toolkit_apps/01_numpy/example_01.ipynb) and [operations, broadcasting, and linear algebra](AI_ML_Series/02_data_toolkit_apps/01_numpy/example_02.ipynb) — learner-written calls across reshape, element-wise maths, masks, broadcasting, builders, statistics, `@`, sorting, stacking, and `np.linalg`, with a [topic README](AI_ML_Series/02_data_toolkit_apps/01_numpy/README.md). Also the [pizza vectorization lab](Foundations_Archive/irisData_Exploration/numpy/pizza_numpy.ipynb) and Parts 1-2 of the [API health project](AI_ML_Series/02_data_toolkit_apps/01_numpy/project_01_api_health.ipynb). Not yet Applied: the project is 2 of 12 parts, and `axis` on 2-D arrays is still untried |
| Pandas | Applied | Current-course evidence: [Pandas fundamentals](AI_ML_Series/02_data_toolkit_apps/02_pandas/example_01.ipynb) and the [working toolkit](AI_ML_Series/02_data_toolkit_apps/02_pandas/example_02.ipynb) — learner-written calls across `loc`/`iloc`, index reassignment, `query`, missing values, duplicates, `astype`, `get_dummies`, `rank`, `groupby`, `pivot_table`, `.dt`, and `.str`, with a [topic README](AI_ML_Series/02_data_toolkit_apps/02_pandas/README.md). Prior evidence: grouped analysis in the [pizza lab](Foundations_Archive/irisData_Exploration/panda/pizza_panda.ipynb) and the [employee attrition project](Foundations_Archive/ML/project/Employee_Attrition_Pipeline.ipynb) |
| Matplotlib and Seaborn | Applied | Current-course evidence: [Matplotlib chart-type fundamentals](AI_ML_Series/02_data_toolkit_apps/03_matplotlib/example_01.ipynb) and [Seaborn statistical plotting](AI_ML_Series/02_data_toolkit_apps/04_seaborn/example_01.ipynb). Prior evidence: [Pizza dashboard](Foundations_Archive/irisData_Exploration/seaborn/pizza_seaborn.ipynb), [Iris dashboard](Foundations_Archive/irisData_Exploration/iris/iris_exploartion_dashboard.ipynb), and regression diagnostic charts in [simple linear regression](Foundations_Archive/ML/26_Simple_Linear_Regression.ipynb) |
| Plotly | Comfortable | [Plotly chart tour](AI_ML_Series/02_data_toolkit_apps/06_plotly/example_01.ipynb) — learner-written calls across line, scatter, bar, box, violin, pie, area, 3D scatter, and sunburst, with [topic README](AI_ML_Series/02_data_toolkit_apps/06_plotly/README.md) and a [3D projection deep dive](AI_ML_Series/02_data_toolkit_apps/06_plotly/concept_3d_projection.md) |
| Streamlit | Beginner | Learner-written [Sales Analysis app](AI_ML_Series/02_data_toolkit_apps/07_streamlit/sales_analysis.py) — sidebar inputs, conditional rendering, a generated DataFrame, and charts across matplotlib, seaborn, and plotly. Layout and wiring are sound; the [review](AI_ML_Series/02_data_toolkit_apps/07_streamlit/sales_analysis_explained.md) records two open defects in the re-run/session-state model, so this is not yet Comfortable |
| Exploratory data analysis | Applied | Multi-step exploration in the [Iris notebooks](Foundations_Archive/irisData_Exploration/iris/iris_exploration.ipynb) and the [employee attrition project](Foundations_Archive/ML/project/Employee_Attrition_Pipeline.ipynb) |
| Data collection concepts | Beginner | Source-specific failure modes and a confirmed reasoning check in the [Riverstone data-collection case](Foundations_Archive/phase_3_classical_ml/01_data_collection/01_data_collection.md) |
| Missing data, cleaning, and duplicates | Applied | Focused [cleaning practice](Foundations_Archive/ML/05_Data_Cleaning_Practice.ipynb), [imputation practice](Foundations_Archive/ML/08_Finding_Missing_Values_Scikit_Learning.ipynb), and integrated use in the [employee attrition project](Foundations_Archive/ML/project/Employee_Attrition_Pipeline.ipynb) |
| Outlier detection and handling | Applied | [IQR removal](Foundations_Archive/ML/13_Outlier_Removal_IQR.ipynb), [Z-score removal](Foundations_Archive/ML/14_Outlier_Removal_Z_Score.ipynb), robust MAD in the [API health project](AI_ML_Series/02_data_toolkit_apps/01_numpy/project_01_api_health.ipynb), and project integration |
| Categorical encoding | Applied | [One-hot](Foundations_Archive/ML/09_one_hot_encoding.ipynb), [label](Foundations_Archive/ML/10_Label_Encoding.ipynb), and [ordinal](Foundations_Archive/ML/11_Ordinal_Encoding.ipynb) labs plus the attrition project |
| Scaling and feature transforms | Applied | [Standard scaling](Foundations_Archive/ML/15_Feature_Scaling.ipynb), [min-max normalization](Foundations_Archive/ML/16_Feature_Scaling_Normalization.ipynb), [function transforms](Foundations_Archive/ML/19_Function_Transformer.ipynb), and the attrition project |
| Feature selection | Comfortable | [Forward/backward selection](Foundations_Archive/ML/20_Feature_Selection_techniques.ipynb), [VarianceThreshold](Foundations_Archive/ML/21_Feature_Selection_VarianceThreshold.ipynb), and a second [wrapper-method practice lab](Foundations_Archive/ML/22_Forward_Backward_Practice.ipynb) |

## Mathematics and Statistics

| Skill | Level | Evidence |
|---|---|---|
| Algebra and function intuition | Beginner | Worked substitutions and equations in [variables and expressions](Foundations_Archive/math_for_ml/phase_1_algebra/01_variables_expressions.md); later practice remains incomplete |
| Linear algebra | Beginner | Vectors, matrices, shapes, dot products, multiplication, and transpose in the [linear algebra notes](Foundations_Archive/math_for_ml/phase_3_linear_algebra/linear_algebra_notes.md) and [Iris example](Foundations_Archive/math_for_ml/phase_3_linear_algebra/practical_example.md) |
| Descriptive statistics | Comfortable | Executed work on [variability](Foundations_Archive/DataScience_Y/02_MeasureMent_Of_Variability.ipynb), [standard deviation](Foundations_Archive/DataScience_Y/03_standard_deviation.ipynb), [IQR](Foundations_Archive/DataScience_Y/04_IQR.ipynb), [skewness](Foundations_Archive/DataScience_Y/05_skewness.ipynb), and [correlation](Foundations_Archive/DataScience_Y/06_co-relation.ipynb) |
| Probability, distributions, and CLT | Beginner | [Probability notes](Foundations_Archive/math_for_ml/phase_2_statistics/03_probability_basics.md), [normal-distribution notes](Foundations_Archive/math_for_ml/phase_2_statistics/04_normal_distribution.md), and a [CLT simulation](Foundations_Archive/DataScience_Y/07_Central_Limit_Theorem.ipynb) |
| Hypothesis testing | Comfortable | Manual and SciPy-backed [Z-test](Foundations_Archive/DataScience_Y/11_Hypothesis_Testing_Z-Test.ipynb), [paired T-test](Foundations_Archive/DataScience_Y/14_Hypothesis_Testing_T-Test_Paired.ipynb), and [chi-square independence test](Foundations_Archive/DataScience_Y/16_Hypothesis_Testing_Chi_Square_Test.ipynb); one paired-test distinction needs review |
| Calculus and derivatives | Beginner | [Slope and derivative notes](Foundations_Archive/math_for_ml/phase_4_calculus/01_02_slope_and_derivative.md) and a [first-principles derivative exercise](Foundations_Archive/math_for_ml/phase_5_linear_regression/practice_exercises/10_connecting_formal_derivative_to_ml_formula.md) |
| Gradient descent | Comfortable | Manual worked iterations in the [practice exercises](Foundations_Archive/math_for_ml/phase_5_linear_regression/practice_exercises/07_second_iteration_w330_to_w331.md) and a from-scratch implementation checked against scikit-learn in the [MSE and gradient-descent lab](Foundations_Archive/ML/30_Cost_Function_MSE_GradientDescent.ipynb) |

## Machine Learning

| Skill | Level | Evidence |
|---|---|---|
| Train/test supervised workflow | Comfortable | Stratified splitting, fitting, prediction, and held-out scoring in the [simple classifier lab](Foundations_Archive/ML/23_Simple_Dataset_Practice.ipynb) and [feature-selection lab](Foundations_Archive/ML/20_Feature_Selection_techniques.ipynb) |
| Linear, multiple, and polynomial regression | Comfortable | Executed [simple](Foundations_Archive/ML/26_Simple_Linear_Regression.ipynb), [multiple](Foundations_Archive/ML/27_Multiple_Linear_Regression.ipynb), and [polynomial](Foundations_Archive/ML/28_Polynomial_Regression.ipynb) regression labs, plus from-scratch linear gradient descent |
| Decision-tree classification | Beginner | A one-split tree in the [simple classifier lab](Foundations_Archive/ML/23_Simple_Dataset_Practice.ipynb) and tree-based feature-selection exercises on diabetes data |
| MSE, MAE, and R-squared | Comfortable | From-scratch MSE/MAE and outlier sensitivity in the [cost-function lab](Foundations_Archive/ML/30_Cost_Function_MSE_GradientDescent.ipynb), plus held-out R-squared in the regression labs |
| RMSE | Beginner | Conceptual [RMSE note](Foundations_Archive/ML/32_Root_Mean_Squared_Error.MD); the intended [practical comparison notebook](Foundations_Archive/ML/33_Cost_Functions_MAE_MSE_RMSE_Practical.ipynb) does not yet implement RMSE |
| Classification accuracy | Beginner | Calculated on held-out data in the [simple classifier lab](Foundations_Archive/ML/23_Simple_Dataset_Practice.ipynb) and feature-selection labs |
| Precision, recall, F1, and confusion matrix | Not Started | No implementation found in the audited learning folders |
| Overfitting, validation, and cross-validation | Beginner | Train/test degree comparison in [polynomial regression](Foundations_Archive/ML/28_Polynomial_Regression.ipynb) and five-fold CV inside sequential feature selection |
| scikit-learn Pipeline and ColumnTransformer | Not Started | The attrition project is a manual sequence and fits transforms before a train/test split |
| Hyperparameter tuning | Not Started | No grid, random, or Bayesian search implementation found |
| Other classification algorithms | Not Started | No logistic regression, KNN, SVM, Naive Bayes, or random-forest implementation found |
| Clustering, PCA, and other unsupervised learning | Not Started | No algorithm implementation found; dataset filenames alone are not evidence |

## Deep Learning and AI Engineering

| Skill | Level | Evidence |
|---|---|---|
| Neural networks and deep learning | Not Started | No implementation found in the audited learning folders |
| NLP and transformers | Not Started | No implementation found in the audited learning folders |
| Generative AI and LLMs | Not Started | No implementation found in the audited learning folders |
| Embeddings, vector databases, and RAG | Not Started | No implementation found in the audited learning folders |
| AI agents, tool calling, and MCP | Not Started | No implementation found in the audited learning folders |
| MLOps, model serving, monitoring, and deployment | Not Started | No implementation found in the audited learning folders |

## Audit Note — 2026-08-13

The audit covered `AI_ML_Series/` and `Foundations_Archive/`, excluding
notebook checkpoints: **62 notebooks**, **939 non-empty code cells**, and
**923 cells with saved execution counts (98.3%)**. The four saved error
outputs are deliberate teaching demonstrations of invalid indexing, unsupported
append/list operations, and not unexplained notebook failures.

This audit inspected saved source, execution metadata, and outputs; it did not
re-run every archived notebook. Some archived files have stale local paths, so
saved output is evidence of prior work, not a guarantee that every file runs
unchanged today. Genuine gaps are kept in
[`docs/review-queue.md`](docs/review-queue.md).
