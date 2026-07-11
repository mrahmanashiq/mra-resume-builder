<template>
  <div class="home min-h-screen bg-white text-slate-900 overflow-x-hidden dark:bg-slate-900 dark:text-slate-100">
    <!-- Navigation -->
    <nav class="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 dark:bg-slate-900/85">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16 gap-2">
          <div class="flex items-center min-w-0">
            <AppLogo />
          </div>
          <div class="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <ThemeToggle />
            <a :href="githubUrl" target="_blank" rel="noopener"
               class="hidden md:inline-flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-slate-300 border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-1.5 hover:border-primary-400 hover:text-primary-600 whitespace-nowrap">
              <span class="text-yellow-500">★</span> Star on GitHub
            </a>
            <router-link to="/templates"
                         class="hidden sm:inline-block btn-outline text-sm px-3 py-1.5 sm:text-base sm:px-4 sm:py-2 whitespace-nowrap">
              Templates
            </router-link>
            <a href="#choose" @click.prevent="scrollTo('choose')"
               class="btn-primary text-sm px-3 py-1.5 sm:text-base sm:px-4 sm:py-2 whitespace-nowrap">
              Get Started
            </a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section relative overflow-hidden">
      <div class="hero-bg" aria-hidden="true">
        <div class="hero-grid"></div>
        <div class="hero-bloom hero-bloom-1"></div>
        <div class="hero-bloom hero-bloom-2"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center py-16 lg:py-24">
          <!-- Copy -->
          <div class="hero-copy text-center lg:text-left">
            <a :href="githubUrl" target="_blank" rel="noopener"
               class="hero-badge inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-700 dark:text-slate-300 shadow-sm hover:border-primary-300 transition-colors">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Free &amp; open source, no sign-up
            </a>

            <h1 class="hero-title text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Build a standout résumé or
              <span class="hero-accent">marriage biodata</span>
              in minutes.
            </h1>

            <p class="hero-sub text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0">
              Pick a template, edit everything with a live preview, and export a print-ready
              PDF, PNG or JPG. No watermark, no paywall, and your data never leaves your browser.
            </p>

            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <a href="#choose" @click.prevent="scrollTo('choose')"
                 class="btn-primary text-lg px-8 py-3 shadow-lg shadow-primary-600/20">
                Start building, free
              </a>
              <router-link to="/templates" class="btn-outline text-lg px-8 py-3">
                Browse templates
              </router-link>
            </div>

            <ul class="hero-trust mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li class="inline-flex items-center gap-1.5"><span class="hero-check">✓</span> No sign-up</li>
              <li class="inline-flex items-center gap-1.5"><span class="hero-check">✓</span> PDF, PNG &amp; JPG export</li>
              <li class="inline-flex items-center gap-1.5"><span class="hero-check">✓</span> MIT licensed</li>
            </ul>
          </div>

          <!-- Live document preview -->
          <div class="hero-visual" aria-hidden="true">
            <div class="hero-card-tilt">
              <div class="hero-card">
                <TemplateThumbnail :component="componentFor('sidebar')" />
              </div>
              <span class="hero-chip hero-chip-1"><span class="dot bg-blue-500"></span> Live preview</span>
              <span class="hero-chip hero-chip-2"><span class="dot bg-green-500"></span> ATS-friendly</span>
              <span class="hero-chip hero-chip-3"><span class="dot bg-amber-500"></span> Export ready</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Document Type Launcher -->
    <section id="choose" class="py-16 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="reveal text-center mb-12">
          <h2 class="section-title text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">What do you want to build?</h2>
          <p class="text-lg text-gray-600 dark:text-slate-400">
            One builder for résumés, marriage biodata, academic CVs, and cover letters.
          </p>
        </div>

        <div class="reveal-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <component :is="doc.available ? 'router-link' : 'div'"
                     v-for="doc in documentCatalog"
                     :key="doc.type"
                     :to="doc.available ? doc.route : undefined"
                     @click="selectDoc(doc)"
                     :class="['reveal relative rounded-xl shadow-sm border overflow-hidden',
                              doc.available
                                ? 'border-gray-200 dark:border-slate-700 hover:shadow-lg cursor-pointer hover-lift'
                                : 'border-gray-200 dark:border-slate-700 opacity-70 cursor-not-allowed']">
            <div class="h-32 bg-gradient-to-br flex items-center justify-center" :class="doc.gradient">
              <component :is="doc.icon" class="w-14 h-14 text-white/90" />
            </div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-slate-100">{{ doc.name }}</h3>
                <span v-if="!doc.available"
                      class="text-xs font-medium text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                  Coming soon
                </span>
              </div>
              <p class="text-gray-600 dark:text-slate-400">{{ doc.description }}</p>
            </div>
          </component>
        </div>
      </div>
    </section>

    <!-- Privacy & Open Source -->
    <section class="privacy-section relative overflow-hidden py-20 border-t border-gray-100 dark:border-slate-800">
      <div class="privacy-bg" aria-hidden="true"></div>
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <!-- Statement -->
          <div class="reveal">
            <span class="privacy-eyebrow inline-flex items-center gap-2">
              <ShieldCheckIcon class="w-4 h-4" /> Private by design
            </span>
            <h2 class="section-title text-3xl sm:text-4xl font-bold text-gray-900 dark:text-slate-100 mt-4 mb-5">
              Your data never leaves your device.
            </h2>
            <p class="text-lg text-gray-600 dark:text-slate-400 mb-6">
              There is no account, no server, and no database. Everything you type stays in
              your own browser and every export is generated right on your machine. We could
              not read your résumé if we tried, because there is nowhere for it to be sent.
            </p>
            <div class="flex flex-wrap items-center gap-3">
              <a :href="githubUrl" target="_blank" rel="noopener"
                 class="inline-flex items-center gap-2 btn-outline text-sm px-4 py-2">
                <CodeBracketIcon class="w-4 h-4" /> Read the source
              </a>
              <span class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2">
                <span class="text-green-600 dark:text-green-400">✓</span> MIT licensed, free forever
              </span>
            </div>
          </div>

          <!-- Guarantees -->
          <div class="reveal-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="point in privacyPoints" :key="point.title"
                 class="privacy-card reveal">
              <div class="privacy-icon">
                <component :is="point.icon" class="w-5 h-5" />
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-slate-100 mb-1">{{ point.title }}</h3>
              <p class="text-sm text-gray-600 dark:text-slate-400">{{ point.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white dark:bg-slate-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="reveal text-center mb-16">
          <h2 class="section-title text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">
            Everything you need to stand out
          </h2>
          <p class="text-lg text-gray-600 dark:text-slate-400">
            Live editing, ATS-friendly output, and one-click export. Free and open source.
          </p>
        </div>

        <div class="reveal-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.id"
               :class="['reveal card text-center hover:shadow-lg', feature.comingSoon ? 'opacity-75' : 'hover-lift']">
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <component :is="feature.icon" class="w-6 h-6 text-primary-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
              {{ feature.title }}
              <span v-if="feature.comingSoon"
                    class="ml-2 align-middle text-xs font-medium text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                Coming soon
              </span>
            </h3>
            <p class="text-gray-600 dark:text-slate-400">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Templates Preview -->
    <section class="py-20 bg-gray-50 dark:bg-slate-800/60">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="reveal text-center mb-16">
          <h2 class="section-title text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">
            One set of details, every template
          </h2>
          <p class="text-lg text-gray-600 dark:text-slate-400">
            Your content flows into any design. Switch whenever you like, nothing is lost.
          </p>
        </div>

        <div class="reveal-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="template in templates" :key="template.id"
               @click="useTemplate(template.id)"
               class="reveal hover-lift bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md overflow-hidden cursor-pointer group">
            <div class="border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/60">
              <TemplateThumbnail :component="componentFor(template.id)" />
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-gray-900 dark:text-slate-100 mb-1 group-hover:text-primary-600 transition-colors">{{ template.name }}</h3>
              <p class="text-sm text-gray-600 dark:text-slate-400">{{ template.description }}</p>
            </div>
          </div>
        </div>
        
        <div class="reveal text-center mt-12">
          <router-link to="/templates" class="btn-primary">
            View all templates
          </router-link>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section relative overflow-hidden py-20 bg-primary-600">
      <div class="cta-glow" aria-hidden="true"></div>
      <div class="reveal max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
        <h2 class="section-title text-3xl font-bold text-white mb-4">
          Ready to build yours?
        </h2>
        <p class="text-xl text-primary-100 mb-8">
          Free and open source, no sign-up, no paywall. Just build, customize, and export.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/editor" class="bg-white text-primary-600 hover:bg-gray-50 dark:bg-slate-800/60 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
            Start Building for Free
          </router-link>
          <a :href="githubUrl" target="_blank" rel="noopener"
             class="inline-flex items-center justify-center gap-2 border border-white/70 text-white hover:bg-white/10 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
            <span class="text-yellow-300">★</span> Give us a Star on GitHub
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <SiteFooter />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { PaintBrushIcon, DocumentTextIcon, CloudArrowDownIcon, ShareIcon, EyeIcon, PrinterIcon, HeartIcon, AcademicCapIcon, EnvelopeIcon, ShieldCheckIcon, ServerStackIcon, EyeSlashIcon, CodeBracketIcon, UserCircleIcon } from '@heroicons/vue/24/outline'
import { documentCatalog } from '../documents/registry'
import { useResumeStore } from '../stores/resume'
import AppLogo from '../components/AppLogo.vue'
import TemplateThumbnail from '../components/TemplateThumbnail.vue'
import SiteFooter from '../components/SiteFooter.vue'

// Live preview components for the featured templates on the landing page.
const homeTemplateComponents = {
  ats: defineAsyncComponent(() => import('../components/templates/AtsResumeTemplate.vue')),
  sidebar: defineAsyncComponent(() => import('../components/templates/SidebarResumeTemplate.vue')),
  colorful: defineAsyncComponent(() => import('../components/templates/ColorfulResumeTemplate.vue')),
  corporate: defineAsyncComponent(() => import('../components/templates/CorporateCvTemplate.vue'))
}

export default {
  name: 'Home',
  components: {
    AppLogo,
    TemplateThumbnail,
    SiteFooter,
    PaintBrushIcon,
    DocumentTextIcon,
    CloudArrowDownIcon,
    ShareIcon,
    EyeIcon,
    PrinterIcon,
    HeartIcon,
    AcademicCapIcon,
    EnvelopeIcon,
    ShieldCheckIcon,
    ServerStackIcon,
    EyeSlashIcon,
    CodeBracketIcon,
    UserCircleIcon
  },
  setup() {
    return { resumeStore: useResumeStore() }
  },
  data() {
    return {
      githubUrl: 'https://github.com/mrahmanashiq/mra-resume-builder',
      authorName: 'Mizanur Rahman Ashiq',
      authorUrl: 'https://mrahmanashiq.vercel.app',
      documentCatalog,
      privacyPoints: [
        {
          title: 'No servers',
          description: 'The app has no backend. Nothing you enter is ever uploaded anywhere.',
          icon: 'ServerStackIcon'
        },
        {
          title: 'No sign-up',
          description: 'Start building instantly. We never ask who you are or for an email.',
          icon: 'UserCircleIcon'
        },
        {
          title: 'No tracking',
          description: 'No analytics, no ads, and no third-party cookies following you around.',
          icon: 'EyeSlashIcon'
        },
        {
          title: 'Open and auditable',
          description: 'Every line is public on GitHub, so you can verify these claims yourself.',
          icon: 'CodeBracketIcon'
        }
      ],
      features: [
        {
          id: 1,
          title: 'Professional Templates',
          description: 'Choose from beautifully designed templates that showcase your skills and experience.',
          icon: 'PaintBrushIcon'
        },
        {
          id: 2,
          title: 'ATS-Friendly',
          description: 'All templates are optimized to pass through Applicant Tracking Systems.',
          icon: 'DocumentTextIcon'
        },
        {
          id: 3,
          title: 'Export Options',
          description: 'Download your resume as PDF, print directly, or share with a custom link.',
          icon: 'CloudArrowDownIcon'
        },
        {
          id: 4,
          title: 'Real-time Preview',
          description: 'See your changes instantly as you build your resume with live preview.',
          icon: 'EyeIcon'
        },
        {
          id: 5,
          title: 'Easy Sharing',
          description: 'Share your resume with a private link. No account needed, and your data stays in your browser.',
          icon: 'ShareIcon'
        },
        {
          id: 6,
          title: 'Print Ready',
          description: 'Perfectly formatted for printing with proper page breaks and margins.',
          icon: 'PrinterIcon'
        }
      ],
      templates: [
        { id: 'ats', name: 'Clean ATS', description: 'Single-column, ATS-friendly' },
        { id: 'sidebar', name: 'Sidebar', description: 'Two-column with side panel' },
        { id: 'colorful', name: 'Colorful', description: 'Accent header, chips and bars' },
        { id: 'corporate', name: 'Corporate CV', description: 'Multi-page CV with tables' }
      ]
    }
  },
  mounted() {
    this.setupReveal()
  },
  beforeUnmount() {
    if (this.revealObserver) this.revealObserver.disconnect()
  },
  methods: {
    componentFor(id) {
      return homeTemplateComponents[id]
    },
    useTemplate(id) {
      this.resumeStore.updateSettings({ template: id })
      this.$router.push('/editor')
    },
    selectDoc(doc) {
      // Cards that name a template preselect it so the editor opens on that layout.
      if (doc && doc.available && doc.template) {
        this.resumeStore.updateSettings({ template: doc.template })
      }
    },
    setupReveal() {
      const els = this.$el.querySelectorAll('.reveal')
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce || typeof IntersectionObserver === 'undefined') {
        els.forEach(el => el.classList.add('is-visible'))
        return
      }
      this.revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            obs.unobserve(entry.target)
          }
        })
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
      els.forEach(el => this.revealObserver.observe(el))
    },
    scrollTo(id) {
      const el = document.getElementById(id)
      if (!el) return
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const y = el.getBoundingClientRect().top + window.scrollY - 72
      window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' })
    }
  }
}
</script>

<style scoped src="./Home.css"></style>