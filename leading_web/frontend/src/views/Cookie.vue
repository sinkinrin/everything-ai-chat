<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Cookie 政策
        </h1>
        <p class="text-lg text-gray-600">
          了解我们如何使用 Cookie 和类似技术改善您的使用体验
        </p>
        <p class="text-sm text-gray-500 mt-2">
          最后更新时间：{{ new Date().toLocaleDateString('zh-CN') }}
        </p>
      </div>

      <!-- 政策内容 -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <div class="prose prose-lg max-w-none">
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">什么是 Cookie？</h2>
            <p class="text-gray-600 mb-4">
              Cookie 是在您访问网站时存储在您设备上的小型文本文件。
              它们帮助网站记住您的偏好和提高用户体验。
            </p>
            <p class="text-gray-600">
              Everything AI Chat 使用 Cookie 来提供更好的服务并分析网站使用情况。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Cookie 类型</h2>
            <p class="text-gray-600 mb-4">我们使用以下类型的 Cookie：</p>
            
            <div class="space-y-6">
              <div class="border-l-4 border-blue-500 pl-4">
                <h3 class="font-semibold text-gray-900 mb-2">必需 Cookie</h3>
                <p class="text-gray-600 text-sm">
                  这些 Cookie 对网站正常运行必不可少，无法禁用。包括会话管理、安全验证等功能。
                </p>
              </div>

              <div class="border-l-4 border-green-500 pl-4">
                <h3 class="font-semibold text-gray-900 mb-2">功能性 Cookie</h3>
                <p class="text-gray-600 text-sm">
                  用于记住您的偏好设置，如语言选择、主题设置等，提供个性化体验。
                </p>
              </div>

              <div class="border-l-4 border-yellow-500 pl-4">
                <h3 class="font-semibold text-gray-900 mb-2">分析 Cookie</h3>
                <p class="text-gray-600 text-sm">
                  帮助我们了解网站使用情况，包括访问量、用户行为等，用于改善服务质量。
                </p>
              </div>

              <div class="border-l-4 border-purple-500 pl-4">
                <h3 class="font-semibold text-gray-900 mb-2">性能 Cookie</h3>
                <p class="text-gray-600 text-sm">
                  收集网站性能数据，如加载时间、错误信息等，用于技术优化。
                </p>
              </div>
            </div>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">具体使用情况</h2>
            <div class="overflow-x-auto">
              <table class="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr class="bg-gray-50">
                    <th class="border border-gray-300 px-4 py-2 text-left">Cookie 名称</th>
                    <th class="border border-gray-300 px-4 py-2 text-left">类型</th>
                    <th class="border border-gray-300 px-4 py-2 text-left">用途</th>
                    <th class="border border-gray-300 px-4 py-2 text-left">保存期限</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">session_id</td>
                    <td class="border border-gray-300 px-4 py-2">必需</td>
                    <td class="border border-gray-300 px-4 py-2">用户会话管理</td>
                    <td class="border border-gray-300 px-4 py-2">会话结束</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">auth_token</td>
                    <td class="border border-gray-300 px-4 py-2">必需</td>
                    <td class="border border-gray-300 px-4 py-2">用户认证状态</td>
                    <td class="border border-gray-300 px-4 py-2">30天</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">theme_preference</td>
                    <td class="border border-gray-300 px-4 py-2">功能性</td>
                    <td class="border border-gray-300 px-4 py-2">主题偏好设置</td>
                    <td class="border border-gray-300 px-4 py-2">1年</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">analytics_id</td>
                    <td class="border border-gray-300 px-4 py-2">分析</td>
                    <td class="border border-gray-300 px-4 py-2">用户行为分析</td>
                    <td class="border border-gray-300 px-4 py-2">2年</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">第三方 Cookie</h2>
            <p class="text-gray-600 mb-4">我们可能使用以下第三方服务的 Cookie：</p>
            <ul class="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>GitHub OAuth：</strong>用于用户登录认证</li>
              <li><strong>Google Analytics：</strong>网站访问统计（如果启用）</li>
              <li><strong>CDN 服务：</strong>静态资源加载优化</li>
            </ul>
            <p class="text-gray-600 mt-4">
              这些第三方服务有自己的隐私政策，我们建议您查看它们的 Cookie 使用说明。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Cookie 管理</h2>
            <p class="text-gray-600 mb-4">您可以通过以下方式管理 Cookie：</p>
            
            <div class="space-y-4">
              <div class="bg-blue-50 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-900 mb-2">浏览器设置</h4>
                <p class="text-gray-600 text-sm">
                  大多数浏览器允许您控制 Cookie 设置。您可以选择接受、拒绝或删除 Cookie。
                  请注意，禁用某些 Cookie 可能会影响网站功能。
                </p>
              </div>

              <div class="bg-green-50 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-900 mb-2">隐私模式</h4>
                <p class="text-gray-600 text-sm">
                  使用浏览器的隐私模式或无痕模式，会话结束后 Cookie 会自动删除。
                </p>
              </div>

              <div class="bg-yellow-50 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-900 mb-2">清除 Cookie</h4>
                <p class="text-gray-600 text-sm">
                  您可以随时清除浏览器中存储的 Cookie。具体操作因浏览器而异。
                </p>
              </div>
            </div>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">不同浏览器的 Cookie 设置</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-900 mb-2">Chrome</h4>
                <p class="text-gray-600 text-sm">
                  设置 → 隐私设置和安全性 → Cookie 和其他网站数据
                </p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-900 mb-2">Firefox</h4>
                <p class="text-gray-600 text-sm">
                  选项 → 隐私与安全 → Cookie 和网站数据
                </p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-900 mb-2">Safari</h4>
                <p class="text-gray-600 text-sm">
                  偏好设置 → 隐私 → Cookie 和网站数据
                </p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-900 mb-2">Edge</h4>
                <p class="text-gray-600 text-sm">
                  设置 → Cookie 和网站权限 → Cookie 和存储的数据
                </p>
              </div>
            </div>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">政策更新</h2>
            <p class="text-gray-600 mb-4">
              我们可能会不时更新此 Cookie 政策。更新时，我们会修改页面顶部的"最后更新时间"。
              重大更改时，我们会通过网站公告或邮件通知您。
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">联系我们</h2>
            <p class="text-gray-600 mb-4">
              如果您对我们的 Cookie 使用有任何疑问，请联系我们：
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
  name: 'Cookie'
})
</script>

<style scoped>
.prose h2 {
  @apply border-b border-gray-200 pb-2;
}

table {
  @apply text-sm;
}

table th {
  @apply bg-gray-100 font-semibold;
}

table td, table th {
  @apply px-3 py-2 border border-gray-300;
}
</style>
