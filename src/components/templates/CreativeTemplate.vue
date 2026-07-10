<template>
  <div class="resume-template creative-template" 
       :style="templateStyles"
       :class="['bg-white', `font-${resumeStore.settings.font}`]">
    
    <!-- Creative Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-5 min-h-screen">
      
      <!-- Left Sidebar -->
      <div class="lg:col-span-2 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white p-8 flex flex-col gap-8">

        <!-- Profile Section (identity - stays pinned at top) -->
        <div class="text-center">
          <!-- Profile Image -->
          <div v-if="resumeStore.settings.showProfileImage && resumeStore.personalInfo.profileImage" 
               class="mb-6">
            <img :src="resumeStore.personalInfo.profileImage" 
                 :alt="`${resumeStore.fullName} profile picture`"
                 class="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg">
          </div>
          
          <h1 class="text-3xl font-bold mb-2">
            {{ resumeStore.fullName }}
          </h1>
          <h2 v-if="resumeStore.personalInfo.title"
              class="text-lg font-light opacity-90 mb-6">
            {{ resumeStore.personalInfo.title }}
          </h2>

          <!-- Header tagline -->
          <p v-if="resumeStore.personalInfo.headerTagline"
             class="text-sm text-white/80 mb-6">
            {{ resumeStore.personalInfo.headerTagline }}
          </p>

          <!-- Contact Information -->
          <div class="space-y-3 text-white opacity-90">
            <div v-if="resumeStore.personalInfo.email" class="flex items-center justify-center space-x-2">
              <EnvelopeIcon class="w-4 h-4" />
              <span class="text-sm">{{ resumeStore.personalInfo.email }}</span>
            </div>
            <div v-if="resumeStore.personalInfo.phone" class="flex items-center justify-center space-x-2">
              <PhoneIcon class="w-4 h-4" />
              <span class="text-sm">{{ resumeStore.personalInfo.phone }}</span>
            </div>
            <div v-if="resumeStore.personalInfo.address" class="flex items-center justify-center space-x-2">
              <MapPinIcon class="w-4 h-4" />
              <span class="text-sm">{{ resumeStore.personalInfo.address }}</span>
            </div>
          </div>

          <!-- Custom links -->
          <div v-if="customLinkEntries.length"
               class="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4 text-sm text-white/90">
            <a v-for="(link, i) in customLinkEntries" :key="i"
               :href="link.href" target="_blank" rel="noopener"
               class="underline hover:text-white">{{ link.label }}</a>
          </div>
        </div>

        <!-- Summary -->
        <section v-if="resumeStore.personalInfo.summary" :style="{ order: ord('summary') }">
          <h3 class="text-xl font-bold mb-4 border-b-2 border-white/30 pb-2">About Me</h3>
          <p class="text-white/90 leading-relaxed text-sm">
            {{ resumeStore.personalInfo.summary }}
          </p>
        </section>

        <!-- Skills -->
        <section v-if="resumeStore.settings.sectionsEnabled.skills && resumeStore.skills.length" 
                 class="resume-section" :style="{ order: ord('skills') }">
          <h3 class="text-xl font-bold mb-4 border-b-2 border-white/30 pb-2">Skills</h3>
          <div class="space-y-4">
            <div v-for="(skills, category) in resumeStore.skillsByCategory" 
                 :key="category">
              <h4 class="font-semibold text-white/90 mb-2 text-sm">{{ category }}</h4>
              <div class="space-y-2">
                <div v-for="skill in skills" :key="skill.id" class="skill-item">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-white text-sm">{{ skill.name }}</span>
                    <span class="text-xs text-white/70">{{ skill.level }}%</span>
                  </div>
                  <div class="w-full bg-white/20 rounded-full h-2">
                    <div class="bg-white h-2 rounded-full transition-all duration-300" 
                         :style="{ width: skill.level + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Languages -->
        <section v-if="resumeStore.settings.sectionsEnabled.languages && resumeStore.languages.length" 
                 class="resume-section" :style="{ order: ord('languages') }">
          <h3 class="text-xl font-bold mb-4 border-b-2 border-white/30 pb-2">Languages</h3>
          <div class="space-y-2">
            <div v-for="lang in resumeStore.languages" 
                 :key="lang.id"
                 class="flex justify-between items-center">
              <span class="text-white text-sm">{{ lang.name }}</span>
              <span class="text-white/70 text-xs">{{ lang.level }}</span>
            </div>
          </div>
        </section>

        <!-- Certifications -->
        <section v-if="resumeStore.settings.sectionsEnabled.certifications && resumeStore.certifications.length" 
                 class="resume-section" :style="{ order: ord('certifications') }">
          <h3 class="text-xl font-bold mb-4 border-b-2 border-white/30 pb-2">Certifications</h3>
          <div class="space-y-3">
            <div v-for="cert in resumeStore.activeCertifications" 
                 :key="cert.id"
                 class="bg-white/10 p-3 rounded-lg">
              <h4 class="font-semibold text-white text-sm">{{ cert.name }}</h4>
              <div class="text-white/80 text-xs">{{ cert.issuer }}</div>
              <div class="text-white/60 text-xs">
                {{ formatDate(cert.date) }}
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Content Area -->
      <div class="lg:col-span-3 p-8 flex flex-col gap-12">
        
        <!-- Experience -->
        <section v-if="resumeStore.settings.sectionsEnabled.experience && resumeStore.experience.length" 
                 class="resume-section" :style="{ order: ord('experience') }">
          <h3 class="section-title text-3xl font-bold text-gray-900 mb-8 relative">
            <span class="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Experience
            </span>
            <div class="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"></div>
          </h3>
          
          <div class="space-y-8">
            <div v-for="(exp, index) in resumeStore.sortedExperience" 
                 :key="exp.id" 
                 class="relative">
              <!-- Timeline dot -->
              <div class="absolute -left-4 top-0 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <!-- Timeline line -->
              <div v-if="index < resumeStore.sortedExperience.length - 1" 
                   class="absolute -left-3.5 top-3 w-0.5 h-full bg-gradient-to-b from-purple-200 to-transparent"></div>
              
              <div class="pl-8">
                <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                  <div>
                    <h4 class="text-xl font-bold text-gray-900">{{ exp.title }}</h4>
                    <div class="text-purple-600 font-semibold text-lg">
                      {{ exp.company }}
                      <span v-if="exp.location" class="text-gray-600 font-normal"> • {{ exp.location }}</span>
                    </div>
                  </div>
                  <div class="text-gray-600 font-medium mt-1 md:mt-0 bg-purple-50 px-3 py-1 rounded-full text-sm">
                    {{ formatDateRange(exp.startDate, exp.endDate, exp.current) }}
                  </div>
                </div>
                
                <p v-if="exp.description" class="text-gray-700 mb-4">{{ exp.description }}</p>
                
                <ul v-if="exp.achievements && exp.achievements.length" 
                    class="space-y-2 text-gray-700">
                  <li v-for="achievement in exp.achievements" 
                      :key="achievement" 
                      v-show="achievement.trim()"
                      class="flex items-start">
                    <span class="text-purple-500 mr-3 mt-1 font-bold">▸</span>
                    <span>{{ achievement }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- Projects -->
        <section v-if="resumeStore.settings.sectionsEnabled.projects && resumeStore.projects.length" 
                 class="resume-section" :style="{ order: ord('projects') }">
          <h3 class="section-title text-3xl font-bold text-gray-900 mb-8 relative">
            <span class="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Projects
            </span>
            <div class="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"></div>
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="project in resumeStore.projects" 
                 :key="project.id" 
                 class="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
              <h4 class="text-lg font-bold text-gray-900 mb-2">{{ project.name }}</h4>
              <p v-if="project.description" class="text-gray-700 mb-4 text-sm">{{ project.description }}</p>
              
              <div v-if="project.technologies && project.technologies.length" 
                   class="flex flex-wrap gap-2 mb-4">
                <span v-for="tech in project.technologies" 
                      :key="tech"
                      class="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  {{ tech }}
                </span>
              </div>
              
              <a v-if="project.url" 
                 :href="project.url"
                 class="text-purple-600 hover:text-purple-700 font-medium text-sm">
                View Project →
              </a>
            </div>
          </div>
        </section>

        <!-- Education -->
        <section v-if="resumeStore.settings.sectionsEnabled.education && resumeStore.education.length" 
                 class="resume-section" :style="{ order: ord('education') }">
          <h3 class="section-title text-3xl font-bold text-gray-900 mb-8 relative">
            <span class="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Education
            </span>
            <div class="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"></div>
          </h3>
          
          <div class="space-y-6">
            <div v-for="edu in resumeStore.education" 
                 :key="edu.id"
                 class="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
              <h4 class="font-bold text-gray-900 text-lg">{{ edu.degree }}</h4>
              <div class="text-purple-600 font-semibold">{{ edu.institution }}</div>
              <div class="text-gray-600 text-sm">
                <span v-if="edu.location">{{ edu.location }} • </span>
                {{ formatDateRange(edu.startDate, edu.endDate) }}
                <span v-if="edu.gpa" class="ml-2 font-medium">GPA: {{ edu.gpa }}</span>
              </div>
              <p v-if="edu.description" class="text-gray-700 text-sm mt-2">{{ edu.description }}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
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
  name: 'CreativeTemplate',
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
    },
    customLinkEntries() {
      return (this.resumeStore.customLinks || [])
        .filter(l => l && l.label && l.url)
        .map(l => ({ label: l.label, href: this.formatUrl(l.url) }))
    }
  },
  methods: {
    ord(key) {
      const i = this.resumeStore.settings.sectionsOrder.indexOf(key)
      return i === -1 ? 99 : i
    },
    formatUrl(url) {
      if (!url) return ''
      return /^https?:\/\//i.test(url) || url.startsWith('mailto:') ? url : `https://${url}`
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

<style scoped>
.creative-template {
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

@media print {
  .creative-template {
    box-shadow: none;
    max-width: none;
    margin: 0;
  }
}

@media (max-width: 768px) {
  .creative-template {
    max-width: 100%;
    margin: 0;
    box-shadow: none;
  }
  
  .creative-template .grid {
    grid-template-columns: 1fr;
  }
}
</style>