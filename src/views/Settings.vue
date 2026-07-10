<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <!-- Header -->
    <header class="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <router-link to="/" class="text-xl font-bold text-primary-600">
            Resume Builder
          </router-link>
          <div class="flex items-center space-x-3 sm:space-x-4">
            <ThemeToggle />
            <router-link to="/editor" class="btn-primary">
              Back to Editor
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">Settings</h1>
        <p class="text-gray-600 dark:text-slate-400">Customize your resume builder experience</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Settings Navigation -->
        <div class="lg:col-span-1">
          <nav class="space-y-2">
            <button v-for="section in settingSections" 
                    :key="section.id"
                    @click="activeSection = section.id"
                    :class="['w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200',
                             activeSection === section.id
                               ? 'bg-primary-100 text-primary-700 border border-primary-200 dark:bg-primary-500/20 dark:text-primary-200 dark:border-primary-500/30'
                               : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700']">
              <component :is="section.icon" class="w-5 h-5" />
              <span class="font-medium">{{ section.name }}</span>
            </button>
          </nav>
        </div>

        <!-- Settings Content -->
        <div class="lg:col-span-2">
          <!-- Appearance Settings -->
          <div v-if="activeSection === 'appearance'" class="card">
            <h3 class="section-title">Appearance Settings</h3>
            
            <!-- Theme Selection -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">Theme</label>
              <div class="grid grid-cols-2 gap-4">
                <button v-for="theme in themes" 
                        :key="theme.id"
                        @click="setTheme(theme.id)"
                        :class="['p-4 rounded-lg border-2 transition-all duration-200',
                                 resumeStore.ui.theme === theme.id 
                                   ? 'border-primary-500 bg-primary-50' 
                                   : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:border-slate-600']">
                  <div class="flex items-center space-x-3">
                    <div :class="['w-4 h-4 rounded-full', theme.color]"></div>
                    <span class="font-medium">{{ theme.name }}</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Color Scheme -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">Color Scheme</label>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs text-gray-600 dark:text-slate-400 mb-1">Primary Color</label>
                  <input type="color" 
                         v-model="resumeStore.settings.colorScheme.primary"
                         class="w-full h-10 rounded border border-gray-300 dark:border-slate-600">
                </div>
                <div>
                  <label class="block text-xs text-gray-600 dark:text-slate-400 mb-1">Secondary Color</label>
                  <input type="color" 
                         v-model="resumeStore.settings.colorScheme.secondary"
                         class="w-full h-10 rounded border border-gray-300 dark:border-slate-600">
                </div>
              </div>
            </div>

            <!-- Font Selection -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">Font Family</label>
              <BaseSelect
                v-model="resumeStore.settings.font"
                :options="[
                  { value: 'Inter', label: 'Inter (Modern)' },
                  { value: 'Merriweather', label: 'Merriweather (Serif)' },
                  { value: 'JetBrains Mono', label: 'JetBrains Mono (Monospace)' },
                  { value: 'Arial', label: 'Arial (Classic)' },
                  { value: 'Times New Roman', label: 'Times New Roman (Traditional)' }
                ]" />
            </div>

            <!-- Font Size -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                Font Size: {{ resumeStore.settings.fontSize }}px
              </label>
              <input type="range" 
                     v-model="resumeStore.settings.fontSize"
                     min="12" 
                     max="18" 
                     step="1"
                     class="w-full">
            </div>
          </div>

          <!-- Layout Settings -->
          <div v-if="activeSection === 'layout'" class="card">
            <h3 class="section-title">Layout Settings</h3>
            
            <!-- Sections Order -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">Sections Order</label>
              <draggable v-model="resumeStore.settings.sectionsOrder" 
                         item-key="id"
                         class="space-y-2">
                <template #item="{ element }">
                  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg border border-gray-200 dark:border-slate-700">
                    <div class="flex items-center space-x-3">
                      <Bars3Icon class="w-5 h-5 text-gray-400 dark:text-slate-500 cursor-move" />
                      <span class="font-medium capitalize">{{ element.replace(/([A-Z])/g, ' $1').trim() }}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <button @click="toggleSection(element)"
                              :class="['w-10 h-6 rounded-full transition-colors duration-200',
                                       resumeStore.settings.sectionsEnabled[element] 
                                         ? 'bg-primary-600' 
                                         : 'bg-gray-300']">
                        <div :class="['w-4 h-4 bg-white dark:bg-slate-800 rounded-full shadow transition-transform duration-200',
                                      resumeStore.settings.sectionsEnabled[element] 
                                        ? 'translate-x-5' 
                                        : 'translate-x-1']"></div>
                      </button>
                    </div>
                  </div>
                </template>
              </draggable>
            </div>

            <!-- Spacing -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">Section Spacing</label>
              <BaseSelect
                v-model="resumeStore.settings.spacing"
                :options="[
                  { value: 'compact', label: 'Compact' },
                  { value: 'normal', label: 'Normal' },
                  { value: 'relaxed', label: 'Relaxed' }
                ]" />
            </div>
          </div>

          <!-- Export Settings -->
          <div v-if="activeSection === 'export'" class="card">
            <h3 class="section-title">Export Settings</h3>
            
            <!-- PDF Options -->
            <div class="mb-6">
              <h4 class="font-medium text-gray-900 dark:text-slate-100 mb-3">PDF Export Options</h4>
              <div class="space-y-3">
                <label class="flex items-center space-x-3">
                  <input type="checkbox" v-model="pdfSettings.includeColors" class="rounded">
                  <span class="text-sm text-gray-700 dark:text-slate-300">Include colors in PDF</span>
                </label>
                <label class="flex items-center space-x-3">
                  <input type="checkbox" v-model="pdfSettings.highQuality" class="rounded">
                  <span class="text-sm text-gray-700 dark:text-slate-300">High quality images</span>
                </label>
                <label class="flex items-center space-x-3">
                  <input type="checkbox" v-model="pdfSettings.optimizeSize" class="rounded">
                  <span class="text-sm text-gray-700 dark:text-slate-300">Optimize file size</span>
                </label>
              </div>
            </div>

            <!-- Page Settings -->
            <div class="mb-6">
              <h4 class="font-medium text-gray-900 dark:text-slate-100 mb-3">Page Settings</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-700 dark:text-slate-300 mb-1">Paper Size</label>
                  <BaseSelect
                    v-model="pdfSettings.paperSize"
                    :options="['A4', 'Letter', 'Legal']" />
                </div>
                <div>
                  <label class="block text-sm text-gray-700 dark:text-slate-300 mb-1">Orientation</label>
                  <BaseSelect
                    v-model="pdfSettings.orientation"
                    :options="[
                      { value: 'portrait', label: 'Portrait' },
                      { value: 'landscape', label: 'Landscape' }
                    ]" />
                </div>
              </div>
            </div>
          </div>

          <!-- Data Management -->
          <div v-if="activeSection === 'data'" class="card">
            <h3 class="section-title">Data Management</h3>
            
            <!-- Auto-save -->
            <div class="mb-6">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-slate-100">Auto-save</h4>
                  <p class="text-sm text-gray-600 dark:text-slate-400">Automatically save your changes</p>
                </div>
                <button @click="toggleAutoSave"
                        :class="['w-12 h-6 rounded-full transition-colors duration-200',
                                 autoSaveEnabled ? 'bg-primary-600' : 'bg-gray-300']">
                  <div :class="['w-4 h-4 bg-white dark:bg-slate-800 rounded-full shadow transition-transform duration-200',
                                autoSaveEnabled ? 'translate-x-7' : 'translate-x-1']"></div>
                </button>
              </div>
            </div>

            <!-- Data Actions -->
            <div class="space-y-4">
              <div class="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 dark:text-slate-100 mb-2">Export Data</h4>
                <p class="text-sm text-gray-600 dark:text-slate-400 mb-3">Download your resume data as JSON file</p>
                <button @click="exportData" class="btn-secondary">
                  Export Data
                </button>
              </div>

              <div class="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 dark:text-slate-100 mb-2">Import Data</h4>
                <p class="text-sm text-gray-600 dark:text-slate-400 mb-3">Import resume data from JSON file</p>
                <input type="file" 
                       @change="handleFileImport" 
                       accept=".json"
                       class="hidden" 
                       ref="fileInput">
                <button @click="$refs.fileInput.click()" class="btn-secondary">
                  Import Data
                </button>
              </div>

              <div class="border border-red-200 rounded-lg p-4 bg-red-50">
                <h4 class="font-medium text-red-900 mb-2">Reset Data</h4>
                <p class="text-sm text-red-600 mb-3">Reset all data to default values (cannot be undone)</p>
                <button @click="confirmReset" class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                  Reset All Data
                </button>
              </div>
            </div>
          </div>

          <!-- Privacy Settings -->
          <div v-if="activeSection === 'privacy'" class="card">
            <h3 class="section-title">Privacy Settings</h3>
            
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-slate-100">Analytics</h4>
                  <p class="text-sm text-gray-600 dark:text-slate-400">Help improve the app by sharing usage data</p>
                </div>
                <button @click="toggleAnalytics"
                        :class="['w-12 h-6 rounded-full transition-colors duration-200',
                                 analyticsEnabled ? 'bg-primary-600' : 'bg-gray-300']">
                  <div :class="['w-4 h-4 bg-white dark:bg-slate-800 rounded-full shadow transition-transform duration-200',
                                analyticsEnabled ? 'translate-x-7' : 'translate-x-1']"></div>
                </button>
              </div>

              <div class="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 dark:text-slate-100 mb-2">Data Storage</h4>
                <p class="text-sm text-gray-600 dark:text-slate-400">Your resume data is stored locally in your browser and never sent to our servers without your explicit consent.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reset Confirmation Modal -->
    <div v-if="showResetModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-red-900 mb-4">Confirm Reset</h3>
        <p class="text-gray-600 dark:text-slate-400 mb-6">
          Are you sure you want to reset all data? This action cannot be undone and will permanently delete all your resume information.
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="showResetModal = false" class="btn-secondary">
            Cancel
          </button>
          <button @click="resetAllData" class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
            Reset All Data
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useResumeStore } from '../stores/resume'
import { useToast } from 'vue-toastification'
import draggable from 'vuedraggable'
import { saveAs } from 'file-saver'
import { 
  PaintBrushIcon, 
  DocumentTextIcon, 
  CloudArrowDownIcon, 
  ShieldCheckIcon,
  ViewColumnsIcon,
  Bars3Icon
} from '@heroicons/vue/24/outline'

export default {
  name: 'Settings',
  components: {
    draggable,
    PaintBrushIcon,
    DocumentTextIcon,
    CloudArrowDownIcon,
    ShieldCheckIcon,
    ViewColumnsIcon,
    Bars3Icon
  },
  setup() {
    const resumeStore = useResumeStore()
    const toast = useToast()
    
    return { resumeStore, toast }
  },
  data() {
    return {
      activeSection: 'appearance',
      showResetModal: false,
      autoSaveEnabled: true,
      analyticsEnabled: false,
      settingSections: [
        { id: 'appearance', name: 'Appearance', icon: 'PaintBrushIcon' },
        { id: 'layout', name: 'Layout', icon: 'ViewColumnsIcon' },
        { id: 'export', name: 'Export', icon: 'CloudArrowDownIcon' },
        { id: 'data', name: 'Data', icon: 'DocumentTextIcon' },
        { id: 'privacy', name: 'Privacy', icon: 'ShieldCheckIcon' }
      ],
      themes: [
        { id: 'light', name: 'Light', color: 'bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600' },
        { id: 'dark', name: 'Dark', color: 'bg-gray-800' }
      ],
      pdfSettings: {
        includeColors: true,
        highQuality: true,
        optimizeSize: false,
        paperSize: 'A4',
        orientation: 'portrait'
      }
    }
  },
  methods: {
    setTheme(theme) {
      this.resumeStore.setTheme(theme)
      this.toast.success(`Theme changed to ${theme}`)
    },
    
    toggleSection(section) {
      this.resumeStore.toggleSection(section)
    },
    
    toggleAutoSave() {
      this.autoSaveEnabled = !this.autoSaveEnabled
      this.toast.success(`Auto-save ${this.autoSaveEnabled ? 'enabled' : 'disabled'}`)
    },
    
    toggleAnalytics() {
      this.analyticsEnabled = !this.analyticsEnabled
      this.toast.success(`Analytics ${this.analyticsEnabled ? 'enabled' : 'disabled'}`)
    },
    
    exportData() {
      const data = this.resumeStore.exportData()
      const blob = new Blob([data], { type: 'application/json' })
      saveAs(blob, `${this.resumeStore.fullName}_resume_data.json`)
      this.toast.success('Resume data exported successfully!')
    },
    
    handleFileImport(event) {
      const file = event.target.files[0]
      if (!file) return
      
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const jsonData = e.target.result
          if (this.resumeStore.importData(jsonData)) {
            this.toast.success('Resume data imported successfully!')
          } else {
            this.toast.error('Invalid JSON data. Please check your file.')
          }
        } catch (error) {
          this.toast.error('Error reading file. Please try again.')
        }
      }
      reader.readAsText(file)
    },
    
    confirmReset() {
      this.showResetModal = true
    },
    
    resetAllData() {
      this.resumeStore.resetToDefaults()
      this.showResetModal = false
      this.toast.success('All data has been reset to defaults')
    }
  }
}
</script>