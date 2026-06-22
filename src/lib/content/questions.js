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
