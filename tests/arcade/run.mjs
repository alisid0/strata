import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';

const bundle = readFileSync('tests/arcade/.out/bundle.js', 'utf8');
const dom = new JSDOM('<!doctype html><html data-qx-theme="light"><body><div id="app"></div></body></html>', {
  runScripts: 'outside-only', pretendToBeVisual: true
});
const { window } = dom;
const errors = [];
window.addEventListener('error', (e) => errors.push('window: ' + e.message));

const ctxStub = () => new Proxy({ canvas: {} }, {
  get(t, prop) {
    if (prop === 'measureText') return () => ({ width: 10 });
    if (prop === 'createRadialGradient' || prop === 'createLinearGradient') return () => ({ addColorStop: () => {} });
    return () => undefined;
  },
  set() { return true; }
});
window.HTMLCanvasElement.prototype.getContext = function () { return ctxStub(); };
window.HTMLCanvasElement.prototype.setPointerCapture = () => {};
let rafQ = [];
window.requestAnimationFrame = (fn) => { rafQ.push(fn); return rafQ.length; };
window.cancelAnimationFrame = () => {};
const tick = (ms = 5) => new Promise((r) => setTimeout(r, ms));
const pump = async (n) => {
  for (let i = 0; i < n; i++) {
    const q = rafQ; rafQ = [];
    q.forEach((f) => { try { f(Date.now()); } catch (e) { errors.push('raf: ' + e.message); } });
    await tick(1);
  }
};
class FN { connect() { return this; } start() {} stop() {} }
class FA {
  constructor() { this.currentTime = 0; this.destination = new FN(); this.state = 'running'; }
  createOscillator() { const n = new FN(); n.frequency = { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} }; n.type = ''; return n; }
  createGain() { const n = new FN(); n.gain = { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} }; return n; }
  resume() { return Promise.resolve(); }
}
window.AudioContext = FA; window.webkitAudioContext = FA;
window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });

let pass = 0, fail = 0;
const check = (name, ok, extra = '') => { ok ? pass++ : fail++; console.log((ok ? 'PASS' : 'FAIL') + ' · ' + name + (extra && !ok ? ' — ' + extra : '')); };
const click = async (btn) => { btn.click(); await tick(15); };
const doneCount = () => window.eval('__done.length');
const lastDone = () => JSON.parse(window.eval('JSON.stringify(__done[__done.length-1]||null)'));

window.eval(bundle);

console.log('— 1 · smoke: all seven mount and start —');
const startLabels = { trig: 'start mission', hacker: 'begin', orbit: 'begin', aegis: 'activate', bayes: 'sweep', projectile: 'fire', vectorrace: null };
for (const g of Object.keys(startLabels)) {
  errors.length = 0;
  window.eval(`__mount(${JSON.stringify(g)})`);
  await tick(20); await pump(3);
  const label = startLabels[g];
  const ok = label ? !!window.eval(`btnByText(${JSON.stringify(label)})`) : window.eval(`$$('.cand').length`) > 0;
  check(g + ': mounts', ok);
  await pump(15);
  check(g + ': no errors', errors.length === 0, errors.slice(0, 2).join(' | '));
}

console.log('— 2 · Orbit: energy budget is enforced —');
window.eval(`__mount('orbit')`); await tick(20);
await click(window.eval(`btnByText('begin')`));
const setRange = async (ix, val) => {
  const el = window.eval(`$$('input[type=range]')[${ix}]`);
  el.value = String(val);
  el.dispatchEvent(new window.Event('input', { bubbles: true }));
  await tick(10);
};
await setRange(0, 180); // max a
await setRange(1, 180); // try max b — must clamp
const aV = parseFloat(window.eval(`$$('input[type=range]')[0].value`));
const bV = parseFloat(window.eval(`$$('input[type=range]')[1].value`));
check('orbit: a·b clamped to budget', aV * bV <= 8000, `a=${aV} b=${bV} → ${aV * bV}`);
check('orbit: energy meter rendered', !!window.eval(`document.querySelector('.energy')`));

console.log('— 3 · Bayes: full playthrough incl. transfer —');
errors.length = 0;
window.eval(`__mount('bayes')`); await tick(20);
for (let lvl = 0; lvl < 3; lvl++) {
  await click(window.eval(`btnByText('sweep the detector')`));
  await click(window.eval(`btnByText('lock in')`));
  await click(window.eval(`btnByText(${lvl < 2 ? "'next field'" : "'what did i just do'"})`));
}
check('bayes: transfer appears before concept', !!window.eval(`btnByText('about half')`), 'no transfer options');
check('bayes: reward not yet recorded', doneCount() === 0);
await click(window.eval(`btnByText('about half')`)); // wrong on purpose
check('bayes: wrong answer shows hint, stays', !!window.eval(`btnByText('about 1 in 21')`) && doneCount() === 0);
await click(window.eval(`btnByText('about 1 in 21')`));
check('bayes: correct answer reaches concept + records once', doneCount() === 1 && !!window.eval(`btnByText('return to workshops')`));
check('bayes: retried transfer sets transferFirstTry=false', lastDone().transferFirstTry === false);
check('bayes: no errors', errors.length === 0, errors.slice(0, 2).join(' | '));

console.log('— 4 · Projectile: no preview on L3, transfer gates concept —');
errors.length = 0;
window.eval(`__mount('projectile')`); await tick(20);
const aimAndFire = async (angle, power) => {
  await setRange(0, angle);
  if (window.eval(`$$('input[type=range]').length`) > 1 && power != null) await setRange(1, power);
  await click(window.eval(`btnByText('fire')`));
  await pump(4); await tick(30);
};
await aimAndFire(45, 22);                 // L1: lands ~49.4, tol 6 of 55
await click(window.eval(`btnByText('next mission')`));
await aimAndFire(60, 29);                 // L2: clears wall, lands ~74.3
await click(window.eval(`btnByText('next mission')`));
check('projectile: L3 preview arc hidden', window.eval(`$$('.aim').length`) === 0);
await aimAndFire(45, null);               // L3: locked power 30 → 91.8 ≈ 92
await click(window.eval(`btnByText('what did i just do')`));
check('projectile: transfer question appears', !!window.eval(`btnByText('60°')`), 'no transfer options');
check('projectile: reward not yet recorded', doneCount() === 1);
await click(window.eval(`btnByText('60°')`));
check('projectile: correct transfer records reward', doneCount() === 2 && lastDone().transferFirstTry === true);
check('projectile: no errors', errors.length === 0, errors.slice(0, 2).join(' | '));

console.log('— 5 · Vector Racer: sprint clears, level advances —');
errors.length = 0;
window.eval(`__mount('vectorrace')`); await tick(20);
let advanced = false;
for (let i = 0; i < 30; i++) {
  const cands = window.eval(`$$('.cand').map((c) => ({ x: +c.dataset.cx, y: +c.dataset.cy, ok: c.dataset.ok === 'true', fin: c.classList.contains('fin') }))`);
  let pick = -1, best = -1e9;
  cands.forEach((c, ix) => {
    if (!c.ok) return;
    const s = (c.fin ? 1e6 : 0) + c.x;
    if (s > best) { best = s; pick = ix; }
  });
  if (pick < 0) break;
  const el = window.eval(`$$('.cand')[${pick}]`);
  el.dispatchEvent(new window.Event('click', { bubbles: true }));
  await tick(12);
  if (window.eval(`document.body.textContent`).includes('right-angle bend')) { advanced = true; break; }
}
check('vectorrace: sprint cleared, bend loaded', advanced);
check('vectorrace: no errors', errors.length === 0, errors.slice(0, 2).join(' | '));

console.log('— 6 · Signal Hacker: 9 locks + ROOT decode by sliders —');
errors.length = 0;
window.eval(`__mount('hacker')`); await tick(20);
await click(window.eval(`btnByText('begin')`));
const matchPct = () => parseInt((window.eval(`($$('button.breach')[0]||{textContent:''}).textContent`).match(/(\d+)%/) || [0, '0'])[1], 10) || (window.eval(`$$('button.breach.armed').length`) ? 100 : 0);
let breached = 0, sawDecodeBanner = false;
for (let round = 0; round < 10; round++) {
  const n = window.eval(`$$('input[type=range]').length`);
  for (let ix = 0; ix < n; ix++) {
    const el = window.eval(`$$('input[type=range]')[${ix}]`);
    const min = parseFloat(el.min), max = parseFloat(el.max);
    let bestV = parseFloat(el.value), bestM = -1;
    for (let s = 0; s <= 48; s++) {
      const v = min + (max - min) * s / 48;
      el.value = String(v);
      el.dispatchEvent(new window.Event('input', { bubbles: true }));
      await tick(1);
      const m = matchPct();
      if (m > bestM) { bestM = m; bestV = v; }
    }
    el.value = String(bestV);
    el.dispatchEvent(new window.Event('input', { bubbles: true }));
    await tick(1);
  }
  if (window.eval(`$$('.deq').length`)) sawDecodeBanner = true;
  const breach = window.eval(`$$('button.breach.armed')[0]`);
  if (!breach) { console.log('     stuck at', matchPct() + '%, round', round); break; }
  breach.click(); breached++;
  await tick(1250); await pump(3);
  const next = window.eval(`btnByText('next vault')`);
  if (next) { await click(next); await click(window.eval(`btnByText('begin')`)); }
  if (window.eval(`btnByText('return to workshops')`)) break;
}
check('hacker: 9 locks + 1 root transmit', breached === 10, breached + ' breached');
check('hacker: ROOT equation banner shown (target dark)', sawDecodeBanner);
check('hacker: reward recorded once', doneCount() === 3, 'done=' + doneCount());
check('hacker: no errors', errors.length === 0, errors.slice(0, 2).join(' | '));

console.log(`\n═══ Results: ${pass} passed, ${fail} failed ═══`);
process.exit(fail ? 1 : 0);
