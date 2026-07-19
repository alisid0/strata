-- 0005_account_deletion.sql
-- Full self-service account deletion + user data export for Qubix.
-- Run once in the Supabase SQL editor (Dashboard -> SQL Editor), on staging
-- first, then production. Depends on 0004_secure_user_data.sql.
--
-- WHY: 0004's delete_my_user_data() removes learning rows but leaves the
-- Supabase Auth identity and the profile in place. A real "delete my account"
-- (a Play Store and UK GDPR requirement) must remove the auth.users row itself.
-- Because every public.user_* table references auth.users(id) ON DELETE
-- CASCADE, deleting that one row removes all personal data in a single step.
-- issue_reports uses ON DELETE SET NULL, so support records survive but are
-- de-linked from the person.
--
-- MECHANISM: a SECURITY DEFINER function owned by the privileged role that runs
-- this script (postgres, in the SQL editor). auth.uid() guarantees a caller can
-- only ever delete their own identity -- there is no user_id parameter to abuse.
-- This avoids needing a separate service-role Edge Function.

-- ---------------------------------------------------------------------------
-- Full account deletion
-- ---------------------------------------------------------------------------
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;
  -- Cascades every public.user_* row via ON DELETE CASCADE; anonymises
  -- issue_reports via ON DELETE SET NULL.
  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- ---------------------------------------------------------------------------
-- User data export (a downloadable copy of everything we hold for the caller)
-- ---------------------------------------------------------------------------
-- SECURITY INVOKER so it runs under the caller's RLS: each sub-select is
-- already restricted to auth.uid()'s own rows, and the explicit filters make
-- that intent obvious. Returns one JSON document.
create or replace function public.export_my_data()
returns jsonb
language sql
security invoker
set search_path = public
as $$
  select jsonb_build_object(
    'exported_at', now(),
    'user_id', auth.uid(),
    'profile', (
      select to_jsonb(p) from public.user_profiles p where p.user_id = auth.uid()
    ),
    'board_progress', coalesce(
      (select jsonb_agg(to_jsonb(t)) from public.user_board_progress t where t.user_id = auth.uid()), '[]'::jsonb
    ),
    'path_progress', coalesce(
      (select jsonb_agg(to_jsonb(t)) from public.user_path_progress t where t.user_id = auth.uid()), '[]'::jsonb
    ),
    'quiz_attempts', coalesce(
      (select jsonb_agg(to_jsonb(t)) from public.user_quiz_attempts t where t.user_id = auth.uid()), '[]'::jsonb
    ),
    'workshop_attempts', coalesce(
      (select jsonb_agg(to_jsonb(t)) from public.user_workshop_attempts t where t.user_id = auth.uid()), '[]'::jsonb
    ),
    'w_events', coalesce(
      (select jsonb_agg(to_jsonb(t)) from public.user_w_events t where t.user_id = auth.uid()), '[]'::jsonb
    ),
    'daily_activity', coalesce(
      (select jsonb_agg(to_jsonb(t)) from public.user_daily_activity t where t.user_id = auth.uid()), '[]'::jsonb
    ),
    'engagement_sessions', coalesce(
      (select jsonb_agg(to_jsonb(t)) from public.user_engagement_sessions t where t.user_id = auth.uid()), '[]'::jsonb
    ),
    'issue_reports', coalesce(
      (select jsonb_agg(to_jsonb(t)) from public.issue_reports t where t.user_id = auth.uid()), '[]'::jsonb
    )
  );
$$;

revoke all on function public.export_my_data() from public, anon;
grant execute on function public.export_my_data() to authenticated;
