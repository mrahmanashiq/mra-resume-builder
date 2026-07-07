<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <AppLogo title="MRA Builder" />
          </div>
          <div class="flex items-center space-x-4">
            <router-link to="/templates" class="btn-outline">
              Templates
            </router-link>
            <a href="#choose" class="btn-primary">
              Get Started
            </a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="py-20 lg:py-32">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-4xl mx-auto">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            Build Your Professional
            <span class="text-primary-600">Resume</span>
            in Minutes
          </h1>
          <p class="text-xl text-gray-600 mb-8 animate-slide-up">
            Create stunning, ATS-friendly resumes with our modern, intuitive builder. 
            Choose from professional templates and customize everything to match your style.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center animate-bounce-in">
            <a href="#choose" class="btn-primary text-lg px-8 py-3">
              Start Building Now
            </a>
            <router-link to="/templates" class="btn-outline text-lg px-8 py-3">
              Browse Templates
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Document Type Launcher -->
    <section id="choose" class="py-16 bg-white border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">What do you want to build?</h2>
          <p class="text-lg text-gray-600">
            One builder for résumés, marriage biodata, and more — coming step by step.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <component :is="doc.available ? 'router-link' : 'div'"
                     v-for="doc in documentCatalog"
                     :key="doc.type"
                     :to="doc.available ? doc.route : undefined"
                     :class="['relative rounded-xl shadow-sm border overflow-hidden transition-all duration-300',
                              doc.available
                                ? 'border-gray-200 hover:shadow-lg cursor-pointer'
                                : 'border-gray-200 opacity-70 cursor-not-allowed']">
            <div class="h-32 bg-gradient-to-br" :class="doc.gradient"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-xl font-semibold text-gray-900">{{ doc.name }}</h3>
                <span v-if="!doc.available"
                      class="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  Coming soon
                </span>
              </div>
              <p class="text-gray-600">{{ doc.description }}</p>
            </div>
          </component>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Stand Out
          </h2>
          <p class="text-lg text-gray-600">
            Powerful features to help you create a resume that gets noticed
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.id" 
               class="card text-center hover:shadow-lg transition-shadow duration-300">
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <component :is="feature.icon" class="w-6 h-6 text-primary-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              {{ feature.title }}
            </h3>
            <p class="text-gray-600">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Templates Preview -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Professional Templates
          </h2>
          <p class="text-lg text-gray-600">
            Choose from our carefully crafted templates designed by professionals
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="template in templates" :key="template.id" 
               class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
            <div class="h-48 bg-gradient-to-br" :class="template.gradient">
              <div class="p-4 text-white">
                <div class="h-3 bg-white/30 rounded mb-2"></div>
                <div class="h-2 bg-white/20 rounded mb-1"></div>
                <div class="h-2 bg-white/20 rounded mb-4"></div>
                <div class="grid grid-cols-3 gap-2">
                  <div class="h-1 bg-white/20 rounded"></div>
                  <div class="h-1 bg-white/20 rounded"></div>
                  <div class="h-1 bg-white/20 rounded"></div>
                </div>
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-gray-900 mb-1">{{ template.name }}</h3>
              <p class="text-sm text-gray-600">{{ template.description }}</p>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-12">
          <router-link to="/templates" class="btn-primary">
            View All Templates
          </router-link>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-primary-600">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-white mb-4">
          Ready to Build Your Perfect Resume?
        </h2>
        <p class="text-xl text-primary-100 mb-8">
          Join thousands of professionals who have landed their dream jobs with our resume builder.
        </p>
        <router-link to="/editor" class="bg-white text-primary-600 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
          Start Building for Free
        </router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h3 class="text-xl font-bold mb-4">MRA Resume Builder</h3>
          <p class="text-gray-400 mb-4">
            Build professional resumes that get you hired
          </p>
          <div class="flex justify-center space-x-6">
            <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">Privacy</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">Terms</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">Support</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { PaintBrushIcon, DocumentTextIcon, CloudArrowDownIcon, ShareIcon, EyeIcon, PrinterIcon } from '@heroicons/vue/24/outline'
import { documentCatalog } from '../documents/registry'
import AppLogo from '../components/AppLogo.vue'

export default {
  name: 'Home',
  components: {
    AppLogo,
    PaintBrushIcon,
    DocumentTextIcon,
    CloudArrowDownIcon,
    ShareIcon,
    EyeIcon,
    PrinterIcon
  },
  data() {
    return {
      documentCatalog,
      features: [
        {
          id: 1,
          title: 'Professional Templates',
          description: 'Choose from beautifully designed templates that showcase your skills and experience.',
          icon: 'PaintBrushIcon'
        },
        {
          id: 2,
          title: 'ATS-Friendly',
          description: 'All templates are optimized to pass through Applicant Tracking Systems.',
          icon: 'DocumentTextIcon'
        },
        {
          id: 3,
          title: 'Export Options',
          description: 'Download your resume as PDF, print directly, or share with a custom link.',
          icon: 'CloudArrowDownIcon'
        },
        {
          id: 4,
          title: 'Real-time Preview',
          description: 'See your changes instantly as you build your resume with live preview.',
          icon: 'EyeIcon'
        },
        {
          id: 5,
          title: 'Easy Sharing',
          description: 'Share your resume online with employers or save it to cloud storage.',
          icon: 'ShareIcon'
        },
        {
          id: 6,
          title: 'Print Ready',
          description: 'Perfectly formatted for printing with proper page breaks and margins.',
          icon: 'PrinterIcon'
        }
      ],
      templates: [
        {
          id: 1,
          name: 'Modern Professional',
          description: 'Clean and contemporary design',
          gradient: 'from-blue-600 to-purple-600'
        },
        {
          id: 2,
          name: 'Creative',
          description: 'Perfect for creative industries',
          gradient: 'from-pink-500 to-orange-500'
        },
        {
          id: 3,
          name: 'Executive',
          description: 'Sophisticated for senior roles',
          gradient: 'from-gray-700 to-gray-900'
        },
        {
          id: 4,
          name: 'Minimalist',
          description: 'Simple and elegant design',
          gradient: 'from-teal-500 to-green-500'
        }
      ]
    }
  }
}
</script>