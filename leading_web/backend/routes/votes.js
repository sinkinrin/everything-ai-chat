const express = require('express');
const Joi = require('joi');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// 验证模式
const voteSchema = Joi.object({
  feedback_id: Joi.number().integer().positive().required(),
  vote_type: Joi.string().valid('up', 'down').required()
});

// 创建投票路由
function createVoteRoutes(db) {
  
  // 投票或更新投票
  router.post('/', requireAuth, async (req, res) => {
    try {
      const { error, value } = voteSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { feedback_id, vote_type } = value;
      const userId = req.user.id;

      // 检查反馈是否存在
      const feedback = await db.get('SELECT id FROM feedbacks WHERE id = ?', [feedback_id]);
      if (!feedback) {
        return res.status(404).json({ error: '反馈不存在' });
      }

      // 检查用户是否已投票
      const existingVote = await db.get(
        'SELECT * FROM votes WHERE user_id = ? AND feedback_id = ?',
        [userId, feedback_id]
      );

      let responseData = {};

      if (existingVote) {
        if (existingVote.vote_type === vote_type) {
          // 取消投票
          await db.run(
            'DELETE FROM votes WHERE user_id = ? AND feedback_id = ?',
            [userId, feedback_id]
          );
          
          responseData = {
            action: 'cancelled',
            message: '投票已取消'
          };
        } else {
          // 更新投票
          await db.run(
            'UPDATE votes SET vote_type = ? WHERE user_id = ? AND feedback_id = ?',
            [vote_type, userId, feedback_id]
          );
          
          responseData = {
            action: 'updated',
            vote_type,
            message: '投票已更新'
          };
        }
      } else {
        // 新增投票
        await db.run(
          'INSERT INTO votes (user_id, feedback_id, vote_type) VALUES (?, ?, ?)',
          [userId, feedback_id, vote_type]
        );
        
        responseData = {
          action: 'created',
          vote_type,
          message: '投票成功'
        };
      }

      // 获取更新后的投票数
      const upVotes = await db.get(
        'SELECT COUNT(*) as count FROM votes WHERE feedback_id = ? AND vote_type = "up"',
        [feedback_id]
      );

      const downVotes = await db.get(
        'SELECT COUNT(*) as count FROM votes WHERE feedback_id = ? AND vote_type = "down"',
        [feedback_id]
      );

      // 发送完整的响应数据
      res.json({
        ...responseData,
        vote_details: {
          up_votes: upVotes.count,
          down_votes: downVotes.count,
          total_score: upVotes.count - downVotes.count
        }
      });

    } catch (error) {
      console.error('投票失败:', error);
      res.status(500).json({ error: '服务器错误' });
    }
  });

  // 获取用户的投票状态
  router.get('/status/:feedbackId', requireAuth, async (req, res) => {
    try {
      const feedbackId = req.params.feedbackId;
      const userId = req.user.id;

      const vote = await db.get(
        'SELECT vote_type FROM votes WHERE user_id = ? AND feedback_id = ?',
        [userId, feedbackId]
      );

      res.json({
        vote_type: vote ? vote.vote_type : null
      });
    } catch (error) {
      console.error('获取投票状态失败:', error);
      res.status(500).json({ error: '服务器错误' });
    }
  });

  // 获取反馈的投票详情
  router.get('/details/:feedbackId', async (req, res) => {
    try {
      const feedbackId = req.params.feedbackId;

      const upVotes = await db.get(
        'SELECT COUNT(*) as count FROM votes WHERE feedback_id = ? AND vote_type = "up"',
        [feedbackId]
      );

      const downVotes = await db.get(
        'SELECT COUNT(*) as count FROM votes WHERE feedback_id = ? AND vote_type = "down"',
        [feedbackId]
      );

      res.json({
        up_votes: upVotes.count,
        down_votes: downVotes.count,
        total_score: upVotes.count - downVotes.count
      });
    } catch (error) {
      console.error('获取投票详情失败:', error);
      res.status(500).json({ error: '服务器错误' });
    }
  });

  return router;
}

module.exports = createVoteRoutes;
