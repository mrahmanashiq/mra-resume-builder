<template>
  <div class="cv-resume" :style="templateStyles">
    <!-- Header band -->
    <header class="cv-header">
      <div class="cv-head-text">
        <h1 class="cv-name">{{ resumeStore.fullName }}</h1>
        <div v-if="personalInfo.title" class="cv-role">{{ personalInfo.title }}</div>
        <div v-if="personalInfo.headerTagline" class="cv-tagline">{{ personalInfo.headerTagline }}</div>
        <div class="cv-contact">
          <div v-if="personalInfo.phone"><LinkIcon v-if="settings.showLinkIcons" name="phone" class="cv-entry-icon" />{{ personalInfo.phone }}</div>
          <div v-if="personalInfo.email"><LinkIcon v-if="settings.showLinkIcons" name="email" class="cv-entry-icon" />{{ personalInfo.email }}</div>
          <div v-if="personalInfo.address"><LinkIcon v-if="settings.showLinkIcons" name="location" class="cv-entry-icon" />{{ personalInfo.address }}</div>
          <div v-if="linkItems.length">
            <template v-for="(link, i) in linkItems" :key="'ll' + i">
              <span v-if="i > 0"> | </span><LinkIcon v-if="settings.showLinkIcons" :name="link.icon" class="cv-entry-icon" />{{ link.text }}
            </template>
          </div>
          <div v-if="customLinkEntries.length" class="cv-clinks">
            <template v-for="(link, i) in customLinkEntries" :key="i">
              <span v-if="i > 0"> | </span><LinkIcon v-if="settings.showLinkIcons" :name="link.icon" class="cv-entry-icon" /><a :href="link.href" target="_blank" rel="noopener" class="cv-clink">{{ link.label }}</a>
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
      <section v-if="enabled.summary && personalInfo.summary" class="cv-section print-avoid-break" :style="{ order: ord('summary') }">
        <h2 class="cv-heading">Career Objective</h2>
        <p class="cv-text">{{ personalInfo.summary }}</p>
      </section>

      <!-- Employment History -->
      <section v-if="enabled.experience && experience.length" class="cv-section" :style="{ order: ord('experience') }">
        <h2 class="cv-heading">Employment History</h2>
        <div v-for="exp in resumeStore.sortedExperience" :key="exp.id" class="cv-entry print-avoid-break">
          <div class="cv-entry-row">
            <span class="cv-entry-title">{{ exp.title }}</span>
            <span class="cv-entry-date">{{ dateRange(exp.startDate, exp.endDate, exp.current) }}</span>
          </div>
          <div class="cv-entry-org"><a v-if="exp.url" :href="formatUrl(exp.url)" class="doc-link" target="_blank" rel="noopener">{{ exp.company }}</a><template v-else>{{ exp.company }}</template><span v-if="exp.location" class="cv-muted"> · {{ exp.location }}</span></div>
          <p v-if="exp.description" class="cv-desc">{{ exp.description }}</p>
          <ul v-if="hasAchievements(exp)" class="cv-bullets">
            <li v-for="(a, i) in exp.achievements.filter(x => x && x.trim())" :key="i">
              <span class="cv-bullet">•</span><span>{{ a }}</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- Projects (optional) -->
      <section v-if="enabled.projects && projects.length" class="cv-section" :style="{ order: ord('projects') }">
        <h2 class="cv-heading">Projects</h2>
        <div v-for="p in projects" :key="p.id" class="cv-entry print-avoid-break">
          <div class="cv-entry-row">
            <span class="cv-entry-title">{{ p.name }}</span>
            <span class="cv-entry-date">{{ dateRange(p.startDate, p.endDate) }}</span>
          </div>
          <p v-if="p.description" class="cv-desc">{{ p.description }}</p>
          <div v-if="p.technologies && p.technologies.length" class="cv-muted cv-tech">{{ p.technologies.join(', ') }}</div>
          <a v-if="p.url" :href="formatUrl(p.url)" class="cv-link" target="_blank" rel="noopener">{{ p.url }}</a>
          <a v-if="p.liveUrl" :href="formatUrl(p.liveUrl)" class="cv-link" target="_blank" rel="noopener">{{ p.liveUrl }}</a>
        </div>
      </section>

      <!-- Academic Qualification -->
      <section v-if="enabled.education && education.length" class="cv-section print-avoid-break" :style="{ order: ord('education') }">
        <h2 class="cv-heading">Academic Qualification</h2>
        <table class="cv-table">
          <thead>
            <tr><th>Degree / Exam</th><th>Institute</th><th>Result / CGPA</th><th>Year</th></tr>
          </thead>
          <tbody>
            <tr v-for="edu in education" :key="edu.id">
              <td>{{ edu.degree }}</td>
              <td><a v-if="edu.url" :href="formatUrl(edu.url)" class="doc-link" target="_blank" rel="noopener">{{ edu.institution }}</a><template v-else>{{ edu.institution }}</template></td>
              <td>{{ edu.gpa || '-' }}</td>
              <td>{{ yearOf(edu.endDate) || yearOf(edu.startDate) }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Training Summary -->
      <section v-if="enabled.training && training.length" class="cv-section print-avoid-break" :style="{ order: ord('training') }">
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
      <section v-if="enabled.skills && skills.length" class="cv-section print-avoid-break" :style="{ order: ord('skills') }">
        <h2 class="cv-heading">Key Skills</h2>
        <ul class="cv-skill-grid">
          <li v-for="s in skills" :key="s.id"><span class="cv-bullet">•</span><span>{{ s.name }}</span></li>
        </ul>
      </section>

      <!-- Professional Qualification (from certifications) -->
      <section v-if="enabled.certifications && certifications.length" class="cv-section print-avoid-break" :style="{ order: ord('certifications') }">
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
      <section v-if="enabled.accomplishments && accomplishmentList.length" class="cv-section print-avoid-break" :style="{ order: ord('accomplishments') }">
        <h2 class="cv-heading">Accomplishments &amp; Awards</h2>
        <ul class="cv-list">
          <li v-for="a in accomplishmentList" :key="a.id"><span class="cv-bullet">•</span><span>{{ a.text }}</span></li>
        </ul>
      </section>

      <!-- Extra-Curricular Activities -->
      <section v-if="enabled.extracurricular && extracurricularList.length" class="cv-section print-avoid-break" :style="{ order: ord('extracurricular') }">
        <h2 class="cv-heading">Extra-Curricular Activities</h2>
        <ul class="cv-list">
          <li v-for="e in extracurricularList" :key="e.id"><span class="cv-bullet">•</span><span>{{ e.text }}</span></li>
        </ul>
      </section>

      <!-- Language Proficiency -->
      <section v-if="enabled.languages && languages.length" class="cv-section print-avoid-break" :style="{ order: ord('languages') }">
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
      <section v-if="enabled.personalDetails && personalRows.length" class="cv-section print-avoid-break" :style="{ order: ord('personalDetails') }">
        <h2 class="cv-heading">Personal Details</h2>
        <div class="cv-pd-grid">
          <template v-for="row in personalRows" :key="row.label">
            <div class="cv-pd-key">{{ row.label }}</div>
            <div class="cv-pd-val">: {{ row.value }}</div>
          </template>
        </div>
      </section>

      <!-- References -->
      <section v-if="enabled.references && references.length" class="cv-section print-avoid-break" :style="{ order: ord('references') }">
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
      <section v-if="enabled.declaration && declaration.text" class="cv-section print-avoid-break" :style="{ order: ord('declaration') }">
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
import { format, parseISO } from 'date-fns'
import LinkIcon from '../LinkIcon.vue'
import { iconKeyFor } from '../../utils/linkIcons'
import { useResumeTemplate } from '../../composables/useResumeTemplate'

export default {
  name: 'CorporateCvTemplate',
  components: { LinkIcon },
  setup() {
    return useResumeTemplate()
  },
  computed: {
    accomplishmentList() {
      return (this.accomplishments || []).filter(a => a.text && a.text.trim())
    },
    extracurricularList() {
      return (this.extracurricular || []).filter(e => e.text && e.text.trim())
    },
    // Corporate shows the fixed links as their own pipe-separated row (plain text).
    linkItems() {
      const p = this.personalInfo
      const out = []
      if (p.linkedin) out.push({ text: p.linkedinLabel || p.linkedin, icon: 'linkedin' })
      if (p.github) out.push({ text: p.githubLabel || p.github, icon: 'github' })
      if (p.website) out.push({ text: p.websiteLabel || p.website, icon: 'website' })
      return out
    },
    customLinkEntries() {
      return (this.resumeStore.customLinks || [])
        .filter(l => l && l.url)
        .map(l => ({ label: l.label || l.url, href: this.formatUrl(l.url), icon: iconKeyFor(l.label, l.url) }))
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
    }
  }
}
</script>

<style scoped src="./CorporateCvTemplate.css"></style>
