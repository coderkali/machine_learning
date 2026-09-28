// Explainer kit — the reusable building blocks of the "animated technical explainer" format
// (claude/ANIMATION_GUIDE.md). Every episode composes these; nothing here is episode-specific.
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import React, { createContext, useContext } from "react";
import { staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { enter, pop } from "../anim";
import { cue } from "../cues";
import { DevMascot, type DevPose } from "../DevMascot";
import layout from "../layout.json";
import { FONT_UI } from "../theme";
import type { Timeline } from "../types";

export const K = {
  bg: "#EEF2F7",
  ink: "#111111",
  muted: "#6B7686",
  line: "#D5DCE5",
  panel: "#F6F8FB",
  blue: "#1E88E5",
  red: "#E53935",
  green: "#2E9E5B",
  yellow: "#FFD600",
  purple: "#7C3AED",
  mono: "Menlo, 'SF Mono', Consolas, monospace",
  head: "Impact, 'Haettenschweiler', 'Arial Narrow Bold', sans-serif",
  ui: FONT_UI,
};

// ── Timeline context: scenes ask "when is this word spoken?" ──────────────────────────────
const TimelineCtx = createContext<Timeline | null>(null);
export const TimelineProvider = TimelineCtx.Provider;

export function useTimeline() {
  const t = useContext(TimelineCtx);
  if (!t) throw new Error("useTimeline() outside <TimelineProvider>");
  return t;
}

/** Returns at(beat, "word|alt", nth) → absolute frame of that spoken word, plus beat helpers. */
export function useCues() {
  const t = useTimeline();
  // A beat missing from the timeline (e.g. a 30 s sample of the first beats) is "never": Infinity.
  const beat = (id: string) => t.beats.find((x) => x.id === id);
  return {
    at: (id: string, word: string, nth = 1) => (beat(id) ? cue(t, id, word, nth) + beat(id)!.from : Infinity),
    start: (id: string) => beat(id)?.from ?? Infinity,
    end: (id: string) => (beat(id) ? beat(id)!.from + beat(id)!.durationInFrames : Infinity),
    speechEnd: (id: string) => beat(id)?.speechTo ?? Infinity,
  };
}

// ── Stage ─────────────────────────────────────────────────────────────────────────────────
export const WIN = { x: 56, y: 336, w: 968, h: 846, chrome: 64, sidebar: 220 };

export function Workspace({ f, tabs, sidebar, children }: { f: number; tabs: React.ReactNode; sidebar?: React.ReactNode; children: React.ReactNode }) {
  const win = enter(f, 0, 7);
  return (
    <div style={{ position: "absolute", left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, background: "#fff", borderRadius: 24, border: `3px solid ${K.line}`, boxShadow: "0 18px 50px rgba(20,40,70,.12)", overflow: "hidden", opacity: win, transform: `scale(${0.94 + 0.06 * win})` }}>
      <div style={{ height: WIN.chrome, background: K.panel, borderBottom: `2px solid ${K.line}`, display: "flex", alignItems: "center", padding: "0 22px", gap: 10 }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <span key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />)}
        <div style={{ marginLeft: 26, display: "flex", gap: 8 }}>{tabs}</div>
      </div>
      {sidebar && (
        <div style={{ position: "absolute", left: 0, top: WIN.chrome, bottom: 0, width: WIN.sidebar, background: "#FAFBFC", borderRight: `2px solid ${K.line}`, padding: "26px 18px", boxSizing: "border-box" }}>{sidebar}</div>
      )}
      <div style={{ position: "absolute", left: sidebar ? WIN.sidebar : 0, right: 0, top: WIN.chrome, bottom: 0 }}>{children}</div>
    </div>
  );
}

export function Tab({ label, active, closed = 0, style }: { label: string; active: boolean; closed?: number; style?: React.CSSProperties }) {
  return (
    <div style={{ position: "relative", padding: "10px 20px", borderRadius: 12, background: active ? "#fff" : "transparent", border: `2px solid ${active ? K.line : "transparent"}`, fontSize: 22, fontWeight: 800, color: active ? K.ink : K.muted, whiteSpace: "nowrap", ...style }}>
      {label}
      {closed > 0 && <span style={{ position: "absolute", left: 10, right: 10, top: "50%", height: 4, background: K.red, transform: `scaleX(${closed})`, transformOrigin: "left" }} />}
    </div>
  );
}

export function Header({ f, day, title, badge }: { f: number; day: number; title: string; badge?: string }) {
  const t = enter(f, 0, 7);
  return (
    <div style={{ position: "absolute", left: 56, right: 56, top: layout.header.top, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: K.ui, opacity: t, transform: `translateY(${-12 * (1 - t)}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ background: K.blue, color: "#fff", fontFamily: K.head, fontSize: 30, padding: "0 14px", borderRadius: 8 }}>{badge ?? `DAY ${day}`}</span>
        <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, color: K.muted }}>ML FOR JAVA DEVS</span>
      </div>
      <span style={{ fontSize: 22, fontWeight: 800, color: K.ink }}>{title}</span>
    </div>
  );
}

export function Backdrop() {
  return <div style={{ position: "absolute", inset: 0, background: K.bg, backgroundImage: "radial-gradient(#D6DEE8 1.6px, transparent 1.6px)", backgroundSize: "34px 34px" }} />;
}

/** Context-first title card (ANIMATION_GUIDE rule 7): the topic, big, on frame 0; it shrinks away
 *  when the example starts (`until` = frame of the first example word). */
export function TitleCard({ f, line, sub, until }: { f: number; line: string; sub?: string; until: number }) {
  const inT = pop(f, 0, 7);
  const out = enter(f, until, T_OUT);
  if (out >= 1) return null;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(238,242,247,${0.85 * (1 - out)})` }} />
      <div style={{ position: "absolute", left: 50, right: 50, top: 560, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, opacity: 1 - out, transform: `translateY(${-320 * out}px) scale(${1 - 0.6 * out})` }}>
        <div style={{ ...inT, transform: `${inT.transform} rotate(-2deg)`, fontFamily: K.head, fontSize: 104, lineHeight: 1.02, textAlign: "center", background: K.yellow, color: K.ink, border: `8px solid ${K.ink}`, boxShadow: `10px 10px 0 ${K.ink}`, padding: "10px 30px" }}>{line}</div>
        {sub && <div style={{ ...pop(f, 8), fontFamily: K.ui, fontWeight: 800, fontSize: 38, color: "#fff", background: K.ink, borderRadius: 999, padding: "10px 28px" }}>{sub}</div>}
      </div>
    </>
  );
}
const T_OUT = 8;

/** Chapter bar (rule 8): where the viewer is in the story. */
export function ChapterBar({ f, chapters }: { f: number; chapters: { label: string; from: number }[] }) {
  const current = chapters.reduce((idx, ch, i) => (f >= ch.from ? i : idx), 0);
  const t = enter(f, 0, 7);
  return (
    <div style={{ position: "absolute", left: 56, right: 56, top: 284, display: "flex", gap: 8, opacity: t }}>
      {chapters.map((ch, i) => {
        const on = i === current;
        const past = i < current;
        const bump = on ? pop(f, ch.from, 8) : null;
        return (
          <div key={ch.label} style={{ flex: on ? 1.6 : 1, height: 38, borderRadius: 10, display: "grid", placeItems: "center", fontFamily: K.ui, fontSize: on ? 19 : 15, fontWeight: 900, letterSpacing: 0.5, whiteSpace: "nowrap", background: on ? K.blue : past ? "#DCE6F2" : "transparent", color: on ? "#fff" : past ? K.blue : "#9AA6B6", border: `2px solid ${on ? K.ink : past ? "#C5D4E6" : K.line}`, transform: bump ? `scale(${0.9 + 0.1 * Number(bump.opacity)})` : undefined }}>
            {past ? `✓ ${ch.label}` : ch.label}
          </div>
        );
      })}
    </div>
  );
}

// ── Content pieces ────────────────────────────────────────────────────────────────────────
export function Row({ y, title, sub, tone = "plain", badge, badgeTone = K.blue, style }: { y: number; title: string; sub?: string; tone?: "plain" | "alert" | "good"; badge?: React.ReactNode; badgeTone?: string; style?: React.CSSProperties }) {
  const border = tone === "alert" ? K.red : tone === "good" ? K.green : K.line;
  const bg = tone === "alert" ? "#FFF1F1" : tone === "good" ? "#EEF9F2" : "#FFFFFF";
  return (
    <div style={{ position: "absolute", left: 20, right: 20, top: y, height: 84, borderRadius: 16, background: bg, border: `3px solid ${border}`, display: "flex", alignItems: "center", gap: 18, padding: "0 20px", boxSizing: "border-box", fontFamily: K.ui, ...style }}>
      <div style={{ width: 44, height: 44, borderRadius: 22, background: tone === "alert" ? K.red : K.blue, color: "#fff", fontWeight: 900, fontSize: 22, display: "grid", placeItems: "center", flexShrink: 0 }}>{title[0]}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 27, fontWeight: 800, color: K.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
        {sub && <div style={{ fontSize: 19, color: K.muted }}>{sub}</div>}
      </div>
      {badge && <div style={{ padding: "8px 16px", borderRadius: 999, background: badgeTone, color: "#fff", fontSize: 21, fontWeight: 900, whiteSpace: "nowrap" }}>{badge}</div>}
    </div>
  );
}

export function Chip({ label, color = K.blue, fg = "#fff", size = 22, style }: { label: React.ReactNode; color?: string; fg?: string; size?: number; style?: React.CSSProperties }) {
  return <span style={{ display: "inline-block", background: color, color: fg, fontFamily: K.ui, fontWeight: 900, fontSize: size, padding: `${size * 0.35}px ${size * 0.75}px`, borderRadius: 999, whiteSpace: "nowrap", ...style }}>{label}</span>;
}

/** Big Impact term card — the "term reveal" moment. */
export function TermCard({ text, color = K.red, fg = "#fff", size = 118, style }: { text: string; color?: string; fg?: string; size?: number; style?: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", fontFamily: K.head, fontSize: size, color: fg, background: color, border: `8px solid ${K.ink}`, boxShadow: `10px 10px 0 ${K.ink}`, padding: "0 30px", lineHeight: 1.08, whiteSpace: "nowrap", ...style }}>
      {text}
    </div>
  );
}

export const tilt = (s: { opacity: number; transform: string }, deg: number) => ({ ...s, transform: `${s.transform} rotate(${deg}deg)` });

/** Java-ish syntax colouring for one line. */
export function Code({ text, dark = false }: { text: string; dark?: boolean }) {
  const parts = text.split(/("[^"]*"|\b(?:if|else|return|class|new|var)\b|\b(?:SPAM|SAFE|MAYBE)\b|\/\/.*$)/);
  return (
    <>
      {parts.map((p, i) => {
        const color = /^"/.test(p)
          ? dark ? "#86EFAC" : "#2E7D32"
          : /^(if|else|return|class|new|var)$/.test(p)
            ? dark ? "#C4B5FD" : K.purple
            : /^(SPAM|SAFE|MAYBE)$/.test(p)
              ? "#D9480F"
              : /^\/\//.test(p)
                ? dark ? "#94A3B8" : "#98A2B3"
                : dark ? "#E2E8F0" : K.ink;
        return <span key={i} style={{ color }}>{p}</span>;
      })}
    </>
  );
}

export function Folder({ label, count, active = false, flash = 0, color = K.blue }: { label: string; count: number | string; active?: boolean; flash?: number; color?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", marginBottom: 10, borderRadius: 12, background: flash > 0 ? `rgba(229,57,53,${0.18 * flash})` : active ? "#EAF2FC" : "transparent", fontSize: 25, fontWeight: 800, color: K.ink, fontFamily: K.ui }}>
      <span>{label}</span>
      <span style={{ background: color, color: "#fff", borderRadius: 999, padding: "2px 12px", fontSize: 20, transform: `scale(${1 + 0.35 * flash})` }}>{count}</span>
    </div>
  );
}

// ── Captions + narrator ───────────────────────────────────────────────────────────────────
export function CaptionPill({ f }: { f: number }) {
  const timeline = useTimeline();
  const page = timeline.captions.find((p) => f >= p.startFrame && f < p.endFrame);
  if (!page) return null;
  const t = enter(f, page.startFrame, 5);
  const L = layout.caption;
  // Bottom-anchored inside the safe zone (layout.json → caption), so QA checks the real geometry.
  return (
    <div style={{ position: "absolute", left: L.left, width: L.width, bottom: layout.canvas.height - L.bottom, display: "flex", justifyContent: "center" }}>
      <div style={{ background: K.ink, color: "#fff", borderRadius: 18, padding: `${L.paddingY}px ${L.paddingX}px`, fontFamily: K.ui, fontSize: L.fontSize, fontWeight: 800, textAlign: "center", maxWidth: L.width, boxSizing: "border-box", lineHeight: L.lineHeight, opacity: t, transform: `translateY(${10 * (1 - t)}px)` }}>
        {page.words.map((w, i) => (
          <span key={i} style={{ color: f >= w.startFrame && f < w.endFrame ? K.yellow : "#fff" }}>{(i ? " " : "") + w.text}</span>
        ))}
      </div>
    </div>
  );
}

/** Mouth openness 0..1 from the narration volume at this frame (lip-sync). */
export function useMouth(frame: number) {
  const { fps } = useVideoConfig();
  const timeline = useTimeline();
  const audio = useAudioData(staticFile(timeline.audio));
  if (!audio) return 0;
  const bins = visualizeAudio({ fps, frame, audioData: audio, numberOfSamples: 32 });
  const level = bins.slice(0, 12).reduce((s, v) => s + v, 0) / 12;
  return Math.min(1, Math.max(0, (level - 0.012) * 18));
}

/** The series narrator, bottom-left, overlapping the window like the reference reels. */
export function Narrator({ pose }: { pose: DevPose }) {
  const f = useCurrentFrame();
  const mouth = useMouth(f);
  return (
    <div style={{ position: "absolute", left: 0, top: 930, ...pop(f, 2) }}>
      <DevMascot height={620} pose={pose} mouth={mouth} />
    </div>
  );
}
