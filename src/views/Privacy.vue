<template>
  <LegalLayout title="Privacy and your data" updated="July 2026">
    <p class="lead">
      Resume Builder has no accounts and no server. Everything you create stays in your own browser.
      Here is exactly how that works, in plain language.
    </p>

    <h2>Where your data lives</h2>
    <p>
      Everything you type - your resume, biodata, or cover letter - is saved in your browser's
      local storage on this device. It is never sent to us, because there is no server or database
      to send it to. We could not read your documents if we wanted to.
    </p>

    <h2>Why your work is still there after a reload</h2>
    <p>
      Because it is saved in this browser, your documents persist across page reloads, and they
      stay even after you close the browser and open it again later. When you come back on the
      <strong>same browser and the same device</strong>, your work is right where you left it. That
      is normal and expected - it is not stored anywhere online.
    </p>

    <h2>When your data could disappear</h2>
    <p>Since it lives only in this browser, it can be lost in these situations:</p>
    <ul>
      <li>You open the site in a <strong>different browser or on a different device</strong> - your documents will not be there.</li>
      <li>You <strong>clear your browsing data / site data</strong> for this site.</li>
      <li>You use a <strong>private or incognito window</strong> - it is discarded when that window closes.</li>
      <li>Your browser <strong>evicts local storage</strong> to free up space (uncommon, but possible).</li>
    </ul>
    <p>
      So for anything important, keep your own backup: use <strong>Download</strong> (PDF or Word) for
      a finished copy, or <strong>Export Data</strong> to save a JSON file you can re-import anytime.
    </p>

    <h2>What we never do</h2>
    <ul>
      <li>No account, email, or sign-up is required.</li>
      <li>No analytics, ads, or third-party tracking.</li>
      <li>No tracking or advertising cookies. Your documents and theme preference use functional
        local storage that stays on your device.</li>
      <li>We do not collect, sell, or share your personal information - there is nothing to opt out of,
        because we never receive it.</li>
    </ul>

    <h2>You are in control</h2>
    <p>
      You can keep multiple documents, export and import your data as JSON, and delete any document
      at any time from the document menu. Clearing your browser data removes everything instantly.
    </p>

    <h2>Open source</h2>
    <p>
      Resume Builder is open source under the MIT License. You do not have to take our word for any of
      this - you can read exactly what the app does on
      <a class="link" href="https://github.com/mrahmanashiq/mra-resume-builder" target="_blank" rel="noopener">GitHub</a>.
    </p>

    <p class="note">
      This page explains how the app handles your data. It describes the app's behaviour and is not
      legal advice.
    </p>
  </LegalLayout>
</template>

<script>
import LegalLayout from '../components/LegalLayout.vue'

export default {
  name: 'PrivacyPage',
  components: { LegalLayout }
}
</script>
