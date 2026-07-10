<template>
  <div class="dev-resume" :style="templateStyles">
    <!-- Header: name, title, and a single links + contact row -->
    <header class="dev-header">
      <h1 class="dev-name">{{ resumeStore.fullName }}</h1>
      <div v-if="personalInfo.title" class="dev-title">{{ personalInfo.title }}</div>
      <div v-if="personalInfo.headerTagline" class="dev-tagline">{{ personalInfo.headerTagline }}</div>
      <div v-if="headerEntries.length" class="dev-contact">
        <template v-for="(e, i) in headerEntries" :key="i">
          <span v-if="i > 0" class="dev-sep">|</span>
          <a v-if="e.href" :href="e.href" class="dev-link" target="_blank" rel="noopener">{{ e.text }}</a>
          <span v-else>{{ e.text }}</span>
        </template>
      </div>
    </header>

    <!-- Summary -->
    <section v-if="enabled.summary && personalInfo.summary" class="dev-section print-avoid-break">
      <h2 class="dev-heading">Summary</h2>
      <p class="dev-summary">{{ personalInfo.summary }}</p>
    </section>

    <!-- Skills -->
    <section v-if="enabled.skills && skills.length" class="dev-section print-avoid-break">
      <h2 class="dev-heading">Skills</h2>
      <div class="dev-skills">
        <div v-for="(list, cat) in resumeStore.skillsByCategory" :key="cat" class="dev-skill-row">
          <span class="dev-skill-cat">{{ cat }}:</span> {{ list.map(s => s.name).join(', ') }}
        </div>
      </div>
    </section>

    <!-- Experience -->
    <section v-if="enabled.experience && experience.length" class="dev-section">
      <h2 class="dev-heading">Experience</h2>
      <div v-for="exp in resumeStore.sortedExperience" :key="exp.id" class="dev-entry print-avoid-break">
        <div class="dev-entry-row">
          <span class="dev-entry-head">
            <span class="dev-entry-title">{{ exp.title }}</span><span v-if="exp.company" class="dev-entry-org"> - {{ exp.company }}</span><span v-if="exp.location" class="dev-entry-loc"> ({{ exp.location }})</span>
          </span>
          <span class="dev-entry-date">{{ dateRange(exp.startDate, exp.endDate, exp.current) }}</span>
        </div>
        <p v-if="exp.description" class="dev-desc">{{ exp.description }}</p>
        <ul v-if="hasAchievements(exp)" class="dev-bullets">
          <li v-for="(a, i) in exp.achievements.filter(x => x && x.trim())" :key="i">
            <span class="dev-bullet">•</span><span>{{ a }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Projects -->
    <section v-if="enabled.projects && projects.length" class="dev-section">
      <h2 class="dev-heading">Projects</h2>
      <ul class="dev-proj-list">
        <li v-for="p in projects" :key="p.id" class="dev-proj print-avoid-break">
          <span class="dev-bullet">•</span>
          <span>
            <span class="dev-proj-name">{{ p.name }}:</span>
            <span v-if="p.description"> {{ p.description }}</span><span v-if="p.technologies && p.technologies.length" class="dev-proj-tech"> ({{ p.technologies.join(', ') }})</span>
          </span>
        </li>
      </ul>
    </section>

    <!-- Education -->
    <section v-if="enabled.education && education.length" class="dev-section print-avoid-break">
      <h2 class="dev-heading">Education</h2>
      <div v-for="edu in education" :key="edu.id" class="dev-entry">
        <div class="dev-entry-row">
          <span class="dev-entry-head">
            <span class="dev-entry-title">{{ edu.degree }}</span><span v-if="edu.institution" class="dev-entry-org"> - {{ edu.institution }}</span>
          </span>
          <span class="dev-entry-date">{{ dateRange(edu.startDate, edu.endDate) }}</span>
        </div>
        <div v-if="edu.location || edu.gpa" class="dev-entry-meta">
          <span v-if="edu.location">{{ edu.location }}</span><span v-if="edu.gpa">{{ edu.location ? ' · ' : '' }}CGPA: {{ edu.gpa }}</span>
        </div>
        <p v-if="edu.description" class="dev-desc">{{ edu.description }}</p>
      </div>
    </section>

    <!-- Certifications -->
    <section v-if="enabled.certifications && certifications.length" class="dev-section print-avoid-break">
      <h2 class="dev-heading">Certifications</h2>
      <div v-for="c in certifications" :key="c.id" class="dev-cert">
        <span class="dev-entry-title">{{ c.name }}</span><span v-if="c.issuer" class="dev-entry-org"> - {{ c.issuer }}</span>
        <span v-if="c.date" class="dev-entry-date">{{ formatDate(c.date) }}</span>
      </div>
    </section>

    <!-- Languages -->
    <section v-if="enabled.languages && languages.length" class="dev-section print-avoid-break">
      <h2 class="dev-heading">Languages</h2>
      <div class="dev-lang">
        <span v-for="(l, i) in languages" :key="l.id">
          <span v-if="i > 0" class="dev-sep">|</span>{{ l.name }}<span v-if="l.level"> ({{ l.level }})</span>
        </span>
      </div>
    </section>
  </div>
</template>

<script>
import { useResumeStore } from '../../stores/resume'
import { storeToRefs } from 'pinia'
import { format, parseISO } from 'date-fns'

/**
 * Compact, left-aligned single-column resume aimed at software engineers:
 * a combined links + contact row in the header, skills grouped by category on
 * one line each, and projects as "Name: description" bullets. Uses border-bottom
 * headings and inline bullets so it captures cleanly to PDF (see project notes).
 */
export default {
  name: 'DeveloperResumeTemplate',
  setup() {
    const resumeStore = useResumeStore()
    const { personalInfo, skills, experience, education, projects, certifications, languages, settings } =
      storeToRefs(resumeStore)
    return { resumeStore, personalInfo, skills, experience, education, projects, certifications, languages, settings }
  },
  computed: {
    templateStyles() {
      const c = this.settings.colorScheme
      return {
        '--primary': c.primary,
        '--text': c.text,
        '--background': c.background,
        fontSize: `${this.settings.fontSize}px`,
        fontFamily: this.settings.font
      }
    },
    enabled() {
      return this.settings.sectionsEnabled
    },
    headerEntries() {
      const p = this.personalInfo
      const out = []
      if (p.github) out.push({ text: 'Github', href: this.formatUrl(p.github) })
      if (p.linkedin) out.push({ text: 'Linkedin', href: this.formatUrl(p.linkedin) })
      if (p.website) out.push({ text: 'Portfolio', href: this.formatUrl(p.website) })
      for (const l of this.resumeStore.customLinks || []) {
        if (l && l.label && l.url) out.push({ text: l.label, href: this.formatUrl(l.url) })
      }
      if (p.email) out.push({ text: p.email, href: `mailto:${p.email}` })
      if (p.phone) out.push({ text: p.phone, href: null })
      if (p.address) out.push({ text: p.address, href: null })
      return out
    }
  },
  methods: {
    hasAchievements(exp) {
      return exp.achievements && exp.achievements.some(a => a && a.trim())
    },
    formatUrl(url) {
      if (!url) return ''
      if (/^https?:\/\//i.test(url) || url.startsWith('mailto:')) return url
      return `https://${url}`
    },
    formatDate(v) {
      if (!v) return ''
      try {
        return format(parseISO(v + '-01'), 'MMM yyyy')
      } catch {
        return v
      }
    },
    dateRange(start, end, current = false) {
      const s = this.formatDate(start)
      const e = current ? 'Present' : this.formatDate(end)
      if (s && e) return `${s} - ${e}`
      return s || e || ''
    }
  }
}
</script>

<style scoped>
.dev-resume {
  --primary: #2563eb;
  --text: #1f2937;
  --background: #ffffff;

  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 40px 46px;
  background: var(--background);
  color: var(--text);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  line-height: 1.4;
}

/* Header */
.dev-header {
  padding-bottom: 10px;
  border-bottom: 1.5px solid var(--text);
  margin-bottom: 16px;
}

.dev-name {
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: 0.3px;
}

.dev-title {
  font-size: 1.02rem;
  color: var(--primary);
  font-weight: 600;
  margin-top: 2px;
}

.dev-tagline {
  font-size: 0.92em;
  color: #4b5563;
  margin-top: 3px;
}

.dev-contact {
  margin-top: 7px;
  font-size: 0.9em;
  color: #374151;
  line-height: 1.6;
}

.dev-link {
  color: var(--primary);
  text-decoration: none;
}

.dev-link:hover {
  text-decoration: underline;
}

.dev-sep {
  margin: 0 7px;
  color: #9ca3af;
}

/* Sections */
.dev-section {
  margin-bottom: 15px;
}

.dev-heading {
  font-size: 0.95em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text);
  border-bottom: 1px solid #d1d5db;
  padding-bottom: 3px;
  margin-bottom: 8px;
}

.dev-summary {
  line-height: 1.5;
}

/* Skills */
.dev-skills {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.dev-skill-cat {
  font-weight: 700;
}

/* Entries (experience, education) */
.dev-entry {
  margin-bottom: 11px;
}

.dev-entry:last-child {
  margin-bottom: 0;
}

.dev-entry-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.dev-entry-title {
  font-weight: 700;
}

.dev-entry-org {
  font-weight: 600;
  color: var(--primary);
}

.dev-entry-loc {
  color: #6b7280;
  font-weight: 400;
}

.dev-entry-date {
  color: #6b7280;
  font-size: 0.9em;
  white-space: nowrap;
  flex-shrink: 0;
}

.dev-entry-meta {
  font-size: 0.9em;
  color: #6b7280;
  margin-top: 1px;
}

.dev-desc {
  margin-top: 3px;
}

.dev-bullets {
  list-style: none;
  margin-top: 4px;
  padding-left: 2px;
}

.dev-bullets li {
  display: flex;
  gap: 8px;
  margin-bottom: 2px;
  line-height: 1.4;
}

.dev-bullet {
  color: var(--primary);
  flex-shrink: 0;
}

/* Projects */
.dev-proj-list {
  list-style: none;
  padding-left: 2px;
}

.dev-proj {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
  line-height: 1.45;
}

.dev-proj-name {
  font-weight: 700;
}

.dev-proj-tech {
  color: #4b5563;
  font-size: 0.92em;
}

/* Certifications */
.dev-cert {
  display: flex;
  gap: 8px;
  align-items: baseline;
  margin-bottom: 3px;
}

.dev-cert .dev-entry-date {
  margin-left: auto;
}

/* html2canvas draws text lower than the browser; nudge ruled headings up during export */
.pdf-export .dev-heading {
  padding-bottom: 6px;
}

@media print {
  .dev-resume {
    box-shadow: none;
    max-width: none;
    margin: 0;
  }
  .print-avoid-break {
    page-break-inside: avoid;
  }
}

@media (max-width: 768px) {
  .dev-resume {
    max-width: 100%;
    padding: 22px 18px;
    box-shadow: none;
  }
  .dev-name {
    font-size: 1.55rem;
  }
}
</style>
