import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const { data } = await supabase.from('cards')
  .select('sort_order,title,tags,layers')
  .eq('tags->>source','publishable-review')
  .order('sort_order');

let needAudio = 0, hasAudio = 0;
for (const b of data) {
  const layers = b.layers || [];
  const anyAudio = layers.some(l => l && typeof l === 'object' && l.audio);
  const status = b.tags?.reviewStatus || 'P';
  const subj = b.tags?.subject || '?';
  const title = (b.title || '').substring(0, 58);
  console.log(`${anyAudio ? '🎧' : '🔇'} ${String(b.sort_order).padStart(4)} [${status}] ${subj.padEnd(9)} ${title}`);
  if (anyAudio) hasAudio++; else needAudio++;
}
console.log(`\n🎧 Has audio: ${hasAudio}  |  🔇 Needs audio: ${needAudio}`);
