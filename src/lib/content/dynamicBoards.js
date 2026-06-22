import { writable, get } from 'svelte/store';
import { supabase } from '../supabase.js';
import { DECK } from './deck.js';

const KEY = 'strata-dynamic-boards-v1';

function loadCache() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return {};
  }
}

function persistCache(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (_) {}
}

// sort_order (number) -> normalized board, for every dynamic card fetched so far this session.
const dynamicBoards = writable(loadCache());

/** Normalize a `cards` table row into deck.js's C()-produced shape. */
function normalize(row) {
  return {
    act: row.act,
    kicker: row.kicker,
    title: row.title,
    layers: row.layers,
    img: row.img_url || null,
    tags: row.tags || null
  };
}

/**
 * Fetch any of the given card numbers that aren't already in the static
 * DECK or the dynamic cache, merge them in, and return the full set
 * (cache hits + freshly fetched) keyed by number.
 */
export async function fetchBoardsByNumbers(numbers) {
  const cache = get(dynamicBoards);
  const toFetch = numbers.filter(n => n > DECK.length && !cache[n]);

  if (toFetch.length > 0) {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .in('sort_order', toFetch);

    if (error) throw error;

    const next = { ...cache };
    for (const row of data || []) {
      next[row.sort_order] = normalize(row);
    }
    dynamicBoards.set(next);
    persistCache(next);
  }

  const result = {};
  const merged = get(dynamicBoards);
  for (const n of numbers) {
    if (n <= DECK.length) result[n] = DECK[n - 1];
    else if (merged[n]) result[n] = merged[n];
  }
  return result;
}

/** Resolve a single board by number: static DECK first, then the dynamic cache. */
export function getBoard(number) {
  if (number <= DECK.length) return DECK[number - 1];
  return get(dynamicBoards)[number] || null;
}

/** Numbers currently resolvable without a fetch (static + already-cached dynamic). */
export function loadedNumbers() {
  const merged = get(dynamicBoards);
  const dynamicNums = Object.keys(merged).map(Number);
  const staticNums = Array.from({ length: DECK.length }, (_, i) => i + 1);
  return [...staticNums, ...dynamicNums].sort((a, b) => a - b);
}
