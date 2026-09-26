"""
Shared visual style for "ML for Java Developers".

Every episode scene should import from here instead of hardcoding colors,
fonts, or the intro/outro. Keeps every video looking like the same series.
"""

import os
from dotenv import load_dotenv
load_dotenv()
if "ELEVENLABS_API_KEY" in os.environ:
    os.environ["ELEVEN_API_KEY"] = os.environ["ELEVENLABS_API_KEY"]

from manim import *
from manim_voiceover import VoiceoverScene
from manim_voiceover.services.elevenlabs import ElevenLabsService

# ---------------------------------------------------------------------------
# Palette — dark background, blue + yellow accents. Change here, not per-scene.
# ---------------------------------------------------------------------------
BG_COLOR = "#0B0F17"        # near-black navy, not pure black (easier on OLED + looks designed)
BLUE = "#3DA5F4"            # primary accent — structure, data, "what it is"
BLUE_DIM = "#1B4E78"        # muted blue for secondary shapes / de-emphasized elements
YELLOW = "#F4C542"          # highlight accent — the key idea, the "aha", call to action
TEXT_MAIN = "#F5F7FA"       # near-white body text
TEXT_DIM = "#8A93A1"        # secondary/caption text, low-emphasis labels
RED_FLAG = "#E4573D"        # sparing use — errors, "this breaks", outliers to remove

SERIES_NAME = "ML for Java Developers"
SERIES_TAGLINE = "One ML concept a day, animated."
HANDLE = "@ml.for.java.devs"  # placeholder — update once the Instagram handle is registered

# ---------------------------------------------------------------------------
# Type scale. No custom font install required — Manim's default renders fine
# and avoids a missing-font render failure. Bump this list if fonts are
# installed later (e.g. a condensed display face for titles).
# ---------------------------------------------------------------------------
FONT = ""  # empty string = manim/Pango default font
SIZE_TITLE = 64
SIZE_SUBTITLE = 36
SIZE_BODY = 32
SIZE_CAPTION = 24
SIZE_TAG = 28


class MLScene(VoiceoverScene):
    """Base scene every episode subclasses. Sets background + voice service."""

    def setup_voice(self):
        self.set_speech_service(
            ElevenLabsService(
                voice_name=os.environ["ELEVEN_VOICE_NAME"],
                model="eleven_multilingual_v2",
            )
        )

    def setup(self):
        super().setup()
        self.camera.background_color = BG_COLOR
        self.setup_voice()


# ---------------------------------------------------------------------------
# Reusable helpers
# ---------------------------------------------------------------------------

def series_wordmark(scale=1.0):
    """Small persistent brand mark: 'ML' in yellow + series name in blue-gray."""
    ml = Text("ML", font=FONT, font_size=int(SIZE_TAG * scale), color=YELLOW, weight=BOLD)
    rest = Text(" for Java Developers", font=FONT, font_size=int(SIZE_TAG * scale * 0.7), color=TEXT_DIM)
    return VGroup(ml, rest).arrange(RIGHT, buff=0.08, aligned_edge=DOWN)


def title_text(text, size=SIZE_TITLE, color=TEXT_MAIN):
    return Text(text, font=FONT, font_size=size, color=color, weight=BOLD)


def body_text(text, size=SIZE_BODY, color=TEXT_MAIN):
    return Text(text, font=FONT, font_size=size, color=color)


def accent_underline(mobject, color=YELLOW, buff=0.15):
    """Yellow underline under a title/word to mark it as the key term."""
    line = Line(LEFT, RIGHT, color=color, stroke_width=6)
    line.width = mobject.width
    line.next_to(mobject, DOWN, buff=buff)
    return line


def intro_bumper(scene: MLScene, concept_name: str):
    """
    ~3s silent-narration bumper used at the start of every concept episode:
    wordmark in, concept title in, yellow underline. Caller narrates over it
    or calls it inside its own voiceover block.
    """
    mark = series_wordmark().to_edge(UP, buff=0.7)
    title = title_text(concept_name).move_to(ORIGIN)
    underline = accent_underline(title)
    scene.play(FadeIn(mark), run_time=0.4)
    scene.play(Write(title), run_time=1.2)
    scene.play(Create(underline), run_time=0.4)
    scene.wait(0.3)
    return VGroup(mark, title, underline)


CAPTION_Y = -3.0  # safe zone: stays clear of Reels/Shorts bottom UI rail
SAFE_MARGIN = 0.6  # horizontal buffer from each frame edge


def fit_width(mobject, max_width=None):
    """Scale a mobject down (never up) so it never overflows the safe frame width."""
    if max_width is None:
        max_width = config.frame_width - 2 * SAFE_MARGIN
    if mobject.width > max_width:
        mobject.scale_to_fit_width(max_width)
    return mobject


def caption_at(text, size=SIZE_CAPTION, color=TEXT_MAIN):
    cap = Text(text, font=FONT, font_size=size, color=color)
    fit_width(cap)
    cap.move_to([0, CAPTION_Y, 0])
    return cap


def short_outro(scene: MLScene, cta: str = "Follow · one ML concept a day"):
    """Brief, small outro for concept episodes — no full-screen fade, just a
    bottom-corner tag that appears and clears quickly (no long branded card)."""
    tag = fit_width(body_text(cta, size=SIZE_CAPTION, color=YELLOW)).to_edge(DOWN, buff=0.6)
    scene.play(FadeIn(tag, shift=UP * 0.1), run_time=0.4)
    scene.wait(1.0)
    scene.play(FadeOut(tag), run_time=0.3)


def outro_card(scene: MLScene, cta: str = "Follow for one ML concept a day"):
    """Standard outro: series wordmark + tagline + follow CTA."""
    scene.play(FadeOut(*scene.mobjects))
    mark = series_wordmark(scale=1.6).move_to(UP * 1.2)
    tagline = body_text(SERIES_TAGLINE, size=SIZE_SUBTITLE, color=TEXT_DIM).next_to(mark, DOWN, buff=0.5)
    cta_text = body_text(cta, size=SIZE_BODY, color=YELLOW).next_to(tagline, DOWN, buff=0.8)
    scene.play(FadeIn(mark, shift=UP * 0.2))
    scene.play(FadeIn(tagline))
    scene.play(FadeIn(cta_text, shift=UP * 0.1))
    scene.wait(1.5)
