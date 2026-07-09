<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <!-- Header -->
    <header class="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <router-link to="/" class="text-xl font-bold text-primary-600">
            MRA Resume Builder
          </router-link>
          <div class="flex items-center space-x-3 sm:space-x-4">
            <ThemeToggle />
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
        <h1 class="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
          Choose Your Template
        </h1>
        <p class="text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
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
                             : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:bg-slate-800/60 border border-gray-300 dark:border-slate-600']">
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Templates Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div v-for="template in filteredTemplates" 
             :key="template.id"
             class="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
          
          <!-- Template Preview (live, scaled-down render of the real template) -->
          <div class="relative border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/60">
            <TemplateThumbnail :component="componentFor(template.id)" />

            <!-- Overlay on Hover -->
            <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div class="space-y-3 w-40">
                <button @click="previewTemplate(template)"
                        class="w-full bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200">
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
            <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">{{ template.name }}</h3>
            <p class="text-gray-600 dark:text-slate-400 text-sm mb-4">{{ template.description }}</p>
            
            <!-- Template Features -->
            <div class="flex flex-wrap gap-2">
              <span v-for="feature in template.features"
                    :key="feature"
                    class="bg-gray-100 text-gray-700 dark:text-slate-300 text-xs px-2 py-1 rounded">
                {{ feature }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredTemplates.length === 0" 
           class="text-center py-16">
        <DocumentTextIcon class="w-16 h-16 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">
          No templates found
        </h3>
        <p class="text-gray-600 dark:text-slate-400">
          Try selecting a different category or check back later for new templates.
        </p>
      </div>
    </div>

    <!-- Template Preview Modal -->
    <div v-if="selectedTemplatePreview" 
         class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-slate-100">
            {{ selectedTemplatePreview.name }} Preview
          </h3>
          <button @click="closePreview"
                  class="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:text-slate-400">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <div class="p-6 overflow-auto flex-1 min-h-0">
          <div class="bg-gray-100 p-4 sm:p-8 rounded-lg flex justify-center">
            <div class="bg-white dark:bg-slate-800 shadow-lg" style="width: 210mm; flex-shrink: 0;">
              <Suspense>
                <component :is="componentFor(selectedTemplatePreview.id)" />
              </Suspense>
            </div>
          </div>
        </div>
        
        <div class="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end space-x-4 flex-shrink-0">
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
import { defineAsyncComponent } from 'vue'
import { useResumeStore } from '../stores/resume'
import { useToast } from 'vue-toastification'
import { DocumentTextIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import TemplateThumbnail from '../components/TemplateThumbnail.vue'

// Map each template id to its real component (lazy-loaded).
const templateComponents = {
  modern: defineAsyncComponent(() => import('../components/templates/ModernTemplate.vue')),
  classic: defineAsyncComponent(() => import('../components/templates/ClassicTemplate.vue')),
  creative: defineAsyncComponent(() => import('../components/templates/CreativeTemplate.vue')),
  minimalist: defineAsyncComponent(() => import('../components/templates/MinimalistTemplate.vue')),
  ats: defineAsyncComponent(() => import('../components/templates/AtsResumeTemplate.vue')),
  sidebar: defineAsyncComponent(() => import('../components/templates/SidebarResumeTemplate.vue')),
  academic: defineAsyncComponent(() => import('../components/templates/AcademicResumeTemplate.vue')),
  colorful: defineAsyncComponent(() => import('../components/templates/ColorfulResumeTemplate.vue')),
  corporate: defineAsyncComponent(() => import('../components/templates/CorporateCvTemplate.vue')),
  researcher: defineAsyncComponent(() => import('../components/templates/ResearcherCvTemplate.vue')),
  academicPortfolio: defineAsyncComponent(() => import('../components/templates/AcademicPortfolioTemplate.vue'))
}

export default {
  name: 'Templates',
  components: {
    DocumentTextIcon,
    XMarkIcon,
    TemplateThumbnail
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
      categories: ['All', 'Professional', 'Academic', 'Creative', 'Modern', 'Minimalist', 'Executive'],
      templates: [
        {
          id: 'researcher',
          name: 'Researcher CV',
          description: 'Clean multi-page academic CV with publications, talks, awards and service.',
          categories: ['Academic', 'Professional', 'Minimalist'],
          features: ['Publications', 'Multi-page', 'Serif', 'ATS-Friendly']
        },
        {
          id: 'academicPortfolio',
          name: 'Academic Portfolio',
          description: 'Rich CV with margin labels, numbered publications and tl;dr summaries.',
          categories: ['Academic', 'Professional', 'Executive'],
          features: ['Publications', 'Margin labels', 'tl;dr summaries', 'Multi-page']
        },
        {
          id: 'ats',
          name: 'Clean ATS',
          description: 'Single-column, ATS-friendly layout with ruled headings.',
          categories: ['Professional', 'Modern', 'Minimalist'],
          features: ['ATS-Friendly', 'Single-column', 'Clean']
        },
        {
          id: 'modern',
          name: 'Modern',
          description: 'Clean, contemporary two-column design.',
          categories: ['Modern', 'Professional'],
          features: ['Modern', 'Two-column', 'Color header']
        },
        {
          id: 'sidebar',
          name: 'Sidebar',
          description: 'Two-column with a side panel for photo, skills and contact.',
          categories: ['Modern', 'Creative'],
          features: ['Two-column', 'Photo', 'Skill chips']
        },
        {
          id: 'colorful',
          name: 'Colorful',
          description: 'Accent-colored header band with chips and skill bars.',
          categories: ['Creative', 'Modern'],
          features: ['Accent header', 'Chips', 'Skill bars']
        },
        {
          id: 'creative',
          name: 'Creative',
          description: 'Bold, colorful design for standout applications.',
          categories: ['Creative'],
          features: ['Bold', 'Color accents', 'Eye-catching']
        },
        {
          id: 'academic',
          name: 'Academic CV',
          description: 'Serif, scholarly layout with margin dates.',
          categories: ['Academic', 'Executive', 'Professional'],
          features: ['Serif', 'Margin dates', 'Scholarly']
        },
        {
          id: 'corporate',
          name: 'Corporate CV',
          description: 'Multi-page CV with header band, tables, personal details & references.',
          categories: ['Professional', 'Executive'],
          features: ['Multi-page', 'Tables', 'Personal details', 'References']
        },
        {
          id: 'classic',
          name: 'Classic',
          description: 'Traditional, professional layout for any field.',
          categories: ['Professional', 'Executive'],
          features: ['Traditional', 'Professional', 'Timeless']
        },
        {
          id: 'minimalist',
          name: 'Minimalist',
          description: 'Simple, elegant design that lets your content shine.',
          categories: ['Minimalist', 'Professional'],
          features: ['Minimalist', 'Easy to read', 'Content focus']
        }
      ]
    }
  },
  computed: {
    filteredTemplates() {
      if (this.selectedCategory === 'All') {
        return this.templates
      }
      return this.templates.filter(template => (template.categories || []).includes(this.selectedCategory))
    }
  },
  methods: {
    componentFor(id) {
      return templateComponents[id]
    },

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