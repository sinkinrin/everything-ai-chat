const express = require('express');
const Joi = require('joi');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// 验证模式
const versionSchema = Joi.object({
  version: Joi.string().min(1).max(50).required(),
  platform: Joi.string().valid('windows', 'mac', 'linux').required(),
  architecture: Joi.string().valid('x64', 'x86', 'arm64').required(),
  download_url: Joi.string().uri().max(500).required(),
  file_size: Joi.number().integer().positive().optional(),
  sha256: Joi.string().length(64).optional(),
  release_notes: Joi.string().max(2000).optional(),
  is_stable: Joi.boolean().default(true),
  is_latest: Joi.boolean().default(false)
});

// 创建下载路由
function createDownloadRoutes(db) {
  
  // 获取最新版本信息
  router.get('/latest', async (req, res) => {
    try {
      const { platform, arch } = req.query;
      
      let sql = `
        SELECT * FROM software_versions 
        WHERE is_latest = true
      `;
      const params = [];

      if (platform) {
        sql += ' AND platform = ?';
        params.push(platform);
      }
      
      if (arch) {
        sql += ' AND architecture = ?';
        params.push(arch);
      }

      sql += ' ORDER BY created_at DESC';

      const versions = await db.all(sql, params);
      res.json(versions);
    } catch (error) {
      console.error('获取最新版本失败:', error);
      res.status(500).json({ error: '服务器错误' });
    }
  });

  // 获取所有版本
  router.get('/versions', async (req, res) => {
    try {
      const { platform, stable_only = 'true', limit = 20, page = 1 } = req.query;
      
      let sql = 'SELECT * FROM software_versions WHERE 1=1';
      const params = [];

      if (platform) {
        sql += ' AND platform = ?';
        params.push(platform);
      }

      if (stable_only === 'true') {
        sql += ' AND is_stable = true';
      }

      sql += ' ORDER BY created_at DESC';

      // 分页
      const offset = (parseInt(page) - 1) * parseInt(limit);
      sql += ' LIMIT ? OFFSET ?';
      params.push(parseInt(limit), offset);

      const versions = await db.all(sql, params);

      // 获取总数
      let countSql = 'SELECT COUNT(*) as total FROM software_versions WHERE 1=1';
      const countParams = [];
      if (platform) {
        countSql += ' AND platform = ?';
        countParams.push(platform);
      }
      if (stable_only === 'true') {
        countSql += ' AND is_stable = true';
      }

      const { total } = await db.get(countSql, countParams);

      res.json({
        versions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('获取版本列表失败:', error);
      res.status(500).json({ error: '服务器错误' });
    }
  });

  // 记录下载统计
  router.post('/track/:versionId', async (req, res) => {
    try {
      const versionId = req.params.versionId;
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('User-Agent');
      
      // 检查版本是否存在
      const version = await db.get('SELECT id FROM software_versions WHERE id = ?', [versionId]);
      if (!version) {
        return res.status(404).json({ error: '版本不存在' });
      }

      // 记录下载
      await db.run(`
        INSERT INTO download_stats (version_id, ip_address, user_agent)
        VALUES (?, ?, ?)
      `, [versionId, ipAddress, userAgent]);

      res.json({ message: '下载记录成功' });
    } catch (error) {
      console.error('记录下载统计失败:', error);
      res.status(500).json({ error: '服务器错误' });
    }
  });

  // 获取下载统计
  router.get('/stats', async (req, res) => {
    try {
      const { days = 30 } = req.query;
      
      // 总下载量
      const totalDownloads = await db.get(`
        SELECT COUNT(*) as total 
        FROM download_stats 
        WHERE downloaded_at >= datetime('now', '-${parseInt(days)} days')
      `);

      // 按平台统计
      const platformStats = await db.all(`
        SELECT 
          sv.platform,
          COUNT(*) as downloads
        FROM download_stats ds
        LEFT JOIN software_versions sv ON ds.version_id = sv.id
        WHERE ds.downloaded_at >= datetime('now', '-${parseInt(days)} days')
        GROUP BY sv.platform
        ORDER BY downloads DESC
      `);

      // 按版本统计
      const versionStats = await db.all(`
        SELECT 
          sv.version,
          sv.platform,
          COUNT(*) as downloads
        FROM download_stats ds
        LEFT JOIN software_versions sv ON ds.version_id = sv.id
        WHERE ds.downloaded_at >= datetime('now', '-${parseInt(days)} days')
        GROUP BY sv.version, sv.platform
        ORDER BY downloads DESC
        LIMIT 10
      `);

      // 每日下载量
      const dailyStats = await db.all(`
        SELECT 
          date(downloaded_at) as date,
          COUNT(*) as downloads
        FROM download_stats 
        WHERE downloaded_at >= datetime('now', '-${parseInt(days)} days')
        GROUP BY date(downloaded_at)
        ORDER BY date DESC
      `);

      res.json({
        period_days: parseInt(days),
        total_downloads: totalDownloads.total,
        platform_stats: platformStats,
        version_stats: versionStats,
        daily_stats: dailyStats
      });
    } catch (error) {
      console.error('获取下载统计失败:', error);
      res.status(500).json({ error: '服务器错误' });
    }
  });

  // 管理员：添加新版本
  router.post('/versions', requireAdmin, async (req, res) => {
    try {
      const { error, value } = versionSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // 如果设置为最新版本，先取消其他版本的最新标记
      if (value.is_latest) {
        await db.run(
          'UPDATE software_versions SET is_latest = false WHERE platform = ? AND architecture = ?',
          [value.platform, value.architecture]
        );
      }

      const result = await db.run(`
        INSERT INTO software_versions (
          version, platform, architecture, download_url, 
          file_size, sha256, release_notes, is_stable, is_latest
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        value.version,
        value.platform,
        value.architecture,
        value.download_url,
        value.file_size,
        value.sha256,
        value.release_notes,
        value.is_stable,
        value.is_latest
      ]);

      const newVersion = await db.get(
        'SELECT * FROM software_versions WHERE id = ?',
        [result.id]
      );

      res.status(201).json(newVersion);
    } catch (error) {
      console.error('添加版本失败:', error);
      res.status(500).json({ error: '服务器错误' });
    }
  });

  // 管理员：更新版本信息
  router.put('/versions/:id', requireAdmin, async (req, res) => {
    try {
      const versionId = req.params.id;
      const { error, value } = versionSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // 检查版本是否存在
      const existingVersion = await db.get(
        'SELECT * FROM software_versions WHERE id = ?',
        [versionId]
      );
      
      if (!existingVersion) {
        return res.status(404).json({ error: '版本不存在' });
      }

      // 如果设置为最新版本，先取消其他版本的最新标记
      if (value.is_latest) {
        await db.run(
          'UPDATE software_versions SET is_latest = false WHERE platform = ? AND architecture = ? AND id != ?',
          [value.platform, value.architecture, versionId]
        );
      }

      await db.run(`
        UPDATE software_versions SET
          version = ?, platform = ?, architecture = ?, download_url = ?,
          file_size = ?, sha256 = ?, release_notes = ?, is_stable = ?, is_latest = ?
        WHERE id = ?
      `, [
        value.version,
        value.platform,
        value.architecture,
        value.download_url,
        value.file_size,
        value.sha256,
        value.release_notes,
        value.is_stable,
        value.is_latest,
        versionId
      ]);

      const updatedVersion = await db.get(
        'SELECT * FROM software_versions WHERE id = ?',
        [versionId]
      );

      res.json(updatedVersion);
    } catch (error) {
      console.error('更新版本失败:', error);
      res.status(500).json({ error: '服务器错误' });
    }
  });

  return router;
}

module.exports = createDownloadRoutes;
