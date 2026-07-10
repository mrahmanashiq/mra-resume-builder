import { exportToPDF, exportToImage } from '../utils/pdfExport'
import { exportResumePDF, exportResumeWord, exportResumeText } from '../utils/textExport'
import { saveAs } from 'file-saver'

/**
 * Document-agnostic export/print/share/import behaviour.
 *
 * Shared by every document type (résumé, biodata, future CV). Knows nothing about
 * a specific document - it operates purely through the passed-in store and config.
 *
 * @param {Object}   options
 * @param {Object}   options.store            Pinia store exposing exportData()/importData(json)
 * @param {string}   options.previewElementId DOM id of the node to capture for PDF
 * @param {Function} options.baseName         () => string, used to build filenames
 * @param {string}   options.label            Human label, e.g. 'Resume' | 'Biodata'
 * @param {Object}   options.toast            vue-toastification instance
 */
export function useDocumentExport({ store, previewElementId, baseName, label, toast }) {
  const safeBase = () => (baseName() || label).trim().replace(/\s+/g, '_') || label

  async function downloadPDF() {
    try {
      toast.info('Generating PDF... Please wait')
      await exportToPDF(previewElementId, `${safeBase()}_${label}.pdf`)
      toast.success(`${label} exported as PDF successfully!`)
      return true
    } catch (error) {
      console.error('Error exporting PDF:', error)
      toast.error('Failed to export PDF')
      return false
    }
  }

  async function downloadImage(format = 'png') {
    const type = format === 'jpg' ? 'image/jpeg' : 'image/png'
    const ext = format === 'jpg' ? 'jpg' : 'png'
    const upper = ext.toUpperCase()
    try {
      toast.info(`Generating ${upper}... Please wait`)
      await exportToImage(previewElementId, `${safeBase()}_${label}.${ext}`, type)
      toast.success(`${label} exported as ${upper} successfully!`)
      return true
    } catch (error) {
      console.error(`Error exporting ${upper}:`, error)
      toast.error(`Failed to export ${upper}`)
      return false
    }
  }

  async function downloadTextPDF() {
    try {
      toast.info('Generating text PDF... Please wait')
      await exportResumePDF(store, `${safeBase()}_${label}_ATS.pdf`)
      toast.success('Selectable-text PDF exported!')
      return true
    } catch (error) {
      console.error('Error exporting text PDF:', error)
      toast.error('Failed to export text PDF')
      return false
    }
  }

  function downloadWord() {
    try {
      exportResumeWord(store, `${safeBase()}_${label}.doc`)
      toast.success('Word document exported!')
      return true
    } catch (error) {
      console.error('Error exporting Word:', error)
      toast.error('Failed to export Word document')
      return false
    }
  }

  function downloadText() {
    try {
      exportResumeText(store, `${safeBase()}_${label}.txt`)
      toast.success('Plain text exported!')
      return true
    } catch (error) {
      console.error('Error exporting text:', error)
      toast.error('Failed to export plain text')
      return false
    }
  }

  function printDocument() {
    window.print()
  }

  function downloadData() {
    const data = store.exportData()
    const blob = new Blob([data], { type: 'application/json' })
    saveAs(blob, `${safeBase()}_${label.toLowerCase()}_data.json`)
    toast.success(`${label} data exported successfully!`)
  }

  function importData(jsonString) {
    if (store.importData(jsonString)) {
      toast.success(`${label} data imported successfully!`)
      return true
    }
    toast.error('Invalid JSON data. Please check your input.')
    return false
  }

  return { downloadPDF, downloadImage, downloadTextPDF, downloadWord, downloadText, printDocument, downloadData, importData }
}
