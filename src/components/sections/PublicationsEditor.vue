<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100">Publications</h3>
      <button @click="add" class="btn-primary">
        <PlusIcon class="w-4 h-4 mr-2" />
        Add Publication
      </button>
    </div>

    <p class="text-sm text-gray-500 dark:text-slate-400">
      Listed newest first in the CV. Type your own name exactly as it appears in the author list and it will be bolded automatically.
    </p>

    <div class="space-y-6">
      <div v-for="(p, index) in resumeStore.publications" :key="p.id"
           class="border border-gray-200 dark:border-slate-700 rounded-lg p-6 bg-gray-50 dark:bg-slate-800/60">
        <div class="flex items-start justify-between mb-4">
          <h4 class="font-medium text-gray-900 dark:text-slate-100">Publication {{ index + 1 }}</h4>
          <button @click="remove(p.id)" class="p-1 text-red-400 hover:text-red-600">
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Title</label>
            <input type="text" :value="p.title" @input="update(p.id, 'title', $event.target.value)" class="input-field" placeholder="Scalable Representation Learning for Multimodal Perception">
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Authors</label>
            <input type="text" :value="p.authors" @input="update(p.id, 'authors', $event.target.value)" class="input-field" placeholder="John Doe, Jane Smith, Alan Turing">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Venue</label>
            <input type="text" :value="p.venue" @input="update(p.id, 'venue', $event.target.value)" class="input-field" placeholder="NeurIPS">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Year</label>
              <input type="text" :value="p.year" @input="update(p.id, 'year', $event.target.value)" class="input-field" placeholder="2024">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Award</label>
              <input type="text" :value="p.award" @input="update(p.id, 'award', $event.target.value)" class="input-field" placeholder="Best Paper">
            </div>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Link (optional)</label>
            <input type="text" :value="p.url" @input="update(p.id, 'url', $event.target.value)" class="input-field" placeholder="arxiv.org/abs/0000.00000">
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Summary (optional, shown on the Portfolio style)</label>
            <textarea :value="p.summary" @input="update(p.id, 'summary', $event.target.value)" rows="2" class="input-field" placeholder="One or two sentences on what the paper contributes."></textarea>
          </div>
        </div>
      </div>
    </div>

    <div v-if="resumeStore.publications.length === 0"
         class="text-center py-12 bg-gray-50 dark:bg-slate-800/60 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600">
      <BookOpenIcon class="w-12 h-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">No publications added</h3>
      <p class="text-gray-600 dark:text-slate-400 mb-4">Add papers, preprints, and articles for your academic CV</p>
      <button @click="add" class="btn-primary">Add Your First Publication</button>
    </div>
  </div>
</template>

<script>
import { useResumeStore } from '../../stores/resume'
import { useToast } from 'vue-toastification'
import { PlusIcon, TrashIcon, BookOpenIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'PublicationsEditor',
  components: { PlusIcon, TrashIcon, BookOpenIcon },
  setup() {
    const resumeStore = useResumeStore()
    const toast = useToast()
    return { resumeStore, toast }
  },
  methods: {
    add() {
      this.resumeStore.addPublication({})
      this.toast.success('New publication added')
    },
    update(id, field, value) {
      this.resumeStore.updatePublication(id, { [field]: value })
    },
    remove(id) {
      if (confirm('Remove this publication?')) {
        this.resumeStore.removePublication(id)
        this.toast.success('Publication removed')
      }
    }
  }
}
</script>
