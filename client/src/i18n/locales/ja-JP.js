export default {
  // アプリケーションのタイトルと基本情報
  app: {
    title: 'Everything AI Chat',
    subtitle: 'Everything検索サービスベースのAI搭載ファイル検索クライアント'
  },
  
  // ウィンドウコントロール
  window: {
    minimize: '最小化',
    maximize: '最大化',
    restore: '復元',
    close: '閉じる'
  },
  
  // 接続状態
  status: {
    connected: '接続済み',
    connecting: '接続中',
    disconnected: '未接続',
    ready: '準備完了',
    searching: '検索中...',
    version: 'Everything v{version}'
  },
  
  // 検索機能
  search: {
    title: '🔍 スマートファイル検索',
    placeholder: '自然言語でクエリを入力してください。AIがEverything構文に変換します...',
    button: '検索',
    searching: '検索中...',
    clear: '結果をクリア',
    export: '結果をエクスポート',
    duration: '検索時間: {duration}秒',
    found: '{count}個のファイルが見つかりました',
    query: '使用クエリ: {query}',
    noResults: '一致するファイルが見つかりませんでした',
    noResultsHint: '異なるキーワードを試すか、Everythingが実行されているか確認してください',
    welcome: 'スマート検索の旅を始めましょう',
    welcomeHint: '自然言語を入力すると、AIがEverythingの正確な検索構文に変換します',
    suggestions: {
      title: '💡 これらの検索を試してみてください：',
      today_images: '今日の画像',
      large_videos: '10MB以上の動画',
      recent_docs: '今週変更されたドキュメント'
    }
  },
  
  // ファイルリスト
  fileList: {
    columns: {
      name: 'ファイル名',
      path: 'パス',
      size: 'サイズ',
      modified: '更新日時',
      created: '作成日時',
      accessed: 'アクセス日時',
      attributes: '属性',
      runCount: '実行回数',
      type: 'タイプ'
    },
    sort: {
      ascending: '昇順',
      descending: '降順'
    }
  },
  
  // デバッグパネル
  debug: {
    title: '🤖 AI応答デバッグ',
    clear: 'デバッグ出力をクリア',
    hide: 'デバッグパネルを非表示',
    empty: 'AI応答を待機中...',
    emptyHint: '検索後、ここにAIのリアルタイム応答プロセスが表示されます',
    result: '変換結果:',
    error: 'エラー:',
    timestamp: '{time}'
  },
  
  // 設定ダイアログ
  settings: {
    title: '設定',
    close: '閉じる',
    save: '保存',
    saving: '保存中...',
    cancel: 'キャンセル',
    
    // 言語設定
    language: {
      title: '🌍 言語設定',
      description: 'アプリケーションインターフェースの言語を選択',
      label: 'インターフェース言語',
      current: '現在の言語: {language}'
    },
    
    // 表示フィールド設定
    display: {
      title: '表示フィールド設定',
      description: '検索結果に表示するフィールドを選択',
      fields: {
        accessed: 'アクセス時刻',
        attributes: 'ファイル属性',
        created: '作成時刻',
        recentlyChanged: '最近変更',
        runCount: '実行回数',
        fileListFilename: 'ファイルリスト名'
      }
    },
    
    // OpenAI設定
    openai: {
      title: 'OpenAI設定',
      description: '自然言語からEverything検索構文への変換を有効にするためのOpenAI APIの設定',
      apiKey: {
        label: 'APIキー',
        placeholder: 'sk-...',
        help: '検索構文変換のためのGPTモデル呼び出し用OpenAI APIキー'
      },
      baseUrl: {
        label: 'ベースURL（オプション）',
        placeholder: 'https://api.openai.com/v1',
        help: 'カスタムAPIエンドポイント、互換性のあるサードパーティサービスをサポート'
      },
      model: {
        label: 'モデル',
        placeholder: 'モデルを入力または選択',
        help: 'カスタムモデル名を入力するか、履歴から選択'
      }
    },
    
    // システムプロンプト設定
    systemPrompt: {
      title: '🤖 AIシステムプロンプト設定',
      description: '検索結果の品質とスタイルを最適化するためにAIシステムプロンプトをカスタマイズ。システムプロンプトはAIがあなたの自然言語検索をどのように理解し変換するかを決定します。',
      label: 'システムプロンプト',
      placeholder: 'カスタムシステムプロンプトを入力してください...',
      help: 'プロンプトはAIに自然言語をEverything検索構文に変換する方法を指導する必要があります。デフォルトプロンプトを使用するには空のままにしてください。',
      reset: '🔄 デフォルトにリセット',
      preview: '効果をプレビュー',
      hidePreview: 'プレビューを非表示',
      previewTitle: 'プロンプトプレビュー',
      tips: {
        title: '💡 使用のヒント',
        guidance: '明確なガイダンス: AIに検索意図の理解方法とEverything構文への変換方法を伝える',
        examples: '例を含める: プロンプトに変換例を含めることで精度が向上します',
        concise: '簡潔に保つ: 複雑すぎる指示は避け、プロンプトを明確で理解しやすく保つ',
        test: '効果をテスト: 変更後、実際の検索を通じて効果を確認できます'
      }
    },
    
    // Everything設定
    everything: {
      title: 'Everything設定',
      description: 'Everything HTTPサービスを自動設定するか、接続パラメータを手動設定',
      status: 'Everythingステータス:',
      test: '接続をテスト',
      testing: 'テスト中...',
      
      // 自動接続
      autoConnect: {
        title: '🚀 Everythingサービスワンクリック接続',
        description: 'Everythingインストール場所を自動検索し、HTTPサービスを設定して接続を確立',
        button: '🔗 Everythingサービスワンクリック接続',
        connecting: '接続中...',
        manualPath: '📁 パスを手動設定',
        progress: '接続進捗:',
        
        manualPathSection: {
          label: 'Everythingインストールパス',
          placeholder: '例: C:\\Program Files\\Everything\\Everything.exe',
          help: 'Everything.exeのフルパスまたはインストールディレクトリパスを入力できます',
          confirm: '設定を確認',
          setting: '設定中...'
        },
        
        result: {
          port: '🌐 HTTPサービスポート: {port}',
          installPath: '📁 インストールパス: {path}',
          credentials: '🔐 アクセス認証情報（適切に保存してください）:',
          username: 'ユーザー名:',
          password: 'パスワード:',
          showPassword: 'パスワードを表示',
          hidePassword: 'パスワードを非表示',
          copy: 'コピー',
          note: '💡 これらの認証情報はEverything設定ファイルに自動保存され、次回Everything起動時に自動適用されます'
        }
      },
      
      // ポート設定
      port: {
        title: '🌐 ポート設定',
        description: 'Everything HTTPサービス接続ポートを設定',
        auto: '自動ポート選択（推奨）',
        autoDescription: 'システムが自動的に利用可能なポートを見つけ、8080、8888などの一般的なポートを優先します。',
        fixed: '固定ポート',
        fixedDescription: '指定された固定ポートを使用、ポートが使用中の場合は接続に失敗',
        portLabel: 'ポート番号',
        portPlaceholder: '8080',
        portHelp: 'ポート範囲: 1-65535、推奨: 8080、8888、9080など',
        portError: '有効なポート番号を入力してください（1-65535）',
        suggestions: '一般的なポート:'
      },
      
      // 現在の設定
      currentConfig: {
        title: '現在の設定',
        portMode: 'ポートモード:',
        httpPort: 'HTTPポート:',
        configPort: '設定ポート:',
        installPath: 'インストールパス:',
        authStatus: '認証ステータス:',
        loginUser: 'ログインユーザー:',
        notSet: '未設定',
        enabled: '✅ 有効',
        disabled: '❌ 無効',
        autoMode: '自動選択',
        fixedMode: '固定ポート'
      },
      
      // 情報
      info: {
        title: '説明:',
        autoConnect: 'ワンクリック接続: Everythingインストール場所を自動検索、HTTPサービス設定、手動操作不要',
        autoHandle: '自動処理: 既存のEverythingプロセスを自動終了、設定ファイル変更、サービス再起動',
        portSelection: 'ポート選択: 未使用ポートの自動選択（8080、8888などを優先）',
        compatibility: '互換性: Everything 1.4以上をサポート'
      }
    },
    
    // 未保存変更の警告
    unsaved: {
      warning: '未保存の変更が検出されました。3秒後に自動保存して閉じます',
      saveNow: '今すぐ保存',
      discard: '変更を破棄'
    }
  },
  
  // メッセージプロンプト
  messages: {
    success: {
      configSaved: '設定が正常に保存されました',
      exported: '結果が正常にエクスポートされました',
      connected: 'Everything接続成功！',
      pathSet: 'Everythingパスが正常に設定されました'
    },
    
    error: {
      configSaveFailed: '設定の保存に失敗',
      connectionFailed: 'Everything接続失敗',
      exportFailed: 'エクスポート失敗',
      searchFailed: '検索失敗、不明なエラー',
      searchError: '検索中にエラーが発生: {error}',
      loadConfigFailed: '設定の読み込みに失敗',
      invalidPort: '無効なポート番号',
      pathSetFailed: 'Everythingパス設定に失敗'
    },
    
    info: {
      ok: 'OK',
      loading: '読み込み中...',
      processing: '処理中...',
      testing: 'テスト中...'
    }
  },
  
  // コンテキストメニュー
  contextMenu: {
    open: '開く',
    openWith: 'プログラムから開く...',
    showInExplorer: 'エクスプローラーで表示',
    copyPath: 'パスをコピー',
    copyName: '名前をコピー',
    properties: 'プロパティ'
  },
  
  // 時間フォーマット
  time: {
    now: 'たった今',
    minute: '{count}分前',
    hour: '{count}時間前',
    day: '{count}日前',
    week: '{count}週間前',
    month: '{count}か月前',
    year: '{count}年前'
  }
}
