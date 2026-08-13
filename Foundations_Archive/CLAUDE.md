# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A personal learning repository, not a software product. The user is a senior
Java/Spring Boot engineer (12+ years) executing a self-directed roadmap toward
becoming an **Agentic AI Engineer** (not a Data Scientist or ML Researcher).
There is no build, no deploy, no running service — the deliverable of every
session is Markdown notes and/or Jupyter notebooks, committed to git.

The full roadmap (phases, current status, depth rules) lives in
[`AI_Engineering_Roadmap.md`](./AI_Engineering_Roadmap.md) — treat it as the
single source of truth for where the user is and what's in/out of scope.
[`roadmap-visual.html`](./roadmap-visual.html) is a hand-regenerated mind-map
of the same content; update it by hand if the roadmap file changes
significantly, don't assume it auto-syncs.

**Learning depth rule (roadmap Section 3):** before Generative AI (current
phase) — conceptual understanding, simple examples, no deep research, no
heavy math obsession. From Generative AI onward — implementation,
architecture, production readiness, security, observability. Don't over-teach
theory for phases before GenAI.

## Repository structure

- `math_for_ml/` — worked math notes by phase (algebra → stats → linear
  algebra → calculus → linear regression)
- `DataScience_Y/` — hypothesis testing notes (Z-test, T-test, Chi-square)
- `phase_3_classical_ml/` — **current focus.** Structured, self-designed
  curriculum, one evolving "Riverstone Bank" loan-default dataset carried
  across all topics. See `00_strategy.md`.
- `ML/` — running notes for an external course (WsCubeTech ML series),
  numbered 01–23+, plus a capstone `project/` pipeline. Feeds vocabulary and
  code into Phase 3 but is tracked separately.
- `AI_ML_Series/` — **second external course**, started 2026-08-12,
  running Python → libraries → ML. Runs at two deliberate speeds: `NN_<lib>/`
  folders are copy-freely revision, `algorithms/` is strict blind-write.
  See `AI_ML_Series/00_course_map.md`.
- `Pandas/`, `NumPy/`, `Matplotlib/`, `seaborn/`, `irisData_Exploration/` —
  early Python/data-science foundations practice (mostly closed out).
- `AI_Engineering_Roadmap.md`, `roadmap-visual.html` — roadmap source of
  truth and its visual companion.

Full per-file breakdown is kept current in [`README.md`](./README.md) — check
there before re-deriving folder contents from scratch.

## The three note-taking tracks — do not mix these up

This is the single most important thing to get right in this repo. See the
`00_strategy.md` / `00_course_map.md` files and README for details.

| Track | Mode | Defining contract |
|---|---|---|
| `phase_3_classical_ml/` | Socratic, self-designed | Verification question **before** notes are written |
| `ML/` | Direct-author, external course | Notes written directly, no question gate |
| `AI_ML_Series/` | Blind-write, external course | Instructor's code not opened until the user's own version runs |

### 1. `phase_3_classical_ml/` — Socratic, self-designed curriculum

- One evolving dataset (Riverstone Bank, loan officer Arjun, 8 customers)
  carried through every topic — two data-quality issues (a missing credit
  score, an income outlier) are deliberately embedded and referenced
  throughout, not one-off examples.
- Teaching rhythm per topic: story-first → 3-level explanation (child /
  software-engineer / interview-ready) → **conceptual verification question,
  answered before notes are generated (not optional)** → GenAI/RAG bridge →
  visuals as real `.svg` files under a per-topic `images/` folder, embedded
  with markdown syntax so they render on GitHub → notes generated → commit.
- One subfolder per topic (`01_data_collection/`, `02_data_cleaning/`, ...),
  each with its own `images/` if it has visuals — don't use a shared images
  folder.
- Recurring add-ons per topic file: Riverstone Case Files (new mini-scenario,
  solved independently first, no walkthrough up front), an FAQ (3–5 common
  conceptual mix-ups, distinct from the verbatim "Clarifying Questions
  Asked" log), and 3–5 interview-style Q&A.
- Writing register: denser, technical prose is fine here — this is not the
  simple-English track (see below).

### 2. `ML/` — direct-author notes for an external video course

- Started 2026-07-28. The user watches a course and shares slide
  screenshots; write full notes directly, **no verification-question gate**
  (directive mode, not quiz-first tutoring — this is the opposite contract
  from `phase_3_classical_ml/`).
- Write in **simple, plain English**: short sentences, everyday words, one
  idea per sentence. Define any term inline in one plain sentence the first
  time it's used (e.g. "big numbers get pulled down a lot, small numbers
  only a little" rather than dense clause-stacked technical prose). This
  applies specifically to `ML/*.ipynb` and `ML/*.MD` markdown — it does not
  necessarily extend elsewhere in the repo.
- Format precedent (set on `01._LEARNING.MD`): mermaid diagrams using the
  repo's established category colors — blue `#2f6fed` supervised, brass
  `#b3781f` unsupervised, plum `#7a3f66` reinforcement, grey `#8a8f98`
  setback/"AI winter", green `#2f9e6f` positive/destination — plus a
  comparison table, a plain-language analogy block, an FAQ, and 3
  interview-style Q&A.
- **Current default (topics 08+):** for code-heavy topics, skip the
  separate `.MD` file — put the full narrative as markdown cells
  interleaved between code cells directly in the `.ipynb`. Only write a
  standalone `.MD` when a topic is purely conceptual, or as a **synthesis
  note** tying together multiple notebooks after a long conceptual
  discussion (e.g. `20_Feature_Selection_techniques.MD` covers both
  `20_...ipynb` and `21_...ipynb`). This has flip-flopped before — if the
  user asks for a `.MD` or a Field Notes artifact again, that's a real
  signal, not a contradiction of this default.
- Whenever a note involves runnable code, it belongs in a matching
  `.ipynb` (same number/name). Break code into small cells — every
  intermediate sub-expression that a table or explanation calls out gets
  its own executed cell with visible output, not just the final combined
  line — with a short markdown explanation between steps.
- Companion "Field Notes" HTML Artifacts (polished visual infographic, same
  category colors) were a consistent pattern through topic 07 but have not
  been produced since topic 08 — don't assume it's still standard; ask or
  follow the most recent explicit instruction.

### 3. `AI_ML_Series/` — blind-write notes for a second external course

- Started 2026-08-12. Full contract in `AI_ML_Series/00_course_map.md`;
  operational steps in `SKILLS.md`.
- **Two speeds, by design.** `NN_<library>/` folders (NumPy, Pandas,
  Matplotlib, Seaborn) are Track A — copying the instructor's code is fine
  and expected, keep it fast, it's revision of an already-✅ Phase 1.
  `algorithms/` is Track B — copying is banned.
- **Track B's hard rule:** the instructor's shared code is not opened until
  the user's own NumPy-only implementation runs *and* matches
  scikit-learn's output (`np.allclose(..., atol=1e-4)`). That assert is the
  exam — if it fails, help debug the misunderstanding, never loosen the
  tolerance. Instructor code then goes in a gitignored `_instructor/`
  folder and is diffed as a code review, not an answer key.
- Every Track B topic uses the same **eight-slot Algorithm Card** (job /
  what `.fit()` stores / prediction rule / objective / from scratch /
  parity check / knobs & breaking points / verdict row). Slot 2 carries the
  most weight — push for a concrete answer, never a vague "the model".
- Simple-English register and small-cell notebook style carry over from
  `ML/`. Card slots are markdown cells inside the `.ipynb`.
- This track is what closes Phase 3's remaining ⬜ algorithm items on the
  roadmap; Track A closes nothing.

## Environment

- Python 3.14 (Homebrew). Two virtualenvs exist at the repo root:
  `.venv/` and `pizza_env/` (created from `.venv`'s Python; same package
  set — pandas 3.0, numpy 2.4, scikit-learn 1.8, scipy, matplotlib 3.10,
  seaborn 0.13, jupyter/jupyterlab, nbconvert).
- **`pizza_env` is the one actually selected as the Jupyter kernel** in
  nearly every `ML/*.ipynb` notebook (`kernelspec.display_name: "pizza_env
  (3.14.4)"`) — despite the name, this is the working environment, not a
  stray one. Use it when executing notebooks so the kernel matches what's
  already saved in the file. `.venv` appears to be an earlier/base
  environment `pizza_env` was created from.
- No `requirements.txt`/`pyproject.toml` exists — dependencies aren't
  pinned anywhere outside the venvs themselves.

## Conventions

- **Notebooks must actually be executed, not hand-authored with fake
  output.** Run via `jupyter nbconvert --execute --inplace <file>.ipynb`
  and confirm zero errors before considering a notebook done.
- Diagrams that need to render on GitHub go in as real files (`.svg` under
  a topic's `images/` folder for `phase_3_classical_ml/`), referenced with
  markdown image syntax — never just described in prose.
- Commit messages follow the existing informal style seen in `git log`,
  e.g. `Add notes:: ML : Feature Scaling Normalization` or
  `Add Notes : Feature Selection`. Match this style rather than switching
  to conventional-commits format.
- **Never add a `Co-Authored-By: Claude` (or any AI-attribution) trailer**
  to commit messages in this repo — commits should show only the user as
  author/committer.
- Commit at the end of each topic, before moving to the next one (part of
  the Phase 3 teaching rhythm, but a reasonable default repo-wide too).

## Current focus

🟡 **Phase 3 — Classical Machine Learning.** Data Collection and Data
Cleaning are done in `phase_3_classical_ml/`; Feature Engineering/Encoding
is next up there. In parallel, the `ML/` course track has completed
conceptual primer (01–04, one sub-item "Use of Machine Learning Technology"
still open), hands-on feature engineering (05–19), and feature selection
(20–22); still open: ML algorithms, hyperparameter tuning, deployment,
Docker/Kubernetes. A third track, `AI_ML_Series/`, started 2026-08-12 to
attack the ML-algorithms gap specifically, via blind-write implementation.
Check `AI_Engineering_Roadmap.md`, `phase_3_classical_ml/00_strategy.md`
and `AI_ML_Series/00_course_map.md` for the authoritative up-to-date status
rather than trusting this snapshot as phases progress.

## Working preferences

- Explain new ML concepts using backend/software-engineering analogies
  first (e.g. "rules you hand-write in `if/else`" vs "rules the model
  derives") — the user's strongest grounding is enterprise software
  engineering, not math/stats.
- In `phase_3_classical_ml/`, don't skip the conceptual verification
  question — it's a teaching contract, not an optional nicety.
- In `ML/`, don't gate notes behind a question — write directly, richly,
  and in simple English.
- In `AI_ML_Series/algorithms/`, don't hand over a working implementation
  before the user has attempted their own — that track's entire value is
  the blind attempt plus the sklearn parity assert. Helping *debug* a
  failing attempt is the job; supplying the answer isn't.
- Don't mix the three tracks' conventions into each other.
