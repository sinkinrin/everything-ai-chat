import { createApp } from 'vue';
import DebugWindow from './components/DebugWindow.vue';

// 创建Vue应用实例
const app = createApp(DebugWindow);

// 挂载到DOM
app.mount('#app');
