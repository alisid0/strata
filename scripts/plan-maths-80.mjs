import fs from 'node:fs';
import { BOARD_MEDIA } from '../src/lib/content/boardMedia.js';

const catalogue = JSON.parse(fs.readFileSync('.audit-cache/live-production-bbs.json', 'utf8'));
const topicKinds = {
  'Coordinate geometry': 'coordinate', 'Coordinate maps': 'vector', 'The Line': 'number-line',
  Functions: 'function', 'Lines & gradients': 'linear', Matrices: 'matrix',
  'Exponents & logarithms': 'exponential', Trigonometry: 'trig',
  Differentiation: 'derivative', Limits: 'limit'
};
const candidates = catalogue.boards
  .filter((board) => board.tags?.subject === 'maths')
  .flatMap((board) => board.layers.map((html, floor) => ({
    board: board.id, floor, topic: board.tags.topic, title: board.title,
    text: html.replace(/<[^>]+>/g, ' '), kind: topicKinds[board.tags.topic] || 'function'
  })))
  .filter((row) => !BOARD_MEDIA[row.board]?.[row.floor]);

const allMaths = catalogue.boards.filter((board) => board.tags?.subject === 'maths');
const topics = [...new Set(allMaths.map((board) => board.tags.topic))];
const selected = [];
for (const topic of topics) {
  const topicBoards = allMaths.filter((board) => board.tags.topic === topic);
  const total = topicBoards.reduce((sum, board) => sum + board.layers.length, 0);
  const covered = topicBoards.reduce((sum, board) => sum + board.layers.filter((_, floor) => BOARD_MEDIA[board.id]?.[floor]).length, 0);
  const need = Math.max(0, Math.ceil(total * 0.82) - covered);
  selected.push(...candidates.filter((row) => row.topic === topic).slice(0, need));
}

let threeLeft = 10;
for (const row of selected) {
  if (row.topic === 'Trigonometry' && threeLeft > 0) { row.mode = 'three'; threeLeft--; continue; }
  const signal = `${row.title} ${row.text}`;
  if (/change|approach|limit|slope|gradient|grow|decay|motion|tangent|rate|curve|repeat/i.test(signal)) row.mode = 'motion';
  else if (/point|line|input|output|function|matrix|angle|vector|coordinate|exponent|power|value/i.test(signal)) row.mode = 'interactive';
  else row.mode = 'diagram';
}
// Preserve a deliberate pixel-art layer for narrative/intuition floors.
for (const row of selected.filter((row) => row.mode === 'diagram').filter((_, index) => index % 4 === 3)) row.mode = 'pixel';
let pixelCount = selected.filter((row) => row.mode === 'pixel').length;
for (const row of selected) {
  if (pixelCount >= 40) break;
  if (row.mode === 'interactive' && !/equation|matrix|coordinate|gradient|function/i.test(`${row.title} ${row.text}`)) {
    row.mode = 'pixel'; pixelCount++;
  }
}

console.log(`TARGET ${selected.length} additions; ${156 + selected.length}/517 = ${((156 + selected.length) / 517 * 100).toFixed(2)}%`);
for (const mode of ['three', 'interactive', 'diagram', 'motion', 'pixel']) {
  const rows = selected.filter((row) => row.mode === mode);
  console.log(`\n${mode.toUpperCase()} (${rows.length})`);
  console.log(rows.map((row) => `${row.board}.${row.floor}.${row.kind}`).join(','));
}
