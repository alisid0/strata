import { writable, derived, get } from 'svelte/store';
import { user } from './auth.js';
import { PATHS } from '../content/paths.js';

const KEY = 'strata-progress-v2';
const DAY_MS = 24 * 60 * 60 * 1000;

/** Local YYYY-MM-DD key for a date (used by the daily-activity log). */
function dayKey(dt = new Date()) {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Consecutive active days ending today (a still-inactive today doesn't break it). */
function computeStreak(activity) {
  if (!activity) return 0;
  let streak = 0;
  const d = new Date();
  if (!activity[dayKey(d)]) d.setDate(d.getDate() - 1); // grace: today need not be active yet
  while (activity[dayKey(d)]) { streak++; d.setDate(d.getDate() - 1); }
  return streak;
}

// Thresholds matching PATHS.md
const WELL_READ_RATIO = 0.7;
const MASTERED_RATIO = 0.9;
const RECALL_GAP_DAYS = 6.5;
const MASTERED_TWICE_GAP_DAYS = 27.5;

function createProgressStore() {
  const { subscribe, set, update } = writable(loadFromStorage());

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { version: 2, boards: {}, paths: {}, quizzes: {}, activity: {} };
      const data = JSON.parse(raw);
      if (!data.boards) data.boards = {};
      if (!data.paths) data.paths = {};
      if (!data.quizzes) data.quizzes = {};
      if (!data.activity) data.activity = {};
      return data;
    } catch {
      return { version: 2, boards: {}, paths: {}, quizzes: {}, activity: {} };
    }
  }

  function persist(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
  }

  return {
    subscribe,

    /** Record that a board was opened */
    recordBoardOpen(cardNumber, pathIds = []) {
      update(data => {
        const now = new Date().toISOString();
        const b = data.boards[cardNumber] || { firstOpenedAt: now, lastOpenedAt: now, openCount: 0 };
        if (!b.firstOpenedAt) b.firstOpenedAt = now;
        b.lastOpenedAt = now;
        b.openCount = (b.openCount || 0) + 1;
        data.boards[cardNumber] = b;

        if (!data.activity) data.activity = {};
        data.activity[dayKey()] = (data.activity[dayKey()] || 0) + 1;

        pathIds.forEach(pid => {
          const p = data.paths[pid] || { firstOpenedAt: null, lastOpenedAt: null, quiz: {} };
          if (!p.firstOpenedAt) p.firstOpenedAt = now;
          p.lastOpenedAt = now;
          if (!p.quiz) p.quiz = {};
          data.paths[pid] = p;
        });

        persist(data);
        return data;
      });
    },

    /** Record a quiz result for a path */
    recordQuizResult(pathId, score, total) {
      update(data => {
        const now = new Date().toISOString();
        if (!data.activity) data.activity = {};
        data.activity[dayKey()] = (data.activity[dayKey()] || 0) + 1;
        const p = data.paths[pathId] || { firstOpenedAt: now, lastOpenedAt: now, quiz: {} };
        if (!p.quiz) p.quiz = {};
        const q = p.quiz;
        const ratio = total > 0 ? score / total : 0;

        if (q.bestScore == null || score / Math.max(total, 1) > (q.bestScore || 0) / Math.max(q.bestTotal || 1, 1)) {
          q.bestScore = score;
          q.bestTotal = total;
        }
        if (ratio >= WELL_READ_RATIO && !q.firstPassAt) q.firstPassAt = now;
        if (ratio >= MASTERED_RATIO && !q.masteredOnceAt) q.masteredOnceAt = now;
        if (ratio >= MASTERED_RATIO && p.firstOpenedAt) {
          const gapDays = (new Date(now) - new Date(p.firstOpenedAt)) / DAY_MS;
          if (gapDays >= MASTERED_TWICE_GAP_DAYS && !q.recalledMasteredTwiceAt) {
            q.recalledMasteredTwiceAt = now;
          }
        }

        p.quiz = q;
        if (!p.lastOpenedAt) p.lastOpenedAt = now;
        data.paths[pathId] = p;

        // Also log to quiz history
        const qh = data.quizzes[pathId] || [];
        qh.push({ score, total, completedAt: now });
        data.quizzes[pathId] = qh;

        persist(data);
        return data;
      });
    },

    /** Get the mastery state for a path */
    getPathState(pathId, manifest) {
      const data = get({ subscribe });
      const p = data.paths[pathId];
      if (!manifest) return { state: 'unknown', label: 'Unknown' };
      if (!p || !p.firstOpenedAt) {
        return { state: 'unwandered', label: 'Not started', boardsRead: 0, boardsTotal: manifest.cards?.length || 0 };
      }

      const allRead = manifest.cards.every(n => data.boards[n] && data.boards[n].firstOpenedAt);
      const gapDays = (new Date(p.lastOpenedAt) - new Date(p.firstOpenedAt)) / DAY_MS;
      const recalled = gapDays >= RECALL_GAP_DAYS;
      const q = p.quiz || {};
      const hasQuiz = manifest.quizUrls && manifest.quizUrls.length > 0;
      const wellRead = hasQuiz && !!q.firstPassAt;
      const masteredOnce = hasQuiz && !!q.masteredOnceAt;
      const masteredTwice = hasQuiz && !!q.recalledMasteredTwiceAt;

      let state = 'wandered', label = 'Wandered';
      if (allRead) { state = 'checked'; label = 'Checked'; }
      if (wellRead) { state = 'well_read'; label = 'Well read'; }
      if (recalled) { state = 'recalled'; label = 'Recalled'; }
      if (masteredOnce) { state = 'mastered_1'; label = 'Mastered ×1'; }
      if (masteredTwice) { state = 'mastered_2'; label = 'Mastered ×2'; }

      const boardsRead = manifest.cards.filter(n => data.boards[n] && data.boards[n].firstOpenedAt).length;

      return {
        state, label, boardsRead, boardsTotal: manifest.cards.length,
        allRead, recalled, wellRead, masteredOnce, masteredTwice,
        bestScore: q.bestScore ?? null, bestTotal: q.bestTotal ?? null
      };
    },

    /** Get the read/unread state for a single board (card number).
     *  Boards only carry a read/unread distinction; quiz/mastery is path-level. */
    getBoardState(cardNumber) {
      const data = get({ subscribe });
      const b = data.boards[cardNumber];
      return { state: b && b.firstOpenedAt ? 'checked' : 'unwandered' };
    },

    /** Get overall progress count */
    getOverall() {
      const data = get({ subscribe });
      return { read: Object.keys(data.boards).length };
    },

    /** Consecutive-day study streak. */
    getStreak() {
      return computeStreak(get({ subscribe }).activity || {});
    },

    /** Last `n` days of activity, oldest → newest, for the consistency chart. */
    getActivity(n = 7) {
      const act = get({ subscribe }).activity || {};
      const out = [];
      for (let i = n - 1; i >= 0; i--) {
        const dt = new Date();
        dt.setDate(dt.getDate() - i);
        const key = dayKey(dt);
        out.push({ key, weekday: 'SMTWTFS'[dt.getDay()], count: act[key] || 0, active: !!act[key] });
      }
      return out;
    },

    /** Boards first opened in the last 7 days (a simple weekly pace). */
    getPace() {
      const data = get({ subscribe });
      const since = Date.now() - 7 * DAY_MS;
      let n = 0;
      for (const k in data.boards) {
        const t = data.boards[k].firstOpenedAt;
        if (t && new Date(t).getTime() >= since) n++;
      }
      return n;
    },

    /** Earned-medal flags derived from real progress. */
    getMedals() {
      const data = get({ subscribe });
      const boardCount = Object.keys(data.boards).length;
      const quizzes = Object.values(data.quizzes || {});
      const quizCount = quizzes.reduce((a, arr) => a + (arr ? arr.length : 0), 0);
      const perfect = quizzes.some(arr => (arr || []).some(q => q.total > 0 && q.score === q.total));
      const topicComplete = Object.values(PATHS).some(m => m.cards.every(n => data.boards[n] && data.boards[n].firstOpenedAt));
      return [
        { key: 'first_board', label: 'First board', earned: boardCount >= 1 },
        { key: 'first_quiz', label: 'First check', earned: quizCount >= 1 },
        { key: 'streak_7', label: '7-day streak', earned: computeStreak(data.activity || {}) >= 7 },
        { key: 'topic_complete', label: 'Topic complete', earned: topicComplete },
        { key: 'perfect_quiz', label: 'Perfect check', earned: perfect }
      ];
    },

    /** Reset all progress (for testing) */
    reset() {
      const empty = { version: 2, boards: {}, paths: {}, quizzes: {}, activity: {} };
      set(empty);
      persist(empty);
    }
  };
}

export const progress = createProgressStore();
