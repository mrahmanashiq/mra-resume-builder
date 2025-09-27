<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <router-link to="/" class="text-xl font-bold text-primary-600">
              MRA Resume Builder
            </router-link>
            <div class="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <span>Auto-saved</span>
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <button @click="togglePreview" 
                    class="btn-outline flex items-center space-x-2">
              <EyeIcon class="w-4 h-4" />
              <span class="hidden sm:inline">{{ resumeStore.ui.previewMode ? 'Edit' : 'Preview' }}</span>
            </button>
            
            <div class="relative">
              <button @click="showExportMenu = !showExportMenu" 
                      class="btn-primary flex items-center space-x-2">
                <CloudArrowDownIcon class="w-4 h-4" />
                <span class="hidden sm:inline">Export</span>
                <ChevronDownIcon class="w-4 h-4" />
              </button>
              
              <!-- Export Menu -->
              <div v-if="showExportMenu" 
                   class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                <button @click="exportToPDF" 
                        class="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2">
                  <DocumentArrowDownIcon class="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                <button @click="printResume" 
                        class="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2">
                  <PrinterIcon class="w-4 h-4" />
                  <span>Print</span>
                </button>
                <button @click="shareResume" 
                        class="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2">
                  <ShareIcon class="w-4 h-4" />
                  <span>Share Link</span>
                </button>
                <hr class="my-2">
                <button @click="exportData" 
                        class="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2">
                  <DocumentTextIcon class="w-4 h-4" />
                  <span>Export Data</span>
                </button>
                <button @click="importData" 
                        class="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2">
                  <ArrowUpTrayIcon class="w-4 h-4" />
                  <span>Import Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="flex h-[calc(100vh-4rem)]">
      <!-- Sidebar -->
      <aside v-if="!resumeStore.ui.previewMode" 
             :class="['bg-white border-r border-gray-200 transition-all duration-300', 
                      resumeStore.ui.sidebarCollapsed ? 'w-16' : 'w-80']">
        
        <!-- Sidebar Toggle -->
        <div class="p-4 border-b border-gray-200">
          <button @click="toggleSidebar" 
                  class="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100">
            <Bars3Icon v-if="resumeStore.ui.sidebarCollapsed" class="w-5 h-5" />
            <div v-else class="flex items-center justify-between w-full">
              <span class="font-medium text-gray-900">Edit Resume</span>
              <ChevronLeftIcon class="w-5 h-5" />
            </div>
          </button>
        </div>

        <!-- Navigation -->
        <nav v-if="!resumeStore.ui.sidebarCollapsed" class="p-4">
          <div class="space-y-2">
            <button v-for="section in navigationSections" 
                    :key="section.id"
                    @click="setCurrentSection(section.id)"
                    :class="['w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200',
                             resumeStore.ui.currentSection === section.id 
                               ? 'bg-primary-100 text-primary-700' 
                               : 'text-gray-700 hover:bg-gray-100']">
              <component :is="section.icon" class="w-5 h-5" />
              <span>{{ section.name }}</span>
            </button>
          </div>
        </nav>

        <!-- Section Editor -->
        <div v-if="!resumeStore.ui.sidebarCollapsed" class="flex-1 overflow-y-auto p-4">
          <component :is="currentSectionComponent" />
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-hidden bg-gray-100">
        <div class="h-full overflow-y-auto p-8">
          <div class="max-w-4xl mx-auto">
            <!-- Resume Preview -->
            <div id="resume-preview" class="bg-white shadow-lg">
              <ResumeTemplate />
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Import Modal -->
    <div v-if="showImportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">Import Resume Data</h3>
        <textarea v-model="importJsonData" 
                  placeholder="Paste your resume JSON data here..."
                  class="textarea-field h-40 mb-4"></textarea>
        <div class="flex justify-end space-x-3">
          <button @click="showImportModal = false" class="btn-secondary">
            Cancel
          </button>
          <button @click="handleImportData" class="btn-primary">
            Import
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useResumeStore } from '../stores/resume'
import { useToast } from 'vue-toastification'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { saveAs } from 'file-saver'

// Icons
import { 
  EyeIcon, 
  CloudArrowDownIcon, 
  ChevronDownIcon, 
  DocumentArrowDownIcon,
  PrinterIcon,
  ShareIcon,
  DocumentTextIcon,
  ArrowUpTrayIcon,
  Bars3Icon,
  ChevronLeftIcon,
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  FolderIcon,
  TrophyIcon,
  LanguageIcon,
  CogIcon
} from '@heroicons/vue/24/outline'

// Section Components
import PersonalInfoEditor from '../components/sections/PersonalInfoEditor.vue'
import ExperienceEditor from '../components/sections/ExperienceEditor.vue'
import EducationEditor from '../components/sections/EducationEditor.vue'
import SkillsEditor from '../components/sections/SkillsEditor.vue'
import ProjectsEditor from '../components/sections/ProjectsEditor.vue'
import CertificationsEditor from '../components/sections/CertificationsEditor.vue'
import LanguagesEditor from '../components/sections/LanguagesEditor.vue'
import SettingsEditor from '../components/sections/SettingsEditor.vue'

// Resume Template
import ResumeTemplate from '../components/templates/ResumeTemplate.vue'

export default {
  name: 'Editor',
  components: {
    EyeIcon,
    CloudArrowDownIcon,
    ChevronDownIcon,
    DocumentArrowDownIcon,
    PrinterIcon,
    ShareIcon,
    DocumentTextIcon,
    ArrowUpTrayIcon,
    Bars3Icon,
    ChevronLeftIcon,
    UserIcon,
    BriefcaseIcon,
    AcademicCapIcon,
    WrenchScrewdriverIcon,
    FolderIcon,
    TrophyIcon,
    LanguageIcon,
    CogIcon,
    PersonalInfoEditor,
    ExperienceEditor,
    EducationEditor,
    SkillsEditor,
    ProjectsEditor,
    CertificationsEditor,
    LanguagesEditor,
    SettingsEditor,
    ResumeTemplate
  },
  setup() {
    const resumeStore = useResumeStore()
    const toast = useToast()
    
    return { resumeStore, toast }
  },
  data() {
    return {
      showExportMenu: false,
      showImportModal: false,
      importJsonData: '',
      navigationSections: [
        { id: 'personalInfo', name: 'Personal Info', icon: 'UserIcon' },
        { id: 'experience', name: 'Experience', icon: 'BriefcaseIcon' },
        { id: 'education', name: 'Education', icon: 'AcademicCapIcon' },
        { id: 'skills', name: 'Skills', icon: 'WrenchScrewdriverIcon' },
        { id: 'projects', name: 'Projects', icon: 'FolderIcon' },
        { id: 'certifications', name: 'Certifications', icon: 'TrophyIcon' },
        { id: 'languages', name: 'Languages', icon: 'LanguageIcon' },
        { id: 'settings', name: 'Settings', icon: 'CogIcon' }
      ]
    }
  },
  computed: {
    currentSectionComponent() {
      const sectionMap = {
        personalInfo: 'PersonalInfoEditor',
        experience: 'ExperienceEditor',
        education: 'EducationEditor',
        skills: 'SkillsEditor',
        projects: 'ProjectsEditor',
        certifications: 'CertificationsEditor',
        languages: 'LanguagesEditor',
        settings: 'SettingsEditor'
      }
      return sectionMap[this.resumeStore.ui.currentSection] || 'PersonalInfoEditor'
    }
  },
  methods: {
    togglePreview() {
      this.resumeStore.togglePreviewMode()
    },
    
    toggleSidebar() {
      this.resumeStore.toggleSidebar()
    },
    
    setCurrentSection(section) {
      this.resumeStore.setCurrentSection(section)
    },
    
    async exportToPDF() {
      try {
        const element = document.getElementById('resume-preview')
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true
        })
        
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p', 'mm', 'a4')
        const imgWidth = 210
        const pageHeight = 295
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        let heightLeft = imgHeight
        
        let position = 0
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
        
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight
        }
        
        pdf.save(`${this.resumeStore.fullName}_Resume.pdf`)
        this.toast.success('Resume exported as PDF successfully!')
      } catch (error) {
        console.error('Error exporting PDF:', error)
        this.toast.error('Failed to export PDF')
      }
      this.showExportMenu = false
    },
    
    printResume() {
      window.print()
      this.showExportMenu = false
    },
    
    shareResume() {
      const url = window.location.href
      navigator.clipboard.writeText(url).then(() => {
        this.toast.success('Resume link copied to clipboard!')
      })
      this.showExportMenu = false
    },
    
    exportData() {
      const data = this.resumeStore.exportData()
      const blob = new Blob([data], { type: 'application/json' })
      saveAs(blob, `${this.resumeStore.fullName}_resume_data.json`)
      this.toast.success('Resume data exported successfully!')
      this.showExportMenu = false
    },
    
    importData() {
      this.showImportModal = true
      this.showExportMenu = false
    },
    
    handleImportData() {
      if (this.resumeStore.importData(this.importJsonData)) {
        this.toast.success('Resume data imported successfully!')
        this.showImportModal = false
        this.importJsonData = ''
      } else {
        this.toast.error('Invalid JSON data. Please check your input.')
      }
    }
  },
  mounted() {
    // Close export menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.relative')) {
        this.showExportMenu = false
      }
    })
  }
}
</script>

<style scoped>
@media print {
  header, aside, .no-print {
    display: none !important;
  }
  
  main {
    padding: 0 !important;
    background: white !important;
  }
  
  #resume-preview {
    box-shadow: none !important;
    border: none !important;
  }
}
</style>