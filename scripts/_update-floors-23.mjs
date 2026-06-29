import { createClient } from '@supabase/supabase-js';
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const newFloor2 = '<p>A unit is a fixed, standardized quantity of a physical property, used as the universal reference that everything else is measured against. When you measure something, you are simply finding the ratio of that object to this standard reference.</p>';

const newFloor3 = "<p>Before global standards existed, every region had its own units: cubits, feet, or stones. Because a 'foot' varied depending on whose foot you measured, sharing scientific discoveries or trading goods across borders was nearly impossible. To solve this, a global body called the CGPM (General Conference on Weights and Measures) established the <strong>International System of Units (SI)</strong>. Thanks to the SI, a standard meter in Delhi is exactly the same length as a standard meter in Tokyo.</p>";

const { data } = await s.from('cards').select('*').eq('sort_order', 1000).single();
const layers = [...(data.layers || [])];

layers[2] = { text: newFloor2, audio: layers[2]?.audio || null };
layers[3] = { text: newFloor3, audio: layers[3]?.audio || null };

const { error } = await s.from('cards').update({ layers }).eq('sort_order', 1000);
if (error) { console.error('Update failed:', error.message); process.exit(1); }
console.log('Floors 2 & 3 updated for board 1000.');
