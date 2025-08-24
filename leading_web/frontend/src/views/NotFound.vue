<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center space-y-8">
      <!-- 404 图标 -->
      <div class="relative">
        <div class="text-9xl font-bold text-gray-200 select-none">404</div>
        <div class="absolute inset-0 flex items-center justify-center">
          <AlertTriangle class="w-16 h-16 text-yellow-500" />
        </div>
      </div>

      <!-- 错误信息 -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-4">页面未找到</h1>
        <p class="text-lg text-gray-600 mb-8">
          抱歉，您访问的页面不存在或已被移动
        </p>
      </div>

      <!-- 建议操作 -->
      <div class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <router-link 
            to="/" 
            class="btn btn-primary"
          >
            <Home class="w-4 h-4 mr-2" />
            返回首页
          </router-link>
          <button 
            @click="goBack"
            class="btn btn-secondary"
          >
            <ArrowLeft class="w-4 h-4 mr-2" />
            返回上页
          </button>
        </div>

        <!-- 搜索建议 -->
        <div class="pt-4">
          <p class="text-sm text-gray-500 mb-4">或者尝试访问这些页面：</p>
          <div class="flex flex-wrap justify-center gap-2">
            <router-link 
              v-for="link in suggestedLinks"
              :key="link.name"
              :to="link.to"
              class="text-sm text-primary-600 hover:text-primary-700 px-3 py-1 rounded-lg hover:bg-primary-50 transition-colors"
            >
              {{ link.name }}
            </router-link>
          </div>
        </div>
      </div>

      <!-- 联系支持 -->
      <div class="pt-8 border-t border-gray-200">
        <p class="text-sm text-gray-500 mb-4">
          如果您认为这是一个错误，请
          <router-link to="/feedback" class="link">
            提交反馈
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { 
  AlertTriangle, Home, ArrowLeft 
} from 'lucide-vue-next'

const router = useRouter()

// 建议链接
const suggestedLinks = [
  { name: '产品特性', to: '/features' },
  { name: '下载软件', to: '/download' },
  { name: '用户反馈', to: '/feedback' },
  { name: '使用文档', to: '/docs' }
]

// 返回上一页
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.select-none {
  user-select: none;
}
</style>
