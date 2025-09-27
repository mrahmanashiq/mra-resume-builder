import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Editor from '../views/Editor.vue'
import Templates from '../views/Templates.vue'
import Settings from '../views/Settings.vue'

const router = createRouter({
  history: createWebHistory('/mra-resume-builder/'),
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