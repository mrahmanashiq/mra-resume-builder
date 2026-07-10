<template>
  <div class="fixed inset-0 z-50 no-print flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="ATS match check">
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

    <div class="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700">
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-100">ATS match check</h2>
        <button type="button" @click="$emit('close')" aria-label="Close"
                class="text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 text-xl leading-none">&times;</button>
      </div>

      <div class="p-5 space-y-4">
        <p class="text-sm text-gray-600 dark:text-slate-400">
          Paste a job description below. We compare its keywords with your resume and show what is
          covered and what is missing. This is a keyword guide that runs in your browser, not a
          guarantee of any specific ATS score.
        </p>

        <textarea v-model="jd" rows="6" class="textarea-field"
                  placeholder="Paste the job description here..."></textarea>

        <div class="flex items-center gap-3">
          <button type="button" class="btn-primary" :disabled="!jd.trim()" @click="run">
            Check match
          </button>
          <button v-if="result" type="button" class="btn-secondary" @click="reset">Clear</button>
        </div>

        <!-- Results -->
        <div v-if="result" class="pt-2 border-t border-gray-100 dark:border-slate-700 space-y-4">
          <div class="flex items-center gap-4">
            <div class="flex-none w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg"
                 :class="scoreClasses">
              {{ result.score }}%
            </div>
            <div>
              <p class="font-semibold text-gray-900 dark:text-slate-100">{{ scoreLabel }}</p>
              <p class="text-sm text-gray-600 dark:text-slate-400">
                {{ result.matched.length }} of {{ result.total }} keywords found in your resume.
              </p>
            </div>
          </div>

          <div v-if="result.missing.length">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2">
              Consider adding ({{ result.missing.length }})
            </h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="k in result.missing" :key="'m-' + k"
                    class="inline-block text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800/60">
                {{ k }}
              </span>
            </div>
          </div>

          <div v-if="result.matched.length">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2">
              Already covered ({{ result.matched.length }})
            </h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="k in result.matched" :key="'g-' + k"
                    class="inline-block text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800/60">
                {{ k }}
              </span>
            </div>
          </div>

          <p class="text-xs text-gray-500 dark:text-slate-400">
            Tip: only add keywords that are genuinely true for you, and put them in the relevant
            section (skills, experience) so they read naturally.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { analyze, resumeToText } from '../../utils/atsMatch'

export default {
  name: 'AtsMatchModal',
  props: {
    store: { type: Object, required: true }
  },
  emits: ['close'],
  data() {
    return {
      jd: '',
      result: null
    }
  },
  computed: {
    scoreLabel() {
      if (!this.result) return ''
      const s = this.result.score
      if (s >= 70) return 'Strong keyword match'
      if (s >= 40) return 'Partial match - room to improve'
      return 'Low match - add relevant keywords'
    },
    scoreClasses() {
      const s = this.result ? this.result.score : 0
      if (s >= 70) return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
      if (s >= 40) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
      return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
    }
  },
  methods: {
    run() {
      if (!this.jd.trim()) return
      this.result = analyze(resumeToText(this.store), this.jd)
    },
    reset() {
      this.jd = ''
      this.result = null
    }
  }
}
</script>
