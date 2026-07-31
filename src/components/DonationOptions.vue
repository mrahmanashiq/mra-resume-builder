<template>
  <div class="donation-options">
    <div class="amount-row" role="group" aria-label="Choose a donation amount">
      <button
        v-for="opt in options"
        :key="opt.id"
        type="button"
        class="amount-btn"
        :class="{ 'amount-btn--active': opt.id === selectedId }"
        :aria-pressed="opt.id === selectedId"
        @click="select(opt.id)"
      >
        {{ opt.label }}
      </button>
    </div>

    <div class="qr-panel">
      <div class="qr-frame">
        <img
          v-if="qrDataUrl"
          :src="qrDataUrl"
          :alt="`Binance Pay QR code for the ${selected.label} donation`"
          class="qr-img"
          width="220"
          height="220"
        />
        <div v-else-if="qrError" class="qr-fallback">
          Could not render the QR code here. Use the button below to open Binance instead.
        </div>
        <div v-else class="qr-loading" aria-hidden="true"><span class="spinner"></span></div>
      </div>

      <div class="qr-hint">Scan with the Binance app to pay, or tap below on mobile.</div>

      <a :href="selected.url" target="_blank" rel="noopener"
         :class="[variant === 'outline' ? 'btn-outline' : 'btn-primary', 'inline-flex items-center gap-2 mt-4 no-underline']">
        <svg width="18" height="18" viewBox="0 0 201 201" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M126.452 111.118L141.537 126.159L100.531 167.121L59.5688 126.159L74.6533 111.118L100.531 136.995L126.452 111.118ZM100.531 85.1965L115.832 100.498L100.531 115.799L85.2732 100.541V100.498L87.9607 97.8103L89.2611 96.5099L100.531 85.1965ZM48.949 85.4133L64.0335 100.498L48.949 115.539L33.8644 100.454L48.949 85.4133ZM152.113 85.4133L167.198 100.498L152.113 115.539L137.029 100.454L152.113 85.4133ZM100.531 33.8311L141.493 74.7934L126.409 89.8779L100.531 63.9568L74.6533 89.8346L59.5688 74.7934L100.531 33.8311Z" fill="#F3BA2F"/>
        </svg>
        Open in Binance app
      </a>

      <div class="qr-secure">Paid securely via Binance Pay.</div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import { BINANCE_OPTIONS } from '../config/support'

export default {
  name: 'DonationOptions',
  props: {
    // 'solid' (default) for the /support page where this is the only CTA;
    // 'outline' in the download modal so the blue "Skip and download" button
    // stays the single primary action.
    variant: {
      type: String,
      default: 'solid'
    }
  },
  data() {
    return {
      options: BINANCE_OPTIONS,
      selectedId: BINANCE_OPTIONS[0].id,
      qrCache: {}, // id -> data URL, so switching amounts does not re-render
      qrError: false
    }
  },
  computed: {
    selected() {
      return this.options.find((o) => o.id === this.selectedId) || this.options[0]
    },
    qrDataUrl() {
      return this.qrCache[this.selectedId] || null
    }
  },
  watch: {
    selectedId() {
      this.generateQr()
    }
  },
  mounted() {
    this.generateQr()
  },
  methods: {
    select(id) {
      this.selectedId = id
    },
    async generateQr() {
      const opt = this.selected
      if (!opt) return
      if (this.qrCache[opt.id]) {
        this.qrError = false
        return
      }
      try {
        const dataUrl = await QRCode.toDataURL(opt.url, {
          errorCorrectionLevel: 'M',
          margin: 2,
          width: 480
        })
        this.qrCache = { ...this.qrCache, [opt.id]: dataUrl }
        this.qrError = false
      } catch (e) {
        this.qrError = true
      }
    }
  }
}
</script>

<style scoped src="./DonationOptions.css"></style>
