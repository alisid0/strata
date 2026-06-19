<script>
  import { signUp, logIn, signInWithGoogle, signInWithPhone, verifyPhoneOtp, displayName } from '../lib/stores/auth.js';
  import ChalkButton from '../lib/components/ChalkButton.svelte';
  import ChalkInput from '../lib/components/ChalkInput.svelte';

  export let onSkip = () => {};

  let mode = 'welcome'; // welcome | signup | login | verify | firstrun
  let email = '', password = '', name = '', phone = '', code = '';
  let loading = false;
  let error = '';

  function showSignup() { mode = 'signup'; error = ''; }
  function showLogin() { mode = 'login'; error = ''; }
  function goBack() { mode = 'welcome'; error = ''; }

  async function handleSignUp() {
    loading = true; error = '';
    try {
      await signUp(email, password, name);
      mode = 'firstrun';
    } catch (e) {
      error = e.message;
    } finally { loading = false; }
  }

  async function handleLogin() {
    loading = true; error = '';
    try {
      await logIn(email, password);
    } catch (e) {
      error = e.message;
    } finally { loading = false; }
  }

  async function handleGoogle() {
    loading = true; error = '';
    try {
      await signInWithGoogle();
    } catch (e) {
      error = e.message;
    } finally { loading = false; }
  }

  async function handlePhone() {
    loading = true; error = '';
    try {
      await signInWithPhone(phone);
      mode = 'verify';
    } catch (e) {
      error = e.message;
    } finally { loading = false; }
  }

  async function handleVerify() {
    loading = true; error = '';
    try {
      await verifyPhoneOtp(phone, code);
      mode = 'firstrun';
    } catch (e) {
      error = e.message;
    } finally { loading = false; }
  }

  function startLearning() {
    // Emit event to parent to navigate to reader
  }
</script>

<div class="auth-container">
  <!-- WELCOME -->
  {#if mode === 'welcome'}
    <div class="auth-card">
      <div class="brand">STRATA</div>
      <div class="doodle">
        <div class="strata-line" style="width:60px"></div>
        <div class="strata-line" style="width:90px"></div>
        <div class="strata-line" style="width:50px"></div>
        <div class="strata-line" style="width:75px;border-color:var(--chalk-yellow)"></div>
        <span class="doodle-arrow">↓</span>
      </div>
      <div class="eyebrow">PHYSICS · MATHS · CHEMISTRY</div>
      <h1>Your daily <span class="accent">STEM</span> intake.</h1>
      <p class="subtext">One idea at a time, layer by layer. Swipe across, tap to descend, learn at your own pace.</p>
      <ChalkButton fullWidth on:click={showSignup}>Create my account</ChalkButton>
      <ChalkButton variant="ghost" fullWidth on:click={onSkip}>Continue as guest</ChalkButton>
      <p class="switch-text">
        Already have one? <button class="link-btn" on:click={showLogin}>Log in</button>
      </p>
    </div>

  <!-- SIGNUP -->
  {:else if mode === 'signup'}
    <div class="auth-card">
      <button class="back-btn" on:click={goBack}>‹</button>
      <div class="brand">STRATA</div>
      <h1>Create your account</h1>
      <p class="subtext">Start your learning journey.</p>

      <ChalkButton variant="secondary" fullWidth on:click={handleGoogle}>
        Continue with Google
      </ChalkButton>
      <ChalkButton variant="secondary" fullWidth on:click={handlePhone}>
        Continue with phone
      </ChalkButton>

      <div class="divider"><span>or use email</span></div>

      <ChalkInput bind:value={name} label="Your name" placeholder="Ada" />
      <ChalkInput bind:value={email} label="Email" type="email" placeholder="you@example.com" />
      <ChalkInput bind:value={password} label="Password" type="password" placeholder="••••••••" />

      {#if error}
        <p class="error">{error}</p>
      {/if}

      <ChalkButton fullWidth on:click={handleSignUp} disabled={loading}>
        {loading ? 'Creating account…' : 'Create account'}
      </ChalkButton>

      <p class="microcopy">By continuing you agree to the Terms & Privacy.</p>
      <p class="switch-text">Already have an account? <button class="link-btn" on:click={showLogin}>Log in</button></p>
    </div>

  <!-- LOGIN -->
  {:else if mode === 'login'}
    <div class="auth-card">
      <button class="back-btn" on:click={goBack}>‹</button>
      <div class="brand">STRATA</div>
      <h1>Welcome back</h1>
      <ChalkInput bind:value={email} label="Email" type="email" />
      <ChalkInput bind:value={password} label="Password" type="password" />

      {#if error}
        <p class="error">{error}</p>
      {/if}

      <ChalkButton fullWidth on:click={handleLogin} disabled={loading}>
        {loading ? 'Logging in…' : 'Log in'}
      </ChalkButton>

      <p class="switch-text">New to Strata? <button class="link-btn" on:click={showSignup}>Create an account</button></p>
    </div>

  <!-- VERIFY PHONE -->
  {:else if mode === 'verify'}
    <div class="auth-card">
      <button class="back-btn" on:click={() => mode = 'signup'}>‹</button>
      <div class="emoji">✉</div>
      <h1>Check your phone</h1>
      <p class="subtext">We sent a code to {phone}</p>
      <div class="code-inputs">
        {#each Array(6) as _, i}
          <input
            class="code-box"
            type="text"
            maxlength="1"
            inputmode="numeric"
            pattern="[0-9]"
            value={code[i] || ''}
            on:input={(e) => { const val = e.target.value.replace(/[^0-9]/g, ''); code = code.substring(0, i) + val + code.substring(i + 1); }}
          />
        {/each}
      </div>
      <p class="resend">Didn't get it? <button class="link-btn">Resend</button></p>
      <ChalkButton fullWidth on:click={handleVerify} disabled={loading}>
        {loading ? 'Verifying…' : 'Verify & continue'}
      </ChalkButton>
    </div>

  <!-- FIRST RUN -->
  {:else if mode === 'firstrun'}
    <div class="auth-card firstrun">
      <div class="eyebrow">— you're all set —</div>
      <h1>You're in{name ? `, ${name}` : ''}.</h1>
      <p class="subtext">Here's the whole game — two gestures, that's it.</p>
      <div class="gesture-row">
        <div class="gesture-icon">→</div>
        <div class="gesture-label">Swipe across — on to the next idea</div>
      </div>
      <div class="gesture-row">
        <div class="gesture-icon accent">↓</div>
        <div class="gesture-label">Dig in — deeper into this one</div>
      </div>
      <ChalkButton fullWidth on:click={onSkip}>Start the lesson</ChalkButton>
      <p class="subtext" style="margin-top:10px;font-size:12px">70 boards waiting · Act I — Things move</p>
    </div>
  {/if}
</div>

<style>
  .auth-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: var(--bg-1);
  }
  .auth-card {
    width: 100%;
    max-width: 400px;
    background: var(--board-1);
    border-radius: 6px;
    border: 12px solid var(--frame);
    box-shadow: 0 0 0 2px var(--frame-dark), 0 30px 60px -26px rgba(0,0,0,0.85), inset 0 0 70px rgba(0,0,0,0.35);
    padding: 36px 28px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .auth-card.firstrun { text-align: center; align-items: center; }
  .brand {
    font-family: var(--print);
    font-size: 13px;
    letter-spacing: 0.16em;
    color: var(--chalk-yellow);
    text-align: center;
  }
  h1 {
    font-family: var(--hand-display);
    font-weight: 400;
    font-size: clamp(30px, 6.4vw, 38px);
    line-height: 1.06;
    color: var(--chalk);
    text-shadow: 0 1px 0 rgba(0,0,0,0.25);
  }
  .accent { color: var(--chalk-yellow); border-bottom: 4px solid var(--chalk-yellow); padding-bottom: 2px; }
  .subtext {
    font-family: var(--hand);
    font-size: 16px;
    color: var(--chalk-dim);
    line-height: 1.5;
  }
  .switch-text {
    font-family: var(--print);
    font-size: 14px;
    color: var(--chalk-faint);
    text-align: center;
  }
  .link-btn {
    background: none;
    border: none;
    color: var(--chalk-yellow);
    font-family: var(--print);
    font-size: 14px;
    cursor: pointer;
    text-decoration: underline;
    text-decoration-style: dashed;
  }
  .back-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1.5px dashed var(--chalk-faint);
    background: rgba(0,0,0,0.2);
    color: var(--chalk-dim);
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: var(--print);
    font-size: 12px;
    color: var(--chalk-faint);
  }
  .divider::before, .divider::after {
    content: '';
    flex: 1;
    border-top: 1.5px dashed var(--line);
  }
  .error {
    font-family: var(--print);
    font-size: 13px;
    color: #e07a5f;
    padding: 8px 12px;
    background: rgba(224,122,95,0.12);
    border-radius: 8px;
    border: 1px dashed #e07a5f;
  }
  .microcopy {
    font-family: var(--print);
    font-size: 11px;
    color: var(--chalk-faint);
    text-align: center;
  }
  .doodle {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 10px 0;
  }
  .strata-line {
    height: 0;
    border-top: 2px dashed var(--chalk-dim);
    opacity: 0.6;
  }
  .doodle-arrow {
    color: var(--chalk-yellow);
    font-size: 20px;
  }
  .eyebrow {
    font-family: var(--print);
    font-size: 14px;
    color: var(--chalk-green);
    letter-spacing: 0.03em;
    transform: rotate(-1deg);
  }
  .code-inputs {
    display: flex;
    gap: 8px;
    justify-content: center;
  }
  .code-box {
    width: 44px;
    height: 52px;
    border-radius: 10px;
    border: 1.5px dashed var(--chalk-faint);
    background: rgba(0,0,0,0.22);
    color: var(--chalk);
    font-family: var(--print);
    font-size: 22px;
    text-align: center;
    outline: none;
  }
  .code-box:focus { border-color: var(--chalk-yellow); }
  .resend {
    font-family: var(--print);
    font-size: 13px;
    color: var(--chalk-faint);
    text-align: center;
  }
  .emoji {
    font-size: 36px;
    text-align: center;
  }
  .gesture-row {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    padding: 10px;
  }
  .gesture-icon {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border: 1.5px dashed var(--chalk-faint);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: var(--chalk-dim);
    flex-shrink: 0;
  }
  .gesture-icon.accent {
    border-color: var(--chalk-yellow);
    color: var(--chalk-yellow);
  }
  .gesture-label {
    font-family: var(--hand);
    font-size: 15px;
    color: var(--chalk-dim);
  }
</style>
