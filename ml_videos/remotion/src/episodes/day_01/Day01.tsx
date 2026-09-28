// Day 1 — What is Machine Learning? — animated technical explainer (claude/ANIMATION_GUIDE.md).
// Script v2 (claude/episodes/day_01/voiceover_sheet_v2.md): topic first, one Java thread, chapters.
// One persistent Java-dev workspace; every change is cued to the spoken word via at(beat, "word").
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { draw, enter, pop, T } from "../../shared/anim";
import { Backdrop, CaptionPill, ChapterBar, Chip, Code, Folder, Header, K, Narrator, Row, Tab, TermCard, TimelineProvider, TitleCard, tilt, useCues, useTimeline, Workspace } from "../../shared/explainer/kit";
import type { EpisodeMeta, Timeline } from "../../shared/types";

export type EpisodeProps = { timeline: Timeline; meta: EpisodeMeta };

const RULE_LINES = [
  'if (email.contains("prize"))',
  "    return SPAM;",
  "else if (sender.isTrusted())",
  "    return SAFE;",
  'else if (subject.startsWith("Re:"))',
  "    return SAFE;",
  "else if (email.hasLink() && isNew(sender))",
  "    return SPAM;",
  'else if (body.contains("unsubscribe"))',
  "    return SAFE;",
  "else if (isFriday() && hasPrize(email))",
  "    return MAYBE;",
  "// TODO: gift cards?",
  '// TODO: "prize" in replies?',
  "else if (...)",
  "    ...",
];
const EXAMPLES = [
  { s: "YOU WON A PRIZE!!!", label: "SPAM" },
  { s: "Sprint review notes", label: "SAFE" },
  { s: "Claim your reward", label: "SPAM" },
  { s: "Your prize order shipped", label: "SAFE" },
  { s: "Free gift card inside", label: "SPAM" },
  { s: "Lunch at 1pm?", label: "SAFE" },
];
const CLUES = [
  { w: '"prize"', weight: 0.8 },
  { w: "!!!", weight: 0.7 },
  { w: "unknown sender", weight: 0.6 },
  { w: "odd link", weight: 0.5 },
];

type Cues = Record<string, number>;

export const Day01: React.FC<EpisodeProps> = ({ timeline, meta }) => (
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
    folder: at("hook", "spam"), // "Your spam folder uses it every day" — the example starts here
    prize: at("hook", "prize|won"),
    lands: at("hook", "lands"),
    nobody: at("hook", "nobody"),
    rule: at("hook", "rule"),
    how: at("hook", "how"),
    java1: start("rules"),
    write: at("rules", "rule"),
    prize2: at("rules", "prize"),
    spam2: at("rules", "spam"),
    real: at("rules", "real"),
    too: at("rules", "too"),
    exceptions: at("rules", "exceptions"),
    maze: at("rules", "maze"),
    cant: at("rules", "cant|can't"),
    every: at("rules", "every"),
    case: at("rules", "case"),
    flips: at("shift", "flips"),
    instead: at("shift", "instead"),
    examples: at("shift", "examples"),
    give: start("training"),
    labeled: at("training", "labeled"),
    clues: at("training", "clues"),
    tends: at("training", "tends"),
    corrects: at("training", "corrects"),
    wrong: at("training", "wrong"),
    model: at("training", "model"),
    training: at("training", "training"),
    arrives: at("prediction", "new|arrives"),
    checks: at("prediction", "checks"),
    likely: at("prediction", "likely"),
    promise: at("prediction", "promise"),
    people: at("prediction", "people"),
    check: at("prediction", "check"),
    java: start("java"),
    maze2: at("java", "maze"),
    two: at("java", "two"),
    train: at("java", "train"),
    predict: at("java", "predict"),
    later: at("java", "later"),
    ml: start("takeaway"),
    examples2: at("takeaway", "examples"),
    predict2: at("takeaway", "predict"),
    cases: at("takeaway", "cases"),
    done: at("takeaway", "done"),
    next: at("takeaway", "next"),
    language: at("takeaway", "language"),
    day2: at("takeaway", "day", 2),
    writing: at("shift", "writing"),
    learns: at("training", "learns"),
    eyes: at("takeaway", "eyes|java"),
  };

  const pointing = f < c.folder || (f >= c.how && f < c.java1) || (f >= c.model && f < c.training) || f >= c.done;

  // ── Tabs ────────────────────────────────────────────────────────────────────────────────
  const active = f < c.java1 ? "inbox" : f < c.examples ? "rules" : f < c.arrives ? "csv" : f < c.java ? "test" : f < c.ml ? "main" : "recap";
  const tabs = (
    <>
      {f < c.examples + 10 && <Tab label="✉ Inbox" active={active === "inbox"} />}
      {f >= c.nobody && f < c.java && <Tab label="☕ SpamRules.java" active={active === "rules"} closed={enter(f, c.instead, T.enter)} style={{ transform: `scale(${enter(f, c.nobody, 6)})`, transformOrigin: "left center" }} />}
      {f >= c.examples && f < c.ml && <Tab label="▦ examples.csv" active={active === "csv"} style={pop(f, c.examples)} />}
      {f >= c.arrives && f < c.ml && <Tab label="▶ Test" active={active === "test"} style={pop(f, c.arrives)} />}
      {f >= c.java && f < c.ml && <Tab label="☕ Main.java" active={active === "main"} style={pop(f, c.java)} />}
      {f >= c.ml && <Tab label="★ Recap" active style={pop(f, c.ml)} />}
    </>
  );

  // ── Sidebar ─────────────────────────────────────────────────────────────────────────────
  const ruleLines = f < c.prize2 ? 0 : f < c.exceptions ? 2 : Math.min(RULE_LINES.length, 2 + Math.floor((f - c.exceptions) / Math.max(3, (c.maze - c.exceptions) / (RULE_LINES.length - 2))));
  const ruleCount = RULE_LINES.slice(0, ruleLines).filter((l) => /return/.test(l)).length;
  const sidebar = (
    <>
      <Folder label="Inbox" count={f >= c.prize && f < c.lands + 6 ? 13 : 12} active />
      <Folder label="Spam" count={f >= c.lands + 6 ? 4 : 3} color={K.red} flash={enter(f, c.lands + 6, 5) * (1 - enter(f, c.lands + 20, 8))} />
      {f >= c.write && f < c.give && <Metric label="RULES" value={ruleCount} color={ruleCount > 3 ? K.red : K.ink} bump={enter(f, c.exceptions + 5 * Math.max(0, ruleLines - 3), 4)} struck={enter(f, c.instead, T.enter)} />}
      {f >= c.give && f < c.model && <Metric label="EXAMPLES" value={EXAMPLES.length} color={K.blue} />}
      {f >= c.model && <Metric label="MODEL" value="✓" color={K.green} bump={enter(f, c.model, 6)} />}
    </>
  );

  const chapters = (meta.chapters ?? []).map((ch) => ({ label: ch.label, from: start(ch.beat) }));

  return (
    <AbsoluteFill style={{ fontFamily: K.ui, overflow: "hidden" }}>
      <Audio src={staticFile(tl.audio)} />
      <Backdrop />
      <Header f={f} day={meta.day} title={meta.title} />
      {chapters.length > 0 && <ChapterBar f={f} chapters={chapters} />}

      <Workspace f={f} tabs={tabs} sidebar={sidebar}>
        {inBeat("hook") && <Hook f={f} c={c} />}
        {(inBeat("rules") || (inBeat("shift") && f < c.examples)) && <Rules f={f} c={c} lines={ruleLines} />}
        {f >= c.examples && f < c.arrives && <ExamplesTable f={f} c={c} />}
        {inBeat("prediction") && <Prediction f={f} c={c} />}
        {inBeat("java") && <JavaSplit f={f} c={c} />}
        {inBeat("takeaway") && <Recap f={f} c={c} />}
      </Workspace>

      {/* term cards — the reveal moments */}
      {f >= c.how && f < c.java1 && <TermCard text="HOW?" style={{ left: 600, top: 720, ...tilt(pop(f, c.how), -4) }} />}
      {f >= c.java1 && f < c.write + 6 && <TermCard text="YOUR JAVA CODE" color={K.ink} fg={K.yellow} size={84} style={{ left: 250, top: 560, ...tilt(pop(f, c.java1), -3) }} />}
      {f >= c.maze && f < c.cant + 4 && <TermCard text="RULE MAZE" style={{ left: 260, top: 590, ...tilt(pop(f, c.maze), -3) }} />}
      {f >= c.flips && f < c.examples && <TermCard text="FLIP IT" color={K.blue} style={{ left: 380, top: 560, ...tilt(pop(f, c.flips), -3) }} />}
      {f >= c.writing && f < c.examples && (
        <div style={{ position: "absolute", left: 300, top: 740, ...tilt(pop(f, c.writing), 2) }}>
          <Chip label="RULES ✗  →  EXAMPLES ✓" color={K.ink} fg={K.yellow} size={34} style={{ border: `5px solid ${K.ink}` }} />
        </div>
      )}
      {f >= c.learns && f < c.model && (
        <div style={{ position: "absolute", left: 560, top: 560, ...tilt(pop(f, c.learns), -2) }}>
          <Chip label="LEARNED PATTERN" color={K.ink} fg={K.yellow} size={34} style={{ border: `5px solid ${K.ink}` }} />
        </div>
      )}
      {f >= c.model && f < c.training && <TermCard text="MODEL" color={K.yellow} fg={K.ink} size={150} style={{ left: 420, top: 500, ...tilt(pop(f, c.model), -3) }} />}
      {f >= c.promise && f < c.people && <TermCard text="NOT A PROMISE" size={96} style={{ left: 300, top: 600, ...tilt(pop(f, c.promise), -2) }} />}
      {f >= c.two && f < c.train + 4 && <TermCard text="2 STEPS" color={K.green} style={{ left: 480, top: 420, ...tilt(pop(f, c.two), -3) }} />}
      {f >= c.done && <TermCard text={`DAY ${meta.day} DONE`} color={K.yellow} fg={K.ink} size={130} style={{ left: 220, top: 400, ...tilt(pop(f, c.done), -3) }} />}
      {/* teaser builds on the words: "Next, Day 2…" → "the language ML speaks" → "through Java eyes" */}
      {f >= c.next && (
        <div style={{ position: "absolute", left: 250, right: 120, top: 1040, display: "flex", justifyContent: "center", alignItems: "center", gap: 14, ...pop(f, c.next) }}>
          <Chip label="NEXT →" color={K.blue} size={30} style={{ border: `5px solid ${K.ink}` }} />
          {f >= c.day2 && <Chip label={`DAY ${meta.next.day}`} color={K.blue} size={30} style={{ border: `5px solid ${K.ink}`, ...pop(f, c.day2) }} />}
          {f >= c.language && <Chip label="ML'S LANGUAGE" color={K.ink} fg={K.yellow} size={30} style={{ border: `5px solid ${K.ink}`, ...pop(f, c.language) }} />}
        </div>
      )}
      {f >= c.eyes && <TermCard text="THROUGH JAVA EYES" color={K.blue} size={84} style={{ left: 190, top: 780, ...tilt(pop(f, c.eyes), -3) }} />}
      {meta.titleCard && <TitleCard f={f} line={meta.titleCard.line} sub={meta.titleCard.sub} until={c.folder} />}

      <Narrator pose={pointing ? "point" : "present"} />
      <CaptionPill f={f} />
    </AbsoluteFill>
  );
}

function Metric({ label, value, color, bump = 1, struck = 0 }: { label: string; value: React.ReactNode; color: string; bump?: number; struck?: number }) {
  return (
    <div style={{ marginTop: 34, position: "relative" }}>
      <div style={{ fontSize: 17, fontWeight: 800, color: K.muted, letterSpacing: 1.5 }}>{label}</div>
      <div style={{ fontFamily: K.head, fontSize: 84, color, transform: `scale(${1 + 0.15 * (1 - bump)})`, transformOrigin: "left center" }}>{value}</div>
      {struck > 0 && <div style={{ position: "absolute", left: 0, top: 70, width: 150 * struck, height: 8, background: K.red, transform: "rotate(-12deg)" }} />}
    </div>
  );
}

// ── Beat 1: the spam folder (the example) ─────────────────────────────────────────────────
function Hook({ f, c }: { f: number; c: Cues }) {
  const newMail = enter(f, c.prize, T.enter);
  const fly = enter(f, c.lands, T.enter);
  const codePanel = enter(f, c.nobody, T.enter);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 22, transform: `translateY(${newMail * (1 - fly) * 104}px)` }}>
        {["Sprint review notes", "Invoice #2291", "Lunch at 1pm?", "Build passed ✓"].map((s, i) => (
          <Row key={s} y={i * 104} title={s} sub={["Priya · Team", "Accounts", "Sam", "CI server"][i]} style={pop(f, c.folder + i * T.stagger)} />
        ))}
      </div>
      {newMail > 0 && fly < 1 && (
        <Row
          y={22}
          title="YOU WON A PRIZE!!!"
          sub="winner@lucky-prize.biz"
          tone="alert"
          badge={f >= c.lands ? "SPAM" : "NEW"}
          badgeTone={f >= c.lands ? K.red : K.blue}
          style={{ opacity: 1 - fly * 0.6, transform: `translate(${-300 * fly}px, ${-120 * (1 - newMail) + 20 * fly}px) scale(${1 - 0.55 * fly})`, transformOrigin: "left center" }}
        />
      )}
      {codePanel > 0 && (
        <div style={{ position: "absolute", left: 20, right: 20, bottom: 24, height: 250, borderRadius: 18, background: "#0F172A", padding: "22px 26px", boxSizing: "border-box", fontFamily: K.mono, fontSize: 28, lineHeight: 1.5, transform: `translateY(${280 * (1 - codePanel)}px)` }}>
          <div><Code dark text="class SpamRules {" /></div>
          <div><Code dark text={'    // no rule for "prize"'} /></div>
          <div><Code dark text="}" /></div>
          <div style={{ position: "absolute", right: 22, top: 22, ...pop(f, c.rule) }}>
            <Chip label="0 RULES" color={K.red} size={24} />
          </div>
        </div>
      )}
    </>
  );
}

// ── Beat 2 (+ start of 3): your Java rules become a maze ──────────────────────────────────
function Rules({ f, c, lines }: { f: number; c: Cues; lines: number }) {
  const typed1 = Math.round(Math.max(0, Math.min(1, (f - c.write) / Math.max(8, c.spam2 - c.write - 4))) * RULE_LINES[0].length);
  const typed2 = Math.round(Math.max(0, Math.min(1, (f - c.spam2) / 8)) * RULE_LINES[1].length);
  const shown = [RULE_LINES[0].slice(0, typed1), RULE_LINES[1].slice(0, typed2), ...RULE_LINES.slice(2, lines)].filter((l, i) => (i < 2 ? l.length > 0 : true));
  const LH = 40;
  const scroll = Math.max(0, shown.length - 9) * LH;
  // The rule runs as soon as it is written (on "spam"), then the real email breaks it (on "real").
  const testRun = enter(f, c.spam2 + 10, T.enter);
  const noRuleOut = enter(f, c.cant, 6);
  const flipped = enter(f, c.flips, T.enter); // shift beat: the rulebook greys out
  const enterT = enter(f, c.java1, 6);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: enterT, transform: `translateX(${60 * (1 - enterT)}px)`, filter: flipped > 0 ? `grayscale(${flipped}) blur(${flipped * 1.5}px)` : undefined }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 400, overflow: "hidden", background: f >= c.maze && f < c.cant ? "#FFF5F5" : "#fff" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 18, transform: `translateY(${-scroll}px)` }}>
          {shown.map((l, i) => (
            <div key={i} style={{ height: LH, display: "flex", alignItems: "center", fontFamily: K.mono, fontSize: 25, whiteSpace: "pre" }}>
              <span style={{ width: 64, textAlign: "right", paddingRight: 18, color: "#B0B8C4", fontSize: 20 }}>{i + 1}</span>
              <Code text={l} />
              {i === shown.length - 1 && f < c.maze && Math.floor(f / 8) % 2 === 0 && <span style={{ width: 3, height: 30, background: K.ink, marginLeft: 2 }} />}
            </div>
          ))}
        </div>
      </div>
      {f >= c.prize2 && f < c.exceptions && (
        <div style={{ position: "absolute", right: 24, top: 110, ...tilt(pop(f, c.prize2), 3) }}>
          <Chip label="RULE #1: PRIZE → SPAM" color={K.yellow} fg={K.ink} size={26} style={{ border: `4px solid ${K.ink}` }} />
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: 400, bottom: 0, background: K.panel, borderTop: `2px solid ${K.line}`, opacity: testRun }}>
        <div style={{ position: "absolute", left: 22, top: 14, fontSize: 18, fontWeight: 900, letterSpacing: 2, color: K.muted }}>TEST RUN</div>
        <div style={{ position: "absolute", inset: 0, opacity: 1 - noRuleOut, transform: `translateX(${-50 * noRuleOut}px)` }}>
          <Row y={50} title="YOU WON A PRIZE!!!" sub="winner@lucky-prize.biz" badge={f >= c.spam2 + 22 ? "SPAM ✓" : "RUNNING…"} badgeTone={f >= c.spam2 + 22 ? K.green : K.muted} style={pop(f, c.spam2 + 12)} />
          {f >= c.real && <Row
            y={144}
            title="Your prize order shipped"
            sub="orders@realshop.com"
            badge={f >= c.too ? "SPAM ✗ WRONG" : "REAL"}
            badgeTone={f >= c.too ? K.red : K.blue}
            style={{ ...pop(f, c.real), ...(f >= c.too && f < c.too + 10 ? { transform: `translateX(${Math.sin((f - c.too) * 2.2) * 10}px)` } : {}) }}
          />}
        </div>
        {[
          { at: c.cant, s: "Claim your reward", sub: "rewards@promo.net", y: 50 },
          { at: c.every, s: "Free gift card inside", sub: "gift@cards.co", y: 144 },
          { at: c.case, s: "Hi, it's your bank", sub: "support@bank-help.io", y: 238 },
        ].map((m) => (f >= m.at ? <Row key={m.s} y={m.y} title={m.s} sub={m.sub} badge="NO RULE ?" badgeTone="#8A94A6" style={pop(f, m.at)} /> : null))}
      </div>
    </div>
  );
}

// ── Beats 3–4: examples → labels → clues → model → training ───────────────────────────────
function ExamplesTable({ f, c }: { f: number; c: Cues }) {
  const ROW_H = 80;
  const panel = enter(f, c.clues, T.enter);
  const feedbackOn = f >= c.wrong && f < c.model;
  const collapse = enter(f, c.model, T.enter);
  const trainArrow = draw(f, c.training);
  const tableW = panel > 0 ? 440 : 708;
  const adjust = enter(f, c.corrects, 14);
  return (
    <>
      <div style={{ position: "absolute", left: 20, top: 22, width: tableW, borderRadius: 16, border: `3px solid ${K.line}`, overflow: "hidden", background: "#fff", ...pop(f, c.examples) }}>
        <div style={{ display: "flex", background: K.panel, borderBottom: `2px solid ${K.line}`, fontSize: 18, fontWeight: 900, letterSpacing: 1.5, color: K.muted, padding: "12px 18px" }}>
          <span style={{ flex: 1 }}>EMAIL</span>
          <span style={{ width: 120, textAlign: "center", opacity: enter(f, c.labeled, 6) }}>LABEL</span>
        </div>
        {EXAMPLES.map((e, i) => {
          const labelAt = c.labeled + i * T.stagger;
          const correct = i % 3 !== 1;
          return (
            <div key={e.s} style={{ display: "flex", alignItems: "center", height: ROW_H, padding: "0 18px", borderBottom: `2px solid ${K.line}`, background: "#fff", ...pop(f, c.examples + 3 + i * T.stagger) }}>
              <span style={{ flex: 1, fontSize: 25, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.s}</span>
              <span style={{ width: 120, textAlign: "center" }}>{f >= labelAt && <Chip label={e.label} color={e.label === "SPAM" ? K.red : K.green} size={20} style={pop(f, labelAt)} />}</span>
              {feedbackOn && <span style={{ marginLeft: 8, fontSize: 28, fontWeight: 900, color: correct ? K.green : K.red, ...pop(f, c.wrong + i * 2) }}>{correct ? "✓" : "✗"}</span>}
            </div>
          );
        })}
      </div>

      {panel > 0 && (
        <div style={{ position: "absolute", right: 20, top: 22, width: 250, height: 520, borderRadius: 18, border: `3px solid ${K.ink}`, background: collapse > 0 ? `rgba(255,214,0,${0.25 * collapse})` : "#fff", transform: `translateX(${40 * (1 - panel)}px)`, opacity: panel, padding: 18, boxSizing: "border-box" }}>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 1.5, color: K.muted }}>{collapse > 0.5 ? "MODEL" : f >= c.corrects ? "CLUES · ADJUSTING" : "CLUES"}</div>
          {CLUES.map((cl, i) => {
            const clueAt = c.clues + 3 + i * T.stagger;
            const w = cl.weight * (0.55 + 0.45 * adjust) - (i === 3 ? 0.2 * adjust : 0);
            return (
              <div key={cl.w} style={{ marginTop: 16, ...pop(f, clueAt), opacity: f >= clueAt ? 1 - collapse * 0.8 : 0 }}>
                <Chip label={cl.w} color={i < 2 && f >= c.tends ? K.red : K.ink} size={20} />
                <div style={{ marginTop: 8, height: 12, borderRadius: 6, background: K.line }}>
                  <div style={{ width: `${Math.max(0, w) * 100}%`, height: "100%", borderRadius: 6, background: K.blue }} />
                </div>
              </div>
            );
          })}
          {collapse > 0 && (
            <div style={{ position: "absolute", left: 18, right: 18, bottom: 18, height: 200, borderRadius: 16, background: K.ink, display: "grid", placeItems: "center", ...pop(f, c.model) }}>
              <svg width={150} height={110} viewBox="0 0 150 110">
                <path d="M 30 20 L 118 55 M 30 55 L 118 55 M 30 90 L 118 55" stroke="#fff" strokeWidth={5} />
                {[20, 55, 90].map((y) => <circle key={y} cx={30} cy={y} r={12} fill={K.blue} stroke="#fff" strokeWidth={4} />)}
                <circle cx={118} cy={55} r={18} fill={K.yellow} stroke="#fff" strokeWidth={4} />
              </svg>
            </div>
          )}
        </div>
      )}

      {f >= c.training && (
        <div style={{ position: "absolute", left: 20, right: 20, top: 580, height: 160, display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
          <Chip label="EXAMPLES" color={K.blue} size={28} style={pop(f, c.training)} />
          <svg width={180} height={40} viewBox="0 0 180 40">
            <path d="M 5 20 L 165 20 M 150 8 L 168 20 L 150 32" fill="none" stroke={K.ink} strokeWidth={6} strokeLinecap="round" strokeDasharray="200" strokeDashoffset={200 * (1 - trainArrow)} />
          </svg>
          <Chip label="MODEL" color={K.ink} fg={K.yellow} size={28} style={pop(f, c.training + T.draw)} />
          <div style={{ position: "absolute", top: -8, left: 0, right: 0, textAlign: "center", fontFamily: K.head, fontSize: 40, color: K.green, ...pop(f, c.training + 4) }}>TRAINING</div>
        </div>
      )}
    </>
  );
}

// ── Beat 5: a new email → a prediction → people still check ───────────────────────────────
function Prediction({ f, c }: { f: number; c: Cues }) {
  const arrive = enter(f, c.arrives, T.enter);
  const gauge = enter(f, c.likely, 16);
  const lit = (i: number) => f >= c.checks + i * 6;
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 30, transform: `translateX(${(1 - arrive) * 500}px)` }}>
        <Row y={0} title="WIN A FREE PRIZE!!!" sub="deals@unknown-sender.biz" tone="alert" />
      </div>
      <div style={{ position: "absolute", left: 20, right: 20, top: 150, height: 220, borderRadius: 18, background: K.ink, padding: 22, boxSizing: "border-box", ...pop(f, c.checks) }}>
        <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 1.5, color: K.yellow }}>MODEL · CHECKING CLUES</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
          {CLUES.map((cl, i) => <Chip key={cl.w} label={lit(i) ? `✓ ${cl.w}` : cl.w} color={lit(i) ? K.red : "#374151"} size={24} />)}
        </div>
      </div>
      <div style={{ position: "absolute", left: 20, right: 20, top: 400, height: 150, borderRadius: 18, border: `3px solid ${K.line}`, background: "#fff", padding: 22, boxSizing: "border-box", ...pop(f, c.likely) }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 900, color: K.muted }}>
          <span>SAFE</span>
          <span>SPAM</span>
        </div>
        <div style={{ marginTop: 12, height: 22, borderRadius: 11, background: K.line }}>
          <div style={{ width: `${0.82 * gauge * 100}%`, height: "100%", borderRadius: 11, background: K.red }} />
        </div>
        <div style={{ marginTop: 14, fontFamily: K.head, fontSize: 40, color: K.red }}>LIKELY SPAM</div>
      </div>
      {f >= c.people && (
        <div style={{ position: "absolute", left: 20, right: 20, top: 580, height: 160, display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
          <Chip label="MODEL" color={K.ink} fg={K.yellow} size={28} style={pop(f, c.people)} />
          <svg width={120} height={80} viewBox="0 0 120 80">
            <path d="M 10 30 C 40 0 80 0 110 30 M 110 50 C 80 80 40 80 10 50" fill="none" stroke={K.green} strokeWidth={6} strokeDasharray="160" strokeDashoffset={160 * (1 - draw(f, c.check))} />
          </svg>
          <Chip label="👤 HUMAN CHECK" color={K.green} size={28} style={pop(f, c.people + 6)} />
        </div>
      )}
    </>
  );
}

// ── Beat 6: in Java terms — the maze vs two steps ─────────────────────────────────────────
function JavaSplit({ f, c }: { f: number; c: Cues }) {
  const right = enter(f, c.two, T.enter);
  const MAZE = [...RULE_LINES, ...RULE_LINES.slice(2, 12)];
  const grown = Math.max(2, Math.min(MAZE.length, Math.round(((f - c.java) / Math.max(1, c.maze2 - c.java)) * MAZE.length)));
  const t1 = "model.train(emails, labels);";
  const t2 = "model.predict(newEmail);";
  const n1 = Math.round(Math.max(0, Math.min(1, (f - c.train) / 14)) * t1.length);
  const n2 = Math.round(Math.max(0, Math.min(1, (f - c.predict) / 12)) * t2.length);
  const mazeOut = enter(f, c.two, T.enter);
  return (
    <>
      <div style={{ position: "absolute", left: 20, top: 22, width: right > 0 ? 300 : 708, bottom: 40, borderRadius: 16, background: "#FFF5F5", border: `3px solid ${K.red}`, overflow: "hidden", padding: "16px 14px", boxSizing: "border-box", ...pop(f, c.java) }}>
        <Chip label="BEFORE · IF-ELSE MAZE" color={K.red} size={18} />
        <div style={{ marginTop: 14, fontFamily: K.mono, fontSize: right > 0 ? 15 : 22, lineHeight: 1.55, whiteSpace: "pre", opacity: 1 - 0.4 * mazeOut }}>
          {MAZE.slice(0, grown).map((l, i) => (
            <div key={i} style={i === grown - 1 && f < c.maze2 ? { background: "#FFE1E1" } : undefined}><Code text={l} /></div>
          ))}
        </div>
        {f >= c.two && <div style={{ position: "absolute", left: 10, right: 10, top: "45%", height: 10, background: K.red, transform: `rotate(-20deg) scaleX(${enter(f, c.two + 4, T.enter)})` }} />}
      </div>
      {right > 0 && (
        <div style={{ position: "absolute", right: 20, top: 22, width: 400, bottom: 40, borderRadius: 16, background: "#EEF9F2", border: `3px solid ${K.green}`, padding: "16px 18px", boxSizing: "border-box", opacity: right, transform: `translateX(${40 * (1 - right)}px)` }}>
          <Chip label="AFTER · 2 STEPS" color={K.green} size={18} />
          <div style={{ marginTop: 40, fontFamily: K.mono, fontSize: 19, lineHeight: 2 }}>
            <div style={{ fontSize: 17, color: K.muted, fontFamily: K.ui, fontWeight: 900, opacity: f >= c.train ? 1 : 0.3 }}>1 · TRAIN</div>
            <div style={{ whiteSpace: "pre" }}><Code text={t1.slice(0, n1)} /></div>
            <div style={{ marginTop: 26, fontSize: 17, color: K.muted, fontFamily: K.ui, fontWeight: 900, opacity: f >= c.predict ? 1 : 0.3 }}>2 · PREDICT</div>
            <div style={{ whiteSpace: "pre" }}><Code text={t2.slice(0, n2)} /></div>
          </div>
          <div style={{ position: "absolute", left: 18, bottom: 18, fontSize: 16, color: K.muted, fontWeight: 700 }}>conceptual Java · real code comes later</div>
          {f >= c.later && <Chip label="CODE: LATER IN SERIES" color={K.blue} size={20} style={{ position: "absolute", left: 18, bottom: 56, ...pop(f, c.later) }} />}
        </div>
      )}
    </>
  );
}

// ── Beat 7: the one-line takeaway ─────────────────────────────────────────────────────────
function Recap({ f, c }: { f: number; c: Cues }) {
  const steps = [
    { label: "EXAMPLES", color: K.blue, at: c.examples2 },
    { label: "MODEL", color: K.ink, fg: K.yellow, at: c.predict2 },
    { label: "PREDICTION", color: K.green, at: c.cases },
  ];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: 1 - 0.65 * enter(f, c.done, T.enter) }}>
      <div style={{ fontFamily: K.head, fontSize: 44, color: K.ink, ...pop(f, c.ml) }}>MACHINE LEARNING =</div>
      {steps.map((s, i) => (
        <React.Fragment key={s.label}>
          <div style={{ ...pop(f, s.at) }}>
            <Chip label={s.label} color={s.color} fg={s.fg ?? "#fff"} size={46} style={{ border: `6px solid ${K.ink}` }} />
          </div>
          {i < steps.length - 1 && <div style={{ fontSize: 50, fontWeight: 900, color: K.ink, opacity: enter(f, steps[i + 1].at, 6) }}>↓</div>}
        </React.Fragment>
      ))}
    </div>
  );
}
