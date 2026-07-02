<script>
  export let subject = 'physics';
  export let accent = '#f2d585';
  export let size = 32;

  $: svgContent = getIcon(subject, accent);

  function getIcon(subject, accent) {
    if (subject === 'physics') {
      // Catapult — simple lever machine
      return `
        <path d="M28 50 L14 30 L50 30 L36 50" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linejoin="round"/>
        <line x1="32" y1="50" x2="32" y2="30" stroke="currentColor" stroke-width="2.4"/>
        <circle cx="32" cy="30" r="2.8" fill="${accent}"/>
        <path d="M38 38 Q58 18 54 12" stroke="${accent}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-dasharray="3 3"/>
        <circle cx="54" cy="12" r="3" fill="${accent}" opacity="0.7"/>
      `;
    }
    if (subject === 'maths') {
      // 1/√x curve
      return `
        <line x1="16" y1="10" x2="16" y2="50" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="16" y1="50" x2="56" y2="50" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M18 14 Q24 22 30 34 Q38 44 54 48" stroke="${accent}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
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
