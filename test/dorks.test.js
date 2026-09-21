const test = require('node:test');
const assert = require('node:assert/strict');
const { dorks } = require('../dorks.js');
const { buildQuery, isOfficialQuery, categoriesOf } = require('../query.js');

const ids = [
  "file-xls",
  "file-pdf",
  "file-backup",
  "file-env",
  "file-log",
  "file-doc",
  "file-json-config",
  "file-git",
  "file-index-backup",
  "file-sql-password",
  "admin-login",
  "admin-admin",
  "admin-text",
  "admin-panel-title",
  "admin-dashboard",
  "admin-wp",
  "admin-config",
  "admin-login-php",
  "admin-phpmyadmin",
  "info-password",
  "info-db-password",
  "info-basic-auth",
  "info-confidential",
  "info-private-key",
  "info-api-key",
  "info-token-log",
  "other-index-of",
  "other-phpinfo",
  "other-txt",
  "other-test"
];
const officialIds = [
  "file-xls",
  "file-pdf",
  "file-backup",
  "file-env",
  "file-log",
  "file-doc",
  "file-sql-password",
  "info-password",
  "info-db-password",
  "info-basic-auth",
  "info-confidential",
  "info-private-key",
  "info-api-key",
  "info-token-log",
  "other-txt"
];

test('B-2: 30 unique ids, queries and complete definitions', () => {
  assert.equal(dorks.length, 30);
  assert.deepEqual(dorks.map(d => d.id), ids);
  assert.equal(new Set(dorks.map(d => d.query)).size, 30);
  assert.equal(new Set(dorks.map(d => d.id)).size, 30);
  assert.deepEqual(dorks.filter(d => d.official).map(d => d.id), officialIds);
  assert.equal(dorks.filter(d => !d.official).length, 15);
  assert.deepEqual(categoriesOf(dorks), ['ファイル漏洩', '管理系', '情報ワード', 'その他']);
  for (const dork of dorks) {
    for (const key of ['id', 'query', 'explanation', 'explanationEn', 'risk', 'category']) {
      assert.equal(typeof dork[key], 'string');
      assert.ok(dork[key].length);
    }
    assert.match(dork.id, /^[a-z-]+$/);
    assert.equal(typeof dork.official, 'boolean');
    assert.ok(['high', 'medium', 'low'].includes(dork.risk));
    assert.ok(categoriesOf(dorks).includes(dork.category));
  }
});

test('no embedded site, allin operators, ext data or ambiguous OR', () => {
  for (const dork of dorks) {
    assert.doesNotMatch(dork.query, /\b(?:site|allintext|allintitle|allinurl|ext):/i);
    if (dork.query.includes(' OR ')) assert.match(dork.query, /^\(.*\)$/);
    for (const quoted of dork.query.match(/"[^"]*"/g) || []) {
      assert.doesNotMatch(quoted, /\bfiletype:/);
    }
    assert.equal(dork.official, isOfficialQuery(buildQuery('example.com', dork.query)));
  }
});
