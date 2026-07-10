<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100">Training</h3>
      <button @click="add" class="btn-primary">
        <PlusIcon class="w-4 h-4 mr-2" />
        Add Training
      </button>
    </div>

    <div class="space-y-6">
      <div v-for="(t, index) in resumeStore.training" :key="t.id"
           class="border border-gray-200 dark:border-slate-700 rounded-lg p-6 bg-gray-50 dark:bg-slate-800/60">
        <div class="flex items-start justify-between mb-4">
          <h4 class="font-medium text-gray-900 dark:text-slate-100">Training {{ index + 1 }}</h4>
          <button @click="remove(t.id)" class="p-1 text-red-400 hover:text-red-600">
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Title</label>
            <input type="text" :value="t.title" @input="update(t.id, 'title', $event.target.value)" class="input-field" placeholder="Real-time PCR Detection">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Topic</label>
            <input type="text" :value="t.topic" @input="update(t.id, 'topic', $event.target.value)" class="input-field" placeholder="PCR Execution">
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Institute</label>
            <input type="text" :value="t.institute" @input="update(t.id, 'institute', $event.target.value)" class="input-field" placeholder="Training institute">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Location</label>
            <input type="text" :value="t.location" @input="update(t.id, 'location', $event.target.value)" class="input-field" placeholder="Dhaka">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Year</label>
              <input type="text" :value="t.year" @input="update(t.id, 'year', $event.target.value)" class="input-field" placeholder="2021">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Duration</label>
              <input type="text" :value="t.duration" @input="update(t.id, 'duration', $event.target.value)" class="input-field" placeholder="1 month">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="resumeStore.training.length === 0"
         class="text-center py-12 bg-gray-50 dark:bg-slate-800/60 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600">
      <AcademicCapIcon class="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">No training added</h3>
      <p class="text-gray-600 dark:text-slate-400 mb-4">Add training programs, workshops or courses</p>
      <button @click="add" class="btn-primary">Add Your First Training</button>
    </div>
  </div>
</template>

<script>
import { useResumeStore } from '../../stores/resume'
import { useToast } from 'vue-toastification'
import { PlusIcon, TrashIcon, AcademicCapIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'TrainingEditor',
  components: { PlusIcon, TrashIcon, AcademicCapIcon },
  setup() {
    const resumeStore = useResumeStore()
    const toast = useToast()
    return { resumeStore, toast }
  },
  methods: {
    add() {
      this.resumeStore.addTraining({})
      this.toast.success('New training added')
    },
    update(id, field, value) {
      this.resumeStore.updateTraining(id, { [field]: value })
    },
    remove(id) {
      this.resumeStore.removeTraining(id)
      this.toast.success('Removed. Use Undo to restore.')
    }
  }
}
</script>
