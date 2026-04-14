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
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Blich Studio | Stop Motion & Handmade Games' },
        { property: 'og:description', content: 'Crafting tactile stop-motion animations and games with soul. Where clay meets code.' },
        { property: 'og:image', content: 'https://blichstudio.com/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:url', content: 'https://blichstudio.com' },
        { property: 'og:site_name', content: 'Blich Studio' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Blich Studio | Stop Motion & Handmade Games' },
        { name: 'twitter:description', content: 'Crafting tactile stop-motion animations and games with soul. Where clay meets code.' },
        { name: 'twitter:image', content: 'https://blichstudio.com/og-image.png' },
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
    // Server-side only (used by proxy)
    apiUrl: process.env.NUXT_API_URL || process.env.NUXT_PUBLIC_API_URL || '',
    public: {
      // Client-side accessible
      apiUrl: process.env.NUXT_PUBLIC_API_URL || ''
    }
  }
})
