/**
 * Per-floor rich-media attachment for boards (the forward-looking, dynamic-board
 * companion to media.js, which only covers the static deck).
 *
 * Keyed by board number → floor index → media spec. Reader.floorMedia() consults
 * getFloorMedia() for any media beyond a layer's own image. This is where audio /
 * video / interactive specs for the dynamic launch boards (1000+) will live too;
 * Three.js 3D is the first type wired up.
 *
 * NOTE: keyed by Supabase sort_order, which the review ingest reassigns on every
 * run. Re-check these against the live board titles after any re-ingest.
 * Current mapping verified against the 2026-06-28 re-ingest (78 boards, 1000-1077).
 *
 * 3D specs (rendered by src/lib/components/media/ThreeScene.svelte):
 *   { type:'three', spec:{ kind:'atom',     symbol, shells:[2,8,1] } }
 *   { type:'three', spec:{ kind:'molecule', formula, shape, center, ligand, count } }
 *   { type:'three', spec:{ kind:'lattice',  a, b, size } }
 *   shape ∈ linear | bent | trigonal | pyramidal | tetrahedral
 */

export const BOARD_MEDIA = {
  // ── Chemistry · Atomic structure ──
  // 1057 "Electron shells: where electrons live" — Concrete floor walks sodium 2,8,1.
  1057: { 1: { type: 'three', spec: { kind: 'atom', symbol: 'Na', shells: [2, 8, 1] } } },

  // ── Chemistry · Molecular architecture ──
  // 1070 "Ionic lattices: the giant structure" — the repeating NaCl grid.
  1070: { 0: { type: 'three', spec: { kind: 'lattice', a: 'Na', b: 'Cl', size: 3 } } },
  // 1072 "Molecular shapes: VSEPR" — the showcase: a rotatable tetrahedron.
  1072: { 0: { type: 'three', spec: { kind: 'molecule', formula: 'CH₄', shape: 'tetrahedral', center: 'C', ligand: 'H', count: 4 } } },
  // 1075 "What is a molecule?" — the most familiar molecule.
  1075: { 0: { type: 'three', spec: { kind: 'molecule', formula: 'H₂O', shape: 'bent', center: 'O', ligand: 'H', count: 2 } } },
  // 1076 "Bond angles and the shape of a molecule" — the pyramidal case.
  1076: { 0: { type: 'three', spec: { kind: 'molecule', formula: 'NH₃', shape: 'pyramidal', center: 'N', ligand: 'H', count: 3 } } },

  // ── Maths · Coordinate geometry ──
  // Manim GIFs on Supabase. Rendered with STRATA_THEME=light.
  1035: { 0: { type: 'img', src: 'https://xzesbcrlnbesmvxmgotp.supabase.co/storage/v1/object/public/card-audio/bb-1035-number-line.gif' } },
  1036: { 0: { type: 'img', src: 'https://xzesbcrlnbesmvxmgotp.supabase.co/storage/v1/object/public/card-audio/bb-1036-second-axis.gif' } },
  // 1038 "Every point has an address" — interactive coordinate plane (SVG, themed).
  1038: { 0: { type: 'coord-plane', spec: {
    xRange: [0, 6], yRange: [0, 2.5],
    interactive: true,
    points: [{ x: 3, y: 2 }]
  } } },
  1040: { 0: { type: 'img', src: '/videos/cg21_gradient_sign.gif' } },         // The slanted line: y follows x (+/− gradient)
  1041: { 0: { type: 'img', src: '/videos/cg18_steepness_sweep.gif' } },       // The slope of a line (steepness)
  1046: { 0: { type: 'img', src: '/videos/cg15_distance_pythagoras.gif' } },   // Distance between two points
  1049: { 0: { type: 'img', src: '/videos/cg17_rectangle_proof.gif' } }        // Proving a shape with coordinates
};

/** Media spec for a board number + floor index, or null. */
export function getFloorMedia(boardNumber, floor) {
  const board = BOARD_MEDIA[boardNumber];
  if (!board) return null;
  return board[floor] || null;
}
