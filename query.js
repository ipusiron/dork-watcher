const OFFICIAL_OPERATORS = ["site", "filetype", "before", "after"];

function buildQuery(domain, dorkQuery) {
  return `site:${domain} ${dorkQuery}`;
}

function buildSearchUrl(domain, dorkQuery) {
  return "https://www.google.com/search?q=" + encodeURIComponent(buildQuery(domain, dorkQuery));
}

function toExtStyle(query) {
  return query.replace(/\bfiletype:/g, "ext:");
}

function applyOperatorStyle(query, style) {
  return style === "ext" ? toExtStyle(query) : query;
}

function operatorsIn(query) {
  const withoutQuoted = query.replace(/"[^"]*"/g, " ");
  const found = [];
  for (const m of withoutQuoted.matchAll(/(?:^|[\s(-])([a-z]+):/gi)) found.push(m[1].toLowerCase());
  return found;
}

function isOfficialQuery(query) {
  return operatorsIn(query).every(operator => OFFICIAL_OPERATORS.includes(operator));
}

function filterDorks(list, category = "all", risk = "all", operator = "all", style = "filetype") {
  return list.filter(dork => {
    const matchCategory = category === "all" || dork.category === category;
    const matchRisk = risk === "all" || dork.risk === risk;
    const official = isOfficialQuery(applyOperatorStyle(dork.query, style));
    const matchOperator = operator === "all" || (operator === "official" ? official : !official);
    return matchCategory && matchRisk && matchOperator;
  });
}

function categoriesOf(list) {
  return [...new Set(list.map(dork => dork.category))];
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    OFFICIAL_OPERATORS, buildQuery, buildSearchUrl, filterDorks, categoriesOf,
    toExtStyle, applyOperatorStyle, operatorsIn, isOfficialQuery
  };
}
