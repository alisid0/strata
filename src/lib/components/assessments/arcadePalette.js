// Canvas 2D cannot resolve `var(--qx-*)` or `color-mix()` — assigning them to
// fillStyle/strokeStyle is silently ignored and the previous color is reused.
// This helper resolves the Qubix tokens to concrete colors so arcade games can
// paint with them, and re-resolves when the theme flips.

const TOKENS = [
  'accent', 'accent-soft', 'accent-text',
  'green', 'green-soft', 'green-text',
  'yellow', 'yellow-soft', 'yellow-text',
  'danger', 'border', 'border-2',
  'surface', 'bg',
  'text', 'text-dim', 'text-faint'
];

const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

export function resolvePalette() {
  const cs = getComputedStyle(document.documentElement);
  const p = {};
  for (const t of TOKENS) {
    p[camel(t)] = cs.getPropertyValue('--qx-' + t).trim() || '#888888';
  }
  p.dark = document.documentElement.getAttribute('data-qx-theme') === 'dark';
  p.font = cs.getPropertyValue('--qx-font').trim() || 'system-ui, sans-serif';
  return p;
}

/** Watch for theme flips; returns an unsubscribe function. */
export function watchTheme(cb) {
  if (typeof MutationObserver === 'undefined') return () => {};
  const mo = new MutationObserver(() => cb(resolvePalette()));
  mo.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-qx-theme']
  });
  return () => mo.disconnect();
}

/**
 * Canvas-safe replacement for `color-mix(in srgb, C p%, transparent)`.
 * Accepts #rgb, #rrggbb, rgb()/rgba(); anything else is returned unchanged.
 */
export function withAlpha(color, alpha) {
  const c = (color || '').trim();
  if (c.startsWith('#')) {
    let r, g, b;
    if (c.length === 4) {
      r = parseInt(c[1] + c[1], 16);
      g = parseInt(c[2] + c[2], 16);
      b = parseInt(c[3] + c[3], 16);
    } else if (c.length >= 7) {
      r = parseInt(c.slice(1, 3), 16);
      g = parseInt(c.slice(3, 5), 16);
      b = parseInt(c.slice(5, 7), 16);
    } else {
      return c;
    }
    return `rgba(${r},${g},${b},${alpha})`;
  }
  const m = c.match(/^rgba?\(([^)]+)\)$/);
  if (m) {
    const parts = m[1].split(',').map((v) => v.trim());
    return `rgba(${parts[0]},${parts[1]},${parts[2]},${alpha})`;
  }
  return c;
}
