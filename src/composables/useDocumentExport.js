import { exportToPDF } from '../utils/pdfExport'
import { saveAs } from 'file-saver'

/**
 * Document-agnostic export/print/share/import behaviour.
 *
 * Shared by every document type (résumé, biodata, future CV). Knows nothing about
 * a specific document — it operates purely through the passed-in store and config.
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

  function printDocument() {
    window.print()
  }

  function shareDocument() {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      toast.success(`${label} link copied to clipboard!`)
    })
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

  return { downloadPDF, printDocument, shareDocument, downloadData, importData }
}
