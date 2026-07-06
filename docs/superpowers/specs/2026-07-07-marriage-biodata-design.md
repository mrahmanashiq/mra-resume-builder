# Marriage Biodata — Design Spec

**Date:** 2026-07-07
**Branch:** `feature/marriage-biodata`
**Status:** Approved, implementing

## Vision

Evolve MRA Resume Builder from a single-purpose résumé tool into a **multi-document
builder**, added to gradually:

- ✅ **Now:** Professional Résumé (existing) + Marriage Biodata (this work)
- 🔜 **Later (drop-ins):** Academic CV (researcher/teacher), and more

## Guiding constraint (from user)

**Nothing tightly coupled.** Biodata must not import from or depend on the résumé
store. The editor shell must not know "résumé" or "biodata" specifically — it is
driven by a **document config**. Adding a future document type must require *zero*
changes to shared code (shell, export composable, existing document code).

## Architecture — document-agnostic shell + registry

Both résumé and biodata are peers, each described by a config that implements one
shared interface. A generic shell renders any config.

```
src/
  documents/
    registry.js            # single place listing all document types + launcher metadata
    resume.config.js       # résumé config (wraps existing store/editors/template)
    biodata.config.js      # biodata config
  composables/
    useDocumentExport.js    # PDF / print / share / JSON import-export (extracted, generic)
  components/
    editor/
      DocumentEditorShell.vue  # generic chrome: header, sidebar nav, editor slot, preview, export menu
    biodata/
      sections/                # 6 biodata section editors
      templates/
        BiodataTemplate.vue        # selector wrapper (mirrors ResumeTemplate)
        ElegantBiodataTemplate.vue # maroon formal layout matching the reference PDF
  stores/
    biodata.js               # independent Pinia store; shares NO state with resume.js
  views/
    Editor.vue               # thin wrapper: passes resumeConfig into shell
    BiodataEditor.vue        # thin wrapper: passes biodataConfig into shell
    BiodataTemplates.vue     # biodata template gallery
```

### The shell↔document interface (the decoupling contract)

```js
// documents/*.config.js
{
  type,                 // 'resume' | 'biodata'
  headerTitle,          // brand text in header
  sidebarTitle,         // e.g. 'Edit Biodata'
  documentLabel,        // used in toasts + filenames, e.g. 'Biodata'
  previewElementId,     // DOM id of preview node for PDF capture
  useStore,             // () => Pinia store
  baseName(store),      // () => string, used for export filenames
  template,             // async template component
  navSections: [ { id, name, icon, editor } ]  // icon = component, editor = async component
}
```

The shell depends only on this shape — never on résumé or biodata directly.
Any store used by the shell must expose the UI interface:
`ui.{currentSection, previewMode, sidebarCollapsed}` +
`setCurrentSection / togglePreviewMode / toggleSidebar` + `exportData() / importData(json)`.

## Biodata data model (store shape)

- **personalInfo:** fullName, dateOfBirth, height, weight, complexion, bloodGroup,
  religion, hobby, presentAddress, permanentAddress, nationality, motherTongue,
  sect, maritalStatus, photo
- **education:** `[{ id, degree, year, institute, result }]`
- **professional:** profession, company, experience, income
- **family:** father `{name, profession, education}`, mother `{name, profession, education}`,
  siblings `[{id, name, relation, occupation, maritalStatus}]`,
  paternalUncles (Chacha) `[{id, name, occupation}]`,
  maternalUncles (Mama) `[{id, name, occupation}]`, homeDistrict
- **contact:** phone, guardianPhone, email
- **preferences:** expectations
- **settings:** template, colorScheme (maroon default), font, fontSize, showPhoto,
  sectionsOrder, sectionsEnabled, fieldsEnabled (toggleable extras)
- **ui:** currentSection, previewMode, sidebarCollapsed, theme

Core fields come from the reference PDF; extras (nationality, motherTongue, sect,
income, siblings, homeDistrict, guardianPhone, email) are toggleable via
`settings.fieldsEnabled`. Whole sections are reorderable + enable/disable, matching
the résumé pattern. Photo is optional (`settings.showPhoto`, default off).

## Template

**ElegantBiodataTemplate** matches the reference PDF: centered "MARRIAGE BIODATA"
title, maroon section-header bars, label/value rows, bordered education table, and a
Chacha/Mama family layout. Recolorable via the existing `--primary`/`--secondary`
CSS-variable system (users are not locked to maroon).

## Navigation, data, export

- **Home:** launcher cards — Résumé (`/editor`), Marriage Biodata (`/biodata`), and a
  disabled "Academic CV — coming soon" to signal the roadmap.
- **Routes:** `/biodata` (editor), `/biodata/templates` (gallery). `/editor` behavior
  unchanged.
- **Data:** in-memory + own JSON import/export (mirrors résumé; no cross-contamination).
- **Export:** reuses the generic `exportToPDF(elementId, filename)` via
  `useDocumentExport`. Filename e.g. `Name_Biodata.pdf`.

## Out of scope (YAGNI)

- Academic CV document type (later drop-in; architecture leaves room, no code now).
- Test framework (project currently has none; verify via running app + build).
- localStorage persistence (résumé doesn't have it either; not added now).
- App rename ("Resume Builder" → "Document Builder") — deferred.

## Risk

The one place touching working code is refactoring `Editor.vue` to use the shared
shell. Résumé behavior must be preserved exactly; verified by running the app after.
