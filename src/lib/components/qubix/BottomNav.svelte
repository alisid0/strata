<script>
  import QxIcon from './QxIcon.svelte';

  export let active = 'home'; // home | topics | map | snippets
  export let onNavigate;

  const TABS = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'topics', label: 'Topics', icon: 'topics' },
    { id: 'map', label: 'Map', icon: 'map' },
    { id: 'snippets', label: 'Snippets', icon: 'snippets' }
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
    display: flex;
    border-top: 1px solid var(--qx-border);
    background: var(--qx-surface);
    padding: 7px 4px calc(4px + env(safe-area-inset-bottom, 0px));
    flex-shrink: 0;
    position: relative;
  }
  .tab {
    flex: 1;
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
    padding: 4px 0;
    transition: color 0.2s, transform 0.15s;
    position: relative;
  }
  .tab:active { transform: scale(0.94); }
  .tab.active {
    color: var(--qx-accent);
    font-weight: 800;
  }
  .tab::after {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 20px;
    height: 2.5px;
    border-radius: 2px;
    background: var(--qx-accent);
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .tab.active::after {
    transform: translateX(-50%) scaleX(1);
  }
</style>
