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

function genBitsToNumber(mode) {
  const n = ri(1, 15);
  if (mode === 'read') {
    const options = [n];
    while (options.length < 4) {
      const d = riNot(0, 15, options);
      options.push(d);
    }
    return {
      type: 'bitsnumber', mode: 'read',
      prompt: 'Read the bits. What number is this?',
      shown: n.toString(2).padStart(4, '0'),
      options: options.sort((a, b) => a - b),
      correctFeedback: `Correct. ${n.toString(2).padStart(4, '0')} is ${n}.`,
      incorrectFeedback: `Add up the lit place values — they come to ${n}.`,
    };
  }
  return {
    type: 'bitsnumber', mode: 'build',
    prompt: `Build ${n}. The running total updates as you flip.`,
    bits: 4, target: n,
    correctFeedback: `Correct. ${n} is ${n.toString(2).padStart(4, '0')}.`,
    incorrectFeedback: `Break ${n} into powers of two and flip those switches.`,
  };
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function genBitsToWord(mode) {
  const letter = LETTERS[ri(0, 25)];
  if (mode === 'read') {
    const options = [letter];
    while (options.length < 4) {
      const d = LETTERS[ri(0, 25)];
      if (!options.includes(d)) options.push(d);
    }
    return {
      type: 'bitsword', mode: 'read',
      prompt: 'Decode the byte. Which letter is it?',
      shown: letter.charCodeAt(0).toString(2).padStart(8, '0'),
      options: options.sort(),
      correctFeedback: `Correct. Code ${letter.charCodeAt(0)} is ${letter}.`,
      incorrectFeedback: `The lit places sum to ${letter.charCodeAt(0)}, which is ${letter}.`,
    };
  }
  return {
    type: 'bitsword', mode: 'build',
    prompt: `Build the byte for ${letter}. Watch the letter card as you flip.`,
    target: letter,
    correctFeedback: `Correct. ${letter} is code ${letter.charCodeAt(0)}.`,
    incorrectFeedback: `${letter} is code ${letter.charCodeAt(0)} — build that number from the place values.`,
  };
}

function binaryChallenge() {
  return [
    genBitsToNumber('build'), genBitPattern(),
    genBitsToNumber('read'), genPixelGrid(),
    genBitsToWord('build'), genBitsToNumber('read'),
    genBitsToWord('read'), genBitPattern(),
  ];
}

// ── computer: logic gates ─────────────────────────────────────────────────────
const GATE_TABLES = {
  AND:  [0, 0, 0, 1], OR: [0, 1, 1, 1], XOR: [0, 1, 1, 0],
  NAND: [1, 1, 1, 0], NOR: [1, 0, 0, 0],
};
const GATE_HINTS = {
  AND: 'on only when both inputs agree at 1',
  OR: 'on when at least one input is 1',
  XOR: 'on only when the inputs disagree',
  NAND: 'the opposite of AND — off only for 1,1',
  NOR: 'the opposite of OR — on only for 0,0',
};

function genGatePick() {
  const names = Object.keys(GATE_TABLES);
  const answer = pick(names);
  const palette = [answer];
  while (palette.length < 4) {
    const g = pick(names);
    if (!palette.includes(g)) palette.push(g);
  }
  // Stable palette order so the answer position isn't a tell.
  palette.sort();
  return {
    type: 'gatebuilder', mode: 'pick',
    prompt: 'Match the truth table. Toggle A and B to test each gate live.',
    chain: 1, palette, targetTable: GATE_TABLES[answer],
    correctFeedback: `Correct. ${answer}: ${GATE_HINTS[answer]}.`,
    incorrectFeedback: `That table is ${answer} — ${GATE_HINTS[answer]}.`,
  };
}

function genGateSolve() {
  const pairs = [
    ['AND', 'OR'], ['OR', 'AND'], ['XOR', 'AND'], ['AND', 'XOR'],
    ['XOR', 'OR'], ['NAND', 'AND'], ['OR', 'XOR'],
  ];
  const [g1, g2] = pick(pairs);
  return {
    type: 'gatebuilder', mode: 'solve',
    prompt: `Light the bulb through ${g1} feeding ${g2}.`,
    chain: 2, gatesLocked: [g1, g2],
    correctFeedback: `Correct. The ${g1} output and C together satisfy the ${g2}.`,
    incorrectFeedback: `Work backwards: what does the ${g2} need, and how does the ${g1} produce it?`,
  };
}

function logicChallenge() {
  return [
    genGatePick(), genGateSolve(),
    genGatePick(), genGatePick(),
    genGateSolve(), genGatePick(),
    genGateSolve(), genGatePick(),
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

// ── maths: functions ──────────────────────────────────────────────────────────
function shuffleOpts(opts) {
  const s = [...opts];
  for (let i = s.length - 1; i > 0; i--) {
    const j = ri(0, i);
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}

function genFunctionValue() {
  const a = ri(2, 5), b = ri(1, 9), x = ri(0, 6);
  const answer = a * x + b;
  const distractors = [...new Set([x + b, a * x, a + b + x])].filter(v => v !== answer).slice(0, 3);
  return {
    type: 'scenario',
    prompt: `Machine f uses f(x) = ${a}x + ${b}. What is f(${x})?`,
    options: shuffleOpts([
      { id: 'correct', label: String(answer), correct: true },
      ...distractors.map((v, i) => ({ id: `d${i}`, label: String(v), correct: false })),
    ]),
    correctFeedback: 'Correct. Put the input into the rule and calculate the output.',
    incorrectFeedback: `Use ${a} × ${x} + ${b} = ${answer}.`,
  };
}

function genBrokenTable() {
  const brokenIn = ri(1, 5);
  const goodOut = brokenIn + ri(2, 5);
  const badOut = goodOut + ri(1, 4);
  const okIn = riNot(1, 6, [brokenIn]);
  const isABroken = ri(0, 1) === 1;
  const tableFor = (broken) => broken
    ? `${brokenIn}→${goodOut}, ${okIn}→${okIn + 2}, ${brokenIn}→${badOut}`
    : `${brokenIn}→${goodOut}, ${okIn}→${okIn + 2}, ${brokenIn}→${goodOut}`;
  return {
    type: 'scenario',
    prompt: `One of these tables is NOT a function.\n\nTable A: ${tableFor(isABroken)}\nTable B: ${tableFor(!isABroken)}`,
    options: shuffleOpts([
      { id: 'a', label: 'Table A', correct: isABroken },
      { id: 'b', label: 'Table B', correct: !isABroken },
    ]),
    correctFeedback: `Correct. Input ${brokenIn} appears twice with different outputs — the machine is unreliable.`,
    incorrectFeedback: `Look for input ${brokenIn} giving both ${goodOut} and ${badOut} in the broken table.`,
  };
}

function genRangeFromDomain() {
  const domain = [0, ri(1, 2), ri(3, 4)];
  const kind = pick(['square', 'double', 'add']);
  const k = ri(2, 5);
  const fn = kind === 'square' ? (x) => x * x : kind === 'double' ? (x) => k * x : (x) => x + k;
  const rule = kind === 'square' ? 'f(x) = x²' : kind === 'double' ? `f(x) = ${k}x` : `f(x) = x + ${k}`;
  const range = domain.map(fn);
  const wrong1 = domain.join(', ');
  const wrong2 = domain.map(x => fn(x) + 1).join(', ');
  return {
    type: 'scenario',
    prompt: `Domain: {${domain.join(', ')}}. Rule: ${rule}. What is the range?`,
    options: shuffleOpts([
      { id: 'correct', label: `{${range.join(', ')}}`, correct: true },
      { id: 'w1', label: `{${wrong1}}`, correct: false },
      { id: 'w2', label: `{${wrong2}}`, correct: false },
    ]),
    correctFeedback: 'Correct. The range is every output the machine actually produces from its domain.',
    incorrectFeedback: `Apply ${rule} to each domain value: {${range.join(', ')}}.`,
  };
}

function genComposition() {
  const b = ri(1, 4), a = ri(2, 4), x = ri(1, 5);
  const mid = x + b, out = a * mid;
  return {
    type: 'scenario',
    prompt: `g(x) = x + ${b} runs first, then f(x) = ${a}x. What is f(g(${x}))?`,
    options: shuffleOpts([
      { id: 'correct', label: String(out), correct: true },
      { id: 'swap', label: String(a * x + b), correct: false },
      { id: 'gonly', label: String(mid), correct: false },
    ]),
    correctFeedback: `Correct. g makes ${mid}, then f turns it into ${out}.`,
    incorrectFeedback: `Inside machine first: ${x} + ${b} = ${mid}, then ${a} × ${mid} = ${out}.`,
  };
}

function genInverseOp() {
  const k = ri(2, 9);
  const kind = pick(['add', 'multiply']);
  const rule = kind === 'add' ? `f(x) = x + ${k}` : `f(x) = ${k}x`;
  const answer = kind === 'add' ? `subtract ${k}` : `divide by ${k}`;
  const wrongs = kind === 'add'
    ? [`add ${k}`, `divide by ${k}`]
    : [`multiply by ${k}`, `subtract ${k}`];
  return {
    type: 'scenario',
    prompt: `Machine: ${rule}. Which operation runs it backwards?`,
    options: shuffleOpts([
      { id: 'correct', label: answer, correct: true },
      ...wrongs.map((w, i) => ({ id: `w${i}`, label: w, correct: false })),
    ]),
    correctFeedback: 'Correct. The inverse undoes the machine and walks the output back to the input.',
    incorrectFeedback: `To undo "${rule.split('= ')[1]}", ${answer}.`,
  };
}

function functionsChallenge() {
  return [
    genFunctionValue(), genBrokenTable(),
    genRangeFromDomain(), genFunctionValue(),
    genComposition(), genInverseOp(),
    genBrokenTable(), genComposition(),
  ];
}

// ── registry ──────────────────────────────────────────────────────────────────
const CHALLENGES = {
  'line-core': { build: lineChallenge, timeLimitSec: 150 },
  'functions': { build: functionsChallenge, timeLimitSec: 150 },
  'matrices': { build: matricesChallenge, timeLimitSec: 120 },
  'binary-data': { build: binaryChallenge, timeLimitSec: 120 },
  'logic-gates': { build: logicChallenge, timeLimitSec: 150 },
  'chemistry-core': { build: chemistryChallenge, timeLimitSec: 180 },
  'forces-waves': { build: physicsChallenge, timeLimitSec: 120 },
};

/** Fresh randomized challenge for a WorkshopLab module, or null if none exists. */
export function getChallengeForModule(moduleId) {
  const entry = CHALLENGES[moduleId];
  if (!entry) return null;
  return { interactions: entry.build(), timeLimitSec: entry.timeLimitSec };
}
