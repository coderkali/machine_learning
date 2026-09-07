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
[`docs/review-queue.md`](../docs/review-queue.md) — so unfinished work stays
visible instead of quietly disappearing.

Branch connectors are coloured by top-level branch, so you can follow a line
back to where it came from.

## Files

| File | Purpose |
|---|---|
| `index.html` | The page shell — header, map, drawer, reading view |
| `styles.css` | All the styling, hand-written |
| `tree-data.js` | **The content.** Every branch, topic and sub-topic |
| `app.js` | Layout engine, animation, pan/zoom, search, reading view |

## Snapshot

83 nodes, of which **72 are topics**: 32 done, 14 learning, 15 archive,
11 not started.

The three top branches are `AI_ML_Series` (the active bootcamp, 53 topics),
`Foundations_Archive` (prior work, 15 topics), and the tracking documents.

## Keeping it current

This is a hand-written snapshot taken on 2026-09-07, not a generated file.
When you add notebooks, edit `tree-data.js` — the layout, counts, progress
bars, and both views all rebuild themselves from it.
