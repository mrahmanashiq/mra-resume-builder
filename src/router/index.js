import { createRouter, createWebHistory } from 'vue-router'
import { LANDING_PAGES } from '../seo/landing'

// Lazy load views for better code splitting
const Home = () => import('../views/Home.vue')
const Editor = () => import('../views/Editor.vue')
const Templates = () => import('../views/Templates.vue')
const Settings = () => import('../views/Settings.vue')
const BiodataEditor = () => import('../views/BiodataEditor.vue')
const BiodataTemplates = () => import('../views/BiodataTemplates.vue')
const CoverLetterEditor = () => import('../views/CoverLetterEditor.vue')
const ShareViewer = () => import('../views/ShareViewer.vue')
const Privacy = () => import('../views/Privacy.vue')
const Terms = () => import('../views/Terms.vue')
const Support = () => import('../views/Support.vue')
const LandingPage = () => import('../views/landing/LandingPage.vue')
const NotFound = () => import('../views/NotFound.vue')

// SEO keyword landing pages, generated from the landing config.
const landingRoutes = Object.values(LANDING_PAGES).map((p) => ({
  path: `/${p.slug}`,
  name: `landing-${p.slug}`,
  component: LandingPage,
  meta: { seo: p.seo, landing: p.slug }
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        seo: {
          title: 'Free Resume & Marriage Biodata Maker - Resume Builder',
          description:
            'Build an ATS-friendly resume or a marriage biodata for free. Pick a template, edit with a live preview, and download a print-ready PDF. No sign-up, open source, and your data never leaves your browser.'
        }
      }
    },
    {
      path: '/editor',
      name: 'editor',
      component: Editor,
      meta: {
        seo: {
          title: 'Free Resume Builder - Create an ATS Resume Online - Resume Builder',
          description:
            'Create a professional, ATS-friendly resume online for free. Live preview, customizable templates, and instant PDF, Word, PNG and JPG export. No sign-up.'
        }
      }
    },
    {
      path: '/templates',
      name: 'templates',
      component: Templates,
      meta: {
        seo: {
          title: 'Free Resume Templates (ATS-Friendly) - Resume Builder',
          description:
            'Browse free, ATS-friendly resume and CV templates. Customize colors, fonts, and sections, then download as PDF, PNG, or Word. No sign-up.'
        }
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      meta: { seo: { title: 'Settings - Resume Builder', noindex: true } }
    },
    {
      path: '/biodata',
      name: 'biodata',
      component: BiodataEditor,
      meta: {
        seo: {
          title: 'Marriage Biodata Maker - Create a Biodata for Marriage - Resume Builder',
          description:
            'Create a formal marriage biodata for free. Add personal, family, education, and contact details, choose a template, and download a print-ready PDF. No sign-up.'
        }
      }
    },
    {
      path: '/biodata/templates',
      name: 'biodata-templates',
      component: BiodataTemplates,
      meta: {
        seo: {
          title: 'Marriage Biodata Templates & Formats - Resume Builder',
          description:
            'Free marriage biodata templates and formats. Pick a design, fill in your details, and download a print-ready biodata PDF.'
        }
      }
    },
    {
      path: '/cover-letter',
      name: 'cover-letter',
      component: CoverLetterEditor,
      meta: {
        seo: {
          title: 'Free Cover Letter Builder - Resume Builder',
          description:
            'Write a professional cover letter for free. Auto-fill your details from your resume, edit with a live preview, and download a print-ready PDF. No sign-up.'
        }
      }
    },
    {
      path: '/view',
      name: 'view',
      component: ShareViewer,
      meta: { seo: { title: 'Shared document - Resume Builder', noindex: true } }
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: Privacy,
      meta: {
        seo: {
          title: 'Privacy and your data - Resume Builder',
          description:
            'How Resume Builder handles your data: no account, no server, and everything stays in your browser. Learn where your data lives and how to keep a backup.'
        }
      }
    },
    {
      path: '/terms',
      name: 'terms',
      component: Terms,
      meta: {
        seo: {
          title: 'Terms of use - Resume Builder',
          description:
            'Resume Builder terms of use: a free, open source tool provided as is. You own everything you create, and your data stays in your browser.'
        }
      }
    },
    {
      path: '/support',
      name: 'support',
      component: Support,
      meta: {
        seo: {
          title: 'Support this project - Resume Builder',
          description:
            'Resume Builder is free and open source. If it helped you, support its development with an optional donation via Binance Pay.'
        }
      }
    },
    ...landingRoutes,
    {
      // Catch-all: any unknown path renders the 404 page instead of a blank screen.
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
      meta: { seo: { title: 'Page not found - Resume Builder', noindex: true } }
    }
  ]
})

// Recover gracefully when a lazily-imported route chunk is stale - e.g. a tab
// was open across a new deploy, so the old index.html points at chunk hashes
// that no longer exist. Without this, clicking such a route silently does
// nothing. Hard-load the target so the browser fetches the fresh build.
router.onError((error, to) => {
  const msg = (error && error.message) || ''
  const staleChunk = /dynamically imported module|module script failed|Failed to fetch|Importing a module/i.test(msg)
  if (staleChunk && to && to.fullPath) {
    window.location.assign(to.fullPath)
  }
})

export default router
