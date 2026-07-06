// Workshop interaction data for the four starting points.
// 48 interactions across 4 checkpoints (12 per checkpoint).

function S(prompt, opts, correctFeedback, incorrectFeedback) {
  return { type: 'scenario', prompt, options: opts, correctFeedback, incorrectFeedback };
}

function O(id, label, correct) {
  return { id, label, correct };
}

export const LINE_WORKSHOPS = {

  // After BB 003 — Boundaries: Segments, Rays, Lines (12 interactions)
  checkpoint_a: [
    { type: 'sorting', boxes: [
      { id: 'segment', label: 'Segment' }, { id: 'ray', label: 'Ray' }
    ], items: [
      { id: 'ruler', label: 'A wooden ruler', box: 'segment' }
    ]},
    S('Tap the wrong word in this sentence to fix it.\n\nA true Euclidean line has two ends.',
      [O('one','one',false), O('zero','zero',true), O('infinite','infinite',false)],
      'Exactly. A true line never stops in either direction.',
      'Actually, it has zero. A line goes on forever both ways.'),
    S('You draw a straight line in the sand with a stick. You walk away. What did you just draw?',
      [O('line','A line',false), O('segment','A segment',true)],
      'Yep. No matter how long you drew it, it eventually stops. That makes it a segment.',
      'Not quite. A true line goes on forever. Your stick eventually ran out of sand.'),
    { type: 'taperase' },
    S('A laser pointer shining into deep, empty space is a good example of a ray.',
      [O('true','True',true), O('false','False',false)],
      'Yep. It starts at your hand, and the light just keeps going.',
      'Actually, it is true. It starts at the bulb and goes on endlessly in one direction.'),
    S('You are holding a piece of dry spaghetti. You snap it in half. What do you have now?',
      [O('rays','Two rays',false), O('segments','Two segments',true)],
      'Yep. Just two shorter pieces that both have ends.',
      'Not quite. Both new pieces still have ends, so they are both segments.'),
    S('Tap the wrong word to fix the sentence.\n\nA ray has an anchor on one side, and goes on forever on neither side.',
      [O('both','both',false), O('the other','the other',true)],
      'Got it. Anchored on one end, infinite on the other.',
      'Not quite. It only goes on forever on the other side.'),
    S('Can you put a true Euclidean line in your pocket?',
      [O('yes','Yes',false), O('no','No',true)],
      'Yep. It goes on forever, so it only really exists in your imagination.',
      'Not quite. It stretches forever in both directions. It would not fit.'),
    S('You tap a railroad track onto the ground. It runs from edge to edge of the screen. Is it a true mathematical line?',
      [O('yes','Yes',false), O('no','No',true)],
      'Right. At some point, the steel runs out. It is just a very long segment.',
      'Actually, no. Real railroad tracks eventually end.'),
    S('Slide to the number of endpoints a true line has.\n\nSlider: 0 to 5',
      [O('0','0',true), O('1','1',false), O('2','2',false)],
      'Yep. Zero ends. It just keeps going.',
      'Not quite. A true line never stops, so it has zero ends.'),
    S('You slide right to zoom out on a line segment. Huge walls appear on both sides. Does zooming out change the fact that it has ends?',
      [O('yes','Yes',false), O('no','No',true)],
      'Got it. A segment is trapped between two points, no matter how far back you stand.',
      'Actually, no. It is stuck between its two endpoints forever.'),
    S('You turn on a flashlight in a dark room. The beam hits the bedroom door. Did you just create a ray, or a segment?',
      [O('ray','A ray. Light goes on forever.',false), O('segment','A segment. The door stopped it.',true)],
      'Spot on. The moment that light hits a wall, it gains a second endpoint.',
      'The door gave the beam a second endpoint. That makes it a segment.')
  ],

  // After BB 006 — Walking the Line: Zero, Left, Right (12 interactions)
  checkpoint_b: [
    S('We have a blank line. You drop the anchor for Zero. Does it matter where you put it?',
      [O('yes','Yes',false), O('no','No',true)],
      'Yep. It does not matter. It is just the starting line before we begin counting.',
      'Actually, no. You can put the starting line anywhere you want.'),
    S('You are standing on zero. You take 4 steps to the right. Where are you?',
      [O('pos4','Positive 4',true), O('neg4','Negative 4',false)],
      'Exactly. Stepping right is just regular, positive counting.',
      'Not quite. Taking steps to the right moves you into the positives.'),
    S('Tap the wrong word to fix the sentence.\n\nTo get to negative numbers, you start at zero and walk to the right.',
      [O('left','left',true), O('up','up',false)],
      'Got it. Negatives just mean walking backward to the left.',
      'Not quite. You have to walk left to get into the negatives.'),
    S('You are in an elevator on Floor 2. You go down 5 floors. Where do you end up?',
      [O('neg3','Floor -3',true), O('3','Floor 3',false), O('lobby','Lobby (0)',false)],
      'Yep. Going down 5 floors from floor 2 drops you 3 floors underground.',
      'Not quite. Two floors down gets you to zero, and three more puts you at -3.'),
    S('You have $10. You buy a pizza for $12. Where are you on the number line?',
      [O('neg2','-2',true), O('2','2',false)],
      'Exactly. You dropped below zero and owe 2 dollars.',
      'Actually, spending more than you have drops you into the negatives. You are at -2.'),
    S('Zero just means empty space on the number line. True or False?',
      [O('false','False',true), O('true','True',false)],
      'Yep. Zero is highly important. It is our anchor point.',
      'Actually, it is false. Zero is not empty space; it is the anchor that tells us where we are starting.'),
    S('You owe a friend 5 dollars. You hand them a 5 dollar bill. Where does your bank account sit now?',
      [O('zero','Zero',true), O('pos5','Positive 5',false)],
      'Yep. You paid off the debt, bringing you exactly back to the starting line.',
      'Not quite. You used your $5 to erase the debt, which lands you right on zero.'),
    S('Tap the wrong word to fix the sentence.\n\nA negative number is a completely different distance than a positive number.',
      [O('direction','direction',true), O('size','size',false)],
      'Exactly. Negative 5 is the exact same distance as positive 5. It is just the opposite direction.',
      'Actually, the distance is identical. Only the direction is different.'),
    S('You keep walking left past -100. Does the left side ever stop?',
      [O('no','No',true), O('yes','Yes',false)],
      'Yep. The left side is just as infinite as the right side.',
      'Actually, no. Just like the positive numbers, the negatives go on forever.'),
    S('You take 3 steps forward, then 3 steps backward. What number are you standing on?',
      [O('0','0',true), O('3','3',false)],
      'Exactly. The steps cancel each other out.',
      'Not quite. The backward steps bring you right back to your anchor point.'),
    S('Water freezes at 32 degrees. Which side of zero does this temperature sit on?',
      [O('right','Right of zero (Positive)',true), O('left','Left of zero (Negative)',false)],
      'Yep. It is above zero, so it sits on the right side.',
      'Not quite. 32 is above zero, so it goes on the right.'),
    S('Drag the number -1 to its spot on the line.\n\nLine shows: -2 ... ? ... 0',
      [O('between','Right between -2 and 0',true), O('left','Left of -2',false), O('right','Right of 0',false)],
      'Got it. It is exactly one step to the left of zero.',
      'Not quite. Negative 1 lives right between zero and negative 2.')
  ],

  // After BB 009 — Stepping Stones: Natural, Whole, Integers (12 interactions)
  checkpoint_c: [
    S('A shepherd counts 4 sheep in a field. What box are they using?',
      [O('natural','Natural Numbers',true), O('integers','Integers',false)],
      'Yep. Pure, simple counting starts at 1. That is a natural number.',
      'Not quite. Basic counting (1, 2, 3) belongs in the Natural box.'),
    S('All the sheep run away. What number do we need now?',
      [O('zero','Zero',true), O('negative','A negative number',false)],
      'Got it. We need a way to write down nothing.',
      'Actually, you just have nothing left. You need zero.'),
    S('Tap the wrong word.\n\nThe Whole Numbers box is just the counting numbers plus fractions.',
      [O('zero','zero',true), O('negatives','negatives',false)],
      'Yep. The only difference between Natural and Whole is just tossing zero in the box.',
      'Not quite. The Whole Numbers box is just counting numbers plus zero.'),
    S('A negative number like -3 belongs in the Whole Numbers box. True or False?',
      [O('false','False',true), O('true','True',false)],
      'Exactly. Whole numbers do not handle debt or walking backward.',
      'Actually, that is false. Whole numbers stop at zero. Negatives need a bigger box.'),
    S('You add negative numbers to the Whole Numbers box. What did we just create?',
      [O('integers','Integers',true), O('natural','Natural Numbers',false)],
      'Yep. Positives, zero, and negatives together make the Integers.',
      'Not quite. Once you add the negatives, you have the Integers.'),
    S('You borrow 10 bucks. Your balance is -10. Which box does -10 belong in?',
      [O('integers','Integers',true), O('natural','Natural Numbers',false)],
      'Exactly. Integers handle the left side of the number line.',
      'Actually, natural numbers are just for basic counting. -10 is an integer.'),
    S('Drag the number 0 to its smallest correct box.',
      [O('whole','Whole Numbers',true), O('natural','Natural Numbers',false)],
      'Yep. Zero is the only reason the Whole Numbers box even exists.',
      'Not quite. Natural numbers start at 1. Zero belongs in Whole.'),
    S('You look at the integers on the line: -2, -1, 0, 1, 2. Are they a solid line or stepping stones?',
      [O('stones','Stepping stones',true), O('solid','A solid line',false)],
      'Got it. Integers do not cover the spaces in between.',
      'Actually, they are just stepping stones. There is empty space between them.'),
    S('Tap the wrong word.\n\nAn integer is always a fraction.',
      [O('clean','clean step',true), O('decimal','decimal',false)],
      'Yep. Integers are clean whole numbers, never fractions.',
      'Not quite. Integers are clean steps. They are never fractions.'),
    S('A toddler is counting wooden blocks. 1, 2, 3. Which box are they using?',
      [O('natural','Natural Numbers',true), O('integers','Integers',false)],
      'Exactly. Toddlers do not count with zero or negatives.',
      'Not quite. Toddlers just use basic counting: the natural numbers.'),
    S('Every single Natural Number also fits inside the Integer box. True or False?',
      [O('true','True',true), O('false','False',false)],
      'Yep. Integers cover positives, zero, and negatives. It is a bigger umbrella.',
      'Actually, it is true. The integer box is big enough to hold all the natural numbers too.'),
    S('Find the number that is NOT an integer.\n\nLine shows: 1 ... 1.5 ... 2',
      [O('1.5','1.5',true), O('1','1',false), O('2','2',false)],
      'Got it. Integers do not do halfway steps.',
      'Not quite. Integers have to land directly on a clean, whole step.')
  ],

  // After BB 013 — The In-Between + Full Taxonomy (12 interactions)
  checkpoint_d: [
    S('You tap the empty space between 0 and 1. Right in the middle appears 1/2. What box does 1/2 go into?',
      [O('rational','Rational',true), O('integer','Integer',false)],
      'Yep. It is a clean fraction, which makes it rational.',
      'Actually, integers are only whole steps. Fractions go into the Rational box.'),
    S('Which food belongs in the Rational box?\n\n3 whole apples vs Half a pizza (1/2)',
      [O('pizza','Half a pizza (1/2)',true), O('apples','3 whole apples',false)],
      'Got it. A fraction of a pizza is a perfect example of a rational number.',
      'Not quite. The whole apples are integers. The half pizza belongs in the Rational box.'),
    S('Tap the wrong word.\n\nThe word "rational" in math means the number is highly intelligent.',
      [O('ratio','a ratio',true), O('decimal','a decimal',false)],
      'Yep. It just contains the word "ratio," which means fraction.',
      'Actually, it has nothing to do with being smart. It just means it is a ratio (a fraction).'),
    S('You type 1 divided by 2 into a calculator. It says 0.5. Does this decimal belong in the Rational box?',
      [O('yes_stop','Yes, because it stops',true), O('no_decimal','No, because it is a decimal',false)],
      'Exactly. Decimals that come to a clean stop are perfectly rational.',
      'Actually, it belongs. Any decimal that stops cleanly is rational.'),
    S('A decimal that repeats a simple pattern forever (like 0.3333...) is Rational. True or False?',
      [O('true','True',true), O('false','False',false)],
      'Yep. Because it behaves predictably, we can write it as a fraction (1/3).',
      'Actually, it is true. Because it repeats a simple pattern, it is rational.'),
    S('You chop the space between 0 and 0.5 exactly in half. You get 0.25. Will you ever run out of spaces to chop in half?',
      [O('no','No',true), O('yes','Yes',false)],
      'Got it. You can keep zooming in and chopping forever.',
      'Actually, no. You can chop fractions in half infinitely.'),
    S('You look at the decimal for Pi (3.14159...). The digits scroll randomly forever. Does it ever stop or repeat a pattern?',
      [O('no','No',true), O('yes','Yes',false)],
      'Yep. It just spits out random digits forever.',
      'Not quite. It never stops, and it never repeats. It is totally random.'),
    S('Pi refuses to behave. Which box does it belong in?',
      [O('irrational','Irrational',true), O('rational','Rational',false)],
      'Exactly. Because it refuses to behave, it goes in the Irrational box.',
      'Not quite. It does not play by the rules, so it is irrational.'),
    S('An irrational number is perfectly messy. Does it still have a physical spot on the number line?',
      [O('yes','Yes',true), O('no','No',false)],
      'Yep. It is wedged in there. It just has a really long, ugly address.',
      'Actually, yes. It still has an exact location on the line.'),
    S('Tap the wrong word.\n\nIf you put all the integers, rationals, and irrationals on the line, there are still gaps.',
      [O('no','no holes left',true), O('empty','empty spaces',false)],
      'Got it. The line fills up completely.',
      'Actually, there are no gaps left at all. The line becomes totally solid.'),
    S('The giant umbrella name for every number on the solid line is The Real Numbers. True or False?',
      [O('true','True',true), O('false','False',false)],
      'Exactly. If you can point to it on the line, it is a real number.',
      'Actually, it is true. Everything on the line together makes the real numbers.'),
    S('You throw a dart at a number line. It hits a completely random, microscopic spot. What kind of number did you hit?',
      [O('real','A Real Number',true), O('integer','An Integer',false)],
      'Yep. No matter where it lands, every single spot is a real number.',
      'Not quite. It is highly unlikely to hit a clean integer, but whatever you hit is definitely a Real Number.')
  ],

  // After BB 016 — The Shorthand: N, W, Z, Q, R (12 interactions)
  checkpoint_e: [
    S('Tap the strange-looking \u2115 to see what it really is. Does the extra stripe mean anything complicated?',
      [O('no','No, it is just a font style',true), O('yes','Yes, it is a math formula',false)],
      'Yep. It is just shorthand. The extra stripe just tells you it is a category of numbers.',
      'Not quite. It is literally just a font style called blackboard bold to make it stand out.'),
    { type: 'sorting', boxes: [
      { id: 'natural', label: 'Natural Numbers' }, { id: 'whole', label: 'Whole Numbers' }
    ], items: [
      { id: 'n', label: '\u2115', box: 'natural' }, { id: 'w', label: 'W', box: 'whole' }
    ]},
    S('You walk into a classroom and see \u2124 written on the board. What are they talking about?',
      [O('integers','Integers',true), O('fractions','Fractions',false)],
      'Exactly. The Z is for Zahlen, the German word for numbers. It is the integers.',
      'Actually, Z is for integers. Fractions get a different letter.'),
    S('Tap the wrong word to fix the sentence.\n\nIntegers get a Z because the letter I was already taken, and Z stands for the German word for zero.',
      [O('numbers','numbers',true), O('zebras','zebras',false)],
      'Yep. Zahlen just means numbers.',
      'Not quite. Zahlen is just the German word for numbers.'),
    S('The Rational numbers (the clean fractions) get the letter R. True or False?',
      [O('false','False',true), O('true','True',false)],
      'Yep, that is false. R was taken by the Real numbers, so Rationals get a Q.',
      'Actually, false. Rationals get a Q.'),
    S('Tap the \u211A to reveal the hidden word behind it. What does quotient mean?',
      [O('division','The answer to a division problem',true), O('decimal','A repeating decimal',false)],
      'Exactly. Since a fraction is just division, Quotient makes sense for the fraction box.',
      'Not quite. A quotient is just the answer you get when you divide things (like in a fraction).'),
    S('Which letter holds every single number on the line? \u2115 \u2192 \u2124 \u2192 \u211D',
      [O('R','\u211D',true), O('Z','\u2124',false)],
      'Yep. The R stands for Real Numbers, which covers the entire solid line.',
      'Actually, R holds everything. Z only holds the clean stepping stones.'),
    S('A test asks you to pick a number that belongs in \u211A but NOT in \u2124. What should you pick?',
      [O('half','1/2',true), O('neg5','-5',false)],
      'Got it. Q holds the fractions. Z only holds the whole stepping stones.',
      'Not quite. -5 is a clean step, so it belongs in Z. 1/2 is a fraction, so it goes in Q.'),
    { type: 'sorting', boxes: [
      { id: 'n', label: '\u2115' }, { id: 'z', label: '\u2124' }
    ], items: [
      { id: 'three', label: '3', box: 'n' }, { id: 'neg7', label: '-7', box: 'z' }
    ]},
    S('Tap the wrong word.\n\nIf you see an \u211D in a textbook, it means the number has to be a fraction.',
      [O('anything','literally anything on the line',true), O('counting','a counting number',false)],
      'Exactly. R means Real. It can be a fraction, a negative, or a messy decimal.',
      'Actually, R stands for Real numbers. It can be anything on the solid line.'),
    S('Pi (3.14159...) belongs inside the big \u211D umbrella. True or False?',
      [O('true','True',true), O('false','False',false)],
      'Yep. Even though it is messy and irrational, it is still a Real number on the line.',
      'Actually, it is true. R holds the clean numbers AND the messy rule-breakers.'),
    S('You are trying to write down that you have zero sheep. Which shorthand letter do you need to use?',
      [O('W','W',true), O('N','\u2115',false)],
      'Got it. The W (Whole numbers) is the first box that includes zero.',
      'Not quite. \u2115 starts at 1. You need the W for Whole numbers to get zero.')
  ],

  // The Mathematical Machine (Functions & Growth)
  checkpoint_f: [
    S('Tap the wrong word to fix the rule of a mathematical function.\n\nA working function can take a single specific input and produce multiple different outputs.',
      [O('one','exactly one',true), O('randomized','a randomized',false)],
      'Yep. Predictability is the absolute rule. One specific input can only ever lead to exactly one specific output.',
      'Actually, a single input can only produce exactly one output. If it produces multiple different outputs, the machine is broken.'),
    S('Tap the vending machine slot where the coins go in. The word DOMAIN appears over the coin slot. What does the Domain of a function represent?',
      [O('inputs','All acceptable inputs',true), O('outputs','All possible outputs',false)],
      'Exactly. The Domain is the strictly defined list of inputs the machine is allowed to accept without breaking.',
      'Not quite. The outputs are the Range. The Domain is the complete list of all acceptable inputs.'),
    S('A single bacterial cell divides into two. Those two divide into four. Four become eight. What mathematical curve tracks this growth?',
      [O('exponential','An Exponential function',true), O('linear','A Linear function',false)],
      'Got it. It isn\'t growing by a steady, fixed amount. It is multiplying its previous output, bending the line violently upward.',
      'Actually, a linear function grows by a steady, flat amount. Because the bacteria are multiplying, it is an Exponential function.'),
    S('A dot traces the path of a baseball thrown high into the air. The dot perfectly traces an upside-down U-shape. What is the name of this specific mathematical curve?',
      [O('parabola','A parabola (Quadratic)',true), O('linear','A straight line (Linear)',false)],
      'Yep. Every object falling under gravity traces this exact quadratic curve.',
      'Not quite. A thrown object goes up, peaks, and falls in a symmetrical U-shape. That is a quadratic parabola.'),
    S('To successfully run a function backward (an Inverse Function), the original machine must have a strictly one-to-one relationship between inputs and outputs.',
      [O('true','True',true), O('false','False',false)],
      'Exactly. If two different buttons drop the exact same soda, running it backward is impossible because the math doesn\'t know which button was pressed.',
      'Actually, that\'s true. If the relationship isn\'t perfectly one-to-one, you can\'t trace the output back to the original input.'),
    { type: 'sorting', boxes: [
      { id: 'plug', label: 'Plug directly into' }
    ], items: [
      { id: 'output', label: 'The output of the first machine', box: 'plug' },
      { id: 'input', label: 'The input slot of the second machine', box: null }
    ]}
  ]
};

// ── The Atom workshops ──

export const ATOM_WORKSHOPS = {

  // After BB 003 — The Bottom of the Pile (12 interactions)
  checkpoint_a: [
    S('You have cut the aluminum foil down to a single, solitary atom. Can you cut this final piece in half and still have aluminum?',
      [O('no','No',true), O('yes','Yes',false)],
      'Yep. Once you smash that final piece, it loses its identity completely.',
      'Not quite. If you cut it one more time, it stops being aluminum. It just becomes a pile of raw parts.'),
    S('We only know atoms exist because of math and theories. No one has ever actually seen one.',
      [O('false','False',true), O('true','True',false)],
      'Exactly. With modern electron microscopes, we can look at a screen and literally see them stacked up.',
      'Actually, that is false. We have microscopes powerful enough to see them now. It is a physical fact.'),
    { type: 'sorting', boxes: [
      { id: 'center', label: 'The center' },
      { id: 'outside', label: 'Zipping around the outside' }
    ], items: [
      { id: 'nucleus', label: 'The heavy nucleus', box: 'center' },
      { id: 'electrons', label: 'The tiny electrons', box: 'outside' }
    ]},
    S('You take an electron out of a gold atom. You take an electron out of an aluminum atom. You put them on a table. Can you tell which is which?',
      [O('no','No',true), O('yes','Yes',false)],
      'Yep. The raw parts are totally identical. They only create gold or aluminum when put together into a whole atom.',
      'Actually, no. An electron is an electron. They are exactly identical.'),
    S('If you smash a gold atom apart, do you get microscopic pieces of gold?',
      [O('no','No — just raw parts',true), O('yes','Yes — tiny gold dust',false)],
      'Exactly. Once the atom breaks, the identity is gone. You just have generic subatomic parts.',
      'Not quite. Smashing the atom destroys the gold. You just get electrons and a nucleus.'),
    S('Is a single aluminum atom visible to the naked eye?',
      [O('no','No',true), O('yes','Yes',false)],
      'Yep. Atoms are far too small. You need an electron microscope to see them.',
      'Actually, no. Atoms are impossibly small — way below what your eyes can resolve.'),
    S('Tap the wrong word to fix the sentence.\n\nThe ancient Romans called the smallest piece of matter atomos.',
      [O('Greeks','Greeks',true), O('Egyptians','Egyptians',false)],
      'Got it. It was the ancient Greeks who coined the word atomos.',
      'Not quite. Atomos is a Greek word, not a Roman one.'),
    S('You keep cutting a gold ring into smaller and smaller pieces. At what point does it stop being gold?',
      [O('atom','When you split a single gold atom',true), O('dust','When it becomes dust',false)],
      'Exactly. The atom is the last piece that still behaves like gold.',
      'Not quite. Gold dust is still gold. It only stops being gold when you split the atom itself.'),
    S('Before electron microscopes, was the atom a proven fact or a working hypothesis?',
      [O('hypothesis','A working hypothesis',true), O('fact','A proven fact',false)],
      'Yep. For thousands of years it was a very good guess, but not directly observed.',
      'Actually, it was just a hypothesis until we built tools powerful enough to see them.'),
    S('You look through an electron microscope at a piece of metal. What do the atoms look like?',
      [O('balls','Fuzzy balls stacked in rows',true), O('cubes','Perfect tiny cubes',false)],
      'Got it. They appear as millions of fuzzy little spheres packed neatly together.',
      'Not quite. They look like fuzzy tennis balls arranged in orderly rows.'),
    S('An atom of aluminum and an atom of gold — which one has a heavier center?',
      [O('gold','Gold',true), O('aluminum','Aluminum',false), O('same','They are the same',false)],
      'Yep. Gold atoms have a much heavier nucleus than aluminum atoms.',
      'Actually, gold has the heavier center. That is partly why gold feels so much heavier.'),
    S('Is the atom the absolute smallest thing that exists?',
      [O('no','No — it has smaller pieces inside',true), O('yes','Yes — nothing is smaller',false)],
      'Exactly. The atom has internal parts: a nucleus and electrons. It is the smallest piece that keeps its identity, not the smallest thing period.',
      'Not quite. The atom is made of even smaller things: protons, neutrons, and electrons.')
  ],

  // After BB 006 — The Inventory (12 interactions)
  checkpoint_b: [
    S('Tap the wrong word to fix the sentence.\n\nA solid block of pure iron is made of a mix of different atoms.',
      [O('identical','exactly identical',true), O('broken','broken',false)],
      'Yep. If it is pure iron, every single atom is exactly the same element.',
      'Not quite. Pure iron is made of exactly identical iron atoms.'),
    S('You add exactly one proton to the center of a Hydrogen atom. Did it just become a heavier Hydrogen atom?',
      [O('no','No — it became Helium',true), O('yes','Yes — heavier Hydrogen',false)],
      'Exactly. Changing the number of protons completely changes the identity. It is now Helium.',
      'Actually, no. If you change the proton count, it instantly becomes a different element entirely.'),
    S('You find an atom with 8 protons in its center. A chemist tells you it is Oxygen. If you find another atom on Mars with 8 protons, what is it?',
      [O('oxygen','Oxygen',true), O('martian','A Martian element',false)],
      'Got it. Identity is just a headcount. 8 protons is always Oxygen, anywhere in the universe.',
      'Actually, 8 protons is Oxygen anywhere. Identity is just about counting the protons.'),
    S('The Periodic Table is a list of millions of different atoms that make up the world.',
      [O('false','False',true), O('true','True',false)],
      'Yep. There are only about 100 on the list. Everything is built from just those.',
      'Actually, false. There are only about 100 elements. The table is just a short inventory.'),
    S('Why does aluminum feel light and gold feel heavy?',
      [O('atoms','Gold atoms are heavier',true), O('density','Gold is more tightly packed',false)],
      'Yep. Each individual gold atom weighs more than each aluminum atom.',
      'Not quite. The gold atoms themselves are simply heavier than aluminum atoms.'),
    S('Tap the wrong word to fix the sentence.\n\nThe Periodic Table sorts atoms by how many electrons they have.',
      [O('protons','protons',true), O('neutrons','neutrons',false)],
      'Exactly. The table is ordered by proton count — that is the identity badge.',
      'Not quite. The table is sorted by the number of protons in the nucleus.'),
    S('How many different elements exist in nature?',
      [O('100','About 100',true), O('1000','Thousands',false), O('millions','Millions',false)],
      'Yep. Nature only provides roughly 100 building blocks.',
      'Actually, there are only about 100 naturally occurring elements.'),
    S('You hold a bar of pure gold. How many different types of atoms are inside it?',
      [O('1','Exactly one',true), O('few','A few different metals',false)],
      'Got it. Pure gold means every atom in the bar is a gold atom.',
      'Not quite. Pure gold contains only gold atoms — one single type.'),
    S('If you could magically change the proton count of an atom, what would happen?',
      [O('change','It becomes a different element',true), O('heavier','It just gets heavier',false)],
      'Exactly. Proton count IS identity. Change it, and the element changes.',
      'Not quite. Changing protons does not just change weight — it changes what the element is.'),
    S('Does the Periodic Table include water?',
      [O('no','No — water is a molecule, not an element',true), O('yes','Yes — it is listed',false)],
      'Yep. The table lists elements only. Water is a molecule built from hydrogen and oxygen.',
      'Actually, no. Water is not an element. It is a molecule made from two different elements.'),
    S('You discover a new material on an asteroid. How do you figure out what elements it contains?',
      [O('protons','Count the protons in each atom',true), O('color','Look at its color',false)],
      'Exactly. Count the protons and you know exactly which elements you are dealing with.',
      'Not quite. You identify elements by the number of protons in each atom.'),
    S('An atom has 79 protons. What element is it?',
      [O('gold','Gold',true), O('lead','Lead',false), O('mercury','Mercury',false)],
      'Yep. 79 protons means gold, every single time.',
      'Actually, 79 protons is gold. The number never lies.')
  ],

  // After BB 009 — Molecules & Bonds (12 interactions)
  checkpoint_c: [
    S('Human beings have a special life particle in them that is not found in rocks or dirt.',
      [O('false','False',true), O('true','True',false)],
      'Yep. We are built from the exact same carbon and oxygen atoms found in dirt and coal. We are just arranged differently.',
      'Actually, false. There is no life particle. We are made of the exact same atoms as a lump of coal.'),
    S('Tap the wrong word to fix the sentence.\n\nA glass of water is full of billions of water atoms.',
      [O('molecules','molecules',true), O('elements','elements',false)],
      'Got it. There is no water atom. Water is a molecule made by snapping hydrogen and oxygen together.',
      'Not quite. Water is not an atom; it is a molecule made of hydrogen and oxygen.'),
    S('Do atoms have physical hooks or velcro that lock them together?',
      [O('no','No — they share electrons',true), O('yes','Yes — they have hooks',false)],
      'Exactly. They do not have hooks. They share a moving electron, tethering them with electricity.',
      'Actually, no. They share an electron that zips around both of them.'),
    { type: 'sorting', boxes: [
      { id: 'destroyed', label: 'The atoms are destroyed' },
      { id: 'rearrange', label: 'The atoms rearrange' }
    ], items: [
      { id: 'log', label: 'A log turning into ash and smoke', box: 'rearrange' }
    ]},
    S('When wood burns, where do the atoms go?',
      [O('rearrange','They bond with oxygen and float away',true), O('vanish','They vanish into nothing',false)],
      'Yep. Matter is never destroyed. The atoms just find new partners in the air.',
      'Not quite. The atoms do not vanish. They bond with oxygen and drift away as smoke and gas.'),
    S('A carbon atom inside a lump of coal is different from a carbon atom inside your body.',
      [O('false','False — they are identical',true), O('true','True — body carbon is special',false)],
      'Exactly. A carbon atom is a carbon atom, whether it sits in coal or in your cells.',
      'Actually, false. The carbon atom is exactly the same. Only the arrangement differs.'),
    S('How many hydrogen atoms bond with one oxygen atom to make a water molecule?',
      [O('2','Two',true), O('1','One',false), O('3','Three',false)],
      'Yep. H₂O: two hydrogens, one oxygen.',
      'Not quite. Water is two hydrogen atoms attached to one oxygen atom.'),
    S('Tap the wrong word to fix the sentence.\n\nIn chemistry, matter is sometimes destroyed when you burn it.',
      [O('never','never',true), O('always','always',false)],
      'Got it. Matter is never destroyed. It only ever rearranges into new combinations.',
      'Not quite. Chemistry never destroys matter. The atoms always survive, just in new arrangements.'),
    S('Hydrogen and oxygen are both invisible gases. Why is water a liquid you can drink?',
      [O('bond','The bond changes their properties',true), O('cold','Water is colder',false)],
      'Exactly. When they bond, the molecule has completely different properties from the bare atoms.',
      'Not quite. The chemical bond transforms their behavior entirely.'),
    S('An electron zips around two atoms in a figure-eight. What do chemists call this?',
      [O('bond','A chemical bond',true), O('orbit','An orbit',false)],
      'Yep. That shared electron IS the chemical bond.',
      'Actually, it is called a chemical bond. The shared electron tethers the atoms together.'),
    S('You burn a log completely. The ashes weigh less than the log. Where did the missing mass go?',
      [O('air','It floated away as gas',true), O('destroyed','It was destroyed',false)],
      'Exactly. The missing mass bonded with oxygen and drifted into the air as invisible gas.',
      'Not quite. The mass did not vanish. It combined with oxygen and floated away.'),
    S('Does a molecule have the same properties as the atoms it is made of?',
      [O('no','No — the properties change',true), O('yes','Yes — they stay the same',false)],
      'Got it. The molecule behaves completely differently from its individual atoms.',
      'Actually, no. The bond changes everything. Hydrogen and oxygen are gases; together they make liquid water.')
  ],

  // After BB 015 (1109-1113) — The Engine of the Atom (12 interactions)
  checkpoint_d: [
    { type: 'sorting', boxes: [
      { id: 'center', label: 'Dead center on the 50-yard line' },
      { id: 'stands', label: 'The upper deck seats' }
    ], items: [
      { id: 'nucleus', label: 'A glass marble (The Nucleus)', box: 'center' },
      { id: 'electron', label: 'A gnat (An Electron)', box: 'stands' }
    ]},
    S('Tap the wrong word to fix the sentence.\n\nIn an atom, the space between the heavy nucleus and the moving electrons is filled with air.',
      [O('empty','empty space',true), O('water','water',false)],
      'Exactly. It is just pure, empty vacuum. You are mostly made of nothing.',
      'Actually, there is no air inside an atom. The space is completely empty.'),
    S('Tap the screen to put a positive proton and a negative electron next to each other. They instantly snap together. In the physics of an atom, what do opposite charges do?',
      [O('attract','They attract',true), O('repel','They repel',false)],
      'Got it. Opposites attract. That invisible pull is what holds the whole atom together.',
      'Not quite. Positive and negative are opposites, so they pull toward each other.'),
    S('Those electrons are flying around the outside of the atom at unimaginable speeds. Why don\'t they just fly away into deep space?',
      [O('protons','The protons pull on them',true), O('shell','They are trapped in a physical shell',false)],
      'Yep. The positive protons act like an anchor, using their magnetic pull to keep the electrons on a leash.',
      'Actually, there is no physical shell. The magnetic pull of the positive protons keeps them from flying away.'),
    S('You are looking at a Hydrogen atom. It has exactly 1 proton. You jam a second proton into the center. The label changes from Hydrogen to Helium. Did adding a proton just make it a heavier Hydrogen atom?',
      [O('new','No, it is a totally new element',true), O('heavier','Yes, it is just heavier',false)],
      'Exactly. Identity is just a headcount. The second you change the number of protons, the element changes.',
      'Not quite. The number of protons is its absolute identity. If you add one, it instantly becomes a completely different element.'),
    S('If an Oxygen atom loses one of its outside electrons, it stops being Oxygen.',
      [O('false','False',true), O('true','True',false)],
      'Yep, that is false. Electrons come and go all the time — that is just chemistry. Only protons dictate identity.',
      'Actually, that is false. An atom can trade electrons all day long and still be Oxygen. Only the protons matter.'),
    { type: 'sorting', boxes: [
      { id: 'repel', label: 'They violently repel' },
      { id: 'lock', label: 'They lock together' }
    ], items: [
      { id: 'protons', label: 'Two positive protons pushed together', box: 'repel' }
    ]},
    S('A Gold atom has 79 positive protons crammed perfectly together inside a microscopic nucleus. Based on the rules of magnets, what should happen?',
      [O('explode','It should explode',true), O('freeze','It should freeze',false)],
      'Yep. 79 positive charges packed together should violently repel each other and blow the atom to pieces.',
      'Actually, it should explode. The repulsive force between that many positive protons should blow the nucleus apart.'),
    S('Tap the wrong word to fix the sentence.\n\nTo keep the atom from exploding, the nucleus uses neutrons, which have a highly negative charge.',
      [O('neutral','neutral',true), O('positive','positive',false)],
      'Exactly. Neutrons have absolutely zero charge. They are totally neutral.',
      'Not quite. Neutrons don\'t have a charge at all. They are completely neutral.'),
    S('You drop a neutron between two angry, repelling protons. The protons stop vibrating and stabilize. What is the neutron actually doing here?',
      [O('wedge','Acting as a physical wedge',true), O('glue','Gluing them with electricity',false)],
      'Got it. It just acts as a heavy peacekeeper, spacing the protons out so they don\'t blow the center apart.',
      'Actually, it is just acting as a wedge. Because it has no charge, it just spaces the protons out to keep the peace.'),
    S('Because neutrons are in the center of the atom, they pull on the outside electrons just like protons do.',
      [O('false','False',true), O('true','True',false)],
      'Yep, that is false. Because they have zero charge, they have zero magnetic pull.',
      'Actually, that is false. Neutrons have no electrical charge, so they can\'t pull on electrons at all.'),
    S('You are trying to build a stable atom from scratch. Which piece do you need to act as the heavy peacekeeper so your atom doesn\'t destroy itself?',
      [O('neutron','The neutron',true), O('electron','The electron',false)],
      'Exactly. You need neutrons to wedge between the protons and hold the center together.',
      'Not quite. The electron flies around the outside. You need the neutron to keep the peace inside the center.')
  ],

  // After BB 020 — Weight and Twins (12 interactions)
  checkpoint_e: [
    S('Tap the wrong word to fix the sentence.\n\nIf you add an extra neutron to an atom, it instantly becomes a completely new element.',
      [O('weight','weight',true), O('electron','electron',false)],
      'Yep. Identity is tied strictly to protons. Neutrons just add weight.',
      'Actually, neutrons just change the weight. The element stays exactly the same.'),
    S('You are looking at a Carbon atom with 6 protons and 6 neutrons. You add another neutron to the nucleus. The label stays Carbon. Did adding that neutron change how the atom acts in a chemical reaction?',
      [O('no','No',true), O('yes','Yes',false)],
      'Exactly. The electrons handle the chemistry. The extra neutron is just dead weight in the center.',
      'Not quite. Neutrons have no charge, so they don\'t change the chemistry at all. It just gets heavier.'),
    { type: 'sorting', boxes: [
      { id: 'skin', label: 'Builds human skin' },
      { id: 'different', label: 'Builds a completely different material' }
    ], items: [
      { id: 'c12', label: 'A normal Carbon atom', box: 'skin' },
      { id: 'c14', label: 'A heavier Carbon isotope', box: 'skin' }
    ]},
    S('You tap the number 35.5 under Chlorine on the Periodic Table. A pile of different-sized Chlorine atoms appears. Is there a single Chlorine atom anywhere in the universe that actually weighs 35.5?',
      [O('no','No',true), O('yes','Yes',false)],
      'Yep. You can\'t have half a neutron. 35.5 is just the average of the whole pile.',
      'Not quite. Atoms can only have whole numbers of neutrons. 35.5 is just the average of a mixed handful.'),
    S('Isotopes are just two atoms with the same number of protons, but a different number of neutrons.',
      [O('true','True',true), O('false','False',false)],
      'Exactly. Same identity, different weight. That is the definition of an isotope.',
      'Actually, that is perfectly true. Same protons (identity), different neutrons (weight).'),
    S('You scoop up a handful of pure carbon from the ground. Are all the atoms in your hand going to weigh the exact same amount?',
      [O('no','No, it will be a mix of heavy and light twins',true), O('yes','Yes, they are all Carbon',false)],
      'Got it. In nature, most elements are a mix of light and heavy isotopes jumbled together.',
      'Not quite. In nature, elements exist as a mix of different isotopes. Some will be heavier than others.'),
    S('Tap the wrong word to fix the sentence.\n\nA heavy isotope of Oxygen breathes and acts totally differently than a normal Oxygen atom.',
      [O('identically','identically',true), O('unpredictably','unpredictably',false)],
      'Yep. An isotope is just wearing a heavier backpack. It still acts exactly like normal Oxygen.',
      'Actually, it acts identically. The extra neutrons don\'t change how it chemically behaves.'),
    { type: 'sorting', boxes: [
      { id: 'bench', label: 'The lab bench' }
    ], items: [
      { id: 'scale', label: 'A glass weighing scale', box: 'bench' },
      { id: 'tweezers', label: 'A pair of tweezers', box: null }
    ]},
    S('You have a sealed jar full of pennies. You know one penny weighs 2.5 grams. If you weigh the whole jar and it weighs 250 grams, do you need to open it to count them?',
      [O('no','No, I know there are 100 pennies',true), O('yes','Yes, I have to physically count them',false)],
      'Yep. By dividing the total weight by the weight of one piece, the scale counts them for you.',
      'Actually, you don\'t. The math does it for you. 250 divided by 2.5 means there are exactly 100 pennies in there.'),
    S('You crack open the nucleus. Protons and neutrons spill out. Which of these particles is completely responsible for making an isotope heavier?',
      [O('neutrons','The neutrons',true), O('protons','The protons',false)],
      'Got it. Changing the protons would change the element. Only the neutrons can change the weight safely.',
      'Not quite. If you added protons, you\'d make a new element. Isotopes are made heavier by extra neutrons.'),
    S('The weight listed on the Periodic Table is just a population average, like the average weight of dogs at a park.',
      [O('true','True',true), O('false','False',false)],
      'Yep. It just averages out all the heavy and light isotopes floating around in nature.',
      'Actually, it is true. The decimal weight is just an average of all the different isotopes in a handful.'),
    S('You take a Carbon-12 atom (6 neutrons) and a Carbon-14 atom (8 neutrons). You drop them both into a chemical reaction. Will one react differently than the other?',
      [O('no','No, they are chemically identical',true), O('yes','Yes, the heavier one reacts differently',false)],
      'Exactly. The electrons dictate the reaction. The neutrons in the center are just sitting there doing nothing.',
      'Actually, no. Neutrons have no charge, so they don\'t affect chemistry. Both atoms will react the exact same way.')
  ],

  // The Chemical Engine (Shells, Ions & Bonds)
  checkpoint_f: [
    S('A Chlorine atom has 7 electrons in its outer shell. One more electron is added and the shell reaches 8, locking into a stable, glowing state. Why do atoms constantly trade and share electrons?',
      [O('shell','To reach a perfectly full outer shell',true), O('heavier','To become heavier',false)],
      'Yep. Almost every chemical reaction is just an atom chasing the stability of 8 outer electrons.',
      'Not quite. Chemistry is driven by the Octet Rule. Atoms bond specifically to fill their outer shells.'),
    { type: 'sorting', boxes: [
      { id: 'positive', label: 'Becomes a positive Ion (+1)' },
      { id: 'negative', label: 'Becomes a negative Ion (-1)' }
    ], items: [
      { id: 'na', label: 'The Sodium atom', box: 'positive' }
    ]},
    S('A grain of table salt is examined at the atomic level. A massive, repeating 3D grid of alternating positive and negative ions appears. Are there individual, discrete "salt molecules" floating around inside this crystal?',
      [O('no','No, it is one endless continuous lattice',true), O('yes','Yes, billions of them',false)],
      'Got it. Ionic bonds do not form small, closed loops. They form massive, rigid, continuous grids.',
      'Actually, no. Ionic bonds create an endless, repeating grid of alternating charges, not individual molecules.'),
    S('Two non-metal atoms drift together. Both need more electrons to fill their shells, but neither is willing to give one away. What happens?',
      [O('share','They overlap and share an electron pair',true), O('repel','They repel and fly apart',false)],
      'Yep. The shared electrons act as glue holding both nuclei together. This is a Covalent bond.',
      'Not quite. They compromise. By sharing a pair of electrons between them, they lock together in a Covalent bond.'),
    S('Tap the wrong word to fix the sentence.\n\nA piece of copper wire bends instead of shattering because its atoms are locked into a rigid partnership.',
      [O('fluid','fluid, communal',true), O('brittle','brittle',false)],
      'Exactly. The positive atoms sit in a liquid "sea" of free-roaming electrons, allowing the layers to slide past each other without breaking.',
      'Actually, the atoms are in a fluid, communal partnership. The "sea of electrons" allows the metal to bend.'),
    S('Neon and Argon are highly reactive gases because their outer shells are completely empty.',
      [O('false','False',true), O('true','True',false)],
      'Yep, that\'s false. They react with absolutely nothing because their outer shells are already perfectly full.',
      'Actually, that\'s false. They are completely unreactive (Noble Gases) because they already have 8 electrons. They have nothing to gain or lose.')
  ],

  // Counting the Invisible (Moles & Formulas)
  checkpoint_g: [
    S('Tap the wrong word to fix the sentence.\n\nA mole is a magical chemical particle that weighs exactly 12 grams.',
      [O('counting','a massive counting number',true), O('atom','an invisible atom',false)],
      'Yep. A mole isn\'t a physical object. It is just a massive number (like a dozen), used to group tiny things together.',
      'Actually, a mole is just a number. It is exactly like saying "a dozen," just massively scaled up.'),
    { type: 'sorting', boxes: [
      { id: 'bench', label: 'The lab bench' }
    ], items: [
      { id: 'scale', label: 'A laboratory scale', box: 'bench' },
      { id: 'tweezers', label: 'A pair of tweezers', box: null }
    ]},
    S('The physical weight of a powder (80 grams) is pushed through the n = m / M bridge equation. The weight is divided by the Molar Mass, and outputs "2 Moles". Why do chemists convert grams into moles before running an experiment?',
      [O('ratio','Because chemical recipes only run on mole ratios',true), O('heavy','Because grams are too heavy',false)],
      'Got it. A chemical equation (like 2H₂ + O₂) dictates the exact ratio of atoms needed. It doesn\'t care how much they weigh.',
      'Actually, it is because chemical equations are recipes. They dictate the exact ratio of moles needed to make the reaction work.'),
    S('If a machine tells you a powder is 40% Carbon by mass, you instantly know the exact chemical formula.',
      [O('false','False',true), O('true','True',false)],
      'Yep, that\'s false. Mass percentages don\'t reveal the structure. You have to convert the masses into moles to find the actual ratio of atoms.',
      'Actually, that\'s false. Mass alone doesn\'t tell you the atomic structure. You have to convert to moles to find the ratio.'),
    S('An Empirical Formula is found with a simple 1:2:1 ratio (CH₂O). It weighs 30 grams. But lab tests prove the real molecule weighs 180 grams. What do you do?',
      [O('multiply','Multiply the entire formula by 6',true), O('add','Add 150 grams to the formula',false)],
      'Exactly. 180 divided by 30 is 6. You just multiply the simplest ratio by 6 to find the true, massive size of the molecule (C₆H₁₂O₆).',
      'Not quite. You find the multiplier by dividing the total weight by the simple weight (180 / 30 = 6). Then you multiply the formula by 6.')
  ],

  // Geometry of Matter (Shapes, Polarity & Networks)
  checkpoint_h: [
    S('A molecule is built with four electron pairs around a central atom. The pairs push to the corners of a tetrahedron. Why do the electron pairs push away from each other?',
      [O('repel','Because like-charges (negative) repel',true), O('heavy','Because they are too heavy',false)],
      'Yep. The negative electrons constantly push against one another, forcing the molecule into a highly specific 3D shape.',
      'Actually, it\'s because electrons carry a negative charge. In physics, like-charges violently repel each other.'),
    { type: 'sorting', boxes: [
      { id: 'o', label: 'The Oxygen atom' }
    ], items: [
      { id: 'neg', label: 'A slightly negative charge', box: 'o' },
      { id: 'pos', label: 'A slightly positive charge', box: null }
    ]},
    S('Carbon Dioxide (CO₂) has highly polar bonds. But it is perfectly straight (linear). Does the entire molecule carry a lopsided electrical charge?',
      [O('no','No, the pulls perfectly cancel out',true), O('yes','Yes, it is highly polar',false)],
      'Exactly. Because the oxygens pull in exact opposite directions, the tug-of-war is a tie. The molecule is neutral overall.',
      'Actually, no. Because the molecule is perfectly straight, the electrical pulls cancel each other out entirely.'),
    S('The two strands of DNA are held together by unbreakable, permanent covalent bonds.',
      [O('false','False',true), O('true','True',false)],
      'Yep, that\'s false. They are held together by weak Intermolecular forces (Hydrogen bonds) so they can easily unzip to be copied.',
      'Actually, that\'s false. They are held by weak Hydrogen bonds, acting like a zipper that can easily open and close.'),
    S('A carbon atom in a piece of Diamond is tapped. The atom is locked to 4 neighbors, who are locked to 4 neighbors, in an endless 3D grid. Are there individual, discrete molecules inside a diamond?',
      [O('no','No, the whole crystal is one continuous network',true), O('yes','Yes, millions of them',false)],
      'Got it. There are no separate molecules. The entire physical crystal is locked together as one giant structure.',
      'Actually, no. In a giant covalent network, the bonds never stop. The entire crystal is essentially one massive molecule.'),
    S('Tap the wrong word to fix the sentence.\n\nGraphite is much softer than Diamond because it is built out of an entirely different element.',
      [O('shape','geometric shape',true), O('liquid','chemical liquid',false)],
      'Exactly. They are both made of 100% pure Carbon. The only difference is the 3D geometry of how the atoms connect.',
      'Actually, they are both pure Carbon. Graphite is soft because it forms flat, sliding sheets instead of a rigid 3D pyramid.')
  ],

  // The Electron Ladder (Shells & The Octet)
  checkpoint_i: [
    S('An atom is tapped to reveal its electron arrangement. Rings appear: 2 electrons fill the innermost shell, then 8 fill the next, then 8 fill the outermost. Do electrons orbit randomly like a swarm of bees?',
      [O('no','No, they sit in strict layers',true), O('yes','Yes, they fly everywhere',false)],
      'Yep. They are forced into specific shells, filling up from the inside out.',
      'Actually, no. They sit in highly structured layers, or shells, completely dictated by strict capacities.'),
    S('Tap the wrong word to fix the sentence.\n\nThe inner electrons completely dictate how an atom will react, while the outer electrons do nothing.',
      [O('valence','valence (outer)',true), O('heaviest','heaviest',false)],
      'Exactly. The outermost layer (the valence shell) is the only layer that matters for chemical reactions.',
      'Not quite. The outer electrons (valence shell) do all the work. The inner ones are buried and mostly ignore the outside world.'),
    S('An atom has 6 electrons in its valence shell. What is the exact number it wants to reach to become stable?',
      [O('8','8',true), O('6','6',false), O('10','10',false)],
      'Got it. Atoms constantly hunt for a completely full outer shell, which for most elements means exactly 8 electrons.',
      'Actually, the magic number is 8. The Octet Rule dictates that an atom is only stable when its outer shell holds exactly 8 electrons.'),
    S('Elements sitting in the exact same vertical column on the Periodic Table behave completely differently from each other.',
      [O('false','False',true), O('true','True',false)],
      'Yep, that\'s false. Because they share the exact same number of outer electrons, they behave almost identically.',
      'Actually, that\'s false. Elements in the same column have the exact same number of valence electrons, meaning they react in the exact same way.'),
    { type: 'sorting', boxes: [
      { id: 'reactive', label: 'Violently reactive' },
      { id: 'inert', label: 'Completely inert' }
    ], items: [
      { id: 'neon', label: 'Neon (8 outer electrons)', box: 'inert' }
    ]},
    S('Sodium has 1 outer electron. Chlorine has 7. What is the fundamental reason these two atoms react with each other?',
      [O('octet','To reach a full shell of 8',true), O('heavy','To become a heavier element',false)],
      'Exactly. Sodium dumps its 1 electron to empty its shell, and Chlorine grabs it to hit 8. Both achieve stability.',
      'Actually, it is purely to satisfy the Octet Rule. They trade an electron so both can end up with a perfectly full outer shell.')
  ],

  // The Charged Grid (Ions & Salt)
  checkpoint_j: [
    S('Tap the wrong word to fix the sentence.\n\nIf a neutral atom throws away a negative electron, the atom becomes a neutral ion.',
      [O('positive','positive',true), O('negative','negative',false)],
      'Got it. It lost a negative charge, meaning the positive protons now outnumber the electrons.',
      'Not quite. By losing a negative piece, the atom is left with more positive protons than negative electrons. It becomes positive.'),
    S('A positive Sodium ion (+1) sits next to a negative Chlorine ion (−1). The two ions slam together violently. What physical force holds these two atoms together?',
      [O('electrostatic','Electrostatic attraction',true), O('hooks','Physical hooks',false)],
      'Yep. Opposite charges attract. That powerful electrostatic grip is an Ionic Bond.',
      'Actually, it is purely electrostatic. Opposite electrical charges pull toward each other like powerful magnets.'),
    S('A grain of salt is made of billions of tiny, separate "NaCl" molecules tumbling past each other.',
      [O('false','False',true), O('true','True',false)],
      'Exactly, that\'s false. There are no separate molecules in salt. It is one massive, continuous grid of alternating ions.',
      'Actually, that\'s false. Ionic bonds do not form discrete molecules. They form massive, continuous 3D grids called lattices.'),
    { type: 'sorting', boxes: [
      { id: 'harmless', label: 'Harmless table salt' },
      { id: 'deadly', label: 'A deadly, explosive mixture' }
    ], items: [
      { id: 'nacl', label: 'Sodium Chloride (NaCl)', box: 'harmless' }
    ]},
    S('A hammer strikes a salt crystal. The grid shifts slightly, forcing positive Sodium ions to sit directly next to other positive Sodium ions. What happens?',
      [O('shatter','The crystal shatters',true), O('bend','The crystal bends',false)],
      'Exactly. Like-charges repel. The instant the positive ions align, they violently push each other apart, snapping the crystal cleanly.',
      'Actually, it shatters. When the grid shifts, like-charges align. Because like-charges repel, the crystal physically rips itself apart.'),
    S('An ionic lattice is held together by immense electrical forces pulling in every direction. What temperature is required to melt it?',
      [O('high','Extremely high heat (~800°C)',true), O('low','Moderate warmth (~100°C)',false)],
      'Got it. Because the grid is so tightly locked by electrostatic attraction, it requires massive thermal energy to break the bonds.',
      'Not quite. It requires extreme heat. Ionic lattices have incredibly high melting points because the electrical grip is so strong.')
  ],

  // Sharing & Swirling (Covalent & Metallic)
  checkpoint_k: [
    { type: 'sorting', boxes: [
      { id: 'covalent', label: 'Covalent Bonding (overlap and share)' },
      { id: 'ionic', label: 'Ionic Bonding (one steals an electron)' }
    ], items: [
      { id: 'oxygen', label: 'Two Oxygen atoms — both need 2 electrons', box: 'covalent' }
    ]},
    S('A glass of water sits on a table. How is the water structurally different from a crystal of salt?',
      [O('discrete','It is made of discrete, separate molecules',true), O('grid','It is an endless 3D grid',false)],
      'Exactly. Covalent bonds form finite packages (molecules). The H₂O molecules tumble past each other, which is why water is a liquid.',
      'Actually, water is made of billions of individual, separated H₂O molecules. Salt is an endless grid.'),
    S('A block of solid copper is tapped to reveal how the atoms are bonded. A grid of positive cores appears, surrounded by a swirling blue liquid. Do metal atoms share electrons in neat, isolated pairs?',
      [O('no','No, they pool them communally',true), O('yes','Yes, just like water',false)],
      'Got it. The outer electrons are completely unleashed, flowing freely between the atoms like a liquid sea.',
      'Not quite. Metals release their outer electrons into a massive, shared communal pool called a "sea of electrons."'),
    S('If a voltage is applied to a copper wire, the "sea of electrons" instantly drifts down the wire, creating an electric current.',
      [O('true','True',true), O('false','False',false)],
      'Yep. Because the outer electrons are completely free to roam, metals conduct electricity effortlessly.',
      'Actually, that\'s true. The free-roaming electrons are easily pushed by voltage, which is exactly how electrical currents flow.'),
    S('Tap the wrong word to fix the sentence.\n\nA piece of metal bends when struck by a hammer because its atoms are locked into a brittle grid.',
      [O('fluid','fluid',true), O('fragile','fragile',false)],
      'Exactly. Because the atoms sit in a fluid sea of electrons, the layers can slide past each other without breaking the bond.',
      'Actually, the bond is fluid. The sea of electrons acts like a lubricant, allowing the heavy atoms to slide without shattering.'),
    { type: 'sorting', boxes: [
      { id: 'covalent_box', label: 'Covalent Bond' },
      { id: 'ionic_box', label: 'Ionic Bond' }
    ], items: [
      { id: 'transferred', label: 'Electrons are completely transferred', box: 'ionic_box' },
      { id: 'shared', label: 'Electrons are shared in pairs', box: 'covalent_box' }
    ]}
  ]
};

// ── The Bit workshops ──

export const BIT_WORKSHOPS = {

  // After BB 003 — Switches and Pipes (12 interactions)
  checkpoint_a: [
    S('The guard on the Great Wall looks up and sees a perfectly clear, empty blue sky. In the language of computing, what did he just receive?',
      [O('zero','A zero',true), O('nothing','Nothing at all',false)],
      'Yep. An empty sky is a specific state. It means zero.',
      'Not quite. An empty sky isn\'t just "nothing." It\'s a specific message that means zero.'),
    S('Tap the wrong word in this sentence to fix it.\n\nA bit is a piece of complex math that a computer calculates.',
      [O('choice','a simple choice',true), O('equation','a difficult equation',false)],
      'Exactly. A bit isn\'t math. It\'s just a choice between on and off.',
      'Actually, a bit isn\'t math at all. It\'s just a choice between yes and no.'),
    { type: 'sorting', boxes: [
      { id: 'one', label: '1' },
      { id: 'zero', label: '0' }
    ], items: [
      { id: 'closed', label: 'A closed switch with electricity flowing through it', box: 'one' }
    ]},
    S('Tap the name "George Boole" to look inside his algebra system. The words TRUE and FALSE appear. Do you need to know how to multiply or divide to use Boolean logic?',
      [O('no','No',true), O('yes','Yes',false)],
      'Yep. It\'s entirely built on simple Yes or No decisions. No math required.',
      'Actually, no. It doesn\'t use numbers like that. It just uses True and False.'),
    S('You are wiring an AND gate. The first switch is ON. You slide the second switch to ON and the light bulb lights up. What happens if you slide it back to OFF?',
      [O('out','The light goes out',true), O('on','The light stays on',false)],
      'Exactly. In an AND gate, both switches must be ON, or the whole path is broken.',
      'Not quite. If you turn one off in an AND gate, the physical path breaks and the light goes out.'),
    S('In an OR gate, if you turn on the top switch AND the bottom switch at the same time, the machine breaks.',
      [O('false','False',true), O('true','True',false)],
      'Yep, that\'s false. If both are on, the electricity just flows through both paths to the bulb. It still turns on.',
      'Actually, that\'s false. If both are on, the electricity just has two paths it can take. The light still turns on.'),
    { type: 'sorting', boxes: [
      { id: 'switch', label: 'An electrical switch' },
      { id: 'wire', label: 'A copper wire' }
    ], items: [
      { id: 'valve', label: 'A physical plumbing valve', box: 'switch' }
    ]},
    S('You tap to open the first valve on a straight, single water pipe. Water flows past the first valve and slams into the second closed valve. Which logic gate did we just build out of pipes?',
      [O('and','An AND gate',true), O('or','An OR gate',false)],
      'Yep. Because they are on the exact same pipe, you need the first AND the second valve open.',
      'Not quite. Because it\'s one straight pipe, the first AND the second must be open. It\'s an AND gate.'),
    S('Tap the wrong word to fix the sentence.\n\nTo build an OR gate out of plumbing, you need to put two valves on a straight pipe.',
      [O('Y-shaped','Y-shaped',true), O('broken','broken',false)],
      'Exactly. You have to split the pipe so the water has two different paths it can take.',
      'Actually, a straight pipe makes an AND gate. To make an OR gate, you need a Y-shaped pipe.'),
    S('You have a Y-shaped pipe with a top valve and a bottom valve. You shut the top valve completely. You open the bottom valve. Does water come out the faucet?',
      [O('yes','Yes',true), O('no','No',false)],
      'Yep. As long as the bottom OR the top is open, the water finds a way around.',
      'Not quite. Because the pipe is split, the water just ignores the top, takes the bottom path, and comes out the faucet.'),
    S('A computer microchip is basically just billions of microscopic plumbing valves routing electricity instead of water.',
      [O('true','True',true), O('false','False',false)],
      'Exactly. It\'s just millions of microscopic paths opening and closing to make decisions.',
      'Actually, that\'s perfectly true. A chip is just billions of tiny switches routing electricity exactly like pipes and valves.'),
    S('Imagine you build a water pipe with no valves on it at all. The water just flows constantly, forever. Can you use this pipe to send a message to someone?',
      [O('no','No',true), O('yes','Yes',false)],
      'Got it. If it can\'t change states (on and off), it\'s just a pipe. You need at least two states to carry a signal.',
      'Actually, no. If the water never stops, you can\'t use it to signal anything. You need to be able to turn it on and off.')
  ],

  // After BB 006 — Logic and Gates (Textbook Edition) (12 interactions)
  checkpoint_b: [
    S('Tap the term "Bit" to reveal what the word actually stands for. The words "Binary Digit" appear. What does the word "Binary" mean in this context?',
      [O('two','Exactly two options',true), O('complex','A complex math equation',false)],
      'Yep. Binary simply means two. On or Off. 1 or 0.',
      'Not quite. Binary just means two. A bit only ever has two possible states.'),
    { type: 'sorting', boxes: [
      { id: 'one', label: '1' },
      { id: 'zero', label: '0' }
    ], items: [
      { id: 'true', label: 'The logic state of "True"', box: 'one' }
    ]},
    S('If a computer encounters a 1 and a 0, it adds them together mathematically to get a 1.',
      [O('false','False',true), O('true','True',false)],
      'Yep, that\'s false. At this level, it isn\'t doing math. It is just comparing True and False states.',
      'Actually, that\'s false. The computer isn\'t adding numbers here. It is just looking at logic states (Yes and No).'),
    S('In an AND gate, Input A is 1. You slide Input B. To get the Output to be 1, what must Input B be?',
      [O('1','1',true), O('0','0',false)],
      'Got it. In an AND gate, Input A and Input B must both be 1 to get a 1 out.',
      'Not quite. To get a 1 out of an AND gate, both inputs must be 1.'),
    S('Tap the wrong word to fix the sentence.\n\nIn Boolean algebra, if an AND gate receives a 1 and a 0, the final output will be True.',
      [O('False','False',true), O('1','1',false)],
      'Exactly. If even one input is 0 (False), an AND gate instantly outputs a 0 (False).',
      'Actually, because one of the inputs is a 0, the AND gate outputs a 0 (False).'),
    S('An OR gate receives two inputs. Input A is 0. Input B is 1. What does the gate output?',
      [O('1','1',true), O('0','0',false)],
      'Yep. As long as A or B is a 1, an OR gate will output a 1.',
      'Not quite. Because Input B is a 1, the OR gate is satisfied and outputs a 1.'),
    { type: 'sorting', boxes: [
      { id: 'zero', label: 'Output is 0' },
      { id: 'one', label: 'Output is 1' }
    ], items: [
      { id: 'or00', label: 'An OR gate receiving a 0 and a 0', box: 'zero' }
    ]},
    S('You tap the text to see how engineers draw an AND gate on a circuit blueprint. The D-shaped symbol appears, with two lines going in and one coming out. Why are there two lines going in, but only one line coming out?',
      [O('compare','Because it compares two inputs to make one final decision',true), O('half','Because the electricity is cut in half',false)],
      'Exactly. The gate looks at both inputs, compares them, and spits out a single True or False answer.',
      'Not quite. It takes two signals, compares them based on its rules, and outputs one final decision.'),
    S('If an OR gate receives a 1 and a 1, it gets confused and outputs a 0.',
      [O('false','False',true), O('true','True',false)],
      'Yep, that\'s false. An OR gate just needs at least one True signal. If it gets two, it happily outputs a 1.',
      'Actually, that\'s false. If it receives two 1s, the "OR" condition is easily met, and it outputs a 1.'),
    S('You need a security system that only unlocks the door if a person scans a keycard (1) AND enters a PIN code (1). Which gate should you wire into the lock?',
      [O('and','An AND gate',true), O('or','An OR gate',false)],
      'Yep. An AND gate guarantees the door stays locked if they only do one of the two things.',
      'Not quite. If you used an OR gate, they could just scan the card without knowing the PIN, and the door would open. You need an AND gate.'),
    S('Tap the wrong word to fix the sentence.\n\nA modern computer processor is made of gears that physically turn to calculate Boolean logic.',
      [O('switches','microscopic switches',true), O('wire','a single wire',false)],
      'Exactly. There are no moving physical parts. It is just billions of microscopic switches routing electricity.',
      'Actually, modern computers have no moving parts like gears. They use microscopic electrical switches.'),
    S('You have an AND gate. The first input is 0. Do you even need to look at the second input to know what the output will be?',
      [O('no','No',true), O('yes','Yes',false)],
      'Got it. The second a 0 hits an AND gate, the whole thing fails. The output will be 0 no matter what the other input is.',
      'Actually, you don\'t. Because an AND gate requires both to be 1, a single 0 means the output is guaranteed to be 0.')
  ],

  // The Physical Switch (Hardware & Software)
  checkpoint_c: [
    S('If an Adder circuit is handed electrical signals representing a 2 and a 3, it outputs a 5. Does the computer actually "know" what a 5 is?',
      [O('no','No, it just routed electricity through logic gates',true), O('yes','Yes, it calculated the math in its brain',false)],
      'Yep. The physical architecture of the gates just forces the electricity down a specific path. It is purely mechanical.',
      'Actually, no. The computer has no brain. The physical wiring of the AND and OR gates just guarantees the electricity exits on the correct wire.'),
    S('An English code instruction is tapped. A "Compiler" instantly translates the text into a massive wall of 1s and 0s. Why is a compiler necessary?',
      [O('binary','The processor only understands On and Off',true), O('fast','The processor is too fast for English',false)],
      'Exactly. The hardware only understands raw electricity. The compiler does the heavy lifting of translating human logic into electrical switches.',
      'Not quite. A processor cannot read words at all. It only understands physical electricity turning on and off (1s and 0s).'),
    S('If the steps of an algorithm are executed out of order, the computer will automatically fix the sequence.',
      [O('false','False',true), O('true','True',false)],
      'Yep, that\'s false. A computer is blind. It will execute the steps exactly as written, even if it completely ruins the task.',
      'Actually, that\'s false. A computer has no intelligence. If the recipe is written out of order, the machine will blindly execute it and fail.'),
    { type: 'sorting', boxes: [
      { id: 'board', label: 'The circuit board' }
    ], items: [
      { id: 'diode', label: 'A Diode', box: 'board' },
      { id: 'wire', label: 'A Copper Wire', box: null }
    ]},
    S('Tap the wrong word to fix the sentence.\n\nA transistor is able to flip on and off billions of times a second because it uses microscopic moving parts.',
      [O('solid','solid, motionless',true), O('mechanical','heavy, mechanical',false)],
      'Exactly. The transistor was a revolution because it has absolutely no moving parts to break or wear out.',
      'Actually, the transistor has zero moving parts. It is just a solid block of chemicals that changes how it conducts electricity.'),
    S('An "If/Then" branch is written. The logic path slides to the "False" outcome, routing to the "Error Screen" wire. Does this branch require the computer to make a complex moral decision?',
      [O('no','No, it is just Boolean logic',true), O('yes','Yes, it must weigh the options',false)],
      'Yep. It is purely mathematical. If the password matches, the electricity goes one way. If it doesn\'t, it goes the other.',
      'Not quite. An If/Then statement is just simple Boolean logic. The electricity is just physically routed based on a True or False check.')
  ]
};

export function getBitWorkshop(checkpointIndex) {
  const keys = Object.keys(BIT_WORKSHOPS);
  if (checkpointIndex < keys.length) {
    return BIT_WORKSHOPS[keys[checkpointIndex]];
  }
  return null;
}

// ── Physics workshops ──

export const PHYS_WORKSHOPS = {

  // After BB 003 — Building the Universe (12 interactions)
  checkpoint_a: [
    { type: 'sorting', boxes: [
      { id: 'base', label: 'Base Unit (A raw brick)' },
      { id: 'derived', label: 'Derived Unit (Bricks snapped together)' }
    ], items: [
      { id: 'meter', label: 'The Meter', box: 'base' },
      { id: 'speed', label: 'Speed (meters per second)', box: 'derived' }
    ]},
    S('Tap the trench coat to pull the mask off a "Newton." The word Newton vanishes, revealing kg·m/s². Does a Newton use completely new math?',
      [O('no','No',true), O('yes','Yes',false)],
      'Exactly. It is just the standard kilograms, meters, and seconds hiding under a shorter name.',
      'Actually, no. There is no new math. It is just a messy combination of the big three base units, given a nickname.'),
    S('You are taking a physics test. You do a massive calculation to figure out how far a car traveled. Your final answer is "45 kilograms." Do you need to double-check your math?',
      [O('yes','Yes, immediately',true), O('no','No, that makes sense',false)],
      'Got it. This is the built-in lie detector. Distance is measured in meters, so if you end up with kilograms, your math is definitely wrong.',
      'Actually, yes. Distance cannot be measured in kilograms (weight). The units instantly tell you the math is wrong.'),
    S('Tap the wrong word to fix the sentence.\n\nWhen you multiply speed (meters/second) by time (seconds), the seconds cancel out, leaving you with just kilograms.',
      [O('meters','meters',true), O('scalar','a scalar',false)],
      'Yep. The seconds on the top and bottom cancel out perfectly, leaving just the distance (meters).',
      'Not quite. If you cancel out the seconds, the only word left is meters.'),
    S('The prefix "Kilo" (like in kilometer) is a brand new base unit.',
      [O('false','False',true), O('true','True',false)],
      'Exactly, that is false. Kilo isn\'t a unit at all. It is just a quick shorthand command that means "multiply by 1,000."',
      'Actually, that is false. Kilo is just a prefix. It just tells you to slide the decimal point.'),
    S('You are looking at a 1-meter dog. You slide the bar to jump exactly one order of magnitude larger — from 1 to 10. In physics, does an order of magnitude just mean "a little bit bigger"?',
      [O('no','No, it means exactly 10 times bigger',true), O('yes','Yes, it is just an estimate',false)],
      'Yep. Physics scales the universe in clean jumps of 10.',
      'Not quite. An order of magnitude is a very specific jump. It means multiplying by 10.'),
    S('I blindfold you and tell you there is a million dollars exactly 10 meters away from where you are standing. Can you walk straight to it?',
      [O('no','No',true), O('yes','Yes',false)],
      'Exactly. You have the amount (10) and the unit (meters), but you are missing the direction.',
      'Actually, you can\'t. You know exactly how far it is, but you don\'t know which way to walk.'),
    { type: 'sorting', boxes: [
      { id: 'scalar', label: 'Scalar (Amount only)' },
      { id: 'vector', label: 'Vector (Amount + Direction)' }
    ], items: [
      { id: 'temp', label: '70 degrees Fahrenheit', box: 'scalar' },
      { id: 'car', label: '60 miles per hour, heading North', box: 'vector' }
    ]},
    S('Tap the police officer\'s radar gun to see what it measures. A screen pops up: "85 MPH". Does a standard radar gun measure your velocity?',
      [O('no','No, it only measures speed',true), O('yes','Yes, it measures velocity',false)],
      'Yep. It doesn\'t care if you are driving toward New York or Miami. Because it doesn\'t track direction, it only measures speed (a scalar).',
      'Actually, no. Velocity requires a direction. The radar gun just gives a raw number, which is speed.'),
    S('Tap the wrong word to fix the sentence.\n\nBecause mass has no direction, your weight in kilograms is classified as a vector.',
      [O('scalar','scalar',true), O('derived','derived unit',false)],
      'Exactly. Whether you face up, down, or sideways, your mass doesn\'t change. It is just an amount (a scalar).',
      'Not quite. Mass has no direction, which makes it a scalar.'),
    S('You are driving a car in a perfect, continuous circle at exactly 60 miles per hour. Your velocity is constantly changing.',
      [O('true','True',true), O('false','False',false)],
      'Yep. Even though your speed is locked at 60, your steering wheel is turning. If direction changes, velocity changes.',
      'Actually, it is true. Because velocity is an amount plus a direction, constantly turning the wheel means your velocity is constantly changing.'),
    S('You are programming a self-driving car. If you only program the car to understand scalars, will it be able to safely navigate a city?',
      [O('no','No',true), O('yes','Yes',false)],
      'Got it. It would know how fast to go, but it wouldn\'t know when to turn or which way to steer. Physics requires vectors to navigate reality.',
      'Actually, no. A scalar only tells you amounts (like speed). To navigate, the car must understand direction (vectors).')
  ],

  // The Laws of Motion (Newton & Kinematics)
  checkpoint_b: [
    S('A mountain-sized asteroid is falling toward Earth. Its speed is 20 kilometers per second. Why is this specifically a velocity and not just a speed?',
      [O('aimed','Because it is aimed dead at the ground',true), O('fast','Because it is moving very fast',false)],
      'Exactly. Speed is just the raw number. Velocity is that number paired with a specific direction.',
      'Not quite. Extreme speed is still just a scalar. It becomes a velocity because it has a specific direction (toward the ground).'),
    S('Tap the wrong word to fix the sentence.\n\nAccording to Newton\'s First Law, an object in motion will naturally fade to a halt unless a force keeps it moving.',
      [O('coast','coast forever',true), O('explode','explode',false)],
      'Yep. Motion doesn\'t fade on its own. It requires friction or an obstacle to physically stop it.',
      'Actually, an object in motion will coast forever in a straight line. It only stops because friction or air resistance forces it to.'),
    { type: 'sorting', boxes: [
      { id: 'cancel', label: 'Cancel each other out' },
      { id: 'unbalanced', label: 'Create an unbalanced force' }
    ], items: [
      { id: 'gravity', label: 'Gravity pulling down', box: 'cancel' },
      { id: 'table', label: 'The table pushing up', box: 'cancel' }
    ]},
    S('A cart is being pushed with a steady force. The cart is filled with heavy bricks and visually slows down. According to the equation F = ma, what happens to acceleration when mass increases but the force stays the same?',
      [O('drops','Acceleration drops',true), O('rises','Acceleration rises',false)],
      'Yep. The heavier the object, the more force is required to move it. If the force doesn\'t change, the acceleration must drop.',
      'Actually, acceleration drops. If a mass gets heavier, the exact same push will move it much slower.'),
    S('When a rifle fires, the bullet is pushed forward with much more force than the rifle is pushed backward.',
      [O('false','False',true), O('true','True',false)],
      'Exactly, that\'s false. The force is identical on both sides. The bullet just moves faster because it has a tiny mass.',
      'Actually, that\'s false. The force is exactly equal in both directions. The bullet just accelerates faster because it is incredibly light.'),
    S('A rocket engine fires in the empty vacuum of space. Exhaust shoots backward; the rocket moves forward. Since there is no air in space, what is the rocket pushing against?',
      [O('exhaust','Its own exhaust',true), O('space','The fabric of space',false)],
      'Got it. By throwing mass backward, it credits itself with forward momentum to balance the ledger.',
      'Not quite. A rocket pushes against its own fuel. It throws exhaust backward, which forces the ship forward.')
  ],

  // Relativity & Measurement (Frames & Errors)
  checkpoint_c: [
    S('A train travels East at 10 meters per second. A passenger walks toward the back of the train at 2 meters per second. How fast is the passenger moving relative to the ground outside?',
      [O('8','8 meters per second, East',true), O('12','12 meters per second, East',false)],
      'Yep. The backward walking speed simply subtracts from the forward train speed.',
      'Not quite. Because they are walking backward against the direction of the train, their speed relative to the ground drops to 8 meters per second.'),
    { type: 'sorting', boxes: [
      { id: 'vertical', label: 'Sees rain falling vertically' },
      { id: 'slant', label: 'Sees rain hitting at an aggressive slant' }
    ], items: [
      { id: 'person', label: 'A stationary person on the sidewalk', box: 'vertical' },
      { id: 'driver', label: 'A driver in a car moving 60 mph', box: 'slant' }
    ]},
    S('Tap the wrong word to fix the sentence.\n\nIf a digital scale is broken and constantly reads 5 grams too heavy, taking the average of a thousand trials will fix the error.',
      [O('fail','fail to change',true), O('randomize','randomize',false)],
      'Got it. A systematic error bakes a bias into the math. Averaging only fixes random, scattered noise.',
      'Actually, averaging will fail to fix it. Averaging a thousand biased readings just results in an average that is 5 grams too heavy.'),
    S('To cut the uncertainty of a measurement in half, an instrument must be tested exactly twice as many times.',
      [O('false','False',true), O('true','True',false)],
      'Yep, that\'s false. It requires four times as many tests. The math has a strict law of diminishing returns.',
      'Actually, that\'s false. Because of the law of diminishing returns, cutting the error in half requires four times as many trials.'),
    S('A single atom of oxygen floats in a vacuum. Does this single atom have a temperature?',
      [O('no','No',true), O('yes','Yes',false)],
      'Exactly. Temperature is the average speed of billions of atoms bouncing off each other. A single particle cannot be hot or cold.',
      'Not quite. Temperature is an emergent property. It only exists when billions of atoms interact. A single atom has no temperature.')
  ],

  // The Edge of Physics (Dimensions & Newton)
  checkpoint_d: [
    S('Tap the equals sign on this equation: Force = mass + velocity. The equation flashes RED and breaks apart. Why did the equation fail before numbers were even plugged in?',
      [O('dimensions','The dimensional units do not match',true), O('fast','Velocity is too fast to add',false)],
      'Yep. The Homogeneity Principle dictates that you cannot add different dimensions together. You can\'t add mass to speed.',
      'Not quite. According to the Homogeneity Principle, every piece of an equation must share the exact same underlying dimensional units.'),
    S('How did physicist G.I. Taylor deduce the highly classified energy yield of the first atomic bomb just by looking at a photograph of the fireball?',
      [O('dimensions','He mathematically balanced the visible dimensions (Length and Time) against the dimensions of Energy',true), O('stole','He stole the blueprints',false)],
      'Exactly. By forcing the dimensions on both sides of the equation to match, he mathematically cornered the exact explosive yield.',
      'Actually, he used Dimensional Analysis. By perfectly balancing the visible units (Length, Time, Mass), the math revealed the secret.'),
    S('In coordinate geometry, a computer proves a shape is a rectangle by looking at a picture of it.',
      [O('false','False',true), O('true','True',false)],
      'Yep, that\'s false. A computer proves it by running the Distance and Slope formulas to verify the math is perfect.',
      'Actually, that\'s false. A visual image can be deceptive. The computer calculates the exact length and angle of every line to prove it.'),
    { type: 'sorting', boxes: [
      { id: 'broken', label: 'The broken orbit' }
    ], items: [
      { id: 'mercury', label: 'Mercury', box: 'broken' },
      { id: 'neptune', label: 'Neptune', box: null }
    ]}
  ],

  // The Illusion of Stillness (Equilibrium)
  checkpoint_e: [
    S('A cargo ship sits motionless on a calm ocean. Massive red and blue arrows appear: Gravity pulls down, Buoyancy pushes up. Does "motionless" mean there are no forces acting on the ship?',
      [O('no','No, the forces are perfectly balanced',true), O('yes','Yes, forces only exist when things move',false)],
      'Exactly. "At rest" is just a disguise. It means the forces are in a dead heat, canceling each other out entirely.',
      'Actually, no. Massive forces are acting on the ship at all times. It doesn\'t move because those forces are perfectly balanced.'),
    S('Tap the wrong word to fix the sentence.\n\nIf you push a car on a sheet of frictionless ice in a vacuum, the car will eventually stop on its own.',
      [O('coast forever','coast forever',true), O('explode','explode',false)],
      'Yep. Without friction to bleed the energy away, motion simply persists. Things do not stop unless forced to.',
      'Actually, it would coast forever. Things do not naturally stop. They only stop because a force (like friction) pushes back against them.'),
    S('The ship\'s engine is off. Gravity and Buoyancy are perfectly matched. The throttle is pushed forward — a massive forward arrow appears and the ship begins to move. What caused the motion to finally change?',
      [O('unbalanced','An unbalanced force was added',true), O('gravity','Gravity disappeared',false)],
      'Got it. Motion only changes the instant the balance breaks. The engine provided a force that wasn\'t canceled out.',
      'Not quite. Motion changes because a new, unbalanced force was added by the engine, breaking the perfect equilibrium.'),
    S('If a car is cruising down the highway at a perfectly steady 60 miles per hour, the net force on the car is zero.',
      [O('true','True',true), O('false','False',false)],
      'Yep. Because the speed isn\'t changing (accelerating or braking), the engine\'s push is perfectly matched by the air\'s drag.',
      'Actually, that\'s true. If velocity isn\'t changing, acceleration is zero. And if acceleration is zero, the net force must be perfectly balanced at zero.'),
    { type: 'sorting', boxes: [
      { id: 'cause', label: 'A force causes...' }
    ], items: [
      { id: 'change', label: 'a change in motion', box: 'cause' }
    ]},
    S('A steel block sits under a hydraulic press. The press pushes down with ten tonnes of force. The block doesn\'t move a millimeter. Why?',
      [O('table','The table underneath pushes up with exactly ten tonnes',true), O('off','The press isn\'t turned on',false)],
      'Yep. Action and reaction. The table pushes back exactly as hard as the press pushes down, keeping the block perfectly balanced.',
      'Actually, the table underneath is pushing back up with the exact same ten tonnes of force, perfectly balancing the equation.')
  ],

  // The Invisible Anchor (Mass vs. Weight)
  checkpoint_f: [
    S('Tap the wrong word to fix the sentence.\n\nIf an astronaut takes their bathroom scale to the Moon, it will show a smaller number because they have lost mass.',
      [O('weight','weight',true), O('gravity','gravity',false)],
      'Exactly. Mass is the amount of physical stuff in a body. It never changes. The scale just reads less weight because the Moon\'s gravity is weaker.',
      'Actually, mass never changes. The scale reads less because the weight (the pull of gravity) is weaker on the Moon.'),
    { type: 'sorting', boxes: [
      { id: 'stuff', label: 'An amount of stuff' },
      { id: 'force', label: 'A physical force' }
    ], items: [
      { id: 'mass', label: 'Mass (Kilograms)', box: 'stuff' },
      { id: 'weight', label: 'Weight (Newtons)', box: 'force' }
    ]},
    S('An astronaut floats in deep, empty space, far from any gravity. Does the astronaut weigh anything? Does the astronaut have mass?',
      [O('zeromass','Weight is zero, but Mass remains the same',true), O('bothzero','Both are zero',false)],
      'Yep. With no gravity, weight hits zero. But if you try to push the astronaut, they will still resist moving. That resistance is their mass.',
      'Actually, weight drops to zero because there is no gravity. But mass (the amount of stuff) remains exactly the same.'),
    S('A hammer and a feather are dropped in a vacuum chamber with no air resistance. Both objects fall perfectly side-by-side. Why do they hit the ground at the exact same instant?',
      [O('rate','Gravity accelerates all masses at the exact same rate',true), O('heavier','The feather got heavier',false)],
      'Exactly. In the equation W = mg, the mass cancels out. Every single object falls at the exact same rate of acceleration.',
      'Not quite. In a vacuum, gravity accelerates every single object at the exact same rate, regardless of how heavy it is.'),
    S('A heavy bowling ball hits the ground with more force than a golf ball because gravity accelerates it faster.',
      [O('false','False',true), O('true','True',false)],
      'Yep, that\'s false. They both accelerate at the exact same speed. The bowling ball hits harder purely because it has more mass behind that speed.',
      'Actually, that\'s false. Gravity accelerates both balls at the exact same speed. The bowling ball just hits harder because it has more mass.'),
    S('Why is it harder to push a broken-down truck than a broken-down motorcycle?',
      [O('mass','The truck has more mass, requiring more force to accelerate it',true), O('gravity','The truck has more gravity',false)],
      'Got it. F = ma. If mass is huge, an enormous amount of force is needed to achieve even a tiny bit of acceleration.',
      'Not quite. It is harder to push because the truck has more mass, meaning it requires exponentially more force to accelerate.')
  ],

  // The Moving Baseline (Relative Velocity)
  checkpoint_g: [
    S('A person walks 2 miles per hour toward the front of a train. The train moves 50 miles per hour forward. How fast is the person moving relative to the tracks outside?',
      [O('52','52 miles per hour',true), O('50','50 miles per hour',false)],
      'Exactly. The velocities simply add together.',
      'Not quite. The walking speed simply adds to the train\'s speed, making the velocity 52 mph relative to the ground.'),
    S('A car drives 60 miles per hour through a windless rainstorm. The rain appears to streak aggressively backward across the window. Did the rain suddenly change direction?',
      [O('no','No, the car\'s forward motion makes the rain look slanted',true), O('yes','Yes, the wind picked up',false)],
      'Yep. The vertical fall of the rain and the forward motion of the car combine into a single, diagonal relative velocity.',
      'Actually, no. The rain is still falling straight down. The combination of the rain falling and the car rushing forward creates a slanted visual streak.'),
    S('There is a secret, hidden point in the center of the universe that is absolutely, perfectly still.',
      [O('false','False',true), O('true','True',false)],
      'Exactly, that\'s false. Everything is moving relative to something else. There is no absolute stillness in physics.',
      'Actually, that\'s false. "At rest" only means not moving compared to a chosen baseline. Nothing in the universe is absolutely still.'),
    S('Tap the wrong word to fix the sentence.\n\nA head-on collision between two cars moving 30 mph is identical to hitting a parked car at 30 mph.',
      [O('60 mph','60 mph',true), O('0 mph','0 mph',false)],
      'Got it. Because they are moving toward each other, their closing speed is the sum of both (60 mph).',
      'Actually, because they are moving toward each other, their speeds combine. The impact is the equivalent of 60 mph.'),
    { type: 'sorting', boxes: [
      { id: 'passengers', label: 'Velocity relative to the passengers' },
      { id: 'ground', label: 'Velocity relative to the ground' }
    ], items: [
      { id: 'slow', label: '2 mph', box: 'passengers' },
      { id: 'fast', label: '502 mph', box: 'ground' }
    ]},
    S('A boat is aimed straight across a river. The water flows fast to the right. Where will the boat actually land on the opposite shore?',
      [O('diagonal','Diagonally downstream',true), O('straight','Straight across',false)],
      'Exactly. The boat\'s forward velocity and the river\'s sideways velocity combine, pushing the boat on a diagonal path.',
      'Not quite. The river\'s current pushes the boat sideways while it drives forward, resulting in a diagonal path downstream.')
  ]
};

export function getPhysWorkshop(checkpointIndex) {
  const keys = Object.keys(PHYS_WORKSHOPS);
  if (checkpointIndex < keys.length) {
    return PHYS_WORKSHOPS[keys[checkpointIndex]];
  }
  return null;
}

export function getAtomWorkshop(checkpointIndex) {
  const keys = Object.keys(ATOM_WORKSHOPS);
  if (checkpointIndex < keys.length) {
    return ATOM_WORKSHOPS[keys[checkpointIndex]];
  }
  return null;
}

export function getLineWorkshop(checkpointIndex) {
  const keys = Object.keys(LINE_WORKSHOPS);
  if (checkpointIndex < keys.length) {
    return LINE_WORKSHOPS[keys[checkpointIndex]];
  }
  return null;
}
