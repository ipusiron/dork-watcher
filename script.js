// 文言は i18n.js が持つ。ここは画面の組み立てとイベント処理だけを担う。
const THEME_ICON = { dark: '☀️', light: '🌙' };

let hasGenerated = false;
let previousFocus = null;
let notice = null;
let copyRevision = 0;

function readSetting(key, allowed, fallback) {
  try {
    const value = localStorage.getItem(key);
    return allowed.includes(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function writeSetting(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // 保存できなくても現在の画面の設定は維持する。
  }
}

// 表示中の通知は、文字列ではなくキーで覚える。言語を変えたら訳し直せる。
function announce(key, values = {}) {
  notice = { key, values };
  document.getElementById('statusMessage').textContent = I18n.t(key, values);
}

function clearNotice() {
  notice = null;
  document.getElementById('statusMessage').textContent = '';
}

function updateHelpLanguage() {
  document.getElementById('helpJa').hidden = I18n.language !== 'ja';
  document.getElementById('helpEn').hidden = I18n.language !== 'en';
}

function onLanguageChange() {
  // 状態で変わる属性は apply() に任せず、状態から組み立て直す。
  updateThemeIcon(document.documentElement.getAttribute('data-theme'));
  updateHelpLanguage();
  const savedNotice = notice;
  if (hasGenerated) generateDorks();
  // generateDorks が出す件数の通知より、表示中だった通知を優先して戻す。
  if (savedNotice && savedNotice.key !== 'status.generated') {
    announce(savedNotice.key, savedNotice.values);
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  writeSetting('theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const toggleButton = document.querySelector('.theme-toggle');
  const dark = theme === 'dark';
  toggleButton.textContent = dark ? THEME_ICON.dark : THEME_ICON.light;
  toggleButton.title = I18n.t(dark ? 'theme.toLight' : 'theme.toDark');
  toggleButton.setAttribute('aria-label', toggleButton.title);
}

function initTheme() {
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = readSetting('theme', ['light', 'dark'], systemPrefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcon(theme);
}

document.addEventListener('DOMContentLoaded', function() {
  const categorySelect = document.getElementById('categoryFilter');
  categoriesOf(dorks).forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    // データの名前は日本語のまま識別子として使い、表示だけを辞書から引く。
    option.dataset.i18n = categoryKeys[category];
    categorySelect.appendChild(option);
  });
  const styleSelect = document.getElementById('operatorStyle');
  styleSelect.value = readSetting('operatorStyle', ['filetype', 'ext'], 'filetype');
  I18n.init();
  initTheme();
  updateHelpLanguage();
  document.getElementById('generateButton').addEventListener('click', generateDorks);
  document.getElementById('langToggle').addEventListener('click',
    () => I18n.setLanguage(I18n.language === 'ja' ? 'en' : 'ja'));
  document.addEventListener('languagechange', onLanguageChange);
  document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);
  document.querySelector('.help-button').addEventListener('click', showHelpModal);
  document.querySelector('.close-button').addEventListener('click', hideHelpModal);
  document.getElementById('helpModal').addEventListener('click', event => {
    if (event.target.id === 'helpModal') hideHelpModal();
  });
  ['categoryFilter', 'riskFilter', 'operatorFilter'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => {
      if (hasGenerated) generateDorks();
    });
  });
  styleSelect.addEventListener('change', () => {
    const style = styleSelect.value;
    writeSetting('operatorStyle', style);
    if (hasGenerated) generateDorks();
    const count = filterDorks(dorks, 'all', 'all', 'official', style).length;
    announce('status.styleChanged', { style, count });
  });
  document.getElementById('siteUrl').addEventListener('keydown', event => {
    if (event.key === 'Enter' && document.getElementById('helpModal').hidden) {
      event.preventDefault();
      generateDorks();
    }
  });
});

function showHelpModal() {
  previousFocus = document.activeElement;
  document.getElementById('helpModal').hidden = false;
  document.querySelector('.container').inert = true;
  document.body.classList.add('modal-open');
  document.querySelector('.close-button').focus();
}

function hideHelpModal() {
  const modal = document.getElementById('helpModal');
  if (modal.hidden) return;
  modal.hidden = true;
  document.querySelector('.container').inert = false;
  document.body.classList.remove('modal-open');
  if (previousFocus) previousFocus.focus();
}

document.addEventListener('keydown', function(event) {
  const modal = document.getElementById('helpModal');
  if (modal.hidden) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    hideHelpModal();
  } else if (event.key === 'Tab') {
    const focusable = [...modal.querySelectorAll('button, a[href], [tabindex="0"]')]
      .filter(element => element.getClientRects().length);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

function updateResultsCounter(count, totalDorks = null) {
  document.getElementById('resultsCounter').textContent = totalDorks === null
    ? '' : I18n.t('status.counter', { count, total: totalDorks });
}

function appendMessage(parent, message) {
  const paragraph = document.createElement('p');
  paragraph.textContent = message;
  parent.appendChild(paragraph);
}

async function copyQuery(query) {
  const revision = ++copyRevision;
  try {
    await navigator.clipboard.writeText(query);
    if (revision === copyRevision) announce('copy.done');
  } catch {
    if (revision === copyRevision) announce('copy.failed');
  }
}

function generateDorks() {
  const input = document.getElementById('siteUrl').value.trim();
  const normalized = normalizeDomain(input);
  const category = document.getElementById('categoryFilter').value;
  const risk = document.getElementById('riskFilter').value;
  const operator = document.getElementById('operatorFilter').value;
  const style = document.getElementById('operatorStyle').value;
  const resultsDiv = document.getElementById('results');
  hasGenerated = true;
  copyRevision++;
  clearNotice();
  resultsDiv.replaceChildren();

  if (!normalized.ok) {
    const reasons = { empty: 'error.empty', whitespace: 'error.whitespace', ip: 'error.ip' };
    appendMessage(resultsDiv, I18n.t(reasons[normalized.reason] || 'error.format'));
    updateResultsCounter(0);
    return;
  }
  const domain = normalized.domain;
  if (domain.includes('xn--') && /[^\x00-\x7f]/.test(input)) {
    appendMessage(resultsDiv, I18n.t('status.searchingAs', { input, domain }));
  }

  // このqueryをリンク・URL・コピー・ラベル・フィルターの共通の入力とする。
  const prepared = dorks.map(dork => {
    const q = buildQuery(domain, applyOperatorStyle(dork.query, style));
    return { ...dork, query: q };
  });
  // 表記適用済みなので、filterDorksの既定の無変換モードで判定する。
  const filtered = filterDorks(prepared, category, risk, operator);
  updateResultsCounter(filtered.length, dorks.length);
  announce('status.generated', { count: filtered.length });
  if (filtered.length === 0) appendMessage(resultsDiv, I18n.t('status.noDorks'));

  filtered.forEach(dork => {
    const q = dork.query;
    const entry = document.createElement('div');
    entry.className = 'dork-entry';
    entry.dataset.id = dork.id;
    const explanation = I18n.language === 'en' ? dork.explanationEn : dork.explanation;
    entry.setAttribute('data-tooltip', explanation);

    const link = document.createElement('a');
    link.href = 'https://www.google.com/search?q=' + encodeURIComponent(q);
    link.textContent = q;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-description', explanation);

    const riskSpan = document.createElement('span');
    riskSpan.className = `risk ${dork.risk}`;
    riskSpan.textContent = I18n.t('risk.' + dork.risk);
    entry.append(link, riskSpan);

    if (!isOfficialQuery(q)) {
      const label = document.createElement('span');
      label.className = 'undocumented';
      label.textContent = I18n.t('undocumented.label');
      label.title = I18n.t('undocumented.help');
      label.setAttribute('aria-label', I18n.t('undocumented.help'));
      entry.appendChild(label);
    }
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'copy-button';
    copy.textContent = I18n.t('copy.label');
    copy.setAttribute('aria-label', I18n.t('copy.aria', { query: q }));
    copy.addEventListener('click', () => copyQuery(q));
    entry.appendChild(copy);
    resultsDiv.appendChild(entry);
  });
}
