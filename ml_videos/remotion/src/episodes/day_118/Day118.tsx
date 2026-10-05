// DAF-18 — "The Board Paper": final test, error analysis, model card (Delhi Air Forecast project video).
// Script: claude/episodes/daf_18/script.md · facts only from 18_final_test_and_model_card.ipynb + 18_visual_walkthrough.ipynb.
// Same channel language as Day 0/1/2: workspace stage, title card, chapter bar, every element pops on its spoken word.
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { draw, enter, mix, pop } from "../../shared/anim";
import { Backdrop, CaptionPill, ChapterBar, Chip, Header, K, Narrator, Row, Tab, TermCard, TimelineProvider, TitleCard, tilt, useCues, useTimeline, Workspace } from "../../shared/explainer/kit";
import type { EpisodeMeta, Timeline } from "../../shared/types";

export type EpisodeProps = { timeline: Timeline; meta: EpisodeMeta };
type A = (word: string, nth?: number) => number; // frame of a spoken word inside the current beat

// ── toy town data (18_visual_walkthrough.ipynb; every number was really calculated there) ──────────────
const READINGS = [115, 103, 113, 71, 69, 83, 87, 108, 120, 110, 68, 85, 93, 89, 116, 123, 109, 91, 73, 85, 64, 104];
const ROWS = READINGS.slice(0, -1).map((today, i) => ({ row: i + 1, today, tomorrow: READINGS[i + 1] }));
const STUDY = ROWS.filter((r) => r.row <= 14);
const RIDGE = [100.7, 102.8, 98.5, 93.1, 87.6, 91.2, 84.8]; // Ridge's forecast for sealed rows 15..21
const SEALED = ROWS.filter((r) => r.row >= 15).map((r, i) => ({ ...r, ridge: RIDGE[i] }));

const count = (f: number, at: number, to: number, span = 30, dec = 1) => (to * enter(f, at, span)).toFixed(dec);
const abs = (f: number, at: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", ...pop(f, at), ...extra });

export const Day118: React.FC<EpisodeProps> = ({ timeline, meta }) => (
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
  const a = (id: string): A => (word, nth = 1) => at(id, word, nth);
  const chapters = (meta.chapters ?? []).map((ch) => ({ label: ch.label, from: start(ch.beat) }));

  const TABS = [
    { label: "📓 18_final_test.ipynb", from: 0 },
    { label: "🏫 school.md", from: start("school") },
    { label: "⚖ two_ways", from: start("ways") },
    { label: "🎫 tickets", from: start("history") },
    { label: "✉ envelope", from: start("envelope") },
    { label: "⚠ the_trap", from: start("trap") },
    { label: "📋 requirements.md", from: start("rules") },
    { label: "🧸 toy_town", from: start("toy") },
    { label: "🧪 test_run", from: start("open") },
    { label: "📅 walk_forward", from: start("second") },
    { label: "🔍 worst_days", from: start("worst") },
    { label: "💾 model.joblib", from: start("save") },
    { label: "📋 recap", from: start("recap") },
  ].filter((t) => f >= t.from);
  const active = TABS[TABS.length - 1];

  const as = { school: a("school"), trap: a("trap"), ways: a("ways"), envelope: a("envelope"), recap: a("recap"), rules: a("rules"), hook: a("hook"), worst: a("worst") };
  const pointing =
    (f >= as.hook("confused") && f < start("school")) ||
    (f >= as.school("decide") && f < as.school("guess")) ||
    (f >= as.ways("question") && f < start("history")) ||
    (f >= as.envelope("catch") && f < as.envelope("locked")) ||
    (f >= as.trap("rule") && f < start("rules")) ||
    (f >= as.rules("both") && f < as.rules("honestly")) ||
    (f >= as.worst("patterns") && f < start("save")) ||
    f >= as.recap("done");

  return (
    <AbsoluteFill style={{ fontFamily: K.ui, overflow: "hidden" }}>
      <Audio src={staticFile(tl.audio)} />
      <Backdrop />
      <Header f={f} day={meta.day} title={meta.title} badge={meta.badge} />
      <ChapterBar f={f} chapters={chapters} />
      <Workspace f={f} tabs={<>{TABS.slice(-3).map((t) => <Tab key={t.label} label={t.label} active={t === active} style={t.from > 0 ? pop(f, t.from) : undefined} />)}</>}>
        {inBeat("hook") && <HookBeat f={f} a={a("hook")} />}
        {inBeat("school") && <SchoolBeat f={f} a={a("school")} />}
        {inBeat("ways") && <WaysBeat f={f} a={a("ways")} />}
        {inBeat("history") && <HistoryBeat f={f} a={a("history")} />}
        {inBeat("envelope") && <EnvelopeBeat f={f} a={a("envelope")} />}
        {inBeat("trap") && <TrapBeat f={f} a={a("trap")} />}
        {inBeat("rules") && <RulesBeat f={f} a={a("rules")} />}
        {inBeat("toy") && <ToyBeat f={f} a={a("toy")} />}
        {inBeat("open") && <OpenBeat f={f} a={a("open")} />}
        {inBeat("second") && <SecondBeat f={f} a={a("second")} />}
        {inBeat("worst") && <WorstBeat f={f} a={a("worst")} />}
        {inBeat("save") && <SaveBeat f={f} a={a("save")} />}
        {inBeat("recap") && <RecapBeat f={f} a={a("recap")} />}
      </Workspace>
      {/* Term cards sit in page coordinates (workspace content origin = 56, 400). */}
      {inBeat("trap") && f >= as.trap("once") && <TermCard text="OPEN IT ONCE" color={K.yellow} fg={K.ink} size={96} style={{ left: 250, top: 880, ...tilt(pop(f, as.trap("once"), 8), -3) }} />}
      {inBeat("rules") && f >= as.rules("met") && <TermCard text="NOT MET?" color={K.red} size={86} style={{ left: 560, top: 1040, ...tilt(pop(f, as.rules("met"), 8), 3) }} />}
      {inBeat("worst") && f >= as.worst("failure") && <TermCard text="FAILURE CASES" color={K.red} size={84} style={{ left: 330, top: 1065, ...tilt(pop(f, as.worst("failure"), 8), -3) }} />}
      {inBeat("recap") && f >= as.recap("done") && f < as.recap("next") && <TermCard text="DAF-18 DONE ✓" color={K.green} size={96} style={{ left: 400, top: 1060, ...tilt(pop(f, as.recap("done"), 8), -3) }} />}
      {meta.titleCard && <TitleCard f={f} line={meta.titleCard.line} sub={meta.titleCard.sub} until={as.hook("confused")} />}
      <Narrator pose={pointing ? "point" : "present"} />
      <CaptionPill f={f} />
    </AbsoluteFill>
  );
}

// ── small shared pieces ───────────────────────────────────────────────────────────────────────────────
function Box({ x, y, w, h, color = K.line, bg = "#fff", children, style }: { x: number; y: number; w: number; h: number; color?: string; bg?: string; children?: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 18, border: `4px solid ${color}`, background: bg, boxSizing: "border-box", padding: "12px 16px", fontFamily: K.ui, ...style }}>
      {children}
    </div>
  );
}
const Label = ({ children, color = K.ink, size = 26 }: { children: React.ReactNode; color?: string; size?: number }) => (
  <div style={{ fontFamily: K.ui, fontWeight: 900, fontSize: size, color, lineHeight: 1.15 }}>{children}</div>
);
function Arrow({ f, at, x, y, len, color = K.ink, dir = "right" }: { f: number; at: number; x: number; y: number; len: number; color?: string; dir?: "right" | "down" }) {
  if (f < at) return null;
  const L = len * draw(f, at, 10);
  return dir === "right" ? (
    <div style={{ position: "absolute", left: x, top: y, width: L, height: 8, background: color, borderRadius: 4 }}>
      <div style={{ position: "absolute", right: -4, top: -8, width: 0, height: 0, borderTop: "12px solid transparent", borderBottom: "12px solid transparent", borderLeft: `20px solid ${color}`, opacity: L > len - 4 ? 1 : 0 }} />
    </div>
  ) : (
    <div style={{ position: "absolute", left: x, top: y, width: 8, height: L, background: color, borderRadius: 4 }}>
      <div style={{ position: "absolute", bottom: -4, left: -8, width: 0, height: 0, borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderTop: `20px solid ${color}`, opacity: L > len - 4 ? 1 : 0 }} />
    </div>
  );
}

// ── 1 · HOOK ───────────────────────────────────────────────────────────────────────────────────────────
function HookBeat({ f, a }: { f: number; a: A }) {
  const q = a("confused");
  return (
    <>
      <Chip label="👋 KALI · YOUR HOST" color={K.blue} size={32} style={abs(f, a("kali"), { left: 30, top: 24, border: `4px solid ${K.ink}` })} />
      <Box x={120} y={110} w={520} h={250} color={K.ink} style={{ ...abs(f, a("daf-18"), { padding: "18px 24px" }), boxShadow: `8px 8px 0 ${K.ink}`, transform: `${pop(f, a("daf-18")).transform} rotate(-2deg)` }}>
        <Label color={K.blue} size={28}>TICKET</Label>
        <div style={{ fontFamily: K.head, fontSize: 96, lineHeight: 1 }}>DAF-18</div>
        <Label size={30}>The Board Paper</Label>
        <div style={{ fontFamily: K.ui, fontSize: 22, color: K.muted, fontWeight: 700, marginTop: 6 }}>final test · model card</div>
      </Box>
      <Chip label="🌫 DELHI AIR FORECAST" color={K.green} size={28} style={abs(f, a("delhi"), { left: 280, top: 395 })} />
      {f >= q && (
        <div style={{ position: "absolute", left: 640, top: 90, ...pop(f, q) }}>
          <div style={{ fontFamily: K.head, fontSize: 240, color: K.red, WebkitTextStroke: `8px ${K.ink}`, transform: `rotate(${10 * Math.sin((f - q) / 6)}deg)` }}>?</div>
        </div>
      )}
      <Chip label="😕 CONFUSED" color={K.yellow} fg={K.ink} size={30} style={abs(f, q, { left: 650, top: 330, border: `4px solid ${K.ink}` })} />
      <Chip label="🏫 SO: A SCHOOL STORY" color={K.ink} size={34} style={abs(f, a("story"), { left: 300, top: 480, ...{ transform: `${pop(f, a("story")).transform} rotate(-2deg)` } })} />
    </>
  );
}

// ── 2 · SCHOOL: Asha madam, PM2.5, Poor ≥ 91, 6 pm decision ──────────────────────────────────────────
function SchoolBeat({ f, a }: { f: number; a: A }) {
  const dust = a("dust");
  const scaleY = (v: number) => 340 - (v / 160) * 300; // meter: 0..160 µg/m³ → px
  const level = mix(40, 130, enter(f, a("pm25"), 70));
  const poorAt = a("poor");
  const kids = Array.from({ length: 60 }, (_, i) => i);
  const hundred = a("hundred");
  return (
    <>
      <Chip label="🏫 DELHI SCHOOL" color={K.ink} size={28} style={abs(f, a("school"), { left: 24, top: 18 })} />
      <Chip label="👩‍🏫 ASHA MADAM" color={K.blue} size={28} style={abs(f, a("asha"), { left: 24, top: 70 })} />
      {/* PM2.5 dust drifting */}
      {f >= dust && Array.from({ length: 16 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: 330 + ((i * 53) % 190) + 10 * Math.sin((f + i * 9) / 11), top: 30 + ((i * 37) % 120) + ((f - dust) * (0.5 + (i % 3) * 0.3)) % 40, width: 10 + (i % 3) * 4, height: 10 + (i % 3) * 4, borderRadius: 99, background: "#8D6E63", opacity: 0.55 * enter(f, dust + i, 6) }} />
      ))}
      {f >= a("pm25") && <Chip label="PM2.5 · TINY DUST" color="#8D6E63" size={26} style={abs(f, a("pm25"), { left: 330, top: 170 })} />}
      {/* the meter */}
      <div style={{ position: "absolute", left: 720, top: 10, width: 220, height: 400, ...pop(f, a("pm25")) }}>
        <div style={{ position: "absolute", left: 20, top: 40, width: 70, height: 300, borderRadius: 16, border: `4px solid ${K.ink}`, background: "#fff", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 300 - (scaleY(level) - 40), background: level >= 91 ? K.red : K.green }} />
        </div>
        <Label size={22}>µg/m³</Label>
        {f >= a("ninety-one") && (
          <div style={{ position: "absolute", left: 0, top: scaleY(91), width: 200, ...pop(f, a("ninety-one")) }}>
            <div style={{ height: 0, borderTop: `5px dashed ${K.red}`, width: 110 }} />
            <div style={{ position: "absolute", left: 114, top: -18 }}><Label color={K.red} size={26}>91 = POOR</Label></div>
          </div>
        )}
      </div>
      {f >= poorAt && <TermCard text="POOR" color={K.red} size={70} style={{ left: 480, top: 250, ...tilt(pop(f, poorAt, 8), -4) }} />}
      {/* 600 children */}
      <div style={{ position: "absolute", left: 24, top: 130, width: 280, display: "flex", flexWrap: "wrap", gap: 6, opacity: enter(f, hundred, 8) }}>
        {kids.map((i) => (
          <span key={i} style={{ fontSize: 22, opacity: enter(f, hundred + i * 0.5, 4), transform: `translateY(${(f >= poorAt && f < a("evening") ? -3 * Math.abs(Math.sin((f + i) / 7)) : 0)}px)` }}>🧒</span>
        ))}
      </div>
      {f >= hundred && <Chip label="= 600 CHILDREN" color={K.yellow} fg={K.ink} size={26} style={abs(f, hundred, { left: 24, top: 360, border: `3px solid ${K.ink}` })} />}
      {/* 6 pm decision */}
      {f >= a("evening") && <Chip label="🕕 EVERY EVENING · 6 PM" color={K.ink} size={30} style={abs(f, a("evening"), { left: 300, top: 430 })} />}
      {f >= a("decide") && (
        <>
          <Box x={300} y={500} w={290} h={90} color={K.green} style={pop(f, a("outside", 2))}><Label size={32}>☀️ OUTSIDE?</Label></Box>
          <Box x={620} y={500} w={290} h={90} color={K.blue} style={pop(f, a("indoors"))}><Label size={32}>🏠 INDOORS?</Label></Box>
        </>
      )}
      {f >= a("guess") && (
        <Box x={300} y={620} w={610} h={110} color={K.ink} bg={K.yellow} style={{ ...pop(f, a("guess")), boxShadow: `6px 6px 0 ${K.ink}` }}>
          <Label size={34}>NEED: TOMORROW'S PM2.5 = ?</Label>
          <div style={{ fontFamily: K.ui, fontSize: 22, fontWeight: 800, color: K.ink }}>a guess, tonight</div>
        </Box>
      )}
    </>
  );
}

// ── 3 · WAYS: persistence vs Ridge → "better?" ───────────────────────────────────────────────────────
function WaysBeat({ f, a }: { f: number; a: A }) {
  const bar = (x: number, h: number, color: string, at: number, label: string) => (
    <div style={{ position: "absolute", left: x, top: 0, width: 56, height: 200, ...pop(f, at) }}>
      <div style={{ position: "absolute", bottom: 26, width: 56, height: h * enter(f, at, 12), background: color, borderRadius: 8, border: `3px solid ${K.ink}`, boxSizing: "border-box" }} />
      <div style={{ position: "absolute", bottom: 0, width: 70, left: -7, textAlign: "center", fontSize: 17, fontWeight: 900, color: K.ink }}>{label}</div>
    </div>
  );
  return (
    <>
      <Box x={20} y={20} w={450} h={400} color={K.muted} style={abs(f, a("persistence"))}>
        <Label size={28}>WAY 1 · PERSISTENCE</Label>
        <div style={{ fontSize: 21, fontWeight: 700, color: K.muted, marginTop: 4 }}>"tomorrow = today"</div>
        <div style={{ position: "absolute", left: 60, top: 120, width: 330, height: 200 }}>
          {bar(0, 120, K.muted, a("todays"), "TODAY")}
          <Arrow f={f} at={a("same")} x={80} y={90} len={110} />
          {bar(210, 120, K.muted, a("same"), "TOMORROW")}
        </div>
        {f >= a("same") && <div style={{ position: "absolute", left: 130, top: 132, fontFamily: K.head, fontSize: 38, color: K.red, ...pop(f, a("same")) }}>=</div>}
        <Chip label="💸 FREE" color={K.green} size={26} style={abs(f, a("free"), { left: 150, top: 330 })} />
      </Box>
      <Box x={500} y={20} w={450} h={400} color={K.blue} style={abs(f, a("ridge"))}>
        <Label size={28} color={K.blue}>WAY 2 · RIDGE</Label>
        <div style={{ fontSize: 21, fontWeight: 700, color: K.muted, marginTop: 4 }}>small ML model</div>
        <div style={{ position: "absolute", left: 20, top: 96, display: "flex", flexDirection: "column", gap: 10 }}>
          <Chip label="today" color={K.blue} size={22} style={pop(f, a("today"))} />
          <Chip label="last 3 days" color="#5BA3EC" size={22} style={pop(f, a("three"))} />
          <Chip label="last 7 days" color="#5BA3EC" size={22} style={pop(f, a("seven"))} />
          <Chip label="last 14 days" color="#5BA3EC" size={22} style={pop(f, a("fourteen"))} />
        </div>
        <Arrow f={f} at={a("fourteen") + 6} x={210} y={220} len={90} color={K.blue} />
        <div style={{ position: "absolute", left: 320, top: 175, width: 100, height: 100, borderRadius: 22, background: K.blue, color: "#fff", display: "grid", placeItems: "center", fontFamily: K.head, fontSize: 26, border: `4px solid ${K.ink}`, ...pop(f, a("fourteen") + 10) }}>
          <div style={{ textAlign: "center", lineHeight: 1 }}>TOMOR<br />ROW?</div>
        </div>
      </Box>
      {f >= a("question") && (
        <div style={{ position: "absolute", left: 300, top: 450, ...tilt(pop(f, a("question"), 8), -3) }}>
          <TermCard text="IS IT BETTER?" color={K.yellow} fg={K.ink} size={90} style={{ position: "relative" }} />
        </div>
      )}
      {f >= a("computer") && (
        <Box x={560} y={610} w={370} h={110} color={K.red} bg="#FFF1F1" style={pop(f, a("computer"))}>
          <Label size={30} color={K.red}>IF NOT… WHY KEEP THE 🖥?</Label>
        </Box>
      )}
    </>
  );
}

// ── 4 · HISTORY: earlier tickets = school prep; DAF-18 = board paper ─────────────────────────────────
function HistoryBeat({ f, a }: { f: number; a: A }) {
  return (
    <>
      <Row y={20} title="DAF-14 to 16 · built the model" sub="learning chapters, practice tests" tone="plain" badge="STUDY" style={pop(f, a("built"))} />
      <Row y={124} title="DAF-17 · tried the settings" sub="only on the 251 study days" tone="plain" badge="MOCK" badgeTone={K.purple} style={pop(f, a("daf-17"))} />
      {f >= a("signed") && (
        <div style={{ position: "absolute", left: 420, top: 232, ...tilt(pop(f, a("signed")), -2) }}>
          <Chip label="✍ final_config.json · SIGNED" color={K.ink} size={26} />
        </div>
      )}
      <Row y={310} title="DAF-18 · the 130 test days" sub="never seen by the model" tone="alert" badge="BOARD PAPER" badgeTone={K.red} style={pop(f, a("daf-18"))} />
      {f >= a("march") && (
        <div style={{ position: "absolute", left: 300, top: 430, width: 190, borderRadius: 16, overflow: "hidden", border: `4px solid ${K.ink}`, background: "#fff", ...tilt(pop(f, a("march")), 3) }}>
          <div style={{ background: K.red, color: "#fff", fontFamily: K.head, fontSize: 30, textAlign: "center" }}>MARCH 2026</div>
          <div style={{ fontFamily: K.head, fontSize: 90, textAlign: "center", lineHeight: 1.1 }}>1</div>
        </div>
      )}
      {f >= a("board") && <TermCard text="REAL BOARD EXAM" color={K.red} size={70} style={{ left: 530, top: 450, ...tilt(pop(f, a("board"), 8), -3) }} />}
    </>
  );
}

// ── 5 · ENVELOPE: 251 study | 130 sealed ────────────────────────────────────────────────────────────
function EnvelopeBeat({ f, a }: { f: number; a: A }) {
  const grow = enter(f, 4, 24);
  const boundary = 20 + 560 * grow;
  const locked = a("locked");
  return (
    <>
      <div style={{ position: "absolute", left: 20, top: 60, width: 560 * grow, height: 150, background: "#DCE9F8", border: `4px solid ${K.blue}`, borderRadius: "16px 0 0 16px", overflow: "hidden", boxSizing: "border-box" }}>
        <div style={{ padding: "22px 24px", whiteSpace: "nowrap" }}>
          <Label color={K.blue} size={50}>251</Label>
          <Label color={K.blue} size={26}>STUDY DAYS</Label>
          <div style={{ fontSize: 20, color: K.muted, fontWeight: 700 }}>17 Mar 2025 – 28 Feb 2026</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 580, top: 60, width: 340 * enter(f, 14, 24), height: 150, background: f >= locked ? "#FFF3C4" : "#F6F8FB", border: `4px solid ${K.ink}`, borderRadius: "0 16px 16px 0", overflow: "hidden", boxSizing: "border-box" }}>
        <div style={{ padding: "22px 24px", whiteSpace: "nowrap" }}>
          <Label size={50}>130 {f >= locked ? "🔒" : ""}</Label>
          <Label size={26}>TEST DAYS</Label>
          <div style={{ fontSize: 20, color: K.muted, fontWeight: 700 }}>from 1 Mar 2026</div>
        </div>
      </div>
      {f >= a("line") && (
        <>
          <div style={{ position: "absolute", left: boundary - 3, top: 30, height: 210 * draw(f, a("line"), 12), borderLeft: `6px dashed ${K.red}` }} />
          <Chip label="1 MARCH 2026" color={K.red} size={22} style={abs(f, a("line"), { left: 470, top: 240 })} />
        </>
      )}
      {f >= a("test") && f < locked && <div style={{ position: "absolute", left: 640, top: 14, fontSize: 36, ...pop(f, a("test")) }}>👀</div>}
      {f >= locked && <div style={{ position: "absolute", left: 640, top: 0, fontSize: 70, ...pop(f, locked), transform: `scale(${1 + 0.1 * Math.sin((f - locked) / 5)})` }}>✉️</div>}
      {/* the model never learns from the envelope */}
      {f >= a("learned") && (
        <div style={{ position: "absolute", left: 20, top: 300, ...pop(f, a("learned")) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Chip label="🤖 MODEL" color={K.blue} size={30} />
            <div style={{ position: "relative", width: 250, height: 8, background: K.red, borderRadius: 4, transform: `scaleX(${draw(f, a("learned"), 12)})`, transformOrigin: "left" }} />
            <div style={{ fontFamily: K.head, fontSize: 70, color: K.red, marginLeft: -6 }}>✗</div>
            <Chip label="never learned from it" color={K.ink} size={24} />
          </div>
        </div>
      )}
      {f >= a("honest") && <Chip label="✓ HONEST ANSWER" color={K.green} size={34} style={abs(f, a("honest"), { left: 560, top: 380, border: `4px solid ${K.ink}` })} />}
      {f >= a("left") && (
        <Box x={20} y={470} w={300} h={90} color={K.blue} style={{ ...pop(f, a("left")), marginLeft: 0 }}>
          <Label size={28} color={K.blue}>LEFT: MAY STUDY 📖</Label>
        </Box>
      )}
      {f >= a("right") && (
        <Box x={620} y={470} w={300} h={90} color={K.ink} style={pop(f, a("right"))}>
          <Label size={28}>RIGHT: ONLY JUDGE ⚖</Label>
        </Box>
      )}
    </>
  );
}

// ── 6 · TRAP: open twice = the score lies ───────────────────────────────────────────────────────────
function TrapBeat({ f, a }: { f: number; a: A }) {
  const nodes: { x: number; icon: string; label: string; at: number; color: string }[] = [
    { x: 14, icon: "✉️", label: "OPEN #1", at: a("opens"), color: K.ink },
    { x: 210, icon: "😬", label: "POOR SCORE", at: a("poor"), color: K.red },
    { x: 406, icon: "🎛", label: "TWEAK ONE KNOB", at: a("changes"), color: K.purple },
    { x: 602, icon: "✉️", label: "OPEN #2", at: a("again"), color: K.ink },
    { x: 798, icon: "😀", label: "'BETTER'", at: a("better"), color: K.green },
  ];
  const lie = a("lie");
  return (
    <>
      {nodes.map((n, i) => (
        <React.Fragment key={n.label}>
          <Box x={n.x} y={50} w={160} h={170} color={n.color} style={{ ...pop(f, n.at), textAlign: "center", padding: "10px 6px" }}>
            <div style={{ fontSize: 66, transform: n.icon === "🎛" ? `rotate(${f >= n.at ? (f - n.at) * 4 : 0}deg)` : undefined, display: "inline-block" }}>{n.icon}</div>
            <Label size={20} color={n.color}>{n.label}</Label>
          </Box>
          {i < nodes.length - 1 && <Arrow f={f} at={nodes[i + 1].at - 4} x={n.x + 164} y={130} len={28} />}
        </React.Fragment>
      ))}
      {f >= a("teaching") && (
        <Box x={20} y={270} w={920} h={100} color={K.red} bg="#FFF1F1" style={pop(f, a("teaching"))}>
          <Label size={34} color={K.red}>TEST DAYS NOW TEACH THE MODEL 📖➜🤖</Label>
          <div style={{ fontSize: 22, fontWeight: 700, color: K.muted }}>so the score no longer measures "unseen days"</div>
        </Box>
      )}
      {f >= lie && (
        <div style={{ position: "absolute", left: 640, top: 400, ...tilt(pop(f, lie, 8), -10) }}>
          <TermCard text="A LIE" color={K.red} size={84} style={{ position: "relative" }} />
        </div>
      )}
      {f >= a("rule") && <Chip label="THE RULE:" color={K.ink} size={32} style={abs(f, a("rule"), { left: 300, top: 410 })} />}
    </>
  );
}

// ── 7 · RULES: the blackboard + the practice-test warning ──────────────────────────────────────────
function RulesBeat({ f, a }: { f: number; a: A }) {
  const r1 = a("rule", 1);
  const r2 = a("rule", 2);
  const typed = (t: string, from: number, cpf = 1.4) => t.slice(0, Math.max(0, Math.floor((f - from) * cpf)));
  const chalk: React.CSSProperties = { fontFamily: "'Chalkboard SE', 'Marker Felt', " + K.ui, color: "#F5F5DC", fontWeight: 800 };
  const bar = enter(f, a("three"), 28);
  return (
    <>
      <Box x={20} y={20} w={928} h={330} color="#8D6E63" bg="#1F4D3A" style={{ ...pop(f, a("principal")), borderWidth: 8 }}>
        <div style={{ ...chalk, fontSize: 30, letterSpacing: 2, color: "#FFE082" }}>PASS MARKS (written first)</div>
        <div style={{ ...chalk, fontSize: 31, marginTop: 14 }}>1 · MAE at least 10% lower</div>
        <div style={{ ...chalk, fontSize: 25, opacity: 0.85 }}>{typed("the average mistake, beat persistence by 10%", a("average"))}</div>
        <div style={{ ...chalk, fontSize: 31, marginTop: 14, opacity: f >= r2 ? 1 : 0 }}>2 · Poor days: catch as many</div>
        <div style={{ ...chalk, fontSize: 25, opacity: 0.85 }}>{typed("at least as many as persistence", a("catch"))}</div>
        <div style={{ position: "absolute", right: 24, top: 80, width: 66, height: 66, borderRadius: 12, border: "5px solid #F5F5DC", display: f >= r1 ? "grid" : "none", placeItems: "center", ...chalk, fontSize: 40 }}>?</div>
        <div style={{ position: "absolute", right: 24, top: 200, width: 66, height: 66, borderRadius: 12, border: "5px solid #F5F5DC", display: f >= r2 ? "grid" : "none", placeItems: "center", ...chalk, fontSize: 40 }}>?</div>
        {f >= a("both") && <div style={{ position: "absolute", right: 110, top: 80, width: 8, height: 186 * draw(f, a("both"), 10), background: "#FFE082", borderRadius: 4 }} />}
        {f >= a("both") && <div style={{ position: "absolute", right: 130, top: 150, ...chalk, fontSize: 30, color: "#FFE082", ...pop(f, a("both")) }}>BOTH</div>}
      </Box>
      <Chip label="Otherwise: marks that suit you" color={K.red} size={22} style={abs(f, a("otherwise"), { left: 24, top: 366 })} />
      {f >= a("practice") && (
        <Box x={290} y={430} w={650} h={190} color={K.ink} style={pop(f, a("practice"))}>
          <Label size={26}>PRACTICE TESTS (DAF-17): Ridge better by</Label>
          <div style={{ position: "relative", marginTop: 20, height: 40, background: "#EEF2F7", borderRadius: 10, border: `3px solid ${K.ink}` }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(3.8 / 12) * 100 * bar}%`, background: K.blue, borderRadius: 7 }} />
            <div style={{ position: "absolute", left: `${(10 / 12) * 100}%`, top: -14, bottom: -14, borderLeft: `5px dashed ${K.red}` }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontFamily: K.ui, fontWeight: 900, fontSize: 26 }}>
            <span style={{ color: K.blue }}>{count(f, a("three"), 3.8, 28)}%</span>
            <span style={{ color: K.red }}>TARGET 10%</span>
          </div>
        </Box>
      )}
    </>
  );
}

// ── 8 · TOY: 22 readings → rows → Ridge's learned rule ────────────────────────────────────────────
const PX = (v: number) => 30 + ((v - 55) / 75) * 530; // today → x in the scatter panel
const PY = (v: number) => 480 - ((v - 55) / 75) * 330; // tomorrow → y
function ToyBeat({ f, a }: { f: number; a: A }) {
  const rd = a("readings");
  const studyAt = a("study");
  const sealedAt = a("sealed");
  const eq = a("equals");
  return (
    <>
      {/* 22 readings strip */}
      <Chip label="🧸 TOY TOWN · 22 READINGS" color={K.ink} size={24} style={abs(f, a("toy"), { left: 24, top: 8 })} />
      <div style={{ position: "absolute", left: 24, top: 52, display: "flex", gap: 6, alignItems: "flex-end", height: 90 }}>
        {READINGS.map((v, i) => (
          <div key={i} style={{ width: 32, height: (v / 125) * 90 * enter(f, rd + i, 8), background: i >= 15 && f >= sealedAt ? "#C9CED6" : f >= studyAt && i <= 14 ? K.blue : K.muted, borderRadius: 4, border: `2px solid ${K.ink}`, boxSizing: "border-box" }} />
        ))}
      </div>
      {/* a row = a question */}
      {f >= a("row") && (
        <Box x={620} y={160} w={335} h={136} color={K.ink} style={pop(f, a("row"))}>
          <Label size={22}>ROW = ONE QUESTION</Label>
          <div style={{ fontSize: 20, fontWeight: 800, color: K.muted }}>today = 115 → tomorrow = ?</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: K.blue }}>answer: 103</div>
        </Box>
      )}
      <Chip label="📖 14 STUDY ROWS" color={K.blue} size={24} style={abs(f, studyAt, { left: 620, top: 310 })} />
      <Chip label="🔒 7 SEALED ROWS" color={K.ink} size={24} style={abs(f, sealedAt, { left: 620, top: 366 })} />
      {/* scatter of the study rows */}
      <div style={{ position: "absolute", left: 0, top: 150, width: 600, height: 380, opacity: enter(f, a("today"), 8) }}>
        <svg width={600} height={380} viewBox="0 150 600 380" style={{ position: "absolute", left: 0, top: 0 }}>
          <rect x={20} y={150} width={560} height={350} fill="#fff" stroke={K.line} strokeWidth={3} rx={10} />
          {STUDY.map((r, i) => (
            <circle key={r.row} cx={PX(r.today)} cy={PY(r.tomorrow)} r={9 * enter(f, studyAt + 2 + i * 3, 8)} fill={K.ink} />
          ))}
          {f >= a("old") && <line x1={PX(55)} y1={PY(55)} x2={PX(55) + (PX(130) - PX(55)) * draw(f, a("old"), 14)} y2={PY(55) + (PY(130) - PY(55)) * draw(f, a("old"), 14)} stroke={K.muted} strokeWidth={6} strokeDasharray="12 8" />}
          {f >= a("learns") && <line x1={PX(55)} y1={PY(0.3 * 55 + 65.4)} x2={PX(55) + (PX(130) - PX(55)) * draw(f, a("learns"), 18)} y2={PY(0.3 * 55 + 65.4) + (PY(0.3 * 130 + 65.4) - PY(0.3 * 55 + 65.4)) * draw(f, a("learns"), 18)} stroke={K.blue} strokeWidth={8} strokeLinecap="round" />}
        </svg>
        <div style={{ position: "absolute", left: 30, top: 154, fontSize: 20, fontWeight: 900, color: K.muted }}>tomorrow ↑</div>
        <div style={{ position: "absolute", right: 36, bottom: 8, fontSize: 20, fontWeight: 900, color: K.muted }}>today →</div>
      </div>
      {f >= a("old") && <Chip label="OLD: same" color={K.muted} size={22} style={abs(f, a("old"), { left: 360, top: 160 })} />}
      {f >= eq && (
        <Box x={600} y={440} w={350} h={150} color={K.blue} bg="#EAF2FC" style={pop(f, eq)}>
          <Label size={24} color={K.blue}>RIDGE LEARNED</Label>
          <div style={{ fontFamily: K.mono, fontSize: 26, fontWeight: 800, marginTop: 4, color: K.ink }}>tomorrow =</div>
          <div style={{ fontFamily: K.mono, fontSize: 28, fontWeight: 800, color: K.ink }}>{f >= a("sixty-five") ? "0.30 × today + 65" : f >= a("zero") ? "0.30 × today" : ""}</div>
        </Box>
      )}
      {f >= a("lower") && <Chip label="HIGH DAY → LOWER DAY" color={K.yellow} fg={K.ink} size={26} style={abs(f, a("lower"), { left: 300, top: 640, border: `4px solid ${K.ink}` })} />}
      {f >= a("cannot") && <Chip label="old method can't know ✗" color={K.red} size={24} style={abs(f, a("cannot"), { left: 600, top: 640 })} />}
    </>
  );
}

// ── 9 · OPEN: the one test on the 7 sealed rows ──────────────────────────────────────────────────────
const OX = (i: number) => 40 + i * 130;
const OY = (v: number) => 400 - ((v - 55) / 75) * 360;
function OpenBeat({ f, a }: { f: number; a: A }) {
  const t0 = a("same");
  const maeOld = a("persistence");
  const maeRidge = a("ridge", 1);
  const win = a("win");
  return (
    <>
      <div style={{ position: "absolute", left: 10, top: 10, width: 940, height: 430, background: "#fff", border: `3px solid ${K.line}`, borderRadius: 14, opacity: enter(f, a("envelope"), 8) }} />
      {f >= a("envelope") && (
        <svg width={968} height={440} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={14} x2={954} y1={OY(91)} y2={OY(91)} stroke={K.red} strokeWidth={3} strokeDasharray="10 8" />
          <text x={846} y={OY(91) - 8} fontSize={20} fontWeight={900} fill={K.red}>91 POOR</text>
          {SEALED.map((r, i) => {
            const e = enter(f, t0 + i * 9, 8);
            const x = OX(i) + 40;
            const old = r.today;
            return (
              <g key={r.row} opacity={e}>
                <text x={x} y={430} fontSize={20} fontWeight={800} textAnchor="middle" fill={K.muted}>row {r.row}</text>
                <line x1={x} x2={x} y1={OY(r.tomorrow)} y2={OY(old)} stroke={K.muted} strokeWidth={5} />
                <line x1={x + 14} x2={x + 14} y1={OY(r.tomorrow)} y2={OY(r.ridge)} stroke={K.blue} strokeWidth={5} />
                <rect x={x - 11} y={OY(old) - 11} width={22} height={22} fill={K.muted} />
                <circle cx={x + 14} cy={OY(r.ridge)} r={11} fill={K.blue} />
                <line x1={x - 22} x2={x + 36} y1={OY(r.tomorrow)} y2={OY(r.tomorrow)} stroke={K.ink} strokeWidth={7} />
                {f >= win && (r.row === 15 || r.row === 18) && <rect x={x - 28} y={OY(r.tomorrow) - 12} width={80} height={Math.abs(OY(old) - OY(r.tomorrow)) + 24} fill="none" stroke={K.yellow} strokeWidth={6} rx={10} transform={`translate(0 ${Math.min(0, OY(old) - OY(r.tomorrow))})`} />}
              </g>
            );
          })}
          <g transform="translate(24 28)" fontSize={19} fontWeight={800}>
            <line x1={0} x2={30} y1={0} y2={0} stroke={K.ink} strokeWidth={7} /><text x={38} y={6} fill={K.ink}>real</text>
            <rect x={96} y={-8} width={16} height={16} fill={K.muted} /><text x={120} y={6} fill={K.muted}>old</text>
            <circle cx={176} cy={0} r={8} fill={K.blue} /><text x={190} y={6} fill={K.blue}>Ridge</text>
          </g>
        </svg>
      )}
      {f >= maeOld && (
        <Box x={290} y={460} w={300} h={110} color={K.muted} style={pop(f, maeOld)}>
          <Label size={22} color={K.muted}>OLD METHOD · MAE</Label>
          <div style={{ fontFamily: K.head, fontSize: 60, lineHeight: 1 }}>{count(f, maeOld, 18.6, 30)}</div>
        </Box>
      )}
      {f >= maeRidge && (
        <Box x={620} y={460} w={320} h={110} color={K.blue} bg="#EAF2FC" style={pop(f, maeRidge)}>
          <Label size={22} color={K.blue}>RIDGE · MAE</Label>
          <div style={{ fontFamily: K.head, fontSize: 60, lineHeight: 1, color: K.blue }}>{count(f, maeRidge, 15.0, 30)}</div>
        </Box>
      )}
      {f >= a("nineteen") && <Chip label="19% BETTER ✓ RULE 1" color={K.green} size={28} style={abs(f, a("nineteen"), { left: 290, top: 590, border: `4px solid ${K.ink}` })} />}
      {f >= a("three") && <Chip label="POOR DAYS 3/4 EACH ✓ RULE 2" color={K.green} size={22} style={abs(f, a("three"), { left: 290, top: 650, border: `4px solid ${K.ink}` })} />}
      {f >= a("met") && <TermCard text="MET ✓" color={K.green} size={64} style={{ left: 690, top: 580, ...tilt(pop(f, a("met"), 8), 4) }} />}
      {f >= win && <Chip label="Ridge doesn't win every row" color={K.yellow} fg={K.ink} size={24} style={abs(f, win, { left: 290, top: 710 })} />}
    </>
  );
}

// ── 10 · SECOND OPINION: walk-forward ────────────────────────────────────────────────────────────────
function SecondBeat({ f, a }: { f: number; a: A }) {
  const groups = [
    { name: "FOLD 1", old: 21.3, ridge: 21.0 },
    { name: "FOLD 2", old: 14.0, ridge: 8.9 },
    { name: "MAIN TEST", old: 18.6, ridge: 15.0 },
  ];
  const at0 = a("monthly");
  return (
    <>
      <Chip label="🧸 TOY · SMALLER EXAMS" color={K.ink} size={24} style={abs(f, a("exam"), { left: 24, top: 10 })} />
      {groups.map((g, i) => {
        const x = 40 + i * 190;
        const t = at0 + i * 16;
        return (
          <div key={g.name} style={{ position: "absolute", left: x, top: 60, width: 170, height: 270 }}>
            <div style={{ position: "absolute", left: 10, bottom: 34, width: 60, height: (g.old / 25) * 220 * enter(f, t, 14), background: K.muted, border: `3px solid ${K.ink}`, borderRadius: 8, boxSizing: "border-box" }} />
            <div style={{ position: "absolute", left: 84, bottom: 34, width: 60, height: (g.ridge / 25) * 220 * enter(f, t + 6, 14), background: K.blue, border: `3px solid ${K.ink}`, borderRadius: 8, boxSizing: "border-box" }} />
            <div style={{ position: "absolute", bottom: 0, width: 170, textAlign: "center", fontSize: 19, fontWeight: 900, color: K.ink, opacity: enter(f, t, 8) }}>{g.name}</div>
            <div style={{ position: "absolute", left: 6, bottom: 34 + (g.old / 25) * 220 * enter(f, t, 14) + 2, fontSize: 19, fontWeight: 900, color: K.muted }}>{g.old}</div>
            <div style={{ position: "absolute", left: 90, bottom: 34 + (g.ridge / 25) * 220 * enter(f, t + 6, 14) + 2, fontSize: 19, fontWeight: 900, color: K.blue }}>{g.ridge}</div>
          </div>
        );
      })}
      {f >= at0 && (
        <div style={{ position: "absolute", left: 620, top: 80, display: "flex", flexDirection: "column", gap: 10, ...pop(f, at0) }}>
          <Chip label="■ old method" color={K.muted} size={22} />
          <Chip label="■ Ridge" color={K.blue} size={22} />
          <Chip label="lower = better" color={K.ink} size={22} />
        </div>
      )}
      {f >= a("walk-forward") && <TermCard text="WALK-FORWARD" color={K.yellow} fg={K.ink} size={54} style={{ left: 330, top: 345, ...tilt(pop(f, a("walk-forward"), 8), -3) }} />}
      {f >= a("real") && (
        <Box x={290} y={440} w={650} h={120} color={K.green} bg="#EEF9F2" style={pop(f, a("real"))}>
          <Label size={24} color={K.green}>REAL PROJECT · WALK-FORWARD (DAF-16)</Label>
          <div style={{ display: "flex", gap: 24, marginTop: 8, fontFamily: K.head, fontSize: 52, lineHeight: 1 }}>
            <span style={{ color: K.blue }}>Ridge {count(f, a("thirty"), 30.38, 24, 2)}</span>
            <span style={{ color: K.muted }}>old {f >= a("thirty-five") ? "35.35" : "…"}</span>
          </div>
        </Box>
      )}
      {f >= a("disagreed") && (
        <Box x={290} y={590} w={650} h={120} color={K.red} bg="#FFF1F1" style={pop(f, a("disagreed"))}>
          <Label size={26} color={K.red}>IF IT DISAGREED?</Label>
          <div style={{ fontSize: 26, fontWeight: 800 }}>{f >= a("report") ? "✍ write it in the report" : "✗ change nothing"}</div>
        </Box>
      )}
    </>
  );
}

// ── 11 · WORST DAYS ──────────────────────────────────────────────────────────────────────────────────
function WorstBeat({ f, a }: { f: number; a: A }) {
  const sorted = [...SEALED.map((r) => ({ row: r.row, err: Math.abs(r.ridge - r.tomorrow) }))].sort((x, y) => y.err - x.err);
  const t0 = a("lose");
  const reasons: Record<number, { text: string; at: number }> = {
    20: { text: "air cleaned up overnight", at: a("suddenly") },
    15: { text: "long smog spell: guessed low", at: a("spell") },
  };
  return (
    <>
      <Chip label="📝 THE ANSWER SHEET" color={K.ink} size={26} style={abs(f, a("sheet"), { left: 24, top: 10 })} />
      {sorted.map((s, i) => {
        const y = 66 + i * 52;
        const w = (s.err / 28) * 400 * enter(f, t0 + i * 6, 12);
        const bad = i < 2;
        const reason = reasons[s.row];
        return (
          <div key={s.row}>
            <div style={{ position: "absolute", left: 20, top: y, width: 90, fontSize: 22, fontWeight: 900, color: K.muted, opacity: enter(f, t0 + i * 6, 6) }}>row {s.row}</div>
            <div style={{ position: "absolute", left: 110, top: y, width: w, height: 38, background: bad && f >= (reason?.at ?? Infinity) - 4 ? K.red : K.blue, borderRadius: 8, border: `3px solid ${K.ink}`, boxSizing: "border-box" }} />
            <div style={{ position: "absolute", left: 120 + w, top: y + 2, fontSize: 22, fontWeight: 900, color: K.ink, opacity: enter(f, t0 + i * 6 + 8, 6) }}>{s.err.toFixed(1)}</div>
            {reason && f >= reason.at && <Chip label={reason.text} color={K.yellow} fg={K.ink} size={20} style={abs(f, reason.at, { left: 110 + 400 + 70, top: y + 2, border: `3px solid ${K.ink}` })} />}
          </div>
        );
      })}
      {f >= a("nothing") && <Chip label="nothing in today's number warned it" color={K.ink} size={22} style={abs(f, a("nothing"), { left: 300, top: 438 })} />}
      {f >= a("patterns") && (
        <Box x={290} y={500} w={650} h={100} color={K.purple} style={pop(f, a("patterns"))}>
          <Label size={28} color={K.purple}>NOT RANDOM → PATTERNS</Label>
          <div style={{ fontSize: 22, fontWeight: 700, color: K.muted }}>sudden swings · long smog spells</div>
        </Box>
      )}
      {f >= a("ten") && <Chip label="REAL TICKET: 10 WORST DAYS → REPORT" color={K.red} size={24} style={abs(f, a("ten"), { left: 290, top: 616 })} />}
    </>
  );
}

// ── 12 · SAVE + MODEL CARD ───────────────────────────────────────────────────────────────────────────
function SaveBeat({ f, a }: { f: number; a: A }) {
  const nodes = [
    { x: 14, icon: "🤖", label: "Ridge", at: a("saves"), color: K.blue },
    { x: 330, icon: "💾", label: "pm25_station17_v1.joblib", at: a("file"), color: K.ink },
    { x: 700, icon: "💻", label: "NEW SESSION", at: a("session"), color: K.muted },
  ];
  const close = a("memory");
  return (
    <>
      {nodes.map((n) => (
        <Box key={n.label} x={n.x} y={14} w={n.x === 330 ? 340 : 230} h={130} color={n.color} style={{ ...pop(f, n.at), textAlign: "center", padding: "6px 4px" }}>
          <div style={{ fontSize: 50 }}>{n.icon}</div>
          <Label size={n.x === 330 ? 19 : 22} color={n.color}>{n.label}</Label>
        </Box>
      ))}
      <Arrow f={f} at={a("joblib")} x={246} y={70} len={76} />
      {f >= a("joblib") && <div style={{ position: "absolute", left: 220, top: 20, fontFamily: K.mono, fontSize: 17, fontWeight: 800, color: K.blue }}>dump</div>}
      {f >= close && <Chip label="memory: empty" color={K.red} size={20} style={abs(f, close, { left: 706, top: 154 })} />}
      {f >= a("load") && <div style={{ position: "absolute", left: 686, top: 20, fontFamily: K.mono, fontSize: 17, fontWeight: 800, color: K.blue }}>← load</div>}
      {f >= a("hundred") && (
        <div style={{ position: "absolute", left: 20, top: 160, display: "flex", gap: 14, alignItems: "center", fontFamily: K.head, fontSize: 40, ...pop(f, a("hundred")) }}>
          <span style={{ color: K.ink }}>before: {f >= a("before") ? "100.7" : "…"}</span>
          <span style={{ color: K.ink }}>after: {f >= a("after") ? "100.7" : "…"}</span>
          {f >= a("after") && <span style={{ color: K.green, ...pop(f, a("after")) }}>✓ same</span>}
        </div>
      )}
      {/* model card */}
      {f >= a("card") && (
        <div style={{ position: "absolute", left: 270, top: 240, width: 680, height: 520, borderRadius: 18, background: "#fff", border: `4px solid ${K.ink}`, boxShadow: `8px 8px 0 ${K.ink}`, padding: 16, boxSizing: "border-box", ...pop(f, a("card")) }}>
          <div style={{ fontFamily: K.head, fontSize: 40, lineHeight: 1 }}>💊 MODEL CARD</div>
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[["PURPOSE", a("for")], ["DATA", a("data")], ["FEATURES", a("data") + 8], ["METRICS", a("good")], ["THRESHOLD 91", a("good") + 8]].map(([l, t]) => (
              <Chip key={String(l)} label={l as string} color={K.blue} size={22} style={pop(f, t as number)} />
            ))}
          </div>
          {f >= a("fails") && <Box x={16} y={150} w={308} h={130} color={K.red} bg="#FFF1F1" style={pop(f, a("fails"))}><Label size={24} color={K.red}>KNOWN FAILURE CASES</Label><div style={{ fontSize: 20, fontWeight: 700, color: K.muted }}>sudden swings, long smog</div></Box>}
          {f >= a("use") && <Box x={340} y={150} w={308} h={130} color={K.red} bg="#FFF1F1" style={pop(f, a("use"))}><Label size={24} color={K.red}>DO NOT USE FOR…</Label><div style={{ fontSize: 20, fontWeight: 700, color: K.muted }}>a stranger needs this most</div></Box>}
          {f >= a("peeked") && <Box x={16} y={300} w={632} h={110} color={K.ink} bg={K.yellow} style={pop(f, a("peeked"))}><Label size={26}>👀 TEST DAYS WERE PEEKED AT</Label><div style={{ fontSize: 21, fontWeight: 800 }}>in DAF-06 to DAF-16: this is the last look, not the first</div></Box>}
        </div>
      )}
      {f >= a("medicine") && <Chip label="like the paper inside a medicine box" color={K.ink} size={20} style={abs(f, a("medicine"), { left: 560, top: 252, ...{ transform: `${pop(f, a("medicine")).transform} rotate(-1deg)` } })} />}
    </>
  );
}

// ── 13 · RECAP: Java lens + the one sentence + DONE ───────────────────────────────────────────────────
function RecapBeat({ f, a }: { f: number; a: A }) {
  const rows: [string, string, string, number][] = [
    ["Test set", "data you never touch in dev", "unseen data", a("set")],
    ["Pass marks", "acceptance criteria, first", "written first", a("acceptance")],
    ["Model file", "the build the service loads", ".joblib", a("build")],
    ["Model card", "the README", "readme", a("readme")],
  ];
  return (
    <>
      <Chip label="☕ THE JAVA DEV VIEW" color={K.blue} size={28} style={abs(f, a("java"), { left: 24, top: 8 })} />
      {rows.map(([t, s, b, at], i) => (
        <Row key={t} y={64 + i * 96} title={t} sub={s} badge={b} badgeTone={i === 1 ? K.purple : K.blue} style={pop(f, at)} />
      ))}
      {f >= a("testing") && (
        <Box x={290} y={470} w={650} h={120} color={K.ink} bg={K.yellow} style={{ ...pop(f, a("testing")), boxShadow: `8px 8px 0 ${K.ink}` }}>
          <Label size={36}>TEST IT ONCE.</Label>
          <Label size={36}>REPORT IT HONESTLY.</Label>
        </Box>
      )}
      {f >= a("better") && <Chip label="not about a better model" color={K.red} size={26} style={abs(f, a("better"), { left: 290, top: 610 })} />}
      {f >= a("next") && (
        <Chip label="NEXT → DAF-19: THE LIVE SERVICE" color={K.blue} size={30} style={abs(f, a("next"), { left: 280, top: 690, border: `4px solid ${K.ink}` })} />
      )}
    </>
  );
}

