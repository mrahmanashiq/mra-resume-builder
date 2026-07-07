<template>
  <div class="biodata-template" :style="templateStyles">
    <!-- Title -->
    <div class="biodata-title-wrap">
      <h1 class="biodata-title">MARRIAGE BIODATA</h1>
    </div>

    <!-- Top-right side: photo + contact -->
    <div v-if="hasSide" class="biodata-side">
      <div v-if="settings.showPhoto && personalInfo.photo" class="biodata-photo-wrap">
        <img :src="personalInfo.photo" alt="Photo" class="biodata-photo">
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
            <div v-if="row.value" class="info-value">{{ row.value }}</div>
          </template>
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
              <th>Result</th>
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
              <template v-if="exp.position"><span class="exp-sep"> — </span><span class="exp-position">{{ exp.position }}</span></template>
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
                <div class="info-value info-strong">{{ family.father.name }}</div>
              </template>
              <template v-if="family.father.profession">
                <div class="info-label">Profession</div>
                <div class="info-value">{{ family.father.profession }}</div>
              </template>
              <template v-if="family.father.education">
                <div class="info-label">Education</div>
                <div class="info-value">{{ family.father.education }}</div>
              </template>
            </div>
          </div>

          <div class="parent-block">
            <div class="parent-heading">Mother</div>
            <div class="parent-grid">
              <template v-if="family.mother.name">
                <div class="info-label">Name</div>
                <div class="info-value info-strong">{{ family.mother.name }}</div>
              </template>
              <template v-if="family.mother.profession">
                <div class="info-label">Profession</div>
                <div class="info-value">{{ family.mother.profession }}</div>
              </template>
              <template v-if="family.mother.education">
                <div class="info-label">Education</div>
                <div class="info-value">{{ family.mother.education }}</div>
              </template>
            </div>
          </div>
        </div>

        <!-- Siblings -->
        <div v-if="settings.fieldsEnabled.siblings && family.siblings.length" class="family-block">
          <div class="family-heading">Siblings</div>
          <ul class="family-list">
            <li v-for="sib in family.siblings" :key="sib.id">
              <span class="family-name">{{ sib.name }}</span>
              <span v-if="sib.relation" class="family-meta"> — {{ sib.relation }}</span>
              <span v-if="sib.occupation" class="family-meta">, {{ sib.occupation }}</span>
              <span v-if="sib.maritalStatus" class="family-meta"> ({{ sib.maritalStatus }})</span>
            </li>
          </ul>
        </div>

        <!-- Uncles -->
        <div v-if="family.paternalUncles.length || family.maternalUncles.length" class="uncles-grid">
          <div v-if="family.paternalUncles.length">
            <div class="family-heading">Uncles (Chacha)</div>
            <ul class="family-list">
              <li v-for="u in family.paternalUncles" :key="u.id">
                <span class="family-name">{{ u.name }}</span>
                <span v-if="u.occupation" class="family-meta"> - {{ u.occupation }}</span>
              </li>
            </ul>
          </div>
          <div v-if="family.maternalUncles.length">
            <div class="family-heading">Uncles (Mama)</div>
            <ul class="family-list">
              <li v-for="u in family.maternalUncles" :key="u.id">
                <span class="family-name">{{ u.name }}</span>
                <span v-if="u.occupation" class="family-meta"> - {{ u.occupation }}</span>
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

      <!-- Partner Preferences -->
      <section v-else-if="sectionId === 'preferences' && preferences.expectations" class="biodata-section print-avoid-break">
        <div class="section-bar">Partner Preferences</div>
        <p class="pref-text">{{ preferences.expectations }}</p>
      </section>
    </template>
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
    const { personalInfo, education, professional, family, contact, preferences, settings } =
      storeToRefs(biodataStore)
    return { personalInfo, education, professional, family, contact, preferences, settings }
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
    personalRows() {
      const info = this.personalInfo
      const fields = this.settings.fieldsEnabled
      const rawWeight = (info.weight || '').toString().trim()
      // Append "kg" only when the value is a bare number, so pre-filled "68 kg" won't become "68 kg kg".
      const weightText = rawWeight ? (/^[\d.]+$/.test(rawWeight) ? `${rawWeight} kg` : rawWeight) : ''
      const heightWeight = [info.height, weightText].filter(Boolean).join(' | ')
      const rows = [
        { label: 'Full Name', value: info.fullName },
        { label: 'Date of Birth', value: info.dateOfBirth },
        { label: 'Height / Weight', value: heightWeight },
        { label: 'Complexion', value: info.complexion },
        { label: 'Blood Group', value: info.bloodGroup },
        { label: 'Religion', value: info.religion },
        { label: 'Hobby', value: info.hobby },
        { label: 'Present Address', value: info.presentAddress },
        { label: 'Permanent Address', value: info.permanentAddress }
      ]
      if (fields.maritalStatus) rows.push({ label: 'Marital Status', value: info.maritalStatus })
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
    }
  }
}
</script>

<style scoped>
.biodata-template {
  --primary: #a61c3c;
  --secondary: #7a142c;
  --accent: #d4a017;
  --text: #1f2937;
  --background: #ffffff;

  position: relative;
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 24px 40px 40px;
  background: var(--background);
  color: var(--text);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.biodata-title-wrap {
  text-align: center;
  border-bottom: 3px solid var(--primary);
  padding-bottom: 12px;
  margin-bottom: 24px;
}

.biodata-title {
  color: var(--primary);
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: 3px;
}

.biodata-side {
  position: absolute;
  top: 100px;
  right: 40px;
  width: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  z-index: 1;
}

.biodata-photo-wrap {
  width: 100%;
  margin: 0;
}

.biodata-photo {
  width: 100%;
  height: 175px;
  object-fit: cover;
  border: 2px solid var(--primary);
  border-radius: 6px;
  display: block;
  box-sizing: border-box;
}

.contact-card {
  width: 100%;
  border: 2px solid var(--primary);
  border-radius: 6px;
  padding: 10px 12px;
  text-align: left;
  box-sizing: border-box;
}

.contact-card-title {
  font-weight: 700;
  color: var(--primary);
  font-size: 0.8em;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
  padding-bottom: 6px;
  margin-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.contact-card-line {
  display: flex;
  flex-direction: column;
  margin-top: 6px;
  word-break: break-word;
}

.contact-card-key {
  font-weight: 600;
  color: #6b7280;
  font-size: 0.72em;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.contact-card-val {
  color: var(--text);
  font-weight: 600;
  font-size: 0.9em;
}

.contact-card-phone {
  color: var(--primary);
  letter-spacing: 0.5px;
}

.pad-for-side {
  padding-right: 200px;
}

.biodata-section {
  margin-bottom: 22px;
}

.section-bar {
  background: var(--primary);
  color: #ffffff;
  font-weight: 700;
  padding: 9px 48px 9px 18px;
  border-radius: 6px 24px 24px 6px;
  margin-bottom: 16px;
  display: inline-block;
  min-width: 260px;
}

.info-grid {
  display: grid;
  grid-template-columns: 200px 1fr;
  row-gap: 10px;
  column-gap: 12px;
  padding-left: 8px;
}

.info-label {
  font-weight: 600;
  color: #4b5563;
}

.info-value {
  color: var(--text);
}

.info-strong {
  font-weight: 700;
}

.exp-list {
  list-style: none;
  padding-left: 8px;
}

.exp-line {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  padding: 3px 0;
  line-height: 1.45;
}

.exp-main {
  min-width: 0;
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
  text-align: right;
  white-space: nowrap;
  flex-shrink: 0;
}

.income-row {
  margin-top: 12px;
}

.family-gap {
  margin-top: 16px;
}

.parents-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding-left: 8px;
}

.parent-heading {
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #e5e7eb;
}

.parent-grid {
  display: grid;
  grid-template-columns: 100px 1fr;
  row-gap: 8px;
  column-gap: 10px;
}

.edu-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9em;
}

.edu-table th {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  padding: 8px 10px;
  text-align: left;
  font-weight: 700;
}

.edu-table td {
  border: 1px solid #d1d5db;
  padding: 8px 10px;
}

.family-block {
  margin-top: 16px;
  padding-left: 8px;
}

.family-heading {
  color: var(--primary);
  font-weight: 700;
  margin-bottom: 6px;
}

.family-list {
  list-style: disc;
  padding-left: 20px;
}

.family-name {
  font-weight: 700;
}

.family-meta {
  color: #4b5563;
}

.uncles-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
  padding-left: 8px;
}

.pref-text {
  padding-left: 8px;
  line-height: 1.6;
}

@media print {
  .biodata-template {
    box-shadow: none;
    max-width: none;
    margin: 0;
  }

  .print-avoid-break {
    page-break-inside: avoid;
  }
}

@media (max-width: 768px) {
  .biodata-template {
    max-width: 100%;
    padding: 20px;
    box-shadow: none;
  }

  .biodata-side {
    position: static;
    width: 100%;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }

  .contact-card {
    width: auto;
    min-width: 180px;
  }

  .biodata-photo-wrap {
    width: auto;
  }

  .biodata-photo {
    width: 150px;
    height: 160px;
  }

  .pad-for-side {
    padding-right: 0;
  }

  .info-grid {
    grid-template-columns: 140px 1fr;
  }

  .parents-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .uncles-grid {
    grid-template-columns: 1fr;
  }

  .exp-line {
    flex-direction: column;
    gap: 2px;
  }

  .exp-meta {
    text-align: left;
    white-space: normal;
  }
}
</style>
