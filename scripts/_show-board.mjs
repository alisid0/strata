import { createClient } from '@supabase/supabase-js';
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const n = parseInt(process.argv[2] || '1000');
const { data } = await s.from('cards').select('*').eq('sort_order', n).single();
if (!data) { console.log('Board ' + n + ' not found'); process.exit(1); }
console.log('sort_order: ' + data.sort_order);
console.log('title: ' + data.title);
console.log('tags: ' + JSON.stringify(data.tags));
console.log('---layers (' + data.layers.length + ' floors)---');
for (let i = 0; i < data.layers.length; i++) {
  const l = data.layers[i];
  let txt = '';
  if (l && typeof l === 'object') txt = l.text || '';
  else txt = l || '';
  const preview = txt.length > 400 ? txt.substring(0, 400) + '...' : txt;
  console.log('\nFloor ' + i + ': ' + preview);
}
