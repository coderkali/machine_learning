import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont } from "../load-font";
import { COLORS, FONT_BOLD, FONT_UI } from "../theme";
import beats from "./beats.json";
import beatsV2 from "./beats_v2.json";
import beatsV3 from "./beats_v3.json";

const W = 1080;
const H = 1920;
const FONT_HAND = "Marker Felt, Noteworthy, Comic Sans MS, cursive";
const C = {
  bg: COLORS.bg,
  panel: "#111C2F",
  panel2: "#17243A",
  blue: COLORS.blue,
  gold: COLORS.yellow,
  red: COLORS.red,
  white: COLORS.textMain,
  muted: COLORS.textDim,
  green: "#54D6A0",
  line: "#293A53",
};
const TOTAL_FRAMES = beats.reduce((sum, beat) => sum + beat.frames, 0) + 60;
export { TOTAL_FRAMES };
const TOTAL_FRAMES_V2 = beatsV2.reduce((sum, beat) => sum + beat.frames, 0);
export { TOTAL_FRAMES_V2 };
const TOTAL_FRAMES_V3 = beatsV3.reduce((sum, beat) => sum + beat.frames, 0);
export { TOTAL_FRAMES_V3 };

const ease = (v: number) => {
  const x = Math.max(0, Math.min(1, v));
  return 1 - Math.pow(1 - x, 3);
};
const enter = (f: number, at: number, span = 22) => ease((f - at) / span);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
function Envelope({
  x,
  y,
  label,
  tone = C.blue,
  rotate = 0,
  opacity = 1,
  scale = 1,
}: {
  x: number;
  y: number;
  label: string;
  tone?: string;
  rotate?: number;
  opacity?: number;
  scale?: number;
}) {
  return (
    <g opacity={opacity} transform={`translate(${x} ${y}) rotate(${rotate} 110 75) scale(${scale})`}>
      <rect x={6} y={8} width={208} height={132} rx={22} fill={C.panel2} stroke={tone} strokeWidth={4} />
      <path d="M 12 24 L 110 92 L 208 24" fill="none" stroke={tone} strokeWidth={4} strokeLinejoin="round" />
      <rect x={24} y={102} width={162} height={24} rx={12} fill={tone} opacity={0.16} />
      <text x={110} y={122} textAnchor="middle" fill={tone} fontSize={17} fontWeight={700} fontFamily={FONT_UI}>{label}</text>
    </g>
  );
}

function Robot({ f, catchIt = false, mood = "happy" }: { f: number; catchIt?: boolean; mood?: "happy" | "facepalm" | "skeptical" | "nodding" }) {
  const bob = Math.sin(f / (mood === "nodding" ? 7 : 11)) * (mood === "nodding" ? 5 : 8);
  const hand = catchIt ? interpolate(f, [45, 90], [0, -100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const rightArm = mood === "facepalm" ? "M 284 216 L 304 170 L 260 130" : "M 284 216 L 325 190";
  return (
    <svg viewBox="0 0 360 360" width={330} height={330} style={{ overflow: "visible", transform: `translateY(${bob}px)` }}>
      <ellipse cx="180" cy="325" rx="112" ry="18" fill="#050910" opacity={0.46} />
      <path d={`M 76 216 L 36 ${208 + hand} Q 22 ${201 + hand} 30 ${188 + hand}`} stroke={C.blue} strokeWidth="18" strokeLinecap="round" fill="none" />
      <path d={rightArm} stroke={C.blue} strokeWidth="18" strokeLinecap="round" fill="none" />
      {mood === "facepalm" && <circle cx="258" cy="128" r="16" fill={C.blue} stroke="#0E1A2B" strokeWidth="4" />}
      <rect x="75" y="90" width="210" height="218" rx="56" fill="#142640" stroke={C.blue} strokeWidth="9" />
      <rect x="103" y="133" width="154" height="100" rx="30" fill="#07111E" stroke="#274668" strokeWidth="4" />
      <ellipse cx="151" cy="179" rx="12" ry="19" fill={C.white} />
      <ellipse cx="209" cy="179" rx="12" ry="19" fill={C.white} />
      <circle cx="154" cy="184" r="6" fill={C.blue} />
      <circle cx="206" cy="184" r="6" fill={C.blue} />
      {mood === "skeptical" && <path d="M 187 148 L 220 139" stroke={C.blue} strokeWidth="6" strokeLinecap="round" />}
      <path d={mood === "skeptical" ? "M 158 214 Q 181 201 202 216" : mood === "facepalm" ? "M 158 220 Q 180 201 202 220" : "M 158 209 Q 180 228 202 209"} stroke={C.gold} strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="180" cy="270" r="17" fill={C.gold} />
      <text x="180" y="277" textAnchor="middle" fontFamily={FONT_UI} fontWeight={800} fontSize={20} fill={C.bg}>M</text>
      <path d="M 132 306 L 123 333 M 228 306 L 237 333" stroke={C.white} strokeWidth="14" strokeLinecap="round" />
    </svg>
  );
}

function MailStage({ children }: { children: React.ReactNode }) {
  return <svg viewBox="0 0 960 840" style={{ position: "absolute", width: 960, height: 840, top: 440, left: 60, overflow: "visible" }}>{children}</svg>;
}

function Hook({ f }: { f: number }) {
  const drift = enter(f, 10, 32);
  const catchT = enter(f, 42, 30);
  return (
    <MailStage>
      <rect x="52" y="68" width="850" height="520" rx="40" fill={C.panel} stroke={C.line} strokeWidth="3" />
      <rect x="90" y="112" width="770" height="62" rx="18" fill="#0D1726" />
      <circle cx="125" cy="143" r="10" fill={C.green} />
      <text x="157" y="152" fill={C.muted} fontSize="24" fontFamily={FONT_UI}>INBOX · 1 NEW MESSAGE</text>
      {[0, 1, 2].map((i) => (
        <g key={i} opacity={enter(f, 5 + i * 8, 18)}>
          <rect x="94" y={210 + i * 105} width="765" height="80" rx="16" fill={i === 2 ? "#201D28" : C.panel2} stroke={i === 2 ? C.red : C.line} strokeWidth="2" />
          <circle cx="141" cy={250 + i * 105} r="17" fill={i === 2 ? C.red : C.blue} opacity=".8" />
          <rect x="181" y={231 + i * 105} width={i === 2 ? 260 : 365} height="15" rx="7" fill={C.white} opacity=".8" />
          <rect x="181" y={257 + i * 105} width={i === 2 ? 460 : 280} height="11" rx="5" fill={C.muted} opacity=".45" />
        </g>
      ))}
      <g transform={`translate(${mix(1000, 500, drift)} ${mix(310, 370, drift)}) rotate(-12)`} opacity={drift}>
        <Envelope x={0} y={0} label="YOU WON!" tone={C.red} scale={0.8} />
      </g>
      <g opacity={catchT} transform={`translate(510 ${120 - catchT * 10})`}>
        <Robot f={f} catchIt />
      </g>
      <g opacity={catchT}>
        <rect x="600" y="600" width="255" height="67" rx="33" fill={C.red} opacity=".18" stroke={C.red} strokeWidth="2" />
        <text x="727" y="644" textAnchor="middle" fill={C.red} fontFamily={FONT_UI} fontSize="29" fontWeight="800">SPAM?</text>
      </g>
    </MailStage>
  );
}

function Rules({ f }: { f: number }) {
  const topple = enter(f, 170, 42);
  return (
    <MailStage>
      <text x="95" y="120" fill={C.muted} fontFamily={FONT_UI} fontSize="22" fontWeight="700">THE RULEBOOK</text>
      {[0, 1, 2, 3].map((i) => {
        const y = 160 + i * 114;
        const rotation = i === 3 ? -15 * topple : 0;
        return (
          <g key={i} opacity={enter(f, 10 + i * 31, 22)} transform={`rotate(${rotation} 390 ${y + 45})`}>
            <rect x="95" y={y} width="585" height="84" rx="20" fill={i === 3 ? "#2A1E27" : C.panel2} stroke={i === 3 ? C.red : C.line} strokeWidth="3" />
            <text x="130" y={y + 52} fill={C.white} fontFamily={FONT_UI} fontSize="27" fontWeight="600">
              {i === 0 ? '“Prize” → SPAM' : i === 1 ? 'Unknown sender → SPAM' : i === 2 ? 'Except trusted senders…' : 'Except this new sender…'}
            </text>
            {i === 3 && <path d={`M 620 ${y + 8} L 650 ${y + 76} M 650 ${y + 8} L 620 ${y + 76}`} stroke={C.red} strokeWidth="8" strokeLinecap="round" />}
          </g>
        );
      })}
      <g opacity={enter(f, 150, 25)}>
        <Envelope x={645} y={186} label="REAL EMAIL" tone={C.green} rotate={5} scale={0.72} />
        <path d="M 757 198 L 815 315" stroke={C.red} strokeWidth="6" strokeDasharray="12 12" />
        <circle cx="810" cy="330" r="28" fill={C.red} opacity=".9" />
        <text x="810" y="340" textAnchor="middle" fill={C.white} fontSize="30" fontFamily={FONT_UI} fontWeight="800">×</text>
      </g>
      <g opacity={topple}>
        <rect x="108" y="682" width="744" height="74" rx="20" fill="#291B25" stroke={C.red} strokeWidth="2" />
        <text x="480" y="729" fill={C.red} textAnchor="middle" fontSize="26" fontFamily={FONT_UI} fontWeight="800">MORE RULES → MORE EXCEPTIONS</text>
      </g>
    </MailStage>
  );
}

function Examples({ f }: { f: number }) {
  const items = [
    { x: 80, y: 142, subject: "FREE PRIZE!!!", clue: "ALL CAPS · ODD LINK", label: "SPAM", tone: C.red },
    { x: 510, y: 142, subject: "Team lunch at 1", clue: "KNOWN TEAM · NORMAL", label: "SAFE", tone: C.green },
    { x: 80, y: 342, subject: "CLAIM CASH NOW", clue: "URGENT · ODD LINK", label: "SPAM", tone: C.red },
    { x: 510, y: 342, subject: "Invoice attached", clue: "KNOWN SENDER", label: "SAFE", tone: C.green },
    { x: 80, y: 542, subject: "You are the winner!", clue: "SURPRISE · LINK", label: "SPAM", tone: C.red },
    { x: 510, y: 542, subject: "Sprint review", clue: "PROJECT CONTEXT", label: "SAFE", tone: C.green },
  ] as const;
  return (
    <MailStage>
      <text x="100" y="96" fill={C.muted} fontFamily={FONT_UI} fontSize="22" fontWeight="700">REAL EXAMPLES · EACH EMAIL ALREADY LABELED</text>
      {items.map(({ x, y, subject, clue, label, tone }, i) => {
        const t = enter(f, i * 15, 20);
        return (
          <g key={i} opacity={t} transform={`translate(0 ${18 * (1 - t)})`}>
            <rect x={x} y={y} width="400" height="176" rx="22" fill={C.panel2} stroke={tone} strokeWidth="3" />
            <circle cx={x + 33} cy={y + 38} r="13" fill={tone} />
            <text x={x + 59} y={y + 46} fill={C.white} fontFamily={FONT_UI} fontSize="23" fontWeight="800">{subject}</text>
            <text x={x + 30} y={y + 96} fill={C.gold} fontFamily={FONT_UI} fontSize="22" fontWeight="700">CLUES: {clue}</text>
            <rect x={x + 30} y={y + 116} width="130" height="38" rx="18" fill={tone} opacity=".19" />
            <text x={x + 95} y={y + 142} textAnchor="middle" fill={tone} fontFamily={FONT_UI} fontSize="19" fontWeight="900">{label}</text>
          </g>
        );
      })}
      <g opacity={enter(f, 150, 25)}>
        <rect x="150" y="746" width="660" height="76" rx="26" fill="#20232C" stroke={C.gold} strokeWidth="3" />
        <text x="480" y="795" textAnchor="middle" fill={C.gold} fontFamily={FONT_UI} fontSize="27" fontWeight="800">EXAMPLES HELP REVEAL REPEATING CLUES</text>
      </g>
    </MailStage>
  );
}

function Training({ f }: { f: number }) {
  const quiz = enter(f, 118, 26);
  const correction = enter(f, 224, 26);
  const second = enter(f, 320, 26);
  return (
    <MailStage>
      <text x="480" y="92" textAnchor="middle" fill={C.muted} fontFamily={FONT_UI} fontSize="22" fontWeight="700">THE INBOX SORTER LEARNS BY TRYING</text>
      <g opacity={enter(f, 12, 22)}>
        <rect x="64" y="144" width="364" height="176" rx="24" fill={C.panel2} stroke={C.red} strokeWidth="3" />
        <text x="93" y="191" fill={C.muted} fontFamily={FONT_UI} fontSize="17" fontWeight="700">QUIZ EMAIL</text>
        <text x="93" y="238" fill={C.white} fontFamily={FONT_UI} fontSize="28" fontWeight="900">FREE PRIZE!!!</text>
        <text x="93" y="278" fill={C.gold} fontFamily={FONT_UI} fontSize="17" fontWeight="700">ALL CAPS · UNKNOWN LINK</text>
      </g>
      <path d="M 444 228 H 526 M 506 210 L 528 228 L 506 246" stroke={C.gold} strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={enter(f, 46, 20)} />
      <g opacity={enter(f, 64, 25)}>
        <rect x="548" y="144" width="400" height="176" rx="28" fill={C.panel} stroke={C.blue} strokeWidth="4" />
        <text x="748" y="195" textAnchor="middle" fill={C.blue} fontFamily={FONT_UI} fontSize="22" fontWeight="900">INBOX SORTER</text>
        <g transform="translate(655 163) scale(.48)"><Robot f={f} mood="nodding" /></g>
        <text x="748" y="289" textAnchor="middle" fill={C.muted} fontFamily={FONT_UI} fontSize="17">MODEL · LEARNED FROM EXAMPLES</text>
      </g>
      <g opacity={quiz}>
        <rect x="186" y="380" width="708" height="92" rx="24" fill="#2A1E27" stroke={C.red} strokeWidth="3" />
        <text x="232" y="438" fill={C.white} fontFamily={FONT_UI} fontSize="25" fontWeight="800">FIRST GUESS: SAFE</text>
        <text x="831" y="442" textAnchor="middle" fill={C.red} fontFamily={FONT_BOLD} fontSize="44">✕</text>
      </g>
      <g opacity={correction}>
        <rect x="186" y="496" width="708" height="92" rx="24" fill="#142C2A" stroke={C.green} strokeWidth="3" />
        <text x="232" y="554" fill={C.white} fontFamily={FONT_UI} fontSize="25" fontWeight="800">LABEL SAYS: SPAM</text>
        <text x="831" y="556" textAnchor="middle" fill={C.green} fontFamily={FONT_BOLD} fontSize="42">✓</text>
        <text x="540" y="621" textAnchor="middle" fill={C.gold} fontFamily={FONT_UI} fontSize="20" fontWeight="800">FEEDBACK ADJUSTS THE PATTERN</text>
      </g>
      <g opacity={second}>
        <rect x="186" y="664" width="708" height="100" rx="24" fill={C.panel2} stroke={C.green} strokeWidth="3" />
        <text x="230" y="704" fill={C.white} fontFamily={FONT_UI} fontSize="21" fontWeight="800">Team lunch at 1</text>
        <text x="230" y="741" fill={C.muted} fontFamily={FONT_UI} fontSize="17">KNOWN TEAM · NORMAL MESSAGE</text>
        <text x="830" y="727" textAnchor="middle" fill={C.green} fontFamily={FONT_UI} fontSize="23" fontWeight="900">SAFE ✓</text>
      </g>
      <g opacity={enter(f, 375, 20)}>
        <rect x="268" y="790" width="424" height="52" rx="26" fill={C.gold} opacity=".15" />
        <text x="480" y="825" textAnchor="middle" fill={C.gold} fontFamily={FONT_UI} fontSize="22" fontWeight="900">THAT LEARNED PATTERN IS A MODEL</text>
      </g>
    </MailStage>
  );
}

function Prediction({ f }: { f: number }) {
  const arrive = enter(f, 8, 35);
  const gauge = enter(f, 148, 46);
  return (
    <MailStage>
      <text x="480" y="95" textAnchor="middle" fill={C.muted} fontFamily={FONT_UI} fontSize="22" fontWeight="700">A MESSAGE IT HAS NEVER SEEN</text>
      <g transform={`translate(${mix(-270, 118, arrive)} 195)`}>
        <Envelope x={0} y={0} label="NEW MESSAGE" tone={C.gold} scale={1.02} />
      </g>
      <path d="M 430 325 C 515 338 542 385 590 425" stroke={C.gold} strokeWidth="6" fill="none" strokeDasharray="12 13" opacity={arrive} />
      <g opacity={enter(f, 90, 32)}>
        <rect x="324" y="395" width="310" height="145" rx="32" fill={C.panel} stroke={C.blue} strokeWidth="3" />
        <text x="479" y="452" textAnchor="middle" fill={C.muted} fontFamily={FONT_UI} fontSize="20" fontWeight="700">MODEL CHECKS THE CLUES</text>
        <circle cx="424" cy="492" r="10" fill={C.blue} /><circle cx="480" cy="492" r="10" fill={C.gold} /><circle cx="536" cy="492" r="10" fill={C.red} />
      </g>
      <g opacity={gauge}>
        <rect x="158" y="602" width="644" height="170" rx="34" fill="#142337" stroke={C.green} strokeWidth="3" />
        <text x="480" y="659" textAnchor="middle" fill={C.muted} fontFamily={FONT_UI} fontSize="20" fontWeight="700" letterSpacing="2">MODEL'S ESTIMATE</text>
        <text x="480" y="718" textAnchor="middle" fill={C.green} fontFamily={FONT_BOLD} fontSize="43">LIKELY SPAM</text>
        <rect x="285" y="739" width="390" height="12" rx="6" fill={C.line} />
        <rect x="285" y="739" width={390 * Math.min(1, gauge * 0.76)} height="12" rx="6" fill={C.green} />
        <text x="480" y="813" textAnchor="middle" fill={C.red} fontFamily={FONT_UI} fontSize="22" fontWeight="700">A prediction, not a promise.</text>
      </g>
    </MailStage>
  );
}

function Quality({ f }: { f: number }) {
  const reveal = enter(f, 155, 36);
  return (
    <MailStage>
      <text x="480" y="103" textAnchor="middle" fill={C.muted} fontFamily={FONT_UI} fontSize="22" fontWeight="700">EXAMPLES SHAPE THE ANSWER</text>
      <g opacity={enter(f, 15, 24)}>
        <rect x="85" y="164" width="365" height="335" rx="30" fill={C.panel} stroke={C.green} strokeWidth="3" />
        <text x="268" y="216" textAnchor="middle" fill={C.green} fontFamily={FONT_UI} fontSize="23" fontWeight="800">CLEAR EXAMPLES</text>
        {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={150 + (i % 4) * 76} cy={294 + Math.floor(i / 4) * 79} r="20" fill={i % 2 ? C.red : C.green} opacity=".85" />)}
        <text x="268" y="473" textAnchor="middle" fill={C.muted} fontFamily={FONT_UI} fontSize="19">Useful patterns emerge</text>
      </g>
      <g opacity={enter(f, 48, 24)}>
        <rect x="510" y="164" width="365" height="335" rx="30" fill={C.panel} stroke={C.red} strokeWidth="3" />
        <text x="692" y="216" textAnchor="middle" fill={C.red} fontFamily={FONT_UI} fontSize="23" fontWeight="800">MISSING / MISLEADING</text>
        {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={575 + (i % 4) * 76} cy={294 + Math.floor(i / 4) * 79} r="20" fill={(i === 3 || i === 6) ? "transparent" : i % 2 ? C.red : C.green} stroke={(i === 3 || i === 6) ? C.muted : "none"} strokeWidth="3" opacity=".85" />)}
        <text x="692" y="473" textAnchor="middle" fill={C.muted} fontFamily={FONT_UI} fontSize="19">Mistakes can be learned</text>
      </g>
      <path d="M 480 535 V 607" stroke={C.gold} strokeWidth="5" strokeDasharray="10 11" opacity={reveal} />
      <g opacity={reveal}>
        <rect x="171" y="630" width="618" height="128" rx="30" fill={C.panel2} stroke={C.gold} strokeWidth="3" />
        <text x="480" y="682" textAnchor="middle" fill={C.gold} fontFamily={FONT_UI} fontSize="25" fontWeight="800">CHECK IT ON NEW CASES</text>
        <text x="480" y="723" textAnchor="middle" fill={C.muted} fontFamily={FONT_UI} fontSize="19">People guide and evaluate the process.</text>
      </g>
    </MailStage>
  );
}

function JavaConcept({ f }: { f: number }) {
  const oldRules = enter(f, 15, 28);
  const learned = enter(f, 88, 34);
  const prediction = enter(f, 190, 32);
  return (
    <MailStage>
      <text x="480" y="92" textAnchor="middle" fill={C.muted} fontFamily={FONT_UI} fontSize="22" fontWeight="700" letterSpacing="1">THE SAME PROBLEM, A DIFFERENT APPROACH</text>
      <g opacity={oldRules}>
        <rect x="45" y="145" width="407" height="500" rx="30" fill={C.panel} stroke={C.red} strokeWidth="3" />
        <text x="248" y="196" textAnchor="middle" fill={C.red} fontFamily={FONT_UI} fontSize="21" fontWeight="800">HAND-WRITTEN RULES</text>
        <text x="78" y="264" fill={C.white} fontFamily="monospace" fontSize="19">if (email.contains("prize"))</text>
        <text x="96" y="305" fill={C.white} fontFamily="monospace" fontSize="19">markSpam(email);</text>
        <text x="78" y="371" fill={C.muted} fontFamily="monospace" fontSize="18">else if (unknownSender)</text>
        <text x="96" y="412" fill={C.muted} fontFamily="monospace" fontSize="18">markSpam(email);</text>
        <text x="78" y="478" fill={C.red} fontFamily="monospace" fontSize="19">// ...more exceptions</text>
        <path d="M 77 520 Q 180 477 280 553 T 418 531 M 79 560 Q 197 605 301 546 T 420 590" fill="none" stroke={C.red} strokeWidth="5" opacity=".55" />
        <text x="248" y="618" textAnchor="middle" fill={C.muted} fontFamily={FONT_UI} fontSize="17">Rules grow as edge cases appear</text>
      </g>
      <path d="M 457 377 H 510 M 493 359 L 513 377 L 493 395" fill="none" stroke={C.gold} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity={learned} />
      <g opacity={learned}>
        <rect x="526" y="145" width="389" height="500" rx="30" fill={C.panel} stroke={C.green} strokeWidth="3" />
        <text x="720" y="196" textAnchor="middle" fill={C.green} fontFamily={FONT_UI} fontSize="21" fontWeight="800">LEARN FROM EXAMPLES</text>
        <rect x="560" y="225" width="321" height="153" rx="18" fill="#0B1625" stroke={C.line} strokeWidth="2" />
        <text x="581" y="277" fill={C.gold} fontFamily="monospace" fontSize="19">model.train(</text>
        <text x="603" y="316" fill={C.white} fontFamily="monospace" fontSize="18">emails, labels);</text>
        <text x="581" y="353" fill={C.muted} fontFamily={FONT_UI} fontSize="15">conceptual Java example</text>
        <g opacity={prediction}>
          <path d="M 720 391 V 438 M 704 422 L 720 440 L 736 422" fill="none" stroke={C.gold} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="560" y="457" width="321" height="132" rx="18" fill="#0B1625" stroke={C.line} strokeWidth="2" />
          <text x="581" y="502" fill={C.blue} fontFamily="monospace" fontSize="18">model.predict(</text>
          <text x="603" y="540" fill={C.white} fontFamily="monospace" fontSize="18">newEmail);</text>
          <text x="720" y="571" textAnchor="middle" fill={C.green} fontFamily={FONT_UI} fontSize="16" fontWeight="800">LIKELY SPAM</text>
        </g>
      </g>
      <g opacity={enter(f, 288, 28)}>
        <rect x="225" y="706" width="510" height="74" rx="37" fill={C.gold} opacity=".13" stroke={C.gold} strokeWidth="2" />
        <text x="480" y="752" textAnchor="middle" fill={C.gold} fontFamily={FONT_UI} fontSize="22" fontWeight="800">EXAMPLES → PATTERN → PREDICTION</text>
      </g>
    </MailStage>
  );
}

function Takeaway({ f }: { f: number }) {
  const cards = [
    { x: 70, label: "EXAMPLES", tone: C.blue, icon: "01" },
    { x: 375, label: "PATTERN", tone: C.gold, icon: "02" },
    { x: 680, label: "PREDICTION", tone: C.green, icon: "03" },
  ];
  return (
    <MailStage>
      {cards.map((card, i) => {
        const t = enter(f, 15 + i * 39, 25);
        return (
          <g key={card.label} opacity={t} transform={`translate(0 ${24 * (1 - t)})`}>
            <rect x={card.x} y="310" width="210" height="210" rx="34" fill={C.panel} stroke={card.tone} strokeWidth="3" />
            <circle cx={card.x + 105} cy="382" r="38" fill={card.tone} opacity=".16" stroke={card.tone} strokeWidth="2" />
            <text x={card.x + 105} y="393" textAnchor="middle" fill={card.tone} fontFamily={FONT_BOLD} fontSize="30">{card.icon}</text>
            <text x={card.x + 105} y="466" textAnchor="middle" fill={card.tone} fontFamily={FONT_UI} fontSize="18" fontWeight="800">{card.label}</text>
          </g>
        );
      })}
      <g opacity={enter(f, 92, 34)}>
        <path d="M 290 415 H 356 M 648 415 H 660" stroke={C.white} strokeWidth="4" strokeDasharray="7 8" />
        <path d="M 342 400 L 360 415 L 342 430 M 646 400 L 664 415 L 646 430" fill="none" stroke={C.white} strokeWidth="4" />
      </g>
      <g opacity={enter(f, 155, 30)}>
        <text x="480" y="625" textAnchor="middle" fill={C.white} fontFamily={FONT_BOLD} fontSize="39">LEARN A PATTERN.</text>
        <text x="480" y="685" textAnchor="middle" fill={C.gold} fontFamily={FONT_BOLD} fontSize="39">PREDICT SOMETHING NEW.</text>
      </g>
      <g opacity={enter(f, 222, 30)}>
        <rect x="285" y="744" width="390" height="66" rx="33" fill={C.blue} opacity=".16" />
        <text x="480" y="787" textAnchor="middle" fill={C.blue} fontFamily={FONT_UI} fontSize="22" fontWeight="800">NEXT: WHAT COUNTS AS DATA?</text>
      </g>
    </MailStage>
  );
}

const scenes = [Hook, Rules, Examples, Training, Prediction, Quality, Takeaway];
const headings = [
  ["DAY 1 · START WITH A MOMENT", "Your inbox knows", "what to ignore."],
  ["THE OLD APPROACH", "Rules work…", "until they don’t."],
  ["A DIFFERENT QUESTION", "Show examples.", "Find the pattern."],
  ["THE PATTERN HAS A NAME", "Examples shape", "a model."],
  ["NOW TRY SOMETHING NEW", "The model makes", "a prediction."],
  ["PEOPLE STILL MATTER", "Better examples.", "Better checks."],
  ["THE IDEA TO KEEP", "Learn from examples.", "Predict what’s next."],
];

function Beat({ index, beatList = beats }: { index: number; beatList?: typeof beats }) {
  const f = useCurrentFrame();
  const beat = beatList[index];
  const Scene = beat.id === "java" ? JavaConcept : scenes[index];
  const heading = beat.id === "java" ? ["JAVA DEVELOPER BRIDGE", "From rules", "to a model."] : headings[index];
  const caption = beat.captions.find((item) => f >= item.startFrame && f < item.endFrame);
  const isV3 = beatList === beatsV3;
  const showGuide = (beatList === beatsV2 && ["shift", "training", "prediction"].includes(beat.id)) || (isV3 && ["rules", "shift", "training", "prediction", "java"].includes(beat.id));
  const guideMood = beat.id === "rules" ? "facepalm" : beat.id === "shift" || beat.id === "prediction" ? "skeptical" : beat.id === "training" ? "nodding" : "happy";
  const v3Headings = [
    ["DAY 1 · START WITH A MOMENT", "Your inbox", "knows what to ignore."],
    ["THE RULEBOOK GETS MESSY", "Rules work…", "until they don’t."],
    ["A BETTER QUESTION", "Show examples.", "Find the pattern."],
    ["WATCH THE SORTER LEARN", "Examples shape", "a model."],
    ["A GUESS, NOT A GUARANTEE", "The model makes", "a prediction."],
    ["FOR JAVA DEVELOPERS", "From rules", "to a model."],
    ["THE IDEA TO KEEP", "Learn from examples.", "Predict what’s next."],
  ];
  const shownHeading = isV3 ? v3Headings[index] : heading;
  return (
    <AbsoluteFill>
      <Audio src={staticFile(beat.audio)} volume={beatList === beatsV2 ? 1.2 : 1.8} />
      <div style={{ position: "absolute", left: 76, top: 156, color: C.gold, fontSize: 20, letterSpacing: 2.6, fontWeight: 700, opacity: enter(f, 0, 16) }}>{heading[0]}</div>
      <div style={{ position: "absolute", left: 72, top: 200, right: 64, fontFamily: FONT_BOLD, fontSize: isV3 ? 84 : 72, lineHeight: .99, letterSpacing: isV3 ? -3.4 : -2.7, opacity: enter(f, 4, 18), transform: `translateY(${15 * (1 - enter(f, 4, 18))}px)` }}>
        {shownHeading[1]}<br /><span style={{ color: index === 6 || index === 3 ? C.gold : C.white }}>{shownHeading[2]}</span>
      </div>
      <Scene f={f} />
      {showGuide && <div style={{ position: "absolute", right: 26, top: 1270, width: 330, height: 330, transform: "scale(.42)", transformOrigin: "top right", pointerEvents: "none" }}><Robot f={f} mood={guideMood as "happy" | "facepalm" | "skeptical" | "nodding"} /></div>}
      {isV3 && beat.id === "takeaway" && f >= 285 && <div style={{ position: "absolute", left: 76, top: 1320, width: 740, padding: "17px 20px", boxSizing: "border-box", borderRadius: 22, border: `2px solid ${C.gold}`, background: "rgba(255,216,77,.13)", color: C.gold, fontFamily: FONT_UI, fontSize: 23, fontWeight: 900, textAlign: "center", letterSpacing: .4 }}>COMMENT “MODEL” FOR THE DAY 1 CHEAT SHEET</div>}
      {caption && (
        <div style={{ position: "absolute", top: 1450, left: 94, width: 892, minHeight: 164, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 34px", border: "1px solid #33435C", borderRadius: 26, background: "rgba(17,28,47,.97)", color: C.white, fontFamily: FONT_UI, fontSize: 38, fontWeight: 600, lineHeight: 1.28, textAlign: "center" }}>
          {caption.text}
        </div>
      )}
    </AbsoluteFill>
  );
}

export const DayOneV2: React.FC = () => {
  React.useEffect(() => { loadFont(); }, []);
  const f = useCurrentFrame();
  let start = 0;
  return (
    <AbsoluteFill style={{ background: C.bg, color: C.white, fontFamily: FONT_UI, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 90% 12%,rgba(36,91,141,.23),transparent 49%),radial-gradient(ellipse at 0% 86%,rgba(33,57,102,.17),transparent 43%)" }} />
      <Audio src={staticFile("day01/audio_v2_final/music_bed.wav")} volume={2} />
      <div style={{ position: "absolute", top: 66, left: 74, display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ background: C.blue, width: 8, height: 25, borderRadius: 3 }} />
        <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2, color: C.muted }}>ML FOR JAVA DEVELOPERS</span>
      </div>
      <div style={{ position: "absolute", right: 76, top: 66, fontSize: 22, color: C.muted }}>DAY 1 <span style={{ color: C.gold }}> / ML BASICS</span></div>
      {beatsV2.map((beat, index) => {
        const from = start;
        start += beat.frames;
        return <Sequence key={beat.id} from={from} durationInFrames={beat.frames}><Beat index={index} beatList={beatsV2} /></Sequence>;
      })}
      <div style={{ position: "absolute", left: 74, right: 74, bottom: 76, height: 7, borderRadius: 4, background: C.line }}>
        <div style={{ width: `${Math.min(100, (f / TOTAL_FRAMES_V2) * 100)}%`, height: "100%", borderRadius: 4, background: C.gold }} />
      </div>
    </AbsoluteFill>
  );
};

export const DayOneV3: React.FC = () => {
  React.useEffect(() => { loadFont(); }, []);
  const f = useCurrentFrame();
  let start = 0;
  return (
    <AbsoluteFill style={{ background: C.bg, color: C.white, fontFamily: FONT_UI, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 90% 12%,rgba(36,91,141,.23),transparent 49%),radial-gradient(ellipse at 0% 86%,rgba(33,57,102,.17),transparent 43%)" }} />
      <Audio src={staticFile("day01/audio_v3_final/music_bed.wav")} volume={2} />
      <div style={{ position: "absolute", top: 66, left: 74, display: "flex", alignItems: "center", gap: 16 }}><span style={{ background: C.blue, width: 8, height: 25, borderRadius: 3 }} /><span style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2, color: C.muted }}>ML FOR JAVA DEVELOPERS</span></div>
      <div style={{ position: "absolute", right: 76, top: 66, fontSize: 22, color: C.muted }}>DAY 1 <span style={{ color: C.gold }}> / ML BASICS</span></div>
      {beatsV3.map((beat, index) => { const from = start; start += beat.frames; return <Sequence key={beat.id} from={from} durationInFrames={beat.frames}><Beat index={index} beatList={beatsV3} /></Sequence>; })}
      <div style={{ position: "absolute", left: 74, right: 74, bottom: 76, height: 7, borderRadius: 4, background: C.line }}><div style={{ width: `${Math.min(100, (f / TOTAL_FRAMES_V3) * 100)}%`, height: "100%", borderRadius: 4, background: C.gold }} /></div>
    </AbsoluteFill>
  );
};

export const DayOne: React.FC = () => {
  React.useEffect(() => { loadFont(); }, []);
  const f = useCurrentFrame();
  let start = 0;
  return (
    <AbsoluteFill style={{ background: C.bg, color: C.white, fontFamily: FONT_UI, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 90% 12%,rgba(36,91,141,.23),transparent 49%),radial-gradient(ellipse at 0% 86%,rgba(33,57,102,.17),transparent 43%)" }} />
      <div style={{ position: "absolute", top: 66, left: 74, display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ background: C.blue, width: 8, height: 25, borderRadius: 3 }} />
        <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2, color: C.muted }}>ML FOR JAVA DEVELOPERS</span>
      </div>
      <div style={{ position: "absolute", right: 76, top: 66, fontSize: 22, color: C.muted }}>DAY 1 <span style={{ color: C.gold }}> / ML BASICS</span></div>
      {beats.map((beat, index) => {
        const from = start;
        start += beat.frames;
        return <Sequence key={beat.id} from={from} durationInFrames={beat.frames}><Beat index={index} /></Sequence>;
      })}
      {f >= TOTAL_FRAMES - 60 && (
        <AbsoluteFill style={{ background: C.bg, alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <div style={{ position: "absolute", top: 64, color: C.blue, fontSize: 22, letterSpacing: 3, fontWeight: 700 }}>ML FOR JAVA DEVELOPERS</div>
          <div style={{ fontFamily: FONT_BOLD, fontSize: 89, lineHeight: 1.07 }}>
            Learn from<br /><span style={{ color: C.gold }}>examples.</span><br />Predict what’s next.
          </div>
          <div style={{ marginTop: 54, fontSize: 25, color: C.muted, letterSpacing: 2 }}>DAY 1 · MACHINE LEARNING</div>
        </AbsoluteFill>
      )}
      <div style={{ position: "absolute", left: 74, right: 74, bottom: 76, height: 7, borderRadius: 4, background: C.line }}>
        <div style={{ width: `${Math.min(100, (f / TOTAL_FRAMES) * 100)}%`, height: "100%", borderRadius: 4, background: C.gold }} />
      </div>
    </AbsoluteFill>
  );
};

export const DayOneCover: React.FC = () => {
  React.useEffect(() => { loadFont(); }, []);
  return (
    <AbsoluteFill style={{ background: C.bg, color: C.white, fontFamily: FONT_UI, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 52% 47%,rgba(36,91,141,.27),transparent 48%),radial-gradient(ellipse at 100% 90%,rgba(33,57,102,.23),transparent 40%)" }} />
      <div style={{ position: "absolute", inset: "280px 56px", border: "2px solid rgba(61,165,244,.23)", borderRadius: 46 }} />
      <div style={{ position: "absolute", top: 345, left: 130, right: 130, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 22, letterSpacing: 2, fontWeight: 800, color: C.blue }}>ML FOR JAVA DEVELOPERS</div>
        <div style={{ fontSize: 19, letterSpacing: 2, fontWeight: 800, color: C.gold }}>DAY 1</div>
      </div>
      <div style={{ position: "absolute", top: 490, left: 90, right: 90, textAlign: "center", fontFamily: FONT_BOLD, fontSize: 83, lineHeight: 1.04, letterSpacing: -2.8 }}>
        HOW DID<br />YOUR INBOX<br /><span style={{ color: C.gold }}>KNOW?</span>
      </div>
      <div style={{ position: "absolute", top: 825, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <svg width="820" height="470" viewBox="0 0 820 470" style={{ overflow: "visible" }}>
          <ellipse cx="408" cy="418" rx="275" ry="28" fill="#050910" opacity=".55" />
          <g transform="translate(56 125) rotate(-11 110 75)">
            <Envelope x={0} y={0} label="REAL EMAIL" tone={C.green} scale={1.13} />
          </g>
          <g transform="translate(520 112) rotate(10 110 75)">
            <Envelope x={0} y={0} label="SPAM?" tone={C.red} scale={1.16} />
          </g>
          <path d="M 298 220 C 332 190 364 184 391 203" stroke={C.gold} strokeWidth="6" strokeDasharray="10 12" fill="none" />
          <path d="M 378 185 L 398 202 L 374 210" stroke={C.gold} strokeWidth="6" fill="none" strokeLinejoin="round" />
          <g transform="translate(244 98) scale(1.03)">
            <Robot f={0} />
          </g>
          <circle cx="410" cy="27" r="16" fill={C.gold} />
          <path d="M 402 27 L 408 33 L 419 20" fill="none" stroke={C.bg} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ position: "absolute", top: 1325, left: 92, right: 92, textAlign: "center", fontSize: 25, fontWeight: 700, color: C.muted, letterSpacing: 2 }}>
        A SIMPLE STORY ABOUT MACHINE LEARNING
      </div>
      <div style={{ position: "absolute", top: 1400, left: 96, right: 96, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
        {[{ label: "EXAMPLES", color: C.blue }, { label: "PATTERN", color: C.gold }, { label: "PREDICTION", color: C.green }].map((item, i) => (
          <React.Fragment key={item.label}>
            <div style={{ border: `2px solid ${item.color}`, color: item.color, background: "rgba(17,28,47,.8)", borderRadius: 22, padding: "18px 20px", fontSize: 17, fontWeight: 800, letterSpacing: 1.3 }}>{item.label}</div>
            {i < 2 && <div style={{ color: C.white, fontSize: 23, fontWeight: 700 }}>→</div>}
          </React.Fragment>
        ))}
      </div>
      <div style={{ position: "absolute", top: 1518, left: 0, right: 0, textAlign: "center", fontSize: 21, color: C.muted, letterSpacing: 1.2 }}>ONE IDEA AT A TIME · 120 SECONDS</div>
    </AbsoluteFill>
  );
};

export const DayOneCoverV2: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg, color: C.white, overflow: "hidden" }}>
    <Img
      src={staticFile("day01/cover-art-v2.png")}
      style={{ width: W, height: H, objectFit: "cover", position: "absolute" }}
    />
    <AbsoluteFill style={{ background: "linear-gradient(180deg,rgba(6,11,20,.24) 0%,rgba(6,11,20,.08) 34%,transparent 51%,rgba(6,11,20,.12) 100%)" }} />
    <div style={{ position: "absolute", left: 94, top: 338, border: `2px solid ${C.gold}`, borderRadius: 24, background: "rgba(11,15,23,.72)", padding: "12px 21px", color: C.gold, fontFamily: FONT_UI, fontSize: 20, fontWeight: 800, letterSpacing: 2 }}>
      MACHINE LEARNING · DAY 1
    </div>
    <div style={{ position: "absolute", left: 86, top: 410, width: 910, fontFamily: FONT_BOLD, fontSize: 87, lineHeight: 0.98, letterSpacing: -2.8, textShadow: "0 6px 24px rgba(0,0,0,.6)" }}>
      <div>HOW DID IT</div>
      <div style={{ color: C.gold }}>KNOW?</div>
    </div>
    <div style={{ position: "absolute", left: 94, bottom: 326, color: C.white, fontFamily: FONT_UI, fontSize: 20, fontWeight: 800, letterSpacing: 2, textShadow: "0 3px 16px rgba(0,0,0,.85)" }}>
      ML FOR JAVA DEVELOPERS
    </div>
    <div style={{ position: "absolute", right: 94, bottom: 326, color: C.blue, fontFamily: FONT_UI, fontSize: 20, fontWeight: 800, letterSpacing: 2, textShadow: "0 3px 16px rgba(0,0,0,.85)" }}>
      EPISODE 01
    </div>
  </AbsoluteFill>
);

export const DayOneCoverV3: React.FC = () => {
  React.useEffect(() => { loadFont(); }, []);
  return (
    <AbsoluteFill style={{ background: C.bg, color: C.white, fontFamily: FONT_UI, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 52% 42%,rgba(36,91,141,.16),transparent 52%)" }} />
      <div style={{ position: "absolute", top: 296, left: 72, right: 72, height: 2, background: C.line }} />
      <div style={{ position: "absolute", top: 329, left: 80, right: 80, display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 2, fontWeight: 800 }}>
        <span style={{ color: C.blue }}>ML FOR JAVA DEVELOPERS</span>
        <span style={{ color: C.gold }}>DAY 1</span>
      </div>

      <div style={{ position: "absolute", top: 424, left: 76, right: 76, fontFamily: FONT_BOLD, fontSize: 94, lineHeight: 0.95, letterSpacing: -2.5 }}>
        <div>WHAT IS</div>
        <div style={{ color: C.gold }}>MACHINE</div>
        <div>LEARNING?</div>
      </div>

      <div style={{ position: "absolute", top: 744, left: 82, right: 82, fontSize: 35, lineHeight: 1.24, fontWeight: 600, color: C.muted }}>
        How a spam filter learns<br />from examples
      </div>

      <div style={{ position: "absolute", top: 914, left: 72, right: 72, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, alignItems: "stretch" }}>
        {[
          { title: "EXAMPLES", sub: "past emails", tone: C.blue },
          { title: "PATTERN", sub: "a learned model", tone: C.gold },
          { title: "PREDICTION", sub: "new email", tone: C.green },
        ].map((item, i) => (
          <React.Fragment key={item.title}>
            <div style={{ height: 260, boxSizing: "border-box", padding: "26px 17px 20px", borderRadius: 24, border: `2px solid ${item.tone}`, background: C.panel, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", textAlign: "center" }}>
              <div style={{ color: item.tone, fontSize: 21, letterSpacing: 1.2, fontWeight: 800 }}>{item.title}</div>
              {i === 0 && <div style={{ display: "flex", flexDirection: "column", gap: 12 }}><span style={{ padding: "8px 15px", borderRadius: 14, background: "rgba(228,87,61,.15)", color: C.red, fontSize: 18, fontWeight: 800 }}>SPAM</span><span style={{ padding: "8px 15px", borderRadius: 14, background: "rgba(84,214,160,.14)", color: C.green, fontSize: 18, fontWeight: 800 }}>NOT SPAM</span></div>}
              {i === 1 && <svg width="150" height="94" viewBox="0 0 150 94"><path d="M30 24 L74 47 L120 19 M30 24 L43 75 L74 47 L112 72 M120 19 L112 72" stroke={C.line} strokeWidth="3" fill="none"/><circle cx="30" cy="24" r="9" fill={C.blue}/><circle cx="120" cy="19" r="9" fill={C.red}/><circle cx="43" cy="75" r="9" fill={C.blue}/><circle cx="112" cy="72" r="9" fill={C.red}/><circle cx="74" cy="47" r="13" fill={C.gold}/></svg>}
              {i === 2 && <div style={{ width: 132, height: 75, border: `3px solid ${C.green}`, borderRadius: 15, display: "grid", placeItems: "center", color: C.green, fontSize: 18, fontWeight: 800 }}>LIKELY SPAM</div>}
              <div style={{ color: C.muted, fontSize: 17, lineHeight: 1.2 }}>{item.sub}</div>
            </div>
            {i < 2 && <div style={{ position: "absolute", top: 122, left: `calc(${(i + 1) * 33.333}% - 14px)`, color: C.white, fontSize: 24, fontWeight: 800 }}>→</div>}
          </React.Fragment>
        ))}
      </div>

      <div style={{ position: "absolute", top: 1244, left: 80, right: 80, padding: "23px 28px", borderRadius: 22, background: C.panel2, borderLeft: `5px solid ${C.gold}`, fontSize: 27, lineHeight: 1.3, fontWeight: 600 }}>
        A model learns from past examples<br />to predict something new.
      </div>
      <div style={{ position: "absolute", top: 1450, left: 80, right: 80, borderTop: `2px solid ${C.line}`, paddingTop: 24, display: "flex", justifyContent: "space-between", color: C.muted, fontSize: 19, fontWeight: 700, letterSpacing: 1.2 }}>
        <span>ONE CONCEPT A DAY</span><span>120-SECOND EXPLAINER</span>
      </div>
    </AbsoluteFill>
  );
};

export const DayOneCoverV4: React.FC = () => (
  <AbsoluteFill style={{ background: "#FFF8E9", color: "#15233A", fontFamily: FONT_HAND, overflow: "hidden" }}>
    <AbsoluteFill style={{ backgroundImage: "radial-gradient(#E3DCCB 1px, transparent 1px)", backgroundSize: "28px 28px", opacity: 0.42 }} />
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <path d="M 92 310 C 332 297 720 315 986 304 M 94 1605 C 348 1617 718 1599 985 1610" fill="none" stroke="#263B58" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 9" opacity=".3" />
      <path d="M 137 918 C 155 903 183 906 201 918 C 181 937 154 939 137 918 Z" fill="#FFE07B" stroke="#172641" strokeWidth="4" strokeLinejoin="round" />
      <path d="M 910 849 C 930 831 962 835 978 850 C 958 870 930 871 910 849 Z" fill="#AEE8CE" stroke="#172641" strokeWidth="4" strokeLinejoin="round" />
      <path d="M 823 723 C 838 703 854 687 878 680 M 852 714 L 879 680 L 884 711" fill="none" stroke="#EA6E4B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 167 715 C 184 693 200 680 224 674 M 195 707 L 224 674 L 229 704" fill="none" stroke="#6E5AB7" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 146 1270 C 252 1246 333 1260 429 1250 M 647 1252 C 742 1257 823 1244 934 1266" fill="none" stroke="#243954" strokeWidth="4" strokeLinecap="round" opacity=".32" />
      <path d="M 870 535 l 11 20 22 4 -16 16 3 23 -20 -11 -20 11 4 -23 -17 -16 23 -4z" fill="#FFD95D" stroke="#192C47" strokeWidth="3" strokeLinejoin="round" />
      <path d="M 163 1378 l 8 14 16 3 -12 11 3 17 -15 -8 -14 8 3 -17 -12 -11 16 -3z" fill="#E9A7C2" stroke="#192C47" strokeWidth="3" strokeLinejoin="round" />
    </svg>

    <div style={{ position: "absolute", top: 347, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "15px 44px 19px", background: "#FFE06A", border: "3px solid #192C47", borderRadius: 34, transform: "rotate(-3deg)", fontSize: 56, fontWeight: 800, letterSpacing: 1.4, boxShadow: "5px 7px 0 rgba(25,44,71,.16)" }}>DAY 1</div>
    </div>

    <div style={{ position: "absolute", top: 464, left: 78, right: 78, textAlign: "center", fontSize: 72, lineHeight: 1.08, fontWeight: 800, letterSpacing: 0.2 }}>
      <div style={{ transform: "rotate(-1.5deg)" }}>WHAT IS</div>
      <div style={{ color: "#345FD1", transform: "rotate(1deg)" }}>MACHINE</div>
      <div style={{ color: "#E45D45", transform: "rotate(-0.8deg)" }}>LEARNING?</div>
    </div>

    <div style={{ position: "absolute", top: 738, left: 110, right: 110, textAlign: "center", fontSize: 36, lineHeight: 1.25, fontWeight: 600, color: "#31425A", transform: "rotate(-0.4deg)" }}>
      How does an inbox learn to spot spam?
    </div>

    <div style={{ position: "absolute", top: 873, left: 92, right: 92, height: 285, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ width: 220, textAlign: "center", transform: "rotate(-2deg)" }}>
        <svg width="190" height="132" viewBox="0 0 190 132">
          <path d="M 20 22 Q 92 13 169 23 L 165 103 Q 94 111 21 103 Z" fill="#D8EBFF" stroke="#1B2C45" strokeWidth="5" strokeLinejoin="round" />
          <path d="M 25 29 L 94 77 L 162 29" fill="none" stroke="#3971DE" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 28 99 L 77 60 M 160 99 L 111 60" fill="none" stroke="#3971DE" strokeWidth="4" strokeLinecap="round" />
          <circle cx="42" cy="91" r="8" fill="#E45D45" /><circle cx="65" cy="91" r="8" fill="#58AD87" />
        </svg>
        <div style={{ fontSize: 29, fontWeight: 700, color: "#345FD1", marginTop: 8 }}>EXAMPLES</div>
        <div style={{ fontSize: 22, color: "#526176" }}>spam + not spam</div>
      </div>

      <div style={{ fontSize: 50, color: "#E45D45", transform: "rotate(4deg)" }}>→</div>

      <div style={{ width: 220, textAlign: "center", transform: "rotate(1.6deg)" }}>
        <svg width="180" height="132" viewBox="0 0 180 132">
          <path d="M 35 31 L 86 61 L 139 27 M 35 31 L 47 100 L 86 61 L 132 101 M 139 27 L 132 101" fill="none" stroke="#43546A" strokeWidth="5" strokeLinecap="round" />
          <circle cx="35" cy="31" r="13" fill="#3971DE" stroke="#1B2C45" strokeWidth="4" /><circle cx="139" cy="27" r="13" fill="#E45D45" stroke="#1B2C45" strokeWidth="4" /><circle cx="47" cy="100" r="13" fill="#3971DE" stroke="#1B2C45" strokeWidth="4" /><circle cx="132" cy="101" r="13" fill="#E45D45" stroke="#1B2C45" strokeWidth="4" /><circle cx="86" cy="61" r="16" fill="#FFD95D" stroke="#1B2C45" strokeWidth="4" />
        </svg>
        <div style={{ fontSize: 29, fontWeight: 700, color: "#7659B5", marginTop: 8 }}>PATTERN</div>
        <div style={{ fontSize: 22, color: "#526176" }}>a learned model</div>
      </div>

      <div style={{ fontSize: 50, color: "#E45D45", transform: "rotate(-3deg)" }}>→</div>

      <div style={{ width: 220, textAlign: "center", transform: "rotate(-1.7deg)" }}>
        <svg width="190" height="132" viewBox="0 0 190 132">
          <path d="M 24 28 Q 93 18 165 29 L 161 103 Q 93 110 26 103 Z" fill="#D9F1E5" stroke="#1B2C45" strokeWidth="5" strokeLinejoin="round" />
          <path d="M 30 35 L 94 80 L 159 35" fill="none" stroke="#58AD87" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 40 91 Q 95 97 145 89" fill="none" stroke="#E45D45" strokeWidth="5" strokeLinecap="round" />
        </svg>
        <div style={{ fontSize: 29, fontWeight: 700, color: "#379269", marginTop: 8 }}>PREDICTION</div>
        <div style={{ fontSize: 22, color: "#526176" }}>a new email</div>
      </div>
    </div>

    <div style={{ position: "absolute", top: 1221, left: 96, right: 96, padding: "23px 18px 27px", textAlign: "center", background: "#FFF0AF", border: "3px solid #1B2C45", borderRadius: 18, transform: "rotate(-0.7deg)", fontSize: 31, lineHeight: 1.22, fontWeight: 700, boxShadow: "4px 6px 0 rgba(27,44,69,.14)" }}>
      Learn a pattern from examples.<br />Use it to predict something new.
    </div>

    <div style={{ position: "absolute", top: 1450, left: 0, right: 0, textAlign: "center", color: "#53647A", fontSize: 22, letterSpacing: 1.8, fontWeight: 700 }}>
      ML FOR JAVA DEVELOPERS · ONE IDEA A DAY
    </div>
  </AbsoluteFill>
);

export const DayOneCoverV5: React.FC = () => (
  <AbsoluteFill style={{ background: "#FFF8E9", color: "#15233A", fontFamily: FONT_HAND, overflow: "hidden" }}>
    <AbsoluteFill style={{ backgroundImage: "radial-gradient(#E3DCCB 1px, transparent 1px)", backgroundSize: "28px 28px", opacity: 0.42 }} />
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <path d="M 92 310 C 332 297 720 315 986 304 M 94 1605 C 348 1617 718 1599 985 1610" fill="none" stroke="#263B58" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 9" opacity=".3" />
      <path d="M 870 777 l 10 18 20 4 -15 14 3 21 -18 -10 -18 10 3 -21 -15 -14 20 -4z" fill="#FFD95D" stroke="#192C47" strokeWidth="3" strokeLinejoin="round" />
      <path d="M 163 1294 l 8 14 16 3 -12 11 3 17 -15 -8 -14 8 3 -17 -12 -11 16 -3z" fill="#E9A7C2" stroke="#192C47" strokeWidth="3" strokeLinejoin="round" />
      <path d="M 913 1288 C 929 1270 947 1262 967 1260 M 943 1280 L 967 1260 L 969 1287" fill="none" stroke="#6E5AB7" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

    <div style={{ position: "absolute", top: 336, left: 84, padding: "12px 32px 17px", background: "#FFE06A", border: "3px solid #192C47", borderRadius: 31, transform: "rotate(-3deg)", fontSize: 48, fontWeight: 800, boxShadow: "4px 6px 0 rgba(25,44,71,.15)" }}>DAY 1</div>

    <div style={{ position: "absolute", top: 445, left: 76, width: 655, fontFamily: FONT_HAND, fontSize: 72, lineHeight: 1.03, fontWeight: 800 }}>
      <div style={{ transform: "rotate(-1deg)" }}>WHAT IS</div>
      <div style={{ color: "#345FD1", transform: "rotate(.7deg)" }}>MACHINE</div>
      <div style={{ color: "#E45D45", transform: "rotate(-.5deg)" }}>LEARNING?</div>
    </div>

    <svg viewBox="0 0 300 350" width="275" height="321" style={{ position: "absolute", top: 425, right: 58 }}>
      <path d="M 62 337 Q 42 274 71 239 Q 102 215 151 216 Q 207 217 229 246 Q 250 287 238 337 Z" fill="#58AD87" stroke="#192C47" strokeWidth="8" strokeLinejoin="round" />
      <path d="M 111 226 L 146 273 L 184 226" fill="#FFF8E9" stroke="#192C47" strokeWidth="6" strokeLinejoin="round" />
      <path d="M 63 148 Q 55 76 105 55 Q 169 21 214 72 Q 242 111 219 173 L 203 220 Q 179 248 129 236 Q 92 225 71 191 Z" fill="#F3B782" stroke="#192C47" strokeWidth="8" strokeLinejoin="round" />
      <path d="M 62 148 Q 43 102 63 67 Q 78 40 110 41 Q 136 9 174 34 Q 212 33 224 70 Q 246 98 219 143 L 207 114 Q 187 119 169 95 Q 141 122 94 104 L 82 152 Z" fill="#3D305C" stroke="#192C47" strokeWidth="8" strokeLinejoin="round" />
      <path d="M 92 155 Q 121 145 143 157 L 141 176 Q 118 187 93 175 Z M 158 157 Q 183 145 207 155 L 204 176 Q 181 187 158 176 Z" fill="#D8EBFF" stroke="#345FD1" strokeWidth="6" strokeLinejoin="round" />
      <circle cx="122" cy="165" r="7" fill="#192C47" /><circle cx="180" cy="165" r="7" fill="#192C47" />
      <path d="M 142 167 L 158 167" stroke="#345FD1" strokeWidth="6" strokeLinecap="round" />
      <path d="M 127 198 Q 151 220 177 197" fill="none" stroke="#9E4050" strokeWidth="7" strokeLinecap="round" />
      <path d="M 78 263 Q 39 278 40 313" fill="none" stroke="#192C47" strokeWidth="12" strokeLinecap="round" />
      <path d="M 220 263 Q 261 273 262 307" fill="none" stroke="#192C47" strokeWidth="12" strokeLinecap="round" />
      <g transform="translate(208 276) rotate(-8)">
        <rect x="0" y="0" width="74" height="54" rx="9" fill="#FFE06A" stroke="#192C47" strokeWidth="5" />
        <path d="M 8 13 L 37 34 L 66 13" fill="none" stroke="#345FD1" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>

    <div style={{ position: "absolute", top: 789, left: 90, right: 90, textAlign: "center", fontSize: 32, fontWeight: 700, color: "#31425A", transform: "rotate(-.4deg)" }}>
      How can a computer learn to spot spam?
    </div>

    <div style={{ position: "absolute", top: 895, left: 76, right: 76, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 17 }}>
      {[
        { title: "RULES", detail: '“prize” → spam', note: "misses exceptions", tone: "#E9859B", bg: "#FFE1E5", tilt: "-1.5deg" },
        { title: "EXAMPLES", detail: "spam + not spam", note: "emails with labels", tone: "#345FD1", bg: "#D8EBFF", tilt: "1deg" },
        { title: "PATTERN", detail: "a learned model", note: "finds useful clues", tone: "#7659B5", bg: "#E9E0FF", tilt: "-0.8deg" },
        { title: "PREDICT", detail: "new email", note: "likely spam", tone: "#379269", bg: "#D9F1E5", tilt: "1.3deg" },
      ].map((item, i) => (
        <React.Fragment key={item.title}>
          <div style={{ height: 264, boxSizing: "border-box", padding: "18px 10px", textAlign: "center", border: "3px solid #192C47", borderRadius: 20, background: item.bg, transform: `rotate(${item.tilt})`, boxShadow: "3px 5px 0 rgba(27,44,69,.12)" }}>
            <div style={{ fontSize: 25, fontWeight: 800, color: item.tone }}>{item.title}</div>
            <div style={{ height: 96, display: "grid", placeItems: "center", fontSize: 23, fontWeight: 700, lineHeight: 1.05, color: "#1C2C43" }}>{item.detail}</div>
            <div style={{ borderTop: `2px dashed ${item.tone}`, paddingTop: 13, fontSize: 19, lineHeight: 1.08, color: "#45566D" }}>{item.note}</div>
          </div>
          {i < 3 && <div style={{ position: "absolute", top: 112, left: `calc(${(i + 1) * 25}% - 12px)`, color: "#E45D45", fontSize: 25, fontWeight: 800, textShadow: "0 1px #FFF8E9" }}>→</div>}
        </React.Fragment>
      ))}
    </div>

    <div style={{ position: "absolute", top: 1210, left: 96, right: 96, padding: "23px 22px 27px", textAlign: "center", background: "#FFE06A", border: "3px solid #192C47", borderRadius: 18, transform: "rotate(-.6deg)", fontSize: 30, lineHeight: 1.22, fontWeight: 700, boxShadow: "4px 6px 0 rgba(27,44,69,.14)" }}>
      Learn from examples.<br />Predict something new.
    </div>

    <div style={{ position: "absolute", top: 1420, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 16, fontSize: 27, letterSpacing: 0.4, fontWeight: 800 }}>
      <span style={{ color: "#345FD1" }}>JAVA DEVELOPER</span>
      <span style={{ color: "#E45D45", fontSize: 32 }}>→</span>
      <span style={{ color: "#379269" }}>ML ENGINEER</span>
    </div>
  </AbsoluteFill>
);

// Alternate high-contrast Reel cover following the user's revised thumbnail brief.
export const DayOneCoverV6: React.FC = () => (
  <AbsoluteFill style={{ background: "#07111F", color: "#F8FAFC", fontFamily: "Arial, Helvetica, sans-serif", overflow: "hidden" }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 48%, #142B47 0%, #0B192B 53%, #050B14 100%)" }} />
    <div style={{ position: "absolute", top: 328, left: 0, right: 0, textAlign: "center", color: "#9BB6D2", fontSize: 27, fontWeight: 800, letterSpacing: 5 }}>ML FOR JAVA DEVELOPERS</div>
    <div style={{ position: "absolute", top: 386, left: 0, right: 0, textAlign: "center", color: "#FFFFFF", fontSize: 79, lineHeight: 1.08, fontWeight: 900, letterSpacing: -2 }}>STOP WRITING RULES.</div>
    <div style={{ position: "absolute", top: 486, left: 0, right: 0, textAlign: "center", color: "#FFD84D", fontSize: 88, lineHeight: 1.08, fontWeight: 900, letterSpacing: -2 }}>SHOW EXAMPLES.</div>
    <div style={{ position: "absolute", top: 615, left: 410, width: 260, height: 7, borderRadius: 5, background: "#FFD84D", boxShadow: "0 0 26px #FFD84D88" }} />
    <svg viewBox="0 0 1080 1920" width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <filter id="glow"><feGaussianBlur stdDeviation="17" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle cx="521" cy="1042" r="278" fill="#FFD84D" opacity=".08" filter="url(#glow)" />
      {/* Inbox card */}
      <rect x="554" y="803" width="438" height="490" rx="34" fill="#111E31" stroke="#31506E" strokeWidth="5" />
      <rect x="584" y="835" width="378" height="68" rx="18" fill="#1A2B42" />
      <circle cx="616" cy="869" r="10" fill="#48D6B0" />
      <text x="642" y="879" fill="#DCE7F3" fontSize="25" fontWeight="700">YOUR INBOX</text>
      {[0, 1, 2].map((i) => <g key={i}>
        <rect x="584" y={929 + i * 103} width="378" height="82" rx="17" fill={i === 2 ? "#321F2B" : "#17263A"} stroke={i === 2 ? "#FF5964" : "#293D55"} strokeWidth="3" />
        <circle cx="616" cy={970 + i * 103} r="13" fill={i === 2 ? "#FF5964" : "#3F8CFF"} />
        <rect x="644" y={953 + i * 103} width={i === 2 ? 200 : 252} height="13" rx="7" fill="#E7EEF7" opacity=".86" />
        <rect x="644" y={977 + i * 103} width="174" height="9" rx="5" fill="#8DA2BA" opacity=".62" />
        {i === 2 && <text x="881" y={982 + i * 103} textAnchor="middle" fill="#FF737B" fontSize="16" fontWeight="900">SPAM?</text>}
      </g>)}
      {/* Friendly blue robot */}
      <path d="M 151 1085 L 101 1134 Q 83 1154 97 1171 Q 113 1187 131 1169 L 185 1121" fill="none" stroke="#438DFF" strokeWidth="28" strokeLinecap="round" />
      <path d="M 378 1085 L 430 1125" fill="none" stroke="#438DFF" strokeWidth="28" strokeLinecap="round" />
      <rect x="117" y="887" width="297" height="264" rx="73" fill="#173967" stroke="#438DFF" strokeWidth="12" />
      <rect x="154" y="932" width="223" height="132" rx="39" fill="#07111F" stroke="#2E5B8F" strokeWidth="5" />
      <ellipse cx="220" cy="988" rx="17" ry="25" fill="#F8FAFC"/><ellipse cx="310" cy="988" rx="17" ry="25" fill="#F8FAFC"/>
      <circle cx="224" cy="994" r="8" fill="#438DFF"/><circle cx="306" cy="994" r="8" fill="#438DFF"/>
      <path d="M 231 1031 Q 264 1064 299 1031" fill="none" stroke="#FFD84D" strokeWidth="8" strokeLinecap="round" />
      <path d="M 264 887 L 264 855 M 243 854 Q 264 824 285 854" fill="none" stroke="#438DFF" strokeWidth="9" strokeLinecap="round" />
      <circle cx="264" cy="840" r="12" fill="#FFD84D" />
      {/* SPAM envelope held in front */}
      <g transform="translate(274 1102) rotate(-8)">
        <rect x="0" y="0" width="246" height="154" rx="20" fill="#D92F49" stroke="#FF7180" strokeWidth="6" />
        <path d="M 9 19 L 123 94 L 237 19" fill="none" stroke="#FF9AA2" strokeWidth="7" strokeLinejoin="round" />
        <rect x="53" y="67" width="141" height="49" rx="8" fill="#F8FAFC" stroke="#7D1424" strokeWidth="4" transform="rotate(-6 123 92)" />
        <text x="123" y="101" textAnchor="middle" fill="#B82039" fontSize="24" fontWeight="1000" letterSpacing="1">SPAM</text>
      </g>
      <path d="M 163 1326 Q 296 1356 431 1322 M 590 1352 Q 755 1370 918 1341" fill="none" stroke="#406080" strokeWidth="3" strokeDasharray="5 13" opacity=".75" />
      <rect x="337" y="1358" width="406" height="58" rx="29" fill="#10233A" stroke="#365779" strokeWidth="2" />
      <text x="540" y="1396" textAnchor="middle" fill="#C9D9EA" fontSize="24" fontWeight="800" letterSpacing="3">DAY 1 · ML BASICS</text>
    </svg>
  </AbsoluteFill>
);

export const DayOneCheatSheet: React.FC = () => {
  React.useEffect(() => { loadFont(); }, []);
  const card = (title: string, color: string, children: React.ReactNode) => <div style={{ padding: "24px 27px", borderRadius: 24, border: `2px solid ${color}`, background: C.panel, marginBottom: 18 }}>{<div style={{ color, fontSize: 25, fontWeight: 900, letterSpacing: 1.2, marginBottom: 12 }}>{title}</div>}{children}</div>;
  return (
    <AbsoluteFill style={{ background: C.bg, color: C.white, fontFamily: FONT_UI, overflow: "hidden", padding: "74px 76px", boxSizing: "border-box" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 90% 12%,rgba(36,91,141,.23),transparent 49%),radial-gradient(ellipse at 0% 86%,rgba(33,57,102,.17),transparent 43%)" }} />
      <div style={{ position: "relative", color: C.blue, fontSize: 21, fontWeight: 900, letterSpacing: 2 }}>ML FOR JAVA DEVELOPERS · DAY 1</div>
      <div style={{ position: "relative", marginTop: 30, marginBottom: 22, fontFamily: FONT_BOLD, fontSize: 64, lineHeight: 1.02 }}>HOW DOES AN INBOX<br/><span style={{ color: C.gold }}>LEARN TO SPOT SPAM?</span></div>
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 20, padding: "20px 24px", borderRadius: 24, background: C.panel2, border: `2px solid ${C.line}`, marginBottom: 24 }}>
        <div style={{ flex: 1, textAlign: "center", color: C.blue, fontSize: 20, fontWeight: 900 }}>LABELED<br/>EXAMPLES</div><div style={{ color: C.gold, fontSize: 36 }}>→</div>
        <div style={{ flex: 1, textAlign: "center", color: C.gold, fontSize: 20, fontWeight: 900 }}>LEARNED<br/>PATTERN / MODEL</div><div style={{ color: C.gold, fontSize: 36 }}>→</div>
        <div style={{ flex: 1, textAlign: "center", color: C.green, fontSize: 20, fontWeight: 900 }}>NEW EMAIL<br/>PREDICTION</div>
      </div>
      {card("1 · SHOW LABELED EXAMPLES", C.blue, <div style={{ fontSize: 21, lineHeight: 1.5 }}><span style={{ color: C.red, fontWeight: 800 }}>“FREE PRIZE!!!” → SPAM</span><br/><span style={{ color: C.green, fontWeight: 800 }}>“Team lunch at 1” → SAFE</span><br/><span style={{ color: C.muted }}>Labels tell the learner the right answer for past emails.</span></div>)}
      {card("2 · THE MODEL FINDS REPEATING CLUES", C.gold, <div style={{ fontSize: 21, lineHeight: 1.45 }}>Examples may reveal patterns: ALL CAPS, urgent wording, unusual links, familiar senders, and ordinary context.<br/><span style={{ color: C.muted }}>Training adjusts the pattern from feedback.</span></div>)}
      {card("3 · PREDICT FOR A NEW CASE", C.green, <div style={{ padding: "14px 18px", borderRadius: 14, background: "#0B1625", color: C.gold, fontFamily: "monospace", fontSize: 20, lineHeight: 1.55 }}>model.train(emails, labels);<br/>model.predict(newEmail);</div>)}
      <div style={{ position: "relative", padding: "18px 22px", borderRadius: 20, borderLeft: `6px solid ${C.red}`, background: "#241D28", fontSize: 20, lineHeight: 1.4 }}><b>Remember:</b> a prediction is not a promise. Bad or incomplete examples can mislead a model; people still review important results.</div>
      <div style={{ position: "relative", marginTop: 22, color: C.muted, textAlign: "center", fontSize: 18, letterSpacing: 1.3 }}>JAVA DEVELOPER → ML ENGINEER · DAY 2: WHAT COUNTS AS DATA?</div>
      <div style={{ position: "absolute", right: 42, top: 360, transform: "scale(.42)", transformOrigin: "top right" }}><Robot f={0} mood="nodding" /></div>
    </AbsoluteFill>
  );
};
