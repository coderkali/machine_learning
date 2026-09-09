/* The ML journey: three phases, ten stages, mapped to the topics actually
   studied in this repository. Folder names are resolved against TREE at
   runtime, so a stage automatically shows a topic once its lesson exists. */

const SDLC = [
  { s: "Business requirement", ml: "Business problem" },
  { s: "Requirement gathering", ml: "Collect the data" },
  { s: "Jira story",            ml: "Frame it as a target to predict" },
  { s: "Development",           ml: "Train the model" },
  { s: "Testing",               ml: "Evaluate on held-out data" },
  { s: "Deploy to lower env",   ml: "Validate on a fresh split" },
  { s: "UAT",                   ml: "Shadow / A-B test" },
  { s: "Production",            ml: "Serve predictions" }
];

const PHASES = [
  {
    id: "prep", n: "1", name: "Data Preparation",
    sdlc: "≈ requirement gathering — you cannot build until you know what you actually have",
    blurb: "Get honest, usable rows. Most of the work lives here — and every mistake made here is inherited by every model you try later.",
    stages: [
      { id: "raw", name: "Raw Data", icon: "🗄",
        what: "The data as it arrives — messy, inconsistent, and rarely in the shape you need.",
        ask: "Where did this come from, and what does one row actually mean?",
        topics: ["04_ML/01_What_Is_ML", "04_ML/02_Types_Of_Variables",
                 "04_ML/03_Data_Collection", "01_Python/03_Pandas"] },
      { id: "clean", name: "Data Cleaning", icon: "🧹",
        what: "Fix what is wrong: blanks, duplicates, impossible values, wrong types.",
        ask: "Is this row wrong, or just unusual? One gets removed, the other is a finding.",
        topics: ["04_ML/04_Data_Cleaning", "04_ML/05_Missing_Values",
                 "04_ML/07_Outliers", "04_ML/09_Duplicates_And_Dtypes"] },
      { id: "prep2", name: "Pre-Processing", icon: "⚖️",
        what: "Put every column on terms the algorithm can read — numbers, comparable scales.",
        ask: "Does my model care about scale? Distance-based ones do.",
        topics: ["04_ML/06_Categorical_Encoding", "04_ML/08_Feature_Scaling",
                 "04_ML/12_Preprocessing", "04_ML/10_Function_Transformer"] }
    ]
  },
  {
    id: "feat", n: "2", name: "Feature Engineering",
    sdlc: "≈ solution design — deciding what the system is allowed to see",
    blurb: "Decide what the model is allowed to look at. Better features beat a better algorithm almost every time.",
    stages: [
      { id: "explore", name: "Explore", icon: "🔍",
        what: "Look at the data one column, two columns, then many columns at a time.",
        ask: "Which columns actually carry the signal?",
        topics: ["04_ML/15_EDA_Uni_Bi_Multivariate", "01_Python/05_Seaborn",
                 "02_DataScience/04_Correlation"] },
      { id: "select", name: "Select & Reduce", icon: "🎯",
        what: "Keep the columns that inform, drop the ones that only add noise or repeat each other.",
        ask: "Does removing this column make the model worse? If not, it was never a feature.",
        topics: ["04_ML/11_Feature_Selection", "04_ML/36_Linear_Discriminant_Analysis",
                 "04_ML/14_Synthetic_Datasets"] }
    ]
  },
  {
    id: "model", n: "3", name: "Model Building",
    sdlc: "≈ development → testing → UAT → production, in one loop",
    blurb: "Only now does an algorithm appear. Split first, fit on train only, and judge on rows the model has never seen.",
    stages: [
      { id: "split", name: "Data Split", icon: "✂️",
        what: "Hold rows back before learning anything — including before fitting a scaler.",
        ask: "Has any test information leaked into training?",
        topics: ["04_ML/13_Train_Test_Split", "04_ML/23_Cross_Validation"] },
      { id: "select-model", name: "Model Selection", icon: "🧭",
        what: "Choose a family that suits the target: a number, a label, or no label at all.",
        ask: "Am I predicting a number, a class, or looking for groups?",
        topics: ["04_ML/16_Linear_Regression", "04_ML/17_Multiple_Linear_Regression",
                 "04_ML/18_Polynomial_Regression", "04_ML/19_Ridge_Regression",
                 "04_ML/20_Lasso_Regression", "04_ML/21_ElasticNet",
                 "04_ML/26_Decision_Tree_Classification", "04_ML/27_Decision_Tree_Regression",
                 "04_ML/28_Naive_Bayes", "04_ML/29_K_Nearest_Neighbor",
                 "04_ML/30_Support_Vector_Machines", "04_ML/31_Clustering_KMeans",
                 "04_ML/32_Hierarchical_Clustering"] },
      { id: "train", name: "Training", icon: "⚙️",
        what: "fit() turns thousands of rows into a handful of learned numbers.",
        ask: "What did fit actually store? Anything with a trailing underscore.",
        topics: ["04_ML/22_Cost_Functions", "03_Math/05_Linear_Regression_From_Scratch"] },
      { id: "eval", name: "Evaluation", icon: "📊",
        what: "Score on held-out rows, with a metric that matches the cost of being wrong.",
        ask: "Is accuracy hiding a rare class I actually care about?",
        topics: ["04_ML/24_Model_Evaluation", "04_ML/25_ROC_And_AUC"] },
      { id: "tune", name: "Hyperparameter Tuning", icon: "🎛",
        what: "Turn the knobs you chose, not the ones the data learned. Search, do not guess.",
        ask: "Am I tuning against the test set by accident?",
        topics: ["04_ML/33_Hyperparameter_Tuning", "04_ML/34_Ensemble_Methods"] },
      { id: "final", name: "Final Model", icon: "📦",
        what: "Refit on all the training data with the settings you chose, then freeze and save it.",
        ask: "Can I reproduce this exact model tomorrow?",
        topics: ["04_ML/37_Model_Persistence", "04_ML/35_Project_Employee_Attrition"] },
      { id: "deploy", name: "Deployment", icon: "🚀",
        what: "Serve it behind an API, watch it drift, and retrain when reality moves.",
        ask: "What happens when live data stops looking like the training data?",
        topics: ["09_MLOps_And_Containers", "11_Cloud_And_LLMOps"] }
    ]
  }
];
