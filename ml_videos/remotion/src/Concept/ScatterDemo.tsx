import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_UI } from "../theme";

// Real toy data from the LDA notebook.
const CLASS1 = [
  [2, 3],
  [3, 4],
];
const CLASS2 = [
  [6, 7],
  [7, 10],
];
const MU1: [number, number] = [2.5, 3.5];
const MU2: [number, number] = [6.5, 8.5];

// Map data space (x:0-9, y:0-11) to SVG viewBox space.
const VB_W = 700;
const VB_H = 900;
const PAD = 90;
const sx = (x: number) => PAD + (x / 9) * (VB_W - 2 * PAD);
const sy = (y: number) => VB_H - PAD - (y / 11) * (VB_H - 2 * PAD);

export const ScatterDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Beat 1 (0s-1.5s): dots pop in, staggered ---
  const dotProgress = (index: number) =>
    interpolate(frame, [index * 4, index * 4 + 14], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.spring({ damping: 12 }),
    });

  // --- Beat 2 (1.5s-3s): naive dashed line grows from mu1 to mu2 ---
  const naiveStart = 1.4 * fps;
  const naiveGrow = interpolate(frame, [naiveStart, naiveStart + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const naiveOpacity = interpolate(
    frame,
    [naiveStart, naiveStart + 10, 3.3 * fps, 3.3 * fps + 15],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // --- Beat 3 (3.3s-5s): corrected axis rotates in from naive angle to true angle ---
  const axisStart = 3.3 * fps;
  const axisT = interpolate(frame, [axisStart, axisStart + 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1), // overshoot
  });
  // naive angle: direction mu1->mu2 = (4,5) in data space -> angle in screen space
  const naiveAngleDeg = -50; // approx screen-space angle for (4,5) direction (y flipped)
  const trueAngleDeg = -20; // approx screen-space angle for corrected w=(10,-3) direction
  const axisAngle = interpolate(axisT, [0, 1], [naiveAngleDeg, trueAngleDeg]);
  const axisOpacity = interpolate(frame, [axisStart, axisStart + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const center: [number, number] = [(MU1[0] + MU2[0]) / 2, (MU1[1] + MU2[1]) / 2];
  const cx = sx(center[0]);
  const cy = sy(center[1]);
  const axisLen = 340;
  const rad = (axisAngle * Math.PI) / 180;
  const ax1 = cx - axisLen * Math.cos(rad);
  const ay1 = cy - axisLen * Math.sin(rad);
  const ax2 = cx + axisLen * Math.cos(rad);
  const ay2 = cy + axisLen * Math.sin(rad);

  const allPoints = [...CLASS1, ...CLASS2];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%">
        {/* naive guess line */}
        <line
          x1={sx(MU1[0])}
          y1={sy(MU1[1])}
          x2={sx(MU1[0]) + (sx(MU2[0]) - sx(MU1[0])) * naiveGrow}
          y2={sy(MU1[1]) + (sy(MU2[1]) - sy(MU1[1])) * naiveGrow}
          stroke={COLORS.textDim}
          strokeWidth={4}
          strokeDasharray="14 10"
          opacity={naiveOpacity}
        />

        {/* corrected LDA axis */}
        <line
          x1={ax1}
          y1={ay1}
          x2={ax2}
          y2={ay2}
          stroke={COLORS.yellow}
          strokeWidth={7}
          opacity={axisOpacity}
          strokeLinecap="round"
        />

        {/* data points */}
        {allPoints.map(([x, y], i) => {
          const p = dotProgress(i);
          const isClass2 = i >= CLASS1.length;
          const r = interpolate(p, [0, 1], [0, 20]);
          return (
            <circle
              key={i}
              cx={sx(x)}
              cy={sy(y)}
              r={r}
              fill={isClass2 ? COLORS.red : COLORS.blue}
              opacity={interpolate(p, [0, 1], [0, 1])}
            />
          );
        })}
      </svg>

      {/* caption line, changes with beat */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 140,
        }}
      >
        <div
          style={{
            fontFamily: FONT_UI,
            fontWeight: 800,
            fontSize: 40,
            color: COLORS.textMain,
            textAlign: "center",
            opacity: interpolate(frame, [naiveStart, naiveStart + 8], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {frame < axisStart ? "The obvious guess" : "LDA corrects it"}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
