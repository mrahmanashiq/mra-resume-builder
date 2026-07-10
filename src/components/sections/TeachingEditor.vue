<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100">Teaching</h3>
      <button @click="add" class="btn-primary">
        <PlusIcon class="w-4 h-4 mr-2" />
        Add Course
      </button>
    </div>

    <div class="space-y-6">
      <div v-for="(t, index) in resumeStore.teaching" :key="t.id"
           class="border border-gray-200 dark:border-slate-700 rounded-lg p-6 bg-gray-50 dark:bg-slate-800/60">
        <div class="flex items-start justify-between mb-4">
          <h4 class="font-medium text-gray-900 dark:text-slate-100">Course {{ index + 1 }}</h4>
          <button @click="remove(t.id)" class="p-1 text-red-400 hover:text-red-600">
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Course</label>
            <input type="text" :value="t.course" @input="update(t.id, 'course', $event.target.value)" class="input-field" placeholder="CS 231 - Deep Learning for Vision">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Institution</label>
            <input type="text" :value="t.institution" @input="update(t.id, 'institution', $event.target.value)" class="input-field" placeholder="University of California, Berkeley">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Term</label>
            <input type="text" :value="t.term" @input="update(t.id, 'term', $event.target.value)" class="input-field" placeholder="Spring 2024">
          </div>
        </div>
      </div>
    </div>

    <div v-if="resumeStore.teaching.length === 0"
         class="text-center py-12 bg-gray-50 dark:bg-slate-800/60 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600">
      <PresentationChartBarIcon class="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">No teaching added</h3>
      <p class="text-gray-600 dark:text-slate-400 mb-4">Add courses you have taught or assisted</p>
      <button @click="add" class="btn-primary">Add Your First Course</button>
    </div>
  </div>
</template>

<script>
import { useResumeStore } from '../../stores/resume'
import { useToast } from 'vue-toastification'
import { PlusIcon, TrashIcon, PresentationChartBarIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'TeachingEditor',
  components: { PlusIcon, TrashIcon, PresentationChartBarIcon },
  setup() {
    const resumeStore = useResumeStore()
    const toast = useToast()
    return { resumeStore, toast }
  },
  methods: {
    add() {
      this.resumeStore.addTeaching({})
      this.toast.success('New course added')
    },
    update(id, field, value) {
      this.resumeStore.updateTeaching(id, { [field]: value })
    },
    remove(id) {
      this.resumeStore.removeTeaching(id)
      this.toast.success('Removed. Use Undo to restore.')
    }
  }
}
</script>
