import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
const errors = [];
const dom = new JSDOM('<!doctype html><html><head></head><body><div id="app"></div></body></html>',
  { runScripts:'dangerously', pretendToBeVisual:true, url:'http://localhost/' });
const { window } = dom;
window.matchMedia = (query)=>({matches:/prefers-reduced-motion/.test(query),media:query,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
window.addEventListener('error', e=>errors.push('window.error: '+e.message));
window.console.error=(...a)=>errors.push('console.error: '+a.join(' '));
window.console.warn=(...a)=>errors.push('console.warn: '+a.join(' '));
const s = window.document.createElement('script');
s.textContent = readFileSync('tests/solve-first/.out/h.js','utf8');
window.document.head.appendChild(s);

const app = () => window.document.getElementById('app');
const tick = () => new Promise(r=>setTimeout(r,1));
const txt = () => app().textContent.replace(/\s+/g,' ');
const btns = () => Array.from(app().querySelectorAll('button'));
const btn = (t) => btns().find(b=>(b.textContent||'').trim().toLowerCase().includes(t.toLowerCase()));
const st = (t) => { const b=btn(t); return !b?'absent':b.disabled?'DISABLED':'enabled'; };
const click = async (t) => { const b=btn(t); if(!b) return 'NOT-FOUND'; if(b.disabled) return 'DISABLED'; b.click(); await tick(); return 'ok'; };
const clickEl = async (el) => { if(!el||el.disabled) return 'no'; el.click(); await tick(); return 'ok'; };
const q = (sel) => Array.from(app().querySelectorAll(sel));

const R = [];
const log = (...a) => R.push(a.join(' '));

log('MOUNT: ' + (txt().includes('Save the Broadcast') ? 'OK' : 'FAIL'));

// ---------- FIT ----------
await click('Open transmission control');
log('\n[1 FIT] phase text: ' + txt().slice(0,54));
log('  gate before evidence: ' + st('Split, then deliver'));
await click('Send the whole frame');
log('  after oversize attempt, Split offered: ' + st('Split frame'));
await click('Split frame');
let groups=0;
while (q('.tile').some(t=>!t.disabled) && groups<9) {
  for (const t of q('.tile').filter(t=>!t.disabled).slice(0,2)) await clickEl(t);
  if (await click('Dispatch group') !== 'ok') break;
  groups++;
}
log('  groups=' + groups + ' allDelivered=' + q('.tile').every(t=>t.disabled));
log('  gate now: ' + st('Picture restored'));
await click('Picture restored');

// ---------- ORDER ----------
log('\n[2 ORDER] ' + txt().slice(0,50));
const routeBtns = (n) => q('.piece-row')[n] ? Array.from(q('.piece-row')[n].querySelectorAll('button')) : [];
// unmarked run: piece1 lower(slow), 2 upper, 3 upper  -> scramble
for (const [i,r] of [[0,'lower'],[1,'upper'],[2,'upper']])
  await clickEl(routeBtns(i).find(b=>b.textContent.trim()===r));
await click('Send pieces');
log('  unmarked run report: ' + (txt().includes('Arrival order changed') ? 'scramble witnessed' : 'no scramble'));
await click('Reset');
log('  mark chips appear after reset: ' + (q('.mark-chips').length>0));
for (let i=0;i<3;i++){
  const row=q('.piece-row')[i]; if(!row) continue;
  const mark=Array.from(row.querySelectorAll('.mark-chips button')).find(b=>b.textContent.trim()===String(i+1));
  await clickEl(mark);
}
for (const [i,r] of [[0,'lower'],[1,'upper'],[2,'upper']])
  await clickEl(routeBtns(i).find(b=>b.textContent.trim()===r));
await click('Send pieces');
log('  marked run: ' + (txt().includes('marks preserved') ? 'order repaired by marks' : 'not repaired'));
log('  gate: ' + st('Order secured'));
await click('Order secured');
log('\nERRORS: ' + (errors.length?JSON.stringify(errors.slice(0,4)):'none'));
console.log(R.join('\n'));

// ---------- ADDRESS ----------
const R2=[]; const log2=(...a)=>R2.push(a.join(' '));
log2('\n[3 ADDRESS] ' + txt().slice(0,46));
await click('Start the junction');
log2('  unmarked piece stalls: ' + (txt().includes('no basis for choosing') ? 'yes' : 'no'));
for (const row of q('.piece-row')) {
  const b = Array.from(row.querySelectorAll('button'));
  const want = row.textContent.includes('Piece 3')||row.textContent.includes('Piece 4') ? 'Room B' : 'Room A';
  await clickEl(b.find(x=>x.textContent.includes(want)));
}
await click('Start the junction');
log2('  both rooms supplied: ' + st('Both rooms supplied'));
await click('Both rooms supplied');

// ---------- RESILIENCE (blocker 1) ----------
log2('\n[4 RESILIENCE] ' + txt().slice(0,46));
log2('  locked-route selector present? ' + (txt().includes('Bound route') ? '*** YES (BAD)' : 'no — removed'));
log2('  gate at entry: ' + st('Strand a locked run'));
// Correct sequence: a CLEAR locked run first (so 'clear' is observable), then congestion.
await click('Locked route');
let w=0,last='';
for (let i=0;i<8;i++){ const r=await click('Dispatch wave'); if(r!=='ok') break; w++; last=txt(); if(last.includes('are stuck')) break; }
log2('  locked (clear) waves=' + w + ' | stranded: ' + (last.includes('are stuck')?'YES':'no'));
log2('  gate after locked-stall ONLY: ' + st('Strand a locked run') + '  <- must be DISABLED');
await click('Add congestion');
await click('Open route');
let w2=0;
for (let i=0;i<12;i++){ const r=await click('Dispatch wave'); if(r!=='ok') break; w2++; if(txt().includes('surviving route')) break; }
log2('  open (congested) waves=' + w2 + ' | rerouted: ' + (txt().includes('surviving route')?'YES':'no'));
const chips = q('.cond-row span').map(x=>x.textContent.trim()+'='+(x.className.includes('on')?'on':'off'));
log2('  evidence chips: ' + chips.join(', '));
log2('  policy offered: ' + (txt().includes('choose the operating policy')?'yes':'no'));
await click('Let each piece use an available route');
log2('  gate after both + policy: ' + st('Broadcast protected') + '  <- must be enabled');
await click('Broadcast protected');
log2('  advanced to transfer: ' + (txt().includes('Restore the heart trace')?'YES':'NO'));

// ---------- TRANSFER (blocker 2) ----------
log2('\n[T CLINIC] ' + txt().slice(0,46));
const segs = () => q('.piece-row');
const setRoute = async (i,r) => { const row=segs()[i]; if(!row) return; await clickEl(Array.from(row.querySelectorAll('.route-chips button')).find(b=>b.textContent.trim()===r)); };
const setDest = async (i) => { const row=segs()[i]; if(!row) return; await clickEl(Array.from(row.querySelectorAll('button')).find(b=>b.textContent.includes('add destination'))); };
const setMark = async (i,m) => { const row=segs()[i]; if(!row) return; await clickEl(Array.from(row.querySelectorAll('.mark-chips button')).find(b=>b.textContent.trim()===String(m))); };
for (let i=0;i<5;i++){ await setDest(i); await setMark(i,i+1); }
// Codex's deadlock config: 2 town / 3 hill
await setRoute(0,'town'); await setRoute(1,'town');
await setRoute(2,'hill'); await setRoute(3,'hill'); await setRoute(4,'hill');
log2('  [2 town/3 hill] Dispatch: ' + st('Dispatch') + '  <- must be DISABLED');
log2('  launch-plan panel shown: ' + (txt().includes('Launch plan required') ? 'yes' : 'no'));
log2('  counter text: ' + (txt().match(/town \d\/\d · hill \d\/\d/)||['(none)'])[0]);
// 1 town / 4 hill
await setRoute(1,'hill');
log2('  [1 town/4 hill] Dispatch: ' + st('Dispatch') + '  <- must be DISABLED');
// valid: 3 town / 2 hill
await setRoute(1,'town'); await setRoute(2,'town');
log2('  [3 town/2 hill] Dispatch: ' + st('Dispatch') + '  <- must be enabled');
log2('  Redirect before any failure: ' + st('Redirect via hill') + '  <- must be DISABLED');
let dw=0;
for (let i=0;i<6;i++){ const r=await click('Dispatch'); if(r!=='ok') break; dw++; if(txt().includes('town relay failed')||txt().includes('Town relay down')) break; }
log2('  dispatches=' + dw + ' | town failed: ' + (txt().includes('Town relay down')||txt().includes('town relay failed') ? 'yes':'no'));
log2('  Redirect now: ' + st('Redirect via hill') + '  <- must be enabled');
await click('Redirect via hill');
for (let i=0;i<4;i++){ if (await click('Dispatch') !== 'ok') break; }
log2('  reveal before diagnosis: ' + st('Diagnose why') + '  <- must be DISABLED');
log2('  systems diagnosis shown: ' + (txt().includes('Systems diagnosis') ? 'yes' : 'no'));
await click('Small marked segments choosing available routes independently');
log2('  reveal after diagnosis: ' + st('Reveal the system') + '  <- must be enabled');
await click('Reveal the system');
log2('\n[REVEAL] packet-switched shown: ' + (txt().includes('packet-switched network') ? 'yes':'no'));
log2('  reward recorded: ' + JSON.stringify(window.__done));
log2('\nFINAL ERRORS: ' + (errors.length?JSON.stringify(errors.slice(0,5)):'NONE'));
console.log(R2.join('\n'));
