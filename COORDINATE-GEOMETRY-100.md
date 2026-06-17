# Coordinate Geometry — 100 BBs

The full topic list for the M3 path (see `CONTENT-MAP.md`, `PATHS.md`). Ordered by dependency — each tier assumes the ones above it. This supersedes the ~60-BB sketch in `CONTENT-MAP.md`; the path is now planned at **100 BBs**.

Each line is a topic, not yet written content. Run each through the Loop (`AUTHORING.md`: Instance 1 → Instance 2 → Draft 1-3) to finalize.

Existing BBs (21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32) are marked inline — they already exist in some form and may need re-sequencing or light editing to fit this spine, not rewriting from scratch.

---

## Tier 0 — The plane itself (1–17)

1. What a number line is
2. Where zero sits
3. Positive and negative — two directions from zero
4. Fractions and decimals on the line
5. Comparing numbers — who's bigger, the line tells you
6. Distance on a number line — subtraction as length
7. The midpoint of two numbers
8. Introducing a second line — why one isn't enough *(existing: 26 "The infinite tightrope" covers 1–7 territory)*
9. The x-axis and y-axis — two number lines, one point
10. The origin — where they cross
11. Plotting a point — an ordered pair (x, y) *(existing: 27 "The grid of reality")*
12. Reading a point off the grid
13. The four quadrants
14. Which quadrant is which sign combination
15. Distance between two points on the grid (Pythagoras)
16. The midpoint of two points
17. Plotting simple shapes from points (triangle, rectangle)

## Tier 1 — Lines (18–31)

18. What "steepness" means
19. Rise and run
20. The gradient (slope) of a line
21. Positive vs negative gradient
22. Zero gradient — a flat line
23. Undefined gradient — a vertical line
24. The equation of a line: y = mx + c *(existing: 31 "Dash and the staircase")*
25. What m and c each control
26. Finding the equation from two points
27. Parallel lines — same gradient
28. Perpendicular lines — negative reciprocal gradient
29. Where a line crosses the x-axis (the root)
30. Where a line crosses the y-axis (the intercept)
31. Solving where two lines meet (simultaneous equations, graphically)

## Tier 2 — Curves (32–50)

32. Why not everything is a straight line
33. The simplest curve: y = x² *(existing: 30 "Dot and the square game")*
34. Why squaring makes a U-shape
35. The vertex of a parabola
36. Symmetry in a parabola
37. Shifting a parabola up/down (y = x² + c)
38. Shifting a parabola left/right (y = (x−a)²)
39. Stretching a parabola (y = ax²)
40. Flipping a parabola (y = −x²)
41. Where a parabola crosses the x-axis (roots)
42. The quadratic formula, visualized
43. Completing the square, visualized
44. The discriminant — how many crossings
45. Cubic curves — y = x³
46. The S-shape and why
47. Higher powers — y = x⁴, x⁵, watching the pattern
48. The circle equation x² + y² = r²
49. Circles not centred at the origin
50. The unit circle *(prototyped already — see `unit-circle-prototype.html`)*

## Tier 3 — Functions as machines on the grid (51–59)

51. A function as an input-output graph
52. The vertical line test — what makes a graph a function
53. Domain — what x is allowed
54. Range — what y comes out
55. Asymptotes — lines a curve never touches
56. The reciprocal function y = 1/x
57. Exponential growth on a graph
58. Logarithms as the mirror image (reflection across y = x)
59. Transformations summary — shift, stretch, reflect, combined

## Tier 4 — Vectors on the grid (60–69)

60. A vector as an arrow from one point to another *(existing: 21 "How much isn't enough")*
61. Vector components (x, y)
62. Adding vectors — tip to tail on the grid *(existing: 22 "When two things push at once")*
63. The magnitude of a vector (Pythagoras again)
64. The direction of a vector (angle from the axis)
65. Scalar multiples of a vector — stretching, shrinking, reversing an arrow
66. The resultant of two vectors
67. Resolving a vector into components *(existing: 23 "Splitting a diagonal")*
68. The dot product — what it tells you about the angle between two vectors
69. Unit vectors — i and j notation

## Tier 5 — Motion on the grid (70–80)

70. Position as a point that moves *(existing: 25 "The three accelerators")*
71. A displacement-time graph
72. Reading velocity as the gradient of displacement-time
73. A velocity-time graph
74. Reading acceleration as the gradient of velocity-time
75. Reading distance as the area under velocity-time
76. Constant velocity — a straight line
77. Constant acceleration — a curve on displacement-time
78. The SUVAT equations, each one visualized on a graph
79. Projectile motion as a parabola — combining two axes *(existing: 28 "The two lives of a falling rock", 29 "The perfect arc")*
80. Why horizontal and vertical motion are independent (the grid splits them apart)

## Tier 6 — The gateway to calculus: derivatives (81–90)

81. The slope between two points that are very close together
82. What happens as the two points merge (the limit, revisited)
83. The tangent line at a single point *(existing: 32 "The kissing curves")*
84. The derivative as the slope of the tangent
85. Differentiating y = x² from first principles, on the grid
86. The derivative as a new function — a graph of gradients
87. Stationary points — where the tangent is flat
88. Maximum and minimum points, read off a graph
89. Concavity — curving up vs curving down
90. The second derivative, visualized

## Tier 7 — The gateway to calculus: integrals (91–100)

91. The area under a curve — why it's hard with curves
92. Approximating area with rectangles (Riemann sums)
93. More rectangles, better approximation
94. The limit of infinite rectangles — the integral
95. The integral as "anti-slope" — reversing differentiation
96. Definite vs indefinite integrals, visualized
97. Area between two curves
98. Using integration to find displacement from a velocity-time graph
99. Volume of revolution — spinning a curve around an axis (intro)
100. Putting it all together — one point, moving, accelerating, swept into an area: the whole of calculus as the grid in motion

---

## Notes

- This is a **topic list**, not finished content. Each topic becomes a BB through the Loop process in `AUTHORING.md`.
- The 11 existing BBs are marked above — they cover fragments of this spine already and should be checked against their tier's neighbours rather than rewritten from scratch.
- Most of these topics are strong candidates for the **interactive floor** type (see chat: unit-circle prototype, reusable interactive-plane engine, not yet built). Tiers 0–2 and 4–7 in particular are almost all "something on a grid that responds to a parameter."
- This raises the M3 path total from ~60 to **100 BBs**. `CONTENT-MAP.md`'s grand total should be updated to reflect this (~363 instead of ~323) — flagged, not yet changed there.
