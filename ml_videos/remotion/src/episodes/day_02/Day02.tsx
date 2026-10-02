// Day 2 — Why Python feels different (as a Java dev). First episode in the creator's own recorded voice.
// Script/reading sheet: claude/episodes/day_02/reading_sheet_v1.md; audio: public/day_02/rec_clean (clean-voice.mjs).
// Same channel language as Day 0/1: workspace stage, title card, chapter bar, pops on the spoken word.
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { draw, enter, mix, pop } from "../../shared/anim";
import { Backdrop, CaptionPill, ChapterBar, Chip, Code, Header, K, Narrator, Tab, TermCard, TimelineProvider, TitleCard, tilt, useCues, useTimeline, Workspace } from "../../shared/explainer/kit";
import type { EpisodeMeta, Timeline } from "../../shared/types";

export type EpisodeProps = { timeline: Timeline; meta: EpisodeMeta };
type Cues = Record<string, number>;

const typed = (text: string, f: number, from: number, cpf = 1.5) => text.slice(0, Math.max(0, Math.floor((f - from) * cpf)));
const shake = (f: number, at: number, span = 18, amp = 8) => (f >= at && f < at + span ? amp * Math.sin((f - at) * 1.6) * (1 - (f - at) / span) : 0);

export const Day02: React.FC<EpisodeProps> = ({ timeline, meta }) => (
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

  // Own-voice recordings change wording: an optional cue whose word isn't said stays hidden (Infinity),
  // instead of falling back to the start of the part.
  const said = (beat: string, word: string) => tl.captions.some((p) => p.words.some((w) => w.beatId === beat && word.split("|").some((x) => w.text.toLowerCase().replace(/[^a-z0-9-]/g, "") === x)));
  const opt = (beat: string, word: string, nth = 1) => (said(beat, word) ? at(beat, word, nth) : Infinity);
  const c: Cues = {
    // hook
    kali: at("hook", "kali"),
    this: at("hook", "this"),
    day: at("hook", "day"),
    ml: at("hook", "ml|machine"),
    first: at("hook", "first"),
    surprised: at("hook", "surprised"),
    noInt: at("hook", "int"),
    noString: at("hook", "string"),
    write: at("hook", "write"),
    x: at("hook", "x"),
    equals: at("hook", "equals"),
    five: at("hook", "5"),
    how: at("hook", "how"),
    knows: at("hook", "knows|know"),
    xIs: at("hook", "x", 2),
    // problem
    pJava: at("problem", "java"),
    trust: at("problem", "trust|trusted"),
    types: at("problem", "types"),
    compiler: at("problem", "compiler"),
    checks: at("problem", "checks"),
    before: at("problem", "before"),
    runs: at("problem", "runs"),
    saw: at("problem", "saw"),
    noType: at("problem", "type|types", 2),
    thought: at("problem", "thought"),
    brk: at("problem", "break"),
    // intuition
    think: at("intuition", "think"),
    way: at("intuition", "way"),
    java: at("intuition", "java"),
    box: at("intuition", "box"),
    hasType: at("intuition", "type"),
    create: at("intuition", "create"),
    box2: at("intuition", "box", 2),
    inside: at("intuition", "inside"),
    only: at("intuition", "only"),
    goesIn: at("intuition", "goes"),
    python: at("intuition", "python"),
    value: at("intuition", "value"),
    valueType: at("intuition", "type", 2),
    variable: at("intuition", "variable"),
    label: at("intuition", "label"),
    stick: at("intuition", "stick"),
    onIt: at("intuition", "on|onto"),
    // visual
    visualize: at("visual", "visualize"),
    vx: at("visual", "x"),
    vFive: at("visual", "5"),
    vNumber: at("visual", "number"),
    vFive2: at("visual", "5", 2),
    vLabel: at("visual", "label"),
    points: at("visual", "points|point"),
    now: at("visual", "now"),
    hello: at("visual", "hello"),
    same: at("visual", "same"),
    newValue: at("visual", "value|values"),
    newType: at("visual", "type"),
    noError: at("visual", "no"),
    dynamic: opt("technical", "dynamic"),
    // technical
    tChecks: at("technical", "checks"),
    tRuns: at("technical", "runs"),
    tBefore: at("technical", "before"),
    tThink: opt("technical", "think|ask"),
    ask: at("technical", "ask"),
    tX: at("technical", "x"),
    tYou: opt("technical", "ask"),
    tWhat: opt("technical", "what"),
    tTypeOf: at("technical", "type"),
    tells: at("technical", "tells"),
    tFloat: at("technical", "float"),
    tInt: at("technical", "int"),
    tString: at("technical", "string"),
    depending: opt("technical", "depending"),
    // java
    confused: at("java", "confused"),
    jDynamic: at("java", "dynamic"),
    strict: at("java", "strict"),
    tryIt: at("java", "try"),
    stops: at("java", "stops"),
    typeError: at("java", "error"),
    guess: at("java", "guess"),
    // example
    oneMore: at("example", "more"),
    cant: at("example", "cant"),
    ePython: at("example", "python"),
    noLimit: at("example", "size"),
    digits: at("example", "digits"),
    stillInt: at("example", "int"),
    eJava: at("example", "java", 2),
    overflowed: at("example", "overflowed"),
    // recap
    oneLine: at("recap", "day|line"),
    work: at("recap", "work"),
    rOne: at("recap", "one", 2),
    replace: at("recap", "replace"),
    values: at("recap", "values"),
    labels: at("recap", "labels"),
    checksWork: at("recap", "checks"),
    done: at("recap", "done"),
    numpy: at("recap", "numpy"),
    loop: at("recap", "loop"),
  };

  const chapters = (meta.chapters ?? []).map((ch) => ({ label: ch.label, from: start(ch.beat) }));
  const pointing =
    f < c.this || (f >= c.how && f < start("problem")) || (f >= c.brk && f < start("intuition")) || (f >= c.stick && f < start("visual")) ||
    (f >= c.dynamic && f < start("technical")) || (f >= c.stops && f < c.guess) || (f >= c.stillInt && f < c.eJava) || f >= c.done;

  const TABS = [
    { label: "☕ Hello.java", from: 0 },
    { label: "🐍 hello.py", from: c.surprised },
    { label: "⚙️ build.log", from: start("problem") },
    { label: "📦 mental-model", from: start("intuition") },
    { label: "🐍 python3", from: start("technical") },
    { label: "⚠ TypeError", from: start("java") },
    { label: "🔢 big_int.py", from: start("example") },
    { label: "📋 recap.md", from: start("recap") },
  ].filter((t) => f >= t.from);
  const active = TABS[TABS.length - 1];

  return (
    <AbsoluteFill style={{ fontFamily: K.ui, overflow: "hidden" }}>
      <Audio src={staticFile(tl.audio)} />
      <Backdrop />
      <Header f={f} day={meta.day} title={meta.title} />
      <ChapterBar f={f} chapters={chapters} />
      <Workspace f={f} tabs={<>{TABS.slice(-3).map((t) => <Tab key={t.label} label={t.label} active={t === active} style={t.from > 0 ? pop(f, t.from) : undefined} />)}</>}>
        {inBeat("hook") && <HookBeat f={f} c={c} />}
        {inBeat("problem") && <ProblemBeat f={f} c={c} />}
        {inBeat("intuition") && <IntuitionBeat f={f} c={c} />}
        {inBeat("visual") && <VisualBeat f={f} c={c} />}
        {inBeat("technical") && <TechnicalBeat f={f} c={c} />}
        {inBeat("java") && <JavaBeat f={f} c={c} />}
        {inBeat("example") && <ExampleBeat f={f} c={c} />}
        {inBeat("recap") && <RecapBeat f={f} c={c} />}
      </Workspace>
      {inBeat("problem") && f >= c.brk && <TermCard text="WILL IT BREAK?" color={K.red} size={84} style={{ left: 250, top: 830, ...tilt(pop(f, c.brk, 8), -3) }} />}
      {inBeat("technical") && f >= c.dynamic && f < c.tRuns + 10 && <TermCard text="DYNAMIC TYPING" color={K.yellow} fg={K.ink} size={90} style={{ left: 160, top: 840, ...tilt(pop(f, c.dynamic, 8), -3), opacity: 1 - enter(f, c.tRuns, 10) }} />}
      {inBeat("recap") && f >= c.done && <TermCard text="DAY 2 DONE ✓" color={K.green} size={96} style={{ left: 220, top: 830, ...tilt(pop(f, c.done, 8), -3), opacity: 1 - enter(f, c.numpy - 4, 8) }} />}
      {meta.titleCard && <TitleCard f={f} line={meta.titleCard.line} sub={meta.titleCard.sub} until={c.this} />}
      {f >= c.kali && f < c.surprised && <Chip label="👋 KALI · YOUR HOST" color={K.blue} size={30} style={{ position: "absolute", left: 250, top: 1196, border: `4px solid ${K.ink}`, ...tilt(pop(f, c.kali, 8), -2) }} />}
      <Narrator pose={pointing ? "point" : "present"} />
      <CaptionPill f={f} />
    </AbsoluteFill>
  );
}

// ── HOOK: no int, no String — just x = 5. So what IS x? ────────────────────────────────────
function Panel({ x, w, title, color, children, style }: { x: number; w: number; title: string; color: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", left: x, top: 150, width: w, height: 330, borderRadius: 20, background: "#0F172A", border: `4px solid ${color}`, padding: "18px 22px", boxSizing: "border-box", fontFamily: K.mono, fontSize: 30, lineHeight: 1.7, ...style }}>
      <div style={{ fontFamily: K.ui, fontSize: 20, fontWeight: 900, letterSpacing: 2, color, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

function HookBeat({ f, c }: { f: number; c: Cues }) {
  const javaA = typed("int x = 5;", f, c.surprised + 4);
  const javaB = typed('String s = "hi";', f, c.surprised + 14);
  const py = typed("x = 5", f, c.write, 5 / Math.max(10, c.five - c.write));
  const q = f >= c.how;
  return (
    <>
      {f >= c.day && <Chip label="DAY 2 · PYTHON" color={K.ink} size={34} style={{ position: "absolute", left: 30, top: 30, ...pop(f, c.day) }} />}
      {f >= c.ml && f < c.surprised && <Chip label="☕ ML FOR A JAVA DEV" color={K.blue} size={40} style={{ position: "absolute", left: 30, top: 170, border: `4px solid ${K.ink}`, ...pop(f, c.ml) }} />}
      {f >= c.first && f < c.surprised && <Chip label="😮 FIRST SURPRISE…" color={K.yellow} fg={K.ink} size={40} style={{ position: "absolute", left: 30, top: 290, border: `4px solid ${K.ink}`, ...pop(f, c.first) }} />}
      {f >= c.surprised && (
        <>
          <Panel x={24} w={450} title="☕ JAVA" color={K.blue} style={pop(f, c.surprised)}>
            <div style={{ whiteSpace: "pre", position: "relative" }}>
              <Code text={javaA} dark />
              {f >= c.noInt && <span style={{ position: "absolute", left: 0, top: 30, width: 66 * draw(f, c.noInt, 8), height: 5, background: K.red }} />}
            </div>
            <div style={{ whiteSpace: "pre", position: "relative" }}>
              <Code text={javaB} dark />
              {f >= c.noString && <span style={{ position: "absolute", left: 0, top: 30, width: 110 * draw(f, c.noString, 8), height: 5, background: K.red }} />}
            </div>
          </Panel>
          <Panel x={500} w={444} title="🐍 PYTHON" color={K.green} style={{ ...pop(f, c.surprised + 6), transform: `${pop(f, c.surprised + 6).transform} translateX(${shake(f, c.knows, 16, 5)}px) scale(${f >= c.write && f < c.write + 14 ? 1 + 0.06 * Math.sin((Math.PI * (f - c.write)) / 14) : 1})` }}>
            <div style={{ whiteSpace: "pre", fontSize: 64, color: "#E2E8F0", marginTop: 20 }}>
              {py}
              {py.length < 5 && f % 16 < 10 && <span style={{ color: K.yellow }}>▍</span>}
            </div>
            {f >= c.five && <div style={{ fontFamily: K.ui, fontSize: 22, fontWeight: 800, color: "#86EFAC", ...pop(f, c.five) }}>no type written ✓</div>}
          </Panel>
        </>
      )}
      <div style={{ position: "absolute", left: 360, top: 34, display: "flex", gap: 14 }}>
        {f >= c.noInt && <Chip label="✗ int" color={K.red} size={34} style={pop(f, c.noInt)} />}
        {f >= c.noString && <Chip label="✗ String" color={K.red} size={34} style={pop(f, c.noString)} />}
      </div>
      {q && (
        <div style={{ position: "absolute", left: 560, top: 500, display: "flex", alignItems: "center", gap: 14, ...pop(f, c.how) }}>
          <div style={{ fontFamily: K.head, fontSize: 150, color: K.red, WebkitTextStroke: `6px ${K.ink}`, transform: `rotate(${8 * Math.sin((f - c.how) / 6)}deg)` }}>?</div>
          {f >= c.xIs && <Chip label="WHAT IS x?" color={K.yellow} fg={K.ink} size={40} style={{ border: `5px solid ${K.ink}`, ...pop(f, c.xIs) }} />}
        </div>
      )}
    </>
  );
}

// ── PROBLEM: Java trusts types — checked BEFORE running. Python has none… will it break? ─────
function ProblemBeat({ f, c }: { f: number; c: Cues }) {
  const stage = (x: number, label: string, at: number, color: string, ok: boolean) =>
    f >= at ? (
      <div style={{ position: "absolute", left: x, top: 130, width: 250, height: 120, borderRadius: 18, border: `5px solid ${color}`, background: "#fff", display: "grid", placeItems: "center", fontFamily: K.head, fontSize: 40, color: K.ink, ...pop(f, at) }}>
        <div>{label} {ok && <span style={{ color: K.green }}>✓</span>}</div>
      </div>
    ) : null;
  const scan = f >= c.checks ? Math.min(1, (f - c.checks) / 20) : 0;
  const pyShake = shake(f, c.brk, 22, 10);
  return (
    <>
      {f >= c.pJava && f < c.trust && <Chip label="☕ AS A JAVA DEV…" color={K.ink} size={34} style={{ position: "absolute", left: 30, top: 24, ...pop(f, c.pJava) }} />}
      {f >= c.trust && <Chip label="☕ WE TRUST TYPES" color={K.blue} size={34} style={{ position: "absolute", left: 30, top: 30, ...pop(f, c.trust) }} />}
      {stage(40, "COMPILE", c.compiler, K.blue, f >= c.before)}
      {f >= c.before && <div style={{ position: "absolute", left: 300, top: 186, width: 90 * draw(f, c.before, 10), height: 8, background: K.ink }} />}
      {stage(400, "RUN", c.runs, K.green, false)}
      {f >= c.checks && f < c.saw && (
        <div style={{ position: "absolute", left: 40, top: 280, width: 610, borderRadius: 14, background: "#0F172A", padding: "14px 20px", fontFamily: K.mono, fontSize: 28, ...pop(f, c.checks) }}>
          <div style={{ color: "#E2E8F0", whiteSpace: "pre" }}>
            <Code text='int age = "ten";' dark />
          </div>
          <div style={{ height: 5, width: `${60 * scan}%`, background: K.red, borderRadius: 3, marginTop: 4 }} />
          {scan >= 1 && <div style={{ color: "#FCA5A5", fontSize: 22, marginTop: 8 }}>✗ incompatible types (caught before run)</div>}
        </div>
      )}
      {f >= c.saw && (
        <div style={{ position: "absolute", left: 40, top: 280, width: 610, borderRadius: 14, background: "#0F172A", border: `4px solid ${K.green}`, padding: "14px 20px", fontFamily: K.mono, fontSize: 32, color: "#E2E8F0", whiteSpace: "pre", transform: `translateX(${pyShake}px)`, opacity: pop(f, c.saw).opacity }}>
          {typed("age = 10", f, c.saw, 0.8)}
          {f >= c.noType && <span style={{ fontFamily: K.ui, fontSize: 24, fontWeight: 900, marginLeft: 24, color: K.ink, background: K.yellow, borderRadius: 8, padding: "2px 10px", ...pop(f, c.noType) }}>TYPE: ?</span>}
        </div>
      )}
      {f >= c.thought && <div style={{ position: "absolute", left: 680, top: 300, fontSize: 90, ...pop(f, c.thought), transform: `${pop(f, c.thought).transform} rotate(${6 * Math.sin((f - c.thought) / 5)}deg)` }}>😬</div>}
    </>
  );
}

// ── INTUITION: in Java the BOX has a type; in Python the VALUE has it, x is just a label ─────
function IntuitionBeat({ f, c }: { f: number; c: Cues }) {
  // Java side
  const drop = enter(f, c.create + 6, 12);
  const bounce = f >= c.only ? enter(f, c.only, 14) : 0;
  const bx = 120, by = 250;
  // Python side
  const fly = enter(f, c.stick - 6, 16);
  const lx = mix(820, 745, fly), ly = mix(110, 205, fly);
  return (
    <>
      {f < c.java && f >= c.think && (
        <div style={{ position: "absolute", left: 150, top: 220, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, ...pop(f, c.think) }}>
          <div style={{ fontSize: 110, transform: `rotate(${6 * Math.sin((f - c.think) / 5)}deg)` }}>💡</div>
          {f >= c.way && <Chip label="THINK OF IT LIKE THIS" color={K.ink} size={40} style={pop(f, c.way)} />}
        </div>
      )}
      {f >= c.java && <div style={{ position: "absolute", left: 30, top: 24, fontFamily: K.head, fontSize: 44, color: K.blue, ...pop(f, c.java) }}>☕ JAVA</div>}
      {f >= c.python && <div style={{ position: "absolute", left: 540, top: 24, fontFamily: K.head, fontSize: 44, color: K.green, ...pop(f, c.python) }}>🐍 PYTHON</div>}
      {f >= c.python && <div style={{ position: "absolute", left: 500, top: 30, width: 4, height: 460, background: K.line }} />}
      {/* the typed box */}
      {f >= c.box && (
        <div style={{ position: "absolute", left: bx, top: by, width: 240, height: 180, opacity: pop(f, c.box).opacity, transform: `${pop(f, c.box).transform} scale(${f >= c.inside && f < c.inside + 14 ? 1 + 0.12 * Math.sin((Math.PI * (f - c.inside)) / 14) : 1})` }}>
          <div style={{ position: "absolute", inset: 0, border: `6px solid ${K.ink}`, borderTop: "none", borderRadius: "0 0 18px 18px", background: "rgba(30,136,229,.12)" }} />
          {f >= c.hasType && <div style={{ position: "absolute", left: 60, top: 150, fontFamily: K.head, fontSize: 36, color: "#fff", background: K.blue, border: `4px solid ${K.ink}`, padding: "0 16px", ...tilt(pop(f, c.hasType, 8), -4) }}>int</div>}
          {f >= c.create + 6 && <div style={{ position: "absolute", left: 90, top: mix(-160, 60, drop), fontFamily: K.head, fontSize: 70, color: K.ink }}>5</div>}
        </div>
      )}
      {f >= c.only && (
        <div style={{ position: "absolute", left: mix(330, 250, Math.sin(Math.PI * bounce)), top: mix(120, 180, Math.sin(Math.PI * bounce)), fontFamily: K.mono, fontSize: 34, fontWeight: 700, color: K.red, opacity: 1 - 0.5 * enter(f, c.goesIn + 6, 8) }}>
          &quot;hello&quot; {bounce >= 1 && <span>✗</span>}
        </div>
      )}
      {f >= c.box2 && f < c.goesIn && <Chip label="5 FITS ✓" color={K.green} size={30} style={{ position: "absolute", left: 150, top: 470, ...pop(f, c.box2) }} />}
      {f >= c.goesIn && <Chip label="ONLY NUMBERS IN" color={K.ink} size={24} style={{ position: "absolute", left: 110, top: 470, ...pop(f, c.goesIn) }} />}
      {/* the value that carries its own type */}
      {f >= c.value && (
        <div style={{ position: "absolute", left: 620, top: 240, width: 180, height: 180, borderRadius: 90, background: "#EEF9F2", border: `6px solid ${K.green}`, display: "grid", placeItems: "center", fontFamily: K.head, fontSize: 90, color: K.ink, ...pop(f, c.value) }}>5</div>
      )}
      {f >= c.valueType && <div style={{ position: "absolute", left: 640, top: 440, fontFamily: K.head, fontSize: 34, color: "#fff", background: K.green, border: `4px solid ${K.ink}`, padding: "0 14px", ...tilt(pop(f, c.valueType, 8), 3) }}>type: int</div>}
      {f >= c.label && (
        <div style={{ position: "absolute", left: lx, top: ly, width: 110, height: 70, background: K.yellow, border: `4px solid ${K.ink}`, borderRadius: 8, display: "grid", placeItems: "center", fontFamily: K.mono, fontSize: 44, fontWeight: 800, color: K.ink, boxShadow: "4px 4px 0 rgba(0,0,0,.25)", transform: `rotate(${mix(-18, -6, fly) + (fly >= 1 ? 4 * Math.sin((f - c.stick) / 4) * Math.max(0, 1 - (f - c.stick - 16) / 40) : 0)}deg)`, opacity: pop(f, c.label).opacity }}>
          x
        </div>
      )}
      {f >= c.variable && <Chip label="x = JUST A LABEL" color={K.yellow} fg={K.ink} size={30} style={{ position: "absolute", left: 560, top: 520, border: `4px solid ${K.ink}`, ...pop(f, c.variable) }} />}
      {f >= c.onIt && <Chip label="THE VALUE KNOWS ITS TYPE" color={K.green} size={26} style={{ position: "absolute", left: 540, top: 600, border: `4px solid ${K.ink}`, ...pop(f, c.onIt) }} />}
      {f >= c.stick + 10 && <div style={{ position: "absolute", left: 830, top: 180, fontSize: 50, ...pop(f, c.stick + 10) }}>📌</div>}
    </>
  );
}

// ── VISUAL: same label, new value, new type — no error ─────────────────────────────────────
function Bubble({ x, y, text, color, tag, at, tagAt, dim = 0, f }: { x: number; y: number; text: string; color: string; tag: string; at: number; tagAt: number; dim?: number; f: number }) {
  if (f < at) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: 1 - 0.55 * dim, ...{ transform: pop(f, at).transform } }}>
      <div style={{ width: 200, height: 200, borderRadius: 100, border: `6px solid ${color}`, background: "#fff", display: "grid", placeItems: "center", fontFamily: text.length > 2 ? K.mono : K.head, fontWeight: 800, fontSize: text.length > 2 ? 40 : 96, color: K.ink }}>{text}</div>
      {f >= tagAt && <div style={{ marginTop: 10, textAlign: "center", fontFamily: K.head, fontSize: 32, color: "#fff", background: color, border: `4px solid ${K.ink}`, padding: "0 12px", ...tilt(pop(f, tagAt, 8), -3) }}>{tag}</div>}
    </div>
  );
}

function VisualBeat({ f, c }: { f: number; c: Cues }) {
  const bump = f >= c.vNumber && f < c.vNumber + 16 ? 1 + 0.15 * Math.sin((Math.PI * (f - c.vNumber)) / 16) : 1;
  const move = enter(f, c.same, 16);
  const lx = mix(210, 640, move), ly = mix(170, 170, move) - 60 * Math.sin(Math.PI * move);
  return (
    <>
      <Chip label="👀 LET'S VISUALIZE" color={K.ink} size={32} style={{ position: "absolute", left: 30, top: 24, ...pop(f, c.visualize) }} />
      <div style={{ position: "absolute", left: 460, top: 24, fontFamily: K.mono, fontSize: 30, lineHeight: 1.5, color: K.ink, whiteSpace: "pre" }}>
        <div>{typed("x = 5", f, c.vx, 0.6)}</div>
        <div>{typed('x = "hello"', f, c.now, 0.5)}</div>
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${bump})`, transformOrigin: "220px 320px" }}>
        <Bubble f={f} x={120} y={220} text="5" color={K.blue} tag="int" at={c.vFive} tagAt={c.vFive + 8} dim={enter(f, c.same + 10, 10)} />
      </div>
      <Bubble f={f} x={560} y={220} text={'"hello"'} color={K.purple} tag="str" at={c.hello} tagAt={c.newType} />
      {f >= c.vLabel && (
        <div style={{ position: "absolute", left: lx, top: ly, width: 110, height: 70, background: K.yellow, border: `4px solid ${K.ink}`, borderRadius: 8, display: "grid", placeItems: "center", fontFamily: K.mono, fontSize: 44, fontWeight: 800, color: K.ink, transform: `rotate(-8deg) scale(${pop(f, c.vLabel).opacity})`, boxShadow: "4px 4px 0 rgba(0,0,0,.25)" }}>x</div>
      )}
      {f >= c.points && f < c.same && (
        <svg style={{ position: "absolute", left: 0, top: 0, width: 968, height: 782, overflow: "visible" }}>
          <line x1={265} y1={240} x2={265} y2={240 + 20 * draw(f, c.points, 8)} stroke={K.ink} strokeWidth={6} />
        </svg>
      )}
      {f >= c.newValue && <Chip label="NEW VALUE" color={K.purple} size={26} style={{ position: "absolute", left: 790, top: 250, ...pop(f, c.newValue) }} />}
      {f >= c.noError && <Chip label="✓ NO ERROR" color={K.green} size={40} style={{ position: "absolute", left: 460, top: 540, border: `4px solid ${K.ink}`, ...pop(f, c.noError) }} />}
    </>
  );
}

// ── TECHNICAL: checked while running, not before; ask type(x) ──────────────────────────────
function TechnicalBeat({ f, c }: { f: number; c: Cues }) {
  const head = f >= c.tChecks ? Math.min(1, (f - c.tChecks) / Math.max(20, c.tRuns - c.tChecks + 10)) : 0;
  const rows = [{ code: "x = 5", type: "int" }, { code: 'x = "hello"', type: "str" }];
  const hits = ([["float", c.tFloat], ["int", c.tInt], ["str", c.tString]] as const).filter(([, t]) => f >= t).sort((a, b) => b[1] - a[1]);
  const cycle = hits[0]?.[0] ?? null;
  const cycleAt = hits[0]?.[1] ?? 0;
  return (
    <>
      <Chip label="▶ CHECKED WHILE RUNNING" color={K.green} size={30} style={{ position: "absolute", left: 30, top: 24, ...pop(f, c.tChecks) }} />
      {f >= c.tBefore && <Chip label="✗ NOT BEFORE" color={K.red} size={30} style={{ position: "absolute", left: 560, top: 24, ...pop(f, c.tBefore) }} />}
      {f >= c.tChecks && (
        <div style={{ position: "absolute", left: 30, top: 100, width: 900, height: 150, borderRadius: 16, background: "#0F172A", padding: "14px 20px", boxSizing: "border-box", fontFamily: K.mono, fontSize: 30, color: "#E2E8F0", ...pop(f, c.tChecks) }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", height: 56, alignItems: "center" }}>
              <span style={{ whiteSpace: "pre" }}>{r.code}</span>
              {head > (i + 0.6) / 2 && <span style={{ fontFamily: K.head, fontSize: 28, color: K.ink, background: K.yellow, borderRadius: 8, padding: "0 12px", ...pop(f, c.tChecks + (i + 0.6) * 15) }}>→ {r.type}</span>}
            </div>
          ))}
          <div style={{ position: "absolute", left: 10, top: 14 + 112 * head, width: 880, height: 4, background: K.green, opacity: head < 1 ? 1 : 0 }} />
        </div>
      )}
      {f >= c.tYou && <Chip label="💬 JUST ASK PYTHON" color={K.ink} size={28} style={{ position: "absolute", left: 30, top: 300, ...pop(f, c.tYou) }} />}
      {f >= c.tThink && (
        <div style={{ position: "absolute", left: 380, top: 290, width: 550, borderRadius: 16, background: "#0F172A", padding: "16px 22px", boxSizing: "border-box", fontFamily: K.mono, fontSize: 36, color: "#E2E8F0", ...pop(f, c.tThink) }}>
          <div>
            <span style={{ color: "#94A3B8" }}>&gt;&gt;&gt; </span>
            {typed("type(x)", f, c.ask, 7 / Math.max(8, c.tX - c.ask + 4))}
            {f < c.tells && f % 16 < 10 && <span style={{ color: K.yellow }}>▍</span>}
          </div>
          {f >= c.tells && <div style={{ color: "#86EFAC", ...pop(f, c.tells) }}>&lt;class &apos;{cycle ?? "str"}&apos;&gt;</div>}
        </div>
      )}
      {cycle && <Chip key={cycle} label={cycle.toUpperCase()} color={cycle === "float" ? K.blue : cycle === "int" ? K.purple : K.green} size={48} style={{ position: "absolute", left: 560, top: 470, border: `5px solid ${K.ink}`, ...pop(f, cycleAt) }} />}
      {f >= c.tWhat && f < c.tells && <Chip label="❓ WHAT TYPE?" color={K.yellow} fg={K.ink} size={40} style={{ position: "absolute", left: 460, top: 470, border: `5px solid ${K.ink}`, ...pop(f, c.tWhat) }} />}
      {f >= c.depending && <Chip label="DEPENDS ON THE VALUE" color={K.ink} size={30} style={{ position: "absolute", left: 420, top: 600, ...pop(f, c.depending) }} />}
    </>
  );
}

// ── JAVA: dynamic but strict — 5 + "hello" is a TypeError, no guessing ───────────────────────
function JavaBeat({ f, c }: { f: number; c: Cues }) {
  return (
    <>
      {f >= c.confused && (
        <div style={{ position: "absolute", left: 30, top: 24, display: "flex", alignItems: "center", gap: 14, ...pop(f, c.confused) }}>
          <Chip label="☕ JAVA DEVS" color={K.blue} size={32} />
          <span style={{ fontSize: 60, display: "inline-block", transform: `rotate(${10 * Math.sin((f - c.confused) / 4)}deg)` }}>🤔</span>
        </div>
      )}
      <div style={{ position: "absolute", left: 30, top: 130, display: "flex", gap: 14 }}>
        {f >= c.jDynamic && <Chip label="DYNAMIC ✓" color={K.green} size={36} style={pop(f, c.jDynamic)} />}
        {f >= c.strict && <Chip label="🔒 STILL STRICT" color={K.ink} size={36} style={pop(f, c.strict)} />}
      </div>
      {f >= c.tryIt && (
        <div style={{ position: "absolute", left: 30, top: 240, width: 900, borderRadius: 16, background: "#0F172A", border: `4px solid ${f >= c.stops ? K.red : "#0F172A"}`, padding: "18px 24px", boxSizing: "border-box", fontFamily: K.mono, fontSize: 38, color: "#E2E8F0", transform: `translateX(${shake(f, c.stops, 20, 10)}px)`, opacity: pop(f, c.tryIt).opacity }}>
          <div>
            <span style={{ color: "#94A3B8" }}>&gt;&gt;&gt; </span>
            {typed('5 + "hello"', f, c.tryIt, 0.35)}
          </div>
          {f >= c.stops && (
            <div style={{ color: "#FCA5A5", fontSize: 26, marginTop: 10, ...pop(f, c.stops) }}>
              <b>TypeError:</b> unsupported operand type(s) for +: &apos;int&apos; and &apos;str&apos;
            </div>
          )}
        </div>
      )}
      {f >= c.guess && <Chip label="🙅 NO GUESSING" color={K.red} size={40} style={{ position: "absolute", left: 480, top: 470, border: `4px solid ${K.ink}`, ...pop(f, c.guess) }} />}
    </>
  );
}

// ── EXAMPLE: an int with 109 digits is still an int (notebook num4); Java's long can't ─────────
const BIG = "5".repeat(109);
function ExampleBeat({ f, c }: { f: number; c: Cues }) {
  const n = f >= c.noLimit ? Math.min(109, Math.floor((f - c.noLimit) * 2.2)) : 0;
  const sizes = [{ label: "num1 (1 digit)", b: 28 }, { label: "num3 (25 digits)", b: 36 }, { label: "num4 (109 digits)", b: 76 }];
  return (
    <>
      {f >= c.oneMore && f < c.cant && <Chip label="➕ ONE MORE THING…" color={K.ink} size={30} style={{ position: "absolute", left: 30, top: 24, ...pop(f, c.oneMore) }} />}
      {f >= c.cant && <Chip label="☕ JAVA CAN'T DO THIS" color={K.red} size={30} style={{ position: "absolute", left: 30, top: 24, ...pop(f, c.cant) }} />}
      {f >= c.ePython && (
        <div style={{ position: "absolute", left: 30, top: 100, width: 900, borderRadius: 16, background: "#0F172A", padding: "16px 22px", boxSizing: "border-box", fontFamily: K.mono, fontSize: 24, color: "#E2E8F0", wordBreak: "break-all", ...pop(f, c.ePython) }}>
          <span style={{ color: "#94A3B8" }}>num4 = </span>
          {BIG.slice(0, n)}
          {n < 109 && f % 16 < 10 && <span style={{ color: K.yellow }}>▍</span>}
          <div style={{ marginTop: 8, fontFamily: K.ui, fontSize: 22, fontWeight: 900, color: K.yellow }}>{n} digits</div>
          {f >= c.stillInt && <div style={{ fontSize: 30, color: "#86EFAC", ...pop(f, c.stillInt) }}>type(num4) → &lt;class &apos;int&apos;&gt; ✓</div>}
        </div>
      )}
      {f >= c.digits && (
        <div style={{ position: "absolute", left: 420, top: 420, width: 510, display: "grid", gap: 8, ...pop(f, c.digits) }}>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 1, color: K.muted }}>MEMORY JUST GROWS (sys.getsizeof)</div>
          {sizes.map((z, i) => (
            <div key={z.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 210, fontFamily: K.mono, fontSize: 17, color: K.ink, whiteSpace: "nowrap" }}>{z.label}</div>
              <div style={{ height: 26, width: 210 * (z.b / 76) * draw(f, c.digits + i * 6, 12), background: K.green, borderRadius: 6 }} />
              <div style={{ fontFamily: K.mono, fontSize: 18, fontWeight: 800 }}>{z.b} B</div>
            </div>
          ))}
        </div>
      )}
      {f >= c.eJava && (
        <div style={{ position: "absolute", left: 420, top: 600, width: 510, borderRadius: 14, background: "#FFF1F1", border: `4px solid ${K.red}`, padding: "10px 16px", boxSizing: "border-box", fontFamily: K.mono, fontSize: 22, color: K.ink, transform: `translateX(${shake(f, c.overflowed, 18, 8)}px)`, opacity: pop(f, c.eJava).opacity }}>
          <div>☕ long n = 5555…;</div>
          {f >= c.overflowed && <div style={{ color: K.red, fontWeight: 800 }}>✗ error: integer number too large</div>}
        </div>
      )}
    </>
  );
}

// ── RECAP: values have types · variables are labels · Python still checks → next: NumPy ────────
function RecapBeat({ f, c }: { f: number; c: Cues }) {
  const rows = [
    { at: c.values, icon: "5", text: "Values have types", color: K.blue },
    { at: c.labels, icon: "x", text: "Variables are just labels", color: K.yellow },
    { at: c.checksWork, icon: "🔒", text: "Python still checks your work", color: K.green },
  ];
  const collapse = enter(f, Math.min(c.replace, c.loop - 10), 16);
  const hl = f >= c.rOne && collapse === 0;
  return (
    <>
      {f >= c.oneLine && <Chip label="DAY 2 IN ONE LINE" color={K.ink} size={32} style={{ position: "absolute", left: 30, top: 24, ...pop(f, c.oneLine) }} />}
      {rows.map((r, i) =>
        f >= r.at ? (
          <div key={r.text} style={{ position: "absolute", left: 30, top: 110 + i * 100, width: 900, height: 84, borderRadius: 16, background: "#fff", border: `4px solid ${K.ink}`, display: "flex", alignItems: "center", gap: 18, padding: "0 18px", boxSizing: "border-box", ...pop(f, r.at) }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: r.color, border: `3px solid ${K.ink}`, display: "grid", placeItems: "center", fontFamily: K.head, fontSize: 32, color: r.color === K.yellow ? K.ink : "#fff" }}>{r.icon}</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: K.ink }}>{r.text}</div>
            <div style={{ marginLeft: "auto", fontSize: 36, color: K.green }}>✓</div>
          </div>
        ) : null,
      )}
      {f >= c.work && <Chip label="3 IDEAS ✓" color={K.green} size={30} style={{ position: "absolute", left: 40, top: 430, border: `4px solid ${K.ink}`, ...tilt(pop(f, c.work, 8), -4) }} />}
      {f >= c.numpy && (
        <div style={{ position: "absolute", left: 400, top: 430, width: 530, ...pop(f, c.numpy) }}>
          <Chip label="NEXT → DAY 3: NUMPY" color={K.blue} size={32} style={{ border: `4px solid ${K.ink}` }} />
          <div style={{ marginTop: 14, borderRadius: 14, background: "#0F172A", outline: hl ? `4px solid ${K.yellow}` : "none", padding: "12px 18px", fontFamily: K.mono, fontSize: 24, color: "#E2E8F0", whiteSpace: "pre", height: 120, overflow: "hidden" }}>
            <div style={{ opacity: 1 - collapse, transform: `translateY(${-30 * collapse}px)` }}>
              {"for v in values:\n    result.append(v * 2)"}
            </div>
            {collapse > 0 && <div style={{ color: "#86EFAC", fontSize: 34, marginTop: -40, ...pop(f, c.loop - 4) }}>result = values * 2</div>}
          </div>
        </div>
      )}
    </>
  );
}
