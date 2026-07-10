export const FUNCTION_BOARDS = {
  1219: {
    act: 'I',
    kicker: 'Functions 1.0',
    title: 'The mechanical rule',
    tags: { subject: 'maths', topic: 'functions', concept: 'function-as-rule', ground: 'g0' },
    layers: [
      { text: '<p>At its core, mathematics is not just about isolated numbers. It is about relationships between things.</p>' },
      { text: '<p>A vending machine is a useful first picture. A specific code is pressed on the keypad, and a specific item drops to the bottom.</p>' },
      { text: '<p>There is an input, the button code, and an output, the item that comes out.</p>' },
      { text: '<p>The internal mechanism linking that input to that output is a strict rule.</p>' },
      { text: '<p>In mathematics, a rule that reliably maps an input to an output is called a function.</p>' }
    ]
  },
  1220: {
    act: 'I',
    kicker: 'Functions 1.1',
    title: 'The broken machine',
    tags: { subject: 'maths', topic: 'functions', concept: 'one-input-one-output', ground: 'g0' },
    layers: [
      { text: '<p>A function follows one non-negotiable rule: the same input can only produce one output.</p>' },
      { text: '<p>If button A1 drops a cola today, then A1 must drop a cola every time the same machine is used under the same rule.</p>' },
      { text: '<p>If A1 sometimes drops cola and sometimes drops chips, the relationship is unpredictable. In mathematics, it is not a function.</p>' },
      { text: '<p>Different inputs are allowed to share the same output. A1 and A2 could both lead to cola.</p>' },
      { text: '<p>The forbidden move is one input splitting into two different outputs. Predictability is the heart of a function.</p>' }
    ]
  },
  1221: {
    act: 'I',
    kicker: 'Functions 1.2',
    title: 'The mathematical shorthand',
    tags: { subject: 'maths', topic: 'functions', concept: 'function-notation', ground: 'g0' },
    layers: [
      { text: '<p>Mathematicians do not draw vending machines every time they describe a relationship. They use compact notation.</p>' },
      { text: '<p>The incoming input is usually called x.</p>' },
      { text: '<p>The rule machine is usually called f, short for function.</p>' },
      { text: '<p>The whole process is written as f(x), read as "f of x".</p>' },
      { text: '<p>If the rule is double the input, the function is f(x) = 2x. Put in 5, and f(5) = 10.</p>' }
    ]
  },
  1222: {
    act: 'I',
    kicker: 'Functions 1.3',
    title: 'The boundaries',
    tags: { subject: 'maths', topic: 'functions', concept: 'domain-and-range', ground: 'g0' },
    layers: [
      { text: '<p>A physical machine has limits. A vending machine accepts coins or notes, but not a wooden block.</p>' },
      { text: '<p>The complete set of inputs a function can safely accept is called the domain.</p>' },
      { text: '<p>The machine also has a limited set of things it can produce. It may dispense water, soda, or chips, but not a car.</p>' },
      { text: '<p>The complete set of possible outputs is called the range.</p>' },
      { text: '<p>Domain and range fence in the relationship. They tell us what can go in and what can come out.</p>' }
    ]
  },
  1223: {
    act: 'I',
    kicker: 'Functions 1.4',
    title: 'The visual test',
    tags: { subject: 'maths', topic: 'functions', concept: 'vertical-line-test', ground: 'g0' },
    layers: [
      { text: '<p>Functions connect naturally to coordinate geometry.</p>' },
      { text: '<p>An input is an x-value, moving left to right. An output is a y-value, moving up and down.</p>' },
      { text: '<p>That means a function can be drawn as a line or curve on a grid.</p>' },
      { text: '<p>The one-output rule creates a visual test: a vertical line should touch the graph in only one place at a time.</p>' },
      { text: '<p>If a vertical line touches the graph twice, one x-input has two y-outputs. The curve fails the vertical line test.</p>' }
    ]
  },
  1224: {
    act: 'I',
    kicker: 'Functions 1.5',
    title: 'The straight path',
    tags: { subject: 'maths', topic: 'functions', concept: 'linear-functions', ground: 'g0' },
    layers: [
      { text: '<p>Not every function behaves the same way. The simplest kind applies a steady rule to every input.</p>' },
      { text: '<p>If the rule is add 2, the output grows at a constant rate. 1 becomes 3, 2 becomes 4, and 3 becomes 5.</p>' },
      { text: '<p>When that steady growth is plotted on a grid, it forms a straight line.</p>' },
      { text: '<p>This is a linear function. Its slope stays constant.</p>' },
      { text: '<p>A car travelling at a locked speed works the same way: every hour adds the same amount of distance.</p>' }
    ]
  },
  1225: {
    act: 'I',
    kicker: 'Functions 1.6',
    title: 'The explosion',
    tags: { subject: 'maths', topic: 'functions', concept: 'exponential-functions', ground: 'g0' },
    layers: [
      { text: '<p>Some processes do not grow by adding the same amount each time. They grow by multiplying.</p>' },
      { text: '<p>One bacterial cell becomes two. Two become four. Four become eight. The change gets larger as the amount grows.</p>' },
      { text: '<p>This is an exponential function. The input appears in the exponent, as in 2^x.</p>' },
      { text: '<p>On a graph, exponential growth can start slowly and then rise extremely fast.</p>' },
      { text: '<p>Compound interest, viral spread, and chain reactions all use this kind of mathematical engine.</p>' }
    ]
  },
  1226: {
    act: 'I',
    kicker: 'Functions 1.7',
    title: 'The falling object',
    tags: { subject: 'maths', topic: 'functions', concept: 'quadratic-functions', ground: 'g0' },
    layers: [
      { text: '<p>Another important function shape appears whenever squared inputs enter the rule.</p>' },
      { text: '<p>When a ball is thrown upward, it slows, reaches a highest point, and then falls back down.</p>' },
      { text: '<p>The mathematics of that arc contains x^2 or t^2. That makes it a quadratic function.</p>' },
      { text: '<p>On a grid, a quadratic function forms a U-shaped curve called a parabola.</p>' },
      { text: '<p>Projectile paths, fountains, and many optimisation problems all lead back to this same curve.</p>' }
    ]
  },
  1227: {
    act: 'I',
    kicker: 'Functions 1.8',
    title: 'Running it backward',
    tags: { subject: 'maths', topic: 'functions', concept: 'inverse-functions', ground: 'g0' },
    layers: [
      { text: '<p>If a function machine turns an input into an output, a natural question appears: can the machine run backward?</p>' },
      { text: '<p>If the output is known, can the original input be recovered?</p>' },
      { text: '<p>When a function can be reversed in this way, the reverse rule is called an inverse function.</p>' },
      { text: '<p>This only works cleanly when each output points back to one unique input.</p>' },
      { text: '<p>If two different buttons both produce cola, seeing cola is not enough to know which button was pressed.</p>' }
    ]
  },
  1228: {
    act: 'I',
    kicker: 'Functions 1.9',
    title: 'Chaining them together',
    tags: { subject: 'maths', topic: 'functions', concept: 'composite-functions', ground: 'g0' },
    layers: [
      { text: '<p>Real systems are often built from chains of rules, not one rule in isolation.</p>' },
      { text: '<p>A car engine burns fuel, heat expands gas, and that expansion moves a piston.</p>' },
      { text: '<p>Functions can be chained the same way. The output of one function becomes the input of another.</p>' },
      { text: '<p>This is called a composite function. It is written as f(g(x)), where g runs first and f runs after it.</p>' },
      { text: '<p>Software models, simulations, graphics, and machine learning all rely on simple rules chained together many times.</p>' }
    ]
  }
};
