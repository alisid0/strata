/**
 * Strata — Paths Manifest
 * Subject → path → ordered card numbers.
 */
export const PATHS = {
  P0: { subject: 'physics', name: 'Mechanics — foundations', icon: 'physics', cards: [1, 2, 3, 4, 5, 6, 7], quizUrls: ['tier0'] },
  P0T1: { subject: 'physics', name: 'Mechanics — mathematical formulation', icon: 'physics', cards: [71, 72, 73, 74, 75, 76, 77], quizUrls: ['tier1'] },
  P0T2: { subject: 'physics', name: 'Mechanics — numericals', icon: 'physics', cards: [78, 79, 80, 81, 82, 83, 84], quizUrls: ['tier2'] },
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
  C1: { subject: 'chemistry', name: 'Into the atom', icon: 'chemistry', cards: [33, 34, 35, 36, 37], quizUrls: [] },
  P4: { subject: 'physics', name: 'Measurement & dimensions', icon: 'physics', cards: [85, 86, 87, 88, 89, 90, 91], quizUrls: ['tier0'] },
  P5: { subject: 'physics', name: 'Vector products', icon: 'physics', cards: [92, 93, 94], quizUrls: ['tier0'] }
};

/** Grouped by subject for the subjects overview */
export const SUBJECT_PATHS = {
  physics: ['P0', 'P0T1', 'P0T2', 'P1', 'P2', 'P3', 'P4', 'P5'],
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

/** Get total board count (all BBs, including unpathed) */
export function totalBoards() {
  return 234;
}
