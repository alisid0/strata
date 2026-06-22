<script>
  import { signUp, logIn, signInWithGoogle, signInWithPhone, verifyPhoneOtp } from '../lib/stores/auth.js';
  import { onDestroy } from 'svelte';
  import QxButton from '../lib/components/qubix/QxButton.svelte';

  export let onSkip = () => {};
  export let onAuthed = () => {}; // (isNewUser: boolean) => void

  let mode = 'welcome';
  let email = '', password = '', name = '', phone = '';
  let codeDigits = ['','','','','',''];
  let loading = false;
  let error = '';
  let resendTimer = 30;
  let interval;

  $: if (mode === 'verify') {
    if (interval) clearInterval(interval);
    if (resendTimer > 0) {
      interval = setInterval(() => { if (resendTimer > 0) resendTimer--; }, 1000);
    }
  }

  onDestroy(() => { if (interval) clearInterval(interval); });

  function showSignup() { mode = 'signup'; error = ''; }
  function showLogin() { mode = 'login'; error = ''; }
  function goBack() { mode = 'welcome'; error = ''; }

  function handleCodeInput(e, idx) {
    const val = e.target.value.replace(/[^0-9]/g, '');
    codeDigits[idx] = val.charAt(0) || '';
    codeDigits = [...codeDigits];
    if (val && idx < 5) {
      const next = document.querySelector(`.code-box[data-idx="${idx + 1}"]`);
      if (next) setTimeout(() => next.focus(), 10);
    }
    if (codeDigits.every(d => d !== '')) handleVerify();
  }

  async function handleSignUp() {
    loading = true; error = '';
    try { await signUp(email, password, name); onAuthed(true); }
    catch (e) { error = e.message; }
    finally { loading = false; }
  }

  async function handleLogin() {
    loading = true; error = '';
    try { await logIn(email, password); onAuthed(false); }
    catch (e) { error = e.message; }
    finally { loading = false; }
  }

  async function handleGoogle() {
    loading = true; error = '';
    try { await signInWithGoogle(); } // redirects away; resumes via App.svelte's onMount
    catch (e) { error = e.message; }
    finally { loading = false; }
  }

  async function handlePhone() {
    loading = true; error = '';
    try { await signInWithPhone(phone); mode = 'verify'; resendTimer = 30; }
    catch (e) { error = e.message; }
    finally { loading = false; }
  }

  async function handleVerify() {
    const c = codeDigits.join('');
    if (c.length < 6) return;
    loading = true; error = '';
    try { await verifyPhoneOtp(phone, c); onAuthed(false); }
    catch (e) { error = 'Wrong code. Try again.'; }
    finally { loading = false; }
  }

  function valid() { return email.trim() && password.trim() && (mode === 'login' || name.trim()); }
</script>

<div class="qx-shell auth-view">
  {#if mode === 'welcome'}
    <div class="screen welcome">
      <div class="logo-row">
        <span class="chip yellow">M</span>
        <span class="chip accent big">P</span>
        <span class="chip green">C</span>
      </div>
      <div class="brand">QUB<span class="acc">I</span>X</div>
      <div class="tagline">Learn in Bytes. Grow by Leaps.</div>
      <QxButton variant="primary" on:click={showSignup}>Create my account</QxButton>
      <QxButton variant="ghost" on:click={onSkip}>Continue as guest</QxButton>
      <div class="switch">Already have one? <button class="link" on:click={showLogin}>Log in</button></div>
    </div>

  {:else if mode === 'signup'}
    <div class="screen form-screen">
      <button class="back-chev" on:click={goBack}>‹</button>
      <h2>Create your account</h2>
      <p>One account keeps your boards in sync on every device.</p>
      <button class="social-btn" on:click={handleGoogle} disabled={loading}><span class="g-dot">G</span>Continue with Google</button>
      <button class="social-btn" on:click={handlePhone} disabled={loading}><span class="ph-icon">📱</span>Continue with phone</button>
      <div class="divider"><span>or use email</span></div>
      <label class="fl" for="su-name">Name</label>
      <input id="su-name" class="field" type="text" placeholder="Ada" bind:value={name} />
      <label class="fl" for="su-email">Email</label>
      <input id="su-email" class="field" type="email" placeholder="ada@qubix.app" bind:value={email} />
      <label class="fl" for="su-password">Password</label>
      <input id="su-password" class="field" type="password" placeholder="········" bind:value={password} />
      {#if error}<div class="error">{error}</div>{/if}
      <QxButton variant="primary" on:click={handleSignUp} disabled={loading || !valid()}>Create account</QxButton>
      <div class="legal">By continuing you agree to the Terms & Privacy.</div>
      <div class="switch">Already have an account? <button class="link" on:click={showLogin}>Log in</button></div>
    </div>

  {:else if mode === 'login'}
    <div class="screen form-screen">
      <button class="back-chev" on:click={goBack}>‹</button>
      <h2>Welcome back</h2>
      <p>Pick up right where you left off.</p>
      <button class="social-btn" on:click={handleGoogle} disabled={loading}><span class="g-dot">G</span>Continue with Google</button>
      <button class="social-btn" on:click={handlePhone} disabled={loading}><span class="ph-icon">📱</span>Continue with phone</button>
      <div class="divider"><span>or</span></div>
      <label class="fl" for="li-email">Email</label>
      <input id="li-email" class="field" type="email" placeholder="ada@qubix.app" bind:value={email} />
      <div class="label-row"><label class="fl" for="li-password">Password</label><button class="link small">Forgot?</button></div>
      <input id="li-password" class="field" type="password" placeholder="········" bind:value={password} />
      {#if error}<div class="error">{error}</div>{/if}
      <QxButton variant="primary" on:click={handleLogin} disabled={loading || !email.trim() || !password.trim()}>Log in</QxButton>
      <div class="switch">New here? <button class="link" on:click={showSignup}>Create an account</button></div>
    </div>

  {:else if mode === 'verify'}
    <div class="screen form-screen">
      <button class="back-chev" on:click={goBack}>‹</button>
      <div class="verify-glyph">✉</div>
      <h2>Check your phone</h2>
      <p>We sent a 6-digit code to <strong>{phone || 'your number'}</strong></p>
      <div class="code-inputs">
        {#each codeDigits as digit, i}
          <input class="code-box" data-idx={i} type="text" inputmode="numeric" maxlength="1" value={digit} on:input={(e) => handleCodeInput(e, i)} />
        {/each}
      </div>
      {#if error}<div class="error">{error}</div>{/if}
      <div class="resend">Didn't get it? {#if resendTimer > 0}Resend in <strong>0:{String(resendTimer).padStart(2,'0')}</strong>{:else}<button class="link" on:click={handlePhone}>Resend</button>{/if}</div>
      <QxButton variant="primary" on:click={handleVerify} disabled={loading || codeDigits.some(d => d === '')}>Verify &amp; continue</QxButton>
    </div>
  {/if}
</div>

<style>
  .auth-view {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
    overflow-y: auto;
  }
  .screen { display: flex; flex-direction: column; align-items: center; text-align: center; width: 100%; max-width: 320px; }

  .logo-row { display: flex; gap: 6px; margin-bottom: 14px; }
  .chip { width: 34px; height: 34px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #fff; }
  .chip.yellow { background: var(--qx-yellow); color: #5A4E0E; }
  .chip.green { background: var(--qx-green); color: #123d06; }
  .chip.accent { background: var(--qx-accent); }
  .chip.big { width: 42px; height: 42px; border-radius: 13px; font-size: 18px; }

  .brand { font-size: 23px; font-weight: 900; letter-spacing: 0.13em; color: var(--qx-text); margin-bottom: 4px; }
  .acc { color: var(--qx-accent); }
  .tagline { font-size: 13px; font-weight: 600; color: var(--qx-text-dim); margin-bottom: 26px; }

  h2 { font-weight: 800; font-size: 25px; color: var(--qx-text); margin: 8px 0 6px; letter-spacing: -0.01em; }
  p { font-size: 14px; font-weight: 400; color: var(--qx-text-dim); margin: 0 0 18px; max-width: 28ch; line-height: 1.5; }

  :global(.qx-btn) { margin-bottom: 11px; }
  .switch { font-size: 13.5px; color: var(--qx-text-dim); margin-top: 4px; }
  .link { background: none; border: none; color: var(--qx-accent); font-weight: 700; font-size: inherit; cursor: pointer; padding: 0; }
  .small { font-size: 12px; }

  .back-chev {
    position: absolute; top: 16px; left: 16px; width: 34px; height: 34px;
    border-radius: 50%; border: 1.5px solid var(--qx-border-2); background: var(--qx-surface);
    color: var(--qx-text-dim); font-size: 19px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }
  .form-screen { position: relative; padding-top: 14px; }

  .social-btn {
    width: 100%; padding: 13px; border-radius: var(--qx-radius-md); border: 1.5px solid var(--qx-border-2);
    background: var(--qx-surface); color: var(--qx-text); font-family: var(--qx-font); font-size: 15px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 9px; min-height: 48px;
  }
  .social-btn:disabled { opacity: 0.5; }
  .g-dot { width: 22px; height: 22px; border-radius: 50%; background: var(--qx-surface-2); color: #4E97BE; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; }
  .ph-icon { font-size: 18px; }

  .divider { display: flex; align-items: center; gap: 12px; width: 100%; margin: 12px 0; }
  .divider::before, .divider::after { content: ''; flex: 1; border-top: 1px solid var(--qx-border); }
  .divider span { font-size: 12px; font-weight: 700; color: var(--qx-text-faint); }

  .fl { font-size: 12px; font-weight: 700; color: var(--qx-text-dim); align-self: flex-start; margin-bottom: 6px; }
  .label-row { display: flex; justify-content: space-between; align-items: center; width: 100%; }
  .field {
    width: 100%; padding: 0 14px; height: 46px; border-radius: var(--qx-radius-md); border: 1.5px solid var(--qx-border-2);
    background: var(--qx-surface); color: var(--qx-text); font-family: var(--qx-font); font-size: 14px; outline: none;
    box-sizing: border-box; margin-bottom: 14px;
  }
  .field:focus { border-color: var(--qx-accent); box-shadow: 0 0 0 3px var(--qx-accent-soft); }
  .error { font-size: 12px; color: #e0574d; margin-bottom: 8px; }
  .legal { font-size: 11px; color: var(--qx-text-faint); margin: 8px 0 12px; max-width: 28ch; }

  .verify-glyph { font-size: 36px; margin-bottom: 10px; }
  .code-inputs { display: flex; gap: 8px; margin-bottom: 14px; }
  .code-box {
    width: 40px; height: 50px; border-radius: var(--qx-radius-md); border: 1.5px solid var(--qx-border-2);
    background: var(--qx-surface); color: var(--qx-text); font-size: 22px; text-align: center; outline: none;
  }
  .code-box:focus { border-color: var(--qx-accent); }
  .resend { font-size: 13px; color: var(--qx-text-faint); margin-bottom: 16px; }
</style>
