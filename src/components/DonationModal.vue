<template>
  <div class="fixed inset-0 z-50 no-print flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Support this project">
    <!-- Backdrop is intentionally inert: the modal is dismissed only via the
         buttons below, so an accidental outside click never cancels a download. -->
    <div class="absolute inset-0 bg-black/50"></div>

    <div class="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-100">Support Resume Builder</h2>
        <button type="button" @click="$emit('close')" aria-label="Close without downloading"
                class="text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 text-xl leading-none">&times;</button>
      </div>

      <div class="p-5 space-y-4">
        <p class="text-sm text-gray-600 dark:text-slate-400">
          It's free and open source (MIT), with no ads or tracking. Donations are optional and
          go toward the domain, hosting, and continued development.
        </p>

        <DonationOptions variant="outline" />

        <button type="button"
                class="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-base font-bold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:ring-offset-slate-800"
                @click="$emit('download')">
          <CloudArrowDownIcon class="w-5 h-5" />
          Skip and download
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { CloudArrowDownIcon } from '@heroicons/vue/24/outline'
import DonationOptions from './DonationOptions.vue'

export default {
  name: 'DonationModal',
  components: { DonationOptions, CloudArrowDownIcon },
  emits: ['close', 'download']
}
</script>
