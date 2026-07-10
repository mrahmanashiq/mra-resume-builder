<template>
  <div class="fixed inset-0 z-50 no-print flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Share">
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

    <div class="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-slate-100">Share {{ label.toLowerCase() }}</h2>
        <button type="button" @click="$emit('close')" aria-label="Close"
                class="text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 text-xl leading-none">&times;</button>
      </div>

      <div class="p-5 space-y-4">
        <p class="text-sm text-gray-600 dark:text-slate-400">
          Anyone with this link can view a read-only copy in their browser. The photo is not
          included, and the data lives in the link itself (no account, no server).
        </p>

        <!-- Link + copy -->
        <div class="flex gap-2">
          <input ref="urlInput" :value="shareUrl" readonly
                 class="input-field flex-1 text-xs" @focus="$event.target.select()" />
          <button type="button" class="btn-primary flex-none" @click="copy">{{ copied ? 'Copied' : 'Copy' }}</button>
        </div>

        <!-- QR -->
        <div class="pt-2 border-t border-gray-100 dark:border-slate-700">
          <div v-if="qrDataUrl" class="text-center">
            <img :src="qrDataUrl" alt="QR code for the share link"
                 class="mx-auto rounded-lg border border-gray-200 dark:border-slate-700 bg-white" width="240" height="240" />
            <p class="text-sm text-gray-600 dark:text-slate-400 mt-3">Scan to open, or download it to print or show at events.</p>
            <button type="button" class="btn-secondary mt-3" @click="downloadQr">Download QR (PNG)</button>
          </div>

          <div v-else-if="qrError" class="text-center py-4">
            <p class="text-sm text-gray-600 dark:text-slate-400">
              This {{ label.toLowerCase() }} is too detailed to fit in a QR code. Use the link above,
              or trim some content and try again.
            </p>
          </div>

          <div v-else class="text-center py-6">
            <div class="w-8 h-8 mx-auto rounded-full border-2 border-primary-200 border-t-primary-600 animate-spin"></div>
            <p class="text-sm text-gray-500 dark:text-slate-400 mt-2">Generating QR code…</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import { buildShareUrl } from '../../utils/shareLink'

export default {
  name: 'ShareModal',
  props: {
    store: { type: Object, required: true },
    type: { type: String, required: true },
    label: { type: String, default: 'Document' }
  },
  emits: ['close'],
  data() {
    return { shareUrl: '', qrDataUrl: null, qrError: false, copied: false }
  },
  mounted() {
    try {
      const data = JSON.parse(this.store.exportData())
      this.shareUrl = buildShareUrl(this.type, data)
    } catch (e) {
      this.shareUrl = ''
    }
    this.generateQr()
  },
  methods: {
    async generateQr() {
      if (!this.shareUrl) {
        this.qrError = true
        return
      }
      try {
        // Low error-correction maximises capacity so more documents fit.
        this.qrDataUrl = await QRCode.toDataURL(this.shareUrl, {
          errorCorrectionLevel: 'L',
          margin: 2,
          width: 480
        })
        this.qrError = false
      } catch (e) {
        this.qrDataUrl = null
        this.qrError = true
      }
    },
    downloadQr() {
      if (!this.qrDataUrl) return
      const a = document.createElement('a')
      a.href = this.qrDataUrl
      a.download = `${this.label.replace(/\s+/g, '_')}_QR.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
    },
    async copy() {
      const ok = await this.copyToClipboard(this.shareUrl)
      if (ok) {
        this.copied = true
        setTimeout(() => { this.copied = false }, 1800)
      }
    },
    async copyToClipboard(text) {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text)
          return true
        }
      } catch (e) {
        /* fall through */
      }
      try {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.focus()
        ta.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(ta)
        return ok
      } catch (e) {
        return false
      }
    }
  }
}
</script>
