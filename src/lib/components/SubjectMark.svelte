<script>
  export let subject = 'physics';
  export let accent = '#f2d585';
  export let size = 32;

  $: svgContent = getIcon(subject, accent);

  function getIcon(subject, accent) {
    if (subject === 'physics') {
      // Prism refracting light + pendulum
      return `
        <line x1="32" y1="4" x2="27" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <circle cx="27" cy="20" r="5" fill="${accent}"/>
        <polygon points="16,38 46,38 31,56" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linejoin="round"/>
        <line x1="2" y1="42" x2="20" y2="42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <polygon points="19,42 22,40 22,44" fill="currentColor"/>
        <line x1="40" y1="42" x2="58" y2="32" stroke="${accent}" stroke-width="1.8" stroke-linecap="round" opacity="0.9"/>
        <line x1="40" y1="42" x2="60" y2="40" stroke="${accent}" stroke-width="1.8" stroke-linecap="round" opacity="0.6"/>
        <line x1="40" y1="42" x2="57" y2="49" stroke="${accent}" stroke-width="1.8" stroke-linecap="round" opacity="0.75"/>
        <line x1="40" y1="42" x2="54" y2="54" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.55"/>
      `;
    }
    if (subject === 'maths') {
      // 1/√x — mathematical notation
      return `
        <text x="32" y="23" text-anchor="middle" font-size="20" font-weight="800" fill="currentColor" font-family="system-ui, -apple-system, sans-serif">1</text>
        <line x1="16" y1="31" x2="48" y2="31" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M18 44 L14 47 L14 52 L26 52" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
        <text x="34" y="50" text-anchor="middle" font-size="17" font-weight="700" fill="${accent}" font-family="system-ui, -apple-system, sans-serif" font-style="italic">x</text>
      `;
    }
    // chemistry — flask + test tube
    return `
      <path d="M18 14 L18 30 L10 50 Q9 54 14 54 L34 54 Q39 54 38 50 L30 30 L30 14" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
      <line x1="18" y1="14" x2="30" y2="14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M15 46 L33 46" stroke="${accent}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <circle cx="22" cy="49" r="2" fill="${accent}"/>
      <circle cx="28" cy="42" r="1.5" fill="currentColor"/>
      <path d="M48 12 L48 44 Q48 54 44 54 Q40 54 40 44 L40 12" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M43 38 L45 38" stroke="${accent}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    `;
  }
</script>

<svg viewBox="0 0 64 64" width={size} height={size} fill="none" style="display:block">
  {@html svgContent}
</svg>
