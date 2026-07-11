<template>
  <div v-if="page" class="landing min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
    <!-- Nav -->
    <header class="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 dark:bg-slate-900/85">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-2">
        <router-link to="/" aria-label="Resume Builder home"><AppLogo /></router-link>
        <div class="flex items-center gap-3">
          <ThemeToggle />
          <router-link :to="page.ctaRoute" class="btn-primary text-sm px-4 py-2 whitespace-nowrap">{{ page.ctaLabel }}</router-link>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 sm:px-6">
      <!-- Hero -->
      <section class="py-12 sm:py-16">
        <h1 class="landing-title text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-5">{{ page.h1 }}</h1>
        <p class="text-lg text-gray-600 dark:text-slate-300 mb-8 max-w-2xl">{{ page.intro }}</p>
        <router-link :to="page.ctaRoute" class="btn-primary text-lg px-8 py-3">{{ page.ctaLabel }}</router-link>
      </section>

      <!-- How-to steps -->
      <section class="py-8 border-t border-gray-100 dark:border-slate-800">
        <h2 class="landing-title text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">{{ page.stepsHeading }}</h2>
        <ol class="space-y-5">
          <li v-for="(s, i) in page.steps" :key="i" class="flex gap-4">
            <span class="flex-none w-8 h-8 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 font-semibold flex items-center justify-center">{{ i + 1 }}</span>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-slate-100">{{ s.name }}</h3>
              <p class="text-gray-600 dark:text-slate-400">{{ s.text }}</p>
            </div>
          </li>
        </ol>
      </section>

      <!-- Tips -->
      <section class="py-8 border-t border-gray-100 dark:border-slate-800">
        <h2 class="landing-title text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">{{ page.tipsHeading }}</h2>
        <ul class="space-y-2">
          <li v-for="(t, i) in page.tips" :key="i" class="flex gap-2 text-gray-700 dark:text-slate-300">
            <span class="flex-none text-green-600 dark:text-green-400 font-semibold">&#10003;</span>
            <span>{{ t }}</span>
          </li>
        </ul>
      </section>

      <!-- FAQ -->
      <section class="py-8 border-t border-gray-100 dark:border-slate-800">
        <h2 class="landing-title text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">Frequently asked questions</h2>
        <div class="space-y-5">
          <div v-for="(f, i) in page.faqs" :key="i">
            <h3 class="font-semibold text-gray-900 dark:text-slate-100 mb-1">{{ f.q }}</h3>
            <p class="text-gray-600 dark:text-slate-400">{{ f.a }}</p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="py-12 text-center border-t border-gray-100 dark:border-slate-800">
        <h2 class="landing-title text-2xl font-bold text-gray-900 dark:text-slate-100 mb-3">Ready to start?</h2>
        <p class="text-gray-600 dark:text-slate-400 mb-6">Free, no sign-up, and your data never leaves your browser.</p>
        <router-link :to="page.ctaRoute" class="btn-primary text-lg px-8 py-3">{{ page.ctaLabel }}</router-link>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import AppLogo from '../../components/AppLogo.vue'
import SiteFooter from '../../components/SiteFooter.vue'
import { getLandingPage, landingJsonLd } from '../../seo/landing'
import { absoluteUrl } from '../../seo/site'

export default {
  name: 'LandingPage',
  components: { AppLogo, SiteFooter },
  setup() {
    const route = useRoute()
    const page = computed(() => getLandingPage(route.meta && route.meta.landing))

    // Title/description/canonical/OG come from App.vue via route.meta.seo.
    // Here we add the page-specific HowTo + FAQPage structured data.
    useHead(
      computed(() => {
        const p = page.value
        if (!p) return {}
        return {
          script: landingJsonLd(p, absoluteUrl(route.path)).map((obj) => ({
            type: 'application/ld+json',
            innerHTML: JSON.stringify(obj)
          }))
        }
      })
    )

    return { page }
  }
}
</script>

<style scoped src="./LandingPage.css"></style>
