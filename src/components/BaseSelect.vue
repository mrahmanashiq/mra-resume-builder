<template>
  <div class="bs-wrap" :class="{ 'bs-disabled': disabled }">
    <button
      ref="trigger"
      type="button"
      class="bs-trigger input-field"
      :class="{ 'bs-open': open, 'bs-placeholder': showPlaceholder }"
      :disabled="disabled"
      :aria-expanded="open ? 'true' : 'false'"
      aria-haspopup="listbox"
      :aria-activedescendant="open && highlightedIndex >= 0 ? optionId(highlightedIndex) : undefined"
      @click="toggle"
      @keydown="onTriggerKeydown"
    >
      <span class="bs-label">{{ showPlaceholder ? placeholder : displayLabel }}</span>
      <ChevronUpDownIcon class="bs-chevron" />
    </button>

    <Teleport to="body">
      <transition name="bs-pop">
        <div
          v-if="open"
          ref="panel"
          class="bs-panel"
          :class="{ 'bs-panel-up': openedUp }"
          :style="panelStyle"
          role="listbox"
          @mousedown.prevent
        >
          <button
            v-for="(opt, i) in normalizedOptions"
            :id="optionId(i)"
            :key="i"
            type="button"
            role="option"
            :aria-selected="opt.value === modelValue ? 'true' : 'false'"
            class="bs-option"
            :class="{
              'bs-active': i === highlightedIndex,
              'bs-selected': opt.value === modelValue && !opt.isPlaceholder,
              'bs-opt-disabled': opt.disabled,
              'bs-opt-placeholder': opt.isPlaceholder
            }"
            :disabled="opt.disabled"
            @mousemove="highlightedIndex = i"
            @click="choose(opt)"
          >
            <span class="bs-option-label">{{ opt.label }}</span>
            <CheckIcon v-if="opt.value === modelValue && !opt.isPlaceholder" class="bs-check" />
          </button>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script>
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/vue/24/outline'

let uidSeed = 0

export default {
  name: 'BaseSelect',
  components: { ChevronUpDownIcon, CheckIcon },
  props: {
    modelValue: { type: [String, Number], default: '' },
    // Each option is a string, or { value, label, disabled }
    options: { type: Array, default: () => [] },
    placeholder: { type: String, default: '' },
    disabled: { type: Boolean, default: false }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      open: false,
      highlightedIndex: -1,
      openedUp: false,
      panelStyle: {},
      uid: `bs-${++uidSeed}`
    }
  },
  computed: {
    normalizedOptions() {
      const base = (this.options || []).map((o) => {
        if (o !== null && typeof o === 'object') {
          return { value: o.value, label: o.label != null ? o.label : String(o.value), disabled: !!o.disabled }
        }
        return { value: o, label: String(o), disabled: false }
      })
      if (this.placeholder) {
        return [{ value: '', label: this.placeholder, disabled: false, isPlaceholder: true }, ...base]
      }
      return base
    },
    selectedOption() {
      return this.normalizedOptions.find((o) => o.value === this.modelValue)
    },
    displayLabel() {
      return this.selectedOption && !this.selectedOption.isPlaceholder ? this.selectedOption.label : ''
    },
    showPlaceholder() {
      return !this.displayLabel && !!this.placeholder
    }
  },
  beforeUnmount() {
    this.removeListeners()
  },
  methods: {
    optionId(i) {
      return `${this.uid}-opt-${i}`
    },
    toggle() {
      if (this.disabled) return
      this.open ? this.close() : this.openPanel()
    },
    openPanel() {
      this.open = true
      const sel = this.normalizedOptions.findIndex((o) => o.value === this.modelValue)
      this.highlightedIndex = sel >= 0 ? sel : 0
      this.$nextTick(() => {
        this.positionPanel()
        this.scrollHighlightedIntoView()
      })
      document.addEventListener('mousedown', this.onDocMousedown, true)
      window.addEventListener('scroll', this.positionPanel, true)
      window.addEventListener('resize', this.positionPanel)
    },
    close() {
      if (!this.open) return
      this.open = false
      this.removeListeners()
      const btn = this.$refs.trigger
      if (btn) btn.focus()
    },
    removeListeners() {
      document.removeEventListener('mousedown', this.onDocMousedown, true)
      window.removeEventListener('scroll', this.positionPanel, true)
      window.removeEventListener('resize', this.positionPanel)
    },
    onDocMousedown(e) {
      const trigger = this.$refs.trigger
      const panel = this.$refs.panel
      if (trigger && trigger.contains(e.target)) return
      if (panel && panel.contains(e.target)) return
      this.close()
    },
    choose(opt) {
      if (opt.disabled) return
      this.$emit('update:modelValue', opt.value)
      this.close()
    },
    move(delta) {
      const n = this.normalizedOptions.length
      if (!n) return
      let i = this.highlightedIndex
      for (let step = 0; step < n; step++) {
        i = (i + delta + n) % n
        if (!this.normalizedOptions[i].disabled) break
      }
      this.highlightedIndex = i
      this.scrollHighlightedIntoView()
    },
    onTriggerKeydown(e) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          this.open ? this.move(1) : this.openPanel()
          break
        case 'ArrowUp':
          e.preventDefault()
          this.open ? this.move(-1) : this.openPanel()
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          if (this.open) {
            const opt = this.normalizedOptions[this.highlightedIndex]
            if (opt) this.choose(opt)
          } else {
            this.openPanel()
          }
          break
        case 'Escape':
          if (this.open) {
            e.preventDefault()
            this.close()
          }
          break
        case 'Tab':
          if (this.open) this.close()
          break
        case 'Home':
          if (this.open) {
            e.preventDefault()
            this.highlightedIndex = 0
            this.move(1)
            this.highlightedIndex = 0
            this.scrollHighlightedIntoView()
          }
          break
        case 'End':
          if (this.open) {
            e.preventDefault()
            this.highlightedIndex = this.normalizedOptions.length
            this.move(-1)
          }
          break
        default:
          break
      }
    },
    scrollHighlightedIntoView() {
      this.$nextTick(() => {
        const panel = this.$refs.panel
        if (!panel) return
        const el = panel.querySelector('.bs-active')
        if (el) el.scrollIntoView({ block: 'nearest' })
      })
    },
    positionPanel() {
      const btn = this.$refs.trigger
      if (!btn) return
      const r = btn.getBoundingClientRect()
      const gap = 6
      const maxH = 240
      const spaceBelow = window.innerHeight - r.bottom
      const spaceAbove = r.top
      const panelH = this.$refs.panel ? Math.min(this.$refs.panel.scrollHeight, maxH) : maxH
      const up = spaceBelow < panelH + gap && spaceAbove > spaceBelow
      this.openedUp = up
      this.panelStyle = {
        position: 'fixed',
        left: `${r.left}px`,
        width: `${r.width}px`,
        ...(up
          ? { bottom: `${window.innerHeight - r.top + gap}px` }
          : { top: `${r.bottom + gap}px` })
      }
    }
  }
}
</script>

<style scoped src="./BaseSelect.css"></style>
