<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100">Personal Details</h3>
      <p class="text-xs text-gray-500 dark:text-slate-400 mt-1">Shown by CV-style templates (e.g. Corporate CV). Optional for other templates.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Father's Name</label>
        <input type="text" :value="pd.fatherName" @input="update('fatherName', $event.target.value)" class="input-field" placeholder="Father's full name">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Mother's Name</label>
        <input type="text" :value="pd.motherName" @input="update('motherName', $event.target.value)" class="input-field" placeholder="Mother's full name">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Date of Birth</label>
        <BaseDatePicker :model-value="pd.dateOfBirth" @update:model-value="update('dateOfBirth', $event)" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Gender</label>
        <BaseSelect :model-value="pd.gender" @update:model-value="update('gender', $event)" :options="genders" placeholder="Select" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Marital Status</label>
        <BaseSelect :model-value="pd.maritalStatus" @update:model-value="update('maritalStatus', $event)" :options="maritalStatuses" placeholder="Select" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Nationality</label>
        <input type="text" :value="pd.nationality" @input="update('nationality', $event.target.value)" class="input-field" placeholder="Bangladeshi">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Religion</label>
        <input type="text" :value="pd.religion" @input="update('religion', $event.target.value)" class="input-field" placeholder="Islam">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Blood Group</label>
        <BaseSelect :model-value="pd.bloodGroup" @update:model-value="update('bloodGroup', $event)" :options="bloodGroups" placeholder="Select" />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Permanent Address</label>
      <textarea :value="pd.permanentAddress" @input="update('permanentAddress', $event.target.value)" rows="2" class="textarea-field" placeholder="Village, Post Office, District"></textarea>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Current Address</label>
      <textarea :value="pd.currentAddress" @input="update('currentAddress', $event.target.value)" rows="2" class="textarea-field" placeholder="House, Road, City"></textarea>
    </div>
  </div>
</template>

<script>
import { useResumeStore } from '../../stores/resume'

export default {
  name: 'PersonalDetailsEditor',
  setup() {
    const resumeStore = useResumeStore()
    return { resumeStore }
  },
  data() {
    return {
      genders: ['Male', 'Female', 'Other'],
      maritalStatuses: ['Unmarried', 'Married', 'Divorced', 'Widowed'],
      bloodGroups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    }
  },
  computed: {
    pd() {
      return this.resumeStore.personalDetails
    }
  },
  methods: {
    update(field, value) {
      this.resumeStore.updatePersonalDetail(field, value)
    }
  }
}
</script>
