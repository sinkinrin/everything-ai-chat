<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <div class="flex items-center space-x-4 mb-4">
          <button 
            @click="$router.go(-1)"
            class="btn btn-ghost"
          >
            <ArrowLeft class="w-4 h-4 mr-2" />
            返回
          </button>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">提交反馈</h1>
        <p class="text-gray-600">
          分享您的想法和建议，帮助我们改进产品
        </p>
      </div>

      <!-- 反馈表单 -->
      <div class="card p-8">
        <form @submit.prevent="submitFeedback" class="space-y-6">
          <!-- 反馈类型 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              反馈类型 <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label 
                v-for="type in feedbackTypes"
                :key="type.value"
                class="relative cursor-pointer"
              >
                <input
                  v-model="form.type"
                  type="radio"
                  :value="type.value"
                  class="sr-only"
                >
                <div 
                  class="card p-4 border-2 transition-all"
                  :class="form.type === type.value 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'"
                >
                  <div class="flex items-center space-x-3">
                    <component :is="type.icon" class="w-6 h-6" :class="type.color" />
                    <div>
                      <div class="font-medium text-gray-900">{{ type.label }}</div>
                      <div class="text-sm text-gray-500">{{ type.description }}</div>
                    </div>
                  </div>
                </div>
              </label>
            </div>
            <p v-if="errors.type" class="text-red-500 text-sm mt-1">{{ errors.type }}</p>
          </div>

          <!-- 分类 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              反馈分类 <span class="text-red-500">*</span>
            </label>
            <select 
              v-model="form.category_id" 
              class="input w-full"
              :class="{ 'input-error': errors.category_id }"
            >
              <option value="">请选择分类</option>
              <option 
                v-for="category in categories" 
                :key="category.id" 
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
            <p v-if="errors.category_id" class="text-red-500 text-sm mt-1">{{ errors.category_id }}</p>
          </div>

          <!-- 优先级 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              优先级
            </label>
            <select v-model="form.priority" class="input w-full">
              <option value="low">低优先级</option>
              <option value="medium">中等优先级</option>
              <option value="high">高优先级</option>
              <option value="critical">紧急</option>
            </select>
          </div>

          <!-- 标题 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              标题 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              class="input w-full"
              :class="{ 'input-error': errors.title }"
              placeholder="简洁明了地描述您的反馈"
              maxlength="255"
            >
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <p v-if="errors.title" class="text-red-500">{{ errors.title }}</p>
              <span class="ml-auto">{{ form.title.length }}/255</span>
            </div>
          </div>

          <!-- 详细描述 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              详细描述 <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.description"
              rows="8"
              class="input w-full resize-none"
              :class="{ 'input-error': errors.description }"
              placeholder="详细描述您遇到的问题或想要的功能，包括重现步骤、期望行为等"
              maxlength="2000"
            ></textarea>
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <p v-if="errors.description" class="text-red-500">{{ errors.description }}</p>
              <span class="ml-auto">{{ form.description.length }}/2000</span>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="flex justify-end space-x-4 pt-6">
            <button 
              type="button"
              @click="$router.go(-1)"
              class="btn btn-secondary"
            >
              取消
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="submitting"
            >
              <Send v-if="!submitting" class="w-4 h-4 mr-2" />
              <div v-else class="loading-spinner w-4 h-4 mr-2"></div>
              {{ submitting ? '提交中...' : '提交反馈' }}
            </button>
          </div>
        </form>
      </div>

      <!-- 提示信息 -->
      <div class="mt-8 card p-6 bg-blue-50 border-l-4 border-blue-400">
        <div class="flex items-start space-x-3">
          <Lightbulb class="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h3 class="font-medium text-blue-900 mb-2">提交反馈小贴士</h3>
            <ul class="text-sm text-blue-800 space-y-1">
              <li>• 请尽量详细描述问题或建议，这有助于我们更好地理解和处理</li>
              <li>• Bug报告请包含重现步骤、预期行为和实际行为</li>
              <li>• 功能建议请说明使用场景和具体需求</li>
              <li>• 提交前请搜索现有反馈，避免重复提交</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { 
  ArrowLeft, Send, Bug, Star, Lightbulb 
} from 'lucide-vue-next'
import { feedbackAPI } from '@/services/api'

const router = useRouter()
const toast = useToast()

// 响应式数据
const categories = ref([])
const submitting = ref(false)

// 反馈类型配置
const feedbackTypes = [
  {
    value: 'bug',
    label: 'Bug报告',
    description: '发现了程序错误或异常行为',
    icon: Bug,
    color: 'text-red-600'
  },
  {
    value: 'feature',
    label: '功能建议',
    description: '希望添加新功能或改进现有功能',
    icon: Star,
    color: 'text-blue-600'
  }
]

// 表单数据
const form = reactive({
  type: '',
  category_id: '',
  priority: 'medium',
  title: '',
  description: ''
})

// 错误信息
const errors = reactive({
  type: '',
  category_id: '',
  title: '',
  description: ''
})

// 表单验证
const validateForm = () => {
  // 清空之前的错误
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  let isValid = true

  // 验证反馈类型
  if (!form.type) {
    errors.type = '请选择反馈类型'
    isValid = false
  }

  // 验证分类
  if (!form.category_id) {
    errors.category_id = '请选择反馈分类'
    isValid = false
  }

  // 验证标题
  if (!form.title.trim()) {
    errors.title = '请输入标题'
    isValid = false
  } else if (form.title.length < 5) {
    errors.title = '标题至少需要5个字符'
    isValid = false
  } else if (form.title.length > 255) {
    errors.title = '标题不能超过255个字符'
    isValid = false
  }

  // 验证描述
  if (!form.description.trim()) {
    errors.description = '请输入详细描述'
    isValid = false
  } else if (form.description.length < 10) {
    errors.description = '描述至少需要10个字符'
    isValid = false
  } else if (form.description.length > 2000) {
    errors.description = '描述不能超过2000个字符'
    isValid = false
  }

  return isValid
}

// 提交反馈
const submitFeedback = async () => {
  if (!validateForm()) {
    return
  }

  submitting.value = true

  try {
    const response = await feedbackAPI.create({
      type: form.type,
      category_id: parseInt(form.category_id),
      priority: form.priority,
      title: form.title.trim(),
      description: form.description.trim()
    })

    toast.success('反馈提交成功！')
    
    // 跳转到反馈详情页
    router.push(`/feedback/${response.data.id}`)
    
  } catch (error) {
    console.error('提交反馈失败:', error)
    
    // 处理验证错误
    if (error.response?.status === 400) {
      const errorMessage = error.response.data.error || '表单验证失败'
      toast.error(errorMessage)
    } else {
      toast.error('提交失败，请稍后重试')
    }
  } finally {
    submitting.value = false
  }
}

// 获取分类列表
const fetchCategories = async () => {
  try {
    const response = await feedbackAPI.getCategories()
    categories.value = response.data
  } catch (error) {
    console.error('获取分类失败:', error)
    toast.error('获取分类失败')
  }
}

onMounted(() => {
  fetchCategories()
})
</script>
