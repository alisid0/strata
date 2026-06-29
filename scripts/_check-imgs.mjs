import { createClient } from '@supabase/supabase-js';
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const { data } = await s.from('cards').select('sort_order,layers,img_url').in('sort_order', [1001,1004,1007]).order('sort_order');
for (const r of data) {
  console.log('Board ' + r.sort_order + ' card_img_url: ' + (r.img_url || 'none'));
  for (let i = 0; i < r.layers.length; i++) {
    const l = r.layers[i];
    const hasImg = (l && l.img) ? 'HAS IMG' : 'text only';
    console.log('  Floor ' + i + ': ' + hasImg);
  }
}
