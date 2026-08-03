<script>
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { getBoard, fetchSnippets } from '../lib/content/dynamicBoards.js';
  import { formatMath } from '../lib/content/mathFormat.js';
  // F-01: board HTML comes from Supabase and is rendered raw. Sanitise LAST,
  // after formatMath, since formatMath emits markup of its own and passes
  // untrusted markup through by design.
  import { sanitizeBoardHtml } from '../lib/content/sanitizeHtml.js';
  import { pathsForCard } from '../lib/content/paths.js';
  import { progress } from '../lib/stores/progress.js';
  import { getVideoForCard, getDiagramForCard } from '../lib/content/media.js';
  import { getFloorMedia } from '../lib/content/boardMedia.js';
  import { getWorkshopsForPath } from './WorkshopLab.svelte';
  import VideoPlayer from '../lib/components/VideoPlayer.svelte';
  import ChalkDiagram from '../lib/components/ChalkDiagram.svelte';
  import ThreeScene from '../lib/components/media/ThreeScene.svelte';
  import CoordinatePlane from '../lib/components/media/CoordinatePlane.svelte';
  import GeoGebraPlane from '../lib/components/media/GeoGebraPlane.svelte';
  import LineExplorer from '../lib/components/media/LineExplorer.svelte';
  import ConceptExplorer from '../lib/components/media/ConceptExplorer.svelte';
  import MathVisual from '../lib/components/media/MathVisual.svelte';
  import MathMotion from '../lib/components/media/MathMotion.svelte';
  import PixelMathScene from '../lib/components/media/PixelMathScene.svelte';
  import SubjectMark from '../lib/components/SubjectMark.svelte';
  import QxIcon from '../lib/components/qubix/QxIcon.svelte';
  import CheckpointQuiz from '../lib/components/qubix/CheckpointQuiz.svelte';
  import Workshop from '../lib/components/assessments/Workshop.svelte';
  import { getPathQuestions } from '../lib/content/questions.js';
  import { getLineWorkshop, getAtomWorkshop, getBitWorkshop, getPhysWorkshop } from '../lib/content/workshops.js';

  // The card numbers this rail spans (static + any dynamic ones the caller
  // already fetched via dynamicBoards.fetchBoardsByNumbers before navigating
  // here), and which number to open on. Position in `numbers`, not the card
  // number itself, is what `idx`/`depthOf`/etc. index by from here on.
  export let numbers = [];
  export let startNumber = 1;
  export let onBack = null;
  export let onNavigate = null; // for the last-floor practise exit-funnel
  export let pathId = '';   // the topic id, for checkpoint-quiz question banks

  let idx = 0;
  let depthOf = numbers.map(() => 0);
  let nextDepths = [];
  let totalCards = numbers.length;
  let audioEl;
  let playingKey = null;
  let snippetByBoard = {}; // card number → a snippet that relates to it (via the snippet's buildsOn)
  let activeSnippets = null; // the related snippets shown in the overlay (array)
  let lightboxMedia = null;  // floor media shown full-screen: {type:'img',src} | {type:'coord-plane',spec}
  // Lightbox pinch-zoom + pan state.
  let lbScale = 1, lbX = 0, lbY = 0;
  let lbMode = null;         // 'pinch' | 'pan'
  let lbMoved = false, lbTapTimer = null;
  let lbStartDist = 0, lbStartScale = 1, lbStartX = 0, lbStartY = 0, lbStartPX = 0, lbStartPY = 0;

  // First-time vertical-swipe hint — shows once, then never again.
  const HINT_KEY = 'qubix-reader-hint-shown';
  let showSwipeHint = false;
  if (typeof localStorage !== 'undefined') {
    showSwipeHint = !localStorage.getItem(HINT_KEY);
  }
  function dismissSwipeHint() {
    showSwipeHint = false;
    if (typeof localStorage !== 'undefined') localStorage.setItem(HINT_KEY, '1');
  }

  // Checkpoint quiz: after every 3rd BB, a quick tap-quiz before the next group.
  const CHECKPOINT_EVERY = 3;
  let checkpointWorkshop = null;  // workshop interactions when a checkpoint is due
  let checkpointLegacy = null;     // fallback MCQ questions for non-LINE paths
  let pendingAdvanceTo = null;
  let checkpointSeen = new Set();
  let checkpointCount = 0;         // which checkpoint this is (0, 1, 2...)

  function layerHasContent(layer) {
    if (layer == null) return false;
    if (typeof layer === 'string') return layer.replace(/<[^>]+>/g, '').trim().length > 0;
    return !!(layer.text || layer.content || layer.img || layer.image || layer.audio);
  }

  function availableFloors(i) {
    const card = getBoard(numbers[i]);
    return card ? card.layers.map((l, k) => layerHasContent(l) ? k : -1).filter(k => k >= 0) : [];
  }

  function rebuildDerived() {
    nextDepths = numbers.map((_, j) => availableFloors(j).find(k => k > depthOf[j]));
  }
  rebuildDerived(); // initialize

  onMount(() => {
    move(Math.max(0, numbers.indexOf(startNumber)));

    // Index snippets by the board they relate to (resolvable "Card N"/"BB N"
    // references in each snippet's buildsOn) so a board can offer "View snippet".
    fetchSnippets().then(list => {
      const map = {};
      for (const sn of list || []) {
        for (const ref of (sn.tags?.buildsOn || [])) {
          const m = /(?:card|bb)\s*(\d+)/i.exec(String(ref));
          if (m) (map[+m[1]] = map[+m[1]] || []).push(sn);
        }
      }
      snippetByBoard = map;
    }).catch(() => {});
  });

  let floorDir = 1; // 1 = digging deeper (slide up from below), -1 = surfacing (slide down from above)
  const reduceMotion = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function goDeeper(i) {
    const floors = availableFloors(i);
    const next = floors.find(k => k > depthOf[i]);
    if (next === undefined) return;
    floorDir = 1;
    depthOf[i] = next;
    depthOf = [...depthOf];
    rebuildDerived();
    // Reached the deepest floor → +2 W (once ever per board, store-side).
    if (next === floors[floors.length - 1]) {
      progress.recordDeepestFloor(numbers[i]);
    }
  }

  function goShallower(i) {
    const below = [...availableFloors(i)].reverse().find(k => k < depthOf[i]);
    if (below === undefined) return;
    floorDir = -1;
    depthOf[i] = below;
    depthOf = [...depthOf];
    rebuildDerived();
  }

  // Checkpoint gate is disabled — was interrupting straight-through content
  // review every 3rd BB. Workshop/quiz content (below) is untouched for when
  // it's re-enabled; only the trigger in move() is gone.
  function move(to) {
    idx = Math.max(0, Math.min(totalCards - 1, to));
    const floors = availableFloors(idx);
    if (floors.length && !floors.includes(depthOf[idx])) {
      depthOf[idx] = floors[0];
      depthOf = [...depthOf];
      rebuildDerived();
    }
    const cardNumber = numbers[idx];
    progress.recordBoardOpen(cardNumber, pathsForCard(cardNumber));
  }

  function finishCheckpoint(score, total) {
    if (pathId) progress.recordQuizResult(pathId, score, total);
    checkpointSeen = new Set(checkpointSeen).add(idx);
    checkpointWorkshop = null;
    checkpointLegacy = null;
    checkpointCount++;
    const to = pendingAdvanceTo; pendingAdvanceTo = null;
    if (to != null) move(to);
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

  // Exit-funnel: the topic's first parallel workshop, offered on a board's
  // deepest floor — the highest-traffic moment to convert reading into doing.
  $: topicWorkshop = pathId ? (getWorkshopsForPath(pathId)[0] || null) : null;

  function floorNumber(i, d) {
    const floors = railFloors(i);
    const pos = floors.indexOf(d);
    return pos >= 0 ? pos + 1 : 1;
  }
  function floorTotal(i) {
    return railFloors(i).length;
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
    // Per-floor attached media (dynamic boards): 3D scenes now; audio/interactive later.
    const attached = getFloorMedia(cardNumber, d);
    if (attached) return attached;
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
    vScroller = e.target.closest?.('.card')?.querySelector('.floor-anim') || null;
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
    if (lightboxMedia) { if (e.key === 'Escape') closeLightbox(); return; }
    if (e.key === 'ArrowRight') { move(idx + 1); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { move(idx - 1); e.preventDefault(); }
    else if (e.key === 'ArrowDown') { goDeeper(idx); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { goShallower(idx); e.preventDefault(); }
  }

  // ── Mouse drag — mirrors touch handler for desktop/web ───────────────────
  let mouseDown = false;
  let mStartX = 0, mStartY = 0, mdx = 0, mdy = 0, mVScroller = null;

  function handleMouseDown(e) {
    if (e.button !== 0 || lightboxMedia) return;
    mouseDown = true;
    mStartX = e.clientX; mStartY = e.clientY;
    mdx = 0; mdy = 0; axis = null;
    dragOffset = 0; isDragging = false;
    dragOffsetY = 0; isVDragging = false; vEngaged = false;
    mVScroller = e.target.closest?.('.card')?.querySelector('.floor-anim') || null;
  }

  function handleMouseMove(e) {
    if (!mouseDown) return;
    mdx = e.clientX - mStartX;
    mdy = e.clientY - mStartY;
    if (!axis && (Math.abs(mdx) > 8 || Math.abs(mdy) > 8)) {
      axis = Math.abs(mdx) > Math.abs(mdy) ? 'x' : 'y';
    }
    if (axis === 'x') {
      isDragging = true;
      const atEdge = (idx === 0 && mdx > 0) || (idx === totalCards - 1 && mdx < 0);
      dragOffset = atEdge ? mdx * 0.3 : mdx;
    } else if (axis === 'y') {
      const atTop    = !mVScroller || mVScroller.scrollTop <= 0;
      const atBottom = !mVScroller || mVScroller.scrollTop + mVScroller.clientHeight >= mVScroller.scrollHeight - 1;
      if ((mdy > 0 && atTop) || (mdy < 0 && atBottom)) {
        vEngaged = true; isVDragging = true;
        const maxB = (typeof window !== 'undefined' ? window.innerHeight : 700) * 0.015;
        dragOffsetY = maxB * Math.tanh(mdy / (maxB * 3));
      } else {
        isVDragging = false; dragOffsetY = 0;
      }
    }
  }

  function handleMouseUp() {
    if (!mouseDown) return;
    mouseDown = false;
    if (axis === 'x') {
      const threshold = Math.min(80, (typeof window !== 'undefined' ? window.innerWidth : 360) * 0.22);
      if (mdx < -threshold) move(idx + 1);
      else if (mdx > threshold) move(idx - 1);
    } else if (axis === 'y' && vEngaged) {
      if (mdy < 0) goDeeper(idx); else goShallower(idx);
    }
    axis = null;
    dragOffset = 0; isDragging = false;
    dragOffsetY = 0; isVDragging = false; vEngaged = false;
  }

  // ── Mouse wheel — dig/surface on desktop, respects in-floor text scroll ──
  let wheelLocked = false;

  function handleWheel(e) {
    if (lightboxMedia) return; // lightbox handles its own wheel
    // If the text is mid-scroll, let it scroll — only navigate at the boundary
    const scroller = e.target.closest('.floor-anim');
    if (scroller) {
      const atTop    = scroller.scrollTop <= 0;
      const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1;
      if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) return;
    }
    e.preventDefault();
    if (wheelLocked) return;
    wheelLocked = true;
    setTimeout(() => { wheelLocked = false; }, 650);

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      if (e.deltaX > 20) move(idx + 1);
      else if (e.deltaX < -20) move(idx - 1);
    } else {
      if (e.deltaY > 0) goDeeper(idx);
      else if (e.deltaY < 0) goShallower(idx);
    }
  }

  // ── Lightbox: open/close + pinch-zoom & pan ──
  function openLightbox(media) { lightboxMedia = media; lbScale = 1; lbX = 0; lbY = 0; }
  function closeLightbox() { lightboxMedia = null; lbScale = 1; lbX = 0; lbY = 0; }

  const lbDist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

  function lbTouchStart(e) {
    lbMoved = false;
    if (e.touches.length === 2) {
      lbMode = 'pinch';
      lbStartDist = lbDist(e.touches);
      lbStartScale = lbScale; lbStartX = lbX; lbStartY = lbY;
      lbStartPX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      lbStartPY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
    } else if (e.touches.length === 1) {
      lbMode = 'pan';
      lbStartX = lbX; lbStartY = lbY;
      lbStartPX = e.touches[0].clientX; lbStartPY = e.touches[0].clientY;
    }
  }
  function lbTouchMove(e) {
    if (lbMode === 'pinch' && e.touches.length === 2) {
      lbScale = Math.max(1, Math.min(5, lbStartScale * (lbDist(e.touches) / lbStartDist)));
      const px = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const py = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      lbX = lbStartX + (px - lbStartPX);
      lbY = lbStartY + (py - lbStartPY);
      lbMoved = true;
    } else if (lbMode === 'pan' && e.touches.length === 1 && lbScale > 1) {
      lbX = lbStartX + (e.touches[0].clientX - lbStartPX);
      lbY = lbStartY + (e.touches[0].clientY - lbStartPY);
      lbMoved = true;
    }
  }
  function lbTouchEnd() {
    if (lbScale <= 1.02) { lbScale = 1; lbX = 0; lbY = 0; }
    lbMode = null;
  }
  function lbImgTap() {
    if (lbMoved) { lbMoved = false; return; }   // ignore taps that were really drags
    if (lbTapTimer) {                            // double tap → toggle zoom
      clearTimeout(lbTapTimer); lbTapTimer = null;
      if (lbScale > 1) { lbScale = 1; lbX = 0; lbY = 0; } else { lbScale = 2.5; }
    } else {
      lbTapTimer = setTimeout(() => {            // single tap (unzoomed) → close
        lbTapTimer = null;
        if (lbScale <= 1) closeLightbox();
      }, 260);
    }
  }
  function lbWheel(e) {
    e.preventDefault();
    lbScale = Math.max(1, Math.min(5, lbScale - e.deltaY * 0.0025));
    if (lbScale === 1) { lbX = 0; lbY = 0; }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="qx-shell reader">
  <div id="topbar">
    <button id="back" on:click={() => onBack?.()} aria-label="Back to topic"><QxIcon name="chevronLeft" size={18} /></button>
    <div class="topbar-breadcrumbs">
      <span class="crumb">{humanize(getBoard(numbers[idx])?.tags?.subject || '')}</span>
      <span class="crumb-sep">›</span>
      <span class="crumb crumb-path">{getBoard(numbers[idx])?.tags?.topic || ''}</span>
    </div>
    <div id="brand">QUBIX</div>
    <div id="progress-wrap"><div id="progress" style="width:{(idx + 1) / totalCards * 100}%"></div></div>
    <div id="counter">{String(idx + 1).padStart(2, '0')} / {totalCards}</div>
  </div>

  <button class="side-nav prev" disabled={idx === 0} on:click={() => move(idx - 1)}><QxIcon name="chevronLeft" size={18} /></button>
  <button class="side-nav next" disabled={idx === totalCards - 1} on:click={() => move(idx + 1)}><QxIcon name="chevronRight" size={18} /></button>

  {#if showSwipeHint}
    <div class="swipe-hint-toast" in:fly={{ y: 48, duration: 400, easing: cubicOut }}>
      <QxIcon name="chevronDown" size={14} />
      <span>Swipe vertically for more</span>
      <button class="swipe-hint-dismiss" on:click={dismissSwipeHint} aria-label="Dismiss reading tip">×</button>
    </div>
  {/if}

  <!-- Desktop: persistent board outline sidebar -->
  <nav class="board-outline" aria-label="Topic boards">
    <div class="outline-header">
      <span class="outline-count">{totalCards} boards</span>
    </div>
    {#each numbers as cardNumber, i (cardNumber)}
      {@const board = getBoard(cardNumber)}
      <button
        class="outline-row"
        class:current={i === idx}
        class:read={i < idx}
        on:click={() => move(i)}
      >
        <span class="outline-num">{i + 1}</span>
        <span class="outline-title">{board?.title || `Board ${cardNumber}`}</span>
      </button>
    {/each}
  </nav>

  <div
    id="rail"
    class:dragging={isDragging}
    class:mouse-dragging={mouseDown}
    style="transform:translateX({-idx * 100}%) translateX({dragOffset}px)"
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
    on:mousedown={handleMouseDown}
    on:mousemove={handleMouseMove}
    on:mouseup={handleMouseUp}
    on:mouseleave={handleMouseUp}
    on:wheel|nonpassive={handleWheel}
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
              {#if audioUrl}
                <button
                  class="audio-btn"
                  class:playing={playingKey === `${n}-0`}
                  title={playingKey === `${n}-0` ? 'Pause audio' : 'Play audio'}
                  on:click|stopPropagation={() => toggleAudio(i, 0)}
                ><QxIcon name="volume" size={16} /></button>
              {/if}
              <div class="swipe-bottom" role="button" tabindex="0" on:click={() => goDeeper(i)} on:keydown={(e) => e.key === 'Enter' && goDeeper(i)}>
                {#if col.kicker}<div class="swipe-kicker">{col.kicker}</div>{/if}
                <div class="swipe-title">{col.title}</div>
              </div>
            </div>
          {:else}
            {@const d = depthOf[i]}
            {@const media = floorMedia(i, d)}
            {@const audioUrl = floorAudio(i, d)}
            <div class="card-header">
              <span class="header-mark"><SubjectMark subject={col.tags?.subject} accent="var(--qx-accent)" size={18} /></span>
              <div class="header-text">
                <div class="header-title">{col.title}</div>
                <div class="header-sub">{col.kicker ? col.kicker + ' · ' : ''}{humanize(col.tags?.subject)}</div>
              </div>
              {#if snippetByBoard[n]?.length}
                <button class="snippet-btn" on:click={() => activeSnippets = snippetByBoard[n]} title="Related snippets" aria-label="View related snippets">
                  <QxIcon name="snippets" size={14} />
                  {#if snippetByBoard[n].length > 1}<span class="snippet-count">{snippetByBoard[n].length}</span>{/if}
                </button>
              {/if}
              {#if audioUrl}
                <button
                  class="audio-btn small"
                  class:playing={playingKey === `${n}-${d}`}
                  title={playingKey === `${n}-${d}` ? 'Pause audio' : 'Play audio'}
                  on:click={() => toggleAudio(i, d)}
                ><QxIcon name="volume" size={14} /></button>
              {/if}
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
                      <span class="floor-count">Floor {floorNumber(i, d)} of {floorTotal(i)}</span>
                      {#if floorAudio(i, d)}
                        <button
                          class="audio-btn"
                          class:playing={playingKey === `${n}-${d}`}
                          on:click|stopPropagation={() => toggleAudio(i, d)}
                          title={playingKey === `${n}-${d}` ? 'Pause audio' : 'Play audio'}
                        ><QxIcon name="volume" size={14} /></button>
                      {/if}
                    </div>
                    <div class="floor-text">{@html sanitizeBoardHtml(formatMath(floorBodyHTML(i, d)))}</div>
                    {#if media}
                      <div class="floor-media" class:interactive={media.type !== 'img'}>
                        {#if media.type === 'img'}
                          <button class="media-card" on:click|stopPropagation={() => openLightbox(media)} aria-label="Expand image">
                            <img class="media-img" src={media.src} alt="Diagram" />
                            <span class="media-expand" aria-hidden="true">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
                            </span>
                          </button>
                        {:else if media.type === 'video'}
                          <VideoPlayer src={media.src} />
                        {:else if media.type === 'diagram'}
                          <div class="media-diagram"><ChalkDiagram spec={media.spec} /></div>
                        {:else if media.type === 'coord-plane'}
                          <div class="media-diagram diagram-wrap" on:touchstart|stopPropagation on:touchmove|stopPropagation>
                            <CoordinatePlane spec={media.spec} />
                            <button class="media-expand as-btn" on:click|stopPropagation={() => openLightbox(media)} aria-label="Expand diagram">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
                            </button>
                          </div>
                        {:else if media.type === 'geogebra'}
                          <div class="media-diagram"><GeoGebraPlane spec={media.spec} /></div>
                        {:else if media.type === 'three'}
                          {#key numbers[i] + '-' + d}
                            <ThreeScene spec={media.spec} />
                          {/key}
                        {:else if media.type === 'math-visual'}
                          <div class="media-diagram diagram-wrap" on:touchstart|stopPropagation on:touchmove|stopPropagation>
                            <MathVisual spec={media.spec} />
                          </div>
                        {:else if media.type === 'math-motion'}
                          <div class="media-diagram diagram-wrap" on:touchstart|stopPropagation on:touchmove|stopPropagation>
                            <MathMotion spec={media.spec} />
                          </div>
                        {:else if media.type === 'pixel-math'}
                          <div class="media-diagram diagram-wrap" on:touchstart|stopPropagation on:touchmove|stopPropagation>
                            <PixelMathScene spec={media.spec} />
                          </div>
                        {:else if media.type === 'line-explorer'}
                          <div class="media-diagram diagram-wrap" on:touchstart|stopPropagation on:touchmove|stopPropagation>
                            <LineExplorer />
                          </div>
                        {:else if media.type === 'concept-explorer'}
                          <div class="media-diagram diagram-wrap" on:touchstart|stopPropagation on:touchmove|stopPropagation>
                            <ConceptExplorer spec={media.spec} />
                          </div>
                        {/if}
                      </div>
                    {/if}
                    {#if topicWorkshop && floorNumber(i, d) === floorTotal(i) && floorTotal(i) > 1}
                      <button class="practise-cta" on:click|stopPropagation={() => onNavigate?.('workshop', topicWorkshop.id)}>
                        <span class="practise-cta-icon">🛠</span>
                        <span class="practise-cta-text">
                          <span class="practise-cta-label">Bottom floor — now practise it</span>
                          <span class="practise-cta-name">{topicWorkshop.title}</span>
                        </span>
                        <span class="practise-cta-chev">›</span>
                      </button>
                    {/if}
                  </div>
                {/key}
              </div>
            </div>


          {/if}
        </div>
        {:else}
        <div class="slab loading-slab">Loading…</div>
        {/if}
      </div>
    {/each}
  </div>

  {#if activeSnippets}
    <div class="snippet-overlay" on:click={() => activeSnippets = null} role="presentation">
      <div class="snippet-modal" on:click|stopPropagation role="dialog" aria-modal="true">
        <button class="snippet-close" on:click={() => activeSnippets = null} aria-label="Close">✕</button>
        {#if activeSnippets.length > 1}<div class="snippet-overlay-count">{activeSnippets.length} related snippets</div>{/if}
        {#each activeSnippets as s, si}
          <div class="snippet-item" class:divided={si > 0}>
            <div class="snippet-overlay-kicker">{s.kicker}</div>
            <div class="snippet-overlay-title">{s.title}</div>
            <div class="snippet-overlay-body">{@html sanitizeBoardHtml(s.layers?.[0] || '')}</div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if checkpointWorkshop}
    <div class="checkpoint-overlay">
      <div class="checkpoint-modal">
        <Workshop interactions={checkpointWorkshop} onDone={finishCheckpoint} />
      </div>
    </div>
  {:else if checkpointLegacy}
    <div class="checkpoint-overlay">
      <div class="checkpoint-modal">
        <CheckpointQuiz questions={checkpointLegacy} onDone={finishCheckpoint} boardIndex={idx} />
      </div>
    </div>
  {/if}

  {#if lightboxMedia}
    <div class="lightbox" on:click={closeLightbox} on:wheel|nonpassive={lbWheel} role="presentation">
      <button class="lightbox-close" on:click|stopPropagation={closeLightbox} aria-label="Close">✕</button>
      <div
        class="lightbox-stage"
        style="transform: translate({lbX}px,{lbY}px) scale({lbScale});{lbMode ? '' : ' transition: transform 0.18s ease;'}"
        on:click|stopPropagation={lbImgTap}
        on:touchstart={lbTouchStart}
        on:touchmove={lbTouchMove}
        on:touchend={lbTouchEnd}
      >
        {#if lightboxMedia.type === 'img'}
          <img class="lightbox-img" src={lightboxMedia.src} alt="" draggable="false" />
        {:else if lightboxMedia.type === 'coord-plane'}
          <div class="lightbox-diagram"><CoordinatePlane spec={{ ...lightboxMedia.spec, interactive: false }} /></div>
        {/if}
      </div>
      {#if lbScale === 1}<div class="lightbox-hint">Pinch or double-tap to zoom</div>{/if}
    </div>
  {/if}

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

  /* Breadcrumbs — hidden on mobile */
  .topbar-breadcrumbs { display: none; }
  .crumb-sep { display: none; }

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
    cursor: grab;
    user-select: none;
  }
  #rail.dragging  { transition: none; } /* follow the finger 1:1 while dragging */
  #rail.mouse-dragging { cursor: grabbing; }
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

  /* Board outline — hidden on mobile, sidebar on desktop */
  .board-outline { display: none; }

  .swipe-bottom {
    position: relative; z-index: 2; margin-top: auto;
    padding: 0 18px 18px; display: block; width: 100%;
    background: none; border: none; cursor: pointer;
  }
  .swipe-kicker { font-size: 11px; font-weight: 800; letter-spacing: 0.12em; color: #9AA0FF; margin-bottom: 6px; }
  .swipe-title { font-size: 25px; font-weight: 800; color: #fff; line-height: 1.1; letter-spacing: -0.015em; }
  /* ---- Reading floor ---- */
  .card-header {
    display: flex; align-items: center; gap: 10px;
    padding: 14px 14px 12px;
    border-bottom: 1px solid var(--qx-border);
    flex-shrink: 0;
  }
  .header-mark { width: 28px; height: 28px; border-radius: 50%; background: var(--qx-accent-soft); color: var(--qx-accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .header-text { flex: 1; min-width: 0; }
  .header-title { font-size: 15px; font-weight: 800; color: var(--qx-text); line-height: 1.2; }
  .header-sub { font-size: 11.5px; font-weight: 600; color: var(--qx-text-faint); }

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
    padding: 14px 16px 18px;
    overflow-y: auto;
  }
  .floor-meta { display: flex; align-items: center; margin-bottom: 10px; flex-shrink: 0; }
  .floor-count { font-size: 10.5px; font-weight: 700; color: var(--qx-text-faint); }

  .floor-text {
    flex: 0 0 auto;
    font-size: var(--qx-fs-body); line-height: var(--qx-lh-body); color: var(--qx-text);
    letter-spacing: 0.002em;
  }
  .floor-text :global(p) { margin-bottom: 1em; }
  .floor-text :global(p:last-child) { margin-bottom: 0; }
  .floor-text :global(strong) { color: var(--qx-text); font-weight: 800; }
  .floor-text :global(.formula) {
    display: block; margin: 14px 0; text-align: center; border-radius: var(--qx-radius-md);
    background: linear-gradient(160deg, var(--qx-pink-soft), var(--qx-accent-soft));
    border: 1px solid var(--qx-pink); padding: 16px 12px;
    font-size: 24px; font-weight: 800; color: var(--qx-text);
  }
  .floor-text :global(.gloss) { display: block; font-size: 12.5px; font-weight: 600; color: var(--qx-text-dim); margin-top: 8px; line-height: 1.5; }
  /* Math typography injected by formatMath (subscripts, superscripts, vectors) */
  .floor-text :global(sub) { font-size: 0.72em; vertical-align: -0.25em; line-height: 0; }
  .floor-text :global(sup) { font-size: 0.72em; vertical-align: 0.5em; line-height: 0; }
  .floor-text :global(.vec) { font-weight: 800; font-style: italic; }

  /* Image sits directly beneath its text and scrolls with it (the whole floor
     scrolls). Interactive media (3D/video/diagram) keeps a fixed box since it
     has no intrinsic height. */
  .floor-media { flex: 0 0 auto; margin: 14px 0 4px; }

  .practise-cta {
    width: 100%; display: flex; align-items: center; gap: 11px;
    margin: 14px 0 4px; padding: 12px 13px; box-sizing: border-box;
    border-radius: var(--qx-radius-md); border: 1.5px solid var(--qx-accent);
    background: var(--qx-accent-soft); cursor: pointer; text-align: left;
    font-family: var(--qx-font);
  }
  .practise-cta-icon { font-size: 18px; flex-shrink: 0; }
  .practise-cta-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
  .practise-cta-label {
    font-size: 10px; font-weight: 900; letter-spacing: 0.07em; text-transform: uppercase;
    color: var(--qx-text-faint);
  }
  .practise-cta-name {
    font-size: 14px; font-weight: 850; color: var(--qx-accent-text);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .practise-cta-chev { font-size: 18px; color: var(--qx-accent-text); flex-shrink: 0; }
  .floor-media.interactive { height: min(46vh, 340px); }
  .media-card {
    position: relative; width: 100%; padding: 0; display: block;
    border-radius: var(--qx-radius-md); border: 1.5px solid var(--qx-border-2);
    background: var(--qx-surface-2); overflow: hidden;
    cursor: zoom-in; font: inherit;
  }
  .media-img { display: block; width: 100%; height: auto; max-height: 48vh; object-fit: contain; }
  .media-expand {
    position: absolute; right: 8px; bottom: 8px; width: 26px; height: 26px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(18,17,24,0.55); color: #fff; pointer-events: none;
  }
  .media-diagram { width: 100%; height: 100%; }
  .diagram-wrap { position: relative; }
  .media-expand.as-btn { pointer-events: auto; cursor: pointer; border: none; }
  .floor-media :global(.video-container) { width: 100%; height: 100%; margin: 0; border: none; }

  /* Tap-to-expand image lightbox (news-app style) */
  .lightbox {
    position: fixed; inset: 0; z-index: 300; cursor: zoom-out;
    background: rgba(8,8,12,0.92);
    display: flex; align-items: center; justify-content: center; padding: 20px;
  }
  .lightbox-stage {
    display: flex; align-items: center; justify-content: center;
    max-width: 100%; max-height: 100%; touch-action: none; user-select: none; will-change: transform;
  }
  .lightbox-img {
    max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px; -webkit-user-drag: none;
  }
  .lightbox-diagram { width: min(88vw, 560px); height: min(88vw, 88vh); max-width: 100%; max-height: 88vh; }
  .lightbox-hint {
    position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%);
    font-family: var(--qx-font); font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.6);
    pointer-events: none;
  }
  .lightbox-close {
    position: absolute; top: 14px; right: 14px; width: 38px; height: 38px; border-radius: 50%;
    border: none; background: rgba(255,255,255,0.14); color: #fff; font-size: 17px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }

  .snippet-btn {
    position: relative;
    width: 30px; height: 30px; flex-shrink: 0; border-radius: 50%;
    border: 1.5px solid var(--qx-accent); background: var(--qx-accent-soft);
    color: var(--qx-accent-text); display: flex; align-items: center; justify-content: center; cursor: pointer;
  }
  .snippet-count {
    position: absolute; top: -5px; right: -5px; min-width: 15px; height: 15px; padding: 0 3px;
    border-radius: 8px; background: var(--qx-accent); color: #fff; font-size: 9px; font-weight: 800;
    display: flex; align-items: center; justify-content: center;
  }
  .snippet-overlay-count { font-size: 11px; font-weight: 700; color: var(--qx-text-faint); margin-bottom: 14px; }
  .snippet-item.divided { margin-top: 18px; padding-top: 18px; border-top: 1px solid var(--qx-border); }
  .snippet-overlay {
    position: fixed; inset: 0; z-index: 30; display: flex; align-items: center; justify-content: center;
    background: rgba(11,19,43,0.6); backdrop-filter: blur(3px); padding: 24px;
  }
  .snippet-modal {
    position: relative; max-width: 380px; width: 100%; max-height: 80%; overflow-y: auto;
    background: var(--qx-surface); border: 1.5px solid var(--qx-pink); border-radius: var(--qx-radius-lg);
    box-shadow: var(--qx-shadow-card); padding: 22px 20px;
  }
  .snippet-close {
    position: absolute; top: 12px; right: 12px; width: 28px; height: 28px; border-radius: 50%;
    border: none; background: var(--qx-surface-2); color: var(--qx-text-dim); cursor: pointer; font-size: 13px;
  }
  .snippet-overlay-kicker { font-size: 11px; font-weight: 800; letter-spacing: 0.05em; color: var(--qx-accent); margin-bottom: 6px; }
  .snippet-overlay-title { font-size: 18px; font-weight: 800; color: var(--qx-text); margin-bottom: 12px; line-height: 1.2; padding-right: 28px; }
  .snippet-overlay-body { font-size: 14px; line-height: 1.6; color: var(--qx-text-2); }
  .snippet-overlay-body :global(p) { margin-bottom: 10px; }

  .loading-slab {
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: var(--qx-text-faint);
  }

  /* First-time vertical swipe hint */
  .swipe-hint-toast {
    position: fixed; bottom: 84px; left: 50%; transform: translateX(-50%); z-index: 25;
    background: color-mix(in srgb, var(--qx-surface) 92%, transparent); border: 1px solid var(--qx-border-2);
    border-radius: var(--qx-radius-pill); box-shadow: var(--qx-shadow-card); backdrop-filter: blur(12px);
    padding: 8px 9px 8px 12px;
    display: flex; gap: 7px; align-items: center;
    max-width: calc(100vw - 32px); white-space: nowrap;
    font-size: 11px; font-weight: 750; color: var(--qx-text-2);
  }
  .swipe-hint-toast :global(svg) { color: var(--qx-accent); flex-shrink: 0; }
  .swipe-hint-dismiss {
    width: 24px; height: 24px; padding: 0;
    border-radius: 50%; border: none;
    background: var(--qx-surface-3); color: var(--qx-text); font-weight: 800; font-size: 15px;
    cursor: pointer; font-family: var(--qx-font);
  }

  /* Workshop / checkpoint overlay */
  .checkpoint-overlay {
    position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center;
    background: rgba(11,19,43,0.7); backdrop-filter: blur(4px); padding: 20px;
  }
  .checkpoint-modal {
    position: relative; max-width: 440px; width: 100%; max-height: 90vh; overflow-y: auto;
    background: var(--qx-surface); border: 1.5px solid var(--qx-accent); border-radius: var(--qx-radius-lg);
    box-shadow: var(--qx-shadow-card); padding: 24px 20px;
  }

  /* ── Desktop: split-pane layout with board outline sidebar ── */
  @media (min-width: 900px) {
    .swipe-hint-toast { display: none; }
    /* Board outline — fixed left sidebar, sits next to BottomNav sidebar */
    .board-outline {
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 220px;
      bottom: 0;
      z-index: 5;
      width: 260px;
      background: var(--qx-surface-2);
      border-right: 1px solid var(--qx-border);
      overflow-y: auto;
      padding: 80px 0 20px;
    }
    .outline-header {
      padding: 10px 16px 8px;
      flex-shrink: 0;
    }
    .outline-count {
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--qx-text-faint);
    }
    .outline-row {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      text-align: left;
      padding: 9px 16px;
      border: none;
      background: transparent;
      cursor: pointer;
      font-family: var(--qx-font);
      font-size: 13px;
      font-weight: 600;
      color: var(--qx-text-dim);
      transition: background 0.15s;
      border-left: 3px solid transparent;
    }
    .outline-row:hover {
      background: var(--qx-surface-2);
      color: var(--qx-text);
    }
    .outline-row.current {
      background: var(--qx-accent-soft);
      color: var(--qx-accent-text);
      font-weight: 800;
      border-left-color: var(--qx-accent);
    }
    .outline-row.read {
      color: var(--qx-text-faintest);
    }
    .outline-num {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 800;
      flex-shrink: 0;
      background: var(--qx-surface-2);
    }
    .outline-row.current .outline-num {
      background: var(--qx-accent);
      color: #fff;
    }
    .outline-row.read .outline-num {
      background: var(--qx-green-soft);
      color: var(--qx-green-text);
    }
    .outline-title {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Reading area shifts right for both sidebars */
    #topbar {
      max-width: none;
      left: 480px;
      right: 0;
      padding: 18px 40px;
      gap: 16px;
    }
    #brand { display: none; }
    .topbar-breadcrumbs {
      display: flex;
      align-items: center;
      gap: 6px;
      flex: 1;
      min-width: 0;
      overflow: hidden;
    }
    .crumb {
      font-size: 13px;
      font-weight: 700;
      color: var(--qx-text-dim);
      white-space: nowrap;
    }
    .crumb-sep {
      font-size: 13px;
      color: var(--qx-text-faintest);
      flex-shrink: 0;
    }
    .crumb-path {
      color: var(--qx-text);
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #rail {
      max-width: none;
      left: 480px;
      right: 0;
    }
    .slab {
      width: min(680px, 100%);
    }
    .card {
      padding: clamp(64px, 8vh, 100px) clamp(20px, 5vw, 80px) clamp(24px, 4vh, 40px);
    }
    .side-nav.prev { left: calc(480px + 24px); }
    .side-nav.next { right: 24px; }
    .reading-body { padding: 20px 24px; }
    .floor-text { font-size: 18px; line-height: 1.78; }
  }
</style>
