import { createClient } from '@supabase/supabase-js';
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const floors = [
  "<p>A tape measure reads length directly. But there is no 'area meter' you can lay on a floor — to get the area of a room, you measure two lengths and multiply them. Some quantities cannot simply be measured on their own; they must be built from simpler ones.</p>",
  "<p>Area is length multiplied by width — two measurements combined. Speed is distance divided by time. Density is mass divided by volume. While a modern tool like a car's speedometer might calculate the math for you instantly on a dashboard, the underlying physics always requires measuring the simple quantities first and combining them.</p>",
  '<p>In science, a <strong>derived quantity</strong> is one that is defined as a product or ratio of other fundamental quantities (like length, mass, or time).</p>',
  '<p>Most of the physics you will study involves derived quantities: area (<strong>m²</strong>), volume (<strong>m³</strong>), speed (<strong>m/s</strong>), acceleration (<strong>m/s²</strong>), density (<strong>kg/m³</strong>), and even force (<strong>kg·m/s²</strong>). Because the quantity is built by multiplying or dividing, the unit is built the exact same way. In fact, if you read the unit carefully, it hands you the formula! For example, <strong>m/s</strong> plainly tells you that speed is made of a length (meters) divided by a time (seconds).</p>'
];

const layers = floors.map(text => ({ text }));
const { error } = await s.from('cards').update({ layers }).eq('sort_order', 1002);
if (error) { console.error('Update failed:', error.message); process.exit(1); }
console.log('Board 1002 updated — 4 floors.');
