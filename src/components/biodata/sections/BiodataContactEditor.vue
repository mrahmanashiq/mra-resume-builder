<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">Contact</h3>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
      <input type="tel"
             :value="biodataStore.contact.phone"
             @input="update('phone', $event.target.value)"
             class="input-field"
             placeholder="01XXXXXXXXX">
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Guardian's Contact</label>
      <input type="tel"
             :value="biodataStore.contact.guardianPhone"
             @input="update('guardianPhone', $event.target.value)"
             class="input-field"
             placeholder="Optional">
      <p class="text-xs text-gray-500 mt-1">
        Appears on the biodata only when enabled in Settings → Optional Fields.
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
      <input type="email"
             :value="biodataStore.contact.email"
             @input="update('email', $event.target.value)"
             class="input-field"
             placeholder="Optional">
    </div>

    <div class="space-y-4 pt-2">
      <h4 class="font-medium text-gray-900">Social & Web</h4>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Website</label>
        <input type="url"
               :value="biodataStore.contact.website"
               @input="update('website', $event.target.value)"
               class="input-field"
               placeholder="https://example.com">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
        <input type="text"
               :value="biodataStore.contact.facebook"
               @input="update('facebook', $event.target.value)"
               class="input-field"
               placeholder="facebook.com/username">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
        <input type="text"
               :value="biodataStore.contact.instagram"
               @input="update('instagram', $event.target.value)"
               class="input-field"
               placeholder="@username">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
        <input type="text"
               :value="biodataStore.contact.linkedin"
               @input="update('linkedin', $event.target.value)"
               class="input-field"
               placeholder="linkedin.com/in/username">
      </div>
    </div>

    <p class="text-xs text-gray-500">
      Guardian, Email, and Social & Web fields appear on the biodata only when enabled in Settings → Optional Fields.
    </p>
  </div>
</template>

<script>
import { useBiodataStore } from '../../../stores/biodata'

export default {
  name: 'BiodataContactEditor',
  setup() {
    const biodataStore = useBiodataStore()
    return { biodataStore }
  },
  methods: {
    update(field, value) {
      this.biodataStore.updateContact(field, value)
    }
  }
}
</script>
