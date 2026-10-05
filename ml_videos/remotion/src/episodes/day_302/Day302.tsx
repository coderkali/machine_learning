// DAF-02 · Video A — "What exactly do we predict?" (claude/daf/episodes/daf_02/script_v2.md, audio approved 2026-10-05).
// Pinned-table layout: the real R K Puram table stays at the top; this video adds the 🎯 TARGET column.
// Data: data/interim/daily_17_clean.csv (daily rows), station_17_pm25_feb_2025_clean.csv (24 Feb hourly).
// Earlier layouts: v1_backup/. All text is HTML (SVG <text> shakes in renders).
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { enter, pop } from "../../shared/anim";
import { DataTable, pmColor } from "../../shared/daf/DataTable";
import { Big, Divider, DoubtLow, TableTitle, Takeaways, Zone } from "../../shared/daf/Pinned";
import { HourBars } from "../../shared/daf/Req";
import { Stage, StageCaption } from "../../shared/daf/Stage";
import { CPCB, live } from "../../shared/daf/ui";
import { DevMascot } from "../../shared/DevMascot";
import { Backdrop, ChapterBar, Chip, Header, K, TimelineProvider, TitleCard, useCues, useMouth, useTimeline } from "../../shared/explainer/kit";
import type { EpisodeMeta, Timeline } from "../../shared/types";

export const Day302: React.FC<{ timeline: Timeline; meta: EpisodeMeta }> = ({ timeline, meta }) => (
  <TimelineProvider value={timeline}><Scene meta={meta} /></TimelineProvider>
);

type Row = [string, number | null, number, number | null];
// date · daily mean · hours · target (tomorrow's mean)
const FEB: Row[] = [["22 Feb", 69.1, 24, 74.0], ["23 Feb", 74.0, 24, 101.2], ["24 Feb", 101.2, 24, 102.0], ["25 Feb", 102.0, 24, 118.2], ["26 Feb", 118.2, 24, 68.0]];
const MAR: Row[] = [["28 Feb", 56.9, 24, 59.2], ["1 Mar", 59.2, 23, null], ["2 Mar", null, 0, null], ["3 Mar", 54.0, 14, 49.8], ["4 Mar", 49.8, 24, 28.9]];
const FEB24 = [156, 180, 173, 122, 103, 83, 100, 128, 136, 117, 101, 79, 78, 63, 83, 61, 39, 46, 41, 47, 92, 113, 144, 143];
const ROW_H = 66;

const num = (v: number | null) => (v == null ? <span style={{ color: K.muted }}>—</span> : <span style={{ color: pmColor(v) }}>{v.toFixed(1)}</span>);

function Scene({ meta }: { meta: EpisodeMeta }) {
  const f = useCurrentFrame();
  const tl = useTimeline();
  const { at, start, end } = useCues();
  const mouth = useMouth(f);
  const rishi = f >= start("doubt1") && f < end("doubt1");

  const c = {
    question: at("hook", "question"), what: at("hook", "What"),
    real: at("data", "real"), sensor: at("data", "sensor"), row: at("data", "row"), column: at("data", "column"),
    aNumber: at("number", "number"), tomorrowN: at("number", "Tomorrow's"),
    hides: at("answer1", "hides"), look: at("answer1", "Look"), n92: at("answer1", "Ninety-two"), n397: at("answer1", "ninety-seven"), unsafe: at("answer1", "unsafe"), bad: at("answer1", "bad"), dangerous: at("answer1", "dangerous"), keeps: at("answer1", "keeps"), table: at("answer1", "table"),
    exactly: at("tomorrow", "exactly"), midnight: at("tomorrow", "midnight"), indian: at("tomorrow", "Indian"), bands: at("tomorrow", "bands"), fullday: at("tomorrow", "full-day"),
    take: at("shift", "take"), move: at("shift", "move"), answer: at("shift", "answer"), target: at("shift", "target"),
    catch: at("rule", "catch"), sensors: at("rule", "Sensors"), second: at("rule", "second"), nothing: at("rule", "nothing"), rule: at("rule", "rule"), eighteen: at("rule", "eighteen"), drop: at("rule", "drop"),
    rNumber: at("recall", "number"), rFull: at("recall", "full-day"), rEnough: at("recall", "enough"), next: at("recall", "Next"),
  };
  const chapters = (meta.chapters ?? []).map((ch) => ({ label: ch.label, from: start(ch.beat) }));
  const zone = (a: string, b: string) => live(f, start(a), start(b));
  const march = live(f, c.catch, start("recall"));
  const hoursOn = c.catch;

  const table = (rows: Row[], show: number, isMarch: boolean) => (
    <div style={{ opacity: show }}>
      <DataTable f={f} size={36} rowH={ROW_H} style={{ left: 20, top: 56, width: 960 }}
        cols={[
          { key: "d", label: "date", w: 200, at: c.what },
          { key: "m", label: "daily mean PM2.5", w: isMarch ? 280 : 360, color: K.blue, at: c.what, fill: (r) => (isMarch ? c.catch + 4 + r * 3 : c.real + 4 + r * 4) },
          ...(isMarch ? [{ key: "h", label: "hours", w: 150, color: K.muted, at: hoursOn, fill: (r: number) => c.catch + 4 + r * 3 }] : []),
          { key: "t", label: f >= c.aNumber ? "🎯 TARGET · tomorrow's mean" : "🎯 ?", w: isMarch ? 330 : 400, color: K.purple, at: c.what, fill: (r) => (isMarch ? c.catch + 4 + r * 3 : c.aNumber + r * 3) },
        ]}
        rows={isMarch ? rows : rows.map((x) => [x[0], x[1], x[3]])}
        rowAt={(r) => (isMarch ? c.catch + 2 + r * 3 : c.real + 2 + r * 4)}
        hi={(r) => {
          const d = rows[r][0];
          if (isMarch) return rows[r][2] < 18 && f >= c.second ? "#FFF3E0" : null;
          if (d === "24 Feb" && f >= start("tomorrow") && f < start("shift")) return "#FFF8E1";
          if (d === "23 Feb" && f >= c.move + 14 && f < start("rule")) return "#EDE7F6";
          return null;
        }}
        strikeAt={(r) => (isMarch && rows[r][2] < 18 ? c.drop + r * 2 : Infinity)}
        fmt={(v, ci, r) => {
          if (ci === 0) return v;
          if (ci === 1) return num(v as number | null);
          if (isMarch && ci === 2) return <span style={{ color: (v as number) < 18 ? K.red : K.ink }}>{v} h</span>;
          // target: "?" until the shift, then each value slides up from the row below
          if (!isMarch && f < c.move + r * 7) return <span style={{ color: K.muted, opacity: f >= c.aNumber ? 1 : 0.5 }}>?</span>;
          const up = isMarch ? 0 : 1 - enter(f, c.move + r * 7, 12);
          return <span style={{ display: "inline-block", transform: `translateY(${ROW_H * up}px)` }}>{v == null ? num(null) : <span style={{ color: pmColor(v as number) }}>↑ {(v as number).toFixed(1)}</span>}</span>;
        }} />
    </div>
  );

  return (
    <AbsoluteFill style={{ fontFamily: K.ui, overflow: "hidden" }}>
      <Audio src={staticFile(tl.audio)} />
      <Backdrop />
      <Header f={f} day={meta.day} title={meta.title} badge={meta.badge} />
      <ChapterBar f={f} chapters={chapters} />
      <Stage f={f} tab="📊 R K Puram · daily data">
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${3 * Math.sin(f / 9)}px)` }}>
          {/* ── the pinned table ── */}
          <TableTitle f={f} at={c.what} text={march > 0.5 ? "R K Puram · sensors go down in March" : "R K Puram, Delhi · one row = one day"} color={march > 0.5 ? K.red : K.ink} />
          {table(FEB, 1 - march, false)}
          {table(MAR, march, true)}
          <Divider />

          {/* ── hook ── */}
          <Zone show={zone("hook", "data")}>
            <Big f={f} at={c.question} text="WHAT EXACTLY ARE WE PREDICTING?" color={K.purple} size={60} style={{ left: 30, top: 60 }} />
            <div style={{ position: "absolute", left: 640, top: 280, ...pop(f, c.what) }}><div style={{ fontSize: 130, transform: `rotate(${10 * Math.sin(f / 6)}deg)` }}>🎯</div></div>
          </Zone>

          {/* ── data: real sensor, one row per day, the daily mean ── */}
          <Zone show={zone("data", "number")}>
            <div style={{ position: "absolute", left: 30, top: 20, ...pop(f, c.sensor) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 24px", borderRadius: 18, border: `5px solid ${K.ink}`, background: "#fff", boxShadow: `7px 7px 0 ${K.ink}` }}>
                <span style={{ fontSize: 70 }}>📡</span>
                <span style={{ fontWeight: 900, fontSize: 38 }}>1 sensor · R K Puram, Delhi</span>
              </div>
            </div>
            <div style={{ position: "absolute", left: 30, top: 190, ...pop(f, c.row) }}><Chip label="⬆ 1 row = 1 day" color={K.ink} size={40} /></div>
            <div style={{ position: "absolute", left: 30, top: 300, ...pop(f, c.column) }}><Chip label="⬆ blue column = that day's average PM2.5 (µg/m³)" color={K.blue} size={34} /></div>
          </Zone>

          {/* ── number ── */}
          <Zone show={zone("number", "doubt1")}>
            <Big f={f} at={c.aNumber} text="THE MODEL PREDICTS A NUMBER" color={K.purple} size={58} style={{ left: 30, top: 40 }} />
            <div style={{ position: "absolute", left: 30, top: 220, ...pop(f, c.tomorrowN) }}>
              <div style={{ fontFamily: K.mono, fontWeight: 900, fontSize: 64 }}>tomorrow's PM2.5 = <span style={{ color: K.purple }}>?</span></div>
            </div>
            <div style={{ position: "absolute", left: 30, top: 340, ...pop(f, c.tomorrowN + 10) }}><Chip label="⬆ that is the new purple column" color={K.purple} size={32} /></div>
          </Zone>

          {/* ── answer1: a category hides information (two real days) ── */}
          <Zone show={live(f, start("answer1"), start("tomorrow"))}>
            {[["27 Mar 2025", 92.6, c.n92, c.bad, "Poor · bad", "#FB8C00"], ["13 Dec 2025", 397.4, c.n397, c.dangerous, "Severe · dangerous", "#7B1F1F"]].map(([d, v, a, la, lab, col], i) => (
              <div key={d as string} style={{ position: "absolute", left: 30, top: 10 + i * 150, ...pop(f, a as number) }}>
                <div style={{ display: "flex", alignItems: "center", gap: 18, fontWeight: 900, fontSize: 34 }}>
                  <span style={{ width: 230 }}>{d as string}</span>
                  <span style={{ fontFamily: K.mono, color: col as string, width: 140 }}>{(v as number).toFixed(1)}</span>
                  <span style={{ ...pop(f, c.unsafe), background: "#ECEFF1", border: `3px dashed ${K.muted}`, padding: "2px 14px", borderRadius: 8, color: K.muted }}>UNSAFE</span>
                  <span style={{ ...pop(f, la as number), color: col as string, fontSize: 28 }}>{lab as string}</span>
                </div>
                <div style={{ marginTop: 10, height: 40, width: ((v as number) / 400) * 920 * enter(f, la as number, 16), background: col as string, borderRadius: 10, border: `4px solid ${K.ink}` }} />
              </div>
            ))}
            <div style={{ position: "absolute", left: 30, top: 320, ...pop(f, c.keeps) }}><Chip label="✓ the number keeps the difference" color={K.green} size={34} /></div>
            <div style={{ position: "absolute", left: 30, top: 400, display: "flex", gap: 4, ...pop(f, c.table) }}>
              {CPCB.map((b) => <div key={b.name} style={{ width: 150, padding: "8px 6px", background: b.color, color: "#fff", fontWeight: 900, fontSize: 18, textAlign: "center", borderRadius: 6 }}>{b.name}<br />{b.band}</div>)}
            </div>
          </Zone>

          {/* ── tomorrow: the full-day average of one real day ── */}
          <Zone show={zone("tomorrow", "shift")}>
            <div style={{ position: "absolute", left: 30, top: 0, ...pop(f, c.exactly) }}><Chip label="24 Feb 2025 · every hour, 00:00 → 23:59 Indian time" color={K.ink} size={28} /></div>
            <div style={{ position: "absolute", left: 40, top: 70 }}>
              <HourBars f={f} values={FEB24} start={c.midnight} step={1.2} w={920} h={290} line={101.2} />
            </div>
            <div style={{ position: "absolute", left: 30, top: 410, ...pop(f, c.fullday) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontFamily: K.head, fontSize: 48, color: "#fff", background: K.ink, padding: "4px 18px", borderRadius: 10 }}>FULL-DAY AVERAGE = 101.2</span>
                <Chip label="⬆ same as the table" color="#FB8C00" size={28} />
              </div>
            </div>
          </Zone>

          {/* ── shift: tomorrow's average moves up one row → TARGET ── */}
          <Zone show={zone("shift", "rule")}>
            <div style={{ position: "absolute", left: 30, top: 20, ...pop(f, c.take) }}>
              <div style={{ fontWeight: 900, fontSize: 40, lineHeight: 1.3 }}>
                23 Feb's answer = 24 Feb's average <span style={{ color: "#E65100" }}>101.2</span>
              </div>
            </div>
            <div style={{ position: "absolute", left: 60, top: 110, ...pop(f, c.move) }}><div style={{ fontSize: 120, lineHeight: 1, color: K.purple, transform: `translateY(${-14 * Math.abs(Math.sin(f / 6))}px)` }}>↑</div></div>
            <div style={{ position: "absolute", left: 190, top: 150, ...pop(f, c.move) }}><Chip label="every value moves UP one row" color={K.purple} size={36} /></div>
            <div style={{ position: "absolute", left: 30, top: 270, ...pop(f, c.answer) }}><Chip label="each day now has its answer next to it" color={K.ink} size={32} /></div>
            <Big f={f} at={c.target} text="= THE TARGET COLUMN 🎯" color={K.purple} size={60} style={{ left: 30, top: 360 }} />
          </Zone>

          {/* ── rule: sensors go down → the 18-hour rule ── */}
          <Zone show={zone("rule", "recall")}>
            <div style={{ position: "absolute", left: 30, top: 0, ...pop(f, c.second) }}><Chip label="2 Mar 2025 · readings per hour" color={K.red} size={28} /></div>
            <div style={{ position: "absolute", left: 30, top: 60, width: 940, display: "flex", gap: 4 }}>
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 70, borderRadius: 6, border: `3px dashed ${K.muted}`, background: "#fff", ...pop(f, c.second + i) }} />
              ))}
            </div>
            <div style={{ position: "absolute", left: 30, top: 150, ...pop(f, c.nothing) }}><Chip label="0 of 24 hours — nothing at all" color={K.red} size={32} /></div>
            <Big f={f} at={c.eighteen} text="A DAY COUNTS ONLY WITH ≥ 18 HOURS" color="#00897B" size={46} style={{ left: 30, top: 240 }} />
            <div style={{ position: "absolute", left: 30, top: 370, ...pop(f, c.drop + 8) }}><Chip label="✂ 2 Mar (0 h) and 3 Mar (14 h) are dropped" color={K.ink} size={30} /></div>
            <div style={{ position: "absolute", left: 30, top: 440, ...pop(f, c.drop + 18) }}><Chip label="1 Mar loses its target too — its tomorrow has no data" color={K.muted} size={26} /></div>
          </Zone>

          {/* ── recall ── */}
          <Zone show={live(f, start("recall"), Infinity)}>
            <Takeaways f={f} items={[["we predict a NUMBER", c.rNumber, K.purple], ["tomorrow's FULL-DAY average", c.rFull, K.blue], ["only days with ≥ 18 hours", c.rEnough, "#00897B"]]} />
            <div style={{ position: "absolute", left: 30, top: 400, ...pop(f, c.next) }}><Chip label="NEXT · what can the model see at 6 pm? 🕕" color={K.ink} size={34} /></div>
          </Zone>
        </div>
      </Stage>

      {meta.titleCard && <TitleCard f={f} line={meta.titleCard.line} sub={meta.titleCard.sub} until={c.question} />}
      <div style={{ position: "absolute", left: 0, top: 2100, ...pop(f, 2) }}>
        <DevMascot height={620} pose="present" mouth={rishi ? 0 : mouth} />
      </div>
      <DoubtLow f={f} from={start("doubt1")} to={end("doubt1")} text="Sir, Asha only needs inside or outside. Why not just predict safe or unsafe?" mouth={mouth} />
      <StageCaption f={f} />
    </AbsoluteFill>
  );
}
