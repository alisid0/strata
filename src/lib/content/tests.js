// tests.js — strict assessment banks for Workshop "Test" mode.
//
// Practice workshops build confidence: teaching feedback, hints, retry gates.
// Tests measure: unseen and harder items, one attempt each, no answer reveal
// while running (Workshop's `assess` mode hides the correct option and all
// teaching text), and the result is recorded via progress.recordQuizResult so
// it feeds the mastery machine like a real quiz.
//
// Resolution order for a module's test:
//   1. curated bank below (purpose-written assessment items)
//   2. the module's randomized challenge generator, untimed (unseen targets)
//   3. the module's own practice items filtered to scoreable types, shuffled
//      (same material, but strict conditions: one attempt, nothing revealed)
import { getChallengeForModule } from './challenges.js';

const S = (prompt, options, correctFeedback = 'Correct.', incorrectFeedback = 'Not quite.') => ({
  type: 'scenario', prompt, options, correctFeedback, incorrectFeedback
});
const O = (id, label, correct = false) => ({ id, label, correct });

const clone = (items) => JSON.parse(JSON.stringify(items));

function shuffle(items) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Interaction types that honestly self-score a first attempt (as opposed to
// the completion-gated labs, which retry until correct and always report 1/1).
const SCOREABLE = new Set([
  'scenario', 'sorting', 'unitcheck', 'coorddrill', 'atombuilder',
  'moleculebuilder', 'matrixcell', 'matrixtransform', 'forcebalance', 'bitpattern'
]);

const TESTS = {
  // ── Maths ──
  'limits': [
    S('What is the limit of (x² − 9)/(x − 3) as x → 3?',
      [O('6', '6', true), O('0', '0'), O('dne', 'It does not exist'), O('9', '9')]),
    S('f(2) = 7, but as x → 2 from both sides f(x) → 4. The limit as x → 2 is…',
      [O('4', '4', true), O('7', '7'), O('avg', '5.5'), O('dne', 'undefined')]),
    S('Left limit at x = 1 is 2; right limit is 2; f(1) = 5. Is f continuous at 1?',
      [O('no', 'No — the limit exists but does not equal f(1)', true), O('yes', 'Yes — both one-sided limits agree'), O('dne', 'No — the limit does not exist')]),
    S('As x grows without bound, 1/x approaches…',
      [O('0', '0', true), O('1', '1'), O('inf', 'infinity'), O('dne', 'no value')]),
    S('The left limit is −1 and the right limit is +1 at x = 0 (like x/|x|). The two-sided limit is…',
      [O('dne', 'nonexistent', true), O('0', '0'), O('1', '1'), O('-1', '−1')]),
    S('Which statement about limits is true?',
      [O('t', 'A limit can exist at a point where the function is undefined', true),
       O('f1', 'A limit only exists where the function is defined'),
       O('f2', 'A limit always equals the function value')]),
  ],
  'exp-logs': [
    S('2⁵ × 2³ = 2 to the power…',
      [O('8', '8', true), O('15', '15'), O('2', '2'), O('53', '53')]),
    S('log₁₀(1000) = ?',
      [O('3', '3', true), O('100', '100'), O('10', '10'), O('1000', '1000')]),
    S('(3²)⁴ = 3 to the power…',
      [O('8', '8', true), O('6', '6'), O('16', '16'), O('24', '24')]),
    S('A population doubles every 10 years. After 30 years it is…',
      [O('8', '8× the original', true), O('3', '3× the original'), O('6', '6× the original'), O('30', '30× the original')]),
    S('If log₂(x) = 6, then x = ?',
      [O('64', '64', true), O('12', '12'), O('36', '36'), O('3', '3')]),
    S('5⁰ = ?',
      [O('1', '1', true), O('0', '0'), O('5', '5')]),
  ],
  'differentiation': [
    S('The derivative of x³ is…',
      [O('3x2', '3x²', true), O('x2', 'x²'), O('3x', '3x'), O('x4', 'x⁴/4')]),
    S('f(x) = 4x² . What is f′(3)?',
      [O('24', '24', true), O('36', '36'), O('12', '12'), O('8', '8')]),
    S('A derivative of zero across an interval means the function is…',
      [O('flat', 'constant there', true), O('inc', 'increasing there'), O('zero', 'equal to zero there')]),
    S('Position is s(t) = t². The velocity at t = 5 is…',
      [O('10', '10', true), O('25', '25'), O('5', '5'), O('2', '2')]),
    S('The derivative of a function at a point is the…',
      [O('slope', 'slope of the tangent line there', true), O('area', 'area under the curve up to there'), O('val', 'value of the function there')]),
    S('If f′(x) > 0 on an interval, then on that interval f is…',
      [O('inc', 'increasing', true), O('dec', 'decreasing'), O('pos', 'positive')]),
  ],
  'molecular-arch': [
    { type: 'moleculebuilder', prompt: 'Build hydrogen peroxide, H2O2.',
      targetFormula: 'H2O2', targetAtoms: { H: 2, O: 2 },
      correctFeedback: 'Correct.', incorrectFeedback: 'H2O2 is 2 H and 2 O.' },
    S('How many atoms in total are in one molecule of C₂H₆ (ethane)?',
      [O('8', '8', true), O('6', '6'), O('2', '2'), O('12', '12')]),
    { type: 'moleculebuilder', prompt: 'Build carbon monoxide, CO.',
      targetFormula: 'CO', targetAtoms: { C: 1, O: 1 },
      correctFeedback: 'Correct.', incorrectFeedback: 'CO is 1 C and 1 O.' },
    S('CO₂ is linear while H₂O is bent. The best explanation is…',
      [O('lone', 'oxygen in water carries lone pairs that repel the bonds', true),
       O('mass', 'carbon is heavier than hydrogen'),
       O('count', 'CO₂ has more atoms')]),
    { type: 'moleculebuilder', prompt: 'Build nitrogen gas, N2.',
      targetFormula: 'N2', targetAtoms: { N: 2 },
      correctFeedback: 'Correct.', incorrectFeedback: 'N2 is two nitrogen atoms.' },
    S('In 3 H₂O there are how many hydrogen atoms?',
      [O('6', '6', true), O('3', '3'), O('2', '2'), O('9', '9')]),
  ],
  'quant-chem': [
    S('Carbon is 12 g/mol. How many moles are in 36 g of carbon?',
      [O('3', '3', true), O('12', '12'), O('36', '36'), O('0.3', '0.33')]),
    S('Water is 18 g/mol. The mass of 2 moles of water is…',
      [O('36', '36 g', true), O('18', '18 g'), O('9', '9 g'), O('20', '20 g')]),
    S('2 H₂ + O₂ → 2 H₂O. Starting with 4 moles of H₂ and plenty of O₂, you get…',
      [O('4', '4 moles of water', true), O('2', '2 moles of water'), O('8', '8 moles of water'), O('1', '1 mole of water')]),
    S('One mole of any substance contains the same number of…',
      [O('part', 'particles (Avogadro’s number)', true), O('gram', 'grams'), O('atoms', 'protons')]),
    S('CH₄ + 2 O₂ → CO₂ + 2 H₂O. With only 6 moles of O₂ and plenty of CH₄, the CO₂ produced is…',
      [O('3', '3 moles', true), O('6', '6 moles'), O('12', '12 moles'), O('2', '2 moles')]),
  ],
  'optics': [
    S('A ray hits a plane mirror at 35° to the normal. It reflects at…',
      [O('35', '35° to the normal', true), O('55', '55° to the normal'), O('70', '70° to the normal'), O('0', 'along the normal')]),
    S('Light slows down entering glass from air. Its path bends…',
      [O('toward', 'toward the normal', true), O('away', 'away from the normal'), O('none', 'not at all')]),
    S('A converging lens forms a real image when the object sits…',
      [O('out', 'beyond the focal point', true), O('in', 'inside the focal point'), O('at', 'exactly at the lens')]),
    S('Total internal reflection can only happen when light travels…',
      [O('dense', 'from a denser medium toward a less dense one', true), O('rare', 'from a less dense medium toward a denser one'), O('any', 'in any direction')]),
    S('White light splits into colours in a prism because…',
      [O('speed', 'each colour slows by a different amount, so each bends differently', true),
       O('add', 'the prism adds colour to the light'),
       O('heat', 'the prism heats the light')]),
  ],
  'thermodynamics': [
    S('Heat always flows spontaneously from…',
      [O('hot', 'hotter to colder', true), O('cold', 'colder to hotter'), O('big', 'bigger to smaller objects')]),
    S('Equal masses of water and iron receive the same heat. Water warms less because it has…',
      [O('cap', 'a higher specific heat capacity', true), O('den', 'a higher density'), O('cond', 'better conduction')]),
    S('While water boils, the added heat goes into…',
      [O('phase', 'breaking molecules free of the liquid (phase change), not raising temperature', true),
       O('temp', 'raising the temperature past 100°C'),
       O('press', 'raising the air pressure')]),
    S('Compressing a gas quickly makes it hotter because…',
      [O('work', 'work done on the gas becomes internal energy', true), O('fric', 'the molecules rub together'), O('count', 'more molecules appear')]),
    S('No engine can turn all its heat input into useful work. This is stated by…',
      [O('2nd', 'the second law of thermodynamics', true), O('1st', 'the first law of thermodynamics'), O('newt', 'Newton’s second law')]),
  ],
  'units-dimensions': [
    { type: 'unitcheck', prompt: 'Cancel the units: (m/s²) × s gives what?',
      expression: '(m/s²) x s', target: 'An object accelerates for a stretch of time.',
      options: [
        { id: 'ms', label: 'm/s', note: 'speed' },
        { id: 'm', label: 'm', note: 'distance' },
        { id: 'ms2', label: 'm/s²', note: 'acceleration' }
      ],
      correctOption: 'ms',
      correctFeedback: 'Correct.', incorrectFeedback: 'One s cancels, leaving m/s.' },
    S('Kinetic energy is ½mv². Its unit works out to…',
      [O('j', 'kg·m²/s² (a joule)', true), O('n', 'kg·m/s² (a newton)'), O('w', 'kg·m²/s³ (a watt)')]),
    S('An equation claims: distance = acceleration × time. Dimensionally it is…',
      [O('bad', 'wrong — the right side gives m/s, not m', true), O('ok', 'fine'), O('dep', 'right only for small times')]),
    { type: 'unitcheck', prompt: 'Cancel the units: (kg·m/s²) × m gives what?',
      expression: 'N x m', target: 'A force pushes through a distance.',
      options: [
        { id: 'j', label: 'kg·m²/s²', note: 'energy' },
        { id: 'n', label: 'kg·m/s²', note: 'force' },
        { id: 'p', label: 'kg·m/s', note: 'momentum' }
      ],
      correctOption: 'j',
      correctFeedback: 'Correct.', incorrectFeedback: 'Force times distance is energy: kg·m²/s².' },
    S('Power is energy per time. Its SI unit is…',
      [O('w', 'the watt, J/s', true), O('j', 'the joule, N·m'), O('n', 'the newton, kg·m/s²')]),
  ],
  // ── Physics (signature labs get topic-true tests) ──
  'momentum': [
    S('A 3 kg cart moves at 4 m/s. Its momentum is…',
      [O('12', '12 kg·m/s', true), O('7', '7 kg·m/s'), O('24', '24 kg·m/s'), O('1.3', '1.33 kg·m/s')]),
    S('A 2 kg cart at 6 m/s hits a resting 4 kg cart and they stick. The pair moves at…',
      [O('2', '2 m/s', true), O('3', '3 m/s'), O('6', '6 m/s'), O('1', '1 m/s')]),
    S('Doubling a cart’s speed multiplies its kinetic energy by…',
      [O('4', '4', true), O('2', '2'), O('8', '8'), O('16', '16')]),
    S('In every collision, sticky or bouncy, the quantity that is always conserved is…',
      [O('p', 'total momentum', true), O('ke', 'total kinetic energy'), O('v', 'total velocity'), O('none', 'nothing')]),
    S('Two equal masses collide elastically, one moving and one at rest. Afterwards…',
      [O('swap', 'the moving one stops and the resting one leaves with its speed', true),
       O('half', 'both move at half speed'),
       O('back', 'the moving one bounces straight back')]),
    S('In a sticky (inelastic) collision, the kinetic energy that disappears becomes…',
      [O('heat', 'heat, sound, and deformation', true), O('mom', 'extra momentum'), O('mass', 'extra mass'), O('nothing', 'nothing — it is destroyed')]),
  ],
  'forces': [
    S('A 4 kg mass feels a net force of 12 N. Its acceleration is…',
      [O('3', '3 m/s²', true), O('48', '48 m/s²'), O('8', '8 m/s²'), O('0.3', '0.33 m/s²')]),
    { type: 'forcebalance', prompt: 'Make the cart accelerate to the LEFT.',
      target: 'left', startLeft: 2, startRight: 2,
      correctFeedback: 'Correct.', incorrectFeedback: 'The net force must point left.' },
    S('A parachutist falls at a steady, constant speed. The net force on her is…',
      [O('0', 'zero', true), O('down', 'downward'), O('up', 'upward')]),
    S('A book rests on a table. The table pushes up on the book because…',
      [O('3rd', 'forces come in equal and opposite pairs', true), O('grav', 'gravity acts upward on tables'), O('none', 'it does not — only gravity acts')]),
    S('The same engine force is applied to a loaded truck and an empty one. The loaded truck…',
      [O('less', 'accelerates less, because a = F/m', true), O('more', 'accelerates more'), O('same', 'accelerates the same')]),
    S('An object in motion with zero net force will…',
      [O('keep', 'keep its speed and direction', true), O('stop', 'gradually stop'), O('slow', 'slow to a natural resting speed')]),
  ],
  // ── Computing ──
  'ai-era': [
    S('A model performs brilliantly on training data but poorly on fresh data. The diagnosis is…',
      [O('over', 'overfitting', true), O('under', 'underfitting'), O('slow', 'slow hardware'), O('data', 'too much training data')]),
    S('Which task is a better fit for explicit rules than machine learning?',
      [O('vat', 'Computing sales tax from a fixed rate table', true),
       O('img', 'Describing what is in a photo'),
       O('tone', 'Detecting sarcasm in a review')]),
    S('Which task is a better fit for machine learning than hand-written rules?',
      [O('hand', 'Reading messy handwriting', true),
       O('sqrt', 'Computing a square root'),
       O('sortl', 'Alphabetising a list')]),
    S('The main ingredients behind the recent leap in AI capability are…',
      [O('dc', 'much more data and much more compute', true), O('sent', 'machines becoming sentient'), O('lang', 'new programming languages')]),
    S('An AI states a false “fact” fluently and confidently. The right response is to…',
      [O('ver', 'verify it against a reliable source', true), O('trust', 'trust it — confidence signals correctness'), O('big', 'trust it if the model is big enough')]),
  ],
  'ai-behind': [
    S('At its core, a large language model repeatedly…',
      [O('next', 'predicts the next token given everything so far', true),
       O('look', 'looks the answer up in a database'),
       O('rule', 'applies hand-written grammar rules')]),
    S('Training a neural network means adjusting its…',
      [O('w', 'weights to reduce prediction error', true), O('ram', 'memory size'), O('code', 'source code line by line')]),
    S('When you chat with a trained model, its weights are…',
      [O('fix', 'fixed — it is not learning from your conversation into its weights', true),
       O('upd', 'updated by every message you send'),
       O('rand', 'randomised each session')]),
    S('Hallucination happens because the model optimises for…',
      [O('plaus', 'plausible-sounding text, not verified truth', true), O('speed', 'answering as fast as possible'), O('len', 'longer answers')]),
    S('A model’s knowledge lives in…',
      [O('w', 'patterns compressed into its weights during training', true), O('db', 'a live fact database it queries'), O('net', 'the internet, searched at answer time')]),
  ],
};

/**
 * Strict test for a WorkshopLab module, or null if none can be built.
 * `practice` is the module's practice interactions, used as the last-resort
 * source (filtered to scoreable types and shuffled).
 */
export function getTestForModule(moduleId, practice = []) {
  if (TESTS[moduleId]) return shuffle(clone(TESTS[moduleId]));
  const ch = getChallengeForModule(moduleId);
  if (ch?.interactions?.length) return ch.interactions; // already fresh + randomized
  const pool = (practice || []).filter((i) => SCOREABLE.has(i.type));
  return pool.length >= 3 ? shuffle(clone(pool)) : null;
}
