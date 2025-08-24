<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            产品特性
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything AI Chat 融合了传统文件搜索的高效与人工智能的智慧，为您带来全新的文件管理体验
          </p>
        </div>
      </div>
    </section>

    <!-- 核心特性 -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- 特性1: 极速搜索 -->
          <div>
            <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <Zap class="w-8 h-8 text-blue-600" />
            </div>
            <h2 class="text-3xl font-bold text-gray-900 mb-4">毫秒级极速搜索</h2>
            <p class="text-lg text-gray-600 mb-6">
              基于Everything搜索引擎，实现毫秒级文件搜索速度。无论您的硬盘有多少文件，都能在瞬间找到目标。
            </p>
            <ul class="space-y-3 text-gray-600">
              <li class="flex items-center">
                <Check class="w-5 h-5 text-green-500 mr-3" />
                支持文件名、路径、大小等多种搜索条件
              </li>
              <li class="flex items-center">
                <Check class="w-5 h-5 text-green-500 mr-3" />
                实时索引更新，新文件即时可搜
              </li>
              <li class="flex items-center">
                <Check class="w-5 h-5 text-green-500 mr-3" />
                正则表达式和通配符支持
              </li>
            </ul>
          </div>
          <div class="bg-white rounded-2xl shadow-xl p-8">
            <div class="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center">
              <div class="text-center">
                <Search class="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <p class="text-gray-600">搜索演示区域</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="bg-gray-50 rounded-2xl shadow-xl p-8 order-2 lg:order-1">
            <div class="aspect-video bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl flex items-center justify-center">
              <div class="text-center">
                <MessageCircle class="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <p class="text-gray-600">AI对话演示区域</p>
              </div>
            </div>
          </div>
          <!-- 特性2: AI智能对话 -->
          <div class="order-1 lg:order-2">
            <div class="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
              <Brain class="w-8 h-8 text-purple-600" />
            </div>
            <h2 class="text-3xl font-bold text-gray-900 mb-4">AI智能对话</h2>
            <p class="text-lg text-gray-600 mb-6">
              革命性的AI对话功能，让您用自然语言描述需求，AI帮您理解并找到最符合要求的文件。
            </p>
            <ul class="space-y-3 text-gray-600">
              <li class="flex items-center">
                <Check class="w-5 h-5 text-green-500 mr-3" />
                自然语言文件搜索，如"找到昨天的PPT文件"
              </li>
              <li class="flex items-center">
                <Check class="w-5 h-5 text-green-500 mr-3" />
                智能文件分类和整理建议
              </li>
              <li class="flex items-center">
                <Check class="w-5 h-5 text-green-500 mr-3" />
                基于文件内容的智能推荐
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- 特性3: 隐私安全 -->
          <div>
            <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
              <Shield class="w-8 h-8 text-green-600" />
            </div>
            <h2 class="text-3xl font-bold text-gray-900 mb-4">本地化隐私保护</h2>
            <p class="text-lg text-gray-600 mb-6">
              所有文件索引和搜索都在本地完成，绝不上传您的任何文件信息，确保数据安全和隐私保护。
            </p>
            <ul class="space-y-3 text-gray-600">
              <li class="flex items-center">
                <Check class="w-5 h-5 text-green-500 mr-3" />
                文件索引完全本地化，无需上传
              </li>
              <li class="flex items-center">
                <Check class="w-5 h-5 text-green-500 mr-3" />
                AI对话仅发送查询关键词，不涉及文件内容
              </li>
              <li class="flex items-center">
                <Check class="w-5 h-5 text-green-500 mr-3" />
                支持离线基础搜索功能
              </li>
            </ul>
          </div>
          <div class="bg-white rounded-2xl shadow-xl p-8">
            <div class="aspect-video bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl flex items-center justify-center">
              <div class="text-center">
                <Lock class="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p class="text-gray-600">安全保护演示</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 更多特性 -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            更多强大特性
          </h2>
          <p class="text-xl text-gray-600">
            Everything AI Chat 还提供更多实用功能，提升您的工作效率
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="feature in additionalFeatures" 
            :key="feature.title"
            class="card p-6 text-center"
          >
            <div class="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-xl flex items-center justify-center">
              <component :is="feature.icon" class="w-6 h-6 text-gray-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 对比表格 -->
    <section class="py-20 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything AI Chat vs 传统搜索
          </h2>
          <p class="text-xl text-gray-600">
            看看我们如何超越传统文件搜索工具
          </p>
        </div>

        <div class="card overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-medium text-gray-900">功能特性</th>
                  <th class="px-6 py-4 text-center text-sm font-medium text-gray-900">Everything AI Chat</th>
                  <th class="px-6 py-4 text-center text-sm font-medium text-gray-900">Windows搜索</th>
                  <th class="px-6 py-4 text-center text-sm font-medium text-gray-900">其他工具</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="comparison in comparisons" :key="comparison.feature">
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">
                    {{ comparison.feature }}
                  </td>
                  <td class="px-6 py-4 text-center">
                    <Check v-if="comparison.us" class="w-5 h-5 text-green-500 mx-auto" />
                    <X v-else class="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td class="px-6 py-4 text-center">
                    <Check v-if="comparison.windows" class="w-5 h-5 text-green-500 mx-auto" />
                    <X v-else class="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td class="px-6 py-4 text-center">
                    <Check v-if="comparison.others" class="w-5 h-5 text-green-500 mx-auto" />
                    <X v-else class="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-primary-600 text-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          体验智能文件搜索的魅力
        </h2>
        <p class="text-xl text-blue-100 mb-8">
          立即下载Everything AI Chat，开启高效的文件管理新时代
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link 
            to="/download" 
            class="btn btn-lg bg-white text-primary-600 hover:bg-blue-50 px-8 py-4 text-lg"
          >
            <Download class="w-5 h-5 mr-2" />
            立即下载
          </router-link>
          <router-link 
            to="/docs" 
            class="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg"
          >
            <Book class="w-5 h-5 mr-2" />
            查看文档
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { 
  Zap, Brain, Shield, Search, MessageCircle, Lock, Check, X,
  Download, Book, Folder, Settings, Palette, Globe, 
  BarChart, Clock
} from 'lucide-vue-next'

// 附加特性
const additionalFeatures = [
  {
    icon: Folder,
    title: '智能分类',
    description: '自动识别文件类型，按类别智能分组展示，方便管理'
  },
  {
    icon: Settings,
    title: '个性化设置',
    description: '支持自定义搜索规则、界面主题和快捷键设置'
  },
  {
    icon: Palette,
    title: '美观界面',
    description: '现代化设计风格，支持深色模式，提供舒适的使用体验'
  },
  {
    icon: Globe,
    title: '多语言支持',
    description: '支持中英文界面，未来将支持更多语言'
  },
  {
    icon: BarChart,
    title: '搜索统计',
    description: '记录搜索历史和使用统计，帮助优化工作流程'
  },
  {
    icon: Clock,
    title: '历史记录',
    description: '智能保存搜索历史，快速重复执行常用搜索'
  }
]

// 功能对比
const comparisons = [
  { feature: '毫秒级搜索速度', us: true, windows: false, others: true },
  { feature: 'AI自然语言查询', us: true, windows: false, others: false },
  { feature: '正则表达式支持', us: true, windows: false, others: true },
  { feature: '实时索引更新', us: true, windows: true, others: true },
  { feature: '文件内容搜索', us: false, windows: true, others: true },
  { feature: '智能分类建议', us: true, windows: false, others: false },
  { feature: '本地隐私保护', us: true, windows: true, others: true },
  { feature: '现代化界面', us: true, windows: false, others: false },
  { feature: '跨平台支持', us: true, windows: false, others: true }
]
</script>
