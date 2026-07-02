from manim import *

# Qubix clean theme — off-white background, minimal, GeoGebra-like
BOARD_BG = "#fafaf8"
TEXT_DARK = "#222222"
TEXT_MED = "#555555"
ACCENT = "#2563eb"
ACCENT_WARM = "#dc2626"
GRID = "#d8dce3"


class StrataScene(Scene):
    def setup(self):
        self.camera.background_color = BOARD_BG

    def chalk_text(self, text, **kwargs):
        kwargs.setdefault("color", TEXT_DARK)
        kwargs.setdefault("font_size", 28)
        return Text(text, font="Helvetica Neue, Arial, sans-serif", **kwargs)

    def axes(self, x_range=None, y_range=None, x_length=7, y_length=4, **kwargs):
        """Quick clean axes matching the CoordinatePlane component."""
        from manim import Axes
        kwargs.setdefault("axis_config", {"color": TEXT_DARK, "stroke_width": 2})
        kwargs.setdefault("x_axis_config", {"numbers_to_include": range(x_range[0], x_range[1]+1) if x_range else None})
        kwargs.setdefault("y_axis_config", {"numbers_to_include": range(y_range[0], y_range[1]+1) if y_range else None})
        return Axes(x_range=x_range, y_range=y_range, x_length=x_length, y_length=y_length, **kwargs)
