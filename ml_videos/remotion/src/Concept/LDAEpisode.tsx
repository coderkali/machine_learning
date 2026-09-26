import { Caption, createTikTokStyleCaptions } from "@remotion/captions";
import captionsHook from "../../public/audio/lda_01_hook.json";
import captionsNaive from "../../public/audio/lda_02_naive.json";
import captionsStep1 from "../../public/audio/lda_03_step1.json";
import captionsStep2 from "../../public/audio/lda_04_step2.json";
import captionsStep3 from "../../public/audio/lda_05_step3.json";
import captionsStep4 from "../../public/audio/lda_06_step4.json";
import captionsVerify from "../../public/audio/lda_07_verify.json";
import captionsTakeaway from "../../public/audio/lda_08_takeaway.json";
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "../load-font";
import { COLORS, FONT_UI } from "../theme";
import { BrandSubtitlePage } from "./BrandSubtitlePage";

const FPS = 30;
const BUFFER = 8; // frames of silence between beats

type Beat = {
  id: string;
  audio: string;
  captions: Caption[];
  durationSec: number;
  Visual: React.FC;
};

// ---------------------------------------------------------------------
// Shared data (from the notebook's real hand-computable example)
// ---------------------------------------------------------------------
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
const Z_VALUES = [11, 18, 39, 40];
const Z_CENTRE1 = 14.5;
const Z_CENTRE2 = 39.5;

const VB_W = 700;
const VB_H = 900;
const PAD = 90;
const sx = (x: number) => PAD + (x / 9) * (VB_W - 2 * PAD);
const sy = (y: number) => VB_H - PAD - (y / 11) * (VB_H - 2 * PAD);
const allPoints = [...CLASS1, ...CLASS2];
const NAIVE_ANGLE_DEG = -50;
const TRUE_ANGLE_DEG = -20;
const center: [number, number] = [(MU1[0] + MU2[0]) / 2, (MU1[1] + MU2[1]) / 2];
const cx = sx(center[0]);
const cy = sy(center[1]);
const AXIS_LEN = 340;

const spring = (frame: number, from: number, dur: number, overshoot = false) =>
  interpolate(frame, [from, from + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: overshoot
      ? Easing.bezier(0.34, 1.56, 0.64, 1)
      : Easing.bezier(0.16, 1, 0.3, 1),
  });

const Dots: React.FC<{ frame: number; startFrame?: number }> = ({ frame, startFrame = 0 }) => (
  <>
    {allPoints.map(([x, y], i) => {
      const p = spring(frame, startFrame + i * 4, 14);
      const isClass2 = i >= CLASS1.length;
      return (
        <circle
          key={i}
          cx={sx(x)}
          cy={sy(y)}
          r={interpolate(p, [0, 1], [0, 20])}
          fill={isClass2 ? COLORS.red : COLORS.blue}
          opacity={p}
        />
      );
    })}
  </>
);

// Plain HTML (not SVG) so it renders identically regardless of which
// beat's own <svg viewBox> it sits alongside.
const StepTag: React.FC<{ n: number; frame: number }> = ({ n, frame }) => (
  <div
    style={{
      position: "absolute",
      top: 60,
      left: 50,
      fontFamily: FONT_UI,
      fontWeight: 800,
      fontSize: 34,
      color: COLORS.yellow,
      opacity: spring(frame, 0, 8),
    }}
  >
    STEP {n}
  </div>
);

// ---------------------------------------------------------------------
// Beat 1 — hook
// ---------------------------------------------------------------------
const HookVisual: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%">
        <Dots frame={frame} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------
// Beat 2 — naive guess
// ---------------------------------------------------------------------
const NaiveVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const grow = spring(frame, 0, 20);
  const labelOpacity = spring(frame, 15, 10);
  return (
    <AbsoluteFill>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%">
        <Dots frame={999} />
        <line
          x1={sx(MU1[0])}
          y1={sy(MU1[1])}
          x2={sx(MU1[0]) + (sx(MU2[0]) - sx(MU1[0])) * grow}
          y2={sy(MU1[1]) + (sy(MU2[1]) - sy(MU1[1])) * grow}
          stroke={COLORS.textDim}
          strokeWidth={5}
          strokeDasharray="16 12"
        />
        <text
          x={sx((MU1[0] + MU2[0]) / 2) - 140}
          y={sy((MU1[1] + MU2[1]) / 2) + 10}
          fontFamily={FONT_UI}
          fontWeight={700}
          fontSize={26}
          fill={COLORS.textDim}
          opacity={labelOpacity}
        >
          guess: (4, 5)
        </text>
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------
// Beat 3 — step 1: class centres
// ---------------------------------------------------------------------
const Step1Visual: React.FC = () => {
  const frame = useCurrentFrame();
  const xOpacity = spring(frame, 0, 10);
  const l1 = spring(frame, 8, 10);
  const l2 = spring(frame, 16, 10);
  return (
    <AbsoluteFill>
      <StepTag n={1} frame={frame} />
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%">
        <Dots frame={999} />
        <g opacity={xOpacity} stroke={COLORS.blue} strokeWidth={6}>
          <line x1={sx(MU1[0]) - 18} y1={sy(MU1[1]) - 18} x2={sx(MU1[0]) + 18} y2={sy(MU1[1]) + 18} />
          <line x1={sx(MU1[0]) - 18} y1={sy(MU1[1]) + 18} x2={sx(MU1[0]) + 18} y2={sy(MU1[1]) - 18} />
        </g>
        <g opacity={xOpacity} stroke={COLORS.red} strokeWidth={6}>
          <line x1={sx(MU2[0]) - 18} y1={sy(MU2[1]) - 18} x2={sx(MU2[0]) + 18} y2={sy(MU2[1]) + 18} />
          <line x1={sx(MU2[0]) - 18} y1={sy(MU2[1]) + 18} x2={sx(MU2[0]) + 18} y2={sy(MU2[1]) - 18} />
        </g>
        <text x={sx(MU1[0]) - 110} y={sy(MU1[1]) + 60} fontFamily={FONT_UI} fontWeight={700} fontSize={26} fill={COLORS.blue} opacity={l1}>
          μ1 = (2.5, 3.5)
        </text>
        <text x={sx(MU2[0]) - 60} y={sy(MU2[1]) - 45} fontFamily={FONT_UI} fontWeight={700} fontSize={26} fill={COLORS.red} opacity={l2}>
          μ2 = (6.5, 8.5)
        </text>
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------
// Beat 4 — step 2: spread / lean
// ---------------------------------------------------------------------
const Step2Visual: React.FC = () => {
  const frame = useCurrentFrame();
  const e1 = spring(frame, 0, 12);
  const e2 = spring(frame, 8, 14);
  return (
    <AbsoluteFill>
      <StepTag n={2} frame={frame} />
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%">
        <Dots frame={999} />
        <ellipse
          cx={sx(MU1[0])}
          cy={sy(MU1[1])}
          rx={70 * e1}
          ry={55 * e1}
          fill={COLORS.blue}
          fillOpacity={0.15}
          stroke={COLORS.blue}
          strokeWidth={2}
          opacity={e1}
          transform={`rotate(25 ${sx(MU1[0])} ${sy(MU1[1])})`}
        />
        <ellipse
          cx={sx(MU2[0])}
          cy={sy(MU2[1])}
          rx={150 * e2}
          ry={50 * e2}
          fill={COLORS.red}
          fillOpacity={0.15}
          stroke={COLORS.red}
          strokeWidth={2}
          opacity={e2}
          transform={`rotate(60 ${sx(MU2[0])} ${sy(MU2[1])})`}
        />
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------
// Beat 5 — step 3: corrected direction w
// ---------------------------------------------------------------------
const Step3Visual: React.FC = () => {
  const frame = useCurrentFrame();
  const naiveFade = 1 - spring(frame, 0, 10);
  const axisT = spring(frame, 6, 22, true);
  const axisAngle = interpolate(axisT, [0, 1], [NAIVE_ANGLE_DEG, TRUE_ANGLE_DEG]);
  const axisOpacity = spring(frame, 6, 8);
  const rad = (axisAngle * Math.PI) / 180;
  const ax1 = cx - AXIS_LEN * Math.cos(rad);
  const ay1 = cy - AXIS_LEN * Math.sin(rad);
  const ax2 = cx + AXIS_LEN * Math.cos(rad);
  const ay2 = cy + AXIS_LEN * Math.sin(rad);
  const labelOpacity = spring(frame, 26, 10);

  return (
    <AbsoluteFill>
      <StepTag n={3} frame={frame} />
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%">
        <Dots frame={999} />
        <line
          x1={sx(MU1[0])} y1={sy(MU1[1])} x2={sx(MU2[0])} y2={sy(MU2[1])}
          stroke={COLORS.textDim} strokeWidth={5} strokeDasharray="16 12" opacity={naiveFade}
        />
        <line x1={ax1} y1={ay1} x2={ax2} y2={ay2} stroke={COLORS.yellow} strokeWidth={8} opacity={axisOpacity} strokeLinecap="round" />
        <text x={cx - 90} y={cy - 220} fontFamily={FONT_UI} fontWeight={800} fontSize={30} fill={COLORS.yellow} opacity={labelOpacity}>
          w = (10, -3)
        </text>
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------
// Beat 6 — step 4: project onto a number line
// ---------------------------------------------------------------------
const NL_X0 = 90;
const NL_X1 = 990;
const NL_MIN = 5;
const NL_MAX = 45;
const nx = (z: number) => NL_X0 + ((z - NL_MIN) / (NL_MAX - NL_MIN)) * (NL_X1 - NL_X0);

const Step4Visual: React.FC = () => {
  const frame = useCurrentFrame();
  const lineIn = spring(frame, 0, 12);
  const dotsIn = (i: number) => spring(frame, 10 + i * 5, 12);
  const centreIn = spring(frame, 34, 10);
  const gapIn = spring(frame, 44, 10);
  const y = 960;

  return (
    <AbsoluteFill>
      <StepTag n={4} frame={frame} />
      <svg viewBox={`0 0 1080 1920`} width="100%" height="100%" style={{ position: "absolute", top: 0 }}>
        <line x1={NL_X0} y1={y} x2={NL_X0 + (NL_X1 - NL_X0) * lineIn} y2={y} stroke={COLORS.textDim} strokeWidth={3} />
        {Z_VALUES.map((z, i) => {
          const isClass2 = i >= 2;
          const p = dotsIn(i);
          // 39 and 40 sit only 1 apart on this scale, so their labels would
          // collide directly above the dots — nudge them apart horizontally.
          const labelDx = z === 39 ? -22 : z === 40 ? 22 : 0;
          return (
            <g key={z}>
              <circle cx={nx(z)} cy={y} r={22 * p} fill={isClass2 ? COLORS.red : COLORS.blue} opacity={p} />
              <text x={nx(z) + labelDx} y={y - 45} textAnchor="middle" fontFamily={FONT_UI} fontWeight={800} fontSize={30} fill={isClass2 ? COLORS.red : COLORS.blue} opacity={p}>
                {z}
              </text>
            </g>
          );
        })}
        <line x1={nx(Z_CENTRE1)} y1={y - 90} x2={nx(Z_CENTRE1)} y2={y + 20} stroke={COLORS.blue} strokeDasharray="6 6" opacity={centreIn} />
        <line x1={nx(Z_CENTRE2)} y1={y - 90} x2={nx(Z_CENTRE2)} y2={y + 20} stroke={COLORS.red} strokeDasharray="6 6" opacity={centreIn} />
        <rect
          x={nx(18) - 30} y={y - 70} width={nx(39) - nx(18) + 60} height={140}
          fill="none" stroke={COLORS.yellow} strokeWidth={2} opacity={gapIn}
        />
        <text x={(nx(18) + nx(39)) / 2} y={y - 90} textAnchor="middle" fontFamily={FONT_UI} fontWeight={800} fontSize={26} fill={COLORS.yellow} opacity={gapIn}>
          gap
        </text>
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------
// Beat 7 — verification cards
// ---------------------------------------------------------------------
const Card: React.FC<{ top: string; bottom: string; delay: number; frame: number; x: number }> = ({
  top,
  bottom,
  delay,
  frame,
  x,
}) => {
  const p = spring(frame, delay, 14, true);
  return (
    <div
      style={{
        position: "absolute",
        top: 860,
        left: x,
        width: 420,
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.85, 1])})`,
        opacity: p,
        border: `2px solid ${COLORS.textDim}`,
        borderRadius: 20,
        padding: "28px 20px",
        textAlign: "center",
        fontFamily: FONT_UI,
      }}
    >
      <div style={{ color: COLORS.textMain, fontWeight: 700, fontSize: 26 }}>{top}</div>
      <div style={{ color: COLORS.yellow, fontWeight: 800, fontSize: 24, marginTop: 8 }}>{bottom}</div>
    </div>
  );
};

const VerifyVisual: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Card top="Hand math" bottom="matches sklearn ✓" delay={0} frame={frame} x={40} />
      <Card top="Real scale" bottom="30 features, 569 samples" delay={10} frame={frame} x={520} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------
// Beat 8 — takeaway
// ---------------------------------------------------------------------
const TakeawayVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const l1 = spring(frame, 0, 10);
  const l2 = spring(frame, 10, 10);
  const l3 = spring(frame, 22, 10);
  const line = (text: string, p: number, color: string, size: number, y: number) => (
    <div
      style={{
        position: "absolute",
        top: y,
        width: "100%",
        textAlign: "center",
        fontFamily: FONT_UI,
        fontWeight: 800,
        fontSize: size,
        color,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [20, 0])}px)`,
        padding: "0 70px",
      }}
    >
      {text}
    </div>
  );
  return (
    <AbsoluteFill>
      {line("Don't chase the biggest spread.", l1, COLORS.textMain, 46, 780)}
      {line("That's PCA — it can pick the wrong axis.", l2, COLORS.textDim, 30, 900)}
      {line("Chase the widest gap between groups.", l3, COLORS.yellow, 46, 990)}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------
// Outro (silent, brief)
// ---------------------------------------------------------------------
const OutroVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const p = spring(frame, 0, 10);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          fontFamily: FONT_UI,
          fontWeight: 800,
          fontSize: 32,
          color: COLORS.yellow,
          opacity: p,
        }}
      >
        Follow · one ML concept a day
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------
// Beat list
// ---------------------------------------------------------------------
const BEATS: Beat[] = [
  { id: "hook", audio: "lda_01_hook.mp3", captions: captionsHook as Caption[], durationSec: 7.11, Visual: HookVisual },
  { id: "naive", audio: "lda_02_naive.mp3", captions: captionsNaive as Caption[], durationSec: 8.64, Visual: NaiveVisual },
  { id: "step1", audio: "lda_03_step1.mp3", captions: captionsStep1 as Caption[], durationSec: 9.61, Visual: Step1Visual },
  { id: "step2", audio: "lda_04_step2.mp3", captions: captionsStep2 as Caption[], durationSec: 7.11, Visual: Step2Visual },
  { id: "step3", audio: "lda_05_step3.mp3", captions: captionsStep3 as Caption[], durationSec: 9.01, Visual: Step3Visual },
  { id: "step4", audio: "lda_06_step4.mp3", captions: captionsStep4 as Caption[], durationSec: 11.33, Visual: Step4Visual },
  { id: "verify", audio: "lda_07_verify.mp3", captions: captionsVerify as Caption[], durationSec: 9.66, Visual: VerifyVisual },
  { id: "takeaway", audio: "lda_08_takeaway.mp3", captions: captionsTakeaway as Caption[], durationSec: 9.47, Visual: TakeawayVisual },
];

const SWITCH_CAPTIONS_EVERY_MS = 1200;

const BeatCaptions: React.FC<{ captions: Caption[] }> = ({ captions }) => {
  const { fps } = useVideoConfig();
  const { pages } = createTikTokStyleCaptions({
    combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
    captions,
  });
  return (
    <>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = (page.startMs / 1000) * fps;
        const endFrame = Math.min(
          nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
          startFrame + SWITCH_CAPTIONS_EVERY_MS,
        );
        const durationInFrames = endFrame - startFrame;
        if (durationInFrames <= 0) return null;
        return (
          <Sequence key={index} from={startFrame} durationInFrames={durationInFrames}>
            <BrandSubtitlePage page={page} />
          </Sequence>
        );
      })}
    </>
  );
};

export const beatDurationsInFrames = BEATS.map(
  (b) => Math.ceil(b.durationSec * FPS) + BUFFER,
);
export const totalEpisodeFrames =
  beatDurationsInFrames.reduce((a, b) => a + b, 0) + 2 * FPS; // + 2s outro

export const LDAEpisode: React.FC = () => {
  React.useEffect(() => {
    loadFont();
  }, []);

  let cursor = 0;
  const sequences = BEATS.map((beat, i) => {
    const dur = beatDurationsInFrames[i];
    const from = cursor;
    cursor += dur;
    const Visual = beat.Visual;
    return (
      <Sequence key={beat.id} from={from} durationInFrames={dur}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
          <Audio src={staticFile(`audio/${beat.audio}`)} />
          <Visual />
          <BeatCaptions captions={beat.captions} />
        </AbsoluteFill>
      </Sequence>
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {sequences}
      <Sequence from={cursor} durationInFrames={2 * FPS}>
        <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
          <OutroVisual />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
