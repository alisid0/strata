<script>
  import { signUp, logIn, signInWithGoogle, signInWithPhone, verifyPhoneOtp } from '../lib/stores/auth.js';
  import { onDestroy } from 'svelte';
  import QxButton from '../lib/components/qubix/QxButton.svelte';

  export let onSkip = () => {};
  export let onChoose = (gateway) => {}; // 'line' | 'atom' | 'bit' | 'unit'
  export let onAuthed = () => {}; // (isNewUser: boolean) => void

  let mode = 'welcome';
  let authTab = 'login'; // login | signup
  let email = '', password = '', name = '', phone = '';
  let codeDigits = ['','','','','',''];
  let loading = false;
  let error = '';
  let resendTimer = 30;
  let interval;
  let showPassword = false;

  $: if (mode === 'verify') {
    if (interval) clearInterval(interval);
    if (resendTimer > 0) {
      interval = setInterval(() => { if (resendTimer > 0) resendTimer--; }, 1000);
    }
  }

  onDestroy(() => { if (interval) clearInterval(interval); });

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
    try { await signInWithGoogle(); }
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

  function valid() { return email.trim() && password.trim() && (authTab === 'login' || name.trim()); }
</script>

<div class="qx-shell auth-view">
  {#if mode === 'welcome'}
    <div class="screen welcome">
      <div class="brand">QUB<span class="acc">I</span>X</div>
      <div class="tagline">Learn in Bytes. Grow by Leaps.</div>

      <div class="path-prompt">Where would you like to start?</div>

      <div class="gateways">
        <button class="gateway line" on:click={() => onChoose('line')}>
          <span class="gw-icon">📏</span>
          <span class="gw-title">The Line</span>
          <span class="gw-sub">Space &amp; abstraction</span>
        </button>
        <button class="gateway atom" on:click={() => onChoose('atom')}>
          <span class="gw-icon">⚛️</span>
          <span class="gw-title">The Atom</span>
          <span class="gw-sub">Matter &amp; charge</span>
        </button>
        <button class="gateway bit" on:click={() => onChoose('bit')}>
          <span class="gw-icon">◉</span>
          <span class="gw-title">The Bit</span>
          <span class="gw-sub">Information &amp; logic</span>
        </button>
        <button class="gateway unit" on:click={() => onChoose('unit')}>
          <span class="gw-icon">⚖️</span>
          <span class="gw-title">The Unit</span>
          <span class="gw-sub">Measurement &amp; scale</span>
        </button>
      </div>

      <button class="link has-account" on:click={() => { mode = 'login'; error = ''; }}>
        Already have an account? <strong>Log in</strong>
      </button>
      <button class="link skip-link" on:click={onSkip}>Continue as guest</button>
    </div>

  {:else if mode === 'login'}
    <div class="screen form-screen">
      <button class="back-chev" on:click={() => { mode = 'welcome'; error = ''; }}>‹</button>
      <div class="brand small">QUB<span class="acc">I</span>X</div>

      <div class="tab-row">
        <button class="tab" class:active={authTab === 'login'} on:click={() => { authTab = 'login'; error = ''; }}>Log in</button>
        <button class="tab" class:active={authTab === 'signup'} on:click={() => { authTab = 'signup'; error = ''; }}>Sign up</button>
      </div>

      {#if authTab === 'signup'}
        <label class="fl" for="su-name">Name</label>
        <input id="su-name" class="field" type="text" placeholder="Ada" bind:value={name} />
      {/if}

      <label class="fl" for="auth-email">{authTab === 'signup' ? 'Email' : 'Email or phone'}</label>
      <input id="auth-email" class="field" type="email" placeholder="ada@qubix.app" bind:value={email} />

      <label class="fl" for="auth-pw">Password</label>
      <div class="pw-row">
        {#if showPassword}
          <input id="auth-pw" class="field" type="text" placeholder="········" bind:value={password} />
        {:else}
          <input id="auth-pw" class="field" type="password" placeholder="········" bind:value={password} />
        {/if}
        <button class="show-btn" on:click={() => showPassword = !showPassword} type="button">{showPassword ? 'Hide' : 'Show'}</button>
      </div>

      {#if authTab === 'login'}
        <button class="link forgot" on:click={() => {}}>Forgot password?</button>
      {/if}

      {#if error}<div class="error">{error}</div>{/if}

      {#if authTab === 'login'}
        <QxButton variant="primary" on:click={handleLogin} disabled={loading || !email.trim() || !password.trim()}>Log in</QxButton>
      {:else}
        <QxButton variant="primary" on:click={handleSignUp} disabled={loading || !valid()}>Create account</QxButton>
      {/if}

      <div class="divider"><span>or</span></div>

      <button class="social-btn google-btn" on:click={handleGoogle} disabled={loading}>
        <span class="g-dot">G</span>Continue with Google
      </button>

      <button class="link skip-link" on:click={onSkip}>Continue as guest</button>
      <div class="legal-note">By continuing you agree to our <a href="/privacy.html" target="_blank" rel="noopener">Privacy Policy</a>.</div>
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
    padding: 20px;
    box-sizing: border-box;
  }
  .screen { display: flex; flex-direction: column; align-items: center; text-align: center; width: 100%; max-width: 320px; margin: auto 0; }

  .gateways {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: 100%; margin-bottom: 28px;
  }
  .gateway {
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    padding: 22px 12px; border-radius: 16px; border: 2px solid var(--qx-border-2);
    background: var(--qx-surface); cursor: pointer;
    transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
  }
  .gateway:hover {
    border-color: var(--qx-accent); transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(69,74,222,0.12);
  }
  .gateway.line:hover { border-color: #D28A5E; box-shadow: 0 6px 20px rgba(210,138,94,0.15); }
  .gateway.atom:hover { border-color: var(--qx-accent); }
  .gateway.bit:hover { border-color: var(--qx-pink); box-shadow: 0 6px 20px rgba(236,72,153,0.12); }
  .gateway.unit:hover { border-color: var(--qx-green); box-shadow: 0 6px 20px rgba(22,163,74,0.12); }
  .gw-icon { font-size: 32px; line-height: 1; }
  .gw-title { font-size: 15px; font-weight: 800; color: var(--qx-text); }
  .gw-sub { font-size: 11px; font-weight: 600; color: var(--qx-text-faint); }

  .path-prompt {
    font-size: 16px; font-weight: 700; color: var(--qx-text-dim);
    margin-bottom: 16px;
  }

  .has-account {
    margin-top: 8px; font-size: 13px; color: var(--qx-text-dim);
  }
  .has-account strong { color: var(--qx-accent); }

  .brand { font-size: 23px; font-weight: 900; letter-spacing: 0.13em; color: var(--qx-text); margin-bottom: 4px; }
  .brand.small { font-size: 18px; margin-bottom: 20px; }
  .acc { color: var(--qx-accent); }
  .tagline { font-size: 13px; font-weight: 600; color: var(--qx-text-dim); margin-bottom: 28px; }

  /* Tab toggle */
  .tab-row {
    display: flex; width: 100%; background: var(--qx-surface); border-radius: var(--qx-radius-md);
    border: 1.5px solid var(--qx-border-2); margin-bottom: 18px; padding: 3px;
  }
  .tab {
    flex: 1; padding: 10px; border-radius: 11px; border: none; background: transparent;
    font-family: var(--qx-font); font-size: 15px; font-weight: 700; color: var(--qx-text-dim); cursor: pointer;
    transition: all 0.15s;
  }
  .tab.active { background: var(--qx-accent); color: #fff; }

  .fl { align-self: flex-start; font-size: 12px; font-weight: 700; color: var(--qx-text-dim); text-transform: uppercase; letter-spacing: 0.04em; margin: 10px 0 5px 4px; }
  .field {
    width: 100%; padding: 13px 14px; border-radius: var(--qx-radius-sm); border: 1.5px solid var(--qx-border-2);
    background: var(--qx-surface); color: var(--qx-text); font-family: var(--qx-font); font-size: 15px;
    box-sizing: border-box; margin-bottom: 10px; transition: border 0.15s;
  }
  .field:focus { outline: none; border-color: var(--qx-accent); }

  .pw-row { position: relative; width: 100%; }
  .pw-row .field { padding-right: 56px; }
  .show-btn {
    position: absolute; right: 10px; top: 50%; transform: translateY(-70%);
    border: none; background: none; color: var(--qx-text-dim); font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: var(--qx-font);
  }
  .forgot { align-self: flex-end; margin: -6px 6px 4px 0; font-size: 13px; }
  .link { background: none; border: none; color: var(--qx-accent); font-weight: 700; font-size: inherit; cursor: pointer; padding: 0; }

  .error { font-size: 13px; font-weight: 600; color: var(--qx-pink); margin: 8px 0; }

  .divider {
    display: flex; align-items: center; gap: 12px; width: 100%; margin: 18px 0; color: var(--qx-text-faint);
    font-size: 13px; font-weight: 600;
  }
  .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--qx-border-2); }

  .social-btn {
    width: 100%; padding: 13px; border-radius: var(--qx-radius-md); border: 1.5px solid var(--qx-border-2);
    background: var(--qx-surface); color: var(--qx-text); font-family: var(--qx-font); font-size: 15px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 48px;
  }
  .social-btn:disabled { opacity: 0.5; }
  .google-btn { background: #fff; color: #1a1a1a; }
  .g-dot { width: 22px; height: 22px; border-radius: 50%; background: #EEF1F5; color: #4E97BE; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; }

  .skip-link { margin-top: 16px; font-size: 14px; color: var(--qx-text-dim); }
  .legal-note { margin-top: 14px; font-size: 11.5px; color: var(--qx-text-faint); text-align: center; }
  .legal-note a { color: var(--qx-text-dim); text-decoration: underline; }

  h2 { font-weight: 800; font-size: 25px; color: var(--qx-text); margin: 8px 0 6px; letter-spacing: -0.01em; }
  p { font-size: 14px; font-weight: 400; color: var(--qx-text-dim); margin: 0 0 18px; max-width: 28ch; line-height: 1.5; }

  .back-chev {
    position: absolute; top: 16px; left: 16px; width: 34px; height: 34px;
    border-radius: 50%; border: 1.5px solid var(--qx-border-2); background: var(--qx-surface);
    color: var(--qx-text-dim); font-size: 19px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }
  .form-screen { position: relative; padding-top: 14px; }
  .verify-glyph { font-size: 36px; margin-bottom: 10px; }

  .code-inputs { display: flex; gap: 8px; margin-bottom: 14px; }
  .code-box {
    width: 40px; height: 50px; border-radius: var(--qx-radius-md); border: 1.5px solid var(--qx-border-2);
    background: var(--qx-surface); color: var(--qx-text); font-size: 22px; text-align: center; outline: none;
  }
  .code-box:focus { border-color: var(--qx-accent); }
  .resend { font-size: 13px; color: var(--qx-text-faint); margin-bottom: 16px; }
</style>
