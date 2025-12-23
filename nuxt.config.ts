// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/icon'],
  css: ['~/assets/styles/main.scss'],

  icon: {
    // Use Lucide icons (same as original Next.js site)
    serverBundle: 'remote',
  },

  app: {
    head: {
      title: 'Blich Studio | Stop Motion & Handmade Games',
      meta: [
        { name: 'description', content: 'Crafting tactile stop-motion animations and games with soul. Where clay meets code.' },
        { name: 'theme-color', content: '#1E1A26' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-icon.png' },
        // Google Fonts
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap' },
      ],
      htmlAttrs: {
        lang: 'en',
        class: 'dark', // Start in dark mode like original
      },
    },
  },

  runtimeConfig: {
    public: {
      // Set this in your environment: API_URL
      apiUrl: process.env.API_URL || ''
    }
  }
})
