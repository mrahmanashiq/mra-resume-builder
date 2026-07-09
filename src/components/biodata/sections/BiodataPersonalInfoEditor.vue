<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100">Personal Information</h3>
    </div>

    <!-- Optional Photo Upload -->
    <div v-if="biodataStore.settings.showPhoto" class="text-center">
      <div class="relative mx-auto w-32 h-40 mb-4">
        <img v-if="biodataStore.personalInfo.photo"
             :src="biodataStore.personalInfo.photo"
             alt="Photo"
             class="w-32 h-40 object-cover border-4 border-gray-200 dark:border-slate-700 rounded">
        <div v-else
             class="w-32 h-40 flex items-center justify-center border-4 border-dashed border-gray-300 dark:border-slate-600 rounded text-gray-400 dark:text-slate-500">
          <UserIcon class="w-10 h-10" />
        </div>
        <label class="absolute bottom-0 right-0 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full cursor-pointer transition-colors duration-200">
          <CameraIcon class="w-4 h-4" />
          <input type="file" @change="handlePhotoUpload" accept="image/*" class="hidden">
        </label>
      </div>
      <p class="text-sm text-gray-600 dark:text-slate-400">Click the camera icon to upload a photo</p>
      <p class="text-xs text-gray-400 dark:text-slate-500 mt-1">Recommended: a clear portrait, at least 600 × 800 px. You'll crop it next.</p>
    </div>
    <p v-else class="text-xs text-gray-500 dark:text-slate-400">
      Photo is hidden. Enable "Show Photo" in Settings to add one.
    </p>

    <ImageCropperModal
      v-if="showCropper"
      :image-src="cropSrc"
      @apply="onCropApply"
      @cancel="onCropCancel" />

    <!-- Full Name -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Full Name</label>
      <input type="text"
             :value="biodataStore.personalInfo.fullName"
             @input="update('fullName', $event.target.value)"
             class="input-field"
             placeholder="Md. Rahman Ahmed">
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Date of Birth</label>
        <BaseDatePicker :model-value="biodataStore.personalInfo.dateOfBirth"
                        @update:model-value="update('dateOfBirth', $event)" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Religion</label>
        <input type="text"
               :value="biodataStore.personalInfo.religion"
               @input="update('religion', $event.target.value)"
               class="input-field"
               placeholder="Islam">
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Height</label>
        <div class="flex gap-2">
          <div class="relative flex-1 min-w-0">
            <input type="number" min="0" max="8"
                   :value="biodataStore.personalInfo.heightFeet"
                   @input="update('heightFeet', $event.target.value)"
                   class="input-field pr-7"
                   placeholder="5">
            <span class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-xs pointer-events-none">ft</span>
          </div>
          <div class="relative flex-1 min-w-0">
            <input type="number" min="0" max="11"
                   :value="biodataStore.personalInfo.heightInches"
                   @input="update('heightInches', $event.target.value)"
                   class="input-field pr-7"
                   placeholder="8">
            <span class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-xs pointer-events-none">in</span>
          </div>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Weight</label>
        <div class="relative">
          <input type="number"
                 :value="biodataStore.personalInfo.weight"
                 @input="update('weight', $event.target.value)"
                 class="input-field pr-10"
                 placeholder="60">
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 text-sm pointer-events-none">kg</span>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Complexion</label>
        <BaseSelect :model-value="biodataStore.personalInfo.complexion"
                    @update:model-value="update('complexion', $event)"
                    :options="complexions" placeholder="Select" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Blood Group</label>
        <BaseSelect :model-value="biodataStore.personalInfo.bloodGroup"
                    @update:model-value="update('bloodGroup', $event)"
                    :options="bloodGroups" placeholder="Select" />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Present Address</label>
      <textarea :value="biodataStore.personalInfo.presentAddress"
                @input="update('presentAddress', $event.target.value)"
                rows="2"
                class="textarea-field"
                placeholder="Mohammadpur, Dhaka - 1207"></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Permanent Address</label>
      <textarea :value="biodataStore.personalInfo.permanentAddress"
                @input="update('permanentAddress', $event.target.value)"
                rows="2"
                class="textarea-field"
                placeholder="Village, District"></textarea>
    </div>

    <!-- Additional (toggleable) fields -->
    <div class="space-y-4 pt-2">
      <h4 class="font-medium text-gray-900 dark:text-slate-100">Additional Details</h4>
      <p class="text-xs text-gray-500 dark:text-slate-400 -mt-2">
        These appear on the biodata only when enabled in Settings → Optional Fields.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Marital Status</label>
          <BaseSelect :model-value="biodataStore.personalInfo.maritalStatus"
                      @update:model-value="update('maritalStatus', $event)"
                      :options="maritalStatuses" placeholder="Select" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Nationality</label>
          <BaseSelect :model-value="selectValue('nationality', nationalities)"
                      @update:model-value="onSelectWithOther('nationality', $event)"
                      :options="nationalities" placeholder="Select" />
          <input v-if="otherFlags.nationality"
                 type="text"
                 :value="biodataStore.personalInfo.nationality"
                 @input="update('nationality', $event.target.value)"
                 class="input-field mt-2"
                 placeholder="Enter nationality">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Mother Tongue</label>
          <BaseSelect :model-value="selectValue('motherTongue', motherTongues)"
                      @update:model-value="onSelectWithOther('motherTongue', $event)"
                      :options="motherTongues" placeholder="Select" />
          <input v-if="otherFlags.motherTongue"
                 type="text"
                 :value="biodataStore.personalInfo.motherTongue"
                 @input="update('motherTongue', $event.target.value)"
                 class="input-field mt-2"
                 placeholder="Enter mother tongue">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Sect / Madhab</label>
          <BaseSelect :model-value="biodataStore.personalInfo.sect"
                      @update:model-value="update('sect', $event)"
                      :options="sects" placeholder="Select" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useBiodataStore } from '../../../stores/biodata'
import { useToast } from 'vue-toastification'
import { CameraIcon, UserIcon } from '@heroicons/vue/24/outline'
import ImageCropperModal from '../../ImageCropperModal.vue'

export default {
  name: 'BiodataPersonalInfoEditor',
  components: {
    CameraIcon,
    UserIcon,
    ImageCropperModal
  },
  setup() {
    const biodataStore = useBiodataStore()
    const toast = useToast()
    return { biodataStore, toast }
  },
  data() {
    return {
      bloodGroups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      complexions: ['Fair', 'Very Fair', 'Wheatish', 'Medium', 'Dark'],
      maritalStatuses: ['Unmarried', 'Married', 'Divorced', 'Widowed'],
      sects: ['Sunni', 'Shia', 'Hanafi', 'Maliki', "Shafi'i", 'Hanbali', 'Ahle Hadith'],
      nationalities: ['Bangladeshi', 'Indian', 'Pakistani', 'Nepali', 'Saudi Arabian', 'American', 'British', 'Canadian', 'Australian', 'Other'],
      motherTongues: ['Bengali', 'English', 'Urdu', 'Hindi', 'Arabic', 'Tamil', 'Other'],
      otherFlags: { nationality: false, motherTongue: false },
      showCropper: false,
      cropSrc: ''
    }
  },
  created() {
    // If a stored value isn't one of the presets, treat it as a custom "Other" entry.
    const nat = this.biodataStore.personalInfo.nationality
    const mt = this.biodataStore.personalInfo.motherTongue
    this.otherFlags.nationality = !!nat && !this.nationalities.includes(nat)
    this.otherFlags.motherTongue = !!mt && !this.motherTongues.includes(mt)
  },
  methods: {
    update(field, value) {
      this.biodataStore.updatePersonalInfo(field, value)
    },
    selectValue(field, options) {
      if (this.otherFlags[field]) return 'Other'
      const value = this.biodataStore.personalInfo[field]
      return options.includes(value) ? value : ''
    },
    onSelectWithOther(field, value) {
      if (value === 'Other') {
        this.otherFlags[field] = true
        this.update(field, '')
      } else {
        this.otherFlags[field] = false
        this.update(field, value)
      }
    },
    handlePhotoUpload(event) {
      const file = event.target.files[0]
      if (!file) return
      if (file.size > 8 * 1024 * 1024) {
        this.toast.error('Image size must be less than 8MB')
        event.target.value = ''
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        this.cropSrc = e.target.result
        this.showCropper = true
      }
      reader.readAsDataURL(file)
      event.target.value = '' // allow re-selecting the same file
    },
    onCropApply(dataUrl) {
      this.update('photo', dataUrl)
      this.showCropper = false
      this.cropSrc = ''
      this.toast.success('Photo updated!')
    },
    onCropCancel() {
      this.showCropper = false
      this.cropSrc = ''
    }
  }
}
</script>
