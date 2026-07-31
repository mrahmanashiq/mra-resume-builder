<template>
  <div class="ac-resume" :style="templateStyles">
    <!-- Header -->
    <header class="ac-header" :style="headerStyle">
      <div class="ac-head-main">
        <h1 class="ac-name">{{ resumeStore.fullName }}</h1>
        <div v-if="personalInfo.title" class="ac-title">{{ personalInfo.title }}</div>
        <div v-if="personalInfo.headerTagline" class="ac-tagline">{{ personalInfo.headerTagline }}</div>
        <div class="ac-contact">
          <span v-for="(item, i) in contactItems" :key="i">
            <span v-if="i > 0" class="ac-sep">·</span><LinkIcon v-if="settings.showLinkIcons" :name="item.icon" class="ac-entry-icon" />{{ item.text }}
          </span>
          <template v-for="(link, i) in customLinkEntries" :key="'cl' + i">
            <span v-if="contactItems.length || i > 0" class="ac-sep">·</span><LinkIcon v-if="settings.showLinkIcons" :name="link.icon" class="ac-entry-icon" /><a :href="link.href" target="_blank" rel="noopener" class="ac-clink">{{ link.label }}</a>
          </template>
        </div>
      </div>
      <div v-if="settings.showProfileImage && personalInfo.profileImage"
           class="ac-photo"
           :style="{ backgroundImage: `url('${personalInfo.profileImage}')` }"></div>
    </header>

    <!-- Summary / Research Interests -->
    <section v-if="enabled.summary && personalInfo.summary" class="ac-section print-avoid-break" :style="{ order: ord('summary') }">
      <h2 class="ac-heading">Profile</h2>
      <p class="ac-summary">{{ personalInfo.summary }}</p>
    </section>

    <!-- Experience -->
    <section v-if="enabled.experience && experience.length" class="ac-section" :style="{ order: ord('experience') }">
      <h2 class="ac-heading">Experience</h2>
      <div v-for="exp in resumeStore.sortedExperience" :key="exp.id" class="ac-entry print-avoid-break">
        <div class="ac-date">{{ dateRange(exp.startDate, exp.endDate, exp.current) }}</div>
        <div class="ac-body">
          <div class="ac-entry-title"><span class="ac-marker"></span>{{ exp.title }}<span class="ac-org">, <a v-if="exp.url" :href="formatUrl(exp.url)" class="doc-link" target="_blank" rel="noopener">{{ exp.company }}</a><template v-else>{{ exp.company }}</template></span><span v-if="exp.location" class="ac-loc"> - {{ exp.location }}</span></div>
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
    <section v-if="enabled.education && education.length" class="ac-section" :style="{ order: ord('education') }">
      <h2 class="ac-heading">Education</h2>
      <div v-for="edu in education" :key="edu.id" class="ac-entry print-avoid-break">
        <div class="ac-date">{{ dateRange(edu.startDate, edu.endDate) }}</div>
        <div class="ac-body">
          <div class="ac-entry-title"><span class="ac-marker"></span>{{ edu.degree }}<span class="ac-org">, <a v-if="edu.url" :href="formatUrl(edu.url)" class="doc-link" target="_blank" rel="noopener">{{ edu.institution }}</a><template v-else>{{ edu.institution }}</template></span></div>
          <div v-if="edu.location || edu.gpa" class="ac-loc">
            <span v-if="edu.location">{{ edu.location }}</span><span v-if="edu.gpa"><span v-if="edu.location"> · </span>GPA: {{ edu.gpa }}</span>
          </div>
          <p v-if="edu.description" class="ac-desc">{{ edu.description }}</p>
        </div>
      </div>
    </section>

    <!-- Selected Projects -->
    <section v-if="enabled.projects && projects.length" class="ac-section" :style="{ order: ord('projects') }">
      <h2 class="ac-heading">Selected Projects</h2>
      <div v-for="p in projects" :key="p.id" class="ac-entry print-avoid-break">
        <div class="ac-date">{{ dateRange(p.startDate, p.endDate) }}</div>
        <div class="ac-body">
          <div class="ac-entry-title"><span class="ac-marker"></span>{{ p.name }}</div>
          <p v-if="p.description" class="ac-desc">{{ p.description }}</p>
          <div v-if="p.technologies && p.technologies.length" class="ac-tech">{{ p.technologies.join(', ') }}</div>
          <a v-if="p.url" :href="formatUrl(p.url)" class="ac-link" target="_blank" rel="noopener">{{ p.url }}</a>
          <a v-if="p.liveUrl" :href="formatUrl(p.liveUrl)" class="ac-link" target="_blank" rel="noopener">{{ p.liveUrl }}</a>
        </div>
      </div>
    </section>

    <!-- Certifications -->
    <section v-if="enabled.certifications && certifications.length" class="ac-section print-avoid-break" :style="{ order: ord('certifications') }">
      <h2 class="ac-heading">Certifications</h2>
      <div v-for="c in certifications" :key="c.id" class="ac-entry">
        <div class="ac-date">{{ formatDate(c.date) }}</div>
        <div class="ac-body">
          <div class="ac-entry-title"><span class="ac-marker"></span>{{ c.name }}<span class="ac-org" v-if="c.issuer">, {{ c.issuer }}</span></div>
        </div>
      </div>
    </section>

    <!-- Skills -->
    <section v-if="enabled.skills && skills.length" class="ac-section print-avoid-break" :style="{ order: ord('skills') }">
      <h2 class="ac-heading">Skills</h2>
      <div class="ac-skill-grid">
        <template v-for="(list, cat) in resumeStore.skillsByCategory" :key="cat">
          <div class="ac-skill-cat">{{ cat }}</div>
          <div>{{ list.map(s => s.name).join(', ') }}</div>
        </template>
      </div>
    </section>

    <!-- Languages -->
    <section v-if="enabled.languages && languages.length" class="ac-section print-avoid-break" :style="{ order: ord('languages') }">
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
import LinkIcon from '../LinkIcon.vue'
import { iconKeyFor } from '../../utils/linkIcons'
import { useResumeTemplate } from '../../composables/useResumeTemplate'

export default {
  name: 'AcademicResumeTemplate',
  components: { LinkIcon },
  setup() {
    const shared = useResumeTemplate()
    // Academic overrides these locally (fixed serif font, social links inline,
    // en-dash date ranges), so drop the shared versions to prevent shadowing.
    delete shared.templateStyles
    delete shared.contactItems
    delete shared.dateRange
    return shared
  },
  computed: {
    templateStyles() {
      const c = this.settings.colorScheme
      // Note: font-family is intentionally fixed (serif) for the academic look.
      return {
        '--primary': c.primary,
        '--text': c.text,
        '--background': c.background,
        '--fs-scale': this.settings.fontSize / 14,
        '--fs-heading': this.settings.headingScale || 1,
        '--fs-body': this.settings.bodyScale || 1,
        '--fs-detail': this.settings.detailScale || 1,
        fontSize: `${this.settings.fontSize * (this.settings.bodyScale || 1)}px`
      }
    },
    contactItems() {
      const p = this.personalInfo
      const out = []
      if (p.email) out.push({ text: p.email, icon: 'email' })
      if (p.phone) out.push({ text: p.phone, icon: 'phone' })
      if (p.address) out.push({ text: p.address, icon: 'location' })
      if (p.linkedin) out.push({ text: p.linkedinLabel || p.linkedin, icon: 'linkedin' })
      if (p.github) out.push({ text: p.githubLabel || p.github, icon: 'github' })
      if (p.website) out.push({ text: p.websiteLabel || p.website, icon: 'website' })
      return out
    },
    customLinkEntries() {
      return (this.resumeStore.customLinks || [])
        .filter(l => l && l.url)
        .map(l => ({ label: l.label || l.url, href: this.formatUrl(l.url), icon: iconKeyFor(l.label, l.url) }))
    }
  },
  methods: {
    // Academic uses en-dash date ranges (differs from the shared hyphen version).
    dateRange(start, end, current = false) {
      const s = this.formatDate(start)
      const e = current ? 'Present' : this.formatDate(end)
      if (s && e) return `${s} – ${e}`
      return s || e || ''
    }
  }
}
</script>

<style scoped src="./AcademicResumeTemplate.css"></style>
