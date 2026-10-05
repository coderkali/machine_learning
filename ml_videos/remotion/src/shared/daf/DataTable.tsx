// DAF data-first table: the learner always sees the real rows. Big mono cells, columns that fill in,
// rows that highlight, strike or drop. All text is HTML (SVG <text> shakes in renders).
import React from "react";
import { draw, enter, pop } from "../anim";
import { K } from "../explainer/kit";
import { Strike } from "./ui";

export type Col = { key: string; label: React.ReactNode; w: number; color?: string; at?: number; fill?: (row: number) => number };
export type Cell = string | number | null;

/**
 * cols[i].at = frame the column header appears; cols[i].fill(r) = frame the cell in row r fills (default: with the header).
 * rowAt(r) = frame row r enters · hi(r) = highlight colour or null · strikeAt(r) = frame the row is crossed out.
 */
export function DataTable({ f, cols, rows, rowAt, hi, strikeAt, fmt, size = 30, rowH = 62, style }: {
  f: number; cols: Col[]; rows: Cell[][]; rowAt: (r: number) => number; hi?: (r: number) => string | null; strikeAt?: (r: number) => number;
  fmt?: (v: Cell, c: number, r: number) => React.ReactNode; size?: number; rowH?: number; style?: React.CSSProperties;
}) {
  return (
    <div style={{ position: "absolute", borderRadius: 16, border: `5px solid ${K.ink}`, background: "#fff", overflow: "hidden", boxShadow: `8px 8px 0 ${K.ink}`, ...style }}>
      <div style={{ display: "flex", background: K.ink }}>
        {cols.map((c) => (
          <div key={c.key} style={{ width: c.w, padding: "10px 12px", boxSizing: "border-box", color: "#fff", fontWeight: 900, fontSize: size * 0.68, lineHeight: 1.1, background: c.color ?? K.ink, opacity: enter(f, c.at ?? -99, 8) }}>{c.label}</div>
        ))}
      </div>
      {rows.map((row, r) => {
        const h = hi?.(r) ?? null;
        const s = strikeAt?.(r) ?? Infinity;
        const gone = enter(f, s + 14, 10);
        return (
          <div key={r} style={{ position: "relative", display: "flex", height: rowH * (1 - 0.0 * gone), alignItems: "center", borderTop: `3px solid ${K.line}`, background: f >= s ? "#FFEBEE" : h ?? "#fff", opacity: (f >= rowAt(r) ? 1 : 0) * (1 - 0.55 * gone), transform: `translateX(${40 * (1 - enter(f, rowAt(r), 8))}px)` }}>
            {row.map((v, c) => {
              const col = cols[c];
              const at = col.fill ? col.fill(r) : col.at ?? -99;
              return (
                <div key={c} style={{ width: col.w, padding: "0 12px", boxSizing: "border-box", fontFamily: K.mono, fontWeight: 900, fontSize: size, whiteSpace: "nowrap" }}>
                  <span style={{ display: "inline-block", ...pop(f, at) }}>{fmt ? fmt(v, c, r) : v ?? "—"}</span>
                </div>
              );
            })}
            {s < Infinity && <div style={{ position: "absolute", left: 10, right: 10, top: "50%" }}><Strike p={draw(f, s)} /></div>}
          </div>
        );
      })}
    </div>
  );
}

/** A colour for a PM2.5 value: orange from the Poor line (91) up. */
export const pmColor = (v: number | null) => (v == null ? K.muted : v >= 91 ? "#E65100" : K.ink);
