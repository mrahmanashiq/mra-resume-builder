<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100">Academic Service</h3>
      <button @click="add" class="btn-primary">
        <PlusIcon class="w-4 h-4 mr-2" />
        Add Service
      </button>
    </div>

    <div class="space-y-6">
      <div v-for="(s, index) in resumeStore.service" :key="s.id"
           class="border border-gray-200 dark:border-slate-700 rounded-lg p-6 bg-gray-50 dark:bg-slate-800/60">
        <div class="flex items-start justify-between mb-4">
          <h4 class="font-medium text-gray-900 dark:text-slate-100">Service {{ index + 1 }}</h4>
          <button @click="remove(s.id)" class="p-1 text-red-400 hover:text-red-600">
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Role</label>
            <input type="text" :value="s.role" @input="update(s.id, 'role', $event.target.value)" class="input-field" placeholder="Area Chair, CVPR">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Year</label>
            <input type="text" :value="s.year" @input="update(s.id, 'year', $event.target.value)" class="input-field" placeholder="2024, 2025">
          </div>
        </div>
      </div>
    </div>

    <div v-if="resumeStore.service.length === 0"
         class="text-center py-12 bg-gray-50 dark:bg-slate-800/60 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600">
      <ClipboardDocumentCheckIcon class="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">No service added</h3>
      <p class="text-gray-600 dark:text-slate-400 mb-4">Add reviewing, area chair roles, and committee work</p>
      <button @click="add" class="btn-primary">Add Your First Entry</button>
    </div>
  </div>
</template>

<script>
import { useResumeStore } from '../../stores/resume'
import { useToast } from 'vue-toastification'
import { PlusIcon, TrashIcon, ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'ServiceEditor',
  components: { PlusIcon, TrashIcon, ClipboardDocumentCheckIcon },
  setup() {
    const resumeStore = useResumeStore()
    const toast = useToast()
    return { resumeStore, toast }
  },
  methods: {
    add() {
      this.resumeStore.addService({})
      this.toast.success('New service entry added')
    },
    update(id, field, value) {
      this.resumeStore.updateService(id, { [field]: value })
    },
    remove(id) {
      this.resumeStore.removeService(id)
      this.toast.success('Removed. Use Undo to restore.')
    }
  }
}
</script>
