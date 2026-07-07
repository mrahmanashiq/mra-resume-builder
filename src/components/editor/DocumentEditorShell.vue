<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 no-print">
      <div class="w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <router-link to="/" class="text-xl font-bold text-primary-600">
              {{ config.headerTitle }}
            </router-link>
            <div class="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <span>Auto-saved</span>
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <button @click="togglePreview"
                    class="btn-outline flex items-center space-x-2">
              <EyeIcon class="w-4 h-4" />
              <span class="hidden sm:inline">{{ store.ui.previewMode ? 'Edit' : 'Preview' }}</span>
            </button>

            <div class="relative export-menu-wrap">
              <button @click="showExportMenu = !showExportMenu"
                      class="btn-primary flex items-center space-x-2">
                <CloudArrowDownIcon class="w-4 h-4" />
                <span class="hidden sm:inline">Export</span>
                <ChevronDownIcon class="w-4 h-4" />
              </button>

              <!-- Export Menu -->
              <div v-if="showExportMenu"
                   class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                <button @click="handleDownloadPDF"
                        class="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2">
                  <DocumentArrowDownIcon class="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                <button @click="handlePrint"
                        class="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2">
                  <PrinterIcon class="w-4 h-4" />
                  <span>Print</span>
                </button>
                <button @click="handleShare"
                        class="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2">
                  <ShareIcon class="w-4 h-4" />
                  <span>Share Link</span>
                </button>
                <hr class="my-2">
                <button @click="handleExportData"
                        class="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2">
                  <DocumentTextIcon class="w-4 h-4" />
                  <span>Export Data</span>
                </button>
                <button @click="openImportModal"
                        class="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2">
                  <ArrowUpTrayIcon class="w-4 h-4" />
                  <span>Import Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="flex h-[calc(100vh-4rem)]">
      <!-- Sidebar -->
      <aside v-if="!store.ui.previewMode"
             :class="['relative flex-shrink-0 flex flex-col overflow-hidden bg-white border-r border-gray-200 no-print',
                      resizing ? '' : 'transition-[width] duration-300']"
             :style="{ width: store.ui.sidebarCollapsed ? '4rem' : sidebarWidth + 'px' }">

        <!-- Sidebar Toggle -->
        <div class="p-4 border-b border-gray-200">
          <button @click="toggleSidebar"
                  class="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100">
            <Bars3Icon v-if="store.ui.sidebarCollapsed" class="w-5 h-5" />
            <div v-else class="flex items-center justify-between w-full">
              <span class="font-medium text-gray-900">{{ config.sidebarTitle }}</span>
              <ChevronLeftIcon class="w-5 h-5" />
            </div>
          </button>
        </div>

        <!-- Navigation -->
        <nav v-if="!store.ui.sidebarCollapsed" class="p-4">
          <div class="space-y-2">
            <button v-for="section in config.navSections"
                    :key="section.id"
                    @click="setCurrentSection(section.id)"
                    :class="['w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200',
                             store.ui.currentSection === section.id
                               ? 'bg-primary-100 text-primary-700'
                               : 'text-gray-700 hover:bg-gray-100']">
              <component :is="section.icon" class="w-5 h-5" />
              <span>{{ section.name }}</span>
            </button>
          </div>
        </nav>

        <!-- Section Editor -->
        <div v-if="!store.ui.sidebarCollapsed" class="flex-1 min-h-0 overflow-y-auto p-4">
          <Suspense>
            <component :is="currentSectionComponent" />
            <template #fallback>
              <div class="flex items-center justify-center p-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            </template>
          </Suspense>
        </div>

        <!-- Resize handle -->
        <div v-if="!store.ui.sidebarCollapsed"
             @mousedown.prevent="startResize"
             @dblclick="resetSidebarWidth"
             class="absolute top-0 right-0 h-full w-1.5 cursor-col-resize bg-transparent hover:bg-primary-300 active:bg-primary-400 transition-colors"
             title="Drag to resize · double-click to reset"></div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-hidden bg-gray-100">
        <div class="h-full overflow-y-auto p-8">
          <div class="max-w-4xl mx-auto">
            <!-- Document Preview -->
            <div :id="config.previewElementId" class="document-preview bg-white shadow-lg">
              <Suspense>
                <component :is="config.template" />
                <template #fallback>
                  <div class="flex items-center justify-center p-16">
                    <div class="text-center">
                      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                      <p class="text-gray-600">Loading template...</p>
                    </div>
                  </div>
                </template>
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Import Modal -->
    <div v-if="showImportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 no-print">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">Import {{ config.documentLabel }} Data</h3>
        <textarea v-model="importJsonData"
                  :placeholder="`Paste your ${config.documentLabel.toLowerCase()} JSON data here...`"
                  class="textarea-field h-40 mb-4"></textarea>
        <div class="flex justify-end space-x-3">
          <button @click="showImportModal = false" class="btn-secondary">
            Cancel
          </button>
          <button @click="handleImportData" class="btn-primary">
            Import
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from 'vue-toastification'
import { useDocumentExport } from '../../composables/useDocumentExport'

import {
  EyeIcon,
  CloudArrowDownIcon,
  ChevronDownIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  ShareIcon,
  DocumentTextIcon,
  ArrowUpTrayIcon,
  Bars3Icon,
  ChevronLeftIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'DocumentEditorShell',
  components: {
    EyeIcon,
    CloudArrowDownIcon,
    ChevronDownIcon,
    DocumentArrowDownIcon,
    PrinterIcon,
    ShareIcon,
    DocumentTextIcon,
    ArrowUpTrayIcon,
    Bars3Icon,
    ChevronLeftIcon
  },
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const store = props.config.useStore()
    const toast = useToast()
    const exporter = useDocumentExport({
      store,
      previewElementId: props.config.previewElementId,
      baseName: () => props.config.baseName(store),
      label: props.config.documentLabel,
      toast
    })
    return { store, toast, exporter }
  },
  data() {
    return {
      showExportMenu: false,
      showImportModal: false,
      importJsonData: '',
      sidebarWidth: 320,
      minSidebarWidth: 256,
      maxSidebarWidth: 640,
      resizing: false
    }
  },
  computed: {
    currentSectionComponent() {
      const sections = this.config.navSections
      const active = sections.find(section => section.id === this.store.ui.currentSection)
      return active ? active.editor : sections[0].editor
    },
    widthKey() {
      return `mra-${this.config.type}-sidebar-width`
    }
  },
  methods: {
    togglePreview() {
      this.store.togglePreviewMode()
    },

    toggleSidebar() {
      this.store.toggleSidebar()
    },

    setCurrentSection(section) {
      this.store.setCurrentSection(section)
    },

    async handleDownloadPDF() {
      this.showExportMenu = false
      await this.exporter.downloadPDF()
    },

    handlePrint() {
      this.showExportMenu = false
      this.exporter.printDocument()
    },

    handleShare() {
      this.showExportMenu = false
      this.exporter.shareDocument()
    },

    handleExportData() {
      this.showExportMenu = false
      this.exporter.downloadData()
    },

    openImportModal() {
      this.showImportModal = true
      this.showExportMenu = false
    },

    handleImportData() {
      if (this.exporter.importData(this.importJsonData)) {
        this.showImportModal = false
        this.importJsonData = ''
      }
    },

    handleOutsideClick(event) {
      if (!event.target.closest('.export-menu-wrap')) {
        this.showExportMenu = false
      }
    },

    effectiveMaxWidth() {
      // Cap width to the viewport so the preview always has room (responsive).
      return Math.max(this.minSidebarWidth, Math.min(this.maxSidebarWidth, window.innerWidth - 360))
    },

    clampToViewport() {
      const max = this.effectiveMaxWidth()
      this.sidebarWidth = Math.min(Math.max(this.sidebarWidth, this.minSidebarWidth), max)
    },

    startResize(event) {
      this.resizing = true
      this._startX = event.clientX
      this._startWidth = this.sidebarWidth
      document.addEventListener('mousemove', this.onResize)
      document.addEventListener('mouseup', this.stopResize)
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'col-resize'
    },

    onResize(event) {
      if (!this.resizing) return
      const delta = event.clientX - this._startX
      const max = this.effectiveMaxWidth()
      this.sidebarWidth = Math.min(Math.max(this._startWidth + delta, this.minSidebarWidth), max)
    },

    stopResize() {
      if (!this.resizing) return
      this.resizing = false
      document.removeEventListener('mousemove', this.onResize)
      document.removeEventListener('mouseup', this.stopResize)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
      try {
        localStorage.setItem(this.widthKey, String(this.sidebarWidth))
      } catch (error) {
        /* localStorage unavailable — ignore */
      }
    },

    resetSidebarWidth() {
      this.sidebarWidth = 320
      this.clampToViewport()
      try {
        localStorage.setItem(this.widthKey, String(this.sidebarWidth))
      } catch (error) {
        /* localStorage unavailable — ignore */
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick)
    window.addEventListener('resize', this.clampToViewport)
    try {
      const saved = parseInt(localStorage.getItem(this.widthKey), 10)
      if (!Number.isNaN(saved)) {
        this.sidebarWidth = saved
      }
    } catch (error) {
      /* localStorage unavailable — ignore */
    }
    this.clampToViewport()
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick)
    window.removeEventListener('resize', this.clampToViewport)
    document.removeEventListener('mousemove', this.onResize)
    document.removeEventListener('mouseup', this.stopResize)
  }
}
</script>

<style scoped>
@media print {
  header,
  aside,
  .no-print {
    display: none !important;
  }

  main {
    padding: 0 !important;
    background: white !important;
  }

  .document-preview {
    box-shadow: none !important;
    border: none !important;
  }
}
</style>
