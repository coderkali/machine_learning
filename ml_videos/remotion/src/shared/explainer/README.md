# Explainer kit — how to write an episode's scenes (short version)

Full reference: `src/episodes/day_01/Day01.tsx`. Rules: `claude/ANIMATION_GUIDE.md`.

## Skeleton (`src/episodes/day_NN/DayNN.tsx`)

```tsx
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { draw, enter, pop, T } from "../../shared/anim";
import { Backdrop, CaptionPill, ChapterBar, Chip, Code, Header, K, Narrator, Row, Tab, TermCard,
  TimelineProvider, TitleCard, tilt, useCues, useTimeline, Workspace } from "../../shared/explainer/kit";
import type { EpisodeMeta, Timeline } from "../../shared/types";

export const DayNN: React.FC<{ timeline: Timeline; meta: EpisodeMeta }> = ({ timeline, meta }) => (
  <TimelineProvider value={timeline}><Scene meta={meta} /></TimelineProvider>
);

function Scene({ meta }: { meta: EpisodeMeta }) {
  const f = useCurrentFrame();
  const tl = useTimeline();
  const { at, start } = useCues();                 // at(beatId, "word|alt") → frame the word is spoken
  const c = { example: at("hook", "spam"), model: at("training", "model") /* … one per step */ };
  const chapters = (meta.chapters ?? []).map((ch) => ({ label: ch.label, from: start(ch.beat) }));
  return (
    <AbsoluteFill style={{ fontFamily: K.ui, overflow: "hidden" }}>
      <Audio src={staticFile(tl.audio)} />
      <Backdrop /><Header f={f} day={meta.day} title={meta.title} /><ChapterBar f={f} chapters={chapters} />
      <Workspace f={f} tabs={<Tab label="▦ data.csv" active />} sidebar={/* optional */ undefined}>
        {/* beat content: absolute-positioned, each element style={pop(f, c.someWord)} */}
      </Workspace>
      {f >= c.model && <TermCard text="MODEL" color={K.yellow} fg={K.ink} style={{ left: 420, top: 500, ...tilt(pop(f, c.model), -3) }} />}
      {meta.titleCard && <TitleCard f={f} line={meta.titleCard.line} sub={meta.titleCard.sub} until={c.example} />}
      <Narrator pose={/* "point" on questions/reveals/done */ "present"} />
      <CaptionPill f={f} />
    </AbsoluteFill>
  );
}
```

## Pieces

| Piece | Use |
|---|---|
| `Workspace` (+ `Tab`, `Folder`) | The stage: window with tabs and an optional sidebar. Content area ≈ 748×782 px with a sidebar, 968 without. |
| `Row` | A list row (email, file, record) with an optional badge. |
| `Chip` | A short label (≤ 4 words). `TermCard`: big tilted Impact card for a term reveal (one per term). |
| `Code` | Syntax-coloured Java/Python line (`dark` for a dark panel). Type it out with `text.slice(0, n)`. |
| `pop / enter / draw` + `T` | Entrances (0.3 s), progress 0→1, and path drawing. `T.stagger` = 4 frames between list items. |
| `TitleCard`, `ChapterBar`, `Header`, `Narrator`, `CaptionPill` | Series chrome. Always include them. |

## Checklist

- Every element starts on a word: `pop(f, at(beat, "word"))`. Long sentence → add a step on a middle word.
- Beat content shows only in its beat: `f >= start("x") && f < start("next")`.
- Register in `src/series/Root.tsx` like `Day01` (import the day's `episode.json` + `generated/timeline.json`).
- Check with one contact sheet of stills before rendering.
