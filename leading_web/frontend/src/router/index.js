import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// 路由组件
const Home = () => import('@/views/Home.vue')
const Features = () => import('@/views/Features.vue')
const Download = () => import('@/views/Download.vue')
const Feedback = () => import('@/views/Feedback.vue')
const FeedbackDetail = () => import('@/views/FeedbackDetail.vue')
const CreateFeedback = () => import('@/views/CreateFeedback.vue')
const Docs = () => import('@/views/Docs.vue')
const Login = () => import('@/views/Login.vue')
const Profile = () => import('@/views/Profile.vue')
const NotFound = () => import('@/views/NotFound.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Everything AI Chat - 智能文件搜索助手'
    }
  },
  {
    path: '/features',
    name: 'Features',
    component: Features,
    meta: {
      title: '产品特性 - Everything AI Chat'
    }
  },
  {
    path: '/download',
    name: 'Download',
    component: Download,
    meta: {
      title: '下载软件 - Everything AI Chat'
    }
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: Feedback,
    meta: {
      title: '用户反馈 - Everything AI Chat'
    }
  },
  {
    path: '/feedback/create',
    name: 'CreateFeedback',
    component: CreateFeedback,
    meta: {
      title: '提交反馈 - Everything AI Chat',
      requiresAuth: true
    }
  },
  {
    path: '/feedback/:id',
    name: 'FeedbackDetail',
    component: FeedbackDetail,
    meta: {
      title: '反馈详情 - Everything AI Chat'
    }
  },
  {
    path: '/docs',
    name: 'Docs',
    component: Docs,
    meta: {
      title: '使用文档 - Everything AI Chat'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '用户登录 - Everything AI Chat'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: '个人中心 - Everything AI Chat',
      requiresAuth: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: '页面未找到 - Everything AI Chat'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // 设置页面标题
  document.title = to.meta.title || 'Everything AI Chat'
  
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // 重定向到登录页面，并保存原始路径
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }
  
  // 如果已经登录，不需要再访问登录页面
  if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Home' })
    return
  }
  
  next()
})

export default router
