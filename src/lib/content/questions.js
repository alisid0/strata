/**
 * Strata — All quiz question definitions
 * Supports 5 types: mcq, truefalse, fillblank, match, typeanswer
 * Each question has a generate() function for randomized values.
 */

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/**
 * Question type: Multiple Choice
 */
export function mcq(generator) {
  return { type: 'mcq', generate: generator };
}

/**
 * Question type: True / False
 */
export function truefalse(generator) {
  return { type: 'truefalse', generate: generator };
}

/**
 * Question type: Fill in the blank
 * The question text should use ___ for the blank.
 */
export function fillblank(generator) {
  return { type: 'fillblank', generate: generator };
}

/**
 * Question type: Match the following
 * Returns pairs of items to match.
 */
export function matchQuestion(generator) {
  return { type: 'match', generate: generator };
}

/**
 * Question type: Type the answer
 * Numeric or short text answer.
 */
export function typeanswer(generator) {
  return { type: 'typeanswer', generate: generator };
}

// ═══════════════════════════════════════════════════════════════
// QUESTION DEFINITIONS by path
// ═══════════════════════════════════════════════════════════════

export const PATH_QUESTIONS = {
  // ── M3 : Coordinate Geometry, Tier 0 ──
  M3: [
    // MCQ
    mcq(() => ({
      cg: 'CG1',
      q: 'Which statement is true about a number line?',
      opts: [
        'It only contains whole numbers',
        'Every point on it corresponds to exactly one real number',
        'It only goes in one direction',
        'It starts at 1'
      ],
      answer: 1,
      explain: 'A number line matches every point to exactly one real number, in order, extending infinitely both ways.'
    })),

    // True / False
    truefalse(() => ({
      cg: 'CG2',
      q: 'Zero on the number line is an optional marker — you could shift the whole line left or right and it would still work the same way.',
      answer: false,
      explain: 'Zero is the fixed reference point all distances and signs are measured from. Shifting it would change every number\'s meaning.'
    })),

    // Fill in the blank
    fillblank(() => ({
      cg: 'CG3',
      q: 'The sign in front of a number tells you which ___ from zero you\'re standing.',
      answer: 'direction',
      accept: ['direction', 'way', 'side'],
      explain: 'Positive means right of zero, negative means left — the sign is directional, not about size.'
    })),

    // Type answer (numeric)
    typeanswer(() => {
      const a = randInt(-5, 10), span = randInt(3, 12), b = a + span;
      return {
        cg: 'CG6',
        q: `What is the distance between ${a} and ${b} on the number line?`,
        answer: span,
        tolerance: 0,
        explain: `Distance = |a − b| = |${a} − ${b}| = ${span}.`
      };
    }),

    // Match the following
    matchQuestion(() => ({
      cg: 'CG14',
      q: 'Match each sign combination to its quadrant.',
      pairs: [
        ['(+, +)', 'Quadrant I'],
        ['(−, +)', 'Quadrant II'],
        ['(−, −)', 'Quadrant III'],
        ['(+, −)', 'Quadrant IV']
      ],
      explain: 'Quadrants go anticlockwise from top-right: I (+,+), II (−,+), III (−,−), IV (+,−).'
    })),

    // More MCQ
    mcq(() => {
      const a = randInt(-6, 6), b = a + 1;
      return {
        cg: 'CG4',
        q: `How many numbers exist strictly between ${a} and ${b} on the number line?`,
        opts: ['0', 'Exactly 1', '10', 'Infinitely many'],
        answer: 3,
        explain: 'However finely you slice the gap between any two numbers, there\'s always another number living there.'
      };
    }),

    typeanswer(() => {
      const a = randInt(-10, 10), b = a + randInt(2, 16);
      const mid = (a + b) / 2;
      return {
        cg: 'CG7',
        q: `What is the midpoint of ${a} and ${b}?`,
        answer: mid,
        tolerance: 0.001,
        explain: `Midpoint = (${a} + ${b}) / 2 = ${mid}.`
      };
    }),

    mcq(() => ({
      cg: 'CG9',
      q: 'Which axis is conventionally the horizontal, "input" axis?',
      opts: ['The y-axis', 'The x-axis'],
      answer: 1,
      explain: 'x is horizontal and conventionally the input — you choose x first, then y comes out, as in y = f(x).'
    })),

    mcq(() => ({
      cg: 'CG10',
      q: 'What are the coordinates of the origin?',
      opts: ['(1, 1)', '(0, 0)', '(x, y)', 'It has no fixed coordinates'],
      answer: 1,
      explain: 'The origin is where both axes\' zeros line up — (0, 0).'
    })),

    fillblank(() => ({
      cg: 'CG11',
      q: 'To plot the point (3, 4), you first move ___ units along the x-axis, then 4 units up.',
      answer: '3',
      accept: ['3', 'three'],
      explain: 'The first number in an ordered pair is always the horizontal move along x, done first.'
    })),

    typeanswer(() => {
      const triples = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17]];
      const t = pick(triples);
      const ox = randInt(-5, 5), oy = randInt(-5, 5);
      return {
        cg: 'CG15',
        q: `What is the distance between (${ox},${oy}) and (${ox + t[0]},${oy + t[1]})?`,
        answer: t[2],
        tolerance: 0.001,
        explain: `distance² = ${t[0]}² + ${t[1]}² = ${t[0] * t[0]} + ${t[1] * t[1]} = ${t[2] * t[2]}, so distance = ${t[2]}.`
      };
    }),

    // ── Tier 1 questions ──
    mcq(() => ({
      cg: 'CG18',
      q: 'A line passes through Quadrant I, cuts into II, and reaches III — never touching IV. Its steepness is:',
      opts: ['Positive', 'Negative', 'Zero', 'Undefined'],
      answer: 0,
      explain: 'To sweep through I, II, and III without ever touching IV, x and y must increase together — that\'s positive steepness.'
    })),

    typeanswer(() => {
      const x1 = randInt(0, 5), y1 = randInt(0, 5);
      const x2 = x1 + randInt(1, 6), y2 = y1 + randInt(1, 8);
      return {
        cg: 'CG19',
        q: `Between points (${x1}, ${y1}) and (${x2}, ${y2}), what is Δy (the vertical change)?`,
        answer: y2 - y1,
        tolerance: 0,
        explain: `Δy = y₂ − y₁ = ${y2} − ${y1} = ${y2 - y1}.`
      };
    }),

    typeanswer(() => {
      const dx = randInt(1, 5);
      let m = randInt(-4, 4); if (m === 0) m = 2;
      const dy = m * dx;
      const x1 = randInt(-5, 5), y1 = randInt(-5, 5);
      const x2 = x1 + dx, y2 = y1 + dy;
      return {
        cg: 'CG20',
        q: `Using points (${x1}, ${y1}) and (${x2}, ${y2}), what is the gradient (slope)?`,
        answer: m,
        tolerance: 0.001,
        explain: `m = Δy/Δx = (${y2}−${y1}) / (${x2}−${x1}) = ${dy} / ${dx} = ${m}.`
      };
    }),

    truefalse(() => ({
      cg: 'CG22',
      q: 'A perfectly horizontal line has an undefined gradient.',
      answer: false,
      explain: 'A horizontal line has Δy = 0, so its gradient is 0 — not undefined. A vertical line has undefined gradient because Δx = 0.'
    })),

    fillblank(() => ({
      cg: 'CG24',
      q: 'In the equation y = mx + c, the letter ___ controls the lean (steepness) of the line.',
      answer: 'm',
      accept: ['m', 'M'],
      explain: 'm is the gradient (slope) — it controls how steep the line is. c controls where it crosses the y-axis.'
    })),
  ],

  // ── P0 : Mechanics — foundations (BB 01-07, Tier 0) ──
  P0: [
    mcq(() => ({
      cg: 'P0-1',
      q: 'Which of the following best describes what physics studies?',
      opts: [
        'Only the motion of planets',
        'Matter, motion, force, and energy, and how they interact over time',
        'Only forces, not energy',
        'Only energy, not matter'
      ],
      answer: 1,
      explain: 'Physics covers matter, motion, force, and energy together, and how they interact over time, not just one of these in isolation.'
    })),

    mcq(() => ({
      cg: 'P0-2',
      q: 'Which statement correctly distinguishes matter from mass?',
      opts: [
        'They are the same thing, just different words',
        'Matter is anything that occupies space and has mass; mass measures how much that object resists a change in motion',
        'Mass is the substance itself; matter is just its weight',
        'Matter only refers to solids'
      ],
      answer: 1,
      explain: 'Matter is the substance itself, anything occupying space and having mass. Mass is the specific property measuring an object\'s resistance to a change in motion.'
    })),

    truefalse(() => ({
      cg: 'P0-3',
      q: 'An object\'s weight changes depending on its location, but its mass does not.',
      answer: true,
      explain: 'Weight depends on the strength of the local gravitational pull. Mass measures resistance to a change in motion, which does not depend on location.'
    })),

    mcq(() => ({
      cg: 'P0-4',
      q: 'An object sliding on a frictionless surface, with no other forces acting on it, will:',
      opts: [
        'Gradually slow down',
        'Speed up over time',
        'Continue at constant velocity indefinitely',
        'Stop immediately'
      ],
      answer: 2,
      explain: 'Newton\'s first law: without a net force, an object in motion continues in a straight line at constant speed indefinitely.'
    })),

    mcq(() => ({
      cg: 'P0-5',
      q: 'Why does a hockey puck travel farther on ice than on concrete, given the same push?',
      opts: [
        'Ice is colder, which changes the puck\'s mass',
        'Concrete has more microscopic irregularities that catch against the puck, producing more friction',
        'The puck is heavier on concrete',
        'Friction does not exist on ice'
      ],
      answer: 1,
      explain: 'Friction arises from microscopic irregularities in two surfaces catching against each other. Concrete has far more of these than smooth ice, so it produces more friction and stops the puck sooner.'
    })),

    typeanswer(() => {
      const f = randInt(10, 60), m = randInt(2, 12);
      return {
        cg: 'P0-6',
        q: `A force of ${f}N acts on an object of mass ${m}kg. What is its acceleration, in m/s²? (F = ma)`,
        answer: Number((f / m).toFixed(2)),
        tolerance: 0.01,
        explain: `a = F/m = ${f}/${m} = ${(f / m).toFixed(2)} m/s².`
      };
    }),

    truefalse(() => ({
      cg: 'P0-7',
      q: 'Two cars travelling at 50 mph in opposite directions have the same velocity.',
      answer: false,
      explain: 'They have the same speed, but opposite velocities, since velocity includes direction and the two cars are heading different ways.'
    })),

    mcq(() => ({
      cg: 'P0-8',
      q: 'A car\'s speed is decreasing while it travels in a straight line. What does this say about its acceleration?',
      opts: [
        'Its acceleration is zero',
        'Its acceleration is positive, in the direction of travel',
        'Its acceleration is negative, opposite the direction of travel',
        'Acceleration only applies when speed increases'
      ],
      answer: 2,
      explain: 'A decrease in speed is still a change in velocity, so the object is still accelerating, just with a negative acceleration, opposite to its direction of travel.'
    })),

    fillblank(() => ({
      cg: 'P0-9',
      q: 'When a swimmer pushes backward against the water, the water pushes the swimmer ___ with equal force.',
      answer: 'forward',
      accept: ['forward', 'forwards'],
      explain: 'This is Newton\'s third law: every force has an equal and opposite reaction. The swimmer pushes the water backward; the water pushes the swimmer forward.'
    })),

    matchQuestion(() => ({
      cg: 'P0-10',
      q: 'Match each concept to its core idea.',
      pairs: [
        ['Inertia', 'An object resists a change in its motion'],
        ['Friction', 'Resistance between two sliding surfaces'],
        ['Newton\'s third law', 'Every force has an equal and opposite reaction'],
        ['Mass', 'Resistance to a change in an object\'s motion, independent of location']
      ],
      explain: 'Inertia, friction, mass, and Newton\'s third law are the core mechanisms behind BB 01-07.'
    })),
  ],

  // ── P0T1 : Mechanics — mathematical formulation (BB 71-77, Tier 1) ──
  P0T1: [
    mcq(() => ({
      cg: 'P0T1-1',
      q: 'A physical law expressed as an equation, such as F = ma, specifies:',
      opts: [
        'A rough description of a trend',
        'An exact relationship between measurable quantities, for any values substituted in',
        'A relationship that only holds for the specific numbers used to derive it',
        'A statement that cannot be tested'
      ],
      answer: 1,
      explain: 'An equation like F = ma holds for any valid values of force, mass, and acceleration, not just the example used to introduce it.'
    })),

    typeanswer(() => {
      const m = randInt(2, 20);
      const w = Number((m * 9.8).toFixed(1));
      return {
        cg: 'P0T1-2',
        q: `Using W = mg (g = 9.8 m/s²), what is the weight, in newtons, of a ${m} kg object?`,
        answer: w,
        tolerance: 0.5,
        explain: `W = mg = ${m} × 9.8 = ${w} N.`
      };
    }),

    truefalse(() => ({
      cg: 'P0T1-3',
      q: 'An object\'s weight is the same on Earth and on the Moon, because weight only depends on mass.',
      answer: false,
      explain: 'Weight is W = mg, so it depends on the local gravitational acceleration g as well as mass. g is smaller on the Moon, so the same object weighs less there.'
    })),

    mcq(() => ({
      cg: 'P0T1-4',
      q: 'A box on a table remains at rest. What does this imply about the net force acting on it?',
      opts: [
        'It must be zero',
        'It must equal the box\'s weight, ignoring the normal force',
        'There is no force at all acting on it',
        'The normal force must be greater than the weight'
      ],
      answer: 0,
      explain: '"At rest" means constant velocity (zero), which per ΣF = 0 ⇒ v = constant requires the net force to be zero, even though individual forces like gravity and the normal force are both nonzero.'
    })),

    typeanswer(() => {
      const m = randInt(5, 30);
      const mu = pick([0.2, 0.3, 0.4, 0.5]);
      const N = m * 9.8;
      const f = Number((mu * N).toFixed(1));
      return {
        cg: 'P0T1-5',
        q: `An object of mass ${m} kg rests on a surface with coefficient of friction μ = ${mu} (g = 9.8 m/s²). Using F = μN, what is the friction force, in newtons?`,
        answer: f,
        tolerance: 1,
        explain: `N = mg = ${m} × 9.8 = ${(m * 9.8).toFixed(1)} N. F = μN = ${mu} × ${(m * 9.8).toFixed(1)} = ${f} N.`
      };
    }),

    fillblank(() => ({
      cg: 'P0T1-6',
      q: 'In F = m·a, rearranged to solve for mass, the equation becomes m = ___.',
      answer: 'F/a',
      accept: ['F/a', 'F / a'],
      explain: 'Dividing both sides of F = ma by a isolates mass: m = F/a.'
    })),

    typeanswer(() => {
      const x1 = randInt(0, 20), dx = randInt(20, 100), t = randInt(2, 10);
      const v = Number((dx / t).toFixed(2));
      return {
        cg: 'P0T1-7',
        q: `An object moves from position ${x1} m to position ${x1 + dx} m in ${t} seconds. What is its average velocity, in m/s? (v = Δx/Δt)`,
        answer: v,
        tolerance: 0.05,
        explain: `v = Δx/Δt = ${dx} / ${t} = ${v} m/s.`
      };
    }),

    mcq(() => ({
      cg: 'P0T1-8',
      q: 'F₁₂ = −F₂₁ means:',
      opts: [
        'The two forces have different magnitudes',
        'The two forces are equal in magnitude and opposite in direction',
        'Only object 1 exerts a force',
        'The forces cancel and nothing moves'
      ],
      answer: 1,
      explain: 'The minus sign indicates opposite direction; the magnitudes on both sides of the equation are equal. Whether anything moves depends on the masses involved, not on the forces being unequal.'
    })),
  ],

  // ── P0T2 : Mechanics — numericals (BB 78-84, Tier 2) ──
  P0T2: [
    typeanswer(() => {
      const m = randInt(5, 40);
      const w = Number((m * 9.8).toFixed(1));
      return {
        cg: 'P0T2-1',
        q: `A ${m} kg object's weight near Earth's surface, in newtons (g = 9.8 m/s²), is:`,
        answer: w,
        tolerance: 0.5,
        explain: `W = mg = ${m} × 9.8 = ${w} N.`
      };
    }),

    typeanswer(() => {
      const m = randInt(5, 30);
      const mu = pick([0.2, 0.3, 0.4, 0.5]);
      const N = m * 9.8;
      const f = Number((mu * N).toFixed(1));
      return {
        cg: 'P0T2-2',
        q: `A ${m} kg crate sits on a surface with coefficient of friction μ = ${mu}. What is the maximum friction force resisting sliding, in newtons? (F = μN, N = mg, g = 9.8 m/s²)`,
        answer: f,
        tolerance: 1,
        explain: `N = mg = ${m} × 9.8 = ${N.toFixed(1)} N. F = μN = ${mu} × ${N.toFixed(1)} = ${f} N.`
      };
    }),

    typeanswer(() => {
      const f = randInt(100, 500), m = randInt(20, 100);
      const a = Number((f / m).toFixed(2));
      return {
        cg: 'P0T2-3',
        q: `An engine produces a force of ${f}N on a ${m}kg car. What is its acceleration, in m/s²? (F = ma)`,
        answer: a,
        tolerance: 0.02,
        explain: `a = F/m = ${f}/${m} = ${a} m/s².`
      };
    }),

    typeanswer(() => {
      const x1 = randInt(0, 30), dx = randInt(30, 150), t = randInt(3, 15);
      const v = Number((dx / t).toFixed(2));
      return {
        cg: 'P0T2-4',
        q: `A cyclist travels from position ${x1} m to position ${x1 + dx} m in ${t} seconds. What is their average velocity, in m/s? (v = Δx/Δt)`,
        answer: v,
        tolerance: 0.05,
        explain: `v = Δx/Δt = ${dx} / ${t} = ${v} m/s.`
      };
    }),

    typeanswer(() => {
      const v1 = randInt(1, 10), v2 = v1 + randInt(2, 10), t = randInt(2, 8);
      const a = Number(((v2 - v1) / t).toFixed(2));
      return {
        cg: 'P0T2-5',
        q: `A car's velocity increases from ${v1} m/s to ${v2} m/s over ${t} seconds. What is its acceleration, in m/s²? (a = Δv/Δt)`,
        answer: a,
        tolerance: 0.02,
        explain: `a = Δv/Δt = (${v2} − ${v1}) / ${t} = ${a} m/s².`
      };
    }),

    mcq(() => ({
      cg: 'P0T2-6',
      q: 'Two skaters push off each other with equal and opposite forces. The skater with the smaller mass will have:',
      opts: [
        'A smaller acceleration',
        'The same acceleration as the other skater',
        'A larger acceleration',
        'No acceleration at all'
      ],
      answer: 2,
      explain: 'Since a = F/m and the force is the same for both skaters, the smaller mass produces the larger acceleration.'
    })),

    typeanswer(() => {
      const m = randInt(10, 50);
      const mu = pick([0.1, 0.2, 0.3]);
      const friction = Number((mu * m * 9.8).toFixed(1));
      const applied = friction + randInt(40, 120);
      const a = Number(((applied - friction) / m).toFixed(2));
      return {
        cg: 'P0T2-7',
        q: `A ${m}kg crate has friction with μ = ${mu} (g = 9.8 m/s²) while a horizontal force of ${applied}N pushes it. What is the crate's acceleration, in m/s²? (net force = applied force − friction force; a = net force / mass)`,
        answer: a,
        tolerance: 0.05,
        explain: `Friction = μmg = ${mu} × ${m} × 9.8 = ${friction} N. Net force = ${applied} − ${friction} = ${(applied - friction).toFixed(1)} N. a = net force / mass = ${(applied - friction).toFixed(1)} / ${m} = ${a} m/s².`
      };
    }),
  ],

  // ── P1 : Forces & motion ──
  P1: [
    mcq(() => ({
      cg: 'P1-1',
      q: 'According to Newton\'s first law, what happens to a moving object if no force acts on it?',
      opts: [
        'It gradually slows down and stops',
        'It keeps moving in a straight line at constant speed',
        'It speeds up',
        'It falls to the ground'
      ],
      answer: 1,
      explain: 'Newton\'s first law says a moving object keeps moving in a straight line at constant speed unless a force acts on it.'
    })),

    truefalse(() => ({
      cg: 'P1-2',
      q: 'Friction only occurs between rough surfaces — smooth surfaces have no friction at all.',
      answer: false,
      explain: 'Even very smooth surfaces have some friction. The smoother the surfaces, the less friction — but it never disappears completely.'
    })),

    typeanswer(() => {
      const f = randInt(10, 50), m = randInt(2, 10);
      return {
        cg: 'P1-3',
        q: `A force of ${f}N is applied to a ${m}kg object. What is its acceleration? (F = ma)`,
        answer: f / m,
        tolerance: 0.01,
        explain: `a = F/m = ${f}/${m} = ${(f / m).toFixed(2)} m/s².`
      };
    }),

    fillblank(() => ({
      cg: 'P1-4',
      q: 'The force that opposes motion between two surfaces in contact is called ___.',
      answer: 'friction',
      accept: ['friction', 'Friction'],
      explain: 'Friction is the force that resists motion when two surfaces slide against each other.'
    })),
  ],

  // ── C1 : Into the atom ──
  C1: [
    mcq(() => ({
      cg: 'C1-1',
      q: 'How many naturally occurring elements are there?',
      opts: ['37', '92', '118', 'Over 200'],
      answer: 2,
      explain: 'There are 118 known elements. 92 occur naturally on Earth; the rest are man-made in laboratories.'
    })),

    truefalse(() => ({
      cg: 'C1-2',
      q: 'The word "atom" comes from the Greek word "atomos", meaning "uncuttable".',
      answer: true,
      explain: 'Greek philosophers coined "atomos" to describe the smallest possible piece of matter — something that can\'t be divided further.'
    })),

    fillblank(() => ({
      cg: 'C1-3',
      q: 'The atomic number (Z) equals the number of ___ in the nucleus.',
      answer: 'protons',
      accept: ['protons', 'proton'],
      explain: 'The atomic number is the count of protons in the nucleus — change it and you change the element itself.'
    })),

    matchQuestion(() => ({
      cg: 'C1-4',
      q: 'Match each subatomic particle to its charge.',
      pairs: [
        ['Proton', 'Positive (+)'],
        ['Neutron', 'No charge (0)'],
        ['Electron', 'Negative (−)']
      ],
      explain: 'Protons are positive, electrons are negative, and neutrons have no charge.'
    })),
  ],

  // ── P2 : Energy ──
  P2: [
    mcq(() => ({
      cg: 'P2-1',
      q: 'What is the formal definition of energy?',
      opts: [
        'The speed of an object',
        'The capacity to do work',
        'The mass of an object',
        'The temperature of a substance'
      ],
      answer: 1,
      explain: 'Energy is formally defined as the capacity to do work — a force moving something over a distance.'
    })),

    truefalse(() => ({
      cg: 'P2-2',
      q: 'Energy can be created from nothing as long as it is used immediately.',
      answer: false,
      explain: 'Energy cannot be created or destroyed. The total amount of energy in a closed system always stays the same.'
    })),

    fillblank(() => ({
      cg: 'P2-3',
      q: 'Energy is measured in ___.',
      answer: 'joules',
      accept: ['joules', 'Joules', 'joule', 'J'],
      explain: 'The joule (J) is the standard unit of energy.'
    })),

    mcq(() => ({
      cg: 'P2-4',
      q: 'A boulder at the top of a hill has what kind of energy?',
      opts: ['Kinetic energy', 'Potential energy', 'Thermal energy', 'Electrical energy'],
      answer: 1,
      explain: 'A boulder at the top of a hill has gravitational potential energy — stored energy, waiting to be released.'
    })),

    typeanswer(() => ({
      cg: 'P2-5',
      q: 'If a 2kg object is lifted 5 metres, how much gravitational potential energy does it gain? (g = 10 m/s², E = mgh)',
      answer: 100,
      tolerance: 0.5,
      explain: 'E = m × g × h = 2 × 10 × 5 = 100 joules.'
    }))
  ],

  // ── P3 : Gravity ──
  P3: [
    mcq(() => ({
      cg: 'P3-1',
      q: 'Which statement about gravity is true?',
      opts: [
        'Gravity only exists between large objects like planets',
        'Every two objects in the universe pull on each other',
        'Gravity can both attract and repel',
        'Gravity is a type of magnetism'
      ],
      answer: 1,
      explain: 'Every two objects in the universe pull on each other through gravity — you, your phone, the Earth, everything.'
    })),

    truefalse(() => ({
      cg: 'P3-2',
      q: 'The Moon is constantly falling toward the Earth, but keeps missing it.',
      answer: true,
      explain: 'The Moon is indeed falling toward Earth due to gravity, but its sideways speed means it keeps "missing" — that\'s what an orbit is.'
    })),

    fillblank(() => ({
      cg: 'P3-3',
      q: 'The force of gravity between two objects depends on their ___ and the distance between them.',
      answer: 'mass',
      accept: ['mass', 'masses', 'Mass'],
      explain: 'Gravity depends on the masses of the two objects (more mass = stronger pull) and the distance between them (farther apart = weaker pull).'
    })),

    typeanswer(() => {
      const d = pick([2, 3, 4]);
      const strength = 1 / (d * d);
      return {
        cg: 'P3-4',
        q: `If you double the distance between two objects, gravity drops to 1/4. If you triple it, gravity drops to 1/9. If you make it ${d} times farther, what fraction is gravity?`,
        answer: 1 / (d * d),
        tolerance: 0.001,
        explain: `Gravity follows an inverse square law: ${d}× farther = 1/${d * d} the strength.`
      };
    })
  ],

  // ── M1 : Getting infinitely close (calculus) ──
  M1: [
    mcq(() => ({
      cg: 'M1-1',
      q: 'What is a limit?',
      opts: [
        'A barrier that cannot be crossed',
        'A value that a number creeps closer to but never quite reaches',
        'The exact answer to any maths problem',
        'A type of equation'
      ],
      answer: 1,
      explain: 'A limit is a value that a number or sequence creeps closer and closer to, without necessarily ever landing on it exactly.'
    })),

    mcq(() => ({
      cg: 'M1-2',
      q: 'What is 1 ÷ 0?',
      opts: ['Infinity', 'Zero', 'One', 'Undefined'],
      answer: 3,
      explain: '1 ÷ 0 is undefined, not infinity. Maths simply breaks — you can never divide by zero.'
    })),

    truefalse(() => ({
      cg: 'M1-3',
      q: 'The area of a circle can be found by filling it with polygons with more and more sides, and observing where the area heads.',
      answer: true,
      explain: 'This is the classic limit approach: draw a polygon inside the circle, increase its sides toward infinity, and the polygon\'s area approaches the circle\'s true area.'
    })),

    fillblank(() => ({
      cg: 'M1-4',
      q: 'Newton and ___ independently developed calculus at around the same time.',
      answer: 'Leibniz',
      accept: ['Leibniz', 'leibniz', 'Gottfried Leibniz', 'G. Leibniz'],
      explain: 'Isaac Newton and Gottfried Leibniz independently invented calculus in the late 1600s.'
    })),

    mcq(() => ({
      cg: 'M1-5',
      q: 'A function is best described as:',
      opts: [
        'A difficult equation to solve',
        'A machine that maps each input to exactly one output',
        'A type of graph',
        'A number that never changes'
      ],
      answer: 1,
      explain: 'A function is a machine: feed it an input (x), and it reliably produces one output (f(x)). Like a vending machine.'
    })),

    typeanswer(() => ({
      cg: 'M1-6',
      q: 'If f(x) = 2x + 3, what is f(5)?',
      answer: 13,
      tolerance: 0,
      explain: 'f(5) = 2(5) + 3 = 10 + 3 = 13.'
    }))
  ],

  // ── P4 : Measurement & dimensions ──
  P4: [
    mcq(() => ({
      cg: 'P4-1',
      q: 'Why does a measurement need a unit attached to its number?',
      opts: [
        'It doesn\'t — the number alone is enough',
        'Because the number is only meaningful as a ratio to an agreed reference quantity',
        'Units are just a tradition with no real purpose',
        'Only large quantities need units'
      ],
      answer: 1,
      explain: 'A measurement is a numerical value times a unit. The number is the ratio of the measured quantity to a fixed, agreed reference — without that reference, the number means nothing.'
    })),

    truefalse(() => ({
      cg: 'P4-2',
      q: 'There are exactly seven fundamental (base) quantities, and every other quantity is derived from them.',
      answer: true,
      explain: 'Length, mass, time, electric current, temperature, amount of substance, and luminous intensity are the seven base quantities. Everything else — area, speed, force, energy — is built from these by multiplication and division.'
    })),

    fillblank(() => ({
      cg: 'P4-3',
      q: 'The SI base unit for mass is the ___.',
      answer: 'kilogram',
      accept: ['kilogram', 'Kilogram', 'kg'],
      explain: 'The kilogram (kg) is the SI base unit for mass, one of the seven fundamental units.'
    })),

    mcq(() => ({
      cg: 'P4-4',
      q: 'What is the dimensional formula of force?',
      opts: ['MLT⁻¹', 'MLT⁻²', 'ML²T⁻²', 'MLT'],
      answer: 1,
      explain: 'Force = mass × acceleration = mass × length/time² → MLT⁻². The exponent on mass is 1, on length is 1, and on time is −2.'
    })),

    mcq(() => ({
      cg: 'P4-5',
      q: 'A student writes F = mv (force equals mass times velocity). What does dimensional analysis reveal?',
      opts: [
        'The equation is correct',
        'The equation is dimensionally inconsistent — [F] = MLT⁻² but [mv] = MLT⁻¹',
        'It cannot be checked without doing the arithmetic',
        'The equation is correct only for large masses'
      ],
      answer: 1,
      explain: 'Force has dimensions MLT⁻², but mass × velocity has dimensions MLT⁻¹. They don\'t match, so the equation is dimensionally impossible — the homogeneity principle catches this without any calculation.'
    })),

    typeanswer(() => {
      const a = pick([1, 2, 3, 7, 8]), b = pick([4, 5, 6]);
      const order = a >= 5 ? b + 1 : b;
      return {
        cg: 'P4-6',
        q: `A quantity has the value ${a} × 10^${b}. What is its order of magnitude, as the exponent of ten? (round up if the leading digit is 5 or more)`,
        answer: order,
        tolerance: 0,
        explain: a >= 5
          ? `Since the leading digit (${a}) is 5 or more, it rounds up: the order of magnitude is 10^${order}.`
          : `Since the leading digit (${a}) is below 5, it stays as is: the order of magnitude is 10^${order}.`
      };
    }),

    matchQuestion(() => ({
      cg: 'P4-7',
      q: 'Match each object to its approximate scale.',
      pairs: [
        ['Atom', '10⁻¹⁰ m'],
        ['Proton', '10⁻¹⁵ m'],
        ['Human', '1 m'],
        ['Milky Way', '10²¹ m']
      ],
      explain: 'Reality is arranged in roughly logarithmic steps — atoms at 10⁻¹⁰ m, protons at 10⁻¹⁵ m, humans at about 1 m, and the Milky Way at roughly 10²¹ m.'
    }))
  ],

  // ── P5 : Vector products ──
  P5: [
    mcq(() => ({
      cg: 'P5-1',
      q: 'How do you add two vectors using the triangle rule?',
      opts: [
        'Add their magnitudes directly, regardless of direction',
        'Place the tail of the second vector at the head of the first; the sum runs from the start of the first to the tip of the second',
        'Multiply their magnitudes and add the angles',
        'Subtract the smaller magnitude from the larger one'
      ],
      answer: 1,
      explain: 'The triangle rule: draw the first vector, then draw the second starting from the tip of the first. The vector from the very start to the very end is the sum.'
    })),

    truefalse(() => ({
      cg: 'P5-2',
      q: 'The dot product of two perpendicular vectors is always zero.',
      answer: true,
      explain: 'a⃗ · b⃗ = |a||b| cos θ. At 90°, cos 90° = 0, so the dot product vanishes — none of one vector lies along the direction of the other.'
    })),

    fillblank(() => ({
      cg: 'P5-3',
      q: 'Unlike the dot product, the cross product of two vectors produces a ___, not a scalar.',
      answer: 'vector',
      accept: ['vector', 'Vector'],
      explain: 'The cross product a⃗ × b⃗ is itself a vector, perpendicular to both inputs, with magnitude |a||b| sin θ.'
    })),

    typeanswer(() => {
      const a = pick([4, 6, 8]), b = pick([5, 10]);
      return {
        cg: 'P5-4',
        q: `Two vectors have magnitudes ${a} and ${b}, with a 60° angle between them. What is their dot product? (cos 60° = 0.5)`,
        answer: a * b * 0.5,
        tolerance: 0.01,
        explain: `a⃗ · b⃗ = |a||b| cos θ = ${a} × ${b} × 0.5 = ${a * b * 0.5}.`
      };
    }),

    mcq(() => ({
      cg: 'P5-5',
      q: 'What does it mean that the cross product is "anti-commutative"?',
      opts: [
        'a⃗ × b⃗ always equals zero',
        'a⃗ × b⃗ = b⃗ × a⃗',
        'a⃗ × b⃗ = −(b⃗ × a⃗) — swapping the order flips the resulting vector\'s direction',
        'The cross product only works in one direction'
      ],
      answer: 2,
      explain: 'Swapping the order of a cross product reverses the sign of the result: a⃗ × b⃗ = −(b⃗ × a⃗). This is why torque and angular momentum are sensitive to the order you cross their vectors in.'
    }))
  ],

  // ── M2 : Calculus — turning points & area ──
  M2: [
    mcq(() => ({
      cg: 'M2-1',
      q: 'At a local maximum or minimum of a smooth function f(x), what is true of the derivative?',
      opts: ['It is undefined', 'It equals zero', 'It equals the function value', 'It is always negative'],
      answer: 1,
      explain: "At a turning point the tangent is horizontal, so f'(x) = 0. The second derivative then tells you whether it's a peak or a valley."
    })),
    truefalse(() => ({
      cg: 'M2-2',
      q: "If f''(x) > 0 at a point where f'(x) = 0, that point is a local maximum.",
      answer: false,
      explain: "f'' > 0 means the slope is increasing through that point — the curve bends upward, which is the signature of a local minimum, not a maximum."
    })),
    fillblank(() => ({
      cg: 'M2-3',
      q: 'The area under a speed-time graph between two times equals the ___ travelled in that interval.',
      answer: 'distance',
      accept: ['distance', 'Distance'],
      explain: 'Integration sums infinitely many thin strips of (speed × tiny time) — exactly distance — which is why the area under a v-t graph gives distance travelled.'
    })),
    typeanswer(() => {
      const a = pick([10, 20, 30]);
      const t = a / 5;
      return {
        cg: 'M2-4',
        q: `A ball's height is y = ${a}t − 5t² (g = 10 m/s²). At what time t (in seconds) does it reach its peak?`,
        answer: t,
        tolerance: 0.01,
        explain: `dy/dt = ${a} − 10t. Setting this to zero: t = ${a}/10 = ${t} s.`
      };
    }),
    mcq(() => ({
      cg: 'M2-5',
      q: 'What does the Fundamental Theorem of Calculus connect?',
      opts: [
        'Addition and subtraction',
        'Differentiation and integration — one undoes the other',
        'Vectors and scalars',
        'Probability and statistics'
      ],
      answer: 1,
      explain: 'If F\'(x) = f(x), then ∫ₐᵇ f(x)dx = F(b) − F(a). Integration is the antiderivative — the reverse operation of differentiation.'
    }))
  ],

  // ── M5 : Arithmetic foundations ──
  M5: [
    mcq(() => ({
      cg: 'M5-1',
      q: 'Which property does a(b + c) = ab + ac demonstrate?',
      opts: ['Commutative', 'Associative', 'Distributive', 'Reflexive'],
      answer: 2,
      explain: 'The distributive property links multiplication and addition — it is the engine behind every expansion and factorisation in algebra.'
    })),
    truefalse(() => ({
      cg: 'M5-2',
      q: 'Subtraction and division are commutative, just like addition and multiplication.',
      answer: false,
      explain: 'Order matters for subtraction and division (5−2 ≠ 2−5), but not for addition or multiplication (3+2 = 2+3).'
    })),
    fillblank(() => ({
      cg: 'M5-3',
      q: 'In the number 425.73, the digit 7 sits in the ___ place.',
      answer: 'tenths',
      accept: ['tenths', 'Tenths', 'tenth'],
      explain: 'Each position after the decimal point is a negative power of ten: the first is tenths (10⁻¹), the second hundredths (10⁻²).'
    })),
    typeanswer(() => {
      const n = pick([17, 18, 19]), d = 20;
      const pct = (n / d) * 100;
      return {
        cg: 'M5-4',
        q: `A score of ${n} out of ${d} — what percentage is that?`,
        answer: pct,
        tolerance: 0.1,
        explain: `${n}/${d} = ${(n/d).toFixed(2)}, and multiplying by 100 gives ${pct}%.`
      };
    }),
    mcq(() => ({
      cg: 'M5-5',
      q: 'Estimating 98 × 53 by rounding to 100 × 50 gives 5000. The exact answer is 5194. What does this demonstrate?',
      opts: [
        'Estimation is useless because it is not exact',
        'Estimation gives a fast sanity check that catches gross errors',
        'Rounding always overestimates',
        'You should never calculate the exact answer'
      ],
      answer: 1,
      explain: "The estimate landed within 4% of the true answer in seconds — exactly the kind of sanity check that catches a misplaced decimal point or a calculator typo."
    })),
    truefalse(() => ({
      cg: 'M5-6',
      q: 'Multiplying a number by 0.3 will always give a smaller result than the original number (for a positive number).',
      answer: true,
      explain: 'Multiplying by any positive number less than 1 shrinks the result — this is the kind of number sense that catches errors like writing 45 × 0.2 = 90.'
    }))
  ],

  // ── M6 : Algebra foundations ──
  M6: [
    mcq(() => ({
      cg: 'M6-1',
      q: 'In the expression 3x² + 2x − 5, what is the coefficient of x²?',
      opts: ['2', '3', '−5', 'x'],
      answer: 1,
      explain: 'The coefficient is the number multiplying the variable part — here, 3 multiplies x².'
    })),
    truefalse(() => ({
      cg: 'M6-2',
      q: '3x² and 5x are like terms and can be combined into 8x or 8x².',
      answer: false,
      explain: 'Like terms must have exactly the same variable AND exponent. 3x² and 5x have different powers of x, so they cannot be combined.'
    })),
    fillblank(() => ({
      cg: 'M6-3',
      q: 'Expanding (a + b)(a − b) always gives a² − ___.',
      answer: 'b²',
      accept: ['b²', 'b^2', 'b2'],
      explain: 'This is the "difference of two squares" pattern: (a+b)(a−b) = a² − ab + ab − b² = a² − b².'
    })),
    typeanswer(() => {
      const p = pick([2, 3, 4]), q = pick([5, 6, 7]);
      const b = p + q, c = p * q;
      return {
        cg: 'M6-4',
        q: `Factorising x² + ${b}x + ${c} gives (x + ${p})(x + ${q}). Check: what is ${p} × ${q}?`,
        answer: c,
        tolerance: 0,
        explain: `The two numbers must multiply to the constant term (${c}) and add to the x-coefficient (${b}) — here ${p} and ${q} do both.`
      };
    }),
    mcq(() => ({
      cg: 'M6-5',
      q: 'Solving −2x + 3 > 7, you divide both sides by −2. What must you do to the inequality sign?',
      opts: ['Nothing changes', 'Flip it', 'Remove it', 'Double it'],
      answer: 1,
      explain: 'Multiplying or dividing both sides of an inequality by a negative number reverses the direction of the inequality — the one rule not shared with equations.'
    })),
    mcq(() => ({
      cg: 'M6-6',
      q: 'For a quadratic ax² + bx + c = 0, what does a negative discriminant (b² − 4ac < 0) tell you?',
      opts: [
        'There are two real solutions',
        'There is exactly one real solution',
        'There are no real solutions',
        'The equation is not quadratic'
      ],
      answer: 2,
      explain: 'A negative discriminant means √(b²−4ac) involves the square root of a negative number — no real solutions exist, only complex ones.'
    })),
    fillblank(() => ({
      cg: 'M6-7',
      q: 'x⁻² is the same as 1 over x to the power ___.',
      answer: '2',
      accept: ['2', 'two'],
      explain: 'A negative exponent means "reciprocal": x⁻ᵃ = 1/xᵃ, so x⁻² = 1/x².'
    }))
  ],

  // ── M7 : Matrices ──
  M7: [
    mcq(() => ({
      cg: 'M7-1',
      q: 'A matrix has 3 rows and 4 columns. How is its size described?',
      opts: ['4 × 3', '3 × 4', '3 + 4', '12'],
      answer: 1,
      explain: 'Matrix dimensions are always given as rows × columns — 3 rows, 4 columns, so it is a 3 × 4 matrix.'
    })),
    truefalse(() => ({
      cg: 'M7-2',
      q: 'Changing one entry of a matrix automatically changes the other entries, the same way changing one term in an equation forces the rest to change.',
      answer: false,
      explain: 'This is the isolation property — a matrix holds independent entries like a ledger. Changing one cell leaves every other cell untouched, unlike a linked equation.'
    })),
    fillblank(() => ({
      cg: 'M7-3',
      q: 'You can only add two matrices if they have the same ___.',
      answer: 'dimensions',
      accept: ['dimensions', 'size', 'shape'],
      explain: 'Matrix addition is element-wise — each entry needs a matching position in the other matrix, which is only possible if both matrices have identical dimensions.'
    })),
    mcq(() => ({
      cg: 'M7-4',
      q: 'To multiply matrix A (size m × n) by matrix B, what must be true of B?',
      opts: [
        'B must also be m × n',
        'B must have n rows',
        'B must have n columns',
        'B must be square'
      ],
      answer: 1,
      explain: 'The number of columns in A must equal the number of rows in B — otherwise a row of A and a column of B have a different number of terms to pair up.'
    })),
    truefalse(() => ({
      cg: 'M7-5',
      q: 'Matrix multiplication is commutative: AB always equals BA.',
      answer: false,
      explain: 'Matrix multiplication is generally NOT commutative — AB ≠ BA in general, unlike ordinary number multiplication.'
    })),
    typeanswer(() => {
      const a = pick([2, 3, 4]);
      return {
        cg: 'M7-6',
        q: `For a 2×2 matrix [a b; c d] with a=${a}, b=1, c=1, d=${a}, the determinant is ad − bc. What is it?`,
        answer: a * a - 1,
        tolerance: 0,
        explain: `det = (${a})(${a}) − (1)(1) = ${a*a} − 1 = ${a*a-1}.`
      };
    }),
    mcq(() => ({
      cg: 'M7-7',
      q: 'What does it mean for a matrix to be "singular"?',
      opts: [
        'It has only one row',
        'Its determinant is zero, so it has no inverse',
        'It is the identity matrix',
        'It contains only positive numbers'
      ],
      answer: 1,
      explain: 'A singular matrix has determinant zero, which means it collapses the plane and cannot be undone — no inverse exists.'
    }))
  ],

  // ── M8 : Exponents & logarithms ──
  M8: [
    mcq(() => ({
      cg: 'M8-1',
      q: 'For the exponential function y = bˣ with b > 1, what happens as x → −∞?',
      opts: ['y → ∞', 'y → 0 but never reaches it', 'y → 1', 'y becomes negative'],
      answer: 1,
      explain: 'The curve hugs the x-axis on the left without ever touching it — y = 0 is a horizontal asymptote, and y is always positive.'
    })),
    truefalse(() => ({
      cg: 'M8-2',
      q: 'The number e is defined as the limit of (1 + 1/n)ⁿ as n approaches infinity.',
      answer: true,
      explain: 'This is exactly how e arises — as the limit of continuous compounding, e ≈ 2.71828...'
    })),
    fillblank(() => ({
      cg: 'M8-3',
      q: 'log_b(x) = y means that b raised to the power ___ equals x.',
      answer: 'y',
      accept: ['y', 'Y'],
      explain: 'A logarithm is just an exponent in disguise: log_b(x) = y is defined to mean bʸ = x.'
    })),
    typeanswer(() => {
      const half = pick([1, 2, 3]);
      const remaining = 100 / Math.pow(2, half);
      return {
        cg: 'M8-4',
        q: `A 100 mg radioactive sample has a half-life T. After ${half} half-lives, how many mg remain?`,
        answer: remaining,
        tolerance: 0.01,
        explain: `After n half-lives, the amount is 100 × (1/2)ⁿ = 100 × (1/2)^${half} = ${remaining} mg.`
      };
    }),
    mcq(() => ({
      cg: 'M8-5',
      q: 'log_b(MN) equals which of the following?',
      opts: ['log_b(M) × log_b(N)', 'log_b(M) + log_b(N)', 'log_b(M) − log_b(N)', 'log_b(M)/log_b(N)'],
      answer: 1,
      explain: 'The product rule of logarithms: log_b(MN) = log_b(M) + log_b(N) — multiplication becomes addition under a log.'
    })),
    truefalse(() => ({
      cg: 'M8-6',
      q: 'No matter how large the exponent n is in xⁿ, an exponential function bˣ (with b > 1) will eventually outgrow it as x → ∞.',
      answer: true,
      explain: 'lim(x→∞) xⁿ/bˣ = 0 for any fixed n and any b > 1 — exponentials always eventually overtake polynomials, no matter how big the polynomial power.'
    })),
    mcq(() => ({
      cg: 'M8-7',
      q: 'What makes the logistic curve different from pure exponential growth?',
      opts: [
        'It grows even faster than exponential',
        'It approaches a maximum carrying capacity and levels off',
        'It only applies to radioactive decay',
        'It has no real-world examples'
      ],
      answer: 1,
      explain: 'The logistic curve starts off looking exponential but slows and flattens as the quantity approaches a carrying capacity K — modelling real growth that hits limits.'
    }))
  ],

  // ── M9 : Trigonometry ──
  M9: [
    mcq(() => ({
      cg: 'M9-1',
      q: 'On the unit circle, the coordinates of the point at angle θ are:',
      opts: ['(sin θ, cos θ)', '(cos θ, sin θ)', '(tan θ, 1)', '(θ, 1)'],
      answer: 1,
      explain: 'By definition, the x-coordinate of the point on the unit circle at angle θ is cos θ, and the y-coordinate is sin θ.'
    })),
    fillblank(() => ({
      cg: 'M9-2',
      q: 'sin 30° = cos ___° (the complementary angle rule).',
      answer: '60',
      accept: ['60', '60°'],
      explain: 'Cofunction identity: sin(90°−θ) = cos θ. Since 90°−30° = 60°, sin 30° = cos 60° = ½.'
    })),
    truefalse(() => ({
      cg: 'M9-3',
      q: 'The tangent function has the same period as sine and cosine (360°).',
      answer: false,
      explain: 'Tangent has period 180° (π) — half the period of sine and cosine — because tan repeats its pattern twice as often.'
    })),
    mcq(() => ({
      cg: 'M9-4',
      q: 'In which quadrant is tan θ positive but sin θ and cos θ both negative?',
      opts: ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV'],
      answer: 2,
      explain: 'ASTC: in Quadrant III, both x and y are negative, so sin and cos are negative — but their ratio (tan) is positive, since negative ÷ negative = positive.'
    })),
    typeanswer(() => {
      const theta = pick([15, 30, 60, 75]);
      const range = (u, g, deg) => (u*u*Math.sin(2*deg*Math.PI/180))/g;
      const u = 20, g = 10;
      const r = range(u, g, theta);
      return {
        cg: 'M9-5',
        q: `A projectile launched at u=${u} m/s at angle ${theta}° (g=${g} m/s²). Using R = u²sin(2θ)/g, what is the range in metres? (round to 1 decimal)`,
        answer: Math.round(r * 10) / 10,
        tolerance: 0.5,
        explain: `R = ${u}² × sin(${theta*2}°) / ${g} = ${u*u} × ${Math.sin(2*theta*Math.PI/180).toFixed(3)} / ${g} ≈ ${(Math.round(r*10)/10)} m.`
      };
    }),
    mcq(() => ({
      cg: 'M9-6',
      q: 'Why do a 30° and a 60° launch angle give the same projectile range (same speed)?',
      opts: [
        'They do not — this is a myth',
        'Because sin 2θ = sin(180° − 2θ), and 2(30°) and 2(60°) sum to 180°',
        'Because gravity is different at each angle',
        'Because 30 + 60 = 90'
      ],
      answer: 1,
      explain: 'sin 60° = sin 120° (since 180°−60°=120°), and 2×30°=60°, 2×60°=120° — the range formula gives the same sin 2θ value for complementary launch angles.'
    })),
    fillblank(() => ({
      cg: 'M9-7',
      q: 'The identity sin²θ + cos²θ = 1 comes directly from the equation of the unit ___.',
      answer: 'circle',
      accept: ['circle', 'Circle'],
      explain: 'The unit circle has equation x² + y² = 1. Since x = cos θ and y = sin θ, substituting gives cos²θ + sin²θ = 1.'
    }))
  ],

  // ── P6 : Measurement, errors & relative motion ──
  P6: [
    mcq(() => ({
      cg: 'P6-1',
      q: 'A balance gives readings that cluster tightly around the wrong value because it was never zeroed. What kind of error is this?',
      opts: ['Random error', 'Systematic error', 'No error — this is normal', 'Rounding error'],
      answer: 1,
      explain: 'A systematic error shifts every reading in the same direction (a calibration fault) — averaging more readings will not fix it, unlike random error.'
    })),
    truefalse(() => ({
      cg: 'P6-2',
      q: 'A measurement can be precise (tightly clustered) without being accurate (close to the true value).',
      answer: true,
      explain: 'Precision is about consistency between repeated readings; accuracy is about closeness to the true value. A tight cluster centred on the wrong number is precise but inaccurate.'
    })),
    fillblank(() => ({
      cg: 'P6-3',
      q: 'The velocity of A relative to B is written v⃗_A/B = v⃗_A − v⃗___.',
      answer: 'B',
      accept: ['B', 'b'],
      explain: 'Relative velocity is found by vector subtraction: v⃗_{A/B} = v⃗_A − v⃗_B.'
    })),
    typeanswer(() => {
      const u = pick([10, 15, 20]);
      const v = pick([2, 3, 4]);
      return {
        cg: 'P6-4',
        q: `A train moves at ${u} m/s east. A passenger walks toward the front at ${v} m/s relative to the train. What is the passenger's speed relative to the ground (m/s)?`,
        answer: u + v,
        tolerance: 0,
        explain: `Velocities in the same direction add: ${u} + ${v} = ${u+v} m/s relative to the ground.`
      };
    }),
    mcq(() => ({
      cg: 'P6-5',
      q: 'For a projectile launched at angle θ with speed u, which pair of formulas correctly gives the maximum height and range?',
      opts: [
        'H = u²sin²θ/(2g), R = u²sin(2θ)/g',
        'H = u²cosθ/g, R = u²sinθ/g',
        'H = ugsinθ, R = ugcosθ',
        'H = u²/g, R = u²sinθ/g'
      ],
      answer: 0,
      explain: 'Maximum height comes from the vertical component alone (H = u²sin²θ/2g); range combines both components via the double-angle identity (R = u²sin2θ/g).'
    }))
  ],

  // ── P7 : Newton's laws & forces ──
  P7: [
    mcq(() => ({
      cg: 'P7-1',
      q: "What is the key difference between a contact force and a field force?",
      opts: [
        'Field forces are always stronger',
        'Contact forces require physical touching; field forces act at a distance',
        'There is no real difference',
        'Contact forces only occur in space'
      ],
      answer: 1,
      explain: 'Contact forces (normal, friction, tension) arise from surfaces touching. Field forces (gravity, electric, magnetic) act without any contact, mediated by a field.'
    })),
    truefalse(() => ({
      cg: 'P7-2',
      q: 'In a free body diagram, you should include the forces the object exerts on other objects, as well as the forces acting on it.',
      answer: false,
      explain: 'A free body diagram shows ONLY the forces acting ON the isolated object — never the forces it exerts on anything else.'
    })),
    fillblank(() => ({
      cg: 'P7-3',
      q: "Newton's first law says an object in motion stays in motion unless acted on by an external ___.",
      answer: 'force',
      accept: ['force', 'Force'],
      explain: "This resistance to a change in velocity is inertia — Newton's first law defines it precisely."
    })),
    typeanswer(() => {
      const m = pick([1, 2, 3]), v0 = pick([2, 4, 6]);
      return {
        cg: 'P7-4',
        q: `A spring with k = 500 N/m is stretched by 0.0${v0} m by a hanging mass. What is the spring force (N)? Use F = kx.`,
        answer: 500 * (v0/100),
        tolerance: 0.1,
        explain: `F = kx = 500 × 0.0${v0} = ${500 * (v0/100)} N.`
      };
    }),
    mcq(() => ({
      cg: 'P7-5',
      q: 'Newton actually stated his second law in terms of momentum. What is the most general form?',
      opts: ['F = ma', 'F⃗ = dp⃗/dt', 'F = mg', 'F = kx'],
      answer: 1,
      explain: 'F⃗ = dp⃗/dt is the general form — it reduces to F = ma when mass is constant, but correctly handles variable-mass systems like rockets, which F=ma cannot.'
    })),
    truefalse(() => ({
      cg: 'P7-6',
      q: "A horse pulling a cart cannot move it, because by Newton's third law the cart pulls back on the horse with equal force.",
      answer: false,
      explain: "The action-reaction pair (horse↔cart) acts on different bodies and never cancels in one object's FBD. The horse also pushes the ground backward, and the ground pushes the horse forward — that net force is what actually moves the system."
    })),
    mcq(() => ({
      cg: 'P7-7',
      q: 'A body is in translational equilibrium when:',
      opts: [
        'It is not moving at all',
        'The vector sum of all external forces on it is zero',
        'Only gravity acts on it',
        'Its mass is zero'
      ],
      answer: 1,
      explain: 'Equilibrium means ΣF⃗ = 0 — zero acceleration. This includes both static equilibrium (at rest) and dynamic equilibrium (constant velocity).'
    }))
  ],

  // ── P8 : Friction & circular motion ──
  P8: [
    mcq(() => ({
      cg: 'P8-1',
      q: 'Why is it usually harder to start an object sliding than to keep it sliding?',
      opts: [
        'Static friction is usually a smaller maximum than kinetic friction',
        'Maximum static friction is usually greater than kinetic friction',
        'There is no difference between static and kinetic friction',
        'Kinetic friction increases with speed indefinitely'
      ],
      answer: 1,
      explain: 'For most material pairs, μₛ > μₖ — the maximum static friction holding something still is larger than the kinetic friction once it starts sliding.'
    })),
    fillblank(() => ({
      cg: 'P8-2',
      q: 'The angle of repose θᵣ satisfies tan θᵣ = ___ (the coefficient of static friction).',
      answer: 'μₛ',
      accept: ['μₛ', 'mu_s', 'μs', 'mus'],
      explain: 'At the angle of repose, the downhill component of weight exactly equals the maximum static friction, giving tan θᵣ = μₛ.'
    })),
    truefalse(() => ({
      cg: 'P8-3',
      q: 'An object moving in a circle at constant speed is not accelerating, since its speed never changes.',
      answer: false,
      explain: 'Acceleration is the rate of change of velocity, a vector — even at constant speed, the direction is always changing in circular motion, so it is always accelerating toward the centre.'
    })),
    typeanswer(() => {
      const v = pick([10, 20, 30]), r = pick([25, 50, 100]);
      const a = (v*v)/r;
      return {
        cg: 'P8-4',
        q: `A car takes a curve of radius ${r} m at ${v} m/s. What is its centripetal acceleration (m/s²)? Use a = v²/r.`,
        answer: a,
        tolerance: 0.1,
        explain: `a = v²/r = ${v}²/${r} = ${v*v}/${r} = ${a} m/s².`
      };
    }),
    mcq(() => ({
      cg: 'P8-5',
      q: 'What provides the centripetal force for a car turning on a flat, unbanked road?',
      opts: ['Gravity', 'The normal force', 'Friction between tyres and road', 'The engine'],
      answer: 2,
      explain: "On a flat road, friction is the only force with a component pointing toward the centre of the turn — it provides the centripetal force, F_c = μₛmg = mv²/r."
    })),
    mcq(() => ({
      cg: 'P8-6',
      q: 'Why does banking a curve help a car turn safely at higher speed?',
      opts: [
        'It increases the friction coefficient',
        'It tilts the normal force so part of it points toward the centre, supplying centripetal force without relying solely on friction',
        'It reduces the car\'s mass',
        'It eliminates the need for any centripetal force'
      ],
      answer: 1,
      explain: 'On a banked curve, the normal force is tilted inward — its horizontal component contributes to the centripetal force, reducing (or at the optimum speed, eliminating) the need for friction.'
    }))
  ],

  // ── P9 : Work, energy & momentum ──
  P9: [
    mcq(() => ({
      cg: 'P9-1',
      q: 'A person carries a box horizontally at constant speed. Why is the work done by the upward force they exert on the box zero?',
      opts: [
        'Because the box has no weight',
        'Because that force is perpendicular to the horizontal displacement',
        'Because the person is not pushing hard enough',
        'Work is never zero in physics'
      ],
      answer: 1,
      explain: 'W = Fs cos θ. When the force is perpendicular to the displacement, θ = 90° and cos 90° = 0, so the work done by that force is zero.'
    })),
    fillblank(() => ({
      cg: 'P9-2',
      q: 'The work-energy theorem states that the net work done on an object equals its change in ___ energy.',
      answer: 'kinetic',
      accept: ['kinetic', 'Kinetic'],
      explain: 'W_net = ΔK = ½mv²_f − ½mv²_i — this follows directly from integrating Newton\'s second law over a displacement.'
    })),
    typeanswer(() => {
      const m = pick([1, 2, 4]), v = pick([4, 6, 10]);
      const ke = 0.5 * m * v * v;
      return {
        cg: 'P9-3',
        q: `A ${m} kg object moves at ${v} m/s. What is its kinetic energy (J)? Use KE = ½mv².`,
        answer: ke,
        tolerance: 0.1,
        explain: `KE = ½ × ${m} × ${v}² = ½ × ${m} × ${v*v} = ${ke} J.`
      };
    }),
    truefalse(() => ({
      cg: 'P9-4',
      q: 'Doubling an object\'s speed quadruples its kinetic energy.',
      answer: true,
      explain: 'KE = ½mv² depends on the square of speed. Doubling v multiplies KE by 2² = 4 — this is why braking distance grows so fast with speed.'
    })),
    mcq(() => ({
      cg: 'P9-5',
      q: 'Why is the choice of reference level (where U = 0) for gravitational potential energy arbitrary?',
      opts: [
        'It is not arbitrary — there is only one correct choice',
        'Only changes (differences) in potential energy are physically meaningful, not absolute values',
        'Potential energy does not actually exist',
        'Gravity changes depending on the reference level'
      ],
      answer: 1,
      explain: 'The physics only ever depends on ΔU, the change in potential energy as height changes — so where you set U = 0 has no effect on predicted motion.'
    })),
    mcq(() => ({
      cg: 'P9-6',
      q: 'Two carts collide and stick together (perfectly inelastic). What is always conserved, even though kinetic energy is lost to heat and deformation?',
      opts: ['Kinetic energy', 'Total momentum', 'Speed', 'Volume'],
      answer: 1,
      explain: 'Momentum is conserved in any collision with no external force, regardless of whether kinetic energy is lost — Σp_before = Σp_after always holds.'
    })),
    typeanswer(() => {
      const m = pick([0.1, 0.15, 0.2]), dv = pick([50, 60, 70]);
      const dt = 0.01;
      const F = (m * dv) / dt;
      return {
        cg: 'P9-7',
        q: `A ${m} kg ball changes velocity by ${dv} m/s in a bat collision lasting ${dt} s. What is the average force (N)? Use F = Δp/Δt = mΔv/Δt.`,
        answer: Math.round(F),
        tolerance: 5,
        explain: `F = mΔv/Δt = (${m} × ${dv}) / ${dt} = ${(m*dv).toFixed(2)} / ${dt} = ${Math.round(F)} N.`
      };
    })
  ],

  // ── P10 : Vectors ──
  P10: [
    mcq(() => ({
      cg: 'P10-1',
      q: 'A vector is written a⃗ = 3î + 4ĵ. What does this notation mean?',
      opts: [
        'The vector has length 3+4=7',
        'The vector has an x-component of 3 and a y-component of 4',
        'î and ĵ are unknowns to be solved for',
        'The vector points only in the î direction'
      ],
      answer: 1,
      explain: 'î and ĵ are unit vectors along the x and y axes — the numbers in front of them (3 and 4) are the components, the scalar amounts along each axis.'
    })),
    typeanswer(() => {
      const x = pick([3, 6, 8]), y = pick([4, 8, 15]);
      const mag = Math.sqrt(x*x + y*y);
      return {
        cg: 'P10-2',
        q: `Find the magnitude of a⃗ = ${x}î + ${y}ĵ.`,
        answer: Math.round(mag * 100) / 100,
        tolerance: 0.05,
        explain: `|a⃗| = √(${x}² + ${y}²) = √(${x*x}+${y*y}) = √${x*x+y*y} = ${Math.round(mag*100)/100}.`
      };
    }),
    fillblank(() => ({
      cg: 'P10-3',
      q: 'A unit vector â in the direction of a⃗ is found by dividing a⃗ by its ___.',
      answer: 'magnitude',
      accept: ['magnitude', 'Magnitude', 'length'],
      explain: 'â = a⃗/|a⃗| — dividing by the magnitude strips away the "how much," leaving only the pure direction with length exactly 1.'
    })),
    truefalse(() => ({
      cg: 'P10-4',
      q: 'Displacement is independent of where you place the origin, but position is not.',
      answer: true,
      explain: 'Position is measured from a chosen origin and changes if you move the origin. Displacement, the difference between two positions, stays the same regardless of origin — it is a free vector.'
    })),
    mcq(() => ({
      cg: 'P10-5',
      q: 'Geometrically, what does a⃗ − b⃗ represent when both vectors are drawn from the same starting point?',
      opts: [
        'The midpoint between the two tips',
        'The vector from the tip of b⃗ to the tip of a⃗',
        'The sum of the two vectors',
        'It has no geometric meaning'
      ],
      answer: 1,
      explain: 'Subtraction gives the vector that takes you from the tip of b⃗ to the tip of a⃗ — exactly what relative position and relative velocity use.'
    })),
    mcq(() => ({
      cg: 'P10-6',
      q: 'What is the key difference between the dot product and the cross product of two vectors?',
      opts: [
        'The dot product gives a vector; the cross product gives a scalar',
        'The dot product gives a scalar (using cos θ); the cross product gives a vector (using sin θ)',
        'They are exactly the same operation',
        'The cross product only works in 2D'
      ],
      answer: 1,
      explain: 'a⃗·b⃗ = |a||b|cos θ is a scalar. a⃗×b⃗ = |a||b|sin θ n̂ is a vector perpendicular to both, with direction from the right-hand rule.'
    })),
    typeanswer(() => {
      const dx = pick([3,4,5]), dy = pick([2,3,4]);
      return {
        cg: 'P10-7',
        q: `A particle's position is r⃗(t) = ${dx}t·î + ${dy}t²·ĵ. What is the x-component of its velocity v⃗ = dr⃗/dt?`,
        answer: dx,
        tolerance: 0,
        explain: `Differentiate component-wise: d(${dx}t)/dt = ${dx}. (The y-component would be ${2*dy}t, which changes with time — but the x-component is constant.)`
      };
    })
  ],

  // ── P11 : Electricity & circuits ──
  P11: [
    mcq(() => ({
      cg: 'P11-1',
      q: 'What does it mean that electric charge is "quantised"?',
      opts: [
        'Charge can take any value at all',
        'All charge is an integer multiple of the elementary charge e',
        'Charge cannot be measured precisely',
        'Only protons carry charge'
      ],
      answer: 1,
      explain: 'Charge comes in indivisible lumps of e = 1.602×10⁻¹⁹ C — you cannot have half an electron\'s worth of charge.'
    })),
    fillblank(() => ({
      cg: 'P11-2',
      q: 'Current is defined as I = Q/___.',
      answer: 't',
      accept: ['t', 'T', 'time'],
      explain: 'I = Q/t — current is the rate of flow of charge, measured in amperes (coulombs per second).'
    })),
    typeanswer(() => {
      const v = pick([6, 9, 12]), r = pick([3, 4, 6]);
      return {
        cg: 'P11-3',
        q: `A ${r} Ω resistor is connected to a ${v} V battery. What current flows (A)? Use Ohm's law V=IR.`,
        answer: v / r,
        tolerance: 0.05,
        explain: `I = V/R = ${v}/${r} = ${v/r} A.`
      };
    }),
    mcq(() => ({
      cg: 'P11-4',
      q: 'In a series circuit with two resistors, what stays the same through both?',
      opts: ['Voltage', 'Current', 'Resistance', 'Power'],
      answer: 1,
      explain: 'In series, there is only one path, so the same current flows through every component. Voltage divides between them in proportion to resistance.'
    })),
    mcq(() => ({
      cg: 'P11-5',
      q: 'In a parallel circuit with two resistors, what stays the same across both branches?',
      opts: ['Current', 'Voltage', 'Resistance', 'Charge'],
      answer: 1,
      explain: 'Each parallel branch connects directly to the same two points, so each sees the full battery voltage. Current divides between branches according to their resistance.'
    })),
    truefalse(() => ({
      cg: 'P11-6',
      q: 'Power lines use very high voltage mainly to make the current smaller for the same delivered power, which greatly reduces I²R heating losses.',
      answer: true,
      explain: 'Since P = IV, raising V for fixed P lowers I. Since line losses scale as I²R, even a 10× drop in current cuts losses by 100×.'
    })),
    fillblank(() => ({
      cg: 'P11-7',
      q: "Kirchhoff's Current Law says the total current flowing into a junction equals the total current flowing ___.",
      answer: 'out',
      accept: ['out', 'Out'],
      explain: 'KCL is just conservation of charge applied to a junction — current in = current out, since charge cannot pile up at a point in steady state.'
    })),
    typeanswer(() => {
      const c = pick([2, 5, 10]), v = pick([6, 9, 12]);
      return {
        cg: 'P11-8',
        q: `A ${c} μF capacitor is charged to ${v} V. How much charge does it store (in μC)? Use Q = CV.`,
        answer: c * v,
        tolerance: 0.1,
        explain: `Q = CV = ${c} × ${v} = ${c*v} μC.`
      };
    })
  ],

  // ── C2 : Atomic structure ──
  C2: [
    mcq(() => ({
      cg: 'C2-1',
      q: 'Carbon-12 and carbon-14 are both carbon, with identical chemistry. What differs between them?',
      opts: ['Number of protons', 'Number of electrons', 'Number of neutrons', 'Atomic number'],
      answer: 2,
      explain: 'Isotopes share the same number of protons (and so the same chemistry) but differ in neutron count, giving different mass numbers.'
    })),
    fillblank(() => ({
      cg: 'C2-2',
      q: 'The atomic number Z is the number of ___ in the nucleus.',
      answer: 'protons',
      accept: ['protons', 'Protons'],
      explain: 'Z, the atomic number, counts protons — it uniquely identifies the element and fixes its position on the periodic table.'
    })),
    truefalse(() => ({
      cg: 'C2-3',
      q: 'The first electron shell can hold up to 8 electrons, just like the second shell.',
      answer: false,
      explain: 'Shell 1 holds a maximum of 2 electrons. Shell 2 holds up to 8. Capacities grow as you move outward (2, 8, 18, 32...).'
    })),
    typeanswer(() => {
      const z = pick([11, 17, 12]);
      const names = {11: 'sodium (Na)', 17: 'chlorine (Cl)', 12: 'magnesium (Mg)'};
      return {
        cg: 'C2-4',
        q: `A neutral atom of ${names[z]} has Z = ${z}. How many electrons does it have?`,
        answer: z,
        tolerance: 0,
        explain: `In a neutral atom, the number of electrons equals the number of protons (Z), so it has ${z} electrons.`
      };
    }),
    mcq(() => ({
      cg: 'C2-5',
      q: 'Why does sodium (2,8,1) readily lose one electron to become Na⁺?',
      opts: [
        'Because sodium is radioactive',
        'Because losing one electron gives it the same stable full-shell configuration as neon (2,8)',
        'Because sodium has no electrons to begin with',
        'Because Na⁺ has more mass than Na'
      ],
      answer: 1,
      explain: 'Losing its one lonely valence electron leaves sodium with the configuration 2,8 — identical to neon\'s stable, full-shell arrangement.'
    })),
    mcq(() => ({
      cg: 'C2-6',
      q: 'Why are noble gases chemically inert under most conditions?',
      opts: [
        'They have no electrons at all',
        'Their outer electron shell is already completely full',
        'They are radioactive',
        'They only exist at very high temperatures'
      ],
      answer: 1,
      explain: 'A completely filled outer shell is exceptionally stable, so noble gases have nothing to gain or lose by reacting — hence they rarely form compounds.'
    }))
  ],

  // ── C3 : Chemical bonding ──
  C3: [
    mcq(() => ({
      cg: 'C3-1',
      q: 'What is the fundamental reason atoms bond together?',
      opts: [
        'To increase their mass',
        'To reach a lower, more stable energy state, usually a full outer shell',
        'Because they are forced to by external pressure',
        'Bonding has no real cause — it just happens randomly'
      ],
      answer: 1,
      explain: 'Bonding happens because the bonded configuration has lower total energy than the separated atoms — almost always by achieving a noble-gas-like full outer shell.'
    })),
    truefalse(() => ({
      cg: 'C3-2',
      q: 'In ionic bonding, individual NaCl "molecules" exist, just like individual H₂O molecules in covalent bonding.',
      answer: false,
      explain: 'Ionic compounds form an extended repeating lattice of alternating ions, not discrete molecules — there is no single "molecule" of NaCl, unlike covalent H₂O.'
    })),
    fillblank(() => ({
      cg: 'C3-3',
      q: 'In covalent bonding, atoms achieve stability by ___ electron pairs rather than transferring them.',
      answer: 'sharing',
      accept: ['sharing', 'Sharing'],
      explain: 'Covalent bonding is electron sharing: both nuclei are attracted to the same shared pair, gluing the atoms together.'
    })),
    mcq(() => ({
      cg: 'C3-4',
      q: 'What gives metals their electrical conductivity, malleability, and lustre, all from the same cause?',
      opts: [
        'A rigid lattice with no free electrons',
        'Delocalised electrons that move freely throughout the metal lattice',
        'Covalent bonds between metal atoms',
        'The metal atoms are not actually bonded at all'
      ],
      answer: 1,
      explain: 'In metallic bonding, valence electrons form a mobile "sea" not tied to any one atom — this sea carries current, conducts heat, allows layers of ions to slide (malleability), and interacts with light (lustre).'
    })),
    truefalse(() => ({
      cg: 'C3-5',
      q: 'A double bond (like in O=O) involves sharing two electron pairs, and is generally stronger and shorter than a single bond.',
      answer: true,
      explain: 'Double bonds share two pairs of electrons (versus one in a single bond), making them shorter and stronger — triple bonds (sharing three pairs) are even more so.'
    }))
  ],

  // ── C4 : Reactions & molecular architecture ──
  C4: [
    typeanswer(() => {
      const m = pick([40, 60, 80, 120]);
      return {
        cg: 'C4-1',
        q: `NaOH has molar mass 40 g/mol. How many moles are in ${m} g? Use n = m/M.`,
        answer: m / 40,
        tolerance: 0.05,
        explain: `n = m/M = ${m}/40 = ${m/40} moles.`
      };
    }),
    mcq(() => ({
      cg: 'C4-2',
      q: 'Why is chlorine\'s relative atomic mass listed as 35.5, not a whole number?',
      opts: [
        'Chlorine atoms have half a neutron',
        'It is a weighted average of naturally occurring isotopes (mostly Cl-35 and Cl-37)',
        'It is a rounding error on the periodic table',
        'Chlorine does not really have a fixed mass'
      ],
      answer: 1,
      explain: 'No single atom weighs 35.5 u. The periodic table value is the weighted average across chlorine\'s naturally occurring isotopes (~75% Cl-35, ~25% Cl-37).'
    })),
    truefalse(() => ({
      cg: 'C4-3',
      q: 'In an ionic compound like NaCl, there exists a single discrete "molecule" of NaCl, just as there is a discrete molecule of H₂O.',
      answer: false,
      explain: 'Ionic compounds form a giant repeating lattice of alternating ions, not discrete molecules — there is no single NaCl unit, unlike covalent H₂O.'
    })),
    mcq(() => ({
      cg: 'C4-4',
      q: 'Diamond and graphite are both pure carbon but have opposite properties (hardest substance vs. soft enough to write with). Why?',
      opts: [
        'They are actually different elements',
        'Graphite contains impurities that diamond does not',
        'The same atoms are bonded in different patterns — diamond is a rigid 3D network, graphite is layered sheets with delocalised electrons',
        'Diamond is just compressed graphite with no structural difference'
      ],
      answer: 2,
      explain: 'Same element, different bonding pattern: diamond\'s rigid tetrahedral network makes it the hardest natural substance; graphite\'s weakly-bonded sliding sheets make it soft and conductive.'
    })),
    fillblank(() => ({
      cg: 'C4-5',
      q: 'According to VSEPR theory, molecular shape is determined by electron pairs arranging themselves to minimise ___.',
      answer: 'repulsion',
      accept: ['repulsion', 'Repulsion'],
      explain: 'Electron pairs (bonding and lone) repel each other and spread out as far apart as possible — this single rule predicts linear, tetrahedral, bent, and pyramidal shapes.'
    })),
    mcq(() => ({
      cg: 'C4-6',
      q: 'CO₂ has polar C=O bonds, yet the molecule as a whole is non-polar. Why?',
      opts: [
        'Carbon dioxide does not actually have polar bonds',
        'The linear shape makes the two bond dipoles point in opposite directions and cancel exactly',
        'Oxygen is not electronegative enough to create a dipole',
        'Non-polar molecules cannot have polar bonds, by definition'
      ],
      answer: 1,
      explain: 'CO₂\'s linear geometry means the two C=O bond dipoles point in exactly opposite directions and cancel — shape determines whether bond polarities add up or cancel.'
    })),
    truefalse(() => ({
      cg: 'C4-7',
      q: 'Methane (CH₄) and water (H₂O) have similar molecular masses, yet water boils at a vastly higher temperature because of hydrogen bonding.',
      answer: true,
      explain: 'Water has strong hydrogen bonds (plus dipole-dipole and dispersion forces); methane, being non-polar, only has weak London dispersion forces — explaining the 261°C difference in boiling points.'
    })),
    mcq(() => ({
      cg: 'C4-8',
      q: 'In a balanced chemical equation, what are you allowed to change to balance atom counts?',
      opts: [
        'The subscripts within formulas',
        'The coefficients in front of formulas',
        'Either subscripts or coefficients, whichever is easier',
        'Nothing — equations are already balanced when written'
      ],
      answer: 1,
      explain: 'Only coefficients (numbers placed before formulas) may be adjusted. Changing a subscript changes which compound you\'re talking about entirely.'
    })),
    mcq(() => ({
      cg: 'C4-9',
      q: 'By the Brønsted-Lowry definition, what is an acid?',
      opts: ['A substance that tastes sour', 'A proton (H⁺) donor', 'A proton (H⁺) acceptor', 'Any substance with pH below 10'],
      answer: 1,
      explain: 'Brønsted-Lowry: an acid donates a proton (H⁺); a base accepts one. This works even without water as a solvent, unlike the older Arrhenius definition.'
    })),
    typeanswer(() => {
      const ph = pick([3, 5, 9, 11]);
      return {
        cg: 'C4-10',
        q: `A solution has pH ${ph}. Is it acidic, neutral, or alkaline? (type "acidic", "neutral", or "alkaline")`,
        answer: ph < 7 ? 'acidic' : ph === 7 ? 'neutral' : 'alkaline',
        accept: [ph < 7 ? 'acidic' : ph === 7 ? 'neutral' : 'alkaline'],
        explain: `pH < 7 is acidic, pH = 7 is neutral, pH > 7 is alkaline. pH ${ph} is ${ph < 7 ? 'acidic' : ph === 7 ? 'neutral' : 'alkaline'}.`
      };
    })
  ],

  // ── C5 : Redox, electrochemistry & kinetics ──
  C5: [
    mcq(() => ({
      cg: 'C5-1',
      q: 'Using the OIL RIG mnemonic, what is oxidation?',
      opts: ['Oxidation Is Loss of electrons', 'Oxidation Includes Lone electrons', 'Oxidation Is Largest', 'Oxidation Involves Lithium'],
      answer: 0,
      explain: 'OIL RIG: Oxidation Is Loss (of electrons), Reduction Is Gain (of electrons).'
    })),
    truefalse(() => ({
      cg: 'C5-2',
      q: 'In a redox reaction, the substance that loses electrons is called the reducing agent.',
      answer: true,
      explain: 'The species that loses electrons (is oxidised) is called the reducing agent, because it causes the other species to be reduced by supplying electrons.'
    })),
    fillblank(() => ({
      cg: 'C5-3',
      q: 'Oxidation is an ___ in oxidation number; reduction is a decrease.',
      answer: 'increase',
      accept: ['increase', 'Increase'],
      explain: 'Oxidation number rises when a species is oxidised (loses electrons, becomes more positive) and falls when reduced.'
    })),
    mcq(() => ({
      cg: 'C5-4',
      q: 'An exothermic reaction (ΔH < 0) means:',
      opts: [
        'The reaction absorbs energy from the surroundings',
        'The reaction releases energy to the surroundings, and the surroundings get warmer',
        'The reaction has no energy change at all',
        'The products always have more enthalpy than the reactants'
      ],
      answer: 1,
      explain: 'Exothermic = energy released to the surroundings (ΔH < 0); the products end up at lower enthalpy than the reactants.'
    })),
    mcq(() => ({
      cg: 'C5-5',
      q: "What does Hess's Law say about the enthalpy change of a reaction?",
      opts: [
        'It depends on how fast the reaction occurs',
        'It depends only on the initial and final states, not the route taken',
        'It can only be measured directly, never calculated indirectly',
        'It is always positive'
      ],
      answer: 1,
      explain: 'Hess\'s Law: total enthalpy change is independent of the pathway — a direct consequence of enthalpy being a state function. This lets you calculate ΔH for reactions you can\'t measure directly.'
    })),
    truefalse(() => ({
      cg: 'C5-6',
      q: 'Activation energy is always positive, even for a reaction that releases energy overall (exothermic).',
      answer: true,
      explain: 'Every reaction — exothermic or endothermic — must climb over an energy barrier (the transition state) before it can proceed. E_a is always positive.'
    })),
    mcq(() => ({
      cg: 'C5-7',
      q: 'According to collision theory, why does increasing temperature speed up a reaction?',
      opts: [
        'It increases the mass of the reacting particles',
        'It increases the fraction of particles with energy ≥ activation energy, and increases collision frequency',
        'It removes the need for activation energy entirely',
        'Temperature has no real effect on reaction rate'
      ],
      answer: 1,
      explain: 'Higher temperature raises the average kinetic energy of particles, increasing both the collision frequency and the fraction of collisions with enough energy to react.'
    })),
    truefalse(() => ({
      cg: 'C5-8',
      q: 'A catalyst speeds up a reaction by increasing the activation energy needed.',
      answer: false,
      explain: 'A catalyst LOWERS the activation energy by providing an alternative reaction pathway — it speeds up the reaction without being consumed, and without changing ΔH or the equilibrium position.'
    })),
    fillblank(() => ({
      cg: 'C5-9',
      q: 'In electrolysis and electrochemical cells, the electrode where oxidation occurs is called the ___.',
      answer: 'anode',
      accept: ['anode', 'Anode'],
      explain: 'Mnemonic "AN OX, RED CAT": ANode = OXidation, REDuction = CAThode.'
    }))
  ],

  // ── P12 : Force & torque — rotational dynamics ──
  P12: [
    mcq(() => ({
      cg: 'P12-1',
      q: 'Torque is the rotational analogue of force. What is the formula for its magnitude?',
      opts: ['τ = m a', 'τ = r F sin θ', 'τ = F / r', 'τ = m r²'],
      answer: 1,
      explain: 'τ = rF sin θ, where θ is the angle between the position vector (pivot to point of application) and the force. Equivalently, τ = F × d, force times the perpendicular lever arm.'
    })),
    truefalse(() => ({
      cg: 'P12-2',
      q: 'A couple (two equal, opposite, parallel forces) produces translation of the centre of mass, just like a single force.',
      answer: false,
      explain: 'A couple has zero net force, so it produces NO translation — only pure rotation. Its torque is also independent of which point you measure it about.'
    })),
    fillblank(() => ({
      cg: 'P12-3',
      q: 'A rigid body is in complete static equilibrium when ΣF = 0 AND Σ___ = 0.',
      answer: 'τ',
      accept: ['τ', 'torque', 'Torque'],
      explain: 'Equilibrium requires BOTH zero net force (no translational acceleration) and zero net torque (no angular acceleration) about any point.'
    })),
    typeanswer(() => {
      const m = pick([2, 4, 6]), r = pick([0.2, 0.3, 0.5]);
      const I = 0.5 * m * r * r;
      return {
        cg: 'P12-4',
        q: `A solid disc of mass ${m} kg and radius ${r} m rotates about its central axis. Using I = ½MR², what is its moment of inertia (kg·m²)?`,
        answer: Math.round(I * 1000) / 1000,
        tolerance: 0.01,
        explain: `I = ½MR² = ½ × ${m} × ${r}² = ½ × ${m} × ${(r*r).toFixed(2)} = ${Math.round(I*1000)/1000} kg·m².`
      };
    }),
    mcq(() => ({
      cg: 'P12-5',
      q: "Newton's second law for rotation is Στ = Iα. What plays the role of mass in this rotational analogue?",
      opts: ['Angular velocity ω', 'Angular momentum L', 'Moment of inertia I', 'Radius r'],
      answer: 2,
      explain: 'In the rotational analogue, τ↔F, I↔m, α↔a. Moment of inertia is the rotational equivalent of mass — resistance to a change in rotational motion.'
    })),
    truefalse(() => ({
      cg: 'P12-6',
      q: 'If a spinning skater pulls their arms in (decreasing their moment of inertia) with no external torque, their angular velocity must increase to conserve angular momentum.',
      answer: true,
      explain: 'L = Iω is conserved when no external torque acts. If I decreases, ω must increase proportionally to keep L constant — exactly why skaters spin faster with arms tucked in.'
    })),
    mcq(() => ({
      cg: 'P12-7',
      q: 'For an object rolling without slipping, what provides the friction at the contact point, and does it do work?',
      opts: [
        'Kinetic friction acts there and does negative work',
        'Static friction acts there (the contact point is instantaneously at rest) and does no work',
        'No friction is needed for rolling',
        'Friction does positive work, speeding up the object'
      ],
      answer: 1,
      explain: 'In rolling without slipping, the contact point is momentarily at rest, so static friction acts there. Since the contact point doesn\'t move, that friction force does zero work.'
    }))
  ],

  // ── P13 : Reflection & refraction ──
  P13: [
    mcq(() => ({
      cg: 'P13-1',
      q: 'The law of reflection states that:',
      opts: [
        'The angle of incidence is always 90°',
        'The angle of incidence equals the angle of reflection, both measured from the normal',
        'Light always reflects straight back the way it came',
        'Reflection only happens off smooth surfaces'
      ],
      answer: 1,
      explain: 'θ_incidence = θ_reflection, both measured from the normal to the surface — true for both specular (smooth) and diffuse (rough) reflection at the microscopic level.'
    })),
    truefalse(() => ({
      cg: 'P13-2',
      q: 'The image formed by a plane mirror is virtual, the same size as the object, and laterally inverted (left-right swapped).',
      answer: true,
      explain: 'A plane mirror image is virtual (can\'t be projected on a screen), erect, same size (m=+1), and laterally inverted — all standard properties.'
    })),
    typeanswer(() => {
      const v = pick([20, 30, 60]), u = pick([10, 15, 20]);
      const f = (u*v)/(u+v);
      return {
        cg: 'P13-3',
        q: `Using 1/f = 1/v + 1/u, if v = ${v} cm and u = ${u} cm, what is f (cm)? (round to 1 decimal)`,
        answer: Math.round(f * 10) / 10,
        tolerance: 0.2,
        explain: `1/f = 1/${v} + 1/${u} = ${(1/v).toFixed(4)} + ${(1/u).toFixed(4)} = ${(1/v+1/u).toFixed(4)}, so f = ${Math.round(f*10)/10} cm.`
      };
    }),
    mcq(() => ({
      cg: 'P13-4',
      q: 'Light bends toward the normal when it enters a medium that is:',
      opts: ['Optically less dense (lower refractive index)', 'Optically denser (higher refractive index)', 'Exactly the same density', 'A vacuum'],
      answer: 1,
      explain: 'Entering a denser medium slows the light down, which bends the ray toward the normal. Entering a rarer medium bends it away from the normal.'
    })),
    fillblank(() => ({
      cg: 'P13-5',
      q: "Snell's Law is written n₁ sin θ₁ = n₂ sin ___.",
      answer: 'θ₂',
      accept: ['θ2', 'θ₂', 'theta2', 'theta_2'],
      explain: 'n₁ sin θ₁ = n₂ sin θ₂ — the products of refractive index and the sine of the angle are equal on both sides of the boundary.'
    })),
    mcq(() => ({
      cg: 'P13-6',
      q: 'Total internal reflection can only occur when light travels:',
      opts: [
        'From a rarer medium into a denser medium',
        'From a denser medium into a rarer medium, at an angle beyond the critical angle',
        'Through a vacuum',
        'At exactly normal incidence'
      ],
      answer: 1,
      explain: 'TIR requires going from higher to lower refractive index (denser to rarer) AND exceeding the critical angle θ_c, where sin θ_c = n₂/n₁.'
    })),
    truefalse(() => ({
      cg: 'P13-7',
      q: 'Dispersion occurs because different wavelengths of light have slightly different refractive indices in a given material.',
      answer: true,
      explain: 'Since n varies with wavelength (violet bends more than red, generally), white light splits into its component colours when refracted through a prism — this is dispersion.'
    })),
    mcq(() => ({
      cg: 'P13-8',
      q: 'A convex (converging) lens has a positive focal length. What does a concave (diverging) lens have?',
      opts: ['Also a positive focal length', 'A negative focal length', 'No focal length at all', 'An infinite focal length always'],
      answer: 1,
      explain: 'By convention, convex/converging lenses have f > 0 (real focus); concave/diverging lenses have f < 0 (virtual focus, where diverging rays appear to come from).'
    }))
  ],

  // ── P14 : Thermodynamics ──
  P14: [
    mcq(() => ({
      cg: 'P14-1',
      q: 'What is the key difference between temperature and heat?',
      opts: [
        'They are exactly the same thing',
        'Temperature measures average particle kinetic energy (intensive); heat is energy transferred due to a temperature difference (extensive)',
        'Heat is measured in kelvin; temperature is measured in joules',
        'Temperature only applies to gases'
      ],
      answer: 1,
      explain: 'Temperature is an intensive property (independent of amount) describing average kinetic energy. Heat is energy in transit, extensive (depends on amount), measured in joules.'
    })),
    fillblank(() => ({
      cg: 'P14-2',
      q: 'Absolute zero, 0 K, is equal to ___ °C.',
      answer: '-273.15',
      accept: ['-273.15', '-273', '−273.15', '−273'],
      explain: 'T(K) = T(°C) + 273.15, so 0 K corresponds to −273.15°C — the theoretical lower limit of temperature.'
    })),
    typeanswer(() => {
      const m = pick([0.5, 1, 2]), c = 4200, dT = pick([10, 20, 30]);
      const Q = m * c * dT;
      return {
        cg: 'P14-3',
        q: `Using Q = mcΔT with m = ${m} kg, c = 4200 J/(kg·K) (water), ΔT = ${dT} K, how much heat (J) is needed?`,
        answer: Q,
        tolerance: 1,
        explain: `Q = mcΔT = ${m} × 4200 × ${dT} = ${Q} J.`
      };
    }),
    truefalse(() => ({
      cg: 'P14-4',
      q: 'During a phase change (like ice melting), temperature stays constant while heat is still being absorbed.',
      answer: true,
      explain: 'During a phase change, all the added energy goes into breaking/rearranging intermolecular bonds (latent heat, Q=mL), not into raising temperature — temperature stays flat on a heating curve during melting/boiling.'
    })),
    mcq(() => ({
      cg: 'P14-5',
      q: "Boyle's Law (constant temperature) states that pressure and volume of a gas are related how?",
      opts: ['Directly proportional (P ∝ V)', 'Inversely proportional (P ∝ 1/V), so P₁V₁ = P₂V₂', 'Unrelated', 'Proportional to the square of volume'],
      answer: 1,
      explain: "Boyle's Law: at constant temperature, P ∝ 1/V — compress a gas and its pressure rises proportionally, giving P₁V₁ = P₂V₂."
    })),
    mcq(() => ({
      cg: 'P14-6',
      q: 'The first law of thermodynamics, ΔU = Q − W, is a statement of:',
      opts: ['Conservation of momentum', 'Conservation of energy', 'The second law of motion', 'Conservation of entropy'],
      answer: 1,
      explain: 'ΔU = Q − W says the change in internal energy equals heat added minus work done by the system — energy is conserved, just redistributed between heat, work, and internal energy.'
    })),
    truefalse(() => ({
      cg: 'P14-7',
      q: 'In an adiabatic process, no heat is exchanged with the surroundings (Q = 0).',
      answer: true,
      explain: 'Adiabatic means Q = 0 by definition — any change in internal energy comes entirely from work: ΔU = −W.'
    })),
    mcq(() => ({
      cg: 'P14-8',
      q: 'The Carnot efficiency η = 1 − T_c/T_h represents:',
      opts: [
        'The efficiency of a specific real engine',
        'The maximum possible efficiency of ANY heat engine operating between two temperatures',
        'The minimum efficiency required by law',
        'An efficiency that can reach 100% if T_h is large enough'
      ],
      answer: 1,
      explain: 'The Carnot efficiency is the theoretical upper bound — no real heat engine operating between T_h and T_c can exceed it, and η = 1 only if T_c = 0 K, which is unreachable.'
    }))
  ],

  // ── M10 : Problem-solving heuristics I (Polya) ──
  M10: [
    mcq(() => ({
      cg: 'M10-1',
      q: "Polya's first step in problem-solving is to understand the problem. What three things should you identify?",
      opts: [
        'The title, the author, and the page number',
        'The unknown, the data, and the condition linking them',
        'The difficulty level, the topic, and the time limit',
        'The formula, the units, and the final answer'
      ],
      answer: 1,
      explain: 'Polya\'s Step 1: identify the unknown (what you want), the data (what you\'re given), and the condition (the relationship connecting them) — "a problem well understood is half solved."'
    })),
    truefalse(() => ({
      cg: 'M10-2',
      q: "According to Polya, 'looking back' after solving a problem (checking the result, the reasoning, and whether the method transfers) is an optional final step that can usually be skipped.",
      answer: false,
      explain: 'Polya treats "looking back" as essential, not optional — it\'s where you verify correctness AND extract a reusable method for future problems.'
    })),
    fillblank(() => ({
      cg: 'M10-3',
      q: "In Thompson's 'dodge' for differentiation, after expanding f(x+dx), you discard terms containing (dx) raised to the power of ___ or higher.",
      answer: '2',
      accept: ['2', 'two'],
      explain: 'Terms with (dx)² or higher are treated as negligibly small compared to terms with just dx — this is the core simplification in Thompson\'s method of increments.'
    })),
    mcq(() => ({
      cg: 'M10-4',
      q: 'What is the "working backwards" heuristic?',
      opts: [
        'Redoing a problem you already solved',
        'Starting from the unknown and asking what earlier quantity would determine it, repeating until you reach something known',
        'Solving the problem upside down on paper',
        'Giving up and looking up the answer'
      ],
      answer: 1,
      explain: 'Working backwards starts at the goal and chains backward ("what would give me this?") until it connects to known data — then you reverse direction and solve forward.'
    })),
    mcq(() => ({
      cg: 'M10-5',
      q: 'Why is "draw a figure" considered such a powerful heuristic across physics, optics, and algebra?',
      opts: [
        'It makes the answer automatically correct',
        'It forces you to make knowns, unknowns, and relationships explicit and visible, which often reveals the missing connection',
        'Diagrams are required by exam rules',
        'It replaces the need for any equations'
      ],
      answer: 1,
      explain: 'A figure externalises the structure of the problem — labelling knowns, unknowns, forces, or rays — often revealing relationships that are hard to see in words alone.'
    })),
    truefalse(() => ({
      cg: 'M10-6',
      q: 'The "inventor\'s paradox" observes that a more general/ambitious version of a problem can sometimes be easier to solve than the narrow special case.',
      answer: true,
      explain: 'Polya\'s inventor\'s paradox: the general problem may have more symmetry or invite a standard method, while the special case is messier because it has broken that symmetry.'
    })),
    mcq(() => ({
      cg: 'M10-7',
      q: 'If you are stuck on a problem, one of Polya\'s diagnostic questions is "did you use all the data?" Why is this useful?',
      opts: [
        'It is not useful — extra data is usually irrelevant',
        'An unused number or condition is often exactly the missing equation you need',
        'It tells you the answer directly',
        'It only applies to geometry problems'
      ],
      answer: 1,
      explain: 'If the system seems underdetermined, checking for unused data (explicit numbers or implicit conditions like "starts from rest") often reveals the missing equation.'
    }))
  ],

  // ── M11 : Problem-solving heuristics II ──
  M11: [
    mcq(() => ({
      cg: 'M11-1',
      q: 'Dimensional analysis (testing by dimension) checks an equation by:',
      opts: [
        'Plugging in random numbers',
        'Verifying both sides have identical fundamental dimensions (mass, length, time, etc.)',
        'Counting the number of terms',
        'Checking if the answer is positive'
      ],
      answer: 1,
      explain: 'Both sides of any valid physical equation must have identical dimensions — you cannot add a speed to a force. Mismatched dimensions mean the equation is definitely wrong.'
    })),
    truefalse(() => ({
      cg: 'M11-2',
      q: 'If two physical quantities have matching dimensions, the equation relating them is therefore guaranteed to be correct.',
      answer: false,
      explain: 'Matching dimensions is necessary but not sufficient — a dimensionally consistent equation can still have the wrong numerical constant or structure. It only rules out certain errors.'
    })),
    fillblank(() => ({
      cg: 'M11-3',
      q: 'Proof by contradiction (reductio ad absurdum) works by assuming the ___ of what you want to prove, then deriving a contradiction.',
      answer: 'negation',
      accept: ['negation', 'Negation', 'opposite'],
      explain: 'You assume the negation, reason validly from it, and if you reach a contradiction, the negation must be false — so the original statement must be true.'
    })),
    mcq(() => ({
      cg: 'M11-4',
      q: 'The power rule for differentiation states d(xⁿ)/dx equals:',
      opts: ['xⁿ⁺¹/(n+1)', 'nxⁿ⁻¹', 'n·x', 'xⁿ/n'],
      answer: 1,
      explain: 'The power rule: d(xⁿ)/dx = nxⁿ⁻¹, valid for any real exponent n — the atomic building block of differentiation.'
    })),
    typeanswer(() => {
      const n = pick([3, 4, 5]);
      return {
        cg: 'M11-5',
        q: `Using the power rule, what is the derivative of x^${n} with respect to x, evaluated as the coefficient (i.e., what is n in nx^(n-1))?`,
        answer: n,
        tolerance: 0,
        explain: `d(x^${n})/dx = ${n}x^${n-1} — the power rule simply brings the exponent down as a multiplying coefficient.`
      };
    }),
    mcq(() => ({
      cg: 'M11-6',
      q: 'The chain rule, dy/dx = (dy/du)(du/dx), is used when:',
      opts: [
        'Differentiating a simple polynomial term',
        'You have a function of a function, y = f(g(x))',
        'Adding two functions together',
        'Only when integrating, never when differentiating'
      ],
      answer: 1,
      explain: 'The chain rule handles "nested" functions: differentiate the outer function with respect to the inner, then multiply by the derivative of the inner function.'
    })),
    truefalse(() => ({
      cg: 'M11-7',
      q: 'According to Polya, "problems to find" and "problems to prove" require the same solving strategy.',
      answer: false,
      explain: 'Problems to find work from data toward an unknown quantity; problems to prove work from a hypothesis toward a logical conclusion — different structures, different strategies.'
    })),
    mcq(() => ({
      cg: 'M11-8',
      q: 'A Fermi estimation problem is solved by:',
      opts: [
        'Looking up the exact answer in a table',
        'Breaking the unknown into estimable pieces, rounding aggressively, and combining the estimates',
        'Refusing to answer without exact data',
        'Using only exact, never approximate, arithmetic'
      ],
      answer: 1,
      explain: 'Fermi estimation breaks a hard-to-know quantity into pieces you CAN roughly estimate (each to about one significant figure or order of magnitude), then combines them.'
    }))
  ],

  // ── M12 : Problem-solving — vectors & matrices ──
  M12: [
    mcq(() => ({
      cg: 'M12-1',
      q: 'When you need to find the angle between two vectors, which operation should you reach for?',
      opts: ['Cross product', 'Dot product, via cos θ = (a⃗·b⃗)/(|a||b|)', 'Scalar multiplication', 'Matrix inversion'],
      answer: 1,
      explain: 'The dot product directly relates to the cosine of the angle between vectors — it is the standard tool for finding angles or checking perpendicularity (dot product = 0).'
    })),
    mcq(() => ({
      cg: 'M12-2',
      q: 'A memory anchor for choosing between dot and cross product: "DOT rhymes with hot" (gives a scalar). What does "CROSS" suggest?',
      opts: [
        'It always gives zero',
        'An "X" marking a direction in space — it gives a vector, perpendicular to both inputs',
        'It only works in 2D',
        'It is the same as the dot product'
      ],
      answer: 1,
      explain: 'Cross product gives a VECTOR result (like torque or angular momentum), perpendicular to both input vectors — useful whenever the answer needs to be a direction in space, not just a magnitude.'
    })),
    truefalse(() => ({
      cg: 'M12-3',
      q: 'When choosing coordinate axes for a vector problem, the choice of axes affects the physics, not just the bookkeeping.',
      answer: false,
      explain: 'The axes are purely your choice for convenience (e.g., aligning with the slope) — the physics and the final answer don\'t change, only the components do.'
    })),
    fillblank(() => ({
      cg: 'M12-4',
      q: 'Before attempting to invert a matrix or solve a system uniquely, the heuristic is to first check the ___ — if it is zero, the matrix is singular.',
      answer: 'determinant',
      accept: ['determinant', 'Determinant'],
      explain: 'det(A) = 0 means A is singular: no unique inverse exists, and Ax=b either has no solution or infinitely many.'
    })),
    mcq(() => ({
      cg: 'M12-5',
      q: 'To verify a computed matrix inverse A⁻¹ is correct, what check should you perform?',
      opts: [
        'Check that A⁻¹ has the same entries as A',
        'Multiply A⁻¹A (and AA⁻¹) and confirm both equal the identity matrix I',
        'Check that A⁻¹ is bigger than A',
        'No check is needed if the formula was applied correctly'
      ],
      answer: 1,
      explain: 'The definitive check: A⁻¹A = AA⁻¹ = I. If this doesn\'t hold, the inverse was computed incorrectly somewhere.'
    })),
    truefalse(() => ({
      cg: 'M12-6',
      q: 'Matrix multiplication AB and BA always give the same result, just like ordinary number multiplication.',
      answer: false,
      explain: 'Matrix multiplication is generally NOT commutative — AB ≠ BA. This is a constant source of errors if not checked explicitly, especially when composing transformations.'
    })),
    mcq(() => ({
      cg: 'M12-7',
      q: 'Viewing a 2×2 matrix as a transformation, what do its two columns represent?',
      opts: [
        'Random numbers with no geometric meaning',
        'The images of the standard basis vectors î and ĵ after the transformation',
        'The eigenvalues of the matrix',
        'The rows of the inverse matrix'
      ],
      answer: 1,
      explain: 'For A = [a b; c d], the first column (a,c) is where î = (1,0) ends up, and the second column (b,d) is where ĵ = (0,1) ends up — this is the geometric heart of matrix-as-transformation.'
    }))
  ],

  // ── M13 : Lockhart's algebra — foundations ──
  M13: [
    mcq(() => ({
      cg: 'M13-1',
      q: "Lockhart's 'al-jabr' metaphor describes solving an equation as:",
      opts: [
        'Randomly guessing values until one works',
        'Untangling a knot — undoing operations in reverse order while preserving equality',
        'Memorising a list of unrelated tricks',
        'A purely mechanical process with no creative element'
      ],
      answer: 1,
      explain: '"Al-jabr" (the origin of "algebra") means "the mending of broken bones" — Lockhart frames equation-solving as systematically untangling a knot, the same operation undone in reverse on both sides.'
    })),
    truefalse(() => ({
      cg: 'M13-2',
      q: "In Lockhart's framework, a 'field' is defined by what the elements ARE (e.g., that they must be numbers) rather than how they behave.",
      answer: false,
      explain: 'The opposite is true: a field is defined entirely by STRUCTURE — two operations satisfying nine axioms. What the elements "are" metaphysically is irrelevant; only how they combine matters.'
    })),
    fillblank(() => ({
      cg: 'M13-3',
      q: 'An additive inverse exists for every element in any field by the field axioms, but being "negative" (less than zero) requires the field to also be ___.',
      answer: 'ordered',
      accept: ['ordered', 'Ordered', 'an ordered field'],
      explain: 'Lockhart distinguishes "having an additive inverse" (universal to all fields) from "being negative" (specific to ordered fields like the reals — complex numbers have additive inverses but no order).'
    })),
    mcq(() => ({
      cg: 'M13-4',
      q: 'Why can the complex numbers ℂ not be ordered the way the real numbers ℝ can?',
      opts: [
        'Because ℂ has too many elements',
        'Because there is no way to define a consistent < relation on ℂ that respects the field axioms',
        'Because complex numbers are not really numbers',
        'Because ℂ is a subset of ℝ'
      ],
      answer: 1,
      explain: 'ℂ is algebraically closed but cannot be given an order consistent with its field structure — this is one of the trade-offs in extending from ℝ to ℂ.'
    })),
    mcq(() => ({
      cg: 'M13-5',
      q: 'According to Lockhart\'s "layered" view of the real numbers, which property is logically independent of the algebraic (field) structure?',
      opts: [
        'Order — you can have algebra (like ℂ) without an order relation',
        'Addition',
        'Multiplication',
        'The number 1'
      ],
      answer: 0,
      explain: 'Order is a separate layer from the algebraic structure — ℂ is a field (algebra) with no order; ℚ has order without being complete/continuous. The layers are independent.'
    })),
    truefalse(() => ({
      cg: 'M13-6',
      q: "Lockhart's distinction between 'pedantry' and 'mastery' is that pedantry means applying rules mechanically, while mastery means understanding principles well enough to adapt to novel situations.",
      answer: true,
      explain: 'Pedantry works only for routine, template-matching problems. Mastery comes from understanding WHY a method works, which lets you adapt it when the problem deviates from the template.'
    })),
    mcq(() => ({
      cg: 'M13-7',
      q: "What is Lockhart's central claim about why mathematicians use metaphors and analogies (knots, shadows, ladders)?",
      opts: [
        'Metaphors are purely decorative and could be removed without loss',
        'Humans need imaginative connections to invent and understand proofs — the metaphor is the vehicle that gets you to the formal proof',
        'Mathematical proofs themselves require metaphorical language to be valid',
        'Only beginners need metaphors; experts work in pure symbols'
      ],
      answer: 1,
      explain: '"We make analogies in order to connect two trees with a tightrope" — Lockhart argues metaphor is how humans generate the insight needed to discover and understand proofs, not how proofs are formally validated.'
    }))
  ],

  // ── M14 : Lockhart's algebra — symmetry & roots ──
  M14: [
    mcq(() => ({
      cg: 'M14-1',
      q: "Lockhart's 'finger dance' and 'copy-machine' are kinesthetic/visual metaphors for which two fraction operations?",
      opts: ['Addition and subtraction', 'Addition and multiplication', 'Squaring and rooting', 'Rounding and estimating'],
      answer: 1,
      explain: 'The "finger dance" (criss-cross snapping) is for fraction addition a/b + c/d; the "copy-machine" (enlarge/shrink) is for fraction multiplication a/b × c/d.'
    })),
    truefalse(() => ({
      cg: 'M14-2',
      q: 'The Greek discovery that √2 cannot be written as a fraction (the commensurability crisis) showed that the rational numbers ℚ are too small to fully describe geometry.',
      answer: true,
      explain: 'The diagonal of a unit square is incommensurable with its side — no fraction equals √2 — revealing that ℚ has "gaps" that geometry needs the real numbers ℝ to fill.'
    })),
    fillblank(() => ({
      cg: 'M14-3',
      q: "The Euclidean algorithm finds the GCD of two numbers by repeated division with ___.",
      answer: 'remainder',
      accept: ['remainder', 'Remainder'],
      explain: 'Each step divides the larger number by the smaller and keeps the remainder, replacing the pair with a smaller pair that has the same GCD — repeating until the remainder is zero.'
    })),
    mcq(() => ({
      cg: 'M14-4',
      q: "What is the key distinction Lockhart draws between 'irreducible' and 'prime' elements?",
      opts: [
        'They are exactly the same thing in every number system',
        'Irreducible means it cannot be factored further; prime means it divides a product only if it divides one of the factors — these coincide in ℤ but not in every domain',
        'Prime numbers are always larger than irreducible numbers',
        'Irreducibility only applies to even numbers'
      ],
      answer: 1,
      explain: 'In ℤ, irreducible and prime coincide, but in other domains (like ℤ[√−5]) they diverge — 6 = 2×3 = (1+√−5)(1−√−5), where all four factors are irreducible but none is prime, breaking unique factorisation.'
    })),
    mcq(() => ({
      cg: 'M14-5',
      q: "In Lockhart's 'shadows on the wall' metaphor for modular arithmetic, what does ℤₙ represent?",
      opts: [
        'A completely unrelated number system',
        'A "shadow" of ℤ that preserves arithmetic structure (addition/multiplication relationships) while blurring distinctions between elements',
        'The set of all negative integers',
        'A system with no connection to divisibility'
      ],
      answer: 1,
      explain: '"Turning on the n light" casts ℤ\'s shadow onto ℤₙ — true arithmetic statements in ℤ remain true mod n, even though individual numbers become indistinguishable within their residue class.'
    })),
    truefalse(() => ({
      cg: 'M14-6',
      q: "Lockhart constructs the complex numbers ℂ by taking real polynomials ℝ[X] and treating X² + 1 as zero — no mysterious external 'imaginary number' is needed.",
      answer: true,
      explain: 'ℝ[X]/(X²+1) ≅ ℂ: every polynomial collapses to a+bX where X plays the role of i, built entirely from real polynomials with no external magic ingredient required.'
    })),
    mcq(() => ({
      cg: 'M14-7',
      q: "Lockhart's 'selling the cow for magic beans' metaphor describes the move of factoring x² − Px + Q = (x−a)(x−b) and matching coefficients. Why is this a good trade despite introducing more unknowns?",
      opts: [
        'It isn\'t a good trade — it just makes things more complicated',
        'The new system (a+b=P, ab=Q) is symmetric in a and b, and that symmetry can be exploited to solve for the roots',
        'It eliminates the need for a quadratic formula entirely',
        'It only works for equations with no real roots'
      ],
      answer: 1,
      explain: 'Trading one "lifeless" equation for a symmetric system in a and b gives you something to act on: the swap symmetry a↔b is what lets you extract a−b = ±√(P²−4Q), deriving the quadratic formula from symmetry alone.'
    })),
    mcq(() => ({
      cg: 'M14-8',
      q: 'Why does squaring the antisymmetric part ½(a−b) produce something symmetric?',
      opts: [
        'It is a coincidence with no deeper reason',
        'Because a number and its negative have the same square — swapping a and b negates (a−b), but (a−b)² is unaffected by that sign flip',
        'Because squaring always produces a smaller number',
        'Because a and b must be equal'
      ],
      answer: 1,
      explain: '(a−b) flips sign under the swap a↔b (antisymmetric), but (a−b)² does not, since (−x)² = x² — this is exactly the structural fact that lets the discriminant be expressed in terms of the symmetric P and Q.'
    }))
  ],

  // ── P15 : Gravitation & orbits ──
  P15: [
    mcq(() => ({
      cg: 'P15-1',
      q: "Newton's law of universal gravitation states the force between two point masses is:",
      opts: ['Proportional to r²', 'Proportional to 1/r (inverse, not squared)', 'Proportional to 1/r² (inverse-square)', 'Independent of distance'],
      answer: 2,
      explain: 'F = Gm₁m₂/r² — doubling the distance quarters the force, tripling reduces it to one-ninth. This inverse-square law is the same mathematical form as Coulomb\'s law.'
    })),
    truefalse(() => ({
      cg: 'P15-2',
      q: 'Mass and weight are the same thing, just measured in different units.',
      answer: false,
      explain: 'Mass (kg) is intrinsic and invariant. Weight (N) = mg is the gravitational force on that mass, and depends on location — an object\'s weight changes on the Moon, but its mass doesn\'t.'
    })),
    typeanswer(() => {
      const h = pick([1, 2, 5]);
      const R = 6371;
      const factor = 1 - 2 * h / R;
      return {
        cg: 'P15-3',
        q: `Using the approximation g(h) ≈ g₀(1 − 2h/R), with R = 6371 km and h = ${h} km, what fraction of g₀ is g(h)? (give to 4 decimal places, e.g. 0.9990)`,
        answer: Math.round(factor * 10000) / 10000,
        tolerance: 0.0005,
        explain: `g(h)/g₀ ≈ 1 − 2(${h})/6371 = 1 − ${(2*h/R).toFixed(4)} = ${Math.round(factor*10000)/10000}.`
      };
    }),
    mcq(() => ({
      cg: 'P15-4',
      q: 'Why does the gravitational force inside a uniform spherical shell equal zero (the shell theorem)?',
      opts: [
        'Because gravity does not exist inside shells',
        'Because contributions from all parts of the shell cancel out by symmetry',
        'Because the shell has no mass',
        'This is false — the force is actually maximum at the centre'
      ],
      answer: 1,
      explain: 'Newton\'s shell theorem: inside a uniform spherical shell, the gravitational pulls from all directions cancel exactly, giving zero net force — only mass at smaller radius than your position contributes to g inside a solid sphere.'
    })),
    mcq(() => ({
      cg: 'P15-5',
      q: 'Escape velocity from a planet depends on:',
      opts: [
        'The mass of the escaping object and the planet\'s mass',
        'Only the planet\'s mass and radius (not the escaping object\'s mass)',
        'Only the escaping object\'s mass',
        'The direction of launch only'
      ],
      answer: 1,
      explain: 'v_e = √(2GM/R) involves only the planet\'s mass M and radius R — the escaping object\'s own mass cancels out of the energy balance ½mv_e² = GMm/R.'
    })),
    fillblank(() => ({
      cg: 'P15-6',
      q: "Kepler's Second Law (equal areas in equal times) is a direct consequence of conservation of ___.",
      answer: 'angular momentum',
      accept: ['angular momentum', 'Angular momentum', 'angular momentum.'],
      explain: 'Since gravity is a central force (always directed at the Sun), it produces zero torque about the Sun, so angular momentum L = mr²ω is conserved — which directly gives constant areal velocity.'
    })),
    mcq(() => ({
      cg: 'P15-7',
      q: "Kepler's Third Law states T² ∝ a³. What determines the proportionality constant?",
      opts: [
        'The mass of the orbiting planet only',
        'The mass of the central body (e.g., the Sun) and G',
        'The eccentricity of the orbit',
        'Nothing — the constant is universal for all systems'
      ],
      answer: 1,
      explain: 'T² = (4π²/GM)a³ — the constant depends on G and the central mass M, which is why every planet in the Solar System shares the same T²/a³ ratio (same central Sun).'
    })),
    truefalse(() => ({
      cg: 'P15-8',
      q: 'A satellite orbiting closer to a planet moves faster than one orbiting farther away.',
      answer: true,
      explain: 'v_orb = √(GM/r) — orbital speed decreases as orbital radius increases. Counterintuitively, to move to a higher (slower) orbit, you must first speed up to climb there.'
    })),
    mcq(() => ({
      cg: 'P15-9',
      q: 'An astronaut in orbit feels weightless. What is the real reason for this?',
      opts: [
        'There is no gravity in orbit',
        'The astronaut and spacecraft are both in continuous free fall around Earth, so there is no normal force to feel',
        'The spacecraft blocks gravity',
        'The astronaut\'s mass becomes zero in space'
      ],
      answer: 1,
      explain: 'Gravity at orbital altitude is still nearly as strong as at the surface. Weightlessness occurs because the spacecraft and everything inside it accelerate at the same rate g, so there\'s no contact force pressing them together — true free fall, not absence of gravity.'
    }))
  ],

  // ── P16 : Heat transfer — conduction, convection, radiation ──
  P16: [
    mcq(() => ({
      cg: 'P16-1',
      q: "Fourier's law of conduction says the rate of heat flow through a slab is proportional to:",
      opts: [
        'The volume of the slab',
        'The cross-sectional area and the temperature gradient',
        'The colour of the slab only',
        'The time elapsed only'
      ],
      answer: 1,
      explain: 'H = kA(T₁−T₂)/L — heat current is proportional to area A and the temperature difference, and inversely proportional to thickness L, scaled by the material\'s thermal conductivity k.'
    })),
    truefalse(() => ({
      cg: 'P16-2',
      q: 'Metals generally have high thermal conductivity because heat is carried efficiently by free electrons.',
      answer: true,
      explain: 'In metals, the same free electrons responsible for electrical conductivity also transport thermal energy efficiently — about 95% of heat conduction in metals is electronic, not lattice vibration.'
    })),
    typeanswer(() => {
      const k = pick([0.5, 1, 2]), A = 2, dT = pick([20, 30, 50]), L = pick([0.1, 0.2]);
      const H = k * A * dT / L;
      return {
        cg: 'P16-3',
        q: `Using H = kA(ΔT)/L with k = ${k} W/(m·K), A = ${A} m², ΔT = ${dT} K, L = ${L} m, what is the heat current H (W)?`,
        answer: H,
        tolerance: 0.5,
        explain: `H = ${k} × ${A} × ${dT} / ${L} = ${H} W.`
      };
    }),
    mcq(() => ({
      cg: 'P16-4',
      q: 'For thermal resistances arranged in series (like layers of a wall), the equivalent resistance is found by:',
      opts: [
        'Adding the resistances: R_eq = R₁ + R₂ + ...',
        'Adding the reciprocals: 1/R_eq = 1/R₁ + 1/R₂ + ...',
        'Multiplying the resistances',
        'Taking the average'
      ],
      answer: 0,
      explain: 'Series thermal resistances add directly (same heat current flows through each layer) — exactly analogous to series electrical resistors. Parallel paths use the reciprocal-sum rule instead.'
    })),
    truefalse(() => ({
      cg: 'P16-5',
      q: 'Convection requires the bulk movement of a fluid, unlike conduction which can occur in a stationary solid.',
      answer: true,
      explain: 'Convection transports heat via moving fluid (natural, driven by buoyancy, or forced, driven by a fan/pump) — it fundamentally requires fluid motion, unlike conduction which works through a stationary medium.'
    })),
    mcq(() => ({
      cg: 'P16-6',
      q: "Newton's law of cooling predicts that an object's temperature approaches ambient temperature:",
      opts: ['Linearly with time', 'Exponentially with time', 'Not at all — temperature stays constant', 'Instantaneously'],
      answer: 1,
      explain: 'T(t) = T_s + (T₀−T_s)e^(−kt) — an exponential decay toward the ambient temperature T_s, valid when the rate of heat loss is proportional to the temperature difference.'
    })),
    fillblank(() => ({
      cg: 'P16-7',
      q: 'The Stefan-Boltzmann law states that the power radiated per unit area by a black body is proportional to T raised to the power of ___.',
      answer: '4',
      accept: ['4', 'four', 'fourth'],
      explain: 'P/A = σT⁴ — radiated power depends on the FOURTH power of absolute temperature, which is why even modest temperature increases dramatically increase radiated power.'
    })),
    mcq(() => ({
      cg: 'P16-8',
      q: "Kirchhoff's law of radiation states that, at thermal equilibrium, a material's absorptivity and emissivity are:",
      opts: ['Always different', 'Equal at every wavelength', 'Unrelated to each other', 'Both equal to zero'],
      answer: 1,
      explain: 'α(λ) = ε(λ) — a good absorber at a given wavelength is necessarily a good emitter at that same wavelength, a consequence of the second law of thermodynamics.'
    })),
    truefalse(() => ({
      cg: 'P16-9',
      q: "The natural greenhouse effect (without any human influence) keeps Earth's surface about 33°C warmer than it would otherwise be.",
      answer: true,
      explain: "Without greenhouse gases, Earth's effective radiating temperature would be about 255 K (−18°C); the actual average surface temperature is ~288 K (+15°C) — a 33°C difference from selective absorption/re-emission of infrared by atmospheric gases."
    })),
    mcq(() => ({
      cg: 'P16-10',
      q: 'A vacuum (thermos) flask minimises heat loss by all three mechanisms. How does it block radiation specifically?',
      opts: [
        'It cannot block radiation at all',
        'Low-emissivity reflective coatings on the vacuum-facing surfaces',
        'By using a thick layer of metal',
        'By keeping the contents under high pressure'
      ],
      answer: 1,
      explain: 'The vacuum eliminates conduction and convection (no medium between the walls); reflective, low-emissivity coatings minimise radiative transfer across that vacuum gap.'
    }))
  ],

  // ── P17 : Magnetism & electromagnetic induction ──
  P17: [
    mcq(() => ({
      cg: 'P17-1',
      q: 'The magnetic force on a moving charge, F = qv × B, has what key property regarding work done?',
      opts: [
        'It always does positive work, speeding the charge up',
        'It does zero work, since it is always perpendicular to the velocity',
        'It does negative work, always slowing the charge down',
        'It does work proportional to the charge\'s mass'
      ],
      answer: 1,
      explain: 'F_B = qv×B is always perpendicular to v, so F⃗·v⃗ = 0 — the magnetic force can change a particle\'s direction but never its speed or kinetic energy.'
    })),
    typeanswer(() => {
      const m = pick([2,4,8]), B = pick([0.5,1,2]);
      const q = 1;
      const period = (2 * Math.PI * m) / (q * B);
      return {
        cg: 'P17-2',
        q: `For a charged particle (q=1, arbitrary units) of mass ${m} kg in a uniform field B = ${B} T, using T = 2πm/(qB), what is the cyclotron period (in seconds, to 2 decimals)? Note this is independent of speed.`,
        answer: Math.round(period * 100) / 100,
        tolerance: 0.05,
        explain: `T = 2π(${m})/(1×${B}) = ${Math.round(period*100)/100} s — independent of the particle's speed or orbit radius.`
      };
    }),
    mcq(() => ({
      cg: 'P17-3',
      q: 'In a velocity selector (crossed E and B fields), only particles with a specific velocity pass straight through. That velocity is:',
      opts: ['v = E × B', 'v = E/B', 'v = B/E', 'v = E + B'],
      answer: 1,
      explain: 'The electric and magnetic forces balance exactly when qE = qvB, giving v = E/B — independent of the particle\'s charge or mass, so it selects purely by speed.'
    })),
    truefalse(() => ({
      cg: 'P17-4',
      q: 'The force on a current-carrying wire in a magnetic field depends on the current, the field strength, and the angle between the wire and the field.',
      answer: true,
      explain: 'F = BIL sin θ — the force depends on B, current I, length L, and sin θ where θ is the angle between the wire and B; the force is zero when the wire is parallel to B.'
    })),
    mcq(() => ({
      cg: 'P17-5',
      q: 'The torque on a current loop in a magnetic field, τ = m × B, is maximised when:',
      opts: [
        'The magnetic moment m is parallel to B',
        'The magnetic moment m is perpendicular to B',
        'The current is zero',
        'The loop has no area'
      ],
      answer: 1,
      explain: 'τ = mB sin θ is maximum at θ = 90° (m perpendicular to B) and zero when m is aligned with B (θ=0, stable equilibrium) or anti-aligned (θ=180°, unstable equilibrium).'
    })),
    fillblank(() => ({
      cg: 'P17-6',
      q: 'The magnetic field from a long straight wire falls off as 1/r, while the field from a magnetic dipole (bar magnet) falls off as 1/r raised to the power ___.',
      answer: '3',
      accept: ['3', 'three', 'cubed'],
      explain: 'A long wire is essentially an infinite line source, giving B ∝ 1/r. A dipole\'s two opposite poles partially cancel at a distance, giving a steeper 1/r³ falloff.'
    })),
    mcq(() => ({
      cg: 'P17-7',
      q: "Inside an ideal long solenoid carrying current I with n turns per unit length, the magnetic field B is:",
      opts: ['Zero everywhere inside', 'Uniform: B = μ₀nI', 'Strongest at the ends, weakest in the middle', 'Equal to the field outside the solenoid'],
      answer: 1,
      explain: 'B = μ₀nI is uniform throughout the interior of an ideal (long, tightly-wound) solenoid — contributions from all the turns combine to cancel radial variation, while the field outside is essentially zero.'
    })),
    truefalse(() => ({
      cg: 'P17-8',
      q: 'Diamagnetism is present in all materials, including those with no unpaired electrons, while paramagnetism and ferromagnetism require unpaired electron spins.',
      answer: true,
      explain: 'Diamagnetism arises from Lenz\'s-law-like response of orbiting electrons and is universal. Paramagnetism and ferromagnetism additionally require unpaired electron spins that can align with an external field.'
    })),
    mcq(() => ({
      cg: 'P17-9',
      q: "Faraday's law states that the induced EMF in a loop equals:",
      opts: [
        'The magnetic flux through the loop',
        'The negative rate of change of magnetic flux through the loop',
        'The current in the loop',
        'Zero, always'
      ],
      answer: 1,
      explain: 'ε = −dΦ/dt (or −N dΦ/dt for N turns) — only a CHANGING flux induces an EMF; a steady flux, no matter how large, induces nothing.'
    })),
    mcq(() => ({
      cg: 'P17-10',
      q: "Lenz's law (the minus sign in Faraday's law) exists because:",
      opts: [
        'It is just a mathematical convention with no physical meaning',
        'Without it, induced currents would reinforce the flux change, creating a runaway energy-from-nothing feedback loop',
        'It only matters for AC circuits',
        'It describes the direction of conventional current flow only'
      ],
      answer: 1,
      explain: 'If the induced current reinforced (rather than opposed) the flux change, you\'d get unbounded positive feedback — a violation of energy conservation. The minus sign in Faraday\'s law enforces opposition, consistent with energy conservation.'
    })),
    typeanswer(() => {
      const L = pick([2,4,5]), I = pick([3,6,10]);
      const U = 0.5 * L * I * I;
      return {
        cg: 'P17-11',
        q: `Using U = ½LI² with L = ${L} H and I = ${I} A, what is the energy stored in the inductor (J)?`,
        answer: U,
        tolerance: 0.5,
        explain: `U = ½ × ${L} × ${I}² = ½ × ${L} × ${I*I} = ${U} J.`
      };
    }),
    truefalse(() => ({
      cg: 'P17-12',
      q: 'Eddy currents are deliberately exploited in induction cooktops, but considered wasteful losses in transformer cores (which is why those cores are laminated).',
      answer: true,
      explain: 'The same physical phenomenon — circulating currents induced by changing flux in a bulk conductor — is useful for induction heating but a source of energy loss (heat) in transformer cores, where lamination interrupts the current paths to reduce that loss.'
    }))
  ],

  // ── M15 : Calculus — differentiation ──
  M15: [
    mcq(() => ({
      cg: 'M15-1',
      q: 'The derivative f\'(x) is defined as the limit of which quantity as h → 0?',
      opts: ['f(x+h) + f(x)', '[f(x+h) − f(x)]/h', 'f(x+h) × f(x)', 'f(x)/h'],
      answer: 1,
      explain: "f'(x) = lim(h→0) [f(x+h)−f(x)]/h — the limit of the slope of secant lines as the interval shrinks to zero, giving the slope of the tangent at that point."
    })),
    typeanswer(() => {
      const n = pick([3, 4, 5, 6]);
      return {
        cg: 'M15-2',
        q: `Using the power rule d/dx[xⁿ] = nxⁿ⁻¹, what is the coefficient n in the derivative of x^${n}?`,
        answer: n,
        tolerance: 0,
        explain: `d(x^${n})/dx = ${n}x^${n-1} — the power rule brings the exponent down as the multiplying coefficient.`
      };
    }),
    mcq(() => ({
      cg: 'M15-3',
      q: 'The product rule for (uv)\' states:',
      opts: ["(uv)' = u'v'", "(uv)' = u'v + uv'", "(uv)' = u'v − uv'", "(uv)' = uv' only"],
      answer: 1,
      explain: "(uv)' = u'v + uv' — \"first d-second plus second d-first.\" Derived from the increment method: the cross term containing du·dv is negligible and dropped."
    })),
    truefalse(() => ({
      cg: 'M15-4',
      q: 'The quotient rule and the chain rule are independent — the quotient rule cannot be derived from the product rule and chain rule together.',
      answer: false,
      explain: "The quotient rule CAN be derived from the product rule plus chain rule: writing u/v = u·v⁻¹ and differentiating gives u'v⁻¹ + u(−1)v⁻²v' = (u'v−uv')/v² — exactly the quotient rule."
    })),
    mcq(() => ({
      cg: 'M15-5',
      q: 'The chain rule dy/dx = (dy/du)(du/dx) is used when:',
      opts: [
        'Differentiating a simple polynomial term',
        'You have a composite function, y = f(g(x))',
        'Adding two derivatives together',
        'Only when integrating'
      ],
      answer: 1,
      explain: 'The chain rule handles nested ("function of a function") expressions — differentiate the outer function with respect to the inner, then multiply by the derivative of the inner function.'
    })),
    fillblank(() => ({
      cg: 'M15-6',
      q: 'd/dx[eˣ] = ___ — this function is famous for being its own derivative.',
      answer: 'eˣ',
      accept: ['eˣ', 'e^x', 'ex'],
      explain: 'eˣ is the unique function (up to scaling) that equals its own derivative — the defining property of the exponential constant e.'
    })),
    mcq(() => ({
      cg: 'M15-7',
      q: 'At a local maximum of a smooth function, what do we know about f\'(x) and f\'\'(x)?',
      opts: [
        "f'(x) = 0 and f''(x) < 0",
        "f'(x) ≠ 0 and f''(x) > 0",
        "f'(x) = 0 and f''(x) > 0",
        "Neither derivative gives any information"
      ],
      answer: 0,
      explain: "At a local max, the tangent is horizontal (f'(x)=0, a stationary point) and the curve bends downward there (f''(x)<0) — the second derivative test."
    })),
    truefalse(() => ({
      cg: 'M15-8',
      q: 'Trigonometric derivatives like d/dx[sin x] = cos x are only valid when x is measured in radians.',
      answer: true,
      explain: 'In degrees, every trig derivative would carry an extra factor of π/180 — radians are the natural unit for calculus precisely because they make these derivatives clean.'
    })),
    mcq(() => ({
      cg: 'M15-9',
      q: "L'Hôpital's rule is used to evaluate limits that have which indeterminate form(s)?",
      opts: ['Only 0/0', 'Only ∞/∞', '0/0 and ∞/∞ (directly; others after algebraic manipulation)', 'Any limit whatsoever, with no restrictions'],
      answer: 2,
      explain: "L'Hôpital's rule applies directly to 0/0 and ∞/∞. Other indeterminate forms (0·∞, ∞−∞, 0⁰, 1^∞) must first be algebraically rearranged into one of those two forms."
    })),
    mcq(() => ({
      cg: 'M15-10',
      q: 'Implicit differentiation is used when:',
      opts: [
        'y is given explicitly as y = f(x)',
        'y is defined by an equation F(x,y) = 0 that can\'t easily be solved for y',
        'There is no y in the equation at all',
        'Only constants are involved'
      ],
      answer: 1,
      explain: 'Implicit differentiation differentiates both sides of F(x,y)=0 with respect to x, applying the chain rule to any term containing y, then solves algebraically for dy/dx.'
    }))
  ],

  // ── M16 : Calculus — integration ──
  M16: [
    mcq(() => ({
      cg: 'M16-1',
      q: 'The indefinite integral ∫ f(x) dx = F(x) + C represents:',
      opts: [
        'A single unique function',
        'An entire family of antiderivatives, differing by a constant',
        'The area under the curve only',
        'The derivative of f(x)'
      ],
      answer: 1,
      explain: 'Since the derivative of any constant is zero, infinitely many functions share the same derivative f(x) — the +C captures that entire family.'
    })),
    typeanswer(() => {
      const n = pick([2, 3, 4]);
      return {
        cg: 'M16-2',
        q: `Using ∫xⁿ dx = xⁿ⁺¹/(n+1) + C, what is the denominator (n+1) when integrating x^${n}?`,
        answer: n + 1,
        tolerance: 0,
        explain: `∫x^${n} dx = x^${n+1}/${n+1} + C.`
      };
    }),
    mcq(() => ({
      cg: 'M16-3',
      q: 'The Fundamental Theorem of Calculus (part 2) states that ∫[a,b] f(x) dx equals:',
      opts: ['F(a) − F(b)', 'F(b) − F(a), where F is any antiderivative of f', 'f(b) − f(a)', 'F(b) + F(a)'],
      answer: 1,
      explain: 'FTC 2: the definite integral equals the net change in any antiderivative, F(b)−F(a) — this is what makes definite integrals computable without summing infinitely many rectangles directly.'
    })),
    truefalse(() => ({
      cg: 'M16-4',
      q: 'Integration by substitution (u-substitution) is essentially the chain rule used in reverse.',
      answer: true,
      explain: '∫f(g(x))g\'(x)dx = ∫f(u)du with u=g(x) — exactly undoing what the chain rule does when differentiating a composite function.'
    })),
    mcq(() => ({
      cg: 'M16-5',
      q: 'The LIATE rule helps decide which factor to call "u" in integration by parts. What does it prioritize?',
      opts: [
        'Always pick the simplest-looking factor',
        'Logarithmic, then Inverse trig, then Algebraic, then Trigonometric, then Exponential — pick u from the highest-priority category present',
        'Always pick whichever factor comes first in the integral',
        'Pick u and dv at random and try both'
      ],
      answer: 1,
      explain: 'LIATE works because logs and inverse trig simplify dramatically when differentiated, while exponentials and trig functions barely change — making the "new" integral after one application of parts simpler, not harder.'
    })),
    fillblank(() => ({
      cg: 'M16-6',
      q: 'For the disk method computing a volume of revolution, the formula is V = π∫[R(x)² − r(x)²] dx, where each slice is treated as a thin ___.',
      answer: 'disk',
      accept: ['disk', 'disc', 'washer'],
      explain: 'The disk (or washer, if hollow) method sums up the volumes of infinitesimally thin disks perpendicular to the axis of rotation.'
    })),
    mcq(() => ({
      cg: 'M16-7',
      q: 'An improper integral ∫[a,∞] f(x) dx is said to "converge" when:',
      opts: [
        'The function f(x) is always positive',
        'The limit of the partial integral as the upper bound → ∞ exists and is finite',
        'f(x) reaches zero at some finite point',
        'The integral can be computed using the power rule'
      ],
      answer: 1,
      explain: 'Convergence means lim(t→∞) ∫[a,t] f(x)dx exists and is a finite number — if that limit is infinite or doesn\'t exist, the integral diverges.'
    })),
    mcq(() => ({
      cg: 'M16-8',
      q: 'Why does computing arc length using ds = √(dx² + dy²) typically lead to integrals that are very hard to evaluate?',
      opts: [
        'Arc length integrals are always trivial to solve',
        'The square root in the integrand rarely simplifies into an elementary antiderivative, except for special cases like lines and circles',
        'Arc length cannot be computed with calculus at all',
        'The formula is wrong'
      ],
      answer: 1,
      explain: 'The square root of a sum of squared derivatives resists elementary integration techniques in most cases — arc length problems are a classic source of integrals requiring numerical methods.'
    })),
    truefalse(() => ({
      cg: 'M16-9',
      q: 'When finding the area between two curves f(x) and g(x), you should always integrate f(x) − g(x) without checking which curve is on top.',
      answer: false,
      explain: 'You must determine which function is larger on each subinterval (test a point) and integrate (top − bottom); if the curves cross, you must split the interval at each crossing point and recheck.'
    }))
  ],

  // ── P18 : Calculus in physics — differentiation applications ──
  P18: [
    mcq(() => ({
      cg: 'P18-1',
      q: 'Velocity is the derivative of position with respect to time. What is acceleration?',
      opts: ['The derivative of position', 'The derivative of velocity (the second derivative of position)', 'The integral of velocity', 'The same thing as velocity'],
      answer: 1,
      explain: 'a = dv/dt = d²s/dt² — acceleration is the rate of change of velocity, i.e. the second derivative of position with respect to time.'
    })),
    truefalse(() => ({
      cg: 'P18-2',
      q: 'The SUVAT equations are exact for any acceleration, constant or variable.',
      answer: false,
      explain: 'The SUVAT equations are derived by integrating a = dv/dt assuming a is CONSTANT. For variable acceleration, you must integrate the actual a(t) function directly.'
    })),
    mcq(() => ({
      cg: 'P18-3',
      q: 'Maximum range for a projectile launched on level ground occurs at a launch angle of:',
      opts: ['30°', '45°', '60°', '90°'],
      answer: 1,
      explain: 'R(θ) = u²sin(2θ)/g is maximised when sin(2θ)=1, i.e. 2θ=90°, so θ=45° — found by setting dR/dθ=0.'
    })),
    mcq(() => ({
      cg: 'P18-4',
      q: "Newton's second law, m(d²x/dt²) = F, is described as a differential equation because:",
      opts: [
        'It contains no derivatives at all',
        'It relates a function (position) to its own derivatives, and solving it means finding that function',
        'It can only be solved by guessing',
        'F must always be zero'
      ],
      answer: 1,
      explain: "F=ma is a second-order ODE relating x(t) to its derivatives. \"Solving Newton's equations\" means integrating this ODE — given the force law and initial position/velocity — to find x(t)."
    })),
    fillblank(() => ({
      cg: 'P18-5',
      q: "Fermat's principle states that light follows the path that minimises ___, which leads directly to Snell's law.",
      answer: 'time',
      accept: ['time', 'travel time'],
      explain: "Fermat's principle of least time, when treated as a calculus optimisation problem, yields Snell's law n₁sinθ₁ = n₂sinθ₂ as the condition for minimum travel time."
    })),
    mcq(() => ({
      cg: 'P18-6',
      q: 'In a "related rates" problem (e.g., a ladder sliding down a wall), the key technique is:',
      opts: [
        'Solving the constraint equation for each variable separately',
        'Differentiating the constraint equation that links the variables, with respect to time, using the chain rule',
        'Ignoring the constraint entirely',
        'Only algebra, no calculus'
      ],
      answer: 1,
      explain: 'Related rates problems differentiate a geometric or physical constraint equation implicitly with respect to time, then substitute known values to solve for the unknown rate.'
    })),
    truefalse(() => ({
      cg: 'P18-7',
      q: 'In a capacitor, the current I = C dV/dt means current flows only while the voltage across the capacitor is changing.',
      answer: true,
      explain: 'I = C dV/dt — if V is constant (steady state DC), dV/dt = 0 and no current flows through an ideal capacitor; current only flows during charging/discharging when voltage is changing.'
    })),
    mcq(() => ({
      cg: 'P18-8',
      q: "Differentiating sin(ωt) with respect to time produces ωcos(ωt). In AC circuit terms, this represents:",
      opts: [
        'No change at all',
        'A 90° phase advance',
        'A 180° phase reversal',
        'A doubling of frequency'
      ],
      answer: 1,
      explain: 'cos(ωt) = sin(ωt + 90°) — differentiation introduces a 90° phase ADVANCE, which is the calculus origin of capacitive/inductive reactance phase shifts in AC circuits.'
    }))
  ],

  // ── P19 : Calculus in physics — integration applications ──
  P19: [
    mcq(() => ({
      cg: 'P19-1',
      q: 'Velocity is recovered from acceleration via v(t) = v₀ + ∫a(τ)dτ. What does this integral represent graphically?',
      opts: [
        'The slope of the acceleration-time graph',
        'The area under the acceleration-time graph',
        'The y-intercept of the velocity graph',
        'Nothing physical'
      ],
      answer: 1,
      explain: 'The change in velocity equals the signed area under the a(t) curve — each thin rectangle a(τ)Δτ contributes a small change in velocity, and integration sums them all.'
    })),
    mcq(() => ({
      cg: 'P19-2',
      q: 'The work done by a variable force is W = ∫F(x)dx. The work-energy theorem then says this work equals:',
      opts: ['The total momentum', 'The change in kinetic energy, ΔKE', 'The change in mass', 'Zero, always'],
      answer: 1,
      explain: 'W_net = ΔKE = ½mv_f² − ½mv_i² — the work-energy theorem links the force integral directly to the change in kinetic energy.'
    })),
    truefalse(() => ({
      cg: 'P19-3',
      q: 'Impulse J = ∫F(t)dt is useful in collision analysis because you only need the total area under the F-t curve, not the exact shape of the force profile.',
      answer: true,
      explain: 'Impulse-momentum theorem: J = Δp. Since J is just the area under F(t), you can find the momentum change without knowing the precise (often complicated) shape of the collision force over time.'
    })),
    mcq(() => ({
      cg: 'P19-4',
      q: 'The centre of mass of a continuous body is found using x_cm = (1/M)∫x dm. What does this formula represent?',
      opts: [
        'The geometric centre regardless of mass distribution',
        'A mass-weighted average position',
        'The point of maximum density',
        'An arbitrary reference point'
      ],
      answer: 1,
      explain: 'x_cm is the mass-weighted average of position — integrating x×dm over the whole body and dividing by total mass M, generalising the discrete weighted-average formula to continuous distributions.'
    })),
    typeanswer(() => {
      const M = pick([2, 4, 6]), R = pick([0.5, 1]);
      const I = 0.5 * M * R * R;
      return {
        cg: 'P19-5',
        q: `Using I = ½MR² for a solid disk of mass ${M} kg and radius ${R} m, what is the moment of inertia (kg·m²)?`,
        answer: Math.round(I * 1000) / 1000,
        tolerance: 0.01,
        explain: `I = ½ × ${M} × ${R}² = ${Math.round(I*1000)/1000} kg·m² — this formula itself comes from integrating I=∫r²dm over the disk.`
      };
    }),
    mcq(() => ({
      cg: 'P19-6',
      q: 'The centre of pressure on a submerged vertical surface lies below the centroid because:',
      opts: [
        'Pressure is uniform with depth',
        'The centre of pressure formula weights by h² (second moment), while the centroid is weighted by h (first moment) — deeper regions, with higher pressure, pull the effective centre downward',
        'Water pressure decreases with depth',
        'There is no relationship between the two points'
      ],
      answer: 1,
      explain: 'h_cp = (∫h²dA)/(∫h dA) — the h² weighting in the numerator means deeper (higher-pressure) regions contribute disproportionately, pulling the centre of pressure below the simple area centroid.'
    })),
    truefalse(() => ({
      cg: 'P19-7',
      q: 'Computing the electric potential V from a charge distribution via integration is generally easier than computing the electric field E directly, because V is a scalar while E is a vector.',
      answer: true,
      explain: 'V = k∫dq/r involves only scalar addition (superposition of potentials), whereas E⃗ = ∫k dq r̂/r² requires vector addition — V is then differentiated (E⃗=−∇V) to recover the field, often simpler overall.'
    })),
    mcq(() => ({
      cg: 'P19-8',
      q: 'Energy from a time-varying power signal is found via E = ∫P(t)dt. What does this represent?',
      opts: [
        'The instantaneous power at one moment',
        'The accumulated total energy, i.e. the area under the power-time curve',
        'The average power only',
        'The rate of change of energy'
      ],
      answer: 1,
      explain: 'Energy is the time-integral of power — the area under the P-t curve — converting an instantaneous rate (power, J/s) into an accumulated quantity (energy, J).'
    })),
    mcq(() => ({
      cg: 'P19-9',
      q: "Maxwell's equations and Newton's second law can each be written in both differential and integral form. What is the relationship between these two forms?",
      opts: [
        'They describe completely different physical laws',
        'They are equivalent — the differential form describes behavior at a point, the integral form describes behavior over a region, linked by the Fundamental Theorem of Calculus (or its generalisations)',
        'Only the differential form is physically correct',
        'The integral form is just an approximation'
      ],
      answer: 1,
      explain: 'F=dp/dt (differential) and J=∫Fdt=Δp (integral) are the same physical law in two equivalent forms — the same duality appears throughout physics via the Fundamental Theorem of Calculus and its multivariable generalisations (Stokes\', divergence theorem).'
    }))
  ],
};

/** Get questions for a specific path, shuffled */
export function getPathQuestions(pathId, count = 10) {
  const pool = PATH_QUESTIONS[pathId];
  if (!pool) return [];

  const generated = pool.map(def => {
    const inst = def.generate();
    return { type: def.type, ...inst };
  });

  // Shuffle
  for (let i = generated.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [generated[i], generated[j]] = [generated[j], generated[i]];
  }

  return generated.slice(0, Math.min(count, generated.length));
}

export { randInt, pick };
