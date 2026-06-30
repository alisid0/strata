import { createClient } from '@supabase/supabase-js';
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Move card-level images to Floor 0 layer (so text + image appear together)
const boards = [1000, 1005, 1006, 1009, 1013, 1014];

for (const boardNum of boards) {
  const { data } = await s.from('cards').select('*').eq('sort_order', boardNum).single();
  if (!data) { console.log('Board ' + boardNum + ' not found'); continue; }

  const cardImgUrl = data.img_url;
  if (!cardImgUrl) { console.log('Board ' + boardNum + ' has no card img_url'); continue; }

  const layers = [...(data.layers || [])];

  // Add img to Floor 0 layer
  layers[0] = { ...layers[0], img: cardImgUrl };

  // Clear card-level img_url
  const { error } = await s.from('cards')
    .update({ layers, img_url: null })
    .eq('sort_order', boardNum);

  if (error) {
    console.error('FAIL board ' + boardNum + ': ' + error.message);
  } else {
    console.log('OK: board ' + boardNum + ' — image moved to floor 0 layer, card-level cleared');
  }
}
console.log('Done.');
