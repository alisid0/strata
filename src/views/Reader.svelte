<script>
  import { onMount } from 'svelte';
  import { DECK, ACTS, DEPTH_NAMES } from '../lib/content/deck.js';
  import { pathsForCard } from '../lib/content/paths.js';
  import { progress } from '../lib/stores/progress.js';
  import { getVideoForCard, getDiagramForCard } from '../lib/content/media.js';
  import VideoPlayer from '../lib/components/VideoPlayer.svelte';
  import ChalkDiagram from '../lib/components/ChalkDiagram.svelte';

  export let startCard = 0;

  let rail;
  let idx = 0;
  let depthOf = DECK.map(() => 0);
  let totalCards = DECK.length;

  $: if (startCard !== idx) { idx = startCard; }

  onMount(() => {
    move(startCard);
  });

  function goDeeper(i) {
    const col = DECK[i];
    const available = col.layers.map((l, k) => l !== null ? k : -1).filter(k => k >= 0);
    const next = available.find(k => k > depthOf[i]);
    if (next === undefined) return;
    depthOf[i] = next;
    depthOf = [...depthOf];
  }

  function goShallower(i) {
    const col = DECK[i];
    const available = col.layers.map((l, k) => l !== null ? k : -1).filter(k => k >= 0);
    const below = [...available].reverse().find(k => k < depthOf[i]);
    if (below === undefined) return;
    depthOf[i] = below;
    depthOf = [...depthOf];
  }

  function move(to) {
    idx = Math.max(0, Math.min(totalCards - 1, to));
    // Record board open
    progress.recordBoardOpen(idx + 1, pathsForCard(idx + 1));
  }

  function renderFloorHTML(i, d) {
    const col = DECK[i];
    const content = col.layers[d];
    if (!content) return '';

    const isObj = typeof content === 'object';
    const floor0Img = (d === 0 && isObj && content.img && !content.text) ? content.img : (d === 0 ? col.img : null);

    if (d === 0 && floor0Img) {
      return `<div class="card-image" style="background-image:url('${floor0Img}')" role="img" aria-label="${col.title}"></div>`;
    }

    let bodyHTML;
    if (isObj) {
      const text = content.text || '';
      const imgPos = content.imgPos || 'above';
      const imgBlock = content.img
        ? `<div class="textbook-img pos-${imgPos}" style="background-image:url('${content.img}')" role="img"></div>`
        : '';
      const textBlock = text ? `<div class="text-block">${text}</div>` : '';
      const sideClass = imgPos === 'side' ? ' has-side-img' : '';
      bodyHTML = `<div class="body${sideClass}">${imgPos === 'below' ? textBlock + imgBlock : imgBlock + textBlock}</div>`;
    } else {
      bodyHTML = `<div class="body">${content}</div>`;
    }

    return `
      <div class="eyebrow">
        <span class="num">${col.kicker}</span>
        <span class="act">${ACTS[col.act]}</span>
        <span class="depthtag">${DEPTH_NAMES[d]}</span>
      </div>
      <h1 class="title">${col.title}</h1>
      ${bodyHTML}
    `;
  }

  function getNextDepth(i) {
    const col = DECK[i];
    const d = depthOf[i];
    const available = col.layers.map((l, k) => l !== null ? k : -1).filter(k => k >= 0);
    return available.find(k => k > d);
  }

  function getDescendLabel(i) {
    const next = getNextDepth(i);
    if (next === undefined) return null;
    const labels = [
      ["Dig in", "make it concrete"],
      ["Dig deeper", "define the idea"],
      ["Go deeper", "watch it act"],
      ["The law", "see it written"]
    ];
    return labels[Math.min(next - 1, labels.length - 1)];
  }

  // Touch handling
  let tx = 0, ty = 0, tdx = 0, tdy = 0, touching = false;

  function handleTouchStart(e) {
    touching = true;
    tx = e.touches[0].clientX;
    ty = e.touches[0].clientY;
    tdx = 0; tdy = 0;
  }
  function handleTouchMove(e) {
    if (!touching) return;
    tdx = e.touches[0].clientX - tx;
    tdy = e.touches[0].clientY - ty;
  }
  function handleTouchEnd() {
    touching = false;
    const ax = Math.abs(tdx), ay = Math.abs(tdy);
    if (ax < 30 && ay < 30) return;
    if (ax > ay) {
      if (tdx < 0) move(idx + 1); else move(idx - 1);
    } else {
      if (tdy < 0) goDeeper(idx); else goShallower(idx);
    }
  }

  function handleKeydown(e) {
    if (e.key === 'ArrowRight') { move(idx + 1); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { move(idx - 1); e.preventDefault(); }
    else if (e.key === 'ArrowDown') { goDeeper(idx); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { goShallower(idx); e.preventDefault(); }
  }

  // Event delegation for descend buttons (rendered via @html)
  function handleRailClick(e) {
    const btn = e.target.closest('.descend');
    if (!btn || btn.classList.contains('atfloor')) return;
    const card = e.target.closest('.card');
    if (!card) return;
    const i = parseInt(card.dataset.i);
    if (!isNaN(i)) goDeeper(i);
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="reader">
  <!-- Top bar -->
  <div id="topbar">
    <div id="brand"><b>STRATA</b> <span class="brand-sub">· physics</span></div>
    <div id="progress-wrap"><div id="progress" style="width:{(idx + 1) / totalCards * 100}%"></div></div>
    <div id="counter">{String(idx + 1).padStart(2, '0')} / {totalCards}</div>
  </div>

  <!-- Prev / Next nav -->
  <button class="nav prev" disabled={idx === 0} on:click={() => move(idx - 1)}>‹</button>
  <button class="nav next" disabled={idx === totalCards - 1} on:click={() => move(idx + 1)}>›</button>

  <!-- Rail -->
  <div
    id="rail"
    bind:this={rail}
    style="transform:translateX(-{idx * 100}%)"
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
    on:click={handleRailClick}
  >
    {#each DECK as col, i}
      <div class="card" data-i={i}>
        <div class="slab" data-depth={depthOf[i]}>
          <button class="ascend" style="display:{depthOf[i] > 0 ? 'flex' : 'none'}" on:click={() => goShallower(i)}>↑</button>
          <div class="ladder">
            {#each col.layers.filter(l => l !== null) as _, k}
              <div class="rung {k === depthOf[i] ? 'filled' : k < depthOf[i] ? 'passed' : ''}"></div>
            {/each}
          </div>
          <div class="slab-inner">
            <div class="floor-content">
              {@html renderFloorHTML(i, depthOf[i])}
            </div>

            {#if getNextDepth(i) !== undefined}
              {@const lab = getDescendLabel(i)}
              <button class="descend" on:click={() => goDeeper(i)}>
                <span class="chev">↓</span>
                <span>
                  <span class="label-top">{lab[0]}</span>
                  <span class="label-sub">{lab[1]}</span>
                </span>
              </button>
            {:else}
              <button class="descend atfloor" disabled>
                <span class="chev">●</span>
                <span>
                  <span class="label-top">Bedrock reached</span>
                  <span class="label-sub">nothing deeper here</span>
                </span>
              </button>
            {/if}

            {#if depthOf[i] === 0 && getVideoForCard(i + 1)}
              <VideoPlayer src={getVideoForCard(i + 1)} />
            {/if}

            {#if depthOf[i] >= 0 && depthOf[i] <= 1 && getDiagramForCard(i + 1)}
              <div class="diagram-wrap">
                <ChalkDiagram spec={getDiagramForCard(i + 1)} />
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .reader {
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  #topbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 10;
    display: flex; align-items: center; gap: 16px;
    padding: 16px clamp(18px, 4vw, 34px);
    pointer-events: none;
  }
  #brand {
    font-family: var(--print); font-size: 17px; letter-spacing: 0.04em;
    color: var(--chalk);
  }
  #brand b { color: var(--chalk-yellow); font-weight: 400; }
  .brand-sub { color: var(--chalk-faint); font-size: 14px; }
  #progress-wrap {
    flex: 1; height: 0; border-top: 2px dashed rgba(244, 241, 233, 0.25);
    position: relative;
  }
  #progress {
    position: absolute; top: -2px; left: 0; height: 0;
    border-top: 2px solid var(--chalk-yellow); width: 0;
    transition: width 0.5s ease;
  }
  #counter {
    font-family: var(--print); font-size: 15px; color: var(--chalk-dim);
    letter-spacing: 0.02em; min-width: 54px; text-align: right;
  }

  #rail {
    position: fixed; top: 0; left: 0; z-index: 1;
    width: 100%; height: 100%;
    display: flex;
    transition: transform 0.62s cubic-bezier(0.16, 0.84, 0.24, 1);
    will-change: transform;
  }
  .card {
    position: relative; flex: 0 0 100%;
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    padding: clamp(64px, 8vh, 96px) clamp(22px, 5vw, 80px) clamp(56px, 7vh, 84px);
  }
  .slab {
    position: relative;
    width: min(680px, 100%);
    max-height: 100%;
    border-radius: 4px;
    background: var(--board-1);
    border: 12px solid var(--frame);
    box-shadow: 0 0 0 2px var(--frame-dark), 0 2px 0 4px rgba(0,0,0,0.25) inset,
      0 30px 70px -28px rgba(0,0,0,0.85), inset 0 0 80px rgba(0,0,0,0.35);
    transition: background 0.7s ease, box-shadow 0.7s ease, border-color 0.7s ease;
    overflow: hidden;
    display: flex; flex-direction: column;
  }
  .slab[data-depth="0"] { background: var(--board-1); }
  .slab[data-depth="1"] { background: var(--board-2); }
  .slab[data-depth="2"] { background: var(--board-3); }
  .slab[data-depth="3"] { background: var(--board-4); }
  .slab[data-depth="4"] { background: var(--board-4); }

  .slab-inner {
    padding: clamp(28px, 4.5vw, 54px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: var(--chalk-faint) transparent;
  }

  .eyebrow {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: clamp(16px, 2.6vw, 26px);
    font-family: var(--print); font-size: 14px; letter-spacing: 0.04em;
    color: var(--chalk-dim);
  }
  .eyebrow .num { color: var(--chalk-yellow); font-weight: 400; }
  .eyebrow .act { flex: 1; color: var(--chalk-faint); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .eyebrow .depthtag {
    color: var(--chalk-green);
    border: 1.5px dashed var(--chalk-faint);
    border-radius: 14px; padding: 2px 11px;
    font-size: 12px; letter-spacing: 0.02em;
    transform: rotate(-1.2deg);
  }
  h1.title {
    font-family: var(--hand-display); font-weight: 400;
    font-size: clamp(30px, 6.4vw, 50px);
    line-height: 1.06; letter-spacing: 0.005em;
    margin-bottom: clamp(16px, 3vw, 26px);
    color: var(--chalk);
    text-shadow: 0 1px 0 rgba(0,0,0,0.25);
  }
  .body {
    font-family: var(--hand);
    font-size: clamp(18px, 2.5vw, 22px);
    line-height: 1.62;
    color: var(--chalk);
  }
  .body :global(p) { margin-bottom: 0.85em; }
  .body :global(strong) { color: var(--chalk-yellow); font-weight: 700; }
  .body :global(em) { color: var(--chalk-green); font-style: normal; border-bottom: 1.5px dotted var(--chalk-faint); }

  .nav {
    position: fixed; top: 50%; transform: translateY(-50%); z-index: 8;
    width: 48px; height: 48px; border-radius: 50%;
    border: 1.5px dashed var(--chalk-faint);
    background: rgba(21, 42, 34, 0.6);
    backdrop-filter: blur(6px);
    color: var(--chalk-dim); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
  }
  .nav:disabled { opacity: 0.18; cursor: default; }
  .nav.prev { left: 18px; }
  .nav.next { right: 18px; }
  @media (max-width: 720px) { .nav { display: none; } }

  .ascend {
    position: absolute; top: 12px; right: 12px; z-index: 5;
    width: 36px; height: 36px; border-radius: 50%;
    border: 1.5px dashed var(--chalk-faint); background: rgba(0,0,0,0.2);
    color: var(--chalk-dim); cursor: pointer;
    display: none; align-items: center; justify-content: center;
    font-size: 17px;
  }
  .ladder {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    z-index: 5; display: flex; flex-direction: column; gap: 9px;
  }
  .rung {
    width: 9px; height: 9px; border-radius: 50%;
    border: 1.5px solid var(--chalk-faint);
    background: transparent; transition: all 0.4s;
  }
  .rung.filled { background: var(--chalk-yellow); border-color: var(--chalk-yellow); }
  .rung.passed { background: var(--chalk-faint); border-color: var(--chalk-faint); }

  :global(.descend) {
    margin-top: clamp(20px, 3.5vw, 30px);
    display: flex; align-items: center; gap: 13px;
    cursor: pointer;
    border: none; background: none; color: inherit;
    font-family: var(--print); font-size: 15px; letter-spacing: 0.02em;
    padding: 6px 0;
  }
  :global(.descend .chev) {
    width: 34px; height: 34px; border-radius: 50%;
    border: 1.5px dashed var(--chalk-green);
    display: flex; align-items: center; justify-content: center;
    color: var(--chalk-green); flex-shrink: 0; font-size: 17px;
  }
  :global(.descend .label-top) { color: var(--chalk); }
  :global(.descend .label-sub) { color: var(--chalk-faint); display: block; font-size: 12.5px; }
  :global(.descend.atfloor) { opacity: 0.45; cursor: default; }
  :global(.descend.atfloor .chev) { border-style: dotted; color: var(--chalk-faint); }

  .card-image {
    flex: 1; width: 100%;
    background-size: contain; background-position: center; background-repeat: no-repeat;
    background-color: #1e3b2e;
    min-height: 0;
  }
  .textbook-img {
    width: 100%; max-height: 38vh;
    background-size: contain; background-position: center; background-repeat: no-repeat;
    border-radius: 6px; margin-bottom: 16px;
    aspect-ratio: 1/1;
  }
  .textbook-img.pos-below { margin-bottom: 0; margin-top: 16px; }
  .text-block { font-family: var(--hand); font-size: clamp(18px, 2.5vw, 22px); line-height: 1.62; color: var(--chalk); }
  .text-block :global(p) { margin-bottom: 0.85em; }
  .diagram-wrap {
    width: 100%;
    max-height: 32vh;
    margin: 12px 0;
    border: 1.5px dashed rgba(244,241,233,0.12);
    border-radius: 6px;
    overflow: hidden;
    background: rgba(0,0,0,0.12);
  }
  .floor-content { width: 100%; }
</style>
