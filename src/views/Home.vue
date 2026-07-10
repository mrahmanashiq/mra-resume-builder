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

<style scoped>
/* Display face for landing headings, used with restraint */
.hero-title,
.section-title {
  font-family: 'Sora', 'Inter', system-ui, -apple-system, sans-serif;
  letter-spacing: -0.02em;
}
.hero-title { line-height: 1.08; }

.hero-accent {
  background: linear-gradient(90deg, #2563eb 0%, #6366f1 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ---------- Hero background: soft blooms + faint dot grid ---------- */
.hero-section {
  background: linear-gradient(180deg, #f6f8fc 0%, #ffffff 62%);
}
:global(html.dark) .hero-section {
  background: linear-gradient(180deg, #0f172a 0%, #0b1220 62%);
}
.hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at center, rgba(37, 99, 235, 0.10) 1px, transparent 1.4px);
  background-size: 26px 26px;
  -webkit-mask-image: radial-gradient(ellipse 78% 62% at 52% 26%, #000 42%, transparent 100%);
  mask-image: radial-gradient(ellipse 78% 62% at 52% 26%, #000 42%, transparent 100%);
  opacity: 0.55;
}
.hero-bloom {
  position: absolute;
  border-radius: 9999px;
  filter: blur(72px);
}
.hero-bloom-1 {
  width: 460px;
  height: 460px;
  top: -140px;
  right: -90px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.34), transparent 70%);
}
.hero-bloom-2 {
  width: 400px;
  height: 400px;
  bottom: -160px;
  left: -110px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.26), transparent 70%);
}

/* ---------- Hero trust row ---------- */
.hero-check {
  color: #16a34a;
  font-weight: 700;
}

/* ---------- Hero live-preview card ---------- */
.hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
  animation: heroRise 0.9s 0.3s both cubic-bezier(0.22, 1, 0.36, 1);
}
.hero-card-tilt {
  position: relative;
  width: 100%;
  max-width: 320px;
  transform: rotate(-3deg);
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.hero-visual:hover .hero-card-tilt {
  transform: rotate(0deg);
}
.hero-card {
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 30px 60px -18px rgba(15, 23, 42, 0.38), 0 0 0 1px rgba(15, 23, 42, 0.05);
}
.hero-chip {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  border-radius: 9999px;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 12px 26px -10px rgba(15, 23, 42, 0.28);
  font-size: 0.78rem;
  font-weight: 600;
  color: #0f172a;
  white-space: nowrap;
}
.hero-chip .dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
}
.hero-chip-1 { top: 6%; left: -8%; }
.hero-chip-2 { top: 44%; right: -10%; }
.hero-chip-3 { bottom: 8%; left: -4%; }

/* ---------- Hero copy load-in sequence ---------- */
.hero-copy .hero-badge { animation: heroRise 0.6s 0.05s both cubic-bezier(0.22, 1, 0.36, 1); }
.hero-copy .hero-title { animation: heroRise 0.7s 0.12s both cubic-bezier(0.22, 1, 0.36, 1); }
.hero-copy .hero-sub { animation: heroRise 0.7s 0.20s both cubic-bezier(0.22, 1, 0.36, 1); }
.hero-copy > div { animation: heroRise 0.7s 0.28s both cubic-bezier(0.22, 1, 0.36, 1); }
.hero-copy .hero-trust { animation: heroRise 0.7s 0.36s both cubic-bezier(0.22, 1, 0.36, 1); }

@keyframes heroRise {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ---------- Scroll reveal ---------- */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.6s ease, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease;
  will-change: opacity, transform;
}
.reveal.is-visible {
  opacity: 1;
  transform: none;
}
/* staggered entry within card grids */
.reveal-grid > .reveal:nth-child(1) { transition-delay: 0.04s; }
.reveal-grid > .reveal:nth-child(2) { transition-delay: 0.12s; }
.reveal-grid > .reveal:nth-child(3) { transition-delay: 0.20s; }
.reveal-grid > .reveal:nth-child(4) { transition-delay: 0.28s; }
.reveal-grid > .reveal:nth-child(5) { transition-delay: 0.36s; }
.reveal-grid > .reveal:nth-child(6) { transition-delay: 0.44s; }

/* ---------- Hover lift ---------- */
.hover-lift {
  transition: opacity 0.6s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease;
}
.hover-lift:hover {
  transform: translateY(-6px);
}
.reveal-grid > .hover-lift:hover {
  transition-delay: 0s;
}

/* ---------- CTA glow ---------- */
.cta-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 60% 120% at 50% -10%, rgba(255, 255, 255, 0.18), transparent 70%);
  pointer-events: none;
}

/* ---------- Privacy & open source ---------- */
/* Base (light). Dark-mode overrides live in main.css as global html.dark rules,
   matching the hero-section precedent (scoped :global(html.dark) does not win here). */
.privacy-section {
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}
/* Faint shield-tinted bloom, echoing the hero blooms but calmer */
.privacy-bg {
  position: absolute;
  top: -120px;
  right: -80px;
  width: 420px;
  height: 420px;
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.14), transparent 70%);
  filter: blur(60px);
  pointer-events: none;
}

.privacy-eyebrow {
  font-family: 'Sora', 'Inter', system-ui, sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #059669;
}

.privacy-card {
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 14px;
  padding: 1.25rem;
  box-shadow: 0 12px 30px -22px rgba(15, 23, 42, 0.35);
  transition: opacity 0.6s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease;
}
.privacy-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 40px -20px rgba(15, 23, 42, 0.4);
}
.privacy-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 10px;
  margin-bottom: 0.85rem;
  color: #059669;
  background: rgba(16, 185, 129, 0.12);
}

/* Chips are decorative; drop them on small screens to keep the card clean */
@media (max-width: 640px) {
  .hero-chip { display: none; }
  .hero-card-tilt { max-width: 300px; transform: rotate(0deg); }
}

/* ---------- Respect reduced motion ---------- */
@media (prefers-reduced-motion: reduce) {
  .home .reveal {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  .home .hero-copy .hero-badge,
  .home .hero-copy .hero-title,
  .home .hero-copy .hero-sub,
  .home .hero-copy > div,
  .home .hero-copy .hero-trust,
  .home .hero-visual {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  .home .hero-card-tilt { transform: rotate(-3deg) !important; }
  .home .hover-lift:hover { transform: none !important; }
  .home .animate-ping { animation: none !important; }
}
</style>