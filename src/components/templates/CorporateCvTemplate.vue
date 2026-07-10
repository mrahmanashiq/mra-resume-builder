<template>
  <div class="cv-resume" :style="templateStyles">
    <!-- Header band -->
    <header class="cv-header">
      <div class="cv-head-text">
        <h1 class="cv-name">{{ resumeStore.fullName }}</h1>
        <div v-if="personalInfo.title" class="cv-role">{{ personalInfo.title }}</div>
        <div v-if="personalInfo.headerTagline" class="cv-tagline">{{ personalInfo.headerTagline }}</div>
        <div class="cv-contact">
          <div v-if="personalInfo.phone">{{ personalInfo.phone }}</div>
          <div v-if="personalInfo.email">{{ personalInfo.email }}</div>
          <div v-if="personalInfo.address">{{ personalInfo.address }}</div>
          <div v-if="linkLine">{{ linkLine }}</div>
          <div v-if="customLinkEntries.length" class="cv-clinks">
            <template v-for="(link, i) in customLinkEntries" :key="i">
              <span v-if="i > 0"> | </span><a :href="link.href" target="_blank" rel="noopener" class="cv-clink">{{ link.label }}</a>
            </template>
          </div>
        </div>
      </div>
      <div v-if="settings.showProfileImage && personalInfo.profileImage"
           class="cv-photo"
           :style="{ backgroundImage: `url('${personalInfo.profileImage}')` }"></div>
    </header>

    <div class="cv-body">
      <!-- Career Objective -->
      <section v-if="enabled.summary && personalInfo.summary" class="cv-section print-avoid-break">
        <h2 class="cv-heading">Career Objective</h2>
        <p class="cv-text">{{ personalInfo.summary }}</p>
      </section>

      <!-- Employment History -->
      <section v-if="enabled.experience && experience.length" class="cv-section">
        <h2 class="cv-heading">Employment History</h2>
        <div v-for="exp in resumeStore.sortedExperience" :key="exp.id" class="cv-entry print-avoid-break">
          <div class="cv-entry-row">
            <span class="cv-entry-title">{{ exp.title }}</span>
            <span class="cv-entry-date">{{ dateRange(exp.startDate, exp.endDate, exp.current) }}</span>
          </div>
          <div class="cv-entry-org">{{ exp.company }}<span v-if="exp.location" class="cv-muted"> · {{ exp.location }}</span></div>
          <p v-if="exp.description" class="cv-desc">{{ exp.description }}</p>
          <ul v-if="hasAchievements(exp)" class="cv-bullets">
            <li v-for="(a, i) in exp.achievements.filter(x => x && x.trim())" :key="i">
              <span class="cv-bullet">•</span><span>{{ a }}</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- Projects (optional) -->
      <section v-if="enabled.projects && projects.length" class="cv-section">
        <h2 class="cv-heading">Projects</h2>
        <div v-for="p in projects" :key="p.id" class="cv-entry print-avoid-break">
          <div class="cv-entry-row">
            <span class="cv-entry-title">{{ p.name }}</span>
            <span class="cv-entry-date">{{ dateRange(p.startDate, p.endDate) }}</span>
          </div>
          <p v-if="p.description" class="cv-desc">{{ p.description }}</p>
          <div v-if="p.technologies && p.technologies.length" class="cv-muted cv-tech">{{ p.technologies.join(', ') }}</div>
        </div>
      </section>

      <!-- Academic Qualification -->
      <section v-if="enabled.education && education.length" class="cv-section print-avoid-break">
        <h2 class="cv-heading">Academic Qualification</h2>
        <table class="cv-table">
          <thead>
            <tr><th>Degree / Exam</th><th>Institute</th><th>Result / CGPA</th><th>Year</th></tr>
          </thead>
          <tbody>
            <tr v-for="edu in education" :key="edu.id">
              <td>{{ edu.degree }}</td>
              <td>{{ edu.institution }}</td>
              <td>{{ edu.gpa || '-' }}</td>
              <td>{{ yearOf(edu.endDate) || yearOf(edu.startDate) }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Training Summary -->
      <section v-if="enabled.training && training.length" class="cv-section print-avoid-break">
        <h2 class="cv-heading">Training Summary</h2>
        <table class="cv-table">
          <thead>
            <tr><th>Training Title</th><th>Topic</th><th>Institute</th><th>Location</th><th>Year</th><th>Duration</th></tr>
          </thead>
          <tbody>
            <tr v-for="t in training" :key="t.id">
              <td>{{ t.title }}</td><td>{{ t.topic }}</td><td>{{ t.institute }}</td>
              <td>{{ t.location }}</td><td>{{ t.year }}</td><td>{{ t.duration }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Key Skills -->
      <section v-if="enabled.skills && skills.length" class="cv-section print-avoid-break">
        <h2 class="cv-heading">Key Skills</h2>
        <ul class="cv-skill-grid">
          <li v-for="s in skills" :key="s.id"><span class="cv-bullet">•</span><span>{{ s.name }}</span></li>
        </ul>
      </section>

      <!-- Professional Qualification (from certifications) -->
      <section v-if="enabled.certifications && certifications.length" class="cv-section print-avoid-break">
        <h2 class="cv-heading">Professional Qualification</h2>
        <table class="cv-table">
          <thead>
            <tr><th>Certification</th><th>Institute</th><th>From</th><th>To</th></tr>
          </thead>
          <tbody>
            <tr v-for="c in certifications" :key="c.id">
              <td>{{ c.name }}</td><td>{{ c.issuer }}</td>
              <td>{{ formatMonth(c.date) || '-' }}</td>
              <td>{{ formatMonth(c.expiryDate) || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Accomplishments & Awards -->
      <section v-if="enabled.accomplishments && accomplishmentList.length" class="cv-section print-avoid-break">
        <h2 class="cv-heading">Accomplishments &amp; Awards</h2>
        <ul class="cv-list">
          <li v-for="a in accomplishmentList" :key="a.id"><span class="cv-bullet">•</span><span>{{ a.text }}</span></li>
        </ul>
      </section>

      <!-- Extra-Curricular Activities -->
      <section v-if="enabled.extracurricular && extracurricularList.length" class="cv-section print-avoid-break">
        <h2 class="cv-heading">Extra-Curricular Activities</h2>
        <ul class="cv-list">
          <li v-for="e in extracurricularList" :key="e.id"><span class="cv-bullet">•</span><span>{{ e.text }}</span></li>
        </ul>
      </section>

      <!-- Language Proficiency -->
      <section v-if="enabled.languages && languages.length" class="cv-section print-avoid-break">
        <h2 class="cv-heading">Language Proficiency</h2>
        <table class="cv-table">
          <thead>
            <tr><th>Language</th><th>Proficiency</th></tr>
          </thead>
          <tbody>
            <tr v-for="l in languages" :key="l.id"><td>{{ l.name }}</td><td>{{ l.level }}</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Personal Details -->
      <section v-if="enabled.personalDetails && personalRows.length" class="cv-section print-avoid-break">
        <h2 class="cv-heading">Personal Details</h2>
        <div class="cv-pd-grid">
          <template v-for="row in personalRows" :key="row.label">
            <div class="cv-pd-key">{{ row.label }}</div>
            <div class="cv-pd-val">: {{ row.value }}</div>
          </template>
        </div>
      </section>

      <!-- References -->
      <section v-if="enabled.references && references.length" class="cv-section print-avoid-break">
        <h2 class="cv-heading">References</h2>
        <div class="cv-ref-grid">
          <div v-for="r in references" :key="r.id" class="cv-ref">
            <div class="cv-ref-name">{{ r.name }}</div>
            <div v-if="r.title">{{ r.title }}</div>
            <div v-if="r.organization">{{ r.organization }}</div>
            <div v-if="r.mobile" class="cv-muted">Mobile: {{ r.mobile }}</div>
            <div v-if="r.email" class="cv-muted">Email: {{ r.email }}</div>
            <div v-if="r.relation" class="cv-muted">Relation: {{ r.relation }}</div>
          </div>
        </div>
      </section>

      <!-- Declaration -->
      <section v-if="enabled.declaration && declaration.text" class="cv-section print-avoid-break">
        <p class="cv-declaration">{{ declaration.text }}</p>
        <div class="cv-sign">
          <div class="cv-sign-name">{{ resumeStore.fullName }}</div>
          <div v-if="declaration.date || declaration.place" class="cv-muted">
            <span v-if="declaration.place">{{ declaration.place }}</span><span v-if="declaration.place && declaration.date"> · </span><span v-if="declaration.date">{{ formatFullDate(declaration.date) }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { useResumeStore } from '../../stores/resume'
import { storeToRefs } from 'pinia'
import { format, parseISO } from 'date-fns'

export default {
  name: 'CorporateCvTemplate',
  setup() {
    const resumeStore = useResumeStore()
    const {
      personalInfo, skills, experience, education, projects, certifications, languages,
      personalDetails, training, accomplishments, extracurricular, references, declaration, settings
    } = storeToRefs(resumeStore)
    return {
      resumeStore, personalInfo, skills, experience, education, projects, certifications, languages,
      personalDetails, training, accomplishments, extracurricular, references, declaration, settings
    }
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
    accomplishmentList() {
      return (this.accomplishments || []).filter(a => a.text && a.text.trim())
    },
    extracurricularList() {
      return (this.extracurricular || []).filter(e => e.text && e.text.trim())
    },
    linkLine() {
      const p = this.personalInfo
      return [p.linkedin, p.github, p.website].filter(Boolean).join('  |  ')
    },
    customLinkEntries() {
      return (this.resumeStore.customLinks || [])
        .filter(l => l && l.label && l.url)
        .map(l => ({ label: l.label, href: this.formatUrl(l.url) }))
    },
    personalRows() {
      const d = this.personalDetails || {}
      const rows = [
        { label: "Father's Name", value: d.fatherName },
        { label: "Mother's Name", value: d.motherName },
        { label: 'Date of Birth', value: this.formatFullDate(d.dateOfBirth) },
        { label: 'Gender', value: d.gender },
        { label: 'Marital Status', value: d.maritalStatus },
        { label: 'Nationality', value: d.nationality },
        { label: 'Religion', value: d.religion },
        { label: 'Blood Group', value: d.bloodGroup },
        { label: 'Permanent Address', value: d.permanentAddress },
        { label: 'Current Address', value: d.currentAddress }
      ]
      return rows.filter(r => r.value)
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
    formatMonth(v) {
      if (!v) return ''
      try {
        return format(parseISO(v + '-01'), 'MMM yyyy')
      } catch {
        return v
      }
    },
    formatFullDate(v) {
      if (!v) return ''
      try {
        // Accepts full date (YYYY-MM-DD) or month (YYYY-MM)
        const iso = v.length === 7 ? v + '-01' : v
        return format(parseISO(iso), v.length === 7 ? 'MMMM yyyy' : 'd MMMM yyyy')
      } catch {
        return v
      }
    },
    yearOf(v) {
      if (!v) return ''
      const m = /^(\d{4})/.exec(v)
      return m ? m[1] : v
    },
    dateRange(start, end, current = false) {
      const s = this.formatMonth(start)
      const e = current ? 'Present' : this.formatMonth(end)
      if (s && e) return `${s} - ${e}`
      return s || e || ''
    }
  }
}
</script>

<style scoped>
.cv-resume {
  --primary: #1e3a5f;
  --text: #1f2937;
  --background: #ffffff;

  max-width: 210mm;
  margin: 0 auto;
  background: var(--background);
  color: var(--text);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  line-height: 1.45;
}

/* Header band */
.cv-header {
  background: var(--primary);
  color: #ffffff;
  padding: 26px 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.cv-name {
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.cv-role {
  font-size: 1.02rem;
  font-weight: 500;
  opacity: 0.9;
  margin: 2px 0 8px;
}

.cv-tagline {
  font-size: 0.85em;
  opacity: 0.9;
  margin-bottom: 8px;
}

.cv-contact {
  font-size: 0.85em;
  opacity: 0.95;
  line-height: 1.55;
}

.cv-clink {
  color: #ffffff;
  text-decoration: underline;
}

.cv-photo {
  width: 108px;
  height: 128px;
  flex-shrink: 0;
  background-size: cover;
  background-position: center;
  border: 3px solid rgba(255, 255, 255, 0.85);
}

/* Body */
.cv-body {
  padding: 24px 36px 40px;
}

.cv-section {
  margin-bottom: 18px;
}

.cv-heading {
  font-size: 1.02em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--primary);
  border-bottom: 2px solid var(--primary);
  padding-bottom: 3px;
  margin-bottom: 10px;
}

.cv-text {
  line-height: 1.55;
}

.cv-entry {
  margin-bottom: 11px;
}

.cv-entry-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.cv-entry-title {
  font-weight: 700;
}

.cv-entry-date {
  color: var(--primary);
  font-size: 0.9em;
  white-space: nowrap;
  flex-shrink: 0;
}

.cv-entry-org {
  color: var(--primary);
  font-weight: 600;
  font-size: 0.95em;
}

.cv-muted {
  color: #6b7280;
  font-weight: 400;
}

.cv-desc {
  margin-top: 3px;
}

.cv-tech {
  font-size: 0.9em;
  margin-top: 2px;
}

.cv-bullets,
.cv-list {
  list-style: none;
  margin-top: 4px;
}

.cv-bullets li,
.cv-list li {
  display: flex;
  gap: 8px;
  margin-bottom: 2px;
  line-height: 1.4;
}

.cv-bullet {
  color: var(--primary);
  flex-shrink: 0;
}

/* Tables */
.cv-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9em;
}

.cv-table th {
  background: #eef2f8;
  border: 1px solid #cbd5e1;
  padding: 6px 8px;
  text-align: left;
  font-weight: 700;
  color: var(--primary);
}

.cv-table td {
  border: 1px solid #d7dee8;
  padding: 6px 8px;
  vertical-align: top;
}

/* Key skills as a two-column bullet grid */
.cv-skill-grid {
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px 24px;
}

.cv-skill-grid li {
  display: flex;
  gap: 8px;
}

/* Personal details */
.cv-pd-grid {
  display: grid;
  grid-template-columns: 150px 1fr 150px 1fr;
  row-gap: 6px;
  column-gap: 10px;
}

.cv-pd-key {
  font-weight: 600;
  color: #374151;
}

/* References */
.cv-ref-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.cv-ref {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 10px 12px;
  font-size: 0.92em;
}

.cv-ref-name {
  font-weight: 700;
  color: var(--primary);
}

/* Declaration */
.cv-declaration {
  font-size: 0.92em;
  color: #374151;
  margin-bottom: 14px;
}

.cv-sign-name {
  font-weight: 700;
  color: var(--primary);
}

/* html2canvas draws text lower than the browser: compensate ruled headings + table cells during export */
.pdf-export .cv-heading {
  padding-bottom: 7px;
}

.pdf-export .cv-table th,
.pdf-export .cv-table td {
  padding-top: 2px;
  padding-bottom: 11px;
}

@media print {
  .cv-resume {
    box-shadow: none;
    max-width: none;
    margin: 0;
  }
  .print-avoid-break {
    page-break-inside: avoid;
  }
}

@media (max-width: 768px) {
  .cv-resume {
    max-width: 100%;
    box-shadow: none;
  }
  .cv-header {
    flex-direction: column;
    text-align: center;
    padding: 22px 18px;
  }
  .cv-body {
    padding: 20px 16px 28px;
  }
  .cv-name {
    font-size: 1.5rem;
  }
  .cv-skill-grid,
  .cv-ref-grid {
    grid-template-columns: 1fr;
  }
  .cv-pd-grid {
    grid-template-columns: 130px 1fr;
  }
  .cv-table {
    font-size: 0.82em;
  }
}
</style>
