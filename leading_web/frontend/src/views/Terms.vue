<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          服务条款
        </h1>
        <p class="text-lg text-gray-600">
          使用 Everything AI Chat 前请仔细阅读以下条款
        </p>
        <p class="text-sm text-gray-500 mt-2">
          最后更新时间：{{ new Date().toLocaleDateString('zh-CN') }}
        </p>
      </div>

      <!-- 条款内容 -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <div class="prose prose-lg max-w-none">
          
          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">接受条款</h2>
            <p class="text-gray-600 mb-4">
              通过访问和使用 Everything AI Chat（以下简称"本软件"或"服务"），您表示同意遵守本服务条款。
              如果您不同意这些条款，请停止使用本服务。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">服务描述</h2>
            <p class="text-gray-600 mb-4">
              Everything AI Chat 是一款基于 Everything 搜索引擎的 AI 智能文件搜索客户端，提供以下功能：
            </p>
            <ul class="list-disc list-inside text-gray-600 space-y-2">
              <li>本地文件快速搜索</li>
              <li>AI 智能语义理解</li>
              <li>用户反馈和建议系统</li>
              <li>软件更新和技术支持</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">用户责任</h2>
            <p class="text-gray-600 mb-4">使用本服务时，您承诺：</p>
            <ul class="list-disc list-inside text-gray-600 space-y-2">
              <li>遵守所有适用的法律法规</li>
              <li>不进行任何非法或有害的活动</li>
              <li>不干扰或破坏服务的正常运行</li>
              <li>不上传或分享恶意内容</li>
              <li>尊重他人的权利和隐私</li>
              <li>保护自己的账户安全</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">知识产权</h2>
            <p class="text-gray-600 mb-4">
              本软件及其所有内容、功能和特性均受版权、商标和其他知识产权法律保护。
            </p>
            <ul class="list-disc list-inside text-gray-600 space-y-2">
              <li>软件源代码受开源许可证保护</li>
              <li>用户界面设计归我们所有</li>
              <li>用户生成的内容归用户所有</li>
              <li>禁止未经授权的复制或分发</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">隐私保护</h2>
            <p class="text-gray-600 mb-4">
              我们重视您的隐私。有关我们如何收集、使用和保护您的信息的详细说明，
              请参阅我们的 <router-link to="/privacy" class="text-blue-600 hover:text-blue-700">隐私政策</router-link>。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">免责声明</h2>
            <p class="text-gray-600 mb-4">
              本服务按"原样"提供，我们不对以下情况承担责任：
            </p>
            <ul class="list-disc list-inside text-gray-600 space-y-2">
              <li>服务的连续性、准确性或完整性</li>
              <li>因使用本服务而导致的任何损失</li>
              <li>第三方内容或链接的准确性</li>
              <li>不可抗力因素导致的服务中断</li>
              <li>用户数据的意外丢失或损坏</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">服务变更</h2>
            <p class="text-gray-600 mb-4">
              我们保留随时修改、暂停或终止服务的权利，恕不另行通知。重大变更时，
              我们会尽力提前通知用户。
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">争议解决</h2>
            <p class="text-gray-600 mb-4">
              因使用本服务而产生的任何争议，应首先通过友好协商解决。
              如协商不成，可通过以下方式解决：
            </p>
            <ul class="list-disc list-inside text-gray-600 space-y-2">
              <li>向相关监管部门投诉</li>
              <li>通过仲裁机构仲裁</li>
              <li>向有管辖权的法院提起诉讼</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">条款更新</h2>
            <p class="text-gray-600 mb-4">
              我们可能会不时更新这些服务条款。更新时，我们会修改页面顶部的"最后更新时间"。
              重大更改时，我们会通过适当方式通知您。继续使用服务即表示您接受更新后的条款。
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">联系我们</h2>
            <p class="text-gray-600 mb-4">
              如果您对本服务条款有任何疑问，请联系我们：
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
  name: 'Terms'
})
</script>

<style scoped>
.prose h2 {
  @apply border-b border-gray-200 pb-2;
}
</style>
