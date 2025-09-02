<template>
  <div class="debug-window">
    <!-- 调试窗口标题栏 -->
    <div class="debug-titlebar">
      <div class="debug-titlebar-left">
        <span class="debug-title">🤖 AI响应调试</span>
      </div>
      <div class="debug-titlebar-controls">
        <button @click="clearDebugOutput" class="debug-control-btn clear" title="清空调试输出">
          🗑️
        </button>
        <button @click="toggleAlwaysOnTop" class="debug-control-btn pin" :class="{ active: isAlwaysOnTop }" title="置顶显示">
          📌
        </button>
        <button @click="closeWindow" class="debug-control-btn close" title="关闭调试窗口">
          ×
        </button>
      </div>
    </div>

    <!-- 调试内容区域 -->
    <div class="debug-content" ref="debugContent">
      <!-- 空状态 -->
      <div v-if="debugMessages.length === 0" class="debug-empty">
        <div class="debug-empty-icon">🔍</div>
        <div class="debug-empty-text">等待AI响应...</div>
        <div class="debug-empty-subtext">执行搜索后这里会显示AI的实时响应过程</div>
      </div>

      <!-- 调试消息列表 -->
      <div v-else class="debug-messages">
        <div
          v-for="(message, index) in debugMessages"
          :key="index"
          :class="['debug-message', `debug-${message.type}`]"
        >
          <div class="debug-timestamp">{{ formatDebugTime(message.timestamp) }}</div>
          <div class="debug-message-content">
            <div v-if="message.type === 'stream'" class="debug-stream-chunk">
              {{ message.content }}
            </div>
            <div v-else-if="message.type === 'result'" class="debug-result">
              <strong>转换结果:</strong> {{ message.content }}
            </div>
            <div v-else-if="message.type === 'error'" class="debug-error">
              <strong>错误:</strong> {{ message.content }}
            </div>
            <div v-else class="debug-info">
              {{ message.content }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 调试工具栏 -->
    <div class="debug-toolbar">
      <div class="debug-stats">
        <span class="stats-item">消息: {{ debugMessages.length }}</span>
        <span class="stats-separator">|</span>
        <span class="stats-item">状态: {{ isConnected ? '已连接' : '未连接' }}</span>
      </div>
      <div class="debug-actions">
        <button @click="exportDebugLog" class="debug-action-btn" title="导出调试日志">
          📤 导出
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue';

export default {
  name: 'DebugWindow',
  setup() {
    // 响应式数据
    const debugMessages = ref([]);
    const debugContent = ref(null);
    const isAlwaysOnTop = ref(false);
    const isConnected = ref(true);

    // 方法
    const addDebugMessage = (type, content) => {
      debugMessages.value.push({
        type,
        content,
        timestamp: Date.now()
      });

      // 自动滚动到底部
      nextTick(() => {
        if (debugContent.value) {
          debugContent.value.scrollTop = debugContent.value.scrollHeight;
        }
      });

      // 限制消息数量
      if (debugMessages.value.length > 200) {
        debugMessages.value.splice(0, debugMessages.value.length - 200);
      }
    };

    const clearDebugOutput = () => {
      debugMessages.value = [];
    };

    const formatDebugTime = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3
      });
    };

    const toggleAlwaysOnTop = async () => {
      if (window.electronAPI?.setAlwaysOnTop) {
        isAlwaysOnTop.value = !isAlwaysOnTop.value;
        await window.electronAPI.setAlwaysOnTop(isAlwaysOnTop.value);
      }
    };

    const closeWindow = () => {
      if (window.electronAPI?.closeDebugWindow) {
        window.electronAPI.closeDebugWindow();
      }
    };

    const exportDebugLog = async () => {
      try {
        const logContent = debugMessages.value.map(msg => 
          `[${formatDebugTime(msg.timestamp)}] ${msg.type.toUpperCase()}: ${msg.content}`
        ).join('\n');

        if (window.electronAPI?.saveDebugLog) {
          await window.electronAPI.saveDebugLog(logContent);
        }
      } catch (error) {
        console.error('导出调试日志失败:', error);
      }
    };

    // 监听来自主进程的调试消息
    onMounted(() => {
      if (window.electronAPI?.on) {
        // 监听AI调试流式输出
        window.electronAPI.on('ai-debug-stream', (data) => {
          addDebugMessage(data.type || 'stream', data.content || '');
        });

        // 监听AI调试结果
        window.electronAPI.on('ai-debug-result', (data) => {
          addDebugMessage('result', data.result || '');
        });

        // 监听AI调试错误
        window.electronAPI.on('ai-debug-error', (data) => {
          addDebugMessage('error', data.error || '');
        });

        // 监听清空调试输出命令
        window.electronAPI.on('clear-debug-output', () => {
          clearDebugOutput();
        });

        // 监听配置更新事件
        window.electronAPI.on('config-updated', (data) => {
          console.log('调试窗口收到配置更新:', data);
          if (data.type === 'openai' && !data.config.enableStreamDebug) {
            console.log('调试功能已关闭，准备关闭调试窗口');
            // 调试功能被关闭，窗口将由主进程关闭
            // 这里可以添加一些清理逻辑或显示提示信息
          }
        });
      }
    });

    return {
      debugMessages,
      debugContent,
      isAlwaysOnTop,
      isConnected,
      addDebugMessage,
      clearDebugOutput,
      formatDebugTime,
      toggleAlwaysOnTop,
      closeWindow,
      exportDebugLog
    };
  }
};
</script>

<style scoped>
.debug-window {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #1e1e1e;
  color: #e0e0e0;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  overflow: hidden;
}

/* 调试窗口标题栏 */
.debug-titlebar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  background: #2d2d2d;
  border-bottom: 1px solid #404040;
  padding: 0 12px;
  -webkit-app-region: drag;
  user-select: none;
}

.debug-titlebar-left {
  display: flex;
  align-items: center;
}

.debug-title {
  color: #e0e0e0;
  font-weight: 500;
  font-size: 13px;
}

.debug-titlebar-controls {
  display: flex;
  gap: 4px;
  -webkit-app-region: no-drag;
}

.debug-control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #b0b0b0;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.debug-control-btn:hover {
  background: #404040;
  color: #ffffff;
}

.debug-control-btn.close:hover {
  background: #e74c3c;
  color: white;
}

.debug-control-btn.pin.active {
  background: #3498db;
  color: white;
}

/* 调试内容区域 */
.debug-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  background: #1e1e1e;
  min-height: 0; /* 确保flexbox正确处理溢出 */
}

/* 调试消息容器 */
.debug-messages {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: calc(20 * 24px); /* 预留20行的最小高度，每行约24px */
}

.debug-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(20 * 24px); /* 与debug-messages保持一致的最小高度 */
  height: 100%;
  color: #666;
  text-align: center;
  padding: 20px;
}

.debug-empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.debug-empty-text {
  font-size: 16px;
  margin-bottom: 8px;
  color: #888;
}

.debug-empty-subtext {
  font-size: 12px;
  color: #666;
}

.debug-messages {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.debug-message {
  padding: 8px 10px;
  border-radius: 4px;
  border-left: 3px solid #404040;
  background: #262626;
  min-height: 20px;
  line-height: 1.4;
  word-wrap: break-word;
}

.debug-message.debug-stream {
  border-left-color: #3498db;
}

.debug-message.debug-result {
  border-left-color: #2ecc71;
  background: #1a2f1a;
}

.debug-message.debug-error {
  border-left-color: #e74c3c;
  background: #2f1a1a;
}

.debug-message.debug-info {
  border-left-color: #f39c12;
}

.debug-timestamp {
  font-size: 10px;
  color: #777;
  margin-bottom: 2px;
}

.debug-message-content {
  line-height: 1.5;
  word-wrap: break-word;
  white-space: pre-wrap;
  max-width: 100%;
  overflow-wrap: break-word;
}

.debug-stream-chunk {
  color: #87ceeb;
}

.debug-result {
  color: #90ee90;
}

.debug-error {
  color: #ff6b6b;
}

.debug-info {
  color: #ffd700;
}

/* 调试工具栏 */
.debug-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  background: #2d2d2d;
  border-top: 1px solid #404040;
  padding: 0 12px;
  font-size: 11px;
}

.debug-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #999;
}

.stats-item {
  white-space: nowrap;
}

.stats-separator {
  color: #555;
}

.debug-actions {
  display: flex;
  gap: 8px;
}

.debug-action-btn {
  padding: 4px 8px;
  background: #404040;
  border: none;
  border-radius: 3px;
  color: #e0e0e0;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s ease;
}

.debug-action-btn:hover {
  background: #555;
}

/* 滚动条样式 */
.debug-content::-webkit-scrollbar {
  width: 12px;
}

.debug-content::-webkit-scrollbar-track {
  background: #2d2d2d;
  border-radius: 6px;
}

.debug-content::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 6px;
  border: 2px solid #2d2d2d;
}

.debug-content::-webkit-scrollbar-thumb:hover {
  background: #666;
}

.debug-content::-webkit-scrollbar-thumb:active {
  background: #777;
}

/* Firefox滚动条样式 */
* {
  scrollbar-width: thin;
  scrollbar-color: #555 #2d2d2d;
}
</style>
