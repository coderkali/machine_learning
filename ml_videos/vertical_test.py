from manim import *

class VerticalTest(Scene):
    def construct(self):
        title = Text("Missing Values", font_size=56).to_edge(UP, buff=1.2)
        self.play(Write(title))

        rows = VGroup(*[
            Square(side_length=0.9, color=BLUE) for _ in range(4)
        ]).arrange(DOWN, buff=0.2)
        self.play(FadeIn(rows))

        gap = Text("?", font_size=60, color=RED).move_to(rows[2])
        self.play(Transform(rows[2], gap))
        self.wait(1)
