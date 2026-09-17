# The project website

A static picture of **what this project has to do, and where it has got to**, so that
coming back after two weeks takes a minute rather than an evening.

Open it by double-clicking `index.html`. No server, no build step, no internet — every
chart is hand-written SVG and there is not a single external request on any page.

## The five pages

| Page | Answers |
|---|---|
| `index.html` | Where are we? The 8 phases, the marker, and the one next thing to do |
| `requirement.html` | What did we promise? Target, the 18:00 rule, the baseline to beat |
| `journey.html` | The 27 tickets, and D-001 to D-005 |
| `data.html` | Which stations, and by which two rules |
| `dataset.html` | The 3,342-row daily table, its checks, and what is wrong with it |

## Where the numbers come from

`js/data.js` is a **snapshot**, generated on 17 Sep 2026 from:

- `data/raw/stations.csv` — 147 PM2.5 sensor records and their coverage
- `data/processed/valid_stations_recent_4y.csv` — the 44 that survived D-003 and D-004
- `data/raw/pm25_daily_raw.csv` — the 3,342 cached daily readings
- `docs/backlog/*.md` — the `status:` line of each ticket
- `docs/decisions/` — D-001 to D-004, and the D-005 that is still to be written

Nothing here reads those files at runtime, so the site cannot fall over when a path
moves. The cost is that it goes stale: when a ticket closes or new data lands, the
numbers in `js/data.js` need updating. `DAF_HERE` at the bottom of that file is the
one place that sets the *you are here* marker.

The rest of the folder: `css/styles.css` is the whole palette and layout,
`js/theme.js` the dark/light toggle (stored under `daf-theme`), and `js/site.js`
every chart.

Two conventions worth keeping: a heading's anchor id and a chart container's id must
never be the same string (the chart renders into whichever comes first), and long
file paths inside `<code>` need `overflow-wrap` or they push the page wider than a phone.
