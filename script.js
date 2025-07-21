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
    langTooltip: "English"
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
    langTooltip: "日本語"
  }
};

let currentLang = 'ja';

function toggleLanguage() {
  currentLang = currentLang === 'ja' ? 'en' : 'ja';
  localStorage.setItem('language', currentLang);
  updateTexts();
  updateLanguageIcon();
}

function updateLanguageIcon() {
  const langButton = document.querySelector('.lang-toggle');
  langButton.textContent = currentLang === 'ja' ? 'EN' : 'JA';
  langButton.title = translations[currentLang].langTooltip;
}

function updateTexts() {
  const t = translations[currentLang];
  
  document.querySelector('h1').innerHTML = `${t.title} <span id="resultsCounter" class="results-counter"></span>`;
  document.querySelector('.container > p').textContent = t.subtitle;
  document.querySelector('label[for="siteUrl"]').textContent = t.domainLabel;
  document.getElementById('siteUrl').placeholder = t.domainPlaceholder;
  document.querySelector('button[onclick="generateDorks()"]').textContent = t.checkButton;
  document.querySelector('label[for="categoryFilter"]').textContent = t.categoryLabel;
  document.querySelector('label[for="riskFilter"]').textContent = t.riskLabel;
  
  // フィルタオプション更新
  const categoryOptions = document.querySelectorAll('#categoryFilter option');
  categoryOptions[0].textContent = t.categoryAll;
  categoryOptions[1].textContent = t.categoryFile;
  categoryOptions[2].textContent = t.categoryAdmin;
  categoryOptions[3].textContent = t.categoryInfo;
  categoryOptions[4].textContent = t.categoryOther;
  
  const riskOptions = document.querySelectorAll('#riskFilter option');
  riskOptions[0].textContent = t.riskAll;
  riskOptions[1].textContent = t.riskHigh;
  riskOptions[2].textContent = t.riskMedium;
  riskOptions[3].textContent = t.riskLow;
  
  document.querySelector('.help-button').title = t.helpTooltip;
  
  // テーマボタンのツールチップも更新
  const currentTheme = document.documentElement.getAttribute('data-theme');
  updateThemeIcon(currentTheme);
  
  updateHelpModal();
  
  // 現在の結果を再生成
  if (document.getElementById('siteUrl').value.trim()) {
    generateDorks();
  }
}

function updateHelpModal() {
  const t = translations[currentLang];
  document.querySelector('.modal-header h2').textContent = t.helpTitle;
  
  if (currentLang === 'en') {
    document.querySelector('.modal-body').innerHTML = `
      <h3>🔍 What is Dork Watcher?</h3>
      <p>A tool to check your site for potential information leaks using Google Dorks.</p>
      
      <h3>📝 How to Use</h3>
      <ol>
        <li><strong>Enter Domain</strong>: Input the domain name you want to investigate (e.g., example.com).</li>
        <li><strong>Select Filters</strong>: Filter Dorks by category and risk level.</li>
        <li><strong>Start Check</strong>: Click the button to generate Google search links.</li>
        <li><strong>Review Results</strong>: Click each link to check Google search results.</li>
      </ol>

      <h3>⚠️ Important Notes</h3>
      <ul>
        <li><strong>Only investigate your own sites</strong> - Avoid unauthorized investigation of others' sites.</li>
        <li><strong>Empty results are normal</strong> - This indicates proper security measures are in place.</li>
        <li><strong>Google search limitations</strong> - Frequent searches may be restricted by Google.</li>
        <li><strong>Result interpretation</strong> - Hits don't necessarily indicate actual vulnerabilities. Expert verification is recommended.</li>
      </ul>

      <h3>📊 Category Descriptions</h3>
      <ul>
        <li><strong>File Leaks</strong>: Check for leaked sensitive files like .env, .sql, .log</li>
        <li><strong>Admin Access</strong>: Check for exposed admin panels and login pages</li>
        <li><strong>Info Keywords</strong>: Check for sensitive information like passwords and API keys</li>
        <li><strong>Others</strong>: Check for directory listings, test pages, etc.</li>
      </ul>

      <h3>🎯 Risk Levels</h3>
      <ul>
        <li><strong>High</strong>: High possibility of direct sensitive information leakage</li>
        <li><strong>Medium</strong>: Requires security attention</li>
        <li><strong>Low</strong>: General information but recommended to check</li>
      </ul>

      <h3>🌗 Theme Toggle</h3>
      <p>Use the button in the top right to switch between light and dark modes. Settings are automatically saved.</p>
    `;
  }
}

function initLanguage() {
  const savedLang = localStorage.getItem('language');
  if (savedLang && translations[savedLang]) {
    currentLang = savedLang;
  }
  updateTexts();
  updateLanguageIcon();
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const toggleButton = document.querySelector('.theme-toggle');
  const t = translations[currentLang];
  if (theme === 'dark') {
    toggleButton.innerHTML = '☀️';
    toggleButton.title = t.themeTooltipLight;
  } else {
    toggleButton.innerHTML = '🌙';
    toggleButton.title = t.themeTooltipDark;
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcon(theme);
}

document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  initLanguage();
});

function showHelpModal() {
  document.getElementById('helpModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function hideHelpModal() {
  document.getElementById('helpModal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    hideHelpModal();
  } else if (event.key === 'Enter') {
    const activeElement = document.activeElement;
    // ドメイン入力フィールドにフォーカスがある場合、またはボタン以外の要素の場合
    if (activeElement.id === 'siteUrl' || (activeElement.tagName !== 'BUTTON' && activeElement.tagName !== 'SELECT')) {
      generateDorks();
    }
  }
});

function updateResultsCounter(count, totalDorks = null) {
  const counter = document.getElementById("resultsCounter");
  if (count === 0) {
    counter.textContent = "";
  } else if (totalDorks !== null) {
    counter.textContent = `(${count}/${totalDorks} Dorks)`;
  } else {
    counter.textContent = `(${count} Dorks)`;
  }
}

function generateDorks() {
  const site = document.getElementById("siteUrl").value.trim();
  const category = document.getElementById("categoryFilter").value;
  const risk = document.getElementById("riskFilter").value;
  const resultsDiv = document.getElementById("results");

  resultsDiv.innerHTML = "";

  if (!site) {
    resultsDiv.innerHTML = `<p>${translations[currentLang].errorDomain}</p>`;
    updateResultsCounter(0);
    return;
  }

  // カテゴリとリスクの両方でANDフィルタリング
  const filtered = dorks.filter(dork => {
    const matchCategory = (category === "all" || dork.category === category);
    const matchRisk = (risk === "all" || dork.risk === risk);
    return matchCategory && matchRisk;
  });

  if (filtered.length === 0) {
    resultsDiv.innerHTML = `<p>${translations[currentLang].noDorks}</p>`;
    updateResultsCounter(0, dorks.length);
    return;
  }

  updateResultsCounter(filtered.length, dorks.length);

  filtered.forEach(dork => {
    const fullQuery = `site:${site} ${dork.query}`;
    const encodedQuery = encodeURIComponent(fullQuery);
    const searchUrl = `https://www.google.com/search?q=${encodedQuery}`;

    const entry = document.createElement("div");
    entry.className = "dork-entry";
    const explanation = currentLang === 'en' && dork.explanationEn ? dork.explanationEn : dork.explanation;
    entry.setAttribute("data-tooltip", explanation);

    const link = document.createElement("a");
    link.href = searchUrl;
    link.textContent = `🔍 ${fullQuery}`;
    link.target = "_blank";

    const riskSpan = document.createElement("span");
    riskSpan.className = `risk ${dork.risk}`;
    riskSpan.textContent = dork.risk.charAt(0).toUpperCase() + dork.risk.slice(1);

    entry.appendChild(link);
    entry.appendChild(riskSpan);
    resultsDiv.appendChild(entry);
  });
}
