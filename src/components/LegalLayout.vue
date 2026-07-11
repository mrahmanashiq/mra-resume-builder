<template>
  <div class="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 flex flex-col">
    <header class="border-b border-gray-200 dark:border-slate-700 bg-white/85 backdrop-blur-md dark:bg-slate-900/85">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <router-link to="/" aria-label="Resume Builder home"><AppLogo /></router-link>
        <div class="flex items-center gap-3">
          <ThemeToggle />
          <router-link to="/editor" class="btn-primary text-sm px-4 py-2">Start building</router-link>
        </div>
      </div>
    </header>

    <main class="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 class="legal-h1 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">{{ title }}</h1>
      <p v-if="updated" class="text-sm text-gray-500 dark:text-slate-400 mb-8">Last updated {{ updated }}</p>
      <div class="legal-prose"><slot /></div>
    </main>

    <SiteFooter />
  </div>
</template>

<script>
import AppLogo from './AppLogo.vue'
import SiteFooter from './SiteFooter.vue'

export default {
  name: 'LegalLayout',
  components: { AppLogo, SiteFooter },
  props: {
    title: { type: String, required: true },
    updated: { type: String, default: '' }
  }
}
</script>

<style scoped src="./LegalLayout.css"></style>
