const { contextBridge, ipcRenderer } = require('electron');

// 向渲染进程暴露安全的API
contextBridge.exposeInMainWorld('electronAPI', {
  // 搜索文件
  searchFiles: (query) => ipcRenderer.invoke('search-files', query),
  
  // 获取搜索历史
  getSearchHistory: () => ipcRenderer.invoke('get-search-history'),
  
  // 设置OpenAI配置
  setOpenAIConfig: (config) => ipcRenderer.invoke('set-openai-config', config),
  
  // 获取OpenAI配置
  getOpenAIConfig: () => ipcRenderer.invoke('get-openai-config'),
  
  // 打开文件路径
  openPath: (filePath) => ipcRenderer.invoke('open-path', filePath),
  
  // 显示文件在文件管理器中
  showInFolder: (filePath) => ipcRenderer.invoke('show-in-folder', filePath),
  
  // 窗口控制
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  toggleMaximize: () => ipcRenderer.invoke('toggle-maximize'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  
  // Everything连接状态
  testEverythingConnection: () => ipcRenderer.invoke('test-everything-connection'),
  
  // 一键连接Everything服务
  autoConnectEverything: () => ipcRenderer.invoke('auto-connect-everything'),
  
  // 手动设置Everything路径
  setEverythingPath: (userPath) => ipcRenderer.invoke('set-everything-path', userPath),
  
  // 获取Everything配置
  getEverythingConfig: () => ipcRenderer.invoke('get-everything-config'),
  
  // 监听来自主进程的消息
  on: (channel, func) => {
    const validChannels = ['open-settings'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, func);
    }
  },
  
  // 移除事件监听
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
}); 