import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useResumeStore } from '../stores/resume'
import { format, parseISO } from 'date-fns'
import { iconKeyFor } from '../utils/linkIcons'

/**
 * Shared logic for every résumé template.
 *
 * Templates differ only in markup / styling; the logic (date formatting,
 * section ordering, link + contact building, icon detection, colour-scheme
 * CSS vars) is identical, so it lives here once. A template's <script> becomes
 * roughly `setup() { return useResumeTemplate() }`, and a change to any of this
 * behaviour is a one-file edit instead of 13.
 *
 * Provides:
 *  - store refs: personalInfo, skills, experience, ... , settings, customLinks
 *  - enabled (sectionsEnabled), showLinkIcons
 *  - templateStyles (colorScheme -> CSS vars + font)
 *  - formatUrl, formatDate, dateRange, ord(key), hasAchievements(exp)
 *  - headerLinks  [{ label, value, href, icon }]  (LinkedIn/GitHub/Portfolio + custom)
 *  - contactItems [{ text, href, icon }]           (email / phone / address)
 *  - store getters: fullName, sortedExperience, skillsByCategory, activeCertifications
 */
export function useResumeTemplate() {
  const resumeStore = useResumeStore()
  const {
    personalInfo, customLinks, skills, experience, education, projects, certifications,
    languages, publications, teaching, talks, awards, service, personalDetails, training,
    accomplishments, extracurricular, references, declaration, settings
  } = storeToRefs(resumeStore)

  const enabled = computed(() => settings.value.sectionsEnabled)
  const showLinkIcons = computed(() => settings.value.showLinkIcons)
  // Optional header alignment override (single-column templates). Empty = the
  // template's own designed alignment; 'left' | 'center' overrides it.
  const headerAlign = computed(() => settings.value.headerAlign || '')
  const headerStyle = computed(() =>
    headerAlign.value ? { textAlign: headerAlign.value, alignItems: headerAlign.value === 'center' ? 'center' : 'flex-start' } : {}
  )

  const templateStyles = computed(() => {
    const c = settings.value.colorScheme
    const base = settings.value.fontSize
    return {
      '--primary': c.primary,
      '--secondary': c.secondary,
      '--accent': c.accent,
      '--text': c.text,
      '--background': c.background,
      // One base size scales the whole document. `em`/inherited text scales via
      // the root font-size; absolute (rem/px) sizes in template CSS multiply by
      // --fs-scale (base / 14 default). calc()+var() resolve to concrete px, so
      // html2canvas captures the scaled sizes correctly in PDF export.
      '--fs-scale': base / 14,
      fontSize: `${base}px`,
      fontFamily: settings.value.font
    }
  })

  const formatUrl = (url) => {
    if (!url) return ''
    return /^https?:\/\//i.test(url) || String(url).startsWith('mailto:') ? url : `https://${url}`
  }

  const formatDate = (v) => {
    if (!v) return ''
    try {
      return format(parseISO(v + '-01'), 'MMM yyyy')
    } catch {
      return v
    }
  }

  const dateRange = (start, end, current = false) => {
    const s = formatDate(start)
    const e = current ? 'Present' : formatDate(end)
    if (s && e) return `${s} - ${e}`
    return s || e || ''
  }

  const ord = (key) => {
    const i = settings.value.sectionsOrder.indexOf(key)
    return i === -1 ? 99 : i
  }

  const hasAchievements = (exp) =>
    !!(exp && exp.achievements && exp.achievements.some((a) => a && a.trim()))

  const contactItems = computed(() => {
    const p = personalInfo.value
    const out = []
    if (p.email) out.push({ text: p.email, href: `mailto:${p.email}`, icon: 'email' })
    if (p.phone) out.push({ text: p.phone, href: null, icon: 'phone' })
    if (p.address) out.push({ text: p.address, href: null, icon: 'location' })
    return out
  })

  const headerLinks = computed(() => {
    const p = personalInfo.value
    const out = []
    // Display text defaults to the platform name but the user can override it
    // per link (e.g. show "My LinkedIn" while still linking to the real URL).
    if (p.linkedin) out.push({ label: p.linkedinLabel || 'LinkedIn', value: p.linkedin, href: formatUrl(p.linkedin), icon: 'linkedin' })
    if (p.github) out.push({ label: p.githubLabel || 'GitHub', value: p.github, href: formatUrl(p.github), icon: 'github' })
    if (p.website) out.push({ label: p.websiteLabel || 'Portfolio', value: p.website, href: formatUrl(p.website), icon: 'website' })
    for (const l of customLinks.value || []) {
      if (l && l.label && l.url) {
        out.push({ label: l.label, value: l.url, href: formatUrl(l.url), icon: iconKeyFor(l.label, l.url) })
      }
    }
    return out
  })

  return {
    resumeStore,
    personalInfo, customLinks, skills, experience, education, projects, certifications,
    languages, publications, teaching, talks, awards, service, personalDetails, training,
    accomplishments, extracurricular, references, declaration, settings,
    enabled, showLinkIcons, templateStyles, headerAlign, headerStyle,
    formatUrl, formatDate, dateRange, ord, hasAchievements,
    contactItems, headerLinks,
    fullName: computed(() => resumeStore.fullName),
    sortedExperience: computed(() => resumeStore.sortedExperience),
    skillsByCategory: computed(() => resumeStore.skillsByCategory),
    activeCertifications: computed(() => resumeStore.activeCertifications)
  }
}
