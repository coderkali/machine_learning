const topic = (title, details, source, status = 'learned') => ({ title, details, source, status });
const branch = (title, meta, children, status = 'learned', source = '') => ({ title, meta, children, status, source });

const treeData = branch('MACHINE_LEARNING', 'Complete repository map', [
  branch('AI_ML_Series', 'Active learning workspace', [
    branch('01 · Engineering Python', 'Python foundations', [
      topic('Variables and naming', ['Variables, assignment, naming rules, and readable values'], '../AI_ML_Series/01_engineering_python/01_python/session_01_variables_data_types_numbers_strings/variables_data_types_numbers_strings.ipynb', 'learning'),
      topic('Data types and numbers', ['int, float, complex, bool, arithmetic operators, and type()'], '../AI_ML_Series/01_engineering_python/01_python/session_01_variables_data_types_numbers_strings/variables_data_types_numbers_strings.ipynb', 'learning'),
      topic('Strings and formatted output', ['Indexing, slicing, string methods, input conversion, and f-strings'], '../AI_ML_Series/01_engineering_python/01_python/session_01_variables_data_types_numbers_strings/variables_data_types_numbers_strings.ipynb', 'learning')
    ], 'learning', '../AI_ML_Series/01_engineering_python/README.md'),
    branch('02 · Data Toolkit and Apps', 'NumPy, Pandas, visualisation, Streamlit, scikit-learn', [
      branch('01 · NumPy', 'Arrays and numerical computing', [
        topic('Array shape and dimensions', ['Creating arrays, dtype, shape, ndim, size, reshape, ravel, and flatten'], '../AI_ML_Series/02_data_toolkit_apps/01_numpy/example_01.ipynb'),
        topic('Indexing, slicing, and masks', ['Array indexing, slicing, boolean masks, and array builders'], '../AI_ML_Series/02_data_toolkit_apps/01_numpy/example_01.ipynb'),
        topic('Vectorised operations', ['Element-wise maths, universal functions, and statistics'], '../AI_ML_Series/02_data_toolkit_apps/01_numpy/example_02.ipynb'),
        topic('Broadcasting', ['Applying operations across compatible array shapes'], '../AI_ML_Series/02_data_toolkit_apps/01_numpy/example_02.ipynb'),
        topic('Linear algebra basics', ['Matrix product with @, stacking, splitting, and np.linalg'], '../AI_ML_Series/02_data_toolkit_apps/01_numpy/example_02.ipynb'),
        topic('API health monitoring exercise', ['Latency arrays and robust outlier detection with MAD; project is partially complete'], '../AI_ML_Series/02_data_toolkit_apps/01_numpy/project_01_api_health.ipynb', 'learning')
      ], 'learning', '../AI_ML_Series/02_data_toolkit_apps/01_numpy/README.md'),
      branch('02 · Pandas', 'DataFrames and practical data work', [
        topic('Series and DataFrames', ['Construction, shape, head, tail, info, and describe'], '../AI_ML_Series/02_data_toolkit_apps/02_pandas/example_01.ipynb'),
        topic('Selection and indexing', ['loc, iloc, column selection, and index reassignment'], '../AI_ML_Series/02_data_toolkit_apps/02_pandas/example_01.ipynb'),
        topic('Cleaning and transformation', ['query, missing values, duplicates, astype, rank, and get_dummies'], '../AI_ML_Series/02_data_toolkit_apps/02_pandas/example_02.ipynb'),
        topic('Grouping and reshaping', ['groupby, pivot_table, joins, and aggregation'], '../AI_ML_Series/02_data_toolkit_apps/02_pandas/example_02.ipynb'),
        topic('Date, string, and file accessors', ['.dt, .str, CSV input/output, and Excel output'], '../AI_ML_Series/02_data_toolkit_apps/02_pandas/example_02.ipynb', 'learning'),
        topic('Practice datasets', ['Age, income, jobs, salary, bike, car, exam, encoding, and PCA CSV data'], '../AI_ML_Series/02_data_toolkit_apps/02_pandas/DataSet/')
      ], 'learning', '../AI_ML_Series/02_data_toolkit_apps/02_pandas/README.md'),
      branch('03 · Matplotlib', 'Static visualisation', [
        topic('Core chart types', ['Line, scatter, bar, histogram, and pie charts'], '../AI_ML_Series/02_data_toolkit_apps/03_matplotlib/example_01.ipynb'),
        topic('Annotations and layout', ['fill_between, annotation, subplots, figure layout, and savefig'], '../AI_ML_Series/02_data_toolkit_apps/03_matplotlib/example_01.ipynb')
      ], 'learned', '../AI_ML_Series/02_data_toolkit_apps/03_matplotlib/README.md'),
      branch('04 · Seaborn', 'Statistical visualisation', [
        topic('Relational and distribution plots', ['scatterplot, lineplot, histplot, and kdeplot'], '../AI_ML_Series/02_data_toolkit_apps/04_seaborn/example_01.ipynb'),
        topic('Categorical plots and grids', ['Box, violin, bar, count, pairplot, FacetGrid, themes, and styling'], '../AI_ML_Series/02_data_toolkit_apps/04_seaborn/example_01.ipynb')
      ], 'learned', '../AI_ML_Series/02_data_toolkit_apps/04_seaborn/README.md'),
      branch('05 · Iris Visual Explorer', 'Notebook plus HTML/CSS/JavaScript app', [
        topic('Iris dataset exploration', ['Dataset structure, features, species comparisons, and visual exploration'], '../AI_ML_Series/02_data_toolkit_apps/05_iris_visual_explorer/iris_dataset_explained.ipynb'),
        topic('Interactive browser explorer', ['A small web app for exploring Iris data'], '../AI_ML_Series/02_data_toolkit_apps/05_iris_visual_explorer/index.html')
      ]),
      branch('06 · Plotly', 'Interactive and 3D charts', [
        topic('Interactive chart families', ['Line, scatter, bar, box, violin, pie, area, and sunburst charts'], '../AI_ML_Series/02_data_toolkit_apps/06_plotly/example_01.ipynb'),
        topic('3D projection', ['How three numbers become a position in a 3D scatter plot'], '../AI_ML_Series/02_data_toolkit_apps/06_plotly/concept_3d_projection.md')
      ], 'learned', '../AI_ML_Series/02_data_toolkit_apps/06_plotly/README.md'),
      branch('07 · Streamlit', 'Rapid data apps', [
        topic('Widgets and layout', ['Widgets, columns, caching, charts, and session state'], '../AI_ML_Series/02_data_toolkit_apps/07_streamlit/app.py', 'learning'),
        topic('Sales analysis dashboard', ['Matplotlib, Seaborn, Plotly, and a learner-written analysis app'], '../AI_ML_Series/02_data_toolkit_apps/07_streamlit/sales_analysis.py', 'learning'),
        topic('Reruns and widget state', ['Open issues around button reruns and widget value ranges'], '../AI_ML_Series/02_data_toolkit_apps/07_streamlit/sales_analysis_explained.md', 'learning')
      ], 'learning', '../AI_ML_Series/02_data_toolkit_apps/07_streamlit/README.md'),
      branch('08 · scikit-learn', 'Classical machine learning workflow', [
        topic('Train/test split and reproducibility', ['train_test_split, test_size, shuffle, random_state, and stratify'], '../AI_ML_Series/02_data_toolkit_apps/08_sklearn/README.md'),
        topic('Synthetic datasets', ['Regression, classification, blobs, circles, and moons'], '../AI_ML_Series/02_data_toolkit_apps/08_sklearn/README.md'),
        topic('Preprocessing', ['Scaling, binarization, normalization, label encoding, one-hot encoding, Pipeline, and ColumnTransformer'], '../AI_ML_Series/02_data_toolkit_apps/08_sklearn/README.md', 'learning'),
        topic('Exploratory data analysis', ['Univariate and multivariate inspection before modelling'], '../AI_ML_Series/02_data_toolkit_apps/08_sklearn/README.md'),
        topic('Regression models', ['Linear, multiple linear, Ridge, Lasso, ElasticNet, and polynomial regression'], '../AI_ML_Series/02_data_toolkit_apps/08_sklearn/README.md', 'learning'),
        topic('Cross-validation and tuning', ['Cross-validation, hyperparameter search, and model comparison'], '../AI_ML_Series/02_data_toolkit_apps/08_sklearn/README.md'),
        topic('Clustering', ['K-Means and hierarchical clustering'], '../AI_ML_Series/02_data_toolkit_apps/08_sklearn/README.md'),
        topic('Classification evaluation', ['Classification metrics, ROC curves, and AUC'], '../AI_ML_Series/02_data_toolkit_apps/08_sklearn/README.md'),
        topic('Trees and probabilistic models', ['Decision trees for classification and regression, plus Naive Bayes'], '../AI_ML_Series/02_data_toolkit_apps/08_sklearn/README.md'),
        topic('Ensembles', ['Random forests, AdaBoost, gradient boosting, and voting ensembles'], '../AI_ML_Series/02_data_toolkit_apps/08_sklearn/README.md'),
        topic('Outlier detection', ['DBSCAN, Elliptic Envelope, Isolation Forest, and Local Outlier Factor'], '../AI_ML_Series/02_data_toolkit_apps/08_sklearn/README.md'),
        topic('Support vector classifiers', ['SVC visualised in two and three dimensions'], '../AI_ML_Series/02_data_toolkit_apps/08_sklearn/README.md')
      ], 'learning', '../AI_ML_Series/02_data_toolkit_apps/08_sklearn/README.md')
    ], 'learning', '../AI_ML_Series/02_data_toolkit_apps/README.md'),
    branch('03–13 · Future phases', 'Math, analytics, neural AI, RAG, agents, MLOps, cloud, and career', [
      topic('Phase 03 · Math and relational data', ['Repository scaffold exists; topic evidence not yet added'], '../AI_ML_Series/03_math_relational_data/README.md', 'planned'),
      topic('Phase 04 · Analytics and BI', ['Repository scaffold exists; topic evidence not yet added'], '../AI_ML_Series/04_analytics_bi/README.md', 'planned'),
      topic('Phase 05 · Classical ML and forecasting', ['Repository scaffold exists; topic evidence not yet added'], '../AI_ML_Series/05_classical_ml_forecasting/README.md', 'planned'),
      topic('Phase 06 · Neural AI modalities', ['Repository scaffold exists; topic evidence not yet added'], '../AI_ML_Series/06_neural_ai_modalities/README.md', 'planned'),
      topic('Phase 07 · Transformers and prompting', ['Repository scaffold exists; topic evidence not yet added'], '../AI_ML_Series/07_transformers_prompting/README.md', 'planned'),
      topic('Phase 08 · Retrieval and LLM apps', ['Repository scaffold exists; topic evidence not yet added'], '../AI_ML_Series/08_retrieval_llm_apps/README.md', 'planned'),
      topic('Phase 09 · Agents and fine-tuning', ['Repository scaffold exists; topic evidence not yet added'], '../AI_ML_Series/09_agents_finetuning_nocode/README.md', 'planned'),
      topic('Phase 10 · Containers and MLOps', ['Repository scaffold exists; topic evidence not yet added'], '../AI_ML_Series/10_containers_mlops/README.md', 'planned'),
      topic('Phase 11 · Data platforms', ['Repository scaffold exists; topic evidence not yet added'], '../AI_ML_Series/11_data_platforms/README.md', 'planned'),
      topic('Phase 12 · Cloud and LLMOps', ['Repository scaffold exists; topic evidence not yet added'], '../AI_ML_Series/12_cloud_llmops/README.md', 'planned'),
      topic('Phase 13 · AI system design and career', ['Repository scaffold exists; topic evidence not yet added'], '../AI_ML_Series/13_ai_system_design_career/README.md', 'planned')
    ], 'planned', '../AI_ML_Series/README.md')
  ], 'learning', '../AI_ML_Series/README.md'),
  branch('Foundations_Archive', 'Historical learning evidence', [
    branch('DataScience_Y · Statistics and inference', 'Earlier statistical study', [
      topic('Variability and spread', ['Measures of variability, standard deviation, IQR, and skewness'], '../Foundations_Archive/DataScience_Y/02_MeasureMent_Of_Variability.ipynb', 'archive'),
      topic('Correlation and distributions', ['Correlation, normal distributions, and Central Limit Theorem'], '../Foundations_Archive/DataScience_Y/06_co-relation.ipynb', 'archive'),
      topic('Hypothesis testing', ['T-tests, Z-tests, Chi-square tests, confidence levels, and test selection'], '../Foundations_Archive/DataScience_Y/08_Hypothesis_Testing.ipynb', 'archive')
    ], 'archive', '../Foundations_Archive/DataScience_Y/'),
    branch('math_for_ml', 'Mathematics for machine learning', [
      topic('Algebra and functions', ['Variables, expressions, and linear versus nonlinear charts'], '../Foundations_Archive/math_for_ml/phase_1_algebra/', 'archive'),
      topic('Statistics and probability', ['Mean, median, mode, variance, standard deviation, probability, and normal distribution'], '../Foundations_Archive/math_for_ml/phase_2_statistics/', 'archive'),
      topic('Linear algebra', ['Linear algebra notes, practical examples, FAQs, and a cheat sheet'], '../Foundations_Archive/math_for_ml/phase_3_linear_algebra/', 'archive'),
      topic('Calculus and gradients', ['Slope, derivatives, and gradient descent intuition'], '../Foundations_Archive/math_for_ml/phase_4_calculus/', 'archive'),
      topic('Linear regression foundations', ['y = wx + b, weights, bias, cost, derivatives, gradient descent, and messy data'], '../Foundations_Archive/math_for_ml/phase_5_linear_regression/', 'archive')
    ], 'archive', '../Foundations_Archive/math_for_ml/'),
    branch('ML · Data preparation and models', 'Earlier applied ML notebooks', [
      topic('Data cleaning', ['Data types, missing-value detection, dropping, filling, ordering, and duplicate handling'], '../Foundations_Archive/ML/05_Data_Cleaning_Practice.ipynb', 'archive'),
      topic('Encoding categorical data', ['One-hot, label, and ordinal encoding'], '../Foundations_Archive/ML/09_one_hot_encoding.ipynb', 'archive'),
      topic('Outlier treatment', ['IQR and Z-score detection and removal'], '../Foundations_Archive/ML/13_Outlier_Removal_IQR.ipynb', 'archive'),
      topic('Feature scaling and transformation', ['Standardisation, Min-Max normalisation, and function transformers'], '../Foundations_Archive/ML/15_Feature_Scaling.ipynb', 'archive'),
      topic('Feature selection', ['Variance Threshold, forward selection, and backward selection'], '../Foundations_Archive/ML/20_Feature_Selection_techniques.ipynb', 'archive'),
      topic('Regression families', ['Simple, multiple, and polynomial regression'], '../Foundations_Archive/ML/26_Simple_Linear_Regression.ipynb', 'archive'),
      topic('Cost and error functions', ['MSE, MAE, RMSE, cost functions, and gradient descent'], '../Foundations_Archive/ML/30_Cost_Function_MSE_GradientDescent.ipynb', 'archive'),
      topic('Employee attrition pipeline', ['A multi-step data preparation and modelling project'], '../Foundations_Archive/ML/project/Employee_Attrition_Pipeline.ipynb', 'archive')
    ], 'archive', '../Foundations_Archive/ML/'),
    branch('Archive library practice', 'Earlier NumPy, Pandas, Matplotlib, Seaborn, and Iris work', [
      topic('Iris and dashboard exploration', ['Iris notebooks, pizza examples, dashboards, and CSV exploration'], '../Foundations_Archive/irisData_Exploration/', 'archive'),
      topic('NumPy, Pandas, Matplotlib, and Seaborn basics', ['Earlier library examples and small datasets'], '../Foundations_Archive/NumPy/', 'archive'),
      topic('Classical ML preparation', ['Data collection, data cleaning, and outlier visual reference'], '../Foundations_Archive/phase_3_classical_ml/', 'archive')
    ], 'archive', '../Foundations_Archive/'),
  ], 'archive', '../Foundations_Archive/README.md'),
  branch('Repository knowledge base', 'Shared documentation and orientation', [
    topic('Curriculum map', ['Authoritative mapping of instructor modules to phases and evidence'], '../docs/curriculum-map.md'),
    topic('Course overview and concept map', ['Scope, sequencing, and relationships among ML, deep learning, RAG, agents, MLOps, and data platforms'], '../docs/course-overview.md'),
    topic('Glossary', ['Definitions for estimators, leakage, scaling, regularisation, embeddings, RAG, and evaluation'], '../docs/glossary.md'),
    topic('Review queue', ['Known gaps, failing cells, unresolved exercises, and reproducibility issues'], '../docs/review-queue.md', 'learning'),
    topic('Experiments and projects', ['Folders are ready for future reproducible investigations and larger applications'], '../experiments/README.md', 'planned')
  ], 'learned', '../README.md')
]);

const treeRoot = document.querySelector('#tree-root');
const emptyState = document.querySelector('#empty-state');
const resultCount = document.querySelector('#result-count');
const search = document.querySelector('#search');
const details = document.querySelector('#details');
const backdrop = document.querySelector('#backdrop');
const detailsContent = document.querySelector('#details-content');
const statusText = { learned: 'Learned', learning: 'In progress', archive: 'Archive', planned: 'Planned' };
let activeQuery = '';
const nodeById = new Map();
let nextNodeId = 0;

const escapeHtml = value => String(value).replace(/[&<>'"]/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[character]));
const countTopics = node => node.children ? node.children.reduce((sum, child) => sum + countTopics(child), 0) : 1;
const countBranches = node => node.children ? 1 + node.children.reduce((sum, child) => sum + (child.children ? countBranches(child) : 0), 0) : 0;
const matching = node => !activeQuery || [node.title, node.meta, ...(node.details || [])].join(' ').toLowerCase().includes(activeQuery) || (node.children || []).some(matching);

function indexNodes(node) {
  node.id = `node-${nextNodeId++}`;
  nodeById.set(node.id, node);
  (node.children || []).forEach(indexNodes);
}

function renderNode(node, level = 0) {
  if (!matching(node)) return '';
  const hasChildren = Boolean(node.children);
  const isTopic = !hasChildren;
  const cardClass = `${isTopic ? 'topic' : 'branch'} ${node.status}`;
  const label = statusText[node.status] || statusText.learned;
  const children = hasChildren ? `<div class="children" role="group">${node.children.map(child => renderNode(child, level + 1)).join('')}</div>` : '';
  const action = isTopic ? 'data-topic="true"' : 'data-branch="true"';
  return `<div class="tree-node ${level === 0 || (activeQuery && node.children) ? 'open' : ''}" role="treeitem" aria-level="${level + 1}">
    <button class="node-card ${cardClass} ${isTopic ? 'topic-card' : ''}" ${action} data-node-id="${node.id}" type="button">
      <span class="chevron" aria-hidden="true">${hasChildren ? '›' : '•'}</span><h3>${escapeHtml(node.title)}</h3>
      <span class="meta">${escapeHtml(node.meta || '')}</span><span class="status-label ${node.status}">${label}</span>
    </button>${children}</div>`;
}

function render() {
  const html = renderNode(treeData);
  treeRoot.innerHTML = html;
  emptyState.hidden = Boolean(html);
  const topics = countTopics(treeData);
  resultCount.textContent = activeQuery ? `Showing matches for “${activeQuery}”` : `${topics} topics across ${countBranches(treeData)} branches`;
  treeRoot.querySelectorAll('[data-branch]').forEach(button => button.addEventListener('click', () => button.parentElement.classList.toggle('open')));
  treeRoot.querySelectorAll('[data-topic]').forEach(button => button.addEventListener('click', () => openDetails(nodeById.get(button.dataset.nodeId))));
}
function openDetails(node) { detailsContent.innerHTML = `<p class="overline">${statusText[node.status]}</p><h2 id="details-title">${escapeHtml(node.title)}</h2><p class="detail-meta">${escapeHtml(node.meta || '')}</p><ul class="details-list">${(node.details || []).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul><a class="source-link" href="${escapeHtml(node.source || '#')}">Open source: ${escapeHtml(node.source || 'Repository branch')}</a>`; details.classList.add('visible'); details.setAttribute('aria-hidden', 'false'); backdrop.hidden = false; }
function closeDetails() { details.classList.remove('visible'); details.setAttribute('aria-hidden', 'true'); backdrop.hidden = true; }

document.querySelector('#topic-count').textContent = countTopics(treeData);
document.querySelector('#branch-count').textContent = countBranches(treeData);
document.querySelector('#source-count').textContent = new Set((function sources(node) { return node.children ? node.children.flatMap(sources) : [node.source]; })(treeData)).size;
search.addEventListener('input', event => { activeQuery = event.target.value.trim().toLowerCase(); render(); });
document.querySelector('#expand-all').addEventListener('click', () => treeRoot.querySelectorAll('.tree-node').forEach(node => node.classList.add('open')));
document.querySelector('#collapse-all').addEventListener('click', () => treeRoot.querySelectorAll('.tree-node').forEach(node => node.classList.remove('open')));
document.querySelector('#reset-view').addEventListener('click', () => { search.value = ''; activeQuery = ''; render(); });
document.querySelector('#close-details').addEventListener('click', closeDetails);
backdrop.addEventListener('click', closeDetails);
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeDetails(); if (event.key === '/' && document.activeElement !== search) { event.preventDefault(); search.focus(); } });
indexNodes(treeData);
render();