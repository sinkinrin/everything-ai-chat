# Everything AI Chat 落地页项目

基于 Node.js + Vue 3 + SQLite 的完整落地页项目，包含用户认证、反馈系统、投票功能等。

## 🚀 项目特性

- **GitHub OAuth 登录** - 用户认证系统
- **反馈管理系统** - 支持Bug报告和功能建议
- **投票排名系统** - 用户可为反馈投票
- **评论互动** - 用户可对反馈进行评论讨论
- **分类管理** - 反馈按类别进行组织
- **响应式设计** - 支持各种设备和屏幕尺寸
- **现代化UI** - 基于Tailwind CSS的美观界面

## 📁 项目结构

```
leading_web/
├── backend/                 # 后端API服务
│   ├── database/           # 数据库相关
│   │   ├── index.js       # 数据库操作类
│   │   └── schema.sql     # 数据库表结构
│   ├── middleware/         # 中间件
│   │   └── auth.js        # 认证中间件
│   ├── routes/            # API路由
│   │   ├── auth.js        # 认证相关API
│   │   ├── feedback.js    # 反馈相关API
│   │   ├── votes.js       # 投票相关API
│   │   └── downloads.js   # 下载统计API
│   ├── scripts/           # 工具脚本
│   │   └── migrate.js     # 数据库迁移脚本
│   ├── server.js          # 服务器主文件
│   ├── package.json       # 依赖配置
│   └── config.example.js  # 配置文件示例
└── frontend/               # 前端应用
    ├── src/
    │   ├── components/    # 通用组件
    │   │   └── layout/   # 布局组件
    │   ├── views/        # 页面组件
    │   ├── stores/       # 状态管理
    │   ├── services/     # API服务
    │   ├── router/       # 路由配置
    │   ├── App.vue       # 根组件
    │   └── main.js       # 入口文件
    ├── index.html         # HTML模板
    ├── package.json       # 依赖配置
    └── vite.config.js     # Vite配置
```

## 🛠 技术栈

### 后端
- **Node.js** - 运行时环境
- **Express** - Web框架
- **SQLite** - 数据库
- **Passport.js** - 认证中间件
- **GitHub OAuth** - 第三方登录

### 前端
- **Vue 3** - 渐进式JavaScript框架
- **Vite** - 构建工具
- **Vue Router** - 路由管理
- **Pinia** - 状态管理
- **Tailwind CSS** - CSS框架
- **Axios** - HTTP客户端
- **Lucide Icons** - 图标库

## 📦 安装和运行

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd everything-ai-chat/leading_web
```

### 2. 后端设置

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 复制配置文件并填入真实值
cp config.example.js config.js

# 运行数据库迁移
npm run db:migrate

# 启动后端服务
npm run dev
```

### 3. 前端设置

```bash
# 新开终端，进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 4. GitHub OAuth 配置

1. 在 GitHub 中创建新的 OAuth App:
   - 访问 `Settings > Developer settings > OAuth Apps > New OAuth App`
   - **Application name**: Everything AI Chat
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `http://localhost:3001/auth/github/callback`

2. 获取 Client ID 和 Client Secret，更新 `backend/config.js`:

```javascript
github: {
  clientId: 'your_github_client_id',
  clientSecret: 'your_github_client_secret',
  callbackUrl: 'http://localhost:3001/auth/github/callback'
}
```

## 🌐 访问地址

- **前端应用**: http://localhost:5173
- **后端API**: http://localhost:3001
- **API文档**: http://localhost:3001/health

## 📚 主要功能

### 用户认证
- GitHub OAuth 登录/登出
- 用户信息管理
- 会话状态维护

### 反馈系统
- 创建Bug报告和功能建议
- 按分类和状态筛选反馈
- 反馈详情查看和编辑
- 优先级设置

### 投票系统
- 对反馈进行投票（支持/反对）
- 按投票数排序反馈
- 实时更新投票统计

### 评论系统
- 对反馈添加评论
- 嵌套回复支持
- 实时评论更新

### 下载统计
- 软件版本管理
- 下载统计跟踪
- 平台兼容性

## 🔧 开发说明

### 数据库操作

```bash
# 重新初始化数据库
cd backend
npm run db:migrate

# 查看数据库文件
sqlite3 database.sqlite
```

### API测试

后端提供完整的REST API，支持：

- `GET /api/auth/status` - 获取登录状态
- `GET /api/feedback` - 获取反馈列表
- `POST /api/feedback` - 创建反馈
- `POST /api/votes` - 投票
- `GET /api/downloads/latest` - 获取最新版本

### 环境变量

在生产环境中，建议使用环境变量配置敏感信息：

```bash
# .env 文件示例
NODE_ENV=production
PORT=3001
SESSION_SECRET=your_long_random_string
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
FRONTEND_URL=https://your-domain.com
```

## 🚀 部署

### 后端部署
1. 构建项目并上传到服务器
2. 安装依赖: `npm install --production`
3. 配置环境变量
4. 启动服务: `npm start`

### 前端部署
1. 构建生产版本: `npm run build`
2. 将 `dist` 目录部署到静态文件服务器
3. 配置反向代理到后端API

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支: `git checkout -b feature/AmazingFeature`
3. 提交更改: `git commit -m 'Add some AmazingFeature'`
4. 推送分支: `git push origin feature/AmazingFeature`
5. 创建 Pull Request

## 📝 许可证

此项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🐛 问题反馈

如果您发现任何问题或有建议，请通过以下方式联系：

- 在项目中提交 Issue
- 使用应用内的反馈功能
- 发送邮件至 support@example.com

## 📋 更新日志

### v1.0.0 (2024-01-15)
- 🎉 首次发布
- ✨ 完整的用户认证系统
- ✨ 反馈管理和投票功能
- ✨ 响应式UI设计
- ✨ GitHub OAuth集成
