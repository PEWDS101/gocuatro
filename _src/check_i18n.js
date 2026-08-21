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
  // the brief form composes its WhatsApp / mail body in main.js, so these
  // never appear as a data-i18n attribute anywhere
  'form.subject', 'form.briefTitle', 'form.errSummary', 'form.sending',
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

/* ── fallback drift ───────────────────────────────────────────────────────
   The text INSIDE a data-i18n element is the English fallback. It is what
   ships in the HTML, what a search engine reads, and what a visitor sees if
   the translation layer never runs — so it has to say the same thing as the
   `en` string, and nothing keeps them in step automatically.

   It had drifted: the move to dinars updated `en` but left the FAQ quoting
   $75/$200/$500 and two notes saying "US dollars" in the shipped markup. A
   crawler would have indexed prices the site no longer charges.

   Only elements whose content is plain text are compared — a few carry an
   <i> or a nested <span>, and those are the translator's problem, not this
   check's. Whitespace is normalised, because the partials wrap for reading. */
const FALLBACK_SKIP = new Set([
  // titles are the <title> element; build.py writes them from META, not from
  // the same string the switcher uses, and they are checked by eye
  'meta.title', 'meta.about.title', 'meta.services.title', 'meta.work.title',
  'meta.process.title', 'meta.contact.title',
]);

let drift = 0;
const flat = s => s.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
                   .replace(/\s+/g, ' ').trim();

for (const name of PAGES) {
  const file = path.join(ROOT, name + '.html');
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  // <tag ... data-i18n="key" ...>TEXT</tag>, text only, no nested elements
  const re = /<([a-z0-9]+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>([^<]*)<\/\1>/gi;
  for (const m of html.matchAll(re)) {
    const [, , key, text] = m;
    if (FALLBACK_SKIP.has(key)) continue;
    const want = L.en && L.en.strings[key];
    if (want == null) continue;
    if (flat(text) !== flat(want)) {
      drift++;
      console.log(`\nDRIFT ${name}.html  ${key}`);
      console.log(`   markup: ${flat(text).slice(0, 88)}`);
      console.log(`   en:     ${flat(want).slice(0, 88)}`);
    }
  }
}
if (!drift) console.log('\nFALLBACK: shipped English matches every `en` string');

/* ── bidi trap ────────────────────────────────────────────────────────────
   An en or em dash between two European digits is a bidi NEUTRAL. Inside an
   RTL line "2 – 5" resolves as "5 – 2" and "$200–$500" comes apart. A value
   rendered in its own dir="ltr" element is safe; a string handed straight to
   textContent inside an Arabic or Kurdish paragraph is not — and a <select>
   option cannot carry a reliable dir at all. This caught the page-count
   dropdown reading "5 – 2" in both RTL languages.

   The fix is to write the range in words ("from 2 to 5"), or to move the value
   into its own dir="ltr" element in the markup. Never a CSS transform. */
const RANGE = /[0-9]\s*[–—]\s*[0-9]/;
let bidi = 0;
for (const [code, loc] of Object.entries(L)) {
  if (loc.dir !== 'rtl') continue;
  for (const [k, v] of Object.entries(loc.strings)) {
    if (RANGE.test(v)) {
      bidi++;
      console.log(`\nBIDI  ${code} ${k}: "${v}" — a dash between digits reverses in RTL`);
    }
  }
}
if (!bidi) console.log('\nBIDI: no reversible digit range in any RTL string');

const problems = bad + bidi + drift;
console.log(problems
  ? `\nFAIL — ${bad} missing value(s), ${bidi} reversible range(s)`
  : '\nOK — every key in the markup has a value in every language');
process.exit(problems ? 1 : 0);
