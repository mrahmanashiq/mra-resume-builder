<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <div class="route-progress" :class="{ 'route-progress--active': navigating }" aria-hidden="true"></div>
    <Suspense>
      <router-view />
      <template #fallback>
        <div class="route-fallback">
          <div class="route-fallback__spinner"></div>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { routeHead } from './seo/site'

export default {
  name: 'App',
  setup() {
    const route = useRoute()
    const router = useRouter()
    // Single source of head/SEO: driven by each route's meta.seo (see router).
    useHead(computed(() => routeHead(route)))

    // Non-blocking top progress bar. It only appears if a navigation takes
    // longer than 120ms (a lazy chunk load), so instant client-side navigations
    // never flash a loader. This is deliberately NOT a blocking full-screen
    // loader, which would make fast navigation feel slower.
    const navigating = ref(false)
    let showTimer = null
    router.beforeEach((to, from, next) => {
      clearTimeout(showTimer)
      showTimer = setTimeout(() => { navigating.value = true }, 120)
      next()
    })
    const finish = () => {
      clearTimeout(showTimer)
      navigating.value = false
    }
    router.afterEach(finish)
    router.onError(finish)

    return { navigating }
  }
}
</script>

<style src="./App.css"></style>
