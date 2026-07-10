import { ref, computed } from 'vue'

const STORAGE_KEY = 'mra-theme'

function readInitial() {
  try {
    // Default to light. Only honor an explicit saved 'dark' choice
    // (no system/OS following - light is the intended first-visit experience).
    return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

// Module-level singleton so every component shares one theme state.
const theme = ref(readInitial()) // 'light' | 'dark'

const isDark = computed(() => theme.value === 'dark')

function apply() {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', isDark.value)
}

function setTheme(value) {
  theme.value = value === 'dark' ? 'dark' : 'light'
  try {
    localStorage.setItem(STORAGE_KEY, theme.value)
  } catch {
    /* storage unavailable - ignore */
  }
  apply()
}

function toggleTheme() {
  setTheme(isDark.value ? 'light' : 'dark')
}

function initTheme() {
  apply()
}

export function useTheme() {
  return { theme, isDark, setTheme, toggleTheme, initTheme }
}
