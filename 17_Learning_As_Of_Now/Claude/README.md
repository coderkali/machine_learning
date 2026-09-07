# My Learning Universe

An interactive map of every topic studied in this repository.

Open **[`index.html`](./index.html)** in a browser. No build step, no
dependencies, no internet needed.

## Two ways to look at the same thing

**🌌 Map** — a spatial mindmap you can pan and zoom. The root sits on the left
and branches fan out to the right along curved, colour-coded connectors. Click
any node to open it; the map re-flows around the node you clicked so nothing
jumps. Clicking also slides in a detail panel with that topic's sub-topics, its
status, and a link to the real file.

**📖 Deep dive** — everything opened at once, as a document. Every branch,
every notebook, every sub-topic, with a sticky table of contents down the left
and a progress bar per branch. This is the view for reading straight through
what you have learned.

## Controls

| | |
|---|---|
| Click a node | open that branch and show its details |
| Drag, or scroll | move around the map |
| ⌘ / Ctrl + scroll | zoom |
| **Open everything** | expand all 83 nodes and jump to the top of the tree |
| **Fit** | zoom out to the whole shape at once |
| Search | filters both views, highlights matches, and flies to the first one |
| `+` `−` `0` `Esc` | zoom in, zoom out, fit, close the panel |

## Reading the colours

Each card carries its status on the left edge:
**green** done · **amber** learning · **purple** archive (prior work) ·
**grey** not started.

Amber bullet points are known gaps, taken from
[`docs/review-queue.md`](../../15_Docs/review-queue.md) — so unfinished work stays
visible instead of quietly disappearing.

Branch connectors are coloured by top-level branch, so you can follow a line
back to where it came from.

## Illustrated lessons

A topic can have a **rendered lesson page** as well as its raw notebook. Where
one exists, the map drawer shows a "Read the illustrated lesson" button above
the notebook link, and the card carries a 📖 badge.

Lesson pages live in the topic's own `Content/` folder, beside the `Concept/`
folder that holds the notebook:

```text
04_ML/16_Linear_Regression/
├── Concept/   05_Linear_Regression.ipynb      the notebook
├── Content/   linear-regression.html          the lesson  + assets/
└── Data/      figures and datasets
```

Shared lesson styling is in [`../shared/`](../shared/) — `lesson.css` and
`lesson.js` (Python syntax highlighting, reading progress, TOC tracking), so a
new lesson only costs its own HTML.

Written so far:

- [Linear Regression](../../04_ML/16_Linear_Regression/Content/linear-regression.html)

## Regenerating the map

`tree-data.js` is **generated from the folder structure on disk**. After moving
or adding files, regenerate it so the map matches reality. Curated descriptions
are carried across by file name, so hand-written detail is not lost.

## Snapshot

101 nodes, of which **83 are topics** across 17 subject folders.

The branches are the 17 numbered subject folders, from `01_Python` through
`17_Learning_As_Of_Now`.

## Keeping it current

`tree-data.js` is generated from the folders on disk. Add a notebook under a
topic's `Concept/` folder and regenerate; the layout, counts, progress bars and
both views all rebuild from it.
