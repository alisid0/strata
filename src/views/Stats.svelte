<script>
  import { totalBoards } from '../lib/content/paths.js';
  import { progress } from '../lib/stores/progress.js';
  import { displayName, logOut } from '../lib/stores/auth.js';
  import { theme } from '../lib/stores/theme.js';
  import QxToggle from '../lib/components/qubix/QxToggle.svelte';

  export let onNavigate;

  const TOTAL_BOARDS = totalBoards();
  $: overall = progress.getOverall();
  $: pct = TOTAL_BOARDS ? Math.round((overall.read / TOTAL_BOARDS) * 100) : 0;

  // TODO: no backend yet for these — placeholder until daily-activity logging,
  // study-session timing, and a medals table exist.
  const STREAK_DAYS = 12;
  const CONSISTENCY = [60, 80, 40, 90, 70, 100, 50];
  const PACE = 'Steady';
  const DEPTH = 'Digs deep';
  const TIME_THIS_WEEK = '2h 14m';
  const MEDALS = ['First board', 'First quiz', '7-day streak', 'Topic complete', 'Perfect quiz'];

  async function handleLogout() {
    try { await logOut(); } catch (_) {}
    onNavigate?.('auth');
  }
</script>

<div class="qx-shell stats-view">
  <div class="top-row">
    <h1>Your stats</h1>
    <div class="theme-toggle">
      <QxToggle checked={$theme === 'dark'} onChange={() => theme.toggle()} />
      <span>{$theme === 'dark' ? 'Dark' : 'Light'}</span>
    </div>
  </div>

  <div class="hero">
    <div class="ring" style="background:conic-gradient(var(--qx-accent) {pct * 3.6}deg, rgba(255,255,255,0.14) 0)">
      <div class="ring-inner">{pct}%</div>
    </div>
    <div class="hero-info">
      <div class="hero-title">{overall.read} / {TOTAL_BOARDS} boards read</div>
      <div class="hero-sub">across every topic</div>
    </div>
  </div>

  <div class="stat-grid">
    <div class="stat-card">
      <div class="stat-label">Streak</div>
      <div class="stat-value">{STREAK_DAYS} days</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">This week</div>
      <div class="stat-value">{TIME_THIS_WEEK}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Pace</div>
      <div class="stat-value">{PACE}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Depth</div>
      <div class="stat-value">{DEPTH}</div>
    </div>
  </div>

  <div class="section-label">Consistency, last 7 days</div>
  <div class="consistency-row">
    {#each CONSISTENCY as v}
      <div class="bar-track"><div class="bar-fill" style="height:{v}%"></div></div>
    {/each}
  </div>

  <div class="section-label">Medals</div>
  <div class="medal-row">
    {#each MEDALS as m}
      <div class="medal-chip">🏅 {m}</div>
    {/each}
  </div>

  <div class="footer-links">
    <button class="footer-link" on:click={() => onNavigate?.('author')}>Author a BB</button>
    <button class="footer-link danger" on:click={handleLogout}>Log out</button>
  </div>
</div>

<style>
  .stats-view { height: 100%; overflow-y: auto; padding: 16px 18px 24px; box-sizing: border-box; }
  .top-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  h1 { font-size: 23px; font-weight: 800; color: var(--qx-text); margin: 0; }
  .theme-toggle { display: flex; align-items: center; gap: 7px; background: none; border: none; cursor: pointer; font-family: var(--qx-font); font-size: 12px; font-weight: 700; color: var(--qx-text-dim); }

  .hero {
    display: flex; align-items: center; gap: 14px; border-radius: var(--qx-radius-lg); background: var(--qx-surface-elevated);
    border: 1px solid var(--qx-border); padding: 18px; margin-bottom: 16px; color: #fff;
  }
  .ring { position: relative; width: 58px; height: 58px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .ring-inner { width: 48px; height: 48px; border-radius: 50%; background: var(--qx-surface-elevated); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; }
  .hero-title { font-size: 16px; font-weight: 800; }
  .hero-sub { font-size: 12px; font-weight: 500; color: #b9b4c0; }

  .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 18px; }
  .stat-card { border: 1.5px solid var(--qx-border); background: var(--qx-surface); border-radius: var(--qx-radius-md); padding: 12px; }
  .stat-label { font-size: 11px; font-weight: 700; color: var(--qx-text-faint); margin-bottom: 3px; }
  .stat-value { font-size: 16px; font-weight: 800; color: var(--qx-text); }

  .section-label { font-size: 12px; font-weight: 700; color: var(--qx-text-dim); margin-bottom: 9px; }
  .consistency-row { display: flex; gap: 7px; align-items: flex-end; height: 60px; margin-bottom: 18px; }
  .bar-track { flex: 1; height: 100%; display: flex; align-items: flex-end; background: var(--qx-surface-2); border-radius: 5px; overflow: hidden; }
  .bar-fill { width: 100%; background: var(--qx-accent); border-radius: 5px; }

  .medal-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 22px; }
  .medal-chip { font-size: 12px; font-weight: 700; color: var(--qx-yellow-text); background: var(--qx-yellow-soft); border-radius: var(--qx-radius-pill); padding: 7px 12px; }

  .footer-links { display: flex; flex-direction: column; gap: 6px; border-top: 1px solid var(--qx-border); padding-top: 14px; }
  .footer-link { background: none; border: none; text-align: left; font-family: var(--qx-font); font-size: 14px; font-weight: 700; color: var(--qx-text-dim); cursor: pointer; padding: 6px 0; }
  .footer-link.danger { color: #e0574d; }
</style>
