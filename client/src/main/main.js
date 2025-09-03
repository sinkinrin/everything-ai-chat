const { app, BrowserWindow, ipcMain, dialog, shell, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const Store = require('electron-store');
const OpenAI = require('openai');
const EverythingSearch = require('./everything-search');
const EverythingManager = require('./everything-manager');
const axios = require('axios');

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

// 调试窗口实例
let debugWindow;

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

  // 存储主窗口的引用
  global.mainWindow = mainWindow;

  // 窗口关闭时隐藏到托盘而不是真正关闭
  mainWindow.on('close', (event) => {
    if (tray && !app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
      // 同时隐藏调试窗口
      if (debugWindow && !debugWindow.isDestroyed()) {
        debugWindow.hide();
      }
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

// 创建调试窗口
function createDebugWindow() {
  // 如果调试窗口已存在，则显示它
  if (debugWindow && !debugWindow.isDestroyed()) {
    debugWindow.show();
    debugWindow.focus();
    return debugWindow;
  }

  const mainWindow = global.mainWindow;
  let debugWindowX = 100;
  let debugWindowY = 100;
  let moveTimeout = null; // 移动到函数作用域

  // 如果主窗口存在，将调试窗口定位在主窗口右侧
  if (mainWindow && !mainWindow.isDestroyed()) {
    const [mainX, mainY] = mainWindow.getPosition();
    const [mainWidth, mainHeight] = mainWindow.getSize();
    debugWindowX = mainX + mainWidth + 10; // 主窗口右侧留10px间距
    debugWindowY = mainY;
  }

  debugWindow = new BrowserWindow({
    width: 450,
    height: 700,
    minWidth: 350,
    minHeight: 500,
    maxWidth: 600,
    maxHeight: 900,
    x: debugWindowX,
    y: debugWindowY,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hidden',
    frame: false,
    show: false,
    resizable: true,
    alwaysOnTop: false,
    skipTaskbar: true, // 不在任务栏显示
    type: 'toolbar' // 设置为工具窗口类型
  });

  // 开发环境加载Vue开发服务器，生产环境加载构建文件
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  if (isDev) {
    // 等待Vue开发服务器启动
    const loadDevServer = async () => {
      try {
        await debugWindow.loadURL('http://127.0.0.1:5173/debug.html');
        // 开发环境下可以打开DevTools
        // debugWindow.webContents.openDevTools();
      } catch (error) {
        console.log('等待Vue开发服务器启动...');
        setTimeout(loadDevServer, 1000);
      }
    };
    loadDevServer();
  } else {
    // 生产环境加载调试窗口的HTML文件
    debugWindow.loadFile(path.join(__dirname, '../../dist-vue/debug.html'));
  }

  // 窗口准备好后显示
  debugWindow.once('ready-to-show', () => {
    debugWindow.show();
  });

  // 窗口关闭时清理引用和事件监听器
  debugWindow.on('closed', () => {
    // 清理定时器
    if (moveTimeout) {
      clearTimeout(moveTimeout);
      moveTimeout = null;
    }
    
    // 清理主窗口的事件监听器（如果主窗口还存在）
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.removeAllListeners('move');
      mainWindow.removeAllListeners('resize');
    }
    
    debugWindow = null;
  });

  // 监听主窗口移动，同步调试窗口位置
  if (mainWindow && !mainWindow.isDestroyed()) {
    const syncDebugWindowPosition = () => {
      // 使用防抖避免频繁调用
      if (moveTimeout) {
        clearTimeout(moveTimeout);
      }
      moveTimeout = setTimeout(() => {
        if (debugWindow && !debugWindow.isDestroyed() && mainWindow && !mainWindow.isDestroyed()) {
          const [mainX, mainY] = mainWindow.getPosition();
          const [mainWidth] = mainWindow.getSize();
          const newX = mainX + mainWidth + 10;
          const newY = mainY;
          
          // 只在位置真的发生变化时才移动
          const [currentX, currentY] = debugWindow.getPosition();
          if (Math.abs(currentX - newX) > 5 || Math.abs(currentY - newY) > 5) {
            debugWindow.setPosition(newX, newY);
          }
        }
      }, 50); // 50ms防抖
    };

    // 清理可能存在的旧事件监听器
    mainWindow.removeAllListeners('move');
    mainWindow.on('move', syncDebugWindowPosition);
    
    // 监听主窗口大小变化，也需要同步调试窗口位置
    mainWindow.removeAllListeners('resize');
    mainWindow.on('resize', syncDebugWindowPosition);
  }

  return debugWindow;
}

// 创建托盘
function createTray() {
  // 创建托盘图标，使用应用程序logo
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  let iconPath;

  if (isDev) {
    // 开发环境：从源码目录加载图标
    iconPath = path.join(__dirname, '../asserts/logo.png');
  } else {
    // 生产环境：从资源目录加载图标
    iconPath = path.join(process.resourcesPath, 'app.asar', 'src', 'asserts', 'logo.png');
  }

  // 创建图标，如果文件不存在则使用默认图标
  let icon;
  try {
    icon = nativeImage.createFromPath(iconPath);
    // 调整托盘图标尺寸（Windows推荐16x16）
    if (!icon.isEmpty()) {
      icon = icon.resize({ width: 16, height: 16 });
    }
  } catch (error) {
    console.warn('无法加载托盘图标:', error.message);
    // 使用默认图标作为后备方案
    icon = nativeImage.createEmpty();
    icon.addRepresentation({
      scaleFactor: 1.0,
      width: 16,
      height: 16,
      buffer: Buffer.alloc(16 * 16 * 4, 0x80) // 创建一个灰色的16x16图标
    });
  }

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
          // 同时显示调试窗口（如果之前是打开的）
          if (debugWindow && !debugWindow.isDestroyed()) {
            debugWindow.show();
          }
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
      // 同时显示调试窗口（如果之前是打开的）
      if (debugWindow && !debugWindow.isDestroyed()) {
        debugWindow.show();
      }
    } else {
      createWindow();
    }
  });
}

// 初始化搜索历史存储（使用electron-store，无需单独初始化）

// 自动更新相关功能
class AutoUpdater {
  constructor() {
    this.currentVersion = this.getCurrentVersion();
    this.githubRepo = 'MaskerPRC/everything-ai-chat'; // 请替换为实际的GitHub仓库
  }

  // 获取当前版本
  getCurrentVersion() {
    const packageJson = require('../../package.json');
    return packageJson.version;
  }

  // 比较版本号
  compareVersions(version1, version2) {
    const v1parts = version1.split('.').map(Number);
    const v2parts = version2.split('.').map(Number);

    // 确保版本号长度相同
    const maxLength = Math.max(v1parts.length, v2parts.length);
    while (v1parts.length < maxLength) v1parts.push(0);
    while (v2parts.length < maxLength) v2parts.push(0);

    for (let i = 0; i < maxLength; i++) {
      if (v1parts[i] > v2parts[i]) return 1;
      if (v1parts[i] < v2parts[i]) return -1;
    }
    return 0;
  }

  // 检查GitHub releases
  async checkForUpdates() {
    try {
      console.log(`检查更新 - 当前版本: ${this.currentVersion}`);

      const response = await axios.get(
        `https://api.github.com/repos/${this.githubRepo}/releases/latest`,
        {
          timeout: 10000, // 10秒超时
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Everything-AI-Chat-App'
          }
        }
      );

      const latestRelease = response.data;
      const latestVersion = latestRelease.tag_name.replace(/^v/, ''); // 移除可能的v前缀

      console.log(`最新版本: ${latestVersion}`);

      // 比较版本
      const comparison = this.compareVersions(latestVersion, this.currentVersion);

      if (comparison > 0) {
        // 发现新版本
        console.log('发现新版本:', latestVersion);

        const updateInfo = {
          hasUpdate: true,
          currentVersion: this.currentVersion,
          latestVersion: latestVersion,
          releaseNotes: latestRelease.body || '',
          downloadUrl: latestRelease.html_url,
          publishedAt: latestRelease.published_at,
          assets: latestRelease.assets || []
        };

        // 发送更新通知到所有窗口
        const allWindows = BrowserWindow.getAllWindows();
        console.log(`发送更新通知到 ${allWindows.length} 个窗口`);
        allWindows.forEach((window, index) => {
          console.log(`发送更新通知到窗口 ${index + 1}`);
          window.webContents.send('update-available', updateInfo);
        });

        return updateInfo;
      } else {
        console.log('当前已是最新版本');
        return {
          hasUpdate: false,
          currentVersion: this.currentVersion,
          latestVersion: latestVersion
        };
      }
    } catch (error) {
      console.error('检查更新失败:', error.message);

      // 如果是网络错误，静默处理
      if (error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        console.log('网络连接问题，跳过此次更新检查');
        return { hasUpdate: false, error: 'network_error' };
      }

      return { hasUpdate: false, error: error.message };
    }
  }

  // 启动时检查更新
  async checkOnStartup() {
    // 延迟5秒后检查，确保渲染进程完全加载
    setTimeout(async () => {
      console.log('开始启动时更新检查...');
      const allWindows = BrowserWindow.getAllWindows();
      console.log('当前窗口数量:', allWindows.length);

      if (allWindows.length === 0) {
        console.log('没有可用的窗口，延迟2秒后重试...');
        setTimeout(() => this.checkOnStartup(), 2000);
        return;
      }

      // 确保窗口内容已经加载完成
      const mainWindow = allWindows[0];
      if (!mainWindow.webContents.isLoading()) {
        console.log('窗口内容已加载，开始检查更新');
        await this.checkForUpdates();
      } else {
        console.log('窗口内容仍在加载中，等待加载完成...');
        mainWindow.webContents.once('did-finish-load', async () => {
          console.log('窗口加载完成，开始检查更新');
          await this.checkForUpdates();
        });
      }
    }, 5000);
  }
}

// 创建自动更新实例
const autoUpdater = new AutoUpdater();

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
ipcMain.handle('search-files', async (event, query, enableStreamDebug = false) => {
  try {
    // 先尝试将自然语言转换为Everything查询语法
    let everythingQuery = query;

    if (openai && query.length > 3) {
      try {
        const aiMessages = [{
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
        }];

        let responseContent = '';

        if (enableStreamDebug) {
          // 流式调用模式 - 用于调试
          const debugData = {
            type: 'info',
            content: '🚀 开始AI转换自然语言查询...'
          };
          event.sender.send('ai-debug-stream', debugData);
          // 同时发送到调试窗口
          if (debugWindow && !debugWindow.isDestroyed()) {
            debugWindow.webContents.send('ai-debug-stream', debugData);
          }

          const aiResponse = await openai.chat.completions.create({
            model: store.get('openai.model', 'gpt-3.5-turbo'),
            messages: aiMessages,
            max_tokens: 200,
            temperature: 0.7,
            stream: true,
            response_format: { type: "json_object" }
          });

          // 处理流式响应
          let fullResponse = '';
          for await (const chunk of aiResponse) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              fullResponse += content;
              // 发送流式调试消息
              const debugData = {
                type: 'stream',
                content: content
              };
              event.sender.send('ai-debug-stream', debugData);
              // 同时发送到调试窗口
              if (debugWindow && !debugWindow.isDestroyed()) {
                debugWindow.webContents.send('ai-debug-stream', debugData);
              }
            }
          }

          // 发送完整响应结果
          const debugData2 = {
            result: fullResponse
          };
          event.sender.send('ai-debug-result', debugData2);
          // 同时发送到调试窗口
          if (debugWindow && !debugWindow.isDestroyed()) {
            debugWindow.webContents.send('ai-debug-result', debugData2);
          }

          responseContent = fullResponse.trim();
        } else {
          // 非流式调用模式 - 正常使用
          const aiResponse = await openai.chat.completions.create({
            model: store.get('openai.model', 'gpt-3.5-turbo'),
            messages: aiMessages,
            max_tokens: 200,
            temperature: 0.7,
            response_format: { type: "json_object" }
          });

          responseContent = aiResponse.choices[0].message.content.trim();
        }

        // 清理响应内容，去除可能的markdown代码块标识符
        const cleanResponseContent = (content) => {
          // 去除可能的markdown代码块标识符
          let cleaned = content.trim();
          
          // 移除开头的 "json" 或 "```json" 标识符
          if (cleaned.startsWith('json')) {
            cleaned = cleaned.substring(4).trim();
          } else if (cleaned.startsWith('```json')) {
            cleaned = cleaned.substring(7).trim();
          } else if (cleaned.startsWith('```')) {
            cleaned = cleaned.substring(3).trim();
          }
          
          // 移除结尾的 "```"
          if (cleaned.endsWith('```')) {
            cleaned = cleaned.substring(0, cleaned.length - 3).trim();
          }
          
          return cleaned;
        };

        const cleanedResponseContent = cleanResponseContent(responseContent);
        console.log('清理前响应:', responseContent);
        console.log('清理后响应:', cleanedResponseContent);

        // 解析JSON响应
        try {
          const parsedResponse = JSON.parse(cleanedResponseContent);

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
          console.error('清理后响应:', cleanedResponseContent);

          if (enableStreamDebug) {
            const debugData = {
              type: 'info',
              content: `JSON解析失败: ${parseError.message}`
            };
            event.sender.send('ai-debug-stream', debugData);
            // 同时发送到调试窗口
            if (debugWindow && !debugWindow.isDestroyed()) {
              debugWindow.webContents.send('ai-debug-stream', debugData);
            }
          }

          // 回退到简单文本提取
          const fallbackMatch = cleanedResponseContent.match(/"query"\s*:\s*"([^"]+)"/);
          if (fallbackMatch) {
            everythingQuery = fallbackMatch[1].trim();
            console.log('使用回退方案提取查询:', everythingQuery);

            if (enableStreamDebug) {
              const debugData = {
                type: 'info',
                content: `🔧 回退方案成功提取查询: ${everythingQuery}`
              };
              event.sender.send('ai-debug-stream', debugData);
              // 同时发送到调试窗口
              if (debugWindow && !debugWindow.isDestroyed()) {
                debugWindow.webContents.send('ai-debug-stream', debugData);
              }
            }
          } else {
            if (enableStreamDebug) {
              const debugData = {
                error: '无法从AI响应中提取查询语句，将使用原始查询'
              };
              event.sender.send('ai-debug-error', debugData);
              // 同时发送到调试窗口
              if (debugWindow && !debugWindow.isDestroyed()) {
                debugWindow.webContents.send('ai-debug-error', debugData);
              }
            }
            throw new Error('无法从AI响应中提取查询语句');
          }
        }
      } catch (error) {
        console.error('OpenAI转换失败:', error);

        if (enableStreamDebug) {
          const debugData = {
            error: `AI转换失败: ${error.message}，使用本地优化`
          };
          event.sender.send('ai-debug-error', debugData);
          // 同时发送到调试窗口
          if (debugWindow && !debugWindow.isDestroyed()) {
            debugWindow.webContents.send('ai-debug-error', debugData);
          }
        }

        // 如果OpenAI失败，使用本地优化规则
        everythingQuery = everythingSearch.optimizeQuery(query);
      }
    } else {
      // 如果没有OpenAI配置，使用本地优化规则
      everythingQuery = everythingSearch.optimizeQuery(query);
    }

    // 执行Everything搜索 - 新的API已经默认包含所有必要信息
    if (enableStreamDebug) {
      const debugData = {
        type: 'info',
        content: `🔍 执行Everything搜索: ${everythingQuery}`
      };
      event.sender.send('ai-debug-stream', debugData);
      // 同时发送到调试窗口
      if (debugWindow && !debugWindow.isDestroyed()) {
        debugWindow.webContents.send('ai-debug-stream', debugData);
      }
    }

    const searchResult = await everythingSearch.search(everythingQuery, {
      count: 1000
    });

    if (!searchResult.success) {
              if (enableStreamDebug) {
          const debugData = {
            error: `Everything搜索失败: ${searchResult.error || '未知错误'}`
          };
          event.sender.send('ai-debug-error', debugData);
          // 同时发送到调试窗口
          if (debugWindow && !debugWindow.isDestroyed()) {
            debugWindow.webContents.send('ai-debug-error', debugData);
          }
        }
      throw new Error(searchResult.error || 'Everything搜索失败');
    }

    if (enableStreamDebug) {
      const debugData = {
        type: 'info',
        content: `✅ 搜索完成，找到 ${searchResult.results?.length || 0} 个结果`
      };
      event.sender.send('ai-debug-stream', debugData);
      // 同时发送到调试窗口
      if (debugWindow && !debugWindow.isDestroyed()) {
        debugWindow.webContents.send('ai-debug-stream', debugData);
      }
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

    if (enableStreamDebug) {
      const debugData = {
        error: `搜索过程出现错误: ${error.message}`
      };
      event.sender.send('ai-debug-error', debugData);
      // 同时发送到调试窗口
      if (debugWindow && !debugWindow.isDestroyed()) {
        debugWindow.webContents.send('ai-debug-error', debugData);
      }
    }

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
    
    // 通知所有窗口配置已更新
    const allWindows = BrowserWindow.getAllWindows();
    allWindows.forEach(window => {
      window.webContents.send('config-updated', { type: 'openai', config });
    });
    
    // 如果调试功能被关闭，关闭调试窗口
    if (!config.enableStreamDebug && debugWindow && !debugWindow.isDestroyed()) {
      debugWindow.close();
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// 获取OpenAI配置
ipcMain.handle('get-openai-config', async () => {
  return store.get('openai', {});
});

// 测试OpenAI连接
ipcMain.handle('test-openai-connection', async (event, config) => {
  try {
    // 参数验证
    if (!config || typeof config !== 'object') {
      return { success: false, error: '无效的配置参数' };
    }

    // 使用传入的配置创建临时OpenAI实例进行测试
    // 对于本地部署，API Key可以为空或任意值
    const testOpenAI = new OpenAI({
      apiKey: config.apiKey || 'local-api-key', // 本地部署时使用默认值
      baseURL: config.baseURL || 'https://api.openai.com/v1',
      timeout: 30000 // 30秒超时
    });

    // 发送一个简单的测试请求
    const response = await testOpenAI.chat.completions.create({
      model: config.model || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 1
    });

    return {
      success: true,
      message: '连接成功',
      model: response.model
    };
  } catch (error) {
    // 过滤敏感错误信息
    let errorMessage = error.message;
    if (error.status === 401) {
      errorMessage = 'API Key无效或已过期';
    } else if (error.status === 429) {
      errorMessage = 'API调用频率超限，请稍后重试';
    } else if (error.status === 500) {
      errorMessage = 'OpenAI服务暂时不可用';
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      errorMessage = '网络连接失败，请检查网络设置';
    } else if (error.message.includes('timeout')) {
      errorMessage = '请求超时，请检查网络连接';
    }

    return {
      success: false,
      error: errorMessage
    };
  }
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

    // 获取端口配置
    const portConfig = store.get('everything.portConfig', { portMode: 'auto' });
    const result = await everythingManager.autoConnect(portConfig);

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

      // 确保凭据信息被传递回前端
      return {
        ...result,
        credentials: result.credentials // 显式返回凭据信息
      };
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
  const portConfig = store.get('everything.portConfig', { portMode: 'auto' });
  return {
    port: store.get('everything.port', 80),
    installPath: store.get('everything.installPath', ''),
    hasCredentials: !!credentials,
    username: credentials ? credentials.username : '',
    portMode: portConfig.portMode || 'auto',
    fixedPort: portConfig.fixedPort || 8080,
  };
});

// 设置Everything端口配置
ipcMain.handle('set-everything-port-config', async (event, config) => {
  try {
    console.log('保存端口配置:', config);

    // 验证配置
    if (!config || !config.portMode) {
      return { success: false, error: '端口配置无效' };
    }

    if (config.portMode === 'fixed') {
      const fixedPort = config.fixedPort;
      if (!fixedPort || fixedPort < 1 || fixedPort > 65535) {
        return { success: false, error: '固定端口号无效，必须在1-65535之间' };
      }
    }

    // 保存端口配置
    store.set('everything.portConfig', {
      portMode: config.portMode,
      fixedPort: config.fixedPort || null
    });

    console.log('端口配置已保存:', store.get('everything.portConfig'));

    return { success: true };
  } catch (error) {
    console.error('保存端口配置失败:', error);
    return { success: false, error: error.message };
  }
});

// 导出搜索结果
ipcMain.handle('export-results', async (event, results) => {
  try {
    if (!results || results.length === 0) {
      return { success: false, error: '没有可导出的结果' };
    }

    const { dialog } = require('electron');
    const fs = require('fs');
    const path = require('path');

    // 显示保存对话框
    const saveResult = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
      title: '导出搜索结果',
      defaultPath: `搜索结果_${new Date().toISOString().slice(0, 10)}.csv`,
      filters: [
        { name: 'CSV文件', extensions: ['csv'] },
        { name: 'JSON文件', extensions: ['json'] },
        { name: '文本文件', extensions: ['txt'] }
      ]
    });

    if (saveResult.canceled) {
      return { success: false, error: '用户取消导出' };
    }

    const filePath = saveResult.filePath;
    const ext = path.extname(filePath).toLowerCase();

    let content;
    if (ext === '.json') {
      // JSON格式导出
      content = JSON.stringify(results, null, 2);
    } else if (ext === '.txt') {
      // 纯文本格式导出
      content = results.map(file => `${file.name || ''}\t${file.path || ''}\t${file.size || ''}\t${file.modified || ''}`).join('\n');
    } else {
      // CSV格式导出 (默认)
      const csvHeader = 'Name,Path,Size,Modified,Created,Type\n';
      const csvRows = results.map(file => {
        // 确保CSV字段中的引号和逗号被正确处理
        const escapeCSV = (value) => {
          if (!value) return '';
          const str = String(value);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        };

        return [
          escapeCSV(file.name || ''),
          escapeCSV(file.path || ''),
          escapeCSV(file.size || ''),
          escapeCSV(file.modified || ''),
          escapeCSV(file.created || ''),
          escapeCSV(file.extension || '')
        ].join(',');
      }).join('\n');

      content = csvHeader + csvRows;
    }

    // 写入文件
    fs.writeFileSync(filePath, content, 'utf8');

    return {
      success: true,
      filePath: filePath,
      count: results.length,
      message: `成功导出 ${results.length} 个文件信息到: ${filePath}`
    };

  } catch (error) {
    console.error('导出结果失败:', error);
    return {
      success: false,
      error: `导出失败: ${error.message}`
    };
  }
});

// 显示文件右键菜单
ipcMain.handle('show-file-context-menu', async (event, filePath) => {
  try {
    const { Menu, shell, dialog } = require('electron');
    const path = require('path');
    const fs = require('fs');

    // 检查文件是否存在
    const fileExists = fs.existsSync(filePath);
    const isFile = fileExists ? fs.statSync(filePath).isFile() : true;
    const isDirectory = fileExists ? fs.statSync(filePath).isDirectory() : false;

    // 获取文件扩展名和类型
    const fileExt = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);

    // 文件类型判断
    const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.ico', '.tiff'].includes(fileExt);
    const isAudio = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a', '.wma'].includes(fileExt);
    const isVideo = ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v'].includes(fileExt);
    const isDocument = ['.doc', '.docx', '.pdf', '.txt', '.rtf', '.odt'].includes(fileExt);
    const isSpreadsheet = ['.xls', '.xlsx', '.csv', '.ods'].includes(fileExt);
    const isArchive = ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'].includes(fileExt);
    const isExecutable = ['.exe', '.msi', '.bat', '.cmd', '.com'].includes(fileExt);
    const isCode = ['.js', '.ts', '.html', '.css', '.py', '.java', '.cpp', '.c', '.php', '.go', '.rs', '.vue', '.jsx', '.tsx'].includes(fileExt);

    const menuTemplate = [
      {
        label: '打开',
        click: async () => {
          try {
            await shell.openPath(filePath);
          } catch (error) {
            console.error('打开文件失败:', error);
          }
        },
        enabled: fileExists
      },
      {
        label: '用其他应用打开...',
        click: async () => {
          try {
            // 显示文件选择对话框
            const result = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
              title: '选择应用程序',
              properties: ['openFile'],
              filters: [
                { name: '可执行文件', extensions: ['exe'] },
                { name: '所有文件', extensions: ['*'] }
              ]
            });

            if (!result.canceled && result.filePaths[0]) {
              const { spawn } = require('child_process');
              spawn(result.filePaths[0], [filePath], { detached: true });
            }
          } catch (error) {
            console.error('用其他应用打开失败:', error);
          }
        },
        enabled: fileExists && isFile
      },
      // 图片特定功能
      ...(isImage ? [{
        label: '设置为桌面壁纸',
        click: async () => {
          try {
            // Windows 设置壁纸的方法
            if (process.platform === 'win32') {
              const { spawn } = require('child_process');
              spawn('reg', ['add', 'HKCU\\Control Panel\\Desktop', '/v', 'Wallpaper', '/t', 'REG_SZ', '/d', filePath, '/f'], { shell: true });
              spawn('RUNDLL32.EXE', ['user32.dll,UpdatePerUserSystemParameters'], { shell: true });

              await dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                type: 'info',
                title: '设置壁纸',
                message: '桌面壁纸已设置',
                buttons: ['确定']
              });
            } else {
              await dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                type: 'info',
                title: '设置壁纸',
                message: '此功能仅在Windows系统上可用',
                buttons: ['确定']
              });
            }
          } catch (error) {
            console.error('设置壁纸失败:', error);
          }
        },
        enabled: fileExists && process.platform === 'win32'
      }, {
        label: '图片信息',
        click: async () => {
          try {
            const stats = fs.statSync(filePath);
            await dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
              type: 'info',
              title: '图片信息',
              message: fileName,
              detail: `格式: ${fileExt.toUpperCase()}\n大小: ${(stats.size / 1024).toFixed(2)} KB\n修改时间: ${stats.mtime.toLocaleString('zh-CN')}`,
              buttons: ['确定']
            });
          } catch (error) {
            console.error('获取图片信息失败:', error);
          }
        },
        enabled: fileExists
      }] : []),
      // 音频文件特定功能
      ...(isAudio ? [{
        label: '播放',
        click: async () => {
          try {
            await shell.openPath(filePath);
          } catch (error) {
            console.error('播放音频失败:', error);
          }
        },
        enabled: fileExists
      }] : []),
      // 视频文件特定功能
      ...(isVideo ? [{
        label: '播放视频',
        click: async () => {
          try {
            await shell.openPath(filePath);
          } catch (error) {
            console.error('播放视频失败:', error);
          }
        },
        enabled: fileExists
      }] : []),
      // 文档特定功能
      ...(isDocument ? [{
        label: '打印文档',
        click: async () => {
          try {
            await dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
              type: 'info',
              title: '打印文档',
              message: '请使用文档编辑器的打印功能',
              detail: '建议先打开文档，然后使用编辑器内的打印功能以获得最佳效果。',
              buttons: ['确定']
            });
          } catch (error) {
            console.error('打印文档失败:', error);
          }
        },
        enabled: fileExists
      }] : []),
      // 压缩文件特定功能
      ...(isArchive ? [{
        label: '解压缩到当前文件夹',
        click: async () => {
          try {
            await dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
              type: 'info',
              title: '解压缩',
              message: '解压缩功能暂未实现',
              detail: '请使用系统自带的解压工具或第三方解压软件。',
              buttons: ['确定']
            });
          } catch (error) {
            console.error('解压缩失败:', error);
          }
        },
        enabled: fileExists
      }, {
        label: '解压缩到新文件夹',
        click: async () => {
          try {
            await dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
              type: 'info',
              title: '解压缩',
              message: '解压缩功能暂未实现',
              detail: '请使用系统自带的解压工具或第三方解压软件。',
              buttons: ['确定']
            });
          } catch (error) {
            console.error('解压缩失败:', error);
          }
        },
        enabled: fileExists
      }] : []),
      // 可执行文件特定功能
      ...(isExecutable ? [{
        label: '以管理员身份运行',
        click: async () => {
          try {
            if (process.platform === 'win32') {
              const { spawn } = require('child_process');
              spawn('powershell', ['-Command', `Start-Process "${filePath}" -Verb RunAs`], { shell: true });
            } else {
              await dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                type: 'info',
                title: '管理员权限',
                message: '此功能仅在Windows系统上可用',
                buttons: ['确定']
              });
            }
          } catch (error) {
            console.error('以管理员身份运行失败:', error);
          }
        },
        enabled: fileExists && process.platform === 'win32'
      }] : []),
      // 代码文件特定功能
      ...(isCode ? [{
        label: '在代码编辑器中打开',
        click: async () => {
          try {
            // 尝试用常见的代码编辑器打开
            const editors = ['code', 'notepad++', 'sublime_text', 'atom'];
            let opened = false;

            for (const editor of editors) {
              try {
                const { spawn } = require('child_process');
                spawn(editor, [filePath], { detached: true });
                opened = true;
                break;
              } catch (e) {
                // 继续尝试下一个编辑器
              }
            }

            if (!opened) {
              // 如果没有找到专门的编辑器，用默认程序打开
              await shell.openPath(filePath);
            }
          } catch (error) {
            console.error('在代码编辑器中打开失败:', error);
          }
        },
        enabled: fileExists
      }] : []),
      { type: 'separator' },
      {
        label: '在文件管理器中显示',
        click: () => {
          shell.showItemInFolder(filePath);
        },
        enabled: fileExists
      },
      {
        label: '打开文件位置',
        click: async () => {
          try {
            const dirPath = path.dirname(filePath);
            await shell.openPath(dirPath);
          } catch (error) {
            console.error('打开文件位置失败:', error);
          }
        },
        enabled: fileExists
      },
      { type: 'separator' },
      {
        label: '重命名',
        click: async () => {
          try {
            const currentName = path.basename(filePath);
            const currentDir = path.dirname(filePath);

            const result = await dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
              type: 'question',
              title: '重命名文件',
              message: '输入新的文件名：',
              detail: `当前名称: ${currentName}`,
              buttons: ['取消', '确定'],
              defaultId: 1,
              cancelId: 0
            });

            if (result.response === 1) {
              // 这里应该显示一个输入框，但由于dialog限制，暂时跳过
              // 在实际应用中，可以创建一个专门的重命名窗口
              console.log('重命名功能需要额外的UI组件支持');
            }
          } catch (error) {
            console.error('重命名失败:', error);
          }
        },
        enabled: fileExists
      },
      { type: 'separator' },
      {
        label: '复制',
        submenu: [
          {
            label: '复制文件路径',
            click: () => {
              const { clipboard } = require('electron');
              clipboard.writeText(filePath);
            }
          },
          {
            label: '复制文件名',
            click: () => {
              const { clipboard } = require('electron');
              const fileName = path.basename(filePath);
              clipboard.writeText(fileName);
            }
          },
          {
            label: '复制文件名（不含扩展名）',
            click: () => {
              const { clipboard } = require('electron');
              const fileName = path.parse(filePath).name;
              clipboard.writeText(fileName);
            }
          },
          {
            label: '复制目录路径',
            click: () => {
              const { clipboard } = require('electron');
              const dirPath = path.dirname(filePath);
              clipboard.writeText(dirPath);
            }
          }
        ]
      },
      {
        label: '发送到',
        submenu: [
          {
            label: '桌面快捷方式',
            click: async () => {
              try {
                const os = require('os');
                const desktopPath = path.join(os.homedir(), 'Desktop');
                const shortcutName = `${path.parse(filePath).name}.lnk`;
                const shortcutPath = path.join(desktopPath, shortcutName);

                // 使用shell创建快捷方式
                await shell.writeShortcutLink(shortcutPath, {
                  target: filePath,
                  description: `快捷方式到 ${path.basename(filePath)}`
                });

                await dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                  type: 'info',
                  title: '创建快捷方式',
                  message: '快捷方式已创建到桌面',
                  buttons: ['确定']
                });
              } catch (error) {
                console.error('创建桌面快捷方式失败:', error);
                await dialog.showErrorBox('创建失败', `无法创建快捷方式: ${error.message}`);
              }
            },
            enabled: fileExists && process.platform === 'win32'
          }
        ]
      },
      { type: 'separator' },
      {
        label: '压缩文件',
        click: async () => {
          try {
            const result = await dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
              title: '创建压缩文件',
              defaultPath: `${path.parse(filePath).name}.zip`,
              filters: [
                { name: 'ZIP文件', extensions: ['zip'] }
              ]
            });

            if (!result.canceled && result.filePath) {
              // 这里需要使用压缩库，暂时提示用户
              await dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                type: 'info',
                title: '压缩功能',
                message: '压缩功能暂未实现，请使用系统自带的压缩工具',
                buttons: ['确定']
              });
            }
          } catch (error) {
            console.error('压缩文件失败:', error);
          }
        },
        enabled: fileExists
      },
      { type: 'separator' },
      {
        label: '属性',
        click: async () => {
          try {
            if (fileExists) {
              const stats = fs.statSync(filePath);
              const fileSize = stats.size;
              const formatFileSize = (bytes) => {
                if (bytes === 0) return '0 字节';
                const k = 1024;
                const sizes = ['字节', 'KB', 'MB', 'GB', 'TB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
              };

              const fileType = isDirectory ? '文件夹' : (path.extname(filePath) || '文件');
              const details = [
                `类型: ${fileType}`,
                `位置: ${path.dirname(filePath)}`,
                `大小: ${formatFileSize(fileSize)} (${fileSize.toLocaleString()} 字节)`,
                `创建时间: ${stats.birthtime.toLocaleString('zh-CN')}`,
                `修改时间: ${stats.mtime.toLocaleString('zh-CN')}`,
                `访问时间: ${stats.atime.toLocaleString('zh-CN')}`,
                `权限: ${stats.mode.toString(8)}`
              ].join('\n');

              await dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                type: 'info',
                title: '文件属性',
                message: path.basename(filePath),
                detail: details,
                buttons: ['确定']
              });
            }
          } catch (error) {
            console.error('获取文件属性失败:', error);
          }
        },
        enabled: fileExists
      },
      { type: 'separator' },
      {
        label: '删除',
        click: async () => {
          try {
            const result = await dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
              type: 'warning',
              title: '确认删除',
              message: `确定要删除这个${isDirectory ? '文件夹' : '文件'}吗？`,
              detail: `名称: ${path.basename(filePath)}\n路径: ${filePath}\n\n文件将被移动到回收站。`,
              buttons: ['取消', '删除'],
              defaultId: 0,
              cancelId: 0
            });

            if (result.response === 1) {
              // 移动到回收站而不是直接删除
              await shell.trashItem(filePath);

              // 显示成功消息
              await dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                type: 'info',
                title: '删除成功',
                message: `${isDirectory ? '文件夹' : '文件'}已移动到回收站`,
                buttons: ['确定']
              });
            }
          } catch (error) {
            console.error('删除文件失败:', error);
            await dialog.showErrorBox('删除失败', `无法删除${isDirectory ? '文件夹' : '文件'}: ${error.message}`);
          }
        },
        enabled: fileExists
      }
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    menu.popup({ window: BrowserWindow.getFocusedWindow() });

    return { success: true };
  } catch (error) {
    console.error('显示右键菜单失败:', error);
    return { success: false, error: error.message };
  }
});

app.whenReady().then(() => {
  initOpenAI();
  initEverythingSearch();
  initEverythingManager();
  createTray();
  createWindow();

  // 启动时检查更新
  autoUpdater.checkOnStartup();

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

// 自动更新IPC处理器
ipcMain.handle('check-for-updates', async () => {
  return await autoUpdater.checkForUpdates();
});

ipcMain.handle('get-current-version', () => {
  return autoUpdater.currentVersion;
});

ipcMain.handle('open-download-page', async (event, downloadUrl) => {
  try {
    await shell.openExternal(downloadUrl);
    return { success: true };
  } catch (error) {
    console.error('打开下载页面失败:', error);
    return { success: false, error: error.message };
  }
});

// 搜索历史使用electron-store自动管理，无需手动创建目录

// 调试窗口相关IPC处理器
ipcMain.handle('open-debug-window', async () => {
  try {
    const window = createDebugWindow();
    return { success: true };
  } catch (error) {
    console.error('打开调试窗口失败:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('close-debug-window', async () => {
  try {
    if (debugWindow && !debugWindow.isDestroyed()) {
      debugWindow.close();
    }
    return { success: true };
  } catch (error) {
    console.error('关闭调试窗口失败:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('set-debug-window-always-on-top', async (event, alwaysOnTop) => {
  try {
    if (debugWindow && !debugWindow.isDestroyed()) {
      debugWindow.setAlwaysOnTop(alwaysOnTop);
    }
    return { success: true };
  } catch (error) {
    console.error('设置调试窗口置顶失败:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-debug-log', async (event, logContent) => {
  try {
    const { dialog } = require('electron');
    const fs = require('fs');

    const result = await dialog.showSaveDialog(debugWindow || BrowserWindow.getFocusedWindow(), {
      title: '保存调试日志',
      defaultPath: `debug-log-${new Date().toISOString().slice(0, 10)}.txt`,
      filters: [
        { name: '文本文件', extensions: ['txt'] },
        { name: '日志文件', extensions: ['log'] }
      ]
    });

    if (result.canceled) {
      return { success: false, error: '用户取消保存' };
    }

    fs.writeFileSync(result.filePath, logContent, 'utf8');
    return { success: true, filePath: result.filePath };
  } catch (error) {
    console.error('保存调试日志失败:', error);
    return { success: false, error: error.message };
  }
});

// 清空调试输出
ipcMain.handle('clear-debug-output', async () => {
  try {
    if (debugWindow && !debugWindow.isDestroyed()) {
      debugWindow.webContents.send('clear-debug-output');
    }
    return { success: true };
  } catch (error) {
    console.error('清空调试输出失败:', error);
    return { success: false, error: error.message };
  }
});
