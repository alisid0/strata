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
    cards: [148, 149, 150, ...Array.from({ length: 70 - 38 + 1 }, (_, i) => 38 + i)],
    quizUrls: ['QUIZ-TIER0.html', 'QUIZ-TIER1.html']
  },
  C1: { subject: 'chemistry', name: 'Into the atom', icon: 'chemistry', cards: [33, 34, 35, 36, 37], quizUrls: [] },
  P4: { subject: 'physics', name: 'Measurement & dimensions', icon: 'physics', cards: [85, 86, 87, 88, 89, 90, 91], quizUrls: ['tier0'] },
  P5: { subject: 'physics', name: 'Vector products', icon: 'physics', cards: [92, 93, 94], quizUrls: ['tier0'] },

  M2: { subject: 'maths', name: 'Calculus: turning points & area', icon: 'maths', cards: [105, 106], quizUrls: ['tier0'] },
  M5: { subject: 'maths', name: 'Arithmetic foundations', icon: 'maths', cards: [161, 162, 163, 164, 165], quizUrls: ['tier0'] },
  M6: { subject: 'maths', name: 'Algebra foundations', icon: 'maths', cards: [166, 167, 168, 169, 170, 171, 172, 173], quizUrls: ['tier0'] },
  M7: { subject: 'maths', name: 'Matrices', icon: 'maths', cards: [135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147], quizUrls: ['tier0'] },
  M8: { subject: 'maths', name: 'Exponents & logarithms', icon: 'maths', cards: [174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188], quizUrls: ['tier0'] },
  M9: { subject: 'maths', name: 'Trigonometry', icon: 'maths', cards: [202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217], quizUrls: ['tier0'] },

  P6: { subject: 'physics', name: 'Measurement, errors & relative motion', icon: 'physics', cards: [107, 108, 109], quizUrls: ['tier0'] },
  P7: { subject: 'physics', name: "Newton's laws & forces", icon: 'physics', cards: [110, 111, 112, 113, 114, 115, 116, 117, 118, 119], quizUrls: ['tier0'] },
  P8: { subject: 'physics', name: 'Friction & circular motion', icon: 'physics', cards: [120, 121, 122, 123, 124, 125, 126], quizUrls: ['tier0'] },
  P9: { subject: 'physics', name: 'Work, energy & momentum', icon: 'physics', cards: [127, 128, 129, 130, 131, 132, 133, 134], quizUrls: ['tier0'] },
  P10: { subject: 'physics', name: 'Vectors', icon: 'physics', cards: [189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201], quizUrls: ['tier0'] },
  P11: { subject: 'physics', name: 'Electricity & circuits', icon: 'physics', cards: [218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234], quizUrls: ['tier0'] },

  C2: { subject: 'chemistry', name: 'Atomic structure', icon: 'chemistry', cards: [151, 152, 153, 154, 155, 156], quizUrls: ['tier0'] },
  C3: { subject: 'chemistry', name: 'Chemical bonding', icon: 'chemistry', cards: [157, 158, 159, 160], quizUrls: ['tier0'] }
};

/** Grouped by subject for the subjects overview */
export const SUBJECT_PATHS = {
  physics: ['P0', 'P0T1', 'P0T2', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11'],
  maths: ['M1', 'M2', 'M3', 'M5', 'M6', 'M7', 'M8', 'M9'],
  chemistry: ['C1', 'C2', 'C3']
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
