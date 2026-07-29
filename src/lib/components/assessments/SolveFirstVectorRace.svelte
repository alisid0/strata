<script>
  // Vector Racer — a Solve First vectors game.
  //
  // The car sits at a grid point with a VELOCITY vector. Each turn it will coast
  // by that velocity (a ghost shows where). You steer by adding a small
  // ACCELERATION nudge: new velocity = old velocity + nudge, and the car jumps
  // by the new velocity. Velocity carries over — so you can't stop on a dime,
  // you plan the racing line. Three tracks (sprint / bend / hairpin) make the
  // momentum bite. Only at the end is it named: vectors, velocity + acceleration,
  // tip-to-tail addition. Same contract as the other arcade discoveries.
  import ArcadeShell from './ArcadeShell.svelte';
  import { playAward, playBonus } from '../../sfx.js';

  export let config;
  export let onDone = () => {};
  export let onExit = () => {};

  const GW = 15, GH = 11, CELL = 20;
  const W = GW * CELL, H = GH * CELL;
  const cx2 = (x) => x * CELL + CELL / 2;
  const cy2 = (y) => y * CELL + CELL / 2;

  const LEVELS = [
    { name: 'Sprint', start: [1, 5], finishPt: [13, 5],
      onTrack: (x, y) => y >= 3 && y <= 7 && x >= 1 && x <= 13,
      isFinish: (x, y) => x >= 13 && y >= 3 && y <= 7,
      blurb: 'Reach the flag. Tap a dot to set the car\'s next velocity — build speed, then coast in.' },
    { name: 'The bend', start: [1, 8], finishPt: [7, 1],
      onTrack: (x, y) => (y >= 6 && y <= 10 && x >= 1 && x <= 9) || (x >= 5 && x <= 9 && y >= 1 && y <= 10),
      isFinish: (x, y) => y <= 1 && x >= 5 && x <= 9,
      blurb: 'A right-angle bend. Too much speed into the corner and every move overshoots — ease off first.' },
    { name: 'The hairpin', start: [1, 8], finishPt: [1, 3],
      onTrack: (x, y) => (y >= 7 && y <= 9 && x >= 1 && x <= 13) || (x >= 10 && x <= 13 && y >= 2 && y <= 9) || (y >= 2 && y <= 4 && x >= 1 && x <= 13),
      isFinish: (x, y) => x <= 1 && y >= 2 && y <= 4,
      blurb: 'A full U. Down the straight, up the side, back along the top. Momentum is everything.' }
  ];

  let levelIx = 0;
  let cx = 1, cy = 5, vx = 0, vy = 0;
  let phase = 'play';       // play | predict | concept

  // Predict beat: momentum in numbers, no track to lean on.
  const PREDICT = {
    intro: 'Pit-lane check. The car is coasting at velocity (4, 0). Each turn you may nudge by at most 1, and you brake as hard as possible every turn.',
    q: 'How many turns until the car is fully stopped?',
    options: [
      { label: '1 turn — just stop', ok: false },
      { label: '4 turns — speed sheds 1 per turn', ok: true },
      { label: '8 turns — braking halves it each turn', ok: false }
    ],
    hint: 'Each turn: new velocity = old velocity + nudge. The biggest brake nudge is −1, so 4 → 3 → 2 → 1 → 0. Momentum only drains one notch at a time.'
  };
  let predictTries = 0;
  let predictWrong = false;
  let moves = 0, crashes = 0, cleared = 0;
  let arcadeScore = 0, combo = 0;
  let crashFlash = false;
  let recorded = false;

  $: level = LEVELS[levelIx];
  $: reward = Math.min(15, 8 + cleared * 2 + (crashes === 0 ? 1 : 0));

  function loadLevel() {
    const s = LEVELS[levelIx].start;
    cx = s[0]; cy = s[1]; vx = 0; vy = 0; moves = 0; crashFlash = false;
  }

  function segOK(x0, y0, x1, y1) {
    const lvl = LEVELS[levelIx];
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 2 + 1;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      if (!lvl.onTrack(Math.round(x0 + (x1 - x0) * t), Math.round(y0 + (y1 - y0) * t))) return false;
    }
    return true;
  }
  function segFinish(x0, y0, x1, y1) {
    const lvl = LEVELS[levelIx];
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 2 + 1;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      if (lvl.isFinish(Math.round(x0 + (x1 - x0) * t), Math.round(y0 + (y1 - y0) * t))) return true;
    }
    return false;
  }

  // 9 candidate next positions (coast point ± each nudge)
  $: candidates = (() => {
    const list = [];
    for (let ay = -1; ay <= 1; ay++) for (let ax = -1; ax <= 1; ax++) {
      const nx = cx + vx + ax, ny = cy + vy + ay;
      const inGrid = nx >= 0 && nx < GW && ny >= 0 && ny < GH;
      const fin = segFinish(cx, cy, nx, ny);
      const ok = inGrid && (fin || segOK(cx, cy, nx, ny));
      // display clamped into the grid so a fast winning shot never renders
      // off-screen and unclickable; win logic still uses the true nx/ny.
      const dispX = Math.max(0, Math.min(GW - 1, nx)), dispY = Math.max(0, Math.min(GH - 1, ny));
      list.push({ ax, ay, nx, ny, dispX, dispY, ok, fin, coast: ax === 0 && ay === 0 });
    }
    return list;
  })();

  function move(c) {
    if (phase !== 'play') return;
    moves += 1;
    if (c.fin) {
      cleared += 1; combo += 1;
      arcadeScore += (180 + Math.max(0, 60 - moves * 3)) * Math.max(1, combo);
      try { (combo > 1 ? playBonus : playAward)(); } catch (_) {}
      if (levelIx < LEVELS.length - 1) { levelIx += 1; loadLevel(); }
      else { phase = 'predict'; predictWrong = false; }
    } else if (!c.ok) {
      crashes += 1; combo = 0; crashFlash = true;
      setTimeout(() => { crashFlash = false; }, 320);
      loadLevel();
    } else {
      vx = c.nx - cx; vy = c.ny - cy; cx = c.nx; cy = c.ny;
    }
  }

  function answerPredict(opt) {
    predictTries += 1;
    if (!opt.ok) { predictWrong = true; combo = 0; return; }
    arcadeScore += Math.max(40, 180 - (predictTries - 1) * 70);
    try { playBonus(); } catch (_) {}
    phase = 'concept';
    finish();
  }

  function finish() {
    if (recorded) return;
    recorded = true;
    onDone({
      id: config.id, reward, arcadeScore, cleared,
      patternFound: true, compared: true,
      usedHint: predictTries > 1,
      transferFirstTry: predictTries === 1 && crashes === 0
    });
  }
</script>

<ArcadeShell
  eyebrow={`${config.eyebrow} · Arcade mission`}
  title={config.title}
  level={phase === 'concept' ? LEVELS.length : levelIx}
  totalLevels={LEVELS.length}
  score={arcadeScore}
  streak={combo}
  onExit={onExit}
>
  {#if phase === 'predict'}
    <div class="reveal">
      <span class="rv-eyebrow">Final check — call it first</span>
      <h2>Momentum, in numbers.</h2>
      <p>{PREDICT.intro}</p>
      <p><b>{PREDICT.q}</b></p>
      <div class="topts">
        {#each PREDICT.options as opt (opt.label)}
          <button class="topt" on:click={() => answerPredict(opt)}>{opt.label}</button>
        {/each}
      </div>
      {#if predictWrong}<p class="twrong">{PREDICT.hint}</p>{/if}
    </div>

  {:else if phase === 'concept'}
    <div class="reveal">
      <span class="rv-eyebrow">Concept uncovered</span>
      <h2>You were racing on vectors.</h2>
      <p>The car's <b>velocity</b> is a vector — it carries over every turn (that's momentum).
        You steered by adding an <b>acceleration</b> nudge: <b>new velocity = old velocity + nudge</b>,
        joined tip-to-tail. Position just moves by the velocity vector each turn.</p>
      <div class="formula">v<sub>new</sub> = v<sub>old</sub> + a &nbsp;·&nbsp; pos += v<sub>new</sub></div>
      <div class="rv-reward">
        <div><span>Discovery distinction</span><strong>{config.rewardLabel}</strong></div>
        <span class="rv-w">+{reward} W</span>
      </div>
      <div class="rv-skills"><span>Vector addition</span><span>Velocity & acceleration</span><span>Momentum</span></div>
      <button class="rv-exit" on:click={onExit}>Return to workshops</button>
    </div>

  {:else}
    <p class="brief">{level.blurb}</p>

    <div class="track" class:crash={crashFlash}>
      <svg viewBox="0 0 {W} {H}">
        <!-- track cells -->
        {#each Array(GH) as _, gy}
          {#each Array(GW) as _, gx}
            {#if level.onTrack(gx, gy)}
              <rect class="road" class:fin={level.isFinish(gx, gy)} x={gx * CELL + 1} y={gy * CELL + 1} width={CELL - 2} height={CELL - 2} rx="3" />
            {/if}
          {/each}
        {/each}

        <!-- velocity arrow (coast direction) -->
        {#if vx !== 0 || vy !== 0}
          <line class="vel" x1={cx2(cx)} y1={cy2(cy)} x2={cx2(cx + vx)} y2={cy2(cy + vy)} marker-end="url(#vhead)" />
        {/if}
        <defs>
          <marker id="vhead" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--qx-accent)" />
          </marker>
        </defs>

        <!-- candidate moves -->
        {#each candidates as c}
          <circle class="cand" class:fin={c.fin} class:crash={!c.ok && !c.fin} class:coast={c.coast}
            data-cx={c.nx} data-cy={c.ny} data-ok={c.ok || c.fin}
            cx={cx2(c.dispX)} cy={cy2(c.dispY)} r={c.coast ? 5 : 7}
            on:click={() => move(c)} role="button" tabindex="0" />
        {/each}

        <!-- the car -->
        <circle class="car" data-cx={cx} data-cy={cy} cx={cx2(cx)} cy={cy2(cy)} r="6" />
      </svg>
    </div>

    <p class="hint">Velocity <b>({vx}, {vy})</b> — tap a dot to nudge it. The faint ring is "coast" (no nudge).</p>
  {/if}
</ArcadeShell>

<style>
  .brief { font-size: 13px; font-weight: 600; color: var(--qx-text-dim); line-height: 1.4; margin: 0 0 9px; }
  .track { border: 1.5px solid var(--qx-border); border-radius: 12px; background: var(--qx-surface-3); overflow: hidden; transition: box-shadow 0.1s; }
  .track.crash { box-shadow: inset 0 0 0 3px var(--qx-accent); }
  svg { display: block; width: 100%; height: auto; }
  .road { fill: var(--qx-surface); }
  .road.fin { fill: var(--qx-green-soft); }
  .vel { stroke: var(--qx-accent); stroke-width: 2.5; opacity: 0.75; }
  .cand { fill: var(--qx-accent-soft); stroke: var(--qx-accent); stroke-width: 2; cursor: pointer; pointer-events: all; }
  .cand.coast { fill: var(--qx-surface-3); stroke: var(--qx-text-faint); stroke-dasharray: 3 3; }
  .cand.fin { fill: var(--qx-green); stroke: var(--qx-green-text); }
  .cand.crash { fill: var(--qx-surface-2); stroke: var(--qx-border-2); opacity: 0.4; }
  .car { fill: var(--qx-text); stroke: var(--qx-surface); stroke-width: 2; }
  .hint { font-size: 12px; font-weight: 600; color: var(--qx-text-dim); margin: 10px 0 0; text-align: center; }
  .hint b { color: var(--qx-text); font-family: ui-monospace, Menlo, monospace; }

  .topts { width: 100%; display: grid; gap: 8px; }
  .topt {
    border: 1.5px solid var(--qx-border-2); border-radius: 12px; background: var(--qx-surface);
    color: var(--qx-text); font-family: var(--qx-font); font-size: 13px; font-weight: 750;
    min-height: 46px; padding: 8px 14px; cursor: pointer; text-align: left;
  }
  .topt:hover { border-color: var(--qx-accent); }
  .twrong { color: var(--qx-danger-text); font-size: 12.5px; font-weight: 700; }

  .reveal { display: flex; flex-direction: column; gap: 12px; text-align: center; align-items: center; padding: 6px 2px; }
  .rv-eyebrow { font-size: 10px; font-weight: 900; letter-spacing: 0.12em; text-transform: uppercase; color: var(--qx-accent-text); }
  .reveal h2 { font-size: 21px; font-weight: 950; color: var(--qx-text); margin: 0; line-height: 1.15; }
  .reveal p { font-size: 13.5px; font-weight: 600; color: var(--qx-text-dim); line-height: 1.5; margin: 0; }
  .reveal p b { color: var(--qx-text); }
  .formula { font-family: ui-monospace, Menlo, monospace; font-size: 13.5px; font-weight: 800; color: var(--qx-text); }
  .rv-reward { width: 100%; box-sizing: border-box; display: flex; align-items: center; justify-content: space-between; gap: 10px; border: 1.5px solid var(--qx-accent-soft); background: var(--qx-accent-soft); border-radius: 12px; padding: 10px 14px; }
  .rv-reward span { font-size: 10px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: var(--qx-text-faint); }
  .rv-reward strong { display: block; font-size: 15px; font-weight: 900; color: var(--qx-text); }
  .rv-w { font-size: 17px !important; font-weight: 950 !important; color: var(--qx-accent-text) !important; letter-spacing: 0 !important; text-transform: none !important; }
  .rv-skills { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
  .rv-skills span { font-size: 11px; font-weight: 700; color: var(--qx-text-dim); background: var(--qx-surface-2); border: 1px solid var(--qx-border); border-radius: 999px; padding: 4px 11px; }
  .rv-exit { margin-top: 4px; border: none; border-radius: 999px; background: var(--qx-accent); color: #fff; font-family: var(--qx-font); font-size: 14px; font-weight: 850; min-height: 44px; padding: 0 28px; cursor: pointer; }
</style>
