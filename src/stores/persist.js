/**
 * Lightweight Pinia persistence plugin.
 *
 * Hydrates the listed stores from localStorage on creation and writes back
 * (debounced) on every change, so a refresh or a browser tab being evicted
 * never loses the user's document. The transient `ui` slice is not persisted.
 */
export function createPersistedState(options = {}) {
  const stores = options.stores || []
  const version = options.version || 'v1'
  const debounceMs = options.debounceMs || 400

  return ({ store }) => {
    if (!stores.includes(store.$id)) return
    const key = `mra-${store.$id}-${version}`

    // Hydrate from a previous session (missing keys keep their defaults).
    try {
      const saved = localStorage.getItem(key)
      if (saved) {
        const data = JSON.parse(saved)
        if (data && typeof data === 'object') {
          delete data.ui
          store.$patch(data)
        }
      }
    } catch (e) {
      /* corrupt or unavailable storage - start fresh */
    }

    // Persist on change, debounced.
    let timer = null
    store.$subscribe((_mutation, state) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        try {
          const clone = JSON.parse(JSON.stringify(state))
          delete clone.ui
          localStorage.setItem(key, JSON.stringify(clone))
        } catch (e) {
          /* quota exceeded or unavailable - ignore */
        }
      }, debounceMs)
    }, { detached: true })
  }
}
