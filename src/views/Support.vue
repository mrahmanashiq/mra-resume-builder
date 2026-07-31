<template>
  <LegalLayout title="Support this project">
    <p class="lead">
      Resume Builder is a free, open source project (MIT), with no accounts, no ads, and no
      tracking. Donations are completely optional. They go toward the running costs, like the
      domain and hosting, and the time spent maintaining the app and adding new features.
    </p>

    <div class="support-widget no-print">
      <DonationOptions />
    </div>

    <h2>Other ways to help</h2>
    <p>
      Donations are optional and always will be. If crypto is not for you, you can still
      help a lot: star the project on
      <a class="link" :href="githubUrl" target="_blank" rel="noopener">GitHub</a>,
      <a class="link" :href="githubUrl + '/issues'" target="_blank" rel="noopener">report a bug or suggest a feature</a>,
      or simply share it with someone who is job hunting.
    </p>

    <p class="note">Thank you for supporting free, open source software.</p>
  </LegalLayout>
</template>

<script>
import LegalLayout from '../components/LegalLayout.vue'
import DonationOptions from '../components/DonationOptions.vue'

export default {
  name: 'SupportPage',
  components: { LegalLayout, DonationOptions },
  data() {
    return {
      githubUrl: 'https://github.com/mrahmanashiq/mra-resume-builder'
    }
  }
}
</script>

<style scoped src="./Support.css"></style>
