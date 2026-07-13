<script>
  // Floating "+N W" reward toast. Mounted once in App.svelte; listens to the
  // wtoast store and plays the reward chime. Olive (green) family per the
  // design spec — green = wins earned. Animation respects reduced motion;
  // the sound plays either way (muted via the 'qubix-sound' pref).
  import { wtoast } from '../../stores/wtoast.js';
  import { playAward, playBonus } from '../../sfx.js';

  let visible = null;   // { id, amount, bonus }
  let hideTimer = null;

  const reduceMotion = typeof matchMedia !== 'undefined'
    && matchMedia('(prefers-reduced-motion: reduce)').matches;

  $: if ($wtoast && $wtoast.id !== visible?.id) {
    visible = $wtoast;
    ($wtoast.bonus ? playBonus : playAward)();
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { visible = null; }, 1400);
  }
</script>

{#if visible}
  {#key visible.id}
    <div class="w-toast" class:bonus={visible.bonus} class:still={reduceMotion} role="status" aria-live="polite">
      +{visible.amount} W
    </div>
  {/key}
{/if}

<style>
  .w-toast {
    position: fixed;
    right: 18px;
    bottom: 92px; /* clears the bottom nav */
    z-index: 300;
    padding: 8px 16px;
    border-radius: 999px;
    background: var(--qx-green-soft);
    border: 1.5px solid var(--qx-green);
    color: var(--qx-green-text);
    font-family: var(--qx-font);
    font-size: 15px;
    font-weight: 900;
    pointer-events: none;
    animation: wFloat 1.4s ease-out forwards;
  }

  .w-toast.bonus {
    font-size: 17px;
    padding: 10px 20px;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
  }

  .w-toast.still {
    animation: wFade 1.4s ease-out forwards;
  }

  @keyframes wFloat {
    0%   { opacity: 0; transform: translateY(14px) scale(0.85); }
    18%  { opacity: 1; transform: translateY(0) scale(1.06); }
    28%  { transform: translateY(-2px) scale(1); }
    75%  { opacity: 1; transform: translateY(-14px) scale(1); }
    100% { opacity: 0; transform: translateY(-26px) scale(0.96); }
  }

  @keyframes wFade {
    0%   { opacity: 0; }
    15%  { opacity: 1; }
    80%  { opacity: 1; }
    100% { opacity: 0; }
  }
</style>
