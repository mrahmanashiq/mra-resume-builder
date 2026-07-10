import { reactive } from 'vue'
import { v4 as uuidv4 } from 'uuid'

/**
 * Multi-document store manager (client-side only).
 *
 * Each document type (resume, biodata) can have several named documents. Storage:
 *   mra-docs-v1            -> index: [{ id, type, name, createdAt, updatedAt }]
 *   mra-doc-<id>-v1        -> that document's serialized store data (store.exportData())
 *   mra-active-<type>-v1   -> id of the active document for a type
 *
 * On first run it migrates the old single-document keys (mra-<type>-v1) into a
 * document, so existing users keep their data with no action.
 */
const VERSION = 'v1'
const INDEX_KEY = `mra-docs-${VERSION}`
const docKey = (id) => `mra-doc-${id}-${VERSION}`
const activeKey = (type) => `mra-active-${type}-${VERSION}`
const legacyKey = (type) => `mra-${type}-${VERSION}`

const TYPES = ['resume', 'biodata', 'coverLetter']
const DEFAULT_NAMES = { resume: 'My Resume', biodata: 'My Biodata', coverLetter: 'My Cover Letter' }

const state = reactive({ docs: [], activeIds: {} })
let initialized = false

function safeGet(k) { try { return localStorage.getItem(k) } catch { return null } }
function safeSet(k, v) { try { localStorage.setItem(k, v) } catch { /* quota/unavailable */ } }
function safeRemove(k) { try { localStorage.removeItem(k) } catch { /* ignore */ } }

function nowIso() {
  try { return new Date().toISOString() } catch { return '' }
}

function persistIndex() {
  safeSet(INDEX_KEY, JSON.stringify(state.docs))
}

function readIndex() {
  const raw = safeGet(INDEX_KEY)
  if (!raw) return []
  try {
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function docsOfType(type) {
  return state.docs
    .filter((d) => d.type === type)
    .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
}

function migrateLegacy(type) {
  const legacy = safeGet(legacyKey(type))
  if (!legacy) return
  const id = uuidv4()
  const now = nowIso()
  state.docs.push({ id, type, name: DEFAULT_NAMES[type] || 'Untitled', createdAt: now, updatedAt: now })
  safeSet(docKey(id), legacy)
  state.activeIds[type] = id
  safeSet(activeKey(type), id)
  persistIndex()
  safeRemove(legacyKey(type))
}

function ensureDefault(type) {
  const existing = docsOfType(type)
  if (existing.length === 0) {
    const id = uuidv4()
    const now = nowIso()
    state.docs.push({ id, type, name: DEFAULT_NAMES[type] || 'Untitled', createdAt: now, updatedAt: now })
    persistIndex()
    state.activeIds[type] = id
    safeSet(activeKey(type), id)
  } else if (!state.activeIds[type] || !existing.some((d) => d.id === state.activeIds[type])) {
    state.activeIds[type] = existing[0].id
    safeSet(activeKey(type), existing[0].id)
  }
}

export const docManager = {
  state,
  docsOfType,

  init() {
    if (initialized) return
    initialized = true
    state.docs = readIndex()
    for (const type of TYPES) {
      const a = safeGet(activeKey(type))
      if (a) state.activeIds[type] = a
    }
    for (const type of TYPES) migrateLegacy(type)
    for (const type of TYPES) ensureDefault(type)
  },

  activeId(type) {
    return state.activeIds[type] || null
  },

  activeDoc(type) {
    const id = state.activeIds[type]
    return state.docs.find((d) => d.id === id) || null
  },

  loadActive(type) {
    const id = state.activeIds[type]
    return id ? safeGet(docKey(id)) : null
  },

  saveActive(type, json) {
    const id = state.activeIds[type]
    if (!id) return
    safeSet(docKey(id), json)
    const doc = state.docs.find((d) => d.id === id)
    if (doc) {
      doc.updatedAt = nowIso()
      persistIndex()
    }
  },

  setActive(type, id) {
    state.activeIds[type] = id
    safeSet(activeKey(type), id)
  },

  create(type, name) {
    const id = uuidv4()
    const now = nowIso()
    state.docs.push({
      id,
      type,
      name: (name && name.trim()) || DEFAULT_NAMES[type] || 'Untitled',
      createdAt: now,
      updatedAt: now
    })
    persistIndex()
    return id
  },

  duplicate(id, name) {
    const src = state.docs.find((d) => d.id === id)
    if (!src) return null
    const newId = uuidv4()
    const now = nowIso()
    state.docs.push({
      id: newId,
      type: src.type,
      name: (name && name.trim()) || `${src.name} copy`,
      createdAt: now,
      updatedAt: now
    })
    const data = safeGet(docKey(id))
    if (data) safeSet(docKey(newId), data)
    persistIndex()
    return newId
  },

  rename(id, name) {
    const doc = state.docs.find((d) => d.id === id)
    if (doc && name && name.trim()) {
      doc.name = name.trim()
      persistIndex()
    }
  },

  remove(id) {
    const doc = state.docs.find((d) => d.id === id)
    if (!doc) return
    const type = doc.type
    state.docs = state.docs.filter((d) => d.id !== id)
    safeRemove(docKey(id))
    persistIndex()
    if (state.activeIds[type] === id) {
      const remaining = docsOfType(type)
      if (remaining.length) {
        this.setActive(type, remaining[0].id)
      } else {
        const newId = this.create(type, DEFAULT_NAMES[type])
        this.setActive(type, newId)
      }
    }
  }
}
