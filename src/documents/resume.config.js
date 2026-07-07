import { defineAsyncComponent } from 'vue'
import { useResumeStore } from '../stores/resume'
import {
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  FolderIcon,
  TrophyIcon,
  LanguageIcon,
  CogIcon
} from '@heroicons/vue/24/outline'

/**
 * Résumé document config. Implements the shared shell interface so
 * DocumentEditorShell can render it without knowing anything résumé-specific.
 */
export const resumeConfig = {
  type: 'resume',
  headerTitle: 'MRA Resume Builder',
  sidebarTitle: 'Edit Resume',
  documentLabel: 'Resume',
  previewElementId: 'resume-preview',
  useStore: useResumeStore,
  baseName: (store) => store.fullName,
  template: defineAsyncComponent(() => import('../components/templates/ResumeTemplate.vue')),
  navSections: [
    { id: 'personalInfo', name: 'Personal Info', icon: UserIcon, editor: defineAsyncComponent(() => import('../components/sections/PersonalInfoEditor.vue')) },
    { id: 'experience', name: 'Experience', icon: BriefcaseIcon, editor: defineAsyncComponent(() => import('../components/sections/ExperienceEditor.vue')) },
    { id: 'education', name: 'Education', icon: AcademicCapIcon, editor: defineAsyncComponent(() => import('../components/sections/EducationEditor.vue')) },
    { id: 'skills', name: 'Skills', icon: WrenchScrewdriverIcon, editor: defineAsyncComponent(() => import('../components/sections/SkillsEditor.vue')) },
    { id: 'projects', name: 'Projects', icon: FolderIcon, editor: defineAsyncComponent(() => import('../components/sections/ProjectsEditor.vue')) },
    { id: 'certifications', name: 'Certifications', icon: TrophyIcon, editor: defineAsyncComponent(() => import('../components/sections/CertificationsEditor.vue')) },
    { id: 'languages', name: 'Languages', icon: LanguageIcon, editor: defineAsyncComponent(() => import('../components/sections/LanguagesEditor.vue')) },
    { id: 'settings', name: 'Settings', icon: CogIcon, editor: defineAsyncComponent(() => import('../components/sections/SettingsEditor.vue')) }
  ]
}
