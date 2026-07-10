<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <Suspense>
      <router-view />
      <template #fallback>
        <div class="min-h-screen flex items-center justify-center">
          <div class="text-center">
            <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Resume Builder</h2>
            <p class="text-gray-600">Loading...</p>
          </div>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { routeHead } from './seo/site'

export default {
  name: 'App',
  setup() {
    const route = useRoute()
    // Single source of head/SEO: driven by each route's meta.seo (see router).
    useHead(computed(() => routeHead(route)))
  }
}
</script>
