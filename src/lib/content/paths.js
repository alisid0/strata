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
  C3: { subject: 'chemistry', name: 'Chemical bonding', icon: 'chemistry', cards: [157, 158, 159, 160], quizUrls: ['tier0'] },

  C4: { subject: 'chemistry', name: 'Reactions & molecular architecture', icon: 'chemistry', cards: [235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249], quizUrls: ['tier0'] },
  C5: { subject: 'chemistry', name: 'Redox, electrochemistry & kinetics', icon: 'chemistry', cards: [281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295], quizUrls: ['tier0'] },
  P12: { subject: 'physics', name: 'Force & torque: rotational dynamics', icon: 'physics', cards: [250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265], quizUrls: ['tier0'] },
  P13: { subject: 'physics', name: 'Reflection & refraction', icon: 'physics', cards: [266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280], quizUrls: ['tier0'] },
  P14: { subject: 'physics', name: 'Thermodynamics', icon: 'physics', cards: [296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310], quizUrls: ['tier0'] },
  M10: { subject: 'maths', name: 'Problem-solving heuristics I', icon: 'maths', cards: [311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327], quizUrls: ['tier0'] },
  M11: { subject: 'maths', name: 'Problem-solving heuristics II', icon: 'maths', cards: [328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342, 343], quizUrls: ['tier0'] },
  M12: { subject: 'maths', name: 'Problem-solving: vectors & matrices', icon: 'maths', cards: [344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355], quizUrls: ['tier0'] },
  M13: { subject: 'maths', name: "Lockhart's algebra: foundations", icon: 'maths', cards: [356, 357, 358, 359, 360, 361, 362, 363, 364, 365], quizUrls: ['tier0'] },
  M14: { subject: 'maths', name: "Lockhart's algebra: symmetry & roots", icon: 'maths', cards: [366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376], quizUrls: ['tier0'] },

  P15: { subject: 'physics', name: 'Gravitation & orbits', icon: 'physics', cards: [377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392], quizUrls: ['tier0'] },
  P16: { subject: 'physics', name: 'Heat transfer: conduction, convection & radiation', icon: 'physics', cards: [393, 394, 395, 396, 397, 398, 399, 400, 401, 402, 403, 404, 405, 406, 407, 408], quizUrls: ['tier0'] },
  P17: { subject: 'physics', name: 'Magnetism & electromagnetic induction', icon: 'physics', cards: [409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433], quizUrls: ['tier0'] },

  M15: { subject: 'maths', name: 'Calculus: differentiation', icon: 'maths', cards: [434, 435, 436, 437, 438, 439, 440, 441, 442, 443, 444, 445, 446, 447, 448, 449], quizUrls: ['tier0'] },
  M16: { subject: 'maths', name: 'Calculus: integration', icon: 'maths', cards: [450, 451, 452, 453, 454, 455, 456, 457, 458, 459, 460, 461, 462, 463, 464, 465], quizUrls: ['tier0'] },
  P18: { subject: 'physics', name: 'Calculus in physics: differentiation applications', icon: 'physics', cards: [466, 467, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479, 480], quizUrls: ['tier0'] },
  P19: { subject: 'physics', name: 'Calculus in physics: integration applications', icon: 'physics', cards: [481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 495], quizUrls: ['tier0'] },

  P20: { subject: 'physics', name: 'Applied mechanics: machines, fluids & materials', icon: 'physics', cards: [575, 576, 577, 578, 579, 580, 581, 582, 583, 584, 585, 586, 587, 588, 589, 590], quizUrls: ['tier0'] },
  P21: { subject: 'physics', name: 'Oscillations & acoustics', icon: 'physics', cards: [591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 604, 605, 606], quizUrls: ['tier0'] },
  P22: { subject: 'physics', name: 'Applied electricity: batteries, AC & radio', icon: 'physics', cards: [607, 608, 609, 610, 611, 612, 613, 614, 615, 616, 617, 618, 619, 620, 621], quizUrls: ['tier0'] },
  P23: { subject: 'physics', name: 'Gyroscopes, magnetism & wave optics', icon: 'physics', cards: [622, 623, 624, 625, 626, 627, 628, 629, 630, 631, 632, 633, 634, 635, 636, 637], quizUrls: ['tier0'] },
  P24: { subject: 'physics', name: 'Newtonian mechanics', icon: 'physics', cards: [638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, 650, 651, 652, 653], quizUrls: ['tier0'] },
  P25: { subject: 'physics', name: 'Rotation, heat & thermodynamics', icon: 'physics', cards: [654, 655, 656, 657, 658, 659, 660, 661, 662, 663, 664, 665, 666, 667, 668, 669], quizUrls: ['tier0'] },
  P26: { subject: 'physics', name: 'Optics: light, lenses & instruments', icon: 'physics', cards: [670, 671, 672, 673, 674, 675, 676, 677, 678, 679, 680, 681, 682, 683, 684, 685], quizUrls: ['tier0'] },
  P27: { subject: 'physics', name: 'Engineering tools & electrical machines', icon: 'physics', cards: [686, 687, 688, 689, 690, 691, 692, 693, 694, 695, 696, 697], quizUrls: ['tier0'] },

  P28: { subject: 'physics', name: 'Forces & motion — the basics', icon: 'physics', cards: [698, 699, 700, 701, 702, 703, 704, 705, 706, 707, 708, 709, 710, 711, 712, 713], quizUrls: ['tier0'] },
  P29: { subject: 'physics', name: 'Energy — the basics', icon: 'physics', cards: [714, 715, 716, 717, 718, 719, 720, 721, 722, 723], quizUrls: ['tier0'] },
  P30: { subject: 'physics', name: 'Electricity — the basics', icon: 'physics', cards: [724, 725, 726, 727, 728, 729, 730, 731, 732, 733, 734, 735, 736, 737, 738], quizUrls: ['tier0'] },
  P31: { subject: 'physics', name: 'Waves & oscillations — the basics', icon: 'physics', cards: [739, 740, 741, 742, 743, 744, 745, 746, 747, 748, 749, 750, 751, 752, 753], quizUrls: ['tier0'] },
  P32: { subject: 'physics', name: 'Heat & matter — the basics', icon: 'physics', cards: [754, 755, 756, 757, 758, 759, 760, 761, 762, 763, 764, 765, 766, 767, 768], quizUrls: ['tier0'] },
  P33: { subject: 'physics', name: 'Optics — the basics', icon: 'physics', cards: [769, 770, 771, 772, 773, 774, 775, 776, 777, 778, 779, 780, 781, 782, 783], quizUrls: ['tier0'] },

  // Finalised publishable BBs, ingested as a self-contained review topic
  // (sort_order 800+, tagged reviewStatus:'final' → colour-coded green).
  // Rebuilt by: node --env-file=.env.local scripts/ingest-final-review.mjs
  PFINAL: { subject: 'physics', name: '★ Final draft — review', icon: 'physics', cards: [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020, 1021, 1022, 1023, 1024, 1025, 1026, 1027], quizUrls: [] },
  PFINAL_MATHS: { subject: 'maths', name: '★ Final draft — review (maths)', icon: 'maths', cards: [1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1036, 1037, 1038, 1039, 1040, 1041], quizUrls: [] },
  PFINAL_CHEM: { subject: 'chemistry', name: '★ Final draft — review (chemistry)', icon: 'chemistry', cards: [1042, 1043, 1044, 1045, 1046, 1047, 1048, 1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057], quizUrls: [] }
};

/** Grouped by subject for the subjects overview */
export const SUBJECT_PATHS = {
  physics: ['PFINAL', 'P0', 'P0T1', 'P0T2', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13', 'P14', 'P15', 'P16', 'P17', 'P18', 'P19', 'P20', 'P21', 'P22', 'P23', 'P24', 'P25', 'P26', 'P27', 'P28', 'P29', 'P30', 'P31', 'P32', 'P33'],
  maths: ['PFINAL_MATHS', 'M1', 'M2', 'M3', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12', 'M13', 'M14', 'M15', 'M16'],
  chemistry: ['PFINAL_CHEM', 'C1', 'C2', 'C3', 'C4', 'C5']
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
