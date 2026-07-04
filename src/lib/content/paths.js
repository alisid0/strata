/**
 * Strata — Paths Manifest (launch curriculum)
 * Subject → topic → ordered board numbers.
 *
 * Launch content is the audited set: 78 reviewed boards, ingested into
 * Supabase as dynamic cards at sort_order 1000-1077 (see
 * scripts/ingest-final-review.mjs, source 1945_BBs/_PUBLISHABLE.md).
 * Topic groupings need re-audit after 2026-06-28 ingest (3 new boards
 * appended: molecule, bond angles, DNA/proteins shifted numbering).
 */
export const PATHS = {
  // ── Physics ──
  PHY_UNITS: { subject: 'physics', name: 'Units & dimensions', icon: 'physics',
    cards: [1000,1001,1002,1003,1004,1005,1006,1007,1008,1009,1010,1011,1012], quizUrls: ['tier0'] },
  PHY_SCALE: { subject: 'physics', name: 'Scale, estimation & errors', icon: 'physics',
    cards: [1013,1014,1015,1016,1017,1018], quizUrls: [] },
  PHY_INTRO: { subject: 'physics', name: 'Foundations & frontiers', icon: 'physics',
    cards: [1019,1020,1021], quizUrls: [] },
  PHY_FORCES: { subject: 'physics', name: "Forces & Newton's laws", icon: 'physics',
    cards: [1022,1023,1024,1025,1026,1027,1028,1029,1030,1031,1032,1033,1034,1037], quizUrls: ['tier0'] },

  // ── The Line (starting point) ──
  LINE_001: { subject: 'maths', name: 'The Line', icon: 'maths',
    cards: [1078, 1079, 1080], quizUrls: [] },
  MATH_COORD: { subject: 'maths', name: 'Coordinate geometry', icon: 'maths',
    cards: [1035,1036,1038,1039,1040,1041,1042,1043,1044,1045,1046,1047,1048,1049,1050], quizUrls: ['tier0'] },

  // ── Chemistry ──
  CHEM_ATOMIC: { subject: 'chemistry', name: 'Atomic structure', icon: 'chemistry',
    cards: [1051,1052,1053,1054,1055,1056,1057,1058,1059,1060], quizUrls: ['tier0'] },
  CHEM_BONDING: { subject: 'chemistry', name: 'Chemical bonding', icon: 'chemistry',
    cards: [1061,1062,1063,1064,1065], quizUrls: ['tier0'] },
  CHEM_MOLE: { subject: 'chemistry', name: 'Reactions & the mole', icon: 'chemistry',
    cards: [1066,1067,1068,1069], quizUrls: ['tier0'] },
  CHEM_ARCH: { subject: 'chemistry', name: 'Molecular architecture', icon: 'chemistry',
    cards: [1070,1071,1072,1073,1074,1075,1076,1077], quizUrls: [] }
};

/** Grouped by subject for the subjects overview (display order). */
export const SUBJECT_PATHS = {
  physics: ['PHY_UNITS', 'PHY_SCALE', 'PHY_INTRO', 'PHY_FORCES'],
  maths: ['LINE_001', 'MATH_COORD'],
  chemistry: ['CHEM_ATOMIC', 'CHEM_BONDING', 'CHEM_MOLE', 'CHEM_ARCH']
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

/** Four starting-point gateways — each groups related topics into a learning path. */
export const PATH_GROUPS = {
  line: {
    name: 'The Line',
    subject: 'maths',
    paths: ['LINE_001', 'MATH_COORD'],
    firstTopic: 'LINE_001'
  },
  atom: {
    name: 'The Atom',
    subject: 'chemistry',
    paths: ['CHEM_ATOMIC', 'CHEM_BONDING', 'CHEM_MOLE', 'CHEM_ARCH'],
    firstTopic: 'CHEM_ATOMIC'
  },
  bit: {
    name: 'The Bit',
    subject: null,
    paths: [],
    firstTopic: null
  },
  unit: {
    name: 'The Unit',
    subject: 'physics',
    paths: ['PHY_UNITS', 'PHY_SCALE'],
    firstTopic: 'PHY_UNITS'
  }
};

/** Get paths that contain a given board number */
export function pathsForCard(cardNumber) {
  const ids = [];
  for (const id in PATHS) {
    if (PATHS[id].cards.includes(cardNumber)) ids.push(id);
  }
  return ids;
}

/** Total number of distinct boards in the launch curriculum (derived, not hardcoded). */
export function totalBoards() {
  const set = new Set();
  for (const id in PATHS) for (const n of PATHS[id].cards) set.add(n);
  return set.size;
}
