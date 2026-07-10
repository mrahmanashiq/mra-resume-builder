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

<style>
/* Thin indeterminate top progress bar (non-blocking). */
.route-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 100;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}
.route-progress--active {
  opacity: 1;
}
.route-progress::before {
  content: '';
  position: absolute;
  top: 0;
  height: 100%;
  width: 40%;
  background: linear-gradient(90deg, transparent, #3b82f6, #6366f1, transparent);
  animation: route-progress-slide 0.9s infinite linear;
}
@keyframes route-progress-slide {
  from { left: -40%; }
  to { left: 100%; }
}

/* Calm Suspense fallback - a small centered spinner, not a full-screen flash. */
.route-fallback {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.route-fallback__spinner {
  width: 34px;
  height: 34px;
  border-radius: 9999px;
  border: 3px solid rgba(37, 99, 235, 0.2);
  border-top-color: #2563eb;
  animation: route-spin 0.7s linear infinite;
}
@keyframes route-spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .route-progress::before { animation: none; }
  .route-fallback__spinner { animation: none; }
}
</style>
