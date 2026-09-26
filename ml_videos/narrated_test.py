import os
from dotenv import load_dotenv
load_dotenv()
os.environ["ELEVEN_API_KEY"] = os.environ["ELEVENLABS_API_KEY"]

from manim import *
from manim_voiceover import VoiceoverScene
from manim_voiceover.services.elevenlabs import ElevenLabsService

class NarratedTest(VoiceoverScene):
    def construct(self):
        self.set_speech_service(
            ElevenLabsService(voice_name=os.environ["ELEVEN_VOICE_NAME"], model="eleven_multilingual_v2")
        )
        title = Text("Missing Values", font_size=56).to_edge(UP, buff=1.2)
        with self.voiceover(text="Missing values can quietly break your machine learning model.") as tracker:
            self.play(Write(title), run_time=tracker.duration)

        rows = VGroup(*[Square(side_length=0.9, color=BLUE) for _ in range(4)]).arrange(DOWN, buff=0.2)
        with self.voiceover(text="Here, one of these four rows has no value at all.") as tracker:
            self.play(FadeIn(rows))
            gap = Text("?", font_size=60, color=RED).move_to(rows[2])
            self.play(Transform(rows[2], gap))
        self.wait(1)
