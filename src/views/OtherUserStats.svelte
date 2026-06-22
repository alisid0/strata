<script>
  import { progress } from '../lib/stores/progress.js';
  import { totalBoards } from '../lib/content/paths.js';
  import QxToggle from '../lib/components/qubix/QxToggle.svelte';

  export let userId = '';
  export let onNavigate;

  // TODO: no per-user backend yet (no users/profiles table beyond auth) —
  // placeholder profile + stats until other users' data is queryable.
  const PROFILES = {
    u1: { name: 'Ada', boardsRead: 61, streak: 18, medals: 6 },
    u2: { name: 'Marcus', boardsRead: 70, streak: 32, medals: 8 },
    u3: { name: 'Priya', boardsRead: 48, streak: 14, medals: 4 },
    u4: { name: 'David', boardsRead: 39, streak: 9, medals: 3 },
    u5: { name: 'Sophie', boardsRead: 31, streak: 6, medals: 2 },
    u6: { name: 'James', boardsRead: 22, streak: 1, medals: 1 },
    u7: { name: 'Elena', boardsRead: 18, streak: 0, medals: 1 },
    u8: { name: 'Liam', boardsRead: 27, streak: 4, medals: 2 },
    u9: { name: 'Nina', boardsRead: 14, streak: 2, medals: 1 },
    u10: { name: 'Omar', boardsRead: 35, streak: 16, medals: 3 }
  };
  $: profile = PROFILES[userId] || { name: 'Learner', boardsRead: 0, streak: 0, medals: 0 };

  const TOTAL_BOARDS = totalBoards();
  $: theirPct = Math.round((profile.boardsRead / TOTAL_BOARDS) * 100);
  $: yourPct = Math.round((progress.getOverall().read / TOTAL_BOARDS) * 100);

  let compare = false;
</script>

<div class="qx-shell other-stats-view">
  <div class="topbar">
    <button class="back-chev" on:click={() => onNavigate?.('leaderboard')}>‹</button>
    <span class="topbar-title">{profile.name}'s stats</span>
  </div>

  <div class="profile-row">
    <div class="avatar">{profile.name.charAt(0)}</div>
    <div class="profile-name">{profile.name}</div>
  </div>

  <div class="compare-row">
    <span>Compare with you</span>
    <QxToggle checked={compare} onChange={(v) => compare = v} />
  </div>

  <div class="stat-grid">
    <div class="stat-card">
      <div class="stat-label">Boards read</div>
      <div class="stat-value">{profile.boardsRead} / {TOTAL_BOARDS}</div>
      {#if compare}<div class="stat-compare">You: {progress.getOverall().read} / {TOTAL_BOARDS}</div>{/if}
    </div>
    <div class="stat-card">
      <div class="stat-label">Streak</div>
      <div class="stat-value">{profile.streak} days</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Medals</div>
      <div class="stat-value">{profile.medals}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Coverage</div>
      <div class="stat-value">{theirPct}%</div>
      {#if compare}<div class="stat-compare">You: {yourPct}%</div>{/if}
    </div>
  </div>
</div>

<style>
  .other-stats-view { height: 100%; overflow-y: auto; padding: 16px 18px 24px; box-sizing: border-box; }
  .topbar { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
  .back-chev {
    width: 34px; height: 34px; border-radius: 50%; border: 1.5px solid var(--qx-border-2); background: var(--qx-surface);
    color: var(--qx-text-dim); font-size: 19px; cursor: pointer; display: flex; align-items: center; justify-content: center;
  }
  .topbar-title { font-size: 16px; font-weight: 800; color: var(--qx-text); }

  .profile-row { display: flex; flex-direction: column; align-items: center; gap: 10px; margin-bottom: 18px; }
  .avatar { width: 56px; height: 56px; border-radius: 50%; background: var(--qx-accent); color: #fff; font-size: 22px; font-weight: 800; display: flex; align-items: center; justify-content: center; }
  .profile-name { font-size: 18px; font-weight: 800; color: var(--qx-text); }

  .compare-row {
    display: flex; align-items: center; justify-content: space-between; border: 1.5px solid var(--qx-border);
    background: var(--qx-surface); border-radius: var(--qx-radius-md); padding: 11px 14px; margin-bottom: 16px;
    font-size: 14px; font-weight: 700; color: var(--qx-text);
  }

  .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .stat-card { border: 1.5px solid var(--qx-border); background: var(--qx-surface); border-radius: var(--qx-radius-md); padding: 12px; }
  .stat-label { font-size: 11px; font-weight: 700; color: var(--qx-text-faint); margin-bottom: 3px; }
  .stat-value { font-size: 16px; font-weight: 800; color: var(--qx-text); }
  .stat-compare { font-size: 11px; font-weight: 600; color: var(--qx-accent-text); margin-top: 4px; }
</style>
