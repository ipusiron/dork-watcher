const dorks = [
  {
    query: 'filetype:xls',
    explanation: '表計算ファイル（パスワード一覧や名簿が含まれる可能性）',
    risk: 'high'
  },
  {
    query: 'inurl:login',
    explanation: 'ログイン画面の存在を探す',
    risk: 'medium'
  },
  {
    query: 'intitle:"index of"',
    explanation: 'ディレクトリリスティングが有効な場所を探す',
    risk: 'high'
  },
  {
    query: 'ext:sql OR ext:bak OR ext:old',
    explanation: 'バックアップファイルやDBファイルが露出していないか調査',
    risk: 'high'
  },
  {
    query: '"password"',
    explanation: 'ページ内にパスワードという文字列を含むものを検索',
    risk: 'high'
  },
  {
    query: 'inurl:admin',
    explanation: '管理画面のURLを探す',
    risk: 'medium'
  },
  {
    query: 'filetype:pdf',
    explanation: '公開PDFの取得（営業資料や内規の流出チェック）',
    risk: 'low'
  },
  {
    query: 'inurl:.git',
    explanation: 'Gitのバージョン管理ディレクトリが公開されていないか調査',
    risk: 'high'
  },
  {
    query: '"Index of /"',
    explanation: 'Apacheなどのデフォルトディレクトリ一覧が見える可能性',
    risk: 'high'
  },
  {
    query: 'confidential',
    explanation: '「confidential（機密）」という単語を含む文書の検出',
    risk: 'high'
  }
];
