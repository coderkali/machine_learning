// DAF-02 · Video C — "How do we know it's good?" (claude/daf/episodes/daf_02/script_v2.md, audio approved 2026-10-05).
// Pinned-table layout: real R K Puram days 21–26 Feb 2025; this video adds 👥 PERSISTENCE (= yesterday), ❌ ERROR (MAE 18.6)
// and CAUGHT? (Poor-day recall 2 of 3). Train/test cut from DAF-06 (1 Mar 2026: 323 / 164 days).
// All text is HTML (SVG <text> shakes in renders); SVG only for lines.
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { draw, enter, pop } from "../../shared/anim";
import { Asha } from "../../shared/daf/Cast";
import { DataTable, pmColor } from "../../shared/daf/DataTable";
import { Big, Divider, DoubtLow, TableTitle, Takeaways, Zone } from "../../shared/daf/Pinned";
import { Stage, StageCaption } from "../../shared/daf/Stage";
import { live, Strike } from "../../shared/daf/ui";
import { Backdrop, ChapterBar, Chip, Header, K, TimelineProvider, TitleCard, useCues, useMouth, useTimeline } from "../../shared/explainer/kit";
import type { EpisodeMeta, Timeline } from "../../shared/types";

export const Day402: React.FC<{ timeline: Timeline; meta: EpisodeMeta }> = ({ timeline, meta }) => (
  <TimelineProvider value={timeline}><Scene meta={meta} /></TimelineProvider>
);

const DAYS = ["20 Feb", "21 Feb", "22 Feb", "23 Feb", "24 Feb", "25 Feb", "26 Feb"];
const ACTUAL = [49.4, 90.4, 69.1, 74.0, 101.2, 102.0, 118.2];
// rows 21–26 Feb: date · actual · persistence (= yesterday) · error · caught?
const ROWS = [1, 2, 3, 4, 5, 6].map((i) => {
  const a = ACTUAL[i], g = ACTUAL[i - 1];
  return [DAYS[i], a, g, Math.abs(a - g), a >= 91 ? (g >= 91 ? "✓" : "✗") : ""] as [string, number, number, number, string];
});
const MAE = ROWS.reduce((s, r) => s + r[3], 0) / ROWS.length; // 18.6
const ROW_H = 58;

const num = (v: number) => <span style={{ color: pmColor(v) }}>{v.toFixed(1)}</span>;

function Scene({ meta }: { meta: EpisodeMeta }) {
  const f = useCurrentFrame();
  const tl = useTimeline();
  const { at, start, end } = useCues();
  const mouth = useMouth(f);

  const c = {
    input: at("recap", "input"), answer: at("recap", "answer"), good: at("recap", "good"),
    accurate: at("rival", "accurate"), compared: at("rival", "compared"), rival: at("rival", "rival"),
    tomorrow: at("persistence", "Tomorrow"), persistence: at("persistence", "persistence"), column: at("persistence", "column"), copies: at("persistence", "copies"),
    servers: at("answer1", "servers"), maintenance: at("answer1", "maintenance"), trust: at("answer1", "trust"), beat: at("answer1", "beat"), better: at("answer1", "better"),
    far: at("mae", "far"), error: at("mae", "error"), d21: at("mae", "twenty-first"), d23: at("mae", "twenty-third"), average: at("mae", "average"), mae: at("mae", "MAE"), e186: at("mae", "eighteen"),
    same: at("catch", "same"), missing: at("catch", "missing"), count: at("catch", "count"), two: at("catch", "two"), recall: at("catch", "recall"),
    goal: at("goal", "goal"), ten: at("goal", "ten"), catching: at("goal", "catching"), test: at("goal", "test"), never: at("goal", "never"),
    rRival: at("recall", "rival"), rMae: at("recall", "MAE"), rRecall: at("recall", "Recall"),
  };
  const chapters = (meta.chapters ?? []).map((ch) => ({ label: ch.label, from: start(ch.beat) }));
  const zone = (a: string, b: string) => live(f, start(a), start(b));

  // persistence chart (zone): actual vs yesterday copied, 20–26 Feb
  const GW = 560, GH = 230, px = (i: number) => 20 + (i * (GW - 40)) / 6, py = (v: number) => GH - (v / 130) * GH;
  const pathOf = (vals: number[], from = 0) => vals.map((v, i) => `${i ? "L" : "M"}${px(i + from)} ${py(v)}`).join(" ");

  return (
    <AbsoluteFill style={{ fontFamily: K.ui, overflow: "hidden" }}>
      <Audio src={staticFile(tl.audio)} />
      <Backdrop />
      <Header f={f} day={meta.day} title={meta.title} badge={meta.badge} />
      <ChapterBar f={f} chapters={chapters} />
      <Stage f={f} tab="📊 R K Puram · how good is a forecast?">
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${3 * Math.sin(f / 9)}px)` }}>
          {/* ── the pinned table ── */}
          <TableTitle f={f} at={2} text="R K Puram · each day's real answer (Feb 2025)" />
          <DataTable f={f} size={32} rowH={ROW_H} style={{ left: 20, top: 56, width: 960 }}
            cols={[
              { key: "d", label: "day", w: 160, at: 2 },
              { key: "a", label: "🎯 actual PM2.5", w: 210, color: K.purple, at: 2 },
              { key: "p", label: f >= c.persistence ? "👥 persistence = yesterday" : "👥 ?", w: 260, color: "#7C8A9C", at: c.tomorrow, fill: (r) => c.copies + r * 6 },
              { key: "e", label: "❌ error", w: 170, color: K.red, at: c.error, fill: (r) => c.error + 6 + r * 5 },
              { key: "k", label: "Poor caught?", w: 160, color: "#FB8C00", at: c.count, fill: (r) => c.count + 6 + r * 4 },
            ]}
            rows={ROWS} rowAt={(r) => 4 + r * 3}
            hi={(r) => {
              const d = ROWS[r][0];
              if ((d === "21 Feb" && f >= c.d21 && f < c.d23) || (d === "23 Feb" && f >= c.d23 && f < c.average)) return "#FFEBEE";
              if (ROWS[r][1] >= 91 && f >= c.missing && f < start("goal")) return "#FFF3E0";
              return null;
            }}
            fmt={(v, ci, r) => {
              if (ci === 0) return v;
              if (ci === 1) return num(v as number);
              if (ci === 2) {
                const down = 1 - enter(f, c.copies + r * 6, 12);
                return <span style={{ display: "inline-block", color: "#7C8A9C", transform: `translateY(${-ROW_H * down}px)` }}>↘ {(v as number).toFixed(1)}</span>;
              }
              if (ci === 3) return <span style={{ color: K.red }}>{(v as number).toFixed(1)}</span>;
              return <span style={{ color: v === "✓" ? K.green : K.red, fontSize: 38 }}>{v as string}</span>;
            }} />
          <Divider />

          {/* ── recap ── */}
          <Zone show={zone("recap", "rival")}>
            <div style={{ position: "absolute", left: 30, top: 20, display: "flex", gap: 16 }}>
              <span style={pop(f, c.input)}><Chip label="📥 input ✓" color={K.green} size={34} /></span>
              <span style={pop(f, c.answer)}><Chip label="🎯 answer ✓" color={K.purple} size={34} /></span>
            </div>
            <Big f={f} at={c.good} text="IS THE MODEL GOOD? 🤔" color={K.ink} size={66} style={{ left: 30, top: 150 }} />
          </Zone>

          {/* ── rival ── */}
          <Zone show={zone("rival", "persistence")}>
            <div style={{ position: "absolute", left: 30, top: 20, ...pop(f, c.accurate) }}>
              <div style={{ position: "relative", padding: "20px 30px", borderRadius: 30, background: "#fff", border: `6px solid ${K.ink}`, fontFamily: K.head, fontSize: 56 }}>
                “The model must be accurate”
                <Strike p={draw(f, c.compared)} />
              </div>
            </div>
            <div style={{ position: "absolute", left: 30, top: 180, ...pop(f, c.compared) }}><Chip label="accurate compared to what? 🤔" color={K.muted} size={36} /></div>
            <Big f={f} at={c.rival} text="WE NEED A RIVAL 🥊" color={K.red} size={64} style={{ left: 30, top: 300 }} />
          </Zone>

          {/* ── persistence: Asha's method, copies yesterday ── */}
          <Zone show={zone("persistence", "doubt1")}>
            <div style={{ position: "absolute", left: 20, top: 10, ...pop(f, start("persistence")) }}><Asha height={250} /></div>
            <div style={{ position: "absolute", left: 160, top: 20, ...pop(f, c.tomorrow) }}>
              <div style={{ background: "#fff", border: `5px solid ${K.ink}`, borderRadius: 24, padding: "10px 18px", fontWeight: 900, fontSize: 32 }}>“tomorrow = today”</div>
            </div>
            <div style={{ position: "absolute", left: 30, top: 290, ...pop(f, c.persistence) }}><Chip label="👥 = PERSISTENCE" color="#7C8A9C" size={40} /></div>
            <div style={{ position: "absolute", left: 420, top: 120, width: GW, height: GH + 40, opacity: enter(f, c.column) }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: py(91), borderTop: `4px dashed ${K.red}` }} />
              <svg viewBox={`0 0 ${GW} ${GH}`} width={GW} height={GH} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                <path d={pathOf(ACTUAL)} fill="none" stroke={K.purple} strokeWidth={7} strokeLinejoin="round" />
                <path d={pathOf(ACTUAL.slice(0, 6), 1)} fill="none" stroke="#9AA6B6" strokeWidth={7} strokeDasharray="14 10" strokeLinejoin="round" opacity={enter(f, c.copies, 10)} />
                {ACTUAL.map((v, i) => <circle key={i} cx={px(i)} cy={py(v)} r={9} fill={v >= 91 ? "#FB8C00" : K.purple} stroke={K.ink} strokeWidth={3} />)}
              </svg>
              <div style={{ position: "absolute", left: 0, top: GH + 6, fontWeight: 900, fontSize: 22 }}><span style={{ color: K.purple }}>━ actual</span>   <span style={{ color: "#7C8A9C" }}>┅ persistence (one day late)</span></div>
            </div>
            <div style={{ position: "absolute", left: 30, top: 380, ...pop(f, c.copies) }}><Chip label="⬆ each value copies the row above ↘" color={K.ink} size={30} /></div>
          </Zone>

          {/* ── answer1: worse than persistence = worse than nothing ── */}
          <Zone show={live(f, start("answer1"), start("mae"))}>
            <div style={{ position: "absolute", left: 30, top: 20, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
              <span style={pop(f, c.servers)}><Chip label="− 🖥️ servers" color={K.red} size={38} /></span>
              <span style={pop(f, c.maintenance)}><Chip label="− 🔧 maintenance" color={K.red} size={38} /></span>
              <span style={pop(f, c.trust)}><Chip label="😎 people trust it more" color="#FB8C00" size={38} /></span>
            </div>
            <Big f={f} at={c.better} text="CAN'T BEAT PERSISTENCE → NO MODEL IS BETTER" color={K.red} size={44} style={{ left: 30, top: 300 }} />
          </Zone>

          {/* ── mae: the error column and its average ── */}
          <Zone show={zone("mae", "catch")}>
            <div style={{ position: "absolute", left: 30, top: 0, ...pop(f, c.error) }}><Chip label="❌ error = how far off · |actual − persistence|" color={K.red} size={28} /></div>
            {(() => {
              const W = 920, H = 230, X = 40, Y = 70, bw = W / 6, ymax = 45;
              const avg = enter(f, c.average, 14);
              return (
                <div style={{ position: "absolute", left: X, top: Y, width: W, height: H, borderBottom: `4px solid ${K.ink}` }}>
                  {ROWS.map((r, i) => (
                    <div key={r[0]} style={{ position: "absolute", left: i * bw + 20, bottom: 0, width: bw - 40, height: (r[3] / ymax) * H * enter(f, c.error + 6 + i * 5, 10), background: K.red, borderRadius: "8px 8px 0 0" }}>
                      <div style={{ position: "absolute", top: -34, width: "100%", textAlign: "center", fontWeight: 900, fontSize: 24 }}>{r[3].toFixed(1)}</div>
                    </div>
                  ))}
                  {ROWS.map((r, i) => <div key={i} style={{ position: "absolute", left: i * bw, width: bw, top: H + 8, textAlign: "center", fontWeight: 800, fontSize: 20, color: K.muted }}>{r[0]}</div>)}
                  <div style={{ position: "absolute", left: 0, width: W * avg, bottom: (MAE / ymax) * H, borderTop: `7px dashed ${K.blue}` }} />
                </div>
              );
            })()}
            <Big f={f} at={c.e186} text={`MAE = AVERAGE = ${MAE.toFixed(1)} µg/m³`} color={K.blue} size={52} style={{ left: 30, top: 360 }} />
          </Zone>

          {/* ── catch: same error, different cost → recall ── */}
          <Zone show={zone("catch", "goal")}>
            {(() => {
              const X = 50, W = 900, max = 130, p = (v: number) => X + (v / max) * W;
              const Br = ({ v, a, ok }: { v: number; a: number; ok: boolean }) => (
                <div style={{ position: "absolute", left: p(v - 10), top: 60, width: p(v + 10) - p(v - 10), height: 50, border: `7px solid ${ok ? K.green : K.red}`, borderBottom: "none", borderRadius: "10px 10px 0 0", background: ok ? "rgba(46,158,91,.15)" : "rgba(229,57,53,.15)", ...pop(f, a) }} />
              );
              return (
                <>
                  <div style={{ position: "absolute", left: 30, top: 0, ...pop(f, c.same) }}><Chip label="MAE counts every error the same" color={K.muted} size={26} /></div>
                  <div style={{ position: "absolute", left: X, top: 110, width: W, height: 9, background: K.ink, borderRadius: 4, opacity: enter(f, c.same) }} />
                  <div style={{ position: "absolute", left: p(91), top: 40, height: 110, borderLeft: `6px dashed ${K.red}`, opacity: enter(f, c.same) }} />
                  {[40, 85, 91].map((t) => <div key={t} style={{ position: "absolute", left: p(t) - 14, top: 128, fontWeight: 900, fontSize: 22, color: t === 91 ? K.red : K.muted, opacity: enter(f, c.same) }}>{t}</div>)}
                  <Br v={40} a={c.same + 6} ok />
                  <Br v={85} a={c.same + 14} ok={false} />
                  <div style={{ position: "absolute", left: 30, top: 180, ...pop(f, c.missing) }}><Chip label="missing a Poor day = the costly mistake" color={K.red} size={30} /></div>
                  <div style={{ position: "absolute", left: 30, top: 250, ...pop(f, c.count) }}><Chip label="⬆ orange rows = the truly Poor days (≥ 91)" color="#FB8C00" size={30} /></div>
                  <Big f={f} at={c.two} text="CAUGHT 2 OF 3 → RECALL" color="#FB8C00" size={58} style={{ left: 30, top: 340 }} />
                </>
              );
            })()}
          </Zone>

          {/* ── goal: the one-sentence criterion + the real train/test cut ── */}
          <Zone show={zone("goal", "recall")}>
            <div style={{ position: "absolute", left: 20, top: 0, width: 960, ...pop(f, c.goal) }}>
              <div style={{ borderRadius: 18, border: `5px solid ${K.ink}`, background: "#FFFDE7", padding: "14px 22px", boxShadow: `7px 7px 0 ${K.ink}` }}>
                <div style={{ fontWeight: 900, fontSize: 32, ...pop(f, c.ten) }}>① MAE at least <span style={{ color: K.green }}>10% better</span> than persistence</div>
                <div style={{ fontWeight: 900, fontSize: 32, marginTop: 8, ...pop(f, c.catching) }}>② catch <span style={{ color: K.green }}>no fewer</span> Poor days</div>
              </div>
            </div>
            {(() => {
              const W = 940, tr = (323 / 487) * W;
              return (
                <div style={{ position: "absolute", left: 30, top: 200, width: W, height: 120, opacity: enter(f, c.test) }}>
                  <div style={{ position: "absolute", left: 0, top: 0, width: tr * enter(f, c.test, 16), height: 110, background: K.blue, border: `5px solid ${K.ink}`, borderRadius: "14px 0 0 14px", boxSizing: "border-box", color: "#fff", padding: 12, overflow: "hidden", whiteSpace: "nowrap" }}>
                    <div style={{ fontFamily: K.head, fontSize: 42 }}>LEARN · 323 days</div>
                    <div style={{ fontWeight: 800, fontSize: 22 }}>Feb 2025 → Feb 2026</div>
                  </div>
                  <div style={{ position: "absolute", left: tr, top: 0, width: W - tr, height: 110, background: "#37474F", border: `5px solid ${K.ink}`, borderLeft: "none", borderRadius: "0 14px 14px 0", boxSizing: "border-box", color: "#fff", padding: 12, ...pop(f, c.never) }}>
                    <div style={{ fontFamily: K.head, fontSize: 38 }}>🔒 TEST · 164</div>
                    <div style={{ fontWeight: 800, fontSize: 20 }}>Mar → Sep 2026</div>
                  </div>
                </div>
              );
            })()}
            <div style={{ position: "absolute", left: 30, top: 350, ...pop(f, c.never) }}><Chip label="🔒 the model never sees the test days while learning" color="#37474F" size={30} /></div>
          </Zone>

          {/* ── recall ── */}
          <Zone show={live(f, start("recall"), Infinity)}>
            <Takeaways f={f} items={[["good only compared to a rival 👥", c.rRival, "#7C8A9C"], ["MAE = how far off we are", c.rMae, K.blue], ["recall = how many bad days we caught", c.rRecall, "#FB8C00"]]} />
          </Zone>
        </div>
      </Stage>

      {meta.titleCard && <TitleCard f={f} line={meta.titleCard.line} sub={meta.titleCard.sub} until={c.input} />}
      <DoubtLow f={f} from={start("doubt1")} to={end("doubt1")} text="Sir, if our model is a little worse than this, it is still useful, right?" mouth={mouth} />
      <StageCaption f={f} />
    </AbsoluteFill>
  );
}
