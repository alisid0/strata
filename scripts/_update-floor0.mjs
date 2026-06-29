import { createClient } from '@supabase/supabase-js';
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const newFloor0 = '<p>What is the mass of an elephant? A number on its own means nothing. It requires a standardized unit, like the kilogram, so the measurement is universally understood by the global scientific community.</p>';

const { data } = await s.from('cards').select('*').eq('sort_order', 1000).single();
const layers = [...(data.layers || [])];

// Update floor 0 — keep audio URL if it exists, or set to null (will regenerate)
layers[0] = {
  text: newFloor0,
  audio: layers[0]?.audio || null  // keep old audio for now (stale, but not silent)
};

const { error } = await s.from('cards')
  .update({ layers })
  .eq('sort_order', 1000);

if (error) {
  console.error('Update failed:', error.message);
  process.exit(1);
}
console.log('Floor 0 updated for board 1000.');
console.log('New text:', newFloor0);
