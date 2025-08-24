import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import router from './router'
import App from './App.vue'

// 样式导入
import './style.css'
import 'vue-toastification/dist/index.css'

// 创建应用实例
const app = createApp(App)

// Pinia状态管理
const pinia = createPinia()

// Toast配置
const toastOptions = {
  position: 'top-right',
  timeout: 4000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
  transition: 'Vue-Toastification__bounce',
  maxToasts: 5,
  newestOnTop: true
}

// 使用插件
app.use(pinia)
app.use(router)
app.use(Toast, toastOptions)

// 挂载应用
app.mount('#app')
