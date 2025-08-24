<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 text-white overflow-hidden">
      <div class="absolute inset-0 bg-black opacity-20"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Everything AI Chat
          </h1>
          <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto animate-slide-up">
            基于Everything搜索引擎的AI智能文件搜索客户端，让文件搜索更智能、更高效
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <router-link
              to="/download"
              class="btn btn-lg bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Download class="w-5 h-5 mr-2" />
              立即下载
            </router-link>
            <router-link
              to="/features"
              class="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
            >
              了解更多
            </router-link>
          </div>
        </div>
      </div>

      <!-- 装饰性元素 -->
      <div class="absolute bottom-0 left-0 w-full">
        <svg class="w-full h-24" preserveAspectRatio="none" viewBox="0 0 1440 120">
          <path d="M0,120L80,110C160,100,320,80,480,80C640,80,800,100,960,105C1120,110,1280,100,1360,95L1440,90L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="rgb(249, 250, 251)"></path>
        </svg>
      </div>
    </section>

    <!-- 特性概览 -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            为什么选择Everything AI Chat？
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            结合Everything的极速搜索能力和AI的智能理解，为您带来前所未有的文件搜索体验
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="feature in keyFeatures"
            :key="feature.title"
            class="card card-hover p-8 text-center"
          >
            <div class="w-16 h-16 mx-auto mb-6 bg-primary-100 rounded-2xl flex items-center justify-center">
              <component :is="feature.icon" class="w-8 h-8 text-primary-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 产品截图 -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            直观的用户界面
          </h2>
          <p class="text-xl text-gray-600">
            简洁美观的设计，强大易用的功能
          </p>
        </div>

        <div class="relative">
          <div class="bg-white rounded-2xl shadow-2xl p-8">
            <div class="aspect-video rounded-xl overflow-hidden">
              <img
                src="@/asserts/img.png"
                alt="Everything AI Chat 产品界面截图"
                class="w-full h-full object-scale-down"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 统计数据 -->
    <section class="py-20 bg-primary-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div v-for="stat in stats" :key="stat.label">
            <div class="text-3xl md:text-4xl font-bold mb-2">{{ stat.value }}</div>
            <div class="text-blue-100">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 用户反馈预览 -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            用户反馈
          </h2>
          <p class="text-xl text-gray-600 mb-8">
            听听用户怎么说，一起让产品变得更好
          </p>
          <router-link
            to="/feedback"
            class="btn btn-primary"
          >
            查看更多反馈
          </router-link>
        </div>

        <!-- 反馈预览卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="feedback in recentFeedback"
            :key="feedback.id"
            class="card p-6"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <img
                  v-if="feedback.avatar_url"
                  :src="feedback.avatar_url"
                  :alt="feedback.username"
                  class="w-10 h-10 rounded-full"
                />
                <div v-else class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User class="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <div class="font-medium text-gray-900">{{ feedback.display_name || feedback.username }}</div>
                  <div class="text-sm text-gray-500">{{ formatDate(feedback.created_at) }}</div>
                </div>
              </div>
              <div class="flex items-center space-x-1 text-primary-600">
                <ArrowUp class="w-4 h-4" />
                <span class="text-sm font-medium">{{ feedback.votes_count }}</span>
              </div>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ feedback.title }}</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ feedback.description }}</p>
            <div class="flex items-center justify-between">
              <span
                class="tag"
                :class="feedback.type === 'bug' ? 'tag-error' : 'tag-primary'"
              >
                {{ feedback.type === 'bug' ? 'Bug' : '功能建议' }}
              </span>
              <router-link
                :to="`/feedback/${feedback.id}`"
                class="text-sm text-primary-600 hover:text-primary-700"
              >
                查看详情 →
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          准备开始使用了吗？
        </h2>
        <p class="text-xl text-gray-600 mb-8">
          立即下载Everything AI Chat，体验智能文件搜索的魅力
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/download"
            class="btn btn-primary btn-lg px-8 py-4 text-lg"
          >
            <Download class="w-5 h-5 mr-2" />
            免费下载
          </router-link>
          <router-link
            to="/docs"
            class="btn btn-secondary btn-lg px-8 py-4 text-lg"
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
import { ref, onMounted } from 'vue'
import {
  Download, Search, Zap, Brain, Shield, Monitor,
  ArrowUp, User, Book
} from 'lucide-vue-next'
import { feedbackAPI } from '@/services/api'

// 响应式数据
const recentFeedback = ref([])

// 关键特性
const keyFeatures = [
  {
    icon: Zap,
    title: '极速搜索',
    description: '基于Everything引擎，毫秒级搜索本地文件，快速定位任何文件'
  },
  {
    icon: Brain,
    title: 'AI智能理解',
    description: '自然语言搜索，AI理解您的意图，提供更精准的搜索结果'
  },
  {
    icon: Shield,
    title: '本地安全',
    description: '所有数据本地处理，保护您的隐私安全，无需上传任何文件信息'
  }
]

// 统计数据
const stats = [
  { value: '100K+', label: '活跃用户' },
  { value: '1M+', label: '搜索次数' },
  { value: '99%', label: '搜索准确率' },
  { value: '<1s', label: '平均响应时间' }
]

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 获取最新反馈
const fetchRecentFeedback = async () => {
  try {
    const response = await feedbackAPI.getList({
      sort: 'votes',
      order: 'desc',
      limit: 6
    })
    recentFeedback.value = response.data.feedbacks
  } catch (error) {
    console.error('获取反馈失败:', error)
  }
}

onMounted(() => {
  fetchRecentFeedback()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
