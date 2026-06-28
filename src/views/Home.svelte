<script>
  import { PATHS, totalBoards } from '../lib/content/paths.js';
  import { progress } from '../lib/stores/progress.js';
  import { displayName } from '../lib/stores/auth.js';
  import QxIcon from '../lib/components/qubix/QxIcon.svelte';

  export let onNavigate; // (view, args?) => void

  const TOTAL_BOARDS = totalBoards();

  $: overall = ($progress, progress.getOverall());
  $: streak = ($progress, progress.getStreak());
  $: level = 1 + Math.floor(overall.read / 5);
  $: earnedMedals = ($progress, progress.getMedals().filter(m => m.earned).length);

  $: continuePath = ($progress, Object.entries(PATHS)
    .map(([id, manifest]) => ({ id, manifest, state: progress.getPathState(id, manifest) }))
    .filter(p => p.state.boardsRead > 0 && p.state.boardsRead < p.state.boardsTotal)
    .sort((a, b) => b.state.boardsRead - a.state.boardsRead)[0]);

  $: continuePct = continuePath ? Math.round((continuePath.state.boardsRead / continuePath.state.boardsTotal) * 100) : 0;

  $: EXPLORE_ITEMS = [
    { id: 'stats', label: 'Your stats', sub: earnedMedals === 1 ? '1 medal' : `${earnedMedals} medals`, icon: 'stats' },
    { id: 'snippets', label: 'Snippets', sub: 'no pressure', icon: 'snippets' }
  ];
</script>

<div class="qx-shell home-view">
  <!-- Header: greeting + avatar + streak -->
  <div class="header">
    <button class="avatar" on:click={() => onNavigate?.('stats')} aria-label="Your stats">{$displayName.charAt(0).toUpperCase()}</button>
    <div class="greeting">
      <div class="hi">Hi, {$displayName}</div>
      <div class="level">
        <span class="level-badge">Level {level}</span>
      </div>
    </div>
    <div class="streak-chip">
      <QxIcon name="flame" size={14} />{streak}
    </div>
  </div>

  <!-- Primary CTA: Start learning -->
  <button class="start-cta" on:click={() => onNavigate?.('topics')}>
    <span class="start-icon">✦</span>
    <div>
      <div class="start-label">Start learning</div>
      <div class="start-sub">Open the topic map &amp; pick a new track</div>
    </div>
  </button>

  <!-- Continue card -->
  {#if continuePath}
    <div class="continue-card">
      <div class="continue-ring" style="background:conic-gradient(var(--qx-accent) {continuePct * 3.6}deg, var(--qx-surface-2) 0)">
        <div class="ring-inner">{continuePct}%</div>
      </div>
      <div class="continue-info">
        <div class="continue-label">CONTINUE</div>
        <div class="continue-title">{continuePath.manifest.name}</div>
        <div class="continue-meta">{continuePath.state.boardsRead} / {continuePath.state.boardsTotal} boards &middot; {continuePath.manifest.subject === 'physics' ? 'Physics' : continuePath.manifest.subject === 'maths' ? 'Maths' : 'Chemistry'}</div>
      </div>
      <button class="continue-chev" on:click={() => onNavigate?.('topicDetail', continuePath.id)}>&rsaquo;</button>
    </div>
  {:else}
    <button class="start-cta secondary" on:click={() => onNavigate?.('topics')}>
      <span class="start-icon">+</span>
      <div>
        <div class="start-label">Start a new topic</div>
        <div class="start-sub">Browse the full topic map</div>
      </div>
    </button>
  {/if}

  <!-- Explore section -->
  <div class="explore-label">Explore</div>
  <div class="explore-list">
    {#each EXPLORE_ITEMS as item}
      <button class="explore-row" on:click={() => onNavigate?.(item.id)}>
        <span class="explore-icon"><QxIcon name={item.icon} size={16} /></span>
        <span class="explore-name">{item.label}</span>
        <span class="explore-sub">{item.sub}</span>
        <span class="explore-chev">&rsaquo;</span>
      </button>
    {/each}
  </div>
</div>

<style>
  .home-view { height: 100%; overflow-y: auto; display: flex; flex-direction: column; padding: 16px 18px 0; box-sizing: border-box; }

  /* Header */
  .header { display: flex; align-items: center; gap: 11px; margin-bottom: 20px; }
  .avatar {
    width: 44px; height: 44px; border-radius: 50%; background: var(--qx-accent); color: #fff;
    font-weight: 800; font-size: 18px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    cursor: pointer; border: none; font-family: var(--qx-font);
  }
  .greeting { flex: 1; min-width: 0; }
  .hi { font-size: 18px; font-weight: 800; color: var(--qx-text); line-height: 1.2; }
  .level { font-size: 12px; font-weight: 600; color: var(--qx-text-dim); margin-top: 2px; }
  .level-badge { color: var(--qx-accent-text); }
  .streak-chip {
    display: flex; align-items: center; gap: 4px; background: var(--qx-yellow-soft); border: 1px solid var(--qx-yellow);
    border-radius: var(--qx-radius-pill); padding: 5px 12px; color: var(--qx-yellow-text); font-size: 14px; font-weight: 800;
  }

  /* Start CTA */
  .start-cta {
    width: 100%; display: flex; align-items: center; gap: 14px; padding: 16px; border-radius: var(--qx-radius-lg);
    border: 1.5px solid var(--qx-accent); background: var(--qx-accent-soft); cursor: pointer;
    text-align: left; font-family: var(--qx-font); margin-bottom: 12px; transition: background 0.15s;
  }
  .start-cta:hover { background: var(--qx-accent-soft-2); }
  .start-cta.secondary { border-color: var(--qx-border-2); background: var(--qx-surface); }
  .start-cta.secondary:hover { background: var(--qx-surface-2); }
  .start-icon {
    width: 40px; height: 40px; border-radius: 50%; background: var(--qx-accent); color: #fff;
    font-size: 20px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .start-cta.secondary .start-icon { background: var(--qx-surface-2); color: var(--qx-text-dim); }
  .start-label { font-size: 16px; font-weight: 800; color: var(--qx-text); }
  .start-sub { font-size: 12px; font-weight: 500; color: var(--qx-text-dim); margin-top: 2px; }

  /* Continue card */
  .continue-card {
    display: flex; align-items: center; gap: 14px; padding: 14px; border-radius: var(--qx-radius-lg);
    border: 1.5px solid var(--qx-border); background: var(--qx-surface); margin-bottom: 20px;
  }
  .continue-ring {
    position: relative; width: 50px; height: 50px; flex-shrink: 0; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }
  .ring-inner {
    width: 40px; height: 40px; border-radius: 50%; background: var(--qx-surface);
    display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: var(--qx-text);
  }
  .continue-info { flex: 1; min-width: 0; }
  .continue-label { font-size: 11px; font-weight: 700; color: var(--qx-text-faint); letter-spacing: 0.04em; margin-bottom: 3px; }
  .continue-title { font-size: 15px; font-weight: 800; color: var(--qx-text); line-height: 1.2; }
  .continue-meta { font-size: 12px; font-weight: 500; color: var(--qx-text-dim); margin-top: 3px; }
  .continue-chev {
    background: none; border: none; font-size: 24px; color: var(--qx-text-faint); cursor: pointer; padding: 4px;
  }

  /* Explore */
  .explore-label { font-size: 11px; font-weight: 700; color: var(--qx-text-faint); letter-spacing: 0.05em; margin-bottom: 8px; text-transform: uppercase; }
  .explore-list { display: flex; flex-direction: column; gap: 2px; padding-bottom: 16px; }
  .explore-row {
    display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: var(--qx-radius-md);
    border: none; background: transparent; cursor: pointer; text-align: left; font-family: var(--qx-font);
    transition: background 0.1s;
  }
  .explore-row:hover { background: var(--qx-surface); }
  .explore-icon {
    width: 34px; height: 34px; border-radius: 9px; background: var(--qx-surface-2);
    display: flex; align-items: center; justify-content: center; color: var(--qx-text-dim);
  }
  .explore-name { font-size: 15px; font-weight: 700; color: var(--qx-text); flex: 1; }
  .explore-sub { font-size: 13px; font-weight: 600; color: var(--qx-text-faint); }
  .explore-chev { font-size: 18px; color: var(--qx-text-faintest); }
</style>
