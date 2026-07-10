<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100">Resume Settings</h3>
    </div>

    <!-- Template Selection -->
    <div class="card">
      <h4 class="font-medium text-gray-900 dark:text-slate-100 mb-4">Template</h4>
      <div class="grid grid-cols-2 gap-4">
        <div v-for="template in templates" 
             :key="template.id"
             @click="selectTemplate(template.id)"
             :class="['p-4 rounded-lg border-2 cursor-pointer transition-all duration-200',
                      resumeStore.settings.template === template.id 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:border-slate-600']">
          <div class="h-20 rounded mb-2" :class="template.preview"></div>
          <h5 class="font-medium text-sm">{{ template.name }}</h5>
          <p class="text-xs text-gray-600 dark:text-slate-400">{{ template.description }}</p>
        </div>
      </div>
    </div>

    <!-- Color Customization -->
    <div class="card">
      <h4 class="font-medium text-gray-900 dark:text-slate-100 mb-4">Colors</h4>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-700 dark:text-slate-300 mb-2">Primary Color</label>
          <div class="flex items-center space-x-3">
            <input type="color" 
                   :value="resumeStore.settings.colorScheme.primary"
                   @input="updateColor('primary', $event.target.value)"
                   class="w-12 h-8 rounded border border-gray-300 dark:border-slate-600">
            <span class="text-sm text-gray-600 dark:text-slate-400">{{ resumeStore.settings.colorScheme.primary }}</span>
          </div>
        </div>
        <div>
          <label class="block text-sm text-gray-700 dark:text-slate-300 mb-2">Secondary Color</label>
          <div class="flex items-center space-x-3">
            <input type="color" 
                   :value="resumeStore.settings.colorScheme.secondary"
                   @input="updateColor('secondary', $event.target.value)"
                   class="w-12 h-8 rounded border border-gray-300 dark:border-slate-600">
            <span class="text-sm text-gray-600 dark:text-slate-400">{{ resumeStore.settings.colorScheme.secondary }}</span>
          </div>
        </div>
      </div>
      
      <!-- Preset Colors -->
      <div class="mt-4">
        <label class="block text-sm text-gray-700 dark:text-slate-300 mb-2">Quick Presets</label>
        <div class="flex space-x-2">
          <button v-for="preset in colorPresets" 
                  :key="preset.name"
                  @click="applyColorPreset(preset)"
                  :class="['w-8 h-8 rounded border-2 border-white shadow-sm']"
                  :style="{ background: `linear-gradient(45deg, ${preset.primary}, ${preset.secondary})` }"
                  :title="preset.name">
          </button>
        </div>
      </div>
    </div>

    <!-- Typography -->
    <div class="card">
      <h4 class="font-medium text-gray-900 dark:text-slate-100 mb-4">Typography</h4>
      <div class="space-y-4">
        <div>
          <label class="block text-sm text-gray-700 dark:text-slate-300 mb-2">Font Family</label>
          <BaseSelect
            :model-value="resumeStore.settings.font"
            @update:model-value="updateFont($event)"
            :options="[
              { value: 'Inter', label: 'Inter (Modern)' },
              { value: 'Roboto', label: 'Roboto (Clean)' },
              { value: 'Lato', label: 'Lato (Professional)' },
              { value: 'Open Sans', label: 'Open Sans (Neutral)' },
              { value: 'Merriweather', label: 'Merriweather (Serif)' },
              { value: 'Georgia', label: 'Georgia (Serif)' },
              { value: 'EB Garamond', label: 'Garamond (Elegant)' },
              { value: 'JetBrains Mono', label: 'JetBrains Mono (Monospace)' },
              { value: 'Arial', label: 'Arial (Classic)' },
              { value: 'Times New Roman', label: 'Times New Roman (Traditional)' }
            ]" />
        </div>
        
        <div>
          <label class="block text-sm text-gray-700 dark:text-slate-300 mb-2">
            Font Size: {{ resumeStore.settings.fontSize }}px
          </label>
          <input type="range" 
                 :value="resumeStore.settings.fontSize"
                 @input="updateFontSize($event.target.value)"
                 min="12" 
                 max="18" 
                 step="1"
                 class="w-full">
        </div>
      </div>
    </div>

    <!-- Section Management -->
    <div class="card">
      <h4 class="font-medium text-gray-900 dark:text-slate-100 mb-4">Section Visibility</h4>
      <div class="space-y-3">
        <div v-for="section in sectionsConfig" 
             :key="section.id"
             class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg">
          <div class="flex items-center space-x-3">
            <component :is="section.icon" class="w-5 h-5 text-gray-600 dark:text-slate-400" />
            <span class="font-medium">{{ section.name }}</span>
          </div>
          <button @click="toggleSection(section.id)"
                  :class="['w-12 h-6 rounded-full transition-colors duration-200',
                           resumeStore.settings.sectionsEnabled[section.id] 
                             ? 'bg-primary-600' 
                             : 'bg-gray-300']">
            <div :class="['w-4 h-4 bg-white dark:bg-slate-800 rounded-full shadow transition-transform duration-200',
                          resumeStore.settings.sectionsEnabled[section.id] 
                            ? 'translate-x-7' 
                            : 'translate-x-1']"></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-slate-700">
      <button @click="resetSettings" class="btn-secondary">
        Reset to Default
      </button>
      <button @click="saveSettings" class="btn-primary">
        Save Settings
      </button>
    </div>
  </div>
</template>

<script>
import { useResumeStore } from '../../stores/resume'
import { useToast } from 'vue-toastification'
import {
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  FolderIcon,
  TrophyIcon,
  LanguageIcon,
  BookOpenIcon,
  PresentationChartBarIcon,
  MicrophoneIcon,
  StarIcon,
  ClipboardDocumentCheckIcon,
  IdentificationIcon,
  UserGroupIcon,
  SparklesIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'SettingsEditor',
  components: {
    UserIcon,
    BriefcaseIcon,
    AcademicCapIcon,
    WrenchScrewdriverIcon,
    FolderIcon,
    TrophyIcon,
    LanguageIcon,
    BookOpenIcon,
    PresentationChartBarIcon,
    MicrophoneIcon,
    StarIcon,
    ClipboardDocumentCheckIcon,
    IdentificationIcon,
    UserGroupIcon,
    SparklesIcon,
    DocumentTextIcon
  },
  setup() {
    const resumeStore = useResumeStore()
    const toast = useToast()
    
    return { resumeStore, toast }
  },
  data() {
    return {
      templates: [
        {
          id: 'modern',
          name: 'Modern',
          description: 'Clean and contemporary',
          preview: 'bg-gradient-to-br from-blue-500 to-purple-600'
        },
        {
          id: 'classic',
          name: 'Classic',
          description: 'Traditional and professional',
          preview: 'bg-gradient-to-br from-gray-600 to-gray-800'
        },
        {
          id: 'creative',
          name: 'Creative',
          description: 'Bold and colorful',
          preview: 'bg-gradient-to-br from-pink-500 to-orange-500'
        },
        {
          id: 'minimalist',
          name: 'Minimalist',
          description: 'Simple and elegant',
          preview: 'bg-gradient-to-br from-teal-500 to-green-500'
        },
        {
          id: 'ats',
          name: 'Clean ATS',
          description: 'Single-column, ATS-friendly',
          preview: 'bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600'
        },
        {
          id: 'developer',
          name: 'Developer',
          description: 'Compact single-column: links row, skills by category, projects',
          preview: 'bg-gradient-to-br from-slate-100 to-white dark:from-slate-700 dark:to-slate-800 border border-gray-300 dark:border-slate-600'
        },
        {
          id: 'sidebar',
          name: 'Sidebar',
          description: 'Two-column with side panel',
          preview: 'bg-gradient-to-r from-gray-200 from-35% to-white to-35%'
        },
        {
          id: 'academic',
          name: 'Academic CV',
          description: 'Serif, margin dates, scholarly',
          preview: 'bg-gradient-to-br from-lime-700 to-yellow-700'
        },
        {
          id: 'colorful',
          name: 'Colorful',
          description: 'Accent header, chips & bars',
          preview: 'bg-gradient-to-br from-indigo-500 to-fuchsia-500'
        },
        {
          id: 'corporate',
          name: 'Corporate CV',
          description: 'Multi-page CV: header, tables, personal details & references',
          preview: 'bg-gradient-to-br from-slate-700 to-blue-900'
        },
        {
          id: 'researcher',
          name: 'Researcher CV',
          description: 'Clean academic CV with publications',
          preview: 'bg-gradient-to-br from-stone-100 to-stone-300 border border-gray-300 dark:border-slate-600'
        },
        {
          id: 'academicPortfolio',
          name: 'Academic Portfolio',
          description: 'Margin labels, numbered publications',
          preview: 'bg-gradient-to-br from-blue-100 to-indigo-200 border border-gray-300 dark:border-slate-600'
        }
      ],
      colorPresets: [
        { name: 'Blue Ocean', primary: '#3b82f6', secondary: '#06b6d4' },
        { name: 'Green Forest', primary: '#10b981', secondary: '#14b8a6' },
        { name: 'Purple Sunset', primary: '#8b5cf6', secondary: '#ec4899' },
        { name: 'Orange Fire', primary: '#f59e0b', secondary: '#ef4444' },
        { name: 'Gray Professional', primary: '#6b7280', secondary: '#374151' }
      ],
      sectionsConfig: [
        { id: 'personalInfo', name: 'Personal Info', icon: 'UserIcon' },
        { id: 'experience', name: 'Experience', icon: 'BriefcaseIcon' },
        { id: 'education', name: 'Education', icon: 'AcademicCapIcon' },
        { id: 'publications', name: 'Publications', icon: 'BookOpenIcon' },
        { id: 'teaching', name: 'Teaching', icon: 'PresentationChartBarIcon' },
        { id: 'talks', name: 'Invited Talks', icon: 'MicrophoneIcon' },
        { id: 'awards', name: 'Honors & Awards', icon: 'StarIcon' },
        { id: 'service', name: 'Academic Service', icon: 'ClipboardDocumentCheckIcon' },
        { id: 'skills', name: 'Skills', icon: 'WrenchScrewdriverIcon' },
        { id: 'projects', name: 'Projects', icon: 'FolderIcon' },
        { id: 'certifications', name: 'Certifications', icon: 'TrophyIcon' },
        { id: 'languages', name: 'Languages', icon: 'LanguageIcon' },
        { id: 'training', name: 'Training', icon: 'AcademicCapIcon' },
        { id: 'accomplishments', name: 'Accomplishments', icon: 'TrophyIcon' },
        { id: 'extracurricular', name: 'Extra-Curricular', icon: 'SparklesIcon' },
        { id: 'personalDetails', name: 'Personal Details', icon: 'IdentificationIcon' },
        { id: 'references', name: 'References', icon: 'UserGroupIcon' },
        { id: 'declaration', name: 'Declaration', icon: 'DocumentTextIcon' }
      ]
    }
  },
  methods: {
    selectTemplate(templateId) {
      this.resumeStore.updateSettings({ template: templateId })
      this.toast.success('Template updated!')
    },
    
    updateColor(colorType, value) {
      this.resumeStore.updateColorScheme({ [colorType]: value })
    },
    
    applyColorPreset(preset) {
      this.resumeStore.updateColorScheme({
        primary: preset.primary,
        secondary: preset.secondary
      })
      this.toast.success(`${preset.name} color scheme applied!`)
    },
    
    updateFont(font) {
      this.resumeStore.updateSettings({ font })
    },
    
    updateFontSize(size) {
      this.resumeStore.updateSettings({ fontSize: parseInt(size) })
    },
    
    toggleSection(sectionId) {
      this.resumeStore.toggleSection(sectionId)
    },
    
    resetSettings() {
      const confirmReset = confirm('Are you sure you want to reset all settings to default?')
      if (confirmReset) {
        // Reset to default settings
        this.resumeStore.updateSettings({
          template: 'modern',
          colorScheme: {
            primary: '#3b82f6',
            secondary: '#14b8a6',
            accent: '#f59e0b',
            text: '#1f2937',
            background: '#ffffff'
          },
          font: 'Inter',
          fontSize: 14,
          spacing: 'normal'
        })
        this.toast.success('Settings reset to default!')
      }
    },
    
    saveSettings() {
      this.toast.success('Settings saved!')
    }
  }
}
</script>