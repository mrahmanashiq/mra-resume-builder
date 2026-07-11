<template>
  <!-- Template Selector - Renders different template layouts -->
  <ModernTemplate v-if="resumeStore.settings.template === 'modern'" />
  <ClassicTemplate v-else-if="resumeStore.settings.template === 'classic'" />
  <CreativeTemplate v-else-if="resumeStore.settings.template === 'creative'" />
  <MinimalistTemplate v-else-if="resumeStore.settings.template === 'minimalist'" />
  <AtsResumeTemplate v-else-if="resumeStore.settings.template === 'ats'" />
  <DeveloperResumeTemplate v-else-if="resumeStore.settings.template === 'developer'" />
  <SidebarResumeTemplate v-else-if="resumeStore.settings.template === 'sidebar'" />
  <AcademicResumeTemplate v-else-if="resumeStore.settings.template === 'academic'" />
  <ColorfulResumeTemplate v-else-if="resumeStore.settings.template === 'colorful'" />
  <CorporateCvTemplate v-else-if="resumeStore.settings.template === 'corporate'" />
  <ResearcherCvTemplate v-else-if="resumeStore.settings.template === 'researcher'" />
  <AcademicPortfolioTemplate v-else-if="resumeStore.settings.template === 'academicPortfolio'" />

  <!-- Default Fallback Template -->
  <div v-else class="resume-template" 
       :style="templateStyles"
       :class="['bg-white', `font-${resumeStore.settings.font}`, `text-${resumeStore.settings.fontSize}`]">
    
    <!-- Header Section -->
    <header class="resume-header relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-10"></div>
      <div class="relative z-10 p-8 md:p-12">
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
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              {{ resumeStore.fullName }}
            </h1>
            <h2 class="text-xl md:text-2xl text-primary-600 font-medium mb-2">
              {{ resumeStore.personalInfo.title }}
            </h2>

            <p v-if="resumeStore.personalInfo.headerTagline" class="text-gray-600 mb-4">
              {{ resumeStore.personalInfo.headerTagline }}
            </p>

            <!-- Contact Information -->
            <div class="flex flex-wrap justify-center md:justify-start gap-4 text-gray-600">
              <div v-if="resumeStore.personalInfo.email" class="flex items-center space-x-2">
                <EnvelopeIcon class="w-4 h-4" />
                <span>{{ resumeStore.personalInfo.email }}</span>
              </div>
              <div v-if="resumeStore.personalInfo.phone" class="flex items-center space-x-2">
                <PhoneIcon class="w-4 h-4" />
                <span>{{ resumeStore.personalInfo.phone }}</span>
              </div>
              <div v-if="resumeStore.personalInfo.address" class="flex items-center space-x-2">
                <MapPinIcon class="w-4 h-4" />
                <span>{{ resumeStore.personalInfo.address }}</span>
              </div>
            </div>
            
            <!-- Professional Links -->
            <div v-if="hasLinks" class="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-primary-600">
              <a v-if="resumeStore.personalInfo.linkedin" 
                 :href="formatUrl(resumeStore.personalInfo.linkedin)"
                 class="flex items-center space-x-2 hover:text-primary-700">
                <span class="text-sm">{{ resumeStore.personalInfo.linkedinLabel || 'LinkedIn' }}</span>
              </a>
              <a v-if="resumeStore.personalInfo.github" 
                 :href="formatUrl(resumeStore.personalInfo.github)"
                 class="flex items-center space-x-2 hover:text-primary-700">
                <span class="text-sm">{{ resumeStore.personalInfo.githubLabel || 'GitHub' }}</span>
              </a>
              <a v-if="resumeStore.personalInfo.website"
                 :href="formatUrl(resumeStore.personalInfo.website)"
                 class="flex items-center space-x-2 hover:text-primary-700">
                <GlobeAltIcon class="w-4 h-4" />
                <span class="text-sm">{{ resumeStore.personalInfo.websiteLabel || 'Portfolio' }}</span>
              </a>
              <a v-for="link in customLinks" :key="link.id"
                 :href="formatUrl(link.url)"
                 class="flex items-center space-x-2 hover:text-primary-700">
                <span class="text-sm">{{ link.label || link.url }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="resume-content">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 md:p-12">
        
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Professional Summary -->
          <section v-if="resumeStore.settings.sectionsEnabled.summary && resumeStore.personalInfo.summary" 
                   class="resume-section print-avoid-break">
            <h3 class="section-title">Professional Summary</h3>
            <p class="text-gray-700 leading-relaxed">{{ resumeStore.personalInfo.summary }}</p>
          </section>

          <!-- Experience -->
          <section v-if="resumeStore.settings.sectionsEnabled.experience && resumeStore.experience.length" 
                   class="resume-section">
            <h3 class="section-title">Professional Experience</h3>
            <div class="space-y-6">
              <div v-for="exp in resumeStore.sortedExperience" 
                   :key="exp.id" 
                   class="print-avoid-break">
                <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                  <div>
                    <h4 class="text-lg font-semibold text-gray-900">{{ exp.title }}</h4>
                    <div class="text-primary-600 font-medium">
                      <a v-if="exp.url" :href="formatUrl(exp.url)" class="doc-link" target="_blank" rel="noopener">{{ exp.company }}</a><template v-else>{{ exp.company }}</template>
                      <span v-if="exp.location" class="text-gray-600"> • {{ exp.location }}</span>
                    </div>
                  </div>
                  <div class="text-gray-600 text-sm mt-1 md:mt-0">
                    {{ formatDateRange(exp.startDate, exp.endDate, exp.current) }}
                  </div>
                </div>
                
                <p v-if="exp.description" class="text-gray-700 mb-3">{{ exp.description }}</p>
                
                <ul v-if="exp.achievements && exp.achievements.length" 
                    class="list-disc list-inside space-y-1 text-gray-700">
                  <li v-for="achievement in exp.achievements" 
                      :key="achievement" 
                      v-show="achievement.trim()">
                    {{ achievement }}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <!-- Projects -->
          <section v-if="resumeStore.settings.sectionsEnabled.projects && resumeStore.projects.length" 
                   class="resume-section">
            <h3 class="section-title">Featured Projects</h3>
            <div class="space-y-6">
              <div v-for="project in resumeStore.projects" 
                   :key="project.id" 
                   class="print-avoid-break">
                <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                  <h4 class="text-lg font-semibold text-gray-900">{{ project.name }}</h4>
                  <div class="text-gray-600 text-sm mt-1 md:mt-0">
                    {{ formatDateRange(project.startDate, project.endDate) }}
                  </div>
                </div>
                
                <p v-if="project.description" class="text-gray-700 mb-3">{{ project.description }}</p>
                
                <div v-if="project.technologies && project.technologies.length" 
                     class="flex flex-wrap gap-2 mb-2">
                  <span v-for="tech in project.technologies" 
                        :key="tech"
                        class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {{ tech }}
                  </span>
                </div>
                
                <a v-if="project.url"
                   :href="formatUrl(project.url)"
                   target="_blank" rel="noopener"
                   class="text-primary-600 hover:text-primary-700 text-sm">
                  Code
                </a>
                <a v-if="project.liveUrl"
                   :href="formatUrl(project.liveUrl)"
                   target="_blank" rel="noopener"
                   class="text-primary-600 hover:text-primary-700 text-sm ml-4">
                  Live
                </a>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Column -->
        <div class="space-y-8">
          
          <!-- Skills -->
          <section v-if="resumeStore.settings.sectionsEnabled.skills && resumeStore.skills.length" 
                   class="resume-section print-avoid-break">
            <h3 class="section-title">Skills</h3>
            <div class="space-y-4">
              <div v-for="(skills, category) in resumeStore.skillsByCategory" 
                   :key="category">
                <h4 class="font-medium text-gray-900 mb-2">{{ category }}</h4>
                <div class="space-y-2">
                  <div v-for="skill in skills" :key="skill.id">
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-sm text-gray-700">{{ skill.name }}</span>
                      <span class="text-xs text-gray-500">{{ skill.level }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                           :style="{ width: skill.level + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Education -->
          <section v-if="resumeStore.settings.sectionsEnabled.education && resumeStore.education.length" 
                   class="resume-section print-avoid-break">
            <h3 class="section-title">Education</h3>
            <div class="space-y-4">
              <div v-for="edu in resumeStore.education" 
                   :key="edu.id">
                <h4 class="font-semibold text-gray-900">{{ edu.degree }}</h4>
                <div class="text-primary-600 font-medium"><a v-if="edu.url" :href="formatUrl(edu.url)" class="doc-link" target="_blank" rel="noopener">{{ edu.institution }}</a><template v-else>{{ edu.institution }}</template></div>
                <div class="text-gray-600 text-sm">
                  <span v-if="edu.location">{{ edu.location }} • </span>
                  {{ formatDateRange(edu.startDate, edu.endDate) }}
                  <span v-if="edu.gpa" class="ml-2">GPA: {{ edu.gpa }}</span>
                </div>
                <p v-if="edu.description" class="text-gray-700 text-sm mt-1">{{ edu.description }}</p>
              </div>
            </div>
          </section>

          <!-- Certifications -->
          <section v-if="resumeStore.settings.sectionsEnabled.certifications && resumeStore.certifications.length" 
                   class="resume-section print-avoid-break">
            <h3 class="section-title">Certifications</h3>
            <div class="space-y-3">
              <div v-for="cert in resumeStore.activeCertifications" 
                   :key="cert.id">
                <h4 class="font-semibold text-gray-900 text-sm">{{ cert.name }}</h4>
                <div class="text-primary-600 text-sm">{{ cert.issuer }}</div>
                <div class="text-gray-600 text-xs">
                  {{ formatDate(cert.date) }}
                  <span v-if="cert.credentialId" class="ml-2">ID: {{ cert.credentialId }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Languages -->
          <section v-if="resumeStore.settings.sectionsEnabled.languages && resumeStore.languages.length" 
                   class="resume-section print-avoid-break">
            <h3 class="section-title">Languages</h3>
            <div class="space-y-2">
              <div v-for="lang in resumeStore.languages" 
                   :key="lang.id"
                   class="flex justify-between items-center">
                <span class="text-gray-900">{{ lang.name }}</span>
                <span class="text-gray-600 text-sm">{{ lang.level }}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { useResumeStore } from '../../stores/resume'
import { format, parseISO } from 'date-fns'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  GlobeAltIcon 
} from '@heroicons/vue/24/outline'

// Dynamic imports for code splitting
const ModernTemplate = defineAsyncComponent(() => import('./ModernTemplate.vue'))
const ClassicTemplate = defineAsyncComponent(() => import('./ClassicTemplate.vue'))
const CreativeTemplate = defineAsyncComponent(() => import('./CreativeTemplate.vue'))
const MinimalistTemplate = defineAsyncComponent(() => import('./MinimalistTemplate.vue'))
const AtsResumeTemplate = defineAsyncComponent(() => import('./AtsResumeTemplate.vue'))
const DeveloperResumeTemplate = defineAsyncComponent(() => import('./DeveloperResumeTemplate.vue'))
const SidebarResumeTemplate = defineAsyncComponent(() => import('./SidebarResumeTemplate.vue'))
const AcademicResumeTemplate = defineAsyncComponent(() => import('./AcademicResumeTemplate.vue'))
const ColorfulResumeTemplate = defineAsyncComponent(() => import('./ColorfulResumeTemplate.vue'))
const CorporateCvTemplate = defineAsyncComponent(() => import('./CorporateCvTemplate.vue'))
const ResearcherCvTemplate = defineAsyncComponent(() => import('./ResearcherCvTemplate.vue'))
const AcademicPortfolioTemplate = defineAsyncComponent(() => import('./AcademicPortfolioTemplate.vue'))

export default {
  name: 'ResumeTemplate',
  components: {
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    GlobeAltIcon,
    ModernTemplate,
    ClassicTemplate,
    CreativeTemplate,
    MinimalistTemplate,
    AtsResumeTemplate,
    DeveloperResumeTemplate,
    SidebarResumeTemplate,
    AcademicResumeTemplate,
    ColorfulResumeTemplate,
    CorporateCvTemplate,
    ResearcherCvTemplate,
    AcademicPortfolioTemplate
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
        '--accent': colors.accent,
        '--text': colors.text,
        '--background': colors.background,
        '--fs-scale': this.resumeStore.settings.fontSize / 14,
        '--fs-heading': this.resumeStore.settings.headingScale || 1,
        '--fs-body': this.resumeStore.settings.bodyScale || 1,
        '--fs-detail': this.resumeStore.settings.detailScale || 1,
        fontSize: `${this.resumeStore.settings.fontSize * (this.resumeStore.settings.bodyScale || 1)}px`,
        fontFamily: this.resumeStore.settings.font
      }
    },
    
    hasLinks() {
      return this.resumeStore.personalInfo.linkedin ||
             this.resumeStore.personalInfo.github ||
             this.resumeStore.personalInfo.website ||
             this.customLinks.length
    },
    customLinks() {
      return (this.resumeStore.customLinks || []).filter(l => l && l.url)
    }
  },
  methods: {
    formatUrl(url) {
      if (!url) return ''
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url
      }
      return `https://${url}`
    },
    
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

<style scoped src="./ResumeTemplate.css"></style>