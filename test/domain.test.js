const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeDomain } = require('../domain.js');

const cases = [
  ['example.com', 'example.com'],
  ['  example.com  ', 'example.com'],
  ['EXAMPLE.COM', 'example.com'],
  ['https://example.com', 'example.com'],
  ['https://example.com/path/to/x?a=1#f', 'example.com'],
  ['http://user:pw@example.com:8080/x', 'example.com'],
  ['www.example.com', 'www.example.com'],
  ['sub.example.co.jp', 'sub.example.co.jp'],
  ['example.com.', 'example.com'],
  ['日本語.jp', 'xn--wgv71a119e.jp'],
  ['münchen.de', 'xn--mnchen-3ya.de'],
  ['xn--wgv71a119e.jp', 'xn--wgv71a119e.jp'],
  ['exam ple.com', null, 'whitespace'],
  ['"x" OR site:victim.com', null, 'whitespace'],
  ['example.com OR site:victim.com', null, 'whitespace'],
  ['site:example.com', null, 'parse'],
  ['localhost', null, 'no-tld'],
  ['192.168.1.1', null, 'ip'],
  ['[::1]', null, 'ip'],
  ['example', null, 'no-tld'],
  ['-bad.com', null, 'label'],
  ['a'.repeat(64) + '.com', null, 'label'],
  ['', null, 'empty'],
  ['   ', null, 'empty']
];

test('A-3: all 24 domain normalization reference cases', () => {
  assert.equal(cases.length, 24);
  for (const [input, domain, reason] of cases) {
    assert.deepEqual(normalizeDomain(input), domain ? { ok: true, domain } : { ok: false, reason }, input);
  }
});

test('domain limits, control characters, IDN and URL port', () => {
  const domain = ['a'.repeat(63), 'b'.repeat(63), 'c'.repeat(63), 'd'.repeat(61)].join('.');
  assert.equal(domain.length, 253);
  assert.deepEqual(normalizeDomain(domain), { ok: true, domain });
  assert.equal(normalizeDomain(domain + 'd').reason, 'too-long');
  assert.equal(normalizeDomain('example.com..').reason, 'label');
  assert.equal(normalizeDomain('example\u0000.com').reason, 'parse');
  assert.equal(normalizeDomain('exam\tple.com').reason, 'whitespace');
  assert.equal(normalizeDomain('exam　ple.com').reason, 'whitespace');
  assert.equal(normalizeDomain('example.1a').reason, 'tld');
  assert.equal(normalizeDomain('xn--wgv71a119e.jp').ok, true);
  assert.equal(normalizeDomain('WWW.Example.COM:8443/a').domain, 'www.example.com');
  assert.equal(normalizeDomain(null).ok, false);
});
