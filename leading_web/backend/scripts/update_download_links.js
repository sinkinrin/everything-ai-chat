const Database = require('../database');
const config = require('../config');

async function updateDownloadLinks() {
  const db = new Database(config.database.filename);
  
  try {
    console.log('🚀 开始查询当前Windows版本配置...');
    await db.connect();
    
    // 查询现有的Windows版本
    const windowsVersions = await db.all(
      "SELECT * FROM software_versions WHERE platform = 'windows'"
    );
    
    console.log('📋 当前Windows版本配置:');
    console.table(windowsVersions);
    
    if (windowsVersions.length === 0) {
      console.log('📝 没有找到Windows版本配置，创建新的版本记录...');
      
      // 创建新的Windows版本记录，使用GitHub releases链接
      const result = await db.run(`
        INSERT INTO software_versions (
          version, platform, architecture, download_url, 
          file_size, release_notes, is_stable, is_latest
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        '1.1.0',
        'windows',
        'x64',
        'https://github.com/MaskerPRC/everything-ai-chat/releases/latest',
        null, // file_size - 将在GitHub上自动处理
        '最新版本，从GitHub官方仓库下载',
        true,
        true
      ]);
      
      console.log('✅ 新版本记录创建成功，ID:', result.id);
    } else {
      console.log('🔄 更新现有Windows版本的下载链接...');
      
      // 更新所有Windows版本的下载链接
      for (const version of windowsVersions) {
        await db.run(`
          UPDATE software_versions 
          SET download_url = ?, release_notes = ? 
          WHERE id = ?
        `, [
          'https://github.com/MaskerPRC/everything-ai-chat/releases/latest',
          '从GitHub官方仓库下载最新版本',
          version.id
        ]);
        
        console.log(`✅ 更新版本 ${version.version} 下载链接成功`);
      }
    }
    
    // 查询更新后的结果
    const updatedVersions = await db.all(
      "SELECT * FROM software_versions WHERE platform = 'windows'"
    );
    
    console.log('📋 更新后的Windows版本配置:');
    console.table(updatedVersions);
    
    console.log('✅ 下载链接更新完成');
  } catch (error) {
    console.error('❌ 更新失败:', error);
  } finally {
    await db.close();
    process.exit(0);
  }
}

if (require.main === module) {
  updateDownloadLinks();
}

module.exports = updateDownloadLinks;
