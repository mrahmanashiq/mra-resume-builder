<template>
  <div class="resume-template classic-template" 
       :style="templateStyles"
       :class="['bg-white', `font-${resumeStore.settings.font}`]">
    
    <!-- Classic Header -->
    <header class="resume-header border-b-4 border-gray-800">
      <div class="p-8 md:p-12 text-center">
        
        <!-- Profile Image -->
        <div v-if="resumeStore.settings.showProfileImage && resumeStore.personalInfo.profileImage" 
             class="mb-6">
          <img :src="resumeStore.personalInfo.profileImage" 
               :alt="`${resumeStore.fullName} profile picture`"
               class="w-24 h-24 rounded-full object-cover mx-auto border-4 border-gray-300">
        </div>
        
        <!-- Personal Info -->
        <h1 class="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2">
          {{ resumeStore.fullName }}
        </h1>
        <h2 v-if="resumeStore.personalInfo.title" 
            class="text-xl md:text-2xl font-serif text-gray-700 mb-6">
          {{ resumeStore.personalInfo.title }}
        </h2>
        
        <!-- Contact Information -->
        <div class="flex flex-wrap justify-center gap-6 text-gray-700">
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
      </div>
    </header>

    <!-- Summary -->
    <section v-if="resumeStore.personalInfo.summary" class="p-8 md:p-12 bg-gray-50">
      <h3 class="text-xl font-serif font-bold text-gray-900 mb-4 text-center">Professional Summary</h3>
      <p class="text-gray-700 text-center leading-relaxed max-w-4xl mx-auto">
        {{ resumeStore.personalInfo.summary }}
      </p>
    </section>

    <!-- Main Content -->
    <main class="resume-content p-8 md:p-12">
      
      <!-- Experience -->
      <section v-if="resumeStore.settings.sectionsEnabled.experience && resumeStore.experience.length" 
               class="resume-section mb-12">
        <h3 class="section-title text-2xl font-serif font-bold text-gray-900 mb-8 text-center border-b-2 border-gray-800 pb-2">
          Professional Experience
        </h3>
        <div class="space-y-8">
          <div v-for="exp in resumeStore.sortedExperience" 
               :key="exp.id" 
               class="border-b border-gray-200 pb-8 last:border-b-0">
            <div class="text-center mb-4">
              <h4 class="text-xl font-serif font-bold text-gray-900">{{ exp.title }}</h4>
              <div class="text-lg text-gray-700 font-semibold mt-1">
                {{ exp.company }}
                <span v-if="exp.location" class="text-gray-600"> • {{ exp.location }}</span>
              </div>
              <div class="text-gray-600 mt-1 font-medium">
                {{ formatDateRange(exp.startDate, exp.endDate, exp.current) }}
              </div>
            </div>
            
            <p v-if="exp.description" class="text-gray-700 mb-4 text-center italic">{{ exp.description }}</p>
            
            <ul v-if="exp.achievements && exp.achievements.length" 
                class="space-y-2 text-gray-700 max-w-4xl mx-auto">
              <li v-for="achievement in exp.achievements" 
                  :key="achievement" 
                  v-show="achievement.trim()"
                  class="flex items-start">
                <span class="text-gray-400 mr-3 mt-1">•</span>
                <span>{{ achievement }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        <!-- Left Column -->
        <div class="space-y-10">
          
          <!-- Education -->
          <section v-if="resumeStore.settings.sectionsEnabled.education && resumeStore.education.length" 
                   class="resume-section">
            <h3 class="section-title text-xl font-serif font-bold text-gray-900 mb-6 text-center border-b border-gray-300 pb-2">
              Education
            </h3>
            <div class="space-y-6">
              <div v-for="edu in resumeStore.education" 
                   :key="edu.id"
                   class="text-center">
                <h4 class="font-serif font-bold text-gray-900">{{ edu.degree }}</h4>
                <div class="text-gray-700 font-semibold">{{ edu.institution }}</div>
                <div class="text-gray-600 text-sm">
                  <span v-if="edu.location">{{ edu.location }} • </span>
                  {{ formatDateRange(edu.startDate, edu.endDate) }}
                  <span v-if="edu.gpa" class="ml-2 font-medium">GPA: {{ edu.gpa }}</span>
                </div>
                <p v-if="edu.description" class="text-gray-700 text-sm mt-2 italic">{{ edu.description }}</p>
              </div>
            </div>
          </section>

          <!-- Certifications -->
          <section v-if="resumeStore.settings.sectionsEnabled.certifications && resumeStore.certifications.length" 
                   class="resume-section">
            <h3 class="section-title text-xl font-serif font-bold text-gray-900 mb-6 text-center border-b border-gray-300 pb-2">
              Certifications
            </h3>
            <div class="space-y-4">
              <div v-for="cert in resumeStore.activeCertifications" 
                   :key="cert.id"
                   class="text-center">
                <h4 class="font-serif font-semibold text-gray-900">{{ cert.name }}</h4>
                <div class="text-gray-700">{{ cert.issuer }}</div>
                <div class="text-gray-600 text-sm">
                  {{ formatDate(cert.date) }}
                  <span v-if="cert.credentialId" class="ml-2">ID: {{ cert.credentialId }}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Column -->
        <div class="space-y-10">
          
          <!-- Skills -->
          <section v-if="resumeStore.settings.sectionsEnabled.skills && resumeStore.skills.length" 
                   class="resume-section">
            <h3 class="section-title text-xl font-serif font-bold text-gray-900 mb-6 text-center border-b border-gray-300 pb-2">
              Core Competencies
            </h3>
            <div class="space-y-6">
              <div v-for="(skills, category) in resumeStore.skillsByCategory" 
                   :key="category">
                <h4 class="font-serif font-semibold text-gray-800 mb-3 text-center">{{ category }}</h4>
                <div class="flex flex-wrap justify-center gap-2">
                  <span v-for="skill in skills" 
                        :key="skill.id"
                        class="px-3 py-1 bg-gray-100 text-gray-800 text-sm border border-gray-300">
                    {{ skill.name }}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <!-- Projects -->
          <section v-if="resumeStore.settings.sectionsEnabled.projects && resumeStore.projects.length" 
                   class="resume-section">
            <h3 class="section-title text-xl font-serif font-bold text-gray-900 mb-6 text-center border-b border-gray-300 pb-2">
              Notable Projects
            </h3>
            <div class="space-y-6">
              <div v-for="project in resumeStore.projects" 
                   :key="project.id" 
                   class="text-center">
                <h4 class="font-serif font-bold text-gray-900 mb-2">{{ project.name }}</h4>
                <p v-if="project.description" class="text-gray-700 mb-3 text-sm">{{ project.description }}</p>
                
                <div v-if="project.technologies && project.technologies.length" 
                     class="flex flex-wrap justify-center gap-1 mb-3">
                  <span v-for="tech in project.technologies" 
                        :key="tech"
                        class="px-2 py-1 bg-gray-200 text-gray-700 text-xs">
                    {{ tech }}
                  </span>
                </div>
                
                <a v-if="project.url" 
                   :href="project.url"
                   class="text-gray-600 hover:text-gray-800 text-sm underline">
                  View Project
                </a>
              </div>
            </div>
          </section>

          <!-- Languages -->
          <section v-if="resumeStore.settings.sectionsEnabled.languages && resumeStore.languages.length" 
                   class="resume-section">
            <h3 class="section-title text-xl font-serif font-bold text-gray-900 mb-6 text-center border-b border-gray-300 pb-2">
              Languages
            </h3>
            <div class="space-y-3">
              <div v-for="lang in resumeStore.languages" 
                   :key="lang.id"
                   class="flex justify-between items-center">
                <span class="text-gray-900 font-medium">{{ lang.name }}</span>
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
import { useResumeStore } from '../../stores/resume'
import { format, parseISO } from 'date-fns'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'ClassicTemplate',
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
.classic-template {
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  font-family: Georgia, 'Times New Roman', serif;
}

@media print {
  .classic-template {
    box-shadow: none;
    max-width: none;
    margin: 0;
  }
}

@media (max-width: 768px) {
  .classic-template {
    max-width: 100%;
    margin: 0;
    box-shadow: none;
  }
}
</style>