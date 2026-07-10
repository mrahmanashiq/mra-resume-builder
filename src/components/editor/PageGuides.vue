<template>
  <div class="page-guides" aria-hidden="true">
    <div v-for="(top, i) in lines" :key="i" class="page-guide" :style="{ top: top + 'px' }">
      <span class="page-guide__label">Page {{ i + 2 }}</span>
    </div>
  </div>
</template>

<script>
/**
 * Overlays dashed A4 page-break lines on the document preview so the user can
 * see exactly where each printed/exported page ends and arrange content
 * accordingly. Template-agnostic: it only measures the preview box.
 *
 * The preview's rendered width maps to the PDF's 210mm page width, so a page
 * boundary sits every width * (297/210) px - matching the exported pages.
 */
export default {
  name: 'PageGuides',
  props: {
    targetId: { type: String, required: true }
  },
  data() {
    return { lines: [], ro: null }
  },
  mounted() {
    this.$nextTick(() => this.setup())
  },
  beforeUnmount() {
    if (this.ro) this.ro.disconnect()
  },
  methods: {
    setup() {
      const el = document.getElementById(this.targetId)
      if (!el) return
      this.compute(el)
      if (typeof ResizeObserver !== 'undefined') {
        this.ro = new ResizeObserver(() => this.compute(el))
        this.ro.observe(el)
      }
    },
    compute(el) {
      const width = el.clientWidth
      const height = el.scrollHeight
      if (!width || !height) {
        this.lines = []
        return
      }
      const pageHeight = width * (297 / 210)
      const count = Math.floor((height - 2) / pageHeight)
      const out = []
      for (let i = 1; i <= count; i++) out.push(Math.round(i * pageHeight))
      this.lines = out
    }
  }
}
</script>

<style scoped>
.page-guides {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}
.page-guide {
  position: absolute;
  left: 0;
  right: 0;
  border-top: 2px dashed rgba(37, 99, 235, 0.55);
}
.page-guide__label {
  position: absolute;
  right: 6px;
  top: 3px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.03em;
  background: rgba(37, 99, 235, 0.92);
  color: #ffffff;
  padding: 1px 7px;
  border-radius: 4px;
  white-space: nowrap;
}
</style>
