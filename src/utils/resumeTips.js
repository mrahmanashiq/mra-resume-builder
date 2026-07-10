import { resumeToText } from './atsMatch'

/**
 * Always-on resume quality check (client-side heuristics). Unlike the ATS
 * checker, this needs no job description - it flags common resume weaknesses so
 * the user can improve before applying. Every check is a plain, honest heuristic.
 */
export function analyzeResume(store) {
  const p = store.personalInfo || {}
  const exp = Array.isArray(store.experience) ? store.experience : []
  const edu = Array.isArray(store.education) ? store.education : []
  const skills = store.skillsByCategory
    ? Object.values(store.skillsByCategory).flat().filter(Boolean)
    : (Array.isArray(store.skills) ? store.skills : [])
  const summary = (p.summary || '').trim()

  const bullets = exp.flatMap((e) => (e.achievements || []).map((a) => (a || '').trim()).filter(Boolean))
  const quantified = bullets.filter((b) => /\d/.test(b)).length
  const words = resumeToText(store).split(/\s+/).filter(Boolean).length

  const checks = [
    {
      id: 'summary',
      label: 'Professional summary',
      ok: summary.length >= 30,
      hint: 'Add a 2-3 line summary highlighting your focus and strongest skills.'
    },
    {
      id: 'email',
      label: 'Contact email',
      ok: !!(p.email && p.email.trim()),
      hint: 'Add an email address so employers can reach you.'
    },
    {
      id: 'phone',
      label: 'Phone number',
      ok: !!(p.phone && p.phone.trim()),
      hint: 'Add a phone number to your contact details.'
    },
    {
      id: 'experience',
      label: 'Work experience',
      ok: exp.length >= 1,
      hint: 'Add at least one work experience entry.'
    },
    {
      id: 'bullets',
      label: 'Experience described with bullets',
      ok: bullets.length >= 2,
      hint: 'Add bullet points describing what you did and achieved in each role.'
    },
    {
      id: 'quantified',
      label: 'Quantified achievements',
      ok: bullets.length ? quantified >= Math.max(1, Math.ceil(bullets.length * 0.3)) : false,
      hint: 'Back up bullets with numbers (%, users, revenue, time saved) where you can.'
    },
    {
      id: 'skills',
      label: 'Skills listed',
      ok: skills.length >= 3,
      hint: 'List at least a few relevant skills.'
    },
    {
      id: 'education',
      label: 'Education',
      ok: edu.length >= 1,
      hint: 'Add your education background.'
    },
    {
      id: 'length',
      label: 'Reasonable length',
      ok: words >= 150 && words <= 900,
      hint: words < 150
        ? 'Your resume looks thin - add more detail to your experience and skills.'
        : 'Your resume is quite long - aim for one to two pages.'
    }
  ]

  const passed = checks.filter((c) => c.ok).length
  const score = Math.round((passed / checks.length) * 100)
  return { score, passed, total: checks.length, checks }
}
