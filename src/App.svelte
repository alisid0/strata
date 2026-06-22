<script>
  import { onMount } from 'svelte';
  import { initAuth, isAuthenticated } from './lib/stores/auth.js';
  import { theme } from './lib/stores/theme.js'; // side-effect: sets document.documentElement.dataset.qxTheme
  import Auth from './views/Auth.svelte';
  import Onboarding from './views/Onboarding.svelte';
  import Home from './views/Home.svelte';
  import Topics from './views/Topics.svelte';
  import PathView from './views/PathView.svelte';
  import Stats from './views/Stats.svelte';
  import Leaderboard from './views/Leaderboard.svelte';
  import OtherUserStats from './views/OtherUserStats.svelte';
  import Snippets from './views/Snippets.svelte';
  import Reader from './views/Reader.svelte';
  import Quiz from './views/Quiz.svelte';
  import Author from './views/Author.svelte';
  import BottomNav from './lib/components/qubix/BottomNav.svelte';

  // loading | auth | onboarding | home | topics | topicDetail | stats | leaderboard | otherUserStats | snippets | reader | quiz | author
  let currentView = 'loading';
  let currentPathId = '';
  let currentUserId = '';
  let readerNumbers = [];
  let readerStart = 1;

  const TAB_VIEWS = ['home', 'topics', 'stats', 'snippets'];

  onMount(async () => {
    try { await initAuth(); } catch (_) {}
    currentView = $isAuthenticated ? 'home' : 'auth';
  });

  function skipAuth() {
    currentView = 'home';
  }

  function handleAuthed(isNewUser) {
    currentView = isNewUser ? 'onboarding' : 'home';
  }

  function navigate(view, arg) {
    if (view === 'topicDetail') { currentPathId = arg; currentView = 'topicDetail'; }
    else if (view === 'otherUserStats') { currentUserId = arg || ''; currentView = 'otherUserStats'; }
    else if (view === 'reader') {
      readerNumbers = arg?.numbers || Array.from({ length: 84 }, (_, i) => i + 1);
      readerStart = arg?.start || readerNumbers[0] || 1;
      currentView = 'reader';
    }
    else if (view === 'quiz') { currentPathId = arg; currentView = 'quiz'; }
    else if (view === 'author') { currentView = 'author'; }
    else { currentView = view; }
  }
</script>

<div class="app-shell">
  {#if currentView === 'loading'}
    <div class="qx-shell loading-screen">
      <div class="loading-brand">QUBIX</div>
      <div class="loading-dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
    </div>

  {:else if currentView === 'auth'}
    <Auth onSkip={skipAuth} onAuthed={handleAuthed} />

  {:else if currentView === 'onboarding'}
    <Onboarding onComplete={() => currentView = 'home'} />

  {:else if TAB_VIEWS.includes(currentView)}
    <div class="qx-shell tabbed-view">
      <div class="tab-content">
        {#if currentView === 'home'}
          <Home onNavigate={navigate} />
        {:else if currentView === 'topics'}
          <Topics onNavigate={navigate} />
        {:else if currentView === 'stats'}
          <Stats onNavigate={navigate} />
        {:else if currentView === 'snippets'}
          <Snippets onNavigate={navigate} />
        {/if}
      </div>
      <BottomNav active={currentView} onNavigate={navigate} />
    </div>

  {:else if currentView === 'topicDetail'}
    <PathView pathId={currentPathId} onNavigate={navigate} />

  {:else if currentView === 'leaderboard'}
    <Leaderboard onNavigate={navigate} />

  {:else if currentView === 'otherUserStats'}
    <OtherUserStats userId={currentUserId} onNavigate={navigate} />

  {:else if currentView === 'reader'}
    <Reader numbers={readerNumbers} startNumber={readerStart} />
    <nav class="reader-nav">
      <button on:click={() => navigate('home')} class="nav-btn">Home</button>
      <button on:click={() => navigate('topics')} class="nav-btn">Topics</button>
      <button on:click={() => navigate('author')} class="nav-btn">Author</button>
    </nav>

  {:else if currentView === 'quiz'}
    <Quiz
      pathId={currentPathId}
      onComplete={() => {}}
      onBack={() => navigate('topicDetail', currentPathId)}
    />

  {:else if currentView === 'author'}
    <Author onNavigate={navigate} />
  {/if}
</div>

<style>
  .app-shell { height: 100%; width: 100%; position: relative; }

  .loading-screen {
    height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px;
  }
  .loading-brand { font-size: 24px; font-weight: 900; letter-spacing: 0.16em; color: var(--qx-accent); }
  .loading-dots { display: flex; gap: 8px; }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--qx-text-faint); animation: bounce 1.4s infinite ease-in-out both; }
  .dot:nth-child(1) { animation-delay: -0.32s; }
  .dot:nth-child(2) { animation-delay: -0.16s; }
  @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

  .tabbed-view { height: 100%; display: flex; flex-direction: column; }
  .tab-content { flex: 1; min-height: 0; overflow-y: auto; }

  .reader-nav {
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 20;
    display: flex; background: var(--board-1); border-top: 2px dashed var(--line);
    padding: 10px 0; box-shadow: 0 -2px 8px rgba(0,0,0,0.4);
  }
  .nav-btn {
    flex: 1; background: none; border: none; color: var(--chalk-faint);
    font-family: var(--print); font-size: 13px; cursor: pointer; padding: 6px 0; transition: color 0.2s;
  }
  .nav-btn:active { color: var(--chalk-yellow); }
</style>
