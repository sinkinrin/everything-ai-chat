<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <section class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              用户反馈
            </h1>
            <p class="text-lg text-gray-600">
              分享您的想法，帮助我们改进产品
            </p>
          </div>
          <div class="mt-4 md:mt-0">
            <router-link 
              to="/feedback/create" 
              class="btn btn-primary"
            >
              <Plus class="w-4 h-4 mr-2" />
              提交反馈
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- 侧边栏筛选 -->
        <aside class="lg:w-72 flex-shrink-0">
          <div class="card p-6 sticky top-8">
            <h3 class="font-semibold text-gray-900 mb-4">筛选条件</h3>
            
            <!-- 反馈类型 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                反馈类型
              </label>
              <div class="space-y-2">
                <label 
                  v-for="type in feedbackTypes" 
                  :key="type.value"
                  class="flex items-center"
                >
                  <input
                    v-model="filters.type"
                    type="radio"
                    :value="type.value"
                    class="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  >
                  <span class="ml-2 text-sm text-gray-700">{{ type.label }}</span>
                </label>
              </div>
            </div>

            <!-- 状态 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                状态
              </label>
              <select 
                v-model="filters.status" 
                class="input w-full"
              >
                <option value="">全部状态</option>
                <option value="pending">待处理</option>
                <option value="in_progress">处理中</option>
                <option value="completed">已完成</option>
                <option value="rejected">已拒绝</option>
              </select>
            </div>

            <!-- 分类 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                分类
              </label>
              <select 
                v-model="filters.category_id" 
                class="input w-full"
              >
                <option value="">全部分类</option>
                <option 
                  v-for="category in categories" 
                  :key="category.id" 
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>

            <!-- 排序 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                排序方式
              </label>
              <select 
                v-model="filters.sort" 
                class="input w-full"
              >
                <option value="votes">按投票数</option>
                <option value="created_at">按创建时间</option>
                <option value="updated_at">按更新时间</option>
              </select>
              <select 
                v-model="filters.order" 
                class="input w-full mt-2"
              >
                <option value="desc">降序</option>
                <option value="asc">升序</option>
              </select>
            </div>

            <button 
              @click="resetFilters"
              class="btn btn-ghost w-full"
            >
              重置筛选
            </button>
          </div>
        </aside>

        <!-- 主内容区 -->
        <main class="flex-1">
          <!-- 加载状态 -->
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block loading-spinner w-8 h-8"></div>
            <p class="text-gray-500 mt-2">加载中...</p>
          </div>

          <!-- 反馈列表 -->
          <div v-else-if="feedbackList.length > 0" class="space-y-6">
            <div 
              v-for="feedback in feedbackList" 
              :key="feedback.id"
              class="card p-6 hover:shadow-md transition-shadow"
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
                    <div class="font-medium text-gray-900">
                      {{ feedback.display_name || feedback.username }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ formatDate(feedback.created_at) }}
                    </div>
                  </div>
                </div>
                
                <!-- 投票按钮 -->
                <div class="flex flex-col items-center space-y-1">
                  <button 
                    @click="vote(feedback.id, 'up')"
                    class="p-1 rounded hover:bg-gray-100 transition-colors"
                    :class="{ 'text-primary-600': feedback.userVote === 'up' }"
                    :disabled="!authStore.isAuthenticated"
                  >
                    <ArrowUp class="w-5 h-5" />
                  </button>
                  <span class="text-sm font-medium text-gray-900">
                    {{ feedback.votes_count }}
                  </span>
                  <button 
                    @click="vote(feedback.id, 'down')"
                    class="p-1 rounded hover:bg-gray-100 transition-colors"
                    :class="{ 'text-red-600': feedback.userVote === 'down' }"
                    :disabled="!authStore.isAuthenticated"
                  >
                    <ArrowDown class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <router-link 
                :to="`/feedback/${feedback.id}`"
                class="block group"
              >
                <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {{ feedback.title }}
                </h3>
                <p class="text-gray-600 mb-4 line-clamp-3">
                  {{ feedback.description }}
                </p>
              </router-link>

              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span 
                    class="tag"
                    :class="getTypeClass(feedback.type)"
                  >
                    {{ getTypeLabel(feedback.type) }}
                  </span>
                  <span 
                    v-if="feedback.category_name"
                    class="tag tag-gray"
                    :style="{ backgroundColor: feedback.category_color + '20', color: feedback.category_color }"
                  >
                    {{ feedback.category_name }}
                  </span>
                  <span 
                    class="tag"
                    :class="getStatusClass(feedback.status)"
                  >
                    {{ getStatusLabel(feedback.status) }}
                  </span>
                </div>
                
                <router-link 
                  :to="`/feedback/${feedback.id}`"
                  class="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  查看详情 →
                </router-link>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else class="text-center py-16">
            <MessageSquare class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">暂无反馈</h3>
            <p class="text-gray-500 mb-6">还没有用户提交反馈，成为第一个吧！</p>
            <router-link 
              to="/feedback/create" 
              class="btn btn-primary"
            >
              <Plus class="w-4 h-4 mr-2" />
              提交反馈
            </router-link>
          </div>

          <!-- 分页 -->
          <div v-if="pagination.totalPages > 1" class="mt-8 flex justify-center">
            <nav class="flex items-center space-x-2">
              <button 
                @click="changePage(pagination.page - 1)"
                :disabled="pagination.page <= 1"
                class="btn btn-ghost"
              >
                <ChevronLeft class="w-4 h-4" />
              </button>
              
              <span class="text-sm text-gray-700">
                第 {{ pagination.page }} 页，共 {{ pagination.totalPages }} 页
              </span>
              
              <button 
                @click="changePage(pagination.page + 1)"
                :disabled="pagination.page >= pagination.totalPages"
                class="btn btn-ghost"
              >
                <ChevronRight class="w-4 h-4" />
              </button>
            </nav>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { 
  Plus, User, ArrowUp, ArrowDown, MessageSquare,
  ChevronLeft, ChevronRight
} from 'lucide-vue-next'
import { feedbackAPI, votesAPI } from '@/services/api'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

// 响应式数据
const feedbackList = ref([])
const categories = ref([])
const loading = ref(false)
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0
})

// 筛选条件
const filters = reactive({
  type: route.query.type || '',
  status: route.query.status || '',
  category_id: route.query.category_id || '',
  sort: 'votes',
  order: 'desc'
})

// 反馈类型选项
const feedbackTypes = [
  { value: '', label: '全部类型' },
  { value: 'bug', label: 'Bug报告' },
  { value: 'feature', label: '功能建议' }
]

// 获取类型样式类
const getTypeClass = (type) => {
  return type === 'bug' ? 'tag-error' : 'tag-primary'
}

// 获取类型标签
const getTypeLabel = (type) => {
  return type === 'bug' ? 'Bug' : '功能建议'
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

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = now - date
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return '今天'
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

// 投票
const vote = async (feedbackId, voteType) => {
  if (!authStore.isAuthenticated) {
    toast.error('请先登录')
    return
  }

  try {
    await votesAPI.vote({ feedback_id: feedbackId, vote_type: voteType })
    // 重新加载数据以更新投票状态
    await fetchFeedbackList()
  } catch (error) {
    console.error('投票失败:', error)
  }
}

// 获取反馈列表
const fetchFeedbackList = async () => {
  loading.value = true
  try {
    const params = {
      ...filters,
      page: pagination.value.page,
      limit: pagination.value.limit
    }

    // 清除空值
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key]
      }
    })

    const response = await feedbackAPI.getList(params)
    feedbackList.value = response.data.feedbacks
    pagination.value = response.data.pagination
  } catch (error) {
    console.error('获取反馈列表失败:', error)
    toast.error('获取反馈列表失败')
  } finally {
    loading.value = false
  }
}

// 获取分类列表
const fetchCategories = async () => {
  try {
    const response = await feedbackAPI.getCategories()
    categories.value = response.data
  } catch (error) {
    console.error('获取分类失败:', error)
  }
}

// 重置筛选条件
const resetFilters = () => {
  filters.type = ''
  filters.status = ''
  filters.category_id = ''
  filters.sort = 'votes'
  filters.order = 'desc'
  pagination.value.page = 1
}

// 切换页面
const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page
  }
}

// 监听筛选条件变化
watch(filters, () => {
  pagination.value.page = 1
  fetchFeedbackList()
}, { deep: true })

// 监听分页变化
watch(() => pagination.value.page, () => {
  fetchFeedbackList()
})

onMounted(async () => {
  await Promise.all([
    fetchCategories(),
    fetchFeedbackList()
  ])
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
