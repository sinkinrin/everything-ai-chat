const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

class Database {
  constructor(filename) {
    this.filename = filename;
    this.db = null;
  }

  // 连接数据库
  async connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.filename, (err) => {
        if (err) {
          console.error('数据库连接失败:', err.message);
          reject(err);
        } else {
          console.log('✅ 数据库连接成功:', this.filename);
          this.db.run('PRAGMA foreign_keys = ON'); // 启用外键约束
          resolve();
        }
      });
    });
  }

  // 初始化数据库表
  async initTables() {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    return new Promise((resolve, reject) => {
      this.db.exec(schema, (err) => {
        if (err) {
          console.error('数据库表初始化失败:', err.message);
          reject(err);
        } else {
          console.log('✅ 数据库表初始化成功');
          resolve();
        }
      });
    });
  }

  // 插入初始数据
  async seedData() {
    const categories = [
      { name: 'UI/UX', description: '用户界面和用户体验相关问题', color: '#e74c3c' },
      { name: '性能', description: '性能优化相关问题', color: '#f39c12' },
      { name: '搜索功能', description: '搜索相关功能问题', color: '#3498db' },
      { name: 'AI对话', description: 'AI对话功能相关问题', color: '#9b59b6' },
      { name: '系统兼容', description: '系统兼容性问题', color: '#1abc9c' },
      { name: '其他', description: '其他类型问题', color: '#95a5a6' }
    ];

    for (const category of categories) {
      await this.run(
        'INSERT OR IGNORE INTO feedback_categories (name, description, color) VALUES (?, ?, ?)',
        [category.name, category.description, category.color]
      );
    }

    console.log('✅ 初始数据插入成功');
  }

  // 执行查询
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  // 查询单条记录
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // 查询多条记录
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // 关闭数据库连接
  close() {
    return new Promise((resolve) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('数据库关闭失败:', err.message);
          } else {
            console.log('✅ 数据库连接已关闭');
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = Database;
