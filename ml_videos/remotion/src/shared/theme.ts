// Shared palette for every "ML for Java Developers" episode.
// Video palette = the dark navy look from Day 1. Thumbnail colours live in src/series/Thumbnail.tsx (§5b).
import { COLORS, FONT_BOLD, FONT_UI } from "../theme";
import layout from "./layout.json";

export const C = {
  bg: COLORS.bg,
  panel: "#111C2F",
  panel2: "#17243A",
  blue: COLORS.blue,
  gold: COLORS.yellow,
  red: COLORS.red,
  white: COLORS.textMain,
  muted: COLORS.textDim,
  green: "#54D6A0",
  line: "#293A53",
};

export const FONT_HEAD = FONT_BOLD;
export { FONT_BOLD, FONT_UI };

export const W = layout.canvas.width;
export const H = layout.canvas.height;
export const FPS = layout.canvas.fps;
export const SERIES_NAME = "ML FOR JAVA DEVELOPERS";
