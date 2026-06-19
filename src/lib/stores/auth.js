import { writable, derived } from 'svelte/store';
import { supabase } from '../supabase.js';

export const user = writable(null);
export const session = writable(null);
export const authLoading = writable(true);

// Derived: whether user is authenticated
export const isAuthenticated = derived(user, $user => $user !== null);

// Derived: user display name or fallback
export const displayName = derived(user, $user =>
  $user?.user_metadata?.display_name || $user?.email?.split('@')[0] || 'Learner'
);

/**
 * Initialize auth state from Supabase session.
 */
export async function initAuth() {
  authLoading.set(true);

  const { data: { session: currentSession } } = await supabase.auth.getSession();
  session.set(currentSession);
  user.set(currentSession?.user ?? null);

  // Listen for auth changes
  supabase.auth.onAuthStateChange((_event, newSession) => {
    session.set(newSession);
    user.set(newSession?.user ?? null);
  });

  authLoading.set(false);
}

/**
 * Sign up with email + password.
 */
export async function signUp(email, password, displayName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } }
  });
  if (error) throw error;
  return data;
}

/**
 * Log in with email + password.
 */
export async function logIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/**
 * Log out.
 */
export async function logOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  user.set(null);
  session.set(null);
}

/**
 * Sign in with Google (OAuth).
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  });
  if (error) throw error;
  return data;
}

/**
 * Sign in with phone (send OTP).
 */
export async function signInWithPhone(phone) {
  const { data, error } = await supabase.auth.signInWithOtp({ phone });
  if (error) throw error;
  return data;
}

/**
 * Verify phone OTP.
 */
export async function verifyPhoneOtp(phone, token) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms'
  });
  if (error) throw error;
  return data;
}
