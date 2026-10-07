// DAF-04 · Video B — "Why start with just one station?" (claude/daf/episodes/daf_04/script_v1.md, script approved 2026-10-06).
// SILENT build first (audio later). Pinned table: real rows of the four-year list (data/processed/valid_stations_recent_4y.csv)
// + data/raw/stations.csv: station · our listed sensor's last reading · still recording? · new sensor since.
// Fill grid in "compute" mirrors the real cached table: New Delhi ~all 48 months, GK1 from May 2024, the other 42 only Sep–Oct 2022.
// Motion kit v2: src/shared/daf/motion.tsx. All text is HTML; SVG only for strokes/shapes.
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Burst, camera, cellBox, Count, KineticCaption, Push, Ring, Table2, Bubble, rise, sm, sp } from "../../shared/daf/motion";
import { DoubtLow } from "../../shared/daf/Pinned";
import { Stage } from "../../shared/daf/Stage";
import { Backdrop, ChapterBar, Chip, Header, K, TimelineProvider, TitleCard, useCues, useMouth, useTimeline } from "../../shared/explainer/kit";
import type { EpisodeMeta, Timeline } from "../../shared/types";

export const Day354: React.FC<{ timeline: Timeline; meta: EpisodeMeta }> = ({ timeline, meta }) => (
  <TimelineProvider value={timeline}><Scene meta={meta} /></TimelineProvider>
);

const ROWS: [string, string, string, string][] = [
  ["New Delhi · AirNow", "16 Sep 2026", "✓", "—"],
  ["Mandir Marg · DPCC", "31 Oct 2022", "✗", "19 Feb 2025"],
  ["Anand Vihar · DPCC", "31 Oct 2022", "✗", "19 Feb 2025"],
  ["R K Puram · DPCC", "31 Oct 2022", "✗", "19 Feb 2025 ⭐"],
];
const RK = 3;
const ROW_H = 64;
const ZT = 430;
const COLS_W = [{ w: 320 }, { w: 236 }, { w: 170 }, { w: 230 }];
const SAID = ["I am still recording ✓", "31 October 2022", "the same day", "the same day too"];
const C_ = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

function Scene({ meta }: { meta: EpisodeMeta }) {
  const f = useCurrentFrame();
  const tl = useTimeline();
  const { at, start, end } = useCues();
  const mouth = useMouth(f);

  const c = {
    every: at("recap", "every"), all: at("recap", "all"), check: at("recap", "check"), doing: at("recap", "doing"),
    ask: at("talk", "ask"), last: at("talk", "last"), nd: at("talk", "New"), mm: at("talk", "Mandir"), av: at("talk", "Anand"), rk: at("talk", "R"),
    wait: at("wow", "Wait"), fortyTwo: at("wow", "Forty-two"), quiet: at("wow", "quiet"), only2: at("wow", "Only"), mandir: at("wow", "Mandir"), inside: at("wow", "inside"), six: at("wow", "six"),
    full: at("compute", "full"), fourYears: at("compute", "four"), sixtyFour: at("compute", "sixty-four"), had: at("compute", "had"), think: at("compute", "think"), five: at("compute", "five"), two: at("compute", "two"), thirds: at("compute", "two-thirds"),
    weeks: at("slice", "weeks"), spring: at("slice", "Spring"), fifty: at("slice", "fifty"), one: at("slice", "one"), controller: at("slice", "controller"), database: at("slice", "database"), rest: at("slice", "rest"), station: at("slice", "station"), data: at("slice", "Data"), model: at("slice", "model"), app: at("slice", "app"),
    which: at("rkpuram", "which"), rkp: at("rkpuram", "R"), same: at("rkpuram", "Same"), old: at("rkpuram", "old"), newOne: at("rkpuram", "new", 2), nineteenth: at("rkpuram", "nineteenth"), still: at("rkpuram", "still"), fifteen: at("rkpuram", "fifteen"),
    year: at("catch", "year"), winter: at("catch", "winter"), describe: at("catch", "describe"), delhi: at("catch", "Delhi"), deal: at("catch", "deal"), widen: at("catch", "widen"),
    rCheck: at("recall", "Check"), rSlice: at("recall", "slice"), rRk: at("recall", "R"), next: at("recall", "Next"),
  };
  const chapters = (meta.chapters ?? []).map((ch) => ({ label: ch.label, from: start(ch.beat) }));
  const zone = (a: string, b: string) => ({ from: start(a), to: start(b) });
  const speak = [c.nd, c.mm, c.av, c.rk];
  const speaker = f >= start("talk") && f < start("wow") ? speak.reduce((idx, a, i) => (f >= a ? i : idx), -1) : -1;
  const RK_CELL = cellBox(20, 58, COLS_W, RK, 3, ROW_H);

  return (
    <AbsoluteFill style={{ fontFamily: K.ui, overflow: "hidden" }}>
      <Audio src={staticFile(tl.audio)} />
      <Backdrop />
      <Header f={f} day={meta.day} title={meta.title} badge={meta.badge} />
      <ChapterBar f={f} chapters={chapters} />
      <Stage f={f} tab="📡 our list of 44 · what were the sensors really doing?">
        <div style={{ position: "absolute", inset: 0, ...camera(f, [[c.fortyTwo, end("wow")], [c.five, end("compute")]], [c.fortyTwo, c.five]) }}>
          {/* ── the pinned table ── */}
          <div style={{ position: "absolute", left: 20, top: 8, ...rise(f, 2) }}>
            <span style={{ display: "inline-block", background: K.ink, color: "#fff", fontWeight: 900, fontSize: 26, padding: "6px 16px", borderRadius: 10 }}>4 real rows from our list of 44 (DAF-03)</span>
          </div>
          <Table2 f={f} size={30} rowH={ROW_H} style={{ left: 20, top: 58 }}
            cols={[
              { key: "s", label: "📍 station", w: 320 },
              { key: "l", label: "our sensor's last reading", w: 236, color: "#37474F", at: c.last, fill: (r) => speak[r] + 4 },
              { key: "o", label: "still recording?", w: 170, color: K.red, at: c.only2, fill: (r) => c.only2 + 4 + r * 4 },
              { key: "n", label: "new sensor since", w: 230, color: K.green, at: c.same, fill: (r) => (r === RK ? c.nineteenth : c.nineteenth + 10 + r * 4) },
            ]}
            rows={ROWS} rowAt={(r) => 6 + r * 4}
            focus={(r) => r === speaker || (r === RK && f >= c.rkp && f < start("catch")) || (r === 1 && f >= c.mandir && f < start("compute"))}
            fmt={(v, ci) => {
              if (ci === 0) return <span style={{ fontFamily: K.ui, fontWeight: 900, fontSize: 28 }}>{v}</span>;
              if (ci === 1) return <span style={{ color: v === "31 Oct 2022" ? K.red : K.green }}>{v}</span>;
              if (ci === 2) return <span style={{ fontSize: 38, color: v === "✓" ? K.green : K.red }}>{v}</span>;
              return <span style={{ color: K.green }}>{v}</span>;
            }} />
          {f >= c.nineteenth && f < start("recall") && <Ring f={f} at={c.nineteenth + 4} left={RK_CELL.left + 2} top={RK_CELL.top + 10} width={RK_CELL.width - 10} height={ROW_H - 20} color={K.green} />}
          <div style={{ position: "absolute", left: 20, right: 20, top: ZT - 22, borderTop: `4px dashed ${K.line}`, opacity: sm(f, 10) }} />

          {/* ── 1 recap: download all 44? ── */}
          <Push f={f} {...zone("recap", "talk")} top={ZT}>
            <div style={{ position: "absolute", left: 30, top: 10, ...rise(f, c.every) }}><Chip label="📄 every reading · original daily files" color={K.green} size={30} /></div>
            <SensorGrid f={f} left={30} top={90} at={c.all} quietAt={Infinity} />
            <div style={{ position: "absolute", left: 600, top: 120, ...rise(f, c.all) }}>
              <div style={{ fontFamily: K.head, fontSize: 56, color: "#fff", background: K.blue, border: `5px solid ${K.ink}`, borderRadius: 16, padding: "6px 22px", boxShadow: `7px 7px 0 ${K.ink}` }}>⬇ ALL 44?</div>
            </div>
            <div style={{ position: "absolute", left: 600, top: 260, ...rise(f, c.check) }}><Chip label="🔍 first, check them" color={K.ink} size={34} /></div>
          </Push>

          {/* ── 2 talk (M1): each row answers ── */}
          <Push f={f} {...zone("talk", "wow")} top={ZT}>
            <div style={{ position: "absolute", left: 30, top: 10, ...rise(f, c.ask) }}><Chip label="🎤 when did you last send a reading?" color={K.ink} size={32} /></div>
            {speak.map((a, i) => (
              speaker === i && <Bubble key={i} f={f} at={a} text={`${ROWS[i][0].split(" · ")[0]}: “${SAID[i]}”`} tail="up" color={i === 0 ? "#E8F5E9" : K.yellow} size={38} style={{ left: 30, top: 110 }} />
            ))}
            {/* tally of answers */}
            <div style={{ position: "absolute", left: 30, top: 270, display: "flex", gap: 14 }}>
              {speak.map((a, i) => (
                <div key={i} style={{ width: 210, ...rise(f, a + 6) }}>
                  <div style={{ border: `4px solid ${K.ink}`, borderRadius: 14, background: i === 0 ? "#E8F5E9" : "#FFEBEE", padding: "10px 12px", textAlign: "center" }}>
                    <div style={{ fontWeight: 900, fontSize: 22 }}>{ROWS[i][0].split(" · ")[0]}</div>
                    <div style={{ fontFamily: K.head, fontSize: 40, color: i === 0 ? K.green : K.red }}>{i === 0 ? "● LIVE" : "31·10·22"}</div>
                  </div>
                </div>
              ))}
            </div>
          </Push>

          {/* ── 3 wow (M4): 42 of 44 went quiet; Mandir Marg = 6 weeks in 4 years ── */}
          <Push f={f} {...zone("wow", "compute")} top={ZT}>
            <SensorGrid f={f} left={30} top={10} at={start("wow")} quietAt={c.quiet} />
            <div style={{ position: "absolute", left: 600, top: 10, ...rise(f, c.fortyTwo, { scale: 0.5 }) }}>
              <div style={{ fontFamily: K.head, fontSize: 96, color: K.red, lineHeight: 1 }}>42 / 44</div>
              <div style={{ fontWeight: 900, fontSize: 26, color: K.muted }}>went quiet · Oct 2022</div>
            </div>
            <div style={{ position: "absolute", left: 600, top: 160, ...rise(f, c.only2) }}><Chip label="● only 2 still recording" color={K.green} size={30} /></div>
            {/* Mandir Marg's 4-year window: only the first ~6 weeks have readings */}
            <div style={{ position: "absolute", left: 30, top: 300, width: 940, ...rise(f, c.mandir) }}>
              <div style={{ fontWeight: 900, fontSize: 26, marginBottom: 8 }}>Mandir Marg · our four-year window (Sep 2022 → Sep 2026)</div>
              <div style={{ position: "relative", height: 70, border: `5px solid ${K.ink}`, borderRadius: 14, background: "#EEF1F5", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(45 / 1461) * 100 * sm(f, c.inside, 14)}%`, minWidth: f >= c.inside ? 14 : 0, background: K.green }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 20, color: K.muted, marginTop: 6 }}><span>Sep 2022</span><span>2023</span><span>2024</span><span>2025</span><span>Sep 2026</span></div>
            </div>
            <Bubble f={f} at={c.six} text="only ≈ 6 weeks of readings!" tail="left" color={K.yellow} size={30} style={{ left: 30, top: 252 }} />
          </Push>

          {/* ── 4 compute (M2): how full is the table? ── */}
          <Push f={f} {...zone("compute", "doubt1")} top={ZT}>
            <FillGrid f={f} left={20} top={0} at={c.fourYears} litAt={c.had} twoAt={c.two} />
            <div style={{ position: "absolute", left: 20, top: 440, display: "flex", gap: 16, alignItems: "center" }}>
              <Num f={f} at={c.sixtyFour} label="possible sensor-days" n={64284} color={K.muted} />
              <Num f={f} at={c.had} label="we had" n={3342} color={K.blue} />
              <div style={{ ...rise(f, c.think, { scale: 0.5 }) }}>
                {f < c.five ? (
                  <span style={{ fontFamily: K.head, fontSize: 96, color: "#FB8C00", display: "inline-block", transform: `scale(${1 + 0.06 * Math.sin(f / 3)})` }}>= ?</span>
                ) : (
                  <span style={{ fontFamily: K.head, fontSize: 96, color: K.red, display: "inline-block", ...rise(f, c.five, { scale: 0.4 }) }}>≈ 5%</span>
                )}
              </div>
            </div>
            <Burst f={f} at={c.five} x={830} y={490} color={K.red} />
            <div style={{ position: "absolute", left: 580, top: 380, ...rise(f, c.thirds) }}><Chip label="2 sensors ≈ two-thirds of it" color={K.ink} size={28} /></div>
          </Push>

          {/* ── 5 doubt ── */}
          <Push f={f} {...zone("doubt1", "slice")} top={ZT}>
            <div style={{ position: "absolute", left: 30, top: 10, ...rise(f, start("doubt1") + 4) }}><Chip label="🛠 fix the list first?" color={K.muted} size={32} /></div>
          </Push>

          {/* ── 6 slice (M5): one request end to end ── */}
          <Push f={f} {...zone("slice", "rkpuram")} top={ZT}>
            <div style={{ position: "absolute", left: 30, top: 0, ...rise(f, c.weeks) }}><Chip label="⏳ weeks of data work · 0 models" color={K.red} size={24} /></div>
            <div style={{ position: "absolute", left: 500, top: 0, ...rise(f, c.spring) }}><Chip label="🍃 a new Spring Boot service" color={K.green} size={24} /></div>
            <Layers f={f} left={30} top={70} at={c.fifty} sliceAt={c.one} doneAt={c.database} restAt={c.rest} />
            <div style={{ position: "absolute", left: 30, top: 380, display: "flex", alignItems: "center", gap: 10, ...rise(f, c.station) }}>
              {([["📡 1 station", c.station], ["🧹 data", c.data], ["🤖 model", c.model], ["📱 running app", c.app]] as [string, number][]).map(([t, a], i) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {i > 0 && <span style={{ fontFamily: K.head, fontSize: 40, opacity: sm(f, a, 6) }}>→</span>}
                  <span style={{ ...rise(f, a), display: "inline-block" }}><Chip label={t} color={i === 0 ? K.blue : K.ink} size={28} style={{ boxShadow: f >= a ? `0 0 0 5px ${K.yellow}` : undefined }} /></span>
                </div>
              ))}
            </div>
          </Push>

          {/* ── 7 rkpuram: same place, new sensor ── */}
          <Push f={f} {...zone("rkpuram", "catch")} top={ZT}>
            <div style={{ position: "absolute", left: 30, top: 0, ...rise(f, c.rkp) }}>
              <div style={{ fontFamily: K.head, fontSize: 60, color: "#fff", background: K.green, border: `5px solid ${K.ink}`, borderRadius: 16, padding: "4px 22px", boxShadow: `7px 7px 0 ${K.ink}` }}>⭐ R K PURAM</div>
            </div>
            <div style={{ position: "absolute", left: 480, top: 20, ...rise(f, c.same) }}><Chip label="same place · new sensor" color={K.ink} size={30} /></div>
            <SensorTimeline f={f} left={30} top={150} oldAt={c.old} newAt={c.nineteenth} liveAt={c.still} />
            <div style={{ position: "absolute", left: 560, top: 420, ...rise(f, c.fifteen) }}><Chip label="🔴 recording · every 15 min" color={K.red} size={28} /></div>
          </Push>

          {/* ── 8 catch: the honest cost ── */}
          <Push f={f} {...zone("catch", "recall")} top={ZT}>
            <div style={{ position: "absolute", left: 30, top: 0, width: 940, ...rise(f, c.year) }}>
              <div style={{ fontWeight: 900, fontSize: 26, marginBottom: 8 }}>19 Feb 2025 → 11 Sep 2026 · about a year and a half</div>
              <div style={{ position: "relative", height: 64, border: `5px solid ${K.ink}`, borderRadius: 14, background: "#E8F5E9", overflow: "hidden" }}>
                {/* winter Oct 2025 – Feb 2026 ≈ days 224–375 of 570 */}
                <div style={{ position: "absolute", left: `${(224 / 570) * 100}%`, width: `${(151 / 570) * 100 * sm(f, c.winter, 14)}%`, top: 0, bottom: 0, background: "#90CAF9" }} />
                <div style={{ position: "absolute", left: `${(224 / 570) * 100}%`, top: 10, paddingLeft: 12, fontWeight: 900, fontSize: 26, opacity: sm(f, c.winter + 8, 8) }}>❄️ one winter</div>
              </div>
            </div>
            <DelhiMap f={f} left={30} top={130} at={c.describe} othersAt={c.delhi} />
            <div style={{ position: "absolute", left: 480, top: 170, ...rise(f, c.deal) }}><Chip label="🤝 a deal we take on purpose" color={K.ink} size={30} /></div>
            <div style={{ position: "absolute", left: 480, top: 260, ...rise(f, c.widen) }}><Chip label="➕ more stations later · DAF-24" color={K.blue} size={30} /></div>
          </Push>

          {/* ── 9 recall ── */}
          <Push f={f} from={start("recall")} to={Infinity} top={ZT}>
            {([["check what sensors really do 🔍", c.rCheck, K.red], ["one thin slice, end to end 🍃", c.rSlice, K.green], ["R K Puram · 1 station · 1 winter ⭐", c.rRk, K.blue]] as [string, number, string][]).map(([t, a, col], i) => (
              <div key={t} style={{ position: "absolute", left: 30, top: 20 + i * 120, display: "flex", alignItems: "center", gap: 18, ...rise(f, a) }}>
                <span style={{ width: 70, height: 70, borderRadius: 35, background: col, color: "#fff", display: "grid", placeItems: "center", fontFamily: K.head, fontSize: 42, border: `4px solid ${K.ink}` }}>{i + 1}</span>
                <span style={{ fontWeight: 900, fontSize: 38 }}>{t}</span>
              </div>
            ))}
            <div style={{ position: "absolute", left: 30, top: 410, ...rise(f, c.next) }}><Chip label="NEXT → we download R K Puram" color={K.blue} size={32} /></div>
          </Push>
        </div>
      </Stage>

      {meta.titleCard && <TitleCard f={f} line={meta.titleCard.line} sub={meta.titleCard.sub} until={c.every} />}
      <DoubtLow f={f} from={start("doubt1")} to={end("doubt1")} text="Sir, then fix the list first, and download every station properly." mouth={mouth} />
      <KineticCaption f={f} />
    </AbsoluteFill>
  );
}

/** 44 sensor dots (11 × 4). At quietAt, 42 fade to grey row by row; 2 stay green and pulse. */
function SensorGrid({ f, left, top, at, quietAt }: { f: number; left: number; top: number; at: number; quietAt: number }) {
  const LIVE = new Set([0, 43]);
  return (
    <div style={{ position: "absolute", left, top, width: 540, height: 230 }}>
      {Array.from({ length: 44 }, (_, i) => {
        const x = (i % 11) * 48, y = Math.floor(i / 11) * 56;
        const p = sp(f, at + i * 0.6, { damping: 12 });
        const q = sm(f, quietAt + (i % 11) * 1.2, 8);
        const live = LIVE.has(i);
        const col = live ? K.green : q > 0.5 ? "#B0BAC6" : K.blue;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: 38, height: 38, borderRadius: 19, background: col, border: `3px solid ${K.ink}`, transform: `scale(${Math.min(1.1, p) * (live && f >= quietAt ? 1 + 0.12 * Math.sin(f / 4) : 1)})`, opacity: p > 0 ? 1 : 0, boxShadow: live && f >= quietAt ? `0 0 16px ${K.green}` : undefined }}>
            <div style={{ position: "absolute", left: 13, top: 13, width: 6, height: 6, borderRadius: 3, background: "#fff" }} />
          </div>
        );
      })}
    </div>
  );
}

function Num({ f, at, label, n, color }: { f: number; at: number; label: string; n: number; color: string }) {
  return (
    <div style={{ border: `5px solid ${K.ink}`, borderRadius: 16, background: "#fff", padding: "6px 16px", boxShadow: `6px 6px 0 ${K.ink}`, ...rise(f, at) }}>
      <div style={{ fontFamily: K.head, fontSize: 54, color, lineHeight: 1 }}><Count f={f} at={at} to={n} dur={22} /></div>
      <div style={{ fontWeight: 800, fontSize: 20, color: K.muted }}>{label}</div>
    </div>
  );
}

/** 44 sensors × 48 months. Lit like the real cached table: row 0 (New Delhi) all, row 43 (GK1) last 28, others month 0–1. */
function FillGrid({ f, left, top, at, litAt, twoAt }: { f: number; left: number; top: number; at: number; litAt: number; twoAt: number }) {
  const W = 19, H = 8, G = 1;
  const lit = (r: number, m: number) => (r === 0 ? true : r === 43 ? m >= 20 : m < 1.5 - (r % 3) * 0.5);
  const show = sm(f, at, 16);
  return (
    <div style={{ position: "absolute", left, top, width: 48 * (W + G), height: 44 * (H + G), opacity: show }}>
      <div style={{ position: "absolute", left: 0, top: -2, fontWeight: 900, fontSize: 20, color: K.muted, transform: "translateY(-100%)" }} />
      {Array.from({ length: 44 * 48 }, (_, k) => {
        const r = Math.floor(k / 48), m = k % 48;
        const on = lit(r, m) && Number.isFinite(litAt) && f >= litAt + m * 0.5;
        const two = (r === 0 || r === 43) && f >= twoAt;
        return <div key={k} style={{ position: "absolute", left: m * (W + G), top: r * (H + G), width: W, height: H, borderRadius: 2, background: on ? (two ? K.yellow : K.blue) : "#E3E8EF" }} />;
      })}
      <div style={{ position: "absolute", left: 0, top: 44 * (H + G) + 4, width: "100%", display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 18, color: K.muted }}>
        <span>44 sensors × 4 years (48 months)</span><span>Sep 2022 → Sep 2026</span>
      </div>
    </div>
  );
}

/** Three layers × 10 endpoints; one vertical slice lights top to bottom, then the rest fade in. */
function Layers({ f, left, top, at, sliceAt, doneAt, restAt }: { f: number; left: number; top: number; at: number; sliceAt: number; doneAt: number; restAt: number }) {
  const names = ["controller", "service", "database"];
  return (
    <div style={{ position: "absolute", left, top, ...rise(f, at) }}>
      {names.map((n, L) => (
        <div key={n} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ width: 150, fontWeight: 900, fontSize: 24 }}>{n}</div>
          {Array.from({ length: 10 }, (_, i) => {
            const isSlice = i === 0;
            const on = isSlice ? sm(f, sliceAt + L * 8, 8) : 0.25 + 0.75 * sm(f, restAt + i * 2, 8) * 0.5;
            return <div key={i} style={{ width: 66, height: 64, borderRadius: 10, border: `4px solid ${K.ink}`, background: isSlice ? `rgba(46,158,91,${on})` : `rgba(176,186,198,${on})`, boxShadow: isSlice && on > 0.5 ? `0 0 14px ${K.green}` : undefined }} />;
          })}
        </div>
      ))}
      <div style={{ position: "absolute", left: 184, top: -6, width: 44, height: 3 * 78 - 2, borderRadius: 14, border: `5px solid ${K.yellow}`, opacity: sm(f, doneAt, 8) }} />
      <div style={{ position: "absolute", left: 250, top: 3 * 78 - 4, ...rise(f, doneAt) }}><Chip label="✓ one request works, end to end" color={K.green} size={24} /></div>
    </div>
  );
}

/** R K Puram: old listed sensor Aug 2018 → Oct 2022 (stopped), new sensor Feb 2025 → now (recording). */
function SensorTimeline({ f, left, top, oldAt, newAt, liveAt }: { f: number; left: number; top: number; oldAt: number; newAt: number; liveAt: number }) {
  const W = 940, y0 = 2018 + 7 / 12, y1 = 2026 + 9 / 12;
  const x = (y: number) => ((y - y0) / (y1 - y0)) * W;
  const bar = (a: number, b: number, at: number, col: string, label: string, pulse: boolean, row: number) => {
    const p = sm(f, at, 16);
    return (
      <div style={{ position: "absolute", left: x(a), top: row * 110, opacity: p > 0 ? 1 : 0 }}>
        <div style={{ width: (x(b) - x(a)) * p, height: 54, background: col, border: `4px solid ${K.ink}`, borderRadius: 12, boxShadow: pulse ? `0 0 ${10 + 8 * Math.sin(f / 4)}px ${col}` : undefined }} />
        <div style={{ marginTop: 6, fontWeight: 900, fontSize: 22, whiteSpace: "nowrap", opacity: sm(f, at + 10, 8), transform: row === 1 ? "translateX(-62%)" : undefined }}>{label}</div>
      </div>
    );
  };
  return (
    <div style={{ position: "absolute", left, top, width: W, height: 260 }}>
      {bar(2018 + 7 / 12, 2022 + 10 / 12, oldAt, "#B0BAC6", "old sensor · Aug 2018 → 31 Oct 2022 · stopped", false, 0)}
      {bar(2025 + 1.6 / 12, y1, newAt, K.green, "new sensor · 19 Feb 2025 → still on", f >= liveAt, 1)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, borderTop: `3px solid ${K.ink}`, opacity: sm(f, oldAt, 8) }} />
      {[2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map((y) => (
        <div key={y} style={{ position: "absolute", left: x(y) - 30, top: 238, width: 60, textAlign: "center", fontWeight: 800, fontSize: 18, color: K.muted, opacity: sm(f, oldAt, 8) }}>{y}</div>
      ))}
    </div>
  );
}

/** A simple Delhi outline with station pins: R K Puram stays lit, the others grey out at othersAt. */
function DelhiMap({ f, left, top, at, othersAt }: { f: number; left: number; top: number; at: number; othersAt: number }) {
  const pins: [number, number, boolean][] = [[200, 230, true], [220, 120, false], [300, 150, false], [120, 170, false], [290, 260, false], [150, 300, false], [240, 330, false], [330, 90, false]];
  const grey = sm(f, othersAt, 10);
  return (
    <div style={{ position: "absolute", left, top, width: 420, height: 420, ...rise(f, at) }}>
      <svg width={420} height={420} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M 160 30 L 260 20 L 340 60 L 380 140 L 360 230 L 390 300 L 320 380 L 220 400 L 130 370 L 60 300 L 40 200 L 80 110 Z" fill="#F1F5F9" stroke={K.ink} strokeWidth={6} strokeLinejoin="round" />
      </svg>
      {pins.map(([x, y, rk], i) => (
        <div key={i} style={{ position: "absolute", left: x - 16, top: y - 16, width: 32, height: 32, borderRadius: 16, background: rk ? K.green : `rgba(176,186,198,${0.4 + 0.6 * grey})`, border: `4px solid ${rk ? K.ink : `rgba(17,17,17,${1 - 0.6 * grey})`}`, transform: `scale(${rk ? 1 + 0.15 * Math.sin(f / 4) : 1 - 0.3 * grey})`, boxShadow: rk ? `0 0 18px ${K.green}` : undefined }} />
      ))}
      <div style={{ position: "absolute", left: 140, top: 250, fontWeight: 900, fontSize: 22, background: "#fff", border: `3px solid ${K.ink}`, borderRadius: 10, padding: "2px 10px" }}>R K Puram</div>
      <div style={{ position: "absolute", left: 60, top: 400, opacity: interpolate(f, [othersAt, othersAt + 10], [0, 1], C_) }}><Chip label="not all of Delhi (yet)" color={K.muted} size={24} /></div>
    </div>
  );
}
