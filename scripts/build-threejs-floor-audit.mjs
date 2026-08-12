import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BOARD_MEDIA } from '../src/lib/content/boardMedia.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const catalogue = JSON.parse(readFileSync(join(root, '.audit-cache', 'live-production-bbs.json'), 'utf8'));
const boards = new Map(catalogue.boards.map((board) => [Number(board.id), board]));

// Human-reviewed, floor-specific additions. These are deliberately limited to
// concepts where rotation, depth, occlusion, or a spatial particle model adds
// meaning that a precise 2D SVG/canvas treatment would not communicate as well.
const additions = [
  [1001, 4, 'unit-cube-volume', 'Stack and rotate unit cubes to make the third dimension tangible.'],
  [1053, 4, 'atom-scale', 'Reveal the tiny nucleus inside a mostly empty atom with a navigable scale model.'],
  [1054, 2, 'atomic-structure', 'Separate the compact nucleus from the surrounding electron regions in depth.'],
  [1055, 0, 'nucleus-counter', 'Let proton and neutron counts change the nucleus while Z and A update.'],
  [1056, 1, 'isotope-comparison', 'Rotate carbon nuclei side by side and expose the neutron difference.'],
  [1056, 2, 'isotope-comparison', 'Reuse the same nuclei while formalising the isotope definition.'],
  [1057, 2, 'electron-shells', 'Return to the spatial shell model when capacities and energy levels are named.'],
  [1058, 1, 'ion-shell-transfer', 'Show the outer electron leaving sodium and changing its net charge.'],
  [1058, 3, 'ion-shell-transfer', 'Connect electron transfer to the stable noble-gas configuration.'],
  [1059, 1, 'filled-shell-atoms', 'Compare helium, neon, and argon as complete nested shells.'],
  [1061, 1, 'covalent-orbital-overlap', 'Make two hydrogen electron regions overlap around both nuclei.'],
  [1062, 2, 'ionic-transfer', 'Replay transfer at the formal definition of electrostatic attraction.'],
  [1064, 2, 'metallic-electron-sea', 'Move through a 3D ion lattice containing delocalised electrons.'],
  [1070, 2, 'ionic-lattice', 'Reuse the lattice when the repeating 3D array is formally defined.'],
  [1071, 2, 'covalent-network', 'Contrast diamond and graphite as continuous spatial networks.'],
  [1072, 1, 'molecular-shape-gallery', 'Rotate linear and tetrahedral examples while counting electron regions.'],
  [1072, 2, 'molecular-shape-gallery', 'Map two, three, and four electron regions to their spatial shapes.'],
  [1072, 3, 'shape-polarity-comparison', 'Compare bent and symmetric molecules from multiple viewing angles.'],
  [1073, 2, 'molecular-polarity', 'Rotate the molecule while bond dipoles add or cancel.'],
  [1075, 4, 'structure-type-comparison', 'Contrast a discrete molecule, ionic lattice, and covalent network in depth.'],
  [1075, 6, 'molecular-shape-gallery', 'Show the exact bent, linear, pyramidal, and tetrahedral geometries.'],
  [1076, 2, 'trigonal-planar-molecule', 'A rotatable flat 120-degree arrangement makes planarity unambiguous.'],
  [1076, 3, 'tetrahedral-molecule', 'The move from a flat sketch into a tetrahedron specifically requires depth.'],
  [1076, 4, 'lone-pair-geometry', 'Expose the unseen lone pair that compresses ammonia bond angles.'],
  [1076, 5, 'water-lone-pairs', 'Show two bonds and two lone pairs occupying tetrahedral directions.'],
  [1077, 3, 'dna-base-pairs', 'Rotate the helix and inspect hydrogen-bonded base pairs as ladder rungs.'],
  [1077, 6, 'protein-alpha-helix', 'Trace hydrogen bonds along a right-handed protein helix.'],
  [1096, 1, 'atomic-structure', 'Separate nucleus and electron cloud without implying a flat atom.'],
  [1098, 2, 'nucleus-counter', 'Make element identity change directly with the proton count.'],
  [1101, 3, 'water-molecule', 'Show that two hydrogen atoms attach to oxygen in a bent spatial molecule.'],
  [1104, 2, 'atom-scale', 'Navigate the stadium-scale gap between nucleus and electron region.'],
  [1112, 3, 'nucleus-forces', 'Show many protons packed together and the directions of their repulsion.'],
  [1118, 2, 'carbon-architecture', 'Build chains, rings, and branches from carbon bonds in three dimensions.'],
  [1197, 2, 'atom-scale', 'Make the stadium-and-marble emptiness analogy spatially explorable.'],
  [1202, 1, 'electron-shells', 'Introduce shells as nested energy regions rather than a flat ladder.'],
  [1202, 2, 'shell-capacity-builder', 'Fill the first shell, then place later electrons into the next shell.'],
  [1202, 3, 'shell-capacity-builder', 'Continue filling the second and third shells in the same model.'],
  [1205, 2, 'filled-shell-atom', 'Display neon with a visibly complete outer shell.'],
  [1213, 0, 'molecular-shape-gallery', 'The floor explicitly replaces flat drawings with three-dimensional objects.'],
  [1214, 0, 'linear-molecule', 'Rotate a two-region molecule to confirm its 180-degree line.'],
  [1214, 1, 'trigonal-planar-molecule', 'Confirm that three regions share one plane at 120 degrees.'],
  [1214, 3, 'lone-pair-geometry', 'Make the invisible lone-pair volume and stronger repulsion visible.'],
  [1215, 1, 'bond-polarity', 'Show the shared electron density displaced toward oxygen.'],
  [1215, 3, 'bond-polarity', 'Reuse the spatial tug-of-war at the polar-bond definition.'],
  [1216, 0, 'shape-polarity-comparison', 'Compare polar bonds in symmetric and asymmetric 3D arrangements.'],
  [1218, 1, 'dna-helix', 'Introduce the double helix as a rotatable object rather than a flat ladder.'],
  [1334, 0, 'electron-shells', 'Establish nested energy levels around the nucleus before discussing reactivity.'],
  [1335, 1, 'ion-charge-builder', 'Remove an electron and show positive charge emerging from the count imbalance.'],
  [1335, 2, 'ion-charge-builder', 'Add an electron and show the negative ion as the complementary case.'],
  [1335, 3, 'ion-charge-builder', 'Keep the nucleus fixed while changing only the electron population.'],
  [1337, 2, 'covalent-electron-pair', 'Place a shared pair between two nuclei and inspect the attraction in depth.'],
  [1338, 2, 'metallic-electron-sea', 'Show mobile electrons surrounding a 3D lattice of positive ions.'],
  [1339, 2, 'molecular-shape-gallery', 'Compare linear, bent, trigonal planar, and tetrahedral examples directly.'],
  [1340, 0, 'bond-polarity', 'Introduce uneven electron density as a spatial distribution.'],
  [1345, 0, 'thermal-lattice', 'Animate stronger vibration and increasing average spacing in a solid lattice.'],
  [1349, 1, 'particle-states', 'Switch the same particles among solid, liquid, and gas arrangements.'],
  [1350, 1, 'ideal-gas-particles', 'Use a navigable box of point particles with elastic wall collisions.'],
  [1353, 0, 'gas-wall-collisions', 'Connect molecular impacts on all container walls to pressure.'],
  [1353, 1, 'gas-wall-collisions', 'Raise particle speed and compare collision frequency and impulse.'],
  [1356, 2, 'entropy-microstates', 'Expand from one ordered arrangement into many accessible microstates.'],
  [1379, 4, 'unit-circle', 'Return to the circular model when rotation and repeating motion are generalised.'],
  [1414, 3, 'proton-transfer', 'Move a proton between molecules and track the resulting charge distribution.'],
  [1414, 4, 'proton-transfer', 'Show how one transferred particle changes both molecular species.'],
  [1422, 1, 'reaction-collisions', 'Compare cold and warm molecular motion inside the same volume.'],
  [1422, 2, 'reaction-collisions', 'Connect changed conditions to the frequency of successful collisions.']
];

function layerText(layer) {
  const raw = typeof layer === 'object' ? (layer?.text || layer?.content || '') : String(layer || '');
  return raw.replace(/<[^>]+>/g, ' ').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim();
}

function floorRecord(boardId, floor) {
  const board = boards.get(Number(boardId));
  if (!board) throw new Error(`Unknown board ${boardId}`);
  if (floor < 0 || floor >= board.layers.length) throw new Error(`Missing floor ${boardId}:${floor}`);
  return {
    boardId: Number(boardId), floor: Number(floor), title: board.title,
    subject: board.tags?.subject || board.paths?.[0]?.subject || 'unknown',
    path: board.paths?.[0]?.pathName || 'Unassigned', text: layerText(board.layers[floor])
  };
}

const existing = [];
for (const [boardId, floors] of Object.entries(BOARD_MEDIA)) {
  for (const [floor, media] of Object.entries(floors)) {
    if (media.type !== 'three') continue;
    existing.push({ ...floorRecord(boardId, Number(floor)), model: media.spec?.kind || 'three-scene' });
  }
}

const plan = additions.map(([boardId, floor, model, rationale]) => {
  const current = BOARD_MEDIA[boardId]?.[floor];
  return {
    ...floorRecord(boardId, floor), model, rationale,
    current: current?.type || 'none',
    status: current?.type === 'three' ? 'completed' : 'recommended'
  };
});
const recommended = plan.filter((row) => row.status === 'recommended');
const completedPlan = plan.filter((row) => row.status === 'completed');

existing.sort((a, b) => a.subject.localeCompare(b.subject) || a.boardId - b.boardId || a.floor - b.floor);
recommended.sort((a, b) => a.subject.localeCompare(b.subject) || a.boardId - b.boardId || a.floor - b.floor);

const countBy = (rows, key) => Object.entries(rows.reduce((acc, row) => {
  acc[row[key]] = (acc[row[key]] || 0) + 1;
  return acc;
}, {})).sort((a, b) => a[0].localeCompare(b[0]));
const addedBoards = new Set(recommended.map((row) => row.boardId)).size;
const existingBoards = new Set(existing.map((row) => row.boardId)).size;
const totalSpatial = existing.length + recommended.length;
const focus = (text) => text.length > 105 ? `${text.slice(0, 102)}...` : text;

const lines = [
  '# Three.js floor opportunity audit',
  '',
  `Generated from the live production catalogue on ${new Date().toISOString().slice(0, 10)}.`,
  '',
  '## Decision',
  '',
  `**${recommended.length} additional floors across ${addedBoards} boards need a Three.js object to materially improve spatial understanding.**`,
  '',
  `Progress against this audited plan: **${completedPlan.length} of ${plan.length} additions completed; ${recommended.length} remain.**`,
  '',
  `The app already serves Three.js on ${existing.length} floors across ${existingBoards} boards. After the recommended work, ${totalSpatial} of ${catalogue.floorCount} live floors would use Three.js.`,
  '',
  'This is a strict count. A floor is included only when depth, rotation, occlusion, a spatial particle system, or a genuinely three-dimensional structure adds meaning. Graphs, circuits, equations, ray diagrams, and ordinary sliders remain deterministic 2D interactions.',
  '',
  '## Additional need by subject',
  '',
  '| Subject | Floors |',
  '|---|---:|',
  ...countBy(recommended, 'subject').map(([name, count]) => `| ${name} | ${count} |`),
  '',
  '## Additional need by object family',
  '',
  '| Three.js object | Floors |',
  '|---|---:|',
  ...countBy(recommended, 'model').map(([name, count]) => `| ${name} | ${count} |`),
  '',
  '## Floor-by-floor additions',
  '',
  '| Board | Floor | Subject | Topic | Floor focus | Recommended object | Why Three.js | Current media |',
  '|---:|---:|---|---|---|---|---|---|',
  ...recommended.map((row) => `| ${row.boardId} | ${row.floor} | ${row.subject} | ${row.title.replace(/\|/g, '\\|')} | ${focus(row.text).replace(/\|/g, '\\|')} | ${row.model} | ${row.rationale} | ${row.current} |`),
  '',
  '## Already covered floor by floor',
  '',
  '| Board | Floor | Subject | Topic | Existing Three.js object |',
  '|---:|---:|---|---|---|',
  ...existing.map((row) => `| ${row.boardId} | ${row.floor} | ${row.subject} | ${row.title.replace(/\|/g, '\\|')} | ${row.model} |`),
  '',
  '## Implementation order',
  '',
  '1. Molecular geometry and lone-pair models.',
  '2. Atomic scale, shells, ions, and isotope comparison.',
  '3. Bonding, lattices, polarity, DNA, and proton transfer.',
  '4. Particle-state, gas-collision, thermal-lattice, and entropy models.',
  '5. Unit-cube volume and the repeated unit-circle model.',
  ''
];

writeFileSync(join(root, 'docs', 'THREEJS-FLOOR-AUDIT.md'), lines.join('\n'));

const csvRows = [
  ['status', 'board', 'floor', 'subject', 'path', 'title', 'model', 'rationale_or_floor_text', 'current_media'],
  ...recommended.map((r) => ['recommended', r.boardId, r.floor, r.subject, r.path, r.title, r.model, r.rationale, r.current]),
  ...existing.map((r) => ['existing', r.boardId, r.floor, r.subject, r.path, r.title, r.model, r.text, 'three'])
];
const csv = csvRows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
writeFileSync(join(root, '.audit-cache', 'THREEJS-FLOOR-AUDIT.csv'), csv);

console.log(`Three.js audit: ${recommended.length} additional floors / ${addedBoards} boards.`);
console.log(`Plan progress: ${completedPlan.length}/${plan.length} additions completed.`);
console.log(`Already covered: ${existing.length} floors / ${existingBoards} boards.`);
console.log(`Total spatial set after implementation: ${totalSpatial}/${catalogue.floorCount} floors.`);
