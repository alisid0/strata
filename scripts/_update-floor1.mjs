import { createClient } from '@supabase/supabase-js';
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const newFloor1 = "<p>You might say an elephant is 200 times the mass of a goat, but to find their actual physical mass, both must be measured against that exact same universal standard. Every measurement in science works this way: it is a numerical value multiplied by a unit. Just like '2 hours' literally means two times the standard unit of one hour, a mass of '5,000 kg' means 5,000 times the standard unit of one kilogram.</p>";

const { data } = await s.from('cards').select('*').eq('sort_order', 1000).single();
const layers = [...(data.layers || [])];

layers[1] = { text: newFloor1, audio: layers[1]?.audio || null };

const { error } = await s.from('cards').update({ layers }).eq('sort_order', 1000);
if (error) { console.error('Update failed:', error.message); process.exit(1); }
console.log('Floor 1 updated for board 1000.');
