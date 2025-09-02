export default {
  // 應用標題和基本資訊
  app: {
    title: 'Everything AI Chat',
    subtitle: '基於Everything搜尋服務的AI智慧檔案搜尋用戶端'
  },
  
  // 視窗控制
  window: {
    minimize: '最小化',
    maximize: '最大化',
    restore: '還原',
    close: '關閉'
  },
  
  // 連接狀態
  status: {
    connected: '已連接',
    connecting: '連接中',
    disconnected: '未連接',
    ready: '就緒',
    searching: '搜尋中...',
    version: 'Everything v{version}'
  },
  
  // 搜尋功能
  search: {
    title: '🔍 智慧檔案搜尋',
    placeholder: '輸入自然語言查詢，AI將轉換為Everything語法...',
    button: '搜尋',
    searching: '搜尋中...',
    clear: '清空結果',
    export: '匯出結果',
    duration: '搜尋耗時: {duration}s',
    found: '找到 {count} 個檔案',
    query: '使用查詢: {query}',
    noResults: '未找到符合的檔案',
    noResultsHint: '嘗試使用不同的關鍵字或檢查Everything是否正在執行',
    welcome: '開始您的智慧搜尋之旅',
    welcomeHint: '輸入自然語言，AI 將為您轉換為 Everything 精確搜尋語法',
    suggestions: {
      title: '💡 試試這些搜尋：',
      today_images: '今天的圖片',
      large_videos: '大於10MB的影片', 
      recent_docs: '本週修改的文件'
    }
  },
  
  // 檔案清單
  fileList: {
    columns: {
      name: '檔案名稱',
      path: '路徑',
      size: '大小',
      modified: '修改時間',
      created: '建立時間',
      accessed: '存取時間',
      attributes: '屬性',
      runCount: '執行次數',
      type: '類型'
    },
    sort: {
      ascending: '升序',
      descending: '降序'
    }
  },
  
  // 偵錯面板
  debug: {
    title: '🤖 AI回應偵錯',
    clear: '清空偵錯輸出',
    hide: '隱藏偵錯面板',
    empty: '等待AI回應...',
    emptyHint: '執行搜尋後這裡會顯示AI的即時回應過程',
    result: '轉換結果:',
    error: '錯誤:',
    timestamp: '{time}'
  },
  
  // 設定對話框
  settings: {
    title: '設定',
    close: '關閉',
    save: '儲存',
    saving: '儲存中...',
    cancel: '取消',
    
    // 語言設定
    language: {
      title: '🌍 語言設定',
      description: '選擇應用介面語言',
      label: '介面語言',
      current: '目前語言: {language}'
    },
    
    // 顯示欄位設定
    display: {
      title: '顯示欄位設定',
      description: '選擇在搜尋結果中顯示的欄位資訊',
      fields: {
        accessed: '存取時間',
        attributes: '檔案屬性',
        created: '建立時間',
        recentlyChanged: '最近更改',
        runCount: '執行次數',
        fileListFilename: '檔案清單名稱'
      }
    },
    
    // OpenAI設定
    openai: {
      title: 'OpenAI 設定',
      description: '設定OpenAI API以啟用自然語言轉Everything搜尋語法功能',
      apiKey: {
        label: 'API Key',
        placeholder: 'sk-...',
        help: '您的OpenAI API Key，用於呼叫GPT模型進行搜尋語法轉換'
      },
      baseUrl: {
        label: 'Base URL (可選)',
        placeholder: 'https://api.openai.com/v1',
        help: '自訂API端點，支援相容的第三方服務'
      },
      model: {
        label: '模型',
        placeholder: '輸入或選擇模型',
        help: '輸入自訂模型名稱或從歷史記錄中選擇'
      }
    },
    
    // 偵錯設定
    debug: {
      title: '🐛 AI偵錯設定',
      description: '設定AI回應的偵錯和診斷功能',
      enableStream: '啟用串流輸出偵錯',
      enableStreamHelp: '開啟後，在搜尋時會顯示AI即時回應過程，用於偵錯和觀察AI的工作狀態'
    },
    
    // 系統提示詞設定
    systemPrompt: {
      title: '🤖 AI 系統提示詞設定',
      description: '自訂AI的系統提示詞來最佳化搜尋結果的品質和風格。系統提示詞決定了AI如何理解和轉換您的自然語言搜尋。',
      label: '系統提示詞',
      placeholder: '請輸入自訂的系統提示詞...',
      help: '提示詞應該指導AI如何將自然語言轉換為Everything搜尋語法。留空將使用預設提示詞。',
      reset: '🔄 重設為預設',
      preview: '預覽效果',
      hidePreview: '隱藏預覽',
      previewTitle: '提示詞預覽',
      tips: {
        title: '💡 使用提示',
        guidanceTitle: '明確指導',
        guidance: '告訴AI如何理解搜尋意圖並轉換為Everything語法',
        examplesTitle: '包含範例',
        examples: '在提示詞中包含一些轉換範例會提高準確性',
        conciseTitle: '保持簡潔',
        concise: '避免過於複雜的指令，保持提示詞清晰易懂',
        testTitle: '測試效果',
        test: '修改後可以透過實際搜尋來驗證效果'
      }
    },
    
    // Everything設定
    everything: {
      title: 'Everything 設定',
      description: '自動設定Everything HTTP服務，或手動設定連接參數',
      status: 'Everything 狀態:',
      test: '測試連接',
      testing: '測試中...',
      
      // 一鍵連接
      autoConnect: {
        title: '🚀 一鍵連接Everything服務',
        description: '自動搜尋Everything安裝位置，設定HTTP服務並啟動連接',
        button: '🔗 一鍵連接Everything服務',
        connecting: '連接中...',
        manualPath: '📁 手動設定路徑',
        progress: '連接進度:',
        
        manualPathSection: {
          label: 'Everything安裝路徑',
          placeholder: '例如: C:\\Program Files\\Everything\\Everything.exe',
          help: '可以輸入Everything.exe的完整路徑，或者安裝目錄路徑',
          confirm: '確認設定',
          setting: '設定中...'
        },
        
        result: {
          port: '🌐 HTTP服務連接埠: {port}',
          installPath: '📁 安裝路徑: {path}',
          credentials: '🔐 存取憑證（請妥善保存）:',
          username: '使用者名稱:',
          password: '密碼:',
          showPassword: '顯示密碼',
          hidePassword: '隱藏密碼',
          copy: '複製',
          note: '💡 這些憑證已自動儲存到Everything設定檔中，下次啟動Everything時會自動套用'
        }
      },
      
      // 連接埠設定
      port: {
        title: '🌐 連接埠設定',
        description: '設定Everything HTTP服務的連接埠',
        auto: '自動選擇連接埠（建議）',
        autoDescription: '系統會自動查找可用的連接埠，優先使用常用連接埠如8080、8888等',
        fixed: '固定連接埠',
        fixedDescription: '使用指定的固定連接埠，如果連接埠被佔用則連接失敗',
        portLabel: '連接埠號',
        portPlaceholder: '8080',
        portHelp: '連接埠範圍：1-65535，建議使用8080、8888、9080等',
        portError: '請輸入有效的連接埠號（1-65535）',
        suggestions: '常用連接埠：'
      },
      
      // 目前設定
      currentConfig: {
        title: '目前設定',
        portMode: '連接埠模式:',
        httpPort: 'HTTP連接埠:',
        configPort: '設定連接埠:',
        installPath: '安裝路徑:',
        authStatus: '驗證狀態:',
        loginUser: '登入使用者:',
        notSet: '未設定',
        enabled: '✅ 已啟用',
        disabled: '❌ 未啟用',
        autoMode: '自動選擇',
        fixedMode: '固定連接埠'
      },
      
      // 說明
      info: {
        title: '說明:',
        autoConnect: '一鍵連接: 自動搜尋Everything安裝位置，設定HTTP服務，無需手動操作',
        autoHandle: '自動處理: 會自動關閉現有Everything程序，修改設定檔，重啟服務',
        portSelection: '連接埠選擇: 自動選擇未被佔用的連接埠（優先8080、8888等）',
        compatibility: '相容性: 支援Everything 1.4及以上版本'
      }
    },
    
    // 未儲存變更警告
    unsaved: {
      warning: '偵測到未儲存的變更，將在3秒後自動儲存並關閉',
      saveNow: '立即儲存',
      discard: '放棄變更'
    }
  },
  
  // 訊息提示
  messages: {
    success: {
      configSaved: '設定儲存成功',
      exported: '結果匯出成功',
      connected: 'Everything連接成功！',
      pathSet: 'Everything路徑設定成功',
      autoConnectSuccess: 'Everything HTTP服務連接成功！'
    },
    
    error: {
      configSaveFailed: '設定儲存失敗',
      connectionFailed: 'Everything連接失敗',
      exportFailed: '匯出失敗',
      searchFailed: '搜尋失敗，未知錯誤',
      searchError: '搜尋過程中發生錯誤: {error}',
      loadConfigFailed: '載入設定失敗',
      invalidPort: '連接埠號無效',
      pathSetFailed: 'Everything路徑設定失敗: {error}',
      autoConnectFailed: '連接失敗: {error}',
      autoConnectError: '連接過程中發生錯誤: {error}'
    },
    
    info: {
      ok: '知道了',
      loading: '載入中...',
      processing: '處理中...',
      testing: '測試中...',
      connecting: '連接中...',
      setting: '設定中...'
    }
  },
  
  // 右鍵選單（可能在主程序中使用）
  contextMenu: {
    open: '開啟',
    openWith: '開啟方式...',
    showInExplorer: '在檔案總管中顯示',
    copyPath: '複製路徑',
    copyName: '複製檔案名稱',
    properties: '內容'
  },
  
  // 時間格式
  time: {
    now: '剛剛',
    minute: '{count} 分鐘前',
    hour: '{count} 小時前',
    day: '{count} 天前',
    week: '{count} 週前',
    month: '{count} 月前',
    year: '{count} 年前'
  }
}
