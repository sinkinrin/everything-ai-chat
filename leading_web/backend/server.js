require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const rateLimit = require('express-rate-limit');

const Database = require('./database');
// 尝试加载实际配置文件，如果不存在则使用示例配置
let config;
try {
  config = require('./config');
} catch (error) {
  console.log('⚠️  未找到 config.js，使用示例配置。请复制 config.example.js 到 config.js 并配置相关参数。');
  config = require('./config.example');
}

// 路由导入
const { router: authRouter, configurePassport } = require('./routes/auth');
const createFeedbackRoutes = require('./routes/feedback');
const createVoteRoutes = require('./routes/votes');
const createDownloadRoutes = require('./routes/downloads');

const app = express();
const PORT = config.port;

// 数据库实例
let db;

// 中间件配置
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(compression());
app.use(morgan('combined'));

// CORS配置
app.use(cors({
  origin: [config.frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 15分钟内最多100个请求
  message: {
    error: '请求过于频繁，请稍后再试'
  }
});
app.use('/api', limiter);

// API专用速率限制
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  skip: (req) => {
    // 对某些路由更宽松
    return req.path.includes('/downloads') || req.path.includes('/feedback');
  }
});

// 解析请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session配置
app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.nodeEnv === 'production',
    httpOnly: true,
    maxAge: config.session.maxAge
  }
}));

// 设置信任代理（如果在代理后面）
if (config.nodeEnv === 'production') {
  app.set('trust proxy', 1);
}

// Passport配置
app.use(passport.initialize());
app.use(passport.session());

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API路由
app.use('/api/auth', authRouter);

// 初始化数据库并启动服务器
async function startServer() {
  try {
    console.log('🚀 正在启动服务器...');
    
    // 初始化数据库
    db = new Database(config.database.filename);
    await db.connect();
    await db.initTables();
    await db.seedData();
    
    // 配置Passport
    configurePassport(config, db);
    
    // 配置路由（需要数据库实例）
    app.use('/api/feedback', createFeedbackRoutes(db));
    app.use('/api/votes', createVoteRoutes(db));
    app.use('/api/downloads', createDownloadRoutes(db));
    
    // 错误处理中间件（必须在所有路由之后）
    app.use((err, req, res, next) => {
      console.error('服务器错误:', err);
      
      // 不要在生产环境泄露错误详情
      const isDevelopment = config.nodeEnv === 'development';
      
      res.status(err.status || 500).json({
        error: err.message || '内部服务器错误',
        ...(isDevelopment && { stack: err.stack })
      });
    });

    // 404处理（必须在所有路由之后）
    app.use('*', (req, res) => {
      res.status(404).json({
        error: '端点不存在',
        path: req.originalUrl
      });
    });
    
    // 启动服务器
    app.listen(PORT, () => {
      console.log('✅ 服务器启动成功!');
      console.log(`   - 服务地址: http://localhost:${PORT}`);
      console.log(`   - 环境模式: ${config.nodeEnv}`);
      console.log(`   - 数据库: ${config.database.filename}`);
      console.log('');
      console.log('🔗 可用的API端点:');
      console.log('   - GET  /health                     - 健康检查');
      console.log('   - GET  /api/auth/github            - GitHub登录');
      console.log('   - GET  /api/auth/status            - 登录状态');
      console.log('   - GET  /api/feedback               - 获取反馈列表');
      console.log('   - POST /api/feedback               - 创建反馈');
      console.log('   - GET  /api/downloads/latest       - 获取最新版本');
      console.log('   - GET  /api/downloads/versions     - 获取版本列表');
      console.log('');
      
      if (config.nodeEnv === 'development') {
        console.log('📋 开发环境说明:');
        console.log('   1. 请确保前端项目运行在 http://localhost:5173');
        console.log('   2. 在 GitHub 应用中设置回调URL: http://localhost:3001/auth/github/callback');
        console.log('   3. 创建 config.js 文件并配置 GitHub OAuth 信息');
        console.log('');
      }
    });
    
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
}

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n🛑 正在关闭服务器...');
  if (db) {
    await db.close();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 正在关闭服务器...');
  if (db) {
    await db.close();
  }
  process.exit(0);
});

// 启动服务器
if (require.main === module) {
  startServer();
}

module.exports = app;
