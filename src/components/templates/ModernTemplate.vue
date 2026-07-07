<template>
  <div class="resume-template modern-template" 
       :style="templateStyles"
       :class="['bg-white', `font-${resumeStore.settings.font}`]">
    
    <!-- Modern Header with Gradient -->
    <header class="resume-header bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div class="p-8 md:p-12">
        <div class="flex flex-col md:flex-row items-center md:items-start gap-8">
          
          <!-- Profile Image -->
          <div v-if="resumeStore.settings.showProfileImage && resumeStore.personalInfo.profileImage" 
               class="flex-shrink-0">
            <img :src="resumeStore.personalInfo.profileImage" 
                 :alt="`${resumeStore.fullName} profile picture`"
                 class="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg">
          </div>
          
          <!-- Personal Info -->
          <div class="flex-1 text-center md:text-left">
            <h1 class="text-4xl md:text-5xl font-bold mb-2">
              {{ resumeStore.fullName }}
            </h1>
            <h2 class="text-xl md:text-2xl font-light mb-4 opacity-90">
              {{ resumeStore.personalInfo.title }}
            </h2>
            
            <!-- Summary -->
            <p v-if="resumeStore.personalInfo.summary" class="text-lg opacity-80 mb-4 max-w-2xl">
              {{ resumeStore.personalInfo.summary }}
            </p>
            
            <!-- Contact Information -->
            <div class="flex flex-wrap justify-center md:justify-start gap-6 text-white opacity-90">
              <div v-if="resumeStore.personalInfo.email" class="flex items-center space-x-2">
                <EnvelopeIcon class="w-5 h-5" />
                <span>{{ resumeStore.personalInfo.email }}</span>
              </div>
              <div v-if="resumeStore.personalInfo.phone" class="flex items-center space-x-2">
                <PhoneIcon class="w-5 h-5" />
                <span>{{ resumeStore.personalInfo.phone }}</span>
              </div>
              <div v-if="resumeStore.personalInfo.address" class="flex items-center space-x-2">
                <MapPinIcon class="w-5 h-5" />
                <span>{{ resumeStore.personalInfo.address }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="resume-content p-8 md:p-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-10">
          
          <!-- Experience (compact) -->
          <section v-if="resumeStore.settings.sectionsEnabled.experience && resumeStore.experience.length"
                   class="resume-section">
            <h3 class="section-title text-xl font-bold text-blue-600 mb-4 border-b-2 border-blue-600 pb-1">
              Professional Experience
            </h3>
            <div class="space-y-4">
              <div v-for="exp in resumeStore.sortedExperience"
                   :key="exp.id"
                   class="relative pl-5 border-l-2 border-blue-200 print-avoid-break">
                <div class="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                <div class="flex flex-col md:flex-row md:justify-between md:items-baseline gap-x-3">
                  <h4 class="font-bold text-gray-900 leading-snug">
                    {{ exp.title }}
                    <span class="text-blue-600 font-semibold">· {{ exp.company }}</span>
                    <span v-if="exp.location" class="text-gray-500 font-normal text-sm"> · {{ exp.location }}</span>
                  </h4>
                  <div class="text-gray-500 text-sm whitespace-nowrap flex-shrink-0">
                    {{ formatDateRange(exp.startDate, exp.endDate, exp.current) }}
                  </div>
                </div>

                <p v-if="exp.description" class="text-gray-700 text-sm mt-1">{{ exp.description }}</p>

                <ul v-if="exp.achievements && exp.achievements.length"
                    class="mt-1 space-y-0.5 text-sm text-gray-700">
                  <li v-for="achievement in exp.achievements"
                      :key="achievement"
                      v-show="achievement.trim()"
                      class="flex items-start">
                    <span class="text-blue-500 mr-2 leading-snug">▸</span>
                    <span class="leading-snug">{{ achievement }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <!-- Projects -->
          <section v-if="resumeStore.settings.sectionsEnabled.projects && resumeStore.projects.length" 
                   class="resume-section">
            <h3 class="section-title text-2xl font-bold text-purple-600 mb-6 border-b-2 border-purple-600 pb-2">
              Featured Projects
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="project in resumeStore.projects" 
                   :key="project.id" 
                   class="bg-gray-50 p-6 rounded-lg border-l-4 border-purple-500">
                <h4 class="text-lg font-bold text-gray-900 mb-2">{{ project.name }}</h4>
                <p v-if="project.description" class="text-gray-700 mb-4">{{ project.description }}</p>
                
                <div v-if="project.technologies && project.technologies.length" 
                     class="flex flex-wrap gap-2 mb-4">
                  <span v-for="tech in project.technologies" 
                        :key="tech"
                        class="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                    {{ tech }}
                  </span>
                </div>
                
                <a v-if="project.url" 
                   :href="project.url"
                   class="text-purple-600 hover:text-purple-700 font-medium">
                  View Project →
                </a>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Column -->
        <div class="space-y-8">
          
          <!-- Skills -->
          <section v-if="resumeStore.settings.sectionsEnabled.skills && resumeStore.skills.length" 
                   class="resume-section">
            <h3 class="section-title text-xl font-bold text-gray-900 mb-4">Skills</h3>
            <div class="space-y-6">
              <div v-for="(skills, category) in resumeStore.skillsByCategory" 
                   :key="category">
                <h4 class="font-semibold text-blue-600 mb-3">{{ category }}</h4>
                <div class="space-y-3">
                  <div v-for="skill in skills" :key="skill.id">
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-gray-700 font-medium">{{ skill.name }}</span>
                      <span class="text-xs text-gray-500">{{ skill.level }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3">
                      <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300" 
                           :style="{ width: skill.level + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Education -->
          <section v-if="resumeStore.settings.sectionsEnabled.education && resumeStore.education.length" 
                   class="resume-section">
            <h3 class="section-title text-xl font-bold text-gray-900 mb-4">Education</h3>
            <div class="space-y-4">
              <div v-for="edu in resumeStore.education" 
                   :key="edu.id"
                   class="border-l-4 border-blue-200 pl-4">
                <h4 class="font-bold text-gray-900">{{ edu.degree }}</h4>
                <div class="text-blue-600 font-semibold">{{ edu.institution }}</div>
                <div class="text-gray-600 text-sm">
                  <span v-if="edu.location">{{ edu.location }} • </span>
                  {{ formatDateRange(edu.startDate, edu.endDate) }}
                  <span v-if="edu.gpa" class="ml-2 font-medium">GPA: {{ edu.gpa }}</span>
                </div>
                <p v-if="edu.description" class="text-gray-700 text-sm mt-2">{{ edu.description }}</p>
              </div>
            </div>
          </section>

          <!-- Certifications -->
          <section v-if="resumeStore.settings.sectionsEnabled.certifications && resumeStore.certifications.length" 
                   class="resume-section">
            <h3 class="section-title text-xl font-bold text-gray-900 mb-4">Certifications</h3>
            <div class="space-y-3">
              <div v-for="cert in resumeStore.activeCertifications" 
                   :key="cert.id"
                   class="bg-yellow-50 p-3 rounded border-l-4 border-yellow-500">
                <h4 class="font-semibold text-gray-900 text-sm">{{ cert.name }}</h4>
                <div class="text-yellow-600 text-sm font-medium">{{ cert.issuer }}</div>
                <div class="text-gray-600 text-xs">
                  {{ formatDate(cert.date) }}
                  <span v-if="cert.credentialId" class="ml-2">ID: {{ cert.credentialId }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Languages -->
          <section v-if="resumeStore.settings.sectionsEnabled.languages && resumeStore.languages.length" 
                   class="resume-section">
            <h3 class="section-title text-xl font-bold text-gray-900 mb-4">Languages</h3>
            <div class="space-y-3">
              <div v-for="lang in resumeStore.languages" 
                   :key="lang.id"
                   class="flex justify-between items-center bg-gray-50 p-3 rounded">
                <span class="text-gray-900 font-medium">{{ lang.name }}</span>
                <span class="text-blue-600 text-sm font-semibold">{{ lang.level }}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { useResumeStore } from '../../stores/resume'
import { format, parseISO } from 'date-fns'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'ModernTemplate',
  components: {
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon
  },
  setup() {
    const resumeStore = useResumeStore()
    return { resumeStore }
  },
  computed: {
    templateStyles() {
      const colors = this.resumeStore.settings.colorScheme
      return {
        '--primary': colors.primary,
        '--secondary': colors.secondary,
        fontSize: `${this.resumeStore.settings.fontSize}px`,
        fontFamily: this.resumeStore.settings.font
      }
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return ''
      try {
        const date = parseISO(dateString + '-01')
        return format(date, 'MMM yyyy')
      } catch {
        return dateString
      }
    },
    
    formatDateRange(startDate, endDate, current = false) {
      const start = startDate ? this.formatDate(startDate) : ''
      const end = current ? 'Present' : (endDate ? this.formatDate(endDate) : '')
      
      if (start && end) {
        return `${start} - ${end}`
      } else if (start) {
        return start
      } else if (end && !current) {
        return end
      }
      return ''
    }
  }
}
</script>

<style scoped>
.modern-template {
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

@media print {
  .modern-template {
    box-shadow: none;
    max-width: none;
    margin: 0;
  }
}

@media (max-width: 768px) {
  .modern-template {
    max-width: 100%;
    margin: 0;
    box-shadow: none;
  }
}
</style>