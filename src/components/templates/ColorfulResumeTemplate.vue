<template>
  <div class="cm-resume" :style="templateStyles">
    <!-- Colored header band -->
    <header class="cm-header">
      <div class="cm-head-text">
        <h1 class="cm-name">{{ resumeStore.fullName }}</h1>
        <div v-if="personalInfo.title" class="cm-title">{{ personalInfo.title }}</div>
        <div v-if="personalInfo.headerTagline" class="cm-tagline">{{ personalInfo.headerTagline }}</div>
        <div class="cm-contact">
          <span v-for="(item, i) in contactItems" :key="i">
            <span v-if="i > 0" class="cm-sep">·</span><LinkIcon v-if="settings.showLinkIcons" :name="item.icon" class="cm-entry-icon" />{{ item.text }}
          </span>
          <template v-for="(link, i) in customLinkEntries" :key="'cl' + i">
            <span v-if="contactItems.length || i > 0" class="cm-sep">·</span><LinkIcon v-if="settings.showLinkIcons" :name="link.icon" class="cm-entry-icon" /><a :href="link.href" target="_blank" rel="noopener" class="cm-clink">{{ link.label }}</a>
          </template>
        </div>
      </div>
      <div v-if="settings.showProfileImage && personalInfo.profileImage"
           class="cm-photo"
           :style="{ backgroundImage: `url('${personalInfo.profileImage}')` }"></div>
    </header>

    <div class="cm-body">
      <!-- Summary -->
      <section v-if="enabled.summary && personalInfo.summary" class="cm-section print-avoid-break" :style="{ order: ord('summary') }">
        <h2 class="cm-heading">Profile</h2>
        <p class="cm-summary">{{ personalInfo.summary }}</p>
      </section>

      <!-- Experience -->
      <section v-if="enabled.experience && experience.length" class="cm-section" :style="{ order: ord('experience') }">
        <h2 class="cm-heading">Experience</h2>
        <div v-for="exp in resumeStore.sortedExperience" :key="exp.id" class="cm-entry print-avoid-break">
          <div class="cm-entry-row">
            <span class="cm-entry-title">{{ exp.title }}</span>
            <span class="cm-entry-date">{{ dateRange(exp.startDate, exp.endDate, exp.current) }}</span>
          </div>
          <div class="cm-entry-org">{{ exp.company }}<span v-if="exp.location" class="cm-muted"> · {{ exp.location }}</span></div>
          <p v-if="exp.description" class="cm-desc">{{ exp.description }}</p>
          <ul v-if="hasAchievements(exp)" class="cm-bullets">
            <li v-for="(a, i) in exp.achievements.filter(x => x && x.trim())" :key="i">
              <span class="cm-bullet">•</span><span>{{ a }}</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- Projects -->
      <section v-if="enabled.projects && projects.length" class="cm-section" :style="{ order: ord('projects') }">
        <h2 class="cm-heading">Projects</h2>
        <div v-for="p in projects" :key="p.id" class="cm-entry print-avoid-break">
          <div class="cm-entry-row">
            <span class="cm-entry-title">{{ p.name }}</span>
            <span class="cm-entry-date">{{ dateRange(p.startDate, p.endDate) }}</span>
          </div>
          <p v-if="p.description" class="cm-desc">{{ p.description }}</p>
          <div v-if="p.technologies && p.technologies.length" class="cm-chips">
            <span v-for="t in p.technologies" :key="t" class="cm-chip">{{ t }}</span>
          </div>
          <div v-if="p.url" class="cm-link">{{ p.url }}</div>
        </div>
      </section>

      <!-- Skills with bars -->
      <section v-if="enabled.skills && skills.length" class="cm-section print-avoid-break" :style="{ order: ord('skills') }">
        <h2 class="cm-heading">Skills</h2>
        <div class="cm-skill-cols">
          <div v-for="s in skills" :key="s.id" class="cm-skill">
            <div class="cm-skill-head">
              <span>{{ s.name }}</span>
              <span class="cm-muted">{{ s.category }}</span>
            </div>
            <div class="cm-bar-track">
              <div class="cm-bar-fill" :style="{ width: (s.level || 0) + '%' }"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Education -->
      <section v-if="enabled.education && education.length" class="cm-section print-avoid-break" :style="{ order: ord('education') }">
        <h2 class="cm-heading">Education</h2>
        <div v-for="edu in education" :key="edu.id" class="cm-entry">
          <div class="cm-entry-row">
            <span class="cm-entry-title">{{ edu.degree }}</span>
            <span class="cm-entry-date">{{ dateRange(edu.startDate, edu.endDate) }}</span>
          </div>
          <div class="cm-entry-org">{{ edu.institution }}<span v-if="edu.location" class="cm-muted"> · {{ edu.location }}</span><span v-if="edu.gpa" class="cm-muted"> · GPA {{ edu.gpa }}</span></div>
          <p v-if="edu.description" class="cm-desc">{{ edu.description }}</p>
        </div>
      </section>

      <!-- Certifications + Languages in two columns -->
      <div class="cm-two-col" :style="{ order: ord('certifications') }">
        <section v-if="enabled.certifications && certifications.length" class="cm-section print-avoid-break" :style="{ order: ord('certifications') }">
          <h2 class="cm-heading">Certifications</h2>
          <div v-for="c in certifications" :key="c.id" class="cm-mini">
            <div class="cm-mini-name">{{ c.name }}</div>
            <div class="cm-muted">{{ c.issuer }}<span v-if="c.date"> · {{ formatDate(c.date) }}</span></div>
          </div>
        </section>

        <section v-if="enabled.languages && languages.length" class="cm-section print-avoid-break" :style="{ order: ord('languages') }">
          <h2 class="cm-heading">Languages</h2>
          <div v-for="l in languages" :key="l.id" class="cm-lang-row">
            <span>{{ l.name }}</span><span class="cm-muted">{{ l.level }}</span>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { useResumeStore } from '../../stores/resume'
import { storeToRefs } from 'pinia'
import { format, parseISO } from 'date-fns'
import LinkIcon from '../LinkIcon.vue'
import { iconKeyFor } from '../../utils/linkIcons'

export default {
  name: 'ColorfulResumeTemplate',
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
        '--secondary': c.secondary,
        '--accent': c.accent,
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
      if (p.linkedin) out.push({ text: p.linkedin, icon: 'linkedin' })
      if (p.github) out.push({ text: p.github, icon: 'github' })
      if (p.website) out.push({ text: p.website, icon: 'website' })
      return out
    },
    customLinkEntries() {
      return (this.resumeStore.customLinks || [])
        .filter(l => l && l.label && l.url)
        .map(l => ({ label: l.label, href: this.formatUrl(l.url), icon: iconKeyFor(l.label, l.url) }))
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
    formatUrl(url) {
      if (!url) return ''
      return /^https?:\/\//i.test(url) || url.startsWith('mailto:') ? url : `https://${url}`
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
.cm-resume {
  --primary: #2563eb;
  --secondary: #14b8a6;
  --accent: #f59e0b;
  --text: #1f2937;
  --background: #ffffff;

  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  background: var(--background);
  color: var(--text);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  line-height: 1.4;
}

/* Header band */
.cm-header {
  background: var(--primary);
  color: #ffffff;
  padding: 30px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.cm-name {
  font-size: 2.1rem;
  font-weight: 800;
  line-height: 1.1;
}

.cm-title {
  font-size: 1.1rem;
  font-weight: 500;
  opacity: 0.92;
  margin-top: 2px;
}

.cm-tagline {
  font-size: 0.9em;
  opacity: 0.9;
  margin-top: 3px;
}

.cm-clink {
  color: #ffffff;
  text-decoration: underline;
}

.cm-entry-icon {
  margin-right: 0.3em;
}

.cm-contact {
  margin-top: 10px;
  font-size: 0.88em;
  opacity: 0.92;
}

.cm-sep {
  margin: 0 7px;
  opacity: 0.6;
}

.cm-photo {
  width: 104px;
  height: 104px;
  flex-shrink: 0;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  border: 3px solid rgba(255, 255, 255, 0.85);
}

/* Body */
.cm-body {
  padding: 26px 40px 40px;
  /* Sections are ordered via CSS `order` from settings.sectionsOrder. */
  display: flex;
  flex-direction: column;
}

.cm-section {
  margin-bottom: 18px;
}

.cm-heading {
  font-size: 1em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--primary);
  border-bottom: 2px solid var(--accent);
  padding-bottom: 4px;
  margin-bottom: 10px;
}

.cm-summary {
  line-height: 1.55;
}

.cm-entry {
  margin-bottom: 12px;
}

.cm-entry-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.cm-entry-title {
  font-weight: 700;
}

.cm-entry-date {
  color: #6b7280;
  font-size: 0.88em;
  white-space: nowrap;
  flex-shrink: 0;
}

.cm-entry-org {
  color: var(--primary);
  font-weight: 600;
  font-size: 0.95em;
}

.cm-muted {
  color: #6b7280;
  font-weight: 400;
}

.cm-desc {
  margin-top: 3px;
}

.cm-bullets {
  list-style: none;
  margin-top: 4px;
}

.cm-bullets li {
  display: flex;
  gap: 8px;
  margin-bottom: 2px;
  line-height: 1.4;
}

.cm-bullet {
  color: var(--accent);
  flex-shrink: 0;
}

.cm-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.cm-chip {
  font-size: 0.8em;
  padding: 2px 9px;
  border: 1px solid var(--primary);
  color: var(--primary);
  border-radius: 11px;
}

.cm-link {
  font-size: 0.85em;
  color: var(--primary);
  margin-top: 2px;
  overflow-wrap: anywhere;
}

.cm-contact {
  overflow-wrap: anywhere;
}

.cm-skill-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 24px;
}

.cm-skill-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 0.9em;
  margin-bottom: 3px;
}

.cm-bar-track {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.cm-bar-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 3px;
}

.cm-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.cm-mini {
  margin-bottom: 8px;
  font-size: 0.92em;
}

.cm-mini-name {
  font-weight: 600;
}

.cm-lang-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3px;
  font-size: 0.92em;
}

.pdf-export .cm-heading {
  padding-bottom: 7px;
}

@media print {
  .cm-resume {
    box-shadow: none;
    max-width: none;
    margin: 0;
  }
  .print-avoid-break {
    page-break-inside: avoid;
  }
}

@media (max-width: 768px) {
  .cm-resume {
    max-width: 100%;
    box-shadow: none;
  }
  .cm-header {
    flex-direction: column;
    text-align: center;
    padding: 24px 18px;
  }
  .cm-body {
    padding: 20px 18px 28px;
  }
  .cm-name {
    font-size: 1.7rem;
  }
  .cm-skill-cols,
  .cm-two-col {
    grid-template-columns: 1fr;
  }
}
</style>
