<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-container">
        <div class="search-input-wrapper">
          <input
            v-model="searchQuery"
            @keydown.enter="performSearch"
            @keydown.down.prevent="navigateHistory(1)"
            @keydown.up.prevent="navigateHistory(-1)"
            @focus="showHistory = true"
            @blur="hideHistoryDelayed"
            class="search-input"
            placeholder="输入自然语言搜索本地文件，支持智能转换为Everything语法..."
            :disabled="isSearching"
            ref="searchInput"
          />
          <button
            @click="performSearch"
            :disabled="isSearching || !searchQuery.trim()"
            class="search-button"
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
        <div class="results-count">
          找到 {{ searchResults.length }} 个文件
          <span v-if="lastEverythingQuery && lastEverythingQuery !== lastSearchQuery">
            (使用查询: {{ lastEverythingQuery }})
          </span>
        </div>
        <div class="results-actions">
          <button @click="exportResults" class="action-button">导出结果</button>
          <button @click="clearResults" class="action-button">清空结果</button>
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
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-text">开始搜索本地文件</div>
        <div class="empty-state-subtext">
          支持自然语言输入，AI会自动转换为Everything搜索语法
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-else-if="isSearching" class="loading-state">
        <div class="loading-spinner"></div>
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

    <!-- 配置按钮 -->
    <button @click="showConfigDialog = true" class="config-button" title="设置">
      ⚙️
    </button>

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

    // 方法
    const performSearch = async () => {
      const query = searchQuery.value.trim();
      if (!query) return;

      isSearching.value = true;
      errorMessage.value = '';
      hasSearched.value = true;
      lastSearchQuery.value = query;

      try {
        const result = await window.electronAPI.searchFiles(query);
        
        if (result.success) {
          searchResults.value = result.results || [];
          lastEverythingQuery.value = result.everythingQuery || query;
          
          // 在控制台打印搜索结果列表
          console.log('🔍 搜索完成 - 查询:', query);
          console.log('📋 搜索结果数量:', searchResults.value.length);
          console.log('📄 搜索结果列表:', searchResults.value);
          
          await loadSearchHistory(); // 重新加载历史记录
        } else {
          errorMessage.value = result.error || '搜索失败';
          searchResults.value = [];
        }
      } catch (error) {
        console.error('搜索错误:', error);
        errorMessage.value = '搜索过程中发生错误: ' + error.message;
        searchResults.value = [];
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

    // 生命周期
    onMounted(() => {
      loadSearchHistory();
      loadDisplayFieldsConfig();
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
      
      // 计算属性
      filteredHistory,
      sortedResults,
      
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
      clearResults
    };
  }
};
</script> 