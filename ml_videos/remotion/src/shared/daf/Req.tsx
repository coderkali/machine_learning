// DAF-02 building blocks: the five-pin requirement contract, the project map strip, a SIGNED stamp,
// and hourly bars. Real numbers come from 18_Projects/01_Delhi_Air_Forecast/data (R K Puram, station 17).
// All text is HTML (SVG <text> shakes between frames in multi-tab renders).
import { enter, pop, T } from "../anim";
import { K } from "../explainer/kit";

export const PINS = ["Decision", "Target", "Time", "Success number", "Baseline"];
export const PIN_ICONS = ["🏫", "🎯", "🕕", "📏", "👥"];
const PIN_COLORS = [K.blue, K.purple, "#00897B", "#FB8C00", K.muted];

/** The requirement contract: lit[i] = frame pin i lights up; glow[i] = frame it starts pulsing as "next". */
export function Contract({ f, at, lit, glow = [], x = 230, y = 30, w = 660 }: { f: number; at: number; lit: number[]; glow?: number[]; x?: number; y?: number; w?: number }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, ...pop(f, at) }}>
      <div style={{ background: "#fff", border: `5px solid ${K.ink}`, borderRadius: 20, boxShadow: `8px 8px 0 ${K.ink}`, overflow: "hidden" }}>
        <div style={{ background: K.ink, color: "#fff", fontFamily: K.head, fontSize: 40, padding: "10px 22px", letterSpacing: 1 }}>📜 ML REQUIREMENT · CONTRACT</div>
        <div style={{ padding: "12px 20px" }}>
          {PINS.map((p, i) => {
            const on = f >= lit[i];
            const g = !on && f >= (glow[i] ?? Infinity) ? 0.5 + 0.5 * Math.sin(f / 5) : 0;
            return (
              <div key={p} style={{ display: "flex", alignItems: "center", gap: 16, margin: "8px 0", padding: "8px 12px", borderRadius: 12, background: on ? `${PIN_COLORS[i]}22` : `rgba(255,214,0,${0.4 * g})`, border: `4px ${on ? "solid" : "dashed"} ${on ? PIN_COLORS[i] : K.line}`, ...pop(f, at + 6 + i * T.stagger) }}>
                <span style={{ width: 48, height: 48, borderRadius: 24, display: "grid", placeItems: "center", background: on ? PIN_COLORS[i] : "#ECEFF1", color: "#fff", fontFamily: K.head, fontSize: 30, transform: `scale(${on ? 1 + 0.25 * (1 - enter(f, lit[i], 10)) : 1})` }}>{on ? "📌" : i + 1}</span>
                <span style={{ fontSize: 34 }}>{PIN_ICONS[i]}</span>
                <span style={{ fontWeight: 900, fontSize: 32, color: on ? K.ink : K.muted }}>{p}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Project map: DAF-01 … DAF-24. done = number of finished tickets; current pulses. */
export function ProjectMap({ f, at, done, current, x = 210, y = 20 }: { f: number; at: number; done: number; current: number; x?: number; y?: number }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 720, display: "flex", flexWrap: "wrap", gap: 8 }}>
      {Array.from({ length: 24 }).map((_, i) => {
        const n = i + 1;
        const isCur = n === current;
        const isDone = n <= done;
        return (
          <div key={n} style={{ width: 82, ...pop(f, at + i) }}>
            <div style={{ height: 52, borderRadius: 10, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 20, border: `4px solid ${isCur ? K.ink : isDone ? K.green : K.line}`, background: isCur ? K.yellow : isDone ? "#E8F5E9" : "#fff", color: isDone || isCur ? K.ink : K.muted, transform: `scale(${isCur ? 1 + 0.08 * Math.sin(f / 5) : 1})`, boxShadow: isDone ? `0 0 14px ${K.green}` : "none" }}>
              {isDone ? "✓ " : ""}{String(n).padStart(2, "0")}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Stamp({ f, at, text = "SIGNED", color = K.green, size = 44 }: { f: number; at: number; text?: string; color?: string; size?: number }) {
  const t = enter(f, at, 7);
  if (f < at) return null;
  return (
    <div style={{ display: "inline-block", opacity: t, transform: `scale(${2.2 - 1.2 * t}) rotate(-10deg)`, border: `6px solid ${color}`, color, borderRadius: 12, padding: "2px 16px", fontFamily: K.head, fontSize: size, letterSpacing: 2, background: "rgba(255,255,255,.85)" }}>{text}</div>
  );
}

/** 24 hourly bars (µg/m³). null = sensor gave nothing that hour. fill[i] frame bar i grows; greyFrom = hours drawn as "not yet". */
export function HourBars({ f, values, start, step = 2, w = 700, h = 230, max = 190, greyFrom = 99, line }: { f: number; values: (number | null)[]; start: number; step?: number; w?: number; h?: number; max?: number; greyFrom?: number; line?: number }) {
  const bw = w / 24;
  return (
    <div style={{ position: "relative", width: w, height: h, borderBottom: `4px solid ${K.ink}` }}>
      {/* the Poor line: 91 µg/m³ */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: (91 / max) * h, borderTop: `4px dashed ${K.red}` }} />
      <div style={{ position: "absolute", right: 0, bottom: (91 / max) * h + 4, fontWeight: 900, fontSize: 18, color: K.red }}>91 · Poor</div>
      {values.map((v, i) => {
        const g = enter(f, start + i * step, 8);
        const grey = i >= greyFrom;
        if (v == null) {
          return <div key={i} style={{ position: "absolute", left: i * bw + 3, bottom: 0, width: bw - 6, height: 40, border: `3px dashed ${K.muted}`, borderBottom: "none", opacity: g, boxSizing: "border-box", borderRadius: "6px 6px 0 0" }} />;
        }
        return (
          <div key={i} style={{ position: "absolute", left: i * bw + 3, bottom: 0, width: bw - 6, height: (Math.min(v, max) / max) * h * g, borderRadius: "6px 6px 0 0", background: grey ? "repeating-linear-gradient(45deg,#CFD8DC 0 6px,#ECEFF1 6px 12px)" : v >= 91 ? "#FB8C00" : K.blue, border: grey ? `2px dashed ${K.muted}` : "none", boxSizing: "border-box" }} />
        );
      })}
      {line != null && f >= start + 24 * step && (
        <div style={{ position: "absolute", left: 0, width: w * enter(f, start + 24 * step, 14), bottom: (line / max) * h, borderTop: `6px solid ${K.ink}` }} />
      )}
      {[0, 6, 12, 18, 23].map((hr) => (
        <div key={hr} style={{ position: "absolute", left: hr * bw, top: h + 6, fontWeight: 800, fontSize: 18, color: K.muted }}>{String(hr).padStart(2, "0")}:00</div>
      ))}
    </div>
  );
}
