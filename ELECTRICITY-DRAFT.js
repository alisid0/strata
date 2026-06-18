/* ============================================================
   ELECTRICITY & CIRCUITS — new standalone physics path
   DRAFT BATCH — Editor Mode (see AUTHORING.md), except EL1-EL2
   which are LOCKED — run through the real Loop with the author.
   Internal index: EL# (temporary, same convention as CG# in
   Coordinate Geometry — the real term is BB once locked).
   ============================================================ */

const TIER_00_CHARGE_AND_CURRENT = [

  // EL1 — LOCKED. Bridges from Card 11 (conservation of energy).
  C("V","EL1","A pulse that already exists in nature",[
    "<p>We already know energy can't be created or destroyed, only moved from one form into another. But energy can sometimes turn into something very fast — a very strong pulse, one that moves easily through metals.</p><p>This form of energy occurs naturally. You sometimes see it when thunderbolts flash through the sky. This energy is called electricity.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"electricity-intro",ground:"g0",buildsOn:["Card 11"]}),

  // EL2 — LOCKED. The copper-wire electron-cloud speed paradox.
  C("V","EL2","Crawling electrons, an instant light",[
    "<p>A single centimetre of copper wire holds more free-roaming electrons than there are grains of sand on every beach on Earth combined. And yet each individual electron, drifting through the metal, moves slower than a snail — millimetres per second.</p><p>So how does flicking a light switch turn the bulb on almost instantly, if the electrons themselves are barely crawling?</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"electron-drift-speed-paradox",ground:"g0",buildsOn:["EL1","Card 37"]}),

  // EL3 — Two kinds of charge (was EL2)
  C("V","EL3","Only two flavours exist",[
    "<p>Charge doesn't come in many varieties. There are exactly two kinds, called <strong>positive</strong> and <strong>negative</strong> — names chosen by convention, not because one is \"more\" charge than the other.</p><p>Inside every atom, the proton carries positive charge and the electron carries negative charge, in exactly equal and opposite amounts.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"positive-negative-charge",ground:"g0",buildsOn:["Card 37"]}),

  // EL4 — Like repels, opposite attracts (was EL3)
  C("V","EL4","The one rule that explains the trick",[
    "<p>Two positives push apart. Two negatives push apart. A positive and a negative pull together. That's the entire rulebook for how charges treat each other.</p><p>Rub a balloon on your hair and electrons strip off your hair onto the balloon, leaving the balloon negative and your hair short of electrons. Hold the balloon near a wall and it sticks, since the wall's surface electrons get pushed back slightly, leaving it locally positive nearby. Hold it near a second balloon rubbed the same way and they push apart instead.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"like-repel-opposite-attract",ground:"g0",buildsOn:["EL3"]}),

  // EL5 — Conductors vs insulators (was EL4)
  C("V","EL5","Some materials let charge wander, some don't",[
    "<p>In a metal, some electrons aren't locked to any one atom — they drift freely through the whole material, exactly the free-roaming electrons from EL2. That's a <strong>conductor</strong>: charge moves through it easily.</p><p>In rubber, glass, or plastic, every electron stays bound to its own atom. That's an <strong>insulator</strong>: charge placed on it stays exactly where it landed, which is why a rubbed balloon (rubber) keeps its charge instead of it draining away immediately.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"conductors-insulators",ground:"g0",buildsOn:["EL2"]}),

  // EL6 — What electric current is (was EL5)
  C("V","EL6","Charge on the move",[
    "<p>A charged balloon sitting still is just charge parked in one place. Get a huge number of charges all drifting in the same direction through a conductor, and that flow has a name: <strong>electric current</strong>.</p><p>It's the same idea as water current in a river — not the water itself, but the fact that it's moving. No movement, no current, even if the charge is still there.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"electric-current",ground:"g0",buildsOn:["EL5"]}),

  // EL7 — Current measured in amperes (was EL6)
  C("V","EL7","Counting how much charge passes per second",[
    "<p>Current is a rate: how much charge flows past a point in a wire, per second. The unit is the <strong>ampere</strong> (A) — one ampere means one coulomb of charge (a fixed, large number of electrons) passing every second.</p><div class='formula'>I = Q / t<span class='gloss'>Current equals charge divided by time.</span></div><p>A phone charger pushing 2 amperes is moving twice as much charge per second through the cable as one pushing 1 ampere.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"ampere; current-formula",ground:"g0",buildsOn:["EL6"]}),

  // EL8 — What voltage is (was EL7)
  C("V","EL8","The push behind the flow",[
    "<p>Charge doesn't drift through a wire on its own — something has to push it. That push is <strong>voltage</strong> (also called potential difference), measured in volts.</p><p>A 9V battery pushes harder than a 1.5V battery. Connect either to the same wire and the higher voltage drives more current through it — voltage is the cause, current is the effect.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"voltage; potential-difference",ground:"g0",buildsOn:["EL7"]}),

];

/* ============================================================
   ELECTRICITY & CIRCUITS — Tier 1: Resistance, Ohm's Law, circuits
   DRAFT BATCH — Editor Mode (see AUTHORING.md)
   ============================================================ */

const TIER_01_RESISTANCE_AND_CIRCUITS = [

  // EL9 — Water-pipe analogy (was EL8) — flagged by author as not working well, revisit
  C("V","EL9","A circuit is a loop of pipes",[
    "<p>Picture a pump pushing water through a loop of pipe. The pump's strength is like <strong>voltage</strong>. How much water flows per second is like <strong>current</strong>. And a narrow, kinked section of pipe that fights the flow is like <strong>resistance</strong>.</p><p>Squeeze the pipe narrower (more resistance) and less water gets through for the same pump strength. That single picture carries almost the whole of circuit behaviour.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"water-pipe-analogy",ground:"g0",buildsOn:["EL8"]}),

  // EL10 — What resistance is (was EL9) — LOCKED, Instance 1+2 from the real Loop
  C("V","EL10","Why every material fights the flow a little",[
    "<p>Take a plain copper wire and connect it to a small battery, the kind you'd find in a TV remote or a child's toy. Current starts flowing through it, exactly as before. Now compare two ways of making heat: a metal heating coil glowing on a stove, and a piece of wood burning in a fire. Both give off heat. Both use up energy. But a burnt piece of wood can never be wood again, while that same metal coil can be switched on and off, glowing again and again, indefinitely.</p><p>Burning wood is a chemical change: the wood reacts with oxygen in the air and turns into entirely different substances, ash and smoke and gas. The wood you started with is simply gone. A heated metal coil is only a physical change. Switch the current off and it cools right back down to the exact same metal, ready to repeat.</p>",
    "<p>So why does the metal heat up at all, if nothing about it is changing? As electrons drift through it, they keep colliding with the atoms in their way, and each collision hands over a little energy as heat. That opposition to the flow, the metal fighting back a little, is called <strong>resistance</strong>, measured in ohms (Ω). Nothing is consumed. The energy just converts from electrical to heat, one collision at a time.</p><p>Every wire in the world carries some resistance built in, even a plain copper wire with no separate \"resistor\" anywhere in sight — you don't need a special component to have resistance, the same way you don't need an oxygen mask to breathe under ordinary conditions on Earth. A thin, long wire has more resistance than a thick, short one, simply because there are more atoms in the way to collide with. A heating element is just a material deliberately chosen to have a lot more of it than an ordinary wire.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"resistance; ohms; chemical-vs-physical-change",ground:"g0",buildsOn:["EL9","EL2"]}),

  // EL11 — Ohm's Law (was EL10)
  C("V","EL11","Voltage, current, and resistance, tied together",[
    "<p>For most conductors, voltage, current, and resistance are locked together by one exact relationship, <strong>Ohm's Law</strong>.</p><div class='formula'>V = I × R<span class='gloss'>Voltage equals current multiplied by resistance.</span></div><p>Push harder (more V) and more current flows, for the same resistance. Add more resistance and the same push drives less current through.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"ohms-law",ground:"g0",buildsOn:["EL10"]}),

  // EL12 — Worked example (was EL11)
  C("V","EL12","Putting numbers through the formula",[
    "<p>A 12V battery is connected across a 4Ω resistor. How much current flows?</p><div class='formula'>I = V / R = 12 / 4 = 3A<span class='gloss'>Rearranging V = IR to solve for current.</span></div><p>Double the resistance to 8Ω with the same battery: I = 12 / 8 = 1.5A — half the current, for double the resistance, exactly as the formula predicts.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"ohms-law-worked-example",ground:"g0",buildsOn:["EL11"]}),

  // EL13 — Series circuits (was EL12)
  C("V","EL13","One loop, no branches",[
    "<p>In a <strong>series circuit</strong>, every component sits along a single loop with no other path available. Whatever current leaves the battery has nowhere else to go, so the exact same current flows through every component in that loop, one after another.</p><p>Unscrew one old-style Christmas light from a series string and the whole string goes dark — there's no other path for the current to take.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"series-circuits",ground:"g0",buildsOn:["EL11"]}),

  // EL14 — Parallel circuits (was EL13)
  C("V","EL14","Several paths, one starting push",[
    "<p>In a <strong>parallel circuit</strong>, components sit on separate branches that reconnect at both ends. Each branch is wired straight across the same two points, so every branch feels the exact same voltage, even though the current can split unevenly between them depending on each branch's resistance.</p><p>Unscrew one bulb in a household parallel wiring setup and the others stay lit — each branch still has its own complete path back to the supply.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"parallel-circuits",ground:"g0",buildsOn:["EL11"]}),

  // EL15 — Resistors in series (was EL14)
  C("V","EL15","Series resistances simply add",[
    "<p>Put resistors one after another in a series loop and their resistances just add up, since the current has to fight through all of them, one after another, with nowhere to skip ahead.</p><div class='formula'>R_total = R1 + R2 + ...<span class='gloss'>Series resistances add directly.</span></div><p>A 3Ω and a 5Ω resistor in series behave exactly like one 8Ω resistor. Connected to a 16V battery, the current is I = 16 / 8 = 2A through the whole loop.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"series-resistance-formula",ground:"g0",buildsOn:["EL13","EL12"]}),

  // EL16 — Resistors in parallel (was EL15)
  C("V","EL16","Parallel paths make the total resistance drop",[
    "<p>Add a second branch next to an existing one and you've handed the current a second route through — the combined resistance can only go down, never up, however big the new branch's own resistance is.</p><div class='formula'>1/R_total = 1/R1 + 1/R2 + ...<span class='gloss'>Take the reciprocal of each resistance, add them, then take the reciprocal of the result.</span></div><p>Two 4Ω resistors in parallel: 1/R = 1/4 + 1/4 = 1/2, so R_total = 2Ω — lower than either resistor on its own, since the current now has two equally easy ways through.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"parallel-resistance-formula",ground:"g0",buildsOn:["EL14","EL12"]}),

];
