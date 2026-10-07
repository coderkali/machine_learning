# claude/ — Claude's working folder

Everything Claude writes for the **ML for Java Developers** series lives here: plans, guides, memory
and per-episode scripts. Codex keeps its own notes separately (`ml_videos/CODEX_MEMORY.md`); this
folder does not edit or depend on them.

| File | What it is |
|---|---|
| `CLAUDE_MEMORY.md` | One-page brief: rules, status, next step. **Read this first in every new chat.** |
| `HISTORY.md` | Full history of decisions and past work (archive; read only when needed). |
| `skills/make-episode/SKILL.md` | The one-prompt procedure: "make Day N" → finished video, thumbnail, QA. |
| `SERIES_ROADMAP.md` | **Locked** 84-day episode order, fixed rules, thumbnail spec (§5b), script prompt. |
| `VOICE_GUIDE.md` | **Locked** voice rules and tone palette (emotion tags for eleven_v3). |
| `SCRIPT_MOMENTS_GUIDE.md` | **Every script:** ≥ 3 of 6 "interesting moments" (make it talk, viewer computes, extremes, wow fact, Java contrast, imagine), each with its animation. |
| `ANIMATION_GUIDE.md` | The "animated technical explainer" rules: context first, word-cued motion, timings. |
| `PRODUCTION_PLAN.md` | Pipeline decisions and the per-episode production loop. |
| `episodes/day_NN/` | Per-episode scripts: `voiceover_sheet_v2.md` (current Day 1 script). |

## Where things live in `ml_videos/`

| Folder | Contents | Owner |
|---|---|---|
| `claude/` | Notes, guides, skill, scripts (this folder) | Claude |
| `remotion/src/episodes/day_NN/` | Episode data (`voice.json`, `episode.json`) + scene code (`DayNN.tsx`) + `generated/` | Claude |
| `remotion/src/shared/`, `remotion/src/series/` | Explainer kit, mascot, thumbnail, compositions | Claude |
| `remotion/scripts/` | `voice`, `autopick`, `master`, `captions`, `timeline`, `render`, `thumb`, `qa`, `find-voices` | Claude (the `*day01*` scripts are Codex's) |
| `remotion/public/day_NN/` | Voice takes (`takes/`) and the current mix (`mix/`) | Claude |
| `remotion/out/day_NN/` | **Finished deliverables:** `episode.mp4`, `thumbnail.png`, QA + take reports | Claude |
| `~/Documents/Instagram_Youtube_Reels/DayN/` | **Approved videos ready to post** (copied by `npm run publish day_NN`) | Creator |
| `_backup/<date>/` | Superseded files, with the original paths kept; see its `README.md` | Claude |
| `episodes/`, `remotion/src/day01/`, `remotion/src/visual-lda/`, `remotion/public/day01/`, `media/`, `style.py`, `CODEX_MEMORY.md` | Earlier work | Codex, don't touch |
