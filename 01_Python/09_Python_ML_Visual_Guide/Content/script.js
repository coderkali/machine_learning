'use strict';

const journeyStages = [
  ['Raw data','Files, tables, APIs','starts messy and shaped for collection, not learning.'],
  ['Python','Express the workflow','connects every stage with readable, reusable code.'],
  ['NumPy','Numerical memory','makes dense numerical operations fast.'],
  ['DataFrames','Pandas / Polars','add labels and useful table operations.'],
  ['Clean + EDA','Trust and inspect','repair meaning and test assumptions visually.'],
  ['Features','Represent signal','translate reality into learnable numbers.'],
  ['Scikit-learn','Train models','fits, transforms, predicts, and evaluates consistently.'],
  ['Evaluate','Test generalization','measures mistakes that matter to the business.'],
  ['Deep learning','When needed','learns representations from complex, abundant data.'],
  ['MLflow','Remember runs','connects models to parameters, evidence, and artifacts.'],
  ['FastAPI','Serve predictions','makes a model callable by other software.'],
  ['Production','Monitor value','adds reliability, feedback, monitoring, and people.']
];

const foundations = [
  ['Values + variables','x = 42','Name inputs and intermediate results.'],
  ['Lists + tuples','[row1, row2]','Ordered collections; tuples signal fixed structure.'],
  ['Dicts + sets','{"age": 35}','Named fields and fast unique membership.'],
  ['Loops','for row in rows','Repeat logic; arrays often replace numeric loops.'],
  ['Functions + lambda','def clean(x):','Reusable, testable transformations.'],
  ['Comprehensions','[f(x) for x in xs]','Compact collection transformations.'],
  ['Classes','class ModelService:','Bundle state with behavior when useful.'],
  ['Modules + packages','from app import data','Split experiments into maintainable parts.'],
  ['venv + pip','python -m venv .venv','Isolate and reproduce dependencies.'],
  ['Exceptions','try: ... except:','Handle expected failures without hiding bad data.']
];

const taxonomy = [
  ['Libraries','NumPy · Pandas · Matplotlib · Seaborn · SciPy'],
  ['ML libraries','Scikit-learn · XGBoost · LightGBM · CatBoost'],
  ['DL frameworks','PyTorch · TensorFlow / Keras'],
  ['App frameworks','FastAPI · Streamlit · Gradio'],
  ['Platforms + tools','Jupyter · MLflow · Hugging Face ecosystem'],
  ['Data engines','Polars · DuckDB · Dask']
];

const goals = {
  clean:['Clean CSV / Excel data','Pandas','Excellent for labeled rows, columns, missing values, types, merges, and file support.','NumPy + Seaborn + scikit-learn','Learn selection, null handling, and groupby.',['raw file','labeled table','clean rows']],
  matrix:['Perform matrix mathematics','NumPy','Dense arrays, broadcasting, vectorized arithmetic, and linear algebra are its home.','SciPy + scikit-learn','Learn shape, dtype, slicing, and broadcasting.',['numbers','ndarray','vector result']],
  distribution:['Visualize distributions','Seaborn','Histograms, boxes, violins, and DataFrame-friendly statistical plots are concise.','Pandas + Matplotlib','Compare distributions across target groups.',['DataFrame','statistical plot','pattern']],
  charts:['Build custom static charts','Matplotlib','Precise control over figures, axes, labels, annotations, and subplots.','NumPy + Seaborn','Learn the figure / axes API.',['data','axes','static chart']],
  interactive:['Make interactive charts','Plotly','Hover, zoom, selection, and browser rendering support exploration and communication.','Pandas + Streamlit','Build a Plotly Express chart, then customize it.',['DataFrame','interactive figure','browser']],
  regression:['Predict a number','Scikit-learn regression','Estimators, preprocessing, splits, pipelines, and metrics support the full workflow.','Pandas + Seaborn + XGBoost','Start with a mean baseline, then a linear model.',['labeled rows','fit regressor','number']],
  classify:['Classify something','Scikit-learn classification','It combines classifiers with precision, recall, F1, and ROC-AUC evaluation.','Pandas + XGBoost','Define false-positive and false-negative costs first.',['labeled rows','fit classifier','class']],
  cluster:['Cluster customers','Scikit-learn clustering','K-Means, hierarchical clustering, DBSCAN, scaling, and metrics live together.','Pandas + Seaborn','Scale features and test whether groups are actionable.',['unlabeled rows','similarity','groups']],
  deep:['Create a deep-learning model','PyTorch or TensorFlow / Keras','Both provide automatic differentiation, neural layers, optimizers, and acceleration.','NumPy + MLflow','Choose PyTorch for custom work or Keras for a high-level start.',['tensors','neural network','prediction']],
  images:['Process images','OpenCV + Pillow','Pillow handles files; OpenCV adds rich image/video processing; torchvision supports PyTorch.','torchvision + PyTorch','Separate image preparation from inference.',['image','pixels / transforms','vision model']],
  text:['Process text','spaCy','Production-friendly tokenization, linguistic components, and efficient pipelines.','NLTK + Hugging Face','Use classic NLP for structure, transformers for context.',['text','tokens + entities','structured language']],
  llm:['Use pretrained LLMs','Hugging Face Transformers','Standard model, tokenizer, dataset, and inference workflows across many pretrained models.','PyTorch + sentence-transformers','Load a task pipeline, then learn tokenization and limits.',['text','tokenizer + model','generation']],
  track:['Track ML experiments','MLflow','Records parameters, metrics, artifacts, runs, and lineage so results are reproducible.','Optuna + model registry','Log one baseline before tuning.',['training run','evidence + artifacts','registry']],
  api:['Create an ML API','FastAPI + Pydantic','FastAPI serves typed endpoints; Pydantic validates the feature contract.','Uvicorn + Docker','Wrap a saved pipeline behind /predict.',['JSON request','validated model','JSON response']],
  ui:['Quickly make an ML UI','Streamlit or Gradio','Streamlit suits data apps; Gradio quickly demos model inputs and outputs.','Plotly + Pandas','Expose inputs, output, and uncertainty.',['Python function','widgets','usable demo']]
};

const algorithmInfo = {
  regression:['What number are we trying to predict?','Targets are continuous: price, salary, sales, demand, or temperature. Start with a mean baseline.','Like drawing the most useful trend through noisy points.',['Linear Regression','Polynomial Regression','Decision Tree Regressor','Random Forest Regressor','Gradient Boosting','XGBoost']],
  classification:['Which category does this belong to?','Targets are labels: spam / not spam, fraud / normal, risk / no risk. A probability threshold creates the decision.','Like a sorting desk routing each package to a labeled bin.',['Logistic Regression','KNN','Decision Tree','Random Forest','Naive Bayes','SVM','Gradient Boosting','XGBoost']],
  clustering:['Which examples naturally belong together?','There is no answer column. Similarity and density reveal candidate groups; groups matter only when people can act on them.','Like grouping mixed buttons without being given names.',['K-Means','Hierarchical Clustering','DBSCAN']]
};

const roadmap = [
  ['Python','express data workflows','Load values, transform collections, package functions, and isolate dependencies.','Build a file-processing script.'],
  ['NumPy','think in arrays','Understand shape, vectorization, broadcasting, and numerical aggregation.','Implement vectorized statistics.'],
  ['Pandas','work with real tables','Inspect, clean, join, reshape, and aggregate labeled data.','Clean and profile a public CSV.'],
  ['Matplotlib + Seaborn','see patterns','Choose charts that reveal distributions and relationships.','Create an EDA story with five charts.'],
  ['Statistics + EDA','question evidence','Recognize sampling, skew, imbalance, correlation limits, and leakage.','Write an EDA findings memo.'],
  ['Feature engineering','represent reality','Encode, scale, select, and build leakage-safe transformations.','Create a ColumnTransformer.'],
  ['Scikit-learn','train repeatably','Use splits, fit, transform, predict, Pipeline, and metrics.','Train a baseline pipeline.'],
  ['ML algorithms','match model to task','Understand regression, classification, clustering, trees, and linear baselines.','Compare three model families.'],
  ['Model evaluation','measure business mistakes','Choose metrics from error cost and validate generalization.','Create a cross-validation report.'],
  ['Advanced ML','improve structured models','Tune ensembles without contaminating the test set.','Tune a booster with Optuna.'],
  ['Deep learning','learn representations','Understand tensors, forward pass, loss, backprop, batches, and optimizers.','Train a small neural network.'],
  ['Transformers / GenAI','use contextual models','Understand tokens, embeddings, context, RAG, and fine-tuning boundaries.','Build a cited retrieval prototype.'],
  ['MLOps / deployment','deliver reliably','Track, package, serve, validate, monitor, and retrain a model.','Serve a tracked pipeline with FastAPI.']
];

const cheatTools = [
  ['NumPy','Numerical arrays, broadcasting, and linear algebra'],['Pandas','Labeled tabular manipulation and analysis'],['Polars','Parallel, columnar eager or lazy DataFrames'],['SciPy','Optimization, signal, sparse, and scientific algorithms'],
  ['Statsmodels','Statistical inference, coefficients, and tests'],['Matplotlib','Foundational static plotting'],['Seaborn','Statistical visualization for EDA'],['Plotly','Interactive browser charts'],
  ['Scikit-learn','Traditional ML, pipelines, and evaluation'],['XGBoost','Regularized gradient-boosted trees'],['LightGBM','Fast scalable boosted trees'],['CatBoost','Boosting with categorical strengths'],
  ['PyTorch','Flexible deep learning and modern AI'],['TensorFlow / Keras','High-level deep-learning ecosystem'],['Transformers','Pretrained models and tokenizers'],['OpenCV','Computer vision and image/video processing'],
  ['spaCy','Production linguistic NLP'],['NLTK','Classic NLP and education'],['Jupyter','Narrated interactive experiments'],['MLflow','Experiment, artifact, and model tracking'],
  ['Optuna','Hyperparameter optimization'],['FastAPI','Typed model-serving APIs'],['Streamlit','Rapid Python data apps'],['Gradio','Rapid interactive ML demos'],
  ['Pydantic','Typed input/output schemas'],['DuckDB','In-process analytical SQL'],['Dask','Partitioned Python data workloads'],['imbalanced-learn','Resampling imbalanced targets']
];

function renderCollections(){
  document.getElementById('foundation-grid').innerHTML=foundations.map(function(x){return '<article><strong>'+x[0]+'</strong><code>'+x[1]+'</code><p>'+x[2]+'</p></article>';}).join('');
  document.getElementById('taxonomy').innerHTML=taxonomy.map(function(x){return '<article><strong>'+x[0]+'</strong><span>'+x[1]+'</span></article>';}).join('');
  const questions=['What columns exist?','Missing values?','Duplicates?','Distribution?','Outliers?','Correlation?','Class balance?','Ready for ML?'];
  document.getElementById('eda-timeline').innerHTML=questions.map(function(x,i){return '<span>'+x+'</span>'+(i<questions.length-1?'<i>→</i>':'');}).join('');
  document.getElementById('cheat-grid').innerHTML=cheatTools.map(function(x){return '<article data-tool="'+(x[0]+' '+x[1]).toLowerCase()+'"><strong>'+x[0]+'</strong><span>'+x[1]+'</span></article>';}).join('');
}

function renderJourney(){
  const track=document.getElementById('journey-track');
  journeyStages.forEach(function(stage,index){
    const button=document.createElement('button');
    button.type='button';button.className='journey-step'+(index===0?' active':'');button.setAttribute('role','listitem');
    button.innerHTML='<strong>'+stage[0]+'</strong><small>'+stage[1]+'</small>';
    button.addEventListener('click',function(){
      track.querySelectorAll('button').forEach(function(x){x.classList.remove('active');});
      button.classList.add('active');
      document.getElementById('journey-explanation').innerHTML='<strong>'+stage[0]+'</strong> '+stage[2];
    });
    track.append(button);
    if(index<journeyStages.length-1){const arrow=document.createElement('span');arrow.className='journey-arrow';arrow.textContent='→';arrow.setAttribute('aria-hidden','true');track.append(arrow);}
  });
}

function regressionVisual(){
  const p=[[9,75],[17,65],[27,70],[35,52],[45,49],[56,35],[66,40],[76,22],[87,17]];
  return '<div class="regression-plot" aria-label="Points and regression line">'+p.map(function(x){return '<i style="left:'+x[0]+'%;top:'+x[1]+'%"></i>';}).join('')+'</div>';
}
function classificationVisual(){return '<div class="classify-visual"><div class="classify-row"><span>Email: “You won…”</span><i>→</i><strong>Spam · 94%</strong></div><div class="classify-row"><span>Transaction: $8,900 abroad</span><i>→</i><strong>Fraud review · 87%</strong></div><div class="classify-row"><span>Patient features</span><i>→</i><strong>High risk · 72%</strong></div></div>';}
function clusteringVisual(){
  const p=[[14,24,'c1'],[19,35,'c1'],[26,19,'c1'],[31,31,'c1'],[57,19,'c2'],[64,28,'c2'],[70,14,'c2'],[76,26,'c2'],[47,69,'c3'],[57,78,'c3'],[66,68,'c3'],[72,82,'c3']];
  return '<div class="cluster-plot" aria-label="Three clusters">'+p.map(function(x){return '<i class="'+x[2]+'" style="left:'+x[0]+'%;top:'+x[1]+'%"></i>';}).join('')+'</div>';
}
function renderAlgorithm(name){
  const x=algorithmInfo[name];const visual=name==='regression'?regressionVisual():name==='classification'?classificationVisual():clusteringVisual();
  document.getElementById('algorithm-panel').innerHTML='<div class="algorithm-content"><article class="algorithm-story"><p class="mini-label">The defining question</p><div class="question">'+x[0]+'</div><p>'+x[1]+'</p><p><strong>Analogy:</strong> '+x[2]+'</p><div class="algorithm-tags">'+x[3].map(function(t){return '<span>'+t+'</span>';}).join('')+'</div></article><div class="algorithm-visual">'+visual+'</div></div>';
}
function setupTabs(){
  const tabs=Array.from(document.querySelectorAll('[role="tab"]'));
  function choose(selected){tabs.forEach(function(tab){const on=tab===selected;tab.setAttribute('aria-selected',String(on));tab.tabIndex=on?0:-1;});renderAlgorithm(selected.dataset.algorithm);}
  tabs.forEach(function(tab,index){
    tab.addEventListener('click',function(){choose(tab);});
    tab.addEventListener('keydown',function(event){if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;event.preventDefault();const next=event.key==='ArrowRight'?(index+1)%tabs.length:(index-1+tabs.length)%tabs.length;choose(tabs[next]);tabs[next].focus();});
  });
  renderAlgorithm('regression');
}

function renderMetric(type){
  const title=document.getElementById('metric-title'),copy=document.getElementById('metric-copy'),visual=document.getElementById('metric-visual');
  if(type==='fraud'){title.textContent='Fraud screening: protect recall';copy.textContent='A false negative lets fraud pass. High recall catches more actual fraud, even if investigators review false alarms.';visual.innerHTML='<div class="confusion"><span></span><span>Predicted fraud</span><span>Predicted normal</span><span>Actual fraud</span><strong class="good-cell">TP<br><small>caught</small></strong><strong class="costly-cell">FN<br><small>escaped</small></strong><span>Actual normal</span><strong>FP<br><small>review</small></strong><strong class="good-cell">TN<br><small>cleared</small></strong></div>';}
  else if(type==='spam'){title.textContent='Spam filtering: protect precision';copy.textContent='A false positive hides legitimate mail. High precision means messages sent to spam are very likely spam.';visual.innerHTML='<div class="confusion"><span></span><span>Predicted spam</span><span>Predicted inbox</span><span>Actual spam</span><strong class="good-cell">TP<br><small>blocked</small></strong><strong>FN<br><small>annoyance</small></strong><span>Actual inbox</span><strong class="costly-cell">FP<br><small>lost email</small></strong><strong class="good-cell">TN<br><small>delivered</small></strong></div>';}
  else{title.textContent='House prices: measure the size of the miss';copy.textContent='MAE says the typical dollar miss. RMSE makes large errors hurt more. R² compares against predicting the mean.';visual.innerHTML='<div class="regression-metrics"><div><strong>$18k</strong><span>MAE · typical miss</span></div><div><strong>$31k</strong><span>RMSE · large misses</span></div><div><strong>0.82</strong><span>R² · variance explained</span></div></div>';}
}
function setupMetrics(){
  const buttons=document.querySelectorAll('[data-metric]');
  buttons.forEach(function(button){button.addEventListener('click',function(){buttons.forEach(function(x){const on=x===button;x.classList.toggle('active',on);x.setAttribute('aria-pressed',String(on));});renderMetric(button.dataset.metric);});});
  renderMetric('fraud');
}

function updateRecommendation(key){
  const x=goals[key];
  document.getElementById('tool-recommendation').innerHTML='<p class="mini-label">Recommended tool</p><div class="rec-tool"><strong>'+x[1]+'</strong><span>for “'+x[0].toLowerCase()+'”</span></div><div class="rec-grid"><div><b>Why</b><span>'+x[2]+'</span></div><div><b>Usually with</b><span>'+x[3]+'</span></div><div><b>Next step</b><span>'+x[4]+'</span></div></div>';
  document.getElementById('goal-path').innerHTML=x[5].map(function(step,index){return '<span>'+(index+1)+'. '+step+'</span>';}).join('');
}
function setupSelector(){
  const select=document.getElementById('tool-goal'),quick=document.getElementById('quick-decisions');
  Object.keys(goals).forEach(function(key){const option=new Option(goals[key][0],key);select.add(option);const button=document.createElement('button');button.type='button';button.textContent=goals[key][0];button.addEventListener('click',function(){select.value=key;updateRecommendation(key);});quick.append(button);});
  select.addEventListener('change',function(){updateRecommendation(select.value);});updateRecommendation(select.value);
}

function renderRoadmap(index){
  const x=roadmap[index];
  document.getElementById('roadmap-detail').innerHTML='<span class="level-number">LEVEL '+String(index+1).padStart(2,'0')+' / '+roadmap.length+'</span><h3>'+x[0]+'</h3><p>'+x[2]+'</p><div><strong>Capability unlocked</strong><span>'+x[1]+'</span></div><div><strong>Proof project</strong><span>'+x[3]+'</span></div>';
}
function setupRoadmap(){
  const list=document.getElementById('roadmap-list');
  roadmap.forEach(function(x,index){const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.className=index===0?'active':'';button.innerHTML='<b>'+String(index+1).padStart(2,'0')+'</b><strong>'+x[0]+'</strong><span>'+x[1]+'</span>';button.addEventListener('click',function(){list.querySelectorAll('button').forEach(function(b){b.classList.remove('active');});button.classList.add('active');renderRoadmap(index);});li.append(button);list.append(li);});renderRoadmap(0);
}

function setupNavigation(){
  const sidebar=document.getElementById('sidebar'),menu=document.getElementById('menu-button'),links=Array.from(document.querySelectorAll('#section-nav a')),sections=Array.from(document.querySelectorAll('.observed'));
  menu.addEventListener('click',function(){const open=sidebar.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
  links.forEach(function(link){link.addEventListener('click',function(){sidebar.classList.remove('open');menu.setAttribute('aria-expanded','false');});});
  const observer=new IntersectionObserver(function(entries){const visible=entries.filter(function(x){return x.isIntersecting;}).sort(function(a,b){return b.intersectionRatio-a.intersectionRatio;})[0];if(!visible)return;links.forEach(function(link){link.classList.toggle('active',link.hash==='#'+visible.target.id);});},{rootMargin:'-20% 0px -65% 0px',threshold:[0,.1,.4]});
  sections.forEach(function(section){observer.observe(section);});
  function progress(){const total=document.documentElement.scrollHeight-window.innerHeight;const value=total>0?Math.min(100,Math.round(window.scrollY/total*100)):0;document.getElementById('progress-bar').style.width=value+'%';document.getElementById('progress-value').textContent=value+'%';}
  window.addEventListener('scroll',progress,{passive:true});progress();
}
function setupSearch(){
  const input=document.getElementById('site-search'),sections=Array.from(document.querySelectorAll('main>section')),noResults=document.getElementById('no-results');
  input.addEventListener('input',function(){const query=input.value.trim().toLowerCase();let matches=0;sections.forEach(function(section){const text=((section.dataset.search||'')+' '+section.textContent).toLowerCase();const match=!query||text.includes(query);section.classList.toggle('search-hidden',!match);if(match)matches++;});noResults.hidden=matches>0;});
}

renderJourney();renderCollections();setupTabs();setupMetrics();setupSelector();setupRoadmap();setupNavigation();setupSearch();
