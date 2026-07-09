<template>
  <!-- Renders a real template component scaled down to fit an A4-proportioned frame -->
  <div ref="frame" class="tp-frame">
    <div class="tp-scale" :style="{ transform: `scale(${scale})` }">
      <Suspense>
        <component :is="component" />
      </Suspense>
    </div>
  </div>
</template>

<script>
const A4_WIDTH_PX = 794 // 210mm at 96dpi

export default {
  name: 'TemplateThumbnail',
  props: {
    component: {
      type: [Object, Function],
      required: true
    }
  },
  data() {
    return { scale: 0.33 }
  },
  mounted() {
    this.updateScale()
    if (typeof ResizeObserver !== 'undefined') {
      this._ro = new ResizeObserver(() => this.updateScale())
      this._ro.observe(this.$refs.frame)
    }
    window.addEventListener('resize', this.updateScale)
  },
  beforeUnmount() {
    if (this._ro) this._ro.disconnect()
    window.removeEventListener('resize', this.updateScale)
  },
  methods: {
    updateScale() {
      const w = this.$refs.frame ? this.$refs.frame.clientWidth : A4_WIDTH_PX
      this.scale = w / A4_WIDTH_PX
    }
  }
}
</script>

<style scoped>
.tp-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 210 / 297;
  overflow: hidden;
  background: #ffffff;
}

.tp-scale {
  position: absolute;
  top: 0;
  left: 0;
  width: 794px;
  transform-origin: top left;
  /* Let clicks fall through to the card's hover overlay */
  pointer-events: none;
}
</style>
