import "./index.css";
import { Composition, staticFile } from "remotion";
import {
  CaptionedVideo,
  calculateCaptionedVideoMetadata,
  captionedVideoSchema,
} from "./CaptionedVideo";
import { HookTest } from "./Concept/HookTest";
import { ScatterDemo } from "./Concept/ScatterDemo";
import { LDAEpisode, totalEpisodeFrames } from "./Concept/LDAEpisode";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        calculateMetadata={calculateCaptionedVideoMetadata}
        schema={captionedVideoSchema}
        width={1080}
        height={1920}
        defaultProps={{
          src: staticFile("sample-video.mp4"),
        }}
      />
      <Composition
        id="HookTest"
        component={HookTest}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={30 * 7}
        defaultProps={{
          src: staticFile("audio/test_hook.mp3"),
        }}
      />
      <Composition
        id="ScatterDemo"
        component={ScatterDemo}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={30 * 6}
      />
      <Composition
        id="LDAEpisode"
        component={LDAEpisode}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={totalEpisodeFrames}
      />
    </>
  );
};
