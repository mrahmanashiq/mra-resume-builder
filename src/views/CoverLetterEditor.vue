<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 no-print dark:bg-slate-800 dark:border-slate-700">
      <div class="w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16 gap-2">
          <div class="flex items-center space-x-3 min-w-0">
            <router-link to="/" class="flex items-center"><AppLogo /></router-link>
            <DocumentSwitcher :store="store" type="coverLetter" label="Cover Letter" />
          </div>
          <div class="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <button @click="store.togglePreviewMode()" class="btn-outline lg:hidden flex items-center gap-1.5 text-sm px-3 py-2">
              <EyeIcon class="w-4 h-4" /> {{ store.ui.previewMode ? 'Edit' : 'Preview' }}
            </button>
            <button @click="printDoc" class="btn-outline hidden sm:flex items-center gap-1.5">
              <PrinterIcon class="w-4 h-4" /> <span class="hidden md:inline">Print</span>
            </button>
            <button @click="downloadPdf" class="btn-primary flex items-center gap-1.5">
              <CloudArrowDownIcon class="w-4 h-4" /> <span class="hidden sm:inline">Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="flex flex-col lg:flex-row">
      <!-- Form -->
      <aside v-if="!store.ui.previewMode" class="no-print w-full lg:w-[26rem] lg:flex-none border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 space-y-5 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
        <div>
          <h2 class="section-title mb-3">Your details</h2>
          <div class="grid grid-cols-1 gap-3">
            <input v-model="store.sender.name" class="input-field" placeholder="Your name" />
            <input v-model="store.sender.email" class="input-field" placeholder="Email" />
            <input v-model="store.sender.phone" class="input-field" placeholder="Phone" />
            <input v-model="store.sender.location" class="input-field" placeholder="Location" />
          </div>
        </div>

        <div>
          <h2 class="section-title mb-3">Recipient</h2>
          <div class="grid grid-cols-1 gap-3">
            <input v-model="store.date" class="input-field" placeholder="Date" />
            <input v-model="store.recipient.name" class="input-field" placeholder="Hiring manager name (optional)" />
            <input v-model="store.recipient.title" class="input-field" placeholder="Their title (optional)" />
            <input v-model="store.recipient.company" class="input-field" placeholder="Company" />
            <input v-model="store.recipient.address" class="input-field" placeholder="Company address (optional)" />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-3">
            <h2 class="section-title mb-0">Letter</h2>
            <button type="button" @click="generateFromResume"
                    class="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300">
              <SparklesIcon class="w-4 h-4" /> Generate from resume
            </button>
          </div>
          <div class="grid grid-cols-1 gap-3">
            <input v-model="store.greeting" class="input-field" placeholder="Greeting" />
            <textarea v-model="store.body" rows="10" class="textarea-field" placeholder="Body (separate paragraphs with a blank line)"></textarea>
            <input v-model="store.closing" class="input-field" placeholder="Closing" />
            <input v-model="store.signature" class="input-field" placeholder="Signature (your name)" />
          </div>
        </div>
      </aside>

      <!-- Preview -->
      <main class="flex-1 p-4 sm:p-8 flex justify-center lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
        <div id="cover-letter-preview" class="letter-sheet">
          <div class="letter-sender">
            <p class="letter-name">{{ store.sender.name || 'Your Name' }}</p>
            <p class="letter-contact">{{ senderContact }}</p>
          </div>

          <p v-if="store.date" class="letter-date">{{ store.date }}</p>

          <div v-if="hasRecipient" class="letter-recipient">
            <p v-if="store.recipient.name">{{ store.recipient.name }}</p>
            <p v-if="store.recipient.title">{{ store.recipient.title }}</p>
            <p v-if="store.recipient.company">{{ store.recipient.company }}</p>
            <p v-if="store.recipient.address">{{ store.recipient.address }}</p>
          </div>

          <p class="letter-greeting">{{ store.greeting }}</p>

          <p v-for="(para, i) in bodyParagraphs" :key="i" class="letter-body">{{ para }}</p>

          <div class="letter-closing">
            <p>{{ store.closing }}</p>
            <p class="letter-signature">{{ store.signature || store.sender.name }}</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { useToast } from 'vue-toastification'
import { EyeIcon, PrinterIcon, CloudArrowDownIcon, SparklesIcon } from '@heroicons/vue/24/outline'
import { useCoverLetterStore } from '../stores/coverLetter'
import { useResumeStore } from '../stores/resume'
import { exportToPDF } from '../utils/pdfExport'
import { generateCoverLetter } from '../utils/coverLetterGen'
import AppLogo from '../components/AppLogo.vue'
import DocumentSwitcher from '../components/editor/DocumentSwitcher.vue'

export default {
  name: 'CoverLetterEditor',
  components: { AppLogo, DocumentSwitcher, EyeIcon, PrinterIcon, CloudArrowDownIcon, SparklesIcon },
  setup() {
    return { store: useCoverLetterStore(), toast: useToast() }
  },
  computed: {
    senderContact() {
      return [this.store.sender.email, this.store.sender.phone, this.store.sender.location].filter(Boolean).join('  |  ')
    },
    hasRecipient() {
      const r = this.store.recipient
      return !!(r.name || r.title || r.company || r.address)
    },
    bodyParagraphs() {
      return (this.store.body || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
    }
  },
  mounted() {
    this.prefillFromResume()
  },
  methods: {
    prefillFromResume() {
      // Only fill blanks, so we never overwrite what the user typed.
      const resume = useResumeStore()
      const p = resume.personalInfo || {}
      const fullName = (resume.fullName || `${p.firstName || ''} ${p.lastName || ''}`).trim()
      if (!this.store.sender.name && fullName) this.store.sender.name = fullName
      if (!this.store.sender.email && p.email) this.store.sender.email = p.email
      if (!this.store.sender.phone && p.phone) this.store.sender.phone = p.phone
      if (!this.store.sender.location && p.address) this.store.sender.location = p.address
    },
    generateFromResume() {
      const resume = useResumeStore()
      this.prefillFromResume()
      this.store.body = generateCoverLetter(resume, this.store.recipient.company)
      if (!this.store.signature) this.store.signature = this.store.sender.name
      this.toast.success('Draft generated from your resume. Personalize it before sending.')
    },
    printDoc() {
      window.print()
    },
    async downloadPdf() {
      const base = (this.store.sender.name || 'Cover_Letter').trim().replace(/\s+/g, '_')
      try {
        this.toast.info('Generating PDF... Please wait')
        await exportToPDF('cover-letter-preview', `${base}_Cover_Letter.pdf`)
        this.toast.success('Cover letter exported as PDF!')
      } catch (e) {
        console.error('Error exporting cover letter PDF:', e)
        this.toast.error('Failed to export PDF')
      }
    }
  }
}
</script>

<style scoped src="./CoverLetterEditor.css"></style>
