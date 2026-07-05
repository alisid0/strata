<script>
  // SortingDesk — drag items into category boxes
  import { fly } from 'svelte/transition';

  export let boxes = [];   // [{ id, label }]
  export let items = [];   // [{ id, label, box: correct_box_id }]
  export let onDone = () => {}; // (score, total) => void

  let placed = {};         // itemId → boxId
  let dragging = null;
  let submitted = false;
  let score = 0;

  function handleDragStart(e, itemId) {
    dragging = itemId;
    e.dataTransfer.setData('text/plain', itemId);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDrop(e, boxId) {
    e.preventDefault();
    if (dragging) {
      placed[dragging] = boxId;
      placed = { ...placed };
      dragging = null;
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function submit() {
    let correct = 0;
    for (const item of items) {
      if (placed[item.id] === item.box) correct++;
    }
    score = correct;
    submitted = true;
  }

  function finish() {
    onDone(score, items.length);
  }

  $: allPlaced = items.every(i => placed[i.id]);
</script>

<div class="sorting-desk">
  <div class="prompt">Drag each item into the box that describes it best.</div>

  <div class="boxes">
    {#each boxes as box}
      <div
        class="box"
        class:over={dragging !== null}
        class:correct={submitted}
        on:drop={(e) => handleDrop(e, box.id)}
        on:dragover={handleDragOver}
      >
        <div class="box-label">{box.label}</div>
        <div class="box-items">
          {#each items.filter(i => placed[i.id] === box.id) as item (item.id)}
            <div class="placed-item" class:right={submitted && item.box === box.id} class:wrong={submitted && item.box !== box.id}>
              {item.label}
              {#if submitted}
                <span class="check">{item.box === box.id ? '✓' : '✗'}</span>
              {/if}
            </div>
          {/each}
          {#if !items.some(i => placed[i.id] === box.id)}
            <div class="box-empty">Drop here</div>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <div class="item-pile">
    {#each items.filter(i => !placed[i.id]) as item (item.id)}
      <div
        class="draggable-item"
        draggable="true"
        on:dragstart={(e) => handleDragStart(e, item.id)}
        in:fly={{ y: 10, duration: 200 }}
      >
        {item.label}
      </div>
    {/each}
  </div>

  {#if !submitted && allPlaced}
    <button class="submit-btn" on:click={submit}>Check answers</button>
  {/if}

  {#if submitted}
    <div class="result">{score}/{items.length} correct</div>
    <button class="continue-btn" on:click={finish}>Continue</button>
  {/if}
</div>

<style>
  .sorting-desk {
    display: flex; flex-direction: column; gap: 16px; align-items: center;
    width: 100%; max-width: 360px; margin: 0 auto;
  }
  .prompt {
    font-size: 15px; font-weight: 700; color: var(--qx-text);
    text-align: center; margin-bottom: 4px;
  }
  .boxes {
    display: flex; gap: 10px; width: 100%;
  }
  .box {
    flex: 1; min-height: 120px;
    border: 2px dashed var(--qx-border-2); border-radius: 12px;
    padding: 10px; display: flex; flex-direction: column;
    transition: border-color 0.2s;
  }
  .box.over { border-color: var(--qx-accent); background: var(--qx-accent-soft); }
  .box.correct { border-style: solid; }
  .box-label {
    font-size: 12px; font-weight: 800; color: var(--qx-text-dim);
    text-align: center; margin-bottom: 8px; text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .box-items { display: flex; flex-direction: column; gap: 4px; flex: 1; }
  .box-empty {
    font-size: 11px; color: var(--qx-text-faint); text-align: center;
    padding: 12px 0; font-style: italic;
  }
  .placed-item {
    font-size: 12px; font-weight: 700; padding: 6px 8px;
    background: var(--qx-surface-2); border-radius: 6px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .placed-item.right { background: var(--qx-green-soft); color: var(--qx-green-text); }
  .placed-item.wrong { background: var(--qx-danger-soft); color: var(--qx-danger-text); }
  .check { font-size: 13px; }
  .item-pile {
    display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;
    min-height: 40px;
  }
  .draggable-item {
    padding: 10px 16px; background: var(--qx-surface);
    border: 1.5px solid var(--qx-border-2); border-radius: 20px;
    font-size: 13px; font-weight: 700; color: var(--qx-text);
    cursor: grab; user-select: none;
  }
  .draggable-item:active { cursor: grabbing; }
  .submit-btn, .continue-btn {
    padding: 12px 32px; border-radius: 24px; border: none;
    font-family: var(--qx-font); font-size: 14px; font-weight: 800;
    cursor: pointer;
  }
  .submit-btn { background: var(--qx-accent); color: #fff; }
  .continue-btn { background: var(--qx-accent); color: #fff; }
  .result {
    font-size: 18px; font-weight: 800; color: var(--qx-accent);
    text-align: center;
  }
</style>
