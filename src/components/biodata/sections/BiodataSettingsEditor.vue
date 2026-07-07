<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">Biodata Settings</h3>
    </div>

    <!-- Template Selection -->
    <div class="card">
      <h4 class="font-medium text-gray-900 mb-4">Template</h4>
      <div class="grid grid-cols-2 gap-4">
        <div v-for="template in templates"
             :key="template.id"
             @click="selectTemplate(template.id)"
             :class="['p-4 rounded-lg border-2 cursor-pointer transition-all duration-200',
                      biodataStore.settings.template === template.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300']">
          <div class="h-20 rounded mb-2" :class="template.preview"></div>
          <h5 class="font-medium text-sm">{{ template.name }}</h5>
          <p class="text-xs text-gray-600">{{ template.description }}</p>
        </div>
      </div>
    </div>

    <!-- Photo -->
    <div class="card">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="font-medium text-gray-900">Show Photo</h4>
          <p class="text-xs text-gray-600">Display a photo at the top of the biodata.</p>
        </div>
        <button @click="toggleShowPhoto"
                :class="['w-12 h-6 rounded-full flex items-center flex-shrink-0 transition-colors duration-200',
                         biodataStore.settings.showPhoto ? 'bg-primary-600' : 'bg-gray-300']">
          <div :class="['w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
                        biodataStore.settings.showPhoto ? 'translate-x-7' : 'translate-x-1']"></div>
        </button>
      </div>
    </div>

    <!-- Colors -->
    <div class="card">
      <h4 class="font-medium text-gray-900 mb-4">Colors</h4>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-700 mb-2">Primary Color</label>
          <div class="flex items-center space-x-3">
            <input type="color"
                   :value="biodataStore.settings.colorScheme.primary"
                   @input="updateColor('primary', $event.target.value)"
                   class="w-12 h-8 rounded border border-gray-300">
            <span class="text-sm text-gray-600">{{ biodataStore.settings.colorScheme.primary }}</span>
          </div>
        </div>
        <div>
          <label class="block text-sm text-gray-700 mb-2">Secondary Color</label>
          <div class="flex items-center space-x-3">
            <input type="color"
                   :value="biodataStore.settings.colorScheme.secondary"
                   @input="updateColor('secondary', $event.target.value)"
                   class="w-12 h-8 rounded border border-gray-300">
            <span class="text-sm text-gray-600">{{ biodataStore.settings.colorScheme.secondary }}</span>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <label class="block text-sm text-gray-700 mb-2">Quick Presets</label>
        <div class="flex space-x-2">
          <button v-for="preset in colorPresets"
                  :key="preset.name"
                  @click="applyColorPreset(preset)"
                  class="w-8 h-8 rounded border-2 border-white shadow-sm"
                  :style="{ background: `linear-gradient(45deg, ${preset.primary}, ${preset.secondary})` }"
                  :title="preset.name">
          </button>
        </div>
      </div>
    </div>

    <!-- Typography -->
    <div class="card">
      <h4 class="font-medium text-gray-900 mb-4">Typography</h4>
      <div class="space-y-4">
        <div>
          <label class="block text-sm text-gray-700 mb-2">Font Family</label>
          <select :value="biodataStore.settings.font"
                  @change="updateFont($event.target.value)"
                  class="input-field">
            <option value="Inter">Inter (Modern)</option>
            <option value="Merriweather">Merriweather (Serif)</option>
            <option value="Arial">Arial (Classic)</option>
            <option value="Times New Roman">Times New Roman (Traditional)</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-gray-700 mb-2">
            Font Size: {{ biodataStore.settings.fontSize }}px
          </label>
          <input type="range"
                 :value="biodataStore.settings.fontSize"
                 @input="updateFontSize($event.target.value)"
                 min="12"
                 max="18"
                 step="1"
                 class="w-full">
        </div>
      </div>
    </div>

    <!-- Section Visibility -->
    <div class="card">
      <h4 class="font-medium text-gray-900 mb-4">Sections</h4>
      <div class="space-y-3">
        <div v-for="section in sectionsConfig"
             :key="section.id"
             class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span class="font-medium">{{ section.name }}</span>
          <button @click="toggleSection(section.id)"
                  :class="['w-12 h-6 rounded-full flex items-center flex-shrink-0 transition-colors duration-200',
                           biodataStore.settings.sectionsEnabled[section.id]
                             ? 'bg-primary-600' : 'bg-gray-300']">
            <div :class="['w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
                          biodataStore.settings.sectionsEnabled[section.id]
                            ? 'translate-x-7' : 'translate-x-1']"></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Optional Fields -->
    <div class="card">
      <h4 class="font-medium text-gray-900 mb-4">Optional Fields</h4>
      <p class="text-xs text-gray-600 mb-3">Turn extra fields on to show them on the biodata.</p>
      <div class="space-y-3">
        <div v-for="field in fieldsConfig"
             :key="field.id"
             class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span class="font-medium text-sm">{{ field.name }}</span>
          <button @click="toggleField(field.id)"
                  :class="['w-12 h-6 rounded-full flex items-center flex-shrink-0 transition-colors duration-200',
                           biodataStore.settings.fieldsEnabled[field.id]
                             ? 'bg-primary-600' : 'bg-gray-300']">
            <div :class="['w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
                          biodataStore.settings.fieldsEnabled[field.id]
                            ? 'translate-x-7' : 'translate-x-1']"></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
      <button @click="resetSettings" class="btn-secondary">Reset to Default</button>
    </div>
  </div>
</template>

<script>
import { useBiodataStore } from '../../../stores/biodata'
import { useToast } from 'vue-toastification'

export default {
  name: 'BiodataSettingsEditor',
  setup() {
    const biodataStore = useBiodataStore()
    const toast = useToast()
    return { biodataStore, toast }
  },
  data() {
    return {
      templates: [
        {
          id: 'elegant',
          name: 'Elegant',
          description: 'Formal matrimonial layout',
          preview: 'bg-gradient-to-br from-rose-700 to-red-900'
        }
      ],
      colorPresets: [
        { name: 'Maroon', primary: '#a61c3c', secondary: '#7a142c' },
        { name: 'Royal Navy', primary: '#1e3a8a', secondary: '#1e40af' },
        { name: 'Emerald', primary: '#047857', secondary: '#065f46' },
        { name: 'Deep Purple', primary: '#6d28d9', secondary: '#5b21b6' },
        { name: 'Charcoal', primary: '#374151', secondary: '#1f2937' }
      ],
      sectionsConfig: [
        { id: 'personalInfo', name: 'Personal Information' },
        { id: 'education', name: 'Educational Qualification' },
        { id: 'professional', name: 'Professional Details' },
        { id: 'family', name: 'Family Information' },
        { id: 'contact', name: 'Contact' },
        { id: 'preferences', name: 'Partner Preferences' }
      ],
      fieldsConfig: [
        { id: 'maritalStatus', name: 'Marital Status' },
        { id: 'nationality', name: 'Nationality' },
        { id: 'motherTongue', name: 'Mother Tongue' },
        { id: 'sect', name: 'Sect / Madhab' },
        { id: 'income', name: 'Monthly Income' },
        { id: 'siblings', name: 'Siblings' },
        { id: 'homeDistrict', name: 'Home District' },
        { id: 'guardianPhone', name: "Guardian's Contact" },
        { id: 'email', name: 'Email' }
      ]
    }
  },
  methods: {
    selectTemplate(id) {
      this.biodataStore.updateSettings({ template: id })
      this.toast.success('Template updated!')
    },
    toggleShowPhoto() {
      this.biodataStore.updateSettings({ showPhoto: !this.biodataStore.settings.showPhoto })
    },
    updateColor(type, value) {
      this.biodataStore.updateColorScheme({ [type]: value })
    },
    applyColorPreset(preset) {
      this.biodataStore.updateColorScheme({ primary: preset.primary, secondary: preset.secondary })
      this.toast.success(`${preset.name} colors applied!`)
    },
    updateFont(font) {
      this.biodataStore.updateSettings({ font })
    },
    updateFontSize(size) {
      this.biodataStore.updateSettings({ fontSize: parseInt(size) })
    },
    toggleSection(id) {
      this.biodataStore.toggleSection(id)
    },
    toggleField(id) {
      this.biodataStore.toggleField(id)
    },
    resetSettings() {
      if (confirm('Reset all biodata settings to default?')) {
        this.biodataStore.updateSettings({
          template: 'elegant',
          colorScheme: {
            primary: '#a61c3c',
            secondary: '#7a142c',
            accent: '#d4a017',
            text: '#1f2937',
            background: '#ffffff'
          },
          font: 'Inter',
          fontSize: 14
        })
        this.toast.success('Settings reset to default!')
      }
    }
  }
}
</script>
