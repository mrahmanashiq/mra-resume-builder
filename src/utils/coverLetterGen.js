/**
 * Compose a cover-letter draft from the resume store, fully client-side.
 * This is a starting draft built from real resume data (title, latest role,
 * top skills, a recent achievement) - the user is expected to personalize it.
 */
function lowerFirst(s) {
  return s ? s.charAt(0).toLowerCase() + s.slice(1) : s
}

function collectSkills(resume) {
  let skills = []
  if (resume.skillsByCategory && typeof resume.skillsByCategory === 'object') {
    skills = Object.values(resume.skillsByCategory).flat()
  } else if (Array.isArray(resume.skills)) {
    skills = resume.skills.map((s) => (typeof s === 'string' ? s : s && (s.name || s.skill) ? (s.name || s.skill) : ''))
  }
  return skills.map((s) => (s || '').toString().trim()).filter(Boolean)
}

export function generateCoverLetter(resume, targetCompany = '') {
  const p = resume.personalInfo || {}
  const title = (p.title || '').trim()
  const summary = (p.summary || '').trim()
  const company = (targetCompany || '').trim() || '[company]'

  const exp = Array.isArray(resume.experience) ? resume.experience : []
  const latest = exp.find((e) => e && e.current) || exp[0] || null
  const skills = collectSkills(resume).slice(0, 5)
  const skillList = skills.join(', ')

  const paras = []

  // Opening
  let opening = title
    ? `I am a ${title} writing to express my interest in a role at ${company}.`
    : `I am writing to express my interest in a role at ${company}.`
  if (summary) opening += ` ${summary}`
  paras.push(opening)

  // Most recent experience
  if (latest && (latest.company || latest.position || latest.title)) {
    const role = (latest.position || latest.title || '').trim()
    const where = (latest.company || '').trim()
    let sentence = role && where
      ? `In my role as ${role} at ${where}, `
      : where
        ? `At ${where}, `
        : `In my recent work, `
    const achievement = (latest.achievements || []).map((a) => (a || '').trim()).find(Boolean)
    sentence += achievement
      ? `I ${lowerFirst(achievement)}${/[.!?]$/.test(achievement) ? '' : '.'}`
      : `I delivered results on projects that mattered to the team.`
    paras.push(sentence)
  }

  // Skills
  if (skillList) {
    paras.push(`My core skills include ${skillList}, which I believe align well with what ${company} is looking for.`)
  }

  // Interest + close
  paras.push(`I am excited about the opportunity to contribute to ${company} and would welcome the chance to discuss how my background fits the role.`)
  paras.push('Thank you for your time and consideration.')

  return paras.join('\n\n')
}
