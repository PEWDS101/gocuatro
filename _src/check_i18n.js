/**
 * Coverage check for the translation layer.
 *
 *   node _src/check_i18n.js
 *
 * Reads the BUILT pages, so build first. Reports per locale:
 *   MISSING  — a data-i18n / data-i18n-attr key used in the markup with no
 *              value in that language. On en it means a blank on screen; on ar
 *              or ckb it means the visitor gets English back.
 *   UNUSED   — a key defined here that no page references any more.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PAGES = ['index', 'about', 'services', 'work', 'process', 'contact'];

// Keys main.js resolves itself, so they never appear in the markup.
// show.d1..d8 are built dynamically at main.js:463 — t('show.d' + n) — which is
// why grepping for the literal key finds nothing. Do not "clean them up".
const FROM_JS = [
  'form.subject',
  'show.d1', 'show.d2', 'show.d3', 'show.d4',
  'show.d5', 'show.d6', 'show.d7', 'show.d8',
];

const used = new Map();
const note = (k, where) => {
  if (!used.has(k)) used.set(k, []);
  used.get(k).push(where);
};
for (const k of FROM_JS) note(k, 'js/main.js');

for (const name of PAGES) {
  const file = path.join(ROOT, name + '.html');
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  for (const m of html.matchAll(/data-i18n="([^"]+)"/g)) note(m[1], name);
  // data-i18n-attr="content:meta.description" — the key is after the colon,
  // and one attribute can carry several pairs separated by a comma
  for (const m of html.matchAll(/data-i18n-attr="([^"]+)"/g)) {
    for (const pair of m[1].split(',')) {
      const key = pair.split(':')[1];
      if (key) note(key.trim(), name);
    }
  }
}

global.window = {};
new Function(fs.readFileSync(path.join(ROOT, 'js', 'translations.js'), 'utf8'))();
const L = global.window.GC_I18N;

let bad = 0;
for (const [code, loc] of Object.entries(L)) {
  const defined = new Set(Object.keys(loc.strings));
  const missing = [...used.keys()].filter(k => !defined.has(k));
  const unused = [...defined].filter(k => !used.has(k));

  console.log(`\n${code.toUpperCase()}  ${defined.size} defined, ${used.size} used in markup`);
  if (missing.length) {
    bad += missing.length;
    console.log(`  MISSING (${missing.length}):`);
    for (const k of missing) console.log(`    ${k}   [${used.get(k).join(', ')}]`);
  } else {
    console.log('  MISSING: none');
  }
  if (unused.length) console.log(`  UNUSED (${unused.length}): ${unused.slice(0, 12).join(', ')}${unused.length > 12 ? ' …' : ''}`);
}

console.log(bad ? `\nFAIL — ${bad} missing value(s)` : '\nOK — every key in the markup has a value in every language');
process.exit(bad ? 1 : 0);
