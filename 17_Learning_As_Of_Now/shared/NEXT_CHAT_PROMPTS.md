# What to say in a new chat

`CLAUDE.md` is read automatically at the start of every session, so the workflow,
folder layout, story rule and build command are already known. You only need to
say **what you learned and where the file is**.

---

## The usual one — a new topic

```text
I learned <TOPIC> today. The notebook is at <path/to/file.ipynb>.
Add it as a new topic under <SUBJECT> and run the full pipeline.
```

Real example:

```text
I learned LDA today. The notebook is at ~/Downloads/Seesion 21/LDA.ipynb.
Add it as a new topic under 04_ML and run the full pipeline.
```

That is enough. It will place the files, write the story, build the lesson and
code pages, wire it into the map, and tell you what still needs handwritten notes.

---

## Other situations

**Place a new topic on the ML journey**

The Journey page (`journey.html`) is a top-to-bottom tree of the ML pipeline —
Raw Data → Cleaning → Pre-Processing → Feature Engineering → Split → Model
Selection → Training → Evaluation → Tuning → Final Model → Deployment — with your
topics hanging off each stage and ticked as you learn them.

Its stage-to-topic mapping is **hand-maintained**, so a new ML topic has to be
placed on it:

```text
Put <TOPIC> on the Journey page under the right stage.
```

You do not need to remember this. `build_site.py` prints a warning for any
`04_ML/` topic that is missing from the Journey map:

```text
   NOT ON THE JOURNEY PAGE
     - 04_ML/36_Linear_Discriminant_Analysis   → add it to a stage in journey-data.js
```

Foundation topics (Python, statistics, maths) are deliberately not on the
Journey — they are prerequisites, not pipeline stages — so they are never flagged.

**Added more work to a topic that already exists**

```text
I added new cells to 04_ML/23_Cross_Validation. Rebuild.
```

**You want handwritten notes for a topic**

```text
Give me the Codex prompt for handwritten notes for <TOPIC>.
```

Then paste the generated prompt into Codex. When it finishes:

```text
Codex finished the notes for <TOPIC>. Check them and rebuild.
```

**You only moved or renamed files**

```text
Rebuild the site.
```

**You want a hand-written lesson instead of a generated one**

```text
Write a full illustrated lesson for <TOPIC>, like the Linear Regression one.
```

(That page is `04_ML/16_Linear_Regression/Content/index.html` — it is marked
`hand-authored`, so the builder never overwrites it.)

---

## What you should see at the end

Every session that changes content must finish with:

```text
3/3  Verifying
     NN lessons · NN code views · NN handwritten pages
     all links resolve
```

If it does not say **all links resolve**, something is broken — ask for it to be
fixed before you commit.

A yellow **NOT ON THE JOURNEY PAGE** block is a warning, not a failure. It means
an ML topic has a lesson but no place on the pipeline tree. Say
`put it on the Journey page` and it will be mapped.

## The four pages of the site

| Page | What it is for |
|---|---|
| `index.html` | Home, the mind map, and the library of every lesson |
| `workspace.html` | Three-pane reader: Content · Code · Handwritten Notes |
| `journey.html` | The ML pipeline as a tree, ticked off as you learn |
| `<topic>/Content/index.html` | One illustrated lesson |

---

## Things worth saying when they apply

- "This is prior work, not current-course work" — so status is not upgraded by mistake.
- "Do not touch <folder>" — for anything you want left alone.
- "Do not commit" — nothing is committed unless you ask.
