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
          <div class="cm-entry-org"><a v-if="exp.url" :href="formatUrl(exp.url)" class="doc-link" target="_blank" rel="noopener">{{ exp.company }}</a><template v-else>{{ exp.company }}</template><span v-if="exp.location" class="cm-muted"> · {{ exp.location }}</span></div>
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
          <a v-if="p.url" :href="formatUrl(p.url)" class="cm-link" target="_blank" rel="noopener">{{ p.url }}</a>
          <a v-if="p.liveUrl" :href="formatUrl(p.liveUrl)" class="cm-link" target="_blank" rel="noopener">{{ p.liveUrl }}</a>
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
          <div class="cm-entry-org"><a v-if="edu.url" :href="formatUrl(edu.url)" class="doc-link" target="_blank" rel="noopener">{{ edu.institution }}</a><template v-else>{{ edu.institution }}</template><span v-if="edu.location" class="cm-muted"> · {{ edu.location }}</span><span v-if="edu.gpa" class="cm-muted"> · GPA {{ edu.gpa }}</span></div>
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
import LinkIcon from '../LinkIcon.vue'
import { iconKeyFor } from '../../utils/linkIcons'
import { useResumeTemplate } from '../../composables/useResumeTemplate'

export default {
  name: 'ColorfulResumeTemplate',
  components: { LinkIcon },
  setup() {
    const shared = useResumeTemplate()
    // Colorful defines its own contactItems (includes social links inline), so
    // drop the shared one to avoid it shadowing the local computed below.
    delete shared.contactItems
    return shared
  },
  computed: {
    // Colorful folds LinkedIn/GitHub/Portfolio into the contact line as plain text.
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
  }
}
</script>

<style scoped src="./ColorfulResumeTemplate.css"></style>
