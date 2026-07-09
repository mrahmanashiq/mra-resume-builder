<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100">Biodata Settings</h3>
    </div>

    <!-- Title -->
    <div class="card">
      <h4 class="font-medium text-gray-900 dark:text-slate-100 mb-4">Title</h4>
      <input type="text"
             :value="biodataStore.settings.title"
             @input="updateTitle($event.target.value)"
             class="input-field"
             placeholder="Marriage Biodata">
      <p class="text-xs text-gray-500 dark:text-slate-400 mt-1">
        Tip: <span class="font-medium">{name}</span>, <span class="font-medium">{firstName}</span>, <span class="font-medium">{lastName}</span> are replaced with the person's name.
      </p>
      <div class="flex flex-wrap gap-2 mt-3">
        <button v-for="t in titlePresets"
                :key="t"
                @click="applyTitlePreset(t)"
                :class="['px-3 py-1 text-sm rounded-full border transition-colors',
                         biodataStore.settings.title === t
                           ? 'border-primary-500 text-primary-600 bg-primary-50'
                           : 'border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:border-gray-400']">
          {{ t }}
        </button>
      </div>

      <div class="flex items-center justify-between mt-5">
        <div>
          <h5 class="font-medium text-gray-900 dark:text-slate-100 text-sm">Bismillah line</h5>
          <p class="text-xs text-gray-600 dark:text-slate-400">Show a Bismillah above the title.</p>
        </div>
        <button @click="toggleBismillah"
                :class="['w-12 h-6 rounded-full flex items-center flex-shrink-0 transition-colors duration-200',
                         biodataStore.settings.showBismillah ? 'bg-primary-600' : 'bg-gray-300']">
          <div :class="['w-4 h-4 bg-white dark:bg-slate-800 rounded-full shadow transition-transform duration-200',
                        biodataStore.settings.showBismillah ? 'translate-x-7' : 'translate-x-1']"></div>
        </button>
      </div>
      <div v-if="biodataStore.settings.showBismillah" class="mt-3">
        <label class="block text-sm text-gray-700 dark:text-slate-300 mb-2">Bismillah style</label>
        <BaseSelect :model-value="biodataStore.settings.bismillahStyle"
                    @update:model-value="updateBismillahStyle($event)"
                    :options="[
                      { value: 'bengali', label: 'Bengali - বিসমিল্লাহির রাহমানির রাহিম' },
                      { value: 'arabic', label: 'Arabic - بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' }
                    ]" />
      </div>
    </div>

    <!-- Template Selection -->
    <div class="card">
      <h4 class="font-medium text-gray-900 dark:text-slate-100 mb-4">Template</h4>
      <div class="grid grid-cols-2 gap-4">
        <div v-for="template in templates"
             :key="template.id"
             @click="selectTemplate(template.id)"
             :class="['p-4 rounded-lg border-2 cursor-pointer transition-all duration-200',
                      biodataStore.settings.template === template.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:border-slate-600']">
          <div class="h-20 rounded mb-2" :class="template.preview"></div>
          <h5 class="font-medium text-sm">{{ template.name }}</h5>
          <p class="text-xs text-gray-600 dark:text-slate-400">{{ template.description }}</p>
        </div>
      </div>
    </div>

    <!-- Photo -->
    <div class="card">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="font-medium text-gray-900 dark:text-slate-100">Show Photo</h4>
          <p class="text-xs text-gray-600 dark:text-slate-400">Display a photo at the top of the biodata.</p>
        </div>
        <button @click="toggleShowPhoto"
                :class="['w-12 h-6 rounded-full flex items-center flex-shrink-0 transition-colors duration-200',
                         biodataStore.settings.showPhoto ? 'bg-primary-600' : 'bg-gray-300']">
          <div :class="['w-4 h-4 bg-white dark:bg-slate-800 rounded-full shadow transition-transform duration-200',
                        biodataStore.settings.showPhoto ? 'translate-x-7' : 'translate-x-1']"></div>
        </button>
      </div>
      <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div>
          <h4 class="font-medium text-gray-900 dark:text-slate-100">Blood Group as (+ve) / (-ve)</h4>
          <p class="text-xs text-gray-600 dark:text-slate-400">Show "O+" as "O (+ve)".</p>
        </div>
        <button @click="toggleBloodGroupVe"
                :class="['w-12 h-6 rounded-full flex items-center flex-shrink-0 transition-colors duration-200',
                         biodataStore.settings.bloodGroupVe ? 'bg-primary-600' : 'bg-gray-300']">
          <div :class="['w-4 h-4 bg-white dark:bg-slate-800 rounded-full shadow transition-transform duration-200',
                        biodataStore.settings.bloodGroupVe ? 'translate-x-7' : 'translate-x-1']"></div>
        </button>
      </div>
    </div>

    <!-- Colors -->
    <div class="card">
      <h4 class="font-medium text-gray-900 dark:text-slate-100 mb-4">Colors</h4>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-700 dark:text-slate-300 mb-2">Primary Color</label>
          <div class="flex items-center space-x-3">
            <input type="color"
                   :value="biodataStore.settings.colorScheme.primary"
                   @input="updateColor('primary', $event.target.value)"
                   class="w-12 h-8 rounded border border-gray-300 dark:border-slate-600">
            <span class="text-sm text-gray-600 dark:text-slate-400">{{ biodataStore.settings.colorScheme.primary }}</span>
          </div>
        </div>
        <div>
          <label class="block text-sm text-gray-700 dark:text-slate-300 mb-2">Secondary Color</label>
          <div class="flex items-center space-x-3">
            <input type="color"
                   :value="biodataStore.settings.colorScheme.secondary"
                   @input="updateColor('secondary', $event.target.value)"
                   class="w-12 h-8 rounded border border-gray-300 dark:border-slate-600">
            <span class="text-sm text-gray-600 dark:text-slate-400">{{ biodataStore.settings.colorScheme.secondary }}</span>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <label class="block text-sm text-gray-700 dark:text-slate-300 mb-2">Quick Presets</label>
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
      <h4 class="font-medium text-gray-900 dark:text-slate-100 mb-4">Typography</h4>
      <div class="space-y-4">
        <div>
          <label class="block text-sm text-gray-700 dark:text-slate-300 mb-2">Font Family</label>
          <BaseSelect :model-value="biodataStore.settings.font"
                      @update:model-value="updateFont($event)"
                      :options="[
                        { value: 'Inter', label: 'Inter (Modern)' },
                        { value: 'Merriweather', label: 'Merriweather (Serif)' },
                        { value: 'Arial', label: 'Arial (Classic)' },
                        { value: 'Times New Roman', label: 'Times New Roman (Traditional)' }
                      ]" />
        </div>
        <div>
          <label class="block text-sm text-gray-700 dark:text-slate-300 mb-2">
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

    <!-- Naming & Labels -->
    <div class="card">
      <h4 class="font-medium text-gray-900 dark:text-slate-100 mb-4">Naming &amp; Labels</h4>
      <div class="space-y-4">
        <div>
          <label class="block text-sm text-gray-700 dark:text-slate-300 mb-2">Name Style</label>
          <BaseSelect :model-value="biodataStore.settings.nameStyle"
                      @update:model-value="updateSetting('nameStyle', $event)"
                      :options="[
                        { value: 'normal', label: 'Normal' },
                        { value: 'bold', label: 'Bold' },
                        { value: 'italic', label: 'Italic' }
                      ]" />
          <p class="text-xs text-gray-500 dark:text-slate-400 mt-1">Applies to every name (full name, parents, siblings, uncles).</p>
        </div>
        <div>
          <label class="block text-sm text-gray-700 dark:text-slate-300 mb-2">Uncle Labels</label>
          <BaseSelect :model-value="biodataStore.settings.uncleLabelStyle"
                      @update:model-value="updateSetting('uncleLabelStyle', $event)"
                      :options="[
                        { value: 'chacha', label: 'Chacha / Mama' },
                        { value: 'english', label: 'Paternal / Maternal' }
                      ]" />
          <p class="text-xs text-gray-500 dark:text-slate-400 mt-1">Show / hide each side under Optional Fields.</p>
        </div>
      </div>
    </div>

    <!-- Section Visibility & Order -->
    <div class="card">
      <h4 class="font-medium text-gray-900 dark:text-slate-100 mb-1">Sections</h4>
      <p class="text-xs text-gray-600 dark:text-slate-400 mb-4">Drag <span class="font-medium">⠿</span> to reorder · toggle to show/hide.</p>
      <draggable v-model="orderedSections" item-key="id" handle=".drag-handle" class="space-y-3">
        <template #item="{ element }">
          <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg">
            <div class="flex items-center space-x-3 min-w-0">
              <Bars3Icon class="drag-handle w-5 h-5 text-gray-400 dark:text-slate-500 cursor-move flex-shrink-0" />
              <span class="font-medium truncate">{{ element.name }}</span>
            </div>
            <button @click="toggleSection(element.id)"
                    :class="['w-12 h-6 rounded-full flex items-center flex-shrink-0 transition-colors duration-200',
                             biodataStore.settings.sectionsEnabled[element.id]
                               ? 'bg-primary-600' : 'bg-gray-300']">
              <div :class="['w-4 h-4 bg-white dark:bg-slate-800 rounded-full shadow transition-transform duration-200',
                            biodataStore.settings.sectionsEnabled[element.id]
                              ? 'translate-x-7' : 'translate-x-1']"></div>
            </button>
          </div>
        </template>
      </draggable>
    </div>

    <!-- Optional Fields -->
    <div class="card">
      <h4 class="font-medium text-gray-900 dark:text-slate-100 mb-4">Optional Fields</h4>
      <p class="text-xs text-gray-600 dark:text-slate-400 mb-3">Turn extra fields on to show them on the biodata.</p>
      <div class="space-y-3">
        <div v-for="field in fieldsConfig"
             :key="field.id"
             class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg">
          <span class="font-medium text-sm">{{ field.name }}</span>
          <button @click="toggleField(field.id)"
                  :class="['w-12 h-6 rounded-full flex items-center flex-shrink-0 transition-colors duration-200',
                           biodataStore.settings.fieldsEnabled[field.id]
                             ? 'bg-primary-600' : 'bg-gray-300']">
            <div :class="['w-4 h-4 bg-white dark:bg-slate-800 rounded-full shadow transition-transform duration-200',
                          biodataStore.settings.fieldsEnabled[field.id]
                            ? 'translate-x-7' : 'translate-x-1']"></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-slate-700">
      <button @click="resetSettings" class="btn-secondary">Reset to Default</button>
    </div>
  </div>
</template>

<script>
import { useBiodataStore } from '../../../stores/biodata'
import { useToast } from 'vue-toastification'
import draggable from 'vuedraggable'
import { Bars3Icon } from '@heroicons/vue/24/outline'

export default {
  name: 'BiodataSettingsEditor',
  components: {
    draggable,
    Bars3Icon
  },
  setup() {
    const biodataStore = useBiodataStore()
    const toast = useToast()
    return { biodataStore, toast }
  },
  data() {
    return {
      titlePresets: ['Marriage Biodata', 'Biodata', "{name}'s Biodata", "{firstName}'s Marriage Biodata", 'বিবাহ বায়োডাটা', 'পাত্রের বায়োডাটা', 'পাত্রীর বায়োডাটা'],
      templates: [
        {
          id: 'elegant',
          name: 'Elegant',
          description: 'Colored section bars, photo & contact on the side',
          preview: 'bg-gradient-to-br from-rose-700 to-red-900'
        },
        {
          id: 'classic',
          name: 'Classic',
          description: 'Bordered frame, centered title & photo',
          preview: 'bg-white dark:bg-slate-800 border-2 border-rose-800'
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
        { id: 'lifestyle', name: 'Hobbies & Habits' },
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
        { id: 'paternalUncles', name: 'Uncles (Paternal / Chacha)' },
        { id: 'maternalUncles', name: 'Uncles (Maternal / Mama)' },
        { id: 'homeDistrict', name: 'Home District' },
        { id: 'guardianPhone', name: "Guardian's Contact" },
        { id: 'email', name: 'Email' },
        { id: 'website', name: 'Website' },
        { id: 'facebook', name: 'Facebook' },
        { id: 'instagram', name: 'Instagram' },
        { id: 'linkedin', name: 'LinkedIn' }
      ]
    }
  },
  computed: {
    orderedSections: {
      get() {
        const nameById = Object.fromEntries(this.sectionsConfig.map(s => [s.id, s.name]))
        return this.biodataStore.settings.sectionsOrder.map(id => ({ id, name: nameById[id] || id }))
      },
      set(list) {
        this.biodataStore.reorderSections(list.map(s => s.id))
      }
    }
  },
  methods: {
    updateTitle(value) {
      this.biodataStore.updateSettings({ title: value })
    },
    applyTitlePreset(title) {
      this.biodataStore.updateSettings({ title })
    },
    toggleBismillah() {
      this.biodataStore.updateSettings({ showBismillah: !this.biodataStore.settings.showBismillah })
    },
    updateBismillahStyle(value) {
      this.biodataStore.updateSettings({ bismillahStyle: value })
    },
    selectTemplate(id) {
      this.biodataStore.updateSettings({ template: id })
      this.toast.success('Template updated!')
    },
    toggleShowPhoto() {
      this.biodataStore.updateSettings({ showPhoto: !this.biodataStore.settings.showPhoto })
    },
    toggleBloodGroupVe() {
      this.biodataStore.updateSettings({ bloodGroupVe: !this.biodataStore.settings.bloodGroupVe })
    },
    updateColor(type, value) {
      this.biodataStore.updateColorScheme({ [type]: value })
    },
    applyColorPreset(preset) {
      this.biodataStore.updateColorScheme({ primary: preset.primary, secondary: preset.secondary })
      this.toast.success(`${preset.name} colors applied!`)
    },
    updateSetting(key, value) {
      this.biodataStore.updateSettings({ [key]: value })
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
