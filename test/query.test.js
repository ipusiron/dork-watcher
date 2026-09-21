const test = require('node:test');
const assert = require('node:assert/strict');
const { dorks } = require('../dorks.js');
const {
  buildQuery, buildSearchUrl, filterDorks, categoriesOf, operatorsIn,
  isOfficialQuery, applyOperatorStyle, toExtStyle, OFFICIAL_OPERATORS
} = require('../query.js');

const expected = {
  "file-xls": "site:example.com filetype:xls",
  "file-pdf": "site:example.com filetype:pdf",
  "file-backup": "site:example.com (filetype:sql OR filetype:bak OR filetype:old)",
  "file-env": "site:example.com filetype:env",
  "file-log": "site:example.com filetype:log",
  "file-doc": "site:example.com filetype:doc",
  "file-json-config": "site:example.com filetype:json inurl:config",
  "file-git": "site:example.com inurl:.git",
  "file-index-backup": "site:example.com intitle:\"index of /backup\"",
  "file-sql-password": "site:example.com filetype:sql password",
  "admin-login": "site:example.com inurl:login",
  "admin-admin": "site:example.com inurl:admin",
  "admin-text": "site:example.com intext:admin intext:login",
  "admin-panel-title": "site:example.com intitle:\"Admin Panel\"",
  "admin-dashboard": "site:example.com inurl:dashboard",
  "admin-wp": "site:example.com inurl:wp-admin",
  "admin-config": "site:example.com inurl:config",
  "admin-login-php": "site:example.com inurl:login filetype:php",
  "admin-phpmyadmin": "site:example.com intitle:\"phpMyAdmin\"",
  "info-password": "site:example.com \"password\"",
  "info-db-password": "site:example.com \"DB_PASSWORD\"",
  "info-basic-auth": "site:example.com \"Authorization: Basic\"",
  "info-confidential": "site:example.com \"confidential\"",
  "info-private-key": "site:example.com \"private key\"",
  "info-api-key": "site:example.com \"api_key\" filetype:json",
  "info-token-log": "site:example.com \"token\" filetype:log",
  "other-index-of": "site:example.com intitle:\"index of\"",
  "other-phpinfo": "site:example.com intitle:\"phpinfo()\"",
  "other-txt": "site:example.com filetype:txt",
  "other-test": "site:example.com inurl:test"
};
const extQueries = {
  "file-xls": "ext:xls",
  "file-pdf": "ext:pdf",
  "file-backup": "(ext:sql OR ext:bak OR ext:old)",
  "file-env": "ext:env",
  "file-log": "ext:log",
  "file-doc": "ext:doc",
  "file-json-config": "ext:json inurl:config",
  "file-sql-password": "ext:sql password",
  "admin-login-php": "inurl:login ext:php",
  "info-api-key": "\"api_key\" ext:json",
  "info-token-log": "\"token\" ext:log",
  "other-txt": "ext:txt"
};

test('B-4: all 30 complete queries and only one site constraint', () => {
  assert.equal(Object.keys(expected).length, 30);
  for (const dork of dorks) {
    const query = buildQuery('example.com', dork.query);
    assert.equal(query, expected[dork.id]);
    assert.equal((query.match(/\bsite:/g) || []).length, 1);
  }
});

test('B-5: all five encoded URLs', () => {
  const urls = {
    'file-xls': 'site%3Aexample.com%20filetype%3Axls',
    'file-backup': 'site%3Aexample.com%20(filetype%3Asql%20OR%20filetype%3Abak%20OR%20filetype%3Aold)',
    'file-index-backup': 'site%3Aexample.com%20intitle%3A%22index%20of%20%2Fbackup%22',
    'info-basic-auth': 'site%3Aexample.com%20%22Authorization%3A%20Basic%22',
    'admin-text': 'site%3Aexample.com%20intext%3Aadmin%20intext%3Alogin'
  };
  assert.equal(Object.keys(urls).length, 5);
  for (const [id, encoded] of Object.entries(urls)) {
    assert.equal(buildSearchUrl('example.com', dorks.find(d => d.id === id).query),
      'https://www.google.com/search?q=' + encoded);
  }
});

test('B-6: category by risk, all 20 cells and non-mutating filters', () => {
  const counts = [[30, 18, 10, 2], [10, 8, 1, 1], [9, 1, 8, 0], [7, 7, 0, 0], [4, 2, 1, 1]];
  const before = JSON.stringify(dorks);
  ['all', ...categoriesOf(dorks)].forEach((category, row) => {
    ['all', 'high', 'medium', 'low'].forEach((risk, col) => {
      assert.equal(filterDorks(dorks, category, risk).length, counts[row][col]);
    });
  });
  assert.equal(JSON.stringify(dorks), before);
});

test("B'-2: quoted strings, exclusions and hyphens, all 16 cases", () => {
  const cases = [
    ['filetype:xls', ['filetype'], true],
    ['(filetype:sql OR filetype:bak OR filetype:old)', ['filetype', 'filetype', 'filetype'], true],
    ['"Authorization: Basic"', [], true],
    ['"api_key" filetype:json', ['filetype'], true],
    ['intitle:"index of /backup"', ['intitle'], false],
    ['intext:admin intext:login', ['intext', 'intext'], false],
    ['inurl:login filetype:php', ['inurl', 'filetype'], false],
    ['"password"', [], true],
    ['filetype:sql password', ['filetype'], true],
    ['site:example.com "Authorization: Basic"', ['site'], true],
    ['filetype:pdf -filetype:doc', ['filetype', 'filetype'], true],
    ['filetype:pdf -inurl:draft', ['filetype', 'inurl'], false],
    ['wp-admin', [], true],
    ['inurl:wp-admin', ['inurl'], false],
    ['ext:log', ['ext'], false],
    ['"see http://x" filetype:txt', ['filetype'], true]
  ];
  assert.equal(cases.length, 16);
  assert.deepEqual(OFFICIAL_OPERATORS, ['site', 'filetype', 'before', 'after']);
  for (const [query, operators, official] of cases) {
    assert.deepEqual(operatorsIn(query), operators);
    assert.equal(isOfficialQuery(query), official);
  }
});

test("B'-4 and B'-5: 12 changed, 18 unchanged, ext has exactly five official queries", () => {
  let changed = 0;
  for (const dork of dorks) {
    const styled = applyOperatorStyle(dork.query, 'ext');
    if (Object.hasOwn(extQueries, dork.id)) {
      assert.equal(buildQuery('example.com', styled), 'site:example.com ' + extQueries[dork.id]);
      changed++;
    } else {
      assert.equal(styled, dork.query);
    }
    assert.equal(toExtStyle(toExtStyle(dork.query)), toExtStyle(dork.query));
    assert.equal(applyOperatorStyle(dork.query, 'unknown'), dork.query);
  }
  assert.equal(changed, 12);
  assert.equal(dorks.length - changed, 18);
  assert.deepEqual(filterDorks(dorks, 'all', 'all', 'official', 'ext').map(d => d.id),
    ['info-password', 'info-db-password', 'info-basic-auth', 'info-confidential', 'info-private-key']);
});

test("B'-6: category by operator, both styles, all 30 cells", () => {
  const tables = {
    filetype: [[30, 15, 15], [10, 7, 3], [9, 0, 9], [7, 7, 0], [4, 1, 3]],
    ext: [[30, 5, 25], [10, 0, 10], [9, 0, 9], [7, 5, 2], [4, 0, 4]]
  };
  for (const [style, table] of Object.entries(tables)) {
    ['all', ...categoriesOf(dorks)].forEach((category, row) => {
      ['all', 'official', 'unofficial'].forEach((operator, col) => {
        assert.equal(filterDorks(dorks, category, 'all', operator, style).length, table[row][col]);
      });
    });
  }
});

test("B'-7: risk by operator, both styles, all 24 cells and three-axis AND", () => {
  const tables = {
    filetype: [[30, 15, 15], [18, 12, 6], [10, 1, 9], [2, 2, 0]],
    ext: [[30, 5, 25], [18, 5, 13], [10, 0, 10], [2, 0, 2]]
  };
  for (const [style, table] of Object.entries(tables)) {
    ['all', 'high', 'medium', 'low'].forEach((risk, row) => {
      ['all', 'official', 'unofficial'].forEach((operator, col) => {
        assert.equal(filterDorks(dorks, 'all', risk, operator, style).length, table[row][col]);
      });
    });
  }
  assert.equal(filterDorks(dorks, 'ファイル漏洩', 'high', 'official', 'ext').length, 0);
  assert.equal(filterDorks(dorks, 'ファイル漏洩', 'high', 'official', 'filetype').length, 5);
});
