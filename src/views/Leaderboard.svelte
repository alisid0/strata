<script>
  export let onNavigate;

  let tab = 'weekly'; // daily | weekly | monthly

  // TODO: no leaderboard table in Supabase yet (supabase.js only has cards/progress/quiz_results) —
  // placeholder ranking data until a real XP/ranking backend exists.
  const RANKS = {
    daily: [
      { id: 'u1', name: 'Ada', xp: 2840, streak: 7 },
      { id: 'u2', name: 'Marcus', xp: 2150, streak: 5 },
      { id: 'u3', name: 'Priya', xp: 1920, streak: 4 },
      { id: 'u4', name: 'David', xp: 1680, streak: 3 },
      { id: 'u5', name: 'Sophie', xp: 1440, streak: 2 },
      { id: 'u6', name: 'James', xp: 1100, streak: 1 },
      { id: 'u7', name: 'Elena', xp: 820, streak: 0 },
      { id: 'you', name: 'You', xp: 680, streak: 0, isYou: true }
    ],
    weekly: [
      { id: 'u2', name: 'Marcus', xp: 12400, streak: 32 },
      { id: 'u1', name: 'Ada', xp: 10800, streak: 18 },
      { id: 'u3', name: 'Priya', xp: 9200, streak: 14 },
      { id: 'you', name: 'You', xp: 8400, streak: 12, isYou: true },
      { id: 'u4', name: 'David', xp: 7100, streak: 9 },
      { id: 'u5', name: 'Sophie', xp: 5600, streak: 6 },
      { id: 'u8', name: 'Liam', xp: 4200, streak: 4 },
      { id: 'u9', name: 'Nina', xp: 2100, streak: 2 }
    ],
    monthly: [
      { id: 'u1', name: 'Ada', xp: 52000, streak: 82 },
      { id: 'u2', name: 'Marcus', xp: 48000, streak: 71 },
      { id: 'you', name: 'You', xp: 36400, streak: 54, isYou: true },
      { id: 'u4', name: 'David', xp: 31000, streak: 42 },
      { id: 'u3', name: 'Priya', xp: 28500, streak: 38 },
      { id: 'u8', name: 'Liam', xp: 19200, streak: 29 },
      { id: 'u5', name: 'Sophie', xp: 15100, streak: 22 },
      { id: 'u10', name: 'Omar', xp: 10400, streak: 16 }
    ]
  };

  $: list = RANKS[tab];
  $: podium = list.slice(0, 3);
  $: rest = list.slice(3);
</script>

<div class="qx-shell leaderboard-view">
  <div class="topbar">
    <button class="back-chev" on:click={() => onNavigate?.('home')}>‹</button>
    <span class="topbar-title">Leaderboard</span>
  </div>

  <div class="tabs">
    {#each ['daily', 'weekly', 'monthly'] as t}
      <button class="tab" class:active={tab === t} on:click={() => tab = t}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
    {/each}
  </div>

  <div class="podium">
    {#each podium as p, i}
      <button class="podium-spot rank-{i + 1}" on:click={() => onNavigate?.('otherUserStats', p.id)}>
        <div class="podium-avatar">{p.name.charAt(0)}</div>
        <div class="podium-name">{p.name}{#if p.isYou} <span class="you-tag">(you)</span>{/if}</div>
        <div class="podium-xp">{p.xp.toLocaleString()} XP</div>
      </button>
    {/each}
  </div>

  <div class="rank-list">
    {#each rest as p, i}
      <button class="rank-row" class:you={p.isYou} on:click={() => onNavigate?.('otherUserStats', p.id)}>
        <span class="rank-pos">{i + 4}</span>
        <div class="rank-avatar">{p.name.charAt(0)}</div>
        <div class="rank-info">
          <div class="rank-name">{p.name}{#if p.isYou} <span class="you-tag">(you)</span>{/if}</div>
          {#if p.streak > 0}<div class="rank-streak">🔥 {p.streak}-day streak</div>{/if}
        </div>
        <div class="rank-xp">{p.xp.toLocaleString()} XP</div>
      </button>
    {/each}
  </div>
</div>

<style>
  .leaderboard-view { height: 100%; overflow-y: auto; padding: 16px 18px 24px; box-sizing: border-box; }
  .topbar { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .back-chev {
    width: 34px; height: 34px; border-radius: 50%; border: 1.5px solid var(--qx-border-2); background: var(--qx-surface);
    color: var(--qx-text-dim); font-size: 19px; cursor: pointer; display: flex; align-items: center; justify-content: center;
  }
  .topbar-title { font-size: 18px; font-weight: 800; color: var(--qx-text); }

  .tabs { display: flex; gap: 4px; background: var(--qx-surface-3); border-radius: var(--qx-radius-md); padding: 4px; margin-bottom: 18px; }
  .tab { flex: 1; text-align: center; padding: 9px 0; border-radius: 9px; border: none; font-family: var(--qx-font); font-size: 13px; font-weight: 700; cursor: pointer; background: transparent; color: var(--qx-text-dim); }
  .tab.active { background: var(--qx-surface); color: var(--qx-text); }

  .podium { display: flex; gap: 8px; align-items: flex-end; margin-bottom: 18px; }
  .podium-spot { flex: 1; border: 1.5px solid var(--qx-border); background: var(--qx-surface); border-radius: var(--qx-radius-md); padding: 12px 8px; text-align: center; cursor: pointer; font-family: var(--qx-font); }
  .podium-spot.rank-1 { border-color: var(--qx-yellow); background: var(--qx-yellow-soft); padding-top: 18px; }
  .podium-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--qx-accent); color: #fff; font-weight: 800; display: flex; align-items: center; justify-content: center; margin: 0 auto 7px; }
  .podium-name { font-size: 12.5px; font-weight: 800; color: var(--qx-text); }
  .you-tag { color: var(--qx-accent); font-weight: 700; }
  .podium-xp { font-size: 11px; font-weight: 600; color: var(--qx-text-dim); }

  .rank-list { display: flex; flex-direction: column; gap: 7px; }
  .rank-row { display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; border: 1.5px solid var(--qx-border); background: var(--qx-surface); border-radius: var(--qx-radius-md); padding: 9px 11px; cursor: pointer; font-family: var(--qx-font); }
  .rank-row.you { border-color: var(--qx-accent); background: var(--qx-accent-soft-2); }
  .rank-pos { font-size: 14px; font-weight: 700; color: var(--qx-text-faint); width: 18px; text-align: center; }
  .rank-avatar { width: 36px; height: 36px; min-width: 36px; border-radius: 50%; background: var(--qx-surface-2); color: var(--qx-text-2); font-weight: 800; display: flex; align-items: center; justify-content: center; }
  .rank-info { flex: 1; min-width: 0; }
  .rank-name { font-size: 14px; font-weight: 700; color: var(--qx-text); }
  .rank-streak { font-size: 11px; font-weight: 600; color: var(--qx-text-faint); }
  .rank-xp { font-size: 13px; font-weight: 700; color: var(--qx-text-2); white-space: nowrap; }
</style>
