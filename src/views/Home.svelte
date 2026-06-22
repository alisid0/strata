<script>
  import { PATHS, totalBoards } from '../lib/content/paths.js';
  import { progress } from '../lib/stores/progress.js';
  import { displayName } from '../lib/stores/auth.js';
  import QxIcon from '../lib/components/qubix/QxIcon.svelte';
  import QxButton from '../lib/components/qubix/QxButton.svelte';

  export let onNavigate; // (view, args?) => void

  const TOTAL_BOARDS = totalBoards();
  // TODO: no streak-tracking backend yet — placeholder until daily-activity logging exists.
  const STREAK_DAYS = 12;

  $: overall = progress.getOverall();

  // Pick the most-started, not-yet-finished path as the "continue" card.
  // progress.js doesn't expose per-path lastOpenedAt publicly, so this approximates
  // "most recent" with "most boards read" rather than adding new store surface for it.
  $: continuePath = Object.entries(PATHS)
    .map(([id, manifest]) => ({ id, manifest, state: progress.getPathState(id, manifest) }))
    .filter(p => p.state.boardsRead > 0 && p.state.boardsRead < p.state.boardsTotal)
    .sort((a, b) => b.state.boardsRead - a.state.boardsRead)[0];

  $: continuePct = continuePath ? Math.round((continuePath.state.boardsRead / continuePath.state.boardsTotal) * 100) : 0;

  const TILES = [
    { id: 'leaderboard', label: 'Leaderboard', icon: 'stats', sub: () => "You're #5" },
    { id: 'stats', label: 'Your stats', icon: 'stats', sub: () => '5 medals' },
    { id: 'topics', label: 'Topics', icon: 'topics', sub: () => `${overall.read} / ${TOTAL_BOARDS} read` },
    { id: 'snippets', label: 'Snippets', icon: 'snippets', sub: () => 'no pressure' }
  ];
</script>

<div class="qx-shell home-view">
  <div class="header">
    <div class="welcome">
      <div class="hi">Welcome back</div>
      <div class="name">{$displayName}</div>
    </div>
    <div class="streak-chip"><QxIcon name="flame" size={13} />{STREAK_DAYS}</div>
    <div class="avatar">{$displayName.charAt(0).toUpperCase()}</div>
  </div>

  <div class="hero">
    <div class="hero-label">PICK UP WHERE YOU LEFT OFF</div>
    {#if continuePath}
      <div class="hero-row">
        <div class="ring" style="background:conic-gradient(var(--qx-accent) {continuePct * 3.6}deg, rgba(255,255,255,0.14) 0)">
          <div class="ring-inner">{continuePct}%</div>
        </div>
        <div class="hero-info">
          <div class="hero-title">{continuePath.manifest.name}</div>
          <div class="hero-sub">{continuePath.state.boardsRead} / {continuePath.state.boardsTotal} boards</div>
        </div>
      </div>
      <QxButton variant="primary" on:click={() => onNavigate?.('topicDetail', continuePath.id)}>Continue</QxButton>
    {:else}
      <div class="hero-row">
        <div class="hero-info">
          <div class="hero-title">No topic started yet</div>
          <div class="hero-sub">Pick one from Topics to begin</div>
        </div>
      </div>
      <QxButton variant="primary" on:click={() => onNavigate?.('topics')}>Browse topics</QxButton>
    {/if}
  </div>

  <button class="new-topic-btn" on:click={() => onNavigate?.('topics')}>+ Start a new topic</button>

  <div class="tile-grid">
    {#each TILES as tile}
      <button class="tile" on:click={() => onNavigate?.(tile.id)}>
        <span class="tile-icon"><QxIcon name={tile.icon} size={16} /></span>
        <div class="tile-name">{tile.label}</div>
        <div class="tile-sub">{tile.sub()}</div>
      </button>
    {/each}
  </div>
</div>

<style>
  .home-view { height: 100%; overflow-y: auto; display: flex; flex-direction: column; padding: 16px 18px 0; box-sizing: border-box; }

  .header { display: flex; align-items: center; gap: 11px; margin-bottom: 18px; }
  .welcome { flex: 1; min-width: 0; }
  .hi { font-size: 13px; font-weight: 600; color: var(--qx-text-dim); }
  .name { font-size: 21px; font-weight: 800; color: var(--qx-text); line-height: 1.05; }
  .streak-chip {
    display: flex; align-items: center; gap: 5px; background: var(--qx-yellow-soft); border: 1px solid var(--qx-yellow);
    border-radius: var(--qx-radius-pill); padding: 5px 11px; color: var(--qx-yellow-text); font-size: 13px; font-weight: 800;
  }
  .avatar {
    width: 40px; height: 40px; border-radius: 50%; background: var(--qx-accent); color: #fff;
    font-weight: 800; font-size: 17px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }

  .hero {
    border-radius: var(--qx-radius-lg); background: var(--qx-surface-elevated); border: 1px solid var(--qx-border);
    padding: 18px; margin-bottom: 13px; color: #fff;
  }
  .hero-label { font-size: 11px; font-weight: 700; color: var(--qx-accent); letter-spacing: 0.06em; margin-bottom: 10px; }
  .hero-row { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
  .ring { position: relative; width: 58px; height: 58px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .ring-inner { width: 48px; height: 48px; border-radius: 50%; background: var(--qx-surface-elevated); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; }
  .hero-info { flex: 1; min-width: 0; }
  .hero-title { font-size: 17px; font-weight: 800; line-height: 1.1; }
  .hero-sub { font-size: 12px; font-weight: 500; color: #b9b4c0; }

  .new-topic-btn {
    height: 46px; border-radius: var(--qx-radius-md); border: 1.5px solid var(--qx-border-2); background: var(--qx-surface);
    color: var(--qx-text); font-family: var(--qx-font); font-size: 15px; font-weight: 800; cursor: pointer; margin-bottom: 16px;
  }

  .tile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; padding-bottom: 16px; }
  .tile {
    border: 1.5px solid var(--qx-border); background: var(--qx-surface); border-radius: var(--qx-radius-lg);
    padding: 14px; text-align: left; cursor: pointer; font-family: var(--qx-font);
  }
  .tile-icon {
    display: inline-flex; width: 32px; height: 32px; border-radius: 9px; background: var(--qx-surface-2);
    color: var(--qx-text-2); align-items: center; justify-content: center; margin-bottom: 9px;
  }
  .tile-name { font-size: 14px; font-weight: 800; color: var(--qx-text); }
  .tile-sub { font-size: 11px; font-weight: 600; color: var(--qx-text-dim); }
</style>
