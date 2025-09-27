<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <router-link to="/" class="text-xl font-bold text-primary-600">
            MRA Resume Builder
          </router-link>
          <div class="flex items-center space-x-4">
            <router-link to="/editor" class="btn-primary">
              Back to Editor
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Page Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Template
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Select from our professionally designed templates. Each template is ATS-friendly 
          and optimized for modern hiring processes.
        </p>
      </div>

      <!-- Filter Options -->
      <div class="mb-8">
        <div class="flex flex-wrap justify-center gap-4">
          <button v-for="category in categories" 
                  :key="category"
                  @click="selectedCategory = category"
                  :class="['px-4 py-2 rounded-lg font-medium transition-all duration-200',
                           selectedCategory === category 
                             ? 'bg-primary-600 text-white' 
                             : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300']">
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Templates Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div v-for="template in filteredTemplates" 
             :key="template.id"
             class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
          
          <!-- Template Preview -->
          <div class="relative h-64 bg-gradient-to-br" :class="template.gradient">
            <div class="absolute inset-0 p-6 text-white">
              <!-- Simulated Resume Content -->
              <div class="space-y-3">
                <div class="h-4 bg-white/40 rounded w-3/4"></div>
                <div class="h-3 bg-white/30 rounded w-1/2"></div>
                <div class="space-y-2 mt-4">
                  <div class="h-2 bg-white/25 rounded"></div>
                  <div class="h-2 bg-white/25 rounded w-4/5"></div>
                  <div class="h-2 bg-white/25 rounded w-3/5"></div>
                </div>
                <div class="grid grid-cols-2 gap-4 mt-4">
                  <div class="space-y-2">
                    <div class="h-2 bg-white/30 rounded"></div>
                    <div class="h-1 bg-white/20 rounded"></div>
                    <div class="h-1 bg-white/20 rounded w-3/4"></div>
                  </div>
                  <div class="space-y-2">
                    <div class="h-2 bg-white/30 rounded"></div>
                    <div class="h-1 bg-white/20 rounded"></div>
                    <div class="h-1 bg-white/20 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Overlay on Hover -->
            <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div class="space-y-3">
                <button @click="previewTemplate(template)" 
                        class="w-full bg-white text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200">
                  Preview
                </button>
                <button @click="selectTemplate(template)" 
                        class="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200">
                  Use Template
                </button>
              </div>
            </div>
          </div>

          <!-- Template Info -->
          <div class="p-6">
            <div class="flex items-start justify-between mb-2">
              <h3 class="text-lg font-semibold text-gray-900">{{ template.name }}</h3>
              <span v-if="template.premium" 
                    class="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                Pro
              </span>
            </div>
            <p class="text-gray-600 text-sm mb-4">{{ template.description }}</p>
            
            <!-- Template Features -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span v-for="feature in template.features" 
                    :key="feature"
                    class="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                {{ feature }}
              </span>
            </div>

            <!-- Template Stats -->
            <div class="flex items-center justify-between text-sm text-gray-500">
              <div class="flex items-center space-x-1">
                <StarIcon class="w-4 h-4 text-yellow-400 fill-current" />
                <span>{{ template.rating }}</span>
              </div>
              <span>{{ template.downloads }} downloads</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredTemplates.length === 0" 
           class="text-center py-16">
        <DocumentTextIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          No templates found
        </h3>
        <p class="text-gray-600">
          Try selecting a different category or check back later for new templates.
        </p>
      </div>
    </div>

    <!-- Template Preview Modal -->
    <div v-if="selectedTemplatePreview" 
         class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ selectedTemplatePreview.name }} Preview
          </h3>
          <button @click="closePreview" 
                  class="text-gray-400 hover:text-gray-600">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div class="bg-gray-100 p-8 rounded-lg">
            <div class="bg-white shadow-lg mx-auto" style="width: 210mm; min-height: 297mm;">
              <!-- Template preview content would go here -->
              <div class="p-8">
                <div class="text-center mb-8">
                  <h1 class="text-3xl font-bold text-gray-900 mb-2">John Doe</h1>
                  <p class="text-lg text-gray-600">Full Stack Developer</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div class="md:col-span-2">
                    <section class="mb-8">
                      <h2 class="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">
                        Experience
                      </h2>
                      <div class="space-y-4">
                        <div>
                          <h3 class="font-semibold text-gray-900">Senior Developer</h3>
                          <p class="text-gray-600">Tech Company • 2022 - Present</p>
                          <ul class="mt-2 text-sm text-gray-700 list-disc list-inside">
                            <li>Led development of web applications</li>
                            <li>Mentored junior developers</li>
                          </ul>
                        </div>
                      </div>
                    </section>
                  </div>
                  
                  <div>
                    <section class="mb-8">
                      <h2 class="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">
                        Skills
                      </h2>
                      <div class="space-y-2">
                        <div class="text-sm text-gray-700">JavaScript</div>
                        <div class="text-sm text-gray-700">React</div>
                        <div class="text-sm text-gray-700">Node.js</div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-6 border-t border-gray-200 flex justify-end space-x-4">
          <button @click="closePreview" class="btn-secondary">
            Close
          </button>
          <button @click="selectTemplate(selectedTemplatePreview)" class="btn-primary">
            Use This Template
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useResumeStore } from '../stores/resume'
import { useToast } from 'vue-toastification'
import { StarIcon, DocumentTextIcon, XMarkIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'Templates',
  components: {
    StarIcon,
    DocumentTextIcon,
    XMarkIcon
  },
  setup() {
    const resumeStore = useResumeStore()
    const toast = useToast()
    
    return { resumeStore, toast }
  },
  data() {
    return {
      selectedCategory: 'All',
      selectedTemplatePreview: null,
      categories: ['All', 'Professional', 'Creative', 'Modern', 'Minimalist', 'Executive'],
      templates: [
        {
          id: 'modern',
          name: 'Modern Professional',
          description: 'Clean and contemporary design perfect for tech professionals',
          category: 'Modern',
          gradient: 'from-blue-600 to-purple-600',
          features: ['ATS-Friendly', 'Clean Layout', 'Modern Typography'],
          rating: 4.8,
          downloads: '12.5k',
          premium: false
        },
        {
          id: 'creative',
          name: 'Creative Portfolio',
          description: 'Vibrant design ideal for creative professionals and designers',
          category: 'Creative',
          gradient: 'from-pink-500 to-orange-500',
          features: ['Portfolio Showcase', 'Creative Layout', 'Color Accents'],
          rating: 4.6,
          downloads: '8.3k',
          premium: true
        },
        {
          id: 'classic',
          name: 'Executive Suite',
          description: 'Sophisticated template for senior-level positions',
          category: 'Executive',
          gradient: 'from-gray-700 to-gray-900',
          features: ['Executive Style', 'Professional', 'Leadership Focus'],
          rating: 4.9,
          downloads: '15.2k',
          premium: true
        },
        {
          id: 'minimalist',
          name: 'Minimalist Clean',
          description: 'Simple and elegant design that lets your content shine',
          category: 'Minimalist',
          gradient: 'from-teal-500 to-green-500',
          features: ['Minimalist', 'Easy to Read', 'Content Focus'],
          rating: 4.7,
          downloads: '9.8k',
          premium: false
        },
        {
          id: 5,
          name: 'Corporate Professional',
          description: 'Traditional corporate design for business professionals',
          category: 'Professional',
          gradient: 'from-indigo-600 to-blue-600',
          features: ['Corporate Style', 'Traditional Layout', 'Business Focus'],
          rating: 4.5,
          downloads: '11.1k',
          premium: false
        },
        {
          id: 6,
          name: 'Tech Innovator',
          description: 'Modern tech-focused design with innovative elements',
          category: 'Modern',
          gradient: 'from-purple-600 to-pink-600',
          features: ['Tech Focus', 'Innovation Theme', 'Skills Highlight'],
          rating: 4.8,
          downloads: '7.9k',
          premium: true
        },
        {
          id: 7,
          name: 'Simple Elegant',
          description: 'Elegant simplicity with perfect typography balance',
          category: 'Minimalist',
          gradient: 'from-gray-600 to-blue-600',
          features: ['Elegant Typography', 'Simple Layout', 'Professional'],
          rating: 4.6,
          downloads: '13.4k',
          premium: false
        },
        {
          id: 8,
          name: 'Creative Burst',
          description: 'Bold and colorful design for standout applications',
          category: 'Creative',
          gradient: 'from-yellow-500 to-red-500',
          features: ['Bold Colors', 'Creative Sections', 'Eye-catching'],
          rating: 4.4,
          downloads: '6.7k',
          premium: true
        }
      ]
    }
  },
  computed: {
    filteredTemplates() {
      if (this.selectedCategory === 'All') {
        return this.templates
      }
      return this.templates.filter(template => template.category === this.selectedCategory)
    }
  },
  methods: {
    previewTemplate(template) {
      this.selectedTemplatePreview = template
    },
    
    closePreview() {
      this.selectedTemplatePreview = null
    },
    
    selectTemplate(template) {
      // Update the resume store with the selected template
      this.resumeStore.updateSettings({ template: template.id })
      this.toast.success(`${template.name} template selected!`)
      
      // Close preview if open
      if (this.selectedTemplatePreview) {
        this.closePreview()
      }
      
      // Navigate to editor
      this.$router.push('/editor')
    }
  }
}
</script>