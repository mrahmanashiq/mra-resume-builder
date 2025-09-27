<template>
  <div class="resume-template minimalist-template" 
       :style="templateStyles"
       :class="['bg-white', `font-${resumeStore.settings.font}`]">
    
    <!-- Minimalist Header -->
    <header class="resume-header border-b border-gray-200">
      <div class="p-8 md:p-12">
        <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          
          <!-- Personal Info -->
          <div class="flex-1">
            <h1 class="text-3xl md:text-4xl font-light text-gray-900 mb-2">
              {{ resumeStore.fullName }}
            </h1>
            <h2 v-if="resumeStore.personalInfo.title" 
                class="text-lg text-gray-600 mb-4 font-light">
              {{ resumeStore.personalInfo.title }}
            </h2>
            
            <!-- Summary -->
            <p v-if="resumeStore.personalInfo.summary" 
               class="text-gray-700 leading-relaxed max-w-2xl font-light">
              {{ resumeStore.personalInfo.summary }}
            </p>
          </div>
          
          <!-- Profile Image & Contact -->
          <div class="flex flex-col items-center md:items-end">
            <!-- Profile Image -->
            <div v-if="resumeStore.settings.showProfileImage && resumeStore.personalInfo.profileImage" 
                 class="mb-4">
              <img :src="resumeStore.personalInfo.profileImage" 
                   :alt="`${resumeStore.fullName} profile picture`"
                   class="w-20 h-20 rounded-full object-cover border border-gray-200">
            </div>
            
            <!-- Contact Information -->
            <div class="space-y-2 text-gray-600 text-sm text-center md:text-right">
              <div v-if="resumeStore.personalInfo.email">
                {{ resumeStore.personalInfo.email }}
              </div>
              <div v-if="resumeStore.personalInfo.phone">
                {{ resumeStore.personalInfo.phone }}
              </div>
              <div v-if="resumeStore.personalInfo.address">
                {{ resumeStore.personalInfo.address }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="resume-content p-8 md:p-12">
      
      <!-- Experience -->
      <section v-if="resumeStore.settings.sectionsEnabled.experience && resumeStore.experience.length" 
               class="resume-section mb-16">
        <h3 class="section-title text-sm font-medium text-gray-900 mb-8 uppercase tracking-wider">
          Experience
        </h3>
        <div class="space-y-12">
          <div v-for="exp in resumeStore.sortedExperience" 
               :key="exp.id" 
               class="border-l border-gray-200 pl-8">
            <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
              <div class="flex-1">
                <h4 class="text-lg font-medium text-gray-900">{{ exp.title }}</h4>
                <div class="text-gray-600 font-light">
                  {{ exp.company }}
                  <span v-if="exp.location"> • {{ exp.location }}</span>
                </div>
              </div>
              <div class="text-gray-500 text-sm font-light mt-1 md:mt-0">
                {{ formatDateRange(exp.startDate, exp.endDate, exp.current) }}
              </div>
            </div>
            
            <p v-if="exp.description" class="text-gray-700 mb-6 font-light leading-relaxed">{{ exp.description }}</p>
            
            <ul v-if="exp.achievements && exp.achievements.length" 
                class="space-y-3 text-gray-700 font-light">
              <li v-for="achievement in exp.achievements" 
                  :key="achievement" 
                  v-show="achievement.trim()"
                  class="flex items-start">
                <span class="text-gray-300 mr-4 mt-2">—</span>
                <span>{{ achievement }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-16">
          
          <!-- Projects -->
          <section v-if="resumeStore.settings.sectionsEnabled.projects && resumeStore.projects.length" 
                   class="resume-section">
            <h3 class="section-title text-sm font-medium text-gray-900 mb-8 uppercase tracking-wider">
              Projects
            </h3>
            <div class="space-y-10">
              <div v-for="project in resumeStore.projects" 
                   :key="project.id" 
                   class="border-l border-gray-200 pl-8">
                <h4 class="text-lg font-medium text-gray-900 mb-2">{{ project.name }}</h4>
                <p v-if="project.description" class="text-gray-700 mb-4 font-light">{{ project.description }}</p>
                
                <div v-if="project.technologies && project.technologies.length" 
                     class="flex flex-wrap gap-3 mb-4">
                  <span v-for="tech in project.technologies" 
                        :key="tech"
                        class="text-gray-600 text-sm font-light">
                    {{ tech }}
                  </span>
                </div>
                
                <a v-if="project.url" 
                   :href="project.url"
                   class="text-gray-500 hover:text-gray-700 text-sm font-light underline">
                  {{ project.url }}
                </a>
              </div>
            </div>
          </section>

          <!-- Education -->
          <section v-if="resumeStore.settings.sectionsEnabled.education && resumeStore.education.length" 
                   class="resume-section">
            <h3 class="section-title text-sm font-medium text-gray-900 mb-8 uppercase tracking-wider">
              Education
            </h3>
            <div class="space-y-8">
              <div v-for="edu in resumeStore.education" 
                   :key="edu.id"
                   class="border-l border-gray-200 pl-8">
                <h4 class="font-medium text-gray-900">{{ edu.degree }}</h4>
                <div class="text-gray-600 font-light">{{ edu.institution }}</div>
                <div class="text-gray-500 text-sm font-light">
                  <span v-if="edu.location">{{ edu.location }} • </span>
                  {{ formatDateRange(edu.startDate, edu.endDate) }}
                  <span v-if="edu.gpa" class="ml-2">GPA: {{ edu.gpa }}</span>
                </div>
                <p v-if="edu.description" class="text-gray-700 text-sm mt-2 font-light">{{ edu.description }}</p>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Column -->
        <div class="space-y-16">
          
          <!-- Skills -->
          <section v-if="resumeStore.settings.sectionsEnabled.skills && resumeStore.skills.length" 
                   class="resume-section">
            <h3 class="section-title text-sm font-medium text-gray-900 mb-8 uppercase tracking-wider">
              Skills
            </h3>
            <div class="space-y-8">
              <div v-for="(skills, category) in resumeStore.skillsByCategory" 
                   :key="category">
                <h4 class="font-medium text-gray-800 mb-4 text-sm">{{ category }}</h4>
                <div class="space-y-3">
                  <div v-for="skill in skills" :key="skill.id" class="text-gray-700 font-light text-sm">
                    {{ skill.name }}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Certifications -->
          <section v-if="resumeStore.settings.sectionsEnabled.certifications && resumeStore.certifications.length" 
                   class="resume-section">
            <h3 class="section-title text-sm font-medium text-gray-900 mb-8 uppercase tracking-wider">
              Certifications
            </h3>
            <div class="space-y-6">
              <div v-for="cert in resumeStore.activeCertifications" 
                   :key="cert.id">
                <h4 class="font-medium text-gray-900 text-sm">{{ cert.name }}</h4>
                <div class="text-gray-600 text-sm font-light">{{ cert.issuer }}</div>
                <div class="text-gray-500 text-xs font-light">
                  {{ formatDate(cert.date) }}
                  <span v-if="cert.credentialId" class="ml-2">{{ cert.credentialId }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Languages -->
          <section v-if="resumeStore.settings.sectionsEnabled.languages && resumeStore.languages.length" 
                   class="resume-section">
            <h3 class="section-title text-sm font-medium text-gray-900 mb-8 uppercase tracking-wider">
              Languages
            </h3>
            <div class="space-y-3">
              <div v-for="lang in resumeStore.languages" 
                   :key="lang.id"
                   class="flex justify-between items-center">
                <span class="text-gray-900 font-light text-sm">{{ lang.name }}</span>
                <span class="text-gray-500 text-xs font-light">{{ lang.level }}</span>
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

export default {
  name: 'MinimalistTemplate',
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
.minimalist-template {
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

@media print {
  .minimalist-template {
    box-shadow: none;
    max-width: none;
    margin: 0;
  }
}

@media (max-width: 768px) {
  .minimalist-template {
    max-width: 100%;
    margin: 0;
    box-shadow: none;
  }
}
</style>