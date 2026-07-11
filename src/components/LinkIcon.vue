<template>
  <svg v-if="paths.length" class="link-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path v-for="(d, i) in paths" :key="i" :d="d" />
  </svg>
</template>

<script>
import { ICON_PATHS } from '../utils/linkIcons'

/**
 * A single monochrome link icon that inherits the surrounding font size (1em)
 * and colour (currentColor), so it matches the template's link styling and
 * captures cleanly to PDF. Renders nothing for an unknown icon name.
 */
export default {
  name: 'LinkIcon',
  props: {
    name: { type: String, default: '' }
  },
  computed: {
    paths() {
      return ICON_PATHS[this.name] || []
    }
  }
}
</script>

<style scoped>
.link-icon {
  width: 1em;
  height: 1em;
  display: inline-block;
  vertical-align: -0.125em;
  flex-shrink: 0;
}
</style>
