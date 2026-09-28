// The series guide: the blue robot from Day 1, now with poses and an optional Java-style coffee mug.
// Video moods (happy/facepalm/skeptical/nodding) match Day 1; pointing/thinking/shocked are for thumbnails.
import React from "react";
import { C, FONT_UI } from "./theme";

export type RobotPose = "happy" | "facepalm" | "skeptical" | "nodding" | "pointing" | "thinking" | "shocked";

type Props = {
  f?: number;
  pose?: RobotPose;
  mug?: boolean;
  /** "light" adds thick ink outlines so the robot pops on the off-white thumbnail background. */
  variant?: "dark" | "light";
  size?: number;
  /** Day 1 hook animation: left hand rises as if catching an email. */
  catchIt?: boolean;
  /** Idle bob. Off by default: in the explainer format every movement must explain something. */
  idle?: boolean;
  style?: React.CSSProperties;
};

const INK = "#0B1A2E";

// Right arm (viewer's right) per pose. Shoulder is at (284, 216).
const RIGHT_ARM: Record<RobotPose, string> = {
  happy: "M 284 216 L 325 190",
  nodding: "M 284 216 L 325 190",
  skeptical: "M 284 216 L 325 190",
  facepalm: "M 284 216 L 304 170 L 260 130",
  pointing: "M 284 216 L 318 160 L 326 88",
  thinking: "M 284 216 L 306 262 L 244 252",
  shocked: "M 284 216 L 322 150 L 342 96",
};

function Mug({ x, y, rotate = 0, light }: { x: number; y: number; rotate?: number; light: boolean }) {
  // Centred on the hand at (x, y). Steam curls double as the "Java" logo on the cup.
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <path d="M -40 -8 Q -58 -8 -58 12 Q -58 32 -38 32" fill="none" stroke={light ? INK : C.white} strokeWidth={9} strokeLinecap="round" />
      <path d="M -40 -8 Q -58 -8 -58 12 Q -58 32 -38 32" fill="none" stroke={C.white} strokeWidth={light ? 4 : 0} strokeLinecap="round" />
      <rect x={-42} y={-22} width={70} height={70} rx={14} fill={C.white} stroke={light ? INK : "#C9D6E6"} strokeWidth={light ? 6 : 3} />
      <path d="M -18 20 Q -24 12 -16 5 Q -8 -2 -14 -10 M -2 20 Q -8 12 0 5 Q 8 -2 2 -10" fill="none" stroke={C.blue} strokeWidth={4} strokeLinecap="round" />
      <path d="M -24 28 Q -7 36 12 28" fill="none" stroke={C.red} strokeWidth={4} strokeLinecap="round" />
      <path d="M -20 -32 Q -28 -44 -20 -56 Q -12 -68 -20 -80 M 4 -32 Q -4 -44 4 -56 Q 12 -68 4 -80" fill="none" stroke={light ? "#8AA0B8" : C.muted} strokeWidth={5} strokeLinecap="round" opacity={0.85} />
    </g>
  );
}

export function Robot({ f = 0, pose = "happy", mug = false, variant = "dark", size = 330, catchIt = false, idle = false, style }: Props) {
  const light = variant === "light";
  const nodding = pose === "nodding";
  const bob = idle ? Math.sin(f / (nodding ? 7 : 11)) * (nodding ? 5 : 8) : 0;
  const hand = catchIt ? Math.max(-100, Math.min(0, ((f - 45) / 45) * -100)) : 0;
  const shocked = pose === "shocked";

  // Left arm (viewer's left). With a mug it holds the cup out; shocked raises it.
  // With a mug, it's held at chest height in front of the body so it never pokes into the headline.
  const leftHand = shocked ? { x: 22, y: 118 } : mug ? { x: 70, y: 262 } : { x: 30, y: 188 + hand };
  const leftArm = shocked
    ? `M 76 216 L 40 170 L ${leftHand.x} ${leftHand.y}`
    : mug
      ? `M 76 216 L 50 250 L ${leftHand.x} ${leftHand.y}`
      : `M 76 216 L 36 ${208 + hand} Q 22 ${201 + hand} 30 ${188 + hand}`;
  const rightArm = RIGHT_ARM[pose];
  const handEnd = rightArm.split(" ").slice(-2).map(Number);

  const arm = (d: string) => (
    <>
      {light && <path d={d} stroke={INK} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
      <path d={d} stroke={C.blue} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  );

  // Hand-to-face poses cross in front of the body; the rest are drawn behind it.
  const inFront = pose === "thinking" || pose === "facepalm";
  const rightHand = (
    <>
      {arm(rightArm)}
      {(pose === "pointing" || pose === "shocked" || inFront) && (
        <circle cx={handEnd[0]} cy={handEnd[1]} r="16" fill={C.blue} stroke={light ? INK : "#0E1A2B"} strokeWidth={light ? 6 : 4} />
      )}
      {pose === "pointing" && <path d={`M ${handEnd[0]} ${handEnd[1] - 12} L ${handEnd[0] + 2} ${handEnd[1] - 40}`} stroke={light ? INK : C.blue} strokeWidth="10" strokeLinecap="round" />}
    </>
  );

  const eyeRy = shocked ? 24 : 19;
  const pupilDy = pose === "thinking" ? -8 : pose === "pointing" ? -6 : 5;
  const mouth =
    pose === "skeptical"
      ? "M 158 214 Q 181 201 202 216"
      : pose === "facepalm"
        ? "M 158 220 Q 180 201 202 220"
        : pose === "thinking"
          ? "M 162 214 L 198 210"
          : "M 158 209 Q 180 228 202 209";

  return (
    <svg viewBox="-20 20 400 340" width={size} height={size * (340 / 400)} style={{ overflow: "visible", transform: `translateY(${bob}px)`, ...style }}>
      <ellipse cx="180" cy="330" rx="112" ry="18" fill={light ? "#000" : "#050910"} opacity={light ? 0.12 : 0.46} />
      <g>
        <path d="M 132 306 L 123 333 M 228 306 L 237 333" stroke={light ? INK : C.white} strokeWidth="14" strokeLinecap="round" />
        {arm(leftArm)}
        {!inFront && rightHand}
        <rect x="75" y="90" width="210" height="218" rx="56" fill="#142640" stroke={light ? INK : C.blue} strokeWidth={light ? 12 : 9} />
        {light && <rect x="83" y="98" width="194" height="202" rx="50" fill="none" stroke={C.blue} strokeWidth="6" />}
        <path d="M 180 90 L 180 62" stroke={light ? INK : C.blue} strokeWidth="8" strokeLinecap="round" />
        <circle cx="180" cy="54" r="11" fill={C.gold} stroke={light ? INK : "none"} strokeWidth={light ? 4 : 0} />
        <rect x="103" y="133" width="154" height="100" rx="30" fill="#07111E" stroke="#274668" strokeWidth="4" />
        <ellipse cx="151" cy="179" rx="12" ry={eyeRy} fill={C.white} />
        <ellipse cx="209" cy="179" rx="12" ry={eyeRy} fill={C.white} />
        <circle cx="154" cy={179 + pupilDy} r={shocked ? 5 : 6} fill={C.blue} />
        <circle cx="206" cy={179 + pupilDy} r={shocked ? 5 : 6} fill={C.blue} />
        {pose === "skeptical" && <path d="M 187 148 L 220 139" stroke={C.blue} strokeWidth="6" strokeLinecap="round" />}
        {shocked ? (
          <ellipse cx="180" cy="215" rx="11" ry="13" fill="none" stroke={C.gold} strokeWidth="5" />
        ) : (
          <path d={mouth} stroke={C.gold} strokeWidth="5" fill="none" strokeLinecap="round" />
        )}
        <circle cx={mug && !shocked ? 212 : 180} cy="270" r="17" fill={C.gold} />
        <text x={mug && !shocked ? 212 : 180} y="277" textAnchor="middle" fontFamily={FONT_UI} fontWeight={800} fontSize={20} fill={C.bg}>M</text>
        {inFront && rightHand}
        {mug && <Mug x={leftHand.x} y={leftHand.y - (shocked ? 30 : 10)} rotate={shocked ? -14 : 0} light={light} />}
      </g>
    </svg>
  );
}
