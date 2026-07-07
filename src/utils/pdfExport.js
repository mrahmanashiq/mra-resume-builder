// PDF utilities with dynamic loading
import { saveAs } from 'file-saver'

let html2canvas = null
let jsPDF = null

export const loadPDFLibraries = async () => {
  if (!html2canvas || !jsPDF) {
    const [html2canvasModule, jsPDFModule] = await Promise.all([
      import('html2canvas'),
      import('jspdf')
    ])
    
    html2canvas = html2canvasModule.default
    jsPDF = jsPDFModule.default
  }
  
  return { html2canvas, jsPDF }
}

export const exportToPDF = async (elementId, filename = 'resume.pdf') => {
  const { html2canvas, jsPDF } = await loadPDFLibraries()
  
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error('Element not found')
  }

  // html2canvas positions text by baseline (lower than the browser), so templates
  // can use `.pdf-export` overrides to compensate only while capturing.
  element.classList.add('pdf-export')

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    const imgWidth = 210
    const pageHeight = 295
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(filename)
    return true
  } catch (error) {
    console.error('PDF export error:', error)
    throw error
  } finally {
    element.classList.remove('pdf-export')
  }
}

// Export the same rendered element as a PNG or JPG image.
export const exportToImage = async (elementId, filename, type = 'image/png') => {
  const { html2canvas } = await loadPDFLibraries()

  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error('Element not found')
  }

  element.classList.add('pdf-export')

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    })

    const quality = type === 'image/jpeg' ? 0.92 : undefined
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, quality))
    if (!blob) {
      throw new Error('Failed to render image')
    }
    saveAs(blob, filename)
    return true
  } catch (error) {
    console.error('Image export error:', error)
    throw error
  } finally {
    element.classList.remove('pdf-export')
  }
}