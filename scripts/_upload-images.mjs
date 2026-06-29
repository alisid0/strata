import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC_IMAGES = join(ROOT, 'public', 'images');

const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const mapping = [
  { file: 'bb-1000-elephant-goat.webp', board: 1000 },
  { file: 'bb-1001-rectangle-grid.webp', board: 1001 },
  { file: 'bb-1004-si-units.webp', board: 1004 },
  { file: 'bb-1005-quasar.webp', board: 1005 },
  { file: 'bb-1006-height-units.webp', board: 1006 },
  { file: 'bb-1007-speed-force.webp', board: 1007 },
  { file: 'bb-1009-pendulum.webp', board: 1009 },
  { file: 'bb-1013-electron-galaxy.webp', board: 1013 },
  { file: 'bb-1014-particles-galaxies.webp', board: 1014 },
];

for (const { file, board } of mapping) {
  const filePath = join(PUBLIC_IMAGES, file);
  if (!existsSync(filePath)) {
    console.log(`SKIP: ${file} not found`);
    continue;
  }

  const buf = readFileSync(filePath);

  // Upload to Supabase Storage
  const { error: uploadErr } = await s.storage
    .from('card-images')
    .upload(file, buf, { contentType: 'image/webp', upsert: true });

  if (uploadErr) {
    console.error(`UPLOAD FAIL ${file}: ${uploadErr.message}`);
    continue;
  }

  // Get public URL
  const { data: urlData } = s.storage.from('card-images').getPublicUrl(file);
  const url = urlData?.publicUrl || '';

  // Update board's img_url
  const { error: updErr } = await s.from('cards')
    .update({ img_url: url })
    .eq('sort_order', board);

  if (updErr) {
    console.error(`UPDATE FAIL board ${board}: ${updErr.message}`);
  } else {
    console.log(`OK: board ${board} <- ${url}`);
  }
}
console.log('Done.');
