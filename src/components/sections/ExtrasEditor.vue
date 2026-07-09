<template>
  <div class="space-y-8">
    <!-- Accomplishments -->
    <section>
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100">Accomplishments</h3>
        <button @click="addAccomplishment" class="btn-secondary text-sm py-1.5">
          <PlusIcon class="w-4 h-4 mr-1 inline" /> Add
        </button>
      </div>
      <div class="space-y-2">
        <div v-for="a in resumeStore.accomplishments" :key="a.id" class="flex items-center gap-2">
          <input type="text" :value="a.text" @input="updateAccomplishment(a.id, $event.target.value)"
                 class="input-field flex-1" placeholder="Award / achievement">
          <button @click="removeAccomplishment(a.id)" class="p-1 text-red-400 hover:text-red-600">
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
        <p v-if="!resumeStore.accomplishments.length" class="text-sm text-gray-500 dark:text-slate-400">No accomplishments yet.</p>
      </div>
    </section>

    <!-- Extra-curricular -->
    <section>
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100">Extra-Curricular Activities</h3>
        <button @click="addExtracurricular" class="btn-secondary text-sm py-1.5">
          <PlusIcon class="w-4 h-4 mr-1 inline" /> Add
        </button>
      </div>
      <div class="space-y-2">
        <div v-for="e in resumeStore.extracurricular" :key="e.id" class="flex items-center gap-2">
          <input type="text" :value="e.text" @input="updateExtracurricular(e.id, $event.target.value)"
                 class="input-field flex-1" placeholder="Activity / involvement">
          <button @click="removeExtracurricular(e.id)" class="p-1 text-red-400 hover:text-red-600">
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
        <p v-if="!resumeStore.extracurricular.length" class="text-sm text-gray-500 dark:text-slate-400">No activities yet.</p>
      </div>
    </section>

    <!-- Declaration -->
    <section class="pt-2 border-t border-gray-200 dark:border-slate-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-3">Declaration</h3>
      <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Statement</label>
      <textarea :value="declaration.text" @input="updateDeclaration('text', $event.target.value)"
                rows="3" class="textarea-field"
                placeholder="I hereby declare that all the above information is true..."></textarea>
      <div class="grid grid-cols-2 gap-4 mt-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Place (optional)</label>
          <input type="text" :value="declaration.place" @input="updateDeclaration('place', $event.target.value)" class="input-field" placeholder="Dhaka">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Date (optional)</label>
          <BaseDatePicker :model-value="declaration.date" @update:model-value="updateDeclaration('date', $event)" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { useResumeStore } from '../../stores/resume'
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'ExtrasEditor',
  components: { PlusIcon, TrashIcon },
  setup() {
    const resumeStore = useResumeStore()
    return { resumeStore }
  },
  computed: {
    declaration() {
      return this.resumeStore.declaration
    }
  },
  methods: {
    addAccomplishment() {
      this.resumeStore.addAccomplishment({})
    },
    updateAccomplishment(id, value) {
      this.resumeStore.updateAccomplishment(id, { text: value })
    },
    removeAccomplishment(id) {
      this.resumeStore.removeAccomplishment(id)
    },
    addExtracurricular() {
      this.resumeStore.addExtracurricular({})
    },
    updateExtracurricular(id, value) {
      this.resumeStore.updateExtracurricular(id, { text: value })
    },
    removeExtracurricular(id) {
      this.resumeStore.removeExtracurricular(id)
    },
    updateDeclaration(field, value) {
      this.resumeStore.updateDeclaration(field, value)
    }
  }
}
</script>
