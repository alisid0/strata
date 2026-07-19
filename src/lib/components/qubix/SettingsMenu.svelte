<script>
  import { theme } from '../../stores/theme.js';
  import { textSize } from '../../stores/textSize.js';
  import { displayName, logOut, exportMyData, deleteAccount } from '../../stores/auth.js';
  import { isAuthenticated } from '../../stores/auth.js';
  import IssueReportDialog from './IssueReportDialog.svelte';

  export let open = false;
  export let onClose = () => {};
  export let onNavigate = () => {};

  const SIZE_LABEL = { s: 'Small', m: 'Default', l: 'Large', xl: 'X-Large' };
  let reportOpen = false;
  let exporting = false;
  let confirmingDelete = false;
  let deleting = false;
  let dataError = '';

  async function handleLogout() {
    try { await logOut(); } catch (_) {}
    onClose();
    onNavigate('auth');
  }

  async function handleExport() {
    if (exporting) return;
    exporting = true;
    dataError = '';
    try {
      const data = await exportMyData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qubix-my-data-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      dataError = 'Could not export right now. Please try again.';
    } finally {
      exporting = false;
    }
  }

  async function handleDelete() {
    if (deleting) return;
    deleting = true;
    dataError = '';
    try {
      await deleteAccount();
      onClose();
      onNavigate('auth');
    } catch (e) {
      dataError = 'Could not delete the account. Please try again.';
      deleting = false;
      confirmingDelete = false;
    }
  }
</script>

{#if open}
  <div class="menu-overlay" on:click={onClose} role="presentation">
    <div class="sheet" on:click|stopPropagation role="dialog" aria-modal="true">
      <div class="handle"></div>
      <div class="sheet-title">Settings</div>

      <div class="group">Appearance</div>
      <div class="row">
        <span class="row-label">Theme</span>
        <button class="pill" on:click={() => theme.toggle()}>
          {$theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
      <div class="row">
        <span class="row-label">Text size</span>
        <div class="stepper">
          <button class="step" on:click={() => textSize.dec()} disabled={$textSize === 's'} aria-label="Smaller text">A−</button>
          <span class="step-val">{SIZE_LABEL[$textSize]}</span>
          <button class="step" on:click={() => textSize.inc()} disabled={$textSize === 'xl'} aria-label="Larger text">A+</button>
        </div>
      </div>

      <div class="group">Account</div>
      <div class="row">
        <span class="row-label">Signed in as</span>
        <span class="row-val">{$displayName}</span>
      </div>
      <a class="row link" href="/terms.html" target="_blank" rel="noopener">Terms and Conditions<span class="chev">›</span></a>
      <a class="row link" href="/privacy.html" target="_blank" rel="noopener">Privacy Policy<span class="chev">›</span></a>
      <button class="row link" on:click={() => reportOpen = true}>Report a problem<span class="chev">›</span></button>
      <button class="row link danger" on:click={handleLogout}>Log out</button>

      {#if $isAuthenticated}
        <div class="group">Your data</div>
        <button class="row link" on:click={handleExport} disabled={exporting}>
          {exporting ? 'Preparing…' : 'Download my data'}<span class="chev">›</span>
        </button>

        {#if !confirmingDelete}
          <button class="row link danger" on:click={() => { confirmingDelete = true; dataError = ''; }}>Delete my account</button>
        {:else}
          <div class="delete-confirm">
            <div class="delete-warn">This permanently deletes your account and all your progress. It cannot be undone.</div>
            <div class="delete-actions">
              <button class="del-cancel" on:click={() => confirmingDelete = false} disabled={deleting}>Cancel</button>
              <button class="del-go" on:click={handleDelete} disabled={deleting}>{deleting ? 'Deleting…' : 'Delete forever'}</button>
            </div>
          </div>
        {/if}
        {#if dataError}<div class="data-error">{dataError}</div>{/if}
      {/if}

      <div class="version">Qubix</div>
    </div>
  </div>
  <IssueReportDialog open={reportOpen} onClose={() => reportOpen = false} />
{/if}

<style>
  .menu-overlay {
    position: fixed; inset: 0; z-index: 200; background: rgba(20,19,16,0.5);
    display: flex; align-items: flex-end; justify-content: center;
  }
  .sheet {
    width: 100%; max-width: 480px; background: var(--qx-surface); color: var(--qx-text);
    border-top-left-radius: 20px; border-top-right-radius: 20px;
    padding: 8px 18px calc(20px + env(safe-area-inset-bottom)); box-sizing: border-box;
    box-shadow: 0 -14px 40px -18px rgba(0,0,0,0.4);
    animation: sheetUp 0.22s cubic-bezier(0.22,1,0.36,1);
  }
  @keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  .handle { width: 36px; height: 4px; border-radius: 999px; background: var(--qx-border-2); margin: 8px auto 12px; }
  .sheet-title { font-size: 17px; font-weight: 800; color: var(--qx-text); margin: 0 0 8px; }

  .group { font-size: 11px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: var(--qx-text-faint); margin: 16px 0 6px; }
  .row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 11px 0; border-bottom: 1px solid var(--qx-border); min-height: 44px;
  }
  .row:last-of-type { border-bottom: none; }
  .row-label { font-size: 15px; font-weight: 600; color: var(--qx-text); }
  .row-val { font-size: 14px; font-weight: 600; color: var(--qx-text-dim); }

  .pill {
    font-family: var(--qx-font); font-size: 13px; font-weight: 700;
    color: var(--qx-accent-text); background: var(--qx-accent-soft);
    border: 1.5px solid var(--qx-accent); border-radius: var(--qx-radius-pill);
    padding: 6px 14px; cursor: pointer;
  }

  .stepper { display: flex; align-items: center; gap: 4px; }
  .step {
    width: 40px; height: 34px; border-radius: var(--qx-radius-sm); cursor: pointer;
    border: 1.5px solid var(--qx-border-2); background: var(--qx-surface-2); color: var(--qx-text);
    font-family: var(--qx-font); font-size: 15px; font-weight: 800;
  }
  .step:disabled { opacity: 0.4; cursor: default; }
  .step-val { min-width: 74px; text-align: center; font-size: 13px; font-weight: 700; color: var(--qx-text-dim); }

  .link {
    width: 100%; text-align: left; background: none; border: none; cursor: pointer;
    font-family: var(--qx-font); font-size: 15px; font-weight: 700; color: var(--qx-text);
    text-decoration: none;
  }
  .link .chev { float: right; color: var(--qx-text-faint); font-size: 18px; }
  .link.danger { color: var(--qx-danger-text); }

  .version { text-align: center; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; color: var(--qx-text-faintest); margin-top: 18px; }

  .link:disabled { opacity: 0.5; cursor: default; }

  .delete-confirm {
    border: 1.5px solid var(--qx-danger); background: var(--qx-danger-soft);
    border-radius: var(--qx-radius-md); padding: 12px; margin: 8px 0;
  }
  .delete-warn { font-size: 13px; font-weight: 650; line-height: 1.45; color: var(--qx-danger-text); margin-bottom: 10px; }
  .delete-actions { display: flex; gap: 8px; }
  .del-cancel, .del-go {
    flex: 1; min-height: 40px; border-radius: var(--qx-radius-pill); cursor: pointer;
    font-family: var(--qx-font); font-size: 14px; font-weight: 800;
  }
  .del-cancel { border: 1.5px solid var(--qx-border-2); background: var(--qx-surface); color: var(--qx-text); }
  .del-go { border: none; background: var(--qx-danger); color: #fff; }
  .del-cancel:disabled, .del-go:disabled { opacity: 0.55; cursor: default; }
  .data-error { font-size: 12.5px; font-weight: 650; color: var(--qx-danger-text); padding: 6px 0; }
</style>
