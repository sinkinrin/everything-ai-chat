const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const Database = require('../database');

const router = express.Router();

// GitHub OAuth Strategy
function configurePassport(config, db) {
  passport.use(new GitHubStrategy({
    clientID: config.github.clientId,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackUrl
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // 检查用户是否已存在
      let user = await db.get(
        'SELECT * FROM users WHERE github_id = ?',
        [profile.id]
      );

      if (user) {
        // 更新用户信息
        await db.run(`
          UPDATE users SET 
            username = ?, email = ?, avatar_url = ?, 
            display_name = ?, bio = ?, location = ?, 
            company = ?, blog = ?, updated_at = CURRENT_TIMESTAMP
          WHERE github_id = ?
        `, [
          profile.username,
          profile._json.email,
          profile.photos[0] ? profile.photos[0].value : null,
          profile.displayName,
          profile._json.bio,
          profile._json.location,
          profile._json.company,
          profile._json.blog,
          profile.id
        ]);
      } else {
        // 创建新用户
        const result = await db.run(`
          INSERT INTO users (
            github_id, username, email, avatar_url, 
            display_name, bio, location, company, blog
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          profile.id,
          profile.username,
          profile._json.email,
          profile.photos[0] ? profile.photos[0].value : null,
          profile.displayName,
          profile._json.bio,
          profile._json.location,
          profile._json.company,
          profile._json.blog
        ]);

        user = await db.get('SELECT * FROM users WHERE id = ?', [result.id]);
      }

      return done(null, user);
    } catch (error) {
      console.error('GitHub认证错误:', error);
      return done(error);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

// GitHub登录路由
router.get('/github', passport.authenticate('github', {
  scope: ['user:email']
}));

// GitHub回调路由
router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login?error=auth_failed' }),
  (req, res) => {
    // 登录成功，重定向到前端
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/?login=success`);
  }
);

// 登出路由
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: '登出失败' });
    }
    res.json({ message: '登出成功' });
  });
});

// 获取当前用户信息
router.get('/me', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        avatar_url: req.user.avatar_url,
        display_name: req.user.display_name
      }
    });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// 检查登录状态
router.get('/status', (req, res) => {
  res.json({
    isAuthenticated: req.isAuthenticated ? req.isAuthenticated() : false,
    user: req.user ? {
      id: req.user.id,
      username: req.user.username,
      avatar_url: req.user.avatar_url,
      display_name: req.user.display_name
    } : null
  });
});

module.exports = { router, configurePassport };
