<template>
  <div class="ats-resume" :style="templateStyles">
    <!-- Header -->
    <header class="ats-header" :style="headerStyle">
      <h1 class="ats-name">{{ resumeStore.fullName }}</h1>
      <div v-if="personalInfo.title" class="ats-title">{{ personalInfo.title }}</div>
      <div v-if="personalInfo.headerTagline" class="ats-tagline">{{ personalInfo.headerTagline }}</div>
      <div class="ats-contact">
        <span v-for="(item, i) in contactItems" :key="'c' + i">
          <span v-if="i > 0" class="ats-sep">|</span><LinkIcon v-if="settings.showLinkIcons" :name="item.icon" class="ats-entry-icon" />{{ item.text }}
        </span>
      </div>
      <div v-if="headerLinks.length" class="ats-contact ats-links">
        <span v-for="(link, i) in headerLinks" :key="'l' + i">
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
          <span class="ats-entry-org"><a v-if="exp.url" :href="formatUrl(exp.url)" class="doc-link" target="_blank" rel="noopener">{{ exp.company }}</a><template v-else>{{ exp.company }}</template></span><span v-if="exp.location"> · {{ exp.location }}</span>
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
        <a v-if="p.url" :href="formatUrl(p.url)" class="ats-link-line" target="_blank" rel="noopener">{{ p.url }}</a>
        <a v-if="p.liveUrl" :href="formatUrl(p.liveUrl)" class="ats-link-line" target="_blank" rel="noopener">{{ p.liveUrl }}</a>
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
          <span class="ats-entry-org"><a v-if="edu.url" :href="formatUrl(edu.url)" class="doc-link" target="_blank" rel="noopener">{{ edu.institution }}</a><template v-else>{{ edu.institution }}</template></span><span v-if="edu.location"> · {{ edu.location }}</span><span v-if="edu.gpa"> · GPA: {{ edu.gpa }}</span>
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
import LinkIcon from '../LinkIcon.vue'
import { useResumeTemplate } from '../../composables/useResumeTemplate'

export default {
  name: 'AtsResumeTemplate',
  components: { LinkIcon },
  setup() {
    return useResumeTemplate()
  }
}
</script>

<style scoped src="./AtsResumeTemplate.css"></style>
