function generateDorks() {
  const site = document.getElementById("siteUrl").value.trim();
  const category = document.getElementById("categoryFilter").value;
  const resultsDiv = document.getElementById("results");

  resultsDiv.innerHTML = "";

  if (!site) {
    resultsDiv.innerHTML = "<p>⚠️ ドメイン名を入力してください。</p>";
    return;
  }

  const filtered = (category === "all")
    ? dorks
    : dorks.filter(d => d.category === category);

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
