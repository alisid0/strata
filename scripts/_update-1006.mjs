import { createClient } from '@supabase/supabase-js';
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const floors = [
  "<p>Measure your height in metres, feet, or inches. You get three different numbers and three different units, but they are all measuring the exact same thing: a length. That underlying 'thing' is the <strong>dimension</strong>.</p>",
  '<p>Think of it this way: 5 feet, 1.5 metres, and 60 inches are the exact same physical height written three different ways. Change the unit and the number changes, but the measurement is always a length. A stopwatch can read seconds, minutes, or hours — different units, but they all share the dimension of time.</p>',
  '<p><strong>The Core Difference:</strong></p><ul><li><strong>Dimension:</strong> The fundamental <em>type</em> of physical quantity you are dealing with (like length, mass, or time), completely independent of how you measure it.</li><li><strong>Unit:</strong> A specific, universally agreed-upon amount of that dimension.</li></ul><p>If the dimension is the <em>type</em> of measurement, the unit is the <em>size of the step</em> you are counting in!</p>',
  "<p><strong>Why This Matters:</strong> Units are a human invention; dimensions are a fundamental truth of the universe. If you swap metres for feet, all your numbers shift, but the underlying dimensions stay exactly the same. Because dimensions ignore our human units, any physical quantity can be written as a pure combination of base dimensions (length, mass, and time). This creates a powerful 'recipe' that lets you check complex equations across any unit system — a trick the next module will turn into a mathematical tool.</p>",
  '<p><strong>Two Mind-Bending Exceptions:</strong></p><ol><li><strong>Units without Dimensions:</strong> The radian is a genuine, highly useful unit for measuring angles. Yet, it has absolutely no dimension! Because an angle is calculated by dividing one length by another length, the dimensions cancel out entirely.</li><li><strong>Shared Dimensions:</strong> The quirk runs the other way, too. Torque and energy share the exact same dimensional recipe (<strong>mass × length² / time²</strong>), yet they describe completely different physical concepts.</li></ol>'
];

await s.from('cards').update({ layers: floors.map(t => ({ text: t })) }).eq('sort_order', 1006);
console.log('Board 1006 updated.');
