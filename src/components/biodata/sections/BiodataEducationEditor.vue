<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">Educational Qualification</h3>
      <button @click="addRow" class="btn-primary flex items-center">
        <PlusIcon class="w-4 h-4 mr-2" />
        Add
      </button>
    </div>

    <div class="space-y-6">
      <div v-for="(row, index) in biodataStore.education"
           :key="row.id"
           class="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <div class="flex items-start justify-between mb-4">
          <h4 class="font-medium text-gray-900">Qualification {{ index + 1 }}</h4>
          <button @click="removeRow(row.id)" class="p-1 text-red-400 hover:text-red-600">
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Degree / Exam</label>
          <input type="text"
                 :value="row.degree"
                 @input="update(row.id, 'degree', $event.target.value)"
                 class="input-field"
                 placeholder="BSc in Software Engineering">
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <input type="text"
                   :value="row.year"
                   @input="update(row.id, 'year', $event.target.value)"
                   class="input-field"
                   placeholder="2023">
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Institute</label>
            <input type="text"
                   :value="row.institute"
                   @input="update(row.id, 'institute', $event.target.value)"
                   class="input-field"
                   placeholder="Daffodil International University">
          </div>
        </div>

        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Result / GPA</label>
          <input type="text"
                 :value="row.result"
                 @input="update(row.id, 'result', $event.target.value)"
                 class="input-field"
                 placeholder="3.82">
        </div>
      </div>
    </div>

    <div v-if="biodataStore.education.length === 0"
         class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <AcademicCapIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No qualifications added</h3>
      <p class="text-gray-600 mb-4">Add your educational background</p>
      <button @click="addRow" class="btn-primary">Add Qualification</button>
    </div>
  </div>
</template>

<script>
import { useBiodataStore } from '../../../stores/biodata'
import { useToast } from 'vue-toastification'
import { PlusIcon, TrashIcon, AcademicCapIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'BiodataEducationEditor',
  components: {
    PlusIcon,
    TrashIcon,
    AcademicCapIcon
  },
  setup() {
    const biodataStore = useBiodataStore()
    const toast = useToast()
    return { biodataStore, toast }
  },
  methods: {
    addRow() {
      this.biodataStore.addEducation({})
      this.toast.success('Qualification added')
    },
    update(id, field, value) {
      this.biodataStore.updateEducation(id, { [field]: value })
    },
    removeRow(id) {
      if (confirm('Remove this qualification?')) {
        this.biodataStore.removeEducation(id)
        this.toast.success('Qualification removed')
      }
    }
  }
}
</script>
