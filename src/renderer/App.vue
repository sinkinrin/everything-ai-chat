<template>
  <div class="app-container">
    <!-- 自定义标题栏 -->
    <div class="custom-titlebar">
      <div class="titlebar-left">
        <div class="app-icon">🔍</div>
        <div class="app-title">Everything AI Chat</div>
        <div class="everything-status">
          <div class="status-dot" :class="everythingStatusClass"></div>
          <span class="status-text">{{ everythingStatusText }}</span>
        </div>
      </div>
      <div class="window-controls">
        <button @click="minimizeWindow" class="control-button minimize" title="最小化">
          <span>−</span>
        </button>
        <button @click="toggleMaximize" class="control-button maximize" :title="isMaximized ? '还原' : '最大化'">
          <span>{{ isMaximized ? '⧉' : '□' }}</span>
        </button>
        <button @click="closeWindow" class="control-button close" title="关闭">
          <span>×</span>
        </button>
      </div>
    </div>

    <!-- Hero搜索区域 -->
    <div class="search-section">
      <div class="search-container">
        <div class="search-title">🔍 智能文件搜索</div>
        <div class="search-input-wrapper">
          <input
            v-model="searchQuery"
            @keydown.enter="performSearch"
            @keydown.down.prevent="navigateHistory(1)"
            @keydown.up.prevent="navigateHistory(-1)"
            @focus="showHistory = true"
            @blur="hideHistoryDelayed"
            class="search-input"
            placeholder="输入自然语言查询，AI将转换为Everything语法..."
            :disabled="isSearching"
            ref="searchInput"
          />
          <button
            @click="performSearch"
            :disabled="isSearching || !searchQuery.trim()"
            class="search-button"
            :class="{ 'searching': isSearching }"
          >
            {{ isSearching ? '搜索中...' : '搜索' }}
          </button>
        </div>

        <!-- 搜索历史下拉 -->
        <div v-if="showHistory && filteredHistory.length > 0" class="search-history">
          <div
            v-for="(item, index) in filteredHistory"
            :key="item.id"
            @click="selectHistoryItem(item)"
            :class="['search-history-item', { active: historySelectedIndex === index }]"
          >
            <div class="search-history-query">{{ item.query }}</div>
            <div v-if="item.everything_query !== item.query" class="search-history-everything">
              {{ item.everything_query }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 结果区域 -->
    <div class="results-section">
      <!-- 结果头部 -->
      <div v-if="searchResults.length > 0" class="results-header">
        <div class="results-info">
          <div class="results-count">
            找到 {{ searchResults.length.toLocaleString() }} 个文件
          </div>
          <div v-if="lastEverythingQuery && lastEverythingQuery !== lastSearchQuery" class="everything-query">
            使用查询: <code>{{ lastEverythingQuery }}</code>
          </div>
        </div>
        <div class="results-actions">
          <button @click="exportResults" class="action-button">
            <span class="button-icon">📤</span>
            导出结果
          </button>
          <button @click="clearResults" class="action-button">
            <span class="button-icon">🗑️</span>
            清空结果
          </button>
        </div>
      </div>

      <!-- 文件列表 -->
      <div v-if="searchResults.length > 0" class="file-list">
        <div class="file-list-header">
          <div
            @click="sortBy('name')"
            :class="['file-list-column', 'col-name', 'sortable', getSortClass('name')]"
          >
            文件名
          </div>
          <div
            @click="sortBy('path')"
            :class="['file-list-column', 'col-path', 'sortable', getSortClass('path')]"
          >
            路径
          </div>
          <div
            @click="sortBy('size')"
            :class="['file-list-column', 'col-size', 'sortable', getSortClass('size')]"
          >
            大小
          </div>
          <div
            @click="sortBy('modified')"
            :class="['file-list-column', 'col-modified', 'sortable', getSortClass('modified')]"
          >
            修改时间
          </div>
          <div
            v-if="displayFields.created"
            @click="sortBy('created')"
            :class="['file-list-column', 'col-created', 'sortable', getSortClass('created')]"
          >
            创建时间
          </div>
          <div
            v-if="displayFields.accessed"
            @click="sortBy('accessed')"
            :class="['file-list-column', 'col-accessed', 'sortable', getSortClass('accessed')]"
          >
            访问时间
          </div>
          <div
            v-if="displayFields.attributes"
            @click="sortBy('attributes')"
            :class="['file-list-column', 'col-attributes', 'sortable', getSortClass('attributes')]"
          >
            属性
          </div>
          <div
            v-if="displayFields.run_count"
            @click="sortBy('run_count')"
            :class="['file-list-column', 'col-run-count', 'sortable', getSortClass('run_count')]"
          >
            运行次数
          </div>
          <div
            @click="sortBy('extension')"
            :class="['file-list-column', 'col-type', 'sortable', getSortClass('extension')]"
          >
            类型
          </div>
        </div>

        <div class="file-list-body">
          <div
            v-for="file in sortedResults"
            :key="file.path"
            @click="openFile(file)"
            @contextmenu.prevent="showFileContextMenu(file, $event)"
            class="file-row"
          >
            <div class="file-cell col-name">
              <span class="file-icon">{{ getFileIcon(file.extension) }}</span>
              <span class="file-name">{{ file.name }}</span>
            </div>
            <div class="file-cell col-path">
              <span class="file-path">{{ file.directory }}</span>
            </div>
            <div class="file-cell col-size">
              <span class="file-size">{{ formatFileSize(file.size) }}</span>
            </div>
            <div class="file-cell col-modified">
              <span class="file-modified">{{ formatDate(file.modified) }}</span>
            </div>
            <div v-if="displayFields.created" class="file-cell col-created">
              <span class="file-created">{{ formatDate(file.created) }}</span>
            </div>
            <div v-if="displayFields.accessed" class="file-cell col-accessed">
              <span class="file-accessed">{{ formatDate(file.accessed) }}</span>
            </div>
            <div v-if="displayFields.attributes" class="file-cell col-attributes">
              <span class="file-attributes">{{ file.attributes || '-' }}</span>
            </div>
            <div v-if="displayFields.run_count" class="file-cell col-run-count">
              <span class="file-run-count">{{ file.run_count || 0 }}</span>
            </div>
            <div class="file-cell col-type">
              <span class="file-type">{{ file.extension || 'FILE' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!isSearching && !hasSearched" class="empty-state">
        <div class="empty-state-icon">✨🔍✨</div>
        <div class="empty-state-text">开始您的智能搜索之旅</div>
        <div class="empty-state-subtext">
          输入自然语言，AI 将为您转换为 Everything 精确搜索语法
        </div>
        <div class="search-suggestions">
          <div class="suggestion-title">💡 试试这些搜索：</div>
          <div class="suggestion-items">
            <span class="suggestion-item" @click="trySuggestion('今天的图片')">今天的图片</span>
            <span class="suggestion-item" @click="trySuggestion('大于10MB的视频')">大于10MB的视频</span>
            <span class="suggestion-item" @click="trySuggestion('本周修改的文档')">本周修改的文档</span>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-else-if="isSearching" class="loading-state">
        <div class="loading-spinner"></div>
        <div class="loading-text">智能搜索中...</div>
      </div>

      <!-- 无结果状态 -->
      <div v-else-if="hasSearched && searchResults.length === 0" class="empty-state">
        <div class="empty-state-icon">📁</div>
        <div class="empty-state-text">未找到匹配的文件</div>
        <div class="empty-state-subtext">尝试使用不同的关键词或检查Everything是否正在运行</div>
      </div>

      <!-- 错误状态 -->
      <div v-if="errorMessage" class="error-state">
        <div class="error-icon">⚠️</div>
        <div class="error-message">{{ errorMessage }}</div>
      </div>
    </div>

    <!-- 状态栏 -->
    <div class="status-bar">
      <div class="status-left">
        <span class="status-text">{{ isSearching ? '搜索中...' : '就绪' }}</span>
        <span v-if="everythingConnected" class="status-separator">|</span>
        <span v-if="everythingConnected" class="status-text">Everything v1.4.1</span>
      </div>
      <div class="status-right">
        <span v-if="searchDuration > 0" class="status-text">搜索耗时: {{ (searchDuration / 1000).toFixed(2) }}s</span>
        <button @click="showConfigDialog = true" class="status-settings-button" title="设置">
          ⚙️
        </button>
      </div>
    </div>

    <!-- 配置对话框 -->
    <ConfigDialog v-if="showConfigDialog" @close="showConfigDialog = false" />
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import ConfigDialog from './components/ConfigDialog.vue';

export default {
  name: 'App',
  components: {
    ConfigDialog
  },
  setup() {
    // 响应式数据
    const searchQuery = ref('');
    const searchResults = ref([]);
    const searchHistory = ref([]);
    const isSearching = ref(false);
    const hasSearched = ref(false);
    const errorMessage = ref('');
    const showHistory = ref(false);
    const historySelectedIndex = ref(-1);
    const showConfigDialog = ref(false);
    const lastSearchQuery = ref('');
    const lastEverythingQuery = ref('');

    // 标题栏相关状态
    const everythingConnected = ref(false);
    const everythingTesting = ref(false);
    const isMaximized = ref(false);
    const searchStartTime = ref(0);
    const searchDuration = ref(0);

    // 字段显示配置
    const displayFields = ref({
      accessed: false,
      attributes: false,
      created: false,
      recently_changed: false,
      run_count: false,
      file_list_filename: false
    });

    // 排序状态
    const sortState = reactive({
      field: 'name',
      direction: 'asc' // 'asc' or 'desc'
    });

    // 搜索输入框引用
    const searchInput = ref(null);

    // 计算属性
    const filteredHistory = computed(() => {
      if (!searchQuery.value.trim()) {
        return searchHistory.value.slice(0, 10);
      }
      return searchHistory.value.filter(item =>
        item.query.toLowerCase().includes(searchQuery.value.toLowerCase())
      ).slice(0, 10);
    });

    const sortedResults = computed(() => {
      const results = [...searchResults.value];
      const { field, direction } = sortState;

      results.sort((a, b) => {
        let aValue = a[field] || '';
        let bValue = b[field] || '';

        // 特殊处理不同字段
        if (field === 'size') {
          aValue = parseInt(aValue) || 0;
          bValue = parseInt(bValue) || 0;
        } else if (field === 'modified') {
          aValue = new Date(aValue).getTime() || 0;
          bValue = new Date(bValue).getTime() || 0;
        } else {
          aValue = String(aValue).toLowerCase();
          bValue = String(bValue).toLowerCase();
        }

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
      });

      return results;
    });

    // 标题栏计算属性
    const everythingStatusClass = computed(() => {
      if (everythingTesting.value) return 'connecting';
      return everythingConnected.value ? 'connected' : 'disconnected';
    });

    const everythingStatusText = computed(() => {
      if (everythingTesting.value) return '连接中';
      return everythingConnected.value ? '已连接' : '未连接';
    });

    // 方法
    const performSearch = async () => {
      const query = searchQuery.value.trim();
      if (!query) return;

      isSearching.value = true;
      errorMessage.value = '';
      hasSearched.value = true;
      lastSearchQuery.value = query;
      searchStartTime.value = Date.now();

      try {
        const result = await window.electronAPI.searchFiles(query);

        if (result.success) {
          searchResults.value = result.results || [];
          lastEverythingQuery.value = result.everythingQuery || query;
          searchDuration.value = Date.now() - searchStartTime.value;

          await loadSearchHistory(); // 重新加载历史记录
        } else {
          errorMessage.value = result.error || '搜索失败';
          searchResults.value = [];
          searchDuration.value = 0;
        }
      } catch (error) {
        console.error('搜索错误:', error);
        errorMessage.value = '搜索过程中发生错误: ' + error.message;
        searchResults.value = [];
        searchDuration.value = 0;
      } finally {
        isSearching.value = false;
        showHistory.value = false;
      }
    };

    const loadSearchHistory = async () => {
      try {
        const history = await window.electronAPI.getSearchHistory();
        searchHistory.value = history || [];
      } catch (error) {
        console.error('加载搜索历史失败:', error);
      }
    };

    const loadDisplayFieldsConfig = async () => {
      try {
        const config = await window.electronAPI.getOpenAIConfig();
        if (config && config.displayFields) {
          displayFields.value = { ...displayFields.value, ...config.displayFields };
        }
      } catch (error) {
        console.error('加载字段显示配置失败:', error);
      }
    };

    const selectHistoryItem = (item) => {
      searchQuery.value = item.query;
      showHistory.value = false;
      historySelectedIndex.value = -1;
      nextTick(() => {
        performSearch();
      });
    };

    const navigateHistory = (direction) => {
      if (!showHistory.value || filteredHistory.value.length === 0) return;

      historySelectedIndex.value += direction;

      if (historySelectedIndex.value < 0) {
        historySelectedIndex.value = filteredHistory.value.length - 1;
      } else if (historySelectedIndex.value >= filteredHistory.value.length) {
        historySelectedIndex.value = 0;
      }

      if (historySelectedIndex.value >= 0) {
        searchQuery.value = filteredHistory.value[historySelectedIndex.value].query;
      }
    };

    const hideHistoryDelayed = () => {
      setTimeout(() => {
        showHistory.value = false;
        historySelectedIndex.value = -1;
      }, 200);
    };

    const sortBy = (field) => {
      if (sortState.field === field) {
        sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
      } else {
        sortState.field = field;
        sortState.direction = 'asc';
      }
    };

    const getSortClass = (field) => {
      if (sortState.field !== field) return '';
      return sortState.direction === 'asc' ? 'sort-asc' : 'sort-desc';
    };

    const formatFileSize = (size) => {
      if (!size) return '';
      const bytes = parseInt(size);
      if (isNaN(bytes)) return size;

      const units = ['B', 'KB', 'MB', 'GB', 'TB'];
      let unitIndex = 0;
      let fileSize = bytes;

      while (fileSize >= 1024 && unitIndex < units.length - 1) {
        fileSize /= 1024;
        unitIndex++;
      }

      return `${fileSize.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
    };

    const formatDate = (dateString) => {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch {
        return dateString;
      }
    };

    const openFile = (file) => {
      // TODO: 实现文件打开功能
      if (window.electronAPI.openPath) {
        window.electronAPI.openPath(file.path);
      }
    };

    const showFileContextMenu = (file, event) => {
      // TODO: 实现右键菜单
      console.log('右键菜单', file, event);
    };

    const exportResults = () => {
      // TODO: 实现导出功能
      console.log('导出结果', searchResults.value);
    };

    const clearResults = () => {
      searchResults.value = [];
      hasSearched.value = false;
      errorMessage.value = '';
    };

    const trySuggestion = (suggestion) => {
      searchQuery.value = suggestion;
      performSearch();
    };

    // 获取文件类型图标
    const getFileIcon = (extension) => {
      const ext = extension?.toLowerCase() || '';

      const iconMap = {
        // 文档类型
        'pdf': '📄',
        'doc': '📄', 'docx': '📄',
        'xls': '📊', 'xlsx': '📊',
        'ppt': '📈', 'pptx': '📈',
        'txt': '📝',
        'rtf': '📝',

        // 图片类型
        'jpg': '🖼️', 'jpeg': '🖼️',
        'png': '🖼️',
        'gif': '🖼️',
        'bmp': '🖼️',
        'svg': '🖼️',
        'webp': '🖼️',
        'ico': '🖼️',

        // 视频类型
        'mp4': '🎬',
        'avi': '🎬',
        'mkv': '🎬',
        'mov': '🎬',
        'wmv': '🎬',
        'flv': '🎬',
        'webm': '🎬',

        // 音频类型
        'mp3': '🎵',
        'wav': '🎵',
        'flac': '🎵',
        'aac': '🎵',
        'ogg': '🎵',
        'm4a': '🎵',

        // 压缩文件
        'zip': '📦',
        'rar': '📦',
        '7z': '📦',
        'tar': '📦',
        'gz': '📦',

        // 代码文件
        'js': '💻', 'ts': '💻',
        'html': '💻', 'htm': '💻',
        'css': '💻', 'scss': '💻',
        'py': '💻',
        'java': '💻',
        'cpp': '💻', 'c': '💻',
        'php': '💻',
        'go': '💻',
        'rs': '💻',
        'vue': '💻',
        'jsx': '💻', 'tsx': '💻',

        // 可执行文件
        'exe': '⚙️',
        'msi': '⚙️',
        'deb': '⚙️',
        'rpm': '⚙️',
        'dmg': '⚙️',

        // 字体文件
        'ttf': '🔤', 'otf': '🔤',
        'woff': '🔤', 'woff2': '🔤',

        // 其他
        'json': '📋',
        'xml': '📋',
        'csv': '📊',
        'log': '📜'
      };

      return iconMap[ext] || '📄';
    };

    // 窗口控制方法
    const minimizeWindow = () => {
      if (window.electronAPI.minimizeWindow) {
        window.electronAPI.minimizeWindow();
      }
    };

    const toggleMaximize = () => {
      if (window.electronAPI.toggleMaximize) {
        window.electronAPI.toggleMaximize();
        isMaximized.value = !isMaximized.value;
      }
    };

    const closeWindow = () => {
      if (window.electronAPI.closeWindow) {
        window.electronAPI.closeWindow();
      }
    };

    // Everything连接状态检测
    const checkEverythingStatus = async () => {
      everythingTesting.value = true;
      try {
        const result = await window.electronAPI.testEverythingConnection();
        everythingConnected.value = result;
      } catch (error) {
        everythingConnected.value = false;
      } finally {
        everythingTesting.value = false;
      }
    };

    // 生命周期
    onMounted(() => {
      loadSearchHistory();
      loadDisplayFieldsConfig();
      checkEverythingStatus();

      // 定期检查Everything状态
      setInterval(checkEverythingStatus, 30000); // 每30秒检查一次
    });

        return {
      // 数据
      searchQuery,
      searchResults,
      searchHistory,
      isSearching,
      hasSearched,
      errorMessage,
      showHistory,
      historySelectedIndex,
      showConfigDialog,
      lastSearchQuery,
      lastEverythingQuery,
      searchInput,
      displayFields,

      // 标题栏数据
      everythingConnected,
      everythingTesting,
      isMaximized,
      searchDuration,

      // 计算属性
      filteredHistory,
      sortedResults,
      everythingStatusClass,
      everythingStatusText,

      // 方法
      performSearch,
      selectHistoryItem,
      navigateHistory,
      hideHistoryDelayed,
      sortBy,
      getSortClass,
      formatFileSize,
      formatDate,
      openFile,
      showFileContextMenu,
      exportResults,
      clearResults,
      trySuggestion,

      // 窗口控制方法
      minimizeWindow,
      toggleMaximize,
      closeWindow,
      checkEverythingStatus,

      // 辅助方法
      getFileIcon
    };
  }
};
</script>
