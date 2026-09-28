// Entry for the reusable series pipeline (Day 2+ and Day 1 v3). Day 1's original compositions
// stay in src/day01/entry.tsx; LDA stays in src/visual-lda/entry.tsx.
import { registerRoot } from "remotion";
import { SeriesRoot } from "./series/Root";

registerRoot(SeriesRoot);
