<template>
  <footer class="bg-gray-900 text-gray-300 dark:bg-slate-950">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="col-span-2 md:col-span-1">
          <div class="flex items-center gap-2 mb-3">
            <span class="inline-block w-2.5 h-2.5 rounded-sm bg-green-500"></span>
            <span class="text-white font-semibold tracking-tight">Resume Builder</span>
          </div>
          <p class="text-sm text-gray-400 leading-relaxed">
            Free and open source resume, marriage biodata, and cover letter builder.
            No sign-up, and your data stays in your browser.
          </p>
        </div>

        <!-- Product -->
        <nav aria-label="Product">
          <h3 class="footer-h">Product</h3>
          <ul class="space-y-2.5">
            <li><router-link class="footer-link" to="/editor">Resume builder</router-link></li>
            <li><router-link class="footer-link" to="/biodata">Marriage biodata</router-link></li>
            <li><router-link class="footer-link" to="/cover-letter">Cover letter</router-link></li>
            <li><router-link class="footer-link" to="/templates">Templates</router-link></li>
          </ul>
        </nav>

        <!-- Guides -->
        <nav aria-label="Guides">
          <h3 class="footer-h">Guides</h3>
          <ul class="space-y-2.5">
            <li><router-link class="footer-link" to="/marriage-biodata-format">Marriage biodata format</router-link></li>
            <li><router-link class="footer-link" to="/software-engineer-resume-template">Software engineer resume</router-link></li>
            <li><router-link class="footer-link" to="/free-ats-resume-builder">Free ATS resume builder</router-link></li>
          </ul>
        </nav>

        <!-- Project -->
        <nav aria-label="Project">
          <h3 class="footer-h">Project</h3>
          <ul class="space-y-2.5">
            <li><router-link class="footer-link" to="/privacy">Privacy</router-link></li>
            <li><a class="footer-link" :href="githubUrl" target="_blank" rel="noopener">GitHub</a></li>
            <li><a class="footer-link" :href="githubUrl + '/issues'" target="_blank" rel="noopener">Report an issue</a></li>
            <li><a class="footer-link" :href="githubUrl + '/blob/master/LICENSE'" target="_blank" rel="noopener">MIT License</a></li>
          </ul>
        </nav>
      </div>

      <div class="mt-12 pt-6 border-t border-gray-800 flex flex-col gap-4">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <nav aria-label="Legal" class="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            <router-link class="text-gray-400 hover:text-white transition-colors" to="/privacy">Privacy</router-link>
            <router-link class="text-gray-400 hover:text-white transition-colors" to="/terms">Terms</router-link>
            <span class="text-gray-500">No cookies &middot; No tracking &middot; Your data stays on your device</span>
          </nav>
          <div class="flex items-center gap-4">
            <a :href="githubUrl" target="_blank" rel="noopener" aria-label="GitHub repository" class="text-gray-500 hover:text-white transition-colors">
              <CodeBracketIcon class="w-5 h-5" />
            </a>
            <a :href="authorUrl" target="_blank" rel="noopener" aria-label="Author website" class="text-gray-500 hover:text-white transition-colors">
              <GlobeAltIcon class="w-5 h-5" />
            </a>
          </div>
        </div>
        <p class="text-sm text-gray-500 text-center sm:text-left">
          &copy; {{ year }} Resume Builder &middot; Released under the MIT License &middot; Built by
          <a :href="authorUrl" target="_blank" rel="noopener" class="text-gray-400 hover:text-white underline underline-offset-2">{{ authorName }}</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
import { CodeBracketIcon, GlobeAltIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'SiteFooter',
  components: { CodeBracketIcon, GlobeAltIcon },
  data() {
    return {
      githubUrl: 'https://github.com/mrahmanashiq/mra-resume-builder',
      authorName: 'Mizanur Rahman Ashiq',
      authorUrl: 'https://mrahmanashiq.vercel.app',
      // Current year, so the copyright updates automatically.
      year: new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
.footer-h {
  color: #9ca3af;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.9rem;
}
.footer-link {
  color: #d1d5db;
  font-size: 0.9rem;
  transition: color 0.15s ease;
}
.footer-link:hover {
  color: #ffffff;
}
</style>
