# 自动更新功能设置指南

## 功能概述

已为Everything AI Chat添加了自动更新功能，可以自动检测GitHub上的新版本并在右下角显示更新通知。

## 使用特性

✅ 启动时自动检查更新（延迟3秒）
✅ 版本号智能比较
✅ 右下角现代化更新通知UI
✅ 支持"立即下载"、"稍后提醒"、"忽略此版本"三种操作
✅ 30分钟后再次提醒功能
✅ 移动端响应式适配

## 配置步骤

### 1. 设置GitHub仓库地址

在 `client/src/main/main.js` 文件中，找到以下代码行（大约第200行）：

```javascript
this.githubRepo = 'YOUR_GITHUB_USERNAME/everything-ai-chat'; // 请替换为实际的GitHub仓库
```

将 `YOUR_GITHUB_USERNAME/everything-ai-chat` 替换为你的实际GitHub仓库地址，例如：
- `myusername/everything-ai-chat`
- `mycompany/my-electron-app`

### 2. GitHub仓库要求

确保你的GitHub仓库：
- ✅ 是公开的（私有仓库需要API Token）
- ✅ 使用GitHub Releases发布版本
- ✅ 版本标签格式为 `v1.0.0` 或 `1.0.0`
- ✅ Release中包含安装包（.exe文件等）

### 3. 版本号规范

请确保：
- `package.json` 中的版本号格式为 `x.y.z`（如 `2.0.0`）
- GitHub Release 标签格式为 `vx.y.z` 或 `x.y.z`
- 遵循语义化版本规范

## 测试功能

### 手动触发检查更新

可以在开发者控制台中运行：
```javascript
// 获取当前版本
window.electronAPI.getCurrentVersion().then(console.log)

// 手动检查更新
window.electronAPI.checkForUpdates().then(console.log)
```

### 模拟新版本

1. 在GitHub仓库创建一个比当前版本更高的Release
2. 重启应用，3秒后应该会看到更新通知
3. 或在控制台手动触发检查

## 用户界面

### 更新通知位置
- 桌面端：右下角固定位置
- 移动端：底部全宽显示

### 用户操作选项
1. **立即下载** - 打开GitHub Release页面下载
2. **稍后提醒** - 30分钟后再次显示通知
3. **忽略此版本** - 永久忽略该版本更新
4. **关闭按钮** - 临时关闭通知

## 网络要求

- 需要访问 `api.github.com` 的网络权限
- 10秒超时设置
- 网络错误时静默处理，不影响应用正常使用

## 故障排除

### 1. 更新检查失败
检查网络连接和GitHub仓库地址是否正确。

### 2. 版本比较异常  
确保版本号格式正确，遵循 `x.y.z` 格式。

### 3. 通知不显示
检查是否之前点击了"忽略此版本"，可清除浏览器本地存储。

### 4. 开发调试
查看开发者控制台的日志输出，包含详细的检查过程信息。

## 配置示例

```javascript
// 配置示例
this.githubRepo = 'microsoft/electron-app'; // 替换为你的仓库
```

完成配置后，重新构建应用即可启用自动更新功能。
