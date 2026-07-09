# Project conventions — MRA Builder

Instructions for anyone (human or AI) working in this repo.

## Writing style

- **No em-dashes (`—`). Ever. Anywhere.** Not in UI copy, template output, comments, docs, or commit messages. Use a hyphen `-` (spaced, ` - `, when separating clauses) or rephrase. En-dashes (`–`) are allowed only inside date ranges (e.g. "Jan 2022 – Present").
  - Quick check before committing: `grep -rn "—" src index.html` must return nothing.
- No fabricated metrics (ratings, download counts, "join thousands"). Keep marketing claims truthful.
- Features that are not implemented yet must be labelled "Coming soon" (e.g. link sharing / cloud storage), not presented as working.

## Product positioning

- MRA Builder is **free and open source** (MIT). Keep that messaging; do not add "Pro"/"Free"/premium tiers or badges to templates.
- Repo: https://github.com/mrahmanashiq/mra-resume-builder · Author: Mizanur Rahman Ashiq (https://mrahmanashiq.vercel.app)

## Tech notes

- Vue 3 (Options API), Vite, Pinia, Tailwind. Two document types (resume, biodata) share `DocumentEditorShell` via `src/documents/registry.js` configs.
- PDF/PNG/JPG export uses html2canvas + jsPDF (`src/utils/pdfExport.js`). html2canvas draws text lower than the browser, so templates compensate with `.pdf-export`-scoped CSS only during capture. Avoid filled heading bars / tables that rely on vertical centering; prefer border-bottom headings, inline `•` bullets, and `background-size: cover` for photos.
