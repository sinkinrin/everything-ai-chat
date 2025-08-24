import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)
  
  // 检查认证状态
  const checkAuthStatus = async () => {
    loading.value = true
    try {
      const response = await api.get('/auth/status')
      if (response.data.isAuthenticated) {
        user.value = response.data.user
        isAuthenticated.value = true
      } else {
        user.value = null
        isAuthenticated.value = false
      }
    } catch (error) {
      console.error('检查认证状态失败:', error)
      user.value = null
      isAuthenticated.value = false
    } finally {
      loading.value = false
    }
  }
  
  // 登录 - 跳转到GitHub OAuth
  const login = () => {
    window.location.href = '/api/auth/github'
  }
  
  // 登出
  const logout = async () => {
    loading.value = true
    try {
      await api.post('/auth/logout')
      user.value = null
      isAuthenticated.value = false
    } catch (error) {
      console.error('登出失败:', error)
    } finally {
      loading.value = false
    }
  }
  
  // 获取用户信息
  const getUserInfo = async () => {
    loading.value = true
    try {
      const response = await api.get('/auth/me')
      user.value = response.data.user
      isAuthenticated.value = true
      return response.data.user
    } catch (error) {
      console.error('获取用户信息失败:', error)
      user.value = null
      isAuthenticated.value = false
      return null
    } finally {
      loading.value = false
    }
  }
  
  return {
    // 状态
    user,
    isAuthenticated,
    loading,
    
    // 方法
    checkAuthStatus,
    login,
    logout,
    getUserInfo
  }
})
