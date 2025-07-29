const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');
const Store = require('electron-store');
const OpenAI = require('openai');
const EverythingSearch = require('./everything-search');

// 初始化配置存储
const store = new Store();

// 创建数据库连接
let db;

// OpenAI实例
let openai;

// Everything搜索实例
let everythingSearch;

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
    titleBarStyle: 'default',
    frame: true,
    show: false
  });

  // 开发环境加载Vue开发服务器，生产环境加载构建文件
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist-vue/index.html'));
  }

  // 窗口准备好后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

// 初始化数据库
function initDatabase() {
  const dbPath = path.join(__dirname, '../database/search_history.db');
  db = new Database(dbPath);
  
  // 创建搜索历史表
  db.exec(`
    CREATE TABLE IF NOT EXISTS search_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT NOT NULL,
      everything_query TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // 创建搜索结果缓存表
  db.exec(`
    CREATE TABLE IF NOT EXISTS search_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query_hash TEXT UNIQUE,
      results TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

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
            content: `你是一个专业的Everything搜索语法生成器。请将用户的自然语言查询转换为Everything搜索语法。

Everything搜索语法规则：
- 文件扩展名：*.txt, *.pdf, *.docx 等
- 文件大小：size:>1MB, size:<500KB
- 修改时间：dm:today, dm:yesterday, dm:thisweek
- 创建时间：dc:today, dc:yesterday  
- 路径匹配：path:folder, !path:temp
- 文件名匹配：支持通配符 * 和 ?
- 逻辑操作：AND, OR, NOT 或 & | !
- 正则表达式：regex:pattern

只返回转换后的Everything查询语句，不要其他解释。`
          }, {
            role: 'user',
            content: query
          }],
          max_tokens: 100,
          temperature: 0.1
        });
        
        everythingQuery = aiResponse.choices[0].message.content.trim();
      } catch (error) {
        console.error('OpenAI转换失败:', error);
        // 如果OpenAI失败，使用本地优化规则
        everythingQuery = everythingSearch.optimizeQuery(query);
      }
    } else {
      // 如果没有OpenAI配置，使用本地优化规则
      everythingQuery = everythingSearch.optimizeQuery(query);
    }
    
    // 执行Everything搜索
    const searchResult = await everythingSearch.search(everythingQuery, {
      path: true,
      size: true,
      date_modified: true,
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
  everythingSearch = new EverythingSearch('localhost', 80);
}

// 保存搜索历史
function saveSearchHistory(query, everythingQuery) {
  try {
    const stmt = db.prepare('INSERT INTO search_history (query, everything_query) VALUES (?, ?)');
    stmt.run(query, everythingQuery);
  } catch (error) {
    console.error('保存搜索历史失败:', error);
  }
}

// 获取搜索历史
ipcMain.handle('get-search-history', async () => {
  try {
    const stmt = db.prepare('SELECT * FROM search_history ORDER BY created_at DESC LIMIT 20');
    return stmt.all();
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

app.whenReady().then(() => {
  initDatabase();
  initOpenAI();
  initEverythingSearch();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (db) {
      db.close();
    }
    app.quit();
  }
});

// 确保数据库目录存在
const fs = require('fs');
const dbDir = path.join(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
} 