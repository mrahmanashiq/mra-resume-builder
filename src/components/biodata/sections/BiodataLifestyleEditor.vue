<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">Hobbies &amp; Habits</h3>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Hobby / Interests</label>
      <input type="text"
             :value="biodataStore.lifestyle.hobby"
             @input="update('hobby', $event.target.value)"
             class="input-field"
             placeholder="Reading, Travelling">
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Smoking</label>
        <select :value="biodataStore.lifestyle.smoking"
                @change="update('smoking', $event.target.value)"
                class="input-field">
          <option value="">Select</option>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Drinking</label>
        <select :value="biodataStore.lifestyle.drinking"
                @change="update('drinking', $event.target.value)"
                class="input-field">
          <option value="">Select</option>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>
    </div>

    <p class="text-xs text-gray-500">
      This whole section can be turned off in Settings → Sections.
    </p>
  </div>
</template>

<script>
import { useBiodataStore } from '../../../stores/biodata'

export default {
  name: 'BiodataLifestyleEditor',
  setup() {
    const biodataStore = useBiodataStore()
    return { biodataStore }
  },
  methods: {
    update(field, value) {
      this.biodataStore.updateLifestyle(field, value)
    }
  }
}
</script>
