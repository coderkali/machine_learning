// DAF "pinned table" layout (Kali, 2026-10-05): the real data table stays at the TOP of the stage the whole video,
// one new column per idea; the explanation for the current sentence animates in the zone BELOW it.
// All text is HTML (SVG <text> shakes in renders).
import React from "react";
import { enter, pop } from "../anim";
import { K } from "../explainer/kit";
import { DoubtCard } from "./Cast";

/** Bottom zone of the stage (below the pinned table). y = 500 … 1000 in stage content coordinates. */
export const ZONE_Y = 500;

export function Zone({ show, children }: { show: number; children: React.ReactNode }) {
  if (show <= 0) return null;
  return <div style={{ position: "absolute", left: 0, top: ZONE_Y, width: 1000, height: 514, opacity: show }}>{children}</div>;
}

/** Title strip above the pinned table. */
export function TableTitle({ f, at, text, color = K.ink }: { f: number; at: number; text: string; color?: string }) {
  return (
    <div style={{ position: "absolute", left: 20, top: 8, ...pop(f, at) }}>
      <span style={{ display: "inline-block", background: color, color: "#fff", fontWeight: 900, fontSize: 26, padding: "6px 16px", borderRadius: 10 }}>{text}</span>
    </div>
  );
}

/** Divider between the pinned table and the zone. */
export const Divider = () => <div style={{ position: "absolute", left: 20, right: 20, top: ZONE_Y - 18, borderTop: `4px dashed ${K.line}` }} />;

/** Rishi's doubt card, moved down so it never covers the pinned table. */
export function DoubtLow(props: React.ComponentProps<typeof DoubtCard>) {
  return <div style={{ position: "absolute", inset: 0, transform: "translateY(330px)" }}><DoubtCard {...props} /></div>;
}

export function Clock({ f, h = 18, size = 150 }: { f: number; h?: number; size?: number }) {
  const hr = ((h % 12) / 12) * 360;
  return (
    <div style={{ position: "relative", width: size, height: size, borderRadius: size, background: "#fff", border: `6px solid ${K.ink}`, boxShadow: `6px 6px 0 ${K.ink}` }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 8, height: size * 0.28, background: K.ink, borderRadius: 4, transformOrigin: "50% 100%", transform: `translate(-50%,-100%) rotate(${hr}deg)` }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 5, height: size * 0.4, background: K.red, borderRadius: 3, transformOrigin: "50% 100%", transform: `translate(-50%,-100%) rotate(${(f * 3) % 360}deg)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: -46, textAlign: "center", fontFamily: K.head, fontSize: 38 }}>{String(h).padStart(2, "0")}:00</div>
    </div>
  );
}

/** Big one-line statement for the zone. */
export function Big({ f, at, text, color = K.ink, size = 56, style }: { f: number; at: number; text: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", ...pop(f, at), ...style }}>
      <div style={{ fontFamily: K.head, fontSize: size, lineHeight: 1.08, color: "#fff", background: color, border: `5px solid ${K.ink}`, borderRadius: 16, padding: "12px 22px", boxShadow: `7px 7px 0 ${K.ink}` }}>{text}</div>
    </div>
  );
}

/** Numbered takeaways for the recall beat. */
export function Takeaways({ f, items }: { f: number; items: [string, number, string][] }) {
  return (
    <>
      {items.map(([t, a, col], i) => (
        <div key={t} style={{ position: "absolute", left: 30, top: 20 + i * 120, ...pop(f, a) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span style={{ width: 70, height: 70, borderRadius: 35, background: col, color: "#fff", display: "grid", placeItems: "center", fontFamily: K.head, fontSize: 42, border: `4px solid ${K.ink}` }}>{i + 1}</span>
            <span style={{ fontWeight: 900, fontSize: 40, transform: `translateX(${12 * (1 - enter(f, a, 10))}px)` }}>{t}</span>
          </div>
        </div>
      ))}
    </>
  );
}
