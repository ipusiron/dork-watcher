const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

test('CSP, local classic scripts, referrer, viewport, noscript and favicon', () => {
  const csp = html.match(/http-equiv="Content-Security-Policy"\s+content="([^"]+)"/);
  assert.ok(csp);
  assert.equal(csp[1], "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; " +
    "font-src 'self'; connect-src 'none'; base-uri 'none'; form-action 'none'; object-src 'none'");
  assert.doesNotMatch(html, /frame-ancestors|unsafe-inline|unsafe-eval|\stype="module"|\son\w+\s*=|\sstyle\s*=/i);
  assert.match(html, /name="referrer" content="no-referrer"/);
  assert.match(html, /name="viewport"/);
  assert.match(html, /<noscript>/);
  const icons = [...html.matchAll(/<link[^>]*rel="(?:icon|apple-touch-icon)"[^>]*>/g)];
  assert.equal(icons.length, 1);
  assert.match(icons[0][0], /href="assets\/favicon.svg"/);
  assert.doesNotMatch(html, /favicon\//);
  const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)];
  assert.deepEqual(scripts.map(m => m[1]), ['domain.js', 'query.js', 'dorks.js', 'script.js']);
});

test('stable ids, bilingual help, dialog and accessible notifications', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ['siteUrl', 'categoryFilter', 'riskFilter', 'operatorFilter', 'operatorStyle',
    'results', 'resultsCounter', 'helpModal', 'appTitle', 'generateButton', 'statusMessage']) {
    assert.ok(ids.includes(id), id);
  }
  assert.match(html, /id="helpJa" lang="ja"/);
  assert.match(html, /id="helpEn" lang="en"/);
  assert.match(html, /🔤 公式演算子と非公式演算子/);
  assert.match(html, /🔤 Documented and undocumented operators/);
  assert.match(html, /role="dialog" aria-modal="true" aria-labelledby="helpTitle"/);
  assert.match(html, /id="resultsCounter"[^>]+aria-live="polite"/);
  assert.doesNotMatch(html.match(/<h1>[\s\S]*?<\/h1>/)[0], /resultsCounter/);
  assert.equal((html.match(/<select id="categoryFilter">([\s\S]*?)<\/select>/)[1].match(/<option/g) || []).length, 1);
  for (const button of html.matchAll(/<button[^>]*class="(?:help-button|lang-toggle|theme-toggle)"[^>]*>/g)) {
    assert.match(button[0], /aria-label=/);
  }
});
