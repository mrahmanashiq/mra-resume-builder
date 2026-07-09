import { resumeConfig } from './resume.config'
import { biodataConfig } from './biodata.config'

/**
 * The single place that knows every document type. Adding a new document type
 * (e.g. Academic CV) means adding its config here - no changes to the shell,
 * the export composable, or any existing document's code.
 */
export const documents = {
  [resumeConfig.type]: resumeConfig,
  [biodataConfig.type]: biodataConfig
}

export function getDocumentConfig(type) {
  return documents[type] || null
}

/**
 * Metadata for the Home launcher. `available: false` renders a "coming soon"
 * card to signal the roadmap without wiring up a route yet.
 */
export const documentCatalog = [
  {
    type: 'resume',
    name: 'Professional Resume',
    description: 'ATS-friendly résumé for job applications.',
    route: '/editor',
    available: true,
    gradient: 'from-blue-600 to-purple-600',
    icon: 'DocumentTextIcon'
  },
  {
    type: 'biodata',
    name: 'Marriage Biodata',
    description: 'Formal matrimonial biodata with family details.',
    route: '/biodata',
    available: true,
    gradient: 'from-rose-700 to-red-900',
    icon: 'HeartIcon'
  },
  {
    type: 'cv',
    name: 'Academic CV',
    description: 'Detailed CV for researchers and teachers.',
    route: '/editor',
    template: 'researcher',
    available: true,
    gradient: 'from-emerald-600 to-teal-700',
    icon: 'AcademicCapIcon'
  }
]
