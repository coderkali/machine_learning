// Caption box fed by Whisper-timed pages (scripts/captions.mjs). Anchored to the bottom of the
// safe zone and grows upward, so it can never drop into the Reels/Shorts UI strip.
import layout from "./layout.json";
import { C, FONT_UI } from "./theme";
import type { CaptionPage } from "./types";

const L = layout.caption;

export function CaptionBox({ pages, frame }: { pages: CaptionPage[]; frame: number }) {
  const page = pages.find((p) => frame >= p.startFrame && frame < p.endFrame);
  if (!page) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: L.left,
        width: L.width,
        bottom: layout.canvas.height - L.bottom,
        boxSizing: "border-box",
        padding: `${L.paddingY}px ${L.paddingX}px`,
        border: "1px solid #33435C",
        borderRadius: 26,
        background: "rgba(17,28,47,.97)",
        color: C.white,
        fontFamily: FONT_UI,
        fontSize: L.fontSize,
        fontWeight: 600,
        lineHeight: L.lineHeight,
        textAlign: "center",
      }}
    >
      {page.words.map((w, i) => (
        <span key={i} style={{ color: frame >= w.startFrame && frame < w.endFrame ? C.gold : C.white }}>
          {i > 0 ? " " : ""}
          {w.text}
        </span>
      ))}
    </div>
  );
}
