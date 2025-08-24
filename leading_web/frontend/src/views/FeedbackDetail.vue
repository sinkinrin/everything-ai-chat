<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block loading-spinner w-8 h-8"></div>
        <p class="text-gray-500 mt-2">加载中...</p>
      </div>

      <!-- 反馈详情 -->
      <div v-else-if="feedback" class="space-y-6">
        <!-- 返回按钮 -->
        <div>
          <button 
            @click="$router.go(-1)"
            class="btn btn-ghost"
          >
            <ArrowLeft class="w-4 h-4 mr-2" />
            返回
          </button>
        </div>

        <!-- 反馈主体 -->
        <div class="card">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {{ feedback.title }}
                </h1>
                <div class="flex items-center space-x-4 text-sm text-gray-600">
                  <div class="flex items-center space-x-2">
                    <img 
                      v-if="feedback.avatar_url" 
                      :src="feedback.avatar_url" 
                      :alt="feedback.username"
                      class="w-6 h-6 rounded-full"
                    />
                    <div v-else class="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <User class="w-4 h-4 text-gray-600" />
                    </div>
                    <span class="font-medium">{{ feedback.display_name || feedback.username }}</span>
                  </div>
                  <span>•</span>
                  <span>{{ formatDate(feedback.created_at) }}</span>
                  <span v-if="feedback.updated_at !== feedback.created_at">
                    • 更新于 {{ formatDate(feedback.updated_at) }}
                  </span>
                </div>
              </div>
              
              <!-- 投票区域 -->
              <div class="flex flex-col items-center space-y-2 bg-gray-50 rounded-lg p-3">
                <button 
                  @click="vote('up')"
                  class="p-2 rounded-lg hover:bg-white transition-colors"
                  :class="feedback.userVote === 'up' ? 'text-primary-600 bg-white shadow-sm' : 'text-gray-600'"
                  :disabled="!authStore.isAuthenticated || voting"
                >
                  <ArrowUp class="w-6 h-6" />
                </button>
                <span class="text-lg font-semibold text-gray-900">
                  {{ feedback.votes_count }}
                </span>
                <button 
                  @click="vote('down')"
                  class="p-2 rounded-lg hover:bg-white transition-colors"
                  :class="feedback.userVote === 'down' ? 'text-red-600 bg-white shadow-sm' : 'text-gray-600'"
                  :disabled="!authStore.isAuthenticated || voting"
                >
                  <ArrowDown class="w-6 h-6" />
                </button>
              </div>
            </div>

            <!-- 标签 -->
            <div class="flex items-center flex-wrap gap-2 mb-6">
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
              <span 
                class="tag tag-gray"
              >
                {{ getPriorityLabel(feedback.priority) }}
              </span>
            </div>

            <!-- 描述内容 -->
            <div class="prose max-w-none">
              <div class="whitespace-pre-wrap text-gray-700">{{ feedback.description }}</div>
            </div>
          </div>

          <!-- 评论区域 -->
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">
              评论 ({{ feedback.comments?.length || 0 }})
            </h2>

            <!-- 添加评论表单 -->
            <div v-if="authStore.isAuthenticated" class="mb-8">
              <form @submit.prevent="submitComment" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    添加评论
                  </label>
                  <textarea
                    v-model="newComment.content"
                    rows="4"
                    class="input w-full resize-none"
                    placeholder="分享您的想法..."
                    maxlength="500"
                  ></textarea>
                  <div class="text-right text-xs text-gray-500 mt-1">
                    {{ newComment.content.length }}/500
                  </div>
                </div>
                <div class="flex justify-end">
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    :disabled="!newComment.content.trim() || submittingComment"
                  >
                    <Send v-if="!submittingComment" class="w-4 h-4 mr-2" />
                    <div v-else class="loading-spinner w-4 h-4 mr-2"></div>
                    发表评论
                  </button>
                </div>
              </form>
            </div>

            <!-- 登录提示 -->
            <div v-else class="mb-8 p-4 bg-gray-50 rounded-lg text-center">
              <p class="text-gray-600 mb-4">请登录后参与讨论</p>
              <button 
                @click="authStore.login"
                class="btn btn-primary"
              >
                <Github class="w-4 h-4 mr-2" />
                GitHub 登录
              </button>
            </div>

            <!-- 评论列表 -->
            <div v-if="feedback.comments?.length > 0" class="space-y-6">
              <div 
                v-for="comment in feedback.comments" 
                :key="comment.id"
                class="border-l-2 border-gray-200 pl-6"
              >
                <div class="flex items-start space-x-3">
                  <img 
                    v-if="comment.avatar_url" 
                    :src="comment.avatar_url" 
                    :alt="comment.username"
                    class="w-8 h-8 rounded-full"
                  />
                  <div v-else class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User class="w-5 h-5 text-gray-600" />
                  </div>
                  
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <span class="font-medium text-gray-900">
                        {{ comment.display_name || comment.username }}
                      </span>
                      <span class="text-sm text-gray-500">
                        {{ formatDate(comment.created_at) }}
                      </span>
                    </div>
                    <div class="text-gray-700 whitespace-pre-wrap">
                      {{ comment.content }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 无评论状态 -->
            <div v-else class="text-center py-8">
              <MessageCircle class="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p class="text-gray-500">还没有评论，快来发表第一个评论吧！</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else class="text-center py-16">
        <AlertTriangle class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 class="text-xl font-medium text-gray-900 mb-2">反馈未找到</h2>
        <p class="text-gray-500 mb-6">该反馈可能已被删除或不存在</p>
        <router-link to="/feedback" class="btn btn-primary">
          返回反馈列表
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { 
  ArrowLeft, User, ArrowUp, ArrowDown, Send, 
  Github, MessageCircle, AlertTriangle
} from 'lucide-vue-next'
import { feedbackAPI, votesAPI } from '@/services/api'

const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()

// 响应式数据
const feedback = ref(null)
const loading = ref(true)
const voting = ref(false)
const submittingComment = ref(false)

// 新评论表单
const newComment = reactive({
  content: ''
})

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
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

// 获取类型样式类
const getTypeClass = (type) => {
  return type === 'bug' ? 'tag-error' : 'tag-primary'
}

// 获取类型标签
const getTypeLabel = (type) => {
  return type === 'bug' ? 'Bug报告' : '功能建议'
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

// 获取优先级标签
const getPriorityLabel = (priority) => {
  const labels = {
    low: '低优先级',
    medium: '中等优先级',
    high: '高优先级',
    critical: '紧急'
  }
  return labels[priority] || priority
}

// 投票
const vote = async (voteType) => {
  if (!authStore.isAuthenticated) {
    toast.error('请先登录')
    return
  }

  voting.value = true
  try {
    await votesAPI.vote({ 
      feedback_id: feedback.value.id, 
      vote_type: voteType 
    })
    
    // 重新获取反馈详情以更新投票状态
    await fetchFeedbackDetail()
    
  } catch (error) {
    console.error('投票失败:', error)
  } finally {
    voting.value = false
  }
}

// 提交评论
const submitComment = async () => {
  if (!newComment.content.trim()) return

  submittingComment.value = true
  try {
    const response = await feedbackAPI.addComment(feedback.value.id, {
      content: newComment.content.trim()
    })
    
    // 添加新评论到列表
    if (!feedback.value.comments) {
      feedback.value.comments = []
    }
    feedback.value.comments.push(response.data)
    
    // 清空表单
    newComment.content = ''
    
    toast.success('评论发表成功')
  } catch (error) {
    console.error('发表评论失败:', error)
    toast.error('发表评论失败')
  } finally {
    submittingComment.value = false
  }
}

// 获取反馈详情
const fetchFeedbackDetail = async () => {
  const feedbackId = route.params.id
  
  try {
    const response = await feedbackAPI.getDetail(feedbackId)
    feedback.value = response.data
  } catch (error) {
    console.error('获取反馈详情失败:', error)
    if (error.response?.status === 404) {
      feedback.value = null
    } else {
      toast.error('获取反馈详情失败')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchFeedbackDetail()
})
</script>
