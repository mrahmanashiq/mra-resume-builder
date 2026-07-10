<template>
  <div class="doc-switcher relative">
    <button type="button" @click="toggle"
            class="flex items-center gap-1.5 max-w-[10rem] sm:max-w-[16rem] px-2.5 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:border-primary-400 hover:text-primary-600 transition-colors dark:border-slate-600 dark:text-slate-200 dark:hover:border-primary-400"
            :title="activeName">
      <DocumentDuplicateIcon class="w-4 h-4 flex-shrink-0" />
      <span class="truncate font-medium">{{ activeName }}</span>
      <ChevronDownIcon class="w-4 h-4 flex-shrink-0" :class="{ 'rotate-180': open }" />
    </button>

    <template v-if="open">
      <div class="fixed inset-0 z-40" @click="close"></div>
      <div class="absolute left-0 mt-2 w-72 max-w-[90vw] bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 dark:bg-slate-800 dark:border-slate-700">
        <p class="px-4 pb-1 text-[11px] font-semibold text-gray-500 uppercase tracking-wide dark:text-slate-400">
          Your {{ label.toLowerCase() }}s
        </p>

        <div class="max-h-60 overflow-y-auto">
          <div v-for="doc in docs" :key="doc.id"
               class="group flex items-center gap-2 px-2 mx-2 rounded-lg"
               :class="doc.id === activeId ? 'bg-primary-50 dark:bg-primary-900/30' : 'hover:bg-gray-50 dark:hover:bg-slate-700'">
            <!-- Rename mode for the active row -->
            <template v-if="renamingId === doc.id">
              <input ref="renameInput" v-model="renameValue" @keyup.enter="saveRename" @keyup.esc="cancelRename"
                     class="flex-1 min-w-0 my-1 px-2 py-1 text-sm rounded border border-gray-300 bg-white text-gray-900 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-100" />
              <button type="button" @click="saveRename" class="text-primary-600 text-xs font-medium px-1 dark:text-primary-300">Save</button>
              <button type="button" @click="cancelRename" class="text-gray-400 text-xs px-1">Cancel</button>
            </template>
            <template v-else>
              <button type="button" @click="switchTo(doc.id)"
                      class="flex-1 min-w-0 text-left py-2 flex items-center gap-2">
                <CheckIcon class="w-4 h-4 flex-shrink-0" :class="doc.id === activeId ? 'text-primary-600 dark:text-primary-300' : 'text-transparent'" />
                <span class="truncate text-sm text-gray-800 dark:text-slate-100">{{ doc.name }}</span>
              </button>
            </template>
          </div>
        </div>

        <hr class="my-2 dark:border-slate-700">

        <div v-if="confirmingDelete" class="px-4 py-1">
          <p class="text-sm text-gray-700 dark:text-slate-200 mb-2">Delete "{{ activeName }}"? This cannot be undone.</p>
          <div class="flex gap-2">
            <button type="button" @click="doDelete" class="text-sm font-medium text-red-600 dark:text-red-400">Delete</button>
            <button type="button" @click="confirmingDelete = false" class="text-sm text-gray-500 dark:text-slate-400">Cancel</button>
          </div>
        </div>
        <div v-else class="flex flex-col">
          <button type="button" @click="newDoc" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2.5 dark:hover:bg-slate-700 dark:text-slate-100">
            <PlusIcon class="w-4 h-4 text-gray-500 dark:text-slate-400" /> New {{ label.toLowerCase() }}
          </button>
          <button type="button" @click="duplicateDoc" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2.5 dark:hover:bg-slate-700 dark:text-slate-100">
            <DocumentDuplicateIcon class="w-4 h-4 text-gray-500 dark:text-slate-400" /> Duplicate
          </button>
          <button type="button" @click="startRename" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2.5 dark:hover:bg-slate-700 dark:text-slate-100">
            <PencilSquareIcon class="w-4 h-4 text-gray-500 dark:text-slate-400" /> Rename
          </button>
          <button type="button" @click="confirmingDelete = true" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2.5 text-red-600 dark:hover:bg-slate-700 dark:text-red-400">
            <TrashIcon class="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { nextTick } from 'vue'
import {
  DocumentDuplicateIcon,
  ChevronDownIcon,
  CheckIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import { docManager } from '../../documents/manager'

export default {
  name: 'DocumentSwitcher',
  components: { DocumentDuplicateIcon, ChevronDownIcon, CheckIcon, PlusIcon, PencilSquareIcon, TrashIcon },
  props: {
    store: { type: Object, required: true },
    type: { type: String, required: true },
    label: { type: String, default: 'Document' }
  },
  data() {
    return {
      open: false,
      renamingId: null,
      renameValue: '',
      confirmingDelete: false
    }
  },
  computed: {
    docs() {
      return docManager.docsOfType(this.type)
    },
    activeId() {
      return docManager.activeId(this.type)
    },
    activeName() {
      const d = docManager.activeDoc(this.type)
      return d ? d.name : this.label
    }
  },
  methods: {
    toggle() {
      this.open = !this.open
      if (!this.open) this.resetTransient()
    },
    close() {
      this.open = false
      this.resetTransient()
    },
    resetTransient() {
      this.renamingId = null
      this.confirmingDelete = false
    },

    // Write the live store to the currently active document immediately.
    flushSave() {
      docManager.saveActive(this.type, this.store.exportData())
    },
    // Load the active document into the store (clearing any previous doc's data).
    hydrate() {
      this.store.$reset()
      const json = docManager.loadActive(this.type)
      if (json) this.store.importData(json)
    },

    switchTo(id) {
      if (id !== this.activeId) {
        this.flushSave()
        docManager.setActive(this.type, id)
        this.hydrate()
      }
      this.close()
    },

    newDoc() {
      this.flushSave()
      const id = docManager.create(this.type, `${this.label} ${this.docs.length + 1}`)
      docManager.setActive(this.type, id)
      this.store.$reset() // new document starts from defaults
      this.close()
    },

    duplicateDoc() {
      this.flushSave()
      const id = docManager.duplicate(this.activeId)
      if (id) {
        docManager.setActive(this.type, id)
        this.hydrate()
      }
      this.close()
    },

    startRename() {
      this.confirmingDelete = false
      this.renamingId = this.activeId
      this.renameValue = this.activeName
      nextTick(() => {
        const el = this.$refs.renameInput
        const input = Array.isArray(el) ? el[0] : el
        if (input) input.focus()
      })
    },
    saveRename() {
      docManager.rename(this.renamingId, this.renameValue)
      this.renamingId = null
    },
    cancelRename() {
      this.renamingId = null
    },

    doDelete() {
      const wasActive = this.activeId
      docManager.remove(wasActive)
      // Active document changed - load whatever is active now.
      this.hydrate()
      this.close()
    }
  }
}
</script>
