// DAF full-height stage (Kali, 2026-10-05: "use the entire window"). The window runs from under the chapter bar
// to just above the caption, and the caption sits at the bottom of the Reels/Shorts safe zone (layout.json safeZone.bottom).
// Content area: STAGE.w × STAGE.h. All text is HTML (SVG <text> shakes in renders).
import React from "react";
import { enter } from "../anim";
import { K, useTimeline } from "../explainer/kit";
import layout from "../layout.json";

export const STAGE = { x: 40, y: 336, w: 1000, h: 1070, chrome: 56 };
export const CW = STAGE.w; // content width
export const CH = STAGE.h - STAGE.chrome; // content height (1014)

export function Stage({ f, tab, children }: { f: number; tab: React.ReactNode; children: React.ReactNode }) {
  const win = enter(f, 0, 7);
  return (
    <div style={{ position: "absolute", left: STAGE.x, top: STAGE.y, width: STAGE.w, height: STAGE.h, background: "#fff", borderRadius: 24, border: `3px solid ${K.line}`, boxShadow: "0 18px 50px rgba(20,40,70,.12)", overflow: "hidden", opacity: win, transform: `scale(${0.94 + 0.06 * win})` }}>
      <div style={{ height: STAGE.chrome, background: K.panel, borderBottom: `2px solid ${K.line}`, display: "flex", alignItems: "center", padding: "0 22px", gap: 10 }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <span key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />)}
        <div style={{ marginLeft: 26, fontWeight: 900, fontSize: 22, color: K.ink }}>{tab}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: STAGE.chrome, bottom: 0 }}>{children}</div>
    </div>
  );
}

/** Caption under the stage, bottom-anchored at the safe-zone bottom. */
export function StageCaption({ f }: { f: number }) {
  const timeline = useTimeline();
  const page = timeline.captions.find((p) => f >= p.startFrame && f < p.endFrame);
  if (!page) return null;
  const t = enter(f, page.startFrame, 5);
  const L = layout.caption;
  return (
    <div style={{ position: "absolute", left: 90, width: 900, bottom: layout.canvas.height - layout.safeZone.bottom, display: "flex", justifyContent: "center" }}>
      <div style={{ background: K.ink, color: "#fff", borderRadius: 18, padding: `${L.paddingY - 4}px ${L.paddingX}px`, fontFamily: K.ui, fontSize: 38, fontWeight: 800, textAlign: "center", lineHeight: 1.15, opacity: t, transform: `translateY(${10 * (1 - t)}px)` }}>
        {page.words.map((w, i) => (
          <span key={i} style={{ color: f >= w.startFrame && f < w.endFrame ? K.yellow : "#fff" }}>{(i ? " " : "") + w.text}</span>
        ))}
      </div>
    </div>
  );
}
