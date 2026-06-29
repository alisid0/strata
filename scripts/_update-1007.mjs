import { createClient } from '@supabase/supabase-js';
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const floors = [
  "<p>Speed is always a length divided by a time, no matter what units you use. Force is always a mass times a length divided by a time squared. If you strip away the human-made units, every physical quantity has a fixed, underlying 'recipe' of base quantities. These are its <strong>dimensions</strong>.</p>",
  "<p>Let's look at how we find this recipe for force. We know from physics that Force equals mass times acceleration (F = ma). Acceleration is velocity over time, and velocity is length over time. If we chain these facts together:</p><p>Force = mass &times; (length/time) / time = mass &times; length &times; time<sup>&minus;2</sup></p><p>In science, we write this compactly using standard symbols for the base dimensions (M for mass, L for length, T for time) to get <strong>MLT<sup>&minus;2</sup></strong>. This is called the <strong>dimensional formula</strong> of force.</p>",
  "<p>Technically, the 'dimensions' of a quantity are the powers (the exponents) to which the base quantities are raised. For force, its dimensions are exactly 1 in mass, 1 in length, and &minus;2 in time. You can write a dimensional formula for any quantity in the universe using this master template:</p><p>[Quantity] = M<sup>a</sup> L<sup>b</sup> T<sup>c</sup> I<sup>d</sup> K<sup>e</sup> mol<sup>f</sup> cd<sup>g</sup></p><p><em>(If a quantity has every exponent at zero &mdash; like a pure ratio or an angle &mdash; it is completely <strong>dimensionless</strong>).</em></p>",
  "<p><strong>The Takeaway:</strong> Dimensions are not units! Speed can be measured in m/s, km/h, or mph. The numbers will completely change depending on your unit, but its underlying dimensional recipe (LT<sup>&minus;1</sup>) will never change. Because dimensions do not depend on arbitrary units, they allow you to 'sanity-check' an equation without doing a single piece of arithmetic. The next module will show you exactly how to use this powerful tool.</p>"
];

await s.from('cards').update({ layers: floors.map(t => ({ text: t })) }).eq('sort_order', 1007);
console.log('Board 1007 updated.');
