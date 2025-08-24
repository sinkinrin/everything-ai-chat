<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- 品牌信息 -->
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center space-x-2 mb-4">
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Search class="w-5 h-5 text-white" />
              </div>
              <span class="text-xl font-bold">Everything AI Chat</span>
            </div>
            <p class="text-gray-400 mb-4 max-w-md">
              基于Everything搜索引擎的AI智能文件搜索客户端，让文件搜索更智能、更高效。
            </p>
            <div class="flex space-x-4">
              <a 
                v-for="social in socialLinks"
                :key="social.name"
                :href="social.href"
                class="text-gray-400 hover:text-white transition-colors"
                :title="social.name"
              >
                <component :is="social.icon" class="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <!-- 快速链接 -->
          <div>
            <h3 class="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              快速链接
            </h3>
            <ul class="space-y-2">
              <li v-for="link in quickLinks" :key="link.name">
                <router-link 
                  :to="link.to"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  {{ link.name }}
                </router-link>
              </li>
            </ul>
          </div>
          
          <!-- 支持 -->
          <div>
            <h3 class="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              支持
            </h3>
            <ul class="space-y-2">
              <li v-for="link in supportLinks" :key="link.name">
                <router-link 
                  :to="link.to"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  {{ link.name }}
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- 底部信息 -->
      <div class="border-t border-gray-800 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="text-gray-400 text-sm mb-4 md:mb-0">
            © {{ currentYear }} Everything AI Chat. 保留所有权利。
          </div>
          <div class="flex space-x-6">
            <a 
              v-for="legal in legalLinks"
              :key="legal.name"
              :href="legal.href"
              class="text-gray-400 hover:text-white text-sm transition-colors"
            >
              {{ legal.name }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { Search, Github, Mail, MessageCircle } from 'lucide-vue-next'

const currentYear = computed(() => new Date().getFullYear())

// 社交链接
const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com',
    icon: Github
  },
  {
    name: 'Email',
    href: 'mailto:support@example.com',
    icon: Mail
  },
  {
    name: 'Feedback',
    href: '/feedback',
    icon: MessageCircle
  }
]

// 快速链接
const quickLinks = [
  { name: '首页', to: '/' },
  { name: '产品特性', to: '/features' },
  { name: '下载软件', to: '/download' },
  { name: '用户反馈', to: '/feedback' }
]

// 支持链接
const supportLinks = [
  { name: '使用文档', to: '/docs' },
  { name: '提交反馈', to: '/feedback/create' },
  { name: 'Bug报告', to: '/feedback?type=bug' },
  { name: '功能建议', to: '/feedback?type=feature' }
]

// 法律链接
const legalLinks = [
  { name: '隐私政策', href: '/privacy' },
  { name: '服务条款', href: '/terms' },
  { name: 'Cookie政策', href: '/cookies' }
]
</script>
