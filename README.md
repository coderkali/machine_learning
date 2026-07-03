# Machine Learning → Agentic AI Learning Journey

Personal, self-directed curriculum taking a 12-year software engineer (Java/Spring background) from zero ML knowledge to interview-ready **Agentic AI Engineer**.

## Why this path (decided July 2026)

Coming from 12 years of industry software engineering, the guiding principle is the same one that applied to every framework wave before this one (Spring → Spring Boot, etc.): **tools and frameworks change constantly — the discipline is understanding the tool deeply enough to apply it correctly to a real business problem.** Machine learning and AI are no different. The models and techniques already exist; the skill is knowing how to apply, integrate, or extend them inside real systems.

Given that mindset, and 12+ years of production engineering experience, the target is **not** a research scientist or data scientist role. It's **Agentic AI Engineer** — someone who can design and ship multi-step, tool-using AI systems in production, bringing the same rigor (reliability, observability, cost control, system design) that already applies to any production software system.

### Where Generative AI fits
Generative AI (the LLM itself — text generation, reasoning, prompting) is not a separate track from Agentic AI. It's the foundational layer underneath it:

```
Agentic AI  =  Generative AI (LLM)  +  orchestration (tools, memory, multi-step planning)
```

You cannot build a good agent without understanding how the underlying model behaves. So GenAI fundamentals (Phase 7 below) are a required stepping stone inside this track, not an alternative to it.

**Data analytics** is a genuinely separate track (SQL, dashboards, business statistics) and is explicitly out of scope here.

## Roadmap

| Phase | Topic | Status |
|---|---|---|
| 1 | Algebra | ✅ Done |
| 2 | Statistics | ✅ Done |
| 3 | Linear Algebra | ✅ Done |
| 4 | Calculus Intuition (slope, derivative, gradient descent) | ✅ Done |
| 5 | Linear Regression from scratch | 🟡 In progress — resuming Meera's messy-data gradient descent iteration |
| 6 | Neural Network Intuition (neurons, layers, backprop) | ⬜ Next |
| 7 | LLM Fundamentals (tokens, embeddings, attention, prompting patterns) | ⬜ Upcoming |
| 8 | RAG Systems (embeddings, vector search, chunking) | ⬜ Upcoming |
| 9 | Agentic Frameworks + MCP (CrewAI → LangGraph, tool calling) | ⬜ Upcoming |
| 10 | Portfolio Projects + Interview Prep (system design, production thinking) | ⬜ Upcoming |

## What's in scope

- Neural network intuition — neurons, layers, forward pass, backprop (conceptual)
- How attention and tokens work, conceptually — not the underlying matrix math
- Prompting patterns: few-shot, chain-of-thought, ReAct
- Function calling / tool use
- RAG: embeddings, vector search, chunking
- Agent frameworks: CrewAI first (fast to grasp concepts), then LangGraph (production control)
- MCP (Model Context Protocol) — how agents connect to tools and data
- Production thinking: retries, observability, cost control, system design for AI

## What's deliberately out of scope (for now)

- Hand-deriving backpropagation calculus proofs
- Training an LLM from scratch
- Building a transformer architecture from scratch
- CUDA / low-level GPU optimization
- Research-level statistics, Bayesian methods
- Fine-tuning internals (LoRA, DPO, RFT)
- Computer vision / non-text domains
- Voice agents, browser agents

These aren't excluded forever — they matter for research/model-training roles. They're just not needed for the agentic engineer target, so they're deferred.

## Approach

- One concept at a time, confirmed before moving on
- Manual calculation first (pen and paper), then verified in code/chat
- Story-based examples with Indian context (electricity bills, chai shops), kept consistent within a topic for continuity
- Visualization-first — diagrams and graphs over text-heavy explanation
- Notes written to markdown, pushed to GitHub after each concept

## Structure

```
math_for_ml/
  phase_1_algebra/
  phase_2_statistics/
  phase_3_linear_algebra/
  phase_4_calculus/
  phase_5_linear_regression/
  00_examples_library.md
  doubts_and_clarifications.md
```

## Tools

- Environment: `pizza_env` virtual environment
- Editor: VS Code with Jupyter notebooks
- Graphing: Desmos (desmos.com/calculator)
- Repo: github.com/coderkali/machine_learning