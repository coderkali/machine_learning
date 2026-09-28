// Pipeline draft: plays the mastered narration with Whisper-timed captions on the shared chrome.
// Used to check timing + run QA before an episode's real scenes exist. Episode scenes replace
// the placeholder robot per beat; everything else here is reused as-is.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "../load-font";
import {
  BeatHeading,
  C,
  CaptionBox,
  EndCard,
  FONT_UI,
  ProgressBar,
  Robot,
  SeriesHeader,
  type BeatType,
  type EpisodeMeta,
  type RobotPose,
  type Timeline,
} from "../shared";

export type EpisodeDraftProps = { timeline: Timeline; meta: EpisodeMeta };

const POSE: Record<BeatType, RobotPose> = {
  hook: "shocked",
  problem: "facepalm",
  insight: "thinking",
  explain: "nodding",
  term: "pointing",
  caveat: "skeptical",
  java: "happy",
  takeaway: "pointing",
  done: "happy",
  teaser: "pointing",
};

function BeatPlaceholder({ index, type, id }: { index: number; type: BeatType; id: string }) {
  const f = useCurrentFrame();
  return (
    <>
      <BeatHeading f={f} kicker={`BEAT ${index + 1} · ${type.toUpperCase()}`} line1={id.toUpperCase()} line2="scene goes here" accent />
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center" }}>
        <Robot f={f} pose={POSE[type]} mug={type === "java"} size={520} />
      </div>
    </>
  );
}

export const EpisodeDraft: React.FC<EpisodeDraftProps> = ({ timeline, meta }) => {
  React.useEffect(() => {
    loadFont();
  }, []);
  const f = useCurrentFrame();
  const last = timeline.beats[timeline.beats.length - 1];
  const doneWord = timeline.captions.flatMap((p) => p.words).find((w) => w.startFrame >= last.from && /^done[.!]?$/i.test(w.text));
  const endCardFrom = doneWord ? doneWord.startFrame : Math.max(last.from, timeline.totalFrames - 90);

  return (
    <AbsoluteFill style={{ background: C.bg, color: C.white, fontFamily: FONT_UI, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 90% 12%,rgba(36,91,141,.23),transparent 49%),radial-gradient(ellipse at 0% 86%,rgba(33,57,102,.17),transparent 43%)" }} />
      <Audio src={staticFile(timeline.audio)} />
      <SeriesHeader day={meta.day} arc={meta.topic} />
      {timeline.beats.map((beat, i) => (
        <Sequence key={beat.id} from={beat.from} durationInFrames={i === timeline.beats.length - 1 ? endCardFrom - beat.from : beat.durationInFrames}>
          <BeatPlaceholder index={i} type={beat.type} id={beat.id} />
        </Sequence>
      ))}
      <Sequence from={endCardFrom}>
        <EndCard f={f - endCardFrom} day={meta.day} nextDay={meta.next.day} nextTitle={meta.next.title} />
      </Sequence>
      <CaptionBox pages={timeline.captions} frame={f} />
      <ProgressBar frame={f} total={timeline.totalFrames} />
    </AbsoluteFill>
  );
};
