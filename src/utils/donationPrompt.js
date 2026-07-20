/**
 * Controls how often the "Support this project" modal appears before a download.
 *
 * The download flow calls shouldShowDonationPrompt() to decide whether to show
 * the modal first, and markDonationPromptShown() once it has been shown. To
 * change the cadence, edit POLICY below - no other file needs to change.
 *
 *   'every'    - before every successful download (current)
 *   'session'  - once per browser session (sessionStorage)
 *   'cooldown' - not again for COOLDOWN_DAYS (localStorage)
 *   'once'     - a single time per browser, ever (localStorage)
 */
export const POLICY = 'every'

const COOLDOWN_DAYS = 7
const STORAGE_KEY = 'mra-donation-prompt'

export function shouldShowDonationPrompt() {
  if (POLICY === 'every') return true
  try {
    if (POLICY === 'session') return !sessionStorage.getItem(STORAGE_KEY)
    if (POLICY === 'once') return !localStorage.getItem(STORAGE_KEY)
    if (POLICY === 'cooldown') {
      const last = parseInt(localStorage.getItem(STORAGE_KEY), 10)
      if (Number.isNaN(last)) return true
      return Date.now() - last > COOLDOWN_DAYS * 24 * 60 * 60 * 1000
    }
  } catch (e) {
    // Storage unavailable (private mode / disabled) - fail open and show it.
    return true
  }
  return true
}

export function markDonationPromptShown() {
  if (POLICY === 'every') return
  try {
    if (POLICY === 'session') sessionStorage.setItem(STORAGE_KEY, '1')
    else localStorage.setItem(STORAGE_KEY, String(Date.now()))
  } catch (e) {
    // Storage unavailable - ignore; it just means we may show it again.
  }
}
