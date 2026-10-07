// DAF-04 · Video A — "Why download the original files?" (claude/daf/episodes/daf_04/script_v1.md, script approved 2026-10-06).
// SILENT build first (audio later): timeline from scripts/silent-timeline.mjs; scenes cue on words, so real audio re-times them.
// Pinned table: R K Puram, real days from the raw OpenAQ files (data/raw/openaq/locationid=17):
//   day · one number for the day (mean of that day's PM2.5 readings) · readings behind it (of 96) · kept as it came.
// Motion kit v2: src/shared/daf/motion.tsx. All text is HTML (SVG <text> shakes in renders); SVG only for strokes.
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { pmColor } from "../../shared/daf/DataTable";
import { Burst, camera, cellBox, Count, KineticCaption, Push, Ring, Table2, Underline, Bubble, rise, sm, sp } from "../../shared/daf/motion";
import { DoubtLow } from "../../shared/daf/Pinned";
import { Stage } from "../../shared/daf/Stage";
import { Backdrop, ChapterBar, Chip, Header, K, TimelineProvider, TitleCard, useCues, useMouth, useTimeline } from "../../shared/explainer/kit";
import type { EpisodeMeta, Timeline } from "../../shared/types";

export const Day304: React.FC<{ timeline: Timeline; meta: EpisodeMeta }> = ({ timeline, meta }) => (
  <TimelineProvider value={timeline}><Scene meta={meta} /></TimelineProvider>
);

// day · one number · readings (of 96) · kept   (verified 2026-10-06 from the raw files)
const ROWS: [string, number, number, string][] = [
  ["19 Feb 2025", 78, 88, "🔒"],
  ["21 Oct 2025", 549, 76, "🔒"],
  ["20 Jan 2026", 431, 13, "🔒"],
  ["11 Sep 2026", 43, 86, "🔒"],
];
const JAN = 2; // the 20 Jan row
const ROW_H = 64;
const ZT = 430; // zone top (stage content coordinates)
const COLS_W = [{ w: 250 }, { w: 250 }, { w: 270 }, { w: 186 }];
const JAN_CELL = cellBox(20, 58, COLS_W, JAN, 2, ROW_H);

function Scene({ meta }: { meta: EpisodeMeta }) {
  const f = useCurrentFrame();
  const tl = useTimeline();
  const { at, start, end } = useCues();
  const mouth = useMouth(f);

  const c = {
    fifty: at("recap", "fifty"), fortyFour: at("recap", "forty-four"), list: at("recap", "list"), who: at("recap", "who"), saw: at("recap", "saw"), readings: at("recap", "need"),
    shortcut: at("shortcut", "shortcut"), ready: at("shortcut", "ready-made"), average: at("shortcut", "average"), easy: at("shortcut", "Easy"), tried: at("shortcut", "tried"), n3342: at("shortcut", "three"),
    fifteen: at("count", "fifteen"), howMany: at("count", "how"), four: at("count", "Four"), twentyFour: at("count", "twenty-four"), think: at("count", "Think"), n96: at("count", "ninety-six"),
    ask: at("talk", "ask"), jan: at("talk", "Twentieth"), behind: at("talk", "behind"), says: at("talk", "says"), thirteen: at("talk", "thirteen"), woke: at("talk", "woke"), night: at("talk", "night"),
    whole: at("hides", "whole"), three: at("hides", "three"), hides: at("hides", "hides"), decide: at("hides", "decide"), every: at("hides", "every"),
    exactly: at("original", "exactly"), maven: at("original", "Maven"), version: at("original", "Version"), snapshot: at("original", "snapshot"), openaq: at("original", "OpenAQ"), release: at("original", "release"), free: at("original", "free"), never: at("original", "never"), mistake: at("original", "mistake"),
    weeks: at("why", "weeks"), strange: at("why", "strange"), back: at("why", "back"), sent: at("why", "sent"),
    rList: at("recall", "list"), rAvg: at("recall", "average"), rOrig: at("recall", "original"), next: at("recall", "Next"),
  };
  const chapters = (meta.chapters ?? []).map((ch) => ({ label: ch.label, from: start(ch.beat) }));
  const zone = (a: string, b: string) => ({ from: start(a), to: start(b) });
  const fillCol = (base: number, first = -1) => (r: number) => (r === first ? base : base + 8 + (r - (first >= 0 && r > first ? 1 : 0)) * 5);

  return (
    <AbsoluteFill style={{ fontFamily: K.ui, overflow: "hidden" }}>
      <Audio src={staticFile(tl.audio)} />
      <Backdrop />
      <Header f={f} day={meta.day} title={meta.title} badge={meta.badge} />
      <ChapterBar f={f} chapters={chapters} />
      <Stage f={f} tab="📂 R K Puram · what is really behind one number?">
        <div style={{ position: "absolute", inset: 0, ...camera(f, [[c.thirteen, end("talk")], [c.never, end("original")]], [c.thirteen]) }}>
          {/* ── the pinned table ── */}
          <div style={{ position: "absolute", left: 20, top: 8, ...rise(f, 2) }}>
            <span style={{ display: "inline-block", background: K.ink, color: "#fff", fontWeight: 900, fontSize: 26, padding: "6px 16px", borderRadius: 10 }}>R K Puram · four real days from OpenAQ</span>
          </div>
          <Table2 f={f} size={32} rowH={ROW_H} style={{ left: 20, top: 58 }}
            cols={[
              { key: "d", label: "📅 day", w: 250 },
              { key: "n", label: "one number for the day", w: 250, color: K.blue, at: c.ready, fill: (r) => c.average + r * 5 },
              { key: "r", label: "readings behind it (of 96)", w: 270, color: "#FB8C00", at: c.behind, fill: fillCol(c.thirteen, JAN) },
              { key: "k", label: "kept as it came", w: 186, color: K.green, at: c.exactly, fill: (r) => c.never + r * 4 },
            ]}
            rows={ROWS} rowAt={(r) => 6 + r * 4}
            focus={(r) => r === JAN && f >= c.jan && f < start("original")}
            fmt={(v, ci, r) => {
              if (ci === 0) return v;
              if (ci === 1) return <span style={{ color: pmColor(v as number) }}>{v as number}</span>;
              if (ci === 2) return <span style={{ color: r === JAN ? K.red : K.ink, fontSize: r === JAN ? 40 : 32 }}>{v as number}</span>;
              return <span style={{ fontSize: 34 }}>{v as string}</span>;
            }} />
          {f < start("original") && <Ring f={f} at={c.thirteen + 6} left={JAN_CELL.left + 4} top={JAN_CELL.top + 10} width={78} height={ROW_H - 20} />}
          {f >= c.says && f < start("hides") && (
            <Bubble f={f} at={c.says} text="Only thirteen, sir 😅" tail="up" color={K.yellow} size={34} style={{ left: JAN_CELL.left - 20, top: JAN_CELL.top + ROW_H * 2 + 40 }} />
          )}
          <div style={{ position: "absolute", left: 20, right: 20, top: ZT - 22, borderTop: `4px dashed ${K.line}`, opacity: sm(f, 10) }} />

          {/* ── 1 recap: a list is not the readings ── */}
          <Push f={f} {...zone("recap", "shortcut")} top={ZT}>
            <div style={{ position: "absolute", left: 30, top: 10, display: "flex", gap: 22 }}>
              <Stat f={f} at={c.fifty} n={50} label="sensors, long records" color={K.blue} />
              <Stat f={f} at={c.fortyFour} n={44} label="with recent data" color={K.green} />
            </div>
            <div style={{ position: "absolute", left: 30, top: 200, ...rise(f, c.list) }}>
              <Chip label="📋 only a LIST" color={K.ink} size={40} />
            </div>
            <div style={{ position: "absolute", left: 30, top: 300, display: "flex", flexDirection: "column", gap: 14 }}>
              <span style={rise(f, c.who)}><Chip label="👀 who was watching  ✓" color={K.green} size={32} /></span>
              <span style={rise(f, c.saw)}><Chip label="🌫️ what they saw  ✗" color={K.red} size={32} /></span>
            </div>
            <div style={{ position: "absolute", left: 560, top: 240, width: 400, ...rise(f, c.readings) }}>
              <div style={{ border: `5px solid ${K.ink}`, borderRadius: 20, background: "#FFEBEE", padding: "16px 20px", boxShadow: `7px 7px 0 ${K.ink}`, textAlign: "center", transform: `scale(${1 + 0.03 * Math.sin((f - c.readings) / 5)})` }}>
                <div style={{ fontWeight: 900, fontSize: 26, color: K.muted }}>readings on our disk</div>
                <div style={{ fontFamily: K.head, fontSize: 110, color: K.red, lineHeight: 1 }}>0</div>
              </div>
            </div>
          </Push>

          {/* ── 2 shortcut: one ready-made number per day ── */}
          <Push f={f} {...zone("shortcut", "doubt1")} top={ZT}>
            <div style={{ position: "absolute", left: 30, top: 10, ...rise(f, c.shortcut) }}>
              <div style={{ fontFamily: K.head, fontSize: 64, color: "#fff", background: K.blue, border: `5px solid ${K.ink}`, borderRadius: 16, padding: "6px 24px", boxShadow: `7px 7px 0 ${K.ink}`, transform: "rotate(-2deg)" }}>⤴ THE SHORTCUT</div>
            </div>
            {/* OpenAQ hands one card per day */}
            <div style={{ position: "absolute", left: 30, top: 150, width: 230, height: 150, ...rise(f, c.ready) }}>
              <div style={{ width: "100%", height: "100%", border: `5px solid ${K.ink}`, borderRadius: 20, background: "#E3F2FD", display: "grid", placeItems: "center", fontFamily: K.head, fontSize: 48, boxShadow: `6px 6px 0 ${K.ink}` }}>OpenAQ</div>
            </div>
            {ROWS.map((r, i) => {
              const a = c.average + i * 5;
              const p = sp(f, a, { damping: 16 });
              return (
                <div key={r[0]} style={{ position: "absolute", left: 300 + 160 * p * 0 + i * 165, top: 175 - 40 * (1 - Math.min(1, p)), opacity: Math.min(1, p * 2), transform: `rotate(${(i - 1.5) * 3}deg) scale(${0.6 + 0.4 * Math.min(1.1, p)})` }}>
                  <div style={{ width: 140, border: `4px solid ${K.ink}`, borderRadius: 14, background: "#fff", textAlign: "center", padding: "8px 0", boxShadow: `5px 5px 0 ${K.ink}` }}>
                    <div style={{ fontWeight: 800, fontSize: 18, color: K.muted }}>{r[0].slice(0, 6)}</div>
                    <div style={{ fontFamily: K.mono, fontWeight: 900, fontSize: 40, color: pmColor(r[1]) }}>{r[1]}</div>
                  </div>
                </div>
              );
            })}
            <div style={{ position: "absolute", left: 30, top: 340, ...rise(f, c.easy) }}><Chip label="easy, right? 😌" color={K.muted} size={32} /></div>
            <div style={{ position: "absolute", left: 420, top: 330, ...rise(f, c.tried) }}>
              <div style={{ border: `5px solid ${K.ink}`, borderRadius: 18, background: "#fff", padding: "10px 24px", boxShadow: `7px 7px 0 ${K.ink}` }}>
                <div style={{ fontWeight: 900, fontSize: 24, color: K.muted }}>we tried it → daily numbers</div>
                <div style={{ fontFamily: K.head, fontSize: 84, color: K.blue, lineHeight: 1 }}><Count f={f} at={c.n3342} to={3342} dur={30} /></div>
              </div>
            </div>
          </Push>

          {/* ── 3 doubt: zone stays calm under Rishi's card ── */}
          <Push f={f} {...zone("doubt1", "count")} top={ZT}>
            <div style={{ position: "absolute", left: 30, top: 10, ...rise(f, start("doubt1") + 4) }}><Chip label="🤔 does it matter who averages?" color={K.muted} size={32} /></div>
          </Push>

          {/* ── 4 count (M2): 4 per hour × 24 hours = 96 ── */}
          <Push f={f} {...zone("count", "talk")} top={ZT}>
            <div style={{ position: "absolute", left: 40, top: 20, ...rise(f, start("count")) }}><ClockQ f={f} at={c.fifteen} /></div>
            <div style={{ position: "absolute", left: 260, top: 40, ...rise(f, c.fifteen) }}><Chip label="1 reading every 15 min" color={K.ink} size={34} /></div>
            <div style={{ position: "absolute", left: 260, top: 120, ...rise(f, c.howMany) }}><Chip label="one full day = ? readings" color="#FB8C00" size={34} /></div>
            <DayDots f={f} left={40} top={250} fillFrom={c.four} fillTo={c.think} lit={() => true} label={f >= c.twentyFour ? "4 per hour × 24 hours" : "4 per hour"} labelAt={c.four} />
            <div style={{ position: "absolute", left: 600, top: 460, ...rise(f, c.think, { scale: 0.5 }) }}>
              {f < c.n96 ? (
                <span style={{ fontFamily: K.head, fontSize: 96, color: "#FB8C00", display: "inline-block", transform: `scale(${1 + 0.06 * Math.sin(f / 3)})` }}>= ?</span>
              ) : (
                <span style={{ fontFamily: K.head, fontSize: 104, color: K.ink, display: "inline-block", ...rise(f, c.n96, { scale: 0.4 }) }}>= 96</span>
              )}
            </div>
            <Burst f={f} at={c.n96} x={720} y={520} />
          </Push>

          {/* ── 5 talk (M1 + M4): the 20 Jan row answers ── */}
          <Push f={f} {...zone("talk", "hides")} top={ZT}>
            <div style={{ position: "absolute", left: 30, top: 10, ...rise(f, c.ask) }}><Chip label="🎤 let's ask one day" color={K.ink} size={34} /></div>
            <DayDots f={f} left={40} top={120} fillFrom={c.thirteen} fillTo={c.thirteen + 14} lit={(i) => i >= 83} label="20 Jan 2026 · 96 slots" labelAt={c.jan} />
            <div style={{ position: "absolute", left: 40, top: 380, ...rise(f, c.woke) }}><Chip label="🌙 woke up at 20:45" color="#37474F" size={36} /></div>
            <div style={{ position: "absolute", left: 470, top: 370, ...rise(f, c.night) }}>
              <div style={{ fontFamily: K.head, fontSize: 64, color: "#fff", background: K.red, border: `5px solid ${K.ink}`, borderRadius: 16, padding: "4px 22px", boxShadow: `7px 7px 0 ${K.ink}` }}>13 OF 96 😱</div>
            </div>
          </Push>

          {/* ── 6 hides: one number looks like a whole day ── */}
          <Push f={f} {...zone("hides", "original")} top={ZT}>
            <Cracked f={f} at={c.whole} crack={c.three} />
            <div style={{ position: "absolute", left: 510, top: 60, ...rise(f, c.every) }}>
              <div style={{ fontFamily: K.head, fontSize: 52, lineHeight: 1.1, color: "#fff", background: K.ink, border: `5px solid ${K.ink}`, borderRadius: 16, padding: "10px 22px", boxShadow: `7px 7px 0 ${K.yellow}` }}>EVERY READING,<br />NOT THE AVERAGE</div>
            </div>
            <div style={{ position: "absolute", left: 30, top: 370, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
              <span style={rise(f, c.hides)}><Chip label="🙈 a ready-made average hides the gaps" color={K.red} size={32} /></span>
              <span style={rise(f, c.decide)}><Chip label="✋ WE decide when a day is complete" color={K.green} size={32} /></span>
            </div>
          </Push>

          {/* ── 7 original (M5): Maven release vs snapshot ── */}
          <Push f={f} {...zone("original", "why")} top={ZT}>
            <div style={{ position: "absolute", left: 30, top: 0, ...rise(f, c.maven) }}><Chip label="☕ think of Maven" color={K.ink} size={30} /></div>
            <div style={{ position: "absolute", left: 30, top: 80, width: 440, ...rise(f, c.version) }}>
              <div style={{ border: `5px solid ${K.ink}`, borderRadius: 18, background: "#E8F5E9", padding: "12px 20px", boxShadow: `7px 7px 0 ${K.ink}` }}>
                <div style={{ fontFamily: K.mono, fontWeight: 900, fontSize: 40 }}>lib-1.0.0 🔒</div>
                <div style={{ fontWeight: 800, fontSize: 24, color: K.green }}>release · never changes</div>
              </div>
            </div>
            <div style={{ position: "absolute", left: 520, top: 80, width: 440, ...rise(f, c.snapshot) }}>
              <div style={{ border: `5px dashed ${K.ink}`, borderRadius: 18, background: "#FFF3E0", padding: "12px 20px", transform: `translateX(${f >= c.snapshot ? 3 * Math.sin(f * 1.7) : 0}px)` }}>
                <div style={{ fontFamily: K.mono, fontWeight: 900, fontSize: 40 }}>lib-1.1-SNAPSHOT</div>
                <div style={{ fontWeight: 800, fontSize: 24, color: "#E65100" }}>can change any day · build #{Math.floor(f / 9) % 90 + 10}</div>
              </div>
            </div>
            {/* one original file per day, each gets a lock */}
            {["19 Feb", "20 Feb", "21 Feb", "22 Feb", "23 Feb"].map((d, i) => (
              <div key={d} style={{ position: "absolute", left: 30 + i * 186, top: 270, ...rise(f, c.openaq + i * 4) }}>
                <FileCard d={d} lock={sm(f, c.release + i * 3, 8)} />
              </div>
            ))}
            <div style={{ position: "absolute", left: 30, top: 450, ...rise(f, c.free) }}><Chip label="free for anyone" color={K.blue} size={28} /></div>
            <div style={{ position: "absolute", left: 330, top: 430, ...rise(f, c.never, { scale: 0.5 }) }}>
              <div style={{ fontFamily: K.head, fontSize: 60, color: "#fff", background: K.red, border: `5px solid ${K.ink}`, borderRadius: 16, padding: "2px 22px", boxShadow: `7px 7px 0 ${K.ink}`, transform: "rotate(-2deg)" }}>✋ WE NEVER EDIT IT</div>
            </div>
          </Push>

          {/* ── 8 why: go back to what the sensor really sent ── */}
          <Push f={f} {...zone("why", "recall")} top={ZT}>
            <div style={{ position: "absolute", left: 40, top: 300, ...rise(f, start("why")) }}><FileCard d="20 Jan" lock={1} big /></div>
            <div style={{ position: "absolute", left: 520, top: 30, ...rise(f, c.weeks) }}><Chip label="📆 weeks later…" color={K.muted} size={32} /></div>
            <div style={{ position: "absolute", left: 470, top: 120, ...rise(f, c.strange) }}>
              <div style={{ whiteSpace: "nowrap", fontFamily: K.head, fontSize: 46, color: "#fff", background: "#FB8C00", border: `5px solid ${K.ink}`, borderRadius: 16, padding: "4px 22px", boxShadow: `7px 7px 0 ${K.ink}` }}>🤨 strange number?</div>
            </div>
            <svg width={1000} height={584} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              <path d="M 640 220 C 600 330, 420 300, 300 370" fill="none" stroke={K.ink} strokeWidth={8} strokeLinecap="round" strokeDasharray="1 1" pathLength={1} strokeDashoffset={1 - sm(f, c.back, 14)} />
              <path d="M 300 370 l 30 -4 M 300 370 l 14 -26" fill="none" stroke={K.ink} strokeWidth={8} strokeLinecap="round" opacity={sm(f, c.back + 12, 4)} />
            </svg>
            <div style={{ position: "absolute", left: 420, top: 420, ...rise(f, c.sent) }}><Chip label="✓ see what the sensor really sent" color={K.green} size={32} /></div>
          </Push>

          {/* ── 9 recall ── */}
          <Push f={f} from={start("recall")} to={Infinity} top={ZT}>
            {([["a list is not data 📋", c.rList, K.ink], ["a daily average hides the hours 🙈", c.rAvg, K.red], ["keep the original files, untouched 🔒", c.rOrig, K.green]] as [string, number, string][]).map(([t, a, col], i) => (
              <div key={t} style={{ position: "absolute", left: 30, top: 20 + i * 120, display: "flex", alignItems: "center", gap: 18, ...rise(f, a) }}>
                <span style={{ width: 70, height: 70, borderRadius: 35, background: col, color: "#fff", display: "grid", placeItems: "center", fontFamily: K.head, fontSize: 42, border: `4px solid ${K.ink}` }}>{i + 1}</span>
                <span style={{ fontWeight: 900, fontSize: 40 }}>{t}</span>
              </div>
            ))}
            <div style={{ position: "absolute", left: 30, top: 410, ...rise(f, c.next) }}><Chip label="NEXT → whose files do we download first?" color={K.blue} size={32} /></div>
          </Push>
          <Underline f={f} at={c.rAvg + 10} left={118} top={ZT + 196} width={560} />
        </div>
      </Stage>

      {meta.titleCard && <TitleCard f={f} line={meta.titleCard.line} sub={meta.titleCard.sub} until={c.fifty} />}
      <DoubtLow f={f} from={start("doubt1")} to={end("doubt1")} text="Sir, an average is an average. Why does it matter who calculates it?" mouth={mouth} />
      <KineticCaption f={f} />
    </AbsoluteFill>
  );
}

function Stat({ f, at, n, label, color }: { f: number; at: number; n: number; label: string; color: string }) {
  return (
    <div style={{ border: `5px solid ${K.ink}`, borderRadius: 18, background: "#fff", padding: "8px 22px", boxShadow: `6px 6px 0 ${K.ink}`, ...rise(f, at) }}>
      <div style={{ fontFamily: K.head, fontSize: 84, color, lineHeight: 1 }}><Count f={f} at={at} to={n} dur={18} /></div>
      <div style={{ fontWeight: 800, fontSize: 22, color: K.muted }}>{label}</div>
    </div>
  );
}

/** Clock whose minute hand jumps in 15-minute steps (with a spring settle). */
function ClockQ({ f, at }: { f: number; at: number }) {
  const step = Number.isFinite(at) && f >= at ? Math.floor((f - at) / 10) : 0;
  const settle = Number.isFinite(at) && f >= at ? sp(f, at + step * 10, { damping: 9, stiffness: 300 }) : 1;
  const deg = (step - 1 + settle) * 90;
  const size = 180;
  return (
    <div style={{ position: "relative", width: size, height: size, borderRadius: size, background: "#fff", border: `6px solid ${K.ink}`, boxShadow: `6px 6px 0 ${K.ink}` }}>
      {[0, 90, 180, 270].map((d) => <div key={d} style={{ position: "absolute", left: "50%", top: "50%", width: 6, height: 18, background: K.ink, transform: `translate(-50%,-50%) rotate(${d}deg) translateY(-${size / 2 - 22}px)` }} />)}
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 8, height: size * 0.26, background: K.ink, borderRadius: 4, transformOrigin: "50% 100%", transform: "translate(-50%,-100%) rotate(60deg)" }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 6, height: size * 0.4, background: K.red, borderRadius: 3, transformOrigin: "50% 100%", transform: `translate(-50%,-100%) rotate(${deg}deg)` }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 16, height: 16, borderRadius: 8, background: K.ink, transform: "translate(-50%,-50%)" }} />
    </div>
  );
}

/** A day as 96 dots (24 hours × 4). Dots fill left→right between fillFrom and fillTo; lit(i) says which ones have a reading. */
function DayDots({ f, left, top, fillFrom, fillTo, lit, label, labelAt }: { f: number; left: number; top: number; fillFrom: number; fillTo: number; lit: (i: number) => boolean; label: string; labelAt: number }) {
  const shown = Number.isFinite(fillFrom) ? Math.max(0, Math.min(96, ((f - fillFrom) / Math.max(1, fillTo - fillFrom)) * 96)) : 0;
  const cols = 24, d = 30, g = 6;
  return (
    <div style={{ position: "absolute", left, top, ...rise(f, labelAt) }}>
      <div style={{ fontWeight: 900, fontSize: 26, marginBottom: 10 }}>{label}</div>
      <div style={{ position: "relative", width: cols * (d + g), height: 4 * (d + g) }}>
        {Array.from({ length: 96 }, (_, i) => {
          const h = Math.floor(i / 4), q = i % 4;
          const on = i < shown && lit(i);
          const k = on ? sp(f, fillFrom + (i / 96) * Math.max(1, fillTo - fillFrom), { damping: 12, stiffness: 300 }) : 0;
          return <div key={i} style={{ position: "absolute", left: h * (d + g), top: q * (d + g), width: d, height: d, borderRadius: 8, background: on ? (lit(0) ? K.blue : K.red) : "#E8ECF2", border: `2px solid ${on ? K.ink : "#D5DCE5"}`, transform: `scale(${on ? 0.6 + 0.4 * k : 1})` }} />;
        })}
        {[0, 6, 12, 18, 24].map((h) => <div key={h} style={{ position: "absolute", left: h * (d + g) - 18, top: 4 * (d + g) + 4, width: 40, textAlign: "center", fontWeight: 800, fontSize: 18, color: K.muted }}>{String(h % 24).padStart(2, "0")}h</div>)}
      </div>
    </div>
  );
}

/** "431" card that looks like a full day, then cracks open to show only 3 hours inside. */
function Cracked({ f, at, crack }: { f: number; at: number; crack: number }) {
  const o = sp(f, crack, { damping: 14 });
  const split = Math.min(1, o) * 70;
  const half = (side: -1 | 1) => (
    <div style={{ position: "absolute", top: 0, left: side < 0 ? 0 : 220, width: 220, height: 300, overflow: "hidden", transform: `translateX(${side * split}px) rotate(${side * split * 0.08}deg)` }}>
      <div style={{ position: "absolute", left: side < 0 ? 0 : -220, width: 440, height: 300, border: `6px solid ${K.ink}`, borderRadius: 22, background: "#fff", boxSizing: "border-box", boxShadow: `7px 7px 0 ${K.ink}`, textAlign: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 26, color: K.muted, marginTop: 18 }}>20 Jan 2026 · one number</div>
        <div style={{ fontFamily: K.head, fontSize: 130, color: "#E65100", lineHeight: 1.05 }}>431</div>
        <div style={{ margin: "6px 30px", height: 30, borderRadius: 8, background: K.blue, opacity: 0.8 }} />
        <div style={{ fontWeight: 800, fontSize: 22, color: K.muted }}>looks like a full day</div>
      </div>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 50, top: 30, width: 440, height: 300, ...rise(f, at) }}>
      {half(-1)}
      {half(1)}
      {/* inside: the truth, revealed in the crack */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 96, textAlign: "center", ...rise(f, crack + 6, { scale: 0.7 }) }}>
        <div style={{ background: "#fff", border: `5px solid ${K.ink}`, borderRadius: 16, padding: "12px 16px", boxShadow: `6px 6px 0 ${K.red}` }}>
          <div style={{ height: 28, background: "#E8ECF2", borderRadius: 8, position: "relative", border: `3px solid ${K.ink}` }}>
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "13.5%", background: K.red, borderRadius: 6 }} />
          </div>
          <div style={{ fontFamily: K.head, fontSize: 50, color: K.red, marginTop: 8 }}>ONLY 3 HOURS</div>
        </div>
      </div>
    </div>
  );
}

function FileCard({ d, lock, big = false }: { d: string; lock: number; big?: boolean }) {
  const s = big ? 1.4 : 1;
  return (
    <div style={{ position: "relative", width: 160 * s, height: 160 * s }}>
      <div style={{ position: "absolute", inset: 0, background: "#fff", border: `5px solid ${K.ink}`, borderRadius: "14px 40px 14px 14px", boxShadow: `6px 6px 0 ${K.ink}`, padding: 14 * s, boxSizing: "border-box" }}>
        <div style={{ fontWeight: 900, fontSize: 22 * s }}>📄 {d}</div>
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ height: 8 * s, width: `${90 - i * 12}%`, background: "#D5DCE5", borderRadius: 4, marginTop: 12 * s }} />)}
      </div>
      <div style={{ position: "absolute", right: -16, bottom: -16, fontSize: 54 * s, transform: `scale(${lock})`, opacity: lock > 0 ? 1 : 0 }}>🔒</div>
    </div>
  );
}
