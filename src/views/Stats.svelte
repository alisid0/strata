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
    <div class="top-left">
      <button class="back-chev" on:click={() => onNavigate?.('home')} aria-label="Back">‹</button>
      <h1>Your stats</h1>
    </div>
    <div class="avatar">{$displayName.charAt(0).toUpperCase()}</div>
  </div>

  <!-- Topics covered + Streak -->
  <div class="top-cards">
    <div class="tc-card">
      <div class="tc-label">Topics covered</div>
      <div class="tc-value">{overall.read}/{TOTAL_BOARDS}</div>
    </div>
    <div class="tc-card streak-card">
      <div class="tc-label">Streak</div>
      <div class="tc-value">🔥 {STREAK_DAYS} <span class="tc-unit">days</span></div>
    </div>
  </div>

  <!-- Consistency -->
  <div class="section-label">Consistency</div>
  <div class="consistency-row">
    {#each CONSISTENCY as v, i}
      <div class="bar-col">
        <div class="bar-track"><div class="bar-fill" style="height:{v}%"></div></div>
        <span class="bar-day">{['M','T','W','T','F','S','S'][i]}</span>
      </div>
    {/each}
    <span class="consistency-summary">5 of 7 days</span>
  </div>

  <!-- Pace / Depth / Time -->
  <div class="metrics-row">
    <div class="metric">
      <div class="metric-label">Pace</div>
      <div class="metric-value">4/wk</div>
    </div>
    <div class="metric">
      <div class="metric-label">Depth</div>
      <div class="metric-value">Tier 3</div>
    </div>
    <div class="metric">
      <div class="metric-label">Time</div>
      <div class="metric-value">14h</div>
    </div>
  </div>

  <!-- Medals -->
  <div class="section-label">Medals &middot; {MEDALS.length} earned</div>
  <div class="medal-row">
    {#each MEDALS as m}
      <div class="medal-chip">🏅 {m}</div>
    {/each}
  </div>

  <!-- Leaderboard link -->
  <button class="leaderboard-link" on:click={() => onNavigate?.('leaderboard')}>
    Leaderboard <span class="link-chev">&rsaquo;</span>
  </button>

  <!-- Settings -->
  <div class="settings-row">
    <span class="settings-label">Dark mode</span>
    <QxToggle checked={$theme === 'dark'} onChange={() => theme.toggle()} />
  </div>

  <div class="footer-links">
    <button class="footer-link" on:click={() => onNavigate?.('author')}>Author a BB</button>
    <button class="footer-link danger" on:click={handleLogout}>Log out</button>
  </div>
</div>

<style>
  .stats-view { height: 100%; overflow-y: auto; padding: 16px 18px 24px; box-sizing: border-box; }
  .top-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .top-left { display: flex; align-items: center; gap: 10px; }
  .back-chev {
    width: 34px; height: 34px; border-radius: 50%; border: 1.5px solid var(--qx-border-2); background: var(--qx-surface);
    color: var(--qx-text-dim); font-size: 19px; cursor: pointer; display: flex; align-items: center; justify-content: center;
  }
  h1 { font-size: 23px; font-weight: 800; color: var(--qx-text); margin: 0; }
  .avatar {
    width: 36px; height: 36px; border-radius: 50%; background: var(--qx-accent); color: #fff;
    font-weight: 800; font-size: 15px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }

  .top-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
  .tc-card { border: 1.5px solid var(--qx-border); background: var(--qx-surface); border-radius: var(--qx-radius-md); padding: 14px; }
  .tc-label { font-size: 11px; font-weight: 700; color: var(--qx-text-faint); margin-bottom: 4px; }
  .tc-value { font-size: 20px; font-weight: 800; color: var(--qx-text); }
  .tc-unit { font-size: 13px; font-weight: 600; color: var(--qx-text-dim); }

  .section-label { font-size: 12px; font-weight: 700; color: var(--qx-text-dim); margin-bottom: 10px; }

  /* Consistency */
  .consistency-row { display: flex; gap: 6px; align-items: flex-end; height: 70px; margin-bottom: 20px; position: relative; }
  .bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; gap: 4px; }
  .bar-track { flex: 1; width: 100%; display: flex; align-items: flex-end; border-radius: 5px; overflow: hidden; background: var(--qx-surface-2); }
  .bar-fill { width: 100%; background: var(--qx-accent); border-radius: 5px 5px 0 0; }
  .bar-day { font-size: 10px; font-weight: 600; color: var(--qx-text-faint); }
  .consistency-summary { font-size: 12px; font-weight: 600; color: var(--qx-text-faint); position: absolute; bottom: -18px; right: 0; }

  /* Metrics */
  .metrics-row { display: flex; gap: 10px; margin-bottom: 20px; }
  .metric { flex: 1; border: 1.5px solid var(--qx-border); background: var(--qx-surface); border-radius: var(--qx-radius-md); padding: 12px; text-align: center; }
  .metric-label { font-size: 11px; font-weight: 700; color: var(--qx-text-faint); margin-bottom: 3px; }
  .metric-value { font-size: 17px; font-weight: 800; color: var(--qx-text); }

  /* Medals */
  .medal-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
  .medal-chip { font-size: 12px; font-weight: 700; color: var(--qx-yellow-text); background: var(--qx-yellow-soft); border-radius: var(--qx-radius-pill); padding: 7px 13px; }

  /* Leaderboard link */
  .leaderboard-link {
    display: flex; align-items: center; justify-content: space-between; width: 100%;
    padding: 14px 16px; border-radius: var(--qx-radius-md); border: 1.5px solid var(--qx-border);
    background: var(--qx-surface); cursor: pointer; font-family: var(--qx-font);
    font-size: 15px; font-weight: 700; color: var(--qx-text); margin-bottom: 16px;
  }
  .link-chev { font-size: 18px; color: var(--qx-text-faint); }

  .settings-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px; border-radius: var(--qx-radius-md); border: 1.5px solid var(--qx-border);
    background: var(--qx-surface); margin-bottom: 16px;
  }
  .settings-label { font-size: 15px; font-weight: 700; color: var(--qx-text); }

  .footer-links { display: flex; flex-direction: column; gap: 6px; border-top: 1px solid var(--qx-border); padding-top: 14px; }
  .footer-link { background: none; border: none; text-align: left; font-family: var(--qx-font); font-size: 14px; font-weight: 700; color: var(--qx-text-dim); cursor: pointer; padding: 6px 0; }
  .footer-link.danger { color: #e0574d; }
</style>
