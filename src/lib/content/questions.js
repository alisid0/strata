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
