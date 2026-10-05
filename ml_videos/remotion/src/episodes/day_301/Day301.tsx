// DAF-01 · Part 1 — reproducibility and idea one (claude/daf/episodes/daf_01/script_v2.md).
// Concepts only, no code walkthrough. All text is HTML (SVG <text> shakes in renders).
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { draw, enter, pop } from "../../shared/anim";
import { Asha, DoubtCard } from "../../shared/daf/Cast";
import { House } from "../../shared/daf/House";
import { live } from "../../shared/daf/ui";
import { DevMascot } from "../../shared/DevMascot";
import { Backdrop, CaptionPill, ChapterBar, Chip, Header, K, Tab, TermCard, tilt, TimelineProvider, TitleCard, useCues, useMouth, useTimeline, Workspace } from "../../shared/explainer/kit";
import type { EpisodeMeta, Timeline } from "../../shared/types";

export const Day301: React.FC<{ timeline: Timeline; meta: EpisodeMeta }> = ({ timeline, meta }) => (
  <TimelineProvider value={timeline}><Scene meta={meta} /></TimelineProvider>
);

const RISHI_BEATS = ["doubt1"];
const KID = ["#E53935", "#1E88E5", "#FB8C00", "#8E24AA"];
const JAVA = "#E76F00";

function Laptop({ f, at, x, y, broken = Infinity, label }: { f: number; at: number; x: number; y: number; broken?: number; label: string }) {
  const shake = f >= broken && f < broken + 12 ? 6 * Math.sin(f * 2.5) : 0;
  return (
    <div style={{ position: "absolute", left: x + shake, top: y, ...pop(f, at) }}>
      <div style={{ position: "relative", width: 280, height: 180, borderRadius: 14, background: "#1E2533", border: `5px solid ${K.ink}`, padding: 16, boxSizing: "border-box", color: "#E6EDF3", fontFamily: K.mono, fontSize: 22 }}>
        <div>forecast ▶</div>
        <div style={{ marginTop: 10, fontSize: 34, fontWeight: 900, color: K.yellow }}>{label}</div>
        {f >= broken && (
          <svg viewBox="0 0 280 180" width={280} height={180} style={{ position: "absolute", left: -5, top: -5 }}>
            <path d="M40 0 L90 60 L70 90 L140 130 L120 180 M90 60 L170 40 M140 130 L230 120" stroke="#fff" strokeWidth={5} fill="none" strokeDasharray="400" strokeDashoffset={400 * (1 - draw(f, broken))} />
          </svg>
        )}
      </div>
      <div style={{ width: 330, height: 22, marginLeft: -25, borderRadius: "0 0 14px 14px", background: "#9AA6B6", border: `4px solid ${K.ink}` }} />
    </div>
  );
}

function Shelf({ label, items, color, style }: { label: string; items: string[]; color: string; style?: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", ...style }}>
      <div style={{ display: "flex", gap: 10, padding: "16px 16px 10px", borderBottom: `12px solid #8D6E4E`, background: "#FFF8EC", borderRadius: "10px 10px 0 0" }}>
        {items.map((it) => <div key={it} style={{ padding: "18px 16px", borderRadius: 10, background: color, color: "#fff", fontWeight: 900, fontSize: 34, border: `4px solid ${K.ink}` }}>{it}</div>)}
      </div>
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 26, marginTop: 8 }}>{label}</div>
    </div>
  );
}

function Scene({ meta }: { meta: EpisodeMeta }) {
  const f = useCurrentFrame();
  const tl = useTimeline();
  const { at, start, end } = useCues();
  const mouth = useMouth(f);
  const rishiTalking = RISHI_BEATS.some((id) => f >= start(id) && f < end(id));

  const c = {
    met: at("recap", "met"), asha: at("recap", "Asha"), n91: at("recap", "ninety-one"), six: at("recap", "six"), before: at("recap", "before"), question: at("recap", "question"),
    laptop: at("question", "laptop"), breaks: at("question", "breaks"), someone: at("question", "someone"), same: at("question", "same"), name: at("question", "name"), repro: at("question", "Reproducibility"),
    poor: at("matters", "Poor"), asks: at("matters", "asks"), code: at("matters", "code"), data: at("matters", "data"), libs: at("matters", "libraries"), number: at("matters", "number"), explain: at("matters", "explain"), trust: at("matters", "trust"),
    controller: at("java", "controller"), structure: at("java", "structure"), pom: at("java", "pom.xml|pomxml"), skip: at("java", "skip"), notebook: at("java", "notebook"), catch_: at("java", "catch"), second: at("java", "second"),
    four: at("four", "four"), oneByOne: at("four", "one"),
    room: at("isolation", "room"), projects: at("isolation", "projects"), newV: at("isolation", "new"), oldV: at("isolation", "old"), share: at("isolation", "share"), upgrading: at("isolation", "upgrading"), breaks2: at("isolation", "breaks"), isolated: at("isolation", "isolated"), virtual: at("isolation", "virtual"),
    maven: at("answer1", "Maven"), keeps: at("answer1", "keeps"), picks: at("answer1", "picks"), shared: at("answer1", "shared"), ownShelf: at("answer1", "own"), sameIdea: at("answer1", "Same"),
    ideaOne: at("p1_end", "one"), versions: at("p1_end", "versions"), home: at("p1_end", "home"), weShare: at("p1_end", "share"), partTwo: at("p1_end", "two"),
  };
  const chapters = (meta.chapters ?? []).map((ch) => ({ label: ch.label, from: start(ch.beat) }));
  const sec = (a: string, b: string) => live(f, start(a), start(b));
  const point = [[c.question, 40], [c.repro, 40], [c.asks, 40], [c.four, 30], [c.virtual, 40], [c.partTwo, 40]].some(([a, d]) => f >= a && f < a + d);

  return (
    <AbsoluteFill style={{ fontFamily: K.ui, overflow: "hidden" }}>
      <Audio src={staticFile(tl.audio)} />
      <Backdrop />
      <Header f={f} day={meta.day} title={meta.title} badge={meta.badge} />
      <ChapterBar f={f} chapters={chapters} />
      <Workspace f={f} tabs={<Tab label="🏠 DAF-01 · reproducibility" active />}>
        {/* ── recap: Asha, 91, 600 children → one question first ── */}
        <div style={{ opacity: sec("recap", "question") }}>
          <div style={{ opacity: 1 - 0.85 * enter(f, c.before, 10) }}>
            <div style={{ position: "absolute", left: 220, top: 40, ...pop(f, c.asha) }}><Asha height={320} /></div>
            <div style={{ position: "absolute", left: 470, top: 70, ...tilt(pop(f, c.n91, 7), -3) }}><TermCard text="91" color={K.red} size={130} /></div>
            <div style={{ position: "absolute", left: 470, top: 280, width: 440, height: 90 }}>
              {Array.from({ length: 200 }).map((_, i) => (
                <span key={i} style={{ position: "absolute", left: (i % 40) * 11, top: Math.floor(i / 40) * 16, width: 7, height: 7, borderRadius: 4, background: KID[i % 4], opacity: f >= c.six + Math.floor(i / 40) * 2 ? 1 : 0 }} />
              ))}
            </div>
            <div style={{ position: "absolute", left: 600, top: 390, ...pop(f, c.six + 6) }}><Chip label="600 children" color={K.ink} size={26} /></div>
          </div>
          <div style={{ position: "absolute", left: 300, top: 200, ...pop(f, c.question, 8) }}>
            <div style={{ width: 380, height: 300, borderRadius: 30, background: K.yellow, border: `6px solid ${K.ink}`, boxShadow: `10px 10px 0 ${K.ink}`, display: "grid", placeItems: "center", fontFamily: K.head, fontSize: 200, transform: `rotate(${2 * Math.sin(f / 8)}deg)` }}>?</div>
          </div>
          <div style={{ position: "absolute", left: 300, top: 530, ...pop(f, c.question + 8) }}><Chip label="one question, before any ML" color={K.ink} size={28} /></div>
        </div>

        {/* ── question: my laptop breaks → someone else → same result? ── */}
        <div style={{ opacity: sec("question", "matters") }}>
          <Laptop f={f} at={c.laptop} x={210} y={60} broken={c.breaks} label="91 → Poor" />
          <div style={{ position: "absolute", left: 230, top: 290, ...pop(f, c.laptop + 6) }}><Chip label="my laptop" color={K.ink} size={24} /></div>
          <Laptop f={f} at={c.someone} x={620} y={60} label="?" />
          <div style={{ position: "absolute", left: 640, top: 290, ...pop(f, c.someone + 6) }}><Chip label="someone else's" color={K.blue} size={24} /></div>
          <div style={{ position: "absolute", left: 500, top: 120, ...pop(f, c.same) }}><div style={{ fontFamily: K.head, fontSize: 70, color: K.red, transform: `scale(${1 + 0.15 * Math.sin(f / 4)})` }}>=?</div></div>
          <div style={{ position: "absolute", left: 250, top: 400, ...pop(f, c.same + 4) }}><Chip label="exactly the same result?" color={K.red} size={30} /></div>
          <div style={{ position: "absolute", left: 260, top: 530, opacity: 1 - enter(f, c.repro, 6) }}>
            <div style={tilt(pop(f, c.name), 3 * Math.sin(f / 4))}><TermCard text="IT HAS A NAME…" color={K.ink} size={64} /></div>
          </div>
          <div style={{ position: "absolute", left: 220, top: 520, ...tilt(pop(f, c.repro, 7), -3 + 1.2 * Math.sin(f / 7)) }}><TermCard text="REPRODUCIBILITY" color={K.blue} size={90} /></div>
        </div>

        {/* ── matters: same code + data + libraries → same number, or no trust ── */}
        <div style={{ opacity: sec("matters", "java") }}>
          <div style={{ position: "absolute", left: 210, top: 20, padding: "16px 22px", borderRadius: 18, background: "#FFEBEE", border: `5px solid ${K.red}`, fontWeight: 900, fontSize: 32, lineHeight: 1.2, ...pop(f, c.poor) }}>🔮 Tomorrow: POOR<br /><span style={{ fontSize: 26 }}>keep the children inside</span></div>
          <div style={{ position: "absolute", left: 600, top: 30, ...pop(f, c.asks) }}>
            <div style={{ background: "#fff", border: `5px solid ${K.ink}`, borderRadius: 24, padding: "14px 20px", fontWeight: 900, fontSize: 30, lineHeight: 1.2, transform: `rotate(${1.5 * Math.sin(f / 9)}deg)` }}>How did you<br />get this? 🤨</div>
          </div>
          {[["SAME CODE", c.code], ["SAME DATA", c.data], ["SAME LIBRARIES", c.libs]].map(([t, a], i) => (
            <div key={t as string} style={{ position: "absolute", left: 210 + i * 245, top: 250, width: 220, padding: "20px 0", textAlign: "center", borderRadius: 16, background: K.blue, border: `5px solid ${K.ink}`, color: "#fff", fontFamily: K.head, fontSize: 30, ...pop(f, a as number) }}>{t as string}</div>
          ))}
          <div style={{ position: "absolute", left: 540, top: 370, fontSize: 56, fontWeight: 900, ...pop(f, c.number - 6) }}>⬇</div>
          <div style={{ position: "absolute", left: 400, top: 450, padding: "18px 30px", borderRadius: 16, background: K.green, border: `5px solid ${K.ink}`, color: "#fff", fontFamily: K.head, fontSize: 40, ...pop(f, c.number) }}>SAME NUMBER ✓</div>
          <div style={{ position: "absolute", left: 230, top: 600, display: "flex", gap: 20 }}>
            <span style={pop(f, c.explain)}><Chip label="✗ can't explain it" color={K.red} size={30} /></span>
            <span style={pop(f, c.trust)}><Chip label="✗ can't trust it" color={K.red} size={30} /></span>
          </div>
        </div>

        {/* ── java: Spring project has structure; a notebook starts anywhere ── */}
        <div style={{ opacity: sec("java", "four") }}>
          <div style={{ position: "absolute", left: 200, top: 20, width: 340, borderRadius: 16, border: `5px solid ${K.ink}`, background: "#FFF6EE", overflow: "hidden", ...pop(f, start("java") + 4) }}>
            <div style={{ background: JAVA, color: "#fff", fontWeight: 900, fontSize: 26, padding: "10px 16px" }}>☕ Spring Boot project</div>
            {[["📁 controller", c.controller], ["📁 service", c.structure], ["📁 repository", c.structure + 4], ["📄 pom.xml", c.pom]].map(([t, a]) => (
              <div key={t as string} style={{ fontFamily: K.mono, fontWeight: 800, fontSize: 24, padding: "10px 18px", borderTop: `2px solid ${K.line}`, ...pop(f, a as number) }}>{t as string}</div>
            ))}
            <div style={{ padding: "10px 18px", ...pop(f, c.pom + 8) }}><Chip label="✓ structure first" color={K.green} size={24} /></div>
          </div>
          <div style={{ position: "absolute", left: 580, top: 20, width: 360, height: 420, borderRadius: 16, border: `5px solid ${K.ink}`, background: "#fff", overflow: "hidden", ...pop(f, c.skip) }}>
            <div style={{ background: "#F57C00", color: "#fff", fontWeight: 900, fontSize: 26, padding: "10px 16px" }}>📓 notebook, day one</div>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} style={{ position: "absolute", left: 20 + ((i * 97) % 200), top: 70 + i * 48, ...pop(f, c.notebook + i * 3) }}>
                <div style={{ width: 120 + ((i * 53) % 110), height: 34, borderRadius: 6, background: f >= c.catch_ ? "#FFE0B2" : "#ECEFF1", border: `2px solid ${K.muted}`, transform: `rotate(${((i * 37) % 9) - 4 + (f >= c.catch_ ? 4 * Math.sin(f / 6 + i) : 0)}deg) translateX(${f >= c.catch_ ? 10 * Math.sin(f / 9 + i * 2) : 0}px)` }} />
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", left: 600, top: 470, ...pop(f, c.catch_) }}><Chip label="⚡ total freedom" color="#F57C00" size={28} /></div>
          <div style={{ position: "absolute", left: 300, top: 570, ...tilt(pop(f, c.second, 7), -3) }}><TermCard text="RUN IT TWICE? ✗" color={K.red} size={70} /></div>
        </div>

        {/* ── four: the house on four pillars (first look) ── */}
        <div style={{ opacity: sec("four", "isolation") }}>
          <House f={f} at={c.four - 6} built={[Infinity, Infinity, Infinity, Infinity]} glow={[c.oneByOne, c.oneByOne + 6, c.oneByOne + 12, c.oneByOne + 18]} />
          <div style={{ position: "absolute", left: 320, top: 620, ...pop(f, c.oneByOne) }}><Chip label="4 ideas, one by one" color={K.ink} size={30} /></div>
        </div>

        {/* ── isolation: two projects, one shared Python → breaks; own rooms → safe ── */}
        <div style={{ opacity: sec("isolation", "doubt1") }}>
          <div style={{ position: "absolute", left: 200, top: 10, ...pop(f, start("isolation") + 4) }}><Chip label="IDEA 1 · every project in its own room" color={K.blue} size={28} /></div>
          <div style={{ position: "absolute", left: 360, top: 200, opacity: 1 - enter(f, c.projects - 10, 8) }}>
            <div style={pop(f, c.room)}><div style={{ fontSize: 150, textAlign: "center", transform: `rotate(${3 * Math.sin(f / 7)}deg)` }}>🚪</div><Chip label="every project: its own room" color={K.blue} size={30} /></div>
          </div>
          <div style={{ position: "absolute", left: 200, top: 80, width: 740, height: 560, borderRadius: 20, border: `5px solid ${K.ink}`, background: "#F7F9FC", ...pop(f, c.projects - 6) }}>
            <div style={{ position: "absolute", left: 16, top: 10, fontWeight: 900, fontSize: 24, color: K.muted }}>💻 one laptop</div>
          </div>
          {[["Project A", "needs NEW version", c.newV, 240], ["Project B", "needs OLD version", c.oldV, 610]].map(([name, need, a, x], i) => {
            const broken = i === 1 && f >= c.breaks2 && f < c.isolated;
            return (
              <div key={name as string} style={{ position: "absolute", left: x as number, top: 140, width: 260, padding: 16, borderRadius: 16, background: broken ? "#FFCDD2" : "#fff", border: `5px solid ${broken ? K.red : K.ink}`, textAlign: "center", ...pop(f, c.projects + i * 6) }}>
                <div style={{ fontWeight: 900, fontSize: 30 }}>{name as string}</div>
                <div style={{ fontWeight: 800, fontSize: 22, color: i ? K.purple : K.blue, ...pop(f, a as number) }}>{need as string}</div>
                {broken && <div style={{ fontWeight: 900, fontSize: 28, color: K.red }}>💥 broken</div>}
              </div>
            );
          })}
          <div style={{ opacity: f >= c.isolated ? 1 - enter(f, c.isolated, 10) : 1 }}>
            <div style={{ position: "absolute", left: 420, top: 370, width: 300, padding: "18px 0", textAlign: "center", borderRadius: 14, background: "#FFF8EC", borderBottom: `10px solid #8D6E4E`, fontWeight: 900, fontSize: 28, ...pop(f, c.share) }}>
              ONE shared Python
              <div style={{ fontSize: 22, color: f >= c.upgrading ? K.blue : K.muted }}>library {f >= c.upgrading ? "NEW ⬆" : "?"}</div>
            </div>
            <svg viewBox="0 0 740 200" width={740} height={200} style={{ position: "absolute", left: 200, top: 250, opacity: f >= c.share ? 1 : 0 }}>
              <path d="M170 40 L330 130" stroke={K.ink} strokeWidth={5} strokeDasharray="8 8" />
              <path d="M540 40 L400 130" stroke={f >= c.breaks2 ? K.red : K.ink} strokeWidth={5} strokeDasharray="8 8" />
            </svg>
          </div>
          <div style={{ opacity: enter(f, c.isolated, 12) }}>
            {[["own room · NEW", 240, K.blue], ["own room · OLD", 610, K.purple]].map(([t, x, col]) => (
              <div key={t as string} style={{ position: "absolute", left: x as number, top: 330, width: 260, height: 150, borderRadius: 14, border: `6px solid ${col as string}`, background: "rgba(255,255,255,.9)", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 26, color: col as string }}>✓ {t as string}</div>
            ))}
          </div>
          <div style={{ position: "absolute", left: 250, top: 520, ...tilt(pop(f, c.virtual, 7), -3) }}><TermCard text="VIRTUAL ENVIRONMENT" color={K.green} size={66} /></div>
        </div>

        {/* ── answer1: Maven keeps versions apart; Python needs its own shelf per project ── */}
        <div style={{ opacity: live(f, start("doubt1"), start("p1_end")) }}>
          <div style={{ position: "absolute", left: 200, top: 10, width: 350, ...pop(f, c.maven) }}>
            <div style={{ fontWeight: 900, fontSize: 36, color: JAVA }}>☕ Java · Maven</div>
          </div>
          <Shelf label="every version kept apart" items={["v1", "v2", "v3"]} color={JAVA} style={{ left: 200, top: 90, ...pop(f, c.keeps) }} />
          <div style={{ position: "absolute", left: 200, top: 280, display: "flex", gap: 14, ...pop(f, c.picks) }}>
            <Chip label="A → v3" color={K.ink} size={32} />
            <Chip label="B → v1" color={K.ink} size={32} />
          </div>
          <div style={{ position: "absolute", left: 600, top: 10, fontWeight: 900, fontSize: 36, color: K.blue, ...pop(f, c.shared - 6) }}>🐍 Python</div>
          <div style={{ opacity: 1 - enter(f, c.ownShelf, 10) }}>
            <Shelf label="one shelf for everyone" items={["lib ?"]} color={K.muted} style={{ left: 600, top: 90, ...pop(f, c.shared) }} />
          </div>
          <div style={{ opacity: enter(f, c.ownShelf, 10) }}>
            <Shelf label="A's shelf" items={["NEW"]} color={K.blue} style={{ left: 600, top: 90 }} />
            <Shelf label="B's shelf" items={["OLD"]} color={K.purple} style={{ left: 790, top: 90 }} />
          </div>
          <div style={{ position: "absolute", left: 240, top: 450, ...tilt(pop(f, c.sameIdea, 7), -2 + 1.2 * Math.sin(f / 7)) }}><TermCard text="SAME IDEA, DIFFERENT TOOL" color={K.blue} size={58} /></div>
        </div>

        {/* ── p1_end: pillar one built, three more coming in part two ── */}
        <div style={{ opacity: live(f, start("p1_end"), Infinity) }}>
          <House f={f} at={start("p1_end")} built={[c.ideaOne, Infinity, Infinity, Infinity]} glow={[Infinity, start("p1_end") + 10, start("p1_end") + 16, start("p1_end") + 22]} />
          <div style={{ position: "absolute", left: 330, top: 640, ...pop(f, c.partTwo) }}>
            <div style={{ transform: `translateX(${8 * Math.sin(f / 6)}px)` }}><TermCard text="PART 2 →" color={K.ink} size={60} /></div>
          </div>
        </div>
      </Workspace>

      {meta.titleCard && <TitleCard f={f} line={meta.titleCard.line} sub={meta.titleCard.sub} until={c.met} />}
      <div style={{ position: "absolute", left: 0, top: 930, ...pop(f, 2) }}>
        <DevMascot height={620} pose={point ? "point" : "present"} mouth={rishiTalking ? 0 : mouth} />
      </div>
      <DoubtCard f={f} from={start("doubt1")} to={end("doubt1")} text="Sir, in Java I never needed this. Why does Python need it?" mouth={mouth} />
      <CaptionPill f={f} />
    </AbsoluteFill>
  );
}

