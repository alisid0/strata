/**
 * Problem-led workshop experiences. The syllabus name stays hidden until the
 * learner has experimented, stated a rule, and transferred it to a new case.
 *
 * `track` is the workshop subject the experience belongs to, so the shell can
 * open the correct subject rail. `kind` selects the specialised game component
 * in WorkshopLab (logic-vault -> SolveFirst, force-lab -> SolveFirstForces,
 * coordinate-signal -> SolveFirstCoordinates, limit-probe -> SolveFirstLimits,
 * network-routing -> SolveFirstNetworks).
 */
const SOLVE_FIRST = {
  'logic-gates': {
    id: 'lockers-and-or',
    moduleId: 'logic-gates',
    pathId: 'BIT_001',
    track: 'computer',
    kind: 'logic-vault',
    eyebrow: 'Unmarked problem 01',
    title: 'Crack the Lockers',
    sub: 'No lesson first. Operate two security systems, prove their rules, then uncover AND and OR.',
    rewardLabel: 'Access Architect'
  },
  'forces-waves': {
    id: 'forces-stop-the-cart',
    moduleId: 'forces-waves',
    pathId: 'PHYS_001',
    track: 'physics',
    kind: 'force-lab',
    eyebrow: 'Unmarked problem 02',
    title: 'Stop the Cart',
    sub: 'No lesson first. Command two opposing thrusters, prove what makes a cart move or hold still, then name the rule.',
    rewardLabel: 'Force Controller'
  },
  'line-core': {
    id: 'coordinate-find-the-signal',
    moduleId: 'line-core',
    pathId: 'LINE_001',
    track: 'mathematics',
    kind: 'coordinate-signal',
    eyebrow: 'Unmarked problem 03',
    title: 'Find the Signal',
    sub: 'No lesson first. Fly a locator drone through a blacked-out map, recover every rescue signal, then name the map you rebuilt.',
    rewardLabel: 'Grid Navigator'
  },
  'limits': {
    id: 'limits-recover-the-reading',
    moduleId: 'limits',
    pathId: 'MATH_LIMITS',
    track: 'mathematics',
    kind: 'limit-probe',
    eyebrow: 'Unmarked problem 04',
    title: 'Recover the Reading',
    sub: 'No lesson first. Probe a failed sensor from both sides, reconstruct what it was heading toward, and detect when no single reading is defensible.',
    rewardLabel: 'Boundary Analyst'
  },
  'networks-cloud': {
    id: 'networks-save-the-broadcast',
    moduleId: 'networks-cloud',
    pathId: 'COMP_NETWORKS_SECURITY',
    track: 'computer',
    kind: 'network-routing',
    eyebrow: 'Unmarked problem 05',
    title: 'Save the Broadcast',
    sub: 'No lesson first. Rebuild a live picture, keep its pieces organised, and survive a broken route.',
    rewardLabel: 'Route Architect'
  },
  'matrices': {
    id: 'matrices-warp-the-grid',
    moduleId: 'matrices',
    pathId: 'MATH_MATRICES',
    track: 'mathematics',
    kind: 'matrix-warp',
    eyebrow: 'Unmarked problem 06',
    title: 'Warp the Grid',
    sub: 'No lesson first. Bend a shape with two guide arrows, prove they decide where every point lands, then name the machine.',
    rewardLabel: 'Space Bender'
  },
  'probability': {
    id: 'probability-trust-the-detector',
    moduleId: 'probability',
    pathId: 'MATH_PROBABILITY',
    track: 'mathematics',
    kind: 'bayes-screen',
    eyebrow: 'Unmarked problem 07',
    title: 'Trust the Detector',
    sub: 'No lesson first. Sweep a treasure field, predict whether a beep is really gold, then watch the rare truth split from a crowd of false alarms.',
    rewardLabel: 'Base-Rate Reader'
  }
};

export function getSolveFirst(moduleId) {
  const item = SOLVE_FIRST[moduleId];
  return item ? { ...item } : null;
}

export function getFeaturedSolveFirst() {
  return { ...SOLVE_FIRST['logic-gates'] };
}

/** All Solve First experiences, for the dedicated "Solve First" category. */
export function getAllSolveFirst() {
  return Object.values(SOLVE_FIRST).map((x) => ({ ...x }));
}
