const dorks = [
  // === ファイル漏洩 ===
  {
    query: 'filetype:xls',
    explanation: '表計算ファイル（名簿やパスワードが含まれる可能性）',
    risk: 'high',
    category: 'ファイル漏洩'
  },
  {
    query: 'filetype:pdf',
    explanation: '公開PDF（営業資料や内規など）',
    risk: 'low',
    category: 'ファイル漏洩'
  },
  {
    query: 'ext:sql OR ext:bak OR ext:old',
    explanation: 'バックアップやDBファイルの漏洩チェック',
    risk: 'high',
    category: 'ファイル漏洩'
  },
  {
    query: 'filetype:env',
    explanation: '.env 環境変数ファイルが公開されていないか',
    risk: 'high',
    category: 'ファイル漏洩'
  },
  {
    query: 'ext:log',
    explanation: 'ログファイルが外部から参照可能か',
    risk: 'high',
    category: 'ファイル漏洩'
  },
  {
    query: 'filetype:doc',
    explanation: 'Word文書の誤公開をチェック',
    risk: 'medium',
    category: 'ファイル漏洩'
  },
  {
    query: 'filetype:json inurl:config',
    explanation: '設定ファイルがJSON形式で露出していないか',
    risk: 'high',
    category: 'ファイル漏洩'
  },
  {
    query: 'inurl:.git',
    explanation: 'Gitリポジトリが公開されたままになっていないか',
    risk: 'high',
    category: 'ファイル漏洩'
  },
  {
    query: 'intitle:"index of /backup"',
    explanation: 'バックアップディレクトリが一覧表示されていないか',
    risk: 'high',
    category: 'ファイル漏洩'
  },
  {
    query: 'filetype:sql password',
    explanation: 'パスワード付きのSQLファイルが公開されていないか',
    risk: 'high',
    category: 'ファイル漏洩'
  },

  // === 管理系 ===
  {
    query: 'inurl:login',
    explanation: 'ログインページのURLを調査',
    risk: 'medium',
    category: '管理系'
  },
  {
    query: 'inurl:admin',
    explanation: '管理画面の入り口を探す',
    risk: 'medium',
    category: '管理系'
  },
  {
    query: 'allintext:admin login',
    explanation: '管理用ログインページの特徴的な語を含むページ',
    risk: 'medium',
    category: '管理系'
  },
  {
    query: 'intitle:"Admin Panel"',
    explanation: '「Admin Panel」のタイトルを持つページ',
    risk: 'medium',
    category: '管理系'
  },
  {
    query: 'inurl:dashboard',
    explanation: 'ダッシュボードへのURLパターン',
    risk: 'medium',
    category: '管理系'
  },
  {
    query: 'inurl:wp-admin',
    explanation: 'WordPressの管理画面URL',
    risk: 'medium',
    category: '管理系'
  },
  {
    query: 'inurl:config',
    explanation: 'configを含むURL構造を持つページ',
    risk: 'medium',
    category: '管理系'
  },
  {
    query: 'inurl:login filetype:php',
    explanation: 'PHPログインページが公開されていないか',
    risk: 'medium',
    category: '管理系'
  },
  {
    query: 'intitle:"phpMyAdmin"',
    explanation: 'phpMyAdminがアクセス可能か',
    risk: 'high',
    category: '管理系'
  },

  // === 情報ワード ===
  {
    query: '"password"',
    explanation: '「password」という語を含むページ',
    risk: 'high',
    category: '情報ワード'
  },
  {
    query: '"DB_PASSWORD"',
    explanation: '典型的なデータベースパスワード変数が含まれている可能性',
    risk: 'high',
    category: '情報ワード'
  },
  {
    query: '"Authorization: Basic"',
    explanation: 'Basic認証の文字列が埋め込まれていないか',
    risk: 'high',
    category: '情報ワード'
  },
  {
    query: '"confidential"',
    explanation: '「confidential（機密）」を含むページ',
    risk: 'high',
    category: '情報ワード'
  },
  {
    query: '"private key"',
    explanation: '秘密鍵（private key）が含まれていないか',
    risk: 'high',
    category: '情報ワード'
  },
  {
    query: '"api_key" filetype:json',
    explanation: 'JSONファイル中にAPIキーが含まれていないか',
    risk: 'high',
    category: '情報ワード'
  },
  {
    query: '"token" filetype:log',
    explanation: 'ログファイル中にトークン情報が含まれていないか',
    risk: 'high',
    category: '情報ワード'
  },

  // === その他 ===
  {
    query: 'intitle:"index of"',
    explanation: 'ディレクトリリスティングが有効なページを探す',
    risk: 'high',
    category: 'その他'
  },
  {
    query: 'intitle:"phpinfo()"',
    explanation: 'phpinfo()のページが公開状態か確認',
    risk: 'high',
    category: 'その他'
  },
  {
    query: 'site:example.com ext:txt',
    explanation: 'テキストファイルの一覧（robots.txt, readme等）',
    risk: 'low',
    category: 'その他'
  },
  {
    query: 'inurl:test',
    explanation: '開発・テスト用のURLが公開されたままか',
    risk: 'medium',
    category: 'その他'
  }
];
