import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import beats from "./beats.json";
import { loadFont } from "../load-font";
import { COLORS, FONT_BOLD, FONT_UI } from "../theme";

const C = {
  bg: COLORS.bg,
  panel: "#101B2E",
  ink: COLORS.textMain,
  muted: COLORS.textDim,
  grid: "#233249",
  blue: COLORS.blue,
  red: COLORS.red,
  gold: COLORS.yellow,
};
const P = [
  [2, 3],
  [3, 4],
  [6, 7],
  [7, 10],
];
const M = [
  [2.5, 3.5],
  [6.5, 8.5],
];
const CENTRE = [4.5, 6];
const A0 = Math.atan2(5, 4),
  A1 = Math.atan2(-3, 10);
const Z = [11, 18, 39, 40];
const scoreIndex = (f: number) => (f < 169 ? 0 : f < 211 ? 1 : f < 239 ? 2 : 3);
const scoreLandings = [153, 177, 227, 247];
const names = ["A₁", "A₂", "B₁", "B₂"];
const px = (p: number[]) => [165 + p[0] * 60, 825 - p[1] * 60];
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => 1 - Math.pow(1 - clamp(v), 3);
const prog = (f: number, start: number, len: number) => ease((f - start) / len);
const color = (i: number) => (i < 2 ? C.blue : C.red);
const foot = (p: number[], a: number) => {
  const u = [Math.cos(a), Math.sin(a)];
  const d = (p[0] - CENTRE[0]) * u[0] + (p[1] - CENTRE[1]) * u[1];
  return [CENTRE[0] + d * u[0], CENTRE[1] + d * u[1]];
};
const fisher = (a: number) => {
  const x = Math.cos(a),
    y = Math.sin(a);
  return Math.pow(4 * x + 5 * y, 2) / (x * x + 4 * x * y + 5 * y * y);
};
const TOTAL_AUDIO = beats.reduce((s, b) => s + b.frames, 0);
export const TOTAL_FRAMES = TOTAL_AUDIO + 300;

type TxtProps = {
  x: number;
  y: number;
  children?: React.ReactNode;
  size?: number;
  fill?: string;
  weight?: number;
  anchor?: "start" | "middle" | "end";
  transform?: string;
};
type ChipProps = {
  x: number;
  y: number;
  w?: number;
  text: string;
  tint?: string;
};

const Txt: React.FC<TxtProps> = ({
  x,
  y,
  children,
  size = 28,
  fill = C.ink,
  weight = 500,
  anchor = "start",
  ...rest
}) => (
  <text
    x={x}
    y={y}
    fill={fill}
    fontSize={size}
    fontWeight={weight}
    textAnchor={anchor}
    fontFamily={FONT_UI}
    {...rest}
  >
    {children}
  </text>
);
const Chip: React.FC<ChipProps> = ({ x, y, w = 220, text, tint = C.gold }) => (
  <g>
    <rect
      x={x}
      y={y}
      width={w}
      height={48}
      rx={24}
      fill={tint}
      fillOpacity={0.09}
      stroke={tint}
      strokeOpacity={0.4}
    />
    <Txt
      x={x + w / 2}
      y={y + 32}
      size={23}
      fill={tint}
      weight={700}
      anchor="middle"
    >
      {text}
    </Txt>
  </g>
);
const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg
    width={960}
    height={960}
    viewBox="0 0 960 960"
    style={{ position: "absolute", left: 60, top: 415, overflow: "visible" }}
  >
    {children}
  </svg>
);

function Grid({ opacity = 1 }: { opacity?: number }) {
  return (
    <g opacity={opacity}>
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={"x" + i}
          x1={165 + i * 60}
          y1={105}
          x2={165 + i * 60}
          y2={825}
          stroke={C.grid}
          strokeWidth={1}
        />
      ))}
      {Array.from({ length: 13 }, (_, i) => (
        <line
          key={"y" + i}
          x1={105}
          y1={825 - i * 60}
          x2={825}
          y2={825 - i * 60}
          stroke={C.grid}
          strokeWidth={1}
        />
      ))}
      <path
        d="M 165 105 V 825 H 845"
        fill="none"
        stroke="#53647C"
        strokeWidth={2}
      />
      {[0, 2, 4, 6, 8, 10].map((i) => (
        <g key={i}>
          <Txt
            x={165 + i * 60}
            y={863}
            size={22}
            fill={C.muted}
            anchor="middle"
          >
            {i}
          </Txt>
          {i > 0 && (
            <Txt x={139} y={833 - i * 60} size={22} fill={C.muted} anchor="end">
              {i}
            </Txt>
          )}
        </g>
      ))}
      <Txt x={850} y={819} fill={C.muted} size={26}>
        x
      </Txt>
      <Txt x={150} y={88} fill={C.muted} size={26}>
        y
      </Txt>
    </g>
  );
}
function Dot({
  p,
  i,
  opacity = 1,
  label = true,
  r = 13,
}: {
  p: number[];
  i: number;
  opacity?: number;
  label?: boolean;
  r?: number;
}) {
  const [x, y] = px(p);
  const dx = [-23, 24, 25, 25][i],
    dy = [46, -18, 27, -15][i];
  return (
    <g opacity={opacity}>
      <circle cx={x} cy={y} r={r + 8} fill={color(i)} opacity={0.12} />
      <circle
        cx={x}
        cy={y}
        r={r}
        fill={color(i)}
        stroke={C.ink}
        strokeWidth={2}
      />
      {label && (
        <Txt x={x + dx} y={y + dy} fill={color(i)} size={26} weight={600}>
          {names[i] + " (" + p[0] + ", " + p[1] + ")"}
        </Txt>
      )}
    </g>
  );
}
function Mean({
  idx,
  t = 1,
  label = true,
}: {
  idx: number;
  t?: number;
  label?: boolean;
}) {
  const [x, y] = px(M[idx]);
  const col = idx === 0 ? C.blue : C.red;
  return (
    <g opacity={t}>
      <circle cx={x} cy={y} r={29} fill={C.bg} stroke={col} strokeWidth={2} />
      <path
        d={
          "M " +
          (x - 10) +
          " " +
          y +
          " H " +
          (x + 10) +
          " M " +
          x +
          " " +
          (y - 10) +
          " V " +
          (y + 10)
        }
        stroke={col}
        strokeWidth={4}
      />
      {label && (
        <>
          <path
            d={
              idx === 0
                ? "M " + x + " " + (y + 30) + " L 280 703"
                : "M " + (x + 30) + " " + y + " L 641 352"
            }
            stroke={col}
            fill="none"
            opacity={0.7}
          />
          <Txt
            x={idx === 0 ? 184 : 636}
            y={idx === 0 ? 740 : 393}
            fill={col}
            size={27}
            weight={700}
          >
            {idx === 0 ? "μA = (2.5, 3.5)" : "μB = (6.5, 8.5)"}
          </Txt>
        </>
      )}
    </g>
  );
}
function Axis({
  angle,
  t = 1,
  muted = false,
}: {
  angle: number;
  t?: number;
  muted?: boolean;
}) {
  const c = px(CENTRE),
    u = [Math.cos(angle), -Math.sin(angle)],
    d = 315;
  const a = [c[0] - u[0] * d, c[1] - u[1] * d],
    b = [c[0] + u[0] * d, c[1] + u[1] * d];
  return (
    <g opacity={t}>
      <line
        x1={a[0]}
        y1={a[1]}
        x2={mix(a[0], b[0], t)}
        y2={mix(a[1], b[1], t)}
        stroke={muted ? "#718299" : C.gold}
        strokeWidth={muted ? 3 : 5}
        strokeDasharray={muted ? "10 9" : undefined}
      />
      {!muted && (
        <polygon
          points={
            b[0] +
            "," +
            b[1] +
            " " +
            (b[0] - u[0] * 20 - u[1] * 9) +
            "," +
            (b[1] - u[1] * 20 + u[0] * 9) +
            " " +
            (b[0] - u[0] * 20 + u[1] * 9) +
            "," +
            (b[1] - u[1] * 20 - u[0] * 9)
          }
          fill={C.gold}
        />
      )}
    </g>
  );
}
function Rays({
  angle,
  amount = 1,
  ranges = false,
}: {
  angle: number;
  amount?: number;
  ranges?: boolean;
}) {
  return (
    <g>
      {ranges &&
        [0, 2].map((i) => {
          const a = px(foot(P[i], angle)),
            b = px(foot(P[i + 1], angle));
          return (
            <line
              key={i}
              x1={a[0]}
              y1={a[1]}
              x2={b[0]}
              y2={b[1]}
              stroke={color(i)}
              strokeWidth={14}
              opacity={0.65}
              strokeLinecap="round"
            />
          );
        })}
      {P.map((p, i) => {
        const a = px(p),
          b = px(foot(p, angle));
        return (
          <g key={i} opacity={amount}>
            <line
              x1={a[0]}
              y1={a[1]}
              x2={mix(a[0], b[0], amount)}
              y2={mix(a[1], b[1], amount)}
              stroke={color(i)}
              strokeWidth={2}
              strokeDasharray="5 7"
            />
            <circle
              cx={mix(a[0], b[0], amount)}
              cy={mix(a[1], b[1], amount)}
              r={8}
              fill={color(i)}
              stroke={C.bg}
              strokeWidth={2}
            />
          </g>
        );
      })}
    </g>
  );
}
function DataPlot({
  f,
  angle,
  ray = 0,
  means = false,
  labels = true,
  ghost = false,
}: {
  f: number;
  angle?: number;
  ray?: number;
  means?: boolean;
  labels?: boolean;
  ghost?: boolean;
}) {
  return (
    <>
      <Grid />
      {ghost && <Axis angle={A0} muted t={0.6} />}{" "}
      {angle !== undefined && <Axis angle={angle} />}{" "}
      {angle !== undefined && ray > 0 && (
        <Rays angle={angle} amount={ray} ranges />
      )}
      {P.map((p, i) => (
        <Dot key={i} p={p} i={i} opacity={prog(f, i * 5, 20)} label={labels} />
      ))}
      {means &&
        M.map((_, i) => <Mean key={i} idx={i} t={prog(f, 12 + i * 12, 20)} />)}
    </>
  );
}
function Legend() {
  return (
    <g transform="translate(122 927)">
      <circle r={7} fill={C.blue} />
      <Txt x={20} y={8} size={23} fill={C.muted}>
        Toy class A
      </Txt>
      <circle cx={230} r={7} fill={C.red} />
      <Txt x={250} y={8} size={23} fill={C.muted}>
        Toy class B
      </Txt>
      <Txt x={706} y={8} size={22} fill={C.muted} anchor="end">
        4 points · 2 features
      </Txt>
    </g>
  );
}

function Hook({ f }: { f: number }) {
  const reveal = prog(f, 58, 36),
    tableFade = 1 - prog(f, 58, 25);
  return (
    <Stage>
      <g opacity={tableFade}>
        <Chip x={80} y={35} w={300} text="MEERA'S DATA" tint={C.blue} />
        <Txt x={80} y={167} size={92} weight={800}>
          30
        </Txt>
        <Txt x={255} y={160} size={40} fill={C.muted}>
          measurements
        </Txt>
        {Array.from({ length: 30 }, (_, i) => {
          const x = 80 + (i % 6) * 136,
            y = 230 + Math.floor(i / 6) * 114;
          const t = prog(f, i * 1.4, 18);
          return (
            <g
              key={i}
              opacity={t}
              transform={"translate(0 " + 20 * (1 - t) + ")"}
            >
              <rect
                x={x}
                y={y}
                width={117}
                height={84}
                rx={13}
                fill={C.panel}
                stroke={i % 2 === 0 ? "#27577C" : "#354560"}
              />
              <Txt
                x={x + 59}
                y={y + 52}
                size={30}
                fill={C.muted}
                anchor="middle"
              >
                {"x" + (i + 1)}
              </Txt>
            </g>
          );
        })}
        <Txt x={80} y={875} size={30} fill={C.gold}>
          Which direction keeps the classes distinct?
        </Txt>
      </g>
      <g opacity={reveal} transform={"translate(0 " + 35 * (1 - reveal) + ")"}>
        <Chip x={100} y={15} w={425} text="START WITH A TOY EXAMPLE" />
        <DataPlot f={f - 68} />
        <Legend />
      </g>
    </Stage>
  );
}
function Naive({ f }: { f: number }) {
  const ray = prog(f, 67, 60);
  return (
    <Stage>
      <Chip x={95} y={12} w={270} text="TRY w = (4, 5)" />
      <DataPlot f={f + 60} angle={A0} ray={ray} labels={false} />
      <Mean idx={0} t={prog(f, 0, 25)} label={false} />
      <Mean idx={1} t={prog(f, 14, 25)} label={false} />
      <g opacity={prog(f, 35, 25)}>
        <path
          d="M 337 590 L 531 348"
          stroke={C.ink}
          strokeWidth={3}
          strokeDasharray="6 5"
        />
        <Txt
          x={352}
          y={485}
          size={28}
          fill={C.ink}
          transform="rotate(-51 352 485)"
        >
          centre → centre
        </Txt>
      </g>
      <g opacity={ray}>
        <rect
          x={627}
          y={118}
          width={233}
          height={127}
          rx={18}
          fill={C.panel}
          stroke={C.red}
          strokeOpacity={0.4}
        />
        <Txt x={650} y={158} size={20} fill={C.muted}>
          FISHER SCORE
        </Txt>
        <Txt x={650} y={217} size={54} weight={700}>
          7.61
        </Txt>
        <Txt x={112} y={910} fill={C.red} size={29} weight={600}>
          The red class stays stretched along this axis.
        </Txt>
      </g>
    </Stage>
  );
}
function Centres({ f }: { f: number }) {
  const t1 = prog(f, 30, 55),
    t2 = prog(f, 112, 55);
  return (
    <Stage>
      <Grid />
      {P.map((p, i) => (
        <Dot key={i} p={p} i={i} label={false} />
      ))}
      {P.map((p, i) => {
        const t = i < 2 ? t1 : t2,
          a = px(p),
          b = px(M[i < 2 ? 0 : 1]);
        return (
          <g key={i}>
            <line
              x1={a[0]}
              y1={a[1]}
              x2={b[0]}
              y2={b[1]}
              stroke={color(i)}
              strokeWidth={3}
              opacity={0.3}
            />
            <circle
              cx={mix(a[0], b[0], t)}
              cy={mix(a[1], b[1], t)}
              r={14}
              fill={color(i)}
              opacity={0.6}
            />
          </g>
        );
      })}
      <Mean idx={0} t={t1} />
      <Mean idx={1} t={t2} />
      <g opacity={t1}>
        <rect
          x={85}
          y={8}
          width={360}
          height={74}
          rx={14}
          fill={C.blue}
          fillOpacity={0.07}
        />
        <Txt x={109} y={55} size={28} fill={C.blue} weight={600}>
          (2 + 3) / 2 = 2.5
        </Txt>
      </g>
      <g opacity={t2}>
        <rect
          x={495}
          y={8}
          width={390}
          height={74}
          rx={14}
          fill={C.red}
          fillOpacity={0.07}
        />
        <Txt x={521} y={55} size={28} fill={C.red} weight={600}>
          (7 + 10) / 2 = 8.5
        </Txt>
      </g>
      <Legend />
    </Stage>
  );
}
function Spread({ f }: { f: number }) {
  const t = prog(f, 18, 45),
    [bx, by] = px(P[2]),
    [tx, ty] = px(P[3]);
  return (
    <Stage>
      <Grid opacity={0.7} />
      {[0, 2].map((i) => {
        const a = px(P[i]),
          b = px(P[i + 1]);
        return (
          <g key={i} opacity={t}>
            <line
              x1={a[0]}
              y1={a[1]}
              x2={b[0]}
              y2={b[1]}
              stroke={color(i)}
              strokeWidth={46}
              strokeLinecap="round"
              opacity={0.12}
            />
            <line
              x1={a[0]}
              y1={a[1]}
              x2={b[0]}
              y2={b[1]}
              stroke={color(i)}
              strokeWidth={4}
            />
          </g>
        );
      })}
      {P.map((p, i) => (
        <Dot key={i} p={p} i={i} label={false} />
      ))}
      <Mean idx={0} label={false} />
      <Mean idx={1} label={false} />
      <g opacity={prog(f, 42, 36)}>
        <path
          d={"M " + bx + " " + by + " H " + tx + " V " + ty}
          stroke={C.red}
          strokeWidth={3}
          strokeDasharray="7 5"
          fill="none"
        />
        <Txt x={bx + 24} y={by + 44} fill={C.red} size={26}>
          1 across
        </Txt>
        <Txt x={tx + 31} y={(by + ty) / 2} fill={C.red} size={28} weight={700}>
          3 up
        </Txt>
        <Txt x={tx + 31} y={(by + ty) / 2 + 37} fill={C.muted} size={24}>
          class B's lean
        </Txt>
      </g>
      <g opacity={prog(f, 94, 35)}>
        <rect x={105} y={12} width={496} height={68} rx={15} fill={C.panel} />
        <Txt x={132} y={57} size={27} fill={C.muted}>
          Measure deviations from each centre.
        </Txt>
      </g>
      <g opacity={prog(f, 127, 40)}>
        <Txt x={120} y={915} fill={C.gold} size={31}>
          Spread + lean become the scatter matrix.
        </Txt>
      </g>
    </Stage>
  );
}
function Rotate({ f }: { f: number }) {
  const t = prog(f, 33, 155),
    a = mix(A0, A1, t),
    j = fisher(a);
  return (
    <Stage>
      <DataPlot f={f + 40} angle={a} ray={1} labels={false} ghost />
      <g transform="translate(805 100)">
        <circle r={65} fill={C.panel} stroke={C.grid} strokeWidth={2} />
        <line
          x1={-50 * Math.cos(A0)}
          y1={50 * Math.sin(A0)}
          x2={50 * Math.cos(A0)}
          y2={-50 * Math.sin(A0)}
          stroke={C.muted}
          strokeDasharray="4 5"
        />
        <line
          x1={-50 * Math.cos(a)}
          y1={50 * Math.sin(a)}
          x2={50 * Math.cos(a)}
          y2={-50 * Math.sin(a)}
          stroke={C.gold}
          strokeWidth={4}
        />
        <circle r={5} fill={C.gold} />
      </g>
      <Chip
        x={100}
        y={12}
        w={290}
        text={t < 0.98 ? "ROTATE THE AXIS" : "w = (10, −3)"}
      />
      <g transform="translate(570 711)">
        <rect
          width={296}
          height={120}
          rx={18}
          fill={C.panel}
          stroke={C.gold}
          strokeOpacity={0.45}
        />
        <Txt x={23} y={37} size={20} fill={C.muted}>
          SEPARATION² / SCATTER
        </Txt>
        <Txt x={24} y={97} size={53} fill={C.gold} weight={700}>
          {j.toFixed(2)}
        </Txt>
        <Txt x={169} y={92} size={21} fill={C.muted}>
          was 7.61
        </Txt>
      </g>
      <Txt x={120} y={917} size={29} fill={C.gold} weight={600}>
        Watch class B's projected spread shrink.
      </Txt>
    </Stage>
  );
}
function Project({ f }: { f: number }) {
  const tracks = Z.map((z) => 130 + (z - 5) * 18);
  const railT = prog(f, 13, 35),
    k = scoreIndex(f);
  return (
    <Stage>
      <g transform="translate(28 -20) scale(0.94)">
        <Grid opacity={0.45} />
        <Axis angle={A1} />
        {P.map((p, i) => (
          <Dot key={i} p={p} i={i} label={false} opacity={i === k ? 1 : 0.45} />
        ))}
        {P.map((p, i) => {
          const t = prog(f, 30 + i * 15, 28),
            a = px(p),
            b = px(foot(p, A1));
          return (
            <g key={i} opacity={t}>
              <line
                x1={a[0]}
                y1={a[1]}
                x2={b[0]}
                y2={b[1]}
                stroke={color(i)}
                strokeDasharray="5 6"
                strokeWidth={2}
              />
              <circle
                cx={mix(a[0], b[0], t)}
                cy={mix(a[1], b[1], t)}
                r={11}
                fill={color(i)}
              />
            </g>
          );
        })}
      </g>
      <g opacity={railT}>
        <line
          x1={125}
          y1={840}
          x2={860}
          y2={840}
          stroke={C.muted}
          strokeWidth={2}
        />
        <Txt x={855} y={886} size={24} fill={C.muted}>
          z
        </Txt>
        <Txt x={117} y={740} size={24} fill={C.muted}>
          ONE-DIMENSIONAL SCORES
        </Txt>
      </g>
      {P.map((p, i) => {
        const t = prog(f, scoreLandings[i] - 18, 18),
          b = px(foot(p, A1)),
          x = tracks[i],
          y = 840;
        return (
          <g key={i} opacity={prog(f, scoreLandings[i] - 18, 10)}>
            <circle
              cx={mix(b[0] * 0.94 + 28, x, t)}
              cy={mix(b[1] * 0.94 - 20, y, t)}
              r={8}
              fill={color(i)}
            />
            <g opacity={t}>
              <line
                x1={x}
                y1={y - 12}
                x2={x}
                y2={y + 12}
                stroke={color(i)}
                strokeWidth={3}
              />
              <Txt
                x={x}
                y={i === 3 ? 899 : 805}
                size={34}
                fill={color(i)}
                weight={700}
                anchor="middle"
              >
                {Z[i]}
              </Txt>
            </g>
          </g>
        );
      })}
      <g opacity={prog(f, 269, 24)}>
        <rect
          x={tracks[1] + 17}
          y={826}
          width={tracks[2] - tracks[1] - 34}
          height={28}
          rx={14}
          fill={C.gold}
          opacity={0.12}
        />
        <path
          d={
            "M " +
            (tracks[1] + 18) +
            " 872 V 883 H " +
            (tracks[2] - 18) +
            " V 872"
          }
          stroke={C.gold}
          fill="none"
          strokeWidth={2}
        />
        <Txt
          x={(tracks[1] + tracks[2]) / 2}
          y={927}
          fill={C.gold}
          size={28}
          anchor="middle"
        >
          a clean gap
        </Txt>
      </g>
    </Stage>
  );
}
function ScaleUp({ f }: { f: number }) {
  const t = prog(f, 28, 85),
    out = prog(f, 104, 58);
  return (
    <Stage>
      <Chip x={70} y={15} w={340} text="REAL DATASET SHAPE" tint={C.blue} />
      <Txt x={65} y={164} size={84} weight={800}>
        569
      </Txt>
      <Txt x={257} y={159} size={39} fill={C.muted}>
        samples
      </Txt>
      <Txt x={70} y={252} size={28} fill={C.blue}>
        30 input features
      </Txt>
      <Txt x={741} y={252} size={28} fill={C.gold} anchor="middle">
        1 score
      </Txt>
      {Array.from({ length: 12 }, (_, row) => (
        <g key={row} opacity={prog(f, row * 3, 28)}>
          {Array.from({ length: 30 }, (_, col) => (
            <rect
              key={col}
              x={70 + col * 15.8}
              y={296 + row * 34}
              width={11.8}
              height={24}
              rx={3}
              fill={C.blue}
              opacity={0.25 + (0.5 * ((row + col) % 4)) / 3}
            />
          ))}
          <rect
            x={714}
            y={296 + row * 34}
            width={53}
            height={24}
            rx={5}
            fill={C.gold}
            opacity={out}
          />
        </g>
      ))}
      <path
        d="M 573 491 H 678 M 661 475 L 678 491 L 661 507"
        stroke={C.gold}
        strokeWidth={5}
        strokeDasharray={t < 1 ? "8 8" : undefined}
        opacity={t}
        fill="none"
      />
      <Txt x={558} y={430} size={28} fill={C.gold}>
        wᵀx
      </Txt>
      <g opacity={prog(f, 154, 38)}>
        <rect
          x={69}
          y={785}
          width={715}
          height={108}
          rx={20}
          fill={C.panel}
          stroke={C.grid}
        />
        <Txt x={100} y={830} fill={C.ink} size={29} weight={700}>
          Same method. More dimensions.
        </Txt>
        <Txt x={100} y={869} fill={C.muted} size={24}>
          Toy direction checked against scikit-learn.
        </Txt>
      </g>
      <Txt x={70} y={943} size={21} fill={C.muted}>
        Shape illustration; blocks are not patient measurements.
      </Txt>
    </Stage>
  );
}
function Comparison({ f }: { f: number }) {
  const naive = [23, 32, 59, 78].map((z) => (z - 48) / Math.sqrt(221));
  const lda = Z.map((z) => (z - 27) / 5);
  const sx = (v: number) => 480 + v * 94;
  return (
    <Stage>
      <Chip
        x={74}
        y={12}
        w={700}
        text="BOTH ROWS USE EQUAL WITHIN-CLASS SCATTER"
        tint={C.blue}
      />
      {[naive, lda].map((values, row) => {
        const y = 310 + row * 342,
          t = prog(f, row * 30, 50),
          j = row === 0 ? 7.61 : 25;
        return (
          <g key={row} opacity={t}>
            <Txt
              x={83}
              y={y - 117}
              fill={row === 0 ? C.muted : C.gold}
              size={28}
              weight={700}
            >
              {row === 0 ? "CENTRES ALONE" : "LDA: ACCOUNT FOR THE SPREAD"}
            </Txt>
            <line
              x1={83}
              y1={y}
              x2={867}
              y2={y}
              stroke={C.grid}
              strokeWidth={3}
            />
            <rect
              x={sx(values[1]) + 9}
              y={y - 16}
              width={sx(values[2]) - sx(values[1]) - 18}
              height={32}
              rx={16}
              fill={C.gold}
              opacity={row === 0 ? 0.06 : 0.15}
            />
            {[0, 2].map((i) => (
              <line
                key={i}
                x1={sx(values[i])}
                y1={y}
                x2={sx(values[i + 1])}
                y2={y}
                stroke={color(i)}
                strokeWidth={12}
                strokeLinecap="round"
                opacity={0.65}
              />
            ))}
            {values.map((v, i) => (
              <g key={i}>
                <circle
                  cx={sx(v)}
                  cy={y}
                  r={8}
                  fill={color(i)}
                  stroke={C.bg}
                  strokeWidth={2}
                />
                <Txt
                  x={sx(v)}
                  y={y + (i === 3 ? 60 : -35)}
                  fill={color(i)}
                  size={24}
                  anchor="middle"
                >
                  {names[i]}
                </Txt>
              </g>
            ))}
            <Txt x={84} y={y + 98} fill={C.muted} size={25}>
              Fisher score
            </Txt>
            <Txt
              x={865}
              y={y + 104}
              fill={row === 0 ? C.ink : C.gold}
              size={46}
              weight={800}
              anchor="end"
            >
              {j.toFixed(2)}
            </Txt>
          </g>
        );
      })}
      <g opacity={prog(f, 109, 34)}>
        <Txt x={84} y={890} fill={C.gold} size={37} weight={700}>
          3.29× better separation-to-spread score
        </Txt>
        <Txt x={84} y={937} fill={C.muted} size={25}>
          PCA maximizes total variance; LDA uses class labels.
        </Txt>
      </g>
    </Stage>
  );
}

const headings = [
  ["01 / THE PROBLEM", "Thirty features.", "One direction."],
  ["02 / THE FIRST GUESS", "The direct guess", "misses the spread."],
  ["03 / FIND THE CENTRES", "Find each", "class centre."],
  ["04 / WITHIN-CLASS SCATTER", "Measure the lean", "inside each class."],
  ["05 / CHOOSE A DIRECTION", "Now turn away", "from that lean."],
  ["06 / PROJECT THE POINTS", "Two measurements.", "One score."],
  ["07 / SCALE THE METHOD", "Same operation.", "Thirty features."],
  ["08 / THE TAKEAWAY", "Far apart.", "Tight within."],
];
const Visuals = [
  Hook,
  Naive,
  Centres,
  Spread,
  Rotate,
  Project,
  ScaleUp,
  Comparison,
];
function Equation({ idx, f }: { idx: number; f: number }) {
  let small = "",
    main: React.ReactNode = "";
  if (idx === 0) {
    small = "THE TEACHING EXAMPLE";
    main = (
      <>
        <span style={{ color: C.blue }}>2 features</span>
        <span style={{ color: C.muted }}> → </span>
        <span style={{ color: C.gold }}>1 useful direction</span>
      </>
    );
  }
  if (idx === 1) {
    small = "THE LIMITATION";
    main = "Separates the toy points. Does not optimize spread.";
  }
  if (idx === 2) {
    small = "MEAN DIFFERENCE";
    main = "(6.5, 8.5) − (2.5, 3.5) = (4, 5)";
  }
  if (idx === 3) {
    small = "POOL BOTH CLASSES";
    main = (
      <span>
        S<sub>w</sub> = S<sub>A</sub> + S<sub>B</sub> ={" "}
        <span
          style={{
            display: "inline-flex",
            verticalAlign: "middle",
            borderLeft: "2px solid " + C.gold,
            borderRight: "2px solid " + C.gold,
            padding: "0 16px",
            marginLeft: 12,
            gap: 24,
            fontSize: 32,
          }}
        >
          <span>
            1<br />2
          </span>
          <span>
            2<br />5
          </span>
        </span>
      </span>
    );
  }
  if (idx === 4) {
    small = "CORRECT THE MEAN DIFFERENCE FOR WITHIN-CLASS SCATTER";
    main = (
      <span>
        w = S<sub>w</sub>
        <sup>−1</sup>(μ<sub>B</sub> − μ<sub>A</sub>) ={" "}
        <span style={{ color: C.gold }}>(10, −3)</span>
      </span>
    );
  }
  if (idx === 5) {
    const k = scoreIndex(f);
    small = "PROJECT " + names[k] + " WITH z = 10x − 3y";
    main = (
      <span>
        10 × {P[k][0]} − 3 × {P[k][1]} ={" "}
        <span style={{ color: color(k), fontWeight: 800 }}>{Z[k]}</span>
      </span>
    );
  }
  if (idx === 6) {
    small = "DIMENSION REDUCTION";
    main = "569 × 30  →  569 × 1";
  }
  if (idx === 7) {
    small = "THE ACTUAL OBJECTIVE";
    main = "Maximize separation² ÷ within-class scatter";
  }
  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        top: 1405,
        width: 936,
        minHeight: 147,
        boxSizing: "border-box",
        border: "1px solid #30405A",
        borderRadius: 22,
        background: "linear-gradient(125deg,#142238,#101A2C)",
        padding: "20px 26px",
      }}
    >
      <div
        style={{
          fontSize: 19,
          fontWeight: 700,
          letterSpacing: 2,
          color: C.muted,
          marginBottom: 12,
        }}
      >
        {small}
      </div>
      <div
        style={{
          fontSize: idx === 1 ? 31 : idx === 7 ? 32 : idx === 4 ? 34 : 38,
          lineHeight: 1.2,
          letterSpacing: -0.6,
          color: C.ink,
        }}
      >
        {main}
      </div>
    </div>
  );
}
function Subtitles({ idx, f }: { idx: number; f: number }) {
  const caps = beats[idx].captions,
    pages: (typeof caps)[] = [];
  let current: typeof caps = [],
    chars = 0;
  for (const word of caps) {
    if (
      current.length &&
      (current.length >= 7 || chars + word.text.trim().length > 42)
    ) {
      pages.push(current);
      current = [];
      chars = 0;
    }
    current.push(word);
    chars += word.text.trim().length + 1;
  }
  if (current.length) pages.push(current);
  const ms = (f / 30) * 1000;
  const page = pages.find(
    (p, i) =>
      ms >= p[0].startMs &&
      ms < (pages[i + 1]?.[0].startMs ?? p[p.length - 1].endMs + 350),
  );
  if (!page) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 1620,
        left: 100,
        width: 850,
        textAlign: "center",
        fontSize: 43,
        lineHeight: 1.36,
        fontWeight: 600,
        letterSpacing: -0.8,
      }}
    >
      {page.map((w, i) => (
        <React.Fragment key={i}>
          <span
            style={{ color: ms >= w.startMs && ms < w.endMs ? C.gold : C.ink }}
          >
            {w.text.trim()}
          </span>{" "}
        </React.Fragment>
      ))}
    </div>
  );
}
function Beat({ idx }: { idx: number }) {
  const f = useCurrentFrame(),
    b = beats[idx],
    head = headings[idx],
    Visual = Visuals[idx];
  const enter = prog(f, 0, 14),
    fade = interpolate(f, [b.frames - 6, b.frames], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Audio src={staticFile(b.audio)} />
      <div
        style={{
          position: "absolute",
          left: 76,
          top: 156,
          color: C.gold,
          letterSpacing: 3,
          fontSize: 22,
          fontWeight: 700,
          opacity: enter,
        }}
      >
        {head[0]}
      </div>
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 213,
          fontFamily: FONT_BOLD,
          fontSize: 77,
          lineHeight: 1.02,
          letterSpacing: -3.3,
          fontWeight: 800,
          transform: "translateY(" + 16 * (1 - enter) + "px)",
          opacity: enter,
        }}
      >
        {head[1]}
        <br />
        <span style={{ color: idx === 4 || idx === 7 ? C.gold : C.ink }}>
          {head[2]}
        </span>
      </div>
      <Visual f={f} />
      <Equation idx={idx} f={f} />
      <Subtitles idx={idx} f={f} />
    </AbsoluteFill>
  );
}
export function VisualLDA() {
  React.useEffect(() => {
    loadFont();
  }, []);
  const f = useCurrentFrame();
  let start = 0;
  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        color: C.ink,
        fontFamily: FONT_UI,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 95% 5%,rgba(36,91,141,.21),transparent 55%),radial-gradient(ellipse at 0% 85%,rgba(33,57,102,.15),transparent 45%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 65,
          left: 74,
          display: "flex",
          alignItems: "center",
          gap: 17,
        }}
      >
        <span
          style={{ background: C.blue, width: 8, height: 25, borderRadius: 3 }}
        />
        <span
          style={{
            fontSize: 23,
            fontWeight: 700,
            letterSpacing: 2,
            color: C.muted,
          }}
        >
          ML FOR JAVA DEVELOPERS
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          right: 77,
          top: 65,
          fontSize: 23,
          color: C.muted,
        }}
      >
        EP 01 <span style={{ color: C.gold }}> / LDA</span>
      </div>
      {beats.map((b, idx) => {
        const from = start;
        start += b.frames;
        return (
          <Sequence key={b.id} from={from} durationInFrames={b.frames}>
            <Beat idx={idx} />
          </Sequence>
        );
      })}
      {f >= TOTAL_AUDIO && (
        <>
          <div
            style={{
              position: "absolute",
              left: 73,
              top: 164,
              color: C.gold,
              fontSize: 22,
              letterSpacing: 3,
            }}
          >
            THE IDEA TO KEEP
          </div>
          <div
            style={{
              position: "absolute",
              left: 72,
              top: 215,
              fontFamily: FONT_BOLD,
              fontSize: 85,
              lineHeight: 1.03,
              letterSpacing: -2,
            }}
          >
            Far apart.
            <br />
            Tight within.
          </div>
          <Comparison f={250} />
          <Equation idx={7} f={250} />
          <div
            style={{
              position: "absolute",
              left: 75,
              right: 75,
              top: 1628,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16,
            }}
          >
            {[
              ["01 · CENTRES", "Find the class means", C.blue],
              ["02 · SCATTER", "Measure each class's lean", C.red],
              ["03 · PROJECT", "Keep the useful direction", C.gold],
            ].map(([label, text, tint], i) => {
              const show = prog(f - TOTAL_AUDIO, i * 34, 24);
              return (
                <div
                  key={label}
                  style={{
                    minHeight: 94,
                    boxSizing: "border-box",
                    padding: "17px 17px",
                    borderRadius: 16,
                    border: "1px solid " + tint + "66",
                    background: C.panel,
                    opacity: show,
                    transform: "translateY(" + 12 * (1 - show) + "px)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      letterSpacing: 1.1,
                      color: tint,
                      marginBottom: 8,
                    }}
                  >
                    {label}
                  </div>
                  <div style={{ fontSize: 19, color: C.ink }}>{text}</div>
                </div>
              );
            })}
          </div>
          <div
            style={{
              position: "absolute",
              top: 1764,
              width: "100%",
              textAlign: "center",
              fontSize: 25,
              color: C.muted,
            }}
          >
            One concept. Understood visually.
          </div>
        </>
      )}
      <div
        style={{
          position: "absolute",
          left: 77,
          right: 77,
          top: 1815,
          height: 4,
          background: C.grid,
          borderRadius: 2,
        }}
      >
        <div
          style={{
            height: 4,
            width: (100 * f) / (TOTAL_FRAMES - 1) + "%",
            background: C.gold,
            borderRadius: 2,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 77,
          top: 1841,
          fontSize: 18,
          letterSpacing: 1.6,
          color: "#6B7E98",
        }}
      >
        YOUR NOTEBOOK → ANIMATED MECHANISM
      </div>
      <div
        style={{
          position: "absolute",
          right: 77,
          top: 1841,
          fontSize: 18,
          color: "#6B7E98",
        }}
      >
        {Math.floor(f / 30)
          .toString()
          .padStart(2, "0")}{" "}
        / 78s
      </div>
    </AbsoluteFill>
  );
}
