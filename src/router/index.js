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
const LandingPage = () => import('../views/landing/LandingPage.vue')

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
          title: 'Free Resume & Marriage Biodata Maker - MRA Builder',
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
          title: 'Free Resume Builder - Create an ATS Resume Online - MRA Builder',
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
          title: 'Free Resume Templates (ATS-Friendly) - MRA Builder',
          description:
            'Browse free, ATS-friendly resume and CV templates. Customize colors, fonts, and sections, then download as PDF, PNG, or Word. No sign-up.'
        }
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      meta: { seo: { title: 'Settings - MRA Builder', noindex: true } }
    },
    {
      path: '/biodata',
      name: 'biodata',
      component: BiodataEditor,
      meta: {
        seo: {
          title: 'Marriage Biodata Maker - Create a Biodata for Marriage - MRA Builder',
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
          title: 'Marriage Biodata Templates & Formats - MRA Builder',
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
          title: 'Free Cover Letter Builder - MRA Builder',
          description:
            'Write a professional cover letter for free. Auto-fill your details from your resume, edit with a live preview, and download a print-ready PDF. No sign-up.'
        }
      }
    },
    ...landingRoutes
  ]
})

export default router
