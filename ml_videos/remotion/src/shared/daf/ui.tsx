// Small building blocks shared by DAF episodes (claude/daf/UNIVERSE.md).
import React from "react";
import { interpolate } from "remotion";
import { enter, T } from "../anim";
import { K } from "../explainer/kit";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** interpolate() that tolerates beats missing from a sample timeline (cue = Infinity). */
export const ip = (v: number, inR: number[], outR: number[]) => (inR.every(Number.isFinite) ? interpolate(v, inR, outR, clamp) : outR[0]);

/** 1 while inside [a, b), with quick fades at both ends. */
export const live = (f: number, a: number, b: number) => (f < a || f >= b + T.exit ? 0 : Math.min(enter(f, a, 6), 1 - enter(f, b, T.exit)));

export const Box = ({ children, style }: { children?: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ position: "absolute", background: "#fff", border: `5px solid ${K.ink}`, borderRadius: 20, boxShadow: `8px 8px 0 ${K.ink}`, ...style }}>{children}</div>
);

export const Strike = ({ p, color = K.red }: { p: number; color?: string }) => (
  <div style={{ position: "absolute", left: -10, right: -10, top: "50%", height: 8, background: color, transform: `rotate(-8deg) scaleX(${p})`, transformOrigin: "left", borderRadius: 4 }} />
);

/** CPCB categories for the 24-hour PM2.5 mean (docs/phases/01_requirements.md) and Asha's action. */
export const CPCB = [
  { name: "Good", band: "0–30", action: "outside", color: "#2E9E5B" },
  { name: "Satisfactory", band: "31–60", action: "outside", color: "#8BC34A" },
  { name: "Moderately polluted", band: "61–90", action: "outside, no running", color: "#FBC02D" },
  { name: "Poor", band: "91–120", action: "indoors", color: "#FB8C00" },
  { name: "Very Poor", band: "121–250", action: "indoors", color: "#E53935" },
  { name: "Severe", band: "250+", action: "indoors + parents told", color: "#7B1F1F" },
];
