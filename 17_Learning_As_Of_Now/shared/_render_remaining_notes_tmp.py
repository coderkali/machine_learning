from __future__ import annotations

import html
import json
import re
import subprocess
import sys
import textwrap
from concurrent.futures import ThreadPoolExecutor, as_completed
from html.parser import HTMLParser
from pathlib import Path

import mistune


ROOT = Path("/Users/kaliprasad/Documents/MACHINE_LEARNING")
TMP = Path("/private/tmp/codex-handwritten-remaining")
STORIES = json.loads((ROOT / "17_Learning_As_Of_Now/shared/stories.json").read_text(encoding="utf-8"))


CUSTOM_STORIES = {
    "01_Python/01_Variables_And_Data_Types": (
        "Maya asked a learner for a course fee. Python returned the typed value as text. "
        "When she tried to add 500, Python refused to mix a string with a number. "
        "Naming the value was only step one; checking its type and converting it made the calculation honest."
    ),
    "01_Python/06_Plotly": (
        "Arjun sent all 244 tip rows to a Plotly bar chart and read the bar height as an average. "
        "It was actually a stack of row values, so the height represented a sum. "
        "He learned to shape the DataFrame first, then use hover, zoom and clickable traces to explore the result."
    ),
    "01_Python/07_Streamlit": (
        "Nina built a twelve-month sales dashboard. It appeared after she clicked Generate, then vanished when she moved a slider. "
        "The slider caused the whole script to run again, and the button was no longer true. "
        "She stored durable choices in session state and cached data work that did not need to run again."
    ),
    "01_Python/08_Iris_Visual_Explorer": (
        "Asha received 150 iris flowers: 50 setosa, 50 versicolor and 50 virginica. "
        "Each flower had four centimetre measurements but no picture explaining what separated the species. "
        "She plotted the measurements and saw the petal columns separate the groups far more clearly than the sepal columns."
    ),
    "01_Python/10_Pizza_Dashboard_Lab": (
        "A coach kept names in one list and scores in another: Alice 95, Bob 82 and Charlie 78. "
        "Indexing both lists by hand made it easy to pair the wrong score with a person. "
        "zip joined matching positions so every printed name travelled with the correct score."
    ),
    "02_DataScience/02_IQR": (
        "Mina inspected 1,000 passenger rows. The middle half of Age ran from Q1 = 22.75 to Q3 = 35, "
        "while Fare reached 512.33. A plain minimum-to-maximum range let that extreme fare dominate the story. "
        "The IQR kept attention on the middle half and gave her a repeatable fence for unusual values."
    ),
    "02_DataScience/03_Skewness": (
        "Mina summarized passenger ages and got mean 29.186, median 29 and mode 22. "
        "Those three centres did not line up, and the skew value was +0.274. "
        "The small positive sign told her the longer tail stretched to the right, pulling the mean farther than the median."
    ),
    "02_DataScience/04_Correlation": (
        "Leela studied 1,000 restaurant bills. Total bill and tip had correlation 0.847, while party size and tip had correlation 0.652. "
        "Both pairs moved together, but one relationship was stronger. "
        "A correlation matrix let her compare direction and strength without confusing association with cause."
    ),
    "02_DataScience/07_Z_Test": (
        "A doctor knew the city mean height was 168 cm and the population standard deviation was 3.9 cm. "
        "A sample of 36 people averaged 169.5 cm. The gap looked small, but the Z score was 2.31, beyond the two-tailed 1.96 boundary. "
        "The sample was unlikely enough under the old mean that the doctor rejected the null hypothesis."
    ),
    "02_DataScience/08_T_Test": (
        "A chip maker claimed each bag averaged 150 g. Twenty-five sampled bags averaged 148 g, with sample standard deviation 5 g. "
        "Because the population spread was unknown, the analyst used a t-test. "
        "The result t = -2 crossed the left-tail boundary -1.711, so ordinary sampling noise was not a convincing explanation."
    ),
    "02_DataScience/09_Paired_T_Test": (
        "Twenty employees took the same typing test before and after training. Every one improved, and the mean gain was 7.25. "
        "Treating the forty scores as unrelated nearly hid the effect. "
        "Pairing each employee with themself produced t = 12.704 and exposed the consistent within-person change."
    ),
    "02_DataScience/10_Chi_Square_Test": (
        "Ravi rolled a die 120 times and observed counts 22, 17, 20, 26, 22 and 13. "
        "A fair die would expect 20 for each face. The differences looked uneven, but chi-square combined them into 5.1. "
        "That stayed below the 11.07 boundary, so the data did not provide strong evidence that the die was biased."
    ),
    "02_DataScience/11_Z_Test_vs_T_Test": (
        "An analyst checked a 150 g bag claim using 25 bags with sample mean 148 g and spread 5 g. "
        "If 5 g were the known population spread, Z would be available; if it came only from the sample, t was the honest choice. "
        "Both formulas gave -2 here, but the reference distribution and critical boundary were different."
    ),
    "03_Math/01_Algebra": (
        "Raju's chai stall earns ₹5 per cup and pays ₹200 to open each day. "
        "At 10 cups he loses ₹150; at 40 cups he breaks even; at 80 cups he earns ₹200. "
        "The expression P = 5c - 200 stores the whole pattern and lets one substitution answer any sales day."
    ),
    "03_Math/02_Statistics": (
        "Coach Riya saw two players average 50 runs. Player A scored 48, 52, 49, 51 and 50; "
        "Player B scored 10, 90, 5, 95 and 50. The averages tied, but their reliability did not. "
        "She used centre, spread and probability to turn the scorebook into a fair decision."
    ),
    "03_Math/03_Linear_Algebra": (
        "A chai chain recorded five stalls, with four numbers per stall. One row was a four-number vector; all five rows formed a 5 by 4 matrix. "
        "The owner gave the four measurements four importance weights. "
        "A dot product scored one stall, while matrix multiplication scored all five without a hand-written loop."
    ),
    "03_Math/04_Calculus": (
        "Raju saved ₹1,000 in month 1 and ₹2,000 in month 3, an average rise of ₹500 per month. "
        "But he wanted the rate at one exact moment, not across two months. "
        "Shrinking the gap produced a derivative, and that same local slope later told his model which way to step downhill."
    ),
    "03_Math/05_Linear_Regression_From_Scratch": (
        "Meera recorded AC hours and monthly bills: 1→₹620, 2→₹1,080, 3→₹1,750, 4→₹2,100 and 5→₹2,900. "
        "Every pair suggested a different slope, so choosing two points was arbitrary. "
        "She measured every residual together and let gradient descent find one line that served all five months."
    ),
    "04_ML/16_Linear_Regression": (
        "A placement officer wanted to predict package from CGPA for 100 students. "
        "A student with CGPA 6.89 had an actual package of 3.26, while the fitted line predicted 2.8365. "
        "One miss was not a verdict, so she checked all held-back rows and obtained an R² score of about 68.79%."
    ),
}


JOURNEYS = {
    "01_Python/01_Variables_And_Data_Types": ["name a value", "inspect its type", "convert deliberately", "work with numbers", "format clear text"],
    "01_Python/02_NumPy": ["spot loop overhead", "build one typed array", "read shape and axis", "broadcast safely", "vectorize the answer"],
    "01_Python/03_Pandas": ["name every column", "inspect and clean rows", "select with a mask", "group and aggregate", "keep meaning attached"],
    "01_Python/04_Matplotlib": ["turn a table into a question", "choose the honest plot", "label axes and series", "read pattern and anomaly", "finish with a clear message"],
    "01_Python/05_Seaborn": ["start from a DataFrame", "map columns to roles", "compare distributions", "use hue with purpose", "read the statistical picture"],
    "01_Python/06_Plotly": ["shape data first", "create figure traces", "let the browser draw", "explore with hover", "question visual distance"],
    "01_Python/07_Streamlit": ["run top to bottom", "read current widget values", "cache repeatable work", "store session state", "handle empty results"],
    "01_Python/08_Iris_Visual_Explorer": ["learn the five columns", "check shape and quality", "plot one feature", "compare species", "explain what separates"],
    "01_Python/10_Pizza_Dashboard_Lab": ["keep two lists aligned", "pair matching positions", "iterate over pairs", "unpack name and score", "print one honest row"],
    "02_DataScience/01_Measures_Of_Variability": ["notice equal averages", "measure every distance", "square before combining", "return to original units", "compare consistency"],
    "02_DataScience/02_IQR": ["sort the values", "mark Q1 and Q3", "measure the middle half", "build 1.5-IQR fences", "inspect flagged points"],
    "02_DataScience/03_Skewness": ["draw the distribution", "locate mean and median", "read the tail direction", "measure skew", "choose a robust centre"],
    "02_DataScience/04_Correlation": ["select numeric columns", "compare paired movement", "read sign and strength", "scan the heatmap", "avoid causal claims"],
    "02_DataScience/05_Central_Limit_Theorem": ["start with a population", "take equal-size samples", "average each sample", "repeat many times", "watch means form a bell"],
    "02_DataScience/06_Hypothesis_Testing_Basics": ["state no-effect H0", "choose alpha first", "measure surprise", "compare p with alpha", "report evidence carefully"],
    "02_DataScience/07_Z_Test": ["check Z conditions", "write both hypotheses", "standardize the mean gap", "mark both tails", "make the decision"],
    "02_DataScience/08_T_Test": ["notice unknown population spread", "choose the tail from the claim", "calculate degrees of freedom", "standardize the gap", "compare with t critical"],
    "02_DataScience/09_Paired_T_Test": ["match each before and after", "calculate each difference", "analyse one difference column", "use n minus one df", "interpret the paired result"],
    "02_DataScience/10_Chi_Square_Test": ["list observed counts", "derive expected counts", "square scaled gaps", "use the right tail", "separate association from cause"],
    "02_DataScience/11_Z_Test_vs_T_Test": ["ask whether sigma is known", "check sample size", "choose the reference curve", "compute the statistic", "use the correct boundary"],
    "03_Math/01_Algebra": ["name the changing amount", "separate rate and constant", "substitute a value", "solve backwards", "connect to y = wx + b"],
    "03_Math/02_Statistics": ["describe the centre", "measure the spread", "reason with probability", "read the bell curve", "compare movement together"],
    "03_Math/03_Linear_Algebra": ["spot scalar and vector", "stack rows into a matrix", "check compatible shapes", "take a dot product", "transpose when sideways"],
    "03_Math/04_Calculus": ["measure rise over run", "shrink the point gap", "read a local derivative", "follow the downhill sign", "control step size"],
    "03_Math/05_Linear_Regression_From_Scratch": ["write y = wx + b", "measure residuals", "combine them as cost", "differentiate the bowl", "update w and b"],
    "04_ML/01_What_Is_ML": ["replace brittle rules", "learn a pattern from examples", "separate features and target", "train then evaluate", "improve with new evidence"],
    "04_ML/02_Types_Of_Variables": ["ask what a column means", "separate labels from quantities", "identify discrete or continuous", "choose valid operations", "prepare the model input"],
    "04_ML/03_Data_Collection": ["define the real question", "name the target population", "combine relevant sources", "audit sampling bias", "record provenance and limits"],
    "04_ML/04_Data_Cleaning": ["profile before modelling", "standardize inconsistent text", "handle missing values", "remove true duplicates", "validate ranges and types"],
    "04_ML/05_Missing_Values": ["count every gap", "ask why it is missing", "choose drop or fill", "fit imputation on train", "check bias after cleaning"],
    "04_ML/06_Categorical_Encoding": ["ask whether order exists", "one-hot nominal labels", "encode ordered levels", "fit categories on train", "handle unseen values"],
    "04_ML/08_Feature_Scaling": ["compare feature ranges", "centre with the mean", "scale by standard deviation", "map with min and max", "avoid train-test leakage"],
    "04_ML/09_Duplicates_And_Dtypes": ["detect repeated rows", "decide what duplicate means", "remove before splitting", "parse numeric text", "verify the cleaned schema"],
    "04_ML/10_Function_Transformer": ["plot the original shape", "choose a valid function", "compress the long tail", "fit inside a pipeline", "compare before and after"],
    "04_ML/11_Feature_Selection": ["remove dead columns", "score individual relevance", "search useful subsets", "use model-based importance", "validate the smaller set"],
    "04_ML/13_Train_Test_Split": ["hide test rows early", "fit only on train", "transform without leakage", "score unseen examples", "keep the split reproducible"],
    "04_ML/14_Synthetic_Datasets": ["choose a known truth", "generate controlled data", "add noise deliberately", "fit the chosen model", "compare learned with known"],
    "04_ML/15_EDA_Uni_Bi_Multivariate": ["inspect one variable", "compare two variables", "scan many relationships", "separate classes with hue", "turn plots into questions"],
    "04_ML/16_Linear_Regression": ["check a straight trend", "split the students", "fit slope and intercept", "measure residuals and R²", "diagnose the fitted line"],
    "04_ML/17_Multiple_Linear_Regression": ["add several useful inputs", "hold other inputs fixed", "read one coefficient", "check correlated predictors", "judge unseen predictions"],
    "04_ML/18_Polynomial_Regression": ["notice the bend", "create powered features", "fit a linear model on them", "compare degrees", "reject the overfit curve"],
    "04_ML/19_Ridge_Regression": ["spot unstable large weights", "add an L2 penalty", "tune alpha", "shrink every coefficient", "validate on new rows"],
    "04_ML/20_Lasso_Regression": ["start with too many columns", "add an L1 penalty", "push weak weights to zero", "tune alpha", "read the selected features"],
    "04_ML/21_ElasticNet": ["combine L1 and L2", "set overall alpha", "balance with l1 ratio", "stabilize correlated inputs", "keep useful selection"],
    "04_ML/23_Cross_Validation": ["split into k folds", "hold out one fold", "rotate the test fold", "collect every score", "report mean and spread"],
    "04_ML/31_Clustering_KMeans": ["begin without labels", "place k centroids", "assign nearest points", "move to cluster means", "repeat until stable"],
    "04_ML/32_Hierarchical_Clustering": ["start with single points", "merge the nearest groups", "update group distances", "read the dendrogram", "cut at a useful height"],
    "04_ML/35_Project_Employee_Attrition": ["define attrition target", "split before learning", "preprocess by column type", "fit one pipeline", "evaluate and explain risk"],
}


DIAGRAM_KIND = {
    "01_Python/01_Variables_And_Data_Types": "flow", "01_Python/02_NumPy": "array",
    "01_Python/03_Pandas": "table", "01_Python/04_Matplotlib": "chart",
    "01_Python/05_Seaborn": "boxplot", "01_Python/06_Plotly": "projection",
    "01_Python/07_Streamlit": "rerun", "01_Python/08_Iris_Visual_Explorer": "clusters",
    "01_Python/10_Pizza_Dashboard_Lab": "pairing", "02_DataScience/01_Measures_Of_Variability": "spread",
    "02_DataScience/02_IQR": "iqr", "02_DataScience/03_Skewness": "skew",
    "02_DataScience/04_Correlation": "correlation", "02_DataScience/05_Central_Limit_Theorem": "clt",
    "02_DataScience/06_Hypothesis_Testing_Basics": "decision", "02_DataScience/07_Z_Test": "distribution",
    "02_DataScience/08_T_Test": "distribution", "02_DataScience/09_Paired_T_Test": "paired",
    "02_DataScience/10_Chi_Square_Test": "bars", "02_DataScience/11_Z_Test_vs_T_Test": "decision",
    "03_Math/01_Algebra": "line", "03_Math/02_Statistics": "spread",
    "03_Math/03_Linear_Algebra": "matrix", "03_Math/04_Calculus": "slope",
    "03_Math/05_Linear_Regression_From_Scratch": "regression", "04_ML/01_What_Is_ML": "learning",
    "04_ML/02_Types_Of_Variables": "types", "04_ML/03_Data_Collection": "sources",
    "04_ML/04_Data_Cleaning": "pipeline", "04_ML/05_Missing_Values": "missing",
    "04_ML/06_Categorical_Encoding": "encoding", "04_ML/08_Feature_Scaling": "scaling",
    "04_ML/09_Duplicates_And_Dtypes": "dedupe", "04_ML/10_Function_Transformer": "transform",
    "04_ML/11_Feature_Selection": "funnel", "04_ML/13_Train_Test_Split": "split",
    "04_ML/14_Synthetic_Datasets": "known", "04_ML/15_EDA_Uni_Bi_Multivariate": "eda",
    "04_ML/16_Linear_Regression": "regression", "04_ML/17_Multiple_Linear_Regression": "matrix",
    "04_ML/18_Polynomial_Regression": "curves", "04_ML/19_Ridge_Regression": "coefficients",
    "04_ML/20_Lasso_Regression": "coefficients", "04_ML/21_ElasticNet": "coefficients",
    "04_ML/23_Cross_Validation": "folds", "04_ML/31_Clustering_KMeans": "clusters",
    "04_ML/32_Hierarchical_Clustering": "dendrogram", "04_ML/35_Project_Employee_Attrition": "pipeline",
}


FORMULAS = {
    "01_Python/01_Variables_And_Data_Types": [("x = str(5)\ny = int(5)\nz = float(5)", "x is text; y is an integer; z is a decimal number."), ("total = course_fee + exam_fee", "total is the result; course_fee and exam_fee must be numeric values.")],
    "01_Python/02_NumPy": [("fahrenheit = celsius × 9 / 5 + 32", "celsius is the input array; fahrenheit is the converted array."), ("shape = (rows, columns)", "rows count observations; columns count features."), ("a · b = Σ aᵢbᵢ", "aᵢ and bᵢ are matching elements; Σ adds their products.")],
    "01_Python/03_Pandas": [("revenue = quantity × price", "quantity and price are named columns; revenue is the derived column."), ("df.groupby('city')['revenue'].sum()", "df is the table; city forms groups; sum combines revenue inside each group."), ("mask = df['revenue'] > limit", "mask is True or False per row; limit is the chosen cutoff.")],
    "01_Python/04_Matplotlib": [("ax.plot(month, sales, marker='o')", "month supplies x positions; sales supplies y values; ax is the labelled plotting area.")],
    "01_Python/05_Seaborn": [("sns.boxplot(data=tips, x='day', y='tip')", "tips is the DataFrame; day makes groups; tip is the measured value."), ("sns.scatterplot(data=df, x=x, y=y, hue=group)", "x and y are numeric columns; group controls colour; df holds the rows.")],
    "01_Python/06_Plotly": [("px.bar(df, x='day', y='total_bill')", "df supplies rows; day is the category; total_bill contributes each bar segment."), ("data → world → camera → screen", "data is the 3-D point; world rescales it; camera changes viewpoint; screen keeps two coordinates.")],
    "01_Python/07_Streamlit": [("widget change → full rerun → current UI", "widget change is the event; rerun starts at line one; current UI is rebuilt from current values.")],
    "01_Python/08_Iris_Visual_Explorer": [("X.shape = (150, 4)\ny = species", "X holds 150 flowers and four measurements; y is the species label."), ("petal length: 1.46 → 4.26 → 5.55 cm", "the values are species means for setosa, versicolor and virginica in that order.")],
    "01_Python/10_Pizza_Dashboard_Lab": [("zip(names, scores) → (name, score)", "names and scores are equal-position lists; each output pair keeps one name with one score.")],
    "02_DataScience/01_Measures_Of_Variability": [("variance = Σ(xᵢ - x̄)² / n\nSD = √variance", "xᵢ is one value; x̄ is the mean; n is the count; SD is standard deviation.")],
    "02_DataScience/02_IQR": [("IQR = Q3 - Q1 = 35 - 22.75 = 12.25", "Q1 is the 25th percentile; Q3 is the 75th percentile; IQR spans the middle half.")],
    "02_DataScience/03_Skewness": [("skew = +0.274\nmean 29.186 > median 29 > mode 22", "skew measures tail asymmetry; mean, median and mode are three centres.")],
    "02_DataScience/04_Correlation": [("-1 ≤ r ≤ +1", "r is Pearson correlation; its sign gives direction and its magnitude gives linear strength.")],
    "02_DataScience/05_Central_Limit_Theorem": [("x̄ = Σxᵢ / n", "x̄ is one sample mean; xᵢ are sampled values; n is the sample size.")],
    "02_DataScience/06_Hypothesis_Testing_Basics": [("p ≤ α → reject H₀\np > α → fail to reject H₀", "p measures surprise under H₀; α is the pre-chosen cutoff; H₀ is the no-effect claim.")],
    "02_DataScience/07_Z_Test": [("z = (x̄ - μ) / (σ / √n) = 2.31", "x̄=169.5 is the sample mean; μ=168 the claimed mean; σ=3.9 the known population SD; n=36.")],
    "02_DataScience/08_T_Test": [("t = (x̄ - μ) / (S / √n) = -2", "x̄=148 is the sample mean; μ=150 the claim; S=5 the sample SD; n=25."), ("df = n - 1 = 24\n-2 < -1.711 → reject H₀", "df is degrees of freedom; -1.711 is the left-tail critical value; H₀ is the 150 g claim.")],
    "02_DataScience/09_Paired_T_Test": [("t = d̄ / (S_d / √n) = 12.704", "d̄ is the mean paired difference; S_d is its sample SD; n=20 matched employees.")],
    "02_DataScience/10_Chi_Square_Test": [("χ² = Σ(Oᵢ - Eᵢ)² / Eᵢ = 5.1", "Oᵢ is one observed count; Eᵢ=20 is its fair-die expectation; Σ adds six terms.")],
    "02_DataScience/11_Z_Test_vs_T_Test": [("z = (x̄ - μ)/(σ/√n)\nt = (x̄ - μ)/(S/√n)\nBARzBAR = BARtBAR = 2 here", "x̄ is sample mean; μ the claim; n sample size; σ is known population SD; S is estimated sample SD; the vertical bars mean absolute magnitude.")],
    "03_Math/01_Algebra": [("P = 5c - 200", "P is daily profit; c is cups sold; 5 is profit per cup; 200 is fixed setup cost.")],
    "03_Math/02_Statistics": [("x̄ = Σxᵢ / n", "x̄ is the mean; xᵢ are scores; n is the score count."), ("σ² = Σ(xᵢ - x̄)² / n\nσ = √σ²", "σ² is variance; σ is standard deviation; xᵢ is one score; x̄ is mean; n is count; Σ adds all squared gaps."), ("z = (x - μ) / σ", "z is standardized distance; x is one score; μ is league mean; σ is league standard deviation.")],
    "03_Math/03_Linear_Algebra": [("matrix (5,4) × weights (4,) → scores (5,)", "5 is stalls; 4 is metrics; weights gives one value per metric; scores gives one value per stall."), ("a · b = Σ aᵢbᵢ", "a and b are equal-length vectors; i selects matching positions; Σ adds the products.")],
    "03_Math/04_Calculus": [("slope = Δy / Δx = 1000 / 2 = 500", "Δy is the change in savings; Δx is the change in months; slope is the average rate."), ("new θ = old θ - η(dJ/dθ)", "θ is the parameter; η is learning rate; J is cost; dJ/dθ is the local slope.")],
    "03_Math/05_Linear_Regression_From_Scratch": [("ŷ = wx + b", "ŷ is predicted bill; x is AC hours; w is rate per hour; b is the fixed starting bill."), ("J = (1/n) Σ(yᵢ - ŷᵢ)²", "J is mean squared cost; yᵢ is actual bill; ŷᵢ predicted bill; n is month count."), ("w_new = w_old - η(∂J/∂w)", "w is slope; η is learning rate; J is cost; the derivative gives uphill direction.")],
    "04_ML/01_What_Is_ML": [("examples + answers → learning algorithm → model", "examples are training inputs; answers are targets; the algorithm fits; the model stores the learned pattern."), ("new features → trained model → prediction", "features describe a new case; the trained model applies its learned pattern; prediction is the output.")],
    "04_ML/02_Types_Of_Variables": [("numeric ≠ categorical", "numeric values support meaningful arithmetic; categorical values name groups, even when written as digits.")],
    "04_ML/03_Data_Collection": [("question → population → sample → measurements", "question defines the decision; population is everyone of interest; sample is observed; measurements become data.")],
    "04_ML/04_Data_Cleaning": [("raw rows → profile → clean → validate", "raw rows are untouched input; profile finds defects; clean applies decisions; validate proves the result."), ("clean_text = text.strip().lower()", "text is the original category; strip removes edge spaces; lower makes case consistent.")],
    "04_ML/05_Missing_Values": [("missing % = missing count / row count × 100", "missing count is NaN cells in one column; row count is all records; the result is a percentage."), ("filled value = median(training column)", "median is the middle training value; the training column supplies the estimate; test rows do not."), ("fit(train) → transform(train, test)", "fit learns imputation values from train; transform applies them without learning from test.")],
    "04_ML/06_Categorical_Encoding": [("city → Delhi, Mumbai, Chennai columns", "city is nominal; each new column is a yes/no indicator with no invented ranking."), ("target label → one class number", "target label is the answer column; the number is an ID, not a measurable distance."), ("Low < Medium < High → 0 < 1 < 2", "the words have real order; the integers preserve that order for the model.")],
    "04_ML/08_Feature_Scaling": [("z = (x - μ) / σ", "x is one value; μ is training mean; σ is training standard deviation; z is standardized value."), ("x_scaled = (x - min) / (max - min)", "x is one value; min and max come from training data; x_scaled usually lies from 0 to 1.")],
    "04_ML/09_Duplicates_And_Dtypes": [("duplicates = df.duplicated()", "df is the table; duplicated marks repeated rows after the first copy."), ("price = pd.to_numeric(price, errors='coerce')", "price starts as text; conversion returns numbers; invalid text becomes missing for review.")],
    "04_ML/10_Function_Transformer": [("x_new = log(1 + x)", "x is the original non-negative value; 1 keeps zero valid; x_new compresses the right tail.")],
    "04_ML/11_Feature_Selection": [("keep feature if variance > threshold", "variance measures change in one feature; threshold is the minimum useful spread."), ("best subset = argmax validation score", "subset is a candidate feature set; validation score measures unseen performance; argmax picks the highest."), ("selected = features with non-zero importance", "importance comes from the fitted model; selected features retain model-supported signal.")],
    "04_ML/13_Train_Test_Split": [("X_train, X_test, y_train, y_test", "X holds features; y holds targets; train fits the model; test gives an unseen exam."), ("fit(X_train, y_train) → score(X_test, y_test)", "fit learns only from training rows; score compares predictions with hidden test targets.")],
    "04_ML/14_Synthetic_Datasets": [("X, y = make_regression(..., noise=chosen)", "X contains generated features; y follows a known regression rule; noise controls scatter."), ("X, y = make_classification(...) or make_blobs(...)", "X contains generated coordinates; y contains known class or cluster labels.")],
    "04_ML/15_EDA_Uni_Bi_Multivariate": [("one column → univariate\ntwo columns → bivariate\nmany columns → multivariate", "the column count names the view; every view answers a different question.")],
    "04_ML/16_Linear_Regression": [("ŷ = mx + c", "ŷ is predicted package; x is CGPA; m is slope; c is intercept."), ("m = 0.581766\nc = -1.171826", "m is the learned package change per CGPA point; c sets the line height at x=0."), ("residual = actual y - predicted ŷ", "actual y is the observed package; predicted ŷ comes from the line; residual is the vertical gap.")],
    "04_ML/17_Multiple_Linear_Regression": [("ŷ = b₀ + b₁x₁ + b₂x₂ + ... + bₚxₚ", "ŷ is prediction; b₀ is intercept; each bⱼ is one coefficient; xⱼ is its feature; p is feature count."), ("bⱼ = change in ŷ for +1 in xⱼ, holding others fixed", "bⱼ is one learned coefficient; ŷ is prediction; other inputs stay unchanged.")],
    "04_ML/18_Polynomial_Regression": [("ŷ = b₀ + b₁x + b₂x²", "ŷ is prediction; x is input; b₀ is intercept; b₁ and b₂ weight the linear and squared features."), ("degree 1 → line; degree 2 → one bend; degree 15 → very flexible", "degree is the highest power; flexibility is the range of shapes the model can fit."), ("choose degree by validation performance", "degree is the candidate complexity; validation performance estimates behaviour on unseen rows.")],
    "04_ML/19_Ridge_Regression": [("J_ridge = MSE + αΣbⱼ²", "J_ridge is penalized cost; MSE is fit error; α controls penalty strength; bⱼ are coefficients.")],
    "04_ML/20_Lasso_Regression": [("J_lasso = MSE + αΣ abs(bⱼ)", "J_lasso is penalized cost; MSE is fit error; α controls strength; abs(bⱼ) is coefficient magnitude.")],
    "04_ML/21_ElasticNet": [("J = MSE + α[rΣabs(bⱼ) + (1-r)Σbⱼ²]", "J is cost; α sets total penalty; r is l1_ratio; bⱼ are coefficients; MSE is fit error.")],
    "04_ML/23_Cross_Validation": [("CV score = (s₁ + s₂ + ... + sₖ) / k", "sᵢ is the score from fold i; k is fold count; CV score is their mean.")],
    "04_ML/31_Clustering_KMeans": [("assign xᵢ to nearest μⱼ\nμⱼ = mean of assigned points", "xᵢ is one customer; μⱼ is centroid j; distance decides assignment; the mean moves the centroid.")],
    "04_ML/32_Hierarchical_Clustering": [("distance → nearest merge → updated clusters", "distance compares current groups; nearest merge joins two; updated clusters continue the hierarchy.")],
    "04_ML/35_Project_Employee_Attrition": [("split → preprocess → fit → evaluate", "split protects test rows; preprocess handles columns; fit learns attrition; evaluate checks unseen employees."), ("employee row → fitted pipeline → attrition risk", "employee row supplies raw features; fitted pipeline repeats training transforms; risk is the prediction.")],
}


TITLE_OVERRIDES = {
    "01_Python/02_NumPy": "NumPy", "01_Python/03_Pandas": "Pandas",
    "01_Python/04_Matplotlib": "Matplotlib", "01_Python/05_Seaborn": "Seaborn",
    "01_Python/06_Plotly": "Plotly", "01_Python/07_Streamlit": "Streamlit",
    "02_DataScience/02_IQR": "IQR", "02_DataScience/07_Z_Test": "Z-Test",
    "02_DataScience/08_T_Test": "T-Test", "02_DataScience/10_Chi_Square_Test": "Chi-Square Test",
    "04_ML/15_EDA_Uni_Bi_Multivariate": "EDA: Uni, Bi & Multivariate",
    "04_ML/31_Clustering_KMeans": "K-Means Clustering",
}


SOURCE_FILES = {
    "01_Python/02_NumPy": {"README.md"},
    "01_Python/03_Pandas": {"README.md"},
    "01_Python/04_Matplotlib": {"README.md"},
    "01_Python/05_Seaborn": {"README.md"},
    "01_Python/06_Plotly": {"README.md", "concept_3d_projection.md"},
    "01_Python/07_Streamlit": {"README.md", "sales_analysis_explained.md"},
    "01_Python/08_Iris_Visual_Explorer": {"iris_dataset_explained.ipynb", "iris_exploration.ipynb"},
    "02_DataScience/08_T_Test": {"09_Hypothesis_Testing_T-Test.ipynb"},
    "02_DataScience/10_Chi_Square_Test": {"15_Hypothesis_Testing_Chi_Square_Test.ipynb"},
    "03_Math/04_Calculus": {"01_02_slope_and_derivative.md", "03_gradient_descent.md"},
    "03_Math/05_Linear_Regression_From_Scratch": {"05_derivative_inside_gradient_descent.md", "06_messy_data_gradient_descent.md"},
    "04_ML/05_Missing_Values": {"06_Dropping_Missing_Values.MD", "07_Filling_Missing_Values.MD", "08_Finding_Missing_Values_Scikit_Learning.ipynb"},
    "04_ML/16_Linear_Regression": {"25_Simple_Linear_Regression.MD", "26_Simple_Linear_Regression.ipynb"},
}


class BlockParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack: list[str] = []
        self.buffer: list[str] = []
        self.blocks: list[tuple[str, str]] = []

    def handle_starttag(self, tag, attrs):
        if tag in {"h1", "h2", "h3", "p", "li"}:
            self.stack.append(tag)
            self.buffer = []

    def handle_data(self, data):
        if self.stack:
            self.buffer.append(data)

    def handle_endtag(self, tag):
        if self.stack and self.stack[-1] == tag:
            text = re.sub(r"\s+", " ", " ".join(self.buffer)).strip()
            if text:
                self.blocks.append((tag, text))
            self.stack.pop()
            self.buffer = []


def topic_title(topic: str) -> str:
    if topic in TITLE_OVERRIDES:
        return TITLE_OVERRIDES[topic]
    slug = topic.split("/")[-1]
    return re.sub(r"^\d+_", "", slug).replace("_", " ")


def plain_story(topic: str) -> str:
    if topic in CUSTOM_STORIES:
        return CUSTOM_STORIES[topic]
    value = STORIES.get(topic, "")
    if isinstance(value, dict):
        value = value.get("story") or value.get("text") or list(value.values())
    if isinstance(value, list):
        value = " ".join(str(x) for x in value)
    parser = BlockParser()
    parser.feed(f"<p>{value}</p>")
    if parser.blocks:
        return parser.blocks[0][1]
    return re.sub(r"<[^>]+>", " ", str(value)).strip()


def source_markdown(topic_dir: Path) -> list[str]:
    chunks: list[str] = []
    topic = topic_dir.relative_to(ROOT).as_posix()
    selected = SOURCE_FILES.get(topic)
    for path in sorted((topic_dir / "Concept").iterdir()):
        if not path.is_file():
            continue
        raw = path.read_text(encoding="utf-8", errors="ignore")
        if selected is not None and path.name not in selected:
            continue
        if path.suffix.lower() == ".ipynb":
            try:
                notebook = json.loads(raw)
            except json.JSONDecodeError:
                continue
            for cell in notebook.get("cells", []):
                if cell.get("cell_type") == "markdown":
                    chunks.append("".join(cell.get("source", [])))
        elif path.suffix.lower() == ".md":
            chunks.append(raw)
    return chunks


BAD_HEADING = re.compile(r"(?:faq|practice|exercise|interview|coming up|source|file|cell\s*\d|story|example|recap|summary|my understanding|in my own words|contents?|readme|project\s*\d|track:|zoom in|toolbox|roadmap|^q(?:uestion)?\s*\d)", re.I)
BAD_TEXT = re.compile(r"(?:\.ipynb|\.md\b|\.py\b|\.csv\b|\.json\b|\.html\b|\.png\b|\.jpg\b|\.svg\b|\.gif\b|\.pdf\b|\.txt\b|\.xlsx\b|\.tsv\b|\.pkl\b|\.joblib\b|\.zip\b|/Content/|/Concept/|\.\./|this notebook|this file|cell\s*\d|click here|open the|readme|AI_ML_Series|project\s*\d|track:|sub-skill|curriculum|the course|the slide|this diagram|read it as)", re.I)
BAD_START = re.compile(r"^(?:this|that|these|those|it|they|here|so|but|and|because|unlike|to do that|after seeing|once you|then)\b", re.I)


def clean_sentence(text: str) -> str:
    text = re.sub(r"\[[^\]]+\]\([^\)]+\)", "", text)
    text = text.replace("findout", "find out").replace("Nagative", "Negative").replace("Duploicate", "Duplicate")
    text = text.replace("— —", "—").replace("->", "→")
    text = re.sub(r"\s+", " ", text).strip(" -–—")
    if text and text[-1] not in ".?!:;":
        text += "."
    return text


def extract_groups(topic_dir: Path) -> list[tuple[str, list[str]]]:
    markdown = mistune.create_markdown()
    groups: list[tuple[str, list[str]]] = []
    current = ""
    seen: set[str] = set()
    for chunk in source_markdown(topic_dir):
        parser = BlockParser()
        parser.feed(markdown(chunk))
        for tag, raw in parser.blocks:
            raw = clean_sentence(raw)
            if tag in {"h1", "h2", "h3"}:
                heading = raw.rstrip(".:")
                if 3 <= len(heading) <= 56 and not BAD_HEADING.search(heading) and not BAD_TEXT.search(heading):
                    current = heading
                else:
                    current = ""
                continue
            if not current or BAD_HEADING.search(current) or BAD_TEXT.search(raw):
                continue
            sentences = re.split(r"(?<=[.!?])\s+(?=[A-Z0-9₹$])", raw)
            for sentence in sentences:
                sentence = clean_sentence(sentence)
                norm = re.sub(r"[^a-z0-9]+", " ", sentence.lower()).strip()
                if not (38 <= len(sentence) <= 230) or len(norm.split()) < 7 or sentence.endswith((":", ";")):
                    continue
                if BAD_TEXT.search(sentence) or BAD_START.search(sentence) or norm in seen or any(mark in sentence for mark in ("$", "\\", "|", "```", "---")):
                    continue
                if sentence.count("`") or sentence.count("#") or sentence.count("*"):
                    continue
                seen.add(norm)
                if groups and groups[-1][0] == current and len(groups[-1][1]) < 3:
                    groups[-1][1].append(sentence)
                else:
                    groups.append((current, [sentence]))
    return groups


CUSTOM_FACTS = {
    "03_Math/01_Algebra": [
        ("Read the expression", ["In P = 5c - 200, c changes with cups sold, 5 multiplies every cup, and 200 stays fixed for the day.", "P is the output left after the variable and constant parts combine."]),
        ("Substitute carefully", ["At c = 60, the expression gives 5 × 60 - 200 = 100, so the stall earns ₹100.", "Substitution replaces the symbol and leaves the operation order unchanged."]),
        ("Solve backwards", ["Break-even means P = 0, so 0 = 5c - 200 leads to 200 = 5c and c = 40.", "Adding 200 and dividing by 5 undo the original operations in reverse order."]),
        ("Function view", ["A function accepts one input, follows its rule, and returns one output.", "The line y = wx + b uses x as input, w as its rate and b as its starting value."]),
        ("Read the graph", ["A first power such as x gives a straight line, while x² and x³ create curved shapes.", "The constant b is the point where the graph meets the vertical axis."]),
    ],
    "01_Python/10_Pizza_Dashboard_Lab": [
        ("The mismatch risk", ["Two independent indexes can drift apart and silently attach the wrong score to a name.", "A pair should be created once and then unpacked together."]),
        ("What zip returns", ["zip walks the input lists in parallel and emits one tuple for each matching position.", "The loop can unpack that tuple directly into name and score."]),
        ("The verified pairs", ["The three outputs are Alice with 95, Bob with 82, and Charlie with 78.", "Each result preserves the order already present in both lists."]),
        ("Length warning", ["zip stops when the shortest input is exhausted, so unequal list lengths deserve a check before pairing.", "Matching lengths make the intended one-to-one relationship explicit."]),
    ],
    "02_DataScience/02_IQR": [
        ("The middle half", ["Q1 marks the point below which one quarter of the values fall, while Q3 marks three quarters.", "Their difference ignores how far the most extreme endpoints wander."]),
        ("Age calculation", ["For Age, Q1 is 22.75 and Q3 is 35, so the IQR is 12.25 years.", "The median is 29.186 after the missing ages are filled with the mean."]),
        ("Outlier fences", ["The usual lower fence is Q1 minus 1.5 times IQR; the upper fence is Q3 plus 1.5 times IQR.", "A flagged point is a reason to investigate, not an automatic command to delete."]),
        ("Box-plot reading", ["The box runs from Q1 to Q3 and the line inside marks the median.", "Whiskers reach the most extreme values still inside the fences; points beyond are drawn separately."]),
    ],
    "02_DataScience/03_Skewness": [
        ("Read the tail", ["Positive skew means the longer tail points right; negative skew means it points left.", "The sign names the tail direction, not where most observations sit."]),
        ("Three centres", ["Extreme values pull the mean more strongly than they move the median.", "When mean, median and mode meet near one value, the distribution is close to symmetric."]),
        ("Passenger ages", ["Passenger Age has skew about 0.274, so its right skew is mild rather than dramatic.", "Its mean 29.186 sits just above median 29, consistent with that small positive tail."]),
        ("Model choice", ["A histogram shows the shape that one skew number compresses into a summary.", "For a strongly skewed feature, a median can describe the centre more safely than a mean."]),
    ],
    "02_DataScience/04_Correlation": [
        ("Direction and strength", ["A positive coefficient means two numeric variables tend to rise together; a negative one means one tends to fall as the other rises.", "A value near zero reports little linear movement together."]),
        ("Restaurant evidence", ["Total bill and tip have r = 0.847, the strongest pair in the three-column matrix.", "Party size and tip have r = 0.652, still positive but weaker."]),
        ("Heatmap reading", ["The diagonal is always 1 because every column is perfectly correlated with itself.", "Mirrored cells repeat the same pair, so one triangle contains all unique comparisons."]),
        ("Important limit", ["Correlation measures linear association and does not prove that changing one variable causes the other to change.", "A hidden variable or the sampling process can influence both."]),
    ],
}


CUSTOM_PAGE_FACTS = {
    ("03_Math/02_Statistics", 1): [
        ("Same average, different seasons", ["Player A and Player B both total 250 runs across five matches, so each mean is 50.", "The tie says nothing yet about how dependable either player was."]),
        ("Player A's centre", ["The ordered scores 48, 49, 50, 51 and 52 have median 50.", "Every score stays close to that centre."]),
        ("Player B's centre", ["The ordered scores 5, 10, 50, 90 and 95 also have median 50.", "The same middle value hides a much wider season."]),
        ("Mean in plain English", ["Add every score and divide by the number of matches.", "A large extreme can pull this balance point toward itself."]),
        ("Median in plain English", ["Sort the scores and take the middle position.", "Its value depends on order, not on how extreme the endpoints are."]),
        ("Mode in plain English", ["The mode is the value that appears most often.", "Neither five-match list has a mode because no score repeats."]),
        ("Why centre is not enough", ["Two datasets can share mean and median while their individual values behave very differently.", "Coach Riya needs a spread measure before choosing the reliable player."]),
        ("Choose the centre deliberately", ["Use the mean when every value should influence the balance point.", "Use the median when extreme values would distort the story."]),
        ("Story calculation", ["For either player, 250 divided by 5 equals 50 runs.", "The next page keeps that same centre and measures every distance around it."]),
    ],
    ("03_Math/02_Statistics", 2): [
        ("Distances for Player A", ["Relative to mean 50, Player A's gaps are -2, +2, -1, +1 and 0.", "Squaring gives 4, 4, 1, 1 and 0."]),
        ("Player A variance", ["The squared gaps total 10, and 10 divided by 5 gives variance 2.", "Small variance matches the tight score pattern."]),
        ("Distances for Player B", ["Relative to 50, Player B's gaps are -40, +40, -45, +45 and 0.", "Their squares are 1600, 1600, 2025, 2025 and 0."]),
        ("Player B variance", ["The squared gaps total 7250, and 7250 divided by 5 gives variance 1450.", "The large value exposes the wild season hidden by the mean."]),
        ("Why square the gaps?", ["Positive and negative distances would cancel if they were simply added.", "Squaring makes every distance positive and gives larger misses more influence."]),
        ("Return to runs", ["Variance uses runs squared, so its units are difficult to read directly.", "Taking the square root returns the spread to runs."]),
        ("Standard deviation result", ["Player A's standard deviation is √2 = 1.41 runs.", "Player B's is √1450 = 38.08 runs."]),
        ("The coaching decision", ["A typical Player A score sits only about 1.41 runs from 50, while Player B wanders about 38.08.", "Riya can now defend the choice of Player A as the consistent scorer."]),
        ("Spread memory line", ["Variance averages squared distances from the mean; standard deviation is its square root.", "Same centre plus different spread means different risk."]),
    ],
    ("03_Math/02_Statistics", 3): [
        ("From scores to probability", ["Probability is a number from 0 to 1 describing how likely an event is.", "Zero means impossible, one means certain, and 0.5 means an even chance."]),
        ("A league reference curve", ["Suppose league scores form a bell curve with mean 50 and standard deviation 10.", "The centre matches Riya's two players, so distance can be expressed in standard deviations."]),
        ("The first bell band", ["About 68% of values lie from one standard deviation below to one above the mean.", "Here that central band runs from 40 to 60."]),
        ("The second bell band", ["About 95% lie within two standard deviations of the mean.", "For this league, the interval is 30 to 70."]),
        ("The third bell band", ["About 99.7% lie within three standard deviations.", "Scores below 20 or above 80 are therefore rare under this model."]),
        ("Z-score meaning", ["A Z-score counts how many standard deviations a value sits above or below the mean.", "Its sign gives direction and its magnitude gives distance."]),
        ("Read Player B's extremes", ["A score of 90 has Z = (90 - 50) / 10 = +4.", "A score of 10 has Z = (10 - 50) / 10 = -4."]),
        ("Why the extremes matter", ["Both of those scores sit four standard deviations from the league mean.", "Their rarity supports the same warning already shown by Player B's large spread."]),
        ("Story resolved", ["Centre said the players tied; spread and standardized distance revealed very different reliability.", "Statistics is the chain from description to a decision that states its uncertainty."]),
    ],
    ("02_DataScience/10_Chi_Square_Test", 1): [
        ("Observed counts", ["The six observed face counts are 22, 17, 20, 26, 22 and 13.", "Together they account for all 120 rolls."]),
        ("Expected counts", ["A fair die gives each of six faces the same expected count: 120 divided by 6 equals 20.", "Those expectations come from the null hypothesis."]),
        ("One face at a time", ["For each face, subtract expected from observed, square the gap, then divide by the expected count.", "Scaling by expectation makes the six deviations comparable."]),
        ("Combine the evidence", ["Adding the six scaled squared gaps gives chi-square 5.1.", "Because every term is non-negative, only a large right-tail value argues against fairness."]),
        ("Degrees of freedom", ["With six categories whose counts must total 120, only five counts are free to vary.", "The sixth is forced, so df = 6 - 1 = 5."]),
        ("Critical boundary", ["At alpha 0.05 with df 5, the right-tail critical value is about 11.07.", "A statistic at or above that boundary would reject the fair-die claim."]),
        ("Decision", ["The observed statistic 5.1 is below 11.07, so it remains in the fail-to-reject region.", "The uneven counts are still plausible random variation from a fair die."]),
        ("P-value check", ["The p-value is about 0.404, which is larger than alpha 0.05.", "That route gives the same fail-to-reject decision."]),
        ("Careful conclusion", ["The result does not prove the die is fair.", "It says these 120 rolls do not provide enough evidence to call it biased."]),
    ],
    ("03_Math/04_Calculus", 1): [
        ("Two points from Raju's savings", ["Month 1 is point (1, 1000) and month 3 is point (3, 2000).", "Each point keeps time and savings together."]),
        ("Find the rise", ["Savings rose by 2000 - 1000 = ₹1000.", "Rise measures the change in the vertical outcome."]),
        ("Find the run", ["Time moved by 3 - 1 = 2 months.", "Run counts the gap between positions, not the number of labels touched."]),
        ("Average slope", ["Rise divided by run gives 1000 / 2 = ₹500 per month.", "That rate describes the whole interval from month 1 to month 3."]),
        ("Why a derivative is needed", ["An interval slope cannot tell Raju the exact saving rate at one instant.", "The gap between the two comparison points must shrink."]),
        ("Zoom toward one point", ["As the left and right points approach the chosen moment, their secant line approaches a tangent.", "The limiting slope is the derivative at that point."]),
        ("Delta and d", ["Delta describes a real measurable change between two points.", "The d notation describes an infinitesimally small change used for a local rate."]),
        ("Slope versus derivative", ["Slope across two points is an average rate; a derivative at one point is an instantaneous rate.", "Both compare change in y with change in x."]),
        ("Story hand-off", ["Raju now knows how to read the local direction of a curve.", "Page 2 uses that same tool to move a model toward lower cost."]),
    ],
    ("03_Math/04_Calculus", 2): [
        ("Turn error into a landscape", ["A model's cost assigns one height to every candidate parameter value.", "Lower ground means the model's predictions fit the observed data better."]),
        ("Feel the local slope", ["The derivative reports which way cost rises at the current parameter.", "Gradient descent moves in the opposite direction."]),
        ("Negative derivative", ["A negative derivative means cost falls as the parameter increases.", "Subtracting that negative slope moves the parameter upward."]),
        ("Positive derivative", ["A positive derivative means cost rises as the parameter increases.", "The update subtracts it and moves the parameter downward."]),
        ("Near the bottom", ["As the curve flattens, the derivative approaches zero.", "Updates become small because there is little downhill direction left."]),
        ("Learning rate", ["The learning rate multiplies the derivative and controls step size.", "Too large can jump across the bottom; too small can make progress painfully slow."]),
        ("One full update", ["Read the current parameter, calculate cost, find its derivative, and apply the update.", "Then repeat with the new parameter."]),
        ("Stopping", ["Training can stop when the derivative is close enough to zero or cost no longer improves meaningfully.", "Real data rarely produces a perfectly zero derivative."]),
        ("Raju's memory line", ["A derivative is the ground under one foot; gradient descent is the full walk downhill.", "The local tool guides every step of the larger process."]),
    ],
}


def pipe_safe(text: str) -> str:
    escaped = html.escape(text, quote=True)
    escaped = escaped.replace("BAR", "\x00").replace("|", "\x00")
    escaped = escaped.replace("\x00", '<span class="pipe">|</span>')
    return escaped.replace("\n", "<br>")


def wrap_svg_text(text: str, x: int, y: int, width: int = 15, size: int = 13, weight: int = 700, fill: str = "#122b55") -> str:
    lines = textwrap.wrap(text, width=width, break_long_words=False, break_on_hyphens=False) or [text]
    lines = lines[:3]
    start = y - (len(lines) - 1) * 8
    tspans = "".join(
        f'<tspan x="{x}" y="{start + i * 16}">{html.escape(line)}</tspan>' for i, line in enumerate(lines)
    )
    return f'<text text-anchor="middle" font-family="Noteworthy, sans-serif" font-size="{size}" font-weight="{weight}" fill="{fill}">{tspans}</text>'


def flow_svg(labels: list[str], caption: str) -> str:
    labels = (labels + ["check", "decide", "explain"])[:3]
    boxes = []
    for i, (x, colour) in enumerate(((14, "#dff0ff"), (157, "#e7f7df"), (300, "#fff0f4"))):
        boxes.append(f'<rect x="{x}" y="46" width="126" height="70" rx="12" fill="{colour}" stroke="#173a70" stroke-width="2"/>')
        boxes.append(wrap_svg_text(labels[i], x + 63, 82, width=15, size=14))
    return f'''<svg viewBox="0 0 440 180" role="img" aria-label="{html.escape(caption)}">
      <defs><marker id="arr" markerWidth="9" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#2878bb"/></marker></defs>
      {''.join(boxes)}
      <path d="M140 81 H151" stroke="#2878bb" stroke-width="3" marker-end="url(#arr)"/>
      <path d="M283 81 H294" stroke="#2878bb" stroke-width="3" marker-end="url(#arr)"/>
      {wrap_svg_text(caption, 220, 151, width=48, size=13, weight=600, fill="#285a46")}
    </svg>'''


def specific_svg(kind: str, labels: list[str], caption: str) -> str:
    if kind == "array":
        cells = "".join(f'<rect x="{42+i*58}" y="55" width="48" height="44" rx="6" fill="#dff0ff" stroke="#173a70"/><text x="{66+i*58}" y="83" text-anchor="middle" font-size="15" fill="#122b55">{v}</text>' for i, v in enumerate([5, 12, 8, 20, 3, 14]))
        return f'<svg viewBox="0 0 440 180" role="img" aria-label="labelled NumPy array"><text x="42" y="34" font-size="13" fill="#285a46">one type • one contiguous block • vector math</text>{cells}<path d="M42 119 H380" stroke="#ec5c78" stroke-width="3"/><text x="211" y="143" text-anchor="middle" font-size="13" fill="#122b55">axis 0 moves across rows; shape records dimensions</text></svg>'
    if kind == "table":
        return '''<svg viewBox="0 0 440 180" role="img" aria-label="labelled DataFrame grouping flow"><g stroke="#173a70" fill="#f7fbff"><rect x="18" y="35" width="215" height="105" rx="8"/><path d="M18 66H233M18 95H233M88 35V140M160 35V140"/></g><g font-size="12" text-anchor="middle" fill="#122b55"><text x="53" y="56">city</text><text x="124" y="56">qty</text><text x="196" y="56">price</text><text x="53" y="86">Delhi</text><text x="124" y="86">2</text><text x="196" y="86">₹30</text><text x="53" y="116">Mumbai</text><text x="124" y="116">3</text><text x="196" y="116">₹20</text></g><path d="M245 88H286" stroke="#2878bb" stroke-width="3" marker-end="url(#arr)"/><rect x="294" y="48" width="126" height="82" rx="10" fill="#e7f7df" stroke="#238a57"/><text x="357" y="73" text-anchor="middle" font-size="13" fill="#285a46">group by city</text><text x="357" y="97" text-anchor="middle" font-size="13" fill="#285a46">sum revenue</text><text x="357" y="120" text-anchor="middle" font-size="12" fill="#122b55">named answer</text></svg>'''
    if kind in {"chart", "line", "regression", "slope"}:
        extra = '<line x1="110" y1="119" x2="160" y2="82" stroke="#ec5c78" stroke-width="2"/><line x1="160" y1="119" x2="160" y2="82" stroke="#238a57" stroke-dasharray="5 4"/><text x="177" y="103" font-size="11" fill="#285a46">residual</text>' if kind == "regression" else ''
        return f'''<svg viewBox="0 0 440 180" role="img" aria-label="labelled line and axes"><path d="M48 20V145H414" fill="none" stroke="#122b55" stroke-width="2"/><text x="231" y="171" text-anchor="middle" font-size="12" fill="#122b55">input x</text><text x="16" y="83" text-anchor="middle" transform="rotate(-90 16 83)" font-size="12" fill="#122b55">outcome y</text><path d="M70 130 L378 40" fill="none" stroke="#2878bb" stroke-width="4"/><circle cx="110" cy="119" r="5" fill="#ec5c78"/><circle cx="160" cy="82" r="5" fill="#ec5c78"/><circle cx="245" cy="84" r="5" fill="#ec5c78"/><circle cx="320" cy="49" r="5" fill="#ec5c78"/>{extra}<text x="316" y="34" font-size="12" fill="#285a46">fitted / observed trend</text><path d="M110 119H160V82" fill="none" stroke="#238a57" stroke-width="2" stroke-dasharray="5 4"/><text x="136" y="137" font-size="11" fill="#285a46">run</text><text x="168" y="104" font-size="11" fill="#285a46">rise</text></svg>'''
    if kind in {"boxplot", "iqr"}:
        return '''<svg viewBox="0 0 440 180" role="img" aria-label="fully labelled box plot"><line x1="45" y1="90" x2="397" y2="90" stroke="#173a70" stroke-width="3"/><line x1="72" y1="68" x2="72" y2="112" stroke="#173a70" stroke-width="3"/><line x1="360" y1="68" x2="360" y2="112" stroke="#173a70" stroke-width="3"/><rect x="130" y="54" width="165" height="72" fill="#dff0ff" stroke="#2878bb" stroke-width="3"/><line x1="210" y1="54" x2="210" y2="126" stroke="#ec5c78" stroke-width="4"/><circle cx="402" cy="90" r="6" fill="#ec5c78"/><g text-anchor="middle" font-size="12" fill="#122b55"><text x="72" y="137">lower whisker</text><text x="130" y="46">Q1</text><text x="210" y="46">median</text><text x="295" y="46">Q3</text><text x="360" y="137">upper whisker</text><text x="402" y="72">outlier</text></g><path d="M130 151H295" stroke="#238a57" stroke-width="3" marker-start="url(#arr)" marker-end="url(#arr)"/><text x="212" y="171" text-anchor="middle" font-size="12" fill="#285a46">IQR = middle 50%</text></svg>'''
    if kind in {"clusters", "correlation"}:
        pts = []
        for colour, cx, cy in (("#2878bb", 100, 112), ("#238a57", 225, 58), ("#ec5c78", 338, 116)):
            for dx, dy in ((-24,-9),(-13,15),(2,-17),(18,8),(27,-13),(7,22)):
                pts.append(f'<circle cx="{cx+dx}" cy="{cy+dy}" r="5" fill="{colour}" opacity=".78"/>')
            pts.append(f'<path d="M{cx-8} {cy}H{cx+8}M{cx} {cy-8}V{cy+8}" stroke="#122b55" stroke-width="3"/>')
        return f'<svg viewBox="0 0 440 180" role="img" aria-label="three labelled groups"><path d="M35 18V150H420" fill="none" stroke="#122b55" stroke-width="2"/>{"".join(pts)}<g font-size="12" text-anchor="middle" fill="#122b55"><text x="100" y="151">group A</text><text x="225" y="28">group B</text><text x="338" y="151">group C</text></g><text x="220" y="174" text-anchor="middle" font-size="12" fill="#285a46">cross = centre • distance controls grouping or association</text></svg>'
    if kind == "spread":
        return '''<svg viewBox="0 0 440 180" role="img" aria-label="same mean different spread"><line x1="45" y1="60" x2="410" y2="60" stroke="#173a70" stroke-width="2"/><line x1="45" y1="126" x2="410" y2="126" stroke="#173a70" stroke-width="2"/><g fill="#2878bb"><circle cx="195" cy="60" r="7"/><circle cx="212" cy="60" r="7"/><circle cx="228" cy="60" r="7"/><circle cx="245" cy="60" r="7"/></g><g fill="#ec5c78"><circle cx="72" cy="126" r="7"/><circle cx="150" cy="126" r="7"/><circle cx="292" cy="126" r="7"/><circle cx="382" cy="126" r="7"/></g><path d="M220 32V148" stroke="#238a57" stroke-width="3" stroke-dasharray="6 4"/><g font-size="12" fill="#122b55"><text x="48" y="45">A: tight, consistent</text><text x="48" y="111">B: wide, variable</text><text x="230" y="25">same centre</text><text x="230" y="165">spread changes the decision</text></g></svg>'''
    if kind in {"skew", "transform", "curves"}:
        return '''<svg viewBox="0 0 440 180" role="img" aria-label="labelled distribution shapes"><path d="M35 145H420M52 145 C82 140 92 55 145 52 C210 48 211 126 390 143" fill="none" stroke="#2878bb" stroke-width="4"/><line x1="151" y1="46" x2="151" y2="145" stroke="#ec5c78" stroke-dasharray="6 4"/><text x="151" y="35" text-anchor="middle" font-size="12" fill="#122b55">centre / peak</text><path d="M285 128H382" stroke="#238a57" stroke-width="3" marker-end="url(#arr)"/><text x="333" y="118" text-anchor="middle" font-size="12" fill="#285a46">long right tail</text><text x="218" y="169" text-anchor="middle" font-size="12" fill="#122b55">value or model complexity →</text></svg>'''
    if kind in {"distribution", "decision"}:
        return '''<svg viewBox="0 0 440 180" role="img" aria-label="labelled test distribution"><path d="M32 142H415" stroke="#122b55" stroke-width="2"/><path d="M45 142 C95 141 120 124 155 75 C187 30 250 30 282 75 C317 124 342 141 400 142" fill="#dff0ff" stroke="#2878bb" stroke-width="3"/><path d="M45 142 C70 140 90 134 116 113 L116 142Z" fill="#ffdce3"/><path d="M329 113 C355 134 375 140 400 142 L400 142Z" fill="#ffdce3"/><line x1="116" y1="62" x2="116" y2="145" stroke="#ec5c78" stroke-width="2" stroke-dasharray="5 4"/><line x1="329" y1="62" x2="329" y2="145" stroke="#ec5c78" stroke-width="2" stroke-dasharray="5 4"/><text x="82" y="105" text-anchor="middle" font-size="11" fill="#a32643">reject</text><text x="222" y="96" text-anchor="middle" font-size="12" fill="#285a46">fail-to-reject region</text><text x="366" y="105" text-anchor="middle" font-size="11" fill="#a32643">reject</text><text x="116" y="54" text-anchor="middle" font-size="11" fill="#122b55">critical</text><text x="329" y="54" text-anchor="middle" font-size="11" fill="#122b55">critical</text></svg>'''
    if kind == "paired":
        return '''<svg viewBox="0 0 440 180" role="img" aria-label="labelled paired before and after plot"><line x1="125" y1="25" x2="125" y2="145" stroke="#173a70"/><line x1="315" y1="25" x2="315" y2="145" stroke="#173a70"/><g stroke="#238a57" stroke-width="3" opacity=".75"><path d="M125 126L315 92"/><path d="M125 105L315 72"/><path d="M125 87L315 54"/><path d="M125 139L315 112"/><path d="M125 67L315 38"/></g><g font-size="13" text-anchor="middle" fill="#122b55"><text x="125" y="166">Before: same people</text><text x="315" y="166">After: same people</text><text x="220" y="22">each line = one employee pair</text></g></svg>'''
    if kind == "bars":
        obs = [72, 58, 66, 86, 72, 46]
        bars = ''.join(f'<rect x="{48+i*58}" y="{140-h}" width="17" height="{h}" fill="#ec5c78"/><rect x="{66+i*58}" y="80" width="17" height="60" fill="#2878bb"/>' for i,h in enumerate(obs))
        return f'<svg viewBox="0 0 440 180" role="img" aria-label="observed versus expected counts"><path d="M35 22V141H420" fill="none" stroke="#122b55" stroke-width="2"/>{bars}<g font-size="11" text-anchor="middle" fill="#122b55">{"".join(f"<text x=\"{66+i*58}\" y=\"158\">face {i+1}</text>" for i in range(6))}</g><rect x="275" y="24" width="12" height="12" fill="#ec5c78"/><text x="292" y="34" font-size="11">observed</text><rect x="350" y="24" width="12" height="12" fill="#2878bb"/><text x="367" y="34" font-size="11">expected 20</text></svg>'
    if kind == "matrix":
        return '''<svg viewBox="0 0 440 180" role="img" aria-label="labelled matrix multiplication"><rect x="28" y="35" width="150" height="105" fill="#dff0ff" stroke="#173a70" rx="8"/><g stroke="#87add0"><path d="M28 61H178M28 87H178M28 113H178M65 35V140M103 35V140M140 35V140"/></g><text x="103" y="25" text-anchor="middle" font-size="12">data: rows × features</text><text x="199" y="91" text-anchor="middle" font-size="24">×</text><rect x="219" y="45" width="56" height="86" rx="8" fill="#e7f7df" stroke="#238a57"/><text x="247" y="25" text-anchor="middle" font-size="12">weights</text><path d="M294 88H329" stroke="#2878bb" stroke-width="3" marker-end="url(#arr)"/><rect x="340" y="48" width="64" height="82" rx="8" fill="#fff0f4" stroke="#ec5c78"/><text x="372" y="25" text-anchor="middle" font-size="12">scores</text><text x="218" y="163" text-anchor="middle" font-size="12" fill="#285a46">columns must match weight count</text></svg>'''
    if kind == "projection":
        return flow_svg(["3-D data point", "camera + projection", "2-D screen pixel"], "Depth becomes appearance, not a third screen coordinate")
    if kind == "rerun":
        return flow_svg(["widget changes", "script reruns", "UI rebuilt"], "cache_data saves reusable work; session_state saves durable state")
    if kind == "pairing":
        return flow_svg(["names list", "zip positions", "name, score pairs"], "Alice↔95 • Bob↔82 • Charlie↔78")
    if kind == "clt":
        return flow_svg(["non-normal population", "many sample means", "bell-shaped means"], "Repeat equal-size samples; plot their averages")
    if kind == "learning":
        return flow_svg(["labelled examples", "learn a pattern", "predict new case"], "Evaluation asks whether the learned pattern travels")
    if kind == "types":
        return flow_svg(["column meaning", "numeric or label", "valid operation"], "A digit can still be a category, such as a pin code")
    if kind == "sources":
        return flow_svg(["real question", "target population", "representative sample"], "Every source sees a different slice of reality")
    if kind in {"pipeline", "missing", "dedupe"}:
        return flow_svg(labels, caption)
    if kind == "encoding":
        return flow_svg(["category words", "choose order rule", "numeric columns"], "Nominal: separate indicators • ordinal: preserve real order")
    if kind == "scaling":
        return flow_svg(["training range", "learn scale values", "transform all rows"], "Fit the scaler on training rows only")
    if kind == "funnel":
        return flow_svg(["many columns", "remove weak signal", "validated subset"], "Selection earns its place on unseen data")
    if kind == "split":
        return flow_svg(["all labelled rows", "training pool", "hidden test pool"], "The test pool stays untouched until final scoring")
    if kind == "known":
        return flow_svg(["choose known rule", "generate data + noise", "recover the truth"], "Synthetic data separates code bugs from real-world uncertainty")
    if kind == "eda":
        return flow_svg(["one-variable shape", "two-variable link", "many-variable map"], "Every extra dimension should answer a named question")
    if kind == "coefficients":
        return '''<svg viewBox="0 0 440 180" role="img" aria-label="labelled coefficient shrinkage"><path d="M35 145H415M35 25V145" stroke="#122b55" stroke-width="2"/><g fill="#2878bb"><rect x="70" y="48" width="38" height="97"/><rect x="143" y="75" width="38" height="70"/><rect x="216" y="104" width="38" height="41"/><rect x="289" y="126" width="38" height="19"/></g><g fill="none" stroke="#ec5c78" stroke-width="3"><rect x="78" y="86" width="22" height="59"/><rect x="151" y="105" width="22" height="40"/><rect x="224" y="132" width="22" height="13"/><path d="M289 145H327"/></g><text x="220" y="18" text-anchor="middle" font-size="12">blue: original weights • red: penalized weights</text><text x="220" y="170" text-anchor="middle" font-size="12" fill="#285a46">Ridge shrinks; Lasso may reach exactly zero</text></svg>'''
    if kind == "folds":
        rows=[]
        for r in range(5):
            for c in range(5):
                colour="#ffdce3" if r==c else "#dff0ff"
                rows.append(f'<rect x="{65+c*61}" y="{25+r*25}" width="56" height="20" fill="{colour}" stroke="#173a70"/>')
            rows.append(f'<text x="42" y="{40+r*25}" text-anchor="middle" font-size="11">run {r+1}</text>')
        return f'<svg viewBox="0 0 440 180" role="img" aria-label="five-fold cross validation">{"".join(rows)}<text x="220" y="166" text-anchor="middle" font-size="12" fill="#285a46">pink = test fold • blue = training folds • every row tested once</text></svg>'
    if kind == "dendrogram":
        return '''<svg viewBox="0 0 440 180" role="img" aria-label="fully labelled dendrogram"><path d="M55 145V120H105V145M80 120V88H160V145M270 145V112H320V145M295 112V78H382V145M120 88V42H338V78" fill="none" stroke="#2878bb" stroke-width="3"/><g font-size="11" text-anchor="middle" fill="#122b55"><text x="55" y="162">A</text><text x="105" y="162">B</text><text x="160" y="162">C</text><text x="270" y="162">D</text><text x="320" y="162">E</text><text x="382" y="162">F</text></g><path d="M35 96H412" stroke="#ec5c78" stroke-width="2" stroke-dasharray="7 4"/><text x="410" y="90" text-anchor="end" font-size="11" fill="#a32643">cut height → groups</text><text x="215" y="26" text-anchor="middle" font-size="12">merge height records dissimilarity</text></svg>'''
    return flow_svg(labels, caption)


WARNINGS = {
    "array": "A fast array operation is only correct when shapes and axes mean what you think they mean.",
    "table": "Never trust a positional column number when a stable column name expresses the meaning.",
    "chart": "A decorative plot without labelled axes cannot answer a precise question.",
    "boxplot": "Do not call every point beyond a whisker bad data; investigate its cause first.",
    "projection": "A 3-D screen view changes apparent distance; read the axes instead of trusting perspective.",
    "rerun": "A normal variable does not survive reruns; only cached results or session state do.",
    "pairing": "Check unequal input lengths, because zip stops when the shortest iterable ends.",
    "spread": "Equal means never prove equal consistency; always inspect the distances around the centre.",
    "iqr": "Use the fences as investigation rules, not automatic deletion rules.",
    "skew": "Name skew by the long tail, not by the side where most observations gather.",
    "correlation": "Correlation measures association, not cause, and near zero only rules out a linear pattern.",
    "clt": "The theorem describes the distribution of sample means, not the raw population values.",
    "decision": "Choose the hypothesis, direction and alpha before looking at the result.",
    "distribution": "Failing to reject H₀ is not proof that H₀ is true; it means evidence was insufficient.",
    "paired": "Do not throw away pairing when the same person is measured twice; the differences hold the signal.",
    "bars": "Expected counts come from H₀, not from copying the observed counts.",
    "line": "The equals sign balances two expressions; perform the same inverse operation on both sides.",
    "matrix": "Matrix columns must equal vector length before multiplication can happen.",
    "slope": "A derivative is local; a slope across a wide gap can hide what happens at one point.",
    "regression": "A strong training fit is not enough; inspect unseen score and residual patterns.",
    "learning": "A model can memorize examples and still fail on new cases, so evaluation must stay separate.",
    "types": "A numeric-looking ID is still categorical when addition and averaging have no meaning.",
    "sources": "More rows do not repair a biased sample if the missing people differ systematically.",
    "pipeline": "Fit every learned preprocessing step on training data only, then reuse it on test data.",
    "missing": "Deleting missing rows can delete a whole group and create bias before modelling begins.",
    "encoding": "Never assign ordered numbers to nominal labels unless the order is real.",
    "scaling": "Do not learn mean, standard deviation, minimum or maximum from the test set.",
    "dedupe": "Two identical rows are not always accidental; define the real-world identity before dropping.",
    "transform": "A transform must be valid for every allowed value and must run identically at prediction time.",
    "funnel": "Select features inside validation; selecting on the test set leaks the final exam.",
    "split": "Do not inspect, fit or tune on the held-back test labels before the final evaluation.",
    "known": "Synthetic success proves the pipeline can recover a known rule, not that real data will be easy.",
    "eda": "A plot is a question, not a conclusion; follow visible patterns with measured checks.",
    "curves": "A higher degree can memorize noise, so choose complexity using unseen performance.",
    "coefficients": "Compare regularized models only after scaling features and tuning penalty strength fairly.",
    "folds": "Keep all rows from the same real-world group together when leakage across folds is possible.",
    "clusters": "A cluster is a geometric grouping, not automatically a meaningful customer segment.",
    "dendrogram": "The cut height changes the number of clusters; the tree does not choose business meaning for you.",
}


CSS = r"""
*{box-sizing:border-box}html,body{margin:0;width:1055px;height:1491px;overflow:hidden}
body{font-family:Noteworthy,"Comic Sans MS",cursive;color:#102c58;background:#fbfaf4}
.sheet{position:relative;width:1055px;height:1491px;overflow:hidden;background:
  linear-gradient(90deg,transparent 0 81px,#ef6e83 81px 83px,transparent 83px),
  repeating-linear-gradient(0deg,transparent 0 30px,rgba(91,121,151,.67) 30px 31px),#fbfaf4}
.hole{position:absolute;left:10px;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#f3f1e8 0 18%,#aaa99f 44%,#6e706b 65%,#dddcd5 72%);box-shadow:1px 1px 2px #777;z-index:5}
.page-title{position:absolute;left:105px;top:16px;max-width:815px;height:54px;padding:0 14px 3px;font-size:40px;line-height:1.22;font-weight:800;color:#092552;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:5px;white-space:nowrap;letter-spacing:-1px;z-index:3}
.page-title:before{content:"";position:absolute;inset:1px -5px 2px -3px;background:#a9daf8;border-radius:42% 12% 35% 9%;transform:rotate(-.4deg);z-index:-1}
.page-no{position:absolute;right:20px;top:19px;padding:6px 13px 5px;border:2px solid #173a70;background:#fffdf8;font-size:20px;line-height:1;transform:rotate(.5deg)}
.body{--fs:17px;position:absolute;left:94px;right:20px;top:86px;bottom:15px;display:flex;flex-direction:column;justify-content:space-between;gap:7px;font-size:var(--fs);line-height:1.16;overflow:visible}
.box{border:1.8px solid #2878bb;border-radius:8px;background:rgba(255,255,255,.72);padding:7px 10px 7px;box-shadow:0 0 0 .2px rgba(20,60,110,.2)}
.story{background:rgba(220,239,252,.84);border-color:#2878bb;padding:7px 11px}.story.compact{padding:5px 10px}
.story p{margin:5px 0 0;font-weight:560}.story strong{font-weight:800}.story .turn{color:#17663e;font-weight:800}
.section-title,.card-title{display:inline-block;position:relative;margin:0 0 5px;padding:0 7px 1px;font-size:22px;line-height:1.04;font-weight:800;color:#092552;z-index:1}
.section-title:before,.card-title:before{content:"";position:absolute;inset:-1px -3px 0;background:#abd9f6;border-radius:11px 5px 9px 4px;z-index:-1;transform:rotate(-.3deg)}
.pink:before{background:#f8bdcb}.green:before{background:#bde9b4}
.top-grid,.study-grid,.extra-grid,.visual-grid,.choice-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;align-items:start}
.journey{background:rgba(232,248,225,.83);border-color:#2d8a58}.journey ol{list-style:none;margin:3px 0 0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:4px 10px}.journey li{position:relative;padding-left:25px;min-height:21px}.journey li:before{content:attr(data-n);position:absolute;left:0;top:-1px;width:20px;height:20px;border-radius:50%;background:#6ec0ef;border:1px solid #173a70;text-align:center;font:700 12px/19px Arial,sans-serif}
.card p{margin:3px 0}.card ul{margin:3px 0 0;padding-left:19px}.card li{margin:2px 0}.card.key{background:rgba(231,248,225,.84);border-color:#2d8a58}.card.warn{background:rgba(255,228,234,.86);border-color:#e64e6d}.card.example{background:rgba(222,240,252,.88)}
.study-grid .card,.extra-grid .card{min-height:106px}.choice-grid .card{min-height:88px}
.visual{padding:4px 7px 3px;background:rgba(225,241,252,.87)}.visual svg{display:block;width:100%;height:178px}.visual .caption{text-align:center;margin:-2px 0 1px;font-size:14px;color:#285a46;font-weight:700}
.formula{background:rgba(255,255,255,.91);border:2px solid #2782dc;padding:8px 10px}.formula-main{font-family:"Times New Roman",Georgia,serif;font-size:26px;line-height:1.25;text-align:center;color:#102c58;padding:8px 4px;border-bottom:1px solid #8bbce5}.formula-def{font-size:14px;line-height:1.17;margin-top:7px}.pipe{font-family:Georgia,"Times New Roman",serif;font-style:normal;font-weight:600;display:inline-block;transform:scaleY(1.1);margin:0 1px}
.warning-lead{font-weight:800;color:#9d2441}.decision-line{border-left:4px solid #2c7fd0;padding-left:8px;font-weight:700;color:#173a70}
.bottom-zone{display:flex;flex-direction:column;gap:7px;min-height:253px}.recall{background:rgba(231,248,225,.9);border-color:#2d8a58;padding:6px 9px}.recall-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px 14px}.recall-item{border-bottom:1px solid rgba(35,110,75,.45);padding:2px 3px 4px;min-height:42px}.recall-item b{color:#173a70}.recall-item span{color:#285a46;font-weight:650}
.checkpoint{background:rgba(218,239,252,.94);border:2px solid #2580d5;padding:6px 10px 7px;min-height:83px}.checkpoint .q{font-weight:700}.checkpoint .a{display:block;color:#17643c;font-weight:800;margin-top:3px;border-left:4px solid #2580d5;padding-left:8px}
.tiny{font-size:13px}.nowrap{white-space:nowrap}
"""


def focus_for(page: int, pages: int) -> str:
    if pages == 1:
        return "Night-Before Revision"
    if pages == 2:
        return ("Core Idea & Story", "Method, Choices & Checks")[page - 1]
    return ("Why It Exists", "How It Works", "Practice, Pitfalls & Decisions")[page - 1]


def story_html(topic: str, page: int, pages: int) -> str:
    story = plain_story(topic)
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", story) if s.strip()]
    if page == 1 or pages == 1:
        body = " ".join(sentences)
        label = "A story to start 🚦"
        cls = "story"
    else:
        first = sentences[0] if sentences else story
        chosen = sentences[min(page - 1, len(sentences) - 1)] if sentences else story
        if chosen == first and len(sentences) > 1:
            chosen = sentences[-1]
        final = sentences[-1] if sentences else ""
        thread = []
        for sentence in (first, chosen, final):
            if sentence and sentence not in thread:
                thread.append(sentence)
        body = "Back to the same case: " + " ".join(thread)
        label = "Story thread — same people, same numbers"
        cls = "story compact"
    return f'<section class="box {cls}"><h2 class="section-title">{html.escape(label)}</h2><p>{pipe_safe(body)}</p></section>'


def fallback_groups(topic: str) -> list[tuple[str, list[str]]]:
    title = topic_title(topic)
    journey = JOURNEYS[topic]
    templates = [
        "Begin with {step}. That fixes the meaning before any calculation starts.",
        "Next, {step}. Keep this step tied to the original rows and units.",
        "Then {step}. The result should answer the story's exact problem.",
        "After that, {step}. Check the decision with evidence rather than intuition.",
        "Finish by learning to {step}. A clear explanation is part of a correct result.",
    ]
    return [(f"{title}: {step.capitalize()}", [templates[i].format(step=step)]) for i, step in enumerate(journey)]


def spread_pick(items: list[tuple[str, list[str]]], count: int) -> list[tuple[str, list[str]]]:
    if len(items) <= count:
        return items[:]
    indices = [round(i * (len(items) - 1) / (count - 1)) for i in range(count)]
    return [items[i] for i in indices]


def page_groups(topic: str, groups: list[tuple[str, list[str]]], page: int, pages: int) -> list[tuple[str, list[str]]]:
    custom_page = CUSTOM_PAGE_FACTS.get((topic, page))
    combined = custom_page[:] if custom_page is not None else CUSTOM_FACTS.get(topic, []) + groups
    pool = combined if custom_page is not None else combined[page - 1::pages]
    chosen = spread_pick(pool, 13)
    seen = {re.sub(r"\W+", " ", x[0].lower()).strip() for x in chosen}
    for item in fallback_groups(topic):
        key = re.sub(r"\W+", " ", item[0].lower()).strip()
        if len(chosen) >= 13:
            break
        if key not in seen:
            chosen.append(item)
            seen.add(key)
    while len(chosen) < 13:
        n = len(chosen) + 1
        chosen.append((f"Recall step {n}", [f"Connect step {n} back to {topic_title(topic)} and explain what evidence would make it trustworthy."]))
    return chosen[:13]


def card_html(item: tuple[str, list[str]], cls: str = "", limit: int = 2) -> str:
    heading, sentences = item
    body = " ".join(sentences[:limit])
    return f'<section class="box card {cls}"><h3 class="card-title">{pipe_safe(heading)}</h3><p>{pipe_safe(body)}</p></section>'


def holes_html() -> str:
    return "".join(f'<span class="hole" style="top:{28+i*81}px"></span>' for i in range(18))


def formula_html(topic: str, page: int) -> str:
    entries = FORMULAS[topic]
    formula, definitions = entries[min(page - 1, len(entries) - 1)]
    return f'''<section class="box formula"><h3 class="card-title pink">Formula / code to remember</h3>
      <div class="formula-main">{pipe_safe(formula)}</div><div class="formula-def"><b>Symbols:</b> {pipe_safe(definitions)}</div></section>'''


def journey_html(topic: str) -> str:
    rows = "".join(f'<li data-n="{i}">{html.escape(step.capitalize())}</li>' for i, step in enumerate(JOURNEYS[topic], 1))
    return f'<section class="box journey"><h3 class="card-title green">Our Journey (in this topic)</h3><ol>{rows}</ol></section>'


def render_page(topic: str, page: int, pages: int, groups: list[tuple[str, list[str]]]) -> str:
    title = topic_title(topic)
    selected = page_groups(topic, groups, page, pages)
    main_cards = selected[:5]
    extra_cards = selected[5:9]
    recall_cards = selected[9:13]
    kind = DIAGRAM_KIND[topic]
    if page > 1:
        diagram = flow_svg(JOURNEYS[topic][page - 1:page + 2], f"Page {page}: {focus_for(page, pages)}")
    else:
        diagram = specific_svg(kind, JOURNEYS[topic][:3], f"{title}: evidence → method → decision")
    warning = WARNINGS.get(kind, "Keep the method tied to its assumptions and verify the result on evidence it did not learn from.")
    recall = "".join(
        f'<div class="recall-item"><b>{i}. {pipe_safe(h)}:</b> <span>{pipe_safe(ss[0])}</span></div>'
        for i, (h, ss) in enumerate(recall_cards, 1)
    )
    journey = JOURNEYS[topic]
    decision = f"Safe order: {journey[0]} → {journey[1]} → {journey[2]} → {journey[3]} → {journey[4]}. Keep the opening story's rows, meanings and units attached throughout."
    q_index = min(page - 1, 3)
    checkpoint_q = f"What must happen after “{journey[q_index]}” so the opening mistake cannot survive?"
    checkpoint_a = f"Move next to “{journey[q_index + 1]}”, then finish by learning to {journey[4]}. That keeps the conclusion tied to evidence rather than appearance."
    return f'''<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>
    <main class="sheet">{holes_html()}<div class="page-title">{html.escape(title)} — {html.escape(focus_for(page,pages))}</div><div class="page-no">Page {page}/{pages}</div>
      <div class="body">
        {story_html(topic,page,pages)}
        <div class="top-grid">{journey_html(topic)}{card_html(main_cards[0], "key")}</div>
        <div class="study-grid">{card_html(main_cards[1], "example")}{card_html(main_cards[2])}{card_html(main_cards[3])}{card_html(main_cards[4], "key")}</div>
        <div class="extra-grid">{card_html(extra_cards[0], "example", 1)}{card_html(extra_cards[1], "", 1)}{card_html(extra_cards[2], "", 1)}{card_html(extra_cards[3], "key", 1)}</div>
        <div class="visual-grid"><section class="box visual"><h3 class="card-title">Picture the logic</h3>{diagram}<div class="caption">Every label has its own lane; arrows show the reading order.</div></section>{formula_html(topic,page)}</div>
        <div class="choice-grid"><section class="box card warn"><h3 class="card-title pink">⚠️ Classic mistake</h3><p><span class="warning-lead">Watch this:</span> {pipe_safe(warning)}</p></section><section class="box card key"><h3 class="card-title green">Decision rule</h3><p class="decision-line">{pipe_safe(decision)}</p></section></div>
        <div class="bottom-zone"><section class="box recall"><h3 class="card-title green">Rapid recall — answer before peeking</h3><div class="recall-grid">{recall}</div></section>
        <section class="box checkpoint"><h3 class="card-title">Checkpoint ✅</h3><div class="q">Question: {pipe_safe(checkpoint_q)}</div><span class="a">→ {pipe_safe(checkpoint_a)}</span></section></div>
      </div>
    </main><script>
    function fit(){{const body=document.querySelector('.body');let n=17;while(body.scrollHeight>body.clientHeight&&n>12.6){{n-=.25;body.style.setProperty('--fs',n+'px')}}const title=document.querySelector('.page-title');let t=40;while(title.scrollWidth>title.clientWidth&&t>29){{t-=1;title.style.fontSize=t+'px'}}}}
    document.fonts.ready.then(()=>requestAnimationFrame(fit));
    </script></body></html>'''


def inventory() -> list[tuple[str, str, int]]:
    rows: list[tuple[str, str, int]] = []
    for notes in sorted(ROOT.glob("*/*/Handwritten_Notes")):
        topic = notes.parent.relative_to(ROOT).as_posix()
        if topic in {"04_ML/12_Preprocessing", "04_ML/22_Cost_Functions"}:
            continue
        rejected = sorted(notes.glob("*_Page_*of*.png"))
        if not rejected:
            continue
        match = re.match(r"(.+)_Page_\d+of\d+\.png$", rejected[0].name)
        if not match:
            continue
        rows.append((topic, match.group(1), len(rejected)))
    return rows


def main() -> None:
    TMP.mkdir(parents=True, exist_ok=True)
    rows = inventory()
    assert len(rows) == 48, f"expected 48 topics, found {len(rows)}"
    assert sum(pages for _, _, pages in rows) == 81, "expected 81 pages"
    assert all(topic in JOURNEYS and topic in DIAGRAM_KIND and topic in FORMULAS for topic, _, _ in rows)
    manifest = []
    for topic, base, pages in rows:
        groups = extract_groups(ROOT / topic)
        for page in range(1, pages + 1):
            stem = f"{base}_{page:02d}"
            path = TMP / f"{stem}.html"
            path.write_text(render_page(topic, page, pages, groups), encoding="utf-8")
            manifest.append({"topic": topic, "page": page, "pages": pages, "stem": stem, "html": str(path), "png": str(ROOT / topic / "Handwritten_Notes" / f"{stem}.png")})
    (TMP / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"prepared {len(manifest)} HTML pages across {len(rows)} topics")
    for row in manifest:
        print(f"{row['topic']}  {row['stem']}.png")


def render_all() -> None:
    chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    manifest = json.loads((TMP / "manifest.json").read_text(encoding="utf-8"))

    def one(row: dict) -> str:
        command = [
            chrome, "--headless", "--disable-gpu", "--hide-scrollbars",
            "--force-device-scale-factor=1", "--window-size=1055,1491",
            "--virtual-time-budget=700", f"--screenshot={row['png']}",
            Path(row["html"]).as_uri(),
        ]
        result = subprocess.run(command, capture_output=True, text=True)
        if result.returncode != 0 or not Path(row["png"]).exists():
            raise RuntimeError(f"render failed for {row['stem']}: {result.stderr[-500:]}")
        return f"rendered {row['topic']}  {row['stem']}.png"

    with ThreadPoolExecutor(max_workers=4) as pool:
        futures = [pool.submit(one, row) for row in manifest]
        for future in as_completed(futures):
            print(future.result(), flush=True)
    print(f"rendered {len(manifest)} pages", flush=True)


if __name__ == "__main__":
    if "--render" in sys.argv:
        render_all()
    else:
        main()
