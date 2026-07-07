<template>
  <div class="biodata-template classic" :style="templateStyles">
    <div class="classic-outer">
      <div class="classic-inner">

        <!-- Header -->
        <div class="classic-header">
          <div v-if="settings.showBismillah"
               class="classic-bismillah"
               :class="{ 'bismillah-arabic': settings.bismillahStyle === 'arabic' }">
            {{ bismillahText }}
          </div>
          <div class="classic-rule"></div>
          <h1 class="classic-title">{{ displayTitle }}</h1>
          <div class="classic-rule"></div>
        </div>

        <!-- Photo (centered under the title) -->
        <div v-if="settings.showPhoto && personalInfo.photo" class="classic-photo-wrap">
          <img class="classic-photo" :src="personalInfo.photo" alt="Photo">
        </div>

        <template v-for="sectionId in orderedSections" :key="sectionId">
          <!-- Personal Information -->
          <section v-if="sectionId === 'personalInfo'" class="classic-section print-avoid-break">
            <h2 class="sec-title">Personal Information</h2>
            <div class="sec-body">
              <div class="c-info">
                <template v-for="row in personalRows" :key="row.label">
                  <template v-if="row.value">
                    <div class="c-key">{{ row.label }}</div>
                    <div class="c-colon">:</div>
                    <div class="c-val">{{ row.value }}</div>
                  </template>
                </template>
              </div>
            </div>
          </section>

          <!-- Hobbies & Habits -->
          <section v-else-if="sectionId === 'lifestyle' && hasLifestyle" class="classic-section print-avoid-break">
            <h2 class="sec-title">Hobbies &amp; Habits</h2>
            <div class="sec-body">
              <div class="c-info">
                <template v-if="lifestyle.hobby">
                  <div class="c-key">Hobby / Interests</div>
                  <div class="c-colon">:</div>
                  <div class="c-val">{{ lifestyle.hobby }}</div>
                </template>
                <template v-if="lifestyle.smoking">
                  <div class="c-key">Smoking</div>
                  <div class="c-colon">:</div>
                  <div class="c-val">{{ lifestyle.smoking }}</div>
                </template>
                <template v-if="lifestyle.drinking">
                  <div class="c-key">Drinking</div>
                  <div class="c-colon">:</div>
                  <div class="c-val">{{ lifestyle.drinking }}</div>
                </template>
              </div>
            </div>
          </section>

          <!-- Educational Qualification -->
          <section v-else-if="sectionId === 'education' && education.length" class="classic-section print-avoid-break">
            <h2 class="sec-title">Educational Qualification</h2>
            <div class="sec-body">
              <div v-for="row in education" :key="row.id" class="edu-item">
                <div class="edu-row">
                  <span class="edu-degree">{{ row.degree }}</span>
                  <span v-if="row.year" class="edu-year">{{ row.year }}</span>
                </div>
                <div class="edu-row edu-row-sub">
                  <span class="edu-institute">{{ row.institute }}</span>
                  <span v-if="row.result" class="edu-result">{{ row.result }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Professional Details -->
          <section v-else-if="sectionId === 'professional' && hasProfessional" class="classic-section print-avoid-break">
            <h2 class="sec-title">Professional Details</h2>
            <div class="sec-body">
              <div v-for="exp in professionalExperiences" :key="exp.id" class="exp-item">
                <div class="exp-row">
                  <span class="exp-company">{{ exp.company }}</span>
                  <template v-if="exp.position"><span class="exp-sep"> - </span><span class="exp-position">{{ exp.position }}</span></template>
                </div>
                <div v-if="expMeta(exp)" class="exp-meta">{{ expMeta(exp) }}</div>
              </div>
              <div v-if="settings.fieldsEnabled.income && professional.income" class="c-info income-row">
                <div class="c-key">Monthly Income</div>
                <div class="c-colon">:</div>
                <div class="c-val">{{ professional.income }}</div>
              </div>
            </div>
          </section>

          <!-- Family Information -->
          <section v-else-if="sectionId === 'family'" class="classic-section print-avoid-break">
            <h2 class="sec-title">Family Information</h2>
            <div class="sec-body">
              <div class="c-parents">
                <div class="c-parent">
                  <div class="c-subhead">Father</div>
                  <div class="c-info-sm">
                    <template v-if="family.father.name">
                      <div class="c-key">Name</div><div class="c-colon">:</div>
                      <div class="c-val c-strong">{{ family.father.name }}</div>
                    </template>
                    <template v-if="family.father.profession">
                      <div class="c-key">Profession</div><div class="c-colon">:</div>
                      <div class="c-val">{{ family.father.profession }}</div>
                    </template>
                    <template v-if="family.father.education">
                      <div class="c-key">Education</div><div class="c-colon">:</div>
                      <div class="c-val">{{ family.father.education }}</div>
                    </template>
                    <template v-if="family.father.phone">
                      <div class="c-key">Contact</div><div class="c-colon">:</div>
                      <div class="c-val">{{ family.father.phone }}</div>
                    </template>
                  </div>
                </div>

                <div class="c-parent">
                  <div class="c-subhead">Mother</div>
                  <div class="c-info-sm">
                    <template v-if="family.mother.name">
                      <div class="c-key">Name</div><div class="c-colon">:</div>
                      <div class="c-val c-strong">{{ family.mother.name }}</div>
                    </template>
                    <template v-if="family.mother.profession">
                      <div class="c-key">Profession</div><div class="c-colon">:</div>
                      <div class="c-val">{{ family.mother.profession }}</div>
                    </template>
                    <template v-if="family.mother.education">
                      <div class="c-key">Education</div><div class="c-colon">:</div>
                      <div class="c-val">{{ family.mother.education }}</div>
                    </template>
                    <template v-if="family.mother.phone">
                      <div class="c-key">Contact</div><div class="c-colon">:</div>
                      <div class="c-val">{{ family.mother.phone }}</div>
                    </template>
                  </div>
                </div>
              </div>

              <!-- Siblings -->
              <div v-if="settings.fieldsEnabled.siblings" class="family-block">
                <div class="c-subhead center">Siblings</div>
                <ul v-if="family.siblings.length" class="family-list">
                  <li v-for="sib in family.siblings" :key="sib.id">
                    <span class="fam-bullet">•</span>
                    <span class="family-name">{{ sib.name }}</span>
                    <span v-if="sib.relation" class="family-meta"> - {{ sib.relation }}</span>
                    <span v-if="sib.occupation" class="family-meta">, {{ sib.occupation }}</span>
                    <span v-if="sib.maritalStatus" class="family-meta"> ({{ sib.maritalStatus }})</span>
                  </li>
                </ul>
                <div v-else class="sibling-none">None</div>
              </div>

              <!-- Uncles -->
              <div v-if="family.paternalUncles.length || family.maternalUncles.length" class="uncles-grid">
                <div v-if="family.paternalUncles.length">
                  <div class="c-subhead">Uncles (Chacha)</div>
                  <ul class="family-list">
                    <li v-for="u in family.paternalUncles" :key="u.id">
                      <span class="fam-bullet">•</span>
                      <span class="family-name">{{ u.name }}</span>
                      <span v-if="u.occupation" class="family-meta"> - {{ u.occupation }}</span>
                      <span v-if="u.location" class="family-meta"> - {{ u.location }}</span>
                    </li>
                  </ul>
                </div>
                <div v-if="family.maternalUncles.length">
                  <div class="c-subhead">Uncles (Mama)</div>
                  <ul class="family-list">
                    <li v-for="u in family.maternalUncles" :key="u.id">
                      <span class="fam-bullet">•</span>
                      <span class="family-name">{{ u.name }}</span>
                      <span v-if="u.occupation" class="family-meta"> - {{ u.occupation }}</span>
                      <span v-if="u.location" class="family-meta"> - {{ u.location }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div v-if="settings.fieldsEnabled.homeDistrict && family.homeDistrict" class="c-info home-district">
                <div class="c-key">Home District</div>
                <div class="c-colon">:</div>
                <div class="c-val">{{ family.homeDistrict }}</div>
              </div>
            </div>
          </section>

          <!-- Contact (rendered as its own centered section) -->
          <section v-else-if="sectionId === 'contact' && hasContact" class="classic-section print-avoid-break">
            <h2 class="sec-title">Contact Information</h2>
            <div class="sec-body">
              <div class="c-info">
                <template v-for="row in contactRows" :key="row.label">
                  <div class="c-key">{{ row.label }}</div>
                  <div class="c-colon">:</div>
                  <div class="c-val">{{ row.value }}</div>
                </template>
              </div>
            </div>
          </section>

          <!-- Partner Preferences -->
          <section v-else-if="sectionId === 'preferences' && hasPreferences" class="classic-section print-avoid-break">
            <h2 class="sec-title">Partner Preferences</h2>
            <div class="sec-body">
              <div v-if="preferredBloodGroupsText" class="c-info">
                <div class="c-key">Preferred Blood Group</div>
                <div class="c-colon">:</div>
                <div class="c-val">{{ preferredBloodGroupsText }}</div>
              </div>
              <p v-if="preferences.expectations" class="pref-text">{{ preferences.expectations }}</p>
            </div>
          </section>
        </template>

      </div>
    </div>
  </div>
</template>

<script>
import { useBiodataStore } from '../../../stores/biodata'
import { storeToRefs } from 'pinia'
import { format, parseISO } from 'date-fns'

export default {
  name: 'ClassicBiodataTemplate',
  setup() {
    const biodataStore = useBiodataStore()
    const { personalInfo, lifestyle, education, professional, family, contact, preferences, settings } =
      storeToRefs(biodataStore)
    return { personalInfo, lifestyle, education, professional, family, contact, preferences, settings }
  },
  computed: {
    templateStyles() {
      const colors = this.settings.colorScheme
      return {
        '--primary': colors.primary,
        '--secondary': colors.secondary,
        '--accent': colors.accent,
        '--text': colors.text,
        '--background': colors.background,
        fontSize: `${this.settings.fontSize}px`,
        fontFamily: this.settings.font
      }
    },
    orderedSections() {
      return this.settings.sectionsOrder.filter(id => this.settings.sectionsEnabled[id])
    },
    bismillahText() {
      return this.settings.bismillahStyle === 'arabic'
        ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'
        : 'বিসমিল্লাহির রাহমানির রাহিম'
    },
    displayTitle() {
      const full = (this.personalInfo.fullName || '').trim()
      const parts = full.split(/\s+/).filter(Boolean)
      const firstName = parts[0] || ''
      const lastName = parts.length > 1 ? parts[parts.length - 1] : ''
      const rendered = (this.settings.title || 'Marriage Biodata')
        .replace(/\{firstName\}/gi, firstName)
        .replace(/\{lastName\}/gi, lastName)
        .replace(/\{name\}/gi, full)
        .replace(/\s{2,}/g, ' ')
        .trim()
      return rendered || 'Marriage Biodata'
    },
    contactRows() {
      const c = this.contact
      const f = this.settings.fieldsEnabled
      const rows = []
      if (c.phone) rows.push({ label: 'Phone', value: c.phone })
      if (f.guardianPhone && c.guardianPhone) rows.push({ label: 'Guardian', value: c.guardianPhone })
      if (f.email && c.email) rows.push({ label: 'Email', value: c.email })
      if (f.website && c.website) rows.push({ label: 'Website', value: c.website })
      if (f.facebook && c.facebook) rows.push({ label: 'Facebook', value: c.facebook })
      if (f.instagram && c.instagram) rows.push({ label: 'Instagram', value: c.instagram })
      if (f.linkedin && c.linkedin) rows.push({ label: 'LinkedIn', value: c.linkedin })
      return rows
    },
    hasContact() {
      return this.contactRows.length > 0
    },
    professionalExperiences() {
      return this.professional.experiences.filter(e => e.company || e.position)
    },
    hasProfessional() {
      return this.professionalExperiences.length > 0 ||
        (this.settings.fieldsEnabled.income && this.professional.income)
    },
    hasLifestyle() {
      const l = this.lifestyle
      return !!(l.hobby || l.smoking || l.drinking)
    },
    hasPreferences() {
      return !!(this.preferences.expectations || this.preferredBloodGroupsText)
    },
    preferredBloodGroupsText() {
      return (this.preferences.preferredBloodGroups || [])
        .map(bg => this.formatBloodGroup(bg))
        .join(', ')
    },
    personalRows() {
      const info = this.personalInfo
      const fields = this.settings.fieldsEnabled
      const rawWeight = (info.weight || '').toString().trim()
      const weightText = rawWeight ? (/^[\d.]+$/.test(rawWeight) ? `${rawWeight} kg` : rawWeight) : ''
      const ft = (info.heightFeet ?? '').toString().trim()
      const inch = (info.heightInches ?? '').toString().trim()
      const heightText = ft ? `${ft}'${inch || 0}"` : (inch ? `${inch}"` : '')
      const heightWeight = [heightText, weightText].filter(Boolean).join(' | ')
      const rows = [
        { label: 'Full Name', value: info.fullName },
        { label: 'Date of Birth', value: info.dateOfBirth },
        { label: 'Height / Weight', value: heightWeight },
        { label: 'Complexion', value: info.complexion },
        { label: 'Blood Group', value: this.formatBloodGroup(info.bloodGroup) },
        { label: 'Religion', value: info.religion }
      ]
      if (fields.maritalStatus) rows.push({ label: 'Marital Status', value: info.maritalStatus })
      rows.push(
        { label: 'Present Address', value: info.presentAddress },
        { label: 'Permanent Address', value: info.permanentAddress }
      )
      if (fields.nationality) rows.push({ label: 'Nationality', value: info.nationality })
      if (fields.motherTongue) rows.push({ label: 'Mother Tongue', value: info.motherTongue })
      if (fields.sect) rows.push({ label: 'Sect / Madhab', value: info.sect })
      return rows
    }
  },
  methods: {
    formatMonth(value) {
      if (!value) return ''
      try {
        return format(parseISO(value + '-01'), 'MMM yyyy')
      } catch {
        return value
      }
    },
    expDates(exp) {
      const start = this.formatMonth(exp.startDate)
      const end = exp.current ? 'Present' : this.formatMonth(exp.endDate)
      if (start && end) return `${start} – ${end}`
      return start || end || ''
    },
    expMeta(exp) {
      return [exp.location, exp.type, this.expDates(exp)].filter(Boolean).join(' · ')
    },
    formatBloodGroup(bg) {
      if (!bg) return ''
      if (!this.settings.bloodGroupVe) return bg
      return bg.replace(/\+$/, ' (+ve)').replace(/-$/, ' (-ve)')
    }
  }
}
</script>

<style scoped>
.biodata-template.classic {
  --primary: #a61c3c;
  --secondary: #7a142c;
  --accent: #d4a017;
  --text: #1f2937;
  --background: #ffffff;

  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 16px;
  background: var(--background);
  color: var(--text);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

/* Double frame */
.classic-outer {
  border: 3px solid var(--primary);
  padding: 6px;
  min-height: calc(297mm - 32px);
  box-sizing: border-box;
}

.classic-inner {
  border: 1px solid var(--accent);
  padding: 30px 36px 40px;
  height: 100%;
  box-sizing: border-box;
}

/* Header */
.classic-header {
  text-align: center;
  margin-bottom: 22px;
}

.classic-bismillah {
  color: #6b7280;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.bismillah-arabic {
  font-size: 1.5rem;
  direction: rtl;
  color: var(--primary);
}

.classic-rule {
  height: 2px;
  background: var(--primary);
  width: 70%;
  margin: 6px auto;
}

.classic-title {
  color: var(--primary);
  font-size: 1.7rem;
  font-weight: 800;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin: 6px 0;
}

/* Photo */
.classic-photo-wrap {
  text-align: center;
  margin-bottom: 24px;
}

.classic-photo {
  display: inline-block;
  max-width: 160px;
  max-height: 210px;
  width: auto;
  height: auto;
  border: 1px solid var(--primary);
  padding: 4px;
  border-radius: 3px;
}

/* Sections */
.classic-section {
  margin-bottom: 22px;
}

.sec-title {
  text-align: center;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--primary);
  font-size: 1.05em;
  padding-bottom: 6px;
  margin-bottom: 16px;
  border-bottom: 2px solid var(--accent);
}

.sec-body {
  max-width: 620px;
  margin: 0 auto;
}

/* Centered "label : value" grid */
.c-info {
  display: grid;
  grid-template-columns: 170px 12px 1fr;
  row-gap: 9px;
  column-gap: 6px;
}

.c-info-sm {
  display: grid;
  grid-template-columns: 90px 10px 1fr;
  row-gap: 7px;
  column-gap: 5px;
}

.c-key {
  text-align: right;
  font-weight: 600;
  color: #4b5563;
}

.c-colon {
  color: #9ca3af;
}

.c-val {
  color: var(--text);
}

.c-strong {
  font-weight: 700;
}

.income-row,
.home-district {
  margin-top: 14px;
}

/* Education */
.edu-item {
  padding: 6px 0;
  border-bottom: 1px dashed #d1d5db;
}

.edu-item:last-child {
  border-bottom: none;
}

.edu-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.edu-degree {
  font-weight: 700;
  color: var(--text);
}

.edu-year {
  color: #6b7280;
  font-size: 0.9em;
  flex-shrink: 0;
}

.edu-row-sub {
  margin-top: 2px;
}

.edu-institute {
  color: #4b5563;
}

.edu-result {
  color: #6b7280;
  font-size: 0.9em;
  flex-shrink: 0;
}

/* Professional */
.exp-item {
  padding: 5px 0;
}

.exp-row {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
}

.exp-company {
  font-weight: 700;
  color: var(--text);
}

.exp-sep {
  color: #9ca3af;
}

.exp-position {
  color: #4b5563;
}

.exp-meta {
  color: #6b7280;
  font-size: 0.9em;
  margin-top: 1px;
}

/* Family */
.c-parents {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
}

.c-subhead {
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 8px;
  padding-bottom: 3px;
  border-bottom: 1px solid #e5e7eb;
}

.c-subhead.center {
  text-align: center;
}

.family-block {
  margin-top: 18px;
}

.family-list {
  list-style: none;
  padding-left: 4px;
}

.fam-bullet {
  color: var(--primary);
  margin-right: 7px;
}

.family-name {
  font-weight: 700;
}

.family-meta {
  color: #4b5563;
}

.sibling-none {
  color: #4b5563;
  text-align: center;
}

.uncles-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 18px;
}

.pref-text {
  line-height: 1.6;
  text-align: center;
  margin-top: 4px;
}

@media print {
  .biodata-template.classic {
    box-shadow: none;
    max-width: none;
    margin: 0;
  }

  .print-avoid-break {
    page-break-inside: avoid;
  }
}

@media (max-width: 768px) {
  .biodata-template.classic {
    max-width: 100%;
    padding: 8px;
    box-shadow: none;
  }

  .classic-inner {
    padding: 20px 16px 24px;
  }

  .classic-title {
    font-size: 1.35rem;
    letter-spacing: 2px;
  }

  .c-info {
    grid-template-columns: 120px 10px 1fr;
  }

  .c-parents {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .uncles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
