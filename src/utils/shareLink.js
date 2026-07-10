import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'

/**
 * No-backend shareable links. A document is compressed into the URL fragment
 * (#...), which the browser never sends to a server - so sharing stays
 * consistent with the app's privacy model. Photos are stripped to keep URLs
 * a reasonable length.
 */
const PHOTO_KEYS = ['photo', 'image', 'profilePhoto', 'avatar']

/** Deep-clone `data` with any base64 image values removed. */
export function stripPhotos(data) {
  if (!data || typeof data !== 'object') return data
  const clone = JSON.parse(JSON.stringify(data))
  const walk = (obj) => {
    if (!obj || typeof obj !== 'object') return
    for (const key of Object.keys(obj)) {
      const val = obj[key]
      if (typeof val === 'string' && (PHOTO_KEYS.includes(key) || val.startsWith('data:image/'))) {
        obj[key] = ''
      } else if (val && typeof val === 'object') {
        walk(val)
      }
    }
  }
  walk(clone)
  return clone
}

/** Encode a document into a URL-safe compressed fragment. */
export function encodeShare(type, data) {
  const payload = { v: 1, type, data: stripPhotos(data) }
  return compressToEncodedURIComponent(JSON.stringify(payload))
}

/** Decode a fragment back into { type, data }, or null if invalid. */
export function decodeShare(hash) {
  try {
    const raw = decompressFromEncodedURIComponent(hash || '')
    if (!raw) return null
    const payload = JSON.parse(raw)
    if (!payload || typeof payload !== 'object' || !payload.type || !payload.data) return null
    return { type: payload.type, data: payload.data }
  } catch {
    return null
  }
}

/** Full shareable URL for the current origin. */
export function buildShareUrl(type, data) {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}/view#${encodeShare(type, data)}`
}
