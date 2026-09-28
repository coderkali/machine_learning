// Kicker + two-line headline at the top of each beat (Day 1 layout).
import { enter, T } from "./anim";
import { C, FONT_HEAD, FONT_UI } from "./theme";

export function BeatHeading({ f, kicker, line1, line2, accent = false }: { f: number; kicker: string; line1: string; line2: string; accent?: boolean }) {
  const t = enter(f, 2, T.enter);
  return (
    <>
      <div style={{ position: "absolute", left: 76, top: 156, color: C.gold, fontFamily: FONT_UI, fontSize: 20, letterSpacing: 2.6, fontWeight: 700, opacity: enter(f, 0, T.enter) }}>
        {kicker}
      </div>
      <div style={{ position: "absolute", left: 72, top: 200, right: 64, fontFamily: FONT_HEAD, fontSize: 84, lineHeight: 0.99, letterSpacing: -3.4, color: C.white, opacity: t, transform: `translateY(${15 * (1 - t)}px)` }}>
        {line1}
        <br />
        <span style={{ color: accent ? C.gold : C.white }}>{line2}</span>
      </div>
    </>
  );
}
