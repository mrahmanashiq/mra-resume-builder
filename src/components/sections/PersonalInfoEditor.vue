<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100">Personal Information</h3>
    </div>

    <!-- Profile Image Upload -->
    <div class="text-center">
      <div class="relative mx-auto w-32 h-32 mb-4">
        <img :src="resumeStore.personalInfo.profileImage" 
             alt="Profile" 
             class="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-slate-700">
        <label class="absolute bottom-0 right-0 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full cursor-pointer transition-colors duration-200">
          <CameraIcon class="w-4 h-4" />
          <input type="file" 
                 @change="handleImageUpload" 
                 accept="image/*" 
                 class="hidden">
        </label>
      </div>
      <p class="text-sm text-gray-600 dark:text-slate-400">Click the camera icon to upload a new photo</p>
    </div>

    <!-- Name Fields -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">First Name</label>
        <input type="text" 
               v-model="resumeStore.personalInfo.firstName"
               @input="updatePersonalInfo('firstName', $event.target.value)"
               class="input-field"
               placeholder="John">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Last Name</label>
        <input type="text" 
               v-model="resumeStore.personalInfo.lastName"
               @input="updatePersonalInfo('lastName', $event.target.value)"
               class="input-field"
               placeholder="Doe">
      </div>
    </div>

    <!-- Professional Title -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Professional Title</label>
      <input type="text" 
             v-model="resumeStore.personalInfo.title"
             @input="updatePersonalInfo('title', $event.target.value)"
             class="input-field"
             placeholder="Full Stack Developer">
    </div>

    <!-- Contact Information -->
    <div class="space-y-4">
      <h4 class="font-medium text-gray-900 dark:text-slate-100">Contact Information</h4>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Email</label>
          <input type="email" 
                 v-model="resumeStore.personalInfo.email"
                 @input="updatePersonalInfo('email', $event.target.value)"
                 class="input-field"
                 placeholder="john.doe@example.com">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Phone</label>
          <input type="tel" 
                 v-model="resumeStore.personalInfo.phone"
                 @input="updatePersonalInfo('phone', $event.target.value)"
                 class="input-field"
                 placeholder="+1 (555) 123-4567">
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Address</label>
        <input type="text" 
               v-model="resumeStore.personalInfo.address"
               @input="updatePersonalInfo('address', $event.target.value)"
               class="input-field"
               placeholder="San Francisco, CA">
      </div>
    </div>

    <!-- Professional Links -->
    <div class="space-y-4">
      <h4 class="font-medium text-gray-900 dark:text-slate-100">Professional Links</h4>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">LinkedIn</label>
          <input type="url" 
                 v-model="resumeStore.personalInfo.linkedin"
                 @input="updatePersonalInfo('linkedin', $event.target.value)"
                 class="input-field"
                 placeholder="linkedin.com/in/johndoe">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">GitHub</label>
          <input type="url" 
                 v-model="resumeStore.personalInfo.github"
                 @input="updatePersonalInfo('github', $event.target.value)"
                 class="input-field"
                 placeholder="github.com/johndoe">
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Website/Portfolio</label>
        <input type="url" 
               v-model="resumeStore.personalInfo.website"
               @input="updatePersonalInfo('website', $event.target.value)"
               class="input-field"
               placeholder="johndoe.dev">
      </div>
    </div>

    <!-- Google Scholar (academic CV) -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Google Scholar (Optional)</label>
      <input type="text"
             v-model="resumeStore.personalInfo.scholar"
             @input="updatePersonalInfo('scholar', $event.target.value)"
             class="input-field"
             placeholder="scholar.google.com/citations?user=...">
      <p class="text-xs text-gray-500 dark:text-slate-400 mt-1">
        Shown in the contact line on the academic CV templates.
      </p>
    </div>

    <!-- Research Interests (academic CV) -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Research Interests (Optional)</label>
      <input type="text"
             v-model="resumeStore.personalInfo.researchInterests"
             @input="updatePersonalInfo('researchInterests', $event.target.value)"
             class="input-field"
             placeholder="Machine Learning, Computer Vision, Deep Learning">
      <p class="text-xs text-gray-500 dark:text-slate-400 mt-1">
        Shown as a one-line summary under your name on the academic CV templates.
      </p>
    </div>

    <!-- Professional Summary -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Professional Summary</label>
      <textarea v-model="resumeStore.personalInfo.summary"
                @input="updatePersonalInfo('summary', $event.target.value)"
                rows="4"
                class="textarea-field"
                placeholder="Write a brief summary of your professional background, key skills, and career objectives..."></textarea>
      <p class="text-xs text-gray-500 dark:text-slate-400 mt-1">
        Tip: Keep it concise (2-3 sentences) and highlight your most relevant skills and experience.
      </p>
    </div>

    <!-- Actions -->
    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-slate-700">
      <button @click="clearForm" class="btn-secondary">
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
import { CameraIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'PersonalInfoEditor',
  components: {
    CameraIcon
  },
  setup() {
    const resumeStore = useResumeStore()
    const toast = useToast()
    
    return { resumeStore, toast }
  },
  methods: {
    updatePersonalInfo(field, value) {
      this.resumeStore.updatePersonalInfo(field, value)
    },
    
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (!file) return
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.toast.error('Image size must be less than 5MB')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        this.updatePersonalInfo('profileImage', e.target.result)
        this.toast.success('Profile image updated!')
      }
      reader.readAsDataURL(file)
    },
    
    clearForm() {
      const confirmClear = confirm('Are you sure you want to clear all personal information?')
      if (confirmClear) {
        this.resumeStore.updatePersonalInfo('firstName', '')
        this.resumeStore.updatePersonalInfo('lastName', '')
        this.resumeStore.updatePersonalInfo('title', '')
        this.resumeStore.updatePersonalInfo('email', '')
        this.resumeStore.updatePersonalInfo('phone', '')
        this.resumeStore.updatePersonalInfo('address', '')
        this.resumeStore.updatePersonalInfo('linkedin', '')
        this.resumeStore.updatePersonalInfo('github', '')
        this.resumeStore.updatePersonalInfo('website', '')
        this.resumeStore.updatePersonalInfo('summary', '')
        this.resumeStore.updatePersonalInfo('profileImage', '/profile_pic.png')
        this.toast.success('Personal information cleared')
      }
    },
    
    saveChanges() {
      this.toast.success('Personal information saved!')
    }
  }
}
</script>