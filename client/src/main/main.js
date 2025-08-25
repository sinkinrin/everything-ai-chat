const { app, BrowserWindow, ipcMain, dialog, shell, Tray, Menu, nativeImage } = require('electron');
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

// 托盘实例
let tray;

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
  
  // 窗口关闭时隐藏到托盘而不是真正关闭
  mainWindow.on('close', (event) => {
    if (tray && !app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
      return false;
    }
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
  
  return mainWindow;
}

// 创建托盘
function createTray() {
  // 创建一个简单的托盘图标
  const icon = nativeImage.createEmpty();
  icon.resize({ width: 16, height: 16 });
  tray = new Tray(icon);
  
  // 创建托盘菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示主窗口',
      type: 'normal',
      click: () => {
        const windows = BrowserWindow.getAllWindows();
        if (windows.length > 0) {
          const mainWindow = windows[0];
          if (mainWindow.isMinimized()) {
            mainWindow.restore();
          }
          mainWindow.show();
          mainWindow.focus();
        } else {
          createWindow();
        }
      }
    },
    {
      label: '设置',
      type: 'normal',
      click: () => {
        // 发送消息到渲染进程打开设置页面
        const windows = BrowserWindow.getAllWindows();
        if (windows.length > 0) {
          const mainWindow = windows[0];
          if (mainWindow.isMinimized()) {
            mainWindow.restore();
          }
          mainWindow.show();
          mainWindow.focus();
          mainWindow.webContents.send('open-settings');
        } else {
          const mainWindow = createWindow();
          mainWindow.once('ready-to-show', () => {
            mainWindow.webContents.send('open-settings');
          });
        }
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      type: 'normal',
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);
  
  // 设置托盘菜单
  tray.setContextMenu(contextMenu);
  
  // 设置托盘提示
  tray.setToolTip('Everything AI Chat');
  
  // 托盘图标双击事件
  tray.on('double-click', () => {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length > 0) {
      const mainWindow = windows[0];
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.show();
      mainWindow.focus();
    } else {
      createWindow();
    }
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
            content: `你是一个专业的Everything搜索语法生成器。请将用户的自然语言查询转换为Everything搜索语法，并以JSON格式返回结果。`
          }, {
            role: 'user',
            content: `
根据everything搜索语法，将以下自然语言转化为合规语法:

【语法定义】
Syntax
Operators

space\tAND
|\tOR
!\tNOT
< >\tGrouping
" "\tSearch for an exact phrase

Wildcards

*\tMatches zero of more characters.
?\tMatches one character.

Wildcards match the whole filename. Disable Match whole filename when using wildcards to match wildcards anywhere in the filename.

Modifiers

Functions and regular search terms can be prefixed with a modifier.


ascii:
utf8:
noascii:\tEnable or disable fast ASCII case comparisons.
case:
nocase:\tMatch or ignore case.
diacritics:
nodiacritics:\tMatch or ignore accent marks.
file:
files:
nofileonly:\tMatch files only.
folder:
folders:
nofolderonly:\tMatch folders only.
path:
nopath:\tMatch the full path and file name or just the filename.
regex:
noregex:\tEnable or disable regex.
wfn:
wholefilename:
nowfn:
nowholefilename:
exact:\tMatch the whole filename or match anywhere in the filename.
wholeword:
ww:
nowholeword:
noww:\tMatch whole words or match anywhere in the filename.
wildcards:
nowildcards:\tEnable or disable wildcards.

Functions

album:<album>\tSearch for the ID3 or FLAC album.
artist:<artist>\tSearch for the ID3 or FLAC artist.
attrib:<attributes>
attributes:<attributes>\tSearch for files and folders with the specified file attributes.
bitdepth:<bitdepth>\tFind images with the specified bits per pixel.
child:<filename>\tSearch for folders that contain a child file or folder with a matching filename.
childcount:<count>\tSearch for folders that contain the specified number of subfolders and files.
childfilecount:<count>\tSearch for folders that contain the specified number of files.
childfoldercount:<count>\tSearch for folders that contain the specified number of subfolders.
comment:<comment>\tSearch for the ID3 or FLAC comment.
content:
ansicontent:
utf8content:
utf16content:
utf16becontent:\tSearch file content.
count:<max>\tLimit the number of results to max.
dateaccessed:<date>
da:<date>\tSearch for files and folders with the specified date accessed.
datecreated:<date>
dc:<date>\tSearch for files and folders with the specified date created.
datemodified:<date>
dm:<date>\tSearch for files and folders with the specified date modified.
daterun:<date>
dr:<date>\tSearch for files and folders with the specified date run.
depth:<count>
parents:<count>\tSearch for files and folders with the specified folder depth.
dimension:<width>x<height>\tFind images with the specified width and height.
dupe:
namepartdupe:
attribdupe:
dadupe:
dcdupe:
dmdupe:
sizedupe:\tSearch for duplicated files.
empty:\tSearch for empty folders.
endwith:<text>\tFilenames (including extension) ending with text.
ext:<list>\tSearch for files with a matching extension in the specified semicolon delimited extension list.
filelist:<list>\tSearch for a list of file names in the specified pipe (|) delimited file list.
filelistfilename:<filename>\tSearch for files and folders belonging to the file list filename.
frn:<frnlist>\tSearch for files and folders with the specified semicolon delimited File Reference Numbers.
fsi:<index>\tSearch for files and folders in the specified zero based internal file system index.
genre:<genre>\tSearch for the ID3 or FLAC genre.
height:<height>\tSearch for images with the specified height in pixels.
len:<length>\tSearch for files and folders that match the specified filename length.
orientation:<type>\tSearch for images with the specified orientation (landscape or portrait).
parent:<path>
infolder:<path>
nosubfolders:<path>\tSearch for files and folders in the specified path, excluding subfolders.
recentchange:<date>
rc:<date>\tSearch for files and folders with the specified recently changed date.
root:\tSearch for files and folders with no parent folder.
runcount:<count>\tSearch for files and folders with the specified run count.
shell:<name>\tSearch for a known shell folder name, including subfolders and files.
size:<size>\tSearch for files with the specified size in bytes.
startwith:<text>\tSearch for filenames starting with text.
title:<title>\tSearch for the ID3 or FLAC title.
type:<type>\tSearch for files and folders with the specified file type.
width:<width>\tSearch for images with the specified width in pixels.

Function syntax

function:value\tEqual to value.
function:<=value\tLess than or equal to value.
function:<value\tLess than value.
function:=value\tEqual to value.
function:>value\tGreater than value.
function:>=value\tGreater than or equal to value.
function:start..end\tIs in the range of values from start to end.
function:start-end\tIs in the range of values from start to end.

Size Syntax:

size[kb|mb|gb]


Size Constants:

empty\t
tiny\t0 KB < size <= 10 KB
small\t10 KB < size <= 100 KB
medium\t100 KB < size <= 1 MB
large\t1 MB < size <= 16 MB
huge\t16 MB < size <= 128 MB
gigantic\tsize > 128 MB
unknown\t

Date Syntax:

year

month/year or year/month depending on locale settings

day/month/year, month/day/year or year/month/day depending on locale settings

YYYY[-MM[-DD[Thh[:mm[:ss[.sss]]]]]]

YYYYMM[DD[Thh[mm[ss[.sss]]]]]


Date Constants:

today

yesterday

<last|past|prev|current|this|coming|next><year|month|week>

<last|past|prev|coming|next><x><years|months|weeks>

<last|past|prev|coming|next><x><hours|minutes|mins|seconds|secs>

january|february|march|april|may|june|july|august|september|october|november|december

jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec

sunday|monday|tuesday|wednesday|thursday|friday|saturday

sun|mon|tue|wed|thu|fri|sat

unknown


Attribute Constants:

A\tArchive
C\tCompressed
D\tDirectory
E\tEncrypted
H\tHidden
I\tNot content indexed
L\tReparse point
N\tNormal
O\tOffline
P\tSparse file
R\tRead only
S\tSystem
T\tTemporary
V\tDevice

Content Searching
Warning: content searching is extremely slow.

File content is not indexed.


Please combine content: functions with other filters for the best performance.


Content search functions:

content:<text>\tSearch file content using the associated iFilter. If no iFilter exists UTF-8 content is used.
ansicontent:<text>\tFile contents are treated as ANSI text.
utf8content:<text>\tFile contents are treated as UTF-8 text.
utf16content:<text>\tFile contents are treated as UTF-16 (Unicode) text.
utf16becontent:<text>\tFile contents are treated as UTF-16 (Big Endian) text.

Example, find emails, modified this week, containing the text "banana":

*.eml dm:thisweek content:banana

* Note: content: is used last in the search above, this means Everything will only search the content of files that matched the previous search *.eml dm:thisweek


ID3 Tags
The following search functions can be used to search for ID3 tags and FLAC tags:

track:<track>\tTrack number or track range.
year:<year>\tTear or year range.
title:<title>\tSong title.
artist:<artist>\tSong Artist.
album:<album>\tAlbum name.
comment:<comment>\tTrack comment.
genre:<genre>\tTrack genre.

ID3v1 is fully supported.

ID3v2, ID3v2.3 and ID3v2.4 are loosely supported.


ID3 tags and FLAC tags are not indexed. Searching for ID3 tags and FLAC tags is slow, combine with other searches for the best performance.

Only ID3 tags in mp3 files are currently supported.


Examples:

year:2002..2005
genre:electronic
regex:album:^[a-n]
wildcards:title:red*
track:>10
year:>=2000

Image information
The following functions can be used to search for image dimensions

width:<width>\tThe width of the image in pixels.
height:<height>\tThe height of the image in pixels.
dimensions:<width>x<height>\tThe width and height of the image in pixels. Use a x to separate the width and height.
orientation:<type>\t<type> can landscape or portrait.
bitdepth:<bitdepth>\tFind images with the specified bits per pixel.

Image information is not indexed. Searching for image information is slow, combine with other searches for the best performance.

Only jpg, png, gif and bmp files are supported.


Examples:

width:>2560
width:800..1920
height:600..1080
dimensions:800x600..1920x1080

Duplicated Files
The following functions can be used to search for duplicated files.

dupe:\tFind files and folders with the same filename.
attribdupe:\tFind files and folders with the same attributes. Sort by attributes for the best results.
dadupe:\tFind files and folders with the same date accessed. Sort by date accessed for the best results.
dcdupe:\tFind files and folders with the same date created. Sort by date created for the best results.
dmdupe:\tFind files and folders with the same date modified. Sort by date modified for the best results.
namepartdupe:\tFind files and folders with the same name part (excluding extension).
sizedupe:\tFind files and folders with the same size. Sort by size for the best results.

Duplicates are found in the ENTIRE index, not the current results.

Search and sort results by the same dupe type for the best results.


Everything does not check file contents. Use the dupe finding functions as a guide only.


Examples:

dupe: .mp4
size:>1gb sizedupe:

Filters
Filters are predefined searches. Only one filter can be active at a time. Filters can be toggled from the Search menu.


To create a new filter:

In Everything, from the Search menu, click Add to filters....

Type in a Name.

Click OK.


To edit an existing filter:

In Everything, from the Search menu, click Organize filters....

Select a filter.

Click Edit.


To create a search macro:

In Everything, from the Search menu, click Organize filters....

Select a filter.

Click Edit.

Set macro to your search shortcut, for example: photos

The photos: search will now be replaced with this filter's search.

Click OK.

Click OK.


To create a filter keyboard shortcut:

In Everything, from the Search menu, click Organize filters....

Select a filter.

Click Edit.

Click to the right of Keyboard shortcut and press a new keyboard shortcut.

Click OK.

Click OK.


Filters can be accessed from the Search menu, filter bar (View -> Filters), right clicking the status bar, filter macro or filter keyboard shortcut.


Bookmarks
Bookmarks can save the current search, filter, sort and index.


To create a new bookmark from the current search:

In Everything, from the Bookmarks menu, click Add to bookmarks....

Type in a Name.

Click OK.


To organize bookmarks:

In Everything, from the Bookmarks menu, click Organize bookmarks....


Home Search
The home search is the default search when you first open an Everything search window.

The home search can be opened by pressing Alt + Home.


To change the home search settings:

In Everything, from the Tools menu, click Options.

Click the '''Home''' tab.

Set the desired search, search options, sort order and view options.

Click OK.


Macros
Custom macros can be defined by filters and bookmarks.


To create a custom filter macro:

Create a new filter or edit an existing one.

Type in a macro name, for example:

foo
Click OK.

Click OK.

Searching for foo: will now be replaced by the filter's search.


Regex
Regex overrides the search syntax. Search operators, wildcards, macros, modifiers and functions do not work in regex mode.

Regex must be enabled from the Search menu or prefix the search with regex:

When using the regex: modifier, please escape | and space with double quotes.


a|b\tMatches a or b
gr(a|e)y\tMatches gray or grey
.\tMatches any single character
[abc]\tMatches a single character a, b or c
[^abc]\tMatches any single character except a, b or c
[a-z]\tMatches a single character in the range a to z
[a-zA-Z]\tMatches a single character in the range a to z or A to Z
^\tMatches the start of the filename
$\tMatches the end of the filename
*\tMatches the preceding element zero or more times
?\tMatches the preceding element zero or one times
+\tMatches the preceding element one or more times
{x}\tMatches the preceding element x times
{x,}\tMatches the preceding element x or more times
{x,y}\tMatches the preceding element between x and y times
\\\tEscape special character

Search Commands
The following search commands are special searches that can be activated by typing in the search and pressing ENTER.


Search\tAction
about:\tShow the About dialog.
about:config\tOpen your Everything.ini
about:credits\tShow the Everything credits dialog.
about:home\tOpen the home search.
about:licence
about:license\tShow the Everything licence agreement.
about:options
about:preferences\tShow the Everything options.
/close\tClose the Everything search window.
/closeall\tClose all Everything search windows.
/command <id>\tRun the specified command ID.
/config_save\tShow a save as dialog to backup the Everything.ini.
/config_save <filename>\tBackup the Everything.ini to the specified filename.
/config_load\tShow a open file dialog to load the Everything.ini.
/config_load <filename>\tLoad the Everything.ini from the specified filename.
/debug
/console\tEnable debug mode.
/debug_log\tEnable debug mode and start debug logging.
/help\tShow the help window.
/monitor_pause\tStops NTFS, ReFS, file lists and folder monitors. Monitors are not started again until specified with /monitor_resume.
/monitor_resume\tStarts NTFS, ReFS, file lists and folder monitors.
/quit
/exit\tExit Everything
/rebuild
/reindex\tForce a rebuild
/restart\tRestart Everything
/verbose\tEnable verbose debugging.
/update\tUpdate all folder indexes now.
/update <folder index>\tUpdate the specifed folder index by path now.
/<ini option>\tShow the current setting for the specified ini option in the statusbar. Use the TAB key to auto complete.
/<ini option>=<value>\tSet the specified ini option to the specified value. The new value is shown in the status bar if successful.

For example, to change the status bar selected item format to full path and filename, type in the following search and press ENTER:

/statusbar_selected_item_format=$f

Changing some ini options will require a restart.


Limiting results
To limit the number of results shown, use the count: search function.

For example to limit the number of results shown to 100, include at the start of your search:

count:100


【参考案例】
Search for ABC and 123:

ABC 123

Search for ABC or 123:

ABC|123

Search for everything except ABC:

!ABC

Search for uppercase ABC

case:ABC

Search for mp3 files:

*.mp3

Search for mp3 files on the D: or E: drive:

d:|e: *.mp3

Search for jpg or png files on the D: drive:

d: *.jpg|*.png

Search for files or folders with no extension:

!.

Search for files only:

file:

Search for folders only:

folder:

Limit the search to a single folder:

parent:c:\\windows
or:

parent:"c:\\program files"

Find files larger than 1MB:

size:>1mb

Find files between 2MB and 10MB:

size:>2mb..10mb

Instantly find files that have changed today:

dm:today

Find files and folders modified this week:

dm:thisweek

Find files and folders modified from the 1st August 2014 to 31st August 2014:

dm:1/8/2014..31/8/2014
or:

dm:8/1/2014..8/31/2014
Depending on your locale settings.


Find folders in D:\\music that do not contain an mp3 file:

d:\\music\\ !child:mp3

Find filenames with non-ASCII characters:

regex:[^\x00-\x7f]

Find filenames with no characters in the range a-z

!regex:[a-z]

【用户搜索需求】
${query}

【输出格式要求】
请严格按照以下JSON格式返回，不要包含任何其他文本：
{
  "confidence": 0.95,
  "original_query": "用户的原始查询",
  "rules_used": ["使用的语法规则列表"],
  "alternatives": ["可选的替代查询1", "可选的替代查询2"],
  "query": "合规搜索语法"
}
            `
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
  createTray();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // 如果有托盘，不退出应用，保持在后台运行
  if (process.platform !== 'darwin' && !tray) {
    app.quit();
  }
});

// 搜索历史使用electron-store自动管理，无需手动创建目录
