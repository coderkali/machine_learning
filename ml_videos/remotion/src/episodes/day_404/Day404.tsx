// DAF-04 · Video C — "What did we really download?" (claude/daf/episodes/daf_04/script_v1.md, script approved 2026-10-06).
// SILENT build first (audio later). Pinned table: R K Puram days from the 554 raw files (data/raw/openaq/locationid=17):
//   day · file on our disk? · readings in the file · highest PM2.5. Numbers: notebook 04 outputs + all 554 files read 2026-10-06.
// Motion kit v2: src/shared/daf/motion.tsx. All text is HTML; SVG only for strokes/shapes.
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Burst, camera, cellBox, Count, KineticCaption, Push, Ring, Table2, Bubble, rise, sm, sp } from "../../shared/daf/motion";
import { DoubtLow } from "../../shared/daf/Pinned";
import { Stage } from "../../shared/daf/Stage";
import { Backdrop, ChapterBar, Chip, Header, K, TimelineProvider, TitleCard, useCues, useMouth, useTimeline } from "../../shared/explainer/kit";
import type { EpisodeMeta, Timeline } from "../../shared/types";

export const Day404: React.FC<{ timeline: Timeline; meta: EpisodeMeta }> = ({ timeline, meta }) => (
  <TimelineProvider value={timeline}><Scene meta={meta} /></TimelineProvider>
);

const ROWS: [string, string, string, string][] = [
  ["19 Feb 2025", "✓", "749", "123"],
  ["21 Oct 2025", "✓", "1,032", "1,753"],
  ["11–19 Jan 2026", "✗ no file", "—", "—"],
  ["11 Sep 2026", "✓", "1,112", "97"],
];
const FEB = 0, OCT = 1, JAN = 2;
const ROW_H = 64;
const ZT = 430;
const COLS_W = [{ w: 290 }, { w: 220 }, { w: 230 }, { w: 216 }];
// the 16 days with no file, as day index from 19 Feb 2025 (0) to 11 Sep 2026 (569)
const MISSING = ["2025-03-02", "2025-04-10", "2025-04-29", "2025-06-15", "2026-01-11", "2026-01-12", "2026-01-13", "2026-01-14", "2026-01-15", "2026-01-16", "2026-01-17", "2026-01-18", "2026-01-19", "2026-06-21", "2026-06-24", "2026-08-08"]
  .map((d) => Math.round((Date.parse(d) - Date.parse("2025-02-19")) / 86400000));
// rows per measured thing across all 554 files (467,816 rows)
const PARAMS: [string, number, string][] = [
  ["humidity", 45153, "#90CAF9"], ["temperature", 45153, "#FFAB91"], ["PM2.5", 44139, "#E65100"], ["NO₂", 43606, "#B39DDB"], ["NO", 43141, "#CE93D8"], ["PM10", 42980, "#BCAAA4"],
  ["CO", 42708, "#A5D6A7"], ["O₃", 42415, "#80CBC4"], ["SO₂", 40743, "#FFF59D"], ["wind speed", 26307, "#B0BEC5"], ["wind dir.", 25879, "#CFD8DC"], ["NOx", 25592, "#F48FB1"],
];
const C_ = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

function Scene({ meta }: { meta: EpisodeMeta }) {
  const f = useCurrentFrame();
  const tl = useTimeline();
  const { at, start, end } = useCues();
  const mouth = useMouth(f);

  const c = {
    rk: at("recap", "R"), from: at("recap", "nineteenth"), to: at("recap", "eleventh"), d570: at("recap", "Five"), download: at("recap", "download"), once: at("recap", "once"),
    cheaper: at("small", "cheaper"), month: at("small", "month"), d28: at("small", "twenty-eight"), started: at("small", "nineteenth"), think: at("small", "Think"), ten: at("small", "ten"), came: at("small", "came"), five: at("small", "five"),
    again: at("twice", "again"), zero: at("twice", "zero"), skipped: at("twice", "Skipped"), maven: at("twice", "Maven"), jars: at("twice", "jars"), local: at("twice", "local"), safely: at("twice", "safely"),
    eighty: at("full", "Eighty"), files: at("full", "Five"), mb: at("full", "megabytes"), days: at("full", "seventy"), sixteen: at("full", "sixteen"), nine: at("full", "nine"), winter: at("full", "winter"),
    open: at("inside", "open"), only: at("inside", "only", 2), twelve: at("inside", "Twelve"), pm10: at("inside", "PM10"), rows: at("inside", "Out"), fortyFour: at("inside", "forty-four"), tenth: at("inside", "About"),
    look: at("diwali", "look"), pm: at("diwali", "PM2.5", 1), n1753: at("diwali", "one"), poor: at("diwali", "Poor"), nineteen: at("diwali", "nineteen"), broken: at("diwali", "broken"), ask: at("diwali", "ask"), says: at("diwali", "says"), diwali: at("diwali", "Diwali"),
    cleaned: at("catch", "cleaned"), gone: at("catch", "gone"), raw: at("catch", "raw"), wrong: at("catch", "wrong"), later: at("catch", "later"), back: at("catch", "back"),
    rSmall: at("recall", "Test"), rFiles: at("recall", "Five"), rRaw: at("recall", "never"), next: at("recall", "Next"),
  };
  const chapters = (meta.chapters ?? []).map((ch) => ({ label: ch.label, from: start(ch.beat) }));
  const zone = (a: string, b: string) => ({ from: start(a), to: start(b) });
  const OCT_PEAK = cellBox(20, 58, COLS_W, OCT, 3, ROW_H);

  return (
    <AbsoluteFill style={{ fontFamily: K.ui, overflow: "hidden" }}>
      <Audio src={staticFile(tl.audio)} />
      <Backdrop />
      <Header f={f} day={meta.day} title={meta.title} badge={meta.badge} />
      <ChapterBar f={f} chapters={chapters} />
      <Stage f={f} tab="💾 R K Puram · the raw archive on our disk">
        <div style={{ position: "absolute", inset: 0, ...camera(f, [[c.sixteen, end("full")], [c.n1753, end("diwali")]], [c.n1753]) }}>
          {/* ── the pinned table ── */}
          <div style={{ position: "absolute", left: 20, top: 8, ...rise(f, 2) }}>
            <span style={{ display: "inline-block", background: K.ink, color: "#fff", fontWeight: 900, fontSize: 26, padding: "6px 16px", borderRadius: 10 }}>R K Puram · real days from the raw files</span>
          </div>
          <Table2 f={f} size={30} rowH={ROW_H} style={{ left: 20, top: 58 }}
            cols={[
              { key: "d", label: "📅 day", w: 290 },
              { key: "o", label: "file on our disk?", w: 220, color: K.blue, at: c.files, fill: (r) => (r === JAN ? c.nine : c.files + 6 + r * 4) },
              { key: "n", label: "readings in the file", w: 230, color: "#7C3AED", at: c.open, fill: (r) => c.rows + r * 4 },
              { key: "p", label: "highest PM2.5", w: 216, color: "#E65100", at: c.look, fill: (r) => (r === OCT ? c.n1753 : c.n1753 + 14 + r * 4) },
            ]}
            rows={ROWS} rowAt={(r) => 6 + r * 4}
            focus={(r) => (r === FEB && f >= start("small") && f < start("full")) || (r === JAN && f >= c.nine && f < start("inside")) || (r === OCT && f >= c.look && f < start("recall"))}
            hi={(r) => (r === JAN && f >= c.nine ? "#FFEBEE" : null)}
            fmt={(v, ci, r) => {
              if (ci === 0) return v;
              if (ci === 1) return <span style={{ color: (v as string).startsWith("✓") ? K.green : K.red, fontSize: (v as string).startsWith("✓") ? 36 : 28 }}>{v}</span>;
              if (ci === 3 && r === OCT) return <span style={{ color: K.red, fontSize: 38 }}>{v}</span>;
              if (ci === 3) return <span style={{ color: Number(v) >= 91 ? "#E65100" : K.ink }}>{v}</span>;
              return v;
            }} />
          {f < start("recall") && <Ring f={f} at={c.n1753 + 6} left={OCT_PEAK.left + 2} top={OCT_PEAK.top + 9} width={130} height={ROW_H - 18} />}
          {f >= c.says && f < start("catch") && (
            <Bubble f={f} at={c.says} text="No sir. That was Diwali night 🪔" tail="up" color={K.yellow} size={28} style={{ left: 500, top: OCT_PEAK.top + ROW_H * 3 + 34 }} />
          )}
          <div style={{ position: "absolute", left: 20, right: 20, top: ZT - 22, borderTop: `4px dashed ${K.line}`, opacity: sm(f, 10) }} />

          {/* ── 1 recap: 570 days, not all at once ── */}
          <Push f={f} {...zone("recap", "doubt1")} top={ZT}>
            <div style={{ position: "absolute", left: 30, top: 0, ...rise(f, c.rk) }}><Chip label="⭐ R K Puram · one station" color={K.green} size={30} /></div>
            <DayStrip f={f} left={30} top={90} at={c.from} drawTo={c.to} holesAt={Infinity} />
            <div style={{ position: "absolute", left: 30, top: 270, ...rise(f, c.d570) }}>
              <div style={{ fontFamily: K.head, fontSize: 96, color: K.ink, lineHeight: 1 }}><Count f={f} at={c.d570} to={570} dur={20} /> <span style={{ fontSize: 48 }}>DAYS</span></div>
            </div>
            <div style={{ position: "absolute", left: 520, top: 280, ...rise(f, c.download) }}><Chip label="⬇ now we download" color={K.blue} size={32} /></div>
            <div style={{ position: "absolute", left: 520, top: 360, ...rise(f, c.once) }}><Chip label="✋ but not all at once" color={K.red} size={32} /></div>
          </Push>

          {/* ── 2 doubt ── */}
          <Push f={f} {...zone("doubt1", "small")} top={ZT}>
            <div style={{ position: "absolute", left: 30, top: 10, ...rise(f, start("doubt1") + 4) }}><Chip label="⬇ everything in one go?" color={K.muted} size={32} /></div>
          </Push>

          {/* ── 3 small (M2): one month first → 10 files ── */}
          <Push f={f} {...zone("small", "twice")} top={ZT}>
            <div style={{ position: "absolute", left: 30, top: 0, ...rise(f, c.cheaper) }}><Chip label="🐞 a mistake is cheaper to find small" color={K.ink} size={28} /></div>
            <FebCalendar f={f} left={30} top={80} at={c.month} allAt={c.d28} cutAt={c.started} />
            <div style={{ position: "absolute", left: 620, top: 110, ...rise(f, c.think, { scale: 0.5 }) }}>
              {f < c.ten ? (
                <span style={{ fontFamily: K.head, fontSize: 104, color: "#FB8C00", display: "inline-block", transform: `scale(${1 + 0.06 * Math.sin(f / 3)})` }}>files = ?</span>
              ) : (
                <span style={{ fontFamily: K.head, fontSize: 104, color: K.green, display: "inline-block", ...rise(f, c.ten, { scale: 0.4 }) }}>10 FILES</span>
              )}
            </div>
            <Burst f={f} at={c.ten} x={780} y={170} color={K.green} />
            <div style={{ position: "absolute", left: 620, top: 270, ...rise(f, c.came) }}><Chip label="✓ and ten came" color={K.green} size={32} /></div>
            <div style={{ position: "absolute", left: 620, top: 350, ...rise(f, c.five) }}><Chip label="⏱ in 5 seconds" color={K.ink} size={32} /></div>
          </Push>

          {/* ── 4 twice (M5): run again → 0 downloaded, 10 skipped; like Maven's local repository ── */}
          <Push f={f} {...zone("twice", "full")} top={ZT}>
            <RunCard f={f} left={30} top={0} at={start("twice")} title="1st run · Feb 2025" dl={10} sk={0} dlAt={start("twice")} skAt={start("twice")} />
            <RunCard f={f} left={510} top={0} at={c.again} title="2nd run · same command" dl={0} sk={10} dlAt={c.zero} skAt={c.skipped} />
            <div style={{ position: "absolute", left: 30, top: 230, ...rise(f, c.maven) }}><Chip label="☕ just like Maven" color={K.ink} size={30} /></div>
            <div style={{ position: "absolute", left: 30, top: 310, width: 940, ...rise(f, c.jars) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, border: `5px solid ${K.ink}`, borderRadius: 18, background: "#FFF8E1", padding: "12px 20px", boxShadow: `6px 6px 0 ${K.ink}` }}>
                <div style={{ display: "flex", gap: 8 }}>{["📦", "📦", "📦", "📦"].map((j, i) => <span key={i} style={{ fontSize: 46, display: "inline-block", transform: `translateY(${-10 * Math.max(0, Math.sin((f - c.local) / 5 + i)) * sm(f, c.local, 6)}px)` }}>{j}</span>)}</div>
                <div style={{ fontWeight: 900, fontSize: 28 }}>2nd build: jars already in your local repository → not downloaded again</div>
              </div>
            </div>
            <div style={{ position: "absolute", left: 250, top: 470, ...rise(f, c.safely, { scale: 0.5 }) }}>
              <div style={{ fontFamily: K.head, fontSize: 60, color: "#fff", background: K.green, border: `5px solid ${K.ink}`, borderRadius: 16, padding: "2px 24px", boxShadow: `7px 7px 0 ${K.ink}` }}>✓ SAFE TO RUN AGAIN</div>
            </div>
          </Push>

          {/* ── 5 full: 80 s · 554 files · 2.5 MB · 16 holes, 9 in a row in January ── */}
          <Push f={f} {...zone("full", "inside")} top={ZT}>
            <div style={{ position: "absolute", left: 30, top: 0, display: "flex", gap: 16 }}>
              <Stat f={f} at={c.eighty} big={<><Count f={f} at={c.eighty} to={80} dur={16} /> s</>} label="⏱ full run" color={K.ink} />
              <Stat f={f} at={c.files} big={<Count f={f} at={c.files} to={554} dur={20} />} label="📄 files" color={K.blue} />
              <Stat f={f} at={c.mb} big={<>2.5 MB</>} label="💾 on disk" color={K.green} />
            </div>
            <DayStrip f={f} left={30} top={240} at={c.days} drawTo={c.days + 20} holesAt={c.sixteen} zoomAt={c.nine} />
            <div style={{ position: "absolute", left: 30, top: 420, ...rise(f, c.sixteen) }}><Chip label="❌ 16 days · no file at all" color={K.red} size={30} /></div>
            <div style={{ position: "absolute", left: 470, top: 420, ...rise(f, c.nine) }}><Chip label="9 in a row · 11–19 Jan 2026" color={K.ink} size={30} /></div>
            <div style={{ position: "absolute", left: 470, top: 500, ...rise(f, c.winter) }}><Chip label="❄️ right in the middle of winter" color={K.blue} size={30} /></div>
          </Push>

          {/* ── 6 inside: 12 things measured; PM2.5 ≈ 1 in 10 rows ── */}
          <Push f={f} {...zone("inside", "diwali")} top={ZT}>
            <div style={{ position: "absolute", left: 30, top: 0, ...rise(f, c.open) }}><Chip label="📂 open one file" color={K.ink} size={30} /></div>
            <div style={{ position: "absolute", left: 300, top: 0, ...rise(f, c.twelve) }}><Chip label="12 things measured" color="#7C3AED" size={30} /></div>
            <ParamBars f={f} left={30} top={80} at={c.twelve} pmAt={c.only} />
            <div style={{ position: "absolute", left: 30, top: 410, display: "flex", gap: 16, alignItems: "center" }}>
              <Stat f={f} at={c.rows} big={<Count f={f} at={c.rows} to={467816} dur={26} />} label="rows in all files" color={K.ink} small />
              <Stat f={f} at={c.fortyFour} big={<Count f={f} at={c.fortyFour} to={44139} dur={22} />} label="are PM2.5" color="#E65100" small />
              <div style={rise(f, c.tenth, { scale: 0.5 })}><span style={{ fontFamily: K.head, fontSize: 64, color: "#E65100" }}>≈ 1 IN 10</span></div>
            </div>
          </Push>

          {/* ── 7 diwali (M4 + M1): 1,753 = 19 × the Poor line ── */}
          <Push f={f} {...zone("diwali", "catch")} top={ZT}>
            <div style={{ position: "absolute", left: 30, top: 0, ...rise(f, c.look) }}><Chip label="🕒 21 Oct 2025 · 3 am" color={K.ink} size={30} /></div>
            <PeakBars f={f} left={60} top={120} at={c.n1753} poorAt={c.poor} />
            <div style={{ position: "absolute", left: 520, top: 80, ...rise(f, c.nineteen, { scale: 0.5 }) }}>
              <div style={{ fontFamily: K.head, fontSize: 110, color: K.red, lineHeight: 1 }}>× 19</div>
              <div style={{ fontWeight: 900, fontSize: 26, color: K.muted }}>the Poor line (91)</div>
            </div>
            <div style={{ position: "absolute", left: 520, top: 260, ...rise(f, c.broken) }}><Chip label="🤔 a broken sensor?" color={K.muted} size={32} /></div>
            <div style={{ position: "absolute", left: 500, top: 340, ...rise(f, c.diwali, { scale: 0.5 }) }}>
              <div style={{ fontFamily: K.head, fontSize: 56, color: "#fff", background: "#E65100", border: `5px solid ${K.ink}`, borderRadius: 16, padding: "2px 22px", boxShadow: `7px 7px 0 ${K.ink}` }}>🪔 DIWALI NIGHT</div>
            </div>
          </Push>

          {/* ── 8 catch: never edit raw ── */}
          <Push f={f} {...zone("catch", "recall")} top={ZT}>
            <Broom f={f} left={30} top={20} at={c.cleaned} blockAt={c.raw} goneAt={c.gone} />
            <div style={{ position: "absolute", left: 30, top: 300, ...rise(f, c.raw) }}>
              <div style={{ fontFamily: K.head, fontSize: 56, color: "#fff", background: K.ink, border: `5px solid ${K.ink}`, borderRadius: 16, padding: "4px 22px", boxShadow: `7px 7px 0 ${K.yellow}` }}>🔒 RAW = EXACTLY AS IT CAME</div>
            </div>
            <div style={{ position: "absolute", left: 30, top: 420, ...rise(f, c.wrong) }}><Chip label="even a number that looks wrong" color={K.red} size={28} /></div>
            <div style={{ position: "absolute", left: 520, top: 420, ...rise(f, c.later) }}><Chip label="🧹 fixing comes later · own step" color={K.green} size={28} /></div>
          </Push>

          {/* ── 9 recall ── */}
          <Push f={f} from={start("recall")} to={Infinity} top={ZT}>
            {([["test small, safe to run again 🐞", c.rSmall, K.ink], ["554 files · 16 missing days 📄", c.rFiles, K.blue], ["never edit raw data 🔒", c.rRaw, K.red]] as [string, number, string][]).map(([t, a, col], i) => (
              <div key={t} style={{ position: "absolute", left: 30, top: 20 + i * 120, display: "flex", alignItems: "center", gap: 18, ...rise(f, a) }}>
                <span style={{ width: 70, height: 70, borderRadius: 35, background: col, color: "#fff", display: "grid", placeItems: "center", fontFamily: K.head, fontSize: 42, border: `4px solid ${K.ink}` }}>{i + 1}</span>
                <span style={{ fontWeight: 900, fontSize: 40 }}>{t}</span>
              </div>
            ))}
            <div style={{ position: "absolute", left: 30, top: 410, ...rise(f, c.next) }}><Chip label="NEXT → one table, one row per day" color={K.blue} size={32} /></div>
          </Push>
        </div>
      </Stage>

      {meta.titleCard && <TitleCard f={f} line={meta.titleCard.line} sub={meta.titleCard.sub} until={c.rk + 20} />}
      <DoubtLow f={f} from={start("doubt1")} to={end("doubt1")} text="Sir, it is only one station. Why not download everything in one go?" mouth={mouth} />
      <KineticCaption f={f} />
    </AbsoluteFill>
  );
}

function Stat({ f, at, big, label, color, small = false }: { f: number; at: number; big: React.ReactNode; label: string; color: string; small?: boolean }) {
  return (
    <div style={{ border: `5px solid ${K.ink}`, borderRadius: 18, background: "#fff", padding: "6px 20px", boxShadow: `6px 6px 0 ${K.ink}`, ...rise(f, at) }}>
      <div style={{ fontFamily: K.head, fontSize: small ? 54 : 74, color, lineHeight: 1 }}>{big}</div>
      <div style={{ fontWeight: 800, fontSize: 22, color: K.muted }}>{label}</div>
    </div>
  );
}

/** 570 days as thin ticks (19 Feb 2025 → 11 Sep 2026). Holes = the 16 days with no file; zoomAt lifts the January gap. */
function DayStrip({ f, left, top, at, drawTo, holesAt, zoomAt = Infinity }: { f: number; left: number; top: number; at: number; drawTo: number; holesAt: number; zoomAt?: number }) {
  const W = 940, n = 570, w = W / n;
  const drawn = Number.isFinite(at) ? interpolate(f, [at, Math.max(at + 1, drawTo)], [0, n], C_) : 0;
  const holes = new Set(MISSING);
  const z = sm(f, zoomAt, 12);
  const months = ["Mar 25", "Jun 25", "Sep 25", "Dec 25", "Mar 26", "Jun 26", "Sep 26"];
  const monthIdx = [10, 102, 194, 285, 375, 467, 559];
  return (
    <div style={{ position: "absolute", left, top, width: W, height: 150, opacity: drawn > 0 ? 1 : 0 }}>
      <div style={{ position: "absolute", left: 0, top: 20, width: W, height: 80, border: `4px solid ${K.ink}`, borderRadius: 10, boxSizing: "border-box", overflow: "hidden", background: "#F1F5F9" }}>
        {/* drawn as 5 fills per hole for speed: the green bar + red holes on top */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: (drawn / n) * W, background: K.green }} />
        {MISSING.map((d) => {
          const show = sm(f, holesAt + (d / n) * 10, 8);
          const jan = d >= 326 && d <= 334;
          return <div key={d} style={{ position: "absolute", left: d * w - 1, top: 0, bottom: 0, width: w + 2, background: K.red, opacity: show, transform: `scaleY(${1 + (jan ? 0.0 : 0)})` }} />;
        })}
        {holes.size > 0 && null}
      </div>
      {/* zoom bubble on the January gap (days 326–334) */}
      <div style={{ position: "absolute", left: 330 * w - 70, top: -70, width: 140, height: 80, opacity: z, transform: `scale(${0.6 + 0.4 * z})`, transformOrigin: "50% 100%" }}>
        <div style={{ display: "flex", gap: 3, background: "#fff", border: `4px solid ${K.ink}`, borderRadius: 12, padding: 8, boxShadow: `5px 5px 0 ${K.ink}` }}>
          {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ width: 10, height: 44, background: K.red, borderRadius: 3, transform: `scaleY(${sm(f, zoomAt + 4 + i * 2, 6)})` }} />)}
        </div>
      </div>
      {monthIdx.map((d, i) => <div key={d} style={{ position: "absolute", left: d * w - 40, top: 106, width: 80, textAlign: "center", fontWeight: 800, fontSize: 18, color: K.muted }}>{months[i]}</div>)}
    </div>
  );
}

/** February 2025 calendar: all 28 days appear, then 1–18 grey out and 19–28 light up one by one. */
function FebCalendar({ f, left, top, at, allAt, cutAt }: { f: number; left: number; top: number; at: number; allAt: number; cutAt: number }) {
  const S = 70, G = 8;
  // 1 Feb 2025 was a Saturday → offset 5 in a Mon-first week
  return (
    <div style={{ position: "absolute", left, top, ...rise(f, at) }}>
      <div style={{ fontFamily: K.head, fontSize: 40, marginBottom: 8 }}>FEBRUARY 2025</div>
      <div style={{ position: "relative", width: 7 * (S + G), height: 5 * (S + G) }}>
        {Array.from({ length: 28 }, (_, i) => {
          const day = i + 1, k = i + 5, x = (k % 7) * (S + G), y = Math.floor(k / 7) * (S + G);
          const p = sp(f, allAt + i * 0.5, { damping: 14 });
          const off = day < 19 && f >= cutAt + i * 0.4;
          const on = day >= 19 && f >= cutAt + 6 + (day - 19) * 2;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, width: S, height: S, borderRadius: 12, border: `4px solid ${on ? K.ink : "#C7CFDA"}`, background: on ? K.green : off ? "#EEF1F5" : "#fff", color: on ? "#fff" : off ? "#B0BAC6" : K.ink, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 28, opacity: Math.min(1, p * 1.5), transform: `scale(${Math.min(1.08, p) * (on ? 1 + 0.06 * sp(f, cutAt + 6 + (day - 19) * 2) * 0 : 1)})` }}>
              {on ? "📄" : day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RunCard({ f, left, top, at, title, dl, sk, dlAt, skAt }: { f: number; left: number; top: number; at: number; title: string; dl: number; sk: number; dlAt: number; skAt: number }) {
  return (
    <div style={{ position: "absolute", left, top, width: 450, ...rise(f, at) }}>
      <div style={{ border: `5px solid ${K.ink}`, borderRadius: 18, background: "#fff", boxShadow: `7px 7px 0 ${K.ink}`, overflow: "hidden" }}>
        <div style={{ background: K.ink, color: "#fff", fontWeight: 900, fontSize: 24, padding: "8px 16px" }}>{title}</div>
        <div style={{ padding: "10px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontWeight: 900, fontSize: 32, ...rise(f, dlAt) }}>⬇ downloaded <span style={{ fontFamily: K.head, fontSize: 48, color: dl ? K.blue : K.green }}>{dl}</span></div>
          <div style={{ fontWeight: 900, fontSize: 32, ...rise(f, skAt) }}>⏭ skipped <span style={{ fontFamily: K.head, fontSize: 48, color: sk ? K.green : K.muted }}>{sk}</span></div>
        </div>
      </div>
    </div>
  );
}

/** 12 measured things as horizontal bars; at pmAt every bar but PM2.5 dims. */
function ParamBars({ f, left, top, at, pmAt }: { f: number; left: number; top: number; at: number; pmAt: number }) {
  const max = 45153, W = 620;
  const dim = sm(f, pmAt, 10);
  return (
    <div style={{ position: "absolute", left, top, width: 940 }}>
      {PARAMS.map(([n, v, col], i) => {
        const p = sm(f, at + i * 2, 12);
        const pm = n === "PM2.5";
        return (
          <div key={n} style={{ display: "flex", alignItems: "center", height: 26, marginBottom: 1, opacity: p * (pm ? 1 : 1 - 0.6 * dim) }}>
            <div style={{ width: 170, fontWeight: 900, fontSize: 20, color: pm ? "#E65100" : K.ink }}>{n}</div>
            <div style={{ width: (v / max) * W * p, height: 20, background: col, border: `2px solid ${K.ink}`, borderRadius: 5, boxShadow: pm && dim > 0 ? `0 0 12px #E65100` : undefined }} />
            <div style={{ marginLeft: 8, fontFamily: K.mono, fontWeight: 800, fontSize: 18, color: K.muted }}>{v.toLocaleString("en-US")}</div>
          </div>
        );
      })}
    </div>
  );
}

/** The Poor line (91) bar vs the 1,753 bar growing 19× taller. */
function PeakBars({ f, left, top, at, poorAt }: { f: number; left: number; top: number; at: number; poorAt: number }) {
  const H = 380, max = 1800, y = (v: number) => (v / max) * H;
  const g = sm(f, at, 24);
  return (
    <div style={{ position: "absolute", left, top, width: 420, height: H + 40 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: H, borderTop: `5px solid ${K.ink}` }} />
      {/* Poor bar */}
      <div style={{ position: "absolute", left: 30, bottom: 40, width: 130, height: y(91) * sm(f, poorAt, 10), background: "#FB8C00", border: `4px solid ${K.ink}`, borderRadius: "8px 8px 0 0" }} />
      <div style={{ position: "absolute", left: 30, top: H + 6, width: 130, textAlign: "center", fontWeight: 900, fontSize: 22, opacity: sm(f, poorAt, 8) }}>Poor = 91</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: H - y(91), borderTop: `4px dashed ${K.red}`, opacity: sm(f, poorAt, 8) }} />
      {/* 1,753 */}
      <div style={{ position: "absolute", left: 230, bottom: 40, width: 150, height: y(1753) * g, background: K.red, border: `4px solid ${K.ink}`, borderRadius: "8px 8px 0 0", boxShadow: `0 0 ${20 * g}px rgba(229,57,53,.6)` }}>
        <div style={{ position: "absolute", top: -54, left: -20, right: -20, textAlign: "center", fontFamily: K.head, fontSize: 46, color: K.red, opacity: g }}><Count f={f} at={at} to={1753} dur={24} /></div>
      </div>
      <div style={{ position: "absolute", left: 230, top: H + 6, width: 150, textAlign: "center", fontWeight: 900, fontSize: 22, opacity: g }}>3 am</div>
    </div>
  );
}

/** A "clean while downloading" broom sweeps toward the 1,753 row and is stopped by a lock. */
function Broom({ f, left, top, at, blockAt, goneAt }: { f: number; left: number; top: number; at: number; blockAt: number; goneAt: number }) {
  const sweep = sm(f, at, 20);
  const block = sm(f, blockAt, 8);
  const x = 420 * sweep - 60 * block;
  const fade = f >= goneAt && f < blockAt ? 1 - 0.7 * sm(f, goneAt, 10) : 1;
  return (
    <div style={{ position: "absolute", left, top, width: 940, height: 260, ...rise(f, at) }}>
      <div style={{ position: "absolute", left: 590, top: 50, opacity: fade }}>
        <div style={{ border: `5px solid ${K.ink}`, borderRadius: 14, background: "#FFEBEE", padding: "10px 14px", fontFamily: K.mono, fontWeight: 900, fontSize: 24, whiteSpace: "nowrap", boxShadow: `6px 6px 0 ${K.ink}` }}>21 Oct · 03:00 · <span style={{ color: K.red }}>1,753</span></div>
      </div>
      <div style={{ position: "absolute", left: x, top: 30, fontSize: 110, transform: `rotate(${-20 + 12 * Math.sin(f / 3) * (1 - block)}deg)` }}>🧹</div>
      <div style={{ position: "absolute", left: 30, top: 180, fontWeight: 900, fontSize: 26, color: K.muted, opacity: sweep }}>“clean while downloading?”</div>
      <div style={{ position: "absolute", left: 480, top: 40, fontSize: 100, transform: `scale(${sp(f, blockAt)})`, opacity: block > 0 ? 1 : 0 }}>🔒</div>
      <Burst f={f} at={blockAt} x={530} y={100} color={K.yellow} />
    </div>
  );
}
