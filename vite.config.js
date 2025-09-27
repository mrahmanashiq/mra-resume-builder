import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core Vue chunks
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // UI components and icons
          'ui-vendor': ['@headlessui/vue', '@heroicons/vue', 'vue-toastification'],
          // Utility libraries
          'utils-vendor': ['date-fns', 'uuid', 'file-saver'],
          // Drag and drop functionality
          'drag-vendor': ['vuedraggable'],
          // Color picker (only loaded when needed)
          'color-vendor': ['vue-color-kit'],
          // Document parsers (only loaded when needed)
          'parser-vendor': ['mammoth', 'papaparse']
          // Note: pdf-vendor removed to enable lazy loading
        }
      }
    }
  }
})
