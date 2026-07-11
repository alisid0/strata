// Challenge runs — randomized, timed drill generators keyed by WorkshopLab
// module id. Unlike the static workshop arrays in workshops.js (fixed content,
// identical on every replay), every call builds a fresh set of targets, so a
// replay is real practice instead of answer recall. Difficulty ramps within
// each run: early steps small/positive, later steps negatives, ions, isotopes,
// bigger numbers.

// ── random helpers ────────────────────────────────────────────────────────────
const ri = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const pick = (arr) => arr[ri(0, arr.length - 1)];
const riNot = (min, max, exclude) => {
  let v;
  do { v = ri(min, max); } while (exclude.includes(v));
  return v;
};

// ── maths: The Line (coordinate geometry) ────────────────────────────────────
function genPlotPoint(hard) {
  const x = hard ? riNot(-5, 5, [0]) : ri(1, 5);
  const y = hard ? riNot(-5, 5, [0]) : ri(1, 5);
  return {
    type: 'coorddrill', mode: 'plotPoint',
    prompt: hard ? 'Negative directions count too. Plot it.' : 'Across first, then up. Plot it.',
    targetX: x, targetY: y,
    correctFeedback: `Correct. (${x}, ${y}) locked in.`,
    incorrectFeedback: `That address is ${x} across, ${y} ${y >= 0 ? 'up' : 'down'}.`,
  };
}

function genBuildLine(hard) {
  let m = hard ? riNot(-4, 4, [0]) : ri(2, 3);
  let c = hard ? riNot(-5, 5, [0]) : ri(-2, 2);
  if (m === 1 && c === 0) c = 2; // never the starting position
  return {
    type: 'coorddrill', mode: 'buildLine',
    prompt: 'Match the dashed target line.',
    targetM: m, targetC: c,
    correctFeedback: `Correct. Slope ${m}, intercept ${c}.`,
    incorrectFeedback: `The target climbs ${m} per step across and crosses the y-axis at ${c}.`,
  };
}

function genDistance() {
  // 3-4-5 triangle anchored at a random point, random leg orientation.
  const ax = ri(-2, 1), ay = ri(-2, 1);
  return {
    type: 'coorddrill', mode: 'distance',
    prompt: 'Drag B to the target distance from A.',
    fixedPoint: { x: ax, y: ay }, targetDistance: 5, distanceTolerance: 0.4,
    correctFeedback: 'Correct. A 3-4-5 right triangle hides inside that distance.',
    incorrectFeedback: 'Try 3 across and 4 up from A (or 4 across, 3 up) — that is exactly 5.',
  };
}

function genMidpoint() {
  const ax = ri(-5, 1), ay = ri(-5, 1);
  const bx = ax + 2 * ri(1, 4), by = ay + 2 * ri(1, 4);
  return {
    type: 'coorddrill', mode: 'midpoint',
    prompt: 'Drag M exactly halfway between A and B.',
    pointA: { x: ax, y: ay }, pointB: { x: bx, y: by },
    correctFeedback: 'Correct. Average both x values, average both y values.',
    incorrectFeedback: `Midpoint is ((${ax}+${bx})/2, (${ay}+${by})/2) = (${(ax + bx) / 2}, ${(ay + by) / 2}).`,
  };
}

function lineChallenge() {
  return [
    genPlotPoint(false), genPlotPoint(true),
    genBuildLine(false), genBuildLine(true),
    genMidpoint(), genDistance(),
    genPlotPoint(true), genBuildLine(true),
  ];
}

// ── maths: Matrices ───────────────────────────────────────────────────────────
function genMatrixCell() {
  const matrix = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => ri(1, 20)));
  const row = ri(1, 3), col = ri(1, 3);
  return {
    type: 'matrixcell',
    prompt: `Tap row ${row}, column ${col}.`,
    matrix, targetRow: row, targetCol: col,
    correctFeedback: `Correct. Row ${row}, column ${col} holds ${matrix[row - 1][col - 1]}.`,
    incorrectFeedback: 'Rows go across, columns go down. Find the row first.',
  };
}

const TRANSFORMS = [
  { m: [[2, 0], [0, 1]], desc: 'doubles x, leaves y alone' },
  { m: [[1, 0], [0, 2]], desc: 'doubles y, leaves x alone' },
  { m: [[-1, 0], [0, 1]], desc: 'flips x across the vertical axis' },
  { m: [[1, 0], [0, -1]], desc: 'flips y across the horizontal axis' },
  { m: [[0, 1], [1, 0]], desc: 'swaps x and y' },
  { m: [[2, 0], [0, 2]], desc: 'doubles both x and y' },
];

function applyM(m, p) {
  return [m[0][0] * p[0] + m[0][1] * p[1], m[1][0] * p[0] + m[1][1] * p[1]];
}

function genMatrixTransform() {
  const t = pick(TRANSFORMS);
  const point = [ri(1, 3), ri(1, 3)];
  const out = applyM(t.m, point);
  // Distractors: other transforms' outputs on the same point, deduped against the answer.
  const options = [out];
  for (const other of TRANSFORMS) {
    if (options.length >= 3) break;
    const alt = applyM(other.m, point);
    if (!options.some(o => o[0] === alt[0] && o[1] === alt[1])) options.push(alt);
  }
  return {
    type: 'matrixtransform',
    prompt: `This matrix ${t.desc}. Where does point (${point[0]}, ${point[1]}) land?`,
    matrix: t.m, inputPoint: point, options,
    correctFeedback: `Correct. (${point[0]}, ${point[1]}) becomes (${out[0]}, ${out[1]}).`,
    incorrectFeedback: `The matrix ${t.desc}: (${point[0]}, ${point[1]}) lands on (${out[0]}, ${out[1]}).`,
  };
}

function matricesChallenge() {
  return [
    genMatrixCell(), genMatrixCell(),
    genMatrixTransform(), genMatrixCell(),
    genMatrixTransform(), genMatrixTransform(),
    genMatrixCell(), genMatrixTransform(),
  ];
}

// ── computer: binary & data ───────────────────────────────────────────────────
function genBitPattern() {
  const n = ri(1, 15);
  return {
    type: 'bitpattern',
    prompt: `Flip the switches to show ${n} in binary.`,
    bits: 4, target: n.toString(2).padStart(4, '0'), labels: ['8', '4', '2', '1'],
    correctFeedback: `Correct. ${n.toString(2).padStart(4, '0')} is ${n}.`,
    incorrectFeedback: `${n} = ${[8, 4, 2, 1].filter((v, i) => (n >> (3 - i)) & 1).join(' + ') || '0'}, so the pattern is ${n.toString(2).padStart(4, '0')}.`,
  };
}

function genPixelGrid() {
  // Vertically-symmetric random 4x4 so the target is readable, not noise.
  const rows = Array.from({ length: 4 }, () => {
    const half = `${ri(0, 1)}${ri(0, 1)}`;
    return half + half.split('').reverse().join('');
  });
  // Never all-zero
  if (!rows.join('').includes('1')) rows[1] = '0110';
  return {
    type: 'pixelgrid',
    prompt: 'Paint the grid to match the target exactly.',
    target: rows,
    correctFeedback: 'Matched. Bits become pictures.',
    incorrectFeedback: 'Compare each square against the target, row by row.',
  };
}

function binaryChallenge() {
  return [
    genBitPattern(), genBitPattern(),
    genPixelGrid(), genBitPattern(),
    genBitPattern(), genPixelGrid(),
    genBitPattern(), genBitPattern(),
  ];
}

// ── chemistry: atoms & molecules ─────────────────────────────────────────────
// AtomBuilder caps: protons/electrons ≤ 12, neutrons ≤ 14.
const ELEMENTS = [
  { name: 'Hydrogen', p: 1, n: 0 }, { name: 'Helium', p: 2, n: 2 },
  { name: 'Lithium', p: 3, n: 4 }, { name: 'Beryllium', p: 4, n: 5 },
  { name: 'Boron', p: 5, n: 6 }, { name: 'Carbon', p: 6, n: 6 },
  { name: 'Nitrogen', p: 7, n: 7 }, { name: 'Oxygen', p: 8, n: 8 },
  { name: 'Fluorine', p: 9, n: 10 }, { name: 'Neon', p: 10, n: 10 },
  { name: 'Sodium', p: 11, n: 12 }, { name: 'Magnesium', p: 12, n: 12 },
];
const IONS = [
  { name: 'the Na⁺ ion', base: 'Sodium', p: 11, n: 12, e: 10 },
  { name: 'the Mg²⁺ ion', base: 'Magnesium', p: 12, n: 12, e: 10 },
  { name: 'the O²⁻ ion', base: 'Oxygen', p: 8, n: 8, e: 10 },
  { name: 'the F⁻ ion', base: 'Fluorine', p: 9, n: 10, e: 10 },
  { name: 'the Li⁺ ion', base: 'Lithium', p: 3, n: 4, e: 2 },
];
const ISOTOPES = [
  { name: 'carbon-14 (neutral)', p: 6, n: 8, e: 6 },
  { name: 'deuterium, hydrogen-2 (neutral)', p: 1, n: 1, e: 1 },
  { name: 'carbon-13 (neutral)', p: 6, n: 7, e: 6 },
  { name: 'oxygen-18 (neutral)', p: 8, n: 10, e: 8 },
];

function genAtom(tier) {
  if (tier === 0) {
    const el = pick(ELEMENTS);
    return {
      type: 'atombuilder',
      prompt: `Build a neutral ${el.name} atom.`,
      targetName: el.name, targetProtons: el.p, targetNeutrons: el.n, targetElectrons: el.p,
      correctFeedback: `Correct. ${el.name}: ${el.p} protons define it; neutral means electrons match.`,
      incorrectFeedback: `${el.name} needs ${el.p}p / ${el.n}n / ${el.p}e.`,
    };
  }
  if (tier === 1) {
    const ion = pick(IONS);
    return {
      type: 'atombuilder',
      prompt: `Build ${ion.name}. Charge changes electrons, never protons.`,
      targetName: ion.name, targetProtons: ion.p, targetNeutrons: ion.n, targetElectrons: ion.e,
      correctFeedback: `Correct. Still ${ion.base} (${ion.p} protons) — only the electron count moved.`,
      incorrectFeedback: `${ion.name} keeps ${ion.p} protons; the charge means ${ion.e} electrons.`,
    };
  }
  const iso = pick(ISOTOPES);
  return {
    type: 'atombuilder',
    prompt: `Build ${iso.name}. Isotopes change neutrons, nothing else.`,
    targetName: iso.name, targetProtons: iso.p, targetNeutrons: iso.n, targetElectrons: iso.e,
    correctFeedback: `Correct. Same element, heavier nucleus: ${iso.n} neutrons.`,
    incorrectFeedback: `${iso.name} is ${iso.p}p / ${iso.n}n / ${iso.e}e.`,
  };
}

const MOLECULES = [
  { formula: 'H2O', atoms: { H: 2, O: 1 } },
  { formula: 'CO2', atoms: { C: 1, O: 2 } },
  { formula: 'NH3', atoms: { N: 1, H: 3 } },
  { formula: 'CH4', atoms: { C: 1, H: 4 } },
  { formula: 'O2', atoms: { O: 2 } },
  { formula: 'N2', atoms: { N: 2 } },
  { formula: 'H2O2', atoms: { H: 2, O: 2 } },
  { formula: 'C2H6', atoms: { C: 2, H: 6 } },
];

function genMolecule() {
  const mol = pick(MOLECULES);
  return {
    type: 'moleculebuilder',
    prompt: `Build ${mol.formula}. Subscripts count atoms.`,
    targetFormula: mol.formula, targetAtoms: mol.atoms,
    correctFeedback: `Correct. ${mol.formula} assembled.`,
    incorrectFeedback: `Read the subscripts again: ${mol.formula}.`,
  };
}

function chemistryChallenge() {
  return [
    genAtom(0), genMolecule(),
    genAtom(0), genAtom(1),
    genMolecule(), genAtom(1),
    genAtom(2), genMolecule(),
  ];
}

// ── physics: forces & waves ───────────────────────────────────────────────────
function genForceBalance() {
  const target = pick(['balanced', 'left', 'right']);
  // Random start that does NOT already satisfy the target.
  let l, r;
  do { l = ri(0, 5); r = ri(0, 5); }
  while ((target === 'balanced' && l === r) || (target === 'left' && r < l) || (target === 'right' && r > l));
  return {
    type: 'forcebalance',
    prompt: target === 'balanced' ? 'Make the forces cancel exactly.' : `Make the cart move ${target}.`,
    target, startLeft: l, startRight: r,
    correctFeedback: target === 'balanced' ? 'Correct. Equal and opposite: net force zero.' : `Correct. The bigger push wins — net force points ${target}.`,
    incorrectFeedback: 'Compare the two pushes. The cart follows the bigger one.',
  };
}

function genWaveTuner() {
  const amp = ri(1, 5);
  let freq = ri(1, 5);
  if (amp === 1 && freq === 1) freq = ri(2, 5); // not the starting slider position
  return {
    type: 'wavetuner',
    prompt: 'Tune the wave to sit exactly on the dashed target.',
    targetAmplitude: amp, targetFrequency: freq,
    correctFeedback: `Correct. Height ${amp}, crowding ${freq}.`,
    incorrectFeedback: `The target wave has height ${amp} and ${freq} full waves across.`,
  };
}

function physicsChallenge() {
  return [
    genForceBalance(), genWaveTuner(),
    genForceBalance(), genWaveTuner(),
    genForceBalance(), genWaveTuner(),
    genForceBalance(), genWaveTuner(),
  ];
}

// ── registry ──────────────────────────────────────────────────────────────────
const CHALLENGES = {
  'line-core': { build: lineChallenge, timeLimitSec: 150 },
  'matrices': { build: matricesChallenge, timeLimitSec: 120 },
  'binary-data': { build: binaryChallenge, timeLimitSec: 120 },
  'chemistry-core': { build: chemistryChallenge, timeLimitSec: 180 },
  'forces-waves': { build: physicsChallenge, timeLimitSec: 120 },
};

/** Fresh randomized challenge for a WorkshopLab module, or null if none exists. */
export function getChallengeForModule(moduleId) {
  const entry = CHALLENGES[moduleId];
  if (!entry) return null;
  return { interactions: entry.build(), timeLimitSec: entry.timeLimitSec };
}
