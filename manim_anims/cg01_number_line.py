"""
Board 1035 — The simplest thing you can draw.
A number line appears; a point is plotted at x=3.
"""
from manim import *
from strata_theme import StrataScene, TEXT_DARK, TEXT_MED, ACCENT


class CG01NumberLine(StrataScene):
    def construct(self):
        # Title
        title = self.chalk_text("The simplest thing you can draw", font_size=30)
        title.to_edge(UP)
        self.play(Write(title))

        # Number line
        line = NumberLine(
            x_range=[-1, 6, 1], length=8,
            include_numbers=True, numbers_to_include=range(0, 6),
            color=TEXT_DARK, stroke_width=2,
            font_size=24,
        )
        line.move_to(ORIGIN)
        self.play(Create(line))

        # Point at x=3
        dot = Dot(line.n2p(3), color=ACCENT, radius=0.12)
        label = Text("(3)", font_size=24, color=TEXT_DARK).next_to(dot, UP, buff=0.2)

        self.play(FadeIn(dot), Write(label))
        self.wait(0.8)

        # Closing text
        closing = self.chalk_text(
            "One number = one position on a line.",
            font_size=24, color=TEXT_MED
        ).to_edge(DOWN)
        self.play(Write(closing))
        self.wait(1.2)
