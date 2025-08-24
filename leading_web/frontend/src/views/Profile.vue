<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">个人中心</h1>
        <p class="text-gray-600 mt-2">管理您的账户和反馈信息</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 用户信息卡片 -->
        <div class="lg:col-span-1">
          <div class="card p-6 text-center">
            <img 
              v-if="authStore.user?.avatar_url"
              :src="authStore.user.avatar_url" 
              :alt="authStore.user.display_name || authStore.user.username"
              class="w-24 h-24 rounded-full mx-auto mb-4"
            >
            <div v-else class="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User class="w-12 h-12 text-gray-600" />
            </div>
            
            <h2 class="text-xl font-semibold text-gray-900 mb-2">
              {{ authStore.user?.display_name || authStore.user?.username }}
            </h2>
            <p class="text-gray-600 mb-4">{{ authStore.user?.email }}</p>
            
            <div class="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
              <Github class="w-4 h-4" />
              <span>GitHub 用户</span>
            </div>
            
            <button 
              @click="handleLogout"
              class="btn btn-secondary w-full"
              :disabled="authStore.loading"
            >
              <LogOut class="w-4 h-4 mr-2" />
              退出登录
            </button>
          </div>

          <!-- 统计信息 -->
          <div class="card p-6 mt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">我的统计</h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">提交的反馈</span>
                <span class="font-semibold text-gray-900">{{ stats.totalFeedbacks }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">获得的投票</span>
                <span class="font-semibold text-gray-900">{{ stats.totalVotes }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">参与投票</span>
                <span class="font-semibold text-gray-900">{{ stats.votesGiven }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">加入时间</span>
                <span class="font-semibold text-gray-900">{{ formatJoinDate() }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 主要内容区域 -->
        <div class="lg:col-span-2">
          <!-- 标签页 -->
          <div class="mb-6">
            <div class="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                v-for="tab in tabs"
                :key="tab.key"
                @click="activeTab = tab.key"
                class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors"
                :class="activeTab === tab.key 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'"
              >
                <component :is="tab.icon" class="w-4 h-4 inline mr-2" />
                {{ tab.label }}
              </button>
            </div>
          </div>

          <!-- 我的反馈 -->
          <div v-if="activeTab === 'feedbacks'" class="space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-900">我的反馈</h3>
              <router-link to="/feedback/create" class="btn btn-primary btn-sm">
                <Plus class="w-4 h-4 mr-1" />
                新建反馈
              </router-link>
            </div>
            
            <div v-if="myFeedbacks.length > 0" class="space-y-4">
              <div 
                v-for="feedback in myFeedbacks" 
                :key="feedback.id"
                class="card p-6"
              >
                <div class="flex justify-between items-start mb-3">
                  <router-link 
                    :to="`/feedback/${feedback.id}`"
                    class="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                  >
                    {{ feedback.title }}
                  </router-link>
                  <div class="flex items-center space-x-2 text-sm text-gray-500">
                    <ThumbsUp class="w-4 h-4" />
                    <span>{{ feedback.votes_count }}</span>
                  </div>
                </div>
                
                <p class="text-gray-600 mb-3 line-clamp-2">{{ feedback.description }}</p>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span 
                      class="tag"
                      :class="feedback.type === 'bug' ? 'tag-error' : 'tag-primary'"
                    >
                      {{ feedback.type === 'bug' ? 'Bug' : '功能建议' }}
                    </span>
                    <span 
                      class="tag"
                      :class="getStatusClass(feedback.status)"
                    >
                      {{ getStatusLabel(feedback.status) }}
                    </span>
                  </div>
                  <span class="text-sm text-gray-500">
                    {{ formatDate(feedback.created_at) }}
                  </span>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-12">
              <MessageSquare class="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 class="text-lg font-medium text-gray-900 mb-2">还没有反馈</h3>
              <p class="text-gray-500 mb-4">分享您的想法，帮助改进产品</p>
              <router-link to="/feedback/create" class="btn btn-primary">
                <Plus class="w-4 h-4 mr-2" />
                提交第一个反馈
              </router-link>
            </div>
          </div>

          <!-- 我的投票 -->
          <div v-if="activeTab === 'votes'" class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">我的投票</h3>
            
            <div class="text-center py-12">
              <Vote class="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 class="text-lg font-medium text-gray-900 mb-2">投票记录</h3>
              <p class="text-gray-500">此功能正在开发中...</p>
            </div>
          </div>

          <!-- 账户设置 -->
          <div v-if="activeTab === 'settings'" class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900">账户设置</h3>
            
            <div class="card p-6">
              <h4 class="font-medium text-gray-900 mb-4">通知设置</h4>
              <div class="space-y-3">
                <label class="flex items-center">
                  <input type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" checked>
                  <span class="ml-2 text-gray-700">新回复通知</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" checked>
                  <span class="ml-2 text-gray-700">反馈状态更新通知</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500">
                  <span class="ml-2 text-gray-700">产品更新通知</span>
                </label>
              </div>
            </div>

            <div class="card p-6">
              <h4 class="font-medium text-gray-900 mb-4">隐私设置</h4>
              <div class="space-y-3">
                <label class="flex items-center">
                  <input type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" checked>
                  <span class="ml-2 text-gray-700">公开显示我的反馈</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" checked>
                  <span class="ml-2 text-gray-700">允许其他用户查看我的资料</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { 
  User, Github, LogOut, MessageSquare, ThumbsUp, 
  Settings, Plus, Vote
} from 'lucide-vue-next'
import { feedbackAPI } from '@/services/api'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

// 响应式数据
const activeTab = ref('feedbacks')
const myFeedbacks = ref([])
const stats = ref({
  totalFeedbacks: 0,
  totalVotes: 0,
  votesGiven: 0
})

// 标签页配置
const tabs = [
  { key: 'feedbacks', label: '我的反馈', icon: MessageSquare },
  { key: 'votes', label: '我的投票', icon: ThumbsUp },
  { key: 'settings', label: '账户设置', icon: Settings }
]

// 格式化加入时间
const formatJoinDate = () => {
  if (!authStore.user?.created_at) return '未知'
  const date = new Date(authStore.user.created_at)
  return date.toLocaleDateString('zh-CN')
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 获取状态样式类
const getStatusClass = (status) => {
  const classes = {
    pending: 'tag-warning',
    in_progress: 'tag-primary',
    completed: 'tag-success',
    rejected: 'tag-error'
  }
  return classes[status] || 'tag-gray'
}

// 获取状态标签
const getStatusLabel = (status) => {
  const labels = {
    pending: '待处理',
    in_progress: '处理中',
    completed: '已完成',
    rejected: '已拒绝'
  }
  return labels[status] || status
}

// 处理登出
const handleLogout = async () => {
  try {
    await authStore.logout()
    toast.success('已成功退出登录')
    router.push('/')
  } catch (error) {
    toast.error('退出登录失败')
  }
}

// 获取我的反馈
const fetchMyFeedbacks = async () => {
  try {
    // 这里应该有一个专门的API来获取当前用户的反馈
    // 暂时使用通用的反馈列表API
    const response = await feedbackAPI.getList({
      limit: 10,
      sort: 'created_at',
      order: 'desc'
    })
    
    // 模拟筛选当前用户的反馈
    myFeedbacks.value = response.data.feedbacks.filter(
      feedback => feedback.username === authStore.user?.username
    )
    
    // 更新统计信息
    stats.value.totalFeedbacks = myFeedbacks.value.length
    stats.value.totalVotes = myFeedbacks.value.reduce((sum, feedback) => sum + feedback.votes_count, 0)
  } catch (error) {
    console.error('获取我的反馈失败:', error)
  }
}

onMounted(() => {
  fetchMyFeedbacks()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
