<template>
  <DocumentEditorShell :config="biodataConfig" />
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { biodataConfig } from '../documents/biodata.config'

const DocumentEditorShell = defineAsyncComponent(() =>
  import('../components/editor/DocumentEditorShell.vue')
)

export default {
  name: 'BiodataEditor',
  components: {
    DocumentEditorShell
  },
  data() {
    return {
      biodataConfig
    }
  }
}
</script>
