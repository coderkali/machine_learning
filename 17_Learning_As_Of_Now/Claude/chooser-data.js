/* ══════════════════════════════════════════════════════════════════════════
   WHEN TO USE WHAT — the decision layer of this repository.

   Journey answers "what order do I do things in".
   This file answers "which tool do I reach for, right here".

   HAND-MAINTAINED. Nothing in this file is generated, because
   "use when / do not use when" is judgement, not something a script can
   read out of a notebook.

   ── the contract ──────────────────────────────────────────────────────────
   topic / also   folder paths like "04_ML/08_Feature_Scaling".
                  build_site.py FAILS if a folder named here does not exist,
                  and WARNS when a topic you have studied appears nowhere
                  in this file — that is your cue to add its card.

   name           what the technique is called; the flowchart leaves in FLOWS
                  at the bottom of this file must match it exactly
   use / avoid    the two lists that actually make the decision
   code           the one line you would really type

   Only techniques actually studied appear here. If a card is missing, the
   topic has not been learned yet — that is the honest answer, not a gap.
   ══════════════════════════════════════════════════════════════════════════ */

const SPACES = [

/* ════════════════ 1 ════════════════════════════════════════════════════ */
{
  id: "prep", n: "1", name: "Preparing the data", icon: "🧹",
  blurb: "Every decision here is inherited by every model you try afterwards. " +
         "A wrong choice at this stage cannot be fixed by a better algorithm.",
  jobs: [

    { id: "clean", name: "Clean the table first", icon: "\u{1F9FD}",
      q: "Before any of this: is the table itself sound?",
      note: "Two quiet defects break everything downstream. A duplicated row leaks across " +
            "the train/test split. A number stored as text silently disables arithmetic, " +
            "and no error is ever raised.",
      options: [
        { name: "drop_duplicates()", topic: "04_ML/09_Duplicates_And_Dtypes",
          also: ["04_ML/04_Data_Cleaning"],
          code: "df = df.drop_duplicates()",
          use: ["Exactly repeated rows, usually from a bad join or a re-run of a load",
                "Run it BEFORE the split \u2014 the same row on both sides means the model is tested on what it memorised"],
          avoid: ["Rows that are identical but genuinely different events \u2014 two customers can order the same item at the same price"],
          },

        { name: "Check and fix dtypes", topic: "04_ML/09_Duplicates_And_Dtypes",
          also: ["04_ML/02_Types_Of_Variables"],
          code: "df.info()\ndf['amount'] = pd.to_numeric(df['amount'], errors='coerce')",
          use: ["df.info() on the first day, every time",
                "A numeric column showing dtype object usually holds a stray comma, currency symbol or blank string"],
          avoid: ["Forcing a type without errors='coerce' \u2014 one bad row will stop the whole load"],
          },

        { name: "Know what each column IS", topic: "04_ML/02_Types_Of_Variables",
          code: "# numeric \u2192 arithmetic  |  nominal \u2192 one-hot  |  ordinal \u2192 keep the order",
          use: ["Every column, before you choose an encoder or a scaler",
                "The type decides what maths is even legal \u2014 averaging a pin code is meaningless"],
          avoid: ["Trusting the dtype. A pin code stored as an int is still a category"],
          }
      ] },

    { id: "missing", name: "Blank cells", icon: "🕳",
      q: "Do I delete these rows, or invent a value for them?",
      note: "Deleting loses information you had. Filling invents information you never had. " +
            "There is no free option — pick the cheaper mistake.",
      options: [
        { name: "df.dropna()", topic: "04_ML/05_Missing_Values",
          code: "df = df.dropna(subset=['age'])",
          use: ["Under about 5% of rows are affected",
                "The blanks look random, not concentrated in one kind of row"],
          avoid: ["A large share of the column is blank — you would delete the dataset",
                  "Rows with blanks are a group of their own (all the new customers)"],
          },

        { name: "SimpleImputer(strategy='median')", topic: "04_ML/05_Missing_Values",
          code: "SimpleImputer(strategy='median')",
          use: ["A numeric column with blanks",
                "The column has a long tail or extreme values — the median ignores them"],
          avoid: ["Text columns — use most_frequent instead"],
          },

        { name: "SimpleImputer(strategy='mean')", topic: "04_ML/05_Missing_Values",
          code: "SimpleImputer(strategy='mean')",
          use: ["A numeric column that is roughly symmetric, with no extreme values"],
          avoid: ["Outliers or a long tail are present — they drag the mean, and now they drag every filled cell too"],
          },

        { name: "SimpleImputer(strategy='most_frequent')", topic: "04_ML/05_Missing_Values",
          code: "SimpleImputer(strategy='most_frequent')",
          use: ["A text or category column with blanks"],
          avoid: ["The blank means something real — then it deserves its own category, not the most common one"],
          },

        { name: "ffill / bfill", topic: "04_ML/05_Missing_Values",
          code: "df['reading'] = df['reading'].ffill()",
          use: ["Rows are in time order and the last known value is still a fair guess",
                "Sensor readings, daily prices, a status that only changes on events"],
          avoid: ["Row order is meaningless — you would copy a stranger's value into someone else's row"],
          },

        { name: "KNNImputer", topic: "04_ML/12_Preprocessing",
          code: "KNNImputer(n_neighbors=5)",
          use: ["Columns are related, so similar rows can vote on the missing value",
                "The table is small enough to compare every row with every other"],
          avoid: ["Large tables — it is slow",
                  "Unscaled columns — it measures distance, so scale first or salary decides everything"],
          },

        { name: "Fill with a 'Missing' category", topic: "04_ML/05_Missing_Values",
          code: "df['plan'] = df['plan'].fillna('Missing')",
          use: ["The blank is itself a fact — no second phone number, never upgraded, no complaint filed"],
          avoid: ["Numeric columns — a made-up number joins the arithmetic and distorts it"],
          }
      ] },

    { id: "encode", name: "Text categories", icon: "🔤",
      q: "How do these words become numbers without inventing an order?",
      note: "One-hot when the categories have no order. Ordinal only when the order is real. " +
            "Red = 1, Blue = 2 quietly tells the model that Blue is twice Red.",
      options: [
        { name: "OneHotEncoder", topic: "04_ML/06_Categorical_Encoding",
          code: "OneHotEncoder(handle_unknown='ignore', drop='first')",
          use: ["The categories have no natural order — city, department, payment method",
                "There are only a handful of distinct values"],
          avoid: ["Hundreds of distinct values — you get hundreds of near-empty columns"],
          },

        { name: "OrdinalEncoder", topic: "04_ML/06_Categorical_Encoding",
          code: "OrdinalEncoder(categories=[['Low', 'Medium', 'High']])",
          use: ["The order is genuinely real — Low < Medium < High, Bronze < Silver < Gold",
                "You state the order yourself, rather than letting it be alphabetical"],
          avoid: ["Unordered categories — the model will read the numbers as a ranking"],
          },

        { name: "LabelEncoder", topic: "04_ML/06_Categorical_Encoding",
          code: "y = LabelEncoder().fit_transform(y)",
          use: ["The target column y, turning class names into 0, 1, 2"],
          avoid: ["Input features — it is built for one column of labels, and it invents an order"],
          },

        { name: "pd.get_dummies()", topic: "04_ML/06_Categorical_Encoding",
          code: "pd.get_dummies(df, columns=['city'], drop_first=True)",
          use: ["A quick look while exploring, before any pipeline exists"],
          avoid: ["Production code — it cannot remember the training categories, so a new city on test day changes the column count"],
          }
      ] },

    { id: "outliers", name: "Extreme values", icon: "🎯",
      q: "Is this row wrong, or just rare? One gets removed. The other is the finding.",
      note: "Decide what the point IS before deciding what to do with it. " +
            "An age of 300 is an error. A salary of 40 lakh is a person.",
      options: [
        { name: "IQR fence, then clip", topic: "04_ML/07_Outliers", also: ["02_DataScience/02_IQR"],
          code: "lo, hi = q1 - 1.5*iqr, q3 + 1.5*iqr\ndf['x'] = df['x'].clip(lo, hi)",
          use: ["Any shape of distribution — quartiles do not assume a bell curve",
                "You want to keep the row but stop one value from dominating"],
          avoid: ["The extreme value is the thing you are trying to predict — fraud, failure, a spike"],
          },

        { name: "Z-score / 3-sd rule", topic: "04_ML/07_Outliers",
          code: "df = df[(df['x'] - df['x'].mean()).abs() <= 3*df['x'].std()]",
          use: ["The column really is roughly bell-shaped"],
          avoid: ["A skewed column — mean and sd are already pulled by the very points you are hunting"],
          },

        { name: "Drop the row", topic: "04_ML/07_Outliers",
          code: "df = df[df['age'] < 120]",
          use: ["The value is impossible — a negative price, an age of 300, a future date"],
          avoid: ["The value is merely surprising. Surprising is data; impossible is a defect"],
          },

        { name: "Keep them, use a model that does not care",
          topic: "04_ML/27_Decision_Tree_Regression", also: ["04_ML/34_Ensemble_Methods"],
          code: "DecisionTreeRegressor()   # splits, never averages distance",
          use: ["The extremes are real and you refuse to fake them",
                "A tree or a forest splits on order, so one huge value changes nothing"],
          avoid: ["You have already committed to a linear model, which they will drag"],
          }
      ] },

    { id: "shape", name: "A long tail", icon: "📐",
      q: "The column is bunched at one end. Do I reshape it?",
      note: "A straight-line model cannot bend. But the column can.",
      options: [
        { name: "FunctionTransformer(np.log1p)", topic: "04_ML/10_Function_Transformer",
          code: "FunctionTransformer(np.log1p, validate=True)",
          use: ["A long right tail — income, price, city population, page views",
                "log1p rather than log, so a zero does not become minus infinity"],
          avoid: ["Negative values — the log is undefined",
                  "You need to explain the coefficient to a business user in plain units"],
          },

        { name: "Square-root transform", topic: "04_ML/10_Function_Transformer",
          code: "FunctionTransformer(np.sqrt)",
          use: ["A mild tail, where a log would over-correct and flip the skew the other way",
                "Count data — visits, complaints, defects"],
          avoid: ["Negative values"],
          }
      ] },

    { id: "scale", name: "Columns on different scales", icon: "⚖️",
      q: "Salary is in lakhs, age is in years. Does my model hear only the salary?",
      note: "Distance-based and weight-fitting models care. Trees do not. " +
            "Ask what the algorithm actually computes, then decide.",
      options: [
        { name: "StandardScaler", topic: "04_ML/08_Feature_Scaling", also: ["04_ML/12_Preprocessing"],
          code: "StandardScaler().fit(X_train)   # mean 0, sd 1",
          use: ["The default when the column is roughly bell-shaped",
                "KNN, SVM, PCA, LDA and any linear model with a penalty (Ridge, Lasso, ElasticNet)"],
          avoid: ["Extreme values survived cleaning — they set the mean and sd, so everything else is squashed into a sliver"],
          },

        { name: "MinMaxScaler", topic: "04_ML/08_Feature_Scaling",
          code: "MinMaxScaler()   # squeezed into 0–1",
          use: ["You need a guaranteed bounded range, 0 to 1",
                "The column has a known floor and ceiling — a percentage, a rating out of 5"],
          avoid: ["Extreme values — one outlier becomes 1.0 and pins every real row near 0"],
          },

        { name: "RobustScaler", topic: "04_ML/12_Preprocessing",
          code: "RobustScaler()   # median and IQR, not mean and sd",
          use: ["Extreme values are real and you decided to keep them",
                "It centres on the median and divides by the IQR, so the tail cannot set the ruler"],
          avoid: ["You need output inside a fixed range — this one does not promise that"],
          },

        { name: "Normalizer", topic: "04_ML/12_Preprocessing",
          code: "Normalizer(norm='l2')   # scales each ROW, not each column",
          use: ["The direction of a row matters more than its size — word counts, a signal vector"],
          avoid: ["Ordinary tabular data. Everything else on this page scales columns; this one scales rows, and mixing them up quietly ruins the table"],
          },

        { name: "Do not scale at all", topic: "04_ML/26_Decision_Tree_Classification",
          also: ["04_ML/34_Ensemble_Methods"],
          code: "# trees ask 'is x > 5?' — the unit never enters the question",
          use: ["Decision trees, random forests, gradient boosting, AdaBoost",
                "Naive Bayes, which works per column anyway"],
          avoid: ["Anything that measures a distance or fits a weight — KNN, SVM, linear models"],
          }
      ] },

    { id: "select", name: "Too many columns", icon: "✂️",
      q: "Which columns actually carry signal, and which just add noise?",
      note: "More columns is not more information. Every useless column is one more chance " +
            "for the model to find a pattern that is not there.",
      options: [
        { name: "VarianceThreshold", topic: "04_ML/11_Feature_Selection",
          code: "VarianceThreshold(threshold=0.0)",
          use: ["The cheap first sweep — removes columns that are the same value in every row",
                "It needs no target, so it is safe to run before anything else"],
          avoid: ["Expecting it to find useful columns. It only removes columns that say nothing at all"],
          },

        { name: "Correlation check, drop one of a pair",
          topic: "02_DataScience/04_Correlation", also: ["04_ML/11_Feature_Selection"],
          code: "df.corr().abs()   # then drop one column from any pair above ~0.9",
          use: ["Two columns say the same thing — height in cm and in inches, total and total-with-tax",
                "Linear models, where duplicated columns make the coefficients unstable and unreadable"],
          avoid: ["Assuming a low correlation means useless — correlation only sees straight-line relationships"],
          },

        { name: "SequentialFeatureSelector (forward / backward)",
          topic: "04_ML/11_Feature_Selection",
          code: "SequentialFeatureSelector(model, n_features_to_select=5, direction='forward')",
          use: ["You want the columns judged by whether they actually improve the model, not by a statistic",
                "A moderate number of columns, and time to let it refit repeatedly"],
          avoid: ["Very wide tables — it trains a model for every candidate, every round"],
          },

        { name: "RFE", topic: "04_ML/11_Feature_Selection",
          code: "RFE(estimator=model, n_features_to_select=5)",
          use: ["The model already reports importances or coefficients — drop the weakest, refit, repeat"],
          avoid: ["A model that reports nothing to rank by, such as KNN"],
          },

        { name: "LDA as a reduction step",
          topic: "04_ML/36_Linear_Discriminant_Analysis",
          code: "LinearDiscriminantAnalysis(n_components=1).fit(X_train, y_train)",
          use: ["A classification problem with many numeric columns",
                "It finds the direction that pushes the class centres apart while keeping each class tight"],
          avoid: ["Regression, or clustering — it needs class labels to aim at",
                  "Unscaled columns — scale first"],
          }
      ] },

    { id: "split", name: "Keeping the test honest", icon: "✂",
      q: "Have I split before touching anything else?",
      note: "This is the one rule with no exception. Split first, then fit every transformer " +
            "on the training half only. A scaler fitted on the whole table has already read the test set.",
      options: [
        { name: "train_test_split(stratify=y)", topic: "04_ML/13_Train_Test_Split",
          code: "train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)",
          use: ["Every supervised problem, as the very first line after loading",
                "stratify=y keeps the class mix identical in both halves"],
          avoid: ["Splitting time-ordered rows at random — you would train on the future and test on the past"],
          },

        { name: "Pipeline + ColumnTransformer", topic: "04_ML/12_Preprocessing",
          code: "Pipeline([('prep', ColumnTransformer([...])), ('model', Ridge())])",
          use: ["Always, once you have more than one preprocessing step",
                "It makes leakage structurally impossible — fit() only ever sees the training fold",
                "Numeric and text columns need different treatment, in one object"],
          avoid: ["Nothing. If the steps are worth doing, they are worth doing inside a pipeline"],
          }
      ] },

    { id: "synth", name: "No data yet, or testing an idea", icon: "\u{1F9EA}",
      q: "I want to try a technique, but I do not have a suitable dataset.",
      note: "Generated data is the one case where you already know the right answer, " +
            "so you can check whether the model actually found it. Reference only \u2014 " +
            "this never appears in a real plan.",
      options: [
        { name: "make_regression", topic: "04_ML/14_Synthetic_Datasets",
          also: ["04_ML/03_Data_Collection"],
          code: "make_regression(n_samples=200, n_features=1, noise=15, random_state=42)",
          use: ["Checking that a regression technique behaves as the theory says",
                "You set the noise, so you know exactly how good the score should be"],
          avoid: ["Claiming a result about the real world from it"],
          },

        { name: "make_classification", topic: "04_ML/14_Synthetic_Datasets",
          code: "make_classification(n_samples=500, n_informative=3, weights=[0.95, 0.05])",
          use: ["Practising with a deliberately imbalanced target, using weights=",
                "Comparing classifiers on a boundary whose true shape you control"],
          avoid: ["Tuning hyperparameters you then carry over to real data"],
          },

        { name: "make_blobs", topic: "04_ML/14_Synthetic_Datasets",
          code: "make_blobs(n_samples=300, centers=4, cluster_std=1.0, random_state=42)",
          use: ["Clustering practice, where you know the true k and can check whether KMeans found it"],
          avoid: ["Concluding that KMeans works well in general \u2014 blobs are exactly the round shape it likes"],
          }
      ] }
  ]
},

/* ════════════════ 2 ════════════════════════════════════════════════════ */
{
  id: "model", n: "2", name: "Choosing a model", icon: "🧭",
  blurb: "Start with the simplest thing that could work and make it the score to beat. " +
         "A complicated model that cannot beat a straight line has told you something.",
  jobs: [

    { id: "reg", name: "Predict a number", icon: "📈",
      q: "The answer is a quantity. Which family fits the shape of the relationship?",
      note: "Fit LinearRegression first — not because it will win, but because everything " +
            "afterwards has to justify itself against it.",
      options: [
        { name: "LinearRegression", topic: "04_ML/16_Linear_Regression",
          also: ["04_ML/17_Multiple_Linear_Regression", "03_Math/05_Linear_Regression_From_Scratch"],
          code: "LinearRegression().fit(X_train, y_train)",
          use: ["The baseline, always fitted first",
                "You need to explain the effect of each column in plain units"],
          avoid: ["The relationship is visibly curved",
                  "Columns repeat each other — the coefficients become unstable and unreadable"],
          },

        { name: "PolynomialFeatures + LinearRegression", topic: "04_ML/18_Polynomial_Regression",
          code: "Pipeline([('poly', PolynomialFeatures(2)), ('lr', LinearRegression())])",
          use: ["The scatter bends but still has one clear shape",
                "Degree 2 or 3 — start low"],
          avoid: ["A high degree, which chases the noise and swings wildly between points",
                  "Many columns already — the feature count explodes"],
          },

        { name: "Ridge", topic: "04_ML/19_Ridge_Regression",
          code: "Ridge(alpha=1.0)",
          use: ["Columns repeat each other and plain linear coefficients are unstable",
                "More columns than the data can comfortably support",
                "You want to keep every column, only calmer"],
          avoid: ["You wanted columns removed — Ridge shrinks slopes towards zero but never to zero"],
          },

        { name: "Lasso", topic: "04_ML/20_Lasso_Regression",
          code: "Lasso(alpha=0.1)",
          use: ["Many columns and you want the weak ones removed automatically",
                "L1 subtracts a flat amount from every slope, so weak columns reach exactly 0 and drop out"],
          avoid: ["Two columns say the same thing — Lasso keeps one at random and drops the other, and which one changes between runs"],
          },

        { name: "ElasticNet", topic: "04_ML/21_ElasticNet",
          code: "ElasticNet(alpha=0.1, l1_ratio=0.5)",
          use: ["Many columns AND groups of columns that duplicate each other",
                "alpha sets how hard the penalty bites; l1_ratio sets how Lasso-like it behaves"],
          avoid: ["A small, clean set of columns — you are tuning two knobs for nothing"],
          },

        { name: "DecisionTreeRegressor", topic: "04_ML/27_Decision_Tree_Regression",
          code: "DecisionTreeRegressor(max_depth=5)",
          use: ["The relationship is curved, or steps, or different in different regions",
                "No scaling needed, extreme values do not drag it, and you can read the rules"],
          avoid: ["Leaving max_depth unset — one tree will memorise the training rows perfectly and fail on new ones"],
          },

        { name: "RandomForestRegressor", topic: "04_ML/34_Ensemble_Methods",
          code: "RandomForestRegressor(n_estimators=300, random_state=42)",
          use: ["The strong general-purpose answer when accuracy matters more than explanation",
                "Many trees on different samples, averaged — the overfitting of one tree cancels out"],
          avoid: ["You must explain a single decision path to an auditor",
                  "A latency budget measured in milliseconds"],
          }
      ] },

    { id: "clf", name: "Predict a label", icon: "🏷",
      q: "The answer is one of a few classes. What is the shape of the boundary?",
      note: "Scale first for anything that measures distance — KNN and SVM are unusable without it.",
      options: [
        { name: "DecisionTreeClassifier", topic: "04_ML/26_Decision_Tree_Classification",
          code: "DecisionTreeClassifier(max_depth=5, random_state=42)",
          use: ["The readable baseline — you can print the rules and defend them",
                "Mixed numeric and category columns, no scaling required"],
          avoid: ["An unrestricted depth, which memorises the training rows"],
          },

        { name: "RandomForestClassifier", topic: "04_ML/34_Ensemble_Methods",
          code: "RandomForestClassifier(n_estimators=300, random_state=42)",
          use: ["The default when you want a strong score without much tuning",
                "It also hands you feature_importances_ for free"],
          avoid: ["You need to explain one prediction as a chain of reasons"],
          },

        { name: "GradientBoosting / AdaBoost", topic: "04_ML/34_Ensemble_Methods",
          code: "GradientBoostingClassifier(n_estimators=200, learning_rate=0.1)",
          use: ["You want the last few points of accuracy out of tabular data",
                "Each new tree is built to fix the mistakes of the ones before it"],
          avoid: ["Noisy labels — boosting keeps focusing on the rows it gets wrong, including the wrong ones",
                  "You have no time to tune; boosting rewards tuning far more than a forest does"],
          },

        { name: "VotingClassifier", topic: "04_ML/34_Ensemble_Methods",
          code: "VotingClassifier([('nb', GaussianNB()), ('dt', tree), ('knn', knn)], voting='soft')",
          use: ["You have several decent models that fail on different rows",
                "The gain comes from their disagreement, so combine models that work differently"],
          avoid: ["Combining three versions of the same model — they will all be wrong together"],
          },

        { name: "GaussianNB / MultinomialNB", topic: "04_ML/28_Naive_Bayes",
          code: "GaussianNB().fit(X_train, y_train)",
          use: ["A fast, honest baseline that trains almost instantly",
                "Text classification and word counts, where MultinomialNB is very hard to beat for the effort",
                "Very few rows — it needs less data than most"],
          avoid: ["Columns that repeat each other — 'naive' means it assumes they are independent, and duplicated evidence gets counted twice"],
          },

        { name: "KNeighborsClassifier", topic: "04_ML/29_K_Nearest_Neighbor",
          code: "Pipeline([('sc', StandardScaler()), ('knn', KNeighborsClassifier(n_neighbors=5))])",
          use: ["The boundary is irregular and you cannot describe it as a rule",
                "A small dataset — there is no training step at all, it just stores the rows"],
          avoid: ["Unscaled columns — the biggest unit becomes the whole distance",
                  "Many columns: in high dimensions every point is roughly equally far from every other",
                  "Prediction must be fast — every prediction scans the whole training set"],
          },

        { name: "SVC", topic: "04_ML/30_Support_Vector_Machines",
          code: "Pipeline([('sc', StandardScaler()), ('svc', SVC(kernel='rbf', C=1.0))])",
          use: ["A clear gap between classes, and you want the widest possible margin",
                "Many columns relative to rows — SVM handles that well",
                "Not separable by a straight line: the kernel adds a dimension until it is"],
          avoid: ["Large datasets — training time grows badly",
                  "Unscaled columns",
                  "You need a calibrated probability out of the box"],
          },

        { name: "LinearDiscriminantAnalysis", topic: "04_ML/36_Linear_Discriminant_Analysis",
          code: "LinearDiscriminantAnalysis().fit(X_train, y_train)",
          use: ["Numeric columns, classes that form roughly round, similarly-spread clouds",
                "It classifies and reduces dimensions in the same step"],
          avoid: ["Categorical inputs, or classes with very different spreads"],
          }
      ] },

    { id: "clu", name: "Find groups, with no labels", icon: "🧩",
      q: "Nobody has labelled anything. How do I find the natural groups?",
      note: "There is no test set to appeal to. Scaling is not optional — every one of these " +
            "measures distance, so an unscaled column decides the answer on its own.",
      options: [
        { name: "KMeans", topic: "04_ML/31_Clustering_KMeans",
          code: "Pipeline([('sc', StandardScaler()), ('km', KMeans(n_clusters=4, n_init=10))])",
          use: ["Many rows and you can name a k, or find one with the elbow plot",
                "Groups that are roughly round and similarly sized"],
          avoid: ["Long or crescent-shaped groups — it can only draw round ones",
                  "Extreme values, which drag a centre away from the group it is meant to represent",
                  "Text categories — mean of 'Mumbai' has no meaning"],
          },

        { name: "AgglomerativeClustering + dendrogram", topic: "04_ML/32_Hierarchical_Clustering",
          code: "AgglomerativeClustering(n_clusters=None, distance_threshold=0)",
          use: ["You do not know k — the dendrogram shows every possible k at once, so you choose after looking",
                "A small dataset, where the whole merge history is worth reading",
                "You want nested groups: segments inside segments"],
          avoid: ["Large datasets — it compares every pair, so cost grows fast"],
          }
      ] }
  ]
},

/* ════════════════ 3 ════════════════════════════════════════════════════ */
{
  id: "judge", n: "3", name: "Judging it, then shipping it", icon: "📊",
  blurb: "The metric is a business decision wearing a maths costume. Pick it by asking " +
         "what a mistake actually costs, not by which number looks best.",
  jobs: [

    { id: "regmetric", name: "Score a number prediction", icon: "📏",
      q: "How wrong is it, and does one big miss matter more than several small ones?",
      note: "Report RMSE next to R². One says how far off you are in real units, the other " +
            "says whether you beat simply guessing the average.",
      options: [
        { name: "R²", topic: "04_ML/24_Model_Evaluation",
          code: "r2_score(y_test, y_pred)",
          use: ["A quick 'is this better than predicting the mean?' — 0 means no better"],
          avoid: ["Comparing models with different numbers of columns — R² can only go up as you add columns"],
          },

        { name: "RMSE", topic: "04_ML/22_Cost_Functions",
          code: "mean_squared_error(y_test, y_pred) ** 0.5",
          use: ["Reporting the error in the unit people actually think in — rupees, days, units",
                "Large misses should be punished harder than small ones"],
          avoid: ["Extreme values you already decided to keep — a few of them will dominate the score"],
          },

        { name: "MAE", topic: "04_ML/22_Cost_Functions",
          code: "mean_absolute_error(y_test, y_pred)",
          use: ["Every rupee of error costs the same, whether it is one big miss or ten small ones",
                "Extreme values are present and you do not want them setting the score"],
          avoid: ["A big miss really is disproportionately expensive — then you want RMSE"],
          },

        { name: "Adjusted R²", topic: "04_ML/24_Model_Evaluation",
          code: "1 - (1-r2)*(n-1)/(n-p-1)",
          use: ["Comparing models that have different numbers of columns — it charges rent for each one"],
          avoid: ["A single model with a fixed column set; plain R² says the same thing"],
          }
      ] },

    { id: "clfmetric", name: "Score a label prediction", icon: "🎯",
      q: "Which mistake hurts more: a false alarm, or a miss?",
      note: "Accuracy is the metric that lets a useless model look excellent. " +
            "With 1 fraud in 500 rows, predicting 'no fraud' every time scores 99.8%.",
      options: [
        { name: "Confusion matrix", topic: "04_ML/24_Model_Evaluation",
          code: "confusion_matrix(y_test, y_pred)",
          use: ["Always — look at it before any single number",
                "It is the only view that separates the two kinds of mistake"],
          avoid: ["Nothing. Every other classification metric is a summary of this table"],
          },

        { name: "Accuracy", topic: "04_ML/24_Model_Evaluation",
          code: "accuracy_score(y_test, y_pred)",
          use: ["The classes are roughly balanced and both mistakes cost about the same"],
          avoid: ["One class is rare — accuracy will reward a model that never predicts it"],
          },

        { name: "Precision", topic: "04_ML/24_Model_Evaluation",
          code: "precision_score(y_test, y_pred)",
          use: ["A false alarm is expensive — blocking a real customer's card, an unnecessary recall",
                "Of everything I flagged, how much was really it?"],
          avoid: ["Using it alone — you can score 1.0 by flagging exactly one very obvious row"],
          },

        { name: "Recall", topic: "04_ML/24_Model_Evaluation",
          code: "recall_score(y_test, y_pred)",
          use: ["A miss is expensive — undetected disease, undetected fraud, a churn you could have stopped",
                "Of everything that really was it, how much did I catch?"],
          avoid: ["Using it alone — you can score 1.0 by flagging every single row"],
          },

        { name: "F1", topic: "04_ML/24_Model_Evaluation",
          code: "f1_score(y_test, y_pred)",
          use: ["You need one number and both mistakes matter",
                "The classes are imbalanced, so accuracy would be misleading"],
          avoid: ["The two mistakes have genuinely different costs — then say which one you care about, and use that"],
          },

        { name: "ROC curve and AUC", topic: "04_ML/25_ROC_And_AUC",
          code: "roc_auc_score(y_test, model.predict_proba(X_test)[:, 1])",
          use: ["Comparing two models without committing to a threshold yet",
                "Choosing the threshold yourself — the model gives a probability, the cut-off is your decision"],
          avoid: ["Reading it as accuracy — AUC still looks generous when the positive class is very rare"],
          }
      ] },

    { id: "trust", name: "Trust the score", icon: "🔁",
      q: "Was that score real, or did I get a lucky split?",
      note: "One split is one sample. If the score moves a lot between folds, the number " +
            "you were about to report was mostly luck.",
      options: [
        { name: "Single hold-out split", topic: "04_ML/13_Train_Test_Split",
          code: "train_test_split(X, y, test_size=0.2, random_state=42)",
          use: ["Plenty of rows, and you want a fast answer while iterating"],
          avoid: ["A small dataset — the score will swing depending on which rows landed in the test half"],
          },

        { name: "KFold + cross_val_score", topic: "04_ML/23_Cross_Validation",
          code: "cross_val_score(pipeline, X, y, cv=KFold(5, shuffle=True, random_state=42))",
          use: ["Every row gets to be test data exactly once, and the scores are averaged",
                "A small dataset, where one split cannot be trusted"],
          avoid: ["Rows in time order — shuffling trains on the future",
                  "A raw estimator instead of a pipeline: the scaler would be refitted on each full fold and leak"],
          },

        { name: "StratifiedKFold", topic: "04_ML/23_Cross_Validation",
          code: "cross_val_score(pipe, X, y, cv=StratifiedKFold(5, shuffle=True, random_state=42))",
          use: ["Any classification problem — it keeps the class mix identical in every fold",
                "A rare class, where plain KFold can produce a fold containing none of it at all"],
          avoid: ["Regression — there are no classes to stratify on"],
          }
      ] },

    { id: "tune", name: "Turn the knobs", icon: "🎛",
      q: "Which settings, and how do I search them without cheating?",
      note: "Hyperparameters are the settings the model cannot learn for itself — " +
            "alpha in Ridge, max_depth in a tree, k in KNN. Search them with cross-validation " +
            "on the training half, and leave the test set alone until the very end.",
      options: [
        { name: "GridSearchCV", topic: "04_ML/33_Hyperparameter_Tuning",
          code: "GridSearchCV(pipe, {'model__alpha': [0.01, 0.1, 1, 10]}, cv=5)",
          use: ["A small number of knobs with a few plausible values each",
                "You want the guarantee that every combination was tried"],
          avoid: ["A large grid — the cost is the product of every list, times the folds"],
          },

        { name: "RandomizedSearchCV", topic: "04_ML/33_Hyperparameter_Tuning",
          code: "RandomizedSearchCV(pipe, param_dist, n_iter=50, cv=5, random_state=42)",
          use: ["Many knobs, or wide ranges, or a fixed time budget",
                "It samples combinations, and usually lands very close to the grid's best for a fraction of the work"],
          avoid: ["A tiny search space — just run the grid and be certain"],
          }
      ] },

    { id: "ship", name: "Freeze it and ship it", icon: "📦",
      q: "How does tomorrow's request get answered by exactly this model?",
      note: "Save the whole pipeline, not the bare estimator. A model without its scaler and " +
            "encoder is a model that will be fed differently-shaped data in production.",
      options: [
        { name: "joblib.dump", topic: "04_ML/37_Model_Persistence",
          code: "joblib.dump(pipeline, 'model.joblib')",
          use: ["The default for anything scikit-learn — it handles the large NumPy arrays inside efficiently"],
          avoid: ["Treating the file as portable across library versions — pin the versions beside it"],
          },

        { name: "pickle", topic: "04_ML/37_Model_Persistence",
          code: "pickle.dump(pipeline, open('model.pkl','wb'))",
          use: ["A plain Python object with no big arrays in it"],
          avoid: ["Loading a pickle you did not create — it executes code on load"],
          }
      ] }
  ]
},

/* ════════════════ 4 ════════════════════════════════════════════════════ */
{
  id: "stats", n: "4", name: "Proving it, and seeing it", icon: "🔬",
  blurb: "Before any model, two questions: is the difference I am looking at real, " +
         "and what does this data actually look like?",
  jobs: [

    { id: "test", name: "Is this difference real?", icon: "⚖️",
      q: "Two numbers differ. Is that an effect, or a run of good luck?",
      note: "Assume nothing happened, then ask how surprising your result would be if that " +
            "were true. A small p-value means the data is hard to explain by luck alone.",
      options: [
        { name: "One-sample z-test", topic: "02_DataScience/07_Z_Test",
          also: ["02_DataScience/11_Z_Test_vs_T_Test", "02_DataScience/05_Central_Limit_Theorem"],
          code: "z = (x_bar - mu) / (sigma / n**0.5)",
          use: ["You know the population standard deviation",
                "A large sample, roughly 30 or more"],
          avoid: ["A small sample with an unknown sd — that is the t-test's job"],
          },

        { name: "One-sample t-test", topic: "02_DataScience/08_T_Test",
          also: ["02_DataScience/06_Hypothesis_Testing_Basics"],
          code: "ttest_1samp(sample, popmean=50)",
          use: ["Comparing one group's mean against a claimed value",
                "The population sd is unknown, which is almost always"],
          avoid: ["Comparing two separate groups — use the two-sample form"],
          },

        { name: "Two-sample t-test", topic: "02_DataScience/08_T_Test",
          code: "ttest_ind(group_a, group_b)",
          use: ["Two independent groups of different people — control against variant, branch A against branch B"],
          avoid: ["The same people measured twice — that is a paired test, and using this one throws away the pairing"],
          },

        { name: "Paired t-test", topic: "02_DataScience/09_Paired_T_Test",
          code: "ttest_rel(before, after)",
          use: ["The same subjects measured twice — before and after training, same store month on month",
                "It tests the differences, so each person acts as their own control"],
          avoid: ["Two unrelated groups, or unequal group sizes"],
          },

        { name: "Chi-square test", topic: "02_DataScience/10_Chi_Square_Test",
          code: "chi2_contingency(pd.crosstab(df.city, df.churn))",
          use: ["Both columns are categories — is churn related to plan type?",
                "You are working with counts in a table, not means"],
          avoid: ["Numeric columns",
                  "Very small expected counts in a cell — the approximation stops holding"],
          }
      ] },

    { id: "describe", name: "Describe one column honestly", icon: "📉",
      q: "What is the middle, and how spread out is it really?",
      note: "Two datasets can share an average and describe completely different worlds.",
      options: [
        { name: "Mean and standard deviation", topic: "02_DataScience/01_Measures_Of_Variability",
          code: "df['x'].mean(), df['x'].std()",
          use: ["A roughly symmetric column with no extreme values"],
          avoid: ["A long tail — the mean sits where almost nobody is"],
          },

        { name: "Median and IQR", topic: "02_DataScience/02_IQR",
          code: "df['x'].median(), df['x'].quantile(.75) - df['x'].quantile(.25)",
          use: ["A skewed column — income, price, waiting time",
                "Extreme values are present and you do not want them moving the summary"],
          avoid: ["Nothing, really. When in doubt, report both this and the mean and let the gap speak"],
          },

        { name: "Skewness", topic: "02_DataScience/03_Skewness",
          code: "df['x'].skew()",
          use: ["Deciding whether a column needs a log transform before a linear model",
                "A positive value means a tail to the right"],
          avoid: ["Reading it alone — always look at the histogram beside it"],
          },

        { name: "Correlation matrix", topic: "02_DataScience/04_Correlation",
          code: "sns.heatmap(df.corr(numeric_only=True), annot=True)",
          use: ["Spotting which columns move with the target, and which duplicate each other"],
          avoid: ["Reading a low value as 'no relationship' — it only measures straight-line ones",
                  "Reading a high value as cause"],
          }
      ] },

    { id: "chart", name: "Which chart answers this?", icon: "📊",
      q: "One column, two columns, or many? That is the whole decision.",
      note: "Univariate shows shape. Bivariate shows relationship. Multivariate shows " +
            "which columns carry the signal.",
      options: [
        { name: "Histogram", topic: "01_Python/05_Seaborn", also: ["04_ML/15_EDA_Uni_Bi_Multivariate"],
          code: "sns.histplot(df['salary'], kde=True)",
          use: ["One numeric column — the first thing to draw, every time",
                "Shows the shape: bell, long tail, two humps, a wall at zero"],
          avoid: ["Comparing many groups at once — the bars pile up"],
          },

        { name: "Boxplot", topic: "01_Python/05_Seaborn", also: ["02_DataScience/02_IQR"],
          code: "sns.boxplot(data=df, x='department', y='salary')",
          use: ["Spread and extreme values in one picture — the whiskers ARE the IQR fence",
                "Comparing one numeric column across several categories"],
          avoid: ["Showing shape — a box hides two humps completely"],
          },

        { name: "Countplot / bar", topic: "01_Python/05_Seaborn",
          code: "sns.countplot(data=df, x='plan')",
          use: ["One categorical column — how many of each",
                "Checking class imbalance before you model anything"],
          avoid: ["Numeric columns with many distinct values"],
          },

        { name: "Scatter plot", topic: "01_Python/04_Matplotlib",
          also: ["04_ML/15_EDA_Uni_Bi_Multivariate"],
          code: "sns.scatterplot(data=df, x='area', y='price', hue='city')",
          use: ["Two numeric columns — is it a straight line, a curve, or a cloud?",
                "This is the plot that tells you whether a linear model has a chance"],
          avoid: ["Very many rows without transparency — the points merge into one block"],
          },

        { name: "Correlation heatmap", topic: "02_DataScience/04_Correlation",
          code: "sns.heatmap(df.corr(numeric_only=True), annot=True, cmap='coolwarm')",
          use: ["Many numeric columns at once — the fastest read on duplication and signal"],
          avoid: ["Categorical columns, which are simply absent from it"],
          },

        { name: "Pairplot", topic: "04_ML/15_EDA_Uni_Bi_Multivariate",
          code: "sns.pairplot(df, hue='species')",
          use: ["A handful of numeric columns — every pair, plus every distribution, in one grid",
                "Colour by the target and the separable classes jump out"],
          avoid: ["Many columns — the grid grows as the square and becomes unreadable"],
          },

        { name: "Line chart", topic: "01_Python/04_Matplotlib",
          code: "sns.lineplot(data=df, x='date', y='sales')",
          use: ["Rows are in time order and you want the trend"],
          avoid: ["Unordered categories — a line implies a journey between the points"],
          },

        { name: "Plotly", topic: "01_Python/06_Plotly",
          code: "px.scatter(df, x='area', y='price', color='city', hover_data=['id'])",
          use: ["The reader needs to hover, zoom, or filter — an exploration someone else will drive",
                "The chart is going into a web page or a dashboard"],
          avoid: ["A static image for a PDF or a notebook someone reads offline"],
          },

        { name: "Streamlit", topic: "01_Python/07_Streamlit",
          code: "st.plotly_chart(fig, use_container_width=True)",
          use: ["Handing the analysis to someone who will not run a notebook",
                "The fastest route from a working model to something a colleague can click"],
          avoid: ["A one-off answer — a chart in a notebook is enough"],
          }
      ] }
  ]
}

];

/* ══════════════════════════════════════════════════════════════════════════
   Studied, but deliberately NOT on this page.

   These are foundations or whole projects, not a "which one do I pick"
   decision, so a card for them would be padding. build_site.py reads this
   list and stays quiet about them; anything else you study in 04_ML or
   02_DataScience will be reported as missing until it appears above.
   ══════════════════════════════════════════════════════════════════════════ */
const NOT_A_CHOICE = {
  "04_ML/01_What_Is_ML":                 "the framing of the whole subject, not a tool you pick",
  "04_ML/35_Project_Employee_Attrition": "a project that applies every choice on this page"
};

/* ══════════════════════════════════════════════════════════════════════════
   THE DECISION TREES — one per job, drawn on the page as a flowchart.

   A node is one of three things:
     { q: "...", a: [ { label: "...", to: <node> }, … ] }   a question
     { pick: "<option name>" }                              an outcome
     { seq: ["<name>", "<name>", …] }                       do all, in order

   Every "pick" and every name in a "seq" must match an option `name` in that
   job exactly — build_site.py checks it. The questions are the whole point:
   they are what you actually ask yourself at the desk, in the order you ask.
   ══════════════════════════════════════════════════════════════════════════ */

const FLOWS = {

/* ── 1. preparing the data ─────────────────────────────────────────────── */

clean: { seq: ["drop_duplicates()", "Check and fix dtypes", "Know what each column IS"] },

missing: {
  q: "How much of the column is blank?",
  a: [
    { label: "under ~5%, scattered", to: { pick: "df.dropna()" } },
    { label: "more than that", to: {
      q: "What kind of column is it?",
      a: [
        { label: "numeric", to: {
          q: "What shape is it?",
          a: [
            { label: "long tail, or outliers", to: { pick: "SimpleImputer(strategy='median')" } },
            { label: "roughly symmetric",      to: { pick: "SimpleImputer(strategy='mean')" } },
            { label: "small table, columns related", to: { pick: "KNNImputer" } }
          ] } },
        { label: "text / category", to: {
          q: "Does the blank itself mean something?",
          a: [
            { label: "yes — no second phone, never upgraded", to: { pick: "Fill with a 'Missing' category" } },
            { label: "no, it is just absent", to: { pick: "SimpleImputer(strategy='most_frequent')" } }
          ] } },
        { label: "rows are in time order", to: { pick: "ffill / bfill" } }
      ] } }
  ] },

encode: {
  q: "What is this column for?",
  a: [
    { label: "it is the target y", to: { pick: "LabelEncoder" } },
    { label: "it is an input feature", to: {
      q: "Is the order real? Low < Medium < High",
      a: [
        { label: "yes, the order means something", to: { pick: "OrdinalEncoder" } },
        { label: "no, they are just names", to: {
          q: "A quick look, or the real pipeline?",
          a: [
            { label: "just exploring", to: { pick: "pd.get_dummies()" } },
            { label: "the real pipeline", to: { pick: "OneHotEncoder" } }
          ] } }
      ] } }
  ] },

outliers: {
  q: "Is this value possible at all?",
  a: [
    { label: "impossible — age 300, negative price", to: { pick: "Drop the row" } },
    { label: "possible, just rare", to: {
      q: "Is the extreme value the thing you care about?",
      a: [
        { label: "yes — fraud, failure, a spike", to: { pick: "Keep them, use a model that does not care" } },
        { label: "no, it is noise", to: {
          q: "Is the column roughly bell-shaped?",
          a: [
            { label: "yes", to: { pick: "Z-score / 3-sd rule" } },
            { label: "no, it is skewed", to: { pick: "IQR fence, then clip" } }
          ] } }
      ] } }
  ] },

shape: {
  q: "How heavy is the tail?",
  a: [
    { label: "heavy — income, price, page views", to: { pick: "FunctionTransformer(np.log1p)" } },
    { label: "mild, or it is count data", to: { pick: "Square-root transform" } }
  ] },

scale: {
  q: "Does your model measure distance, or fit a weight?",
  a: [
    { label: "no — trees, forests, boosting, Naive Bayes", to: { pick: "Do not scale at all" } },
    { label: "yes — KNN, SVM, PCA, LDA, linear models", to: {
      q: "Are you scaling columns, or whole rows?",
      a: [
        { label: "rows — word counts, a signal vector", to: { pick: "Normalizer" } },
        { label: "columns, the normal case", to: {
          q: "Did extreme values survive cleaning?",
          a: [
            { label: "yes, and they are real", to: { pick: "RobustScaler" } },
            { label: "no, the column is clean", to: {
              q: "Do you need a guaranteed 0–1 range?",
              a: [
                { label: "yes", to: { pick: "MinMaxScaler" } },
                { label: "no", to: { pick: "StandardScaler" } }
              ] } }
          ] } }
      ] } }
  ] },

select: {
  q: "What is actually wrong with the columns?",
  a: [
    { label: "some never vary at all", to: { pick: "VarianceThreshold" } },
    { label: "some repeat each other", to: { pick: "Correlation check, drop one of a pair" } },
    { label: "too many — let the model judge", to: {
      q: "Does your model report importances or coefficients?",
      a: [
        { label: "yes — trees, linear models", to: { pick: "RFE" } },
        { label: "no — KNN, SVM", to: { pick: "SequentialFeatureSelector (forward / backward)" } }
      ] } },
    { label: "classification, and I want fewer dimensions", to: { pick: "LDA as a reduction step" } }
  ] },

split: { seq: ["train_test_split(stratify=y)", "Pipeline + ColumnTransformer"] },

synth: {
  q: "What do you want to practise?",
  a: [
    { label: "predicting a number", to: { pick: "make_regression" } },
    { label: "predicting a label",  to: { pick: "make_classification" } },
    { label: "finding groups",      to: { pick: "make_blobs" } }
  ] },

/* ── 2. choosing a model ───────────────────────────────────────────────── */

reg: {
  q: "Is the relationship a straight line?",
  a: [
    { label: "yes, roughly", to: {
      q: "Are there many columns, or do they repeat each other?",
      a: [
        { label: "no, a small clean set", to: { pick: "LinearRegression" } },
        { label: "yes", to: {
          q: "Do you want the weak columns removed?",
          a: [
            { label: "yes, drop them to zero", to: { pick: "Lasso" } },
            { label: "no, keep them all, just calmer", to: { pick: "Ridge" } },
            { label: "both — and they come in groups", to: { pick: "ElasticNet" } }
          ] } }
      ] } },
    { label: "no, it bends", to: {
      q: "One clear curve, or steps and regions?",
      a: [
        { label: "one clear curve", to: { pick: "PolynomialFeatures + LinearRegression" } },
        { label: "steps, regions, thresholds", to: {
          q: "Explanation, or accuracy?",
          a: [
            { label: "I must explain it", to: { pick: "DecisionTreeRegressor" } },
            { label: "I need the score",  to: { pick: "RandomForestRegressor" } }
          ] } }
      ] } }
  ] },

clf: {
  q: "How much data do you have?",
  a: [
    { label: "very little", to: {
      q: "Can the boundary be written as a rule?",
      a: [
        { label: "no, it is irregular", to: { pick: "KNeighborsClassifier" } },
        { label: "yes, or it is text", to: { pick: "GaussianNB / MultinomialNB" } }
      ] } },
    { label: "a normal amount", to: {
      q: "What do you need most?",
      a: [
        { label: "to explain the decision", to: { pick: "DecisionTreeClassifier" } },
        { label: "a strong score, little tuning", to: { pick: "RandomForestClassifier" } },
        { label: "the last few points of accuracy", to: { pick: "GradientBoosting / AdaBoost" } },
        { label: "models that fail differently, combined", to: { pick: "VotingClassifier" } }
      ] } },
    { label: "many columns, few rows", to: {
      q: "Are the classes roughly round, similar clouds?",
      a: [
        { label: "yes", to: { pick: "LinearDiscriminantAnalysis" } },
        { label: "no, but there is a clear gap", to: { pick: "SVC" } }
      ] } }
  ] },

clu: {
  q: "Do you already know how many groups there are?",
  a: [
    { label: "yes, the business names them", to: { pick: "KMeans" } },
    { label: "no idea", to: {
      q: "Do you want to see every possible k at once?",
      a: [
        { label: "yes, show me the whole history", to: { pick: "AgglomerativeClustering + dendrogram" } },
        { label: "no, just find the elbow", to: { pick: "KMeans" } }
      ] } }
  ] },

/* ── 3. judging it, then shipping it ───────────────────────────────────── */

regmetric: {
  q: "What do you need the number for?",
  a: [
    { label: "is this better than guessing the mean?", to: {
      q: "Comparing models with different column counts?",
      a: [
        { label: "yes", to: { pick: "Adjusted R²" } },
        { label: "no, one fixed model", to: { pick: "R²" } }
      ] } },
    { label: "how far off am I, in real units?", to: {
      q: "Should one big miss hurt more than several small ones?",
      a: [
        { label: "yes, big misses are expensive", to: { pick: "RMSE" } },
        { label: "no, every rupee of error is equal", to: { pick: "MAE" } }
      ] } }
  ] },

clfmetric: {
  q: "Have you looked at the confusion matrix yet?",
  a: [
    { label: "not yet", to: { pick: "Confusion matrix" } },
    { label: "yes, I have", to: {
      q: "Are the classes balanced?",
      a: [
        { label: "yes, and both mistakes cost the same", to: { pick: "Accuracy" } },
        { label: "no, one class is rare", to: {
          q: "Which mistake is expensive?",
          a: [
            { label: "a false alarm", to: { pick: "Precision" } },
            { label: "a miss", to: { pick: "Recall" } },
            { label: "both — give me one number", to: { pick: "F1" } },
            { label: "I have not fixed the threshold yet", to: { pick: "ROC curve and AUC" } }
          ] } }
      ] } }
  ] },

trust: {
  q: "Are the rows in time order?",
  a: [
    { label: "yes — never shuffle them", to: { pick: "Single hold-out split" } },
    { label: "no, order is meaningless", to: {
      q: "Plenty of rows, or few?",
      a: [
        { label: "plenty, and I want a fast answer", to: { pick: "Single hold-out split" } },
        { label: "few — one split cannot be trusted", to: {
          q: "Predicting a label, or a number?",
          a: [
            { label: "a label", to: { pick: "StratifiedKFold" } },
            { label: "a number", to: { pick: "KFold + cross_val_score" } }
          ] } }
      ] } }
  ] },

tune: {
  q: "How big is the search space?",
  a: [
    { label: "a few knobs, a few values each", to: { pick: "GridSearchCV" } },
    { label: "many knobs, wide ranges, or a deadline", to: { pick: "RandomizedSearchCV" } }
  ] },

ship: {
  q: "What are you saving?",
  a: [
    { label: "a scikit-learn model or pipeline", to: { pick: "joblib.dump" } },
    { label: "a plain Python object, no big arrays", to: { pick: "pickle" } }
  ] },

/* ── 4. proving it, and seeing it ──────────────────────────────────────── */

test: {
  q: "What are you comparing?",
  a: [
    { label: "counts in categories", to: { pick: "Chi-square test" } },
    { label: "numeric measurements", to: {
      q: "How many groups?",
      a: [
        { label: "one, against a claimed value", to: {
          q: "Do you know the population sd?",
          a: [
            { label: "yes, and n is large", to: { pick: "One-sample z-test" } },
            { label: "no — the usual case", to: { pick: "One-sample t-test" } }
          ] } },
        { label: "two", to: {
          q: "Same subjects measured twice?",
          a: [
            { label: "yes — before and after", to: { pick: "Paired t-test" } },
            { label: "no — separate people", to: { pick: "Two-sample t-test" } }
          ] } }
      ] } }
  ] },

describe: {
  q: "What do you want to know?",
  a: [
    { label: "the middle, and the spread", to: {
      q: "Long tail, or extreme values?",
      a: [
        { label: "yes", to: { pick: "Median and IQR" } },
        { label: "no, it is symmetric", to: { pick: "Mean and standard deviation" } }
      ] } },
    { label: "how lopsided it is", to: { pick: "Skewness" } },
    { label: "how the columns relate", to: { pick: "Correlation matrix" } }
  ] },

chart: {
  q: "How many columns at once?",
  a: [
    { label: "one", to: {
      q: "Numeric, or a category?",
      a: [
        { label: "numeric", to: {
          q: "Shape, or spread and outliers?",
          a: [
            { label: "the shape", to: { pick: "Histogram" } },
            { label: "spread and outliers", to: { pick: "Boxplot" } }
          ] } },
        { label: "a category", to: { pick: "Countplot / bar" } }
      ] } },
    { label: "two", to: {
      q: "Both numeric?",
      a: [
        { label: "yes", to: { pick: "Scatter plot" } },
        { label: "one of them is time", to: { pick: "Line chart" } }
      ] } },
    { label: "many", to: {
      q: "A handful, or lots?",
      a: [
        { label: "a handful", to: { pick: "Pairplot" } },
        { label: "lots", to: { pick: "Correlation heatmap" } }
      ] } },
    { label: "someone else will click it", to: {
      q: "A chart in a page, or an app?",
      a: [
        { label: "a chart to hover and zoom", to: { pick: "Plotly" } },
        { label: "a whole app for a colleague", to: { pick: "Streamlit" } }
      ] } }
  ] }

};
