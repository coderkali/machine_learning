import { TikTokPage } from "@remotion/captions";
import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BrandCaptionPage } from "./BrandCaptionPage";

export const BrandSubtitlePage: React.FC<{ readonly page: TikTokPage }> = ({
  page,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 5,
  });

  return (
    <AbsoluteFill>
      <BrandCaptionPage enterProgress={enter} page={page} />
    </AbsoluteFill>
  );
};
