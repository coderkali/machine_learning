import { Caption, createTikTokStyleCaptions } from "@remotion/captions";
import React, { useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "../load-font";
import { COLORS, FONT_UI } from "../theme";
import { BrandSubtitlePage } from "./BrandSubtitlePage";

const SWITCH_CAPTIONS_EVERY_MS = 1200;

const KineticWord: React.FC<{ text: string; color: string; delayFrames: number }> = ({
  text,
  color,
  delayFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delayFrames;
  const progress = interpolate(local, [0, fps * 0.35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(progress, [0, 1], [0.6, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  return (
    <div
      style={{
        fontFamily: FONT_UI,
        fontWeight: 800,
        fontSize: 92,
        color,
        opacity,
        transform: `scale(${scale})`,
        lineHeight: 1.05,
      }}
    >
      {text}
    </div>
  );
};

export const HookTest: React.FC<{ src: string }> = ({ src }) => {
  const [subtitles, setSubtitles] = useState<Caption[]>([]);
  const { fps } = useVideoConfig();

  const subtitlesFile = src.replace(/\.mp3$/, ".json");

  useEffect(() => {
    loadFont();
    fetch(subtitlesFile)
      .then((r) => r.json())
      .then((data: Caption[]) => setSubtitles(data))
      .catch(() => setSubtitles([]));
  }, [subtitlesFile]);

  const { pages } = useMemo(() => {
    return createTikTokStyleCaptions({
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
      captions: subtitles ?? [],
    });
  }, [subtitles]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Audio src={src} />

      {/* Kinetic-type hook, word by word */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "flex-start",
          paddingLeft: 90,
        }}
      >
        <KineticWord text="ONE LINE" color={COLORS.textMain} delayFrames={0} />
        <KineticWord text="CAN SEPARATE" color={COLORS.textMain} delayFrames={12} />
        <KineticWord text="THEM." color={COLORS.yellow} delayFrames={24} />
      </AbsoluteFill>

      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const subtitleStartFrame = (page.startMs / 1000) * fps;
        const subtitleEndFrame = Math.min(
          nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
          subtitleStartFrame + SWITCH_CAPTIONS_EVERY_MS,
        );
        const durationInFrames = subtitleEndFrame - subtitleStartFrame;
        if (durationInFrames <= 0) return null;
        return (
          <Sequence key={index} from={subtitleStartFrame} durationInFrames={durationInFrames}>
            <BrandSubtitlePage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
