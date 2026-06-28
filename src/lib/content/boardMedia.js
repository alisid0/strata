/**
 * Per-floor rich-media attachment for boards (the forward-looking, dynamic-board
 * companion to media.js, which only covers the static deck).
 *
 * Keyed by board number → floor index → media spec. Reader.floorMedia() consults
 * getFloorMedia() for any media beyond a layer's own image. This is where audio /
 * video / interactive specs for the dynamic launch boards (1000+) will live too;
 * Three.js 3D is the first type wired up.
 *
 * 3D specs (rendered by src/lib/components/media/ThreeScene.svelte):
 *   { type:'three', spec:{ kind:'atom',     symbol, shells:[2,8,1] } }
 *   { type:'three', spec:{ kind:'molecule', formula, shape, center, ligand, count } }
 *   { type:'three', spec:{ kind:'lattice',  a, b, size } }
 *   shape ∈ linear | bent | trigonal | pyramidal | tetrahedral
 */

export const BOARD_MEDIA = {
  // ── Chemistry · Atomic structure ──
  // 1048 "Electron shells: where electrons live" — Concrete floor walks sodium 2,8,1.
  1048: { 1: { type: 'three', spec: { kind: 'atom', symbol: 'Na', shells: [2, 8, 1] } } },

  // ── Chemistry · Chemical bonding ──
  // 1064 "What is a molecule?" — open on the most familiar molecule.
  1064: { 0: { type: 'three', spec: { kind: 'molecule', formula: 'H₂O', shape: 'bent', center: 'O', ligand: 'H', count: 2 } } },

  // ── Chemistry · Molecular architecture ──
  // 1059 "Ionic lattices: the giant structure" — the repeating NaCl grid.
  1059: { 0: { type: 'three', spec: { kind: 'lattice', a: 'Na', b: 'Cl', size: 3 } } },
  // 1061 "Molecular shapes: VSEPR" — the showcase: a rotatable tetrahedron.
  1061: { 0: { type: 'three', spec: { kind: 'molecule', formula: 'CH₄', shape: 'tetrahedral', center: 'C', ligand: 'H', count: 4 } } },
  // 1065 "Bond angles and the shape of a molecule" — the classic bent 104.5°.
  1065: { 0: { type: 'three', spec: { kind: 'molecule', formula: 'H₂O', shape: 'bent', center: 'O', ligand: 'H', count: 2 } } }
};

/** Media spec for a board number + floor index, or null. */
export function getFloorMedia(boardNumber, floor) {
  const board = BOARD_MEDIA[boardNumber];
  if (!board) return null;
  return board[floor] || null;
}
