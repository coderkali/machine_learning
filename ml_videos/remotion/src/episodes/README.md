# Episode data — `src/episodes/day_NN/`

Two hand-written files per episode; everything in `generated/` is written by the scripts.

## `episode.json`

| Field | Meaning |
|---|---|
| `day`, `slug`, `title` | Episode number, short name and title. Claude's outputs go to `remotion/out/day_NN/` |
| `topic` | Right side of the video header (`DAY 1 / ML BASICS`) |
| `next` | `{ day, title }` for the end card `NEXT → DAY N+1: …` |
| `thumbnail.blocks` | Headline boxes, top to bottom: `{ text, style }`, style `black` · `yellow` · `red` · `white`. 3–5 boxes, 3–9 words, **exactly one `red`** (SERIES_ROADMAP §5b) |
| `thumbnail.diagram.source` | Which notes file the diagram comes from — never invent a diagram |
| `thumbnail.diagram.rows` | 1–3 rows `{ title, tone: good/bad/neutral, items }`. Items: `"+"`, `"->"`, icons `"@computer" "@mail" "@model" "@chart" "@table" "@code" "@python" "@java" "@check" "@cross"`, or a text chip `"DATA"` / `{ "label": "MODEL", "fill": "green" }` (fills: white yellow green red blue black) |

## `voice.json`

Top level: `voice` (`name`, `voiceId`, `model`: `v3` or `v2`), `leadIn` (s of silence before beat 1), `endHold` (s after the last word).

Per beat:

| Field | Meaning |
|---|---|
| `id` | Short name; takes are saved as `<id>_<model>_tN.mp3` |
| `type` | Tone-palette beat type (VOICE_GUIDE §2): `hook problem insight explain term caveat java takeaway done teaser`. Sets the gap before the beat: 0.6 s for `insight`/`term`, 0.15 s for `done`, else 0.25 s |
| `text` | What is said, plain — the caption text and the reference Whisper is checked against |
| `v3` | `{ text (with [tags]), stability }` |
| `v2` | `{ text (with <break>), stability, style, speed ≥ 0.85 }` |
| `seed` | Filled in by `voice.mjs --pick` so a take can be regenerated |
| `chosen` | Take to use, relative to `public/` — set with `voice.mjs --pick` |
| `gapBefore` | Optional override of the gap rule (s) |
| `holdAfter` | Optional extra silence after the beat (s), e.g. to let a visual land |

## `generated/` (don't edit)

`master.json` (beat timestamps) → `whisper.json` + `captions.json` → `timeline.json` (what the video reads) → `thumbnail.json`.
