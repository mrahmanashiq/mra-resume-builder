import { docManager } from '../documents/manager'

// Persistence can be suspended so a read-only view (e.g. a shared link) can load
// data into a store WITHOUT overwriting the user's saved documents on disk.
let suspended = false
export function suspendPersistence() { suspended = true }
export function resumePersistence() { suspended = false }

/**
 * Document-aware Pinia persistence plugin.
 *
 * Each store ('resume' | 'biodata') is backed by the *active* document for its
 * type (see src/documents/manager.js). On creation the store hydrates from the
 * active document and thereafter writes back (debounced) to it. Switching, new,
 * duplicate, rename and delete are handled by the manager + DocumentSwitcher;
 * this plugin just keeps the active document in sync with the live store.
 */
export function createPersistedState(options = {}) {
  const stores = options.stores || []
  const debounceMs = options.debounceMs || 400

  return ({ store }) => {
    if (!stores.includes(store.$id)) return
    const type = store.$id // 'resume' | 'biodata' === document type

    docManager.init()

    // Hydrate from the active document (missing/empty keeps store defaults).
    try {
      const json = docManager.loadActive(type)
      if (json) store.importData(json)
    } catch (e) {
      /* corrupt or unavailable storage - start fresh */
    }

    // Persist changes to the active document, debounced.
    let timer = null
    store.$subscribe(() => {
      if (suspended) return
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        if (suspended) return
        try {
          docManager.saveActive(type, store.exportData())
        } catch (e) {
          /* quota exceeded or unavailable - ignore */
        }
      }, debounceMs)
    }, { detached: true })
  }
}
