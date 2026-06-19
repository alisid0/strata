import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xzesbcrlnbesmvxmgotp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6ZXNiY3JsbmJlc212eG1nb3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NTgzMzAsImV4cCI6MjA5NzEzNDMzMH0.MrJf5O9m1Q7jAUv2vc59XVd4MiRFhwfesQsXDZ-2qUo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

/**
 * Fetch cards from Supabase, with localStorage fallback.
 */
export async function fetchCards() {
  const KEY = 'strata-cards-v2';
  try {
    const cached = localStorage.getItem(KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.length > 0) return parsed;
    }
  } catch (_) {}

  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;

  if (data && data.length > 0) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (_) {}
  }

  return data || [];
}

/**
 * Fetch user progress for a specific path.
 */
export async function fetchProgress(userId, pathId) {
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .eq('path_id', pathId);

  if (error) throw error;
  return data || [];
}

/**
 * Record a board open event.
 */
export async function recordBoardProgress(userId, cardId, layerReached = 0) {
  const { data, error } = await supabase
    .from('progress')
    .upsert({
      user_id: userId,
      card_id: cardId,
      state: 'visited',
      layer_reached: layerReached,
      last_seen: new Date().toISOString()
    }, { onConflict: 'user_id,card_id' });

  if (error) throw error;
  return data;
}

/**
 * Record a quiz result.
 */
export async function recordQuizResult(userId, pathId, score, total) {
  const { data, error } = await supabase
    .from('quiz_results')
    .upsert({
      user_id: userId,
      path_id: pathId,
      score,
      total,
      completed_at: new Date().toISOString()
    });

  if (error) throw error;
  return data;
}
