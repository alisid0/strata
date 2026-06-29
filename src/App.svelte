<script>
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { initAuth, isAuthenticated } from './lib/stores/auth.js';
  import { theme } from './lib/stores/theme.js';
  import { PATHS } from './lib/content/paths.js';
  import Auth from './views/Auth.svelte';
  import Onboarding from './views/Onboarding.svelte';
  import Home from './views/Home.svelte';
  import Topics from './views/Topics.svelte';
  import PathView from './views/PathView.svelte';
  import Stats from './views/Stats.svelte';
  import Map from './views/Map.svelte';
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
  let slideDirection = 1; // 1 = forward (right→left), -1 = backward (left→right)

  const TAB_VIEWS = ['home', 'topics', 'map', 'snippets'];
  const TAB_ORDER = ['home', 'topics', 'map', 'snippets'];
  const PUSH_VIEWS = ['topicDetail', 'stats', 'leaderboard', 'otherUserStats', 'reader', 'quiz', 'author'];

  // Honour reduced-motion: Svelte's fly is JS-driven, so the CSS media query
  // can't stop it — zero the distance/duration instead.
  const reduceMotion = typeof matchMedia !== 'undefined'
    && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const easeInOutQuad = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  // Incoming view: slide in from `dir`. Outgoing: slide out the opposite way.
  const flyIn = (dir = 1) => reduceMotion
    ? { duration: 0 }
    : { x: dir * 100, duration: 280, easing: easeInOutQuad };
  const flyOut = (dir = 1) => reduceMotion
    ? { duration: 0 }
    : { x: -dir * 60, duration: 200, easing: easeInOutQuad };

  onMount(async () => {
    try { await initAuth(); } catch (_) {}

    // SEO deep-link: ?path=P12 → open that topic directly
    const params = new URLSearchParams(location.search);
    const pathParam = params.get('path');
    if (pathParam && PATHS[pathParam]) {
      currentView = 'topicDetail';
      currentPathId = pathParam;
      return;
    }

    currentView = $isAuthenticated ? 'home' : 'auth';
  });

  function skipAuth() {
    currentView = 'home';
  }

  function handleAuthed(isNewUser) {
    currentView = isNewUser ? 'onboarding' : 'home';
  }

  function navigate(view, arg) {
    // Slide direction: push views slide in from the right; back-to-tab slides
    // from the left; tab→tab follows the tab order.
    if (PUSH_VIEWS.includes(view)) {
      slideDirection = 1;
    } else if (TAB_VIEWS.includes(view) && PUSH_VIEWS.includes(currentView)) {
      slideDirection = -1;
    } else if (TAB_VIEWS.includes(view) && TAB_VIEWS.includes(currentView)) {
      const fromIdx = TAB_ORDER.indexOf(currentView);
      const toIdx = TAB_ORDER.indexOf(view);
      slideDirection = toIdx > fromIdx ? 1 : -1;
    }

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
    <div class="view-layer qx-shell loading-screen" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
      <div class="loading-brand">QUBIX</div>
      <div class="loading-dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
    </div>

  {:else if currentView === 'auth'}
    <div class="view-layer scrollable-layer">
      <Auth onSkip={skipAuth} onAuthed={handleAuthed} />
    </div>

  {:else if currentView === 'onboarding'}
    <div class="view-layer">
      <Onboarding onComplete={() => currentView = 'home'} />
    </div>

  {:else if TAB_VIEWS.includes(currentView)}
    <div class="view-layer qx-shell tabbed-view" in:fly={flyIn(slideDirection)} out:fly={flyOut(slideDirection)}>
      <div class="tab-content">
        {#if currentView === 'home'}
          <Home onNavigate={navigate} />
        {:else if currentView === 'topics'}
          <Topics onNavigate={navigate} />
        {:else if currentView === 'map'}
          <Map onNavigate={navigate} />
        {:else if currentView === 'snippets'}
          <Snippets onNavigate={navigate} />
        {/if}
      </div>
      <BottomNav active={currentView} onNavigate={navigate} />
    </div>

  {:else if currentView === 'topicDetail'}
    <div class="view-layer" in:fly={flyIn(1)} out:fly={flyOut(1)}>
      <PathView pathId={currentPathId} onNavigate={navigate} />
    </div>

  {:else if currentView === 'stats'}
    <div class="view-layer" in:fly={flyIn(1)} out:fly={flyOut(1)}>
      <Stats onNavigate={navigate} />
    </div>

  {:else if currentView === 'leaderboard'}
    <div class="view-layer" in:fly={flyIn(1)} out:fly={flyOut(1)}>
      <Leaderboard onNavigate={navigate} />
    </div>

  {:else if currentView === 'otherUserStats'}
    <div class="view-layer" in:fly={flyIn(1)} out:fly={flyOut(1)}>
      <OtherUserStats userId={currentUserId} onNavigate={navigate} />
    </div>

  {:else if currentView === 'reader'}
    <div class="view-layer" in:fly={flyIn(1)} out:fly={flyOut(1)}>
      <Reader
        numbers={readerNumbers}
        startNumber={readerStart}
        onBack={() => currentPathId ? navigate('topicDetail', currentPathId) : navigate('topics')}
      />
    </div>

  {:else if currentView === 'quiz'}
    <div class="view-layer" in:fly={flyIn(1)} out:fly={flyOut(1)}>
      <Quiz
        pathId={currentPathId}
        onComplete={() => {}}
        onBack={() => navigate('topicDetail', currentPathId)}
      />
    </div>

  {:else if currentView === 'author'}
    <div class="view-layer" in:fly={flyIn(1)} out:fly={flyOut(1)}>
      <Author onNavigate={navigate} />
    </div>
  {/if}
</div>

<style>
  .app-shell { height: 100%; width: 100%; position: relative; overflow: hidden; }

  /* Every top-level screen is its own absolutely-positioned layer, so during a
     transition the outgoing and incoming views overlap and cross-slide cleanly
     instead of stacking in normal flow. */
  .view-layer { position: absolute; inset: 0; }
  .scrollable-layer { overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; }

  .loading-screen {
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px;
  }
  .loading-brand { font-size: 24px; font-weight: 900; letter-spacing: 0.16em; color: var(--qx-accent); }
  .loading-dots { display: flex; gap: 8px; }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--qx-text-faint); animation: bounce 1.4s infinite ease-in-out both; }
  .dot:nth-child(1) { animation-delay: -0.32s; }
  .dot:nth-child(2) { animation-delay: -0.16s; }
  @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

  .tabbed-view { display: flex; flex-direction: column; }
  .tab-content { flex: 1; min-height: 0; overflow-y: auto; }
</style>
