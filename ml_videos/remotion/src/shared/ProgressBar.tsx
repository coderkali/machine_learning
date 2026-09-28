import { C } from "./theme";

export function ProgressBar({ frame, total }: { frame: number; total: number }) {
  return (
    <div style={{ position: "absolute", left: 74, right: 74, bottom: 76, height: 7, borderRadius: 4, background: C.line }}>
      <div style={{ width: `${Math.min(100, (frame / total) * 100)}%`, height: "100%", borderRadius: 4, background: C.gold }} />
    </div>
  );
}
