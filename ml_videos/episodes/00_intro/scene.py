"""
Episode 00 — Channel intro.
See script.md in this folder for the full beat sheet.
Roadmap stage order pulled directly from 17_Learning_As_Of_Now/Claude/journey-data.js
(not from 15_Docs/ROADMAP.md), per instruction.
"""

import sys
import os
from manim import *

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from style import (
    MLScene, BLUE, YELLOW, TEXT_MAIN, TEXT_DIM,
    body_text, title_text, caption_at, fit_width,
    series_wordmark, SERIES_TAGLINE,
)

config.frame_height = 8.0
config.frame_width = 8.0 * 1080 / 1920

STAGES = [
    ("Data Cleaning", "missing values, outliers, duplicates"),
    ("Pre-Processing", "scaling, encoding"),
    ("Model Building", "regression, trees, KNN, SVM, clustering"),
    ("Evaluation", "cross-validation, precision, recall, ROC"),
    ("Tuning & Ensembles", "grid search, bagging, boosting"),
    ("Final Project", "one pipeline, start to finish"),
]


class Episode00_Intro(MLScene):
    def construct(self):
        # -------------------------------------------------------------
        # Beat 1: hook — who this is for
        # -------------------------------------------------------------
        cap1 = caption_at("If you write Java for a living...")
        hook1 = body_text("You write Java for a living.", size=32, color=TEXT_MAIN)
        hook2 = body_text("Machine learning still feels", size=32, color=TEXT_MAIN)
        hook3 = body_text("like someone else's field.", size=32, color=TEXT_MAIN)
        hook = VGroup(hook1, hook2, hook3).arrange(DOWN, buff=0.25)
        fit_width(hook)
        hook.move_to(UP * 0.3)

        with self.voiceover(
            text="If you write Java for a living, and machine learning still feels like "
                 "someone else's field — this channel is for you."
        ) as tracker:
            self.play(FadeIn(hook1), run_time=0.6)
            self.play(FadeIn(hook2), run_time=0.6)
            self.play(FadeIn(hook3), run_time=0.6)
            self.wait(max(tracker.duration - 1.8, 0))
        self.play(FadeOut(hook), run_time=0.4)

        # -------------------------------------------------------------
        # Beat 2: the promise — idea first, math second
        # -------------------------------------------------------------
        idea_card = self._promise_card("IDEA", "plain English", YELLOW, filled=True)
        math_card = self._promise_card("MATH", "only once the idea clicks", TEXT_DIM, filled=False)
        cards = VGroup(idea_card, math_card).arrange(RIGHT, buff=0.5)
        fit_width(cards)
        cards.move_to(DOWN * 0.3)

        promise_title = body_text("One concept a day.", size=30, color=TEXT_MAIN).to_edge(UP, buff=1.0)

        with self.voiceover(
            text="Every day, one machine learning concept — explained the way I actually "
                 "learned it. The idea first, in plain English. The math only once the "
                 "idea makes sense. No calculus required to follow along."
        ) as tracker:
            self.play(FadeIn(promise_title), run_time=0.6)
            self.play(FadeIn(math_card, shift=RIGHT * 0.3), run_time=0.6)
            self.play(FadeIn(idea_card, shift=LEFT * 0.3), run_time=0.6)
            self.play(idea_card.animate.shift(RIGHT * 0.1), run_time=0.3, rate_func=there_and_back)
            self.wait(max(tracker.duration - 2.1, 0))
        self.play(FadeOut(promise_title), FadeOut(cards), run_time=0.4)

        # -------------------------------------------------------------
        # Beat 3: why trust this — real notes
        # -------------------------------------------------------------
        real_title = body_text("From my own study notes.", size=30, color=TEXT_MAIN).to_edge(UP, buff=1.0)
        topic_names = ["Missing Values", "Outliers", "Decision Trees", "SVM", "Clustering", "PCA"]
        topic_cards = VGroup(*[
            self._topic_chip(name) for name in topic_names
        ]).arrange_in_grid(rows=3, cols=2, buff=0.35).move_to(DOWN * 0.2)

        with self.voiceover(
            text="These aren't generic slides. Every video comes from my own study notes — "
                 "real datasets, real mistakes, real fixes — the same notes I used to learn "
                 "this myself."
        ) as tracker:
            self.play(FadeIn(real_title), run_time=0.5)
            self.play(LaggedStart(*[FadeIn(c, shift=UP * 0.15) for c in topic_cards], lag_ratio=0.15), run_time=1.6)
            self.wait(max(tracker.duration - 2.1, 0))
        self.play(FadeOut(real_title), FadeOut(topic_cards), run_time=0.4)

        # -------------------------------------------------------------
        # Beat 4: the roadmap — real stages from journey-data.js
        # -------------------------------------------------------------
        roadmap_title = body_text("Where we're headed:", size=28, color=TEXT_MAIN).to_edge(UP, buff=0.8)
        self.play(FadeIn(roadmap_title), run_time=0.4)

        stage_group = VGroup()
        for name, examples in STAGES:
            stage_label = body_text(name, size=26, color=YELLOW)
            example_label = Text(examples, font_size=16, color=TEXT_DIM)
            fit_width(example_label, max_width=3.6)
            pair = VGroup(stage_label, example_label).arrange(DOWN, buff=0.08)
            stage_group.add(pair)
        stage_group.arrange(DOWN, buff=0.35).move_to(DOWN * 0.1)

        narration = (
            "Here's where we're headed. We start with the boring but critical part: cleaning "
            "messy data. Then scaling and encoding it for a model. Then the model-building "
            "family: regression, trees, k-nearest neighbors, support vector machines, "
            "clustering. Then how to judge if a model is any good. Then tuning and combining "
            "models with ensembles. And we close with a full project that strings every one "
            "of those steps together, end to end."
        )
        with self.voiceover(text=narration) as tracker:
            per_stage = tracker.duration / len(stage_group)
            for pair in stage_group:
                self.play(FadeIn(pair, shift=UP * 0.1), run_time=min(per_stage * 0.6, 0.5))
                self.wait(max(per_stage * 0.4, 0))
        self.play(FadeOut(roadmap_title), FadeOut(stage_group), run_time=0.4)

        # -------------------------------------------------------------
        # Beat 5: how to follow
        # -------------------------------------------------------------
        follow1 = body_text("~60 seconds.", size=32, color=TEXT_MAIN)
        follow2 = body_text("Every day.", size=32, color=TEXT_MAIN)
        follow3 = body_text("No fluff.", size=32, color=YELLOW)
        follow = VGroup(follow1, follow2, follow3).arrange(DOWN, buff=0.25)
        fit_width(follow)
        follow.move_to(UP * 0.2)

        with self.voiceover(
            text="One concept, about sixty seconds, every day. Faceless, to the point, no "
                 "fluff. Follow along, and by the time we reach the final project, you'll "
                 "have watched an entire machine learning course build up one day at a time."
        ) as tracker:
            self.play(FadeIn(follow1), run_time=0.5)
            self.play(FadeIn(follow2), run_time=0.5)
            self.play(FadeIn(follow3), run_time=0.5)
            self.wait(max(tracker.duration - 1.5, 0))
        self.play(FadeOut(follow), run_time=0.4)

        # -------------------------------------------------------------
        # Beat 6: outro / CTA
        # -------------------------------------------------------------
        mark = series_wordmark(scale=1.1)
        fit_width(mark)
        mark.move_to(UP * 1.0)
        tagline = body_text(SERIES_TAGLINE, size=24, color=TEXT_DIM)
        fit_width(tagline)
        tagline.next_to(mark, DOWN, buff=0.4)
        cta = body_text("Follow so you don't miss it.", size=26, color=YELLOW)
        fit_width(cta)
        cta.next_to(tagline, DOWN, buff=0.7)

        with self.voiceover(text="First real concept drops next. Follow so you don't miss it."):
            self.play(FadeIn(mark, shift=UP * 0.2), run_time=0.5)
            self.play(FadeIn(tagline), run_time=0.4)
            self.play(FadeIn(cta, shift=UP * 0.1), run_time=0.5)
            self.wait(1.0)

    def _promise_card(self, top, bottom, color, filled):
        top_t = body_text(top, size=30, color=color)
        bottom_t = Text(bottom, font_size=18, color=TEXT_DIM)
        fit_width(bottom_t, max_width=2.0)
        group = VGroup(top_t, bottom_t).arrange(DOWN, buff=0.15)
        box = RoundedRectangle(
            width=group.width + 0.5, height=group.height + 0.5, corner_radius=0.12,
            color=color, stroke_width=2.5, fill_color=color, fill_opacity=0.12 if filled else 0.0,
        )
        return VGroup(box, group)

    def _topic_chip(self, name):
        label = Text(name, font_size=18, color=TEXT_MAIN)
        fit_width(label, max_width=1.8)
        box = SurroundingRectangle(label, color=BLUE, buff=0.18, stroke_width=1.5, corner_radius=0.08)
        return VGroup(box, label)
