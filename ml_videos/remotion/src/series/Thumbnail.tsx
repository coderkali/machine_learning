// Series thumbnail — locked spec SERIES_ROADMAP.md §5b (approved by the creator 2026-09-27).
// White background, huge condensed headline in black / yellow / red / white boxes, a concept diagram
// under it, and the original dev mascot full-height on the right. The layout never changes; each
// episode only supplies src/episodes/day_NN/episode.json → thumbnail { blocks, diagram }.
// Everything important stays inside the Instagram 3:4 grid crop (y 240–1680).
import { fitText } from "@remotion/layout-utils";
import React from "react";
import { AbsoluteFill } from "remotion";
import { DevMascot } from "../shared/DevMascot";
import { FONT_UI } from "../shared/theme";
import type { ChipFill, DiagramItem, DiagramRow, EpisodeMeta } from "../shared/types";

export const HEAD_FONT = "Impact, 'Haettenschweiler', 'Arial Narrow Bold', sans-serif";
const INK = "#111111";
const RED = "#E53935";
const YELLOW = "#FFD600";
const GREEN = "#2E9E5B";
const BLUE = "#1E88E5";

const COL_LEFT = 44;
const COL_WIDTH = 640;
const HEAD_TOP = 372;
const HEAD_BUDGET = 640;
const DIAGRAM_TOP = 1062;
const DIAGRAM_MAX_H = 420;
const ROW_W = 610;
const ROW_H = 176;
const ROW_GAP = 44;

export type ThumbnailProps = { meta: EpisodeMeta };

const TILT = [-3, 2, -2, 1.5, -2.5];
const BLOCK = {
  black: { bg: INK, fg: "#FFFFFF" },
  yellow: { bg: YELLOW, fg: INK },
  red: { bg: RED, fg: "#FFFFFF" },
  white: { bg: "#FFFFFF", fg: INK },
};
const CHIP: Record<ChipFill, { bg: string; fg: string }> = {
  white: { bg: "#FFFFFF", fg: INK },
  yellow: { bg: YELLOW, fg: INK },
  green: { bg: GREEN, fg: "#FFFFFF" },
  red: { bg: RED, fg: "#FFFFFF" },
  blue: { bg: BLUE, fg: "#FFFFFF" },
  black: { bg: INK, fg: YELLOW },
};
const TONE = {
  bad: { title: RED, bg: "#FDECEC" },
  good: { title: GREEN, bg: "#EAF7EF" },
  neutral: { title: BLUE, bg: "#EAF2FC" },
};

function Ticks({ x, y, rotate }: { x: number; y: number; rotate: number }) {
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={1} height={1}>
      <g transform={`rotate(${rotate})`}>
        {[-40, 0, 40].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <path d="M 0 -30 L 0 -78" stroke={INK} strokeWidth={20} strokeLinecap="round" />
            <path d="M 0 -30 L 0 -78" stroke={YELLOW} strokeWidth={10} strokeLinecap="round" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Icon glyphs drawn in a 100×100 box. */
function Glyph({ name }: { name: string }) {
  const s = { fill: "none", stroke: INK, strokeWidth: 7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "code":
      return <text x="50" y="66" textAnchor="middle" fontFamily={FONT_UI} fontWeight={900} fontSize={44} fill={INK}>{"</>"}</text>;
    case "mail":
      return (<><rect x="14" y="26" width="72" height="50" rx="8" {...s} fill="#FFF7D6" /><path d="M 16 30 L 50 56 L 84 30" {...s} /></>);
    case "model":
      return (
        <>
          <path d="M 24 26 L 74 50 M 24 50 L 74 50 M 24 74 L 74 50" {...s} strokeWidth={5} />
          {[26, 50, 74].map((y) => <circle key={y} cx="24" cy={y} r="9" fill={BLUE} stroke={INK} strokeWidth={4} />)}
          <circle cx="74" cy="50" r="13" fill={YELLOW} stroke={INK} strokeWidth={4} />
        </>
      );
    case "chart":
      return (<><path d="M 18 80 L 86 80" {...s} />{[[26, 50], [46, 30], [66, 60]].map(([x, h]) => <rect key={x} x={x} y={78 - h} width="14" height={h} fill={BLUE} stroke={INK} strokeWidth={4} />)}</>);
    case "table":
      return (<><rect x="16" y="24" width="68" height="52" rx="6" {...s} fill="#FFFFFF" /><path d="M 16 41 L 84 41 M 16 58 L 84 58 M 40 24 L 40 76" {...s} strokeWidth={5} /></>);
    case "python":
      return <text x="50" y="64" textAnchor="middle" fontFamily={FONT_UI} fontWeight={900} fontSize={40} fill={INK}>py</text>;
    case "java":
      return (<><rect x="26" y="40" width="40" height="40" rx="8" {...s} fill="#FFFFFF" /><path d="M 66 48 Q 82 50 66 70" {...s} /><path d="M 38 32 Q 34 24 40 16 M 52 32 Q 48 24 54 16" {...s} stroke={RED} strokeWidth={5} /></>);
    case "check":
      return <path d="M 24 52 L 42 70 L 78 32" {...s} stroke={GREEN} strokeWidth={12} />;
    case "cross":
      return <path d="M 28 28 L 72 72 M 72 28 L 28 72" {...s} stroke={RED} strokeWidth={12} />;
    default:
      return <text x="50" y="62" textAnchor="middle" fontFamily={FONT_UI} fontWeight={900} fontSize={30} fill={RED}>?</text>;
  }
}

type Laid = { kind: "chip" | "plus" | "arrow" | "computer" | "icon"; w: number; label?: string; fill?: ChipFill; icon?: string };

function measure(item: DiagramItem): Laid {
  if (item === "+") return { kind: "plus", w: 36 };
  if (item === "->") return { kind: "arrow", w: 38 };
  if (item === "@computer") return { kind: "computer", w: 80 };
  if (typeof item === "string" && item.startsWith("@")) return { kind: "icon", w: 76, icon: item.slice(1) };
  const { label, fill = "white" } = typeof item === "string" ? { label: item } : item;
  return { kind: "chip", w: Math.max(96, label.length * 15 + 36), label, fill };
}

function Row({ row, y }: { row: DiagramRow; y: number }) {
  const tone = TONE[row.tone ?? "neutral"];
  const items = row.items.map(measure);
  const total = items.reduce((s, i) => s + i.w + 4, 0);
  const fit = Math.min(1, (ROW_W - 36) / total);
  const xs = items.reduce<number[]>((acc, it, i) => [...acc, i === 0 ? 0 : acc[i - 1] + items[i - 1].w + 4], []);
  return (
    <g transform={`translate(0 ${y})`}>
      <rect x={0} y={0} width={ROW_W} height={ROW_H} rx={26} fill={tone.bg} stroke={INK} strokeWidth={6} />
      <g transform="translate(22 14)">
        <rect width={row.title.length * 17 + 36} height={40} rx={20} fill={tone.title} stroke={INK} strokeWidth={5} />
        <text x={18} y={29} fontFamily={FONT_UI} fontWeight={900} fontSize={24} fill="#FFFFFF">{row.title}</text>
      </g>
      <g transform={`translate(18 ${88 + (1 - fit) * 31}) scale(${fit})`}>
        {items.map((it, i) => {
          const at = xs[i];
          if (it.kind === "plus") return <text key={i} x={at + it.w / 2} y={44} textAnchor="middle" fontFamily={FONT_UI} fontWeight={900} fontSize={38} fill={INK}>+</text>;
          if (it.kind === "arrow") return <path key={i} d={`M ${at + 4} 31 L ${at + 30} 31 M ${at + 18} 19 L ${at + 31} 31 L ${at + 18} 43`} fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />;
          if (it.kind === "computer")
            return (
              <g key={i} transform={`translate(${at + 3} -8)`}>
                <rect width={74} height={54} rx={8} fill={BLUE} stroke={INK} strokeWidth={6} />
                <rect x={10} y={9} width={54} height={34} rx={4} fill="#FFFFFF" />
                <path d="M 22 66 L 52 66 M 37 54 L 37 66" stroke={INK} strokeWidth={7} strokeLinecap="round" />
              </g>
            );
          if (it.kind === "icon")
            return (
              <g key={i} transform={`translate(${at} -6)`}>
                <rect width={74} height={74} rx={16} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
                <svg x={7} y={7} width={60} height={60} viewBox="0 0 100 100"><Glyph name={it.icon ?? ""} /></svg>
              </g>
            );
          const c = CHIP[it.fill ?? "white"];
          return (
            <g key={i} transform={`translate(${at} 0)`}>
              <rect width={it.w} height={62} rx={31} fill={c.bg} stroke={INK} strokeWidth={6} />
              <text x={it.w / 2} y={41} textAnchor="middle" fontFamily={FONT_UI} fontWeight={900} fontSize={23} fill={c.fg}>{it.label}</text>
            </g>
          );
        })}
      </g>
    </g>
  );
}

function Diagram({ rows }: { rows: DiagramRow[] }) {
  const height = rows.length * ROW_H + (rows.length - 1) * ROW_GAP;
  const scale = Math.min(1, DIAGRAM_MAX_H / height);
  return (
    <svg width={ROW_W * scale} height={height * scale} viewBox={`0 0 ${ROW_W} ${height}`} style={{ overflow: "visible" }}>
      {rows.map((row, i) => <Row key={i} row={row} y={i * (ROW_H + ROW_GAP)} />)}
    </svg>
  );
}

export const Thumbnail: React.FC<ThumbnailProps> = ({ meta }) => {
  const { blocks, diagram } = meta.thumbnail;
  const PAD = 22;
  const sizes = blocks.map((b) => Math.min(250, fitText({ text: b.text.toUpperCase(), withinWidth: COL_WIDTH - 2 * PAD, fontFamily: HEAD_FONT }).fontSize));
  const total = sizes.reduce((s, x) => s + x * 1.02 + 20, 0);
  const scale = Math.min(1, HEAD_BUDGET / total);

  return (
    <AbsoluteFill style={{ background: "#FFFFFF", overflow: "hidden" }}>
      {/* mascot first so the headline boxes sit on top of it */}
      <div style={{ position: "absolute", right: -10, top: 296 }}>
        <DevMascot height={1380} />
      </div>

      <div style={{ position: "absolute", left: COL_LEFT, top: 262, background: BLUE, color: "#FFFFFF", fontFamily: HEAD_FONT, fontSize: 60, padding: "2px 26px", borderRadius: 16, border: `6px solid ${INK}`, transform: "rotate(-3deg)", letterSpacing: 1 }}>
        {meta.badge ?? `DAY ${meta.day}`}
      </div>

      <div style={{ position: "absolute", left: COL_LEFT, top: HEAD_TOP, width: COL_WIDTH, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14 }}>
        {blocks.map((b, i) => (
          <div
            key={i}
            style={{
              transform: `rotate(${TILT[i % TILT.length]}deg)`,
              background: BLOCK[b.style].bg,
              color: BLOCK[b.style].fg,
              border: `7px solid ${INK}`,
              padding: `0 ${PAD}px`,
              fontFamily: HEAD_FONT,
              fontSize: sizes[i] * scale,
              lineHeight: 1.04,
              whiteSpace: "nowrap",
              textTransform: "uppercase",
            }}
          >
            {b.text}
          </div>
        ))}
      </div>

      <Ticks x={COL_LEFT + 232 + Math.max(0, (meta.badge ?? `DAY ${meta.day}`).length - 5) * 30} y={330} rotate={40} />
      <Ticks x={COL_LEFT + COL_WIDTH - 20} y={HEAD_TOP + 30} rotate={55} />

      <div style={{ position: "absolute", left: COL_LEFT - 4, top: DIAGRAM_TOP, transform: "rotate(-1deg)", transformOrigin: "top left" }}>
        <Diagram rows={diagram.rows} />
      </div>
    </AbsoluteFill>
  );
};
