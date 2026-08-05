/**
 * Functions path fallback boards (MATH_FUNCTIONS · BBs 1219–1228).
 *
 * Baby-step arc toward calculus: rule → one output → notation → domain/range →
 * graph test → linear / exponential / quadratic → inverse → composition.
 *
 * Live copy may differ in Supabase; this module is the bundled offline fallback.
 * Floor media resolves via boardMedia.js (concept-explorer / math-visual).
 */
export const FUNCTION_BOARDS = {
  1219: {
    act: 'I',
    kicker: 'Functions 1.0',
    title: 'The mechanical rule',
    tags: { subject: 'maths', topic: 'functions', concept: 'function-as-rule', ground: 'g0' },
    layers: [
      {
        text:
          '<p>Press A1 on a vending machine. A cola drops. Press A1 again. The same cola drops.</p>'
      },
      {
        text:
          '<p>Something goes in (the button code). Something comes out (the drink). Between them sits a fixed rule the machine follows every time.</p>'
      },
      {
        text:
          '<p>Try a tiny table of your own. Input 1 → output 2. Input 2 → output 4. Input 3 → output 6. The hidden rule is “double it.”</p>'
      },
      {
        text:
          '<p>In mathematics, a rule that takes an allowed input and returns one output is called a <strong>function</strong>.</p>'
      },
      {
        text:
          '<p>You will meet functions again and again in calculus. First we learn to run the machine. Later we ask how fast the output changes, and what value it approaches.</p>'
      }
    ]
  },
  1220: {
    act: 'I',
    kicker: 'Functions 1.1',
    title: 'The broken machine',
    tags: { subject: 'maths', topic: 'functions', concept: 'one-input-one-output', ground: 'g0' },
    layers: [
      {
        text:
          '<p>Suppose A1 drops cola on Monday and chips on Tuesday. Same button, two results. You would stop trusting the machine.</p>'
      },
      {
        text:
          '<p>A function has one non-negotiable rule: the same input always produces the same output.</p>'
      },
      {
        text:
          '<p>Check this table. Input 2 → 5. Input 3 → 6. Input 2 → 9. The second visit to 2 broke the rule. That relation is not a function.</p>'
      },
      {
        text:
          '<p>Different inputs may share one output. A1 and A2 can both give cola. Many-to-one is fine. One-to-many is not.</p>'
      },
      {
        text:
          '<p>When we later draw graphs and talk about limits, this same demand stays: at each x we look at, the rule must point to one y.</p>'
      }
    ]
  },
  1221: {
    act: 'I',
    kicker: 'Functions 1.2',
    title: 'The mathematical shorthand',
    tags: { subject: 'maths', topic: 'functions', concept: 'function-notation', ground: 'g0' },
    layers: [
      {
        text:
          '<p>Drawing a vending machine every time would be slow. Mathematicians use a short label for the same idea.</p>'
      },
      {
        text:
          '<p>Call the input <em>x</em>. Call the rule <em>f</em> (for function). Write the whole process as <em>f(x)</em>, read “f of x.”</p>'
      },
      {
        text:
          '<p>If the rule is “double the input,” write <em>f(x) = 2x</em>. Then <em>f(5)</em> means: put 5 into the rule. Output: 10.</p>'
      },
      {
        text:
          '<p>Work one more: if <em>g(x) = x + 3</em>, then <em>g(4) = 7</em> and <em>g(0) = 3</em>. The letter inside the brackets is always the input.</p>'
      },
      {
        text:
          '<p>Later, slopes and limits will reuse this notation. For now, treat <em>f(3)</em> as a button press: feed 3, read what comes out.</p>'
      }
    ]
  },
  1222: {
    act: 'I',
    kicker: 'Functions 1.3',
    title: 'The boundaries',
    tags: { subject: 'maths', topic: 'functions', concept: 'domain-and-range', ground: 'g0' },
    layers: [
      {
        text:
          '<p>A wooden block will not buy a drink. The machine only accepts certain inputs. Functions are the same.</p>'
      },
      {
        text:
          '<p>The set of inputs a function can safely accept is the <strong>domain</strong>. Think: what am I allowed to put in?</p>'
      },
      {
        text:
          '<p>The set of outputs it can actually produce is the <strong>range</strong>. Think: what can come out?</p>'
      },
      {
        text:
          '<p>Example: a machine squares whole numbers from 0 to 4. Domain: 0, 1, 2, 3, 4. Outputs: 0, 1, 4, 9, 16. That list of outputs is the range for those inputs.</p>'
      },
      {
        text:
          '<p>In calculus you often ask what happens as x moves toward the edge of a domain, or toward a hole in it. Domain is the fence. Limits look at the fence line.</p>'
      }
    ]
  },
  1223: {
    act: 'I',
    kicker: 'Functions 1.4',
    title: 'The visual test',
    tags: { subject: 'maths', topic: 'functions', concept: 'vertical-line-test', ground: 'g0' },
    layers: [
      {
        text:
          '<p>Put each pair (input, output) on a grid. Input runs left–right as x. Output runs up–down as y. The dots and curve are a picture of the rule.</p>'
      },
      {
        text:
          '<p>Because one input may have only one output, a vertical line should meet the graph in at most one point.</p>'
      },
      {
        text:
          '<p>If a vertical line hits twice, one x-value has two y-values. The graph fails the vertical line test. It is not a function.</p>'
      },
      {
        text:
          '<p>A circle fails. A sideways parabola fails. A straight line with finite slope passes. So does a U-shaped parabola opening up or down.</p>'
      },
      {
        text:
          '<p>Reading a graph this way prepares you for limits and derivatives: you will stare at one x-position and ask what y is doing nearby.</p>'
      }
    ]
  },
  1224: {
    act: 'I',
    kicker: 'Functions 1.5',
    title: 'The straight path',
    tags: { subject: 'maths', topic: 'functions', concept: 'linear-functions', ground: 'g0' },
    layers: [
      {
        text:
          '<p>Some rules add the same amount every step. Start at 1. Add 2 again and again: 1, 3, 5, 7. Steady growth.</p>'
      },
      {
        text:
          '<p>On a grid those points sit on a straight line. A function with constant rate of change is a <strong>linear function</strong>.</p>'
      },
      {
        text:
          '<p>A common form is <em>f(x) = mx + c</em>. The number <em>m</em> is the slope (how steep). The number <em>c</em> is where the line crosses the vertical axis.</p>'
      },
      {
        text:
          '<p>A car locked at 60 km/h is linear in time: each hour adds the same distance. The graph of distance against time is a straight ramp.</p>'
      },
      {
        text:
          '<p>Derivatives will later measure slope for curves that are not straight. Linear functions are the warm-up: their slope never changes.</p>'
      }
    ]
  },
  1225: {
    act: 'I',
    kicker: 'Functions 1.6',
    title: 'The explosion',
    tags: { subject: 'maths', topic: 'functions', concept: 'exponential-functions', ground: 'g0' },
    layers: [
      {
        text:
          '<p>One cell splits into two. Two into four. Four into eight. The jump itself gets larger each time.</p>'
      },
      {
        text:
          '<p>That is repeated multiplication, not repeated addition. A rule like <em>f(x) = 2<sup>x</sup></em> is an <strong>exponential function</strong>: the input sits in the exponent.</p>'
      },
      {
        text:
          '<p>Table check: x = 0, 1, 2, 3 → outputs 1, 2, 4, 8. Each step multiplies by 2. The differences are 1, then 2, then 4 — growing.</p>'
      },
      {
        text:
          '<p>On a graph the curve can look gentle at first, then rise very fast. Compound interest and viral spread use this engine.</p>'
      },
      {
        text:
          '<p>Compared with a straight line, the steepness keeps changing. That changing steepness is exactly what derivatives track later.</p>'
      }
    ]
  },
  1226: {
    act: 'I',
    kicker: 'Functions 1.7',
    title: 'The falling object',
    tags: { subject: 'maths', topic: 'functions', concept: 'quadratic-functions', ground: 'g0' },
    layers: [
      {
        text:
          '<p>Throw a ball upward. It slows, hangs for a moment at the top, then falls. Height against time is not a straight line.</p>'
      },
      {
        text:
          '<p>Rules that square the input, such as <em>f(x) = x<sup>2</sup></em>, are <strong>quadratic</strong>. Their graphs are U-shaped curves called parabolas.</p>'
      },
      {
        text:
          '<p>Table: x = −2, −1, 0, 1, 2 → outputs 4, 1, 0, 1, 4. Left and right match. The bottom sits at the origin for this simple case.</p>'
      },
      {
        text:
          '<p>Near the bottom the graph is almost flat. Higher on either side it steepens. Slope is not one number for the whole curve.</p>'
      },
      {
        text:
          '<p>That local steepness — different at each point — is the doorway into differentiation. A parabola is a friendly first curve to study.</p>'
      }
    ]
  },
  1227: {
    act: 'I',
    kicker: 'Functions 1.8',
    title: 'Running it backward',
    tags: { subject: 'maths', topic: 'functions', concept: 'inverse-functions', ground: 'g0' },
    layers: [
      {
        text:
          '<p>The machine turned 3 into 7 by adding 4. Can you walk backward from 7 to 3? Yes: subtract 4.</p>'
      },
      {
        text:
          '<p>A reverse rule that recovers the original input is an <strong>inverse function</strong>. It undoes the original machine.</p>'
      },
      {
        text:
          '<p>This only works cleanly when each output comes from exactly one input. If two buttons both drop cola, seeing cola does not tell you which button was pressed.</p>'
      },
      {
        text:
          '<p>Example: <em>f(x) = 2x</em> has inverse “divide by 2.” <em>f(x) = x<sup>2</sup></em> on all real numbers does not have a single inverse, because 4 comes from both 2 and −2.</p>'
      },
      {
        text:
          '<p>Undoing will matter again when integrals reverse derivatives. For now, practise walking one simple rule forward and back.</p>'
      }
    ]
  },
  1228: {
    act: 'I',
    kicker: 'Functions 1.9',
    title: 'Chaining them together',
    tags: { subject: 'maths', topic: 'functions', concept: 'composite-functions', ground: 'g0' },
    layers: [
      {
        text:
          '<p>Real systems rarely use one rule alone. Fuel burns, heat expands gas, the piston moves. Output of one stage feeds the next.</p>'
      },
      {
        text:
          '<p>Functions chain the same way. The output of <em>g</em> becomes the input of <em>f</em>. Write <em>f(g(x))</em>. The inside machine runs first.</p>'
      },
      {
        text:
          '<p>Let <em>g(x) = x + 1</em> and <em>f(x) = 2x</em>. Then <em>f(g(3))</em>: first g turns 3 into 4, then f doubles 4 into 8.</p>'
      },
      {
        text:
          '<p>Order matters. <em>g(f(3))</em> would double first (6) then add 1 (7). Different chain, different result.</p>'
      },
      {
        text:
          '<p>You now have the toolkit for the next topics: limits ask what a function approaches; derivatives ask how fast it changes; integrals add change back up. Functions are the language those questions speak.</p>'
      }
    ]
  }
};
