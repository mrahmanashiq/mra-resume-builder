<template>
  <div class="ats-resume" :style="templateStyles">
    <!-- Header -->
    <header class="ats-header">
      <h1 class="ats-name">{{ resumeStore.fullName }}</h1>
      <div v-if="personalInfo.title" class="ats-title">{{ personalInfo.title }}</div>
      <div v-if="personalInfo.headerTagline" class="ats-tagline">{{ personalInfo.headerTagline }}</div>
      <div class="ats-contact">
        <span v-for="(item, i) in contactItems" :key="'c' + i">
          <span v-if="i > 0" class="ats-sep">|</span><LinkIcon v-if="settings.showLinkIcons" :name="item.icon" class="ats-entry-icon" />{{ item.text }}
        </span>
      </div>
      <div v-if="links.length" class="ats-contact ats-links">
        <span v-for="(link, i) in links" :key="'l' + i">
          <span v-if="i > 0" class="ats-sep">|</span><LinkIcon v-if="settings.showLinkIcons" :name="link.icon" class="ats-entry-icon" />{{ link.label }}: {{ link.value }}
        </span>
      </div>
    </header>

    <!-- Summary -->
    <section v-if="enabled.summary && personalInfo.summary" class="ats-section print-avoid-break" :style="{ order: ord('summary') }">
      <h2 class="ats-heading">Summary</h2>
      <p class="ats-summary">{{ personalInfo.summary }}</p>
    </section>

    <!-- Experience -->
    <section v-if="enabled.experience && experience.length" class="ats-section" :style="{ order: ord('experience') }">
      <h2 class="ats-heading">Experience</h2>
      <div v-for="exp in resumeStore.sortedExperience" :key="exp.id" class="ats-entry print-avoid-break">
        <div class="ats-entry-row">
          <span class="ats-entry-title">{{ exp.title }}</span>
          <span class="ats-entry-date">{{ dateRange(exp.startDate, exp.endDate, exp.current) }}</span>
        </div>
        <div class="ats-entry-sub">
          <span class="ats-entry-org">{{ exp.company }}</span><span v-if="exp.location"> · {{ exp.location }}</span>
        </div>
        <p v-if="exp.description" class="ats-desc">{{ exp.description }}</p>
        <ul v-if="hasAchievements(exp)" class="ats-bullets">
          <li v-for="(a, i) in exp.achievements.filter(x => x && x.trim())" :key="i">
            <span class="ats-bullet">•</span><span>{{ a }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Projects -->
    <section v-if="enabled.projects && projects.length" class="ats-section" :style="{ order: ord('projects') }">
      <h2 class="ats-heading">Projects</h2>
      <div v-for="p in projects" :key="p.id" class="ats-entry print-avoid-break">
        <div class="ats-entry-row">
          <span class="ats-entry-title">{{ p.name }}</span>
          <span class="ats-entry-date">{{ dateRange(p.startDate, p.endDate) }}</span>
        </div>
        <p v-if="p.description" class="ats-desc">{{ p.description }}</p>
        <div v-if="p.technologies && p.technologies.length" class="ats-tech">
          {{ p.technologies.join(', ') }}
        </div>
        <div v-if="p.url" class="ats-link-line">{{ p.url }}</div>
      </div>
    </section>

    <!-- Education -->
    <section v-if="enabled.education && education.length" class="ats-section print-avoid-break" :style="{ order: ord('education') }">
      <h2 class="ats-heading">Education</h2>
      <div v-for="edu in education" :key="edu.id" class="ats-entry">
        <div class="ats-entry-row">
          <span class="ats-entry-title">{{ edu.degree }}</span>
          <span class="ats-entry-date">{{ dateRange(edu.startDate, edu.endDate) }}</span>
        </div>
        <div class="ats-entry-sub">
          <span class="ats-entry-org">{{ edu.institution }}</span><span v-if="edu.location"> · {{ edu.location }}</span><span v-if="edu.gpa"> · GPA: {{ edu.gpa }}</span>
        </div>
        <p v-if="edu.description" class="ats-desc">{{ edu.description }}</p>
      </div>
    </section>

    <!-- Skills -->
    <section v-if="enabled.skills && skills.length" class="ats-section print-avoid-break" :style="{ order: ord('skills') }">
      <h2 class="ats-heading">Skills</h2>
      <div class="ats-skill-grid">
        <template v-for="(list, cat) in resumeStore.skillsByCategory" :key="cat">
          <div class="ats-skill-cat">{{ cat }}</div>
          <div class="ats-skill-list">{{ list.map(s => s.name).join(', ') }}</div>
        </template>
      </div>
    </section>

    <!-- Certifications -->
    <section v-if="enabled.certifications && certifications.length" class="ats-section print-avoid-break" :style="{ order: ord('certifications') }">
      <h2 class="ats-heading">Certifications</h2>
      <div v-for="c in certifications" :key="c.id" class="ats-cert">
        <span class="ats-entry-title">{{ c.name }}</span><span v-if="c.issuer"> - {{ c.issuer }}</span>
        <span v-if="c.date" class="ats-entry-date">{{ formatDate(c.date) }}</span>
      </div>
    </section>

    <!-- Languages -->
    <section v-if="enabled.languages && languages.length" class="ats-section print-avoid-break" :style="{ order: ord('languages') }">
      <h2 class="ats-heading">Languages</h2>
      <div class="ats-lang">
        <span v-for="(l, i) in languages" :key="l.id">
          <span v-if="i > 0" class="ats-sep">|</span>{{ l.name }}<span v-if="l.level"> ({{ l.level }})</span>
        </span>
      </div>
    </section>
  </div>
</template>

<script>
import { useResumeStore } from '../../stores/resume'
import { storeToRefs } from 'pinia'
import { format, parseISO } from 'date-fns'
import LinkIcon from '../LinkIcon.vue'
import { iconKeyFor } from '../../utils/linkIcons'

export default {
  name: 'AtsResumeTemplate',
  components: { LinkIcon },
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
    contactItems() {
      const p = this.personalInfo
      const out = []
      if (p.email) out.push({ text: p.email, icon: 'email' })
      if (p.phone) out.push({ text: p.phone, icon: 'phone' })
      if (p.address) out.push({ text: p.address, icon: 'location' })
      return out
    },
    links() {
      const p = this.personalInfo
      const out = []
      if (p.linkedin) out.push({ label: 'LinkedIn', value: p.linkedin, icon: 'linkedin' })
      if (p.github) out.push({ label: 'GitHub', value: p.github, icon: 'github' })
      if (p.website) out.push({ label: 'Portfolio', value: p.website, icon: 'website' })
      for (const l of this.resumeStore.customLinks || []) {
        if (l && l.label && l.url) out.push({ label: l.label, value: l.url, icon: iconKeyFor(l.label, l.url) })
      }
      return out
    }
  },
  methods: {
    ord(key) {
      const i = this.settings.sectionsOrder.indexOf(key)
      return i === -1 ? 99 : i
    },
    hasAchievements(exp) {
      return exp.achievements && exp.achievements.some(a => a && a.trim())
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
.ats-resume {
  --primary: #1f2937;
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
  /* Sections are ordered via CSS `order` from settings.sectionsOrder. */
  display: flex;
  flex-direction: column;
}

/* Header */
.ats-header {
  order: -1;
  text-align: center;
  padding-bottom: 12px;
  border-bottom: 1.5px solid var(--text);
  margin-bottom: 18px;
}

.ats-name {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.ats-title {
  font-size: 1.05rem;
  color: var(--primary);
  font-weight: 600;
  margin-top: 2px;
}

.ats-tagline {
  font-size: 0.9em;
  color: #4b5563;
  margin-top: 3px;
}

.ats-contact {
  margin-top: 8px;
  font-size: 0.9em;
  color: #374151;
}

.ats-links {
  margin-top: 3px;
  color: var(--primary);
}

.ats-entry-icon {
  margin-right: 0.3em;
}

.ats-sep {
  margin: 0 8px;
  color: #9ca3af;
}

/* Sections */
.ats-section {
  margin-bottom: 16px;
}

.ats-heading {
  font-size: 0.98em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--primary);
  border-bottom: 1px solid #d1d5db;
  padding-bottom: 3px;
  margin-bottom: 9px;
}

.ats-summary {
  line-height: 1.5;
}

.ats-entry {
  margin-bottom: 11px;
}

.ats-entry:last-child {
  margin-bottom: 0;
}

.ats-entry-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.ats-entry-title {
  font-weight: 700;
}

.ats-entry-date {
  color: #6b7280;
  font-size: 0.9em;
  white-space: nowrap;
  flex-shrink: 0;
}

.ats-entry-sub {
  font-style: italic;
  color: #374151;
  margin-top: 1px;
}

.ats-entry-org {
  color: var(--primary);
  font-style: normal;
  font-weight: 600;
}

.ats-desc {
  margin-top: 3px;
}

.ats-bullets {
  list-style: none;
  margin-top: 4px;
  padding-left: 2px;
}

.ats-bullets li {
  display: flex;
  gap: 8px;
  margin-bottom: 2px;
  line-height: 1.4;
}

.ats-bullet {
  color: var(--primary);
  flex-shrink: 0;
}

.ats-tech {
  font-size: 0.9em;
  color: #4b5563;
  margin-top: 2px;
}

.ats-link-line {
  font-size: 0.85em;
  color: var(--primary);
  margin-top: 1px;
}

.ats-skill-grid {
  display: grid;
  grid-template-columns: max-content 1fr;
  row-gap: 5px;
  column-gap: 14px;
}

.ats-skill-cat {
  font-weight: 700;
}

.ats-cert {
  display: flex;
  gap: 8px;
  align-items: baseline;
  margin-bottom: 3px;
}

.ats-cert .ats-entry-date {
  margin-left: auto;
}

/* html2canvas draws text lower than the browser; nudge ruled headings up during export */
.pdf-export .ats-heading {
  padding-bottom: 6px;
}

@media print {
  .ats-resume {
    box-shadow: none;
    max-width: none;
    margin: 0;
  }
  .print-avoid-break {
    page-break-inside: avoid;
  }
}

@media (max-width: 768px) {
  .ats-resume {
    max-width: 100%;
    padding: 22px 18px;
    box-shadow: none;
  }
  .ats-name {
    font-size: 1.6rem;
  }
  .ats-skill-grid {
    grid-template-columns: 1fr;
    row-gap: 2px;
  }
  .ats-skill-cat {
    margin-top: 6px;
  }
}
</style>
