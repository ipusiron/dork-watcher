function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const toggleButton = document.querySelector('.theme-toggle');
  if (theme === 'dark') {
    toggleButton.innerHTML = '☀️';
    toggleButton.title = 'ライトモードに切り替え';
  } else {
    toggleButton.innerHTML = '🌙';
    toggleButton.title = 'ダークモードに切り替え';
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcon(theme);
}

document.addEventListener('DOMContentLoaded', initTheme);

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
  }
});

function generateDorks() {
  const site = document.getElementById("siteUrl").value.trim();
  const category = document.getElementById("categoryFilter").value;
  const risk = document.getElementById("riskFilter").value;
  const resultsDiv = document.getElementById("results");

  resultsDiv.innerHTML = "";

  if (!site) {
    resultsDiv.innerHTML = "<p>⚠️ ドメイン名を入力してください。</p>";
    return;
  }

  // カテゴリとリスクの両方でANDフィルタリング
  const filtered = dorks.filter(dork => {
    const matchCategory = (category === "all" || dork.category === category);
    const matchRisk = (risk === "all" || dork.risk === risk);
    return matchCategory && matchRisk;
  });

  if (filtered.length === 0) {
    resultsDiv.innerHTML = "<p>該当するDorkはありません。</p>";
    return;
  }

  filtered.forEach(dork => {
    const fullQuery = `site:${site} ${dork.query}`;
    const encodedQuery = encodeURIComponent(fullQuery);
    const searchUrl = `https://www.google.com/search?q=${encodedQuery}`;

    const entry = document.createElement("div");
    entry.className = "dork-entry";
    entry.setAttribute("data-tooltip", dork.explanation);

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
