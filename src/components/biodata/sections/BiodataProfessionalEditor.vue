<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">Professional Details</h3>
      <button @click="addExperience" class="btn-primary flex items-center">
        <PlusIcon class="w-4 h-4 mr-2" />
        Add
      </button>
    </div>

    <div class="space-y-6">
      <div v-for="(exp, index) in biodataStore.professional.experiences"
           :key="exp.id"
           class="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <div class="flex items-start justify-between mb-4">
          <h4 class="font-medium text-gray-900">Experience {{ index + 1 }}</h4>
          <button @click="removeExperience(exp.id)" class="p-1 text-red-400 hover:text-red-600">
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Company / Organization</label>
            <input type="text"
                   :value="exp.company"
                   @input="update(exp.id, 'company', $event.target.value)"
                   class="input-field"
                   placeholder="Company Name">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Designation</label>
            <input type="text"
                   :value="exp.position"
                   @input="update(exp.id, 'position', $event.target.value)"
                   class="input-field"
                   placeholder="Software Engineer">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input type="text"
                   :value="exp.location"
                   @input="update(exp.id, 'location', $event.target.value)"
                   class="input-field"
                   placeholder="Dhaka, Bangladesh">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <BaseSelect :model-value="exp.type"
                        @update:model-value="update(exp.id, 'type', $event)"
                        :options="workTypes" placeholder="Select" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">From</label>
              <BaseDatePicker mode="month"
                              :model-value="exp.startDate"
                              @update:model-value="update(exp.id, 'startDate', $event)" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">To</label>
              <BaseDatePicker mode="month"
                              :model-value="exp.endDate"
                              @update:model-value="update(exp.id, 'endDate', $event)"
                              :disabled="exp.current" />
            </div>
          </div>
          <label class="flex items-center space-x-2 text-sm text-gray-700">
            <input type="checkbox"
                   :checked="exp.current"
                   @change="update(exp.id, 'current', $event.target.checked)">
            <span>Currently working here</span>
          </label>
        </div>
      </div>
    </div>

    <div v-if="biodataStore.professional.experiences.length === 0"
         class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <BriefcaseIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No experience added</h3>
      <p class="text-gray-600 mb-4">Add your work experience</p>
      <button @click="addExperience" class="btn-primary">Add Experience</button>
    </div>

    <div class="pt-2">
      <label class="block text-sm font-medium text-gray-700 mb-2">Monthly Income</label>
      <input type="text"
             :value="biodataStore.professional.income"
             @input="updateIncome($event.target.value)"
             class="input-field"
             placeholder="Optional">
      <p class="text-xs text-gray-500 mt-1">
        Appears on the biodata only when enabled in Settings → Optional Fields.
      </p>
    </div>
  </div>
</template>

<script>
import { useBiodataStore } from '../../../stores/biodata'
import { useToast } from 'vue-toastification'
import { PlusIcon, TrashIcon, BriefcaseIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'BiodataProfessionalEditor',
  components: {
    PlusIcon,
    TrashIcon,
    BriefcaseIcon
  },
  setup() {
    const biodataStore = useBiodataStore()
    const toast = useToast()
    return { biodataStore, toast }
  },
  data() {
    return {
      workTypes: ['On-site', 'Remote', 'Hybrid']
    }
  },
  methods: {
    addExperience() {
      this.biodataStore.addProExperience({})
      this.toast.success('Experience added')
    },
    update(id, field, value) {
      this.biodataStore.updateProExperience(id, { [field]: value })
    },
    removeExperience(id) {
      if (confirm('Remove this experience?')) {
        this.biodataStore.removeProExperience(id)
        this.toast.success('Experience removed')
      }
    },
    updateIncome(value) {
      this.biodataStore.updateProfessional('income', value)
    }
  }
}
</script>
