const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');

test('pure classic/CommonJS modules and no diagnostic data logging', () => {
  for (const name of ['domain.js', 'query.js', 'dorks.js']) {
    const source = read(name);
    assert.doesNotMatch(source, /\b(?:document|window|localStorage|navigator)\b/);
    assert.match(source, /if \(typeof module !== "undefined" && module.exports\) \{/);
    assert.match(source, /module.exports = [\s\S]*;\s*}\s*$/);
    assert.doesNotMatch(source, /\bexport\s/);
  }
  for (const name of fs.readdirSync(root).filter(name => name.endsWith('.js'))) {
    assert.doesNotMatch(read(name), /console\.(?:log|debug|info)\s*\(/);
  }
});

test('safe DOM insertion, settings guards and one styled query for all row consumers', () => {
  const source = read('script.js');
  assert.doesNotMatch(source, /\.innerHTML\s*=/);
  assert.doesNotMatch(source, /execCommand|button\[onclick/);
  const readSetting = source.match(/function readSetting\([\s\S]*?\n}/)[0];
  const writeSetting = source.match(/function writeSetting\([\s\S]*?\n}/)[0];
  assert.match(readSetting, /try[\s\S]*localStorage.getItem[\s\S]*catch/);
  assert.match(writeSetting, /try[\s\S]*localStorage.setItem[\s\S]*catch/);
  assert.doesNotMatch(source.replace(readSetting, '').replace(writeSetting, ''), /localStorage\./);
  assert.match(source, /const q = buildQuery\(domain, applyOperatorStyle\(dork.query, style\)\)/);
  assert.match(source, /filterDorks\(prepared, category, risk, operator\)/);
  assert.match(source, /encodeURIComponent\(q\)/);
  assert.match(source, /link.textContent = q/);
  assert.match(source, /copyQuery\(q\)/);
  assert.match(source, /isOfficialQuery\(q\)/);
  assert.doesNotMatch(source, /dork\.official/);
});

test('dependency-free Node 22 CI', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.deepEqual(pkg, { name: 'dork-watcher', private: true, scripts: { test: 'node --test' } });
  const workflow = read('.github/workflows/test.yml');
  assert.match(workflow, /on: \[push, pull_request\]/);
  assert.match(workflow, /node-version: 22/);
  assert.match(workflow, /run: npm test/);
  assert.doesNotMatch(workflow, /npm (?:install|ci)|pip install/);
});
