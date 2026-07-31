/**
 * Binance Pay donation links for the /support page.
 *
 * Each entry is a Binance "uni-qr" scan-to-pay deep link, created in the Binance
 * app. Create them with "Multiple Payment" enabled so a single link stays
 * reusable across many donations.
 *
 * These are QR links, not ordinary web checkout URLs: opening the raw URL in a
 * desktop browser just lands on Binance's app-download page. So the /support
 * page renders the QR itself (via the `qrcode` dependency). A donor on desktop
 * scans the on-screen QR with the Binance mobile app; a donor on mobile taps
 * the "Open in Binance app" button to jump straight into the app.
 *
 * To add or change an amount, create the link in Binance and paste it here -
 * the /support page picks it up automatically, no component changes needed.
 */

// Fixed-amount options, shown first in display order.
export const BINANCE_PRESETS = [
  { id: '5', label: '$5', url: 'https://app.binance.com/uni-qr/BiNJRHUs' }
]

// User enters the amount in the Binance app after opening/scanning.
export const BINANCE_CUSTOM = {
  id: 'custom',
  label: 'Any amount',
  url: 'https://app.binance.com/uni-qr/Dv5kmWsk'
}

// All options in display order: presets first, custom last.
export const BINANCE_OPTIONS = [...BINANCE_PRESETS, BINANCE_CUSTOM]
