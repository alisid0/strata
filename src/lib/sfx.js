// Sound effects. Plays MP3 assets from /public/sounds/ when present, and falls
// back to a Web-Audio synth so the app is never silent if a file is missing or
// still loading. Drop real files at public/sounds/<name>.mp3 (supply your own,
// or run scripts/generate-sfx.mjs) and they take over automatically — the call
// sites (playAward / playBonus) do not change.
//
// Respects the 'qubix-sound' localStorage pref ('off' mutes; default on).

const SOUNDS = {
  award: '/sounds/award.mp3',
  bonus: '/sounds/bonus.mp3',
  // Wired for future call sites; harmless until the files + callers exist.
  correct: '/sounds/correct.mp3',
  complete: '/sounds/complete.mp3',
};

function soundOn() {
  try { return localStorage.getItem('qubix-sound') !== 'off'; } catch { return true; }
}

// ── MP3 layer ──────────────────────────────────────────────────────────────
// available[name]: true once the file loads, false if it 404s/errors, undefined
// while still probing. We prime (load, not play — no gesture needed) on first
// touch so the asset is usually ready before the first reward fires.
const el = {};
const available = {};

function prime(name) {
  if (typeof Audio === 'undefined' || el[name] || !SOUNDS[name]) return;
  const a = new Audio(SOUNDS[name]);
  a.preload = 'auto';
  a.addEventListener('canplaythrough', () => { available[name] = true; }, { once: true });
  a.addEventListener('error', () => { available[name] = false; }, { once: true });
  el[name] = a;
}
// Warm the reward sounds at import time (this module loads with the app shell).
if (typeof window !== 'undefined') { prime('award'); prime('bonus'); }

function playAsset(name) {
  const a = el[name];
  if (!a || available[name] !== true) return false;
  try {
    // Clone so rapid repeats can overlap instead of cutting each other off.
    const node = a.cloneNode(true);
    node.volume = 0.6;
    const p = node.play();
    if (p && p.catch) p.catch(() => {});
    return true;
  } catch { return false; }
}

// ── Web-Audio synth fallback (the previous behaviour) ────────────────────────
let ctx = null;
function audioCtx() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

/** One plucked bell-ish note: triangle fundamental + sine octave sparkle. */
function note(ac, freq, at, dur = 0.28, vol = 0.32) {
  const gain = ac.createGain();
  gain.connect(ac.destination);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(vol, at + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  const osc = ac.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = freq;
  osc.connect(gain);
  osc.start(at);
  osc.stop(at + dur + 0.02);

  const sparkle = ac.createGain();
  sparkle.connect(ac.destination);
  sparkle.gain.setValueAtTime(0.0001, at);
  sparkle.gain.exponentialRampToValueAtTime(vol * 0.22, at + 0.01);
  sparkle.gain.exponentialRampToValueAtTime(0.0001, at + dur * 0.6);
  const osc2 = ac.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.value = freq * 2;
  osc2.connect(sparkle);
  osc2.start(at);
  osc2.stop(at + dur);
}

function synthAward() {
  const ac = audioCtx();
  if (!ac) return;
  const t = ac.currentTime + 0.01;
  note(ac, 659.25, t);              // E5
  note(ac, 880.0, t + 0.09, 0.34);  // A5
}

function synthBonus() {
  const ac = audioCtx();
  if (!ac) return;
  const t = ac.currentTime + 0.01;
  note(ac, 523.25, t, 0.24);              // C5
  note(ac, 659.25, t + 0.08, 0.24);       // E5
  note(ac, 783.99, t + 0.16, 0.26);       // G5
  note(ac, 1046.5, t + 0.26, 0.5, 0.36);  // C6 held with sparkle
}

// ── Public API (unchanged call sites) ────────────────────────────────────────
function play(name, synth) {
  if (!soundOn()) return;
  prime(name);
  if (!playAsset(name)) synth();   // MP3 present → play it; else the synth
}

/** Regular W award. */
export function playAward() { play('award', synthAward); }

/** Bonus / big award. */
export function playBonus() { play('bonus', synthBonus); }

/** Generic helper for future call sites (correct answer, lesson complete, …).
 *  Plays the MP3 if present; silent if there's no asset and no synth given. */
export function playSfx(name, synth) { play(name, synth || (() => {})); }
