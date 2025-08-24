const Database = require('../database');
const config = require('../config');

async function migrate() {
  const db = new Database(config.database.filename);
  
  try {
    console.log('🚀 开始数据库迁移...');
    await db.connect();
    await db.initTables();
    await db.seedData();
    console.log('✅ 数据库迁移完成');
  } catch (error) {
    console.error('❌ 数据库迁移失败:', error);
  } finally {
    await db.close();
    process.exit(0);
  }
}

if (require.main === module) {
  migrate();
}

module.exports = migrate;
