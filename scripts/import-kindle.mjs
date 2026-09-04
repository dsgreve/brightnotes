#!/usr/bin/env node
/**
 * Import Kindle highlights from https://read.amazon.com/notebook into
 * src/data/highlights.json.
 *
 * How it works
 * ------------
 * 1. Opens a real Chromium window (Playwright). On the first run you sign in to
 *    Amazon by hand; the session is saved to scripts/.amazon-auth.json (gitignored)
 *    and reused on later runs until it expires.
 * 2. Scrolls the full library sidebar, then for each book fetches every page of
 *    highlights from the same endpoint the notebook page uses, from inside the
 *    logged-in page context (so cookies / CSRF just work).
 * 3. Merges into the existing highlights.json: new highlights are added, existing
 *    rows (and any manual edits to them) are kept. Dedupe key = ASIN + location +
 *    normalized text.
 *
 * Usage
 * -----
 *   npm run import:kindle                 # full sync
 *   npm run import:kindle -- --check      # just report login state + book count
 *   npm run import:kindle -- --limit=3    # only the first 3 books (testing)
 *   npm run import:kindle -- --debug      # dump raw HTML of the first book
 *   npm run import:kindle -- --prune      # also delete rows no longer in Amazon
 *   npm run import:kindle -- --no-sort    # keep file order, just append new rows
 *   npm run import:kindle -- --headless   # no window (only works with a live session)
 *
 * Note: Amazon's Conditions of Use disallow automated collection. This is for
 * pulling your *own* highlights, occasionally. Keep the throttle, reuse the saved
 * session instead of re-logging, and don't put it on a schedule.
 */

import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const AUTH_PATH = resolve(HERE, '.amazon-auth.json');
const DATA_PATH = resolve(HERE, '../src/data/highlights.json');
const NOTEBOOK_URL = 'https://read.amazon.com/notebook';
const LIBRARY_ITEM = '.kp-notebook-library-each-book';

const flags = parseFlags(process.argv.slice(2));

main().catch((err) => {
  console.error('\n✗', err.message || err);
  process.exit(1);
});

async function main() {
  if (flags.help) return console.log(usage());

  const browser = await chromium.launch({ headless: flags.headless });
  const context = await browser.newContext({
    locale: 'en-US',
    ...(existsSync(AUTH_PATH) ? { storageState: AUTH_PATH } : {}),
  });
  const page = await context.newPage();

  try {
    await ensureNotebook(page, context);
    const total = await loadFullLibrary(page);
    let books = await extractBooks(page);
    console.log(`Library: ${books.length} books (${total} tiles loaded)`);

    if (flags.limit) books = books.slice(0, flags.limit);

    if (flags.check) {
      books.slice(0, 5).forEach((b) => console.log(`  · ${b.title} — ${b.author}`));
      return;
    }

    const scraped = [];
    for (let i = 0; i < books.length; i++) {
      const b = books[i];
      if (flags.debug && i === 0) await dumpDebugHtml(page, b.asin);
      const highlights = await fetchBookHighlights(page, b.asin);
      scraped.push({ ...b, highlights });
      console.log(
        `  [${String(i + 1).padStart(3)}/${books.length}] ${highlights.length
          .toString()
          .padStart(4)} highlights  ${b.title.slice(0, 60)}`
      );
      await page.waitForTimeout(400 + Math.random() * 500); // throttle
    }

    await mergeAndWrite(scraped);
  } finally {
    await context.storageState({ path: AUTH_PATH }).catch(() => {});
    await browser.close();
  }
}

/* ------------------------------------------------------------------ auth ---- */

async function ensureNotebook(page, context) {
  await page.goto(NOTEBOOK_URL, { waitUntil: 'domcontentloaded' });
  try {
    await page.waitForSelector(LIBRARY_ITEM, { timeout: 10_000 });
    return; // already signed in
  } catch {
    /* fall through to manual login */
  }

  if (flags.headless) {
    throw new Error(
      'No valid session and --headless was set. Run once without --headless to sign in.'
    );
  }

  console.log('\n>> Sign in to Amazon in the browser window. Waiting up to 5 minutes…\n');
  await page.waitForSelector(LIBRARY_ITEM, { timeout: 5 * 60_000 });
  await context.storageState({ path: AUTH_PATH });
  console.log(`Session saved → ${rel(AUTH_PATH)}\n`);
}

/* ---------------------------------------------------------------- library ---- */

async function loadFullLibrary(page) {
  let stableFor = 0;
  let prev = -1;
  for (let i = 0; i < 200 && stableFor < 2; i++) {
    const count = await page.locator(LIBRARY_ITEM).count();
    stableFor = count === prev ? stableFor + 1 : 0;
    prev = count;
    await page
      .locator(LIBRARY_ITEM)
      .last()
      .scrollIntoViewIfNeeded()
      .catch(() => {});
    await page
      .locator('#kp-notebook-library-spinner')
      .waitFor({ state: 'hidden', timeout: 4000 })
      .catch(() => {});
    await page.waitForTimeout(600);
  }
  return page.locator(LIBRARY_ITEM).count();
}

function extractBooks(page) {
  return page.$$eval('.kp-notebook-library-each-book', (els) => {
    const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
    return els
      .map((el) => ({
        asin: el.id,
        title: clean(
          el.querySelector('h2.kp-notebook-searchable, .kp-notebook-searchable')?.textContent
        ),
        author: clean(el.querySelector('p.kp-notebook-searchable')?.textContent).replace(
          /^By:?\s*/i,
          ''
        ),
        cover: el.querySelector('img.kp-notebook-cover-image, img')?.src || '',
      }))
      .filter((b) => b.asin && b.title);
  });
}

/* ------------------------------------------------------------- highlights ---- */

function fetchBookHighlights(page, asin) {
  return page.evaluate(async (asin) => {
    const BASE = 'https://read.amazon.com';
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const parse = (html) => new DOMParser().parseFromString(html, 'text/html');
    const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

    const rows = [];
    let url = `${BASE}/notebook?asin=${asin}&contentLimitState=&`;
    let guard = 0;

    while (url && guard++ < 200) {
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) break;
      const doc = parse(await res.text());

      const lastUpdated =
        doc.querySelector('#kp-notebook-annotated-date')?.value ||
        clean(doc.querySelector('.kp-notebook-annotated-date')?.textContent) ||
        '';

      doc.querySelectorAll('.kp-notebook-highlight').forEach((wrap) => {
        const text = clean(wrap.querySelector('#highlight')?.textContent || wrap.textContent);
        if (!text) return;

        const box = wrap.closest('.a-row.a-spacing-base') || wrap.parentElement || wrap;
        const header = clean(box.querySelector('#annotationHighlightHeader')?.textContent);

        // Colour: from the class (language-independent), fall back to header text.
        const color = (
          (wrap.className.match(/kp-notebook-highlight-(yellow|blue|pink|orange)/i) ||
            header.match(/(yellow|blue|pink|orange)/i) ||
            [])[1] || ''
        ).toLowerCase();

        const location =
          box.querySelector('#kp-annotation-location')?.value ||
          (header.match(/[:#]\s*([\d,]+)\s*$/) || [])[1]?.replace(/,/g, '') ||
          '';

        rows.push({
          text,
          note: clean(box.querySelector('#note')?.textContent),
          color,
          location: String(location),
          lastUpdated,
        });
      });

      const next = doc.querySelector('.kp-notebook-annotations-next-page-start')?.value;
      const state = doc.querySelector('.kp-notebook-content-limit-state')?.value || '';
      url = next
        ? `${BASE}/notebook?asin=${asin}&token=${encodeURIComponent(
            next
          )}&contentLimitState=${encodeURIComponent(state)}`
        : null;
      await sleep(250);
    }
    return rows;
  }, asin);
}

async function dumpDebugHtml(page, asin) {
  const html = await page.evaluate(async (asin) => {
    const r = await fetch(`https://read.amazon.com/notebook?asin=${asin}&contentLimitState=&`, {
      credentials: 'include',
    });
    return r.text();
  }, asin);
  const out = resolve(HERE, `debug-${asin}.html`);
  await writeFile(out, html);
  console.log(`  debug: wrote ${rel(out)} (${html.length} bytes)`);
}

/* ------------------------------------------------------------------ merge ---- */

async function mergeAndWrite(scraped) {
  const existing = JSON.parse(await readFile(DATA_PATH, 'utf8').catch(() => '[]'));

  const byKey = new Map();
  const existingKeys = new Set();
  for (const row of existing) {
    const k = keyOf(asinOf(row['Book URL']), row['Location'], row['Highlight Text']);
    byKey.set(k, row);
    existingKeys.add(k);
  }

  const scrapedKeys = new Set();
  let added = 0;
  let scrapedCount = 0;

  for (const b of scraped) {
    for (const h of b.highlights) {
      scrapedCount++;
      const k = keyOf(b.asin, h.location, h.text);
      scrapedKeys.add(k);
      if (byKey.has(k)) continue;
      byKey.set(k, {
        Title: b.title,
        Author: b.author,
        'Book URL': `https://www.amazon.com/dp/${b.asin}`,
        'Book Cover': b.cover,
        'Last Updated on': h.lastUpdated,
        'Highlight Text': h.text,
        Note: h.note || '',
        Color: h.color || '',
        Location: h.location || '',
      });
      added++;
    }
  }

  if (scrapedCount === 0) {
    throw new Error(
      'Scraped 0 highlights — the page markup has probably changed. Re-run with --debug and check scripts/debug-*.html.'
    );
  }

  const stale = [...existingKeys].filter((k) => !scrapedKeys.has(k));
  let merged = [...byKey.values()];

  if (flags.prune && stale.length) {
    merged = merged.filter((row) =>
      scrapedKeys.has(keyOf(asinOf(row['Book URL']), row['Location'], row['Highlight Text']))
    );
  }

  if (flags.sort) {
    merged.sort(
      (a, b) =>
        String(a.Title).localeCompare(String(b.Title)) ||
        (Number(a.Location) || 0) - (Number(b.Location) || 0)
    );
  }

  await writeFile(DATA_PATH, JSON.stringify(merged, null, 2) + '\n', 'utf8');

  console.log('\n─ summary ────────────────────────────');
  console.log(`  existing rows   ${existing.length}`);
  console.log(`  scraped         ${scrapedCount} (${scraped.length} books)`);
  console.log(`  added           ${added}`);
  console.log(
    `  stale in file   ${stale.length}${
      stale.length ? (flags.prune ? ' (removed)' : ' (kept — use --prune to drop)') : ''
    }`
  );
  console.log(`  written         ${merged.length} → ${rel(DATA_PATH)}`);
  console.log('──────────────────────────────────────');
}

/* ------------------------------------------------------------------ utils ---- */

function keyOf(asin, location, text) {
  const t = String(text || '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .slice(0, 240);
  return `${asin || ''}|${location || ''}|${t}`;
}

function asinOf(url) {
  const m = String(url || '').match(/\/dp\/([A-Za-z0-9]{10})/);
  return m ? m[1] : String(url || '').split('/').filter(Boolean).pop() || '';
}

function parseFlags(argv) {
  const f = { headless: false, sort: true, limit: 0 };
  for (const a of argv) {
    if (a === '--headless') f.headless = true;
    else if (a === '--no-sort') f.sort = false;
    else if (a === '--check') f.check = true;
    else if (a === '--debug') f.debug = true;
    else if (a === '--prune') f.prune = true;
    else if (a === '--help' || a === '-h') f.help = true;
    else if (a.startsWith('--limit=')) f.limit = parseInt(a.slice(8), 10) || 0;
    else console.warn(`(ignoring unknown flag: ${a})`);
  }
  return f;
}

function rel(p) {
  return p.replace(resolve(HERE, '..') + '/', '');
}

function usage() {
  return `import-kindle — pull Kindle highlights into src/data/highlights.json

  npm run import:kindle                 full sync
  npm run import:kindle -- --check      report login state + book count only
  npm run import:kindle -- --limit=N    only the first N books
  npm run import:kindle -- --debug      dump raw HTML of the first book
  npm run import:kindle -- --prune      delete rows no longer present in Amazon
  npm run import:kindle -- --no-sort    append new rows without reordering the file
  npm run import:kindle -- --headless   run without a window (needs a live session)
`;
}
