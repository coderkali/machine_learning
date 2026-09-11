/* ══════════════════════════════════════════════════════════════════════════
   WHEN TO USE WHAT — the decision layer of this repository.

   Journey answers "what order do I do things in".
   This file answers "which tool do I reach for, right here".

   HAND-MAINTAINED. Nothing in this file is generated, because
   "use when / do not use when" is judgement, not something a script can
   read out of a notebook.

   The stages run in the order the work is really done: look, clean, SPLIT,
   pre-process, feature engineering, choose a model — then, after fit(),
   check the score and ship. The split sits before pre-processing on purpose:
   every step after it learns a number from the data (a median, a category
   list, a mean and sd) and must learn it from the training rows only.
   chooser-tour.js walks a real table through these same stages.

   ── the contract ──────────────────────────────────────────────────────────
   topic / also   folder paths like "04_ML/08_Feature_Scaling".
                  build_site.py FAILS if a folder named here does not exist,
                  and WARNS when a topic you have studied appears nowhere
                  in this file — that is your cue to add its card.

   name           what the technique is called; the flowchart leaves in FLOWS
                  at the bottom of this file must match it exactly
   plain          ONE short sentence in simple English: what it does for you,
                  in words a beginner can read. Shown first on the card; the
                  mechanism and the full lists sit behind "More detail"
   code           the one line you would really type
   how            what the technique ACTUALLY DOES — the mechanism, in two or
                  three sentences, written so the use/avoid lists below follow
                  from it rather than having to be memorised separately
   use / avoid    the two lists that make the decision. Every bullet states the
                  condition AND the reason AND what goes wrong — never a bare
                  label. "Text columns" is not a reason; "text columns, because
                  there is no ordering to take the middle of" is one.

   Only techniques actually studied appear here. If a card is missing, the
   topic has not been learned yet — that is the honest answer, not a gap.
   ══════════════════════════════════════════════════════════════════════════ */

const SPACES = [

/* ════════════════ 1 ════════════════════════════════════════════════════ */
{
  id: "look", n: "1", name: "Look at it", icon: "🔍",
  blurb: "Before you change anything, understand the table. What does one row mean? " +
         "Which column is the answer you want to predict? Nothing gets changed in " +
         "this step.",
  jobs: [

    { id: "describe", name: "Describe one column honestly", icon: "📉",
      q: "What is the middle, and how spread out is it really?",
      note: "Two datasets can share an average and describe completely different worlds.",
      options: [
        { name: "Mean and standard deviation", topic: "02_DataScience/01_Measures_Of_Variability",
          plain: "The average, and the typical distance from it. For columns without huge values.",
          code: "df['x'].mean(), df['x'].std()",
          how: "The centre of mass of the column, and the typical distance from it. Both " +
               "are built from every value in proportion to its size, which is what makes " +
               "them efficient on well-behaved data and fragile on everything else.",
          use: ["A roughly symmetric column with no extreme values, where the mean " +
                "genuinely sits where most of the data is",
                "You need the summary to feed something else. Most statistical tests, and " +
                "most scalers, are built on the mean and the standard deviation",
                "Comparing spread across columns after standardising, where the sd is the " +
                "natural unit"],
          avoid: ["A long tail. The mean then sits where almost nobody actually is — mean " +
                  "income is a figure few people earn — and the sd is inflated by the same " +
                  "tail",
                  "Any column with outliers you decided to keep. One extreme value moves " +
                  "both numbers, and neither describes the bulk of the data any more",
                  "Reporting the mean on its own. Without the spread beside it a mean is " +
                  "not a description of anything"],
          },

        { name: "Median and IQR", topic: "02_DataScience/02_IQR",

          plain: "The middle value, and the spread of the middle half. Safe with huge values.",
          code: "df['x'].median(), df['x'].quantile(.75) - df['x'].quantile(.25)",
          how: "The middle value, and the width of the middle half of the data. Both are " +
               "positions rather than magnitudes, so no single extreme value can shift " +
               "either of them.",
          use: ["A skewed column — income, price, waiting time. The median answers what a " +
                "typical person actually experiences",
                "Extreme values are present and you do not want them moving the summary",
                "Reporting to a business audience. The median salary is a sentence people " +
                "understand correctly; the mean salary is one they routinely misunderstand"],
          avoid: ["Nothing, really. When in doubt report both this and the mean and let the " +
                  "gap between them speak — a large gap is itself the finding",
                  "Feeding a downstream method that specifically requires the mean, as most " +
                  "parametric tests do"],
          },

        { name: "Skewness", topic: "02_DataScience/03_Skewness",

          plain: "One number for how lopsided a column is.",
          code: "df['x'].skew()",
          how: "One number for the asymmetry of a column. Zero is symmetric, positive means " +
               "the tail runs to the right, negative means it runs to the left, and as a " +
               "rough working rule anything beyond about plus or minus one is worth acting " +
               "on.",
          use: ["Deciding whether a column needs a log or square-root transform before a " +
                "linear model",
                "A positive value means a tail to the right, which is the usual case for " +
                "money, counts and durations",
                "As a quick scan across many columns at once, to decide which ones deserve " +
                "a proper look"],
          avoid: ["Reading it alone. Always put the histogram beside it — two humps can " +
                  "produce a skew near zero and look perfectly well behaved",
                  "Applying a fixed threshold mechanically. Whether a skew matters depends " +
                  "on what you are about to fit, and a tree does not care at all",
                  "Computing it on a small sample, where the statistic is very unstable " +
                  "from one draw to the next"],
          },

        { name: "Correlation matrix", topic: "02_DataScience/04_Correlation",

          plain: "How strongly each pair of number columns moves together, from -1 to +1.",
          code: "sns.heatmap(df.corr(numeric_only=True), annot=True)",
          how: "Pearson correlation between every pair of numeric columns, running from -1 " +
               "to +1. It measures only how well a straight line describes each pair, which " +
               "is at once its usefulness and its entire limitation.",
          use: ["Spotting which columns move with the target and which duplicate each " +
                "other, in a single look",
                "Before fitting a linear model, since correlated inputs are exactly what " +
                "makes a coefficient table unreadable",
                "As a first pass over a wide table, to decide which pairs are worth a " +
                "scatter plot"],
          avoid: ["Reading a low value as no relationship. It only sees straight lines, so " +
                  "a perfect U shape scores near zero and looks like noise",
                  "Reading a high value as cause. Two columns can move together because a " +
                  "third drives both, and the matrix has no way to tell you so",
                  "Forgetting that it ignores categorical columns completely, so the " +
                  "strongest driver in your data may simply not appear on it",
                  "Outliers, which are quite capable of creating or destroying a " +
                  "correlation on their own"],
          }
      ] },

    { id: "chart", name: "Which chart answers this?", icon: "📊",
      q: "One column, two columns, or many? That is the whole decision.",
      note: "Univariate shows shape. Bivariate shows relationship. Multivariate shows " +
            "which columns carry the signal.",
      options: [
        { name: "Histogram", topic: "01_Python/05_Seaborn",
          plain: "Bars showing how many rows fall in each range. The shape of one number column.",
          also: ["04_ML/15_EDA_Uni_Bi_Multivariate"],
          code: "sns.histplot(df['salary'], kde=True)",
          how: "Buckets one numeric column into bins and draws how many rows fall into " +
               "each. The bin width is a choice you are making whether you think about it " +
               "or not — too few bins hides structure, too many turns the shape into noise.",
          use: ["One numeric column. This is the first thing to draw, every time, before " +
                "any modelling decision",
                "Reading the shape: bell, long tail, two humps, a wall at zero, a spike at " +
                "some default value",
                "Spotting data quality problems. A pile at exactly 0 or 999 is almost " +
                "always a placeholder rather than a measurement"],
          avoid: ["Comparing many groups at once, where the bars pile up and hide each " +
                  "other. Use a boxplot or a faceted grid instead",
                  "Accepting the default bin count without ever trying another. The " +
                  "apparent shape can change entirely",
                  "Very few rows, where the histogram is showing you the sample rather than " +
                  "the distribution"],
          },

        { name: "Boxplot", topic: "01_Python/05_Seaborn",

          plain: "The middle, the spread and the outliers of one number column, in one picture.",
          also: ["02_DataScience/02_IQR"],
          code: "sns.boxplot(data=df, x='department', y='salary')",
          how: "Draws the median, a box from the first to the third quartile, and whiskers " +
               "reaching out to 1.5 IQRs, with anything past them drawn as an individual " +
               "point. It is the IQR outlier rule made visible.",
          use: ["Spread and extreme values in one picture — the whiskers are literally the " +
                "IQR fence",
                "Comparing one numeric column across several categories, which it does " +
                "better than anything else",
                "A compact summary when there are many groups and no room for many " +
                "histograms"],
          avoid: ["Showing shape. A box hides two humps completely — a bimodal column and a " +
                  "uniform one can draw an identical box. Overlay the points, or use a " +
                  "violin plot",
                  "Small groups, where quartiles computed from six points imply a precision " +
                  "that is not there",
                  "Assuming every point past a whisker is an error. That is the rule's " +
                  "definition of unusual, not a verdict"],
          },

        { name: "Countplot / bar", topic: "01_Python/05_Seaborn",

          plain: "One bar per category, showing how many rows each one has.",
          code: "sns.countplot(data=df, x='plan')",
          how: "One bar per category, its height the number of rows. It is the categorical " +
               "counterpart of the histogram, with the difference that the bins are given " +
               "to you rather than chosen.",
          use: ["One categorical column — how many of each, ordered so the reader can " +
                "actually compare them",
                "Checking class imbalance before you model anything. This is the plot that " +
                "tells you whether accuracy is going to be a misleading metric",
                "Spotting rare levels that will need grouping before they reach a one-hot " +
                "encoder"],
          avoid: ["Numeric columns with many distinct values, where a histogram is the " +
                  "right chart",
                  "High-cardinality categories. Fifty bars is a table pretending to be a " +
                  "chart — show the top ten and an Other",
                  "Starting the axis anywhere but zero, which in a bar chart specifically " +
                  "exaggerates the differences"],
          },

        { name: "Scatter plot", topic: "01_Python/04_Matplotlib",

          plain: "One dot per row, placed by two number columns.",
          also: ["04_ML/15_EDA_Uni_Bi_Multivariate"],
          code: "sns.scatterplot(data=df, x='area', y='price', hue='city')",
          how: "One point per row, placed by two numeric columns. It is the only plot that " +
               "shows the actual joint shape of a relationship rather than a summary of it, " +
               "which is why it comes before the model.",
          use: ["Two numeric columns — is this a straight line, a curve, or a formless " +
                "cloud",
                "This is the plot that tells you whether a linear model has any chance, " +
                "before you fit one and puzzle over a disappointing R²",
                "Colour by a third column with hue= to see whether the relationship differs " +
                "between groups",
                "Residuals against fitted values after modelling, which is the same plot " +
                "doing diagnostic work"],
          avoid: ["Very many rows without transparency. The points merge into a solid block " +
                  "and the density becomes invisible — set alpha, or use a hexbin plot",
                  "Reading a pattern into a cloud. If it looks like nothing, that is itself " +
                  "the finding",
                  "Two categorical columns, where every point lands on a grid and they " +
                  "overlap completely"],
          },

        { name: "Correlation heatmap", topic: "02_DataScience/04_Correlation",

          plain: "The correlation table drawn as colours, to scan many columns at once.",
          code: "sns.heatmap(df.corr(numeric_only=True), annot=True, cmap='coolwarm')",
          how: "The correlation matrix drawn as a grid of colour. Colour is what lets you " +
               "scan a large matrix in one glance, which is the whole advantage over " +
               "reading the numbers themselves.",
          use: ["Many numeric columns at once — the fastest read on duplication and on " +
                "which columns relate to the target",
                "With annot=True on a small matrix, so you get the colour and the number " +
                "together",
                "With a diverging colourmap centred on zero, since -1 and +1 are opposites " +
                "and 0 is the meaningful middle"],
          avoid: ["Categorical columns, which are simply absent from it — and their absence " +
                  "is very easy to forget",
                  "Very many columns, where the cells shrink past readability and the " +
                  "picture becomes decorative rather than informative",
                  "The same misreadings as the matrix behind it: low is not no " +
                  "relationship, and high is not cause"],
          },

        { name: "Pairplot", topic: "04_ML/15_EDA_Uni_Bi_Multivariate",

          plain: "A grid of scatter plots for every pair of a few columns.",
          code: "sns.pairplot(df, hue='species')",
          how: "A grid with every pair of numeric columns as a scatter plot and each " +
               "column's own distribution down the diagonal. It is a whole exploratory " +
               "session in one command, which is exactly why it stops working as the column " +
               "count grows.",
          use: ["A handful of numeric columns — every pair, plus every distribution, in one " +
                "grid",
                "Colour by the target with hue= and separable classes jump straight out of " +
                "the page",
                "Early exploration, when you do not yet know which pair is worth a chart of " +
                "its own"],
          avoid: ["Many columns. The grid grows with the square of the count, so ten " +
                  "columns is a hundred panels and none of them is readable",
                  "Large row counts, where every panel becomes a solid block and the whole " +
                  "grid is slow to draw",
                  "As a chart for someone else. It is a tool for you, not a finding for an " +
                  "audience"],
          },

        { name: "Line chart", topic: "01_Python/04_Matplotlib",

          plain: "Points joined in order. Only when the x axis is time, or another real order.",
          code: "sns.lineplot(data=df, x='date', y='sales')",
          how: "Joins points in order along the x axis. That connecting line is a claim " +
               "that the space between two points means something, so it belongs to " +
               "genuinely continuous sequences and nothing else.",
          use: ["Rows are in time order and you want the trend, the seasonality, or the " +
                "point where it broke",
                "Several series on one pair of axes, where comparing them over time is the " +
                "whole point",
                "Learning curves and validation curves, which are lines because their x " +
                "axis really is ordered"],
          avoid: ["Unordered categories. A line between Mumbai and Chennai implies a " +
                  "journey between them, and there is no such journey",
                  "Very irregular sampling, where the line invents a smooth path across a " +
                  "gap in which you measured nothing at all",
                  "Too many series at once. Past about five the chart is a tangle and no " +
                  "single line can be followed"],
          },

        { name: "Plotly", topic: "01_Python/06_Plotly",

          plain: "Charts the reader can hover over and zoom into.",
          code: "px.scatter(df, x='area', y='price', color='city', hover_data=['id'])",
          how: "Renders a chart as interactive HTML rather than a static image, so " +
               "hovering, zooming and filtering by legend come for free. The cost is that " +
               "the output is a web object rather than a picture.",
          use: ["The reader needs to hover, zoom or filter — an exploration someone else " +
                "will drive without you in the room",
                "The chart is going into a web page or a dashboard",
                "Many points, where hovering to identify one is genuinely useful and " +
                "hover_data can carry the id along"],
          avoid: ["A static image for a PDF, a printout, or a notebook someone reads " +
                  "offline where the JavaScript will never run",
                  "A chart inside a git-tracked notebook, where the embedded HTML bloats " +
                  "every diff",
                  "A simple plot seaborn draws in one line. Interactivity nobody uses is " +
                  "just weight"],
          },

        { name: "Streamlit", topic: "01_Python/07_Streamlit",

          plain: "Turn a Python script into a small web app with sliders and buttons.",
          code: "st.plotly_chart(fig, use_container_width=True)",
          how: "Turns a Python script into a web app by re-running the whole script " +
               "whenever a widget changes. There is no callback model to learn, which is " +
               "why the distance from a working notebook to something a colleague can click " +
               "is so short.",
          use: ["Handing the analysis to someone who will not run a notebook — the model " +
                "becomes a thing they can click rather than a file they cannot open",
                "The fastest route from a working model to a demo, when what you need back " +
                "is feedback rather than a deployment",
                "An internal tool where a form and a chart is genuinely the whole " +
                "requirement"],
          avoid: ["A one-off answer, where a chart in a notebook is enough and the app is " +
                  "overhead you will then have to maintain",
                  "A production, multi-user, authenticated application. Re-running the " +
                  "script on every interaction does not scale the way a real web framework " +
                  "does",
                  "Heavy computation on every interaction, unless it is safely behind " +
                  "st.cache_data"],
          }
      ] },

    { id: "test", name: "Is this difference real?", icon: "⚖️",
      q: "Two numbers differ. Is that an effect, or a run of good luck?",
      note: "Assume nothing happened, then ask how surprising your result would be if that " +
            "were true. A small p-value means the data is hard to explain by luck alone.",
      options: [
        { name: "One-sample z-test", topic: "02_DataScience/07_Z_Test",
          plain: "Is this average different from a claimed value? When you already know the true spread.",
          also: ["02_DataScience/11_Z_Test_vs_T_Test", "02_DataScience/05_Central_Limit_Theorem"],
          code: "z = (x_bar - mu) / (sigma / n**0.5)",
          how: "Compares a sample mean against a claimed population mean by dividing the " +
               "gap by the standard error. It reads the result off the normal distribution, " +
               "which is only justified when the population standard deviation is genuinely " +
               "known rather than estimated.",
          use: ["You know the population standard deviation — in practice a " +
                "long-established process with a documented sigma, not one you worked out " +
                "from this very sample",
                "A large sample, roughly 30 or more, so the Central Limit Theorem makes the " +
                "sampling distribution of the mean approximately normal whatever the raw " +
                "data looks like",
                "Proportions at large n, where the normal approximation to the binomial " +
                "holds comfortably"],
          avoid: ["A small sample with an unknown standard deviation. That is precisely the " +
                  "case the t-test was invented for, and its heavier tails are the " +
                  "correction you are missing",
                  "Estimating sigma from the sample and then treating it as known. That " +
                  "understates the uncertainty and hands you a p-value that is too small",
                  "Strongly skewed data at small n, where the Central Limit Theorem has not " +
                  "yet rescued you"],
          },

        { name: "One-sample t-test", topic: "02_DataScience/08_T_Test",

          plain: "Is this average different from a claimed value? The usual case.",
          also: ["02_DataScience/06_Hypothesis_Testing_Basics"],
          code: "ttest_1samp(sample, popmean=50)",
          how: "Compares one group's mean against a claimed value, using the sample's own " +
               "standard deviation as the estimate of spread. The t distribution has " +
               "heavier tails than the normal — that is the price of not knowing sigma — " +
               "and those tails thin out as the sample grows.",
          use: ["Comparing one group's mean against a claimed or target value: a stated " +
                "SLA, a specification, last year's average",
                "The population standard deviation is unknown, which is almost always the " +
                "real situation",
                "Any sample size. At large n the t and z answers converge anyway, so the " +
                "t-test is simply the safer default of the two"],
          avoid: ["Comparing two separate groups. Use the two-sample form — testing each " +
                  "against a constant separately does not answer the question you asked",
                  "Strongly skewed data at small n. The test assumes the sampling " +
                  "distribution of the mean is roughly normal, and with eight skewed points " +
                  "it is not",
                  "Reading a small p-value as a large effect. It says the difference is " +
                  "unlikely to be chance, not that it is big enough to act on — report the " +
                  "effect size beside it"],
          },

        { name: "Two-sample t-test", topic: "02_DataScience/08_T_Test",

          plain: "Do two separate groups have different averages?",
          code: "ttest_ind(group_a, group_b)",
          how: "Tests whether two independent groups have different means, by weighing the " +
               "gap between them against the variability inside them. ttest_ind assumes " +
               "equal variances by default, and equal_var=False switches to Welch's " +
               "version, which does not.",
          use: ["Two independent groups of different people or units — control against " +
                "variant, branch A against branch B",
                "An A/B test, which is exactly this shape: two groups, one metric, one " +
                "comparison",
                "With equal_var=False as the standing habit. Welch's test costs almost " +
                "nothing when the variances really are equal, and is far safer when they " +
                "are not"],
          avoid: ["The same people measured twice. That is a paired test, and using this " +
                  "one discards the pairing along with most of your statistical power",
                  "More than two groups compared pair by pair. Each comparison carries its " +
                  "own false-positive risk, so use ANOVA or correct for the multiplicity",
                  "Groups that are not really independent — the same customer appearing in " +
                  "both, or units drawn from within the same store"],
          },

        { name: "Paired t-test", topic: "02_DataScience/09_Paired_T_Test",

          plain: "Did the same people change, before versus after?",
          code: "ttest_rel(before, after)",
          how: "Subtracts each pair and runs a one-sample test on the differences. Because " +
               "every subject acts as its own control, everything that varies between " +
               "subjects cancels out — which is why it detects far smaller effects than the " +
               "two-sample test on the same data.",
          use: ["The same subjects measured twice — before and after training, the same " +
                "store month on month, the same server under two configurations",
                "Naturally matched pairs: twins, left and right, a matched control per case",
                "Whenever pairing exists at all. Ignoring it throws away information you " +
                "have already paid to collect"],
          avoid: ["Two unrelated groups, or groups of unequal size. There is simply nothing " +
                  "to pair",
                  "Pairs that are not genuinely pairs. If the matching is arbitrary the " +
                  "assumption is false and the answer cannot be trusted",
                  "Misaligned rows. before and after must line up one for one, and a silent " +
                  "misalignment produces a confident, meaningless result"],
          },

        { name: "Chi-square test", topic: "02_DataScience/10_Chi_Square_Test",

          plain: "Are two category columns related — for example, overtime and leaving?",
          code: "chi2_contingency(pd.crosstab(df.city, df.churn))",
          how: "Compares the counts you actually observed in a contingency table against " +
               "the counts you would expect if the two categories were unrelated. The " +
               "larger the total gap across the cells, the less plausible independence " +
               "becomes.",
          use: ["Both columns are categories — is churn related to plan type, is defect " +
                "rate related to shift",
                "You are working with counts in a table rather than with means",
                "Testing whether an observed distribution matches an expected one, which is " +
                "the goodness-of-fit form of the same idea"],
          avoid: ["Numeric columns. Binning one to force it through a chi-square discards " +
                  "information, and the answer then depends on the bins you happened to " +
                  "choose",
                  "Very small expected counts in a cell. Below about 5 the approximation " +
                  "stops holding — use Fisher's exact test on a small two-by-two table",
                  "Reading it as a measure of strength. It tells you whether an association " +
                  "exists, not how large it is; Cramer's V is the statistic that reports " +
                  "size",
                  "Paired or repeated categorical measurements, where McNemar's test is the " +
                  "correct one"],
          }
      ] },

    { id: "synth", name: "No data yet, or testing an idea", icon: "\u{1F9EA}",
      q: "I want to try a technique, but I do not have a suitable dataset.",
      note: "Generated data is the one case where you already know the right answer, " +
            "so you can check whether the model actually found it. Reference only \u2014 " +
            "this never appears in a real plan.",
      options: [
        { name: "make_regression", topic: "04_ML/14_Synthetic_Datasets",
          plain: "Make a practice table where the answer is a number.",
          also: ["04_ML/03_Data_Collection"],
          code: "make_regression(n_samples=200, n_features=1, noise=15, random_state=42)",
          how: "Generates X and y from a linear relationship it builds for you, then adds " +
               "Gaussian noise of a size you choose. Because you set the truth, you know in " +
               "advance what the best achievable score is — which is the entire point of " +
               "it.",
          use: ["Checking that a regression technique behaves the way the theory says, with " +
                "no data quality problems standing in the way",
                "You set the noise, so you know exactly how good the score ought to be and " +
                "can tell a bug apart from a genuinely hard problem",
                "Teaching or debugging — reproducing an effect such as multicollinearity or " +
                "the leverage of a single outlier, on demand"],
          avoid: ["Claiming anything about the real world from it. The relationship came " +
                  "out linear because you asked for a linear one",
                  "Benchmarking models against each other. A generator built on a linear " +
                  "rule will always flatter linear models"],
          },

        { name: "make_classification", topic: "04_ML/14_Synthetic_Datasets",

          plain: "Make a practice table where the answer is a class.",
          code: "make_classification(n_samples=500, n_informative=3, weights=[0.95, 0.05])",
          how: "Builds a classification problem from clusters placed around the corners of " +
               "a hypercube, with the number of genuinely informative columns, the number " +
               "of redundant ones and the class balance all under your control.",
          use: ["Practising with a deliberately imbalanced target through weights=[0.95, " +
                "0.05], so you can watch precision, recall and the confusion matrix behave " +
                "under imbalance",
                "Comparing classifiers on a boundary whose true shape you chose",
                "Checking that a resampling strategy or class_weight does what you believe " +
                "it does, on a case where the right answer is known"],
          avoid: ["Tuning hyperparameters you then carry across to real data. They are " +
                  "tuned to the generator, not to your problem",
                  "Reporting its accuracy as evidence of anything. n_informative and " +
                  "class_sep are dials, and they set the score directly"],
          },

        { name: "make_blobs", topic: "04_ML/14_Synthetic_Datasets",

          plain: "Make practice points in clear groups, for trying clustering.",
          code: "make_blobs(n_samples=300, centers=4, cluster_std=1.0, random_state=42)",
          how: "Draws points from a small number of round Gaussian clusters whose centres " +
               "and spread you choose. You know the true grouping, so you can check whether " +
               "a clustering algorithm actually recovered it.",
          use: ["Clustering practice, where you know the true k and can check whether " +
                "KMeans found it",
                "Seeing what the elbow method and the silhouette score look like on a case " +
                "where the answer is genuinely known, so you learn to read them",
                "Showing why scaling matters for clustering, by giving one dimension a much " +
                "larger spread than the others"],
          avoid: ["Concluding that KMeans works well in general. Blobs are exactly the " +
                  "round, similarly sized shape KMeans assumes, so it can hardly fail here",
                  "Testing density or shape-based clustering. Use make_moons or " +
                  "make_circles, where round clusters are the wrong model and the " +
                  "difference actually shows"],
          }
      ] }
  ]
},

/* ════════════════ 2 ════════════════════════════════════════════════════ */
{
  id: "clean", n: "2", name: "Clean it", icon: "🧹",
  blurb: "Fix what is plainly wrong: copied rows, one word spelled three ways, " +
         "numbers stored as text, values that cannot be true.",
  jobs: [

    { id: "clean", name: "Clean the table first", icon: "\u{1F9FD}",
      q: "Before any of this: is the table itself sound?",
      note: "Three quiet defects break everything downstream. One word spelled three ways " +
            "becomes three categories. A duplicated row leaks across " +
            "the train/test split. A number stored as text silently disables arithmetic, " +
            "and no error is ever raised.",
      options: [
        { name: "Fix inconsistent spellings", topic: "04_ML/35_Project_Employee_Attrition",
          plain: "Make 'Male', 'male ' and 'MALE' the same word, so one group is not split into three.",
          code: "df['Gender'] = df['Gender'].str.strip().str.capitalize()",
          how: "str.strip() removes spaces at the start and end of every value; " +
               "str.capitalize() makes the first letter upper-case and the rest " +
               "lower-case. After both, 'MALE', 'male' and 'Male ' are the same string, so " +
               "they are counted, grouped and encoded as one category instead of several.",
          use: ["Any text column typed in by people or joined from several systems. In the " +
                "attrition project Gender arrived in eight spellings, and one-hot encoding " +
                "it unfixed would have made eight columns instead of two",
                "Before counting, grouping or encoding. value_counts() on an unfixed column " +
                "splits one real group into several small ones, and every chart and encoder " +
                "after it inherits the split",
                "Before drop_duplicates(). Two rows that differ only by 'Yes' and 'YES' are " +
                "the same row, but they are not caught as copies until the spelling is " +
                "fixed"],
          avoid: ["Columns where capital letters carry meaning — product codes, IDs or " +
                  "anything case-sensitive, where 'ab12' and 'AB12' are different things",
                  "Expecting it to fix real typos. It fixes spaces and capital letters only; " +
                  "'Mael' or 'Femal' still need a replace() mapping, so look at " +
                  "value_counts() afterwards"],
          },

        { name: "drop_duplicates()", topic: "04_ML/09_Duplicates_And_Dtypes",

          plain: "Delete rows that are exact copies, so the same person is not counted twice.",
          also: ["04_ML/04_Data_Cleaning"],
          code: "df = df.drop_duplicates()",
          how: "Compares whole rows and keeps only the first copy of each. By default every " +
               "column has to match; pass subset=['order_id'] to define what counts as the " +
               "same row by a business key instead. It returns a new frame, so nothing is " +
               "removed unless you assign the result back.",
          use: ["Exactly repeated rows, which almost always come out of a bad join or a " +
                "load script that ran twice. The duplicate is an artefact of your plumbing, " +
                "not a second real event",
                "Before the train/test split, always. If a row survives on both sides the " +
                "model is tested on something it has already memorised, and the score is " +
                "inflated by an amount you can no longer measure",
                "With subset= when a business key defines identity — one row per order_id, " +
                "even when a timestamp or a load_date column differs"],
          avoid: ["Rows that are identical but are genuinely different events. Two " +
                  "customers can buy the same item at the same price in the same minute, " +
                  "and deleting one erases a real sale",
                  "Without deciding which copy survives. It keeps the first by default, so " +
                  "sort deliberately beforehand or pass keep='last' — otherwise row order " +
                  "in the file is silently making the choice"],
          },

        { name: "Check and fix dtypes", topic: "04_ML/09_Duplicates_And_Dtypes",

          plain: "Make sure number columns are really stored as numbers, not as text.",
          also: ["04_ML/02_Types_Of_Variables"],
          code: "df.info()\ndf['amount'] = pd.to_numeric(df['amount'], errors='coerce')",
          how: "df.info() reports the dtype pandas guessed for each column when it read the " +
               "file, and object almost always means the column came in as text. " +
               "pd.to_numeric re-parses it, and errors='coerce' turns anything it cannot " +
               "parse into NaN instead of raising.",
          use: ["On the first day with any new table, every time. The dtype decides which " +
                "operations are even legal, and the wrong one fails quietly rather than " +
                "loudly",
                "Whenever a column you expect to be numeric shows dtype object. That " +
                "normally means a thousands comma, a currency symbol, a trailing space or " +
                "an empty string somewhere in it",
                "Before any arithmetic at all. For strings '10' + '5' is '105' and no error " +
                "is ever raised, so the number is simply wrong from that line onwards"],
          avoid: ["Forcing a type without errors='coerce'. A single malformed row raises " +
                  "and stops the whole load, which is worse than a NaN you can count and " +
                  "look at",
                  "Coercing and then walking away. errors='coerce' converts bad values into " +
                  "blanks, so count them immediately afterwards — a coercion that quietly " +
                  "created four thousand NaNs is a data problem, not a fix"],
          },

        { name: "Know what each column IS", topic: "04_ML/02_Types_Of_Variables",

          plain: "Decide what each column means — an amount, a name, or a ranking — before you touch it.",
          code: "# numeric \u2192 arithmetic  |  nominal \u2192 one-hot  |  ordinal \u2192 keep the order",
          how: "A judgement you make per column, not something a function returns. Numeric " +
               "means arithmetic on it is meaningful. Nominal means the values are names " +
               "with no order. Ordinal means there is a real order but the gaps between the " +
               "levels are not measurable.",
          use: ["Before choosing any encoder or any scaler. The column's meaning is what " +
                "makes that choice, and every tool downstream assumes you have already made " +
                "it",
                "Whenever a number might not be a quantity. Pin codes, customer IDs and " +
                "survey response codes are stored as integers, but their average is " +
                "meaningless",
                "On ordinal columns above all, because they are the only kind where you " +
                "must supply the order yourself — nothing in the pipeline knows that Bronze " +
                "comes before Silver"],
          avoid: ["Trusting the dtype as the answer. A dtype tells you how a value is " +
                  "stored, not what it means, and a pin code stored as int64 is still a " +
                  "category",
                  "Treating an ordinal column as nominal by reflex. One-hot encoding " +
                  "Low/Medium/High discards the ordering, which is usually the most useful " +
                  "thing that column had"],
          }
      ] },

    { id: "outliers", name: "Extreme values", icon: "🎯",
      q: "Is this row wrong, or just rare? One gets removed. The other is the finding.",
      note: "Decide what the point IS before deciding what to do with it. " +
            "An age of 300 is an error. A salary of 40 lakh is a person.",
      options: [
        { name: "IQR fence, then clip", topic: "04_ML/07_Outliers",
          plain: "Find values far outside the usual middle range, and pull them back to the edge.",
          also: ["02_DataScience/02_IQR"],
          code: "lo, hi = q1 - 1.5*iqr, q3 + 1.5*iqr\ndf['x'] = df['x'].clip(lo, hi)",
          how: "Takes the middle half of the data, from the first quartile to the third, " +
               "and calls anything more than 1.5 IQRs beyond either quartile an outlier. " +
               "clip then pulls those values back to the fence rather than deleting the row " +
               "they sit in.",
          use: ["Any shape of distribution. Quartiles are positions, so unlike the " +
                "three-sigma rule this assumes nothing about a bell curve",
                "You want to keep the row. Clipping leaves every other column of that row " +
                "usable while stopping one value from dominating a scaler or a " +
                "least-squares fit",
                "Skewed columns above all, where the mean and standard deviation are " +
                "already distorted by the very points you are trying to find"],
          avoid: ["The extreme value is the thing you are trying to predict — fraud, " +
                  "equipment failure, a demand spike. You have just clipped away the signal " +
                  "and kept the noise",
                  "Computing the fence on the full dataset. Learn lo and hi on the training " +
                  "data only, or the test set has quietly shaped your preprocessing",
                  "Small samples, where the quartiles themselves are unstable and the fence " +
                  "moves noticeably with each new point"],
          },

        { name: "Z-score / 3-sd rule", topic: "04_ML/07_Outliers",

          plain: "Remove values more than 3 standard deviations from the average. Only for bell-shaped columns.",
          code: "df = df[(df['x'] - df['x'].mean()).abs() <= 3*df['x'].std()]",
          how: "Measures each value as a number of standard deviations from the mean and " +
               "removes anything beyond three. Under a normal distribution about 0.3% of " +
               "values fall outside that band, which is the entire justification for the " +
               "rule.",
          use: ["The column really is roughly bell-shaped. Check that on a histogram before " +
                "trusting the rule, not after it has deleted rows",
                "Measurement error in a physical quantity, where whatever produces the " +
                "outliers is genuinely a different mechanism from whatever produces the " +
                "data"],
          avoid: ["A skewed column. The mean and standard deviation are themselves pulled " +
                  "by the points you are hunting, so the band widens to swallow them and " +
                  "the rule finds almost nothing",
                  "Small samples, where the standard deviation is unstable and three of " +
                  "them may be wider than the data actually is",
                  "Any column whose tail is real. Income has a long right tail by nature, " +
                  "and being three standard deviations out does not make a value wrong"],
          },

        { name: "Drop the row", topic: "04_ML/07_Outliers",

          plain: "Delete rows whose value cannot be true, like age 300 or a negative price.",
          code: "df = df[df['age'] < 120]",
          how: "Filters the frame with a condition. It is the only outlier action that " +
               "destroys data, so it belongs to values that cannot be true rather than " +
               "values that merely surprise you.",
          use: ["The value is impossible — a negative price, an age of 300, a delivery date " +
                "before its order date. That is a defect, and a defect is not data",
                "You can state the rule that makes it impossible in one sentence, to " +
                "someone else, without referring to the model",
                "Corrupt or partial loads, where the row never represented a real event in " +
                "the first place"],
          avoid: ["The value is merely surprising. Surprising is data and impossible is a " +
                  "defect, and confusing the two is how a genuine finding gets deleted",
                  "Dropping rows to make a score improve. That is fitting the data to the " +
                  "model, and it will not survive contact with production",
                  "Dropping many rows without counting them and saying so. A rule that " +
                  "removed 8% of the data has changed the question you are answering, and " +
                  "the change needs to be visible"],
          },

        { name: "Keep them, use a model that does not care", topic: "04_ML/27_Decision_Tree_Regression",

          plain: "Leave the extreme values in, and use a tree model, which is not bothered by them.",
          also: ["04_ML/34_Ensemble_Methods", "04_ML/38_Robust_Regression"],
          code: "DecisionTreeRegressor()   # splits, never averages distance",
          how: "A tree splits on the order of values and never on the distance between " +
               "them, so replacing 200 with 200,000 changes nothing as long as the ordering " +
               "holds. Robust regressors carry the same idea into a straight-line fit by " +
               "down-weighting large residuals instead of squaring them.",
          use: ["The extremes are real and you refuse to fake them. This is the honest " +
                "option whenever the tail is part of the phenomenon rather than a fault in " +
                "the data",
                "A tree, forest or boosting model is acceptable for the problem. They are " +
                "unmoved by any order-preserving change to a feature, so outliers in X cost " +
                "them very little",
                "You need a straight line anyway. Then reach for a robust fitter such as " +
                "HuberRegressor or RANSAC rather than deleting rows to protect an ordinary " +
                "least-squares fit"],
          avoid: ["You have already committed to plain LinearRegression. Least squares " +
                  "squares the residual, so a single far point can dominate the whole fit",
                  "The wild values are in the target y rather than in X. A tree is robust " +
                  "to outliers in the features; it is much less robust to nonsense in the " +
                  "thing it is trying to predict",
                  "Distance-based models. KNN and SVM feel every extreme value directly, " +
                  "through the metric itself"],
          }
      ] }
  ]
},

/* ════════════════ 3 ════════════════════════════════════════════════════ */
{
  id: "split", n: "3", name: "Split it", icon: "✂️",
  blurb: "Lock away about a fifth of the rows as a test set, now — before any step " +
         "that learns from the data.",
  jobs: [

    { id: "split", name: "Keeping the test honest", icon: "✂",
      q: "Have I split before anything learns from the data?",
      note: "This is the one rule with no exception. Split first, then fit every transformer " +
            "on the training half only. A scaler fitted on the whole table has already read the test set.",
      options: [
        { name: "train_test_split(stratify=y)", topic: "04_ML/13_Train_Test_Split",
          plain: "Hide about 20% of the rows as a test set, with the same Yes/No mix as the full table.",
          code: "train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)",
          how: "Shuffles the rows and cuts them into a training part and a held-out test " +
               "part. stratify=y makes the cut preserve the class proportions on both " +
               "sides, and random_state makes the same cut happen every time the file runs.",
          use: ["Every supervised problem, as the first line after loading — before any " +
                "imputing, scaling or encoding, so that nothing you fit can ever have seen " +
                "the test rows",
                "stratify=y on any classification problem, and above all an imbalanced one. " +
                "Without it a rare class can land almost entirely on one side of the split " +
                "by chance",
                "random_state fixed to a number, so a score you quote today can be " +
                "reproduced tomorrow"],
          avoid: ["Time-ordered rows split at random. You would train on the future and " +
                  "test on the past, and the score you get is not one production can " +
                  "deliver. Split by date instead",
                  "Grouped rows — several visits by one patient, several orders by one " +
                  "customer. A random split puts the same person on both sides and the " +
                  "model learns to recognise the person rather than the pattern. Use " +
                  "GroupShuffleSplit",
                  "Re-running the split with new random_states until the score looks good. " +
                  "That is choosing a test set that flatters the model"],
          },

        { name: "Pipeline + ColumnTransformer", topic: "04_ML/12_Preprocessing",

          plain: "Put every preparation step and the model in one object, so each step learns from training rows only.",
          code: "Pipeline([('prep', ColumnTransformer([...])), ('model', Ridge())])",
          how: "A Pipeline chains preprocessing steps and a model into one object with a " +
               "single fit and a single predict. A ColumnTransformer routes different " +
               "columns down different paths — numeric to the imputer and scaler, " +
               "categorical to the encoder — and hands the model one matrix at the end.",
          use: ["Always, the moment you have more than one preprocessing step",
                "It makes leakage structurally impossible. fit() only ever sees the fold it " +
                "was given, so the scaler's mean and the imputer's median cannot be learned " +
                "from test data even by accident",
                "Numeric and categorical columns need different treatment, and this keeps " +
                "that in one object instead of two parallel scripts you have to remember to " +
                "keep in step",
                "Cross-validation and grid search, which refit the entire chain on each " +
                "fold. Without a pipeline, cross_val_score run on already-scaled data is " +
                "quietly wrong and still prints a number",
                "Deployment, because the whole chain pickles as one object and scoring " +
                "becomes a single call"],
          avoid: ["Nothing. If a step is worth doing it is worth doing inside a pipeline — " +
                  "the only real cost is a few extra lines the first time you write one"],
          }
      ] }
  ]
},

/* ════════════════ 4 ════════════════════════════════════════════════════ */
{
  id: "prep", n: "4", name: "Pre-process it", icon: "⚖️",
  blurb: "A model can only read numbers. Fill the blanks, turn words into numbers, " +
         "calm down long tails, and put the columns on a similar scale.",
  jobs: [

    { id: "missing", name: "Blank cells", icon: "🕳",
      q: "Do I delete these rows, or invent a value for them?",
      note: "Deleting loses information you had. Filling invents information you never had. " +
            "There is no free option — pick the cheaper mistake.",
      options: [
        { name: "df.dropna()", topic: "04_ML/05_Missing_Values",
          plain: "Delete the rows that have a blank. Fine when only a few rows are affected.",
          code: "df = df.dropna(subset=['age'])",
          how: "Deletes any row that has a blank in the columns you name. With no subset it " +
               "deletes a row for a blank anywhere, which on a wide table can remove most " +
               "of it. Everything that row knew in its other columns goes with it.",
          use: ["Under roughly 5% of rows are affected, so losing them costs you little " +
                "statistical power and no segment disappears with them",
                "The blanks look scattered rather than concentrated — no single region, " +
                "channel or time window accounts for most of them",
                "The blank is in the target y. You cannot invent an answer to learn from, " +
                "so those rows genuinely cannot be used for training"],
          avoid: ["A large share of the column is blank. You would be deleting the dataset " +
                  "to protect one column — impute it, or drop the column instead of the " +
                  "rows",
                  "The rows with blanks are a group of their own: every new customer, every " +
                  "mobile signup, everyone who skipped an optional field. Dropping them " +
                  "quietly changes the population you trained on, and the model then meets " +
                  "that group in production having never seen it",
                  "Without subset= on a wide table, where one blank in a column you were " +
                  "never going to use still costs you the entire row"],
          },

        { name: "SimpleImputer(strategy='median')", topic: "04_ML/05_Missing_Values",

          plain: "Fill blanks with the middle value of the column. Safe even when a few values are huge.",
          code: "SimpleImputer(strategy='median')",
          how: "Learns one number per column on fit — the middle value once the column is " +
               "sorted — and writes it into every blank on transform. Because it is a rank " +
               "statistic, moving the largest value from 200 to 200,000 does not move the " +
               "median at all.",
          use: ["A numeric column has blanks and you cannot afford to lose the rows. " +
                "Imputing keeps every other column of that row in play",
                "The column is skewed or has outliers. The median is the middle by " +
                "position, not by magnitude, so a handful of extreme values cannot drag the " +
                "fill value the way they drag a mean",
                "Inside a Pipeline, so the median is learned from the training fold only. " +
                "Computing it on the whole table before the split leaks test information " +
                "into training"],
          avoid: ["Text or category columns. There is no ordering to take the middle of — " +
                  "use most_frequent, or a literal Missing level",
                  "The blank carries meaning. No second phone number is a fact, not an " +
                  "unknown, and filling it with a median invents an average where the truth " +
                  "was absence",
                  "Roughly 40% or more of the column is blank. You are then modelling a " +
                  "constant you invented yourself, and the variance that column appears to " +
                  "have is fiction"],
          },

        { name: "SimpleImputer(strategy='mean')", topic: "04_ML/05_Missing_Values",

          plain: "Fill blanks with the column's average. Only when no huge values are pulling that average.",
          code: "SimpleImputer(strategy='mean')",
          how: "Learns the arithmetic average of the observed values on fit and writes it " +
               "into every blank. Every value in the column contributes to that average in " +
               "proportion to its size, which is exactly the property that makes it " +
               "fragile.",
          use: ["A numeric column that is roughly symmetric with no extreme values. There " +
                "the mean and the median nearly coincide, and the mean is the more " +
                "efficient estimate of the two",
                "Measurement-style quantities that hover around a level — heights, " +
                "temperatures, exam scores, a sensor reading with noise around a setpoint"],
          avoid: ["Outliers or a long tail are present. They already drag the mean, and now " +
                  "they drag every cell you filled with it, so one bad value contaminates " +
                  "hundreds of rows",
                  "Money, income, claim size, page views — anything bounded below by zero " +
                  "with a tail to the right. The mean of such a column sits above most of " +
                  "the actual data. Use the median",
                  "Count columns, where the mean lands between two values that cannot " +
                  "exist. Filling 2.7 children is arithmetic, not a fact"],
          },

        { name: "SimpleImputer(strategy='most_frequent')", topic: "04_ML/05_Missing_Values",

          plain: "Fill blanks with the most common value. Works for text columns too.",
          code: "SimpleImputer(strategy='most_frequent')",
          how: "Learns the mode — the value that appears most often — and writes it into " +
               "every blank. It works on text and on numbers, but on numbers it picks the " +
               "most common value rather than a central one, which is a different idea.",
          use: ["A text or category column with a small number of blanks, where the most " +
                "common level is genuinely the best single guess you could make",
                "A column with one dominant level, so filling with it barely shifts the " +
                "distribution you already had"],
          avoid: ["The blank means something real. Then it deserves a category of its own " +
                  "rather than being handed to the winner — see Fill with a Missing " +
                  "category",
                  "The column is fairly evenly spread across its levels. Assigning every " +
                  "blank to the leader manufactures a majority that was never there and " +
                  "biases anything downstream that reads class proportions",
                  "Numeric columns as a rule. The most common value and the typical value " +
                  "are not the same thing, and on a continuous column the mode is close to " +
                  "meaningless"],
          },

        { name: "ffill / bfill", topic: "04_ML/05_Missing_Values",

          plain: "Copy the value from the row just before (or just after). Only for rows in time order.",
          code: "df['reading'] = df['reading'].ffill()",
          how: "Copies the last known value forward down the column, or the next known one " +
               "backward. It carries a real observed value rather than a summary of the " +
               "column, so it only means anything when the row order is time.",
          use: ["Rows are in time order and the last known value is still a fair guess for " +
                "now — a sensor reading, a daily price, a status that only changes when an " +
                "event changes it",
                "A value that persists by definition: a subscription tier, an address, an " +
                "open or closed flag. It really did stay the same until something moved it",
                "With limit= set, so one missing hour is carried but a three-week gap is " +
                "left as a visible blank instead of a flat invented line"],
          avoid: ["Row order is meaningless. Without a time order you are copying one " +
                  "customer's value into a stranger's row and calling it data",
                  "Long gaps with no limit. A value carried across months looks like stable " +
                  "measurement and hides the fact that you were not measuring at all",
                  "bfill on anything you will forecast. It fills a gap with a value from " +
                  "later in the series, which is information the model will not have at " +
                  "prediction time"],
          },

        { name: "KNNImputer", topic: "04_ML/12_Preprocessing",

          plain: "Fill a blank using the rows that look most like this one.",
          code: "KNNImputer(n_neighbors=5)",
          how: "For each row with a blank it finds the k most similar complete rows, using " +
               "the other columns as coordinates, and fills the gap with their average. " +
               "Unlike a single fill value, the answer depends on the rest of that " +
               "particular row.",
          use: ["The columns are related, so similar rows genuinely carry information about " +
                "each other — height and weight, or the several channels of one sensor rig",
                "A single constant is visibly wrong because the column's typical value " +
                "differs sharply between kinds of row, and one number for everybody would " +
                "flatten that",
                "The table is small enough that comparing every row against every other is " +
                "affordable"],
          avoid: ["Large tables. It measures distances between rows, so the cost grows " +
                  "roughly with the square of the row count and a fit that took seconds at " +
                  "10k rows takes minutes at 100k",
                  "Unscaled columns. Distance is the whole mechanism, so a salary in lakhs " +
                  "beside an age in years means salary alone chooses every neighbour. Scale " +
                  "first, inside the same pipeline",
                  "Many columns of which most are irrelevant. Distances flatten out as " +
                  "dimensions grow, and the nearest neighbours stop being meaningfully near"],
          },

        { name: "Fill with a 'Missing' category", topic: "04_ML/05_Missing_Values",

          plain: "Write 'Missing' in the blank, because the blank itself tells you something.",
          code: "df['plan'] = df['plan'].fillna('Missing')",
          how: "Adds a new level to the column instead of guessing an existing one. The " +
               "encoder downstream then treats Missing as a category in its own right, and " +
               "the model is free to learn whether being blank predicts anything.",
          use: ["The blank is itself a fact — no second phone number, never upgraded, no " +
                "complaint filed. That is information, and inventing a value throws it away",
                "The blanks are concentrated in one kind of row. Marking them lets the " +
                "model separate that group rather than blending it into the majority",
                "As the honest default on a category column whenever you cannot establish " +
                "that the blanks are random"],
          avoid: ["Numeric columns. You cannot add a Missing level to a column that has to " +
                  "do arithmetic — impute it, and add a separate was_missing flag if you " +
                  "want the same signal",
                  "Very rare blanks in a high-cardinality column, where you are adding a " +
                  "nearly empty level for each of a hundred categories and giving the " +
                  "encoder a hundred more columns to carry"],
          }
      ] },

    { id: "encode", name: "Text categories", icon: "🔤",
      q: "How do these words become numbers without inventing an order?",
      note: "One-hot when the categories have no order. Ordinal only when the order is real. " +
            "Red = 1, Blue = 2 quietly tells the model that Blue is twice Red.",
      options: [
        { name: "OneHotEncoder", topic: "04_ML/06_Categorical_Encoding",
          plain: "Turn one word column into several 0/1 columns, one per word. For names with no order.",
          code: "OneHotEncoder(handle_unknown='ignore', drop='first')",
          how: "Learns the set of categories on fit and produces one 0/1 column per " +
               "category on transform. handle_unknown='ignore' makes a category never seen " +
               "in training come out as all zeros instead of raising, and drop='first' " +
               "removes one column because the last is implied by the others.",
          use: ["The categories have no natural order — city, department, payment method. " +
                "One-hot is the only encoding that adds no ordering whatsoever",
                "The number of distinct values is small, so the column count stays " +
                "manageable",
                "Any linear model, KNN or SVM with a nominal column. Those models read a " +
                "number as a magnitude, so an integer code would be a ranking you never " +
                "intended",
                "Inside a Pipeline or ColumnTransformer, where the fitted category list " +
                "travels from training to scoring and the test matrix always has the same " +
                "columns"],
          avoid: ["Hundreds of distinct values. You get hundreds of near-empty columns, " +
                  "distances stop discriminating, and a tree has to spend one split per " +
                  "column to say anything",
                  "Production scoring without handle_unknown='ignore'. The default raises " +
                  "on a category it has never seen, and it raises inside the live system " +
                  "rather than in your notebook"],
          },

        { name: "OrdinalEncoder", topic: "04_ML/06_Categorical_Encoding",

          plain: "Turn ranked words into numbers in the order you give: Low=0, Medium=1, High=2.",
          code: "OrdinalEncoder(categories=[['Low', 'Medium', 'High']])",
          how: "Maps each category to an integer. Passing categories=[[...]] fixes the " +
               "order yourself; left alone it sorts alphabetically, which is almost never " +
               "the order you meant.",
          use: ["The order is genuinely real — Low < Medium < High, Bronze < Silver < Gold, " +
                "an education level. Keeping it gives the model something one-hot would " +
                "have thrown away",
                "You state the order explicitly in categories=, so the mapping is a " +
                "decision recorded in your code rather than an accident of the alphabet",
                "Tree models with any category, ordered or not. A tree only ever asks " +
                "whether x is below a threshold, so an arbitrary integer code costs it far " +
                "less than it costs a linear model"],
          avoid: ["Unordered categories in front of a linear, distance or kernel model. It " +
                  "reads 3 as three times 1, so Chennai becomes three times Bengaluru and " +
                  "the coefficient is meaningless",
                  "Quietly assuming the gaps are equal. Low/Medium/High becomes 0/1/2, " +
                  "which asserts the step from Low to Medium is the same size as Medium to " +
                  "High — often untrue, and always an assumption you made"],
          },

        { name: "LabelEncoder", topic: "04_ML/06_Categorical_Encoding",

          plain: "Turn the answer column y into 0, 1, 2… For y only, never for the clue columns.",
          code: "y = LabelEncoder().fit_transform(y)",
          how: "Fits on a single one-dimensional array and maps its distinct values to " +
               "0..n-1 in sorted order. It is the same idea as OrdinalEncoder but shaped " +
               "for one column, which is exactly why it belongs on the target and nowhere " +
               "else.",
          use: ["The target column y, turning class names into 0, 1, 2 for a classifier " +
                "that needs numeric labels",
                "Reporting predictions back in the original class names, by reading the " +
                "mapping off .classes_"],
          avoid: ["Input features. It is built for one column at a time, and the integers " +
                  "it invents imply an order the model will take seriously",
                  "As a feature step inside a Pipeline. Its fit signature does not match " +
                  "what a transformer needs — that is the API telling you this is not a " +
                  "feature transformer"],
          },

        { name: "pd.get_dummies()", topic: "04_ML/06_Categorical_Encoding",

          plain: "The quick pandas version of one-hot. Good for a first look, not for the real pipeline.",
          code: "pd.get_dummies(df, columns=['city'], drop_first=True)",
          how: "Expands category columns into 0/1 columns directly on a DataFrame. It has " +
               "no fit step, so it decides the columns from whatever data it is handed, " +
               "every time it is called.",
          use: ["A quick look while exploring, before any pipeline exists. It is the " +
                "fastest way to see what the encoded table will look like",
                "One-off analysis where a train and a test object do not separately exist"],
          avoid: ["Production code, or anything you will score again later. It cannot " +
                  "remember the training categories, so a city absent from the test set " +
                  "changes the column count and the model is handed a different matrix than " +
                  "the one it learned on",
                  "As a stand-in for OneHotEncoder inside a Pipeline. The pipeline exists " +
                  "precisely to carry that fitted category list from training day to " +
                  "scoring day"],
          }
      ] },

    { id: "shape", name: "A long tail", icon: "📐",
      q: "The column is bunched at one end. Do I reshape it?",
      note: "A straight-line model cannot bend. But the column can.",
      options: [
        { name: "FunctionTransformer(np.log1p)", topic: "04_ML/10_Function_Transformer",
          plain: "Squash a long tail with a log, so a few huge values stop dominating.",
          code: "FunctionTransformer(np.log1p, validate=True)",
          how: "Applies log(1+x) to every value, compressing the large end of the column " +
               "far more than the small end. A column whose top decile sits a hundred times " +
               "above its median becomes one where it sits a few units away, which is a " +
               "shape a straight line can actually fit.",
          use: ["A long right tail — income, price, city population, page views. Those " +
                "quantities are multiplicative in nature, and a log turns multiplication " +
                "into addition, which is the only thing a linear model knows how to do",
                "log1p rather than log, so a genuine zero maps to 0 instead of minus " +
                "infinity",
                "Residuals that fan out as the prediction grows. Logging often makes that " +
                "spread constant again, which is the assumption ordinary least squares was " +
                "built on"],
          avoid: ["Negative values. The log is undefined there, so you get NaN for exactly " +
                  "the rows that were unusual, and you get it silently",
                  "You have to explain a coefficient to a business reader in plain units. " +
                  "After a log the coefficient is a percentage change rather than rupees, " +
                  "and it needs translating every time",
                  "Columns that are already symmetric. A log applied to them manufactures a " +
                  "left skew you then have to deal with"],
          },

        { name: "Square-root transform", topic: "04_ML/10_Function_Transformer",

          plain: "A gentler squash than a log. Good for counts.",
          code: "FunctionTransformer(np.sqrt)",
          how: "Applies the square root, which compresses the large end far more gently " +
               "than a log does. It is the classic variance-stabilising transform for " +
               "counts, where the spread of a column tends to grow along with its average.",
          use: ["A mild tail, where a log would over-correct and tip the skew the other way",
                "Count data — visits, complaints, defects per unit. The square root is the " +
                "standard choice there for a reason: it makes the variance roughly constant " +
                "across the range"],
          avoid: ["Negative values, undefined for the same reason as the log",
                  "A genuinely heavy tail. If the top of the column is orders of magnitude " +
                  "above the middle, the square root will not be enough and you still need " +
                  "the log"],
          }
      ] },

    { id: "scale", name: "Columns on different scales", icon: "⚖️",
      q: "Salary is in lakhs, age is in years. Does my model hear only the salary?",
      note: "Distance-based and weight-fitting models care. Trees do not. " +
            "Ask what the algorithm actually computes, then decide.",
      options: [
        { name: "StandardScaler", topic: "04_ML/08_Feature_Scaling",
          plain: "Shift every column so its average is 0 and its spread is 1.",
          also: ["04_ML/12_Preprocessing"],
          code: "StandardScaler().fit(X_train)   # mean 0, sd 1",
          how: "Learns the mean and standard deviation of each column on the training data, " +
               "then subtracts the mean and divides by the sd. Every column comes out " +
               "centred on zero with a spread of about one, so no column can dominate a " +
               "distance or a penalty purely because of its units.",
          use: ["The default whenever scaling is needed and the column is roughly " +
                "bell-shaped",
                "KNN, SVM, PCA, LDA, and any penalised linear model — Ridge, Lasso, " +
                "ElasticNet. A penalty shrinks coefficients, so without scaling it punishes " +
                "columns measured in small units far more than columns measured in large " +
                "ones",
                "Whenever you intend to compare coefficients across columns. On " +
                "standardised inputs a coefficient is the effect of one standard deviation, " +
                "which is comparable; on raw inputs it is per rupee against per year, which " +
                "is not"],
          avoid: ["Extreme values survived cleaning. They set the mean and the sd " +
                  "themselves, so the ordinary range is squashed into a sliver near zero " +
                  "while the outlier keeps its dominance. Use RobustScaler",
                  "You need a guaranteed output range. This makes no promise about bounds — " +
                  "a value can quite legitimately come out at 12"],
          },

        { name: "MinMaxScaler", topic: "04_ML/08_Feature_Scaling",

          plain: "Squeeze every column into the range 0 to 1.",
          code: "MinMaxScaler()   # squeezed into 0–1",
          how: "Learns the smallest and largest value of each column on the training data " +
               "and maps them linearly onto 0 and 1. The shape of the distribution is " +
               "untouched; only the axis is relabelled.",
          use: ["You need a guaranteed bounded range — a neural network input layer, an " +
                "image pixel, anything that expects values between 0 and 1",
                "The column has a real floor and ceiling that cannot be exceeded — a " +
                "percentage, a rating out of 5, a proportion"],
          avoid: ["Extreme values. The single largest row becomes 1.0 and pins every " +
                  "ordinary row into a narrow band near zero, so the scaling has destroyed " +
                  "exactly the resolution you wanted",
                  "Values in production that can exceed the training range. A test value " +
                  "above the training maximum comes out above 1, and any model that relied " +
                  "on the bound is now outside its domain"],
          },

        { name: "RobustScaler", topic: "04_ML/12_Preprocessing",

          plain: "Like StandardScaler, but built on the middle value, so extreme values cannot throw it off.",
          code: "RobustScaler()   # median and IQR, not mean and sd",
          how: "Centres on the median and divides by the interquartile range rather than " +
               "using the mean and standard deviation. Both of those are rank statistics, " +
               "so the tail of the column cannot set the ruler that everything else is " +
               "measured against.",
          use: ["Extreme values are real and you have decided to keep them. This scales the " +
                "bulk of the data sensibly and simply lets the outliers land far out, which " +
                "is where they belong",
                "Skewed columns in general, where the mean is not the centre of anything in " +
                "particular",
                "As the safer default whenever you have not yet looked at the column's " +
                "shape"],
          avoid: ["You need output inside a fixed range. This one makes no such promise, by " +
                  "design",
                  "Columns whose interquartile range is tiny compared with their full " +
                  "range, where dividing by it inflates everything enormously"],
          },

        { name: "Normalizer", topic: "04_ML/12_Preprocessing",

          plain: "Scale each row, not each column, to length 1. For word counts and similar rows.",
          code: "Normalizer(norm='l2')   # scales each ROW, not each column",
          how: "Scales each ROW so that its values together have length one. It is the only " +
               "tool in this decision that works across a row instead of down a column, " +
               "which means it answers a different question: it keeps the direction of a " +
               "row and throws away its magnitude.",
          use: ["The direction of a row matters and its overall size does not — word counts " +
                "in a document, where a long article and a short note on the same topic " +
                "should look alike",
                "Signal or histogram vectors that will be compared by cosine similarity, " +
                "which is precisely what l2 normalisation followed by a dot product " +
                "computes"],
          avoid: ["Ordinary tabular data. Everything else in this decision scales columns " +
                  "and this scales rows, so mixing them up quietly ruins the table without " +
                  "raising anything",
                  "Any case where the size of a row is itself informative — total spend, " +
                  "order value, volume shipped. Normalising deletes precisely that"],
          },

        { name: "Do not scale at all", topic: "04_ML/26_Decision_Tree_Classification",

          plain: "Tree models do not care about units, so skip scaling for them.",
          also: ["04_ML/34_Ensemble_Methods"],
          code: "# trees ask 'is x > 5?' — the unit never enters the question",
          how: "A tree asks whether a value is above a threshold. That question has the " +
               "same answer whatever unit the column is in, so scaling changes nothing " +
               "about the tree that gets built — it only costs you a step and some " +
               "readability.",
          use: ["Decision trees, random forests, gradient boosting, AdaBoost. They split on " +
                "order, and order survives any rescaling you could apply",
                "Naive Bayes, which models each column on its own and never compares one " +
                "against another",
                "When you want to read the model in its original units. An unscaled tree " +
                "prints thresholds like salary <= 52000, which you can hand to a business " +
                "reader as it stands"],
          avoid: ["Anything that measures a distance or fits a weight — KNN, SVM, PCA, LDA, " +
                  "linear models. There the unit is the whole problem, and an unscaled " +
                  "column silently decides the answer",
                  "A pipeline whose model you may swap later. If a linear model could " +
                  "replace the tree next month, scaling now costs nothing and prevents a " +
                  "silent regression then"],
          }
      ] }
  ]
},

/* ════════════════ 5 ════════════════════════════════════════════════════ */
{
  id: "feat", n: "5", name: "Feature engineering", icon: "🎯",
  blurb: "Keep the columns that help the model, and drop the ones that only add " +
         "noise or repeat each other.",
  jobs: [

    { id: "select", name: "Too many columns", icon: "✂️",
      q: "Which columns actually carry signal, and which just add noise?",
      note: "More columns is not more information. Every useless column is one more chance " +
            "for the model to find a pattern that is not there.",
      options: [
        { name: "VarianceThreshold", topic: "04_ML/11_Feature_Selection",
          plain: "Drop columns that hold the same value in every row. They tell the model nothing.",
          code: "VarianceThreshold(threshold=0.0)",
          how: "Drops any column whose variance falls below the threshold. At the default " +
               "of zero that means columns holding one identical value in every row, which " +
               "by definition cannot explain any difference between rows.",
          use: ["The cheap first sweep. A constant column carries no information at all, so " +
                "removing it costs nothing and speeds up everything after it",
                "It needs no target, so it is safe to run before anything else and cannot " +
                "leak",
                "After one-hot encoding a wide category column, where some levels may be " +
                "entirely absent from the training fold and arrive as all-zero columns"],
          avoid: ["Expecting it to find useful columns. It only removes columns that say " +
                  "nothing whatsoever — a column can have plenty of variance and still be " +
                  "worthless",
                  "Raising the threshold above zero on unscaled data. Variance carries the " +
                  "square of the unit, so a threshold of 0.1 means something completely " +
                  "different for each column"],
          },

        { name: "Correlation check, drop one of a pair", topic: "02_DataScience/04_Correlation",

          plain: "If two columns say the same thing, keep only one of them.",
          also: ["04_ML/11_Feature_Selection"],
          code: "df.corr().abs()   # then drop one column from any pair above ~0.9",
          how: "Computes the pairwise linear correlation between columns and shows which " +
               "pairs move together. Anything above roughly 0.9 is usually the same " +
               "underlying quantity recorded twice, and one of the two can go.",
          use: ["Two columns are saying the same thing — height in cm and in inches, total " +
                "and total-with-tax, a date and the month number taken from it",
                "Linear models above all. Two near-identical columns make the coefficients " +
                "unstable: the fit can put a large positive weight on one and a large " +
                "negative weight on the other and score identically, so nothing in the " +
                "coefficient table can be believed",
                "Before you show anyone a coefficient table or claim a column matters"],
          avoid: ["Reading a low correlation as useless. Correlation only sees " +
                  "straight-line relationships, so a perfect U-shaped relationship scores " +
                  "near zero and looks like noise",
                  "Dropping without deciding which of the pair survives. Keep the one that " +
                  "is cheaper to collect, more reliable, or easier to explain — that is a " +
                  "business decision, not a statistical one",
                  "Trees and forests, which tolerate correlated columns. There it splits " +
                  "the importance between them, which muddles the importance chart but does " +
                  "not damage the prediction"],
          },

        { name: "SequentialFeatureSelector (forward / backward)", topic: "04_ML/11_Feature_Selection",

          plain: "Add or remove one column at a time, and keep the change only if the score improves.",
          code: "SequentialFeatureSelector(model, n_features_to_select=5, direction='forward')",
          how: "Adds one column at a time, or removes one at a time, refitting the model " +
               "and keeping whichever move scores best under cross-validation. It judges a " +
               "column by what it does to this model, not by a statistic computed off to " +
               "one side.",
          use: ["You want columns judged by whether they actually improve the model, which " +
                "is the only definition of useful that finally matters",
                "A moderate number of columns, and the time to let it refit repeatedly",
                "Interactions matter. Because it evaluates a whole set at a time it can " +
                "keep a column that is useless alone but valuable alongside another"],
          avoid: ["Very wide tables. It trains a model for every remaining candidate on " +
                  "every round, so the cost grows with the square of the column count",
                  "Without cross-validation inside it, where it will cheerfully select the " +
                  "columns that happen to suit one particular split"],
          },

        { name: "RFE", topic: "04_ML/11_Feature_Selection",

          plain: "Let the model rank the columns, drop the weakest, and repeat.",
          code: "RFE(estimator=model, n_features_to_select=5)",
          how: "Fits the model, drops the weakest column according to the model's own " +
               "coefficients or importances, refits, and repeats until the requested number " +
               "remains. Cheaper than sequential selection because it removes on a ranking " +
               "rather than testing every candidate.",
          use: ["The model already reports importances or coefficients — trees, forests, " +
                "linear models",
                "You want a defensible reduction on a wide table and cannot afford the " +
                "refits sequential selection would need",
                "With RFECV when you do not know how many columns to keep and would rather " +
                "cross-validation chose the number for you"],
          avoid: ["A model that reports nothing to rank by, such as KNN. There is no " +
                  "importance to read, so RFE has no basis on which to drop anything",
                  "Unscaled columns in front of a linear model. The coefficient ranking " +
                  "then reflects the units, and RFE removes whichever column happens to be " +
                  "measured in the largest numbers"],
          },

        { name: "LDA as a reduction step", topic: "04_ML/36_Linear_Discriminant_Analysis",

          plain: "Squash many columns into a few new ones that best separate the classes. Needs labels.",
          code: "LinearDiscriminantAnalysis(n_components=1).fit(X_train, y_train)",
          how: "Finds the directions that push the class centres as far apart as possible " +
               "while keeping each class tight around its own centre, and projects the data " +
               "onto them. With c classes it can produce at most c-1 components, so a " +
               "two-class problem reduces to a single number.",
          use: ["A classification problem with many numeric columns, where separating the " +
                "classes is the whole point",
                "You want reduction that knows about the target. PCA keeps the directions " +
                "with the most spread; LDA keeps the directions that separate the labels, " +
                "and those are usually not the same direction",
                "As a preprocessing step in front of a simple classifier, when the class " +
                "structure is roughly linear"],
          avoid: ["Regression or clustering. It needs class labels to aim at, and without " +
                  "them it has no objective at all",
                  "Unscaled columns — scale first, for the same reason PCA needs it",
                  "Wanting more than c-1 components. That is a hard ceiling, so a binary " +
                  "problem cannot be reduced to two dimensions this way no matter how many " +
                  "columns you started with"],
          },

        { name: "PCA", topic: "04_ML/39_PCA",

          plain: "Squash many columns into a few new ones that keep most of the variation.",
          code: "Pipeline([('sc', StandardScaler()), ('pca', PCA(0.90)), ('m', SVC())])",
          how: "Finds the directions along which the data varies most and rewrites every " +
               "row in terms of those directions instead of the original columns. The first " +
               "component captures the most spread, the second the most of whatever is " +
               "left, and so on, so keeping the first few keeps most of the variation in " +
               "far fewer numbers.",
          use: ["The columns overlap, and dropping any one of them would cost you signal. " +
                "PCA folds them together rather than making you choose between them",
                "You want a target you can state and defend: PCA(0.90) keeps however many " +
                "components are needed to retain 90% of the total variance",
                "No labels are required, so it works for regression and unsupervised work " +
                "as well as classification",
                "Distance-based models on many correlated columns, where the redundancy is " +
                "actively degrading the metric they depend on"],
          avoid: ["Unscaled columns. Variance carries units, so whichever column is " +
                  "measured in the largest numbers becomes component 1 regardless of how " +
                  "important it really is",
                  "You have to explain a feature to an auditor or a regulator. A component " +
                  "is a weighted blend of every original column and has no name anyone can " +
                  "act on",
                  "The real problem is useless columns. PCA keeps every one of them, merely " +
                  "weighted; feature selection is the thing that removes them",
                  "Expecting to collect less data. Every component still needs every " +
                  "original column in order to be computed, so nothing downstream becomes " +
                  "cheaper to measure"],
          }
      ] }
  ]
},

/* ════════════════ 6 ════════════════════════════════════════════════════ */
{
  id: "model", n: "6", name: "Choose a model", icon: "🧭",
  blurb: "What are you predicting — a number, a label like Yes or No, or no answer " +
         "at all, just groups? That one question picks the family. Start simple, and " +
         "make it the score to beat.",
  jobs: [

    { id: "reg", name: "Predict a number", icon: "📈",
      q: "The answer is a quantity. Which family fits the shape of the relationship?",
      note: "Fit LinearRegression first — not because it will win, but because everything " +
            "afterwards has to justify itself against it.",
      options: [
        { name: "LinearRegression", topic: "04_ML/16_Linear_Regression",
          plain: "Fit a straight line. Always try this first — it is the score to beat.",
          also: ["04_ML/17_Multiple_Linear_Regression", "03_Math/05_Linear_Regression_From_Scratch"],
          code: "LinearRegression().fit(X_train, y_train)",
          how: "Fits one coefficient per column by minimising the sum of the squared " +
               "residuals. There is a closed-form solution, so it trains almost instantly, " +
               "and each coefficient reads directly as the change in y for a one-unit " +
               "change in that column with the others held fixed.",
          use: ["The baseline, always fitted first. Until something more complicated beats " +
                "a straight line you have no evidence the complication was needed",
                "You need to explain the effect of each column in plain units. Each extra " +
                "year of experience adds 42,000 is a sentence a business reader can act on",
                "Few columns, a roughly straight relationship, and residuals that look like " +
                "noise rather than a pattern"],
          avoid: ["The relationship is visibly curved. Forcing a curve into a straight line " +
                  "leaves structure in the residuals, so the model is systematically wrong " +
                  "in particular regions rather than evenly wrong",
                  "Columns repeat each other. The coefficients go unstable — large and " +
                  "opposite, swinging with small changes in the data — and the coefficient " +
                  "table stops meaning anything. Use Ridge",
                  "Outliers you have decided to keep. Least squares squares the error, so " +
                  "one distant row can rotate the entire line"],
          },

        { name: "PolynomialFeatures + LinearRegression", topic: "04_ML/18_Polynomial_Regression",

          plain: "Fit a curve by adding squared columns to a straight-line model.",
          code: "Pipeline([('poly', PolynomialFeatures(2)), ('lr', LinearRegression())])",
          how: "Creates the squares, cubes and cross-products of your columns and hands " +
               "them to an ordinary linear fit. The model is still linear in its " +
               "coefficients — the curve comes from the new columns, not from a different " +
               "algorithm.",
          use: ["The scatter bends but still has one clear shape, a single curve rather " +
                "than several unrelated regions",
                "Degree 2, or 3 at the very most. Start low and raise it only if the " +
                "validation score improves, never because the training score did",
                "Inside a Pipeline with a scaler, because cubing a column measured in " +
                "thousands produces numbers large enough to wreck the fit numerically"],
          avoid: ["A high degree. It chases the noise, swings wildly between the points it " +
                  "was given, and behaves absurdly just outside the training range",
                  "Many columns already. The term count grows combinatorially — twenty " +
                  "columns at degree 2 gives you 230 features",
                  "Extrapolating at all. A polynomial's behaviour past the edge of its " +
                  "training data is essentially arbitrary, and it fails confidently"],
          },

        { name: "Ridge", topic: "04_ML/19_Ridge_Regression",

          plain: "A straight line that keeps every weight small, so it does not overreact.",
          code: "Ridge(alpha=1.0)",
          how: "Ordinary least squares plus a penalty on the sum of the squared " +
               "coefficients. That penalty makes the fit prefer many small slopes over a " +
               "few enormous ones, which is exactly the instability correlated columns " +
               "create. alpha decides how hard it bites.",
          use: ["Columns repeat each other and plain linear coefficients have gone unstable " +
                "— large, opposite, and different every time you re-run",
                "More columns than the data can comfortably support, where an unpenalised " +
                "fit would overfit",
                "You want to keep every column, only calmer. Ridge shrinks; it does not " +
                "select",
                "Always with scaling. The penalty acts on the coefficients themselves, and " +
                "their size depends entirely on the units of their columns"],
          avoid: ["You wanted columns removed. Ridge pushes slopes towards zero but never " +
                  "to exactly zero, so every column stays in the model. Use Lasso",
                  "alpha left at whatever the default was. It is effectively the whole " +
                  "model — tune it with cross-validation through RidgeCV rather than " +
                  "accepting the value that happened to run"],
          },

        { name: "Lasso", topic: "04_ML/20_Lasso_Regression",

          plain: "A straight line that sets the weights of useless columns to exactly zero.",
          code: "Lasso(alpha=0.1)",
          how: "Least squares plus a penalty on the sum of the absolute coefficients. " +
               "Because that penalty subtracts a flat amount rather than a proportional " +
               "one, weak coefficients reach exactly zero and their columns drop out of the " +
               "model altogether.",
          use: ["Many columns and you want the weak ones removed automatically, so fitting " +
                "and feature selection happen in one step",
                "You need a short, defensible model — the surviving columns are a list you " +
                "can put in front of someone",
                "Wide tables where you suspect most of the columns are noise"],
          avoid: ["Two columns say the same thing. Lasso keeps one and drops the other " +
                  "close to arbitrarily, and which one survives can change between runs — " +
                  "so never read the survivor as the column that mattered. Use ElasticNet",
                  "You need every column's effect estimated. A zeroed coefficient is a " +
                  "decision to exclude, not an estimate that the effect is zero",
                  "Unscaled columns, where a flat penalty falls unequally on columns " +
                  "measured in different units"],
          },

        { name: "ElasticNet", topic: "04_ML/21_ElasticNet",

          plain: "A mix of Ridge and Lasso.",
          code: "ElasticNet(alpha=0.1, l1_ratio=0.5)",
          how: "Combines both penalties — the L1 part that zeroes weak columns and the L2 " +
               "part that shares weight between correlated ones. l1_ratio sets the mix, 1.0 " +
               "being pure Lasso and 0.0 pure Ridge, while alpha sets the overall strength.",
          use: ["Many columns AND groups of columns that duplicate each other, which is " +
                "precisely the case where Lasso alone behaves erratically",
                "You want selection with a stable answer. Correlated columns tend to be " +
                "kept or dropped as a group rather than one being picked at random",
                "With ElasticNetCV, which searches alpha and l1_ratio together instead of " +
                "leaving you to guess both"],
          avoid: ["A small, clean set of uncorrelated columns. You are tuning two knobs to " +
                  "buy something plain Ridge or Lasso already gave you",
                  "Reporting a result before tuning both parameters. The defaults are a " +
                  "starting point, not a model"],
          },

        { name: "RANSACRegressor", topic: "04_ML/38_Robust_Regression",

          plain: "Fit the line using only the rows that agree, and point out the bad rows.",
          also: ["04_ML/07_Outliers"],
          code: "RANSACRegressor(random_state=0).fit(X_train, y_train)",
          how: "Fits a line to a small random sample of rows, counts how many other rows " +
               "agree with it within a residual threshold, and repeats many times. The line " +
               "with the largest agreeing set wins, and everything outside that set is " +
               "declared an outlier and simply ignored.",
          use: ["Some rows are plainly wrong — a sensor default, a failed parse, an amount " +
                "stuck at a placeholder. This is a data fault, and RANSAC treats it as one",
                "You want the broken rows named. inlier_mask_ hands you exactly which rows " +
                "it rejected, so you can go and fix the source rather than only the model",
                "Heavy contamination. It survives up to roughly half the rows being broken, " +
                "which nothing else in this decision manages"],
          avoid: ["More than half the data is bad. The consensus then forms around the " +
                  "wrong line, because the fault is the majority, and no amount of sampling " +
                  "recovers from that",
                  "You cannot afford to discard rows at all. Use HuberRegressor, which " +
                  "keeps every row and merely tames it",
                  "A skewed target left on the default residual_threshold. That default " +
                  "comes from the MAD of y, and on a skewed target it is far too wide to " +
                  "exclude anything",
                  "Needing a reproducible answer without setting random_state, since the " +
                  "whole method is sampling"],
          },

        { name: "HuberRegressor", topic: "04_ML/38_Robust_Regression",

          plain: "A straight line that listens less to rows with very large errors.",
          code: "HuberRegressor(epsilon=1.35).fit(X_train, y_train)",
          how: "Uses squared loss for small residuals and straight-line loss beyond " +
               "epsilon. Past that point an error costs proportionally rather than " +
               "quadratically, so a far row stops being able to buy extra influence over " +
               "the fit.",
          use: ["Extreme rows are real and you want every row kept, only tamed. Nothing is " +
                "discarded — the far rows simply weigh less",
                "One deterministic fit, with no sampling and no consensus threshold you " +
                "would have to justify",
                "Moderate contamination, where the outliers are a nuisance rather than a " +
                "majority"],
          avoid: ["Heavy contamination. It down-weights outliers rather than removing them, " +
                  "so enough of them still carry the fit away. Use RANSAC",
                  "Unscaled columns. epsilon is measured in the model's own error units, so " +
                  "its meaning shifts with the scale of X and of y",
                  "A large epsilon, which switches the straight-line region off and leaves " +
                  "you with LinearRegression under a different name"],
          },

        { name: "TheilSenRegressor", topic: "04_ML/38_Robust_Regression",

          plain: "A line built from the median slope, so a few bad points cannot pull it. For small tables.",
          code: "TheilSenRegressor(random_state=0).fit(X_train, y_train)",
          how: "Takes the slope of the line through every pair of points and uses the " +
               "median of all of them. A median cannot be dragged by a few extreme values, " +
               "and that is the whole source of its robustness — no threshold, no sampling, " +
               "nothing to tune.",
          use: ["A small dataset with one or two columns, and no threshold you would have " +
                "to defend to anyone",
                "You want robustness with nothing to configure. There is no epsilon and no " +
                "residual threshold to get wrong",
                "Contamination up to roughly 29% of rows, which is its established " +
                "breakdown point"],
          avoid: ["Many rows or many columns. It works through pairs, so the cost climbs " +
                  "very fast and it becomes impractical long before a forest would",
                  "You need the rejected rows named. It never labels anything an outlier — " +
                  "it is simply not moved by them",
                  "High-dimensional problems, where the pairwise-slope idea stops being " +
                  "tractable at all"],
          },

        { name: "DecisionTreeRegressor", topic: "04_ML/27_Decision_Tree_Regression",

          plain: "Ask yes/no questions about the columns, and predict the average of each group.",
          code: "DecisionTreeRegressor(max_depth=5)",
          how: "Splits the rows repeatedly on one column at a time, each time choosing the " +
               "split that most reduces the error, and predicts the average of the training " +
               "rows that land in each leaf. Its prediction is therefore a staircase, " +
               "constant within each leaf.",
          use: ["The relationship is curved, or steps, or genuinely different in different " +
                "regions. A tree fits each region separately instead of forcing one global " +
                "shape onto all of them",
                "No scaling needed, extreme values in X do not drag it, and mixed numeric " +
                "and category columns are handled without ceremony",
                "You can print the rules and defend a prediction as a chain of yes/no " +
                "questions"],
          avoid: ["Leaving max_depth unset. An unrestricted tree splits until the leaves " +
                  "are nearly pure, memorises the training rows, and reports a perfect " +
                  "training score that means nothing",
                  "Extrapolating beyond the training range. Every leaf predicts a constant, " +
                  "so the model is simply flat outside the data it saw",
                  "Needing a stable model. Change a few rows and the whole tree can " +
                  "restructure — that instability is exactly what a forest exists to " +
                  "average away"],
          },

        { name: "RandomForestRegressor", topic: "04_ML/34_Ensemble_Methods",

          plain: "Many slightly different trees, and the average of their answers.",
          code: "RandomForestRegressor(n_estimators=300, random_state=42)",
          how: "Trains many trees, each on a bootstrap sample of the rows and each choosing " +
               "its splits from a random subset of the columns, then averages their " +
               "predictions. The trees overfit in different directions and the averaging " +
               "cancels most of it out.",
          use: ["The strong general-purpose answer whenever accuracy matters more than " +
                "explanation",
                "Little tuning time. It is genuinely hard to make a forest much worse — " +
                "more trees never hurts accuracy, only training time and memory",
                "Non-linear relationships and interactions you have not identified yourself",
                "You want feature_importances_ as a by-product, as a rough guide to what " +
                "carried the model"],
          avoid: ["You must explain a single decision path to an auditor. Three hundred " +
                  "averaged trees is not a chain of reasons anyone can follow",
                  "A latency budget measured in milliseconds, or a tight memory budget — " +
                  "the model is every tree, kept",
                  "Extrapolation, for the same reason as a single tree: an average of " +
                  "constants is still a constant once you leave the training range"],
          }
      ] },

    { id: "clf", name: "Predict a label", icon: "🏷",
      q: "The answer is one of a few classes. What is the shape of the boundary?",
      note: "Scale first for anything that measures distance — KNN and SVM are unusable without it.",
      options: [
        { name: "LogisticRegression", topic: "04_ML/40_Logistic_Regression",
          plain: "Give each row a chance of 'Yes' between 0 and 1. The first model to try for a Yes/No answer.",
          code: "LogisticRegression()   # then predict_proba(X)[:, 1] for the probability",
          how: "Fits a straight-line score per row and pushes it through the sigmoid, which " +
               "maps any number onto the range 0 to 1. What comes out is a genuine " +
               "probability, and the point where it crosses your threshold is the decision " +
               "boundary.",
          use: ["The first classifier to reach for. Fast, stable, and it returns a real " +
                "probability rather than a bare label",
                "You need a confidence per row, or a threshold you can move later without " +
                "refitting. That is how precision gets traded against recall once the model " +
                "is live",
                "You want to read why. Each weight is a per-unit push on the log-odds and " +
                "exp(w) is the multiplier on the odds, which is something you can say out " +
                "loud in a review",
                "As the honest benchmark every fancier classifier has to beat before it " +
                "earns its place"],
          avoid: ["A boundary that is genuinely curved. It can only draw a straight one, so " +
                  "it will be confidently wrong in the same places every time",
                  "Reading coefficients off unscaled columns, where the ranking reflects " +
                  "the units and can reverse completely once you scale",
                  "Perfectly separable classes with no regularisation, where the " +
                  "coefficients run away towards infinity and the probabilities saturate at " +
                  "0 and 1"],
          },

        { name: "DecisionTreeClassifier", topic: "04_ML/26_Decision_Tree_Classification",

          plain: "A flowchart of yes/no questions that you can read and explain.",
          code: "DecisionTreeClassifier(max_depth=5, random_state=42)",
          how: "Splits the rows on one column at a time, choosing the split that makes the " +
               "resulting groups purest by Gini or entropy, and predicts the majority class " +
               "of each leaf. What you end up with is a set of readable if/then rules.",
          use: ["The readable baseline. You can print the rules, show them, and have " +
                "someone disagree with a specific one rather than with the model in general",
                "Mixed numeric and category columns, with no scaling required anywhere",
                "Non-linear boundaries that are axis-aligned, meaning thresholds on " +
                "individual columns"],
          avoid: ["An unrestricted depth, which memorises the training rows and reports a " +
                  "perfect training score that tells you nothing",
                  "Imbalanced classes without class_weight='balanced', where predicting the " +
                  "majority everywhere already makes the leaves look pure enough",
                  "Boundaries that run diagonally through the features. A tree can only cut " +
                  "parallel to the axes, so it approximates a diagonal with a staircase of " +
                  "many splits and needs far more depth to do it"],
          },

        { name: "RandomForestClassifier", topic: "04_ML/34_Ensemble_Methods",

          plain: "Many trees vote on the answer. A strong score with little tuning.",
          code: "RandomForestClassifier(n_estimators=300, random_state=42)",
          how: "Many trees, each grown on a bootstrap sample of the rows and choosing from " +
               "a random subset of columns at every split, voting on the class. The " +
               "randomness makes the trees disagree, and the vote is far steadier than any " +
               "single tree.",
          use: ["The default whenever you want a strong score without much tuning",
                "It gives you feature_importances_ for free, and the out-of-bag rows " +
                "provide an internal estimate of the score without a separate split",
                "Imbalanced data, through class_weight='balanced_subsample'"],
          avoid: ["You need to explain one prediction as a chain of reasons",
                  "Very high-dimensional sparse data such as text, where a linear model or " +
                  "Naive Bayes is normally better and vastly cheaper",
                  "Reading feature_importances_ as truth. Impurity importance is biased " +
                  "towards high-cardinality columns, so use permutation importance whenever " +
                  "the ranking itself matters"],
          },

        { name: "GradientBoosting / AdaBoost", topic: "04_ML/34_Ensemble_Methods",

          plain: "Trees built one after another, each fixing the mistakes of the ones before.",
          code: "GradientBoostingClassifier(n_estimators=200, learning_rate=0.1)",
          how: "Builds trees in sequence, each new one fitted to the errors the previous " +
               "ones are still making, and adds them together scaled by a learning rate. " +
               "Where a forest averages independent trees, boosting builds dependent ones " +
               "that each correct the last.",
          use: ["You want the last few points of accuracy out of tabular data, which is " +
                "where boosting usually wins",
                "You have time to tune. learning_rate and n_estimators trade against each " +
                "other, and boosting rewards that tuning far more than a forest does",
                "Structured, medium-sized tables where a small accuracy gain is worth real " +
                "money"],
          avoid: ["Noisy or mislabelled data. Boosting keeps directing attention at the " +
                  "rows it gets wrong, and a mislabelled row is one it can never get right, " +
                  "so it fits the noise hard and confidently",
                  "No time to tune. An untuned boosting model frequently loses to an " +
                  "untuned forest",
                  "A high learning_rate together with many estimators, which overfits fast " +
                  "and quietly"],
          },

        { name: "VotingClassifier", topic: "04_ML/34_Ensemble_Methods",

          plain: "Several different models vote on the answer.",
          code: "VotingClassifier([('nb', GaussianNB()), ('dt', tree), ('knn', knn)], voting='soft')",
          how: "Runs several different models and combines them — hard voting takes the " +
               "majority label, soft voting averages the predicted probabilities. It only " +
               "buys you anything when the members make different mistakes.",
          use: ["You have several decent models that fail on different rows. Their errors " +
                "then partly cancel and the combination beats every member",
                "The members work differently — a tree, a distance model, a probabilistic " +
                "one. The gain comes out of their disagreement, not their agreement",
                "voting='soft' when every member returns a usable probability, since " +
                "averaging probabilities uses more information than counting votes"],
          avoid: ["Combining three variants of the same model. They will be wrong on the " +
                  "same rows, and you have bought nothing but training time",
                  "Including a member much weaker than the rest, which drags the vote down " +
                  "with it",
                  "Any setting where you have to explain the prediction. You now have " +
                  "several models to explain instead of one"],
          },

        { name: "GaussianNB / MultinomialNB", topic: "04_ML/28_Naive_Bayes",

          plain: "Fast probability rules. Works well on text and on small data.",
          code: "GaussianNB().fit(X_train, y_train)",
          how: "Applies Bayes' rule under the assumption that the columns are independent " +
               "given the class. That assumption is usually false — which is what naive " +
               "means — yet the ranking between classes often survives it well enough to " +
               "classify correctly anyway.",
          use: ["A fast, honest baseline. It trains in a single pass and gives you a number " +
                "to beat before you spend an afternoon on anything larger",
                "Text classification and word counts, where MultinomialNB is very hard to " +
                "beat for the effort involved",
                "Very few rows. It estimates a handful of simple statistics per column, so " +
                "it needs far less data than most models to become usable"],
          avoid: ["Columns that repeat each other. Naive means it assumes independence, so " +
                  "duplicated evidence is counted twice and the probabilities become badly " +
                  "overconfident",
                  "Trusting predict_proba as a calibrated probability. The ordering of the " +
                  "classes is often good; the numbers themselves usually sit far too close " +
                  "to 0 and 1",
                  "GaussianNB on strongly non-normal numeric columns, since it models each " +
                  "column as a bell curve within each class"],
          },

        { name: "KNeighborsClassifier", topic: "04_ML/29_K_Nearest_Neighbor",

          plain: "Find the k most similar rows, and copy their answer.",
          code: "Pipeline([('sc', StandardScaler()), ('knn', KNeighborsClassifier(n_neighbors=5))])",
          how: "There is no training step at all — it stores the rows. At prediction time " +
               "it finds the k nearest stored rows by distance and takes their majority " +
               "class, so the boundary can be any shape the data happens to have.",
          use: ["The boundary is irregular and you cannot describe it as a rule. KNN " +
                "assumes no shape whatsoever",
                "A small dataset, where storing everything and scanning it stays cheap",
                "As a sanity check on more complex models. If KNN matches your forest, the " +
                "problem was simpler than the forest implied"],
          avoid: ["Unscaled columns. Distance is the entire mechanism, so the column with " +
                  "the largest unit becomes the whole distance and the others stop being " +
                  "consulted",
                  "Many columns. In high dimensions every point sits at roughly the same " +
                  "distance from every other, and nearest quietly stops meaning anything",
                  "Prediction has to be fast. Every prediction scans the whole training " +
                  "set, so the time you saved at training is repaid at every single request",
                  "Imbalanced classes, where the majority class wins most neighbourhoods by " +
                  "sheer numbers"],
          },

        { name: "SVC", topic: "04_ML/30_Support_Vector_Machines",

          plain: "Draw the boundary with the widest possible gap between the classes.",
          code: "Pipeline([('sc', StandardScaler()), ('svc', SVC(kernel='rbf', C=1.0))])",
          how: "Finds the boundary with the widest possible margin to the nearest points of " +
               "each class, and only those nearest points — the support vectors — define " +
               "it. The kernel lets it measure similarity as though the data had been " +
               "lifted into a higher dimension, so a curved boundary is drawn without ever " +
               "building those extra columns.",
          use: ["A clear gap between the classes, and you want the widest margin rather " +
                "than merely some separating line",
                "Many columns relative to rows. SVMs handle wide, short tables unusually " +
                "well",
                "The classes are not separable by a straight line. The rbf kernel bends the " +
                "boundary as far as C and gamma permit",
                "Always inside a Pipeline with a scaler in front of it"],
          avoid: ["Large datasets. Training cost grows between quadratically and cubically " +
                  "with the row count, so it becomes impractical long before a forest does",
                  "Unscaled columns, for exactly the same reason as KNN — the kernel is a " +
                  "distance",
                  "You need a calibrated probability out of the box. probability=True " +
                  "refits with internal cross-validation, which is slow and still only " +
                  "approximate",
                  "You need to explain the model. The boundary lives in the kernel's space " +
                  "and there is no coefficient table to show"],
          },

        { name: "LinearDiscriminantAnalysis", topic: "04_ML/36_Linear_Discriminant_Analysis",

          plain: "A straight boundary for classes that look like round clouds.",
          code: "LinearDiscriminantAnalysis().fit(X_train, y_train)",
          how: "Assumes each class is a Gaussian cloud sharing the same covariance and " +
               "finds the straight boundary that best separates them under that assumption. " +
               "Because it models the classes rather than only the boundary, it stays " +
               "stable on small samples.",
          use: ["Numeric columns, and classes that form roughly round, similarly spread " +
                "clouds",
                "It classifies and reduces dimensions in the same step, which is why it " +
                "also appears in the feature-reduction decision",
                "Small samples, where its assumptions buy a stability that more flexible " +
                "models cannot match"],
          avoid: ["Categorical inputs, which break the Gaussian assumption outright",
                  "Classes with very different spreads. The shared-covariance assumption is " +
                  "then simply wrong, and QuadraticDiscriminantAnalysis is the version that " +
                  "relaxes exactly that",
                  "Strongly non-linear boundaries, which a straight line cannot follow " +
                  "however the data is projected"],
          }
      ] },

    { id: "clu", name: "Find groups, with no labels", icon: "🧩",
      q: "Nobody has labelled anything. How do I find the natural groups?",
      note: "There is no test set to appeal to. Scaling is not optional — every one of these " +
            "measures distance, so an unscaled column decides the answer on its own.",
      options: [
        { name: "KMeans", topic: "04_ML/31_Clustering_KMeans",
          plain: "Split the rows into k groups around k centre points.",
          code: "Pipeline([('sc', StandardScaler()), ('km', KMeans(n_clusters=4, n_init=10))])",
          how: "Picks k centres, assigns every row to its nearest one, moves each centre to " +
               "the mean of its members, and repeats until nothing moves. It is minimising " +
               "the total squared distance to the centres, which is precisely why the " +
               "groups it finds come out round.",
          use: ["Many rows, and you can either name a k or find a defensible one from the " +
                "elbow plot and the silhouette score",
                "Groups that are roughly round and similarly sized, since that is the shape " +
                "the objective actually rewards",
                "Speed. It scales to large tables far better than hierarchical clustering " +
                "does",
                "With n_init set, so it restarts from several random beginnings and keeps " +
                "the best — a single start can settle into a poor local optimum and you " +
                "would never know"],
          avoid: ["Long, crescent or nested shapes. It can only draw round groups, so it " +
                  "will cut a crescent in half rather than recognise it",
                  "Extreme values, which drag a centre away from the group it is supposed " +
                  "to represent",
                  "Text categories. The mean of Mumbai and Chennai is not a place, so the " +
                  "centre means nothing",
                  "Unscaled columns, since the whole method is distance",
                  "Assuming the k you settled on is real. KMeans returns k groups whether " +
                  "or not the data contains any"],
          },

        { name: "AgglomerativeClustering + dendrogram", topic: "04_ML/32_Hierarchical_Clustering",

          plain: "Keep joining the two closest groups, and draw the whole history as a tree.",
          code: "AgglomerativeClustering(n_clusters=None, distance_threshold=0)",
          how: "Starts with every row as its own cluster and repeatedly merges the two " +
               "closest, recording the entire history. The dendrogram is that history drawn " +
               "as a tree, and cutting it at any height gives you the clustering for that " +
               "number of groups.",
          use: ["You do not know k. The dendrogram shows every possible k at once, so you " +
                "choose after looking rather than committing beforehand",
                "A small dataset, where the whole merge history is worth reading",
                "You want nested groups — segments inside segments, which KMeans has no way " +
                "to express",
                "Non-round shapes, if you choose a linkage that suits them. Single linkage " +
                "follows chains, ward prefers compact groups"],
          avoid: ["Large datasets. It compares every pair, so both memory and time grow " +
                  "with the square of the row count",
                  "Treating the height you cut at as objective. Where to cut is a " +
                  "judgement, and the picture makes it look far more decisive than it is",
                  "Unscaled columns, since every linkage rests on a distance"],
          }
      ] }
  ]
},

/* ════════════════ 7 ════════════════════════════════════════════════════ */
{
  id: "judge", n: "7", name: "Check the score", icon: "📊",
  blurb: "The model is trained. Score it on test rows it has never seen, with a " +
         "score that matches what a mistake really costs — and make sure the score " +
         "is not luck.",
  jobs: [

    { id: "regmetric", name: "Score a number prediction", icon: "📏",
      q: "How wrong is it, and does one big miss matter more than several small ones?",
      note: "Report RMSE next to R². One says how far off you are in real units, the other " +
            "says whether you beat simply guessing the average.",
      options: [
        { name: "R²", topic: "04_ML/24_Model_Evaluation",
          plain: "How much better than always guessing the average? 1 is perfect, 0 is no better.",
          code: "r2_score(y_test, y_pred)",
          how: "The share of the variance in y that the model explains, measured against " +
               "the simplest possible baseline — always predicting the mean. 1.0 is " +
               "perfect, 0 means you have merely matched the mean, and a negative value " +
               "means you have done worse than it.",
          use: ["A quick check that the model beats predicting the mean at all. It is " +
                "unitless, so it travels between problems in a way RMSE never can",
                "Reporting to someone who wants one number about the quality of the fit " +
                "rather than an error in units",
                "On the test set. R² on the training set only tells you how well the model " +
                "memorised"],
          avoid: ["Comparing models with different numbers of columns. R² can only rise as " +
                  "columns are added, even purely random ones, so it always prefers the " +
                  "larger model. Use adjusted R²",
                  "Reading it as the percentage of predictions that were correct. It is a " +
                  "share of variance, not a share of rows",
                  "Deciding whether the error is acceptable. An R² of 0.85 says nothing " +
                  "about whether being wrong by 40,000 rupees matters to the business"],
          },

        { name: "RMSE", topic: "04_ML/22_Cost_Functions",

          plain: "The typical size of the error, in real units. Big misses count extra.",
          code: "mean_squared_error(y_test, y_pred) ** 0.5",
          how: "The square root of the mean squared error, which brings it back into the " +
               "same unit as y. Squaring before averaging means one large miss contributes " +
               "far more to the score than several small ones adding to the same total.",
          use: ["Reporting the error in the unit people actually think in — rupees, days, " +
                "units of stock",
                "Large misses genuinely are worse than small ones in this problem, so you " +
                "want them punished harder",
                "Comparing models on the same target, where the shared unit makes the " +
                "comparison direct"],
          avoid: ["Extreme values you decided to keep. A handful of them will dominate the " +
                  "score, so RMSE ends up measuring your outliers rather than your model",
                  "Comparing across different targets. An RMSE of 5 is excellent on one " +
                  "problem and hopeless on another, because the unit came along with it"],
          },

        { name: "MAE", topic: "04_ML/22_Cost_Functions",

          plain: "The average size of the error, in real units. Every miss counts the same.",
          code: "mean_absolute_error(y_test, y_pred)",
          how: "The average of the absolute errors. Every unit of error contributes equally " +
               "whether it came from one large miss or ten small ones, which makes it far " +
               "less sensitive to outliers than RMSE.",
          use: ["Every unit of error costs the same, which is very often the honest " +
                "description of the business cost",
                "Extreme values are present and you do not want them setting the score",
                "Explaining the number to a non-technical audience. On average we are off " +
                "by 3.2 days is exactly what MAE means, and it is not what RMSE means"],
          avoid: ["A large miss really is disproportionately expensive — a stock-out, a " +
                  "breached SLA. Then RMSE is the metric that charges for it",
                  "Comparing against a published RMSE. They are different numbers, and MAE " +
                  "is always the smaller of the two on the same predictions"],
          },

        { name: "Adjusted R²", topic: "04_ML/24_Model_Evaluation",

          plain: "R² that goes down when you add columns that do not help.",
          code: "1 - (1-r2)*(n-1)/(n-p-1)",
          how: "R² with a correction that charges for every column you added. Adding a " +
               "useless column nudges plain R² up and pulls adjusted R² down, which is " +
               "precisely the signal you were looking for.",
          use: ["Comparing models that have different numbers of columns — it charges rent " +
                "for each one",
                "Deciding whether a new column earned its place, in a workflow where you " +
                "are adding them one at a time"],
          avoid: ["A single model with a fixed set of columns, where plain R² says the same " +
                  "thing with less explaining",
                  "As a substitute for a held-out test score. It is a penalty on " +
                  "complexity, not evidence that the model will generalise"],
          }
      ] },

    { id: "clfmetric", name: "Score a label prediction", icon: "🎯",
      q: "Which mistake hurts more: a false alarm, or a miss?",
      note: "Accuracy is the metric that lets a useless model look excellent. " +
            "With 1 fraud in 500 rows, predicting 'no fraud' every time scores 99.8%.",
      options: [
        { name: "Confusion matrix", topic: "04_ML/24_Model_Evaluation",
          plain: "A small table of right and wrong answers. Always look at this first.",
          code: "confusion_matrix(y_test, y_pred)",
          how: "The full table of what happened: true positives, false positives, true " +
               "negatives and false negatives. Every other classification metric on this " +
               "page is one particular summary of these four numbers.",
          use: ["Always, and before any single number. The four cells tell you which " +
                "mistake the model is making, which no scalar metric can",
                "It is the only view that separates the two kinds of error, and those " +
                "almost always have different costs attached",
                "When explaining a model to a business owner. They can read the table " +
                "directly and tell you which cell they actually care about"],
          avoid: ["Nothing. Every other classification metric summarises this table, so " +
                  "there is no situation where looking at it first is the wrong move",
                  "Reading it without the class counts in mind. Nine hundred true negatives " +
                  "make five false negatives look small, even when those five were the " +
                  "entire problem"],
          },

        { name: "Accuracy", topic: "04_ML/24_Model_Evaluation",

          plain: "The share of answers that were right. It misleads when one class is rare.",
          code: "accuracy_score(y_test, y_pred)",
          how: "The share of rows the model got right. It weighs both kinds of mistake " +
               "equally and takes no account whatsoever of how common each class is.",
          use: ["The classes are roughly balanced and both mistakes cost about the same",
                "As a first sanity check, read alongside the confusion matrix rather than " +
                "instead of it"],
          avoid: ["One class is rare. With 1% fraud a model that never predicts fraud " +
                  "scores 99% and is worthless — accuracy actively rewards it",
                  "The two errors cost different amounts, which is nearly always the case. " +
                  "Accuracy has no way to express that a missed cancer costs more than a " +
                  "false alarm",
                  "As the metric you optimise in a grid search on imbalanced data, where it " +
                  "will hand you the model that ignores the rare class"],
          },

        { name: "Precision", topic: "04_ML/24_Model_Evaluation",

          plain: "When the model says 'Yes', how often is it right?",
          code: "precision_score(y_test, y_pred)",
          how: "Of everything the model flagged, the share that really was positive. It " +
               "answers the question: when this model raises its hand, how often should I " +
               "believe it.",
          use: ["A false alarm is expensive — blocking a real customer's card, an " +
                "unnecessary product recall, waking an engineer at 3 a.m.",
                "The team acting on the flags has limited capacity, so every false positive " +
                "burns real time",
                "Alongside recall, always, because each one is trivial to game on its own"],
          avoid: ["Using it alone. You can score 1.0 by flagging exactly one very obvious " +
                  "row and ignoring everything else",
                  "Comparing precision across models at different thresholds. It moves with " +
                  "the threshold, so the comparison means nothing unless the threshold is " +
                  "held fixed"],
          },

        { name: "Recall", topic: "04_ML/24_Model_Evaluation",

          plain: "Of all the real 'Yes' cases, how many did the model catch?",
          code: "recall_score(y_test, y_pred)",
          how: "Of everything that really was positive, the share the model caught. It " +
               "answers the other question: how much of the thing I care about is slipping " +
               "past unnoticed.",
          use: ["A miss is expensive — undetected disease, undetected fraud, a churn you " +
                "could have prevented",
                "Screening problems, where a cheap follow-up check can clear out the false " +
                "positives afterwards",
                "Alongside precision, always"],
          avoid: ["Using it alone. You can score 1.0 by flagging every single row, which is " +
                  "exactly why it must be read with precision beside it",
                  "Assuming more recall is free. Recall and precision trade against each " +
                  "other, and the threshold that lifts one lowers the other"],
          },

        { name: "F1", topic: "04_ML/24_Model_Evaluation",

          plain: "One number that is high only when precision and recall are both high.",
          code: "f1_score(y_test, y_pred)",
          how: "The harmonic mean of precision and recall. It is deliberately harsh: " +
               "because the mean is harmonic rather than arithmetic, a model that is " +
               "excellent on one and poor on the other scores badly instead of averagely.",
          use: ["You need one number and both mistakes matter roughly equally",
                "The classes are imbalanced, so accuracy would mislead and F1 will not",
                "Comparing models on a rare positive class, where it is the standard single " +
                "summary"],
          avoid: ["The two mistakes have genuinely different costs. Then name the one you " +
                  "care about and report that, or use F-beta to weight them on purpose " +
                  "rather than by default",
                  "Explaining to a business audience. A harmonic mean is not intuitive, and " +
                  "the confusion matrix communicates the same thing far better",
                  "Forgetting that it ignores true negatives entirely, so it says nothing " +
                  "about the majority class"],
          },

        { name: "ROC curve and AUC", topic: "04_ML/25_ROC_And_AUC",

          plain: "How well the model ranks real 'Yes' rows above 'No' rows, at every possible threshold.",
          code: "roc_auc_score(y_test, model.predict_proba(X_test)[:, 1])",
          how: "The ROC curve plots the true positive rate against the false positive rate " +
               "as the threshold sweeps across its whole range. The area under it is the " +
               "probability that a randomly chosen positive row scores higher than a " +
               "randomly chosen negative one, so 0.5 is a coin flip.",
          use: ["Comparing two models before committing to a threshold. AUC measures the " +
                "ranking, which is the part of a model that is independent of where you " +
                "finally cut",
                "Choosing the threshold yourself. The model returns a probability and the " +
                "cut-off is a business decision — the curve is where that decision becomes " +
                "visible",
                "Explaining the precision-recall trade-off to someone, because the curve " +
                "shows the entire trade-off in one picture"],
          avoid: ["Reading it as accuracy. AUC still looks generous when the positive class " +
                  "is very rare, because the false positive rate has an enormous " +
                  "denominator",
                  "Severe imbalance, where the precision-recall curve and its average " +
                  "precision give the more honest picture",
                  "Passing predicted labels instead of predict_proba. AUC needs the scores; " +
                  "handing it 0/1 labels collapses the curve to a single point"],
          }
      ] },

    { id: "trust", name: "Trust the score", icon: "🔁",
      q: "Was that score real, or did I get a lucky split?",
      note: "One split is one sample. If the score moves a lot between folds, the number " +
            "you were about to report was mostly luck.",
      options: [
        { name: "Single hold-out split", topic: "04_ML/13_Train_Test_Split",
          plain: "Score once on one test set. Fast, but one lucky split can fool you.",
          code: "train_test_split(X, y, test_size=0.2, random_state=42)",
          how: "One cut: fit on one part, score on the other. The number you get is an " +
               "estimate from a single sample of test rows, so it carries the luck of that " +
               "particular draw and nothing tells you how much luck was involved.",
          use: ["Plenty of rows, so the test half is large enough for the estimate to be " +
                "stable",
                "You want a fast answer while iterating, and will validate properly before " +
                "quoting anything",
                "The model is expensive to train and five fits are not affordable"],
          avoid: ["A small dataset. The score swings depending on which rows happened to " +
                  "land in the test half, and you will read that swing as a real difference " +
                  "between models",
                  "Reporting a final number from it without saying it came from a single " +
                  "split",
                  "Re-running it with different seeds and quoting the best result you saw"],
          },

        { name: "KFold + cross_val_score", topic: "04_ML/23_Cross_Validation",

          plain: "Score k times, each part taking a turn as the test, and trust the average.",
          code: "cross_val_score(pipeline, X, y, cv=KFold(5, shuffle=True, random_state=42))",
          how: "Cuts the data into k parts, trains on k-1 and tests on the one left out, " +
               "rotating until every row has been test data exactly once. You get k scores, " +
               "and their spread is as informative as their average.",
          use: ["Every row serves as test data exactly once, so the estimate uses all of " +
                "the data rather than one lucky fifth of it",
                "A small dataset, where a single split cannot be trusted",
                "Read the standard deviation across folds, not only the mean. A model " +
                "averaging 0.82 with a spread of 0.15 is not the same animal as one " +
                "averaging 0.80 with a spread of 0.01"],
          avoid: ["Rows in time order. Shuffling means training on the future to predict " +
                  "the past — use TimeSeriesSplit",
                  "Passing a raw estimator instead of a pipeline. The scaler would then be " +
                  "fitted once, outside the loop, on all the data, and every fold's score " +
                  "is quietly contaminated",
                  "Grouped rows, where the same customer can appear in both the training " +
                  "and the testing fold"],
          },

        { name: "StratifiedKFold", topic: "04_ML/23_Cross_Validation",

          plain: "KFold that keeps the Yes/No mix the same in every part.",
          code: "cross_val_score(pipe, X, y, cv=StratifiedKFold(5, shuffle=True, random_state=42))",
          how: "KFold that preserves the class proportions inside every fold. It is what " +
               "cross_val_score already uses by default for a classifier, and naming it " +
               "explicitly makes the intention visible to whoever reads the code next.",
          use: ["Any classification problem. Keeping the class mix identical in every fold " +
                "is what makes the folds comparable to each other",
                "A rare class, where plain KFold can produce a fold containing none of it " +
                "at all and the metric becomes undefined",
                "Small datasets with several classes, where random folds vary wildly in " +
                "composition"],
          avoid: ["Regression. There are no classes to stratify on — bin the target first " +
                  "if you genuinely need something equivalent",
                  "Time-ordered data, since stratifying does nothing about the ordering " +
                  "problem"],
          }
      ] },

    { id: "tune", name: "Turn the knobs", icon: "🎛",
      q: "Which settings, and how do I search them without cheating?",
      note: "Hyperparameters are the settings the model cannot learn for itself — " +
            "alpha in Ridge, max_depth in a tree, k in KNN. Search them with cross-validation " +
            "on the training half, and leave the test set alone until the very end.",
      options: [
        { name: "GridSearchCV", topic: "04_ML/33_Hyperparameter_Tuning",
          plain: "Try every combination of the settings you list, and keep the best.",
          code: "GridSearchCV(pipe, {'model__alpha': [0.01, 0.1, 1, 10]}, cv=5)",
          how: "Trains a model for every combination of the values you listed, scoring each " +
               "by cross-validation, then refits the winner on all the data. It is " +
               "exhaustive, so it will find the best point in the grid you specified — and " +
               "nothing at all outside it.",
          use: ["A small number of knobs with a few plausible values each",
                "You want the guarantee that every combination was tried, which matters " +
                "when the choice has to be defended later",
                "Tuning a pipeline, using the model__param naming so that preprocessing is " +
                "refitted inside each fold"],
          avoid: ["A large grid. The cost is the product of every list times the number of " +
                  "folds, so four parameters with five values each at cv=5 is 3,125 fits",
                  "Continuous parameters such as alpha or learning_rate, where the grid you " +
                  "chose almost certainly steps straight over the best value",
                  "Treating the winning score as an unbiased estimate. You selected on it, " +
                  "so it is optimistic — keep a separate test set that the search never saw"],
          },

        { name: "RandomizedSearchCV", topic: "04_ML/33_Hyperparameter_Tuning",

          plain: "Try a random sample of setting combinations. Faster when there are many.",
          code: "RandomizedSearchCV(pipe, param_dist, n_iter=50, cv=5, random_state=42)",
          how: "Samples n_iter combinations from the distributions or lists you give it " +
               "instead of trying all of them. With many parameters most barely matter, so " +
               "random sampling explores the few that do far more efficiently than an " +
               "evenly spaced grid.",
          use: ["Many knobs, or wide ranges, or a fixed time budget you have to respect. " +
                "n_iter is that budget, stated directly in the code",
                "Continuous parameters, where you can pass a distribution and it will try " +
                "values no grid you wrote by hand would have contained",
                "As the sensible first pass. It usually lands very close to the grid's best " +
                "for a fraction of the work"],
          avoid: ["A tiny search space. Just run the grid and be certain",
                  "Forgetting random_state, which leaves the result irreproducible",
                  "A small n_iter across an enormous space, where the best it reports is " +
                  "barely better than a guess"],
          }
      ] }
  ]
},

/* ════════════════ 8 ════════════════════════════════════════════════════ */
{
  id: "ship", n: "8", name: "Ship it", icon: "📦",
  blurb: "Save the whole pipeline as one file, so tomorrow's request is answered by " +
         "exactly this model.",
  jobs: [

    { id: "ship", name: "Freeze it and ship it", icon: "📦",
      q: "How does tomorrow's request get answered by exactly this model?",
      note: "Save the whole pipeline, not the bare estimator. A model without its scaler and " +
            "encoder is a model that will be fed differently-shaped data in production.",
      options: [
        { name: "joblib.dump", topic: "04_ML/37_Model_Persistence",
          plain: "Save the trained model or pipeline to a file, to load it again later.",
          code: "joblib.dump(pipeline, 'model.joblib')",
          how: "Serialises the fitted object to a file, with special handling for the large " +
               "NumPy arrays that scikit-learn models are mostly made of. Loading it back " +
               "gives you the same fitted pipeline, ready to predict.",
          use: ["The default for anything scikit-learn. It handles the big arrays far more " +
                "efficiently than plain pickle does",
                "Save the whole Pipeline, never just the model. The preprocessing is part " +
                "of the model, and one loaded without it will silently receive unscaled, " +
                "unencoded input",
                "With compress= when the file has to travel, trading some load time for " +
                "size"],
          avoid: ["Treating the file as portable across library versions. Pin the " +
                  "scikit-learn, NumPy and Python versions beside it — loading under a " +
                  "different version can fail, or worse, load and behave differently",
                  "Loading a file you did not create. It carries the same code-execution " +
                  "risk as pickle, because it is built on it",
                  "As a long-term archive. For that keep the training code and data " +
                  "alongside, so the model can be rebuilt rather than only reloaded"],
          },

        { name: "pickle", topic: "04_ML/37_Model_Persistence",

          plain: "Python's general save-to-file. Fine for small objects.",
          code: "pickle.dump(pipeline, open('model.pkl','wb'))",
          how: "Python's general-purpose object serialiser. It can store almost any Python " +
               "object, but it stores large arrays less efficiently than joblib and it " +
               "executes code when it loads.",
          use: ["A plain Python object with no large arrays inside — a config, a label " +
                "mapping, a small custom class",
                "Something joblib cannot handle, which in practice is rare"],
          avoid: ["Loading a pickle you did not create. Unpickling executes code, so an " +
                  "untrusted file is arbitrary code execution on your machine",
                  "Large scikit-learn models, where joblib is both faster and smaller for " +
                  "no extra effort",
                  "Any cross-version or cross-language use. A pickle is a Python " +
                  "implementation detail, not an interchange format"],
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

   A question also carries
     hint: "..."      what it is really asking, in plain English, with an
                      example from Meera's table (chooser-tour.js) where one fits
     see: ["Col", …]  the columns of that table to light up while it is asked

   Every "pick" and every name in a "seq" must match an option `name` in that
   job exactly — build_site.py checks it. The questions are the whole point:
   they are what you actually ask yourself at the desk, in the order you ask.
   ══════════════════════════════════════════════════════════════════════════ */

const FLOWS = {

/* ── 1. look at it ──────────────────────────────────────────────────────── */

describe: {
  q: "What do you want to know?",
  hint: "Say what you want to learn about a column. For Meera's MonthlyIncome: " +
        "“what is a normal salary?” is the middle and spread; “is it bunched at one " +
        "end?” is lopsidedness; “does it rise with Age?” is how columns relate.",
  see: ["MonthlyIncome", "Age"],
  a: [
    { label: "the middle, and the spread", to: {
      q: "Long tail, or extreme values?",
      hint: "Are a few values far bigger than the rest? MonthlyIncome is like that: " +
            "most people earn about 4,896, one earns 49,799. Those few drag the average " +
            "up, so the middle value tells the truth better.",
      see: ["MonthlyIncome"],
      a: [
        { label: "yes", to: { pick: "Median and IQR" } },
        { label: "no, it is symmetric", to: { pick: "Mean and standard deviation" } }
      ] } },
    { label: "how lopsided it is", to: { pick: "Skewness" } },
    { label: "how the columns relate", to: { pick: "Correlation matrix" } }
  ] },

chart: {
  q: "How many columns at once?",
  hint: "One column: how is Age spread out? Two: does MonthlyIncome change with " +
        "Age? Many: how do all the number columns relate? Or you need a chart " +
        "someone else will click through.",
  see: ["Age", "MonthlyIncome"],
  a: [
    { label: "one", to: {
      q: "Numeric, or a category?",
      hint: "A number column holds amounts, like Age or MonthlyIncome. A category " +
            "column holds names, like Department or Gender.",
      see: ["Age", "Department"],
      a: [
        { label: "numeric", to: {
          q: "Shape, or spread and outliers?",
          hint: "Shape: where most values sit, and whether one side has a long tail. Spread " +
                "and outliers: how wide the middle is, and which values sit far outside it, " +
                "like Age 99.",
          see: ["Age"],
          a: [
            { label: "the shape", to: { pick: "Histogram" } },
            { label: "spread and outliers", to: { pick: "Boxplot" } }
          ] } },
        { label: "a category", to: { pick: "Countplot / bar" } }
      ] } },
    { label: "two", to: {
      q: "Both numeric?",
      hint: "Two number columns, like Age and MonthlyIncome, give one dot per person. " +
            "If one of the two is a date or a time, the points are joined in order " +
            "instead.",
      see: ["Age", "MonthlyIncome"],
      a: [
        { label: "yes", to: { pick: "Scatter plot" } },
        { label: "one of them is time", to: { pick: "Line chart" } }
      ] } },
    { label: "many", to: {
      q: "A handful, or lots?",
      hint: "A handful is up to about five columns: every pair can get its own small " +
            "plot. With more, there are too many pairs to draw, so one grid of colours " +
            "shows them all.",
      a: [
        { label: "a handful", to: { pick: "Pairplot" } },
        { label: "lots", to: { pick: "Correlation heatmap" } }
      ] } },
    { label: "someone else will click it", to: {
      q: "A chart in a page, or an app?",
      hint: "A chart the reader can hover over and zoom, or a small app with sliders " +
            "and buttons that a colleague can use without you.",
      a: [
        { label: "a chart to hover and zoom", to: { pick: "Plotly" } },
        { label: "a whole app for a colleague", to: { pick: "Streamlit" } }
      ] } }
  ] },

test: {
  q: "What are you comparing?",
  hint: "Counts means you count people in groups — how many who work OverTime left, " +
        "against how many who don't. Measurements means you compare a number — the " +
        "average MonthlyIncome of people who left against people who stayed.",
  see: ["OverTime", "Attrition", "MonthlyIncome"],
  a: [
    { label: "counts in categories", to: { pick: "Chi-square test" } },
    { label: "numeric measurements", to: {
      q: "How many groups?",
      hint: "One group against a claimed number: “our average salary is 5,000 — is " +
            "it?”. Two groups against each other: the salary of leavers against " +
            "stayers.",
      see: ["MonthlyIncome", "Attrition"],
      a: [
        { label: "one, against a claimed value", to: {
          q: "Do you know the population sd?",
          hint: "“sd” is the standard deviation: the true spread of the whole population. " +
                "You almost never know it in advance. If all you have is your own sample, " +
                "answer no.",
          a: [
            { label: "yes, and n is large", to: { pick: "One-sample z-test" } },
            { label: "no — the usual case", to: { pick: "One-sample t-test" } }
          ] } },
        { label: "two", to: {
          q: "Same subjects measured twice?",
          hint: "Same people measured twice: each employee's score before and after a " +
                "training course. Different people: the people who left against the people " +
                "who stayed.",
          a: [
            { label: "yes — before and after", to: { pick: "Paired t-test" } },
            { label: "no — separate people", to: { pick: "Two-sample t-test" } }
          ] } }
      ] } }
  ] },

synth: {
  q: "What do you want to practise?",
  hint: "Pick the kind of answer your practice table should have: a number (like a " +
        "salary), a label (like Yes or No), or no answer at all, just groups.",
  a: [
    { label: "predicting a number", to: { pick: "make_regression" } },
    { label: "predicting a label",  to: { pick: "make_classification" } },
    { label: "finding groups",      to: { pick: "make_blobs" } }
  ] },

/* ── 2. clean it ────────────────────────────────────────────────────────── */

clean: { seq: ["Fix inconsistent spellings", "drop_duplicates()", "Check and fix dtypes",
               "Know what each column IS"] },

outliers: {
  q: "Is this value possible at all?",
  hint: "Could this value really happen? Age 99 for someone still at work almost " +
        "certainly cannot — it is a typing mistake. 137 km from home can happen; it " +
        "is just rare.",
  see: ["Age", "DistanceFromHome"],
  a: [
    { label: "impossible — age 300, negative price", to: { pick: "Drop the row" } },
    { label: "possible, just rare", to: {
      q: "Is the extreme value the thing you care about?",
      hint: "Sometimes the rare value is the whole point — a fraud, a machine failure, " +
            "a sales spike. Other times it is just noise that pulls everything else " +
            "off.",
      a: [
        { label: "yes — fraud, failure, a spike", to: { pick: "Keep them, use a model that does not care" } },
        { label: "no, it is noise", to: {
          q: "Is the column roughly bell-shaped?",
          hint: "Bell-shaped means most values sit in the middle and thin out evenly on " +
                "both sides. MonthlyIncome is not: it has a long tail to the right.",
          see: ["MonthlyIncome"],
          a: [
            { label: "yes", to: { pick: "Z-score / 3-sd rule" } },
            { label: "no, it is skewed", to: { pick: "IQR fence, then clip" } }
          ] } }
      ] } }
  ] },

/* ── 3. split it ────────────────────────────────────────────────────────── */

split: { seq: ["train_test_split(stratify=y)", "Pipeline + ColumnTransformer"] },

/* ── 4. pre-process it ──────────────────────────────────────────────────── */

missing: {
  q: "How much of the column is blank?",
  hint: "Count the blanks in that column. In Meera's file MonthlyIncome has 28 " +
        "blanks in 706 rows — about 4%.",
  see: ["MonthlyIncome"],
  a: [
    { label: "under ~5%, scattered", to: { pick: "df.dropna()" } },
    { label: "more than that", to: {
      q: "What kind of column is it?",
      hint: "Numeric holds amounts, like Age. Text holds names, like Gender. Time order " +
            "means each row follows the one before, like daily readings — Meera's rows " +
            "are not in time order.",
      see: ["Age", "Gender"],
      a: [
        { label: "numeric", to: {
          q: "What shape is it?",
          hint: "Long tail: a few values far bigger than the rest, like MonthlyIncome. " +
                "Symmetric: values spread evenly around the middle. Columns related: other " +
                "columns can predict this one, like Age and YearsAtCompany.",
          see: ["MonthlyIncome", "Age", "YearsAtCompany"],
          a: [
            { label: "long tail, or outliers", to: { pick: "SimpleImputer(strategy='median')" } },
            { label: "roughly symmetric",      to: { pick: "SimpleImputer(strategy='mean')" } },
            { label: "small table, columns related", to: { pick: "KNNImputer" } }
          ] } },
        { label: "text / category", to: {
          q: "Does the blank itself mean something?",
          hint: "Sometimes a blank is an answer — no second phone number, never upgraded. " +
                "Then keep it as its own value. If it is just missing, fill it with the " +
                "most common value.",
          a: [
            { label: "yes — no second phone, never upgraded", to: { pick: "Fill with a 'Missing' category" } },
            { label: "no, it is just absent", to: { pick: "SimpleImputer(strategy='most_frequent')" } }
          ] } },
        { label: "rows are in time order", to: { pick: "ffill / bfill" } }
      ] } }
  ] },

encode: {
  q: "What is this column for?",
  hint: "The target is the answer you predict — Attrition in Meera's table. Input " +
        "features are the clues the model learns from — Gender, Department, " +
        "Education.",
  see: ["Attrition", "Gender", "Department", "Education"],
  a: [
    { label: "it is the target y", to: { pick: "LabelEncoder" } },
    { label: "it is an input feature", to: {
      q: "Is the order real? Low < Medium < High",
      hint: "Education and PerformanceRating have a real order: High School comes " +
            "before Bachelors, Low before Medium. Gender and Department do not: Sales " +
            "is not “more” than HR.",
      see: ["Education", "PerformanceRating", "Department"],
      a: [
        { label: "yes, the order means something", to: { pick: "OrdinalEncoder" } },
        { label: "no, they are just names", to: {
          q: "A quick look, or the real pipeline?",
          hint: "A quick look is exploring in a notebook. The real pipeline is the code " +
                "that trains and serves the model, and it must turn next month's data into " +
                "exactly the same columns.",
          a: [
            { label: "just exploring", to: { pick: "pd.get_dummies()" } },
            { label: "the real pipeline", to: { pick: "OneHotEncoder" } }
          ] } }
      ] } }
  ] },

shape: {
  q: "How heavy is the tail?",
  hint: "Heavy: the biggest values are tens of times the typical one — " +
        "MonthlyIncome's typical value is 4,896, its largest 49,799. Mild: the big " +
        "values are only a few times bigger, or the column is counts.",
  see: ["MonthlyIncome"],
  a: [
    { label: "heavy — income, price, page views", to: { pick: "FunctionTransformer(np.log1p)" } },
    { label: "mild, or it is count data", to: { pick: "Square-root transform" } }
  ] },

scale: {
  q: "Does your model measure distance, or fit a weight?",
  hint: "Some models compare rows by how far apart their numbers are, or give each " +
        "column a weight. For them, MonthlyIncome in thousands would drown out Age " +
        "in tens. Trees only ask “is Age above 40?”, so units do not matter.",
  see: ["Age", "MonthlyIncome"],
  a: [
    { label: "no — trees, forests, boosting, Naive Bayes", to: { pick: "Do not scale at all" } },
    { label: "yes — KNN, SVM, PCA, LDA, linear models", to: {
      q: "Are you scaling columns, or whole rows?",
      hint: "Almost always columns: bring Age and MonthlyIncome onto a similar range. " +
            "Rows only for things like word counts, where each row should end up the " +
            "same overall size.",
      see: ["Age", "MonthlyIncome"],
      a: [
        { label: "rows — word counts, a signal vector", to: { pick: "Normalizer" } },
        { label: "columns, the normal case", to: {
          q: "Did extreme values survive cleaning?",
          hint: "Are real but extreme values still there, like the 49,799 salary? A scaler " +
                "built on the average would let them squash every other value.",
          see: ["MonthlyIncome"],
          a: [
            { label: "yes, and they are real", to: { pick: "RobustScaler" } },
            { label: "no, the column is clean", to: {
              q: "Do you need a guaranteed 0–1 range?",
              hint: "Some tools need every value between 0 and 1, like image pixels or some " +
                    "neural networks. If nothing asks for it, the standard version is the safer " +
                    "default.",
              a: [
                { label: "yes", to: { pick: "MinMaxScaler" } },
                { label: "no", to: { pick: "StandardScaler" } }
              ] } }
          ] } }
      ] } }
  ] },

/* ── 5. feature engineering ─────────────────────────────────────────────── */

select: {
  q: "What is actually wrong with the columns?",
  hint: "Never vary: the same value in every row. Repeat each other: two columns " +
        "that say the same thing. Too many: you want the model to choose. Overlap: " +
        "many columns share information, so dropping any one loses some.",
  a: [
    { label: "some never vary at all", to: { pick: "VarianceThreshold" } },
    { label: "some repeat each other", to: { pick: "Correlation check, drop one of a pair" } },
    { label: "too many — let the model judge", to: {
      q: "Does your model report importances or coefficients?",
      hint: "Trees report how much each column helped, and linear models give each " +
            "column a weight. KNN and SVM give neither, so columns have to be tested by " +
            "trying them.",
      a: [
        { label: "yes — trees, linear models", to: { pick: "RFE" } },
        { label: "no — KNN, SVM", to: { pick: "SequentialFeatureSelector (forward / backward)" } }
      ] } },
    { label: "they overlap, and dropping any loses signal", to: {
      q: "Do you have class labels, and is separating those classes the point?",
      hint: "Labels are answers like Attrition = Yes or No. If the goal is to tell " +
            "leavers from stayers, squash the columns in the way that separates those " +
            "two groups best.",
      see: ["Attrition"],
      a: [
        { label: "yes — it is a classifier", to: { pick: "LDA as a reduction step" } },
        { label: "no, or I just want the table narrower", to: { pick: "PCA" } }
      ] } }
  ] },

/* ── 6. choose a model ──────────────────────────────────────────────────── */

reg: {
  q: "Is the relationship a straight line?",
  hint: "Plot the number you predict against one clue. If the dots follow a " +
        "straight line — salary rising steadily with years — say yes. If they curve " +
        "or jump in steps, it bends.",
  see: ["MonthlyIncome", "YearsAtCompany"],
  a: [
    { label: "yes, roughly", to: {
      q: "Are some y values plainly wrong — a sensor default, a stuck amount, a failed parse?",
      hint: "y is the number you predict. Are some of those numbers mistakes — a salary " +
            "stuck at 0, or 99999 left behind by a failed import?",
      a: [
        { label: "yes, and I want to know which rows", to: { pick: "RANSACRegressor" } },
        { label: "yes, but keep every row, just tamed", to: { pick: "HuberRegressor" } },
        { label: "yes, and it is a small table", to: { pick: "TheilSenRegressor" } },
        { label: "no, the target column is trustworthy", to: {
      q: "Are there many columns, or do they repeat each other?",
      hint: "Many columns, or columns that move together like Age and YearsAtCompany, " +
            "make a plain straight line jumpy. A penalty keeps it calm.",
      see: ["Age", "YearsAtCompany"],
      a: [
        { label: "no, a small clean set", to: { pick: "LinearRegression" } },
        { label: "yes", to: {
          q: "Do you want the weak columns removed?",
          hint: "Removed: columns that barely help get a weight of exactly zero, so you can " +
                "see which ones matter. Kept: every column stays, just with smaller " +
                "weights.",
          a: [
            { label: "yes, drop them to zero", to: { pick: "Lasso" } },
            { label: "no, keep them all, just calmer", to: { pick: "Ridge" } },
            { label: "both — and they come in groups", to: { pick: "ElasticNet" } }
          ] } }
      ] } }
      ] } },
    { label: "no, it bends", to: {
      q: "One clear curve, or steps and regions?",
      hint: "One curve: the dots bend smoothly, like a U or an arc. Steps: the answer " +
            "jumps at thresholds, like pay jumping at each new job level.",
      a: [
        { label: "one clear curve", to: { pick: "PolynomialFeatures + LinearRegression" } },
        { label: "steps, regions, thresholds", to: {
          q: "Explanation, or accuracy?",
          hint: "Explanation: you must show someone why each prediction was made. Accuracy: " +
                "the best score matters more than the reason.",
          a: [
            { label: "I must explain it", to: { pick: "DecisionTreeRegressor" } },
            { label: "I need the score",  to: { pick: "RandomForestRegressor" } }
          ] } }
      ] } }
  ] },

clf: {
  q: "How much data do you have?",
  hint: "Meera has 706 rows and about 16 columns once the words are encoded — a " +
        "normal amount. Very little is a few dozen rows. Many columns, few rows " +
        "means more columns than examples to learn from.",
  a: [
    { label: "very little", to: {
      q: "Can the boundary be written as a rule?",
      hint: "Could a simple rule split the classes, like “works overtime and earns " +
            "under 3,000 → leaves”? If the classes mix irregularly, no. Text data " +
            "counts as rule-friendly here.",
      see: ["OverTime", "MonthlyIncome"],
      a: [
        { label: "no, it is irregular", to: { pick: "KNeighborsClassifier" } },
        { label: "yes, or it is text", to: { pick: "GaussianNB / MultinomialNB" } }
      ] } },
    { label: "a normal amount", to: {
      q: "What do you need most?",
      hint: "For Meera: a chance of leaving per employee, so HR can talk to the " +
            "riskiest first → a probability. A rule HR can read → explain the decision. " +
            "Or simply the best score.",
      see: ["Attrition"],
      a: [
        { label: "a probability per row, and a movable threshold", to: { pick: "LogisticRegression" } },
        { label: "to explain the decision", to: { pick: "DecisionTreeClassifier" } },
        { label: "a strong score, little tuning", to: { pick: "RandomForestClassifier" } },
        { label: "the last few points of accuracy", to: { pick: "GradientBoosting / AdaBoost" } },
        { label: "models that fail differently, combined", to: { pick: "VotingClassifier" } }
      ] } },
    { label: "many columns, few rows", to: {
      q: "Are the classes roughly round, similar clouds?",
      hint: "Plot two columns and colour the dots by class. Round, similar-sized clouds " +
            "suit a straight boundary. Odd shapes with a clear gap between them suit " +
            "the widest gap.",
      a: [
        { label: "yes", to: { pick: "LinearDiscriminantAnalysis" } },
        { label: "no, but there is a clear gap", to: { pick: "SVC" } }
      ] } }
  ] },

clu: {
  q: "Do you already know how many groups there are?",
  hint: "Sometimes the business decides: “we want 4 customer segments”. Otherwise " +
        "you have to find a sensible number from the data itself.",
  a: [
    { label: "yes, the business names them", to: { pick: "KMeans" } },
    { label: "no idea", to: {
      q: "Do you want to see every possible k at once?",
      hint: "k is the number of groups. A dendrogram draws every possible number of " +
            "groups as one tree. The elbow method tries a few values of k and stops " +
            "where the gain flattens out.",
      a: [
        { label: "yes, show me the whole history", to: { pick: "AgglomerativeClustering + dendrogram" } },
        { label: "no, just find the elbow", to: { pick: "KMeans" } }
      ] } }
  ] },

/* ── 7. check the score ─────────────────────────────────────────────────── */

regmetric: {
  q: "What do you need the number for?",
  hint: "Better than guessing: does the model beat always predicting the average " +
        "salary? Real units: how far off, in rupees, is a typical prediction?",
  see: ["MonthlyIncome"],
  a: [
    { label: "is this better than guessing the mean?", to: {
      q: "Comparing models with different column counts?",
      hint: "Adding any column nudges plain R² up, even a useless one. If the models " +
            "you compare use different numbers of columns, use the version that charges " +
            "for each column.",
      a: [
        { label: "yes", to: { pick: "Adjusted R²" } },
        { label: "no, one fixed model", to: { pick: "R²" } }
      ] } },
    { label: "how far off am I, in real units?", to: {
      q: "Should one big miss hurt more than several small ones?",
      hint: "Missing one salary by 10,000, or ten salaries by 1,000 each: should the " +
            "single big miss count as worse?",
      see: ["MonthlyIncome"],
      a: [
        { label: "yes, big misses are expensive", to: { pick: "RMSE" } },
        { label: "no, every rupee of error is equal", to: { pick: "MAE" } }
      ] } }
  ] },

clfmetric: {
  q: "Have you looked at the confusion matrix yet?",
  hint: "The confusion matrix is a small table: how many leavers the model caught, " +
        "how many it missed, and how many stayers it wrongly flagged. Every other " +
        "score is built from it.",
  see: ["Attrition"],
  a: [
    { label: "not yet", to: { pick: "Confusion matrix" } },
    { label: "yes, I have", to: {
      q: "Are the classes balanced?",
      hint: "Balanced means roughly half and half. Meera's are not: 71% stayed and 29% " +
            "left.",
      see: ["Attrition"],
      a: [
        { label: "yes, and both mistakes cost the same", to: { pick: "Accuracy" } },
        { label: "no, one class is rare", to: {
          q: "Which mistake is expensive?",
          hint: "For Meera, a false alarm is flagging someone who was never going to leave. " +
                "A miss is not flagging someone who then leaves. Which one costs HR more?",
          see: ["Attrition"],
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
  hint: "Time order means each row happened after the one before, like monthly " +
        "sales. Shuffling those would let the model peek at the future. Meera's " +
        "rows are not in time order.",
  a: [
    { label: "yes — never shuffle them", to: { pick: "Single hold-out split" } },
    { label: "no, order is meaningless", to: {
      q: "Plenty of rows, or few?",
      hint: "With tens of thousands of rows, one test split gives a steady score. With " +
            "a few hundred, like Meera's 706, one split can be lucky or unlucky.",
      a: [
        { label: "plenty, and I want a fast answer", to: { pick: "Single hold-out split" } },
        { label: "few — one split cannot be trusted", to: {
          q: "Predicting a label, or a number?",
          hint: "A label, like Attrition Yes or No. A number, like MonthlyIncome.",
          see: ["Attrition", "MonthlyIncome"],
          a: [
            { label: "a label", to: { pick: "StratifiedKFold" } },
            { label: "a number", to: { pick: "KFold + cross_val_score" } }
          ] } }
      ] } }
  ] },

tune: {
  q: "How big is the search space?",
  hint: "Count the combinations you want to try: 3 values for one setting and 3 for " +
        "another is 9 — small. Many settings with wide ranges quickly runs into " +
        "thousands.",
  a: [
    { label: "a few knobs, a few values each", to: { pick: "GridSearchCV" } },
    { label: "many knobs, wide ranges, or a deadline", to: { pick: "RandomizedSearchCV" } }
  ] },

/* ── 8. ship it ─────────────────────────────────────────────────────────── */

ship: {
  q: "What are you saving?",
  hint: "A trained scikit-learn model or pipeline, which holds large arrays of " +
        "numbers — or a small plain Python object, like a dictionary of settings.",
  a: [
    { label: "a scikit-learn model or pipeline", to: { pick: "joblib.dump" } },
    { label: "a plain Python object, no big arrays", to: { pick: "pickle" } }
  ] }

};
