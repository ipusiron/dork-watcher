// 言語設定
const translations = {
  ja: {
    title: "Dork Watcher",
    subtitle: "Google検索を使って、あなたのサイトが漏洩情報を含んでいないかチェックしましょう。",
    domainLabel: "対象サイトのドメイン名（例: example.com）",
    domainPlaceholder: "yourdomain.com",
    checkButton: "チェック開始",
    categoryLabel: "カテゴリー：",
    riskLabel: "リスク：",
    categoryAll: "すべて",
    categoryFile: "ファイル漏洩",
    categoryAdmin: "管理系", 
    categoryInfo: "情報ワード",
    categoryOther: "その他",
    riskAll: "すべて",
    riskHigh: "High",
    riskMedium: "Medium", 
    riskLow: "Low",
    errorDomain: "⚠️ ドメイン名を入力してください。",
    noDorks: "該当するDorkはありません。",
    helpTitle: "Dork Watcher ヘルプ",
    helpTooltip: "ヘルプ",
    themeTooltipDark: "ダークモードに切り替え",
    themeTooltipLight: "ライトモードに切り替え",
    langTooltip: "English",
    footerText: "GitHubリポジトリーはこちら（",
    footerLink: "ipusiron/dork-watcher",
    operatorLabel: "演算子：",
    styleLabel: "演算子の表記：",
    operatorAll: "すべて",
    operatorOfficial: "公式のみ",
    operatorUnofficial: "非公式を含む",
    styleFiletype: "filetype:（公式）",
    styleExt: "ext:（非公式・短縮）",
    errorWhitespace: "⚠️ ドメイン名に空白は使えません。検索演算子ではなくドメイン名だけを入力してください。",
    errorIp: "⚠️ IPアドレスは site: 演算子で使えません。ドメイン名を入力してください。",
    errorFormat: "⚠️ ドメイン名の形式が正しくありません（例: example.com）。",
    searchingAs: "{input} を {domain} として検索します",
    undocumented: "非公式",
    undocumentedHelp: "Googleのヘルプに載っていない演算子を含む（予告なく効かなくなることがある）",
    copy: "コピー",
    copyLabel: "{query} をコピー",
    copySuccess: "コピーしました",
    copyFailure: "コピーできませんでした",
    closeHelp: "ヘルプを閉じる",
    permission: "自分が管理するドメイン、または調査の許可を得たドメインだけを入力してください。",
    generated: "{count}件のDorkを生成しました",
    styleChanged: "{style}: 表記に切り替えました。公式の演算子だけで書けるDorkは{count}件になります",
    counter: "({count}/{total} Dorks)",
    lightIcon: "☀️",
    darkIcon: "🌙",
    languageIcon: "EN"
  },
  en: {
    title: "Dork Watcher",
    subtitle: "Check your site for potential information leaks using Google search.",
    domainLabel: "Target domain name (e.g., example.com)",
    domainPlaceholder: "yourdomain.com",
    checkButton: "Start Check",
    categoryLabel: "Category:",
    riskLabel: "Risk:",
    categoryAll: "All",
    categoryFile: "File Leaks",
    categoryAdmin: "Admin Access",
    categoryInfo: "Info Keywords",
    categoryOther: "Others",
    riskAll: "All",
    riskHigh: "High",
    riskMedium: "Medium",
    riskLow: "Low", 
    errorDomain: "⚠️ Please enter a domain name.",
    noDorks: "No matching Dorks found.",
    helpTitle: "Dork Watcher Help",
    helpTooltip: "Help",
    themeTooltipDark: "Switch to Dark Mode",
    themeTooltipLight: "Switch to Light Mode",
    langTooltip: "日本語",
    footerText: "GitHub Repository (",
    footerLink: "ipusiron/dork-watcher",
    operatorLabel: "Operators:",
    styleLabel: "Operator style:",
    operatorAll: "All",
    operatorOfficial: "Documented only",
    operatorUnofficial: "Includes undocumented",
    styleFiletype: "filetype: (documented)",
    styleExt: "ext: (undocumented)",
    errorWhitespace: "⚠️ Domain names cannot contain spaces. Enter only the domain name, not a search operator.",
    errorIp: "⚠️ site: does not work with IP addresses. Enter a domain name.",
    errorFormat: "⚠️ Invalid domain name format (e.g. example.com).",
    searchingAs: "Searching as {domain} (entered: {input})",
    undocumented: "Undocumented",
    undocumentedHelp: "Contains operators not listed in Google Help; they may stop working without notice.",
    copy: "Copy",
    copyLabel: "Copy {query}",
    copySuccess: "Copied",
    copyFailure: "Could not copy",
    closeHelp: "Close help",
    permission: "Enter only domains you manage or have permission to investigate.",
    generated: "Generated {count} Dorks",
    styleChanged: "Switched to {style}: style. {count} Dorks use documented operators only.",
    counter: "({count}/{total} Dorks)",
    lightIcon: "☀️",
    darkIcon: "🌙",
    languageIcon: "JA"
  }
};

let currentLang = 'ja';
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

function textFor(key, values = {}) {
  return translations[currentLang][key].replace(/\{(\w+)\}/g, (_, name) => String(values[name]));
}

function announce(key, values = {}) {
  notice = { key, values };
  document.getElementById('statusMessage').textContent = textFor(key, values);
}

function toggleLanguage() {
  currentLang = currentLang === 'ja' ? 'en' : 'ja';
  writeSetting('language', currentLang);
  updateTexts();
  updateLanguageIcon();
}

function updateLanguageIcon() {
  const langButton = document.querySelector('.lang-toggle');
  langButton.textContent = textFor('languageIcon');
  langButton.title = textFor('langTooltip');
  langButton.setAttribute('aria-label', textFor('langTooltip'));
}

function updateTexts() {
  document.documentElement.lang = currentLang;
  const textIds = {
    appTitle: 'title', subtitle: 'subtitle', generateButton: 'checkButton',
    footerText: 'footerText', footerLink: 'footerLink', permissionNote: 'permission'
  };
  for (const [id, key] of Object.entries(textIds)) {
    document.getElementById(id).textContent = textFor(key);
  }
  const labels = {
    siteUrl: 'domainLabel', categoryFilter: 'categoryLabel', riskFilter: 'riskLabel',
    operatorFilter: 'operatorLabel', operatorStyle: 'styleLabel'
  };
  for (const [id, key] of Object.entries(labels)) {
    document.querySelector(`label[for="${id}"]`).textContent = textFor(key);
  }
  document.getElementById('siteUrl').placeholder = textFor('domainPlaceholder');
  const categoryKeys = ['categoryFile', 'categoryAdmin', 'categoryInfo', 'categoryOther'];
  document.querySelectorAll('#categoryFilter option').forEach((option, i) => {
    option.textContent = textFor(i === 0 ? 'categoryAll' : categoryKeys[i - 1]);
  });
  const options = {
    riskFilter: ['riskAll', 'riskHigh', 'riskMedium', 'riskLow'],
    operatorFilter: ['operatorAll', 'operatorOfficial', 'operatorUnofficial'],
    operatorStyle: ['styleFiletype', 'styleExt']
  };
  for (const [id, keys] of Object.entries(options)) {
    document.querySelectorAll(`#${id} option`).forEach((option, i) => {
      option.textContent = textFor(keys[i]);
    });
  }
  const helpButton = document.querySelector('.help-button');
  helpButton.title = textFor('helpTooltip');
  helpButton.setAttribute('aria-label', textFor('helpTooltip'));
  updateThemeIcon(document.documentElement.getAttribute('data-theme'));
  updateHelpModal();

  // 空欄のエラーも含めて再表示する。カウンターの要素は作り直さない。
  const savedNotice = notice;
  if (hasGenerated) generateDorks();
  if (savedNotice && savedNotice.key !== 'generated') {
    announce(savedNotice.key, savedNotice.values);
  }
}

function updateHelpModal() {
  document.getElementById('helpTitle').textContent = textFor('helpTitle');
  document.querySelector('.close-button').setAttribute('aria-label', textFor('closeHelp'));
  document.getElementById('helpJa').hidden = currentLang !== 'ja';
  document.getElementById('helpEn').hidden = currentLang !== 'en';
}

function initLanguage() {
  currentLang = readSetting('language', ['ja', 'en'], 'ja');
  updateTexts();
  updateLanguageIcon();
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
  toggleButton.textContent = textFor(dark ? 'lightIcon' : 'darkIcon');
  toggleButton.title = textFor(dark ? 'themeTooltipLight' : 'themeTooltipDark');
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
    categorySelect.appendChild(option);
  });
  const styleSelect = document.getElementById('operatorStyle');
  styleSelect.value = readSetting('operatorStyle', ['filetype', 'ext'], 'filetype');
  initTheme();
  initLanguage();
  document.getElementById('generateButton').addEventListener('click', generateDorks);
  document.querySelector('.lang-toggle').addEventListener('click', toggleLanguage);
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
    announce('styleChanged', { style, count });
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
    ? '' : textFor('counter', { count, total: totalDorks });
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
    if (revision === copyRevision) announce('copySuccess');
  } catch {
    if (revision === copyRevision) announce('copyFailure');
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
  notice = null;
  document.getElementById('statusMessage').textContent = '';
  resultsDiv.replaceChildren();

  if (!normalized.ok) {
    const reasons = { empty: 'errorDomain', whitespace: 'errorWhitespace', ip: 'errorIp' };
    appendMessage(resultsDiv, textFor(reasons[normalized.reason] || 'errorFormat'));
    updateResultsCounter(0);
    return;
  }
  const domain = normalized.domain;
  if (domain.includes('xn--') && /[^\x00-\x7f]/.test(input)) {
    appendMessage(resultsDiv, textFor('searchingAs', { input, domain }));
  }

  // このqueryをリンク・URL・コピー・ラベル・フィルターの共通の入力とする。
  const prepared = dorks.map(dork => {
    const q = buildQuery(domain, applyOperatorStyle(dork.query, style));
    return { ...dork, query: q };
  });
  // 表記適用済みなので、filterDorksの既定の無変換モードで判定する。
  const filtered = filterDorks(prepared, category, risk, operator);
  updateResultsCounter(filtered.length, dorks.length);
  announce('generated', { count: filtered.length });
  if (filtered.length === 0) appendMessage(resultsDiv, textFor('noDorks'));

  filtered.forEach(dork => {
    const q = dork.query;
    const entry = document.createElement('div');
    entry.className = 'dork-entry';
    entry.dataset.id = dork.id;
    const explanation = currentLang === 'en' ? dork.explanationEn : dork.explanation;
    entry.setAttribute('data-tooltip', explanation);

    const link = document.createElement('a');
    link.href = 'https://www.google.com/search?q=' + encodeURIComponent(q);
    link.textContent = q;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-description', explanation);

    const riskSpan = document.createElement('span');
    riskSpan.className = `risk ${dork.risk}`;
    riskSpan.textContent = textFor('risk' + dork.risk[0].toUpperCase() + dork.risk.slice(1));
    entry.append(link, riskSpan);

    if (!isOfficialQuery(q)) {
      const label = document.createElement('span');
      label.className = 'undocumented';
      label.textContent = textFor('undocumented');
      label.title = textFor('undocumentedHelp');
      label.setAttribute('aria-label', textFor('undocumentedHelp'));
      entry.appendChild(label);
    }
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'copy-button';
    copy.textContent = textFor('copy');
    copy.setAttribute('aria-label', textFor('copyLabel', { query: q }));
    copy.addEventListener('click', () => copyQuery(q));
    entry.appendChild(copy);
    resultsDiv.appendChild(entry);
  });
}
