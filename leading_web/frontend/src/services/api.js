import axios from 'axios'
import { useToast } from 'vue-toastification'

const toast = useToast()

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token等
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('响应错误:', error)
    
    // 处理不同的错误状态
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          toast.error(data.message || data.error || '请求参数错误')
          break
        case 401:
          toast.error('请先登录')
          // 可以在这里处理未认证的情况，比如跳转到登录页
          break
        case 403:
          toast.error('权限不足')
          break
        case 404:
          toast.error('资源不存在')
          break
        case 422:
          toast.error(data.message || '数据验证失败')
          break
        case 429:
          toast.error('请求过于频繁，请稍后再试')
          break
        case 500:
          toast.error('服务器内部错误')
          break
        default:
          toast.error(data.message || data.error || '网络错误')
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      toast.error('网络连接失败，请检查网络设置')
    } else {
      // 其他错误
      toast.error('发生未知错误')
    }
    
    return Promise.reject(error)
  }
)

// API方法
export const authAPI = {
  // 检查登录状态
  checkStatus: () => api.get('/auth/status'),
  
  // 获取用户信息
  getMe: () => api.get('/auth/me'),
  
  // 登出
  logout: () => api.post('/auth/logout')
}

export const feedbackAPI = {
  // 获取反馈分类
  getCategories: () => api.get('/feedback/categories'),
  
  // 获取反馈列表
  getList: (params = {}) => api.get('/feedback', { params }),
  
  // 获取反馈详情
  getDetail: (id) => api.get(`/feedback/${id}`),
  
  // 创建反馈
  create: (data) => api.post('/feedback', data),
  
  // 添加评论
  addComment: (id, data) => api.post(`/feedback/${id}/comments`, data)
}

export const votesAPI = {
  // 投票
  vote: (data) => api.post('/votes', data),
  
  // 获取投票状态
  getStatus: (feedbackId) => api.get(`/votes/status/${feedbackId}`),
  
  // 获取投票详情
  getDetails: (feedbackId) => api.get(`/votes/details/${feedbackId}`)
}

export const downloadAPI = {
  // 获取最新版本
  getLatest: (params = {}) => api.get('/downloads/latest', { params }),
  
  // 获取版本列表
  getVersions: (params = {}) => api.get('/downloads/versions', { params }),
  
  // 记录下载统计
  trackDownload: (versionId) => api.post(`/downloads/track/${versionId}`),
  
  // 获取下载统计
  getStats: (params = {}) => api.get('/downloads/stats', { params })
}

export default api
