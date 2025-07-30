const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const Store = require('electron-store');
const OpenAI = require('openai');
const EverythingSearch = require('./everything-search');
const EverythingManager = require('./everything-manager');

// 初始化配置存储
const store = new Store();

// 初始化搜索历史存储
const searchHistoryStore = new Store({
  name: 'search-history',
  defaults: {
    searches: []
  }
});

// OpenAI实例
let openai;

// Everything搜索实例
let everythingSearch;

// Everything管理器实例
let everythingManager;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hidden',
    frame: false,
    show: false
  });

  // 开发环境加载Vue开发服务器，生产环境加载构建文件
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  if (isDev) {
    // 等待Vue开发服务器启动
    const loadDevServer = async () => {
      try {
        await mainWindow.loadURL('http://127.0.0.1:5173');
        mainWindow.webContents.openDevTools();
      } catch (error) {
        console.log('等待Vue开发服务器启动...');
        setTimeout(loadDevServer, 1000);
      }
    };
    loadDevServer();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist-vue/index.html'));
  }

  // 窗口准备好后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

// 初始化搜索历史存储（使用electron-store，无需单独初始化）

// 初始化OpenAI
function initOpenAI() {
  const apiKey = store.get('openai.apiKey');
  if (apiKey) {
    openai = new OpenAI({
      apiKey: apiKey,
      baseURL: store.get('openai.baseURL', 'https://api.openai.com/v1')
    });
  }
}

// IPC处理器
ipcMain.handle('search-files', async (event, query) => {
  try {
    // 先尝试将自然语言转换为Everything查询语法
    let everythingQuery = query;

    if (openai && query.length > 3) {
      try {
        const aiResponse = await openai.chat.completions.create({
          model: store.get('openai.model', 'gpt-3.5-turbo'),
          messages: [{
            role: 'system',
            content: `你是一个专业的Everything搜索语法生成器。请将用户的自然语言查询转换为Everything搜索语法，并以JSON格式返回结果。

【Everything搜索语法规则】
- 文件扩展名：*.txt, *.pdf, *.docx 等
- 文件大小：size:>1MB, size:<500KB
- 修改时间：dm:today, dm:yesterday, dm:thisweek
- 创建时间：dc:today, dc:yesterday  
- 路径匹配：path:folder, !path:temp
- 文件名匹配：支持通配符 * 和 ?
- 逻辑操作：AND, OR, NOT 或 & | !
- 正则表达式：regex:pattern

【参考案例】
- "*.pdf dm:today"                  # 今天修改的PDF
- "size:>10mb *.mp4;*.avi"          # 大于10MB的视频文件
- "dc:thisweek *.jpg;*.png"         # 本周创建的图片
- "path:desktop *.docx"             # 桌面上的Word文档
- "*.zip;*.rar dm:yesterday"        # 昨天修改的压缩文件
- "*报告* *.xlsx"                    # 包含"报告"的Excel文件
- "size:>100mb"                     # 大于100MB的文件
- "size:<1kb"                       # 小于1KB的文件
- "size:1mb..100mb"                 # 1MB到100MB之间的文件
- "dm:today"                        # 今天修改的文件
- "dc:yesterday"                    # 昨天创建的文件
- "da:thisweek"                     # 本周访问的文件
- "path:desktop"                    # 桌面路径下的文件
- "!path:temp"                      # 排除临时文件夹的文件
- "*.jpg;*.png;*.gif"               # 常见图片格式
- "*.mp4;*.avi;*.mkv"               # 常见视频格式
- "*.doc;*.docx;*.pdf"              # 常见文档格式

【要求】
请严格按照以下JSON格式返回，不要包含任何其他文本：
{
  "confidence": 0.95,
  "original_query": "用户的原始查询",
  "rules_used": ["使用的语法规则列表"],
  "alternatives": ["可选的替代查询1", "可选的替代查询2"],
  "query": "转换后的符合Everything格式的查询语句"
}`
          }, {
            role: 'user',
            content: query
          }],
          max_tokens: 200,
          temperature: 0.7,
          response_format: { type: "json_object" }
        });

        // 解析JSON响应
        const responseContent = aiResponse.choices[0].message.content.trim();
        try {
          const parsedResponse = JSON.parse(responseContent);

          // 验证JSON结构
          if (parsedResponse.query && typeof parsedResponse.query === 'string') {
            everythingQuery = parsedResponse.query.trim();

            // 记录额外信息用于调试和统计
            console.log('AI搜索转换结果:', {
              original: query,
              converted: everythingQuery,
              confidence: parsedResponse.confidence || 'unknown',
              rules: parsedResponse.rules_used || [],
              alternatives: parsedResponse.alternatives || []
            });
          } else {
            throw new Error('JSON响应格式不正确：缺少query字段');
          }
        } catch (parseError) {
          console.error('解析AI响应JSON失败:', parseError);
          console.error('原始响应:', responseContent);

          // 回退到简单文本提取
          const fallbackMatch = responseContent.match(/"query"\s*:\s*"([^"]+)"/);
          if (fallbackMatch) {
            everythingQuery = fallbackMatch[1].trim();
            console.log('使用回退方案提取查询:', everythingQuery);
          } else {
            throw new Error('无法从AI响应中提取查询语句');
          }
        }
      } catch (error) {
        console.error('OpenAI转换失败:', error);
        // 如果OpenAI失败，使用本地优化规则
        everythingQuery = everythingSearch.optimizeQuery(query);
      }
    } else {
      // 如果没有OpenAI配置，使用本地优化规则
      everythingQuery = everythingSearch.optimizeQuery(query);
    }

    // 执行Everything搜索 - 新的API已经默认包含所有必要信息
    const searchResult = await everythingSearch.search(everythingQuery, {
      count: 1000
    });

    if (!searchResult.success) {
      throw new Error(searchResult.error || 'Everything搜索失败');
    }

    // 保存搜索历史
    saveSearchHistory(query, everythingQuery);

    return {
      success: true,
      query: query,
      everythingQuery: everythingQuery,
      results: searchResult.results,
      totalResults: searchResult.totalResults
    };

  } catch (error) {
    console.error('搜索失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

// 初始化Everything搜索
function initEverythingSearch() {
  const port = store.get('everything.port', 80);
  const credentials = store.get('everything.credentials', null);

  everythingSearch = new EverythingSearch('localhost', port);

  // 如果有保存的凭据，设置到搜索实例
  if (credentials) {
    everythingSearch.setCredentials(credentials.username, credentials.password);
  }
}

// 初始化Everything管理器
function initEverythingManager() {
  everythingManager = new EverythingManager();
}

// 保存搜索历史
function saveSearchHistory(query, everythingQuery) {
  try {
    const searches = searchHistoryStore.get('searches', []);
    const newSearch = {
      id: Date.now(),
      query: query,
      everything_query: everythingQuery,
      created_at: new Date().toISOString()
    };

    // 避免重复，如果查询相同则更新时间
    const existingIndex = searches.findIndex(s => s.query === query);
    if (existingIndex !== -1) {
      searches[existingIndex] = newSearch;
    } else {
      searches.unshift(newSearch);
    }

    // 只保留最近50条记录
    if (searches.length > 50) {
      searches.splice(50);
    }

    searchHistoryStore.set('searches', searches);
  } catch (error) {
    console.error('保存搜索历史失败:', error);
  }
}

// 获取搜索历史
ipcMain.handle('get-search-history', async () => {
  try {
    const searches = searchHistoryStore.get('searches', []);
    return searches.slice(0, 20); // 返回最近20条记录
  } catch (error) {
    console.error('获取搜索历史失败:', error);
    return [];
  }
});

// 设置OpenAI配置
ipcMain.handle('set-openai-config', async (event, config) => {
  try {
    store.set('openai', config);
    initOpenAI();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// 获取OpenAI配置
ipcMain.handle('get-openai-config', async () => {
  return store.get('openai', {});
});

// 打开文件
ipcMain.handle('open-path', async (event, filePath) => {
  try {
    const { shell } = require('electron');
    await shell.openPath(filePath);
    return { success: true };
  } catch (error) {
    console.error('打开文件失败:', error);
    return { success: false, error: error.message };
  }
});

// 在文件管理器中显示文件
ipcMain.handle('show-in-folder', async (event, filePath) => {
  try {
    const { shell } = require('electron');
    shell.showItemInFolder(filePath);
    return { success: true };
  } catch (error) {
    console.error('显示文件失败:', error);
    return { success: false, error: error.message };
  }
});

// 窗口控制 - 最小化
ipcMain.handle('minimize-window', () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    focusedWindow.minimize();
  }
});

// 窗口控制 - 最大化/还原
ipcMain.handle('toggle-maximize', () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    if (focusedWindow.isMaximized()) {
      focusedWindow.unmaximize();
      return false;
    } else {
      focusedWindow.maximize();
      return true;
    }
  }
  return false;
});

// 窗口控制 - 关闭
ipcMain.handle('close-window', () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    focusedWindow.close();
  }
});

// Everything连接状态检测
ipcMain.handle('test-everything-connection', async () => {
  try {
    if (!everythingSearch) {
      initEverythingSearch();
    }
    return await everythingSearch.testConnection();
  } catch (error) {
    console.error('Everything连接测试失败:', error);
    return false;
  }
});

// 一键连接Everything服务
ipcMain.handle('auto-connect-everything', async () => {
  try {
    if (!everythingManager) {
      initEverythingManager();
    }

    const result = await everythingManager.autoConnect();

    if (result.success) {
      // 更新Everything搜索实例的端口和凭据
      everythingSearch = new EverythingSearch('localhost', result.port);

      // 保存配置到store
      store.set('everything.port', result.port);
      store.set('everything.installPath', result.installPath);

      // 保存凭据信息（加密存储）
      if (result.credentials) {
        store.set('everything.credentials', result.credentials);
        // 更新EverythingSearch实例的凭据
        everythingSearch.setCredentials(result.credentials.username, result.credentials.password);
      }
    }

    return result;
  } catch (error) {
    console.error('一键连接Everything失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

// 手动设置Everything路径
ipcMain.handle('set-everything-path', async (event, userPath) => {
  try {
    if (!everythingManager) {
      initEverythingManager();
    }

    const installPath = await everythingManager.setManualPath(userPath);
    store.set('everything.installPath', installPath);

    return {
      success: true,
      installPath: installPath,
      message: 'Everything路径设置成功'
    };
  } catch (error) {
    console.error('设置Everything路径失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

// 获取Everything配置
ipcMain.handle('get-everything-config', async () => {
  const credentials = store.get('everything.credentials', null);
  return {
    port: store.get('everything.port', 80),
    installPath: store.get('everything.installPath', ''),
    hasCredentials: !!credentials,
    username: credentials ? credentials.username : '',
  };
});

app.whenReady().then(() => {
  initOpenAI();
  initEverythingSearch();
  initEverythingManager();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 搜索历史使用electron-store自动管理，无需手动创建目录
