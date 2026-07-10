/**
 * Client-side ATS keyword match. Extracts likely keywords from a pasted job
 * description and checks which appear in the resume, producing a rough match
 * score plus matched/missing lists. This is a keyword heuristic, not a
 * guarantee of how any specific ATS scores a resume - the UI says so.
 *
 * Everything runs in the browser; nothing is uploaded.
 */

// English stopwords + common job-description filler that is not a useful keyword.
const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'else', 'for', 'nor', 'so', 'yet',
  'of', 'to', 'in', 'on', 'at', 'by', 'from', 'with', 'about', 'as', 'into', 'like',
  'through', 'after', 'over', 'between', 'out', 'against', 'during', 'without', 'before',
  'under', 'around', 'among', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'am',
  'have', 'has', 'had', 'do', 'does', 'did', 'doing', 'will', 'would', 'shall', 'should',
  'can', 'could', 'may', 'might', 'must', 'this', 'that', 'these', 'those', 'i', 'you',
  'he', 'she', 'it', 'we', 'they', 'them', 'us', 'our', 'your', 'their', 'his', 'her',
  'its', 'my', 'me', 'who', 'whom', 'which', 'what', 'when', 'where', 'why', 'how', 'all',
  'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'not',
  'only', 'own', 'same', 'than', 'too', 'very', 's', 't', 'just', 'also', 'up', 'down',
  'off', 'per', 'etc', 'via', 'e', 'g', 'ie',
  // Generic JD filler
  'work', 'working', 'experience', 'experiences', 'years', 'year', 'role', 'roles', 'job',
  'jobs', 'company', 'team', 'teams', 'ability', 'able', 'strong', 'good', 'great',
  'excellent', 'plus', 'including', 'include', 'includes', 'required', 'requirement',
  'requirements', 'responsibilities', 'responsibility', 'candidate', 'candidates', 'looking',
  'join', 'help', 'ensure', 'across', 'within', 'well', 'new', 'high', 'best', 'using', 'use'
])

function normalize(text) {
  return (text || '').toLowerCase()
}

// Tokenize into words, keeping tech-ish characters (+ # . -) inside tokens
// so terms like c++, c#, .net and node.js survive.
function tokenize(text) {
  return normalize(text).match(/[a-z0-9][a-z0-9+#.\-]*[a-z0-9+#]|[a-z0-9]/g) || []
}

function isStop(w) {
  return !w || w.length < 2 || STOPWORDS.has(w) || /^\d+$/.test(w)
}

/** Flatten the resume content (no settings/colors) into a single text blob. */
export function resumeToText(store) {
  let data
  try {
    data = JSON.parse(store.exportData())
  } catch {
    return ''
  }
  if (data && typeof data === 'object') delete data.settings
  const parts = []
  const walk = (v) => {
    if (v == null) return
    if (typeof v === 'string') parts.push(v)
    else if (Array.isArray(v)) v.forEach(walk)
    else if (typeof v === 'object') Object.values(v).forEach(walk)
  }
  walk(data)
  return parts.join(' ')
}

/**
 * Extract candidate keywords (unigrams + bigrams) from the job description,
 * ranked by frequency. Unigrams already covered by a chosen bigram are dropped.
 */
export function extractKeywords(jd, limit = 24) {
  const toks = tokenize(jd)
  const freq = new Map()
  const bump = (t) => freq.set(t, (freq.get(t) || 0) + 1)
  for (let i = 0; i < toks.length; i++) {
    const w = toks[i]
    if (!isStop(w)) bump(w)
    const next = toks[i + 1]
    if (next && !isStop(w) && !isStop(next)) bump(`${w} ${next}`)
  }
  const ranked = [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .map(([t]) => t)

  // Keep a larger pool, drop unigrams contained in a chosen bigram, then cap.
  const pool = ranked.slice(0, limit * 2)
  const bigrams = pool.filter((t) => t.includes(' '))
  const bigramWords = new Set(bigrams.flatMap((b) => b.split(' ')))
  const deduped = pool.filter((t) => t.includes(' ') || !bigramWords.has(t))
  return deduped.slice(0, limit)
}

/**
 * Compare resume text against a job description.
 * @returns {{ score: number, matched: string[], missing: string[], total: number }}
 */
export function analyze(resumeText, jd) {
  const keywords = extractKeywords(jd)
  const rt = normalize(resumeText)
  const rtTokens = new Set(tokenize(resumeText))
  const matched = []
  const missing = []
  for (const kw of keywords) {
    const hit = kw.includes(' ') ? rt.includes(kw) : rtTokens.has(kw) || rt.includes(kw)
    if (hit) matched.push(kw)
    else missing.push(kw)
  }
  const total = keywords.length
  const score = total ? Math.round((matched.length / total) * 100) : 0
  return { score, matched, missing, total }
}
