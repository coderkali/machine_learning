// DAF Trailer · Part 2 — "One number" (claude/daf/trailer/script_v7_part2.md).
// Three ideas only: PM2.5 · the 91 line · beat the rival. All text is HTML (SVG <text> shakes in renders).
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { draw, enter, pop, T } from "../../shared/anim";
import { Asha, DoubtCard, Rishi } from "../../shared/daf/Cast";
import { ip, live, Strike } from "../../shared/daf/ui";
import { DevMascot } from "../../shared/DevMascot";
import { Backdrop, CaptionPill, ChapterBar, Chip, Header, K, Tab, TermCard, tilt, TimelineProvider, TitleCard, useCues, useMouth, useTimeline, Workspace } from "../../shared/explainer/kit";
import type { EpisodeMeta, Timeline } from "../../shared/types";

export const Day202: React.FC<{ timeline: Timeline; meta: EpisodeMeta }> = ({ timeline, meta }) => (
  <TimelineProvider value={timeline}><Scene meta={meta} /></TimelineProvider>
);

const RISHI_BEATS = ["doubt", "doubt2"];
const rnd = (i: number) => ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
const KID = ["#E53935", "#1E88E5", "#FB8C00", "#8E24AA"];

function School({ f, at }: { f: number; at: number }) {
  return (
    <div style={{ position: "absolute", left: 200, top: 150, ...pop(f, at) }}>
      <svg viewBox="0 0 420 300" width={420} height={300}>
        <path d="M30 120 L210 30 L390 120 Z" fill={K.red} stroke={K.ink} strokeWidth={6} strokeLinejoin="round" />
        <rect x={50} y={120} width={320} height={170} fill="#FFF3D6" stroke={K.ink} strokeWidth={6} />
        {[80, 160, 270, 330].map((x) => <rect key={x} x={x - 20} y={150} width={40} height={40} fill="#BBDEFB" stroke={K.ink} strokeWidth={4} />)}
        <rect x={180} y={200} width={60} height={90} fill="#8D6E4E" stroke={K.ink} strokeWidth={5} />
        <circle cx={210} cy={85} r={18} fill="#fff" stroke={K.ink} strokeWidth={4} />
      </svg>
    </div>
  );
}

function Clock({ f, at, x, y, size = 200 }: { f: number; at: number; x: number; y: number; size?: number }) {
  const spin = enter(f, at, 20);
  return (
    <div style={{ position: "absolute", left: x, top: y, ...pop(f, at) }}>
      <svg viewBox="0 0 200 200" width={size} height={size}>
        <circle cx={100} cy={100} r={90} fill="#fff" stroke={K.ink} strokeWidth={8} />
        {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={100} y1={18} x2={100} y2={30} stroke={K.ink} strokeWidth={5} transform={`rotate(${i * 30} 100 100)`} />)}
        <line x1={100} y1={100} x2={100} y2={40} stroke={K.ink} strokeWidth={8} strokeLinecap="round" transform={`rotate(${720 * (1 - spin)} 100 100)`} />
        <line x1={100} y1={100} x2={100} y2={150} stroke={K.red} strokeWidth={10} strokeLinecap="round" transform={`rotate(${-120 * (1 - spin)} 100 100)`} />
        <circle cx={100} cy={100} r={8} fill={K.ink} />
      </svg>
    </div>
  );
}

const Card = ({ text, rival, style }: { text: string; rival?: boolean; style?: React.CSSProperties }) => (
  <div style={{ width: 250, padding: "24px 0", textAlign: "center", borderRadius: 18, background: rival ? "#ECEFF1" : K.blue, border: rival ? `5px dashed ${K.muted}` : `5px solid ${K.ink}`, fontFamily: K.head, fontSize: 38, color: rival ? K.muted : "#fff", ...style }}>{text}</div>
);

function Scene({ meta }: { meta: EpisodeMeta }) {
  const f = useCurrentFrame();
  const tl = useTimeline();
  const { at, start, end } = useCues();
  const mouth = useMouth(f);
  const rishiTalking = RISHI_BEATS.some((id) => f >= start(id) && f < end(id));

  const c = {
    met: at("hook", "met"), school: at("hook", "school"), six: at("hook", "six"), home: at("hook", "home"), question: at("hook", "question"),
    phone: at("pm25", "phone"), pm: at("pm25", "PM2.5|PM"), dust: at("pm25", "dust"), lungs: at("pm25", "lungs"), blood: at("pm25", "blood"), bigger: at("pm25", "bigger"), dirtier: at("pm25", "dirtier"),
    no: at("answer", "No"), size: at("answer", "size"), micro: at("answer", "micrometres|micrometers"),
    decides: at("line", "decides"), n91: at("line", "Ninety-one"), below: at("line", "Below"), above: at("line", "above"), six00: at("line", "six"), depend: at("line", "depend"),
    tonight: at("problem", "tonight"), exist: at("problem", "exist"), guesses: at("problem", "guesses"), rival: at("problem", "rival"),
    evening: at("goal", "evening"), clues: at("goal", "clues"), guess: at("goal", "guess"), number: at("goal", "number"), better: at("goal", "better"),
    easy: at("stakes", "easy"), most: at("stakes", "most"), right2: at("stakes", "right", 2), harder: at("stakes", "harder"),
    small: at("start", "small"), station: at("start", "station"), ticket: at("start", "ticket"), step: at("start", "step"),
    together: at("close", "together"), episode: at("close", "Episode"), write: at("close", "write"), house: at("close", "house"),
  };
  const chapters = (meta.chapters ?? []).map((ch) => ({ label: ch.label, from: start(ch.beat) }));
  const sec = (a: string, b: string) => live(f, start(a), start(b));
  const point = [[c.question, 40], [c.n91, 40], [c.rival, 30], [c.episode, 40]].some(([a, d]) => f >= a && f < a + d);

  return (
    <AbsoluteFill style={{ fontFamily: K.ui, overflow: "hidden" }}>
      <Audio src={staticFile(tl.audio)} />
      <Backdrop />
      <Header f={f} day={meta.day} title={meta.title} badge={meta.badge} />
      <ChapterBar f={f} chapters={chapters} />
      <Workspace f={f} tabs={<Tab label="▦ asha_6pm.story" active />}>
        {/* ── hook: who we met → her school at 6 pm → one question ── */}
        <div style={{ opacity: live(f, 0, c.school) }}>
          <div style={{ position: "absolute", left: 260, top: 60, ...pop(f, c.met) }}><Asha height={300} /></div>
          <div style={{ position: "absolute", left: 470, top: 60, ...pop(f, c.met + 6) }}><Rishi height={300} /></div>
          <div style={{ position: "absolute", left: 690, top: 120, width: 170, height: 150, borderRadius: 20, background: "#fff", border: `5px dashed ${K.muted}`, display: "grid", placeItems: "center", ...pop(f, c.met + 12) }}>
            <svg viewBox="0 0 160 80" width={140} height={70}><polyline points="10,60 50,30 90,50 130,15" fill="none" stroke={K.muted} strokeWidth={7} strokeDasharray="12 8" strokeDashoffset={-f} /></svg>
            <span style={{ fontWeight: 900, fontSize: 22, color: K.muted }}>the rival</span>
          </div>
        </div>
        <div style={{ opacity: sec("hook", "pm25") * (f >= c.school ? 1 : 0) }}>
          <School f={f} at={c.school} />
          <Clock f={f} at={c.six} x={700} y={40} />
          <div style={{ position: "absolute", left: 740, top: 250, ...pop(f, c.six + 8) }}><Chip label="6:00 PM" color={K.ink} size={34} /></div>
          {Array.from({ length: 14 }).map((_, i) => {
            const go = enter(f, c.home + i * 2, 30);
            return <span key={i} style={{ position: "absolute", left: 300 + (i % 7) * 30 + go * 700, top: 470 + Math.floor(i / 7) * 26, width: 16, height: 16, borderRadius: 8, background: KID[i % 4], border: `2px solid ${K.ink}`, opacity: 1 - go }} />;
          })}
          <div style={{ position: "absolute", left: 220, top: 510, ...pop(f, c.question) }}>
            <div style={{ background: "#fff", border: `5px solid ${K.ink}`, borderRadius: 26, padding: "16px 26px", fontWeight: 900, fontSize: 40, lineHeight: 1.2, boxShadow: `8px 8px 0 ${K.ink}`, transform: `rotate(${-1.5 + Math.sin(f / 10)}deg)` }}>Tomorrow morning:<br />outside or inside? 🤔</div>
          </div>
        </div>

        {/* ── pm25: the one number on her phone ── */}
        <div style={{ opacity: sec("pm25", "doubt") }}>
          <div style={{ position: "absolute", left: 210, top: 30, width: 250, height: 470, borderRadius: 36, background: K.ink, padding: 14, boxSizing: "border-box", ...pop(f, c.phone) }}>
            <div style={{ width: "100%", height: "100%", borderRadius: 24, background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <span style={{ fontWeight: 900, fontSize: 22, color: K.muted }}>Delhi air · now</span>
              <span style={{ fontFamily: K.head, fontSize: 70, color: K.ink, ...pop(f, c.pm) }}>PM2.5</span>
              <span style={{ fontFamily: K.head, fontSize: 90, color: K.red, transform: `scale(${1 + 0.08 * Math.sin(f / 5)})` }}>?</span>
            </div>
          </div>
          {Array.from({ length: 22 }).map((_, i) => (
            <span key={i} style={{ position: "absolute", left: 500 + ((rnd(i) * 420 + f * (0.5 + rnd(i + 7))) % 430), top: 90 + rnd(i + 31) * 140 + 8 * Math.sin(f / 14 + i), width: 8 + rnd(i + 3) * 10, height: 8 + rnd(i + 3) * 10, borderRadius: 99, background: "rgba(124,138,156,.55)", opacity: f >= c.dust ? 1 : 0 }} />
          ))}
          <div style={{ position: "absolute", left: 520, top: 30, ...pop(f, c.dust) }}><Chip label="tiny dust in the air" color="#fff" fg={K.ink} size={26} style={{ border: `3px solid ${K.ink}` }} /></div>
          <div style={{ position: "absolute", left: 520, top: 250, ...pop(f, c.lungs) }}>
            <svg viewBox="0 0 400 170" width={400} height={170}>
              <path d="M110 10 L110 50 M110 50 Q85 58 78 75 M110 50 Q135 58 142 75" stroke={K.ink} strokeWidth={7} fill="none" strokeLinecap="round" />
              <ellipse cx={65} cy={105} rx={45} ry={58} fill="#F8A5B5" stroke={K.ink} strokeWidth={5} />
              <ellipse cx={155} cy={105} rx={45} ry={58} fill="#F8A5B5" stroke={K.ink} strokeWidth={5} />
              <path d="M205 105 L330 105" stroke={K.red} strokeWidth={8} strokeDasharray="125" strokeDashoffset={125 * (1 - draw(f, c.blood - 6))} />
              <path d="M360 70 Q385 110 360 140 Q335 110 360 70 Z" fill={K.red} stroke={K.ink} strokeWidth={4} opacity={enter(f, c.blood)} />
              <circle cx={65 + 290 * enter(f, c.blood - 12, 20)} cy={105} r={9} fill={K.muted} stroke={K.ink} strokeWidth={3} />
            </svg>
            <div style={{ position: "absolute", left: 20, top: 172, display: "flex", gap: 120 }}>
              <Chip label="lungs" color="#fff" fg={K.ink} size={24} style={{ border: `3px solid ${K.ink}` }} />
              <span style={pop(f, c.blood)}><Chip label="→ blood" color={K.red} size={24} /></span>
            </div>
          </div>
          <div style={{ position: "absolute", left: 200, top: 560, width: 740, ...pop(f, c.bigger) }}>
            <div style={{ height: 40, borderRadius: 20, border: `4px solid ${K.ink}`, background: "linear-gradient(90deg,#2E9E5B,#FBC02D,#E53935,#7B1F1F)" }} />
            <div style={{ position: "absolute", top: -14, left: ip(f, [c.bigger, c.dirtier + 15], [20, 640]), width: 18, height: 68, background: K.ink, borderRadius: 6 }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontWeight: 900, fontSize: 26 }}>
              <span style={{ color: K.green }}>small number · clean air</span>
              <span style={{ color: K.red, ...pop(f, c.dirtier) }}>bigger · dirtier 😷</span>
            </div>
          </div>
        </div>

        {/* ── doubt + answer: it is the size ── */}
        <div style={{ opacity: live(f, start("doubt"), start("line")) }}>
          <div style={{ position: "absolute", left: 330, top: 60, ...pop(f, start("doubt")) }}>
            <div style={{ position: "relative", fontFamily: K.mono, fontWeight: 900, fontSize: 96, padding: "6px 34px", background: "#fff", border: `5px solid ${K.ink}`, borderRadius: 18 }}>
              v2.5<Strike p={draw(f, c.no)} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 220, top: 300, ...tilt(pop(f, c.size), -3) }}><TermCard text="THE SIZE OF THE DUST" color={K.green} size={70} /></div>
          <div style={{ position: "absolute", left: 340, top: 460, display: "flex", alignItems: "center", gap: 16, ...pop(f, c.micro) }}>
            <span style={{ width: 30, height: 30, borderRadius: 15, background: K.muted, border: `3px solid ${K.ink}` }} />
            <span style={{ fontFamily: K.head, fontSize: 64 }}>≤ 2.5 µm</span>
          </div>
        </div>

        {/* ── line: 91 decides everything ── */}
        <div style={{ opacity: sec("line", "problem") }}>
          <div style={{ position: "absolute", left: 200, top: 40, width: 740, height: 70, borderRadius: 35, border: `5px solid ${K.ink}`, overflow: "hidden", display: "flex", ...pop(f, c.decides) }}>
            <div style={{ width: "46%", background: "#C8E6C9" }} />
            <div style={{ flex: 1, background: "#FFCDD2" }} />
          </div>
          <div style={{ position: "absolute", left: 200 + 740 * 0.46 - 5, top: 10 - 300 * (1 - enter(f, c.n91, 10)), width: 10, height: 130, background: K.red, opacity: f >= c.n91 ? 1 : 0 }} />
          <div style={{ position: "absolute", left: 200 + 740 * 0.46 - 95, top: 150, ...tilt(pop(f, c.n91, 7), -3) }}><TermCard text="91" color={K.red} size={150} /></div>
          <div style={{ position: "absolute", left: 200, top: 370, width: 330, padding: "16px 18px", borderRadius: 18, border: `5px solid ${K.green}`, background: "#E8F5E9", fontWeight: 900, fontSize: 34, ...pop(f, c.below) }}>☀️ below 91<br /><span style={{ fontSize: 28 }}>assembly OUTSIDE</span></div>
          <div style={{ position: "absolute", left: 600, top: 370, width: 330, padding: "16px 18px", borderRadius: 18, border: `5px solid ${K.red}`, background: "#FFEBEE", fontWeight: 900, fontSize: 34, ...pop(f, c.above) }}>🏫 91 or above<br /><span style={{ fontSize: 28 }}>children stay INSIDE</span></div>
          <div style={{ position: "absolute", left: 230, top: 580, width: 700, height: 150, opacity: f >= c.six00 - 4 ? 1 : 0 }}>
            {Array.from({ length: 600 }).map((_, i) => {
              const pulse = f >= c.depend ? 1 + 0.4 * Math.max(0, Math.sin((f - c.depend) / 4 - (i % 40) * 0.2)) : 1;
              return <span key={i} style={{ position: "absolute", left: (i % 40) * 17.5, top: Math.floor(i / 40) * 10, width: 7, height: 7, borderRadius: 4, background: KID[i % 4], transform: `scale(${pulse})`, opacity: f >= c.six00 + Math.floor(i / 40) ? 1 : 0 }} />;
            })}
          </div>
          <div style={{ position: "absolute", left: 700, top: 530, ...pop(f, c.six00 + 8) }}><Chip label="600 children" color={K.ink} size={26} /></div>
        </div>

        {/* ── problem: tomorrow does not exist yet → she copies today ── */}
        <div style={{ opacity: sec("problem", "goal") }}>
          <Clock f={f} at={c.tonight} x={210} y={30} size={170} />
          <div style={{ position: "absolute", left: 400, top: 60, fontSize: 90, ...pop(f, c.tonight + 6) }}>🌙</div>
          <div style={{ position: "absolute", left: 230, top: 250, textAlign: "center", ...pop(f, c.tonight) }}>
            <div style={{ width: 170, height: 220, background: K.blue, border: `5px solid ${K.ink}`, borderRadius: 12 }} />
            <div style={{ fontFamily: K.head, fontSize: 40, marginTop: 8 }}>TODAY</div>
          </div>
          <div style={{ position: "absolute", left: 620, top: 250, textAlign: "center", ...pop(f, c.exist - 6) }}>
            <div style={{ width: 170, height: 220, border: `5px dashed ${K.muted}`, borderRadius: 12, display: "grid", placeItems: "center", fontFamily: K.head, fontSize: 110, color: K.red, background: "#fff" }}>{f < c.guesses ? "?" : ""}</div>
            <div style={{ fontFamily: K.head, fontSize: 40, marginTop: 8, color: K.muted }}>TOMORROW</div>
          </div>
          <div style={{ position: "absolute", left: 230 + 390 * enter(f, c.guesses, 16), top: 250, width: 170, height: 220, boxSizing: "border-box", background: "#B8C2CF", border: `5px solid ${K.muted}`, borderRadius: 12, opacity: f >= c.guesses ? 1 : 0 }} />
          <div style={{ position: "absolute", left: 425, top: 320, fontFamily: K.head, fontSize: 52, ...pop(f, c.guesses + 6) }}>copy →</div>
          <div style={{ position: "absolute", left: 230, top: 570, ...tilt(pop(f, c.rival, 7), -3) }}><TermCard text="THE RIVAL: TOMORROW = TODAY" color={K.muted} size={50} /></div>
        </div>

        {/* ── goal: clues → our guess → tomorrow, better than the rival ── */}
        <div style={{ opacity: sec("goal", "stakes") }}>
          <div style={{ position: "absolute", left: 200, top: 30, ...pop(f, c.evening) }}><Chip label="🕕 every evening at six" color={K.ink} size={30} /></div>
          {[["TODAY'S CLUES", K.blue, c.clues], ["OUR GUESS", K.purple, c.guess], ["TOMORROW'S NUMBER", K.red, c.number]].map(([t, col, a], i) => (
            <div key={t as string} style={{ position: "absolute", left: 195 + i * 255, top: 130, display: "flex", alignItems: "center", ...pop(f, a as number) }}>
              <div style={{ width: 205, height: 130, borderRadius: 18, background: col as string, border: `5px solid ${K.ink}`, color: "#fff", display: "grid", placeItems: "center", textAlign: "center", fontFamily: K.head, fontSize: 32, lineHeight: 1.05, padding: 8, boxSizing: "border-box" }}>{t as string}</div>
              {i < 2 && <span style={{ fontSize: 44, fontWeight: 900, marginLeft: 6 }}>→</span>}
            </div>
          ))}
          <div style={{ position: "absolute", left: 210, top: 370, display: "flex", alignItems: "center", gap: 26, ...pop(f, c.better) }}>
            <Card text="THE RIVAL" rival />
            <span style={{ fontFamily: K.head, fontSize: 80, color: K.red, transform: `scale(${1 + 0.1 * Math.sin(f / 4)})` }}>VS</span>
            <Card text="OUR MODEL" />
          </div>
        </div>

        {/* ── stakes: the rival is right on most days ── */}
        <div style={{ opacity: sec("stakes", "start") }}>
          <div style={{ position: "absolute", left: 220, top: 30, fontFamily: K.head, fontSize: 64, ...pop(f, c.easy) }}>Sounds easy? 🙂</div>
          <div style={{ position: "absolute", left: 200, top: 150, fontWeight: 900, fontSize: 28, color: K.muted, ...pop(f, c.most) }}>the rival, day by day:</div>
          {["✓", "✓", "✓", "✗", "✓", "✓", "✓"].map((m, i) => (
            <div key={i} style={{ position: "absolute", left: 200 + i * 106, top: 200, width: 92, height: 92, borderRadius: 16, border: `4px solid ${K.ink}`, background: m === "✓" ? "#E8F5E9" : "#FFEBEE", display: "grid", placeItems: "center", fontSize: 56, fontWeight: 900, color: m === "✓" ? K.green : K.red, ...pop(f, c.most + i * T.stagger) }}>{m}</div>
          ))}
          <div style={{ position: "absolute", left: 300, top: 330, ...pop(f, c.right2) }}><Chip label="right on most days" color={K.green} size={30} /></div>
          <div style={{ position: "absolute", left: 230, top: 450, ...tilt(pop(f, c.harder, 7), -3 + 1.5 * Math.sin(f / 6)) }}><TermCard text="HARDER THAN IT LOOKS" color={K.red} size={66} /></div>
        </div>

        {/* ── start: one station, one ticket, one step ── */}
        <div style={{ opacity: sec("start", "doubt2") }}>
          <svg viewBox="0 0 420 330" width={420} height={330} style={{ position: "absolute", left: 200, top: 30, ...pop(f, c.small) }}>
            <path d="M70 40 L210 10 L360 35 L400 140 L360 250 L230 315 L100 300 L30 200 L40 100 Z" fill="#F3F6FA" stroke={K.ink} strokeWidth={5} strokeLinejoin="round" />
            <circle cx={200} cy={170} r={f >= c.station ? 18 + 4 * Math.sin(f / 4) : 0} fill={K.yellow} stroke={K.ink} strokeWidth={4} />
          </svg>
          <div style={{ position: "absolute", left: 360, top: 110, fontWeight: 900, fontSize: 26, color: K.muted, ...pop(f, c.small) }}>DELHI</div>
          <div style={{ position: "absolute", left: 420, top: 240, ...pop(f, c.station) }}><Chip label="1 station" color={K.ink} size={30} /></div>
          {["DAF-03", "DAF-02", "DAF-01"].map((t, i) => (
            <div key={t} style={{ position: "absolute", left: 680 + i * 8, top: 80 + i * 40 - (i === 2 ? 30 * enter(f, c.ticket, 10) : 0), opacity: f >= c.ticket - (2 - i) * 4 ? 1 : 0 }}>
              <div style={{ width: 220, padding: "18px 0", textAlign: "center", background: i === 2 ? K.yellow : "#FFF6BF", border: `4px solid ${K.ink}`, borderRadius: 12, fontFamily: K.mono, fontWeight: 900, fontSize: 34, transform: `rotate(${-4 + i * 3}deg)` }}>{t}</div>
            </div>
          ))}
          <div style={{ position: "absolute", left: 220, top: 440, display: "flex", alignItems: "flex-end", gap: 12 }}>
            {[1, 2, 3, 4, 5].map((n, i) => (
              <div key={n} style={{ width: 120, height: 50 + i * 40, background: i === 0 ? K.blue : "#DCE6F2", border: `4px solid ${K.ink}`, borderRadius: 10, display: "grid", placeItems: "center", fontSize: 34, color: i === 0 ? "#fff" : K.muted, ...pop(f, c.step + i * 3) }}>{i === 0 ? "▶" : ""}</div>
            ))}
          </div>
          <div style={{ position: "absolute", left: 220, top: 700, ...pop(f, c.step + 18) }}><Chip label="one step in every video" color={K.blue} size={26} /></div>
        </div>

        {/* ── doubt2 → close: sealed answer, episode 1, build the house ── */}
        <div style={{ opacity: live(f, start("doubt2"), start("close")) }}>
          <div style={{ position: "absolute", left: 210, top: 60, display: "flex", alignItems: "center", gap: 26, ...pop(f, start("doubt2")) }}>
            <Card text="THE RIVAL" rival />
            <span style={{ fontFamily: K.head, fontSize: 90, color: K.red, transform: `scale(${1 + 0.12 * Math.sin(f / 4)})` }}>?</span>
            <Card text="OUR MODEL" />
          </div>
        </div>
        <div style={{ opacity: live(f, start("close"), Infinity) }}>
          <div style={{ position: "absolute", left: 340, top: 20, ...pop(f, start("close")) }}>
            <div style={{ transform: `rotate(${4 * Math.sin(f / 3)}deg)` }}>
              <svg viewBox="0 0 280 180" width={280} height={180}>
                <rect x={10} y={20} width={260} height={150} rx={12} fill="#F5E6C8" stroke={K.ink} strokeWidth={6} />
                <path d="M10 26 L140 105 L270 26" fill="none" stroke={K.ink} strokeWidth={6} />
                <circle cx={140} cy={105} r={28} fill="#B71C1C" stroke={K.ink} strokeWidth={5} />
              </svg>
            </div>
          </div>
          <div style={{ position: "absolute", left: 370, top: 210, ...pop(f, c.together) }}><Chip label="we find out together" color={K.red} size={28} /></div>
          <div style={{ position: "absolute", left: 230, top: 300, ...tilt(pop(f, c.episode), -2 + (f >= c.episode + 9 ? 1.5 * Math.sin((f - c.episode) / 5) : 0)) }}><TermCard text="EPISODE 1 · DAF-01 →" color={K.blue} size={70} /></div>
          <div style={{ position: "absolute", left: 400, top: 470 }}>
            {[[0, 120], [90, 120], [180, 120], [45, 60], [135, 60]].map(([x, y], i) => (
              <div key={i} style={{ position: "absolute", left: x, top: y, width: 86, height: 56, background: "#E57373", border: `4px solid ${K.ink}`, borderRadius: 6, ...pop(f, c.write + i * 5) }} />
            ))}
            <div style={{ position: "absolute", left: 33, top: -32, ...pop(f, c.house) }}>
              <div style={{ width: 0, height: 0, borderLeft: "100px solid transparent", borderRight: "100px solid transparent", borderBottom: `90px solid ${K.red}` }} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 250, top: 690, ...pop(f, c.house + 6) }}><Chip label="🏠 build the house first" color={K.ink} size={26} /></div>
        </div>
      </Workspace>

      {meta.titleCard && <TitleCard f={f} line={meta.titleCard.line} sub={meta.titleCard.sub} until={c.met} />}
      <div style={{ position: "absolute", left: 0, top: 930, ...pop(f, 2) }}>
        <DevMascot height={620} pose={point ? "point" : "present"} mouth={rishiTalking ? 0 : mouth} />
      </div>
      <DoubtCard f={f} from={start("doubt")} to={end("doubt")} text="Sir, is 2.5 a version number?" mouth={mouth} />
      <DoubtCard f={f} from={start("doubt2")} to={end("doubt2")} text="And will our model really beat the rival?" mouth={mouth} />
      <CaptionPill f={f} />
    </AbsoluteFill>
  );
}
