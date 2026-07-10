<template>
  <LegalLayout title="Terms of use" updated="July 2026">
    <p class="lead">
      Resume Builder is a free, open source tool. In short: it is provided as is, you own
      everything you create, and we store nothing about you.
    </p>

    <h2>What Resume Builder is</h2>
    <p>
      Resume Builder is a free tool for creating resumes, marriage biodata, and cover letters
      entirely in your browser. There is no account and no server. It is open source under the MIT
      License, and the source is available on
      <a class="link" href="https://github.com/mrahmanashiq/mra-resume-builder" target="_blank" rel="noopener">GitHub</a>.
    </p>

    <h2>Your content is yours</h2>
    <p>
      Everything you create is yours. It is stored only in your own browser and is never uploaded to
      us, so we do not receive it, claim any rights to it, or use it in any way. See the
      <router-link class="link" to="/privacy">Privacy page</router-link> for how your data is handled.
    </p>

    <h2>Keep your own backups</h2>
    <p>
      Because your work lives only in your browser, it can be lost if you clear your browser data,
      use a private window, or switch devices. Please export a copy of anything important
      (Download as PDF or Word, or Export Data as JSON). We are not able to recover lost data,
      because we never had it.
    </p>

    <h2>Acceptable use</h2>
    <ul>
      <li>Use the tool lawfully and provide truthful information in your own documents.</li>
      <li>Use of the source code is governed by the MIT License.</li>
      <li>Do not attempt to use the app to harm others or misrepresent it as your own service.</li>
    </ul>

    <h2>No warranty</h2>
    <p>
      The app and its templates are provided "as is", without warranties of any kind, and without a
      guarantee of any particular outcome (for example, being shortlisted for a job or a match). To
      the extent permitted by law, we are not liable for any loss arising from using the app,
      including lost data. Your use of the software is governed by the MIT License.
    </p>

    <h2>Changes</h2>
    <p>
      As an open source project, Resume Builder evolves over time and features may change. Continued
      use of the app means you accept the current version of these terms.
    </p>

    <h2>Contact</h2>
    <p>
      Questions or issues? Open an issue on
      <a class="link" href="https://github.com/mrahmanashiq/mra-resume-builder/issues" target="_blank" rel="noopener">GitHub</a>.
    </p>

    <p class="note">
      This page describes the terms of using the app in plain language and is not legal advice.
    </p>
  </LegalLayout>
</template>

<script>
import LegalLayout from '../components/LegalLayout.vue'

export default {
  name: 'TermsPage',
  components: { LegalLayout }
}
</script>
