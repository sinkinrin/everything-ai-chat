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
            确保Everything软件已安装并启用了命令行支持
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

          <div class="info-box">
            <h4>如何启用Everything命令行支持：</h4>
            <ol>
              <li>打开Everything软件</li>
              <li>工具 → 选项 → 常规</li>
              <li>勾选"启用HTTP服务器"</li>
              <li>确保es.exe在系统PATH中或Everything安装目录</li>
            </ol>
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
import { ref, reactive, onMounted } from 'vue';

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
        const result = await window.electronAPI.setOpenAIConfig(config);
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

    onMounted(() => {
      loadConfig();
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
      saveConfig,
      testEverything,
      filterModelHistory,
      selectModel,
      hideModelHistoryDelayed,
      handleOverlayClick
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.config-dialog {
  background: var(--surface-color);
  width: 600px;
  max-width: 90vw;
  max-height: 90vh;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.config-header h2 {
  margin: 0;
  font-size: 18px;
  color: var(--text-primary);
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.close-button:hover {
  color: var(--text-primary);
}

.config-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.config-section {
  margin-bottom: 32px;
}

.config-section:last-child {
  margin-bottom: 0;
}

.config-section h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: var(--text-primary);
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
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--border-color);
  background: var(--surface-color);
  font-size: 14px;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.2s ease;
}

.form-input:focus,
.form-select:focus {
  border-color: var(--primary-color);
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
  gap: 12px;
  padding: 12px;
  background: var(--background-color);
  border: 1px solid var(--border-color);
  margin-bottom: 16px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  background: var(--error-color);
  transition: background-color 0.2s ease;
}

.status-indicator.active {
  background: var(--success-color);
}

.test-button {
  padding: 4px 12px;
  background: var(--primary-color);
  color: white;
  border: none;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.test-button:hover {
  background: var(--primary-hover);
}

.info-box {
  background: var(--background-color);
  border: 1px solid var(--border-color);
  padding: 16px;
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
  gap: 12px;
  padding: 20px;
  border-top: 1px solid var(--border-color);
}

.cancel-button,
.save-button {
  padding: 8px 20px;
  border: 1px solid var(--border-color);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button {
  background: var(--surface-color);
  color: var(--text-secondary);
}

.cancel-button:hover {
  background: var(--background-color);
  color: var(--text-primary);
}

.save-button {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.save-button:hover:not(:disabled) {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
}

.save-button:disabled {
  background: var(--text-muted);
  border-color: var(--text-muted);
  cursor: not-allowed;
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
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-top: none;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: var(--shadow-lg);
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
</style> 