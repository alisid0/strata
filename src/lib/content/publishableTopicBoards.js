export const PUBLISHABLE_TOPIC_BOARDS = {
  1313: {
    act: 'I',
    kicker: 'Exponents 1.0',
    title: 'Exponents are compact multiplication',
    tags: { subject: 'maths', topic: 'exponents-logarithms', concept: 'exponents', ground: 'g0' },
    layers: [
      { text: '<p>An exponent is a shortcut for repeated multiplication. It tells how many times a number is used as a factor.</p>' },
      { text: '<p>So 2<sup>4</sup> means 2 x 2 x 2 x 2. The base is 2, and the exponent is 4.</p>' },
      { text: '<p>This notation keeps large patterns readable. It replaces long multiplication chains with a small, precise instruction.</p>' },
      { text: '<p>Once exponents are understood as repeated multiplication, the laws of exponents stop feeling like magic tricks.</p>' }
    ]
  },
  1314: {
    act: 'I',
    kicker: 'Exponents 1.1',
    title: 'Multiplying powers adds exponents',
    tags: { subject: 'maths', topic: 'exponents-logarithms', concept: 'exponent-laws', ground: 'g0' },
    layers: [
      { text: '<p>When powers have the same base, multiplying them joins their multiplication chains into one longer chain.</p>' },
      { text: '<p>For example, 3<sup>2</sup> x 3<sup>4</sup> means two 3s followed by four more 3s.</p>' },
      { text: '<p>That gives six 3s in total, so 3<sup>2</sup> x 3<sup>4</sup> = 3<sup>6</sup>.</p>' },
      { text: '<p>The rule is simple: same base, multiply powers, add exponents.</p>' }
    ]
  },
  1315: {
    act: 'I',
    kicker: 'Exponents 1.2',
    title: 'Negative exponents mean reciprocal',
    tags: { subject: 'maths', topic: 'exponents-logarithms', concept: 'negative-exponents', ground: 'g0' },
    layers: [
      { text: '<p>A negative exponent does not make the number negative. It moves the power to the other side of a fraction.</p>' },
      { text: '<p>So 2<sup>-3</sup> means 1 over 2<sup>3</sup>, which is 1/8.</p>' },
      { text: '<p>This follows the same exponent pattern. Dividing by 2 again and again moves below 1.</p>' },
      { text: '<p>Negative exponents are a clean way to write tiny repeated divisions.</p>' }
    ]
  },
  1316: {
    act: 'I',
    kicker: 'Exponents 1.3',
    title: 'Fractional exponents are roots',
    tags: { subject: 'maths', topic: 'exponents-logarithms', concept: 'fractional-exponents', ground: 'g1' },
    layers: [
      { text: '<p>A fractional exponent connects powers with roots. The denominator tells which root to take.</p>' },
      { text: '<p>For example, x<sup>1/2</sup> means the square root of x. It is another way to write sqrt(x).</p>' },
      { text: '<p>The expression x<sup>1/3</sup> means the cube root of x, because cubing reverses that operation.</p>' },
      { text: '<p>This makes roots part of the same exponent language instead of a separate topic.</p>' }
    ]
  },
  1317: {
    act: 'I',
    kicker: 'Exponents 1.4',
    title: 'Exponential growth multiplies',
    tags: { subject: 'maths', topic: 'exponents-logarithms', concept: 'exponential-growth', ground: 'g1' },
    layers: [
      { text: '<p>Linear growth adds the same amount each step. Exponential growth multiplies by the same factor each step.</p>' },
      { text: '<p>A population that doubles goes 1, 2, 4, 8, 16. Each new amount becomes the base for the next jump.</p>' },
      { text: '<p>That is why exponential curves can look quiet at first and then rise suddenly.</p>' },
      { text: '<p>Compound interest, viral spread, and chain reactions all use this multiplication pattern.</p>' }
    ]
  },
  1318: {
    act: 'I',
    kicker: 'Exponents 1.5',
    title: 'Exponential decay shrinks by a factor',
    tags: { subject: 'maths', topic: 'exponents-logarithms', concept: 'exponential-decay', ground: 'g1' },
    layers: [
      { text: '<p>Exponential decay is the same pattern in reverse. Instead of multiplying upward, each step keeps a fixed fraction.</p>' },
      { text: '<p>If something halves each hour, 80 becomes 40, then 20, then 10.</p>' },
      { text: '<p>The amount never falls by the same subtraction. It falls by the same proportion.</p>' },
      { text: '<p>Radioactive decay, cooling, and medicine leaving the bloodstream often follow this shape.</p>' }
    ]
  },
  1319: {
    act: 'I',
    kicker: 'Logs 1.0',
    title: 'A logarithm asks what power',
    tags: { subject: 'maths', topic: 'exponents-logarithms', concept: 'logarithms', ground: 'g1' },
    layers: [
      { text: '<p>A logarithm is the reverse question of an exponent. It asks which power produced the number.</p>' },
      { text: '<p>If 10<sup>3</sup> = 1000, then log<sub>10</sub>(1000) = 3.</p>' },
      { text: '<p>The base tells which number was being powered. The answer tells how many powers were needed.</p>' },
      { text: '<p>Logs are not new arithmetic. They are exponents read backward.</p>' }
    ]
  },
  1320: {
    act: 'I',
    kicker: 'Logs 1.1',
    title: 'Logs turn multiplication into addition',
    tags: { subject: 'maths', topic: 'exponents-logarithms', concept: 'log-laws', ground: 'g1' },
    layers: [
      { text: '<p>Because powers add when matching bases multiply, logarithms can turn multiplication into addition.</p>' },
      { text: '<p>That is why log(ab) becomes log(a) + log(b), when the base is the same.</p>' },
      { text: '<p>The log is reading the hidden exponents behind the numbers.</p>' },
      { text: '<p>This is why logarithms became a powerful calculation tool long before calculators existed.</p>' }
    ]
  },
  1321: {
    act: 'I',
    kicker: 'Logs 1.2',
    title: 'The natural base e',
    tags: { subject: 'maths', topic: 'exponents-logarithms', concept: 'natural-exponential', ground: 'g1' },
    layers: [
      { text: '<p>The number e appears when growth is compounded continuously instead of in separate jumps.</p>' },
      { text: '<p>It is about 2.718, but the exact decimal is less important than the behaviour it captures.</p>' },
      { text: '<p>The function e<sup>x</sup> is special because its rate of change matches itself.</p>' },
      { text: '<p>That makes e the natural language of growth, decay, cooling, charging, and many physical systems.</p>' }
    ]
  },
  1322: {
    act: 'I',
    kicker: 'Logs 1.3',
    title: 'Exponents and logs are mirrors',
    tags: { subject: 'maths', topic: 'exponents-logarithms', concept: 'inverse-functions', ground: 'g1' },
    layers: [
      { text: '<p>Exponential functions and logarithmic functions undo each other.</p>' },
      { text: '<p>If an exponential function sends 3 to 1000, the matching logarithm sends 1000 back to 3.</p>' },
      { text: '<p>On a graph, they mirror each other across the line y = x.</p>' },
      { text: '<p>This inverse relationship is what lets logs solve equations where the unknown sits in the exponent.</p>' }
    ]
  },
  1323: {
    act: 'I',
    kicker: 'Electricity 1.0',
    title: 'Charge is the thing that moves',
    tags: { subject: 'physics', topic: 'electricity-circuits', concept: 'charge', ground: 'g0' },
    layers: [
      { text: '<p>Electricity begins with charge. Charge is a property of particles that lets them push and pull through electric forces.</p>' },
      { text: '<p>Electrons carry negative charge. Protons carry positive charge. In metal wires, the mobile charges are mostly electrons.</p>' },
      { text: '<p>A circuit is not made from mysterious energy fluid. It is organised charge movement through a conducting path.</p>' },
      { text: '<p>Once charge can move, current, voltage, and resistance become easier to understand.</p>' }
    ]
  },
  1324: {
    act: 'I',
    kicker: 'Electricity 1.1',
    title: 'Current is charge flow',
    tags: { subject: 'physics', topic: 'electricity-circuits', concept: 'current', ground: 'g0' },
    layers: [
      { text: '<p>Electric current measures how much charge passes a point each second.</p>' },
      { text: '<p>The unit is the ampere. One ampere means one coulomb of charge passing each second.</p>' },
      { text: '<p>In circuit diagrams, current is treated as flowing around the loop through every component on its path.</p>' },
      { text: '<p>Current is not used up by a bulb. Energy is transferred, but charge keeps circulating.</p>' }
    ]
  },
  1325: {
    act: 'I',
    kicker: 'Electricity 1.2',
    title: 'Voltage is energy per charge',
    tags: { subject: 'physics', topic: 'electricity-circuits', concept: 'voltage', ground: 'g0' },
    layers: [
      { text: '<p>Voltage tells how much energy each unit of charge gains or loses between two points.</p>' },
      { text: '<p>A battery gives charges energy. A bulb or resistor transfers that energy into light, heat, or another form.</p>' },
      { text: '<p>Voltage is measured across components, not through them.</p>' },
      { text: '<p>Thinking of voltage as energy per charge is cleaner than thinking of it only as a push.</p>' }
    ]
  },
  1326: {
    act: 'I',
    kicker: 'Electricity 1.3',
    title: 'Resistance slows current',
    tags: { subject: 'physics', topic: 'electricity-circuits', concept: 'resistance', ground: 'g0' },
    layers: [
      { text: '<p>Resistance describes how strongly a component opposes the movement of charge.</p>' },
      { text: '<p>A thin wire, long wire, hot wire, or poor conductor usually has higher resistance.</p>' },
      { text: '<p>Resistance does not destroy charge. It transfers electrical energy into other forms, often heat.</p>' },
      { text: '<p>This is why resistors are useful: they control current and manage energy transfer.</p>' }
    ]
  },
  1327: {
    act: 'I',
    kicker: 'Electricity 1.4',
    title: 'Ohm law links the three',
    tags: { subject: 'physics', topic: 'electricity-circuits', concept: 'ohms-law', ground: 'g0' },
    layers: [
      { text: '<p>Ohm law links voltage, current, and resistance with a simple relationship: V = IR.</p>' },
      { text: '<p>If resistance stays fixed, increasing voltage increases current.</p>' },
      { text: '<p>If voltage stays fixed, increasing resistance reduces current.</p>' },
      { text: '<p>The equation is simple, but it becomes the working grammar of basic circuit analysis.</p>' }
    ]
  },
  1328: {
    act: 'I',
    kicker: 'Electricity 1.5',
    title: 'Series circuits share current',
    tags: { subject: 'physics', topic: 'electricity-circuits', concept: 'series-circuits', ground: 'g1' },
    layers: [
      { text: '<p>In a series circuit, components sit one after another on a single path.</p>' },
      { text: '<p>The same current passes through every component because there is nowhere else for the charge to go.</p>' },
      { text: '<p>The supply voltage is shared between the components.</p>' },
      { text: '<p>Add more resistors in series, and the total resistance rises. The current usually falls.</p>' }
    ]
  },
  1329: {
    act: 'I',
    kicker: 'Electricity 1.6',
    title: 'Parallel circuits share voltage',
    tags: { subject: 'physics', topic: 'electricity-circuits', concept: 'parallel-circuits', ground: 'g1' },
    layers: [
      { text: '<p>In a parallel circuit, the current has more than one path.</p>' },
      { text: '<p>Each branch gets the full supply voltage, because each branch connects across the same two points.</p>' },
      { text: '<p>The total current splits between branches and then recombines.</p>' },
      { text: '<p>This is why home wiring uses parallel branches: one device can turn off while others keep working.</p>' }
    ]
  },
  1330: {
    act: 'I',
    kicker: 'Electricity 1.7',
    title: 'Power is energy transfer rate',
    tags: { subject: 'physics', topic: 'electricity-circuits', concept: 'electrical-power', ground: 'g1' },
    layers: [
      { text: '<p>Electrical power tells how quickly electrical energy is transferred into another form.</p>' },
      { text: '<p>The basic equation is P = IV: power equals current times voltage.</p>' },
      { text: '<p>A high-power heater transfers energy quickly. A small LED transfers energy much more slowly.</p>' },
      { text: '<p>Power connects circuit measurements to real effects: heat, light, motion, and sound.</p>' }
    ]
  },
  1331: {
    act: 'I',
    kicker: 'Electricity 1.8',
    title: 'Kirchhoff rules keep accounts',
    tags: { subject: 'physics', topic: 'electricity-circuits', concept: 'kirchhoff-rules', ground: 'g1' },
    layers: [
      { text: '<p>Kirchhoff current rule says charge does not pile up at a junction.</p>' },
      { text: '<p>Current entering a junction must equal current leaving it.</p>' },
      { text: '<p>Kirchhoff voltage rule says energy is conserved around a closed loop.</p>' },
      { text: '<p>Together, these rules turn messy circuits into bookkeeping: charge in, charge out, energy gained, energy spent.</p>' }
    ]
  },
  1332: {
    act: 'I',
    kicker: 'Electricity 1.9',
    title: 'Capacitors store separated charge',
    tags: { subject: 'physics', topic: 'electricity-circuits', concept: 'capacitance', ground: 'g1' },
    layers: [
      { text: '<p>A capacitor stores energy by separating positive and negative charge on two conducting plates.</p>' },
      { text: '<p>It does not store charge by creating extra charge. It separates charge already present in the circuit.</p>' },
      { text: '<p>When connected, a capacitor can charge, hold energy briefly, and then discharge.</p>' },
      { text: '<p>That makes capacitors useful for timing, smoothing, filtering, and short bursts of stored electrical energy.</p>' }
    ]
  },
  1333: {
    act: 'I',
    kicker: 'Chemistry 1.0',
    title: 'Isotopes are the same element with different mass',
    tags: { subject: 'chemistry', topic: 'structure-reactions', concept: 'isotopes', ground: 'g0' },
    layers: [
      { text: '<p>Atoms of the same element always have the same number of protons.</p>' },
      { text: '<p>Isotopes are atoms of that element with different numbers of neutrons.</p>' },
      { text: '<p>Carbon-12 and carbon-14 are both carbon because both have six protons.</p>' },
      { text: '<p>The neutron difference changes mass, but it does not change the element identity.</p>' }
    ]
  },
  1334: {
    act: 'I',
    kicker: 'Chemistry 1.1',
    title: 'Electron shells explain reactivity',
    tags: { subject: 'chemistry', topic: 'structure-reactions', concept: 'electron-shells', ground: 'g0' },
    layers: [
      { text: '<p>Electrons sit around the nucleus in energy levels often called shells.</p>' },
      { text: '<p>The outer shell matters most in ordinary chemistry.</p>' },
      { text: '<p>Atoms react because their outer electrons can be lost, gained, or shared.</p>' },
      { text: '<p>So chemical behaviour is mostly a story about the outer shell.</p>' }
    ]
  },
  1335: {
    act: 'I',
    kicker: 'Chemistry 1.2',
    title: 'Ions are charged atoms',
    tags: { subject: 'chemistry', topic: 'structure-reactions', concept: 'ions', ground: 'g0' },
    layers: [
      { text: '<p>An atom becomes an ion when it loses or gains electrons.</p>' },
      { text: '<p>Losing electrons leaves more protons than electrons, so the ion becomes positive.</p>' },
      { text: '<p>Gaining electrons gives more electrons than protons, so the ion becomes negative.</p>' },
      { text: '<p>The nucleus has not changed. The charge changed because the electron count changed.</p>' }
    ]
  },
  1336: {
    act: 'I',
    kicker: 'Chemistry 1.3',
    title: 'Ionic bonding is give and take',
    tags: { subject: 'chemistry', topic: 'structure-reactions', concept: 'ionic-bonding', ground: 'g0' },
    layers: [
      { text: '<p>Ionic bonding begins when one atom transfers electrons to another.</p>' },
      { text: '<p>The metal atom usually loses electrons and becomes a positive ion.</p>' },
      { text: '<p>The non-metal atom usually gains electrons and becomes a negative ion.</p>' },
      { text: '<p>The opposite charges attract, pulling the ions into a repeating giant lattice.</p>' }
    ]
  },
  1337: {
    act: 'I',
    kicker: 'Chemistry 1.4',
    title: 'Covalent bonding is sharing',
    tags: { subject: 'chemistry', topic: 'structure-reactions', concept: 'covalent-bonding', ground: 'g0' },
    layers: [
      { text: '<p>Covalent bonding happens when atoms share pairs of electrons.</p>' },
      { text: '<p>This usually happens between non-metal atoms that both need outer-shell electrons.</p>' },
      { text: '<p>A shared pair is attracted to both nuclei, holding the atoms together.</p>' },
      { text: '<p>Water, carbon dioxide, methane, glucose, and DNA all depend on covalent bonding.</p>' }
    ]
  },
  1338: {
    act: 'I',
    kicker: 'Chemistry 1.5',
    title: 'Metallic bonding creates a sea of electrons',
    tags: { subject: 'chemistry', topic: 'structure-reactions', concept: 'metallic-bonding', ground: 'g0' },
    layers: [
      { text: '<p>In a metal, outer electrons are not locked to one atom.</p>' },
      { text: '<p>They move through a lattice of positive metal ions.</p>' },
      { text: '<p>This sea of mobile electrons holds the structure together.</p>' },
      { text: '<p>It also explains why metals conduct electricity, conduct heat, and bend without shattering.</p>' }
    ]
  },
  1339: {
    act: 'I',
    kicker: 'Chemistry 1.6',
    title: 'Molecular shape comes from electron repulsion',
    tags: { subject: 'chemistry', topic: 'structure-reactions', concept: 'molecular-shape', ground: 'g1' },
    layers: [
      { text: '<p>Electron pairs around a central atom repel each other.</p>' },
      { text: '<p>They arrange themselves as far apart as possible in three-dimensional space.</p>' },
      { text: '<p>That simple repulsion predicts shapes such as linear, bent, trigonal planar, and tetrahedral.</p>' },
      { text: '<p>Shape matters because molecules react and interact according to their actual geometry.</p>' }
    ]
  },
  1340: {
    act: 'I',
    kicker: 'Chemistry 1.7',
    title: 'Polarity means uneven sharing',
    tags: { subject: 'chemistry', topic: 'structure-reactions', concept: 'polarity', ground: 'g1' },
    layers: [
      { text: '<p>A covalent bond can share electrons unevenly.</p>' },
      { text: '<p>The atom pulling harder becomes slightly negative, while the other side becomes slightly positive.</p>' },
      { text: '<p>This creates polarity, a small separation of charge inside the molecule.</p>' },
      { text: '<p>Polarity helps explain boiling points, solubility, and why water is such an effective solvent.</p>' }
    ]
  },
  1341: {
    act: 'I',
    kicker: 'Chemistry 1.8',
    title: 'A reaction rearranges atoms',
    tags: { subject: 'chemistry', topic: 'structure-reactions', concept: 'chemical-reactions', ground: 'g0' },
    layers: [
      { text: '<p>A chemical reaction does not create atoms from nothing.</p>' },
      { text: '<p>It breaks old bonds, rearranges atoms, and forms new bonds.</p>' },
      { text: '<p>The substances at the start are reactants. The substances formed are products.</p>' },
      { text: '<p>The atom count is conserved, but the arrangement changes. That is why new substances appear.</p>' }
    ]
  },
  1342: {
    act: 'I',
    kicker: 'Chemistry 1.9',
    title: 'Balancing equations protects atoms',
    tags: { subject: 'chemistry', topic: 'structure-reactions', concept: 'balancing-equations', ground: 'g0' },
    layers: [
      { text: '<p>A chemical equation must have the same number of each atom on both sides.</p>' },
      { text: '<p>Balancing does not change formulas. It changes how many formula units take part.</p>' },
      { text: '<p>Coefficients go in front of formulas because they count whole particles.</p>' },
      { text: '<p>Balanced equations are conservation of matter written in chemical language.</p>' }
    ]
  }
};
