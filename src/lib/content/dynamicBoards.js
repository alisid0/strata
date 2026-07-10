import { writable, get } from 'svelte/store';
import { supabase } from '../supabase.js';
import { DECK } from './deck.js';
import { FUNCTION_BOARDS } from './functionBoards.js';
import { MATRIX_BOARDS } from './matrixBoards.js';
import { PUBLISHABLE_TOPIC_BOARDS } from './publishableTopicBoards.js';

const KEY = 'strata-dynamic-boards-v2';

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
  const layers = (row.layers || []).map(layer => {
    if (!layer || typeof layer !== 'object') return layer;
    return {
      text: layer.text ?? layer.content ?? '',
      img: layer.img ?? layer.image ?? null,
      audio: layer.audio ?? null
    };
  });

  return {
    act: row.act,
    kicker: row.kicker,
    title: row.title,
    layers,
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
  // Always refresh the requested dynamic boards from Supabase so authored edits
  // (text, images, audio, even floor shape) show on the next view. A "fetch once,
  // never refresh" cache silently froze boards mid-authoring; the cache is now
  // only an offline fallback. Static deck (<= DECK.length) is bundled locally.
  const dynamicNums = numbers.filter(n => n > DECK.length);

  if (dynamicNums.length > 0) {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .in('sort_order', dynamicNums);
      if (error) throw error;

      const next = { ...get(dynamicBoards) };
      for (const row of data || []) {
        next[row.sort_order] = normalize(row);
      }
      dynamicBoards.set(next);
      persistCache(next);
    } catch (_) {
      // offline / fetch failed — fall back to whatever's already cached below
    }
  }

  const result = {};
  const merged = get(dynamicBoards);
  for (const n of numbers) {
    if (n <= DECK.length) result[n] = DECK[n - 1];
    else if (merged[n]) result[n] = merged[n];
    else if (FUNCTION_BOARDS[n]) result[n] = FUNCTION_BOARDS[n];
    else if (MATRIX_BOARDS[n]) result[n] = MATRIX_BOARDS[n];
    else if (PUBLISHABLE_TOPIC_BOARDS[n]) result[n] = PUBLISHABLE_TOPIC_BOARDS[n];
  }
  return result;
}

/**
 * Fetch all dynamic Snippets (cards tagged kind:"snippet", above the static
 * deck range so the deck's own Card-55 snippet isn't double-counted). Returns
 * them in the same {kicker, title, layers, tags} shape DECK entries use, so the
 * Snippets view can treat static + dynamic identically.
 */
export async function fetchSnippets() {
  const { data, error } = await supabase
    .from('cards')
    .select('kicker, title, layers, tags')
    .eq('tags->>kind', 'snippet')
    .gt('sort_order', DECK.length)
    .order('sort_order');

  if (error) throw error;
  return (data || []).map(r => ({
    kicker: r.kicker,
    title: r.title,
    layers: r.layers,
    tags: r.tags
  }));
}

/** Resolve a single board by number: static DECK first, then the dynamic cache. */
export function getBoard(number) {
  if (number <= DECK.length) return DECK[number - 1];
  return get(dynamicBoards)[number] || FUNCTION_BOARDS[number] || MATRIX_BOARDS[number] || PUBLISHABLE_TOPIC_BOARDS[number] || null;
}

/** Numbers currently resolvable without a fetch (static + already-cached dynamic). */
export function loadedNumbers() {
  const merged = get(dynamicBoards);
  const dynamicNums = Object.keys(merged).map(Number);
  const functionNums = Object.keys(FUNCTION_BOARDS).map(Number);
  const matrixNums = Object.keys(MATRIX_BOARDS).map(Number);
  const publishableNums = Object.keys(PUBLISHABLE_TOPIC_BOARDS).map(Number);
  const staticNums = Array.from({ length: DECK.length }, (_, i) => i + 1);
  return [...staticNums, ...dynamicNums, ...functionNums, ...matrixNums, ...publishableNums].sort((a, b) => a - b);
}
