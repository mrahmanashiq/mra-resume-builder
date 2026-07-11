<template>
  <div class="biodata-template" :style="templateStyles">
    <!-- Title -->
    <div class="biodata-title-wrap">
      <div v-if="settings.showBismillah"
           class="biodata-bismillah"
           :class="{ 'bismillah-arabic': settings.bismillahStyle === 'arabic' }">
        {{ bismillahText }}
      </div>
      <h1 class="biodata-title">{{ displayTitle }}</h1>
    </div>

    <div class="biodata-body">
    <!-- Top-right side: photo + contact -->
    <div v-if="hasSide" class="biodata-side">
      <div v-if="settings.showPhoto && personalInfo.photo" class="biodata-photo-wrap">
        <img class="biodata-photo" :src="personalInfo.photo" alt="Photo">
      </div>
      <div v-if="showContactCard" class="contact-card">
        <div class="contact-card-title">Contact Information</div>
        <div v-if="contact.phone" class="contact-card-line">
          <span class="contact-card-key">Phone</span>
          <span class="contact-card-val contact-card-phone">{{ contact.phone }}</span>
        </div>
        <div v-if="settings.fieldsEnabled.guardianPhone && contact.guardianPhone" class="contact-card-line">
          <span class="contact-card-key">Guardian</span>
          <span class="contact-card-val">{{ contact.guardianPhone }}</span>
        </div>
        <div v-if="settings.fieldsEnabled.email && contact.email" class="contact-card-line">
          <span class="contact-card-key">Email</span>
          <span class="contact-card-val">{{ contact.email }}</span>
        </div>
        <div v-if="settings.fieldsEnabled.website && contact.website" class="contact-card-line">
          <span class="contact-card-key">Website</span>
          <span class="contact-card-val">{{ contact.website }}</span>
        </div>
        <div v-if="settings.fieldsEnabled.facebook && contact.facebook" class="contact-card-line">
          <span class="contact-card-key">Facebook</span>
          <span class="contact-card-val">{{ contact.facebook }}</span>
        </div>
        <div v-if="settings.fieldsEnabled.instagram && contact.instagram" class="contact-card-line">
          <span class="contact-card-key">Instagram</span>
          <span class="contact-card-val">{{ contact.instagram }}</span>
        </div>
        <div v-if="settings.fieldsEnabled.linkedin && contact.linkedin" class="contact-card-line">
          <span class="contact-card-key">LinkedIn</span>
          <span class="contact-card-val">{{ contact.linkedin }}</span>
        </div>
      </div>
    </div>

    <template v-for="sectionId in orderedSections" :key="sectionId">
      <!-- Personal Information -->
      <section v-if="sectionId === 'personalInfo'" :class="['biodata-section print-avoid-break', hasSide ? 'pad-for-side' : '']">
        <div class="section-bar">Personal Information</div>
        <div class="info-grid">
          <template v-for="row in personalRows" :key="row.label">
            <div v-if="row.value" class="info-label">{{ row.label }}</div>
            <div v-if="row.value" class="info-value" :style="row.label === 'Full Name' ? nameStyle : null">{{ row.value }}</div>
          </template>
        </div>
      </section>

      <!-- Hobbies & Habits (+ Partner Preferences beside it when both are shown) -->
      <section v-else-if="sectionId === 'lifestyle' && hasLifestyle" class="biodata-section print-avoid-break">
        <div :class="{ 'two-col-sections': pairPreferencesInline }">
          <div>
            <div class="section-bar">Hobbies &amp; Habits</div>
            <div class="info-grid" :class="{ 'compact-grid': pairPreferencesInline }">
              <template v-if="lifestyle.hobby">
                <div class="info-label">Hobby / Interests</div>
                <div class="info-value">{{ lifestyle.hobby }}</div>
              </template>
              <template v-if="lifestyle.smoking">
                <div class="info-label">Smoking</div>
                <div class="info-value">{{ lifestyle.smoking }}</div>
              </template>
              <template v-if="lifestyle.drinking">
                <div class="info-label">Drinking</div>
                <div class="info-value">{{ lifestyle.drinking }}</div>
              </template>
            </div>
          </div>
          <div v-if="pairPreferencesInline">
            <div class="section-bar">Partner Preferences</div>
            <div v-if="preferredBloodGroupsText" class="info-grid compact-grid">
              <div class="info-label">Preferred Blood Group</div>
              <div class="info-value">{{ preferredBloodGroupsText }}</div>
            </div>
            <div v-if="preferredComplexionsText" class="info-grid compact-grid">
              <div class="info-label">Preferred Complexion</div>
              <div class="info-value">{{ preferredComplexionsText }}</div>
            </div>
            <p v-if="preferences.expectations" class="pref-text" :class="{ 'family-gap': preferredBloodGroupsText || preferredComplexionsText }">{{ preferences.expectations }}</p>
          </div>
        </div>
      </section>

      <!-- Educational Qualification -->
      <section v-else-if="sectionId === 'education' && education.length" class="biodata-section print-avoid-break">
        <div class="section-bar">Educational Qualification</div>
        <table class="edu-table">
          <thead>
            <tr>
              <th>Degree</th>
              <th>Year</th>
              <th>Institute</th>
              <th>Result/CGPA</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in education" :key="row.id">
              <td>{{ row.degree }}</td>
              <td>{{ row.year }}</td>
              <td>{{ row.institute }}</td>
              <td>{{ row.result }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Professional Details -->
      <section v-else-if="sectionId === 'professional' && hasProfessional" class="biodata-section print-avoid-break">
        <div class="section-bar">Professional Details</div>
        <ul class="exp-list">
          <li v-for="exp in professionalExperiences" :key="exp.id" class="exp-line">
            <div class="exp-main">
              <span class="exp-company">{{ exp.company }}</span>
              <template v-if="exp.position"><span class="exp-sep"> - </span><span class="exp-position">{{ exp.position }}</span></template>
            </div>
            <div v-if="expMeta(exp)" class="exp-meta">{{ expMeta(exp) }}</div>
          </li>
        </ul>
        <div v-if="settings.fieldsEnabled.income && professional.income" class="info-grid income-row">
          <div class="info-label">Monthly Income</div>
          <div class="info-value">{{ professional.income }}</div>
        </div>
      </section>

      <!-- Family Information -->
      <section v-else-if="sectionId === 'family'" class="biodata-section print-avoid-break">
        <div class="section-bar">Family Information</div>

        <div class="parents-grid">
          <div class="parent-block">
            <div class="parent-heading">Father</div>
            <div class="parent-grid">
              <template v-if="family.father.name">
                <div class="info-label">Name</div>
                <div class="info-value info-strong" :style="nameStyle">{{ family.father.name }}</div>
              </template>
              <template v-if="family.father.profession">
                <div class="info-label">Profession</div>
                <div class="info-value">{{ family.father.profession }}</div>
              </template>
              <template v-if="family.father.education">
                <div class="info-label">Education</div>
                <div class="info-value">{{ family.father.education }}</div>
              </template>
              <template v-if="family.father.phone">
                <div class="info-label">Contact Number</div>
                <div class="info-value">{{ family.father.phone }}</div>
              </template>
            </div>
          </div>

          <div class="parent-block">
            <div class="parent-heading">Mother</div>
            <div class="parent-grid">
              <template v-if="family.mother.name">
                <div class="info-label">Name</div>
                <div class="info-value info-strong" :style="nameStyle">{{ family.mother.name }}</div>
              </template>
              <template v-if="family.mother.profession">
                <div class="info-label">Profession</div>
                <div class="info-value">{{ family.mother.profession }}</div>
              </template>
              <template v-if="family.mother.education">
                <div class="info-label">Education</div>
                <div class="info-value">{{ family.mother.education }}</div>
              </template>
              <template v-if="family.mother.phone">
                <div class="info-label">Contact Number</div>
                <div class="info-value">{{ family.mother.phone }}</div>
              </template>
            </div>
          </div>
        </div>

        <!-- Siblings -->
        <div v-if="settings.fieldsEnabled.siblings" class="family-block">
          <div class="family-heading">Siblings</div>
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
            <div class="family-heading">{{ paternalUncleLabel }}</div>
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
            <div class="family-heading">{{ maternalUncleLabel }}</div>
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

        <div v-if="settings.fieldsEnabled.homeDistrict && family.homeDistrict" class="info-grid family-gap">
          <div class="info-label">Home District</div>
          <div class="info-value">{{ family.homeDistrict }}</div>
        </div>
      </section>

      <!-- Contact is rendered in the top-right side column (see .biodata-side) -->

      <!-- Partner Preferences (standalone - only when not paired beside Hobbies & Habits) -->
      <section v-else-if="sectionId === 'preferences' && hasPreferences && !pairPreferencesInline" class="biodata-section print-avoid-break">
        <div class="section-bar">Partner Preferences</div>
        <div v-if="preferredBloodGroupsText" class="info-grid">
          <div class="info-label">Preferred Blood Group</div>
          <div class="info-value">{{ preferredBloodGroupsText }}</div>
        </div>
        <div v-if="preferredComplexionsText" class="info-grid">
          <div class="info-label">Preferred Complexion</div>
          <div class="info-value">{{ preferredComplexionsText }}</div>
        </div>
        <p v-if="preferences.expectations" class="pref-text" :class="{ 'family-gap': preferredBloodGroupsText || preferredComplexionsText }">{{ preferences.expectations }}</p>
      </section>
    </template>
    </div>
  </div>
</template>

<script>
import { useBiodataStore } from '../../../stores/biodata'
import { storeToRefs } from 'pinia'
import { format, parseISO } from 'date-fns'

export default {
  name: 'ElegantBiodataTemplate',
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
    showContactCard() {
      const c = this.contact
      const f = this.settings.fieldsEnabled
      return this.settings.sectionsEnabled.contact && !!(
        c.phone ||
        (f.guardianPhone && c.guardianPhone) ||
        (f.email && c.email) ||
        (f.website && c.website) ||
        (f.facebook && c.facebook) ||
        (f.instagram && c.instagram) ||
        (f.linkedin && c.linkedin)
      )
    },
    hasSide() {
      return (this.settings.showPhoto && !!this.personalInfo.photo) || this.showContactCard
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
    pairPreferencesInline() {
      // Render Partner Preferences beside Hobbies & Habits when both are shown.
      return this.settings.sectionsEnabled.lifestyle && this.hasLifestyle &&
        this.settings.sectionsEnabled.preferences && this.hasPreferences
    },
    personalRows() {
      const info = this.personalInfo
      const fields = this.settings.fieldsEnabled
      const rawWeight = (info.weight || '').toString().trim()
      // Append "kg" only when the value is a bare number, so pre-filled "68 kg" won't become "68 kg kg".
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

<style scoped src="./ElegantBiodataTemplate.css"></style>
