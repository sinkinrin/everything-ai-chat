<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          隐私政策
        </h1>
        <p class="text-lg text-gray-600">
          我们重视您的隐私，本政策说明我们如何处理您的个人信息
        </p>
        <p class="text-sm text-gray-500 mt-2">
          最后更新时间：{{ new Date().toLocaleDateString('zh-CN') }}
        </p>
      </div>

      <!-- 政策内容 -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <div class="prose prose-lg max-w-none">
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">信息收集</h2>
            <p class="text-gray-600 mb-4">
              Everything AI Chat 承诺保护您的隐私。我们仅收集必要的信息来为您提供更好的服务体验。
            </p>
            <ul class="list-disc list-inside text-gray-600 space-y-2">
              <li>GitHub 用户基本信息（用户名、邮箱、头像）</li>
              <li>您提交的反馈和建议内容</li>
              <li>软件使用统计数据（匿名化处理）</li>
              <li>网站访问日志（用于安全和性能优化）</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">信息使用</h2>
            <p class="text-gray-600 mb-4">
              我们使用收集的信息用于以下目的：
            </p>
            <ul class="list-disc list-inside text-gray-600 space-y-2">
              <li>提供和维护我们的服务</li>
              <li>改进产品功能和用户体验</li>
              <li>处理用户反馈和技术支持</li>
              <li>发送重要的产品更新通知</li>
              <li>防范欺诈和保障安全</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">信息保护</h2>
            <p class="text-gray-600 mb-4">
              我们采取多重安全措施来保护您的个人信息：
            </p>
            <ul class="list-disc list-inside text-gray-600 space-y-2">
              <li>使用 HTTPS 加密传输</li>
              <li>数据库加密存储</li>
              <li>定期安全审计和更新</li>
              <li>严格的访问权限控制</li>
              <li>员工隐私保护培训</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">信息共享</h2>
            <p class="text-gray-600 mb-4">
              我们不会出售、出租或以其他方式向第三方披露您的个人信息，除非：
            </p>
            <ul class="list-disc list-inside text-gray-600 space-y-2">
              <li>获得您的明确同意</li>
              <li>法律法规要求披露</li>
              <li>保护我们的权利和财产</li>
              <li>防止或解决安全问题</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">用户权利</h2>
            <p class="text-gray-600 mb-4">
              您对自己的个人信息享有以下权利：
            </p>
            <ul class="list-disc list-inside text-gray-600 space-y-2">
              <li>查看和更新个人信息</li>
              <li>删除个人账户和数据</li>
              <li>撤回数据处理授权</li>
              <li>数据可携带权</li>
              <li>投诉和申诉权利</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Cookie 使用</h2>
            <p class="text-gray-600 mb-4">
              我们使用 Cookie 和类似技术来改善您的使用体验。详细信息请查看我们的 
              <router-link to="/cookies" class="text-blue-600 hover:text-blue-700">Cookie 政策</router-link>。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">政策更新</h2>
            <p class="text-gray-600 mb-4">
              我们可能会不时更新本隐私政策。重大更改时，我们会通过网站公告或邮件通知您。
              继续使用我们的服务即表示您接受更新后的政策。
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">联系我们</h2>
            <p class="text-gray-600 mb-4">
              如果您对本隐私政策有任何疑问或建议，请联系我们：
            </p>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-gray-600">
                邮箱：<a href="mailto:eac@jieshi.space" class="text-blue-600 hover:text-blue-700">eac@jieshi.space</a>
              </p>
              <p class="text-gray-600">
                GitHub：<a href="https://github.com/MaskerPRC/everything-ai-chat" target="_blank" class="text-blue-600 hover:text-blue-700">MaskerPRC/everything-ai-chat</a>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 设置页面元信息
defineOptions({
  name: 'Privacy'
})
</script>

<style scoped>
.prose h2 {
  @apply border-b border-gray-200 pb-2;
}
</style>
