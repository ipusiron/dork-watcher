// 日本語と英語の文言と、その適用だけを担う層。
// 検索演算子（site: filetype: inurl: intitle: intext: ext:）は固有名詞なので訳さない。
const I18n = (() => {
  const ja = {
    'app.title': 'Dork Watcher - Google Hacking支援ツール',
    'app.heading': 'Dork Watcher',
    'app.subtitle': 'Google検索を使って、あなたのサイトが漏洩情報を含んでいないかチェックしましょう。',
    'app.langButton': 'EN',
    'app.langAria': 'English',
    'theme.toDark': 'ダークモードに切り替え',
    'theme.toLight': 'ライトモードに切り替え',
    'help.tooltip': 'ヘルプ',
    'help.title': 'Dork Watcher ヘルプ',
    'help.close': 'ヘルプを閉じる',
    'input.label': '対象サイトのドメイン名（例: example.com）',
    'input.placeholder': 'yourdomain.com',
    'input.button': 'チェック開始',
    'input.permission': '自分が管理するドメイン、または調査の許可を得たドメインだけを入力してください。',
    'filter.style': '演算子の表記：',
    'filter.styleFiletype': 'filetype:（公式）',
    'filter.styleExt': 'ext:（非公式・短縮）',
    'filter.category': 'カテゴリー：',
    'filter.risk': 'リスク：',
    'filter.operator': '演算子：',
    'filter.all': 'すべて',
    'filter.operatorOfficial': '公式のみ',
    'filter.operatorUnofficial': '非公式を含む',
    'category.file': 'ファイル漏洩',
    'category.admin': '管理系',
    'category.info': '情報ワード',
    'category.other': 'その他',
    'risk.high': 'High',
    'risk.medium': 'Medium',
    'risk.low': 'Low',
    'status.counter': '({count}/{total} Dorks)',
    'status.generated': '{count}件のDorkを生成しました',
    'status.styleChanged':
      '{style}: 表記に切り替えました。公式の演算子だけで書けるDorkは{count}件になります',
    'status.noDorks': '該当するDorkはありません。',
    'status.searchingAs': '{input} を {domain} として検索します',
    'error.empty': '⚠️ ドメイン名を入力してください。',
    'error.whitespace':
      '⚠️ ドメイン名に空白は使えません。検索演算子ではなくドメイン名だけを入力してください。',
    'error.ip': '⚠️ IPアドレスは site: 演算子で使えません。ドメイン名を入力してください。',
    'error.format': '⚠️ ドメイン名の形式が正しくありません（例: example.com）。',
    'undocumented.label': '非公式',
    'undocumented.help':
      'Googleのヘルプに載っていない演算子を含む（予告なく効かなくなることがある）',
    'copy.label': 'コピー',
    'copy.aria': '{query} をコピー',
    'copy.done': 'コピーしました',
    'copy.failed': 'コピーできませんでした',
    'footer.repo': 'GitHubリポジトリーはこちら（',
    'footer.repoEnd': '）'
  };

  const en = {
    'app.title': 'Dork Watcher - Google Hacking Assistant Tool',
    'app.heading': 'Dork Watcher',
    'app.subtitle': 'Check your site for leaked information with Google search.',
    'app.langButton': 'JA',
    'app.langAria': '日本語',
    'theme.toDark': 'Switch to dark mode',
    'theme.toLight': 'Switch to light mode',
    'help.tooltip': 'Help',
    'help.title': 'Dork Watcher Help',
    'help.close': 'Close help',
    'input.label': 'Target domain name (e.g. example.com)',
    'input.placeholder': 'yourdomain.com',
    'input.button': 'Start Check',
    'input.permission':
      'Enter only a domain you manage, or one you have permission to investigate.',
    'filter.style': 'Operator style:',
    'filter.styleFiletype': 'filetype: (documented)',
    'filter.styleExt': 'ext: (undocumented)',
    'filter.category': 'Category:',
    'filter.risk': 'Risk:',
    'filter.operator': 'Operators:',
    'filter.all': 'All',
    'filter.operatorOfficial': 'Documented only',
    'filter.operatorUnofficial': 'Includes undocumented',
    'category.file': 'File leaks',
    'category.admin': 'Admin access',
    'category.info': 'Info keywords',
    'category.other': 'Others',
    'risk.high': 'High',
    'risk.medium': 'Medium',
    'risk.low': 'Low',
    'status.counter': '({count}/{total} Dorks)',
    'status.generated': 'Generated {count} Dorks',
    'status.styleChanged':
      'Switched to the {style}: style. {count} Dorks use documented operators only.',
    'status.noDorks': 'No matching Dorks found.',
    'status.searchingAs': 'Searching as {domain} (you entered {input})',
    'error.empty': '⚠️ Enter a domain name.',
    'error.whitespace':
      '⚠️ A domain name cannot contain spaces. Enter the domain name only, not a search operator.',
    'error.ip': '⚠️ site: does not work with IP addresses. Enter a domain name.',
    'error.format': '⚠️ Invalid domain name format (e.g. example.com).',
    'undocumented.label': 'Undocumented',
    'undocumented.help':
      'Contains operators not listed in Google Help; they may stop working without notice.',
    'copy.label': 'Copy',
    'copy.aria': 'Copy {query}',
    'copy.done': 'Copied',
    'copy.failed': 'Could not copy',
    'footer.repo': 'GitHub repository (',
    'footer.repoEnd': ')'
  };

  const LANGUAGES = ['ja', 'en'];
  const STORAGE_KEY = 'dork-watcher-language';
  let language = 'ja';

  function t(key, values = {}) {
    const message = (language === 'en' ? en : ja)[key];
    if (typeof message !== 'string') throw new Error('Unknown message: ' + key);
    return message.replace(/\{(\w+)\}/g, (hole, name) =>
      (Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : hole));
  }

  function apply(root = document) {
    document.documentElement.lang = language;
    document.title = t('app.title');
    root.querySelectorAll('[data-i18n]').forEach(element => {
      element.textContent = t(element.dataset.i18n);
    });
    for (const attribute of ['title', 'aria-label', 'placeholder']) {
      root.querySelectorAll(`[data-i18n-${attribute}]`).forEach(element => {
        element.setAttribute(attribute, t(element.getAttribute(`data-i18n-${attribute}`)));
      });
    }
  }

  function setLanguage(value) {
    if (!LANGUAGES.includes(value)) return;
    language = value;
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // 保存できない環境でも、そのページの表示は切り替えたままにする。
    }
    apply();
    document.dispatchEvent(new Event('languagechange'));
  }

  function init() {
    let saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      // 読めない環境では問い合わせ文字列と既定に従う。
    }
    const requested = new URLSearchParams(location.search).get('lang');
    language = [requested, saved].find(value => LANGUAGES.includes(value))
      || (/^ja\b/i.test(navigator.language || '') ? 'ja' : 'en');
    apply();
  }

  return { ja, en, t, apply, init, setLanguage, get language() { return language; } };
})();

if (typeof window !== 'undefined') window.I18n = I18n;
if (typeof module !== 'undefined' && module.exports) module.exports = I18n;
