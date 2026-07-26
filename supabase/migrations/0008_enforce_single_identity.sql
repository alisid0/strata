-- 0008_enforce_single_identity.sql
-- Enforce Qubix's "one sign-in provider per email" policy at the database
-- level, so it holds even if the dashboard's "Automatically link identities"
-- toggle is on or unavailable (see docs/engineering/SUPABASE-IDENTITY-LINKING.md).
--
-- PREFERRED PATH: turn OFF "Automatically link identities" in
--   Authentication → Settings on BOTH projects. That is the simple, native fix.
-- This migration is the CODE FALLBACK for when that setting can't be found or
-- you want defence-in-depth. Because it adds a trigger in the auth schema (every
-- sign-in touches auth.identities), TEST IT ON STAGING FIRST and keep the
-- rollback below to hand. Do not run straight on production.
--
-- HOW IT WORKS: when a new identity row would be attached to a user who already
-- has an identity from a *different* provider (i.e. an auto-link), the trigger
-- raises an error. Supabase surfaces that as an OAuth-callback error, which the
-- app already catches (friendlyOAuthError → the "Account found" screen).
-- First-time sign-ups (the user's only identity) are unaffected.

create or replace function auth.qubix_enforce_single_identity()
returns trigger
language plpgsql
security definer
set search_path = auth
as $$
begin
  if exists (
    select 1
    from auth.identities i
    where i.user_id = new.user_id
      and i.provider is distinct from new.provider
  ) then
    -- Message contains "already exists" so friendlyOAuthError maps it to the
    -- user-facing "log in with the method you originally used" copy.
    raise exception
      'An account already exists for this email with a different sign-in method.'
      using errcode = 'unique_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists qubix_single_identity on auth.identities;
create trigger qubix_single_identity
  before insert on auth.identities
  for each row execute function auth.qubix_enforce_single_identity();

-- ---------------------------------------------------------------------------
-- ROLLBACK (run these two lines to fully remove this policy):
--   drop trigger if exists qubix_single_identity on auth.identities;
--   drop function if exists auth.qubix_enforce_single_identity();
-- ---------------------------------------------------------------------------
