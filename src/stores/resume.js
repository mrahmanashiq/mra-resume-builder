import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export const useResumeStore = defineStore('resume', {
  state: () => ({
    // Personal Information
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      title: 'Full Stack Developer',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      address: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/johndoe',
      github: 'github.com/johndoe',
      website: 'johndoe.dev',
      summary: 'Passionate full-stack developer with 5+ years of experience building scalable web applications using modern technologies. Expertise in React, Node.js, and cloud platforms.',
      profileImage: '/profile_pic.png'
    },

    // Skills with categories and proficiency levels
    skills: [
      { id: uuidv4(), name: 'JavaScript', category: 'Programming', level: 95 },
      { id: uuidv4(), name: 'React', category: 'Frontend', level: 90 },
      { id: uuidv4(), name: 'Node.js', category: 'Backend', level: 85 },
      { id: uuidv4(), name: 'Python', category: 'Programming', level: 80 },
      { id: uuidv4(), name: 'AWS', category: 'Cloud', level: 75 },
      { id: uuidv4(), name: 'Docker', category: 'DevOps', level: 70 }
    ],

    // Work Experience
    experience: [
      {
        id: uuidv4(),
        title: 'Senior Full Stack Developer',
        company: 'Tech Innovations Inc.',
        location: 'San Francisco, CA',
        startDate: '2022-01',
        endDate: '',
        current: true,
        description: 'Lead development of enterprise web applications serving 100K+ users',
        achievements: [
          'Reduced application load time by 40% through performance optimization',
          'Led a team of 5 developers in implementing microservices architecture',
          'Implemented CI/CD pipeline reducing deployment time by 60%'
        ]
      },
      {
        id: uuidv4(),
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        location: 'Remote',
        startDate: '2020-03',
        endDate: '2021-12',
        current: false,
        description: 'Developed and maintained multiple client-facing applications',
        achievements: [
          'Built responsive web applications using React and Node.js',
          'Integrated third-party APIs and payment gateways',
          'Collaborated with design team to implement pixel-perfect UIs'
        ]
      }
    ],

    // Education
    education: [
      {
        id: uuidv4(),
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        startDate: '2016-09',
        endDate: '2020-05',
        gpa: '3.8',
        description: 'Relevant Coursework: Data Structures, Algorithms, Software Engineering, Database Systems'
      }
    ],

    // Projects
    projects: [
      {
        id: uuidv4(),
        name: 'E-Commerce Platform',
        description: 'Full-stack e-commerce solution with React, Node.js, and MongoDB',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
        url: 'https://github.com/johndoe/ecommerce',
        startDate: '2023-01',
        endDate: '2023-06'
      },
      {
        id: uuidv4(),
        name: 'Task Management App',
        description: 'Real-time collaborative task management application',
        technologies: ['Vue.js', 'Express', 'Socket.io', 'PostgreSQL'],
        url: 'https://taskmanager.johndoe.dev',
        startDate: '2022-08',
        endDate: '2022-12'
      }
    ],

    // Certifications
    certifications: [
      {
        id: uuidv4(),
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2023-03',
        expiryDate: '2026-03',
        credentialId: 'AWS-SAA-123456'
      },
      {
        id: uuidv4(),
        name: 'Google Cloud Professional Developer',
        issuer: 'Google Cloud',
        date: '2022-11',
        expiryDate: '2024-11',
        credentialId: 'GCP-PD-789012'
      }
    ],

    // Languages
    languages: [
      { id: uuidv4(), name: 'English', level: 'Native' },
      { id: uuidv4(), name: 'Spanish', level: 'Intermediate' },
      { id: uuidv4(), name: 'French', level: 'Basic' }
    ],

    // Resume Settings
    settings: {
      template: 'modern',
      colorScheme: {
        primary: '#3b82f6',
        secondary: '#14b8a6',
        accent: '#f59e0b',
        text: '#1f2937',
        background: '#ffffff'
      },
      font: 'Inter',
      fontSize: 14,
      spacing: 'normal',
      showProfileImage: true,
      sectionsOrder: [
        'personalInfo',
        'summary',
        'experience',
        'education',
        'skills',
        'projects',
        'certifications',
        'languages'
      ],
      sectionsEnabled: {
        personalInfo: true,
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certifications: true,
        languages: true
      }
    },

    // UI State
    ui: {
      currentSection: 'personalInfo',
      previewMode: false,
      sidebarCollapsed: false,
      theme: 'light'
    }
  }),

  getters: {
    fullName: (state) => `${state.personalInfo.firstName} ${state.personalInfo.lastName}`,
    
    skillsByCategory: (state) => {
      const categories = {}
      state.skills.forEach(skill => {
        if (!categories[skill.category]) {
          categories[skill.category] = []
        }
        categories[skill.category].push(skill)
      })
      return categories
    },

    currentExperience: (state) => {
      return state.experience.filter(exp => exp.current)
    },

    sortedExperience: (state) => {
      return [...state.experience].sort((a, b) => {
        if (a.current && !b.current) return -1
        if (!a.current && b.current) return 1
        return new Date(b.startDate) - new Date(a.startDate)
      })
    },

    activeCertifications: (state) => {
      const now = new Date()
      return state.certifications.filter(cert => {
        if (!cert.expiryDate) return true
        return new Date(cert.expiryDate) > now
      })
    }
  },

  actions: {
    // Personal Info Actions
    updatePersonalInfo(field, value) {
      this.personalInfo[field] = value
    },

    // Skills Actions
    addSkill(skill) {
      this.skills.push({
        id: uuidv4(),
        ...skill
      })
    },

    updateSkill(id, updates) {
      const index = this.skills.findIndex(skill => skill.id === id)
      if (index !== -1) {
        this.skills[index] = { ...this.skills[index], ...updates }
      }
    },

    removeSkill(id) {
      this.skills = this.skills.filter(skill => skill.id !== id)
    },

    // Experience Actions
    addExperience(experience) {
      this.experience.push({
        id: uuidv4(),
        ...experience
      })
    },

    updateExperience(id, updates) {
      const index = this.experience.findIndex(exp => exp.id === id)
      if (index !== -1) {
        this.experience[index] = { ...this.experience[index], ...updates }
      }
    },

    removeExperience(id) {
      this.experience = this.experience.filter(exp => exp.id !== id)
    },

    // Education Actions
    addEducation(education) {
      this.education.push({
        id: uuidv4(),
        ...education
      })
    },

    updateEducation(id, updates) {
      const index = this.education.findIndex(edu => edu.id === id)
      if (index !== -1) {
        this.education[index] = { ...this.education[index], ...updates }
      }
    },

    removeEducation(id) {
      this.education = this.education.filter(edu => edu.id !== id)
    },

    // Projects Actions
    addProject(project) {
      this.projects.push({
        id: uuidv4(),
        ...project
      })
    },

    updateProject(id, updates) {
      const index = this.projects.findIndex(proj => proj.id === id)
      if (index !== -1) {
        this.projects[index] = { ...this.projects[index], ...updates }
      }
    },

    removeProject(id) {
      this.projects = this.projects.filter(proj => proj.id !== id)
    },

    // Certifications Actions
    addCertification(certification) {
      this.certifications.push({
        id: uuidv4(),
        ...certification
      })
    },

    updateCertification(id, updates) {
      const index = this.certifications.findIndex(cert => cert.id === id)
      if (index !== -1) {
        this.certifications[index] = { ...this.certifications[index], ...updates }
      }
    },

    removeCertification(id) {
      this.certifications = this.certifications.filter(cert => cert.id !== id)
    },

    // Languages Actions
    addLanguage(language) {
      this.languages.push({
        id: uuidv4(),
        ...language
      })
    },

    updateLanguage(id, updates) {
      const index = this.languages.findIndex(lang => lang.id === id)
      if (index !== -1) {
        this.languages[index] = { ...this.languages[index], ...updates }
      }
    },

    removeLanguage(id) {
      this.languages = this.languages.filter(lang => lang.id !== id)
    },

    // Settings Actions
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

    // UI Actions
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

    // Import/Export Actions
    exportData() {
      return JSON.stringify({
        personalInfo: this.personalInfo,
        skills: this.skills,
        experience: this.experience,
        education: this.education,
        projects: this.projects,
        certifications: this.certifications,
        languages: this.languages,
        settings: this.settings
      }, null, 2)
    },

    importData(jsonData) {
      try {
        const data = JSON.parse(jsonData)
        if (data.personalInfo) this.personalInfo = data.personalInfo
        if (data.skills) this.skills = data.skills
        if (data.experience) this.experience = data.experience
        if (data.education) this.education = data.education
        if (data.projects) this.projects = data.projects
        if (data.certifications) this.certifications = data.certifications
        if (data.languages) this.languages = data.languages
        if (data.settings) this.settings = { ...this.settings, ...data.settings }
        return true
      } catch (error) {
        console.error('Error importing data:', error)
        return false
      }
    },

    // Reset Actions
    resetToDefaults() {
      this.$reset()
    }
  }
})