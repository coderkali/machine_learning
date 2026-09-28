// "DAY N DONE" + next-episode teaser. Text follows the locked end card format:
// "DAY N · ML FOR JAVA DEVELOPERS" and "NEXT → DAY N+1: …".
import { enter, T } from "./anim";
import { Robot } from "./Robot";
import { C, FONT_HEAD, FONT_UI, SERIES_NAME } from "./theme";

export function EndCard({ f, day, nextDay, nextTitle }: { f: number; day: number; nextDay: number; nextTitle: string }) {
  const t = enter(f, 0, T.enter);
  const teaser = enter(f, T.enter, T.enter);
  return (
    <div style={{ position: "absolute", left: 72, right: 72, top: 470, textAlign: "center", fontFamily: FONT_UI }}>
      <div style={{ opacity: t, transform: `scale(${0.9 + t * 0.1})`, fontFamily: FONT_HEAD, fontSize: 118, color: C.gold, letterSpacing: -2 }}>
        DAY {day} DONE
      </div>
      <div style={{ marginTop: 12, fontSize: 24, letterSpacing: 3, color: C.muted, fontWeight: 700, opacity: t }}>
        DAY {day} · {SERIES_NAME}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 40, opacity: t }}>
        <Robot f={f} pose="happy" mug size={260} />
      </div>
      <div
        style={{
          marginTop: 34,
          opacity: teaser,
          transform: `translateY(${20 * (1 - teaser)}px)`,
          display: "inline-block",
          padding: "18px 30px",
          borderRadius: 24,
          border: `2px solid ${C.blue}`,
          background: "rgba(61,165,244,.12)",
          color: C.white,
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: 0.5,
        }}
      >
        NEXT <span style={{ color: C.blue }}>→</span> DAY {nextDay}: {nextTitle.toUpperCase()}
      </div>
    </div>
  );
}
