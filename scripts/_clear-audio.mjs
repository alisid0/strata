import { createClient } from '@supabase/supabase-js';
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const { data } = await s.from('cards').select('*').eq('sort_order', 1000).single();
const layers = data.layers.map(l => ({ text: typeof l === 'object' ? l.text : l }));
await s.from('cards').update({ layers }).eq('sort_order', 1000);
console.log('Cleared audio on all 4 floors of board 1000.');
