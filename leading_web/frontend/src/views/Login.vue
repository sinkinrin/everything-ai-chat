<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <!-- Logo -->
        <div class="mx-auto mb-6">
          <img 
            src="@/asserts/logo.png" 
            alt="Everything AI Chat Logo" 
            class="w-16 h-16 rounded-2xl mx-auto"
          />
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          登录 Everything AI Chat
        </h2>
        <p class="text-gray-600">
          使用GitHub账号登录，参与产品改进
        </p>
      </div>

      <div class="card p-8">
        <!-- 登录按钮 -->
        <div class="space-y-4">
          <button
            @click="handleLogin"
            :disabled="authStore.loading"
            class="w-full btn btn-primary btn-lg relative"
          >
            <div v-if="authStore.loading" class="absolute inset-0 flex items-center justify-center">
              <div class="loading-spinner w-5 h-5"></div>
            </div>
            <div :class="{ 'opacity-0': authStore.loading }" class="flex items-center justify-center">
              <Github class="w-5 h-5 mr-3" />
              使用 GitHub 账号登录
            </div>
          </button>

          <div class="text-center">
            <span class="text-sm text-gray-500">
              登录即表示您同意我们的
              <a href="/terms" class="link">服务条款</a>
              和
              <a href="/privacy" class="link">隐私政策</a>
            </span>
          </div>
        </div>

        <!-- 分隔线 -->
        <div class="my-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">为什么需要登录？</span>
            </div>
          </div>
        </div>

        <!-- 登录说明 -->
        <div class="space-y-4">
          <div class="flex items-start space-x-3">
            <MessageSquare class="w-5 h-5 text-primary-600 mt-0.5" />
            <div>
              <h4 class="font-medium text-gray-900">提交反馈</h4>
              <p class="text-sm text-gray-600">分享您的使用体验和改进建议</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <ThumbsUp class="w-5 h-5 text-primary-600 mt-0.5" />
            <div>
              <h4 class="font-medium text-gray-900">投票支持</h4>
              <p class="text-sm text-gray-600">为您认为重要的功能和修复投票</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <Users class="w-5 h-5 text-primary-600 mt-0.5" />
            <div>
              <h4 class="font-medium text-gray-900">社区互动</h4>
              <p class="text-sm text-gray-600">与其他用户交流，参与产品讨论</p>
            </div>
          </div>
        </div>

        <!-- 隐私说明 -->
        <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-start space-x-2">
            <Shield class="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 class="text-sm font-medium text-green-900">隐私保护</h4>
              <p class="text-xs text-green-700 mt-1">
                我们只获取您的基本公开信息（用户名、头像），不会访问您的私有仓库或其他敏感数据
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 返回首页 -->
      <div class="text-center">
        <router-link 
          to="/" 
          class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← 返回首页
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { 
  Search, Github, MessageSquare, ThumbsUp, 
  Users, Shield
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

// 处理登录
const handleLogin = () => {
  authStore.login()
}

onMounted(() => {
  // 检查是否有错误参数
  if (route.query.error === 'auth_failed') {
    toast.error('登录失败，请重试')
  }
  
  // 检查登录成功参数
  if (route.query.login === 'success') {
    toast.success('登录成功！')
    
    // 重定向到原始页面或首页
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  }
})
</script>
