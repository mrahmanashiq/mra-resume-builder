<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">Family Information</h3>
    </div>

    <!-- Father -->
    <div class="border border-gray-200 rounded-lg p-6 bg-gray-50 space-y-4">
      <h4 class="font-medium text-gray-900">Father</h4>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
        <input type="text"
               :value="biodataStore.family.father.name"
               @input="updateParent('father', 'name', $event.target.value)"
               class="input-field"
               placeholder="Father's name">
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Profession</label>
          <input type="text"
                 :value="biodataStore.family.father.profession"
                 @input="updateParent('father', 'profession', $event.target.value)"
                 class="input-field"
                 placeholder="Business">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Education</label>
          <input type="text"
                 :value="biodataStore.family.father.education"
                 @input="updateParent('father', 'education', $event.target.value)"
                 class="input-field"
                 placeholder="SSC">
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Contact Number <span class="text-gray-400 font-normal">(optional)</span></label>
        <input type="tel"
               :value="biodataStore.family.father.phone"
               @input="updateParent('father', 'phone', $event.target.value)"
               class="input-field"
               placeholder="01XXXXXXXXX">
      </div>
    </div>

    <!-- Mother -->
    <div class="border border-gray-200 rounded-lg p-6 bg-gray-50 space-y-4">
      <h4 class="font-medium text-gray-900">Mother</h4>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
        <input type="text"
               :value="biodataStore.family.mother.name"
               @input="updateParent('mother', 'name', $event.target.value)"
               class="input-field"
               placeholder="Mother's name">
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Profession</label>
          <input type="text"
                 :value="biodataStore.family.mother.profession"
                 @input="updateParent('mother', 'profession', $event.target.value)"
                 class="input-field"
                 placeholder="Housewife">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Education</label>
          <input type="text"
                 :value="biodataStore.family.mother.education"
                 @input="updateParent('mother', 'education', $event.target.value)"
                 class="input-field"
                 placeholder="HSC">
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Contact Number <span class="text-gray-400 font-normal">(optional)</span></label>
        <input type="tel"
               :value="biodataStore.family.mother.phone"
               @input="updateParent('mother', 'phone', $event.target.value)"
               class="input-field"
               placeholder="01XXXXXXXXX">
      </div>
    </div>

    <!-- Siblings -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h4 class="font-medium text-gray-900">Siblings</h4>
        <button @click="addSibling" class="btn-secondary flex items-center text-sm">
          <PlusIcon class="w-4 h-4 mr-1" /> Add Sibling
        </button>
      </div>
      <div v-for="(sibling, index) in biodataStore.family.siblings"
           :key="sibling.id"
           class="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-700">Sibling {{ index + 1 }}</span>
          <button @click="removeSibling(sibling.id)" class="p-1 text-red-400 hover:text-red-600">
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input type="text"
                 :value="sibling.name"
                 @input="updateSibling(sibling.id, 'name', $event.target.value)"
                 class="input-field"
                 placeholder="Name">
          <input type="text"
                 :value="sibling.relation"
                 @input="updateSibling(sibling.id, 'relation', $event.target.value)"
                 class="input-field"
                 placeholder="Brother / Sister">
          <input type="text"
                 :value="sibling.occupation"
                 @input="updateSibling(sibling.id, 'occupation', $event.target.value)"
                 class="input-field"
                 placeholder="Occupation">
          <input type="text"
                 :value="sibling.maritalStatus"
                 @input="updateSibling(sibling.id, 'maritalStatus', $event.target.value)"
                 class="input-field"
                 placeholder="Married / Unmarried">
        </div>
      </div>
      <p class="text-xs text-gray-500">
        Siblings appear on the biodata only when enabled in Settings → Optional Fields.
      </p>
    </div>

    <!-- Paternal Uncles (Chacha) -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h4 class="font-medium text-gray-900">Uncles (Chacha)</h4>
        <button @click="addPaternalUncle" class="btn-secondary flex items-center text-sm">
          <PlusIcon class="w-4 h-4 mr-1" /> Add
        </button>
      </div>
      <div v-for="(uncle, index) in biodataStore.family.paternalUncles"
           :key="uncle.id"
           class="border border-gray-200 rounded-lg p-4 bg-white">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-medium text-gray-700">Chacha {{ index + 1 }}</span>
          <button @click="removePaternalUncle(uncle.id)" class="p-1 text-red-400 hover:text-red-600">
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input type="text"
                 :value="uncle.name"
                 @input="updatePaternalUncle(uncle.id, 'name', $event.target.value)"
                 class="input-field"
                 placeholder="Name">
          <input type="text"
                 :value="uncle.occupation"
                 @input="updatePaternalUncle(uncle.id, 'occupation', $event.target.value)"
                 class="input-field"
                 placeholder="Occupation">
        </div>
      </div>
    </div>

    <!-- Maternal Uncles (Mama) -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h4 class="font-medium text-gray-900">Uncles (Mama)</h4>
        <button @click="addMaternalUncle" class="btn-secondary flex items-center text-sm">
          <PlusIcon class="w-4 h-4 mr-1" /> Add
        </button>
      </div>
      <div v-for="(uncle, index) in biodataStore.family.maternalUncles"
           :key="uncle.id"
           class="border border-gray-200 rounded-lg p-4 bg-white">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-medium text-gray-700">Mama {{ index + 1 }}</span>
          <button @click="removeMaternalUncle(uncle.id)" class="p-1 text-red-400 hover:text-red-600">
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input type="text"
                 :value="uncle.name"
                 @input="updateMaternalUncle(uncle.id, 'name', $event.target.value)"
                 class="input-field"
                 placeholder="Name">
          <input type="text"
                 :value="uncle.occupation"
                 @input="updateMaternalUncle(uncle.id, 'occupation', $event.target.value)"
                 class="input-field"
                 placeholder="Occupation">
        </div>
      </div>
    </div>

    <!-- Home District -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Home District</label>
      <input type="text"
             :value="biodataStore.family.homeDistrict"
             @input="updateFamilyField('homeDistrict', $event.target.value)"
             class="input-field"
             placeholder="Comilla">
      <p class="text-xs text-gray-500 mt-1">
        Appears only when enabled in Settings → Optional Fields.
      </p>
    </div>
  </div>
</template>

<script>
import { useBiodataStore } from '../../../stores/biodata'
import { useToast } from 'vue-toastification'
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'BiodataFamilyEditor',
  components: {
    PlusIcon,
    TrashIcon
  },
  setup() {
    const biodataStore = useBiodataStore()
    const toast = useToast()
    return { biodataStore, toast }
  },
  methods: {
    updateParent(parent, field, value) {
      this.biodataStore.updateParent(parent, field, value)
    },
    updateFamilyField(field, value) {
      this.biodataStore.updateFamilyField(field, value)
    },
    addSibling() {
      this.biodataStore.addSibling({})
    },
    updateSibling(id, field, value) {
      this.biodataStore.updateSibling(id, { [field]: value })
    },
    removeSibling(id) {
      this.biodataStore.removeSibling(id)
    },
    addPaternalUncle() {
      this.biodataStore.addPaternalUncle({})
    },
    updatePaternalUncle(id, field, value) {
      this.biodataStore.updatePaternalUncle(id, { [field]: value })
    },
    removePaternalUncle(id) {
      this.biodataStore.removePaternalUncle(id)
    },
    addMaternalUncle() {
      this.biodataStore.addMaternalUncle({})
    },
    updateMaternalUncle(id, field, value) {
      this.biodataStore.updateMaternalUncle(id, { [field]: value })
    },
    removeMaternalUncle(id) {
      this.biodataStore.removeMaternalUncle(id)
    }
  }
}
</script>
