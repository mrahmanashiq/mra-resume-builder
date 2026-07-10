import { ref, computed, onUnmounted } from 'vue'
import { docManager } from '../documents/manager'

/**
 * Undo / redo history for a document store.
 *
 * The store already exposes exportData() (full serialized snapshot) and
 * importData(json) (apply a snapshot). We use those as the history boundary, so
 * every field/section/setting change is covered without listing them by hand.
 *
 * Design notes:
 *  - Recording is debounced, so a burst of keystrokes collapses into one step
 *    (undo jumps by a pause in typing, not per character).
 *  - We keep the last snapshot as `current`. An undo/redo applies a snapshot and
 *    sets `current` to it; when the resulting change settles, the new snapshot
 *    equals `current` and is skipped - so applying history never creates a new
 *    step. No extra "is applying" flag needed.
 *  - History is per active document. When the active document id changes
 *    (switch / new / duplicate / delete all re-hydrate the store), we reset the
 *    stacks so undo can never leak one document's content into another.
 */
export function useHistory({ store, type, debounceMs = 450, max = 50 }) {
  const past = ref([])
  const future = ref([])
  let current = null
  let currentDocId = null
  let timer = null

  const snapshot = () => {
    try {
      return store.exportData()
    } catch {
      return null
    }
  }

  const record = () => {
    const snap = snapshot()
    if (snap == null) return
    const docId = docManager.activeId(type)

    // Active document changed (or first load) - start a fresh timeline.
    if (docId !== currentDocId) {
      past.value = []
      future.value = []
      current = snap
      currentDocId = docId
      return
    }

    // No real change, or this is the state we just applied via undo/redo.
    if (snap === current) return

    if (current !== null) {
      past.value.push(current)
      if (past.value.length > max) past.value.shift()
    }
    current = snap
    future.value = []
  }

  const scheduleRecord = () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(record, debounceMs)
  }

  const apply = (snap) => {
    // Set current first so the settle from importData() compares equal and is skipped.
    current = snap
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    store.importData(snap)
  }

  const undo = () => {
    if (!past.value.length) return
    future.value.push(current)
    apply(past.value.pop())
  }

  const redo = () => {
    if (!future.value.length) return
    past.value.push(current)
    apply(future.value.pop())
  }

  // Baseline from the already-hydrated store, then watch for changes.
  current = snapshot()
  currentDocId = docManager.activeId(type)
  const unsubscribe = store.$subscribe(scheduleRecord, { detached: true })

  onUnmounted(() => {
    if (timer) clearTimeout(timer)
    try {
      unsubscribe && unsubscribe()
    } catch {
      /* already gone */
    }
  })

  return {
    canUndo: computed(() => past.value.length > 0),
    canRedo: computed(() => future.value.length > 0),
    undo,
    redo
  }
}
