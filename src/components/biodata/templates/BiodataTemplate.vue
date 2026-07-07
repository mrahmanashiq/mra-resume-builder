<template>
  <!-- Template selector — renders the chosen biodata layout -->
  <component :is="currentTemplate" />
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { useBiodataStore } from '../../../stores/biodata'
import { storeToRefs } from 'pinia'

const ElegantBiodataTemplate = defineAsyncComponent(() => import('./ElegantBiodataTemplate.vue'))
const ClassicBiodataTemplate = defineAsyncComponent(() => import('./ClassicBiodataTemplate.vue'))

export default {
  name: 'BiodataTemplate',
  components: {
    ElegantBiodataTemplate,
    ClassicBiodataTemplate
  },
  setup() {
    const biodataStore = useBiodataStore()
    const { settings } = storeToRefs(biodataStore)
    return { settings }
  },
  computed: {
    currentTemplate() {
      return this.settings.template === 'classic'
        ? 'ClassicBiodataTemplate'
        : 'ElegantBiodataTemplate'
    }
  }
}
</script>
