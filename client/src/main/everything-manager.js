const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const os = require('os');
const net = require('net');
const ini = require('ini');

class EverythingManager {
  constructor() {
    this.everythingPaths = [];
    this.configPath = '';
    this.isWindows = os.platform() === 'win32';
    this.credentials = null; // 存储生成的用户名密码
  }

  /**
   * 一键连接Everything服务
   * @param {Object} options - 连接选项
   * @param {string} options.portMode - 端口模式 ('auto' 或 'fixed')
   * @param {number} options.fixedPort - 固定端口号（当portMode为'fixed'时使用）
   */
  async autoConnect(options = {}) {
    try {
      console.log('🔍 开始一键连接Everything服务...');
      
      // 步骤1: 搜索Everything安装位置
      console.log('📂 步骤1: 搜索Everything安装位置...');
      const installPath = await this.findEverythingInstallation();
      if (!installPath) {
        throw new Error('未找到Everything安装路径，请确保已安装Everything软件');
      }
      console.log('✅ 找到Everything安装路径:', installPath);

      // 步骤2: 检查并关闭现有进程
      console.log('🔄 步骤2: 检查并关闭现有Everything进程...');
      await this.stopEverythingProcess();
      console.log('✅ Everything进程已停止');

      // 步骤3: 找到可用端口
      console.log('🌐 步骤3: 寻找可用端口...');
      const availablePort = await this.findAvailablePort(options);
      console.log('✅ 找到可用端口:', availablePort);

      // 步骤4: 修改配置文件
      console.log('⚙️ 步骤4: 配置Everything HTTP服务...');
      await this.configureEverythingHTTP(installPath, availablePort);
      console.log('✅ Everything配置已更新');

      // 步骤5: 启动Everything
      console.log('🚀 步骤5: 启动Everything...');
      await this.startEverything(installPath);
      console.log('✅ Everything已启动');

      // 步骤6: 等待服务启动并验证连接
      console.log('🔌 步骤6: 验证HTTP服务连接...');
      const connected = await this.waitForService(availablePort);
      if (!connected) {
        throw new Error('Everything HTTP服务启动失败，请检查配置');
      }
      console.log('✅ Everything HTTP服务连接成功');

      return {
        success: true,
        port: availablePort,
        installPath: installPath,
        credentials: this.credentials,
        message: `Everything HTTP服务已成功启动在端口 ${availablePort}`
      };

    } catch (error) {
      console.error('❌ 一键连接失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 搜索Everything安装位置
   */
  async findEverythingInstallation() {
    console.log('🔍 开始搜索Everything安装位置...');
    
    // 搜索策略：
    // 1. 通过注册表搜索
    // 2. 搜索常见安装位置
    // 3. 搜索桌面快捷方式
    
    try {
      // 策略1: 通过注册表搜索
      console.log('📋 策略1: 搜索注册表...');
      let regPath = await this.searchRegistry();
      if (regPath) {
        console.log('✅ 注册表中找到Everything路径:', regPath);
        return regPath;
      }

      // 策略2: 搜索常见安装位置
      console.log('📁 策略2: 搜索常见安装位置...');
      const commonPaths = this.getCommonInstallPaths();
      for (const basePath of commonPaths) {
        const foundPath = await this.searchInDirectory(basePath, 'Everything.exe');
        if (foundPath) {
          console.log('✅ 常见路径中找到Everything:', foundPath);
          return path.dirname(foundPath);
        }
      }

      // 策略3: 搜索桌面快捷方式
      console.log('🖥️ 策略3: 搜索桌面快捷方式...');
      const shortcutPath = await this.searchDesktopShortcuts();
      if (shortcutPath) {
        console.log('✅ 桌面快捷方式中找到Everything路径:', shortcutPath);
        return shortcutPath;
      }

      console.log('❌ 所有自动搜索策略都失败了');
      return null;

    } catch (error) {
      console.error('搜索Everything安装位置时出错:', error);
      return null;
    }
  }

  /**
   * 通过注册表搜索Everything
   */
  async searchRegistry() {
    if (!this.isWindows) return null;

    return new Promise((resolve) => {
      // 搜索注册表中的Everything安装信息
      const registryKeys = [
        'HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Everything',
        'HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Everything',
        'HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Everything'
      ];

      let searchIndex = 0;
      
      const searchNext = () => {
        if (searchIndex >= registryKeys.length) {
          resolve(null);
          return;
        }

        const key = registryKeys[searchIndex++];
        exec(`reg query "${key}" /v InstallLocation 2>nul`, (error, stdout) => {
          if (!error && stdout) {
            const match = stdout.match(/InstallLocation\s+REG_SZ\s+(.+)/);
            if (match && match[1]) {
              const installPath = match[1].trim();
              if (fs.existsSync(path.join(installPath, 'Everything.exe'))) {
                resolve(installPath);
                return;
              }
            }
          }
          searchNext();
        });
      };

      searchNext();
    });
  }

  /**
   * 获取常见安装路径
   */
  getCommonInstallPaths() {
    const paths = [];
    
    if (this.isWindows) {
      // Windows常见安装路径
      const programFiles = [
        process.env.ProgramFiles || 'C:\\Program Files',
        process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)',
        'C:\\Program Files',
        'C:\\Program Files (x86)'
      ];

      for (const programFile of programFiles) {
        paths.push(
          path.join(programFile, 'Everything'),
          path.join(programFile, 'Everything 1.4'),
          path.join(programFile, 'voidtools', 'Everything'),
          programFile // 直接在Program Files下搜索
        );
      }

      // 用户目录下的便携版
      const userProfile = os.homedir();
      paths.push(
        path.join(userProfile, 'Desktop', 'Everything'),
        path.join(userProfile, 'Downloads', 'Everything'),
        path.join(userProfile, 'Documents', 'Everything'),
        path.join('C:', 'Everything'),
        path.join('D:', 'Everything'),
        path.join('E:', 'Everything')
      );
    }

    return paths;
  }

  /**
   * 在目录中搜索文件
   */
  async searchInDirectory(directory, filename) {
    if (!fs.existsSync(directory)) {
      return null;
    }

    try {
      // 直接检查目录下是否有目标文件
      const directPath = path.join(directory, filename);
      if (fs.existsSync(directPath)) {
        return directPath;
      }

      // 递归搜索子目录（限制深度为3层）
      return await this.recursiveSearch(directory, filename, 3);
    } catch (error) {
      console.log(`搜索目录 ${directory} 时出错:`, error.message);
      return null;
    }
  }

  /**
   * 递归搜索文件
   */
  async recursiveSearch(directory, filename, maxDepth) {
    if (maxDepth <= 0) return null;

    try {
      const items = fs.readdirSync(directory);
      
      for (const item of items) {
        const fullPath = path.join(directory, item);
        
        try {
          const stats = fs.statSync(fullPath);
          
          if (stats.isFile() && item.toLowerCase() === filename.toLowerCase()) {
            return fullPath;
          }
          
          if (stats.isDirectory()) {
            // 跳过系统目录和一些明显不相关的目录
            const skipDirs = ['windows', 'system32', 'syswow64', 'temp', 'tmp', '$recycle.bin', 'recycler'];
            if (skipDirs.includes(item.toLowerCase())) {
              continue;
            }
            
            const found = await this.recursiveSearch(fullPath, filename, maxDepth - 1);
            if (found) return found;
          }
        } catch (error) {
          // 跳过无法访问的文件/目录
          continue;
        }
      }
    } catch (error) {
      console.log(`读取目录 ${directory} 时出错:`, error.message);
    }

    return null;
  }

  /**
   * 搜索桌面快捷方式
   */
  async searchDesktopShortcuts() {
    if (!this.isWindows) return null;

    try {
      const desktopPaths = [
        path.join(os.homedir(), 'Desktop'),
        path.join(os.homedir(), '桌面'),
        'C:\\Users\\Public\\Desktop'
      ];

      for (const desktopPath of desktopPaths) {
        if (!fs.existsSync(desktopPath)) continue;

        const files = fs.readdirSync(desktopPath);
        for (const file of files) {
          if (file.toLowerCase().includes('everything') && file.endsWith('.lnk')) {
            // 解析快捷方式获取目标路径
            const targetPath = await this.parseShortcut(path.join(desktopPath, file));
            if (targetPath && fs.existsSync(targetPath)) {
              return path.dirname(targetPath);
            }
          }
        }
      }
    } catch (error) {
      console.log('搜索桌面快捷方式时出错:', error);
    }

    return null;
  }

  /**
   * 解析Windows快捷方式(.lnk文件)
   */
  async parseShortcut(shortcutPath) {
    return new Promise((resolve) => {
      // 使用PowerShell读取快捷方式目标
      const command = `powershell "(New-Object -ComObject WScript.Shell).CreateShortcut('${shortcutPath}').TargetPath"`;
      
      exec(command, (error, stdout) => {
        if (error) {
          resolve(null);
          return;
        }

        const targetPath = stdout.trim();
        if (targetPath && fs.existsSync(targetPath)) {
          resolve(targetPath);
        } else {
          resolve(null);
        }
      });
    });
  }

  /**
   * 停止Everything进程（使用多种方法确保成功）
   */
  async stopEverythingProcess() {
    return new Promise((resolve) => {
      if (!this.isWindows) {
        resolve();
        return;
      }

      console.log('🔍 正在查找Everything进程...');
      this.findEverythingProcesses().then(async (processes) => {
        if (processes.length === 0) {
          console.log('✅ 未找到Everything进程');
          resolve();
          return;
        }

        console.log(`🎯 找到 ${processes.length} 个Everything进程:`, processes.map(p => `PID:${p.pid}`));
        
        // 使用多种方法依次尝试关闭进程
        await this.attemptGracefulClose();
        await this.sleep(2000);
        
        await this.attemptForceClose();
        await this.sleep(2000);
        
        await this.attemptAdvancedTermination(processes);
        await this.sleep(2000);
        
        // 最终验证
        this.waitForProcessToStop(resolve, 15); // 延长等待时间
      });
    });
  }

  /**
   * 查找所有Everything进程
   */
  async findEverythingProcesses() {
    return new Promise((resolve) => {
      exec('wmic process where "name=\'Everything.exe\'" get ProcessId,CommandLine /format:csv', (error, stdout) => {
        if (error) {
          console.log('wmic查询失败，使用tasklist...');
          // 备用方法
          exec('tasklist /FI "IMAGENAME eq Everything.exe" /FO CSV', (err, output) => {
            if (err || !output.includes('Everything.exe')) {
              resolve([]);
              return;
            }
            const lines = output.split('\n');
            const processes = [];
            for (let line of lines) {
              if (line.includes('Everything.exe')) {
                const parts = line.split(',');
                if (parts.length >= 2) {
                  const pid = parts[1].replace(/"/g, '').trim();
                  if (pid && !isNaN(pid)) {
                    processes.push({ pid: parseInt(pid) });
                  }
                }
              }
            }
            resolve(processes);
          });
        } else {
          const lines = stdout.split('\n');
          const processes = [];
          for (let line of lines) {
            if (line.includes('Everything.exe')) {
              const parts = line.split(',');
              if (parts.length >= 3) {
                const pid = parts[2].trim();
                if (pid && !isNaN(pid)) {
                  processes.push({ pid: parseInt(pid) });
                }
              }
            }
          }
          resolve(processes);
        }
      });
    });
  }

  /**
   * 方法1: 尝试优雅关闭（发送关闭消息）
   */
  async attemptGracefulClose() {
    console.log('🤝 方法1: 尝试优雅关闭...');
    
    return new Promise((resolve) => {
      // 方法1a: 使用taskkill优雅关闭
      exec('taskkill /IM Everything.exe', (error) => {
        if (error) {
          console.log('❌ taskkill优雅关闭失败:', error.message);
        } else {
          console.log('✅ taskkill优雅关闭命令已发送');
        }
        
        // 方法1b: 使用PowerShell发送关闭消息
        const psCommand = `Get-Process -Name "Everything" -ErrorAction SilentlyContinue | ForEach-Object { $_.CloseMainWindow() }`;
        exec(`powershell -Command "${psCommand}"`, (psError) => {
          if (psError) {
            console.log('❌ PowerShell关闭窗口失败:', psError.message);
          } else {
            console.log('✅ PowerShell关闭窗口命令已发送');
          }
          resolve();
        });
      });
    });
  }

  /**
   * 方法2: 强制终止
   */
  async attemptForceClose() {
    console.log('💪 方法2: 强制终止...');
    
    return new Promise((resolve) => {
      // 方法2a: taskkill强制终止
      exec('taskkill /F /IM Everything.exe', (error) => {
        if (error) {
          console.log('❌ taskkill强制终止失败:', error.message);
        } else {
          console.log('✅ taskkill强制终止命令已发送');
        }
        
        // 方法2b: wmic终止
        exec('wmic process where "name=\'Everything.exe\'" delete', (wmicError) => {
          if (wmicError) {
            console.log('❌ wmic终止失败:', wmicError.message);
          } else {
            console.log('✅ wmic终止命令已发送');
          }
          resolve();
        });
      });
    });
  }

  /**
   * 方法3: 高级终止方法（按PID逐个击破）
   */
  async attemptAdvancedTermination(processes) {
    console.log('🔥 方法3: 高级终止方法...');
    
    for (const process of processes) {
      console.log(`🎯 正在终止PID ${process.pid}...`);
      
      // 方法3a: 按PID强制终止
      await new Promise((resolve) => {
        exec(`taskkill /F /PID ${process.pid}`, (error) => {
          if (error) {
            console.log(`❌ 按PID ${process.pid} taskkill失败:`, error.message);
          } else {
            console.log(`✅ 按PID ${process.pid} taskkill成功`);
          }
          resolve();
        });
      });

      // 方法3b: PowerShell按PID终止
      await new Promise((resolve) => {
        const psKillCommand = `Stop-Process -Id ${process.pid} -Force -ErrorAction SilentlyContinue`;
        exec(`powershell -Command "${psKillCommand}"`, (error) => {
          if (error) {
            console.log(`❌ PowerShell终止PID ${process.pid}失败:`, error.message);
          } else {
            console.log(`✅ PowerShell终止PID ${process.pid}成功`);
          }
          resolve();
        });
      });

      // 方法3c: wmic按PID终止
      await new Promise((resolve) => {
        exec(`wmic process where "ProcessId=${process.pid}" delete`, (error) => {
          if (error) {
            console.log(`❌ wmic终止PID ${process.pid}失败:`, error.message);
          } else {
            console.log(`✅ wmic终止PID ${process.pid}成功`);
          }
          resolve();
        });
      });

      await this.sleep(500); // 每个进程之间等待500ms
    }
  }

  /**
   * 等待进程完全停止（增强版检测）
   */
  async waitForProcessToStop(callback, maxRetries = 15) {
    let retries = 0;
    
    const checkProcess = () => {
      // 使用双重检测确保进程真正停止
      exec('tasklist /FI "IMAGENAME eq Everything.exe" /FO CSV', (error, stdout) => {
        const tasklistResult = error || !stdout.includes('Everything.exe');
        
        // 备用检测方法
        exec('wmic process where "name=\'Everything.exe\'" get ProcessId /format:csv', (wmicError, wmicOutput) => {
          const wmicResult = wmicError || !wmicOutput.includes('Everything.exe');
          
          if (tasklistResult && wmicResult) {
            console.log('✅ Everything进程已完全停止（双重验证通过）');
            setTimeout(callback, 2000); // 额外等待2秒确保完全释放文件句柄
            return;
          }

          retries++;
          if (retries >= maxRetries) {
            console.warn(`⚠️ 等待进程停止超时（${maxRetries}次重试），强制继续执行...`);
            console.log('💀 最后尝试: 强制清理所有相关进程...');
            
            // 最后的强制清理
            exec('taskkill /F /IM Everything.exe & wmic process where "name=\'Everything.exe\'" delete', () => {
              setTimeout(callback, 3000); // 更长的等待时间
            });
            return;
          }

          console.log(`⏳ 等待进程停止... (${retries}/${maxRetries})`);
          
          // 在重试间隔中再次尝试强制终止
          if (retries % 3 === 0) {
            console.log('🔄 重试间隔：再次尝试强制终止...');
            exec('taskkill /F /IM Everything.exe', () => {
              setTimeout(checkProcess, 1500);
            });
          } else {
            setTimeout(checkProcess, 1500);
          }
        });
      });
    };

    checkProcess();
  }

  /**
   * 寻找可用端口
   * @param {Object} options - 端口查找选项
   * @param {string} options.portMode - 端口模式 ('auto' 或 'fixed')
   * @param {number} options.fixedPort - 固定端口号（当portMode为'fixed'时使用）
   * @param {number} startPort - 起始端口（仅在auto模式下使用）
   */
  async findAvailablePort(options = {}, startPort = 8080) {
    const { portMode = 'auto', fixedPort } = options;
    
    // 如果是固定端口模式
    if (portMode === 'fixed' && fixedPort) {
      console.log(`🔧 使用固定端口模式: ${fixedPort}`);
      
      // 验证端口范围
      if (fixedPort < 1 || fixedPort > 65535) {
        throw new Error(`固定端口号无效: ${fixedPort}。端口范围必须在1-65535之间`);
      }
      
      // 检查固定端口是否可用
      if (await this.isPortAvailable(fixedPort)) {
        console.log(`✅ 固定端口 ${fixedPort} 可用`);
        return fixedPort;
      } else {
        throw new Error(`固定端口 ${fixedPort} 被占用，请选择其他端口或切换到自动模式`);
      }
    }
    
    // 自动端口模式（默认行为）
    console.log('🔍 使用自动端口模式，查找可用端口...');
    const preferredPorts = [8080, 8888, 9080, 9999, 7890, 7891, 8090, 8100];
    
    // 先尝试首选端口
    for (const port of preferredPorts) {
      if (await this.isPortAvailable(port)) {
        console.log(`✅ 找到首选端口: ${port}`);
        return port;
      }
    }

    // 如果首选端口都被占用，从指定端口开始递增查找
    console.log(`🔄 首选端口都被占用，从 ${startPort} 开始递增查找...`);
    for (let port = startPort; port < startPort + 100; port++) {
      if (await this.isPortAvailable(port)) {
        console.log(`✅ 找到可用端口: ${port}`);
        return port;
      }
    }

    throw new Error('未找到可用端口，请检查系统端口占用情况');
  }

  /**
   * 检查端口是否可用
   */
  async isPortAvailable(port) {
    return new Promise((resolve) => {
      const server = net.createServer();
      
      server.listen(port, () => {
        server.close(() => {
          resolve(true);
        });
      });

      server.on('error', () => {
        resolve(false);
      });
    });
  }

  /**
   * 生成随机的用户名和密码
   */
  generateCredentials() {
    const generateRandomString = (length, charset) => {
      let result = '';
      for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      return result;
    };

    const username = 'admin_' + generateRandomString(6, 'abcdefghijklmnopqrstuvwxyz0123456789');
    const password = generateRandomString(12, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*');

    this.credentials = { username, password };
    return this.credentials;
  }

  /**
   * 配置Everything HTTP服务
   */
  async configureEverythingHTTP(installPath, port) {
    // 寻找配置文件
    const configPaths = [
      path.join(installPath, 'Everything.ini'),
      path.join(os.homedir(), 'AppData', 'Roaming', 'Everything', 'Everything.ini'),
      path.join(process.env.APPDATA || '', 'Everything', 'Everything.ini')
    ];

    let configPath = null;
    for (const testPath of configPaths) {
      if (fs.existsSync(testPath)) {
        configPath = testPath;
        break;
      }
    }

    if (!configPath) {
      // 如果没有配置文件，在安装目录创建一个基本的配置文件
      configPath = path.join(installPath, 'Everything.ini');
      console.log('未找到现有配置文件，将创建新的配置文件:', configPath);
    }

    console.log('配置文件路径:', configPath);

    try {
      // 生成安全的用户名和密码
      const credentials = this.generateCredentials();
      console.log('生成的登录凭据 - 用户名:', credentials.username);

      // 定义需要更新的HTTP配置项及其值
      const httpSettings = {
        'http_server_enabled': '1',
        'http_server_bindings': '',
        'http_title_format': '',
        'http_server_port': port.toString(),
        'http_server_username': credentials.username,
        'http_server_password': credentials.password,
        'http_server_home': '',
        'http_server_default_page': '',
        'http_server_log_file_name': '',
        'http_server_logging_enabled': '0',
        'http_server_log_max_size': '4194304',
        'http_server_log_delta_size': '524288',
        'http_server_allow_file_download': '1',
        'http_server_items_per_page': '32',
        'http_server_show_drive_labels': '0',
        'http_server_strings': '',
        'http_server_header': ''
      };

      let configLines = [];
      let foundKeys = new Set();

      // 备份原配置文件（如果存在）
      if (fs.existsSync(configPath)) {
        const backupPath = configPath + '.backup.' + Date.now();
        fs.copyFileSync(configPath, backupPath);
        console.log('已备份原配置文件至:', backupPath);

        // 逐行读取配置文件
        const configContent = fs.readFileSync(configPath, 'utf8');
        const lines = configContent.split(/\r?\n/);

        for (let line of lines) {
          const trimmedLine = line.trim();
          let lineModified = false;

          // 检查这一行是否是我们要修改的HTTP配置
          for (const [key, value] of Object.entries(httpSettings)) {
            // 匹配配置行：key=任意值
            const configRegex = new RegExp(`^\\s*${key}\\s*=.*$`);
            if (configRegex.test(line)) {
              // 替换这一行，保持原有的缩进格式
              const indent = line.match(/^\s*/)[0]; // 获取原有缩进
              const newLine = `${indent}${key}=${value}`;
              configLines.push(newLine);
              foundKeys.add(key);
              lineModified = true;
              console.log(`✏️ 在原位置更新: ${key}=${value}`);
              break;
            }
          }

          // 如果这一行不需要修改，保持原样
          if (!lineModified) {
            configLines.push(line);
          }
        }
      } else {
        console.log('配置文件不存在，将创建新文件');
      }

      // 添加未找到的HTTP配置项到文件末尾
      for (const [key, value] of Object.entries(httpSettings)) {
        if (!foundKeys.has(key)) {
          const newLine = `${key}=${value}`;
          configLines.push(newLine);
          console.log(`➕ 添加新配置: ${key}=${value}`);
        }
      }

      // 写回配置文件，完全保持原有的行结构和顺序
      const finalContent = configLines.join('\n');
      fs.writeFileSync(configPath, finalContent, 'utf8');

      this.configPath = configPath;
      console.log('Everything配置已更新');
      console.log('HTTP服务端口:', port);
      console.log('访问凭据 - 用户名:', credentials.username, '密码:', credentials.password);

    } catch (error) {
      throw new Error(`配置Everything失败: ${error.message}`);
    }
  }

  /**
   * 启动Everything
   */
  async startEverything(installPath) {
    return new Promise((resolve, reject) => {
      const everythingExe = path.join(installPath, 'Everything.exe');
      
      if (!fs.existsSync(everythingExe)) {
        reject(new Error(`Everything可执行文件不存在: ${everythingExe}`));
        return;
      }

      console.log('启动Everything:', everythingExe);

      // 启动Everything进程
      const child = spawn(everythingExe, [], {
        detached: true,
        stdio: 'ignore'
      });

      child.unref(); // 让子进程独立运行

      child.on('error', (error) => {
        reject(new Error(`启动Everything失败: ${error.message}`));
      });

      // 等待进程启动
      setTimeout(() => {
        resolve();
      }, 3000);
    });
  }

  /**
   * 等待HTTP服务启动
   */
  async waitForService(port, maxRetries = 30) {
    for (let i = 0; i < maxRetries; i++) {
      console.log(`等待服务启动... (${i + 1}/${maxRetries})`);
      
      try {
        // 使用生成的凭据进行认证测试
        const credentials = this.credentials;
        const isConnected = await this.testConnection('localhost', port, 
          credentials ? credentials.username : null, 
          credentials ? credentials.password : null);
        if (isConnected) {
          return true;
        }
      } catch (error) {
        // 继续等待
      }

      await this.sleep(1000); // 等待1秒
    }

    return false;
  }

  /**
   * 测试连接（支持认证）
   */
  async testConnection(host, port, username = null, password = null) {
    return new Promise((resolve) => {
      const http = require('http');
      
      const options = {
        hostname: host,
        port: port,
        path: '/',
        method: 'GET',
        timeout: 5000
      };

      // 如果提供了用户名和密码，添加基本认证
      if (username && password) {
        const auth = Buffer.from(`${username}:${password}`).toString('base64');
        options.headers = {
          'Authorization': `Basic ${auth}`
        };
      }
      
      const req = http.request(options, (res) => {
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
   * 休眠函数
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 手动设置Everything路径（用户输入）
   */
  async setManualPath(userPath) {
    try {
      // 处理用户可能输入的三种情况：
      // 1. Everything.exe的完整路径
      // 2. Everything的安装目录
      // 3. 安装目录的上级目录

      let installPath = null;

      if (userPath.toLowerCase().endsWith('everything.exe')) {
        // 情况1: 用户输入的是exe文件路径
        if (fs.existsSync(userPath)) {
          installPath = path.dirname(userPath);
        }
      } else {
        // 情况2和3: 用户输入的是目录路径
        const possiblePaths = [
          userPath, // 直接是安装目录
          path.join(userPath, 'Everything'), // 上级目录
          path.join(userPath, 'Everything 1.4'), // 带版本号的目录
          path.join(userPath, 'voidtools', 'Everything') // 厂商目录结构
        ];

        for (const testPath of possiblePaths) {
          const exePath = path.join(testPath, 'Everything.exe');
          if (fs.existsSync(exePath)) {
            installPath = testPath;
            break;
          }
        }
      }

      if (!installPath) {
        throw new Error('在指定路径中未找到Everything.exe');
      }

      return installPath;

    } catch (error) {
      throw new Error(`验证路径失败: ${error.message}`);
    }
  }
}

module.exports = EverythingManager;