<template>
  <div class="dp-wrap" :class="{ 'dp-disabled': disabled }">
    <button
      ref="trigger"
      type="button"
      class="dp-trigger input-field"
      :class="{ 'dp-open': open, 'dp-placeholder': !displayLabel }"
      :disabled="disabled"
      :aria-expanded="open ? 'true' : 'false'"
      aria-haspopup="dialog"
      @click="toggle"
      @keydown="onTriggerKeydown"
    >
      <span class="dp-label">{{ displayLabel || placeholderText }}</span>
      <CalendarDaysIcon class="dp-icon" />
    </button>

    <Teleport to="body">
      <transition name="dp-pop">
        <div
          v-if="open"
          ref="panel"
          class="dp-panel"
          :class="{ 'dp-panel-up': openedUp }"
          :style="panelStyle"
          role="dialog"
          aria-modal="false"
          @mousedown.prevent
          @keydown="onPanelKeydown"
          tabindex="-1"
        >
          <!-- Header -->
          <div class="dp-head">
            <button type="button" class="dp-nav" @click="prevPeriod" aria-label="Previous">
              <ChevronLeftIcon class="dp-nav-icon" />
            </button>
            <button type="button" class="dp-title" @click="cycleView">{{ headerLabel }}</button>
            <button type="button" class="dp-nav" @click="nextPeriod" aria-label="Next">
              <ChevronRightIcon class="dp-nav-icon" />
            </button>
          </div>

          <!-- Days view -->
          <div v-if="view === 'days'" class="dp-body">
            <div class="dp-weekdays">
              <span v-for="w in weekdayLabels" :key="w">{{ w }}</span>
            </div>
            <div class="dp-grid dp-days">
              <button
                v-for="cell in dayCells"
                :key="cell.key"
                type="button"
                class="dp-cell"
                :class="{
                  'dp-muted': !cell.inMonth,
                  'dp-today': cell.isToday,
                  'dp-selected': cell.isSelected,
                  'dp-hl': cell.isHighlighted
                }"
                @click="selectDay(cell.date)"
              >{{ cell.day }}</button>
            </div>
          </div>

          <!-- Months view -->
          <div v-else-if="view === 'months'" class="dp-body">
            <div class="dp-grid dp-months">
              <button
                v-for="(m, i) in monthCells"
                :key="i"
                type="button"
                class="dp-cell dp-cell-lg"
                :class="{ 'dp-today': m.isCurrent, 'dp-selected': m.isSelected }"
                @click="selectMonth(i)"
              >{{ m.label }}</button>
            </div>
          </div>

          <!-- Years view -->
          <div v-else class="dp-body">
            <div class="dp-grid dp-months">
              <button
                v-for="y in yearCells"
                :key="y.year"
                type="button"
                class="dp-cell dp-cell-lg"
                :class="{ 'dp-today': y.isCurrent, 'dp-selected': y.isSelected }"
                @click="selectYear(y.year)"
              >{{ y.year }}</button>
            </div>
          </div>

          <!-- Footer -->
          <div class="dp-foot">
            <button type="button" class="dp-link" @click="clear">Clear</button>
            <button type="button" class="dp-link" @click="goToday">{{ mode === 'month' ? 'This month' : 'Today' }}</button>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script>
import {
  format, parseISO, startOfMonth, startOfWeek, addDays, addMonths, addYears,
  isSameDay, isSameMonth, isToday, setMonth, setYear, getMonth, getYear
} from 'date-fns'
import {
  CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon
} from '@heroicons/vue/24/outline'

let dpSeed = 0

export default {
  name: 'BaseDatePicker',
  components: { CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon },
  props: {
    modelValue: { type: String, default: '' },
    // 'date' => emits YYYY-MM-DD ; 'month' => emits YYYY-MM
    mode: { type: String, default: 'date' },
    placeholder: { type: String, default: '' },
    disabled: { type: Boolean, default: false }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      open: false,
      view: 'days',
      viewDate: new Date(),
      highlighted: null,
      openedUp: false,
      panelStyle: {},
      uid: `dp-${++dpSeed}`
    }
  },
  computed: {
    placeholderText() {
      if (this.placeholder) return this.placeholder
      return this.mode === 'month' ? 'Select month' : 'Select date'
    },
    selectedDate() {
      return this.parse(this.modelValue)
    },
    displayLabel() {
      const d = this.selectedDate
      if (!d) return ''
      return this.mode === 'month' ? format(d, 'MMM yyyy') : format(d, 'dd MMM yyyy')
    },
    weekdayLabels() {
      return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    },
    headerLabel() {
      if (this.view === 'years') {
        const start = this.yearPageStart
        return `${start} - ${start + 11}`
      }
      if (this.view === 'months') return String(getYear(this.viewDate))
      return format(this.viewDate, 'MMMM yyyy')
    },
    dayCells() {
      const first = startOfWeek(startOfMonth(this.viewDate), { weekStartsOn: 0 })
      const sel = this.selectedDate
      const hl = this.highlighted
      const cells = []
      for (let i = 0; i < 42; i++) {
        const date = addDays(first, i)
        cells.push({
          key: i,
          date,
          day: date.getDate(),
          inMonth: isSameMonth(date, this.viewDate),
          isToday: isToday(date),
          isSelected: sel ? isSameDay(date, sel) : false,
          isHighlighted: hl ? isSameDay(date, hl) : false
        })
      }
      return cells
    },
    monthCells() {
      const sel = this.selectedDate
      const now = new Date()
      const yr = getYear(this.viewDate)
      return Array.from({ length: 12 }, (_, i) => ({
        label: format(setMonth(new Date(2000, 0, 1), i), 'MMM'),
        isCurrent: getYear(now) === yr && getMonth(now) === i,
        isSelected: sel ? getYear(sel) === yr && getMonth(sel) === i : false
      }))
    },
    yearPageStart() {
      const y = getYear(this.viewDate)
      return y - (y % 12)
    },
    yearCells() {
      const start = this.yearPageStart
      const sel = this.selectedDate
      const nowY = getYear(new Date())
      return Array.from({ length: 12 }, (_, i) => {
        const year = start + i
        return { year, isCurrent: year === nowY, isSelected: sel ? getYear(sel) === year : false }
      })
    }
  },
  watch: {
    open(v) {
      if (v) {
        this.view = this.mode === 'month' ? 'months' : 'days'
        this.viewDate = this.selectedDate || new Date()
        this.highlighted = this.selectedDate || new Date()
      }
    }
  },
  beforeUnmount() {
    this.removeListeners()
  },
  methods: {
    parse(v) {
      if (!v) return null
      try {
        const iso = this.mode === 'month' ? `${v}-01` : v
        const d = parseISO(iso)
        return isNaN(d.getTime()) ? null : d
      } catch {
        return null
      }
    },
    toggle() {
      if (this.disabled) return
      this.open ? this.close() : this.openPanel()
    },
    openPanel() {
      this.open = true
      this.$nextTick(() => this.positionPanel())
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
    cycleView() {
      if (this.view === 'days') this.view = 'months'
      else if (this.view === 'months') this.view = 'years'
    },
    prevPeriod() {
      if (this.view === 'days') this.viewDate = addMonths(this.viewDate, -1)
      else if (this.view === 'months') this.viewDate = addYears(this.viewDate, -1)
      else this.viewDate = addYears(this.viewDate, -12)
    },
    nextPeriod() {
      if (this.view === 'days') this.viewDate = addMonths(this.viewDate, 1)
      else if (this.view === 'months') this.viewDate = addYears(this.viewDate, 1)
      else this.viewDate = addYears(this.viewDate, 12)
    },
    selectDay(date) {
      this.emitDate(date)
      this.close()
    },
    selectMonth(i) {
      this.viewDate = setMonth(this.viewDate, i)
      if (this.mode === 'month') {
        this.emitDate(this.viewDate)
        this.close()
      } else {
        this.view = 'days'
        this.highlighted = this.viewDate
      }
    },
    selectYear(year) {
      this.viewDate = setYear(this.viewDate, year)
      this.view = 'months'
    },
    clear() {
      this.$emit('update:modelValue', '')
      this.close()
    },
    goToday() {
      const now = new Date()
      if (this.mode === 'month') {
        this.emitDate(now)
        this.close()
      } else {
        this.viewDate = now
        this.highlighted = now
        this.view = 'days'
      }
    },
    emitDate(date) {
      this.$emit('update:modelValue', format(date, this.mode === 'month' ? 'yyyy-MM' : 'yyyy-MM-dd'))
    },
    onTriggerKeydown(e) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        if (!this.open) this.openPanel()
      } else if (e.key === 'Escape' && this.open) {
        this.close()
      }
    },
    onPanelKeydown(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        this.close()
        return
      }
      if (this.view !== 'days') return
      const map = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
      if (e.key in map) {
        e.preventDefault()
        this.highlighted = addDays(this.highlighted || new Date(), map[e.key])
        if (!isSameMonth(this.highlighted, this.viewDate)) this.viewDate = this.highlighted
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        if (this.highlighted) this.selectDay(this.highlighted)
      } else if (e.key === 'PageUp') {
        e.preventDefault()
        this.highlighted = addMonths(this.highlighted || new Date(), -1)
        this.viewDate = this.highlighted
      } else if (e.key === 'PageDown') {
        e.preventDefault()
        this.highlighted = addMonths(this.highlighted || new Date(), 1)
        this.viewDate = this.highlighted
      }
    },
    positionPanel() {
      const btn = this.$refs.trigger
      if (!btn) return
      const r = btn.getBoundingClientRect()
      const gap = 6
      const width = 280
      const panelH = this.$refs.panel ? this.$refs.panel.offsetHeight : 320
      const spaceBelow = window.innerHeight - r.bottom
      const up = spaceBelow < panelH + gap && r.top > spaceBelow
      this.openedUp = up
      let left = r.left
      const maxLeft = window.innerWidth - width - 8
      if (left > maxLeft) left = Math.max(8, maxLeft)
      this.panelStyle = {
        position: 'fixed',
        left: `${left}px`,
        width: `${width}px`,
        ...(up ? { bottom: `${window.innerHeight - r.top + gap}px` } : { top: `${r.bottom + gap}px` })
      }
    }
  }
}
</script>

<style scoped src="./BaseDatePicker.css"></style>
