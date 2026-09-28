import { Composition, registerRoot } from "remotion";
import { VisualLDA, TOTAL_FRAMES } from "./video";

const Root = () => (
  <Composition
    id="VisualLDA"
    component={VisualLDA}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={TOTAL_FRAMES}
  />
);
registerRoot(Root);
