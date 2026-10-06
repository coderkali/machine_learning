// DAF Trailer · Part 1 — "Why this project?" (claude/daf/trailer/script_v5.md).
// One storyteller (narrator mascot), Asha shown only, Rishi speaks only on his yellow doubt card.
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { draw, enter, pop, T } from "../../shared/anim";
import { Asha, CastCard, DoubtCard, Rishi, Silhouette } from "../../shared/daf/Cast";
import { DevMascot } from "../../shared/DevMascot";
import { Backdrop, CaptionPill, ChapterBar, Chip, Header, K, Tab, TermCard, tilt, TimelineProvider, TitleCard, useCues, useMouth, useTimeline, Workspace } from "../../shared/explainer/kit";
import type { EpisodeMeta, Timeline } from "../../shared/types";

export const Day211: React.FC<{ timeline: Timeline; meta: EpisodeMeta }> = ({ timeline, meta }) => (
  <TimelineProvider value={timeline}><Scene meta={meta} /></TimelineProvider>
);

const SLOT = [160, 484, 808]; // character centres inside the stage (content width 968)
const RISHI_BEATS = ["rishi_hi"];
const JAVA = "#E76F00";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** ip() that tolerates beats missing from a sample timeline (cue = Infinity). */
const ip = (v: number, inR: number[], outR: number[]) => (inR.every(Number.isFinite) ? interpolate(v, inR, outR, clamp) : outR[0]);

// The 40 learning notebooks (MACHINE_LEARNING/01_Python, 02_DataScience, 04_ML). Spoken ones carry their cue word.
const TOPICS: [string, string?][] = [
  ["Python", "Python"], ["Pandas", "Pandas"], ["Data collection"], ["Data cleaning", "Cleaning"], ["Missing values", "missing"],
  ["Encoding"], ["Outliers", "outliers"], ["Scaling", "scaling"], ["Duplicates"], ["Transformers"],
  ["Feature select"], ["Preprocessing"], ["Train/test split"], ["EDA"], ["Linear reg", "Linear"],
  ["Multiple LR"], ["Polynomial"], ["Ridge", "Ridge"], ["Lasso", "Lasso"], ["ElasticNet"],
  ["Cost functions"], ["Cross-validation", "cross-validation"], ["Evaluation"], ["ROC & AUC"], ["Tree classif.", "decision"],
  ["Tree regress.", "decision"], ["Naive Bayes"], ["KNN"], ["SVM"], ["K-Means"],
  ["Hierarchical"], ["Tuning"], ["Ensembles", "ensembles"], ["Attrition proj."], ["LDA"],
  ["Save models"], ["Robust reg"], ["PCA"], ["Logistic reg"], ["Variables"],
];

/** 1 while inside [a, b), with quick fades at both ends. */
const live = (f: number, a: number, b: number) => (f < a || f >= b + T.exit ? 0 : Math.min(enter(f, a, 6), 1 - enter(f, b, T.exit)));

function Skyline({ haze, top = 542 }: { haze: number; top?: number }) {
  const blocks = [[0, 120], [70, 170], [150, 110], [230, 210], [330, 140], [560, 180], [650, 120], [730, 230], [830, 150], [900, 190]];
  return (
    <svg viewBox="0 0 968 240" width={968} height={240} style={{ position: "absolute", left: 0, top }}>
      {blocks.map(([x, h]) => <rect key={x} x={x} y={240 - h} width={74} height={h} fill="#9AA6B6" />)}
      <path d="M410 240 L410 70 L560 70 L560 240 L520 240 L520 130 Q485 95 450 130 L450 240 Z" fill="#7C8A9C" />
      <rect x={398} y={52} width={174} height={22} fill="#7C8A9C" />
      <rect x={0} y={0} width={968} height={240} fill={`rgba(160,138,104,${haze})`} />
    </svg>
  );
}

const Box = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ position: "absolute", background: "#fff", border: `5px solid ${K.ink}`, borderRadius: 20, boxShadow: `8px 8px 0 ${K.ink}`, ...style }}>{children}</div>
);
const Strike = ({ p, color = K.red }: { p: number; color?: string }) => (
  <div style={{ position: "absolute", left: -10, right: -10, top: "50%", height: 8, background: color, transform: `rotate(-8deg) scaleX(${p})`, transformOrigin: "left", borderRadius: 4 }} />
);

function Knot() {
  return (
    <svg viewBox="0 0 200 120" width={200} height={120}>
      <path d="M10 60 C40 0 70 120 100 60 S160 0 190 60 M20 30 C80 110 120 -10 180 90 M30 100 C70 20 140 120 170 20" fill="none" stroke={K.red} strokeWidth={7} strokeLinecap="round" />
    </svg>
  );
}

// Shape only (no values on screen): calm days, then a jump over the Poor line on day 7.
const REAL = [58, 54, 62, 57, 63, 68, 150, 138, 82, 70];
const PERSIST = [60, ...REAL.slice(0, -1)];
const dx = (i: number) => 50 + i * 74;
const vy = (v: number) => 420 - v * 2.3;
/** Path through the first `p` points; `p` may be fractional, so the line grows smoothly. */
const path = (vals: number[], p: number) => {
  const n = Math.max(0, Math.min(vals.length - 1, p));
  const k = Math.floor(n);
  const pts = vals.slice(0, k + 1).map((v, i) => [dx(i), vy(v)]);
  if (n > k) pts.push([dx(k) + (dx(k + 1) - dx(k)) * (n - k), vy(vals[k] + (vals[k + 1] - vals[k]) * (n - k))]);
  return pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
};

function Catch({ f, c, from }: { f: number; c: Record<string, number>; from: number }) {
  // Calm days draw quickly at the start; on "fails" the line jumps over 91 in ~0.3 s, then finishes.
  const all = f < c.fails ? ip(f, [from + 2, from + 14], [0, 5]) : ip(f, [c.fails, c.fails + 10, c.matter, c.matter + 10], [5, 6, 6, 9]);
  const missed = f >= c.fails + 10; // the red ring pulses on the jump while it is described
  return (
    <>
      <svg viewBox="0 0 800 460" width={800} height={460} style={{ position: "absolute", left: 170, top: 20 }}>
        <rect x={20} y={vy(250)} width={740} height={vy(91) - vy(250)} fill="rgba(229,57,53,.08)" />
        <line x1={20} x2={760} y1={vy(91)} y2={vy(91)} stroke={K.red} strokeWidth={5} strokeDasharray="16 10" />
        <path d={path(PERSIST, all)} fill="none" stroke="#9AA6B6" strokeWidth={8} strokeDasharray="16 12" strokeLinejoin="round" />
        <path d={path(REAL, all)} fill="none" stroke={K.blue} strokeWidth={9} strokeLinejoin="round" />
        {missed && <circle cx={dx(6)} cy={vy(REAL[6])} r={22 + 4 * Math.sin(f / 3)} fill="none" stroke={K.red} strokeWidth={6} />}
        {missed && <circle cx={dx(6)} cy={vy(PERSIST[6])} r={14} fill="#9AA6B6" stroke={K.ink} strokeWidth={4} />}
        {f >= c.late && (
          <g opacity={enter(f, c.late)}>
            <path d={`M${dx(6)} ${vy(REAL[6]) - 40} L${dx(7)} ${vy(REAL[6]) - 40}`} stroke={K.ink} strokeWidth={5} markerEnd="" />
          </g>
        )}
      </svg>
      {/* Labels are HTML, not SVG <text>: SVG text jittered between frames in parallel renders. */}
      <div style={{ position: "absolute", left: 170 + 560, top: 20 + vy(91) - 50, width: 200, textAlign: "right", fontFamily: K.head, fontSize: 34, color: K.red }}>91 · POOR</div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{ position: "absolute", left: 170 + dx(i) - 15, top: 20 + vy(REAL[i]) - 58, width: 30, textAlign: "center", fontSize: 34, fontWeight: 900, color: K.green, opacity: enter(f, c.works + i * 3) }}>✓</div>
      ))}
      <div style={{ position: "absolute", left: 200, top: 20 + 424, display: "flex", gap: 30, fontSize: 24, fontWeight: 800 }}>
        <span style={{ color: K.blue }}>━ real air</span>
        <span style={{ color: "#7C8A9C" }}>┅ persistence</span>
      </div>
      <div style={{ position: "absolute", left: 200, top: 480, opacity: 1 - enter(f, c.fails, 8) }}>
        <div style={pop(f, c.works)}><Chip label="😊 calm days: the rival is right" color={K.green} size={30} /></div>
      </div>
      <div style={{ position: "absolute", left: 200, top: 480, ...pop(f, c.fails) }}>
        <Chip label="😱 the jump: the rival misses it" color={K.red} size={30} />
      </div>
      <div style={{ position: "absolute", left: 540, top: 300, ...pop(f, c.matter + 6) }}>
        <Chip label="⚠ 600 kids outside" color={K.red} size={28} />
      </div>
      <div style={{ position: "absolute", left: 640, top: 380, ...tilt(pop(f, c.late), 3) }}>
        <TermCard text="1 DAY LATE" color={K.ink} size={52} />
      </div>
      <div style={{ position: "absolute", left: 200, top: 560, display: "flex", gap: 16 }}>
        {[["🚩", "wind drops", c.wind], ["🔥", "crop-burning smoke", c.smoke], ["🪔", "after Diwali", c.diwali]].map(([icon, label, a]) => (
          <div key={label as string} style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: `4px solid ${K.ink}`, borderRadius: 16, padding: "10px 14px", fontWeight: 900, fontSize: 24, ...pop(f, a as number) }}>
            <span style={{ fontSize: 36 }}>{icon as string}</span>{label as string}
          </div>
        ))}
      </div>
    </>
  );
}

function Scene({ meta }: { meta: EpisodeMeta }) {
  const f = useCurrentFrame();
  const tl = useTimeline();
  const { at, start, end } = useCues();
  const mouth = useMouth(f);
  const rishiTalking = RISHI_BEATS.some((id) => f >= start(id) && f < end(id));

  const c = {
    python: at("journey", "Python"), forty: at("journey", "Forty"), notebook: at("journey", "notebook"),
    catch_: at("gap", "catch"), instruction: at("gap", "instruction"), clean: at("gap", "clean"), apply: at("gap", "Apply"), never: at("gap", "never"), csv: at("gap", "CSV"), problem: at("gap", "problem"),
    collections: at("java", "collections"), streams: at("java", "streams"), spring: at("java", "Spring"), building: at("java", "Building"), skill: at("java", "skill"),
    raw: at("project", "raw"), running: at("project", "running"), together: at("project", "together"), one: at("project", "one", 2),
    which: at("why_delhi", "which"), real: at("why_delhi", "Real"), free: at("why_delhi", "free"), matters: at("why_delhi", "matters"), people: at("why_delhi", "people"),
    answer: at("why_delhi", "answer"), right: at("why_delhi", "right"), delhi: at("why_delhi", "Delhis"),
    winter: at("winter", "winter"), rare: at("winter", "rare"), safe: at("winter", "safe"),
    weather: at("not_weather", "weather"), air: at("not_weather", "air"), pollution: at("not_weather", "pollution"), clue: at("not_weather", "clue"),
    whom: at("for_whom", "whom"), number: at("for_whom", "number"), nobody: at("for_whom", "nobody"), introduce: at("for_whom", "introduce"),
    asha: at("asha", "Asha"), school: at("asha", "school"), six: at("asha", "six"), outside: at("asha", "outside"), answerA: at("asha", "answer"),
    rishi: at("rishi_intro", "Rishi"), java: at("rishi_intro", "Java"), stop: at("rishi_intro", "stop"),
    works: at("catch", "works"), fails: at("catch", "fails"), matter: at("catch", "matter"), wind: at("catch", "wind"), smoke: at("catch", "smoke"),
    diwali: at("catch", "Diwali"), late: at("catch", "late"),
    remember: at("recall", "remember"), rProject: at("recall", "project"), rTomorrow: at("recall", "tomorrow"), rThree: at("recall", "Three"), rTwo: at("recall", "two"),
    rival: at("rival", "rival"), habit: at("rival", "habit"), tomorrow: at("rival", "tomorrow"), persistence: at("rival", "persistence"), beat: at("rival", "beat"),
  };
  const chapters = (meta.chapters ?? []).map((ch) => ({ label: ch.label, from: start(ch.beat) }));
  const sec = (a: string, b: string) => live(f, start(a), start(b));
  const castOn = f >= c.introduce;
  const walk = enter(f, c.introduce, 40);
  const tabOn = (a: string, b?: string) => f >= start(a) && (!b || f < start(b));
  const pointing = [["why_delhi", c.which, c.real], ["for_whom", c.whom, c.number]].some(([, a, b]) => f >= (a as number) && f < (b as number));

  return (
    <AbsoluteFill style={{ fontFamily: K.ui, overflow: "hidden" }}>
      <Audio src={staticFile(tl.audio)} />
      <Backdrop />
      <Header f={f} day={meta.day} title={meta.title} badge={meta.badge} />
      <ChapterBar f={f} chapters={chapters} />
      <Workspace f={f} tabs={<>
        <Tab label="📓 notebooks/" active={tabOn("journey", "java")} />
        <Tab label="☕ Service.java" active={tabOn("java", "project")} style={pop(f, start("java"))} />
        <Tab label="⚙ project/" active={tabOn("project", "for_whom")} style={pop(f, start("project"))} />
        <Tab label="▦ cast.json" active={tabOn("for_whom")} style={pop(f, start("for_whom"))} />
      </>}>
        {/* ── journey + gap: 40 notebooks, then the one that was too clean ── */}
        <div style={{ opacity: sec("journey", "java") * (f >= c.catch_ ? 1 - 0.8 * enter(f, c.catch_, 10) : 1) }}>
          {TOPICS.map(([name, word], i) => {
            const cueAt = word ? at("journey", word) : Infinity;
            const appear = Math.min(ip(i, [0, 39], [c.python, c.forty]), cueAt);
            const hot = f >= cueAt && f < cueAt + 24;
            const wave = f >= c.forty ? 6 * Math.max(0, Math.sin((f - c.forty) / 5 - i * 0.35)) : 0;
            return (
              <div key={name} style={{ position: "absolute", left: 195 + (i % 5) * 152, top: 16 + Math.floor(i / 5) * 60 - wave, width: 142, height: 50, borderRadius: 10, border: `3px solid ${word && f >= cueAt ? K.ink : K.line}`, background: hot ? K.yellow : word && f >= cueAt ? "#FFF6BF" : "#fff", display: "flex", alignItems: "center", gap: 6, padding: "0 8px", boxSizing: "border-box", fontSize: 17, fontWeight: 800, color: K.ink, whiteSpace: "nowrap", overflow: "hidden", ...pop(f, appear, 6) }}>
                <span style={{ fontSize: 16 }}>📓</span>{name}
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 360, top: 540, ...tilt(pop(f, c.forty), -3), opacity: sec("journey", "gap") }}>
          <TermCard text="40 NOTEBOOKS" color={K.blue} size={84} />
        </div>
        <div style={{ opacity: sec("gap", "java") }}>
          <Box style={{ left: 230, top: 40, width: 540, height: 330, padding: 24, boxSizing: "border-box", ...pop(f, c.clean) }}>
            <div style={{ fontFamily: K.mono, fontWeight: 900, fontSize: 26, color: K.muted }}>▦ data.csv · neat</div>
            {[0, 1, 2, 3].map((r) => (
              <div key={r} style={{ display: "flex", gap: 10, marginTop: 12, ...pop(f, c.clean + 6 + r * 8) }}>
                {[160, 120, 140].map((w, j) => <div key={j} style={{ width: w, height: 22, borderRadius: 6, background: r === 0 ? K.blue : "#E2E8F0" }} />)}
              </div>
            ))}
            <div style={{ marginTop: 22, background: "#1E2533", color: "#E6EDF3", fontFamily: K.mono, fontSize: 30, padding: "10px 16px", borderRadius: 10, ...pop(f, c.apply) }}>
              <span style={{ color: "#79C0FF" }}>Ridge</span>().fit(X, y)
            </div>
            <Strike p={draw(f, c.never)} />
          </Box>
          <div style={{ position: "absolute", left: 560, top: 6, ...tilt(pop(f, c.instruction), 4) }}>
            <Chip label="📋 clear instruction" color={K.green} size={26} />
          </div>
          <div style={{ position: "absolute", left: 790, top: 120, ...pop(f, c.csv) }}>
            <div style={{ position: "relative", fontFamily: K.head, fontSize: 54, color: K.muted, border: `4px solid ${K.muted}`, borderRadius: 12, padding: "0 12px", background: "#fff" }}>CSV<Strike p={draw(f, c.csv + 4)} /></div>
          </div>
          <div style={{ position: "absolute", left: 300, top: 400, display: "flex", alignItems: "center", gap: 20, transform: `translateY(${-200 * (1 - enter(f, c.problem, 8))}px)`, opacity: f >= c.problem ? 1 : 0 }}>
            <Knot />
            <TermCard text="A PROBLEM" color={K.red} size={80} style={tilt({ opacity: 1, transform: "" }, 3)} />
          </div>
        </div>

        {/* ── java: separate skills snap into one service ── */}
        <div style={{ opacity: sec("java", "project") }}>
          {[["Collections", c.collections], ["Streams", c.streams], ["Spring", c.spring]].map(([label, at0], i) => {
            const snap = enter(f, c.building, 16);
            return (
              <div key={label as string} style={{ position: "absolute", left: 200 + i * 250 - snap * (i - 1) * 60, top: 60 + snap * 220, ...pop(f, at0 as number) }}>
                <div style={{ width: 210, padding: "18px 0", textAlign: "center", background: JAVA, color: "#fff", border: `4px solid ${K.ink}`, borderRadius: 14, fontWeight: 900, fontSize: 30, boxShadow: `5px 5px 0 ${K.ink}` }}>{label as string}</div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 240, top: 240, width: 640, height: 230, border: `6px dashed ${K.ink}`, borderRadius: 24, opacity: enter(f, c.building, 10) }} />
          <div style={{ position: "absolute", left: 300, top: 500, display: "flex", alignItems: "center", gap: 16, ...pop(f, c.building + 10) }}>
            <TermCard text="ONE SERVICE" color={K.green} size={72} />
            <span style={{ ...pop(f, c.skill), fontSize: 80 }}>✅</span>
          </div>
        </div>

        {/* ── project: topics fly into one pipeline ── */}
        <div style={{ opacity: sec("project", "why_delhi") }}>
          <div style={{ position: "absolute", left: 260, top: 40, ...tilt(pop(f, c.raw - 10), -2) }}>
            <TermCard text="ONE REAL PROJECT" color={K.red} size={76} />
          </div>
          {["raw data", "clean", "features", "model", "API"].map((s, i) => {
            const at0 = ip(i, [0, 4], [c.raw, c.running]);
            const glow = f >= c.together;
            return (
              <div key={s} style={{ position: "absolute", left: 192 + i * 156, top: 270, display: "flex", alignItems: "center" }}>
                <div style={{ width: 124, height: 96, borderRadius: 16, display: "grid", placeItems: "center", textAlign: "center", fontWeight: 900, fontSize: 24, background: glow ? K.yellow : "#fff", border: `4px solid ${K.ink}`, boxShadow: glow ? `0 0 0 ${6 + 4 * Math.sin(f / 4)}px rgba(255,214,0,.45)` : "none", ...pop(f, at0) }}>{s}</div>
                {i < 4 && <span style={{ marginLeft: 6, fontSize: 30, fontWeight: 900, opacity: enter(f, at0 + 6) }}>→</span>}
              </div>
            );
          })}
          {Array.from({ length: 14 }).map((_, i) => {
            const t = enter(f, c.together - 10 + i * 2, 18);
            const sx = 220 + (i % 7) * 100;
            const tx = 250 + (i % 5) * 156;
            return <div key={i} style={{ position: "absolute", left: sx + (tx - sx) * t, top: 560 - 250 * t, width: 34, height: 24, borderRadius: 6, background: "#FFF6BF", border: `3px solid ${K.ink}`, opacity: f >= c.together - 10 + i * 2 && t < 1 ? 1 : 0 }} />;
          })}
          <div style={{ position: "absolute", left: 300, top: 430, ...pop(f, c.one) }}>
            <Chip label="all topics · one problem" color={K.ink} size={30} />
          </div>
        </div>

        {/* ── why Delhi: three needs, one answer ── */}
        <div style={{ opacity: sec("why_delhi", "winter") }}>
          {[["📡", "Real data, free to use", c.real, c.free], ["👨‍👩‍👧", "Matters to real people", c.matters, c.people], ["📅", "Answer comes back daily", c.answer, c.right]].map(([icon, label, a, tick], i) => (
            <div key={label as string} style={{ position: "absolute", left: 200, top: 40 + i * 130, width: 720, height: 104, borderRadius: 18, background: "#fff", border: `4px solid ${K.ink}`, display: "flex", alignItems: "center", gap: 20, padding: "0 24px", boxSizing: "border-box", ...pop(f, a as number) }}>
              <span style={{ fontSize: 50 }}>{icon as string}</span>
              <span style={{ fontWeight: 900, fontSize: 34, flex: 1 }}>{label as string}</span>
              <span style={{ width: 60, height: 60, borderRadius: 12, border: `4px solid ${K.ink}`, display: "grid", placeItems: "center", fontSize: 44, color: K.green, fontWeight: 900 }}><span style={pop(f, tick as number)}>✓</span></span>
            </div>
          ))}
          <div style={{ position: "absolute", left: 560, top: 412, display: "flex", gap: 6, ...pop(f, c.answer + 10) }}>
            {Array.from({ length: 7 }).map((_, d) => (
              <span key={d} style={{ width: 40, height: 34, borderRadius: 6, border: `3px solid ${K.ink}`, background: f >= c.answer + 14 && Math.floor((f - c.answer - 14) / 7) % 9 === d ? K.yellow : "#fff", display: "grid", placeItems: "center", color: K.green, fontWeight: 900, fontSize: 22 }}>
                {f >= c.answer + 14 && Math.floor((f - c.answer - 14) / 7) % 9 >= d ? "✓" : ""}
              </span>
            ))}
          </div>
          <div style={{ position: "absolute", left: 330, top: 470, ...tilt(pop(f, c.delhi, 7), -6 + (f >= c.delhi + 10 ? 2 * Math.sin((f - c.delhi) / 6) : 0)) }}>
            <div style={{ fontFamily: K.head, fontSize: 96, color: K.red, border: `8px solid ${K.red}`, borderRadius: 16, padding: "0 26px", background: "rgba(255,255,255,.9)" }}>📍 DELHI AIR</div>
          </div>
        </div>

        {/* ── winter: the question ── */}
        <div style={{ opacity: sec("winter", "not_weather") }}>
          <Skyline haze={ip(f, [c.winter, c.rare + 20], [0.05, 0.55])} top={420} />
          {["OCT", "NOV", "DEC", "JAN"].map((m, i) => (
            <div key={m} style={{ position: "absolute", left: 200 + i * 180, top: 40, width: 150, padding: "10px 0", textAlign: "center", fontFamily: K.head, fontSize: 44, color: "#fff", background: `rgb(${150 + i * 25},${120 - i * 22},${90 - i * 18})`, border: `4px solid ${K.ink}`, borderRadius: 12, ...pop(f, c.winter + i * 6) }}>{m}</div>
          ))}
          <div style={{ position: "absolute", left: 560, top: 150, ...pop(f, c.rare) }}><Chip label="not rare" color={K.red} size={32} /></div>
          <div style={{ position: "absolute", left: 180, top: 220, width: 760, textAlign: "center", fontFamily: K.head, fontSize: 104, color: K.ink }}>
            {"SAFE TOMORROW?".slice(0, Math.floor(ip(f, [c.safe - 6, c.safe + 18], [0, 14])))}
          </div>
        </div>

        {/* ── not the weather: target vs clues ── */}
        <div style={{ opacity: sec("not_weather", "for_whom") }}>
          <Box style={{ left: 190, top: 40, width: 440, height: 330, ...pop(f, start("not_weather") + 4) }}>
            <div style={{ position: "absolute", top: -26, left: 20, fontFamily: K.head, fontSize: 40, background: K.red, color: "#fff", padding: "0 14px", border: `4px solid ${K.ink}` }}>WHAT WE PREDICT</div>
          </Box>
          <Box style={{ left: 680, top: 110, width: 260, height: 260, boxShadow: "none", border: `5px dashed ${K.muted}`, ...pop(f, c.clue - 8) }}>
            <div style={{ position: "absolute", top: -24, left: 16, fontFamily: K.head, fontSize: 36, background: K.muted, color: "#fff", padding: "0 12px" }}>CLUES</div>
            <div style={{ position: "absolute", left: 20, top: 150, display: "flex", flexDirection: "column", gap: 8, ...pop(f, c.clue + 6) }}>
              <Chip label="💨 wind" color="#fff" fg={K.ink} size={24} style={{ border: `3px solid ${K.ink}` }} />
              <Chip label="💧 humidity" color="#fff" fg={K.ink} size={24} style={{ border: `3px solid ${K.ink}` }} />
            </div>
          </Box>
          {(() => {
            const move = enter(f, c.air, 14);
            return (
              <div style={{ position: "absolute", left: 300 + 430 * move, top: 120 + 30 * move, transform: `scale(${1 - 0.45 * move})`, transformOrigin: "left top" }}>
                <div style={{ position: "relative", fontSize: 140, ...pop(f, c.weather) }}>☁️<div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 150, color: K.red, fontWeight: 900, opacity: move < 1 ? enter(f, c.weather + 8) : 0 }}>✗</div></div>
              </div>
            );
          })()}
          <div style={{ position: "absolute", left: 220, top: 150, width: 380, textAlign: "center", ...pop(f, c.pollution) }}>
            <div style={{ fontFamily: K.head, fontSize: 64, lineHeight: 1.05, color: K.ink }}>TOMORROW'S POLLUTION</div>
            <div style={{ fontWeight: 900, fontSize: 28, color: K.muted, marginTop: 8 }}>one number</div>
          </div>
        </div>

        {/* ── for whom: a lonely number, then the people walk in ── */}
        <div style={{ opacity: live(f, start("for_whom"), c.introduce) }}>
          <div style={{ position: "absolute", left: 360, top: 150 + 12 * Math.sin(f / 9), ...pop(f, c.number) }}>
            <div style={{ fontFamily: K.head, fontSize: 180, color: f >= c.nobody ? "#B8C2CF" : K.blue, border: `8px solid ${f >= c.nobody ? "#B8C2CF" : K.ink}`, borderRadius: 26, padding: "0 40px", background: "#fff" }}>??</div>
          </div>
          <div style={{ position: "absolute", left: 380, top: 420, ...pop(f, c.nobody) }}><Chip label="used by nobody" color={K.muted} size={32} /></div>
        </div>

        {/* ── cast row (hidden while the rival fails, small again under the recall card) ── */}
        <div style={{ position: "absolute", inset: 0, opacity: 1 - live(f, start("catch"), start("recall")), transform: `translateY(${370 * enter(f, start("recall"), 12)}px) scale(${1 - 0.4 * enter(f, start("recall"), 12)})`, transformOrigin: "50% 0" }}>
        {castOn && SLOT.map((x, i) => {
          const becomes = [c.asha, c.rishi, c.rival][i];
          return (
            <div key={i} style={{ position: "absolute", left: x - 82, top: 30, opacity: 1 - enter(f, becomes, 8), transform: `translateX(${(1 - walk) * (420 + 140 * i)}px)` }}>
              <Silhouette height={340} walk={walk} label="?" />
            </div>
          );
        })}
        <div style={{ position: "absolute", left: SLOT[0] - 82, top: 30, ...pop(f, c.asha) }}><Asha height={340} /></div>
        <div style={{ position: "absolute", left: SLOT[0] - 150, width: 300, top: 384 }}>
          <CastCard f={f} at={c.asha} roleAt={c.answerA} name="ASHA MADAM" role="needs the answer" color="#0E9F8E" />
        </div>
        <div style={{ position: "absolute", left: SLOT[1] - 82, top: 30, ...pop(f, c.rishi) }}><Rishi height={340} mouth={rishiTalking ? mouth : 0} /></div>
        <div style={{ position: "absolute", left: SLOT[1] - 150, width: 300, top: 384 }}>
          <CastCard f={f} at={c.rishi} roleAt={c.java} name="RISHI" role="Java developer" color={K.blue} />
        </div>
        <div style={{ position: "absolute", left: SLOT[1] + 40, top: 20, ...pop(f, c.stop) }}>
          <Chip label="✋ stops & asks" color={K.yellow} fg={K.ink} size={24} style={{ border: `3px solid ${K.ink}` }} />
        </div>
        <div style={{ position: "absolute", left: SLOT[2] - 110, top: 90, width: 220, height: 220, borderRadius: 26, background: "#fff", border: `5px dashed ${K.muted}`, ...pop(f, c.habit) }}>
          <svg viewBox="0 0 220 220" width={210} height={210}>
            <polyline points="20,150 60,120 100,140 140,90 180,110" fill="none" stroke="#8FA0B5" strokeWidth={9} />
            <polyline points="40,150 80,120 120,140 160,90 200,110" fill="none" stroke={K.ink} strokeWidth={8} strokeDasharray="14 10" strokeDashoffset={-f} />
          </svg>
        </div>
        <div style={{ position: "absolute", left: SLOT[2] - 150, width: 300, top: 384 }}>
          <CastCard f={f} at={c.rival} roleAt={c.persistence} name="THE RIVAL" role="persistence" color={K.muted} />
        </div>

        </div>

        {/* ── catch: the rival is always one day late ── */}
        <div style={{ opacity: sec("catch", "recall") }}><Catch f={f} c={c} from={start("catch")} /></div>

        {/* ── recall card ── */}
        <div style={{ opacity: live(f, start("recall"), Infinity) }}>
          <Box style={{ left: 190, top: 24, width: 750, height: 320, padding: "22px 30px", boxSizing: "border-box", ...pop(f, c.remember) }}>
            <div style={{ position: "absolute", top: -30, left: 24, fontFamily: K.head, fontSize: 46, background: K.yellow, padding: "0 16px", border: `4px solid ${K.ink}`, transform: "rotate(-2deg)" }}>REMEMBER</div>
            {[["1", "One real project", c.rProject], ["2", "Delhi's air, tomorrow", c.rTomorrow], ["3", "Three characters", c.rThree]].map(([n, label, a], i) => (
              <div key={n as string} style={{ display: "flex", alignItems: "center", gap: 18, marginTop: i ? 16 : 26, ...pop(f, a as number) }}>
                <span style={{ width: 62, height: 62, borderRadius: 31, background: K.blue, color: "#fff", display: "grid", placeItems: "center", fontFamily: K.head, fontSize: 40, border: `4px solid ${K.ink}` }}>{n as string}</span>
                <span style={{ fontWeight: 900, fontSize: 46 }}>{label as string}</span>
              </div>
            ))}
          </Box>
          <div style={{ position: "absolute", left: 230, top: 700 - (f >= c.rTwo + 10 ? 8 * Math.abs(Math.sin((f - c.rTwo) / 7)) : 0), ...pop(f, c.rTwo) }}>
            <Chip label="PART 2 → language · rules · plan" color={K.ink} size={32} />
          </div>
        </div>

        {/* ── lower zone of the cast beats ── */}
        <div style={{ opacity: sec("asha", "rishi_intro") }}>
          <div style={{ position: "absolute", left: 250, top: 540, ...pop(f, c.school) }}>
            <Chip label="🏫 primary school · Delhi" color="#fff" fg={K.ink} size={26} style={{ border: `3px solid ${K.ink}` }} />
          </div>
          <div style={{ position: "absolute", left: 250, top: 600, width: 460, height: 160, borderRadius: 14, background: "#CFE8C8", border: `3px solid ${K.ink}`, overflow: "hidden", ...pop(f, c.six - 4) }}>
            {Array.from({ length: 600 }).map((_, i) => (
              <span key={i} style={{ position: "absolute", left: 6 + (i % 40) * 11.3, top: 6 + Math.floor(i / 40) * 10, width: 6, height: 6, borderRadius: 3, background: ["#E53935", "#1E88E5", "#FB8C00", "#8E24AA"][i % 4], opacity: f >= c.six + Math.floor(i / 40) * 2 ? 1 : 0 }} />
            ))}
          </div>
          <div style={{ position: "absolute", left: 730, top: 600, ...pop(f, c.outside) }}>
            <div style={{ background: "#fff", border: `4px solid ${K.ink}`, borderRadius: 20, padding: "10px 16px", fontWeight: 900, fontSize: 28, lineHeight: 1.2 }}>600 kids:<br />outside<br />or inside?</div>
          </div>
        </div>
        <div style={{ opacity: sec("rishi_intro", "rishi_hi") }}>
          <div style={{ position: "absolute", left: 250, top: 560, width: 690, padding: "22px 26px", background: "#1E2533", borderRadius: 16, fontFamily: K.mono, fontSize: 30, color: "#E6EDF3", boxSizing: "border-box", ...pop(f, c.java) }}>
            {(() => {
              const line = 'String job = "Java developer";';
              const n = Math.floor(ip(f, [c.java, c.java + 36], [0, line.length]));
              return <span><span style={{ color: "#FF7B72" }}>{line.slice(0, Math.min(n, 6))}</span>{line.slice(6, n)}<span style={{ opacity: f % 20 < 10 ? 1 : 0 }}>▌</span></span>;
            })()}
          </div>
        </div>
        <div style={{ opacity: sec("rival", "catch") }}>
          {(() => {
            const copy = f < c.tomorrow + 45 ? enter(f, c.tomorrow, 14) : ((f - c.tomorrow - 45) % 50) / 50;
            return (
              <div style={{ position: "absolute", left: 250, top: 500 }}>
                <div style={{ position: "absolute", left: 40, top: 30, width: 110, height: 170, background: K.blue, border: `4px solid ${K.ink}`, borderRadius: 8, ...pop(f, c.habit + 6) }} />
                <div style={{ position: "absolute", left: 260, top: 30, width: 110, height: 170, border: `4px dashed ${K.muted}`, borderRadius: 8, ...pop(f, c.habit + 10) }} />
                <div style={{ position: "absolute", left: 40 + 220 * copy, top: 30, width: 110, height: 170, background: "#B8C2CF", border: `4px solid ${K.muted}`, borderRadius: 8, opacity: f < c.tomorrow ? 0 : f < c.tomorrow + 45 ? 1 : Math.sin(Math.PI * copy) }} />
                <span style={{ position: "absolute", left: 30, top: 214, width: 130, textAlign: "center", fontWeight: 900, fontSize: 24, ...pop(f, c.habit + 6) }}>TODAY</span>
                <span style={{ position: "absolute", left: 240, top: 214, width: 150, textAlign: "center", fontWeight: 900, fontSize: 24, color: K.muted, ...pop(f, c.habit + 10) }}>TOMORROW</span>
                <div style={{ position: "absolute", left: 410, top: 40, whiteSpace: "nowrap", ...pop(f, c.beat) }}>
                  <div style={{ fontFamily: K.head, fontSize: 44, color: "#fff", background: K.red, border: `4px solid ${K.ink}`, padding: "4px 18px", transform: "rotate(-3deg)", boxShadow: `6px 6px 0 ${K.ink}` }}>EVERY MODEL</div>
                  <div style={{ fontFamily: K.head, fontSize: 40, color: K.ink, textAlign: "center", marginTop: 8 }}>must beat it</div>
                </div>
              </div>
            );
          })()}
        </div>
      </Workspace>

      {meta.titleCard && <TitleCard f={f} line={meta.titleCard.line} sub={meta.titleCard.sub} until={c.python} />}
      <div style={{ position: "absolute", left: 0, top: 930, ...pop(f, 2) }}>
        <DevMascot height={620} pose={pointing || (f >= c.introduce && f < c.asha) || (f >= c.remember && f < c.rProject + 30) ? "point" : "present"} mouth={rishiTalking ? 0 : mouth} />
      </div>
      <DoubtCard f={f} from={start("rishi_hi")} to={end("rishi_hi")} label="✋ MEET RISHI" text="I will ask the doubts you are shy to ask." mouth={mouth} />
      <CaptionPill f={f} />
    </AbsoluteFill>
  );
}
