# Disable Automatic Identity Linking in Supabase

**Date:** 2026-07-22  
**App:** Qubix (Production + Staging)  
**Why:** Qubix enforces one identity provider per email. Google-signed-up accounts stay Google-only. Password accounts stay password-only. Supabase must not silently link them.

---

## What you're doing

Turning off Supabase's default behaviour of automatically linking multiple sign-in methods (Google, email/password, etc.) to the same account when they share an email address.

With auto-linking OFF:
- A user who signed up with Google cannot sign in with email/password (they get a clear redirect message).
- A user who signed up with email/password cannot sign in with Google (they get a clear redirect message).

---

## Step-by-step

### Production

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select the project: **Qubix Production** (ref `wmetdmfsniqrshuaoodc`, London)
3. In the left sidebar, click **Authentication**
4. Click the **Settings** tab (not Providers, not Users)
5. Scroll down to the section labelled **"Identity Linking"** or **"Link Identities"**
6. Find the toggle/checkbox labelled:
   - **"Automatically link identities"** or
   - **"Allow automatic linking"** or
   - **"Automatically link accounts with the same email"**
7. **Turn it OFF** (uncheck / toggle to disabled)
8. Scroll to the bottom and click **Save**

### Staging

Repeat steps 1–8 for **Qubix Staging** (ref `atmmfkhjsdqqwnhqifxm`).

---

## How to verify it worked

1. Open the app at [https://strata-nine-pi.vercel.app](https://strata-nine-pi.vercel.app)
2. Sign up a test account using email/password (e.g. `test-identity@example.com`)
3. Sign out
4. Click "Continue with Google" using the same email address
5. **Expected:** You should see an error screen saying:
   > "An account already exists with this email. Please log in with your password."
6. Reverse test: sign up with Google, sign out, try email/password sign-up with the same email
7. **Expected:** You should see:
   > "An account already exists for this email. If you originally signed up with Google, tap 'Continue with Google' below."

---

## If you can't find the setting

Supabase's dashboard UI changes occasionally. If the exact wording above doesn't match:

- Look for any toggle about "linking", "identity linking", or "account merging" in Authentication → Settings
- If the setting doesn't exist at all, Supabase may have changed the default. Check Authentication → Providers → Google for a "Skip linking" or "Prevent linking" option
- As a fallback, you can use a Database Hook (Postgres trigger on `auth.identities`) — ask for this if needed

---

## Rollback

If this causes problems (e.g. legitimate users locked out), just toggle it back ON and click Save. The app's error messages will still show, but accounts will silently link again.
