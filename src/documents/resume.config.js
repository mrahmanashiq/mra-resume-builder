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
  CogIcon,
  IdentificationIcon,
  SparklesIcon,
  UserGroupIcon,
  BookOpenIcon,
  PresentationChartBarIcon,
  MicrophoneIcon,
  StarIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/vue/24/outline'

/**
 * Résumé document config. Implements the shared shell interface so
 * DocumentEditorShell can render it without knowing anything résumé-specific.
 */
export const resumeConfig = {
  type: 'resume',
  headerTitle: 'Resume Builder',
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
    { id: 'publications', name: 'Publications', icon: BookOpenIcon, editor: defineAsyncComponent(() => import('../components/sections/PublicationsEditor.vue')) },
    { id: 'teaching', name: 'Teaching', icon: PresentationChartBarIcon, editor: defineAsyncComponent(() => import('../components/sections/TeachingEditor.vue')) },
    { id: 'talks', name: 'Invited Talks', icon: MicrophoneIcon, editor: defineAsyncComponent(() => import('../components/sections/TalksEditor.vue')) },
    { id: 'awards', name: 'Honors & Awards', icon: StarIcon, editor: defineAsyncComponent(() => import('../components/sections/HonorsEditor.vue')) },
    { id: 'service', name: 'Academic Service', icon: ClipboardDocumentCheckIcon, editor: defineAsyncComponent(() => import('../components/sections/ServiceEditor.vue')) },
    { id: 'skills', name: 'Skills', icon: WrenchScrewdriverIcon, editor: defineAsyncComponent(() => import('../components/sections/SkillsEditor.vue')) },
    { id: 'projects', name: 'Projects', icon: FolderIcon, editor: defineAsyncComponent(() => import('../components/sections/ProjectsEditor.vue')) },
    { id: 'certifications', name: 'Certifications', icon: TrophyIcon, editor: defineAsyncComponent(() => import('../components/sections/CertificationsEditor.vue')) },
    { id: 'languages', name: 'Languages', icon: LanguageIcon, editor: defineAsyncComponent(() => import('../components/sections/LanguagesEditor.vue')) },
    { id: 'training', name: 'Training', icon: AcademicCapIcon, editor: defineAsyncComponent(() => import('../components/sections/TrainingEditor.vue')) },
    { id: 'personalDetails', name: 'Personal Details', icon: IdentificationIcon, editor: defineAsyncComponent(() => import('../components/sections/PersonalDetailsEditor.vue')) },
    { id: 'references', name: 'References', icon: UserGroupIcon, editor: defineAsyncComponent(() => import('../components/sections/ReferencesEditor.vue')) },
    { id: 'extras', name: 'Activities & More', icon: SparklesIcon, editor: defineAsyncComponent(() => import('../components/sections/ExtrasEditor.vue')) },
    { id: 'settings', name: 'Settings', icon: CogIcon, editor: defineAsyncComponent(() => import('../components/sections/SettingsEditor.vue')) }
  ]
}
