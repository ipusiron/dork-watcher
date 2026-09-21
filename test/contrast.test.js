const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const css = fs.readFileSync(path.join(__dirname, '../style.css'), 'utf8');

function variables(selector) {
  const block = css.slice(css.indexOf(selector)).match(/\{([^}]+)\}/)[1];
  return Object.fromEntries([...block.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(m => [m[1], m[2]]));
}

function luminance(hex) {
  let s = hex.replace('#', '');
  if (s.length === 3) s = [...s].map(char => char + char).join('');
  assert.match(s, /^[0-9a-f]{6}$/i);
  const linear = s.match(/../g).map(value => {
    const c = parseInt(value, 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

test('F-1 through F-6: text contrasts in both themes, including hover states', () => {
  const light = variables(':root');
  const dark = variables('[data-theme="dark"]');
  assert.equal(Object.keys(light).length, 22);
  assert.equal(Object.keys(dark).length, 21);
  const pairs = [
    ['--risk-text', '--risk-high'], ['--risk-text', '--risk-medium'], ['--risk-text', '--risk-low'],
    ['--button-text', '--btn-primary'], ['--button-text', '--btn-primary-hover'],
    ['--counter-color', '--container-bg'], ['--undocumented-text', '--undocumented-bg'],
    ['--link-color', '--dork-bg'], ['--link-visited', '--dork-bg'],
    ['--link-color', '--container-bg'], ['--link-visited', '--container-bg'],
    ['--link-color', '--dork-hover'], ['--link-visited', '--dork-hover'],
    ['--text-color', '--bg-color'], ['--text-color', '--container-bg'], ['--tooltip-text', '--tooltip-bg']
  ];
  for (const [name, theme] of [['light', light], ['dark', { ...light, ...dark }]]) {
    for (const [foreground, background] of pairs) {
      const values = [luminance(theme[foreground]), luminance(theme[background])].sort((a, b) => b - a);
      const ratio = (values[0] + 0.05) / (values[1] + 0.05);
      assert.ok(ratio >= 4.5, `${name} ${foreground}/${background}: ${ratio}`);
    }
  }
});
