import { writable, get } from 'svelte/store';

const KEY = 'qubix-theme';

function loadInitial() {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch (_) {}
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

function createThemeStore() {
  const { subscribe, set, update } = writable(loadInitial());

  function apply(value) {
    try { localStorage.setItem(KEY, value); } catch (_) {}
    if (typeof document !== 'undefined') document.documentElement.dataset.qxTheme = value;
  }

  return {
    subscribe,
    set(value) { apply(value); set(value); },
    toggle() { update(v => { const next = v === 'dark' ? 'light' : 'dark'; apply(next); return next; }); }
  };
}

export const theme = createThemeStore();

if (typeof document !== 'undefined') {
  document.documentElement.dataset.qxTheme = get(theme);
}
