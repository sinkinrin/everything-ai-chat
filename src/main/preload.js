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
  showInFolder: (filePath) => ipcRenderer.invoke('show-in-folder', filePath)
}); 