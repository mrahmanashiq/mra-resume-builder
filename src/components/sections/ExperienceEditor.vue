<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100">Work Experience</h3>
      <button @click="addExperience" class="btn-primary">
        <PlusIcon class="w-4 h-4 mr-2" />
        Add Experience
      </button>
    </div>

    <!-- Experience Items -->
    <div class="space-y-6">
      <div v-for="(experience, index) in resumeStore.experience" 
           :key="experience.id"
           class="border border-gray-200 dark:border-slate-700 rounded-lg p-6 bg-gray-50 dark:bg-slate-800/60">
        
        <div class="flex items-start justify-between mb-4">
          <h4 class="font-medium text-gray-900 dark:text-slate-100">Experience {{ index + 1 }}</h4>
          <div class="flex items-center space-x-2">
            <button @click="moveUp(index)" aria-label="Move up"
                    :disabled="index === 0"
                    class="p-1 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:text-slate-400 disabled:opacity-50">
              <ChevronUpIcon class="w-4 h-4" />
            </button>
            <button @click="moveDown(index)" aria-label="Move down"
                    :disabled="index === resumeStore.experience.length - 1"
                    class="p-1 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:text-slate-400 disabled:opacity-50">
              <ChevronDownIcon class="w-4 h-4" />
            </button>
            <button @click="removeExperience(experience.id)" aria-label="Remove"
                    class="p-1 text-red-400 hover:text-red-600">
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Job Title -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Job Title</label>
          <input type="text" 
                 :value="experience.title"
                 @input="updateExperience(experience.id, 'title', $event.target.value)"
                 class="input-field"
                 placeholder="Senior Software Developer">
        </div>

        <!-- Company and Location -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Company</label>
            <input type="text" 
                   :value="experience.company"
                   @input="updateExperience(experience.id, 'company', $event.target.value)"
                   class="input-field"
                   placeholder="Tech Company Inc.">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Location</label>
            <input type="text" 
                   :value="experience.location"
                   @input="updateExperience(experience.id, 'location', $event.target.value)"
                   class="input-field"
                   placeholder="San Francisco, CA">
          </div>
        </div>

        <!-- Dates -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Start Date</label>
            <BaseDatePicker mode="month"
                            :model-value="experience.startDate"
                            @update:model-value="updateExperience(experience.id, 'startDate', $event)" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">End Date</label>
            <BaseDatePicker mode="month"
                            :model-value="experience.endDate"
                            @update:model-value="updateExperience(experience.id, 'endDate', $event)"
                            :disabled="experience.current" />
          </div>
          <div class="flex items-center">
            <label class="flex items-center space-x-2 mt-6">
              <input type="checkbox" 
                     :checked="experience.current"
                     @change="updateExperience(experience.id, 'current', $event.target.checked)"
                     class="rounded border-gray-300 dark:border-slate-600">
              <span class="text-sm text-gray-700 dark:text-slate-300">Current Position</span>
            </label>
          </div>
        </div>

        <!-- Description -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Job Description</label>
          <textarea :value="experience.description"
                    @input="updateExperience(experience.id, 'description', $event.target.value)"
                    rows="3"
                    class="textarea-field"
                    placeholder="Brief description of your role and responsibilities..."></textarea>
        </div>

        <!-- Achievements -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300">Key Achievements</label>
            <button @click="addAchievement(experience.id)" 
                    class="text-sm text-primary-600 hover:text-primary-700">
              <PlusIcon class="w-4 h-4 inline mr-1" />
              Add Achievement
            </button>
          </div>
          
          <div class="space-y-3">
            <div v-for="(achievement, achIndex) in experience.achievements" 
                 :key="achIndex"
                 class="flex items-start space-x-3">
              <div class="flex-1">
                <textarea :value="achievement"
                          @input="updateAchievement(experience.id, achIndex, $event.target.value)"
                          rows="2"
                          class="textarea-field"
                          placeholder="Describe a specific achievement or accomplishment..."></textarea>
              </div>
              <button @click="removeAchievement(experience.id, achIndex)" 
                      class="mt-2 p-1 text-red-400 hover:text-red-600">
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <p class="text-xs text-gray-500 dark:text-slate-400 mt-2">
            Tip: Use specific metrics and numbers when possible (e.g., "Increased sales by 25%")
          </p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="resumeStore.experience.length === 0" 
         class="text-center py-12 bg-gray-50 dark:bg-slate-800/60 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600">
      <BriefcaseIcon class="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">No work experience added</h3>
      <p class="text-gray-600 dark:text-slate-400 mb-4">Add your work experience to showcase your professional background</p>
      <button @click="addExperience" class="btn-primary">
        Add Your First Experience
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
import { 
  PlusIcon, 
  TrashIcon, 
  ChevronUpIcon, 
  ChevronDownIcon,
  BriefcaseIcon 
} from '@heroicons/vue/24/outline'

export default {
  name: 'ExperienceEditor',
  components: {
    PlusIcon,
    TrashIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    BriefcaseIcon
  },
  setup() {
    const resumeStore = useResumeStore()
    const toast = useToast()
    
    return { resumeStore, toast }
  },
  methods: {
    addExperience() {
      this.resumeStore.addExperience({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        achievements: ['']
      })
      this.toast.success('New experience added')
    },
    
    updateExperience(id, field, value) {
      this.resumeStore.updateExperience(id, { [field]: value })
    },
    
    removeExperience(id) {
      this.resumeStore.removeExperience(id)
      this.toast.success('Removed. Use Undo to restore.')
    },
    
    addAchievement(experienceId) {
      const experience = this.resumeStore.experience.find(exp => exp.id === experienceId)
      if (experience) {
        const updatedAchievements = [...experience.achievements, '']
        this.resumeStore.updateExperience(experienceId, { achievements: updatedAchievements })
      }
    },
    
    updateAchievement(experienceId, index, value) {
      const experience = this.resumeStore.experience.find(exp => exp.id === experienceId)
      if (experience) {
        const updatedAchievements = [...experience.achievements]
        updatedAchievements[index] = value
        this.resumeStore.updateExperience(experienceId, { achievements: updatedAchievements })
      }
    },
    
    removeAchievement(experienceId, index) {
      const experience = this.resumeStore.experience.find(exp => exp.id === experienceId)
      if (experience && experience.achievements.length > 1) {
        const updatedAchievements = experience.achievements.filter((_, i) => i !== index)
        this.resumeStore.updateExperience(experienceId, { achievements: updatedAchievements })
      }
    },
    
    moveUp(index) {
      if (index > 0) {
        const experiences = [...this.resumeStore.experience]
        ;[experiences[index], experiences[index - 1]] = [experiences[index - 1], experiences[index]]
        this.resumeStore.experience = experiences
      }
    },
    
    moveDown(index) {
      if (index < this.resumeStore.experience.length - 1) {
        const experiences = [...this.resumeStore.experience]
        ;[experiences[index], experiences[index + 1]] = [experiences[index + 1], experiences[index]]
        this.resumeStore.experience = experiences
      }
    },
    
    clearAll() {
      const confirmClear = confirm('Are you sure you want to remove all work experience?')
      if (confirmClear) {
        this.resumeStore.experience = []
        this.toast.success('All experience cleared')
      }
    },
    
    saveChanges() {
      this.toast.success('Work experience saved!')
    }
  }
}
</script>