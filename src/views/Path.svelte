<script>
  // Path tab — the four gateways (Line / Atom / Bit / Unit), each with its
  // covered (live) topics and greyed future topics from ROADMAP. Replaces the
  // old flat Topics browser (blueprint §5.4).
  import { PATHS, PATH_GROUPS, ROADMAP } from '../lib/content/paths.js';
  import { progress } from '../lib/stores/progress.js';

  export let onNavigate;

  const GATEWAY_META = {
    line: { icon: '/icons/gateways/line.png', tagline: 'Space & abstraction' },
    atom: { icon: '/icons/gateways/atom.png', tagline: 'Matter & charge' },
    bit:  { icon: '/icons/gateways/bit.png',  tagline: 'Information & logic' },
    unit: { icon: '/icons/gateways/unit.png', tagline: 'Measurement & scale' }
  };

  $: gateways = ($progress, Object.entries(PATH_GROUPS).map(([gid, g]) => {
    const topics = g.paths.filter(id => PATHS[id]).map(id => ({
      id, manifest: PATHS[id], state: progress.getPathState(id, PATHS[id])
    }));
    const read = topics.reduce((a, t) => a + (t.state.boardsRead || 0), 0);
    const total = topics.reduce((a, t) => a + (t.state.boardsTotal || 0), 0);
    return { gid, ...g, ...GATEWAY_META[gid], topics, read, total, roadmap: ROADMAP[gid] || [] };
  }));

  function chip(state) {
    if (!state.boardsRead) return 'Not started';
    if (state.boardsTotal && state.boardsRead >= state.boardsTotal) return 'Done ✓';
    return `${state.boardsRead}/${state.boardsTotal}`;
  }
</script>

<div class="qx-shell path-tab">
  <div class="path-header">
    <h1>Path</h1>
    <p class="header-sub">Four ways in. Go as deep as you like.</p>
  </div>

  {#each gateways as g (g.gid)}
    <section class="gateway-block">
      <div class="gw-head">
        <img class="gw-icon" src={g.icon} alt={g.name} />
        <div class="gw-info">
          <div class="gw-name">{g.name}</div>
          <div class="gw-tagline">{g.tagline}</div>
        </div>
        <span class="gw-progress">{g.read}/{g.total}</span>
      </div>

      <div class="topic-list">
        {#each g.topics as t (t.id)}
          <button class="topic-row" on:click={() => onNavigate?.('topicDetail', t.id)}>
            <div class="row-info">
              <div class="row-name">{t.manifest.name}</div>
              <div class="row-meta">{t.state.boardsTotal} boards</div>
            </div>
            <span class="row-chip"
              class:started={t.state.boardsRead > 0}
              class:done={t.state.boardsTotal > 0 && t.state.boardsRead >= t.state.boardsTotal}>
              {chip(t.state)}
            </span>
            <span class="row-chev">›</span>
          </button>
        {/each}

        {#each g.roadmap as name}
          <div class="topic-row future">
            <div class="row-info">
              <div class="row-name">{name}</div>
            </div>
            <span class="soon-chip">Soon</span>
          </div>
        {/each}
      </div>
    </section>
  {/each}
</div>

<style>
  .path-tab { height: 100%; overflow-y: auto; padding: 16px 18px 24px; box-sizing: border-box; }
  .path-header { margin-bottom: 18px; }
  h1 { font-size: 23px; font-weight: 800; color: var(--qx-text); margin: 0; }
  .header-sub { font-size: 13px; color: var(--qx-text-dim); margin: 2px 0 0; }

  .gateway-block { margin-bottom: 26px; }
  .gw-head { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .gw-icon { width: 44px; height: 44px; object-fit: contain; flex-shrink: 0; display: block; }
  .gw-info { flex: 1; min-width: 0; }
  .gw-name { font-size: 17px; font-weight: 800; color: var(--qx-text); line-height: 1.2; }
  .gw-tagline { font-size: 12px; font-weight: 600; color: var(--qx-text-faint); margin-top: 1px; }
  .gw-progress { font-size: 12px; font-weight: 700; color: var(--qx-text-dim); background: var(--qx-surface-2); border-radius: var(--qx-radius-pill); padding: 4px 10px; }

  .topic-list { display: flex; flex-direction: column; gap: 6px; }
  .topic-row {
    display: flex; align-items: center; gap: 10px; width: 100%; text-align: left;
    padding: 12px 14px; border-radius: var(--qx-radius-md);
    border: 1.5px solid var(--qx-border); background: var(--qx-surface);
    cursor: pointer; font-family: var(--qx-font); transition: border-color 0.15s, background 0.15s;
  }
  .topic-row:not(.future):hover { border-color: var(--qx-accent); }
  .row-info { flex: 1; min-width: 0; }
  .row-name { font-size: 14.5px; font-weight: 700; color: var(--qx-text); line-height: 1.25; }
  .row-meta { font-size: 12px; font-weight: 600; color: var(--qx-text-faint); margin-top: 2px; }
  .row-chip {
    font-size: 11.5px; font-weight: 700; color: var(--qx-text-faint);
    background: var(--qx-surface-2); border-radius: var(--qx-radius-pill); padding: 4px 10px; flex-shrink: 0;
  }
  .row-chip.started { color: var(--qx-accent-text); background: var(--qx-accent-soft); }
  .row-chip.done { color: var(--qx-green-text); background: var(--qx-green-soft); }
  .row-chev { font-size: 17px; color: var(--qx-text-faintest); flex-shrink: 0; }

  .topic-row.future { cursor: default; opacity: 0.6; background: transparent; border-style: dashed; }
  .topic-row.future .row-name { color: var(--qx-text-dim); font-weight: 600; }
  .soon-chip {
    font-size: 11px; font-weight: 800; letter-spacing: 0.04em; color: var(--qx-text-faint);
    border: 1px solid var(--qx-border-2); border-radius: var(--qx-radius-pill); padding: 3px 9px; flex-shrink: 0;
  }
</style>
