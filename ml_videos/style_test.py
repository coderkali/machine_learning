"""Silent style test — no voiceover, no API cost. Just checking the visual language."""
from manim import *

config.frame_height = 8.0
config.frame_width = 8.0 * 1080 / 1920

BG = "#0B0F17"
BLUE = "#3DA5F4"
YELLOW = "#F4C542"
TEXT_MAIN = "#F5F7FA"
TEXT_DIM = "#7C8798"
FONT = "Helvetica Neue"


class StyleTest(Scene):
    def construct(self):
        self.camera.background_color = BG

        # --- Punchy kinetic-type hook, word by word, bold sans, big ---
        words = ["ONE", "LINE", "CAN", "SEPARATE", "THEM."]
        colors = [TEXT_MAIN, TEXT_MAIN, TEXT_MAIN, YELLOW, TEXT_MAIN]
        group = VGroup()
        for w, c in zip(words, colors):
            t = Text(w, font=FONT, weight=BOLD, font_size=72, color=c)
            group.add(t)
        group.arrange(DOWN, buff=0.15, aligned_edge=LEFT).move_to(ORIGIN)
        # fit to frame width
        max_w = config.frame_width - 1.0
        if group.width > max_w:
            group.scale_to_fit_width(max_w)
        group.move_to(ORIGIN)

        for word in group:
            self.play(
                word.animate.set_opacity(1),
                run_time=0.001,
            )
        # reset opacity then punch in each line
        for word in group:
            word.set_opacity(0)
        self.add(group)
        for word in group:
            self.play(
                word.animate.set_opacity(1).scale(1.0),
                rate_func=rate_functions.ease_out_back,
                run_time=0.35,
            )
        self.wait(0.6)
        self.play(FadeOut(group, shift=UP * 0.3), run_time=0.3)

        # --- Modern "pill" chip / badge instead of plain dot ---
        chip1 = self._chip("MALIGNANT", "#E4573D")
        chip2 = self._chip("BENIGN", BLUE)
        chips = VGroup(chip1, chip2).arrange(RIGHT, buff=0.5)
        if chips.width > config.frame_width - 1.0:
            chips.scale_to_fit_width(config.frame_width - 1.0)
        chips.move_to(UP * 0.5)

        vs = Text("VS", font=FONT, weight=BOLD, font_size=28, color=TEXT_DIM)
        vs.move_to(chips.get_center())

        self.play(
            LaggedStart(
                FadeIn(chip1, shift=RIGHT * 0.4, scale=1.2),
                FadeIn(chip2, shift=LEFT * 0.4, scale=1.2),
                lag_ratio=0.15,
            ),
            rate_func=rate_functions.ease_out_back,
            run_time=0.5,
        )
        self.play(FadeIn(vs, scale=1.5), run_time=0.25)
        self.wait(0.6)

        # --- Big bold stat callout, modern "counter" style ---
        self.play(FadeOut(chips), FadeOut(vs), run_time=0.3)
        stat_num = Text("569", font=FONT, weight=BOLD, font_size=120, color=YELLOW)
        stat_label = Text("REAL BIOPSY SAMPLES", font=FONT, weight=BOLD, font_size=24, color=TEXT_DIM)
        stat_label.set_stroke(width=0)
        stat = VGroup(stat_num, stat_label).arrange(DOWN, buff=0.3)
        self.play(
            GrowFromCenter(stat_num),
            rate_func=rate_functions.ease_out_back,
            run_time=0.5,
        )
        self.play(FadeIn(stat_label, shift=UP * 0.15), run_time=0.3)
        self.wait(0.8)

    def _chip(self, text, color):
        label = Text(text, font=FONT, weight=BOLD, font_size=26, color=BG)
        pill = RoundedRectangle(
            width=label.width + 0.6, height=label.height + 0.4,
            corner_radius=0.4, fill_color=color, fill_opacity=1, stroke_width=0,
        )
        return VGroup(pill, label)
