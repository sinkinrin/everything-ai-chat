# Everything AI Chat - 智能文件搜索客户端（支持10种语言）

[**English**](./README-en.md) | 中文

一个现代化的 Everything 搜索客户端，将 AI 智能与极速本地搜索完美结合。支持自然语言查询，自动转换为 Everything 精确搜索语法，让文件搜索变得前所未有的简单和高效。

## 🌟 Star History
**开发不易，求个小星星✨**

[![Star History Chart](https://api.star-history.com/svg?repos=MaskerPRC/everything-ai-chat&type=Date)](https://star-history.com/#MaskerPRC/everything-ai-chat&Date)


## 👣示例
<img width="1500" height="1000" alt="image" src="https://github.com/user-attachments/assets/731dcaf7-9b13-4d71-900d-de8572ea9b12" />

<img width="1799" height="1200" alt="image" src="https://github.com/user-attachments/assets/f54f4ddd-0e6d-443c-ac35-73c1dc064d80" />

<img width="1799" height="1200" alt="image" src="https://github.com/user-attachments/assets/79d34f0d-ad0a-46a4-9456-4049209e8252" />

## 👀欢迎加入微信交流群
https://100.agitao.net/

![100个AI产品交流群](https://proxy.agitao.me/img)


## ✨ 核心特性

### 🔧 智能自动化连接 (技术亮点)
- **一键连接Everything**: 自动搜索Everything安装位置，无需手动配置
- **多策略搜索算法**: 通过注册表、常见路径、桌面快捷方式等多种策略定位安装位置
- **智能进程管理**: 采用优雅关闭→强制终止→高级终止的三级进程管理策略
- **自动端口发现**: 智能寻找可用端口，避免端口冲突
- **配置文件自动化**: 自动修改Everything配置，支持配置备份和恢复
- **安全凭据生成**: 自动生成随机用户名密码，确保连接安全性

### 🧠 AI 智能搜索
- **自然语言理解**: 输入"今天的PDF文件"、"大于10MB的视频"等自然语言，AI自动转换为精确搜索语法
- **OpenAI 集成**: 支持 GPT-3.5/GPT-4 模型，智能理解复杂搜索意图
- **本地优化**: 即使没有AI配置也能通过本地规则优化搜索查询

### ⚡ 极速搜索体验
- **Everything 引擎**: 基于世界上最快的文件搜索引擎Everything
- **实时结果**: 毫秒级搜索响应，支持大容量硬盘
- **智能建议**: 提供搜索建议和历史记录快速访问

### 🎯 精准结果展示
- **多维度排序**: 按文件名、路径、大小、修改时间、创建时间等多维度排序
- **文件类型识别**: 自动识别文件类型并显示对应图标（文档📄、图片🖼️、视频🎬等）
- **详细信息**: 显示文件大小、修改时间、创建时间、访问时间、属性等完整信息

### 🎨 现代化界面
- **自定义标题栏**: 无边框设计，集成窗口控制按钮
- **实时状态显示**: Everything连接状态实时监控
- **搜索历史**: 自动保存并智能管理搜索历史（最多50条）
- **响应式布局**: 自适应窗口大小，支持最小化到800x600

## 技术栈

- **前端**: Vue 3 + Vite
- **后端**: Electron + Node.js
- **数据库**: SQLite (搜索历史存储)
- **AI服务**: OpenAI GPT API
- **搜索引擎**: Everything HTTP API

## 系统要求

- Windows 7/8/10/11
- Everything 软件 (1.4.1+)
- Node.js 16+

## 安装步骤

### 1. 安装Everything

1. 下载并安装 [Everything](https://www.voidtools.com/)
2. 启动Everything软件
3. 进入 `工具` → `选项` → `常规`
4. 勾选 `启用HTTP服务器`
5. 确认端口为80 (默认)

### 2. 克隆项目

```bash
git clone https://github.com/your-repo/everything-ai-chat.git
cd everything-ai-chat
cd client
```

### 3. 安装依赖

```bash
npm install
```

### 4. 配置OpenAI

如需使用AI自然语言转换功能，需要配置OpenAI API:

1. 启动应用后点击右下角设置按钮
2. 输入你的OpenAI API Key
3. 选择合适的模型 (推荐GPT-3.5 Turbo)

## 运行应用

### 开发模式

```bash
# 安装依赖
npm install

# 启动开发环境
npm run dev
```

### 生产构建

```bash
npm run build
npm run build:electron
```

## 🚀 使用指南

### 快速开始
1. 启动应用后会自动检测 Everything 连接状态
2. 在搜索框中输入查询内容
3. 支持三种搜索方式：

### 💬 自然语言搜索 (推荐)
配置 OpenAI API 后可使用自然语言搜索：
```
今天修改的PDF文件
大于10MB的视频
本周创建的图片
桌面上的Word文档
昨天下载的压缩包
包含"报告"的Excel文件
```

### 🔧 Everything 语法搜索
直接使用 Everything 强大的搜索语法：
```
*.pdf dm:today                    # 今天修改的PDF
size:>10mb *.mp4;*.avi           # 大于10MB的视频文件
dc:thisweek *.jpg;*.png          # 本周创建的图片
path:desktop *.docx              # 桌面上的Word文档
*.zip;*.rar dm:yesterday         # 昨天修改的压缩文件
*报告* *.xlsx                     # 包含"报告"的Excel文件
```

### 🔍 简单关键词搜索
直接输入文件名或关键词：
```
报告.docx                        # 查找包含"报告"的Word文档
*.pdf                           # 查找所有PDF文件
photoshop                       # 查找包含"photoshop"的文件
```

### 🎯 高级搜索功能

#### 文件大小筛选
- `size:>100mb` - 大于100MB的文件
- `size:<1kb` - 小于1KB的文件
- `size:1mb..100mb` - 1MB到100MB之间的文件

#### 时间筛选
- `dm:today` - 今天修改的文件
- `dc:yesterday` - 昨天创建的文件
- `da:thisweek` - 本周访问的文件

#### 路径筛选
- `path:desktop` - 桌面路径下的文件
- `!path:temp` - 排除临时文件夹的文件

#### 文件类型组合
- `*.jpg;*.png;*.gif` - 常见图片格式
- `*.mp4;*.avi;*.mkv` - 常见视频格式
- `*.doc;*.docx;*.pdf` - 常见文档格式

## ⌨️ 快捷键与操作

### 搜索操作
- `Enter` - 执行搜索
- `↑/↓` - 浏览搜索历史
- `Esc` - 清空搜索框
- 点击搜索建议 - 快速使用预设搜索

### 文件操作
- `双击文件` - 使用默认程序打开文件
- `右键文件` - 显示文件上下文菜单
- 点击文件路径 - 在资源管理器中显示文件

### 界面操作
- 点击列标题 - 按该列排序（再次点击切换升降序）
- `⚙️` 设置按钮 - 配置 OpenAI API 和显示选项
- 标题栏 `−` `□` `×` - 最小化、最大化、关闭窗口

### 结果管理
- `📤 导出结果` - 导出搜索结果为文件
- `🗑️ 清空结果` - 清除当前搜索结果
- 搜索历史下拉 - 快速重复之前的搜索

## 搜索语法示例

| 自然语言 | Everything语法 | 说明 |
|---------|----------------|------|
| 今天的PDF | `*.pdf dm:today` | 今天修改的PDF文件 |
| 大于10MB的视频 | `*.mp4;*.avi size:>10mb` | 大于10MB的视频文件 |
| 桌面上的图片 | `*.jpg;*.png path:desktop` | 桌面目录的图片 |
| 本周的文档 | `*.doc;*.docx dm:thisweek` | 本周修改的文档 |

## 🔧 故障排除

### 应用启动相关问题

#### 应用启动失败
**症状**: 运行 `npm run dev` 后应用无法启动
**解决步骤**:
1. 确保端口5173未被占用
2. 终止可能存在的旧进程：`taskkill /f /im node.exe`
3. 重新安装依赖：
   ```bash
   rm -rf node_modules
   npm install
   npm run dev
   ```

#### Electron 窗口空白
**症状**: 应用启动但显示空白窗口
**解决方案**:
1. 等待 Vue 开发服务器完全启动（通常需要10-30秒）
2. 检查控制台是否有错误信息
3. 尝试刷新窗口或重启应用

### Everything 连接问题

#### 状态显示"未连接"
**解决步骤**:
1. **检查 Everything 是否运行**: 确保 Everything 软件正在后台运行
2. **启用 HTTP 服务器**:
   - 打开 Everything → 工具 → 选项 → HTTP
   - 勾选"启用 HTTP 服务器"
   - 确认端口为 80（默认）
   - 点击"确定"并重启 Everything
3. **检查端口占用**: 确认端口80未被其他程序占用
4. **使用一键连接**: 在应用设置中点击"一键连接Everything"

#### Everything HTTP 服务无法启动
**解决方案**:
1. 以管理员身份运行 Everything
2. 更改 HTTP 端口（如改为8080）
3. 检查 Windows 防火墙设置
4. 确保 Everything 版本为 1.4.1 或更高

### OpenAI API 相关问题

#### API 请求失败
**常见错误及解决方案**:
- **401 Unauthorized**: API Key 错误，请检查并重新输入
- **429 Too Many Requests**: 请求频率过高，请稍后重试
- **403 Forbidden**: 账户余额不足或API Key无效
- **网络错误**: 检查网络连接，或尝试更换 API 端点

#### 自然语言转换效果不佳
**优化建议**:
1. 使用更具体的描述词汇
2. 尝试不同的表达方式
3. 检查是否选择了合适的 AI 模型（推荐 GPT-3.5-turbo）

### 搜索功能问题

#### 搜索结果为空
**排查步骤**:
1. **检查 Everything 索引**: 确保 Everything 已完成文件索引
2. **验证搜索语法**: 尝试使用更简单的关键词（如 `*.txt`）
3. **检查文件权限**: 确保有权限访问目标文件夹
4. **重建索引**: 在 Everything 中选择"工具 → 重建数据库"

#### 搜索速度慢
**优化方法**:
1. 减少搜索结果数量限制
2. 使用更精确的搜索条件
3. 确保硬盘空间充足
4. 关闭不必要的后台程序

### 界面显示问题

#### 文件图标显示异常
**解决方案**: 重启应用，图标映射会自动修复

#### 窗口大小异常
**解决方案**: 
1. 双击标题栏恢复窗口
2. 右键标题栏选择窗口控制选项
3. 重启应用恢复默认大小

## 👨‍💻 开发说明

### 项目架构

本项目采用现代化的 Electron + Vue 3 架构，具有清晰的前后端分离设计：

```
everything-ai-chat/
├── src/
│   ├── main/                    # Electron主进程
│   │   ├── main.js             # 主进程入口，处理窗口管理和IPC
│   │   ├── preload.js          # 预加载脚本，安全地暴露API
│   │   ├── everything-search.js # Everything HTTP API封装
│   │   └── everything-manager.js # Everything自动连接管理
│   ├── renderer/               # Vue 3渲染进程
│   │   ├── components/         # Vue组件
│   │   │   └── ConfigDialog.vue # 配置对话框组件
│   │   ├── App.vue            # 主应用组件
│   │   ├── main.js            # Vue应用入口
│   │   ├── index.html         # HTML模板
│   │   └── style.css          # 全局样式
│   └── database/              # 数据存储（electron-store）
├── package.json               # 项目配置和依赖
├── vite.config.js            # Vite构建配置
├── UI_DESIGN_SPEC_2.0.md     # UI设计规范文档
└── README.md                 # 项目说明文档
```

### 核心技术组件

#### 🎨 前端技术栈
- **Vue 3 Composition API**: 现代化的响应式开发
- **Vite**: 极速的开发服务器和构建工具
- **自定义 CSS**: 精心设计的现代化界面

#### ⚙️ 后端技术栈
- **Electron 37.x**: 跨平台桌面应用框架
- **Node.js**: 后端逻辑处理
- **electron-store**: 配置和数据持久化
- **OpenAI API**: AI智能搜索转换

#### 🔍 搜索引擎集成
- **Everything HTTP API**: 高性能本地文件搜索
- **智能查询优化**: 本地和AI双重查询优化

### 开发环境配置

#### 必要工具
- Node.js 16+ 
- npm 或 yarn
- Everything 1.4.1+
- VS Code (推荐)

#### 推荐的 VS Code 扩展
```json
{
  "recommendations": [
    "vue.volar",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode"
  ]
}
```

### 添加新功能

#### 1. 添加新的搜索功能
```javascript
// 在 src/main/everything-search.js 中添加新的搜索方法
async customSearch(query, options) {
  // 实现新的搜索逻辑
}
```

#### 2. 添加新的UI组件
```vue
<!-- 在 src/renderer/components/ 中创建新组件 -->
<template>
  <!-- 组件模板 -->
</template>

<script>
export default {
  name: 'NewComponent'
}
</script>
```

#### 3. 添加新的IPC通信
```javascript
// 在 src/main/main.js 中添加IPC处理器
ipcMain.handle('new-feature', async (event, data) => {
  // 处理新功能
});

// 在 src/main/preload.js 中暴露API
contextBridge.exposeInMainWorld('electronAPI', {
  newFeature: (data) => ipcRenderer.invoke('new-feature', data)
});
```

### 构建与发布

#### 开发构建
```bash
npm run dev          # 启动开发环境
npm run build        # 构建Vue前端
```

#### 生产构建
```bash
npm run build:all    # 完整构建（前端+Electron）
npm run dist         # 打包为安装程序
```

#### 构建产物
- `dist-vue/` - Vue前端构建文件
- `release/` - Electron应用安装包

### 项目特色

#### 🔐 安全设计
- 禁用 Node.js 集成
- 启用上下文隔离
- 使用预加载脚本安全通信

#### 📊 性能优化
- Vue 3 Composition API 提升性能
- Vite 快速开发和构建
- 搜索结果虚拟滚动（计划中）

#### 🎨 界面设计
- 自定义标题栏
- 现代化 UI 设计
- 响应式布局
- 深色/浅色主题支持（计划中）

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 贡献方式
- 🐛 **报告问题**: 发现 Bug 请提交 Issue
- 💡 **功能建议**: 有好想法请在 Discussions 中讨论  
- 🔧 **代码贡献**: Fork 项目并提交 Pull Request
- 📚 **文档改进**: 帮助完善文档和示例

### 提交 Pull Request
1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 开发规范
- 遵循现有代码风格
- 添加必要的注释
- 更新相关文档
- 确保测试通过

## 🆘 支持与反馈

### 获取帮助
- 📖 **查阅文档**: 首先查看本 README 和相关文档
- 🔍 **搜索问题**: 在 Issues 中搜索是否有类似问题
- 💬 **提交问题**: 详细描述问题并提供必要信息

### 联系方式
- **GitHub Issues**: 报告 Bug 和功能请求
- **GitHub Discussions**: 技术讨论和问答
- **Email**: 紧急问题联系开发者

### 问题反馈模板
提交问题时请包含：
- 操作系统版本
- Everything 版本
- 应用版本
- 详细的问题描述
- 重现步骤
- 错误截图（如有）

---

⭐ 如果这个项目对你有帮助，请考虑给它一个 Star！

💝 感谢所有贡献者的努力！ 
