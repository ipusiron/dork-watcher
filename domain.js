// URL解析とDNSラベル検査を分離し、検索演算子を入力から混入させない。
function normalizeDomain(input) {
  if (typeof input !== "string") return { ok: false, reason: "parse" };
  const value = input.trim();
  if (!value) return { ok: false, reason: "empty" };
  if (/\s/u.test(value)) return { ok: false, reason: "whitespace" };
  if (/[\u0000-\u001f\u007f]/u.test(value)) return { ok: false, reason: "parse" };

  let domain;
  try {
    const url = /^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value}`;
    domain = new URL(url).hostname.toLowerCase().replace(/\.$/, "");
    if (!domain) return { ok: false, reason: "parse" };
  } catch {
    return { ok: false, reason: "parse" };
  }
  if (domain.startsWith("[") || /^\d+\.\d+\.\d+\.\d+$/.test(domain)) {
    return { ok: false, reason: "ip" };
  }
  if (domain.length > 253) return { ok: false, reason: "too-long" };
  const labels = domain.split(".");
  if (labels.length < 2) return { ok: false, reason: "no-tld" };
  if (!labels.every(label => /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(label))) {
    return { ok: false, reason: "label" };
  }
  const tld = labels[labels.length - 1];
  if (!/^[a-z]{2,}$/.test(tld) && !tld.startsWith("xn--")) return { ok: false, reason: "tld" };
  return { ok: true, domain };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { normalizeDomain };
}
