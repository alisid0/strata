/* ============================================================
   ELECTRICITY & CIRCUITS — new standalone physics path
   DRAFT BATCH — Editor Mode (see AUTHORING.md)
   Internal index: EL# (temporary, same convention as CG# in
   Coordinate Geometry — the real term is BB once locked).
   Not yet run through the real Loop with the author.
   ============================================================ */

const TIER_00_CHARGE_AND_CURRENT = [

  // EL1 — What electric charge is
  C("V","EL1","Rub a balloon on your hair",[
    "<p>Rub a balloon against your hair a few times and it starts sticking to walls, or your hair starts standing up and reaching toward it. Nothing was glued, nothing got hot. Something invisible changed in both the balloon and your hair.</p><p>That something is <strong>charge</strong> — a property some particles carry that lets them pull or push on each other without touching.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"electric-charge",ground:"g0",buildsOn:[]}),

  // EL2 — Two kinds of charge
  C("V","EL2","Only two flavours exist",[
    "<p>Charge doesn't come in many varieties. There are exactly two kinds, called <strong>positive</strong> and <strong>negative</strong> — names chosen by convention, not because one is \"more\" charge than the other.</p><p>Inside every atom, the proton carries positive charge and the electron carries negative charge, in exactly equal and opposite amounts. Rubbing the balloon doesn't create new charge, it just strips electrons off your hair onto the balloon, leaving the balloon with extra negative charge and your hair short of it.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"positive-negative-charge",ground:"g0",buildsOn:["Card 37"]}),

  // EL3 — Like repels, opposite attracts
  C("V","EL3","The one rule that explains the trick",[
    "<p>Two positives push apart. Two negatives push apart. A positive and a negative pull together. That's the entire rulebook for how charges treat each other.</p><p>The balloon (now negative) and the wall (still neutral, but its surface electrons get pushed away, leaving it slightly positive nearby) attract — that's the stickiness. Hold the balloon near a second balloon rubbed the same way and they push apart instead.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"like-repel-opposite-attract",ground:"g0",buildsOn:["EL2"]}),

  // EL4 — Conductors vs insulators
  C("V","EL4","Some materials let charge wander, some don't",[
    "<p>In a metal, some electrons aren't locked to any one atom — they drift freely through the whole material. That's a <strong>conductor</strong>: charge moves through it easily.</p><p>In rubber, glass, or plastic, every electron stays bound to its own atom. That's an <strong>insulator</strong>: charge placed on it stays exactly where it landed, which is why the balloon (rubber) keeps its charge instead of it draining away immediately.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"conductors-insulators",ground:"g0",buildsOn:["EL1"]}),

  // EL5 — What electric current is
  C("V","EL5","Charge on the move",[
    "<p>A charged balloon sitting still is just charge parked in one place. Get a huge number of charges all drifting in the same direction through a conductor, and that flow has a name: <strong>electric current</strong>.</p><p>It's the same idea as water current in a river — not the water itself, but the fact that it's moving. No movement, no current, even if the charge is still there.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"electric-current",ground:"g0",buildsOn:["EL4"]}),

  // EL6 — Current measured in amperes
  C("V","EL6","Counting how much charge passes per second",[
    "<p>Current is a rate: how much charge flows past a point in a wire, per second. The unit is the <strong>ampere</strong> (A) — one ampere means one coulomb of charge (a fixed, large number of electrons) passing every second.</p><div class='formula'>I = Q / t<span class='gloss'>Current equals charge divided by time.</span></div><p>A phone charger pushing 2 amperes is moving twice as much charge per second through the cable as one pushing 1 ampere.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"ampere; current-formula",ground:"g0",buildsOn:["EL5"]}),

  // EL7 — What voltage is
  C("V","EL7","The push behind the flow",[
    "<p>Charge doesn't drift through a wire on its own — something has to push it. That push is <strong>voltage</strong> (also called potential difference), measured in volts.</p><p>A 9V battery pushes harder than a 1.5V battery. Connect either to the same wire and the higher voltage drives more current through it — voltage is the cause, current is the effect.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"voltage; potential-difference",ground:"g0",buildsOn:["EL6"]}),

];

/* ============================================================
   ELECTRICITY & CIRCUITS — Tier 1: Resistance, Ohm's Law, circuits
   ============================================================ */

const TIER_01_RESISTANCE_AND_CIRCUITS = [

  // EL8 — Water-pipe analogy
  C("V","EL8","A circuit is a loop of pipes",[
    "<p>Picture a pump pushing water through a loop of pipe. The pump's strength is like <strong>voltage</strong>. How much water flows per second is like <strong>current</strong>. And a narrow, kinked section of pipe that fights the flow is like <strong>resistance</strong>.</p><p>Squeeze the pipe narrower (more resistance) and less water gets through for the same pump strength. That single picture carries almost the whole of circuit behaviour.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"water-pipe-analogy",ground:"g0",buildsOn:["EL7"]}),

  // EL9 — What resistance is
  C("V","EL9","Why every material fights the flow a little",[
    "<p>As electrons drift through a wire, they keep colliding with the atoms in their way, losing energy each time. That opposition to flow is <strong>resistance</strong>, measured in ohms (Ω).</p><p>A thin, long wire has more resistance than a thick, short one — more atoms in the way, more collisions. A good conductor like copper has very low resistance; a heating element is deliberately made from a material with much higher resistance, which is exactly why it gets hot.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"resistance; ohms",ground:"g0",buildsOn:["EL8"]}),

  // EL10 — Ohm's Law
  C("V","EL10","Voltage, current, and resistance, tied together",[
    "<p>For most conductors, voltage, current, and resistance are locked together by one exact relationship, <strong>Ohm's Law</strong>.</p><div class='formula'>V = I × R<span class='gloss'>Voltage equals current multiplied by resistance.</span></div><p>Push harder (more V) and more current flows, for the same resistance. Add more resistance and the same push drives less current through.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"ohms-law",ground:"g0",buildsOn:["EL9"]}),

  // EL11 — Worked example
  C("V","EL11","Putting numbers through the formula",[
    "<p>A 12V battery is connected across a 4Ω resistor. How much current flows?</p><div class='formula'>I = V / R = 12 / 4 = 3A<span class='gloss'>Rearranging V = IR to solve for current.</span></div><p>Double the resistance to 8Ω with the same battery: I = 12 / 8 = 1.5A — half the current, for double the resistance, exactly as the formula predicts.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"ohms-law-worked-example",ground:"g0",buildsOn:["EL10"]}),

  // EL12 — Series circuits
  C("V","EL12","One loop, no branches",[
    "<p>In a <strong>series circuit</strong>, every component sits along a single loop with no other path available. Whatever current leaves the battery has nowhere else to go, so the exact same current flows through every component in that loop, one after another.</p><p>Unscrew one old-style Christmas light from a series string and the whole string goes dark — there's no other path for the current to take.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"series-circuits",ground:"g0",buildsOn:["EL10"]}),

  // EL13 — Parallel circuits
  C("V","EL13","Several paths, one starting push",[
    "<p>In a <strong>parallel circuit</strong>, components sit on separate branches that reconnect at both ends. Each branch is wired straight across the same two points, so every branch feels the exact same voltage, even though the current can split unevenly between them depending on each branch's resistance.</p><p>Unscrew one bulb in a household parallel wiring setup and the others stay lit — each branch still has its own complete path back to the supply.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"parallel-circuits",ground:"g0",buildsOn:["EL10"]}),

  // EL14 — Resistors in series
  C("V","EL14","Series resistances simply add",[
    "<p>Put resistors one after another in a series loop and their resistances just add up, since the current has to fight through all of them, one after another, with nowhere to skip ahead.</p><div class='formula'>R_total = R1 + R2 + ...<span class='gloss'>Series resistances add directly.</span></div><p>A 3Ω and a 5Ω resistor in series behave exactly like one 8Ω resistor. Connected to a 16V battery, the current is I = 16 / 8 = 2A through the whole loop.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"series-resistance-formula",ground:"g0",buildsOn:["EL12","EL11"]}),

  // EL15 — Resistors in parallel
  C("V","EL15","Parallel paths make the total resistance drop",[
    "<p>Add a second branch next to an existing one and you've handed the current a second route through — the combined resistance can only go down, never up, however big the new branch's own resistance is.</p><div class='formula'>1/R_total = 1/R1 + 1/R2 + ...<span class='gloss'>Take the reciprocal of each resistance, add them, then take the reciprocal of the result.</span></div><p>Two 4Ω resistors in parallel: 1/R = 1/4 + 1/4 = 1/2, so R_total = 2Ω — lower than either resistor on its own, since the current now has two equally easy ways through.</p>"
  ],null,{subject:"physics",topic:"electricity",concept:"parallel-resistance-formula",ground:"g0",buildsOn:["EL13","EL11"]}),

];
