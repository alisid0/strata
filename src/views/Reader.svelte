<script>
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { DEPTH_NAMES } from '../lib/content/deck.js';
  import { getBoard } from '../lib/content/dynamicBoards.js';
  import { formatMath } from '../lib/content/mathFormat.js';
  import { pathsForCard } from '../lib/content/paths.js';
  import { progress } from '../lib/stores/progress.js';
  import { getVideoForCard, getDiagramForCard } from '../lib/content/media.js';
  import VideoPlayer from '../lib/components/VideoPlayer.svelte';
  import ChalkDiagram from '../lib/components/ChalkDiagram.svelte';
  import SubjectMark from '../lib/components/SubjectMark.svelte';
  import QxIcon from '../lib/components/qubix/QxIcon.svelte';

  // The card numbers this rail spans (static + any dynamic ones the caller
  // already fetched via dynamicBoards.fetchBoardsByNumbers before navigating
  // here), and which number to open on. Position in `numbers`, not the card
  // number itself, is what `idx`/`depthOf`/etc. index by from here on.
  export let numbers = [];
  export let startNumber = 1;
  export let onBack = null;

  let idx = 0;
  let depthOf = numbers.map(() => 0);
  let nextDepths = [];
  let totalCards = numbers.length;
  let audioEl;
  let playingKey = null;

  function availableFloors(i) {
    const card = getBoard(numbers[i]);
    return card ? card.layers.map((l, k) => l !== null ? k : -1).filter(k => k >= 0) : [];
  }

  function rebuildDerived() {
    nextDepths = numbers.map((_, j) => availableFloors(j).find(k => k > depthOf[j]));
  }
  rebuildDerived(); // initialize

  onMount(() => {
    move(Math.max(0, numbers.indexOf(startNumber)));
  });

  let floorDir = 1; // 1 = digging deeper (slide up from below), -1 = surfacing (slide down from above)
  const reduceMotion = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function goDeeper(i) {
    const next = availableFloors(i).find(k => k > depthOf[i]);
    if (next === undefined) return;
    floorDir = 1;
    depthOf[i] = next;
    depthOf = [...depthOf];
    rebuildDerived();
  }

  function goShallower(i) {
    const below = [...availableFloors(i)].reverse().find(k => k < depthOf[i]);
    if (below === undefined) return;
    floorDir = -1;
    depthOf[i] = below;
    depthOf = [...depthOf];
    rebuildDerived();
  }

  function move(to) {
    idx = Math.max(0, Math.min(totalCards - 1, to));
    const cardNumber = numbers[idx];
    progress.recordBoardOpen(cardNumber, pathsForCard(cardNumber));
  }

  // Floor 0 is the swipe card only when there's a top-level image and the
  // floor-0 layer itself isn't a text-bearing object override.
  function floor0Img(i) {
    const col = getBoard(numbers[i]);
    if (!col) return null;
    const content = col.layers[0];
    if (content && typeof content === 'object' && content.img && !content.text) return content.img;
    return col.img || null;
  }
  function isSwipeCard(i, d) {
    return d === 0 && !!floor0Img(i);
  }

  // DEPTH_NAMES indexes the five reading floors. When floor 0 is the image-only
  // swipe card, reading starts at floor 1, so the name/number shift by one.
  function depthName(i, d) {
    const idx = floor0Img(i) ? d - 1 : d;
    return DEPTH_NAMES[idx] || '';
  }
  function floorNumber(i, d) {
    return floor0Img(i) ? d : d + 1;
  }
  function floorTotal(i) {
    const len = getBoard(numbers[i])?.layers.length || 0;
    return floor0Img(i) ? len - 1 : len;
  }

  function floorBodyHTML(i, d) {
    const content = getBoard(numbers[i])?.layers[d];
    if (!content) return '';
    return typeof content === 'object' ? (content.text || '') : content;
  }

  // Media priority for a reading floor: the layer's own image, else a Manim
  // video (floor 0 only), else an interactive diagram (floors 0-1 only).
  function floorMedia(i, d) {
    const content = getBoard(numbers[i])?.layers[d];
    const cardNumber = numbers[i];
    const isObj = content && typeof content === 'object';
    if (isObj && content.img) return { type: 'img', src: content.img };
    if (d === 0 && getVideoForCard(cardNumber)) return { type: 'video', src: getVideoForCard(cardNumber) };
    if (d <= 1 && getDiagramForCard(cardNumber)) return { type: 'diagram', spec: getDiagramForCard(cardNumber) };
    return null;
  }

  // A floor's narration clip, if its layer is the {text,img,audio} object form.
  function floorAudio(i, d) {
    const content = getBoard(numbers[i])?.layers[d];
    return (content && typeof content === 'object' && content.audio) || null;
  }

  function toggleAudio(i, d) {
    const url = floorAudio(i, d);
    if (!url || !audioEl) return;
    const key = `${numbers[i]}-${d}`;
    if (playingKey === key) {
      audioEl.pause();
      playingKey = null;
    } else {
      audioEl.src = url;
      audioEl.play();
      playingKey = key;
    }
  }

  function railFloors(i) {
    return availableFloors(i).filter(k => !(floor0Img(i) && k === 0));
  }

  function humanize(s) {
    return s ? s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '';
  }

  // Touch handling — horizontal drag-follow across BBs, plus a reel-style
  // vertical elastic overscroll on the dig/surface axis (the card rubber-bands
  // ~1.5% of the screen and springs back; overscrolling past a threshold
  // digs/surfaces).
  let tx = 0, ty = 0, tdx = 0, tdy = 0, touching = false;
  let axis = null;          // 'x' | 'y' once the gesture locks to an axis
  let dragOffset = 0;       // live horizontal drag distance (px)
  let isDragging = false;   // horizontal drag → disables rail transition
  let dragOffsetY = 0;      // live vertical elastic offset on the active card (px)
  let isVDragging = false;  // vertical overscroll → disables card transition
  let vScroller = null;     // the active floor's scrollable text, if any
  let vEngaged = false;     // the vertical swipe actually reached an overscroll edge

  function handleTouchStart(e) {
    touching = true;
    tx = e.touches[0].clientX;
    ty = e.touches[0].clientY;
    tdx = 0; tdy = 0; axis = null;
    dragOffset = 0; isDragging = false;
    dragOffsetY = 0; isVDragging = false; vEngaged = false;
    vScroller = e.target.closest?.('.card')?.querySelector('.floor-text') || null;
  }
  function handleTouchMove(e) {
    if (!touching) return;
    tdx = e.touches[0].clientX - tx;
    tdy = e.touches[0].clientY - ty;
    if (!axis && (Math.abs(tdx) > 8 || Math.abs(tdy) > 8)) {
      axis = Math.abs(tdx) > Math.abs(tdy) ? 'x' : 'y';
    }
    if (axis === 'x') {
      isDragging = true;
      const atEdge = (idx === 0 && tdx > 0) || (idx === totalCards - 1 && tdx < 0);
      dragOffset = atEdge ? tdx * 0.3 : tdx; // rubber-band at the ends
    } else if (axis === 'y') {
      // Only bounce once the reading text can't scroll further that way (or
      // there's no scroller) — otherwise let the text scroll normally.
      const atTop = !vScroller || vScroller.scrollTop <= 0;
      const atBottom = !vScroller || (vScroller.scrollTop + vScroller.clientHeight >= vScroller.scrollHeight - 1);
      if ((tdy > 0 && atTop) || (tdy < 0 && atBottom)) {
        vEngaged = true; isVDragging = true;
        const maxB = (typeof window !== 'undefined' ? window.innerHeight : 700) * 0.015;
        dragOffsetY = maxB * Math.tanh(tdy / (maxB * 3)); // smooth asymptote toward ±1.5%
      } else {
        isVDragging = false; dragOffsetY = 0;
      }
    }
  }
  function handleTouchEnd() {
    touching = false;
    if (axis === 'x') {
      const w = typeof window !== 'undefined' ? window.innerWidth : 360;
      const threshold = Math.min(80, w * 0.22);
      if (tdx <= -threshold) move(idx + 1);
      else if (tdx >= threshold) move(idx - 1);
    } else if (axis === 'y' && vEngaged && Math.abs(tdy) >= 40) {
      // Overscrolled past the threshold → change floor (a no-op at bedrock/top,
      // which simply leaves the elastic bounce as the feedback).
      if (tdy < 0) goDeeper(idx); else goShallower(idx);
    }
    axis = null;
    dragOffset = 0; isDragging = false;
    dragOffsetY = 0; isVDragging = false; vEngaged = false;
  }

  function handleKeydown(e) {
    if (e.key === 'ArrowRight') { move(idx + 1); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { move(idx - 1); e.preventDefault(); }
    else if (e.key === 'ArrowDown') { goDeeper(idx); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { goShallower(idx); e.preventDefault(); }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="qx-shell reader">
  <div id="topbar">
    <button id="back" on:click={() => onBack?.()} aria-label="Back to topic"><QxIcon name="chevronLeft" size={18} /></button>
    <div id="brand">QUBIX</div>
    <div id="progress-wrap"><div id="progress" style="width:{(idx + 1) / totalCards * 100}%"></div></div>
    <div id="counter">{String(idx + 1).padStart(2, '0')} / {totalCards}</div>
  </div>

  <button class="side-nav prev" disabled={idx === 0} on:click={() => move(idx - 1)}><QxIcon name="chevronLeft" size={18} /></button>
  <button class="side-nav next" disabled={idx === totalCards - 1} on:click={() => move(idx + 1)}><QxIcon name="chevronRight" size={18} /></button>

  <div
    id="rail"
    class:dragging={isDragging}
    style="transform:translateX({-idx * 100}%) translateX({dragOffset}px)"
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
  >
    {#each numbers as n, i}
      {@const col = getBoard(n)}
      <div class="card" class:vdragging={isVDragging && i === idx} style="transform:translateY({i === idx ? dragOffsetY : 0}px)">
        {#if col}
        <div class="slab">
          {#if isSwipeCard(i, depthOf[i])}
            {@const audioUrl = floorAudio(i, 0)}
            <div class="swipe-card" style="background-image:url('{floor0Img(i)}')">
              <div class="swipe-gradient"></div>
              <div class="swipe-top">
                <span class="chip">
                  <span class="chip-mark"><SubjectMark subject={col.tags?.subject} accent="#ffffff" size={16} /></span>
                  <span>{humanize(col.tags?.subject)} · {humanize(col.tags?.topic)}</span>
                </span>
                <span class="tier-badge">{col.tags?.ground || ''}</span>
              </div>
              <button
                class="audio-btn"
                class:playing={playingKey === `${n}-0`}
                disabled={!audioUrl}
                title={audioUrl ? (playingKey === `${n}-0` ? 'Pause audio' : 'Play audio') : 'Audio coming soon'}
                on:click|stopPropagation={() => toggleAudio(i, 0)}
              ><QxIcon name="volume" size={16} /></button>
              <button class="swipe-bottom" on:click={() => goDeeper(i)}>
                <div class="swipe-kicker">{col.kicker}</div>
                <div class="swipe-title">{col.title}</div>
                <div class="dig-hint">
                  <span class="dig-circle"><QxIcon name="chevronDown" size={16} /></span>
                  <span>Swipe down to dig in</span>
                </div>
              </button>
            </div>
          {:else}
            {@const d = depthOf[i]}
            {@const media = floorMedia(i, d)}
            {@const audioUrl = floorAudio(i, d)}
            <div class="card-header">
              <span class="header-mark"><SubjectMark subject={col.tags?.subject} accent="#454ADE" size={18} /></span>
              <div class="header-text">
                <div class="header-title">{col.title}</div>
                <div class="header-sub">{col.kicker} · {humanize(col.tags?.subject)}</div>
              </div>
              <button
                class="audio-btn small"
                class:playing={playingKey === `${n}-${d}`}
                disabled={!audioUrl}
                title={audioUrl ? (playingKey === `${n}-${d}` ? 'Pause audio' : 'Play audio') : 'Audio coming soon'}
                on:click={() => toggleAudio(i, d)}
              ><QxIcon name="volume" size={14} /></button>
            </div>

            <div class="reading-body">
              <div class="depth-rail">
                {#each railFloors(i) as floorIdx}
                  <div class="rail-dot" class:current={floorIdx === d} class:passed={floorIdx < d}></div>
                {/each}
              </div>

              <div class="reading-content">
                {#key d}
                  <div class="floor-anim"
                       in:fly={{ y: reduceMotion ? 0 : floorDir * 38, duration: reduceMotion ? 0 : 320, easing: cubicOut }}
                       out:fly={{ y: reduceMotion ? 0 : -floorDir * 38, duration: reduceMotion ? 0 : 320, easing: cubicOut }}>
                    <div class="floor-meta">
                      <span class="floor-pill" class:law={depthName(i, d) === 'The law'}>{depthName(i, d).toUpperCase()}</span>
                      <span class="floor-count">Floor {floorNumber(i, d)} of {floorTotal(i)}</span>
                    </div>
                    <div class="floor-text">{@html formatMath(floorBodyHTML(i, d))}</div>
                    {#if media}
                      <div class="floor-media">
                        {#if media.type === 'img'}
                          <div class="media-img" style="background-image:url('{media.src}')" role="img"></div>
                        {:else if media.type === 'video'}
                          <VideoPlayer src={media.src} />
                        {:else if media.type === 'diagram'}
                          <div class="media-diagram"><ChalkDiagram spec={media.spec} /></div>
                        {/if}
                      </div>
                    {/if}
                  </div>
                {/key}
              </div>
            </div>

            <div class="nav-arrows">
              {#if d > 0}
                <button class="arrow-btn" on:click={() => goShallower(i)} title="Back to surface"><QxIcon name="chevronUp" size={18} /></button>
              {/if}
              {#if nextDepths[i] !== undefined}
                <button class="arrow-btn primary" on:click={() => goDeeper(i)} title="Dig deeper"><QxIcon name="chevronDown" size={18} /></button>
              {:else}
                <button class="arrow-btn" disabled title="Bedrock reached"><QxIcon name="chevronDown" size={18} /></button>
              {/if}
            </div>
          {/if}
        </div>
        {:else}
        <div class="slab loading-slab">Loading…</div>
        {/if}
      </div>
    {/each}
  </div>

  <audio bind:this={audioEl} on:ended={() => playingKey = null} hidden></audio>
</div>

<style>
  .reader {
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
    background: var(--qx-bg);
  }
  #topbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 10;
    max-width: 480px; margin: 0 auto;
    display: flex; align-items: center; gap: 14px;
    padding: 14px clamp(18px, 4vw, 34px);
    pointer-events: none;
  }
  #back {
    pointer-events: auto;
    width: 30px; height: 30px; flex-shrink: 0; border-radius: 50%;
    border: 1.5px solid var(--qx-border-2); background: var(--qx-surface);
    color: var(--qx-text-dim); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }
  #brand { font-size: 13px; font-weight: 900; letter-spacing: 0.14em; color: var(--qx-accent); }
  #progress-wrap { flex: 1; height: 2px; background: var(--qx-border-2); border-radius: 2px; position: relative; }
  #progress { position: absolute; top: 0; left: 0; height: 2px; background: var(--qx-accent); border-radius: 2px; width: 0; transition: width 0.5s ease; }
  #counter { font-size: 12px; font-weight: 700; color: var(--qx-text-faint); min-width: 50px; text-align: right; }

  .side-nav {
    position: fixed; top: 50%; transform: translateY(-50%); z-index: 8;
    width: 38px; height: 38px; border-radius: 50%;
    border: 1.5px solid var(--qx-border-2);
    background: var(--qx-surface);
    color: var(--qx-text-dim); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }
  .side-nav:disabled { opacity: 0.25; cursor: default; }
  .side-nav.prev { left: calc(50% - 294px); }
  .side-nav.next { right: calc(50% - 294px); }
  @media (max-width: 720px) { .side-nav { display: none; } }

  #rail {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1;
    max-width: 480px; margin: 0 auto;
    height: 100%;
    display: flex;
    transition: transform 0.62s cubic-bezier(0.16, 0.84, 0.24, 1);
    will-change: transform;
    touch-action: pan-y; /* we own horizontal swipes; vertical still scrolls/digs */
  }
  #rail.dragging { transition: none; } /* follow the finger 1:1 while dragging */
  .card {
    position: relative; flex: 0 0 100%;
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    padding: clamp(56px, 7vh, 80px) clamp(14px, 4vw, 60px) clamp(18px, 3vh, 32px);
    box-sizing: border-box;
    transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); /* springy elastic snap-back */
  }
  .card.vdragging { transition: none; } /* follow the finger 1:1 while overscrolling */
  .slab {
    position: relative;
    width: min(420px, 100%);
    height: 100%;
    border-radius: var(--qx-radius-lg);
    background: var(--qx-surface);
    border: 1px solid var(--qx-border);
    box-shadow: var(--qx-shadow-card);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  /* ---- Floor 0: swipe card ---- */
  .swipe-card {
    flex: 1; width: 100%; height: 100%;
    background-size: cover; background-position: center;
    background-color: #0B132B;
    display: flex; flex-direction: column;
    position: relative;
    cursor: pointer;
    border: none; padding: 0; text-align: left; font-family: var(--qx-font);
  }
  .swipe-gradient {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(11,19,43,0.5) 0%, rgba(11,19,43,0) 28%, rgba(11,19,43,0) 48%, rgba(11,19,43,0.86) 100%);
    pointer-events: none;
  }
  .swipe-top {
    position: relative; z-index: 2; display: flex; justify-content: space-between; align-items: center;
    padding: 16px 16px 0;
  }
  .chip {
    display: flex; align-items: center; gap: 7px;
    background: rgba(255,255,255,0.16); backdrop-filter: blur(8px);
    border-radius: var(--qx-radius-pill); padding: 4px 11px 4px 4px;
    font-size: 11px; font-weight: 800; color: #fff;
  }
  .chip-mark { width: 22px; height: 22px; border-radius: 50%; background: var(--qx-accent); color: #fff; display: flex; align-items: center; justify-content: center; }
  .tier-badge { font-size: 10px; font-weight: 800; color: #0B132B; background: #fff; border-radius: 7px; padding: 3px 8px; }

  .audio-btn {
    position: absolute; top: 16px; right: 16px; z-index: 3;
    width: 32px; height: 32px; border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.12);
    color: #fff; display: flex; align-items: center; justify-content: center; cursor: not-allowed; opacity: 0.55;
  }
  .audio-btn.small {
    position: static; border-color: var(--qx-border-2); background: var(--qx-surface); color: var(--qx-text-faint);
    width: 30px; height: 30px; flex-shrink: 0;
  }
  .audio-btn:not(:disabled) { cursor: pointer; opacity: 1; }
  .audio-btn.playing { background: var(--qx-accent); border-color: var(--qx-accent); color: #fff; }
  .audio-btn.small.playing { background: var(--qx-accent); border-color: var(--qx-accent); color: #fff; }

  .swipe-bottom {
    position: relative; z-index: 2; margin-top: auto;
    padding: 0 18px 18px; display: block; width: 100%;
    background: none; border: none; cursor: pointer;
  }
  .swipe-kicker { font-size: 11px; font-weight: 800; letter-spacing: 0.12em; color: #9AA0FF; margin-bottom: 6px; }
  .swipe-title { font-size: 25px; font-weight: 800; color: #fff; line-height: 1.1; letter-spacing: -0.015em; }
  .dig-hint { display: flex; align-items: center; gap: 9px; margin-top: 14px; color: #fff; }
  .dig-circle {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: 50%; background: var(--qx-accent);
    animation: digbob 1.8s ease-in-out infinite;
  }
  .dig-hint span:last-child { font-size: 12.5px; font-weight: 700; }
  @keyframes digbob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(4px); } }

  /* ---- Reading floor ---- */
  .card-header {
    display: flex; align-items: center; gap: 10px;
    padding: 14px 14px 12px;
    border-bottom: 1px solid var(--qx-border);
    flex-shrink: 0;
  }
  .header-mark { width: 28px; height: 28px; border-radius: 50%; background: var(--qx-accent-soft); color: var(--qx-accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .header-text { flex: 1; min-width: 0; }
  .header-title { font-size: 13.5px; font-weight: 800; color: var(--qx-text); line-height: 1.15; }
  .header-sub { font-size: 10.5px; font-weight: 600; color: var(--qx-text-faint); }

  .reading-body { flex: 1; min-height: 0; display: flex; overflow: hidden; }

  .depth-rail {
    flex: 0 0 auto; width: 14px; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 7px;
    padding: 10px 0; border-right: 1px solid var(--qx-border);
  }
  .rail-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--qx-border-2); flex-shrink: 0; }
  .rail-dot.passed { background: var(--qx-text-faint); }
  .rail-dot.current { width: 8px; height: 8px; background: var(--qx-accent); }

  .reading-content {
    flex: 1; min-width: 0; position: relative; overflow: hidden;
  }
  /* Floors overlap so a floor change cross-slides (old out, new in) smoothly. */
  .floor-anim {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    padding: 14px 16px 0;
  }
  .floor-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; flex-shrink: 0; }
  .floor-pill {
    font-size: 10px; font-weight: 800; letter-spacing: 0.07em;
    color: var(--qx-accent-text); background: var(--qx-accent-soft);
    border-radius: var(--qx-radius-pill); padding: 4px 10px;
  }
  .floor-pill.law { color: #fff; background: var(--qx-pink); }
  .floor-count { font-size: 10.5px; font-weight: 700; color: var(--qx-text-faint); }

  .floor-text {
    flex: 50 1 0%; min-height: 0; overflow-y: auto;
    font-size: 14.5px; line-height: 1.58; color: var(--qx-text-2);
  }
  .floor-text :global(p) { margin-bottom: 0.75em; }
  .floor-text :global(strong) { color: var(--qx-text); font-weight: 800; }
  .floor-text :global(.formula) {
    display: block; margin: 14px 0; text-align: center; border-radius: var(--qx-radius-md);
    background: linear-gradient(160deg, var(--qx-pink-soft), var(--qx-accent-soft));
    border: 1px solid var(--qx-pink); padding: 16px 12px;
    font-size: 24px; font-weight: 800; color: var(--qx-text);
  }
  .floor-text :global(.gloss) { display: block; font-size: 11px; font-weight: 600; color: var(--qx-text-dim); margin-top: 6px; }
  /* Math typography injected by formatMath (subscripts, superscripts, vectors) */
  .floor-text :global(sub) { font-size: 0.72em; vertical-align: -0.25em; line-height: 0; }
  .floor-text :global(sup) { font-size: 0.72em; vertical-align: 0.5em; line-height: 0; }
  .floor-text :global(.vec) { font-weight: 800; font-style: italic; }

  .floor-media { flex: 45 1 0%; min-height: 0; margin: 10px 0 12px; border-radius: var(--qx-radius-md); overflow: hidden; background: var(--qx-surface-2); }
  .media-img { width: 100%; height: 100%; background-size: cover; background-position: center; }
  .media-diagram { width: 100%; height: 100%; }
  .floor-media :global(.video-container) { width: 100%; height: 100%; margin: 0; border: none; }

  .nav-arrows { display: flex; justify-content: flex-end; gap: 8px; padding: 10px 14px 14px; flex-shrink: 0; }
  .arrow-btn {
    width: 38px; height: 38px; border-radius: 50%;
    border: 1.5px solid var(--qx-border-2); background: var(--qx-surface);
    color: var(--qx-text-dim); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }
  .arrow-btn.primary { background: var(--qx-accent); border-color: var(--qx-accent); color: #fff; }
  .arrow-btn:disabled { opacity: 0.35; cursor: default; }

  .loading-slab {
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: var(--qx-text-faint);
  }
</style>
