import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import router from './router'
import './assets/main.css'
import 'vue-toastification/dist/index.css'
import App from './App.vue'
import BaseSelect from './components/BaseSelect.vue'
import BaseDatePicker from './components/BaseDatePicker.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { createPersistedState } from './stores/persist'
import { useTheme } from './composables/useTheme'

useTheme().initTheme()

const app = createApp(App)
const pinia = createPinia()
pinia.use(createPersistedState({ stores: ['resume', 'biodata'] }))

app.component('BaseSelect', BaseSelect)
app.component('BaseDatePicker', BaseDatePicker)
app.component('ThemeToggle', ThemeToggle)

app.use(pinia)
app.use(router)
app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true
})

app.mount('#app')
