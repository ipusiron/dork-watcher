const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { dorks } = require('../dorks');
const { filterDorks, categoriesOf, operatorsIn, applyOperatorStyle } = require('../query');

const root = path.resolve(__dirname, '..');
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');

function table(header) {
  const start = readme.indexOf(header);
  assert.notEqual(start, -1, header);
  const rows = [];
  for (const line of readme.slice(start).split(/\r?\n/).slice(2)) {
    if (!line.startsWith('|')) break;
    rows.push(line.split('|').slice(1, -1).map(cell => cell.trim()));
  }
  return rows;
}

test('README category/risk and category/operator tables match all five rows', () => {
  const categories = [...categoriesOf(dorks), 'all'];
  const riskRows = table('| カテゴリー | 件数 | High | Medium | Low |');
  const operatorRows = table('| カテゴリー | 件数 | 公式のみ | 非公式を含む |');
  assert.equal(riskRows.length, 5);
  assert.equal(operatorRows.length, 5);
  categories.forEach((category, i) => {
    const name = category === 'all' ? '合計' : category;
    assert.deepEqual(riskRows[i], [name, ...['all', 'high', 'medium', 'low']
      .map(risk => String(filterDorks(dorks, category, risk).length))]);
    assert.deepEqual(operatorRows[i], [name, ...['all', 'official', 'unofficial']
      .map(operator => String(filterDorks(dorks, category, 'all', operator).length))]);
  });
});

test('README operator usage and both style totals agree with definitions', () => {
  const rows = table('| 演算子 | 区分 | はたらき | 本ツールでの使用 |');
  assert.equal(rows.length, 10);
  const expected = { filetype: 12, '""': 12, inurl: 9, intitle: 5, intext: 1 };
  for (const [operator, count] of Object.entries(expected)) {
    const actual = dorks.filter(dork => operator === '""'
      ? /"[^"]*"/.test(dork.query) : operatorsIn(dork.query).includes(operator)).length;
    assert.equal(actual, count);
    const label = operator === '""' ? '`""`' : '`' + operator + ':`';
    assert.equal(rows.find(row => row[0] === label)[3], actual + '件');
  }
  assert.equal(rows.find(row => row[0] === '`site:`')[3], '全' + dorks.length + '件に前置');
  const changed = dorks.filter(dork => applyOperatorStyle(dork.query, 'ext') !== dork.query).length;
  assert.equal(rows.find(row => row[0] === '`ext:`')[3], '表記を切り替えると' + changed + '件');
  const totals = table('| 表記 | 公式のみ | 非公式を含む |');
  assert.equal(totals.length, 2);
  ['filetype', 'ext'].forEach((style, i) => {
    assert.deepEqual(totals[i].slice(1), ['official', 'unofficial']
      .map(operator => String(filterDorks(dorks, 'all', 'all', operator, style).length)));
  });
  assert.doesNotMatch(readme, /allin(?:text|title|url):[A-Za-z"]/);
});

test('README YAML retains identifiers, comment delimiters and block lists', () => {
  const metadata = readme.match(/^<!--\r?\n---\r?\n([\s\S]+?)\r?\n---\r?\n-->/);
  assert.ok(metadata);
  for (const [key, value] of Object.entries({
    id: 'day020', slug: 'dork-watcher', title: '"Dork Watcher"',
    repo_url: '"https://github.com/ipusiron/dork-watcher"',
    demo_url: '"https://ipusiron.github.io/dork-watcher/"', hub: 'true'
  })) {
    assert.ok(metadata[1].split(/\r?\n/).includes(key + ': ' + value), key);
  }
  for (const key of ['category_ja', 'category_en', 'tags']) {
    assert.match(metadata[1], new RegExp(key + ':\\r?\\n  - \\S'));
  }
  const keys = [...metadata[1].matchAll(/^(\w+):/gm)].map(match => match[1]);
  assert.deepEqual(keys, [
    'id', 'slug', 'title', 'subtitle_ja', 'subtitle_en', 'description_ja', 'description_en',
    'category_ja', 'category_en', 'difficulty', 'tags', 'repo_url', 'demo_url', 'hub'
  ]);
});

test('README image references exist and use four new captures plus the retained DDG image', () => {
  const images = [...readme.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)]
    .map(match => match[1]).filter(file => !/^https?:/.test(file));
  assert.deepEqual(images, [
    'assets/screenshot2.png', 'assets/screenshot3.png', 'assets/screenshot4.png',
    'assets/screenshot5.png', 'assets/ddg_chatgpt_share.png'
  ]);
  images.forEach(file => assert.ok(fs.statSync(path.join(root, file)).isFile(), file));
});

test('README tree lists every file and directory with aligned descriptions', () => {
  const block = readme.match(/## 📁 ディレクトリー構造\s+```text\n([\s\S]+?)\n```/);
  assert.ok(block);
  const lines = block[1].split('\n');
  assert.match(lines[0], /^dork-watcher\/\s+# \S/);
  const columns = lines.map(line => line.indexOf('#'));
  assert.ok(columns.every(column => column === columns[0]));
  const listed = [];
  const parents = [];
  for (const line of lines.slice(1)) {
    const match = line.match(/^([│ ]*)(?:├── |└── )([^#]+?)\s+# (\S.*)$/);
    assert.ok(match, line);
    const depth = match[1].length / 4;
    assert.ok(Number.isInteger(depth), line);
    const name = match[2].trim();
    parents.length = depth;
    const relative = [...parents, name.replace(/\/$/, '')].join('/');
    listed.push(relative + (name.endsWith('/') ? '/' : ''));
    if (name.endsWith('/')) parents.push(name.slice(0, -1));
  }
  function inventory(directory, prefix = '') {
    return fs.readdirSync(directory, { withFileTypes: true })
      .filter(entry => !['.git', '.claude'].includes(entry.name))
      .flatMap(entry => {
        const relative = prefix + entry.name;
        return entry.isDirectory()
          ? [relative + '/', ...inventory(path.join(directory, entry.name), relative + '/')]
          : [relative];
      });
  }
  assert.deepEqual(listed.sort(), inventory(root).sort());
});

test('ユースケースの「このツールならではの使い方」を query.js / domain.js で再計算（日英）', () => {
  const { buildQuery, isOfficialQuery, toExtStyle } = require('../query');
  const { normalizeDomain } = require('../domain');
  const en = fs.readFileSync(path.join(root, 'README.en.md'), 'utf8');
  assert.equal(buildQuery('example.com', 'filetype:xls'), 'site:example.com filetype:xls');
  assert.equal(isOfficialQuery('filetype:pdf'), true);
  assert.equal(isOfficialQuery('ext:pdf'), false);
  assert.equal(toExtStyle('filetype:pdf'), 'ext:pdf');
  assert.deepEqual(normalizeDomain('https://Example.COM/path?q=1'), { ok: true, domain: 'example.com' });
  assert.equal(normalizeDomain('not a domain').ok, false);
  for (const md of [readme, en]) {
    assert.ok(md.includes('site:example.com filetype:xls'));
    assert.ok(md.includes('example.com'));
  }
});
