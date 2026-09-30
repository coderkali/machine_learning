// Studio defaults to Day 1; scripts/thumb.mjs and scripts/draft.mjs pass any day via --props.
import React from "react";
import { Composition, Still } from "remotion";
import day00 from "../episodes/day_00/episode.json";
import day00Timeline from "../episodes/day_00/generated/timeline.json";
import day01 from "../episodes/day_01/episode.json";
import day02 from "../episodes/day_02/episode.json";
import day02Timeline from "../episodes/day_02/generated/timeline.json";
// Voice test (2026-09-28): same intro beat in Viraj (97) vs the creator's clone (98). Remove after the decision.
import day97 from "../episodes/day_97/episode.json";
import day97Timeline from "../episodes/day_97/generated/timeline.json";
import day98 from "../episodes/day_98/episode.json";
import day98Timeline from "../episodes/day_98/generated/timeline.json";
import day01Timeline from "../episodes/day_01/generated/timeline.json";
import { FPS, H, W, type EpisodeMeta, type Timeline } from "../shared";
import { EpisodeDraft, type EpisodeDraftProps } from "./EpisodeDraft";
import { Day00 } from "../episodes/day_00/Day00";
import { Day01, type EpisodeProps } from "../episodes/day_01/Day01";
import { Day02 } from "../episodes/day_02/Day02";
import { Thumbnail, type ThumbnailProps } from "./Thumbnail";

const meta = day01 as EpisodeMeta;

export const SeriesRoot: React.FC = () => (
  <>
    <Still id="Thumbnail" component={Thumbnail} width={W} height={H} defaultProps={{ meta } satisfies ThumbnailProps} />
    {/* Episodes: one composition per day; scripts/render.mjs passes the timeline via --props. */}
    <Composition
      id="Day00"
      component={Day00}
      width={W}
      height={H}
      fps={FPS}
      durationInFrames={1}
      defaultProps={{ meta: day00 as EpisodeMeta, timeline: day00Timeline as Timeline } satisfies EpisodeProps}
      calculateMetadata={({ props }) => ({ durationInFrames: props.timeline.totalFrames, fps: props.timeline.fps })}
    />
    <Composition
      id="Day97"
      component={Day00}
      width={W}
      height={H}
      fps={FPS}
      durationInFrames={1}
      defaultProps={{ meta: day97 as EpisodeMeta, timeline: day97Timeline as Timeline } satisfies EpisodeProps}
      calculateMetadata={({ props }) => ({ durationInFrames: props.timeline.totalFrames, fps: props.timeline.fps })}
    />
    <Composition
      id="Day98"
      component={Day00}
      width={W}
      height={H}
      fps={FPS}
      durationInFrames={1}
      defaultProps={{ meta: day98 as EpisodeMeta, timeline: day98Timeline as Timeline } satisfies EpisodeProps}
      calculateMetadata={({ props }) => ({ durationInFrames: props.timeline.totalFrames, fps: props.timeline.fps })}
    />
    <Composition
      id="Day01"
      component={Day01}
      width={W}
      height={H}
      fps={FPS}
      durationInFrames={1}
      defaultProps={{ meta, timeline: day01Timeline as Timeline } satisfies EpisodeProps}
      calculateMetadata={({ props }) => ({ durationInFrames: props.timeline.totalFrames, fps: props.timeline.fps })}
    />
    <Composition
      id="Day02"
      component={Day02}
      width={W}
      height={H}
      fps={FPS}
      durationInFrames={1}
      defaultProps={{ meta: day02 as EpisodeMeta, timeline: day02Timeline as Timeline } satisfies EpisodeProps}
      calculateMetadata={({ props }) => ({ durationInFrames: props.timeline.totalFrames, fps: props.timeline.fps })}
    />
    <Composition
      id="EpisodeDraft"
      component={EpisodeDraft}
      width={W}
      height={H}
      fps={FPS}
      durationInFrames={1}
      defaultProps={{ meta, timeline: day01Timeline as Timeline } satisfies EpisodeDraftProps}
      calculateMetadata={({ props }) => ({ durationInFrames: props.timeline.totalFrames, fps: props.timeline.fps })}
    />
  </>
);
