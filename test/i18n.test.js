const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const I18n = require(path.join(root, 'i18n.js'));
const { categoryKeys } = require(path.join(root, 'dorks.js'));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
// gフラグを付けるとlastIndexが残り、繰り返しの判定が交互に外れる。
const JAPANESE = /[぀-ヿ一-鿿]/;

test('日本語と英語で、キーの集合が同じ', () => {
  assert.ok(Object.keys(I18n.ja).length >= 45);
  assert.deepEqual(Object.keys(I18n.ja).filter(key => !(key in I18n.en)), []);
  assert.deepEqual(Object.keys(I18n.en).filter(key => !(key in I18n.ja)), []);
});

test('差し込みの名前が、日本語と英語で一致する', () => {
  const holes = value => [...String(value).matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort().join(',');
  assert.deepEqual(Object.keys(I18n.ja).filter(key => holes(I18n.ja[key]) !== holes(I18n.en[key])), []);
});

test('index.html が指すキーは、すべて辞書にある', () => {
  const keys = new Set();
  for (const m of html.matchAll(/data-i18n(?:-[a-z-]+)?="([^"]+)"/g)) keys.add(m[1]);
  assert.ok(keys.size >= 20, `data-i18n が少なすぎる: ${keys.size}`);
  assert.deepEqual([...keys].filter(key => !(key in I18n.ja)), []);
});

test('script.js と dorks.js が呼ぶキーは、すべて辞書にある', () => {
  const keys = new Set(Object.values(categoryKeys));
  // 末尾が '.' のものは組み立ての前半なので、完全なキーとして数えない。
  for (const m of script.matchAll(/I18n\.t\(\s*'([\w.]+[\w])'/g)) keys.add(m[1]);
  // 'risk.' + dork.risk と 'theme.to…' は組み立てて渡すので、別に数え上げる。
  for (const risk of ['high', 'medium', 'low']) keys.add('risk.' + risk);
  for (const m of script.matchAll(/'(theme\.to\w+)'/g)) keys.add(m[1]);
  assert.ok(keys.size >= 12, 'I18n.t の呼び出しが見つからない');
  assert.deepEqual([...keys].filter(key => !(key in I18n.ja)), []);
});

test('英語の辞書に、訳し忘れの日本語が残っていない', () => {
  // 言語の切り替えボタンの読み上げだけは、相手の言語を相手の表記で出すのが正しい
  const expected = new Set(['app.langAria']);
  const left = Object.keys(I18n.en).filter(key => !expected.has(key) && JAPANESE.test(I18n.en[key]));
  assert.deepEqual(left, []);
  assert.equal(I18n.en['app.langAria'], '日本語');
});

test('検索演算子は訳さず、固有名詞のまま両方の辞書に残す', () => {
  for (const [key, operator] of Object.entries({
    'filter.styleFiletype': 'filetype:', 'filter.styleExt': 'ext:', 'error.ip': 'site:'
  })) {
    assert.ok(I18n.ja[key].includes(operator), key);
    assert.ok(I18n.en[key].includes(operator), key);
  }
  assert.ok(I18n.en['status.styleChanged'].includes('{style}:'));
});

test('自分の管理下だけを調べるという注意は、英語でも弱めない', () => {
  assert.match(I18n.en['input.permission'], /only a domain you manage/);
  assert.match(I18n.en['input.permission'], /permission to investigate/);
  const helpEn = html.match(/id="helpEn"[\s\S]*?<\/div>/)[0];
  assert.match(helpEn, /Investigate your own sites only/);
  assert.match(helpEn, /Never investigate someone else's site without permission/);
});

test('t() は差し込みを埋め、知らないキーは黙って通さない', () => {
  assert.equal(I18n.t('status.counter', { count: 3, total: 30 }), '(3/30 Dorks)');
  assert.match(I18n.t('status.generated', { count: 7 }), /7/);
  assert.throws(() => I18n.t('no.such.key'), /Unknown message/);
});

test('i18n.js を他のスクリプトより先に読み込む', () => {
  assert.ok(html.indexOf('<script src="i18n.js">') < html.indexOf('<script src="domain.js">'));
  assert.ok(html.indexOf('<script src="i18n.js">') < html.indexOf('<script src="script.js">'));
});

test('言語の保存は i18n.js に閉じ込め、script.js には持ち込まない', () => {
  assert.match(fs.readFileSync(path.join(root, 'i18n.js'), 'utf8'), /dork-watcher-language/);
  assert.doesNotMatch(script, /(?:read|write)Setting\('language'/);
  assert.doesNotMatch(script, /translations/);
});

test('子要素を持つ要素に data-i18n を付けていない', () => {
  // 閉じタグは </label\n> のように改行が入ることがあるので、空白を許す。
  for (const m of html.matchAll(/<(\w+)[^>]*data-i18n="[^"]+"[^>]*>([\s\S]*?)<\/\1\s*>/g)) {
    assert.doesNotMatch(m[2], /</, `子要素がある: ${m[0].slice(0, 60)}`);
  }
});

test('状態で変わる属性には data-i18n-<attr> を付けない', () => {
  const themeButton = html.match(/<button class="theme-toggle"[^>]*>/)[0];
  assert.doesNotMatch(themeButton, /data-i18n/);
  assert.match(themeButton, /aria-label="/);
  // テーマのラベルは状態から組み立て直し、言語の変更でも巻き戻らない。
  assert.match(script, /function onLanguageChange\(\)[\s\S]*?updateThemeIcon\(/);
});

test('表示中の通知はキーで覚え、言語の変更で訳し直す', () => {
  assert.match(script, /notice = \{ key, values \}/);
  assert.match(script, /const savedNotice = notice;/);
  assert.doesNotMatch(script, /textContent === /);
});

test('クエリーの組み立ては言語に依存しない', () => {
  const query = fs.readFileSync(path.join(root, 'query.js'), 'utf8');
  assert.doesNotMatch(query, JAPANESE);
  assert.doesNotMatch(query, /I18n|language/);
  assert.doesNotMatch(fs.readFileSync(path.join(root, 'domain.js'), 'utf8'), /I18n|language/);
});

test('noscript は日本語と英語を併記する', () => {
  const noscript = html.match(/<noscript>([\s\S]*?)<\/noscript>/)[1];
  assert.ok(JAPANESE.test(noscript));
  assert.match(noscript, /Enable JavaScript/);
});

test('ヘルプ本文は日英の2ブロックのまま持ち、辞書には入れない', () => {
  assert.match(html, /id="helpJa" lang="ja"/);
  assert.match(html, /id="helpEn" lang="en" tabindex="0" hidden/);
  assert.deepEqual(Object.keys(I18n.ja).filter(key => key.startsWith('help.body')), []);
  assert.match(script, /function updateHelpLanguage\(\)/);
});

test('README は日本語と英語を相互にたどれる', () => {
  const ja = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  const en = fs.readFileSync(path.join(root, 'README.en.md'), 'utf8');
  assert.match(ja, /\[English\]\(README\.en\.md\) · 日本語/);
  assert.match(en, /English · \[日本語\]\(README\.md\)/);
  // YAMLコメントの前に言語リンクを置くと、先頭を見るテストが落ちる。
  assert.ok(ja.indexOf('[English](README.en.md)') > ja.indexOf('-->'));
});
