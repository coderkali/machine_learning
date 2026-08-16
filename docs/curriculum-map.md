# Curriculum Map

This file maps every instructor module to the dependency-based repository
roadmap. It tracks this bootcamp only. Older work may show useful experience,
but it does not make an instructor module complete.

## Source record

| Item | Value |
|---|---|
| Source | Instructor PDF: *Ultimate AI Mastery LIVE BootCamp* |
| Total pages | 72 |
| Detailed curriculum | Pages 3-68 |
| SHA-256 | `900ebf57ea67c79bd5722f3a281a4a720c5e23ef0f58242e0f5c3480ab36d3f3` |
| Module count | 41 |

Module IDs follow the order of the **detailed syllabus**. The early module
summary lists No-Code AI before System Design, but the detailed syllabus teaches
System Design first. Therefore `M39` is System Design and `M40` is No-Code AI.

## Status rules

- ⬜ **Not Started** — no current-bootcamp completion evidence.
- 🟡 **Learning** — current-bootcamp work is in progress.
- 🟢 **Completed** — the module work and checkpoint are finished.
- 🔁 **Review Needed** — completed work needs fresh practice.

`M01`, `M02`, and `M03` are currently learning. Every other module remains not started.
Entries marked **Prior only** are links to `Foundations_Archive/`; they do not
change bootcamp status.

## All instructor modules

| ID | Instructor module | PDF pages | Dependency phase | Main PDF coverage | Bootcamp status | Repository evidence or planned path |
|---|---|---:|---|---|---|---|
| M01 | Python | 3-5 | 01 — Engineering and Python foundation | Syntax, collections, control flow, functions, arrays, OOP, files, exceptions, packages, environments | 🟡 Learning | Current: [Session 01 notebook and cell-by-cell guide](../AI_ML_Series/01_engineering_python/01_python/session_01_variables_data_types_numbers_strings/README.md), covering variables, data types, numbers, strings, input, conversion, and formatted output. This is partial M01 evidence, not module completion. |
| M02 | Data Visualization with Python | 5-6 | 02 — Python data toolkit, visualization, and rapid apps | Matplotlib, Seaborn, Plotly, static and interactive charts | 🟡 Learning | Current: [Matplotlib example notebook](../AI_ML_Series/02_data_toolkit_apps/03_matplotlib/example_01.ipynb), documented in its own Markdown cells, covering line, scatter, bar, histogram, pie, fill, annotation, subplots, and `savefig`; and [Seaborn example notebook](../AI_ML_Series/02_data_toolkit_apps/04_seaborn/example_01.ipynb) with [topic README](../AI_ML_Series/02_data_toolkit_apps/04_seaborn/README.md), covering relational, distribution, categorical, regression, grid, and styling plots against seaborn 0.13.2. Plotly not started. Prior only: [Matplotlib](../Foundations_Archive/Matplotlib/example_01.py), [pizza plotting](../Foundations_Archive/irisData_Exploration/matplotlib/pizza_matplotlib_2.ipynb), and [Seaborn](../Foundations_Archive/irisData_Exploration/seaborn/pizza_seaborn.ipynb) |
| M03 | Python for Data Science (NumPy & Pandas) | 6-8 | 02 — Python data toolkit, visualization, and rapid apps | NumPy arrays, operations and linear algebra; Pandas I/O, cleaning, selection, transformation, grouping, joins, pivots, dates, and strings | 🟡 Learning | Current: [NumPy example](../AI_ML_Series/02_data_toolkit_apps/01_numpy/example_01.ipynb), [partial API-health project](../AI_ML_Series/02_data_toolkit_apps/01_numpy/project_01_api_health.ipynb), and [Pandas example](../AI_ML_Series/02_data_toolkit_apps/02_pandas/example_01.ipynb). The project has only Parts 1-2 of 12. Prior only: [NumPy](../Foundations_Archive/NumPy/example_02.py), [Pandas](../Foundations_Archive/Pandas/example_01.py), [pizza NumPy](../Foundations_Archive/irisData_Exploration/numpy/pizza_numpy.ipynb), and [pizza Pandas](../Foundations_Archive/irisData_Exploration/panda/pizza_panda.ipynb) |
| M04 | Streamlit | 8-9 | 02 — Python data toolkit, visualization, and rapid apps | UI elements, charts, inputs, media, chat, containers, state, multipage apps, GitHub deployment, secrets | ⬜ Not Started | No current-course M04 evidence yet |
| M05 | Statistics and Probability | 9-10 | 03 — Math and relational-data foundations | Descriptive statistics, probability, distributions, inference, tests, correlation, information theory | ⬜ Not Started | Prior only: [statistics notes](../Foundations_Archive/math_for_ml/phase_2_statistics/) and [hypothesis-testing notebooks](../Foundations_Archive/DataScience_Y/) |
| M06 | Linear Algebra | 10-11 | 03 — Math and relational-data foundations | Scalars, vectors, matrices, norms, similarity, eigenvalues, PCA, LU, QR, SVD | ⬜ Not Started | Prior only: [linear-algebra archive](../Foundations_Archive/math_for_ml/phase_3_linear_algebra/) |
| M07 | Machine Learning | 11-14 | 05 — Classical modeling and forecasting | Data loading, EDA, preprocessing, validation, feature work, regression, classification, clustering, ensembles, evaluation, tuning, saving, deployment | ⬜ Not Started | Prior only: [ML archive](../Foundations_Archive/ML/) and [classical-ML archive](../Foundations_Archive/phase_3_classical_ml/) |
| M08 | Time Series | 14-15 | 05 — Classical modeling and forecasting | Datetime data, resampling, stationarity, ACF/PACF, ADF, smoothing, AR/MA/ARMA/ARIMA/SARIMAX, Auto-ARIMA | ⬜ Not Started | No current-course M08 evidence yet |
| M09 | Reinforcement Learning | 15-16 | 06 — Neural networks and AI modalities | Agent/environment loop, MDP, Bellman equation, RL types, Q-learning, DQN | ⬜ Not Started | No current-course M09 evidence yet |
| M10 | Deep Learning | 16-18 | 06 — Neural networks and AI modalities | Neural-network basics, loss and backpropagation, optimizers, ANN, CNN, RNN, LSTM, GRU, autoencoders, VAE, GAN, saving and deployment | ⬜ Not Started | No current-course M10 evidence yet |
| M11 | Natural Language Processing | 18-19 | 06 — Neural networks and AI modalities | Text cleanup and tokenization, stemming, lemmatization, linguistic analysis, n-grams, similarity, BoW, TF-IDF, embeddings, topic models, evaluation, deployment | ⬜ Not Started | No current-course M11 evidence yet |
| M12 | Computer Vision | 20-21 | 06 — Neural networks and AI modalities | OpenCV image work, transformations, filtering, features, segmentation, Haar, CNN/transfer learning, YOLO, MediaPipe, augmentation, evaluation, deployment | ⬜ Not Started | No current-course M12 evidence yet |
| M13 | LangChain | 21-23 | 08 — Retrieval and LLM application stack | Models, prompts, parsers, chains, memory, loaders, splitters, embeddings, vector stores, retrievers, RAG, agents, tools, LCEL | ⬜ Not Started | No current-course M13 evidence yet |
| M14 | Transformers | 23-24 | 07 — Transformer and prompting foundations | Transformer history, encoder/decoder forms, Q/K/V attention, self-attention, multi-head attention, NanoGPT-style build | ⬜ Not Started | No current-course M14 evidence yet |
| M15 | VectorDB | 24-26 | 08 — Retrieval and LLM application stack | Embeddings and similarity, RDBMS comparison, Chroma, FAISS, Pinecone, LlamaIndex, RAG strategies, reranking and evaluation | ⬜ Not Started | No current-course M15 evidence yet |
| M16 | Prompt Engineering | 26-29 | 07 — Transformer and prompting foundations | Prompt anatomy, roles, zero/one/few-shot, personas, constraints, output control, reasoning methods, chaining, templates, task prompts and evaluation | ⬜ Not Started | No current-course M16 evidence yet |
| M17 | Excel | 29-30 | 04 — Analytics and business intelligence | Data entry and formatting, arithmetic, functions, lookups, sorting, filtering, pivots, slicers, charts | ⬜ Not Started | No current-course M17 evidence yet |
| M18 | Agentic AI | 30-32 | 09 — Agents, fine-tuning, and visual AI builders | Agent types and components, planning, tools, prompting, memory, RAG, file/code agents, multi-agent systems, CrewAI, LangGraph, AutoGen, MCP | ⬜ Not Started | No current-course M18 evidence yet |
| M19 | MySQL | 32-34 | 03 — Math and relational-data foundations | Workbench, types, users, functions, search, indexes, transactions, views, procedures, triggers, optimization, Python connection | ⬜ Not Started | No current-course M19 evidence yet |
| M20 | PostgreSQL | 34-35 | 03 — Math and relational-data foundations | pgAdmin, rich types, schemas, roles, functions, JSON, indexes, transactions, views, PL/pgSQL, triggers, optimization, Python connection | ⬜ Not Started | No current-course M20 evidence yet |
| M21 | Power BI | 35-40 | 04 — Analytics and business intelligence | Data connections and export, Power Query, relationships, DAX, contexts, visualizations, report design, interaction and filters | ⬜ Not Started | No current-course M21 evidence yet |
| M22 | Tableau | 40-45 | 04 — Analytics and business intelligence | Data preparation and combination, field roles, sets/groups/bins/parameters, calculations, LOD, filters, charts, dashboards, actions, stories, publishing | ⬜ Not Started | No current-course M22 evidence yet |
| M23 | Google Looker Studio | 45-47 | 04 — Analytics and business intelligence | Sources/connectors, blending, dimensions and metrics, calculated fields, filters, charts, report design, export and sharing | ⬜ Not Started | No current-course M23 evidence yet |
| M24 | Git and GitHub | 47-48 | 01 — Engineering and Python foundation | Core Git workflow, branches, conflicts, stash, reset, rebase, tags, reflog, Git internals, GitHub features, Actions and CI/CD | ⬜ Not Started | This repository uses Git, but no current-course M24 checkpoint evidence exists yet |
| M25 | MongoDB | 48-49 | 11 — Data-platform engineering | Document model, CRUD, query operators, sorting, pagination, indexes, aggregation and data modeling | ⬜ Not Started | No current-course M25 evidence yet |
| M26 | Cassandra | 49-50 | 11 — Data-platform engineering | Architecture, CAP and consistency, CQL, keys, indexes, collections, TTL, query-driven modeling, replication, compaction, Python driver | ⬜ Not Started | No current-course M26 evidence yet |
| M27 | MLOps | 50-51 | 10 — Containers and ML operations | Lifecycle, environments, Git/DVC, model persistence and serving, Docker, MLflow tracking and registry, drift monitoring | ⬜ Not Started | Prior only: [employee-attrition pipeline](../Foundations_Archive/ML/project/); it is data-workflow evidence, not MLOps completion |
| M28 | LLMOps | 51-52 | 12 — Cloud and LLM operations | Model selection, prompt management, fine-tuning, evaluation, RAGAS, tracing and monitoring, deployment, cloud services | ⬜ Not Started | No current-course M28 evidence yet |
| M29 | Fine-Tuning LLMs | 52-54 | 09 — Agents, fine-tuning, and visual AI builders | Fine-tuning choices, datasets, PEFT/LoRA/QLoRA, Hugging Face stack, SFTTrainer, models, quantization, evaluation, RLHF/DPO and deployment | ⬜ Not Started | No current-course M29 evidence yet |
| M30 | Docker | 54-55 | 10 — Containers and ML operations | Images, containers, Dockerfiles, volumes, registry, Compose and containerized web/ML/LLM apps | ⬜ Not Started | No current-course M30 evidence yet |
| M31 | Azure | 55-57 | 12 — Cloud and LLM operations | Identity, RBAC, Key Vault, storage/data lake, Data Factory pipelines and transformations, Synapse | ⬜ Not Started | No current-course M31 evidence yet |
| M32 | AWS | 57-58 | 12 — Cloud and LLM operations | IAM, storage, compute, network, databases, analytics, AI/ML services, DevOps, monitoring and application deployment | ⬜ Not Started | No current-course M32 evidence yet |
| M33 | GCP | 58-59 | 12 — Cloud and LLM operations | IAM, storage, compute, network, databases, analytics, AI/ML APIs, CI/CD, monitoring and deployment | ⬜ Not Started | No current-course M33 evidence yet |
| M34 | Apache Spark with Databricks (PySpark) | 60 | 11 — Data-platform engineering | Spark architecture and clusters, ingestion, transformations, joins/windows/UDFs, ML preprocessing, Spark SQL and Delta writes | ⬜ Not Started | No current-course M34 evidence yet |
| M35 | Data Warehouse with Snowflake | 61 | 11 — Data-platform engineering | Warehouse concepts and schemas, Snowflake architecture and objects, stages, `COPY INTO`, Snowpipe, Time Travel, streams, tasks and RBAC | ⬜ Not Started | No current-course M35 evidence yet |
| M36 | Apache Airflow | 61-62 | 11 — Data-platform engineering | Architecture, local/Docker setup, UI, DAGs, tasks and dependencies, operators, sensors, executors, schedules, hooks and Azure integration | ⬜ Not Started | No current-course M36 evidence yet |
| M37 | Apache Kafka | 62-64 | 11 — Data-platform engineering | Architecture, topics and partitions, replication and retention, CLI/Docker, Python producers/consumers, offsets, serialization, Connect, security and pipeline integration | ⬜ Not Started | No current-course M37 evidence yet |
| M38 | dbt (Data Build Tool) | 64-65 | 11 — Data-platform engineering | Project structure, models and materializations, refs/sources, seeds, tests, docs, snapshots, macros/Jinja, commands, incremental models and integrations | ⬜ Not Started | No current-course M38 evidence yet |
| M39 | System Design for AI Systems | 66-67 | 13 — AI system design and career proof | Scale, reliability, latency, consistency, building blocks, microservices, data/ML/LLM/RAG/vector architecture, security and cost | ⬜ Not Started | Prior only: [one pipeline architecture](../Foundations_Archive/ML/project/ARCHITECTURE.md); it is not full AI-system-design evidence |
| M40 | No-Code AI Tools | 67-68 | 09 — Agents, fine-tuning, and visual AI builders | Bubble, Zapier, Make, n8n, Flowise, Langflow, Notion AI, AppSheet and visual agent builders | ⬜ Not Started | No current-course M40 evidence yet |
| M41 | Job Ready Focus | 68 | 13 — AI system design and career proof | Role mapping, ATS resume, portfolio, LinkedIn, job-search workflow and interview preparation | ⬜ Not Started | No current-course M41 evidence yet |

## Coverage notes

- Page ranges overlap when one module ends and the next begins on the same PDF
  page.
- Pages 19-20 skip no curriculum: NLP ends on page 19 and Computer Vision starts
  on page 20.
- Page 60 contains Spark/Databricks only. Page 61 contains Snowflake and the
  beginning of Airflow.
- The PDF names tools and activities, but it does not give module hours,
  required project names, datasets, rubrics, or completion tests.
