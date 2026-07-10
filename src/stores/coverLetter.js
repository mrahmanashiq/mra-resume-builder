import { defineStore } from 'pinia'

/**
 * Cover letter store. A cover letter is a simple single-form document that
 * pairs with a resume; the sender block can be prefilled from the resume.
 * Implements exportData()/importData() so it works with the document manager
 * and the shared persistence plugin (same interface as resume/biodata).
 */
export const useCoverLetterStore = defineStore('coverLetter', {
  state: () => ({
    sender: { name: '', email: '', phone: '', location: '' },
    date: '',
    recipient: { name: '', title: '', company: '', address: '' },
    greeting: 'Dear Hiring Manager,',
    body:
      'I am writing to express my interest in the [role] position at [company]. With my background in [field], I am confident I can contribute to your team.\n\nIn my current role I have [key achievement]. I am drawn to [company] because [reason], and I would welcome the chance to bring the same impact to your work.\n\nThank you for considering my application. I would be glad to discuss how my experience fits your needs.',
    closing: 'Sincerely,',
    signature: '',
    ui: { previewMode: false }
  }),
  actions: {
    togglePreviewMode() {
      this.ui.previewMode = !this.ui.previewMode
    },

    exportData() {
      return JSON.stringify({
        sender: this.sender,
        date: this.date,
        recipient: this.recipient,
        greeting: this.greeting,
        body: this.body,
        closing: this.closing,
        signature: this.signature
      }, null, 2)
    },

    importData(jsonData) {
      try {
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData
        if (data.sender) this.sender = { ...this.sender, ...data.sender }
        if (typeof data.date === 'string') this.date = data.date
        if (data.recipient) this.recipient = { ...this.recipient, ...data.recipient }
        if (typeof data.greeting === 'string') this.greeting = data.greeting
        if (typeof data.body === 'string') this.body = data.body
        if (typeof data.closing === 'string') this.closing = data.closing
        if (typeof data.signature === 'string') this.signature = data.signature
        return true
      } catch (error) {
        console.error('Error importing cover letter:', error)
        return false
      }
    }
  }
})
