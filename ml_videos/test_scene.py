from manim import *

class HelloML(Scene):
    def construct(self):
        title = Text("Machine Learning", font_size=48)
        self.play(Write(title))
        self.wait(0.5)
        self.play(title.animate.to_edge(UP))

        dot = Dot(color=YELLOW).shift(LEFT * 4)
        self.play(FadeIn(dot))
        self.play(dot.animate.shift(RIGHT * 8), run_time=2)

        box = Square(color=BLUE)
        self.play(Transform(dot, box))
        self.wait(1)
