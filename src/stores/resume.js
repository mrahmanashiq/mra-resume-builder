import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export const useResumeStore = defineStore('resume', {
  state: () => ({
    // Personal Information
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      title: 'Full Stack Developer',
      headerTagline: '',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      address: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/johndoe',
      linkedinLabel: '',
      github: 'github.com/johndoe',
      githubLabel: '',
      website: 'johndoe.dev',
      websiteLabel: '',
      summary: 'Passionate full-stack developer with 5+ years of experience building scalable web applications using modern technologies. Expertise in React, Node.js, and cloud platforms.',
      researchInterests: 'Machine Learning, Computer Vision, Deep Learning, Human-Computer Interaction',
      scholar: 'scholar.google.com/citations',
      profileImage: '/profile_pic.png'
    },

    // Custom header links (user-defined label + URL, e.g. Portfolio, Blog, Twitter).
    // Empty by default - opt-in, shown in the header alongside the fixed links.
    customLinks: [],

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
        url: 'https://techinnovations.example.com',
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
        url: 'https://startupxyz.example.com',
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
        url: 'https://www.berkeley.edu',
        startDate: '2016-09',
        endDate: '2020-05',
        gpa: '3.8',
        thesis: '',
        advisor: '',
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
        liveUrl: 'https://shop.johndoe.dev',
        startDate: '2023-01',
        endDate: '2023-06'
      },
      {
        id: uuidv4(),
        name: 'Task Management App',
        description: 'Real-time collaborative task management application',
        technologies: ['Vue.js', 'Express', 'Socket.io', 'PostgreSQL'],
        url: 'https://github.com/johndoe/taskmanager',
        liveUrl: 'https://taskmanager.johndoe.dev',
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

    // Publications (academic / researcher CV)
    publications: [
      {
        id: uuidv4(),
        title: 'Scalable Representation Learning for Multimodal Perception',
        authors: 'John Doe, Jane Smith, Alan Turing',
        venue: 'Conference on Neural Information Processing Systems (NeurIPS)',
        year: '2024',
        award: 'Outstanding Paper Award',
        url: 'arxiv.org/abs/0000.00000',
        summary: 'We introduce a unified encoder that learns from images, text, and audio jointly, improving downstream transfer on 12 benchmarks.'
      },
      {
        id: uuidv4(),
        title: 'Efficient Transformers for Long-Context Understanding',
        authors: 'John Doe, Grace Hopper',
        venue: 'International Conference on Machine Learning (ICML)',
        year: '2023',
        award: '',
        url: 'arxiv.org/abs/0000.00000',
        summary: 'A linear-attention variant that scales to 100K tokens while matching full-attention quality.'
      },
      {
        id: uuidv4(),
        title: 'A Benchmark for Robust Visual Reasoning',
        authors: 'Jane Smith, John Doe, Ada Lovelace',
        venue: 'Computer Vision and Pattern Recognition (CVPR)',
        year: '2022',
        award: '',
        url: '',
        summary: 'A dataset and protocol for measuring reasoning robustness under distribution shift.'
      }
    ],

    // Teaching experience
    teaching: [
      { id: uuidv4(), course: 'CS 231 - Deep Learning for Vision', institution: 'University of California, Berkeley', term: 'Spring 2023, 2024' },
      { id: uuidv4(), course: 'CS 188 - Introduction to Artificial Intelligence', institution: 'University of California, Berkeley', term: 'Fall 2022' }
    ],

    // Invited & selected talks
    talks: [
      { id: uuidv4(), title: 'Learning Representations that Transfer', event: 'Keynote, Vision Workshop at CVPR', date: '2024' },
      { id: uuidv4(), title: 'Scaling Multimodal Models', event: 'Invited Talk, Stanford Vision & Learning Lab', date: '2023' },
      { id: uuidv4(), title: 'Foundations of Robust Perception', event: 'Guest Lecture, MIT', date: '2023' }
    ],

    // Honors & awards
    awards: [
      { id: uuidv4(), title: 'Best Paper Award, NeurIPS', year: '2024', description: 'Awarded to the most outstanding papers as selected by the program committee.' },
      { id: uuidv4(), title: 'Graduate Research Fellowship', year: '2021', description: 'Competitive fellowship supporting early-career researchers.' },
      { id: uuidv4(), title: 'Outstanding Teaching Assistant Award', year: '2020', description: '' }
    ],

    // Academic / professional service
    service: [
      { id: uuidv4(), role: 'Area Chair, CVPR', year: '2024, 2025' },
      { id: uuidv4(), role: 'Reviewer, NeurIPS / ICML / ICLR', year: '2021 - present' },
      { id: uuidv4(), role: 'Workshop Organizer, Robust Vision Workshop', year: '2023' }
    ],

    // Personal details (used by CV-style templates, e.g. Corporate CV)
    personalDetails: {
      fatherName: "Father's Name",
      motherName: "Mother's Name",
      dateOfBirth: '2000-01-01',
      gender: 'Male',
      maritalStatus: 'Unmarried',
      nationality: 'Bangladeshi',
      religion: 'Islam',
      bloodGroup: 'O+',
      permanentAddress: 'Village, Post Office, District',
      currentAddress: 'House, Road, City'
    },

    // Training / workshops
    training: [
      { id: uuidv4(), title: 'Professional Training Program', topic: 'Core Skills', institute: 'Training Institute', location: 'City', year: '2021', duration: '1 month' }
    ],

    // Accomplishments & awards
    accomplishments: [
      { id: uuidv4(), text: 'Recognized for outstanding performance' },
      { id: uuidv4(), text: 'Award / achievement highlight' }
    ],

    // Extra-curricular activities
    extracurricular: [
      { id: uuidv4(), text: 'Volunteer / club / activity' }
    ],

    // References
    references: [
      { id: uuidv4(), name: "Reference Name", title: 'Professor', organization: 'University Name', mobile: '01XXXXXXXXX', email: 'reference@example.com', relation: 'Academic' },
      { id: uuidv4(), name: "Reference Name", title: 'Manager', organization: 'Company Name', mobile: '01XXXXXXXXX', email: 'reference@example.com', relation: 'Professional' }
    ],

    // Declaration (closing statement)
    declaration: {
      text: 'I hereby declare that all the above information is true and correct to the best of my knowledge and belief.',
      place: '',
      date: ''
    },

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
      // Relative type-scale nudges applied on top of fontSize (1 = no change).
      // headingScale -> name + section/entry headings; bodyScale -> summary,
      // descriptions, bullets; detailScale -> tags, dates, small meta.
      headingScale: 1,
      bodyScale: 1,
      detailScale: 1,
      spacing: 'normal',
      showProfileImage: true,
      showLinkIcons: false,
      headerAlign: '', // '' = each template's own default; 'left' | 'center' override it (single-column templates)
      sectionsOrder: [
        'personalInfo',
        'summary',
        'experience',
        'education',
        'publications',
        'teaching',
        'talks',
        'awards',
        'service',
        'skills',
        'projects',
        'certifications',
        'languages',
        'training',
        'accomplishments',
        'extracurricular',
        'personalDetails',
        'references',
        'declaration'
      ],
      sectionsEnabled: {
        personalInfo: true,
        summary: true,
        experience: true,
        education: true,
        publications: true,
        teaching: true,
        talks: true,
        awards: true,
        service: true,
        skills: true,
        projects: true,
        certifications: true,
        languages: true,
        training: true,
        accomplishments: true,
        extracurricular: true,
        personalDetails: true,
        references: true,
        declaration: true
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

    // Custom header links
    addCustomLink(link = {}) {
      this.customLinks.push({ id: uuidv4(), label: '', url: '', ...link })
    },

    updateCustomLink(id, field, value) {
      const l = this.customLinks.find((x) => x.id === id)
      if (l) l[field] = value
    },

    removeCustomLink(id) {
      this.customLinks = this.customLinks.filter((x) => x.id !== id)
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

    // Publications
    addPublication(entry) {
      this.publications.push({ id: uuidv4(), title: '', authors: '', venue: '', year: '', award: '', url: '', summary: '', ...entry })
    },
    updatePublication(id, updates) {
      const i = this.publications.findIndex(p => p.id === id)
      if (i !== -1) this.publications[i] = { ...this.publications[i], ...updates }
    },
    removePublication(id) {
      this.publications = this.publications.filter(p => p.id !== id)
    },

    // Teaching
    addTeaching(entry) {
      this.teaching.push({ id: uuidv4(), course: '', institution: '', term: '', ...entry })
    },
    updateTeaching(id, updates) {
      const i = this.teaching.findIndex(t => t.id === id)
      if (i !== -1) this.teaching[i] = { ...this.teaching[i], ...updates }
    },
    removeTeaching(id) {
      this.teaching = this.teaching.filter(t => t.id !== id)
    },

    // Talks
    addTalk(entry) {
      this.talks.push({ id: uuidv4(), title: '', event: '', date: '', ...entry })
    },
    updateTalk(id, updates) {
      const i = this.talks.findIndex(t => t.id === id)
      if (i !== -1) this.talks[i] = { ...this.talks[i], ...updates }
    },
    removeTalk(id) {
      this.talks = this.talks.filter(t => t.id !== id)
    },

    // Awards / Honors
    addAward(entry) {
      this.awards.push({ id: uuidv4(), title: '', year: '', description: '', ...entry })
    },
    updateAward(id, updates) {
      const i = this.awards.findIndex(a => a.id === id)
      if (i !== -1) this.awards[i] = { ...this.awards[i], ...updates }
    },
    removeAward(id) {
      this.awards = this.awards.filter(a => a.id !== id)
    },

    // Academic / professional service
    addService(entry) {
      this.service.push({ id: uuidv4(), role: '', year: '', ...entry })
    },
    updateService(id, updates) {
      const i = this.service.findIndex(s => s.id === id)
      if (i !== -1) this.service[i] = { ...this.service[i], ...updates }
    },
    removeService(id) {
      this.service = this.service.filter(s => s.id !== id)
    },

    // Personal Details
    updatePersonalDetail(field, value) {
      this.personalDetails[field] = value
    },

    // Training
    addTraining(entry) {
      this.training.push({ id: uuidv4(), title: '', topic: '', institute: '', location: '', year: '', duration: '', ...entry })
    },
    updateTraining(id, updates) {
      const i = this.training.findIndex(t => t.id === id)
      if (i !== -1) this.training[i] = { ...this.training[i], ...updates }
    },
    removeTraining(id) {
      this.training = this.training.filter(t => t.id !== id)
    },

    // Accomplishments
    addAccomplishment(entry) {
      this.accomplishments.push({ id: uuidv4(), text: '', ...entry })
    },
    updateAccomplishment(id, updates) {
      const i = this.accomplishments.findIndex(a => a.id === id)
      if (i !== -1) this.accomplishments[i] = { ...this.accomplishments[i], ...updates }
    },
    removeAccomplishment(id) {
      this.accomplishments = this.accomplishments.filter(a => a.id !== id)
    },

    // Extra-curricular
    addExtracurricular(entry) {
      this.extracurricular.push({ id: uuidv4(), text: '', ...entry })
    },
    updateExtracurricular(id, updates) {
      const i = this.extracurricular.findIndex(e => e.id === id)
      if (i !== -1) this.extracurricular[i] = { ...this.extracurricular[i], ...updates }
    },
    removeExtracurricular(id) {
      this.extracurricular = this.extracurricular.filter(e => e.id !== id)
    },

    // References
    addReference(entry) {
      this.references.push({ id: uuidv4(), name: '', title: '', organization: '', mobile: '', email: '', relation: '', ...entry })
    },
    updateReference(id, updates) {
      const i = this.references.findIndex(r => r.id === id)
      if (i !== -1) this.references[i] = { ...this.references[i], ...updates }
    },
    removeReference(id) {
      this.references = this.references.filter(r => r.id !== id)
    },

    // Declaration
    updateDeclaration(field, value) {
      this.declaration[field] = value
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
        customLinks: this.customLinks,
        skills: this.skills,
        experience: this.experience,
        education: this.education,
        projects: this.projects,
        certifications: this.certifications,
        languages: this.languages,
        publications: this.publications,
        teaching: this.teaching,
        talks: this.talks,
        awards: this.awards,
        service: this.service,
        personalDetails: this.personalDetails,
        training: this.training,
        accomplishments: this.accomplishments,
        extracurricular: this.extracurricular,
        references: this.references,
        declaration: this.declaration,
        settings: this.settings
      }, null, 2)
    },

    importData(jsonData) {
      try {
        const data = JSON.parse(jsonData)
        if (data.personalInfo) this.personalInfo = data.personalInfo
        if (data.customLinks) this.customLinks = data.customLinks
        if (data.skills) this.skills = data.skills
        if (data.experience) this.experience = data.experience
        if (data.education) this.education = data.education
        if (data.projects) this.projects = data.projects
        if (data.certifications) this.certifications = data.certifications
        if (data.languages) this.languages = data.languages
        if (data.publications) this.publications = data.publications
        if (data.teaching) this.teaching = data.teaching
        if (data.talks) this.talks = data.talks
        if (data.awards) this.awards = data.awards
        if (data.service) this.service = data.service
        if (data.personalDetails) this.personalDetails = { ...this.personalDetails, ...data.personalDetails }
        if (data.training) this.training = data.training
        if (data.accomplishments) this.accomplishments = data.accomplishments
        if (data.extracurricular) this.extracurricular = data.extracurricular
        if (data.references) this.references = data.references
        if (data.declaration) this.declaration = { ...this.declaration, ...data.declaration }
        if (data.settings) {
          const s = data.settings
          this.settings = {
            ...this.settings,
            ...s,
            colorScheme: { ...this.settings.colorScheme, ...(s.colorScheme || {}) },
            sectionsEnabled: { ...this.settings.sectionsEnabled, ...(s.sectionsEnabled || {}) }
          }
        }
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