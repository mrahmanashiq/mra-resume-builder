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
                    <div class="c-val" :style="row.label === 'Full Name' ? nameStyle : null">{{ row.value }}</div>
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
                      <div class="c-val c-strong" :style="nameStyle">{{ family.father.name }}</div>
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
                      <div class="c-val c-strong" :style="nameStyle">{{ family.mother.name }}</div>
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
                    <span class="family-name" :style="nameStyle">{{ sib.name }}</span>
                    <span v-if="sib.relation" class="family-meta"> - {{ sib.relation }}</span>
                    <span v-if="sib.occupation" class="family-meta">, {{ sib.occupation }}</span>
                    <span v-if="sib.maritalStatus" class="family-meta"> ({{ sib.maritalStatus }})</span>
                  </li>
                </ul>
                <div v-else class="sibling-none">None</div>
              </div>

              <!-- Uncles -->
              <div v-if="showPaternalUncles || showMaternalUncles" class="uncles-grid">
                <div v-if="showPaternalUncles">
                  <div class="c-subhead">{{ paternalUncleLabel }}</div>
                  <ul class="family-list">
                    <li v-for="u in family.paternalUncles" :key="u.id">
                      <span class="fam-bullet">•</span>
                      <span class="family-name" :style="nameStyle">{{ u.name }}</span>
                      <span v-if="u.occupation" class="family-meta"> - {{ u.occupation }}</span>
                      <span v-if="u.location" class="family-meta"> - {{ u.location }}</span>
                    </li>
                  </ul>
                </div>
                <div v-if="showMaternalUncles">
                  <div class="c-subhead">{{ maternalUncleLabel }}</div>
                  <ul class="family-list">
                    <li v-for="u in family.maternalUncles" :key="u.id">
                      <span class="fam-bullet">•</span>
                      <span class="family-name" :style="nameStyle">{{ u.name }}</span>
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
              <div v-if="preferredComplexionsText" class="c-info">
                <div class="c-key">Preferred Complexion</div>
                <div class="c-colon">:</div>
                <div class="c-val">{{ preferredComplexionsText }}</div>
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
      return !!(this.preferences.expectations || this.preferredBloodGroupsText || this.preferredComplexionsText)
    },
    preferredBloodGroupsText() {
      return (this.preferences.preferredBloodGroups || [])
        .map(bg => this.formatBloodGroup(bg))
        .join(', ')
    },
    preferredComplexionsText() {
      return (this.preferences.preferredComplexions || []).join(', ')
    },
    nameStyle() {
      const s = this.settings.nameStyle || 'normal'
      if (s === 'bold') return { fontWeight: 700, fontStyle: 'normal' }
      if (s === 'italic') return { fontWeight: 400, fontStyle: 'italic' }
      return { fontWeight: 400, fontStyle: 'normal' }
    },
    paternalUncleLabel() {
      return this.settings.uncleLabelStyle === 'english' ? 'Uncles (Paternal)' : 'Uncles (Chacha)'
    },
    maternalUncleLabel() {
      return this.settings.uncleLabelStyle === 'english' ? 'Uncles (Maternal)' : 'Uncles (Mama)'
    },
    showPaternalUncles() {
      return this.settings.fieldsEnabled.paternalUncles !== false && this.family.paternalUncles.length > 0
    },
    showMaternalUncles() {
      return this.settings.fieldsEnabled.maternalUncles !== false && this.family.maternalUncles.length > 0
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

<style scoped src="./ClassicBiodataTemplate.css"></style>
