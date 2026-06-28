/**
 * Strata — Paths Manifest (launch curriculum)
 * Subject → topic → ordered board numbers.
 *
 * Launch content is the audited set only: 67 reviewed boards, ingested into
 * Supabase as dynamic cards at sort_order 1000-1066 (see
 * scripts/ingest-final-review.mjs, source 1945_BBs/_PUBLISHABLE.md).
 * The old un-audited path map (P0-P33 / M1-M16 / C1-C5) and the temporary
 * "Final draft — review" topics were retired at launch finalization.
 */
export const PATHS = {
  // ── Physics ──
  PHY_UNITS: { subject: 'physics', name: 'Units & dimensions', icon: 'physics',
    cards: [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009], quizUrls: [] },
  PHY_SCALE: { subject: 'physics', name: 'Scale, estimation & errors', icon: 'physics',
    cards: [1010, 1011, 1012], quizUrls: [] },
  PHY_KIN: { subject: 'physics', name: 'Kinematics', icon: 'physics',
    cards: [1019, 1020, 1021, 1013, 1014], quizUrls: [] },
  PHY_FORCES: { subject: 'physics', name: "Forces & Newton's laws", icon: 'physics',
    cards: [1015, 1016, 1017, 1018, 1022, 1023, 1024, 1025, 1026, 1027], quizUrls: [] },

  // ── Mathematics ──
  MATH_COORD: { subject: 'maths', name: 'Coordinate geometry', icon: 'maths',
    cards: [1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1036, 1037, 1038, 1039, 1040, 1041], quizUrls: [] },

  // ── Chemistry ──
  CHEM_ATOMIC: { subject: 'chemistry', name: 'Atomic structure', icon: 'chemistry',
    cards: [1042, 1043, 1044, 1045, 1046, 1047, 1048, 1049, 1050], quizUrls: [] },
  CHEM_BONDING: { subject: 'chemistry', name: 'Chemical bonding', icon: 'chemistry',
    cards: [1051, 1052, 1053, 1064, 1054], quizUrls: [] },
  CHEM_MOLE: { subject: 'chemistry', name: 'Reactions & the mole', icon: 'chemistry',
    cards: [1055, 1056, 1057, 1058], quizUrls: [] },
  CHEM_ARCH: { subject: 'chemistry', name: 'Molecular architecture', icon: 'chemistry',
    cards: [1059, 1060, 1061, 1065, 1062, 1063, 1066], quizUrls: [] }
};

/** Grouped by subject for the subjects overview (display order). */
export const SUBJECT_PATHS = {
  physics: ['PHY_UNITS', 'PHY_SCALE', 'PHY_KIN', 'PHY_FORCES'],
  maths: ['MATH_COORD'],
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
