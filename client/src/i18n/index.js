import { createI18n } from 'vue-i18n'

// 导入语言包
import zhCN from './locales/zh-CN.js'
import zhTW from './locales/zh-TW.js'
import enUS from './locales/en-US.js' 
import esES from './locales/es-ES.js'
import bnBD from './locales/bn-BD.js'
import hiIN from './locales/hi-IN.js'
import arSA from './locales/ar-SA.js'
import ptPT from './locales/pt-PT.js'
import ruRU from './locales/ru-RU.js'
import jaJP from './locales/ja-JP.js'
import deDE from './locales/de-DE.js'

// 获取系统默认语言，如果不支持则使用中文
function getDefaultLocale() {
  const systemLocale = navigator.language || navigator.userLanguage
  const supportedLocales = ['zh-CN', 'zh-TW', 'en-US', 'es-ES', 'bn-BD', 'hi-IN', 'ar-SA', 'pt-PT', 'ru-RU', 'ja-JP', 'de-DE']
  
  // 精确匹配
  if (supportedLocales.includes(systemLocale)) {
    return systemLocale
  }
  
  // 语言代码匹配（如 zh 匹配 zh-CN）
  const languageCode = systemLocale.split('-')[0]
  const matched = supportedLocales.find(locale => locale.split('-')[0] === languageCode)
  if (matched) {
    return matched
  }
  
  // 默认使用中文
  return 'zh-CN'
}

// 从localStorage读取保存的语言设置
function getSavedLocale() {
  try {
    return localStorage.getItem('app-language') || getDefaultLocale()
  } catch (error) {
    console.warn('无法读取语言设置:', error)
    return getDefaultLocale()
  }
}

// 创建i18n实例
const i18n = createI18n({
  legacy: false, // 使用Composition API模式
  locale: getSavedLocale(),
  fallbackLocale: 'zh-CN', // 回退语言为中文
  globalInjection: true, // 全局注入$t函数
  messages: {
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'en-US': enUS,
    'es-ES': esES,
    'bn-BD': bnBD,
    'hi-IN': hiIN,
    'ar-SA': arSA,
    'pt-PT': ptPT,
    'ru-RU': ruRU,
    'ja-JP': jaJP,
    'de-DE': deDE
  }
})

// 保存语言设置到localStorage
export function setLocale(locale) {
  try {
    localStorage.setItem('app-language', locale)
    i18n.global.locale.value = locale
    
    // 设置HTML的lang和dir属性
    document.documentElement.lang = locale
    document.documentElement.dir = ['ar-SA'].includes(locale) ? 'rtl' : 'ltr'
    
    return true
  } catch (error) {
    console.error('保存语言设置失败:', error)
    return false
  }
}

// 获取当前语言
export function getCurrentLocale() {
  return i18n.global.locale.value
}

// 获取支持的语言列表
export function getSupportedLocales() {
  return [
    { code: 'zh-CN', name: '简体中文', nativeName: '简体中文' },
    { code: 'zh-TW', name: '繁體中文', nativeName: '繁體中文' },
    { code: 'en-US', name: 'English', nativeName: 'English' },
    { code: 'es-ES', name: 'Spanish', nativeName: 'Español' },
    { code: 'bn-BD', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'ar-SA', name: 'Arabic', nativeName: 'العربية' },
    { code: 'pt-PT', name: 'Portuguese', nativeName: 'Português' },
    { code: 'ru-RU', name: 'Russian', nativeName: 'Русский' },
    { code: 'ja-JP', name: 'Japanese', nativeName: '日本語' },
    { code: 'de-DE', name: 'German', nativeName: 'Deutsch' }
  ]
}

// 检查是否为RTL语言
export function isRTL(locale = null) {
  const currentLocale = locale || getCurrentLocale()
  return ['ar-SA'].includes(currentLocale)
}

// 初始化时设置HTML属性
document.documentElement.lang = getSavedLocale()
document.documentElement.dir = isRTL() ? 'rtl' : 'ltr'

export default i18n
