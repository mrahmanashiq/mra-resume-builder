<template>
  <div class="download-panel px-2 pt-1">
    <p class="px-2 pb-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide dark:text-slate-400">File type</p>

    <!-- Selected format (click to choose another) -->
    <button type="button" @click="expanded = !expanded"
            class="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-left hover:border-primary-400 transition-colors dark:border-slate-600">
      <component :is="selected.icon" class="w-4 h-4 text-gray-600 flex-shrink-0 dark:text-slate-400" />
      <span class="flex items-center gap-2 flex-1 min-w-0">
        <span class="font-medium text-gray-800 dark:text-slate-100 truncate">{{ selected.label }}</span>
        <span v-if="selected.recommended" class="badge-rec">Recommended</span>
      </span>
      <ChevronDownIcon class="w-4 h-4 text-gray-500 flex-shrink-0 transition-transform" :class="{ 'rotate-180': expanded }" />
    </button>

    <!-- Format list -->
    <div v-if="expanded" class="mt-1 border border-gray-200 rounded-lg overflow-hidden dark:border-slate-700">
      <button v-for="f in formats" :key="f.id" type="button" @click="select(f.id)"
              class="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-gray-50 dark:hover:bg-slate-700"
              :class="f.id === selectedId ? 'bg-primary-50 dark:bg-primary-900/20' : ''">
        <component :is="f.icon" class="w-4 h-4 text-gray-600 flex-shrink-0 dark:text-slate-400" />
        <span class="flex-1 min-w-0">
          <span class="flex items-center gap-2">
            <span class="font-medium text-gray-800 dark:text-slate-100">{{ f.label }}</span>
            <span v-if="f.recommended" class="badge-rec">Recommended</span>
          </span>
          <span class="block text-xs text-gray-500 dark:text-slate-400">{{ f.desc }}</span>
        </span>
        <CheckIcon v-if="f.id === selectedId" class="w-4 h-4 text-primary-600 flex-shrink-0 dark:text-primary-300" />
      </button>
    </div>

    <!-- Selected format description (when collapsed) -->
    <p v-else class="px-3 pt-1.5 text-xs text-gray-500 dark:text-slate-400">{{ selected.desc }}</p>

    <button type="button" @click="$emit('download', selectedId)" class="btn-primary w-full mt-3">
      Download
    </button>
  </div>
</template>

<script>
import {
  DocumentArrowDownIcon,
  DocumentTextIcon,
  Bars3Icon,
  PhotoIcon,
  ChevronDownIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'

const TEXT_FORMATS = [
  { id: 'pdf', label: 'PDF - exact design', desc: 'Pixel-perfect to the template. Best for printing and sharing.', icon: 'DocumentArrowDownIcon', recommended: true },
  { id: 'text-pdf', label: 'PDF - selectable text', desc: 'Selectable and ATS-friendly. Best for online job applications.', icon: 'DocumentArrowDownIcon' },
  { id: 'word', label: 'Word (.doc)', desc: 'Editable in Word or Google Docs.', icon: 'DocumentTextIcon' },
  { id: 'txt', label: 'Plain text (.txt)', desc: 'Paste into online application forms.', icon: 'Bars3Icon' },
  { id: 'png', label: 'PNG image', desc: 'High-quality image.', icon: 'PhotoIcon' },
  { id: 'jpg', label: 'JPG image', desc: 'Smaller image file.', icon: 'PhotoIcon' }
]

const IMAGE_FORMATS = [
  { id: 'pdf', label: 'PDF', desc: 'Print-ready. Best for sharing and printing.', icon: 'DocumentArrowDownIcon', recommended: true },
  { id: 'png', label: 'PNG image', desc: 'High-quality image.', icon: 'PhotoIcon' },
  { id: 'jpg', label: 'JPG image', desc: 'Smaller image file.', icon: 'PhotoIcon' }
]

export default {
  name: 'DownloadPanel',
  components: { DocumentArrowDownIcon, DocumentTextIcon, Bars3Icon, PhotoIcon, ChevronDownIcon, CheckIcon },
  props: {
    supportsText: { type: Boolean, default: false }
  },
  emits: ['download'],
  data() {
    return {
      expanded: false,
      // Default to the recommended format for each type (both are 'pdf').
      selectedId: 'pdf'
    }
  },
  computed: {
    formats() {
      return this.supportsText ? TEXT_FORMATS : IMAGE_FORMATS
    },
    selected() {
      return this.formats.find((f) => f.id === this.selectedId) || this.formats[0]
    }
  },
  methods: {
    select(id) {
      this.selectedId = id
      this.expanded = false
    }
  }
}
</script>

<style scoped src="./DownloadPanel.css"></style>
