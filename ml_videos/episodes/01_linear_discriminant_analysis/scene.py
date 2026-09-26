"""
Episode 01 — Linear Discriminant Analysis ("Meera reads biopsy slides")
v2: teaches the actual 4-step mechanism with the notebook's real numbers.
See script.md in this folder for the full shot-by-shot plan.

Source concept: 04_ML/36_Linear_Discriminant_Analysis/Concept/34_LDA_explained.ipynb
Toy data (notebook cell 5): Class 1 = (2,3),(3,4)  Class 2 = (6,7),(7,10)
mu1=(2.5,3.5) mu2=(6.5,8.5)  Sw=[[1,2],[2,5]]  w=(10,-3)
z: (2,3)->11 (3,4)->18 (6,7)->39 (7,10)->40  class centres on line: 14.5, 39.5
"""

import sys
import os
import numpy as np
from manim import *

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from style import (
    MLScene, BLUE, RED_FLAG, YELLOW, TEXT_MAIN, TEXT_DIM,
    body_text, caption_at, short_outro, fit_width,
)

config.frame_height = 8.0
config.frame_width = 8.0 * 1080 / 1920

# Real toy data from the notebook — nothing here is invented.
CLASS1 = [(2, 3), (3, 4)]
CLASS2 = [(6, 7), (7, 10)]
MU1 = (2.5, 3.5)
MU2 = (6.5, 8.5)
W = (10, -3)          # w = Sw^-1 (mu2 - mu1), computed in the notebook
Z_VALUES = [11, 18, 39, 40]   # z = 10x - 3y for the four points, in order
Z_CENTRE1, Z_CENTRE2 = 14.5, 39.5


class Episode01_LDA(MLScene):
    def construct(self):
        axes = Axes(
            x_range=[0, 9, 2], y_range=[0, 11, 2],
            x_length=3.6, y_length=4.2,
            axis_config={"color": TEXT_DIM, "stroke_width": 2, "include_tip": False},
        ).move_to(UP * 0.15)

        def pt(p):
            return axes.c2p(*p)

        c1_dots = VGroup(*[Dot(pt(p), radius=0.09, color=BLUE, fill_opacity=0.95) for p in CLASS1])
        c2_dots = VGroup(*[Dot(pt(p), radius=0.09, color=RED_FLAG, fill_opacity=0.95) for p in CLASS2])
        all_dots = VGroup(*c1_dots, *c2_dots)
        labels_toy = VGroup(*[
            Text(f"({x:g},{y:g})", font_size=16, color=TEXT_DIM).next_to(pt((x, y)), UR, buff=0.08)
            for (x, y) in CLASS1 + CLASS2
        ])

        # -----------------------------------------------------------------
        # Shot 1 (0:00-0:07): open on the four real points.
        # -----------------------------------------------------------------
        cap1 = caption_at("30 numbers. One word: malignant, or benign.")
        with self.voiceover(
            text="Meera reads biopsy slides. Every one comes back as thirty numbers — "
                 "and she needs one word: malignant, or benign."
        ) as tracker:
            self.play(
                LaggedStart(*[FadeIn(d, scale=1.4) for d in all_dots], lag_ratio=0.1),
                FadeIn(cap1),
                run_time=1.4,
            )
            self.play(FadeIn(labels_toy), run_time=0.6)
            self.wait(max(tracker.duration - 2.0, 0))

        # -----------------------------------------------------------------
        # Shot 2 (0:07-0:16): the naive guess — straight line between centres.
        # -----------------------------------------------------------------
        cap2 = caption_at("The obvious guess: point straight at the other group.")
        mu1_dot = Dot(pt(MU1), radius=0.1, color=BLUE, fill_opacity=1)
        mu2_dot = Dot(pt(MU2), radius=0.1, color=RED_FLAG, fill_opacity=1)
        mu1_x = Cross(scale_factor=0.12, stroke_color=BLUE, stroke_width=4).move_to(pt(MU1))
        mu2_x = Cross(scale_factor=0.12, stroke_color=RED_FLAG, stroke_width=4).move_to(pt(MU2))
        naive_line = DashedLine(pt(MU1), pt(MU2), color=TEXT_DIM, stroke_width=3)
        naive_mid = (np.array(pt(MU1)) + np.array(pt(MU2))) / 2
        naive_label = Text("guess: (4, 5)", font_size=20, color=TEXT_DIM)
        fit_width(naive_label, max_width=2.0)
        naive_label.move_to(naive_mid + LEFT * 1.2 + UP * 0.15)

        with self.voiceover(
            text="The obvious move is to point straight at the other group's average — "
                 "the difference between the centres. Here that's four, five. It's often wrong."
        ) as tracker:
            self.play(FadeTransform(cap1, cap2), FadeOut(labels_toy), run_time=0.5)
            self.play(FadeIn(mu1_x), FadeIn(mu2_x), run_time=0.5)
            self.play(Create(naive_line), FadeIn(naive_label), run_time=0.8)
            self.wait(max(tracker.duration - 1.8, 0))

        # -----------------------------------------------------------------
        # Shot 3 (0:16-0:28): Step 1 — class centres, real numbers.
        # -----------------------------------------------------------------
        cap3 = caption_at("Step 1 — find each group's centre.")
        step_tag = body_text("STEP 1", size=22, color=YELLOW).to_corner(UL, buff=0.5)
        mu1_label = Text("μ₁ = (2.5, 3.5)", font_size=20, color=BLUE)
        fit_width(mu1_label, max_width=2.0)
        mu1_label.next_to(pt(MU1), DOWN, buff=0.35)
        mu2_label = Text("μ₂ = (6.5, 8.5)", font_size=20, color=RED_FLAG)
        fit_width(mu2_label, max_width=2.0)
        mu2_label.next_to(pt(MU2), UP, buff=0.55)

        with self.voiceover(
            text="Step one: average each class. Class one centres at two point five, three point five. "
                 "Class two at six point five, eight point five."
        ) as tracker:
            self.play(FadeTransform(cap2, cap3), FadeIn(step_tag), run_time=0.5)
            self.play(FadeIn(mu1_label, shift=UP * 0.1), run_time=0.6)
            self.play(FadeIn(mu2_label, shift=DOWN * 0.1), run_time=0.6)
            self.wait(max(tracker.duration - 1.7, 0))

        # -----------------------------------------------------------------
        # Shot 4 (0:28-0:40): Step 2 — spread / lean of each class.
        # -----------------------------------------------------------------
        cap4 = caption_at("Step 2 — how much does each class lean?")
        step_tag2 = body_text("STEP 2", size=22, color=YELLOW).to_corner(UL, buff=0.5)
        circle1 = Ellipse(width=0.9, height=0.7, color=BLUE, stroke_width=2, fill_opacity=0.12).move_to(pt(MU1)).rotate(PI / 6)
        ellipse2 = Ellipse(width=1.9, height=0.6, color=RED_FLAG, stroke_width=2, fill_opacity=0.12).move_to(pt(MU2)).rotate(PI / 3.2)

        with self.voiceover(
            text="Step two: measure how each class spreads around its own centre. Class two isn't "
                 "round — it leans hard in one direction. L D A has to know that lean before it can "
                 "pick a direction."
        ) as tracker:
            self.play(FadeTransform(cap3, cap4), FadeTransform(step_tag, step_tag2), run_time=0.5)
            self.play(FadeIn(circle1), run_time=0.5)
            self.play(FadeIn(ellipse2), run_time=0.8)
            self.wait(max(tracker.duration - 1.8, 0))

        # -----------------------------------------------------------------
        # Shot 5 (0:40-0:54): Step 3 — the corrected direction w.
        # -----------------------------------------------------------------
        cap5 = caption_at("Step 3 — correct for the lean: w = (10, -3)")
        step_tag3 = body_text("STEP 3", size=22, color=YELLOW).to_corner(UL, buff=0.5)

        wx, wy = W
        norm = np.hypot(wx, wy)
        direction = np.array([wx, wy, 0]) / norm
        center = pt((4.5, 5.5))  # midpoint used to hang the axis, matches notebook's `c`
        axis_len = 3.2
        w_line = Line(center - axis_len * direction, center + axis_len * direction, color=YELLOW, stroke_width=5)
        w_label = Text("w = (10, -3)", font_size=22, color=YELLOW)
        fit_width(w_label, max_width=2.2)
        w_label.move_to([0, 2.6, 0])

        with self.voiceover(
            text="Step three: correct the naive guess for that lean. The real answer is ten, "
                 "minus three — tilted away from the obvious guess, specifically to avoid running "
                 "along class two's own stretch."
        ) as tracker:
            self.play(FadeTransform(cap4, cap5), FadeTransform(step_tag2, step_tag3), run_time=0.5)
            self.play(FadeOut(naive_line), FadeOut(naive_label), FadeOut(circle1), FadeOut(ellipse2), run_time=0.5)
            self.play(Create(w_line), FadeIn(w_label), run_time=1.0)
            self.wait(max(tracker.duration - 2.0, 0))

        # -----------------------------------------------------------------
        # Shot 6 (0:54-1:08): Step 4 — project every point, real z values.
        # Shown on its own 1D number line (matches the notebook's own final
        # plot) rather than dropped onto the tilted 2D axis: two of the real
        # z-values (39 and 40) sit only 1 apart on a 0-45 scale, so dropping
        # them onto the compressed xy-scaled axis put their screen positions
        # ~13px apart — a number line at the z-values' own scale is both
        # accurate and legible.
        # -----------------------------------------------------------------
        cap6 = caption_at("Step 4 — project: z = 10x - 3y")
        step_tag4 = body_text("STEP 4", size=22, color=YELLOW).to_corner(UL, buff=0.5)

        self.play(
            FadeOut(VGroup(all_dots, mu1_x, mu2_x, w_line, mu1_label, mu2_label, axes)),
            FadeTransform(cap5, cap6), FadeTransform(step_tag3, step_tag4), FadeOut(w_label),
            run_time=0.6,
        )

        num_line = NumberLine(
            x_range=[5, 45, 5], length=3.6, color=TEXT_DIM, stroke_width=2,
            include_numbers=False, include_tip=False,
        ).move_to(UP * 0.2)

        z_dots = VGroup(*[
            Dot(num_line.n2p(z), radius=0.09, color=(BLUE if i < 2 else RED_FLAG), fill_opacity=0.95)
            for i, z in enumerate(Z_VALUES)
        ])
        z_labels = VGroup(*[
            Text(f"{z:g}", font_size=20, color=(BLUE if i < 2 else RED_FLAG)).next_to(num_line.n2p(z), UP, buff=0.22)
            for i, z in enumerate(Z_VALUES)
        ])
        # nudge the two close labels (39, 40) apart so they don't collide
        z_labels[2].shift(LEFT * 0.12)
        z_labels[3].shift(RIGHT * 0.12)

        centre1_line = DashedLine(num_line.n2p(Z_CENTRE1) + UP * 0.5, num_line.n2p(Z_CENTRE1) + DOWN * 0.15, color=BLUE, stroke_width=2)
        centre2_line = DashedLine(num_line.n2p(Z_CENTRE2) + UP * 0.5, num_line.n2p(Z_CENTRE2) + DOWN * 0.15, color=RED_FLAG, stroke_width=2)
        centre1_label = Text("class 1 centre: 14.5", font_size=16, color=BLUE)
        centre2_label = Text("class 2 centre: 39.5", font_size=16, color=RED_FLAG)
        centre_labels = VGroup(centre1_label, centre2_label).arrange(DOWN, buff=0.15, aligned_edge=LEFT)
        fit_width(centre_labels)
        centre_labels.next_to(num_line, DOWN, buff=0.9).to_edge(LEFT, buff=0.4)

        gap_box = SurroundingRectangle(
            VGroup(z_dots[1], z_dots[2]), color=YELLOW, buff=0.35, stroke_width=1.5,
        )
        gap_label = Text("gap", font_size=18, color=YELLOW).next_to(gap_box, UP, buff=0.15)

        with self.voiceover(
            text="Step four: project every point onto that line. Two numbers become one. Class one "
                 "lands at eleven and eighteen. Class two lands at thirty-nine and forty. A clean "
                 "gap, with nothing in between."
        ) as tracker:
            self.play(Create(num_line), run_time=0.6)
            self.play(LaggedStart(*[FadeIn(d, scale=1.3) for d in z_dots], lag_ratio=0.2), run_time=1.0)
            self.play(FadeIn(z_labels), run_time=0.6)
            self.play(Create(centre1_line), Create(centre2_line), FadeIn(centre_labels), run_time=0.8)
            self.play(Create(gap_box), FadeIn(gap_label), run_time=0.6)
            self.wait(max(tracker.duration - 3.6, 0))

        # -----------------------------------------------------------------
        # Shot 7 (1:08-1:18): verification cards.
        # -----------------------------------------------------------------
        self.play(
            FadeOut(VGroup(
                num_line, z_dots, z_labels, centre1_line, centre2_line, centre_labels,
                gap_box, gap_label, step_tag4, cap6,
            )),
            run_time=0.5,
        )

        card1 = self._verify_card("Hand math", "matches sklearn ✓")
        card2 = self._verify_card("Real scale:", "30 features, 569 samples")
        cards = VGroup(card1, card2).arrange(RIGHT, buff=0.4)
        fit_width(cards)
        cards.move_to(UP * 0.3)

        with self.voiceover(
            text="Check it against scikit-learn on the same toy points — same direction. Then scale "
                 "it up: thirty real features, five hundred sixty-nine real biopsies. Same method."
        ) as tracker:
            self.play(FadeIn(card1, shift=UP * 0.2), run_time=0.5)
            self.play(FadeIn(card2, shift=UP * 0.2), run_time=0.5)
            self.wait(max(tracker.duration - 1.0, 0))

        self.play(FadeOut(cards), run_time=0.4)

        # -----------------------------------------------------------------
        # Shot 8 (1:18-1:28): takeaway — PCA vs LDA contrast.
        # -----------------------------------------------------------------
        line1 = body_text("Don't chase the biggest spread.", size=30, color=TEXT_MAIN)
        line2 = body_text("That's PCA — it can pick the wrong axis.", size=24, color=TEXT_DIM)
        line3 = body_text("Chase the widest gap between groups.", size=30, color=YELLOW)
        takeaway = VGroup(line1, line2, line3).arrange(DOWN, buff=0.3)
        fit_width(takeaway)
        takeaway.move_to(ORIGIN)

        with self.voiceover(
            text="Don't chase the direction with the most spread — that's a different technique, "
                 "P C A, and it can pick the wrong axis entirely. Chase the direction with the "
                 "widest gap between groups."
        ) as tracker:
            self.play(FadeIn(line1), run_time=0.5)
            self.play(FadeIn(line2), run_time=0.5)
            self.play(FadeIn(line3), run_time=0.5)
            self.wait(max(tracker.duration - 1.5, 0))

        self.play(FadeOut(takeaway), run_time=0.4)

        # -----------------------------------------------------------------
        # Shot 9: brief outro.
        # -----------------------------------------------------------------
        short_outro(self)

    def _verify_card(self, top_text, bottom_text):
        top = body_text(top_text, size=24, color=TEXT_MAIN)
        bottom = body_text(bottom_text, size=22, color=YELLOW)
        group = VGroup(top, bottom).arrange(DOWN, buff=0.2)
        box = SurroundingRectangle(group, color=TEXT_DIM, buff=0.25, stroke_width=1.5, corner_radius=0.1)
        return VGroup(box, group)
