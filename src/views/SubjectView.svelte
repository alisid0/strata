<script>
  import { PATHS, SUBJECT_PATHS, SUBJECT_LABELS } from '../lib/content/paths.js';
  import { progress } from '../lib/stores/progress.js';
  import SubjectMark from '../lib/components/SubjectMark.svelte';
  import ChalkButton from '../lib/components/ChalkButton.svelte';

  export let subject = 'physics';
  export let onNavigate;

  $: pathIds = SUBJECT_PATHS[subject] || [];
  $: label = SUBJECT_LABELS[subject] || subject;
  $: pathData = pathIds.map(pid => {
    const manifest = PATHS[pid];
    const st = progress.getPathState(pid, manifest);
    return { id: pid, name: manifest.name, boards: manifest.cards.length, label: st.label, state: st.state, boardsRead: st.boardsRead };
  });
</script>

<div class="subject-view">
  <button class="back-link" on:click={() => onNavigate?.('subjects')}>‹ all subjects</button>

  <div class="subject-header">
    <SubjectMark {subject} accent="#f2d585" size={40} />
    <h1>{label}</h1>
  </div>

  <p class="sub">Choose a path to start learning.</p>

  <div class="path-list">
    {#each pathData as p}
      <div class="path-card" on:click={() => onNavigate?.('path', p.id)}>
        <div class="path-icon">
          <SubjectMark {subject} accent="#f2d585" size={28} />
        </div>
        <div class="path-info">
          <div class="path-name">{p.name}</div>
          <div class="path-meta">{p.boardsRead} / {p.boards} boards · {p.label}</div>
        </div>
        <div class="path-chev">›</div>
      </div>
    {/each}
  </div>

  <div class="all-boards">
    <ChalkButton variant="ghost" fullWidth on:click={() => onNavigate?.('reader', 0)}>
      Browse all {label} boards
    </ChalkButton>
  </div>
</div>

<style>
  .subject-view {
    height: 100%;
    overflow-y: auto;
    padding: 24px 18px 100px;
    background: var(--board-1);
    border: 12px solid var(--frame);
    border-radius: 6px;
    box-shadow: 0 0 0 2px var(--frame-dark), 0 30px 70px -28px rgba(0,0,0,0.85), inset 0 0 80px rgba(0,0,0,0.35);
  }
  .back-link {
    font-family: var(--print); font-size: 13px; color: var(--chalk-faint);
    text-decoration: none; margin-bottom: 16px; display: inline-block;
    cursor: pointer; background: none; border: none;
  }
  .subject-header {
    display: flex; align-items: center; gap: 14px; margin-bottom: 6px;
  }
  .subject-header h1 {
    font-family: var(--hand-display); font-weight: 400;
    font-size: 28px; text-shadow: 0 1px 0 rgba(0,0,0,0.25);
  }
  .sub {
    font-family: var(--print); color: var(--chalk-faint); font-size: 14px; margin-bottom: 20px;
  }
  .path-list {
    display: flex; flex-direction: column; gap: 10px;
  }
  .path-card {
    display: flex; align-items: center; gap: 14px;
    background: rgba(0,0,0,0.14);
    border: 1.5px dashed rgba(244,241,233,0.12);
    border-radius: 12px; padding: 14px;
    cursor: pointer;
  }
  .path-card:active { background: rgba(0,0,0,0.25); }
  .path-icon {
    width: 44px; height: 44px; border-radius: 50%;
    background: var(--board-2); border: 1.5px dashed var(--chalk-faint);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .path-info { flex: 1; min-width: 0; }
  .path-name { font-family: var(--hand-display); font-size: 17px; color: var(--chalk); }
  .path-meta { font-family: var(--print); font-size: 12px; color: var(--chalk-faint); margin-top: 2px; }
  .path-chev { color: var(--chalk-faint); font-size: 18px; }
  .all-boards { margin-top: 20px; }
</style>
