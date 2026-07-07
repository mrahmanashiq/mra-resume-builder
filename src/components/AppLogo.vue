<template>
  <span class="app-logo">
    <svg class="app-logo__mark" viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient :id="gradId" x1="4" y1="3" x2="28" y2="29" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#3b82f6" />
          <stop offset="1" stop-color="#1d4ed8" />
        </linearGradient>
      </defs>
      <path d="M8 2.5h9.5L26 11v16.5A2.5 2.5 0 0 1 23.5 30h-15A2.5 2.5 0 0 1 6 27.5v-22A2.5 2.5 0 0 1 8 2.5Z"
            :fill="`url(#${gradId})`" />
      <path d="M17.5 2.5 26 11h-6a2 2 0 0 1-2-2V2.5Z" fill="#ffffff" fill-opacity="0.38" />
      <rect x="10.5" y="14" width="11" height="2.2" rx="1.1" fill="#ffffff" />
      <rect x="10.5" y="18.4" width="11" height="2.2" rx="1.1" fill="#ffffff" />
      <rect x="10.5" y="22.8" width="7" height="2.2" rx="1.1" fill="#ffffff" fill-opacity="0.78" />
    </svg>
    <span v-if="title" class="app-logo__text">{{ title }}</span>
  </span>
</template>

<script>
let uid = 0

export default {
  name: 'AppLogo',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    uid += 1
    return { gradId: `app-logo-grad-${uid}` }
  }
}
</script>

<style scoped>
.app-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.app-logo__mark {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  display: block;
}

.app-logo__text {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.01em;
  color: #1d4ed8;
  white-space: nowrap;
}
</style>
