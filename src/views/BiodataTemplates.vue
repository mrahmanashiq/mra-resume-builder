<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <router-link to="/" class="text-xl font-bold text-primary-600">
            Resume Builder
          </router-link>
          <router-link to="/biodata" class="btn-primary">
            Open Editor
          </router-link>
        </div>
      </div>
    </nav>

    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h1 class="text-3xl font-bold text-gray-900 mb-3">Biodata Templates</h1>
          <p class="text-lg text-gray-600">
            Formal matrimonial layouts. Every template is fully recolorable.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div v-for="template in templates"
               :key="template.id"
               class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
            <div class="h-56 p-5 bg-gradient-to-br" :class="template.gradient">
              <div class="bg-white/95 rounded h-full p-4 flex flex-col">
                <div class="text-center border-b-2 pb-2 mb-3" :style="{ borderColor: template.accent }">
                  <span class="font-extrabold tracking-widest text-sm" :style="{ color: template.accent }">
                    MARRIAGE BIODATA
                  </span>
                </div>
                <div class="rounded text-white text-xs font-bold px-2 py-1 mb-2 inline-block"
                     :style="{ background: template.accent }">
                  Personal Information
                </div>
                <div class="space-y-1.5">
                  <div class="h-1.5 bg-gray-200 rounded w-3/4"></div>
                  <div class="h-1.5 bg-gray-200 rounded w-2/3"></div>
                  <div class="h-1.5 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-gray-900 mb-1">{{ template.name }}</h3>
              <p class="text-sm text-gray-600 mb-4">{{ template.description }}</p>
              <router-link to="/biodata" class="btn-outline w-full text-center block">
                Use This Template
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'BiodataTemplates',
  data() {
    return {
      templates: [
        {
          id: 'elegant',
          name: 'Elegant',
          description: 'Formal matrimonial layout with sectioned details.',
          gradient: 'from-rose-700 to-red-900',
          accent: '#a61c3c'
        }
      ]
    }
  }
}
</script>
