export default {
  // 应用标题和基本信息
  app: {
    title: 'Everything AI Chat',
    subtitle: '基于Everything搜索服务的AI智能文件搜索客户端'
  },
  
  // 窗口控制
  window: {
    minimize: '最小化',
    maximize: '最大化',
    restore: '还原',
    close: '关闭'
  },
  
  // 连接状态
  status: {
    connected: '已连接',
    connecting: '连接中',
    disconnected: '未连接',
    ready: '就绪',
    searching: '搜索中...',
    version: 'Everything v{version}'
  },
  
  // 搜索功能
  search: {
    title: '🔍 智能文件搜索',
    placeholder: '输入自然语言查询，AI将转换为Everything语法...',
    button: '搜索',
    searching: '搜索中...',
    clear: '清空结果',
    export: '导出结果',
    duration: '搜索耗时: {duration}s',
    found: '找到 {count} 个文件',
    query: '使用查询: {query}',
    noResults: '未找到匹配的文件',
    noResultsHint: '尝试使用不同的关键词或检查Everything是否正在运行',
    welcome: '开始您的智能搜索之旅',
    welcomeHint: '输入自然语言，AI 将为您转换为 Everything 精确搜索语法',
    suggestions: {
      title: '💡 试试这些搜索：',
      today_images: '今天的图片',
      large_videos: '大于10MB的视频', 
      recent_docs: '本周修改的文档'
    }
  },
  
  // 文件列表
  fileList: {
    columns: {
      name: '文件名',
      path: '路径',
      size: '大小',
      modified: '修改时间',
      created: '创建时间',
      accessed: '访问时间',
      attributes: '属性',
      runCount: '运行次数',
      type: '类型'
    },
    sort: {
      ascending: '升序',
      descending: '降序'
    }
  },
  
  // 调试面板
  debug: {
    title: '🤖 AI响应调试',
    clear: '清空调试输出',
    hide: '隐藏调试面板',
    empty: '等待AI响应...',
    emptyHint: '执行搜索后这里会显示AI的实时响应过程',
    result: '转换结果:',
    error: '错误:',
    timestamp: '{time}'
  },
  
  // 设置对话框
  settings: {
    title: '设置',
    close: '关闭',
    save: '保存',
    saving: '保存中...',
    cancel: '取消',
    
    // 语言设置
    language: {
      title: '🌍 语言设置',
      description: '选择应用界面语言',
      label: '界面语言',
      current: '当前语言: {language}'
    },
    
    // 显示字段配置
    display: {
      title: '显示字段配置',
      description: '选择在搜索结果中显示的字段信息',
      fields: {
        accessed: '访问时间',
        attributes: '文件属性',
        created: '创建时间',
        recentlyChanged: '最近更改',
        runCount: '运行次数',
        fileListFilename: '文件列表名'
      }
    },
    
    // OpenAI配置
    openai: {
      title: 'OpenAI 配置',
      description: '配置OpenAI API以启用自然语言转Everything搜索语法功能',
      apiKey: {
        label: 'API Key',
        placeholder: 'sk-...',
        help: '您的OpenAI API Key，用于调用GPT模型进行搜索语法转换'
      },
      baseUrl: {
        label: 'Base URL (可选)',
        placeholder: 'https://api.openai.com/v1',
        help: '自定义API端点，支持兼容的第三方服务'
      },
      model: {
        label: '模型',
        placeholder: '输入或选择模型',
        help: '输入自定义模型名称或从历史记录中选择'
      }
    },
    
    // 系统提示词配置
    systemPrompt: {
      title: '🤖 AI 系统提示词配置',
      description: '自定义AI的系统提示词来优化搜索结果的质量和风格。系统提示词决定了AI如何理解和转换您的自然语言搜索。',
      label: '系统提示词',
      placeholder: '请输入自定义的系统提示词...',
      help: '提示词应该指导AI如何将自然语言转换为Everything搜索语法。留空将使用默认提示词。',
      reset: '🔄 重置为默认',
      preview: '预览效果',
      hidePreview: '隐藏预览',
      previewTitle: '提示词预览',
      tips: {
        title: '💡 使用提示',
        guidance: '明确指导: 告诉AI如何理解搜索意图并转换为Everything语法',
        examples: '包含示例: 在提示词中包含一些转换示例会提高准确性',
        concise: '保持简洁: 避免过于复杂的指令，保持提示词清晰易懂',
        test: '测试效果: 修改后可以通过实际搜索来验证效果'
      }
    },
    
    // Everything设置
    everything: {
      title: 'Everything 设置',
      description: '自动配置Everything HTTP服务，或手动设置连接参数',
      status: 'Everything 状态:',
      test: '测试连接',
      testing: '测试中...',
      
      // 一键连接
      autoConnect: {
        title: '🚀 一键连接Everything服务',
        description: '自动搜索Everything安装位置，配置HTTP服务并启动连接',
        button: '🔗 一键连接Everything服务',
        connecting: '连接中...',
        manualPath: '📁 手动设置路径',
        progress: '连接进度:',
        
        manualPathSection: {
          label: 'Everything安装路径',
          placeholder: '例如: C:\\Program Files\\Everything\\Everything.exe',
          help: '可以输入Everything.exe的完整路径，或者安装目录路径',
          confirm: '确认设置',
          setting: '设置中...'
        },
        
        result: {
          port: '🌐 HTTP服务端口: {port}',
          installPath: '📁 安装路径: {path}',
          credentials: '🔐 访问凭据（请妥善保存）:',
          username: '用户名:',
          password: '密码:',
          showPassword: '显示密码',
          hidePassword: '隐藏密码',
          copy: '复制',
          note: '💡 这些凭据已自动保存到Everything配置文件中，下次启动Everything时会自动应用'
        }
      },
      
      // 端口配置
      port: {
        title: '🌐 端口配置',
        description: '配置Everything HTTP服务的连接端口',
        auto: '自动选择端口（推荐）',
        autoDescription: '系统会自动查找可用的端口，优先使用常用端口如8080、8888等',
        fixed: '固定端口',
        fixedDescription: '使用指定的固定端口，如果端口被占用则连接失败',
        portLabel: '端口号',
        portPlaceholder: '8080',
        portHelp: '端口范围：1-65535，建议使用8080、8888、9080等',
        portError: '请输入有效的端口号（1-65535）',
        suggestions: '常用端口：'
      },
      
      // 当前配置
      currentConfig: {
        title: '当前配置',
        portMode: '端口模式:',
        httpPort: 'HTTP端口:',
        configPort: '配置端口:',
        installPath: '安装路径:',
        authStatus: '认证状态:',
        loginUser: '登录用户:',
        notSet: '未设置',
        enabled: '✅ 已启用',
        disabled: '❌ 未启用',
        autoMode: '自动选择',
        fixedMode: '固定端口'
      },
      
      // 说明
      info: {
        title: '说明:',
        autoConnect: '一键连接: 自动搜索Everything安装位置，配置HTTP服务，无需手动操作',
        autoHandle: '自动处理: 会自动关闭现有Everything进程，修改配置文件，重启服务',
        portSelection: '端口选择: 自动选择未被占用的端口（优先8080、8888等）',
        compatibility: '兼容性: 支持Everything 1.4及以上版本'
      }
    },
    
    // 未保存更改警告
    unsaved: {
      warning: '检测到未保存的更改，将在3秒后自动保存并关闭',
      saveNow: '立即保存',
      discard: '放弃更改'
    }
  },
  
  // 消息提示
  messages: {
    success: {
      configSaved: '配置保存成功',
      exported: '结果导出成功',
      connected: 'Everything连接成功！',
      pathSet: 'Everything路径设置成功'
    },
    
    error: {
      configSaveFailed: '配置保存失败',
      connectionFailed: 'Everything连接失败',
      exportFailed: '导出失败',
      searchFailed: '搜索失败，未知错误',
      searchError: '搜索过程中发生错误: {error}',
      loadConfigFailed: '加载配置失败',
      invalidPort: '端口号无效',
      pathSetFailed: 'Everything路径设置失败'
    },
    
    info: {
      ok: '知道了',
      loading: '加载中...',
      processing: '处理中...',
      testing: '测试中...'
    }
  },
  
  // 右键菜单（可能在主进程中使用）
  contextMenu: {
    open: '打开',
    openWith: '打开方式...',
    showInExplorer: '在资源管理器中显示',
    copyPath: '复制路径',
    copyName: '复制文件名',
    properties: '属性'
  },
  
  // 时间格式
  time: {
    now: '刚刚',
    minute: '{count} 分钟前',
    hour: '{count} 小时前',
    day: '{count} 天前',
    week: '{count} 周前',
    month: '{count} 月前',
    year: '{count} 年前'
  }
}
