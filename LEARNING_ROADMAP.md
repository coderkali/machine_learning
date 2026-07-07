# Learning Roadmap — Python to Agentic AI

This is the full course map: every phase, every topic inside it, current status,
and how much math depth each phase actually requires. This file exists so
nothing gets forgotten between sessions — it's the syllabus, not the notes
themselves (detailed worked notes live in `math_for_ml/phase_5_linear_regression/`
and future phase folders).

**Target role:** Agentic AI Engineer — building and orchestrating multi-step,
tool-using AI systems on top of existing LLMs, not training or researching
models from scratch.

**Status legend:** ✅ Done · 🟡 In Progress / Current · ⬜ Not Started

---

## Math depth calibration (read this first)

Math requirement depends on how close a task is to an actual model training
loop, not on the topic name:

```
Training a model from scratch      → Heavy math (calculus, gradients)
Fine-tuning a model (LoRA/QLoRA)    → Moderate math (understand what's adjusted)
Using a pre-trained model via API   → Light math (concepts, not equations)
Orchestrating models (Agentic AI)   → Minimal math (mostly software engineering)
```

Agentic AI Engineering sits at the bottom of this ladder. The math-heavy work
(Phases 1-2 below) is foundational and worth finishing, but depth needed drops
sharply from Phase 3 onward.

---

## Phase 1 — Python Foundations ✅ Done

| Topic | Status |
|---|---|
| Pandas — dataframes, cleaning, merging | ✅ |
| Numpy — arrays, vectorized math | ✅ |
| Matplotlib / Seaborn — visualization | ✅ |

---

## Phase 2 — Math for ML 🟡 Almost Done

| Topic | Status |
|---|---|
| Linear algebra — vectors, dot products | ✅ |
| Statistics & probability basics | ✅ |
| Calculus — derivatives from first principles (limit definition) | ✅ |
| Linear regression — clean data, direct slope formula | ✅ |
| Linear regression — messy data, manual gradient descent | ✅ |
| Deriving the exact best-w formula (setting derivative = 0) | ✅ |
| Derivative with respect to b (intercept) | ✅ |
| Connecting formal calculus (limits) to the ML cost derivative | ✅ |
| Meera's electricity bill — full gradient descent + 3.5hr prediction | ⬜ (final Phase 5 task, still open) |

**Math depth:** Heavy — this is the one phase worth doing by hand in full,
since backpropagation later is this exact same chain-rule mechanism, just
applied across many layers instead of one w and one b.

**Detailed notes location:** `math_for_ml/phase_5_linear_regression/practice_exercises/`

---

## Phase 3 — Classical Data Science 🟡 Current Focus

| Topic | Status |
|---|---|
| Data collection — sources & sampling | ⬜ |
| Data analysis & visualization | ⬜ |
| Data preprocessing — missing values, imbalanced data (SMOTE), outliers | ⬜ |
| Data encoding — nominal (OHE), label, ordinal, target-guided | ⬜ |
| Regression — predicting continuous values | ⬜ |
| Classification — predicting categories | ⬜ |
| Model training & validation | ⬜ |
| Model optimization — tuning performance | ⬜ |
| Unsupervised learning — clustering, patterns | ⬜ |

**Math depth:** Light-to-moderate — mostly statistics (distributions,
correlation), not calculus. You're tuning/using models here, not deriving
them from scratch.

**Why still worth doing:** Even though not strictly required for Agentic AI
Engineering, this builds the vocabulary (training, validation, loss,
overfitting) that every later phase reuses without re-explaining.

---

## Phase 4 — Neural Networks & NLP Fundamentals ⬜ Not Started

| Topic | Status |
|---|---|
| Text to numbers — tokenization, embeddings | ⬜ |
| Forward propagation — making predictions | ⬜ |
| Backward propagation — same gradient math as Phase 2, more layers | ⬜ |
| Activation functions — ReLU, sigmoid, tanh, softmax | ⬜ |
| Loss functions — MSE, cross-entropy | ⬜ |
| Optimizers — SGD, Adam, RMSProp | ⬜ |

**Math depth:** Moderate — this is where Phase 2's derivative work pays off
directly. Backprop is literally the chain rule applied repeatedly across
layers. New activation functions are just new formulas to plug into
machinery you already understand.

---

## Phase 5 — Advanced NLP & Transformers ⬜ Not Started

| Topic | Status |
|---|---|
| RNN — sequence modeling basics | ⬜ |
| LSTM & GRU — solving vanishing gradients | ⬜ |
| Bidirectional LSTMs | ⬜ |
| Encoder-Decoder architecture, Seq2Seq | ⬜ |
| Attention ("Attention Is All You Need") | ⬜ |
| Transformer architecture — foundation of GPT, BERT, T5 | ⬜ |

**Math depth:** Conceptual/intuitive — understanding *why* attention solves
long-range memory problems is a mechanism story, not a derivation exercise.
Most engineers who use transformers daily understand the mechanism, not the
full proof.

---

## Phase 6 — Generative AI & LLMs ⬜ Not Started

| Topic | Status |
|---|---|
| How GPT-4, Mistral 7B, LLaMA, and other LLMs work | ⬜ |
| LangChain — chains, agents, LCEL, prompt templating, memory | ⬜ |
| LangSmith — tracing | ⬜ |
| LangServe — deployment | ⬜ |
| Hugging Face — models & pipelines for open-source inference | ⬜ |
| Google Gemini — building Gen AI projects | ⬜ |
| Fine-tuning — LoRA, QLoRA, PEFT | ⬜ |

**Math depth:** Light — mostly using pre-trained models through libraries.
Fine-tuning (LoRA/QLoRA) touches math lightly (understanding what's being
adjusted), but doesn't require deriving anything.

---

## Phase 7 — Vector Databases & RAG ⬜ Not Started

| Topic | Status |
|---|---|
| Embeddings — how they're stored & searched for similarity | ⬜ |
| ChromaDB — lightweight local vector storage | ⬜ |
| FAISS — high-performance similarity search | ⬜ |
| LanceDB — Lance columnar format | ⬜ |
| Apache Cassandra — distributed vector storage | ⬜ |
| Full RAG pipeline — ingestion, chunking, embedding, retrieval, reranking, generation | ⬜ |
| Hybrid search, Adaptive RAG, C-RAG, Self-RAG, multimodal RAG | ⬜ |

**Math depth:** Minimal — cosine similarity / dot products (arithmetic),
not calculus. This is primarily a data engineering problem.

---

## Phase 8 — Agentic AI ⬜ Not Started — **Target Role**

| Topic | Status |
|---|---|
| Agents vs traditional AI pipelines | ⬜ |
| LangGraph — graphs, routers, state management, memory, streaming, human-in-the-loop | ⬜ |
| CrewAI — role-based multi-agent orchestration | ⬜ |
| MCP (Model Context Protocol) — connecting agents to tools, APIs, data | ⬜ |

**Math depth:** Minimal to none — pure software engineering: state machines,
routing logic, API orchestration. This is where 12 years of Java/Spring Boot
experience becomes directly more relevant than any additional math.

---

## Phase 9 — MLOps, Cloud & CI/CD ⬜ Not Started

| Topic | Status |
|---|---|
| AWS — EC2, Lambda, Bedrock, SageMaker | ⬜ |
| Azure — Azure OpenAI, App Service | ⬜ |
| LangSmith — tracing, debugging, evaluation in production | ⬜ |
| LangServe — one-line API deployment | ⬜ |
| Docker — containerization | ⬜ |
| GitHub Actions, CircleCI — CI/CD automation | ⬜ |
| MLflow & DagsHub — experiment tracking | ⬜ |
| Evidently AI — drift detection | ⬜ |
| Grafana — dashboards | ⬜ |
| Airflow, Kubeflow — orchestration | ⬜ |
| DVC — data versioning | ⬜ |

**Math depth:** None — pure DevOps/cloud engineering.

**Flagged priority (from job-market research):** LLM evaluation and
observability was identified as the single most consistent gap across real
job descriptions analyzed via LinkedIn scraping — worth prioritizing when
this phase is reached.

---

## Two Course Orderings — Why They Look Different

Some courses teach Phases 3-4 (classical ML, neural nets) before touching
NLP/LLMs at all — the traditional data-science-first route. Others skip
straight from Python to NLP/LLMs, treating classical ML as optional. Neither
is wrong — they're optimized for different destinations (Data Scientist vs
GenAI Application Builder). This roadmap follows the fuller route since the
goal is understanding *how everything works*, not just what's minimally
required for the target job.

---

## Quick Reference — What NOT to Over-Invest In

Given the Agentic AI Engineer target, avoid sinking excessive time into:
- Deriving backprop equations for complex architectures by hand
- Implementing transformers/attention from scratch
- Heavy statistics/probability theory beyond what Phase 3 naturally covers
- Research-level papers beyond conceptual understanding

These are valuable for ML Research/Applied Scientist roles, not for building
production agentic systems on top of existing LLM APIs.