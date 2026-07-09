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

<style scoped>
.bs-wrap {
  position: relative;
  width: 100%;
}

/* Trigger inherits .input-field sizing; we add layout + affordances */
.bs-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  text-align: left;
  cursor: pointer;
  background: #fff;
  color: #111827;
}

.bs-trigger.bs-open {
  border-color: transparent;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.7);
  outline: none;
}

.bs-placeholder .bs-label {
  color: #9ca3af;
}

.bs-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bs-chevron {
  width: 1.1rem;
  height: 1.1rem;
  flex-shrink: 0;
  color: #6b7280;
  transition: transform 0.2s ease;
}

.bs-open .bs-chevron {
  transform: rotate(180deg);
}

.bs-disabled {
  opacity: 0.6;
}

.bs-disabled .bs-trigger {
  cursor: not-allowed;
}

/* Panel (teleported to body) */
.bs-panel {
  z-index: 60;
  max-height: 240px;
  overflow-y: auto;
  padding: 0.25rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.6rem;
  box-shadow: 0 12px 28px -8px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.03);
}

.bs-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
  text-align: left;
  padding: 0.5rem 0.6rem;
  border-radius: 0.4rem;
  font-size: 0.9rem;
  color: #1f2937;
  cursor: pointer;
  background: transparent;
  line-height: 1.25;
}

.bs-option-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bs-active {
  background: #f1f5f9;
}

.bs-selected {
  color: var(--bs-primary, #1d4ed8);
  font-weight: 600;
}

.bs-selected.bs-active {
  background: #eff6ff;
}

.bs-opt-placeholder {
  color: #9ca3af;
}

.bs-opt-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bs-check {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  color: var(--bs-primary, #1d4ed8);
}

/* Open / close animation */
.bs-pop-enter-active,
.bs-pop-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
}

.bs-pop-enter-from,
.bs-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

.bs-panel-up.bs-pop-enter-from,
.bs-panel-up.bs-pop-leave-to {
  transform: translateY(4px) scale(0.98);
}

@media (prefers-reduced-motion: reduce) {
  .bs-chevron,
  .bs-pop-enter-active,
  .bs-pop-leave-active {
    transition: none;
  }
}
</style>
