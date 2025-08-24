<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link 
            to="/" 
            class="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors"
          >
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Search class="w-5 h-5 text-white" />
            </div>
            <span>Everything AI Chat</span>
          </router-link>
        </div>
        
        <!-- 导航菜单 - 桌面 -->
        <nav class="hidden md:flex space-x-8">
          <router-link 
            v-for="item in navItems" 
            :key="item.name"
            :to="item.to"
            class="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            active-class="text-primary-600"
          >
            {{ item.name }}
          </router-link>
        </nav>
        
        <!-- 用户菜单 -->
        <div class="flex items-center space-x-4">
          <!-- 创建反馈按钮 -->
          <router-link 
            v-if="authStore.isAuthenticated"
            to="/feedback/create"
            class="btn btn-primary btn-sm hidden sm:inline-flex"
          >
            <Plus class="w-4 h-4 mr-1" />
            提交反馈
          </router-link>
          
          <!-- 用户信息 -->
          <div v-if="authStore.isAuthenticated" class="relative" ref="userMenuRef">
            <button 
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <img 
                v-if="authStore.user?.avatar_url"
                :src="authStore.user.avatar_url" 
                :alt="authStore.user.display_name || authStore.user.username"
                class="w-8 h-8 rounded-full"
              >
              <div v-else class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User class="w-5 h-5 text-gray-600" />
              </div>
              <ChevronDown class="w-4 h-4 text-gray-400" />
            </button>
            
            <!-- 用户下拉菜单 -->
            <transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div 
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
              >
                <div class="px-4 py-2 border-b border-gray-200">
                  <p class="text-sm font-medium text-gray-900">
                    {{ authStore.user?.display_name || authStore.user?.username }}
                  </p>
                  <p class="text-sm text-gray-500">{{ authStore.user?.email }}</p>
                </div>
                <router-link 
                  to="/profile" 
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  <User class="w-4 h-4 mr-2" />
                  个人中心
                </router-link>
                <button 
                  @click="handleLogout"
                  class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut class="w-4 h-4 mr-2" />
                  退出登录
                </button>
              </div>
            </transition>
          </div>
          
          <!-- 登录按钮 -->
          <button 
            v-else
            @click="authStore.login"
            class="btn btn-primary"
            :disabled="authStore.loading"
          >
            <Github class="w-4 h-4 mr-2" />
            GitHub 登录
          </button>
          
          <!-- 移动端菜单按钮 -->
          <button 
            @click="showMobileMenu = !showMobileMenu"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu v-if="!showMobileMenu" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- 移动端导航菜单 -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-full opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-full opacity-0"
    >
      <div v-if="showMobileMenu" class="md:hidden bg-white border-t border-gray-200">
        <div class="px-4 py-2 space-y-1">
          <router-link 
            v-for="item in navItems" 
            :key="item.name"
            :to="item.to"
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
            active-class="text-primary-600 bg-primary-50"
            @click="showMobileMenu = false"
          >
            {{ item.name }}
          </router-link>
          
          <!-- 移动端创建反馈 -->
          <router-link 
            v-if="authStore.isAuthenticated"
            to="/feedback/create"
            class="block px-3 py-2 text-base font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            @click="showMobileMenu = false"
          >
            <Plus class="w-4 h-4 inline mr-2" />
            提交反馈
          </router-link>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { 
  Search, User, ChevronDown, LogOut, Github, 
  Menu, X, Plus
} from 'lucide-vue-next'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

// 响应式状态
const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const userMenuRef = ref(null)

// 导航菜单项
const navItems = [
  { name: '首页', to: '/' },
  { name: '产品特性', to: '/features' },
  { name: '用户反馈', to: '/feedback' },
  { name: '使用文档', to: '/docs' },
  { name: '下载软件', to: '/download' }
]

// 处理登出
const handleLogout = async () => {
  showUserMenu.value = false
  try {
    await authStore.logout()
    toast.success('已成功退出登录')
    router.push('/')
  } catch (error) {
    toast.error('退出登录失败')
  }
}

// 点击外部关闭菜单
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
