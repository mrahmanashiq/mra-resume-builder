/**
 * Lightweight, lenient field validators for inline hints.
 *
 * These never block input (every field stays optional and free-form); they only
 * decide whether to show a gentle "this does not look right" hint. Empty values
 * are always considered fine.
 */

export function isBlank(value) {
  return value == null || String(value).trim() === ''
}

export function isValidEmail(value) {
  if (isBlank(value)) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())
}

export function isPlausiblePhone(value) {
  if (isBlank(value)) return true
  const digits = String(value).replace(/\D/g, '')
  return digits.length >= 7
}

/** Accepts links with or without a protocol (e.g. "linkedin.com/in/jane"). */
export function isPlausibleUrl(value) {
  if (isBlank(value)) return true
  const s = String(value).trim().replace(/^https?:\/\//i, '')
  return !/\s/.test(s) && /^[^.\s]+\.[^\s]{2,}/.test(s)
}

/** Returns a hint string when the value looks wrong, or '' when it is fine. */
export function emailHint(value) {
  return isValidEmail(value) ? '' : 'That does not look like a valid email address.'
}

export function phoneHint(value) {
  return isPlausiblePhone(value) ? '' : 'A phone number usually has at least 7 digits.'
}

export function urlHint(value, example) {
  if (isPlausibleUrl(value)) return ''
  return example ? `That does not look like a valid link. Example: ${example}` : 'That does not look like a valid link.'
}
