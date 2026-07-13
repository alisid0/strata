import { supabase } from '../supabase.js';
import { get } from 'svelte/store';
import { user } from './auth.js';

const KEY = 'qubix-issue-reports-v1';

function queuedReports() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}

function saveQueue(items) {
  try { localStorage.setItem(KEY, JSON.stringify(items.slice(-50))); } catch {}
}

function sanitizeFilename(name = 'screenshot') {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').slice(0, 80) || 'screenshot';
}

function basePayload(report, screenshotPath = null) {
  const currentUser = get(user);
  return {
    user_id: currentUser?.id || null,
    category: report.category || 'bug',
    message: report.message,
    route: report.route || location.pathname,
    bbid: report.bbid || null,
    workshop_id: report.workshopId || null,
    screenshot_path: screenshotPath,
    app_version: report.appVersion || 'web',
    user_agent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1
    },
    metadata: report.metadata || {}
  };
}

async function uploadScreenshot(file) {
  const currentUser = get(user);
  if (!file || !currentUser) return null;
  const path = `${currentUser.id}/${Date.now()}-${sanitizeFilename(file.name)}`;
  const { error } = await supabase.storage
    .from('issue-screenshots')
    .upload(path, file, { upsert: false });
  if (error) throw error;
  return path;
}

export async function submitIssueReport(report, screenshotFile = null) {
  let screenshotPath = null;
  try {
    screenshotPath = await uploadScreenshot(screenshotFile);
    const payload = basePayload(report, screenshotPath);
    const { error } = await supabase.from('issue_reports').insert(payload);
    if (error) throw error;
    return { queued: false };
  } catch (error) {
    const queue = queuedReports();
    queue.push({
      ...basePayload(report, screenshotPath),
      queued_at: new Date().toISOString(),
      screenshot_queued_locally: !!screenshotFile && !screenshotPath
    });
    saveQueue(queue);
    return { queued: true, error };
  }
}

export async function retryIssueReportQueue() {
  const queue = queuedReports();
  if (!queue.length) return { sent: 0, remaining: 0 };

  const remaining = [];
  let sent = 0;
  for (const item of queue) {
    try {
      const { queued_at, screenshot_queued_locally, ...payload } = item;
      const { error } = await supabase.from('issue_reports').insert(payload);
      if (error) throw error;
      sent += 1;
    } catch (_) {
      remaining.push(item);
    }
  }
  saveQueue(remaining);
  return { sent, remaining: remaining.length };
}

export function getQueuedIssueCount() {
  return queuedReports().length;
}

