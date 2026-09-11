---
name: update-documentation
description: Bring every tab of the learning website (Home, Mind map, Workspace, Journey, When to Use What) and the written docs up to date with what has been learned. Use whenever the learner says "update the documentation", "update the docs", "update the website", "sync the site", or asks to reflect a newly studied topic everywhere.
---

# Update the documentation

"Update the documentation" means **every tab of the website plus the written
record**, not only the lesson pages. A topic is not documented until it shows
up correctly on all five tabs.

Work in this order. Later steps read what earlier steps produce.

## 0. Find what changed

```bash
git status --short
python3 17_Learning_As_Of_Now/shared/build_site.py
```

The build's warnings are your to-do list:

- `NOT ON THE JOURNEY PAGE` → step 3
- `NOT ON THE WHEN-TO-USE-WHAT PAGE` → step 4
- `PROBLEMS` → fix these first; the build fails until they are gone

List the topic folders whose `Concept/`, `Data/` or `Handwritten_Notes/`
changed. Those are the topics to carry through every step below.

## 1. Lesson pages — feed Home's library, the Mind map and Workspace

For each changed topic:

1. **Story** in `17_Learning_As_Of_Now/shared/stories.json`: a named person →
   tries the obvious thing → it fails, and exactly why → the fix. Simple English,
   short sentences. Never open with a definition.
2. **Handwritten notes** in `Handwritten_Notes/` if there are none: follow
   `17_Learning_As_Of_Now/shared/CODEX_HANDWRITTEN_NOTES_PROMPT.md`. Keep them
   short — 60-second pages, 3 pages at most.
3. **Never hand-edit** `Content/index.html`, `Content/code.html` or
   `Claude/tree-data.js`. To change wording, change the notebook, the note or
   `stories.json`, then rebuild.

## 2. Home and Mind map (`index.html`) and Workspace (`workspace.html`)

These read `Claude/tree-data.js`, which `build_site.py` regenerates from the
folders. Nothing to write by hand — unless:

- **a new subject folder** appeared → add it to `SUBJECT_META` in
  `17_Learning_As_Of_Now/shared/gen_tree.py`
- **status**: a new topic takes its subject's default from `SUBJECT_META`.
  Do **not** change a topic's status as part of this task. Bootcamp status and
  skill level are separate, and `🟢 Completed` needs the checkpoint (see the
  Status rules in CLAUDE.md). Ask the learner if a status looks wrong.

## 3. Journey (`journey.html`)

Add every new `04_ML/` topic to its stage in
`17_Learning_As_Of_Now/Claude/journey-data.js`. Python, statistics and maths
are prerequisites and stay off it.

Journey's stage order must agree with the When to Use What order in step 4
(look → clean → **split** → pre-process → feature engineering → choose a model
→ fit → check → ship). If you find them disagreeing, point it out and ask
before moving stages — do not silently reorder.

## 4. When to Use What (`chooser.html`) — keep the beginner-first design

The page is built for someone who knows no ML. Its shape is fixed; add to it,
do not redesign it:

```
Intro:     Meera's story, and "Where are you?"
Three panels side by side, each scrolling on its own:
  left     Meera's table, all 12 columns (scrolls sideways); it lights up,
           and slides to, the columns the waiting question is about
  middle   the 8 stages in order, each listing the problems it fixes, with
           a button per problem
  right    the picked decision's questions, one below another, each with a
           plain hint; answering opens the next; changing an earlier answer
           redraws everything below; the path ends on the card
A card:    one plain sentence → the code → one "use it when" and one
           "do not use it when" → the other options → More detail
All decisions: the full wall; choosing one opens it in the right panel
On a phone the panels stack: table, questions, then stages.
```

The learner chose this layout (2026-09-11). Ask before changing it.

Never move the reader to another screen to answer questions. They forget the
earlier question, and the table they are reasoning about disappears.

For each technique the learner has to **choose between** (a scaler, an
encoder, a model, a metric, a test):

1. **Card** in `Claude/chooser-data.js`, in the `SPACES` stage where the work
   really happens (`look`, `clean`, `split`, `prep`, `feat`, `model`, `judge`,
   `ship`). Fields:
   - `name` — exactly as the flowchart leaf will say it
   - `plain` — **one short sentence in simple English**: what it does for you.
     A beginner reads only this. No jargon, no "hyperplane", no "variance".
   - `code` — the one line you would really type
   - `how` — the mechanism, 2–3 sentences, behind "More detail"
   - `use` / `avoid` — each bullet says the condition, the reason, and what goes
     wrong. The **first** bullet of each is shown up front, so make it the
     clearest one.
   - `topic` / `also` — real folder paths
2. **Leaf** for it in that decision's tree in `FLOWS`. A card with no leaf is
   invisible. Write new questions and answer labels in plain words, and give
   every question a `hint`: what it is really asking, in simple English, with
   an example from Meera's table wherever one fits ("Counts means you count
   people in groups — how many who work OverTime left…"). Add
   `see: ["Column", …]` when it is about particular columns, so the table
   lights them up. Check every `see` column exists in `TOUR.cols`.
3. **The start screen** (`Claude/chooser-tour.js`): if the technique fixes a
   problem you can see in the real table, add or re-point a problem. Rows must
   stay copied unchanged from
   `04_ML/35_Project_Employee_Attrition/Data/employee_attrition_raw.csv`, and
   every number quoted in a problem's `text` must be counted from that file with
   pandas, never estimated.
4. **Not a choice** (a foundation, a whole project) → name it in
   `NOT_A_CHOICE` with the reason, so the build stops warning.

Colours: never write a raw colour. Use the tokens in `shared/theme.css`; if you
need a new one, add it with a dark **and** a light value.

Class names: never reuse one that `Claude/styles.css` already defines (`card`,
`open`, `on`, `done`, `lit`, `dim`, `strip`, `hidden`…). The mind map's rules
would land on your element, as they once did on the answer card. The chooser's
state classes are all `is-…`.

## 5. The written record

Update only what really changed:

- `15_Docs/SKILLS.md` — new evidence of ability
- `15_Docs/ROADMAP.md` — curriculum status changed
- `15_Docs/curriculum-map.md` — an evidence path or module status changed
- `15_Docs/glossary.md` — a genuinely important new term
- `15_Docs/review-queue.md` — a real gap to revisit
- `17_Learning_As_Of_Now/Claude/README.md` — the snapshot counts (take them
  from the build output) and anything it says that is no longer true
- the topic's own `README.md`, if it has one

## 6. Verify — every tab, not just the build

```bash
python3 17_Learning_As_Of_Now/shared/build_site.py        # must end "all links resolve", no warnings
python3 .claude/skills/update-documentation/screenshot_tabs.py <scratch-dir>
```

The script saves a desktop and a phone-width screenshot of every tab. If it
stops with "Headless Chrome is not responding", nothing was captured. So far
that has happened while the learner's own Chrome was open. Never quit it
yourself. Use Playwright instead: in a scratch folder, run
`npm install playwright` and `npx playwright install chromium`. Its own browser
runs alongside the learner's Chrome, and it can click through the page as well
as screenshot it. If no browser works at all, say the visual check was skipped,
and never describe a page you have not seen. Otherwise **read every image** and check that:

- the new topic appears on Home, the Mind map, Workspace and Journey
- its card is on When to Use What, in the right stage, and the flowchart reaches it
- the card opens with its plain sentence, and nothing overflows at phone width

If you changed any `.js`, syntax-check it:
`node -e 'new Function(require("fs").readFileSync("<file>","utf8"))'`.

To see the light theme, set `localStorage["lu-theme"] = "light"` before the
page loads (Playwright's `addInitScript`). Flipping it after load captures the
0.22 s colour fade instead. Also check that the stylesheet has no raw colours
and that every `var(--token)` it uses is defined in both theme blocks of
`shared/theme.css`.

Code tests are not enough on their own. On 2026-09-11 every check passed while
the answer card had borrowed `.card` from `styles.css` and was drawn as a tiny
floating box. Look at every screenshot before saying a page works.

## 7. Report

Tell the learner, per tab, what changed and what you checked, in simple
English. Say plainly what you could not verify, and what is left open. Do not
commit unless asked.
