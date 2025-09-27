<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">Projects</h3>
      <button @click="addProject" class="btn-primary">
        <PlusIcon class="w-4 h-4 mr-2" />
        Add Project
      </button>
    </div>

    <!-- Project Items -->
    <div class="space-y-6">
      <div v-for="(project, index) in resumeStore.projects" 
           :key="project.id"
           class="border border-gray-200 rounded-lg p-6 bg-gray-50">
        
        <div class="flex items-start justify-between mb-4">
          <h4 class="font-medium text-gray-900">Project {{ index + 1 }}</h4>
          <button @click="removeProject(project.id)" 
                  class="p-1 text-red-400 hover:text-red-600">
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>

        <!-- Project Name -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
          <input type="text" 
                 :value="project.name"
                 @input="updateProject(project.id, 'name', $event.target.value)"
                 class="input-field"
                 placeholder="E-Commerce Platform">
        </div>

        <!-- Description -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea :value="project.description"
                    @input="updateProject(project.id, 'description', $event.target.value)"
                    rows="3"
                    class="textarea-field"
                    placeholder="Brief description of the project and its key features..."></textarea>
        </div>

        <!-- Technologies -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
          <div class="flex flex-wrap gap-2 mb-2">
            <span v-for="(tech, techIndex) in project.technologies" 
                  :key="techIndex"
                  class="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm flex items-center">
              {{ tech }}
              <button @click="removeTechnology(project.id, techIndex)" 
                      class="ml-2 text-primary-600 hover:text-primary-800">
                <XMarkIcon class="w-3 h-3" />
              </button>
            </span>
          </div>
          <div class="flex space-x-2">
            <input type="text" 
                   v-model="newTechnology"
                   @keypress.enter="addTechnology(project.id)"
                   class="input-field"
                   placeholder="Add technology (press Enter)">
            <button @click="addTechnology(project.id)" class="btn-secondary">
              Add
            </button>
          </div>
        </div>

        <!-- URL and Dates -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Project URL</label>
            <input type="url" 
                   :value="project.url"
                   @input="updateProject(project.id, 'url', $event.target.value)"
                   class="input-field"
                   placeholder="https://github.com/username/project">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input type="month" 
                   :value="project.startDate"
                   @input="updateProject(project.id, 'startDate', $event.target.value)"
                   class="input-field">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input type="month" 
                   :value="project.endDate"
                   @input="updateProject(project.id, 'endDate', $event.target.value)"
                   class="input-field">
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="resumeStore.projects.length === 0" 
         class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <FolderIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No projects added</h3>
      <p class="text-gray-600 mb-4">Showcase your personal and professional projects</p>
      <button @click="addProject" class="btn-primary">
        Add Your First Project
      </button>
    </div>

    <!-- Actions -->
    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
import { PlusIcon, TrashIcon, FolderIcon, XMarkIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'ProjectsEditor',
  components: {
    PlusIcon,
    TrashIcon,
    FolderIcon,
    XMarkIcon
  },
  setup() {
    const resumeStore = useResumeStore()
    const toast = useToast()
    
    return { resumeStore, toast }
  },
  data() {
    return {
      newTechnology: ''
    }
  },
  methods: {
    addProject() {
      this.resumeStore.addProject({
        name: '',
        description: '',
        technologies: [],
        url: '',
        startDate: '',
        endDate: ''
      })
      this.toast.success('New project added')
    },
    
    updateProject(id, field, value) {
      this.resumeStore.updateProject(id, { [field]: value })
    },
    
    removeProject(id) {
      const confirmDelete = confirm('Are you sure you want to remove this project?')
      if (confirmDelete) {
        this.resumeStore.removeProject(id)
        this.toast.success('Project removed')
      }
    },
    
    addTechnology(projectId) {
      if (this.newTechnology.trim()) {
        const project = this.resumeStore.projects.find(p => p.id === projectId)
        if (project) {
          const updatedTechnologies = [...project.technologies, this.newTechnology.trim()]
          this.resumeStore.updateProject(projectId, { technologies: updatedTechnologies })
          this.newTechnology = ''
        }
      }
    },
    
    removeTechnology(projectId, index) {
      const project = this.resumeStore.projects.find(p => p.id === projectId)
      if (project) {
        const updatedTechnologies = project.technologies.filter((_, i) => i !== index)
        this.resumeStore.updateProject(projectId, { technologies: updatedTechnologies })
      }
    },
    
    clearAll() {
      const confirmClear = confirm('Are you sure you want to remove all projects?')
      if (confirmClear) {
        this.resumeStore.projects = []
        this.toast.success('All projects cleared')
      }
    },
    
    saveChanges() {
      this.toast.success('Projects saved!')
    }
  }
}
</script>