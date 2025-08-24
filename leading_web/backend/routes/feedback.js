const express = require('express');
const Joi = require('joi');
const { requireAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// 验证模式
const feedbackSchema = Joi.object({
  type: Joi.string().valid('bug', 'feature').required(),
  category_id: Joi.number().integer().positive().required(),
  title: Joi.string().min(5).max(255).required(),
  description: Joi.string().min(10).max(2000).required(),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical').default('medium')
});

const commentSchema = Joi.object({
  content: Joi.string().min(1).max(500).required(),
  parent_id: Joi.number().integer().positive().optional()
});

// 创建反馈路由
function createFeedbackRoutes(db) {
  
  // 获取反馈分类
  router.get('/categories', async (req, res) => {
    try {
      const categories = await db.all('SELECT * FROM feedback_categories ORDER BY name');
      res.json(categories);
    } catch (error) {
      console.error('获取分类失败:', error);
      res.status(500).json({ error: '服务器错误' });
    }
  });

  // 获取反馈列表
  router.get('/', optionalAuth, async (req, res) => {
    try {
      const { 
        type, 
        category_id, 
        status, 
        sort = 'votes', 
        order = 'desc', 
        page = 1, 
        limit = 20 
      } = req.query;

      let sql = `
        SELECT 
          f.*,
          u.username, u.avatar_url, u.display_name,
          fc.name as category_name, fc.color as category_color
        FROM feedbacks f
        LEFT JOIN users u ON f.user_id = u.id
        LEFT JOIN feedback_categories fc ON f.category_id = fc.id
        WHERE 1=1
      `;
      const params = [];

      // 添加过滤条件
      if (type) {
        sql += ' AND f.type = ?';
        params.push(type);
      }
      if (category_id) {
        sql += ' AND f.category_id = ?';
        params.push(category_id);
      }
      if (status) {
        sql += ' AND f.status = ?';
        params.push(status);
      }

      // 排序
      const validSorts = ['votes', 'created_at', 'updated_at'];
      const validOrders = ['asc', 'desc'];
      const sortBy = validSorts.includes(sort) ? sort : 'votes_count';
      const orderBy = validOrders.includes(order) ? order : 'desc';
      
      if (sortBy === 'votes') {
        sql += ` ORDER BY f.votes_count ${orderBy}, f.created_at DESC`;
      } else {
        sql += ` ORDER BY f.${sortBy} ${orderBy}`;
      }

      // 分页
      const offset = (parseInt(page) - 1) * parseInt(limit);
      sql += ' LIMIT ? OFFSET ?';
      params.push(parseInt(limit), offset);

      const feedbacks = await db.all(sql, params);
      
      // 获取总数
      let countSql = 'SELECT COUNT(*) as total FROM feedbacks f WHERE 1=1';
      const countParams = [];
      if (type) {
        countSql += ' AND f.type = ?';
        countParams.push(type);
      }
      if (category_id) {
        countSql += ' AND f.category_id = ?';
        countParams.push(category_id);
      }
      if (status) {
        countSql += ' AND f.status = ?';
        countParams.push(status);
      }

      const { total } = await db.get(countSql, countParams);

      res.json({
        feedbacks,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('获取反馈列表失败:', error);
      res.status(500).json({ error: '服务器错误' });
    }
  });

  // 获取单个反馈详情
  router.get('/:id', optionalAuth, async (req, res) => {
    try {
      const feedbackId = req.params.id;
      
      const feedback = await db.get(`
        SELECT 
          f.*,
          u.username, u.avatar_url, u.display_name,
          fc.name as category_name, fc.color as category_color
        FROM feedbacks f
        LEFT JOIN users u ON f.user_id = u.id
        LEFT JOIN feedback_categories fc ON f.category_id = fc.id
        WHERE f.id = ?
      `, [feedbackId]);

      if (!feedback) {
        return res.status(404).json({ error: '反馈不存在' });
      }

      // 获取评论
      const comments = await db.all(`
        SELECT 
          c.*,
          u.username, u.avatar_url, u.display_name
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.feedback_id = ?
        ORDER BY c.created_at ASC
      `, [feedbackId]);

      // 获取用户投票状态
      let userVote = null;
      if (req.user) {
        const vote = await db.get(
          'SELECT vote_type FROM votes WHERE user_id = ? AND feedback_id = ?',
          [req.user.id, feedbackId]
        );
        userVote = vote ? vote.vote_type : null;
      }

      res.json({
        ...feedback,
        comments,
        userVote
      });
    } catch (error) {
      console.error('获取反馈详情失败:', error);
      res.status(500).json({ error: '服务器错误' });
    }
  });

  // 创建反馈
  router.post('/', requireAuth, async (req, res) => {
    try {
      const { error, value } = feedbackSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const result = await db.run(`
        INSERT INTO feedbacks (user_id, category_id, type, title, description, priority)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        req.user.id,
        value.category_id,
        value.type,
        value.title,
        value.description,
        value.priority
      ]);

      const feedback = await db.get(`
        SELECT 
          f.*,
          u.username, u.avatar_url, u.display_name,
          fc.name as category_name, fc.color as category_color
        FROM feedbacks f
        LEFT JOIN users u ON f.user_id = u.id
        LEFT JOIN feedback_categories fc ON f.category_id = fc.id
        WHERE f.id = ?
      `, [result.id]);

      res.status(201).json(feedback);
    } catch (error) {
      console.error('创建反馈失败:', error);
      res.status(500).json({ error: '服务器错误' });
    }
  });

  // 添加评论
  router.post('/:id/comments', requireAuth, async (req, res) => {
    try {
      const feedbackId = req.params.id;
      const { error, value } = commentSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // 检查反馈是否存在
      const feedback = await db.get('SELECT id FROM feedbacks WHERE id = ?', [feedbackId]);
      if (!feedback) {
        return res.status(404).json({ error: '反馈不存在' });
      }

      const result = await db.run(`
        INSERT INTO comments (user_id, feedback_id, parent_id, content)
        VALUES (?, ?, ?, ?)
      `, [
        req.user.id,
        feedbackId,
        value.parent_id || null,
        value.content
      ]);

      const comment = await db.get(`
        SELECT 
          c.*,
          u.username, u.avatar_url, u.display_name
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.id = ?
      `, [result.id]);

      res.status(201).json(comment);
    } catch (error) {
      console.error('添加评论失败:', error);
      res.status(500).json({ error: '服务器错误' });
    }
  });

  return router;
}

module.exports = createFeedbackRoutes;
