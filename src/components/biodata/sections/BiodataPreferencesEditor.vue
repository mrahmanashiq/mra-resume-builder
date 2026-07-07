<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">Partner Preferences</h3>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Blood Group</label>
      <select :value="biodataStore.preferences.preferredBloodGroup"
              @change="update('preferredBloodGroup', $event.target.value)"
              class="input-field">
        <option value="">No preference</option>
        <option v-for="bg in bloodGroups" :key="bg" :value="bg">{{ bg }}</option>
      </select>
      <p class="text-xs text-gray-500 mt-1">
        Optional. Some families consider blood group / Rh (+/−) compatibility.
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Expectations</label>
      <textarea :value="biodataStore.preferences.expectations"
                @input="update('expectations', $event.target.value)"
                rows="5"
                class="textarea-field"
                placeholder="Describe what you are looking for in a partner..."></textarea>
      <p class="text-xs text-gray-500 mt-1">
        This whole section is optional. Enable "Partner Preferences" in Settings → Sections to show it.
      </p>
    </div>
  </div>
</template>

<script>
import { useBiodataStore } from '../../../stores/biodata'

export default {
  name: 'BiodataPreferencesEditor',
  setup() {
    const biodataStore = useBiodataStore()
    return { biodataStore }
  },
  data() {
    return {
      bloodGroups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    }
  },
  methods: {
    update(field, value) {
      this.biodataStore.updatePreferences(field, value)
    }
  }
}
</script>
