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
        <div v-if="personalInfo.email" class="sb-line"><LinkIcon v-if="settings.showLinkIcons" name="email" class="sb-entry-icon" />{{ personalInfo.email }}</div>
        <div v-if="personalInfo.phone" class="sb-line"><LinkIcon v-if="settings.showLinkIcons" name="phone" class="sb-entry-icon" />{{ personalInfo.phone }}</div>
        <div v-if="personalInfo.address" class="sb-line"><LinkIcon v-if="settings.showLinkIcons" name="location" class="sb-entry-icon" />{{ personalInfo.address }}</div>
        <div v-if="personalInfo.linkedin" class="sb-line"><LinkIcon v-if="settings.showLinkIcons" name="linkedin" class="sb-entry-icon" />{{ personalInfo.linkedin }}</div>
        <div v-if="personalInfo.github" class="sb-line"><LinkIcon v-if="settings.showLinkIcons" name="github" class="sb-entry-icon" />{{ personalInfo.github }}</div>
        <div v-if="personalInfo.website" class="sb-line"><LinkIcon v-if="settings.showLinkIcons" name="website" class="sb-entry-icon" />{{ personalInfo.website }}</div>
        <div v-for="(link, i) in customLinkEntries" :key="i" class="sb-line">
          <LinkIcon v-if="settings.showLinkIcons" :name="link.icon" class="sb-entry-icon" /><a :href="link.href" target="_blank" rel="noopener" class="sb-link">{{ link.label }}</a>
        </div>
      </div>

      <div v-if="enabled.skills && skills.length" class="sb-block" :style="{ order: ord('skills') }">
        <h2 class="sb-heading">Skills</h2>
        <template v-for="(list, cat) in resumeStore.skillsByCategory" :key="cat">
          <div class="sb-subcat">{{ cat }}</div>
          <div class="sb-chips">
            <span v-for="s in list" :key="s.id" class="sb-chip">{{ s.name }}</span>
          </div>
        </template>
      </div>

      <div v-if="enabled.education && education.length" class="sb-block" :style="{ order: ord('education') }">
        <h2 class="sb-heading">Education</h2>
        <div v-for="edu in education" :key="edu.id" class="sb-edu">
          <div class="sb-edu-degree">{{ edu.degree }}</div>
          <div class="sb-edu-org">{{ edu.institution }}</div>
          <div class="sb-edu-meta">
            {{ dateRange(edu.startDate, edu.endDate) }}<span v-if="edu.gpa"> · GPA {{ edu.gpa }}</span>
          </div>
        </div>
      </div>

      <div v-if="enabled.languages && languages.length" class="sb-block" :style="{ order: ord('languages') }">
        <h2 class="sb-heading">Languages</h2>
        <div v-for="l in languages" :key="l.id" class="sb-line">
          {{ l.name }}<span v-if="l.level" class="sb-muted"> - {{ l.level }}</span>
        </div>
      </div>

      <div v-if="enabled.certifications && certifications.length" class="sb-block" :style="{ order: ord('certifications') }">
        <h2 class="sb-heading">Certifications</h2>
        <div v-for="c in certifications" :key="c.id" class="sb-cert">
          <div class="sb-cert-name">{{ c.name }}</div>
          <div class="sb-muted">{{ c.issuer }}<span v-if="c.date"> · {{ formatDate(c.date) }}</span></div>
        </div>
      </div>
    </aside>

    <!-- Main column -->
    <main class="sb-main">
      <section v-if="enabled.summary && personalInfo.summary" class="sb-section print-avoid-break" :style="{ order: ord('summary') }">
        <h2 class="sb-main-heading">Profile</h2>
        <p class="sb-summary">{{ personalInfo.summary }}</p>
      </section>

      <section v-if="enabled.experience && experience.length" class="sb-section" :style="{ order: ord('experience') }">
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

      <section v-if="enabled.projects && projects.length" class="sb-section" :style="{ order: ord('projects') }">
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
import LinkIcon from '../LinkIcon.vue'
import { iconKeyFor } from '../../utils/linkIcons'
import { useResumeTemplate } from '../../composables/useResumeTemplate'

export default {
  name: 'SidebarResumeTemplate',
  components: { LinkIcon },
  setup() {
    return useResumeTemplate()
  },
  computed: {
    // Sidebar lists custom links after the fixed contact lines (as {label, href, icon}).
    customLinkEntries() {
      return (this.resumeStore.customLinks || [])
        .filter(l => l && l.label && l.url)
        .map(l => ({ label: l.label, href: this.formatUrl(l.url), icon: iconKeyFor(l.label, l.url) }))
    }
  }
}
</script>

<style scoped src="./SidebarResumeTemplate.css"></style>
