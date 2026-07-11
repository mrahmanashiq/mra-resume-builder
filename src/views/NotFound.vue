<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
    <!-- Header -->
    <header class="w-full px-4 sm:px-6 lg:px-8 py-4">
      <router-link to="/" class="inline-flex items-center" aria-label="Resume Builder home">
        <AppLogo />
      </router-link>
    </header>

    <!-- Content -->
    <main class="flex-1 flex items-center justify-center px-4 py-12">
      <div class="text-center max-w-xl">
        <p class="text-[6.5rem] sm:text-[9rem] font-extrabold leading-none tracking-tight text-primary-600 dark:text-primary-400">
          404
        </p>
        <h1 class="mt-1 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100">
          This page didn't make the shortlist
        </h1>
        <p class="mt-3 text-gray-600 dark:text-slate-400">
          The page you are looking for does not exist or has moved. Let's get you back to building.
        </p>

        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <router-link to="/" class="btn-primary inline-flex items-center justify-center">Back to home</router-link>
          <router-link to="/editor" class="btn-outline inline-flex items-center justify-center">Resume builder</router-link>
          <router-link to="/templates" class="btn-outline inline-flex items-center justify-center">Templates</router-link>
        </div>

        <p class="mt-6 text-sm text-gray-500 dark:text-slate-400">
          Or try the
          <router-link to="/biodata" class="text-primary-600 hover:underline dark:text-primary-400">biodata maker</router-link>
          or the
          <router-link to="/cover-letter" class="text-primary-600 hover:underline dark:text-primary-400">cover letter builder</router-link>.
        </p>
      </div>
    </main>

    <SiteFooter />
  </div>
</template>

<script>
import AppLogo from '../components/AppLogo.vue'
import SiteFooter from '../components/SiteFooter.vue'

export default {
  name: 'NotFound',
  components: { AppLogo, SiteFooter }
}
</script>
