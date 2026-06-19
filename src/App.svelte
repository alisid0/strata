<script>
  import { onMount } from 'svelte';
  import { initAuth, isAuthenticated } from './lib/stores/auth.js';
  import Auth from './views/Auth.svelte';
  import Subjects from './views/Subjects.svelte';
  import SubjectView from './views/SubjectView.svelte';
  import PathView from './views/PathView.svelte';
  import Reader from './views/Reader.svelte';
  import Quiz from './views/Quiz.svelte';

  let currentView = 'loading'; // loading | auth | subjects | subject | path | reader | quiz
  let currentSubject = '';
  let currentPathId = '';
  let currentCard = 0;

  onMount(async () => {
    // Try to restore session, but allow guest access
    try {
      await initAuth();
    } catch (_) {}
    currentView = $isAuthenticated ? 'subjects' : 'auth';
  });

  function skipAuth() {
    currentView = 'subjects';
  }

  function navigate(view, arg) {
    if (view === 'subject') { currentSubject = arg; currentView = 'subject'; }
    else if (view === 'path') { currentPathId = arg; currentView = 'path'; }
    else if (view === 'reader') { currentCard = arg || 0; currentView = 'reader'; }
    else if (view === 'quiz') { currentPathId = arg; currentView = 'quiz'; }
    else { currentView = view; }
  }
</script>

<div class="app-shell">
  {#if currentView === 'loading'}
    <div class="loading-screen">
      <div class="loading-brand">STRATA</div>
      <div class="loading-dots">
        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
      </div>
    </div>

  {:else if currentView === 'auth'}
    <Auth onSkip={skipAuth} />

  {:else if currentView === 'subjects'}
    <Subjects onNavigate={navigate} />

  {:else if currentView === 'subject'}
    <SubjectView subject={currentSubject} onNavigate={navigate} />

  {:else if currentView === 'path'}
    <PathView pathId={currentPathId} onNavigate={navigate} />

  {:else if currentView === 'reader'}
    <Reader startCard={currentCard} />
    <!-- Bottom bar when in reader -->
    <nav class="reader-nav">
      <button on:click={() => navigate('subjects')} class="nav-btn">Subjects</button>
      <button on:click={() => navigate('subjects')} class="nav-btn">Map</button>
      <button on:click={() => navigate('reader', currentCard)} class="nav-btn">Reader</button>
    </nav>

  {:else if currentView === 'quiz'}
    <Quiz
      pathId={currentPathId}
      onComplete={() => {}}
      onBack={() => navigate('path', currentPathId)}
    />
  {/if}
</div>

<style>
  .app-shell {
    height: 100%;
    width: 100%;
    position: relative;
  }

  .loading-screen {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--board-1);
    gap: 20px;
  }
  .loading-brand {
    font-family: var(--print);
    font-size: 24px;
    letter-spacing: 0.16em;
    color: var(--chalk-yellow);
  }
  .loading-dots {
    display: flex;
    gap: 8px;
  }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--chalk-dim);
    animation: bounce 1.4s infinite ease-in-out both;
  }
  .dot:nth-child(1) { animation-delay: -0.32s; }
  .dot:nth-child(2) { animation-delay: -0.16s; }
  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }

  .reader-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 20;
    display: flex;
    background: var(--board-1);
    border-top: 2px dashed var(--line);
    padding: 10px 0;
    box-shadow: 0 -2px 8px rgba(0,0,0,0.4);
  }
  .nav-btn {
    flex: 1;
    background: none;
    border: none;
    color: var(--chalk-faint);
    font-family: var(--print);
    font-size: 13px;
    cursor: pointer;
    padding: 6px 0;
    transition: color 0.2s;
  }
  .nav-btn:active { color: var(--chalk-yellow); }
</style>
