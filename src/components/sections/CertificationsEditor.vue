<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">Certifications</h3>
      <button @click="addCertification" class="btn-primary">
        <PlusIcon class="w-4 h-4 mr-2" />
        Add Certification
      </button>
    </div>

    <!-- Certification Items -->
    <div class="space-y-6">
      <div v-for="(certification, index) in resumeStore.certifications" 
           :key="certification.id"
           class="border border-gray-200 rounded-lg p-6 bg-gray-50">
        
        <div class="flex items-start justify-between mb-4">
          <h4 class="font-medium text-gray-900">Certification {{ index + 1 }}</h4>
          <button @click="removeCertification(certification.id)" 
                  class="p-1 text-red-400 hover:text-red-600">
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>

        <!-- Certification Name -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Certification Name</label>
          <input type="text" 
                 :value="certification.name"
                 @input="updateCertification(certification.id, 'name', $event.target.value)"
                 class="input-field"
                 placeholder="AWS Certified Solutions Architect">
        </div>

        <!-- Issuer -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Issuing Organization</label>
          <input type="text" 
                 :value="certification.issuer"
                 @input="updateCertification(certification.id, 'issuer', $event.target.value)"
                 class="input-field"
                 placeholder="Amazon Web Services">
        </div>

        <!-- Dates and Credential ID -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
            <input type="month" 
                   :value="certification.date"
                   @input="updateCertification(certification.id, 'date', $event.target.value)"
                   class="input-field">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Expiry Date (Optional)</label>
            <input type="month" 
                   :value="certification.expiryDate"
                   @input="updateCertification(certification.id, 'expiryDate', $event.target.value)"
                   class="input-field">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Credential ID</label>
            <input type="text" 
                   :value="certification.credentialId"
                   @input="updateCertification(certification.id, 'credentialId', $event.target.value)"
                   class="input-field"
                   placeholder="AWS-SAA-123456">
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="resumeStore.certifications.length === 0" 
         class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <TrophyIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No certifications added</h3>
      <p class="text-gray-600 mb-4">Add your professional certifications and credentials</p>
      <button @click="addCertification" class="btn-primary">
        Add Your First Certification
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
import { PlusIcon, TrashIcon, TrophyIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'CertificationsEditor',
  components: {
    PlusIcon,
    TrashIcon,
    TrophyIcon
  },
  setup() {
    const resumeStore = useResumeStore()
    const toast = useToast()
    
    return { resumeStore, toast }
  },
  methods: {
    addCertification() {
      this.resumeStore.addCertification({
        name: '',
        issuer: '',
        date: '',
        expiryDate: '',
        credentialId: ''
      })
      this.toast.success('New certification added')
    },
    
    updateCertification(id, field, value) {
      this.resumeStore.updateCertification(id, { [field]: value })
    },
    
    removeCertification(id) {
      const confirmDelete = confirm('Are you sure you want to remove this certification?')
      if (confirmDelete) {
        this.resumeStore.removeCertification(id)
        this.toast.success('Certification removed')
      }
    },
    
    clearAll() {
      const confirmClear = confirm('Are you sure you want to remove all certifications?')
      if (confirmClear) {
        this.resumeStore.certifications = []
        this.toast.success('All certifications cleared')
      }
    },
    
    saveChanges() {
      this.toast.success('Certifications saved!')
    }
  }
}
</script>