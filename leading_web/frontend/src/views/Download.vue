<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            下载Everything AI Chat
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            支持Windows和Mac系统，选择适合您系统的版本开始体验智能文件搜索
          </p>
        </div>
      </div>
    </section>

    <!-- 下载选项 -->
    <section class="py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Windows 版本 -->
          <div class="card p-8 text-center">
            <div class="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Monitor class="w-10 h-10 text-blue-600" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Windows版本</h3>
            <p class="text-gray-600 mb-6">
              支持Windows 10/11系统<br>
              包含完整功能，即装即用
            </p>
            
            <!-- Windows版本列表 -->
            <div v-if="windowsVersions.length > 0" class="space-y-3 mb-6">
              <div 
                v-for="version in windowsVersions" 
                :key="version.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="text-left">
                  <div class="font-medium text-gray-900">
                    v{{ version.version }}
                    <span v-if="version.is_latest" class="tag tag-primary ml-2">最新版</span>
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ version.architecture === 'x64' ? '64位' : '32位' }}
                    {{ version.file_size ? ` • ${formatFileSize(version.file_size)}` : '' }}
                  </div>
                </div>
                <button 
                  @click="downloadVersion(version)"
                  class="btn btn-primary btn-sm"
                  :disabled="downloading === version.id"
                >
                  <Download v-if="downloading !== version.id" class="w-4 h-4 mr-1" />
                  <div v-else class="loading-spinner mr-1"></div>
                  下载
                </button>
              </div>
            </div>

            <div v-else class="mb-6">
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p class="text-yellow-800 text-sm">
                  <AlertCircle class="w-4 h-4 inline mr-1" />
                  Windows版本准备中，敬请期待
                </p>
              </div>
            </div>

            <div class="text-sm text-gray-500">
              <p>系统要求：Windows 10 或更高版本</p>
            </div>
          </div>

          <!-- Mac 版本 -->
          <div class="card p-8 text-center">
            <div class="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Monitor class="w-10 h-10 text-gray-600" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Mac版本</h3>
            <p class="text-gray-600 mb-6">
              支持macOS系统<br>
              原生macOS体验
            </p>

            <!-- Mac版本列表 -->
            <div v-if="macVersions.length > 0" class="space-y-3 mb-6">
              <div 
                v-for="version in macVersions" 
                :key="version.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="text-left">
                  <div class="font-medium text-gray-900">
                    v{{ version.version }}
                    <span v-if="version.is_latest" class="tag tag-primary ml-2">最新版</span>
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ version.architecture === 'arm64' ? 'Apple Silicon' : 'Intel' }}
                    {{ version.file_size ? ` • ${formatFileSize(version.file_size)}` : '' }}
                  </div>
                </div>
                <button 
                  @click="downloadVersion(version)"
                  class="btn btn-primary btn-sm"
                  :disabled="downloading === version.id"
                >
                  <Download v-if="downloading !== version.id" class="w-4 h-4 mr-1" />
                  <div v-else class="loading-spinner mr-1"></div>
                  下载
                </button>
              </div>
            </div>

            <div v-else class="mb-6">
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p class="text-yellow-800 text-sm">
                  <AlertCircle class="w-4 h-4 inline mr-1" />
                  Mac版本开发中，敬请期待
                </p>
              </div>
            </div>

            <div class="text-sm text-gray-500">
              <p>系统要求：macOS 10.15 或更高版本</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 安装说明 -->
    <section class="py-16 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">
          安装说明
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <!-- Windows安装 -->
          <div>
            <h3 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Monitor class="w-6 h-6 mr-2 text-blue-600" />
              Windows安装
            </h3>
            <ol class="space-y-4 text-gray-600">
              <li class="flex">
                <span class="flex-shrink-0 w-6 h-6 bg-primary-600 text-white text-sm font-medium rounded-full flex items-center justify-center mr-3">1</span>
                下载Windows版本的安装文件
              </li>
              <li class="flex">
                <span class="flex-shrink-0 w-6 h-6 bg-primary-600 text-white text-sm font-medium rounded-full flex items-center justify-center mr-3">2</span>
                双击运行安装程序
              </li>
              <li class="flex">
                <span class="flex-shrink-0 w-6 h-6 bg-primary-600 text-white text-sm font-medium rounded-full flex items-center justify-center mr-3">3</span>
                按照安装向导完成安装
              </li>
              <li class="flex">
                <span class="flex-shrink-0 w-6 h-6 bg-primary-600 text-white text-sm font-medium rounded-full flex items-center justify-center mr-3">4</span>
                首次启动需要配置Everything服务
              </li>
            </ol>
          </div>

          <!-- Mac安装 -->
          <div>
            <h3 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Monitor class="w-6 h-6 mr-2 text-gray-600" />
              Mac安装
            </h3>
            <ol class="space-y-4 text-gray-600">
              <li class="flex">
                <span class="flex-shrink-0 w-6 h-6 bg-gray-600 text-white text-sm font-medium rounded-full flex items-center justify-center mr-3">1</span>
                下载Mac版本的DMG文件
              </li>
              <li class="flex">
                <span class="flex-shrink-0 w-6 h-6 bg-gray-600 text-white text-sm font-medium rounded-full flex items-center justify-center mr-3">2</span>
                双击打开DMG文件
              </li>
              <li class="flex">
                <span class="flex-shrink-0 w-6 h-6 bg-gray-600 text-white text-sm font-medium rounded-full flex items-center justify-center mr-3">3</span>
                将应用拖拽到Applications文件夹
              </li>
              <li class="flex">
                <span class="flex-shrink-0 w-6 h-6 bg-gray-600 text-white text-sm font-medium rounded-full flex items-center justify-center mr-3">4</span>
                首次运行可能需要在系统偏好设置中允许
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <!-- 常见问题 -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">
          常见问题
        </h2>
        
        <div class="space-y-6">
          <div 
            v-for="faq in faqs" 
            :key="faq.question"
            class="card p-6"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-3">
              {{ faq.question }}
            </h3>
            <p class="text-gray-600">{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 获取支持 -->
    <section class="py-16 bg-primary-600 text-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold mb-6">
          需要帮助？
        </h2>
        <p class="text-xl text-blue-100 mb-8">
          如果您在下载或安装过程中遇到问题，我们很乐意为您提供帮助
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link 
            to="/docs" 
            class="btn btn-lg bg-white text-primary-600 hover:bg-blue-50"
          >
            <Book class="w-5 h-5 mr-2" />
            查看文档
          </router-link>
          <router-link 
            to="/feedback" 
            class="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary-600"
          >
            <MessageCircle class="w-5 h-5 mr-2" />
            联系支持
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { 
  Download, Monitor, AlertCircle, Book, MessageCircle 
} from 'lucide-vue-next'
import { downloadAPI } from '@/services/api'

const toast = useToast()

// 响应式数据
const windowsVersions = ref([])
const macVersions = ref([])
const downloading = ref(null)

// 常见问题
const faqs = [
  {
    question: '软件是否免费？',
    answer: 'Everything AI Chat完全免费使用，我们致力于为用户提供最好的文件搜索体验。'
  },
  {
    question: '支持哪些操作系统？',
    answer: '目前支持Windows 10/11系统，Mac版本正在开发中。Linux版本也在计划中。'
  },
  {
    question: '是否需要联网使用？',
    answer: '基础搜索功能无需联网，但AI对话功能需要网络连接来提供智能回答。'
  },
  {
    question: '如何卸载软件？',
    answer: 'Windows：通过控制面板的"程序和功能"卸载。Mac：直接将应用拖到回收站即可。'
  }
]

// 格式化文件大小
const formatFileSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

// 下载版本
const downloadVersion = async (version) => {
  downloading.value = version.id
  
  try {
    // 记录下载统计
    await downloadAPI.trackDownload(version.id)
    
    // 触发下载
    window.open(version.download_url, '_blank')
    
    toast.success('下载已开始')
  } catch (error) {
    console.error('下载失败:', error)
    toast.error('下载失败，请稍后重试')
  } finally {
    downloading.value = null
  }
}

// 获取版本列表
const fetchVersions = async () => {
  try {
    // 获取Windows版本
    const windowsResponse = await downloadAPI.getVersions({
      platform: 'windows',
      stable_only: true,
      limit: 5
    })
    windowsVersions.value = windowsResponse.data.versions
    
    // 获取Mac版本
    const macResponse = await downloadAPI.getVersions({
      platform: 'mac',
      stable_only: true,
      limit: 5
    })
    macVersions.value = macResponse.data.versions
    
  } catch (error) {
    console.error('获取版本列表失败:', error)
  }
}

onMounted(() => {
  fetchVersions()
})
</script>
