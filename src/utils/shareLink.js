import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'

/**
 * No-backend shareable links. A document is compressed into the URL fragment
 * (#...), which the browser never sends to a server - so sharing stays
 * consistent with the app's privacy model.
 *
 * To keep links as short as possible without a backend we:
 *  - strip photos (large base64),
 *  - drop `id` fields (random UUIDs barely compress and add real weight),
 *  - drop empty-string fields.
 * Every top-level slice and every array is kept, so the read-only viewer (which
 * starts from the store's sample defaults) overrides all of them correctly. Ids
 * are regenerated on decode so list rendering stays stable.
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

/** Remove `id` keys and empty strings from nested structures (URL slimming). */
function shrink(value) {
  if (Array.isArray(value)) return value.map((v) => shrink(v))
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) {
      if (k === 'id') continue
      const sv = shrink(v)
      if (sv === '' || sv == null) continue
      out[k] = sv
    }
    return out
  }
  return value
}

function genId() {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  } catch {
    /* fall through */
  }
  return 'id-' + Math.random().toString(36).slice(2, 10)
}

/** Re-add an `id` to every object inside an array so list keys stay stable. */
function rehydrateIds(value) {
  if (Array.isArray(value)) {
    return value.map((v) => {
      const rv = rehydrateIds(v)
      if (rv && typeof rv === 'object' && !Array.isArray(rv) && !('id' in rv)) rv.id = genId()
      return rv
    })
  }
  if (value && typeof value === 'object') {
    for (const k of Object.keys(value)) value[k] = rehydrateIds(value[k])
  }
  return value
}

/** Encode a document into a URL-safe compressed fragment. */
export function encodeShare(type, data) {
  const payload = { v: 1, type, data: shrink(stripPhotos(data)) }
  return compressToEncodedURIComponent(JSON.stringify(payload))
}

/** Decode a fragment back into { type, data }, or null if invalid. */
export function decodeShare(hash) {
  try {
    const raw = decompressFromEncodedURIComponent(hash || '')
    if (!raw) return null
    const payload = JSON.parse(raw)
    if (!payload || typeof payload !== 'object' || !payload.type || !payload.data) return null
    return { type: payload.type, data: rehydrateIds(payload.data) }
  } catch {
    return null
  }
}

/** Full shareable URL for the current origin. */
export function buildShareUrl(type, data) {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}/view#${encodeShare(type, data)}`
}
