/**
 * Strata — Paths Manifest
 * Subject → path → ordered card numbers.
 */
export const PATHS = {
  P1: { subject: 'physics', name: 'Forces & motion', icon: 'physics', cards: [3, 4, 5, 6, 7, 8, 9], quizUrls: [] },
  P2: { subject: 'physics', name: 'Energy', icon: 'physics', cards: [10, 11], quizUrls: [] },
  P3: { subject: 'physics', name: 'Gravity', icon: 'physics', cards: [16], quizUrls: [] },
  M1: { subject: 'maths', name: 'Getting infinitely close', icon: 'maths', cards: [12, 13, 14, 15], quizUrls: [] },
  M3: {
    subject: 'maths',
    name: 'Coordinate geometry',
    icon: 'maths',
    cards: Array.from({ length: 70 - 38 + 1 }, (_, i) => 38 + i),
    quizUrls: ['QUIZ-TIER0.html', 'QUIZ-TIER1.html']
  },
  C1: { subject: 'chemistry', name: 'Into the atom', icon: 'chemistry', cards: [33, 34, 35, 36, 37], quizUrls: [] }
};

/** Grouped by subject for the subjects overview */
export const SUBJECT_PATHS = {
  physics: ['P1', 'P2', 'P3'],
  maths: ['M1', 'M3'],
  chemistry: ['C1']
};

export const SUBJECT_LABELS = {
  physics: 'Physics',
  maths: 'Mathematics',
  chemistry: 'Chemistry'
};

export const SUBJECT_ICONS = {
  physics: 'physics',
  maths: 'maths',
  chemistry: 'chemistry'
};

/** Get paths that contain a given card number */
export function pathsForCard(cardNumber) {
  const ids = [];
  for (const id in PATHS) {
    if (PATHS[id].cards.includes(cardNumber)) ids.push(id);
  }
  return ids;
}

/** Get total board count (all 70 cards, including unpathed) */
export function totalBoards() {
  return 70;
}
