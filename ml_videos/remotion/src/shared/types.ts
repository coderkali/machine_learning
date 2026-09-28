// Data contracts between the scripts (scripts/*.mjs) and the Remotion compositions.
export type BeatType =
  | "hook"
  | "problem"
  | "insight"
  | "explain"
  | "term"
  | "caveat"
  | "java"
  | "takeaway"
  | "done"
  | "teaser";

export type CaptionWord = {
  text: string;
  beatId: string;
  startFrame: number;
  endFrame: number;
};

export type CaptionPage = {
  text: string;
  startFrame: number;
  endFrame: number;
  words: CaptionWord[];
};

export type TimelineBeat = {
  id: string;
  type: BeatType;
  from: number;
  durationInFrames: number;
  speechFrom: number;
  speechTo: number;
};

/** Written by scripts/timeline.mjs to src/episodes/day_NN/generated/timeline.json. */
export type Timeline = {
  day: number;
  fps: number;
  totalFrames: number;
  audio: string;
  music: string | null;
  beats: TimelineBeat[];
  captions: CaptionPage[];
};

/** Thumbnail headline box (§5b): exactly one "red" block per episode. */
export type HeadBlock = { text: string; style: "black" | "yellow" | "red" | "white" };

export type ChipFill = "white" | "yellow" | "green" | "red" | "blue" | "black";
/** "+" and "->" are connectors; "@computer", "@mail", "@model", "@chart", "@table", "@code",
 *  "@python", "@java", "@check", "@cross" are icons; anything else is a text chip. */
export type DiagramItem = string | { label: string; fill?: ChipFill };
export type DiagramRow = { title: string; tone?: "good" | "bad" | "neutral"; items: DiagramItem[] };

/** src/episodes/day_NN/episode.json */
export type EpisodeMeta = {
  day: number;
  slug: string;
  title: string;
  topic: string;
  /** Header badge instead of "DAY N" (e.g. the un-numbered intro: "START HERE"). */
  badge?: string;
  next: { day: number; title: string };
  /** Chapter bar (context-first rule): which beat starts which chapter. */
  chapters?: { beat: string; label: string }[];
  /** Title card for frames 0–90: the topic, said and shown first. */
  titleCard?: { line: string; sub?: string };
  thumbnail: {
    blocks: HeadBlock[];
    diagram: { source: string; rows: DiagramRow[] };
  };
};
