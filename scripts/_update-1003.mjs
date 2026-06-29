import { createClient } from '@supabase/supabase-js';
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const floors = [
  '<p>If area comes from length, and speed comes from length and time, what do length and time themselves come from? Nothing simpler. They are the foundational building blocks of physics — measured directly and used to construct everything else.</p>',
  '<p>You can build complex quantities like area, speed, density, and force from just three everyday properties: length, mass, and time. None of these three can be derived from the others; there is no mathematical way to get a length by combining a mass and a time. They sit at the very bottom of the measurement ladder.</p>',
  '<p>In science, these are called <strong>fundamental quantities</strong> (or <strong>base quantities</strong>). They are a small, exclusive set of mutually independent properties, each measured against its own standard. Every other measurement in the universe is derived from them.</p>',
  "<p>Interestingly, which quantities count as 'base' is partly just a convention. You <em>could</em> theoretically choose speed and time as your starting blocks and derive length from them! However, to keep measurements perfectly consistent worldwide, the scientific community agreed on one universal standard. The SI system uses exactly seven base quantities, which the next module lays out.</p>"
];

const layers = floors.map(text => ({ text }));
const { error } = await s.from('cards').update({ layers }).eq('sort_order', 1003);
if (error) { console.error('Update failed:', error.message); process.exit(1); }
console.log('Board 1003 updated.');
