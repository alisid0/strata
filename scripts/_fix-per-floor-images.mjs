import { createClient } from '@supabase/supabase-js';
const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Per-floor image placements (board → { floorIndex: imageUrl })
const placements = {
  1001: { floor: 2, urlKey: 'bb-1001-rectangle-grid' },
  1004: { floor: 1, urlKey: 'bb-1004-si-units' },
  1007: { floor: 1, urlKey: 'bb-1007-speed-force' },
};

for (const [boardNum, { floor, urlKey }] of Object.entries(placements)) {
  const { data } = await s.from('cards').select('*').eq('sort_order', parseInt(boardNum)).single();
  const layers = [...(data.layers || [])];
  const cardImgUrl = data.img_url || '';

  // Get public URL
  const { data: urlData } = s.storage.from('card-images').getPublicUrl(`${urlKey}.webp`);
  const imgUrl = urlData?.publicUrl || cardImgUrl;

  // Update the specific layer
  if (layers[floor]) {
    layers[floor] = { ...layers[floor], img: imgUrl };
  }

  // Clear card-level img_url so it doesn't show on Floor 0
  const { error } = await s.from('cards')
    .update({ layers, img_url: null })
    .eq('sort_order', parseInt(boardNum));

  if (error) {
    console.error(`FAIL board ${boardNum}: ${error.message}`);
  } else {
    console.log(`OK: board ${boardNum} floor ${floor} <- ${imgUrl} (card-level cleared)`);
  }
}
console.log('Done.');
