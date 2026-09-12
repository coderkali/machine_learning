---
id: DAF-02
title: Write the requirements and the first decisions
phase: 1 — Requirements and setup
sprint: 1
estimate: 2-3 h
status: todo
depends_on: [DAF-01]
---

# DAF-02 · Write the requirements and the first decisions

## Story

As Asha, I want to know exactly what this system will tell me, when it will
tell me, and how wrong it is allowed to be, so that I can trust it with a
decision about 600 children.

## Why this ticket exists

"Predict Delhi's air quality" is not a requirement. It is a wish. You cannot
build it, and more importantly you cannot tell whether you succeeded.

A real ML requirement pins down five things, and every one of them changes the
code you write later:

| | Why it changes the code |
|---|---|
| The decision it supports | Decides which errors are expensive |
| What exactly is predicted | Decides how you build the target column |
| When the prediction is made | Decides which features are legal |
| The success number | Decides which model wins |
| The baseline it must beat | Decides whether the project was worth doing |

This is the same discipline as agreeing the API contract and the SLA before
writing a service. Skipping it is how you end up with a model that scores 0.95
and is still useless.

## Background

Read the phase brief first: [`docs/phases/01_requirements.md`](../phases/01_requirements.md).
It lays out the options for the two decisions in this ticket, with my
recommendation for each. You choose; I will tell you honestly if the choice
makes something later harder.

The two decisions:

- **D-001 — What does the model output?** A number (regression), a category
  (classification), or a number that we convert into a category.
- **D-002 — When is it made, and for what window?** The prediction time and the
  exact period being predicted.

## Steps

1. Read the phase brief.
2. Decide D-001 and D-002. Write each as a decision record using
   [`docs/decisions/_TEMPLATE.md`](../decisions/_TEMPLATE.md).
3. Write `docs/requirements.md` with these sections:
   - Who it is for, and the decision it supports
   - What the model predicts — the exact definition, unit, time window, timezone
   - When the prediction is made, and what data exists at that moment
   - Success criteria — a number, next to the baseline it must beat
   - Data sources, and what each is used for
   - Constraints and risks
   - Non-goals — at least three
   - Glossary of terms used (PM2.5, NAQI, persistence baseline, …)
4. Update the project README's summary line if D-001 changed the framing.
5. Commit.

## Acceptance criteria

- [ ] `docs/requirements.md` exists with all eight sections above
- [ ] The target is defined so precisely that two people would build the same
      column from the raw data. It states the statistic, the window, the
      timezone, and what happens when hours are missing
- [ ] The prediction time is stated, and the requirement says which data is and
      is not available at that moment
- [ ] Success is a **number** compared against a **named baseline**, not an
      adjective like "accurate"
- [ ] At least three non-goals are listed
- [ ] `docs/decisions/D-001-*.md` and `D-002-*.md` exist, each with Context,
      Options considered, Decision, Why, Consequences
- [ ] Each decision record names at least one thing the rejected option would
      have made easier — proof you weighed it rather than picked one

## Explain back

1. Why is "the model must be accurate" not a success criterion?
2. What is your baseline, and why does a model that cannot beat it have
   negative value, rather than zero value?
3. Asha reads the forecast at 6 pm. Name one piece of data that is obviously
   useful for predicting tomorrow, and that you are not allowed to use.

## Traps

- Writing a target definition that quietly assumes complete data. Delhi sensors
  go down. Decide the missing-hours rule now, in words, before you meet it in
  code in DAF-10.
- Choosing a metric because it is familiar rather than because it matches
  Asha's cost of being wrong.

## My notes

_Your answers, and the reasoning behind D-001 and D-002 in your own words._
