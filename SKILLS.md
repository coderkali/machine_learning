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
