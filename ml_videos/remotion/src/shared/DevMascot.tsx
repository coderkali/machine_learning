// Original series mascot for thumbnails: a cartoon Java developer in the series-blue hoodie,
// pointing up and holding a coffee mug. Thick ink outlines, full body, tall format (like the
// reference grid style) — deliberately NOT based on any existing cartoon character.
const INK = "#111111";
const SKIN = "#F4C29B";
const HAIR = "#2B1D16";
const HOODIE = "#1E88E5";
const HOODIE_DARK = "#1565C0";
const JEANS = "#2F4B7C";
const RED = "#E53935";

const o = { stroke: INK, strokeWidth: 9, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

function Limb({ d, width, color }: { d: string; width: number; color: string }) {
  return (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth={width + 18} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

export type DevPose = "point" | "present";

type Props = {
  height?: number;
  style?: React.CSSProperties;
  /** "point": finger up (thumbnail). "present": arm out to the right, towards the content. */
  pose?: DevPose;
  /** 0 = closed smile, 1 = wide open — drive it from the voice volume for lip-sync. */
  mouth?: number;
};

export function DevMascot({ height = 1400, style, pose = "point", mouth = 1 }: Props) {
  const m = Math.max(0, Math.min(1, mouth));
  const armUp = pose === "point";
  return (
    <svg viewBox="0 0 520 1400" width={(height * 520) / 1400} height={height} style={{ overflow: "visible", ...style }}>
      {/* legs + shoes */}
      <path d="M165 840 L255 840 L248 1275 L178 1275 Z" fill={JEANS} {...o} />
      <path d="M265 840 L355 840 L342 1275 L272 1275 Z" fill={JEANS} {...o} />
      <path d="M215 900 L212 1260 M308 900 L306 1260" stroke="#24406B" strokeWidth={5} />
      <path d="M150 1285 Q150 1250 185 1250 L250 1250 Q262 1285 258 1330 L138 1330 Q130 1305 150 1285 Z" fill="#FFFFFF" {...o} />
      <path d="M270 1250 L335 1250 Q370 1250 382 1290 L384 1330 L264 1330 Q258 1285 270 1250 Z" fill="#FFFFFF" {...o} />
      <path d="M150 1300 L255 1300 M268 1300 L380 1300" stroke={RED} strokeWidth={10} />
      <path d="M138 1330 L258 1330 M264 1330 L384 1330" stroke={INK} strokeWidth={14} strokeLinecap="round" />

      {/* right arm: raised (point) or held out towards the content (present) */}
      <Limb d={armUp ? "M340 460 Q425 430 440 330 L448 240" : "M340 460 Q420 470 460 430 L500 392"} width={64} color={HOODIE} />

      {/* hoodie */}
      <path d="M150 420 Q250 392 350 420 L388 560 L378 885 Q250 912 142 885 L132 560 Z" fill={HOODIE} {...o} />
      <path d="M142 850 Q250 878 378 850 L378 885 Q250 912 142 885 Z" fill={HOODIE_DARK} {...o} />
      <path d="M182 740 L318 740 L334 832 L166 832 Z" fill={HOODIE_DARK} {...o} />
      <path d="M186 404 Q250 470 314 404" fill={HOODIE_DARK} {...o} />
      <path d="M226 446 L220 545 M274 446 L280 545" stroke="#FFFFFF" strokeWidth={7} strokeLinecap="round" />
      <circle cx="220" cy="552" r="8" fill="#FFFFFF" stroke={INK} strokeWidth={4} />
      <circle cx="280" cy="552" r="8" fill="#FFFFFF" stroke={INK} strokeWidth={4} />
      {/* chest logo: coffee cup with steam */}
      <circle cx="250" cy="640" r="52" fill="#FFFFFF" {...o} strokeWidth={7} />
      <path d="M222 628 L278 628 L272 672 Q250 684 228 672 Z" fill={HOODIE} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M278 636 Q294 640 290 654 Q286 664 274 662" fill="none" stroke={INK} strokeWidth={5} />
      <path d="M238 620 Q232 610 240 600 Q248 590 242 580 M258 620 Q252 610 260 600 Q268 590 262 580" fill="none" stroke={RED} strokeWidth={5} strokeLinecap="round" />

      {armUp ? (
        <>
          <rect x="436" y="92" width="30" height="96" rx="15" fill={SKIN} {...o} strokeWidth={8} />
          <ellipse cx="450" cy="205" rx="36" ry="40" fill={SKIN} {...o} strokeWidth={8} />
          <path d="M424 196 Q448 188 466 200" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
        </>
      ) : (
        <>
          <rect x="512" y="356" width="80" height="28" rx="14" fill={SKIN} {...o} strokeWidth={8} transform="rotate(-24 512 370)" />
          <ellipse cx="512" cy="382" rx="38" ry="34" fill={SKIN} {...o} strokeWidth={8} />
        </>
      )}

      {/* lowered left arm holding the mug */}
      <Limb d="M160 455 Q105 490 100 610 L108 735" width={64} color={HOODIE} />
      <circle cx="112" cy="768" r="34" fill={SKIN} {...o} strokeWidth={8} />
      <g transform="translate(46 700)">
        <path d="M112 30 Q146 30 146 62 Q146 94 112 94" fill="none" stroke={INK} strokeWidth={24} />
        <path d="M112 30 Q146 30 146 62 Q146 94 112 94" fill="none" stroke="#FFFFFF" strokeWidth={10} />
        <rect x="18" y="14" width="100" height="112" rx="16" fill="#FFFFFF" {...o} />
        <path d="M44 88 Q36 76 46 64 Q56 52 48 40 M72 88 Q64 76 74 64 Q84 52 76 40" fill="none" stroke={HOODIE} strokeWidth={7} strokeLinecap="round" />
        <path d="M36 104 Q68 116 100 104" fill="none" stroke={RED} strokeWidth={7} strokeLinecap="round" />
        <path d="M44 0 Q34 -22 46 -42 Q58 -62 48 -84 M84 0 Q74 -22 86 -42 Q98 -62 88 -84" fill="none" stroke="#9AA8B8" strokeWidth={8} strokeLinecap="round" />
      </g>
      <path d="M92 752 Q112 742 132 752 M92 776 Q112 766 132 776" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* neck + head */}
      <rect x="222" y="350" width="56" height="70" fill={SKIN} {...o} />
      <circle cx="144" cy="255" r="28" fill={SKIN} {...o} />
      <circle cx="356" cy="255" r="28" fill={SKIN} {...o} />
      <ellipse cx="250" cy="245" rx="110" ry="130" fill={SKIN} {...o} />
      <path d="M138 240 Q122 150 165 108 L150 64 L206 92 L216 40 L256 86 L288 36 L302 94 L350 66 L338 118 Q384 160 364 244 Q352 192 322 172 Q262 198 196 172 Q160 192 138 240 Z" fill={HAIR} {...o} />
      <path d="M168 206 Q200 186 232 200 M268 200 Q300 186 332 206" fill="none" stroke={HAIR} strokeWidth={11} strokeLinecap="round" />
      <rect x="164" y="222" width="80" height="66" rx="22" fill="#FFFFFF" {...o} />
      <rect x="256" y="222" width="80" height="66" rx="22" fill="#FFFFFF" {...o} />
      <path d="M244 250 L256 250" stroke={INK} strokeWidth={8} />
      <circle cx="210" cy="258" r="15" fill={INK} />
      <circle cx="290" cy="258" r="15" fill={INK} />
      <circle cx="215" cy="252" r="5" fill="#FFFFFF" />
      <circle cx="295" cy="252" r="5" fill="#FFFFFF" />
      <path d="M252 290 Q240 312 256 316" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <ellipse cx="180" cy="315" rx="18" ry="10" fill="#EC8C80" opacity={0.45} />
      <ellipse cx="320" cy="315" rx="18" ry="10" fill="#EC8C80" opacity={0.45} />
      <path d={`M206 328 Q250 ${342 + 40 * m} 294 328 Q250 ${338 + 4 * m} 206 328 Z`} fill="#8B1E2B" {...o} strokeWidth={7} />
      {m > 0.25 && <path d="M214 332 Q250 344 286 332 L284 340 Q250 350 216 340 Z" fill="#FFFFFF" />}
    </svg>
  );
}
