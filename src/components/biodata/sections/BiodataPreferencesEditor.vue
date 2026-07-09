<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100">Partner Preferences</h3>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Preferred Blood Group(s)</label>
      <div class="flex flex-wrap gap-2">
        <button v-for="bg in bloodGroups"
                :key="bg"
                type="button"
                @click="toggleBloodGroup(bg)"
                :class="['px-3 py-1 text-sm rounded-full border transition-colors',
                         isSelected(bg)
                           ? 'border-primary-500 text-primary-600 bg-primary-50 font-medium'
                           : 'border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:border-gray-400']">
          {{ bg }}
        </button>
      </div>

      <!-- Rh-factor suggestion -->
      <div class="mt-3 flex items-center gap-3 flex-wrap">
        <button type="button"
                @click="suggestByRhFactor"
                class="btn-secondary text-sm py-1.5">
          Suggest by Rh factor
        </button>
        <span v-if="ownBloodGroup" class="text-xs text-gray-500 dark:text-slate-400">
          Your blood group: <span class="font-medium text-gray-700 dark:text-slate-300">{{ ownBloodGroup }}</span>
        </span>
        <span v-else class="text-xs text-amber-600">
          Set your blood group in Personal Info to use this.
        </span>
      </div>

      <p class="text-xs text-gray-500 dark:text-slate-400 mt-2">
        Optional. Select any number of acceptable groups (or none for no preference).
        <span class="font-medium">Suggest by Rh factor</span> picks all groups with the same
        Rh sign as your blood group (e.g., O+ → all “+” groups), since Rh incompatibility mainly
        concerns an Rh-negative mother carrying an Rh-positive baby. This is a general guide, not medical advice.
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Preferred Complexion(s)</label>
      <div class="flex flex-wrap gap-2">
        <button v-for="c in complexions"
                :key="c"
                type="button"
                @click="toggleComplexion(c)"
                :class="['px-3 py-1 text-sm rounded-full border transition-colors',
                         isComplexionSelected(c)
                           ? 'border-primary-500 text-primary-600 bg-primary-50 font-medium'
                           : 'border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:border-gray-400']">
          {{ c }}
        </button>
      </div>
      <p class="text-xs text-gray-500 dark:text-slate-400 mt-1">
        Optional. Select any number of acceptable complexions (or none for no preference).
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Expectations</label>
      <textarea :value="biodataStore.preferences.expectations"
                @input="update('expectations', $event.target.value)"
                rows="5"
                class="textarea-field"
                placeholder="Describe what you are looking for in a partner..."></textarea>
      <p class="text-xs text-gray-500 dark:text-slate-400 mt-1">
        This whole section is optional. Enable "Partner Preferences" in Settings → Sections to show it.
      </p>
    </div>
  </div>
</template>

<script>
import { useBiodataStore } from '../../../stores/biodata'
import { useToast } from 'vue-toastification'

export default {
  name: 'BiodataPreferencesEditor',
  setup() {
    const biodataStore = useBiodataStore()
    const toast = useToast()
    return { biodataStore, toast }
  },
  data() {
    return {
      bloodGroups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      complexions: ['Fair', 'Very Fair', 'Wheatish', 'Medium', 'Dark']
    }
  },
  computed: {
    ownBloodGroup() {
      return this.biodataStore.personalInfo.bloodGroup || ''
    }
  },
  methods: {
    update(field, value) {
      this.biodataStore.updatePreferences(field, value)
    },
    suggestByRhFactor() {
      const bg = (this.ownBloodGroup || '').trim()
      if (!bg) {
        this.toast.info('Add your blood group in Personal Info first')
        return
      }
      const positive = bg.endsWith('+')
      const sign = positive ? '+' : '-'
      const suggested = this.bloodGroups.filter(g => g.endsWith(sign))
      this.update('preferredBloodGroups', suggested)
      this.toast.success(`Selected ${positive ? 'Rh-positive' : 'Rh-negative'} groups based on ${bg}`)
    },
    isSelected(bg) {
      return (this.biodataStore.preferences.preferredBloodGroups || []).includes(bg)
    },
    toggleBloodGroup(bg) {
      const current = [...(this.biodataStore.preferences.preferredBloodGroups || [])]
      const idx = current.indexOf(bg)
      if (idx === -1) {
        current.push(bg)
      } else {
        current.splice(idx, 1)
      }
      // Keep a stable, canonical order regardless of click order.
      current.sort((a, b) => this.bloodGroups.indexOf(a) - this.bloodGroups.indexOf(b))
      this.update('preferredBloodGroups', current)
    },
    isComplexionSelected(c) {
      return (this.biodataStore.preferences.preferredComplexions || []).includes(c)
    },
    toggleComplexion(c) {
      const current = [...(this.biodataStore.preferences.preferredComplexions || [])]
      const idx = current.indexOf(c)
      if (idx === -1) {
        current.push(c)
      } else {
        current.splice(idx, 1)
      }
      current.sort((a, b) => this.complexions.indexOf(a) - this.complexions.indexOf(b))
      this.update('preferredComplexions', current)
    }
  }
}
</script>
