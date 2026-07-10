<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100">Skills</h3>
      <button @click="addSkill" class="btn-primary">
        <PlusIcon class="w-4 h-4 mr-2" />
        Add Skill
      </button>
    </div>

    <!-- Skills by Category -->
    <div class="space-y-6">
      <div v-for="(skills, category) in resumeStore.skillsByCategory" 
           :key="category"
           class="border border-gray-200 dark:border-slate-700 rounded-lg p-6 bg-gray-50 dark:bg-slate-800/60">
        
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-medium text-gray-900 dark:text-slate-100">{{ category }}</h4>
          <span class="text-sm text-gray-500 dark:text-slate-400">{{ skills.length }} skills</span>
        </div>

        <div class="space-y-4">
          <div v-for="skill in skills" 
               :key="skill.id"
               class="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Skill Name</label>
                  <input type="text" 
                         :value="skill.name"
                         @input="updateSkill(skill.id, 'name', $event.target.value)"
                         class="input-field"
                         placeholder="JavaScript">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Category</label>
                  <BaseSelect
                    :model-value="skill.category"
                    @update:model-value="updateSkill(skill.id, 'category', $event)"
                    :options="skillCategories" />
                </div>
              </div>
              <button @click="removeSkill(skill.id)" 
                      class="ml-4 p-1 text-red-400 hover:text-red-600">
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>

            <!-- Skill Level -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Proficiency Level
                </label>
                <span class="text-sm text-gray-600 dark:text-slate-400">{{ skill.level }}%</span>
              </div>
              <div class="flex items-center space-x-4">
                <input type="range" 
                       :value="skill.level"
                       @input="updateSkill(skill.id, 'level', parseInt($event.target.value))"
                       min="0" 
                       max="100" 
                       step="5"
                       class="flex-1">
                <div class="flex space-x-1">
                  <button v-for="level in skillLevels" 
                          :key="level.value"
                          @click="updateSkill(skill.id, 'level', level.value)"
                          :class="['px-2 py-1 text-xs rounded transition-colors duration-200',
                                   skill.level >= level.value 
                                     ? 'bg-primary-600 text-white' 
                                     : 'bg-gray-200 text-gray-600 dark:text-slate-400 hover:bg-gray-300']">
                    {{ level.label }}
                  </button>
                </div>
              </div>
              
              <!-- Visual Progress Bar -->
              <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div class="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                     :style="{ width: skill.level + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="resumeStore.skills.length === 0" 
         class="text-center py-12 bg-gray-50 dark:bg-slate-800/60 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600">
      <WrenchScrewdriverIcon class="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">No skills added</h3>
      <p class="text-gray-600 dark:text-slate-400 mb-4">Add your technical and professional skills to showcase your expertise</p>
      <button @click="addSkill" class="btn-primary">
        Add Your First Skill
      </button>
    </div>

    <!-- Skill Suggestions -->
    <div v-if="resumeStore.skills.length > 0" class="bg-blue-50 rounded-lg p-4 border border-blue-200">
      <h4 class="font-medium text-blue-900 mb-2">Popular Skills to Consider</h4>
      <div class="flex flex-wrap gap-2">
        <button v-for="suggestion in skillSuggestions" 
                :key="suggestion.name"
                @click="addSuggestedSkill(suggestion)"
                :class="['px-3 py-1 text-sm rounded-full transition-colors duration-200',
                         isSkillAdded(suggestion.name) 
                           ? 'bg-green-100 text-green-800 cursor-not-allowed' 
                           : 'bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer']"
                :disabled="isSkillAdded(suggestion.name)">
          {{ suggestion.name }}
          <CheckIcon v-if="isSkillAdded(suggestion.name)" class="w-4 h-4 inline ml-1" />
        </button>
      </div>
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
  WrenchScrewdriverIcon,
  CheckIcon 
} from '@heroicons/vue/24/outline'

export default {
  name: 'SkillsEditor',
  components: {
    PlusIcon,
    TrashIcon,
    WrenchScrewdriverIcon,
    CheckIcon
  },
  setup() {
    const resumeStore = useResumeStore()
    const toast = useToast()
    
    return { resumeStore, toast }
  },
  data() {
    return {
      skillCategories: [
        'Programming',
        'Frontend',
        'Backend',
        'Database',
        'DevOps',
        'Cloud',
        'Mobile',
        'Design',
        'Testing',
        'Management',
        'Other'
      ],
      skillLevels: [
        { label: 'Basic', value: 25 },
        { label: 'Intermediate', value: 50 },
        { label: 'Advanced', value: 75 },
        { label: 'Expert', value: 95 }
      ],
      skillSuggestions: [
        { name: 'JavaScript', category: 'Programming' },
        { name: 'Python', category: 'Programming' },
        { name: 'React', category: 'Frontend' },
        { name: 'Vue.js', category: 'Frontend' },
        { name: 'Node.js', category: 'Backend' },
        { name: 'TypeScript', category: 'Programming' },
        { name: 'AWS', category: 'Cloud' },
        { name: 'Docker', category: 'DevOps' },
        { name: 'Git', category: 'DevOps' },
        { name: 'SQL', category: 'Database' },
        { name: 'MongoDB', category: 'Database' },
        { name: 'HTML/CSS', category: 'Frontend' }
      ]
    }
  },
  methods: {
    addSkill() {
      this.resumeStore.addSkill({
        name: '',
        category: 'Programming',
        level: 50
      })
      this.toast.success('New skill added')
    },
    
    updateSkill(id, field, value) {
      this.resumeStore.updateSkill(id, { [field]: value })
    },
    
    removeSkill(id) {
      this.resumeStore.removeSkill(id)
      this.toast.success('Removed. Use Undo to restore.')
    },
    
    addSuggestedSkill(suggestion) {
      if (!this.isSkillAdded(suggestion.name)) {
        this.resumeStore.addSkill({
          name: suggestion.name,
          category: suggestion.category,
          level: 70
        })
        this.toast.success(`${suggestion.name} skill added`)
      }
    },
    
    isSkillAdded(skillName) {
      return this.resumeStore.skills.some(skill => 
        skill.name.toLowerCase() === skillName.toLowerCase()
      )
    },
    
    clearAll() {
      const confirmClear = confirm('Are you sure you want to remove all skills?')
      if (confirmClear) {
        this.resumeStore.skills = []
        this.toast.success('All skills cleared')
      }
    },
    
    saveChanges() {
      this.toast.success('Skills saved!')
    }
  }
}
</script>