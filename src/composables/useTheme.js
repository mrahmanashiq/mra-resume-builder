import { ref, computed } from 'vue'

const STORAGE_KEY = 'mra-theme'

function readInitial() {
  try {
    return localStorage.getItem(STORAGE_KEY) || 'system'
  } catch {
    return 'system'
  }
}

function getSystemDark() {
  return typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Module-level singletons so every component shares one theme state.
const theme = ref(readInitial()) // 'light' | 'dark' | 'system'
const systemDark = ref(getSystemDark())
let initialized = false

const isDark = computed(() => theme.value === 'dark' || (theme.value === 'system' && systemDark.value))

function apply() {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', isDark.value)
}

function setTheme(value) {
  theme.value = value
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    /* storage unavailable - ignore */
  }
  apply()
}

function toggleTheme() {
  // Flip from the current effective appearance to the opposite explicit choice.
  setTheme(isDark.value ? 'light' : 'dark')
}

function initTheme() {
  apply()
  if (initialized || typeof window === 'undefined' || !window.matchMedia) return
  initialized = true
  const mql = window.matchMedia('(prefers-color-scheme: dark)')
  const onChange = (e) => {
    systemDark.value = e.matches
    if (theme.value === 'system') apply()
  }
  if (mql.addEventListener) mql.addEventListener('change', onChange)
  else if (mql.addListener) mql.addListener(onChange)
}

export function useTheme() {
  return { theme, isDark, setTheme, toggleTheme, initTheme }
}
