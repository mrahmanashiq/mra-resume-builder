<template>
  <div class="ap-cv" :style="templateStyles">
    <!-- Header -->
    <header class="ap-header" :style="headerStyle">
      <h1 class="ap-name">{{ resumeStore.fullName }}</h1>
      <div v-if="personalInfo.headerTagline" class="ap-tagline">{{ personalInfo.headerTagline }}</div>
      <div v-if="personalInfo.researchInterests" class="ap-interests">
        <span class="ap-interests-label">Research Interests:</span> {{ personalInfo.researchInterests }}
      </div>
    </header>

    <!-- Personal information -->
    <section class="ap-section print-avoid-break">
      <div class="ap-label">Personal Information</div>
      <div class="ap-content">
        <div v-if="personalInfo.email" class="ap-info"><LinkIcon v-if="settings.showLinkIcons" name="email" class="ap-entry-icon" />Email: {{ personalInfo.email }}</div>
        <div v-if="personalInfo.website" class="ap-info"><LinkIcon v-if="settings.showLinkIcons" name="website" class="ap-entry-icon" />Website: {{ personalInfo.websiteLabel || personalInfo.website }}</div>
        <div v-if="personalInfo.github" class="ap-info"><LinkIcon v-if="settings.showLinkIcons" name="github" class="ap-entry-icon" />GitHub: {{ personalInfo.githubLabel || personalInfo.github }}</div>
        <div v-if="personalInfo.scholar" class="ap-info"><LinkIcon v-if="settings.showLinkIcons" name="website" class="ap-entry-icon" />Scholar: {{ personalInfo.scholar }}</div>
        <div v-for="(link, i) in customLinkEntries" :key="i" class="ap-info">
          <LinkIcon v-if="settings.showLinkIcons" :name="link.icon" class="ap-entry-icon" /><a :href="link.href" target="_blank" rel="noopener" class="ap-clink">{{ link.label }}</a>
        </div>
      </div>
    </section>

    <!-- Positions -->
    <section v-if="enabled.experience && experience.length" class="ap-section" :style="{ order: ord('experience') }">
      <div class="ap-label">Positions</div>
      <div class="ap-content">
        <div v-for="exp in resumeStore.sortedExperience" :key="exp.id" class="ap-entry print-avoid-break">
          <div class="ap-row">
            <span class="ap-strong"><a v-if="exp.url" :href="formatUrl(exp.url)" class="doc-link" target="_blank" rel="noopener">{{ exp.company || exp.title }}</a><template v-else>{{ exp.company || exp.title }}</template></span>
            <span class="ap-date">{{ dateRange(exp.startDate, exp.endDate, exp.current) }}</span>
          </div>
          <div class="ap-italic">{{ exp.title }}<span v-if="exp.location" class="ap-muted"> - {{ exp.location }}</span></div>
          <p v-if="exp.description" class="ap-desc">{{ exp.description }}</p>
        </div>
      </div>
    </section>

    <!-- Education -->
    <section v-if="enabled.education && education.length" class="ap-section" :style="{ order: ord('education') }">
      <div class="ap-label">Education</div>
      <div class="ap-content">
        <div v-for="edu in education" :key="edu.id" class="ap-entry print-avoid-break">
          <div class="ap-row">
            <span class="ap-strong"><a v-if="edu.url" :href="formatUrl(edu.url)" class="doc-link" target="_blank" rel="noopener">{{ edu.institution }}</a><template v-else>{{ edu.institution }}</template></span>
            <span class="ap-date">{{ dateRange(edu.startDate, edu.endDate) }}</span>
          </div>
          <div class="ap-italic">{{ edu.degree }}<span v-if="edu.gpa" class="ap-muted"> - GPA: {{ edu.gpa }}</span></div>
          <div v-if="edu.thesis" class="ap-meta">Thesis: {{ edu.thesis }}</div>
          <div v-if="edu.advisor" class="ap-meta">Advisor: {{ edu.advisor }}</div>
        </div>
      </div>
    </section>

    <!-- Publications -->
    <section v-if="enabled.publications && publications.length" class="ap-section" :style="{ order: ord('publications') }">
      <div class="ap-label">Publications</div>
      <div class="ap-content">
        <div v-for="(pub, i) in publications" :key="pub.id" class="ap-pub print-avoid-break">
          <div class="ap-pub-head">
            <span class="ap-num">[{{ i + 1 }}]</span>
            <div class="ap-pub-body">
              <div class="ap-pub-title">{{ pub.title }}</div>
              <div class="ap-pub-authors">
                <span v-for="(seg, j) in authorSegments(pub.authors)" :key="j" :class="{ 'ap-self': seg.self }">{{ seg.text }}</span>
              </div>
              <div class="ap-pub-venue">
                {{ pub.venue }}<span v-if="pub.year">, {{ pub.year }}</span>
                <span v-if="pub.award" class="ap-award"> {{ pub.award }}</span>
                <span v-if="pub.url" class="ap-link"> [{{ pub.url }}]</span>
              </div>
              <p v-if="pub.summary" class="ap-tldr"><span class="ap-tldr-label">tl;dr:</span> {{ pub.summary }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Teaching -->
    <section v-if="enabled.teaching && teaching.length" class="ap-section print-avoid-break" :style="{ order: ord('teaching') }">
      <div class="ap-label">Teaching</div>
      <div class="ap-content">
        <div v-for="t in teaching" :key="t.id" class="ap-entry">
          <div class="ap-row">
            <span class="ap-strong">{{ t.course }}</span>
            <span class="ap-date">{{ t.term }}</span>
          </div>
          <div v-if="t.institution" class="ap-italic">{{ t.institution }}</div>
        </div>
      </div>
    </section>

    <!-- Invited Talks -->
    <section v-if="enabled.talks && talks.length" class="ap-section print-avoid-break" :style="{ order: ord('talks') }">
      <div class="ap-label">Invited Talks</div>
      <div class="ap-content">
        <div v-for="(t, i) in talks" :key="t.id" class="ap-entry">
          <div class="ap-row">
            <span><span class="ap-num">[{{ i + 1 }}]</span> {{ t.title }}<span v-if="t.event" class="ap-muted"> - {{ t.event }}</span></span>
            <span class="ap-date">{{ t.date }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Honors & Awards -->
    <section v-if="enabled.awards && awards.length" class="ap-section print-avoid-break" :style="{ order: ord('awards') }">
      <div class="ap-label">Honors &amp; Awards</div>
      <div class="ap-content">
        <div v-for="a in awards" :key="a.id" class="ap-entry">
          <div class="ap-row">
            <span class="ap-strong">{{ a.title }}</span>
            <span class="ap-date">{{ a.year }}</span>
          </div>
          <p v-if="a.description" class="ap-desc">{{ a.description }}</p>
        </div>
      </div>
    </section>

    <!-- Service -->
    <section v-if="enabled.service && service.length" class="ap-section print-avoid-break" :style="{ order: ord('service') }">
      <div class="ap-label">Service</div>
      <div class="ap-content">
        <div v-for="s in service" :key="s.id" class="ap-entry">
          <div class="ap-row">
            <span>{{ s.role }}</span>
            <span class="ap-date">{{ s.year }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills -->
    <section v-if="enabled.skills && skills.length" class="ap-section print-avoid-break" :style="{ order: ord('skills') }">
      <div class="ap-label">Skills</div>
      <div class="ap-content">
        <div v-for="(list, cat) in resumeStore.skillsByCategory" :key="cat" class="ap-entry">
          <span class="ap-strong">{{ cat }}:</span> {{ list.map(s => s.name).join(', ') }}
        </div>
      </div>
    </section>

    <!-- References -->
    <section v-if="enabled.references && references.length" class="ap-section print-avoid-break" :style="{ order: ord('references') }">
      <div class="ap-label">References</div>
      <div class="ap-content">
        <div v-for="r in references" :key="r.id" class="ap-entry">
          <div class="ap-strong">{{ r.name }}</div>
          <div v-if="r.title" class="ap-italic">{{ r.title }}<span v-if="r.organization">, {{ r.organization }}</span></div>
          <div v-if="r.email" class="ap-meta">{{ r.email }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import LinkIcon from '../LinkIcon.vue'
import { iconKeyFor } from '../../utils/linkIcons'
import { useResumeTemplate } from '../../composables/useResumeTemplate'

export default {
  name: 'AcademicPortfolioTemplate',
  components: { LinkIcon },
  setup() {
    const shared = useResumeTemplate()
    // Portfolio overrides these locally (fixed serif font, en-dash date ranges),
    // so drop the shared versions to prevent them shadowing the locals.
    delete shared.templateStyles
    delete shared.dateRange
    return shared
  },
  computed: {
    templateStyles() {
      const c = this.settings.colorScheme
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
    customLinkEntries() {
      return (this.resumeStore.customLinks || [])
        .filter(l => l && l.url)
        .map(l => ({ label: l.label || l.url, href: this.formatUrl(l.url), icon: iconKeyFor(l.label, l.url) }))
    }
  },
  methods: {
    // Portfolio uses en-dash date ranges (differs from the shared hyphen version).
    dateRange(start, end, current = false) {
      const s = this.formatDate(start)
      const e = current ? 'Present' : this.formatDate(end)
      if (s && e) return `${s} – ${e}`
      return s || e || ''
    },
    authorSegments(authors) {
      const name = (this.resumeStore.fullName || '').trim()
      if (!name || !authors) return [{ text: authors || '', self: false }]
      const segs = []
      let rest = authors
      let idx = rest.indexOf(name)
      while (idx !== -1) {
        if (idx > 0) segs.push({ text: rest.slice(0, idx), self: false })
        segs.push({ text: name, self: true })
        rest = rest.slice(idx + name.length)
        idx = rest.indexOf(name)
      }
      if (rest) segs.push({ text: rest, self: false })
      return segs
    }
  }
}
</script>

<style scoped src="./AcademicPortfolioTemplate.css"></style>
