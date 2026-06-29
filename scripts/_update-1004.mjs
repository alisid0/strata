import { createClient } from '@supabase/supabase-js';
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const floors = [
  '<p>Every measurement in science rests on just seven base units. From the mass of a microscopic electron to the distance of a massive quasar, every single physical quantity is expressed as some combination of these foundational building blocks.</p>',
  '<p><strong>The Seven SI Base Units:</strong></p><ul><li><strong>Length:</strong> metre (m)</li><li><strong>Mass:</strong> kilogram (kg)</li><li><strong>Time:</strong> second (s)</li><li><strong>Electric Current:</strong> ampere (A)</li><li><strong>Temperature:</strong> kelvin (K)</li><li><strong>Amount of Substance:</strong> mole (mol)</li><li><strong>Luminous Intensity:</strong> candela (cd)</li></ul><p><em>(Note: There are also two supplementary units used purely for measuring angles — the radian (rad) for 2D circles, and the steradian (sr) for 3D spheres).</em></p>',
  '<p>Here is a fascinating fact: <strong>Since 2019, none of these units are defined by physical objects.</strong> Scientists no longer rely on a metal cylinder locked in a vault in Paris to define a kilogram! Instead, all seven are defined by fixing universal physical constants. The metre is defined by the exact speed of light (299,792,458 m/s), the second by the vibrations of a caesium atom, and the kilogram by Planck\'s constant. Because they rely on the fundamental laws of the universe, anyone, anywhere, can reproduce them exactly.</p>',
  '<p>Finally, to handle the enormous scale of the universe, science uses <strong>SI prefixes</strong>. Prefixes scale up (kilo, mega, giga) or scale down (milli, micro, nano). For example, a nanometre is one-billionth of a metre. Remember this golden rule: the <strong>prefix</strong> tells you the scale, but the <strong>base unit</strong> tells you the physical quantity.</p>'
];

const layers = floors.map(text => ({ text }));
const { error } = await s.from('cards').update({ layers }).eq('sort_order', 1004);
if (error) { console.error('Update failed:', error.message); process.exit(1); }
console.log('Board 1004 updated.');
