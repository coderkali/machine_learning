// DAF motion kit v2 (2026-10-06, DAF-04 onward): the same look as the approved pinned-table template, with better motion.
// - spring physics instead of fixed cubic eases (natural settle, small overshoot)
// - blur-in entrances, "push" transitions between zone ideas
// - row spotlight in the pinned table (focus row lifts, others dim), columns that grow open
// - count-up numbers, speech bubbles that type, hand-drawn circles/underlines, bursts, a gentle camera push
// - kinetic captions: the spoken word pops on a yellow pill
// All text is HTML (SVG <text> shakes in renders); SVG is used only for strokes.
import React from "react";
import { interpolate, spring } from "remotion";
import { K, useTimeline } from "../explainer/kit";
import layout from "../layout.json";

const FPS = 30;
const C = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Spring progress 0 → 1 (with overshoot) starting at frame `at`. */
export const sp = (f: number, at: number, cfg: { damping?: number; stiffness?: number; mass?: number } = {}) =>
  !Number.isFinite(at) || f < at ? 0 : spring({ frame: f - at, fps: FPS, config: { damping: 13, stiffness: 160, mass: 0.7, ...cfg } });

/** Smooth 0 → 1 with no overshoot. */
export const sm = (f: number, at: number, span = 12) => (!Number.isFinite(at) ? 0 : spring({ frame: f - at, fps: FPS, config: { damping: 200 }, durationInFrames: span }));

/** Entrance: spring scale + rise + blur-in. */
export function rise(f: number, at: number, opts: { y?: number; blur?: number; scale?: number } = {}): React.CSSProperties {
  const { y = 26, blur = 8, scale = 0.86 } = opts;
  const p = sp(f, at);
  const q = sm(f, at, 10);
  if (q <= 0) return { opacity: 0 };
  return { opacity: Math.min(1, q * 1.4), transform: `translateY(${y * (1 - p)}px) scale(${scale + (1 - scale) * p})`, filter: q < 0.98 ? `blur(${blur * (1 - q)}px)` : undefined };
}

/** Exit: slide up + fade + blur (used by Push). */
const leave = (f: number, at: number): React.CSSProperties => {
  const q = sm(f, at, 9);
  return q <= 0 ? {} : { opacity: 1 - q, transform: `translateY(${-40 * q}px)`, filter: `blur(${6 * q}px)` };
};

/** One idea in the zone below the table: pushes in from below on `from`, pushes out upward on `to`. */
export function Push({ f, from, to, children, top = 500 }: { f: number; from: number; to: number; children: React.ReactNode; top?: number }) {
  if (!Number.isFinite(from) || f < from || f > to + 10) return null;
  const p = sm(f, from, 12);
  const out = leave(f, to);
  return (
    <div style={{ position: "absolute", left: 0, top, width: 1000, height: 514, opacity: p * ((out.opacity as number) ?? 1), transform: `translateY(${60 * (1 - p)}px) ${out.transform ?? ""}`, filter: out.filter ?? (p < 0.98 ? `blur(${6 * (1 - p)}px)` : undefined) }}>
      {children}
    </div>
  );
}

/** Animated number: counts from `from` to `to` between frames at … at+dur (ease-out). */
export function Count({ f, at, to, from = 0, dur = 24, fmt = (v: number) => Math.round(v).toLocaleString("en-US") }: { f: number; at: number; to: number; from?: number; dur?: number; fmt?: (v: number) => string }) {
  const p = Number.isFinite(at) ? interpolate(f, [at, at + dur], [0, 1], C) : 0;
  const e = 1 - Math.pow(1 - p, 3);
  return <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(from + (to - from) * e)}</span>;
}

/** Speech bubble for "make it talk" (M1): pops, then types its text. */
export function Bubble({ f, at, text, tail = "left", color = "#fff", size = 34, style }: { f: number; at: number; text: string; tail?: "left" | "right" | "up"; color?: string; size?: number; style?: React.CSSProperties }) {
  const n = Number.isFinite(at) ? Math.floor(interpolate(f, [at + 4, at + 4 + text.length * 0.9], [0, text.length], C)) : 0;
  const tailStyle: React.CSSProperties =
    tail === "up" ? { left: 40, top: -26, borderLeft: "16px solid transparent", borderRight: "16px solid transparent", borderBottom: `26px solid ${K.ink}` }
      : { [tail]: 36, bottom: -26, borderLeft: "16px solid transparent", borderRight: "16px solid transparent", borderTop: `26px solid ${K.ink}` };
  return (
    <div style={{ position: "absolute", transformOrigin: tail === "right" ? "90% 100%" : "10% 100%", ...rise(f, at, { y: 14, blur: 4, scale: 0.6 }), ...style }}>
      <div style={{ position: "relative", background: color, border: `5px solid ${K.ink}`, borderRadius: 22, padding: "12px 22px", boxShadow: `6px 6px 0 ${K.ink}`, fontFamily: K.ui, fontWeight: 900, fontSize: size, lineHeight: 1.15, color: K.ink, whiteSpace: "nowrap" }}>
        <span>{text.slice(0, n)}</span>
        <span style={{ opacity: 0 }}>{text.slice(n)}</span>
        <div style={{ position: "absolute", width: 0, height: 0, ...tailStyle }} />
      </div>
    </div>
  );
}

/** Hand-drawn ellipse around a box (left/top/width/height in the parent's coordinates). */
export function Ring({ f, at, left, top, width, height, color = K.red, stroke = 7 }: { f: number; at: number; left: number; top: number; width: number; height: number; color?: string; stroke?: number }) {
  const p = Number.isFinite(at) ? interpolate(f, [at, at + 14], [0, 1], { ...C, easing: (x) => 1 - Math.pow(1 - x, 2) }) : 0;
  if (p <= 0) return null;
  const w = width, h = height, pad = 14;
  // one and a bit turns of a slightly wobbly ellipse
  const pts: string[] = [];
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * Math.PI * 2.15 - 0.6;
    const r = 1 + 0.035 * Math.sin(i * 1.7);
    pts.push(`${i ? "L" : "M"}${(w / 2 + pad) + (w / 2 + pad - 4) * r * Math.cos(a)} ${(h / 2 + pad) + (h / 2 + pad - 4) * r * Math.sin(a)}`);
  }
  const d = pts.join(" ");
  return (
    <svg width={w + pad * 2} height={h + pad * 2} style={{ position: "absolute", left: left - pad, top: top - pad, overflow: "visible", pointerEvents: "none" }}>
      <path d={d} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
    </svg>
  );
}

/** Hand-drawn underline. */
export function Underline({ f, at, left, top, width, color = K.yellow, stroke = 10 }: { f: number; at: number; left: number; top: number; width: number; color?: string; stroke?: number }) {
  const p = Number.isFinite(at) ? interpolate(f, [at, at + 10], [0, 1], C) : 0;
  if (p <= 0) return null;
  return (
    <svg width={width} height={30} style={{ position: "absolute", left, top, overflow: "visible" }}>
      <path d={`M4 18 Q ${width * 0.3} 6 ${width * 0.55} 16 T ${width - 4} 12`} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
    </svg>
  );
}

/** Little radial burst behind a reveal (✓, a big number). */
export function Burst({ f, at, x, y, color = K.yellow, r = 90, n = 12 }: { f: number; at: number; x: number; y: number; color?: string; r?: number; n?: number }) {
  if (!Number.isFinite(at) || f < at || f > at + 22) return null;
  const p = interpolate(f, [at, at + 22], [0, 1], C);
  return (
    <svg width={r * 3} height={r * 3} style={{ position: "absolute", left: x - r * 1.5, top: y - r * 1.5, overflow: "visible", pointerEvents: "none" }}>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        const r0 = r * (0.45 + 0.7 * p), r1 = r * (0.6 + 0.9 * p);
        return <line key={i} x1={r * 1.5 + r0 * Math.cos(a)} y1={r * 1.5 + r0 * Math.sin(a)} x2={r * 1.5 + r1 * Math.cos(a)} y2={r * 1.5 + r1 * Math.sin(a)} stroke={color} strokeWidth={8 * (1 - p) + 1} strokeLinecap="round" opacity={1 - p} />;
      })}
    </svg>
  );
}

/** Gentle camera: a slow push-in during [from, to), plus a one-off shake at `kick` (for "wait, really?"). */
export function camera(f: number, pushes: [number, number][], kick: number[] = []): React.CSSProperties {
  let s = 1;
  for (const [a, b] of pushes) {
    if (!Number.isFinite(a)) continue;
    const inP = interpolate(f, [a, a + 40], [0, 1], C), outP = Number.isFinite(b) ? interpolate(f, [b, b + 14], [0, 1], C) : 0;
    s += 0.035 * inP * (1 - outP);
  }
  let dx = 0, dy = 0;
  for (const k of kick) {
    if (!Number.isFinite(k) || f < k || f > k + 12) continue;
    const t = (f - k) / 12;
    dx += 9 * (1 - t) * Math.sin(f * 2.3);
    dy += 6 * (1 - t) * Math.cos(f * 2.9);
  }
  return { transform: `translate(${dx}px, ${dy}px) scale(${s})`, transformOrigin: "50% 40%" };
}

// ── Pinned table v2 ────────────────────────────────────────────────────────────────────────────────
export type Col2 = { key: string; label: React.ReactNode; w: number; color?: string; at?: number; fill?: (row: number) => number };
export type Cell2 = React.ReactNode;

/**
 * Like DataTable, with motion: a column GROWS open when it appears (width springs from 0), its header drops in,
 * each cell flips in on fill(r); focus(r) lifts one row (glow bar, others dim); hi(r) tints a row; strikeAt(r) crosses it.
 */
export function Table2({ f, cols, rows, rowAt, focus, hi, fmt, size = 30, rowH = 62, hdrH = 64, style }: {
  f: number; cols: Col2[]; rows: Cell2[][]; rowAt: (r: number) => number; focus?: (r: number) => boolean; hi?: (r: number) => string | null;
  fmt?: (v: Cell2, c: number, r: number) => React.ReactNode; size?: number; rowH?: number; hdrH?: number; style?: React.CSSProperties;
}) {
  const anyFocus = rows.some((_, r) => focus?.(r));
  const widths = cols.map((c) => c.w * (c.at === undefined ? 1 : sm(f, c.at, 14)));
  return (
    <div style={{ position: "absolute", borderRadius: 16, border: `5px solid ${K.ink}`, background: "#fff", overflow: "hidden", boxShadow: `8px 8px 0 ${K.ink}`, ...style }}>
      <div style={{ display: "flex", height: hdrH, background: K.ink }}>
        {cols.map((c, i) => (
          <div key={c.key} style={{ width: widths[i], flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", background: c.color ?? K.ink }}>
            <div style={{ width: c.w, padding: "10px 12px", boxSizing: "border-box", color: "#fff", fontWeight: 900, fontSize: size * 0.66, lineHeight: 1.1, ...(c.at === undefined ? {} : { transform: `translateY(${-30 * (1 - sp(f, c.at))}px)` }) }}>{c.label}</div>
          </div>
        ))}
      </div>
      {rows.map((row, r) => {
        const isF = focus?.(r) ?? false;
        const fIn = isF ? 1 : 0;
        const h = hi?.(r) ?? null;
        const shown = sm(f, rowAt(r), 10);
        return (
          <div key={r} style={{ position: "relative", display: "flex", height: rowH, boxSizing: "border-box", alignItems: "center", borderTop: `3px solid ${K.line}`, background: isF ? "#FFF8D6" : h ?? "#fff", opacity: shown * (anyFocus && !isF ? 0.42 : 1), transform: `translateX(${40 * (1 - shown)}px)` }}>
            {isF && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, background: K.yellow, boxShadow: `0 0 18px ${K.yellow}` }} />}
            {row.map((v, c) => {
              const col = cols[c];
              const at = col.fill ? col.fill(r) : col.at ?? -99;
              const p = at < 0 ? 1 : sp(f, at, { damping: 15 });
              return (
                <div key={c} style={{ width: widths[c], flexShrink: 0, overflow: "hidden", padding: 0 }}>
                  <div style={{ width: col.w, padding: "0 12px", boxSizing: "border-box", fontFamily: K.mono, fontWeight: 900, fontSize: size * (1 + 0.04 * fIn), whiteSpace: "nowrap", opacity: Math.min(1, p * 1.5), transform: `perspective(400px) rotateX(${90 * (1 - Math.min(1, p))}deg)` }}>
                    {fmt ? fmt(v, c, r) : v ?? "—"}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/** Where cell (r, c) of a Table2 sits, in the same coordinates as the table's left/top (5 px border, fixed header). */
export const cellBox = (left: number, top: number, cols: { w: number }[], r: number, c: number, rowH = 62, hdrH = 64) => ({
  left: left + 5 + cols.slice(0, c).reduce((s, x) => s + x.w, 0), top: top + 5 + hdrH + r * rowH, width: cols[c].w, height: rowH,
});

// ── Kinetic captions ───────────────────────────────────────────────────────────────────────────────
/** Caption under the stage: page springs in; the spoken word pops on a yellow pill; words not yet said are dim. */
export function KineticCaption({ f }: { f: number }) {
  const timeline = useTimeline();
  const page = timeline.captions.find((p) => f >= p.startFrame && f < p.endFrame);
  if (!page) return null;
  const p = sp(f, page.startFrame, { damping: 16, stiffness: 220 });
  const L = layout.caption;
  return (
    <div style={{ position: "absolute", left: 60, width: 960, bottom: layout.canvas.height - layout.safeZone.bottom, display: "flex", justifyContent: "center" }}>
      <div style={{ background: K.ink, color: "#fff", borderRadius: 20, padding: `${L.paddingY - 2}px ${L.paddingX}px`, fontFamily: K.ui, fontSize: 40, fontWeight: 800, textAlign: "center", lineHeight: 1.3, opacity: Math.min(1, p * 1.5), transform: `translateY(${16 * (1 - p)}px) scale(${0.94 + 0.06 * p})`, boxShadow: "0 10px 30px rgba(0,0,0,.18)" }}>
        {page.words.map((w, i) => {
          const said = f >= w.startFrame;
          const now = said && f < w.endFrame;
          const k = now ? sp(f, w.startFrame, { damping: 12, stiffness: 260 }) : 0;
          return (
            <React.Fragment key={i}>
              {i ? " " : ""}
              <span style={{ display: "inline-block", padding: "0 6px", margin: "0 -6px", borderRadius: 10, color: now ? K.ink : "#fff", background: now ? K.yellow : "transparent", opacity: said ? 1 : 0.55, transform: `scale(${1 + 0.1 * k})` }}>{w.text}</span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
