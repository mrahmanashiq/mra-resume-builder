<template>
  <div class="dev-resume" :style="templateStyles">
    <!-- Header: name, title, and a single links + contact row -->
    <header class="dev-header" :style="headerStyle">
      <h1 class="dev-name">{{ resumeStore.fullName }}</h1>
      <div v-if="personalInfo.title" class="dev-title">{{ personalInfo.title }}</div>
      <div v-if="personalInfo.headerTagline" class="dev-tagline">{{ personalInfo.headerTagline }}</div>
      <div v-if="headerEntries.length" class="dev-contact">
        <template v-for="(e, i) in headerEntries" :key="i">
          <span v-if="i > 0" class="dev-sep">|</span>
          <a v-if="e.href" :href="e.href" class="dev-link" target="_blank" rel="noopener"><LinkIcon v-if="settings.showLinkIcons" :name="e.icon" class="dev-entry-icon" />{{ e.text }}</a>
          <span v-else><LinkIcon v-if="settings.showLinkIcons" :name="e.icon" class="dev-entry-icon" />{{ e.text }}</span>
        </template>
      </div>
    </header>

    <!-- Summary -->
    <section v-if="enabled.summary && personalInfo.summary" class="dev-section print-avoid-break" :style="{ order: ord('summary') }">
      <h2 class="dev-heading">Summary</h2>
      <p class="dev-summary">{{ personalInfo.summary }}</p>
    </section>

    <!-- Skills -->
    <section v-if="enabled.skills && skills.length" class="dev-section print-avoid-break" :style="{ order: ord('skills') }">
      <h2 class="dev-heading">Skills</h2>
      <div class="dev-skills">
        <div v-for="(list, cat) in resumeStore.skillsByCategory" :key="cat" class="dev-skill-row">
          <span class="dev-skill-cat">{{ cat }}:</span> {{ list.map(s => s.name).join(', ') }}
        </div>
      </div>
    </section>

    <!-- Experience -->
    <section v-if="enabled.experience && experience.length" class="dev-section" :style="{ order: ord('experience') }">
      <h2 class="dev-heading">Experience</h2>
      <div v-for="exp in resumeStore.sortedExperience" :key="exp.id" class="dev-entry print-avoid-break">
        <div class="dev-entry-row">
          <span class="dev-entry-head">
            <span class="dev-entry-title">{{ exp.title }}</span><span v-if="exp.company" class="dev-entry-org"> - <a v-if="exp.url" :href="formatUrl(exp.url)" class="doc-link" target="_blank" rel="noopener">{{ exp.company }}</a><template v-else>{{ exp.company }}</template></span><span v-if="exp.location" class="dev-entry-loc"> ({{ exp.location }})</span>
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
    <section v-if="enabled.projects && projects.length" class="dev-section" :style="{ order: ord('projects') }">
      <h2 class="dev-heading">Projects</h2>
      <ul class="dev-proj-list">
        <li v-for="p in projects" :key="p.id" class="dev-proj print-avoid-break">
          <span class="dev-bullet">•</span>
          <span>
            <span class="dev-proj-name">{{ p.name }}:</span>
            <span v-if="p.description"> {{ p.description }}</span><span v-if="p.technologies && p.technologies.length" class="dev-proj-tech"> ({{ p.technologies.join(', ') }})</span><template v-if="p.url || p.liveUrl"><span class="dev-proj-sep"> · </span><a v-if="p.url" :href="formatUrl(p.url)" class="dev-link" target="_blank" rel="noopener">Code</a><a v-if="p.liveUrl" :href="formatUrl(p.liveUrl)" class="dev-link dev-proj-live" target="_blank" rel="noopener">Live</a></template>
          </span>
        </li>
      </ul>
    </section>

    <!-- Education -->
    <section v-if="enabled.education && education.length" class="dev-section print-avoid-break" :style="{ order: ord('education') }">
      <h2 class="dev-heading">Education</h2>
      <div v-for="edu in education" :key="edu.id" class="dev-entry">
        <div class="dev-entry-row">
          <span class="dev-entry-head">
            <span class="dev-entry-title">{{ edu.degree }}</span><span v-if="edu.institution" class="dev-entry-org"> - <a v-if="edu.url" :href="formatUrl(edu.url)" class="doc-link" target="_blank" rel="noopener">{{ edu.institution }}</a><template v-else>{{ edu.institution }}</template></span>
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
    <section v-if="enabled.certifications && certifications.length" class="dev-section print-avoid-break" :style="{ order: ord('certifications') }">
      <h2 class="dev-heading">Certifications</h2>
      <div v-for="c in certifications" :key="c.id" class="dev-cert">
        <span class="dev-entry-title">{{ c.name }}</span><span v-if="c.issuer" class="dev-entry-org"> - {{ c.issuer }}</span>
        <span v-if="c.date" class="dev-entry-date">{{ formatDate(c.date) }}</span>
      </div>
    </section>

    <!-- Languages -->
    <section v-if="enabled.languages && languages.length" class="dev-section print-avoid-break" :style="{ order: ord('languages') }">
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
import LinkIcon from '../LinkIcon.vue'
import { iconKeyFor } from '../../utils/linkIcons'
import { useResumeTemplate } from '../../composables/useResumeTemplate'

/**
 * Compact, left-aligned single-column resume aimed at software engineers:
 * a combined links + contact row in the header, skills grouped by category on
 * one line each, and projects as "Name: description" bullets. Uses border-bottom
 * headings and inline bullets so it captures cleanly to PDF (see project notes).
 *
 * Shared logic (dates, ord, formatUrl, colour vars, ...) comes from
 * useResumeTemplate(); only the combined header row is template-specific.
 */
export default {
  name: 'DeveloperResumeTemplate',
  components: { LinkIcon },
  setup() {
    return useResumeTemplate()
  },
  computed: {
    // Developer shows links + contact as one combined row with its own labels.
    headerEntries() {
      const p = this.personalInfo
      const out = []
      if (p.github) out.push({ text: p.githubLabel || 'Github', href: this.formatUrl(p.github), icon: 'github' })
      if (p.linkedin) out.push({ text: p.linkedinLabel || 'Linkedin', href: this.formatUrl(p.linkedin), icon: 'linkedin' })
      if (p.website) out.push({ text: p.websiteLabel || 'Portfolio', href: this.formatUrl(p.website), icon: 'website' })
      for (const l of this.customLinks || []) {
        if (l && l.url) out.push({ text: l.label || l.url, href: this.formatUrl(l.url), icon: iconKeyFor(l.label, l.url) })
      }
      if (p.email) out.push({ text: p.email, href: `mailto:${p.email}`, icon: 'email' })
      if (p.phone) out.push({ text: p.phone, href: null, icon: 'phone' })
      if (p.address) out.push({ text: p.address, href: null, icon: 'location' })
      return out
    }
  }
}
</script>

<style scoped src="./DeveloperResumeTemplate.css"></style>
