<script>
  import { PATHS, PATH_GROUPS, totalBoards } from '../lib/content/paths.js';
  import { progress } from '../lib/stores/progress.js';
  import { displayName } from '../lib/stores/auth.js';
  import QxIcon from '../lib/components/qubix/QxIcon.svelte';
  import SettingsMenu from '../lib/components/qubix/SettingsMenu.svelte';

  export let onNavigate; // (view, args?) => void
  let settingsOpen = false;

  const TOTAL_BOARDS = totalBoards();

  const GATEWAY_META = {
    line: { icon: '📏', tagline: 'Space & abstraction' },
    atom: { icon: '⚛️', tagline: 'Matter & charge' },
    bit:  { icon: '◉',  tagline: 'Information & logic' },
    unit: { icon: '⚖️', tagline: 'Measurement & scale' }
  };

  $: overall = ($progress, progress.getOverall());
  $: streak = ($progress, progress.getStreak());
  $: level = 1 + Math.floor(overall.read / 5);

  $: continuePath = ($progress, Object.entries(PATHS)
    .map(([id, manifest]) => ({ id, manifest, state: progress.getPathState(id, manifest) }))
    .filter(p => p.state.boardsRead > 0 && p.state.boardsRead < p.state.boardsTotal)
    .sort((a, b) => b.state.boardsRead - a.state.boardsRead)[0]);

  $: continuePct = continuePath ? Math.round((continuePath.state.boardsRead / continuePath.state.boardsTotal) * 100) : 0;

  // The four doors: per-gateway progress; an untouched gateway opens its
  // first topic directly, a started one opens the Path tab.
  $: doors = ($progress, Object.entries(PATH_GROUPS).map(([gid, g]) => {
    const states = g.paths.filter(id => PATHS[id]).map(id => progress.getPathState(id, PATHS[id]));
    const read = states.reduce((a, s) => a + (s.boardsRead || 0), 0);
    const total = states.reduce((a, s) => a + (s.boardsTotal || 0), 0);
    return { gid, name: g.name, firstTopic: g.firstTopic, ...GATEWAY_META[gid], read, total };
  }));

  function openDoor(door) {
    if (door.read > 0) onNavigate?.('path');
    else onNavigate?.('topicDetail', door.firstTopic);
  }
</script>

<div class="qx-shell home-view">
  <!-- Header: greeting + avatar + streak -->
  <div class="header">
    <button class="avatar" on:click={() => onNavigate?.('wscore')} aria-label="Your W Score">{$displayName.charAt(0).toUpperCase()}</button>
    <div class="greeting">
      <div class="hi">Hi, {$displayName}</div>
      <div class="level">
        <span class="level-badge">Level {level}</span>
      </div>
    </div>
    <div class="streak-chip">
      <QxIcon name="flame" size={14} />{streak}
    </div>
    <button class="menu-btn icon-btn" on:click={() => onNavigate?.('snippetMode')} aria-label="Snippet mode" title="Snippet mode">
      <QxIcon name="snippets" size={15} />
    </button>
    <button class="menu-btn" on:click={() => settingsOpen = true} aria-label="Settings">⋯</button>
  </div>

  <SettingsMenu open={settingsOpen} onClose={() => settingsOpen = false} onNavigate={onNavigate} />

  <!-- Continue card (only once something is in progress) -->
  {#if continuePath}
    <div class="continue-card">
      <div class="continue-ring" style="background:conic-gradient(var(--qx-accent) {continuePct * 3.6}deg, var(--qx-surface-2) 0)">
        <div class="ring-inner">{continuePct}%</div>
      </div>
      <div class="continue-info">
        <div class="continue-label">CONTINUE</div>
        <div class="continue-title">{continuePath.manifest.name}</div>
        <div class="continue-meta">{continuePath.state.boardsRead} / {continuePath.state.boardsTotal} boards</div>
      </div>
      <button class="continue-chev" on:click={() => onNavigate?.('topicDetail', continuePath.id)}>&rsaquo;</button>
    </div>
  {/if}

  <!-- The four doors -->
  <div class="doors-label">{continuePath ? 'Or start somewhere new' : 'Where would you like to start?'}</div>
  <div class="doors-grid">
    {#each doors as door (door.gid)}
      <button class="door" on:click={() => openDoor(door)}>
        <span class="door-icon">{door.icon}</span>
        <span class="door-name">{door.name}</span>
        <span class="door-sub">{door.read > 0 ? `${door.read}/${door.total} boards` : door.tagline}</span>
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
  .menu-btn {
    width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid var(--qx-border-2);
    background: var(--qx-surface); color: var(--qx-text-dim); font-size: 22px; line-height: 1;
    cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    font-family: var(--qx-font); padding: 0 0 6px;
  }
  .menu-btn.icon-btn { padding: 0; }

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

  /* The four doors */
  .doors-label { font-size: 11px; font-weight: 700; color: var(--qx-text-faint); letter-spacing: 0.05em; margin-bottom: 10px; text-transform: uppercase; }
  .doors-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding-bottom: 16px; }
  .door {
    display: flex; flex-direction: column; align-items: center; gap: 5px;
    padding: 20px 12px; border-radius: var(--qx-radius-lg); border: 1.5px solid var(--qx-border-2);
    background: var(--qx-surface); cursor: pointer; font-family: var(--qx-font);
    transition: border-color 0.15s, transform 0.15s;
  }
  .door:hover { border-color: var(--qx-accent); transform: translateY(-2px); }
  .door-icon { font-size: 30px; line-height: 1; }
  .door-name { font-size: 15px; font-weight: 800; color: var(--qx-text); }
  .door-sub { font-size: 11.5px; font-weight: 600; color: var(--qx-text-faint); }
</style>
