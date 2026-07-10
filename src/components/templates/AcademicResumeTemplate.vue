<template>
  <div class="ac-resume" :style="templateStyles">
    <!-- Header -->
    <header class="ac-header">
      <div class="ac-head-main">
        <h1 class="ac-name">{{ resumeStore.fullName }}</h1>
        <div v-if="personalInfo.title" class="ac-title">{{ personalInfo.title }}</div>
        <div v-if="personalInfo.headerTagline" class="ac-tagline">{{ personalInfo.headerTagline }}</div>
        <div class="ac-contact">
          <span v-for="(item, i) in contactItems" :key="i">
            <span v-if="i > 0" class="ac-sep">·</span>{{ item }}
          </span>
          <template v-for="(link, i) in customLinkEntries" :key="'cl' + i">
            <span v-if="contactItems.length || i > 0" class="ac-sep">·</span><a :href="link.href" target="_blank" rel="noopener" class="ac-clink">{{ link.label }}</a>
          </template>
        </div>
      </div>
      <div v-if="settings.showProfileImage && personalInfo.profileImage"
           class="ac-photo"
           :style="{ backgroundImage: `url('${personalInfo.profileImage}')` }"></div>
    </header>

    <!-- Summary / Research Interests -->
    <section v-if="enabled.summary && personalInfo.summary" class="ac-section print-avoid-break">
      <h2 class="ac-heading">Profile</h2>
      <p class="ac-summary">{{ personalInfo.summary }}</p>
    </section>

    <!-- Experience -->
    <section v-if="enabled.experience && experience.length" class="ac-section">
      <h2 class="ac-heading">Experience</h2>
      <div v-for="exp in resumeStore.sortedExperience" :key="exp.id" class="ac-entry print-avoid-break">
        <div class="ac-date">{{ dateRange(exp.startDate, exp.endDate, exp.current) }}</div>
        <div class="ac-body">
          <div class="ac-entry-title"><span class="ac-marker"></span>{{ exp.title }}<span class="ac-org">, {{ exp.company }}</span><span v-if="exp.location" class="ac-loc"> - {{ exp.location }}</span></div>
          <p v-if="exp.description" class="ac-desc">{{ exp.description }}</p>
          <ul v-if="hasAchievements(exp)" class="ac-bullets">
            <li v-for="(a, i) in exp.achievements.filter(x => x && x.trim())" :key="i">
              <span class="ac-bullet">–</span><span>{{ a }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Education -->
    <section v-if="enabled.education && education.length" class="ac-section">
      <h2 class="ac-heading">Education</h2>
      <div v-for="edu in education" :key="edu.id" class="ac-entry print-avoid-break">
        <div class="ac-date">{{ dateRange(edu.startDate, edu.endDate) }}</div>
        <div class="ac-body">
          <div class="ac-entry-title"><span class="ac-marker"></span>{{ edu.degree }}<span class="ac-org">, {{ edu.institution }}</span></div>
          <div v-if="edu.location || edu.gpa" class="ac-loc">
            <span v-if="edu.location">{{ edu.location }}</span><span v-if="edu.gpa"><span v-if="edu.location"> · </span>GPA: {{ edu.gpa }}</span>
          </div>
          <p v-if="edu.description" class="ac-desc">{{ edu.description }}</p>
        </div>
      </div>
    </section>

    <!-- Selected Projects -->
    <section v-if="enabled.projects && projects.length" class="ac-section">
      <h2 class="ac-heading">Selected Projects</h2>
      <div v-for="p in projects" :key="p.id" class="ac-entry print-avoid-break">
        <div class="ac-date">{{ dateRange(p.startDate, p.endDate) }}</div>
        <div class="ac-body">
          <div class="ac-entry-title"><span class="ac-marker"></span>{{ p.name }}</div>
          <p v-if="p.description" class="ac-desc">{{ p.description }}</p>
          <div v-if="p.technologies && p.technologies.length" class="ac-tech">{{ p.technologies.join(', ') }}</div>
          <div v-if="p.url" class="ac-link">{{ p.url }}</div>
        </div>
      </div>
    </section>

    <!-- Certifications -->
    <section v-if="enabled.certifications && certifications.length" class="ac-section print-avoid-break">
      <h2 class="ac-heading">Certifications</h2>
      <div v-for="c in certifications" :key="c.id" class="ac-entry">
        <div class="ac-date">{{ formatDate(c.date) }}</div>
        <div class="ac-body">
          <div class="ac-entry-title"><span class="ac-marker"></span>{{ c.name }}<span class="ac-org" v-if="c.issuer">, {{ c.issuer }}</span></div>
        </div>
      </div>
    </section>

    <!-- Skills -->
    <section v-if="enabled.skills && skills.length" class="ac-section print-avoid-break">
      <h2 class="ac-heading">Skills</h2>
      <div class="ac-skill-grid">
        <template v-for="(list, cat) in resumeStore.skillsByCategory" :key="cat">
          <div class="ac-skill-cat">{{ cat }}</div>
          <div>{{ list.map(s => s.name).join(', ') }}</div>
        </template>
      </div>
    </section>

    <!-- Languages -->
    <section v-if="enabled.languages && languages.length" class="ac-section print-avoid-break">
      <h2 class="ac-heading">Languages</h2>
      <div class="ac-skill-grid">
        <template v-for="l in languages" :key="l.id">
          <div class="ac-skill-cat">{{ l.name }}</div>
          <div>{{ l.level }}</div>
        </template>
      </div>
    </section>
  </div>
</template>

<script>
import { useResumeStore } from '../../stores/resume'
import { storeToRefs } from 'pinia'
import { format, parseISO } from 'date-fns'

export default {
  name: 'AcademicResumeTemplate',
  setup() {
    const resumeStore = useResumeStore()
    const { personalInfo, skills, experience, education, projects, certifications, languages, settings } =
      storeToRefs(resumeStore)
    return { resumeStore, personalInfo, skills, experience, education, projects, certifications, languages, settings }
  },
  computed: {
    templateStyles() {
      const c = this.settings.colorScheme
      // Note: font-family is intentionally fixed (serif) for the academic look.
      return {
        '--primary': c.primary,
        '--text': c.text,
        '--background': c.background,
        fontSize: `${this.settings.fontSize}px`
      }
    },
    enabled() {
      return this.settings.sectionsEnabled
    },
    contactItems() {
      const p = this.personalInfo
      return [p.email, p.phone, p.address, p.linkedin, p.github, p.website].filter(Boolean)
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
      if (s && e) return `${s} – ${e}`
      return s || e || ''
    }
  }
}
</script>

<style scoped>
.ac-resume {
  --primary: #4d5c2e;
  --text: #1f2937;
  --background: #ffffff;

  font-family: Georgia, 'Times New Roman', Cambria, serif;
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 40px 46px;
  background: var(--background);
  color: var(--text);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  line-height: 1.45;
}

.ac-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  border-bottom: 2px solid var(--primary);
  padding-bottom: 12px;
  margin-bottom: 18px;
}

.ac-name {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.1;
}

.ac-title {
  font-size: 1.05rem;
  font-style: italic;
  color: var(--primary);
  margin-top: 2px;
}

.ac-tagline {
  font-size: 0.9em;
  color: #4b5563;
  margin-top: 3px;
}

.ac-contact {
  margin-top: 8px;
  font-size: 0.88em;
  color: #374151;
}

.ac-clink {
  color: var(--primary);
  text-decoration: none;
}

.ac-sep {
  margin: 0 7px;
  color: #9ca3af;
}

.ac-photo {
  width: 96px;
  height: 96px;
  flex-shrink: 0;
  background-size: cover;
  background-position: center;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.ac-section {
  margin-bottom: 16px;
}

.ac-heading {
  font-size: 1.15em;
  font-weight: 700;
  color: var(--primary);
  border-bottom: 1.5px solid var(--primary);
  padding-bottom: 2px;
  margin-bottom: 10px;
}

.ac-summary {
  line-height: 1.55;
}

.ac-entry {
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 14px;
  margin-bottom: 11px;
}

.ac-entry:last-child {
  margin-bottom: 0;
}

.ac-date {
  font-size: 0.85em;
  font-style: italic;
  color: #6b7280;
  padding-top: 1px;
}

.ac-entry-title {
  font-weight: 700;
}

.ac-marker {
  display: inline-block;
  width: 7px;
  height: 7px;
  background: var(--primary);
  border-radius: 1px;
  margin-right: 8px;
  vertical-align: middle;
}

.ac-org {
  font-weight: 400;
}

.ac-loc {
  font-style: italic;
  color: #6b7280;
  font-size: 0.9em;
}

.ac-desc {
  margin-top: 2px;
}

.ac-bullets {
  list-style: none;
  margin-top: 3px;
}

.ac-bullets li {
  display: flex;
  gap: 8px;
  margin-bottom: 2px;
  line-height: 1.4;
}

.ac-bullet {
  color: var(--primary);
  flex-shrink: 0;
}

.ac-tech {
  font-size: 0.9em;
  color: #4b5563;
  margin-top: 2px;
}

.ac-link {
  font-size: 0.85em;
  color: var(--primary);
  margin-top: 1px;
  overflow-wrap: anywhere;
}

/* Let grid/flex children shrink so long URLs wrap instead of overflowing */
.ac-head-main,
.ac-body {
  min-width: 0;
}

.ac-tech,
.ac-contact {
  overflow-wrap: anywhere;
}

.ac-skill-grid {
  display: grid;
  grid-template-columns: 130px 1fr;
  row-gap: 5px;
  column-gap: 14px;
}

.ac-skill-cat {
  font-weight: 700;
}

.pdf-export .ac-heading {
  padding-bottom: 6px;
}

@media print {
  .ac-resume {
    box-shadow: none;
    max-width: none;
    margin: 0;
  }
  .print-avoid-break {
    page-break-inside: avoid;
  }
}

@media (max-width: 768px) {
  .ac-resume {
    max-width: 100%;
    padding: 22px 18px;
    box-shadow: none;
  }
  .ac-name {
    font-size: 1.6rem;
  }
  .ac-entry {
    grid-template-columns: 74px 1fr;
    gap: 10px;
  }
  .ac-skill-grid {
    grid-template-columns: 110px 1fr;
  }
}
</style>
