<template>
  <div class="biodata-template" :style="templateStyles">
    <!-- Title -->
    <div class="biodata-title-wrap">
      <h1 class="biodata-title">MARRIAGE BIODATA</h1>
    </div>

    <!-- Optional photo -->
    <div v-if="settings.showPhoto && personalInfo.photo" class="biodata-photo-wrap">
      <img :src="personalInfo.photo" alt="Photo" class="biodata-photo">
    </div>

    <template v-for="sectionId in orderedSections" :key="sectionId">
      <!-- Personal Information -->
      <section v-if="sectionId === 'personalInfo'" class="biodata-section print-avoid-break">
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
        <div class="info-grid">
          <template v-if="professional.profession">
            <div class="info-label">Current Profession</div>
            <div class="info-value info-strong">{{ professional.profession }}</div>
          </template>
          <template v-if="professional.company">
            <div class="info-label">Company / Organization</div>
            <div class="info-value">{{ professional.company }}</div>
          </template>
          <template v-if="professional.experience">
            <div class="info-label">Experience</div>
            <div class="info-value">{{ professional.experience }}</div>
          </template>
          <template v-if="settings.fieldsEnabled.income && professional.income">
            <div class="info-label">Monthly Income</div>
            <div class="info-value">{{ professional.income }}</div>
          </template>
        </div>
      </section>

      <!-- Family Information -->
      <section v-else-if="sectionId === 'family'" class="biodata-section print-avoid-break">
        <div class="section-bar">Family Information</div>

        <div class="info-grid">
          <template v-if="family.father.name">
            <div class="info-label">Father</div>
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

        <div class="info-grid family-gap">
          <template v-if="family.mother.name">
            <div class="info-label">Mother</div>
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

      <!-- Contact -->
      <section v-else-if="sectionId === 'contact'" class="biodata-section print-avoid-break">
        <div class="contact-row">
          <span class="contact-label">Contact Number:</span>
          <span class="contact-number">{{ contact.phone }}</span>
        </div>
        <div v-if="settings.fieldsEnabled.guardianPhone && contact.guardianPhone" class="contact-row-sm">
          <span class="info-label">Guardian's Contact:</span>
          <span class="info-value">{{ contact.guardianPhone }}</span>
        </div>
        <div v-if="settings.fieldsEnabled.email && contact.email" class="contact-row-sm">
          <span class="info-label">Email:</span>
          <span class="info-value">{{ contact.email }}</span>
        </div>
      </section>

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
    hasProfessional() {
      const p = this.professional
      return p.profession || p.company || p.experience ||
        (this.settings.fieldsEnabled.income && p.income)
    },
    personalRows() {
      const info = this.personalInfo
      const fields = this.settings.fieldsEnabled
      const heightWeight = [info.height, info.weight].filter(Boolean).join(' | ')
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

.biodata-photo-wrap {
  text-align: center;
  margin-bottom: 20px;
}

.biodata-photo {
  width: 120px;
  height: 150px;
  object-fit: cover;
  border: 3px solid var(--primary);
  border-radius: 4px;
  display: inline-block;
}

.biodata-section {
  margin-bottom: 22px;
}

.section-bar {
  position: relative;
  background: var(--primary);
  color: #ffffff;
  font-weight: 700;
  padding: 9px 48px 9px 18px;
  border-radius: 6px 24px 24px 6px;
  margin-bottom: 18px;
  display: inline-block;
  min-width: 260px;
}

.section-bar::after {
  content: '';
  position: absolute;
  left: 2px;
  bottom: -7px;
  width: 46px;
  height: 3px;
  border-radius: 2px;
  background: var(--primary);
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

.family-gap {
  margin-top: 16px;
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

.contact-row {
  border-top: 2px solid #6b7280;
  padding-top: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.contact-label {
  font-weight: 700;
  color: #374151;
}

.contact-number {
  font-weight: 800;
  font-size: 1.3em;
  color: var(--primary);
  letter-spacing: 1px;
}

.contact-row-sm {
  margin-top: 8px;
  display: flex;
  gap: 12px;
  padding-left: 2px;
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

  .info-grid {
    grid-template-columns: 140px 1fr;
  }

  .uncles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
