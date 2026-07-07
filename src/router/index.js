import { createRouter, createWebHistory } from 'vue-router'

// Lazy load views for better code splitting
const Home = () => import('../views/Home.vue')
const Editor = () => import('../views/Editor.vue')
const Templates = () => import('../views/Templates.vue')
const Settings = () => import('../views/Settings.vue')
const BiodataEditor = () => import('../views/BiodataEditor.vue')
const BiodataTemplates = () => import('../views/BiodataTemplates.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/editor',
      name: 'editor',
      component: Editor
    },
    {
      path: '/templates',
      name: 'templates',
      component: Templates
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    },
    {
      path: '/biodata',
      name: 'biodata',
      component: BiodataEditor
    },
    {
      path: '/biodata/templates',
      name: 'biodata-templates',
      component: BiodataTemplates
    }
  ]
})

export default router
