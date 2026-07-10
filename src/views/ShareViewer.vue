<template>
  <div class="min-h-screen bg-gray-100 dark:bg-slate-900">
    <!-- Viewer chrome (hidden when printing) -->
    <header class="no-print sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200 dark:bg-slate-800/90 dark:border-slate-700">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-2">
        <router-link to="/" aria-label="Resume Builder home"><AppLogo /></router-link>
        <div class="flex items-center gap-2 sm:gap-3">
          <template v-if="valid">
            <span class="hidden sm:inline text-sm text-gray-500 dark:text-slate-400">Shared {{ label.toLowerCase() }}</span>
            <button @click="printDoc" class="btn-outline hidden sm:flex items-center gap-1.5 text-sm px-3 py-2">
              <PrinterIcon class="w-4 h-4" /> Print
            </button>
            <button @click="downloadPdf" class="btn-outline flex items-center gap-1.5 text-sm px-3 py-2">
              <CloudArrowDownIcon class="w-4 h-4" /> <span class="hidden sm:inline">Download</span>
            </button>
          </template>
          <router-link to="/" class="btn-primary text-sm px-4 py-2 whitespace-nowrap">Create your own</router-link>
        </div>
      </div>
    </header>

    <main v-if="valid">
      <div class="no-print max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <div class="rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm px-4 py-2.5 dark:bg-blue-900/30 dark:border-blue-800/60 dark:text-blue-200">
          You are viewing a shared {{ label.toLowerCase() }}. It is read-only, and the photo is not included in shared links.
        </div>
      </div>
      <div class="py-6 sm:py-8 px-2 sm:px-6 flex justify-center">
        <div :id="previewId" class="w-full max-w-4xl bg-white shadow-lg">
          <component :is="templateComponent" />
        </div>
      </div>
    </main>

    <main v-else class="min-h-[60vh] flex items-center justify-center px-4 text-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">This link could not be opened</h1>
        <p class="text-gray-600 dark:text-slate-400 mb-6 max-w-md">
          The shared link looks invalid or was created with a different version. Ask for a fresh link, or create your own document.
        </p>
        <router-link to="/" class="btn-primary">Create your own</router-link>
      </div>
    </main>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { PrinterIcon, CloudArrowDownIcon } from '@heroicons/vue/24/outline'
import { getDocumentConfig } from '../documents/registry'
import { docManager } from '../documents/manager'
import { suspendPersistence, resumePersistence } from '../stores/persist'
import { decodeShare } from '../utils/shareLink'
import { exportToPDF } from '../utils/pdfExport'
import AppLogo from '../components/AppLogo.vue'

export default {
  name: 'ShareViewer',
  components: { AppLogo, PrinterIcon, CloudArrowDownIcon },
  setup() {
    const route = useRoute()
    const valid = ref(false)
    const config = ref(null)
    const type = ref('')
    let store = null

    const decoded = decodeShare((route.hash || '').replace(/^#/, ''))
    if (decoded) {
      const cfg = getDocumentConfig(decoded.type)
      if (cfg) {
        // Load the shared data WITHOUT persisting it, so the viewer never
        // overwrites the user's own saved documents.
        suspendPersistence()
        store = cfg.useStore()
        try {
          store.$reset()
          store.importData(JSON.stringify(decoded.data))
          config.value = cfg
          type.value = decoded.type
          valid.value = true
        } catch (e) {
          valid.value = false
        }
      }
    }
    if (!valid.value) resumePersistence()

    return { valid, config, type, store, toast: useToast() }
  },
  computed: {
    templateComponent() { return this.config ? this.config.template : null },
    previewId() { return this.config ? this.config.previewElementId : 'share-preview' },
    label() { return this.config ? this.config.documentLabel : 'Document' }
  },
  beforeRouteLeave(to, from, next) {
    this.restore()
    next()
  },
  beforeUnmount() {
    this.restore()
  },
  methods: {
    // Restore the user's own active document into the store and re-enable saving.
    restore() {
      try {
        if (this.config && this.store) {
          this.store.$reset()
          const json = docManager.loadActive(this.type)
          if (json) this.store.importData(json)
        }
      } catch (e) {
        /* ignore */
      }
      resumePersistence()
    },
    async downloadPdf() {
      try {
        this.toast.info('Generating PDF... Please wait')
        await exportToPDF(this.previewId, `Shared_${this.label}.pdf`)
        this.toast.success('Downloaded!')
      } catch (e) {
        console.error('Share download failed:', e)
        this.toast.error('Failed to download')
      }
    },
    printDoc() {
      window.print()
    }
  }
}
</script>
