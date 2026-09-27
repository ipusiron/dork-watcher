const dorks = [
  // === ファイル漏洩 ===
  {
    id: 'file-xls',
    official: true,
    query: 'filetype:xls',
    explanation: '表計算ファイル（名簿やパスワードが含まれる可能性）',
    explanationEn: 'Spreadsheet files (may contain personal data or passwords)',
    risk: 'high',
    category: 'ファイル漏洩'
  },
  {
    id: 'file-pdf',
    official: true,
    query: 'filetype:pdf',
    explanation: '公開PDF（営業資料や内規など）',
    explanationEn: 'Public PDF files (sales materials, internal documents, etc.)',
    risk: 'low',
    category: 'ファイル漏洩'
  },
  {
    id: 'file-backup',
    official: true,
    query: '(filetype:sql OR filetype:bak OR filetype:old)',
    explanation: 'バックアップやDBファイルの漏洩チェック',
    explanationEn: 'Check for leaked backup or database files',
    risk: 'high',
    category: 'ファイル漏洩'
  },
  {
    id: 'file-env',
    official: true,
    query: 'filetype:env',
    explanation: '.env 環境変数ファイルが公開されていないか',
    explanationEn: 'Check if .env environment variable files are exposed',
    risk: 'high',
    category: 'ファイル漏洩'
  },
  {
    id: 'file-log',
    official: true,
    query: 'filetype:log',
    explanation: 'ログファイルが外部から参照可能か',
    explanationEn: 'Check if log files are accessible externally',
    risk: 'high',
    category: 'ファイル漏洩'
  },
  {
    id: 'file-doc',
    official: true,
    query: 'filetype:doc',
    explanation: 'Word文書の誤公開をチェック',
    explanationEn: 'Check for accidentally published Word documents',
    risk: 'medium',
    category: 'ファイル漏洩'
  },
  {
    id: 'file-json-config',
    official: false,
    query: 'filetype:json inurl:config',
    explanation: '設定ファイルがJSON形式で露出していないか',
    explanationEn: 'Check if configuration files are exposed in JSON format',
    risk: 'high',
    category: 'ファイル漏洩'
  },
  {
    id: 'file-git',
    official: false,
    query: 'inurl:.git',
    explanation: 'Gitリポジトリが公開されたままになっていないか',
    explanationEn: 'Check if Git repositories are publicly exposed',
    risk: 'high',
    category: 'ファイル漏洩'
  },
  {
    id: 'file-index-backup',
    official: false,
    query: 'intitle:"index of /backup"',
    explanation: 'バックアップディレクトリが一覧表示されていないか',
    explanationEn: 'Check if backup directories are listed publicly',
    risk: 'high',
    category: 'ファイル漏洩'
  },
  {
    id: 'file-sql-password',
    official: true,
    query: 'filetype:sql password',
    explanation: 'パスワード付きのSQLファイルが公開されていないか',
    explanationEn: 'Check if SQL files with passwords are publicly exposed',
    risk: 'high',
    category: 'ファイル漏洩'
  },

  // === 管理系 ===
  {
    id: 'admin-login',
    official: false,
    query: 'inurl:login',
    explanation: 'ログインページのURLを調査',
    explanationEn: 'Investigate login page URLs',
    risk: 'medium',
    category: '管理系'
  },
  {
    id: 'admin-admin',
    official: false,
    query: 'inurl:admin',
    explanation: '管理画面の入り口を探す',
    explanationEn: 'Find admin panel entry points',
    risk: 'medium',
    category: '管理系'
  },
  {
    id: 'admin-text',
    official: false,
    query: 'intext:admin intext:login',
    explanation: '管理用ログインページの特徴的な語を含むページ',
    explanationEn: 'Pages containing characteristic admin login terms',
    risk: 'medium',
    category: '管理系'
  },
  {
    id: 'admin-panel-title',
    official: false,
    query: 'intitle:"Admin Panel"',
    explanation: '「Admin Panel」のタイトルを持つページ',
    explanationEn: 'Pages with "Admin Panel" in the title',
    risk: 'medium',
    category: '管理系'
  },
  {
    id: 'admin-dashboard',
    official: false,
    query: 'inurl:dashboard',
    explanation: 'ダッシュボードへのURLパターン',
    explanationEn: 'URL patterns pointing to dashboards',
    risk: 'medium',
    category: '管理系'
  },
  {
    id: 'admin-wp',
    official: false,
    query: 'inurl:wp-admin',
    explanation: 'WordPressの管理画面URL',
    explanationEn: 'WordPress admin panel URLs',
    risk: 'medium',
    category: '管理系'
  },
  {
    id: 'admin-config',
    official: false,
    query: 'inurl:config',
    explanation: 'configを含むURL構造を持つページ',
    explanationEn: 'Pages with URL structure containing "config"',
    risk: 'medium',
    category: '管理系'
  },
  {
    id: 'admin-login-php',
    official: false,
    query: 'inurl:login filetype:php',
    explanation: 'PHPログインページが公開されていないか',
    explanationEn: 'Check if PHP login pages are publicly accessible',
    risk: 'medium',
    category: '管理系'
  },
  {
    id: 'admin-phpmyadmin',
    official: false,
    query: 'intitle:"phpMyAdmin"',
    explanation: 'phpMyAdminがアクセス可能か',
    explanationEn: 'Check if phpMyAdmin is accessible',
    risk: 'high',
    category: '管理系'
  },

  // === 情報ワード ===
  {
    id: 'info-password',
    official: true,
    query: '"password"',
    explanation: '「password」という語を含むページ',
    explanationEn: 'Pages containing the word "password"',
    risk: 'high',
    category: '情報ワード'
  },
  {
    id: 'info-db-password',
    official: true,
    query: '"DB_PASSWORD"',
    explanation: '典型的なデータベースパスワード変数が含まれている可能性',
    explanationEn: 'Possible presence of typical database password variables',
    risk: 'high',
    category: '情報ワード'
  },
  {
    id: 'info-basic-auth',
    official: true,
    query: '"Authorization: Basic"',
    explanation: 'Basic認証の文字列が埋め込まれていないか',
    explanationEn: 'Check if Basic authentication strings are embedded',
    risk: 'high',
    category: '情報ワード'
  },
  {
    id: 'info-confidential',
    official: true,
    query: '"confidential"',
    explanation: '「confidential（機密）」を含むページ',
    explanationEn: 'Pages containing "confidential"',
    risk: 'high',
    category: '情報ワード'
  },
  {
    id: 'info-private-key',
    official: true,
    query: '"private key"',
    explanation: '秘密鍵（private key）が含まれていないか',
    explanationEn: 'Check if private keys are contained',
    risk: 'high',
    category: '情報ワード'
  },
  {
    id: 'info-api-key',
    official: true,
    query: '"api_key" filetype:json',
    explanation: 'JSONファイル中にAPIキーが含まれていないか',
    explanationEn: 'Check if API keys are contained in JSON files',
    risk: 'high',
    category: '情報ワード'
  },
  {
    id: 'info-token-log',
    official: true,
    query: '"token" filetype:log',
    explanation: 'ログファイル中にトークン情報が含まれていないか',
    explanationEn: 'Check if token information is contained in log files',
    risk: 'high',
    category: '情報ワード'
  },

  // === その他 ===
  {
    id: 'other-index-of',
    official: false,
    query: 'intitle:"index of"',
    explanation: 'ディレクトリリスティングが有効なページを探す',
    explanationEn: 'Find pages with directory listing enabled',
    risk: 'high',
    category: 'その他'
  },
  {
    id: 'other-phpinfo',
    official: false,
    query: 'intitle:"phpinfo()"',
    explanation: 'phpinfo()のページが公開状態か確認',
    explanationEn: 'Check if phpinfo() pages are publicly accessible',
    risk: 'high',
    category: 'その他'
  },
  {
    id: 'other-txt',
    official: true,
    query: 'filetype:txt',
    explanation: 'テキストファイルの一覧（robots.txt, readme等）',
    explanationEn: 'List of text files (robots.txt, readme, etc.)',
    risk: 'low',
    category: 'その他'
  },
  {
    id: 'other-test',
    official: false,
    query: 'inurl:test',
    explanation: '開発・テスト用のURLが公開されたままか',
    explanationEn: 'Check if development/test URLs remain publicly accessible',
    risk: 'medium',
    category: 'その他'
  }
];

// カテゴリー名は識別子なので日本語のまま残し、表示用の訳だけを辞書のキーで示す。
const categoryKeys = {
  'ファイル漏洩': 'category.file',
  '管理系': 'category.admin',
  '情報ワード': 'category.info',
  'その他': 'category.other'
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { dorks, categoryKeys };
}
