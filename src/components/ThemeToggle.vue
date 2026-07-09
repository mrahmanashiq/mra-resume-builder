<template>
  <button
    type="button"
    @click="toggleTheme"
    class="theme-toggle inline-flex items-center justify-center h-9 w-9 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <SunIcon v-if="isDark" class="w-5 h-5" />
    <MoonIcon v-else class="w-5 h-5" />
  </button>
</template>

<script>
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'
import { useTheme } from '../composables/useTheme'

export default {
  name: 'ThemeToggle',
  components: { SunIcon, MoonIcon },
  setup() {
    const { isDark, toggleTheme } = useTheme()
    return { isDark, toggleTheme }
  }
}
</script>
