// Intro "Start here" (id day_00) — why a Java dev should learn ML + the 84-day map.
// Script: claude/episodes/day_00/voiceover_sheet_v2.md. Same workspace language as Day 1, with richer
// motion (creator's Day 1 note): code that types, data that flies between panels, stamps, strikes.
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { draw, enter, mix, pop, T } from "../../shared/anim";
import { Backdrop, CaptionPill, ChapterBar, Chip, Code, Header, K, Narrator, Tab, TermCard, TimelineProvider, TitleCard, tilt, useCues, useTimeline, Workspace } from "../../shared/explainer/kit";
import type { EpisodeMeta, Timeline } from "../../shared/types";

export type EpisodeProps = { timeline: Timeline; meta: EpisodeMeta };

type Cues = Record<string, number>;

/** Characters of `text` typed by frame f when typing starts at `from` (cps = chars per frame). */
const typed = (text: string, f: number, from: number, cpf = 2.5) => text.slice(0, Math.max(0, Math.floor((f - from) * cpf)));

/** Types a block of lines one after another; returns the visible part of each line. */
function typeLines(lines: string[], f: number, from: number, cpf = 2.5) {
  let budget = Math.max(0, Math.floor((f - from) * cpf));
  return lines.map((l) => {
    const s = l.slice(0, budget);
    budget = Math.max(0, budget - l.length);
    return s;
  });
}

const DEV_LINES = ["class JavaDeveloper {", "  boolean shouldLearnML() {", "    return ???;", "  }", "}"];
const METHODS = ["recommend()", "checkFraud()", "search()", "isSpam()"];
const SERVICE_LINES = ["@Service", "class OrderService {", "  Order place(Cart cart) {", "    var risk = model.score(cart);", "    ...", "  }", "}"];

export const Day00: React.FC<EpisodeProps> = ({ timeline, meta }) => (
  <TimelineProvider value={timeline}>
    <Scene meta={meta} />
  </TimelineProvider>
);

function Scene({ meta }: { meta: EpisodeMeta }) {
  const f = useCurrentFrame();
  const tl = useTimeline();
  const { at, start } = useCues();
  const next = (id: string) => tl.beats[tl.beats.findIndex((b) => b.id === id) + 1]?.from ?? Infinity;
  const inBeat = (id: string) => f >= start(id) && f < next(id);

  const c: Cues = {
    // 1 · question (series intro → [host] → the question)
    newSeries: at("question", "new"),
    java0: at("question", "java"),
    im: at("question", "im|my"),
    kali: at("question", "kali"),
    engineer: at("question", "engineer"),
    years: at("question", "years"),
    learningMl: at("question", "learning"),
    eyes0: at("question", "eyes"),
    every: at("question", "every"),
    curious: at("question", "curious"),
    mlWord: at("question", "machine"),
    see: at("question", "see"),
    works: at("question", "works"),
    visually: at("question", "visually"),
    first: at("question", "so|first"),
    why: at("question", "why"),
    all: at("question", "all"),
    // 2 · products
    because: at("products", "because|see"),
    software: at("products", "software"),
    changing: at("products", "changing"),
    more: at("products", "more"),
    appsRun: at("products", "run"),
    learning: at("products", "learning"),
    rec: at("products", "recommendations"),
    fraud: at("products", "fraud"),
    search: at("products", "search|checks"),
    spam: at("products", "spam"),
    those: at("products", "those"),
    models: at("products", "models"),
    not: at("products", "not"),
    rules: at("products", "rules|blocks"),
    // 3 · services
    who: at("services", "who"),
    app: at("services", "app|jobs"),
    us: at("services", "us"),
    our: at("services", "our"),
    send: at("services", "send"),
    sendData: at("services", "data"),
    call: at("services", "call"),
    api: at("services", "api"),
    answer: at("services", "answer|answers"),
    job: at("services", "job"),
    catch: at("services", "catch"),
    // 4 · team
    learnHow: at("team", "learn"),
    most: at("team", "most"),
    buildIt: at("team", "build"),
    test: at("team", "test"),
    fail: at("team", "fail|fails"),
    speak: at("team", "speak"),
    dataTeam: at("team", "data"),
    language: at("team", "language"),
    edge: at("team", "edge"),
    // 5 · map
    so: at("map", "so"),
    mapWord: at("map", "map"),
    n84: at("map", "eighty-four|84"),
    oneIdea: at("map", "idea"),
    order: at("map", "order"),
    learned: at("map", "learned"),
    // 6 · python
    started: at("python", "started"),
    pDay1: at("python", "day"),
    p2: at("python", "2"),
    pMl: at("python", "machine"),
    python: at("python", "python"),
    eyes: at("python", "eyes"),
    numpy: at("python", "numpy"),
    pandas: at("python", "pandas"),
    charts: at("python", "charts"),
    projects: at("python", "two"),
    // 7 · math
    inHand: at("math", "python"),
    m13: at("math", "13"),
    mathWord: at("math", "math"),
    stats: at("math", "statistics"),
    vectors: at("math", "vectors"),
    slope: at("math", "slope"),
    gradient: at("math", "gradient"),
    // 8 · data
    point: at("data", "point"),
    realData: at("data", "real"),
    d22: at("data", "22"),
    scientist: at("data", "scientist"),
    spread: at("data", "spread"),
    correlation: at("data", "correlation"),
    tests: at("data", "tests"),
    patterns: at("data", "patterns"),
    luck: at("data", "luck"),
    // 9 · ml
    readLike: at("ml", "read"),
    likeThat: at("ml", "like"),
    starts: at("ml", "starts"),
    m37: at("ml", "37"),
    m78: at("ml", "78"),
    realMl: at("ml", "machine"),
    cleaning: at("ml", "cleaning"),
    numbers: at("ml", "numbers"),
    classes: at("ml", "classes"),
    groups: at("ml", "groups"),
    judging: at("ml", "judging"),
    honestly: at("ml", "honestly"),
    // 10 · ship
    s79: at("ship", "79"),
    makeReal: at("ship", "real"),
    tuning: at("ship", "tuning"),
    ensembles: at("ship", "ensembles"),
    saving: at("ship", "saving"),
    capstone: at("ship", "capstone"),
    // 11 · promise
    everyDay: at("promise", "every"),
    idea: at("promise", "idea"),
    lens: at("promise", "java"),
    explained: at("promise", "explained"),
    time: at("promise", "topic|time"),
    part: at("promise", "part"),
    // 12 · start
    after84: at("start", "84"),
    deep: at("start", "deep"),
    afterW: at("start", "after"),
    transformers: at("start", "transformers"),
    agents: at("start", "agents"),
    startDay1: at("start", "1"),
    follow: at("start", "follow"),
    by84: at("start", "by"),
    project: at("start", "ml"),
  };

  // Host line ("I'm Kali…") only exists in the voice-test / new-intro script; the approved v3 intro has none.
  const hasHost = tl.captions.some((p) => p.words.some((w) => w.beatId === "question" && /kali/i.test(w.text)));
  c.host = hasHost ? 1 : 0;
  const chapters = (meta.chapters ?? []).map((ch) => ({ label: ch.label, from: start(ch.beat) }));
  const pointing =
    f < c.every || (f >= c.why && f < start("products")) || (f >= c.models && f < c.not) || (f >= c.us && f < c.our) || (f >= c.edge && f < start("map")) ||
    (f >= c.n84 && f < c.oneIdea) || (f >= c.realMl && f < c.cleaning) || f >= c.startDay1;

  // Tabs: the stage evolves; keep the three newest open so the strip never overflows.
  const TABS = [
    { label: "☕ Developer.java", from: 0 },
    { label: "📱 ShopApp", from: start("products") },
    { label: "☕ OrderService.java", from: start("services") },
    { label: "💬 #data-team", from: start("team") },
    { label: "🗺 roadmap.md", from: start("map") },
  ].filter((t) => f >= t.from);
  const activeTab = TABS[TABS.length - 1];
  const tabs = (
    <>
      {TABS.slice(-3).map((t) => (
        <Tab key={t.label} label={t.label} active={t === activeTab} style={t.from > 0 ? pop(f, t.from) : undefined} />
      ))}
    </>
  );

  return (
    <AbsoluteFill style={{ fontFamily: K.ui, overflow: "hidden" }}>
      <Audio src={staticFile(tl.audio)} />
      <Backdrop />
      <Header f={f} day={meta.day} title={meta.title} badge={meta.badge} />
      <ChapterBar f={f} chapters={chapters} />
      <Workspace f={f} tabs={tabs}>
        {inBeat("question") && <QuestionBeat f={f} c={c} />}
        {inBeat("products") && <ProductsBeat f={f} c={c} />}
        {inBeat("services") && <ServicesBeat f={f} c={c} />}
        {inBeat("team") && <TeamBeat f={f} c={c} />}
        {f >= start("map") && <MapStage f={f} c={c} start={start} />}
      </Workspace>
      {inBeat("team") && f >= c.edge && <TermCard text="REAL EDGE" color={K.green} size={76} style={{ left: 600, top: 590, ...tilt(pop(f, c.edge), -4) }} />}
      {inBeat("services") && f >= c.us && f < c.our + 10 && <TermCard text="US. ☕" color={K.blue} size={120} style={{ left: 330, top: 820, ...tilt(pop(f, c.us, 8), -4), opacity: 1 - enter(f, c.our, 10) }} />}
      {inBeat("services") && f >= c.job && <TermCard text="OUR JOB NOW" color={K.yellow} fg={K.ink} size={84} style={{ left: 250, top: 830, ...tilt(pop(f, c.job, 8), -3) }} />}
      {inBeat("ml") && f >= c.starts && f < c.cleaning + 10 && <Chip label="▶ STARTS HERE" color={K.ink} size={36} style={{ position: "absolute", left: 300, top: 720, ...pop(f, c.starts), opacity: 1 - enter(f, c.cleaning, 10) }} />}
      {inBeat("ml") && f >= c.realMl && f < c.cleaning + 20 && <TermCard text="THE REAL ML" color={K.yellow} fg={K.ink} size={110} style={{ left: 150, top: 560, ...tilt(pop(f, c.realMl, 8), -3), opacity: 1 - enter(f, c.cleaning + 10, 10) }} />}
      {inBeat("start") && f >= c.startDay1 && <StartCard f={f} c={c} />}
      {inBeat("products") && f >= c.models && <TermCard text="MODELS" color={K.yellow} fg={K.ink} size={96} style={{ left: 96, top: 700, ...tilt(pop(f, c.models), -4) }} />}
      {meta.titleCard && <TitleCard f={f} line={meta.titleCard.line} sub={meta.titleCard.sub} until={hasHost ? c.im : c.every} />}
      <TitleExtras f={f} c={c} />
      {hasHost && f >= c.kali && f < c.every && <Chip label="👋 KALI · YOUR HOST" color={K.blue} size={30} style={{ position: "absolute", left: 260, top: 1110, border: `4px solid ${K.ink}`, ...tilt(pop(f, c.kali, 8), -2) }} />}
      <Narrator pose={pointing ? "point" : "present"} />
      <CaptionPill f={f} />
    </AbsoluteFill>
  );
}

// ── Beat 1: the series intro, then the question typed as a Java method ────────────────────
function TitleExtras({ f, c }: { f: number; c: Cues }) {
  const out = enter(f, c.host ? c.im : c.every, 8);
  if (out >= 1 || f < c.newSeries) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out, pointerEvents: "none" }}>
      {f >= c.java0 && <div style={{ position: "absolute", right: 70, top: 830, fontSize: 120, ...pop(f, c.java0, 8), transform: `${pop(f, c.java0, 8).transform} rotate(${10 * Math.sin((f - c.java0) / 6)}deg)` }}>☕</div>}
      <Chip label="NEW SERIES" color={K.red} size={40} style={{ position: "absolute", left: 330, top: 440, border: `5px solid ${K.ink}`, ...tilt(pop(f, c.newSeries, 8), 3) }} />
    </div>
  );
}

function QuestionBeat({ f, c }: { f: number; c: Cues }) {
  // Host phase (only when the script introduces Kali): who is guiding you.
  if (c.host && f < c.every) {
    return (
      <>
        {f >= c.kali && <div style={{ position: "absolute", left: 40, top: 30, fontFamily: K.head, fontSize: 104, color: K.ink, ...pop(f, c.kali, 8) }}>👋 I&apos;M KALI</div>}
        {f >= c.engineer && <Chip label="💻 SOFTWARE ENGINEER" color={K.ink} size={36} style={{ position: "absolute", left: 40, top: 190, ...pop(f, c.engineer) }} />}
        {f >= c.years - 14 && (
          <div style={{ position: "absolute", left: 40, top: 290, display: "flex", gap: 8, alignItems: "center" }}>
            {Array.from({ length: 13 }, (_, i) => (
              <div key={i} style={{ width: 36, height: 56, borderRadius: 8, background: K.blue, border: `3px solid ${K.ink}`, ...pop(f, c.years - 14 + i * 1.2, 6) }} />
            ))}
            {f >= c.years && <Chip label="13+ YEARS" color={K.yellow} fg={K.ink} size={34} style={{ marginLeft: 12, border: `4px solid ${K.ink}`, ...pop(f, c.years) }} />}
          </div>
        )}
        {f >= c.learningMl && <Chip label="📚 LEARNING ML" color={K.green} size={36} style={{ position: "absolute", left: 40, top: 400, ...pop(f, c.learningMl) }} />}
        {f >= c.eyes0 && <Chip label="☕ THROUGH JAVA EYES" color={K.blue} size={36} style={{ position: "absolute", left: 420, top: 400, ...pop(f, c.eyes0) }} />}
      </>
    );
  }
  // Phase A: a curious Java dev who wants to SEE how ML works.
  if (f < c.why) {
    const out = enter(f, c.why - 8, 8);
    const bell = Array.from({ length: 31 }, (_, i) => `${i ? "L" : "M"} ${10 + i * 8} ${150 - 110 * Math.exp(-(((i / 30) - 0.5) ** 2) / 0.03)}`).join(" ");
    const visuals = [
      { at: c.see, label: "BELL CURVE" },
      { at: c.see + 8, label: "TREND LINE" },
      { at: c.works, label: "BOUNDARY" },
    ];
    return (
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `scale(${1 - 0.1 * out})` }}>
        <Chip label="☕ JAVA DEV" color={K.ink} size={40} style={{ position: "absolute", left: 40, top: 40, ...pop(f, c.every) }} />
        {f >= c.curious && (
          <div style={{ position: "absolute", left: 330, top: 26, padding: "10px 26px", borderRadius: 40, background: "#fff", border: `4px solid ${K.ink}`, fontSize: 40, fontWeight: 900, ...pop(f, c.curious) }}>
            🤔 {f >= c.mlWord ? "HOW DOES ML WORK?" : "…"}
          </div>
        )}
        {visuals.map((v, i) =>
          f >= v.at ? (
            <div key={v.label} style={{ position: "absolute", left: 30 + i * 305, top: 170, width: 290, height: 250, borderRadius: 20, background: K.panel, border: `4px solid ${K.ink}`, ...pop(f, v.at) }}>
              <svg width={290} height={200} style={{ position: "absolute", left: 0, top: 10 }}>
                {i === 0 && <path d={bell} fill="rgba(46,158,91,.15)" stroke={K.green} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw(f, v.at + 3, 16)} />}
                {i === 1 && (
                  <>
                    {[[40, 160], [70, 150], [95, 128], [120, 132], [150, 104], [180, 96], [205, 78], [240, 60]].map(([x, y], k) => (f >= v.at + k * 2 ? <circle key={k} cx={x} cy={y} r={9} fill={K.blue} /> : null))}
                    <line x1={30} y1={170} x2={30 + 230 * draw(f, v.at + 16, 12)} y2={170 - 125 * draw(f, v.at + 16, 12)} stroke={K.red} strokeWidth={5} strokeDasharray="12 8" />
                  </>
                )}
                {i === 2 && (
                  <>
                    {[[50, 60], [80, 90], [60, 120], [100, 55], [200, 140], [230, 110], [240, 160], [190, 170]].map(([x, y], k) => (f >= v.at + k * 2 ? <circle key={k} cx={x} cy={y} r={10} fill={k < 4 ? K.purple : K.yellow} stroke={K.ink} strokeWidth={3} /> : null))}
                    <line x1={60 + 0 * draw(f, v.at + 16)} y1={190} x2={60 + 190 * draw(f, v.at + 16, 12)} y2={190 - 180 * draw(f, v.at + 16, 12)} stroke={K.ink} strokeWidth={5} />
                  </>
                )}
              </svg>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 12, textAlign: "center", fontFamily: K.head, fontSize: 30, color: K.ink }}>{v.label}</div>
            </div>
          ) : null,
        )}
        {f >= c.visually && <Chip label="👀 SEE IT, VISUALLY" color={K.yellow} fg={K.ink} size={40} style={{ position: "absolute", left: 250, top: 450, border: `5px solid ${K.ink}`, ...tilt(pop(f, c.visually, 8), -2) }} />}
      </div>
    );
  }
  // Phase B: the question, typed as Java.
  const lines = typeLines(DEV_LINES, f, c.why, 4);
  const hot = enter(f, c.all, 6);
  const pulse = f >= c.all ? 1 + 0.08 * Math.sin((f - c.all) / 3) : 1;
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: 60, borderRadius: 20, background: "#0F172A", padding: "30px 34px", fontFamily: K.mono, fontSize: 36, lineHeight: 1.7, boxShadow: "0 12px 30px rgba(0,0,0,.18)", ...pop(f, c.why - 4, 8) }}>
      {lines.map((l, i) => {
        const q = l.indexOf("???");
        return (
          <div key={i} style={{ whiteSpace: "pre", minHeight: 61 }}>
            {q < 0 ? <Code text={l} dark /> : (
              <>
                <Code text={l.slice(0, q)} dark />
                <span style={{ display: "inline-block", color: hot > 0 ? K.ink : "#FCA5A5", background: hot > 0 ? K.yellow : "transparent", borderRadius: 8, padding: "0 6px", transform: `scale(${pulse})` }}>???</span>
                <Code text={l.slice(q + 3)} dark />
              </>
            )}
            {i === lines.findIndex((x, j) => x.length < DEV_LINES[j].length) && f % 16 < 10 && <span style={{ color: K.yellow }}>▍</span>}
          </div>
        );
      })}
    </div>
  );
}

// ── Beat 2: software is changing — more and more apps run on ML ────────────────────────────────────────
const FEATURES = [
  { key: "rec", label: "RECOMMENDED", color: K.blue },
  { key: "fraud", label: "PAYMENT CHECK", color: K.green },
  { key: "search", label: "SEARCH", color: K.purple },
  { key: "spam", label: "INBOX", color: K.red },
] as const;

const APPS = ["🛒", "🏦", "🎵", "📺", "🚕", "🍔", "✉️", "📷", "🗺", "💬", "🏥", "🎮"];

function ProductsBeat({ f, c }: { f: number; c: Cues }) {
  const PH = { x: 560, y: 14, w: 370, h: 752 };
  const glow = f >= c.rec ? Math.max(0, 1 - (f - c.rec) / 20) : 0;
  const scan = f >= c.those && f < c.models ? (f - c.those) / Math.max(1, c.models - c.those) : -1;
  const ruleDim = enter(f, c.rules, 10);
  const wallOut = enter(f, c.rec - 8, 10);
  // "More and more apps now run on machine learning": ML badges spread across the wall.
  const badgeAt = (i: number) => c.more + ((c.learning - c.more) / APPS.length) * [0, 5, 2, 9, 7, 1, 11, 4, 6, 10, 3, 8][i];
  return (
    <>
      {wallOut < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - wallOut, transform: `scale(${1 - 0.2 * wallOut})` }}>
          <Chip label="SOFTWARE IS CHANGING" color={K.ink} size={32} style={{ position: "absolute", left: 40, top: 30, ...pop(f, c.changing) }} />
          {APPS.map((a, i) => {
            const x = 60 + (i % 4) * 220;
            const y = 120 + Math.floor(i / 4) * 140;
            const ap = c.software + i * 1.5;
            const wig = f >= c.changing && f < c.changing + 16 ? 5 * Math.sin((f - c.changing + i) * 1.2) : 0;
            return f >= ap ? (
              <div key={i} style={{ position: "absolute", left: x, top: y, width: 180, height: 116, borderRadius: 24, background: "#fff", border: `4px solid ${f >= badgeAt(i) ? K.ink : K.line}`, display: "grid", placeItems: "center", fontSize: 58, transform: `${pop(f, ap, 7).transform} rotate(${wig}deg)`, opacity: pop(f, ap, 7).opacity }}>
                {a}
                {f >= badgeAt(i) && <span style={{ position: "absolute", right: -14, top: -14, fontFamily: K.head, fontSize: 30, background: K.yellow, color: K.ink, border: `4px solid ${K.ink}`, borderRadius: 12, padding: "0 10px", ...pop(f, badgeAt(i), 7) }}>ML</span>}
              </div>
            ) : null;
          })}
          {f >= c.appsRun && <Chip label="MORE AND MORE → ML" color={K.yellow} fg={K.ink} size={30} style={{ position: "absolute", left: 250, top: 570, border: `4px solid ${K.ink}`, ...pop(f, c.appsRun) }} />}
        </div>
      )}
      {/* phone */}
      {f >= c.rec - 4 && <div style={{ position: "absolute", left: PH.x, top: PH.y, width: PH.w, height: PH.h, borderRadius: 44, background: "#fff", border: `6px solid ${K.ink}`, boxShadow: `0 0 0 ${10 * glow}px rgba(255,214,0,.7), 0 14px 30px rgba(0,0,0,.15)`, overflow: "hidden", ...pop(f, c.rec - 4) }}>
        <div style={{ height: 70, background: K.ink, color: "#fff", display: "flex", alignItems: "center", padding: "0 24px", fontWeight: 900, fontSize: 28 }}>ShopApp</div>
        {FEATURES.map((ft, i) => {
          const from = c[ft.key];
          const e = enter(f, from, 10);
          const scanned = scan >= 0 && Math.floor(scan * 4) === i;
          const stamp = c.models + i * T.stagger;
          return f >= from ? (
            <div key={ft.key} style={{ position: "absolute", left: 16, right: 16, top: 86 + i * 164, height: 150, borderRadius: 18, background: "#F8FAFC", border: `4px solid ${scanned ? K.yellow : ft.color}`, padding: "12px 16px", boxSizing: "border-box", opacity: e, transform: `translateX(${80 * (1 - e)}px)` }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: ft.color, letterSpacing: 1 }}>{ft.label}</div>
              <FeatureBody kind={ft.key} f={f} from={from} />
              {f >= stamp && <div style={{ position: "absolute", right: 10, top: 8, fontFamily: K.head, fontSize: 36, color: "#fff", background: K.purple, border: `4px solid ${K.ink}`, padding: "0 12px", ...tilt(pop(f, stamp, 8), 8) }}>MODEL</div>}
            </div>
          ) : null;
        })}
      </div>}
      {/* behind the screen: each feature is a Java method whose body is "?" until "models" */}
      {f >= c.rec && (
        <div style={{ position: "absolute", left: 24, top: 20, width: 500, height: 270, borderRadius: 18, background: "#0F172A", padding: "16px 20px", boxSizing: "border-box", fontFamily: K.mono, ...pop(f, c.rec) }}>
          <div style={{ fontFamily: K.ui, fontSize: 18, fontWeight: 900, letterSpacing: 2, color: "#94A3B8" }}>BEHIND THE SCREEN</div>
          {METHODS.map((m, i) => {
            const from = c[FEATURES[i].key];
            const flip = enter(f, c.models + i * T.stagger, 8);
            return f >= from ? (
              <div key={m} style={{ position: "absolute", left: 20, right: 20, top: 52 + i * 52, height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 26, ...pop(f, from) }}>
                <span style={{ color: "#E2E8F0" }}>{m}</span>
                <span style={{ display: "inline-block", minWidth: 120, textAlign: "center", borderRadius: 8, fontFamily: flip > 0.5 ? K.head : K.mono, fontSize: flip > 0.5 ? 28 : 26, color: flip > 0.5 ? "#fff" : "#FCA5A5", background: flip > 0.5 ? K.purple : "transparent", transform: `scaleY(${Math.abs(1 - 2 * flip)})` }}>{flip > 0.5 ? "MODEL" : "{ ? }"}</span>
              </div>
            ) : null;
          })}
        </div>
      )}
      {/* connectors: phone card → its method */}
      <svg style={{ position: "absolute", left: 0, top: 0, width: 968, height: 782, overflow: "visible", pointerEvents: "none" }}>
        {FEATURES.map((ft, i) => {
          const from = c[ft.key];
          if (f < from) return null;
          const y1 = 20 + 52 + i * 52 + 22;
          const y2 = PH.y + 86 + i * 164 + 40;
          return <path key={ft.key} d={`M 524 ${y1} C 548 ${y1}, 548 ${y2}, ${PH.x + 2} ${y2}`} fill="none" stroke={ft.color} strokeWidth={4} strokeDasharray="8 7" pathLength={300} strokeDashoffset={-(f - from) * 1.5} opacity={draw(f, from + 4, 10)} />;
        })}
      </svg>
      {/* what they are NOT: if-else rules, struck out */}
      {f >= c.not && (
        <div style={{ position: "absolute", left: 40, top: 452, borderRadius: 14, background: "#fff", border: `4px solid ${K.ink}`, padding: "12px 22px", fontFamily: K.mono, fontSize: 36, fontWeight: 700, ...pop(f, c.not), opacity: 1 - 0.4 * ruleDim }}>
          <Code text="if (...) else if (...)" />
          <div style={{ position: "absolute", left: -8, right: -8, top: "50%", height: 14, borderRadius: 7, background: K.red, transform: `scaleX(${draw(f, c.rules, 10)})`, transformOrigin: "left" }} />
        </div>
      )}
    </>
  );
}

/** A tiny live UI inside each feature card, so the phone never sits still. */
function FeatureBody({ kind, f, from }: { kind: string; f: number; from: number }) {
  const t = f - from;
  if (kind === "rec") {
    return (
      <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
        {[K.yellow, "#90CAF9", "#A5D6A7", "#F48FB1"].map((col, i) => (
          <div key={i} style={{ width: 66, height: 74, borderRadius: 10, background: col, border: `3px solid ${K.ink}`, ...pop(f, from + 4 + i * T.stagger) }} />
        ))}
      </div>
    );
  }
  if (kind === "fraud") {
    const p = Math.min(1, t / 24);
    return (
      <div style={{ marginTop: 14, fontSize: 24, fontWeight: 800, color: K.ink }}>
        <div>💳 ••••  checking…</div>
        <div style={{ marginTop: 10, height: 16, borderRadius: 8, background: K.line, overflow: "hidden" }}>
          <div style={{ width: `${100 * p}%`, height: "100%", background: p >= 1 ? K.green : K.blue }} />
        </div>
      </div>
    );
  }
  if (kind === "search") {
    return (
      <div style={{ marginTop: 14, border: `3px solid ${K.line}`, borderRadius: 999, padding: "8px 16px", fontSize: 26, fontWeight: 700, color: K.ink }}>
        🔍 {typed("java books", f, from + 2, 0.6)}
        {t % 16 < 10 && <span style={{ color: K.purple }}>▍</span>}
      </div>
    );
  }
  const n = Math.min(3, Math.floor(t / 6));
  return (
    <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 14, fontSize: 26, fontWeight: 800, color: K.ink }}>
      ✉️ Spam <span style={{ background: K.red, color: "#fff", borderRadius: 999, padding: "2px 14px", transform: `scale(${1 + 0.3 * Math.max(0, 1 - ((t % 6) / 6))})` }}>{n}</span>
    </div>
  );
}

// ── Beat 3: who connects the models to the app? Us — our Java services ─────────────────────
function ServicesBeat({ f, c }: { f: number; c: Cues }) {
  // Phase A: APP ⇠ ? ⇢ MODEL, then a Java block drops in and bridges the gap.
  if (f < c.our) {
    const drop = enter(f, c.us, 10);
    const bridge = draw(f, c.us + 8, 10);
    const box = (x: number, label: string, icon: string, color: string, at: number) => (
      <div style={{ position: "absolute", left: x, top: 140, width: 230, height: 190, borderRadius: 22, border: `5px solid ${color}`, background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, ...pop(f, at) }}>
        <div style={{ fontSize: 64 }}>{icon}</div>
        <div style={{ fontFamily: K.head, fontSize: 40, color: K.ink }}>{label}</div>
      </div>
    );
    return (
      <>
        {f >= c.who && <Chip label="WHO CONNECTS THEM?" color={K.ink} size={34} style={{ position: "absolute", left: 200, top: 36, ...pop(f, c.who) }} />}
        {f >= c.who && box(50, "MODELS", "⚙️", K.purple, c.who + 4)}
        {f >= c.app && box(690, "APP", "📱", K.blue, c.app)}
        {f >= c.app && f < c.us && <div style={{ position: "absolute", left: 440, top: 170, fontFamily: K.head, fontSize: 120, color: K.red, transform: `scale(${1 + 0.1 * Math.sin(f / 3)})` }}>?</div>}
        {f >= c.us && (
          <>
            <div style={{ position: "absolute", left: 290, top: 232, width: 400 * bridge, height: 8, background: K.ink }} />
            <div style={{ position: "absolute", left: 360, top: mix(-200, 150, drop), width: 260, height: 170, borderRadius: 22, background: K.blue, border: `5px solid ${K.ink}`, display: "grid", placeItems: "center", fontFamily: K.head, fontSize: 48, color: "#fff" }}>☕ JAVA</div>
          </>
        )}
      </>
    );
  }
  // Phase B: our service sends data, calls the model API, acts on the answer.
  const used = typed("    if (risk.isHigh()) hold();", f, c.answer + 6, 2);
  const lines = typeLines(SERVICE_LINES, f, c.our - 4, 4).map((l, i) => (i === 4 && used ? used : l));
  const hot = enter(f, c.call, 6);
  const api = { x: 660, y: 70, w: 270, h: 190 };
  const arrow = draw(f, c.send, 12);
  const out = enter(f, c.sendData, 14);
  const back = enter(f, c.answer - 12, 14);
  const a = { x1: 560, y1: 190, x2: api.x, y2: api.y + 120 };
  return (
    <>
      <div style={{ position: "absolute", left: 24, top: 24, width: 536, height: 330, borderRadius: 20, background: "#0F172A", padding: "20px 24px", boxSizing: "border-box", fontFamily: K.mono, fontSize: 24, lineHeight: 1.62, ...pop(f, c.our - 4, 8) }}>
        {lines.map((l, i) => (
          <div key={i} style={{ whiteSpace: "pre", minHeight: 39, background: i === 3 && hot > 0 ? `rgba(255,214,0,${0.28 * hot})` : i === 4 && used ? "rgba(46,158,91,.25)" : "transparent", borderRadius: 6 }}>
            <Code text={l} dark />
          </div>
        ))}
      </div>
      {f >= c.send && (
        <div style={{ position: "absolute", left: api.x, top: api.y, width: api.w, height: api.h, borderRadius: 22, background: "#F3EEFF", border: `5px solid ${K.purple}`, display: "grid", placeItems: "center", textAlign: "center", ...pop(f, c.send) }}>
          <div>
            <div style={{ fontSize: 60, transform: `rotate(${(f - c.send) * 4}deg)`, display: "inline-block" }}>⚙️</div>
            <div style={{ fontFamily: K.head, fontSize: 44, color: K.ink }}>{f >= c.api ? "MODEL API" : "MODEL"}</div>
          </div>
        </div>
      )}
      {f >= c.send && (
        <svg style={{ position: "absolute", left: 0, top: 0, width: 968, height: 782, overflow: "visible", pointerEvents: "none" }}>
          <path d={`M ${a.x1} ${a.y1} C ${a.x1 + 60} ${a.y1}, ${a.x2 - 60} ${a.y2}, ${a.x2} ${a.y2}`} fill="none" stroke={K.ink} strokeWidth={6} strokeDasharray={400} strokeDashoffset={400 * (1 - arrow)} />
        </svg>
      )}
      {f >= c.sendData && out < 1 && <Packet x={mix(a.x1, a.x2, out)} y={mix(a.y1, a.y2, out)} label="{data}" color={K.blue} />}
      {f >= c.answer - 12 && back < 1 && <Packet x={mix(a.x2, a.x1, back)} y={mix(a.y2, a.y1, back) + 40} label="answer" color={K.green} />}
      {f >= c.catch && f < c.job && <Chip label="⚠ HERE'S THE CATCH" color={K.red} size={34} style={{ position: "absolute", left: 420, top: 480, border: `4px solid ${K.ink}`, ...pop(f, c.catch) }} />}
      {f >= c.api && f < c.job && <Chip label="SEND · CALL · ACT" color={K.ink} size={30} style={{ position: "absolute", left: 420, top: 400, ...pop(f, c.api) }} />}
    </>
  );
}

function Packet({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)" }}>
      <Chip label={label} color={color} size={22} style={{ border: `3px solid ${K.ink}` }} />
    </div>
  );
}

// ── Beat 4: you speak the data team's language ────────────────────────────────────────────
function Bubble({ f, at, typingFrom, side, who, text }: { f: number; at: number; typingFrom: number; side: "left" | "right"; who: string; text: string }) {
  if (f < typingFrom) return null;
  const left = side === "left";
  const typing = f < at;
  return (
    <div style={{ display: "flex", justifyContent: left ? "flex-start" : "flex-end", alignItems: "flex-end", gap: 12, marginBottom: 18, ...pop(f, typingFrom, 7) }}>
      {left && <div style={{ width: 56, height: 56, borderRadius: 28, background: K.green, display: "grid", placeItems: "center", fontSize: 30 }}>{who}</div>}
      <div style={{ maxWidth: 360, padding: "12px 18px", borderRadius: 22, background: left ? "#fff" : K.blue, color: left ? K.ink : "#fff", border: `3px solid ${left ? K.line : K.blue}`, fontSize: 25, fontWeight: 800 }}>
        {typing ? <span style={{ letterSpacing: 6, color: left ? K.muted : "#DCEBFF" }}>{"•••".slice(0, 1 + (Math.floor(f / 5) % 3))}</span> : text}
      </div>
      {!left && <div style={{ width: 56, height: 56, borderRadius: 28, background: K.blue, display: "grid", placeItems: "center", fontSize: 30 }}>{who}</div>}
    </div>
  );
}

function TeamBeat({ f, c }: { f: number; c: Cues }) {
  const meter = enter(f, c.most, 22);
  const checks = [
    { at: c.buildIt, label: "✓ BUILD THE FEATURE", color: K.green },
    { at: c.test, label: "✓ TEST IT", color: K.green },
    { at: c.fail, label: "⚠ KNOW WHEN IT FAILS", color: K.red },
  ];
  return (
    <>
      <Chip label="KNOW HOW IT WORKS" color={K.ink} size={30} style={{ position: "absolute", left: 30, top: 24, ...pop(f, c.learnHow) }} />
      {f >= c.most && (
        <div style={{ position: "absolute", left: 30, right: 30, top: 100, height: 64, borderRadius: 32, background: K.panel, border: `4px solid ${K.ink}`, overflow: "hidden", ...pop(f, c.most) }}>
          <div style={{ width: `${100 * meter}%`, height: "100%", background: `linear-gradient(90deg, ${K.yellow}, ${K.green})` }} />
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: K.head, fontSize: 34, color: K.ink }}>GET THE MOST OUT OF ML</div>
        </div>
      )}
      {checks.map((ch, i) =>
        f >= ch.at ? (
          <div key={ch.label} style={{ position: "absolute", left: 30, top: 190 + i * 92, width: 560, height: 78, borderRadius: 16, background: "#fff", border: `4px solid ${ch.color}`, display: "flex", alignItems: "center", padding: "0 22px", boxSizing: "border-box", fontSize: 32, fontWeight: 900, color: ch.color, ...pop(f, ch.at) }}>
            {ch.label}
          </div>
        ) : null,
      )}
      {f >= c.speak && (
        <div style={{ position: "absolute", left: 420, top: 470, width: 520, height: 290, borderRadius: 20, background: K.panel, border: `3px solid ${K.line}`, padding: "16px 18px", boxSizing: "border-box", ...pop(f, c.speak) }}>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 2, color: K.muted, marginBottom: 12 }}># data-team</div>
          <Bubble f={f} at={c.dataTeam + 6} typingFrom={c.speak + 2} side="left" who="📊" text="Model is overfitting 😬" />
          <Bubble f={f} at={c.language + 6} typingFrom={c.dataTeam + 12} side="right" who="☕" text="More data? Simpler model?" />
        </div>
      )}
    </>
  );
}

// ── Beats 5–12: the 84-day map ─────────────────────────────────────────────────────────────
const G = { cols: 14, size: 58, gap: 8, x0: 20, y0: 112 };
const boxXY = (d: number) => ({ x: G.x0 + ((d - 1) % G.cols) * (G.size + G.gap), y: G.y0 + Math.floor((d - 1) / G.cols) * (G.size + G.gap) });
const BAND = { prep: "#FFD600", reg: "#FFB300", cls: "#FF8F00", clu: "#EF6C00" };
const arcColor = (d: number) =>
  d === 1 ? K.ink : d <= 12 ? K.blue : d <= 21 ? K.purple : d <= 36 ? K.green : d <= 55 ? BAND.prep : d <= 64 ? BAND.reg : d <= 74 ? BAND.cls : d <= 78 ? BAND.clu : K.red;
const bump = (f: number, at: number, span = 12) => (f >= at && f < at + span ? 1 + 0.18 * Math.sin((Math.PI * (f - at)) / span) : 1);
const PANEL = { x: 360, y: 526, w: 584, h: 250 };

function MapStage({ f, c, start }: { f: number; c: Cues; start: (id: string) => number }) {
  const fillAt = (d: number) =>
    d === 1 ? c.pDay1 : d <= 12 ? c.p2 + (d - 2) * 2 : d <= 21 ? c.m13 + (d - 13) * 2 : d <= 36 ? c.d22 + (d - 22) * 1.5 : d <= 78 ? c.m37 + (d - 37) * 0.8 : c.s79 + (d - 79) * 2;
  const appearAt = (d: number) => c.n84 + (((d - 1) % G.cols) + Math.floor((d - 1) / G.cols)) * 1.3;
  const range: [number, number] | null =
    f >= start("promise") ? null : f >= start("ship") ? [79, 84] : f >= start("ml") ? [37, 78] : f >= start("data") ? [22, 36] : f >= start("math") ? [13, 21] : f >= start("python") ? [1, 12] : null;
  const bandAt = (d: number) => (d < 37 || d > 78 ? Infinity : d <= 55 ? c.cleaning : d <= 64 ? c.numbers : d <= 74 ? c.classes : c.groups);
  // "judging every model honestly": a review wave runs over all 42 ML days.
  const judgeAt = (d: number) => (d < 37 || d > 78 ? Infinity : c.judging + 6 + (d - 37) * 1.4);
  const count = Math.round(84 * enter(f, c.n84, 26));
  const heading = typed("# The 84-day map", f, c.so, 1.2);
  const arcLabel =
    f >= start("promise") ? "" : f >= c.s79 ? "DAYS 79–84 · SHIP" : f >= c.m37 ? "DAYS 37–78 · ML" : f >= c.d22 ? "DAYS 22–36 · DATA" : f >= c.m13 ? "DAYS 13–21 · MATH" : f >= c.p2 ? "DAYS 2–12 · PYTHON" : f >= c.pDay1 ? "DAY 1 · WHY" : "";
  const ringOn = f >= c.startDay1;
  return (
    <>
      {/* heading strip */}
      <div style={{ position: "absolute", left: 24, top: 22, fontFamily: K.mono, fontSize: 34, fontWeight: 700, color: K.ink }}>
        {heading}
        {heading.length < 16 && f % 16 < 10 && <span style={{ color: K.blue }}>▍</span>}
      </div>
      {f >= c.n84 && <Chip label={`${count} DAYS`} color={K.ink} size={28} style={{ position: "absolute", right: 24, top: 20, ...pop(f, c.n84) }} />}
      {f >= c.oneIdea && f < start("python") && <Chip label="1 DAY = 1 IDEA" color={K.yellow} fg={K.ink} size={26} style={{ position: "absolute", right: 210, top: 24, border: `3px solid ${K.ink}`, ...pop(f, c.oneIdea) }} />}
      {arcLabel && <Chip key={arcLabel} label={arcLabel} color={arcColor(range ? range[0] : 1)} fg={range && range[0] === 37 ? K.ink : "#fff"} size={26} style={{ position: "absolute", right: 210, top: 22, ...pop(f, f >= c.s79 ? c.s79 : f >= c.m37 ? c.m37 : f >= c.d22 ? c.d22 : f >= c.m13 ? c.m13 : f >= c.p2 ? c.p2 : c.pDay1) }} />}
      {/* grid backdrop */}
      {f >= c.mapWord && <div style={{ position: "absolute", left: G.x0 - 12, top: G.y0 - 12, width: G.cols * (G.size + G.gap) - G.gap + 24, height: 6 * (G.size + G.gap) - G.gap + 24, borderRadius: 18, background: K.panel, border: `3px dashed ${K.line}`, ...pop(f, c.mapWord) }} />}
      {/* reading path: faint "in order" on the map beat, solid journey Day 1 → 84 at the end */}
      <ReadPath f={f} from={c.order} span={45} color="rgba(30,136,229,.28)" until={start("python")} />
      <ReadPath f={f} from={c.by84} span={70} color="rgba(229,57,53,.45)" until={Infinity} />
      {Array.from({ length: 84 }, (_, i) => i + 1).map((d) => {
        const ap = appearAt(d);
        if (f < ap) return null;
        const { x, y } = boxXY(d);
        const filled = f >= fillAt(d);
        const col = arcColor(d);
        const dim = range && filled && (d < range[0] || d > range[1]) ? 0.4 : 1;
        const scale = (filled ? bump(f, fillAt(d), 10) : 1) * bump(f, bandAt(d), 14) * bump(f, judgeAt(d), 12) * (d >= 22 && d <= 36 ? bump(f, c.likeThat, 14) : 1) * (d === 84 ? bump(f, c.afterW, 16) : 1) * (d === 1 && f >= c.startDay1 ? bump(f, c.startDay1, 16) : 1);
        const darkText = filled && (d >= 37 && d <= 78);
        return (
          <div key={d} style={{ position: "absolute", left: x, top: y, width: G.size, height: G.size, borderRadius: 10, boxSizing: "border-box", background: filled ? col : "#fff", border: `3px solid ${filled ? K.ink : K.line}`, display: "grid", placeItems: "center", fontSize: 20, fontWeight: 900, color: filled ? (darkText ? K.ink : "#fff") : "#B4BECB", opacity: pop(f, ap, 6).opacity * dim, transform: `${pop(f, ap, 6).transform} scale(${scale})` }}>
            {d === 84 && f >= c.project ? "🏁" : f >= judgeAt(d) + 6 && f < c.s79 ? "✓" : d}
          </div>
        );
      })}
      {ringOn && (() => {
        const { x, y } = boxXY(1);
        const r = ((f - c.startDay1) % 30) / 30;
        return <div style={{ position: "absolute", left: x + G.size / 2, top: y + G.size / 2, width: 60 + 70 * r, height: 60 + 70 * r, transform: "translate(-50%,-50%)", borderRadius: 999, border: `5px solid ${K.red}`, opacity: 1 - r }} />;
      })()}
      {/* arc panel */}
      {f >= start("python") && (
        <div style={{ position: "absolute", left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, borderRadius: 20, background: "#fff", border: `4px solid ${K.ink}`, overflow: "hidden", ...pop(f, start("python")) }}>
          {f < start("math") && <PythonPanel f={f} c={c} />}
          {f >= start("math") && f < start("data") && <MathPanel f={f} c={c} />}
          {f >= start("data") && f < start("ml") && <DataPanel f={f} c={c} />}
          {f >= start("ml") && f < start("ship") && <MlPanel f={f} c={c} />}
          {f >= start("ship") && f < start("promise") && <ShipPanel f={f} c={c} />}
          {f >= start("promise") && f < start("start") && <PromisePanel f={f} c={c} />}
          {f >= start("start") && <SeasonPanel f={f} c={c} />}
        </div>
      )}
    </>
  );
}

/** Highlights the map row by row, like reading it in order (the path Day 1 → Day 84). */
function ReadPath({ f, from, span, color, until }: { f: number; from: number; span: number; color: string; until: number }) {
  if (f < from || f >= until) return null;
  const p = enter(f, from, span) * 6;
  const rowW = G.cols * (G.size + G.gap) - G.gap;
  return (
    <>
      {Array.from({ length: 6 }, (_, r) => {
        const w = Math.max(0, Math.min(1, p - r));
        return w > 0 ? <div key={r} style={{ position: "absolute", left: G.x0 - 6, top: G.y0 + r * (G.size + G.gap) - 6, width: (rowW + 12) * w, height: G.size + 12, borderRadius: 14, background: color }} /> : null;
      })}
    </>
  );
}

const PanelTitle = ({ text, color, fg = "#fff" }: { text: string; color: string; fg?: string }) => (
  <div style={{ position: "absolute", left: 18, top: 14 }}>
    <Chip label={text} color={color} fg={fg} size={20} />
  </div>
);

function PythonPanel({ f, c }: { f: number; c: Cues }) {
  if (f < c.p2) {
    return (
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
        {f < c.pDay1 ? (
          <Chip label="📍 WHERE I STARTED" color={K.ink} size={40} style={pop(f, c.started)} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ fontFamily: K.head, fontSize: 64, color: K.ink, ...pop(f, c.pDay1) }}>DAY 1: WHAT IS ML?</div>
            {f >= c.pMl && <Chip label="📧 THE SPAM-FOLDER STORY" color={K.red} size={28} style={pop(f, c.pMl)} />}
          </div>
        )}
      </div>
    );
  }
  const m = enter(f, c.eyes, 12);
  const mono = { fontFamily: K.mono, fontSize: 44, fontWeight: 700 } as const;
  return (
    <>
      <PanelTitle text={m > 0.5 ? "🐍 PYTHON" : "☕ JAVA"} color={m > 0.5 ? K.blue : K.ink} />
      {f >= c.python && (
        <div style={{ position: "absolute", left: 30, top: 70, ...mono, whiteSpace: "pre", ...pop(f, c.python) }}>
          <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", width: 106 * (1 - m), color: K.purple, opacity: 1 - m, textDecoration: m > 0 ? `line-through ${K.red}` : undefined }}>int </span>
          <span style={{ color: K.ink }}>x = 5</span>
          <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", width: 27 * (1 - m), opacity: 1 - m, color: K.ink }}>;</span>
        </div>
      )}
      <div style={{ position: "absolute", left: 18, bottom: 20, display: "flex", gap: 8 }}>
        {[
          { at: c.numpy, label: "NUMPY" },
          { at: c.pandas, label: "PANDAS" },
          { at: c.charts, label: "CHARTS" },
          { at: c.projects, label: "2 PROJECTS" },
        ].map((x) => (f >= x.at ? <Chip key={x.label} label={x.label} color={x.label === "2 PROJECTS" ? K.yellow : K.blue} fg={x.label === "2 PROJECTS" ? K.ink : "#fff"} size={21} style={pop(f, x.at)} /> : null))}
      </div>
    </>
  );
}

function MathPanel({ f, c }: { f: number; c: Cues }) {
  const cx = 330, bottom = 225, half = 250, depth = 150;
  const yOf = (x: number) => bottom - depth * ((x - cx) / half) ** 2;
  const d = Array.from({ length: 41 }, (_, i) => {
    const x = cx - half + (i * 2 * half) / 40;
    return `${i ? "L" : "M"} ${x.toFixed(1)} ${yOf(x).toFixed(1)}`;
  }).join(" ");
  const roll = enter(f, c.gradient, 40);
  const bx = mix(cx - half + 25, cx, roll);
  const by = yOf(bx);
  const k = (-2 * depth * (bx - cx)) / half ** 2;
  const tan = draw(f, c.slope, 10);
  return (
    <>
      <PanelTitle text="MATH YOU NEED" color={K.purple} />
      <svg width={PANEL.w} height={PANEL.h} style={{ position: "absolute", left: 0, top: 0 }}>
        {f >= c.mathWord && <path d={d} fill="none" stroke={K.purple} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw(f, c.mathWord, 16)} />}
        {f >= c.slope && <line x1={bx - 70 * tan} y1={by - 70 * tan * k} x2={bx + 70 * tan} y2={by + 70 * tan * k} stroke={K.red} strokeWidth={5} strokeLinecap="round" />}
        {f >= c.slope && <circle cx={bx} cy={by - 14} r={14} fill={K.yellow} stroke={K.ink} strokeWidth={4} />}
        {f >= c.vectors && (
          <g transform="translate(470 150)">
            <line x1={0} y1={0} x2={80 * draw(f, c.vectors)} y2={-60 * draw(f, c.vectors)} stroke={K.blue} strokeWidth={6} strokeLinecap="round" />
            {draw(f, c.vectors) >= 1 && <path d="M 80 -60 L 62 -58 L 72 -44 Z" fill={K.blue} />}
          </g>
        )}
      </svg>
      {f >= c.stats && <Chip label="μ  σ" color={K.ink} size={26} style={{ position: "absolute", right: 20, top: 16, ...pop(f, c.stats) }} />}
      {f >= c.gradient && <Chip label="↓ GRADIENT DESCENT" color={K.yellow} fg={K.ink} size={20} style={{ position: "absolute", left: 18, bottom: 16, ...pop(f, c.gradient) }} />}
    </>
  );
}

function DataPanel({ f, c }: { f: number; c: Cues }) {
  const bell = Array.from({ length: 41 }, (_, i) => {
    const x = i / 40;
    return `${i ? "L" : "M"} ${20 + x * 240} ${170 - 110 * Math.exp(-((x - 0.5) ** 2) / 0.03)}`;
  }).join(" ");
  const pts = [[330, 160], [360, 150], [385, 135], [400, 142], [430, 118], [455, 110], [470, 96], [500, 88], [520, 72], [545, 70]];
  return (
    <>
      <PanelTitle text="READ DATA" color={K.green} />
      {f >= c.point && f < c.spread && (
        <div style={{ position: "absolute", left: 18, right: 18, top: 62, display: "flex", alignItems: "center", gap: 16 }}>
          <Chip label="μ σ ∇" color={K.purple} size={26} style={pop(f, c.point)} />
          <div style={{ fontSize: 40, fontWeight: 900, color: K.ink, ...pop(f, c.point + 6) }}>→</div>
          {f >= c.realData && (
            <div style={{ flex: 1, fontFamily: K.mono, fontSize: 20, border: `3px solid ${K.line}`, borderRadius: 12, padding: "8px 12px", ...pop(f, c.realData) }}>
              <div style={{ color: K.muted, fontWeight: 800 }}>data.csv</div>
              {[0.9, 0.7, 0.8].map((w, i) => (
                <div key={i} style={{ height: 12, margin: "8px 0", borderRadius: 6, background: K.line, width: `${100 * w * enter(f, c.realData + 4 + i * 5, 8)}%` }} />
              ))}
            </div>
          )}
        </div>
      )}
      {f >= c.scientist && <Chip label="🔬 LIKE A SCIENTIST" color={K.ink} size={18} style={{ position: "absolute", right: 16, top: 16, ...pop(f, c.scientist) }} />}
      <svg width={PANEL.w} height={PANEL.h} style={{ position: "absolute", left: 0, top: 0 }}>
        {f >= c.spread && <path d={bell} fill="rgba(46,158,91,.15)" stroke={K.green} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw(f, c.spread, 14)} />}
        {f >= c.spread + 8 && <line x1={140 - 60 * enter(f, c.spread + 8)} y1={186} x2={140 + 60 * enter(f, c.spread + 8)} y2={186} stroke={K.ink} strokeWidth={4} />}
        {pts.map(([x, y], i) => (f >= c.correlation + i * 2 ? <circle key={i} cx={x} cy={y + 10} r={8} fill={K.blue} style={{ transformOrigin: `${x}px ${y + 10}px`, ...pop(f, c.correlation + i * 2) }} /> : null))}
        {f >= c.correlation + 18 && <line x1={320} y1={176} x2={320 + 240 * draw(f, c.correlation + 18)} y2={176 - 110 * draw(f, c.correlation + 18)} stroke={K.red} strokeWidth={4} strokeDasharray="10 6" />}
      </svg>
      <div style={{ position: "absolute", left: 18, right: 18, bottom: 14, display: "flex", gap: 10, justifyContent: "center" }}>
        {f >= c.tests && <Chip label="⚖ TEST" color={K.ink} size={22} style={pop(f, c.tests)} />}
        {f >= c.patterns && <Chip label="✓ REAL PATTERN" color={K.green} size={22} style={pop(f, c.patterns)} />}
        {f >= c.luck && <Chip label="✗ LUCK" color={K.red} size={22} style={pop(f, c.luck)} />}
      </div>
    </>
  );
}

function MlPanel({ f, c }: { f: number; c: Cues }) {
  const bands = [
    { at: c.cleaning, label: "PREP", color: BAND.prep, icon: "🧹" },
    { at: c.numbers, label: "REGRESSION", color: BAND.reg, icon: "📈" },
    { at: c.classes, label: "CLASSIFY", color: BAND.cls, icon: "🏷" },
    { at: c.groups, label: "CLUSTER", color: BAND.clu, icon: "🫧" },
  ];
  return (
    <>
      {f >= c.m78 && <PanelTitle text="42 DAYS" color={K.ink} />}
      {f >= c.judging && <Chip label="⚖ JUDGED HONESTLY" color={K.green} size={20} style={{ position: "absolute", right: 16, top: 14, ...pop(f, c.judging) }} />}
      {f < c.m78 && (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: K.head, fontSize: 58, color: K.ink, opacity: f >= c.readLike ? 1 : 0 }}>
          <span style={pop(f, c.readLike)}>DATA ✓ → NEXT…</span>
        </div>
      )}
      {bands.map((b, i) =>
        f >= b.at ? (
          <div key={b.label} style={{ position: "absolute", left: 18 + (i % 2) * 280, top: 70 + Math.floor(i / 2) * 86, width: 266, height: 74, borderRadius: 14, background: b.color, border: `4px solid ${K.ink}`, display: "flex", alignItems: "center", gap: 10, padding: "0 14px", boxSizing: "border-box", fontFamily: K.head, fontSize: 32, color: K.ink, ...pop(f, b.at) }}>
            <span style={{ fontSize: 34 }}>{b.icon}</span>
            {b.label}
            {f >= c.honestly && <span style={{ marginLeft: "auto", color: K.green, fontFamily: K.ui, fontWeight: 900, ...pop(f, c.honestly + i * T.stagger) }}>✓</span>}
          </div>
        ) : null,
      )}
    </>
  );
}

function ShipPanel({ f, c }: { f: number; c: Cues }) {
  const nodes = [
    { at: c.tuning, label: "TUNE", icon: "🎛" },
    { at: c.ensembles, label: "ENSEMBLE", icon: "🌲🌲🌲" },
    { at: c.saving, label: "model.pkl", icon: "📦" },
    { at: c.capstone, label: "CAPSTONE", icon: "🏁" },
  ];
  return (
    <>
      <PanelTitle text="MAKE IT REAL" color={K.red} />
      {nodes.map((n, i) => {
        const x = 18 + i * 142;
        return f >= n.at ? (
          <React.Fragment key={n.label}>
            {i > 0 && <div style={{ position: "absolute", left: x - 22, top: 136, width: 20 * draw(f, n.at - 6, 8), height: 5, background: K.ink }} />}
            <div style={{ position: "absolute", left: x, top: 76, width: 118, height: 128, borderRadius: 16, border: `4px solid ${i === 3 ? K.red : K.ink}`, background: i === 3 ? "#FFF1F1" : K.panel, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, ...pop(f, n.at) }}>
              <span style={{ fontSize: i === 1 ? 26 : 44, display: "inline-block", transform: i === 0 ? `rotate(${(f - n.at) * 3}deg)` : undefined }}>{n.icon}</span>
              <span style={{ fontFamily: i === 2 ? K.mono : K.head, fontSize: i === 2 ? 18 : 24, fontWeight: 800, color: K.ink }}>{n.label}</span>
            </div>
          </React.Fragment>
        ) : null;
      })}
    </>
  );
}

function PromisePanel({ f, c }: { f: number; c: Cues }) {
  const split = enter(f, c.part, 10);
  return (
    <>
      <div style={{ position: "absolute", left: 18, top: 18, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
        {f >= c.idea && <Chip label="1 IDEA / DAY" color={K.ink} size={26} style={pop(f, c.idea)} />}
        {f >= c.lens && <Chip label="☕ JAVA LENS" color={K.blue} size={26} style={pop(f, c.lens)} />}
        {f >= c.explained && <Chip label="EXPLAINED PROPERLY" color={K.green} size={26} style={pop(f, c.explained)} />}
      </div>
      {f >= c.time && (
        <div style={{ position: "absolute", right: 22, top: 50, width: 200, height: 150, ...pop(f, c.time) }}>
          {[0, 1].map((k) => (
            <div key={k} style={{ position: "absolute", top: 0, left: k ? 100 + 16 * split : 0 - 16 * split, width: 100, height: 150, boxSizing: "border-box", background: k && split > 0 ? K.yellow : K.blue, border: `4px solid ${K.ink}`, borderRadius: k ? "0 16px 16px 0" : "16px 0 0 16px", display: "grid", placeItems: "center", fontFamily: K.head, fontSize: 26, color: k && split > 0 ? K.ink : "#fff", textAlign: "center" }}>
              {split > 0 ? `PART ${k + 1}` : k ? "N" : "DAY"}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function SeasonPanel({ f, c }: { f: number; c: Cues }) {
  const out = enter(f, c.startDay1, 8);
  const items = [
    { at: c.deep, label: "DEEP LEARNING" },
    { at: c.transformers, label: "TRANSFORMERS" },
    { at: c.agents, label: "AGENTS" },
  ];
  return (
    <>
      <div style={{ opacity: 1 - out }}>
        <PanelTitle text="SEASON 2 →" color={K.purple} />
        {f >= c.afterW && f < c.deep && <Chip label="AFTER DAY 84 → GO FURTHER" color={K.purple} size={30} style={{ position: "absolute", left: 40, top: 110, border: `4px solid ${K.ink}`, ...pop(f, c.afterW) }} />}
        {items.map((it, i) =>
          f >= it.at ? (
            <div key={it.label} style={{ position: "absolute", left: 18 + i * 186, top: 90, width: 172, height: 90, borderRadius: 14, border: `4px dashed ${K.purple}`, background: "#F3EEFF", display: "grid", placeItems: "center", fontFamily: K.head, fontSize: 24, color: K.purple, ...pop(f, it.at) }}>
              {it.label}
            </div>
          ) : null,
        )}
      </div>
      {f >= c.project && <Chip label="🏁 REAL ML PROJECT" color={K.green} size={28} style={{ position: "absolute", right: 18, bottom: 18, ...pop(f, c.project) }} />}
    </>
  );
}

/** Beat 12: big START card, then it moves aside so the Day 1 → Day 84 journey can play. */
function StartCard({ f, c }: { f: number; c: Cues }) {
  const e = enter(f, c.follow, 14);
  const p = pop(f, c.startDay1, 8);
  return (
    <TermCard
      text="START: DAY 1"
      color={K.red}
      size={104}
      style={{ left: mix(150, 440, e), top: mix(640, 965, e), opacity: p.opacity, transform: `${p.transform} rotate(-3deg) scale(${mix(1, 0.6, e)})`, transformOrigin: "left center" }}
    />
  );
}
