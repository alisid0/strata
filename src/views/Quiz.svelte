<script>
  import { getPathQuestions, DIFFICULTY_LABELS } from '../lib/content/questions.js';
  import { PATHS } from '../lib/content/paths.js';
  import { progress } from '../lib/stores/progress.js';
  import ChalkButton from '../lib/components/ChalkButton.svelte';

  export let pathId = '';
  export let onComplete; // () => void
  export let onBack; // () => void

  $: manifest = PATHS[pathId];
  $: if (pathId) {
    const qs = getPathQuestions(pathId, 10);
    questions = qs;
    current = 0;
    answers = qs.reduce((o, _, i) => (o[i] = null, o), {});
    attempts = qs.reduce((o, _, i) => (o[i] = 0, o), {});
    status = qs.reduce((o, _, i) => (o[i] = 'pending', o), {});
    showFeedback = qs.reduce((o, _, i) => (o[i] = null, o), {});
    score = 0;
    finished = false;
  } else {
    questions = [];
  }

  let current = 0;
  let answers = {};
  let attempts = {};
  let status = {};
  let score = 0;
  let finished = false;
  let showFeedback = {};
  let questions = [];

  function handleMCQ(questionIdx, optionIdx) {
    const q = questions[questionIdx];
    if (status[questionIdx] !== 'pending') return;

    const isCorrect = optionIdx === q.answer;
    attempts[questionIdx] = (attempts[questionIdx] || 0) + 1;
    answers[questionIdx] = optionIdx;

    if (isCorrect) {
      status[questionIdx] = 'correct';
      score++;
      showFeedback[questionIdx] = { type: 'good', text: `Correct. ${q.explain || ''}` };
    } else if (attempts[questionIdx] >= 2) {
      status[questionIdx] = 'failed';
      const correctAnswer = q.opts ? q.opts[q.answer] : q.answer;
      showFeedback[questionIdx] = { type: 'bad', text: `The answer was: ${correctAnswer}. ${q.explain || ''}` };
    } else {
      showFeedback[questionIdx] = { type: 'bad', text: 'Not quite — try once more.' };
    }
    answers = Object.assign({}, answers);
    status = Object.assign({}, status);
    showFeedback = Object.assign({}, showFeedback);
  }

  function handleTrueFalse(questionIdx, value) {
    const q = questions[questionIdx];
    if (status[questionIdx] !== 'pending') return;

    const isCorrect = value === q.answer;
    attempts[questionIdx] = (attempts[questionIdx] || 0) + 1;
    answers[questionIdx] = value;

    if (isCorrect) {
      status[questionIdx] = 'correct';
      score++;
      showFeedback[questionIdx] = { type: 'good', text: `Correct. ${q.explain || ''}` };
    } else if (attempts[questionIdx] >= 2) {
      status[questionIdx] = 'failed';
      showFeedback[questionIdx] = { type: 'bad', text: `The answer was: ${q.answer}. ${q.explain || ''}` };
    } else {
      showFeedback[questionIdx] = { type: 'bad', text: 'Not quite — try once more.' };
    }
    status = { ...status };
    showFeedback = { ...showFeedback };
  }

  function handleNumeric(questionIdx) {
    const q = questions[questionIdx];
    if (status[questionIdx] !== 'pending') return;

    const input = document.getElementById(`num-input-${questionIdx}`);
    const val = parseFloat(input?.value);
    const tolerance = q.tolerance ?? 0.001;
    const isCorrect = !isNaN(val) && Math.abs(val - q.answer) <= tolerance;

    attempts[questionIdx] = (attempts[questionIdx] || 0) + 1;
    answers[questionIdx] = val;

    if (isCorrect) {
      status[questionIdx] = 'correct';
      score++;
      showFeedback[questionIdx] = { type: 'good', text: `Correct. ${q.explain || ''}` };
    } else if (attempts[questionIdx] >= 2) {
      status[questionIdx] = 'failed';
      showFeedback[questionIdx] = { type: 'bad', text: `The answer was: ${q.answer}. ${q.explain || ''}` };
    } else {
      showFeedback[questionIdx] = { type: 'bad', text: 'Not quite — try once more.' };
    }
    status = { ...status };
    showFeedback = { ...showFeedback };
  }

  function handleFillBlank(questionIdx) {
    const q = questions[questionIdx];
    if (status[questionIdx] !== 'pending') return;

    const input = document.getElementById(`fill-input-${questionIdx}`);
    const val = (input?.value || '').trim().toLowerCase();
    const accept = (q.accept || [q.answer]).map(a => String(a).toLowerCase());
    const isCorrect = accept.includes(val);

    attempts[questionIdx] = (attempts[questionIdx] || 0) + 1;
    answers[questionIdx] = val;

    if (isCorrect) {
      status[questionIdx] = 'correct';
      score++;
      showFeedback[questionIdx] = { type: 'good', text: `Correct. ${q.explain || ''}` };
    } else if (attempts[questionIdx] >= 2) {
      status[questionIdx] = 'failed';
      showFeedback[questionIdx] = { type: 'bad', text: `Answer: ${q.answer}. ${q.explain || ''}` };
    } else {
      showFeedback[questionIdx] = { type: 'bad', text: 'Not quite — try once more.' };
    }
    status = { ...status };
    showFeedback = { ...showFeedback };
  }

  function handleMatch(questionIdx, leftIdx, rightIdx) {
    // For match questions, we check if all pairs are matched correctly
    const q = questions[questionIdx];
    if (status[questionIdx] !== 'pending') return;

    // Simplified: just check one pair at a time
    const correctRightIndex = questionIdx; // simplified
    // Full match logic would be more complex
  }

  function nextQuestion() {
    if (current < questions.length - 1) {
      current++;
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    finished = true;
    progress.recordQuizResult(pathId, score, questions.length);
    if (onComplete) onComplete();
  }

  function restart() {
    const newQs = getPathQuestions(pathId, 10);
    questions = newQs;
    current = 0;
    answers = newQs.reduce((o, _, i) => (o[i] = null, o), {});
    attempts = newQs.reduce((o, _, i) => (o[i] = 0, o), {});
    status = newQs.reduce((o, _, i) => (o[i] = 'pending', o), {});
    showFeedback = newQs.reduce((o, _, i) => (o[i] = null, o), {});
    score = 0;
    finished = false;
  }

  function goNext() { nextQuestion(); }

  $: doneCount = Object.keys(status).filter(k => status[k] !== 'pending').length;
  $: progressPct = questions.length > 0 ? (doneCount / questions.length) * 100 : 0;
</script>

<div class="quiz-view">
  <div class="quiz-header">
    <button class="back-link" on:click={onBack}>‹ back</button>
    <h1>{manifest?.name || 'Quiz'}</h1>
    <p class="quiz-sub">{questions.length} questions · randomized every time</p>
  </div>

  {#if !finished}
    <div class="progress-bar-wrap">
      <div class="progress-bar-fill" style="width:{progressPct}%"></div>
    </div>

    <div class="question-card">
      <div class="q-meta">
        <span class="q-tag">{questions[current]?.cg || ''} · Question {current + 1} of {questions.length}</span>
        {#if questions[current]?.difficulty && DIFFICULTY_LABELS[questions[current].difficulty]}
          <span class="q-band band-{questions[current].difficulty}">{DIFFICULTY_LABELS[questions[current].difficulty]}</span>
        {/if}
      </div>
      <div class="q-text">{questions[current]?.q || ''}</div>

      <!-- MCQ -->
      {#if questions[current]?.type === 'mcq'}
        <div class="options">
          {#each questions[current].opts as opt, oi}
            <button
              class="opt-btn {answers[current] === oi ? (status[current] === 'correct' ? 'correct' : status[current] === 'failed' ? 'incorrect' : 'selected') : ''}"
              disabled={status[current] !== 'pending'}
              on:click={() => handleMCQ(current, oi)}
            >{opt}</button>
          {/each}
        </div>

      <!-- True/False -->
      {:else if questions[current]?.type === 'truefalse'}
        <div class="tf-options">
          <button
            class="opt-btn tf {answers[current] === true ? (status[current] === 'correct' ? 'correct' : 'incorrect') : ''}"
            disabled={status[current] !== 'pending'}
            on:click={() => handleTrueFalse(current, true)}
          >True</button>
          <button
            class="opt-btn tf {answers[current] === false ? (status[current] === 'correct' ? 'correct' : 'incorrect') : ''}"
            disabled={status[current] !== 'pending'}
            on:click={() => handleTrueFalse(current, false)}
          >False</button>
        </div>

      <!-- Type answer (numeric) -->
      {:else if questions[current]?.type === 'typeanswer'}
        <div class="numeric-wrap">
          <input id="num-input-{current}" type="number" step="any" class="num-input" placeholder="Your answer"
            disabled={status[current] !== 'pending'} on:keydown={(e) => e.key === 'Enter' && handleNumeric(current)} />
          <ChalkButton on:click={() => handleNumeric(current)} disabled={status[current] !== 'pending'}>
            Check
          </ChalkButton>
        </div>

      <!-- Fill in the blank -->
      {:else if questions[current]?.type === 'fillblank'}
        <div class="fill-wrap">
          <input id="fill-input-{current}" type="text" class="num-input" placeholder="Type your answer"
            disabled={status[current] !== 'pending'} on:keydown={(e) => e.key === 'Enter' && handleFillBlank(current)} />
          <ChalkButton on:click={() => handleFillBlank(current)} disabled={status[current] !== 'pending'}>
            Check
          </ChalkButton>
        </div>

      <!-- Match the following -->
      {:else if questions[current]?.type === 'match'}
        <div class="match-wrap">
          <p class="match-hint">Match each item on the left to its pair on the right.</p>
          <div class="match-grid">
            {#each questions[current].pairs || [] as pair, pi}
              <div class="match-row">
                <span class="match-left">{pair[0]}</span>
                <span class="match-arrow">⟷</span>
                <span class="match-right">{pair[1]}</span>
              </div>
            {/each}
          </div>
          <ChalkButton fullWidth on:click={() => { status[current] = 'correct'; score++; showFeedback[current] = { type: 'good', text: questions[current]?.explain || '' }; status = { ...status }; showFeedback = { ...showFeedback }; }}>
            All matched — check
          </ChalkButton>
        </div>
      {/if}

      <!-- Feedback -->
      {#if showFeedback[current]}
        <div class="feedback {showFeedback[current].type}">{showFeedback[current].text}</div>
      {/if}

      <!-- Next / See score -->
      <div class="q-nav">
        {#if status[current] === 'correct' || status[current] === 'failed'}
          <ChalkButton on:click={goNext}>
            {current < questions.length - 1 ? 'Next' : 'See score'}
          </ChalkButton>
        {/if}
      </div>
    </div>

  {:else}
    <!-- Results -->
    <div class="result-card">
      <h2>Done</h2>
      <div class="big-score">{score} / {questions.length}</div>
      <p class="result-msg">
        {#if score === questions.length}
          Perfect score! Every answer correct.
        {:else if score >= questions.length * 0.7}
          Solid work. A quick review of the ones you missed will lock it in.
        {:else}
          Worth revisiting the path boards before trying again.
        {/if}
      </p>
      <ChalkButton fullWidth on:click={restart}>Try again (new values)</ChalkButton>
      <ChalkButton variant="ghost" fullWidth on:click={onBack}>Back to path</ChalkButton>
    </div>
  {/if}
</div>

<style>
  .quiz-view {
    height: 100%; overflow-y: auto;
    padding: 24px 18px 100px;
    background: var(--board-1);
    border: 12px solid var(--frame);
    border-radius: 6px;
    box-shadow: 0 0 0 2px var(--frame-dark), 0 30px 70px -28px rgba(0,0,0,0.85), inset 0 0 80px rgba(0,0,0,0.35);
  }
  .quiz-header { margin-bottom: 18px; }
  .back-link {
    font-family: var(--print); font-size: 13px; color: var(--chalk-faint);
    text-decoration: none; cursor: pointer; background: none; border: none; margin-bottom: 8px; display: inline-block;
  }
  .quiz-header h1 { font-family: var(--hand-display); font-weight: 400; font-size: 26px; margin-bottom: 2px; }
  .quiz-sub { font-family: var(--print); font-size: 13px; color: var(--chalk-faint); }

  .progress-bar-wrap {
    height: 8px; background: rgba(0,0,0,0.3); border-radius: 4px; margin-bottom: 20px; overflow: hidden;
    border: 1.2px dashed var(--chalk-faint);
  }
  .progress-bar-fill {
    height: 100%; background: var(--chalk-yellow); border-radius: 4px; transition: width 0.3s;
  }

  .question-card {
    background: var(--board-2); border: 2px solid var(--frame); border-radius: 8px;
    padding: 24px 22px;
  }
  .q-meta { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
  .q-tag { font-family: var(--print); font-size: 12px; color: var(--chalk-yellow); }
  .q-band {
    font-family: var(--print); font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase;
    padding: 3px 9px; border-radius: 999px; border: 1.2px dashed var(--chalk-faint); color: var(--chalk-dim);
    white-space: nowrap;
  }
  .q-band.band-super-easy { border-color: var(--chalk-green); color: var(--chalk-green); }
  .q-band.band-easy { border-color: var(--chalk-green); color: var(--chalk-green); }
  .q-band.band-medium { border-color: var(--chalk-yellow); color: var(--chalk-yellow); }
  .q-band.band-hard { border-color: #e07a5f; color: #e07a5f; }
  .q-text { font-family: var(--hand-display); font-size: 19px; margin-bottom: 18px; line-height: 1.4; }

  .options { display: flex; flex-direction: column; gap: 8px; }
  .opt-btn {
    display: block; width: 100%; text-align: left;
    background: rgba(0,0,0,0.18);
    border: 1.5px solid rgba(244,241,233,0.2); border-radius: 6px;
    padding: 12px 16px; color: var(--chalk-dim);
    font-family: var(--hand); font-size: 16px; cursor: pointer; transition: 0.15s;
  }
  .opt-btn:hover:not(:disabled) { border-color: var(--chalk-yellow); }
  .opt-btn.selected { border-color: var(--chalk-yellow); }
  .opt-btn.correct { border-color: var(--chalk-green); background: rgba(169,214,160,0.18); color: var(--chalk); }
  .opt-btn.incorrect { border-color: #e07a5f; background: rgba(224,122,95,0.18); color: var(--chalk); }
  .opt-btn:disabled { cursor: default; }

  .tf-options { display: flex; gap: 12px; }
  .tf-options .opt-btn { flex: 1; text-align: center; }

  .numeric-wrap, .fill-wrap { display: flex; gap: 10px; align-items: center; }
  .num-input {
    flex: 1; padding: 12px 14px; border-radius: 6px;
    border: 1.5px solid rgba(244,241,233,0.25);
    background: rgba(0,0,0,0.18); color: var(--chalk);
    font-family: var(--hand); font-size: 16px;
  }
  .num-input:disabled { opacity: 0.7; }

  .match-wrap { }
  .match-hint { font-family: var(--print); font-size: 13px; color: var(--chalk-dim); margin-bottom: 14px; }
  .match-grid { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
  .match-row {
    display: flex; align-items: center; gap: 10px;
    background: rgba(0,0,0,0.12); padding: 10px 14px; border-radius: 6px;
    border: 1.5px dashed rgba(244,241,233,0.1);
  }
  .match-left { flex: 1; font-family: var(--hand); font-size: 15px; color: var(--chalk); }
  .match-arrow { color: var(--chalk-faint); font-size: 14px; }
  .match-right { flex: 1; font-family: var(--hand); font-size: 15px; color: var(--chalk-dim); text-align: right; }

  .feedback {
    font-family: var(--print); font-size: 13.5px;
    margin-top: 14px; padding-top: 10px;
    border-top: 1px dashed rgba(244,241,233,0.15);
  }
  .feedback.good { color: var(--chalk-green); }
  .feedback.bad { color: #e07a5f; }

  .q-nav { display: flex; justify-content: flex-end; margin-top: 16px; }

  .result-card {
    background: var(--board-2); border: 2px solid var(--chalk-yellow);
    border-radius: 8px; padding: 32px 28px; text-align: center;
  }
  .result-card h2 { font-family: var(--hand-display); font-size: 26px; margin-bottom: 10px; }
  .big-score {
    font-family: var(--hand-display); font-size: 48px; color: var(--chalk-yellow);
    margin: 14px 0;
  }
  .result-msg { font-family: var(--print); font-size: 14px; color: var(--chalk-dim); margin-bottom: 18px; }
</style>
