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
 *   { type:'three', spec:{ kind:'nucleus',  protons, neutrons, title } }
 *   { type:'three', spec:{ kind:'electric-attraction', title } }
 *   { type:'three', spec:{ kind:'isotopes', isotopes:[{label,protons,neutrons}] } }
 *   shape ∈ linear | bent | trigonal | pyramidal | tetrahedral
 */

export const BOARD_MEDIA = {
  // Static deck · Atomic Chemistry 2.1 “The chemist’s dozen”
  34: {
    0: { type: 'img', src: '/media/bb-34-f0.gif?v=6b5cb9' }
  },

  // ── Chemistry · Atomic structure ──
  // 1057 "Electron shells: where electrons live" — Concrete floor walks sodium 2,8,1.
  1057: { 1: { type: 'three', spec: { kind: 'atom', symbol: 'Na', shells: [2, 8, 1] } } },

  // ── Chemistry · Molecular architecture ──
  // 1070 "Ionic lattices: the giant structure" — the repeating NaCl grid.
  1062: { 0: { type: 'three', spec: { kind: 'ionic-transfer', from: 'Na', to: 'Cl', product: 'Na+ + Cl-', title: 'electron transfer' } } },
  1063: { 1: { type: 'three', spec: { kind: 'covalent-share', atom: 'O', pairs: 2, title: 'shared electron pairs' } } },
  1064: { 1: { type: 'three', spec: { kind: 'metallic-sea', title: 'mobile electrons in metal' } } },
  1066: { 2: { type: 'three', spec: { kind: 'mole-scale', title: 'one mole is a counting unit' } } },
  1067: { 1: { type: 'three', spec: { kind: 'mass-moles', title: 'grams translate into moles', equation: 'n = m / M' } } },
  1068: { 1: { type: 'three', spec: { kind: 'isotope-average', title: 'weighted isotope average', result: 'Cl average = 35.5' } } },

  1070: { 0: { type: 'three', spec: { kind: 'lattice', a: 'Na', b: 'Cl', size: 3 } } },
  1071: { 1: { type: 'three', spec: { kind: 'covalent-network', title: 'same carbon, different structure' } } },
  // 1072 "Molecular shapes: VSEPR" — the showcase: a rotatable tetrahedron.
  1072: { 0: { type: 'three', spec: { kind: 'molecule', formula: 'CH₄', shape: 'tetrahedral', center: 'C', ligand: 'H', count: 4 } } },
  // 1075 "What is a molecule?" — the most familiar molecule.
  1073: { 1: { type: 'three', spec: { kind: 'polarity', title: 'dipoles add or cancel' } } },
  1074: { 2: { type: 'three', spec: { kind: 'hydrogen-bonds', title: 'hydrogen bonds between molecules' } } },
  1075: { 0: { type: 'three', spec: { kind: 'molecule', formula: 'H₂O', shape: 'bent', center: 'O', ligand: 'H', count: 2 } } },
  // 1076 "Bond angles and the shape of a molecule" — the pyramidal case.
  1076: { 0: { type: 'three', spec: { kind: 'molecule', formula: 'NH₃', shape: 'pyramidal', center: 'N', ligand: 'H', count: 3 } } },
  1077: { 2: { type: 'three', spec: { kind: 'dna-helix', title: 'two strands twist together' } } },

  // ── The Atom · pixel-art floor animations ──
  1094: {
    0: { type: 'img', src: '/videos/card-1094-floor0.gif?v=944949' },   // layer 0 — foil dividing down to the smallest piece
    1: { type: 'img', src: '/videos/card-1094-floor1.gif?v=1cdafa' },    // layer 1 — the philosophers' argument (never-ends vs a-limit)
    2: { type: 'img', src: '/videos/card-1094-floor2.png?v=7d7d7b' },    // layer 2 — ATOMOS: the smallest, uncuttable piece
    3: { type: 'img', src: '/videos/card-1094-floor3.gif?v=77f695' }     // layer 3 — Jean Perrin: atoms are real (Brownian motion)
  },

  // ── The Bit · pixel-art floor animations ──
  // Atom 2.x: nucleus, charge, neutrons, and isotopes.
  1109: { 2: { type: 'three', spec: { kind: 'nucleus', protons: 6, neutrons: 6, title: 'inside the nucleus' } } },
  1110: { 3: { type: 'three', spec: { kind: 'electric-attraction', title: '+ nucleus attracts - electrons' } } },
  1113: { 4: { type: 'three', spec: { kind: 'nucleus', protons: 6, neutrons: 8, title: 'protons + neutrons' } } },
  1115: { 2: { type: 'three', spec: {
    kind: 'isotopes',
    title: 'same protons, different neutrons',
    isotopes: [
      { label: 'C-12', protons: 6, neutrons: 6 },
      { label: 'C-13', protons: 6, neutrons: 7 },
      { label: 'C-14', protons: 6, neutrons: 8 }
    ]
  } } },
  1117: { 4: { type: 'three', spec: { kind: 'covalent-share', atom: 'O', pairs: 2, title: 'shared electrons glue atoms' } } },
  1119: { 3: { type: 'three', spec: { kind: 'metallic-sea', title: 'ions plus roaming electrons' } } },
  1120: { 3: { type: 'three', spec: { kind: 'metallic-sea', title: 'electron flow is current' } } },
  1121: { 4: { type: 'three', spec: { kind: 'mole-scale', title: 'a mole is a huge count' } } },
  1122: { 2: { type: 'three', spec: { kind: 'mole-scale', title: 'tiny atoms become visible amounts' } } },
  1123: { 4: { type: 'three', spec: { kind: 'mass-moles', title: 'count atoms by weighing' } } },
  1127: { 3: { type: 'three', spec: { kind: 'isotope-average', title: 'not one atom, an average', result: 'table mass = average' } } },
  1128: { 3: { type: 'three', spec: { kind: 'isotope-average', title: '75 percent light, 25 percent heavy', result: '35.5 from the mix' } } },
  1129: { 4: { type: 'three', spec: { kind: 'mass-moles', title: 'the scale becomes a counter' } } },

  // Same smoke-signal relay GIF reused on every floor of the first two BBs
  // (founder decision). ?v= is the file's md5 prefix — bump it whenever the
  // GIF is rebuilt, or the cache-first SW keeps serving the old frames.
  1130: {
    0: { type: 'img', src: '/videos/card-1130-floor0.gif?v=515d99' },
    1: { type: 'img', src: '/videos/card-1130-floor0.gif?v=515d99' },
    2: { type: 'img', src: '/videos/card-1130-floor0.gif?v=515d99' },
    3: { type: 'img', src: '/videos/card-1130-floor0.gif?v=515d99' }
  },
  1131: {
    0: { type: 'img', src: '/videos/card-1130-floor0.gif?v=515d99' },
    1: { type: 'img', src: '/videos/card-1130-floor0.gif?v=515d99' },
    2: { type: 'img', src: '/videos/card-1130-floor0.gif?v=515d99' },
    3: { type: 'img', src: '/videos/card-1130-floor0.gif?v=515d99' },
    4: { type: 'img', src: '/videos/card-1130-floor0.gif?v=515d99' }
  },

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
  1049: { 0: { type: 'img', src: '/videos/cg17_rectangle_proof.gif' } },       // Proving a shape with coordinates

  // Computer Science - AI Behind the Curtain
  // 1378 "The machine still only has switches" - text is encoded before AI can process it.
  1378: { 0: { type: 'three', spec: {
    kind: 'ai-pipeline',
    title: 'English becomes machine data',
    words: ['words', 'tokens', 'bits'],
    bits: '0100000101001001'
  } } },

  // Draft expansion - Trigonometry
  // 1379 "The unit circle holds every angle" - spatial anchor for cos theta and sin theta.
  1379: { 0: { type: 'three', spec: {
    kind: 'unit-circle',
    title: '(cos theta, sin theta)',
    theta: 52
  } } },

  // Draft expansion - Optics
  // 1394 "Refraction bends light at boundaries" - ray bends as it crosses into glass.
  1394: { 0: { type: 'three', spec: {
    kind: 'ray-optics',
    label: 'refraction at a boundary'
  } } }
};

/** Media spec for a board number + floor index, or null. */
export function getFloorMedia(boardNumber, floor) {
  const board = BOARD_MEDIA[boardNumber];
  if (!board) return null;
  return board[floor] || null;
}
