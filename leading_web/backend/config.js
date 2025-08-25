// 配置文件示例 - 复制此文件为 config.js 并填入真实值
module.exports = {
  // 服务器配置
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // 数据库配置
  database: {
    filename: process.env.DATABASE_URL || './database.sqlite'
  },
  
  // GitHub OAuth 配置
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || 'your_github_client_id',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'your_github_client_secret',
    callbackUrl: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3001/auth/github/callback'
  },
  
  // Session 配置
  session: {
    secret: process.env.SESSION_SECRET || 'your_session_secret_here',
    maxAge: 24 * 60 * 60 * 1000 // 24小时
  },
  
  // 前端URL配置
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};
