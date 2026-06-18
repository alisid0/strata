from manim import *

BOARD_BG = "#1d3829"
CHALK = "#f4f1e9"
CHALK_YELLOW = "#f2d585"
CHALK_GREEN = "#a9d6a0"
CHALK_BLUE = "#9ec6d8"
CHALK_FAINT = "#8fa093"
CHALK_RED = "#e07a5f"


class StrataScene(Scene):
    def setup(self):
        self.camera.background_color = BOARD_BG

    def chalk_text(self, text, **kwargs):
        kwargs.setdefault("color", CHALK)
        return Text(text, **kwargs)
