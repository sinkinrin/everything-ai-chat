// 认证中间件
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  
  res.status(401).json({
    error: 'Unauthorized',
    message: '请先登录'
  });
};

// 可选认证中间件 - 不强制登录但会设置用户信息
const optionalAuth = (req, res, next) => {
  // 不管是否认证都继续执行
  next();
};

// 管理员认证中间件
const requireAdmin = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: '请先登录'
    });
  }
  
  // 这里可以检查用户是否为管理员
  // 暂时先允许所有已认证用户
  next();
};

module.exports = {
  requireAuth,
  optionalAuth,
  requireAdmin
};
