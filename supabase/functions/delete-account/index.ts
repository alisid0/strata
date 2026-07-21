// supabase/functions/delete-account/index.ts
//
// Full account deletion for Qubix.
//
// public.delete_my_user_data() removes learning data but cannot remove the
// Supabase Auth identity — that requires the service-role key, which must never
// reach the client. This function runs server-side:
//
//   1. Verifies the caller's JWT and resolves their user id.
//   2. Requires an explicit confirmation string in the body.
//   3. Calls delete_my_user_data() as the caller (RLS still applies).
//   4. Deletes the auth.users row with the service-role admin client.
//
// Deploy:
//   supabase functions deploy delete-account --project-ref <ref>
//
// Required secrets (set per project, never committed):
//   supabase secrets set SERVICE_ROLE_KEY=<service role key> --project-ref <ref>
//
// SUPABASE_URL is injected automatically by the Edge runtime.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

// Tighten to the production origin before public launch.
const ALLOWED_ORIGINS = [
  'https://qubix.arcavetech.co.uk',
  'https://qubix-staging.vercel.app',
  'http://localhost:8000'
];

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin'
  };
}

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' }
  });
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('Origin');

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders(origin) });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405, origin);
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return json({ error: 'Missing authorization header' }, 401, origin);
  }

  // Explicit confirmation — prevents an accidental or CSRF-style call from
  // destroying an account.
  let body: { confirm?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid request body' }, 400, origin);
  }

  if (body.confirm !== 'DELETE MY ACCOUNT') {
    return json({ error: 'Confirmation phrase required' }, 400, origin);
  }

  // Caller-scoped client: RLS applies, so delete_my_user_data() can only ever
  // touch this user's rows.
  const userClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData?.user) {
    return json({ error: 'Invalid or expired session' }, 401, origin);
  }

  const userId = userData.user.id;

  // 1. Remove learning data, issue reports, screenshots, and the profile row.
  const { error: dataError } = await userClient.rpc('delete_my_user_data');
  if (dataError) {
    console.error('delete_my_user_data failed', { userId, message: dataError.message });
    return json({ error: 'Failed to delete account data' }, 500, origin);
  }

  // 2. Remove the auth identity. Service-role only.
  const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { error: authError } = await adminClient.auth.admin.deleteUser(userId);
  if (authError) {
    // Data is already gone; the identity is orphaned. Surface loudly — this
    // needs manual cleanup and the user must not be told it fully succeeded.
    console.error('auth identity deletion failed', { userId, message: authError.message });
    return json(
      { error: 'Account data was removed but the login could not be deleted. Contact support.' },
      500,
      origin
    );
  }

  return json({ ok: true }, 200, origin);
});
