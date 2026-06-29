import { createClient } from '@supabase/supabase-js';
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const floors = [
  '<p>How long is your desk? If you lay a stick along the edge and count how many times it fits, you are measuring its length. That is all measuring a length really is: repeating a known standard until it covers the object.</p>',
  '<p>Say your stick is exactly one meter long. If it fits two times along the long edge and one time along the short edge, your desk is 2 meters long and 1 meter wide. Length and width are actually the exact same physical dimension — they are just lengths measured in perpendicular directions.</p>',
  '<p>Now, instead of a stick, imagine covering the top of the desk with flat squares that are exactly one meter on each side. If you fit two squares across and one square down, you have used two squares in total. That count is the <strong>area</strong>. Area is simply how much surface a flat shape covers, calculated by the number of unit squares that fit inside it. For a rectangle, this is length multiplied by width.</p>',
  '<p>This is exactly why area is measured in square units (like <strong>m²</strong>), rather than plain meters. You are counting physical squares, not lines! For example, a room that is 4 m by 3 m contains 12 m² of floor space.</p>',
  '<p>You can take that exact same logic one step further into the third dimension. If you fill a box by stacking 3D unit cubes instead of flat squares, you are measuring its <strong>volume</strong>, which is recorded in cubic units (like <strong>m³</strong>).</p>'
];

const layers = floors.map(text => ({ text }));

const { error } = await s.from('cards').update({ layers }).eq('sort_order', 1001);
if (error) { console.error('Update failed:', error.message); process.exit(1); }
console.log('Board 1001 updated — 5 floors.');
