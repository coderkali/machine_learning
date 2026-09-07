# Learning Atlas

Open [`index.html`](./index.html) to explore the repository as an interactive, evidence-backed knowledge system.

## What the atlas contains

- 96 concepts organized into 12 domains and smaller learning clusters
- Three honest evidence states: learned, currently growing, and prior foundation
- A vertical branch view plus a compact card-grid view
- Full lesson drawers with intuition, mechanics, formulas, code, pitfalls, revision prompts, evidence, and related concepts
- Global concept search, status filters, branch navigation, and open/close controls
- A reverse source explorer linking every claim to its notebook, note, script, dataset, or visual
- A responsive dark/light interface with keyboard search (`/`) and shareable topic links

The repository audit covers 96 active-series files, 160 foundation-archive files, 95 notebooks, and 28 CSV datasets. Virtual environments, caches, notebook checkpoints, generated learning sites, system files, and curriculum-only placeholders are excluded from learned-topic claims.

## Project structure

- `index.html` — semantic page structure and accessibility landmarks
- `styles.css` — responsive visual system, vertical connectors, orbit map, cards, and drawer layouts
- `learning-data.js` — the 12-domain topic tree and repository evidence mapping
- `knowledge-guides.js` — concept clusters, detailed lesson enrichment, and aliases to the canonical learning guide
- `app.js` — rendering, filtering, navigation, source indexing, drawer tabs, theme state, and keyboard interaction

The atlas is a local, static project with no package installation or build step. For the most reliable notebook links, serve the repository root with a small local HTTP server and open `/Learning_As_Of_now/`.
