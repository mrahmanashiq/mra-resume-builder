<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100">Languages</h3>
      <button @click="addLanguage" class="btn-primary">
        <PlusIcon class="w-4 h-4 mr-2" />
        Add Language
      </button>
    </div>

    <!-- Language Items -->
    <div class="space-y-4">
      <div v-for="(language, index) in resumeStore.languages" 
           :key="language.id"
           class="border border-gray-200 dark:border-slate-700 rounded-lg p-4 bg-gray-50 dark:bg-slate-800/60">
        
        <div class="flex items-center justify-between">
          <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Language</label>
              <input type="text" 
                     :value="language.name"
                     @input="updateLanguage(language.id, 'name', $event.target.value)"
                     class="input-field"
                     placeholder="English">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Proficiency Level</label>
              <BaseSelect
                :model-value="language.level"
                @update:model-value="updateLanguage(language.id, 'level', $event)"
                :options="['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic']" />
            </div>
          </div>
          <button @click="removeLanguage(language.id)" 
                  class="ml-4 p-1 text-red-400 hover:text-red-600">
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="resumeStore.languages.length === 0" 
         class="text-center py-12 bg-gray-50 dark:bg-slate-800/60 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600">
      <LanguageIcon class="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">No languages added</h3>
      <p class="text-gray-600 dark:text-slate-400 mb-4">Add languages you speak to showcase your communication skills</p>
      <button @click="addLanguage" class="btn-primary">
        Add Your First Language
      </button>
    </div>

    <!-- Actions -->
    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-slate-700">
      <button @click="clearAll" class="btn-secondary">
        Clear All
      </button>
      <button @click="saveChanges" class="btn-primary">
        Save Changes
      </button>
    </div>
  </div>
</template>

<script>
import { useResumeStore } from '../../stores/resume'
import { useToast } from 'vue-toastification'
import { PlusIcon, TrashIcon, LanguageIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'LanguagesEditor',
  components: {
    PlusIcon,
    TrashIcon,
    LanguageIcon
  },
  setup() {
    const resumeStore = useResumeStore()
    const toast = useToast()
    
    return { resumeStore, toast }
  },
  methods: {
    addLanguage() {
      this.resumeStore.addLanguage({
        name: '',
        level: 'Intermediate'
      })
      this.toast.success('New language added')
    },
    
    updateLanguage(id, field, value) {
      this.resumeStore.updateLanguage(id, { [field]: value })
    },
    
    removeLanguage(id) {
      this.resumeStore.removeLanguage(id)
      this.toast.success('Removed. Use Undo to restore.')
    },
    
    clearAll() {
      const confirmClear = confirm('Are you sure you want to remove all languages?')
      if (confirmClear) {
        this.resumeStore.languages = []
        this.toast.success('All languages cleared')
      }
    },
    
    saveChanges() {
      this.toast.success('Languages saved!')
    }
  }
}
</script>