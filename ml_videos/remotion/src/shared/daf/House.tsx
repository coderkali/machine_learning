// DAF-01's running picture: REPRODUCIBILITY is a roof standing on four pillars (the four ideas).
// All text is HTML (SVG <text> shakes between frames in multi-tab renders).
import { enter, pop, T } from "../anim";
import { K } from "../explainer/kit";

export const PILLARS = ["own room", "exact versions", "one package", "share the recipe"];
const COLORS = [K.blue, K.purple, "#00897B", "#FB8C00"];

/**
 * at: when the house appears · built[i]: frame pillar i becomes solid (Infinity = still "?")
 * glow[i]: frame pillar i starts pulsing as "coming next" (Infinity = no glow)
 */
export function House({ f, at, built, glow = [], x = 250, y = 30, scale = 1, bob = false }: { f: number; at: number; built: number[]; glow?: number[]; x?: number; y?: number; scale?: number; bob?: boolean }) {
  const W = 620;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: W, transform: `translateY(${bob ? 8 * Math.sin(f / 12) : 0}px) scale(${scale})`, transformOrigin: "0 0" }}>
    <div style={pop(f, at)}>
      <div style={{ width: 0, height: 0, borderLeft: `${W / 2}px solid transparent`, borderRight: `${W / 2}px solid transparent`, borderBottom: `150px solid ${K.red}` }} />
      <div style={{ position: "absolute", left: 0, width: W, top: 82, textAlign: "center", fontFamily: K.head, fontSize: 44, color: "#fff", letterSpacing: 1 }}>REPRODUCIBILITY</div>
      <div style={{ display: "flex", gap: 40, padding: "0 25px", marginTop: 4 }}>
        {PILLARS.map((label, i) => {
          const on = f >= built[i];
          const solid = enter(f, built[i], 10);
          const g = f >= (glow[i] ?? Infinity) && !on ? 0.5 + 0.5 * Math.sin(f / 5) : 0;
          return (
            <div key={label} style={{ width: 115, ...pop(f, at + 6 + i * T.stagger) }}>
              <div style={{ height: 250, borderRadius: 10, border: `5px ${on ? "solid" : "dashed"} ${on ? K.ink : K.muted}`, background: on ? COLORS[i] : `rgba(255,214,0,${0.35 * g})`, opacity: on ? 0.5 + 0.5 * solid : 1, display: "grid", placeItems: "center", fontFamily: K.head, fontSize: 64, color: on ? "#fff" : K.muted, boxSizing: "border-box" }}>
                {on ? i + 1 : "?"}
              </div>
              <div style={{ marginTop: 8, textAlign: "center", fontWeight: 900, fontSize: 21, lineHeight: 1.1, color: on ? COLORS[i] : K.muted, opacity: on || g > 0 ? 1 : 0.4 }}>{label}</div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 8, height: 26, borderRadius: 6, background: K.ink }} />
    </div>
    </div>
  );
}
