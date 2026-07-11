import { saveAs } from 'file-saver'
import { format, parseISO } from 'date-fns'

/**
 * Text-based resume export: a real selectable-text PDF (jsPDF text API) and an
 * editable Word document. Unlike the html2canvas image export, the output here
 * is actual text, so it is ATS-parseable, searchable, and editable.
 *
 * Both formats are generated from the resume store data (not the rendered
 * template) as a clean single-column layout, which is what ATS systems expect.
 */

function fmtDate(v) {
  if (!v) return ''
  try {
    const iso = v.length === 7 ? `${v}-01` : v
    return format(parseISO(iso), 'MMM yyyy')
  } catch {
    return v
  }
}

function dateRange(start, end, current = false) {
  const a = fmtDate(start)
  const b = current ? 'Present' : fmtDate(end)
  if (a && b) return `${a} – ${b}`
  return a || b || ''
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '')
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [37, 99, 235]
}

/** Normalize a user-entered link to a full URL (adds https:// when missing). */
function urlHref(u) {
  if (!u) return ''
  const s = String(u).trim()
  return /^(https?:|mailto:|tel:)/i.test(s) ? s : `https://${s}`
}

/**
 * Turn the resume store into an ordered, normalized list of sections that both
 * renderers can consume. Honors sectionsOrder + sectionsEnabled and skips empties.
 */
export function buildResumeContent(store) {
  const p = store.personalInfo || {}
  const s = store.settings || {}
  const enabled = s.sectionsEnabled || {}
  const order = s.sectionsOrder || []

  const name = (store.fullName || `${p.firstName || ''} ${p.lastName || ''}`).trim()
  const contacts = [p.email, p.phone, p.address, p.website, p.linkedin, p.github, p.scholar]
    .filter(Boolean)

  // Same items, with hrefs for the ones that are links (used by Word + text-PDF
  // so exports carry clickable links). Custom header links are appended.
  const contactLinks = []
  if (p.email) contactLinks.push({ text: p.email, href: `mailto:${p.email}` })
  if (p.phone) contactLinks.push({ text: p.phone, href: '' })
  if (p.address) contactLinks.push({ text: p.address, href: '' })
  if (p.website) contactLinks.push({ text: p.website, href: urlHref(p.website) })
  if (p.linkedin) contactLinks.push({ text: p.linkedin, href: urlHref(p.linkedin) })
  if (p.github) contactLinks.push({ text: p.github, href: urlHref(p.github) })
  if (p.scholar) contactLinks.push({ text: p.scholar, href: urlHref(p.scholar) })
  for (const l of store.customLinks || []) {
    if (l && l.label && l.url) contactLinks.push({ text: l.label, href: urlHref(l.url) })
  }

  const sortedExp = () => {
    const list = [...(store.experience || [])]
    return list.sort((a, b) => {
      if (a.current && !b.current) return -1
      if (!a.current && b.current) return 1
      return new Date(b.startDate || 0) - new Date(a.startDate || 0)
    })
  }

  const cleanBullets = (arr) => (arr || []).map((x) => (typeof x === 'string' ? x : x && x.text) || '').filter((x) => x && x.trim())

  const builders = {
    experience: () => ({
      heading: 'Experience',
      entries: sortedExp().map((e) => ({
        title: e.title,
        right: dateRange(e.startDate, e.endDate, e.current),
        subtitle: [e.company, e.location].filter(Boolean).join(' · '),
        lines: [e.description].filter(Boolean),
        bullets: cleanBullets(e.achievements)
      }))
    }),
    education: () => ({
      heading: 'Education',
      entries: (store.education || []).map((e) => ({
        title: e.degree,
        right: dateRange(e.startDate, e.endDate),
        subtitle: [e.institution, e.location].filter(Boolean).join(' · '),
        lines: [
          e.gpa ? `GPA: ${e.gpa}` : null,
          e.thesis ? `Thesis: ${e.thesis}` : null,
          e.advisor ? `Advisor: ${e.advisor}` : null,
          e.description
        ].filter(Boolean),
        bullets: []
      }))
    }),
    publications: () => ({
      heading: 'Publications',
      entries: (store.publications || []).map((pub) => ({
        title: pub.title,
        right: pub.year,
        subtitle: pub.authors,
        lines: [
          [pub.venue, pub.award].filter(Boolean).join(' · '),
          pub.url,
          pub.summary
        ].filter(Boolean),
        bullets: []
      }))
    }),
    teaching: () => ({
      heading: 'Teaching',
      entries: (store.teaching || []).map((t) => ({
        title: t.course,
        right: t.term,
        subtitle: t.institution,
        lines: [],
        bullets: []
      }))
    }),
    talks: () => ({
      heading: 'Invited Talks',
      entries: (store.talks || []).map((t) => ({
        title: t.title,
        right: t.date,
        subtitle: t.event,
        lines: [],
        bullets: []
      }))
    }),
    awards: () => ({
      heading: 'Honors & Awards',
      entries: (store.awards || []).map((a) => ({
        title: a.title,
        right: a.year,
        subtitle: '',
        lines: [a.description].filter(Boolean),
        bullets: []
      }))
    }),
    service: () => ({
      heading: 'Academic Service',
      entries: (store.service || []).map((x) => ({
        title: x.role,
        right: x.year,
        subtitle: '',
        lines: [],
        bullets: []
      }))
    }),
    skills: () => ({
      heading: 'Skills',
      entries: Object.entries(store.skillsByCategory || {}).map(([cat, list]) => ({
        title: cat,
        right: '',
        subtitle: '',
        lines: [list.map((sk) => sk.name).join(', ')],
        bullets: []
      }))
    }),
    projects: () => ({
      heading: 'Projects',
      entries: (store.projects || []).map((pr) => ({
        title: pr.name,
        right: dateRange(pr.startDate, pr.endDate),
        subtitle: (pr.technologies || []).join(', '),
        lines: [pr.description].filter(Boolean),
        links: [
          pr.url ? { label: 'Code', href: urlHref(pr.url) } : null,
          pr.liveUrl ? { label: 'Live', href: urlHref(pr.liveUrl) } : null
        ].filter(Boolean),
        bullets: []
      }))
    }),
    certifications: () => ({
      heading: 'Certifications',
      entries: (store.certifications || []).map((c) => ({
        title: c.name,
        right: fmtDate(c.date),
        subtitle: c.issuer,
        lines: [c.credentialId ? `Credential ID: ${c.credentialId}` : null].filter(Boolean),
        bullets: []
      }))
    }),
    languages: () => ({
      heading: 'Languages',
      entries: [{
        title: '',
        right: '',
        subtitle: '',
        lines: [(store.languages || []).map((l) => `${l.name} (${l.level})`).join(', ')],
        bullets: []
      }]
    }),
    training: () => ({
      heading: 'Training',
      entries: (store.training || []).map((t) => ({
        title: t.title,
        right: t.year,
        subtitle: [t.institute, t.location].filter(Boolean).join(' · '),
        lines: [[t.topic, t.duration].filter(Boolean).join(' · ')].filter(Boolean),
        bullets: []
      }))
    }),
    accomplishments: () => ({
      heading: 'Accomplishments',
      entries: [{ title: '', right: '', subtitle: '', lines: [], bullets: cleanBullets(store.accomplishments) }]
    }),
    extracurricular: () => ({
      heading: 'Extra-Curricular',
      entries: [{ title: '', right: '', subtitle: '', lines: [], bullets: cleanBullets(store.extracurricular) }]
    }),
    references: () => ({
      heading: 'References',
      entries: (store.references || []).map((r) => ({
        title: r.name,
        right: '',
        subtitle: [r.title, r.organization].filter(Boolean).join(', '),
        lines: [r.email, r.mobile].filter(Boolean),
        bullets: []
      }))
    })
  }

  const sections = []
  order.forEach((key) => {
    if (key === 'summary' || key === 'personalInfo' || key === 'declaration' || key === 'personalDetails') return
    if (enabled[key] === false) return
    const build = builders[key]
    if (!build) return
    const section = build()
    // drop empty sections
    const hasContent = section.entries.some((e) => e.title || e.subtitle || (e.lines && e.lines.length) || (e.bullets && e.bullets.length))
    if (hasContent) sections.push(section)
  })

  // Personal details (CV-style) rendered as a labeled block if enabled + present.
  if (enabled.personalDetails !== false && store.personalDetails) {
    const pd = store.personalDetails
    const map = [
      ['Father’s Name', pd.fatherName], ['Mother’s Name', pd.motherName],
      ['Date of Birth', pd.dateOfBirth], ['Gender', pd.gender], ['Marital Status', pd.maritalStatus],
      ['Nationality', pd.nationality], ['Religion', pd.religion], ['Blood Group', pd.bloodGroup],
      ['Permanent Address', pd.permanentAddress], ['Current Address', pd.currentAddress]
    ].filter(([, v]) => v && String(v).trim())
    if (map.length) {
      sections.push({
        heading: 'Personal Details',
        entries: [{ title: '', right: '', subtitle: '', lines: map.map(([k, v]) => `${k}: ${v}`), bullets: [] }]
      })
    }
  }

  const summary = enabled.summary !== false ? (p.summary || '') : ''
  const declaration = enabled.declaration !== false ? (store.declaration && store.declaration.text) || '' : ''

  return {
    name,
    title: p.title || '',
    researchInterests: p.researchInterests || '',
    contacts,
    contactLinks,
    summary,
    sections,
    declaration,
    primary: (s.colorScheme && s.colorScheme.primary) || '#2563eb'
  }
}

/* ---------------- PDF (selectable text via jsPDF) ---------------- */

export async function exportResumePDF(store, filename) {
  const { default: jsPDF } = await import('jspdf')
  const c = buildResumeContent(store)
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })

  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const mL = 48
  const mR = 48
  const mT = 50
  const mB = 50
  const cw = pageW - mL - mR
  const [pr, pg, pb] = hexToRgb(c.primary)
  let y = mT

  const ensure = (h) => {
    if (y + h > pageH - mB) {
      doc.addPage()
      y = mT
    }
  }

  const para = (text, { size = 10, style = 'normal', color = [31, 41, 55], gap = 3, indent = 0, lineGap = 1.25 } = {}) => {
    if (!text) return
    doc.setFont('helvetica', style)
    doc.setFontSize(size)
    doc.setTextColor(color[0], color[1], color[2])
    const lines = doc.splitTextToSize(String(text), cw - indent)
    const lh = size * lineGap
    lines.forEach((ln) => {
      ensure(lh)
      doc.text(ln, mL + indent, y)
      y += lh
    })
    y += gap
  }

  // Header
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(pr, pg, pb)
  ensure(26)
  doc.text(c.name || 'Your Name', mL, y)
  y += 24

  if (c.title) para(c.title, { size: 11.5, style: 'italic', color: [75, 85, 99], gap: 2 })
  if (c.researchInterests) para(`Research Interests: ${c.researchInterests}`, { size: 9.5, color: [75, 85, 99], gap: 2 })
  if (c.contactLinks.length) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    const lh = 9.5 * 1.3
    const sep = '  |  '
    let cx = mL
    ensure(lh)
    c.contactLinks.forEach((it, i) => {
      const sepW = i > 0 ? doc.getTextWidth(sep) : 0
      const itW = doc.getTextWidth(it.text)
      if (cx + sepW + itW > mL + cw) { y += lh; cx = mL }
      if (i > 0) { doc.setTextColor(156, 163, 175); doc.text(sep, cx, y); cx += sepW }
      if (it.href) { doc.setTextColor(pr, pg, pb); doc.textWithLink(it.text, cx, y, { url: it.href }) }
      else { doc.setTextColor(75, 85, 99); doc.text(it.text, cx, y) }
      cx += itW
    })
    y += lh + 6
  }
  if (c.summary) para(c.summary, { size: 10, color: [31, 41, 55], gap: 8 })

  const heading = (text) => {
    ensure(24)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(pr, pg, pb)
    doc.text(String(text).toUpperCase(), mL, y)
    y += 4
    doc.setDrawColor(pr, pg, pb)
    doc.setLineWidth(0.7)
    doc.line(mL, y, mL + cw, y)
    y += 12
  }

  const entry = (e) => {
    // title (left, bold) + right (dates)
    if (e.title || e.right) {
      ensure(14)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10.5)
      doc.setTextColor(17, 24, 39)
      const rightW = e.right ? doc.getTextWidth(e.right) : 0
      const titleLines = doc.splitTextToSize(e.title || '', cw - rightW - 12)
      if (e.right) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(107, 114, 128)
        doc.text(e.right, mL + cw, y, { align: 'right' })
      }
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10.5)
      doc.setTextColor(17, 24, 39)
      titleLines.forEach((ln, i) => {
        if (i > 0) ensure(13)
        doc.text(ln, mL, y)
        y += 13
      })
    }
    if (e.subtitle) para(e.subtitle, { size: 9.5, style: 'italic', color: [55, 65, 81], gap: 1 })
    ;(e.lines || []).forEach((ln) => para(ln, { size: 9.5, color: [55, 65, 81], gap: 1 }))
    if (e.links && e.links.length) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      const lh = 9 * 1.3
      ensure(lh)
      let lx = mL
      const sep = '   ·   '
      e.links.forEach((l, i) => {
        if (i > 0) { doc.setTextColor(156, 163, 175); doc.text(sep, lx, y); lx += doc.getTextWidth(sep) }
        doc.setTextColor(pr, pg, pb)
        doc.textWithLink(l.label, lx, y, { url: l.href })
        lx += doc.getTextWidth(l.label)
      })
      y += lh
    }
    ;(e.bullets || []).forEach((b) => {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9.5)
      doc.setTextColor(31, 41, 55)
      const lines = doc.splitTextToSize(b, cw - 14)
      const lh = 9.5 * 1.25
      lines.forEach((ln, i) => {
        ensure(lh)
        if (i === 0) doc.text('•', mL + 2, y)
        doc.text(ln, mL + 14, y)
        y += lh
      })
    })
    y += 6
  }

  c.sections.forEach((sec) => {
    heading(sec.heading)
    sec.entries.forEach(entry)
    y += 2
  })

  if (c.declaration) {
    heading('Declaration')
    para(c.declaration, { size: 9.5, style: 'italic', color: [55, 65, 81] })
  }

  doc.save(filename)
  return true
}

/* ---------------- Word (.doc, editable HTML) ---------------- */

export function exportResumeWord(store, filename) {
  const c = buildResumeContent(store)
  const parts = []
  parts.push(`<h1 style="margin:0;font-size:24pt;color:${c.primary};">${esc(c.name)}</h1>`)
  if (c.title) parts.push(`<p style="margin:2pt 0;font-style:italic;color:#4b5563;">${esc(c.title)}</p>`)
  if (c.researchInterests) parts.push(`<p style="margin:2pt 0;font-size:10pt;color:#4b5563;"><b>Research Interests:</b> ${esc(c.researchInterests)}</p>`)
  if (c.contactLinks.length) parts.push(`<p style="margin:2pt 0;font-size:10pt;color:#4b5563;">${c.contactLinks.map((x) => (x.href ? `<a href="${esc(x.href)}" style="color:${c.primary};text-decoration:none;">${esc(x.text)}</a>` : esc(x.text))).join(' &nbsp;|&nbsp; ')}</p>`)
  if (c.summary) parts.push(`<p style="margin:8pt 0;font-size:11pt;">${esc(c.summary)}</p>`)

  const headingHtml = (t) => `<h2 style="margin:14pt 0 4pt;font-size:12pt;color:${c.primary};border-bottom:1px solid ${c.primary};padding-bottom:2pt;text-transform:uppercase;letter-spacing:0.5pt;">${esc(t)}</h2>`

  const entryHtml = (e) => {
    let h = ''
    if (e.title || e.right) {
      h += `<p style="margin:6pt 0 0;font-size:11pt;">`
      if (e.title) h += `<b>${esc(e.title)}</b>`
      if (e.right) h += `<span style="float:right;color:#6b7280;font-size:10pt;">${esc(e.right)}</span>`
      h += `</p>`
    }
    if (e.subtitle) h += `<p style="margin:0;font-style:italic;color:#374151;font-size:10pt;">${esc(e.subtitle)}</p>`
    ;(e.lines || []).forEach((ln) => { h += `<p style="margin:0;color:#374151;font-size:10pt;">${esc(ln)}</p>` })
    if (e.links && e.links.length) {
      h += `<p style="margin:0;font-size:10pt;">${e.links.map((l) => `<a href="${esc(l.href)}" style="color:${c.primary};">${esc(l.label)}</a>`).join(' &nbsp;·&nbsp; ')}</p>`
    }
    if (e.bullets && e.bullets.length) {
      h += `<ul style="margin:2pt 0;padding-left:16pt;">`
      e.bullets.forEach((b) => { h += `<li style="font-size:10pt;">${esc(b)}</li>` })
      h += `</ul>`
    }
    return h
  }

  c.sections.forEach((sec) => {
    parts.push(headingHtml(sec.heading))
    sec.entries.forEach((e) => { parts.push(entryHtml(e)) })
  })
  if (c.declaration) {
    parts.push(headingHtml('Declaration'))
    parts.push(`<p style="font-style:italic;color:#374151;font-size:10pt;">${esc(c.declaration)}</p>`)
  }

  const html = `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${esc(c.name)}</title></head>`
    + `<body style="font-family:Calibri,Arial,sans-serif;color:#1f2937;font-size:11pt;line-height:1.35;">${parts.join('')}</body></html>`

  const blob = new Blob(['﻿', html], { type: 'application/msword' })
  saveAs(blob, filename)
  return true
}

/* ---------------- Plain text (.txt) ---------------- */

export function exportResumeText(store, filename) {
  const c = buildResumeContent(store)
  const lines = []
  const push = (s = '') => lines.push(s)

  push(c.name || '')
  if (c.title) push(c.title)
  if (c.researchInterests) push(c.researchInterests)
  if (c.contacts.length) push(c.contacts.join(' | '))
  push('')

  if (c.summary) {
    push('SUMMARY')
    push(c.summary)
    push('')
  }

  c.sections.forEach((sec) => {
    push(sec.heading.toUpperCase())
    sec.entries.forEach((e) => {
      const headline = [e.title, e.right].filter(Boolean).join('  ')
      if (headline) push(headline)
      if (e.subtitle) push(e.subtitle)
      ;(e.lines || []).forEach((l) => push(l))
      ;(e.bullets || []).forEach((b) => push('- ' + b))
      if (e.title || e.subtitle || (e.bullets && e.bullets.length)) push('')
    })
    push('')
  })

  if (c.declaration) {
    push('DECLARATION')
    push(c.declaration)
  }

  const text = lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n'
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  saveAs(blob, filename)
  return true
}
