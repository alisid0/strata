import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';

const errors = [];
const results = [];
const dom = new JSDOM(
  '<!doctype html><html><head></head><body><div id="app"></div></body></html>',
  { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/' }
);
const { window } = dom;
window.matchMedia = (query) => ({
  matches: /prefers-reduced-motion/.test(query),
  media: query,
  addListener() {},
  removeListener() {},
  addEventListener() {},
  removeEventListener() {}
});
window.addEventListener('error', (event) => errors.push(`window.error: ${event.message}`));
window.console.error = (...args) => errors.push(`console.error: ${args.join(' ')}`);
window.console.warn = (...args) => errors.push(`console.warn: ${args.join(' ')}`);

const script = window.document.createElement('script');
script.textContent = readFileSync('tests/solve-first/.out/h.js', 'utf8');
window.document.head.appendChild(script);

const app = () => window.document.getElementById('app');
const tick = () => new Promise((resolve) => setTimeout(resolve, 1));
const text = () => app().textContent.replace(/\s+/g, ' ');
const all = (selector) => Array.from(app().querySelectorAll(selector));
const button = (label, selector = 'button') =>
  all(selector).find((item) => (item.textContent || '').trim().toLowerCase().includes(label.toLowerCase()));
const click = async (label, selector = 'button') => {
  const target = button(label, selector);
  if (!target) throw new Error(`Button not found: ${label}`);
  if (target.disabled) throw new Error(`Button disabled: ${label}`);
  target.click();
  await tick();
};
const clickElement = async (target) => {
  if (!target) throw new Error('Element not found');
  if (target.disabled) throw new Error(`Element disabled: ${target.textContent}`);
  target.click();
  await tick();
};
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
  results.push(`PASS · ${message}`);
};

// Network construction discovery.
assert(text().toLowerCase().includes('connect the computers'), 'network workshop mounts');
await click('Open the parts case');
for (const tool of ['Power lead', 'Data cable', 'Radio link']) {
  await click(tool);
  await click('Send test file');
}
assert(text().includes('Two paths proven'), 'wired, wireless, and failed power-only evidence unlock scaling');
await click('Two paths proven');

for (const buildButton of all('.layout-card > button')) await clickElement(buildButton);
await click('Shared middle', '.decision button');
assert(text().includes('Expansion solved'), 'both four-computer layouts are compared');
await click('Expansion solved');

for (const faultButton of all('.failure-card > button')) await clickElement(faultButton);
await click('Many paths', '.decision button');
assert(text().includes('Fault pattern proven'), 'all layouts are fault-tested before resilience choice');
await click('Fault pattern proven');

for (const design of ['Shared middle', 'Radio cloud', 'Many paths']) {
  await click(design, '.blueprint-grid button');
  await click('Deploy network');
  await click(design === 'Many paths' ? 'Review all three jobs' : 'Continue to the next job');
}
assert(text().includes('Jobs complete'), 'three constraint missions accept the matching designs');
await click('Jobs complete');
await click('Shared middle', '.transfer-options button');
await click('Reveal the network designs');
assert(text().includes('You built computer networks'), 'network formal reveal is reached');
assert(window.__done.some((item) => item.id === 'networks-connect-the-computers'), 'network reward records once');

// Petrol-station rate-of-change discovery.
window.__mount('differentiation');
await tick();
assert(text().includes('Run the Forecourt'), 'differentiation workshop mounts');
await click('Connect the tanker');
for (const rate of ['100', '200', '300']) {
  await click(rate, '.valve-picker button');
  await click('Pump for 1 minute');
}
assert(text().includes('Calibration secured'), 'three valve rates reach exactly 1,000 litres');
await click('Calibration secured');

for (const sample of all('.sample-row button')) await clickElement(sample);
await click('Tanker B');
await click('Pattern found');
for (let shift = 0; shift < 4; shift += 1) {
  await click('Advance 2 minutes');
  await click(shift === 3 ? 'Review the completed forecourt' : 'Continue to the next shift');
}
assert(text().includes('Forecourt saved'), 'four-shift flow-control game completes');
await click('Forecourt saved');
await click('30 L/min');
await click('Reveal the mathematics');
assert(text().includes('You used a derivative'), 'derivative formal reveal is reached');
assert(window.__done.some((item) => item.id === 'differentiation-forecourt-flow'), 'differentiation reward records once');

assert(errors.length === 0, 'no runtime console or window errors');
console.log(results.join('\n'));
