import { C, FONT_UI, SERIES_NAME } from "./theme";

/** Top strip of every episode video: series name left, day + arc right (Day 1 layout). */
export function SeriesHeader({ day, arc }: { day: number; arc: string }) {
  return (
    <>
      <div style={{ position: "absolute", top: 66, left: 74, display: "flex", alignItems: "center", gap: 16, fontFamily: FONT_UI }}>
        <span style={{ background: C.blue, width: 8, height: 25, borderRadius: 3 }} />
        <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2, color: C.muted }}>{SERIES_NAME}</span>
      </div>
      <div style={{ position: "absolute", right: 76, top: 66, fontSize: 22, color: C.muted, fontFamily: FONT_UI }}>
        DAY {day} <span style={{ color: C.gold }}> / {arc.toUpperCase()}</span>
      </div>
    </>
  );
}
