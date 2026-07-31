<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 no-print dark:bg-slate-800 dark:border-slate-700">
      <div class="w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <router-link to="/" class="flex items-center">
              <AppLogo :title="config.headerTitle" />
            </router-link>
            <div class="flex items-center space-x-2 text-sm">
              <span class="hidden md:inline" :class="saveStatus === 'saving' ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-slate-400'">
                {{ saveStatus === 'saving' ? 'Saving…' : 'Auto-saved' }}
              </span>
              <span class="save-dot"
                    :class="saveStatus === 'saving' ? 'save-dot-saving' : 'save-dot-saved'"
                    :title="saveStatus === 'saving' ? 'Saving…' : 'Saved to this browser'"></span>
            </div>
            <DocumentSwitcher :store="store" :type="config.type" :label="config.documentLabel" />
          </div>

          <div class="flex items-center space-x-2 sm:space-x-4">
            <!-- Undo / redo (document-wide history); on phones this lives in the bottom action bar -->
            <div class="hidden sm:flex items-center rounded-lg border border-gray-300 overflow-hidden dark:border-slate-600">
              <button type="button" @click="undo" :disabled="!canUndo"
                      class="px-2.5 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed dark:text-slate-300 dark:hover:bg-slate-700"
                      title="Undo (Ctrl+Z)" aria-label="Undo">
                <ArrowUturnLeftIcon class="w-4 h-4" />
              </button>
              <span class="w-px self-stretch bg-gray-300 dark:bg-slate-600" aria-hidden="true"></span>
              <button type="button" @click="redo" :disabled="!canRedo"
                      class="px-2.5 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed dark:text-slate-300 dark:hover:bg-slate-700"
                      title="Redo (Ctrl+Shift+Z)" aria-label="Redo">
                <ArrowUturnRightIcon class="w-4 h-4" />
              </button>
            </div>
            <ThemeToggle />
            <!-- Preview + Download live in the sticky bottom bar on mobile; show here on larger screens only -->
            <button @click="togglePreview"
                    class="btn-outline hidden lg:flex items-center space-x-2">
              <EyeIcon class="w-4 h-4" />
              <span class="hidden sm:inline">{{ store.ui.previewMode ? 'Edit' : 'Preview' }}</span>
            </button>

            <div class="relative export-menu-wrap hidden lg:block">
              <button @click="toggleExportMenu"
                      class="btn-primary flex items-center space-x-2">
                <CloudArrowDownIcon class="w-4 h-4" />
                <span class="hidden sm:inline">Download</span>
                <ChevronDownIcon class="w-4 h-4" :class="{ 'rotate-180': showExportMenu }" />
              </button>

              <!-- Export Menu -->
              <div v-if="showExportMenu"
                   class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
                <!-- Format picker + single Download button -->
                <DownloadPanel
                  :supports-text="supportsTextExport"
                  :selected-id="selectedDownloadFormat"
                  @update:selected-id="selectedDownloadFormat = $event"
                  @download="handlePanelDownload"
                />

                <template v-if="supportsTextExport">
                  <hr class="my-1 dark:border-slate-700">
                  <button type="button" @click="openAtsCheck"
                          class="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-3 dark:hover:bg-slate-700">
                    <MagnifyingGlassIcon class="w-4 h-4 text-gray-600 flex-shrink-0 dark:text-slate-400" />
                    <span class="flex-1 min-w-0">
                      <span class="block font-medium text-gray-800 dark:text-slate-100">ATS match check</span>
                      <span class="block text-xs text-gray-500 dark:text-slate-400">Compare with a job description</span>
                    </span>
                  </button>
                  <button type="button" @click="openResumeTips"
                          class="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-3 dark:hover:bg-slate-700">
                    <LightBulbIcon class="w-4 h-4 text-gray-600 flex-shrink-0 dark:text-slate-400" />
                    <span class="flex-1 min-w-0">
                      <span class="block font-medium text-gray-800 dark:text-slate-100">Resume tips</span>
                      <span class="block text-xs text-gray-500 dark:text-slate-400">Check your resume's strength</span>
                    </span>
                  </button>
                </template>

                <hr class="my-1 dark:border-slate-700">
                <button @click="handlePrint"
                        class="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 dark:hover:bg-slate-700">
                  <PrinterIcon class="w-4 h-4" />
                  <span>Print</span>
                </button>
                <button @click="openShareModal"
                        class="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 dark:hover:bg-slate-700 dark:text-slate-100">
                  <ShareIcon class="w-4 h-4" />
                  <span>Share link &amp; QR</span>
                </button>
                <hr class="my-2 dark:border-slate-700">
                <button @click="handleExportData"
                        class="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 dark:hover:bg-slate-700">
                  <DocumentTextIcon class="w-4 h-4" />
                  <span>Export Data</span>
                </button>
                <button @click="openImportModal"
                        class="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 dark:hover:bg-slate-700">
                  <ArrowUpTrayIcon class="w-4 h-4" />
                  <span>Import Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile section switcher: sticky horizontal tabs under the header (edit mode only) -->
    <div v-if="!store.ui.previewMode"
         class="mobile-tabs lg:hidden sticky top-16 z-40 bg-white border-b border-gray-200 no-print dark:bg-slate-800 dark:border-slate-700">
      <div class="flex gap-2 overflow-x-auto px-4 py-2">
        <button v-for="section in config.navSections"
                :key="section.id"
                @click="jumpToSection(section.id, $event)"
                :class="['mobile-tab flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                         store.ui.currentSection === section.id
                           ? 'bg-primary-600 text-white'
                           : 'bg-gray-100 text-gray-700 active:bg-gray-200 dark:bg-slate-700 dark:text-slate-200 dark:active:bg-slate-600']">
          <component :is="section.icon" class="w-4 h-4 flex-shrink-0" />
          <span>{{ section.name }}</span>
        </button>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row lg:h-[calc(100vh-4rem)]">
      <!-- Desktop nav rail: the section list sits BESIDE the form, not above it -->
      <nav v-if="!isMobile && !store.ui.previewMode"
           class="flex flex-col flex-shrink-0 w-56 overflow-hidden bg-white border-r border-gray-200 no-print dark:bg-slate-800 dark:border-slate-700">
        <div class="p-3 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between gap-2">
          <span class="font-medium text-gray-900 dark:text-slate-100 px-1 truncate">{{ config.sidebarTitle }}</span>
          <button @click="toggleSidebar"
                  :title="store.ui.sidebarCollapsed ? 'Show editor panel' : 'Hide editor panel'"
                  class="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
            <ChevronLeftIcon class="w-4 h-4 text-gray-600 dark:text-slate-300 transition-transform"
                             :class="{ 'rotate-180': store.ui.sidebarCollapsed }" />
          </button>
        </div>
        <div class="flex-1 min-h-0 overflow-y-auto p-3 space-y-1.5">
          <button v-for="section in config.navSections"
                  :key="section.id"
                  @click="setCurrentSection(section.id)"
                  :class="['w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200',
                           store.ui.currentSection === section.id
                             ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-200'
                             : 'text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700']">
            <component :is="section.icon" class="w-5 h-5 flex-shrink-0" />
            <span class="truncate">{{ section.name }}</span>
          </button>
        </div>
      </nav>

      <!-- Editor form pane (beside the nav rail on desktop; full width on mobile) -->
      <aside v-if="!store.ui.previewMode && (isMobile || !store.ui.sidebarCollapsed)"
             :class="['relative flex-shrink-0 flex flex-col overflow-hidden bg-white border-b lg:border-b-0 lg:border-r border-gray-200 no-print dark:bg-slate-800 dark:border-slate-700',
                      resizing ? '' : 'transition-[width] duration-300']"
             :style="asideStyle">
        <!-- Section Editor -->
        <div class="mobile-pb flex-1 min-h-0 overflow-y-auto p-4">
          <Suspense>
            <component :is="currentSectionComponent" />
            <template #fallback>
              <div class="flex items-center justify-center p-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            </template>
          </Suspense>
        </div>

        <!-- Resize handle (desktop only) -->
        <div v-if="!isMobile"
             @mousedown.prevent="startResize"
             @dblclick="resetSidebarWidth"
             class="absolute top-0 right-0 h-full w-1.5 cursor-col-resize bg-transparent hover:bg-primary-300 active:bg-primary-400 transition-colors"
             title="Drag to resize · double-click to reset"></div>
      </aside>

      <!-- Main Content (stacks below the editor on mobile, side-by-side on desktop) -->
      <main class="flex-1 overflow-hidden bg-gray-100 dark:bg-slate-900 relative">
        <button type="button" @click="showGuides = !showGuides"
                class="no-print absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border shadow-sm bg-white dark:bg-slate-800 transition-colors"
                :class="showGuides ? 'border-primary-400 text-primary-600 dark:text-primary-300 dark:border-primary-500' : 'border-gray-300 text-gray-600 dark:border-slate-600 dark:text-slate-300'"
                title="Show A4 page-break lines on the preview">
          Page guides: {{ showGuides ? 'On' : 'Off' }}
        </button>
        <div class="mobile-pb lg:h-full overflow-y-auto overflow-x-auto p-4 sm:p-6 lg:p-8">
          <div class="max-w-4xl mx-auto">
            <!-- Document Preview -->
            <div class="preview-wrap relative">
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
              <PageGuides v-if="showGuides" :target-id="config.previewElementId" class="no-print" />
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Mobile action bar (always reachable while editing) -->
    <div class="mobile-actionbar lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 flex items-center gap-2 px-4 py-2 no-print dark:bg-slate-800 dark:border-slate-700">
      <button @click="undo" :disabled="!canUndo"
              class="btn-outline flex-none px-3 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Undo" aria-label="Undo">
        <ArrowUturnLeftIcon class="w-4 h-4" />
      </button>
      <button @click="redo" :disabled="!canRedo"
              class="btn-outline flex-none px-3 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Redo" aria-label="Redo">
        <ArrowUturnRightIcon class="w-4 h-4" />
      </button>
      <button @click="togglePreview"
              class="btn-outline flex-1 flex items-center justify-center gap-2 py-2.5">
        <EyeIcon class="w-4 h-4" />
        <span>{{ store.ui.previewMode ? 'Edit' : 'Preview' }}</span>
      </button>
      <button @click="showMobileExport = true"
              class="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5">
        <CloudArrowDownIcon class="w-4 h-4" />
        <span>Download</span>
      </button>
    </div>

    <!-- Mobile export sheet -->
    <div v-if="showMobileExport" class="lg:hidden fixed inset-0 z-50 no-print" @click.self="showMobileExport = false">
      <div class="absolute inset-0 bg-black/40" @click="showMobileExport = false"></div>
      <div class="mobile-sheet absolute inset-x-0 bottom-0 bg-white rounded-t-2xl p-4 pb-6 shadow-2xl dark:bg-slate-800">
        <div class="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4 dark:bg-slate-600"></div>
        <DownloadPanel :supports-text="supportsTextExport" @download="handlePanelDownload" />
        <template v-if="supportsTextExport">
          <hr class="my-2 dark:border-slate-700">
          <button type="button" @click="openAtsCheck" class="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 flex items-center gap-3 dark:hover:bg-slate-700 dark:active:bg-slate-600">
            <MagnifyingGlassIcon class="w-5 h-5 text-gray-600 flex-shrink-0 dark:text-slate-400" />
            <span class="flex-1 min-w-0">
              <span class="block font-medium text-gray-800 dark:text-slate-100">ATS match check</span>
              <span class="block text-xs text-gray-500 dark:text-slate-400">Compare with a job description</span>
            </span>
          </button>
          <button type="button" @click="openResumeTips" class="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 flex items-center gap-3 dark:hover:bg-slate-700 dark:active:bg-slate-600">
            <LightBulbIcon class="w-5 h-5 text-gray-600 flex-shrink-0 dark:text-slate-400" />
            <span class="flex-1 min-w-0">
              <span class="block font-medium text-gray-800 dark:text-slate-100">Resume tips</span>
              <span class="block text-xs text-gray-500 dark:text-slate-400">Check your resume's strength</span>
            </span>
          </button>
        </template>
        <hr class="my-2 dark:border-slate-700">
        <button @click="handlePrint" class="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 flex items-center gap-3 dark:hover:bg-slate-700 dark:active:bg-slate-600 dark:text-slate-100">
          <PrinterIcon class="w-5 h-5 text-gray-600 dark:text-slate-400" /> <span class="font-medium text-gray-800 dark:text-slate-100">Print</span>
        </button>
        <button @click="openShareModal" class="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 flex items-center gap-3 dark:hover:bg-slate-700 dark:active:bg-slate-600">
          <ShareIcon class="w-5 h-5 text-gray-600 dark:text-slate-400" /> <span class="font-medium text-gray-800 dark:text-slate-100">Share link &amp; QR</span>
        </button>
        <button @click="handleExportData" class="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 flex items-center gap-3 dark:hover:bg-slate-700 dark:active:bg-slate-600">
          <DocumentTextIcon class="w-5 h-5 text-gray-600 dark:text-slate-400" /> <span class="font-medium text-gray-800 dark:text-slate-100">Export Data</span>
        </button>
        <button @click="openImportModal" class="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 flex items-center gap-3 dark:hover:bg-slate-700 dark:active:bg-slate-600">
          <ArrowUpTrayIcon class="w-5 h-5 text-gray-600 dark:text-slate-400" /> <span class="font-medium text-gray-800 dark:text-slate-100">Import Data</span>
        </button>
      </div>
    </div>

    <!-- Import Modal -->
    <div v-if="showImportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 no-print">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 dark:bg-slate-800 dark:text-slate-100">
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

    <!-- Resume analysis tools (resume only) -->
    <AtsMatchModal v-if="showAtsModal" :store="store" @close="showAtsModal = false" />
    <ResumeTipsModal v-if="showTipsModal" :store="store" @close="showTipsModal = false" />

    <!-- Share: link + QR -->
    <ShareModal v-if="showShareModal" :store="store" :type="config.type" :label="config.documentLabel"
                @close="showShareModal = false" />

    <!-- Optional donation prompt shown before a download. Only "Skip and
         download" starts the download; the X closes without downloading. -->
    <DonationModal v-if="showDonationModal" @close="cancelDonation" @download="confirmDownload" />
  </div>
</template>

<script>
import { useToast } from 'vue-toastification'
import { useDocumentExport } from '../../composables/useDocumentExport'
import { useHistory } from '../../composables/useHistory'
import { shouldShowDonationPrompt, markDonationPromptShown } from '../../utils/donationPrompt'
import AppLogo from '../AppLogo.vue'
import AtsMatchModal from './AtsMatchModal.vue'
import ResumeTipsModal from './ResumeTipsModal.vue'
import ShareModal from './ShareModal.vue'
import DonationModal from '../DonationModal.vue'
import DocumentSwitcher from './DocumentSwitcher.vue'
import DownloadPanel from './DownloadPanel.vue'
import PageGuides from './PageGuides.vue'

import {
  EyeIcon,
  CloudArrowDownIcon,
  ChevronDownIcon,
  DocumentArrowDownIcon,
  PhotoIcon,
  PrinterIcon,
  ShareIcon,
  DocumentTextIcon,
  ArrowUpTrayIcon,
  Bars3Icon,
  ChevronLeftIcon,
  MagnifyingGlassIcon,
  LightBulbIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon
} from '@heroicons/vue/24/outline'

// Download formats - each is a one-click download action.
const DOWNLOAD_FORMATS = [
  { id: 'pdf', label: 'PDF (image)', desc: 'Exact design, best for printing', icon: DocumentArrowDownIcon },
  { id: 'png', label: 'PNG', desc: 'High-quality image', icon: PhotoIcon },
  { id: 'jpg', label: 'JPG', desc: 'Smaller image file', icon: PhotoIcon }
]

export default {
  name: 'DocumentEditorShell',
  components: {
    AppLogo,
    AtsMatchModal,
    ResumeTipsModal,
    ShareModal,
    DonationModal,
    DocumentSwitcher,
    DownloadPanel,
    PageGuides,
    EyeIcon,
    CloudArrowDownIcon,
    ChevronDownIcon,
    DocumentArrowDownIcon,
    PhotoIcon,
    PrinterIcon,
    ShareIcon,
    DocumentTextIcon,
    ArrowUpTrayIcon,
    Bars3Icon,
    ChevronLeftIcon,
    MagnifyingGlassIcon,
    ArrowUturnLeftIcon,
    ArrowUturnRightIcon
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
    const { canUndo, canRedo, undo, redo } = useHistory({ store, type: props.config.type })
    return { store, toast, exporter, canUndo, canRedo, undo, redo }
  },
  data() {
    return {
      showExportMenu: false,
      showMobileExport: false,
      showAtsModal: false,
      showTipsModal: false,
      showShareModal: false,
      showDonationModal: false,
      pendingDownloadFormat: null,
      selectedDownloadFormat: 'pdf',
      showGuides: true,
      saveStatus: 'saved',
      formats: DOWNLOAD_FORMATS,
      showImportModal: false,
      importJsonData: '',
      sidebarWidth: 320,
      minSidebarWidth: 256,
      maxSidebarWidth: 640,
      resizing: false,
      windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1280
    }
  },
  computed: {
    currentSectionComponent() {
      const sections = this.config.navSections
      const active = sections.find(section => section.id === this.store.ui.currentSection)
      return active ? active.editor : sections[0].editor
    },
    isMobile() {
      return this.windowWidth < 1024
    },
    supportsTextExport() {
      // Text/ATS export is built from the resume data model.
      return this.config.type === 'resume'
    },
    asideStyle() {
      // On mobile the editor takes the full width (single-panel, toggled by Preview).
      // On desktop, collapsing hides the pane entirely (see v-if), so width is just the set width.
      if (this.isMobile) return { width: '100%' }
      return { width: this.sidebarWidth + 'px' }
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

    jumpToSection(section, event) {
      this.store.setCurrentSection(section)
      // Keep the tapped tab visible in the horizontal strip.
      const el = event && event.currentTarget
      if (el && el.scrollIntoView) el.scrollIntoView({ inline: 'center', block: 'nearest' })
    },

    toggleExportMenu() {
      this.showExportMenu = !this.showExportMenu
    },

    async handleTextPDF() {
      this.showExportMenu = false
      this.showMobileExport = false
      await this.exporter.downloadTextPDF()
    },

    handleWord() {
      this.showExportMenu = false
      this.showMobileExport = false
      this.exporter.downloadWord()
    },

    handleText() {
      this.showExportMenu = false
      this.showMobileExport = false
      this.exporter.downloadText()
    },

    async handleDownloadFormat(format) {
      this.showExportMenu = false
      this.showMobileExport = false
      if (format === 'pdf') {
        await this.exporter.downloadPDF()
      } else {
        await this.exporter.downloadImage(format)
      }
    },

    // Canva-style download panel: one handler for the selected format. The
    // download is deferred behind an optional "support this project" prompt -
    // the file downloads as soon as the user skips (or after they donate).
    handlePanelDownload(format) {
      this.showExportMenu = false
      this.showMobileExport = false
      if (shouldShowDonationPrompt()) {
        this.pendingDownloadFormat = format
        this.showDonationModal = true
      } else {
        this.runDownload(format)
      }
    },

    runDownload(format) {
      const actions = {
        'text-pdf': () => this.exporter.downloadTextPDF(),
        pdf: () => this.exporter.downloadPDF(),
        word: () => this.exporter.downloadWord(),
        txt: () => this.exporter.downloadText(),
        png: () => this.exporter.downloadImage('png'),
        jpg: () => this.exporter.downloadImage('jpg')
      }
      const run = actions[format]
      if (run) run()
    },

    // "Skip and download" is the only path that downloads: dismiss, then run it.
    confirmDownload() {
      this.showDonationModal = false
      markDonationPromptShown()
      const format = this.pendingDownloadFormat
      this.pendingDownloadFormat = null
      if (format) this.runDownload(format)
    },

    // X / close: dismiss the prompt without downloading.
    cancelDonation() {
      this.showDonationModal = false
      markDonationPromptShown()
      this.pendingDownloadFormat = null
    },

    handlePrint() {
      this.showExportMenu = false
      this.showMobileExport = false
      this.exporter.printDocument()
    },

    openAtsCheck() {
      this.showExportMenu = false
      this.showMobileExport = false
      this.showAtsModal = true
    },

    openResumeTips() {
      this.showExportMenu = false
      this.showMobileExport = false
      this.showTipsModal = true
    },

    openShareModal() {
      this.showExportMenu = false
      this.showMobileExport = false
      this.showShareModal = true
    },

    handleExportData() {
      this.showExportMenu = false
      this.showMobileExport = false
      this.exporter.downloadData()
    },

    openImportModal() {
      this.showImportModal = true
      this.showExportMenu = false
      this.showMobileExport = false
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

    closeAllOverlays() {
      this.showExportMenu = false
      this.showMobileExport = false
      this.showShareModal = false
      this.showAtsModal = false
      this.showTipsModal = false
      this.showImportModal = false
    },

    handleShortcuts(event) {
      // Escape closes any open menu or modal.
      if (event.key === 'Escape') {
        // The donation prompt ignores Escape by design; it is dismissed only
        // via its own buttons (Skip and download, or the X to close).
        if (this.showDonationModal) return
        this.closeAllOverlays()
        return
      }

      const mod = event.ctrlKey || event.metaKey
      if (!mod) return
      const key = event.key.toLowerCase()

      // Ctrl/Cmd+S: we auto-save, so just reassure the user (and stop the
      // browser's "save page" dialog).
      if (key === 's') {
        event.preventDefault()
        this.toast.success('Your changes are saved in this browser.')
        return
      }

      const isUndo = key === 'z' && !event.shiftKey
      const isRedo = (key === 'z' && event.shiftKey) || key === 'y'
      if (!isUndo && !isRedo) return

      // While typing in a field, leave native text undo/redo alone; document-wide
      // history is driven by the toolbar buttons there. Outside fields, Ctrl+Z
      // steps the whole document.
      const el = event.target
      const tag = el && el.tagName ? el.tagName.toLowerCase() : ''
      const editable = tag === 'input' || tag === 'textarea' || tag === 'select' || (el && el.isContentEditable)
      if (editable) return

      event.preventDefault()
      if (isRedo) this.redo()
      else this.undo()
    },

    effectiveMaxWidth() {
      // Cap width to the viewport so the nav rail and preview always have room.
      return Math.max(this.minSidebarWidth, Math.min(this.maxSidebarWidth, window.innerWidth - 580))
    },

    clampToViewport() {
      this.windowWidth = window.innerWidth
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
        /* localStorage unavailable - ignore */
      }
    },

    resetSidebarWidth() {
      this.sidebarWidth = 320
      this.clampToViewport()
      try {
        localStorage.setItem(this.widthKey, String(this.sidebarWidth))
      } catch (error) {
        /* localStorage unavailable - ignore */
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick)
    window.addEventListener('resize', this.clampToViewport)
    window.addEventListener('keydown', this.handleShortcuts)
    // Reflect real save activity: pulse "Saving…" on change, settle to "Auto-saved".
    this._unsubscribeSave = this.store.$subscribe(() => {
      this.saveStatus = 'saving'
      clearTimeout(this._saveTimer)
      this._saveTimer = setTimeout(() => { this.saveStatus = 'saved' }, 700)
    })
    try {
      const saved = parseInt(localStorage.getItem(this.widthKey), 10)
      if (!Number.isNaN(saved)) {
        this.sidebarWidth = saved
      }
    } catch (error) {
      /* localStorage unavailable - ignore */
    }
    this.clampToViewport()
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick)
    window.removeEventListener('resize', this.clampToViewport)
    window.removeEventListener('keydown', this.handleShortcuts)
    document.removeEventListener('mousemove', this.onResize)
    document.removeEventListener('mouseup', this.stopResize)
    clearTimeout(this._saveTimer)
    if (this._unsubscribeSave) this._unsubscribeSave()
  }
}
</script>

<style scoped src="./DocumentEditorShell.css"></style>
