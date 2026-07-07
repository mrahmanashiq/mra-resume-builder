<template>
  <!-- Template selector — renders the chosen biodata layout -->
  <ElegantBiodataTemplate />
</template>

<script>
import { defineAsyncComponent } from 'vue'

const ElegantBiodataTemplate = defineAsyncComponent(() => import('./ElegantBiodataTemplate.vue'))

export default {
  name: 'BiodataTemplate',
  components: {
    ElegantBiodataTemplate
  }
}
</script>
