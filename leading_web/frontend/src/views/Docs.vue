<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- 侧边栏目录 -->
        <aside class="lg:w-64 flex-shrink-0">
          <div class="card p-6 sticky top-8">
            <h3 class="font-semibold text-gray-900 mb-4">文档目录</h3>
            <nav class="space-y-1">
              <a 
                v-for="item in docSections" 
                :key="item.id"
                :href="`#${item.id}`"
                class="block py-2 px-3 text-sm text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                :class="{ 'text-primary-600 bg-primary-50': activeSection === item.id }"
                @click="setActiveSection(item.id)"
              >
                {{ item.title }}
              </a>
            </nav>
          </div>
        </aside>

        <!-- 主内容 -->
        <main class="flex-1">
          <div class="card p-8">
            <!-- 文档标题 -->
            <div class="mb-12">
              <h1 class="text-4xl font-bold text-gray-900 mb-4">
                Everything AI Chat 使用文档
              </h1>
              <p class="text-xl text-gray-600">
                完整的用户指南，帮助您充分发挥Everything AI Chat的强大功能
              </p>
            </div>

            <!-- 快速开始 -->
            <section id="quick-start" class="mb-16">
              <h2 class="text-3xl font-bold text-gray-900 mb-6">快速开始</h2>
              
              <div class="prose prose-lg max-w-none">
                <h3>安装要求</h3>
                <ul>
                  <li><strong>Windows:</strong> Windows 10 或更高版本</li>
                  <li><strong>Mac:</strong> macOS 10.15 或更高版本（开发中）</li>
                  <li><strong>内存:</strong> 推荐 4GB 以上</li>
                  <li><strong>存储:</strong> 至少 100MB 可用空间</li>
                </ul>

                <h3>安装步骤</h3>
                <ol>
                  <li>从<router-link to="/download" class="link">下载页面</router-link>获取最新版本</li>
                  <li>运行安装程序并按照提示完成安装</li>
                  <li>首次启动时会自动配置Everything服务</li>
                  <li>等待文件索引完成（通常需要几分钟）</li>
                  <li>开始使用智能文件搜索功能</li>
                </ol>
              </div>
            </section>

            <!-- 基础功能 -->
            <section id="basic-features" class="mb-16">
              <h2 class="text-3xl font-bold text-gray-900 mb-6">基础功能</h2>
              
              <div class="space-y-8">
                <div class="card p-6 bg-blue-50 border-l-4 border-blue-400">
                  <h3 class="text-xl font-semibold text-gray-900 mb-3">
                    <Search class="w-5 h-5 inline mr-2 text-blue-600" />
                    文件搜索
                  </h3>
                  <div class="prose">
                    <p>在搜索框中输入文件名、路径或其他搜索条件：</p>
                    <ul>
                      <li><code>report.docx</code> - 搜索特定文件名</li>
                      <li><code>*.pdf</code> - 搜索所有PDF文件</li>
                      <li><code>C:\Users\Documents\</code> - 搜索特定路径下的文件</li>
                      <li><code>size:>1MB</code> - 搜索大于1MB的文件</li>
                    </ul>
                  </div>
                </div>

                <div class="card p-6 bg-purple-50 border-l-4 border-purple-400">
                  <h3 class="text-xl font-semibold text-gray-900 mb-3">
                    <MessageCircle class="w-5 h-5 inline mr-2 text-purple-600" />
                    AI 智能对话
                  </h3>
                  <div class="prose">
                    <p>使用自然语言与AI对话，让AI帮您找到需要的文件：</p>
                    <ul>
                      <li>"帮我找一下昨天创建的Excel表格"</li>
                      <li>"查找最大的视频文件"</li>
                      <li>"在桌面上有什么PDF文档吗？"</li>
                      <li>"整理一下Downloads文件夹"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <!-- 高级功能 -->
            <section id="advanced-features" class="mb-16">
              <h2 class="text-3xl font-bold text-gray-900 mb-6">高级功能</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="card p-6">
                  <h3 class="text-lg font-semibold text-gray-900 mb-3">正则表达式</h3>
                  <p class="text-gray-600 mb-4">支持强大的正则表达式搜索：</p>
                  <div class="bg-gray-100 rounded p-3 font-mono text-sm">
                    <div>regex:^report\d+\.pdf$</div>
                    <div class="text-gray-500 mt-1">匹配 report1.pdf, report2.pdf 等</div>
                  </div>
                </div>

                <div class="card p-6">
                  <h3 class="text-lg font-semibold text-gray-900 mb-3">文件属性搜索</h3>
                  <p class="text-gray-600 mb-4">根据文件属性进行精确搜索：</p>
                  <div class="space-y-2 text-sm">
                    <div><code class="bg-gray-100 px-2 py-1 rounded">size:>100MB</code> - 大小过滤</div>
                    <div><code class="bg-gray-100 px-2 py-1 rounded">dm:today</code> - 修改日期</div>
                    <div><code class="bg-gray-100 px-2 py-1 rounded">ext:pdf;docx</code> - 文件类型</div>
                  </div>
                </div>

                <div class="card p-6">
                  <h3 class="text-lg font-semibold text-gray-900 mb-3">快捷键</h3>
                  <p class="text-gray-600 mb-4">提高效率的快捷键：</p>
                  <div class="space-y-2 text-sm">
                    <div><kbd class="bg-gray-200 px-2 py-1 rounded">Ctrl+F</kbd> - 打开搜索</div>
                    <div><kbd class="bg-gray-200 px-2 py-1 rounded">F3</kbd> - 查找下一个</div>
                    <div><kbd class="bg-gray-200 px-2 py-1 rounded">Ctrl+Enter</kbd> - 在新窗口打开</div>
                  </div>
                </div>

                <div class="card p-6">
                  <h3 class="text-lg font-semibold text-gray-900 mb-3">智能筛选</h3>
                  <p class="text-gray-600 mb-4">AI辅助的智能文件分类：</p>
                  <ul class="text-sm space-y-1">
                    <li>• 自动识别文档类型</li>
                    <li>• 按创建时间分组</li>
                    <li>• 重复文件检测</li>
                    <li>• 智能标签推荐</li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- 设置配置 -->
            <section id="settings" class="mb-16">
              <h2 class="text-3xl font-bold text-gray-900 mb-6">设置与配置</h2>
              
              <div class="space-y-6">
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 mb-4">索引设置</h3>
                  <div class="card p-6 bg-gray-50">
                    <ul class="space-y-2 text-gray-700">
                      <li>• <strong>包含路径:</strong> 设置要索引的文件夹</li>
                      <li>• <strong>排除路径:</strong> 设置要忽略的文件夹</li>
                      <li>• <strong>文件类型:</strong> 选择要索引的文件类型</li>
                      <li>• <strong>实时更新:</strong> 开启文件变化的实时监控</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 class="text-xl font-semibold text-gray-900 mb-4">AI 配置</h3>
                  <div class="card p-6 bg-gray-50">
                    <ul class="space-y-2 text-gray-700">
                      <li>• <strong>API 密钥:</strong> 配置AI服务的API密钥</li>
                      <li>• <strong>语言模型:</strong> 选择对话使用的AI模型</li>
                      <li>• <strong>响应速度:</strong> 调整AI响应的速度偏好</li>
                      <li>• <strong>隐私模式:</strong> 启用本地处理模式</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <!-- 故障排除 -->
            <section id="troubleshooting" class="mb-16">
              <h2 class="text-3xl font-bold text-gray-900 mb-6">故障排除</h2>
              
              <div class="space-y-6">
                <div class="card p-6 border-l-4 border-yellow-400">
                  <h3 class="text-lg font-semibold text-gray-900 mb-3">常见问题</h3>
                  <div class="space-y-4">
                    <div>
                      <h4 class="font-medium text-gray-900">搜索结果为空</h4>
                      <p class="text-gray-600 text-sm mt-1">
                        检查索引是否完成，或重新构建索引。确认Everything服务正在运行。
                      </p>
                    </div>
                    <div>
                      <h4 class="font-medium text-gray-900">AI 无法响应</h4>
                      <p class="text-gray-600 text-sm mt-1">
                        检查网络连接和API密钥配置。尝试重启应用程序。
                      </p>
                    </div>
                    <div>
                      <h4 class="font-medium text-gray-900">程序启动慢</h4>
                      <p class="text-gray-600 text-sm mt-1">
                        首次启动需要构建索引，这是正常现象。后续启动会更快。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- 更新日志 -->
            <section id="changelog" class="mb-16">
              <h2 class="text-3xl font-bold text-gray-900 mb-6">更新日志</h2>
              
              <div class="space-y-6">
                <div class="card p-6">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">版本 1.0.0</h3>
                    <span class="tag tag-primary">最新版本</span>
                  </div>
                  <p class="text-gray-600 text-sm mb-4">发布日期：2024年1月15日</p>
                  <ul class="space-y-2 text-gray-700">
                    <li>• 🎉 首次正式发布</li>
                    <li>• ⚡ 集成Everything搜索引擎</li>
                    <li>• 🤖 添加AI智能对话功能</li>
                    <li>• 🎨 现代化用户界面设计</li>
                    <li>• 🔒 本地化隐私保护</li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- 联系支持 -->
            <section id="support" class="mb-16">
              <h2 class="text-3xl font-bold text-gray-900 mb-6">获取支持</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="card p-6 text-center">
                  <MessageSquare class="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">用户反馈</h3>
                  <p class="text-gray-600 text-sm mb-4">
                    遇到问题或有建议？提交反馈，我们会及时回复
                  </p>
                  <router-link to="/feedback" class="btn btn-primary">
                    提交反馈
                  </router-link>
                </div>

                <div class="card p-6 text-center">
                  <Github class="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">开源社区</h3>
                  <p class="text-gray-600 text-sm mb-4">
                    查看源代码，参与开发，或报告技术问题
                  </p>
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    class="btn btn-secondary"
                  >
                    访问 GitHub
                  </a>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  Search, MessageCircle, MessageSquare, Github 
} from 'lucide-vue-next'

// 响应式数据
const activeSection = ref('quick-start')

// 文档章节
const docSections = [
  { id: 'quick-start', title: '快速开始' },
  { id: 'basic-features', title: '基础功能' },
  { id: 'advanced-features', title: '高级功能' },
  { id: 'settings', title: '设置配置' },
  { id: 'troubleshooting', title: '故障排除' },
  { id: 'changelog', title: '更新日志' },
  { id: 'support', title: '获取支持' }
]

// 设置活动章节
const setActiveSection = (sectionId) => {
  activeSection.value = sectionId
}

// 滚动监听，自动更新活动章节
const handleScroll = () => {
  const sections = docSections.map(section => ({
    id: section.id,
    element: document.getElementById(section.id)
  })).filter(section => section.element)

  const scrollPosition = window.scrollY + 100

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i]
    if (section.element.offsetTop <= scrollPosition) {
      if (activeSection.value !== section.id) {
        activeSection.value = section.id
      }
      break
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.prose {
  color: #374151;
}

.prose h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  margin-top: 2rem;
  color: #111827;
}

.prose ul, .prose ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.prose li {
  margin: 0.5rem 0;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}

.prose a {
  color: #2563eb;
  text-decoration: underline;
}

.prose a:hover {
  color: #1d4ed8;
}

kbd {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}
</style>
