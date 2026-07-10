/**
 * Central SEO config. Every canonical/OG URL is derived from SITE_URL, so
 * switching the primary host (e.g. apex vs www) is a one-line change here.
 *
 * SITE_URL matches the current Vercel primary domain (apex redirects to www).
 * If the primary is ever flipped to the bare apex, change this to
 * 'https://resume-builder.click' and update public/robots.txt + sitemap.xml.
 */
export const SITE_URL = 'https://www.resume-builder.click'
export const SITE_NAME = 'MRA Builder'

export const DEFAULT_TITLE = 'Free Resume & Marriage Biodata Maker - MRA Builder'
export const DEFAULT_DESCRIPTION =
  'Build an ATS-friendly resume or a marriage biodata for free. Pick a template, edit with a live preview, and download a print-ready PDF. No sign-up, open source, and your data never leaves your browser.'
export const OG_IMAGE = `${SITE_URL}/og-image.png`

/** Absolute URL for a route path. */
export function absoluteUrl(path = '/') {
  if (!path || path === '/') return `${SITE_URL}/`
  return SITE_URL + path
}

/** JSON-LD describing the web app (emitted on the home page). */
export const APP_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any (web browser)',
  description: DEFAULT_DESCRIPTION,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'ATS-friendly resume builder',
    'Marriage biodata maker',
    'Free resume and biodata templates',
    'PDF, Word, PNG and JPG export',
    'No sign-up, data stays in the browser'
  ]
}

/**
 * Build the full head object for a route from its `meta.seo` block.
 * Consumed by a single reactive `useHead` in App.vue, so all page SEO lives
 * in the router in one place.
 */
export function routeHead(route) {
  const seo = (route && route.meta && route.meta.seo) || {}
  const path = (route && route.path) || '/'
  const title = seo.title || DEFAULT_TITLE
  const description = seo.description || DEFAULT_DESCRIPTION
  const image = seo.image || OG_IMAGE
  const url = absoluteUrl(path)
  const robots = seo.noindex ? 'noindex, nofollow' : 'index, follow'

  const head = {
    title,
    link: [{ rel: 'canonical', href: url }],
    meta: [
      { name: 'description', content: description },
      { name: 'robots', content: robots },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image }
    ]
  }

  // Emit the app structured data on the home page only.
  if (path === '/') {
    head.script = [
      { type: 'application/ld+json', innerHTML: JSON.stringify(APP_JSONLD) }
    ]
  }

  return head
}
