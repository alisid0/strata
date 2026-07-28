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

<nav class="bottom-nav" aria-label="Primary navigation">
  {#each TABS as tab}
    <button
      class="tab"
      class:active={active === tab.id}
      aria-current={active === tab.id ? 'page' : undefined}
      on:click={() => onNavigate?.(tab.id)}
    >
      <QxIcon name={tab.icon} size={20} />
      <span>{tab.label}</span>
    </button>
  {/each}
</nav>

<style>
  .bottom-nav {
    width: min(calc(100% - 16px), 560px);
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    align-self: center;
    gap: 4px;
    margin: 0 8px max(8px, env(safe-area-inset-bottom, 0px));
    border: 1px solid var(--qx-border);
    border-radius: 20px;
    background: color-mix(in srgb, var(--qx-surface) 91%, transparent);
    backdrop-filter: blur(22px) saturate(1.15);
    padding: 5px;
    flex-shrink: 0;
    position: relative;
    box-shadow: 0 16px 40px -26px var(--qx-text);
  }
  .tab {
    min-width: 0;
    min-height: 52px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: var(--qx-text-faintest);
    font-size: 9.5px;
    font-weight: 760;
    font-family: var(--qx-font);
    background: none;
    border: none;
    cursor: pointer;
    padding: 7px 3px 6px;
    border-radius: 15px;
    transition: color 0.2s, transform 0.15s, background-color 0.2s;
    position: relative;
  }
  .tab:active { transform: scale(0.94); }
  .tab.active {
    color: var(--qx-accent-text);
    font-weight: 850;
    background: var(--qx-accent-soft);
  }
  .tab::after {
    content: '';
    position: absolute;
    bottom: 3px;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 18px;
    height: 2px;
    border-radius: 999px;
    background: var(--qx-accent);
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .tab.active::after {
    transform: translateX(-50%) scaleX(1);
  }

  @media (max-width: 430px) {
    .bottom-nav {
      width: 100%;
      margin: 0;
      padding: 6px 7px calc(6px + env(safe-area-inset-bottom, 0px));
      border-width: 1px 0 0;
      border-radius: 0;
      box-shadow: 0 -14px 36px -30px var(--qx-text);
    }
  }
</style>
