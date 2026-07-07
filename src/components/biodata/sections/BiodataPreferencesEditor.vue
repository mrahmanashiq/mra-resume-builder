<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">Partner Preferences</h3>
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
  methods: {
    update(field, value) {
      this.biodataStore.updatePreferences(field, value)
    }
  }
}
</script>
