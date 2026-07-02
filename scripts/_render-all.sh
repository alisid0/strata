#!/usr/bin/env bash
cd /c/Users/ali10/strata
scenes="cg01_number_line:CG01NumberLine cg08_theatre_seats:CG08TheatreSeats cg15_distance_pythagoras:CG15DistancePythagoras cg17_rectangle_proof:CG17RectangleProof cg18_steepness_sweep:CG18SteepnessSweep cg21_gradient_sign:CG21GradientSign"
for theme in light dark; do
  for pair in $scenes; do
    scene="${pair%%:*}"; cls="${pair##*:}"
    echo ">>> $scene ($theme)"
    STRATA_THEME=$theme manim render -ql --disable_caching --media_dir manim_anims/media "manim_anims/$scene.py" "$cls" >/dev/null 2>&1
    mp4="manim_anims/media/videos/$scene/480p15/$cls.mp4"
    if [ -f "$mp4" ]; then
      node scripts/anim-to-gif.mjs "$mp4" 15 560 >/dev/null 2>&1
      cp "manim_anims/media/videos/$scene/480p15/$cls.gif" "public/videos/$scene-$theme.gif"
      echo "    ok -> public/videos/$scene-$theme.gif ($(du -h public/videos/$scene-$theme.gif | cut -f1))"
    else
      echo "    !! FAILED: $mp4 missing"
    fi
  done
done
echo "BATCH DONE"
