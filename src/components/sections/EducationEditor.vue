<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100">Education</h3>
      <button @click="addEducation" class="btn-primary">
        <PlusIcon class="w-4 h-4 mr-2" />
        Add Education
      </button>
    </div>

    <!-- Education Items -->
    <div class="space-y-6">
      <div v-for="(education, index) in resumeStore.education" 
           :key="education.id"
           class="border border-gray-200 dark:border-slate-700 rounded-lg p-6 bg-gray-50 dark:bg-slate-800/60">
        
        <div class="flex items-start justify-between mb-4">
          <h4 class="font-medium text-gray-900 dark:text-slate-100">Education {{ index + 1 }}</h4>
          <button @click="removeEducation(education.id)" 
                  class="p-1 text-red-400 hover:text-red-600">
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>

        <!-- Degree -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Degree/Qualification</label>
          <input type="text" 
                 :value="education.degree"
                 @input="updateEducation(education.id, 'degree', $event.target.value)"
                 class="input-field"
                 placeholder="Bachelor of Science in Computer Science">
        </div>

        <!-- Institution and Location -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Institution</label>
            <input type="text" 
                   :value="education.institution"
                   @input="updateEducation(education.id, 'institution', $event.target.value)"
                   class="input-field"
                   placeholder="University of California, Berkeley">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Location</label>
            <input type="text" 
                   :value="education.location"
                   @input="updateEducation(education.id, 'location', $event.target.value)"
                   class="input-field"
                   placeholder="Berkeley, CA">
          </div>
        </div>

        <!-- Dates and GPA -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Start Date</label>
            <BaseDatePicker mode="month"
                            :model-value="education.startDate"
                            @update:model-value="updateEducation(education.id, 'startDate', $event)" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">End Date</label>
            <BaseDatePicker mode="month"
                            :model-value="education.endDate"
                            @update:model-value="updateEducation(education.id, 'endDate', $event)" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">GPA (Optional)</label>
            <input type="text" 
                   :value="education.gpa"
                   @input="updateEducation(education.id, 'gpa', $event.target.value)"
                   class="input-field"
                   placeholder="3.8">
          </div>
        </div>

        <!-- Thesis and Advisor (academic CV) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Thesis (Optional)</label>
            <input type="text"
                   :value="education.thesis"
                   @input="updateEducation(education.id, 'thesis', $event.target.value)"
                   class="input-field"
                   placeholder="Contextual visual recognition from images and videos">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Advisor (Optional)</label>
            <input type="text"
                   :value="education.advisor"
                   @input="updateEducation(education.id, 'advisor', $event.target.value)"
                   class="input-field"
                   placeholder="Prof. Jane Smith">
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Description</label>
          <textarea :value="education.description"
                    @input="updateEducation(education.id, 'description', $event.target.value)"
                    rows="3"
                    class="textarea-field"
                    placeholder="Relevant coursework, achievements, honors, etc."></textarea>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="resumeStore.education.length === 0" 
         class="text-center py-12 bg-gray-50 dark:bg-slate-800/60 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600">
      <AcademicCapIcon class="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">No education added</h3>
      <p class="text-gray-600 dark:text-slate-400 mb-4">Add your educational background and qualifications</p>
      <button @click="addEducation" class="btn-primary">
        Add Your Education
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
import { PlusIcon, TrashIcon, AcademicCapIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'EducationEditor',
  components: {
    PlusIcon,
    TrashIcon,
    AcademicCapIcon
  },
  setup() {
    const resumeStore = useResumeStore()
    const toast = useToast()
    
    return { resumeStore, toast }
  },
  methods: {
    addEducation() {
      this.resumeStore.addEducation({
        degree: '',
        institution: '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: '',
        thesis: '',
        advisor: '',
        description: ''
      })
      this.toast.success('New education added')
    },
    
    updateEducation(id, field, value) {
      this.resumeStore.updateEducation(id, { [field]: value })
    },
    
    removeEducation(id) {
      const confirmDelete = confirm('Are you sure you want to remove this education?')
      if (confirmDelete) {
        this.resumeStore.removeEducation(id)
        this.toast.success('Education removed')
      }
    },
    
    clearAll() {
      const confirmClear = confirm('Are you sure you want to remove all education?')
      if (confirmClear) {
        this.resumeStore.education = []
        this.toast.success('All education cleared')
      }
    },
    
    saveChanges() {
      this.toast.success('Education saved!')
    }
  }
}
</script>