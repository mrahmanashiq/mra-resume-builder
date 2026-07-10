<template>
  <div class="sb-resume" :style="templateStyles">
    <!-- Left sidebar -->
    <aside class="sb-side">
      <div v-if="settings.showProfileImage && personalInfo.profileImage"
           class="sb-photo"
           :style="{ backgroundImage: `url('${personalInfo.profileImage}')` }"></div>

      <h1 class="sb-name">{{ resumeStore.fullName }}</h1>
      <div v-if="personalInfo.title" class="sb-role">{{ personalInfo.title }}</div>
      <div v-if="personalInfo.headerTagline" class="sb-tagline">{{ personalInfo.headerTagline }}</div>

      <div class="sb-block">
        <h2 class="sb-heading">Contact</h2>
        <div v-if="personalInfo.email" class="sb-line">{{ personalInfo.email }}</div>
        <div v-if="personalInfo.phone" class="sb-line">{{ personalInfo.phone }}</div>
        <div v-if="personalInfo.address" class="sb-line">{{ personalInfo.address }}</div>
        <div v-if="personalInfo.linkedin" class="sb-line">{{ personalInfo.linkedin }}</div>
        <div v-if="personalInfo.github" class="sb-line">{{ personalInfo.github }}</div>
        <div v-if="personalInfo.website" class="sb-line">{{ personalInfo.website }}</div>
        <div v-for="(link, i) in customLinkEntries" :key="i" class="sb-line">
          <a :href="link.href" target="_blank" rel="noopener" class="sb-link">{{ link.label }}</a>
        </div>
      </div>

      <div v-if="enabled.skills && skills.length" class="sb-block">
        <h2 class="sb-heading">Skills</h2>
        <template v-for="(list, cat) in resumeStore.skillsByCategory" :key="cat">
          <div class="sb-subcat">{{ cat }}</div>
          <div class="sb-chips">
            <span v-for="s in list" :key="s.id" class="sb-chip">{{ s.name }}</span>
          </div>
        </template>
      </div>

      <div v-if="enabled.education && education.length" class="sb-block">
        <h2 class="sb-heading">Education</h2>
        <div v-for="edu in education" :key="edu.id" class="sb-edu">
          <div class="sb-edu-degree">{{ edu.degree }}</div>
          <div class="sb-edu-org">{{ edu.institution }}</div>
          <div class="sb-edu-meta">
            {{ dateRange(edu.startDate, edu.endDate) }}<span v-if="edu.gpa"> · GPA {{ edu.gpa }}</span>
          </div>
        </div>
      </div>

      <div v-if="enabled.languages && languages.length" class="sb-block">
        <h2 class="sb-heading">Languages</h2>
        <div v-for="l in languages" :key="l.id" class="sb-line">
          {{ l.name }}<span v-if="l.level" class="sb-muted"> - {{ l.level }}</span>
        </div>
      </div>

      <div v-if="enabled.certifications && certifications.length" class="sb-block">
        <h2 class="sb-heading">Certifications</h2>
        <div v-for="c in certifications" :key="c.id" class="sb-cert">
          <div class="sb-cert-name">{{ c.name }}</div>
          <div class="sb-muted">{{ c.issuer }}<span v-if="c.date"> · {{ formatDate(c.date) }}</span></div>
        </div>
      </div>
    </aside>

    <!-- Main column -->
    <main class="sb-main">
      <section v-if="enabled.summary && personalInfo.summary" class="sb-section print-avoid-break">
        <h2 class="sb-main-heading">Profile</h2>
        <p class="sb-summary">{{ personalInfo.summary }}</p>
      </section>

      <section v-if="enabled.experience && experience.length" class="sb-section">
        <h2 class="sb-main-heading">Experience</h2>
        <div v-for="exp in resumeStore.sortedExperience" :key="exp.id" class="sb-entry print-avoid-break">
          <div class="sb-entry-row">
            <span class="sb-entry-title">{{ exp.title }}</span>
            <span class="sb-entry-date">{{ dateRange(exp.startDate, exp.endDate, exp.current) }}</span>
          </div>
          <div class="sb-entry-org">{{ exp.company }}<span v-if="exp.location" class="sb-muted"> · {{ exp.location }}</span></div>
          <p v-if="exp.description" class="sb-desc">{{ exp.description }}</p>
          <ul v-if="hasAchievements(exp)" class="sb-bullets">
            <li v-for="(a, i) in exp.achievements.filter(x => x && x.trim())" :key="i">
              <span class="sb-bullet">•</span><span>{{ a }}</span>
            </li>
          </ul>
        </div>
      </section>

      <section v-if="enabled.projects && projects.length" class="sb-section">
        <h2 class="sb-main-heading">Projects</h2>
        <div v-for="p in projects" :key="p.id" class="sb-entry print-avoid-break">
          <div class="sb-entry-row">
            <span class="sb-entry-title">{{ p.name }}</span>
            <span class="sb-entry-date">{{ dateRange(p.startDate, p.endDate) }}</span>
          </div>
          <p v-if="p.description" class="sb-desc">{{ p.description }}</p>
          <div v-if="p.technologies && p.technologies.length" class="sb-tech-chips">
            <span v-for="t in p.technologies" :key="t" class="sb-chip sb-chip-main">{{ t }}</span>
          </div>
          <div v-if="p.url" class="sb-link-line">{{ p.url }}</div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { useResumeStore } from '../../stores/resume'
import { storeToRefs } from 'pinia'
import { format, parseISO } from 'date-fns'

export default {
  name: 'SidebarResumeTemplate',
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
    customLinkEntries() {
      return (this.resumeStore.customLinks || [])
        .filter(l => l && l.label && l.url)
        .map(l => ({ label: l.label, href: this.formatUrl(l.url) }))
    }
  },
  methods: {
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
.sb-resume {
  --primary: #2563eb;
  --text: #1f2937;
  --background: #ffffff;
  --side-bg: #f4f5f7;

  display: flex;
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  background: var(--background);
  color: var(--text);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  line-height: 1.4;
}

/* Sidebar */
.sb-side {
  width: 34%;
  flex-shrink: 0;
  background: var(--side-bg);
  padding: 30px 22px;
  box-sizing: border-box;
}

.sb-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  margin: 0 auto 18px;
  border: 3px solid var(--primary);
}

.sb-name {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.15;
  color: var(--text);
}

.sb-role {
  color: var(--primary);
  font-weight: 600;
  margin-top: 2px;
  margin-bottom: 6px;
}

.sb-tagline {
  font-size: 0.85em;
  color: #6b7280;
  margin-top: 2px;
}

.sb-block {
  margin-top: 20px;
}

.sb-heading {
  font-size: 0.85em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--primary);
  border-bottom: 1.5px solid var(--primary);
  padding-bottom: 3px;
  margin-bottom: 8px;
}

.sb-line {
  font-size: 0.9em;
  word-break: break-word;
  margin-bottom: 3px;
}

.sb-muted {
  color: #6b7280;
}

.sb-link {
  color: var(--primary);
  text-decoration: none;
  word-break: break-word;
}

.sb-subcat {
  font-size: 0.78em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6b7280;
  margin: 6px 0 4px;
}

.sb-chips,
.sb-tech-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.sb-chip {
  display: inline-block;
  font-size: 0.8em;
  padding: 2px 8px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  color: var(--text);
}

.sb-chip-main {
  background: #f3f4f6;
}

.sb-edu {
  margin-bottom: 10px;
}

.sb-edu-degree {
  font-weight: 700;
  font-size: 0.92em;
}

.sb-edu-org {
  color: var(--primary);
  font-size: 0.88em;
}

.sb-edu-meta {
  color: #6b7280;
  font-size: 0.82em;
}

.sb-cert {
  margin-bottom: 8px;
  font-size: 0.9em;
}

.sb-cert-name {
  font-weight: 600;
}

/* Main */
.sb-main {
  flex: 1;
  min-width: 0;
  padding: 30px 28px;
  box-sizing: border-box;
}

.sb-section {
  margin-bottom: 18px;
}

.sb-main-heading {
  font-size: 1.05em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--primary);
  border-bottom: 2px solid var(--primary);
  padding-bottom: 4px;
  margin-bottom: 10px;
}

.sb-summary {
  line-height: 1.55;
}

.sb-entry {
  margin-bottom: 13px;
}

.sb-entry-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.sb-entry-title {
  font-weight: 700;
}

.sb-entry-date {
  color: #6b7280;
  font-size: 0.88em;
  white-space: nowrap;
  flex-shrink: 0;
}

.sb-entry-org {
  color: var(--primary);
  font-weight: 600;
  font-size: 0.95em;
}

.sb-desc {
  margin-top: 3px;
}

.sb-bullets {
  list-style: none;
  margin-top: 4px;
}

.sb-bullets li {
  display: flex;
  gap: 8px;
  margin-bottom: 2px;
  line-height: 1.4;
}

.sb-bullet {
  color: var(--primary);
  flex-shrink: 0;
}

.sb-link-line {
  font-size: 0.85em;
  color: var(--primary);
  margin-top: 2px;
}

/* export nudge for ruled headings */
.pdf-export .sb-heading,
.pdf-export .sb-main-heading {
  padding-bottom: 7px;
}

@media print {
  .sb-resume {
    box-shadow: none;
    max-width: none;
    margin: 0;
  }
  .print-avoid-break {
    page-break-inside: avoid;
  }
}

@media (max-width: 768px) {
  .sb-resume {
    flex-direction: column;
    max-width: 100%;
    box-shadow: none;
  }
  .sb-side {
    width: 100%;
    padding: 22px 18px;
  }
  .sb-main {
    padding: 22px 18px;
  }
}
</style>
