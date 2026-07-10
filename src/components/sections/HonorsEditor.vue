<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100">Honors & Awards</h3>
      <button @click="add" class="btn-primary">
        <PlusIcon class="w-4 h-4 mr-2" />
        Add Award
      </button>
    </div>

    <div class="space-y-6">
      <div v-for="(a, index) in resumeStore.awards" :key="a.id"
           class="border border-gray-200 dark:border-slate-700 rounded-lg p-6 bg-gray-50 dark:bg-slate-800/60">
        <div class="flex items-start justify-between mb-4">
          <h4 class="font-medium text-gray-900 dark:text-slate-100">Award {{ index + 1 }}</h4>
          <button @click="remove(a.id)" aria-label="Remove" class="p-1 text-red-400 hover:text-red-600">
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Title</label>
            <input type="text" :value="a.title" @input="update(a.id, 'title', $event.target.value)" class="input-field" placeholder="Best Paper Award, NeurIPS">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Year</label>
            <input type="text" :value="a.year" @input="update(a.id, 'year', $event.target.value)" class="input-field" placeholder="2024">
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Description (optional)</label>
            <textarea :value="a.description" @input="update(a.id, 'description', $event.target.value)" rows="2" class="input-field" placeholder="A short note on what the award recognizes."></textarea>
          </div>
        </div>
      </div>
    </div>

    <div v-if="resumeStore.awards.length === 0"
         class="text-center py-12 bg-gray-50 dark:bg-slate-800/60 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600">
      <StarIcon class="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">No awards added</h3>
      <p class="text-gray-600 dark:text-slate-400 mb-4">Add honors, awards, fellowships, and nominations</p>
      <button @click="add" class="btn-primary">Add Your First Award</button>
    </div>
  </div>
</template>

<script>
import { useResumeStore } from '../../stores/resume'
import { useToast } from 'vue-toastification'
import { PlusIcon, TrashIcon, StarIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'HonorsEditor',
  components: { PlusIcon, TrashIcon, StarIcon },
  setup() {
    const resumeStore = useResumeStore()
    const toast = useToast()
    return { resumeStore, toast }
  },
  methods: {
    add() {
      this.resumeStore.addAward({})
      this.toast.success('New award added')
    },
    update(id, field, value) {
      this.resumeStore.updateAward(id, { [field]: value })
    },
    remove(id) {
      this.resumeStore.removeAward(id)
      this.toast.success('Removed. Use Undo to restore.')
    }
  }
}
</script>
