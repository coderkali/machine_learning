# SKILLS.md

Reusable, task-specific knowledge for working in this repo. Read alongside
[`CLAUDE.md`](./CLAUDE.md), which covers durable project context — this file
covers *how to do* the recurring tasks.

## Running / executing a notebook

Notebooks are meant to be actually executed, not hand-authored with fake
output. Use the `pizza_env` kernel (see CLAUDE.md — it's the real working
environment despite the name, and is what's already saved in most
`ML/*.ipynb` kernelspecs):

```bash
/Users/kaliprasad/Documents/MACHINE_LEARNING/pizza_env/bin/jupyter nbconvert \
  --to notebook --execute --inplace path/to/notebook.ipynb
```

Confirm it finishes with no errors before treating the notebook as done —
don't hand-write cell outputs. If you need an interactive session instead:

```bash
/Users/kaliprasad/Documents/MACHINE_LEARNING/pizza_env/bin/jupyter lab
```

## Adding a new `ML/` course-track note (direct-author mode)

Used when the user shares a new topic/slide screenshot from the external
WsCubeTech course.

1. Pick the next number in sequence (check the highest-numbered file in
   `ML/` first — e.g. after `23_Simple_Dataset_Practice`, the next is `24_`).
2. Write directly, no verification-question gate — this track is directive,
   not Socratic.
3. Decide `.MD` vs `.ipynb`-only:
   - Purely conceptual, no runnable code → standalone `.MD`.
   - Runnable code involved → put the narrative as markdown cells
     interleaved between code cells inside the `.ipynb` itself (current
     default since topic 08); don't also create a separate `.MD` unless
     asked, or unless the topic is a synthesis tying multiple notebooks
     together (see `20_Feature_Selection_techniques.MD` as the precedent —
     it covers both `20_...ipynb` and `21_...ipynb`).
4. Write all markdown in **simple English** — short sentences, one idea per
   sentence, define any term inline the first time it's used. This is a
   hard requirement for this track specifically (see
   `feedback_simple_english_ml_notes` in the user's memory / CLAUDE.md).
5. If the topic has runnable code, break it into small cells: every
   intermediate sub-expression that would otherwise get combined into one
   line (e.g. `df.isnull()`, then `.sum()`, then `.shape[0]`, then the
   division, *then* the full combined line) gets its own cell with visible
   output, with a short markdown explanation between steps.
6. If mermaid diagrams are useful, reuse the established category-color
   convention:
   - `#2f6fed` supervised / primary-positive
   - `#b3781f` unsupervised
   - `#7a3f66` reinforcement
   - `#8a8f98` setback / "AI winter" / caution
   - `#2f9e6f` positive outcome / destination
7. Execute the notebook (see above) and verify zero errors.
8. Commit with the established message style: `Add notes:: ML : <Topic
   Name>` (see git log for more examples).

## Adding a new `AI_ML_Series/` note (blind-write mode)

Third track, started 2026-08-12. External video course running Python →
libraries → ML, where the instructor codes live and shares the source at
the end of each session. Full contract in
[`AI_ML_Series/00_course_map.md`](./AI_ML_Series/00_course_map.md) — read
it before writing here; the summary below is the operational version.

**What makes this track different from `ML/`:** the instructor's code is
quarantined. That's the whole identity of the track — don't collapse it
into the `ML/` workflow just because both are course-notes tracks.

### First, decide which speed the topic runs at

- **Track A — Python / NumPy / Pandas / Matplotlib / Seaborn.** Copying is
  fine and expected. Copy, run, one markdown line per cell. Keep it cheap —
  Phase 1 is already ✅ on the roadmap, this is revision. Files go in
  `AI_ML_Series/NN_<library>/`. No algorithm card. If it's taking more than
  one sitting, it's over-invested.
- **Track B — any ML algorithm, plus train/test methodology, metrics, and
  tuning.** Copying is banned. Follow the full protocol below. Files go in
  `AI_ML_Series/algorithms/NN_<algorithm_name>/`.

### Track B protocol — do not shortcut this

1. User watches the explanation, then closes the video. **The shared code
   is not downloaded yet.**
2. Blank notebook. Implement the algorithm in **NumPy only**, no
   scikit-learn — from the math, not from memory of the instructor's lines.
3. Run scikit-learn's equivalent on the same data.
4. **Assert the two match:** `np.allclose(my_coefs, model.coef_, atol=1e-4)`.
   For algorithms with no coefficients (trees, KNN, K-Means), assert on
   predictions instead; for K-Means compare assignments up to label
   permutation with `random_state` fixed on both sides.
5. **Only then** is the instructor's code opened, dropped into a
   `_instructor/` subfolder, and diffed against the user's version as a
   code review — not as an answer key.

Step 4 is the point of the whole track: it turns "I think I understood"
into a pass/fail test. **If the assert fails, help debug the
misunderstanding — never loosen the tolerance to make it pass.**

`_instructor/` is gitignored at the repo root. Two reasons: the repo is
public and the course material isn't the user's to republish, and the
friction is deliberate. Don't suggest committing it.

### The Algorithm Card — eight fixed slots

Every Track B topic uses the identical structure, in order. The
consistency is the mechanism — it's what makes algorithms comparable
instead of each one being learned in its own ad-hoc shape.

1. **The job** — one sentence + a backend/Java analogy
2. **What `.fit()` actually stores** — the literal in-memory artifact
3. **The prediction rule** — one row → one output, walked by hand
4. **The objective** — the loss, and how it's minimised
5. **From scratch (NumPy)** — the blind implementation
6. **sklearn parity check** — the assert from step 4
7. **Knobs & breaking points** — hyperparameters, scaling sensitivity,
   assumptions, failure modes, how it overfits
8. **Verdict row** — appended to `algorithms/00_comparison_table.md`

**Slot 2 carries the most weight** — push for concreteness there ("768
rows of training data", "six floats", "a nested if/else ~8 levels deep"),
never a vague "the model". A good forcing question: *could you reimplement
`predict()` in Java from what's stored, without the library?*

Template to copy:
[`AI_ML_Series/algorithms/_TEMPLATE_algorithm_card.md`](./AI_ML_Series/algorithms/_TEMPLATE_algorithm_card.md)

### Mechanics

- Card slots live as markdown cells interleaved with code cells **inside
  the `.ipynb`** — same default as `ML/`. No separate `.MD` per algorithm
  unless the topic is purely conceptual.
- Small cells, as in the `ML/` track: every intermediate sub-expression
  that a slot refers to gets its own executed cell with visible output.
- Simple-English register applies here too, same as `ML/`.
- **Benchmark dataset:** every classifier also gets run on
  [`ML/diabetes.csv`](./ML/diabetes.csv) with
  `train_test_split(test_size=0.2, random_state=42, stratify=y)`, so rows
  in the comparison table stay comparable. This is *in addition to* the
  instructor's dataset, not instead of it.
- Execute the notebook with the `pizza_env` kernel, zero errors (see top of
  this file).
- When a card completes, update **both** the status table in
  `AI_ML_Series/00_course_map.md` §7 and the Phase 3 table in
  `AI_Engineering_Roadmap.md` §7 — Track B is what closes that phase's
  remaining ⬜ algorithm items. Track A closes nothing; Phase 1 is done.
- Remind the user about the **48-hour blank-cell reimplementation** when a
  card finishes.

---

## Adding a new `phase_3_classical_ml/` topic (Socratic mode)

Used for the self-designed curriculum topics (see `00_strategy.md` for the
full topic list and current status).

1. Create a new subfolder: `phase_3_classical_ml/NN_topic_name/`, plus an
   `images/` subfolder inside it only if the topic will have diagrams —
   don't share one images folder across topics.
2. Follow the teaching rhythm in order, and don't skip steps:
   1. Story-first, using the Riverstone Bank dataset/customers (loan
      officer Arjun, 8 named customers — see `00_strategy.md` for the full
      table, including the two deliberately-embedded data issues: Deepak's
      missing credit score, Priya's income outlier).
   2. 3-level explanation: child level → software-engineer level →
      interview-ready level.
   3. **Ask a conceptual verification question and wait for the answer
      before generating notes.** This is a teaching contract, not
      optional — do not skip it even if the answer seems obvious.
   4. GenAI/RAG bridge — explicitly connect the classical-ML concept to
      its later GenAI/RAG equivalent.
   5. Generate visuals as real `.svg` files under the topic's `images/`
      folder (not just described in prose), embedded via markdown image
      syntax so they render on GitHub.
   6. Generate the notes file: `NN_topic_name.md`.
   7. Commit before moving to the next topic.
3. Add the recurring add-ons to the same notes file, starting from topic 2
   onward:
   - A **Riverstone Case File** — a new mini-scenario in the same story
     world, solved independently first (no walkthrough given up front).
     Every few topics, make one cumulative (requires concepts from 2-3
     topics back too).
   - An **FAQ** (3–5 common conceptual mix-ups, written generally — not
     the verbatim back-and-forth from the session).
   - **3–5 interview-style Q&A** with concise model answers.
4. Update the status table in `00_strategy.md` and the phase table in
   `AI_Engineering_Roadmap.md` (Section 7) when a topic completes.

## Updating roadmap status

`AI_Engineering_Roadmap.md` uses `✅ Done · 🟡 In Progress / Current · ⬜ Not
Started` markers in per-phase tables and in the Section 4 overview table.
When a topic or phase's status changes, update **both**:
- The specific phase's own status table/section.
- The Section 4 overview line for that phase, if the phase-level status
  changed (not just one sub-topic within it).

`roadmap-visual.html` is a separate hand-maintained mind-map of the same
content — it does not auto-regenerate from the `.md` file. Only touch it
when asked, or flag that it's now out of sync if a status change is
significant.

## Companion "Field Notes" HTML Artifact (ML/ track, when requested)

Through `ML/` topic 07, every topic got a matching polished HTML infographic
Artifact ("Field Notes" series) alongside the note file, using the same
mermaid category colors listed above. This has not been produced since
topic 08 and isn't the current default — only build one if the user asks
for it (or if continuing an explicit "Field Notes" series request).

## Commit message style

Match the existing informal convention rather than switching to
conventional-commits format. Examples from `git log`:

```
Add notes:: ML : Feature Scaling Normalization
Add notes:: ML : One hot encoding
Add Notes : Feature Selection
Add Notes : More Detailed Way of understaing Feature Selection
```

Pattern: `Add Notes[::] <track/area> : <short description>`. Commit at the
end of each topic, before starting the next one.

**Do not add a `Co-Authored-By: Claude` (or any AI-attribution) trailer to
commit messages in this repo.** This repo's commits should show only the
user as author/committer — no exceptions, regardless of how much of a
commit's content Claude Code generated.
