import { defineAsyncComponent } from 'vue'
import { useBiodataStore } from '../stores/biodata'
import {
  UserIcon,
  SparklesIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  UsersIcon,
  PhoneIcon,
  HeartIcon,
  CogIcon
} from '@heroicons/vue/24/outline'

/**
 * Marriage Biodata document config. Implements the same shell interface as the
 * résumé config - DocumentEditorShell renders it without any biodata-specific
 * knowledge.
 */
export const biodataConfig = {
  type: 'biodata',
  headerTitle: 'MRA Biodata Builder',
  sidebarTitle: 'Edit Biodata',
  documentLabel: 'Biodata',
  previewElementId: 'biodata-preview',
  useStore: useBiodataStore,
  baseName: (store) => store.fullName,
  template: defineAsyncComponent(() => import('../components/biodata/templates/BiodataTemplate.vue')),
  navSections: [
    { id: 'personalInfo', name: 'Personal Info', icon: UserIcon, editor: defineAsyncComponent(() => import('../components/biodata/sections/BiodataPersonalInfoEditor.vue')) },
    { id: 'lifestyle', name: 'Hobbies & Habits', icon: SparklesIcon, editor: defineAsyncComponent(() => import('../components/biodata/sections/BiodataLifestyleEditor.vue')) },
    { id: 'education', name: 'Education', icon: AcademicCapIcon, editor: defineAsyncComponent(() => import('../components/biodata/sections/BiodataEducationEditor.vue')) },
    { id: 'professional', name: 'Professional', icon: BriefcaseIcon, editor: defineAsyncComponent(() => import('../components/biodata/sections/BiodataProfessionalEditor.vue')) },
    { id: 'family', name: 'Family', icon: UsersIcon, editor: defineAsyncComponent(() => import('../components/biodata/sections/BiodataFamilyEditor.vue')) },
    { id: 'contact', name: 'Contact', icon: PhoneIcon, editor: defineAsyncComponent(() => import('../components/biodata/sections/BiodataContactEditor.vue')) },
    { id: 'preferences', name: 'Preferences', icon: HeartIcon, editor: defineAsyncComponent(() => import('../components/biodata/sections/BiodataPreferencesEditor.vue')) },
    { id: 'settings', name: 'Settings', icon: CogIcon, editor: defineAsyncComponent(() => import('../components/biodata/sections/BiodataSettingsEditor.vue')) }
  ]
}
