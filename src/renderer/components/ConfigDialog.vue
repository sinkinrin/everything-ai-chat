<template>
  <div class="config-overlay" @click="handleOverlayClick">
    <div class="config-dialog" @click.stop>
      <div class="config-header">
        <h2>设置</h2>
        <button @click="$emit('close')" class="close-button">×</button>
      </div>

      <div class="config-content">
        <div class="config-section">
          <h3>显示字段配置</h3>
          <p class="config-description">
            选择在搜索结果中显示的字段信息
          </p>

          <div class="field-config-grid">
            <div class="field-config-item">
              <label class="checkbox-label">
                <input type="checkbox" v-model="config.displayFields.accessed" />
                <span>访问时间</span>
              </label>
            </div>
            <div class="field-config-item">
              <label class="checkbox-label">
                <input type="checkbox" v-model="config.displayFields.attributes" />
                <span>文件属性</span>
              </label>
            </div>
            <div class="field-config-item">
              <label class="checkbox-label">
                <input type="checkbox" v-model="config.displayFields.created" />
                <span>创建时间</span>
              </label>
            </div>
            <div class="field-config-item">
              <label class="checkbox-label">
                <input type="checkbox" v-model="config.displayFields.recently_changed" />
                <span>最近更改</span>
              </label>
            </div>
            <div class="field-config-item">
              <label class="checkbox-label">
                <input type="checkbox" v-model="config.displayFields.run_count" />
                <span>运行次数</span>
              </label>
            </div>
            <div class="field-config-item">
              <label class="checkbox-label">
                <input type="checkbox" v-model="config.displayFields.file_list_filename" />
                <span>文件列表名</span>
              </label>
            </div>
          </div>
        </div>

        <div class="config-section">
          <h3>OpenAI 配置</h3>
          <p class="config-description">
            配置OpenAI API以启用自然语言转Everything搜索语法功能
          </p>

          <div class="form-group">
            <label for="apiKey">API Key</label>
            <input
              id="apiKey"
              v-model="config.apiKey"
              type="password"
              placeholder="sk-..."
              class="form-input"
            />
            <small class="form-help">
              您的OpenAI API Key，用于调用GPT模型进行搜索语法转换
            </small>
          </div>

          <div class="form-group">
            <label for="baseURL">Base URL (可选)</label>
            <input
              id="baseURL"
              v-model="config.baseURL"
              type="url"
              placeholder="https://api.openai.com/v1"
              class="form-input"
            />
            <small class="form-help">
              自定义API端点，支持兼容的第三方服务
            </small>
          </div>

          <div class="form-group">
            <label for="model">模型</label>
            <div class="model-input-container">
              <input
                id="model"
                v-model="config.model"
                type="text"
                class="form-input model-input"
                placeholder="输入或选择模型"
                @focus="showModelHistory = true"
                @blur="hideModelHistoryDelayed"
                @input="filterModelHistory"
              />
              <div v-if="showModelHistory && filteredModelHistory.length > 0" class="model-dropdown">
                <div
                  v-for="model in filteredModelHistory"
                  :key="model"
                  @click="selectModel(model)"
                  class="model-dropdown-item"
                >
                  {{ model }}
                </div>
              </div>
            </div>
            <small class="form-help">
              输入自定义模型名称或从历史记录中选择
            </small>
          </div>
        </div>

        <div class="config-section">
          <h3>Everything 设置</h3>
          <p class="config-description">
            自动配置Everything HTTP服务，或手动设置连接参数
          </p>

          <div class="status-item">
            <div class="status-indicator" :class="{ active: everythingStatus }"></div>
            <span>Everything 状态: {{ everythingStatus ? '已连接' : '未连接' }}</span>
            <button @click="testEverything" :disabled="isTesting" class="test-button">
              {{ isTesting ? '测试中...' : '测试连接' }}
            </button>
          </div>

          <div v-if="testMessage" class="test-message" :class="{ success: testSuccess, error: !testSuccess }">
            {{ testMessage }}
          </div>

          <!-- 一键连接功能 -->
          <div class="auto-connect-section">
            <h4>🚀 一键连接Everything服务</h4>
            <p class="section-description">
              自动搜索Everything安装位置，配置HTTP服务并启动连接
            </p>
            
            <div class="action-buttons">
              <button 
                @click="autoConnectEverything" 
                :disabled="isAutoConnecting" 
                class="auto-connect-button primary"
              >
                {{ isAutoConnecting ? '连接中...' : '🔗 一键连接Everything服务' }}
              </button>
              
              <button 
                @click="showManualPath = !showManualPath" 
                class="manual-path-button secondary"
                :disabled="isAutoConnecting"
              >
                📁 手动设置路径
              </button>
            </div>

            <!-- 手动路径设置 -->
            <div v-if="showManualPath" class="manual-path-section">
              <div class="form-group">
                <label for="everythingPath">Everything安装路径</label>
                <input
                  id="everythingPath"
                  v-model="manualPath"
                  type="text"
                  placeholder="例如: C:\Program Files\Everything\Everything.exe"
                  class="form-input"
                />
                <small class="form-help">
                  可以输入Everything.exe的完整路径，或者安装目录路径
                </small>
              </div>
              <button 
                @click="setManualPath" 
                :disabled="!manualPath.trim() || isManualSetting"
                class="set-path-button"
              >
                {{ isManualSetting ? '设置中...' : '确认设置' }}
              </button>
            </div>

            <!-- 操作进度显示 -->
            <div v-if="autoConnectProgress.length > 0" class="progress-section">
              <h5>连接进度:</h5>
              <ul class="progress-list">
                <li 
                  v-for="(step, index) in autoConnectProgress" 
                  :key="index"
                  :class="['progress-item', step.status]"
                >
                  <span class="progress-icon">{{ getProgressIcon(step.status) }}</span>
                  <span class="progress-text">{{ step.message }}</span>
                </li>
              </ul>
            </div>

            <!-- 连接结果 -->
            <div v-if="autoConnectResult" class="result-section">
              <div 
                class="result-message" 
                :class="{ success: autoConnectResult.success, error: !autoConnectResult.success }"
              >
                {{ autoConnectResult.message }}
              </div>
              <div v-if="autoConnectResult.success && autoConnectResult.port" class="result-details">
                <p>🌐 HTTP服务端口: {{ autoConnectResult.port }}</p>
                <p v-if="autoConnectResult.installPath">📁 安装路径: {{ autoConnectResult.installPath }}</p>
                <div v-if="autoConnectResult.credentials" class="credentials-section">
                  <p class="credentials-title">🔐 访问凭据（请妥善保存）:</p>
                  <div class="credential-item">
                    <span class="credential-label">用户名:</span>
                    <span class="credential-value">{{ autoConnectResult.credentials.username }}</span>
                    <button @click="copyToClipboard(autoConnectResult.credentials.username)" class="copy-button" title="复制用户名">📋</button>
                  </div>
                  <div class="credential-item">
                    <span class="credential-label">密码:</span>
                    <span class="credential-value">{{ showPassword ? autoConnectResult.credentials.password : '•'.repeat(12) }}</span>
                    <button @click="togglePasswordVisibility" class="toggle-password-button" :title="showPassword ? '隐藏密码' : '显示密码'">
                      {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                    </button>
                    <button @click="copyToClipboard(autoConnectResult.credentials.password)" class="copy-button" title="复制密码">📋</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 当前配置信息 -->
          <div class="current-config">
            <h4>当前配置</h4>
            <div class="config-info">
              <div class="config-item">
                <span class="config-label">HTTP端口:</span>
                <span class="config-value">{{ everythingConfig.port || '未设置' }}</span>
              </div>
              <div class="config-item">
                <span class="config-label">安装路径:</span>
                <span class="config-value">{{ everythingConfig.installPath || '未设置' }}</span>
              </div>
              <div class="config-item">
                <span class="config-label">认证状态:</span>
                <span class="config-value">{{ everythingConfig.hasCredentials ? '✅ 已启用' : '❌ 未启用' }}</span>
              </div>
              <div v-if="everythingConfig.hasCredentials" class="config-item">
                <span class="config-label">登录用户:</span>
                <span class="config-value">{{ everythingConfig.username || '未设置' }}</span>
              </div>
            </div>
          </div>

          <div class="info-box">
            <h4>说明:</h4>
            <ul>
              <li><strong>一键连接</strong>: 自动搜索Everything安装位置，配置HTTP服务，无需手动操作</li>
              <li><strong>自动处理</strong>: 会自动关闭现有Everything进程，修改配置文件，重启服务</li>
              <li><strong>端口选择</strong>: 自动选择未被占用的端口（优先8080、8888等）</li>
              <li><strong>兼容性</strong>: 支持Everything 1.4及以上版本</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="config-footer">
        <button @click="$emit('close')" class="cancel-button">取消</button>
        <button @click="saveConfig" :disabled="isSaving" class="save-button">
          {{ isSaving ? '保存中...' : '保存' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, toRaw } from 'vue';

export default {
  name: 'ConfigDialog',
  emits: ['close'],
  setup(props, { emit }) {
    const config = reactive({
      apiKey: '',
      baseURL: 'https://api.openai.com/v1',
      model: 'gpt-3.5-turbo',
      displayFields: {
        accessed: false,
        attributes: false,
        created: false,
        recently_changed: false,
        run_count: false,
        file_list_filename: false
      }
    });

    const isSaving = ref(false);
    const everythingStatus = ref(false);
    const isTesting = ref(false);
    const testMessage = ref('');
    const testSuccess = ref(false);
    
    // 一键连接相关状态
    const isAutoConnecting = ref(false);
    const autoConnectProgress = ref([]);
    const autoConnectResult = ref(null);
    const showManualPath = ref(false);
    const manualPath = ref('');
    const isManualSetting = ref(false);
    const everythingConfig = ref({
      port: 80,
      installPath: '',
      hasCredentials: false,
      username: ''
    });
    const showPassword = ref(false);
    
    // 模型历史记录相关
    const showModelHistory = ref(false);
    const modelHistory = ref([
      'gpt-3.5-turbo',
      'gpt-4',
      'gpt-4-turbo-preview',
      'gpt-4o',
      'gpt-4o-mini',
      'claude-3-opus',
      'claude-3-sonnet',
      'claude-3-haiku'
    ]);
    const filteredModelHistory = ref([]);

    const loadConfig = async () => {
      try {
        const savedConfig = await window.electronAPI.getOpenAIConfig();
        if (savedConfig) {
          Object.assign(config, savedConfig);
        }
      } catch (error) {
        console.error('加载配置失败:', error);
      }
    };

    const saveConfig = async () => {
      isSaving.value = true;
      try {
        // 使用 JSON 方法彻底移除所有 reactive 特性
        const configData = JSON.parse(JSON.stringify(toRaw(config)));
        
        const result = await window.electronAPI.setOpenAIConfig(configData);
        if (result.success) {
          emit('close');
        } else {
          alert('保存配置失败: ' + result.error);
        }
      } catch (error) {
        console.error('保存配置失败:', error);
        alert('保存配置失败: ' + error.message);
      } finally {
        isSaving.value = false;
      }
    };

    const testEverything = async () => {
      isTesting.value = true;
      testMessage.value = '';
      
      try {
        // 简单测试Everything连接
        const result = await window.electronAPI.searchFiles('test');
        everythingStatus.value = result.success;
        
        if (result.success) {
          testMessage.value = 'Everything连接成功！';
          testSuccess.value = true;
        } else {
          testMessage.value = 'Everything连接失败: ' + result.error;
          testSuccess.value = false;
        }
      } catch (error) {
        everythingStatus.value = false;
        testMessage.value = 'Everything连接失败: ' + error.message;
        testSuccess.value = false;
      } finally {
        isTesting.value = false;
      }
    };

    // 模型历史记录相关方法
    const filterModelHistory = () => {
      const query = config.model.toLowerCase();
      filteredModelHistory.value = modelHistory.value.filter(model => 
        model.toLowerCase().includes(query)
      );
    };

    const selectModel = (model) => {
      config.model = model;
      showModelHistory.value = false;
      
      // 添加到历史记录（如果不存在）
      if (!modelHistory.value.includes(model)) {
        modelHistory.value.unshift(model);
        // 保持历史记录在合理数量
        if (modelHistory.value.length > 20) {
          modelHistory.value = modelHistory.value.slice(0, 20);
        }
      }
    };

    const hideModelHistoryDelayed = () => {
      setTimeout(() => {
        showModelHistory.value = false;
      }, 200);
    };

    const handleOverlayClick = () => {
      emit('close');
    };

    // 一键连接Everything服务
    const autoConnectEverything = async () => {
      isAutoConnecting.value = true;
      autoConnectProgress.value = [];
      autoConnectResult.value = null;
      
      try {
        // 添加进度步骤
        const addProgress = (message, status = 'running') => {
          autoConnectProgress.value.push({ message, status });
        };

        addProgress('开始一键连接Everything服务...');
        
        const result = await window.electronAPI.autoConnectEverything();
        
        if (result.success) {
          addProgress('Everything HTTP服务连接成功！', 'success');
          autoConnectResult.value = {
            success: true,
            message: result.message,
            port: result.port,
            installPath: result.installPath
          };
          
          // 更新状态并重新测试连接
          await loadEverythingConfig();
          await testEverything();
        } else {
          addProgress('连接失败: ' + result.error, 'error');
          autoConnectResult.value = {
            success: false,
            message: result.error
          };
        }
        
      } catch (error) {
        console.error('一键连接失败:', error);
        autoConnectProgress.value.push({
          message: '连接过程中发生错误: ' + error.message,
          status: 'error'
        });
        autoConnectResult.value = {
          success: false,
          message: '连接过程中发生错误: ' + error.message
        };
      } finally {
        isAutoConnecting.value = false;
      }
    };

    // 手动设置Everything路径
    const setManualPath = async () => {
      if (!manualPath.value.trim()) return;
      
      isManualSetting.value = true;
      
      try {
        const result = await window.electronAPI.setEverythingPath(manualPath.value);
        
        if (result.success) {
          autoConnectResult.value = {
            success: true,
            message: result.message,
            installPath: result.installPath
          };
          
          await loadEverythingConfig();
          showManualPath.value = false;
          manualPath.value = '';
        } else {
          autoConnectResult.value = {
            success: false,
            message: result.error
          };
        }
        
      } catch (error) {
        console.error('设置路径失败:', error);
        autoConnectResult.value = {
          success: false,
          message: '设置路径失败: ' + error.message
        };
      } finally {
        isManualSetting.value = false;
      }
    };

    // 加载Everything配置
    const loadEverythingConfig = async () => {
      try {
        const config = await window.electronAPI.getEverythingConfig();
        everythingConfig.value = config;
      } catch (error) {
        console.error('加载Everything配置失败:', error);
      }
    };

    // 获取进度图标
    const getProgressIcon = (status) => {
      switch (status) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'running': return '🔄';
        default: return '⏳';
      }
    };

    // 复制到剪贴板
    const copyToClipboard = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        // 简单的成功提示
        console.log('已复制到剪贴板:', text);
      } catch (error) {
        console.error('复制失败:', error);
        // 备用方法
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    };

    // 切换密码显示/隐藏
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    onMounted(() => {
      loadConfig();
      loadEverythingConfig();
      testEverything();
      // 初始化模型历史记录
      filteredModelHistory.value = modelHistory.value;
    });

    return {
      config,
      isSaving,
      everythingStatus,
      isTesting,
      testMessage,
      testSuccess,
      showModelHistory,
      filteredModelHistory,
      
      // 一键连接相关
      isAutoConnecting,
      autoConnectProgress,
      autoConnectResult,
      showManualPath,
      manualPath,
      isManualSetting,
      everythingConfig,
      showPassword,
      
      // 方法
      saveConfig,
      testEverything,
      filterModelHistory,
      selectModel,
      hideModelHistoryDelayed,
      handleOverlayClick,
      autoConnectEverything,
      setManualPath,
      getProgressIcon,
      copyToClipboard,
      togglePasswordVisibility
    };
  }
};
</script>

<style scoped>
.config-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: overlayFadeIn 0.3s ease;
}

@keyframes overlayFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.config-dialog {
  background: var(--surface);
  width: 700px;
  max-width: 90vw;
  max-height: 90vh;
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 16px;
  box-shadow: var(--shadow-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  animation: dialogSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

@keyframes dialogSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,255,0.95) 100%);
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
}

.config-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.close-button {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  color: var(--text-secondary);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal) var(--easing);
}

.close-button:hover {
  color: var(--error-color);
  background: rgba(250, 112, 154, 0.1);
  border-color: var(--error-color);
  transform: scale(1.05);
}

.config-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,255,0.9) 100%);
}

.config-section {
  margin-bottom: 32px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.config-section:last-child {
  margin-bottom: 0;
}

.config-section h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.config-section h3::before {
  content: '⚙️';
  font-size: 16px;
}

.config-description {
  margin: 0 0 20px 0;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.form-input,
.form-select {
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  font-size: 15px;
  color: var(--text-primary);
  outline: none;
  transition: all var(--transition-normal) var(--easing);
}

.form-input:focus,
.form-select:focus {
  border-color: var(--primary-color);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.form-help {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.4;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  margin-bottom: 16px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--error-color);
  transition: all var(--transition-normal) var(--easing);
  box-shadow: 0 0 0 3px rgba(250, 112, 154, 0.2);
}

.status-indicator.active {
  background: var(--success-color);
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.2), 0 0 10px rgba(74, 222, 128, 0.3);
  animation: statusPulse 2s ease-in-out infinite;
}

@keyframes statusPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.test-button {
  padding: 8px 16px;
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal) var(--easing);
  box-shadow: var(--shadow-soft);
}

.test-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-medium);
}

.info-box {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  padding: 16px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.info-box h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--text-primary);
}

.info-box ol {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.info-box li {
  margin-bottom: 4px;
}

.config-footer {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 24px;
  background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,255,0.95) 100%);
  border-top: 1px solid rgba(102, 126, 234, 0.1);
}

.cancel-button,
.save-button {
  padding: 12px 24px;
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal) var(--easing);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.cancel-button {
  background: rgba(255, 255, 255, 0.8);
  color: var(--text-secondary);
  border-color: rgba(102, 126, 234, 0.2);
}

.cancel-button:hover {
  background: rgba(255, 255, 255, 0.95);
  color: var(--text-primary);
  border-color: rgba(102, 126, 234, 0.4);
  transform: translateY(-1px);
}

.save-button {
  background: var(--primary-gradient);
  color: white;
  border-color: transparent;
  box-shadow: var(--shadow-medium);
}

.save-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-strong);
}

.save-button:disabled {
  background: var(--gray-400);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 字段配置样式 */
.field-config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.field-config-item {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-primary);
}

.checkbox-label input[type="checkbox"] {
  margin: 0;
  accent-color: var(--primary-color);
}

/* 模型输入框样式 */
.model-input-container {
  position: relative;
}

.model-input {
  width: 100%;
}

.model-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: var(--shadow-glass);
}

.model-dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-primary);
  transition: background-color 0.2s ease;
}

.model-dropdown-item:hover {
  background: var(--background-color);
}

/* 测试消息样式 */
.test-message {
  padding: 8px 12px;
  margin-top: 12px;
  font-size: 14px;
  border: 1px solid;
  border-radius: 4px;
}

.test-message.success {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
  color: #16a34a;
}

.test-message.error {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #dc2626;
}

/* 一键连接功能样式 */
.auto-connect-section {
  background: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 20px;
  margin: 20px 0;
}

.auto-connect-section h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: var(--text-primary);
}

.section-description {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.auto-connect-button,
.manual-path-button,
.set-path-button {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.auto-connect-button.primary {
  background: var(--primary-gradient);
  color: white;
  box-shadow: var(--shadow-medium);
  border-radius: 10px;
}

.auto-connect-button.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-strong);
}

.manual-path-button.secondary {
  background: rgba(255, 255, 255, 0.8);
  color: var(--text-secondary);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.manual-path-button.secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.95);
  color: var(--text-primary);
  border-color: var(--primary-color);
  transform: translateY(-1px);
}

.set-path-button {
  background: var(--primary-gradient);
  color: white;
  margin-top: 8px;
  border-radius: 8px;
  box-shadow: var(--shadow-soft);
}

.set-path-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-medium);
}

.auto-connect-button:disabled,
.manual-path-button:disabled,
.set-path-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 手动路径设置样式 */
.manual-path-section {
  background: rgba(79, 70, 229, 0.05);
  border: 1px solid rgba(79, 70, 229, 0.1);
  border-radius: 6px;
  padding: 16px;
  margin-top: 12px;
}

/* 进度显示样式 */
.progress-section {
  margin-top: 20px;
}

.progress-section h5 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--text-primary);
}

.progress-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.progress-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  font-size: 14px;
}

.progress-item.success {
  color: #16a34a;
}

.progress-item.error {
  color: #dc2626;
}

.progress-item.running {
  color: var(--primary-color);
}

.progress-icon {
  width: 16px;
  text-align: center;
}

.progress-text {
  flex: 1;
}

/* 结果显示样式 */
.result-section {
  margin-top: 20px;
}

.result-message {
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}

.result-message.success {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #16a34a;
}

.result-message.error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #dc2626;
}

.result-details {
  margin-top: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.result-details p {
  margin: 4px 0;
  font-size: 13px;
  color: var(--text-secondary);
}

/* 当前配置样式 */
.current-config {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  padding: 16px;
  margin: 20px 0;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.current-config h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--text-primary);
}

.config-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.config-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.config-value {
  color: var(--text-primary);
  font-family: 'Consolas', 'Monaco', monospace;
  background: var(--background-color);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 凭据显示样式 */
.credentials-section {
  margin-top: 16px;
  padding: 16px;
  background: rgba(34, 197, 94, 0.05);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 6px;
}

.credentials-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #16a34a;
}

.credential-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 6px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.credential-label {
  min-width: 60px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.credential-value {
  flex: 1;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  color: var(--text-primary);
  background: var(--background-color);
  padding: 4px 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  word-break: break-all;
}

.copy-button,
.toggle-password-button {
  padding: 4px 6px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 3px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-button:hover,
.toggle-password-button:hover {
  background: var(--primary-hover);
  transform: scale(1.05);
}

.toggle-password-button {
  background: var(--text-secondary);
  margin-right: 4px;
}

.toggle-password-button:hover {
  background: var(--text-primary);
}
</style> 