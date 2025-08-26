<template>
  <div class="config-overlay" @mousedown="handleOverlayMouseDown" @mouseup="handleOverlayMouseUp">
    <div class="config-dialog" @click.stop @mousedown.stop @mouseup.stop>
      <div class="config-header">
        <h2>{{ $t('settings.title') }}</h2>
        <button @click="closeDialog" class="close-button">×</button>
      </div>

      <div class="config-content">
        <!-- 语言设置 -->
        <div class="config-section">
          <h3>{{ $t('settings.language.title') }}</h3>
          <p class="config-description">
            {{ $t('settings.language.description') }}
          </p>

          <div class="form-group">
            <label for="languageSelect">{{ $t('settings.language.label') }}</label>
            <select
              id="languageSelect"
              v-model="selectedLanguage"
              @change="changeLanguage"
              class="form-select"
            >
              <option
                v-for="locale in supportedLocales"
                :key="locale.code"
                :value="locale.code"
              >
                {{ locale.nativeName }} ({{ locale.name }})
              </option>
            </select>
            <small class="form-help">
              {{ $t('settings.language.current', { language: getCurrentLocaleName() }) }}
            </small>
          </div>
        </div>

        <div class="config-section">
          <h3>{{ $t('settings.display.title') }}</h3>
          <p class="config-description">
            {{ $t('settings.display.description') }}
          </p>

          <div class="field-config-grid">
            <div class="field-config-item">
              <label class="checkbox-label">
                <input type="checkbox" v-model="config.displayFields.accessed" />
                <span>{{ $t('settings.display.fields.accessed') }}</span>
              </label>
            </div>
            <div class="field-config-item">
              <label class="checkbox-label">
                <input type="checkbox" v-model="config.displayFields.attributes" />
                <span>{{ $t('settings.display.fields.attributes') }}</span>
              </label>
            </div>
            <div class="field-config-item">
              <label class="checkbox-label">
                <input type="checkbox" v-model="config.displayFields.created" />
                <span>{{ $t('settings.display.fields.created') }}</span>
              </label>
            </div>
            <div class="field-config-item">
              <label class="checkbox-label">
                <input type="checkbox" v-model="config.displayFields.recently_changed" />
                <span>{{ $t('settings.display.fields.recentlyChanged') }}</span>
              </label>
            </div>
            <div class="field-config-item">
              <label class="checkbox-label">
                <input type="checkbox" v-model="config.displayFields.run_count" />
                <span>{{ $t('settings.display.fields.runCount') }}</span>
              </label>
            </div>
            <div class="field-config-item">
              <label class="checkbox-label">
                <input type="checkbox" v-model="config.displayFields.file_list_filename" />
                <span>{{ $t('settings.display.fields.fileListFilename') }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="config-section">
          <h3>{{ $t('settings.openai.title') }}</h3>
          <p class="config-description">
            {{ $t('settings.openai.description') }}
          </p>

          <div class="form-group">
            <label for="apiKey">{{ $t('settings.openai.apiKey.label') }}</label>
            <input
              id="apiKey"
              v-model="config.apiKey"
              type="password"
              :placeholder="$t('settings.openai.apiKey.placeholder')"
              class="form-input"
            />
            <small class="form-help">
              {{ $t('settings.openai.apiKey.help') }}
            </small>
          </div>

          <div class="form-group">
            <label for="baseURL">{{ $t('settings.openai.baseUrl.label') }}</label>
            <input
              id="baseURL"
              v-model="config.baseURL"
              type="url"
              :placeholder="$t('settings.openai.baseUrl.placeholder')"
              class="form-input"
            />
            <small class="form-help">
              {{ $t('settings.openai.baseUrl.help') }}
            </small>
          </div>

          <div class="form-group">
            <label for="model">{{ $t('settings.openai.model.label') }}</label>
            <div class="model-input-container">
              <input
                id="model"
                v-model="config.model"
                type="text"
                class="form-input model-input"
                :placeholder="$t('settings.openai.model.placeholder')"
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
              {{ $t('settings.openai.model.help') }}
            </small>
          </div>
        </div>

        <!-- AI 调试配置 -->
        <div class="config-section">
          <h3>{{ $t('settings.debug.title') }}</h3>
          <p class="config-description">
            {{ $t('settings.debug.description') }}
          </p>

          <div class="debug-config-grid">
            <div class="debug-config-item">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="config.enableStreamDebug"
                  @change="scheduleAutoSave"
                />
                <span>{{ $t('settings.debug.enableStream') }}</span>
              </label>
              <small class="debug-help">
                {{ $t('settings.debug.enableStreamHelp') }}
              </small>
            </div>
          </div>
        </div>

        <!-- AI 系统提示词配置 -->
        <div class="config-section">
          <div class="section-header" @click="toggleSystemPromptSection">
            <h3>{{ $t('settings.systemPrompt.title') }}</h3>
            <button class="collapse-button" :class="{ 'expanded': showSystemPromptSection }" type="button">
              <span>{{ showSystemPromptSection ? '▼' : '▶' }}</span>
            </button>
          </div>
          
          <div v-show="showSystemPromptSection" class="system-prompt-content">
            <p class="config-description">
              {{ $t('settings.systemPrompt.description') }}
            </p>

            <div class="form-group">
              <label for="systemPrompt">{{ $t('settings.systemPrompt.label') }}</label>
              <textarea
                id="systemPrompt"
                v-model="config.systemPrompt"
                class="form-textarea"
                :placeholder="$t('settings.systemPrompt.placeholder')"
                rows="8"
              ></textarea>
              <small class="form-help">
                {{ $t('settings.systemPrompt.help') }}
              </small>
            </div>

            <div class="prompt-actions">
              <button @click="resetToDefaultPrompt" class="reset-prompt-button" type="button">
                {{ $t('settings.systemPrompt.reset') }}
              </button>
              <button @click="showPromptPreview = !showPromptPreview" class="preview-button" type="button">
                {{ showPromptPreview ? $t('settings.systemPrompt.hidePreview') : $t('settings.systemPrompt.preview') }}
              </button>
            </div>

            <!-- 提示词预览区域 -->
            <div v-if="showPromptPreview" class="prompt-preview">
              <h4>{{ $t('settings.systemPrompt.previewTitle') }}</h4>
              <div class="preview-content">
                {{ getCurrentPrompt() }}
              </div>
            </div>

            <!-- 使用说明 -->
            <div class="prompt-tips">
              <h4>{{ $t('settings.systemPrompt.tips.title') }}</h4>
              <ul>
                <li><strong>{{ $t('settings.systemPrompt.tips.guidanceTitle') }}</strong>: {{ $t('settings.systemPrompt.tips.guidance') }}</li>
                <li><strong>{{ $t('settings.systemPrompt.tips.examplesTitle') }}</strong>: {{ $t('settings.systemPrompt.tips.examples') }}</li>
                <li><strong>{{ $t('settings.systemPrompt.tips.conciseTitle') }}</strong>: {{ $t('settings.systemPrompt.tips.concise') }}</li>
                <li><strong>{{ $t('settings.systemPrompt.tips.testTitle') }}</strong>: {{ $t('settings.systemPrompt.tips.test') }}</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="config-section">
          <h3>{{ $t('settings.everything.title') }}</h3>
          <p class="config-description">
            {{ $t('settings.everything.description') }}
          </p>

          <div class="status-item">
            <div class="status-indicator" :class="{ active: everythingStatus }"></div>
            <span>{{ $t('settings.everything.status') }} {{ everythingStatus ? $t('status.connected') : $t('status.disconnected') }}</span>
            <button @click="testEverything" :disabled="isTesting" class="test-button">
              {{ isTesting ? $t('settings.everything.testing') : $t('settings.everything.test') }}
            </button>
          </div>

          <div v-if="testMessage" class="test-message" :class="{ success: testSuccess, error: !testSuccess }">
            {{ testMessage }}
          </div>

          <!-- 一键连接功能 -->
          <div class="auto-connect-section">
            <h4>{{ $t('settings.everything.autoConnect.title') }}</h4>
            <p class="section-description">
              {{ $t('settings.everything.autoConnect.description') }}
            </p>
            
            <div class="action-buttons">
              <button 
                @click="autoConnectEverything" 
                :disabled="isAutoConnecting" 
                class="auto-connect-button primary"
              >
                {{ isAutoConnecting ? $t('messages.info.connecting') : $t('settings.everything.autoConnect.button') }}
              </button>
              
              <button 
                @click="showManualPath = !showManualPath" 
                class="manual-path-button secondary"
                :disabled="isAutoConnecting"
              >
                {{ $t('settings.everything.autoConnect.manualPath') }}
              </button>
            </div>

            <!-- 手动路径设置 -->
            <div v-if="showManualPath" class="manual-path-section">
              <div class="form-group">
                <label for="everythingPath">{{ $t('settings.everything.autoConnect.manualPathSection.label') }}</label>
                <input
                  id="everythingPath"
                  v-model="manualPath"
                  type="text"
                  :placeholder="$t('settings.everything.autoConnect.manualPathSection.placeholder')"
                  class="form-input"
                />
                <small class="form-help">
                  {{ $t('settings.everything.autoConnect.manualPathSection.help') }}
                </small>
              </div>
              <button 
                @click="setManualPath" 
                :disabled="!manualPath.trim() || isManualSetting"
                class="set-path-button"
              >
                {{ isManualSetting ? $t('messages.info.setting') : $t('settings.everything.autoConnect.manualPathSection.confirm') }}
              </button>
            </div>

            <!-- 操作进度显示 -->
            <div v-if="autoConnectProgress.length > 0" class="progress-section">
              <h5>{{ $t('settings.everything.autoConnect.progress') }}</h5>
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
                <p>{{ $t('settings.everything.autoConnect.result.port', { port: autoConnectResult.port }) }}</p>
                <p v-if="autoConnectResult.installPath">{{ $t('settings.everything.autoConnect.result.installPath', { path: autoConnectResult.installPath }) }}</p>
                <div v-if="autoConnectResult.credentials" class="credentials-section">
                  <p class="credentials-title">{{ $t('settings.everything.autoConnect.result.credentials') }}</p>
                  <div class="credential-item">
                    <span class="credential-label">{{ $t('settings.everything.autoConnect.result.username') }}</span>
                    <span class="credential-value">{{ autoConnectResult.credentials.username }}</span>
                    <button @click="copyToClipboard(autoConnectResult.credentials.username)" class="copy-button" :title="$t('settings.everything.autoConnect.result.copy')">📋</button>
                  </div>
                  <div class="credential-item">
                    <span class="credential-label">{{ $t('settings.everything.autoConnect.result.password') }}</span>
                    <span class="credential-value">{{ showPassword ? autoConnectResult.credentials.password : '•'.repeat(autoConnectResult.credentials.password.length) }}</span>
                    <button @click="togglePasswordVisibility" class="toggle-password-button" :title="showPassword ? $t('settings.everything.autoConnect.result.hidePassword') : $t('settings.everything.autoConnect.result.showPassword')">
                      {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                    </button>
                    <button @click="copyToClipboard(autoConnectResult.credentials.password)" class="copy-button" :title="$t('settings.everything.autoConnect.result.copy')">📋</button>
                  </div>
                  <div class="credential-note">
                    <small>{{ $t('settings.everything.autoConnect.result.note') }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 端口配置部分 -->
          <div class="port-config-section">
            <h4>{{ $t('settings.everything.port.title') }}</h4>
            <p class="section-description">
              {{ $t('settings.everything.port.description') }}
            </p>
            
            <div class="port-config-options">
              <div class="radio-group">
                <label class="radio-label">
                  <input 
                    type="radio" 
                    v-model="portConfigMode" 
                    value="auto" 
                    name="portMode"
                  />
                  <span>{{ $t('settings.everything.port.auto') }}</span>
                </label>
                <div class="radio-description">
                  {{ $t('settings.everything.port.autoDescription') }}
                </div>
              </div>
              
              <div class="radio-group">
                <label class="radio-label">
                  <input 
                    type="radio" 
                    v-model="portConfigMode" 
                    value="fixed" 
                    name="portMode"
                  />
                  <span>{{ $t('settings.everything.port.fixed') }}</span>
                </label>
                <div class="radio-description">
                  {{ $t('settings.everything.port.fixedDescription') }}
                </div>
                
                <div v-if="portConfigMode === 'fixed'" class="fixed-port-input">
                  <div class="form-group">
                    <label for="fixedPort">{{ $t('settings.everything.port.portLabel') }}</label>
                    <input
                      id="fixedPort"
                      v-model.number="fixedPort"
                      type="number"
                      min="1"
                      max="65535"
                      :placeholder="$t('settings.everything.port.portPlaceholder')"
                      class="form-input port-input"
                      :class="{ 'error': !isValidPort(fixedPort) }"
                    />
                    <small class="form-help" :class="{ 'error-text': !isValidPort(fixedPort) }">
                      <span v-if="isValidPort(fixedPort)">
                        {{ $t('settings.everything.port.portHelp') }}
                      </span>
                      <span v-else>
                        {{ $t('settings.everything.port.portError') }}
                      </span>
                    </small>
                  </div>
                  
                  <div class="port-suggestions">
                    <span class="suggestion-label">{{ $t('settings.everything.port.suggestions') }}</span>
                    <div class="port-chips">
                      <button 
                        v-for="suggestedPort in suggestedPorts" 
                        :key="suggestedPort"
                        @click="fixedPort = suggestedPort"
                        class="port-chip"
                        :class="{ active: fixedPort === suggestedPort }"
                        type="button"
                      >
                        {{ suggestedPort }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 当前配置信息 -->
          <div class="current-config">
            <h4>{{ $t('settings.everything.currentConfig.title') }}</h4>
            <div class="config-info">
              <div class="config-item">
                <span class="config-label">{{ $t('settings.everything.currentConfig.portMode') }}</span>
                <span class="config-value">{{ portConfigMode === 'auto' ? $t('settings.everything.currentConfig.autoMode') : $t('settings.everything.currentConfig.fixedMode') }}</span>
              </div>
              <div class="config-item">
                <span class="config-label">{{ $t('settings.everything.currentConfig.httpPort') }}</span>
                <span class="config-value">{{ everythingConfig.port || $t('settings.everything.currentConfig.notSet') }}</span>
              </div>
              <div v-if="portConfigMode === 'fixed'" class="config-item">
                <span class="config-label">{{ $t('settings.everything.currentConfig.configPort') }}</span>
                <span class="config-value">{{ fixedPort || $t('settings.everything.currentConfig.notSet') }}</span>
              </div>
              <div class="config-item">
                <span class="config-label">{{ $t('settings.everything.currentConfig.installPath') }}</span>
                <span class="config-value">{{ everythingConfig.installPath || $t('settings.everything.currentConfig.notSet') }}</span>
              </div>
              <div class="config-item">
                <span class="config-label">{{ $t('settings.everything.currentConfig.authStatus') }}</span>
                <span class="config-value">{{ everythingConfig.hasCredentials ? $t('settings.everything.currentConfig.enabled') : $t('settings.everything.currentConfig.disabled') }}</span>
              </div>
              <div v-if="everythingConfig.hasCredentials" class="config-item">
                <span class="config-label">{{ $t('settings.everything.currentConfig.loginUser') }}</span>
                <span class="config-value">{{ everythingConfig.username || $t('settings.everything.currentConfig.notSet') }}</span>
              </div>
            </div>
          </div>

          <div class="info-box">
            <h4>{{ $t('settings.everything.info.title') }}</h4>
            <ul>
              <li><strong>{{ $t('settings.everything.info.autoConnect') }}</strong></li>
              <li><strong>{{ $t('settings.everything.info.autoHandle') }}</strong></li>
              <li><strong>{{ $t('settings.everything.info.portSelection') }}</strong></li>
              <li><strong>{{ $t('settings.everything.info.compatibility') }}</strong></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 未保存更改警告 -->
      <div v-if="showUnsavedWarning" class="unsaved-warning">
        <div class="warning-content">
          <span class="warning-icon">⚠️</span>
          <span class="warning-text">{{ $t('settings.unsaved.warning') }}</span>
          <button @click="saveAndClose" class="warning-save-button">{{ $t('settings.unsaved.saveNow') }}</button>
          <button @click="discardAndClose" class="warning-discard-button">{{ $t('settings.unsaved.discard') }}</button>
        </div>
      </div>

      <div class="config-footer">
        <button @click="closeDialog" class="cancel-button">{{ $t('settings.cancel') }}</button>
        <button @click="saveConfig" :disabled="isSaving" :class="['save-button', { 'has-changes': hasUnsavedChanges }]">
          {{ isSaving ? $t('settings.saving') : hasUnsavedChanges ? $t('settings.save') + '*' : $t('settings.save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, toRaw, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { getCurrentLocale, setLocale, getSupportedLocales } from '../../i18n';

export default {
  name: 'ConfigDialog',
  emits: ['close'],
  setup(props, { emit }) {
    const { t } = useI18n();
    
    // 语言相关状态
    const selectedLanguage = ref(getCurrentLocale());
    const supportedLocales = ref(getSupportedLocales());
    const config = reactive({
      apiKey: '',
      baseURL: 'https://api.openai.com/v1',
      model: 'gpt-3.5-turbo',
      systemPrompt: '',
      enableStreamDebug: false,
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
    
    // 自动保存相关状态
    const hasUnsavedChanges = ref(false);
    const autoSaveTimeout = ref(null);
    const showUnsavedWarning = ref(false);
    
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
    
    // 端口配置相关状态
    const portConfigMode = ref('auto'); // 'auto' 或 'fixed'
    const fixedPort = ref(8080);
    const suggestedPorts = ref([8080, 8888, 9080, 9999, 7890, 7891]);
    
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

    // 系统提示词相关状态
    const showSystemPromptSection = ref(false); // 默认折叠
    const showPromptPreview = ref(false);
    
    // 默认系统提示词
    const defaultSystemPrompt = `你是一个专业的文件搜索助手，你的任务是将用户的自然语言查询转换为Everything搜索引擎的精确搜索语法。

Everything搜索语法规则：
- 基本搜索：直接输入关键词
- 文件类型：使用 ext: 或直接 .扩展名，如 ext:jpg 或 *.jpg
- 文件大小：使用 size: 如 size:>1MB, size:<100KB
- 日期范围：使用 dm:、dc:、da: 分别表示修改、创建、访问时间，如 dm:today, dc:thisweek
- 路径搜索：使用 path: 或直接输入路径关键词
- 逻辑操作：使用 AND、OR、NOT 或 & | !

示例转换：
- "今天的图片" → "dm:today ext:jpg|png|gif"
- "大于10MB的视频" → "size:>10MB ext:mp4|avi|mkv"
- "本周修改的文档" → "dm:thisweek ext:doc|docx|pdf|txt"

请根据用户的自然语言查询，输出最合适的Everything搜索语法。只输出搜索语法，不要包含解释。`;
    

    const loadConfig = async () => {
      try {
        const savedConfig = await window.electronAPI.getOpenAIConfig();
        if (savedConfig) {
          Object.assign(config, savedConfig);
          // 如果没有保存的系统提示词，则使用默认值
          if (!config.systemPrompt) {
            config.systemPrompt = '';
          }
        }
      } catch (error) {
        console.error('Load config failed:', error);
      }
    };

    // 自动保存功能
    const autoSave = async () => {
      if (!hasUnsavedChanges.value) return;
      
      try {
        const configData = JSON.parse(JSON.stringify(toRaw(config)));
        const openaiResult = await window.electronAPI.setOpenAIConfig(configData);
        
        if (openaiResult.success) {
          // 同时保存端口配置
          const portConfigData = {
            portMode: portConfigMode.value,
            fixedPort: portConfigMode.value === 'fixed' ? fixedPort.value : null
          };
          
          await window.electronAPI.setEverythingPortConfig(portConfigData);
          hasUnsavedChanges.value = false;
          showUnsavedWarning.value = false;
        }
      } catch (error) {
        console.error('Auto save failed:', error);
      }
    };

    // 延迟自动保存
    const scheduleAutoSave = () => {
      if (autoSaveTimeout.value) {
        clearTimeout(autoSaveTimeout.value);
      }
      autoSaveTimeout.value = setTimeout(autoSave, 2000); // 2秒后自动保存
    };

    const saveConfig = async () => {
      isSaving.value = true;
      try {
        // 使用 JSON 方法彻底移除所有 reactive 特性
        const configData = JSON.parse(JSON.stringify(toRaw(config)));
        
        // 保存OpenAI配置
        const openaiResult = await window.electronAPI.setOpenAIConfig(configData);
        if (!openaiResult.success) {
          alert(t('messages.error.configSaveFailed') + ': ' + openaiResult.error);
          return;
        }
        
        // 保存端口配置
        const portConfigData = {
          portMode: portConfigMode.value,
          fixedPort: portConfigMode.value === 'fixed' ? fixedPort.value : null
        };
        
        const portResult = await window.electronAPI.setEverythingPortConfig(portConfigData);
        if (!portResult.success) {
          alert(t('messages.error.configSaveFailed') + ': ' + portResult.error);
          return;
        }
        
        emit('close');
      } catch (error) {
        console.error('Save config failed:', error);
        alert(t('messages.error.configSaveFailed') + ': ' + error.message);
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
          testMessage.value = t('messages.success.connected');
          testSuccess.value = true;
        } else {
          testMessage.value = t('messages.error.connectionFailed') + ': ' + result.error;
          testSuccess.value = false;
        }
      } catch (error) {
        everythingStatus.value = false;
        testMessage.value = t('messages.error.connectionFailed') + ': ' + error.message;
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

    // 拖拽检测相关状态
    const mouseDownPos = ref({ x: 0, y: 0 });
    const isDragging = ref(false);
    const dragThreshold = 5; // 像素阈值，超过此值认为是拖拽

    const handleOverlayMouseDown = (event) => {
      mouseDownPos.value = { x: event.clientX, y: event.clientY };
      isDragging.value = false;
    };

    const handleOverlayMouseUp = (event) => {
      const deltaX = Math.abs(event.clientX - mouseDownPos.value.x);
      const deltaY = Math.abs(event.clientY - mouseDownPos.value.y);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // 只有移动距离小于阈值时才认为是点击
      if (distance < dragThreshold) {
        closeDialog();
      }
    };

    // 关闭对话框时检查是否有未保存更改
    const closeDialog = async () => {
      if (hasUnsavedChanges.value) {
        showUnsavedWarning.value = true;
        // 给用户一个保存的机会
        setTimeout(() => {
          if (showUnsavedWarning.value) {
            // 如果3秒后用户没有操作，自动保存并关闭
            autoSave().then(() => {
              emit('close');
            });
          }
        }, 3000);
      } else {
        emit('close');
      }
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

        addProgress(t('messages.info.connecting') + '...');
        
        const result = await window.electronAPI.autoConnectEverything();
        
        if (result.success) {
          addProgress(t('messages.success.autoConnectSuccess'), 'success');
          autoConnectResult.value = {
            success: true,
            message: result.message,
            port: result.port,
            installPath: result.installPath,
            credentials: result.credentials // 添加凭据信息
          };
          
          // 更新状态并重新测试连接
          await loadEverythingConfig();
          await testEverything();
        } else {
          addProgress(t('messages.error.autoConnectFailed', { error: result.error }), 'error');
          autoConnectResult.value = {
            success: false,
            message: result.error
          };
        }
        
      } catch (error) {
        console.error('Auto connect failed:', error);
        autoConnectProgress.value.push({
          message: t('messages.error.autoConnectError', { error: error.message }),
          status: 'error'
        });
        autoConnectResult.value = {
          success: false,
          message: t('messages.error.autoConnectError', { error: error.message })
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
        console.error('Set path failed:', error);
        autoConnectResult.value = {
          success: false,
          message: t('messages.error.pathSetFailed', { error: error.message })
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
        
        // 加载端口配置模式
        portConfigMode.value = config.portMode || 'auto';
        fixedPort.value = config.fixedPort || 8080;
      } catch (error) {
        console.error('Load Everything config failed:', error);
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
        console.log('Copied to clipboard:', text);
      } catch (error) {
        console.error('Copy failed:', error);
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

    // 验证端口号
    const isValidPort = (port) => {
      return port && Number.isInteger(port) && port >= 1 && port <= 65535;
    };

    // 系统提示词相关方法
    const toggleSystemPromptSection = () => {
      showSystemPromptSection.value = !showSystemPromptSection.value;
    };

    const resetToDefaultPrompt = () => {
      config.systemPrompt = defaultSystemPrompt;
    };

    const getCurrentPrompt = () => {
      return config.systemPrompt?.trim() || defaultSystemPrompt;
    };

    // 立即保存并关闭
    const saveAndClose = async () => {
      showUnsavedWarning.value = false;
      await saveConfig();
    };

    // 放弃更改并关闭
    const discardAndClose = () => {
      showUnsavedWarning.value = false;
      hasUnsavedChanges.value = false;
      // 重新加载配置，恢复到上次保存的状态
      loadConfig().then(() => {
        emit('close');
      });
    };

    // 语言相关方法
    const changeLanguage = () => {
      if (setLocale(selectedLanguage.value)) {
        console.log('Language switched to:', selectedLanguage.value);
      }
    };

    const getCurrentLocaleName = () => {
      const currentLocale = supportedLocales.value.find(
        locale => locale.code === getCurrentLocale()
      );
      return currentLocale ? currentLocale.nativeName : getCurrentLocale();
    };

    onMounted(() => {
      loadConfig();
      loadEverythingConfig();
      testEverything();
      // 初始化模型历史记录
      filteredModelHistory.value = modelHistory.value;
      
      // 监听配置变化，设置未保存标记
      watch([config, portConfigMode, fixedPort], () => {
        hasUnsavedChanges.value = true;
        scheduleAutoSave();
      }, { deep: true });
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
      
      // 端口配置相关
      portConfigMode,
      fixedPort,
      suggestedPorts,
      
      // 系统提示词相关
      showSystemPromptSection,
      showPromptPreview,
      defaultSystemPrompt,
      
      // 自动保存相关状态
      hasUnsavedChanges,
      showUnsavedWarning,
      
      // 语言相关
      selectedLanguage,
      supportedLocales,
      
      // 方法
      saveConfig,
      testEverything,
      filterModelHistory,
      selectModel,
      hideModelHistoryDelayed,
      closeDialog,
      autoConnectEverything,
      setManualPath,
      getProgressIcon,
      copyToClipboard,
      togglePasswordVisibility,
      isValidPort,
      // 系统提示词方法
      toggleSystemPromptSection,
      resetToDefaultPrompt,
      getCurrentPrompt,
      saveAndClose,
      discardAndClose,
      // 语言相关方法
      changeLanguage,
      getCurrentLocaleName
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

/* 端口配置样式 */
.port-config-section {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  padding: 16px;
  margin: 20px 0;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.port-config-section h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: var(--text-primary);
}

.port-config-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.radio-label input[type="radio"] {
  margin: 0;
  accent-color: var(--primary-color);
}

.radio-description {
  font-size: 12px;
  color: var(--text-secondary);
  margin-left: 24px;
  line-height: 1.4;
}

.fixed-port-input {
  margin-left: 24px;
  margin-top: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(102, 126, 234, 0.1);
  border-radius: 6px;
}

.port-input {
  max-width: 150px;
}

.port-input.error {
  border-color: var(--error-color);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-help.error-text {
  color: var(--error-color);
}

.port-suggestions {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.suggestion-label {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

.port-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.port-chip {
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.8);
  color: var(--text-secondary);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.port-chip:hover {
  background: rgba(255, 255, 255, 0.95);
  color: var(--primary-color);
  border-color: var(--primary-color);
  transform: translateY(-1px);
}

.port-chip.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
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

/* 系统提示词配置样式 */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  margin-bottom: 0;
  padding: 4px 0;
  transition: all var(--transition-normal) var(--easing);
}

.section-header:hover {
  background: rgba(102, 126, 234, 0.05);
  border-radius: 8px;
  padding: 8px 12px;
  margin: -4px -8px 0 -8px;
}

.collapse-button {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  transition: all var(--transition-normal) var(--easing);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--text-secondary);
  font-size: 12px;
  min-width: 32px;
}

.collapse-button:hover {
  background: rgba(102, 126, 234, 0.1);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.collapse-button.expanded {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.system-prompt-content {
  margin-top: 16px;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
    max-height: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    max-height: 1000px;
  }
}

.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  font-size: 14px;
  color: var(--text-primary);
  outline: none;
  transition: all var(--transition-normal) var(--easing);
  resize: vertical;
  min-height: 120px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  line-height: 1.5;
}

.form-textarea:focus {
  border-color: var(--primary-color);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.form-textarea::placeholder {
  color: var(--text-muted);
  font-style: italic;
}

.prompt-actions {
  display: flex;
  gap: 12px;
  margin: 16px 0;
  align-items: center;
}

.reset-prompt-button,
.preview-button {
  padding: 8px 16px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal) var(--easing);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.reset-prompt-button {
  background: rgba(255, 193, 7, 0.1);
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.3);
}

.reset-prompt-button:hover {
  background: rgba(255, 193, 7, 0.2);
  border-color: #f59e0b;
  transform: translateY(-1px);
}

.preview-button {
  background: rgba(255, 255, 255, 0.8);
  color: var(--text-secondary);
}

.preview-button:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: translateY(-1px);
}

.prompt-preview {
  background: rgba(248, 250, 252, 0.9);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.prompt-preview h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.prompt-preview h4::before {
  content: '👁️';
  font-size: 14px;
}

.preview-content {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(102, 126, 234, 0.1);
  border-radius: 6px;
  padding: 12px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-secondary);
  white-space: pre-wrap;
  max-height: 300px;
  overflow-y: auto;
}

.prompt-tips {
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
}

.prompt-tips h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--primary-color);
  font-weight: 600;
}

.prompt-tips ul {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.prompt-tips li {
  margin-bottom: 8px;
}

.prompt-tips li strong {
  color: var(--text-primary);
  font-weight: 600;
}

/* 未保存更改警告样式 */
.unsaved-warning {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 193, 7, 0.95);
  color: #856404;
  border: 1px solid rgba(255, 193, 7, 0.8);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(255, 193, 7, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 1001;
  animation: slideInWarning 0.3s ease-out;
  min-width: 400px;
  max-width: 90vw;
}

@keyframes slideInWarning {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.warning-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.warning-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.warning-text {
  font-size: 14px;
  font-weight: 500;
  flex: 1;
  min-width: 200px;
}

.warning-save-button,
.warning-discard-button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.warning-save-button {
  background: #28a745;
  color: white;
}

.warning-save-button:hover {
  background: #218838;
  transform: translateY(-1px);
}

.warning-discard-button {
  background: #dc3545;
  color: white;
}

.warning-discard-button:hover {
  background: #c82333;
  transform: translateY(-1px);
}

/* 保存按钮的未保存状态指示 */
.save-button:not(:disabled) {
  position: relative;
}

.save-button:not(:disabled)::after {
  content: '';
  position: absolute;
  top: -2px;
  right: -2px;
  width: 6px;
  height: 6px;
  background: #ffc107;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.save-button:not(:disabled).has-changes::after {
  opacity: 1;
}

.credential-note {
  margin-top: 12px;
  padding: 8px 12px;
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 4px;
}

.credential-note small {
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.4;
}

/* 调试配置样式 */
.debug-config-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.debug-config-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.debug-help {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.4;
  margin-top: 4px;
  margin-left: 24px;
}
</style> 