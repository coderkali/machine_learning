// DAF-02 · Video B — "What can the model see at 6 pm?" (claude/daf/episodes/daf_02/script_v2.md, audio approved 2026-10-05).
// Pinned-table layout: the same R K Puram table stays at the top; this video adds the 📥 INPUT column (PM2.5 until 17:00).
// Data: data/interim/daily_17_clean.csv (pm25_until_17), station_17_pm25_feb_2025_clean.csv (24 Feb hourly).
// Earlier layouts: v1_backup/. All text is HTML (SVG <text> shakes in renders).
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { enter, pop } from "../../shared/anim";
import { Asha } from "../../shared/daf/Cast";
import { DataTable, pmColor } from "../../shared/daf/DataTable";
import { Big, Clock, Divider, DoubtLow, TableTitle, Takeaways, Zone } from "../../shared/daf/Pinned";
import { HourBars } from "../../shared/daf/Req";
import { Stage, StageCaption } from "../../shared/daf/Stage";
import { live } from "../../shared/daf/ui";
import { Backdrop, ChapterBar, Chip, Header, K, TimelineProvider, TitleCard, useCues, useMouth, useTimeline } from "../../shared/explainer/kit";
import type { EpisodeMeta, Timeline } from "../../shared/types";

export const Day352: React.FC<{ timeline: Timeline; meta: EpisodeMeta }> = ({ timeline, meta }) => (
  <TimelineProvider value={timeline}><Scene meta={meta} /></TimelineProvider>
);

// date · today's full-day mean · PM2.5 until 17:00 · target (tomorrow's mean)
const ROWS: [string, number, number, number][] = [["22 Feb", 69.1, 69.8, 74.0], ["23 Feb", 74.0, 70.3, 101.2], ["24 Feb", 101.2, 102.7, 102.0], ["25 Feb", 102.0, 98.7, 118.2], ["26 Feb", 118.2, 114.3, 68.0]];
const FEB24 = [156, 180, 173, 122, 103, 83, 100, 128, 136, 117, 101, 79, 78, 63, 83, 61, 39, 46, 41, 47, 92, 113, 144, 143];
const ROW_H = 66;

const num = (v: number) => <span style={{ color: pmColor(v) }}>{v.toFixed(1)}</span>;

const Panel = ({ title, color, children, style }: { title: string; color: string; children?: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ position: "absolute", borderRadius: 18, border: `5px solid ${K.ink}`, background: "#fff", overflow: "hidden", boxShadow: `7px 7px 0 ${K.ink}`, ...style }}>
    <div style={{ background: color, color: "#fff", fontWeight: 900, fontSize: 30, padding: "10px 18px" }}>{title}</div>
    <div style={{ padding: 18 }}>{children}</div>
  </div>
);

function Scene({ meta }: { meta: EpisodeMeta }) {
  const f = useCurrentFrame();
  const tl = useTimeline();
  const { at, start, end } = useCues();
  const mouth = useMouth(f);

  const c = {
    answer: at("recap", "answer"), input: at("recap", "input"), allowed: at("recap", "allowed"),
    decides: at("six", "decides"), predict: at("six", "predict"),
    over: at("notover", "over"), readings: at("notover", "readings"), five: at("notover", "five"), rest: at("notover", "rest"),
    exist: at("answer1", "exist"), table: at("answer1", "table"), brilliant: at("answer1", "brilliant"), real: at("answer1", "real"), missing: at("answer1", "missing"), fails: at("answer1", "fails"),
    use: at("rule", "Use"), rInput: at("rule", "input"), feb24: at("rule", "twenty-fourth"), known: at("rule", "Known"),
    weather: at("weather", "weather"), actual: at("weather", "actual"), forecast: at("weather", "forecast"),
    predicts: at("recall", "predicts"), uses: at("recall", "uses"), next: at("recall", "Next"),
  };
  const chapters = (meta.chapters ?? []).map((ch) => ({ label: ch.label, from: start(ch.beat) }));
  const zone = (a: string, b: string) => live(f, start(a), start(b));
  const locked = f >= c.missing;

  return (
    <AbsoluteFill style={{ fontFamily: K.ui, overflow: "hidden" }}>
      <Audio src={staticFile(tl.audio)} />
      <Backdrop />
      <Header f={f} day={meta.day} title={meta.title} badge={meta.badge} />
      <ChapterBar f={f} chapters={chapters} />
      <Stage f={f} tab="📊 R K Puram · daily data">
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${3 * Math.sin(f / 9)}px)` }}>
          {/* ── the pinned table ── */}
          <TableTitle f={f} at={2} text="R K Puram, Delhi · one row = one day" />
          <DataTable f={f} size={34} rowH={ROW_H} style={{ left: 20, top: 56, width: 960 }}
            cols={[
              { key: "d", label: "date", w: 170, at: 2 },
              { key: "m", label: locked ? "full-day mean 🔒 not at 6 pm" : "today's full-day mean", w: 270, color: locked ? K.red : K.blue, at: 2 },
              { key: "x", label: f >= c.rInput ? "📥 INPUT · until 17:00" : "📥 INPUT ?", w: 270, color: K.green, at: c.input, fill: (r) => c.input + 4 + r * 3 },
              { key: "t", label: "🎯 TARGET", w: 250, color: K.purple, at: 2 },
            ]}
            rows={ROWS} rowAt={(r) => 4 + r * 3}
            hi={(r) => (ROWS[r][0] === "24 Feb" && ((f >= start("notover") && f < start("weather")) || f >= c.feb24) ? "#FFF8E1" : null)}
            fmt={(v, ci, r) => {
              if (ci === 0) return v;
              if (ci === 1) return <span style={{ opacity: locked ? 0.45 : 1 }}>{num(v as number)}</span>;
              if (ci === 2) {
                const at2 = c.rInput + r * 6;
                if (f < at2) return <span style={{ color: K.muted }}>?</span>;
                return <span style={{ display: "inline-block", transform: `scale(${1 + 0.3 * (1 - enter(f, at2, 10))})` }}>{num(v as number)}</span>;
              }
              return num(v as number);
            }} />
          <Divider />

          {/* ── recap ── */}
          <Zone show={zone("recap", "six")}>
            <div style={{ position: "absolute", left: 30, top: 20, ...pop(f, c.answer) }}><Chip label="✓ last time: the 🎯 TARGET column" color={K.purple} size={34} /></div>
            <Big f={f} at={c.input} text="NOW THE MODEL NEEDS AN INPUT 📥" color={K.green} size={54} style={{ left: 30, top: 130 }} />
            <div style={{ position: "absolute", left: 30, top: 300, ...pop(f, c.allowed) }}><Chip label="which numbers is it allowed to see? 👀" color={K.ink} size={36} /></div>
          </Zone>

          {/* ── six: Asha decides at 6 pm ── */}
          <Zone show={zone("six", "notover")}>
            <div style={{ position: "absolute", left: 30, top: 10, ...pop(f, start("six")) }}><Asha height={300} /></div>
            <div style={{ position: "absolute", left: 230, top: 50, ...pop(f, c.decides) }}><Clock f={f} size={170} /></div>
            <div style={{ position: "absolute", left: 450, top: 60, display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start" }}>
              <span style={pop(f, c.decides)}><Chip label="Asha decides at 6 pm" color={K.blue} size={34} /></span>
              <span style={pop(f, c.predict)}><Chip label="🤖 so the model predicts at 6 pm" color={K.ink} size={34} /></span>
            </div>
          </Zone>

          {/* ── notover: today stops at 17:00 ── */}
          <Zone show={zone("notover", "doubt1")}>
            <div style={{ position: "absolute", left: 30, top: 0, ...pop(f, c.over) }}><Chip label="today · 24 Feb 2025 · every hour" color={K.ink} size={28} /></div>
            <div style={{ position: "absolute", left: 40, top: 70 }}>
              <HourBars f={f} values={FEB24} start={c.over} step={1} w={920} h={300} greyFrom={f >= c.five ? 17 : 99} />
            </div>
            <div style={{ position: "absolute", left: 40 + (920 / 24) * 17 - 3, top: 50, height: 330, borderLeft: `7px solid ${K.ink}`, opacity: enter(f, c.five) }} />
            <div style={{ position: "absolute", left: 40 + (920 / 24) * 17 - 60, top: 20, fontFamily: K.head, fontSize: 30, opacity: enter(f, c.five) }}>18:00</div>
            <div style={{ position: "absolute", left: 30, top: 420, display: "flex", gap: 16 }}>
              <span style={pop(f, c.five)}><Chip label="✓ known: up to 5 pm" color={K.blue} size={32} /></span>
              <span style={pop(f, c.rest)}><Chip label="? not happened yet" color={K.muted} size={32} /></span>
            </div>
          </Zone>

          {/* ── answer1: in the table vs in real life ── */}
          <Zone show={live(f, start("answer1"), start("rule"))}>
            <Panel title="📓 in our table" color="#F57C00" style={{ left: 20, top: 10, width: 460, height: 330, ...pop(f, c.table) }}>
              <div style={{ fontWeight: 800, fontSize: 26, color: K.muted }}>24 Feb · full-day mean</div>
              <div style={{ fontFamily: K.head, fontSize: 90 }}>101.2</div>
              <div style={{ marginTop: 8, ...pop(f, c.brilliant) }}><Chip label="✨ model looks brilliant" color={K.green} size={28} /></div>
            </Panel>
            <Panel title="🕕 real life · 6 pm" color={K.ink} style={{ left: 520, top: 10, width: 460, height: 330, ...pop(f, c.real) }}>
              <div style={{ fontWeight: 800, fontSize: 26, color: K.muted }}>24 Feb · full-day mean</div>
              <div style={{ fontFamily: K.head, fontSize: 90, color: K.red, ...pop(f, c.missing) }}>? missing</div>
              <div style={{ marginTop: 8, ...pop(f, c.fails) }}><Chip label="💥 model fails" color={K.red} size={28} /></div>
            </Panel>
            <div style={{ position: "absolute", left: 30, top: 380, ...pop(f, c.missing + 6) }}><Chip label="⬆ that's why the blue column is locked 🔒" color={K.red} size={30} /></div>
          </Zone>

          {/* ── rule: only what exists at prediction time → the INPUT column ── */}
          <Zone show={zone("rule", "weather")}>
            <Big f={f} at={c.use} text="USE ONLY WHAT EXISTS AT 6 PM" color={K.ink} size={60} style={{ left: 30, top: 20 }} />
            <div style={{ position: "absolute", left: 30, top: 170, ...pop(f, c.rInput) }}><Chip label="⬆ green column = average up to 5 pm" color={K.green} size={34} /></div>
            <div style={{ position: "absolute", left: 30, top: 270, ...pop(f, c.feb24) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 22px", borderRadius: 16, border: `5px solid ${K.green}`, background: "#E8F5E9" }}>
                <span style={{ fontWeight: 900, fontSize: 36 }}>24 Feb · until 5 pm =</span>
                <span style={{ fontFamily: K.head, fontSize: 64, color: "#E65100" }}>102.7</span>
                <span style={{ ...pop(f, c.known), fontWeight: 900, fontSize: 30, color: K.green }}>✓ known at 6 pm</span>
              </div>
            </div>
          </Zone>

          {/* ── weather: actual unknown, forecast allowed ── */}
          <Zone show={zone("weather", "recall")}>
            <div style={{ position: "absolute", left: 20, top: 30, width: 460, ...pop(f, c.actual) }}>
              <div style={{ borderRadius: 18, border: `5px solid ${K.red}`, background: "#FFEBEE", padding: 22 }}>
                <div style={{ fontSize: 80 }}>🌦️🔒</div>
                <div style={{ fontWeight: 900, fontSize: 34 }}>tomorrow's ACTUAL weather</div>
                <div style={{ fontWeight: 900, fontSize: 30, color: K.red, marginTop: 6 }}>✗ cannot know at 6 pm</div>
              </div>
            </div>
            <div style={{ position: "absolute", left: 520, top: 30, width: 460, ...pop(f, c.forecast) }}>
              <div style={{ borderRadius: 18, border: `5px solid ${K.green}`, background: "#E8F5E9", padding: 22 }}>
                <div style={{ fontSize: 80 }}>📡✓</div>
                <div style={{ fontWeight: 900, fontSize: 34 }}>tomorrow's weather FORECAST</div>
                <div style={{ fontWeight: 900, fontSize: 30, color: K.green, marginTop: 6 }}>✓ exists at 6 pm</div>
              </div>
            </div>
          </Zone>

          {/* ── recall ── */}
          <Zone show={live(f, start("recall"), Infinity)}>
            <Takeaways f={f} items={[["the model predicts at 6 pm", c.predicts, K.blue], ["it uses only what exists at 6 pm", c.uses, K.green]]} />
            <div style={{ position: "absolute", left: 30, top: 300, ...pop(f, c.next) }}><Chip label="NEXT · how do we know the model is good? 📏" color={K.ink} size={34} /></div>
          </Zone>
        </div>
      </Stage>

      {meta.titleCard && <TitleCard f={f} line={meta.titleCard.line} sub={meta.titleCard.sub} until={c.answer} />}
      <DoubtLow f={f} from={start("doubt1")} to={end("doubt1")} text="Sir, but today's full average is the best clue. Why can't I use it?" mouth={mouth} />
      <StageCaption f={f} />
    </AbsoluteFill>
  );
}
