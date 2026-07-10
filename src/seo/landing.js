/**
 * Content + SEO for keyword landing pages. Each entry is rendered by
 * LandingPage.vue and drives a FAQPage + HowTo JSON-LD block. Keep copy honest
 * (no fabricated metrics; label unbuilt features "planned"/"coming soon").
 */
export const LANDING_PAGES = {
  'marriage-biodata-format': {
    slug: 'marriage-biodata-format',
    seo: {
      title: 'Marriage Biodata Format - What to Include & Free Maker - MRA Builder',
      description:
        'A clear marriage biodata format with the sections to include: personal, family, education, profession, and partner preferences. Fill it in and download a free print-ready PDF.'
    },
    h1: 'Marriage Biodata Format: What to Include and How to Make One',
    intro:
      'A marriage biodata is a one-page matrimonial profile widely used across Bangladesh and India to introduce a prospective bride or groom. A good format is easy to read and covers personal, family, education, and career details, plus what you are looking for in a partner. Here is a simple format you can fill in and download for free.',
    ctaLabel: 'Create your marriage biodata',
    ctaRoute: '/biodata',
    stepsHeading: 'How to make a marriage biodata',
    steps: [
      { name: 'Add personal details', text: 'Full name, date of birth, height, complexion, religion, and marital status.' },
      { name: 'Add family information', text: "Parents' names and occupations, siblings, and family background." },
      { name: 'Add education and profession', text: 'Highest qualifications and your current job or business.' },
      { name: 'State partner preferences', text: 'What you are looking for in a life partner, kept brief and respectful.' },
      { name: 'Pick a template and download', text: 'Choose a design, add a photo, and download a print-ready PDF.' }
    ],
    tipsHeading: 'Tips for a good biodata',
    tips: [
      'Keep it to a single page so it is easy to share and print.',
      'Add a clear, recent photo.',
      'Be honest with every detail.',
      'Include a guardian or contact number so families can reach you.'
    ],
    faqs: [
      { q: 'What is a marriage biodata?', a: 'A marriage biodata is a concise matrimonial profile that introduces a prospective bride or groom with their personal, family, education, and career details.' },
      { q: 'What details should a marriage biodata include?', a: 'Personal details (name, date of birth, height, religion), family information, education and profession, and a short note on partner preferences.' },
      { q: 'Is this marriage biodata maker free?', a: 'Yes. It is completely free with no sign-up and no watermark, and your data stays in your browser.' },
      { q: 'Can I make a biodata in Bengali or Hindi?', a: 'The interface is currently in English, and you can type your details in any language. A Bengali and Hindi interface is planned.' }
    ]
  },

  'software-engineer-resume-template': {
    slug: 'software-engineer-resume-template',
    seo: {
      title: 'Software Engineer Resume Template - Free & ATS-Friendly - MRA Builder',
      description:
        'A free, ATS-friendly software engineer resume template. Add a summary, quantified experience, a skills section, and projects, then export to PDF or Word.'
    },
    h1: 'Software Engineer Resume Template (Free, ATS-Friendly)',
    intro:
      'A strong software engineer resume is clean, keyword-aware, and easy for an applicant tracking system to parse. It leads with a concise summary, shows impact with numbers, and lists the languages, frameworks, and tools you actually use. Start from a free ATS-friendly template and tailor it to each role.',
    ctaLabel: 'Build your resume',
    ctaRoute: '/editor',
    stepsHeading: 'How to write a software engineer resume',
    steps: [
      { name: 'Start with a clean ATS template', text: 'Pick a single-column, ATS-friendly layout so parsers read every section.' },
      { name: 'Write a concise summary', text: 'Two or three lines on your focus, seniority, and strongest skills.' },
      { name: 'Show impact in experience', text: 'Use action verbs and quantify results (latency, scale, revenue, users).' },
      { name: 'Add a skills section', text: 'Group languages, frameworks, and tools so recruiters and ATS find them.' },
      { name: 'Include projects and links', text: 'Add notable projects and a GitHub or portfolio link.' },
      { name: 'Export to PDF or Word', text: 'Download a selectable-text PDF or an editable Word document.' }
    ],
    tipsHeading: 'Tips that pass ATS',
    tips: [
      'Use standard section headings like Experience, Education, and Skills.',
      'Quantify achievements instead of listing responsibilities.',
      'Mirror keywords from the job description where they are genuinely true.',
      'Keep it to one page early-career, up to two for senior roles.'
    ],
    faqs: [
      { q: 'Is this resume builder ATS-friendly?', a: 'Yes. The templates are clean and single-column, and you can export a selectable-text PDF that an applicant tracking system can read.' },
      { q: 'Is it free?', a: 'Yes. It is free with no sign-up and no watermark.' },
      { q: 'Can I export my resume to Word?', a: 'Yes. You can export an editable Word (.doc) file as well as PDF, PNG, and JPG.' },
      { q: 'How long should a software engineer resume be?', a: 'One page for early-career engineers, and up to two pages for senior or highly experienced candidates.' }
    ]
  },

  'free-ats-resume-builder': {
    slug: 'free-ats-resume-builder',
    seo: {
      title: 'Free ATS Resume Builder - No Sign-Up - MRA Builder',
      description:
        'A free, private ATS resume builder with no sign-up and no watermark. Pick an ATS-friendly template, edit with a live preview, and download a selectable-text PDF or Word file.'
    },
    h1: 'Free ATS Resume Builder - No Sign-Up, No Watermark',
    intro:
      'An applicant tracking system (ATS) scans resumes before a human sees them, so a resume that parses cleanly matters. This builder is free and open source, needs no account, and keeps your data in your browser. Choose an ATS-friendly template, fill it in with a live preview, and download a selectable-text PDF that parses well.',
    ctaLabel: 'Start your free resume',
    ctaRoute: '/editor',
    stepsHeading: 'How to build an ATS-friendly resume',
    steps: [
      { name: 'Pick an ATS-friendly template', text: 'Start from a clean, single-column layout with standard headings.' },
      { name: 'Fill in your details', text: 'Add your experience, education, and skills with a live preview.' },
      { name: 'Keep formatting simple', text: 'Avoid heavy graphics or tables that parsers struggle with.' },
      { name: 'Download a selectable-text PDF', text: 'Export a text-based PDF (or Word) that an ATS can read.' }
    ],
    tipsHeading: 'ATS tips',
    tips: [
      'Use the selectable-text PDF export rather than an image-only PDF.',
      'Stick to standard section names so parsers map them correctly.',
      'Match relevant keywords from the job posting.',
      'Avoid putting key details only inside images or icons.'
    ],
    faqs: [
      { q: 'Is it really free?', a: 'Yes. It is free and open source under the MIT license, with no paywall and no watermark.' },
      { q: 'Do I need to sign up?', a: 'No. There is no account and no email required. You can start immediately.' },
      { q: 'Is my data private?', a: 'Yes. There is no server and no database. Everything you enter stays in your own browser.' },
      { q: 'What is an ATS?', a: 'An applicant tracking system is software employers use to collect and scan resumes. An ATS-friendly resume is formatted so this software can read it correctly.' }
    ]
  }
}

export function getLandingPage(slug) {
  return LANDING_PAGES[slug] || null
}

/** JSON-LD (HowTo + FAQPage) for a landing page, emitted via useHead. */
export function landingJsonLd(page, absoluteUrl) {
  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: page.stepsHeading,
    step: page.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text
    }))
  }
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  }
  return [howTo, faq]
}
