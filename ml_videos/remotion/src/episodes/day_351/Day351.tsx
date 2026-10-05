// DAF-01 · Part 2 — ideas two to four (claude/daf/episodes/daf_01/script_v2.md).
// Concepts only. All text is HTML (SVG <text> shakes in renders). Nested divs keep pop() and our own transforms apart.
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { draw, enter, pop } from "../../shared/anim";
import { Asha, DoubtCard } from "../../shared/daf/Cast";
import { House } from "../../shared/daf/House";
import { live, Strike } from "../../shared/daf/ui";
import { DevMascot } from "../../shared/DevMascot";
import { Backdrop, CaptionPill, ChapterBar, Chip, Header, K, Tab, TermCard, tilt, TimelineProvider, TitleCard, useCues, useMouth, useTimeline, Workspace } from "../../shared/explainer/kit";
import type { EpisodeMeta, Timeline } from "../../shared/types";

export const Day351: React.FC<{ timeline: Timeline; meta: EpisodeMeta }> = ({ timeline, meta }) => (
  <TimelineProvider value={timeline}><Scene meta={meta} /></TimelineProvider>
);

const RISHI_BEATS = ["doubt2", "doubt3"];
const wob = (f: number, k = 1) => ({ transform: `rotate(${1.5 * k * Math.sin(f / 8)}deg)` });

const Panel = ({ title, color, children, style }: { title: string; color: string; children?: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ position: "absolute", borderRadius: 18, border: `5px solid ${K.ink}`, background: "#fff", overflow: "hidden", ...style }}>
    <div style={{ background: color, color: "#fff", fontWeight: 900, fontSize: 26, padding: "8px 16px" }}>{title}</div>
    <div style={{ padding: 14 }}>{children}</div>
  </div>
);

function Scene({ meta }: { meta: EpisodeMeta }) {
  const f = useCurrentFrame();
  const tl = useTimeline();
  const { at, start, end } = useCues();
  const mouth = useMouth(f);
  const rishiTalking = RISHI_BEATS.some((id) => f >= start(id) && f < end(id));

  const c = {
    part: at("bridge", "part"), repro: at("bridge", "reproducibility"), same1: at("bridge", "Same"), answerB: at("bridge", "answer"), room: at("bridge", "room"), cont: at("bridge", "continue"),
    some: at("versions", "some"), different: at("versions", "different"), grams: at("versions", "grams"), sameCake: at("versions", "same"), list: at("versions", "list"), exact: at("versions", "exact"), ourselves: at("versions", "ourselves"), copying: at("versions", "copying"),
    stuck: at("package", "stuck"), forty: at("package", "forty"), tests: at("package", "tests"), api: at("package", "API"), pkg: at("package", "package"), imp: at("package", "import"), truth: at("package", "truth"),
    exploring: at("answer2", "exploring"), charts: at("answer2", "charts"), works: at("answer2", "works"), explore: at("answer2", "Explore"), keep: at("answer2", "Keep"),
    careful: at("share", "careful"), secret: at("share", "secret"), online: at("share", "online"), machine: at("share", "machine"), template: at("share", "template"), here: at("share", "here"),
    code: at("answer3", "code"), itself: at("answer3", "itself"), big: at("answer3", "big"), again: at("answer3", "again"), small: at("answer3", "small"), recipe: at("answer3", "recipe"), cook: at("answer3", "cook"),
    give: at("asha", "give"), nothing: at("asha", "Nothing"), forecast: at("asha", "forecast"), produced: at("asha", "produced"), anyone: at("asha", "anyone"), trust: at("asha", "trustworthy"),
    rRepro: at("recall", "Reproducibility"), env: at("recall", "environment"), ver: at("recall", "versions"), pk: at("recall", "package"), rec: at("recall", "recipe"), gh: at("recall", "GitHub"),
    daf02: at("next", "DAF-02|DAF02"), needs: at("next", "needs"),
  };
  const chapters = (meta.chapters ?? []).map((ch) => ({ label: ch.label, from: start(ch.beat) }));
  const sec = (a: string, b: string) => live(f, start(a), start(b));
  const point = [[c.part, 30], [c.truth, 40], [c.trust, 40], [c.daf02, 40]].some(([a, d]) => f >= a && f < a + d);

  return (
    <AbsoluteFill style={{ fontFamily: K.ui, overflow: "hidden" }}>
      <Audio src={staticFile(tl.audio)} />
      <Backdrop />
      <Header f={f} day={meta.day} title={meta.title} badge={meta.badge} />
      <ChapterBar f={f} chapters={chapters} />
      <Workspace f={f} tabs={<Tab label="🏠 DAF-01 · reproducibility" active />}>
        {/* ── bridge: the house from part 1, pillar one built ── */}
        <div style={{ opacity: sec("bridge", "versions") }}>
          <House f={f} at={c.part - 4} built={[c.part + 6, Infinity, Infinity, Infinity]} glow={[Infinity, c.part + 20, c.part + 26, c.part + 32]} bob />
          <div style={{ position: "absolute", left: 210, top: 560, display: "flex", gap: 10, flexWrap: "wrap", width: 740 }}>
            {["same code", "same data", "same libraries", "= same answer"].map((t, i) => (
              <span key={t} style={pop(f, (i < 3 ? c.same1 : c.answerB) + i * 8)}><Chip label={t} color={i < 3 ? K.blue : K.green} size={26} /></span>
            ))}
          </div>
          <div style={{ position: "absolute", left: 230, top: 700, ...pop(f, c.room) }}><Chip label="✓ idea 1 · own room" color={K.blue} size={26} /></div>
        </div>

        {/* ── idea 2: exact versions = a recipe with exact amounts ── */}
        <div style={{ opacity: sec("versions", "package") }}>
          <div style={{ position: "absolute", left: 200, top: 0, ...pop(f, start("versions") + 4) }}><Chip label="IDEA 2 · write down exactly what you need" color={K.purple} size={26} /></div>
          <Panel title="📜 “some flour”" color={K.muted} style={{ left: 200, top: 60, width: 350, height: 280, ...pop(f, c.some) }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 18, height: 140 }}>
              {[70, 110, 50].map((s, i) => <span key={i} style={{ fontSize: s, ...pop(f, c.different + i * 5) }}>🎂</span>)}
            </div>
            <div style={{ fontWeight: 900, fontSize: 24, color: K.red, ...pop(f, c.different) }}>different cake every time</div>
          </Panel>
          <Panel title="📜 “200 g flour”" color={K.green} style={{ left: 590, top: 60, width: 350, height: 280, ...pop(f, c.grams) }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 18, height: 140 }}>
              {[0, 1, 2].map((i) => <span key={i} style={{ fontSize: 84, ...pop(f, c.sameCake + i * 5) }}>🎂</span>)}
            </div>
            <div style={{ fontWeight: 900, fontSize: 24, color: K.green, ...pop(f, c.sameCake) }}>same cake in any kitchen</div>
          </Panel>
          <Panel title="✍️ our list · written by us" color={K.purple} style={{ left: 200, top: 360, width: 400, ...pop(f, c.list) }}>
            {["pandas == 2.2.3", "numpy == 2.1.2", "scikit-learn == 1.5.2"].map((t, i) => (
              <div key={t} style={{ fontFamily: K.mono, fontWeight: 900, fontSize: 26, padding: "6px 0", ...pop(f, c.exact + i * 6) }}>{t}</div>
            ))}
            <div style={{ marginTop: 6, ...pop(f, c.ourselves) }}><Chip label="✓ we know why each one is there" color={K.green} size={22} /></div>
          </Panel>
          <div style={{ position: "absolute", left: 640, top: 360, width: 300, height: 300, borderRadius: 18, border: `5px dashed ${K.muted}`, background: "#FAFBFC", overflow: "hidden", ...pop(f, c.copying) }}>
            {Array.from({ length: 14 }).map((_, i) => <div key={i} style={{ height: 10, margin: "8px 14px", borderRadius: 5, background: "#CFD8DC", width: `${60 + ((i * 37) % 35)}%` }} />)}
            <div style={{ position: "absolute", left: 20, right: 20, top: 120 }}><Strike p={draw(f, c.copying + 8)} /></div>
            <div style={{ position: "absolute", left: 14, bottom: 10, fontWeight: 900, fontSize: 22, color: K.red }}>copy everything installed ✗</div>
          </div>
        </div>

        {/* ── idea 3: real code in one package, imported everywhere ── */}
        <div style={{ opacity: sec("package", "doubt2") }}>
          <div style={{ position: "absolute", left: 200, top: 0, ...pop(f, start("package") + 4) }}><Chip label="IDEA 3 · one home for the real code" color="#00897B" size={26} /></div>
          <Panel title="📓 notebook" color="#F57C00" style={{ left: 200, top: 60, width: 300, height: 330, ...pop(f, c.stuck) }}>
            {[37, 38, 39, 40, 41].map((n) => (
              <div key={n} style={{ display: "flex", gap: 10, alignItems: "center", margin: "8px 0", padding: "6px 10px", borderRadius: 8, background: n === 40 && f >= c.forty ? "#FFE0B2" : "#ECEFF1", border: `3px solid ${n === 40 && f >= c.forty ? K.red : K.line}` }}>
                <span style={{ fontFamily: K.mono, fontWeight: 900, fontSize: 18, color: K.muted }}>[{n}]</span>
                <span style={{ fontWeight: 800, fontSize: 18 }}>{n === 40 ? "cleaning logic 🔒" : ""}</span>
              </div>
            ))}
          </Panel>
          <div style={{ position: "absolute", left: 560, top: 70, display: "flex", flexDirection: "column", gap: 16 }}>
            {[["🧪 tests", c.tests], ["🌐 API", c.api]].map(([t, a]) => {
              const fixed = f >= c.imp;
              return (
                <div key={t as string} style={{ ...pop(f, a as number) }}>
                  <div style={{ width: 360, padding: "16px 18px", borderRadius: 14, border: `5px solid ${fixed ? K.green : K.red}`, background: fixed ? "#E8F5E9" : "#FFEBEE", fontWeight: 900, fontSize: 30 }}>{t as string} {fixed ? "✓ imports it" : "✗ can't reach it"}</div>
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", left: 420, top: 440, ...pop(f, c.pkg) }}>
            <div style={{ width: 300, padding: "26px 0", textAlign: "center", borderRadius: 20, background: "#00897B", border: `6px solid ${K.ink}`, color: "#fff", fontFamily: K.head, fontSize: 44, transform: `scale(${f >= c.imp ? 1 + 0.04 * Math.sin(f / 5) : 1})` }}>📦 ONE PACKAGE</div>
          </div>
          <svg viewBox="0 0 740 200" width={740} height={200} style={{ position: "absolute", left: 200, top: 300, opacity: enter(f, c.imp) }}>
            <path d="M150 90 L330 150" stroke={K.ink} strokeWidth={5} strokeDasharray="10 8" strokeDashoffset={-f} />
            <path d="M560 -40 L420 140" stroke={K.ink} strokeWidth={5} strokeDasharray="10 8" strokeDashoffset={-f} />
          </svg>
          <div style={{ position: "absolute", left: 230, top: 610, ...pop(f, c.truth, 7) }}><div style={tilt({ opacity: 1, transform: "" }, -2 + 1.2 * Math.sin(f / 7))}><TermCard text="ONE SOURCE OF TRUTH" color={K.ink} size={64} /></div></div>
        </div>

        {/* ── doubt2 + answer2: explore in the notebook, keep in the package ── */}
        <div style={{ opacity: live(f, start("doubt2"), start("share")) }}>
          <Panel title="🔍 EXPLORE · notebook" color="#F57C00" style={{ left: 200, top: 40, width: 330, height: 300, ...pop(f, c.exploring) }}>
            {[["💡 try ideas", c.exploring + 6], ["📊 draw charts", c.charts]].map(([t, a]) => <div key={t as string} style={{ fontWeight: 900, fontSize: 30, margin: "16px 0", ...pop(f, a as number) }}>{t as string}</div>)}
          </Panel>
          <div style={{ position: "absolute", left: 545, top: 140, ...pop(f, c.works) }}>
            <div style={{ fontFamily: K.head, fontSize: 40, textAlign: "center", transform: `translateX(${6 * Math.sin(f / 5)}px)` }}>it works<br />→</div>
          </div>
          <Panel title="📦 KEEP · package" color="#00897B" style={{ left: 690, top: 40, width: 250, height: 300, ...pop(f, c.works + 8) }}>
            <div style={{ fontWeight: 900, fontSize: 28, margin: "16px 0" }}>✓ final code</div>
          </Panel>
          <div style={{ position: "absolute", left: 210, top: 400, ...pop(f, c.explore) }}><TermCard text="EXPLORE IN THE NOTEBOOK" color="#F57C00" size={50} /></div>
          <div style={{ position: "absolute", left: 260, top: 540, ...pop(f, c.keep) }}><TermCard text="KEEP IN THE PACKAGE" color="#00897B" size={50} /></div>
        </div>

        {/* ── idea 4: the secret stays home, an empty template is shared ── */}
        <div style={{ opacity: sec("share", "doubt3") }}>
          <div style={{ position: "absolute", left: 200, top: 0, ...pop(f, c.careful - 6) }}><Chip label="IDEA 4 · be careful what you share" color="#FB8C00" size={26} /></div>
          <div style={{ position: "absolute", left: 230, top: 80, ...pop(f, c.secret) }}>
            <div style={{ fontSize: 120, ...wob(f) }}>🔑</div>
            <Chip label="secret key" color={K.ink} size={26} />
          </div>
          <div style={{ position: "absolute", left: 640, top: 70, ...pop(f, c.online) }}>
            <div style={{ position: "relative", width: 260, padding: "26px 0", textAlign: "center", borderRadius: 20, background: "#ECEFF1", border: `5px solid ${K.ink}`, fontWeight: 900, fontSize: 34 }}>🌍 online<div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 110, color: K.red }}>✗</div></div>
          </div>
          <div style={{ position: "absolute", left: 220, top: 330, ...pop(f, c.machine) }}>
            <div style={{ width: 300, padding: "22px 0", textAlign: "center", borderRadius: 18, background: "#1E2533", border: `5px solid ${K.ink}`, color: "#fff", fontWeight: 900, fontSize: 30 }}>💻 my machine 🔑</div>
          </div>
          <div style={{ position: "absolute", left: 600, top: 320, ...pop(f, c.template) }}>
            <div style={{ width: 330, borderRadius: 16, border: `5px dashed ${K.ink}`, background: "#fff", padding: "18px 20px", fontFamily: K.mono, fontWeight: 900, fontSize: 30, transform: `translateY(${-14 * enter(f, c.here, 14)}px)` }}>API_KEY = ______</div>
            <div style={{ marginTop: 10, ...pop(f, c.here) }}><Chip label="✓ shared: empty template" color={K.green} size={26} /></div>
          </div>
        </div>

        {/* ── doubt3 + answer3: share the recipe, not the dish ── */}
        <div style={{ opacity: live(f, start("doubt3"), start("asha")) }}>
          <div style={{ position: "absolute", left: 210, top: 40, ...pop(f, c.code) }}>
            <div style={{ width: 300, padding: "20px 0", textAlign: "center", borderRadius: 18, background: "#E8F5E9", border: `5px solid ${K.green}`, fontWeight: 900, fontSize: 30 }}>📜 download code<br /><span style={{ fontSize: 24 }}>small · shared ✓</span></div>
          </div>
          <div style={{ position: "absolute", left: 560, top: 30, ...pop(f, c.itself) }}>
            <div style={{ position: "relative", width: 380, height: 260, borderRadius: 18, background: "#ECEFF1", border: `5px solid ${K.ink}`, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 34, transform: `scale(${f >= c.big ? 1 + 0.03 * Math.sin(f / 5) : 1})` }}>🗄️ the data<br /><span style={{ fontSize: 26 }}>BIG · not shared</span>
              <div style={{ position: "absolute", right: 14, top: 8, fontSize: 70, color: K.red }}>✗</div>
            </div>
          </div>
          <div style={{ position: "absolute", left: 560, top: 310, ...pop(f, c.again) }}><Chip label="↻ download it again anytime" color={K.blue} size={26} /></div>
          <div style={{ position: "absolute", left: 230, top: 420, display: "flex", alignItems: "center", gap: 18, ...pop(f, c.recipe) }}>
            <span style={{ fontSize: 100 }}>📜</span>
            <span style={{ fontFamily: K.head, fontSize: 60, display: "inline-block", transform: `translateX(${8 * Math.sin(f / 5)}px)` }}>→</span>
            <span style={{ fontSize: 100, ...pop(f, c.cook) }}>🍲</span>
          </div>
          <div style={{ position: "absolute", left: 230, top: 600, ...pop(f, c.cook) }}><TermCard text="SHARE THE RECIPE" color={K.green} size={60} /></div>
        </div>

        {/* ── asha: nothing visible yet, but every number can be produced again ── */}
        <div style={{ opacity: sec("asha", "recall") }}>
          <div style={{ position: "absolute", left: 210, top: 40, ...pop(f, start("asha") + 4) }}><div style={{ transform: `rotate(${2 * Math.sin(f / 10)}deg)`, transformOrigin: "50% 100%" }}><Asha height={320} /></div></div>
          <div style={{ position: "absolute", left: 470, top: 400, opacity: 1 - enter(f, c.produced, 8) }}><div style={pop(f, c.give)}><Chip label="🎁 what did DAF-01 give her?" color={K.ink} size={28} /></div></div>
          <div style={{ position: "absolute", left: 200, top: 380, ...pop(f, c.nothing) }}><Chip label="no forecast yet" color={K.muted} size={26} /></div>
          <div style={{ position: "absolute", left: 330, top: 30, ...pop(f, c.nothing) }}>
            <div style={{ background: "#fff", border: `4px solid ${K.ink}`, borderRadius: 24, padding: "8px 16px", fontSize: 44, transform: `rotate(${6 * Math.sin(f / 6)}deg) translateY(${6 * Math.sin(f / 9)}px)` }}>🔮 ?</div>
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "absolute", left: 470 + (i % 2) * 230, top: 50 + Math.floor(i / 2) * 170 + (i === 2 ? 0 : 0), ...pop(f, (i ? c.anyone : c.produced) + i * 6) }}>
              <div style={{ width: 200, padding: "18px 0", textAlign: "center", borderRadius: 14, background: "#1E2533", border: `4px solid ${K.ink}`, color: K.yellow, fontFamily: K.mono, fontWeight: 900, fontSize: 26 }}>💻 same ✓</div>
            </div>
          ))}
          <div style={{ position: "absolute", left: 300, top: 470, ...pop(f, c.trust, 7) }}><div style={tilt({ opacity: 1, transform: "" }, -3 + 1.2 * Math.sin(f / 7))}><TermCard text="TRUSTWORTHY" color={K.green} size={96} /></div></div>
        </div>

        {/* ── recall: all four pillars built ── */}
        <div style={{ opacity: sec("recall", "next") }}>
          <House f={f} at={start("recall") + 2} built={[c.env, c.ver, c.pk, c.rec]} bob />
          <div style={{ position: "absolute", left: 230, top: 600, display: "flex", gap: 14, alignItems: "center" }}>
            <span style={pop(f, c.rRepro)}><Chip label="same code · data · libraries → same answer" color={K.ink} size={24} /></span>
          </div>
          <div style={{ position: "absolute", left: 230, top: 660, ...pop(f, c.gh) }}><Chip label="💻 full code on GitHub" color={K.blue} size={28} /></div>
        </div>

        {/* ── next: DAF-02 ── */}
        <div style={{ opacity: live(f, start("next"), Infinity) }}>
          <div style={{ position: "absolute", left: 220, top: 60, ...pop(f, start("next") + 2) }}><Asha height={320} /></div>
          <div style={{ position: "absolute", left: 460, top: 90, ...pop(f, c.daf02) }}>
            <div style={{ width: 440, borderRadius: 18, border: `5px solid ${K.ink}`, background: "#fff", padding: "18px 22px", boxShadow: `8px 8px 0 ${K.ink}`, transform: `rotate(${-2 + Math.sin(f / 8)}deg)` }}>
              <div style={{ fontFamily: K.head, fontSize: 44 }}>📋 NEXT · DAF-02</div>
              <div style={{ fontWeight: 900, fontSize: 30, marginTop: 8, ...pop(f, c.needs) }}>what exactly does Asha madam need?</div>
            </div>
          </div>
          <div style={{ position: "absolute", left: 470, top: 360, ...pop(f, c.needs + 8) }}><TermCard text="EPISODE 2 →" color={K.blue} size={70} /></div>
        </div>
      </Workspace>

      {meta.titleCard && <TitleCard f={f} line={meta.titleCard.line} sub={meta.titleCard.sub} until={c.part} />}
      <div style={{ position: "absolute", left: 0, top: 930, ...pop(f, 2) }}>
        <DevMascot height={620} pose={point ? "point" : "present"} mouth={rishiTalking ? 0 : mouth} />
      </div>
      <DoubtCard f={f} from={start("doubt2")} to={end("doubt2")} text="Sir, so notebooks are bad?" mouth={mouth} />
      <DoubtCard f={f} from={start("doubt3")} to={end("doubt3")} text="Sir, and the data? Do we share that?" mouth={mouth} />
      <CaptionPill f={f} />
    </AbsoluteFill>
  );
}

