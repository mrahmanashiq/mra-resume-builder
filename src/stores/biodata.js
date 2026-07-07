import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

/**
 * Marriage Biodata store. Fully independent from the résumé store — shares no
 * state and imports nothing from it. Exposes the same UI interface the shared
 * DocumentEditorShell relies on (ui.* + setCurrentSection/togglePreviewMode/
 * toggleSidebar + exportData/importData).
 *
 * Sample values are neutral placeholders that mirror the reference PDF's format.
 */
export const useBiodataStore = defineStore('biodata', {
  state: () => ({
    // Personal Information
    personalInfo: {
      fullName: 'Your Full Name',
      dateOfBirth: '2000-01-01',
      heightFeet: '5',
      heightInches: '6',
      weight: '60',
      complexion: 'Fair',
      bloodGroup: 'B+',
      religion: 'Islam',
      presentAddress: 'House, Road, Area, City',
      permanentAddress: 'Village, Post Office, District',
      nationality: 'Bangladeshi',
      motherTongue: 'Bengali',
      sect: 'Sunni',
      maritalStatus: 'Unmarried',
      photo: ''
    },

    // Hobbies & Habits
    lifestyle: {
      hobby: 'Reading, Travelling',
      smoking: 'No',
      drinking: 'No'
    },

    // Educational Qualification (table rows)
    education: [
      { id: uuidv4(), degree: 'Degree / Exam Name', year: '2020', institute: 'Institute / University Name', result: 'GPA / CGPA' }
    ],

    // Professional Details — list of work experiences
    professional: {
      experiences: [
        { id: uuidv4(), company: 'Company Name', position: 'Designation', location: 'City', type: 'On-site', startDate: '2022-01', endDate: '', current: true },
        { id: uuidv4(), company: 'Previous Company', position: 'Junior Designation', location: 'City', type: 'Remote', startDate: '2020-01', endDate: '2021-12', current: false }
      ],
      income: ''
    },

    // Family Information
    family: {
      father: { name: "Father's Name", profession: 'Profession', education: 'Education', phone: '01XXX-XXXXXX' },
      mother: { name: "Mother's Name", profession: 'Homemaker', education: 'Education', phone: '' },
      siblings: [
        { id: uuidv4(), name: "Sibling's Name", relation: 'Brother / Sister', occupation: 'Occupation', maritalStatus: 'Unmarried' }
      ],
      // Chacha
      paternalUncles: [
        { id: uuidv4(), name: "Uncle's Name", occupation: 'Occupation', location: '' }
      ],
      // Mama
      maternalUncles: [
        { id: uuidv4(), name: "Uncle's Name", occupation: 'Occupation', location: '' }
      ],
      homeDistrict: 'District Name'
    },

    // Contact
    contact: {
      phone: '01XXX-XXXXXX',
      guardianPhone: '',
      email: '',
      website: '',
      facebook: '',
      instagram: '',
      linkedin: ''
    },

    // Partner Preferences (optional section)
    preferences: {
      preferredBloodGroup: '',
      expectations: ''
    },

    // Biodata Settings
    settings: {
      template: 'elegant',
      title: 'Marriage Biodata',
      showBismillah: false,
      bismillahStyle: 'bengali',
      bloodGroupVe: false,
      colorScheme: {
        primary: '#a61c3c',
        secondary: '#7a142c',
        accent: '#d4a017',
        text: '#1f2937',
        background: '#ffffff'
      },
      font: 'Inter',
      fontSize: 14,
      showPhoto: false,
      sectionsOrder: [
        'personalInfo',
        'lifestyle',
        'education',
        'professional',
        'family',
        'contact',
        'preferences'
      ],
      sectionsEnabled: {
        personalInfo: true,
        lifestyle: true,
        education: true,
        professional: true,
        family: true,
        contact: true,
        preferences: false
      },
      // Toggleable optional fields (extras beyond the core PDF format)
      fieldsEnabled: {
        nationality: false,
        motherTongue: false,
        sect: false,
        maritalStatus: true,
        income: false,
        siblings: true,
        homeDistrict: false,
        guardianPhone: false,
        email: false,
        website: false,
        facebook: false,
        instagram: false,
        linkedin: false
      }
    },

    // UI State (interface required by DocumentEditorShell)
    ui: {
      currentSection: 'personalInfo',
      previewMode: false,
      sidebarCollapsed: false,
      theme: 'light'
    }
  }),

  getters: {
    fullName: (state) => state.personalInfo.fullName || 'Biodata'
  },

  actions: {
    // Personal Info
    updatePersonalInfo(field, value) {
      this.personalInfo[field] = value
    },

    // Hobbies & Habits
    updateLifestyle(field, value) {
      this.lifestyle[field] = value
    },

    // Education (table rows)
    addEducation(row) {
      this.education.push({ id: uuidv4(), degree: '', year: '', institute: '', result: '', ...row })
    },
    updateEducation(id, updates) {
      const index = this.education.findIndex(row => row.id === id)
      if (index !== -1) {
        this.education[index] = { ...this.education[index], ...updates }
      }
    },
    removeEducation(id) {
      this.education = this.education.filter(row => row.id !== id)
    },

    // Professional
    updateProfessional(field, value) {
      this.professional[field] = value
    },
    addProExperience(entry) {
      this.professional.experiences.push({ id: uuidv4(), company: '', position: '', location: '', type: '', startDate: '', endDate: '', current: false, ...entry })
    },
    updateProExperience(id, updates) {
      const index = this.professional.experiences.findIndex(item => item.id === id)
      if (index !== -1) {
        this.professional.experiences[index] = { ...this.professional.experiences[index], ...updates }
      }
    },
    removeProExperience(id) {
      this.professional.experiences = this.professional.experiences.filter(item => item.id !== id)
    },

    // Family — parents
    updateParent(parent, field, value) {
      if (this.family[parent]) {
        this.family[parent][field] = value
      }
    },
    updateFamilyField(field, value) {
      this.family[field] = value
    },

    // Family — siblings
    addSibling(sibling) {
      this.family.siblings.push({ id: uuidv4(), name: '', relation: 'Brother', occupation: '', maritalStatus: '', ...sibling })
    },
    updateSibling(id, updates) {
      const index = this.family.siblings.findIndex(item => item.id === id)
      if (index !== -1) {
        this.family.siblings[index] = { ...this.family.siblings[index], ...updates }
      }
    },
    removeSibling(id) {
      this.family.siblings = this.family.siblings.filter(item => item.id !== id)
    },

    // Family — paternal uncles (Chacha)
    addPaternalUncle(uncle) {
      this.family.paternalUncles.push({ id: uuidv4(), name: '', occupation: '', location: '', ...uncle })
    },
    updatePaternalUncle(id, updates) {
      const index = this.family.paternalUncles.findIndex(item => item.id === id)
      if (index !== -1) {
        this.family.paternalUncles[index] = { ...this.family.paternalUncles[index], ...updates }
      }
    },
    removePaternalUncle(id) {
      this.family.paternalUncles = this.family.paternalUncles.filter(item => item.id !== id)
    },

    // Family — maternal uncles (Mama)
    addMaternalUncle(uncle) {
      this.family.maternalUncles.push({ id: uuidv4(), name: '', occupation: '', location: '', ...uncle })
    },
    updateMaternalUncle(id, updates) {
      const index = this.family.maternalUncles.findIndex(item => item.id === id)
      if (index !== -1) {
        this.family.maternalUncles[index] = { ...this.family.maternalUncles[index], ...updates }
      }
    },
    removeMaternalUncle(id) {
      this.family.maternalUncles = this.family.maternalUncles.filter(item => item.id !== id)
    },

    // Contact
    updateContact(field, value) {
      this.contact[field] = value
    },

    // Preferences
    updatePreferences(field, value) {
      this.preferences[field] = value
    },

    // Settings
    updateSettings(updates) {
      this.settings = { ...this.settings, ...updates }
    },
    updateColorScheme(colors) {
      this.settings.colorScheme = { ...this.settings.colorScheme, ...colors }
    },
    reorderSections(newOrder) {
      this.settings.sectionsOrder = newOrder
    },
    toggleSection(section) {
      this.settings.sectionsEnabled[section] = !this.settings.sectionsEnabled[section]
    },
    toggleField(field) {
      this.settings.fieldsEnabled[field] = !this.settings.fieldsEnabled[field]
    },

    // UI (interface required by DocumentEditorShell)
    setCurrentSection(section) {
      this.ui.currentSection = section
    },
    togglePreviewMode() {
      this.ui.previewMode = !this.ui.previewMode
    },
    toggleSidebar() {
      this.ui.sidebarCollapsed = !this.ui.sidebarCollapsed
    },
    setTheme(theme) {
      this.ui.theme = theme
    },

    // Import / Export
    exportData() {
      return JSON.stringify({
        personalInfo: this.personalInfo,
        lifestyle: this.lifestyle,
        education: this.education,
        professional: this.professional,
        family: this.family,
        contact: this.contact,
        preferences: this.preferences,
        settings: this.settings
      }, null, 2)
    },
    importData(jsonData) {
      try {
        const data = JSON.parse(jsonData)
        if (data.personalInfo) this.personalInfo = data.personalInfo
        if (data.lifestyle) this.lifestyle = data.lifestyle
        if (data.education) this.education = data.education
        if (data.professional) this.professional = data.professional
        if (data.family) this.family = data.family
        if (data.contact) this.contact = data.contact
        if (data.preferences) this.preferences = data.preferences
        if (data.settings) this.settings = { ...this.settings, ...data.settings }
        return true
      } catch (error) {
        console.error('Error importing biodata:', error)
        return false
      }
    },

    resetToDefaults() {
      this.$reset()
    }
  }
})
