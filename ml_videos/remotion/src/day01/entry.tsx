import { Composition, registerRoot } from "remotion";
import { DayOne, DayOneV2, DayOneV3, DayOneCheatSheet, DayOneCover, DayOneCoverV2, DayOneCoverV3, DayOneCoverV4, DayOneCoverV5, DayOneCoverV6, TOTAL_FRAMES, TOTAL_FRAMES_V2, TOTAL_FRAMES_V3 } from "./video";

const Root = () => (
  <>
    <Composition
      id="DayOneML"
      component={DayOne}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={TOTAL_FRAMES}
    />
    <Composition
      id="DayOneMLV2"
      component={DayOneV2}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={TOTAL_FRAMES_V2}
    />
    <Composition id="DayOneMLV3" component={DayOneV3} width={1080} height={1920} fps={30} durationInFrames={TOTAL_FRAMES_V3} />
    <Composition id="DayOneCheatSheet" component={DayOneCheatSheet} width={1080} height={1350} fps={30} durationInFrames={1} />
    <Composition
      id="DayOneCover"
      component={DayOneCover}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1}
    />
    <Composition
      id="DayOneCoverV2"
      component={DayOneCoverV2}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1}
    />
    <Composition
      id="DayOneCoverV3"
      component={DayOneCoverV3}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1}
    />
    <Composition
      id="DayOneCoverV4"
      component={DayOneCoverV4}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1}
    />
    <Composition
      id="DayOneCoverV5"
      component={DayOneCoverV5}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1}
    />
    <Composition
      id="DayOneCoverV6"
      component={DayOneCoverV6}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1}
    />
  </>
);

registerRoot(Root);
