<template>
  <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
    <div class="bg-white rounded-lg w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden">
      <div class="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Crop Photo</h3>
        <button @click="$emit('cancel')" class="p-1 text-gray-400 hover:text-gray-600">
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>

      <div class="bg-gray-900">
        <Cropper
          ref="cropper"
          class="cropper"
          :src="imageSrc"
          :stencil-props="{ movable: true, resizable: true, aspectRatio: null }" />
      </div>

      <div class="p-4 border-t border-gray-200 flex items-center justify-between gap-3">
        <p class="hidden sm:block text-xs text-gray-500">
          Drag to move · drag the corners to resize the crop area.
        </p>
        <div class="flex gap-3 ml-auto">
          <button @click="$emit('cancel')" class="btn-secondary">Cancel</button>
          <button @click="apply" class="btn-primary">Apply</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { XMarkIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'ImageCropperModal',
  components: { Cropper, XMarkIcon },
  props: {
    imageSrc: { type: String, required: true },
    // longest output side (px) - resizes to keep files small and the PDF light
    maxSize: { type: Number, default: 700 },
    quality: { type: Number, default: 0.85 }
  },
  emits: ['apply', 'cancel'],
  methods: {
    apply() {
      const result = this.$refs.cropper && this.$refs.cropper.getResult()
      if (!result || !result.canvas) {
        this.$emit('cancel')
        return
      }
      const src = result.canvas
      const scale = Math.min(1, this.maxSize / Math.max(src.width, src.height))
      const w = Math.max(1, Math.round(src.width * scale))
      const h = Math.max(1, Math.round(src.height * scale))
      const out = document.createElement('canvas')
      out.width = w
      out.height = h
      const ctx = out.getContext('2d')
      // flatten onto white so JPEG has no black transparency
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, w, h)
      ctx.drawImage(src, 0, 0, w, h)
      this.$emit('apply', out.toDataURL('image/jpeg', this.quality))
    }
  }
}
</script>

<style scoped src="./ImageCropperModal.css"></style>
