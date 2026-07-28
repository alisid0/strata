<script>
  import QxIcon from './QxIcon.svelte';

  export let active = 'home'; // home | path | workshop | wscore
  export let onNavigate;

  const TABS = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'path', label: 'Path', icon: 'topics' },
    { id: 'workshop', label: 'Workshop', icon: 'workshop' },
    { id: 'wscore', label: 'W Score', icon: 'stats' }
  ];
</script>

<nav class="bottom-nav">
  {#each TABS as tab}
    <button class="tab" class:active={active === tab.id} on:click={() => onNavigate?.(tab.id)}>
      <QxIcon name={tab.icon} size={20} />
      <span>{tab.label}</span>
    </button>
  {/each}
</nav>

<style>
  .bottom-nav {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 3px;
    border-top: 1px solid var(--qx-border);
    background: color-mix(in srgb, var(--qx-surface) 94%, transparent);
    backdrop-filter: blur(16px);
    padding: 7px 8px calc(7px + env(safe-area-inset-bottom, 0px));
    flex-shrink: 0;
    position: relative;
    box-shadow: 0 -12px 30px -24px var(--qx-text);
  }
  .tab {
    min-width: 0;
    min-height: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    color: var(--qx-text-faintest);
    font-size: 10px;
    font-weight: 700;
    font-family: var(--qx-font);
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px 3px 5px;
    border-radius: var(--qx-radius-md);
    transition: color 0.2s, transform 0.15s, background-color 0.2s;
    position: relative;
  }
  .tab:active { transform: scale(0.94); }
  .tab.active {
    color: var(--qx-accent);
    font-weight: 800;
    background: var(--qx-accent-soft);
  }
  .tab::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 20px;
    height: 3px;
    border-radius: 2px;
    background: var(--qx-accent);
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .tab.active::after {
    transform: translateX(-50%) scaleX(1);
  }
</style>
