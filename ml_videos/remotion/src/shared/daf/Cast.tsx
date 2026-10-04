// Delhi Air Forecast (DAF) series cast — claude/daf/UNIVERSE.md.
// Asha madam (shown, never speaks), Rishi the Java developer (asks one doubt on a yellow card),
// grey silhouettes for "who is coming", and the cast name card.
import React from "react";
import { enter, pop } from "../anim";
import { K } from "../explainer/kit";

const SKIN = "#C68B59";
const SKIN_DARK = "#A8703F";
const HAIR = "#1F1A17";
const o = { stroke: K.ink, strokeWidth: 5, strokeLinejoin: "round" as const };

function Mouth({ x, y, open }: { x: number; y: number; open: number }) {
  const m = Math.max(0, Math.min(1, open));
  return m < 0.08 ? (
    <path d={`M${x - 14} ${y} Q${x} ${y + 12} ${x + 14} ${y}`} fill="none" stroke={K.ink} strokeWidth={5} strokeLinecap="round" />
  ) : (
    <ellipse cx={x} cy={y + 4} rx={12} ry={4 + 10 * m} fill="#5A1E1E" stroke={K.ink} strokeWidth={4} />
  );
}

/** Asha madam: school principal in a teal saree, specs and a bun, holding the attendance register. */
export function Asha({ height = 400, style }: { height?: number; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 300 620" width={(height * 300) / 620} height={height} style={{ overflow: "visible", ...style }}>
      <path d="M92 300 L208 300 L246 600 L54 600 Z" fill="#0E9F8E" {...o} />
      <path d="M60 572 L240 572 L246 600 L54 600 Z" fill="#F2B705" {...o} />
      <path d="M98 188 Q150 172 202 188 L212 312 L88 312 Z" fill="#C2185B" {...o} />
      <path d="M196 184 L118 330 L90 306 L168 178 Z" fill="#14B8A6" {...o} />
      <path d="M118 330 L90 306" stroke="#F2B705" strokeWidth={9} />
      <path d="M100 200 Q70 250 92 300 L140 292" fill="none" stroke={SKIN} strokeWidth={26} strokeLinecap="round" />
      <path d="M200 200 Q228 250 210 300 L162 292" fill="none" stroke={SKIN} strokeWidth={26} strokeLinecap="round" />
      <rect x={112} y={262} width={78} height={56} rx={6} fill="#1E3A8A" {...o} />
      <path d="M151 262 L151 318" stroke="#fff" strokeWidth={3} />
      <rect x={136} y={160} width={28} height={30} fill={SKIN} {...o} />
      <circle cx={196} cy={100} r={28} fill={HAIR} {...o} />
      <circle cx={150} cy={122} r={52} fill={SKIN} {...o} />
      <path d="M98 120 Q100 64 150 64 Q204 64 202 120 Q186 92 150 90 Q118 92 98 120 Z" fill={HAIR} {...o} />
      <circle cx={150} cy={104} r={5} fill={K.red} />
      <circle cx={131} cy={126} r={14} fill="none" stroke={K.ink} strokeWidth={4} />
      <circle cx={169} cy={126} r={14} fill="none" stroke={K.ink} strokeWidth={4} />
      <path d="M145 126 L155 126" stroke={K.ink} strokeWidth={4} />
      <circle cx={131} cy={127} r={4} fill={K.ink} />
      <circle cx={169} cy={127} r={4} fill={K.ink} />
      <Mouth x={150} y={150} open={0} />
    </svg>
  );
}

/** Rishi: young Java developer in a blue shirt with an ID badge, glasses and a laptop. */
export function Rishi({ height = 400, mouth = 0, style }: { height?: number; mouth?: number; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 300 620" width={(height * 300) / 620} height={height} style={{ overflow: "visible", ...style }}>
      <path d="M100 380 L146 380 L142 590 L104 590 Z" fill="#2B4C7E" {...o} />
      <path d="M154 380 L200 380 L196 590 L158 590 Z" fill="#2B4C7E" {...o} />
      <path d="M90 590 L146 590 L148 612 L84 612 Z M154 590 L210 590 L216 612 L152 612 Z" fill="#fff" {...o} />
      <path d="M92 196 Q150 178 208 196 L218 392 L82 392 Z" fill="#3B82F6" {...o} />
      {[120, 150, 180].map((x) => <path key={x} d={`M${x} 196 L${x} 392`} stroke="#2563EB" strokeWidth={4} />)}
      {[240, 290, 340].map((y) => <path key={y} d={`M88 ${y} L212 ${y}`} stroke="#2563EB" strokeWidth={4} />)}
      <path d="M128 192 L150 232 L172 192" fill="#fff" {...o} />
      <path d="M150 232 L130 300" stroke={K.red} strokeWidth={5} />
      <rect x={112} y={296} width={34} height={44} rx={4} fill="#fff" {...o} />
      <path d="M96 210 Q66 270 104 318" fill="none" stroke="#3B82F6" strokeWidth={30} strokeLinecap="round" />
      <path d="M204 210 Q234 270 196 318" fill="none" stroke="#3B82F6" strokeWidth={30} strokeLinecap="round" />
      <path d="M78 318 L222 318 L236 372 L64 372 Z" fill="#9AA6B6" {...o} />
      <path d="M86 300 L214 300 L222 318 L78 318 Z" fill="#CBD5E1" {...o} />
      {/* "{ }" drawn as paths (SVG <text> jitters between frames in parallel renders) */}
      <path d="M140 334 Q132 334 132 341 L132 347 Q132 352 127 352 Q132 352 132 357 L132 363 Q132 370 140 370 M160 334 Q168 334 168 341 L168 347 Q168 352 173 352 Q168 352 168 357 L168 363 Q168 370 160 370" fill="none" stroke={K.ink} strokeWidth={5} strokeLinecap="round" />
      <rect x={136} y={164} width={28} height={30} fill={SKIN} {...o} />
      <circle cx={150} cy={118} r={50} fill={SKIN} {...o} />
      <path d="M104 128 Q122 168 150 170 Q178 168 196 128 Q190 160 150 172 Q110 160 104 128 Z" fill={SKIN_DARK} />
      <path d="M100 112 Q96 60 140 56 L150 44 L160 58 Q206 58 200 112 Q190 84 150 84 Q112 84 100 112 Z" fill={HAIR} {...o} />
      <rect x={114} y={108} width={30} height={22} rx={5} fill="rgba(255,255,255,.4)" stroke={K.ink} strokeWidth={4} />
      <rect x={156} y={108} width={30} height={22} rx={5} fill="rgba(255,255,255,.4)" stroke={K.ink} strokeWidth={4} />
      <path d="M144 118 L156 118" stroke={K.ink} strokeWidth={4} />
      <circle cx={129} cy={120} r={4} fill={K.ink} />
      <circle cx={171} cy={120} r={4} fill={K.ink} />
      <Mouth x={150} y={146} open={mouth} />
    </svg>
  );
}

/** A grey "someone is coming" figure. `walk` 0..1 adds a step bob. */
export function Silhouette({ height = 360, walk = 0, label, style }: { height?: number; walk?: number; label?: string; style?: React.CSSProperties }) {
  const bob = Math.sin(walk * Math.PI * 6) * 6;
  const k = height / 620;
  return (
    <div style={{ position: "relative", width: 300 * k, height, ...style }}>
    <svg viewBox="0 0 300 620" width={300 * k} height={height} style={{ overflow: "visible" }}>
      <g transform={`translate(0 ${bob})`} fill="#B8C2CF">
        <circle cx={150} cy={118} r={52} />
        <path d="M86 200 Q150 176 214 200 L224 400 L76 400 Z" />
        <path d="M100 400 L146 400 L142 600 L104 600 Z M154 400 L200 400 L196 600 L158 600 Z" />
      </g>
    </svg>
      {label && <div style={{ position: "absolute", left: 0, width: 300 * k, top: (118 + bob - 34) * k, textAlign: "center", fontFamily: K.head, fontSize: 64 * k, lineHeight: 1, color: "#fff" }}>{label}</div>}
    </div>
  );
}

/** Cast name card under a character: big name + a role line that can arrive later. */
export function CastCard({ f, at, roleAt, name, role, color }: { f: number; at: number; roleAt: number; name: string; role: string; color: string }) {
  return (
    <div style={{ ...pop(f, at), display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ fontFamily: K.head, fontSize: 40, color: "#fff", background: color, border: `4px solid ${K.ink}`, padding: "0 16px", whiteSpace: "nowrap", boxShadow: `5px 5px 0 ${K.ink}` }}>{name}</div>
      <div style={{ ...pop(f, roleAt), fontFamily: K.ui, fontWeight: 800, fontSize: 22, color: K.ink, background: "#fff", border: `3px solid ${K.ink}`, borderRadius: 999, padding: "2px 14px", whiteSpace: "nowrap" }}>{role}</div>
    </div>
  );
}

/** Rishi's doubt: a yellow card that slides up while he speaks, then leaves. */
export function DoubtCard({ f, from, to, label = "✋ RISHI'S DOUBT", text, mouth }: { f: number; from: number; to: number; label?: string; text: string; mouth: number }) {
  if (f < from || f >= to + 8) return null;
  const inT = enter(f, from, 8);
  const out = enter(f, to, 8);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 640, height: 420, opacity: 1 - out, transform: `translateY(${120 * (1 - inT) + 80 * out + 6 * Math.sin((f - from) / 6)}px) rotate(${-1.5 + 0.8 * Math.sin((f - from) / 9)}deg)`, background: K.yellow, border: `6px solid ${K.ink}`, borderRadius: 26, boxShadow: `12px 12px 0 ${K.ink}`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 18, bottom: -150 }}><Rishi height={520} mouth={mouth} /></div>
      <div style={{ position: "absolute", left: 300, right: 30, top: 34, display: "flex", flexDirection: "column", gap: 22 }}>
        <span style={{ alignSelf: "flex-start", fontFamily: K.head, fontSize: 40, color: "#fff", background: K.ink, padding: "2px 16px", borderRadius: 10, transform: `rotate(${4 * Math.sin((f - from) / 4)}deg)` }}>{label}</span>
        <span style={{ fontFamily: K.ui, fontWeight: 900, fontSize: 46, lineHeight: 1.18, color: K.ink }}>{text}</span>
      </div>
    </div>
  );
}
