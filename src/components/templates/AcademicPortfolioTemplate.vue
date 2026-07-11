<template>
  <div class="ap-cv" :style="templateStyles">
    <!-- Header -->
    <header class="ap-header">
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
        <div v-if="personalInfo.website" class="ap-info"><LinkIcon v-if="settings.showLinkIcons" name="website" class="ap-entry-icon" />Website: {{ personalInfo.website }}</div>
        <div v-if="personalInfo.github" class="ap-info"><LinkIcon v-if="settings.showLinkIcons" name="github" class="ap-entry-icon" />GitHub: {{ personalInfo.github }}</div>
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
            <span class="ap-strong">{{ exp.company || exp.title }}</span>
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
            <span class="ap-strong">{{ edu.institution }}</span>
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
import { useResumeStore } from '../../stores/resume'
import { storeToRefs } from 'pinia'
import { format, parseISO } from 'date-fns'
import LinkIcon from '../LinkIcon.vue'
import { iconKeyFor } from '../../utils/linkIcons'

export default {
  name: 'AcademicPortfolioTemplate',
  components: { LinkIcon },
  setup() {
    const resumeStore = useResumeStore()
    const {
      personalInfo, skills, experience, education, languages,
      publications, teaching, talks, awards, service, references, settings
    } = storeToRefs(resumeStore)
    return {
      resumeStore, personalInfo, skills, experience, education, languages,
      publications, teaching, talks, awards, service, references, settings
    }
  },
  computed: {
    templateStyles() {
      const c = this.settings.colorScheme
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
    customLinkEntries() {
      return (this.resumeStore.customLinks || [])
        .filter(l => l && l.label && l.url)
        .map(l => ({ label: l.label, href: this.formatUrl(l.url), icon: iconKeyFor(l.label, l.url) }))
    }
  },
  methods: {
    ord(key) {
      const i = this.settings.sectionsOrder.indexOf(key)
      return i === -1 ? 99 : i
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

<style scoped>
.ap-cv {
  --primary: #1d4ed8;
  --text: #1a1a1a;
  --background: #ffffff;

  font-family: 'Palatino Linotype', Palatino, Georgia, 'Times New Roman', serif;
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 44px 50px;
  background: var(--background);
  color: var(--text);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  line-height: 1.4;
  /* Sections are ordered via CSS `order` from settings.sectionsOrder. */
  display: flex;
  flex-direction: column;
}

.ap-header {
  order: -1;
  border-bottom: 1.5px solid #111;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.ap-name {
  font-size: 2.2rem;
  font-weight: 400;
  line-height: 1.1;
}

.ap-tagline {
  margin-top: 6px;
  font-size: 0.9em;
  color: #333;
}

.ap-interests {
  margin-top: 6px;
  font-size: 0.9em;
  color: #333;
}

.ap-clink {
  color: var(--primary);
  text-decoration: none;
}

.ap-entry-icon {
  margin-right: 0.3em;
}

.ap-interests-label {
  font-weight: 700;
}

/* Section = left-margin small-caps label + content column */
.ap-section {
  display: grid;
  grid-template-columns: 132px 1fr;
  gap: 20px;
  margin-bottom: 16px;
}

.ap-label {
  font-variant: small-caps;
  letter-spacing: 0.04em;
  font-size: 0.86em;
  color: #6b7280;
  padding-top: 2px;
  line-height: 1.3;
}

.ap-content {
  min-width: 0;
}

.ap-entry,
.ap-pub {
  margin-bottom: 10px;
}

.ap-entry:last-child,
.ap-pub:last-child {
  margin-bottom: 0;
}

.ap-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
}

.ap-strong {
  font-weight: 700;
}

.ap-italic {
  font-style: italic;
  font-size: 0.95em;
  color: #333;
}

.ap-muted {
  color: #6b7280;
  font-style: normal;
}

.ap-date {
  flex-shrink: 0;
  font-size: 0.85em;
  color: #4b5563;
  white-space: nowrap;
}

.ap-meta {
  font-size: 0.88em;
  color: #4b5563;
}

.ap-desc {
  font-size: 0.9em;
  color: #374151;
  margin-top: 2px;
}

.ap-info {
  font-size: 0.92em;
  overflow-wrap: anywhere;
}

/* Publications */
.ap-pub-head {
  display: flex;
  gap: 8px;
}

.ap-num {
  color: #6b7280;
  flex-shrink: 0;
}

.ap-pub-body {
  min-width: 0;
}

.ap-pub-title {
  font-weight: 700;
}

.ap-pub-authors {
  font-size: 0.92em;
  font-style: italic;
  color: #374151;
}

.ap-self {
  font-weight: 700;
  font-style: normal;
  color: #111;
}

.ap-pub-venue {
  font-size: 0.9em;
  color: #4b5563;
  overflow-wrap: anywhere;
}

.ap-award {
  color: var(--primary);
  font-weight: 700;
  margin-left: 6px;
}

.ap-link {
  color: var(--primary);
  margin-left: 6px;
}

.ap-tldr {
  font-size: 0.88em;
  color: #374151;
  margin-top: 2px;
}

.ap-tldr-label {
  font-weight: 700;
}

/* html2canvas compensation */
.pdf-export .ap-label {
  padding-top: 4px;
}

@media print {
  .ap-cv {
    box-shadow: none;
    max-width: none;
    margin: 0;
  }
  .print-avoid-break {
    page-break-inside: avoid;
  }
}

@media (max-width: 768px) {
  .ap-cv {
    max-width: 100%;
    padding: 24px 18px;
    box-shadow: none;
  }
  .ap-name {
    font-size: 1.7rem;
  }
  .ap-section {
    grid-template-columns: 96px 1fr;
    gap: 12px;
  }
  .ap-label {
    font-size: 0.78em;
  }
}
</style>
