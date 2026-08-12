import fs from 'node:fs';
import { BOARD_MEDIA } from '../src/lib/content/boardMedia.js';

const catalogue = JSON.parse(fs.readFileSync('.audit-cache/live-production-bbs.json', 'utf8'));
const boards = catalogue.boards.filter((board) => board.tags?.subject === 'maths');
const total = boards.reduce((sum, board) => sum + board.layers.length, 0);
const covered = boards.reduce((sum, board) => (
  sum + board.layers.filter((_, floor) => BOARD_MEDIA[board.id]?.[floor]).length
), 0);
const types = {};
const topics = {};
for (const board of boards) {
  const topic = board.tags?.topic || 'Uncategorised';
  topics[topic] ||= { covered: 0, total: 0, percent: 0 };
  topics[topic].total += board.layers.length;
  for (const [floor, media] of Object.entries(BOARD_MEDIA[board.id] || {})) {
    if (Number(floor) < board.layers.length) {
      types[media.type] = (types[media.type] || 0) + 1;
      topics[topic].covered++;
    }
  }
}
for (const topic of Object.values(topics)) topic.percent = Number((topic.covered / topic.total * 100).toFixed(2));

console.log(JSON.stringify({
  subject: 'maths', boards: boards.length, covered, total,
  percent: Number((covered / total * 100).toFixed(2)), types, topics
}, null, 2));

if (covered / total < 0.8 || Object.values(topics).some((topic) => topic.percent < 80)) process.exitCode = 1;
