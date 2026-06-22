#!/usr/bin/env node
/**
 * Ingest a batch of BBs (JSON) into the existing Supabase `cards` table.
 * The JSON-batch sibling of strata-sheets-script.js's "Publish to Supabase" —
 * same table, same service-role-key model, file-based instead of Forms-based.
 *
 * Usage:
 *   node --env-file=.env.local scripts/ingest-bbs.mjs path/to/batch.json
 *
 * Requires in the environment (never the anon key):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Batch shape:
 * {
 *   "boards": [
 *     {
 *       "kicker": "BB 85",
 *       "title": "...",
 *       "image": "./assets/card-85.png",          // local path, optional
 *       "tags": { "subject", "topic", "concept", "ground", "buildsOn": [] },
 *       "floors": [
 *         { "content": null },                     // floor 0, image-only swipe card
 *         { "content": "<p>...</p>", "audio": "./assets/85-f1.mp3" },
 *         { "content": "<p>...</p>", "image": "./assets/85-f2.png" }
 *       ]
 *     }
 *   ]
 * }
 *
 * Numbering: if a board's kicker already contains a number (e.g. "BB 85"),
 * that number is used as sort_order directly — so re-running the same batch
 * later with image/audio fields filled in updates those same rows instead
 * of creating duplicates. Only boards with no number in their kicker get a
 * fresh auto-assigned number (printed at the end — copy it into the kicker
 * before any later re-run of that board).
 */
import { readFileSync } from 'fs';
import { basename, extname } from 'path';
import { createClient } from '@supabase/supabase-js';

const STATIC_DECK_LENGTH = 84;

function fail(msg) {
  console.error('ERROR:', msg);
  process.exit(1);
}

const batchPath = process.argv[2];
if (!batchPath) fail('usage: node scripts/ingest-bbs.mjs path/to/batch.json');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  fail('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (use --env-file=.env.local, never the anon key)');
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const batch = JSON.parse(readFileSync(batchPath, 'utf-8'));
if (!Array.isArray(batch.boards) || batch.boards.length === 0) {
  fail('batch JSON must have a non-empty "boards" array');
}

function contentTypeFor(path) {
  const ext = extname(path).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.gif') return 'image/gif';
  if (ext === '.mp3') return 'audio/mpeg';
  if (ext === '.wav') return 'audio/wav';
  return 'application/octet-stream';
}

async function uploadLocalFile(localPath, bucket) {
  const fileBuffer = readFileSync(localPath);
  const storagePath = `${Date.now()}-${basename(localPath)}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, fileBuffer, { contentType: contentTypeFor(localPath), upsert: true });
  if (error) throw new Error(`upload ${localPath} -> ${bucket}: ${error.message}`);
  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  return data.publicUrl;
}

async function buildLayer(floor) {
  if (!floor || (floor.content == null && !floor.image && !floor.audio)) return null;

  const img = floor.image ? await uploadLocalFile(floor.image, 'card-images') : null;
  const audio = floor.audio ? await uploadLocalFile(floor.audio, 'card-audio') : null;

  if (!img && !audio) return floor.content ?? null;
  return { text: floor.content || '', img, audio };
}

async function main() {
  const { data: maxRow, error: maxErr } = await supabase
    .from('cards')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1);
  if (maxErr) fail(maxErr.message);

  let nextOrder = Math.max(maxRow?.[0]?.sort_order || 0, STATIC_DECK_LENGTH) + 1;

  const rows = [];
  const failures = [];
  const autoAssigned = [];

  for (const board of batch.boards) {
    try {
      const kickerNum = parseInt((board.kicker || '').match(/\d+/)?.[0], 10);
      const sortOrder = Number.isFinite(kickerNum) ? kickerNum : nextOrder++;
      if (!Number.isFinite(kickerNum)) autoAssigned.push(`${board.kicker || '(no kicker)'} -> ${sortOrder}`);

      const img_url = board.image ? await uploadLocalFile(board.image, 'card-images') : null;
      const layers = [];
      for (const floor of board.floors || []) {
        layers.push(await buildLayer(floor));
      }
      rows.push({
        sort_order: sortOrder,
        act: 'I', // "Act" is retired terminology, kept only to satisfy the table's NOT NULL constraint
        kicker: board.kicker,
        title: board.title,
        layers,
        img_url,
        tags: board.tags || null
      });
    } catch (e) {
      failures.push(`${board.kicker || '(no kicker)'}: ${e.message}`);
    }
  }

  if (rows.length > 0) {
    const { error } = await supabase
      .from('cards')
      .upsert(rows, { onConflict: 'sort_order' });
    if (error) fail(error.message);
  }

  console.log(`Ingested ${rows.length} / ${batch.boards.length} board(s).`);
  console.log('sort_order used:', rows.map(r => r.sort_order).join(', '));
  if (autoAssigned.length > 0) {
    console.log('Auto-assigned (no number in kicker) — copy these into your JSON before any later re-run:');
    autoAssigned.forEach(a => console.log('  -', a));
  }
  if (failures.length > 0) {
    console.log('Failures:');
    failures.forEach(f => console.log('  -', f));
    process.exitCode = 1;
  }
}

main();
