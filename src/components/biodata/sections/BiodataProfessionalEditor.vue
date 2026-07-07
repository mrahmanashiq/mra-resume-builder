<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">Professional Details</h3>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Current Profession</label>
      <input type="text"
             :value="biodataStore.professional.profession"
             @input="update('profession', $event.target.value)"
             class="input-field"
             placeholder="Software Engineer">
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Company / Organization</label>
        <input type="text"
               :value="biodataStore.professional.company"
               @input="update('company', $event.target.value)"
               class="input-field"
               placeholder="WebAlive">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Experience</label>
        <input type="text"
               :value="biodataStore.professional.experience"
               @input="update('experience', $event.target.value)"
               class="input-field"
               placeholder="2 years">
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Monthly Income</label>
      <input type="text"
             :value="biodataStore.professional.income"
             @input="update('income', $event.target.value)"
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

export default {
  name: 'BiodataProfessionalEditor',
  setup() {
    const biodataStore = useBiodataStore()
    return { biodataStore }
  },
  methods: {
    update(field, value) {
      this.biodataStore.updateProfessional(field, value)
    }
  }
}
</script>
