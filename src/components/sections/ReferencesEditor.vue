<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">References</h3>
      <button @click="add" class="btn-primary">
        <PlusIcon class="w-4 h-4 mr-2" />
        Add Reference
      </button>
    </div>

    <div class="space-y-6">
      <div v-for="(r, index) in resumeStore.references" :key="r.id"
           class="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <div class="flex items-start justify-between mb-4">
          <h4 class="font-medium text-gray-900">Reference {{ index + 1 }}</h4>
          <button @click="remove(r.id)" class="p-1 text-red-400 hover:text-red-600">
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input type="text" :value="r.name" @input="update(r.id, 'name', $event.target.value)" class="input-field" placeholder="Dr. Full Name">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Title / Position</label>
            <input type="text" :value="r.title" @input="update(r.id, 'title', $event.target.value)" class="input-field" placeholder="Professor">
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Organization</label>
            <input type="text" :value="r.organization" @input="update(r.id, 'organization', $event.target.value)" class="input-field" placeholder="University / Company">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
            <input type="text" :value="r.mobile" @input="update(r.id, 'mobile', $event.target.value)" class="input-field" placeholder="01XXXXXXXXX">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" :value="r.email" @input="update(r.id, 'email', $event.target.value)" class="input-field" placeholder="reference@example.com">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Relation</label>
            <input type="text" :value="r.relation" @input="update(r.id, 'relation', $event.target.value)" class="input-field" placeholder="Academic / Professional">
          </div>
        </div>
      </div>
    </div>

    <div v-if="resumeStore.references.length === 0"
         class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <UserGroupIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No references added</h3>
      <p class="text-gray-600 mb-4">Add people who can vouch for your work</p>
      <button @click="add" class="btn-primary">Add Your First Reference</button>
    </div>
  </div>
</template>

<script>
import { useResumeStore } from '../../stores/resume'
import { useToast } from 'vue-toastification'
import { PlusIcon, TrashIcon, UserGroupIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'ReferencesEditor',
  components: { PlusIcon, TrashIcon, UserGroupIcon },
  setup() {
    const resumeStore = useResumeStore()
    const toast = useToast()
    return { resumeStore, toast }
  },
  methods: {
    add() {
      this.resumeStore.addReference({})
      this.toast.success('New reference added')
    },
    update(id, field, value) {
      this.resumeStore.updateReference(id, { [field]: value })
    },
    remove(id) {
      if (confirm('Remove this reference?')) {
        this.resumeStore.removeReference(id)
        this.toast.success('Reference removed')
      }
    }
  }
}
</script>
