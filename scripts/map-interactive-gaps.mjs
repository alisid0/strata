import { readFileSync } from 'fs';

const d = JSON.parse(readFileSync('.audit-cache/live-production-bbs.json', 'utf8'));

const subjects = { physics: 0, maths: 0, chemistry: 0, computing: 0 };
const withLayerImg = { physics: 0, maths: 0, chemistry: 0, computing: 0 };
const zeroFloors = { physics: 0, maths: 0, chemistry: 0, computing: 0 };

d.boards.forEach(b => {
  const subj = b.paths[0]?.subject;
  if (!subj) return;
  subjects[subj]++;

  const hasImg = (b.layers || []).some(l => l && l.img);
  if (hasImg) withLayerImg[subj]++;

  const hasContent = (b.layers || []).some(l => l && (l.text));
  if (!hasContent) zeroFloors[subj]++;
});

console.log('Boards with layer images (Supabase):');
for (const [k, v] of Object.entries(withLayerImg)) {
  console.log(`  ${k}: ${v}/${subjects[k]} (${(v / subjects[k] * 100).toFixed(0)}%)`);
}

console.log('\nBoards with ZERO text floors (placeholder):');
for (const [k, v] of Object.entries(zeroFloors)) {
  console.log(`  ${k}: ${v}/${subjects[k]}`);
}
console.log(`  Total: ${Object.values(zeroFloors).reduce((a, b) => a + b, 0)}/${d.boardCount}`);

// Count boards in boardMedia.js
const with3D = new Set();
// Quick parse: boards in the live catalogue that have Three.js media in the known ranges
// Chemistry boards: 1053-1077, 1094-1120, 1202-1218, 1333-1343, 1414
const threeJsBoards = [
  1053,1054,1055,1056,1057,1058,1059,1061,1062,1063,1064,1066,1067,1068,
  1070,1071,1072,1073,1074,1075,1076,1077,
  1096,1098,1101,1104,1109,1110,1112,1113,1115,1117,1118,1119,1120,1121,
  1202,1203,1204,1205,1206,1213,1214,1215,1216,1217,1218,
  1333,1334,1335,1336,1337,1338,1339,1340,1414,
];

const pixelBoards = [1094, 1023, 1285];

console.log('\nboardMedia.js coverage (approx):');
console.log(`  Three.js boards: ${threeJsBoards.length} (all chemistry)`);
console.log(`  Pixel art boards: ${pixelBoards.length}`);
console.log(`  Concept explorer: 1285 (system design)`);

// Bundle-only topics (no Supabase rows - these are the 68 fallback boards)
const bundleTopics = ['PHY_ELECTRICITY', 'PHY_THERMO', 'PHY_OPTICS', 'CHEM_STRUCTURE_REACTIONS', 'CHEM_QUANT', 'COMP_AI_ERA', 'COMP_AI_BEHIND'];
console.log('\nBundle-only topics (68 boards, no Supabase content, no boardMedia):');
bundleTopics.forEach(t => console.log(`  - ${t}`));
