const http = require('http');
const querystring = require('querystring');
const path = require('path');
const fs = require('fs');

class EverythingSearch {
  constructor(host = 'localhost', port = 80) {
    this.host = host;
    this.port = port;
    this.baseUrl = `http://${host}:${port}`;
  }

  /**
   * 测试Everything HTTP服务是否可用
   */
  async testConnection() {
    return new Promise((resolve) => {
      const req = http.request({
        hostname: this.host,
        port: this.port,
        path: '/',
        method: 'GET',
        timeout: 5000
      }, (res) => {
        resolve(res.statusCode === 200);
      });

      req.on('error', () => {
        resolve(false);
      });

      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });

      req.end();
    });
  }

  /**
   * 执行搜索
   */
  async search(query, options = {}) {
    const searchParams = {
      search: query,
      json: 1,
      count: options.count || 1000,
      offset: options.offset || 0,
      sort: options.sort || 'name'
    };

    if (options.path) {
      searchParams.path = 1;
    }
    if (options.size) {
      searchParams.size = 1;
    }
    if (options.date_modified) {
      searchParams.date_modified = 1;
    }
    if (options.date_created) {
      searchParams.date_created = 1;
    }

    const queryStr = querystring.stringify(searchParams);
    const url = `${this.baseUrl}/?${queryStr}`;

    return new Promise((resolve, reject) => {
      const req = http.request(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            if (res.statusCode !== 200) {
              throw new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`);
            }

            const result = JSON.parse(data);
            const formattedResults = this.formatResults(result.results || []);
            
            resolve({
              success: true,
              results: formattedResults,
              totalResults: result.totalResults || 0
            });
          } catch (error) {
            reject(new Error(`解析Everything响应失败: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Everything连接失败: ${error.message}`));
      });

      req.setTimeout(30000, () => {
        req.destroy();
        reject(new Error('搜索请求超时'));
      });

      req.end();
    });
  }

  /**
   * 格式化搜索结果
   */
  formatResults(results) {
    return results.map(item => {
      const filePath = item.path || '';
      const fileName = path.basename(filePath);
      const fileDir = path.dirname(filePath);
      const fileExt = path.extname(filePath);

      // 获取文件信息
      let fileSize = '';
      let modifiedDate = '';

      try {
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          fileSize = stats.size.toString();
          modifiedDate = stats.mtime.toISOString();
        }
      } catch (error) {
        // 忽略文件状态获取错误
      }

      return {
        name: fileName,
        path: filePath,
        directory: fileDir,
        extension: fileExt.replace('.', '').toUpperCase(),
        size: item.size || fileSize,
        modified: item.date_modified || modifiedDate,
        created: item.date_created || '',
        type: this.getFileType(fileExt)
      };
    });
  }

  /**
   * 根据扩展名获取文件类型
   */
  getFileType(extension) {
    const ext = extension.toLowerCase();
    
    const typeMap = {
      // 文档
      '.pdf': 'PDF',
      '.doc': 'Word',
      '.docx': 'Word',
      '.xls': 'Excel',
      '.xlsx': 'Excel',
      '.ppt': 'PowerPoint',
      '.pptx': 'PowerPoint',
      '.txt': 'Text',
      '.rtf': 'RTF',

      // 图片
      '.jpg': 'Image',
      '.jpeg': 'Image',
      '.png': 'Image',
      '.gif': 'Image',
      '.bmp': 'Image',
      '.svg': 'Image',
      '.webp': 'Image',

      // 视频
      '.mp4': 'Video',
      '.avi': 'Video',
      '.mkv': 'Video',
      '.mov': 'Video',
      '.wmv': 'Video',
      '.flv': 'Video',

      // 音频
      '.mp3': 'Audio',
      '.wav': 'Audio',
      '.flac': 'Audio',
      '.aac': 'Audio',
      '.ogg': 'Audio',

      // 压缩
      '.zip': 'Archive',
      '.rar': 'Archive',
      '.7z': 'Archive',
      '.tar': 'Archive',
      '.gz': 'Archive',

      // 代码
      '.js': 'Code',
      '.ts': 'Code',
      '.html': 'Code',
      '.css': 'Code',
      '.py': 'Code',
      '.java': 'Code',
      '.cpp': 'Code',
      '.c': 'Code',
      '.php': 'Code',
      '.go': 'Code',
      '.rs': 'Code',

      // 可执行文件
      '.exe': 'Program',
      '.msi': 'Installer',
      '.deb': 'Package',
      '.rpm': 'Package'
    };

    return typeMap[ext] || 'File';
  }

  /**
   * 搜索建议优化查询
   */
  optimizeQuery(naturalLanguage) {
    // 简单的规则转换，如果没有OpenAI的话
    let query = naturalLanguage;

    // 时间相关转换
    if (query.includes('今天') || query.includes('today')) {
      query = query.replace(/(今天|today)/gi, 'dm:today');
    }
    if (query.includes('昨天') || query.includes('yesterday')) {
      query = query.replace(/(昨天|yesterday)/gi, 'dm:yesterday');
    }
    if (query.includes('本周') || query.includes('this week')) {
      query = query.replace(/(本周|this week)/gi, 'dm:thisweek');
    }

    // 文件类型转换
    const typeReplacements = {
      '图片': '*.jpg;*.png;*.gif;*.bmp;*.jpeg',
      '照片': '*.jpg;*.png;*.jpeg',
      '文档': '*.doc;*.docx;*.pdf;*.txt',
      '视频': '*.mp4;*.avi;*.mkv;*.mov',
      '音频': '*.mp3;*.wav;*.flac',
      '音乐': '*.mp3;*.wav;*.flac',
      'PDF': '*.pdf',
      '表格': '*.xls;*.xlsx',
      '压缩包': '*.zip;*.rar;*.7z'
    };

    Object.entries(typeReplacements).forEach(([key, value]) => {
      if (query.includes(key)) {
        query = query.replace(new RegExp(key, 'gi'), value);
      }
    });

    // 大小转换
    if (query.includes('大于') || query.includes('>')) {
      query = query.replace(/大于\s*(\d+)\s*(KB|MB|GB)/gi, 'size:>$1$2');
    }
    if (query.includes('小于') || query.includes('<')) {
      query = query.replace(/小于\s*(\d+)\s*(KB|MB|GB)/gi, 'size:<$1$2');
    }

    return query;
  }
}

module.exports = EverythingSearch; 