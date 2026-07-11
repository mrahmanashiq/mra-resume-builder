<template>
  <div class="rc-cv" :style="templateStyles">
    <!-- Header -->
    <header class="rc-header">
      <h1 class="rc-name">{{ resumeStore.fullName }}</h1>
      <div v-if="personalInfo.headerTagline" class="rc-tagline">{{ personalInfo.headerTagline }}</div>
      <div v-if="personalInfo.researchInterests" class="rc-interests">
        {{ personalInfo.researchInterests }}
      </div>
      <div class="rc-contact">
        <span v-for="(item, i) in contactItems" :key="i">
          <span v-if="i > 0" class="rc-dot">·</span><LinkIcon v-if="settings.showLinkIcons" :name="item.icon" class="rc-entry-icon" />{{ item.text }}
        </span>
        <template v-for="(link, i) in customLinkEntries" :key="'cl' + i">
          <span v-if="contactItems.length || i > 0" class="rc-dot">·</span><LinkIcon v-if="settings.showLinkIcons" :name="link.icon" class="rc-entry-icon" /><a :href="link.href" target="_blank" rel="noopener" class="rc-clink">{{ link.label }}</a>
        </template>
      </div>
    </header>

    <!-- Research Experience -->
    <section v-if="enabled.experience && experience.length" class="rc-section" :style="{ order: ord('experience') }">
      <h2 class="rc-heading">Research Experience</h2>
      <div v-for="exp in resumeStore.sortedExperience" :key="exp.id" class="rc-entry print-avoid-break">
        <div class="rc-row">
          <span class="rc-title">{{ exp.company || exp.title }}</span>
          <span class="rc-date">{{ dateRange(exp.startDate, exp.endDate, exp.current) }}</span>
        </div>
        <div class="rc-sub">
          {{ exp.title }}<span v-if="exp.location"> - {{ exp.location }}</span>
        </div>
        <p v-if="exp.description" class="rc-desc">{{ exp.description }}</p>
      </div>
    </section>

    <!-- Education -->
    <section v-if="enabled.education && education.length" class="rc-section" :style="{ order: ord('education') }">
      <h2 class="rc-heading">Education</h2>
      <div v-for="edu in education" :key="edu.id" class="rc-entry print-avoid-break">
        <div class="rc-row">
          <span class="rc-title">{{ edu.institution }}</span>
          <span class="rc-date">{{ dateRange(edu.startDate, edu.endDate) }}</span>
        </div>
        <div class="rc-sub">{{ edu.degree }}<span v-if="edu.gpa"> - GPA: {{ edu.gpa }}</span></div>
        <div v-if="edu.thesis" class="rc-meta">Thesis: {{ edu.thesis }}</div>
        <div v-if="edu.advisor" class="rc-meta">Advisor: {{ edu.advisor }}</div>
        <p v-if="edu.description" class="rc-desc">{{ edu.description }}</p>
      </div>
    </section>

    <!-- Publications -->
    <section v-if="enabled.publications && publications.length" class="rc-section" :style="{ order: ord('publications') }">
      <h2 class="rc-heading">Publications</h2>
      <div v-for="pub in publications" :key="pub.id" class="rc-pub print-avoid-break">
        <div class="rc-pub-title">{{ pub.title }}</div>
        <div class="rc-pub-authors">
          <span v-for="(seg, i) in authorSegments(pub.authors)" :key="i" :class="{ 'rc-self': seg.self }">{{ seg.text }}</span>
        </div>
        <div class="rc-row rc-pub-venue">
          <span class="rc-venue">{{ pub.venue }}<span v-if="pub.url" class="rc-link"> · {{ pub.url }}</span></span>
          <span class="rc-date">{{ pub.year }}</span>
        </div>
        <div v-if="pub.award" class="rc-chip">{{ pub.award }}</div>
      </div>
    </section>

    <!-- Teaching -->
    <section v-if="enabled.teaching && teaching.length" class="rc-section print-avoid-break" :style="{ order: ord('teaching') }">
      <h2 class="rc-heading">Teaching</h2>
      <div v-for="t in teaching" :key="t.id" class="rc-entry">
        <div class="rc-row">
          <span class="rc-title">{{ t.course }}</span>
          <span class="rc-date">{{ t.term }}</span>
        </div>
        <div v-if="t.institution" class="rc-sub">{{ t.institution }}</div>
      </div>
    </section>

    <!-- Honors & Awards -->
    <section v-if="enabled.awards && awards.length" class="rc-section print-avoid-break" :style="{ order: ord('awards') }">
      <h2 class="rc-heading">Honors &amp; Awards</h2>
      <div v-for="a in awards" :key="a.id" class="rc-line">
        <div class="rc-row">
          <span class="rc-line-main"><span class="rc-bullet">•</span>{{ a.title }}</span>
          <span class="rc-date">{{ a.year }}</span>
        </div>
        <p v-if="a.description" class="rc-desc rc-indent">{{ a.description }}</p>
      </div>
    </section>

    <!-- Academic Service -->
    <section v-if="enabled.service && service.length" class="rc-section print-avoid-break" :style="{ order: ord('service') }">
      <h2 class="rc-heading">Academic Service</h2>
      <div v-for="s in service" :key="s.id" class="rc-line">
        <div class="rc-row">
          <span class="rc-line-main"><span class="rc-bullet">•</span>{{ s.role }}</span>
          <span class="rc-date">{{ s.year }}</span>
        </div>
      </div>
    </section>

    <!-- Invited Talks -->
    <section v-if="enabled.talks && talks.length" class="rc-section print-avoid-break" :style="{ order: ord('talks') }">
      <h2 class="rc-heading">Invited Talks</h2>
      <div v-for="t in talks" :key="t.id" class="rc-line">
        <div class="rc-row">
          <span class="rc-line-main"><span class="rc-bullet">•</span>{{ t.title }}<span v-if="t.event" class="rc-line-sub"> - {{ t.event }}</span></span>
          <span class="rc-date">{{ t.date }}</span>
        </div>
      </div>
    </section>

    <!-- Skills -->
    <section v-if="enabled.skills && skills.length" class="rc-section print-avoid-break" :style="{ order: ord('skills') }">
      <h2 class="rc-heading">Skills</h2>
      <div class="rc-skill-grid">
        <template v-for="(list, cat) in resumeStore.skillsByCategory" :key="cat">
          <div class="rc-skill-cat">{{ cat }}</div>
          <div>{{ list.map(s => s.name).join(', ') }}</div>
        </template>
      </div>
    </section>

    <!-- Languages -->
    <section v-if="enabled.languages && languages.length" class="rc-section print-avoid-break" :style="{ order: ord('languages') }">
      <h2 class="rc-heading">Languages</h2>
      <div class="rc-lang">{{ languages.map(l => `${l.name} (${l.level})`).join('  ·  ') }}</div>
    </section>

    <!-- References -->
    <section v-if="enabled.references && references.length" class="rc-section print-avoid-break" :style="{ order: ord('references') }">
      <h2 class="rc-heading">References</h2>
      <div class="rc-ref-grid">
        <div v-for="r in references" :key="r.id" class="rc-ref">
          <div class="rc-title">{{ r.name }}</div>
          <div v-if="r.title" class="rc-sub">{{ r.title }}</div>
          <div v-if="r.organization" class="rc-meta">{{ r.organization }}</div>
          <div v-if="r.email" class="rc-meta">{{ r.email }}</div>
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
  name: 'ResearcherCvTemplate',
  components: { LinkIcon },
  setup() {
    const resumeStore = useResumeStore()
    const {
      personalInfo, skills, experience, education, projects, certifications, languages,
      publications, teaching, talks, awards, service, references, settings
    } = storeToRefs(resumeStore)
    return {
      resumeStore, personalInfo, skills, experience, education, projects, certifications,
      languages, publications, teaching, talks, awards, service, references, settings
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
    contactItems() {
      const p = this.personalInfo
      const out = []
      if (p.website) out.push({ text: p.website, icon: 'website' })
      if (p.email) out.push({ text: p.email, icon: 'email' })
      if (p.phone) out.push({ text: p.phone, icon: 'phone' })
      if (p.github) out.push({ text: p.github, icon: 'github' })
      if (p.linkedin) out.push({ text: p.linkedin, icon: 'linkedin' })
      if (p.scholar) out.push({ text: p.scholar, icon: 'website' })
      return out
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
.rc-cv {
  --primary: #1f2937;
  --text: #1a1a1a;
  --background: #ffffff;

  font-family: Georgia, 'Times New Roman', Cambria, serif;
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

.rc-header {
  order: -1;
  margin-bottom: 22px;
}

.rc-name {
  font-size: 2.1rem;
  font-weight: 400;
  letter-spacing: 0.01em;
  line-height: 1.1;
}

.rc-tagline {
  margin-top: 4px;
  font-size: 0.9em;
  color: #444;
}

.rc-interests {
  margin-top: 6px;
  font-size: 0.92em;
  color: #444;
}

.rc-clink {
  color: var(--primary);
  text-decoration: none;
}

.rc-entry-icon {
  margin-right: 0.3em;
}

.rc-contact {
  margin-top: 6px;
  font-size: 0.86em;
  color: var(--primary);
  overflow-wrap: anywhere;
}

.rc-dot {
  margin: 0 7px;
  color: #9ca3af;
}

.rc-section {
  margin-bottom: 18px;
}

.rc-heading {
  font-size: 1.28em;
  font-weight: 400;
  color: #111;
  border-bottom: 1px solid #d1d5db;
  padding-bottom: 3px;
  margin-bottom: 10px;
}

.rc-entry,
.rc-pub,
.rc-line {
  margin-bottom: 9px;
}

.rc-entry:last-child,
.rc-pub:last-child,
.rc-line:last-child {
  margin-bottom: 0;
}

.rc-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
}

.rc-title {
  font-weight: 700;
}

.rc-date {
  flex-shrink: 0;
  font-size: 0.85em;
  color: #4b5563;
  white-space: nowrap;
}

.rc-sub {
  font-size: 0.95em;
}

.rc-meta {
  font-size: 0.88em;
  color: #4b5563;
}

.rc-desc {
  font-size: 0.9em;
  color: #374151;
  margin-top: 2px;
}

.rc-indent {
  padding-left: 14px;
}

/* Publications */
.rc-pub-title {
  font-weight: 600;
}

.rc-pub-authors {
  font-size: 0.92em;
  color: #374151;
}

.rc-self {
  font-weight: 700;
  color: #111;
}

.rc-pub-venue {
  font-size: 0.9em;
}

.rc-venue {
  font-style: italic;
  color: #4b5563;
}

.rc-link {
  font-style: normal;
  color: var(--primary);
  overflow-wrap: anywhere;
}

.rc-chip {
  display: inline-block;
  margin-top: 3px;
  padding: 1px 8px;
  border-radius: 3px;
  background: #fdf2c7;
  color: #7c5e10;
  font-size: 0.78em;
  font-weight: 600;
}

/* Bulleted lists (awards, service, talks) */
.rc-line-main {
  padding-right: 8px;
}

.rc-bullet {
  color: #6b7280;
  margin-right: 8px;
}

.rc-line-sub {
  color: #4b5563;
}

.rc-skill-grid {
  display: grid;
  grid-template-columns: 140px 1fr;
  row-gap: 5px;
  column-gap: 14px;
  font-size: 0.95em;
}

.rc-skill-cat {
  font-weight: 700;
}

.rc-lang {
  font-size: 0.95em;
}

.rc-ref-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 24px;
}

.rc-ref .rc-title {
  font-size: 0.98em;
}

/* html2canvas draws text lower than the browser; give headings room on capture */
.pdf-export .rc-heading {
  padding-bottom: 7px;
}

@media print {
  .rc-cv {
    box-shadow: none;
    max-width: none;
    margin: 0;
  }
  .print-avoid-break {
    page-break-inside: avoid;
  }
}

@media (max-width: 768px) {
  .rc-cv {
    max-width: 100%;
    padding: 24px 18px;
    box-shadow: none;
  }
  .rc-name {
    font-size: 1.7rem;
  }
  .rc-ref-grid {
    grid-template-columns: 1fr;
  }
  .rc-skill-grid {
    grid-template-columns: 110px 1fr;
  }
}
</style>
