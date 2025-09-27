import { createRouter, createWebHistory } from 'vue-router'

// Lazy load views for better code splitting
const Home = () => import('../views/Home.vue')
const Editor = () => import('../views/Editor.vue')
const Templates = () => import('../views/Templates.vue')
const Settings = () => import('../views/Settings.vue')

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
    }
  ]
})

export default router