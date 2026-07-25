<script>
  // EquationBalancer — the signature "balance it" chemistry lab. Adjust the
  // coefficient in front of each species and watch every element's atom count
  // on the left and right go red -> green as it balances. A station is solved
  // when every element balances AND the coefficients are in their simplest
  // whole-number ratio. Five stations of rising difficulty; scored 1/1.

  export let prompt = 'Balance each equation: match the atoms on both sides.';
  export let onDone = () => {};

  // Each species: { f: display formula, a: { element: count } }.
  const STATIONS = [
    {
      label: 'Water',
      note: 'Hydrogen burns in oxygen to form water.',
      left: [{ f: 'H2', a: { H: 2 } }, { f: 'O2', a: { O: 2 } }],
      right: [{ f: 'H2O', a: { H: 2, O: 1 } }],
    },
    {
      label: 'Ammonia',
      note: 'Nitrogen and hydrogen combine to make ammonia.',
      left: [{ f: 'N2', a: { N: 2 } }, { f: 'H2', a: { H: 2 } }],
      right: [{ f: 'NH3', a: { N: 1, H: 3 } }],
    },
    {
      label: 'Methane',
      note: 'Methane burns completely in oxygen.',
      left: [{ f: 'CH4', a: { C: 1, H: 4 } }, { f: 'O2', a: { O: 2 } }],
      right: [{ f: 'CO2', a: { C: 1, O: 2 } }, { f: 'H2O', a: { H: 2, O: 1 } }],
    },
    {
      label: 'Rust',
      note: 'Iron reacts with oxygen to form iron(III) oxide.',
      left: [{ f: 'Fe', a: { Fe: 1 } }, { f: 'O2', a: { O: 2 } }],
      right: [{ f: 'Fe2O3', a: { Fe: 2, O: 3 } }],
    },
    {
      label: 'Ethane',
      note: 'Ethane burns in oxygen — watch the odd oxygen count.',
      left: [{ f: 'C2H6', a: { C: 2, H: 6 } }, { f: 'O2', a: { O: 2 } }],
      right: [{ f: 'CO2', a: { C: 1, O: 2 } }, { f: 'H2O', a: { H: 2, O: 1 } }],
    },
  ];

  let stage = 0;
  let stageDone = false;
  let complete = false;
  let coeffs = [];

  function seedStage(i) {
    const s = STATIONS[i];
    coeffs = [...s.left, ...s.right].map(() => 1);
    stageDone = false;
  }
  seedStage(0);

  const MAX = 12;
  function bump(i, d) {
    if (stageDone) return;
    const next = Math.min(MAX, Math.max(1, coeffs[i] + d));
    coeffs[i] = next;
    coeffs = [...coeffs];
  }

  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const digits = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
  const sub = (f) => f.replace(/\d/g, (d) => digits[d]); // H2O -> H₂O

  $: station = STATIONS[stage];
  $: species = [...station.left.map((s) => ({ ...s, side: 'L' })), ...station.right.map((s) => ({ ...s, side: 'R' }))];
  $: elements = [...new Set(species.flatMap((s) => Object.keys(s.a)))];
  $: tally = elements.map((el) => {
    let L = 0, R = 0;
    species.forEach((s, i) => {
      const n = (s.a[el] || 0) * coeffs[i];
      if (s.side === 'L') L += n; else R += n;
    });
    return { el, L, R, ok: L === R && L > 0 };
  });
  $: allBalanced = tally.length > 0 && tally.every((t) => t.ok);
  $: simplest = coeffs.reduce((a, b) => gcd(a, b), 0) === 1;
  $: overBalanced = allBalanced && !simplest;
  // Auto-mark solved: balanced in the simplest whole-number ratio.
  $: if (allBalanced && simplest && !stageDone) { stageDone = true; }

  $: nLeft = station.left.length;

  function nextStage() {
    if (stage < STATIONS.length - 1) { stage += 1; seedStage(stage); }
    else complete = true;
  }
</script>

<div class="eb-lab">
  {#if complete}
    <div class="eb-complete">
      <div class="eb-complete-mark">✓</div>
      <div class="eb-complete-title">Equation Balancer complete</div>
      <p>You balanced every equation by matching atoms on both sides, and reduced each to its simplest whole-number ratio — the two rules every balanced equation obeys.</p>
      <button class="eb-primary" on:click={() => onDone(1, 1)}>Continue</button>
    </div>
  {:else}
    <div class="eb-prompt">{prompt}</div>

    <div class="eb-stages" aria-label="Equations">
      {#each STATIONS as s, i}
        <span class="eb-stage-dot" class:done={i < stage} class:cur={i === stage}>{s.label}</span>
      {/each}
    </div>

    <div class="eb-note">{station.note}</div>

    <!-- The equation: coefficient stepper above each formula -->
    <div class="eb-equation">
      {#each species as s, i}
        {#if i === nLeft}
          <div class="eb-arrow">→</div>
        {:else if i > 0}
          <div class="eb-plus">+</div>
        {/if}
        <div class="eb-species">
          <div class="eb-stepper">
            <button on:click={() => bump(i, -1)} disabled={stageDone || coeffs[i] <= 1} aria-label="decrease">−</button>
            <span class="eb-coeff" class:one={coeffs[i] === 1}>{coeffs[i]}</span>
            <button on:click={() => bump(i, 1)} disabled={stageDone || coeffs[i] >= MAX} aria-label="increase">+</button>
          </div>
          <div class="eb-formula">{sub(s.f)}</div>
        </div>
      {/each}
    </div>

    <!-- Live per-element tally -->
    <div class="eb-tally">
      {#each tally as t}
        <div class="eb-atom" class:ok={t.ok}>
          <span class="eb-el">{t.el}</span>
          <span class="eb-counts">{t.L} <span class="eb-vs">|</span> {t.R}</span>
          <span class="eb-mark">{t.ok ? '✓' : '✗'}</span>
        </div>
      {/each}
    </div>

    {#if stageDone}
      <div class="eb-good">Balanced — atoms match on both sides, in the simplest ratio.</div>
      <button class="eb-primary" on:click={nextStage}>{stage === STATIONS.length - 1 ? 'Finish the lab' : 'Next equation →'}</button>
    {:else if overBalanced}
      <div class="eb-hint">Every atom matches, but the coefficients share a common factor. Divide them all down to the simplest whole-number ratio.</div>
    {:else}
      <div class="eb-instruction">Make every element’s count equal on both sides. Red rows are still off.</div>
    {/if}
  {/if}
</div>

<style>
  .eb-lab { width: 100%; max-width: 400px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 13px; }
  .eb-prompt { color: var(--qx-text); font-size: 15px; font-weight: 780; line-height: 1.42; text-align: center; }

  .eb-stages { display: flex; gap: 5px; flex-wrap: wrap; justify-content: center; }
  .eb-stage-dot {
    font-size: 10px; font-weight: 850; letter-spacing: 0.04em; text-transform: uppercase;
    padding: 4px 9px; border-radius: 999px; border: 1px solid var(--qx-border);
    background: var(--qx-surface-2); color: var(--qx-text-faint);
  }
  .eb-stage-dot.cur { border-color: var(--qx-accent); background: var(--qx-accent-soft); color: var(--qx-accent-text); }
  .eb-stage-dot.done { border-color: var(--qx-green); background: var(--qx-green-soft); color: var(--qx-green-text); }

  .eb-note { font-size: 13px; font-weight: 650; color: var(--qx-text-dim); text-align: center; line-height: 1.4; }

  .eb-equation {
    width: 100%; display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: center; gap: 6px;
    border: 1.5px solid var(--qx-border); border-radius: 10px; padding: 14px 10px;
    background: radial-gradient(circle at 50% 20%, var(--qx-surface-2), var(--qx-surface));
  }
  .eb-species { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .eb-stepper { display: flex; align-items: center; gap: 4px; }
  .eb-stepper button {
    width: 26px; height: 26px; border-radius: 7px; border: 1.5px solid var(--qx-border-2);
    background: var(--qx-surface); color: var(--qx-text); font-family: var(--qx-font);
    font-size: 16px; font-weight: 900; cursor: pointer; line-height: 1;
  }
  .eb-stepper button:disabled { opacity: 0.4; cursor: default; }
  .eb-coeff {
    min-width: 22px; text-align: center; font-size: 17px; font-weight: 900;
    color: var(--qx-accent-text); font-variant-numeric: tabular-nums;
  }
  .eb-coeff.one { color: var(--qx-text-faint); }
  .eb-formula { font-size: 19px; font-weight: 800; color: var(--qx-text); letter-spacing: 0.01em; }
  .eb-plus, .eb-arrow { font-size: 18px; font-weight: 800; color: var(--qx-text-faint); padding-bottom: 4px; }
  .eb-arrow { color: var(--qx-accent-text); font-size: 20px; }

  .eb-tally { display: flex; gap: 7px; flex-wrap: wrap; justify-content: center; }
  .eb-atom {
    display: flex; align-items: center; gap: 6px;
    padding: 6px 11px; border-radius: 999px;
    border: 1.5px solid var(--qx-danger); background: var(--qx-danger-soft);
  }
  .eb-atom.ok { border-color: var(--qx-green); background: var(--qx-green-soft); }
  .eb-el { font-size: 14px; font-weight: 900; color: var(--qx-text); }
  .eb-counts { font-size: 13px; font-weight: 800; font-variant-numeric: tabular-nums; color: var(--qx-text-dim); }
  .eb-vs { color: var(--qx-text-faintest); }
  .eb-mark { font-size: 12px; font-weight: 900; color: var(--qx-danger-text); }
  .eb-atom.ok .eb-mark { color: var(--qx-green-text); }

  .eb-instruction { font-size: 13.5px; font-weight: 720; color: var(--qx-text); text-align: center; line-height: 1.45; }

  .eb-hint, .eb-good {
    width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 8px;
    font-size: 12.5px; font-weight: 700; line-height: 1.45; text-align: center;
  }
  .eb-hint { background: var(--qx-yellow-soft); color: var(--qx-yellow-text); }
  .eb-good { background: var(--qx-green-soft); color: var(--qx-green-text); }

  .eb-primary {
    min-height: 42px; width: 100%; border-radius: 999px; border: none;
    background: var(--qx-accent); color: #fff; font-family: var(--qx-font);
    font-size: 14px; font-weight: 850; cursor: pointer;
  }

  .eb-complete { display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; padding: 28px 0; }
  .eb-complete-mark {
    width: 62px; height: 62px; border-radius: 50%; background: var(--qx-green-soft);
    border: 2px solid var(--qx-green); color: var(--qx-green-text);
    font-size: 30px; font-weight: 900; display: grid; place-items: center;
  }
  .eb-complete-title { font-size: 18px; font-weight: 900; color: var(--qx-text); }
  .eb-complete p { font-size: 13.5px; font-weight: 650; color: var(--qx-text-dim); line-height: 1.5; max-width: 34ch; margin: 0; }
</style>
