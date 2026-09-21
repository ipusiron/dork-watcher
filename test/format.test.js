const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');

test('source remains readable: line limits and non-minified primary files', () => {
  const files = ['domain.js', 'query.js', 'dorks.js', 'script.js', 'style.css', 'index.html',
    ...fs.readdirSync(__dirname).filter(name => name.endsWith('.js')).map(name => 'test/' + name)];
  for (const file of files) {
    const lines = fs.readFileSync(path.join(root, file), 'utf8').split(/\r?\n/);
    const limit = file.endsWith('.html') ? 250 : 160;
    lines.forEach((line, i) => assert.ok(line.length <= limit, `${file}:${i + 1}: ${line.length} > ${limit}`));
  }
  for (const [file, minimum] of Object.entries({
    'domain.js': 25, 'query.js': 30, 'dorks.js': 200, 'script.js': 200, 'style.css': 200, 'index.html': 100
  })) {
    assert.ok(fs.readFileSync(path.join(root, file), 'utf8').split('\n').length >= minimum);
  }
});
