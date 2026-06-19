# Electricity & Circuits — topic spine

A new standalone physics path (not nested in Coordinate Geometry — circuit algebra
isn't graph-native the way fields are; this earns its own path, parallel to the
existing Forces/Energy/Gravity paths). Internal index prefix: **EL#** (temporary,
same convention as Coordinate Geometry's CG# — the real term is BB once locked).

## Tier 0 — Charge and current (EL1–8)

1. **LOCKED.** Electricity named — bridges from Card 11 (conservation of energy): energy can turn into a fast, strong pulse that moves through metals; occurs naturally as lightning.
2. **LOCKED.** The electron-drift speed paradox — a centimetre of copper holds more free electrons than grains of sand on every beach on Earth, yet each drifts slower than a snail. So why does a light switch work instantly?
3. **LOCKED.** Electric potential, via the boulder-on-a-hill / tyre-pressure analogy (bridges from Card 11 and EL2) — charge flows from high potential to low potential, the everyday word for potential difference is "voltage," and a third floor covers conventional current (Franklin's arbitrary 1750s labeling, which we now know points opposite to the real electron flow).
4. **LOCKED.** Like charges repel, opposite charges attract — opens by resolving conventional-current-vs-electron-flow directly: electrons move away from crowded/negative regions toward scarce/relatively-positive ones, which is the real direction of current, before stating the general repel/attract rule.
5. **LOCKED.** Conductors vs insulators — via an electrical-cord scenario (plastic sheath vs bare metal pins), naming free-roaming vs locked electrons. Deliberately stops short of explaining *why* metals have free electrons in the first place (valence electrons, metallic bonding) — that's chemistry's question, logged as a deferred Atoms/Elements→Electricity bridge in BRIDGES.md, not yet its own BB.
6. What electric current is — charge in motion
7. Current is measured in amperes
8. What voltage is — **needs revisiting now that EL3 already covers potential/voltage conceptually; this should become a quantitative follow-up (e.g. comparing 1.5V vs 9V more precisely) rather than re-introducing the concept.**

**SNIPPET-EL** (history aside, parallel to Coordinate Geometry's SNIPPET-T0): Franklin's 1752 kite experiment and the arbitrary positive/negative labeling, through Thomson's 1897 discovery of the electron and Millikan's measurement of its charge, to why "conventional current" was never corrected.

## Tier 1 — Resistance, Ohm's Law, circuits (EL9–16)

9. The water-pipe analogy: voltage = pressure, current = flow, resistance = pipe-narrowness — **author flagged this doesn't work well, revisit**
10. What resistance is
11. Ohm's Law: V = IR
12. Worked example: finding current from voltage and resistance
13. Series circuits — current is the same all the way around
14. Parallel circuits — voltage is the same across every branch
15. Resistors in series — resistances simply add
16. Resistors in parallel — combined resistance is less than the smallest one

Status: EL1-EL5 locked via the real Loop with the author. EL6-EL16 still Editor Mode
batch drafts, not yet run through the real Loop. EL8 needs rework given the overlap
with EL3 (see Tier 0 note above). EL9's water-pipe analogy needs a different approach
(see Tier 1 note above). Diagrams (circuit schematics — battery, resistor, wires) need
a new diagram-engine.js type; not yet built.
