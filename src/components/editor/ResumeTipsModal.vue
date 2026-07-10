<template>
  <div class="fixed inset-0 z-50 no-print flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Resume tips">
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

    <div class="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-100">Resume tips</h2>
        <button type="button" @click="$emit('close')" aria-label="Close"
                class="text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 text-xl leading-none">&times;</button>
      </div>

      <div class="p-5 space-y-4">
        <div class="flex items-center gap-4">
          <div class="flex-none w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg" :class="scoreClasses">
            {{ result.score }}%
          </div>
          <div>
            <p class="font-semibold text-gray-900 dark:text-slate-100">{{ scoreLabel }}</p>
            <p class="text-sm text-gray-600 dark:text-slate-400">{{ result.passed }} of {{ result.total }} checks look good.</p>
          </div>
        </div>

        <ul class="space-y-2.5 pt-2 border-t border-gray-100 dark:border-slate-700">
          <li v-for="c in result.checks" :key="c.id" class="flex gap-3">
            <span class="flex-none mt-0.5" :class="c.ok ? 'text-green-600 dark:text-green-400' : 'text-amber-500 dark:text-amber-400'">
              <CheckCircleIcon v-if="c.ok" class="w-5 h-5" />
              <ExclamationCircleIcon v-else class="w-5 h-5" />
            </span>
            <span class="min-w-0">
              <span class="block font-medium text-gray-800 dark:text-slate-100">{{ c.label }}</span>
              <span v-if="!c.ok" class="block text-sm text-gray-600 dark:text-slate-400">{{ c.hint }}</span>
            </span>
          </li>
        </ul>

        <p class="text-xs text-gray-500 dark:text-slate-400">
          These are general guidelines to help you improve. Tailor your resume to each role, and use
          the ATS match check to compare it against a specific job description.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import { analyzeResume } from '../../utils/resumeTips'

export default {
  name: 'ResumeTipsModal',
  components: { CheckCircleIcon, ExclamationCircleIcon },
  props: {
    store: { type: Object, required: true }
  },
  emits: ['close'],
  computed: {
    result() {
      return analyzeResume(this.store)
    },
    scoreLabel() {
      const s = this.result.score
      if (s >= 80) return 'Looking strong'
      if (s >= 50) return 'Good start - a few things to improve'
      return 'Needs work - see the suggestions'
    },
    scoreClasses() {
      const s = this.result.score
      if (s >= 80) return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
      if (s >= 50) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
      return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
    }
  }
}
</script>
