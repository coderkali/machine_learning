"use strict";

const evidence = (path, purpose) => ({ path, purpose });
const topic = (id, title, status, summary, learned, files, related = []) => ({
  id,
  title,
  status,
  summary,
  learned,
  files: files.map((file) => typeof file === "string" ? evidence(file, "Learning source") : file),
  related,
});

window.LEARNING_TREE = {
  meta: {
    title: "Learning As Of Now",
    lastUpdated: "2026-09-07",
    notebooksScanned: 95,
    activeFilesScanned: 96,
    archiveFilesScanned: 160,
    datasetsScanned: 28,
  },
  branches: [
    {
      id: "python",
      title: "Python Foundations",
      color: "#247354",
      summary: "Language building blocks used by every later notebook",
      topics: [
        topic(
          "python-values",
          "Variables, values, and valid names",
          "learned",
          "Python names point to values, and naming rules determine which assignments are valid.",
          ["Assignment with = and notebook display rules", "Case-sensitive and valid variable names", "Reading TypeError and SyntaxError as feedback"],
          [
            evidence("AI_ML_Series/01_engineering_python/01_python/session_01_variables_data_types_numbers_strings/README.md", "Cell-by-cell explanation and common mistakes"),
            evidence("AI_ML_Series/01_engineering_python/01_python/session_01_variables_data_types_numbers_strings/variables_data_types_numbers_strings.ipynb", "Executed variables and naming exercises"),
          ],
          ["python-types", "numpy-arrays"]
        ),
        topic(
          "python-types",
          "Built-in data types and conversion",
          "learned",
          "Integers, floats, strings, booleans, complex numbers, lists, sets, tuples, dictionaries, and None each support different operations.",
          ["Inspecting runtime types with type()", "Converting with int(), float(), str(), and complex()", "Why text and numbers cannot be added accidentally"],
          [
            evidence("AI_ML_Series/01_engineering_python/01_python/session_01_variables_data_types_numbers_strings/README.md", "Type table, conversions, and edge cases"),
            evidence("AI_ML_Series/01_engineering_python/01_python/session_01_variables_data_types_numbers_strings/variables_data_types_numbers_strings.ipynb", "Executed type and conversion practice"),
          ],
          ["python-strings", "pandas-dtypes"]
        ),
        topic(
          "python-strings",
          "Numbers, strings, input, and formatted output",
          "learned",
          "The first active session combines numeric calculations with string indexing, methods, user input, and f-string output.",
          ["Scientific notation and complex-number literals", "Zero-based indexing, len(), upper(), title(), and replace()", "input() returns text; convert before arithmetic", "Building a student-fee report with a discount"],
          [
            evidence("AI_ML_Series/01_engineering_python/01_python/session_01_variables_data_types_numbers_strings/README.md", "Numbers, strings, and mini-program walkthrough"),
            evidence("AI_ML_Series/01_engineering_python/01_python/session_01_variables_data_types_numbers_strings/variables_data_types_numbers_strings.ipynb", "Runnable student-fee exercise"),
          ],
          ["python-values", "pandas-accessors"]
        ),
      ],
    },

    {
      id: "math",
      title: "Math & Statistics Foundations",
      color: "#6a5898",
      summary: "Algebra, statistics, linear algebra, and calculus connected to ML",
      topics: [
        topic(
          "algebra-expressions",
          "Variables, expressions, and substitution",
          "prior",
          "Algebra notes use business stories to turn changing quantities into expressions and solve for unknowns.",
          ["Variables versus fixed values", "Substitution and rearranging equations", "Connecting y = wx + b to ML formulas"],
          [
            evidence("Foundations_Archive/math_for_ml/phase_1_algebra/01_variables_expressions.md", "Worked algebra notes and practice"),
            evidence("Foundations_Archive/math_for_ml/phase_1_algebra/00_examples_library.md", "Chai stall, food budget, and theatre examples"),
          ],
          ["functions-graphs", "linear-regression"]
        ),
        topic(
          "functions-graphs",
          "Functions and linear vs nonlinear graphs",
          "prior",
          "A function maps an input to an output; its graph reveals whether the relationship follows a constant rate or bends.",
          ["Input-output thinking", "Constant slope in linear relationships", "Recognizing curved nonlinear patterns"],
          [
            evidence("Foundations_Archive/math_for_ml/phase_1_algebra/01_variables_expressions.md", "Functions and graph interpretation"),
            evidence("Foundations_Archive/math_for_ml/phase_1_algebra/linear_vs_nonlinear_charts.html", "Visual comparison of line and curve"),
          ],
          ["algebra-expressions", "polynomial-regression"]
        ),
        topic(
          "central-tendency",
          "Mean, median, and mode",
          "prior",
          "Three measures of center answer different questions and react differently to unusual values.",
          ["Mean as total divided by count", "Median as the middle after sorting", "Mode as the most frequent value", "Choosing a statistic for imputation"],
          [
            evidence("Foundations_Archive/math_for_ml/phase_2_statistics/01_mean_median_mode.md", "Formulas, examples, and ML uses"),
            evidence("Foundations_Archive/math_for_ml/phase_2_statistics/practise_question_set.md", "Worked comparison exercises"),
          ],
          ["spread-shape", "missing-values"]
        ),
        topic(
          "spread-shape",
          "Variance, standard deviation, IQR, and skewness",
          "prior",
          "Spread and shape describe how far observations sit from the center and whether a distribution has a long tail.",
          ["Variance as average squared distance", "Standard deviation in original units", "IQR as the middle fifty percent", "Reading positive and negative skew"],
          [
            evidence("Foundations_Archive/math_for_ml/phase_2_statistics/02_variance_std.md", "Variance and standard-deviation notes"),
            evidence("Foundations_Archive/DataScience_Y/02_MeasureMent_Of_Variability.ipynb", "Variability calculations"),
            evidence("Foundations_Archive/DataScience_Y/03_standard_deviation.ipynb", "Standard-deviation practice"),
            evidence("Foundations_Archive/DataScience_Y/04_IQR.ipynb", "IQR and boxplot practice"),
            evidence("Foundations_Archive/DataScience_Y/05_skewness.ipynb", "Distribution-skew exercises"),
          ],
          ["central-tendency", "outlier-iqr-zscore"]
        ),
        topic(
          "probability",
          "Probability and conditional probability",
          "prior",
          "Probability measures uncertainty, while conditional probability updates that measure when another event is known.",
          ["Favorable outcomes over total outcomes", "Total-probability reasoning", "Conditional probability", "Spam and diagnosis examples"],
          [evidence("Foundations_Archive/math_for_ml/phase_2_statistics/03_probability_basics.md", "Probability rules, examples, and ML connection")],
          ["normal-zscore", "naive-bayes"]
        ),
        topic(
          "normal-zscore",
          "Normal distribution, 68–95–99.7 rule, and Z-score",
          "prior",
          "The bell curve provides a reference shape, and a Z-score expresses a value as standard deviations from the mean.",
          ["Symmetry and the empirical rule", "z = (x − mean) / standard deviation", "Outlier thresholds and reverse calculation", "Connection to StandardScaler"],
          [evidence("Foundations_Archive/math_for_ml/phase_2_statistics/04_normal_distribution.md", "Bell curve, Z-score, and worked fraud/cricket examples")],
          ["spread-shape", "standard-scaling"]
        ),
        topic(
          "correlation",
          "Correlation and multicollinearity",
          "prior",
          "Pearson correlation describes the direction and strength of a linear relationship without proving causation.",
          ["Positive, negative, and near-zero correlation", "Interpreting r from −1 to +1", "Using correlation for feature review", "Why highly related inputs can move regression coefficients"],
          [
            evidence("Foundations_Archive/math_for_ml/phase_2_statistics/05_correlation.md", "Pearson formula and full calculation"),
            evidence("Foundations_Archive/DataScience_Y/06_co-relation.ipynb", "Correlation notebook practice"),
          ],
          ["multiple-regression", "eda-widths"]
        ),
        topic(
          "sampling-clt",
          "Sampling and the Central Limit Theorem",
          "prior",
          "Repeated sample means tend toward a normal distribution, which supports many inferential methods.",
          ["Population versus sample", "Sampling distributions", "Why sample means stabilize"],
          [evidence("Foundations_Archive/DataScience_Y/07_Central_Limit_Theorem.ipynb", "Simulation-based CLT practice")],
          ["hypothesis-testing", "cross-validation"]
        ),
        topic(
          "hypothesis-testing",
          "Hypotheses, significance, confidence, and decision rules",
          "prior",
          "Hypothesis testing compares observed evidence with a null assumption using a statistic and a chosen significance level.",
          ["Null and alternative hypotheses", "One-tailed versus two-tailed questions", "Alpha, confidence, critical values, and p-values", "Rejecting versus failing to reject"],
          [
            evidence("Foundations_Archive/DataScience_Y/08_Hypothesis_Testing.ipynb", "Hypothesis-testing foundations"),
            evidence("Foundations_Archive/DataScience_Y/08_Hypothesis_Testing_1.ipynb", "Two-sample Z-test example"),
          ],
          ["z-t-tests", "chi-square"]
        ),
        topic(
          "z-t-tests",
          "Z-tests, T-tests, paired tests, and confidence levels",
          "prior",
          "The notebooks compare Z and T distributions and work through one-sample, two-sample, and paired decisions.",
          ["When population standard deviation is known", "Degrees of freedom and heavier T tails", "One-sample and two-sample calculations", "Paired before/after testing", "Comparing 95% and 80% confidence"],
          [
            evidence("Foundations_Archive/DataScience_Y/Z-Test vs T-Test.md", "Decision guide and formulas"),
            evidence("Foundations_Archive/DataScience_Y/09_Hypothesis_Testing_T-Test.ipynb", "One-tailed T-test"),
            evidence("Foundations_Archive/DataScience_Y/10_Hypothesis_Testing_T-Test.ipynb", "Two-sample T-test"),
            evidence("Foundations_Archive/DataScience_Y/11_Hypothesis_Testing_Z-Test.ipynb", "Two-tailed Z-test"),
            evidence("Foundations_Archive/DataScience_Y/12_Hypothesis_Testing_T-Test_95.ipynb", "One-sample T-test at 95% confidence"),
            evidence("Foundations_Archive/DataScience_Y/13_Hypothesis_Testing_T-Test_80.ipynb", "One-sample T-test at 80% confidence"),
            evidence("Foundations_Archive/DataScience_Y/14_Hypothesis_Testing_T-Test_Paired.ipynb", "Paired T-test"),
          ],
          ["hypothesis-testing", "chi-square"]
        ),
        topic(
          "chi-square",
          "Chi-square goodness-of-fit and independence",
          "prior",
          "Chi-square compares observed and expected category counts either to a target distribution or across two categorical variables.",
          ["Observed versus expected frequencies", "Degrees of freedom", "Goodness-of-fit", "Contingency tables and independence"],
          [
            evidence("Foundations_Archive/DataScience_Y/15_Hypothesis_Testing_Chi_Square_Test.ipynb", "Goodness-of-fit example"),
            evidence("Foundations_Archive/DataScience_Y/16_Hypothesis_Testing_Chi_Square_Test.ipynb", "Independence test and visualizations"),
          ],
          ["hypothesis-testing", "categorical-encoding"]
        ),
        topic(
          "linear-algebra",
          "Scalars, vectors, matrices, shapes, dot products, and transpose",
          "prior",
          "Linear algebra notes connect one value, one feature row, and a full dataset to the calculations used by ML models.",
          ["Scalar, vector, and matrix representations", "Shape compatibility", "Dot product as weighted sum", "Matrix multiplication across rows", "Transpose for aligning dimensions"],
          [
            evidence("Foundations_Archive/math_for_ml/phase_3_linear_algebra/linear_algebra_notes.md", "Seven-topic linear algebra notes"),
            evidence("Foundations_Archive/math_for_ml/phase_3_linear_algebra/practical_example.md", "All topics combined on Iris"),
            evidence("Foundations_Archive/math_for_ml/phase_3_linear_algebra/faq.md", "Common shape and multiplication questions"),
            evidence("Foundations_Archive/math_for_ml/phase_3_linear_algebra/linear_algebra_cheat_sheet.svg", "Visual cheat sheet"),
          ],
          ["numpy-linear-algebra", "multiple-regression"]
        ),
        topic(
          "calculus-gradient",
          "Slope, derivatives, and gradient descent",
          "prior",
          "Calculus notes move from a constant slope to a local derivative, then use that direction to reduce model error step by step.",
          ["Slope as rise over run", "Derivative as local rate of change", "Convergence by shrinking the gap", "Learning rate and repeated gradient updates"],
          [
            evidence("Foundations_Archive/math_for_ml/phase_4_calculus/01_02_slope_and_derivative.md", "Combined slope and derivative lesson"),
            evidence("Foundations_Archive/math_for_ml/phase_4_calculus/02_derivative_new.md", "Step-by-step derivative intuition"),
            evidence("Foundations_Archive/math_for_ml/phase_4_calculus/03_gradient_descent.md", "Gradient descent and learning rate"),
          ],
          ["gradient-descent", "linear-regression"]
        ),
      ],
    },

    {
      id: "numpy",
      title: "NumPy",
      color: "#3874a0",
      summary: "Typed arrays, vectorized computation, and numerical building blocks",
      topics: [
        topic(
          "numpy-arrays",
          "Arrays, dimensions, shapes, dtypes, and reshape",
          "learned",
          "An ndarray is a homogeneous, shaped block of values; dimensions and dtype determine how calculations behave.",
          ["Creating 0-D through multi-dimensional arrays", "Reading ndim, shape, and dtype", "Reshaping without changing item count", "How one string can upcast a numeric array"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/01_numpy/example_01.ipynb", "Array construction and anatomy"),
            evidence("AI_ML_Series/02_data_toolkit_apps/01_numpy/example_02.ipynb", "Shape, reshape, and dtype"),
            evidence("AI_ML_Series/02_data_toolkit_apps/01_numpy/README.md", "Coverage map and verified gotchas"),
          ],
          ["python-types", "numpy-indexing"]
        ),
        topic(
          "numpy-indexing",
          "Indexing, slicing, masks, searching, and sorting",
          "learned",
          "NumPy selects individual values, ranges, rows, columns, and condition-matching values without converting them to Python loops.",
          ["Positive and negative indexes", "Row/column slicing", "Boolean masks and np.where", "sort, argsort, and searchsorted", "Insert, delete, append, flip, stack, and split"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/01_numpy/example_01.ipynb", "Indexing, slicing, searching, and mutation"),
            evidence("AI_ML_Series/02_data_toolkit_apps/01_numpy/example_02.ipynb", "Masks, sorting, stacking, and splitting"),
          ],
          ["numpy-arrays", "pandas-selection"]
        ),
        topic(
          "numpy-vectorization",
          "Vectorization, element-wise math, and broadcasting",
          "learned",
          "Whole-array operations replace row-by-row loops, while broadcasting safely stretches compatible shapes.",
          ["Element-wise arithmetic", "Broadcast shape rules", "Difference between * and @", "Array builders, arange, linspace, and random generators"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/01_numpy/example_02.ipynb", "Operations and broadcasting experiments"),
            evidence("Foundations_Archive/irisData_Exploration/numpy/pizza_numpy.ipynb", "Archived pizza-array practice"),
          ],
          ["numpy-arrays", "numpy-linear-algebra"]
        ),
        topic(
          "numpy-statistics",
          "Array statistics and data summaries",
          "learned",
          "Array reductions turn many values into useful summaries along a selected axis.",
          ["Sum, mean, median, min, max, variance, and standard deviation", "Axis-aware calculations", "Population versus sample standard deviation"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/01_numpy/example_02.ipynb", "Statistical reductions and axis behavior"),
            evidence("Foundations_Archive/NumPy/example_02.py", "Earlier NumPy operations practice"),
          ],
          ["central-tendency", "pandas-aggregation"]
        ),
        topic(
          "numpy-linear-algebra",
          "NumPy linear algebra",
          "learned",
          "The numerical notebook applies dot products, matrix multiplication, and np.linalg operations to shaped arrays.",
          ["Dot product and matrix product", "Solving linear systems", "Determinant, inverse, eigenvalues, and eigenvectors", "Reading eigenvectors by column"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/01_numpy/example_02.ipynb", "Executed np.linalg and matrix examples"),
            evidence("Foundations_Archive/NumPy/example_01.py", "Earlier array foundations"),
          ],
          ["linear-algebra", "multiple-regression"]
        ),
        topic(
          "numpy-api-project",
          "OrderHub API Health Monitor",
          "growing",
          "An in-progress pure-NumPy project analyzes service latency and 5xx errors across six services and seven days.",
          ["Loading and inspecting a 6 × 7 service matrix", "Median and MAD outlier detection", "Parts 1–2 complete in a planned 12-part exercise"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/01_numpy/project_01_api_health.ipynb", "In-progress applied NumPy notebook"),
            evidence("AI_ML_Series/02_data_toolkit_apps/01_numpy/README.md", "Project boundary and progress record"),
          ],
          ["numpy-statistics", "anomaly-workflow"]
        ),
      ],
    },

    {
      id: "pandas",
      title: "Pandas & Data Wrangling",
      color: "#a65d2c",
      summary: "Labeled tables, selection, cleaning, joining, and aggregation",
      topics: [
        topic(
          "pandas-frames",
          "Series, DataFrames, indexes, and table anatomy",
          "learned",
          "A Series is one labeled column; a DataFrame aligns multiple Series into a table with row and column labels.",
          ["Series versus DataFrame", "Shape, columns, index, info(), and describe()", "Attribute versus method", "Reading real CSV data"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/02_pandas/example_01.ipynb", "First DataFrame operations"),
            evidence("AI_ML_Series/02_data_toolkit_apps/02_pandas/example_02.ipynb", "Working toolkit and inspection"),
            evidence("AI_ML_Series/02_data_toolkit_apps/02_pandas/README.md", "Topic map and gotchas"),
          ],
          ["pandas-selection", "numpy-arrays"]
        ),
        topic(
          "pandas-io",
          "Reading and writing tabular files",
          "learned",
          "Pandas moves tabular data between DataFrames and files while preserving deliberate choices about columns and indexes.",
          ["read_csv and repository-relative paths", "CSV, Excel, and JSON workflow examples", "to_csv and index=False", "Avoiding unwanted Unnamed index columns"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/02_pandas/example_01.ipynb", "Reading a real file"),
            evidence("AI_ML_Series/02_data_toolkit_apps/02_pandas/example_02.ipynb", "I/O examples and two recorded environment issues"),
          ],
          ["pandas-frames", "data-collection"]
        ),
        topic(
          "pandas-selection",
          "Column selection, loc, iloc, query, and filtering",
          "learned",
          "Label-based and position-based selection answer different questions, especially after filtering changes the index.",
          ["Selecting one versus many columns", "Boolean row filters", "loc labels versus iloc positions", "query() and reset_index()"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/02_pandas/example_01.ipynb", "Selection and filtering basics"),
            evidence("AI_ML_Series/02_data_toolkit_apps/02_pandas/example_02.ipynb", "loc, iloc, query, and index traps"),
          ],
          ["pandas-frames", "eda-widths"]
        ),
        topic(
          "pandas-dtypes",
          "Missing values, duplicates, replacement, and dtypes",
          "learned",
          "Cleaning preserves intended meaning by locating missing values, removing duplicates, replacing inconsistent values, and converting types explicitly.",
          ["isna/isnull and fillna", "drop_duplicates and near-duplicate checks", "replace and astype", "Why NaN can promote integers to floats", "Return-a-copy and inplace behavior"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/02_pandas/example_02.ipynb", "Cleaning and type conversion"),
            evidence("Foundations_Archive/ML/17_Handling_Duploicate_Data.ipynb", "Duplicate handling"),
            evidence("Foundations_Archive/ML/18_Replace_Change_Data_Type.ipynb", "Replace and dtype correction"),
          ],
          ["missing-values", "duplicate-dtype"]
        ),
        topic(
          "pandas-combine",
          "Concat, merge, and table combination",
          "learned",
          "Tables can be stacked by rows or matched by keys, and the choice controls which records survive.",
          ["concat as the append replacement", "merge keys and join behavior", "Keeping indexes deliberate when combining"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/02_pandas/example_01.ipynb", "Concat and merge examples"),
            evidence("AI_ML_Series/02_data_toolkit_apps/02_pandas/example_02.ipynb", "Working data-combination examples"),
          ],
          ["pandas-frames", "pandas-aggregation"]
        ),
        topic(
          "pandas-aggregation",
          "Sorting, ranking, groupby, and pivot tables",
          "learned",
          "Aggregation converts row-level records into group summaries for analysis and reporting.",
          ["sort_values and rank", "groupby with aggregate functions", "pivot_table across categories", "Understanding the grouping key and measured value"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/02_pandas/example_02.ipynb", "Sorting, ranking, grouping, and pivots"),
            evidence("Foundations_Archive/irisData_Exploration/panda/pizza_panda.ipynb", "Pizza-order aggregation practice"),
          ],
          ["pandas-combine", "streamlit-sales"]
        ),
        topic(
          "pandas-accessors",
          "Datetime and string accessors",
          "learned",
          "The .dt and .str namespaces expose vectorized operations for date and text columns.",
          ["Parsing dates before using .dt", "Extracting date components", "Vectorized string cleaning and matching", "Why accessors belong to compatible dtypes"],
          [evidence("AI_ML_Series/02_data_toolkit_apps/02_pandas/example_02.ipynb", "Datetime and string accessor examples")],
          ["python-strings", "feature-engineering"]
        ),
      ],
    },

    {
      id: "visualization",
      title: "Visualization & Exploratory Analysis",
      color: "#a26a23",
      summary: "Static, statistical, interactive, and multidimensional views",
      topics: [
        topic(
          "matplotlib",
          "Matplotlib chart grammar",
          "learned",
          "Matplotlib builds charts from explicit x/y data and styling choices, making the drawing steps visible.",
          ["Line, scatter, bar, histogram, pie, and fill plots", "Markers, line styles, colors, labels, annotations, and legends", "Subplots and savefig"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/03_matplotlib/example_01.ipynb", "Executed chart fundamentals"),
            evidence("AI_ML_Series/02_data_toolkit_apps/03_matplotlib/README.md", "Chart coverage summary"),
            evidence("Foundations_Archive/Matplotlib/example_01.py", "Earlier plotting practice"),
          ],
          ["seaborn", "plotly"]
        ),
        topic(
          "seaborn",
          "Seaborn statistical visualization",
          "learned",
          "Seaborn maps DataFrame columns to visual roles and adds statistical defaults on top of Matplotlib.",
          ["Long-form data", "Axes-level versus figure-level functions", "Relational, distribution, categorical, and regression plots", "hue, size, style, facets, grids, and themes"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/04_seaborn/example_01.ipynb", "Full statistical-plot tour"),
            evidence("AI_ML_Series/02_data_toolkit_apps/04_seaborn/README.md", "Mental model and version notes"),
            evidence("Foundations_Archive/seaborn/example_01.py", "Earlier Seaborn practice"),
          ],
          ["matplotlib", "eda-widths"]
        ),
        topic(
          "plotly",
          "Plotly interactive charts",
          "learned",
          "Plotly renders interactive browser charts and maps columns to position, color, size, hover, and hierarchy.",
          ["Plotly Express versus graph objects", "Line, scatter, bar, box, violin, pie, and area charts", "3D scatter and sunburst", "Hover data and category ordering"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/06_plotly/example_01.ipynb", "Interactive chart examples"),
            evidence("AI_ML_Series/02_data_toolkit_apps/06_plotly/README.md", "Patterns and common mistakes"),
          ],
          ["matplotlib", "projection-3d"]
        ),
        topic(
          "projection-3d",
          "3D projection and visual information loss",
          "learned",
          "A 3D chart still becomes a 2D screen image through model, view, and projection transforms, so some spatial truth is lost.",
          ["Model, view, and projection matrices", "Axis normalization", "Why screen distance is not original data distance", "Working through real Iris coordinates"],
          [evidence("AI_ML_Series/02_data_toolkit_apps/06_plotly/concept_3d_projection.md", "Mathematical deep dive into 3D projection")],
          ["plotly", "svc-kernels"]
        ),
        topic(
          "eda-widths",
          "Univariate, bivariate, and multivariate EDA",
          "learned",
          "Exploratory analysis changes with the number of variables being viewed together.",
          ["One-feature strip views", "Two-feature scatter plots", "Pair plots across all feature pairs", "Using color and markers for class labels", "Visual feature-signal decisions on Iris"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/04_uni_boi_multi_variate_analaysis.ipynb", "In-depth Iris EDA"),
            evidence("AI_ML_Series/02_data_toolkit_apps/05_iris_visual_explorer/iris_dataset_explained.ipynb", "Iris contents and visual analysis"),
          ],
          ["pandas-selection", "iris-project"]
        ),
        topic(
          "iris-visuals",
          "Iris visual exploration",
          "prior",
          "The archive contains repeated Iris inspections, boxplots, pair plots, and dashboard experiments that show the dataset from several angles.",
          ["Species balance and measurement ranges", "Missing-value and outlier checks", "Pairwise separation of species", "Dashboard-style presentation"],
          [
            evidence("Foundations_Archive/irisData_Exploration/iris/iris_exploration.ipynb", "Early Iris inspection"),
            evidence("Foundations_Archive/irisData_Exploration/iris/iris_exploration_3.ipynb", "IQR and boxplot exploration"),
            evidence("Foundations_Archive/irisData_Exploration/iris/iris_exploration_5.ipynb", "Pairplot and scatter analysis"),
            evidence("Foundations_Archive/irisData_Exploration/iris/iris_exploartion_dashboard.ipynb", "Iris dashboard notebook"),
          ],
          ["eda-widths", "iris-project"]
        ),
        topic(
          "pizza-visuals",
          "Pizza plotting and dashboard practice",
          "prior",
          "Pizza-order exercises combine tabular calculations with Matplotlib, Seaborn, and saved dashboard images.",
          ["Order and revenue summaries", "Library-specific plot practice", "Saving and combining dashboard views"],
          [
            evidence("Foundations_Archive/irisData_Exploration/matplotlib/pizza_matplotlib_2.ipynb", "Pizza Matplotlib charts"),
            evidence("Foundations_Archive/irisData_Exploration/seaborn/pizza_seaborn.ipynb", "Pizza Seaborn charts"),
            evidence("Foundations_Archive/irisData_Exploration/dashboard/zip_python.ipynb", "Dashboard assembly practice"),
            evidence("Foundations_Archive/irisData_Exploration/dashboard/pizza_final_dashboard.png", "Saved final dashboard"),
          ],
          ["pandas-aggregation", "streamlit-sales"]
        ),
      ],
    },

    {
      id: "preparation",
      title: "Data Preparation & Feature Engineering",
      color: "#337c82",
      summary: "Turning raw records into honest, model-ready features",
      topics: [
        topic(
          "data-collection",
          "Data collection, sources, and failure modes",
          "prior",
          "Before cleaning begins, data must be gathered with its source, unit, timing, ownership, and failure risks understood.",
          ["Primary versus secondary sources", "Structured and unstructured inputs", "Bias, freshness, missingness, and measurement errors", "Riverstone Bank source decisions"],
          [
            evidence("Foundations_Archive/phase_3_classical_ml/00_strategy.md", "Classical-ML learning strategy"),
            evidence("Foundations_Archive/phase_3_classical_ml/01_data_collection/01_data_collection.md", "Data-collection lesson and case file"),
          ],
          ["pandas-io", "cleaning-strategy"]
        ),
        topic(
          "cleaning-strategy",
          "Data quality and cleaning strategy",
          "prior",
          "Cleaning decisions address missing, duplicate, inconsistent, invalid, and unusual values without erasing useful signal blindly.",
          ["Profiling before changing data", "Documenting each decision", "Column-first and row-level thinking", "Connecting data defects to model behavior"],
          [
            evidence("Foundations_Archive/ML/04_Data_Cleaning.MD", "Cleaning problems and sub-skills"),
            evidence("Foundations_Archive/phase_3_classical_ml/02_data_cleaning/02_data_cleaning.md", "Riverstone data-cleaning case"),
            evidence("Foundations_Archive/ML/05_Data_Cleaning_Practice.ipynb", "Hands-on loan-data cleaning"),
          ],
          ["data-collection", "missing-values"]
        ),
        topic(
          "missing-values",
          "Finding, dropping, and filling missing values",
          "prior",
          "Missingness is measured before choosing whether to drop a column, drop rows, or fill values using domain-aware rules.",
          ["Counts and percentages of missing values", "Heatmaps and bar charts", "Column-first 50% rule", "Mean, median, mode, forward fill, and backward fill", "Why blind dropna can remove too many rows"],
          [
            evidence("Foundations_Archive/ML/05_Data_Cleaning_Practice.ipynb", "Missingness measurement and visualization"),
            evidence("Foundations_Archive/ML/06_Dropping_Missing_Values.ipynb", "Column and row deletion"),
            evidence("Foundations_Archive/ML/06_High_Missing_Column_Practice.ipynb", "High-missing column and indicator alternative"),
            evidence("Foundations_Archive/ML/07_Filling_Missing_Values.ipynb", "Fill strategies"),
            evidence("Foundations_Archive/ML/07b_Ordered_And_Wide_Fill_Practice.ipynb", "Ordered and axis-wise filling"),
          ],
          ["central-tendency", "imputation"]
        ),
        topic(
          "imputation",
          "SimpleImputer and KNNImputer",
          "growing",
          "Scikit-learn imputers learn replacement rules from training data; the newer preprocessing notebook adds nearest-neighbor filling.",
          ["Mean, median, most-frequent, and constant strategies", "Why the column meaning must guide the strategy", "KNN imputation from similar rows", "Fit imputation on training data only"],
          [
            evidence("Foundations_Archive/ML/08_Finding_Missing_Values_Scikit_Learning.ipynb", "SimpleImputer strategies compared"),
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/24_Preprocessing_Concepts.ipynb", "SimpleImputer and KNNImputer lesson in progress"),
          ],
          ["missing-values", "safe-pipelines"]
        ),
        topic(
          "categorical-encoding",
          "One-hot, label, and ordinal encoding",
          "learned",
          "Encoding turns categories into numeric representations without inventing an order where none exists.",
          ["One-hot columns for unordered inputs", "LabelEncoder for target labels", "OrdinalEncoder for genuine rankings", "Unknown-category and output-shape awareness"],
          [
            evidence("Foundations_Archive/ML/09_one_hot_encoding.ipynb", "One-hot encoding practice"),
            evidence("Foundations_Archive/ML/10_Label_Encoding.ipynb", "Label encoding practice"),
            evidence("Foundations_Archive/ML/11_Ordinal_Encoding.ipynb", "Ordinal encoding and comparison"),
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/03_preprocessing.ipynb", "Leakage-safe encoding examples"),
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/24_Preprocessing_Concepts.ipynb", "Expanded encoding lesson"),
          ],
          ["chi-square", "safe-pipelines"]
        ),
        topic(
          "standard-scaling",
          "StandardScaler, MinMaxScaler, and RobustScaler",
          "learned",
          "Three scalers use mean/std, min/max, or median/IQR to place numeric columns on more comparable rulers.",
          ["Standard score formula", "0–1 min-max formula", "Median/IQR robust formula", "Hand-checking library output", "How outliers affect each scaler"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/03_preprocessing.ipynb", "Three scalers checked by hand"),
            evidence("Foundations_Archive/ML/15_Feature_Scaling.ipynb", "Standardization and distance example"),
            evidence("Foundations_Archive/ML/16_Feature_Scaling_Normalization.ipynb", "Min-max normalization comparison"),
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/24_Preprocessing_Concepts.ipynb", "Expanded scaling comparison, outlier demo, and chaining-bug correction"),
          ],
          ["normal-zscore", "normalizer-binarizer"]
        ),
        topic(
          "normalizer-binarizer",
          "Normalizer and Binarizer",
          "learned",
          "Normalizer rescales each row as a vector, while Binarizer discards magnitude and keeps only a threshold decision.",
          ["Row-wise L1/L2 normalization", "Column scaling versus row normalization", "Strict threshold behavior in Binarizer", "When a hard yes/no feature is useful"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/03_preprocessing.ipynb", "Normalizer and Binarizer examples"),
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/24_Preprocessing_Concepts.ipynb", "Expanded intuition and formulas"),
          ],
          ["standard-scaling", "svc-linear"]
        ),
        topic(
          "class-imbalance",
          "Class imbalance and over/under-sampling",
          "growing",
          "A highly uneven target can make accuracy look good while the minority class is ignored; sampling changes the training balance.",
          ["Recognizing majority and minority classes", "RandomOverSampler duplication", "RandomUnderSampler removal", "Why resampling belongs inside the training workflow"],
          [evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/24_Preprocessing_Concepts.ipynb", "New class-imbalance lesson")],
          ["classification-metrics", "safe-pipelines"]
        ),
        topic(
          "outlier-iqr-zscore",
          "Outlier detection and removal with IQR and Z-score",
          "prior",
          "IQR and Z-score methods flag unusual values using different assumptions, so removal must be justified rather than automatic.",
          ["Boxplot fences Q1 − 1.5×IQR and Q3 + 1.5×IQR", "Z-score thresholds", "Before/after distribution checks", "Removal versus capping or robust modeling"],
          [
            evidence("Foundations_Archive/ML/12_Outlier.ipynb", "Detection and impact"),
            evidence("Foundations_Archive/ML/13_Outlier_Removal_IQR.ipynb", "IQR removal"),
            evidence("Foundations_Archive/ML/14_Outlier_Removal_Z_Score.ipynb", "Z-score removal and comparison"),
            evidence("Foundations_Archive/phase_3_classical_ml/02_data_cleaning/images/02_income_outlier_iqr.svg", "Riverstone outlier diagram"),
          ],
          ["spread-shape", "anomaly-workflow"]
        ),
        topic(
          "duplicate-dtype",
          "Duplicates, inconsistent values, and dtype repair",
          "prior",
          "Exact duplicates are removed deliberately, and text-like numeric buckets are normalized before conversion to usable numeric types.",
          ["duplicated and drop_duplicates", "Exact versus near duplicates", "replace before astype", "Copy-on-write awareness"],
          [
            evidence("Foundations_Archive/ML/17_Handling_Duploicate_Data.ipynb", "Duplicate detection and removal"),
            evidence("Foundations_Archive/ML/18_Replace_Change_Data_Type.ipynb", "Value replacement and dtype correction"),
          ],
          ["pandas-dtypes", "cleaning-strategy"]
        ),
        topic(
          "distribution-transform",
          "Log transforms and FunctionTransformer",
          "prior",
          "A log1p transformation compresses a right-skewed tail while FunctionTransformer makes the operation reusable in an ML workflow.",
          ["Right-skewed distributions", "log1p and zero-safe transforms", "Transforming with and without outlier removal", "Shape change versus simple rescaling"],
          [evidence("Foundations_Archive/ML/19_Function_Transformer.ipynb", "FunctionTransformer and distribution experiments")],
          ["outlier-iqr-zscore", "safe-pipelines"]
        ),
        topic(
          "feature-engineering",
          "Feature engineering: interactions, bins, ratios, and dates",
          "growing",
          "New columns can express relationships that are hidden in raw inputs, including pair interactions, ratios, buckets, and date parts.",
          ["Multiplication as an interaction feature", "Division as a ratio feature", "KBinsDiscretizer for buckets", "Extracting year/month/day", "Why engineered columns must be selected explicitly"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/24_Preprocessing_Concepts.ipynb", "Four feature-engineering moves"),
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/23_SVC_3D.ipynb", "Squared and interaction features for SVC"),
          ],
          ["pandas-accessors", "svc-kernels"]
        ),
        topic(
          "feature-selection",
          "Filter, wrapper, embedded, and variance-based feature selection",
          "prior",
          "Feature selection removes unhelpful inputs while measuring whether the reduced model still predicts well.",
          ["Filter, wrapper, and embedded families", "VarianceThreshold for near-constant columns", "Forward selection and backward elimination", "SequentialFeatureSelector with held-out scoring"],
          [
            evidence("Foundations_Archive/ML/20_Feature_Selection_techniques.MD", "Selection-family overview"),
            evidence("Foundations_Archive/ML/20_Feature_Selection_techniques.ipynb", "Forward and backward selection"),
            evidence("Foundations_Archive/ML/21_Feature_Selection_VarianceThreshold.ipynb", "Near-constant feature filtering"),
            evidence("Foundations_Archive/ML/22_Forward_Backward_Practice.ipynb", "Step-by-step wrapper practice"),
          ],
          ["correlation", "hyperparameter-search"]
        ),
        topic(
          "safe-pipelines",
          "Leakage-safe Pipeline and ColumnTransformer",
          "learned",
          "A pipeline fits preprocessing only on training rows, applies identical transformations to test rows, and keeps column-specific steps together.",
          ["Split before learning any statistic", "fit_transform on train and transform on test", "Different transformers for numeric and categorical columns", "Trailing-underscore attributes as learned state"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/03_preprocessing.ipynb", "Measured leakage demo and first pipeline"),
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/README.md", "Estimator and no-leakage mental model"),
            evidence("Foundations_Archive/ML/project/Employee_Attrition_Pipeline.ipynb", "Integrated pipeline with a recorded leakage issue to review"),
          ],
          ["train-test-split", "imputation"]
        ),
      ],
    },

    {
      id: "workflow",
      title: "Machine Learning Workflow",
      color: "#446f7a",
      summary: "Problem framing, data splits, estimator behavior, and test fixtures",
      topics: [
        topic(
          "ml-foundations",
          "What machine learning is and major problem types",
          "prior",
          "The archive introduces learning patterns from data and distinguishes prediction categories used throughout the repository.",
          ["Traditional programming versus learned rules", "Supervised, unsupervised, and reinforcement learning", "Regression versus classification", "Advantages, limitations, and a learning roadmap"],
          [
            evidence("Foundations_Archive/ML/01._LEARNING.MD", "ML introduction and history"),
            evidence("Foundations_Archive/ML/02_ML_Roadmap.MD", "End-to-end ML roadmap"),
          ],
          ["features-labels", "linear-regression"]
        ),
        topic(
          "features-labels",
          "Features, labels, X/y, rows, and shapes",
          "learned",
          "Model inputs live in X and the answer lives in y; keeping their rows aligned and shapes correct is fundamental.",
          ["One row as one observation", "Columns as features", "Target leakage when y enters X", "Series versus two-dimensional feature matrix"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/01_train_test_split_data.ipynb", "X/y selection and return shapes"),
            evidence("Foundations_Archive/ML/23_Simple_Dataset_Practice.ipynb", "Small hand-built classification dataset"),
          ],
          ["train-test-split", "pandas-frames"]
        ),
        topic(
          "train-test-split",
          "Train/test split and reproducibility",
          "learned",
          "Training rows teach the model; held-out test rows measure how well the learned rule transfers to unseen data.",
          ["X_train, X_test, y_train, y_test return order", "test_size and train_size", "shuffle and random_state", "stratify for class balance", "Why ordered time data is different"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/01_train_test_split_data.ipynb", "Parameter-by-parameter split experiments"),
            evidence("Foundations_Archive/ML/23_Simple_Dataset_Practice.ipynb", "Train/test/predict from scratch"),
          ],
          ["features-labels", "safe-pipelines"]
        ),
        topic(
          "estimator-api",
          "The scikit-learn estimator API",
          "learned",
          "Scikit-learn objects share a small interface: fit learns, transform reshapes, and predict answers.",
          ["fit, transform, fit_transform, predict, and score", "Preprocessors versus predictive models", "Learned attributes ending in underscore", "Swapping estimators without rewriting the workflow"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/README.md", "Estimator mental model"),
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/03_preprocessing.ipynb", "Transformer workflow"),
          ],
          ["safe-pipelines", "linear-regression"]
        ),
        topic(
          "synthetic-data",
          "Synthetic datasets for controlled experiments",
          "learned",
          "make_* generators create data with a known structure so one model behavior or parameter can be tested at a time.",
          ["make_regression and its true coefficient", "make_classification informative/redundant/noise columns", "make_blobs for clusters", "make_circles and make_moons for nonlinear boundaries", "noise, separation, weights, centers, and random seeds"],
          [evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/02_make_*_dataset.ipynb", "Five generators and 24 parameter charts")],
          ["train-test-split", "kmeans"]
        ),
      ],
    },

    {
      id: "regression",
      title: "Regression & Optimization",
      color: "#b86a25",
      summary: "Predicting continuous values, controlling coefficients, and measuring error",
      topics: [
        topic(
          "linear-regression",
          "Simple linear regression",
          "learned",
          "A fitted line predicts a number using an intercept plus a slope times one input feature.",
          ["fit, predict, and score", "y-hat = mx + b", "coef_ and intercept_ as the stored model", "Ordinary least squares and the best-fit line", "Rebuilding predict() by hand"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/05_Linear_Regression.ipynb", "In-depth fitted line, source path, and from-scratch checks"),
            evidence("Foundations_Archive/ML/25_Simple_Linear_Regression.MD", "Concept notes and assumptions"),
            evidence("Foundations_Archive/ML/26_Simple_Linear_Regression.ipynb", "CGPA-to-package model and diagnostics"),
            evidence("Foundations_Archive/math_for_ml/phase_5_linear_regression/01_linear_regression_intro.md", "Math-first introduction"),
          ],
          ["coef-intercept", "regression-errors"]
        ),
        topic(
          "coef-intercept",
          "Coefficient and intercept by hand",
          "learned",
          "The worked notebook derives the slope as aligned movement divided by input spread, then walks back to the y-axis for the intercept.",
          ["Centered x and y values", "Numerator and denominator as matched areas", "m = covariance-like movement / x spread", "b = mean(y) − m × mean(x)"],
          [evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/05a_Coef_And_Intercept_By_Hand.ipynb", "Five-row arithmetic and visual derivation")],
          ["linear-regression", "gradient-descent"]
        ),
        topic(
          "multiple-regression",
          "Multiple linear regression and partial effects",
          "learned",
          "With several inputs, one slope becomes one coefficient per column and the fitted line becomes a plane or higher-dimensional surface.",
          ["b0 + X @ coef_", "One coefficient per input column", "Partial effect while other inputs stay fixed", "Residual sticks to a 3D plane", "Multicollinearity and coefficient movement"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/06_multiple_linear_regression.ipynb", "Two-feature model and 3D plane"),
            evidence("Foundations_Archive/ML/27_Multiple_Linear_Regression.ipynb", "Archived multi-predictor practice"),
            evidence("Foundations_Archive/ML/24_Regression_Analysis.MD", "Regression-family map"),
          ],
          ["linear-algebra", "ridge"]
        ),
        topic(
          "polynomial-regression",
          "Polynomial regression and curved relationships",
          "growing",
          "PolynomialFeatures expands x into powers and interactions so a linear estimator can fit a curved relationship.",
          ["Straight-line baseline", "Creating x² and higher-order columns", "Pipeline from PolynomialFeatures to LinearRegression", "Underfitting and overfitting as degree changes"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/10_Polynomial Regression.ipynb", "Current-course polynomial lesson"),
            evidence("Foundations_Archive/ML/28_Polynomial_Regression.ipynb", "Archived curved-model practice"),
          ],
          ["functions-graphs", "svc-kernels"]
        ),
        topic(
          "ridge",
          "Ridge regression (L2)",
          "learned",
          "Ridge adds a squared-coefficient penalty that shrinks slopes without usually making them exactly zero.",
          ["error + alpha × slope²", "alpha as a hyperparameter", "Shrink factor S/(S + alpha)", "Why very large alpha gives the mean-prediction line", "When regularization cannot help"],
          [evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/07_Ridge.ipynb", "Formula, nine-alpha experiment, and verified coefficients")],
          ["multiple-regression", "lasso"]
        ),
        topic(
          "lasso",
          "Lasso regression (L1)",
          "learned",
          "Lasso uses an absolute-coefficient penalty that can drive slopes exactly to zero and therefore act as feature selection.",
          ["L1 penalty and the sharp corner", "Exact-zero coefficients", "Increasing alpha and line flattening", "Difference from Ridge shrinkage"],
          [evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/08_Lasso.ipynb", "Lasso formula and alpha experiments")],
          ["ridge", "elastic-net"]
        ),
        topic(
          "elastic-net",
          "ElasticNet regression",
          "learned",
          "ElasticNet mixes L1 and L2 regularization, using alpha for total strength and l1_ratio for the blend.",
          ["Combined penalty", "alpha versus l1_ratio", "Path from nearly unregularized to a flat line", "Choosing between related-feature stability and sparsity"],
          [evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/09_ElasticNet.ipynb", "ElasticNet formula and tuning sequence")],
          ["ridge", "lasso"]
        ),
        topic(
          "regression-errors",
          "Loss, cost, residuals, and error curves",
          "prior",
          "A residual is one prediction miss; a loss measures one row, while a cost summarizes the model across rows.",
          ["Actual minus predicted residuals", "Why signed errors cannot simply be added", "Cost surface and bowl intuition", "Choosing a model by minimizing total error"],
          [
            evidence("Foundations_Archive/ML/29_Cost_Function.MD", "Cost versus loss and error-family overview"),
            evidence("Foundations_Archive/math_for_ml/phase_5_linear_regression/10_why_we_calculate_errors.md", "Why model errors are calculated"),
            evidence("Foundations_Archive/math_for_ml/phase_5_linear_regression/11_why_we_need_formula.md", "Formula and search motivation"),
          ],
          ["linear-regression", "mse-rmse"]
        ),
        topic(
          "gradient-descent",
          "Gradient descent for a regression line",
          "prior",
          "Gradient descent repeatedly uses the derivative of cost to adjust slope and intercept toward lower error.",
          ["Cost gradient direction", "Learning-rate step size", "Weight and bias updates", "Convergence toward the OLS solution", "Manual iterations on clean and messy examples"],
          [
            evidence("Foundations_Archive/ML/30_Cost_Function_MSE_GradientDescent.ipynb", "From-scratch gradient descent and real cost bowl"),
            evidence("Foundations_Archive/math_for_ml/phase_5_linear_regression/02_cost_function_and_gradient_descent.md", "Math-first connection"),
            evidence("Foundations_Archive/math_for_ml/phase_5_linear_regression/06_messy_data_gradient_descent.md", "Messy-data walkthrough"),
            evidence("Foundations_Archive/math_for_ml/phase_5_linear_regression/practice_exercises/11_meera_electricity_bill_final_solution.md", "Final worked weight-and-bias solution"),
          ],
          ["calculus-gradient", "coef-intercept"]
        ),
        topic(
          "mae",
          "Mean Absolute Error (MAE)",
          "prior",
          "MAE averages absolute misses in the target's original units and weights every error linearly.",
          ["Absolute-value formula", "Readable units", "Robustness relative to squared error", "Median-seeking behavior and the non-smooth corner"],
          [
            evidence("Foundations_Archive/ML/31_Mean_Absolute_Error.MD", "MAE deep dive and worked quiz example"),
            evidence("Foundations_Archive/ML/images/31_mae_vs_mse_curve.svg", "MAE versus MSE curve"),
          ],
          ["regression-errors", "mse-rmse"]
        ),
        topic(
          "mse-rmse",
          "Mean Squared Error and Root Mean Squared Error",
          "prior",
          "MSE squares mistakes to punish large errors; RMSE takes the square root so the result returns to the target's units.",
          ["Squared-error formula", "Outlier sensitivity", "RMSE as square root of MSE", "Side-by-side MAE/MSE/RMSE calculation"],
          [
            evidence("Foundations_Archive/ML/30_Cost_Function_MSE_GradientDescent.ipynb", "MSE from scratch"),
            evidence("Foundations_Archive/ML/32_Root_Mean_Squared_Error.MD", "RMSE deep dive"),
            evidence("Foundations_Archive/ML/33_Cost_Functions_MAE_MSE_RMSE_Practical.ipynb", "Three metrics side by side"),
            evidence("Foundations_Archive/ML/images/32_outlier_growth_comparison.svg", "Outlier-sensitivity comparison"),
          ],
          ["mae", "r-squared"]
        ),
        topic(
          "r-squared",
          "R² and residual diagnostics",
          "learned",
          "R² compares model error with always predicting the target mean; diagnostics show where the remaining misses occur.",
          ["R² = 1 − SSE/SST", "Zero as mean-baseline performance", "Negative scores as worse than the mean", "Residual-vs-predicted and actual-vs-predicted plots", "Why a two-row test score is weak evidence"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/05_Linear_Regression.ipynb", "R² and fitted-line interpretation"),
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/06_multiple_linear_regression.ipynb", "Tiny-test warning and train/test comparison"),
            evidence("Foundations_Archive/ML/26_Simple_Linear_Regression.ipynb", "Four residual diagnostics"),
          ],
          ["regression-errors", "cross-validation"]
        ),
      ],
    },

    {
      id: "classification",
      title: "Classification & Evaluation",
      color: "#a94d58",
      summary: "Predicting labels, understanding boundaries, and measuring mistakes",
      topics: [
        topic(
          "classification-basics",
          "Binary classification workflow",
          "prior",
          "A small hand-built dataset demonstrates separating features from a binary target, training a classifier, and checking unseen predictions.",
          ["Binary target labels", "Train/test/predict sequence", "Inspecting the learned model", "Accuracy by hand"],
          [evidence("Foundations_Archive/ML/23_Simple_Dataset_Practice.ipynb", "Tiny decision-tree classification exercise")],
          ["features-labels", "decision-tree-classification"]
        ),
        topic(
          "decision-tree-classification",
          "Decision tree classification",
          "learned",
          "A classification tree asks feature questions that reduce label confusion until a leaf can make a class decision.",
          ["Entropy as confusion", "Information gain for choosing a split", "Recursive questions and leaves", "Reading plot_tree and exported tree rules", "Honest holdout scoring"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/16_Descison_Tree_Classfication.ipynb", "Entropy and information-gain story"),
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/dt.tree", "Exported tree rule structure"),
            evidence("Foundations_Archive/ML/20_Feature_Selection_techniques.ipynb", "Tree classifier reused during feature selection"),
          ],
          ["classification-basics", "random-forest"]
        ),
        topic(
          "decision-tree-regression",
          "Decision tree regression",
          "learned",
          "A regression tree partitions feature space but predicts a numeric average instead of a class label.",
          ["Variance reduction for split quality", "Numeric leaf predictions", "Piecewise-constant response", "R² meaning for a regressor"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/17_Descison_Tree_Regression.ipynb", "Variance-based regression-tree lesson"),
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/dt1.tree", "Exported regression-tree rules"),
          ],
          ["decision-tree-classification", "random-forest-regression"]
        ),
        topic(
          "naive-bayes",
          "Gaussian, Multinomial, and Bernoulli Naive Bayes",
          "learned",
          "Naive Bayes combines class priors with per-feature likelihoods under a simplifying independence assumption.",
          ["Bayes theorem and the naive assumption", "Gaussian bell curves for continuous inputs", "Multinomial non-negative count-like inputs", "Bernoulli binary features and thresholds", "Choosing preprocessing to match the variant"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/18_Naive_Bayers.ipynb", "Three variants, failure cases, and Iris example"),
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/HandWritten Notes/18_Naive_Bayes_Detailed_Handwritten_Notes.png", "Handwritten Naive Bayes notes"),
          ],
          ["probability", "classification-metrics"]
        ),
        topic(
          "knn-neighbors",
          "K-Nearest Neighbors classification and regression",
          "growing",
          "KNN stores the training examples, finds the closest rows to a new point, and predicts by neighbor voting for classes or neighbor averaging for numbers.",
          ["Euclidean distance and neighborhood lookup", "KNeighborsClassifier with k = 5 on two synthetic blobs", "Inspecting neighbor distances and row indices with kneighbors", "KNeighborsRegressor with k = 3", "Verifying a regression prediction by averaging the three neighbor targets", "Why the current whole-dataset score needs a clean held-out evaluation"],
          [evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/25_K_Nearest Neighbor.ipynb", "New KNN classification, neighbor-inspection, and regression practice")],
          ["standard-scaling", "train-test-split", "classification-metrics", "r-squared"]
        ),
        topic(
          "svc-linear",
          "Linear Support Vector Classification and margin",
          "growing",
          "SVC searches for a separating boundary with the widest useful margin; a linear kernel works when one flat boundary is enough.",
          ["Binary classes and a separating line", "Support vectors near the boundary", "Margin intuition", "Why scaling matters for distance-based boundaries", "Reading a small held-out result carefully"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/22_svc_2D.ipynb", "Tea-stall story and 2D decision boundary"),
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/23_SVC_3D.ipynb", "Linear SVC on raw and expanded features"),
          ],
          ["standard-scaling", "svc-kernels"]
        ),
        topic(
          "svc-kernels",
          "Polynomial features, kernels, and feature space",
          "growing",
          "A nonlinear boundary can be learned either by creating polynomial features explicitly or by asking SVC to compare rows through a polynomial kernel.",
          ["Squared and interaction features", "Linear boundary in expanded space", "Polynomial kernel on raw features", "2D/3D visualization versus actual feature dimensions", "degree, gamma, coef0, and C as settings"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/22_svc_2D.ipynb", "Manual nonlinear feature idea"),
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/23_SVC_3D.ipynb", "Manual five-feature and polynomial-kernel comparison"),
          ],
          ["feature-engineering", "projection-3d"]
        ),
        topic(
          "classification-metrics",
          "Accuracy, confusion matrix, precision, recall, and F1",
          "learned",
          "Classification metrics separate total correctness from false alarms and missed positives.",
          ["Accuracy by hand", "True/false positives and negatives", "Precision as trust in positive predictions", "Recall as found positives", "F1 as a precision-recall balance"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/15_Model_Evaluation.ipynb", "Metrics and confusion matrix on breast-cancer data"),
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/23_SVC_3D.ipynb", "Classification report on a tiny SVC test set"),
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/HandWritten Notes/15_Model_Evaluation.png", "Handwritten evaluation notes"),
          ],
          ["class-imbalance", "roc-auc"]
        ),
        topic(
          "roc-auc",
          "ROC curve, AUC, and decision thresholds",
          "learned",
          "ROC traces true-positive rate against false-positive rate as the probability threshold moves; AUC summarizes ranking quality.",
          ["predict_proba versus class labels", "Threshold sweep", "True-positive and false-positive rates", "AUC across the whole curve", "Modern RocCurveDisplay workflow"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/14_roc.ipynb", "ROC/AUC steps and API correction"),
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/HandWritten Notes/14_ROC_Curve.png", "Handwritten ROC notes"),
          ],
          ["classification-metrics", "naive-bayes"]
        ),
      ],
    },

    {
      id: "unsupervised",
      title: "Clustering & Anomaly Detection",
      color: "#3f7c61",
      summary: "Finding groups and unusual observations without target labels",
      topics: [
        topic(
          "kmeans",
          "K-Means clustering",
          "learned",
          "K-Means alternates between assigning rows to the nearest center and moving centers to the mean of their assigned rows.",
          ["Unlabeled customer grouping", "Choosing n_clusters", "cluster_centers_ and labels_", "predicting a cluster for a new row", "Where curved clusters break the method"],
          [evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/12_clustering.ipynb", "5,000-customer K-Means story")],
          ["synthetic-data", "hierarchical"]
        ),
        topic(
          "hierarchical",
          "Agglomerative hierarchical clustering",
          "learned",
          "Agglomerative clustering begins with individual rows and repeatedly joins the closest groups into a hierarchy.",
          ["Bottom-up merging", "Distance between points and groups", "No predict() in the fitted clustering workflow", "Comparing linkage methods"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/12_clustering.ipynb", "K-Means versus hierarchy"),
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/13_Hirerachical_Clustering.ipynb", "Nine-person visual story"),
          ],
          ["kmeans", "dendrogram"]
        ),
        topic(
          "dendrogram",
          "Dendrograms and linkage choices",
          "learned",
          "A dendrogram records the order and distance of cluster merges; cutting it at a height chooses the final groups.",
          ["Leaves, merge height, and branch reading", "Single, complete, average, and Ward linkage", "Turning the tree into flat clusters", "Why scaling changes distance"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/13_Hirerachical_Clustering.ipynb", "Dendrogram built and read step by step"),
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/hierarchical-clustering-visual-guide.html", "Interactive visual guide"),
          ],
          ["hierarchical", "standard-scaling"]
        ),
        topic(
          "dbscan",
          "DBSCAN: core, border, and noise points",
          "learned",
          "DBSCAN grows dense neighborhoods and leaves isolated points as noise without requiring a cluster count first.",
          ["eps as neighborhood radius", "min_samples as crowd requirement", "Core, border, and noise roles", "Changing radius and counting noise", "Sensitivity to feature scale"],
          [evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/21_Outliers.ipynb", "Hand-measured neighborhoods and scaled experiments")],
          ["kmeans", "anomaly-workflow"]
        ),
        topic(
          "anomaly-workflow",
          "Outlier flags, scores, and investigation",
          "learned",
          "An anomaly detector produces a candidate list, not proof; flags must be traced back to rows and investigated in context.",
          ["Outlier versus novelty language", "Prediction labels versus continuous scores", "contamination as an expected proportion", "Feature choice changes what looks unusual"],
          [evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/21_Outliers.ipynb", "Four anomaly approaches compared")],
          ["outlier-iqr-zscore", "elliptic-envelope"]
        ),
        topic(
          "elliptic-envelope",
          "Elliptic Envelope",
          "learned",
          "Elliptic Envelope draws a robust covariance-based oval around roughly Gaussian data and flags distant rows.",
          ["Robust center and covariance", "Elliptical distance", "contamination boundary", "Why non-elliptical data is a breaking point"],
          [evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/21_Outliers.ipynb", "Ellipse scoring and plotted boundary")],
          ["anomaly-workflow", "isolation-forest"]
        ),
        topic(
          "isolation-forest",
          "Isolation Forest",
          "learned",
          "Isolation Forest repeatedly makes random splits; rows isolated in fewer splits receive more anomalous scores.",
          ["Random partition trees", "Short isolation paths", "score_samples versus decision_function direction", "contamination and reproducible seeding"],
          [evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/21_Outliers.ipynb", "Isolation scores and seed-controlled experiment")],
          ["random-forest", "local-outlier-factor"]
        ),
        topic(
          "local-outlier-factor",
          "Local Outlier Factor (LOF)",
          "learned",
          "LOF compares a row's local density with the density around its neighbors, so a point can be unusual relative to its own neighborhood.",
          ["k-nearest neighbors", "Reachability distance", "Local density ratio", "One-feature versus two-feature scores", "How changing k can remove a flag"],
          [evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/21_Outliers.ipynb", "Seven-request example and hand calculations")],
          ["anomaly-workflow", "standard-scaling"]
        ),
      ],
    },

    {
      id: "selection",
      title: "Evaluation, Tuning & Ensembles",
      color: "#765c9c",
      summary: "More reliable evaluation and combinations of multiple models",
      topics: [
        topic(
          "cross-validation",
          "Cross-validation strategies",
          "learned",
          "Cross-validation repeats train/validation splits so the result depends less on one lucky holdout.",
          ["cross_val_score", "KFold", "StratifiedKFold", "Leave-One-Out and Leave-P-Out", "Choosing a strategy for classification and small data"],
          [evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/11_Corss_validation.ipynb", "Five validation approaches")],
          ["r-squared", "hyperparameter-search"]
        ),
        topic(
          "hyperparameter-search",
          "Manual, grid, and randomized hyperparameter search",
          "learned",
          "Hyperparameters are chosen outside fit; search evaluates candidate settings through repeated validation.",
          ["Manual parameter trials", "GridSearchCV exhaustively combining values", "RandomizedSearchCV trading coverage for speed", "Reading best_params_, best_score_, and cv_results_", "Avoiding conclusions from tiny data"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/19_Hyperparameter_Tuning.ipynb", "Manual, grid, and random search"),
            evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/HandWritten Notes/19_Hyperparameter_Tuning_Detailed_Handwritten_Notes.png", "Handwritten tuning notes"),
          ],
          ["cross-validation", "random-forest"]
        ),
        topic(
          "random-forest",
          "Random Forest classification and bagging",
          "learned",
          "A random forest trains many varied trees on sampled rows and features, then combines their votes.",
          ["Bootstrap row samples", "Random feature subsets", "Decorrelating trees", "Majority vote", "n_estimators and max_depth"],
          [evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/20_Ensemble_methods.ipynb", "Random Forest and bagging lesson")],
          ["decision-tree-classification", "isolation-forest"]
        ),
        topic(
          "adaboost",
          "AdaBoost",
          "learned",
          "AdaBoost trains weak learners in sequence and increases attention on rows the current ensemble gets wrong.",
          ["Weak decision stumps", "Reweighting mistakes", "Sequential correction", "Learning rate and estimator count"],
          [evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/20_Ensemble_methods.ipynb", "AdaBoost workflow and story")],
          ["decision-tree-classification", "gradient-boosting"]
        ),
        topic(
          "gradient-boosting",
          "Gradient Boosting",
          "learned",
          "Gradient boosting adds small models that chase the residual mistakes left by the current ensemble.",
          ["Sequential residual correction", "Learning rate as contribution size", "Shallow trees as weak learners", "Difference from row-reweighting AdaBoost"],
          [evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/20_Ensemble_methods.ipynb", "Gradient-boosting residual explanation")],
          ["adaboost", "gradient-descent"]
        ),
        topic(
          "voting",
          "Hard and soft voting classifiers",
          "learned",
          "VotingClassifier combines different model families either by counting class votes or averaging class probabilities.",
          ["Hard voting as majority decision", "Soft voting as probability averaging", "Model diversity", "Probability support and optional weights"],
          [evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/20_Ensemble_methods.ipynb", "SVC, KNN, and logistic panel")],
          ["classification-metrics", "random-forest"]
        ),
        topic(
          "random-forest-regression",
          "Random Forest regression",
          "growing",
          "The ensemble notebook applies the forest idea to numeric prediction, but its saved 0.991 score is training R² and still needs held-out evaluation.",
          ["Average predictions across regression trees", "Training-score versus test-score distinction", "Need for a proper train/test experiment"],
          [evidence("AI_ML_Series/02_data_toolkit_apps/08_sklearn/20_Ensemble_methods.ipynb", "First regressor fit; evaluation remains open")],
          ["decision-tree-regression", "cross-validation"]
        ),
      ],
    },

    {
      id: "apps",
      title: "Apps, Dashboards & Integrated Projects",
      color: "#836044",
      summary: "Projects that combine several learned skills into one deliverable",
      topics: [
        topic(
          "streamlit-model",
          "Streamlit rerun model, widgets, layout, and state",
          "growing",
          "A Streamlit script reruns top to bottom after interaction, so caching and session state preserve expensive work and user state deliberately.",
          ["Page configuration, text, sidebar, columns, and tabs", "Multiselect, sliders, checkboxes, buttons, and selectboxes", "Caching and session_state", "Empty-result stop flow", "DataFrame display and CSV download"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/07_streamlit/app.py", "Tips Explorer reference app"),
            evidence("AI_ML_Series/02_data_toolkit_apps/07_streamlit/README.md", "Mental model, checklist, and deployment plan"),
            evidence("AI_ML_Series/02_data_toolkit_apps/07_streamlit/requirements.txt", "Runtime dependency manifest"),
          ],
          ["streamlit-sales", "pandas-aggregation"]
        ),
        topic(
          "streamlit-sales",
          "Sales Analysis Streamlit app",
          "growing",
          "The learner-written app generates sales data, exposes sidebar bounds, calculates summaries, and renders Matplotlib, Seaborn, and Plotly charts.",
          ["Reactive controls and conditional charts", "Generated data and summary statistics", "Cross-library chart embedding", "Two documented rerun/session-state defects"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/07_streamlit/sales_analysis.py", "Learner-written dashboard"),
            evidence("AI_ML_Series/02_data_toolkit_apps/07_streamlit/sales_analysis_explained.md", "Line-by-line review and open defects"),
          ],
          ["streamlit-model", "plotly"]
        ),
        topic(
          "iris-project",
          "Iris Visual Explorer web app",
          "learned",
          "A small HTML/CSS/JavaScript explorer turns the Iris dataset into an interactive visual learning artifact.",
          ["Dataset explanation and class balance", "Interactive browser controls", "Coordinating notebook evidence with a web presentation"],
          [
            evidence("AI_ML_Series/02_data_toolkit_apps/05_iris_visual_explorer/index.html", "Explorer page"),
            evidence("AI_ML_Series/02_data_toolkit_apps/05_iris_visual_explorer/script.js", "Interactive behavior"),
            evidence("AI_ML_Series/02_data_toolkit_apps/05_iris_visual_explorer/styles.css", "Responsive presentation"),
            evidence("AI_ML_Series/02_data_toolkit_apps/05_iris_visual_explorer/iris_dataset_explained.ipynb", "Underlying data lesson"),
          ],
          ["eda-widths", "iris-visuals"]
        ),
        topic(
          "attrition-pipeline",
          "Employee attrition preprocessing pipeline",
          "prior",
          "The capstone integrates missing values, duplicates, inconsistent categories, type fixes, outliers, skew, scaling, and encoding on one synthetic HR dataset.",
          ["Nine-stage data-cleaning architecture", "A reproducible 706-row raw dataset", "Feature-by-feature preparation choices", "A recorded fit-before-split leakage issue for future correction"],
          [
            evidence("Foundations_Archive/ML/project/ARCHITECTURE.md", "Pipeline diagram and data dictionary"),
            evidence("Foundations_Archive/ML/project/Employee_Attrition_Pipeline.ipynb", "Integrated preprocessing notebook"),
            evidence("Foundations_Archive/ML/project/employee_attrition_raw.csv", "Raw synthetic project dataset"),
          ],
          ["cleaning-strategy", "safe-pipelines"]
        ),
        topic(
          "regression-practice-series",
          "Worked linear-regression math practice",
          "prior",
          "Eleven story-based exercises connect slope, cost, derivatives, weight updates, and the exact best-fit formula.",
          ["Clean versus messy relationships", "Manual derivative direction", "First and second gradient steps", "Exact slope formula", "Weight and bias partial derivatives", "Final electricity-bill solution"],
          [
            evidence("Foundations_Archive/math_for_ml/phase_5_linear_regression/practice_exercises/01_priya_water_tank_clean_data.md", "Clean-data slope exercise"),
            evidence("Foundations_Archive/math_for_ml/phase_5_linear_regression/practice_exercises/04_rohan_freelance_earnings_messy_data_gradient_descent.md", "Messy-data gradient exercise"),
            evidence("Foundations_Archive/math_for_ml/phase_5_linear_regression/practice_exercises/08_deriving_exact_best_w_formula.md", "Closed-form slope derivation"),
            evidence("Foundations_Archive/math_for_ml/phase_5_linear_regression/practice_exercises/09_derivative_with_respect_to_b.md", "Bias derivative exercise"),
            evidence("Foundations_Archive/math_for_ml/phase_5_linear_regression/practice_exercises/11_meera_electricity_bill_final_solution.md", "Final combined solution"),
          ],
          ["gradient-descent", "coef-intercept"]
        ),
      ],
    },
  ],
};
