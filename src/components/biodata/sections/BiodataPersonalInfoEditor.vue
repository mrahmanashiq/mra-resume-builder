<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">Personal Information</h3>
    </div>

    <!-- Optional Photo Upload -->
    <div v-if="biodataStore.settings.showPhoto" class="text-center">
      <div class="relative mx-auto w-32 h-40 mb-4">
        <img v-if="biodataStore.personalInfo.photo"
             :src="biodataStore.personalInfo.photo"
             alt="Photo"
             class="w-32 h-40 object-cover border-4 border-gray-200 rounded">
        <div v-else
             class="w-32 h-40 flex items-center justify-center border-4 border-dashed border-gray-300 rounded text-gray-400">
          <UserIcon class="w-10 h-10" />
        </div>
        <label class="absolute bottom-0 right-0 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full cursor-pointer transition-colors duration-200">
          <CameraIcon class="w-4 h-4" />
          <input type="file" @change="handlePhotoUpload" accept="image/*" class="hidden">
        </label>
      </div>
      <p class="text-sm text-gray-600">Click the camera icon to upload a photo</p>
    </div>
    <p v-else class="text-xs text-gray-500">
      Photo is hidden. Enable "Show Photo" in Settings to add one.
    </p>

    <!-- Full Name -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
      <input type="text"
             :value="biodataStore.personalInfo.fullName"
             @input="update('fullName', $event.target.value)"
             class="input-field"
             placeholder="Md. Rahman Ahmed">
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
        <input type="date"
               :value="biodataStore.personalInfo.dateOfBirth"
               @input="update('dateOfBirth', $event.target.value)"
               class="input-field">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Religion</label>
        <input type="text"
               :value="biodataStore.personalInfo.religion"
               @input="update('religion', $event.target.value)"
               class="input-field"
               placeholder="Islam">
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Height</label>
        <input type="text"
               :value="biodataStore.personalInfo.height"
               @input="update('height', $event.target.value)"
               class="input-field"
               placeholder="5'8&quot;">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Weight</label>
        <input type="text"
               :value="biodataStore.personalInfo.weight"
               @input="update('weight', $event.target.value)"
               class="input-field"
               placeholder="68 kg">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Complexion</label>
        <select :value="biodataStore.personalInfo.complexion"
                @change="update('complexion', $event.target.value)"
                class="input-field">
          <option value="">Select</option>
          <option v-for="c in complexions" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
        <select :value="biodataStore.personalInfo.bloodGroup"
                @change="update('bloodGroup', $event.target.value)"
                class="input-field">
          <option value="">Select</option>
          <option v-for="bg in bloodGroups" :key="bg" :value="bg">{{ bg }}</option>
        </select>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Hobby / Interests</label>
      <input type="text"
             :value="biodataStore.personalInfo.hobby"
             @input="update('hobby', $event.target.value)"
             class="input-field"
             placeholder="Reading, Travelling">
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Present Address</label>
      <textarea :value="biodataStore.personalInfo.presentAddress"
                @input="update('presentAddress', $event.target.value)"
                rows="2"
                class="textarea-field"
                placeholder="Mohammadpur, Dhaka - 1207"></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Permanent Address</label>
      <textarea :value="biodataStore.personalInfo.permanentAddress"
                @input="update('permanentAddress', $event.target.value)"
                rows="2"
                class="textarea-field"
                placeholder="Village, District"></textarea>
    </div>

    <!-- Additional (toggleable) fields -->
    <div class="space-y-4 pt-2">
      <h4 class="font-medium text-gray-900">Additional Details</h4>
      <p class="text-xs text-gray-500 -mt-2">
        These appear on the biodata only when enabled in Settings → Optional Fields.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
          <input type="text"
                 :value="biodataStore.personalInfo.maritalStatus"
                 @input="update('maritalStatus', $event.target.value)"
                 class="input-field"
                 placeholder="Unmarried">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
          <input type="text"
                 :value="biodataStore.personalInfo.nationality"
                 @input="update('nationality', $event.target.value)"
                 class="input-field"
                 placeholder="Bangladeshi">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Mother Tongue</label>
          <input type="text"
                 :value="biodataStore.personalInfo.motherTongue"
                 @input="update('motherTongue', $event.target.value)"
                 class="input-field"
                 placeholder="Bengali">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Sect / Madhab</label>
          <input type="text"
                 :value="biodataStore.personalInfo.sect"
                 @input="update('sect', $event.target.value)"
                 class="input-field"
                 placeholder="Sunni">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useBiodataStore } from '../../../stores/biodata'
import { useToast } from 'vue-toastification'
import { CameraIcon, UserIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'BiodataPersonalInfoEditor',
  components: {
    CameraIcon,
    UserIcon
  },
  setup() {
    const biodataStore = useBiodataStore()
    const toast = useToast()
    return { biodataStore, toast }
  },
  data() {
    return {
      bloodGroups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      complexions: ['Fair', 'Very Fair', 'Wheatish', 'Medium', 'Dark']
    }
  },
  methods: {
    update(field, value) {
      this.biodataStore.updatePersonalInfo(field, value)
    },
    handlePhotoUpload(event) {
      const file = event.target.files[0]
      if (!file) return
      if (file.size > 5 * 1024 * 1024) {
        this.toast.error('Image size must be less than 5MB')
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        this.update('photo', e.target.result)
        this.toast.success('Photo updated!')
      }
      reader.readAsDataURL(file)
    }
  }
}
</script>
